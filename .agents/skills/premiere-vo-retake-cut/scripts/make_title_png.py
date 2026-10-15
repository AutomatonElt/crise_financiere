#!/usr/bin/env python3
"""Render a line of text to a 1920x1080 PNG with alpha, for use as a Premiere title.

    python make_title_png.py "YOUR TITLE" out.png [--size 170] [--font georgiab.ttf]

Why this exists: in Premiere 26.0.2, a MOGRT graphic created through ExtendScript renders
NOTHING - the clip is there, its Source Text is correct, and the frame comes back with zero
pixels. See "Titles: the MOGRT route is dead here" in SKILL.md. Real media renders perfectly,
so a title becomes real media.

For anything with motion or design, build it in After Effects and import the render instead.
This is for a plain, legible card.
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

FONT_CANDIDATES = ["georgiab.ttf", "arialbd.ttf", "segoeuib.ttf", "times.ttf"]
FONT_DIR = Path(r"C:\Windows\Fonts")


def load_font(name: str | None, size: int) -> ImageFont.FreeTypeFont:
    names = [name] if name else FONT_CANDIDATES
    for n in names:
        p = Path(n)
        if not p.is_absolute():
            p = FONT_DIR / n
        try:
            return ImageFont.truetype(str(p), size)
        except OSError:
            continue
    raise SystemExit(f"no usable font in {names}")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("text")
    ap.add_argument("output")
    ap.add_argument("--size", type=int, default=170, help="font size in px (default 170)")
    ap.add_argument("--font", help="font file name or absolute path")
    ap.add_argument("--width", type=int, default=1920)
    ap.add_argument("--height", type=int, default=1080)
    ap.add_argument("--fill", default="255,255,255", help="R,G,B (default white)")
    ap.add_argument("--y", type=float, default=0.5, help="vertical centre, 0..1 (default 0.5)")
    a = ap.parse_args()

    font = load_font(a.font, a.size)
    im = Image.new("RGBA", (a.width, a.height), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)

    box = d.textbbox((0, 0), a.text, font=font)
    w, h = box[2] - box[0], box[3] - box[1]
    if w > a.width * 0.9:
        print(f"warning: text is {w}px wide on a {a.width}px frame - lower --size", file=sys.stderr)
    x = (a.width - w) / 2 - box[0]
    y = a.height * a.y - h / 2 - box[1]

    r, g, b = (int(v) for v in a.fill.split(","))
    d.text((x, y), a.text, font=font, fill=(r, g, b, 255))
    im.save(a.output)
    print(f"{a.output}  {a.width}x{a.height}  text {w}x{h}px")
    return 0


if __name__ == "__main__":
    sys.exit(main())
