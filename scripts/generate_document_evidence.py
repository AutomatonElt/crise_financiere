#!/usr/bin/env python3
"""
Générateur de Pièces à Conviction & Surlignage (Document Highlighter & Redaction)
================================================================================
Composant universel pour mettre en scène un email secret, un rapport d'audit interne
ou une pièce judiciaire avec surlignage feutre animé ou levée de censure (déclassification).

Exemples :
----------
# Surlignage or standard d'un email compromettant :
python scripts/generate_document_evidence.py \\
    --header "EXHIBIT B — INTERNAL MEMO" \\
    --date "OCTOBER 20, 2014" \\
    --sender "ruja.ignatova@onecoin.eu" \\
    --recipient "sebastian.greenwood@onecoin.eu" \\
    --subject "Strategy update" \\
    --text "We are not mining coins. If things go bad, we take the money and run and blame someone else." \\
    --highlight "take the money and run" \\
    --mode highlight \\
    --out "episodes/01-ruja-ignatova/assets/evidence/doc_memo_run.mov"

# Mode déclassification (barre de censure noire qui se retire) :
python scripts/generate_document_evidence.py \\
    --header "FBI CONFIDENTIAL INTERCEPT" \\
    --text "Subject confirmed boarding flight to ATHENS using passport under alias." \\
    --highlight "ATHENS" \\
    --mode redaction \\
    --out "episodes/01-ruja-ignatova/assets/evidence/doc_fbi_athens.mov"
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
    parser = argparse.ArgumentParser(description="Générateur de Pièce à Conviction & Surlignage")
    parser.add_argument("--header", default="EXHIBIT B — INTERNAL MEMO", help="Titre du document judiciaire")
    parser.add_argument("--classification", default="CONFIDENTIAL // LAW ENFORCEMENT SENSITIVE", help="Badge de classification")
    parser.add_argument("--date", default="OCTOBER 20, 2014 — 14:32 UTC", help="Date de la pièce")
    parser.add_argument("--sender", default="ruja.ignatova@onecoin.eu", help="Expéditeur")
    parser.add_argument("--recipient", default="sebastian.greenwood@onecoin.eu", help="Destinataire")
    parser.add_argument("--subject", default="Strategy update regarding token emission", help="Objet du document")
    parser.add_argument("--text", required=True, help="Corps du document")
    parser.add_argument("--highlight", required=True, help="Expression cible à surligner ou déclassifier")
    parser.add_argument("--mode", choices=["highlight", "redaction"], default="highlight", help="Type d'effet")
    parser.add_argument("--color", default="#EAB308", help="Couleur du surligneur (hex)")
    parser.add_argument("--style", choices=["dark_legal", "light_legal", "transparent"], default="dark_legal", help="Style de fond")
    parser.add_argument("--duration", type=float, default=5.0, help="Durée en secondes (défaut: 5.0s)")
    parser.add_argument("--fps", type=int, default=25, help="FPS (défaut: 25)")
    parser.add_argument("--out", required=True, help="Chemin du fichier de sortie (.mov ProRes 4444 ou .mp4)")

    args = parser.parse_args()

    duration_frames = int(round(args.duration * args.fps))
    props = {
        "header": args.header,
        "classification": args.classification,
        "date": args.date,
        "sender": args.sender,
        "recipient": args.recipient,
        "subject": args.subject,
        "bodyText": args.text,
        "targetPhrase": args.highlight,
        "mode": args.mode,
        "highlightColor": args.color,
        "styleMode": args.style,
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
        "DocumentEvidence",
        out_path,
        f"--props={json.dumps(props)}",
        f"--frames=0-{duration_frames - 1}",
    ] + codec_args

    print(f"🎬 Rendu DocumentEvidence en cours -> {out_path} ({duration_frames} frames)...")
    res = subprocess.run(cmd, cwd=REMOTION_DIR)
    if res.returncode == 0:
        print(f"✅ Rendu terminé avec succès : {out_path}")
    else:
        print(f"❌ Erreur lors du rendu Remotion (code {res.returncode})", file=sys.stderr)
        sys.exit(res.returncode)


if __name__ == "__main__":
    main()
