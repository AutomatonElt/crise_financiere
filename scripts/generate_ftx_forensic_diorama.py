"""
Générateur Blender 3D : Coupe Médico-Légale (Forensic Cross-Section Diorama)
=============================================================================
Affaire FTX :
- Surface : Maquette sobre du siège de FTX à Nassau (Marina, crépuscule, logo cyan).
- Sous-sol : 
    1. Chambre forte blindée "CUSTOMER DEPOSITS" ($8.9B).
    2. Pipeline secret "BACKDOOR CODE: allow_negative_balance = True".
    3. Cuve clandestine "ALAMEDA RESEARCH".
- Animation : Siphonnage accéléré, vidage du coffre, apparition du trou de 8 milliards 
  et de l'unique Bitcoin restant ($20,000).
- Style : Dark Clay, Neon Cyan & Amber Glow, Blueprint HUD lines.
"""

import bpy
import math
import os
from mathutils import Vector, Euler

def build_forensic_diorama():
    print(">>> Initialisation de la coupe médico-légale 3D FTX / Alameda...")
    
    # 1. Nettoyage de la scène
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    
    scene = bpy.context.scene
    scene.render.engine = 'BLENDER_EEVEE'
    scene.render.resolution_x = 1920
    scene.render.resolution_y = 1080
    scene.render.fps = 24
    scene.frame_start = 1
    scene.frame_end = 150
    
    # 2. Matériaux Forensic Clay & Neon
    def make_mat(name, color=(0.8, 0.8, 0.8, 1.0), roughness=0.7, metallic=0.0, 
                 emission_color=None, emission_strength=0.0, transmission=0.0):
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
            if transmission > 0:
                if "Transmission Weight" in shader.inputs:
                    shader.inputs["Transmission Weight"].default_value = transmission
                elif "Transmission" in shader.inputs:
                    shader.inputs["Transmission"].default_value = transmission
                shader.inputs["IOR"].default_value = 1.45
                
        shader.location = (0, 0)
        mat.node_tree.links.new(shader.outputs[0], output.inputs["Surface"])
        return mat

    mat_soil = make_mat("M_SoilCross", color=(0.05, 0.06, 0.08, 1.0), roughness=0.9)
    mat_dock = make_mat("M_DockConcrete", color=(0.20, 0.22, 0.25, 1.0), roughness=0.8)
    mat_building = make_mat("M_BuildingClay", color=(0.70, 0.73, 0.76, 1.0), roughness=0.6)
    mat_building_dark = make_mat("M_BuildingDark", color=(0.12, 0.14, 0.17, 1.0), roughness=0.5)
    mat_glass = make_mat("M_BuildingGlass", color=(0.04, 0.08, 0.12, 1.0), roughness=0.1, metallic=0.8, transmission=0.6)
    mat_water = make_mat("M_MarinaWater", color=(0.015, 0.035, 0.05, 1.0), roughness=0.05, transmission=0.8)
    mat_steel = make_mat("M_VaultSteel", color=(0.45, 0.48, 0.52, 1.0), roughness=0.35, metallic=0.9)
    mat_gold_crypto = make_mat("M_GoldCrypto", emission_color=(1.0, 0.78, 0.15, 1.0), emission_strength=8.0)
    mat_cyan_glow = make_mat("M_CyanGlow", emission_color=(0.0, 0.95, 1.0, 1.0), emission_strength=22.0)
    mat_hud_lines = make_mat("M_HudLines", emission_color=(0.0, 0.85, 1.0, 1.0), emission_strength=4.0)
    mat_red_alert = make_mat("M_RedAlert", emission_color=(1.0, 0.08, 0.12, 1.0), emission_strength=25.0)

    # 3. Éclairage World & Studio
    world = scene.world or bpy.data.worlds.new("ForensicWorld")
    scene.world = world
    world.use_nodes = True
    wnodes = world.node_tree.nodes
    wnodes.clear()
    wout = wnodes.new(type="ShaderNodeOutputWorld")
    wbg = wnodes.new(type="ShaderNodeBackground")
    wbg.inputs["Color"].default_value = (0.012, 0.015, 0.025, 1.0)
    wbg.inputs["Strength"].default_value = 0.45
    world.node_tree.links.new(wbg.outputs["Background"], wout.inputs["Surface"])

    # Key light douce
    bpy.ops.object.light_add(type='SUN', location=(25, -35, 22))
    sun = bpy.context.active_object
    sun.data.energy = 3.2
    sun.data.color = (0.95, 0.96, 1.0)
    sun.rotation_euler = (math.radians(52), math.radians(12), math.radians(-30))

    # Rim light bleutée
    bpy.ops.object.light_add(type='SUN', location=(-25, 35, 18))
    rim = bpy.context.active_object
    rim.data.energy = 1.6
    rim.data.color = (0.15, 0.65, 1.0)
    rim.rotation_euler = (math.radians(120), math.radians(-8), math.radians(150))

    # 4. Sol & Coupe Souterraine (Diorama Block)
    # Bloc de roche tranché en façade avant (Y = -2.0)
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0.0, 3.0, -3.5))
    diorama_soil = bpy.context.active_object
    diorama_soil.name = "Diorama_Soil_Block"
    diorama_soil.scale = (44.0, 10.0, 7.0)
    bpy.ops.object.transform_apply(scale=True)
    diorama_soil.data.materials.append(mat_soil)

    # Marina & Quai en surface (Z = 0)
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0.0, -3.5, -0.2))
    dock = bpy.context.active_object
    dock.name = "Surface_Dock"
    dock.scale = (44.0, 3.0, 0.4)
    bpy.ops.object.transform_apply(scale=True)
    dock.data.materials.append(mat_dock)

    bpy.ops.mesh.primitive_plane_add(size=1.0, location=(0.0, -12.0, -0.3))
    water = bpy.context.active_object
    water.name = "Surface_Water"
    water.scale = (60.0, 14.0, 1.0)
    bpy.ops.object.transform_apply(scale=True)
    water.data.materials.append(mat_water)

    # 5. Surface : Maquette sobre du Siège FTX (Nassau)
    # Bâtiment principal (X: -16 à 0, Z: 0 à 8)
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-8.0, 1.5, 4.2))
    b_ftx = bpy.context.active_object
    b_ftx.name = "Building_FTX_Clay"
    b_ftx.scale = (18.0, 6.5, 8.4)
    bpy.ops.object.transform_apply(scale=True)
    b_ftx.data.materials.append(mat_building)

    # Baies vitrées en façade
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-8.0, -1.8, 4.2))
    b_glass = bpy.context.active_object
    b_glass.name = "Building_FTX_Glass"
    b_glass.scale = (17.2, 0.2, 7.6)
    bpy.ops.object.transform_apply(scale=True)
    b_glass.data.materials.append(mat_glass)

    # Corniche & Toiture
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-8.0, 1.5, 8.6))
    roof = bpy.context.active_object
    roof.name = "Building_FTX_Roof"
    roof.scale = (18.6, 7.0, 0.5)
    bpy.ops.object.transform_apply(scale=True)
    roof.data.materials.append(mat_building_dark)

    # Enseigne FTX Cyan néon en haut
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-12.0, -1.95, 7.6))
    sign = bpy.context.active_object
    sign.name = "FTX_Cyan_Sign"
    sign.scale = (3.6, 0.15, 1.0)
    bpy.ops.object.transform_apply(scale=True)
    sign.data.materials.append(mat_cyan_glow)

    # Bâtiment voisin secondaire à droite (pour équilibrer le diorama)
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(11.0, 2.5, 3.2))
    b_sec = bpy.context.active_object
    b_sec.name = "Building_Secondary"
    b_sec.scale = (14.0, 6.0, 6.4)
    bpy.ops.object.transform_apply(scale=True)
    b_sec.data.materials.append(mat_building_dark)

    # 6. SOUS-SOL ÉCORCHÉ : Chambre Forte des Dépôts Clients (Gauche)
    # Cavité creusée
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-9.0, -1.0, -4.2))
    vault_room = bpy.context.active_object
    vault_room.name = "Vault_Room_Walls"
    vault_room.scale = (13.0, 3.2, 4.4)
    bpy.ops.object.transform_apply(scale=True)
    vault_room.data.materials.append(mat_dock)

    # Porte blindée circulaire
    bpy.ops.mesh.primitive_cylinder_add(radius=1.4, depth=0.4, location=(-2.8, -1.0, -4.2), rotation=(0, math.radians(90), 0))
    door = bpy.context.active_object
    door.name = "Vault_Heavy_Door"
    door.data.materials.append(mat_steel)

    # Volant de verrouillage
    bpy.ops.mesh.primitive_torus_add(major_radius=0.5, minor_radius=0.08, location=(-2.55, -1.0, -4.2), rotation=(0, math.radians(90), 0))
    wheel = bpy.context.active_object
    wheel.name = "Vault_Wheel"
    wheel.data.materials.append(mat_cyan_glow)

    # Volume des Dépôts Clients (Réserves en or / crypto liquides)
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-10.0, -1.0, -5.2))
    crypto_reserves = bpy.context.active_object
    crypto_reserves.name = "Customer_Reserves_Volume"
    crypto_reserves.scale = (10.0, 2.8, 2.0)
    bpy.ops.object.transform_apply(scale=True)
    crypto_reserves.data.materials.append(mat_gold_crypto)

    # Pièce Bitcoin unique restante au sol ($20,000)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.35, depth=0.1, location=(-10.0, -1.0, -6.1), rotation=(math.radians(90), 0, 0))
    btc_coin = bpy.context.active_object
    btc_coin.name = "Remaining_1_Bitcoin"
    btc_coin.data.materials.append(mat_gold_crypto)

    # 7. LE TUYAU SECRET : THE BACKDOOR PIPELINE (Centre)
    # Conduit reliant le coffre client à la cuve d'Alameda
    curve_data = bpy.data.curves.new('BackdoorPipelineCurve', type='CURVE')
    curve_data.dimensions = '3D'
    curve_data.bevel_depth = 0.28
    curve_data.bevel_resolution = 8
    poly = curve_data.splines.new('BEZIER')
    pipe_pts = [
        Vector((-3.2, -1.0, -4.5)), # Sortie du coffre client
        Vector((0.0, -1.0, -4.5)),  # Traversée centrale
        Vector((3.5, -1.0, -4.8)),  # Descente vers Alameda
        Vector((7.0, -1.0, -4.8))   # Entrée cuve Alameda
    ]
    poly.bezier_points.add(len(pipe_pts) - 1)
    for i, pt in enumerate(pipe_pts):
        bp = poly.bezier_points[i]
        bp.co = pt
        bp.handle_left_type = 'AUTO'
        bp.handle_right_type = 'AUTO'
    pipe_obj = bpy.data.objects.new('Backdoor_Pipe', curve_data)
    bpy.context.collection.objects.link(pipe_obj)
    pipe_obj.data.materials.append(mat_cyan_glow)

    # 8. CUVE ALAMEDA RESEARCH (Droite)
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(10.0, -1.0, -5.0))
    alameda_tank = bpy.context.active_object
    alameda_tank.name = "Alameda_Research_Tank"
    alameda_tank.scale = (8.0, 3.2, 3.2)
    bpy.ops.object.transform_apply(scale=True)
    alameda_tank.data.materials.append(mat_building_dark)

    # 9. LIGNES DE COTES & BLUEPRINT HUD GRID
    # Grille fine de repères sur la tranche
    for gz in [-6.0, -5.0, -4.0, -3.0, -2.0, -1.0]:
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0.0, -2.01, gz))
        hline = bpy.context.active_object
        hline.scale = (42.0, 0.01, 0.015)
        bpy.ops.object.transform_apply(scale=True)
        hline.data.materials.append(mat_hud_lines)

    for gx in range(-18, 20, 4):
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(gx, -2.01, -3.5))
        vline = bpy.context.active_object
        vline.scale = (0.015, 0.01, 6.8)
        bpy.ops.object.transform_apply(scale=True)
        vline.data.materials.append(mat_hud_lines)

    # Panneau d'alerte rouge holographique (Apparaît quand le coffre est vide)
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-10.0, -2.05, -3.2))
    alert_box = bpy.context.active_object
    alert_box.name = "HUD_Alert_Deficit_8B"
    alert_box.scale = (7.5, 0.02, 1.8)
    bpy.ops.object.transform_apply(scale=True)
    alert_box.data.materials.append(mat_red_alert)

    # 10. ANIMATION CHRONOMÉTRÉE : LE SIPHONNAGE DU BACKDOOR (150 Frames)
    # Frame 1 - 35 : Réserves intactes ($8.9B)
    # Frame 36 - 85 : Le backdoor aspire tout, le niveau d'or s'effondre jusqu'à 0
    # Frame 86 - 150 : Coffre vide, alerte rouge clignotante, 1 BTC restant
    
    print(">>> Configuration des keyframes d'animation du siphonnage...")
    
    # Animation du volume d'or des clients
    crypto_reserves.location = (0, 0, 0)
    crypto_reserves.scale = (1.0, 1.0, 1.0)
    
    for f in [1, 35]:
        crypto_reserves.scale = (1.0, 1.0, 1.0)
        crypto_reserves.location = (0, 0, 0)
        crypto_reserves.keyframe_insert(data_path="scale", frame=f)
        crypto_reserves.keyframe_insert(data_path="location", frame=f)
        
        # Alerte masquée (sous le sol / échelle zéro)
        alert_box.scale = (0.001, 0.001, 0.001)
        alert_box.keyframe_insert(data_path="scale", frame=f)

    # À frame 85 : Coffre entièrement vidé
    crypto_reserves.scale = (1.0, 1.0, 0.01) # Aplatissement total
    crypto_reserves.location = (0, 0, -0.98) # Plaqué au sol
    crypto_reserves.keyframe_insert(data_path="scale", frame=85)
    crypto_reserves.keyframe_insert(data_path="location", frame=85)

    # À frame 86 : Déclenchement de l'alerte rouge DEFICIT -$8,000,000,000
    alert_box.scale = (1.0, 1.0, 1.0)
    alert_box.keyframe_insert(data_path="scale", frame=86)
    
    # Clignotement de l'alerte rouge
    for f_pulse in [95, 110, 125, 140]:
        alert_box.scale = (1.08, 1.0, 1.08)
        alert_box.keyframe_insert(data_path="scale", frame=f_pulse)
        alert_box.scale = (1.0, 1.0, 1.0)
        alert_box.keyframe_insert(data_path="scale", frame=f_pulse + 7)

    # 11. CAMÉRA FORENSIC & CHORÉGRAPHIE
    cam_data = bpy.data.cameras.new("Cam_Forensic_Diorama")
    cam_data.lens = 42.0
    cam = bpy.data.objects.new("Cam_Forensic_Diorama", cam_data)
    bpy.context.collection.objects.link(cam)
    scene.camera = cam

    # Frame 1 : Vue plongeante 3/4 montrant FTX en haut et le coffre plein en bas
    cam.location = (-6.0, -26.0, 6.5)
    cam.rotation_euler = (math.radians(72.0), 0.0, math.radians(-3.0))
    cam.keyframe_insert(data_path="location", frame=1)
    cam.keyframe_insert(data_path="rotation_euler", frame=1)

    # Frame 60 : Travelling serré sur le tuyau de siphonnage
    cam.location = (0.0, -18.0, 1.5)
    cam.rotation_euler = (math.radians(78.0), 0.0, math.radians(0.0))
    cam.keyframe_insert(data_path="location", frame=60)
    cam.keyframe_insert(data_path="rotation_euler", frame=60)

    # Frame 120 - 150 : Recul majestueux (Dolly-out) révélant l'ensemble de la coupe avec l'alerte -$8B
    cam.location = (0.0, -32.0, 8.5)
    cam.rotation_euler = (math.radians(68.0), 0.0, math.radians(0.0))
    cam.keyframe_insert(data_path="location", frame=130)
    cam.keyframe_insert(data_path="rotation_euler", frame=130)

    print(">>> Modélisation de la coupe médico-légale terminée avec succès !")
    return scene

