import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { BASE_URL } from "@/lib/constants";
import { DEPARTEMENTS } from "@/lib/departements";
import { getArgileSummary } from "@/lib/argile/data";

const TITLE = "Espace presse : les données de la nouvelle carte argile 2026";
const DESCRIPTION =
  "Données réutilisables du comparatif communal des cartes argile 2020 et 2026 : export CSV par département, chiffres clés nationaux, méthodologie publiée. Licence Ouverte Etalab 2.0.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "article",
    locale: "fr_FR",
    siteName: "DiagAdresse",
    url: `${BASE_URL}/argile-2026/presse`,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  alternates: { canonical: "/argile-2026/presse" },
};

export default function ArgilePressePage() {
  const summary = getArgileSummary();
  const deps = summary
    ? Object.entries(summary.departements).sort(([a], [b]) =>
        a.localeCompare(b),
      )
    : [];

  return (
    <main className="mx-auto w-full max-w-3xl space-y-10 px-4 py-8">
      <header className="space-y-3">
        <Breadcrumbs
          items={[
            { name: "Carte argile 2026", href: "/argile-2026" },
            { name: "Espace presse", href: "/argile-2026/presse" },
          ]}
        />
        <h1 className="text-3xl font-bold">{TITLE}</h1>
        <p className="text-muted-foreground leading-relaxed">
          La nouvelle carte d&apos;exposition au retrait-gonflement des argiles
          s&apos;applique depuis le 1<sup>er</sup> juillet 2026. Nous avons
          comparé, commune par commune, la carte 2026 à celle de 2020 : ces
          données sont librement réutilisables pour vos articles, cartes et
          infographies, avec la mention de source ci-dessous.
        </p>
      </header>

      {summary && (
        <aside
          aria-label="Chiffres clés"
          className="bg-muted/50 grid grid-cols-2 gap-3 rounded-lg border p-4 sm:grid-cols-4"
        >
          <div>
            <div className="text-xl font-bold">
              {summary.national.n.toLocaleString("fr-FR")}
            </div>
            <div className="text-muted-foreground text-xs">
              communes analysées (France métropolitaine)
            </div>
          </div>
          <div>
            <div className="text-xl font-bold">
              {summary.national.up.toLocaleString("fr-FR")}
            </div>
            <div className="text-muted-foreground text-xs">
              communes dont l&apos;exposition maximale augmente
            </div>
          </div>
          <div>
            <div className="text-xl font-bold">
              {summary.national.down.toLocaleString("fr-FR")}
            </div>
            <div className="text-muted-foreground text-xs">
              communes en baisse
            </div>
          </div>
          <div>
            <div className="text-xl font-bold">48 % → 55 %</div>
            <div className="text-muted-foreground text-xs">
              du territoire en exposition moyenne/forte (chiffres officiels)
            </div>
          </div>
        </aside>
      )}

      <article className="space-y-8">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">
            Un angle local prêt à l&apos;emploi
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Pour chaque département, le fichier CSV liste toutes les communes
            avec leur classe d&apos;exposition 2020 et 2026, l&apos;évolution,
            et la part de surface en aléa moyen ou fort — de quoi répondre
            localement à la question que se posent vos lecteurs :{" "}
            <em>
              « ma commune est-elle concernée par la nouvelle carte argile ? »
            </em>{" "}
            Les colonnes s&apos;ouvrent directement dans Excel ou LibreOffice.
          </p>
        </section>

        {deps.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">
              Données par département (CSV)
            </h2>
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left">
                  <tr>
                    <th className="px-3 py-2 font-medium">Département</th>
                    <th className="px-3 py-2 text-right font-medium">
                      Communes
                    </th>
                    <th className="px-3 py-2 text-right font-medium">
                      En hausse
                    </th>
                    <th className="px-3 py-2 text-right font-medium">
                      Téléchargement
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {deps.map(([dep, d]) => (
                    <tr key={dep} className="border-t">
                      <td className="px-3 py-2">
                        <Link
                          href={`/argile-2026/departement/${dep}`}
                          className="text-primary underline-offset-4 hover:underline"
                        >
                          {DEPARTEMENTS[dep] ?? dep} ({dep})
                        </Link>
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums">
                        {d.n.toLocaleString("fr-FR")}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums">
                        {d.up.toLocaleString("fr-FR")}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <a
                          href={`/argile-2026/departement/${dep}/communes.csv`}
                          className="text-primary underline-offset-4 hover:underline"
                          download
                        >
                          CSV
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Comment citer ces données</h2>
          <p className="text-muted-foreground leading-relaxed">
            Les données sources sont publiées sous{" "}
            <strong>Licence Ouverte / Etalab 2.0</strong>. Mention à faire
            figurer :{" "}
            <span className="text-foreground">
              « Source : Géorisques / BRGM, IGN — analyse DiagAdresse »
            </span>
            . Le détail du calcul (croisement géométrique, seuils, limites) est
            publié sur la{" "}
            <Link
              href="/argile-2026/methodologie"
              className="text-primary underline-offset-4 hover:underline"
            >
              page méthodologie
            </Link>{" "}
            et reproductible à partir des données publiques.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Ce que disent les données</h2>
          <ul className="text-muted-foreground list-disc space-y-2 pl-5 leading-relaxed">
            <li>
              La classe d&apos;exposition indiquée est la classe{" "}
              <strong>maximale</strong> présente sur la commune (lecture de
              prudence) : une commune « forte » n&apos;est pas forcément exposée
              sur toute sa surface — voir la colonne « part de surface en aléa
              moyen/fort ».
            </li>
            <li>
              La carte s&apos;applique aux ventes de terrains constructibles non
              bâtis et aux contrats de construction conclus depuis le 1
              <sup>er</sup> juillet 2026 ; elle ne crée pas d&apos;obligation
              nouvelle sur les logements existants.
            </li>
            <li>
              L&apos;exposition d&apos;une parcelle précise se vérifie par une
              étude géotechnique ; la carte est une indication communale.
            </li>
          </ul>
        </section>
      </article>

      <section className="flex flex-wrap gap-3">
        <Link
          href="/argile-2026"
          className="hover:bg-accent rounded-lg border px-4 py-2 text-sm transition-colors"
        >
          ← Dossier carte argile 2026
        </Link>
        <Link
          href="/argile-2026/methodologie"
          className="hover:bg-accent rounded-lg border px-4 py-2 text-sm transition-colors"
        >
          Méthodologie du comparatif
        </Link>
      </section>
    </main>
  );
}
