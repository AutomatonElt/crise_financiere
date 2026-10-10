import os
import math
import subprocess
from PIL import Image, ImageDraw, ImageFont

renders_dir = "/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/renders"
os.makedirs(renders_dir, exist_ok=True)

width, height = 1920, 1080
fps = 24

# ==============================================================================
# --- S027: Honshu-Shikoku Bridge Project Routes (5.9 s, 142 frames) ---
# ==============================================================================
out_dir_s027 = "/tmp/s027_frames"
os.makedirs(out_dir_s027, exist_ok=True)
total_s027 = int(5.9 * fps)

print(f"Generating S027 map routes ({total_s027} frames)...")
for f in range(total_s027):
    t = f / (total_s027 - 1)
    img = Image.new("RGBA", (width, height), (12, 16, 26, 255))
    draw = ImageDraw.Draw(img)
    
    # Grid
    for gx in range(0, width, 100):
        draw.line([(gx, 0), (gx, height)], fill=(22, 30, 48, 100), width=1)
    for gy in range(0, height, 100):
        draw.line([(0, gy), (width, gy)], fill=(22, 30, 48, 100), width=1)
        
    # Coastlines simplified: Honshu (top) and Shikoku (bottom)
    # Honshu coast
    draw.polygon([(200, 150), (1720, 150), (1720, 420), (1450, 450), (1150, 420), (950, 380), (700, 390), (450, 430), (200, 400)], fill=(25, 35, 52, 255), outline=(45, 65, 95, 255))
    # Awaji Island (middle)
    draw.polygon([(1120, 460), (1220, 470), (1240, 600), (1160, 680), (1100, 620), (1110, 520)], fill=(30, 42, 62, 255), outline=(50, 75, 110, 255))
    # Shikoku coast
    draw.polygon([(200, 680), (450, 620), (750, 600), (1050, 650), (1150, 720), (1450, 750), (1720, 720), (1720, 950), (200, 950)], fill=(25, 35, 52, 255), outline=(45, 65, 95, 255))
    
    # Header
    draw.text((80, 60), "HONSHU-SHIKOKU BRIDGE INITIATIVE · 3 STRATEGIC CROSSINGS", fill=(130, 150, 180, 220))
    
    # Route 1: Kobe-Naruto (Akashi Kaikyo + Naruto)
    p1_progress = min(1.0, max(0.0, (t - 0.1) / 0.4))
    if p1_progress > 0:
        # Akashi strait line: (1160, 435) to (1160, 470)
        draw.line([(1160, 430), (1160, 430 + int(p1_progress * 40))], fill=(0, 240, 255, 255), width=4)
        draw.text((1180, 440), "ROUTE 1: AKASHI KAIKYO BRIDGE", fill=(0, 240, 255, int(p1_progress * 255)))
        # Naruto line
        draw.line([(1140, 650), (1140, 650 + int(p1_progress * 60))], fill=(0, 200, 240, 200), width=3)
        
    # Route 2: Kojima-Sakaide (Great Seto Bridge)
    p2_progress = min(1.0, max(0.0, (t - 0.4) / 0.3))
    if p2_progress > 0:
        draw.line([(780, 395), (780, 395 + int(p2_progress * 215))], fill=(80, 200, 140, 220), width=3)
        draw.text((800, 500), "ROUTE 2: SETO OHASHI", fill=(80, 200, 140, int(p2_progress * 255)))
        
    # Route 3: Shimanami Kaido
    p3_progress = min(1.0, max(0.0, (t - 0.65) / 0.3))
    if p3_progress > 0:
        draw.line([(450, 430), (450, 430 + int(p3_progress * 200))], fill=(180, 140, 240, 220), width=3)
        draw.text((470, 530), "ROUTE 3: SHIMANAMI KAIDO", fill=(180, 140, 240, int(p3_progress * 255)))
        
    img.save(os.path.join(out_dir_s027, f"frame_{f:04d}.png"))

mp4_s027 = os.path.join(renders_dir, "S027_routes_cartes.mp4")
subprocess.run(["ffmpeg", "-y", "-framerate", "24", "-i", f"{out_dir_s027}/frame_%04d.png", "-c:v", "libx264", "-preset", "fast", "-crf", "18", "-pix_fmt", "yuv420p", mp4_s027], check=True)
print("S027 complete:", mp4_s027)

# ==============================================================================
# --- S028: Elevation Schematic (No pillars in shipping lane, 5.4 s) ---
# ==============================================================================
out_dir_s028 = "/tmp/s028_frames"
os.makedirs(out_dir_s028, exist_ok=True)
total_s028 = int(5.4 * fps)

