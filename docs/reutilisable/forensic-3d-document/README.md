# 🎥 Composant Réutilisable : Document 3D & Caméra Virtuelle (Forensic3DDocument)

Moteur de rendu 3D procédural cinématique utilisant **Three.js**, **React Three Fiber** et **Remotion** pour donner vie aux documents d'archives, articles de presse, contrats judiciaires et exhibits.

---

## 📍 Chemins des Fichiers Clés

| Rôle | Chemin Absolu |
|---|---|
| **Script CLI de génération** | [`scripts/generate_3d_document.py`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/scripts/generate_3d_document.py) |
| **Composant Three.js / React** | [`financial-forensics/src/compositions/Forensic3DDocument/Forensic3DDocumentScene.tsx`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/financial-forensics/src/compositions/Forensic3DDocument/Forensic3DDocumentScene.tsx) |
| **Déclaration Composition Remotion** | [`financial-forensics/src/Root.tsx`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/financial-forensics/src/Root.tsx) (`id="Forensic3DDocument"`) |
| **Sound Design Whoosh** | [`_shared/sfx/whoosh/whoosh_medium.wav`](file:///home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/_shared/sfx/whoosh/whoosh_medium.wav) |

---

## 🎯 Ce que ça donne à l'écran

1. **Lévitation en apesanteur 3D** : Le document flotte dans l'espace avec une légère inclinaison physique, oscillation harmonique et micro-dérive vivante.
2. **Caméra Virtuelle & Travelling lent** : La caméra effectue un travelling continu (push-in + arc de parallaxe) révélant les angles et la tranche en biseau de la feuille.
3. **Reflets Spéculaires Mobiles (Specular Glint)** : Une source lumineuse ponctuelle balaie la surface semi-glacée du papier, créant un reflet spéculaire cinématique sur le texte et les colonnes.
4. **Poussières et Particules 3D en profondeur** : 75 micro-particules lumineuses dérivent lentement dans le volume 3D avec flou de profondeur.
5. **Ombre douce portée 3D** : Une ombre réaliste flotte à l'arrière du document.
6. **Support du Canal Alpha** : Option `--transparent` pour exporter en Apple ProRes 4444 et superposer le document 3D directement par-dessus n'importe quel plan vidéo.

---

## 💻 Utilisation en Ligne de Commande

### 1. Rendu Standard (Décor sombre 3D avec Whoosh audio) :
```bash
.venv/bin/python scripts/generate_3d_document.py \
    --image "episodes/02-ftx/assets/real/REAL-11_article_coindesk_2nov2022.jpg" \
    --title "COINDESK // LEAKED BALANCE SHEET" \
    --duration 4.0 \
    --out "scratch/demo_3d_coindesk.mp4"
```

### 2. Format Document A4 Vertical (Ratio ~0.707) :
```bash
.venv/bin/python scripts/generate_3d_document.py \
    --image "episodes/02-ftx/assets/real/REAL-15_ordonnance_confiscation_11B.jpg" \
    --title "SDNY FORFEITURE ORDER" \
    --ratio 0.707 \
    --duration 5.0 \
    --out "scratch/demo_3d_ordonnance.mp4"
```

### 3. Export Transparent ProRes 4444 (Surimpression Kdenlive) :
```bash
.venv/bin/python scripts/generate_3d_document.py \
    --image "episodes/02-ftx/assets/real/REAL-12_portrait_sequoia_supprime.jpg" \
    --transparent \
    --duration 4.5 \
    --out "scratch/demo_3d_sequoia_alpha.mov"
```
