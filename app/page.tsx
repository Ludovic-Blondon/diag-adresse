import Link from "next/link";
import { AddressSearch } from "@/components/address-search";
import { websiteJsonLd } from "@/lib/json-ld";
import { POPULAR_CITIES } from "@/lib/navigation";
import { TOP_COMMUNES } from "@/lib/communes";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteJsonLd()),
        }}
      />
      <div className="w-full max-w-2xl space-y-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          DiagAdresse
        </h1>
        <p className="text-muted-foreground text-lg">
          Le diagnostic complet de votre adresse en France : risques naturels et
          industriels, qualite de l&apos;eau, performance energetique.
        </p>

        <AddressSearch />

        <section className="pt-8">
          <h2 className="text-muted-foreground mb-4 text-sm font-medium">
            Villes populaires
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {POPULAR_CITIES.map((city) => (
              <Link
                key={city.code}
                href={`/commune/${city.code}`}
                className="hover:bg-accent rounded-full border px-4 py-1.5 text-sm transition-colors"
              >
                {city.name}
              </Link>
            ))}
          </div>
          <details className="mt-4">
            <summary className="text-muted-foreground cursor-pointer text-xs hover:underline">
              Voir plus de villes
            </summary>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {TOP_COMMUNES.filter(
                (c) => !POPULAR_CITIES.some((p) => p.code === c.code),
              ).map((city) => (
                <Link
                  key={city.code}
                  href={`/commune/${city.code}`}
                  className="hover:bg-accent rounded-full border px-4 py-1.5 text-sm transition-colors"
                >
                  {city.name}
                </Link>
              ))}
            </div>
          </details>
        </section>
      </div>
    </main>
  );
}
