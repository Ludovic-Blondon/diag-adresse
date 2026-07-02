import { ImageResponse } from "next/og";

// Prerender at build: this icon never changes, no reason to render it per
// request (GET route handlers are dynamic by default).
export const dynamic = "force-static";

export function GET() {
  const response = new ImageResponse(
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "#09090b",
        borderRadius: 36,
        color: "#fafafa",
        fontSize: 120,
        fontWeight: 700,
        fontFamily: "sans-serif",
      }}
    >
      D
    </div>,
    { width: 192, height: 192 },
  );
  response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  return response;
}
