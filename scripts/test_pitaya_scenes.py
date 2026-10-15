import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ASSETS_DIR = "/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/assets/pitaya"
OUT_DIR = "/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/scratch/pitaya_preview"
os.makedirs(OUT_DIR, exist_ok=True)

# Fonts
FONT_CONDENSED_BOLD = "/usr/share/fonts/truetype/liberation/LiberationSansNarrow-Bold.ttf"
FONT_MONO = "/home/mbogneng-junior/Documents/art/Creation_contenus/Logiciels/effectcraft/assets/fonts/JetBrainsMono-Regular.ttf"
FONT_SANS = "/home/mbogneng-junior/Documents/art/Creation_contenus/Logiciels/effectcraft/assets/fonts/Inter-Bold.ttf"

# Colors
LIME = (168, 247, 34)
MAGENTA = (230, 0, 122)
CREAM = (245, 243, 236)
DARK_BG = (10, 10, 10)
BLACK = (8, 8, 8)
WHITE = (255, 255, 255)

print("Setup completed successfully.")
