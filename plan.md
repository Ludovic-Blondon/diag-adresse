# Plan d'implementation DiagAdresse

Le diagnostic complet de votre adresse en France : risques naturels/industriels, qualite de l'eau, performance energetique. Un seul site, une seule recherche.

---

## Verification des APIs

### API Adresse / Geocodage

| Parametre | Detail |
|---|---|
| **Base URL (primaire)** | `https://data.geopf.fr/geocodage` |
| **Fallback** | `https://api-adresse.data.gouv.fr` (ancien domaine, en fin de vie) |
| **Endpoint search** | `GET /search?q=...&autocomplete=true&limit=5&type=housenumber` |
| **Endpoint reverse** | `GET /reverse?lon=...&lat=...&limit=1` |
| **Rate limit** | 50 req/s par IP |
| **Auth** | Aucune |
| **Format reponse** | GeoJSON FeatureCollection |
| **Champs cles** | `properties.label`, `properties.citycode` (code INSEE), `properties.postcode`, `properties.city`, `properties.context`, `geometry.coordinates [lon, lat]` |

### Georisques

| Parametre | Detail |
|---|---|
| **Base URL** | `https://georisques.gouv.fr/api/v1` |
| **Auth** | Aucune (V1). V2 necessite un token Bearer (inscription gratuite) |
| **Rate limit** | `resultats_rapport_risque` limite a 1 req/s |

**Endpoints :**

| Endpoint | Params cles | Usage |
|---|---|---|
| `/resultats_rapport_risque` | `latlon=lon,lat` OU `code_insee` | **Principal** : tous les risques en un appel |
| `/radon` | `code_insee` | Classe potentiel radon (1 a 3) |
| `/rga` | `latlon=lon,lat` | Retrait-gonflement argile (exposition 0 a 3) |
| `/zonage_sismique` | `code_insee` | Zone sismicite (1 a 5) |
| `/installations_classees` | `code_insee`, `latlon`, `rayon`, `statutSeveso` | ICPE / Seveso a proximite |
| `/cavites` | `code_insee`, `latlon`, `rayon` (max 10000m) | Cavites souterraines |
| `/tri_zonage` | `latlon` (requis) | Zones inondables TRI |

