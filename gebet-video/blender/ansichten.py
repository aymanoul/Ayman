#!/usr/bin/env python3
"""Rendert die Kontroll-Ansichten des Gebetsraums (wie die Vorlage) aus blender/gebetsraum.blend.

    .venv-blender/bin/python blender/ansichten.py [--samples 48] [--only 1,5] [--scale 1.0]
    → out/blender/ansicht_<name>.png
"""
import os, sys, time
import bpy

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'out', 'blender')
os.makedirs(OUT, exist_ok=True)
arg = lambda n, d: sys.argv[sys.argv.index('--' + n) + 1] if '--' + n in sys.argv else d
bpy.ops.wm.open_mainfile(filepath=os.path.join(HERE, 'gebetsraum.blend'))
s = bpy.context.scene
s.cycles.samples = int(arg('samples', 48))
scale = float(arg('scale', 1.0))
only = arg('only', '')
for cam in sorted((o for o in bpy.data.objects if o.type == 'CAMERA'), key=lambda o: o.name):
    hoch = 'Hochformat' in cam.name
    num = cam.name.split('_')[1]
    if only and num not in only.split(','):
        continue
    s.camera = cam
    s.render.resolution_x, s.render.resolution_y = (int(540 * scale), int(960 * scale)) if hoch else (int(960 * scale), int(640 * scale))
    s.render.filepath = os.path.join(OUT, 'ansicht_' + cam.name.replace('Kamera_', '') + '.png')
    t = time.time()
    bpy.ops.render.render(write_still=True)
    print(f'{cam.name}: {time.time() - t:.1f} s', flush=True)
