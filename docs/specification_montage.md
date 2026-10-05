Spécification — Agent local de génération automatique de montages Kdenlive via OpenTimelineIO

1. Objectif du système

Le rôle de l'agent est de transformer un épisode de contenu vidéo en timeline de montage quasi finalisée, sans demander à l'utilisateur de construire manuellement le montage dans Kdenlive.

Le principe fondamental est :

Script / narration / assets / décisions éditoriales
                    ↓
              Agent local
                    ↓
          Analyse + plan de montage
                    ↓
             episode.otio
                    ↓
                Kdenlive
                    ↓
        Timeline déjà construite
                    ↓
      Utilisateur : contrôle humain
      + petites corrections
      + validation finale

Objectif utilisateur

L'utilisateur ne veut PAS :

Ouvrir Kdenlive
→ construire le montage
→ chercher chaque clip
→ couper chaque clip
→ synchroniser la voix
→ placer chaque élément
→ faire tout le travail manuellement

Il veut :

Agent
→ fait l'essentiel du montage
→ produit une timeline cohérente
→ l'utilisateur ouvre Kdenlive
→ regarde le résultat
→ corrige quelques détails
→ valide

Le système doit donc être conçu comme un assistant de montage autonome, et non comme un simple générateur de fichiers.

2. Répartition des responsabilités

Agent : responsabilité principale

L'agent doit prendre en charge la majorité des décisions mécaniques et structurelles :

analyser le script ;

analyser la narration / voice-over ;

identifier les différentes sections narratives ;

déterminer les besoins visuels ;

sélectionner les assets disponibles ;

associer les assets aux passages du script ;

déterminer les points d'entrée et de sortie ;

calculer les durées ;

placer les clips sur la timeline ;

créer plusieurs pistes lorsque nécessaire ;

synchroniser le visuel avec le voice-over ;

créer les gaps nécessaires ;

gérer les chevauchements appropriés ;

organiser les éléments graphiques ;

préparer les transitions lorsque cela est possible ;

générer la timeline OpenTimelineIO ;

vérifier automatiquement la cohérence temporelle ;

vérifier que les fichiers référencés existent ;

produire un rapport de validation avant livraison.

Utilisateur : responsabilité humaine

L'utilisateur garde le contrôle créatif final.

Son travail doit principalement être :

regarder le montage ;

vérifier que le rythme lui convient ;

vérifier la cohérence visuelle ;

vérifier les choix artistiques ;

corriger quelques clips si nécessaire ;

déplacer ou raccourcir certains éléments ;

ajuster certaines transitions ;

modifier certains détails ;

valider le montage final.

Principe

L'utilisateur doit intervenir sur les décisions subjectives, pas sur les tâches répétitives.

L'agent doit automatiser au maximum les décisions qui peuvent être déterminées à partir de règles, du script, du timing et des assets.

3. OpenTimelineIO comme format intermédiaire

Le système utilise OpenTimelineIO (OTIO) comme représentation de la timeline.

Agent
  ↓
OTIO
  ↓
Kdenlive

L'agent ne doit donc pas essayer de manipuler directement l'interface graphique de Kdenlive pour construire chaque élément.

Il produit une représentation structurée de la timeline.

Une timeline OTIO peut contenir notamment :

Timeline

Stack

Track

Clip

Gap

ExternalReference

TimeRange

RationalTime

L'export OTIO doit référencer les fichiers médias par leur chemin réel.

Exemple conceptuel :

Timeline
├── Video Track
│   ├── Clip A
│   ├── Clip B
│   ├── Gap
│   └── Clip C
│
├── Audio Track
│   └── Voice-over
│
└── Additional tracks

Dans un exemple OTIO réel issu de Kdenlive, les médias sont représentés comme des Clip possédant une ExternalReference avec un target_url, tandis que les pistes sont distinguées par leur kind (Video / Audio). fileciteturn0file0L21-L41 fileciteturn0file0L67-L109

4. Le voice-over est la colonne vertébrale du montage

Pour les vidéos documentaires / explicatives, la narration constitue la structure temporelle principale.

Le système doit donc partir de :

Voice-over
    ↓
transcription / segmentation
    ↓
