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

  // Commune pages
  for (const commune of TOP_COMMUNES) {
    pages.push({
      url: `${BASE_URL}/commune/${commune.code}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  // Risk guide pages
  for (const type of RISK_TYPES) {
    pages.push({
      url: `${BASE_URL}/risque/${type}`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.6,
    });
  }

  return pages;
}
