# Guide Complet : Cavalry sur Ubuntu & Pilotage MCP (Motion Design 2D)

> **Statut de l'installation :** ✅ **INSTALLÉ & OPÉRATIONNEL SUR UBUNTU 24.04**  
> **Exécutable :** `~/.local/bin/cavalry`  
> **Prefix Wine :** `~/.cavalry`  
> **Serveur MCP embarqué :** `http://localhost:6768/sse`

---

## 1. Présentation & Rôle dans le Pipeline

[Cavalry](https://cavalry.studio/) est le logiciel de référence pour le **Motion Design 2D procédural** (équivalent moderne d'After Effects couplé à la logique nodale d'Houdini). 

Dans la chaîne YouTube (*The Ledger*), Cavalry vient compléter la stack :
1. **Remotion** (`financial-forensics/`) : Motion design programmatique React / TypeScript pour les scènes basées sur des données précises (timelines, zooms graphiques, dossiers secrets).
2. **Blender 3D** : Coupes schématiques médico-légales (Forensic Cross-Sections), dioramas 3D, scènes volumétriques et blueprints.
3. **Cavalry 2D** : Animation 2D procédurale pure (ondes, particules, flux financiers, duplicators, typographie animée dynamique, visualisations vectorielles complexes).

---

## 2. Architecture Technique sur Linux (Ubuntu 24.04)

Puisque Cavalry est officiellement conçu pour Windows et macOS, son exécution sur Ubuntu repose sur une architecture Wine optimisée :

| Composant | Emplacement / Valeur | Rôle |
|---|---|---|
| **Moteur Wine** | `/usr/bin/wine` (Wine 9.0 64-bit) | Couche de compatibilité Windows |
| **Prefix dédié** | `/home/mbogneng-junior/.cavalry` | Environnement Windows isolé |
| **Binaire Cavalry** | `~/.cavalry/drive_c/Program Files/Cavalry/Cavalry.exe` | Cavalry 2.8+ officiel |
| **Lanceur CLI** | `/home/mbogneng-junior/.local/bin/cavalry` | Script wrapper avec variables d'environnement |
| **Raccourci Bureau** | `~/.local/share/applications/Cavalry.desktop` | Intégration dans le menu des applications Ubuntu |
| **Gestionnaire URL** | `~/.local/share/applications/cavalry-handler.desktop` | Protocole `cavalry://` pour la connexion SSO Canva |
| **Moteur Graphique** | `MESA_GL_VERSION_OVERRIDE=4.5` (OpenGL 4.5 Core) | Accélération matérielle du Viewport |

### Optimisations Appliquées :
- **Winetricks** : Composants `dxvk`, `corefonts` (polices lissées) et `fontsmooth=rgb`.
- **Pilote Graphique Wine** : Forcé en `x11,wayland` (`HKCU\Software\Wine\Drivers`) pour éviter les blocages de fenêtres transparentes sous Wayland/NVIDIA.
- **IPC Répertoire de travail** : Le lanceur effectue un `cd` dans le dossier de Cavalry avant lancement afin que les appels du navigateur (`cavalry://auth/callback`) communiquent correctement avec l'instance en cours d'exécution.

---

## 3. Lancement et Première Connexion (SSO Canva)

### Étape 1 : Lancer Cavalry
Vous pouvez lancer Cavalry de deux manières :
* **En ligne de commande :** tapez simplement `cavalry` dans n'importe quel terminal.
* **Via l'interface :** cliquez sur l'icône **Cavalry** dans la liste de vos applications Ubuntu.

### Étape 2 : Connexion Canva (Gratuit / Pro)
1. Au premier démarrage, Cavalry ouvre une fenêtre demandant la connexion.
2. Cliquez sur **Sign in with Canva**.
3. Votre navigateur web par défaut s'ouvre sur la page d'authentification Canva.
4. Une fois validé, Canva redirige vers le lien `cavalry://auth/...` qui est automatiquement intercepté par le protocole handler Linux et transmis à Cavalry.
5. Cavalry se débloque immédiatement avec votre compte.

---

## 4. Architecture MCP Native (Model Context Protocol)

Cavalry 2.8 intègre **nativement** un serveur MCP permettant aux agents IA (comme Antigravity) de piloter le logiciel en direct sans passer par des clics souris.

### Spécifications du Serveur MCP Cavalry :
* **Protocole :** Server-Sent Events (SSE) + JSON-RPC HTTP
* **Port par défaut :** `localhost:6768` (démarrage automatique)
* **Endpoints :**
  * `GET http://localhost:6768/sse` (flux d'événements MCP)
  * `POST http://localhost:6768/message` (envoi des commandes JSON-RPC)

### Outils exposés par le serveur MCP de Cavalry :
* `execute_script` : Exécute du code JavaScript dans le moteur V8 de Cavalry pour manipuler les calques, attributs, connexions et rendus.
* `search_docs` & `read_doc` : Recherche et consultation de la documentation interne de Cavalry (SDK, Shaders, Behaviours).
* `search_layer_types` & `get_layer_definition` : Analyse de l'arbre des calques disponibles (`basicShape`, `textShape`, `duplicator`, etc.).
* `search_api` & `get_api_function` : Inspection des fonctions de l'API JavaScript (`api.create`, `api.set`, `api.connect`, etc.).
* `preflight_script` : Validation de syntaxe JavaScript avant exécution.
* `snapshot_layer` : Capture visuelle de l'état d'un calque.
* `save_script_to_library` : Sauvegarde d'un script d'automatisation dans la bibliothèque utilisateur.

---

## 5. Intégration dans Antigravity (`mcp_config.json`)

Pour permettre à Antigravity de communiquer avec Cavalry dès qu'il est ouvert, la configuration MCP dans `/home/mbogneng-junior/.gemini/antigravity-ide/mcp_config.json` s'appuie sur `mcp-remote` :

```json
{
  "mcpServers": {
    "cavalry": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "http://localhost:6768/sse"
      ]
    }
  }
}
```

> **Note :** Le serveur MCP de Cavalry s'active lorsque l'application est lancée et authentifiée sur votre session utilisateur.

---

## 6. Bonnes Pratiques de Scripting Procédural (Cavalry JS)

Quand l'agent pilote Cavalry via `execute_script`, il respecte les principes fondamentaux de la philosophie nodale de Cavalry :

1. **Règle du Duplicator (Pas de boucles de création) :**  
   Ne jamais créer $N$ calques via une boucle `for`. On crée **un seul `duplicator`** avec la distribution voulue (Grid, Circle, Path, etc.) et on lui connecte des **Behaviours** (`noise`, `step`, `oscillator`) pour faire varier dynamiquement les copies.

2. **Primitives avec formes :**  
   Utiliser `api.primitive("rectangle")`, `api.primitive("ellipse")`, `api.primitive("ring")` plutôt que les générateurs nus (`ringShape`) afin de bénéficier immédiatement des attributs de matière, fond, contour et modes de fusion.

3. **Exemple de création de titre animé via script :**
```javascript
// Création d'un texte cinématique centré
const titleId = api.create("textShape", "Titre_Ledger");
api.set(titleId, {
    text: "THE LEDGER",
    fontSize: 90,
    horizontalAlignment: 1, // Centre
    position: [0, 0]
});

// Ajout d'un oscillateur sur l'opacité (pulsation sans keyframe)
const oscId = api.create("oscillator", "Pulse_Anim");
api.set(oscId, { min: 40, max: 100, frequency: 1.5 });
api.connect(oscId, "output", titleId, "opacity");
```

---

## 7. Dépannage Rapide

| Problème | Cause | Solution |
|---|---|---|
| **Fenêtre noire ou Viewport non affiché** | Profil OpenGL non reconnu par Mesa | Vérifier que `MESA_GL_VERSION_OVERRIDE=4.5` est actif (déjà configuré dans `~/.local/bin/cavalry`). |
| **Connexion Canva ne s'active pas** | Le navigateur n'ouvre pas le lien `cavalry://` | Vérifier que `cavalry-handler.desktop` est bien défini : `xdg-settings set default-url-scheme-handler cavalry cavalry-handler.desktop`. |
| **Erreur HTTP 401 sur `/sse`** | Session Cavalry non connectée | Lancer Cavalry et se connecter à son compte Canva pour activer les permissions du serveur MCP. |
| **Tracé des câbles nouilles (Node noodles) figé** | Spécificité Wine sur le drag & drop | Travailler via le panneau des attributs ou compiler le patch Wine si nécessaire (`install.sh --build-wine`). |
