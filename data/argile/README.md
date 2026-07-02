# Données « Argile 2026 » — sources et reproductibilité

Ce dossier documente les **sources brutes** du chantier P0-4 (diff communal du
retrait-gonflement des argiles entre les millésimes 2020 et 2026).

> **Les fichiers bruts ne sont PAS versionnés** (multi-Go) — voir `.gitignore`
> (`/data/argile/raw/`). Seuls ce README et les **sorties JSON** (`lib/argile/`)
> sont committés. Le pipeline tourne **en local**, jamais sur Vercel.

## 1. Carte d'exposition RGA — aléa par département (Géorisques / BRGM)

Carte d'exposition au retrait-gonflement des argiles, **Shapefile, Lambert 93
(RGF93 / EPSG:2154)**, téléchargeable par département. Couverture :
**France métropolitaine _hors ville de Paris_** (dépt 75 absent de la carte).

| Millésime | Régime                 | Page de téléchargement                                                                              |
| --------- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| **2020**  | loi ELAN               | https://www.georisques.gouv.fr/donnees/bases-de-donnees/retrait-gonflement-des-argiles-version-2020 |
| **2026**  | arrêté du 9 janv. 2026 | https://www.georisques.gouv.fr/donnees/bases-de-donnees/retrait-gonflement-des-argiles-version-2026 |

Le téléchargement se fait via le **formulaire** de la page (échelle = Départemental,
format = Shapefile). Pas d'URL de fichier stable exposée → on archive les ZIP
téléchargés et leurs SHA-256 ci-dessous.

**Arrêté du 9 janvier 2026** : met à jour la carte de 2020 en intégrant ~240 000
sinistres RGA (2018–2022, soit 58 % des sinistres depuis 1989) et le changement
climatique (PNACC-3). Application aux **promesses/actes de vente de terrains non
bâtis constructibles et aux CCMI conclus à compter du 1ᵉʳ juillet 2026**.
Zones d'exposition **moyenne + forte : 55 % du territoire hexagonal (2026)** contre
**48 % (2020)** — chiffres officiels, à reconfirmer par notre calcul (a3).

Licence : **Licence Ouverte / Etalab 2.0** → attribution obligatoire (« Source :
Géorisques / BRGM, Licence Ouverte 2.0 »).

> ⚠️ **À confirmer une fois le SHP téléchargé** : le nom exact du champ portant la
> classe d'aléa et ses valeurs (label « Faible/Moyen/Fort/A priori nul » ou code
> numérique). `compute_rga_diff.py` auto-détecte parmi les noms courants ; mettre à
> jour `--class-field` / la table de mapping si besoin et le noter ici.

## 2. Contours communaux — Admin Express COG (IGN)

France entière, millésime **COG 2026** (doit correspondre aux codes INSEE du site).
Préférer Admin Express COG à `geometry=contour` de geo.api.gouv.fr (35 000 appels).

- Jeu data.gouv.fr : https://www.data.gouv.fr/datasets/admin-express-admin-express-cog-admin-express-cog-carto-admin-express-cog-carto-pe-admin-express-cog-carto-plus-pe
- Catalogue IGN : https://geoservices.ign.fr/adminexpress
- Couche utilisée : `COMMUNE` (champs `INSEE_COM`, `NOM`, `INSEE_DEP`).
- Reprojeter en Lambert 93 (EPSG:2154) si nécessaire.

## 3. Fonds de prévention RGA (sous-chantier d / kit presse)

Plateforme « Fonds Prévention Argile » (Ministère de la Transition écologique) —
https://fonds-prevention-argile.beta.gouv.fr/carte-exposition-2026 — expérimentée
dans **11 départements préfigurateurs** (maisons individuelles existantes en zone
d'exposition moyenne/forte de la carte 2026 ; « traite les causes, pas les
conséquences ») :

| Code | Département             | Région               |
| ---- | ----------------------- | -------------------- |
| 03   | Allier                  | Auvergne-Rhône-Alpes |
| 04   | Alpes-de-Haute-Provence | PACA                 |
| 24   | Dordogne                | Nouvelle-Aquitaine   |
| 32   | Gers                    | Occitanie            |
| 36   | Indre                   | Centre-Val de Loire  |
| 47   | Lot-et-Garonne          | Nouvelle-Aquitaine   |
| 54   | Meurthe-et-Moselle      | Grand Est            |
| 59   | Nord                    | Hauts-de-France      |
| 63   | Puy-de-Dôme             | Auvergne-Rhône-Alpes |
| 81   | Tarn                    | Occitanie            |
| 82   | Tarn-et-Garonne         | Occitanie            |

## 4. Arborescence locale attendue par le pipeline

```
data/argile/raw/
  rga-2020/<dep>/...shp        # aléa RGA 2020 par département (Lambert 93)
  rga-2026/<dep>/...shp        # aléa RGA 2026 par département
  communes/COMMUNE.shp         # Admin Express COG (France entière)
```

Sorties (committées, hors data/) : `lib/argile/diff/<dep>.json`, `lib/argile/summary.json`.

## 5. Checksums (à remplir après téléchargement)

```bash
# Depuis data/argile/raw/, pour chaque ZIP téléchargé :
shasum -a 256 rga-2020/*.zip rga-2026/*.zip communes/*.zip > ../CHECKSUMS.txt
```

| Fichier         | Date de téléchargement | SHA-256 |
| --------------- | ---------------------- | ------- |
| _(à compléter)_ |                        |         |

## Sources

- Géorisques — RGA 2026 : https://www.georisques.gouv.fr/donnees/bases-de-donnees/retrait-gonflement-des-argiles-version-2026
- Géorisques — RGA 2020 : https://www.georisques.gouv.fr/donnees/bases-de-donnees/retrait-gonflement-des-argiles-version-2020
- BRGM (communiqué carte nationale) : https://www.brgm.fr/en/news/news/clay-shrinkage-swelling-changes-national-exposure-map
- Service-public (nouveau zonage) : https://www.service-public.gouv.fr/particuliers/actualites/A18807
- Fonds Prévention Argile : https://fonds-prevention-argile.beta.gouv.fr/carte-exposition-2026
- IGN Admin Express COG : https://geoservices.ign.fr/adminexpress
