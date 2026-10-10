"""
Génération de la vidéo cinématique pour la coupe médico-légale FTX / Backdoor / Alameda
========================================================================================
Assemble les 2 étapes du diorama médico-légal en 1080p 25fps :
1. Plan 1 (0:00 - 0:04.5) : Le Siège de Nassau en haut, le coffre plein et le siphonnage du backdoor vers Alameda.
2. Plan 2 (0:04.5 - 0:09) : Le coffre vidé, l'alerte rouge DEFICIT -$8,000,000,000 et le zoom sur l'unique Bitcoin restant ($20,000).
"""

import subprocess
from pathlib import Path

BASE_DIR = Path("/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/episodes/02-ftx")
IMG_DIR = BASE_DIR / "assets/image-ai/storyboard_forensic_diorama"
OUT_VIDEO = BASE_DIR / "assets/generated-videos/FTX_FORENSIC_DIORAMA_BACKDOOR_1080p.mp4"

img1 = IMG_DIR / "DIORAMA-01_siphonnage_backdoor_alameda.jpg"
img2 = IMG_DIR / "DIORAMA-02_coffre_vide_trou_8_milliards.jpg"

OUT_VIDEO.parent.mkdir(parents=True, exist_ok=True)
tmp_dir = BASE_DIR / "assets/generated-videos/tmp_diorama"
tmp_dir.mkdir(parents=True, exist_ok=True)

s1 = tmp_dir / "part1_siphoning.mp4"
s2 = tmp_dir / "part2_deficit.mp4"

# Part 1 : Travelling horizontal lent révélant le siphonnage (4.5s = 112 frames)
subprocess.run([
    "ffmpeg", "-y", "-loop", "1", "-i", str(img1),
    "-vf", "scale=1920:1080,zoompan=z='1.04':x='iw/2-(iw/zoom/2)-on*0.4':y='ih/2-(ih/zoom/2)+on*0.2':d=112:s=1920x1080:fps=25",
    "-t", "4.5", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", "25", str(s1)
], check=True)

# Part 2 : Zoom dramatique vers le trou béant et le Bitcoin isolé (4.5s = 112 frames)
subprocess.run([
    "ffmpeg", "-y", "-loop", "1", "-i", str(img2),
    "-vf", "scale=1920:1080,zoompan=z='min(zoom+0.0018,1.18)':x='iw*0.4-(iw/zoom*0.4)':y='ih*0.7-(ih/zoom*0.7)':d=112:s=1920x1080:fps=25",
    "-t", "4.5", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", "25", str(s2)
], check=True)

# Concaténation avec transition flash / glitch de rupture
subprocess.run([
    "ffmpeg", "-y",
    "-i", str(s1), "-i", str(s2),
    "-filter_complex", "[0:v][1:v]xfade=transition=fadeblack:duration=0.6:offset=4.0[vout]",
    "-map", "[vout]",
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", "25",
    str(OUT_VIDEO)
], check=True)

print(f">>> Vidéo diorama médico-légal générée : {OUT_VIDEO}")
