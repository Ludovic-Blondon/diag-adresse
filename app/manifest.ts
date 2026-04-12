import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DiagAdresse - Diagnostic complet de votre adresse",
    short_name: "DiagAdresse",
    description:
      "Risques naturels et industriels, qualite de l'eau, performance energetique : le diagnostic complet de votre adresse en France.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#09090b",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
