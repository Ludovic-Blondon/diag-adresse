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
