#!/usr/bin/env python3
"""
Batch Asset Generator for Financial Forensics (FTX Episode 02)
Generates all remaining missing environments and atomic props using Snapgen's nano-banana-pro.
"""

import sys
import time
from pathlib import Path
from generate_snapgen_asset import generate_image

ASSETS = [
    # 1. PENTHOUSE SBF MULTI-ANGLE SYSTEM
    {
        "output": "episodes/02-ftx/assets/image-ai/environments/ENV_sbf_penthouse_01_desk_empty.jpg",
        "prompt": "Cinematic eye-level documentary wide still inside a luxury penthouse corner office in Nassau Bahamas at night. An executive wooden desk with three black widescreen monitors turned off. Warm brass desk lamp casting light on scattered papers and an empty black swivel desk chair. Floor-to-ceiling dark glass windows showing distant harbor lights in the black night. Clean composition, zero humans, silent corporate aftermath. 35mm film still, fine grain.",
    },
    {
        "output": "episodes/02-ftx/assets/image-ai/environments/ENV_sbf_penthouse_02_reverse_balcony.jpg",
        "prompt": "Cinematic reverse angle interior shot from behind an executive desk inside a modern luxury penthouse in Albany Nassau at night. Looking forward across the open-plan minimalist living room towards large sliding glass balcony doors. Outside the balcony is the pitch black tropical ocean with faint marina lights. Clean wooden flooring, subtle warm ambient lighting, peaceful and quiet. Zero humans, nobody in frame. 35mm film still.",
    },
    {
        "output": "episodes/02-ftx/assets/image-ai/environments/ENV_sbf_penthouse_03_beanbag_corner.jpg",
        "prompt": "Low-angle documentary interior shot inside a corner of a luxury Nassau Bahamas penthouse. On the hardwood floor lies a large wrinkled dark navy fabric beanbag, deflated and worn out. Tangled black power strips, charging cables, two empty crushed soda cans, and a half-opened instant noodle cardboard cup with a plastic fork on the floor. Melancholic authentic startup aftermath, warm dim side lamp casting soft shadows. Zero humans. 35mm lens, natural grain.",
    },
    {
        "output": "episodes/02-ftx/assets/image-ai/environments/ENV_sbf_penthouse_04_bedroom.jpg",
        "prompt": "Documentary still of a dim, messy bedroom in a luxury Bahamas penthouse. An unmade king platform bed with rumpled charcoal grey linen sheets and flat pillows. On the wooden bedside table sits an open plastic prescription pill bottle and a closed silver laptop. Dark walls, heavy blackout curtains half-drawn revealing dim night ambient light outside. Muted moody lighting, feeling of exhaustion and isolation. Zero humans. Kodak Vision3 500T 35mm look.",
    },

    # 2. KEY ENVIRONMENTS ACROSS THE 19:19 SCRIPT
    {
        "output": "episodes/02-ftx/assets/image-ai/environments/ENV_bank_vault_safe_deposit_gold.jpg",
        "prompt": "Cinematic wide documentary shot inside a high-security bank vault. Walls covered with rows of brushed brass and stainless steel safe deposit box drawers. In the center, one deposit drawer is pulled open on a dark metal table, revealing two solid heavy 1kg gold bullion bars under a directed 3200K brass overhead lamp. Reflections on the gold, matte industrial vault floor. Zero humans, solemn and monumental. 35mm film still.",
    },
    {
        "output": "episodes/02-ftx/assets/image-ai/environments/ENV_cz_binance_office_dubai.jpg",
        "prompt": "Wide cinematic shot inside an ultra-minimalist executive skyscraper office in Dubai at night. A massive floor-to-ceiling glass wall looking out over an illuminated futuristic metropolis skyline. Dark polished stone floor reflecting the city lights. One simple sleek matte black conference desk with a single minimalist tablet lying flat. High contrast, cool modern tones, powerful corporate solitude. Zero humans. 35mm anamorphic still.",
    },
    {
        "output": "episodes/02-ftx/assets/image-ai/environments/ENV_federal_archives_room.jpg",
        "prompt": "Eye-level documentary shot inside a quiet government archival records room. A long solid oak inspection table under cool neutral 4000K fluorescent institutional ceiling panels. On the table are stacked brown cardboard archive boxes stamped with large black bold letters reading 'EVIDENCE', tied with red sealing tape. Clean, clinical, austere legal environment. Zero humans. 35mm documentary photography.",
    },
    {
        "output": "episodes/02-ftx/assets/image-ai/environments/ENV_bedroom_vintage_crt.jpg",
        "prompt": "Moody atmospheric wide shot of a small, dimly lit bedroom at night. On an old dark wooden side table sits an iconic 1990s vintage cathode-ray tube CRT television. The TV screen is glowing with a soft static blue phosphorescent light, casting blue ambient reflections across the dark plaster walls and simple wooden floor. Melancholic, nostalgic retro atmosphere. Zero humans. 35mm film still, analog warmth.",
    },
    {
        "output": "episodes/02-ftx/assets/image-ai/environments/ENV_courtroom_witness_stand.jpg",
        "prompt": "Cinematic wide interior shot inside the Southern District of New York federal courtroom in Manhattan. Rich dark mahogany wood wall paneling, elevated empty judge bench in background. In the foreground, the wooden witness stand with a vintage brass gooseneck microphone and a clear glass of water on the railing. Cool daylight through high frosted windows mixed with warm courtroom lamps. Imposing, solemn justice atmosphere. Zero humans. 35mm film still.",
    },
    {
        "output": "episodes/02-ftx/assets/image-ai/environments/ENV_mendota_cell_door.jpg",
        "prompt": "Straight-on eye-level documentary still of a heavy industrial federal prison cell door painted in matte institutional grey enamel. Heavy steel rivets, closed narrow horizontal viewing slit with scratched glass. Bolted directly onto the steel door is a small stamped metal identification plaque reading in embossed industrial font: 'REG. 07729-506 // 12/2044'. Cold dim corridor fluorescent tube overhead casting harsh vertical shadows. Zero humans. 35mm film still.",
    },

    # 3. ATOMIC PROPS
    {
        "output": "episodes/02-ftx/assets/image-ai/props/PROP_cash_duffle_bag.jpg",
        "prompt": "Close-up macro documentary shot of a heavy black nylon sports duffle bag unzipped on a dark wooden table. The interior is overflowing with thick banded stacks of crisp genuine US 100 dollar bills, held together with blue and yellow bank paper currency straps. Dramatic warm side lighting from a brass desk lamp. Forensic investigative photo, 35mm film macro, sharp textures.",
    },
    {
        "output": "episodes/02-ftx/assets/image-ai/props/PROP_ftt_plastic_coin.jpg",
        "prompt": "Extreme macro photographic still of a single cryptocurrency token made of cheap translucent blue plastic, embossed with the letters 'FTT'. It rests on a reflective dark glass tabletop under sharp studio side rim lighting. The plastic token looks lightweight, synthetic, and hollow like an arcade chip. Forensic macro product photography, shallow depth of field, 35mm lens.",
    },
    {
        "output": "episodes/02-ftx/assets/image-ai/props/PROP_5_sentence_blocks.jpg",
        "prompt": "Cinematic studio product still on a pitch-black surface. Five solid dark ebony wooden geometric blocks arranged in a horizontal row, representing asymmetric criminal sentences. On the left is an enormous, towering rectangular wooden monolith standing tall. Next to it are three medium blocks, and on the far right are two extremely thin, flat wooden strips almost flush with the table. Dramatic sharp white rim lighting against pure darkness. Minimalist metaphor, 35mm macro.",
    },
]


