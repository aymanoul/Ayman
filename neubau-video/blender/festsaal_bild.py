#!/usr/bin/env python3
"""Standbild im Festsaal (Keller). Nur der Keller wird gerendert (Rest ausgeblendet, kein Tageslicht).
    ../iqama-video/.venv-blender/bin/python blender/festsaal_bild.py -- "(x,y,z)" "(zx,zy,zz)" BRENNWEITE AUSGABE BREITE HOEHE SAMPLES [BELICHTUNG]
"""
import os
import sys
import bpy
from mathutils import Vector

a = sys.argv[sys.argv.index('--') + 1:]
HERE = os.path.dirname(os.path.abspath(__file__))
bpy.ops.wm.open_mainfile(filepath=os.path.join(HERE, os.environ.get('SAAL_BLEND', 'festsaal.blend')))
sc = bpy.context.scene
sc.frame_set(1799)
behalten = {o.name for o in bpy.data.collections['Festsaal'].all_objects}
for o in sc.objects:
    if o.name in behalten:
        continue
    if o.name.startswith(('Keller_Wand', 'Keller_Bodenplatte', 'Kellerdecke')):
        continue
    if o.type in ('LIGHT', 'MESH', 'CURVE', 'EMPTY', 'CURVES', 'POINTCLOUD', 'VOLUME'):
        o.hide_render = True
for o in bpy.data.objects:
    if o.name.startswith('Wohnwagen'):
        o.hide_render = True
w = sc.world
if w and w.use_nodes:
    for n in w.node_tree.nodes:
        if n.type == 'BACKGROUND':
            n.inputs['Strength'].default_value = 0.0
cd = bpy.data.cameras.new('Saal'); cd.lens = float(a[2]); cam = bpy.data.objects.new('Saal', cd)
sc.collection.objects.link(cam); sc.camera = cam
p, z = Vector(eval(a[0])), Vector(eval(a[1]))
cam.location = p; cam.rotation_euler = (z - p).to_track_quat('-Z', 'Y').to_euler()
sc.render.engine = 'CYCLES'
sc.render.resolution_x, sc.render.resolution_y, sc.render.resolution_percentage = int(a[4]), int(a[5]), 100
sc.cycles.samples = int(a[6]); sc.cycles.use_denoising = True
sc.cycles.max_bounces = 8; sc.cycles.transmission_bounces = 8; sc.cycles.glossy_bounces = 4
sc.cycles.caustics_reflective = False; sc.cycles.caustics_refractive = False; sc.cycles.blur_glossy = 1.0
sc.view_settings.exposure = float(a[7]) if len(a) > 7 else 0.0
sc.render.filepath = a[3]
bpy.ops.render.render(write_still=True)
