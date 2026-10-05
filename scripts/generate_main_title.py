#!/usr/bin/env python3
"""
Générateur Universel de Titre Principal d'Épisode (Financial Forensics)
-----------------------------------------------------------------------
Crée la séquence monumentale épurée du titre de l'épisode :
- Fond sombre immersif (bleu nuit profond / noir)
- Grand titre gravé en or étincelant (ex: THE CRYPTOQUEEN)
- Filet d'or fin avec node diamant central
- Zéro encombrement / zéro texte superflu
- Travelling avant lent et fondu cinéma

Exemples d'utilisation :
-----------------------
python scripts/generate_main_title.py \\
    --title "THE CRYPTOQUEEN" \\
    --duration 5.0 \\
    --out "episodes/01-ruja-ignatova/assets/texte_card/main_title_cryptoqueen.mp4"
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
    parser = argparse.ArgumentParser(description="Générateur de Titre Principal d'Épisode (Financial Forensics)")
    parser.add_argument("--title", required=True, help="Titre principal de l'épisode (ex: THE CRYPTOQUEEN)")
    parser.add_argument("--style", choices=["clean", "shimmer", "ambient"], default="shimmer", help="Style visuel: shimmer (éclair scintillant cinéma), clean (net sans tache), ambient")
    parser.add_argument("--accent", "--color", default="#D4AF37", help="Couleur or du titre (défaut: #D4AF37 or)")
    parser.add_argument("--duration", type=float, default=5.0, help="Durée totale en secondes (défaut: 5.0)")
    parser.add_argument("--sound", dest="sound", action="store_true", default=True, help="Activer le son whoosh (défaut: activé)")
    parser.add_argument("--no-sound", dest="sound", action="store_false", help="Désactiver le son whoosh")
    parser.add_argument("--whoosh", default="", help="Chemin du son whoosh personnalisé")
    parser.add_argument("--transparent", action="store_true", default=False, help="Fond transparent au lieu du fond sombre cinéma")
    parser.add_argument("--fps", type=int, default=25, help="Cadence en FPS (défaut: 25)")
    parser.add_argument("--out", required=True, help="Chemin du fichier de sortie .mp4 ou .mov")

    args = parser.parse_args()

    out_path = os.path.abspath(args.out)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)

    duration_frames = int(round(args.duration * args.fps))
    bg_type = "transparent" if args.transparent else "dark"

    print("\n" + "=" * 65)
    print("🎬 GÉNÉRATEUR DU TITRE MAÎTRE ÉPURÉ (Financial Forensics)")
    print("=" * 65)
    print(f"👑 Grand Titre: '{args.title}'")
    print(f"✨ Style     : {args.style.upper()}")
    print(f"🎨 Accent    : {args.accent} (Or noble)")
    print(f"🌌 Fond      : {bg_type.upper()}")
    print(f"🔊 Whoosh    : {'ACTIVÉ' if args.sound else 'DÉSACTIVÉ'}")
    print(f"⏱️  Durée     : {args.duration:.2f}s ({duration_frames} frames @ {args.fps}fps)")
    print(f"📁 Sortie    : {out_path}")
    print("=" * 65 + "\n")

    input_props = {
        "title": args.title,
        "style": args.style,
        "accentColor": args.accent,
        "bgType": bg_type,
        "durationInFrames": duration_frames,
    }

    props_json_str = json.dumps(input_props)

    is_mov = out_path.endswith(".mov")
    codec_args = [
        "--codec=prores",
        "--prores-profile=4444",
        "--pixel-format=yuva444p10le",
    ] if is_mov or args.transparent else [
        "--codec=h264",
        "--crf=16",
    ]

    temp_video = out_path + ".temp_no_audio" + (".mov" if is_mov else ".mp4")

    remotion_cmd = [
        "npx", "remotion", "render",
        "MainTitle",
        temp_video,
        f"--props={props_json_str}",
        *codec_args,
        f"--frames=0-{duration_frames - 1}",
        "--gl=angle",
        "--quiet",
    ]

    print("🚀 Rendu vidéo Remotion du titre épuré...")
    res = subprocess.run(remotion_cmd, cwd=REMOTION_DIR)
    if res.returncode != 0:
        print(f"❌ Erreur lors du rendu Remotion (Code {res.returncode})", file=sys.stderr)
        if os.path.exists(temp_video):
            os.remove(temp_video)
        sys.exit(1)

    whoosh_sfx = args.whoosh if args.whoosh else os.path.join(ROOT_DIR, "_shared/sfx/whoosh/whoosh_long.wav")
    wav_out = os.path.splitext(out_path)[0] + "_whoosh.wav"

    if args.sound and os.path.exists(whoosh_sfx):
        print(f"🔊 Intégration du son Whoosh : {os.path.basename(whoosh_sfx)}...")
        # 1. Générer le fichier WAV compagnon avec padding
        cmd_wav = [
            "ffmpeg", "-y", "-i", whoosh_sfx,
            "-filter_complex", f"apad=whole_dur={args.duration:.2f}",
            "-c:a", "pcm_s16le", wav_out
        ]
        subprocess.run(cmd_wav, capture_output=True)

        # 2. Intégrer l'audio dans la vidéo
        audio_codec = ["-c:a", "copy"] if is_mov else ["-c:a", "aac", "-b:a", "192k"]
        cmd_mix = [
            "ffmpeg", "-y", "-i", temp_video, "-i", wav_out,
            "-c:v", "copy", *audio_codec, "-shortest", out_path
        ]
        subprocess.run(cmd_mix, capture_output=True)
        if os.path.exists(temp_video):
            os.remove(temp_video)
        print(f"✓ Fichier audio compagnon : {wav_out}")
    else:
        if os.path.exists(out_path):
            os.remove(out_path)
        os.rename(temp_video, out_path)

    print(f"\n✅ TERMINÉ ! Titre épuré généré avec succès :\n   🎥 {out_path}\n")


if __name__ == "__main__":
    main()