segments narratifs
    ↓
besoins visuels
    ↓
clips

Exemple :

00:00–00:05
"FTX semblait être l'une des entreprises les plus puissantes..."
        ↓
Plan d'introduction / logo / archive

00:05–00:12
"Mais derrière cette façade..."
        ↓
Plan plus sombre / document / graphique

00:12–00:20
"Le problème était beaucoup plus profond..."
        ↓
Graphique / visualisation / footage

L'agent doit éviter de construire une succession de clips indépendants sans relation avec la narration.

Le montage doit être narrativement synchronisé.

5. Structure interne recommandée

Avant de générer l'OTIO, l'agent doit créer une représentation intermédiaire.

Exemple :

{
  "episode": "02-ftx",
  "fps": 30,
  "voiceover": "tts/voiceover_en.mp3",
  "segments": [
    {
      "id": "seg_001",
      "start": 0.0,
      "end": 6.1,
      "text": "...",
      "visual_intent": "hook",
      "asset": "assets/custom-graphics/01-ftx-valuation-hook.mp4",
      "priority": "high"
    }
  ]
}

Cette représentation intermédiaire permet à l'agent de raisonner avant de produire l'OTIO.

Il ne faut pas mélanger :

raisonnement éditorial

et

génération OTIO

Les deux étapes doivent être séparées.

6. Pipeline complet

Étape 1 — Collecte

L'agent récupère :

script ;

voice-over ;

transcription si disponible ;

assets vidéo ;

images ;

graphiques ;

musiques ;

sound effects ;

éventuels sous-titres ;

métadonnées des médias.

Étape 2 — Analyse du script

Le script est segmenté en unités narratives.

Catégories possibles :

Hook

Context

Explanation

Evidence

Example

Historical footage

Data

Quote

Transition

Conclusion

CTA

Chaque segment reçoit un visual_intent.

Étape 3 — Analyse des assets

L'agent doit construire un catalogue des assets.

Exemple :

{
  "file": "03-ftx-bitcoin-ring.mp4",
  "type": "video",
  "duration": 16.03,
  "fps": 30,
  "tags": [
    "bitcoin",
    "crypto",
    "financial",
    "abstract"
  ]
}

Le catalogue peut être enrichi par :

nom du fichier ;

durée ;

résolution ;

FPS ;

type ;

emplacement ;

tags ;

description générée ;

importance ;

scènes détectées.

7. Sélection des plans

L'agent doit sélectionner les assets selon plusieurs critères.

Score conceptuel :

score =
    pertinence narrative
  + pertinence visuelle
  + qualité
  + continuité
  + variété
  + disponibilité temporelle

Il faut éviter :

utiliser le même clip trop souvent ;

montrer un visuel qui contredit la narration ;

changer de plan trop rapidement sans raison ;

conserver un plan trop longtemps uniquement parce qu'il est disponible.

8. Gestion temporelle

Toutes les opérations doivent être basées sur une représentation temporelle précise.

OTIO utilise des RationalTime et des TimeRange.

L'exemple fourni contient une timeline à 30 fps et des clips définis avec une durée et un start_time. fileciteturn0file0L24-L36

L'agent doit privilégier :

frames

ou

RationalTime

pour les calculs internes lorsque cela est pertinent.

Éviter de dépendre uniquement de valeurs flottantes en secondes pour les opérations critiques.

9. Gestion du voice-over

La piste de voice-over doit être une piste audio distincte.

Exemple observé dans une timeline OTIO Kdenlive :

Audio Track
└── voiceover_en.mp3

avec le média référencé par ExternalReference. fileciteturn0file0L386-L453

Le voice-over définit la durée fondamentale de l'épisode.

L'agent doit vérifier :

durée timeline vidéo ≈ durée voice-over

et signaler tout écart important.

10. Organisation des pistes

L'agent ne doit pas tout mettre sur une seule piste.

Structure standardisée de la chaîne ("Base Propre") :

V3_TITLES — Chiffres clés ($5M), Title Cards (dates/lieux), graphiques vectoriels (sommet)
V2_OVERLAYS — Cartes de chapitres (ChapterCard) et fiches personnages (EvidenceCard)
V1_MAIN — Rushs continus, B-roll, archives et Grand Titre (fondation maîtresse)

