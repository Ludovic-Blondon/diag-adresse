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
          "DiagAdresse est un service en ligne gratuit qui agrege les donnees publiques francaises (Georisques, HubEau, ADEME, data.gouv) pour fournir un diagnostic complet d'une adresse : risques naturels et industriels, qualite de l'eau potable et performance energetique des logements du quartier.",
      },
      {
        question: "DiagAdresse est-il gratuit ?",
        answer:
          "Oui, l'ensemble des diagnostics est gratuit et sans inscription. Aucune carte bancaire n'est demandee, aucune adresse email n'est exigee. Le service est finance par les visiteurs curieux et par l'auteur du site.",
      },
      {
        question: "Comment obtenir le diagnostic de mon adresse ?",
        answer:
          "Saisissez votre adresse dans la barre de recherche de la page d'accueil, selectionnez la suggestion correspondante puis consultez la page diagnostic. Vous pouvez aussi naviguer par commune, departement ou region pour obtenir une vue agregee.",
      },
      {
        question: "Pour quelles adresses le service fonctionne-t-il ?",
        answer:
          "DiagAdresse couvre l'ensemble des adresses de France metropolitaine et d'outre-mer (Guadeloupe, Martinique, Guyane, La Reunion, Mayotte, Saint-Pierre-et-Miquelon, Saint-Barthelemy, Saint-Martin) referencees par la Base Adresse Nationale (BAN). Certaines donnees (qualite de l'eau, DPE) peuvent etre indisponibles pour les communes les moins peuplees.",
      },
    ],
  },
  {
    title: "Donnees et sources",
    entries: [
      {
        question: "Quelles sont les sources utilisees par DiagAdresse ?",
        answer:
          "Les donnees proviennent exclusivement de sources publiques francaises : Base Adresse Nationale (BAN) et Geoplateforme IGN pour le geocodage, Georisques (ministere de la Transition ecologique) pour les risques naturels et industriels, HubEau (Office francais de la Biodiversite) pour la qualite de l'eau, et ADEME pour les diagnostics de performance energetique.",
      },
      {
        question: "A quelle frequence les donnees sont-elles mises a jour ?",
        answer:
          "Les API publiques utilisees actualisent leurs donnees selon leurs propres rythmes : quotidiennement pour HubEau, plusieurs fois par mois pour Georisques, et en continu pour la base DPE de l'ADEME. DiagAdresse interroge ces API a chaque consultation et met en cache les pages communales pendant 7 jours pour les performances.",
      },
      {
        question: "Les donnees sont-elles officielles ?",
        answer:
          "Oui, toutes les donnees proviennent d'API gouvernementales francaises. DiagAdresse n'ajoute ni ne modifie aucune valeur : les chiffres affiches correspondent a ceux publies par les operateurs publics. Les scores de risque (faible, moyen, fort) sont une agregation visuelle calculee par DiagAdresse a partir des valeurs brutes.",
      },
      {
        question: "Pourquoi certaines informations manquent-elles pour mon adresse ?",
        answer:
          "Plusieurs causes sont possibles : la commune peut ne pas etre couverte par un PPR pour un risque donne, les prelevements d'eau potable recents peuvent manquer, les DPE sont publies a la maille du quartier (IRIS) donc indisponibles pour certaines petites communes. L'absence d'information dans une rubrique ne prejuge ni de la presence ni de l'absence du risque.",
      },
    ],
  },
  {
    title: "Diagnostic et contenu",
    entries: [
      {
        question: "Quels risques sont couverts par DiagAdresse ?",
        answer:
          "Six familles de risques : inondation, seisme, retrait-gonflement des argiles, radon, installations classees (ICPE / Seveso) et cavites souterraines. S'y ajoutent la qualite de l'eau potable (21 parametres) et la distribution des diagnostics de performance energetique (DPE) dans le quartier.",
      },
      {
        question: "DiagAdresse remplace-t-il l'Etat des Risques et Pollutions ?",
        answer:
          "Non. L'Etat des Risques et Pollutions (ERP), parfois appele Information Acquereur Locataire (IAL), est un document officiel obligatoire a la vente et a la location, qui doit etre fourni par le vendeur ou le bailleur. DiagAdresse vous permet de preparer votre analyse ou de verifier les informations, mais ne peut etre produit en lieu et place de l'ERP officiel.",
      },
      {
        question: "Comment sont calcules les scores de risque ?",
        answer:
          "Les scores (negligeable, faible, moyen, fort) sont calcules a partir des valeurs brutes des API publiques, selon une grille de correspondance propre a DiagAdresse. Par exemple, la zone sismique 1-2 donne un score negligeable ou faible, la zone 3 un score moyen, les zones 4-5 un score fort. Le code source des regles d'agregation est public sur le depot GitHub du projet.",
      },
      {
        question: "Puis-je utiliser DiagAdresse avant un achat immobilier ?",
        answer:
          "Oui, c'est l'un des principaux usages du service. Il vous permet de verifier l'exposition d'un bien avant une visite ou un compromis, de preparer vos questions au vendeur ou a l'agent immobilier, et de croiser l'information avec l'ERP qui vous sera remis. En aucun cas il ne dispense de l'ERP officiel, de l'etude geotechnique G1 ou des diagnostics immobiliers reglementaires.",
      },
      {
        question: "Puis-je partager un diagnostic ?",
        answer:
          "Oui. Chaque page diagnostic dispose d'une URL stable que vous pouvez copier et partager par email, messagerie ou reseaux sociaux. Le destinataire accede directement a la meme vue, sans compte ni inscription.",
      },
    ],
  },
  {
    title: "Legal et confidentialite",
    entries: [
      {
        question: "Le diagnostic a-t-il une valeur juridique ?",
        answer:
          "Non. DiagAdresse fournit une information a titre indicatif, construite a partir de donnees publiques. Il ne constitue ni un acte authentique, ni une expertise, ni un diagnostic reglementaire. Pour toute decision juridique (vente, bail, urbanisme), referez-vous a l'Etat des Risques et Pollutions officiel, aux diagnostics immobiliers reglementaires et aux documents d'urbanisme en vigueur.",
      },
      {
        question: "Mes recherches sont-elles conservees ?",
        answer:
          "DiagAdresse n'exige aucun compte, ne depose aucun cookie publicitaire et ne stocke ni l'historique de recherche ni l'adresse IP des visiteurs. Des mesures d'audience anonymisees (Vercel Analytics) et des indicateurs de performance web (Vercel Speed Insights) sont collectes pour ameliorer le service, conformement au RGPD.",
      },
      {
        question: "Comment signaler une erreur ou suggerer une amelioration ?",
        answer:
          "Si vous constatez une information manifestement erronee ou absente, le plus efficace est de signaler l'anomalie directement sur la source concernee (Georisques, HubEau, ADEME) car DiagAdresse se contente d'afficher les donnees publiques. Pour une suggestion d'amelioration du site, ouvrez une issue sur le depot GitHub via le lien en pied de page.",
      },
    ],
  },
];

export const ALL_FAQ_ENTRIES: FaqEntry[] = FAQ_SECTIONS.flatMap(
  (s) => s.entries,
);
