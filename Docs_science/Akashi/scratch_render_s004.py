import bpy
import os
import subprocess

out_dir = "/tmp/s004_frames"
os.makedirs(out_dir, exist_ok=True)

scene = bpy.context.scene
scene.camera = bpy.data.objects.get("Cam_S004_CableTrack")
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

frames = list(range(190, 411, 2))
if 410 not in frames:
    frames.append(410)

print(f"Rendering {len(frames)} frames for S004...")
for i, f in enumerate(frames):
    scene.frame_set(f)
    frame_path = os.path.join(out_dir, f"frame_{i:04d}.png")
    scene.render.filepath = frame_path
    bpy.ops.render.render(write_still=True)
    if i % 10 == 0 or i == len(frames) - 1:
        print(f"Rendered {i+1}/{len(frames)} (Blender frame {f})")

# Encode with ffmpeg: 9.2 s duration
mp4_out = "/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/renders/S004_cable_travelling.mp4"
cmd = [
    "ffmpeg", "-y",
    "-framerate", f"{len(frames)/9.2:.4f}",
    "-i", f"{out_dir}/frame_%04d.png",
    "-r", "24",
    "-c:v", "libx264", "-preset", "fast", "-crf", "18", "-pix_fmt", "yuv420p",
    mp4_out
]
print("Encoding S004 video with ffmpeg...")
subprocess.run(cmd, check=True)
print("S004 complete:", mp4_out)

