export interface ArticleSection {
  heading: string;
  body: string;
  items?: string[];
}

export interface ArticleFaqEntry {
  question: string;
  answer: string;
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
  intro: string;
  sections: ArticleSection[];
  keyTakeaways: string[];
  faq: ArticleFaqEntry[];
  relatedRisks: string[];
  relatedArticles: string[];
}

export const ARTICLES: Record<string, Article> = {
  "comment-lire-un-dpe": {
    slug: "comment-lire-un-dpe",
    title: "Comment lire un DPE : guide complet 2026",
    description:
      "Classe energie, emissions de CO2, recommandations de travaux : apprenez a decrypter un Diagnostic de Performance Energetique et a eviter les pieges a l'achat ou a la location.",
    excerpt:
      "Decouvrez comment lire un DPE sans vous laisser pieger : classes A a G, double etiquette, seuils reglementaires, passoires thermiques et recommandations de travaux.",
    publishedAt: "2026-04-24",
    updatedAt: "2026-04-24",
    readingMinutes: 8,
    intro:
      "Le Diagnostic de Performance Energetique (DPE) est devenu en quelques annees le document le plus regarde d'une annonce immobiliere. Depuis sa refonte de juillet 2021 et la loi Climat et Resilience, il est opposable juridiquement et conditionne desormais la possibilite d'augmenter les loyers et, dans certains cas, celle meme de louer un logement. Pourtant, ses nombreux indicateurs (classe energie, classe climat, consommation primaire, finale, emissions) sont souvent mal compris. Voici un guide pratique pour lire un DPE ligne par ligne et reperer les pieges les plus frequents.",
    sections: [
      {
        heading: "Ce que dit la premiere page : la double etiquette",
        body: "Le DPE presente sur sa premiere page deux etiquettes coloriees allant de A (vert) a G (rouge). La premiere evalue la consommation d'energie primaire en kilowattheures par metre carre et par an (kWh/m2/an). La seconde evalue les emissions de gaz a effet de serre en kilogrammes equivalents CO2 par metre carre et par an (kgCO2eq/m2/an). Depuis juillet 2021, la classe finale retenue est la plus mauvaise des deux : un logement chauffe au fioul peut etre C en energie mais F en climat, il sera alors classe F.",
        items: [
          "Classe A : consommation inferieure a 70 kWh/m2/an et emissions inferieures a 6 kgCO2eq/m2/an.",
          "Classe B : entre 70 et 110 kWh/m2/an, ou 6 a 11 kgCO2eq/m2/an.",
          "Classe C : entre 110 et 180 kWh/m2/an, ou 11 a 30 kgCO2eq/m2/an.",
          "Classe D : entre 180 et 250 kWh/m2/an, ou 30 a 50 kgCO2eq/m2/an.",
          "Classe E : entre 250 et 330 kWh/m2/an, ou 50 a 70 kgCO2eq/m2/an.",
          "Classe F : entre 330 et 420 kWh/m2/an, ou 70 a 100 kgCO2eq/m2/an.",
          "Classe G : au-dela de 420 kWh/m2/an ou 100 kgCO2eq/m2/an.",
        ],
      },
      {
        heading: "Energie primaire vs energie finale : ne pas confondre",
        body: "Le DPE affiche deux chiffres de consommation. L'energie finale est celle que vous payez sur votre facture. L'energie primaire inclut les pertes de production et de transport : un coefficient de 2,3 est applique a l'electricite, 1 au gaz et au fioul. C'est bien l'energie primaire qui determine la classe. Pour un logement tout electrique, l'etiquette peut ainsi sembler plus degradee que la facture reelle ne le suggere.",
      },
      {
        heading:
          "La passoire thermique et le calendrier d'interdiction de location",
        body: "Les logements classes F et G sont designes comme passoires thermiques. La loi Climat et Resilience a instaure un calendrier d'interdiction progressive de mise en location des logements les plus consommateurs. Les seuils evoluent dans les annees a venir et concernent uniquement la location, pas la vente.",
        items: [
          "Depuis le 1er janvier 2025 : les logements G (plus de 450 kWh/m2/an en energie finale) sont interdits a la relocation.",
          "A partir du 1er janvier 2028 : tous les logements F deviennent non decents pour la location.",
          "A partir du 1er janvier 2034 : tous les logements E sont interdits a la location.",
          "Hausse de loyer gelee pour les logements F et G depuis aout 2022, meme hors changement de locataire.",
        ],
      },
      {
        heading: "Les recommandations de travaux : a lire attentivement",
        body: "La deuxieme partie du DPE contient des recommandations de travaux chiffrees, classees par scenarios : scenario 1 (travaux ponctuels, gain d'une ou deux classes) et scenario 2 (renovation performante, objectif B ou C). Chaque poste indique une fourchette de cout et un gain energetique estime. Ces montants sont indicatifs : un diagnostiqueur ne peut pas se substituer a un artisan, mais ces chiffres permettent de preparer un budget et de solliciter des devis coherents.",
      },
      {
        heading: "DPE collectif vs DPE individuel : en copropriete",
        body: "En copropriete, deux DPE coexistent : le DPE individuel de votre lot et le DPE collectif de l'immeuble (obligatoire depuis 2024 pour les copropietes de plus de 200 lots, et progressivement pour toutes). Le DPE collectif peut contenir des recommandations concernant la chaudiere collective, l'isolation de la toiture ou des murs mitoyens. Il est opposable a la copropriete et peut etre integre au plan pluriannuel de travaux (PPT) rendu obligatoire par la loi Climat.",
      },
      {
        heading: "Les pieges courants a eviter",
        body: "Un DPE mal etabli ou date d'une ancienne methode peut vous induire en erreur. Les principaux points de vigilance lors d'une transaction.",
        items: [
          "Date du DPE : validite de 10 ans, mais les DPE realises avant juillet 2021 selon l'ancienne methode 3CL peuvent etre moins fiables.",
          "Surface : verifier que la surface mesuree dans le DPE correspond a la surface habitable reelle (erreur frequente sur les combles).",
          "Systeme de chauffage : un DPE saisi avec un mauvais combustible peut decaler la note d'une classe entiere.",
          "Mentions NC (non classe) : autorisees uniquement pour les batiments atypiques, sinon exiger un nouveau diagnostic.",
          "Incoherences : un logement tout electrique avec emissions CO2 tres basses est coherent, sinon demander une verification.",
        ],
      },
      {
        heading: "DPE et achat immobilier : impact sur le prix",
        body: "Plusieurs etudes notariales et immobilieres ont chiffre l'effet du DPE sur le prix de vente. Entre un logement classe A-B et un logement classe F-G, la decote peut atteindre 15 a 20% dans les grandes villes et jusqu'a 30% dans certaines zones rurales. Depuis avril 2023, la loi Climat impose meme un audit energetique reglementaire pour la vente d'un logement classe F ou G (etendu aux E a partir de 2025), a joindre au compromis. Cet audit, plus complet qu'un DPE, presente deux scenarios chiffres de renovation et peut faire basculer une negociation.",
      },
      {
        heading: "Comment contester un DPE errone ?",
        body: "Depuis juillet 2021, le DPE est opposable : un acquereur ou un locataire peut engager la responsabilite du vendeur, du bailleur ou du diagnostiqueur en cas d'erreur. La procedure consiste generalement a faire realiser un contre-diagnostic par un autre professionnel certifie, puis a saisir le diagnostiqueur initial et son assurance responsabilite civile professionnelle. Le litige peut aboutir a une annulation de la vente ou a une reduction du prix. La Commission de regulation de l'energie publie egalement une plateforme de verification de la certification des diagnostiqueurs.",
      },
    ],
    keyTakeaways: [
      "La classe finale du DPE est la plus mauvaise entre energie et climat.",
      "Un logement G ne peut plus etre mis en location depuis janvier 2025.",
      "Les recommandations de travaux sont indicatives mais chiffrees par poste.",
      "Un audit energetique est obligatoire pour vendre un bien F ou G.",
      "Le DPE est opposable : une erreur peut engager la responsabilite du vendeur.",
    ],
    faq: [
      {
        question: "Combien de temps un DPE est-il valable ?",
        answer:
          "Un DPE etabli apres le 1er juillet 2021 est valable 10 ans. Les DPE realises entre 2013 et juin 2021 etaient valides jusqu'au 31 decembre 2024 au plus tard, ils sont aujourd'hui obsoletes. Un nouveau diagnostic doit etre commande en cas de travaux majeurs modifiant la performance energetique du logement (changement de chaudiere, isolation, ouvertures).",
      },
      {
        question: "Le DPE est-il obligatoire pour une location ?",
        answer:
          "Oui, le DPE doit etre annexe au contrat de location des la signature du bail. Pour les logements classes G, la location est meme interdite depuis le 1er janvier 2025. Le bailleur doit fournir un DPE valide, sous peine de voir le locataire engager sa responsabilite.",
      },
      {
        question: "Qui paie le DPE : le vendeur ou l'acheteur ?",
        answer:
          "A la vente, le DPE est a la charge du vendeur et fait partie du dossier de diagnostic technique (DDT) remis au notaire. A la location, il est a la charge du bailleur. Le cout moyen d'un DPE est de 150 a 250 EUR pour un logement individuel, plus cher en copropriete pour les DPE collectifs.",
      },
      {
        question: "Peut-on vendre un logement classe G ?",
        answer:
          "Oui, la vente reste possible quel que soit le classement du DPE. En revanche, depuis avril 2023, un audit energetique reglementaire est obligatoire pour vendre un logement F ou G (et depuis 2025 pour les E). Cet audit, plus complet que le DPE, est remis des la premiere visite.",
      },
      {
        question: "Qu'est-ce qu'une passoire thermique ?",
        answer:
          "Une passoire thermique designe un logement classe F ou G au DPE, c'est-a-dire consommant plus de 330 kWh d'energie primaire par m2 et par an. Ces logements representent environ 17% du parc francais, soit 5,2 millions de logements. Ils sont progressivement interdits a la location par la loi Climat et Resilience.",
      },
      {
        question: "Le DPE tient-il compte de mon comportement ?",
        answer:
          "Non. Depuis 2021, le DPE est calcule selon une methode conventionnelle 3CL-2021 qui simule l'energie necessaire pour maintenir 19 degres dans le logement. Il ne depend donc plus de votre consommation reelle, ce qui permet de comparer des logements entre eux sans biais lie aux habitudes de leurs occupants.",
      },
      {
        question: "Puis-je ameliorer la classe de mon DPE ?",
        answer:
          "Oui. Les travaux les plus efficaces sont l'isolation des combles, le remplacement des fenetres simple vitrage, le changement de chaudiere pour une pompe a chaleur ou une chaudiere biomasse, et l'isolation des murs. Des aides existent : MaPrimeRenov', eco-pret a taux zero, certificats d'economies d'energie (CEE), aides locales. Un accompagnement France Renov' gratuit permet de calibrer le bon bouquet de travaux.",
      },
      {
        question: "Le DPE s'applique-t-il aux maisons anciennes ?",
        answer:
          "Oui, toutes les maisons et appartements sont concernes, y compris le bati ancien anterieur a 1948. La methode 3CL-2021 tient compte des caracteristiques specifiques du bati ancien (epaisseur des murs en pierre, inertie thermique), mais la prise en compte reste imparfaite et fait l'objet de critiques de la part des defenseurs du patrimoine.",
      },
    ],
    relatedRisks: [],
    relatedArticles: ["ial-etat-des-risques"],
  },

  "ial-etat-des-risques": {
    slug: "ial-etat-des-risques",
    title: "IAL, ERP, ERNMT : comprendre l'Etat des Risques en 2026",
    description:
      "L'Etat des Risques et Pollutions (ERP), aussi appele Information Acquereur Locataire (IAL), est obligatoire a la vente et a la location. Guide complet pour le remplir et le lire.",
    excerpt:
      "IAL, ERP, ERNMT : trois acronymes pour un meme document obligatoire a la vente et a la location. Comment le remplir, le lire, et que faire s'il manque ?",
    publishedAt: "2026-04-24",
    updatedAt: "2026-04-24",
    readingMinutes: 9,
    intro:
      "Derriere les sigles IAL, ERP et ERNMT se cache un seul et meme document : l'Etat des Risques et Pollutions. Obligatoire depuis 2006 et renforce par la loi Climat et Resilience de 2021, il doit etre remis a tout acheteur ou locataire des la premiere visite du bien. Il detaille les risques naturels, miniers, technologiques et de pollution des sols auxquels l'adresse est exposee. Voici comment le lire, le remplir, et comprendre sa valeur juridique.",
    sections: [
      {
        heading: "IAL, ERP, ERNT, ERNMT : de quoi parle-t-on ?",
        body: "Les acronymes ont evolue avec la reglementation. Il s'agit pourtant du meme document, simplement renomme au gre des lois.",
        items: [
          "ERNT (2006) : Etat des Risques Naturels et Technologiques, cree par la loi Bachelot apres AZF.",
          "ERNMT (2013) : ajout des risques miniers (M), devient Etat des Risques Naturels, Miniers et Technologiques.",
          "ERP (2018) : Etat des Risques et Pollutions, integration des pollutions de sols et du radon.",
          "IAL : Information Acquereur Locataire, terme generique designant le dispositif d'information.",
        ],
      },
      {
        heading: "Quand et comment l'ERP doit-il etre remis ?",
        body: "Depuis la loi Climat et Resilience du 22 aout 2021, l'ERP doit etre remis des la premiere visite d'un bien immobilier. C'est une evolution majeure : auparavant, le document etait simplement annexe au compromis ou au bail. Desormais, un acquereur ou un locataire doit pouvoir consulter l'exposition aux risques avant meme d'emettre une offre. Le document est ensuite annexe a la promesse de vente ou au contrat de location. Son absence peut entrainer l'annulation de la vente ou une reduction du prix pour vice cache.",
      },
      {
        heading: "Qui doit remplir l'ERP et a partir de quelles donnees ?",
        body: "L'ERP est rempli par le vendeur ou le bailleur lui-meme, sous sa responsabilite. Il n'a pas besoin de faire appel a un diagnostiqueur certifie, contrairement au DPE ou au diagnostic amiante. Les donnees proviennent de deux sources officielles : le formulaire Cerfa numero 13819-06 a telecharger sur service-public.fr, et l'arrete prefectoral listant les risques pour la commune, consultable en prefecture ou sur Georisques.gouv.fr. Un mauvais remplissage, meme involontaire, engage la responsabilite du vendeur ou du bailleur.",
      },
      {
        heading: "Les rubriques obligatoires de l'ERP",
        body: "Le formulaire Cerfa 13819 comporte une serie de cases a cocher organisees par categorie de risque. Chaque case doit indiquer si la commune est concernee, et si le bien lui-meme est expose.",
        items: [
          "Plan de prevention des risques naturels (PPR) : inondation, mouvement de terrain, seisme, avalanche, incendie de foret.",
          "Plan de prevention des risques miniers (PPRM) : effondrement, affaissement, emergence de gaz.",
          "Plan de prevention des risques technologiques (PPRT) : sites Seveso, installations classees.",
          "Zone de sismicite : 1 (tres faible) a 5 (forte).",
          "Potentiel radon : niveau 1, 2 ou 3 selon la commune.",
          "Pollution des sols : secteur d'information sur les sols (SIS) declare.",
          "Exposition au bruit : zone de plan d'exposition au bruit d'un aeroport.",
          "Recul du trait de cote : zones concernees par la loi Climat.",
          "Historique : arretes de catastrophe naturelle concernant le bien sur les 5 dernieres annees.",
        ],
      },
      {
        heading:
          "La liste des sinistres indemnises : la section souvent oubliee",
        body: "L'une des rubriques cruciales de l'ERP est celle des sinistres indemnises au titre d'une catastrophe naturelle ou technologique. Le vendeur ou le bailleur doit declarer tous les sinistres pour lesquels une indemnisation a ete percue depuis l'acquisition du bien, en citant la nature (inondation, secheresse, mouvement de terrain, tempete) et l'annee. Cette information n'apparait sur aucune base publique : seul le proprietaire la connait. Mentir ou omettre cette declaration constitue un dol et peut entrainer l'annulation pure et simple de la vente, meme plusieurs annees apres.",
      },
      {
        heading: "Valeur juridique et sanctions en cas d'omission",
        body: "L'ERP est un document opposable. En cas d'information manquante, erronee ou mensongere, l'acquereur dispose de deux recours principaux : demander la resolution de la vente (annulation avec restitution du prix) ou obtenir une diminution du prix proportionnelle au prejudice. La jurisprudence reconnait de plus en plus facilement le dol lorsque le vendeur savait que son bien avait ete inonde. Le delai de prescription est de 5 ans a partir de la decouverte du vice pour l'action en vice cache.",
      },
      {
        heading: "Comment verifier l'ERP que l'on me presente ?",
        body: "Meme si l'ERP est rempli par le vendeur, rien n'empeche un acquereur de le verifier. Les outils pour le faire sont publics et gratuits : Georisques.gouv.fr permet de saisir une adresse et d'obtenir l'ensemble des arretes de catastrophe naturelle, les PPR applicables, le zonage sismique et le potentiel radon. Des services tiers agregent ces donnees pour faciliter la consultation. En cas d'ecart entre l'ERP remis et les donnees publiques, il faut interroger le vendeur avant de signer, en faisant consigner les reponses par ecrit.",
      },
      {
        heading: "ERP et copropriete : qui paye, qui redige ?",
        body: "En copropriete, chaque vendeur d'un lot doit etablir son propre ERP : il n'y a pas d'ERP collectif. Le syndic peut toutefois etre sollicite pour obtenir des informations sur les sinistres collectifs ayant touche l'immeuble (degats des eaux generalises, fissures structurelles indemnisees au titre d'un arrete secheresse). Le proces-verbal d'assemblee generale peut contenir des elements utiles et fait partie des documents a exiger avant compromis.",
      },
    ],
    keyTakeaways: [
      "IAL, ERP et ERNMT designent le meme document officiel.",
      "Il doit etre remis des la premiere visite depuis la loi Climat de 2021.",
      "Il est rempli par le vendeur ou le bailleur, sans diagnostiqueur certifie.",
      "L'omission d'un sinistre indemnise peut annuler la vente pour dol.",
      "Georisques et les services agreges permettent de verifier les informations.",
    ],
    faq: [
      {
        question: "L'ERP est-il obligatoire pour toutes les communes ?",
        answer:
          "Non. L'ERP est obligatoire uniquement lorsque la commune est couverte par un Plan de Prevention des Risques (PPR), un zonage sismique de niveau 2 a 5, un potentiel radon de niveau 3, un Plan d'Exposition au Bruit ou une zone de recul du trait de cote. Environ 95% des communes francaises sont aujourd'hui concernees par au moins un de ces dispositifs.",
      },
      {
        question: "Qui doit remplir l'Etat des Risques ?",
        answer:
          "Le vendeur a la vente, le bailleur a la location. Aucun professionnel n'est requis : le formulaire Cerfa 13819-06 est complete par le proprietaire a partir des donnees de la prefecture et de Georisques. Un notaire, un agent immobilier ou un diagnostiqueur peuvent conseiller mais n'engagent pas leur responsabilite a sa place.",
      },
      {
        question: "Combien de temps est valable un ERP ?",
        answer:
          "L'ERP est valable 6 mois. Il doit donc etre mis a jour a chaque nouvelle transaction, et lorsque les donnees publiques evoluent (nouvel arrete prefectoral, modification du PPR, nouvel arrete de catastrophe naturelle concernant la commune).",
      },
      {
        question: "Que faire si l'ERP n'est pas remis ?",
        answer:
          "A la vente, l'acheteur peut demander une reduction du prix ou la resolution du contrat. A la location, le locataire peut saisir la commission departementale de conciliation. Depuis 2021, l'ERP doit etre affiche dans toute annonce immobiliere mentionnant la situation du bien par rapport aux risques.",
      },
      {
        question: "L'ERP couvre-t-il le risque de feu de foret ?",
        answer:
          "Oui, lorsque la commune est couverte par un Plan de Prevention des Risques Incendies de Forets (PPRIF). Ces plans sont frequents dans le sud-est (PACA, Corse, Languedoc) et concernent aujourd'hui plus de 300 communes. Depuis la loi de 2023 sur les feux de forets, l'obligation legale de debroussaillement (OLD) fait egalement partie des informations a declarer.",
      },
      {
        question: "L'ERP signale-t-il les installations Seveso ?",
        answer:
          "Oui, si le bien est situe dans un perimetre de Plan de Prevention des Risques Technologiques (PPRT) autour d'un site Seveso seuil haut. Pour les installations classees (ICPE) hors Seveso, l'information n'est pas toujours reportee dans l'ERP mais reste consultable sur Georisques et dans la base nationale des ICPE.",
      },
      {
        question: "Puis-je signer malgre un ERP defavorable ?",
        answer:
          "Oui, l'ERP est un document d'information, pas une interdiction. Il vous permet de connaitre l'exposition du bien et d'en tenir compte dans la negociation, dans le choix de l'assurance (garantie catastrophe naturelle obligatoire) et dans d'eventuels travaux de mise en conformite prevus par le PPR. Un bien en zone rouge d'un PPR est deja tres restreint en termes de travaux, ce qui limite son potentiel d'extension.",
      },
      {
        question: "Ou trouver les donnees pour remplir l'ERP ?",
        answer:
          "Les arretes prefectoraux listant les risques pour chaque commune sont publies sur les sites des prefectures et sur Georisques.gouv.fr. Le zonage sismique et le potentiel radon sont disponibles directement sur Georisques. Les arretes de catastrophe naturelle sont consultables sur la base Gaspar ou Georisques. Des agregateurs comme DiagAdresse consolident ces sources pour une consultation plus rapide.",
      },
    ],
    relatedRisks: [
      "inondation",
      "seisme",
      "argile",
      "radon",
      "icpe",
      "cavites",
    ],
    relatedArticles: ["comment-lire-un-dpe"],
  },
};

export const ALL_ARTICLES: Article[] = Object.values(ARTICLES).sort(
  (a, b) =>
    b.publishedAt.localeCompare(a.publishedAt) || a.slug.localeCompare(b.slug),
);

export function getArticle(slug: string): Article | undefined {
  return ARTICLES[slug];
}
