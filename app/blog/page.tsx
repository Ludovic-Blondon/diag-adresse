import type { Metadata } from "next";
import Link from "next/link";
import { AddressSearch } from "@/components/address-search";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { BASE_URL } from "@/lib/constants";
import { ALL_ARTICLES } from "@/lib/articles";
import { RISK_NAV } from "@/lib/navigation";

const title = "Blog DiagAdresse";
const description =
  "Articles et guides pratiques sur les diagnostics immobiliers, les risques naturels, la performance energetique et la reglementation francaise.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    locale: "fr_FR",
    siteName: "DiagAdresse",
    url: `${BASE_URL}/blog`,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  alternates: {
    canonical: "/blog",
  },
};

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default function BlogIndexPage() {
  return (
    <main className="mx-auto w-full max-w-3xl space-y-8 px-4 py-8">
      <header className="space-y-2">
        <Breadcrumbs items={[{ name: "Blog", href: "/blog" }]} />
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </header>

      <section className="space-y-4">
        {ALL_ARTICLES.map((article) => (
          <article
            key={article.slug}
            className="hover:bg-accent rounded-lg border p-5 transition-colors"
          >
            <Link href={`/blog/${article.slug}`} className="block space-y-2">
              <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
                <time dateTime={article.publishedAt}>
                  {dateFormatter.format(new Date(article.publishedAt))}
                </time>
                <span aria-hidden="true">·</span>
                <span>{article.readingMinutes} min de lecture</span>
              </div>
              <h2 className="text-xl font-semibold">{article.title}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {article.excerpt}
              </p>
            </Link>
          </article>
        ))}
      </section>

      <div className="bg-muted/50 space-y-3 rounded-lg border p-6">
        <h2 className="font-semibold">Verifiez votre adresse</h2>
        <p className="text-muted-foreground text-sm">
          Lancez un diagnostic complet directement depuis votre adresse :
        </p>
        <AddressSearch />
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Guides sur les risques</h2>
        <div className="flex flex-wrap gap-2">
          {RISK_NAV.map((risk) => (
            <Link
              key={risk.type}
              href={`/risque/${risk.type}`}
              className="hover:bg-accent rounded-full border px-3 py-1 text-sm transition-colors"
            >
              {risk.label}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
