import bpy
import math
import os
import subprocess

scene = bpy.context.scene
scene.eevee.taa_render_samples = 4
scene.render.resolution_x = 1920
scene.render.resolution_y = 1080
scene.render.resolution_percentage = 100

# ==============================================================================
# --- 1. S016: Technical Cyan Wireframe CAD Turntable (3.7 s, 45 frames) ---
# ==============================================================================
print("\n>>> STARTING S016 WIREFRAME...")
cam_s016 = bpy.data.objects.get("Cam_S016_Wireframe")
if not cam_s016:
    cam_data = bpy.data.cameras.new("Cam_S016_Wireframe")
    cam_s016 = bpy.data.objects.new("Cam_S016_Wireframe", cam_data)
    bpy.context.collection.objects.link(cam_s016)

cam_s016.data.lens = 45.0
cam_s016.data.clip_end = 25000.0
scene.camera = cam_s016

# Wireframe CAD material
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

# Apply to bridge components
orig_materials = {}
for name in ["Tower_2P_Kobe", "Tower_3P_Awaji", "Main_Cable_North", "Main_Cable_South", "Stiffening_Truss_Deck"]:
    ob = bpy.data.objects.get(name)
    if ob:
        ob.hide_render = False
        ob.hide_viewport = False
        if ob.data.materials:
            orig_materials[name] = ob.data.materials[0]
            ob.data.materials[0] = mat_wire
        else:
            orig_materials[name] = None
            ob.data.materials.append(mat_wire)

# Hide terrain and sea for pure CAD wireframe
for name in ["Sea_Water", "Terrain_Kobe", "Terrain_Awaji"]:
    ob = bpy.data.objects.get(name)
    if ob:
        ob.hide_render = True

out_dir_s016 = "/tmp/s016_frames"
os.makedirs(out_dir_s016, exist_ok=True)
frames_s016 = list(range(1, 90, 2))
r = 2400.0
z = 500.0

for i, f in enumerate(frames_s016):
    angle = math.radians(20 + (i / len(frames_s016)) * 35)
    cam_x = r * math.cos(angle)
    cam_y = r * math.sin(angle)
    cam_s016.location = (cam_x, cam_y, z)
    dx = -cam_x
    dy = -cam_y
    dz = -z
    rot_z = math.atan2(dy, dx) - math.pi/2
    dist_xy = math.sqrt(dx*dx + dy*dy)
    rot_x = math.atan2(dist_xy, -dz)
    cam_s016.rotation_euler = (rot_x, 0.0, rot_z)
    
    scene.frame_set(f)
    frame_path = os.path.join(out_dir_s016, f"frame_{i:04d}.png")
    scene.render.filepath = frame_path
    bpy.ops.render.render(write_still=True)

mp4_s016 = "/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/Docs_science/Akashi/renders/S016_filaire_rotation.mp4"
cmd_s016 = [
    "ffmpeg", "-y",
    "-framerate", f"{len(frames_s016)/3.7:.4f}",
    "-i", f"{out_dir_s016}/frame_%04d.png",
    "-r", "24",
    "-c:v", "libx264", "-preset", "fast", "-crf", "18", "-pix_fmt", "yuv420p",
    mp4_s016
]
subprocess.run(cmd_s016, check=True)
print("S016 complete:", mp4_s016)

# Restore original materials
for name, mat in orig_materials.items():
    ob = bpy.data.objects.get(name)
    if ob and mat:
        ob.data.materials[0] = mat

# ==============================================================================
# --- 2. S018: Completed Bridge Daylight Flyover (3.6 s, 43 frames) ---
# ==============================================================================
print("\n>>> STARTING S018 COMPLETED BRIDGE FLYOVER...")
for name in ["Stiffening_Truss_Deck", "Vertical_Hangers", "Deck_Road_Details", "Tower_2P_Kobe", "Tower_3P_Awaji", "Main_Cable_North", "Main_Cable_South", "Sea_Water", "Terrain_Kobe", "Terrain_Awaji"]:
    ob = bpy.data.objects.get(name)
    if ob:
        ob.hide_render = False
        ob.hide_viewport = False

cam_s018 = bpy.data.objects.get("Cam_S018_FastFlyover")
if not cam_s018:
    cam_data = bpy.data.cameras.new("Cam_S018_FastFlyover")
    cam_s018 = bpy.data.objects.new("Cam_S018_FastFlyover", cam_data)
    bpy.context.collection.objects.link(cam_s018)

cam_s018.data.lens = 28.0
cam_s018.data.clip_end = 25000.0
scene.camera = cam_s018

sun = bpy.data.objects.get("Sun_Dawn")
if sun:
    sun.data.color = (1.0, 0.96, 0.88)
    sun.data.energy = 3.5

world = bpy.context.scene.world
if world and world.node_tree:
    bg = world.node_tree.nodes.get("Background")
    if bg:
        bg.inputs['Color'].default_value = (0.2, 0.35, 0.55, 1.0) # Bright daytime sky
        bg.inputs['Strength'].default_value = 1.0

out_dir_s018 = "/tmp/s018_frames"
os.makedirs(out_dir_s018, exist_ok=True)
frames_s018 = list(range(1, 87, 2))

for i, f in enumerate(frames_s018):
    t = i / (len(frames_s018) - 1)
    x = -900.0 + t * 800.0
    y = 5.0
    z = 70.0
    cam_s018.location = (x, y, z)
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

# ==============================================================================
# --- 3. S019: Completed Bridge Dusk Finale (10.5 s, 121 frames) ---
# ==============================================================================
print("\n>>> STARTING S019 DUSK FINALE...")
out_dir_s019 = "/tmp/s019_frames"
os.makedirs(out_dir_s019, exist_ok=True)

cam_s019 = bpy.data.objects.get("Cam_S083_Finale")
scene.camera = cam_s019

if world and world.node_tree:
    bg = world.node_tree.nodes.get("Background")
    if bg:
        bg.inputs['Color'].default_value = (0.55, 0.22, 0.35, 1.0) # Dusk magenta-orange
        bg.inputs['Strength'].default_value = 1.0

if sun:
    sun.data.color = (1.0, 0.45, 0.2)
    sun.data.energy = 4.0

frames_s019 = list(range(700, 941, 2))
if 940 not in frames_s019:
    frames_s019.append(940)

for i, f in enumerate(frames_s019):
    scene.frame_set(f)
    frame_path = os.path.join(out_dir_s019, f"frame_{i:04d}.png")
    scene.render.filepath = frame_path
    bpy.ops.render.render(write_still=True)
    if i % 25 == 0:
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
print("\n>>> ALL CLIPS (S016, S018, S019) COMPLETED SUCCESSFULLY!")
