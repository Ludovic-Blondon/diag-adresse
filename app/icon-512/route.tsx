import { ImageResponse } from "next/og";

export const runtime = "edge";

export function GET() {
  const response = new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#09090b",
          borderRadius: 96,
          color: "#fafafa",
          fontSize: 320,
          fontWeight: 700,
          fontFamily: "sans-serif",
        }}
      >
        D
      </div>
    ),
    { width: 512, height: 512 },
  );
  response.headers.set(
    "Cache-Control",
    "public, max-age=31536000, immutable",
  );
  return response;
}
