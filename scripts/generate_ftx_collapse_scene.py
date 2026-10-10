"""
Modélisation 3D et Animation : Effondrement et Reconstruction du Siège FTX
==========================================================================
Scène inspirée de REAL-02_siege_ftx_nassau_crepuscule.jpg :
1. Sous-sol sombre avec éclairage unique zénithal, caméra en contre-plongée vers le plafond.
2. Effondrement structural de l'édifice au crépuscule sur la marina de Nassau.
3. Reconstruction inversée (reverse motion) avec travelling arrière (pull-back dolly-out).

Moteur : Blender 5.2 (EEVEE / Workbench / Cycles)
"""

import bpy
import math
import os
import sys

def build_scene():
    print(">>> Initialisation de la scène Blender...")
    
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
    
    # 2. Shaders & Matériaux
    def make_material(name, color=(0.8, 0.8, 0.8, 1.0), roughness=0.5, metallic=0.0, 
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

    mat_concrete = make_material("M_Concrete", color=(0.22, 0.23, 0.25, 1.0), roughness=0.85)
    mat_basement_floor = make_material("M_BasementFloor", color=(0.12, 0.13, 0.14, 1.0), roughness=0.9)
    mat_pillar = make_material("M_Pillar", color=(0.28, 0.29, 0.31, 1.0), roughness=0.8)
    mat_facade = make_material("M_Facade", color=(0.78, 0.80, 0.82, 1.0), roughness=0.5)
    mat_glass = make_material("M_Glass", color=(0.04, 0.08, 0.12, 1.0), roughness=0.08, metallic=0.85, transmission=0.7)
    mat_water = make_material("M_Water", color=(0.015, 0.035, 0.055, 1.0), roughness=0.04, metallic=0.1, transmission=0.8)
    mat_wood = make_material("M_Wood", color=(0.15, 0.11, 0.08, 1.0), roughness=0.75)
    mat_cyan_logo = make_material("M_FTX_Cyan", emission_color=(0.0, 0.92, 1.0, 1.0), emission_strength=18.0)
    mat_light_bulb = make_material("M_BasementBulb", emission_color=(1.0, 0.92, 0.75, 1.0), emission_strength=30.0)

    # 3. Environnement / Ciel Crépuscule
    world = scene.world or bpy.data.worlds.new("TwilightWorld")
    scene.world = world
    world.use_nodes = True
    wnodes = world.node_tree.nodes
    wnodes.clear()
    wout = wnodes.new(type="ShaderNodeOutputWorld")
    wbg = wnodes.new(type="ShaderNodeBackground")
    wbg.inputs["Color"].default_value = (0.015, 0.018, 0.035, 1.0) # Nuit bleutée / crépuscule sombre
    wbg.inputs["Strength"].default_value = 0.5
    world.node_tree.links.new(wbg.outputs["Background"], wout.inputs["Surface"])

    # Soleil couchant doux
    bpy.ops.object.light_add(type='SUN', location=(30, -40, 25))
    sun = bpy.context.active_object
    sun.name = "Sun_Dusk"
    sun.data.energy = 2.5
    sun.data.color = (1.0, 0.65, 0.45) # Teinte orange crépusculaire
    sun.rotation_euler = (math.radians(65), math.radians(15), math.radians(-35))

    # Rim light bleutée opposée
    bpy.ops.object.light_add(type='SUN', location=(-30, 40, 20))
    rim = bpy.context.active_object
    rim.name = "Sun_Rim"
    rim.data.energy = 1.2
    rim.data.color = (0.3, 0.6, 1.0)
    rim.rotation_euler = (math.radians(120), math.radians(-10), math.radians(145))

    # 4. Géométrie : SOUS-SOL (Z < 0)
    # Sol du sous-sol
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, -6.2))
    b_floor = bpy.context.active_object
    b_floor.name = "Basement_Floor"
    b_floor.scale = (38.0, 22.0, 0.4)
    bpy.ops.object.transform_apply(scale=True)
    b_floor.data.materials.append(mat_basement_floor)

    # Murs périphériques du sous-sol
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 10.5, -3.2))
    b_wall_back = bpy.context.active_object
    b_wall_back.name = "Basement_Wall_Back"
    b_wall_back.scale = (38.0, 1.0, 5.6)
    bpy.ops.object.transform_apply(scale=True)
    b_wall_back.data.materials.append(mat_concrete)

    # Piliers massifs en béton du sous-sol
    pillar_locs = [
        (-12, -4, -3.2), (-4, -4, -3.2), (4, -4, -3.2), (12, -4, -3.2),
        (-12, 4, -3.2), (-4, 4, -3.2), (4, 4, -3.2), (12, 4, -3.2)
    ]
    for i, loc in enumerate(pillar_locs):
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=loc)
        pil = bpy.context.active_object
        pil.name = f"Basement_Pillar_{i+1}"
        pil.scale = (1.4, 1.4, 5.6)
        bpy.ops.object.transform_apply(scale=True)
        pil.data.materials.append(mat_pillar)

    # Dalle de plafond du sous-sol (dalle de transfert à Z = -0.3)
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, -0.3))
    b_ceiling = bpy.context.active_object
    b_ceiling.name = "Basement_Ceiling_Slab"
    b_ceiling.scale = (38.0, 22.0, 0.6)
    bpy.ops.object.transform_apply(scale=True)
    b_ceiling.data.materials.append(mat_concrete)

    # LA LUMIÈRE UNIQUE DU SOUS-SOL (Spotlight / Industrial Bulb)
    # Suspension / Cloche industrielle
    bpy.ops.mesh.primitive_cylinder_add(radius=0.4, depth=0.3, location=(0, 0, -0.9))
    fixture = bpy.context.active_object
    fixture.name = "Basement_LightFixture"
    fixture.data.materials.append(mat_pillar)

    # Ampoule incandescente
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.18, location=(0, 0, -1.1))
    bulb = bpy.context.active_object
    bulb.name = "Basement_LightBulb"
    bulb.data.materials.append(mat_light_bulb)

    # Source lumineuse ponctuelle puissante
    bpy.ops.object.light_add(type='POINT', location=(0, 0, -1.3))
    b_light = bpy.context.active_object
    b_light.name = "Basement_PointLight"
    b_light.data.energy = 450.0 # Watts
    b_light.data.color = (1.0, 0.94, 0.82)
    b_light.data.shadow_soft_size = 0.25

    # 5. EXTERIEUR : Marina, Quais et Eau (Z = 0)
    # Plan d'eau
    bpy.ops.mesh.primitive_plane_add(size=1.0, location=(0, -22, -0.2))
    water = bpy.context.active_object
    water.name = "Marina_Water"
    water.scale = (80.0, 30.0, 1.0)
    bpy.ops.object.transform_apply(scale=True)
    water.data.materials.append(mat_water)

    # Quai / Ponton en béton devant le bâtiment
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, -6.5, -0.1))
    dock = bpy.context.active_object
    dock.name = "Marina_Dock"
    dock.scale = (40.0, 3.0, 0.4)
    bpy.ops.object.transform_apply(scale=True)
    dock.data.materials.append(mat_concrete)

    # Piliers en bois du ponton émergeant de l'eau
    for x_p in range(-18, 20, 4):
        bpy.ops.mesh.primitive_cylinder_add(radius=0.22, depth=2.5, location=(x_p, -9.0, 0.2))
        post = bpy.context.active_object
        post.name = f"Dock_Post_{x_p}"
        post.data.materials.append(mat_wood)

    # 6. BÂTIMENT FTX (Siège de Nassau, Z >= 0)
    # 4 Niveaux : RDC + R+1 + R+2 + R+3 (Toit)
    floor_height = 3.6
    building_width = 32.0
    building_depth = 12.0
    
    # Structure statique : Ailes latérales Gauche et Droite
    # Aile Gauche
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-10.5, 0, 7.2))
    wing_left = bpy.context.active_object
    wing_left.name = "Building_Wing_Left"
    wing_left.scale = (11.0, building_depth, 14.4)
    bpy.ops.object.transform_apply(scale=True)
    wing_left.data.materials.append(mat_facade)

    # Baies vitrées Aile Gauche
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-10.5, -5.9, 7.2))
    glass_left = bpy.context.active_object
    glass_left.name = "Building_Glass_Left"
    glass_left.scale = (10.0, 0.2, 13.0)
    bpy.ops.object.transform_apply(scale=True)
    glass_left.data.materials.append(mat_glass)

    # Aile Droite
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(10.5, 0, 7.2))
    wing_right = bpy.context.active_object
    wing_right.name = "Building_Wing_Right"
    wing_right.scale = (11.0, building_depth, 14.4)
    bpy.ops.object.transform_apply(scale=True)
    wing_right.data.materials.append(mat_facade)

    # Baies vitrées Aile Droite
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(10.5, -5.9, 7.2))
    glass_right = bpy.context.active_object
    glass_right.name = "Building_Glass_Right"
    glass_right.scale = (10.0, 0.2, 13.0)
    bpy.ops.object.transform_apply(scale=True)
    glass_right.data.materials.append(mat_glass)

    # Enseigne FTX Cyan lumineuse sur le toit gauche
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-11.0, -6.1, 14.8))
    logo_backing = bpy.context.active_object
    logo_backing.name = "FTX_Logo_Sign"
    logo_backing.scale = (4.8, 0.3, 1.2)
    bpy.ops.object.transform_apply(scale=True)
    logo_backing.data.materials.append(mat_cyan_logo)

    # 7. SECTION CENTRALE DYNAMIQUE (Zone d'effondrement & reconstruction)
    # Découpage en blocs de dalles et de façades qui vont chuter puis remonter
    collapse_blocks = []
    
    # 4 dalles d'étages au centre
    for level in range(4):
        z_pos = 0.5 + level * floor_height
        
        # Dalle centrale divisée en 2 demi-dalles pour une rupture en biseau
        for part in [-1, 1]:
            x_pos = part * 2.5
            bpy.ops.mesh.primitive_cube_add(size=1.0, location=(x_pos, 0, z_pos))
            slab = bpy.context.active_object
            slab.name = f"Collapse_Slab_L{level}_P{part}"
            slab.scale = (4.8, building_depth - 0.5, 0.45)
            bpy.ops.object.transform_apply(scale=True)
            slab.data.materials.append(mat_concrete)
            
            # Vitrage associé
            bpy.ops.mesh.primitive_cube_add(size=1.0, location=(x_pos, -5.8, z_pos + 1.6))
            g_part = bpy.context.active_object
            g_part.name = f"Collapse_Glass_L{level}_P{part}"
            g_part.scale = (4.6, 0.15, 2.8)
            bpy.ops.object.transform_apply(scale=True)
            g_part.data.materials.append(mat_glass)

            collapse_blocks.append({
                "obj_slab": slab,
                "obj_glass": g_part,
                "init_slab_loc": (x_pos, 0, z_pos),
                "init_glass_loc": (x_pos, -5.8, z_pos + 1.6),
                "level": level,
                "part": part
            })

    # Toiture centrale effondrée avec enseigne secondaire
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 14.8))
    roof_center = bpy.context.active_object
    roof_center.name = "Collapse_Roof_Center"
    roof_center.scale = (10.0, building_depth, 0.6)
    bpy.ops.object.transform_apply(scale=True)
    roof_center.data.materials.append(mat_facade)

    # 8. ANIMATION PHYSIQUE & RECONSTRUCTION INVERSÉE
    # Chronologie :
    # Frame 1 - 35 : État intact (Caméra dans le sous-sol orientée vers le haut)
    # Frame 36 - 75 : Effondrement structural (chute des dalles, inclinaisons chaotiques)
    # Frame 76 - 90 : Pause sur les ruines (pancake collapse)
    # Frame 91 - 150 : RECONSTRUCTION INVERSÉE (les morceaux remontent et se réassemblent)
    
    print(">>> Génération des trajectoires d'animation pour les blocs d'effondrement...")
    
    for item in collapse_blocks:
        slab = item["obj_slab"]
        glass = item["obj_glass"]
        lvl = item["level"]
        part = item["part"]
        
        sx, sy, sz = item["init_slab_loc"]
        gx, gy, gz = item["init_glass_loc"]
        
        # Position effondrée (tas de gravats vers le bas et l'avant)
        fall_z = -0.5 + lvl * 0.4
        tilt_x = math.radians(part * (18 + lvl * 6))
        tilt_y = math.radians(part * (12 + lvl * 4))
        tilt_z = math.radians(part * 8)
        
        # Frame 1 - 35 : Intact
        for f in [1, 35]:
            slab.location = (sx, sy, sz)
            slab.rotation_euler = (0, 0, 0)
            slab.keyframe_insert(data_path="location", frame=f)
            slab.keyframe_insert(data_path="rotation_euler", frame=f)
            
            glass.location = (gx, gy, gz)
            glass.rotation_euler = (0, 0, 0)
            glass.keyframe_insert(data_path="location", frame=f)
            glass.keyframe_insert(data_path="rotation_euler", frame=f)

        # Frame 75 - 90 : Totalement effondré
        collapsed_slab_loc = (sx + part * 0.8, sy - 1.5, fall_z)
        collapsed_glass_loc = (gx + part * 1.5, gy - 2.8, fall_z - 0.2)
        
        for f in [75, 90]:
            slab.location = collapsed_slab_loc
            slab.rotation_euler = (tilt_x, tilt_y, tilt_z)
            slab.keyframe_insert(data_path="location", frame=f)
            slab.keyframe_insert(data_path="rotation_euler", frame=f)
            
            glass.location = collapsed_glass_loc
            glass.rotation_euler = (tilt_x * 1.4, tilt_y * 1.2, tilt_z * 2.0)
            glass.keyframe_insert(data_path="location", frame=f)
            glass.keyframe_insert(data_path="rotation_euler", frame=f)

        # Frame 150 : RECONSTRUCTION PARFAITE (retour à l'état initial)
        slab.location = (sx, sy, sz)
        slab.rotation_euler = (0, 0, 0)
        slab.keyframe_insert(data_path="location", frame=150)
        slab.keyframe_insert(data_path="rotation_euler", frame=150)
        
        glass.location = (gx, gy, gz)
        glass.rotation_euler = (0, 0, 0)
        glass.keyframe_insert(data_path="location", frame=150)
        glass.keyframe_insert(data_path="rotation_euler", frame=150)

    # Toit central animation
    for f in [1, 35]:
        roof_center.location = (0, 0, 14.8)
        roof_center.rotation_euler = (0, 0, 0)
        roof_center.keyframe_insert(data_path="location", frame=f)
        roof_center.keyframe_insert(data_path="rotation_euler", frame=f)
    for f in [75, 90]:
        roof_center.location = (0.5, -2.0, 2.2)
        roof_center.rotation_euler = (math.radians(24), math.radians(-15), math.radians(8))
        roof_center.keyframe_insert(data_path="location", frame=f)
        roof_center.keyframe_insert(data_path="rotation_euler", frame=f)
    roof_center.location = (0, 0, 14.8)
    roof_center.rotation_euler = (0, 0, 0)
    roof_center.keyframe_insert(data_path="location", frame=150)
    roof_center.keyframe_insert(data_path="rotation_euler", frame=150)

    # 9. CHORÉGRAPHIE DE CAMÉRA
    # Caméra unique animée à travers les 3 séquences
    bpy.ops.object.camera_add(location=(0, -2.5, -5.4))
    cam = bpy.context.active_object
    cam.name = "Camera_Director"
    cam.data.lens = 28 # Grand angle cinématique
    scene.camera = cam

    # SHOT 1 (Frames 1 - 35) : Au plafond du sous-sol, regardant directement le sol en plongée verticale
    cam.location = (0.0, 0.0, -0.8)
    cam.rotation_euler = (math.radians(0), math.radians(0), math.radians(0)) # Regard direct vers le sol en -Z
    cam.keyframe_insert(data_path="location", frame=1)
    cam.keyframe_insert(data_path="rotation_euler", frame=1)
    
    # SHOT 1B (Frames 36 - 75) : Montée récursive verticale à travers les étages effondrés
    cam.location = (0.0, 0.0, 22.0)
    cam.rotation_euler = (math.radians(0), math.radians(0), math.radians(0))
    cam.keyframe_insert(data_path="location", frame=75)
    cam.keyframe_insert(data_path="rotation_euler", frame=75)

    # SHOT 2 (Frames 36 - 80) : Transition extérieure sur la ruine
    # À frame 36, cut rapide vers l'extérieur
    cam.location = (2.0, -26.0, 3.8)
    cam.rotation_euler = (math.radians(82), math.radians(0), math.radians(6))
    cam.keyframe_insert(data_path="location", frame=36)
    cam.keyframe_insert(data_path="rotation_euler", frame=36)

    # Frame 75 : Fin de l'effondrement
    cam.location = (1.5, -24.0, 3.2)
    cam.rotation_euler = (math.radians(84), math.radians(1), math.radians(4))
    cam.keyframe_insert(data_path="location", frame=75)
    cam.keyframe_insert(data_path="rotation_euler", frame=75)

    # SHOT 3 (Frames 90 - 150) : TRAVELLING ARRIÈRE (PULL-BACK DOLLY OUT) + RECONSTRUCTION
    # Début du zoom arrière depuis le tas de débris
    cam.location = (0.0, -18.0, 2.5)
    cam.rotation_euler = (math.radians(85), math.radians(0), math.radians(0))
    cam.keyframe_insert(data_path="location", frame=90)
    cam.keyframe_insert(data_path="rotation_euler", frame=90)

    # Fin du recul (Plan large majestueux révélant tout le complexe reconstruit)
    cam.location = (0.0, -44.0, 8.5)
    cam.rotation_euler = (math.radians(78), math.radians(0), math.radians(0))
    cam.keyframe_insert(data_path="location", frame=150)
    cam.keyframe_insert(data_path="rotation_euler", frame=150)

    print(">>> Animation et caméra paramétrées avec succès !")
    return scene

