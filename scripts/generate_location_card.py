#!/usr/bin/env python3
"""
Générateur Universel de "Carte des Lieux" (LocationCard) pour Financial Forensics
---------------------------------------------------------------------------------
Inspiré de l'habillage visuel de "Furtif" :
- Carte postale vintage avec papier ivoire d'archive, filet noir et légende gravée.
- Ou archive à bords adoucis (feathered) flottante.
- Export en vidéo transparente ProRes 4444 (.mov) avec canal ALPHA, prête à être posée sur n'importe quel fond.
- Support du compositing direct si une vidéo ou image de fond est spécifiée.

Usage :
  python3 scripts/generate_location_card.py \
      --image "episodes/02-ftx/assets/real/REAL-04_ftx_arena_miami_nuit.jpg" \
      --title "FTX ARENA" \
      --subtitle "MIAMI, FLORIDE // JANVIER 2022" \
      --badge "32 MILLIARDS $" \
      --style postcard \
      --position right \
      --duration 3.0 \
      --out "episodes/02-ftx/assets/custom-graphics/H03_location_card_ftx_arena.mov"
"""

import os
import sys
import json
import shutil
import argparse
import subprocess
from pathlib import Path

WORKSPACE_ROOT = Path(__file__).resolve().parents[1]
REMOTION_DIR = WORKSPACE_ROOT / "financial-forensics"
PUBLIC_DIR = REMOTION_DIR / "public"


