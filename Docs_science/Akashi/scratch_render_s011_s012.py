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

# --- 1. RENDER S011 (Dawn calm wide establishing) ---
out_dir_s011 = "/tmp/s011_frames"
os.makedirs(out_dir_s011, exist_ok=True)
cam_s011 = bpy.data.objects.get("Cam_S011_DawnCalm")
scene.camera = cam_s011

frames_s011 = list(range(1, 155, 2))
if 154 not in frames_s011:
    frames_s011.append(154)

print(f"Rendering S011 ({len(frames_s011)} frames)...")
for i, f in enumerate(frames_s011):
    scene.frame_set(f)
    frame_path = os.path.join(out_dir_s011, f"frame_{i:04d}.png")
    scene.render.filepath = frame_path
    bpy.ops.render.render(write_still=True)

mp4_s011 = "/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/renders/S011_aube_calme.mp4"
cmd_s011 = [
    "ffmpeg", "-y",
    "-framerate", f"{len(frames_s011)/6.4:.4f}",
    "-i", f"{out_dir_s011}/frame_%04d.png",
    "-r", "24",
    "-c:v", "libx264", "-preset", "fast", "-crf", "18", "-pix_fmt", "yuv420p",
    mp4_s011
]
subprocess.run(cmd_s011, check=True)
print("S011 complete:", mp4_s011)

# --- 2. RENDER S012 (Frontal tower push-in) ---
out_dir_s012 = "/tmp/s012_frames"
os.makedirs(out_dir_s012, exist_ok=True)
cam_s012 = bpy.data.objects.get("Cam_S012_PushIn")
scene.camera = cam_s012

frames_s012 = list(range(450, 689, 2))
if 688 not in frames_s012:
    frames_s012.append(688)

print(f"Rendering S012 ({len(frames_s012)} frames)...")
for i, f in enumerate(frames_s012):
    scene.frame_set(f)
    frame_path = os.path.join(out_dir_s012, f"frame_{i:04d}.png")
    scene.render.filepath = frame_path
    bpy.ops.render.render(write_still=True)

mp4_s012 = "/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/renders/S012_tower_approach.mp4"
cmd_s012 = [
    "ffmpeg", "-y",
    "-framerate", f"{len(frames_s012)/9.9:.4f}",
    "-i", f"{out_dir_s012}/frame_%04d.png",
    "-r", "24",
    "-c:v", "libx264", "-preset", "fast", "-crf", "18", "-pix_fmt", "yuv420p",
    mp4_s012
]
subprocess.run(cmd_s012, check=True)
print("S012 complete:", mp4_s012)
