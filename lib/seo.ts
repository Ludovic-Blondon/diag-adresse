import type { Metadata } from "next";
import { BASE_URL } from "./constants";

const FALLBACK_DESCRIPTION = (name: string) =>
  `Risques naturels et industriels, qualite de l'eau potable et performance energetique (DPE) pour ${name}. Consultez le diagnostic complet.`;

export function generateCommuneMetadata(
  codeInsee: string,
  communeName: string,
): Metadata {
  const title = `Diagnostic ${communeName} (${codeInsee})`;
  const description = FALLBACK_DESCRIPTION(communeName);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "fr_FR",
      siteName: "DiagAdresse",
      url: `${BASE_URL}/commune/${codeInsee}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `/commune/${codeInsee}`,
    },
  };
}