def render_location_card(
    image_path: str,
    title: str = None,
    subtitle: str = "",
    badge: str = "",
    style: str = "postcard",
    position: str = None,
    duration: float = 3.0,
    fps: int = 25,
    card_width: int = None,
    aspect_ratio: float = None,
    tilt: float = None,
    offset_x: int = 0,
    offset_y: int = None,
    show_caption: bool = False,
    output_path: str = None,
    bg_path: str = None,
):
    inp_img = Path(image_path).resolve()
    if not inp_img.exists():
        print(f"[-] Erreur: L'image source n'existe pas: {inp_img}")
        sys.exit(1)

    # Paramètres intelligents selon le style
    is_feathered = (style == "feathered")
    if is_feathered:
        resolved_title = title if title is not None else ""
        resolved_width = card_width if card_width is not None else 540
        resolved_ratio = aspect_ratio if aspect_ratio is not None else 1.333
        resolved_tilt = tilt if tilt is not None else 0.0
        resolved_pos = position if position is not None else "top-left"
        resolved_offset_y = offset_y if offset_y is not None else 60
    else:
        resolved_title = title if title is not None else "THE PIERRE"
        resolved_width = card_width if card_width is not None else 440
        resolved_ratio = aspect_ratio if aspect_ratio is not None else 0.78
        resolved_tilt = tilt if tilt is not None else 1.2
        resolved_pos = position if position is not None else "right"
        resolved_offset_y = offset_y if offset_y is not None else 40

    # 1. Copie temporaire dans public/ pour résolution immédiate par Remotion
    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)
    ext = inp_img.suffix
    temp_asset_name = f"_loc_card_temp_{os.getpid()}{ext}"
    target_in_public = PUBLIC_DIR / temp_asset_name
    shutil.copy2(inp_img, target_in_public)

    out_file = Path(output_path).resolve() if output_path else WORKSPACE_ROOT / "location_card.mov"
    out_file.parent.mkdir(parents=True, exist_ok=True)

    duration_frames = int(round(duration * fps))

    props = {
        "imageSrc": temp_asset_name,
        "title": resolved_title,
        "subtitle": subtitle,
        "dateOrBadge": badge,
        "cardStyle": style,
        "position": resolved_pos,
        "cardWidth": resolved_width,
        "photoAspectRatio": resolved_ratio,
        "tiltDeg": resolved_tilt,
        "offsetX": offset_x,
        "offsetY": resolved_offset_y,
        "showCaption": show_caption,
    }
    props_json = json.dumps(props)

    is_mov = out_file.suffix.lower() == ".mov"
    is_webm = out_file.suffix.lower() == ".webm"

    print("\n" + "=" * 65)
    print("📍 GÉNÉRATEUR UNIVERSEL DE CARTE DES LIEUX (TRANSPARENTE)")
    print("=" * 65)
    print(f"🖼️  Image    : {inp_img.name}")
    print(f"🏷️  Titre    : '{title}'")
    if subtitle:
        print(f"📌 Sous-titre: '{subtitle}'")
    if badge:
        print(f"🎖️  Badge    : '{badge}'")
    print(f"🎨 Style    : {style}")
    print(f"📍 Position : {position} (tilt: {tilt}°)")
    print(f"⏱️  Durée    : {duration}s ({duration_frames} frames @ {fps}fps)")
    print(f"📁 Sortie   : {out_file}")
    print("=" * 65)

    # Commande de rendu Remotion avec canal ALPHA
    raw_render_file = out_file
    if bg_path:
        raw_render_file = out_file.parent / f"_temp_alpha_{os.getpid()}.mov"

    cmd = [
        "npx", "remotion", "render",
        "LocationCard",
        str(raw_render_file),
        f"--props={props_json}",
        f"--frames=0-{duration_frames - 1}",
        "--gl=angle",
        "--concurrency=4",
    ]

    if is_webm:
        cmd.extend([
            "--codec=vp9",
            "--pixel-format=yuva420p",
        ])
    else:
        # ProRes 4444 avec canal alpha par défaut pour une transparence parfaite
        cmd.extend([
            "--codec=prores",
            "--prores-profile=4444",
            "--pixel-format=yuva444p10le",
        ])

    try:
        print("\n🚀 Rendu Remotion du composant avec canal alpha...")
        res = subprocess.run(cmd, cwd=str(REMOTION_DIR), check=True)

        # Si un arrière-plan (image ou vidéo) a été spécifié, on composite via FFmpeg
        if bg_path:
            bg_file = Path(bg_path).resolve()
            print(f"\n🎬 Compositing sur le fond : {bg_file.name}...")
            bg_ext = bg_file.suffix.lower()
            if bg_ext in [".jpg", ".jpeg", ".png", ".webp"]:
                # Fond image avec zoom lent (Ken Burns) + incrustation alpha
                ffmpeg_cmd = [
                    "ffmpeg", "-y",
                    "-loop", "1", "-i", str(bg_file),
                    "-i", str(raw_render_file),
                    "-t", str(duration),
                    "-filter_complex",
                    f"[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,zoompan=z='min(zoom+0.0006,1.05)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={duration_frames}:s=1920x1080:fps={fps}[bg];"
                    f"[bg][1:v]overlay=0:0:format=auto[v]",
                    "-map", "[v]",
                    "-c:v", "libx264",
                    "-preset", "slow",
                    "-crf", "18",
                    "-pix_fmt", "yuv420p",
                    str(out_file)
                ]
            else:
                # Fond vidéo direct + incrustation alpha
                ffmpeg_cmd = [
                    "ffmpeg", "-y",
                    "-i", str(bg_file),
                    "-i", str(raw_render_file),
                    "-t", str(duration),
                    "-filter_complex",
                    f"[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps={fps}[bg];"
                    f"[bg][1:v]overlay=0:0:format=auto[v]",
                    "-map", "[v]",
                    "-c:v", "libx264",
                    "-preset", "slow",
                    "-crf", "18",
                    "-pix_fmt", "yuv420p",
                    str(out_file)
                ]
            subprocess.run(ffmpeg_cmd, check=True)
            if raw_render_file.exists():
                raw_render_file.unlink()

        print(f"\n[✓] Carte des Lieux générée avec succès dans : {out_file}")

    finally:
        # Nettoyage du fichier temporaire public
        if target_in_public.exists():
            target_in_public.unlink()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Générateur de Carte des Lieux (LocationCard)")
    parser.add_argument("--image", required=True, help="Chemin de l'image d'archive")
    parser.add_argument("--title", default=None, help="Titre principal du lieu")
    parser.add_argument("--subtitle", default="", help="Sous-titre ou repère chronologique")
    parser.add_argument("--badge", default="", help="Badge ou montant (ex: '32 MILLIARDS $')")
    parser.add_argument("--style", choices=["postcard", "feathered", "clean"], default="postcard", help="Style visuel")
    parser.add_argument("--position", choices=["right", "left", "center", "top-right", "top-left", "bottom-right", "bottom-left"], default=None, help="Position")
    parser.add_argument("--duration", type=float, default=3.0, help="Durée en secondes")
    parser.add_argument("--fps", type=int, default=25, help="Cadence en fps")
    parser.add_argument("--width", type=int, default=None, help="Largeur en pixels")
    parser.add_argument("--ratio", type=float, default=None, help="Ratio d'aspect de la photo (ex: 1.333 ou 0.78)")
    parser.add_argument("--tilt", type=float, default=None, help="Inclinaison en degrés")
    parser.add_argument("--offset-x", type=int, default=0, help="Décalage X en pixels")
    parser.add_argument("--offset-y", type=int, default=None, help="Décalage Y en pixels")
    parser.add_argument("--show-caption", action="store_true", help="Afficher la légende sous la photo en style feathered")
    parser.add_argument("--out", help="Fichier de sortie (.mov avec alpha, .webm ou .mp4)")
    parser.add_argument("--bg", help="Arrière-plan optionnel (image ou vidéo)")

    args = parser.parse_args()
    render_location_card(
        image_path=args.image,
        title=args.title,
        subtitle=args.subtitle,
        badge=args.badge,
        style=args.style,
        position=args.position,
        duration=args.duration,
        fps=args.fps,
        card_width=args.width,
        aspect_ratio=args.ratio,
        tilt=args.tilt,
        offset_x=args.offset_x,
        offset_y=args.offset_y,
        show_caption=args.show_caption,
        output_path=args.out,
        bg_path=args.bg,
    )
