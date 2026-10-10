import bpy
import math
import os
import subprocess

scene = bpy.context.scene
scene.eevee.taa_render_samples = 4
scene.render.resolution_x = 1920
scene.render.resolution_y = 1080
scene.render.resolution_percentage = 100

# Make wide timelapse camera
cam = bpy.data.objects.get("Cam_S036_Timelapse")
if not cam:
    cam_data = bpy.data.cameras.new("Cam_S036_Timelapse")
    cam = bpy.data.objects.new("Cam_S036_Timelapse", cam_data)
    bpy.context.collection.objects.link(cam)

cam.data.lens = 28.0
cam.data.clip_end = 35000.0
cam.location = (-1700.0, -1400.0, 420.0)
cam.rotation_euler = (math.radians(78), 0.0, math.radians(-50))
scene.camera = cam

# Daylight
sun = bpy.data.objects.get("Sun_Dawn")
if sun:
    sun.data.color = (1.0, 0.98, 0.92)
    sun.data.energy = 3.5

world = bpy.context.scene.world
if world and world.node_tree:
    bg = world.node_tree.nodes.get("Background")
    if bg:
        bg.inputs['Color'].default_value = (0.22, 0.38, 0.58, 1.0)
        bg.inputs['Strength'].default_value = 1.0

# Hide deck, road, hangers (State B1 -> B2 only)
for name in ["Stiffening_Truss_Deck", "Vertical_Hangers", "Deck_Road_Details"]:
    ob = bpy.data.objects.get(name)
    if ob:
        ob.hide_render = True
        ob.hide_viewport = True

t1 = bpy.data.objects.get("Tower_2P_Kobe")
t2 = bpy.data.objects.get("Tower_3P_Awaji")
c1 = bpy.data.objects.get("Main_Cable_North")
c2 = bpy.data.objects.get("Main_Cable_South")

out_dir = "/tmp/s036_frames"
os.makedirs(out_dir, exist_ok=True)
total_frames = 45 # 3.7 s at 12 fps interpolated or 24 fps

print(f"Rendering S036 construction timelapse ({total_frames} frames)...")
for f in range(total_frames):
    t = f / (total_frames - 1)
    
    # Phase 1: Towers rising (t: 0 to 0.45)
    tower_progress = min(1.0, max(0.05, t / 0.45))
    if t1:
        t1.scale.z = tower_progress
    if t2:
        t2.scale.z = tower_progress
        
    # Phase 2: Cables strung (t >= 0.45)
    cable_progress = min(1.0, max(0.0, (t - 0.45) / 0.45))
    if c1:
        c1.hide_render = (cable_progress == 0.0)
        c1.scale.z = cable_progress
    if c2:
        c2.hide_render = (cable_progress == 0.0)
        c2.scale.z = cable_progress
        
    scene.frame_set(1)
    frame_path = os.path.join(out_dir, f"frame_{f:04d}.png")
    scene.render.filepath = frame_path
    bpy.ops.render.render(write_still=True)

# Restore scales
if t1: t1.scale.z = 1.0
if t2: t2.scale.z = 1.0
if c1: c1.scale.z = 1.0; c1.hide_render = False
if c2: c2.scale.z = 1.0; c2.hide_render = False

mp4_out = "/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/renders/S036_timelapse_construction.mp4"
cmd = [
    "ffmpeg", "-y",
    "-framerate", f"{total_frames/3.7:.4f}",
    "-i", f"{out_dir}/frame_%04d.png",
    "-vf", "drawtext=text='1988 — 1995 · SEVEN YEARS OF FOUNDATION & TOWER ERECTION':fontcolor=white:fontsize=36:x=(w-text_w)/2:y=h-80:box=1:boxcolor=black@0.6:boxborderw=8",
    "-r", "24",
    "-c:v", "libx264", "-preset", "fast", "-crf", "18", "-pix_fmt", "yuv420p",
    mp4_out
]
subprocess.run(cmd, check=True)
print("S036 complete:", mp4_out)
