import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddressSearch } from "@/components/address-search";

const RISK_GUIDES: Record<
  string,
  { title: string; description: string; content: string }
> = {
  inondation: {
    title: "Risque inondation en France",
    description:
      "Tout savoir sur le risque inondation : zones concernees, plans de prevention, et comment proteger votre habitation.",
    content: `L'inondation est le premier risque naturel en France. Elle peut etre causee par le debordement de cours d'eau, le ruissellement urbain, la remontee de nappe ou la submersion marine.

**Comment connaitre votre exposition ?**
Le Plan de Prevention des Risques d'Inondation (PPRi) definit les zones exposees et les regles de construction. La base Georisques recense les communes concernees.

**Que faire en cas de risque ?**
- Consulter le PPRi de votre commune
- Verifier la cote altimetrique de votre bien
- Souscrire une assurance incluant la garantie catastrophe naturelle
- Preparer un kit d'urgence`,
  },
  seisme: {
    title: "Risque sismique en France",
    description:
      "Comprendre le zonage sismique francais, les niveaux de risque et les normes de construction parasismique.",
    content: `La France est divisee en 5 zones de sismicite, de la zone 1 (tres faible) a la zone 5 (forte, Antilles).

**Le zonage sismique :**
- Zone 1 : sismicite tres faible
- Zone 2 : sismicite faible
- Zone 3 : sismicite moderee
- Zone 4 : sismicite moyenne
- Zone 5 : sismicite forte (Guadeloupe, Martinique)

**Normes de construction :**
Les regles Eurocode 8 s'appliquent pour les constructions neuves en zones 2 a 5. Elles imposent des dispositions constructives adaptees au niveau de sismicite.`,
  },
  argile: {
    title: "Retrait-gonflement des argiles",
    description:
      "Le risque de retrait-gonflement des sols argileux : causes, consequences sur le bati et mesures de prevention.",
    content: `Le retrait-gonflement des argiles est la deuxieme cause d'indemnisation au titre des catastrophes naturelles en France.

**Comment ca marche ?**
Les sols argileux gonflent en presence d'eau et se retractent lors des secheresses. Ces mouvements provoquent des fissures dans les constructions.

**Niveaux d'exposition :**
- 0 : non concerne
- 1 : exposition faible
- 2 : exposition moyenne
- 3 : exposition forte

**Mesures de prevention :**
- Fondations profondes et rigides
- Drainage perimetrique
- Eviter les plantations d'arbres trop pres des fondations
- Maintenir un taux d'humidite constant autour des fondations`,
  },
  radon: {
    title: "Risque radon",
    description:
      "Le radon, gaz radioactif naturel : sources, risques pour la sante et solutions pour proteger votre logement.",
    content: `Le radon est un gaz radioactif naturel, inodore et incolore, issu de la desintegration de l'uranium present dans les roches. C'est la deuxieme cause de cancer du poumon apres le tabac.

**Les 3 classes de potentiel radon :**
- Classe 1 : potentiel faible
- Classe 2 : potentiel moyen
- Classe 3 : potentiel significatif

**Que faire ?**
- Mesurer le radon dans votre logement (detecteurs disponibles en pharmacie)
- Aerer regulierement
- Etancheifier les points d'entree (sol, murs en contact avec le sol)
- En construction neuve : prevoir une membrane anti-radon`,
  },
  icpe: {
    title: "Installations classees (ICPE) et sites Seveso",
    description:
      "Les installations industrielles a risque pres de chez vous : classification ICPE, directive Seveso, et prevention.",
    content: `Les Installations Classees pour la Protection de l'Environnement (ICPE) sont des installations industrielles ou agricoles susceptibles de generer des nuisances ou des risques.

**Classification Seveso :**
- Seveso seuil haut : risque majeur, perimetre de securite elargi
- Seveso seuil bas : risque significatif
- ICPE non Seveso : nuisances potentielles

**Comment etre informe ?**
Le Plan de Prevention des Risques Technologiques (PPRT) est obligatoire autour des sites Seveso seuil haut. Il peut imposer des restrictions d'urbanisme ou des travaux de renforcement du bati.

**Vos droits :**
- Information : tout citoyen peut acceder aux donnees sur les ICPE
- Consultation : les enquetes publiques sont obligatoires pour les nouvelles installations`,
  },
  cavites: {
    title: "Cavites souterraines",
    description:
      "Les risques lies aux cavites souterraines : types de cavites, consequences et precautions avant d'acheter.",
    content: `Les cavites souterraines representent un risque d'effondrement pouvant affecter les constructions en surface.

**Types de cavites :**
- Cavites naturelles (grottes, gouffres)
- Carrieres abandonnees
- Ouvrages civils (tunnels, caves)
- Ouvrages militaires

**Consequences possibles :**
- Affaissement progressif du terrain
- Effondrement brutal (fontis)
- Fissuration des constructions

**Avant d'acheter :**
- Consulter la base de donnees des cavites (Georisques)
- Faire realiser une etude geotechnique
- Verifier le Plan de Prevention des Risques lie aux cavites`,
  },
};

interface Props {
  params: Promise<{ type: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params;
  const guide = RISK_GUIDES[type];
  if (!guide) return { title: "Risque introuvable" };
  return { title: guide.title, description: guide.description };
}

export function generateStaticParams() {
  return Object.keys(RISK_GUIDES).map((type) => ({ type }));
}

export default async function RiskGuidePage({ params }: Props) {
  const { type } = await params;
  const guide = RISK_GUIDES[type];

  if (!guide) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 space-y-8">
      <div>
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:underline"
        >
          &larr; Retour
        </Link>
        <h1 className="text-3xl font-bold mt-2">{guide.title}</h1>
        <p className="text-muted-foreground mt-2">{guide.description}</p>
      </div>

      <article className="prose prose-neutral dark:prose-invert max-w-none">
        {guide.content.split("\n\n").map((paragraph, i) => {
          if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
            return (
              <h2 key={i} className="text-xl font-semibold mt-6 mb-3">
                {paragraph.replace(/\*\*/g, "")}
              </h2>
            );
          }
          if (paragraph.startsWith("**")) {
            const [title, ...rest] = paragraph.split("\n");
            return (
              <div key={i}>
                <h3 className="text-lg font-semibold mt-4 mb-2">
                  {title.replace(/\*\*/g, "")}
                </h3>
                {rest.map((line, j) => {
                  if (line.startsWith("- ")) {
                    return (
                      <li key={j} className="ml-4 text-sm text-muted-foreground">
                        {line.slice(2)}
                      </li>
                    );
                  }
                  return (
                    <p key={j} className="text-sm text-muted-foreground">
                      {line}
                    </p>
                  );
                })}
              </div>
            );
          }
          return (
            <p key={i} className="text-sm text-muted-foreground leading-relaxed">
              {paragraph}
            </p>
          );
        })}
      </article>

      <div className="rounded-lg border bg-muted/50 p-6 space-y-3">
        <h2 className="font-semibold">
          Verifiez votre adresse
        </h2>
        <p className="text-sm text-muted-foreground">
          Consultez le diagnostic complet pour votre adresse :
        </p>
        <AddressSearch />
      </div>
    </main>
  );
}
