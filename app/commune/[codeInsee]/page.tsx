import type { Metadata } from "next";
import { cache } from "react";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { DiagnosticDashboard } from "@/components/diagnostic-dashboard";
import { generateCommuneMetadata } from "@/lib/seo";
import { TOP_COMMUNES } from "@/lib/communes";
import { AddressSearch } from "@/components/address-search";
import { CommuneHeader } from "@/components/commune-header";
import { placeJsonLd } from "@/lib/json-ld";
import { BASE_URL } from "@/lib/constants";
import { getDepartementCode, DEPARTEMENTS } from "@/lib/departements";
import { getTopCommunesForDepartement } from "@/lib/regions";
import {
  getCommuneByInseeCode,
  getInseeCodeByPostalCode,
  type CommuneLookup,
} from "@/lib/apis/geo-gouv";

export const revalidate = 604800; // 7 days

export function generateStaticParams() {
  return TOP_COMMUNES.map((c) => ({ codeInsee: c.code }));
}

interface Props {
  params: Promise<{ codeInsee: string }>;
}

const getCommuneInfo = cache(
  async (codeInsee: string): Promise<CommuneLookup | null> => {
    const known = TOP_COMMUNES.find((c) => c.code === codeInsee);
    if (known) return known;
    return getCommuneByInseeCode(codeInsee);
  },
);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { codeInsee } = await params;
  const commune = await getCommuneInfo(codeInsee);
  if (!commune) {
    return { title: "Commune introuvable", robots: { index: false } };
  }
  return generateCommuneMetadata(codeInsee, commune.name);
}

export default async function CommunePage({ params }: Props) {
  const { codeInsee } = await params;
  const commune = await getCommuneInfo(codeInsee);

  if (!commune) {
    const inseeFromPostal = await getInseeCodeByPostalCode(codeInsee);
    if (inseeFromPostal && inseeFromPostal !== codeInsee) {
      permanentRedirect(`/commune/${inseeFromPostal}`);
    }
    notFound();
  }

  const depCode = getDepartementCode(codeInsee);
  const depName = DEPARTEMENTS[depCode];
  const siblingCommunes = getTopCommunesForDepartement(depCode)
    .filter((c) => c.code !== codeInsee)
    .slice(0, 8);

  return (
    <main className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            placeJsonLd({
              name: commune.name,
              description: `Diagnostic complet de ${commune.name} : risques naturels, qualite de l'eau, performance energetique.`,
              latitude: commune.lat,
              longitude: commune.lon,
              url: `${BASE_URL}/commune/${codeInsee}`,
            }),
          ),
        }}
      />
      <CommuneHeader
        name={commune.name}
        codeInsee={codeInsee}
        depCode={depCode}
        depName={depName}
      />

      <AddressSearch placeholder="Affiner avec une adresse precise..." />

      <DiagnosticDashboard
        lon={commune.lon}
        lat={commune.lat}
        citycode={codeInsee}
      />

      {siblingCommunes.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">
            Autres communes {depName ? `en ${depName}` : "du departement"}
          </h2>
          <div className="flex flex-wrap gap-2">
            {siblingCommunes.map((c) => (
              <Link
                key={c.code}
                href={`/commune/${c.code}`}
                className="hover:bg-accent rounded-full border px-3 py-1 text-sm transition-colors"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
