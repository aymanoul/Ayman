#!/usr/bin/env python3
"""Kellerfahrt im Video (Ayman 24.11.): 29,5–35,5 s, langsame Fahrt durch den Mehrzweckraum (Mittelgang), gerendert aus
blender/festsaal.blend (nach festsaal.py) in dieselbe Bildfolge wie animatic.py (out/phase5/end/f_*.png), fortsetzbar.
    ../iqama-video/.venv-blender/bin/python tools/keller_clip.py [--samples 10] [--breite 720] [--aus out/phase5/end]
"""
import math, os, sys
import bpy
from mathutils import Vector

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
arg = lambda n, d: sys.argv[sys.argv.index('--' + n) + 1] if '--' + n in sys.argv else d
bpy.ops.wm.open_mainfile(filepath=os.path.join(ROOT, 'blender', 'festsaal.blend'))
sc = bpy.context.scene
sc.frame_set(2100)
for _m in list(sc.timeline_markers):                  # Kamera-Schnittmarken entfernen (würden die Kamera umschalten)
    sc.timeline_markers.remove(_m)
behalten = {o.name for o in bpy.data.collections['Festsaal'].all_objects}
for o in sc.objects:
    if o.name in behalten or o.name.startswith(('Keller_Wand', 'Keller_Bodenplatte', 'Kellerdecke')):
        continue
    if o.type in ('LIGHT', 'MESH', 'CURVE', 'EMPTY', 'CURVES', 'POINTCLOUD', 'VOLUME'):
        o.animation_data_clear(); o.hide_render = True
for n in sc.world.node_tree.nodes:
    if n.type == 'BACKGROUND':
        n.inputs['Strength'].default_value = 0.0
cd = bpy.data.cameras.new('Keller'); cd.lens = 18; cd.sensor_width = 36
cam = bpy.data.objects.new('Keller', cd); sc.collection.objects.link(cam); sc.camera = cam
B = int(arg('breite', 1280))
sc.render.use_persistent_data = True
sc.render.engine = 'CYCLES'; sc.cycles.samples = int(arg('samples', 10)); sc.cycles.use_denoising = True
sc.render.resolution_x, sc.render.resolution_y, sc.render.resolution_percentage = B, B * 9 // 16, 100
sc.cycles.max_bounces = 8; sc.cycles.transmission_bounces = 12; sc.cycles.transparent_max_bounces = 12
AUS = os.path.join(ROOT, arg('aus', 'out/phase5/end')); os.makedirs(AUS, exist_ok=True)
T0, T1 = 29.5, 35.5
P0, P1 = Vector((11.0, 1.4, -1.5)), Vector((11.0, 9.4, -1.58))
Z0, Z1 = Vector((10.2, 27.0, -2.0)), Vector((12.8, 27.0, -2.25))
BILDER = [int(x) for x in arg('bilder', '').split(',') if x] or range(int(round(T0 * 30)), int(round(T1 * 30)))
for fr in BILDER:
    f = os.path.join(AUS, f'f_{fr:05d}.png')
    if os.path.exists(f):
        continue
    u = (fr / 30 - T0) / (T1 - T0); u = u * u * (3 - 2 * u) * 0.35 + u * 0.65       # sanft an/aus
    p, z = P0.lerp(P1, u), Z0.lerp(Z1, u)
    cam.location = p; cam.rotation_euler = (z - p).to_track_quat('-Z', 'Y').to_euler()
    sc.render.filepath = f; bpy.ops.render.render(write_still=True)
print('Keller fertig', flush=True)
