import { slugify } from "./slug";

const INSEE_RE = /^(\d{5}|2[ab]\d{3})$/i;
const SLUGGED_INSEE_RE = /^(.+)-(\d{5}|2[ab]\d{3})$/i;

export type CommuneParam =
  | { kind: "insee"; insee: string }
  | { kind: "sluggedInsee"; insee: string; slugPart: string }
  | { kind: "other" };

/**
 * Slugify a commune name for URLs. Handles the OE/AE ligatures that NFD does
 * not decompose ("Œuilly" → "oeuilly", not "uilly"), then reuses the shared
 * slugify (diacritics, lowercase, non-alphanum → "-").
 */
export function slugifyCommune(name: string): string {
  return slugify(name.replace(/[œŒ]/g, "oe").replace(/[æÆ]/g, "ae"));
}

/** Canonical commune page path: /commune/{slug}-{insee}, fully lowercase. */
export function communePath(code: string, name: string): string {
  return `/commune/${slugifyCommune(name)}-${code.toLowerCase()}`;
}

/**
 * Classify a `/commune/[slug]` route param. INSEE codes are normalised to
 * uppercase (`2a004` → `2A004`) so lookups against geo data are case-stable.
 * - `insee`: a bare INSEE code or a 5-digit postal code (the route disambiguates)
 * - `sluggedInsee`: the canonical `slug-insee` form
 * - `other`: anything else → handled as not found
 */
export function parseCommuneParam(param: string): CommuneParam {
  if (INSEE_RE.test(param)) {
    return { kind: "insee", insee: param.toUpperCase() };
  }
  const m = SLUGGED_INSEE_RE.exec(param);
  if (m) {
    return { kind: "sluggedInsee", insee: m[2].toUpperCase(), slugPart: m[1] };
  }
  return { kind: "other" };
}
