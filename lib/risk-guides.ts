export const RISK_GUIDES_UPDATED_AT = "2026-04-24";

export interface RiskKeyFigure {
  value: string;
  label: string;
}

export interface RiskSection {
  heading: string;
  body: string;
  items?: string[];
}

export interface RiskGuide {
  title: string;
  description: string;
  intro: string;
  keyFigures: RiskKeyFigure[];
  sections: RiskSection[];
  whatToDo: string[];
  costAndInsurance: string;
  legalObligations: string;
  relatedRisks: string[];
  faq: { question: string; answer: string }[];
}

export const RISK_GUIDES: Record<string, RiskGuide> = {
  inondation: {
    title: "Risque inondation en France",
    description:
      "Tout savoir sur le risque inondation : zones concernées, plans de prévention, indemnisation et comment protéger votre habitation.",
    intro:
      "L'inondation est le premier risque naturel en France : plus de 17 millions d'habitants y sont exposés et un tiers des communes est concerné à divers degrés. Débordement de cours d'eau, ruissellement urbain, remontée de nappe ou submersion marine : les formes sont multiples, et chaque adresse est exposée différemment selon sa topographie et son historique.",
    keyFigures: [
      { value: "17 M", label: "habitants exposés en France" },
      { value: "1er", label: "risque naturel national" },
      { value: "~11 000", label: "communes couvertes par un PPRi" },
      { value: "2e", label: "poste d'indemnisation catastrophe naturelle" },
    ],
    sections: [
      {
        heading: "Les différents types d'inondations",
        body: "Toutes les inondations ne se ressemblent pas. Selon le mécanisme en cause, la vitesse de montée des eaux, la profondeur et la durée varient énormément, tout comme les mesures de prévention efficaces.",
        items: [
          "Débordement de cours d'eau : crue lente (Seine, Loire) ou rapide (vallées cévenoles, arrière-pays méditerranéen).",
          "Ruissellement urbain : saturation des réseaux d'eaux pluviales sur sol imperméabilisé.",
          "Remontée de nappe phréatique : l'eau remonte par le sous-sol, caves et vides sanitaires inondés.",
          "Submersion marine : cumul de forte marée, surcote atmosphérique et houle, surtout sur les façades atlantique et Manche-Mer du Nord.",
        ],
      },
      {
        heading: "Comment savoir si mon adresse est en zone inondable ?",
        body: "Plusieurs documents permettent de vérifier l'exposition d'une adresse. Le Plan de Prévention des Risques Inondation (PPRi), élaboré par la préfecture et annexé au PLU, délimite les zones rouges (interdiction de construire), bleues (prescriptions) et blanches. Pour les cours d'eau importants, le Territoire à Risque important d'Inondation (TRI) cartographie des crues fréquente, moyenne et extrême. Georisques.gouv.fr agrège ces données et les met à disposition gratuitement.",
      },
      {
        heading: "Comment lire un PPRi ?",
        body: "Un PPRi contient un règlement (obligations de construction) et des cartes (zonage). La zone rouge est inconstructible sauf exceptions (extensions limitées, équipements collectifs). La zone bleue autorise la construction sous conditions : cote de plancher minimale, matériaux résistants à l'eau, réseaux hors d'eau, dispositifs anti-refoulement. Un document PPRi se consulte en mairie, en préfecture ou en ligne sur le Géoportail de l'Urbanisme.",
      },
      {
        heading: "Régions et communes les plus exposées",
        body: "Les territoires les plus concernés sont la vallée du Rhône et ses affluents, la Loire moyenne, le bassin de la Seine, le quart sud-est méditerranéen (Gard, Var, Alpes-Maritimes, Hérault) et la façade atlantique pour la submersion marine. Paris, Lyon, Bordeaux et Nantes comptent des quartiers entiers classés en zone inondable.",
      },
      {
        heading: "Qu'est-ce qu'une crue centennale ?",
        body: "On parle de crue centennale lorsque la probabilité qu'un tel niveau soit atteint ou dépassé chaque année est de 1%. Ce seuil sert de référence pour dimensionner les PPRi et les ouvrages de protection. Mais une crue centennale peut survenir deux années de suite : il s'agit d'une probabilité, non d'une périodicité. La crue de la Seine de 1910 reste la référence pour l'agglomération parisienne.",
      },
    ],
    whatToDo: [
      "Consulter le PPRi de la commune et vérifier la cote de plancher du logement.",
      "Exiger l'État des Risques et Pollutions (ERP) annexé au bail ou à l'acte de vente.",
      "S'inscrire au service d'alerte crues de la préfecture et suivre Vigicrues.",
      "Surélever les appareils électriques et les prises dans les pièces exposées.",
      "Préparer un kit d'urgence : documents, lampe, radio à piles, eau, trousse de secours.",
      "Souscrire une assurance habitation incluant la garantie catastrophe naturelle (obligatoire depuis 1982).",
    ],
    costAndInsurance:
      "La garantie catastrophe naturelle est incluse automatiquement dans tous les contrats habitation et auto en France. Elle se déclenche après publication d'un arrêté interministériel de reconnaissance de l'état de catastrophe naturelle (délai typique : 10 jours à 3 mois). Franchise légale : 380 EUR pour les particuliers, 1 520 EUR en cas de subsidence liée à la sécheresse. Les travaux de remise en état, le séchage et parfois le relogement temporaire sont couverts, dans la limite du capital assuré.",
    legalObligations:
      "Depuis la loi Climat et Résilience (2021), l'État des Risques et Pollutions (ERP) doit être remis à tout acheteur ou locataire dès la première visite. Il indique si le bien est en zone de PPR, les arrêtés de catastrophe naturelle des cinq dernières années et les sinistres indemnisés. En zone inondable, des travaux de réduction de vulnérabilité peuvent être prescrits par le PPRi (batardeaux, clapets anti-retour) avec obligation de réalisation dans un délai défini.",
    relatedRisks: ["argile", "cavites"],
    faq: [
      {
        question: "Comment savoir si mon logement est en zone inondable ?",
        answer:
          "Consultez le Plan de Prévention des Risques d'Inondation (PPRi) de votre commune sur Georisques.gouv.fr ou utilisez DiagAdresse pour obtenir un diagnostic complet de votre adresse, incluant la zone réglementaire et l'historique des arrêtés de catastrophe naturelle.",
      },
      {
        question: "L'assurance couvre-t-elle les inondations ?",
        answer:
          "Oui, la garantie catastrophe naturelle est incluse dans tous les contrats d'assurance habitation en France. Elle couvre les dommages après publication d'un arrêté interministériel de catastrophe naturelle, avec une franchise légale de 380 EUR pour les particuliers.",
      },
      {
        question: "Qu'est-ce qu'un PPRi ?",
        answer:
          "Le Plan de Prévention des Risques Inondation est un document réglementaire préfectoral qui délimite les zones exposées et impose des règles de construction. Il est annexé au Plan Local d'Urbanisme (PLU) et s'impose aux permis de construire. Il distingue zones rouges (inconstructibles), bleues (constructibles sous conditions) et blanches.",
      },
      {
        question: "Puis-je construire en zone inondable ?",
        answer:
          "En zone rouge du PPRi, la construction neuve est généralement interdite. En zone bleue, elle est autorisée sous conditions : cote de plancher minimale au-dessus de la cote de référence, dispositifs anti-refoulement, matériaux adaptés. Vérifiez toujours le règlement du PPRi avant d'acheter un terrain.",
      },
      {
        question: "Comment se déroule l'indemnisation catastrophe naturelle ?",
        answer:
          "Vous devez déclarer le sinistre à votre assureur dans les 30 jours suivant la publication de l'arrêté interministériel au Journal officiel. L'expert est mandaté dans les semaines qui suivent. L'indemnisation intervient dans les 3 mois suivant la remise du rapport, sous déduction de la franchise légale.",
      },
      {
        question: "Que faire en cas d'alerte crue ?",
        answer:
          "Surveillez Vigicrues et les consignes préfectorales, coupez gaz et électricité si l'eau approche, montez les biens de valeur à l'étage, ne descendez pas dans les caves ou parkings souterrains et évacuez si les autorités le demandent. Ne prenez jamais la route sur une chaussée submergée.",
      },
      {
        question: "L'État des Risques et Pollutions est-il obligatoire ?",
        answer:
          "Oui, depuis la loi Climat et Résilience de 2021, l'ERP doit être remis dès la première visite à l'acheteur ou au locataire lorsque le bien est situé dans une zone couverte par un plan de prévention des risques. L'absence d'ERP peut entraîner la résolution de la vente ou une diminution du prix.",
      },
      {
        question: "Quelle différence entre crue et inondation ?",
        answer:
          "La crue désigne la hausse du débit d'un cours d'eau, l'inondation désigne la submersion des terres par l'eau (débordement, ruissellement, remontée de nappe, submersion marine). Toute inondation n'est donc pas une crue, et toute crue ne provoque pas nécessairement d'inondation.",
      },
    ],
  },
  seisme: {
    title: "Risque sismique en France",
    description:
      "Comprendre le zonage sismique français, les niveaux de risque, les normes de construction parasismique et les obligations à la vente.",
    intro:
      "La France métropolitaine est majoritairement en sismicité faible ou modérée, mais les Antilles sont classées en zone 5 (forte), et certaines régions comme le sud des Alpes, les Pyrénées ou le fossé rhénan enregistrent régulièrement des secousses. Le zonage sismique national conditionne les règles de construction applicables aux bâtiments neufs.",
    keyFigures: [
      { value: "5", label: "zones de sismicité (1 = très faible, 5 = forte)" },
      { value: "21 000", label: "communes en zone 2 ou plus" },
      { value: "Zone 5", label: "Guadeloupe, Martinique, Saintes" },
      { value: "2011", label: "année d'entrée en vigueur d'Eurocode 8" },
    ],
    sections: [
      {
        heading: "Le zonage sismique français",
        body: "Depuis 2011, la France applique un zonage fondé sur l'accélération attendue du sol. Cinq zones de sismicité croissante sont définies à l'échelle communale.",
        items: [
          "Zone 1 : sismicité très faible (majorité du Bassin parisien, Bretagne).",
          "Zone 2 : sismicité faible (Nord, Centre, Bassin aquitain).",
          "Zone 3 : sismicité modérée (Alsace, Alpes du Nord, Pyrénées centrales).",
          "Zone 4 : sismicité moyenne (Pyrénées-Atlantiques, Alpes-Maritimes, Nice).",
          "Zone 5 : sismicité forte, uniquement aux Antilles françaises.",
        ],
      },
      {
        heading: "Règles parasismiques Eurocode 8",
        body: "Les règles Eurocode 8 s'appliquent obligatoirement aux constructions neuves en zones 2 à 5, avec des exigences croissantes selon la catégorie d'importance du bâtiment (maison individuelle, ERP, hôpitaux, casernes). Elles imposent des dispositions constructives spécifiques : chaînages horizontaux et verticaux, continuité des éléments porteurs, limitation des porte-à-faux, ancrages renforcés.",
      },
      {
        heading: "Comment savoir si ma maison est parasismique ?",
        body: "Un permis de construire délivré avant 2011 ne comporte aucune obligation parasismique dans la plupart des cas. Pour une maison récente en zone 3-5, l'attestation de prise en compte parasismique signée par un contrôleur technique fait foi. Vous pouvez aussi demander au notaire de joindre cette attestation à l'acte de vente et vérifier la présence de chaînages apparents dans les combles.",
      },
      {
        heading: "Historique des séismes en France",
        body: "Les séismes ressentis en France métropolitaine sont fréquents mais rarement destructeurs. Le séisme de Lambesc (Provence) en 1909 a fait 46 morts, celui d'Annecy en 1996 (magnitude 5,1) a endommagé environ 2000 bâtiments. Aux Antilles, le séisme des Saintes en 2004 (magnitude 6,3) a causé des dégâts importants en Guadeloupe.",
      },
      {
        heading: "Particularités des Antilles",
        body: "La Guadeloupe et la Martinique sont exposées à un risque sismique majeur : activité tectonique liée à la subduction de la plaque nord-américaine sous la plaque caraïbe. Le Plan Séisme Antilles impose un renforcement progressif des bâtiments publics (écoles, hôpitaux) et des aides sont disponibles pour les particuliers via la Taxe SDIS et les fonds Barnier.",
      },
    ],
    whatToDo: [
      "Identifier la zone sismique de votre commune sur Géorisques ou DiagAdresse.",
      "Fixer solidement les meubles hauts, chauffe-eau et appareils électroménagers lourds.",
      "Pendant une secousse : se mettre sous une table ou un chambranle, protéger sa tête, s'éloigner des fenêtres.",
      "Après la secousse : couper gaz et électricité, sortir prudemment, éviter les ascenseurs.",
      "En zone 3-5, exiger l'attestation Eurocode 8 à l'achat d'une construction récente.",
      "En construction neuve : recourir à un maître d'œuvre familier des règles parasismiques.",
    ],
    costAndInsurance:
      "La garantie catastrophe naturelle couvre les dommages provoqués par un séisme dès lors qu'un arrêté interministériel a été publié. La franchise légale est de 380 EUR pour une résidence principale. Les renforcements parasismiques sur bâtiments existants ne sont généralement pas remboursés, sauf dans le cadre de plans spécifiques (Plan Séisme Antilles, subventions ANAH).",
    legalObligations:
      "Le diagnostic sismique en tant que tel n'existe pas pour les logements, mais l'État des Risques et Pollutions (ERP) indique la zone sismique. En zones 3 à 5, toute construction neuve de catégorie II, III ou IV doit faire l'objet d'un contrôle technique parasismique obligatoire et d'une attestation à joindre à la déclaration attestant de l'achèvement et de la conformité des travaux.",
    relatedRisks: ["argile", "cavites"],
    faq: [
      {
        question: "Quelle est la zone sismique de ma commune ?",
        answer:
          "La France compte 5 zones de sismicité (1 à 5). Utilisez DiagAdresse pour connaître la zone sismique de votre adresse. Les zones 3 à 5 imposent des normes parasismiques Eurocode 8 pour les constructions neuves et certains travaux importants.",
      },
      {
        question: "Les normes parasismiques sont-elles obligatoires ?",
        answer:
          "Les règles Eurocode 8 sont obligatoires pour les constructions neuves en zones 2 à 5 depuis 2011. Elles imposent des dispositions constructives adaptées : chaînages, continuité structurelle, ancrages. Les bâtiments de catégorie III ou IV (ERP, hôpitaux) ont des exigences renforcées.",
      },
      {
        question: "Un séisme peut-il détruire ma maison en France ?",
        answer:
          "En métropole, le risque d'effondrement complet est faible en dehors des zones 4 et 5. Les dommages les plus fréquents sont des fissures, des chutes de cheminée ou de tuiles, et des ruptures de canalisations. Aux Antilles, le risque de destruction d'un bâtiment non conforme aux règles parasismiques est réel.",
      },
      {
        question: "Mon assurance couvre-t-elle les séismes ?",
        answer:
          "Oui, la garantie catastrophe naturelle incluse dans les contrats habitation couvre les séismes dès lors qu'un arrêté interministériel est publié. La franchise légale est de 380 EUR, déduite de l'indemnisation.",
      },
      {
        question: "Quel est le séisme le plus fort enregistré en France ?",
        answer:
          "Le séisme de Lambesc (Bouches-du-Rhône) en 1909 est considéré comme le plus destructeur en métropole avec une magnitude estimée à 6,2. Aux Antilles, le séisme des Saintes de 2004 a atteint 6,3 et le séisme de Pointe-à-Pitre de 1843 est estimé à 8,5.",
      },
      {
        question: "Comment vérifier la conformité parasismique de ma maison ?",
        answer:
          "Pour une construction postérieure à 2011 en zone 3-5, demandez l'attestation parasismique signée par un contrôleur technique. Pour un bâtiment ancien, seule une étude spécialisée par un bureau d'études permet de chiffrer le niveau de résistance. L'ERP ne fournit pas cette information.",
      },
      {
        question: "Que faire pendant un séisme ?",
        answer:
          "À l'intérieur, ne sortez pas : abritez-vous sous une table solide ou un chambranle de porte, éloignez-vous des fenêtres et des objets qui peuvent tomber. À l'extérieur, éloignez-vous des bâtiments, lignes électriques et arbres. Après la secousse, coupez gaz et électricité, sortez prudemment et écoutez la radio.",
      },
      {
        question: "Les Antilles sont-elles plus exposées que la métropole ?",
        answer:
          "Oui, largement. Guadeloupe et Martinique sont classées en zone 5 (forte sismicité), la seule en France. Le contexte tectonique de subduction génère régulièrement des séismes de magnitude supérieure à 5. Le Plan Séisme Antilles prévoit un programme de renforcement des bâtiments publics et subventionne certains travaux chez les particuliers.",
      },
    ],
  },
  argile: {
    title: "Retrait-gonflement des argiles",
    description:
      "Le risque de retrait-gonflement des sols argileux : causes, conséquences sur le bâti, étude géotechnique obligatoire et mesures de prévention.",
    intro:
      "Le retrait-gonflement des argiles est la deuxième cause d'indemnisation au titre des catastrophes naturelles en France, derrière les inondations. Aggravation par le réchauffement climatique et les épisodes de sécheresse : 48% du territoire métropolitain est désormais classé en exposition moyenne ou forte. Les fissures sur les murs porteurs sont la conséquence la plus visible.",
    keyFigures: [
      {
        value: "48%",
        label: "du territoire métropolitain exposé (moyen/fort)",
      },
      { value: "2e", label: "poste d'indemnisation cat-nat" },
      {
        value: "G1 PGC",
        label: "étude obligatoire à la vente en zone moyenne/forte",
      },
      {
        value: "10 000 - 30 000 EUR",
        label: "coût moyen de réparation de fissures",
      },
    ],
    sections: [
      {
        heading: "Comment les sols argileux réagissent à l'eau",
        body: "Les argiles ont la particularité de gonfler en présence d'eau et de se rétracter lors des sécheresses. Ces variations volumiques, différentielles d'un point à l'autre sous une même construction, provoquent des mouvements du bâti qui se manifestent par des fissures caractéristiques.",
      },
      {
        heading: "Les niveaux d'exposition",
        body: "La carte d'aléas du BRGM distingue quatre niveaux d'exposition, consultables commune par commune.",
        items: [
          "Niveau 0 : absence d'argiles sensibles, aucun risque particulier.",
          "Niveau 1 (faible) : présence d'argiles peu sensibles, sinistres rares.",
          "Niveau 2 (moyen) : exposition significative, étude G1 PGC obligatoire à la vente.",
          "Niveau 3 (fort) : exposition majeure, fondations adaptées impératives.",
        ],
      },
      {
        heading: "Reconnaître les signes d'un sinistre argile",
        body: "Les désordres apparaissent souvent après un été sec. Les signes les plus fréquents sont des fissures obliques en escalier suivant les joints de parpaings, des fissures verticales aux angles de fenêtres ou de portes, des portes et fenêtres qui ferment mal, un décollement des enduits de plinthe, voire une rupture de canalisation enterrée.",
      },
      {
        heading: "Régions les plus concernées",
        body: "Le bassin aquitain (Gironde, Tarn-et-Garonne, Gers), le Bassin parisien (Seine-et-Marne, Val-d'Oise, Yvelines), le Languedoc (Gard, Hérault), et la vallée du Rhône sont les zones où les sinistres argile sont les plus fréquents. À l'inverse, la Bretagne, le Massif central granitique et les Alpes internes sont peu concernés.",
      },
      {
        heading: "L'étude G1 / G2 rendue obligatoire par la loi ELAN",
        body: "Depuis le 1er octobre 2020, la loi ELAN (via le décret du 22 mai 2019) impose une étude géotechnique préalable de type G1 PGC (Principe Général de Construction) lors de la vente d'un terrain constructible situé en zone d'exposition moyenne ou forte. Cette étude doit être jointe à la promesse de vente. Avant la construction, le maître d'ouvrage doit réaliser une étude G2 PRO qui précise les fondations et adaptations nécessaires.",
      },
      {
        heading: "Techniques de construction adaptées",
        body: "Sur sol argileux sensible, plusieurs dispositions constructives réduisent fortement le risque : fondations profondes ancrées sous la zone de dessiccation, semelles rigides et chaînées, joints de dilatation en cas de volume complexe, drainage périmétrique pour stabiliser l'hygrométrie, éloignement des arbres à grand développement racinaire (chênes, saules, peupliers) d'au moins 1,5 fois la hauteur adulte.",
      },
    ],
    whatToDo: [
      "Consulter la carte d'aléas argile de votre commune sur Géorisques ou DiagAdresse.",
      "À l'achat d'un terrain constructible en zone moyenne/forte, exiger l'étude G1 PGC.",
      "Avant construction, commander une étude G2 PRO adaptant les fondations au sol.",
      "Éviter les plantations d'arbres à grand développement à moins de 1,5 fois leur hauteur adulte.",
      "Maintenir un taux d'humidité homogène autour des fondations (drainage, paillage).",
      "En cas de fissure, déclarer en mairie pour appuyer une future demande de reconnaissance cat-nat.",
    ],
    costAndInsurance:
      "Les sinistres liés au retrait-gonflement sont couverts par la garantie catastrophe naturelle, sous réserve d'un arrêté interministériel (reconnaissance commune par commune, année par année). La franchise légale spécifique sécheresse est plus élevée : 1 520 EUR pour les particuliers, modulée en fonction du nombre de reconnaissances antérieures. Une étude G1 coûte 800 à 1 500 EUR, une G2 PRO 2 500 à 5 000 EUR selon la surface.",
    legalObligations:
      "Loi ELAN (2018) et décret du 22 mai 2019 : étude géotechnique G1 PGC obligatoire pour toute vente de terrain constructible en zone d'aléas moyen ou fort, à joindre à la promesse de vente et à l'acte authentique. L'ERP mentionne systématiquement le niveau d'exposition argile. L'absence d'étude géotechnique peut engager la responsabilité du vendeur en cas de sinistre ultérieur.",
    relatedRisks: ["inondation", "cavites"],
    faq: [
      {
        question:
          "Comment savoir si mon terrain est exposé au retrait-gonflement des argiles ?",
        answer:
          "Les niveaux d'exposition vont de 0 (non concerné) à 3 (exposition forte). Utilisez DiagAdresse pour connaître le niveau d'exposition de votre adresse à partir des données Géorisques et du BRGM.",
      },
      {
        question:
          "Quelles précautions prendre pour construire sur sol argileux ?",
        answer:
          "Fondations profondes et rigides ancrées sous la zone de dessiccation, drainage périmétrique, chaînage structurel, éloignement des arbres à grand développement et maintien d'une hygrométrie stable autour des fondations. Une étude G2 PRO doit détailler ces dispositions.",
      },
      {
        question: "L'étude de sol est-elle obligatoire ?",
        answer:
          "Oui, depuis le 1er octobre 2020, la loi ELAN impose une étude G1 PGC lors de toute vente de terrain constructible en zone d'exposition moyenne ou forte. Elle doit être jointe à la promesse de vente. Avant construction, une étude G2 PRO est très fortement recommandée.",
      },
      {
        question: "Les fissures liées à la sécheresse sont-elles indemnisées ?",
        answer:
          "Elles le sont par la garantie catastrophe naturelle, sous réserve qu'un arrêté interministériel de reconnaissance ait été publié pour la commune et l'année concernées. La franchise légale spécifique sécheresse est de 1 520 EUR et peut être modulée si la commune a bénéficié de plusieurs reconnaissances antérieures.",
      },
      {
        question: "Quel est le coût d'une étude G1 ou G2 ?",
        answer:
          "Une étude G1 PGC coûte en général 800 à 1 500 EUR pour une maison individuelle. Une étude G2 PRO, beaucoup plus détaillée, coûte 2 500 à 5 000 EUR selon la surface et la complexité du projet. Le coût est à la charge du vendeur pour la G1 et du maître d'ouvrage pour la G2.",
      },
      {
        question:
          "Puis-je refuser une vente en cas d'étude géotechnique défavorable ?",
        answer:
          "Si l'étude révèle un risque significatif non mentionné au compromis, vous pouvez en principe renoncer à l'achat sans perdre les arrhes sous réserve des conditions suspensives prévues. Faites-vous conseiller par le notaire dès la réception de l'étude.",
      },
      {
        question: "Les sécheresses récentes ont-elles aggravé le risque ?",
        answer:
          "Oui, les étés 2003, 2018, 2019, 2020, 2022 et 2023 ont généré des pics historiques de sinistres. Le régime d'indemnisation a été adapté par la loi du 28 décembre 2021 pour améliorer la prise en charge des fissures liées à la sécheresse, avec une réduction de la franchise pour les communes répétitivement touchées.",
      },
      {
        question: "Les assureurs peuvent-ils refuser l'indemnisation ?",
        answer:
          "Non, si un arrêté cat-nat est publié et si le lien de causalité entre la sécheresse et les fissures est établi par l'expert. Un refus peut être contesté devant la commission de médiation de l'assurance puis devant le tribunal. Conservez toutes les traces : photos datées, déclaration en mairie, courriers.",
      },
    ],
  },
  radon: {
    title: "Risque radon",
    description:
      "Le radon, gaz radioactif naturel : sources, effets sur la santé, mesure dans le logement et solutions de remédiation.",
    intro:
      "Le radon est un gaz radioactif naturel, inodore et incolore, issu de la désintégration de l'uranium présent dans les roches granitiques et volcaniques. En accumulation dans les logements mal ventilés, il est la deuxième cause de cancer du poumon après le tabac. Environ un tiers des communes françaises est classé en potentiel significatif.",
    keyFigures: [
      { value: "2e", label: "cause de cancer du poumon en France" },
      { value: "~3 000", label: "décès par an imputables au radon" },
      { value: "300 Bq/m3", label: "seuil de référence réglementaire" },
      { value: "30-50 EUR", label: "coût d'un kit de mesure de 2 mois" },
    ],
    sections: [
      {
        heading: "D'où vient le radon ?",
        body: "Le radon résulte de la désintégration naturelle de l'uranium présent dans la croûte terrestre. Il est particulièrement concentré dans les sols granitiques (Bretagne, Limousin, Massif central, Corse, Vosges), volcaniques (Auvergne) et certains sols uranifères. À l'air libre, il se dilue rapidement. À l'intérieur d'un bâtiment mal ventilé, il peut s'accumuler à des concentrations problématiques.",
      },
      {
        heading: "Les trois classes de potentiel radon",
        body: "L'Institut de radioprotection et de sûreté nucléaire (IRSN) a établi une cartographie nationale par commune.",
        items: [
          "Classe 1 : potentiel faible, la plupart des bâtiments du Bassin parisien, Nord, Aquitaine.",
          "Classe 2 : potentiel moyen lié à certaines particularités locales (failles, anciennes exploitations minières).",
          "Classe 3 : potentiel significatif, Bretagne, Limousin, Massif central, Corse, Vosges, Auvergne.",
        ],
      },
      {
        heading: "Comment le radon entre-t-il dans un bâtiment ?",
        body: "Le radon remonte par les fissures de dalle, les passages de canalisations, les vides sanitaires non ventilés, les joints sol-murs et les sous-sols semi-enterrés. L'aspiration naturelle des bâtiments chauffés (effet cheminée) accentue l'infiltration en hiver. Les logements les plus concernés sont ceux construits directement sur le sol, sans vide sanitaire, avec une mauvaise ventilation.",
      },
      {
        heading: "Comment mesurer le radon dans son logement ?",
        body: "La mesure se fait avec un détecteur passif (dosimètre) placé dans la pièce de vie la plus fréquentée, pendant au moins 2 mois en période de chauffage (octobre à avril). Les kits sont vendus en pharmacie, en ligne ou par des organismes agréés (entre 30 et 50 EUR analyse comprise). Le résultat est exprimé en becquerels par mètre cube (Bq/m3). Au-delà de 300 Bq/m3, des actions correctives sont recommandées ; au-delà de 1 000 Bq/m3, elles sont urgentes.",
      },
      {
        heading: "Solutions de remédiation",
        body: "Plusieurs techniques, seules ou combinées, permettent de réduire la concentration en radon : amélioration de la ventilation du logement (VMC simple ou double flux correctement dimensionnée), étanchéification des points d'entrée (dalle, passages de canalisations, trappes de vide sanitaire), mise en dépression du sol par un Système de Dépressurisation du Sol (SDS) et, en construction neuve, pose d'une membrane anti-radon sous dalle.",
      },
    ],
    whatToDo: [
      "Consulter la classe de la commune sur la carte IRSN ou DiagAdresse.",
      "En classe 2 ou 3, placer un dosimètre pendant 2 mois en période de chauffage.",
      "Aérer quotidiennement 10 à 15 minutes, même en hiver.",
      "Étanchéifier fissures de dalle, passages de canalisations et trappes de vide sanitaire.",
      "Vérifier ou installer une VMC correctement dimensionnée.",
      "En construction neuve en classe 3 : prévoir une membrane anti-radon sous dalle.",
    ],
    costAndInsurance:
      "Les travaux de remédiation vont de quelques centaines d'euros (étanchéification, remise à niveau VMC) à 3 000 - 5 000 EUR pour un système de dépressurisation du sol. Aucune assurance ne couvre directement le risque radon puisqu'il s'agit d'un phénomène chronique et non accidentel. Certaines collectivités et l'ANAH peuvent subventionner les travaux de ventilation dans le cadre d'opérations d'amélioration de l'habitat.",
    legalObligations:
      "Depuis 2018 (code de la santé publique, articles R1333-28 et suivants), les propriétaires de certains ERP (établissements scolaires et sanitaires, crèches, établissements pénitentiaires) situés en commune de classe 3 sont tenus de mesurer le radon et de réaliser des travaux si le seuil de 300 Bq/m3 est dépassé. Pour les logements privés, pas d'obligation de mesure, mais le classement radon doit figurer dans l'État des Risques et Pollutions (ERP) remis à l'acquéreur ou au locataire.",
    relatedRisks: ["icpe", "inondation"],
    faq: [
      {
        question: "Le radon est-il dangereux pour la santé ?",
        answer:
          "Oui. Le radon est classé cancérigène certain pour l'homme par le CIRC et constitue la deuxième cause de cancer du poumon après le tabac. Environ 3 000 décès par an en France lui sont imputables. Le risque est fortement aggravé chez les fumeurs.",
      },
      {
        question: "Comment réduire le radon dans ma maison ?",
        answer:
          "Aérez quotidiennement votre logement, étanchéifiez les points d'entrée (fissures de dalle, passages de canalisations, trappes), vérifiez votre VMC et, en cas de concentration élevée, envisagez un système de dépressurisation du sol. En construction neuve, une membrane anti-radon est très efficace.",
      },
      {
        question: "Comment mesurer le taux de radon chez soi ?",
        answer:
          "Procurez-vous un dosimètre radon (pharmacie, organismes agréés, en ligne, 30-50 EUR). Placez-le dans la pièce de vie la plus fréquentée, à environ 1 m du sol, pendant au moins 2 mois en période de chauffage. L'analyse est comprise dans le prix du kit et vous recevez le résultat par courrier.",
      },
      {
        question: "Quelle est la valeur réglementaire à respecter ?",
        answer:
          "Le seuil de référence est de 300 Bq/m3 en moyenne annuelle dans les lieux recevant du public. Au-delà, des actions correctives sont imposées. Pour les logements privés, cette valeur est une recommandation : des actions simples suffisent souvent entre 300 et 1 000 Bq/m3, des travaux plus conséquents sont nécessaires au-delà.",
      },
      {
        question: "Ma commune est-elle en classe 3 ?",
        answer:
          "Le classement est établi par l'IRSN à la maille communale. Utilisez DiagAdresse pour connaître la classe de votre commune et l'information sera présente dans l'État des Risques et Pollutions (ERP) remis par votre vendeur ou bailleur.",
      },
      {
        question: "Le radon est-il détectable sans kit de mesure ?",
        answer:
          "Non. Le radon est incolore, inodore et ininflammable. Seul un détecteur spécifique (passif ou électronique) permet de mesurer sa concentration. Les détecteurs de fumée classiques ne fonctionnent pas pour le radon.",
      },
      {
        question: "Le diagnostic radon est-il obligatoire à la vente ?",
        answer:
          "Non pour les logements privés, mais la classe radon de la commune doit apparaître dans l'État des Risques et Pollutions. Les ERP (écoles, hôpitaux, crèches) en classe 3 sont soumis à une obligation de mesure périodique tous les 10 ans.",
      },
      {
        question: "Quels bâtiments sont les plus à risque ?",
        answer:
          "Les maisons anciennes sans vide sanitaire construites directement sur dalle, les sous-sols habitables, les bâtiments mal ventilés et les logements en rez-de-chaussée en commune de classe 3 cumulent les facteurs de risque. Les étages supérieurs des immeubles collectifs sont généralement peu concernés.",
      },
    ],
  },
  icpe: {
    title: "Installations classées (ICPE) et sites Seveso",
    description:
      "Les installations industrielles à risque près de chez vous : classification ICPE, directive Seveso, PPRT et droits des riverains.",
    intro:
      "Les Installations Classées pour la Protection de l'Environnement (ICPE) regroupent les sites industriels, agricoles ou logistiques susceptibles de générer des nuisances ou des risques. Les plus dangereux sont classés Seveso seuil bas ou seuil haut selon les quantités de substances dangereuses stockées. Leur proximité peut entraîner des prescriptions d'urbanisme, des obligations de travaux, voire une décote immobilière.",
    keyFigures: [
      { value: "~500 000", label: "ICPE recensées en France" },
      { value: "~1 300", label: "sites Seveso (seuil haut et bas)" },
      { value: "~700", label: "sites Seveso seuil haut" },
      {
        value: "PPRT",
        label: "plan obligatoire autour de chaque Seveso seuil haut",
      },
    ],
    sections: [
      {
        heading: "Qu'est-ce qu'une ICPE ?",
        body: "Une ICPE est une installation (usine, entrepôt, élevage industriel, station-service, carrière, etc.) dont l'activité est réglementée par le code de l'environnement. La nomenclature ICPE classe plus de 500 rubriques selon la nature des substances ou procédés. Selon leur dangerosité, les installations relèvent de trois régimes croissants : déclaration, enregistrement ou autorisation.",
      },
      {
        heading: "Classement Seveso seuil bas / seuil haut",
        body: "La directive européenne Seveso (transposée dans le droit français) impose des obligations renforcées aux sites manipulant d'importantes quantités de substances dangereuses.",
        items: [
          "Seveso seuil bas : politique de prévention des accidents majeurs, information du public.",
          "Seveso seuil haut : en plus, étude de dangers approfondie, plan d'opération interne, plan particulier d'intervention, PPRT obligatoire autour du site.",
          "ICPE non Seveso : déclaration, enregistrement ou autorisation selon la dangerosité.",
        ],
      },
      {
        heading: "Qu'est-ce qu'un PPRT ?",
        body: "Le Plan de Prévention des Risques Technologiques (PPRT), obligatoire autour de chaque site Seveso seuil haut, délimite des zones où certaines constructions sont interdites ou soumises à prescriptions. Il peut imposer des mesures de renforcement du bâti existant (vitrage, ancrage de toiture, local de confinement) avec obligation de réalisation et financement public à hauteur de 90% (crédit d'impôt et fonds de l'État, collectivité, exploitant).",
      },
      {
        heading: "Consultation publique et droits des riverains",
        body: "Toute nouvelle ICPE soumise à autorisation fait l'objet d'une enquête publique au cours de laquelle les riverains peuvent formuler observations et contre-propositions. Les Commissions de Suivi de Site (CSS) réunissent exploitant, élus, riverains et associations autour des sites Seveso seuil haut. En cas de sinistre (incendie, rejet), la commune doit informer la population via un système d'alerte et des exercices réguliers sont organisés.",
      },
      {
        heading: "Comment savoir s'il y a une ICPE près de chez moi ?",
        body: "La base Géorisques (rubrique 'Installations industrielles') recense l'ensemble des ICPE avec leur régime (autorisation/enregistrement/déclaration) et leur classement Seveso éventuel. L'Inspection des installations classées (DREAL) publie les rapports d'inspection. DiagAdresse intègre ces données pour afficher, autour d'une adresse, les installations répertoriées avec leur niveau de risque.",
      },
    ],
    whatToDo: [
      "Identifier les ICPE et sites Seveso à proximité (1-3 km) via Géorisques ou DiagAdresse.",
      "Consulter le PPRT en mairie si vous êtes en périmètre Seveso seuil haut.",
      "Vérifier les prescriptions de travaux (local de confinement, vitrage) en cas d'achat.",
      "Participer aux enquêtes publiques et aux réunions de la Commission de Suivi de Site.",
      "S'inscrire aux alertes SMS de la commune (système d'alerte et d'information des populations).",
      "En cas d'alerte : rester à l'intérieur, fermer portes et fenêtres, couper la ventilation, écouter la radio.",
    ],
    costAndInsurance:
      "L'achat d'un bien en zone de prescription PPRT n'entraîne pas automatiquement une surcote d'assurance, mais la valeur immobilière peut être affectée (-5 à -20% selon les études notariales locales). Les travaux de renforcement prescrits par un PPRT bénéficient d'un financement public pouvant atteindre 90% (40% État via crédit d'impôt, 25% collectivité, 25% exploitant). Les dommages causés par un accident industriel sont indemnisés par la garantie accident technologique (loi du 30 juillet 2003) couvrant les sinistres de catégorie II et III.",
    legalObligations:
      "L'État des Risques et Pollutions (ERP) doit mentionner la présence d'un PPRT et les prescriptions applicables. Le vendeur doit informer l'acquéreur des sinistres et arrêtés de reconnaissance technologique des cinq dernières années. En zone de prescription, les travaux de renforcement imposés doivent être réalisés dans les délais fixés par le PPRT, sous peine de sanctions administratives.",
    relatedRisks: ["radon", "inondation"],
    faq: [
      {
        question: "Comment savoir s'il y a un site Seveso près de chez moi ?",
        answer:
          "Utilisez DiagAdresse pour identifier les installations classées (ICPE) et sites Seveso à proximité de votre adresse. Les données proviennent de la base Géorisques du ministère de l'Écologie et de l'inventaire des PPRT.",
      },
      {
        question: "Qu'est-ce que la directive Seveso ?",
        answer:
          "La directive Seveso est une réglementation européenne imposant des mesures de prévention et de protection aux sites industriels présentant des risques d'accidents majeurs. Transposée dans le droit français, elle classe les sites en seuil haut (risque majeur) ou seuil bas (risque significatif) selon les quantités de substances dangereuses stockées.",
      },
      {
        question: "Quelle différence entre Seveso seuil haut et seuil bas ?",
        answer:
          "Le seuil haut impose des obligations renforcées : étude de dangers détaillée, plan d'opération interne, plan particulier d'intervention, Commission de Suivi de Site, PPRT obligatoire autour du site. Le seuil bas impose une politique de prévention et l'information du public, sans PPRT obligatoire.",
      },
      {
        question: "Qu'est-ce qu'un PPRT ?",
        answer:
          "Le Plan de Prévention des Risques Technologiques est un document préfectoral qui délimite, autour d'un site Seveso seuil haut, des zones où certaines constructions sont interdites ou soumises à prescriptions. Il peut imposer des travaux de renforcement du bâti existant, financés à 90% par des fonds publics et l'exploitant.",
      },
      {
        question: "Puis-je construire près d'une ICPE ?",
        answer:
          "Oui, hors des zones d'interdiction définies par un éventuel PPRT. En zone de prescription, les permis de construire doivent respecter des règles spécifiques (résistance au souffle, vitrage adapté, local de confinement). Vérifiez le règlement PPRT en mairie avant d'acheter ou de déposer un permis.",
      },
      {
        question: "Suis-je indemnisé en cas d'accident industriel ?",
        answer:
          "Oui, la garantie accident technologique, créée par la loi du 30 juillet 2003 après AZF Toulouse, couvre les dommages aux habitations et véhicules causés par un accident technologique majeur. L'indemnisation est intégrale dans les 3 mois, sans franchise, et sans attendre la recherche de responsabilité.",
      },
      {
        question: "Comment suis-je alerté en cas d'accident ?",
        answer:
          "Par les sirènes du Système d'Alerte et d'Information des Populations (SAIP), les alertes SMS FR-Alert, la radio France Bleu, et les haut-parleurs des véhicules de secours. En cas d'alerte, rentrez immédiatement, fermez portes, fenêtres et ventilation, et attendez les consignes.",
      },
      {
        question: "Les ICPE sont-elles toutes dangereuses ?",
        answer:
          "Non. La majorité des 500 000 ICPE sont soumises à simple déclaration et présentent des risques ou nuisances limités (petites installations, garages, pressings, élevages). Seules les installations soumises à autorisation, et plus particulièrement les sites Seveso, représentent un risque d'accident majeur.",
      },
    ],
  },
  cavites: {
    title: "Cavités souterraines",
    description:
      "Les risques liés aux cavités souterraines : types de cavités, conséquences sur le bâti et précautions avant d'acheter.",
    intro:
      "Les cavités souterraines représentent un risque d'effondrement pouvant affecter les constructions en surface. Carrières abandonnées, grottes, ouvrages militaires, caves anciennes : plus de 500 000 cavités sont recensées en France. L'Île-de-France, la Normandie, le Nord, la Lorraine et les territoires gypseux ou calcaires concentrent la majorité des risques avérés.",
    keyFigures: [
      { value: "500 000+", label: "cavités recensées en France" },
      { value: "3 000 km", label: "de galeries en Île-de-France" },
      {
        value: "IGC",
        label: "Inspection Générale des Carrières (Paris, 92, 94)",
      },
      { value: "Loi 2003", label: "obligation de recensement communal" },
    ],
    sections: [
      {
        heading: "Les différents types de cavités",
        body: "Les cavités souterraines recensées sur Géorisques relèvent de plusieurs origines, chacune avec ses mécanismes propres de détérioration.",
        items: [
          "Cavités naturelles : grottes, gouffres et réseaux karstiques (calcaires du Causse, Jura, Dordogne).",
          "Carrières abandonnées : Paris et sa première couronne (gypse, calcaire grossier), Nord (craie), Val-de-Loire (tuffeau), Picardie (craie).",
          "Ouvrages civils : caves de vignerons, champignonnières, tunnels désaffectés.",
          "Ouvrages militaires : galeries de la Première Guerre mondiale, sapes, abris, blockhaus.",
          "Cavités d'origine anthropique récente : anciens puits, réservoirs, fosses septiques oubliés.",
        ],
      },
      {
        heading: "Quels phénomènes peuvent survenir ?",
        body: "La dégradation d'une cavité souterraine peut provoquer plusieurs types de désordres en surface : affaissement progressif (tassement diffus sur plusieurs mètres de diamètre), effondrement brutal (fontis, création d'un trou circulaire de quelques mètres à quelques dizaines de mètres), fissuration différentielle des constructions, glissement de terrain latéral si la cavité est à flanc de coteau.",
      },
      {
        heading: "Régions les plus concernées",
        body: "L'Île-de-France concentre un risque majeur avec plus de 3 000 km de galeries de carrières sous Paris, les Hauts-de-Seine et le Val-de-Marne, inspectées par l'IGC (Inspection Générale des Carrières). Le Nord et le Pas-de-Calais sont concernés par les catiches (extraction de craie) et l'après-mine du charbon. La Normandie (marnières, craie), le Val-de-Loire (tuffeau), la Picardie (craie) et le Sud-Ouest (gypse, ardoisières) comptent aussi de nombreuses cavités.",
      },
      {
        heading: "Différence entre cavité et risque minier",
        body: "Le risque minier (après-mine) résulte de l'exploitation industrielle de ressources (charbon, fer, sel, potasse, or) et est suivi par le dispositif après-mine (DPSM, Geoderis). Les cavités 'classiques' sont des ouvrages non miniers : carrières ouvertes, cavités naturelles, ouvrages civils. Les deux régimes d'indemnisation diffèrent : le risque minier bénéficie d'un régime spécial (loi 1999) avec indemnisation intégrale, les cavités relèvent du régime cat-nat général avec franchise.",
      },
      {
        heading: "Signes d'alerte et investigations",
        body: "Fissures verticales ou en escalier, portes qui coincent, affaissement localisé du plancher ou du jardin, trous apparus après de fortes pluies, craquements entendus par temps de gel : autant de signes qui justifient une expertise. Les investigations passent par une recherche documentaire (archives préfectorales, IGC, BRGM), une étude géotechnique G5 (recherche de cavités), voire des sondages géophysiques (microgravimétrie, radar de sol) ou des forages destructifs.",
      },
    ],
    whatToDo: [
      "Consulter la base Géorisques 'Cavités souterraines' et l'IGC si en Île-de-France.",
      "À l'achat, demander l'historique et les éventuelles fiches de cavités recensées.",
      "En cas de doute, commander une étude G5 (recherche de cavités) : 1 500 à 3 000 EUR.",
      "Signaler tout affaissement ou fissuration inhabituelle à la mairie.",
      "Ne jamais descendre seul dans une cavité : manque d'oxygène, chutes de blocs.",
      "Ne pas reboucher soi-même : seules des techniques de clavage par injection (béton maigre) sont fiables.",
    ],
    costAndInsurance:
      "Les dommages liés aux effondrements de cavités sont couverts par la garantie catastrophe naturelle après publication d'un arrêté interministériel. Franchise légale : 380 EUR. Pour le risque minier, l'indemnisation est intégrale sans franchise via le dispositif après-mine. Une étude G5 coûte 1 500 à 3 000 EUR, un comblement par injection béton ou un clavage peuvent atteindre 30 000 à 150 000 EUR selon le volume.",
    legalObligations:
      "Loi du 30 juillet 2003 (art. L563-6 du code de l'environnement) : toute commune ayant connaissance de cavités souterraines sur son territoire doit les recenser et les transmettre au préfet. Ces informations figurent dans l'État des Risques et Pollutions (ERP) remis à l'acquéreur ou au locataire. Un Plan de Prévention des Risques cavités peut être prescrit dans les secteurs les plus exposés et interdire certaines constructions ou imposer des études préalables.",
    relatedRisks: ["argile", "seisme"],
    faq: [
      {
        question: "Comment vérifier la présence de cavités souterraines ?",
        answer:
          "Consultez la base Géorisques, la base BDCavité du BRGM et, en Île-de-France, l'Inspection Générale des Carrières (IGC). Utilisez DiagAdresse pour un diagnostic complet. Avant un achat immobilier, faites réaliser une étude G5 si des cavités sont signalées dans le secteur.",
      },
      {
        question: "Quels sont les risques des cavités souterraines ?",
        answer:
          "Affaissement progressif du terrain, effondrement brutal (fontis), fissuration des constructions, glissement latéral si cavité à flanc de coteau. La gravité dépend du type de cavité, de sa profondeur et de sa stabilité. Certains effondrements peuvent entraîner la ruine complète d'un bâtiment.",
      },
      {
        question: "Quelle différence entre cavité et risque minier ?",
        answer:
          "Le risque minier concerne l'après-exploitation industrielle (charbon, fer, sel, potasse) et relève du dispositif après-mine avec indemnisation intégrale. Les cavités classiques (carrières, grottes, ouvrages civils) relèvent du régime cat-nat général avec franchise de 380 EUR.",
      },
      {
        question: "Que faire si je découvre une cavité sous ma maison ?",
        answer:
          "N'y descendez pas, ne la rebouchez pas. Signalez immédiatement à la mairie et faites appel à un bureau d'études géotechnique pour une investigation. Prévenez votre assureur et, si vous êtes en Île-de-France, saisissez l'IGC. Les solutions de confortement (clavage, injection) doivent être dimensionnées par un professionnel.",
      },
      {
        question:
          "L'étude géotechnique est-elle obligatoire pour les cavités ?",
        answer:
          "Non, sauf en zone de Plan de Prévention des Risques cavités. Elle est cependant fortement recommandée à l'achat d'un bien situé en secteur connu pour ses cavités. Une étude G5 (recherche de cavités) coûte 1 500 à 3 000 EUR pour une maison individuelle.",
      },
      {
        question: "Mon assurance couvre-t-elle les effondrements ?",
        answer:
          "Oui, la garantie catastrophe naturelle couvre les effondrements de cavités dès lors qu'un arrêté interministériel est publié pour la commune. La franchise légale est de 380 EUR. Pour le risque minier, l'indemnisation est intégrale sans franchise via le dispositif après-mine.",
      },
      {
        question: "Paris est-elle particulièrement concernée ?",
        answer:
          "Oui. Plusieurs milliers de kilomètres de galeries d'anciennes carrières de calcaire et de gypse s'étendent sous Paris et sa première couronne. L'Inspection Générale des Carrières (IGC) suit leur stabilité et délivre des avis pour chaque permis de construire. Certains quartiers (13e, 14e, 15e, 5e) sont particulièrement concernés.",
      },
      {
        question: "Puis-je construire au-dessus d'une cavité ?",
        answer:
          "Oui, sous réserve de l'avis de l'autorité compétente (IGC en Île-de-France, DDT ailleurs) et d'une étude géotechnique adaptée. Les techniques de confortement (clavage, injection, pieux traversants) permettent de fonder une construction même en présence d'une cavité, mais le surcoût peut être très significatif.",
      },
    ],
  },
};
