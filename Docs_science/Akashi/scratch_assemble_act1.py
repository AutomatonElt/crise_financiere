import os
import subprocess

renders_dir = "/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/renders"
audio_dir = "/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/audio"

act1_clips = [
    "S020_carte_japon_zoom.mp4",
    "S021_kobe_cote_survol.mp4",
    "S022_detroit_panoramique.mp4",
    "S023_ferry_traversee.mp4",
    "S024_chenal_maritime_topdown.mp4",
    "S025_ferry_brume.mp4",
    "S026_texte_168_100.mp4",
    "S027_routes_cartes.mp4",
    "S028_regles_chenal.mp4",
    "S029_S030_regle_1990m.mp4",
    "S031_tacoma_narrows.mp4",
    "S032_soufflerie_40m.mp4",
    "S033_fumee_treillis.mp4",
    "S034_S035_failles_sismiques.mp4",
    "S036_timelapse_construction.mp4"
]

print("Checking presence of Act 1 clips:")
for clip in act1_clips:
    p = os.path.join(renders_dir, clip)
    exists = os.path.isfile(p)
    sz = os.path.getsize(p) if exists else 0
    print(f" - {clip}: {'OK' if exists and sz > 1000 else 'MISSING'}")

inputs = []
filter_parts = []
for i, clip in enumerate(act1_clips):
    path = os.path.join(renders_dir, clip)
    inputs.extend(["-i", path])
    filter_parts.append(f"[{i}:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=24[v{i}];")

concat_inputs = "".join(f"[v{i}]" for i in range(len(act1_clips)))
filter_graph = "".join(filter_parts) + f"{concat_inputs}concat=n={len(act1_clips)}:v=1:a=0[vout]"

out_act1 = os.path.join(renders_dir, "ACT1_01_28_to_03_25.mp4")
cmd = [
    "ffmpeg", "-y",
    *inputs,
    "-filter_complex", filter_graph,
    "-map", "[vout]",
    "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
    out_act1
]
print("\nConcatenating Act 1 video master...")
subprocess.run(cmd, check=True)
print("Act 1 video master ready at:", out_act1)

# Now mix Act 1 narration audio
cue_points_act1 = [
    ("S020_narration.mp3", 0.5),
    ("S021_narration.mp3", 4.9),
    ("S022_narration.mp3", 11.6),
    ("S023_narration.mp3", 17.0),
    ("S024_narration.mp3", 20.2),
    ("S025_narration.mp3", 27.4),
    ("S026_narration.mp3", 33.6),
    ("S027_narration.mp3", 41.2),
    ("S028_narration.mp3", 47.3),
    ("S029_narration.mp3", 53.0),
    ("S030_narration.mp3", 64.0),
    ("S031_narration.mp3", 67.5),
    ("S032_narration.mp3", 77.0),
    ("S033_narration.mp3", 86.3),
    ("S034_narration.mp3", 98.2),
    ("S035_narration.mp3", 105.0),
    ("S036_narration.mp3", 116.5)
]

audio_inputs = ["-i", out_act1]
audio_filters = []
for i, (mp3_file, delay_sec) in enumerate(cue_points_act1, start=1):
    mp3_path = os.path.join(audio_dir, mp3_file)
    audio_inputs.extend(["-i", mp3_path])
    delay_ms = int(delay_sec * 1000)
    audio_filters.append(f"[{i}:a]adelay={delay_ms}|{delay_ms}[a{i}];")

mix_in = "".join(f"[a{i}]" for i in range(1, len(cue_points_act1) + 1))
audio_graph = "".join(audio_filters) + f"{mix_in}amix=inputs={len(cue_points_act1)}:duration=first:dropout_transition=2[aout]"

out_act1_av = os.path.join(renders_dir, "ACT1_01_28_to_03_25_AV.mp4")
cmd_av = [
    "ffmpeg", "-y",
    *audio_inputs,
    "-filter_complex", audio_graph,
    "-map", "0:v",
    "-map", "[aout]",
    "-c:v", "copy",
    "-c:a", "aac", "-b:a", "192k",
    out_act1_av
]
print("Muxing Act 1 narration audio...")
subprocess.run(cmd_av, check=True)
print("Act 1 AV master complete at:", out_act1_av)
