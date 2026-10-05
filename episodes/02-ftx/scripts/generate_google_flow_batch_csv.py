#!/usr/bin/env python3
"""
Generate Google Flow Batch CSV for Flow Batch Studio / KoseFlow / Google Flow Automator.
Formats the complete shot list of the Hook with prompts, ingredient image bindings, camera controls, and character tags.
"""

import csv
from pathlib import Path

WORKSPACE_ROOT = Path(__file__).resolve().parents[3]
OUTPUT_CSV_HOOK = WORKSPACE_ROOT / "episodes/02-ftx/google_flow_batch_hook.csv"

HOOK_SHOTS = [
    {
        "id": "HOOK_PLAN_01",
        "timecode": "0:00 - 0:03",
        "duration": "3s",
        "ingredient_image": "ENV_FTX_building_03_high_drone.jpg",
        "camera_motion": "Steep downward crane plunge, decelerating at ground level",
        "character_tag": "",
        "prompt": "Camera plunges in a steep vertical aerial dive from high overcast night sky down toward the modern 2-story corporate glass entrance of the FTX building in Nassau Bahamas. As the camera reaches ground level in front of the illuminated cyan entrance, a sudden blackout occurs, all lights abruptly shut off into deep darkness. Cinematic 35mm film, documentary realism, subtle lens flare, zero humans."
    },
    {
        "id": "HOOK_PLAN_02",
        "timecode": "0:03 - 0:06",
        "duration": "3s",
        "ingredient_image": "PROP_domestic_clock_table.jpg",
        "camera_motion": "Rapid zoom-in on the mechanical clock face",
        "character_tag": "",
        "prompt": "Macro tabletop shot of a vintage domestic mechanical desk clock resting on dark polished mahogany under warm 2700K brass lamp light. The ticking second hand jumps rhythmically, then suddenly freezes completely. Sudden tension in the air. 35mm anamorphic macro, shallow depth of field, dust motes in light beam."
    },
    {
        "id": "HOOK_PLAN_03",
        "timecode": "0:06 - 0:09",
        "duration": "3s",
        "ingredient_image": "ENV_FTX_building_04_lobby.jpg",
        "camera_motion": "Forward dolly push through glass sliding doors into reception",
        "character_tag": "",
        "prompt": "Cinematic forward tracking shot moving smoothly through the double glass automatic sliding doors into the opulent reception lobby of FTX in Nassau. The polished dark marble floor reflects warm ceiling lights. Floating surreal overlay of fluttering crisp banknotes in mid-air. Zero humans, pristine corporate grandeur. 35mm film look."
    },
    {
        "id": "HOOK_PLAN_04",
        "timecode": "0:09 - 0:13",
        "duration": "4s",
        "ingredient_image": "ENV_federal_archives_room.jpg",
        "camera_motion": "Slow lateral pan along long table with evidence boxes",
        "character_tag": "",
        "prompt": "Slow eye-level documentary pan across a long solid oak table in an institutional federal evidence examination room. Stacked brown cardboard boxes marked with bold black 'EVIDENCE' lettering and red tamper-evident tape. A faceless white porcelain mannequin wearing dark suit and white forensic cotton gloves lifts the top folder. Clean, clinical lighting, zero morphing."
    },
    {
        "id": "HOOK_PLAN_05",
        "timecode": "0:13 - 0:16",
        "duration": "3s",
        "ingredient_image": "09_bitcoin_extreme_macro.jpg",
        "camera_motion": "Slow forward macro push toward single golden coin",
        "character_tag": "",
        "prompt": "Extreme macro cinematic shot of a single physical gold Bitcoin resting alone on a cold brushed-metal platter in the center of an empty conference table. A surgical overhead spotlight illuminates the sharp relief grooves of the coin. The camera slowly zooms in on the embossed 'B' symbol. Atmospheric reverberant darkness, pure isolation."
    },
    {
        "id": "HOOK_PLAN_06",
        "timecode": "0:16 - 0:19",
        "duration": "3s",
        "ingredient_image": "PROP_cash_duffle_bag.jpg",
        "camera_motion": "Static macro with subtle slow tilt-down",
        "character_tag": "",
        "prompt": "Investigative documentary insert shot of an unzipped black canvas sports duffle bag overflowing with thick stacks of genuine US hundred-dollar bills bound with official bank currency straps. A white evidence tag attached to the zipper flap reads 'ITEM 03'. Warm side directional tungsten lighting, sharp tactile textures, 35mm film grain."
    },
    {
        "id": "HOOK_PLAN_07",
        "timecode": "0:19 - 0:24",
        "duration": "5s",
        "ingredient_image": "ENV_bank_vault_safe_deposit_gold.jpg",
        "camera_motion": "Smooth lateral tracking shot along safe deposit boxes, slow push in",
        "character_tag": "",
        "prompt": "Fluid cinematic tracking shot along an endless wall of brushed brass and steel safe deposit boxes in a high-security subterranean bank vault. The camera decelerates and slowly pushes into one open drawer on a metal table, catching the gleaming specular reflections on two solid 1kg gold bullion bars resting inside. Solemn, monumental atmosphere, 35mm lens."
    },
    {
        "id": "HOOK_PLAN_08",
        "timecode": "0:24 - 0:28",
        "duration": "4s",
        "ingredient_image": "ENV_FTX_building_01_front.jpg",
        "camera_motion": "Slow upward tilt toward glowing cyan FTX sign",
        "character_tag": "",
        "prompt": "Cinematic low-angle exterior shot of the 2-story FTX headquarters building in Nassau Bahamas at twilight. Wet asphalt street reflects the bright cyan neon FTX sign above the glass entrance. Palm trees swaying slightly in the evening breeze. The camera tilts slowly upwards toward the dark tropical sky. 35mm film photography."
    },
    {
        "id": "HOOK_PLAN_09",
        "timecode": "0:28 - 0:32",
        "duration": "4s",
        "ingredient_image": "PROP_isolated_crt_television.jpg",
        "camera_motion": "Static shot with subtle electrical scanline flicker on CRT tube",
        "character_tag": "",
        "prompt": "Close-up of a vintage 1990s curved glass cathode-ray tube CRT television in a dark room. The curved phosphorescent screen flickers with electrical scanlines, displaying a stylized retro financial news broadcast where faceless suited mannequins gesticulate on a studio panel. Lower ticker tape rapidly scrolls: 'FTX CHAPTER 11 -- $32B TO ZERO'. Analog cathode hum."
    },
    {
        "id": "HOOK_PLAN_10",
        "timecode": "0:32 - 0:36",
        "duration": "4s",
        "ingredient_image": "ENV_bedroom_vintage_crt.jpg",
        "camera_motion": "Rapid dolly zoom into the glowing blue television screen",
        "character_tag": "",
        "prompt": "The camera pulls back slightly revealing the CRT television sitting on an old wooden table in a dimly lit, weathered bedroom. Suddenly, the camera accelerates violently in a warp-speed dolly zoom directly into the center of the glowing blue television tube until the pixel grid fills the entire screen. Visceral immersive transition."
    },
    {
        "id": "HOOK_PLAN_11",
        "timecode": "0:36 - 0:40",
        "duration": "4s",
        "ingredient_image": "18_indictment_folder_stamp.jpg",
        "camera_motion": "Brutal static macro lock-off",
        "character_tag": "@SBF",
        "prompt": "Sharp abrupt macro cut: Heavy stainless steel police handcuffs snap firmly shut onto the wrists of @SBF (faceless matte white porcelain mannequin in oversized dark charcoal t-shirt). In the blurred deep background, the grand stone pillars of the Southern District of New York federal courthouse with flashing red and blue police emergency lights. Hard dramatic shadows."
    },
    {
        "id": "HOOK_PLAN_12",
        "timecode": "0:40 - 0:42",
        "duration": "2s",
        "ingredient_image": "ENV_FTX_building_05_corridor.jpg",
        "camera_motion": "Slow forward tracking shot down empty corridor",
        "character_tag": "",
        "prompt": "Quiet, solemn slow tracking shot down the empty corporate corridor of FTX. Matte beige drywalls, closed dark mahogany office doors, muted dark carpet absorbing all reflections. Solitary, abandoned executive atmosphere. 35mm film still."
    },
    {
        "id": "HOOK_PLAN_13",
        "timecode": "0:42 - 0:45",
        "duration": "3s",
        "ingredient_image": "ENV_sbf_penthouse_01_desk_empty.jpg",
        "camera_motion": "Continuous dolly push through sliding glass door into the penthouse office",
        "character_tag": "@SBF",
        "prompt": "Smooth cinematic camera push moving past the dark balcony glass into the executive penthouse office in Albany Nassau. Seated behind the wooden desk is @SBF (bald white porcelain mannequin, oversized charcoal tee), slumped forward with elbows on the desk, face buried in hands under the warm brass desk lamp. Outside the floor-to-ceiling windows is the pitch black ocean. Total silence. Fade to black."
    }
]

def generate_csv():
    OUTPUT_CSV_HOOK.parent.mkdir(parents=True, exist_ok=True)
    fieldnames = [
        "id",
        "timecode",
        "duration",
        "prompt",
        "ingredient_image",
        "camera_motion",
        "character_tag",
        "model",
        "aspect_ratio"
    ]

    with open(OUTPUT_CSV_HOOK, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for shot in HOOK_SHOTS:
            row = dict(shot)
            row["model"] = "Veo 3.1"
            row["aspect_ratio"] = "16:9"
            writer.writerow(row)

    print(f"[✓] Successfully generated Google Flow batch CSV: {OUTPUT_CSV_HOOK}")
    print(f"    Total shots configured: {len(HOOK_SHOTS)}")

if __name__ == "__main__":
    generate_csv()
