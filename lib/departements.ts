import communeCodes from "./sitemap-communes.json";

/** All French departements with code and name */
export const DEPARTEMENTS: Record<string, string> = {
  "01": "Ain",
  "02": "Aisne",
  "03": "Allier",
  "04": "Alpes-de-Haute-Provence",
  "05": "Hautes-Alpes",
  "06": "Alpes-Maritimes",
  "07": "Ardeche",
  "08": "Ardennes",
  "09": "Ariege",
  "10": "Aube",
  "11": "Aude",
  "12": "Aveyron",
  "13": "Bouches-du-Rhone",
  "14": "Calvados",
  "15": "Cantal",
  "16": "Charente",
  "17": "Charente-Maritime",
  "18": "Cher",
  "19": "Correze",
  "21": "Cote-d'Or",
  "22": "Cotes-d'Armor",
  "23": "Creuse",
  "24": "Dordogne",
  "25": "Doubs",
  "26": "Drome",
  "27": "Eure",
  "28": "Eure-et-Loir",
  "29": "Finistere",
  "2A": "Corse-du-Sud",
  "2B": "Haute-Corse",
  "30": "Gard",
  "31": "Haute-Garonne",
  "32": "Gers",
  "33": "Gironde",
  "34": "Herault",
  "35": "Ille-et-Vilaine",
  "36": "Indre",
  "37": "Indre-et-Loire",
  "38": "Isere",
  "39": "Jura",
  "40": "Landes",
  "41": "Loir-et-Cher",
  "42": "Loire",
  "43": "Haute-Loire",
  "44": "Loire-Atlantique",
  "45": "Loiret",
  "46": "Lot",
  "47": "Lot-et-Garonne",
  "48": "Lozere",
  "49": "Maine-et-Loire",
  "50": "Manche",
  "51": "Marne",
  "52": "Haute-Marne",
  "53": "Mayenne",
  "54": "Meurthe-et-Moselle",
  "55": "Meuse",
  "56": "Morbihan",
  "57": "Moselle",
  "58": "Nievre",
  "59": "Nord",
  "60": "Oise",
  "61": "Orne",
  "62": "Pas-de-Calais",
  "63": "Puy-de-Dome",
  "64": "Pyrenees-Atlantiques",
  "65": "Hautes-Pyrenees",
  "66": "Pyrenees-Orientales",
  "67": "Bas-Rhin",
  "68": "Haut-Rhin",
  "69": "Rhone",
  "70": "Haute-Saone",
  "71": "Saone-et-Loire",
  "72": "Sarthe",
  "73": "Savoie",
  "74": "Haute-Savoie",
  "75": "Paris",
  "76": "Seine-Maritime",
  "77": "Seine-et-Marne",
  "78": "Yvelines",
  "79": "Deux-Sevres",
  "80": "Somme",
  "81": "Tarn",
  "82": "Tarn-et-Garonne",
  "83": "Var",
  "84": "Vaucluse",
  "85": "Vendee",
  "86": "Vienne",
  "87": "Haute-Vienne",
  "88": "Vosges",
  "89": "Yonne",
  "90": "Territoire de Belfort",
  "91": "Essonne",
  "92": "Hauts-de-Seine",
  "93": "Seine-Saint-Denis",
  "94": "Val-de-Marne",
  "95": "Val-d'Oise",
  "971": "Guadeloupe",
  "972": "Martinique",
  "973": "Guyane",
  "974": "La Reunion",
  "975": "Saint-Pierre-et-Miquelon",
  "976": "Mayotte",
  "977": "Saint-Barthelemy",
  "978": "Saint-Martin",
  "986": "Wallis-et-Futuna",
  "987": "Polynesie francaise",
  "988": "Nouvelle-Caledonie",
};

/** Extract departement code from an INSEE commune code */
export function getDepartementCode(codeInsee: string): string {
  if (codeInsee.startsWith("2A") || codeInsee.startsWith("2B")) {
    return codeInsee.slice(0, 2);
  }
  // DOM-TOM: 3-digit departement codes (971–988)
  if (codeInsee.startsWith("97") || codeInsee.startsWith("98")) {
    return codeInsee.slice(0, 3);
  }
  return codeInsee.slice(0, 2);
}

/** Get all departement codes that have at least one commune in sitemap */
export function getActiveDepartements(): { code: string; name: string }[] {
  const seen = new Set<string>();
  for (const code of communeCodes) {
    seen.add(getDepartementCode(code));
  }
  return Array.from(seen)
    .filter((code) => DEPARTEMENTS[code])
    .sort()
    .map((code) => ({ code, name: DEPARTEMENTS[code] }));
}