A1_MASTER_VOICE — Voice-over narrateur (métronome rythmique avec respiration au Grand Titre)
A2_MUSIC_BED — Musique d'ambiance et beat continu (ne coupe pas au Grand Titre)
A3_SFX_WHOOSH — Sound effects d'impact (whoosh titre pur, clic obturateur, touches clavier)
A4_SECONDARY_AUDIO — Voix secondaires, extraits d'interviews, son direct des rushs

L'objectif est de garder une timeline :

lisible ;
modifiable ;
compréhensible par l'utilisateur ;
facile à corriger dans Kdenlive.

11. Gaps

Les Gap doivent être utilisés lorsque l'absence de média est volontaire.

Exemple conceptuel :

Clip A
Gap
Clip B

Un fichier OTIO réel issu de Kdenlive contient par exemple un Gap de 6 frames entre des clips. fileciteturn0file0L157-L177

L'agent ne doit cependant pas créer des gaps arbitraires.

Chaque gap doit avoir une raison :

respiration narrative ;

silence volontaire ;

espace pour une transition ;

attente avant apparition d'un élément ;

synchronisation avec la narration.

12. Transitions et effets

Important :

OTIO doit d'abord servir à construire une structure de montage fiable.

Ne pas complexifier prématurément la génération avec des effets difficiles à représenter ou dépendants spécifiquement de Kdenlive.

Règle d'or du workflow en 2 phases :
1. Phase 1 (Squelette OTIO) : On termine et on valide 100% de la structure de montage dans le fichier `.otio` (timing, sélection des plans, synchronisation voix/musique/SFX, cartes de chapitres et repères). On ne touche pas aux courbes de volume ni aux filtres vidéo car Kdenlive ne les sérialise pas dans l'OTIO.
2. Phase 2 (Finition .kdenlive) : Une fois la structure validée, le projet est enregistré au format natif `.kdenlive`. C'est sur ce fichier XML MLT que l'agent et l'utilisateur appliquent les transitions travaillées (rewind glitch, dips), les animations vidéo (Slow Push-In / Ken Burns 100% -> 105%) et le mixage audio (ducking musique sous la voix), sans aucun risque de perte.

Priorité :

timing ;
sélection des plans ;
synchronisation ;
structure des pistes ;
cohérence narrative ;
transitions simples ;
effets ;
finition.

13. Annotations / décisions à revoir

L'agent doit pouvoir produire une liste de points nécessitant éventuellement une validation humaine.

Exemple :

REVIEW REQUIRED

[00:14.2]
Clip choisi : bitcoin_ring.mp4
Raison : meilleure correspondance sémantique.
Alternative : bitcoin_scale.mp4

[01:32.8]
Transition recommandée : cut
Confiance : moyenne

[03:14.5]
Asset manquant pour illustrer une citation.

Cela permet à l'utilisateur de se concentrer sur les vrais choix éditoriaux.

14. Contrôle qualité automatique

Avant de fournir episode.otio, l'agent doit effectuer une validation.

Vérification des fichiers

✓ tous les fichiers existent
✓ chemins accessibles
✓ extensions compatibles
✓ médias non manquants

Vérification temporelle

✓ pas de clip avec durée négative
✓ pas de source_range invalide
✓ pas de timeline incohérente
✓ voice-over correctement placé
✓ durée globale cohérente

Vérification des FPS

L'agent doit détecter les différences de fréquence d'image entre sources.

Exemple réel :

timeline : 30 fps
certaines sources : 30 fps
une source : 24 fps

Un fichier OTIO Kdenlive montre effectivement qu'un clip peut avoir une cadence de source différente de celle de la timeline : un média one_coin_video.mp4 apparaît avec une disponibilité à 24 fps alors que la piste est à 30 fps. fileciteturn0file0L224-L265

Cela ne doit donc pas être considéré automatiquement comme une erreur, mais doit être détecté et traité consciemment.

