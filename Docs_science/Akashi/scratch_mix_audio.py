import os
import subprocess

renders_dir = "/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/renders"
audio_dir = "/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/audio"

cue_points = [
    ("S002_narration.mp3", 5.2),
    ("S003_narration.mp3", 11.4),
    ("S004_narration.mp3", 19.2),
    ("S005_narration.mp3", 28.4),
    ("S006_narration.mp3", 32.0),
    ("S011_narration.mp3", 37.2),
    ("S012_narration.mp3", 43.6),
    ("S013_narration.mp3", 53.5),
    ("S014_narration.mp3", 60.1),
    ("S015_narration.mp3", 63.4),
    ("S017_narration.mp3", 70.2),
    ("S019_narration.mp3", 77.2)
]

video_master = os.path.join(renders_dir, "HOOK_00_00_to_01_28.mp4")
final_master = os.path.join(renders_dir, "HOOK_00_00_to_01_28_AV.mp4")

if not os.path.isfile(video_master):
    print("Video master not ready yet.")
else:
    print("Building full narration soundtrack with precise timecode delays...")
    inputs = ["-i", video_master]
    filter_parts = []
    
    for i, (mp3_file, delay_sec) in enumerate(cue_points, start=1):
        mp3_path = os.path.join(audio_dir, mp3_file)
        inputs.extend(["-i", mp3_path])
        delay_ms = int(delay_sec * 1000)
        filter_parts.append(f"[{i}:a]adelay={delay_ms}|{delay_ms}[a{i}];")
    
    mix_inputs = "".join(f"[a{i}]" for i in range(1, len(cue_points) + 1))
    filter_graph = "".join(filter_parts) + f"{mix_inputs}amix=inputs={len(cue_points)}:duration=first:dropout_transition=2[aout]"
    
    cmd = [
        "ffmpeg", "-y",
        *inputs,
        "-filter_complex", filter_graph,
        "-map", "0:v",
        "-map", "[aout]",
        "-c:v", "copy",
        "-c:a", "aac", "-b:a", "192k",
        final_master
    ]
    subprocess.run(cmd, check=True)
    print("Full Audio-Video Hook Master created at:", final_master)
