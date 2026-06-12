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
      "Classe énergie, émissions de CO2, recommandations de travaux : apprenez à décrypter un Diagnostic de Performance Énergétique et à éviter les pièges à l'achat ou à la location.",
    excerpt:
      "Découvrez comment lire un DPE sans vous laisser piéger : classes A à G, double étiquette, seuils réglementaires, passoires thermiques et recommandations de travaux.",
    publishedAt: "2026-04-24",
    updatedAt: "2026-04-24",
    readingMinutes: 8,
    intro:
      "Le Diagnostic de Performance Énergétique (DPE) est devenu en quelques années le document le plus regardé d'une annonce immobilière. Depuis sa refonte de juillet 2021 et la loi Climat et Résilience, il est opposable juridiquement et conditionne désormais la possibilité d'augmenter les loyers et, dans certains cas, celle même de louer un logement. Pourtant, ses nombreux indicateurs (classe énergie, classe climat, consommation primaire, finale, émissions) sont souvent mal compris. Voici un guide pratique pour lire un DPE ligne par ligne et repérer les pièges les plus fréquents.",
    sections: [
      {
        heading: "Ce que dit la première page : la double étiquette",
        body: "Le DPE présente sur sa première page deux étiquettes coloriées allant de A (vert) à G (rouge). La première évalue la consommation d'énergie primaire en kilowattheures par mètre carré et par an (kWh/m2/an). La seconde évalue les émissions de gaz à effet de serre en kilogrammes équivalents CO2 par mètre carré et par an (kgCO2eq/m2/an). Depuis juillet 2021, la classe finale retenue est la plus mauvaise des deux : un logement chauffé au fioul peut être C en énergie mais F en climat, il sera alors classé F.",
        items: [
          "Classe A : consommation inférieure à 70 kWh/m2/an et émissions inférieures à 6 kgCO2eq/m2/an.",
          "Classe B : entre 70 et 110 kWh/m2/an, ou 6 à 11 kgCO2eq/m2/an.",
          "Classe C : entre 110 et 180 kWh/m2/an, ou 11 à 30 kgCO2eq/m2/an.",
          "Classe D : entre 180 et 250 kWh/m2/an, ou 30 à 50 kgCO2eq/m2/an.",
          "Classe E : entre 250 et 330 kWh/m2/an, ou 50 à 70 kgCO2eq/m2/an.",
          "Classe F : entre 330 et 420 kWh/m2/an, ou 70 à 100 kgCO2eq/m2/an.",
          "Classe G : au-delà de 420 kWh/m2/an ou 100 kgCO2eq/m2/an.",
        ],
      },
      {
        heading: "Énergie primaire vs énergie finale : ne pas confondre",
        body: "Le DPE affiche deux chiffres de consommation. L'énergie finale est celle que vous payez sur votre facture. L'énergie primaire inclut les pertes de production et de transport : un coefficient de 2,3 est appliqué à l'électricité, 1 au gaz et au fioul. C'est bien l'énergie primaire qui détermine la classe. Pour un logement tout électrique, l'étiquette peut ainsi sembler plus dégradée que la facture réelle ne le suggère.",
      },
      {
        heading:
          "La passoire thermique et le calendrier d'interdiction de location",
        body: "Les logements classés F et G sont désignés comme passoires thermiques. La loi Climat et Résilience a instauré un calendrier d'interdiction progressive de mise en location des logements les plus consommateurs. Les seuils évoluent dans les années à venir et concernent uniquement la location, pas la vente.",
        items: [
          "Depuis le 1er janvier 2025 : les logements G (plus de 450 kWh/m2/an en énergie finale) sont interdits à la relocation.",
          "À partir du 1er janvier 2028 : tous les logements F deviennent non décents pour la location.",
          "À partir du 1er janvier 2034 : tous les logements E sont interdits à la location.",
          "Hausse de loyer gelée pour les logements F et G depuis août 2022, même hors changement de locataire.",
        ],
      },
      {
        heading: "Les recommandations de travaux : à lire attentivement",
        body: "La deuxième partie du DPE contient des recommandations de travaux chiffrées, classées par scénarios : scénario 1 (travaux ponctuels, gain d'une ou deux classes) et scénario 2 (rénovation performante, objectif B ou C). Chaque poste indique une fourchette de coût et un gain énergétique estimé. Ces montants sont indicatifs : un diagnostiqueur ne peut pas se substituer à un artisan, mais ces chiffres permettent de préparer un budget et de solliciter des devis cohérents.",
      },
      {
        heading: "DPE collectif vs DPE individuel : en copropriété",
        body: "En copropriété, deux DPE coexistent : le DPE individuel de votre lot et le DPE collectif de l'immeuble (obligatoire depuis 2024 pour les copropriétés de plus de 200 lots, et progressivement pour toutes). Le DPE collectif peut contenir des recommandations concernant la chaudière collective, l'isolation de la toiture ou des murs mitoyens. Il est opposable à la copropriété et peut être intégré au plan pluriannuel de travaux (PPT) rendu obligatoire par la loi Climat.",
      },
      {
        heading: "Les pièges courants à éviter",
        body: "Un DPE mal établi ou daté d'une ancienne méthode peut vous induire en erreur. Les principaux points de vigilance lors d'une transaction.",
        items: [
          "Date du DPE : validité de 10 ans, mais les DPE réalisés avant juillet 2021 selon l'ancienne méthode 3CL peuvent être moins fiables.",
          "Surface : vérifier que la surface mesurée dans le DPE correspond à la surface habitable réelle (erreur fréquente sur les combles).",
          "Système de chauffage : un DPE saisi avec un mauvais combustible peut décaler la note d'une classe entière.",
          "Mentions NC (non classé) : autorisées uniquement pour les bâtiments atypiques, sinon exiger un nouveau diagnostic.",
          "Incohérences : un logement tout électrique avec émissions CO2 très basses est cohérent, sinon demander une vérification.",
        ],
      },
      {
        heading: "DPE et achat immobilier : impact sur le prix",
        body: "Plusieurs études notariales et immobilières ont chiffré l'effet du DPE sur le prix de vente. Entre un logement classé A-B et un logement classé F-G, la décote peut atteindre 15 à 20% dans les grandes villes et jusqu'à 30% dans certaines zones rurales. Depuis avril 2023, la loi Climat impose même un audit énergétique réglementaire pour la vente d'un logement classé F ou G (étendu aux E à partir de 2025), à joindre au compromis. Cet audit, plus complet qu'un DPE, présente deux scénarios chiffrés de rénovation et peut faire basculer une négociation.",
      },
      {
        heading: "Comment contester un DPE erroné ?",
        body: "Depuis juillet 2021, le DPE est opposable : un acquéreur ou un locataire peut engager la responsabilité du vendeur, du bailleur ou du diagnostiqueur en cas d'erreur. La procédure consiste généralement à faire réaliser un contre-diagnostic par un autre professionnel certifié, puis à saisir le diagnostiqueur initial et son assurance responsabilité civile professionnelle. Le litige peut aboutir à une annulation de la vente ou à une réduction du prix. La Commission de régulation de l'énergie publie également une plateforme de vérification de la certification des diagnostiqueurs.",
      },
    ],
    keyTakeaways: [
      "La classe finale du DPE est la plus mauvaise entre énergie et climat.",
      "Un logement G ne peut plus être mis en location depuis janvier 2025.",
      "Les recommandations de travaux sont indicatives mais chiffrées par poste.",
      "Un audit énergétique est obligatoire pour vendre un bien F ou G.",
      "Le DPE est opposable : une erreur peut engager la responsabilité du vendeur.",
    ],
    faq: [
      {
        question: "Combien de temps un DPE est-il valable ?",
        answer:
          "Un DPE établi après le 1er juillet 2021 est valable 10 ans. Les DPE réalisés entre 2013 et juin 2021 étaient valides jusqu'au 31 décembre 2024 au plus tard, ils sont aujourd'hui obsolètes. Un nouveau diagnostic doit être commandé en cas de travaux majeurs modifiant la performance énergétique du logement (changement de chaudière, isolation, ouvertures).",
      },
      {
        question: "Le DPE est-il obligatoire pour une location ?",
        answer:
          "Oui, le DPE doit être annexé au contrat de location dès la signature du bail. Pour les logements classés G, la location est même interdite depuis le 1er janvier 2025. Le bailleur doit fournir un DPE valide, sous peine de voir le locataire engager sa responsabilité.",
      },
      {
        question: "Qui paie le DPE : le vendeur ou l'acheteur ?",
        answer:
          "À la vente, le DPE est à la charge du vendeur et fait partie du dossier de diagnostic technique (DDT) remis au notaire. À la location, il est à la charge du bailleur. Le coût moyen d'un DPE est de 150 à 250 EUR pour un logement individuel, plus cher en copropriété pour les DPE collectifs.",
      },
      {
        question: "Peut-on vendre un logement classé G ?",
        answer:
          "Oui, la vente reste possible quel que soit le classement du DPE. En revanche, depuis avril 2023, un audit énergétique réglementaire est obligatoire pour vendre un logement F ou G (et depuis 2025 pour les E). Cet audit, plus complet que le DPE, est remis dès la première visite.",
      },
      {
        question: "Qu'est-ce qu'une passoire thermique ?",
        answer:
          "Une passoire thermique désigne un logement classé F ou G au DPE, c'est-à-dire consommant plus de 330 kWh d'énergie primaire par m2 et par an. Ces logements représentent environ 17% du parc français, soit 5,2 millions de logements. Ils sont progressivement interdits à la location par la loi Climat et Résilience.",
      },
      {
        question: "Le DPE tient-il compte de mon comportement ?",
        answer:
          "Non. Depuis 2021, le DPE est calculé selon une méthode conventionnelle 3CL-2021 qui simule l'énergie nécessaire pour maintenir 19 degrés dans le logement. Il ne dépend donc plus de votre consommation réelle, ce qui permet de comparer des logements entre eux sans biais lié aux habitudes de leurs occupants.",
      },
      {
        question: "Puis-je améliorer la classe de mon DPE ?",
        answer:
          "Oui. Les travaux les plus efficaces sont l'isolation des combles, le remplacement des fenêtres simple vitrage, le changement de chaudière pour une pompe à chaleur ou une chaudière biomasse, et l'isolation des murs. Des aides existent : MaPrimeRénov', éco-prêt à taux zéro, certificats d'économies d'énergie (CEE), aides locales. Un accompagnement France Rénov' gratuit permet de calibrer le bon bouquet de travaux.",
      },
      {
        question: "Le DPE s'applique-t-il aux maisons anciennes ?",
        answer:
          "Oui, toutes les maisons et appartements sont concernés, y compris le bâti ancien antérieur à 1948. La méthode 3CL-2021 tient compte des caractéristiques spécifiques du bâti ancien (épaisseur des murs en pierre, inertie thermique), mais la prise en compte reste imparfaite et fait l'objet de critiques de la part des défenseurs du patrimoine.",
      },
    ],
    relatedRisks: [],
    relatedArticles: ["ial-etat-des-risques"],
  },

  "ial-etat-des-risques": {
    slug: "ial-etat-des-risques",
    title: "IAL, ERP, ERNMT : comprendre l'État des Risques en 2026",
    description:
      "L'État des Risques et Pollutions (ERP), aussi appelé Information Acquéreur Locataire (IAL), est obligatoire à la vente et à la location. Guide complet pour le remplir et le lire.",
    excerpt:
      "IAL, ERP, ERNMT : trois acronymes pour un même document obligatoire à la vente et à la location. Comment le remplir, le lire, et que faire s'il manque ?",
    publishedAt: "2026-04-24",
    updatedAt: "2026-04-24",
    readingMinutes: 9,
    intro:
      "Derrière les sigles IAL, ERP et ERNMT se cache un seul et même document : l'État des Risques et Pollutions. Obligatoire depuis 2006 et renforcé par la loi Climat et Résilience de 2021, il doit être remis à tout acheteur ou locataire dès la première visite du bien. Il détaille les risques naturels, miniers, technologiques et de pollution des sols auxquels l'adresse est exposée. Voici comment le lire, le remplir, et comprendre sa valeur juridique.",
    sections: [
      {
        heading: "IAL, ERP, ERNT, ERNMT : de quoi parle-t-on ?",
        body: "Les acronymes ont évolué avec la réglementation. Il s'agit pourtant du même document, simplement renommé au gré des lois.",
        items: [
          "ERNT (2006) : État des Risques Naturels et Technologiques, créé par la loi Bachelot après AZF.",
          "ERNMT (2013) : ajout des risques miniers (M), devient État des Risques Naturels, Miniers et Technologiques.",
          "ERP (2018) : État des Risques et Pollutions, intégration des pollutions de sols et du radon.",
          "IAL : Information Acquéreur Locataire, terme générique désignant le dispositif d'information.",
        ],
      },
      {
        heading: "Quand et comment l'ERP doit-il être remis ?",
        body: "Depuis la loi Climat et Résilience du 22 août 2021, l'ERP doit être remis dès la première visite d'un bien immobilier. C'est une évolution majeure : auparavant, le document était simplement annexé au compromis ou au bail. Désormais, un acquéreur ou un locataire doit pouvoir consulter l'exposition aux risques avant même d'émettre une offre. Le document est ensuite annexé à la promesse de vente ou au contrat de location. Son absence peut entraîner l'annulation de la vente ou une réduction du prix pour vice caché.",
      },
      {
        heading: "Qui doit remplir l'ERP et à partir de quelles données ?",
        body: "L'ERP est rempli par le vendeur ou le bailleur lui-même, sous sa responsabilité. Il n'a pas besoin de faire appel à un diagnostiqueur certifié, contrairement au DPE ou au diagnostic amiante. Les données proviennent de deux sources officielles : le formulaire Cerfa numéro 13819-06 à télécharger sur service-public.fr, et l'arrêté préfectoral listant les risques pour la commune, consultable en préfecture ou sur Georisques.gouv.fr. Un mauvais remplissage, même involontaire, engage la responsabilité du vendeur ou du bailleur.",
      },
      {
        heading: "Les rubriques obligatoires de l'ERP",
        body: "Le formulaire Cerfa 13819 comporte une série de cases à cocher organisées par catégorie de risque. Chaque case doit indiquer si la commune est concernée, et si le bien lui-même est exposé.",
        items: [
          "Plan de prévention des risques naturels (PPR) : inondation, mouvement de terrain, séisme, avalanche, incendie de forêt.",
          "Plan de prévention des risques miniers (PPRM) : effondrement, affaissement, émergence de gaz.",
          "Plan de prévention des risques technologiques (PPRT) : sites Seveso, installations classées.",
          "Zone de sismicité : 1 (très faible) à 5 (forte).",
          "Potentiel radon : niveau 1, 2 ou 3 selon la commune.",
          "Pollution des sols : secteur d'information sur les sols (SIS) déclaré.",
          "Exposition au bruit : zone de plan d'exposition au bruit d'un aéroport.",
          "Recul du trait de côte : zones concernées par la loi Climat.",
          "Historique : arrêtés de catastrophe naturelle concernant le bien sur les 5 dernières années.",
        ],
      },
      {
        heading:
          "La liste des sinistres indemnisés : la section souvent oubliée",
        body: "L'une des rubriques cruciales de l'ERP est celle des sinistres indemnisés au titre d'une catastrophe naturelle ou technologique. Le vendeur ou le bailleur doit déclarer tous les sinistres pour lesquels une indemnisation a été perçue depuis l'acquisition du bien, en citant la nature (inondation, sécheresse, mouvement de terrain, tempête) et l'année. Cette information n'apparaît sur aucune base publique : seul le propriétaire la connaît. Mentir ou omettre cette déclaration constitue un dol et peut entraîner l'annulation pure et simple de la vente, même plusieurs années après.",
      },
      {
        heading: "Valeur juridique et sanctions en cas d'omission",
        body: "L'ERP est un document opposable. En cas d'information manquante, erronée ou mensongère, l'acquéreur dispose de deux recours principaux : demander la résolution de la vente (annulation avec restitution du prix) ou obtenir une diminution du prix proportionnelle au préjudice. La jurisprudence reconnaît de plus en plus facilement le dol lorsque le vendeur savait que son bien avait été inondé. Le délai de prescription est de 5 ans à partir de la découverte du vice pour l'action en vice caché.",
      },
      {
        heading: "Comment vérifier l'ERP que l'on me présente ?",
        body: "Même si l'ERP est rempli par le vendeur, rien n'empêche un acquéreur de le vérifier. Les outils pour le faire sont publics et gratuits : Georisques.gouv.fr permet de saisir une adresse et d'obtenir l'ensemble des arrêtés de catastrophe naturelle, les PPR applicables, le zonage sismique et le potentiel radon. Des services tiers agrègent ces données pour faciliter la consultation. En cas d'écart entre l'ERP remis et les données publiques, il faut interroger le vendeur avant de signer, en faisant consigner les réponses par écrit.",
      },
      {
        heading: "ERP et copropriété : qui paye, qui rédige ?",
        body: "En copropriété, chaque vendeur d'un lot doit établir son propre ERP : il n'y a pas d'ERP collectif. Le syndic peut toutefois être sollicité pour obtenir des informations sur les sinistres collectifs ayant touché l'immeuble (dégâts des eaux généralisés, fissures structurelles indemnisées au titre d'un arrêté sécheresse). Le procès-verbal d'assemblée générale peut contenir des éléments utiles et fait partie des documents à exiger avant compromis.",
      },
    ],
    keyTakeaways: [
      "IAL, ERP et ERNMT désignent le même document officiel.",
      "Il doit être remis dès la première visite depuis la loi Climat de 2021.",
      "Il est rempli par le vendeur ou le bailleur, sans diagnostiqueur certifié.",
      "L'omission d'un sinistre indemnisé peut annuler la vente pour dol.",
      "Géorisques et les services agrégés permettent de vérifier les informations.",
    ],
    faq: [
      {
        question: "L'ERP est-il obligatoire pour toutes les communes ?",
        answer:
          "Non. L'ERP est obligatoire uniquement lorsque la commune est couverte par un Plan de Prévention des Risques (PPR), un zonage sismique de niveau 2 à 5, un potentiel radon de niveau 3, un Plan d'Exposition au Bruit ou une zone de recul du trait de côte. Environ 95% des communes françaises sont aujourd'hui concernées par au moins un de ces dispositifs.",
      },
      {
        question: "Qui doit remplir l'État des Risques ?",
        answer:
          "Le vendeur à la vente, le bailleur à la location. Aucun professionnel n'est requis : le formulaire Cerfa 13819-06 est complété par le propriétaire à partir des données de la préfecture et de Géorisques. Un notaire, un agent immobilier ou un diagnostiqueur peuvent conseiller mais n'engagent pas leur responsabilité à sa place.",
      },
      {
        question: "Combien de temps est valable un ERP ?",
        answer:
          "L'ERP est valable 6 mois. Il doit donc être mis à jour à chaque nouvelle transaction, et lorsque les données publiques évoluent (nouvel arrêté préfectoral, modification du PPR, nouvel arrêté de catastrophe naturelle concernant la commune).",
      },
      {
        question: "Que faire si l'ERP n'est pas remis ?",
        answer:
          "À la vente, l'acheteur peut demander une réduction du prix ou la résolution du contrat. À la location, le locataire peut saisir la commission départementale de conciliation. Depuis 2021, l'ERP doit être affiché dans toute annonce immobilière mentionnant la situation du bien par rapport aux risques.",
      },
      {
        question: "L'ERP couvre-t-il le risque de feu de forêt ?",
        answer:
          "Oui, lorsque la commune est couverte par un Plan de Prévention des Risques Incendies de Forêts (PPRIF). Ces plans sont fréquents dans le sud-est (PACA, Corse, Languedoc) et concernent aujourd'hui plus de 300 communes. Depuis la loi de 2023 sur les feux de forêts, l'obligation légale de débroussaillement (OLD) fait également partie des informations à déclarer.",
      },
      {
        question: "L'ERP signale-t-il les installations Seveso ?",
        answer:
          "Oui, si le bien est situé dans un périmètre de Plan de Prévention des Risques Technologiques (PPRT) autour d'un site Seveso seuil haut. Pour les installations classées (ICPE) hors Seveso, l'information n'est pas toujours reportée dans l'ERP mais reste consultable sur Géorisques et dans la base nationale des ICPE.",
      },
      {
        question: "Puis-je signer malgré un ERP défavorable ?",
        answer:
          "Oui, l'ERP est un document d'information, pas une interdiction. Il vous permet de connaître l'exposition du bien et d'en tenir compte dans la négociation, dans le choix de l'assurance (garantie catastrophe naturelle obligatoire) et dans d'éventuels travaux de mise en conformité prévus par le PPR. Un bien en zone rouge d'un PPR est déjà très restreint en termes de travaux, ce qui limite son potentiel d'extension.",
      },
      {
        question: "Où trouver les données pour remplir l'ERP ?",
        answer:
          "Les arrêtés préfectoraux listant les risques pour chaque commune sont publiés sur les sites des préfectures et sur Georisques.gouv.fr. Le zonage sismique et le potentiel radon sont disponibles directement sur Géorisques. Les arrêtés de catastrophe naturelle sont consultables sur la base Gaspar ou Géorisques. Des agrégateurs comme DiagAdresse consolident ces sources pour une consultation plus rapide.",
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
