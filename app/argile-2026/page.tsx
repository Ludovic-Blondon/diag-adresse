import type { Metadata } from "next";
import Link from "next/link";
import { AddressSearch } from "@/components/address-search";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { faqPageJsonLd } from "@/lib/json-ld";
import { BASE_URL } from "@/lib/constants";
import { DEPARTEMENTS } from "@/lib/departements";
import { getArgileSummary } from "@/lib/argile/data";

const TITLE = "Nouvelle carte argile 2026 : ce qui change commune par commune";
const DESCRIPTION =
  "L'arrêté du 9 janvier 2026 met à jour la carte d'exposition au retrait-gonflement des argiles, applicable au 1er juillet 2026. Comparatif des cartes 2020 et 2026, département par département.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "article",
    locale: "fr_FR",
    siteName: "DiagAdresse",
    url: `${BASE_URL}/argile-2026`,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  alternates: { canonical: "/argile-2026" },
};

const FAQ = [
  {
    question: "Quand la nouvelle carte argile entre-t-elle en vigueur ?",
    answer:
      "L'arrêté est daté du 9 janvier 2026 et la carte s'applique aux promesses et actes de vente de terrains non bâtis constructibles, ainsi qu'aux contrats de construction de maison individuelle, conclus à compter du 1er juillet 2026.",
  },
  {
    question: "Qu'est-ce qui change par rapport à la carte de 2020 ?",
    answer:
      "La carte intègre la sinistralité récente (environ 240 000 sinistres entre 2018 et 2022) et le changement climatique. Les zones d'exposition moyenne et forte passent de 48 % à 55 % du territoire métropolitain, et de nombreuses communes changent de classe.",
  },
  {
    question: "Ma maison déjà construite est-elle concernée ?",
    answer:
      "Non. La nouvelle carte ne crée pas d'obligation d'étude de sol pour un logement déjà bâti. L'exposition reste mentionnée dans l'état des risques (IAL) remis à l'acheteur ou au locataire.",
  },
  {
    question: "Comment vérifier l'exposition de mon adresse ?",
    answer:
      "Lancez une recherche d'adresse sur DiagAdresse : le diagnostic affiche le niveau d'exposition au retrait-gonflement des argiles à partir des données Géorisques et du BRGM, aux côtés des autres risques. La carte reste une indication communale ; l'exposition d'un terrain se confirme à la parcelle.",
  },
  {
    question: "D'où viennent les données de ce comparatif ?",
    answer:
      "Du croisement des cartes d'exposition RGA 2020 et 2026 publiées par Géorisques / BRGM avec les contours communaux de l'IGN. La méthodologie et les sources sont publiées et reproductibles, sous Licence Ouverte (Etalab 2.0).",
  },
];

