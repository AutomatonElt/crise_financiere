# Stratégie de montage — Mix Réel / IA / Custom

## Principe général

Chaque vidéo de la chaîne combine trois types de visuels :
1. **Footage réel** — archives, documents, lieux, photos publiques
2. **Vidéo/Image IA** — reconstitutions stylisées, scènes impossibles à filmer, ambiances
3. **Graphiques custom** — données, flowcharts, comparaisons, schémas (produits par le créateur)

## Ratio cible

| Type | Proportion | Rôle |
|------|-----------|------|
| **Footage réel** | ~40% | Crédibilité, ancrage dans la réalité, preuve |
| **Vidéo/Image IA** | ~30% | Reconstitutions, ambiances, scènes impossibles |
| **Graphiques custom** | ~30% | Signature "Financial Forensics", valeur éducative |

Ce ratio prouve l'effort humain, évite le label "AI slop", et donne un rendu premium.

## Conformité YouTube

- **Divulgation IA obligatoire** — Cocher "AI use" dans YouTube Studio pour tout contenu IA réaliste (personnes, événements). Ne démonétise pas.
- **Pas d'AI persona "expert"** — Interdit d'utiliser un avatar IA présenté comme analyste financier. Narrateur voix off + footage IA en support = OK.
- **Pas de deepfake de personnes réelles** — Ne pas générer un visage IA d'une personne réelle qui "parle". Utiliser sa vraie photo (publique) ou une silhouette stylisée.

### Points de vigilance actés (non encore formalisés en workflow)

- **Checklist de publication — divulgation IA** : avant chaque upload, cocher systématiquement la case "Altered or synthetic content" dans YouTube Studio dès qu'un visuel IA réaliste est utilisé (silhouette Wembley, yacht, café au Cap, etc.). À ajouter comme étape obligatoire dans le pipeline de publication, pas seulement comme principe théorique.
- **Ton dubitatif strict sur les allégations non confirmées** — Pour la théorie du meurtre de Ruja Ignatova (source unique BIRD, non corroborée), le texte du script est déjà prudent ("unconfirmed", "alleged"), mais le montage doit l'être tout autant : ne jamais illustrer la mort de façon graphique ou visuellement définitive (ex. le yacht qui "s'efface en noir" doit rester ambigu, pas conclusif). Le ton visuel ne doit jamais être plus catégorique que le texte.
- **Anti-template — variation dès les premières vidéos** : Les 5 piliers (Breakdown/Numbers/Pattern/Aftermath/identité visuelle) appliqués à l'identique sur chaque vidéo risquent de ressembler à un template répétitif (catégorie 1 "Inauthentic Content"). La variation de formats/périodes/géographie (point 5.4 de la stratégie de chaîne) doit être appliquée concrètement dès la vidéo 2, pas différée.
- **Distance narrative avec Sagamo** — Pour les sujets déjà couverts par Sagamo (Bourassa, Ginter, Mandel), éviter de reproduire leur découpage scène par scène. L'angle analytique + graphiques Remotion doit rester la différenciation réelle, pas un habillage superficiel sur une structure empruntée.

### Guide de variation structurelle (à appliquer script par script)

Le risque n'est pas seulement dans les visuels ou les sujets — il est dans le **squelette rhétorique** des scripts eux-mêmes. Constat sur les scripts Ruja Ignatova / Theranos : les sections "The Pattern" des deux scripts utilisaient la même formule ("Here's what X has in common with almost every..."), et le même moule "l'erreur fatale n'était pas X, c'était UN Y précis qui a tout terminé". Deux occurrences suffisent à créer un pattern détectable si un spectateur ou un modérateur compare plusieurs vidéos de la chaîne.

Techniques de variation à appliquer, script par script :
- **Ordre des sections** — ne pas toujours suivre Hook→Histoire→Breakdown→Numbers→Aftermath→Pattern→Outro à l'identique. Alterner : Numbers avant Breakdown, Pattern amorcé en cours de récit plutôt qu'en bloc final, etc.
- **Noms de section** — varier "The Pattern" en "The Throughline", "The Repeat", "What This Really Is" selon le ton de l'histoire, plutôt que garder le même intitulé à chaque vidéo.
- **Squelette de la section de clôture analytique** — ne jamais réutiliser deux fois la même structure de phrase ("l'erreur fatale n'était pas X, c'était Y"). Varier l'angle d'entrée : parfois une question, parfois une statistique, parfois une comparaison directe à l'affaire précédente.
- **Style de hook** — alterner hook factuel-choc (disparition, ligne de vol), hook scène/image (couverture de magazine), hook en question directe, hook in medias res sur un procès.
- **Longueur** — viser une fourchette 18-27 min plutôt qu'une durée fixe identique à chaque script.
- **Points de comparaison chiffrés** — ne pas toujours comparer à Madoff comme référence par défaut ; varier les points de repère selon l'affaire.
- **Tics de vocabulaire analytiques à surveiller** — repérés sur les épisodes 1-3 : la construction "[X] worth [verbe]" ("worth naming explicitly", "worth sitting with", "worth remembering") est apparue dans les 3 scripts et devient elle-même un pattern. Idem pour l'auto-référence "this channel"/"cette chaîne" et la formule d'outro verbatim "Next time... Subscribe if you want to know/see X" — bannies définitivement, pas seulement corrigées au cas par cas. Avant de valider un script, relire les 2-3 derniers scripts publiés pour vérifier qu'aucune formule-clé n'est réutilisée mot pour mot.
- **Précision sur le teaser de fin** — la section 4.4 de `youtube-channel-strategy.md` autorise explicitement le "same intro/outro sur toutes les vidéos", et la section 6.7 identifie le teaser "Next case" comme un levier de binge-watching prouvé. Le risque de conformité (section 4.5) porte sur les templates interchangeables ("même structure/narration, juste changer le sujet"), pas sur l'existence d'un teaser récurrent en soi. Conclusion : garder un teaser de fin sur chaque épisode, mais varier sa formulation exacte à chaque fois — ne jamais le supprimer entièrement par excès de prudence.

