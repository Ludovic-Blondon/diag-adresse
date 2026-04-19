export interface TopCommune {
  code: string;
  name: string;
  lat: number;
  lon: number;
}

/**
 * Top communes by population for sitemap + commune pages.
 * lat/lon = approximate city-center coordinates; precision ~1km is sufficient
 * for the commune-level diagnostic dashboard.
 */
export const TOP_COMMUNES: TopCommune[] = [
  { code: "75056", name: "Paris", lat: 48.8566, lon: 2.3522 },
  { code: "13055", name: "Marseille", lat: 43.2965, lon: 5.3698 },
  { code: "69123", name: "Lyon", lat: 45.764, lon: 4.8357 },
  { code: "31555", name: "Toulouse", lat: 43.6047, lon: 1.4442 },
  { code: "06088", name: "Nice", lat: 43.7102, lon: 7.262 },
  { code: "44109", name: "Nantes", lat: 47.2184, lon: -1.5536 },
  { code: "34172", name: "Montpellier", lat: 43.6108, lon: 3.8767 },
  { code: "67482", name: "Strasbourg", lat: 48.5734, lon: 7.7521 },
  { code: "33063", name: "Bordeaux", lat: 44.8378, lon: -0.5792 },
  { code: "59350", name: "Lille", lat: 50.6292, lon: 3.0573 },
  { code: "35238", name: "Rennes", lat: 48.1173, lon: -1.6778 },
  { code: "51454", name: "Reims", lat: 49.2583, lon: 4.0317 },
  { code: "83137", name: "Toulon", lat: 43.1242, lon: 5.928 },
  { code: "76351", name: "Le Havre", lat: 49.4944, lon: 0.1079 },
  { code: "38185", name: "Grenoble", lat: 45.1885, lon: 5.7245 },
  { code: "21231", name: "Dijon", lat: 47.322, lon: 5.0415 },
  { code: "49007", name: "Angers", lat: 47.4784, lon: -0.5632 },
  { code: "30189", name: "Nimes", lat: 43.8367, lon: 4.3601 },
  { code: "63113", name: "Clermont-Ferrand", lat: 45.7772, lon: 3.087 },
  { code: "42218", name: "Saint-Etienne", lat: 45.4397, lon: 4.3872 },
  { code: "37261", name: "Tours", lat: 47.3941, lon: 0.6848 },
  { code: "59606", name: "Villeneuve-d'Ascq", lat: 50.6202, lon: 3.1471 },
  { code: "14118", name: "Caen", lat: 49.1829, lon: -0.3707 },
  { code: "45234", name: "Orleans", lat: 47.9029, lon: 1.9039 },
  { code: "97105", name: "Fort-de-France", lat: 14.6037, lon: -61.0738 },
  { code: "97209", name: "Pointe-a-Pitre", lat: 16.2418, lon: -61.5341 },
  { code: "68224", name: "Mulhouse", lat: 47.7508, lon: 7.3359 },
  { code: "29019", name: "Brest", lat: 48.3904, lon: -4.4861 },
  { code: "80021", name: "Amiens", lat: 49.8941, lon: 2.2958 },
  { code: "72181", name: "Le Mans", lat: 48.0077, lon: 0.1984 },
  { code: "66136", name: "Perpignan", lat: 42.6887, lon: 2.8948 },
  { code: "25056", name: "Besancon", lat: 47.2378, lon: 6.0241 },
  { code: "86194", name: "Poitiers", lat: 46.5802, lon: 0.3404 },
  { code: "76540", name: "Rouen", lat: 49.4432, lon: 1.0993 },
  { code: "87085", name: "Limoges", lat: 45.8315, lon: 1.2578 },
  { code: "54395", name: "Nancy", lat: 48.6921, lon: 6.1844 },
  { code: "64445", name: "Pau", lat: 43.2951, lon: -0.3708 },
  { code: "93008", name: "Bobigny", lat: 48.9075, lon: 2.4441 },
  { code: "92050", name: "Nanterre", lat: 48.8924, lon: 2.2069 },
];