def save_and_render_diorama(blend_path, renders_dir):
    os.makedirs(renders_dir, exist_ok=True)
    os.makedirs(os.path.dirname(blend_path), exist_ok=True)
    
    bpy.ops.wm.save_as_mainfile(filepath=blend_path)
    print(f">>> Projet Blender sauvegardé : {blend_path}")
    
    scene = bpy.context.scene
    
    keyframes = [
        (25, "DIORAMA_01_coffre_plein.png", "Étape 1: Façade FTX et coffre plein $8.9B"),
        (65, "DIORAMA_02_backdoor_siphonnage.png", "Étape 2: Siphonnage en direct via le backdoor"),
        (115, "DIORAMA_03_coffre_vide_trou_8B.png", "Étape 3: Coffre vide, 1 Bitcoin et alerte rouge -$8B")
    ]
    
    for frame_num, filename, desc in keyframes:
        scene.frame_set(frame_num)
        target = os.path.join(renders_dir, filename)
        scene.render.filepath = target
        print(f">>> Rendu de la frame {frame_num} ({desc})...")
        bpy.ops.render.render(write_still=True)
        print(f">>> Frame {frame_num} rendue.")

if __name__ == "__main__":
    blend_path = "/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/episodes/02-ftx/assets/blender/ftx_forensic_diorama.blend"
    renders_dir = "/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/episodes/02-ftx/assets/blender/renders_diorama"
    build_forensic_diorama()
    save_and_render_diorama(blend_path, renders_dir)
    print(">>> COUPE FORENSIC TERMINÉE AVEC SUCCÈS !")