print(f"Generating S028 channel rules elevation ({total_s028} frames)...")
for f in range(total_s028):
    t = f / (total_s028 - 1)
    img = Image.new("RGBA", (width, height), (10, 15, 24, 255))
    draw = ImageDraw.Draw(img)
    
    # Water line
    water_y = 560
    draw.line([(100, water_y), (1820, water_y)], fill=(30, 80, 140, 255), width=2)
    # Seabed depth profile (-110 m)
    draw.line([(100, 680), (400, 700), (960, 780), (1520, 700), (1820, 680)], fill=(40, 55, 75, 255), width=2)
    draw.text((120, 720), "SEABED: -110m MAXIMUM DEPTH · HIGH-VELOCITY TIDAL CURRENTS (4.5 m/s)", fill=(70, 95, 125, 200))
    
    # 1,500m Shipping Channel Box
    ch_x1, ch_x2 = 480, 1440
    channel_alpha = int(min(1.0, t / 0.4) * 255)
    draw.rectangle([ch_x1, water_y - 280, ch_x2, water_y], fill=(255, 180, 0, 20), outline=(255, 190, 20, channel_alpha), width=2)
    draw.text((ch_x1 + 30, water_y - 250), "INTERNATIONAL NAVIGATION CHANNEL · 1,500 METERS WIDE", fill=(255, 200, 40, channel_alpha))
    draw.text((ch_x1 + 30, water_y - 210), "MANDATORY RESTRICTION: ZERO SUBSTRUCTURE PILLARS PERMITTED", fill=(255, 120, 40, channel_alpha))
    
    # Tower Foundation Positions (Strictly outside 1,500m zone)
    t1_x = 450
    t2_x = 1470
    draw.line([(t1_x, water_y - 320), (t1_x, 720)], fill=(0, 220, 255, 255), width=3)
    draw.text((t1_x - 120, water_y - 350), "TOWER 2P (KOBE)", fill=(0, 220, 255, 255))
    draw.line([(t2_x, water_y - 320), (t2_x, 720)], fill=(0, 220, 255, 255), width=3)
    draw.text((t2_x - 120, water_y - 350), "TOWER 3P (AWAJI)", fill=(0, 220, 255, 255))
    
    img.save(os.path.join(out_dir_s028, f"frame_{f:04d}.png"))

mp4_s028 = os.path.join(renders_dir, "S028_regles_chenal.mp4")
subprocess.run(["ffmpeg", "-y", "-framerate", "24", "-i", f"{out_dir_s028}/frame_%04d.png", "-c:v", "libx264", "-preset", "fast", "-crf", "18", "-pix_fmt", "yuv420p", mp4_s028], check=True)
print("S028 complete:", mp4_s028)

# ==============================================================================
# --- S029 & S030: Ruler 1,990 m Deployment & Pulse (14.1 s, 338 frames) ---
# ==============================================================================
out_dir_s029 = "/tmp/s029_frames"
os.makedirs(out_dir_s029, exist_ok=True)
total_s029 = int(14.1 * fps)

print(f"Generating S029/S030 ruler deployment ({total_s029} frames)...")
for f in range(total_s029):
    t = f / (total_s029 - 1)
    img = Image.new("RGBA", (width, height), (8, 12, 20, 255))
    draw = ImageDraw.Draw(img)
    
    # Deploy ruler over first 6 seconds (t: 0 to 0.42)
    deploy_t = min(1.0, t / 0.45)
    ease_d = deploy_t * deploy_t * (3 - 2 * deploy_t)
    
    # Pulse on S030 (t > 0.76)
    pulse = 1.0
    if t > 0.76:
        pulse_phase = (t - 0.76) * 12.0
        pulse = 1.0 + math.sin(pulse_phase) * 0.15 if pulse_phase < math.pi * 2 else 1.0
        
    x_start = 300
    x_end = x_start + int(1320 * ease_d)
    y_ruler = 540
    
    # Draw dimension line
    draw.line([(x_start, y_ruler), (x_end, y_ruler)], fill=(0, 220, 255, 255), width=int(4 * pulse))
    draw.line([(x_start, y_ruler - 40), (x_start, y_ruler + 40)], fill=(0, 220, 255, 255), width=3)
    draw.line([(x_end, y_ruler - 40), (x_end, y_ruler + 40)], fill=(0, 220, 255, 255), width=3)
    
    # Distance counter
    dist = 1990.0 * ease_d
    draw.text((width // 2 - 280, y_ruler - 140), f"MAIN SPAN: {dist:6.1f} METERS", fill=(255, 255, 255, 255))
    draw.text((width // 2 - 240, y_ruler + 60), "LONGEST SUSPENSION SPAN EVER DESIGNED", fill=(0, 200, 240, 200))
    
    # HUD text
    draw.text((80, 80), "STRUCTURAL DIMENSIONS · AKASHI KAIKYO BRIDGE", fill=(120, 140, 170, 200))
    if t > 0.76:
        draw.text((width // 2 - 320, y_ruler + 110), "EVERY STRUCTURAL COMPONENT IS CALIBRATED TO THIS DISTANCE", fill=(255, 220, 80, 255))
        
    img.save(os.path.join(out_dir_s029, f"frame_{f:04d}.png"))

mp4_s029 = os.path.join(renders_dir, "S029_S030_regle_1990m.mp4")
subprocess.run(["ffmpeg", "-y", "-framerate", "24", "-i", f"{out_dir_s029}/frame_%04d.png", "-c:v", "libx264", "-preset", "fast", "-crf", "18", "-pix_fmt", "yuv420p", mp4_s029], check=True)
print("S029/S030 complete:", mp4_s029)