def run_batch():
    print(f"=== Starting Batch Generation of {len(ASSETS)} Assets via Snapgen (nano-banana-pro) ===")
    success_count = 0

    for i, item in enumerate(ASSETS, 1):
        target = Path(item["output"])
        print(f"\n--- [{i}/{len(ASSETS)}] Target: {target.name} ---")
        if target.exists() and target.stat().st_size > 10000:
            print(f"[i] Already exists ({target.stat().st_size:,} bytes), skipping.")
            success_count += 1
            continue

        try:
            ok = generate_image(
                prompt=item["prompt"],
                output_path=item["output"],
                model="nano-banana-pro",
                aspect_ratio="16:9",
                timeout=240
            )
            if ok:
                success_count += 1
            else:
                print(f"[!] Warning: failed for {target.name}, trying with alternative model...")
                ok_retry = generate_image(
                    prompt=item["prompt"],
                    output_path=item["output"],
                    model="nano-banana-2",
                    aspect_ratio="16:9",
                    timeout=240
                )
                if ok_retry:
                    success_count += 1
        except Exception as e:
            print(f"[-] Exception while generating {target.name}: {e}")

        # Rate-limiting safety pause
        time.sleep(3)

    print(f"\n=== Batch Complete: {success_count}/{len(ASSETS)} assets generated successfully ===")


if __name__ == "__main__":
    run_batch()
