import { ImageResponse } from "next/og";
import { TOP_COMMUNES } from "@/lib/communes";

export const runtime = "edge";
export const alt = "Diagnostic commune";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({
  params,
}: {
  params: Promise<{ codeInsee: string }>;
}) {
  const { codeInsee } = await params;
  const known = TOP_COMMUNES.find((c) => c.code === codeInsee);
  const label = known?.name ?? `Commune ${codeInsee}`;

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
          Risques &bull; Eau &bull; Energie
        </div>
      </div>
    ),
    { ...size },
  );
}
