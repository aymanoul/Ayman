#!/usr/bin/env python3
"""Figurenblätter (wie die Vorlagen) und Bewegungsprobe aus blender/figuren.blend.

    .venv-blender/bin/python blender/blaetter.py [--samples 32] [--scale 1.0] [--nur A_Qamis] [--teil ansichten|posen]
    → out/blender/figuren/<Figur>_<ansicht>.png, figurenblatt_qamis.jpg, figurenblatt_hemd.jpg, figuren_posen.jpg
"""
import math, os, subprocess, sys, time
import bpy
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
OUT = os.path.join(HERE, '..', 'out', 'blender', 'figuren')
os.makedirs(OUT, exist_ok=True)
arg = lambda n, d: sys.argv[sys.argv.index('--' + n) + 1] if '--' + n in sys.argv else d
scale, nur, teil = float(arg('scale', 1.0)), arg('nur', ''), arg('teil', 'alle')
bpy.ops.wm.open_mainfile(filepath=os.path.join(HERE, 'figuren.blend'))
import figuren as FG                              # nur für pose() / reset_pose()
s = bpy.context.scene
s.cycles.samples = int(arg('samples', 32))
cam = s.camera
KEYS = ['A_Qamis', 'A_Hemd', 'B_Qamis', 'B_Hemd']
# Ansicht: (Kamera-Versatz, Blickpunkt-Höhe, Brennweite, Breite, Höhe)
VIEWS = {
    'vorn': ((0, -5.4, 0.95), 0.93, 88, 320, 640), 'seite': ((-5.4, 0, 0.95), 0.93, 88, 320, 640), 'hinten': ((0, 5.4, 0.95), 0.93, 88, 320, 640),
    'kopf_vorn': ((0, -1.6, 1.64), 1.6, 110, 320, 320), 'kopf_schraeg': ((-1.13, -1.13, 1.64), 1.6, 110, 320, 320),
    'kopf_seite': ((-1.6, 0, 1.64), 1.6, 110, 320, 320), 'kopf_hinten': ((0, 1.6, 1.64), 1.6, 110, 320, 320), 'oben': ((0, -0.01, 4.4), 1.0, 105, 320, 320),
}


def shot(key, view, name=None, look_x=0.0):
    for k in KEYS:
        bpy.data.collections[k].hide_render = k != key
    fx = bpy.data.objects[key + '_Skelett'].location.x
    off, lz, lens, w, h = VIEWS[view] if isinstance(view, str) else view
    cam.location = (fx + off[0], off[1], off[2])
    cam.rotation_euler = (Vector((fx + look_x, 0, lz)) - cam.location).to_track_quat('-Z', 'Y').to_euler()
    cam.data.lens = lens
    s.render.resolution_x, s.render.resolution_y = int(w * scale), int(h * scale)
    s.render.filepath = os.path.join(OUT, f'{key}_{name or view}.png')
    t = time.time()
    bpy.ops.render.render(write_still=True)
    print(f'{key} {name or view}: {time.time() - t:.1f} s', flush=True)
    return s.render.filepath


def ff(inputs, flt, out):
    cmd = ['ffmpeg', '-v', 'error', '-y']
    for i in inputs:
        cmd += ['-i', i]
    subprocess.run(cmd + ['-filter_complex', flt, out], check=True)


if teil in ('alle', 'ansichten'):
    for key in KEYS:
        if nur and key != nur:
            continue
        for v in VIEWS:
            shot(key, v)
    if not nur:
        for outfit in ('Qamis', 'Hemd'):
            f = lambda k, v: os.path.join(OUT, f'{k}_{outfit}_{v}.png')
            body = [f(k, v) for k in 'AB' for v in ('vorn', 'seite', 'hinten')]
            heads = [f(k, v) for k in 'AB' for v in ('kopf_vorn', 'kopf_schraeg', 'kopf_seite', 'kopf_hinten', 'oben')]
            n1, n2 = len(body), len(heads)
            flt = ''.join(f'[{i}]' for i in range(n1)) + f'hstack={n1}[a];' + ''.join(f'[{n1 + i}]scale=192:192[h{i}];' for i in range(n2)) \
                + ''.join(f'[h{i}]' for i in range(n2)) + f'hstack={n2}[b];[a][b]vstack'
            ff(body + heads, flt, os.path.join(OUT, '..', f'figurenblatt_{outfit.lower()}.jpg'))

if teil in ('alle', 'posen'):
    # Bewegungsprobe: zeigt, dass Skelett und Kleidung zusammen funktionieren
    POSEN = {
        'gehen': {'Oberschenkel.L': (-24, 0, 0), 'Unterschenkel.L': (12, 0, 0), 'Oberschenkel.R': (18, 0, 0), 'Unterschenkel.R': (28, 0, 0), 'Fuss.R': (12, 0, 0),
                  'Oberarm.R': (-22, 0, 0), 'Unterarm.R': (-22, 0, 0), 'Oberarm.L': (16, 0, 0), 'Unterarm.L': (-10, 0, 0), 'Brust': (3, 0, 0)},
        'gruessen': {'Oberarm.R': (-12, 0, 62), 'Unterarm.R': (-8, 0, 92), 'Hand.R': (0, 0, 10), 'Kopf': (0, 0, -6), 'Brust': (0, 0, 0)},
        'beugen': {'Bauch': (22, 0, 0), 'Brust': (16, 0, 0), 'Hals': (8, 0, 0), 'Oberarm.L': (-22, 0, 0), 'Oberarm.R': (-22, 0, 0), 'Unterarm.L': (-18, 0, 0), 'Unterarm.R': (-18, 0, 0)},
    }
    files = []
    for key in ['A_Qamis', 'B_Hemd']:
        arm = bpy.data.objects[key + '_Skelett']
        for nm, p in POSEN.items():
            FG.reset_pose(arm); FG.pose(arm, p)
            files.append(shot(key, ((-2.6, -4.6, 1.15), 0.95, 80, 400, 640), f'pose_{nm}'))
        FG.reset_pose(arm)
    ff(files, ''.join(f'[{i}]' for i in range(len(files))) + f'hstack={len(files)}', os.path.join(OUT, '..', 'figuren_posen.jpg'))
