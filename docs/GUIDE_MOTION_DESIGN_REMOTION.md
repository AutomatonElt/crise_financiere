# 🎬 Guide de Référence : Motion Design Remotion au Niveau After Effects

Ce guide formalise l'ensemble des règles, formules mathématiques et techniques de compositing pour reproduire la qualité visuelle, la fluidité et le punch d'**Adobe After Effects** directement dans **Remotion (React / TypeScript)**.

---

## 🧭 Table de Correspondance : After Effects ➔ Remotion

| Concept After Effects | Équivalent Remotion / React | Avantage Remotion |
|---|---|---|
| **Keyframes Bézier / Graph Editor** | `spring()` & `interpolate()` avec easing | Physique réelle, aucun tremblement, modifiable par code |
| **Track Matte (Masque d'écrêtage)** | `clip-path: polygon(...)` & `overflow: hidden` | Vectoriel pur, résolution infinie, réactif |
| **Null Object & Parenté (Parenting)** | Arborescence de balises `<div style={{ transform }}>` | Hiérarchie imbriquée naturelle |
| **Wiggle expression (`wiggle(freq, amp)`)** | Fonctions de bruit pseudo-aléatoire seedé | Reproductible à la frame près lors du rendu |
| **Adjustment Layer (Étalonnage/Flou)** | `backdrop-filter: blur(...)` & `mix-blend-mode` | Compositing CSS matériel direct |
| **Export ProRes 4444 Alpha** | CLI Remotion avec codec `prores` profile `4444` | Canal alpha transparent parfait pour Kdenlive |

---

## ⚡ Les 5 Règles d'Or du Motion Design Pro

### 1. La Physique des Ressorts (`spring`) au lieu du Linéaire

Ne jamais utiliser d'animation linéaire `interpolate(frame, [0, 20], [0, 1])` pour un mouvement d'entrée ou de sortie.

```tsx
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

const frame = useCurrentFrame();
const { fps } = useVideoConfig();

// 🎯 FORMULE 1 : Impact Sec & Nerveux (Titres, Cartes, Badges)
const snapEntrance = spring({
  frame,
  fps,
  config: {
    damping: 14,     // Freine vite sans rebond mou
    stiffness: 120,  // Accélération initiale explosive
    mass: 0.8,       // Sentiment de légèreté
  },
});

// 🎯 FORMULE 2 : Glissement Noble & Doux (Documents d'archives, photos)
const smoothGlide = spring({
  frame: frame - 5, // Décalage de 5 frames
  fps,
  config: {
    damping: 22,
    stiffness: 75,
    mass: 1.2,
  },
});

// 🎯 FORMULE 3 : Tampon Percutant avec Micro-Rebond (Status Stamp)
const stampImpact = spring({
  frame: frame - 8,
  fps,
  config: {
    damping: 9,      // Faible freinage pour générer 1 micro-rebond franc
    stiffness: 180,  // Écrasement brutal
    mass: 0.9,
  },
});
```

---

### 2. Le Masquage de Révélation (*Clip-Path Reveal*)

Dans After Effects, le texte ne change pas bêtement d'opacité : il sort d'une ligne invisible (fente de masque) :

```tsx
// Le texte monte depuis une découpe invisible
const translateY = interpolate(snapEntrance, [0, 1], [60, 0]);
const clipProgress = interpolate(snapEntrance, [0, 1], [100, 0]);

<div
  style={{
    overflow: "hidden",
    clipPath: `polygon(0 ${clipProgress}%, 100% ${clipProgress}%, 100% 100%, 0 100%)`,
    transform: `translateY(${translateY}px)`,
  }}
>
  <h1>CONFIDENTIAL MEMORANDUM</h1>
</div>
```

---

### 3. Le Décalage en Cascade (*Staggering*)

Pour qu'une scène paraisse vivante et sophistiquée, chaque élément doit avoir son propre top départ :

```tsx
const frame = useCurrentFrame();

// Chronologie d'une pièce à conviction (Evidence Card) :
const cardEntrance = spring({ frame: frame - 0, fps, config: { damping: 15, stiffness: 100 } });
const photoReveal  = spring({ frame: frame - 4, fps, config: { damping: 14, stiffness: 120 } });
const headerLine   = spring({ frame: frame - 8, fps, config: { damping: 16, stiffness: 90 } });
const badgeImpact  = spring({ frame: frame - 14, fps, config: { damping: 9, stiffness: 160 } });
```

---

### 4. Textures, Grain & Matière (*Le Look Cinéma*)

Pour éliminer l'aspect "synthétique / informatique" :
1. **Fond Sombre Bleu-Nuit** : Ne jamais utiliser du `#000000` plat. Privilégier `#070b14` ou `#0a0e17`.
2. **Vignettage Radial** :
   ```css
   background: radial-gradient(circle at center, transparent 40%, rgba(3, 5, 10, 0.75) 100%);
   ```
3. **Bordures Lumineuses Subtiles** :
   ```css
   border: 1px solid rgba(255, 255, 255, 0.08);
   box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.7), 0 0 15px rgba(56, 189, 248, 0.06);
   ```

---

### 5. Export Standardisé Apple ProRes 4444 (Alpha Transparent)

Pour générer des overlays transparents réutilisables dans Kdenlive sans fond noir :

```bash
npx remotion render \
  src/index.ts \
  MonComposantId \
  mon_overlay.mov \
  --codec=prores \
  --prores-profile=4444 \
  --pixel-format=yuva444p10le
```
