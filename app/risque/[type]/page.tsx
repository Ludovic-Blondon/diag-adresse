import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddressSearch } from "@/components/address-search";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { faqPageJsonLd } from "@/lib/json-ld";
import { BASE_URL } from "@/lib/constants";
import { RISK_GUIDES } from "@/lib/risk-guides";
import { POPULAR_CITIES } from "@/lib/navigation";

interface Props {
  params: Promise<{ type: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params;
  const guide = RISK_GUIDES[type];
  if (!guide) return { title: "Risque introuvable" };
  return {
    title: guide.title,
    description: guide.description,
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: "article",
      locale: "fr_FR",
      siteName: "DiagAdresse",
      url: `${BASE_URL}/risque/${type}`,
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.description,
    },
    alternates: {
      canonical: `/risque/${type}`,
    },
  };
}

export function generateStaticParams() {
  return Object.keys(RISK_GUIDES).map((type) => ({ type }));
}

export default async function RiskGuidePage({ params }: Props) {
  const { type } = await params;
  const guide = RISK_GUIDES[type];

  if (!guide) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqPageJsonLd(guide.faq)),
        }}
      />
      <div>
        <Breadcrumbs
          items={[{ name: guide.title, href: `/risque/${type}` }]}
        />
        <h1 className="text-3xl font-bold mt-2">{guide.title}</h1>
        <p className="text-muted-foreground mt-2">{guide.description}</p>
      </div>

      <article className="prose prose-neutral dark:prose-invert max-w-none">
        {guide.content.split("\n\n").map((paragraph, i) => {
          if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
            return (
              <h2 key={i} className="text-xl font-semibold mt-6 mb-3">
                {paragraph.replace(/\*\*/g, "")}
              </h2>
            );
          }
          if (paragraph.startsWith("**")) {
            const [title, ...rest] = paragraph.split("\n");
            return (
              <div key={i}>
                <h3 className="text-lg font-semibold mt-4 mb-2">
                  {title.replace(/\*\*/g, "")}
                </h3>
                {rest.map((line, j) => {
                  if (line.startsWith("- ")) {
                    return (
                      <li key={j} className="ml-4 text-sm text-muted-foreground">
                        {line.slice(2)}
                      </li>
                    );
                  }
                  return (
                    <p key={j} className="text-sm text-muted-foreground">
                      {line}
                    </p>
                  );
                })}
              </div>
            );
          }
          return (
            <p key={i} className="text-sm text-muted-foreground leading-relaxed">
              {paragraph}
            </p>
          );
        })}
      </article>

      <div className="rounded-lg border bg-muted/50 p-6 space-y-3">
        <h2 className="font-semibold">
          Verifiez votre adresse
        </h2>
        <p className="text-sm text-muted-foreground">
          Consultez le diagnostic complet pour votre adresse :
        </p>
        <AddressSearch />
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-3">
          Consultez le diagnostic d&apos;une grande ville
        </h2>
        <div className="flex flex-wrap gap-2">
          {POPULAR_CITIES.slice(0, 8).map((city) => (
            <Link
              key={city.code}
              href={`/commune/${city.code}`}
              className="rounded-full border px-3 py-1 text-sm hover:bg-accent transition-colors"
            >
              {city.name}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Autres guides</h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(RISK_GUIDES)
            .filter(([key]) => key !== type)
            .map(([key, g]) => (
              <Link
                key={key}
                href={`/risque/${key}`}
                className="rounded-full border px-3 py-1 text-sm hover:bg-accent transition-colors"
              >
                {g.title}
              </Link>
            ))}
        </div>
      </section>
    </main>
  );
}
