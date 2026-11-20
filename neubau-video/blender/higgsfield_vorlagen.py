#!/usr/bin/env python3
"""4 Standbilder 9:16 (1080×1920) als Vorlage für Aymans eigene Higgsfield-Überarbeitung (20.11.).
Zeitpunkt 47,9 s: alles gebaut, Tor zu, noch Tageslicht. Kein Text.
    ../iqama-video/.venv-blender/bin/python blender/higgsfield_vorlagen.py [--samples 48] [--nur moschee]
"""
import math, os, sys
import bpy
from mathutils import Vector
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.join(HERE, '..')
arg = lambda n, d: sys.argv[sys.argv.index('--' + n) + 1] if '--' + n in sys.argv else d
bpy.ops.wm.open_mainfile(filepath=os.path.join(HERE, 'neubau.blend'))
sc = bpy.context.scene
sc.frame_set(int(round(47.9 * 30)))
sc.render.engine = 'CYCLES'; sc.cycles.samples = int(arg('samples', 48)); sc.cycles.use_denoising = True
sc.render.resolution_x, sc.render.resolution_y, sc.render.resolution_percentage = 1080, 1920, 100
AUS = os.path.join(ROOT, 'out', 'higgsfield'); os.makedirs(AUS, exist_ok=True)
ANSICHTEN = {  # name: (Position, Blickziel, Brennweite) – None als Ziel = senkrecht von oben
    '1_moschee': ((24, -9.5, 5.0), (8.5, 6, 3.8), 20),
    '2_hof':     ((14.5, 28.5, 6.0), (6.5, 18, 1.4), 20),
    '3_parken':  ((31, -12, 10), (38.5, 8, 0.5), 22),
    '4_oben':    ((23, 11, 67), None, 35),
}
nur = [x for x in arg('nur', '').split(',') if x] or list(ANSICHTEN)
cd = bpy.data.cameras.new('Vorlage'); cam = bpy.data.objects.new('Vorlage', cd); sc.collection.objects.link(cam)
cd.sensor_width = 36; cd.clip_end = 2000; sc.camera = cam
for name in nur:
    pos, ziel, lens = ANSICHTEN[name]
    cd.lens = lens; cam.location = pos
    if ziel is None:
        cam.rotation_euler = (0, 0, math.radians(90))   # senkrecht nach unten, Grundstück (X-Achse) läuft im Hochformat von oben nach unten
    else:
        cam.rotation_euler = (Vector(ziel) - Vector(pos)).to_track_quat('-Z', 'Y').to_euler()
    sc.render.filepath = os.path.join(AUS, f'{name}.png')
    bpy.ops.render.render(write_still=True); print('fertig', name, flush=True)
