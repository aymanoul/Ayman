#!/usr/bin/env python3
"""Probe: Sitzen, Handy, Bittgebet – A und B aus drei Richtungen (schnelle Kontrolle der Posen).
    .venv-blender/bin/python blender/posentest.py → out/proben/posen.jpg"""
import os, subprocess, sys
import bpy
from mathutils import Vector
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import drehort as D
S = D.aufbauen()
sc = S['scene']; sc.cycles.samples = 8
sc.render.resolution_x, sc.render.resolution_y = 360, 480
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'out', 'proben')
for n in S['neben']:
    n.location = (0, -30, -5)
fs = []
for name, posen_a, posen_b in [('sitzen', [], [D.HANDY]), ('dua', [D.DUA], [D.DUA])]:
    D.sitzen(S['A'], *posen_a, loc=(-0.45, 0.5, 0), rot_z=180)
    D.sitzen(S['B'], *posen_b, loc=(0.45, 0.5, 0), rot_z=180)
    S['handy'].hide_render = not (posen_b and posen_b[0] is D.HANDY)
    if posen_b and posen_b[0] is D.HANDY:
        D.SZ.handy_zum_gesicht(S, S['B'])
    for k, (pos, ziel) in enumerate([((0.2, 2.6, 0.9), (0, 0.5, 0.6)), ((2.2, 0.9, 0.85), (0, 0.5, 0.6)), ((-0.9, -1.4, 1.1), (0, 0.5, 0.6))]):
        D.SZ.kamera(S, pos, ziel, 30)
        f = os.path.join(OUT, f'p_{name}_{k}.png'); sc.render.filepath = f
        bpy.ops.render.render(write_still=True); fs.append(f)
ins = sum((['-i', f] for f in fs), [])
subprocess.run(['ffmpeg', '-v', 'error', '-y'] + ins + ['-filter_complex', '[0][1][2]hstack=3[a];[3][4][5]hstack=3[b];[a][b]vstack', os.path.join(OUT, 'posen.jpg')], check=True)
