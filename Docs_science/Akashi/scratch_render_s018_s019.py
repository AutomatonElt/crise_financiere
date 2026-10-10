import bpy
import math
import os
import subprocess

scene = bpy.context.scene
scene.eevee.taa_render_samples = 4
scene.render.resolution_x = 1920
scene.render.resolution_y = 1080
scene.render.resolution_percentage = 100

# STATE B4: Finished bridge (SHOW deck, road, hangers)
for name in ["Stiffening_Truss_Deck", "Vertical_Hangers", "Deck_Road_Details", "Tower_2P_Kobe", "Tower_3P_Awaji", "Main_Cable_North", "Main_Cable_South", "Sea_Water", "Terrain_Kobe", "Terrain_Awaji"]:
    ob = bpy.data.objects.get(name)
    if ob:
        ob.hide_render = False
        ob.hide_viewport = False

# Reset materials to standard if altered
mat_truss = bpy.data.materials.get("Mat_Truss_Deck")
deck = bpy.data.objects.get("Stiffening_Truss_Deck")
if deck and mat_truss:
    deck.data.materials[0] = mat_truss

# --- 1. S018: Fast flyover along completed deck in warm daylight (3.6 s) ---
cam_s018 = bpy.data.objects.get("Cam_S018_FastFlyover")
if not cam_s018:
    cam_data = bpy.data.cameras.new("Cam_S018_FastFlyover")
    cam_s018 = bpy.data.objects.new("Cam_S018_FastFlyover", cam_data)
    bpy.context.collection.objects.link(cam_s018)

cam_s018.data.lens = 28.0
cam_s018.data.clip_end = 25000.0
scene.camera = cam_s018

# Sun for S018: Warm daylight
sun = bpy.data.objects.get("Sun_Dawn")
if sun:
    sun.data.color = (1.0, 0.96, 0.88)
    sun.data.energy = 3.5

# Fly along deck: x = -900 to -100 over 43 frames (step=2 of 86 frames = 3.6 s)
out_dir_s018 = "/tmp/s018_frames"
os.makedirs(out_dir_s018, exist_ok=True)

frames_s018 = list(range(1, 87, 2))
print(f"Rendering S018 ({len(frames_s018)} frames)...")
for i, f in enumerate(frames_s018):
    t = i / (len(frames_s018) - 1)
    # Move along roadway
    x = -900.0 + t * 800.0
    y = 5.0
    z = 70.0 # Just above roadway
    cam_s018.location = (x, y, z)
    # Looking forward along the bridge deck towards Awaji
    cam_s018.rotation_euler = (math.radians(88), 0.0, math.radians(-90))
    
    scene.frame_set(f)
    frame_path = os.path.join(out_dir_s018, f"frame_{i:04d}.png")
    scene.render.filepath = frame_path
    bpy.ops.render.render(write_still=True)

mp4_s018 = "/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/renders/S018_pont_survol.mp4"
cmd_s018 = [
    "ffmpeg", "-y",
    "-framerate", f"{len(frames_s018)/3.6:.4f}",
    "-i", f"{out_dir_s018}/frame_%04d.png",
    "-r", "24",
    "-c:v", "libx264", "-preset", "fast", "-crf", "18", "-pix_fmt", "yuv420p",
    mp4_s018
]
subprocess.run(cmd_s018, check=True)
print("S018 complete:", mp4_s018)

# --- 2. S019: Sunset finale push-in (10.5 s, frames 700 to 940) ---
out_dir_s019 = "/tmp/s019_frames"
os.makedirs(out_dir_s019, exist_ok=True)

cam_s019 = bpy.data.objects.get("Cam_S083_Finale")
scene.camera = cam_s019

# Set World and Sun to Dusk (orange-violet sky)
world = bpy.context.scene.world
if world and world.node_tree:
    bg = world.node_tree.nodes.get("Background")
    if bg:
        bg.inputs['Color'].default_value = (0.55, 0.22, 0.35, 1.0) # Dusk magenta-orange
        bg.inputs['Strength'].default_value = 1.0

if sun:
    sun.data.color = (1.0, 0.45, 0.2) # Deep orange sunset sun
    sun.data.energy = 4.0

frames_s019 = list(range(700, 941, 2))
if 940 not in frames_s019:
    frames_s019.append(940)

print(f"Rendering S019 ({len(frames_s019)} frames)...")
for i, f in enumerate(frames_s019):
    scene.frame_set(f)
    frame_path = os.path.join(out_dir_s019, f"frame_{i:04d}.png")
    scene.render.filepath = frame_path
    bpy.ops.render.render(write_still=True)
    if i % 20 == 0:
        print(f"S019: {i+1}/{len(frames_s019)}")

mp4_s019 = "/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/renders/S019_crepuscule_finale.mp4"
cmd_s019 = [
    "ffmpeg", "-y",
    "-framerate", f"{len(frames_s019)/10.5:.4f}",
    "-i", f"{out_dir_s019}/frame_%04d.png",
    "-r", "24",
    "-c:v", "libx264", "-preset", "fast", "-crf", "18", "-pix_fmt", "yuv420p",
    mp4_s019
]
subprocess.run(cmd_s019, check=True)
print("S019 complete:", mp4_s019)
