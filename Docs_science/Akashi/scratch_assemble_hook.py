import os
import subprocess

renders_dir = "/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/renders"

clips = [
    "S001_noir.mp4",
    "S002_kobe_nuit.mp4",
    "S003_survol_aube.mp4",
    "S004_cable_travelling.mp4",
    "S005_noir.mp4",
    "S006_tuiles.mp4",
    "S007_tour_secousse.mp4",
    "S008_cable_secousse.mp4",
    "S009_ferry_quai.mp4",
    "S010_lampe.mp4",
    "S011_aube_calme.mp4",
    "S012_tower_approach.mp4",
    "S013_S014_regle_compteur.mp4",
    "S015_theodolite.mp4",
    "S016_filaire_rotation.mp4",
    "S017_usine_treillis.mp4",
    "S018_pont_survol.mp4",
    "S019_crepuscule_finale.mp4"
]

print("Checking presence of all 18 Hook clips:")
all_present = True
for clip in clips:
    path = os.path.join(renders_dir, clip)
    exists = os.path.isfile(path)
    size = os.path.getsize(path) if exists else 0
    print(f" - {clip}: {'OK' if exists and size > 1000 else 'MISSING'}")
    if not exists or size < 1000:
        all_present = False

if all_present:
    print("\nAll 18 clips present! Building filter_complex for seamless assembly...")
    inputs = []
    filter_parts = []
    for i, clip in enumerate(clips):
        path = os.path.join(renders_dir, clip)
        inputs.extend(["-i", path])
        filter_parts.append(f"[{i}:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=24[v{i}];")
    
    concat_inputs = "".join(f"[v{i}]" for i in range(len(clips)))
    filter_graph = "".join(filter_parts) + f"{concat_inputs}concat=n={len(clips)}:v=1:a=0[vout]"
    
    out_master = os.path.join(renders_dir, "HOOK_00_00_to_01_28.mp4")
    cmd = [
        "ffmpeg", "-y",
        *inputs,
        "-filter_complex", filter_graph,
        "-map", "[vout]",
        "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
        out_master
    ]
    print("Running ffmpeg concat...")
    subprocess.run(cmd, check=True)
    print("Hook master video created successfully at:", out_master)
else:
    print("Waiting for remaining clips to be rendered before final assembly.")
