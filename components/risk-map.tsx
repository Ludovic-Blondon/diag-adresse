"use client";

import { useEffect, useRef } from "react";
import type { Feature, Polygon } from "geojson";
import type { MapLibreMap } from "maplibre-gl";
import type { ICPEResult } from "@/lib/types/georisques";

interface RiskMapProps {
  lon: number;
  lat: number;
  icpeList?: ICPEResult[];
  // Libellé du point central : l'adresse, ou le centre d'une commune.
  centerLabel?: string;
}

const CENTER_COLOR = "#2563eb";

const ICPE_STYLES = {
  haut: { color: "#dc2626", label: "Seveso seuil haut" },
  bas: { color: "#f97316", label: "Seveso seuil bas" },
  autre: { color: "#6b7280", label: "Autre installation classée" },
} as const;

type IcpeCategory = keyof typeof ICPE_STYLES;

// L'API renvoie « Seveso seuil haut », « Seveso seuil bas », « Non Seveso » ou
// null : on cherche le seuil dans le libellé plutôt qu'une clé exacte.
function icpeCategory(statut: string | null): IcpeCategory {
  const s = statut?.toLowerCase() ?? "";
  if (s.includes("seuil haut")) return "haut";
  if (s.includes("seuil bas")) return "bas";
  return "autre";
}

export function RiskMap({
  lon,
  lat,
  icpeList = [],
  centerLabel = "Adresse recherchée",
}: RiskMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let cancelled = false;

    async function initMap() {
      const [ml] = await Promise.all([
        import("maplibre-gl"),
        import("maplibre-gl/dist/maplibre-gl.css"),
      ]);

      if (cancelled || !containerRef.current) return;

      // v6 charge son worker depuis un fichier séparé et laisse le soin à
      // l'appli d'en donner l'URL : sans ça le worker meurt en silence et les
      // sources geojson (ici le cercle de 5 km) ne chargent jamais, alors que
      // les tuiles raster continuent de s'afficher. Les deux fichiers du worker
      // sont copiés dans public/maplibre/ par scripts/copy-maplibre-worker.mjs.
      ml.setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");

      const map = new ml.Map({
        container: containerRef.current,
        style: {
          version: 8,
          sources: {
            "ign-plan": {
              type: "raster",
              tiles: [
                "https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image/png&STYLE=normal",
              ],
              tileSize: 256,
              attribution: "&copy; IGN",
            },
          },
          layers: [
            {
              id: "ign-plan-layer",
              type: "raster",
              source: "ign-plan",
              minzoom: 0,
              maxzoom: 19,
            },
          ],
        },
        center: [lon, lat],
        zoom: 14,
      });

      map.addControl(new ml.NavigationControl(), "top-right");

      // Point central : adresse, ou centre de la commune
      new ml.Marker({ color: CENTER_COLOR })
        .setLngLat([lon, lat])
        .setPopup(new ml.Popup().setText(centerLabel))
        .addTo(map);

      // ICPE markers
      for (const icpe of icpeList) {
        if (icpe.latitude == null || icpe.longitude == null) continue;
        const { color } = ICPE_STYLES[icpeCategory(icpe.statutSeveso)];

        new ml.Marker({ color })
          .setLngLat([icpe.longitude, icpe.latitude])
          .setPopup(new ml.Popup().setDOMContent(createIcpePopupContent(icpe)))
          .addTo(map);
      }

      // 5km radius circle
      map.on("load", () => {
        map.addSource("radius", {
          type: "geojson",
          data: createCircle(lon, lat, 5000),
        });
        map.addLayer({
          id: "radius-fill",
          type: "fill",
          source: "radius",
          paint: {
            "fill-color": "#2563eb",
            "fill-opacity": 0.05,
          },
        });
        map.addLayer({
          id: "radius-border",
          type: "line",
          source: "radius",
          paint: {
            "line-color": "#2563eb",
            "line-width": 1.5,
            "line-dasharray": [4, 2],
          },
        });
      });

      mapRef.current = map;
    }

    initMap();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [lon, lat, icpeList, centerLabel]);

  // Légende limitée aux catégories présentes sur la carte.
  const categories = (Object.keys(ICPE_STYLES) as IcpeCategory[]).filter(
    (cat) => icpeList.some((icpe) => icpeCategory(icpe.statutSeveso) === cat),
  );

  return (
    <div className="space-y-2">
      <div
        ref={containerRef}
        className="h-80 w-full overflow-hidden rounded-lg border"
      />
      <ul className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-xs">
        <LegendItem color={CENTER_COLOR} label={centerLabel} />
        {categories.map((cat) => (
          <LegendItem
            key={cat}
            color={ICPE_STYLES[cat].color}
            label={ICPE_STYLES[cat].label}
          />
        ))}
      </ul>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <li className="flex items-center gap-1.5">
      <span
        aria-hidden
        className="inline-block h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {label}
    </li>
  );
}

/**
 * Contenu de la popup d'une ICPE, construit en DOM plutôt qu'en HTML : la
 * raison sociale vient de l'API Géorisques et finissait interpolée dans un
 * `setHTML()`, où le moindre chevron dans le nom était interprété comme du
 * balisage. `setDOMContent()` garde le rendu sur deux lignes que `setText()`
 * aplatirait (un `\n` dans un nœud texte se replie en espace).
 */
function createIcpePopupContent(icpe: ICPEResult): HTMLElement {
  const contenu = document.createElement("div");
  const nom = document.createElement("strong");
  nom.textContent = icpe.raisonSociale ?? "ICPE";
  // null n'est pas « Non Seveso » : l'API n'a simplement pas de statut.
  contenu.append(
    nom,
    document.createElement("br"),
    icpe.statutSeveso ?? "Statut Seveso non renseigné",
  );
  return contenu;
}

/** Create a GeoJSON circle polygon */
function createCircle(
  lon: number,
  lat: number,
  radiusMeters: number,
  steps = 64,
): Feature<Polygon> {
  const coords: [number, number][] = [];
  const km = radiusMeters / 1000;
  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * 2 * Math.PI;
    const dx = km * Math.cos(angle);
    const dy = km * Math.sin(angle);
    coords.push([
      lon + dx / (111.32 * Math.cos((lat * Math.PI) / 180)),
      lat + dy / 110.574,
    ]);
  }
  return {
    type: "Feature",
    properties: {},
    geometry: { type: "Polygon", coordinates: [coords] },
  };
}
