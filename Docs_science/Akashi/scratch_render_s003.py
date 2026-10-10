import bpy
import os
import subprocess

out_dir = "/tmp/s003_frames"
os.makedirs(out_dir, exist_ok=True)

scene = bpy.context.scene
scene.camera = bpy.data.objects.get("Cam_S003_Descent")
scene.eevee.taa_render_samples = 4
scene.render.resolution_x = 1920
scene.render.resolution_y = 1080
scene.render.resolution_percentage = 100

# Step = 2 gives 94 frames, fast and very smooth
frames = list(range(1, 188, 2))
if 187 not in frames:
    frames.append(187)

print(f"Rendering {len(frames)} frames for S003...")
for i, f in enumerate(frames):
    scene.frame_set(f)
    frame_path = os.path.join(out_dir, f"frame_{i:04d}.png")
    scene.render.filepath = frame_path
    bpy.ops.render.render(write_still=True)
    if i % 10 == 0 or i == len(frames) - 1:
        print(f"Rendered {i+1}/{len(frames)} (Blender frame {f})")

# Encode with ffmpeg: 94 frames at 12 fps interpolated to 24 fps for 7.8 s duration
mp4_out = "/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/renders/S003_survol_aube.mp4"
cmd = [
    "ffmpeg", "-y",
    "-framerate", f"{len(frames)/7.8:.4f}",
    "-i", f"{out_dir}/frame_%04d.png",
    "-vf", "minterpolate=fps=24:mi_mode=mci:mc_mode=aobmc:vsbmc=1",
    "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
    mp4_out
]
print("Encoding video with ffmpeg...")
subprocess.run(cmd, check=True)
print("S003 complete:", mp4_out)