export default function Argile2026Page() {
  const summary = getArgileSummary();
  const topDeps = summary
    ? Object.entries(summary.departements)
        .filter(([, d]) => d.up > 0)
        .sort((a, b) => b[1].up - a[1].up)
        .slice(0, 15)
    : [];

  return (
    <main className="mx-auto w-full max-w-3xl space-y-10 px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd(FAQ)) }}
      />

      <header className="space-y-3">
        <Breadcrumbs
          items={[{ name: "Carte argile 2026", href: "/argile-2026" }]}
        />
        <h1 className="text-3xl font-bold">{TITLE}</h1>
        <p className="text-muted-foreground leading-relaxed">
          L&apos;arrêté du 9 janvier 2026 met à jour la carte nationale
          d&apos;exposition au retrait-gonflement des argiles (RGA), qui datait
          de 2020. Elle s&apos;applique à compter du 1<sup>er</sup> juillet
          2026. Les zones d&apos;exposition moyenne et forte passent de 48 % à
          55 % du territoire métropolitain, et de nombreuses communes changent
          de classe.
        </p>
      </header>

      {summary && (
        <aside
          aria-label="Chiffres clés"
          className="bg-muted/50 grid grid-cols-2 gap-3 rounded-lg border p-4 sm:grid-cols-4"
        >
          <div>
            <div className="text-xl font-bold">48 % → 55 %</div>
            <div className="text-muted-foreground text-xs">
              du territoire en exposition moyenne/forte (2020 → 2026)
            </div>
          </div>
          <div>
            <div className="text-xl font-bold">
              {summary.national.up.toLocaleString("fr-FR")}
            </div>
            <div className="text-muted-foreground text-xs">
              communes passent à une exposition supérieure
            </div>
          </div>
          <div>
            <div className="text-xl font-bold">
              {summary.national.n.toLocaleString("fr-FR")}
            </div>
            <div className="text-muted-foreground text-xs">
              communes analysées
            </div>
          </div>
          <div>
            <div className="text-xl font-bold">1er juillet 2026</div>
            <div className="text-muted-foreground text-xs">
              entrée en application
            </div>
          </div>
        </aside>
      )}

      <article className="space-y-8">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Ce qui change concrètement</h2>
          <p className="text-muted-foreground leading-relaxed">
            La carte redéfinit le périmètre des obligations attachées aux
            terrains à bâtir et aux constructions neuves. Elle concerne les
            promesses et actes de vente de terrains non bâtis constructibles et
            les contrats de construction de maison individuelle (CCMI) conclus à
            partir du 1<sup>er</sup> juillet 2026, en zone d&apos;exposition
            moyenne ou forte. Elle ne s&apos;applique pas rétroactivement aux
            ventes déjà signées et ne crée pas d&apos;obligation nouvelle sur le
            bâti existant.
          </p>
        </section>

        {topDeps.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">
              Départements où le plus de communes changent
            </h2>
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left">
                  <tr>
                    <th className="px-3 py-2 font-medium">Département</th>
                    <th className="px-3 py-2 text-right font-medium">
                      Communes en hausse
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topDeps.map(([dep, d]) => (
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
                        {d.up.toLocaleString("fr-FR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Méthodologie</h2>
          <p className="text-muted-foreground leading-relaxed">
            Ce comparatif croise les cartes d&apos;exposition RGA 2020 et 2026
            publiées par Géorisques / BRGM avec les contours communaux de
            l&apos;IGN. Pour chaque commune, nous retenons la classe d&apos;aléa
            maximale présente (lecture de prudence pour l&apos;acquéreur) et le
            pourcentage de surface en aléa moyen ou fort. La carte est une
            indication à l&apos;échelle communale : elle ne remplace pas une
            étude géotechnique à la parcelle. Données sous Licence Ouverte
            (Etalab 2.0) — Source : Géorisques / BRGM, IGN.
          </p>
          <Link
            href="/argile-2026/methodologie"
            className="text-primary text-sm underline-offset-4 hover:underline"
          >
            Sources détaillées, traitement et limites →
          </Link>
        </section>
      </article>

      <div className="bg-muted/50 space-y-3 rounded-lg border p-6">
        <h2 className="font-semibold">Vérifiez votre adresse</h2>
        <p className="text-muted-foreground text-sm">
          Consultez le diagnostic complet et le niveau d&apos;exposition argile
          de votre adresse :
        </p>
        <AddressSearch />
      </div>

      <section>
        <h2 className="mb-3 text-xl font-semibold">Questions fréquentes</h2>
        <div className="space-y-2">
          {FAQ.map((q) => (
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

      <section className="flex flex-wrap gap-3">
        <Link
          href="/risque/argile"
          className="hover:bg-accent rounded-lg border px-4 py-2 text-sm transition-colors"
        >
          Guide : le risque retrait-gonflement des argiles
        </Link>
        <Link
          href="/blog/nouvelle-carte-argile-2026"
          className="hover:bg-accent rounded-lg border px-4 py-2 text-sm transition-colors"
        >
          Article : ce qui change au 1er juillet
        </Link>
      </section>
    </main>
  );
}
