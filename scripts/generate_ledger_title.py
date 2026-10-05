#!/usr/bin/env python3
"""
Générateur de Titre Billboard Post-Hook — "THE LEDGER" (Signature Channel Title Card)
====================================================================================
Génère l'affiche de titre monumentale de début d'épisode pour la chaîne "The Ledger" :
- Table d'enquête d'archives & papier quadrillé de grand livre comptable.
- Collage de 3 photographies d'époque avec bordures photo et ombres portées.
- Cartouche central sombre avec typographie percutante et sous-titre machine à écrire.
- Annotations manuscrites à la plume d'enquêteur (Cursive Notes).
- Tampon officiel d'enregistrement "LEDGER VERIFIED".

Exemples d'utilisation :
------------------------
# Cas standard Albert Spaggiari :
python scripts/generate_ledger_title.py \\
    --title "LE CASSE DU SIÈCLE" \\
    --subtitle "NICE • JUILLET 1976" \\
    --case "DOSSIER #1976-NC" \\
    --quote "Sans armes, sans haine, sans violence..." \\
    --note-top "weekend du 14 juillet — 80m de tunnel" \\
    --note-bottom "le coffre de la Société Générale" \\
    --out "episodes/01-ruja-ignatova/assets/custom-graphics/title_spaggiari.mp4"

# Version Dark Forensic pour un crime crypto/financier moderne :
python scripts/generate_ledger_title.py \\
    --title "THE $4 BILLION GHOST" \\
    --subtitle "SOFIA • ATHÈNES • OCTOBRE 2017" \\
    --case "CASE #2017-SDNY-01" \\
    --quote "Take the money and run..." \\
    --theme dark_forensic \\
    --out "episodes/01-ruja-ignatova/assets/custom-graphics/title_ruja.mp4"
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
    parser = argparse.ArgumentParser(description="Générateur de Titre Post-Hook — The Ledger")
    parser.add_argument("--channel", default="THE LEDGER", help="Nom de la chaîne")
    parser.add_argument("--case", default="DOSSIER #1976-NC", help="Numéro de dossier ou code d'enquête")
    parser.add_argument("--title", required=True, help="Titre principal monumental de l'épisode")
    parser.add_argument("--subtitle", required=True, help="Sous-titre spatio-temporel (Lieu • Date)")
    parser.add_argument("--quote", default="", help="Citation manuscrite sous le titre")
    parser.add_argument("--note-top", default="", help="Annotation manuscrite en haut à gauche")
    parser.add_argument("--note-bottom", default="", help="Annotation manuscrite en bas à droite")
    parser.add_argument("--main-img", default="", help="Chemin ou URL de l'image centrale")
    parser.add_argument("--side-img", default="", help="Chemin ou URL de l'image droite (exhibit)")
    parser.add_argument("--suspect-img", default="", help="Chemin ou URL du portrait suspect (gauche)")
    parser.add_argument("--theme", choices=["archival_paper", "dark_forensic"], default="archival_paper", help="Thème visuel")
    parser.add_argument("--stamp", default="LEDGER VERIFIED", help="Texte du tampon rouge")
    parser.add_argument("--duration", type=float, default=6.0, help="Durée en secondes (défaut: 6.0s)")
    parser.add_argument("--fps", type=int, default=25, help="FPS (défaut: 25)")
    parser.add_argument("--out", required=True, help="Chemin de sortie (.mp4 ou .mov)")

    args = parser.parse_args()

    duration_frames = int(round(args.duration * args.fps))
    props = {
        "channelName": args.channel,
        "caseNumber": args.case,
        "title": args.title,
        "subtitle": args.subtitle,
        "handwrittenNote1": args.quote,
        "handwrittenNote2": args.note_bottom,
        "handwrittenNote3": args.note_top,
        "mainImageSrc": args.main_img,
        "sideImageSrc": args.side_img,
        "suspectImageSrc": args.suspect_img,
        "themeMode": args.theme,
        "stampText": args.stamp,
        "durationInFrames": duration_frames,
    }

    out_path = os.path.abspath(args.out)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)

    is_prores = out_path.endswith(".mov")
    codec_args = (
        ["--codec=prores", "--prores-profile=4444", "--pixel-format=yuva444p10le"]
        if is_prores
        else ["--codec=h264"]
    )

    cmd = [
        "npx", "remotion", "render",
        "src/index.ts",
        "LedgerTitleCard",
        out_path,
        f"--props={json.dumps(props)}",
        f"--frames=0-{duration_frames - 1}",
    ] + codec_args

    print(f"🎬 Rendu LedgerTitleCard en cours -> {out_path} ({duration_frames} frames)...")
    res = subprocess.run(cmd, cwd=REMOTION_DIR)
    if res.returncode == 0:
        print(f"✅ Rendu terminé avec succès : {out_path}")
    else:
        print(f"❌ Erreur lors du rendu Remotion (code {res.returncode})", file=sys.stderr)
        sys.exit(res.returncode)


if __name__ == "__main__":
    main()
