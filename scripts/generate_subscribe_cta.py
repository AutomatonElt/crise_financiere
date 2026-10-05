#!/usr/bin/env python3
"""
Générateur Universel du Composant de Fidélisation / Call-To-Action (Financial Forensics)
----------------------------------------------------------------------------------------
Crée l'animation interactive YouTube (Like + S'abonner + Cloche avec curseur réactif) :
- Rendu vidéo transparent ProRes 4444 avec canal Alpha
- Logos vectoriels purs (Pouce Like, Bouton Subscribe, Cloche vibrante, Curseur OS)
- Clics et ondes de choc réactives (changement d'état, morphing, sonnerie)
- Effets sonores synchronisés (clics de souris + tintement de cloche)
- 100% multilingue (anglais par défaut, français disponible)

Exemples d'utilisation :
-----------------------
# Version Standard Anglaise (Recommandé pour la chaîne) :
python scripts/generate_subscribe_cta.py \\
    --theme classic-red \\
    --pos bottom-center \\
    --out "episodes/01-ruja-ignatova/assets/texte_card/cta_subscribe_en.mov"

# Version Dark Gold (Signature Financial Forensics) :
python scripts/generate_subscribe_cta.py \\
    --theme dark-gold \\
    --pos bottom-right \\
    --scale 0.9 \\
    --out "episodes/01-ruja-ignatova/assets/texte_card/cta_subscribe_gold.mov"

# Version Française :
python scripts/generate_subscribe_cta.py \\
    --lang fr \\
    --out "episodes/01-ruja-ignatova/assets/texte_card/cta_subscribe_fr.mov"
"""

import argparse
import json
import os
import subprocess
import sys
import numpy as np
import soundfile as sf

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(HERE)
REMOTION_DIR = os.path.join(ROOT_DIR, "financial-forensics")


def generate_sfx_audio(duration_sec: float, fps: int = 25, sr: int = 48000) -> np.ndarray:
    """Génère les effets sonores des 3 clics et de la cloche parfaitement synchronisés."""
    total_samples = int(duration_sec * sr)
    audio = np.zeros((total_samples, 2), dtype=np.float32)

    # Moments des clics en frames
    frame_like = 33
    frame_sub = 63
    frame_bell = 93

    # Fonction pour créer un clic de souris sec et propre
    def add_click(sample_idx: int, volume: float = 0.45):
        click_len = int(0.015 * sr)
        t = np.linspace(0, 0.015, click_len, endpoint=False)
        # Bip court haute fréquence avec décroissance exponentielle
        freq = 1800.0
        decay = np.exp(-t * 600.0)
        wave = np.sin(2 * np.pi * freq * t) * decay * volume
        end_idx = min(total_samples, sample_idx + click_len)
        audio[sample_idx:end_idx, 0] += wave[: end_idx - sample_idx]
        audio[sample_idx:end_idx, 1] += wave[: end_idx - sample_idx]

    # Fonction pour créer un tintement de cloche doux
    def add_bell_chime(sample_idx: int, volume: float = 0.5):
        bell_len = int(0.6 * sr)
        t = np.linspace(0, 0.6, bell_len, endpoint=False)
        # Harmoniques métalliques (2400Hz + 4800Hz)
        decay = np.exp(-t * 8.0)
        wave = (
            0.7 * np.sin(2 * np.pi * 2150.0 * t) +
            0.3 * np.sin(2 * np.pi * 4300.0 * t)
        ) * decay * volume
        end_idx = min(total_samples, sample_idx + bell_len)
        audio[sample_idx:end_idx, 0] += wave[: end_idx - sample_idx]
        audio[sample_idx:end_idx, 1] += wave[: end_idx - sample_idx]

    # 1. Clic Like
    sample_like = int((frame_like / fps) * sr)
    add_click(sample_like, 0.4)

    # 2. Clic Subscribe
    sample_sub = int((frame_sub / fps) * sr)
    add_click(sample_sub, 0.5)

    # 3. Clic Cloche + Tintement
    sample_bell = int((frame_bell / fps) * sr)
    add_click(sample_bell, 0.4)
    add_bell_chime(sample_bell + int(0.005 * sr), 0.5)

    # Normalisation douce
    max_val = np.max(np.abs(audio))
    if max_val > 0:
        audio = audio / max_val * 0.85

    return audio


