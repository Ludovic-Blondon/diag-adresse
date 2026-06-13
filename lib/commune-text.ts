/**
 * French preposition + commune name for "... à {Ville}" constructions.
 * Handles the article contractions so titles/H1 stay grammatical on the
 * ~400 communes whose name starts with an article:
 *   "Le Havre"        → "au Havre"
 *   "Les Lilas"       → "aux Lilas"
 *   "La Rochelle"     → "à La Rochelle"
 *   "L'Haÿ-les-Roses" → "à L'Haÿ-les-Roses"
 *   "Grenoble"        → "à Grenoble"
 */
export function prepositionVille(name: string): string {
  if (name.startsWith("Le ")) return `au ${name.slice(3)}`;
  if (name.startsWith("Les ")) return `aux ${name.slice(4)}`;
  return `à ${name}`;
}

/**
 * French "de" + commune name, with the same article contractions:
 *   "Le Havre"    → "du Havre"
 *   "Les Lilas"   → "des Lilas"
 *   "La Rochelle" → "de La Rochelle"
 *   "Grenoble"    → "de Grenoble"
 */
export function deVille(name: string): string {
  if (name.startsWith("Le ")) return `du ${name.slice(3)}`;
  if (name.startsWith("Les ")) return `des ${name.slice(4)}`;
  return `de ${name}`;
}
