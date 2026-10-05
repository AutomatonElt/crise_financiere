# 🏛️ Composant : The Ledger Title Card (Affiche Monumentale Post-Hook)

Ce composant génère l'**affiche de titre officielle de début d'épisode** pour la chaîne **The Ledger**, positionnée juste après le Hook d'introduction pour lancer le récit documentaire.

Inspiré de l'esthétique "Table d'enquête d'archives" (*Forensic Investigation Desk*), il combine un collage photographique d'époque, du papier de grand livre comptable, des annotations manuscrites à la plume et un cartouche de titre imposant.

---

## 🎯 Quand l'utiliser ?

* 🔹 Révélation du grand titre de l'épisode juste après le Hook introductif (vers 0:45 - 1:30 de vidéo).
* 🔹 Transition majeure marquant le début de l'Acte 1 / de l'enquête.
* 🔹 Signature identitaire répétée sur chaque épisode de la chaîne.

---

## 📸 Anatomie Visuelle du Plan

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. FOND DE TABLE      : Papier grand livre quadrillé + Vignettage doux  │
├────────────────────────────────────────────────────────────────────────┤
│ 2. COLLAGE ARCHIVES   : • Centre : Grande photo d'époque (Bâtiment/Lieu)│
│                         • Droite : Polaroid / Exhibit A (Tunnel/Preuve)│
│                         • Gauche : Portrait d'époque (Le suspect)      │
├────────────────────────────────────────────────────────────────────────┤
│ 3. ANNOTATIONS PLUME  : Écritures manuscrites cursives en police Caveat │
│                         ("Sans armes, sans haine...", "Dossier 76")    │
├────────────────────────────────────────────────────────────────────────┤
│ 4. CARTOUCHE DE TITRE : Boîte sombre rectangulaire en plein centre      │
│                         • Grand Titre condensé puissant (Anton)        │
│                         • Séparateur or discret                        │
│                         • Sous-titre machine à écrire (Courier Prime)   │
├────────────────────────────────────────────────────────────────────────┤
│ 5. TAMPON OFFICIEL    : Tampon rouge incliné "LEDGER VERIFIED"         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Thèmes Graphiques Disponibles

| Thème | Caractéristiques Visuelles | Recommandé pour... |
|---|---|---|
| **`archival_paper`** (Défaut) | Papier ivoire chaud d'archives (`#EBE6DF`), quadrillage discret, encre noire et bleue. | Affaires historiques (Spaggiari, Bourassa, Madoff, braquages). |
| **`dark_forensic`** | Fond grand livre ardoise sombre (`#0A0E17`), lueurs cyan et bleues d'enquête moderne. | Affaires crypto & fintech modernes (FTX, Wirecard, OneCoin). |

---

## 💻 Commande CLI

```bash
# Exemple Casse de Nice (Albert Spaggiari)
.venv/bin/python scripts/generate_ledger_title.py \
    --title "LE CASSE DU SIÈCLE" \
    --subtitle "NICE • JUILLET 1976" \
    --case "DOSSIER #1976-NC" \
    --quote "Sans armes, sans haine, sans violence..." \
    --note-top "weekend du 14 juillet — 80m de tunnel" \
    --note-bottom "le coffre de la Société Générale" \
    --theme archival_paper \
    --out "episodes/01-ruja-ignatova/assets/custom-graphics/title_spaggiari.mp4"
```

---

## 🔊 Sound Design Recommandé

* **Piste `A3_SFX_WHOOSH`** :
  * Un whoosh feutré et profond calé à la frame 14 (lancement du cartouche de titre).
  * Son d'obturateur photo doux ou froissement de papier lors de l'arrivée des photos.
* **Piste `A2_MUSIC_BED`** :
  * La musique d'ambiance / drone de tension **continue sans interruption** ("Beat-Through"), maintenant le spectateur immergé.
