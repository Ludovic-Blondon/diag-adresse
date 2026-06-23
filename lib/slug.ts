export { slugify } from "./slugify-commune.mjs";

export function slugToQuery(slug: string): string {
  return slug.replace(/-/g, " ");
}
