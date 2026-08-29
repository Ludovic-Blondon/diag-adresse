// Fuseau explicite : les pages sont prérendues côté serveur (TZ=UTC sur
// Vercel) alors que la carte eau est rendue côté client. Sans fuseau figé, la
// même date de prélèvement s'afficherait différemment selon l'endroit d'où on
// la regarde.
const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Paris",
});

/**
 * Date ISO → « 31 mars 2026 ». Renvoie la chaîne d'origine telle quelle si ce
 * n'est pas une date exploitable : mieux vaut afficher la valeur brute de
 * l'API que « Invalid Date ».
 */
export function formatDateFr(iso: string | null | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : dateFormatter.format(date);
}

/**
 * Nombre au format français (virgule décimale). `digits` fige le nombre de
 * décimales ; sans lui, on garde la précision utile jusqu'à 2 décimales.
 */
export function formatNumberFr(value: number, digits?: number): string {
  return value.toLocaleString(
    "fr-FR",
    digits == null
      ? { maximumFractionDigits: 2 }
      : { minimumFractionDigits: digits, maximumFractionDigits: digits },
  );
}
