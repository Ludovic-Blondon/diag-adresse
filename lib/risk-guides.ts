export interface RiskGuide {
  title: string;
  description: string;
  content: string;
  faq: { question: string; answer: string }[];
}

export const RISK_GUIDES: Record<string, RiskGuide> = {
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
    faq: [
      {
        question: "Comment savoir si mon logement est en zone inondable ?",
        answer:
          "Consultez le Plan de Prevention des Risques d'Inondation (PPRi) de votre commune sur Georisques.gouv.fr ou utilisez DiagAdresse pour obtenir un diagnostic complet de votre adresse.",
      },
      {
        question: "L'assurance couvre-t-elle les inondations ?",
        answer:
          "Oui, la garantie catastrophe naturelle est incluse dans tous les contrats d'assurance habitation en France. Elle couvre les dommages causes par les inondations apres publication d'un arrete de catastrophe naturelle.",
      },
    ],
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
    faq: [
      {
        question: "Quelle est la zone sismique de ma commune ?",
        answer:
          "La France compte 5 zones de sismicite (1 a 5). Utilisez DiagAdresse pour connaitre la zone sismique de votre adresse. Les zones 3 a 5 imposent des normes parasismiques pour les constructions neuves.",
      },
      {
        question: "Les normes parasismiques sont-elles obligatoires ?",
        answer:
          "Les regles Eurocode 8 sont obligatoires pour les constructions neuves en zones 2 a 5. Elles imposent des dispositions constructives adaptees au niveau de sismicite local.",
      },
    ],
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
    faq: [
      {
        question:
          "Comment savoir si mon terrain est expose au retrait-gonflement des argiles ?",
        answer:
          "Les niveaux d'exposition vont de 0 (non concerne) a 3 (exposition forte). Utilisez DiagAdresse pour connaitre le niveau d'exposition de votre adresse a partir des donnees Georisques.",
      },
      {
        question: "Quelles precautions prendre pour construire sur sol argileux ?",
        answer:
          "Il est recommande de realiser des fondations profondes et rigides, d'installer un drainage perimetrique, d'eviter les plantations d'arbres trop pres des fondations, et de maintenir un taux d'humidite constant autour des fondations.",
      },
    ],
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
    faq: [
      {
        question: "Le radon est-il dangereux pour la sante ?",
        answer:
          "Oui, le radon est la deuxieme cause de cancer du poumon apres le tabac. C'est un gaz radioactif naturel, inodore et incolore, qui peut s'accumuler dans les batiments. Il est recommande de mesurer le taux de radon dans votre logement.",
      },
      {
        question: "Comment reduire le radon dans ma maison ?",
        answer:
          "Aerez regulierement votre logement, etancheifiez les points d'entree (sol, murs en contact avec le sol), et en construction neuve prevoyez une membrane anti-radon. Des detecteurs sont disponibles en pharmacie pour mesurer le taux.",
      },
    ],
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
    faq: [
      {
        question: "Comment savoir s'il y a un site Seveso pres de chez moi ?",
        answer:
          "Utilisez DiagAdresse pour identifier les installations classees (ICPE) et sites Seveso a proximite de votre adresse. Les donnees proviennent de la base Georisques du ministere de l'Ecologie.",
      },
      {
        question: "Qu'est-ce que la directive Seveso ?",
        answer:
          "La directive Seveso est une reglementation europeenne qui impose des mesures de prevention et de protection aux sites industriels presentant des risques d'accidents majeurs. Les sites sont classes en seuil haut (risque majeur) et seuil bas (risque significatif).",
      },
    ],
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
    faq: [
      {
        question: "Comment verifier la presence de cavites souterraines ?",
        answer:
          "Consultez la base de donnees des cavites sur Georisques.gouv.fr ou utilisez DiagAdresse pour obtenir un diagnostic complet. Avant un achat immobilier, faites realiser une etude geotechnique.",
      },
      {
        question: "Quels sont les risques des cavites souterraines ?",
        answer:
          "Les cavites souterraines peuvent provoquer un affaissement progressif du terrain, un effondrement brutal (fontis), ou la fissuration des constructions en surface. Le risque depend du type de cavite et de sa profondeur.",
      },
    ],
  },
};
