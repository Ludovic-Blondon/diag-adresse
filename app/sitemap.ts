import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/constants";
import communesIndex from "@/lib/communes-index.json";
import { communePath } from "@/lib/commune-url";
import { getActiveDepartements } from "@/lib/departements";
import { REGIONS } from "@/lib/regions";
import { ALL_ARTICLES } from "@/lib/articles";
import { RISK_GUIDES, RISK_GUIDES_UPDATED_AT } from "@/lib/risk-guides";
import { listAvailableDepartements } from "@/lib/argile/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  // Bucketed to the 1st of the month: the sitemap is generated at build time,
  // so a raw `now` bumps lastModified on every URL at each deploy and sends
  // crawlers re-fetching all ~2300 pages (and their OG images) — the main
  // source of Vercel function CPU. Matches changeFrequency: "monthly".
  const monthStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
  );
  const riskGuidesUpdatedAt = new Date(RISK_GUIDES_UPDATED_AT);
  const latestArticleUpdate =
    ALL_ARTICLES.length > 0
      ? new Date(
          Math.max(...ALL_ARTICLES.map((a) => new Date(a.updatedAt).getTime())),
        )
      : now;

  const pages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: monthStart,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: monthStart,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: latestArticleUpdate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // Blog articles
  for (const article of ALL_ARTICLES) {
    pages.push({
      url: `${BASE_URL}/blog/${article.slug}`,
      lastModified: new Date(article.updatedAt),
      changeFrequency: "monthly",
      priority: 0.75,
    });
  }

  // Region pages
  for (const region of REGIONS) {
    pages.push({
      url: `${BASE_URL}/region/${region.code}`,
      lastModified: monthStart,
      changeFrequency: "monthly",
      priority: 0.9,
    });
  }

  // Departement pages
  for (const dep of getActiveDepartements()) {
    pages.push({
      url: `${BASE_URL}/departement/${dep.code}`,
      lastModified: monthStart,
      changeFrequency: "monthly",
      priority: 0.85,
    });
  }

  // Risk guide pages
  for (const type of Object.keys(RISK_GUIDES)) {
    pages.push({
      url: `${BASE_URL}/risque/${type}`,
      lastModified: riskGuidesUpdatedAt,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // Dossier « Carte argile 2026 » : hub + pages département (si le diff existe)
  pages.push({
    url: `${BASE_URL}/argile-2026`,
    lastModified: riskGuidesUpdatedAt,
    changeFrequency: "monthly",
    priority: 0.9,
  });
  pages.push({
    url: `${BASE_URL}/argile-2026/methodologie`,
    lastModified: riskGuidesUpdatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  });
  pages.push({
    url: `${BASE_URL}/argile-2026/presse`,
    lastModified: riskGuidesUpdatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  });
  for (const dep of listAvailableDepartements()) {
    pages.push({
      url: `${BASE_URL}/argile-2026/departement/${dep}`,
      lastModified: riskGuidesUpdatedAt,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  // Commune pages (2280 communes with population >= 5000)
  for (const [code, nom] of communesIndex) {
    pages.push({
      url: `${BASE_URL}${communePath(code, nom)}`,
      lastModified: monthStart,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  return pages;
}
