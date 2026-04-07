import { ImageResponse } from "next/og";
import { autocomplete } from "@/lib/apis/geocode";
import { slugToQuery } from "@/lib/slug";

export const runtime = "edge";
export const alt = "Diagnostic adresse";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const query = slugToQuery(slug);
  const results = await autocomplete(query, 1);
  const label = results[0]?.label ?? query;

  return new ImageResponse(
    (
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
          {"Risques • Eau • Energie"}
        </div>
      </div>
    ),
    { ...size },
  );
}
