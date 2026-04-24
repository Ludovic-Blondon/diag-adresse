import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/constants";
import communeCodes from "@/lib/sitemap-communes.json";
import { getActiveDepartements } from "@/lib/departements";
import { REGIONS } from "@/lib/regions";

const RISK_TYPES = [
  "inondation",
  "seisme",
  "argile",
  "radon",
  "icpe",
  "cavites",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Region pages
  for (const region of REGIONS) {
    pages.push({
      url: `${BASE_URL}/region/${region.code}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    });
  }

  // Departement pages
  for (const dep of getActiveDepartements()) {
    pages.push({
      url: `${BASE_URL}/departement/${dep.code}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    });
  }

  // Risk guide pages
  for (const type of RISK_TYPES) {
    pages.push({
      url: `${BASE_URL}/risque/${type}`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.7,
    });
  }

  // Commune pages (2280 communes with population >= 5000)
  for (const code of communeCodes) {
    pages.push({
      url: `${BASE_URL}/commune/${code}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  return pages;
}