**Pieges :**
- Format `latlon` = `longitude,latitude` (pas l'inverse)
- `/rga` retourne un body vide (HTTP 200, pas de JSON) si hors couverture
- `resultats_rapport_risque` : chaque risque a `present` (bool) + `libelleStatutCommune` / `libelleStatutAdresse`

### Hub'Eau - Qualite eau potable

| Parametre | Detail |
|---|---|
| **Base URL** | `https://hubeau.eaufrance.fr/api/v1/qualite_eau_potable` |
| **Auth** | Aucune |
| **CORS** | Active |
| **Mise a jour** | Mensuelle |

**Endpoints :**

| Endpoint | Params cles | Usage |
|---|---|---|
| `/communes_udi` | `code_commune` | Obtenir les `code_reseau` des UDI |
| `/resultats_dis` | `code_commune`, `code_parametre`, `sort=desc`, `size` | Resultats d'analyses |

**Codes parametres :**

| Code | Libelle | Unite | Seuil reglementaire |
|---|---|---|---|
| 1340 | Nitrates | mg/L | 50 mg/L |
| 6276 | Total pesticides | ug/L | 0.5 ug/L |
| 1345 | Durete (TH) | degre F | Indicatif : <15 douce, 15-25 moyenne, >25 dure |
| 1350 | Fluor | mg/L | 1.5 mg/L |

**Piege critique : Paris = 75056** (pas les codes arrondissement 75101-75120). Idem Lyon (69123) et Marseille (13055).

### Base DPE ADEME

| Parametre | Detail |
|---|---|
| **Base URL** | `https://data.ademe.fr/data-fair/api/v1/datasets/meg-83tjwtg8dyz4vv7h1dqe` |
| **Auth** | Aucune |
| **Volume** | ~8.2 millions de DPE |

**Endpoints :**

| Endpoint | Params | Usage |
|---|---|---|
| `/values_agg` | `field=etiquette_dpe&qs=code_insee_ban:XXXXX&agg_size=10&size=0` | Distribution des etiquettes A-G |
| `/metric_agg` | `metric=avg&field=conso_5_usages_par_m2_ep&qs=code_insee_ban:XXXXX` | Consommation moyenne |
| `/metric_agg` | `metric=avg&field=emission_ges_5_usages_par_m2&qs=code_insee_ban:XXXXX` | Emission GES moyenne |

**Note :** DPE utilise `code_insee_ban` qui accepte les codes arrondissement (75107 OK) — inverse de Hub'Eau.

---

## Architecture technique

### Stack

| Composant | Choix |
|---|---|
| Framework | Next.js 16.x (App Router) |
| Langage | TypeScript strict |
| Styling | Tailwind CSS 4.x |
| UI components | shadcn/ui |
| Carte | MapLibre GL JS + tuiles IGN (Phase 5) |
| Validation | Zod |
| Cache | Next.js fetch cache + ISR |
| Deploiement | Vercel |

### Structure des fichiers

```
diag-adresse/
├── app/
│   ├── layout.tsx                        # Layout racine (metadata, police, analytics)
│   ├── page.tsx                          # Homepage : recherche + villes populaires
│   ├── adresse/[slug]/
│   │   ├── page.tsx                      # Diagnostic complet (Server Component + Suspense)
│   │   ├── loading.tsx                   # Skeleton du dashboard
│   │   └── opengraph-image.tsx           # OG image dynamique (Phase 5)
│   ├── commune/[codeInsee]/
│   │   └── page.tsx                      # Page SEO commune (ISR revalidate 7j)
│   ├── risque/[type]/
│   │   └── page.tsx                      # Pages guide statiques par type de risque
│   ├── api/
│   │   ├── geocode/route.ts              # Proxy autocomplete
│   │   └── diagnostic/route.ts           # Orchestrateur (cache des appels API)
│   ├── sitemap.ts                        # Sitemap dynamique
│   └── robots.ts
├── components/
│   ├── address-search.tsx                # Input autocomplete avec debounce
│   ├── diagnostic-dashboard.tsx          # Conteneur principal
│   ├── risk-card.tsx                     # Carte risque generique
│   ├── risk-summary.tsx                  # Vue synthetique de tous les risques
│   ├── water-quality-card.tsx            # Resultats eau
│   ├── energy-card.tsx                   # DPE secteur
│   ├── risk-map.tsx                      # Carte MapLibre (Phase 5)
│   ├── share-button.tsx                  # Partage (Phase 5)
│   └── ui/                              # shadcn/ui components
├── lib/
│   ├── apis/
│   │   ├── geocode.ts                    # Client API Adresse / Geoplateforme
│   │   ├── georisques.ts                 # Client Georisques V1
│   │   ├── hubeau.ts                     # Client Hub'Eau
│   │   └── ademe-dpe.ts                  # Client DPE ADEME
│   ├── types/
│   │   ├── geocode.ts
│   │   ├── georisques.ts
│   │   ├── hubeau.ts
│   │   ├── dpe.ts
│   │   └── diagnostic.ts                # Type unifie du diagnostic
│   ├── scoring.ts                        # Normalisation donnees -> niveau + couleur
│   ├── slug.ts                           # Encodage/decodage slug adresse
│   ├── paris.ts                          # Mapping arrondissements Paris/Lyon/Marseille
│   └── constants.ts                      # Seuils, couleurs, labels, URLs APIs
├── public/
│   └── icons/                            # Icones risques (SVG)
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
└── package.json
```

### Variables d'environnement

```env
NEXT_PUBLIC_GEOCODE_URL=https://data.geopf.fr/geocodage
GEOCODE_FALLBACK_URL=https://api-adresse.data.gouv.fr
GEORISQUES_BASE_URL=https://georisques.gouv.fr/api/v1
HUBEAU_BASE_URL=https://hubeau.eaufrance.fr/api/v1/qualite_eau_potable
ADEME_DPE_BASE_URL=https://data.ademe.fr/data-fair/api/v1/datasets/meg-83tjwtg8dyz4vv7h1dqe
GEORISQUES_API_KEY=
MOCK_APIS=false
```

---

## Phase 1 -- Fondations et geocodage (3-4 jours)

**Livrable** : taper une adresse, voir les suggestions, naviguer vers `/adresse/[slug]`

### Etape 1.1 -- Initialisation projet

```bash
npx create-next-app@latest diag-adresse --typescript --tailwind --app --src=false --eslint --import-alias "@/*"
cd diag-adresse
npx shadcn@latest init
npx shadcn@latest add card badge input skeleton separator
npm install zod
```

Fichiers :
- `next.config.ts` : configurer `images.remotePatterns` si necessaire
- `app/layout.tsx` : metadata de base (title, description, viewport), police Inter
- `lib/constants.ts` : URLs de base des APIs, seuils reglementaires, mapping couleurs

### Etape 1.2 -- Client API Geocodage

Fichier : `lib/apis/geocode.ts`

Deux fonctions :
1. `autocomplete(query: string, limit?: number): Promise<GeocodeSuggestion[]>`
   - Appelle `data.geopf.fr/geocodage/search?q=...&autocomplete=true&limit=5`
   - Fallback sur `api-adresse.data.gouv.fr/search` si echec
   - Retourne : label, coordinates [lon, lat], citycode, postcode, city, context
2. `reverseGeocode(lon: number, lat: number): Promise<GeocodeSuggestion | null>`

Fichier : `lib/types/geocode.ts` -- types GeoJSON de la reponse

Fichier : `lib/slug.ts` :
- `slugify("20 Avenue de Segur 75007 Paris")` -> `"20-avenue-de-segur-75007-paris"`
- `slugToQuery(slug)` pour reconstruire la query de geocodage

### Etape 1.3 -- Route API proxy autocomplete

Fichier : `app/api/geocode/route.ts`

- Valider le parametre `q` (min 3 caracteres)
- Appeler `autocomplete()` depuis `lib/apis/geocode.ts`
- Retourner JSON
- Headers `Cache-Control: public, max-age=3600`

### Etape 1.4 -- Composant AddressSearch

Fichier : `components/address-search.tsx`

- `"use client"`
- Input avec debounce 300ms (simple `setTimeout`/`clearTimeout`)
- Fetch vers `/api/geocode?q=...` quand query >= 3 caracteres
- Dropdown avec suggestions formatees
- Au clic : `router.push(/adresse/${slugify(label)})` avec searchParams (`?lon=...&lat=...&citycode=...`)
- Gestion clavier (fleches + Enter)
- Accessibilite : `role="combobox"`, `aria-expanded`, `aria-activedescendant`

### Etape 1.5 -- Homepage

Fichier : `app/page.tsx` (Server Component)

- Titre, description, composant `<AddressSearch />`
- Section "Villes populaires" : liens vers `/commune/75056`, `/commune/69123`, `/commune/13055`, etc.

### Etape 1.6 -- Page placeholder diagnostic

Fichier : `app/adresse/[slug]/page.tsx`

- Lire `params.slug` et `searchParams` (lon, lat, citycode)
- Si pas de searchParams : re-geocoder le slug via `autocomplete(slugToQuery(slug))`
- Afficher un placeholder avec les donnees de geocodage

---

## Phase 2 -- Risques naturels et technologiques (4-5 jours)

**Livrable** : diagnostic complet des risques pour n'importe quelle adresse

### Etape 2.1 -- Client Georisques

Fichier : `lib/apis/georisques.ts`

Fonction principale :
```
fetchRiskReport(params: { codeInsee?: string; lon?: number; lat?: number }): Promise<RiskReport>
```
- Appelle `/api/v1/resultats_rapport_risque?latlon=lon,lat`
- Rate limit 1 req/s : implementer un rate limiter cote serveur

Fonctions complementaires :
```
fetchRadon(codeInsee: string): Promise<RadonData>
fetchRGA(lon: number, lat: number): Promise<RGAData>
fetchSeismicZone(codeInsee: string): Promise<SeismicData>
fetchICPE(params: { codeInsee: string; rayon?: number }): Promise<ICPEData[]>
fetchCavites(params): Promise<CaviteData[]>
```

Fichier : `lib/types/georisques.ts`

**Decisions :**
- Toujours envoyer `latlon=lon,lat` quand on a les coordonnees (resultats au niveau adresse)
- ICPE : rayon 5000m par defaut, Seveso en priorite

### Etape 2.2 -- Systeme de scoring

Fichier : `lib/scoring.ts`

4 niveaux : `negligible`, `faible`, `moyen`, `fort`

Regles de mapping :
- **Seisme** : zone 1 = negligible, 2 = faible, 3 = moyen, 4-5 = fort
- **Radon** : classe 1 = faible, 2 = moyen, 3 = fort
- **Argile (RGA)** : exposition 0 = negligible, 1 = faible, 2 = moyen, 3 = fort
- **Inondation** : `libelleStatutAdresse` contient "Existant" = fort, sinon commune-level = moyen
- **ICPE** : >= 1 Seveso seuil haut dans le rayon = fort, seuil bas = moyen, ICPE simples = faible

Couleurs associees : vert, jaune, orange, rouge.

### Etape 2.3 -- Composants risques

Fichier : `components/risk-card.tsx`
- Props : `title`, `level`, `description`, `icon`, `details` (optionnel)
- Carte shadcn/ui avec badge couleur, icone SVG, section depliable

Fichier : `components/risk-summary.tsx`
- Barre avec tous les risques en badges couleur
- Resume textuel : "3 risques identifies dont 1 important"

### Etape 2.4 -- Dashboard

Fichier : `components/diagnostic-dashboard.tsx` (Server Component)

- Recoit `lon`, `lat`, `citycode` en props
- Appelle les APIs Georisques en parallele avec `Promise.allSettled()`
- Si une API echoue, les autres s'affichent quand meme
- Passe les resultats aux sous-composants

### Etape 2.5 -- Page diagnostic complete

Fichier : `app/adresse/[slug]/page.tsx`

- Server Component avec `generateMetadata()`
- Suspense boundaries autour de chaque section
- `loading.tsx` avec skeletons

---

## Phase 3 -- Qualite de l'eau + DPE (3-4 jours)

**Livrable** : MVP complet (risques + eau + energie)

### Etape 3.1 -- Client Hub'Eau

Fichier : `lib/apis/hubeau.ts`

```
fetchWaterQuality(codeCommune: string): Promise<WaterQualityResult>
```

Strategie :
1. Appeler `/communes_udi?code_commune=XXX` pour obtenir les `code_reseau`
2. Pour chaque parametre cle (1340, 6276, 1345, 1350), appeler `/resultats_dis?code_commune=XXX&code_parametre=YYY&sort=desc&size=1` pour la derniere mesure
3. Retourner objet structure avec derniere mesure + conformite

Fichier : `lib/paris.ts` -- Mapping arrondissements :
- 751XX -> 75056
- 6938X -> 69123
- 132XX -> 13055

### Etape 3.2 -- Composant eau

Fichier : `components/water-quality-card.tsx`

- Chaque parametre : valeur, unite, seuil reglementaire, barre de progression coloree
- Verdict de conformite (`conclusion_conformite_prelevement`)
- Date du dernier prelevement

### Etape 3.3 -- Client DPE ADEME

Fichier : `lib/apis/ademe-dpe.ts`

```
fetchDPEStats(codeInsee: string): Promise<DPEStats>
```

Strategie :
1. `/values_agg` -> distribution des etiquettes A-G
2. `/metric_agg` (conso) -> consommation moyenne kWh/m2/an
3. `/metric_agg` (GES) -> emission GES moyenne kgCO2/m2/an

### Etape 3.4 -- Composant energie

Fichier : `components/energy-card.tsx`

- Barres horizontales A a G avec couleurs officielles DPE
- Consommation moyenne + emission GES moyenne
- Nombre total de DPE (indicateur de fiabilite)

### Etape 3.5 -- Integration

Mettre a jour `diagnostic-dashboard.tsx` :
- Ajouter Hub'Eau et ADEME dans le `Promise.allSettled()`
- Sections eau et energie avec Suspense boundaries separees

---

## Phase 4 -- Pages communes SEO + ISR (2-3 jours)

**Livrable** : ~36 000 pages indexables + sitemap

### Etape 4.1 -- Page commune

Fichier : `app/commune/[codeInsee]/page.tsx`

- ISR avec `revalidate = 604800` (7 jours)
- Reutilise `DiagnosticDashboard` avec `codeInsee` au lieu de coordonnees
- Header contextuel + lien "Affiner par adresse"

### Etape 4.2 -- SEO metadata

Fichier : `lib/seo.ts`

- `generateCommuneMetadata(codeInsee, communeName, diagnostic)`
- Descriptions structurees : "Paris 7e : zone sismicite 1, risque argile moyen, eau conforme, DPE moyen E"

### Etape 4.3 -- Sitemap dynamique

Fichier : `app/sitemap.ts`

- URLs pour les communes francaises (commencer par les 1000 plus grandes)
- Source : fichier JSON statique des communes avec code INSEE et nom

### Etape 4.4 -- Pages guides risques

Fichier : `app/risque/[type]/page.tsx`

- Pages statiques : `inondation`, `seisme`, `argile`, `radon`, `icpe`, `cavites`
- Contenu pedagogique + lien vers le diagnostic

---

## Phase 5 -- Carte interactive + polish (3-4 jours)

**Livrable** : produit fini et partageable

### Etape 5.1 -- Carte MapLibre

Fichier : `components/risk-map.tsx`

- `"use client"`, `npm install maplibre-gl`
- Tuiles IGN Plan v2 : `https://data.geopf.fr/wmts` (gratuites)
- Marqueur sur l'adresse
- Cercle de rayon pour les ICPE
- Marqueurs ICPE colores par statut Seveso

### Etape 5.2 -- OG Image dynamique

Fichier : `app/adresse/[slug]/opengraph-image.tsx`

- `ImageResponse` de `next/og`
- Adresse + mini-resume risques avec pastilles couleur + score DPE
- Format 1200x630

### Etape 5.3 -- Bouton partage

Fichier : `components/share-button.tsx`

- Web Share API si disponible, sinon copie presse-papier
- URL canonique sans searchParams

### Etape 5.4 -- Polish

- Responsive mobile-first
- Dark mode (Tailwind `dark:`)
- Animations skeleton -> contenu
- Gestion erreur gracieuse
- `preconnect` aux domaines API dans le layout

---

## Edge cases critiques

| Edge case | Solution |
|---|---|
| **Paris/Lyon/Marseille** | Hub'Eau veut le code commune global (75056), DPE veut le code arrondissement (75107) — deux mappings inverses |
| **Georisques `/rga` body vide** | HTTP 200 + body vide si hors couverture — gerer ce cas |
| **DOM-TOM** | Couverture limitee — afficher message adapte |
| **Adresses sans numero (lieu-dit)** | Type `locality`/`street`, pas de coordonnees precises pour le RGA |
| **Communes fusionnees** | Code INSEE peut avoir change, donnees historiques sur l'ancien code |
| **Slug ambigu** | Stocker lon/lat/citycode dans les searchParams, re-geocoder si absents |
| **Surconsommation API en dev** | `MOCK_APIS=true` pour utiliser des fixtures JSON |

---

## Risques techniques

| API | Risque | Mitigation |
|---|---|---|
| API Adresse (ancien) | Decomissionnement | Geoplateforme en primaire, ancien en fallback |
| Georisques V1 | Deprecation au profit de V2 | S'inscrire pour token V2 (gratuit), abstraire le client |
| Georisques `resultats_rapport_risque` | Rate limit 1 req/s | Cache 24h minimum, ne jamais appeler cote client |
| Hub'Eau | Anomalies donnees possibles | Verifier dates de prelevement, bandeau d'avertissement |
| ADEME DPE | Dataset ID potentiellement instable | Variable d'env `ADEME_DPE_DATASET_ID` |
| ADEME DPE | Pas de DPE pour communes rurales | Afficher "Aucun DPE disponible" |
| Toutes | Timeout / indisponibilite | `Promise.allSettled()`, timeout 10s, afficher sections disponibles |

---

## Calendrier

| Semaine | Phases | Resultat |
|---|---|---|
| **Sem 1** | Phase 1 + debut Phase 2 | Autocomplete fonctionnel, premiers risques |
| **Sem 2** | Fin Phase 2 + Phase 3 | **MVP complet** — risques + eau + DPE |
| **Sem 3** | Phase 4 + Phase 5 | Pages SEO + carte + partage — **pret pour lancement** |

## Dependances npm

```json
{
  "dependencies": {
    "next": "^16.2.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "zod": "^3.24.0",
    "maplibre-gl": "^5.x.x"
  },
  "devDependencies": {
    "typescript": "^5.8.0",
    "@types/node": "^22.x.x",
    "@types/react": "^19.x.x",
    "tailwindcss": "^4.x.x",
    "eslint": "^9.x.x",
    "eslint-config-next": "^16.x.x"
  }
}
```

Note : `maplibre-gl` uniquement en Phase 5.
