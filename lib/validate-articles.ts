import { ARTICLES } from "./articles";
import { RISK_GUIDES } from "./risk-guides";

export function validateArticleRefs(): void {
  for (const [key, article] of Object.entries(ARTICLES)) {
    if (article.slug !== key) {
      console.warn(
        `[articles] Record key "${key}" does not match article.slug "${article.slug}"`,
      );
    }
    for (const ref of article.relatedRisks) {
      if (!RISK_GUIDES[ref]) {
        console.warn(
          `[articles] "${article.slug}" relatedRisks: unknown slug "${ref}"`,
        );
      }
    }
    for (const ref of article.relatedArticles) {
      if (!ARTICLES[ref]) {
        console.warn(
          `[articles] "${article.slug}" relatedArticles: unknown slug "${ref}"`,
        );
      }
    }
  }
}
