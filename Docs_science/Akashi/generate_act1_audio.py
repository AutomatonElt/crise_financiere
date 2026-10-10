import os
import subprocess

audio_dir = "/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/audio"
os.makedirs(audio_dir, exist_ok=True)

voice = "en-US-ChristopherNeural"
rate = "-6%"

narrations_act1 = [
    ("S020_narration.mp3", "To understand what is at stake, look at the place."),
    ("S021_narration.mp3", "On one side of the strait, Kobe, a port city pressed between mountains and sea."),
    ("S022_narration.mp3", "On the other, Awaji Island. Four kilometers of water between them."),
    ("S023_narration.mp3", "For generations, people crossed by ferry."),
    ("S024_narration.mp3", "And this is no quiet channel. It is one of the busiest sea lanes in Japan."),
    ("S025_narration.mp3", "In 1955, in thick fog, a ferry sank in the Seto Inland Sea."),
    ("S026_narration.mp3", "A hundred and sixty-eight people died. A hundred of them were schoolchildren, on a class trip."),
    ("S027_narration.mp3", "The disaster helped push Japan toward an idea: link its islands with bridges."),
    ("S028_narration.mp3", "Here, the shipping lane sets the rules. No pillars in the channel."),
    ("S029_narration.mp3", "So the design is a single leap: almost two kilometers between two towers, with nothing underneath. Longer than any bridge of its kind ever built."),
    ("S030_narration.mp3", "Everything is designed around that distance."),
    ("S031_narration.mp3", "The first enemy is wind. In 1940, a bridge in Washington State opened in July... and tore itself apart in November."),
    ("S032_narration.mp3", "So the Japanese team builds a model of the entire bridge, forty meters long, and tests it in a wind tunnel."),
    ("S033_narration.mp3", "The road deck becomes an open steel frame, so the wind passes through it. The bridge is built to survive winds of about 180 miles per hour."),
    ("S034_narration.mp3", "The second enemy is the ground. The bridge is designed for a magnitude 8.5 earthquake."),
    ("S035_narration.mp3", "And the engineers make a decision that will matter more than any other. They map the region's active faults... and place the foundations away from them."),
    ("S036_narration.mp3", "Seven years of work. Everything on schedule.")
]

print("Generating Act 1 voiceover audios...")
for filename, text in narrations_act1:
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

print("\nAct 1 narrations complete!")
