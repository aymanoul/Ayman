#!/usr/bin/env python3
"""Phase 2 (Blender-Fassung) – Storyboard „Zwischen Adhan und Iqama“: je Shot ein 3D-Standbild, ohne Einblendungen.

    .venv-blender/bin/python blender/storyboard.py [--nur S2,S5] [--samples 24] [--breite 540]
    → out/phase2/3d_<Shot>.png, out/phase2/3d_tor_nah.png und out/phase2/beschriftung.json (Bildpunkte der Lichtpunkte in S10)
Achsen: X rechts, Y zur Qibla (+6), Z oben. Säulen (±1,75 | −1,0), (±1,75 | −4,2).
"""
import json
import math
import os
import sys
import bpy
import bmesh
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import drehort as D                    # noqa: E402
R, SZ = D.R, D.SZ

OUT = os.path.join(HERE, '..', 'out', 'phase2')
os.makedirs(OUT, exist_ok=True)
arg = lambda n, d: sys.argv[sys.argv.index('--' + n) + 1] if '--' + n in sys.argv else d
nur = [x for x in arg('nur', '').split(',') if x]
S = D.aufbauen()
sc = S['scene']
sc.cycles.samples = int(arg('samples', 24))
sc.render.use_persistent_data = True
breite = int(arg('breite', 540))
sc.render.resolution_x, sc.render.resolution_y = breite, breite * 16 // 9
A, B, ph, NEBEN = S['A'], S['B'], S['handy'], S['neben']
beschriftung = {}
LICHTER = [(o, o.data.energy) for o in bpy.data.objects if o.type == 'LIGHT']


