import type { Metadata } from "next";
import { BASE_URL } from "./constants";
import { communePath } from "./commune-url";
import { prepositionVille } from "./commune-text";

// The layout title template appends " | DiagAdresse"; budget the SERP title
// (60 chars) accordingly and fall back to the short variant when it overflows.
const TITLE_SUFFIX_LEN = " | DiagAdresse".length;
const MAX_TITLE_LEN = 60;

function pickTitle(long: string, short: string): string {
  return long.length + TITLE_SUFFIX_LEN > MAX_TITLE_LEN ? short : long;
}

function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "fr_FR",
      siteName: "DiagAdresse",
      url: `${BASE_URL}${path}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: path,
    },
  };
}

export function generateCommuneMetadata(
  codeInsee: string,
  communeName: string,
  depCode: string,
): Metadata {
  // Titles/description target real search intents ("zone inondable {ville}",
  // "DPE {ville}"...) rather than the meaningless "diagnostic {ville}".
  const ville = prepositionVille(communeName); // "à Grenoble", "au Havre"...
  const title = pickTitle(
    `Risques, eau potable et DPE ${ville} (${depCode})`,
    `${communeName} (${depCode}) : risques, eau, DPE`,
  );
  const description = `Zone inondable, sismicité, argiles, radon, qualité de l'eau du robinet et DPE ${ville} : le diagnostic complet, gratuit, à partir des données publiques.`;
  return pageMetadata(title, description, communePath(codeInsee, communeName));
}

// Departments/regions can't take a clean "en {Nom}" preposition (wrong for
// masculine/plural names like "Gard" or "Hauts-de-France"), so their titles/H1
// use a neutral dash form instead of the commune-level prepositions.
export function generateDepartementMetadata(
  name: string,
  code: string,
): Metadata {
  const title = pickTitle(
    `Risques, eau potable et DPE — ${name} (${code})`,
    `${name} (${code}) : risques, eau, DPE`,
  );
  const description = `Consultez les risques naturels, la qualité de l'eau potable et les DPE des communes principales du département ${name}.`;
  return pageMetadata(title, description, `/departement/${code}`);
}

export function generateRegionMetadata(name: string, code: string): Metadata {
  const title = pickTitle(
    `${name} : risques, eau potable et DPE par département`,
    `${name} : risques, eau et DPE`,
  );
  const description = `Consultez les risques naturels, la qualité de l'eau potable et les DPE des départements et communes de la région ${name}.`;
  return pageMetadata(title, description, `/region/${code}`);
}
