import Link from "next/link";
import { notFound } from "next/navigation";
import { DiagnosticDashboard } from "@/components/diagnostic-dashboard";
import { generateCommuneMetadata } from "@/lib/seo";
import { TOP_COMMUNES, type TopCommune } from "@/lib/communes";
import { AddressSearch } from "@/components/address-search";
import { CommuneHeader } from "@/components/commune-header";
import { placeJsonLd } from "@/lib/json-ld";
import { BASE_URL } from "@/lib/constants";
import { getDepartementCode, DEPARTEMENTS } from "@/lib/departements";
import { getTopCommunesForDepartement } from "@/lib/regions";

export const revalidate = 604800; // 7 days

export function generateStaticParams() {
  return TOP_COMMUNES.map((c) => ({ codeInsee: c.code }));
}

interface Props {
  params: Promise<{ codeInsee: string }>;
}

type CommuneInfo =
  | ({ kind: "known" } & TopCommune)
  | { kind: "unknown"; code: string; name: string };

function getCommuneInfo(codeInsee: string): CommuneInfo {
  const known = TOP_COMMUNES.find((c) => c.code === codeInsee);
  if (known) return { kind: "known", ...known };
  return { kind: "unknown", code: codeInsee, name: `Commune ${codeInsee}` };
}

export async function generateMetadata({ params }: Props) {
  const { codeInsee } = await params;
  const commune = getCommuneInfo(codeInsee);
  return generateCommuneMetadata(codeInsee, commune.name);
}

export default async function CommunePage({ params }: Props) {
  const { codeInsee } = await params;
  const commune = getCommuneInfo(codeInsee);

  let center: { lat: number; lon: number } | undefined;
  if (commune.kind === "known") {
    center = { lat: commune.lat, lon: commune.lon };
  } else {
    const { autocomplete } = await import("@/lib/apis/geocode");
    const results = await autocomplete(commune.name, 1);
    center = results[0];
  }

  if (!center) {
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
              latitude: center.lat,
              longitude: center.lon,
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
        lon={center.lon}
        lat={center.lat}
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
