#!/usr/bin/env python3
"""
Master Motion Design Renderer for Pitaya Botanical / Forensic Study
Recreates the reference motion design video:
- 6 dynamic kinetic scenes
- 1080p @ 25fps, 230 frames (9.2 seconds)
- Acid Lime, Hot Magenta, Architectural Ivory, Deep Black
- Dynamic HUD, CV Scan, Living Texture, 5 Growth Stages staircase
- Signature Undulating Wavy Typography "INSIDE OUT" with tracking mesh
- Neural Seed Constellation Plexus with live coordinates
"""

import os
import sys
import math
import shutil
import subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 1920, 1080
FPS = 25
TOTAL_FRAMES = 230

ASSETS_DIR = "/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/assets/pitaya"
TEMP_FRAMES_DIR = "/tmp/pitaya_frames"
OUTPUT_VIDEO = f"{ASSETS_DIR}/pitaya_motion_master.mp4"

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
GRAY = (120, 120, 120)

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except:
        return ImageFont.load_default()

# Preload fonts
font_giant = get_font(FONT_CONDENSED_BOLD, 220)
font_wavy = get_font(FONT_CONDENSED_BOLD, 180)
font_card = get_font(FONT_CONDENSED_BOLD, 200)
font_mono_xl = get_font(FONT_MONO, 32)
font_mono_lg = get_font(FONT_MONO, 24)
font_mono_md = get_font(FONT_MONO, 18)
font_mono_sm = get_font(FONT_MONO, 13)

# Load assets
img_bud = Image.open(f"{ASSETS_DIR}/bud_alpha.png").convert("RGBA")
img_whole = Image.open(f"{ASSETS_DIR}/whole_alpha.png").convert("RGBA")
img_cut = Image.open(f"{ASSETS_DIR}/cut_alpha.png").convert("RGBA")

# Preload stage crops
img_stages = [
    Image.open(f"{ASSETS_DIR}/stage_1_bud.png").convert("RGBA"),
    Image.open(f"{ASSETS_DIR}/stage_2_young.png").convert("RGBA"),
    Image.open(f"{ASSETS_DIR}/stage_3_transparent.png").convert("RGBA"),
    Image.open(f"{ASSETS_DIR}/stage_4_ripe.png").convert("RGBA"),
    Image.open(f"{ASSETS_DIR}/stage_5_cut.png").convert("RGBA"),
]

def ease_out_cubic(x):
    return 1.0 - math.pow(1.0 - x, 3)

def ease_in_out_sine(x):
    return -(math.cos(math.pi * x) - 1.0) / 2.0

