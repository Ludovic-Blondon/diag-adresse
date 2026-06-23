import type { Metadata } from "next";
import { cache } from "react";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { DiagnosticDashboard } from "@/components/diagnostic-dashboard";
import { generateCommuneMetadata } from "@/lib/seo";
import { TOP_COMMUNES } from "@/lib/communes";
import { AddressSearch } from "@/components/address-search";
import { CommuneHeader } from "@/components/commune-header";
import { PostalDisambiguation } from "@/components/postal-disambiguation";
import { placeJsonLd } from "@/lib/json-ld";
import { BASE_URL } from "@/lib/constants";
import { getDepartementCode, DEPARTEMENTS } from "@/lib/departements";
import { getTopCommunesForDepartement } from "@/lib/regions";
import { communePath, parseCommuneParam } from "@/lib/commune-url";
import {
  getCommuneByInseeCode,
  getCommunesByPostalCode,
  type CommuneLookup,
  type PostalCommune,
} from "@/lib/apis/geo-gouv";

export const revalidate = 604800; // 7 days

export function generateStaticParams() {
  return TOP_COMMUNES.map((c) => ({
    slug: communePath(c.code, c.name).split("/").pop()!,
  }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

const getCommuneInfo = cache(
  async (codeInsee: string): Promise<CommuneLookup | null> => {
    const known = TOP_COMMUNES.find((c) => c.code === codeInsee);
    if (known) return known;
    return getCommuneByInseeCode(codeInsee);
  },
);

const getPostalMatches = cache(getCommunesByPostalCode);

type CommuneResolution =
  | { type: "render"; commune: CommuneLookup; codeInsee: string }
  | { type: "redirect"; to: string }
  | { type: "postal"; matches: PostalCommune[]; codeInsee: string }
  | { type: "notFound" };

/**
 * Resolve a `/commune/[slug]` param to a render directive. Memoised so
 * generateMetadata and the page share one resolution. Redirect/notFound are
 * returned as data and applied by the callers (not thrown here), keeping those
 * control-flow signals at the route's top level.
 */
const resolveCommune = cache(
  async (slug: string): Promise<CommuneResolution> => {
    const parsed = parseCommuneParam(slug);
    if (parsed.kind === "other") return { type: "notFound" };

    const codeInsee = parsed.insee;
    const commune = await getCommuneInfo(codeInsee);

    if (parsed.kind === "sluggedInsee") {
      if (!commune) return { type: "notFound" };
      const canonical = communePath(codeInsee, commune.name);
      if (`/commune/${slug}` !== canonical)
        return { type: "redirect", to: canonical };
      return { type: "render", commune, codeInsee };
    }

    // Bare INSEE code (or postal code): canonicalise to the slug URL.
    if (commune) {
      return { type: "redirect", to: communePath(codeInsee, commune.name) };
    }

    const matches = await getPostalMatches(codeInsee);
    if (matches.length === 1 && matches[0].code !== codeInsee) {
      return {
        type: "redirect",
        to: communePath(matches[0].code, matches[0].name),
      };
    }
    if (matches.length > 1) return { type: "postal", matches, codeInsee };
    return { type: "notFound" };
  },
);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const resolution = await resolveCommune(slug);
  if (resolution.type === "redirect") permanentRedirect(resolution.to);
  if (resolution.type === "notFound") notFound();
  if (resolution.type === "postal") {
    return {
      title: `Plusieurs communes pour le code postal ${resolution.codeInsee}`,
      robots: { index: false },
    };
  }
  return generateCommuneMetadata(
    resolution.codeInsee,
    resolution.commune.name,
    getDepartementCode(resolution.codeInsee),
  );
}

export default async function CommunePage({ params }: Props) {
  const { slug } = await params;
  const resolution = await resolveCommune(slug);
  if (resolution.type === "redirect") permanentRedirect(resolution.to);
  if (resolution.type === "notFound") notFound();

  if (resolution.type === "postal") {
    return (
      <PostalDisambiguation
        codeInsee={resolution.codeInsee}
        matches={resolution.matches}
      />
    );
  }

  const { commune, codeInsee } = resolution;
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
              description: `Diagnostic complet de ${commune.name} : risques naturels, qualité de l'eau, performance énergétique.`,
              latitude: commune.lat,
              longitude: commune.lon,
              url: `${BASE_URL}${communePath(codeInsee, commune.name)}`,
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

      <AddressSearch placeholder="Affiner avec une adresse précise..." />

      <DiagnosticDashboard
        lon={commune.lon}
        lat={commune.lat}
        citycode={codeInsee}
        communeName={commune.name}
      />

      {siblingCommunes.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">
            Autres communes {depName ? `en ${depName}` : "du département"}
          </h2>
          <div className="flex flex-wrap gap-2">
            {siblingCommunes.map((c) => (
              <Link
                key={c.code}
                href={communePath(c.code, c.name)}
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
