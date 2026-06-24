import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { BASE_URL } from "@/lib/constants";
import { DEPARTEMENTS } from "@/lib/departements";
import { communePath } from "@/lib/commune-url";
import {
  listAvailableDepartements,
  loadDepartementDiff,
  argileLevelLabel,
  type CommuneArgileDiff,
} from "@/lib/argile/data";

interface Props {
  params: Promise<{ code: string }>;
}

export function generateStaticParams() {
  return listAvailableDepartements().map((code) => ({ code }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const depName = DEPARTEMENTS[code] ?? `département ${code}`;
  const diff = loadDepartementDiff(code);
  const changed = diff
    ? Object.values(diff).filter((c) => c.d !== 0).length
    : 0;
  const title = `Carte argile 2026 en ${depName} : ${changed} communes changent de classe`;
  const description = `Liste des communes de ${depName} dont l'exposition au retrait-gonflement des argiles change entre les cartes 2020 et 2026, applicable au 1er juillet 2026.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      locale: "fr_FR",
      siteName: "DiagAdresse",
      url: `${BASE_URL}/argile-2026/departement/${code}`,
    },
    alternates: { canonical: `/argile-2026/departement/${code}` },
  };
}

function classBadge(diff: CommuneArgileDiff) {
  return `${argileLevelLabel(diff.a20.max)} → ${argileLevelLabel(diff.a26.max)}`;
}

export default async function Argile2026DepartementPage({ params }: Props) {
  const { code } = await params;
  const diff = loadDepartementDiff(code);
  if (!diff) notFound();

  const depName = DEPARTEMENTS[code] ?? `département ${code}`;
  const entries = Object.entries(diff).map(([insee, c]) => ({ insee, ...c }));
  const changed = entries
    .filter((c) => c.d !== 0)
    .sort((a, b) => b.d - a.d || b.a26.pctMF - a.a26.pctMF);
  const unchanged = entries.length - changed.length;

  return (
    <main className="mx-auto w-full max-w-3xl space-y-8 px-4 py-8">
      <header className="space-y-3">
        <Breadcrumbs
          items={[
            { name: "Carte argile 2026", href: "/argile-2026" },
            { name: depName, href: `/argile-2026/departement/${code}` },
          ]}
        />
        <h1 className="text-3xl font-bold">
          Carte argile 2026 en {depName} : {changed.length}{" "}
          {changed.length > 1 ? "communes changent" : "commune change"} de
          classe
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          Sur {entries.length.toLocaleString("fr-FR")} communes analysées,{" "}
          {changed.length.toLocaleString("fr-FR")} changent de classe
          d&apos;exposition au retrait-gonflement des argiles entre la carte de
          2020 et celle de 2026 (applicable au 1<sup>er</sup> juillet 2026).
        </p>
      </header>

      {changed.length > 0 && (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-3 py-2 font-medium">Commune</th>
                <th className="px-3 py-2 font-medium">
                  Exposition 2020 → 2026
                </th>
                <th className="px-3 py-2 text-right font-medium">
                  % surface moyen/fort (2026)
                </th>
              </tr>
            </thead>
            <tbody>
              {changed.map((c) => (
                <tr key={c.insee} className="border-t">
                  <td className="px-3 py-2">
                    <Link
                      href={communePath(c.insee, c.n)}
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      {c.n}
                    </Link>
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={
                        c.d > 0
                          ? "text-amber-700 dark:text-amber-400"
                          : "text-emerald-700 dark:text-emerald-400"
                      }
                    >
                      {classBadge(c)}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {c.a26.pctMF} %
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {unchanged > 0 && (
        <p className="text-muted-foreground text-sm">
          {unchanged.toLocaleString("fr-FR")}{" "}
          {unchanged > 1 ? "communes conservent" : "commune conserve"} leur
          classe d&apos;exposition entre les deux cartes.
        </p>
      )}

      <section className="flex flex-wrap gap-3">
        <Link
          href="/argile-2026"
          className="hover:bg-accent rounded-lg border px-4 py-2 text-sm transition-colors"
        >
          Vue nationale : la carte argile 2026
        </Link>
        <Link
          href="/risque/argile"
          className="hover:bg-accent rounded-lg border px-4 py-2 text-sm transition-colors"
        >
          Comprendre le risque argile
        </Link>
      </section>
    </main>
  );
}
