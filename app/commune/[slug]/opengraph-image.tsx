import { ImageResponse } from "next/og";
import communesIndex from "@/lib/communes-index.json";
import { communePath, parseCommuneParam } from "@/lib/commune-url";
import { API_TIMEOUT_MS } from "@/lib/constants";

export const alt = "Diagnostic commune";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COMMUNE_NAMES = new Map<string, string>(
  communesIndex as [string, string][],
);

// Prérend les 2280 communes du sitemap, et non les seules 40 les plus visitées :
// les requêtes d'images OG viennent surtout des crawlers, qui parcourent le
// sitemap uniformément et ne suivent donc pas la distribution du trafic humain.
// Une image prérendue est servie sans invoquer de fonction, y compris après la
// purge du cache ISR que Vercel effectue à chaque déploiement.
// Le nom vient de communes-index.json : ce prérendu ne coûte aucun appel d'API
// externe au build, uniquement du rendu satori.
export function generateStaticParams() {
  return communesIndex.map(([code, nom]) => ({
    slug: communePath(code, nom).split("/").pop()!,
  }));
}

async function resolveCommuneName(codeInsee: string): Promise<string> {
  const indexed = COMMUNE_NAMES.get(codeInsee);
  if (indexed) return indexed;
  // Hors index (communes < 5000 hab.) : repli sur l'API, mis en cache 30 j.
  try {
    const res = await fetch(
      `https://geo.api.gouv.fr/communes/${codeInsee}?fields=nom`,
      {
        signal: AbortSignal.timeout(API_TIMEOUT_MS),
        next: { revalidate: 2592000 }, // 30 days, same as lib/apis/geo-gouv.ts
      },
    );
    if (res.ok) {
      const data: { nom: string } = await res.json();
      return data.nom;
    }
  } catch {
    // fallback below
  }
  return `Commune ${codeInsee}`;
}

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const parsed = parseCommuneParam(slug);
  const codeInsee = parsed.kind === "other" ? slug : parsed.insee;
  const label = await resolveCommuneName(codeInsee);

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "#09090b",
        color: "#fafafa",
        fontFamily: "sans-serif",
        padding: "60px",
      }}
    >
      <div
        style={{
          fontSize: 32,
          fontWeight: 700,
          marginBottom: 24,
          color: "#a1a1aa",
        }}
      >
        DiagAdresse
      </div>
      <div
        style={{
          fontSize: 48,
          fontWeight: 700,
          textAlign: "center",
          lineHeight: 1.3,
          maxWidth: "80%",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 24,
          marginTop: 32,
          color: "#a1a1aa",
        }}
      >
        {"Risques • Eau • Énergie"}
      </div>
    </div>,
    { ...size },
  );
}
