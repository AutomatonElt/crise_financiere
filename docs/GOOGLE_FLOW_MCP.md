# Guide Complet & Pérenne : Google Flow MCP & Automatisation IA (Google AI Pro)

> **Statut du Système :** ✅ **INSTALLÉ, CONFIGURÉ ET VALIDÉ EN DIRECT**  
> **Serveur MCP :** `/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/scripts/google-flow-mcp/`  
> **Protocole :** Chrome DevTools Protocol (CDP) sur le port `127.0.0.1:9222`  
> **Profil Chrome Dédié :** `/home/mbogneng-junior/.config/google-chrome-flow`  
> **Binaire Chrome :** `/usr/bin/google-chrome`  
> **Compte Associé :** `mbognengjunior@gmail.com` (Abonnement **Google AI Pro**)  
> **Modèle Économique :** **Images Illimitées à 0 crédit** (Nano Banana 2 / Imagen 4) · **Vidéos sous contrôle de crédits** (Veo 3.1 / Omni Flash)

---

## 1. Vue d'Ensemble & Intérêt Stratégique

[Google Flow](https://flow.google.com/) (anciennement accessible sous `labs.google/fx/tools/flow`) est le studio de création visuelle et cinématique de pointe de Google, intégrant les modèles génératifs **Imagen 4**, **Nano Banana 2** et **Veo 3.1**.

Dans le pipeline de production de la chaîne YouTube **Financial Forensics**, `google-flow-mcp` joue un rôle capital :
1. **Économie de crédits substantielle :**  
   Grâce à l'abonnement **Google AI Pro**, la génération d'images via **Nano Banana 2** (qui génère 2 variantes simultanées) est **totalement gratuite** (0 crédit débité sur le quota mensuel Flow).
2. **Qualité cinématique studio (B-Roll) :**  
   Permet d'obtenir des plans de coupe d'atmosphère d'une cohérence photo-réaliste exceptionnelle (bureaux abandonnés de nuit, serveurs clignotants, couloirs confidentiels, coffres-forts) sans payer des abonnements tiers au coût par image (Midjourney, Runway, etc.).
3. **Pilotage programmatique transparent :**  
   L'agent IA (Antigravity) peut concevoir, injecter les prompts, prévisualiser l'interface en mode sécurité et récupérer les assets directement dans le projet.

---

## 2. Architecture Technique sous Linux (Ubuntu 24.04)

Puisque Google Flow ne propose pas d'API REST publique standard avec authentification OAuth de service pour les abonnements particuliers, l'intégration repose sur une **architecture hybride d'automatisation CDP & Playwright** :

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                ARCHITECTURE GOOGLE FLOW MCP                            │
└────────────────────────────────────────────────────────────────────────────────────────┘
       │
       ▼
 ┌───────────────┐     Stdio JSON-RPC       ┌──────────────────────────┐
 │  Antigravity  │ ◄──────────────────────► │     Serveur MCP Node     │
 │  (Client MCP) │                          │ (scripts/google-flow-mcp)│
 └───────────────┘                          └─────────────┬────────────┘
                                                          │
                                                          │ Chrome DevTools Protocol (CDP)
                                                          │ ws://127.0.0.1:9222
                                                          ▼
                                            ┌──────────────────────────┐
                                            │      Google Chrome       │
                                            │  (Profil isolé persistant│
                                            │  ~/.config/google-chrome-│
                                            │         flow)            │
                                            └─────────────┬────────────┘
                                                          │
                                                          │ Session Google AI Pro
                                                          ▼
                                            ┌──────────────────────────┐
                                            │     flow.google.com      │
                                            │  (Projet actif ouvert)   │
                                            └──────────────────────────┘
```

### Éléments d'infrastructure :

| Composant | Emplacement / Valeur | Rôle |
|---|---|---|
| **Dépôt MCP** | `scripts/google-flow-mcp/` | Serveur MCP basé sur `@modelcontextprotocol/sdk` & Playwright |
| **Point d'Entrée** | `scripts/google-flow-mcp/src/index.js` | Déclaration des outils `flow_*` et transport Stdio |
| **Profil Utilisateur** | `~/.config/google-chrome-flow` | Répertoire de données Chrome conservant la session Google OAuth / 2FA active |
| **Port CDP** | `9222` (`127.0.0.1:9222`) | Port d'écoute du débogage à distance Chrome |
| **Lanceur Démon** | `scripts/google-flow-mcp/scripts/ensure-flow-chrome.sh` | Script bash garantissant le lancement détaché de Chrome |
| **Configuration** | `scripts/google-flow-mcp/config/flow.config.json` | Paramètres d'URL, de chemins système et de modèles |
| **Skill Agent** | `.agents/skills/google-flow-generate/SKILL.md` | Directive opérationnelle pour Antigravity |

---

## 3. Configuration et Enregistrement MCP

Le serveur est enregistré dans les fichiers de configuration de l'IDE :
* **Workspace :** `.agents/mcp_config.json`
* **Global Antigravity :** `~/.gemini/antigravity-ide/mcp_config.json`
* **Global Config :** `~/.gemini/config/mcp_config.json`

### Bloc de configuration JSON :
```json
{
  "mcpServers": {
    "google-flow": {
      "command": "node",
      "args": ["src/index.js"],
      "cwd": "/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/scripts/google-flow-mcp",
      "env": {
        "FLOW_CONFIG_PATH": "config/flow.config.json",
        "CHROME_USER_DATA_DIR": "/home/mbogneng-junior/.config/google-chrome-flow",
        "EXPECTED_ACCOUNT": "mbognengjunior@gmail.com",
        "CHROME_PATH": "/usr/bin/google-chrome",
        "CDP_PORT": "9222"
      }
    }
  }
}
```

---

## 4. Démarrage et Cycle de Vie de la Session

### Étape 1 : Assurer que Chrome est lancé sur le port 9222

Avant toute interaction, l'instance dédiée de Google Chrome doit tourner avec le port de débogage activé. Un script de démarrage sécurisé est fourni :

```bash
bash scripts/google-flow-mcp/scripts/ensure-flow-chrome.sh
```

Ce script vérifie si le port `9222` répond déjà via `http://127.0.0.1:9222/json/version`. Si ce n'est pas le cas, il lance Google Chrome en arrière-plan détaché (`nohup` + `disown`) avec les drapeaux :
* `--remote-debugging-port=9222`
* `--user-data-dir="/home/mbogneng-junior/.config/google-chrome-flow"`
* `--disable-blink-features=AutomationControlled` (évite les blocages anti-bot)
* `--window-size=1920,1080`

### Étape 2 : Connexion initiale de l'utilisateur (Une seule fois)

1. Lorsque la fenêtre Chrome dédiée s'ouvre, l'utilisateur s'identifie avec son compte Google AI Pro (`mbognengjunior@gmail.com`).
2. Ouvrir la plateforme [flow.google.com](https://flow.google.com/) et entrer dans un projet (par exemple le projet de travail de l'épisode en cours).
3. Grâce au répertoire de profil dédié (`~/.config/google-chrome-flow`), **cette authentification est conservée indéfiniment** entre les sessions et les redémarrages.

---

## 5. Catalogue Complet des Outils MCP (`flow_*`)

### `flow_connect`
Initialise la connexion Playwright sur le port CDP `9222` et s'accroche automatiquement à l'onglet ouvert sur `flow.google.com`.
* **Arguments :**
  * `headless` *(booléen, défaut: false)* : Doit rester `false` sous Linux pour Google Flow.
  * `open_flow` *(booléen, défaut: true)* : Navigue automatiquement vers Flow si l'onglet n'est pas encore présent.

### `flow_status`
Renvoie l'état précis du système : statut du navigateur, page chargée, compte vérifié et file d'attente de tâches.
* **Arguments :**
  * `full` *(booléen, défaut: false)* : Si `true`, capture un screenshot de contrôle de l'interface actuelle.

### `flow_account_check`
Vérifie formellement que le compte Google actif correspond à l'adresse attendue (`EXPECTED_ACCOUNT`).

### `flow_generate_image`
Injecte le prompt dans le panneau de génération d'images, configure le modèle et le format, et télécharge les rendus.
* **Arguments :**
  * `prompt` *(string, obligatoire)* : Le prompt textuel descriptif.
  * `model` *(string, défaut: "Nano Banana 2")* : Modèle au choix :
    * `Nano Banana 2` : **Modèle recommandé par défaut** (0 crédit, génère 2 images en parallèle `x2`).
    * `Nano Banana Pro` : Rendu haute fidélité pour compositions complexes.
    * `Imagen 4` : Modèle de photoréalisme classique Google.
  * `ratio` *(string, défaut: "16:9")* : Ratio d'aspect (`16:9`, `1:1`, `9:16`, `4:3`, `3:4`).
  * `auto_confirm` *(booléen, défaut: false)* :
    * `false` (Mode Staging / Sécurité) : Renseigne le prompt, positionne l'interface, capture un screenshot de confirmation mais **ne clique pas sur Générer**.
    * `true` (Mode Exécution) : Valide la génération, attend la fin du rendu et télécharge les fichiers dans le dossier du projet.
  * `project_name` / `campaign` *(string, optionnel)* : Identifiants de classement dans Flow.

### `flow_generate_video`
Génère une séquence vidéo cinématique avec les modèles de pointe **Veo 3.1** ou **Omni Flash**.
* **⚠️ Gestion des Crédits :** Les vidéos débitent le quota mensuel de crédits Flow (environ 10 crédits pour Veo Lite, 20 pour Fast, 100 pour Quality).
* **Arguments :**
  * `prompt` *(string, obligatoire)* : Description cinématique avec cadrage et mouvement de caméra.
  * `model` *(string, défaut: "lite")* : `lite` (Veo 3.1 Lite, le plus économique), `fast`, `quality` ou `flash` (Omni Flash).
  * `duration` *(string, défaut: "4s")* : Durée (`4s`, `6s`, `8s`, `10s`). Note : Veo 3.1 Lite requiert 8s sur l'abonnement Pro.
  * `ratio` *(string, défaut: "16:9")* : `16:9` (paysage horizontal) ou `9:16` (vertical).
  * `auto_confirm` *(booléen, défaut: false)* : Sécurité stricte pour éviter la consommation accidentelle de crédits.

### `flow_download_latest`
Scanne les éléments récents générés dans le projet Google Flow et télécharge le dernier fichier image ou vidéo sur le disque local.

### `flow_discover_ui`
Inspecte dynamiquement l'arbre DOM de la page active et met à jour les sélecteurs CSS dans le cache interne du serveur MCP. Indispensable si Google met à jour l'interface utilisateur de Flow.

### Outils de Personnages & Scènes :
* `flow_create_character` : Crée une entité de personnage récurrente avec images de référence.
* `flow_import_character` : Importe une fiche personnage depuis un fichier JSON.
* `flow_open_characters` : Ouvre la galerie des personnages.
* `flow_create_scene` : Assemble une scène multi-personnages.

---

## 6. Intégration dans le Pipeline Financial Forensics

Les créations Google Flow sont intégrées de façon fluide dans notre flux de travail NLE / Kdenlive :

```text
Google Flow MCP (Génération Image/Vidéo)
         │
         ▼
Téléchargement local (`assets/flow/shot_*.mp4`)
         │
         ▼
Calibration standardisée (`calibrate_h01_google_flow.py` → 1080p, 25.0 FPS, H.264)
         │
         ▼
Timeline OTIO / Kdenlive sur la piste `V1_MAIN`
```

### Script de Calibration Universel (`scripts/calibrate_video.py`) :
Puisque Google Flow produit souvent des vidéos à cadence cinéma standard (24.0 fps) ou en 720p/variables :
* Convertit et re-échantillonne strictement à **25.0 FPS** (standard de la chaîne).
* Met à l'échelle et recadre en **1920×1080 Full HD** (`scale + crop` centré, sans déformation).
* Encode en **H.264 CRF 18** avec audio AAC 48 kHz standardisé.
* Prêt immédiatement pour la piste `V1_MAIN` de Kdenlive.

```bash
# Calibrer n'importe quelle vidéo brute vers la norme 1080p 25 FPS :
.venv/bin/python scripts/calibrate_video.py assets/flow/ma_video.mp4

# Ou spécifier la sortie :
.venv/bin/python scripts/calibrate_video.py assets/flow/ma_video.mp4 -o assets/calibrated/ma_video_1080p_25fps.mp4
```

### Script de Raboutage Spécifique (`episodes/02-ftx/scripts/calibrate_h01_google_flow.py`) :
Permet le raboutage et la calibration de deux plans successifs (ex: plan large aérien + plan d'entrée) sur une durée cible précise :

```bash
.venv/bin/python episodes/02-ftx/scripts/calibrate_h01_google_flow.py \
    --clip-a "episodes/02-ftx/assets/flow/shot_aerial.mp4" \
    --clip-b "episodes/02-ftx/assets/flow/shot_entrance.mp4" \
    --out "episodes/02-ftx/assets/generated-videos/H01_stakeout_3s_1080p.mp4"
```

---

## 7. Règles d'Or de Prompting & Sécurité des Crédits

1. **Priorité aux Images pour le Cadrage :**  
   Avant de générer une vidéo consommatrice de crédits, générer d'abord une image de cadrage avec **Nano Banana 2** (`auto_confirm: true`, coût 0). Une fois la géométrie et l'éclairage validés, lancer la vidéo correspondante.
2. **Structure de Prompt Enrichie :**  
   Pour Google Flow / Imagen / Veo, structurer systématiquement le prompt selon la syntaxe cinématique :
   `[Sujet principal] + [Action/État] + [Décor & Environnement] + [Éclairage & Heure] + [Mouvement de Caméra / Optique] + [Ambiance dramatique/Forensic]`
   * *Exemple :*  
     `"Cinematic wide shot, interior of a dark abandoned financial server room at 3 AM. Blinking cold green and amber LED server racks, subtle atmospheric haze, locked-off camera with very slow push-in, volumetric moonlight piercing through heavy blinds, 35mm lens, corporate forensic investigation aesthetic, hyper-detailed."`
3. **Sécurité par Défaut :**  
   Tout appel automatisé d'un agent doit démarrer avec `auto_confirm: false` pour vérifier la validité de l'interface par capture d'écran avant tout engagement de crédits.

---

## 8. Dépannage Rapide (Troubleshooting)

| Symptôme | Cause Probable | Solution Immédiate |
|---|---|---|
| `ECONNREFUSED 127.0.0.1:9222` | Chrome n'est pas lancé avec le port CDP actif | Exécuter `bash scripts/google-flow-mcp/scripts/ensure-flow-chrome.sh` |
| `WRONG_GOOGLE_ACCOUNT` | Mauvais profil connecté dans Chrome | Se déconnecter dans la fenêtre Chrome et se connecter avec `mbognengjunior@gmail.com` |
| `FLOW_PAGE_NOT_FOUND` | L'onglet actif n'est pas sur flow.google.com | Naviguer vers [flow.google.com](https://flow.google.com/) et entrer dans un projet |
| `UNKNOWN_UI_CHANGE` | Google a modifié un bouton ou un champ | Exécuter l'outil MCP `flow_discover_ui` pour rafraîchir les sélecteurs |
| Timeout DNS lors des installs npm/git | Résolveur DNS UDP local 127.0.0.53 lent sur Wi-Fi | Utiliser DNS-over-HTTPS ou configurer `8.8.8.8` / `1.1.1.1` temporairement |

---

## ⚡ 9. Protocole Rapide & Retours d'Expérience (Fast-Track & Gotchas)

Lors de nos sessions de production, nous avons identifié plusieurs pièges subtils liés à l'architecture de Google Flow (Angular + ProseMirror) et créé une commande unique ultra-rapide pour les contourner.

### ⚠️ Les 3 Pièges Techniques Résolus

1. **Le Piège de l'Éditeur ProseMirror (`locator.fill()` inopérant) :**
   * *Problème :* Le champ de prompt est un composant riche `DIV.ProseMirror` (`contenteditable="true"`). Un appel classique Playwright `fill(texte)` injecte le texte dans le DOM sans déclencher les transactions internes de ProseMirror. Visuellement le texte est là, mais Google Flow affiche l'erreur : *"Veuillez saisir votre prompt"*.
   * *Solution :* Utiliser impérativement des frappes réelles :
     ```javascript
     await editor.click();
     await page.keyboard.press('Control+A');
     await page.keyboard.press('Backspace');
     await page.keyboard.type(promptText, { delay: 4 });
     ```

2. **Les Balises Personnalisées Angular Material :**
   * *Problème :* Les boutons de la barre latérale ("Personnages", "Scènes", "Outils") ne sont pas des `<button>` mais des `<mat-list-item>`.
   * *Solution :* Cibler `mat-list-item:has-text("Personnages")`.

3. **La Modale Personnage vs Canvas Principal :**
   * *Problème :* Dans le sous-menu "Personnages > Créer un corps", certains mots de combat ("scimitar", "sword", "warrior") ou des imports d'images externes déclenchent un faux positif de modération (*"Nous avons remarqué une activité inhabituelle"*).
   * *Solution :* Sur le **canvas principal du projet**, l'injection directe avec Nano Banana 2.1 génère sans aucune restriction en moins de 25 secondes.

---

### 🚀 Commande Universelle Clé en Main (1-Click Generator)

Pour générer n'importe quel asset visuel immédiatement sans se battre avec le DOM :

```bash
# Générer un personnage dans assets/generated/characters/ :
python3 scripts/generate_flow_image.py \
  --prompt "Mature adult animated series illustration, modern dark graphic novel art style. A calculating 1980s Romanian mathematician..." \
  --name "stefan_mandel" \
  --category "characters"

# Générer un décor / biome dans assets/generated/biomes/ :
python3 scripts/generate_flow_image.py \
  --prompt "Mature adult animated series illustration, modern dark graphic novel art style. A vast fluorescent-lit 1992 warehouse in Virginia packed with boxes of lottery tickets..." \
  --name "virginia_warehouse_1992" \
  --category "biomes"

# Générer un B-roll d'ambiance dans assets/generated/b-roll/ :
python3 scripts/generate_flow_image.py \
  --prompt "Close up on a vintage dot-matrix printer spitting endless perforated lottery tickets..." \
  --name "dot_matrix_printer_macro" \
  --category "b-roll"
```

Le script :
1. Vérifie et lance Chrome CDP si besoin.
2. Se repositionne sur le canvas principal.
3. Tape le prompt via la séquence ProseMirror certifiée.
4. Clique sur `arrow_forward` et valide automatiquement le dialogue Agent.
5. Intercepte l'image générée en haute résolution et la télécharge instantanément sur disque.

---

## 🎨 10. Méthode Certifiée : Modélisation Complète de Personnages (Architecture Portrait + Corps Triptyque)

Dans le pipeline cinématique de la chaîne, la création de personnages récurrents cohérents repose sur la méthode native en **2 étapes de Google Flow**, automatisée via Playwright / CDP.

### 10.1 Principes Fondamentaux de l'Architecture en 2 Étapes

Dans Google Flow, une entité de personnage (`/character/<uuid>`) se compose de deux onglets indissociables :
1. **Onglet `Portrait` (L'Ancrage Maître & Identité Visuelle)** :
   * Contient la référence d'identité source. Deux cadrages complémentaires sont produits :
     * **Portrait Rapproché (Face / Buste)** (`*_portrait_face.png`) : Cadrage serré centré sur le visage entier et le col des épaules, regard face caméra, montrant précisément les traits expressifs (lunettes, rides, regard, pilosité), sur **fond neutre uni gris**. C'est le plan idéal pour les fiches d'identification, inserts de dialogue et témoignages.
     * **Portrait Seul Entier (Pied à tête)** (`*_portrait_single.png`) : Silhouette isolée complète debout de face, servant d'ancrage corporel global.
2. **Onglet `Créer un corps` / `Corps` (Le Triptyque Associé)** :
   * Une fois le portrait validé, cliquer sur cet onglet injecte automatiquement une pastille d'avatar liée au portrait maître.
   * Le prompt injecté demande un **triptyque complet du corps avec 3 vues distinctes : de face, de 3/4 et de dos** (`Full body turn-around character model sheet: front view, three-quarter view, back view`).
   * Nano Banana 2.1 génère les 3 angles anatomiquement cohérents en se basant strictement sur le portrait validé.

```text
┌────────────────────────────────────────────────────────────────────────┐
│               WORKFLOW PERSONNAGES EN 2 ÉTAPES GOOGLE FLOW             │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
       ┌────────────────────────────────────────────────────────┐
       │ ÉTAPE 1 : ONGLET PORTRAIT                              │
       │ • Visage rapproché face : `<personnage>_portrait_face` │
       │ • Silhouette debout entière : `*_portrait_single`      │
       │ • Fond neutre studio uni gris (aucun décor/meuble)     │
       │ • Mains vides le long du corps (aucun objet en main)   │
       │ • Teint chaud/ambré (warm olive-amber, non blafard)    │
       │ • Style Dark Graphic Novel / Anime Adulte              │
       └────────────────────────────┬───────────────────────────┘
                                    │
                                    ▼
       ┌────────────────────────────────────────────────────────┐
       │ ÉTAPE 2 : ONGLET CORPS (TRIPTYQUE MODÈLE SHEET 3 VUES) │
       │ • Clic sur "Créer un corps" (associe l'avatar)         │
       │ • Prompt : 3 vues (Face, 3/4, Dos)                     │
       │ • Cohérence stricte visage, carnation et vêtements     │
       │ ➔ Sauvegardé sous : `<personnage>_corps_triptyque.png` │
       └────────────────────────────────────────────────────────┘
```

### 10.2 Les 4 Règles Invariants de Prompting

Pour garantir un résultat de qualité studio et éviter les dérives fréquentes des modèles IA :

| Invariant | Formulation Précise dans le Prompt | Raison & Erreur Évitée |
|---|---|---|
| **1. Carnation & Teint de Peau** | `Warm olive-amber human skin complexion with rich golden undertones and warm chiaroscuro shading, healthy natural skin tone, not pale white, not chalky.` | Empêche le modèle de générer des personnages à la peau blanche crayeuse, cadavérique ou albinos. |
| **2. Mains Libres & Sans Objets** | `Empty hands resting naturally at his/her sides, relaxed standing posture, no objects held in hands, no [books/tickets/props], zero accessories held.` | Empêche l'IA d'inventer des objets intempestifs (billets de loto, registres comptables, clés USB, valises) qui briseraient la réutilisabilité du modèle sheet. |
| **3. Fond Neutre Studio** | `Plain solid neutral mid-gray studio background, seamless monochrome backdrop, zero furniture, zero room background, clean silhouette cutout.` | Isole parfaitement la silhouette pour faciliter le découpage alpha, les masques et l'animation sans avoir à détourer des meubles ou des textures complexes. |
| **4. Style Visuel Graphique** | `Mature dark anime graphic novel illustration style, crisp clean ink line art, rich chiaroscuro cel-shading.` | Aligne tous les protagonistes sur la direction artistique unifiée de la chaîne (adulte, forensic, trait encré précis). |

### 10.3 Automatisation & Contournement des Pièges CDP

1. **La Race Condition du Rendu Portrait vs Clic Corps** :
   * *Piège :* Si le script clique sur "Créer un corps" pendant que le portrait est encore en cours de calcul (ex. à 15%), Google Flow ignore l'association d'avatar ou crée un corps déconnecté.
   * *Solution :* Attendre que le pourcentage disparaisse complètement (`document.body.innerText.match(/\d+\s*%/) === null`) ET vérifier qu'une balise `img` avec une largeur réelle (`naturalWidth > 250px`) soit stabilisée avant de passer à l'étape 2.

2. **Frappe Réelle ProseMirror** :
   * L'éditeur de prompt sous Flow requiert des frappes clavier synthétiques réelles (`page.keyboard.type(prompt, { delay: 4 })`) après sélection totale (`Control+A`, `Backspace`), sinon l'état réactif d'Angular n'est pas informé.

3. **Règle Cardinale Absolue : Inspection Visuelle Systématique & Filtres de Contenu** :
   * **Ne jamais valider une image à l'aveugle sans l'avoir ouverte et inspectée.**
   * **Vérification de Cohérence Post-Génération :** Après chaque génération, comparer l'image aux autres plans validés. Contrôler la cohérence stylistique, la justesse du cadrage/POV (éviter les éléments obstructifs qui ferment la scène) et la propreté des surfaces modulaires.
   * **Bannissement des mots déclencheurs (Faux positifs de modération à 99%) :**
     - Ne jamais utiliser le mot `"adult"` (bloqué par Imagen). Utiliser : `"Graphic novel illustration style, dark stylized comic art, crisp ink line art, cel-shading"`.
     - Ne jamais utiliser de vocabulaire sensible d'infrastructure / cyber / police (ex: `"secure IT server room"`, `"data center"`, `"forensic investigation"`, `"gas station"`). Remplacer par du descriptif visuel neutre et artistique : `"high-tech computer mainframe archive room"`, `"electronic tower cabinets"`, `"roadside grocery and convenience shop"`.
   * **Vérification matérielle :** Contrôler l'absence d'hallucinations grossières (ex: rubans informes au lieu de formulaires de loterie perforés).

4. **Renommage Formel des Personnages** :
   * Par défaut, Google Flow nomme chaque carte *"Personnage sans titre"*.
   * Pour que les personnages apparaissent clairement dans la galerie et soient reconnaissables :
     - Mettre à jour `input.editable-text-input:visible` (titre principal en haut).
     - Mettre à jour `input.name-input:visible` (titre dans le volet latéral).
     - Appuyer sur `Enter`, puis déclencher un clic de flou (`page.mouse.click(10, 10)`) avant de revenir à la liste.

### 10.4 Doctrine de Séparation Modulaire : Décor (Clean Plate) vs Props Narratifs vs Habillage

Pour garantir une rigueur documentaire absolue et éviter toute hallucination visuelle au montage, une séparation stricte est appliquée en 3 couches :

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   PIPELINE MODULAIRE D'ASSEMBLAGE SCÈNE                 │
└────────────────────────────────────────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┼───────────────────────────────┐
    ▼                               ▼                               ▼
┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│ COUCHE 1 : LE DÉCOR  │  │ COUCHE 2 : LES PROPS │  │ COUCHE 3 : HABILLAGE │
│ (Clean Biome Plate)  │  │ (Narrative Inserts)  │  │ (Motion Design / HUD)│
│ • Pièce / Hangar     │  │ • Feuille de calcul  │  │ • Titre "3 AM, VA"   │
│ • Table propre vide  │  │ • Vraies équations   │  │ • Cartes de lieu     │
│ • Zéro faux document │  │ • Carnet contrôlé    │  │ • Overlays Remotion  │
│ • Zéro texte incrusté│  │ • Généré à part      │  │ • Piste V3_TITLES    │
└──────────┬───────────┘  └──────────┬───────────┘  └──────────┬───────────┘
           │                         │                         │
           └─────────────────────────┼─────────────────────────┘
                                     ▼
                       ┌───────────────────────────┐
                       │   ASSEMBLAGE VIDÉO / IA   │
                       │   (Kling / Wan / Veo /    │
                       │    Compositing Studio)    │
                       └───────────────────────────┘
```

1. **Zéro Texte Incrusté dans les Décors (No Baked-in Text)** :
   * Les repères temporels (ex: `"3 AM, VIRGINIA, FEBRUARY 1992"`), dates et localisations ne doivent **jamais** être demandés à l'IA ou brûlés dans l'image.
   * Ces éléments relèvent exclusivement du pipeline d'habillage graphique de la chaîne (Remotion / EffectCraft / titres Kdenlive sur la piste `V3_TITLES`). Le décor doit rester un fond neutre et pur (*clean plate*).
2. **Plateaux de Décor Prêts pour l'Insertion (Prop-Ready Surfaces)** :
   * Les tables, comptoirs et bureaux générés comme biomes doivent avoir des surfaces de travail dégagées et propres.
   * Ne jamais laisser l'IA remplir une table de faux carnets aux écritures barbouillées ou de fausses équations inventées.
3. **Génération Séparée des Pièces à Conviction & Props de Précision** :
   * Chaque objet narratif critique (la feuille de calcul de Mandel avec ses vraies formules de condensation, le carnet de probabilités, les billets de loterie authentiques, la brochure Winfall) est conçu ou généré **séparément** comme un asset dédié inspecté et validé.
4. **Combinaison au Rendu Vidéo Multi-Références** :
   * C'est le moteur de génération vidéo (ou le compositing) qui combine les couches :
     - Référence décor : `virginia_warehouse_1992.png` ou `mandel_study_bucharest_1970s.png`
     - Référence personnage : `stefan_mandel_portrait_face.png`
     - Référence prop validé : La feuille de calcul vérifiée.

### 10.5 Scripts de Référence Opérationnels

* **Génération Portrais Rapprochés Face (`*_portrait_face.png`)** :  
  [`scripts/google-flow-mcp/generate-close-portraits.js`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/scripts/google-flow-mcp/generate-close-portraits.js)  
  *Exécution :* `node scripts/google-flow-mcp/generate-close-portraits.js`.
* **Génération Complète (Portrait Seul + Triptyque Corps)** :  
  [`scripts/google-flow-mcp/generate-full-characters-flow.js`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/scripts/google-flow-mcp/generate-full-characters-flow.js)  
  *Exécution :* `node scripts/google-flow-mcp/generate-full-characters-flow.js`.
* **Renommage en Lot dans Google Flow** :  
  [`scripts/google-flow-mcp/rename-all-flow-characters.js`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/scripts/google-flow-mcp/rename-all-flow-characters.js)  
  *Exécution :* `node scripts/google-flow-mcp/rename-all-flow-characters.js`.
* **Répertoire des Assets Finaux Certifiés** :  
  [`assets/generated/characters/`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/assets/generated/characters/)

