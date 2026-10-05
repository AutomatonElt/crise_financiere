# Spec graphiques custom — Ruja Ignatova : The Cryptoqueen

> Contrepartie de `ia-visual-prompts.md` pour le tiers "graphiques custom" (~30% du montage).
> Pas de prompt IA — ce sont des visualisations de données produites avec After Effects / Manim / Python matplotlib.
> Aucun de ces graphiques ne nécessite de divulgation IA YouTube (visualisations de données, pas de reconstitutions réalistes).

---

## #1 — Courbe de prix OneCoin vs Bitcoin

**Priorité** : #1 — le plus screenshotable
**Apparition** : `The Breakdown` — "graphique — courbe de prix OneCoin, parfaitement lisse... comparée à la courbe chaotique du vrai Bitcoin"
**Outil** : After Effects (courbes animées) ou Python/matplotlib pour la précision des données, importé en asset
**Durée à l'écran** : ~8-10s — la ligne OneCoin se dessine d'abord lentement, puis Bitcoin apparaît en surimpression pour le contraste

### Données à tracer

**Courbe OneCoin** (prix officiel déclaré par la société, en euros) :

| Date | Prix |
|------|------|
| Fin 2014 | €0.50 |
| Fin 2015 | ~€3.88 |
| Fin 2016 | ~€5.95 |
| Fin 2017 | ~€19.95 |
| Jan 2019 | ~€29.95 |

Tracer comme une ligne **parfaitement lisse**, sans aucun palier visible individuellement malgré des paliers réels tous les 15 jours — c'est le point narratif : à l'œil, ça ressemble à un mensonge géométrique, pas à un marché.

**Courbe Bitcoin** (prix de marché réel, USD, pour contraste) sur la même période 2014-2017 :

Repères clés pour la volatilité visuelle :
- ~$320 (déc 2014) → chute à ~$230 (jan 2015)
- Remontée progressive → ~$960 (déc 2016)
- Pic à ~$2,000 (mai 2017) → correction
- ~$19,000 (déc 2017, pic historique de l'époque)

L'objectif n'est pas la précision au dollar près mais de montrer une ligne qui **monte, redescend, stagne, explose** — le contraire visuel exact de la ligne OneCoin.

### Spécifications visuelles

- **Palette** : ligne OneCoin en or plat (#C9A961), ligne Bitcoin en blanc cassé avec légère transparence pour ne pas dominer visuellement
- **Axe des Y** : volontairement sans unité fixe affichée au premier plan — le narrateur dit les chiffres, le graphique montre la **forme**, pas les valeurs exactes (évite le côté "tableau Excel")
- **Annotation à l'écran** : au moment où le narrateur dit "That smooth, uninterrupted line is, on its own, a red flag" — freeze frame 1s sur la courbe OneCoin avec un léger halo or qui pulse doucement autour de la ligne entière

---

## #2 — Flowchart MLM qui se transforme en pyramide

**Priorité** : #2 — le plus screenshotable
**Apparition** : `The Breakdown` — "flowchart MLM classique... se transforme visuellement en pyramide classique"
**Outil** : After Effects (morphing de formes vectorielles)
**Durée à l'écran** : ~6-8s pour la transformation complète

### Structure de données à représenter

**État 1** (affiché en premier, 2s) — présentation "légitime" :

```
[Vous] → recrutez → [Personne A, Personne B, Personne C]
```

- Chaque case porte le libellé "Package éducatif + tokens"
- Flèches de commission en pointillés, discrètes, secondaires visuellement

**État 2** (transformation, 3-4s) — les cases "package" disparaissent :

- Les libellés "package éducatif" se dissolvent en premier
- Les flèches de commission deviennent le seul élément qui reste, en plein
- Les cases se réarrangent automatiquement en structure pyramidale classique à 4-5 niveaux (vous → 3 → 9 → 27 → 81, ratio de x3 par niveau à visée illustrative, pas basé sur un chiffre réel de OneCoin)

**État 3** (final, statique 2s) — pyramide nue :

- Structure pyramidale classique, aucun élément "produit" visible
- Uniquement des flèches de commission empilées
- Le mot "COMMISSION" est le seul texte restant à l'écran

### Spécifications visuelles

- **Couleur** : dégradé du bleu nuit (base, niveau 1) vers un rouge sourd (sommet, niveaux inférieurs) — pas un rouge vif, plutôt un bordeaux discret pour rester dans la palette de marque tout en signalant "danger" progressivement
- **Timing calé sur le texte** : la transformation doit se terminer exactement au moment où le narrateur dit "The real product was the recruitment bonus" — pas avant, pas après

---

## #3 — Flowchart "où est l'argent" ($4B → récupéré vs disparu)

**Priorité** : #3 — le plus screenshotable
**Apparition** : `The Numbers` — "flowchart — $4B entrants → branches : récupérés/saisis, gelés, disparu"
**Outil** : After Effects ou D3.js si export vidéo possible depuis le pipeline
**Durée à l'écran** : ~10-12s, révélation progressive branche par branche

### Données exactes à représenter

| Branche | Montant | % du total | Source |
|---------|---------|-----------|--------|
| Total collecté | $4,000,000,000+ | 100% | Base du flowchart |
| Forfaiture Greenwood | $300,000,000 | ~7.5% | DOJ, sept. 2023 |
| Blanchiment Armenta (montant transitant) | $300,000,000 | ~7.5% | DOJ, fév. 2023 |
| Blanchiment Mark Scott (montant transitant) | $400,000,000 | ~10% | DOJ, nov. 2019 / forfaiture $392M en 2024 |
| Reste non retrouvé | ~$3,000,000,000+ | ~75% | Estimation par différence |

### Note de précision

Les montants Greenwood/Armenta/Scott se recoupent partiellement (ce sont des montants qui ont **transité** par ces personnes, pas nécessairement 3 sommes totalement distinctes et cumulables sans doublon). Le flowchart doit rester honnête là-dessus — libellé suggéré sur la branche "reste" : **"est. $3B+ still unaccounted for"** plutôt qu'un chiffre présenté comme une soustraction arithmétique exacte, pour ne pas survendre une précision qu'on n'a pas.

### Spécifications visuelles

- Barre unique horizontale qui se remplit d'abord en or plein (100% = $4B), puis se subdivise en segments qui glissent vers le bas de l'écran un par un (Greenwood, Armenta, Scott), laissant un segment gris/noir dominant pour "jamais retrouvé"
- Visuellement, ce segment gris doit occuper **largement plus de la moitié** de la barre, sans ambiguïté
- Dernier élément à l'écran : le segment gris seul, avec un point d'interrogation géant, pour faire le pont visuel entre le graphique de données et l'image stylisée qui suit

---

## Notes de cohérence transversale

- Les trois graphiques partagent la **même typographie de données** (chiffres) que le reste de l'identité de marque — à définir une fois dans un template After Effects réutilisable pour tous les épisodes, pas recréé à chaque fois
- **Aucun de ces trois graphiques ne nécessite de divulgation IA YouTube** (ce sont des visualisations de données, pas des reconstitutions réalistes) — contrairement aux visuels de `ia-visual-prompts.md`
- Pour les épisodes suivants (Theranos, Madoff, FTX), prévoir un doc frère du même format — les graphiques les plus "screenshotables" identifiés dans les notes de production de chaque script suivent la même logique de priorisation
