"""
Génération du montage cinématique FTX avec cadrage plafond direct et effondrement récursif
"""

import subprocess
import os
from pathlib import Path

BASE_DIR = Path("/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/episodes/02-ftx")
STORYBOARD_DIR = BASE_DIR / "assets/image-ai/storyboard_collapse"
TMP_DIR = BASE_DIR / "assets/generated-videos/tmp_collapse"
OUT_VIDEO = BASE_DIR / "assets/generated-videos/COLLAPSE_RECONSTRUCTION_PHOTOREALISTIC_1080p.mp4"

TMP_DIR.mkdir(parents=True, exist_ok=True)
OUT_VIDEO.parent.mkdir(parents=True, exist_ok=True)

f1 = STORYBOARD_DIR / "FRAME-01_plafond_vue_sol_plongee.jpg"
f1b = STORYBOARD_DIR / "FRAME-01B_effondrement_recursif_vertical.jpg"
f2 = STORYBOARD_DIR / "FRAME-02_effondrement_ruines_ftx.jpg"
f3 = STORYBOARD_DIR / "FRAME-03_reconstruction_arriere_reverse.jpg"

s1 = TMP_DIR / "shot1_ceiling_to_floor.mp4"
s2 = TMP_DIR / "shot2_recursive_collapse.mp4"
s3 = TMP_DIR / "shot3_ruins.mp4"
s4 = TMP_DIR / "shot4_reverse.mp4"

# Shot 1: Depuis le plafond, vue directe plongeante sur le sol (3.0s, 75 frames, très léger zoom/descente)
subprocess.run([
    "ffmpeg", "-y", "-loop", "1", "-i", str(f1),
    "-vf", "scale=1920:1080,zoompan=z='min(zoom+0.0012,1.10)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=75:s=1920x1080:fps=25",
    "-t", "3.0", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", "25", str(s1)
], check=True)

# Shot 2: Effondrement récursif vertical (3.5s, 88 frames, dézoom vertical révélant les étages qui s'effondrent)
subprocess.run([
    "ffmpeg", "-y", "-loop", "1", "-i", str(f1b),
    "-vf", "scale=1920:1080,zoompan=z='max(1.15-on*0.0018,1.0)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=88:s=1920x1080:fps=25",
    "-t", "3.5", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", "25", str(s2)
], check=True)

# Shot 3: Effondrement extérieur marina (3.0s, 75 frames, tremblement et poussière)
subprocess.run([
    "ffmpeg", "-y", "-loop", "1", "-i", str(f2),
    "-vf", "scale=1920:1080,zoompan=z='min(zoom+0.001,1.08)':x='iw/2-(iw/zoom/2)+sin(on*0.6)*2':y='ih/2-(ih/zoom/2)+cos(on*0.6)*1.5':d=75:s=1920x1080:fps=25",
    "-t", "3.0", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", "25", str(s3)
], check=True)

# Shot 4: Reconstruction (3.5s, 88 frames, travelling arrière et réassemblage)
subprocess.run([
    "ffmpeg", "-y", "-loop", "1", "-i", str(f3),
    "-vf", "scale=1920:1080,zoompan=z='max(1.15-on*0.0017,1.0)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=88:s=1920x1080:fps=25",
    "-t", "3.5", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", "25", str(s4)
], check=True)

# Concaténation avec transitions
concat_filter = (
    "[0:v][1:v]xfade=transition=fade:duration=0.5:offset=2.5[c1];"
    "[c1][2:v]xfade=transition=circlecrop:duration=0.5:offset=5.5[c2];"
    "[c2][3:v]xfade=transition=dissolve:duration=0.5:offset=8.0[vout]"
)

subprocess.run([
    "ffmpeg", "-y",
    "-i", str(s1), "-i", str(s2), "-i", str(s3), "-i", str(s4),
    "-filter_complex", concat_filter,
    "-map", "[vout]",
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", "25",
    str(OUT_VIDEO)
], check=True)

print(f">>> Vidéo master récursive finalisée : {OUT_VIDEO}")
