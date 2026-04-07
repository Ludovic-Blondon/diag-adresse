import Link from "next/link";
import { AddressSearch } from "@/components/address-search";
import { websiteJsonLd } from "@/lib/json-ld";

const POPULAR_CITIES = [
  { name: "Paris", code: "75056" },
  { name: "Lyon", code: "69123" },
  { name: "Marseille", code: "13055" },
  { name: "Toulouse", code: "31555" },
  { name: "Bordeaux", code: "33063" },
  { name: "Nantes", code: "44109" },
  { name: "Lille", code: "59350" },
  { name: "Strasbourg", code: "67482" },
  { name: "Nice", code: "06088" },
  { name: "Montpellier", code: "34172" },
  { name: "Rennes", code: "35238" },
  { name: "Grenoble", code: "38185" },
];

const RISK_GUIDES = [
  { type: "inondation", label: "Inondation" },
  { type: "seisme", label: "Seisme" },
  { type: "argile", label: "Retrait-gonflement argiles" },
  { type: "radon", label: "Radon" },
  { type: "icpe", label: "Sites industriels (ICPE)" },
  { type: "cavites", label: "Cavites souterraines" },
];

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
            {RISK_GUIDES.map((guide) => (
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
