# 🔨 Composant : Forensic Tunnel Drilling & Breach (Perforation Souterraine 2.5D/3D)

Ce composant génère un **plan dramatique d'action souterraine** montrant un braqueur/ouvrier en silhouette perforant le plafond de béton d'un tunnel vers une chambre forte, avec éclairage de chantier, grille cyan holographique, débris en chute libre et secousses caméra synchronisées.

---

## 🎯 Quand l'utiliser ?

* 🔹 Point culminant d'une infiltration souterraine (percement de la dalle du coffre-fort).
* 🔹 Illustration d'effraction technique (usage de marteau-piqueur, carotteuse, explosif).
* 🔹 Séquence de tension d'enquête avec radar médico-légal (*VAULT FOUNDATION*).
* 🔹 Plan d'impact rythmé par des effets sonores métalliques et chutes de pierres.

---

## 📸 Anatomie Visuelle du Plan

```
┌────────────────────────────────────────────────────────┐
│ 1. CADRE ÉCORCHÉ   : Bords de béton hachurés & règles  │
├────────────────────────────────────────────────────────┤
│ 2. HUD HOLOGRAPHIQUE : Grille cyan plafond + Radar mur │
├────────────────────────────────────────────────────────┤
│ 3. ACTION CENTRALE : Silhouette noire + Rim Light      │
│                      + Marteau-piqueur + Débris 3D     │
├────────────────────────────────────────────────────────┤
│ 4. CAMÉRA ANIMÉE   : Zoom avant lent + Micro-shake     │
│                      (vibrations calées frame par frame│
└────────────────────────────────────────────────────────┘
```

---

## 💻 Exécution Automatisée

Le script est exécutable en direct via Blender :

```bash
# Lancement direct dans Blender
.venv/bin/python scripts/generate_drilling_scene.py
```

Ou piloté par l'agent via MCP (`execute_blender_code`).

---

## 🔊 Sound Design Recommandé

* **Piste `A3_SFX_WHOOSH` / SFX** :
  * Déclenchement d'un son lourd de perforateur pneumatique / marteau-piqueur avec écho de cave à chaque cycle de vibration de caméra (toutes les 3 frames).
  * Chute de gravats et éclats de roche sur le sol (`_shared/sfx/debris/`).
* **Piste `A2_MUSIC_BED`** :
  * Nappe de tension ou drone grave continu sans percussions pour laisser le bruit du marteau rythmer la scène.
