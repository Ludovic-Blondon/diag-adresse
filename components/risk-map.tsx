"use client";

import { useEffect, useRef } from "react";
import type { ICPEResult } from "@/lib/types/georisques";

interface RiskMapProps {
  lon: number;
  lat: number;
  icpeList?: ICPEResult[];
}

const SEVESO_COLORS: Record<string, string> = {
  "seuil haut": "#dc2626",
  "seuil bas": "#f97316",
};

export function RiskMap({ lon, lat, icpeList = [] }: RiskMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let cancelled = false;

    async function initMap() {
      const [maplibregl] = await Promise.all([
        import("maplibre-gl"),
        import("maplibre-gl/dist/maplibre-gl.css"),
      ]);

      if (cancelled || !containerRef.current) return;

      const ml = maplibregl.default ?? maplibregl;

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

      // Address marker
      new ml.Marker({ color: "#2563eb" })
        .setLngLat([lon, lat])
        .setPopup(new ml.Popup().setText("Adresse recherchee"))
        .addTo(map);

      // ICPE markers
      for (const icpe of icpeList) {
        if (icpe.latitude == null || icpe.longitude == null) continue;
        const seveso = icpe.statutSeveso?.toLowerCase() ?? "";
        const color = SEVESO_COLORS[seveso] ?? (seveso ? "#f59e0b" : "#6b7280");

        new ml.Marker({ color })
          .setLngLat([icpe.longitude, icpe.latitude])
          .setPopup(
            new ml.Popup().setHTML(
              `<strong>${icpe.raisonSociale ?? "ICPE"}</strong><br/>${icpe.statutSeveso ?? "Non Seveso"}`,
            ),
          )
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
        (mapRef.current as { remove: () => void }).remove();
        mapRef.current = null;
      }
    };
  }, [lon, lat, icpeList]);

  return (
    <div
      ref={containerRef}
      className="w-full h-80 rounded-lg border overflow-hidden"
    />
  );
}

/** Create a GeoJSON circle polygon */
function createCircle(
  lon: number,
  lat: number,
  radiusMeters: number,
  steps = 64,
): GeoJSON.Feature<GeoJSON.Polygon> {
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