# ------------------------------------------------------------------ Licht-Tor und Lichtpunkte (nur Licht, keine Figur)
def emission(name, farbe, staerke, alpha=1.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree; nt.nodes.clear()
    out = nt.nodes.new('ShaderNodeOutputMaterial')
    em = nt.nodes.new('ShaderNodeEmission'); em.inputs['Color'].default_value = (*R.lin(R.rgb(farbe)), 1); em.inputs['Strength'].default_value = staerke
    if alpha < 1.0:
        tr = nt.nodes.new('ShaderNodeBsdfTransparent'); mix = nt.nodes.new('ShaderNodeMixShader')
        mix.inputs['Fac'].default_value = alpha
        nt.links.new(tr.outputs[0], mix.inputs[1]); nt.links.new(em.outputs[0], mix.inputs[2]); nt.links.new(mix.outputs[0], out.inputs[0])
    else:
        nt.links.new(em.outputs[0], out.inputs[0])
    return m


def bogen(r, h, n=40):
    """Umriss eines Rundbogens (Breite 2r, Höhe h) in der xz-Ebene."""
    pts = [(-r, 0)] + [(-r, h - r)] + [(-r * math.cos(t), h - r + r * math.sin(t)) for t in [math.pi * k / n for k in range(1, n)]] + [(r, h - r), (r, 0)]
    return pts


def licht_tor(coll):
    g = bpy.data.objects.new('Licht_Tor', None); coll.objects.link(g)
    r, h, d = 1.2, 2.9, 0.11
    au, inn = bogen(r, h), bogen(r - d, h - d)
    bm = bmesh.new()
    va = [bm.verts.new((x, 0, z)) for x, z in au]
    vi = [bm.verts.new((x, 0, z)) for x, z in inn]
    for i in range(len(va) - 1):
        bm.faces.new((va[i], va[i + 1], vi[i + 1], vi[i]))
    rahmen = R.bm_object('Licht_Tor_Rahmen', bm, emission('Tor_Rahmen', '#f2b544', 5.0), coll, parent=g, smooth=False)
    bm = bmesh.new()
    vf = [bm.verts.new((x, 0.02, z)) for x, z in inn]
    bm.faces.new(vf)
    R.bm_object('Licht_Tor_Flaeche', bm, emission('Tor_Flaeche', '#ffd27a', 1.2, alpha=0.3), coll, parent=g, smooth=False)
    li = bpy.data.lights.new('Licht_Tor_Licht', 'AREA'); li.energy = 70; li.color = (1.0, 0.8, 0.45); li.shape = 'RECTANGLE'; li.size, li.size_y = 2.2, 2.8
    lo = bpy.data.objects.new('Licht_Tor_Licht', li); coll.objects.link(lo); lo.parent = g
    lo.location = (0, -0.3, 1.5); lo.rotation_euler = (math.radians(90), 0, 0)
    g.location = (0, 4.9, 0.5)
    return g


PUNKTE = [(-1.5, 3.0), (-0.78, 3.6), (0.0, 3.85), (0.78, 3.6), (1.5, 3.0)]


def lichtpunkte(coll):
    g = bpy.data.objects.new('Lichtpunkte', None); coll.objects.link(g)
    m = emission('Lichtpunkt', '#ffd88f', 14.0)
    for i, (x, y) in enumerate(PUNKTE):
        R.sphere(f'Lichtpunkt_{i}', 0.12, (x, y, 0.14), m, coll, parent=g)
        li = bpy.data.lights.new(f'Lichtpunkt_{i}_Licht', 'POINT'); li.energy = 25; li.color = (1.0, 0.78, 0.42); li.shadow_soft_size = 0.2
        lo = bpy.data.objects.new(f'Lichtpunkt_{i}_Licht', li); coll.objects.link(lo); lo.parent = g; lo.location = (x, y, 0.3)
    return g


TOR = licht_tor(S['coll'])
PUNKT = lichtpunkte(S['coll'])
DISPLAY = {k: bpy.data.images.load(os.path.join(OUT, 'tex', f'{k}.png')) for k in ('handy_display', 'handy_display_dunkel')}


def zeige(obj, an):
    obj.hide_render = not an
    for c in obj.children_recursive:
        c.hide_render = not an


# ------------------------------------------------------------------ Aufstellung
B_POS, A_POS = (-1.75, -0.5, 0), (-1.05, -0.42, 0)       # B mit dem Rücken an der Säule (−1,75 | −1,0), A rechts daneben
B_ROT, A_ROT = 155, 205                                   # leicht einander zugewandt (180 = zur Qibla)
WARTENDE = [(-0.6, 3.6), (0.9, 3.9), (2.4, 3.2), (-2.6, 2.6), (0.2, 1.6)]
IMAM_POS = (0.0, 5.2, 0)


def grundstellung(dimmen=1.0, display='handy_display'):
    for l, e in LICHTER:
        l.data.energy = e * dimmen
    zeige(TOR, False); zeige(PUNKT, False)
    for n in NEBEN:
        n.location = (0, -40, -5)
    for k in ('A_Qamis', 'B_Hemd'):
        bpy.data.collections[k].hide_render = False
    S['mundA'].hide_render = False; S['mundB'].hide_render = False
    zeige(ph, True)
    SZ.handy_bild(S, os.path.join(OUT, 'tex', f'{display}.png'))


def wartende(n=5):
    for i, (x, y) in enumerate(WARTENDE[:n]):
        D.sitzen(NEBEN[i if i < 4 else 5], {'Kopf': (6, 0, 0)}, loc=(x, y, 0), rot_z=180)


def imam():
    SZ.stell(NEBEN[4], {'Kopf': (4, 0, 0)}, loc=IMAM_POS, rot_z=180)


def a_b(b_pose=(), a_pose=(), handy=True):
    D.sitzen(B, *b_pose, loc=B_POS, rot_z=B_ROT)
    D.sitzen(A, *a_pose, loc=A_POS, rot_z=A_ROT)
    zeige(ph, handy)
    if handy:
        SZ.handy_zum_gesicht(S, B)


def nur_b(*pose):
    bpy.data.collections['A_Qamis'].hide_render = True; S['mundA'].hide_render = True
    D.sitzen(B, *pose, loc=B_POS, rot_z=B_ROT)
    SZ.handy_zum_gesicht(S, B)


def kopf(arm):
    bpy.context.view_layer.update()
    return arm.matrix_world @ arm.pose.bones['Kopf'].head + Vector((0, 0, 0.1))


def objektiv(fov_vertikal):
    return 18 / math.tan(math.radians(fov_vertikal) / 2)


# ------------------------------------------------------------------ Shots S1–S12
def S1():   # Totale von hinten, Raum ruhig, B an der Säule mit Handy, Wartende
    grundstellung(); wartende(); nur_b(D.HANDY)
    SZ.kamera(S, (1.3, -5.2, 2.1), (-1.3, 0.6, 0.8), objektiv(50))


def S2():   # langsame Fahrt auf B
    grundstellung(); wartende(3); nur_b(D.HANDY)
    SZ.kamera(S, (-0.3, 1.7, 1.4), (-1.75, -0.45, 0.75), objektiv(40))


def S3():   # nah auf B mit Handy
    grundstellung(); nur_b(D.HANDY)
    k = kopf(B)
    SZ.kamera(S, (k.x + 0.55, k.y + 1.55, k.z + 0.12), (k.x, k.y, k.z - 0.22), objektiv(34))


def S4():   # A setzt sich neben B: Zwei-Shot von vorn
    grundstellung(); a_b([D.HANDY], [D.SPRECHEN])
    SZ.kamera(S, (-0.35, 1.6, 1.15), (-1.4, -0.45, 0.7), objektiv(40))


def S5():   # nah A, leicht von der Seite
    grundstellung(); a_b([D.HANDY], [D.SPRECHEN])
    k = kopf(A)
    SZ.kamera(S, (k.x + 1.15, k.y + 1.15, k.z + 0.02), (k.x, k.y, k.z - 0.18), objektiv(34))


def S6():   # Kernbild: Raum gedimmt, Display dunkel, Licht-Tor über dem Raum
    grundstellung(dimmen=0.45, display='handy_display_dunkel'); wartende(); a_b([D.HANDY_UNTEN])
    zeige(TOR, True)
    SZ.kamera(S, (0.3, -1.6, 1.2), (0.0, 5.0, 1.85), objektiv(54))


def S7():   # nah B, Handy sinkt
    grundstellung(display='handy_display_dunkel'); a_b([D.HANDY_UNTEN])
    k = kopf(B)
    SZ.kamera(S, (k.x + 0.75, k.y + 1.6, k.z + 0.08), (k.x, k.y, k.z - 0.25), objektiv(34))


def S8():   # Halbtotale von hinten: Wartende
    grundstellung(display='handy_display_dunkel'); wartende(); a_b([D.HANDY_UNTEN])
    SZ.kamera(S, (0.2, -2.4, 1.75), (0.0, 3.4, 0.75), objektiv(46))


def S9():   # B schaut aufs Handy (Bildschirmzeit kommt als Einblendung davor)
    S3()


def S10():  # Draufsicht, fünf Lichtpunkte
    grundstellung(); a_b([], [], handy=False)
    zeige(PUNKT, True)
    SZ.kamera(S, (-0.4, 0.2, 3.3), (-0.3, 2.3, 0.0), objektiv(86))
    beschriftung['S10'] = [SZ.bildpunkt(S, (x, y, 0.14)) for x, y in PUNKTE]


def S11():  # B steckt das Handy in die Tasche
    grundstellung(); a_b([D.TASCHE], handy=False)
    zeige(ph, True); ph.parent = None
    bpy.context.view_layer.update()
    pb = B.pose.bones['Hand.R']; hand = B.matrix_world @ ((pb.head + pb.tail) / 2)
    ph.location = hand + Vector((0, 0, 0.06)); ph.rotation_euler = (0, 0, math.radians(B_ROT))      # Handy gleitet in die Tasche
    k = kopf(B)
    SZ.kamera(S, (k.x + 0.75, k.y + 1.75, k.z - 0.05), (k.x, k.y, k.z - 0.4), objektiv(38))


def S12():  # Bittgebet: A und B heben die Hände, Seitenansicht; vorn der Imam von hinten
    grundstellung(); wartende(3); imam(); a_b([D.DUA], [D.DUA], handy=False)
    SZ.kamera(S, (-3.5, 0.9, 1.25), (-1.35, -0.5, 0.8), objektiv(42))


def TOR_NAH():   # Einzelbild Licht-Tor
    grundstellung(dimmen=0.45); zeige(TOR, True)
    bpy.data.collections['A_Qamis'].hide_render = True; bpy.data.collections['B_Hemd'].hide_render = True
    S['mundA'].hide_render = True; S['mundB'].hide_render = True; zeige(ph, False)
    SZ.kamera(S, (0.0, 0.2, 1.7), (0.0, 5.0, 1.9), objektiv(50))


SHOTS = {f'S{i}': globals()[f'S{i}'] for i in range(1, 13)}
SHOTS['tor_nah'] = TOR_NAH
for sid, fn in SHOTS.items():
    if nur and sid not in nur:
        continue
    fn()
    sc.render.filepath = os.path.join(OUT, f'3d_{sid}.png')
    bpy.ops.render.render(write_still=True)
    print('fertig', sid, flush=True)
alt = os.path.join(OUT, 'beschriftung.json')
if os.path.exists(alt):
    beschriftung = {**json.load(open(alt)), **beschriftung}
json.dump(beschriftung, open(alt, 'w'), indent=1)
