# DiagAdresse

Diagnostic complet de votre adresse en France : risques naturels et industriels, qualite de l'eau, performance energetique.

## Commandes

```bash
pnpm dev            # Serveur de developpement
pnpm build          # Build de production
pnpm start          # Serveur de production (apres build)
pnpm lint           # ESLint
npx tsc --noEmit    # Verification des types
```

## TODO SEO

### Priorite haute

- [x] Acheter un domaine custom (`.fr` ideal) et le connecter sur Vercel
- [x] Connecter Google Search Console, soumettre le sitemap
- [x] Ameliorer le maillage interne (communes voisines, liens departement dans le footer, guides risques vers communes concernees)
- [x] Elargir la homepage (plus de villes populaires + section departements)

### Priorite moyenne

- [x] Ajouter des headers `Cache-Control` dans `next.config.ts` pour les assets statiques (Core Web Vitals)
- [x] Creer une page `/faq` dediee avec schema `FAQPage`
- [x] Creer des pages par region (`/region/[code]`)
- [x] Enrichir les guides risques avec plus de contenu longue traine

### Priorite basse

- [ ] Creer un blog / articles (ex: "Comment lire un DPE", "Zones inondables en France")
- [ ] Soumettre le site aux annuaires d'outils immobiliers francais
- [ ] Obtenir des backlinks (guest posts, forums immobilier/renovation)
