#!/usr/bin/env python3
"""
Génère les mannequins maîtres (1 image de face par personnage) via Snapgen / nano-banana-pro.
Ces images sont ensuite importées dans Google Flow comme « personnages » (option Body).

Usage (depuis la racine du workspace) :
    .venv/bin/python episodes/02-ftx/scripts/generate_mannequins.py            # tous
    .venv/bin/python episodes/02-ftx/scripts/generate_mannequins.py SBF ENQ    # sélection
"""
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from generate_snapgen_asset import generate_image  # noqa: E402

OUT_DIR = "episodes/02-ftx/assets/image-ai/characters"

# Descripteur universel : identique pour TOUS les mannequins (à coller aussi dans Flow).
MAN = (
    "Smooth matte white mannequin with a perfectly human, natural anatomy, sculpted as one single "
    "continuous seamless surface like a smooth white plaster statue. Faceless egg-shaped head with no "
    "hair, no ears and no facial features. The neck, shoulders, arms, elbows, wrists, hands, fingers, "
    "legs and knees are completely smooth and continuous, with no joints, no seams, no cuts, no gaps, "
    "no segmentation and no mechanical parts: not a robot, not an artist's wooden doll. Hands are "
    "natural human hands with five softly sculpted fingers, smooth and realistic. Wearing shoes. Full "
    "body from head to shoes, standing in a neutral front-facing pose with arms relaxed, on a plain "
    "light-grey seamless studio background, soft even studio light, photographic, sharp detail, no "
    "text, no logos."
)

CHARACTERS = {
    "SBF": "Slouched build with rounded shoulders, an oversized faded anthracite cotton t-shirt, dark cargo shorts with bellows pockets, worn grey sneakers with no logo.",
    "ELL": "Small slight build, round thin gold-framed glasses resting on the faceless head, an oversized beige chunky cable-knit cardigan over a dark collared shirt, tailored dark trousers, classic dark brown high-heeled pumps.",
    "CZ": "Tall slim build, tailored anthracite wool suit, crisp white shirt, dark textured tie, mirror-polished black oxford shoes.",
    "RAY": "Broad-shouldered build, tailored navy three-piece suit, white shirt, dark silk tie, white pocket square, thin round glasses resting on the faceless head, polished dark brown leather shoes.",
    "WANG": "Slim quiet build, a plain dark sweater, plain dark trousers, plain black leather shoes.",
    "SING": "Slim build, a light blue shirt with rolled sleeves, dark trousers, brown leather shoes.",
    "SAL": "Medium build, a well-cut mid-grey suit, white shirt, no tie, black leather shoes.",
    "LD": "Upright build, a long-sleeved dark charcoal tunic covering the whole torso and arms, with a thick draped cream-coloured wool Roman toga over it, a rope belt, and closed brown leather Roman shoes fully covering the feet (no bare feet, no visible toes). The toga is clearly cream and darker than the white body so the two do not blend.",
    "ENQ": "Neutral upright build, a plain dark suit, white shirt, plain dark tie, white cotton gloves, no badge, no insignia, black leather shoes.",
    "POL": "Sturdy build, dark navy uniform shirt, dark uniform trousers, uniform cap, no insignia, black boots.",
}


def main():
    wanted = [a.upper() for a in sys.argv[1:]] or list(CHARACTERS)
    ok_count = 0
    for key in wanted:
        if key not in CHARACTERS:
            print(f"[!] Inconnu: {key}")
            continue
        target = Path(OUT_DIR) / f"CHR-{key}_master.jpg"
        if target.exists() and target.stat().st_size > 10000:
            print(f"[i] {target.name} existe déjà, ignoré.")
            ok_count += 1
            continue
        prompt = f"{MAN} {CHARACTERS[key]}"
        ok = generate_image(prompt, str(target), aspect_ratio="3:4", timeout=240)
        if not ok:
            ok = generate_image(prompt, str(target), aspect_ratio="1:1", timeout=240)
        ok_count += int(ok)
        time.sleep(3)
    print(f"\n=== {ok_count}/{len(wanted)} mannequins prêts dans {OUT_DIR} ===")


if __name__ == "__main__":
    main()
