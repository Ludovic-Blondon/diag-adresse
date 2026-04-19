import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "DiagAdresse - Diagnostic complet de votre adresse";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
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
          fontSize: 64,
          fontWeight: 700,
          marginBottom: 24,
        }}
      >
        DiagAdresse
      </div>
      <div
        style={{
          fontSize: 28,
          color: "#a1a1aa",
          textAlign: "center",
          maxWidth: "80%",
          lineHeight: 1.5,
        }}
      >
        Le diagnostic complet de votre adresse en France
      </div>
      <div
        style={{
          display: "flex",
          gap: 32,
          fontSize: 22,
          marginTop: 48,
          color: "#71717a",
        }}
      >
        <span>Risques naturels</span>
        <span>{"•"}</span>
        <span>{"Qualite de l'eau"}</span>
        <span>{"•"}</span>
        <span>Performance energetique</span>
      </div>
    </div>,
    { ...size },
  );
}
