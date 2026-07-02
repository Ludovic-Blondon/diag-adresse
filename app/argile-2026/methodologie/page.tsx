import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { BASE_URL } from "@/lib/constants";
import { getArgileSummary, ARGILE_LEVEL_LABELS } from "@/lib/argile/data";

const TITLE =
  "Méthodologie : comment nous comparons les cartes argile 2020 et 2026";
const DESCRIPTION =
  "Sources, traitement et limites du comparatif communal du retrait-gonflement des argiles (RGA) entre les millésimes 2020 et 2026. Données Géorisques / BRGM et IGN, Licence Ouverte, calcul reproductible.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "article",
    locale: "fr_FR",
    siteName: "DiagAdresse",
    url: `${BASE_URL}/argile-2026/methodologie`,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  alternates: { canonical: "/argile-2026/methodologie" },
};

const SOURCES = [
  {
    nom: "Aléa RGA 2020 (loi ELAN)",
    detail:
      "Carte d'exposition au retrait-gonflement des argiles, millésime 2020. Shapefile, Lambert 93 (RGF93 / EPSG:2154).",
    href: "https://www.georisques.gouv.fr/donnees/bases-de-donnees/retrait-gonflement-des-argiles-version-2020",
    label: "Géorisques / BRGM",
  },
  {
    nom: "Aléa RGA 2026 (arrêté du 9 janvier 2026)",
    detail:
      "Carte mise à jour intégrant la sinistralité 2018–2022 et le changement climatique. Shapefile, Lambert 93.",
    href: "https://www.georisques.gouv.fr/donnees/bases-de-donnees/retrait-gonflement-des-argiles-version-2026",
    label: "Géorisques / BRGM",
  },
  {
    nom: "Contours communaux",
    detail:
      "Géométries des 34 745 communes de France métropolitaine, récupérées via l'API Découpage administratif (géométries dérivées d'IGN Admin Express), reprojetées en Lambert 93.",
    href: "https://geo.api.gouv.fr/decoupage-administratif",
    label: "geo.api.gouv.fr / IGN",
  },
];

