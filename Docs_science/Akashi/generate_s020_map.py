import os
import math
import subprocess
from PIL import Image, ImageDraw, ImageFont

out_dir = "/tmp/s020_frames"
os.makedirs(out_dir, exist_ok=True)

width, height = 1920, 1080
fps = 24
duration = 4.7
total_frames = int(duration * fps) # 112 frames

# Simplified Japanese islands outline coordinates (normalized 0 to 1)
# Honshu, Shikoku, Kyushu, Hokkaido
japan_landmass = [
    # Honshu main spine
    [(0.45, 0.75), (0.48, 0.72), (0.52, 0.70), (0.55, 0.68), (0.58, 0.65), (0.62, 0.60), (0.65, 0.52), (0.68, 0.45), (0.69, 0.38), (0.65, 0.35), (0.62, 0.40), (0.60, 0.48), (0.55, 0.55), (0.50, 0.60), (0.45, 0.65), (0.40, 0.70), (0.35, 0.75), (0.38, 0.78), (0.45, 0.75)],
    # Shikoku
    [(0.42, 0.77), (0.47, 0.75), (0.48, 0.78), (0.44, 0.82), (0.40, 0.80), (0.42, 0.77)],
    # Kyushu
    [(0.30, 0.78), (0.35, 0.76), (0.36, 0.82), (0.32, 0.88), (0.28, 0.85), (0.30, 0.78)],
    # Hokkaido
    [(0.68, 0.30), (0.75, 0.22), (0.82, 0.20), (0.80, 0.28), (0.74, 0.33), (0.68, 0.30)]
]

# Target: Akashi Strait is around (0.495, 0.705)
target_x, target_y = 0.495, 0.705

print(f"Generating S020 map zoom ({total_frames} frames)...")

for frame in range(total_frames):
    t = frame / (total_frames - 1) # 0 to 1
    # Smooth cubic ease
    ease = t * t * (3 - 2 * t)
    
    # Zoom level from 1.0 (Japan wide) to 6.5 (Akashi Strait close)
    zoom = 1.0 + ease * 6.0
    
    # Center shifts towards Akashi Strait
    cx = 0.52 + ease * (target_x - 0.52)
    cy = 0.58 + ease * (target_y - 0.58)
    
    # Canvas
    img = Image.new("RGBA", (width, height), (10, 14, 22, 255)) # Dark navy
    draw = ImageDraw.Draw(img)
    
    # Draw subtle background grid
    grid_size = 80
    for gx in range(0, width, grid_size):
        draw.line([(gx, 0), (gx, height)], fill=(20, 28, 42, 100), width=1)
    for gy in range(0, height, grid_size):
        draw.line([(0, gy), (width, gy)], fill=(20, 28, 42, 100), width=1)
        
    def to_screen(nx, ny):
        sx = width / 2 + (nx - cx) * width * zoom * 0.9
        sy = height / 2 + (ny - cy) * height * zoom * 0.9
        return (sx, sy)
        
    # Draw islands
    for poly in japan_landmass:
        screen_poly = [to_screen(px, py) for px, py in poly]
        draw.polygon(screen_poly, fill=(28, 38, 54, 255), outline=(45, 65, 90, 255))
        
    # Akashi Strait target point
    tx, ty = to_screen(target_x, target_y)
    
    # Glowing locator pulse
    if t > 0.3:
        pulse_alpha = int(min(1.0, (t - 0.3) / 0.3) * 255)
        radius = 20 + math.sin(frame * 0.3) * 6
        draw.ellipse([tx - radius, ty - radius, tx + radius, ty + radius], outline=(0, 220, 255, pulse_alpha), width=2)
        draw.ellipse([tx - 4, ty - 4, tx + 4, ty + 4], fill=(255, 255, 255, pulse_alpha))
        
        # Labels when zoomed in
        if t > 0.6:
            label_alpha = int(min(1.0, (t - 0.6) / 0.3) * 255)
            # Text lines
            draw.text((tx + 28, ty - 22), "HONSHU (KOBE)", fill=(220, 230, 245, label_alpha))
            draw.text((tx + 28, ty + 12), "AWAJI ISLAND", fill=(180, 200, 220, label_alpha))
            draw.text((tx - 160, ty - 6), "AKASHI STRAIT", fill=(0, 220, 255, label_alpha))
            draw.line([(tx + 6, ty - 14), (tx + 24, ty - 14)], fill=(0, 220, 255, label_alpha), width=2)
            draw.line([(tx + 6, ty + 20), (tx + 24, ty + 20)], fill=(0, 220, 255, label_alpha), width=2)
            
    # Technical HUD header
    draw.text((60, 50), "GEOGRAPHICAL RECONNAISSANCE · SETO INLAND SEA", fill=(120, 140, 170, 200))
    draw.text((60, 75), f"COORDINATES: 34°37' N, 135°01' E  |  SCALE 1:{int(500000 / zoom):,}", fill=(80, 105, 135, 200))
    
    img.save(os.path.join(out_dir, f"frame_{frame:04d}.png"))

mp4_out = "/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/renders/S020_carte_japon_zoom.mp4"
cmd = [
    "ffmpeg", "-y",
    "-framerate", "24",
    "-i", f"{out_dir}/frame_%04d.png",
    "-c:v", "libx264", "-preset", "fast", "-crf", "18", "-pix_fmt", "yuv420p",
    mp4_out
]
subprocess.run(cmd, check=True)
print("S020 complete:", mp4_out)
