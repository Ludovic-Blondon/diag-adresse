import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/constants";
import communeCodes from "@/lib/sitemap-communes.json";

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
