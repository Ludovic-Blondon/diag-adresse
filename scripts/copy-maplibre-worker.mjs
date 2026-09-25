// MapLibre GL v6 ne publie plus que de l'ESM et charge son worker depuis un
// fichier séparé, à une URL que le bundler ne peut pas réécrire : chaque appli
// doit la fournir elle-même via `setWorkerUrl()` (cf. guide de migration v5→v6).
//
// Le snippet officiel `new URL("maplibre-gl/dist/maplibre-gl-worker.mjs",
// import.meta.url)` ne marche pas sous Turbopack : il émet bien le worker
// (19 ko) mais pas son voisin `maplibre-gl-shared.mjs` (~500 ko), que le worker
// importe en relatif — d'où un 404, un worker mort, et des sources geojson qui
// ne chargent jamais (les tuiles raster, elles, continuent de s'afficher, ce qui
// rend la panne silencieuse : seul le cercle de 5 km disparaît de la carte).
//
// On copie donc les deux fichiers côte à côte dans public/maplibre/, ce qui
// préserve l'import relatif sans dépendre de la résolution d'assets du bundler.
// Lancé par `pnpm dev` et `pnpm build` ; la sortie est gitignorée, c'est le
// lockfile qui fait foi sur la version.

import { createRequire } from "node:module";
import { copyFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";

const FICHIERS = ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"];
const DESTINATION = join(process.cwd(), "public", "maplibre");

const require = createRequire(import.meta.url);
const dist = dirname(
  require.resolve("maplibre-gl/dist/maplibre-gl-worker.mjs"),
);

await mkdir(DESTINATION, { recursive: true });
for (const fichier of FICHIERS) {
  await copyFile(join(dist, fichier), join(DESTINATION, fichier));
}

console.log(
  `maplibre worker : ${FICHIERS.length} fichiers copiés vers public/maplibre/`,
);
