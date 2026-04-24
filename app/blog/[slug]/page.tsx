import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddressSearch } from "@/components/address-search";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { BASE_URL } from "@/lib/constants";
import {
  ALL_ARTICLES,
  ARTICLES,
  getArticle,
  type Article,
} from "@/lib/articles";
import { RISK_GUIDES } from "@/lib/risk-guides";
import { articleJsonLd, faqPageJsonLd } from "@/lib/json-ld";

export const dynamicParams = false;

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return Object.keys(ARTICLES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Article introuvable" };

  const url = `${BASE_URL}/blog/${slug}`;
  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      locale: "fr_FR",
      siteName: "DiagAdresse",
      url,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
    },
    alternates: {
      canonical: `/blog/${slug}`,
    },
  };
}

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const url = `${BASE_URL}/blog/${slug}`;
  const relatedRisks = article.relatedRisks
    .map((r) => ({ slug: r, guide: RISK_GUIDES[r] }))
    .filter((r) => r.guide);
  const relatedArticles = article.relatedArticles
    .map((s) => ARTICLES[s])
    .filter((a): a is Article => Boolean(a));

  return (
    <main className="mx-auto w-full max-w-3xl space-y-10 px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            articleJsonLd({
              title: article.title,
              description: article.description,
              url,
              datePublished: article.publishedAt,
              dateModified: article.updatedAt,
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqPageJsonLd(article.faq)),
        }}
      />

      <header className="space-y-3">
        <Breadcrumbs
          items={[
            { name: "Blog", href: "/blog" },
            { name: article.title, href: `/blog/${slug}` },
          ]}
        />
        <h1 className="text-3xl font-bold">{article.title}</h1>
        <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
          <time dateTime={article.publishedAt}>
            Publie le {dateFormatter.format(new Date(article.publishedAt))}
          </time>
          {article.updatedAt !== article.publishedAt && (
            <>
              <span aria-hidden="true">·</span>
              <time dateTime={article.updatedAt}>
                Mis a jour le{" "}
                {dateFormatter.format(new Date(article.updatedAt))}
              </time>
            </>
          )}
          <span aria-hidden="true">·</span>
          <span>{article.readingMinutes} min de lecture</span>
        </div>
        <p className="leading-relaxed">{article.intro}</p>
      </header>

      <aside
        aria-label="A retenir"
        className="bg-muted/50 space-y-2 rounded-lg border p-5"
      >
        <h2 className="text-lg font-semibold">A retenir</h2>
        <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-sm">
          {article.keyTakeaways.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </aside>

      <article className="space-y-8">
        {article.sections.map((section) => (
          <section key={section.heading} className="space-y-3">
            <h2 className="text-xl font-semibold">{section.heading}</h2>
            {section.body.split("\n\n").map((paragraph, i) => (
              <p key={i} className="text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
            {section.items && (
              <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-sm">
                {section.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </article>

      <section>
        <h2 className="mb-3 text-xl font-semibold">Questions frequentes</h2>
        <div className="space-y-2">
          {article.faq.map((q) => (
            <details
              key={q.question}
              className="group open:bg-muted/30 rounded-lg border px-4 py-3"
            >
              <summary className="cursor-pointer font-medium">
                {q.question}
              </summary>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {q.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      {relatedRisks.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Risques lies</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {relatedRisks.map(({ slug: s, guide }) => (
              <Link
                key={s}
                href={`/risque/${s}`}
                className="hover:bg-accent rounded-lg border p-4 transition-colors"
              >
                <div className="font-medium">{guide.title}</div>
                <div className="text-muted-foreground mt-1 text-sm">
                  {guide.description}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {relatedArticles.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Articles lies</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {relatedArticles.map((a) => (
              <Link
                key={a.slug}
                href={`/blog/${a.slug}`}
                className="hover:bg-accent rounded-lg border p-4 transition-colors"
              >
                <div className="font-medium">{a.title}</div>
                <div className="text-muted-foreground mt-1 text-sm">
                  {a.description}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="bg-muted/50 space-y-3 rounded-lg border p-6">
        <h2 className="font-semibold">Verifiez votre adresse</h2>
        <p className="text-muted-foreground text-sm">
          Consultez le diagnostic complet pour votre adresse :
        </p>
        <AddressSearch />
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Autres articles</h2>
        <div className="flex flex-wrap gap-2">
          {ALL_ARTICLES.filter((a) => a.slug !== slug).map((a) => (
            <Link
              key={a.slug}
              href={`/blog/${a.slug}`}
              className="hover:bg-accent rounded-full border px-3 py-1 text-sm transition-colors"
            >
              {a.title}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
