import bpy
import math
import os
import subprocess

scene = bpy.context.scene
scene.render.resolution_x = 1920
scene.render.resolution_y = 1080
scene.render.resolution_percentage = 100

# Make wireframe camera orbiting bridge center
cam = bpy.data.objects.get("Cam_S016_Wireframe")
if not cam:
    cam_data = bpy.data.cameras.new("Cam_S016_Wireframe")
    cam = bpy.data.objects.new("Cam_S016_Wireframe", cam_data)
    bpy.context.collection.objects.link(cam)

cam.data.lens = 45.0
cam.data.clip_end = 25000.0
scene.camera = cam

# Set up wireframe material (neon cyan wireframe on dark technical blue)
mat_wire = bpy.data.materials.get("Mat_Wireframe_CAD")
if not mat_wire:
    mat_wire = bpy.data.materials.new("Mat_Wireframe_CAD")
    mat_wire.use_nodes = True

nodes = mat_wire.node_tree.nodes
links = mat_wire.node_tree.links
nodes.clear()

wire_node = nodes.new(type='ShaderNodeWireframe')
wire_node.inputs['Size'].default_value = 0.5

emit_node = nodes.new(type='ShaderNodeEmission')
emit_node.inputs['Color'].default_value = (0.0, 0.9, 1.0, 1.0) # Neon cyan CAD wire
emit_node.inputs['Strength'].default_value = 2.0

bg_node = nodes.new(type='ShaderNodeEmission')
bg_node.inputs['Color'].default_value = (0.01, 0.02, 0.05, 1.0) # Dark navy blueprint
bg_node.inputs['Strength'].default_value = 1.0

mix_node = nodes.new(type='ShaderNodeMixShader')
links.new(wire_node.outputs['Fac'], mix_node.inputs['Fac'])
links.new(bg_node.outputs['Emission'], mix_node.inputs[1])
links.new(emit_node.outputs['Emission'], mix_node.inputs[2])

out_node = nodes.new(type='ShaderNodeOutputMaterial')
links.new(mix_node.outputs['Shader'], out_node.inputs['Surface'])

# Apply to bridge components for S016
for name in ["Tower_2P_Kobe", "Tower_3P_Awaji", "Main_Cable_North", "Main_Cable_South", "Stiffening_Truss_Deck"]:
    ob = bpy.data.objects.get(name)
    if ob:
        ob.hide_render = False
        ob.hide_viewport = False
        if ob.data.materials:
            ob.data.materials[0] = mat_wire
        else:
            ob.data.materials.append(mat_wire)

# Hide terrain and sea for pure technical CAD wireframe
for name in ["Sea_Water", "Terrain_Kobe", "Terrain_Awaji"]:
    ob = bpy.data.objects.get(name)
    if ob:
        ob.hide_render = True

# Orbit camera around center (0, 0, 50) over 45 frames (step=2 for 3.7 s)
out_dir = "/tmp/s016_frames"
os.makedirs(out_dir, exist_ok=True)

# 89 frames total, step=2 -> 45 frames
frames = list(range(1, 90, 2))
r = 2400.0 # Distance
z = 500.0  # Height

print(f"Rendering S016 wireframe turntable ({len(frames)} frames)...")
for i, f in enumerate(frames):
    angle = math.radians(20 + (i / len(frames)) * 35) # 35 degree smooth rotation
    cam_x = r * math.cos(angle)
    cam_y = r * math.sin(angle)
    cam.location = (cam_x, cam_y, z)
    
    # Aim at center
    dx = -cam_x
    dy = -cam_y
    dz = -z
    rot_z = math.atan2(dy, dx) - math.pi/2
    dist_xy = math.sqrt(dx*dx + dy*dy)
    rot_x = math.atan2(dist_xy, -dz)
    cam.rotation_euler = (rot_x, 0.0, rot_z)
    
    scene.frame_set(f)
    frame_path = os.path.join(out_dir, f"frame_{i:04d}.png")
    scene.render.filepath = frame_path
    bpy.ops.render.render(write_still=True)

mp4_out = "/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/renders/S016_filaire_rotation.mp4"
cmd = [
    "ffmpeg", "-y",
    "-framerate", f"{len(frames)/3.7:.4f}",
    "-i", f"{out_dir}/frame_%04d.png",
    "-r", "24",
    "-c:v", "libx264", "-preset", "fast", "-crf", "18", "-pix_fmt", "yuv420p",
    mp4_out
]
subprocess.run(cmd, check=True)
print("S016 complete:", mp4_out)
