---
name: verify
description: Recette de vérification runtime pour diag-adresse — lancer le dev server, piloter les pages et l'autocomplétion, simuler les pannes d'API externes.
---

# Vérifier diag-adresse en runtime

## Lancer

```bash
pnpm exec next dev -p 3210   # port dédié : des next-server orphelins traînent parfois sur :3000
```

Attention : Next 16 refuse deux `next dev` simultanés sur le même projet
(« Another next dev server is already running »). Pour tester une config
alternative (env vars), tuer le premier serveur d'abord (`pkill -f "next dev"`).

## Surfaces à piloter

- Page commune : `curl http://localhost:3210/commune/montpellier-34172` — vérifier
  cartes risques (« Zone de sismicité »), section eau (« Nitrates », valeurs mg/L).
  Le HTML contient les valeurs dans le payload RSC : les textes sont coupés par des
  `<!-- -->`, préférer un `re.sub(r'<[^>]+>|<!-- -->','',…)` avant grep.
- Page adresse avec params : `/adresse/mon-slug?lon=8.7386&lat=41.9192&citycode=2a004`
  — doit rendre le H1 depuis le slug et « Code INSEE : 2A004 » sans appel géocodeur.
- API geocode : `?q=pa` → 400 ; `?q=paris` → 200 ; ~60 requêtes rapides → 429.

## Simuler une panne d'API externe

Les URLs de base sont surchargeables par env (lib/constants.ts) :

```bash
GEORISQUES_BASE_URL=http://127.0.0.1:9/api/v1 GEO_GOUV_BASE_URL=http://127.0.0.1:9 pnpm exec next dev -p 3211
```

- Géorisques mort → page commune : zéro carte risque + « temporairement indisponibles ».
- geo.gouv mort → `/departement/34` doit répondre 500 (jamais 200 avec listing vide).
- Montpellier (34172) est dans TOP_COMMUNES : sa résolution ne dépend pas de geo.gouv.

## Piloter l'autocomplétion (client)

Pas de playwright dans le projet ; utiliser `playwright-core` (npm, sans téléchargement
de navigateur) dans le scratchpad + le chromium du cache local :

```js
import { chromium } from "playwright-core";
const browser = await chromium.launch({
  executablePath:
    process.env.HOME +
    "/Library/Caches/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-arm64/chrome-headless-shell",
});
```

Pour forcer un chevauchement de requêtes (test d'abort) : `page.route` sur
`**/api/geocode**` avec 500 ms de délai, frapper, pauser >300 ms (debounce),
re-frapper pendant le vol → l'événement `requestfailed` doit montrer `net::ERR_ABORTED`.

## Ne pas faire

- `pnpm build` comme vérification : flaky (API externes au build des pages département).
- Oublier `pkill -f "next dev"` en fin de session.
