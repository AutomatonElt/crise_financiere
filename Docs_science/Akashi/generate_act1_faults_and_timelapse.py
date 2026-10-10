import os
import math
import subprocess
from PIL import Image, ImageDraw

renders_dir = "/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/renders"
width, height = 1920, 1080
fps = 24

# ==============================================================================
# --- S034 & S035: Fault Mapping & M8.5 Earthquake Design (18.0 s, 432 frames) ---
# ==============================================================================
out_dir_faults = "/tmp/s034_s035_frames"
os.makedirs(out_dir_faults, exist_ok=True)
total_frames = int(18.0 * fps)

print(f"Generating S034 & S035 seismic graphics ({total_frames} frames)...")
for f in range(total_frames):
    t = f / (total_frames - 1)
    img = Image.new("RGBA", (width, height), (12, 16, 25, 255))
    draw = ImageDraw.Draw(img)
    
    # Technical grid
    for gx in range(0, width, 80):
        draw.line([(gx, 0), (gx, height)], fill=(20, 28, 42, 80), width=1)
    for gy in range(0, height, 80):
        draw.line([(0, gy), (width, gy)], fill=(20, 28, 42, 80), width=1)
        
    # Coastlines
    # Kobe (top right)
    draw.polygon([(700, 200), (1800, 150), (1800, 520), (1350, 480), (1050, 440), (850, 360), (700, 200)], fill=(24, 34, 50, 255), outline=(40, 60, 85, 255))
    # Awaji (bottom left)
    draw.polygon([(450, 520), (850, 480), (950, 650), (750, 950), (400, 950), (350, 750), (450, 520)], fill=(24, 34, 50, 255), outline=(40, 60, 85, 255))
    
    # Bridge alignment axis
    b1_x, b1_y = 1020, 430 # Kobe anchorage 1A
    b2_x, b2_y = 880, 510  # Awaji anchorage 4A
    draw.line([(b1_x, b1_y), (b2_x, b2_y)], fill=(0, 200, 255, 120), width=2)
    
    # --- S034 phase (first 6.6 s / t: 0 to 0.37) ---
    if t < 0.40:
        # Seismic waves pulsing
        p_t = t / 0.37
        epicenter_x, epicenter_y = 780, 600
        for ring in range(1, 5):
            radius = int((p_t * 600 + ring * 120) % 700)
            alpha = int(max(0, 255 * (1.0 - radius / 700)))
            draw.ellipse([epicenter_x - radius, epicenter_y - radius, epicenter_x + radius, epicenter_y + radius], outline=(255, 60, 60, alpha), width=3)
            
        draw.text((80, 70), "SEISMIC RESISTANCE SPECIFICATIONS · JAPAN METEOROLOGICAL AGENCY", fill=(140, 160, 190, 220))
        draw.text((80, 110), "DESIGN BASIS GROUND MOTION: MAGNITUDE 8.5 INTERPLATE MEGATHRUST", fill=(255, 80, 80, 255))
        draw.text((80, 150), "MAXIMUM ACCELERATION SPECTRUM: 0.8g (TOLERABLE HORIZONTAL LOAD)", fill=(255, 200, 80, 220))
        
    # --- S035 phase (t >= 0.37) ---
    else:
        fault_t = min(1.0, (t - 0.37) / 0.25)
        
        # Red fault lines appearing
        # Nojima Fault on Awaji
        draw.line([(550, 850), (720, 620), (810, 510)], fill=(255, 50, 50, int(fault_t * 255)), width=4)
        draw.text((580, 750), "NOJIMA FAULT ZONE", fill=(255, 70, 70, int(fault_t * 255)))
        # Rokko / Suma Fault zone on Kobe side
        draw.line([(960, 420), (1200, 360), (1500, 310)], fill=(255, 50, 50, int(fault_t * 255)), width=4)
        draw.text((1220, 330), "ROKKO - SUMA FAULT SYSTEM", fill=(255, 70, 70, int(fault_t * 255)))
        
        # Foundation markers placed away from fault traces
        p_offset = min(1.0, max(0.0, (t - 0.55) / 0.3))
        f_alpha = int(p_offset * 255)
        
        # 2P Tower Foundation (Main Honshu tower)
        p2_x, p2_y = 970, 460
        draw.ellipse([p2_x - 8, p2_y - 8, p2_x + 8, p2_y + 8], fill=(0, 255, 200, f_alpha))
        draw.text((p2_x + 18, p2_y - 10), "2P FOUNDATION: ANCHORED IN GRANITIC BEDROCK", fill=(0, 255, 200, f_alpha))
        draw.text((p2_x + 18, p2_y + 12), "CLEARANCE: SAFELY OFFSET FROM RUPTURE TRACES", fill=(160, 220, 255, f_alpha))
        
        # 3P Tower Foundation (Awaji tower)
        p3_x, p3_y = 920, 490
        draw.ellipse([p3_x - 8, p3_y - 8, p3_x + 8, p3_y + 8], fill=(0, 255, 200, f_alpha))
        draw.text((p3_x - 380, p3_y + 20), "3P FOUNDATION: Ø80m STEEL CAISSON", fill=(0, 255, 200, f_alpha))
        
        draw.text((80, 70), "TECTONIC RECONNAISSANCE · ACTIVE FAULT ZONE MAPPING", fill=(140, 160, 190, 220))
        draw.text((80, 110), "STRATEGIC DECISION: FOUNDATIONS OFFSET AWAY FROM SHEAR PLANES", fill=(0, 255, 200, 255))
        
    img.save(os.path.join(out_dir_faults, f"frame_{f:04d}.png"))

mp4_faults = os.path.join(renders_dir, "S034_S035_failles_sismiques.mp4")
subprocess.run(["ffmpeg", "-y", "-framerate", "24", "-i", f"{out_dir_faults}/frame_%04d.png", "-c:v", "libx264", "-preset", "fast", "-crf", "18", "-pix_fmt", "yuv420p", mp4_faults], check=True)
print("S034/S035 complete:", mp4_faults)
