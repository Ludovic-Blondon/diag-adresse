import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddressSearch } from "@/components/address-search";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { BASE_URL } from "@/lib/constants";
import { DEPARTEMENTS, getActiveDepartements } from "@/lib/departements";
import { RISK_NAV } from "@/lib/navigation";
import { getRegionForDepartement } from "@/lib/regions";

export const revalidate = 604800; // 7 days
export const dynamicParams = false;

interface Commune {
  code: string;
  nom: string;
  population?: number;
}

interface Props {
  params: Promise<{ code: string }>;
}

async function getCommunesForDepartement(
  depCode: string,
): Promise<Commune[]> {
  const res = await fetch(
    `https://geo.api.gouv.fr/departements/${depCode}/communes?fields=nom,code,population`,
    { next: { revalidate: 604800 } },
  );
  if (!res.ok) return [];
  const data: Commune[] = await res.json();
  return data
    .filter((c) => (c.population ?? 0) >= 5000)
    .sort((a, b) => (b.population ?? 0) - (a.population ?? 0));
}

export function generateStaticParams() {
  return getActiveDepartements().map((d) => ({ code: d.code }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const name = DEPARTEMENTS[code];
  if (!name) return { title: "Departement introuvable" };

  const title = `Diagnostic ${name} (${code})`;
  const description = `Risques naturels, qualite de l'eau et performance energetique : consultez le diagnostic des communes du departement ${name}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "fr_FR",
      siteName: "DiagAdresse",
      url: `${BASE_URL}/departement/${code}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `/departement/${code}`,
    },
  };
}

export default async function DepartementPage({ params }: Props) {
  const { code } = await params;
  const name = DEPARTEMENTS[code];
  if (!name) notFound();

  const communes = await getCommunesForDepartement(code);
  const region = getRegionForDepartement(code);
  const siblingDepartements = region
    ? region.departements
        .filter((d) => d !== code && DEPARTEMENTS[d])
        .map((d) => ({ code: d, name: DEPARTEMENTS[d] }))
    : [];

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 space-y-8">
      <div>
        <Breadcrumbs
          items={[{ name: `${name} (${code})`, href: `/departement/${code}` }]}
        />
        <h1 className="text-2xl font-bold mt-2">
          Departement {name}
        </h1>
        <p className="text-muted-foreground mt-1">
          Diagnostic des communes du departement {name} ({code}) : risques
          naturels et industriels, qualite de l&apos;eau potable et performance
          energetique (DPE).
        </p>
      </div>

      <AddressSearch placeholder="Rechercher une adresse dans ce departement..." />

      {communes.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3">
            Communes principales ({communes.length})
          </h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {communes.map((c) => (
              <Link
                key={c.code}
                href={`/commune/${c.code}`}
                className="rounded-lg border px-4 py-3 hover:bg-accent transition-colors"
              >
                <span className="font-medium">{c.nom}</span>
                {c.population != null && (
                  <span className="text-sm text-muted-foreground ml-2">
                    {c.population.toLocaleString("fr-FR")} hab.
                  </span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {region && siblingDepartements.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3">
            Departements en {region.name}
          </h2>
          <div className="flex flex-wrap gap-2">
            {siblingDepartements.map((dep) => (
              <Link
                key={dep.code}
                href={`/departement/${dep.code}`}
                className="rounded-full border px-3 py-1 text-sm hover:bg-accent transition-colors"
              >
                {dep.name} ({dep.code})
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-lg font-semibold mb-3">
          Guides sur les risques
        </h2>
        <div className="flex flex-wrap gap-2">
          {RISK_NAV.map((risk) => (
            <Link
              key={risk.type}
              href={`/risque/${risk.type}`}
              className="rounded-full border px-3 py-1 text-sm hover:bg-accent transition-colors"
            >
              {risk.label}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
