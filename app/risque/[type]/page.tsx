import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddressSearch } from "@/components/address-search";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { faqPageJsonLd } from "@/lib/json-ld";
import { BASE_URL } from "@/lib/constants";
import { RISK_GUIDES } from "@/lib/risk-guides";
import { POPULAR_CITIES } from "@/lib/navigation";
import { TOP_COMMUNES } from "@/lib/communes";
import { getActiveDepartements } from "@/lib/departements";

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
    <main className="mx-auto w-full max-w-3xl space-y-8 px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqPageJsonLd(guide.faq)),
        }}
      />
      <div>
        <Breadcrumbs items={[{ name: guide.title, href: `/risque/${type}` }]} />
        <h1 className="mt-2 text-3xl font-bold">{guide.title}</h1>
        <p className="text-muted-foreground mt-2">{guide.description}</p>
      </div>

      <article className="prose prose-neutral dark:prose-invert max-w-none">
        {guide.content.split("\n\n").map((paragraph, i) => {
          if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
            return (
              <h2 key={i} className="mt-6 mb-3 text-xl font-semibold">
                {paragraph.replace(/\*\*/g, "")}
              </h2>
            );
          }
          if (paragraph.startsWith("**")) {
            const [title, ...rest] = paragraph.split("\n");
            return (
              <div key={i}>
                <h3 className="mt-4 mb-2 text-lg font-semibold">
                  {title.replace(/\*\*/g, "")}
                </h3>
                {rest.map((line, j) => {
                  if (line.startsWith("- ")) {
                    return (
                      <li
                        key={j}
                        className="text-muted-foreground ml-4 text-sm"
                      >
                        {line.slice(2)}
                      </li>
                    );
                  }
                  return (
                    <p key={j} className="text-muted-foreground text-sm">
                      {line}
                    </p>
                  );
                })}
              </div>
            );
          }
          return (
            <p
              key={i}
              className="text-muted-foreground text-sm leading-relaxed"
            >
              {paragraph}
            </p>
          );
        })}
      </article>

      <div className="bg-muted/50 space-y-3 rounded-lg border p-6">
        <h2 className="font-semibold">Verifiez votre adresse</h2>
        <p className="text-muted-foreground text-sm">
          Consultez le diagnostic complet pour votre adresse :
        </p>
        <AddressSearch />
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold">
          Consultez le diagnostic d&apos;une grande ville
        </h2>
        <div className="flex flex-wrap gap-2">
          {POPULAR_CITIES.map((city) => (
            <Link
              key={city.code}
              href={`/commune/${city.code}`}
              className="hover:bg-accent rounded-full border px-3 py-1 text-sm transition-colors"
            >
              {city.name}
            </Link>
          ))}
        </div>
        <details className="mt-3">
          <summary className="text-muted-foreground cursor-pointer text-xs hover:underline">
            Voir plus de villes
          </summary>
          <div className="mt-3 flex flex-wrap gap-2">
            {TOP_COMMUNES.filter(
              (c) => !POPULAR_CITIES.some((p) => p.code === c.code),
            ).map((city) => (
              <Link
                key={city.code}
                href={`/commune/${city.code}`}
                className="hover:bg-accent rounded-full border px-3 py-1 text-sm transition-colors"
              >
                {city.name}
              </Link>
            ))}
          </div>
        </details>
      </section>

      <details>
        <summary className="cursor-pointer text-lg font-semibold hover:underline">
          Parcourir par departement
        </summary>
        <div className="mt-3 flex flex-wrap gap-2">
          {getActiveDepartements().map((dep) => (
            <Link
              key={dep.code}
              href={`/departement/${dep.code}`}
              className="hover:bg-accent rounded-full border px-3 py-1 text-sm transition-colors"
            >
              {dep.name}
            </Link>
          ))}
        </div>
      </details>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Autres guides</h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(RISK_GUIDES)
            .filter(([key]) => key !== type)
            .map(([key, g]) => (
              <Link
                key={key}
                href={`/risque/${key}`}
                className="hover:bg-accent rounded-full border px-3 py-1 text-sm transition-colors"
              >
                {g.title}
              </Link>
            ))}
        </div>
      </section>
    </main>
  );
}