def main():
    parser = argparse.ArgumentParser(
        description="Générateur de Composant de Fidélisation YouTube (Like, Subscribe, Bell)"
    )
    parser.add_argument(
        "--theme",
        choices=["classic-red", "dark-gold", "glass-cyan"],
        default="classic-red",
        help="Thème visuel (défaut: classic-red)",
    )
    parser.add_argument(
        "--lang",
        choices=["en", "fr"],
        default="en",
        help="Langue des boutons: en (SUBSCRIBE) ou fr (S'ABONNER)",
    )
    parser.add_argument(
        "--pos", "--position",
        dest="position",
        choices=["bottom-center", "bottom-right", "bottom-left", "center"],
        default="bottom-center",
        help="Position à l'écran (défaut: bottom-center)",
    )
    parser.add_argument("--scale", type=float, default=1.0, help="Échelle du composant (défaut: 1.0)")
    parser.add_argument("--duration", type=float, default=5.0, help="Durée en secondes (défaut: 5.0)")
    parser.add_argument("--fps", type=int, default=25, help="Cadence FPS (défaut: 25)")
    parser.add_argument("--out", required=True, help="Chemin du fichier de sortie .mov")

    args = parser.parse_args()

    out_path = os.path.abspath(args.out)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)

    duration_frames = int(round(args.duration * args.fps))

    if args.lang == "fr":
        sub_text = "S'ABONNER"
        subbed_text = "ABONNÉ"
    else:
        sub_text = "SUBSCRIBE"
        subbed_text = "SUBSCRIBED"

    print("\n" + "=" * 65)
    print("🎬 GÉNÉRATEUR DU COMPOSANT DE FIDÉLISATION (Financial Forensics)")
    print("=" * 65)
    print(f"✨ Thème     : {args.theme.upper()}")
    print(f"🌐 Langue    : {args.lang.upper()} ('{sub_text}' ➔ '{subbed_text}')")
    print(f"📍 Position  : {args.position}")
    print(f"🔍 Scale     : {args.scale:.2f}")
    print(f"⏱️  Durée     : {args.duration:.2f}s ({duration_frames} frames @ {args.fps}fps)")
    print(f"📁 Sortie    : {out_path}")
    print("=" * 65 + "\n")

    input_props = {
        "theme": args.theme,
        "subscribeText": sub_text,
        "subscribedText": subbed_text,
        "position": args.position,
        "scale": args.scale,
        "durationInFrames": duration_frames,
    }

    props_json_str = json.dumps(input_props)

    temp_mov = out_path.replace(".mov", "_raw.mov")
    wav_out = out_path.replace(".mov", "_sfx.wav")

    # 1. Rendu Vidéo Remotion ProRes 4444 avec Alpha
    remotion_cmd = [
        "npx", "remotion", "render",
        "SubscribeCTA",
        temp_mov,
        f"--props={props_json_str}",
        "--codec=prores",
        "--prores-profile=4444",
        "--pixel-format=yuva444p10le",
        f"--frames=0-{duration_frames - 1}",
        "--gl=angle",
        "--concurrency=4",
        "--quiet",
    ]

    print("1️⃣  Rendu vidéo transparente ProRes 4444...")
    res = subprocess.run(remotion_cmd, cwd=REMOTION_DIR)
    if res.returncode != 0:
        print(f"❌ Erreur Remotion (Code {res.returncode})", file=sys.stderr)
        sys.exit(1)

    # 2. Synthèse Audio synchronisée
    print("2️⃣  Synthèse des effets sonores (Clics & Cloche)...")
    sfx_data = generate_sfx_audio(duration_sec=args.duration, fps=args.fps, sr=48000)
    sf.write(wav_out, sfx_data, 48000)
    print(f"   Fichier audio généré : {wav_out}")

    # 3. Muxing Vidéo + Audio synchronisé
    print("3️⃣  Muxing final...")
    mux_cmd = [
        "ffmpeg", "-y",
        "-i", temp_mov,
        "-i", wav_out,
        "-map", "0:v:0",
        "-map", "1:a:0",
        "-c:v", "copy",
        "-c:a", "pcm_s16le",
        out_path,
    ]
    res_mux = subprocess.run(mux_cmd, capture_output=True, text=True)
    if res_mux.returncode != 0:
        print(f"❌ Erreur FFmpeg : {res_mux.stderr}", file=sys.stderr)
        sys.exit(1)

    if os.path.exists(temp_mov):
        os.remove(temp_mov)

    print(f"\n✅ TERMINÉ ! Composant de fidélisation généré avec succès :\n   🎥 {out_path}\n")


if __name__ == "__main__":
    main()
