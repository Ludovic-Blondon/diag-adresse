import type { Metadata } from "next";
import Link from "next/link";
import { AddressSearch } from "@/components/address-search";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { BASE_URL } from "@/lib/constants";
import { faqPageJsonLd } from "@/lib/json-ld";
import { ALL_FAQ_ENTRIES, FAQ_SECTIONS } from "@/lib/faq";
import { RISK_NAV } from "@/lib/navigation";

const title = "Questions frequentes sur DiagAdresse";
const description =
  "Reponses aux questions frequentes sur DiagAdresse : fonctionnement du service, sources de donnees, valeur juridique du diagnostic et confidentialite.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    locale: "fr_FR",
    siteName: "DiagAdresse",
    url: `${BASE_URL}/faq`,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  alternates: {
    canonical: "/faq",
  },
};

export default function FaqPage() {
  return (
    <main className="mx-auto w-full max-w-3xl space-y-8 px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqPageJsonLd(ALL_FAQ_ENTRIES)),
        }}
      />

      <header className="space-y-2">
        <Breadcrumbs items={[{ name: "FAQ", href: "/faq" }]} />
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </header>

      {FAQ_SECTIONS.map((section) => (
        <section key={section.title} className="space-y-3">
          <h2 className="text-xl font-semibold">{section.title}</h2>
          <div className="space-y-2">
            {section.entries.map((entry) => (
              <details
                key={entry.question}
                className="group open:bg-muted/30 rounded-lg border px-4 py-3"
              >
                <summary className="cursor-pointer font-medium">
                  {entry.question}
                </summary>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {entry.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      ))}

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
