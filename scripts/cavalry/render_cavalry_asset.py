#!/usr/bin/env python3
"""
Pipeline d'automatisation Cavalry via WhyCavalry / Claude Bridge.
Exécute un script procédural dans Cavalry, effectue le rendu frame par frame
en haute résolution Skia native, et compile la séquence en vidéo MP4 fluide.
"""

import os
import sys
import time
import subprocess
from pathlib import Path
from run_cavalry_script import execute_in_cavalry

WORKSPACE_ROOT = Path("/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp")
RENDERS_DIR = WORKSPACE_ROOT / "financial-forensics" / "public" / "cavalry_renders"
SCRATCH_DIR = WORKSPACE_ROOT / "scratch"

def render_sequence_from_cavalry(scene_name: str, build_script_code: str, start_frame: int, end_frame: int, fps: int = 25) -> str:
    """
    1. Exécute le script pour configurer la scène dans Cavalry
    2. Rendu synchrone des frames PNG via api.renderPNGFrame
    3. Assemblage en MP4 via ffmpeg
    """
    RENDERS_DIR.mkdir(parents=True, exist_ok=True)
    frames_dir = SCRATCH_DIR / f"cavalry_seq_{scene_name}"
    frames_dir.mkdir(parents=True, exist_ok=True)
    
    # Nettoyage des anciennes frames
    for f in frames_dir.glob("*.png"):
        f.unlink()

    print(f"\n========================================================")
    print(f"🎬 [WhyCavalry AI] Génération de la scène '{scene_name}'")
    print(f"========================================================")
    
    # Étape 1 : Construction de la scène
    print(f"1️⃣ Envoi du script procédural à Cavalry...")
    ok = execute_in_cavalry(build_script_code)
    if not ok:
        raise RuntimeError(f"Échec de l'exécution du script de scène pour {scene_name}")
    print(f"✅ Scène active configurée dans Cavalry.")

    # Étape 2 : Rendu frame par frame
    wine_frames_path = f"Z:{frames_dir.as_posix()}"
    render_code = f"""
    (function() {{
      var start = {start_frame};
      var end = {end_frame};
      var dir = "{wine_frames_path}";
      var total = end - start + 1;
      for (var f = start; f <= end; f++) {{
        api.setFrame(f);
        var pad = ("0000" + f).slice(-4);
        api.renderPNGFrame(dir + "/frame_" + pad + ".png", 100);
      }}
      return JSON.stringify({{ status: "RENDER_COMPLETE", framesRendered: total }});
    }})();
    """
    print(f"2️⃣ Rendu natif Cavalry ({end_frame - start_frame + 1} frames de {start_frame} à {end_frame})...")
    t0 = time.time()
    render_timeout = max(60.0, float(end_frame - start_frame + 1) * 2.5)
    ok_render = execute_in_cavalry(render_code, timeout=render_timeout)
    if not ok_render:
        raise RuntimeError(f"Échec du rendu des frames pour {scene_name}")
    elapsed = time.time() - t0
    print(f"✅ Rendu terminé en {elapsed:.1f}s ({elapsed / (end_frame - start_frame + 1):.2f}s/frame).")

    # Étape 3 : Compilation FFmpeg en MP4
    output_mp4 = RENDERS_DIR / f"{scene_name}.mp4"
    if output_mp4.exists():
        output_mp4.unlink()

    ffmpeg_cmd = [
        "ffmpeg", "-y",
        "-framerate", str(fps),
        "-start_number", str(start_frame),
        "-i", str(frames_dir / "frame_%04d.png"),
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-crf", "16",
        "-preset", "fast",
        str(output_mp4)
    ]
    print(f"3️⃣ Compilation FFmpeg vers {output_mp4.name}...")
    subprocess.run(ffmpeg_cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
    print(f"🎉 Asset vidéo généré avec succès : {output_mp4}")
    return str(output_mp4)

if __name__ == "__main__":
    print("Module render_cavalry_asset prêt.")
