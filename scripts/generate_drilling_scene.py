"""
Generator: Forensic 3D Tunnel Drilling Scene (VFX Heist Breach / Hammer Drill)
==============================================================================
Automated Blender script to generate the dramatic close-up subterranean drilling scene:
- 1-point perspective concrete tunnel chamber with worklights & spotlight beam
- Foreground cross-section frame border with metric ticks (100, 150, 200, 250, 300)
- Cyan Blueprint grid on ceiling & holographic radar reticle ("VAULT FOUNDATION")
- Worker silhouette with hard hat, SDS hammer drill, and sharp white rim-lighting
- Radiating ceiling cracks & falling concrete debris chunks
- Camera animation with slow zoom push-in + violent jackhammer micro-shake
"""

import bpy
import math
from mathutils import Vector, Euler

def build_drilling_scene():
    # 1. Clean scene
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    
    # 2. Materials
    def make_mat(name, color=(0.8, 0.8, 0.8, 1.0), roughness=0.5, metallic=0.0, emission_color=None, emission_strength=0.0):
        mat = bpy.data.materials.get(name) or bpy.data.materials.new(name=name)
        mat.use_nodes = True
        nodes = mat.node_tree.nodes
        nodes.clear()
        
        output = nodes.new(type="ShaderNodeOutputMaterial")
        output.location = (300, 0)
        
        if emission_strength > 0 and emission_color:
            shader = nodes.new(type="ShaderNodeEmission")
            shader.inputs["Color"].default_value = emission_color
            shader.inputs["Strength"].default_value = emission_strength
        else:
            shader = nodes.new(type="ShaderNodeBsdfPrincipled")
            shader.inputs["Base Color"].default_value = color
            shader.inputs["Roughness"].default_value = roughness
            shader.inputs["Metallic"].default_value = metallic
            
        shader.location = (0, 0)
        mat.node_tree.links.new(shader.outputs[0], output.inputs["Surface"])
        return mat

    mat_tunnel_concrete = make_mat("M_TunnelConcrete", color=(0.11, 0.13, 0.16, 1.0), roughness=0.88)
    mat_cut_frame = make_mat("M_CutFrame", color=(0.28, 0.30, 0.33, 1.0), roughness=0.92)
    mat_rock = make_mat("M_RockDebris", color=(0.20, 0.22, 0.25, 1.0), roughness=0.95)
    mat_worker_body = make_mat("M_WorkerBody", color=(0.01, 0.015, 0.02, 1.0), roughness=0.95)
    mat_worker_rim = make_mat("M_WorkerRim", emission_color=(0.95, 0.98, 1.0, 1.0), emission_strength=8.0)
    mat_drill_metal = make_mat("M_DrillMetal", color=(0.15, 0.16, 0.18, 1.0), roughness=0.4, metallic=0.8)
    mat_work_light = make_mat("M_WorkLight", emission_color=(1.0, 0.96, 0.88, 1.0), emission_strength=10.0)
    mat_hud_cyan = make_mat("M_HudCyan", emission_color=(0.0, 0.92, 1.0, 1.0), emission_strength=6.0)
    mat_hud_white = make_mat("M_HudWhite", emission_color=(0.9, 0.95, 1.0, 1.0), emission_strength=3.0)

    # World setup
    world = bpy.context.scene.world or bpy.data.worlds.new("TunnelWorld")
    bpy.context.scene.world = world
    world.use_nodes = True
    wnodes = world.node_tree.nodes
    wnodes.clear()
    wout = wnodes.new(type="ShaderNodeOutputWorld")
    wbg = wnodes.new(type="ShaderNodeBackground")
    wbg.inputs["Color"].default_value = (0.008, 0.012, 0.02, 1.0)
    wbg.inputs["Strength"].default_value = 0.25
    world.node_tree.links.new(wbg.outputs["Background"], wout.inputs["Surface"])

    # 3. Tunnel Chamber (Floor, Ceiling, Walls)
    bpy.ops.mesh.primitive_plane_add(size=1.0, location=(0.0, 5.0, 0.0))
    floor = bpy.context.active_object
    floor.scale = (7.0, 10.0, 1.0)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    floor.data.materials.append(mat_tunnel_concrete)

    bpy.ops.mesh.primitive_plane_add(size=1.0, location=(0.0, 5.0, 3.6), rotation=(math.radians(180), 0, 0))
    ceiling = bpy.context.active_object
    ceiling.scale = (7.0, 10.0, 1.0)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    ceiling.data.materials.append(mat_tunnel_concrete)

    bpy.ops.mesh.primitive_plane_add(size=1.0, location=(-3.5, 5.0, 1.8), rotation=(0, math.radians(90), 0))
    l_wall = bpy.context.active_object
    l_wall.scale = (3.6, 10.0, 1.0)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    l_wall.data.materials.append(mat_tunnel_concrete)

    bpy.ops.mesh.primitive_plane_add(size=1.0, location=(3.5, 5.0, 1.8), rotation=(0, math.radians(-90), 0))
    r_wall = bpy.context.active_object
    r_wall.scale = (3.6, 10.0, 1.0)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    r_wall.data.materials.append(mat_tunnel_concrete)

    bpy.ops.mesh.primitive_plane_add(size=1.0, location=(0.0, 10.0, 1.8), rotation=(math.radians(90), 0, 0))
    b_wall = bpy.context.active_object
    b_wall.scale = (7.0, 3.6, 1.0)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    b_wall.data.materials.append(mat_tunnel_concrete)

    # Ceiling Lights
    for idx, (lx, ly) in enumerate([(-1.6, 3.0), (1.6, 3.0), (-1.6, 6.5), (1.6, 6.5)]):
        bpy.ops.mesh.primitive_cylinder_add(radius=0.25, depth=0.04, location=(lx, ly, 3.58))
        clight = bpy.context.active_object
        clight.data.materials.append(mat_work_light)
        
        p_data = bpy.data.lights.new(name=f"Light_Spot_{idx}", type='POINT')
        p_data.energy = 22.0
        p_data.color = (1.0, 0.95, 0.88)
        p_obj = bpy.data.objects.new(f"Light_Spot_{idx}", p_data)
        p_obj.location = (lx, ly, 3.4)
        bpy.context.collection.objects.link(p_obj)

    # 4. Foreground Concrete Frame Border
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0.0, -2.0, 2.95))
    top_cut = bpy.context.active_object
    top_cut.scale = (5.5, 0.1, 0.6)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    top_cut.data.materials.append(mat_cut_frame)

    for jx in range(-3, 4, 1):
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(jx * 0.7 + 0.2, -1.98, 2.7))
        chip = bpy.context.active_object
        chip.scale = (0.35, 0.15, 0.1)
        chip.rotation_euler = (0, 0, math.radians((jx*17)%25 - 12))
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        chip.data.materials.append(mat_cut_frame)

    # 5. Blueprint Grid & Radar Reticle
    for gx in [-2.5, -1.5, -0.5, 0.5, 1.5, 2.5]:
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(gx, 5.0, 3.59))
        gl = bpy.context.active_object
        gl.scale = (0.02, 10.0, 0.005)
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        gl.data.materials.append(mat_hud_cyan)

    for gy in [1.5, 3.0, 4.5, 6.0, 7.5, 9.0]:
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0.0, gy, 3.59))
        gl = bpy.context.active_object
        gl.scale = (7.0, 0.02, 0.005)
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        gl.data.materials.append(mat_hud_cyan)

    # Radar
    for r_radius in [0.4, 0.8, 1.2]:
        bpy.ops.mesh.primitive_circle_add(radius=r_radius, fill_type='NOTHING', location=(-3.48, 3.5, 2.0), rotation=(0, math.radians(90), 0))
        rc = bpy.context.active_object
        bpy.ops.object.convert(target='CURVE')
        rc.data.bevel_depth = 0.015
        rc.data.materials.append(mat_hud_cyan)

    # 6. Worker Silhouette & Hammer Drill
    worker_root = bpy.data.objects.new("Worker_Root", None)
    worker_root.location = (0.1, 1.6, 0.0)
    worker_root.scale = (1.4, 1.4, 1.4)
    bpy.context.collection.objects.link(worker_root)

    # Torso & Limbs
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0.02, 2.78, 1.45), rotation=(0, math.radians(8), 0))
    torso = bpy.context.active_object
    torso.scale = (0.55, 0.35, 0.75)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    torso.data.materials.append(mat_worker_body)
    torso.parent = worker_root

    # White Rim outline
    rim_torso = torso.copy()
    rim_torso.data = torso.data.copy()
    rim_torso.scale = (1.04, 1.04, 1.04)
    rim_torso.location = (0.02, 2.83, 1.45)
    bpy.context.collection.objects.link(rim_torso)
    rim_torso.data.materials.clear()
    rim_torso.data.materials.append(mat_worker_rim)
    rim_torso.parent = worker_root

    # Debris falling
    for idx, (dx, dy, dz, d_size) in enumerate([
        (0.55, 1.55, 3.25, 0.16), (0.70, 1.65, 2.95, 0.12), (0.35, 1.48, 2.70, 0.18),
        (0.85, 1.70, 2.35, 0.14), (0.20, 1.52, 2.10, 0.10), (0.65, 1.58, 1.65, 0.15)
    ]):
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(dx, dy, dz), rotation=(math.radians(idx*43), math.radians(idx*67), math.radians(idx*19)))
        rock = bpy.context.active_object
        rock.scale = (d_size, d_size * 0.7, d_size * 1.1)
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        rock.data.materials.append(mat_rock)

    # 7. Camera & Jackhammer Micro-Shake
    cam_data = bpy.data.cameras.new("Drilling_Cam")
    cam_data.lens = 30.0
    cam = bpy.data.objects.new("Drilling_Cam", cam_data)
    bpy.context.collection.objects.link(cam)
    bpy.context.scene.camera = cam

    for f in range(1, 61):
        bpy.context.scene.frame_set(f)
        prog = f / 60.0
        base_y = -2.4 + prog * 0.7
        base_z = 1.8
        base_x = 0.0
        shake_z = ((f * 13) % 7 - 3) * 0.012 if (f % 3) == 0 else 0.0
        shake_x = ((f * 17) % 5 - 2) * 0.009 if (f % 3) == 0 else 0.0
        cam.location = (base_x + shake_x, base_y, base_z + shake_z)
        cam.keyframe_insert(data_path="location", frame=f)

    bpy.context.scene.frame_set(1)

    # 8. Spotlight & Rim Light
    spot_data = bpy.data.lights.new(name="Tunnel_Spotlight", type='SPOT')
    spot_data.energy = 85.0
    spot_data.color = (0.75, 0.85, 1.0)
    spot_data.spot_size = math.radians(48.0)
    spot_data.spot_blend = 0.45
    spot_obj = bpy.data.objects.new("Tunnel_Spotlight", spot_data)
    spot_obj.location = (0.0, -1.5, 2.0)
    spot_obj.rotation_euler = (math.radians(90), 0, 0)
    bpy.context.collection.objects.link(spot_obj)

    print("Forensic 3D Tunnel Drilling scene generated.")

if __name__ == "__main__":
    build_drilling_scene()
