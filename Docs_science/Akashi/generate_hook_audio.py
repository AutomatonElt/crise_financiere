import os
import subprocess

audio_dir = "/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/audio"
os.makedirs(audio_dir, exist_ok=True)

voice = "en-US-ChristopherNeural"
rate = "-6%" # Calm documentary cadence

narrations = [
    ("S002_narration.mp3", "January 17th, 1995. Kobe, Japan. 5:46 in the morning. It is still dark."),
    ("S003_narration.mp3", "A few kilometers offshore, two steel towers rise from the Akashi Strait, each as tall as a skyscraper."),
    ("S004_narration.mp3", "Between them hang the cables of a bridge that, in three years, will be the longest of its kind ever built."),
    ("S005_narration.mp3", "Then... the ground moves."),
    ("S006_narration.mp3", "It will become the deadliest earthquake to strike Japan since 1923."),
    ("S011_narration.mp3", "Kobe will spend years recovering. But out on the water, something else has happened."),
    ("S012_narration.mp3", "According to the engineers' own report, it was the first time a large earthquake had ever struck a major suspension bridge under construction."),
    ("S013_narration.mp3", "And when they measure the bridge, they find that the earthquake has made it longer."),
    ("S014_narration.mp3", "By almost a meter."),
    ("S015_narration.mp3", "In the next few minutes, you will see how they found out. Why the bridge did not break."),
    ("S017_narration.mp3", "And how a few hundred millimeters of steel put the longest bridge in the world back together."),
    ("S019_narration.mp3", "And at the end, I will show you something about this bridge that changes every day... by even more than the earthquake did.")
]

print("Generating voiceover audio for Hook...")
for filename, text in narrations:
    out_path = os.path.join(audio_dir, filename)
    cmd = [
        "python3", "-m", "edge_tts",
        f"--voice={voice}",
        f"--rate={rate}",
        f"--text={text}",
        f"--write-media={out_path}"
    ]
    subprocess.run(cmd, check=True)
    print(f"Generated: {filename}")

print("\nAll Hook narration audios generated successfully in:", audio_dir)
