#!/usr/bin/env python3
"""
Générateur Universel d'Affiches, Couvertures & Articles de Presse (MagazinePoster)
---------------------------------------------------------------------------------
Conçu pour la chaîne YouTube Financial Forensics :
- Fond bleu dégradé immersif animé en permanence (faisceaux lumineux en orbite, lueur cyan, particules).
- Conteneur 3D vitré haut de gamme avec passe-partout d'archive.
- Balayage lumineux diagonal de reflet papier glacé (Glossy paper sheen).
- Entrée dynamique avec physique spring douce et dérive vivante permanente (floating drift).
- Intégration sonore du Whoosh cinématique à l'apparition.

Exemples d'utilisation :
-----------------------
# Affiche Financial IT (8.0s) :
python scripts/generate_magazine_poster.py \\
    --image "episodes/01-ruja-ignatova/assets/footage-reel/ignotova_affiche_magazine.jpeg" \\
    --title "FINANCIAL IT MAGAZINE" \\
    --subtitle "WINTER ISSUE // FULL-PAGE SPREAD" \\
    --badge "FINANCIAL PRESS // PROMOTIONAL FEATURE" \\
    --ref "EXHIBIT // 2015-FIT" \\
    --quote "REVOLUTIONIZING THE FINANCIAL MARKETS" \\
    --duration 8.0 \\
    --out "episodes/01-ruja-ignatova/assets/custom-graphics/poster_financial_it.mp4"

# Couverture Forbes Bulgaria (5.0s) :
python scripts/generate_magazine_poster.py \\
    --image "episodes/01-ruja-ignatova/assets/footage-reel/ignatova_affiche_forbes.jpeg" \\
    --title "FORBES BULGARIA" \\
    --subtitle "MAY ISSUE // COVER STORY" \\
    --badge "INTERNATIONAL MEDIA // ADVERTORIAL" \\
    --ref "EXHIBIT // 2015-FRB" \\
    --quote "PAID BRANDVOICE INSERT // FAKE LEGITIMACY" \\
    --duration 5.0 \\
    --out "episodes/01-ruja-ignatova/assets/custom-graphics/poster_forbes_bulgaria.mp4"
"""

import argparse
import base64
import json
import mimetypes
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(HERE)
REMOTION_DIR = os.path.join(ROOT_DIR, "financial-forensics")
DEFAULT_WHOOSH_AUDIO = os.path.join(ROOT_DIR, "_shared", "sfx", "whoosh", "whoosh_medium.wav")


def encode_image_to_data_uri(image_path: str) -> str:
    """Convertit l'image locale en Data URI base64 pour Remotion."""
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image introuvable : {image_path}")

    mime_type, _ = mimetypes.guess_type(image_path)
    if not mime_type:
        mime_type = "image/jpeg"

    with open(image_path, "rb") as f:
        encoded = base64.b64encode(f.read()).decode("utf-8")

    return f"data:{mime_type};base64,{encoded}"


