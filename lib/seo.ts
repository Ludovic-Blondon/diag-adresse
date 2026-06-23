import type { Metadata } from "next";
import { BASE_URL } from "./constants";
import { communePath } from "./commune-url";
import { prepositionVille } from "./commune-text";

// The layout title template appends " | DiagAdresse"; budget the document
// <title> (60-char SERP target) against that suffix.
const TITLE_SUFFIX_LEN = " | DiagAdresse".length;
const MAX_TITLE_LEN = 60;

// Resolve the document <title> and the OG/Twitter title from a long
// (descriptive) and a short variant. OG/Twitter have no SERP budget, so they
// always keep the long form. The <title> uses the long form when it fits with
// the brand suffix, else the short form; if even the short overflows, it drops
// the suffix via `{ absolute }` so the SERP title still fits 60 chars.
function fitTitle(
  long: string,
  short: string,
): { meta: Metadata["title"]; og: string } {
  if (long.length + TITLE_SUFFIX_LEN <= MAX_TITLE_LEN)
    return { meta: long, og: long };
  if (short.length + TITLE_SUFFIX_LEN <= MAX_TITLE_LEN)
    return { meta: short, og: long };
  return { meta: { absolute: short }, og: long };
}

function pageMetadata(
  metaTitle: Metadata["title"],
  ogTitle: string,
  description: string,
  path: string,
): Metadata {
  return {
    title: metaTitle,
    description,
    openGraph: {
      title: ogTitle,
      description,
      type: "website",
      locale: "fr_FR",
      siteName: "DiagAdresse",
      url: `${BASE_URL}${path}`,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
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
  const { meta, og } = fitTitle(
    `Risques, eau potable et DPE ${ville} (${depCode})`,
    `${communeName} (${depCode}) : risques, eau, DPE`,
  );
  const description = `Zone inondable, sismicité, argiles, radon, qualité de l'eau du robinet et DPE ${ville} : le diagnostic complet, gratuit, à partir des données publiques.`;
  return pageMetadata(
    meta,
    og,
    description,
    communePath(codeInsee, communeName),
  );
}

// Departments/regions can't take a clean "en {Nom}" preposition (wrong for
// masculine/plural names like "Gard" or "Hauts-de-France"), so their titles/H1
// use a neutral dash form instead of the commune-level prepositions.
export function generateDepartementMetadata(
  name: string,
  code: string,
): Metadata {
  const { meta, og } = fitTitle(
    `Risques, eau potable et DPE — ${name} (${code})`,
    `${name} (${code}) : risques, eau, DPE`,
  );
  const description = `Consultez les risques naturels, la qualité de l'eau potable et les DPE des communes principales du département ${name}.`;
  return pageMetadata(meta, og, description, `/departement/${code}`);
}

export function generateRegionMetadata(name: string, code: string): Metadata {
  const { meta, og } = fitTitle(
    `${name} : risques, eau potable et DPE par département`,
    `${name} : risques, eau et DPE`,
  );
  const description = `Consultez les risques naturels, la qualité de l'eau potable et les DPE des départements et communes de la région ${name}.`;
  return pageMetadata(meta, og, description, `/region/${code}`);
}
