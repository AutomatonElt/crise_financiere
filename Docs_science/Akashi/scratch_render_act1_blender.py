import bpy
import math
import os
import subprocess

scene = bpy.context.scene
scene.eevee.taa_render_samples = 4
scene.render.resolution_x = 1920
scene.render.resolution_y = 1080
scene.render.resolution_percentage = 100

# Make sure terrain, water, and environment are visible
for name in ["Terrain_Kobe", "Terrain_Awaji", "Sea_Water", "Tower_2P_Kobe", "Tower_3P_Awaji"]:
    ob = bpy.data.objects.get(name)
    if ob:
        ob.hide_render = False
        ob.hide_viewport = False

# Sun / daylight for Act 1
sun = bpy.data.objects.get("Sun_Dawn")
if sun:
    sun.data.color = (1.0, 0.95, 0.88) # Clear morning daylight
    sun.data.energy = 3.0

world = bpy.context.scene.world
if world and world.node_tree:
    bg = world.node_tree.nodes.get("Background")
    if bg:
        bg.inputs['Color'].default_value = (0.22, 0.38, 0.58, 1.0) # Clear blue sky
        bg.inputs['Strength'].default_value = 1.0

# ==============================================================================
# --- 1. S021: Kobe Coastline & Mount Rokko Flyover (6.6 s, 79 frames) ---
# ==============================================================================
print("\n>>> STARTING S021 KOBE COAST...")
cam_s021 = bpy.data.objects.get("Cam_S021_KobeCoast")
if not cam_s021:
    cam_data = bpy.data.cameras.new("Cam_S021_KobeCoast")
    cam_s021 = bpy.data.objects.new("Cam_S021_KobeCoast", cam_data)
    bpy.context.collection.objects.link(cam_s021)

cam_s021.data.lens = 32.0
cam_s021.data.clip_end = 35000.0
scene.camera = cam_s021

# Camera starts on hills behind Kobe (x=-3200, y=1400, z=380) and glides seaward
out_dir_s021 = "/tmp/s021_frames"
os.makedirs(out_dir_s021, exist_ok=True)
frames_s021 = list(range(1, 159, 2)) # 79 frames for 6.6 s

for i, f in enumerate(frames_s021):
    t = i / (len(frames_s021) - 1)
    x = -3200.0 + t * 400.0
    y = 1400.0 - t * 500.0
    z = 380.0 - t * 80.0
    cam_s021.location = (x, y, z)
    # Looking down and out to sea towards Kobe port and strait
    cam_s021.rotation_euler = (math.radians(72), 0.0, math.radians(-125))
    
    scene.frame_set(f)
    frame_path = os.path.join(out_dir_s021, f"frame_{i:04d}.png")
    scene.render.filepath = frame_path
    bpy.ops.render.render(write_still=True)

mp4_s021 = "/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/renders/S021_kobe_cote_survol.mp4"
cmd_s021 = [
    "ffmpeg", "-y",
    "-framerate", f"{len(frames_s021)/6.6:.4f}",
    "-i", f"{out_dir_s021}/frame_%04d.png",
    "-r", "24",
    "-c:v", "libx264", "-preset", "fast", "-crf", "18", "-pix_fmt", "yuv420p",
    mp4_s021
]
subprocess.run(cmd_s021, check=True)
print("S021 complete:", mp4_s021)

# ==============================================================================
# --- 2. S022: Panning Across 4km Strait from Kobe to Awaji (5.2 s, 63 frames) ---
# ==============================================================================
print("\n>>> STARTING S022 4KM PANORAMA...")
cam_s022 = bpy.data.objects.get("Cam_S022_StraitPan")
if not cam_s022:
    cam_data = bpy.data.cameras.new("Cam_S022_StraitPan")
    cam_s022 = bpy.data.objects.new("Cam_S022_StraitPan", cam_data)
    bpy.context.collection.objects.link(cam_s022)

cam_s022.data.lens = 40.0
cam_s022.data.clip_end = 35000.0
scene.camera = cam_s022

