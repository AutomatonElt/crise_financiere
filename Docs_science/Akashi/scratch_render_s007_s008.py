import bpy
import os
import subprocess

scene = bpy.context.scene
scene.eevee.taa_render_samples = 4
scene.render.resolution_x = 1920
scene.render.resolution_y = 1080
scene.render.resolution_percentage = 100

# Hide deck, road, hangers (State B2)
for name in ["Stiffening_Truss_Deck", "Vertical_Hangers", "Deck_Road_Details"]:
    ob = bpy.data.objects.get(name)
    if ob:
        ob.hide_render = True
        ob.hide_viewport = True

# --- 1. RENDER S007 (Tower quake oscillation) ---
out_dir_s007 = "/tmp/s007_frames"
os.makedirs(out_dir_s007, exist_ok=True)
cam_s007 = bpy.data.objects.get("Cam_S007_QuakeShake")
scene.camera = cam_s007

print("Rendering S007 (24 frames)...")
for i, f in enumerate(range(420, 444)):
    scene.frame_set(f)
    frame_path = os.path.join(out_dir_s007, f"frame_{i:04d}.png")
    scene.render.filepath = frame_path
    bpy.ops.render.render(write_still=True)

mp4_s007 = "/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/renders/S007_tour_secousse.mp4"
cmd_s007 = [
    "ffmpeg", "-y",
    "-framerate", "24",
    "-i", f"{out_dir_s007}/frame_%04d.png",
    "-c:v", "libx264", "-preset", "fast", "-crf", "18", "-pix_fmt", "yuv420p",
    mp4_s007
]
subprocess.run(cmd_s007, check=True)
print("S007 complete:", mp4_s007)

# --- 2. RENDER S008 (Cable vibration) ---
out_dir_s008 = "/tmp/s008_frames"
os.makedirs(out_dir_s008, exist_ok=True)
cam_s008 = bpy.data.objects.get("Cam_S008_CableQuake")
scene.camera = cam_s008

print("Rendering S008 (24 frames)...")
for i, f in enumerate(range(420, 444)):
    scene.frame_set(f)
    frame_path = os.path.join(out_dir_s008, f"frame_{i:04d}.png")
    scene.render.filepath = frame_path
    bpy.ops.render.render(write_still=True)

mp4_s008 = "/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/renders/S008_cable_secousse.mp4"
cmd_s008 = [
    "ffmpeg", "-y",
    "-framerate", "24",
    "-i", f"{out_dir_s008}/frame_%04d.png",
    "-c:v", "libx264", "-preset", "fast", "-crf", "18", "-pix_fmt", "yuv420p",
    mp4_s008
]
subprocess.run(cmd_s008, check=True)
print("S008 complete:", mp4_s008)
