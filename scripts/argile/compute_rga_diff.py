#!/usr/bin/env python3
"""
compute_rga_diff.py — Diff communal du retrait-gonflement des argiles (RGA)
entre les millésimes 2020 (loi ELAN) et 2026 (arrêté du 9 janvier 2026).

OFFLINE — ne tourne JAMAIS sur Vercel. Sources et arborescence : data/argile/README.md.

Entrées (téléchargées localement, hors git — Lambert 93 / EPSG:2154) :
  data/argile/raw/rga-2020/**/*.shp   # aléa RGA 2020, par département
  data/argile/raw/rga-2026/**/*.shp   # aléa RGA 2026, par département
  data/argile/raw/communes/**/COMMUNE*.shp  # Admin Express COG (France entière)

Sorties (committées) :
  lib/argile/diff/<dep>.json   # {"<insee>": {"n", "a20":{max,pctMF,maj}, "a26":{...}, "d"}, ...}
  lib/argile/summary.json      # national + par département

Méthode (cf. docs/methodologie-argile-2026.md) :
  - On cale TOUJOURS les deux millésimes sur les contours COG 2026 (overlay).
  - Par commune : classe d'aléa MAX présente (seuil anti-slivers : on ignore une
    classe dont l'emprise est < 1 % de la surface communale ET < 1 ha), % de surface
    en aléa moyen+fort, et classe majoritaire (stockée, exposée dans la méthodo).
  - delta = a26.max - a20.max.

Usage :
  python3 compute_rga_diff.py --dept 38      # smoke test un département
  python3 compute_rga_diff.py                # tous les départements couverts
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import unicodedata
from pathlib import Path

import geopandas as gpd
import pandas as pd

# --- Chemins (relatifs à la racine du repo) ---
ROOT = Path(__file__).resolve().parents[2]
RAW = ROOT / "data" / "argile" / "raw"
OUT_DIFF = ROOT / "lib" / "argile" / "diff"
OUT_SUMMARY = ROOT / "lib" / "argile" / "summary.json"

LAMBERT93 = "EPSG:2154"

# Seuils anti-slivers : une classe ne « compte » pour le max que si son emprise
# communale est >= 1 % de la surface OU >= 1 ha. (Ignorée si < 1 % ET < 1 ha.)
SLIVER_PCT = 0.01
SLIVER_HA_M2 = 10_000.0  # 1 hectare en m²

# Champs candidats portant la classe d'aléa dans le SHP RGA (à confirmer au 1er run,
# cf. data/argile/README.md §1). Auto-détection par ordre de préférence.
CLASS_FIELD_CANDIDATES = (
    "ALEA",
    "NIVEAU",
    "EXPOSITIO",
    "EXPOSITION",
    "CLASSE",
    "CODE",
    "CODEEXPO",
    "NIV_ALEA",
)


def _strip(s: str) -> str:
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    return s.strip().lower()


def normalize_class(value) -> int:
    """Renvoie 0 (négligeable/nul), 1 (faible), 2 (moyen), 3 (fort)."""
    if value is None:
        return 0
    # Numérique direct ("1".."3", 1..3)
    try:
        n = int(float(value))
        if n in (0, 1, 2, 3):
            return n
    except (TypeError, ValueError):
        pass
    t = _strip(str(value))
    if not t or "nul" in t or "negligeable" in t or "a priori" in t:
        return 0
    if "faible" in t:
        return 1
    if "moyen" in t:
        return 2
    if "fort" in t:
        return 3
    return 0


def detect_class_field(gdf: gpd.GeoDataFrame) -> str:
    cols = {c.upper(): c for c in gdf.columns}
    for cand in CLASS_FIELD_CANDIDATES:
        if cand in cols:
            return cols[cand]
    raise SystemExit(
        f"Champ de classe d'aléa introuvable. Colonnes disponibles : {list(gdf.columns)}.\n"
        "Ajouter le bon nom à CLASS_FIELD_CANDIDATES (cf. data/argile/README.md §1)."
    )


def load_layer(base: Path, dep: str) -> gpd.GeoDataFrame | None:
    """Charge tous les .shp sous base/<dep>/ (ou base/ filtré), reprojette en L93."""
    candidates = sorted((base / dep).rglob("*.shp")) or sorted(base.rglob("*.shp"))
    if not candidates:
        return None
    parts = [gpd.read_file(p) for p in candidates]
    gdf = parts[0] if len(parts) == 1 else pd.concat(parts, ignore_index=True)
    gdf = gpd.GeoDataFrame(gdf, geometry="geometry", crs=parts[0].crs)
    if gdf.crs is None:
        gdf = gdf.set_crs(LAMBERT93)
    return gdf.to_crs(LAMBERT93)


def load_communes(dep: str) -> gpd.GeoDataFrame:
    base = RAW / "communes"
    shp = sorted(base.rglob("COMMUNE*.shp")) or sorted(base.rglob("*.shp"))
    if not shp:
        raise SystemExit(f"Contours communaux introuvables sous {base} (cf. README §2).")
    g = gpd.read_file(shp[0]).to_crs(LAMBERT93)
    cols = {c.upper(): c for c in g.columns}
    insee, nom = cols.get("INSEE_COM"), cols.get("NOM")
    if not insee or not nom:
        raise SystemExit(f"Champs INSEE_COM/NOM absents : {list(g.columns)}")
    dep_col = cols.get("INSEE_DEP")
    if dep_col:
        sel = g[g[dep_col].astype(str) == dep]
    else:  # repli : préfixe du code INSEE
        sel = g[g[insee].astype(str).str.startswith(dep)]
    return sel[[insee, nom, "geometry"]].rename(
        columns={insee: "insee", nom: "nom"}
    )


def class_stats(communes: gpd.GeoDataFrame, alea: gpd.GeoDataFrame, field: str):
    """Pour chaque commune : (max, pctMF, maj) après overlay intersection."""
    alea = alea.copy()
    alea["cls"] = alea[field].map(normalize_class)
    alea = alea[["cls", "geometry"]]
    communes = communes.copy()
    communes["area_tot"] = communes.geometry.area

    inter = gpd.overlay(
        communes[["insee", "area_tot", "geometry"]], alea, how="intersection"
    )
    inter["a"] = inter.geometry.area
    grouped = inter.groupby(["insee", "cls"])["a"].sum().reset_index()

    out: dict[str, tuple[int, int, int]] = {}
    areas = dict(zip(communes["insee"], communes["area_tot"]))
    for insee, sub in grouped.groupby("insee"):
        tot = areas.get(insee, 0.0) or 1.0
        by_cls = dict(zip(sub["cls"], sub["a"]))
        # max présent (seuil anti-slivers)
        mx = 0
        for cls in (3, 2, 1):
            a = by_cls.get(cls, 0.0)
            if a >= SLIVER_PCT * tot or a >= SLIVER_HA_M2:
                mx = cls
                break
        pct_mf = round((by_cls.get(2, 0.0) + by_cls.get(3, 0.0)) / tot * 100)
        maj = max(by_cls, key=by_cls.get) if by_cls else 0
        out[str(insee)] = (mx, pct_mf, int(maj))
    return out


def process_dep(dep: str) -> dict | None:
    communes = load_communes(dep)
    if communes.empty:
        print(f"  [{dep}] aucune commune (dépt hors couverture ?) — ignoré")
        return None
    a20 = load_layer(RAW / "rga-2020", dep)
    a26 = load_layer(RAW / "rga-2026", dep)
    if a20 is None or a26 is None:
        print(f"  [{dep}] aléa 2020 ou 2026 manquant — ignoré")
        return None

    f20, f26 = detect_class_field(a20), detect_class_field(a26)
    s20 = class_stats(communes, a20, f20)
    s26 = class_stats(communes, a26, f26)

    result: dict[str, dict] = {}
    for _, row in communes.iterrows():
        insee = str(row["insee"])
        m20, p20, j20 = s20.get(insee, (0, 0, 0))
        m26, p26, j26 = s26.get(insee, (0, 0, 0))
        result[insee] = {
            "n": row["nom"],
            "a20": {"max": m20, "pctMF": p20, "maj": j20},
            "a26": {"max": m26, "pctMF": p26, "maj": j26},
            "d": m26 - m20,
        }
    return result


def write_dep(dep: str, data: dict) -> None:
    OUT_DIFF.mkdir(parents=True, exist_ok=True)
    path = OUT_DIFF / f"{dep}.json"
    path.write_text(
        json.dumps(data, ensure_ascii=False, separators=(",", ":")) + "\n",
        encoding="utf-8",
    )
    ups = sum(1 for v in data.values() if v["d"] > 0)
    print(f"  [{dep}] {len(data)} communes — {ups} ↑ — écrit {path.relative_to(ROOT)}")


def discover_deps() -> list[str]:
    deps: set[str] = set()
    for base in (RAW / "rga-2020", RAW / "rga-2026"):
        for p in base.glob("*"):
            if p.is_dir() and re.fullmatch(r"\d{2,3}|2[AB]", p.name):
                deps.add(p.name)
    return sorted(deps)


def build_summary() -> None:
    """Agrège tous les lib/argile/diff/<dep>.json en summary.json."""
    per_dep, nat = {}, {"a20MF": 0, "a26MF": 0, "n": 0, "up": 0, "down": 0, "same": 0}
    for f in sorted(OUT_DIFF.glob("*.json")):
        data = json.loads(f.read_text(encoding="utf-8"))
        up = sum(1 for v in data.values() if v["d"] > 0)
        down = sum(1 for v in data.values() if v["d"] < 0)
        per_dep[f.stem] = {"n": len(data), "up": up, "down": down, "same": len(data) - up - down}
        nat["n"] += len(data)
        nat["up"] += up
        nat["down"] += down
        nat["same"] += len(data) - up - down
        nat["a20MF"] += sum(1 for v in data.values() if v["a20"]["max"] >= 2)
        nat["a26MF"] += sum(1 for v in data.values() if v["a26"]["max"] >= 2)
    OUT_SUMMARY.parent.mkdir(parents=True, exist_ok=True)
    OUT_SUMMARY.write_text(
        json.dumps({"national": nat, "departements": per_dep}, ensure_ascii=False, indent=2)
        + "\n",
        encoding="utf-8",
    )
    print(f"summary.json : {nat['n']} communes, {nat['up']} ↑ / {nat['down']} ↓")


def main() -> int:
    ap = argparse.ArgumentParser(description="Diff communal RGA 2020 vs 2026")
    ap.add_argument("--dept", help="Traiter un seul département (ex. 38, 2A)")
    ap.add_argument("--no-summary", action="store_true", help="Ne pas régénérer summary.json")
    args = ap.parse_args()

    deps = [args.dept] if args.dept else discover_deps()
    if not deps:
        print(f"Aucun département trouvé sous {RAW} — voir data/argile/README.md", file=sys.stderr)
        return 1

    print(f"Départements : {', '.join(deps)}")
    for dep in deps:
        print(f"Traitement {dep}…")
        data = process_dep(dep)
        if data:
            write_dep(dep, data)

    if not args.no_summary:
        build_summary()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
