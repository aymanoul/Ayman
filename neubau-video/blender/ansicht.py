#!/usr/bin/env python3
"""Standbilder aus blender/neubau.blend → out/<ordner>/<ansicht>.png

    .venv-blender/bin/python blender/ansicht.py [--nur oben,foto1] [--samples 32] [--ordner phase2] [--sonne vorn]
Ansichten: oben (Draufsicht, orthografisch), schraeg (Übersicht), drohne (9:16), foto1/foto3/foto4 (wie Aymans Fotos).
"""
import os
import sys
import time
import bpy
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, '..')
arg = lambda n, d: sys.argv[sys.argv.index('--' + n) + 1] if '--' + n in sys.argv else d
bpy.ops.wm.open_mainfile(filepath=os.path.join(HERE, 'neubau.blend'))
sc = bpy.context.scene; cam = sc.camera
sc.cycles.samples = int(arg('samples', 32))
AUS = os.path.join(ROOT, 'out', arg('ordner', 'phase2')); os.makedirs(AUS, exist_ok=True)

# Name: (Position, Ziel, Brennweite, Breite, Höhe, orthografische Breite)
ANSICHTEN = {
    'oben':   ((22, 6, 160), (22, 6, 0), 0, 1600, 1200, 120),
    'schraeg': ((-16, -58, 40), (22, 8, 0), 24, 1600, 900, 0),
    'drohne': ((-10, -44, 27), (20, 9, 3), 24, 720, 1280, 0),
    'foto1':  ((2.5, -2.6, 1.55), (60, -4.6, 3.2), 26, 1280, 720, 0),     # gasse_blick_zum_torgebaeude
    'foto3':  ((10.5, -7.5, 1.55), (-3, 14, 5.0), 26, 1280, 720, 0),       # grundstueck_links_altbauten
    'foto4':  ((9.0, -5.5, 1.55), (9.0, 20, 3.4), 26, 1280, 720, 0),      # grundstueck_frontal_rueckwand
}
nur = [x for x in arg('nur', '').split(',') if x] or list(ANSICHTEN)
ZUSATZ = ''
if arg('sonne', '') == 'vorn':
    # Variante: tiefe warme Sonne von vorn links (über der Gasse) → Glasfassade im Licht
    import math
    h = math.radians(13); r = Vector((-0.55, -0.83, 0)).normalized()
    zur = Vector((r.x * math.cos(h), r.y * math.cos(h), math.sin(h)))
    bpy.data.objects['Sonne'].rotation_euler = (-zur).to_track_quat('-Z', 'Y').to_euler()
    ZUSATZ = '_sonne_vorn'
for name in nur:
    pos, ziel, lens, w, h, ortho = ANSICHTEN[name]
    cam.location = pos
    if ortho:
        cam.data.type = 'ORTHO'; cam.data.ortho_scale = ortho; cam.rotation_euler = (0, 0, 0)
    else:
        cam.data.type = 'PERSP'; cam.data.lens = lens
        cam.rotation_euler = (Vector(ziel) - Vector(pos)).to_track_quat('-Z', 'Y').to_euler()
    sc.render.resolution_x, sc.render.resolution_y = w, h
    sc.render.filepath = os.path.join(AUS, name + ZUSATZ + '.png')
    t = time.time()
    bpy.ops.render.render(write_still=True)
    print(f'fertig: {name} ({time.time() - t:.0f} s)', flush=True)
