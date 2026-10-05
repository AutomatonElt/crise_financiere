#!/usr/bin/env python3
"""
scripts/generate_ledger_title_sequence.py
Générateur de la Séquence de Titre Animée en 3 Temps — The Ledger (100% Éditable & Procédural)

Chaque élément (photos réelles, documents, textes, annotations manuscrites, sous-titres, logo)
est un paramètre indépendant et modifiable à la volée pour n'importe quel épisode !
"""

import argparse
import json
import os
import subprocess
import sys
from pathlib import Path

WORKSPACE = Path("/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp")
REMOTION_DIR = WORKSPACE / "financial-forensics"


def main():
    parser = argparse.ArgumentParser(
        description="Générateur de la Séquence de Titre Animée en 3 Temps — The Ledger (100% Paramétrable)"
    )

    # --- Phase 1 : Le Dossier ---
    parser.add_argument(
        "--p1-title",
        default="NINE DAYS TO ZERO",
        help="Titre principal monumental du dossier",
    )
    parser.add_argument(
        "--p1-subtitle",
        default="THE COLLAPSE OF FTX • NOVEMBER 2022",
        help="Sous-titre spatio-temporel du dossier",
    )
    parser.add_argument(
        "--p1-main-img",
        default=None,
        help="Chemin de l'image centrale du bâtiment ou lieu",
    )
    parser.add_argument(
        "--p1-left-img",
        default=None,
        help="Image de la pièce d'archive gauche (ex: article/bilan)",
    )
    parser.add_argument(
        "--p1-left-caption",
        default=None,
        help="Légende sous le document gauche",
    )
    parser.add_argument(
        "--p1-right-img",
        default=None,
        help="Image de la pièce d'archive droite (ex: tweet/relevé)",
    )
    parser.add_argument(
        "--p1-right-caption",
        default=None,
        help="Légende sous le document droit",
    )
    parser.add_argument(
        "--p1-note-top",
        default=None,
        help="Annotation manuscrite en haut à gauche",
    )
    parser.add_argument(
        "--p1-note-bottom",
        default=None,
        help="Annotation manuscrite en bas à droite",
    )

    # --- Phase 2 : Le Suspect ---
    parser.add_argument(
        "--p2-name",
        default="SAM BANKMAN-FRIED",
        help="Nom du suspect ou protagoniste clé",
    )
    parser.add_argument(
        "--p2-role",
        default="CEO & FOUNDER // FTX & ALAMEDA RESEARCH",
        help="Rôle ou statut sous le nom",
    )
    parser.add_argument(
        "--p2-suspect-img",
        default=None,
        help="Portrait d'archive du suspect",
    )
    parser.add_argument(
        "--p2-left-img",
        default=None,
        help="Image d'archive secondaire gauche (complice/témoin)",
    )
    parser.add_argument(
        "--p2-left-caption",
        default=None,
        help="Légende sous l'archive gauche",
    )
    parser.add_argument(
        "--p2-right-img",
        default=None,
        help="Image d'archive secondaire droite (lieu/arrestation)",
    )
    parser.add_argument(
        "--p2-right-caption",
        default=None,
        help="Légende sous l'archive droite",
    )
    parser.add_argument(
        "--p2-note-left",
        default=None,
        help="Annotation manuscrite gauche du suspect",
    )
    parser.add_argument(
        "--p2-note-right",
        default=None,
        help="Annotation manuscrite droite du suspect",
    )

    # --- Phase 3 : La Marque ---
    parser.add_argument(
        "--channel",
        default="THE LEDGER",
        help="Nom de la chaîne",
    )
    parser.add_argument(
        "--tagline",
        default="FINANCIAL FORENSICS",
        help="Sous-titre de la marque",
    )
    parser.add_argument(
        "--logo",
        default="brand/the_ledger_logo.png",
        help="Chemin du logo officiel",
    )

    # --- Rendu ---
    parser.add_argument(
        "--duration",
        type=float,
        default=6.4,
        help="Durée totale en secondes (défaut: 6.4s = 160 frames)",
    )
    parser.add_argument(
        "--fps",
        type=int,
        default=25,
        help="Cadence d'images (défaut: 25 fps)",
    )
    parser.add_argument(
        "--out",
        required=True,
        help="Chemin du fichier vidéo de sortie (.mp4 ou .mov)",
    )
    parser.add_argument(
        "--codec",
        choices=["h264", "prores"],
        default="h264",
        help="Codec de rendu (h264 ou prores)",
    )

    args = parser.parse_args()

    out_path = Path(args.out).resolve()
    out_path.parent.mkdir(parents=True, exist_ok=True)

    duration_frames = int(args.duration * args.fps)

    # Construction du dictionnaire complet de props pour Remotion
    props = {
        "phase1Title": args.p1_title,
        "phase1Subtitle": args.p1_subtitle,
        "phase1MainImage": args.p1_main_img,
        "phase1LeftImage": args.p1_left_img,
        "phase1LeftCaption": args.p1_left_caption,
        "phase1RightImage": args.p1_right_img,
        "phase1RightCaption": args.p1_right_caption,
        "phase1NoteTop": args.p1_note_top,
        "phase1NoteBottom": args.p1_note_bottom,
        "phase2SuspectName": args.p2_name,
        "phase2SuspectRole": args.p2_role,
        "phase2SuspectImage": args.p2_suspect_img,
        "phase2LeftImage": args.p2_left_img,
        "phase2LeftCaption": args.p2_left_caption,
        "phase2RightImage": args.p2_right_img,
        "phase2RightCaption": args.p2_right_caption,
        "phase2NoteLeft": args.p2_note_left,
        "phase2NoteRight": args.p2_note_right,
        "channelName": args.channel,
        "channelTagline": args.tagline,
        "logoImage": args.logo,
        "durationInFrames": duration_frames,
    }

    props_json = json.dumps(props)

    cmd = [
        "npx",
        "remotion",
        "render",
        "LedgerTitleSequence",
        str(out_path),
        f"--props={props_json}",
        f"--frames=0-{duration_frames - 1}",
    ]

    if args.codec == "prores":
        cmd.extend(["--codec=prores", "--prores-profile=4444"])
    else:
        cmd.extend(["--codec=h264", "--crf=16"])

    print(f"🎬 Rendu de la séquence procédurale The Ledger ({duration_frames} frames @ {args.fps}fps)...")
    print(f"📌 Titre : {args.p1_title} // Suspect : {args.p2_name}")
    print(f"📦 Sortie : {out_path}")

    res = subprocess.run(cmd, cwd=str(REMOTION_DIR))
    if res.returncode == 0:
        print(f"✅ Séquence générée avec succès : {out_path}")
    else:
        print(f"❌ Erreur lors du rendu Remotion (code {res.returncode})", file=sys.stderr)
        sys.exit(res.returncode)


if __name__ == "__main__":
    main()
