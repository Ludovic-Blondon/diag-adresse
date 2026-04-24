import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddressSearch } from "@/components/address-search";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { BASE_URL } from "@/lib/constants";
import { RISK_NAV } from "@/lib/navigation";
import {
  REGIONS,
  getDepartementsForRegion,
  getRegionByCode,
  getTopCommunesForRegion,
} from "@/lib/regions";

export const dynamicParams = false;

interface Props {
  params: Promise<{ code: string }>;
}

export function generateStaticParams() {
  return REGIONS.map((r) => ({ code: r.code }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const region = getRegionByCode(code);
  if (!region) return { title: "Region introuvable" };

  const title = `Diagnostic en ${region.name}`;
  const description = `Risques naturels et industriels, qualite de l'eau et performance energetique : consultez le diagnostic des communes et departements de la region ${region.name}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "fr_FR",
      siteName: "DiagAdresse",
      url: `${BASE_URL}/region/${code}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `/region/${code}`,
    },
  };
}

export default async function RegionPage({ params }: Props) {
  const { code } = await params;
  const region = getRegionByCode(code);
  if (!region) notFound();

  const departements = getDepartementsForRegion(region);
  const topCommunes = getTopCommunesForRegion(region);

  return (
    <main className="mx-auto w-full max-w-4xl space-y-8 px-4 py-8">
      <div>
        <Breadcrumbs
          items={[{ name: region.name, href: `/region/${code}` }]}
        />
        <h1 className="mt-2 text-2xl font-bold">Region {region.name}</h1>
        <p className="text-muted-foreground mt-1">
          Diagnostic des communes et departements de la region {region.name} :
          risques naturels et industriels, qualite de l&apos;eau potable et
          performance energetique (DPE).
        </p>
      </div>

      <AddressSearch placeholder="Rechercher une adresse dans cette region..." />

      {departements.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">
            Departements ({departements.length})
          </h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {departements.map((dep) => (
              <Link
                key={dep.code}
                href={`/departement/${dep.code}`}
                className="hover:bg-accent rounded-lg border px-4 py-3 transition-colors"
              >
                <span className="font-medium">{dep.name}</span>
                <span className="text-muted-foreground ml-2 text-sm">
                  ({dep.code})
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {topCommunes.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Communes principales</h2>
          <div className="flex flex-wrap gap-2">
            {topCommunes.map((c) => (
              <Link
                key={c.code}
                href={`/commune/${c.code}`}
                className="hover:bg-accent rounded-full border px-3 py-1 text-sm transition-colors"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </section>
      )}

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

      <section>
        <h2 className="mb-3 text-lg font-semibold">Autres regions</h2>
        <div className="flex flex-wrap gap-2">
          {REGIONS.filter((r) => r.code !== code).map((r) => (
            <Link
              key={r.code}
              href={`/region/${r.code}`}
              className="hover:bg-accent rounded-full border px-3 py-1 text-sm transition-colors"
            >
              {r.name}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