export default function ArgileMethodologiePage() {
  const summary = getArgileSummary();
  const nat = summary?.national;

  return (
    <main className="mx-auto w-full max-w-3xl space-y-10 px-4 py-8">
      <header className="space-y-3">
        <Breadcrumbs
          items={[
            { name: "Carte argile 2026", href: "/argile-2026" },
            { name: "Méthodologie", href: "/argile-2026/methodologie" },
          ]}
        />
        <h1 className="text-3xl font-bold">{TITLE}</h1>
        <p className="text-muted-foreground leading-relaxed">
          Ce comparatif croise les deux cartes officielles d&apos;exposition au
          retrait-gonflement des argiles (RGA) — millésimes 2020 et 2026 — avec
          les contours communaux, pour mesurer, commune par commune, ce que
          change l&apos;arrêté du 9 janvier 2026. Le calcul est reproductible et
          ne repose que sur des données publiques sous Licence Ouverte.
        </p>
      </header>

      <article className="space-y-8">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Sources</h2>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="px-3 py-2 font-medium">Jeu de données</th>
                  <th className="px-3 py-2 font-medium">Détail</th>
                  <th className="px-3 py-2 font-medium">Source</th>
                </tr>
              </thead>
              <tbody>
                {SOURCES.map((s) => (
                  <tr key={s.nom} className="border-t align-top">
                    <td className="px-3 py-2 font-medium">{s.nom}</td>
                    <td className="text-muted-foreground px-3 py-2">
                      {s.detail}
                    </td>
                    <td className="px-3 py-2">
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline-offset-4 hover:underline"
                      >
                        {s.label}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Les fichiers bruts (plusieurs Go) ne sont pas redistribués ici : ils
            se téléchargent directement depuis Géorisques. Seuls le résultat du
            croisement et son agrégat sont publiés.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Traitement</h2>
          <ol className="text-muted-foreground list-decimal space-y-2 pl-5 leading-relaxed">
            <li>
              Les trois couches sont ramenées à la même projection métrique,
              Lambert 93 (EPSG:2154), pour des calculs de surface fiables.
            </li>
            <li>
              Pour chaque millésime, on croise (intersection géométrique) la
              carte d&apos;aléa avec le contour de chaque commune et on
              additionne les surfaces par classe d&apos;exposition.
            </li>
            <li>
              On retient la{" "}
              <strong>classe d&apos;aléa maximale présente</strong> sur la
              commune — lecture de prudence pour l&apos;acquéreur — ainsi que le
              pourcentage de surface communale en aléa moyen ou fort.
            </li>
            <li>
              <strong>Filtre anti-résidus</strong> : une classe n&apos;est
              comptée pour ce maximum que si son emprise atteint au moins 1 % de
              la surface communale <em>ou</em> 1 hectare. Cela évite qu&apos;un
              minuscule débord de polygone à la frontière d&apos;une commune ne
              fasse basculer tout son classement.
            </li>
            <li>
              Le <strong>delta</strong> d&apos;une commune est la différence de
              classe maximale entre 2026 et 2020 (par ex. +1 = passage de
              moyenne à forte).
            </li>
          </ol>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Le script de calcul (Python / geopandas) est versionné dans le dépôt
            (
            <code className="bg-muted rounded px-1 py-0.5 text-xs">
              scripts/argile/compute_rga_diff.py
            </code>
            ) : à partir des mêmes fichiers sources, il régénère à
            l&apos;identique les résultats publiés.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Classes d&apos;exposition</h2>
          <p className="text-muted-foreground leading-relaxed">
            La carte RGA distingue quatre niveaux d&apos;exposition :
          </p>
          <ul className="text-muted-foreground grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[0, 1, 2, 3].map((n) => (
              <li key={n} className="bg-muted/50 rounded-lg border px-3 py-2">
                <div className="text-foreground text-sm font-medium capitalize">
                  {ARGILE_LEVEL_LABELS[n]}
                </div>
                <div className="text-xs">niveau {n}</div>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Limites et précautions</h2>
          <ul className="text-muted-foreground list-disc space-y-2 pl-5 leading-relaxed">
            <li>
              La carte est une{" "}
              <strong>indication à l&apos;échelle communale</strong> : elle ne
              remplace pas une étude géotechnique à la parcelle, seule à même de
              confirmer l&apos;exposition d&apos;un terrain précis.
            </li>
            <li>
              Le comparatif porte sur la{" "}
              <strong>France métropolitaine, Corse comprise</strong>. La ville
              de Paris (75) est absente de la carte d&apos;exposition RGA ; les
              départements et régions d&apos;outre-mer ne sont pas couverts par
              ce jeu de données.
            </li>
            <li>
              Les deux millésimes sont calés sur les{" "}
              <strong>mêmes contours communaux</strong> : les écarts observés
              reflètent l&apos;évolution de la carte d&apos;aléa, non un
              changement de découpage.
            </li>
            <li>
              Quelques communes voient leur classe maximale baisser : il
              s&apos;agit soit de reclassements réels, soit de petites emprises
              repassant sous le seuil anti-résidus. Ces cas sont marginaux et
              signalés comme tels.
            </li>
          </ul>
        </section>

        {nat && (
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Résultats du calcul</h2>
            <div className="bg-muted/50 grid grid-cols-2 gap-3 rounded-lg border p-4 sm:grid-cols-4">
              <div>
                <div className="text-xl font-bold">
                  {nat.n.toLocaleString("fr-FR")}
                </div>
                <div className="text-muted-foreground text-xs">
                  communes analysées
                </div>
              </div>
              <div>
                <div className="text-xl font-bold">
                  {nat.up.toLocaleString("fr-FR")}
                </div>
                <div className="text-muted-foreground text-xs">
                  classe maximale en hausse
                </div>
              </div>
              <div>
                <div className="text-xl font-bold">
                  {nat.same.toLocaleString("fr-FR")}
                </div>
                <div className="text-muted-foreground text-xs">inchangées</div>
              </div>
              <div>
                <div className="text-xl font-bold">
                  {nat.down.toLocaleString("fr-FR")}
                </div>
                <div className="text-muted-foreground text-xs">en baisse</div>
              </div>
            </div>
          </section>
        )}

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Licence et attribution</h2>
          <p className="text-muted-foreground leading-relaxed">
            Données sous <strong>Licence Ouverte / Etalab 2.0</strong>. Toute
            réutilisation doit mentionner l&apos;origine des données :{" "}
            <span className="text-foreground">
              « Source : Géorisques / BRGM, IGN — Licence Ouverte 2.0 »
            </span>
            . Le comparatif présenté ici peut être cité en créditant DiagAdresse
            et les sources ci-dessus.
          </p>
        </section>
      </article>

      <section className="flex flex-wrap gap-3">
        <Link
          href="/argile-2026"
          className="hover:bg-accent rounded-lg border px-4 py-2 text-sm transition-colors"
        >
          ← Retour au dossier carte argile 2026
        </Link>
        <Link
          href="/risque/argile"
          className="hover:bg-accent rounded-lg border px-4 py-2 text-sm transition-colors"
        >
          Guide : le risque retrait-gonflement des argiles
        </Link>
      </section>
    </main>
  );
}
