# 🔴 Composant : Forensic Status Stamp (Tampon Médico-Légal & Statut d'Enquête)

Ce composant génère un **tampon d'investigation percutant** (*ARRESTED*, *GUILTY*, *CONFIDENTIAL*, *FRAUD*, *MOST WANTED*) qui s'écrase violemment sur l'écran avec une physique d'impact réelle, une onde de choc circulaire et une micro-vibration de caméra.

---

## 🎯 Quand l'utiliser ?

* 🔹 Révélation de l'arrestation, de l'inculpation ou de la condamnation d'un suspect (superposé sur une [EvidenceCard](../evidence-card/README.md)).
* 🔹 Classification d'une preuve (*CONFIDENTIAL*, *TOP SECRET*, *FRAUD DETECTED*).
* 🔹 Annonce d'une déclassification de documents du FBI ou DOJ (*DECLASSIFIED*).
* 🔹 Marqueur d'impact narratif fort en fin de révélation.

---

## 📸 Palettes & Styles Disponibles

| Couleur | Code Hex | Utilisation recommandée |
|---|---|---|
| **`red`** | `#DC2626` / `#EF4444` | Inculpation, arrestation, verdict coupable (*ARRESTED, GUILTY, FRAUD*). |
| **`gold`** | `#D97706` / `#F59E0B` | Secret défense, pièces scellées (*CONFIDENTIAL, SEALED INDICTMENT*). |
| **`green`** | `#059669` / `#10B981` | Levée de secret, acquittement, validation (*DECLASSIFIED, VERIFIED*). |
| **`cyan`** | `#0284C7` / `#38BDF8` | Dépôt officiel, enregistrement au greffe (*FILED, REGISTERED*). |

---

## 💻 Commande CLI

```bash
# Tampon rouge ARRESTED classique (Apple ProRes 4444 transparent)
.venv/bin/python scripts/generate_status_stamp.py \
    --text "ARRESTED" \
    --subtext "25 OCT 2017 // SDNY" \
    --color red \
    --angle -12 \
    --duration 3.0 \
    --out "episodes/01-ruja-ignatova/assets/overlays/stamp_arrested.mov"
```

---

## 🔊 Sound Design Recommandé

* **Impact (Frame 8)** : Déclenchement d'un son lourd de tampon mécanique ou d'impact sourd (*heavy stamp thud / metallic click*) calé sur la frame exacte de l'onde de choc.
* **Piste de destination** : Placer le clip sur **`V3_TITLES`** (superposé au-dessus de la fiche suspect sur `V2_OVERLAYS` ou du rush sur `V1_MAIN`).
