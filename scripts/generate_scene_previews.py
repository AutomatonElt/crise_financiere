import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ASSETS_DIR = "/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/assets/pitaya"
OUT_DIR = "/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/scratch/pitaya_preview"
os.makedirs(OUT_DIR, exist_ok=True)

FONT_CONDENSED_BOLD = "/usr/share/fonts/truetype/liberation/LiberationSansNarrow-Bold.ttf"
FONT_MONO = "/home/mbogneng-junior/Documents/art/Creation_contenus/Logiciels/effectcraft/assets/fonts/JetBrainsMono-Regular.ttf"
FONT_SANS = "/home/mbogneng-junior/Documents/art/Creation_contenus/Logiciels/effectcraft/assets/fonts/Inter-Bold.ttf"

# Load transparent assets
img_bud = Image.open(f"{ASSETS_DIR}/bud_alpha.png").convert("RGBA")
img_whole = Image.open(f"{ASSETS_DIR}/whole_alpha.png").convert("RGBA")
img_cut = Image.open(f"{ASSETS_DIR}/cut_alpha.png").convert("RGBA")

# Colors
LIME = (168, 247, 34)
MAGENTA = (230, 0, 122)
CREAM = (245, 243, 236)
DARK_BG = (10, 10, 10)
BLACK = (8, 8, 8)
WHITE = (255, 255, 255)
GRAY = (120, 120, 120)

W, H = 1920, 1080

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except:
        return ImageFont.load_default()

def draw_card_with_notches(img, cx, cy, size, fill_color, notch_size=12, notch_color=None):
    draw = ImageDraw.Draw(img)
    x0, y0 = cx - size // 2, cy - size // 2
    x1, y1 = cx + size // 2, cy + size // 2
    draw.rectangle([x0, y0, x1, y1], fill=fill_color)
    nc = notch_color if notch_color else fill_color
    # Corner ears
    draw.rectangle([x0 - notch_size, y0 - notch_size, x0, y0], fill=nc)
    draw.rectangle([x1, y0 - notch_size, x1 + notch_size, y0], fill=nc)
    draw.rectangle([x0 - notch_size, y1, x0, y1 + notch_size], fill=nc)
    draw.rectangle([x1, y1, x1 + notch_size, y1 + notch_size], fill=nc)

def draw_bracket(draw, x0, y0, x1, y1, length=24, color=WHITE, width=2):
    # Top-left
    draw.line([(x0, y0), (x0 + length, y0)], fill=color, width=width)
    draw.line([(x0, y0), (x0, y0 + length)], fill=color, width=width)
    # Top-right
    draw.line([(x1, y0), (x1 - length, y0)], fill=color, width=width)
    draw.line([(x1, y0), (x1, y0 + length)], fill=color, width=width)
    # Bottom-left
    draw.line([(x0, y1), (x0 + length, y1)], fill=color, width=width)
    draw.line([(x0, y1), (x0, y1 - length)], fill=color, width=width)
    # Bottom-right
    draw.line([(x1, y1), (x1 - length, y1)], fill=color, width=width)
    draw.line([(x1, y1), (x1, y1 - length)], fill=color, width=width)