def save_and_render_keyframes(output_blend_path, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    os.makedirs(os.path.dirname(output_blend_path), exist_ok=True)
    
    # Sauvegarde du fichier .blend
    bpy.ops.wm.save_as_mainfile(filepath=output_blend_path)
    print(f">>> Projet Blender sauvegardé dans : {output_blend_path}")
    
    scene = bpy.context.scene
    
    # Rendus des 3 images clés aux instants précis
    keyframes = [
        (20, "RENDER-01_sous_sol_contre_plongee.png", "Instant 1: Sous-sol avec lumière unique vers le haut"),
        (80, "RENDER-02_ruines_effondrement.png", "Instant 2: Bâtiment effondré au crépuscule"),
        (130, "RENDER-03_reconstruction_arriere.png", "Instant 3: Reconstruction inversée et recul caméra")
    ]
    
    for frame_num, filename, desc in keyframes:
        scene.frame_set(frame_num)
        target_path = os.path.join(output_dir, filename)
        scene.render.filepath = target_path
        print(f">>> Rendu de la frame {frame_num} ({desc}) -> {target_path}...")
        bpy.ops.render.render(write_still=True)
        print(f">>> Frame {frame_num} rendue avec succès.")

if __name__ == "__main__":
    blend_path = "/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/episodes/02-ftx/assets/blender/ftx_collapse_scene.blend"
    renders_dir = "/home/mbogneng-junior/Documents/art/Creation_contenus/Youtube/temp/episodes/02-ftx/assets/blender/renders"
    
    build_scene()
    save_and_render_keyframes(blend_path, renders_dir)
    print(">>> PROCESSUS BLENDER TERMINÉ AVEC SUCCÈS !")
