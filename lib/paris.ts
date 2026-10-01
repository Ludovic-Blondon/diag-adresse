/**
 * Mapping arrondissements Paris/Lyon/Marseille vers code commune global.
 * Hub'Eau attend le code commune global (75056, 69123, 13055).
 * DPE ADEME accepte les codes arrondissement.
 */

export function toHubeauCode(citycode: string): string {
  // Paris: 75101-75120 -> 75056
  if (/^751\d{2}$/.test(citycode)) return "75056";
  // Lyon: 69381-69389 -> 69123
  if (/^6938\d$/.test(citycode)) return "69123";
  // Marseille: 13201-13216 -> 13055
  if (/^132\d{2}$/.test(citycode)) return "13055";
  return citycode;
}

/**
 * Codes INSEE des arrondissements de Paris, Lyon et Marseille à partir du code
 * commune global ; [] pour toute autre commune. Géorisques classe le radon
 * (et la sismicité de Paris) par arrondissement uniquement.
 */
export function arrondissementCodes(communeCode: string): string[] {
  const range = (prefix: string, from: number, to: number) =>
    Array.from(
      { length: to - from + 1 },
      (_, i) => `${prefix}${String(from + i).padStart(2, "0")}`,
    );
  if (communeCode === "75056") return range("751", 1, 20);
  if (communeCode === "69123") return range("693", 81, 89);
  if (communeCode === "13055") return range("132", 1, 16);
  return [];
}