out_dir_s022 = "/tmp/s022_frames"
os.makedirs(out_dir_s022, exist_ok=True)
frames_s022 = list(range(1, 126, 2)) # 63 frames for 5.2 s

# Stationed above Kobe shore at x=-1800, y=-900, z=280, panning from -995m tower to +995m tower & Awaji
for i, f in enumerate(frames_s022):
    t = i / (len(frames_s022) - 1)
    pan_angle = math.radians(-75 + t * 45) # Pan from Kobe tower towards Awaji island
    cam_s022.location = (-1800.0, -900.0, 280.0)
    cam_s022.rotation_euler = (math.radians(80), 0.0, pan_angle)
    
    scene.frame_set(f)
    frame_path = os.path.join(out_dir_s022, f"frame_{i:04d}.png")
    scene.render.filepath = frame_path
    bpy.ops.render.render(write_still=True)

mp4_s022 = "/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/renders/S022_detroit_panoramique.mp4"
cmd_s022 = [
    "ffmpeg", "-y",
    "-framerate", f"{len(frames_s022)/5.2:.4f}",
    "-i", f"{out_dir_s022}/frame_%04d.png",
    "-vf", "drawtext=text='AKASHI STRAIT · 4 KILOMETERS':fontcolor=white:fontsize=42:x=(w-text_w)/2:y=h-120:box=1:boxcolor=black@0.5:boxborderw=10",
    "-r", "24",
    "-c:v", "libx264", "-preset", "fast", "-crf", "18", "-pix_fmt", "yuv420p",
    mp4_s022
]
subprocess.run(cmd_s022, check=True)
print("S022 complete:", mp4_s022)

# ==============================================================================
# --- 3. S024: Top-down View of Busy Shipping Lane (7.0 s, 84 frames) ---
# ==============================================================================
print("\n>>> STARTING S024 SHIPPING LANE TOP-DOWN...")
cam_s024 = bpy.data.objects.get("Cam_S024_TopDownLane")
if not cam_s024:
    cam_data = bpy.data.cameras.new("Cam_S024_TopDownLane")
    cam_s024 = bpy.data.objects.new("Cam_S024_TopDownLane", cam_data)
    bpy.context.collection.objects.link(cam_s024)

cam_s024.data.lens = 35.0
cam_s024.data.clip_end = 35000.0
scene.camera = cam_s024

out_dir_s024 = "/tmp/s024_frames"
os.makedirs(out_dir_s024, exist_ok=True)
frames_s024 = list(range(1, 169, 2)) # 84 frames for 7.0 s

for i, f in enumerate(frames_s024):
    t = i / (len(frames_s024) - 1)
    # Descend from altitude 1600m to 1100m directly above the navigation channel center
    cam_s024.location = (0.0, 0.0, 1600.0 - t * 500.0)
    cam_s024.rotation_euler = (math.radians(15), 0.0, math.radians(-90)) # Looking almost straight down with slight angle
    
    scene.frame_set(f)
    frame_path = os.path.join(out_dir_s024, f"frame_{i:04d}.png")
    scene.render.filepath = frame_path
    bpy.ops.render.render(write_still=True)

mp4_s024 = "/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/renders/S024_chenal_maritime_topdown.mp4"
cmd_s024 = [
    "ffmpeg", "-y",
    "-framerate", f"{len(frames_s024)/7.0:.4f}",
    "-i", f"{out_dir_s024}/frame_%04d.png",
    "-vf", "drawtext=text='1,400 SHIPS DAILY · MAJOR INTERNATIONAL SHIPPING LANE':fontcolor=white:fontsize=38:x=(w-text_w)/2:y=h-100:box=1:boxcolor=black@0.6:boxborderw=8",
    "-r", "24",
    "-c:v", "libx264", "-preset", "fast", "-crf", "18", "-pix_fmt", "yuv420p",
    mp4_s024
]
subprocess.run(cmd_s024, check=True)
print("S024 complete:", mp4_s024)
print("\n>>> ACT 1 BLENDER SHOTS (S021, S022, S024) COMPLETED!")