def render_magazine_poster(
    image_path: str,
    out_path: str,
    title: str = "",
    card_width: int = 1500,
    duration_sec: float = 5.0,
    fps: int = 25,
    sound: bool = False,
    whoosh_path: str = DEFAULT_WHOOSH_AUDIO,
    show_title: bool = False,
):
    abs_image = os.path.abspath(image_path)
    abs_out = os.path.abspath(out_path)
    duration_frames = int(round(duration_sec * fps))

    print("\n" + "=" * 68)
    print("📰 GÉNÉRATEUR D'AFFICHE & ARTICLE DE PRESSE (MagazinePoster)")
    print("=" * 68)
    print(f"🖼️  Image source  : {os.path.basename(abs_image)}")
    if title:
        print(f"👑 Titre         : {title} (Affiché: {show_title})")
    print(f"📐 Largeur carte : {card_width}px")
    print(f"🔊 Son Whoosh    : {'Activé' if sound else 'Désactivé (Silencieux)'}")
    print(f"⏱️  Durée         : {duration_sec:.2f}s ({duration_frames} frames @ {fps}fps)")
    print(f"💾 Sortie        : {abs_out}")
    print("=" * 68 + "\n")

    image_data_uri = encode_image_to_data_uri(abs_image)

    props = {
        "imageSrc": image_data_uri,
        "title": title,
        "cardWidth": card_width,
        "durationInFrames": duration_frames,
        "showTitle": show_title,
    }

    os.makedirs(os.path.dirname(abs_out), exist_ok=True)
    base_without_ext, ext = os.path.splitext(abs_out)
    is_mov = ext.lower() == ".mov"

    temp_props_file = base_without_ext + "_temp_props.json"
    temp_video = base_without_ext + "_temp_video" + ext

    with open(temp_props_file, "w", encoding="utf-8") as f:
        json.dump(props, f)

    codec_args = (
        ["--codec=prores", "--prores-profile=4444", "--pixel-format=yuva444p10le"]
        if is_mov
        else ["--codec=h264", "--crf=16"]
    )

    remotion_cmd = [
        "npx",
        "remotion",
        "render",
        "MagazinePoster",
        temp_video,
        f"--props={temp_props_file}",
        *codec_args,
        f"--frames=0-{duration_frames - 1}",
        "--gl=angle",
        "--quiet",
    ]

    print("🚀 Rendu vidéo Remotion (Fond bleu dégradé animé + affiche agrandie & animée)...")
    try:
        res = subprocess.run(remotion_cmd, cwd=REMOTION_DIR)
        if res.returncode != 0:
            print(f"❌ Erreur Remotion (Code {res.returncode})", file=sys.stderr)
            sys.exit(1)

        actual_whoosh = whoosh_path if (whoosh_path and os.path.exists(whoosh_path)) else DEFAULT_WHOOSH_AUDIO

        if sound and os.path.exists(actual_whoosh):
            print(f"🔊 Mixage audio Whoosh cinématique ({os.path.basename(actual_whoosh)})...")
            audio_codec = ["-c:a", "pcm_s16le"] if is_mov else ["-c:a", "aac", "-b:a", "192k"]

            ffmpeg_cmd = [
                "ffmpeg",
                "-y",
                "-i",
                temp_video,
                "-i",
                actual_whoosh,
                "-filter_complex",
                f"[1:a]apad=whole_dur={duration_sec:.2f}[aout]",
                "-map",
                "0:v:0",
                "-map",
                "[aout]",
                "-c:v",
                "copy",
                *audio_codec,
                "-shortest",
                abs_out,
            ]
            sub_res = subprocess.run(ffmpeg_cmd, capture_output=True, text=True)
            if sub_res.returncode != 0:
                print(f"⚠️ Avertissement mixage audio : {sub_res.stderr}", file=sys.stderr)
                os.replace(temp_video, abs_out)
        else:
            # Sans effet sonore : suppression totale de toute piste audio résiduelle (vidéo 100% silencieuse)
            ffmpeg_strip = [
                "ffmpeg",
                "-y",
                "-i",
                temp_video,
                "-c:v",
                "copy",
                "-an",
                abs_out,
            ]
            sub_res = subprocess.run(ffmpeg_strip, capture_output=True, text=True)
            if sub_res.returncode != 0:
                os.replace(temp_video, abs_out)

    finally:
        if os.path.exists(temp_props_file):
            os.remove(temp_props_file)
        if os.path.exists(temp_video):
            os.remove(temp_video)

    print(f"\n✅ TERMINÉ AVEC SUCCÈS !\n   🎥 Fichier généré : {abs_out}\n")


def main():
    parser = argparse.ArgumentParser(
        description="Générateur d'Affiches & Couvertures d'Archives (Remotion -> MP4/MOV)"
    )
    parser.add_argument("--image", required=True, help="Chemin de l'image (JPG, PNG, WebP)")
    parser.add_argument("--title", default="", help="Titre (optionnel)")
    parser.add_argument("--show-title", action="store_true", default=False, help="Afficher le titre sous la carte")
    parser.add_argument("--card-width", type=int, default=1500, help="Largeur maximale de la carte en pixels (défaut: 1500)")
    parser.add_argument("--duration", type=float, default=5.0, help="Durée en secondes (défaut: 5.0)")
    parser.add_argument("--fps", type=int, default=25, help="Cadence en images par seconde (défaut: 25)")
    parser.add_argument("--sound", dest="sound", action="store_true", default=False, help="Activer le son whoosh (défaut: désactivé)")
    parser.add_argument("--whoosh", default="", help="Chemin d'un effet whoosh alternatif")
    parser.add_argument("--out", required=True, help="Chemin du fichier de sortie (.mp4 ou .mov)")

    args = parser.parse_args()

    render_magazine_poster(
        image_path=args.image,
        out_path=args.out,
        title=args.title,
        card_width=args.card_width,
        duration_sec=args.duration,
        fps=args.fps,
        sound=args.sound,
        whoosh_path=args.whoosh,
        show_title=args.show_title,
    )


if __name__ == "__main__":
    main()
