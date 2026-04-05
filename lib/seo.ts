import type { Metadata } from "next";

export function generateCommuneMetadata(
  codeInsee: string,
  communeName: string,
): Metadata {
  const title = `Diagnostic ${communeName} (${codeInsee})`;
  const description = `Risques naturels et industriels, qualite de l'eau potable et performance energetique (DPE) pour ${communeName}. Consultez le diagnostic complet.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}
