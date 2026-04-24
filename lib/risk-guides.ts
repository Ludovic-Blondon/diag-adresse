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
      "Tout savoir sur le risque inondation : zones concernees, plans de prevention, indemnisation et comment proteger votre habitation.",
    intro:
      "L'inondation est le premier risque naturel en France : plus de 17 millions d'habitants y sont exposes et un tiers des communes est concerne a divers degres. Debordement de cours d'eau, ruissellement urbain, remontee de nappe ou submersion marine : les formes sont multiples, et chaque adresse est exposee differemment selon sa topographie et son historique.",
    keyFigures: [
      { value: "17 M", label: "habitants exposes en France" },
      { value: "1er", label: "risque naturel national" },
      { value: "~11 000", label: "communes couvertes par un PPRi" },
      { value: "2e", label: "poste d'indemnisation catastrophe naturelle" },
    ],
    sections: [
      {
        heading: "Les differents types d'inondations",
        body: "Toutes les inondations ne se ressemblent pas. Selon le mecanisme en cause, la vitesse de montee des eaux, la profondeur et la duree varient enormement, tout comme les mesures de prevention efficaces.",
        items: [
          "Debordement de cours d'eau : crue lente (Seine, Loire) ou rapide (vallees cevenoles, arriere-pays mediterraneen).",
          "Ruissellement urbain : saturation des reseaux d'eaux pluviales sur sol impermeabilise.",
          "Remontee de nappe phreatique : l'eau remonte par le sous-sol, caves et vides sanitaires inondes.",
          "Submersion marine : cumul de forte maree, surcote atmospherique et houle, surtout sur les facades atlantique et Manche-Mer du Nord.",
        ],
      },
      {
        heading: "Comment savoir si mon adresse est en zone inondable ?",
        body: "Plusieurs documents permettent de verifier l'exposition d'une adresse. Le Plan de Prevention des Risques Inondation (PPRi), elabore par la prefecture et annexe au PLU, delimite les zones rouges (interdiction de construire), bleues (prescriptions) et blanches. Pour les cours d'eau importants, le Territoire a Risque important d'Inondation (TRI) cartographie des crues frequente, moyenne et extreme. Georisques.gouv.fr agrege ces donnees et les met a disposition gratuitement.",
      },
      {
        heading: "Comment lire un PPRi ?",
        body: "Un PPRi contient un reglement (obligations de construction) et des cartes (zonage). La zone rouge est inconstructible sauf exceptions (extensions limitees, equipements collectifs). La zone bleue autorise la construction sous conditions : cote de plancher minimale, materiaux resistants a l'eau, reseaux hors d'eau, dispositifs anti-refoulement. Un document PPRi se consulte en mairie, en prefecture ou en ligne sur le Geoportail de l'Urbanisme.",
      },
      {
        heading: "Regions et communes les plus exposees",
        body: "Les territoires les plus concernes sont la vallee du Rhone et ses affluents, la Loire moyenne, le bassin de la Seine, le quart sud-est mediterraneen (Gard, Var, Alpes-Maritimes, Herault) et la facade atlantique pour la submersion marine. Paris, Lyon, Bordeaux et Nantes comptent des quartiers entiers classes en zone inondable.",
      },
      {
        heading: "Qu'est-ce qu'une crue centennale ?",
        body: "On parle de crue centennale lorsque la probabilite qu'un tel niveau soit atteint ou depasse chaque annee est de 1%. Ce seuil sert de reference pour dimensionner les PPRi et les ouvrages de protection. Mais une crue centennale peut survenir deux annees de suite : il s'agit d'une probabilite, non d'une periodicite. La crue de la Seine de 1910 reste la reference pour l'agglomeration parisienne.",
      },
    ],
    whatToDo: [
      "Consulter le PPRi de la commune et verifier la cote de plancher du logement.",
      "Exiger l'Etat des Risques et Pollutions (ERP) annexe au bail ou a l'acte de vente.",
      "S'inscrire au service d'alerte crues de la prefecture et suivre Vigicrues.",
      "Surelever les appareils electriques et les prises dans les pieces exposees.",
      "Preparer un kit d'urgence : documents, lampe, radio a piles, eau, trousse de secours.",
      "Souscrire une assurance habitation incluant la garantie catastrophe naturelle (obligatoire depuis 1982).",
    ],
    costAndInsurance:
      "La garantie catastrophe naturelle est incluse automatiquement dans tous les contrats habitation et auto en France. Elle se declenche apres publication d'un arrete interministeriel de reconnaissance de l'etat de catastrophe naturelle (delai typique : 10 jours a 3 mois). Franchise legale : 380 EUR pour les particuliers, 1 520 EUR en cas de subsidence liee a la secheresse. Les travaux de remise en etat, le sechage et parfois le relogement temporaire sont couverts, dans la limite du capital assure.",
    legalObligations:
      "Depuis la loi Climat et Resilience (2021), l'Etat des Risques et Pollutions (ERP) doit etre remis a tout acheteur ou locataire des la premiere visite. Il indique si le bien est en zone de PPR, les arretes de catastrophe naturelle des cinq dernieres annees et les sinistres indemnises. En zone inondable, des travaux de reduction de vulnerabilite peuvent etre prescrits par le PPRi (batardeaux, clapets anti-retour) avec obligation de realisation dans un delai defini.",
    relatedRisks: ["argile", "cavites"],
    faq: [
      {
        question: "Comment savoir si mon logement est en zone inondable ?",
        answer:
          "Consultez le Plan de Prevention des Risques d'Inondation (PPRi) de votre commune sur Georisques.gouv.fr ou utilisez DiagAdresse pour obtenir un diagnostic complet de votre adresse, incluant la zone reglementaire et l'historique des arretes de catastrophe naturelle.",
      },
      {
        question: "L'assurance couvre-t-elle les inondations ?",
        answer:
          "Oui, la garantie catastrophe naturelle est incluse dans tous les contrats d'assurance habitation en France. Elle couvre les dommages apres publication d'un arrete interministeriel de catastrophe naturelle, avec une franchise legale de 380 EUR pour les particuliers.",
      },
      {
        question: "Qu'est-ce qu'un PPRi ?",
        answer:
          "Le Plan de Prevention des Risques Inondation est un document reglementaire prefectoral qui delimite les zones exposees et impose des regles de construction. Il est annexe au Plan Local d'Urbanisme (PLU) et s'impose aux permis de construire. Il distingue zones rouges (inconstructibles), bleues (constructibles sous conditions) et blanches.",
      },
      {
        question: "Puis-je construire en zone inondable ?",
        answer:
          "En zone rouge du PPRi, la construction neuve est generalement interdite. En zone bleue, elle est autorisee sous conditions : cote de plancher minimale au-dessus de la cote de reference, dispositifs anti-refoulement, materiaux adaptes. Verifiez toujours le reglement du PPRi avant d'acheter un terrain.",
      },
      {
        question: "Comment se deroule l'indemnisation catastrophe naturelle ?",
        answer:
          "Vous devez declarer le sinistre a votre assureur dans les 30 jours suivant la publication de l'arrete interministeriel au Journal officiel. L'expert est mandate dans les semaines qui suivent. L'indemnisation intervient dans les 3 mois suivant la remise du rapport, sous deduction de la franchise legale.",
      },
      {
        question: "Que faire en cas d'alerte crue ?",
        answer:
          "Surveillez Vigicrues et les consignes prefectorales, coupez gaz et electricite si l'eau approche, montez les biens de valeur a l'etage, ne descendez pas dans les caves ou parkings souterrains et evacuez si les autorites le demandent. Ne prenez jamais la route sur une chaussee submergee.",
      },
      {
        question: "L'Etat des Risques et Pollutions est-il obligatoire ?",
        answer:
          "Oui, depuis la loi Climat et Resilience de 2021, l'ERP doit etre remis des la premiere visite a l'acheteur ou au locataire lorsque le bien est situe dans une zone couverte par un plan de prevention des risques. L'absence d'ERP peut entrainer la resolution de la vente ou une diminution du prix.",
      },
      {
        question: "Quelle difference entre crue et inondation ?",
        answer:
          "La crue designe la hausse du debit d'un cours d'eau, l'inondation designe la submersion des terres par l'eau (debordement, ruissellement, remontee de nappe, submersion marine). Toute inondation n'est donc pas une crue, et toute crue ne provoque pas necessairement d'inondation.",
      },
    ],
  },
  seisme: {
    title: "Risque sismique en France",
    description:
      "Comprendre le zonage sismique francais, les niveaux de risque, les normes de construction parasismique et les obligations a la vente.",
    intro:
      "La France metropolitaine est majoritairement en sismicite faible ou moderee, mais les Antilles sont classees en zone 5 (forte), et certaines regions comme le sud des Alpes, les Pyrenees ou le fosse rhenan enregistrent regulierement des secousses. Le zonage sismique national conditionne les regles de construction applicables aux batiments neufs.",
    keyFigures: [
      { value: "5", label: "zones de sismicite (1 = tres faible, 5 = forte)" },
      { value: "21 000", label: "communes en zone 2 ou plus" },
      { value: "Zone 5", label: "Guadeloupe, Martinique, Saintes" },
      { value: "2011", label: "annee d'entree en vigueur d'Eurocode 8" },
    ],
    sections: [
      {
        heading: "Le zonage sismique francais",
        body: "Depuis 2011, la France applique un zonage fonde sur l'acceleration attendue du sol. Cinq zones de sismicite croissante sont definies a l'echelle communale.",
        items: [
          "Zone 1 : sismicite tres faible (majorite du Bassin parisien, Bretagne).",
          "Zone 2 : sismicite faible (Nord, Centre, Bassin aquitain).",
          "Zone 3 : sismicite moderee (Alsace, Alpes du Nord, Pyrenees centrales).",
          "Zone 4 : sismicite moyenne (Pyrenees-Atlantiques, Alpes-Maritimes, Nice).",
          "Zone 5 : sismicite forte, uniquement aux Antilles francaises.",
        ],
      },
      {
        heading: "Regles parasismiques Eurocode 8",
        body: "Les regles Eurocode 8 s'appliquent obligatoirement aux constructions neuves en zones 2 a 5, avec des exigences croissantes selon la categorie d'importance du batiment (maison individuelle, ERP, hopitaux, casernes). Elles imposent des dispositions constructives specifiques : chaînages horizontaux et verticaux, continuite des elements porteurs, limitation des porte-a-faux, ancrages renforces.",
      },
      {
        heading: "Comment savoir si ma maison est parasismique ?",
        body: "Un permis de construire delivre avant 2011 ne comporte aucune obligation parasismique dans la plupart des cas. Pour une maison recente en zone 3-5, l'attestation de prise en compte parasismique signee par un controleur technique fait foi. Vous pouvez aussi demander au notaire de joindre cette attestation a l'acte de vente et verifier la presence de chaînages apparents dans les combles.",
      },
      {
        heading: "Historique des seismes en France",
        body: "Les seismes ressentis en France metropolitaine sont frequents mais rarement destructeurs. Le seisme de Lambesc (Provence) en 1909 a fait 46 morts, celui d'Annecy en 1996 (magnitude 5,1) a endommage environ 2000 batiments. Aux Antilles, le seisme des Saintes en 2004 (magnitude 6,3) a cause des degats importants en Guadeloupe.",
      },
      {
        heading: "Particularites des Antilles",
        body: "La Guadeloupe et la Martinique sont exposees a un risque sismique majeur : activite tectonique liee a la subduction de la plaque nord-americaine sous la plaque caraibe. Le Plan Seisme Antilles impose un renforcement progressif des batiments publics (ecoles, hopitaux) et des aides sont disponibles pour les particuliers via la Taxe SDIS et les fonds Barnier.",
      },
    ],
    whatToDo: [
      "Identifier la zone sismique de votre commune sur Georisques ou DiagAdresse.",
      "Fixer solidement les meubles hauts, chauffe-eau et appareils electromenagers lourds.",
      "Pendant une secousse : se mettre sous une table ou un chambranle, proteger sa tete, s'eloigner des fenetres.",
      "Apres la secousse : couper gaz et electricite, sortir prudemment, eviter les ascenseurs.",
      "En zone 3-5, exiger l'attestation Eurocode 8 a l'achat d'une construction recente.",
      "En construction neuve : recourir a un maitre d'oeuvre familier des regles parasismiques.",
    ],
    costAndInsurance:
      "La garantie catastrophe naturelle couvre les dommages provoques par un seisme des lors qu'un arrete interministeriel a ete publie. La franchise legale est de 380 EUR pour une residence principale. Les renforcements parasismiques sur batiments existants ne sont generalement pas rembourses, sauf dans le cadre de plans specifiques (Plan Seisme Antilles, subventions ANAH).",
    legalObligations:
      "Le diagnostic sismique en tant que tel n'existe pas pour les logements, mais l'Etat des Risques et Pollutions (ERP) indique la zone sismique. En zones 3 a 5, toute construction neuve de categorie II, III ou IV doit faire l'objet d'un controle technique parasismique obligatoire et d'une attestation a joindre a la declaration attestant de l'achevement et de la conformite des travaux.",
    relatedRisks: ["argile", "cavites"],
    faq: [
      {
        question: "Quelle est la zone sismique de ma commune ?",
        answer:
          "La France compte 5 zones de sismicite (1 a 5). Utilisez DiagAdresse pour connaitre la zone sismique de votre adresse. Les zones 3 a 5 imposent des normes parasismiques Eurocode 8 pour les constructions neuves et certains travaux importants.",
      },
      {
        question: "Les normes parasismiques sont-elles obligatoires ?",
        answer:
          "Les regles Eurocode 8 sont obligatoires pour les constructions neuves en zones 2 a 5 depuis 2011. Elles imposent des dispositions constructives adaptees : chaînages, continuite structurelle, ancrages. Les batiments de categorie III ou IV (ERP, hopitaux) ont des exigences renforcees.",
      },
      {
        question: "Un seisme peut-il detruire ma maison en France ?",
        answer:
          "En metropole, le risque d'effondrement complet est faible en dehors des zones 4 et 5. Les dommages les plus frequents sont des fissures, des chutes de cheminee ou de tuiles, et des ruptures de canalisations. Aux Antilles, le risque de destruction d'un batiment non conforme aux regles parasismiques est reel.",
      },
      {
        question: "Mon assurance couvre-t-elle les seismes ?",
        answer:
          "Oui, la garantie catastrophe naturelle incluse dans les contrats habitation couvre les seismes des lors qu'un arrete interministeriel est publie. La franchise legale est de 380 EUR, deduite de l'indemnisation.",
      },
      {
        question: "Quel est le seisme le plus fort enregistre en France ?",
        answer:
          "Le seisme de Lambesc (Bouches-du-Rhone) en 1909 est considere comme le plus destructeur en metropole avec une magnitude estimee a 6,2. Aux Antilles, le seisme des Saintes de 2004 a atteint 6,3 et le seisme de Pointe-a-Pitre de 1843 est estime a 8,5.",
      },
      {
        question: "Comment verifier la conformite parasismique de ma maison ?",
        answer:
          "Pour une construction posterieure a 2011 en zone 3-5, demandez l'attestation parasismique signee par un controleur technique. Pour un batiment ancien, seule une etude specialisee par un bureau d'etudes permet de chiffrer le niveau de resistance. L'ERP ne fournit pas cette information.",
      },
      {
        question: "Que faire pendant un seisme ?",
        answer:
          "A l'interieur, ne sortez pas : abritez-vous sous une table solide ou un chambranle de porte, eloignez-vous des fenetres et des objets qui peuvent tomber. A l'exterieur, eloignez-vous des batiments, lignes electriques et arbres. Apres la secousse, coupez gaz et electricite, sortez prudemment et ecoutez la radio.",
      },
      {
        question: "Les Antilles sont-elles plus exposees que la metropole ?",
        answer:
          "Oui, largement. Guadeloupe et Martinique sont classees en zone 5 (forte sismicite), la seule en France. Le contexte tectonique de subduction genere regulierement des seismes de magnitude superieure a 5. Le Plan Seisme Antilles prevoit un programme de renforcement des batiments publics et subventionne certains travaux chez les particuliers.",
      },
    ],
  },
  argile: {
    title: "Retrait-gonflement des argiles",
    description:
      "Le risque de retrait-gonflement des sols argileux : causes, consequences sur le bati, etude geotechnique obligatoire et mesures de prevention.",
    intro:
      "Le retrait-gonflement des argiles est la deuxieme cause d'indemnisation au titre des catastrophes naturelles en France, derriere les inondations. Aggravation par le rechauffement climatique et les episodes de secheresse : 48% du territoire metropolitain est desormais classe en exposition moyenne ou forte. Les fissures sur les murs porteurs sont la consequence la plus visible.",
    keyFigures: [
      {
        value: "48%",
        label: "du territoire metropolitain expose (moyen/fort)",
      },
      { value: "2e", label: "poste d'indemnisation cat-nat" },
      {
        value: "G1 PGC",
        label: "etude obligatoire a la vente en zone moyenne/forte",
      },
      {
        value: "10 000 - 30 000 EUR",
        label: "cout moyen de reparation de fissures",
      },
    ],
    sections: [
      {
        heading: "Comment les sols argileux reagissent a l'eau",
        body: "Les argiles ont la particularite de gonfler en presence d'eau et de se retracter lors des secheresses. Ces variations volumiques, differentielles d'un point a l'autre sous une meme construction, provoquent des mouvements du bati qui se manifestent par des fissures caracteristiques.",
      },
      {
        heading: "Les niveaux d'exposition",
        body: "La carte d'aleas du BRGM distingue quatre niveaux d'exposition, consultables commune par commune.",
        items: [
          "Niveau 0 : absence d'argiles sensibles, aucun risque particulier.",
          "Niveau 1 (faible) : presence d'argiles peu sensibles, sinistres rares.",
          "Niveau 2 (moyen) : exposition significative, etude G1 PGC obligatoire a la vente.",
          "Niveau 3 (fort) : exposition majeure, fondations adaptees imperatives.",
        ],
      },
      {
        heading: "Reconnaitre les signes d'un sinistre argile",
        body: "Les desordres apparaissent souvent apres un ete sec. Les signes les plus frequents sont des fissures obliques en escalier suivant les joints de parpaings, des fissures verticales aux angles de fenetres ou de portes, des portes et fenetres qui ferment mal, un decollement des enduits de plinthe, voire une rupture de canalisation enterree.",
      },
      {
        heading: "Regions les plus concernees",
        body: "Le bassin aquitain (Gironde, Tarn-et-Garonne, Gers), le Bassin parisien (Seine-et-Marne, Val-d'Oise, Yvelines), le Languedoc (Gard, Herault), et la vallee du Rhone sont les zones ou les sinistres argile sont les plus frequents. A l'inverse, la Bretagne, le Massif central granitique et les Alpes internes sont peu concernes.",
      },
      {
        heading: "L'etude G1 / G2 rendue obligatoire par la loi ELAN",
        body: "Depuis le 1er octobre 2020, la loi ELAN (via le decret du 22 mai 2019) impose une etude geotechnique prealable de type G1 PGC (Principe General de Construction) lors de la vente d'un terrain constructible situe en zone d'exposition moyenne ou forte. Cette etude doit etre jointe a la promesse de vente. Avant la construction, le maitre d'ouvrage doit realiser une etude G2 PRO qui precise les fondations et adaptations necessaires.",
      },
      {
        heading: "Techniques de construction adaptees",
        body: "Sur sol argileux sensible, plusieurs dispositions constructives reduisent fortement le risque : fondations profondes ancrees sous la zone de dessication, semelles rigides et chaînees, joints de dilatation en cas de volume complexe, drainage perimetrique pour stabiliser l'hygrometrie, eloignement des arbres a grand developpement racinaire (chenes, saules, peupliers) d'au moins 1,5 fois la hauteur adulte.",
      },
    ],
    whatToDo: [
      "Consulter la carte d'aleas argile de votre commune sur Georisques ou DiagAdresse.",
      "A l'achat d'un terrain constructible en zone moyenne/forte, exiger l'etude G1 PGC.",
      "Avant construction, commander une etude G2 PRO adaptant les fondations au sol.",
      "Eviter les plantations d'arbres a grand developpement a moins de 1,5 fois leur hauteur adulte.",
      "Maintenir un taux d'humidite homogene autour des fondations (drainage, paillage).",
      "En cas de fissure, declarer en mairie pour appuyer une future demande de reconnaissance cat-nat.",
    ],
    costAndInsurance:
      "Les sinistres lies au retrait-gonflement sont couverts par la garantie catastrophe naturelle, sous reserve d'un arrete interministeriel (reconnaissance commune par commune, annee par annee). La franchise legale specifique secheresse est plus elevee : 1 520 EUR pour les particuliers, modulee en fonction du nombre de reconnaissances anterieures. Une etude G1 coute 800 a 1 500 EUR, une G2 PRO 2 500 a 5 000 EUR selon la surface.",
    legalObligations:
      "Loi ELAN (2018) et decret du 22 mai 2019 : etude geotechnique G1 PGC obligatoire pour toute vente de terrain constructible en zone d'aleas moyen ou fort, a joindre a la promesse de vente et a l'acte authentique. L'ERP mentionne systematiquement le niveau d'exposition argile. L'absence d'etude geotechnique peut engager la responsabilite du vendeur en cas de sinistre ulterieur.",
    relatedRisks: ["inondation", "cavites"],
    faq: [
      {
        question:
          "Comment savoir si mon terrain est expose au retrait-gonflement des argiles ?",
        answer:
          "Les niveaux d'exposition vont de 0 (non concerne) a 3 (exposition forte). Utilisez DiagAdresse pour connaitre le niveau d'exposition de votre adresse a partir des donnees Georisques et du BRGM.",
      },
      {
        question:
          "Quelles precautions prendre pour construire sur sol argileux ?",
        answer:
          "Fondations profondes et rigides ancrees sous la zone de dessication, drainage perimetrique, chaînage structurel, eloignement des arbres a grand developpement et maintien d'une hygrometrie stable autour des fondations. Une etude G2 PRO doit detailler ces dispositions.",
      },
      {
        question: "L'etude de sol est-elle obligatoire ?",
        answer:
          "Oui, depuis le 1er octobre 2020, la loi ELAN impose une etude G1 PGC lors de toute vente de terrain constructible en zone d'exposition moyenne ou forte. Elle doit etre jointe a la promesse de vente. Avant construction, une etude G2 PRO est tres fortement recommandee.",
      },
      {
        question: "Les fissures liees a la secheresse sont-elles indemnisees ?",
        answer:
          "Elles le sont par la garantie catastrophe naturelle, sous reserve qu'un arrete interministeriel de reconnaissance ait ete publie pour la commune et l'annee concernees. La franchise legale specifique secheresse est de 1 520 EUR et peut etre modulee si la commune a beneficie de plusieurs reconnaissances anterieures.",
      },
      {
        question: "Quel est le cout d'une etude G1 ou G2 ?",
        answer:
          "Une etude G1 PGC coute en general 800 a 1 500 EUR pour une maison individuelle. Une etude G2 PRO, beaucoup plus detaillee, coute 2 500 a 5 000 EUR selon la surface et la complexite du projet. Le cout est a la charge du vendeur pour la G1 et du maitre d'ouvrage pour la G2.",
      },
      {
        question:
          "Puis-je refuser une vente en cas d'etude geotechnique defavorable ?",
        answer:
          "Si l'etude revele un risque significatif non mentionne au compromis, vous pouvez en principe renoncer a l'achat sans perdre les arrhes sous reserve des conditions suspensives prevues. Faites-vous conseiller par le notaire des la reception de l'etude.",
      },
      {
        question: "Les secheresses recentes ont-elles aggrave le risque ?",
        answer:
          "Oui, les etes 2003, 2018, 2019, 2020, 2022 et 2023 ont genere des pics historiques de sinistres. Le regime d'indemnisation a ete adapte par la loi du 28 decembre 2021 pour ameliorer la prise en charge des fissures liees a la secheresse, avec une reduction de la franchise pour les communes repetitivement touchees.",
      },
      {
        question: "Les assureurs peuvent-ils refuser l'indemnisation ?",
        answer:
          "Non, si un arrete cat-nat est publie et si le lien de causalite entre la secheresse et les fissures est etabli par l'expert. Un refus peut etre conteste devant la commission de mediation de l'assurance puis devant le tribunal. Conservez toutes les traces : photos datees, declaration en mairie, courriers.",
      },
    ],
  },
  radon: {
    title: "Risque radon",
    description:
      "Le radon, gaz radioactif naturel : sources, effets sur la sante, mesure dans le logement et solutions de remediation.",
    intro:
      "Le radon est un gaz radioactif naturel, inodore et incolore, issu de la desintegration de l'uranium present dans les roches granitiques et volcaniques. En accumulation dans les logements mal ventiles, il est la deuxieme cause de cancer du poumon apres le tabac. Environ un tiers des communes francaises est classe en potentiel significatif.",
    keyFigures: [
      { value: "2e", label: "cause de cancer du poumon en France" },
      { value: "~3 000", label: "deces par an imputables au radon" },
      { value: "300 Bq/m3", label: "seuil de reference reglementaire" },
      { value: "30-50 EUR", label: "cout d'un kit de mesure de 2 mois" },
    ],
    sections: [
      {
        heading: "D'ou vient le radon ?",
        body: "Le radon resulte de la desintegration naturelle de l'uranium present dans la croute terrestre. Il est particulierement concentre dans les sols granitiques (Bretagne, Limousin, Massif central, Corse, Vosges), volcaniques (Auvergne) et certains sols uraniferes. A l'air libre, il se dilue rapidement. A l'interieur d'un batiment mal ventile, il peut s'accumuler a des concentrations problematiques.",
      },
      {
        heading: "Les trois classes de potentiel radon",
        body: "L'Institut de radioprotection et de surete nucleaire (IRSN) a etabli une cartographie nationale par commune.",
        items: [
          "Classe 1 : potentiel faible, la plupart des batiments du Bassin parisien, Nord, Aquitaine.",
          "Classe 2 : potentiel moyen lie a certaines particularites locales (failles, anciennes exploitations minieres).",
          "Classe 3 : potentiel significatif, Bretagne, Limousin, Massif central, Corse, Vosges, Auvergne.",
        ],
      },
      {
        heading: "Comment le radon entre-t-il dans un batiment ?",
        body: "Le radon remonte par les fissures de dalle, les passages de canalisations, les vides sanitaires non ventiles, les joints sol-murs et les sous-sols semi-enterres. L'aspiration naturelle des batiments chauffes (effet cheminee) accentue l'infiltration en hiver. Les logements les plus concernes sont ceux construits directement sur le sol, sans vide sanitaire, avec une mauvaise ventilation.",
      },
      {
        heading: "Comment mesurer le radon dans son logement ?",
        body: "La mesure se fait avec un detecteur passif (dosimetre) place dans la piece de vie la plus frequentee, pendant au moins 2 mois en periode de chauffage (octobre a avril). Les kits sont vendus en pharmacie, en ligne ou par des organismes agrees (entre 30 et 50 EUR analyse comprise). Le resultat est exprime en becquerels par metre cube (Bq/m3). Au-dela de 300 Bq/m3, des actions correctives sont recommandees ; au-dela de 1 000 Bq/m3, elles sont urgentes.",
      },
      {
        heading: "Solutions de remediation",
        body: "Plusieurs techniques, seules ou combinees, permettent de reduire la concentration en radon : amelioration de la ventilation du logement (VMC simple ou double flux correctement dimensionnee), etancheification des points d'entree (dalle, passages de canalisations, trappes de vide sanitaire), mise en depression du sol par un Systeme de Depressurisation du Sol (SDS) et, en construction neuve, pose d'une membrane anti-radon sous dalle.",
      },
    ],
    whatToDo: [
      "Consulter la classe de la commune sur la carte IRSN ou DiagAdresse.",
      "En classe 2 ou 3, placer un dosimetre pendant 2 mois en periode de chauffage.",
      "Aerer quotidiennement 10 a 15 minutes, meme en hiver.",
      "Etancheifier fissures de dalle, passages de canalisations et trappes de vide sanitaire.",
      "Verifier ou installer une VMC correctement dimensionnee.",
      "En construction neuve en classe 3 : prevoir une membrane anti-radon sous dalle.",
    ],
    costAndInsurance:
      "Les travaux de remediation vont de quelques centaines d'euros (etancheification, remise a niveau VMC) a 3 000 - 5 000 EUR pour un systeme de depressurisation du sol. Aucune assurance ne couvre directement le risque radon puisqu'il s'agit d'un phenomene chronique et non accidentel. Certaines collectivites et l'ANAH peuvent subventionner les travaux de ventilation dans le cadre d'operations d'amelioration de l'habitat.",
    legalObligations:
      "Depuis 2018 (code de la sante publique, articles R1333-28 et suivants), les proprietaires de certains ERP (etablissements scolaires et sanitaires, crèches, etablissements penitentiaires) situes en commune de classe 3 sont tenus de mesurer le radon et de realiser des travaux si le seuil de 300 Bq/m3 est depasse. Pour les logements prives, pas d'obligation de mesure, mais le classement radon doit figurer dans l'Etat des Risques et Pollutions (ERP) remis a l'acquereur ou au locataire.",
    relatedRisks: ["icpe", "inondation"],
    faq: [
      {
        question: "Le radon est-il dangereux pour la sante ?",
        answer:
          "Oui. Le radon est classe cancerigene certain pour l'homme par le CIRC et constitue la deuxieme cause de cancer du poumon apres le tabac. Environ 3 000 deces par an en France lui sont imputables. Le risque est fortement aggrave chez les fumeurs.",
      },
      {
        question: "Comment reduire le radon dans ma maison ?",
        answer:
          "Aerez quotidiennement votre logement, etancheifiez les points d'entree (fissures de dalle, passages de canalisations, trappes), verifiez votre VMC et, en cas de concentration elevee, envisagez un systeme de depressurisation du sol. En construction neuve, une membrane anti-radon est tres efficace.",
      },
      {
        question: "Comment mesurer le taux de radon chez soi ?",
        answer:
          "Procurez-vous un dosimetre radon (pharmacie, organismes agrees, en ligne, 30-50 EUR). Placez-le dans la piece de vie la plus frequentee, a environ 1 m du sol, pendant au moins 2 mois en periode de chauffage. L'analyse est comprise dans le prix du kit et vous recevez le resultat par courrier.",
      },
      {
        question: "Quelle est la valeur reglementaire a respecter ?",
        answer:
          "Le seuil de reference est de 300 Bq/m3 en moyenne annuelle dans les lieux recevant du public. Au-dela, des actions correctives sont imposees. Pour les logements prives, cette valeur est une recommandation : des actions simples suffisent souvent entre 300 et 1 000 Bq/m3, des travaux plus consequents sont necessaires au-dela.",
      },
      {
        question: "Ma commune est-elle en classe 3 ?",
        answer:
          "Le classement est etabli par l'IRSN a la maille communale. Utilisez DiagAdresse pour connaitre la classe de votre commune et l'information sera presente dans l'Etat des Risques et Pollutions (ERP) remis par votre vendeur ou bailleur.",
      },
      {
        question: "Le radon est-il detectable sans kit de mesure ?",
        answer:
          "Non. Le radon est incolore, inodore et ininflammable. Seul un detecteur specifique (passif ou electronique) permet de mesurer sa concentration. Les detecteurs de fumee classiques ne fonctionnent pas pour le radon.",
      },
      {
        question: "Le diagnostic radon est-il obligatoire a la vente ?",
        answer:
          "Non pour les logements prives, mais la classe radon de la commune doit apparaitre dans l'Etat des Risques et Pollutions. Les ERP (ecoles, hopitaux, crèches) en classe 3 sont soumis a une obligation de mesure periodique tous les 10 ans.",
      },
      {
        question: "Quels batiments sont les plus a risque ?",
        answer:
          "Les maisons anciennes sans vide sanitaire construites directement sur dalle, les sous-sols habitables, les batiments mal ventiles et les logements en rez-de-chaussee en commune de classe 3 cumulent les facteurs de risque. Les etages superieurs des immeubles collectifs sont generalement peu concernes.",
      },
    ],
  },
  icpe: {
    title: "Installations classees (ICPE) et sites Seveso",
    description:
      "Les installations industrielles a risque pres de chez vous : classification ICPE, directive Seveso, PPRT et droits des riverains.",
    intro:
      "Les Installations Classees pour la Protection de l'Environnement (ICPE) regroupent les sites industriels, agricoles ou logistiques susceptibles de generer des nuisances ou des risques. Les plus dangereux sont classes Seveso seuil bas ou seuil haut selon les quantites de substances dangereuses stockees. Leur proximite peut entrainer des prescriptions d'urbanisme, des obligations de travaux, voire une decote immobiliere.",
    keyFigures: [
      { value: "~500 000", label: "ICPE recensees en France" },
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
        body: "Une ICPE est une installation (usine, entrepot, elevage industriel, station-service, carriere, etc.) dont l'activite est reglementee par le code de l'environnement. La nomenclature ICPE classe plus de 500 rubriques selon la nature des substances ou procedes. Selon leur dangerosite, les installations relevent de trois regimes croissants : declaration, enregistrement ou autorisation.",
      },
      {
        heading: "Classement Seveso seuil bas / seuil haut",
        body: "La directive europeenne Seveso (transposee dans le droit francais) impose des obligations renforcees aux sites manipulant d'importantes quantites de substances dangereuses.",
        items: [
          "Seveso seuil bas : politique de prevention des accidents majeurs, information du public.",
          "Seveso seuil haut : en plus, etude de dangers approfondie, plan d'operation interne, plan particulier d'intervention, PPRT obligatoire autour du site.",
          "ICPE non Seveso : declaration, enregistrement ou autorisation selon la dangerosite.",
        ],
      },
      {
        heading: "Qu'est-ce qu'un PPRT ?",
        body: "Le Plan de Prevention des Risques Technologiques (PPRT), obligatoire autour de chaque site Seveso seuil haut, delimite des zones ou certaines constructions sont interdites ou soumises a prescriptions. Il peut imposer des mesures de renforcement du bati existant (vitrage, ancrage de toiture, local de confinement) avec obligation de realisation et financement public a hauteur de 90% (credit d'impot et fonds de l'Etat, collectivite, exploitant).",
      },
      {
        heading: "Consultation publique et droits des riverains",
        body: "Toute nouvelle ICPE soumise a autorisation fait l'objet d'une enquete publique au cours de laquelle les riverains peuvent formuler observations et contre-propositions. Les Commissions de Suivi de Site (CSS) reunissent exploitant, elus, riverains et associations autour des sites Seveso seuil haut. En cas de sinistre (incendie, rejet), la commune doit informer la population via un systeme d'alerte et des exercices reguliers sont organises.",
      },
      {
        heading: "Comment savoir s'il y a une ICPE pres de chez moi ?",
        body: "La base Georisques (rubrique 'Installations industrielles') recense l'ensemble des ICPE avec leur regime (autorisation/enregistrement/declaration) et leur classement Seveso eventuel. L'Inspection des installations classees (DREAL) publie les rapports d'inspection. DiagAdresse integre ces donnees pour afficher, autour d'une adresse, les installations repertoriees avec leur niveau de risque.",
      },
    ],
    whatToDo: [
      "Identifier les ICPE et sites Seveso a proximite (1-3 km) via Georisques ou DiagAdresse.",
      "Consulter le PPRT en mairie si vous etes en perimetre Seveso seuil haut.",
      "Verifier les prescriptions de travaux (local de confinement, vitrage) en cas d'achat.",
      "Participer aux enquetes publiques et aux reunions de la Commission de Suivi de Site.",
      "S'inscrire aux alertes SMS de la commune (systeme d'alerte et d'information des populations).",
      "En cas d'alerte : rester a l'interieur, fermer portes et fenetres, couper la ventilation, ecouter la radio.",
    ],
    costAndInsurance:
      "L'achat d'un bien en zone de prescription PPRT n'entraine pas automatiquement une surcote d'assurance, mais la valeur immobiliere peut etre affectee (-5 a -20% selon les etudes notariales locales). Les travaux de renforcement prescrits par un PPRT beneficient d'un financement public pouvant atteindre 90% (40% Etat via credit d'impot, 25% collectivite, 25% exploitant). Les dommages causes par un accident industriel sont indemnises par la garantie accident technologique (loi du 30 juillet 2003) couvrant les sinistres de categorie II et III.",
    legalObligations:
      "L'Etat des Risques et Pollutions (ERP) doit mentionner la presence d'un PPRT et les prescriptions applicables. Le vendeur doit informer l'acquereur des sinistres et arretes de reconnaissance technologique des cinq dernieres annees. En zone de prescription, les travaux de renforcement imposes doivent etre realises dans les delais fixes par le PPRT, sous peine de sanctions administratives.",
    relatedRisks: ["radon", "inondation"],
    faq: [
      {
        question: "Comment savoir s'il y a un site Seveso pres de chez moi ?",
        answer:
          "Utilisez DiagAdresse pour identifier les installations classees (ICPE) et sites Seveso a proximite de votre adresse. Les donnees proviennent de la base Georisques du ministere de l'Ecologie et de l'inventaire des PPRT.",
      },
      {
        question: "Qu'est-ce que la directive Seveso ?",
        answer:
          "La directive Seveso est une reglementation europeenne imposant des mesures de prevention et de protection aux sites industriels presentant des risques d'accidents majeurs. Transposee dans le droit francais, elle classe les sites en seuil haut (risque majeur) ou seuil bas (risque significatif) selon les quantites de substances dangereuses stockees.",
      },
      {
        question: "Quelle difference entre Seveso seuil haut et seuil bas ?",
        answer:
          "Le seuil haut impose des obligations renforcees : etude de dangers detaillee, plan d'operation interne, plan particulier d'intervention, Commission de Suivi de Site, PPRT obligatoire autour du site. Le seuil bas impose une politique de prevention et l'information du public, sans PPRT obligatoire.",
      },
      {
        question: "Qu'est-ce qu'un PPRT ?",
        answer:
          "Le Plan de Prevention des Risques Technologiques est un document prefectoral qui delimite, autour d'un site Seveso seuil haut, des zones ou certaines constructions sont interdites ou soumises a prescriptions. Il peut imposer des travaux de renforcement du bati existant, finances a 90% par des fonds publics et l'exploitant.",
      },
      {
        question: "Puis-je construire pres d'une ICPE ?",
        answer:
          "Oui, hors des zones d'interdiction definies par un eventuel PPRT. En zone de prescription, les permis de construire doivent respecter des regles specifiques (resistance au souffle, vitrage adapte, local de confinement). Verifiez le reglement PPRT en mairie avant d'acheter ou de deposer un permis.",
      },
      {
        question: "Suis-je indemnise en cas d'accident industriel ?",
        answer:
          "Oui, la garantie accident technologique, creee par la loi du 30 juillet 2003 apres AZF Toulouse, couvre les dommages aux habitations et vehicules causes par un accident technologique majeur. L'indemnisation est integrale dans les 3 mois, sans franchise, et sans attendre la recherche de responsabilite.",
      },
      {
        question: "Comment suis-je alerte en cas d'accident ?",
        answer:
          "Par les sirenes du Systeme d'Alerte et d'Information des Populations (SAIP), les alertes SMS FR-Alert, la radio France Bleu, et les haut-parleurs des vehicules de secours. En cas d'alerte, rentrez immediatement, fermez portes, fenetres et ventilation, et attendez les consignes.",
      },
      {
        question: "Les ICPE sont-elles toutes dangereuses ?",
        answer:
          "Non. La majorite des 500 000 ICPE sont soumises a simple declaration et presentent des risques ou nuisances limites (petites installations, garages, pressings, elevages). Seules les installations soumises a autorisation, et plus particulierement les sites Seveso, representent un risque d'accident majeur.",
      },
    ],
  },
  cavites: {
    title: "Cavites souterraines",
    description:
      "Les risques lies aux cavites souterraines : types de cavites, consequences sur le bati et precautions avant d'acheter.",
    intro:
      "Les cavites souterraines representent un risque d'effondrement pouvant affecter les constructions en surface. Carrieres abandonnees, grottes, ouvrages militaires, caves anciennes : plus de 500 000 cavites sont recensees en France. L'Ile-de-France, la Normandie, le Nord, la Lorraine et les territoires gypseux ou calcaires concentrent la majorite des risques averes.",
    keyFigures: [
      { value: "500 000+", label: "cavites recensees en France" },
      { value: "3 000 km", label: "de galeries en Ile-de-France" },
      {
        value: "IGC",
        label: "Inspection Generale des Carrieres (Paris, 92, 94)",
      },
      { value: "Loi 2003", label: "obligation de recensement communal" },
    ],
    sections: [
      {
        heading: "Les differents types de cavites",
        body: "Les cavites souterraines recensees sur Georisques relevent de plusieurs origines, chacune avec ses mecanismes propres de deterioration.",
        items: [
          "Cavites naturelles : grottes, gouffres et reseaux karstiques (calcaires du Causse, Jura, Dordogne).",
          "Carrieres abandonnees : Paris et sa premiere couronne (gypse, calcaire grossier), Nord (craie), Val-de-Loire (tuffeau), Picardie (craie).",
          "Ouvrages civils : caves de vignerons, champignonnieres, tunnels desaffectes.",
          "Ouvrages militaires : galeries de la Premiere Guerre mondiale, sapes, abris, blockhaus.",
          "Cavites d'origine anthropique recente : anciens puits, reservoirs, fosses septiques oublies.",
        ],
      },
      {
        heading: "Quels phenomenes peuvent survenir ?",
        body: "La degradation d'une cavite souterraine peut provoquer plusieurs types de desordres en surface : affaissement progressif (tassement diffus sur plusieurs metres de diametre), effondrement brutal (fontis, creation d'un trou circulaire de quelques metres a quelques dizaines de metres), fissuration differentielle des constructions, glissement de terrain lateral si la cavite est a flanc de coteau.",
      },
      {
        heading: "Regions les plus concernees",
        body: "L'Ile-de-France concentre un risque majeur avec plus de 3 000 km de galeries de carrieres sous Paris, les Hauts-de-Seine et le Val-de-Marne, inspectees par l'IGC (Inspection Generale des Carrieres). Le Nord et le Pas-de-Calais sont concernes par les catiches (extraction de craie) et l'apres-mine du charbon. La Normandie (marnieres, craie), le Val-de-Loire (tuffeau), la Picardie (craie) et le Sud-Ouest (gypse, ardoisieres) comptent aussi de nombreuses cavites.",
      },
      {
        heading: "Difference entre cavite et risque minier",
        body: "Le risque minier (apres-mine) resulte de l'exploitation industrielle de ressources (charbon, fer, sel, potasse, or) et est suivi par le dispositif apres-mine (DPSM, Geoderis). Les cavites 'classiques' sont des ouvrages non miniers : carrieres ouvertes, cavites naturelles, ouvrages civils. Les deux regimes d'indemnisation different : le risque minier beneficie d'un regime special (loi 1999) avec indemnisation integrale, les cavites relevent du regime cat-nat general avec franchise.",
      },
      {
        heading: "Signes d'alerte et investigations",
        body: "Fissures verticales ou en escalier, portes qui coincent, affaissement localise du plancher ou du jardin, trous apparus apres de fortes pluies, craquements entendus par temps de gel : autant de signes qui justifient une expertise. Les investigations passent par une recherche documentaire (archives prefectorales, IGC, BRGM), une etude geotechnique G5 (recherche de cavites), voire des sondages geophysiques (microgravimetrie, radar de sol) ou des forages destructifs.",
      },
    ],
    whatToDo: [
      "Consulter la base Georisques 'Cavites souterraines' et l'IGC si en Ile-de-France.",
      "A l'achat, demander l'historique et les eventuelles fiches de cavites recensees.",
      "En cas de doute, commander une etude G5 (recherche de cavites) : 1 500 a 3 000 EUR.",
      "Signaler tout affaissement ou fissuration inhabituelle a la mairie.",
      "Ne jamais descendre seul dans une cavite : manque d'oxygene, chutes de blocs.",
      "Ne pas reboucher soi-meme : seules des techniques de clavage par injection (beton maigre) sont fiables.",
    ],
    costAndInsurance:
      "Les dommages lies aux effondrements de cavites sont couverts par la garantie catastrophe naturelle apres publication d'un arrete interministeriel. Franchise legale : 380 EUR. Pour le risque minier, l'indemnisation est integrale sans franchise via le dispositif apres-mine. Une etude G5 coute 1 500 a 3 000 EUR, un comblement par injection beton ou un clavage peuvent atteindre 30 000 a 150 000 EUR selon le volume.",
    legalObligations:
      "Loi du 30 juillet 2003 (art. L563-6 du code de l'environnement) : toute commune ayant connaissance de cavites souterraines sur son territoire doit les recenser et les transmettre au prefet. Ces informations figurent dans l'Etat des Risques et Pollutions (ERP) remis a l'acquereur ou au locataire. Un Plan de Prevention des Risques cavites peut etre prescrit dans les secteurs les plus exposes et interdire certaines constructions ou imposer des etudes prealables.",
    relatedRisks: ["argile", "seisme"],
    faq: [
      {
        question: "Comment verifier la presence de cavites souterraines ?",
        answer:
          "Consultez la base Georisques, la base BDCavite du BRGM et, en Ile-de-France, l'Inspection Generale des Carrieres (IGC). Utilisez DiagAdresse pour un diagnostic complet. Avant un achat immobilier, faites realiser une etude G5 si des cavites sont signalees dans le secteur.",
      },
      {
        question: "Quels sont les risques des cavites souterraines ?",
        answer:
          "Affaissement progressif du terrain, effondrement brutal (fontis), fissuration des constructions, glissement lateral si cavite a flanc de coteau. La gravite depend du type de cavite, de sa profondeur et de sa stabilite. Certains effondrements peuvent entrainer la ruine complete d'un batiment.",
      },
      {
        question: "Quelle difference entre cavite et risque minier ?",
        answer:
          "Le risque minier concerne l'apres-exploitation industrielle (charbon, fer, sel, potasse) et releve du dispositif apres-mine avec indemnisation integrale. Les cavites classiques (carrieres, grottes, ouvrages civils) relevent du regime cat-nat general avec franchise de 380 EUR.",
      },
      {
        question: "Que faire si je decouvre une cavite sous ma maison ?",
        answer:
          "N'y descendez pas, ne la rebouchez pas. Signalez immediatement a la mairie et faites appel a un bureau d'etudes geotechnique pour une investigation. Prevenez votre assureur et, si vous etes en Ile-de-France, saisissez l'IGC. Les solutions de confortement (clavage, injection) doivent etre dimensionnees par un professionnel.",
      },
      {
        question:
          "L'etude geotechnique est-elle obligatoire pour les cavites ?",
        answer:
          "Non, sauf en zone de Plan de Prevention des Risques cavites. Elle est cependant fortement recommandee a l'achat d'un bien situe en secteur connu pour ses cavites. Une etude G5 (recherche de cavites) coute 1 500 a 3 000 EUR pour une maison individuelle.",
      },
      {
        question: "Mon assurance couvre-t-elle les effondrements ?",
        answer:
          "Oui, la garantie catastrophe naturelle couvre les effondrements de cavites des lors qu'un arrete interministeriel est publie pour la commune. La franchise legale est de 380 EUR. Pour le risque minier, l'indemnisation est integrale sans franchise via le dispositif apres-mine.",
      },
      {
        question: "Paris est-elle particulierement concernee ?",
        answer:
          "Oui. Plusieurs milliers de kilometres de galeries d'anciennes carrieres de calcaire et de gypse s'etendent sous Paris et sa premiere couronne. L'Inspection Generale des Carrieres (IGC) suit leur stabilite et delivre des avis pour chaque permis de construire. Certains quartiers (13e, 14e, 15e, 5e) sont particulierement concernes.",
      },
      {
        question: "Puis-je construire au-dessus d'une cavite ?",
        answer:
          "Oui, sous reserve de l'avis de l'autorite competente (IGC en Ile-de-France, DDT ailleurs) et d'une etude geotechnique adaptee. Les techniques de confortement (clavage, injection, pieux traversants) permettent de fonder une construction meme en presence d'une cavite, mais le surcout peut etre tres significatif.",
      },
    ],
  },
};
