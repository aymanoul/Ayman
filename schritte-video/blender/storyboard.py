#!/usr/bin/env python3
"""Phase 2 – Storyboard: je Shot ein 3D-Standbild aus Blender (ohne Einblendungen).

    ../gebet-video/.venv-blender/bin/python blender/storyboard.py [--nur S2,S5] [--samples 24] [--breite 540]
    → out/phase2/3d_<Shot>.png  und  out/phase2/beschriftung.json (Bildpositionen für die Einblendungen)
"""
import json
import math
import os
import sys
import bpy

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import szene as SZ                     # noqa: E402
from mathutils import Vector           # noqa: E402

OUT = os.path.join(HERE, '..', 'out', 'phase2')
os.makedirs(OUT, exist_ok=True)
arg = lambda n, d: sys.argv[sys.argv.index('--' + n) + 1] if '--' + n in sys.argv else d
nur = [x for x in arg('nur', '').split(',') if x]
S = SZ.aufbauen()
sc = S['scene']
sc.cycles.samples = int(arg('samples', 24))
breite = int(arg('breite', 540))
sc.render.resolution_x, sc.render.resolution_y = breite, breite * 16 // 9
A, B, ph = S['A'], S['B'], S['handy']
spur = SZ.fussspur(S['coll'], (0.55, SZ.GEHWEG_Y + 0.6, 0), (0.55, -1.4, 0), 24)   # B: vom Gehweg über den Hof zur Tür
wege = SZ.wege(S['coll'])
beschriftung = {}


def nichts():
    SZ.abdruck_leuchten(spur, [0] * len(spur))
    for ob, m, _ in wege:
        ob.hide_render = True
    A.hide_render = False
    for o in bpy.data.objects:
        if o.name.startswith('Tuer_Haupt_') and o.parent is None:
            o.rotation_euler.z = 0.0


def tuer_auf(k=1.0):
    for o in bpy.data.objects:
        if o.name == 'Tuer_Haupt_links':
            o.rotation_euler.z = math.radians(-100 * k)
        if o.name == 'Tuer_Haupt_rechts':
            o.rotation_euler.z = math.radians(100 * k)


def figuren_sichtbar(a=True, b=True):
    for key, vis in (('A_Qamis', a), ('B_Hemd', b)):
        bpy.data.collections[key].hide_render = not vis
    ph.hide_render = not b


def S2():   # Kamera zieht auf: B geht auf dem Gehweg an der Moschee vorbei, Handy in der Hand
    figuren_sichtbar(False, True)
    SZ.stell(B, SZ.geh_pose(0.5), SZ.HANDY_HALTEN_GEHEN, loc=(0.4, SZ.GEHWEG_Y, 0), rot_z=90)
    SZ.kamera(S, (3.4, -20.0, 1.4), (-0.6, -10.0, 2.6), 30)


def S3():   # A am Vordach, B bleibt stehen – über Bs Schulter auf A
    SZ.stell(A, SZ.ERKLAEREN, loc=(0.3, -3.2, 0), rot_z=8)
    SZ.stell(B, SZ.HANDY_HALTEN, {'Kopf': (2, 0, 0), 'Hals': (0, 0, 0)}, loc=(1.9, -6.0, 0), rot_z=210)
    SZ.kamera(S, (2.4, -8.6, 1.62), (0.3, -3.2, 1.45), 40)


def S4():   # nah auf A, leicht seitlich
    figuren_sichtbar(True, False)
    SZ.stell(A, SZ.ERKLAEREN, loc=(0.3, -3.2, 0), rot_z=8)
    SZ.kamera(S, (-1.2, -5.3, 1.6), (0.3, -3.2, 1.6), 55)


def S5():   # Kernbild: seitliche Fahrt, B geht vom Gehweg über den Hof zur Tür, Spur leuchtet
    figuren_sichtbar(False, True)
    y = -8.0
    SZ.stell(B, SZ.geh_pose(1.3), SZ.HANDY_HALTEN_GEHEN, loc=(0.55, y, SZ.huepf(1.3)), rot_z=180)
    n = sum(1 for (ob, _) in spur if ob.location.y < y - 0.2)
    SZ.abdruck_leuchten(spur, [max(0.25, 1 - 0.07 * (n - 1 - i)) if i < n else 0 for i in range(len(spur))])
    SZ.kamera(S, (4.6, -7.0, 1.7), (0.3, -9.6, 0.7), 26)