## Stack IA recommandée

| Besoin | Outil | Coût mensuel |
|--------|-------|-------------|
| Images IA (schémas, ambiances, reconstitutions) | Midjourney v7 / DALL-E 3 | ~$10-30 |
| Vidéo IA (courtes séquences, transitions) | Runway Gen-3 / Kling / Pika | ~$15-35 |
| Voix off | ElevenLabs | ~$22 |
| Footage réel (archives, lieux) | Pexels / Pixabay (gratuit) ou Storyblocks (premium) | Gratuit ou ~$30 |
| Documents / screenshots | Capture d'écran + traitement | Gratuit |

---

## Application : Ruja Ignatova — The Cryptoqueen

### Footage réel (~40%)

| Visuel | Source | Type |
|--------|--------|------|
| Photos publiques de Ruja Ignatova | FBI Most Wanted / presse | Photo |
| Bâtiment OneCoin à Sofia | Google Street View / presse | Photo |
| Documents FBI / DOJ | fbi.gov / justice.gov | Screenshot |
| Wembley Arena | Stock footage / archives | Vidéo |
| Carte du vol Sofia → Athènes | Carte réelle + animation | Graphique sur base réelle |
| Photos d'arrestation (Greenwood, Konstantin) | DOJ / presse | Photo |
| Poster FBI Most Wanted | fbi.gov | Screenshot |

### Vidéo/Image IA (~30%)

| Visuel | Outil suggéré | Type |
|--------|--------------|------|
| Silhouette en robe rouge sur scène (Wembley) | Midjourney / Runway | Image ou courte vidéo |
| Yacht en mer Ionienne | Midjourney / Runway | Image ou courte vidéo |
| Employé face à un tableur, puis partant | Midjourney / Runway | Image ou courte vidéo |
| Silhouette changeant de visage (nouvelle identité) | Runway Gen-3 | Vidéo courte |
| Café au Cap (silhouette anonyme) | Midjourney | Image |
| Reconstitution stylisée — foule, projecteurs | Midjourney / Runway | Image ou courte vidéo |
| Mockup DealShaker (produits, prix gonflés) | Midjourney + montage | Image composite |

### Graphiques custom (~30%)

| Visuel | Outil suggéré | Priorité |
|--------|--------------|----------|
| Courbe de prix OneCoin (lisse) vs Bitcoin (chaotique) 2014-2017 | After Effects / Manim / Python matplotlib | **#1 — le plus screenshotable** |
| Flowchart MLM qui se transforme en pyramide | After Effects | **#2 — le plus screenshotable** |
| Flowchart "où est l'argent" ($4B → récupéré vs disparu) | After Effects / Manim | **#3 — le plus screenshotable** |
| Comparaison blockchain publique vs registre centralisé | After Effects / schéma animé | Haute |
| Escalier de la récompense FBI $100K → $250K → $5M | After Effects / graphique | Haute |
| Tableau des packages OneCoin (€110 → €27,500) | After Effects / Canva | Moyenne |
| Comparaison Bitcoin mining vs OneCoin "mining" (bouton) | After Effects / schéma | Moyenne |
| Trois théories de disparition (crâne / ombre / café) | After Effects + Midjourney (icônes) | Moyenne |
| Chaîne de confiance sociale (A → B → C → D) | After Effects / schéma | Basse |
| Spectre de gravité (fraude → blanchiment → crime → violence) | After Effects | Basse |
| Liste d'insiders ignorés (Bjercke, Markopolos, Watkins) | After Effects / lower third | Basse |

### Direction musicale

| Section | Musique |
|---------|---------|
| Hook | Pas de musique jusqu'à la dernière phrase |
| Titre "THE CRYPTOQUEEN" | Entrée musicale — ton grave, tension |
| L'Histoire | Musique narrative, build-up progressif |
| The Breakdown | Tension croissante, beats plus marqués |
| The Numbers | Plus froid, plus clinique (style data/finance) |
| The Aftermath | Silence dramatique avant les 3 théories, puis musique sombre et atmosphérique |
| The Pattern | Résolution, ton réflexif |
| Outro | Fondu musical, teaser sombre pour Ponzi |

### Pacing par section

| Section | Débit (wpm) | Note |
|---------|-------------|------|
| Hook | ~160 | Rapide, urgent |
| L'Histoire | ~150 | Narratif, fluide |
| The Breakdown | ~135 | Lent, didactique — laisser respirer les explications |
| The Numbers | ~145 | Posé, clinique |
| The Aftermath | ~140 | Dramatique, pauses sur les 3 théories |
| The Pattern | ~145 | Réflexif, conclusif |
| Outro | ~160 | Rapide, énergique sur le teaser |

---

*Document créé le 6 août 2026 — Stratégie de production pour la chaîne "Financial Forensics".*
