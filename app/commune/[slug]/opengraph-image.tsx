import { ImageResponse } from "next/og";
import { TOP_COMMUNES } from "@/lib/communes";
import { communePath, parseCommuneParam } from "@/lib/commune-url";
import { API_TIMEOUT_MS } from "@/lib/constants";

export const alt = "Diagnostic commune";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Sans generateStaticParams, un segment dynamique n'est pas énumérable au build
// et l'image part en rendu à la demande : satori la recalcule après chaque
// déploiement, puisque Vercel purge le cache ISR à chaque deploy. Or l'image ne
// contient que le nom de la commune — rien qui justifie de la régénérer. On
// prérend donc la même liste que la page (voir page.tsx), qui couvre les
// communes les plus visitées ; le reste reste à la demande, puis mis en cache.
export function generateStaticParams() {
  return TOP_COMMUNES.map((c) => ({
    slug: communePath(c.code, c.name).split("/").pop()!,
  }));
}

async function resolveCommuneName(codeInsee: string): Promise<string> {
  const known = TOP_COMMUNES.find((c) => c.code === codeInsee);
  if (known) return known.name;
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
