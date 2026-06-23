// Single source of truth for commune URL slugs. Plain ESM JS so both the Next
// runtime (TS, bundler resolution) and the Node generator script
// (scripts/build-communes-index.mjs) import the exact same logic. JSDoc types
// keep the signatures fully typed when imported from TypeScript.

/**
 * Base slug: NFD-decompose, strip diacritics, lowercase, non-alphanum → "-".
 * @param {string} text
 * @returns {string}
 */
export function slugify(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Slug for a commune name. Handles the OE/AE ligatures that NFD does not
 * decompose ("Œuilly" → "oeuilly", not "uilly") before the base slugify.
 * @param {string} name
 * @returns {string}
 */
export function slugifyCommune(name) {
  return slugify(name.replace(/[œŒ]/g, "oe").replace(/[æÆ]/g, "ae"));
}