def S6():   # nah auf B, er schaut auf seine Füße
    figuren_sichtbar(False, True)
    SZ.stell(B, SZ.AUF_FUESSE, {'Oberarm.R': (-8, 0, 0), 'Unterarm.R': (-20, 0, 0)}, loc=(0.55, -5.0, 0), rot_z=180)
    n = sum(1 for (ob, _) in spur if ob.location.y < -5.2)
    SZ.abdruck_leuchten(spur, [1 if i < n else 0 for i in range(len(spur))])
    SZ.kamera(S, (1.7, -2.6, 1.3), (0.5, -5.6, 0.95), 38)


def S7():   # Draufsicht auf den Hof: die Spur der Abdrücke
    figuren_sichtbar(False, True)
    SZ.stell(B, SZ.geh_pose(0.2), loc=(0.55, -3.4, 0), rot_z=180)
    n = sum(1 for (ob, _) in spur if ob.location.y < -3.6)
    SZ.abdruck_leuchten(spur, [1 if i < n else 0 for i in range(len(spur))])
    SZ.kamera(S, (0.6, -9.0, 11.0), (0.55, -8.0, 0.0), 40)


def S8():   # B schaut auf sein Handy – über die Schulter auf das Display
    figuren_sichtbar(False, True)
    SZ.stell(B, SZ.HANDY_HALTEN, loc=(0.55, -3.0, 0), rot_z=180)
    hw = ph.matrix_world.translation.copy()
    print('Handy', tuple(round(v, 3) for v in hw), flush=True)
    SZ.kamera(S, (0.95, -3.45, 1.8), (0.4, -1.2, 1.3), 30)          # Hintergrund; das Handy-Display kommt als Einblendung darüber


def S9():   # große Totale von oben: fünf Wege aus fünf Richtungen
    figuren_sichtbar(False, False)
    for ob, m, _ in wege:
        ob.hide_render = False
    SZ.kamera(S, (0.0, -30.0, 62.0), (0.0, -9.0, 0.0), 26)
    namen = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']
    ziel = Vector((0, -1.5, 0))
    pts = [SZ.bildpunkt(S, ziel + (s - ziel).normalized() * 13) for (_, _, s) in wege]
    # von links nach rechts sortiert, abwechselnd höher/tiefer, damit sich nichts überlappt
    order = sorted(range(5), key=lambda i: pts[i][0])
    xs = [150 + k * 175 for k in range(5)]
    beschriftung['S9'] = [{'text': namen[i], 'xy': (xs[k], max(1180, min(1480, pts[i][1])) + (0 if k % 2 else 70))} for k, i in enumerate(order)]


def S10():  # B steckt das Handy ein und geht neben A zur Tür
    figuren_sichtbar(True, True)
    ph.hide_render = True
    SZ.stell(A, SZ.geh_pose(0.4), loc=(-0.45, -5.0, SZ.huepf(0.4)), rot_z=180)
    SZ.stell(B, SZ.geh_pose(1.4), {'Oberarm.R': (6, 0, 0), 'Unterarm.R': (-14, 0, 0)}, loc=(0.45, -5.2, SZ.huepf(1.4)), rot_z=180)
    n = sum(1 for (ob, _) in spur if ob.location.y < -5.4)
    SZ.abdruck_leuchten(spur, [0.6 if i < n else 0 for i in range(len(spur))])
    SZ.kamera(S, (2.6, -10.5, 1.7), (0.0, -2.5, 1.6), 32)


def S11():  # beide gehen durch die Tür, die Abdrücke leuchten nach
    figuren_sichtbar(True, True)
    ph.hide_render = True
    tuer_auf(1.0)
    SZ.stell(A, SZ.geh_pose(0.6), loc=(-0.35, -0.9, SZ.huepf(0.6)), rot_z=180)
    SZ.stell(B, SZ.geh_pose(1.6), {'Oberarm.R': (6, 0, 0), 'Unterarm.R': (-14, 0, 0)}, loc=(0.4, -1.1, SZ.huepf(1.6)), rot_z=180)
    SZ.abdruck_leuchten(spur, [1.0] * len(spur))
    SZ.kamera(S, (0.3, -9.5, 1.45), (0.0, -1.0, 1.7), 30)


SHOTS = {'S2': S2, 'S3': S3, 'S4': S4, 'S5': S5, 'S6': S6, 'S7': S7, 'S8': S8, 'S9': S9, 'S10': S10, 'S11': S11}
for name, fn in SHOTS.items():
    if nur and name not in nur:
        continue
    nichts(); figuren_sichtbar(True, True)
    fn()
    sc.render.filepath = os.path.join(OUT, f'3d_{name}.png')
    bpy.ops.render.render(write_still=True)
    print('Bild', name, flush=True)
bf = os.path.join(OUT, 'beschriftung.json')
alt = json.load(open(bf)) if os.path.exists(bf) else {}
alt.update(beschriftung)
json.dump(alt, open(bf, 'w'), indent=1)