def draw_card_with_notches(img, cx, cy, size, fill_color, notch_size=12, notch_color=None):
    draw = ImageDraw.Draw(img)
    x0, y0 = int(cx - size // 2), int(cy - size // 2)
    x1, y1 = int(cx + size // 2), int(cy + size // 2)
    draw.rectangle([x0, y0, x1, y1], fill=fill_color)
    nc = notch_color if notch_color else fill_color
    draw.rectangle([x0 - notch_size, y0 - notch_size, x0, y0], fill=nc)
    draw.rectangle([x1, y0 - notch_size, x1 + notch_size, y0], fill=nc)
    draw.rectangle([x0 - notch_size, y1, x0, y1 + notch_size], fill=nc)
    draw.rectangle([x1, y1, x1 + notch_size, y1 + notch_size], fill=nc)

def draw_bracket(draw, x0, y0, x1, y1, length=24, color=WHITE, width=2):
    draw.line([(x0, y0), (x0 + length, y0)], fill=color, width=width)
    draw.line([(x0, y0), (x0, y0 + length)], fill=color, width=width)
    draw.line([(x1, y0), (x1 - length, y0)], fill=color, width=width)
    draw.line([(x1, y0), (x1, y0 + length)], fill=color, width=width)
    draw.line([(x0, y1), (x0 + length, y1)], fill=color, width=width)
    draw.line([(x0, y1), (x0, y1 - length)], fill=color, width=width)
    draw.line([(x1, y1), (x1 - length, y1)], fill=color, width=width)
    draw.line([(x1, y1), (x1, y1 - length)], fill=color, width=width)

# ==============================================================================
# SCENE 1 : IN / OUT (Frames 0 to 35)
# ==============================================================================
def render_frame_scene_1(frame):
    progress = frame / 35.0
    img = Image.new("RGBA", (W, H), LIME + (255,))
    draw = ImageDraw.Draw(img)
    
    # Outer container rounded rectangle
    draw.rounded_rectangle([120, 80, W - 120, H - 80], radius=32, outline=(20, 20, 20), width=6)
    
    # Technical grid
    for gx in range(200, W - 200, 250):
        draw.line([(gx, 100), (gx, H - 100)], fill=(140, 210, 25), width=1)
    for gy in range(150, H - 150, 200):
        draw.line([(140, gy), (W - 140, gy)], fill=(140, 210, 25), width=1)
        
    # Scale animation on cards
    scale_l = min(1.0, 0.85 + 0.15 * ease_out_cubic(min(1.0, progress * 2.5)))
    scale_r = min(1.0, 0.85 + 0.15 * ease_out_cubic(min(1.0, max(0.0, (progress - 0.15) * 2.5))))
    
    box_size = 280
    box_l_x, box_l_y = 480, 540 + int(math.sin(frame * 0.15) * 4)
    box_r_x, box_r_y = 1440, 480 + int(math.cos(frame * 0.15) * 4)
    
    # Left Box (IN)
    draw_card_with_notches(img, box_l_x, box_l_y, int(box_size * scale_l), BLACK, notch_size=16)
    bsize_l = int(240 * scale_l)
    bud_scaled = img_bud.resize((bsize_l, bsize_l), Image.Resampling.LANCZOS)
    img.paste(bud_scaled, (box_l_x - bsize_l // 2, box_l_y - bsize_l // 2), bud_scaled)
    draw.text((box_l_x + 190, box_l_y - 120), "IN", fill=BLACK, font=font_card)
    
    # Right Box (OUT)
    draw_card_with_notches(img, box_r_x, box_r_y, int(box_size * scale_r), BLACK, notch_size=16)
    bsize_r = int(240 * scale_r)
    cut_scaled = img_cut.resize((bsize_r, bsize_r), Image.Resampling.LANCZOS)
    img.paste(cut_scaled, (box_r_x - bsize_r // 2, box_r_y - bsize_r // 2), cut_scaled)
    draw.text((box_r_x - 420, box_r_y - 120), "OUT", fill=BLACK, font=font_card)
    
    # Connecting Bezier curve
    p0 = (box_l_x, box_l_y + box_size // 2)
    p3 = (box_r_x, box_r_y - box_size // 2)
    p1 = (box_l_x + 300, box_l_y + 350)
    p2 = (box_r_x - 300, box_r_y - 300)
    
    curve_points = []
    for step in range(101):
        t = step / 100.0
        bx = (1-t)**3 * p0[0] + 3*(1-t)**2*t * p1[0] + 3*(1-t)*t**2 * p2[0] + t**3 * p3[0]
        by = (1-t)**3 * p0[1] + 3*(1-t)**2*t * p1[1] + 3*(1-t)*t**2 * p2[1] + t**3 * p3[1]
        curve_points.append((bx, by))
        
    draw.line(curve_points, fill=BLACK, width=4)
    
    # Animated traveling ball with trailing tail
    t_ball = max(0.0, min(1.0, (progress - 0.1) / 0.8))
    ball_idx = int(t_ball * 100)
    bx, by = curve_points[ball_idx]
    # Trail
    for trail in range(1, 6):
        t_idx = max(0, ball_idx - trail * 2)
        tx, ty = curve_points[t_idx]
        draw.ellipse([tx - (10 - trail), ty - (10 - trail), tx + (10 - trail), ty + (10 - trail)], fill=(20, 20, 20))
    # Head ball
    draw.ellipse([bx - 12, by - 12, bx + 12, by + 12], fill=BLACK)
    
    # Micro coordinate indicators
    draw.text((140, 100), "SYS: BOTANICAL_DUAL_STAGE", fill=(40, 40, 40), font=font_mono_sm)
    draw.text((W - 380, H - 110), f"VECTOR_T: {t_ball:.3f} // CALIB_OK", fill=(40, 40, 40), font=font_mono_sm)
    return img

# ==============================================================================
# SCENE 2 : MACRO COMPUTER VISION SCAN (Frames 36 to 75)
# ==============================================================================
def render_frame_scene_2(frame):
    f_rel = frame - 36
    progress = f_rel / 39.0
    img = Image.new("RGBA", (W, H), (6, 6, 6, 255))
    draw = ImageDraw.Draw(img)
    
    # Slight continuous zoom
    zoom = 1.0 + progress * 0.08
    macro_size = int(1300 * zoom)
    cut_macro = img_cut.resize((macro_size, macro_size), Image.Resampling.LANCZOS)
    img.paste(cut_macro, (W // 2 - macro_size // 2, H // 2 - macro_size // 2), cut_macro)
    
    # Perimeter brackets [ ]
    draw_bracket(draw, 350, 100, W - 350, H - 100, length=60, color=WHITE, width=3)
    
    # Inspection targets
    targets = [
        ("Surface_01", 520, 360, 200, 240, True),
        ("Surface_02", 980, 240, 260, 180, False),
        ("Surface_03", 1140, 680, 220, 200, True),
        ("Surface_04", 1520, 340, 240, 160, False),
    ]
    
    for label, tx, ty, tw, th, is_magnifier in targets:
        # micro floating jitter
        jit_x = int(math.sin(f_rel * 0.3 + tx) * 2)
        jit_y = int(math.cos(f_rel * 0.3 + ty) * 2)
        bx0, by0 = tx - tw // 2 + jit_x, ty - th // 2 + jit_y
        bx1, by1 = tx + tw // 2 + jit_x, ty + th // 2 + jit_y
        
        draw_bracket(draw, bx0, by0, bx1, by1, length=20, color=WHITE, width=2)
        draw.text((bx0 + 8, by0 - 24), label, fill=WHITE, font=font_mono_md)
        
        if is_magnifier:
            crop_sample = img.crop((bx0, by0, bx1, by1))
            crop_gray = crop_sample.convert("L")
            crop_inv = Image.eval(crop_gray, lambda p: 255 - p if p > 30 else 0)
            crop_inv = crop_inv.filter(ImageFilter.SHARPEN)
            img.paste(crop_inv.convert("RGBA"), (bx0, by0))
            draw_bracket(draw, bx0, by0, bx1, by1, length=20, color=WHITE, width=2)
            # Micro crosshair lines
            draw.line([(bx0, by0), (bx1, by1)], fill=(255, 255, 255, 80), width=1)
            draw.line([(bx0, by1), (bx1, by0)], fill=(255, 255, 255, 80), width=1)
            
    # Seed micro target '+' crosshairs
    np.random.seed(42)
    for i in range(35):
        sx = int(np.random.randint(580, 1340) + math.sin(f_rel * 0.2 + i) * 3)
        sy = int(np.random.randint(280, 850) + math.cos(f_rel * 0.2 + i) * 3)
        dist = math.sqrt((sx - 960)**2 + (sy - 540)**2)
        if dist < 420:
            draw.rectangle([sx - 8, sy - 8, sx + 8, sy + 8], outline=(255, 255, 255, 160), width=1)
            draw.line([(sx - 4, sy), (sx + 4, sy)], fill=WHITE, width=1)
            draw.line([(sx, sy - 4), (sx, sy + 4)], fill=WHITE, width=1)
            if i % 6 == 0:
                draw.text((sx + 10, sy - 6), f"S_{i:02d}", fill=(200, 200, 200), font=font_mono_sm)
                
    # Animated vertical scanning beam
    scan_y = 120 + int((f_rel * 28) % 840)
    draw.line([(350, scan_y), (W - 350, scan_y)], fill=(168, 247, 34, 180), width=2)
    draw.line([(350, scan_y - 2), (W - 350, scan_y - 2)], fill=(255, 255, 255, 90), width=1)
    
    # HUD Telemetry
    draw.text((370, 120), f"SCAN_ACTIVE // REZ_1080P // DENSITY: {82.4 + math.sin(f_rel*0.5)*4:.1f}%", fill=LIME, font=font_mono_sm)
    draw.text((370, H - 130), f"TARGET_LOCK: 04 DETECTED // FORENSIC_INDEX: {progress*100:.1f}%", fill=WHITE, font=font_mono_sm)
    return img

# ==============================================================================
# SCENE 3 : LIVING TEXTURE (Frames 76 to 110)
# ==============================================================================
def render_frame_scene_3(frame):
    f_rel = frame - 76
    progress = f_rel / 34.0
    img = Image.new("RGBA", (W, H), DARK_BG + (255,))
    draw = ImageDraw.Draw(img)
    
    # Animated dot grid
    grid_offset = int((f_rel * 2) % 40)
    for gx in range(80, W, 100):
        for gy in range(60, H, 100):
            draw.point((gx, gy + grid_offset), fill=(80, 80, 80))
            
    # Central Fruit
    whole_scaled = img_whole.resize((920, 920), Image.Resampling.LANCZOS)
    img.paste(whole_scaled, (W // 2 - 460, H // 2 - 460), whole_scaled)
    
    # Inverted central aperture box with cyan / magenta duotone glitch
    cw, ch = 340, 340
    # glitch horizontal shift on select frames
    glitch_dx = 12 if (f_rel % 7 == 0) else (-8 if f_rel % 11 == 0 else 0)
    cx0, cy0 = W // 2 - cw // 2 + glitch_dx, H // 2 - ch // 2
    
    crop_center = img.crop((cx0, cy0, cx0 + cw, cy0 + ch))
    crop_cyan = Image.eval(crop_center.convert("L"), lambda p: min(255, int(p * 1.6)))
    crop_colored = Image.merge("RGBA", (
        Image.eval(crop_cyan, lambda p: int(p * 0.15)),
        Image.eval(crop_cyan, lambda p: int(p * 0.95)),
        Image.eval(crop_cyan, lambda p: int(p * 1.0)),
        Image.new("L", (cw, ch), 255)
    ))
    img.paste(crop_colored, (cx0, cy0))
    draw.rectangle([cx0, cy0, cx0 + cw, cy0 + ch], outline=(80, 240, 255), width=2)
    
    # Typography: LIVING & TEXTURE
    track_living = int(math.sin(f_rel * 0.2) * 15)
    draw.text((120 + track_living, 100), "LIVING", fill=CREAM, font=font_giant)
    draw.text((120 - track_living, H - 360), "TEXTURE", fill=CREAM, font=font_giant)
    
    # Editorial side labels
    draw.text((W - 360, 160), "MORPHOLOGY 03", fill=LIME, font=font_mono_md)
    draw.text((W - 360, 190), "BIO-CELLULAR SCAN", fill=WHITE, font=font_mono_sm)
    return img

# ==============================================================================
# SCENE 4 : PITAYA - SPECIMEN_01 (Frames 111 to 155)
# ==============================================================================
def render_frame_scene_4(frame):
    f_rel = frame - 111
    progress = f_rel / 44.0
    img = Image.new("RGBA", (W, H), CREAM + (255,))
    draw = ImageDraw.Draw(img)
    
    # Architectural hairline grid
    for gx in range(160, W, 320):
        draw.line([(gx, 60), (gx, H - 60)], fill=(215, 212, 202), width=1)
    for gy in range(120, H, 240):
        draw.line([(80, gy), (W - 80, gy)], fill=(215, 212, 202), width=1)
        
    fcx, fcy = W // 2, H // 2 - 20
    fruit = img_whole.resize((720, 720), Image.Resampling.LANCZOS)
    img.paste(fruit, (fcx - 360, fcy - 360), fruit)
    
    # Specimen bounding box & guides
    box_size = 640
    bx0, by0 = fcx - box_size // 2, fcy - box_size // 2
    bx1, by1 = fcx + box_size // 2, fcy + box_size // 2
    draw.rectangle([bx0, by0, bx1, by1], outline=(180, 175, 165), width=1)
    
    # Lime anchor corner squares
    asize = 16
    for ax, ay in [(bx0, by0), (bx1, by0), (bx0, by1), (bx1, by1), (fcx, fcy)]:
        draw.rectangle([ax - asize//2, ay - asize//2, ax + asize//2, ay + asize//2], fill=LIME)
        
    # Diagonal guide lines
    draw.line([(bx0, by0), (bx1, by1)], fill=(180, 175, 165), width=1)
    draw.line([(bx0, by1), (bx1, by0)], fill=(180, 175, 165), width=1)
    
    # Rotating dashed circle orbit
    r = 300
    angle_offset = (f_rel * 3.5) % 360
    for deg in range(0, 360, 6):
        cur_deg = deg + angle_offset
        rad1 = math.radians(cur_deg)
        rad2 = math.radians(cur_deg + 3)
        x1, y1 = fcx + r * math.cos(rad1), fcy + r * math.sin(rad1)
        x2, y2 = fcx + r * math.cos(rad2), fcy + r * math.sin(rad2)
        draw.line([(x1, y1), (x2, y2)], fill=(140, 135, 125), width=2)
        
    # Big Title "PITAYA"
    draw.text((240, H - 360), "PITAYA", fill=BLACK, font=font_giant)
    
    # Badge "SPECIMEN_01"
    draw.rectangle([460, H - 210, 720, H - 140], fill=LIME)
    draw.text((485, H - 192), "SPECIMEN_01", fill=BLACK, font=font_mono_lg)
    
    # Metadata Block top right with progressive reveal
    metadata = [
        "SPECIMEN: PITAYA-01",
        "TAXON: HYLOCEREUS UNDATUS",
        "STATE: FRESH / ORGANIC",
        "RIND: PINK / LIME SCALES",
        "PALETTE: PINK / LIME / IVORY",
        "SURFACE: BOTANICAL CROSS",
        "CAPTURE: FRONT STUDY 1080P"
    ]
    my = 260
    revealed_lines = min(len(metadata), int(progress * (len(metadata) + 2)) + 2)
    for i in range(revealed_lines):
        draw.text((W - 500, my), metadata[i], fill=(45, 45, 45), font=font_mono_md)
        my += 28
        
    return img

# ==============================================================================
# SCENE 5 : 5 GROWTH STAGES STAIRCASE (Frames 156 to 190)
# ==============================================================================
def render_frame_scene_5(frame):
    f_rel = frame - 156
    progress = f_rel / 34.0
    img = Image.new("RGBA", (W, H), MAGENTA + (255,))
    draw = ImageDraw.Draw(img)
    
    # Deep raspberry grid lines
    for gx in range(120, W, 240):
        draw.line([(gx, 60), (gx, H - 60)], fill=(196, 0, 102), width=1)
    for gy in range(100, H, 200):
        draw.line([(80, gy), (W - 80, gy)], fill=(196, 0, 102), width=1)
        
    stages_info = [
        ("Bud", 300, 680, img_stages[0]),
        ("Young", 620, 590, img_stages[1]),
        ("Opening", 940, 500, img_stages[2]),
        ("Ripe", 1260, 410, img_stages[3]),
        ("Cut", 1580, 320, img_stages[4]),
    ]
    
    card_size = 230
    bottom_points = []
    
    for i, (label, cx, cy, fruit_crop) in enumerate(stages_info):
        # Card stagger entrance & slight float
        float_y = int(math.sin(f_rel * 0.2 + i * 0.8) * 6)
        cy_f = cy + float_y
        
        draw_card_with_notches(img, cx, cy_f, card_size, BLACK, notch_size=14)
        scaled = fruit_crop.resize((190, 190), Image.Resampling.LANCZOS)
        img.paste(scaled, (cx - 95, cy_f - 95), scaled)
        draw.text((cx - card_size // 2, cy_f - card_size // 2 - 36), label, fill=WHITE, font=font_mono_lg)
        bottom_points.append((cx, cy_f + card_size // 2))
        
    # Undulating bouncing sine waves between consecutive cards
    phase = f_rel * 0.4
    for i in range(len(bottom_points) - 1):
        x_a, y_a = bottom_points[i]
        x_b, y_b = bottom_points[i + 1]
        arc_pts = []
        for s in range(51):
            t = s / 50.0
            x = x_a + (x_b - x_a) * t
            wave_amp = 110.0 + 30.0 * math.sin(phase + i * 1.2)
            y = (1 - t) * y_a + t * y_b + math.sin(t * math.pi) * wave_amp
            arc_pts.append((x, y))
            
        draw.line(arc_pts, fill=LIME, width=4)
        # Traveling light bead on wave
        bead_t = ((f_rel * 0.08 + i * 0.25) % 1.0)
        bead_idx = int(bead_t * 50)
        bx, by = arc_pts[bead_idx]
        draw.ellipse([bx - 6, by - 6, bx + 6, by + 6], fill=WHITE)
        
    draw.text((120, 80), "GROWTH MORPHOLOGY // 5-STAGE SEQUENCE", fill=LIME, font=font_mono_md)
    return img

# ==============================================================================
# SCENE 6A : WAVY TEXT "INSIDE OUT" (Frames 191 to 210)
# ==============================================================================
def render_frame_scene_6_wavy(frame):
    f_rel = frame - 191
    img = Image.new("RGBA", (W, H), (8, 8, 8, 255))
    draw = ImageDraw.Draw(img)
    
    letters = ["I", "N", "S", "I", "D", "E", " ", "O", "U", "T"]
    start_x = 260
    base_y = 540
    step_x = 145
    
    node_top = []
    node_bot = []
    
    wave_speed = f_rel * 0.45
    
    for i, ch in enumerate(letters):
        if ch == " ":
            continue
        # Undulating travelling sine wave
        y_offset = math.sin(wave_speed + i * 0.75) * 65.0
        lx = start_x + i * step_x
        ly = base_y + y_offset
        
        # Letter in Hot Magenta
        draw.text((lx, ly - 90), ch, fill=MAGENTA, font=font_wavy)
        
        # Letter bounding box & corner handles
        bbox = draw.textbbox((lx, ly - 90), ch, font=font_wavy)
        bx0, by0, bx1, by1 = bbox
        
        hsize = 12
        for hx, hy in [(bx0, by0), (bx1, by0), (bx0, by1), (bx1, by1)]:
            draw.rectangle([hx - hsize//2, hy - hsize//2, hx + hsize//2, hy + hsize//2], outline=LIME, width=2)
            
        node_top.append(((bx0 + bx1)//2, by0))
        node_bot.append(((bx0 + bx1)//2, by1))
        
    # Wireframe tracking mesh lines connecting letter nodes
    if len(node_top) > 1:
        draw.line(node_top, fill=(255, 255, 255, 140), width=1)
        draw.line(node_bot, fill=(255, 255, 255, 140), width=1)
        for pt, pb in zip(node_top, node_bot):
            draw.line([pt, pb], fill=(255, 255, 255, 60), width=1)
            
    # Top HUD title
    draw.text((start_x, 220), "TYPOGRAPHY KINETIC WAVE // MESH TRACKING", fill=LIME, font=font_mono_md)
    draw.text((start_x, 250), f"FREQUENCY: 2.4 Hz // AMPLITUDE: 65px // PHASE: {wave_speed:.2f}", fill=(180, 180, 180), font=font_mono_sm)
    return img

# ==============================================================================
# SCENE 6B : SEED CONSTELLATION PLEXUS & FINALE (Frames 211 to 229)
# ==============================================================================
def render_frame_scene_6_plexus(frame):
    f_rel = frame - 211
    progress = f_rel / 18.0
    img = Image.new("RGBA", (W, H), (5, 5, 5, 255))
    draw = ImageDraw.Draw(img)
    
    # Inverted high-contrast cut fruit macro background
    cut_bg = img_cut.resize((1400, 1400), Image.Resampling.LANCZOS)
    gray = cut_bg.convert("L")
    inv = Image.eval(gray, lambda p: int((255 - p) * 0.85) if p > 20 else 0)
    img.paste(inv.convert("RGBA"), (W // 2 - 700, H // 2 - 700))
    
    # Constellation nodes with Brownian motion
    np.random.seed(101)
    nodes = []
    for i in range(50):
        base_x = np.random.randint(460, 1460)
        base_y = np.random.randint(180, 920)
        nx = int(base_x + math.sin(f_rel * 0.3 + i) * 8)
        ny = int(base_y + math.cos(f_rel * 0.3 + i) * 8)
        dist = math.sqrt((nx - 960)**2 + (ny - 540)**2)
        if dist < 450:
            nodes.append((nx, ny))
            
    # Connect nearby nodes
    for i, (x1, y1) in enumerate(nodes):
        for j, (x2, y2) in enumerate(nodes[i+1:], i+1):
            d = math.hypot(x2 - x1, y2 - y1)
            if d < 140:
                alpha = int((1.0 - d / 140.0) * 200)
                draw.line([(x1, y1), (x2, y2)], fill=(255, 255, 255, alpha), width=1)
                
    # Draw node dots & coordinate labels
    for i, (nx, ny) in enumerate(nodes):
        draw.ellipse([nx - 3, ny - 3, nx + 3, ny + 3], fill=WHITE)
        if i % 3 == 0:
            coord_str = f"{nx} {ny}"
            draw.text((nx + 6, ny - 6), coord_str, fill=(220, 220, 220), font=font_mono_sm)
            
    # Key highlight target squares (alternating lime and magenta)
    for i, (nx, ny) in enumerate(nodes[:8]):
        color = LIME if i % 2 == 0 else MAGENTA
        draw.rectangle([nx - 18, ny - 18, nx + 18, ny + 18], fill=color + (140,), outline=color, width=2)
        draw.point((nx, ny), fill=WHITE)
        
    # Stamp "OUT" in center with flashing energy
    if f_rel > 6:
        stamp_alpha = min(1.0, (f_rel - 6) / 4.0)
        font_out = get_font(FONT_CONDENSED_BOLD, 260)
        draw.text((W // 2 - 220, H // 2 - 160), "OUT", fill=CREAM, font=font_out)
        draw.rectangle([W // 2 - 240, H // 2 - 170, W // 2 + 240, H // 2 + 150], outline=LIME, width=4)
        draw.text((W // 2 - 140, H // 2 + 160), "END STUDY // PITAYA 2026", fill=LIME, font=font_mono_md)
        
    return img

# ==============================================================================
# MAIN RENDER LOOP
# ==============================================================================
def main():
    print(f"=== Starting Pitaya Motion Master Render ({TOTAL_FRAMES} frames @ {FPS} fps) ===")
    os.makedirs(TEMP_FRAMES_DIR, exist_ok=True)
    
    for f in range(TOTAL_FRAMES):
        if f <= 35:
            frame_img = render_frame_scene_1(f)
        elif f <= 75:
            frame_img = render_frame_scene_2(f)
        elif f <= 110:
            frame_img = render_frame_scene_3(f)
        elif f <= 155:
            frame_img = render_frame_scene_4(f)
        elif f <= 190:
            frame_img = render_frame_scene_5(f)
        elif f <= 210:
            frame_img = render_frame_scene_6_wavy(f)
        else:
            frame_img = render_frame_scene_6_plexus(f)
            
        frame_path = f"{TEMP_FRAMES_DIR}/frame_{f:04d}.png"
        frame_img.save(frame_path)
        
        if f % 25 == 0 or f == TOTAL_FRAMES - 1:
            print(f"Rendered frame {f}/{TOTAL_FRAMES} ({f/TOTAL_FRAMES*100:.1f}%)")
            
    print("All frames generated. Encoding to H.264 MP4 with FFmpeg...")
    
    ffmpeg_cmd = [
        "ffmpeg", "-y",
        "-r", str(FPS),
        "-i", f"{TEMP_FRAMES_DIR}/frame_%04d.png",
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "18",
        "-pix_fmt", "yuv420p",
        OUTPUT_VIDEO
    ]
    
    res = subprocess.run(ffmpeg_cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print("FFmpeg error:", res.stderr)
        sys.exit(1)
        
    print(f"SUCCESS! Master video rendered to: {OUTPUT_VIDEO}")
    file_size_mb = os.path.getsize(OUTPUT_VIDEO) / (1024 * 1024)
    print(f"Master file size: {file_size_mb:.2f} MB")

if __name__ == "__main__":
    main()
