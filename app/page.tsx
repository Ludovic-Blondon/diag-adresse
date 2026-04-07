import Link from "next/link";
import { AddressSearch } from "@/components/address-search";
import { websiteJsonLd } from "@/lib/json-ld";
import { POPULAR_CITIES, RISK_NAV } from "@/lib/navigation";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteJsonLd()),
        }}
      />
      <div className="w-full max-w-2xl text-center space-y-8">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          DiagAdresse
        </h1>
        <p className="text-lg text-muted-foreground">
          Le diagnostic complet de votre adresse en France : risques naturels et
          industriels, qualite de l&apos;eau, performance energetique.
        </p>

        <AddressSearch />

        <section className="pt-8">
          <h2 className="text-sm font-medium text-muted-foreground mb-4">
            Villes populaires
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {POPULAR_CITIES.map((city) => (
              <Link
                key={city.code}
                href={`/commune/${city.code}`}
                className="rounded-full border px-4 py-1.5 text-sm hover:bg-accent transition-colors"
              >
                {city.name}
              </Link>
            ))}
          </div>
        </section>

        <section className="pt-4">
          <h2 className="text-sm font-medium text-muted-foreground mb-4">
            Guides des risques
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {RISK_NAV.map((guide) => (
              <Link
                key={guide.type}
                href={`/risque/${guide.type}`}
                className="rounded-full border px-4 py-1.5 text-sm hover:bg-accent transition-colors"
              >
                {guide.label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