15. Architecture recommandée

                    ┌──────────────────┐
                    │      SCRIPT      │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │  Voice-over /    │
                    │  transcription   │
                    └────────┬─────────┘
                             │
                             ▼
                 ┌──────────────────────┐
                 │ Narrative Analyzer   │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │  Asset Analyzer      │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │ Editorial Planner    │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │ Timeline Planner     │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │   OTIO Generator     │
                 └──────────┬───────────┘
                            │
                            ▼
                       episode.otio
                            │
                            ▼
                        Kdenlive
                            │
                            ▼
                 Human Review / Editing

16. Principe Human-in-the-loop

Le système n'a pas pour objectif de supprimer l'utilisateur du processus.

Il doit supprimer le travail répétitif.

Le modèle cible est :

Machine :
80–95 % du travail mécanique

Humain :
5–20 % du travail créatif / validation

Les pourcentages sont des objectifs de conception, pas des garanties.

La réussite du système se mesure surtout à :

Combien de temps l'utilisateur doit-il passer dans Kdenlive avant de considérer le montage comme terminé ?

L'objectif est de minimiser ce temps.

17. Boucle d'amélioration

Le système doit apprendre des corrections humaines.

Exemple :

Agent choisit :
Clip A

Utilisateur remplace :
Clip A → Clip B

Cette correction peut devenir une information utile :

Pour ce type de narration :
Clip B > Clip A

À terme, l'agent peut donc apprendre les préférences de montage de l'utilisateur :

durée moyenne des plans ;

densité visuelle ;

préférence pour les cuts ;

préférence pour certaines transitions ;

style des graphiques ;

rythme ;

types de plans favoris ;

tolérance aux répétitions ;

structure des pistes.

18. Le rôle exact de Kdenlive

Kdenlive n'est pas le moteur de décision.

Il sert principalement de :

éditeur vidéo final
+
interface de contrôle humain
+
outil de finition
+
outil d'export

Le cerveau du système est l'agent local.

Le flux voulu est :

Agent local
    ↓
construit le montage
    ↓
OTIO
    ↓
Kdenlive
    ↓
l'utilisateur vérifie
    ↓
quelques corrections
    ↓
validation
    ↓
export final

19. Ce que l'agent NE doit PAS faire

Ne pas concevoir le système comme :

Agent
→ ouvre Kdenlive
→ clique partout
→ cherche les boutons
→ place les clips avec souris
→ construit la timeline via GUI

Cette approche est fragile, difficile à maintenir et inutilement dépendante de l'interface graphique.

Le système doit privilégier une génération déclarative :

"Voici la timeline que je veux."

plutôt que :

"Voici les clics que je veux effectuer."

20. Format de sortie

Chaque épisode doit idéalement produire :

episode/
├── script/
│   └── script.md
│
├── tts/
│   └── voiceover.mp3
│
├── assets/
│   ├── footage/
│   ├── graphics/
│   ├── images/
│   ├── music/
│   └── sfx/
│
├── planning/
│   ├── narrative.json
│   ├── asset_catalog.json
│   └── edit_plan.json
│
├── timeline/
│   └── episode.otio
│
└── reports/
    ├── validation.json
    └── review.md

21. Critère de réussite

Le projet est réussi lorsque l'utilisateur peut faire :

1. Lancer l'agent
2. Attendre la génération
3. Importer / ouvrir la timeline dans Kdenlive
4. Regarder le montage
5. Faire quelques corrections
6. Valider

et non :

1. Lancer l'agent
2. Ouvrir Kdenlive
3. Découvrir que rien n'est réellement monté
4. Faire tout le montage soi-même

La distinction est fondamentale.

22. Philosophie générale

Le système doit être pensé comme un monteur vidéo IA spécialisé dans le style du créateur.

Pas comme :

un script qui génère un fichier OTIO.

OTIO n'est que le format de transport de la décision de montage.

La vraie chaîne de valeur est :

Comprendre la narration
        ↓
Comprendre les assets
        ↓
Prendre des décisions de montage
        ↓
Construire une timeline cohérente
        ↓
La transmettre à Kdenlive
        ↓
Laisser l'humain effectuer la finition

L'objectif final est de transformer Kdenlive d'un outil dans lequel l'utilisateur construit le montage en un outil dans lequel l'utilisateur révise et finalise un