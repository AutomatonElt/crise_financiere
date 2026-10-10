# Guide d'Animation Vidéo IA — Seedance (Image-to-Video)

Ce document fournit pour chaque plan **IMAGE IA → SEEDANCE** :
1. L'image de départ (*First Frame / Image Prompt*) déjà générée dans [`temp/Docs_science/Akashi/images/`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/images/)
2. Le **prompt de mouvement** optimisé pour Seedance / I2V
3. Les réglages de caméra (pan, tilt, zoom, vitesse), la durée et l'intensité de mouvement (*motion bucket / strength*).

---

## 1. Tableau des Plans à Animer dans Seedance

| Plan | Image Source (First Frame) | Durée | Mouvement Caméra | Prompt d'Animation Seedance (I2V) | Intensité Mouvement |
|---|---|---|---|---|---|
| **S002** | [`S002_kobe_nuit.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/images/S002_kobe_nuit.png) | 6.2 s | Push-in quasi imperceptible (2 %) | `Static wide establishing shot, barely perceptible slow smooth push-in zoom forward (2%), soft pre-dawn haze drifting between dark ceramic roofs, gentle twinkle of distant harbor crane lights, quiet cold night atmosphere.` | Faible (2-3/10) |
| **S006** | [`S006_tuiles.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/images/S006_tuiles.png) | 1.0 s | Plan serré fixe + secousse | `Macro close-up, sharp sudden high-frequency camera vibration, seismic tremor shiver, ceramic roof tiles slightly rattle and slide 2 cm out of alignment, dust puff, tense jolt.` | Moyen-Fort (6/10) |
| **S009** | [`S009_ferry_quai.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/images/S009_ferry_quai.png) | 1.0 s | Plan fixe + tangage léger | `Locked-off shot, heavy mooring ropes stretching taut under sudden tension, small micro-ripples and vibrations on water reflection, subtle hull creak pitch.` | Moyen (4/10) |
| **S010** | [`S010_lampe.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/images/S010_lampe.png) | 1.2 s | Plan fixe | `Single bare lightbulb violently swinging like a pendulum in an arc across wooden walls, light cone shifting fast, ending on a quick flicker and sudden blackout.` | Moyen-Fort (5/10) |
| **S023** | [`S023_ferry_traversee.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/images/S023_ferry_traversee.png) | 3.0 s | Léger travelling latéral | `Smooth slow tracking shot alongside ferry, gentle natural ocean swell, ship moving forward through water with foamy wake rippling behind, peaceful morning air.` | Faible-Moyen (3/10) |
| **S025** | [`S025_ferry_brume.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/images/S025_ferry_brume.png) | 5.9 s | Caméra fixe | `Extremely slow forward drift of 1950s ferry emerging through thick sea fog, heavy mist rolling past the lens, bow lights glowing softly through vapor, haunting slow pace.` | Très faible (2/10) |
| **S041** | [`S041_maisons_lumieres.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/images/S041_maisons_lumieres.png) | 8.0 s | Plan fixe | `Static shot of Kobe hillside at night, remaining warm window lights clicking off one by one plunging the neighborhood into deep darkness, faint thin dust haze rising between rooftops.` | Faible (2-3/10) |
| **S043** | [`S043_ingenieurs_dos.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/images/S043_ingenieurs_dos.png) | 6.0 s | Push-in très lent | `Subtle slow cinematic push-in toward the three engineers seen from behind, wind lightly rustling their jackets, sea mist slowly drifting across the strait, static contemplative posture.` | Faible (2/10) |
| **S046** | [`S046_faille_surface.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/images/S046_faille_surface.png) | 7.0 s | Survol / Travelling avant lent | `Slow smooth aerial drone forward glide over the farmland and ruptured road, gentle parallax over the fault line step, morning side shadows shifting slightly, realistic documentary aerial footage.` | Faible (3/10) |
| **S049** | [`S049_theodolite.png`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/images/S049_theodolite.png) | 4.1 s | Léger travelling d'angle | `Subtle slider move around tripod, surveyor hand micro-adjusts optical dial on the theodolite, distant sea mist blowing over water, sharp optical focus on the brass dial.` | Faible (2/10) |

---

## 2. Technique Hybride : Blender ➔ Seedance (First & Last Frame Interpolation)

Pour les plans du pont où Blender fournit la géométrie exacte mais où un rendu photoréaliste complet de 10 secondes est trop lourd :
1. **Rendu Frame 1 dans Blender** (ex: début du survol de la tour).
2. **Rendu Frame N dans Blender** (ex: fin du survol).
3. **Seedance en mode « Start & End Frame »** : l'IA génère les 5 à 7 secondes intermédiaires avec une dynamique d'eau, de brume et de reflets atmosphériques naturels tout en respectant scrupuleusement la géométrie de départ et d'arrivée.
