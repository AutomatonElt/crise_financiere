"""
Generator: Forensic 3D Cross-Section Schematic (Diorama / Heist Cutaway)
========================================================================
Automated Blender script to generate forensic 3D schematic cross-sections 
(e.g., bank heist tunnels, underground escape routes, crime scene diorama)
with cinematic dark clay lighting, neon cyan pathways, and forensic HUD annotations.
"""

import bpy
import math
from mathutils import Vector, Euler

def build_schematic_cross_section():
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

    mat_ground = make_mat("M_GroundCross", color=(0.06, 0.07, 0.09, 1.0), roughness=0.9)
    mat_road = make_mat("M_Road", color=(0.04, 0.045, 0.055, 1.0), roughness=0.65)
    mat_stripes = make_mat("M_Stripes", color=(0.85, 0.88, 0.90, 1.0), roughness=0.4)
    mat_sidewalk = make_mat("M_Sidewalk", color=(0.20, 0.22, 0.25, 1.0), roughness=0.8)
    mat_house_walls = make_mat("M_HouseWalls", color=(0.75, 0.78, 0.82, 1.0), roughness=0.7)
    mat_house_roof = make_mat("M_HouseRoof", color=(0.15, 0.18, 0.22, 1.0), roughness=0.8)
    mat_bank_facade = make_mat("M_BankFacade", color=(0.40, 0.44, 0.48, 1.0), roughness=0.7)
    mat_bank_trim = make_mat("M_BankTrim", color=(0.25, 0.28, 0.32, 1.0), roughness=0.5)
    mat_bank_glass = make_mat("M_BankGlass", color=(0.05, 0.08, 0.12, 1.0), roughness=0.15, metallic=0.7)
    mat_vault_steel = make_mat("M_VaultSteel", color=(0.5, 0.55, 0.6, 1.0), roughness=0.3, metallic=0.9)
    mat_pillar = make_mat("M_Pillar", color=(0.18, 0.20, 0.24, 1.0), roughness=0.85)
    mat_car_body = make_mat("M_CarBody", color=(0.8, 0.85, 0.9, 1.0), roughness=0.4, metallic=0.6)
    mat_car_dark = make_mat("M_CarDark", color=(0.02, 0.02, 0.03, 1.0), roughness=0.8)

    # Neon Cyan Accent
    mat_cyan_glow = make_mat("M_CyanGlow", emission_color=(0.0, 0.95, 1.0, 1.0), emission_strength=25.0)
    mat_cyan_soft = make_mat("M_CyanSoft", emission_color=(0.0, 0.8, 1.0, 1.0), emission_strength=4.0)
    mat_hud_text = make_mat("M_HudText", emission_color=(0.95, 0.98, 1.0, 1.0), emission_strength=2.5)
    mat_hud_lines = make_mat("M_HudLines", emission_color=(0.0, 0.85, 1.0, 1.0), emission_strength=5.0)

    # 3. World Setup
    world = bpy.context.scene.world or bpy.data.worlds.new("ForensicWorld")
    bpy.context.scene.world = world
    world.use_nodes = True
    wnodes = world.node_tree.nodes
    wnodes.clear()
    wout = wnodes.new(type="ShaderNodeOutputWorld")
    wbg = wnodes.new(type="ShaderNodeBackground")
    wbg.inputs["Color"].default_value = (0.012, 0.016, 0.024, 1.0)
    wbg.inputs["Strength"].default_value = 0.4
    world.node_tree.links.new(wbg.outputs["Background"], wout.inputs["Surface"])

    # 4. Underground Floor Slab & Back Wall (Cutaway Cavity)
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0.0, 1.0, -5.25))
    floor_slab = bpy.context.active_object
    floor_slab.scale = (42.0, 10.0, 0.5)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    floor_slab.data.materials.append(mat_ground)

    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0.0, 3.5, -2.5))
    back_wall = bpy.context.active_object
    back_wall.scale = (42.0, 0.8, 5.0)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    back_wall.data.materials.append(mat_ground)

    # Side block
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-18.5, 0.0, -2.5))
    side_soil = bpy.context.active_object
    side_soil.scale = (5.0, 6.0, 5.0)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    side_soil.data.materials.append(mat_ground)

    # Road slab & surface
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(1.0, 1.0, -0.3))
    road_slab = bpy.context.active_object
    road_slab.scale = (18.0, 10.0, 0.6)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    road_slab.data.materials.append(mat_sidewalk)

    bpy.ops.mesh.primitive_plane_add(size=1.0, location=(1.0, 1.0, 0.02))
    road = bpy.context.active_object
    road.scale = (17.6, 9.8, 1.0)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    road.data.materials.append(mat_road)

    for i in range(-3, 5):
        bpy.ops.mesh.primitive_plane_add(size=1.0, location=(1.0, i * 1.8, 0.03))
        stripe = bpy.context.active_object
        stripe.scale = (0.25, 0.9, 1.0)
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        stripe.data.materials.append(mat_stripes)

    for px in [-4.0, 2.0, 7.0]:
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(px, -1.0, -2.5))
        pillar = bpy.context.active_object
        pillar.scale = (1.2, 2.0, 4.0)
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        pillar.data.materials.append(mat_pillar)

    # 5. Residential House
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-14.0, 0.0, 1.6))
    house = bpy.context.active_object
    house.scale = (4.5, 4.0, 3.2)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    house.data.materials.append(mat_house_walls)

    mesh = bpy.data.meshes.new("GabledRoofMesh")
    verts = [(-2.4, -2.3, 0.0), (2.4, -2.3, 0.0), (2.4, 2.3, 0.0), (-2.4, 2.3, 0.0), (0.0, -2.3, 1.6), (0.0, 2.3, 1.6)]
    faces = [(0, 1, 4), (2, 3, 5), (1, 2, 5, 4), (3, 0, 4, 5), (0, 3, 2, 1)]
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    roof_obj = bpy.data.objects.new("House_Roof", mesh)
    roof_obj.location = (-14.0, 0.0, 3.2)
    bpy.context.collection.objects.link(roof_obj)
    roof_obj.data.materials.append(mat_house_roof)

    # 6. Central Bank & Vault
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(15.0, 1.0, 5.0))
    bank = bpy.context.active_object
    bank.scale = (6.5, 7.0, 10.0)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    bank.data.materials.append(mat_bank_facade)

    for col_x in [12.5, 13.5, 14.5, 15.5, 16.5, 17.5]:
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(col_x, -2.55, 5.0))
        pil = bpy.context.active_object
        pil.scale = (0.35, 0.25, 9.5)
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        pil.data.materials.append(mat_bank_trim)

    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(15.0, 0.0, -2.8))
    vault = bpy.context.active_object
    vault.scale = (6.0, 5.0, 4.0)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    vault.data.materials.append(mat_bank_trim)

    bpy.ops.mesh.primitive_cylinder_add(radius=1.2, depth=0.3, location=(11.95, 0.0, -3.2), rotation=(0, math.radians(90), 0))
    door = bpy.context.active_object
    door.data.materials.append(mat_vault_steel)

    # 7. Neon Heist Tunnel
    curve_data = bpy.data.curves.new('HeistTunnelCurve', type='CURVE')
    curve_data.dimensions = '3D'
    curve_data.bevel_depth = 0.16
    curve_data.bevel_resolution = 6
    polyline = curve_data.splines.new('BEZIER')
    tunnel_pts = [
        Vector((-14.0, -1.0, 0.2)),
        Vector((-14.0, -1.0, -2.0)),
        Vector((-13.5, -1.0, -3.8)),
        Vector((-11.0, -1.0, -4.0)),
        Vector((-2.0, -0.8, -4.0)),
        Vector((8.0, -0.6, -4.0)),
        Vector((11.5, -0.5, -4.0)),
        Vector((12.5, -0.2, -3.2)),
    ]
    polyline.bezier_points.add(len(tunnel_pts) - 1)
    for i, pt in enumerate(tunnel_pts):
        bp = polyline.bezier_points[i]
        bp.co = pt
        bp.handle_left_type = 'AUTO'
        bp.handle_right_type = 'AUTO'
    tunnel_obj = bpy.data.objects.new('Heist_Tunnel', curve_data)
    bpy.context.collection.objects.link(tunnel_obj)
    tunnel_obj.data.materials.append(mat_cyan_glow)

    # 8. Blueprint Grid & Annotations
    for gz in [-5.0, -4.0, -3.0, -2.0, -1.0, 0.0]:
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(1.0, -3.2, gz))
        hline = bpy.context.active_object
        hline.scale = (34.0, 0.01, 0.02)
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        hline.data.materials.append(mat_hud_lines)

    for gx in range(-14, 19, 4):
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(gx, -3.2, -2.75))
        vline = bpy.context.active_object
        vline.scale = (0.02, 0.01, 5.0)
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        vline.data.materials.append(mat_hud_lines)

    # 9. Camera & Lighting
    cam_data = bpy.data.cameras.new("Forensic_Cam")
    cam_data.lens = 45.0
    cam = bpy.data.objects.new("Forensic_Cam", cam_data)
    cam.location = (-0.5, -31.5, 14.8)
    cam.rotation_euler = (math.radians(65.0), 0.0, math.radians(1.5))
    bpy.context.collection.objects.link(cam)
    bpy.context.scene.camera = cam

    light_key_data = bpy.data.lights.new(name="Light_Key", type='SUN')
    light_key_data.energy = 3.5
    light_key_data.color = (0.92, 0.95, 1.0)
    light_key = bpy.data.objects.new("Light_Key", light_key_data)
    light_key.rotation_euler = (math.radians(52), math.radians(15), math.radians(-35))
    bpy.context.collection.objects.link(light_key)

    print("Forensic 3D Cross-Section build complete.")

if __name__ == "__main__":
    build_schematic_cross_section()
