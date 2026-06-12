export interface FaqEntry {
  question: string;
  answer: string;
}

export interface FaqSection {
  title: string;
  entries: FaqEntry[];
}

export const FAQ_SECTIONS: FaqSection[] = [
  {
    title: "Le service",
    entries: [
      {
        question: "Qu'est-ce que DiagAdresse ?",
        answer:
          "DiagAdresse est un service en ligne gratuit qui agrège les données publiques françaises (Géorisques, HubEau, ADEME, data.gouv) pour fournir un diagnostic complet d'une adresse : risques naturels et industriels, qualité de l'eau potable et performance énergétique des logements du quartier.",
      },
      {
        question: "DiagAdresse est-il gratuit ?",
        answer:
          "Oui, l'ensemble des diagnostics est gratuit et sans inscription. Aucune carte bancaire n'est demandée, aucune adresse email n'est exigée. Le service est financé par les visiteurs curieux et par l'auteur du site.",
      },
      {
        question: "Comment obtenir le diagnostic de mon adresse ?",
        answer:
          "Saisissez votre adresse dans la barre de recherche de la page d'accueil, sélectionnez la suggestion correspondante puis consultez la page diagnostic. Vous pouvez aussi naviguer par commune, département ou région pour obtenir une vue agrégée.",
      },
      {
        question: "Pour quelles adresses le service fonctionne-t-il ?",
        answer:
          "DiagAdresse couvre l'ensemble des adresses de France métropolitaine et d'outre-mer (Guadeloupe, Martinique, Guyane, La Réunion, Mayotte, Saint-Pierre-et-Miquelon, Saint-Barthélemy, Saint-Martin) référencées par la Base Adresse Nationale (BAN). Certaines données (qualité de l'eau, DPE) peuvent être indisponibles pour les communes les moins peuplées.",
      },
    ],
  },
  {
    title: "Données et sources",
    entries: [
      {
        question: "Quelles sont les sources utilisées par DiagAdresse ?",
        answer:
          "Les données proviennent exclusivement de sources publiques françaises : Base Adresse Nationale (BAN) et Géoplateforme IGN pour le géocodage, Géorisques (ministère de la Transition écologique) pour les risques naturels et industriels, HubEau (Office français de la Biodiversité) pour la qualité de l'eau, et ADEME pour les diagnostics de performance énergétique.",
      },
      {
        question: "À quelle fréquence les données sont-elles mises à jour ?",
        answer:
          "Les API publiques utilisées actualisent leurs données selon leurs propres rythmes : quotidiennement pour HubEau, plusieurs fois par mois pour Géorisques, et en continu pour la base DPE de l'ADEME. DiagAdresse interroge ces API à chaque consultation et met en cache les pages communales pendant 7 jours pour les performances.",
      },
      {
        question: "Les données sont-elles officielles ?",
        answer:
          "Oui, toutes les données proviennent d'API gouvernementales françaises. DiagAdresse n'ajoute ni ne modifie aucune valeur : les chiffres affichés correspondent à ceux publiés par les opérateurs publics. Les scores de risque (faible, moyen, fort) sont une agrégation visuelle calculée par DiagAdresse à partir des valeurs brutes.",
      },
      {
        question:
          "Pourquoi certaines informations manquent-elles pour mon adresse ?",
        answer:
          "Plusieurs causes sont possibles : la commune peut ne pas être couverte par un PPR pour un risque donné, les prélèvements d'eau potable récents peuvent manquer, les DPE sont publiés à la maille du quartier (IRIS) donc indisponibles pour certaines petites communes. L'absence d'information dans une rubrique ne préjuge ni de la présence ni de l'absence du risque.",
      },
    ],
  },
  {
    title: "Diagnostic et contenu",
    entries: [
      {
        question: "Quels risques sont couverts par DiagAdresse ?",
        answer:
          "Six familles de risques : inondation, séisme, retrait-gonflement des argiles, radon, installations classées (ICPE / Seveso) et cavités souterraines. S'y ajoutent la qualité de l'eau potable (21 paramètres) et la distribution des diagnostics de performance énergétique (DPE) dans le quartier.",
      },
      {
        question:
          "DiagAdresse remplace-t-il l'État des Risques et Pollutions ?",
        answer:
          "Non. L'État des Risques et Pollutions (ERP), parfois appelé Information Acquéreur Locataire (IAL), est un document officiel obligatoire à la vente et à la location, qui doit être fourni par le vendeur ou le bailleur. DiagAdresse vous permet de préparer votre analyse ou de vérifier les informations, mais ne peut être produit en lieu et place de l'ERP officiel.",
      },
      {
        question: "Comment sont calculés les scores de risque ?",
        answer:
          "Les scores (négligeable, faible, moyen, fort) sont calculés à partir des valeurs brutes des API publiques, selon une grille de correspondance propre à DiagAdresse. Par exemple, la zone sismique 1-2 donne un score négligeable ou faible, la zone 3 un score moyen, les zones 4-5 un score fort. Le code source des règles d'agrégation est public sur le dépôt GitHub du projet.",
      },
      {
        question: "Puis-je utiliser DiagAdresse avant un achat immobilier ?",
        answer:
          "Oui, c'est l'un des principaux usages du service. Il vous permet de vérifier l'exposition d'un bien avant une visite ou un compromis, de préparer vos questions au vendeur ou à l'agent immobilier, et de croiser l'information avec l'ERP qui vous sera remis. En aucun cas il ne dispense de l'ERP officiel, de l'étude géotechnique G1 ou des diagnostics immobiliers réglementaires.",
      },
      {
        question: "Puis-je partager un diagnostic ?",
        answer:
          "Oui. Chaque page diagnostic dispose d'une URL stable que vous pouvez copier et partager par email, messagerie ou réseaux sociaux. Le destinataire accède directement à la même vue, sans compte ni inscription.",
      },
    ],
  },
  {
    title: "Légal et confidentialité",
    entries: [
      {
        question: "Le diagnostic a-t-il une valeur juridique ?",
        answer:
          "Non. DiagAdresse fournit une information à titre indicatif, construite à partir de données publiques. Il ne constitue ni un acte authentique, ni une expertise, ni un diagnostic réglementaire. Pour toute décision juridique (vente, bail, urbanisme), référez-vous à l'État des Risques et Pollutions officiel, aux diagnostics immobiliers réglementaires et aux documents d'urbanisme en vigueur.",
      },
      {
        question: "Mes recherches sont-elles conservées ?",
        answer:
          "DiagAdresse n'exige aucun compte, ne dépose aucun cookie publicitaire et ne stocke ni l'historique de recherche ni l'adresse IP des visiteurs. Des mesures d'audience anonymisées (Vercel Analytics) et des indicateurs de performance web (Vercel Speed Insights) sont collectés pour améliorer le service, conformément au RGPD.",
      },
      {
        question: "Comment signaler une erreur ou suggérer une amélioration ?",
        answer:
          "Si vous constatez une information manifestement erronée ou absente, le plus efficace est de signaler l'anomalie directement sur la source concernée (Géorisques, HubEau, ADEME) car DiagAdresse se contente d'afficher les données publiques. Pour une suggestion d'amélioration du site, ouvrez une issue sur le dépôt GitHub via le lien en pied de page.",
      },
    ],
  },
];

export const ALL_FAQ_ENTRIES: FaqEntry[] = FAQ_SECTIONS.flatMap(
  (s) => s.entries,
);
