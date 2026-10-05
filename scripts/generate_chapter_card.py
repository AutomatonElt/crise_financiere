#!/usr/bin/env python3
"""
Générateur Universel de Cartes de Chapitres & Titres d'Actes (Financial Forensics)
---------------------------------------------------------------------------------
Identité visuelle signature :
- Grand numéro d'acte en Or pur (ex: 01)
- Fin séparateur vertical en dégradé or
- Titre massif en blanc glacier
- Sous-titre aéré en gris acier
- Zéro copie d'autres chaînes (pas de barres horizontales sandwich, pas de tags // encombrants).

Exemples d'utilisation :
-----------------------
python scripts/generate_chapter_card.py \\
    --num "01" \\
    --title "THE WOMAN WHO VANISHED WITH $4 BILLION" \\
    --subtitle "SOFIA, BULGARIE • OCTOBRE 2017" \\
    --pos left \\
    --out "episodes/01-ruja-ignatova/assets/texte_card/chapter_01_woman_who_vanished.mov"
"""

import argparse
import json
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(HERE)
REMOTION_DIR = os.path.join(ROOT_DIR, "financial-forensics")


def main():
    parser = argparse.ArgumentParser(description="Générateur de Titres de Chapitres & d'Actes (ProRes 4444 Alpha)")
    parser.add_argument("--title", required=True, help="Titre principal du chapitre / partie")
    parser.add_argument("--num", "--number", "--part", "--chapter", default="", help="Numéro (ex: 01, 02, 03)")
    parser.add_argument("--subtitle", default="", help="Sous-titre / métadonnées (lieu, date, contexte)")
    parser.add_argument("--pos", "--position", default="left", choices=["left", "center", "right"], help="Alignement à l'écran (défaut: left)")
    parser.add_argument("--duration", type=float, default=4.5, help="Durée totale en secondes (défaut: 4.5)")
    parser.add_argument("--accent", "--color", default="#D4AF37", help="Couleur or signature (défaut: #D4AF37 or)")
    parser.add_argument("--title-color", default="#F8FAFC", help="Couleur du texte principal (défaut: #F8FAFC blanc glacier)")
    parser.add_argument("--subtitle-color", default="#94A3B8", help="Couleur du sous-titre (défaut: #94A3B8 gris acier)")
    parser.add_argument("--fps", type=int, default=25, help="Cadence en FPS (défaut: 25)")
    parser.add_argument("--out", required=True, help="Chemin du fichier de sortie .mov")

    args = parser.parse_args()

    out_path = os.path.abspath(args.out)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)

    duration_frames = int(round(args.duration * args.fps))

    print("\n" + "=" * 65)
    print("🎬 GÉNÉRATEUR DE CARTE DE CHAPITRE (OR & BLANC - ProRes 4444)")
    print("=" * 65)
    if args.num:
        print(f"🏷️  Numéro   : {args.num}")
    print(f"📖 Titre    : '{args.title}'")
    if args.subtitle:
        print(f"📝 Sous-titre: '{args.subtitle}'")
    print(f"📍 Position : {args.pos}")
    print(f"🎨 Accent   : {args.accent} (Or)")
    print(f"⏱️  Durée    : {args.duration:.2f}s ({duration_frames} frames @ {args.fps}fps)")
    print(f"📁 Sortie   : {out_path}")
    print("=" * 65 + "\n")

    input_props = {
        "number": args.num,
        "title": args.title,
        "subtitle": args.subtitle,
        "position": args.pos,
        "accentColor": args.accent,
        "titleColor": args.title_color,
        "subtitleColor": args.subtitle_color,
        "durationInFrames": duration_frames,
    }

    props_json_str = json.dumps(input_props)

    remotion_cmd = [
        "npx", "remotion", "render",
        "ChapterCard",
        out_path,
        f"--props={props_json_str}",
        "--codec=prores",
        "--prores-profile=4444",
        "--pixel-format=yuva444p10le",
        f"--frames=0-{duration_frames - 1}",
        "--gl=angle",
        "--quiet",
    ]

    print("🚀 Rendu vidéo transparente ProRes 4444 via Remotion...")
    res = subprocess.run(remotion_cmd, cwd=REMOTION_DIR)
    if res.returncode != 0:
        print(f"❌ Erreur lors du rendu Remotion (Code {res.returncode})", file=sys.stderr)
        sys.exit(1)

    print(f"\n✅ TERMINÉ ! Fichier généré avec succès :\n   🎥 {out_path}\n")


if __name__ == "__main__":
    main()
