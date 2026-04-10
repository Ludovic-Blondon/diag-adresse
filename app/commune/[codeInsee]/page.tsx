import Link from "next/link";
import { notFound } from "next/navigation";
import { DiagnosticDashboard } from "@/components/diagnostic-dashboard";
import { generateCommuneMetadata } from "@/lib/seo";
import { TOP_COMMUNES } from "@/lib/communes";
import { AddressSearch } from "@/components/address-search";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { placeJsonLd } from "@/lib/json-ld";
import { BASE_URL } from "@/lib/constants";
import { RISK_NAV } from "@/lib/navigation";
import { getDepartementCode, DEPARTEMENTS } from "@/lib/departements";

export const revalidate = 604800; // 7 days

interface Props {
  params: Promise<{ codeInsee: string }>;
}

async function getCommuneInfo(codeInsee: string) {
  const known = TOP_COMMUNES.find((c) => c.code === codeInsee);
  if (known) return known;
  // Try reverse geocode with a rough center — fallback
  return { code: codeInsee, name: `Commune ${codeInsee}` };
}

export async function generateMetadata({ params }: Props) {
  const { codeInsee } = await params;
  const commune = await getCommuneInfo(codeInsee);
  return generateCommuneMetadata(codeInsee, commune.name);
}

export default async function CommunePage({ params }: Props) {
  const { codeInsee } = await params;
  const commune = await getCommuneInfo(codeInsee);

  // Get approximate center via reverse geocode of the commune
  // For now, use a simple approach: geocode the commune name
  const { autocomplete } = await import("@/lib/apis/geocode");
  const results = await autocomplete(commune.name, 1);
  const center = results[0];

  if (!center) {
    notFound();
  }

  const depCode = getDepartementCode(codeInsee);
  const depName = DEPARTEMENTS[depCode];

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 space-y-6">
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
      <div>
        <Breadcrumbs
          items={[
            ...(depName
              ? [{ name: depName, href: `/departement/${depCode}` }]
              : []),
            { name: commune.name, href: `/commune/${codeInsee}` },
          ]}
        />
        <h1 className="text-2xl font-bold mt-2">{commune.name}</h1>
        <p className="text-sm text-muted-foreground">
          Code INSEE : {codeInsee}
        </p>
      </div>

      <AddressSearch placeholder="Affiner avec une adresse precise..." />

      <DiagnosticDashboard
        lon={center.lon}
        lat={center.lat}
        citycode={codeInsee}
      />

      <section>
        <h2 className="text-lg font-semibold mb-3">
          En savoir plus sur les risques
        </h2>
        <div className="flex flex-wrap gap-2">
          {RISK_NAV.map((risk) => (
            <Link
              key={risk.type}
              href={`/risque/${risk.type}`}
              className="rounded-full border px-3 py-1 text-sm hover:bg-accent transition-colors"
            >
              {risk.label}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