# ==========================================
# 1. SCENE 1 : IN / OUT
# ==========================================
def render_scene_1(progress=0.5):
    img = Image.new("RGBA", (W, H), LIME + (255,))
    draw = ImageDraw.Draw(img)
    
    # Outer container rounded rectangle
    draw.rounded_rectangle([120, 80, W - 120, H - 80], radius=32, outline=(20, 20, 20), width=6)
    
    # Thin technical grid
    for gx in range(200, W - 200, 250):
        draw.line([(gx, 100), (gx, H - 100)], fill=(140, 210, 25), width=1)
    for gy in range(150, H - 150, 200):
        draw.line([(140, gy), (W - 140, gy)], fill=(140, 210, 25), width=1)
        
    font_bold = get_font(FONT_CONDENSED_BOLD, 220)
    
    # Left Box (IN)
    box_l_x, box_l_y = 480, 540
    box_size = 280
    draw_card_with_notches(img, box_l_x, box_l_y, box_size, BLACK, notch_size=16)
    bud_scaled = img_bud.resize((240, 240), Image.Resampling.LANCZOS)
    img.paste(bud_scaled, (box_l_x - 120, box_l_y - 120), bud_scaled)
    
    # Text "IN"
    draw.text((box_l_x + 190, box_l_y - 120), "IN", fill=BLACK, font=font_bold)
    
    # Right Box (OUT)
    box_r_x, box_r_y = 1440, 480
    draw_card_with_notches(img, box_r_x, box_r_y, box_size, BLACK, notch_size=16)
    cut_scaled = img_cut.resize((240, 240), Image.Resampling.LANCZOS)
    img.paste(cut_scaled, (box_r_x - 120, box_r_y - 120), cut_scaled)
    
    # Text "OUT"
    draw.text((box_r_x - 420, box_r_y - 120), "OUT", fill=BLACK, font=font_bold)
    
    # Connecting spline curve
    p0 = (box_l_x, box_l_y + box_size // 2)
    p3 = (box_r_x, box_r_y - box_size // 2)
    p1 = (box_l_x + 300, box_l_y + 350)
    p2 = (box_r_x - 300, box_r_y - 300)
    
    points = []
    for step in range(101):
        t = step / 100.0
        bx = (1-t)**3 * p0[0] + 3*(1-t)**2*t * p1[0] + 3*(1-t)*t**2 * p2[0] + t**3 * p3[0]
        by = (1-t)**3 * p0[1] + 3*(1-t)**2*t * p1[1] + 3*(1-t)*t**2 * p2[1] + t**3 * p3[1]
        points.append((bx, by))
    
    draw.line(points, fill=BLACK, width=4)
    # Animated traveling ball on the curve
    ball_idx = int(progress * 100)
    bx, by = points[min(ball_idx, 100)]
    draw.ellipse([bx - 10, by - 10, bx + 10, by + 10], fill=BLACK)
    
    img.save(f"{OUT_DIR}/preview_scene_1.png")
    print("Scene 1 rendered.")

# ==========================================
# 2. SCENE 2 : MACRO COMPUTER VISION SCAN
# ==========================================
def render_scene_2():
    img = Image.new("RGBA", (W, H), (6, 6, 6, 255))
    draw = ImageDraw.Draw(img)
    
    # Center cut fruit macro
    cut_macro = img_cut.resize((1300, 1300), Image.Resampling.LANCZOS)
    img.paste(cut_macro, (W // 2 - 650, H // 2 - 650), cut_macro)
    
    # Perimeter brackets
    draw_bracket(draw, 350, 100, W - 350, H - 100, length=60, color=WHITE, width=3)
    
    font_mono = get_font(FONT_MONO, 18)
    font_mono_small = get_font(FONT_MONO, 13)
    
    # Surface inspection targets
    targets = [
        ("Surface_01", 520, 360, 200, 240, True),
        ("Surface_02", 960, 240, 260, 180, False),
        ("Surface_03", 1120, 680, 220, 200, True),
        ("Surface_04", 1520, 340, 240, 160, False),
    ]
    
    for label, tx, ty, tw, th, is_magnifier in targets:
        bx0, by0 = tx - tw // 2, ty - th // 2
        bx1, by1 = tx + tw // 2, ty + th // 2
        draw_bracket(draw, bx0, by0, bx1, by1, length=20, color=WHITE, width=2)
        draw.text((bx0 + 8, by0 - 24), label, fill=WHITE, font=font_mono)
        
        if is_magnifier:
            # Crop region, invert/high contrast
            crop_sample = img.crop((bx0, by0, bx1, by1))
            crop_gray = crop_sample.convert("L")
            # Invert and boost contrast
            crop_inv = Image.eval(crop_gray, lambda p: 255 - p if p > 30 else 0)
            crop_inv = crop_inv.filter(ImageFilter.SHARPEN)
            img.paste(crop_inv.convert("RGBA"), (bx0, by0))
            draw_bracket(draw, bx0, by0, bx1, by1, length=20, color=WHITE, width=2)
            # Micro crosshair lines
            draw.line([(bx0, by0), (bx1, by1)], fill=(255, 255, 255, 80), width=1)
            draw.line([(bx0, by1), (bx1, by0)], fill=(255, 255, 255, 80), width=1)
            
    # Seed micro target '+' crosshairs
    np.random.seed(42)
    for _ in range(35):
        sx = np.random.randint(580, 1340)
        sy = np.random.randint(280, 850)
        # Check if near center
        dist = math.sqrt((sx - 960)**2 + (sy - 540)**2)
        if dist < 420:
            draw.rectangle([sx - 10, sy - 10, sx + 10, sy + 10], outline=(255, 255, 255, 180), width=1)
            draw.line([(sx - 5, sy), (sx + 5, sy)], fill=WHITE, width=1)
            draw.line([(sx, sy - 5), (sx, sy + 5)], fill=WHITE, width=1)
            
    img.save(f"{OUT_DIR}/preview_scene_2.png")
    print("Scene 2 rendered.")

# ==========================================
# 3. SCENE 3 : LIVING TEXTURE
# ==========================================
def render_scene_3():
    img = Image.new("RGBA", (W, H), DARK_BG + (255,))
    draw = ImageDraw.Draw(img)
    
    # Subtle dot grid
    for gx in range(100, W, 120):
        for gy in range(80, H, 120):
            draw.point((gx, gy), fill=(100, 100, 100))
            
    # Central Fruit
    whole_scaled = img_whole.resize((900, 900), Image.Resampling.LANCZOS)
    img.paste(whole_scaled, (W // 2 - 450, H // 2 - 450), whole_scaled)
    
    # Central inverted texture box
    cw, ch = 320, 320
    cx0, cy0 = W // 2 - cw // 2, H // 2 - ch // 2
    crop_center = img.crop((cx0, cy0, cx0 + cw, cy0 + ch))
    crop_cyan = Image.eval(crop_center.convert("L"), lambda p: p * 1.5)
    # Tint cyan/purple
    crop_colored = Image.merge("RGBA", (
        Image.eval(crop_cyan, lambda p: int(p * 0.2)),
        Image.eval(crop_cyan, lambda p: int(p * 0.9)),
        Image.eval(crop_cyan, lambda p: int(p * 1.0)),
        Image.new("L", (cw, ch), 255)
    ))
    img.paste(crop_colored, (cx0, cy0))
    draw.rectangle([cx0, cy0, cx0 + cw, cy0 + ch], outline=(80, 240, 255), width=2)
    
    # Giant typography
    font_giant = get_font(FONT_CONDENSED_BOLD, 240)
    draw.text((120, 100), "LIVING", fill=CREAM, font=font_giant)
    draw.text((120, H - 360), "TEXTURE", fill=CREAM, font=font_giant)
    
    img.save(f"{OUT_DIR}/preview_scene_3.png")
    print("Scene 3 rendered.")

# ==========================================
# 4. SCENE 4 : PITAYA - SPECIMEN_01
# ==========================================
def render_scene_4():
    img = Image.new("RGBA", (W, H), CREAM + (255,))
    draw = ImageDraw.Draw(img)
    
    # Architectural hairline grid
    for gx in range(160, W, 320):
        draw.line([(gx, 60), (gx, H - 60)], fill=(215, 212, 202), width=1)
    for gy in range(120, H, 240):
        draw.line([(80, gy), (W - 80, gy)], fill=(215, 212, 202), width=1)
        
    # Central dragon fruit
    fruit = img_whole.resize((720, 720), Image.Resampling.LANCZOS)
    fcx, fcy = W // 2, H // 2 - 20
    img.paste(fruit, (fcx - 360, fcy - 360), fruit)
    
    # Specimen bounding box & guides
    box_size = 640
    bx0, by0 = fcx - box_size // 2, fcy - box_size // 2
    bx1, by1 = fcx + box_size // 2, fcy + box_size // 2
    draw.rectangle([bx0, by0, bx1, by1], outline=(180, 175, 165), width=1)
    
    # Green anchor corner squares
    asize = 16
    for ax, ay in [(bx0, by0), (bx1, by0), (bx0, by1), (bx1, by1), (fcx, fcy)]:
        draw.rectangle([ax - asize//2, ay - asize//2, ax + asize//2, ay + asize//2], fill=LIME)
        
    # Diagonal guide lines
    draw.line([(bx0, by0), (bx1, by1)], fill=(180, 175, 165), width=1)
    draw.line([(bx0, by1), (bx1, by0)], fill=(180, 175, 165), width=1)
    
    # Dashed circle orbit
    r = 300
    for deg in range(0, 360, 6):
        rad1 = math.radians(deg)
        rad2 = math.radians(deg + 3)
        x1, y1 = fcx + r * math.cos(rad1), fcy + r * math.sin(rad1)
        x2, y2 = fcx + r * math.cos(rad2), fcy + r * math.sin(rad2)
        draw.line([(x1, y1), (x2, y2)], fill=(150, 145, 135), width=1)
        
    # Big Title "PITAYA"
    font_title = get_font(FONT_CONDENSED_BOLD, 220)
    draw.text((240, H - 360), "PITAYA", fill=BLACK, font=font_title)
    
    # Badge "SPECIMEN_01"
    draw.rectangle([460, H - 210, 720, H - 140], fill=LIME)
    font_mono = get_font(FONT_MONO, 24)
    draw.text((485, H - 192), "SPECIMEN_01", fill=BLACK, font=font_mono)
    
    # Metadata Block top right
    metadata = [
        "SPECIMEN: PITAYA-01",
        "TYPE: DRAGON FRUIT",
        "STATE: FRESH / CUT",
        "RIND: PINK / GREEN",
        "PALETTE: PINK / LIME",
        "SURFACE: ORGANIC",
        "CAPTURE: FRONT STUDY"
    ]
    font_meta = get_font(FONT_MONO, 16)
    my = 280
    for line in metadata:
        draw.text((W - 480, my), line, fill=(50, 50, 50), font=font_meta)
        my += 26
        
    img.save(f"{OUT_DIR}/preview_scene_4.png")
    print("Scene 4 rendered.")

# ==========================================
# 5. SCENE 5 : 5 GROWTH STAGES STAIRCASE
# ==========================================
def render_scene_5():
    img = Image.new("RGBA", (W, H), MAGENTA + (255,))
    draw = ImageDraw.Draw(img)
    
    # Grid lines
    for gx in range(120, W, 240):
        draw.line([(gx, 60), (gx, H - 60)], fill=(196, 0, 102), width=1)
    for gy in range(100, H, 200):
        draw.line([(80, gy), (W - 80, gy)], fill=(196, 0, 102), width=1)
        
    stages = [
        ("Bud", 300, 680, img_bud),
        ("Young", 620, 590, img_bud),
        ("Opening", 940, 500, img_whole),
        ("Ripe", 1260, 410, img_whole),
        ("Cut", 1580, 320, img_cut),
    ]
    
    font_mono = get_font(FONT_MONO, 24)
    card_size = 230
    
    bottom_points = []
    
    for label, cx, cy, fruit_asset in stages:
        draw_card_with_notches(img, cx, cy, card_size, BLACK, notch_size=14)
        scaled = fruit_asset.resize((190, 190), Image.Resampling.LANCZOS)
        img.paste(scaled, (cx - 95, cy - 95), scaled)
        draw.text((cx - card_size // 2, cy - card_size // 2 - 36), label, fill=WHITE, font=font_mono)
        bottom_points.append((cx, cy + card_size // 2))
        
    # Bouncing sine waves between consecutive boxes
    for i in range(len(bottom_points) - 1):
        x_a, y_a = bottom_points[i]
        x_b, y_b = bottom_points[i + 1]
        arc_pts = []
        for s in range(51):
            t = s / 50.0
            x = x_a + (x_b - x_a) * t
            # dip down
            y = (1 - t) * y_a + t * y_b + math.sin(t * math.pi) * 120.0
            arc_pts.append((x, y))
        draw.line(arc_pts, fill=LIME, width=3)
        
    img.save(f"{OUT_DIR}/preview_scene_5.png")
    print("Scene 5 rendered.")

# ==========================================
# 6. SCENE 6 : WAVY TEXT "INSIDE OUT"
# ==========================================
def render_scene_6_wavy():
    img = Image.new("RGBA", (W, H), (8, 8, 8, 255))
    draw = ImageDraw.Draw(img)
    
    letters = ["I", "N", "S", "I", "D", "E", " ", "O", "U", "T"]
    font_wavy = get_font(FONT_CONDENSED_BOLD, 180)
    
    start_x = 260
    base_y = 540
    step_x = 145
    
    node_top = []
    node_bot = []
    
    for i, ch in enumerate(letters):
        if ch == " ":
            continue
        # undulating sine wave
        y_offset = math.sin(i * 0.75 + 1.2) * 55.0
        lx = start_x + i * step_x
        ly = base_y + y_offset
        
        # draw letter in Hot Magenta
        draw.text((lx, ly - 90), ch, fill=MAGENTA, font=font_wavy)
        
        # Get approximate letter box
        bbox = draw.textbbox((lx, ly - 90), ch, font=font_wavy)
        bx0, by0, bx1, by1 = bbox
        
        # Bounding handles (green rectangles)
        hsize = 12
        for hx, hy in [(bx0, by0), (bx1, by0), (bx0, by1), (bx1, by1)]:
            draw.rectangle([hx - hsize//2, hy - hsize//2, hx + hsize//2, hy + hsize//2], outline=LIME, width=2)
            
        node_top.append(((bx0 + bx1)//2, by0))
        node_bot.append(((bx0 + bx1)//2, by1))
        
    # Wireframe tracking mesh lines connecting letter nodes
    draw.line(node_top, fill=(255, 255, 255, 120), width=1)
    draw.line(node_bot, fill=(255, 255, 255, 120), width=1)
    for pt, pb in zip(node_top, node_bot):
        draw.line([pt, pb], fill=(255, 255, 255, 60), width=1)
        
    img.save(f"{OUT_DIR}/preview_scene_6_wavy.png")
    print("Scene 6 Wavy rendered.")

# ==========================================
# 7. SCENE 6 : CONSTELLATION PLEXUS
# ==========================================
def render_scene_6_plexus():
    img = Image.new("RGBA", (W, H), (5, 5, 5, 255))
    draw = ImageDraw.Draw(img)
    
    # Inverted high-contrast cut fruit background
    cut_bg = img_cut.resize((1400, 1400), Image.Resampling.LANCZOS)
    gray = cut_bg.convert("L")
    inv = Image.eval(gray, lambda p: int((255 - p) * 0.85) if p > 20 else 0)
    img.paste(inv.convert("RGBA"), (W // 2 - 700, H // 2 - 700))
    
    font_mono = get_font(FONT_MONO, 12)
    
    # Plexus nodes
    np.random.seed(101)
    nodes = []
    for _ in range(50):
        nx = np.random.randint(460, 1460)
        ny = np.random.randint(180, 920)
        dist = math.sqrt((nx - 960)**2 + (ny - 540)**2)
        if dist < 450:
            nodes.append((nx, ny))
            
    # Connect nearby nodes
    for i, (x1, y1) in enumerate(nodes):
        for j, (x2, y2) in enumerate(nodes[i+1:], i+1):
            d = math.hypot(x2 - x1, y2 - y1)
            if d < 140:
                alpha = int((1.0 - d / 140.0) * 180)
                draw.line([(x1, y1), (x2, y2)], fill=(255, 255, 255, alpha), width=1)
                
    # Draw node dots & coordinate labels
    for i, (nx, ny) in enumerate(nodes):
        draw.ellipse([nx - 3, ny - 3, nx + 3, ny + 3], fill=WHITE)
        if i % 3 == 0:
            coord_str = f"{nx} {ny}"
            draw.text((nx + 6, ny - 6), coord_str, fill=(220, 220, 220), font=font_mono)
            
    # Key highlight target squares (some lime green, some magenta)
    for i, (nx, ny) in enumerate(nodes[:8]):
        color = LIME if i % 2 == 0 else MAGENTA
        draw.rectangle([nx - 18, ny - 18, nx + 18, ny + 18], fill=color + (140,), outline=color, width=2)
        draw.point((nx, ny), fill=WHITE)
        
    img.save(f"{OUT_DIR}/preview_scene_6_plexus.png")
    print("Scene 6 Plexus rendered.")

render_scene_1()
render_scene_2()
render_scene_3()
render_scene_4()
render_scene_5()
render_scene_6_wavy()
render_scene_6_plexus()
print("All preview scenes generated successfully!")
