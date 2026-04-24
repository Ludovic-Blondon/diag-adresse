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

  const relatedGuides = guide.relatedRisks
    .map((slug) => ({ slug, guide: RISK_GUIDES[slug] }))
    .filter((r) => r.guide);

  return (
    <main className="mx-auto w-full max-w-3xl space-y-10 px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqPageJsonLd(guide.faq)),
        }}
      />

      <header className="space-y-3">
        <Breadcrumbs items={[{ name: guide.title, href: `/risque/${type}` }]} />
        <h1 className="text-3xl font-bold">{guide.title}</h1>
        <p className="text-muted-foreground">{guide.description}</p>
        <p className="leading-relaxed">{guide.intro}</p>
      </header>

      <aside
        aria-label="Chiffres cles"
        className="bg-muted/50 grid grid-cols-2 gap-3 rounded-lg border p-4 sm:grid-cols-4"
      >
        {guide.keyFigures.map((fig) => (
          <div key={fig.label}>
            <div className="text-xl font-bold">{fig.value}</div>
            <div className="text-muted-foreground text-xs">{fig.label}</div>
          </div>
        ))}
      </aside>

      <article className="space-y-8">
        {guide.sections.map((section) => (
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

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Que faire ?</h2>
          <ol className="text-muted-foreground list-decimal space-y-1.5 pl-5 text-sm">
            {guide.whatToDo.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Cout et assurance</h2>
          <p className="text-muted-foreground leading-relaxed">
            {guide.costAndInsurance}
          </p>
        </section>

        <section className="bg-muted/50 space-y-2 rounded-lg border p-5">
          <h2 className="text-lg font-semibold">Obligations legales</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {guide.legalObligations}
          </p>
        </section>
      </article>

      {relatedGuides.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Risques lies</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {relatedGuides.map(({ slug, guide: g }) => (
              <Link
                key={slug}
                href={`/risque/${slug}`}
                className="hover:bg-accent rounded-lg border p-4 transition-colors"
              >
                <div className="font-medium">{g.title}</div>
                <div className="text-muted-foreground mt-1 text-sm">
                  {g.description}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-xl font-semibold">Questions frequentes</h2>
        <div className="space-y-2">
          {guide.faq.map((q) => (
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
