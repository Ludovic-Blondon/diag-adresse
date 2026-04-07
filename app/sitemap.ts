import type { MetadataRoute } from "next";
import { TOP_COMMUNES } from "@/lib/communes";

const BASE_URL = "https://diagadresse.fr";

const RISK_TYPES = [
  "inondation",
  "seisme",
  "argile",
  "radon",
  "icpe",
  "cavites",
];

const MIN_POPULATION = 5000;

interface CommuneAPI {
  code: string;
  population?: number;
}

async function fetchCommunes(): Promise<{ code: string }[]> {
  try {
    const res = await fetch(
      "https://geo.api.gouv.fr/communes?fields=code,population",
      { next: { revalidate: 86400 * 30 } },
    );
    if (!res.ok) return TOP_COMMUNES;
    const data: CommuneAPI[] = await res.json();
    return data
      .filter((c) => (c.population ?? 0) >= MIN_POPULATION)
      .map((c) => ({ code: c.code }));
  } catch {
    return TOP_COMMUNES;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const communes = await fetchCommunes();

  const pages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];

  // Risk guide pages
  for (const type of RISK_TYPES) {
    pages.push({
      url: `${BASE_URL}/risque/${type}`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.7,
    });
  }

  // Commune pages (~2000 communes with population >= 5000)
  for (const commune of communes) {
    pages.push({
      url: `${BASE_URL}/commune/${commune.code}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  return pages;
}
