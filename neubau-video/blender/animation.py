#!/usr/bin/env python3
"""Phase 4: Bau-Zeitraffer (6 Stufen) + Drohnenflug (eine Fahrt) in blender/neubau.blend.

    .venv-blender/bin/python blender/umgebung.py && .venv-blender/bin/python blender/moschee.py \\
      && .venv-blender/bin/python blender/animation.py [--endstufe 6]

Zeiten in Sekunden (Szene 30 fps, Bild 0 = 0 s). Jedes Bauteil wird von einer wandernden Grenze aufgebaut
(Geometry-Nodes-Gruppe „Aufbau“: Punkte jenseits der Grenze werden auf die Grenze gezogen, vor dem Start ist das Teil weg).
Nichts fliegt herein, kein Kran, keine Maschine, kein Mensch.
 0  0–4   Ausgangslage (Schotter)          1  4–8   Aushub Keller (Boden senkt sich, Holzverbau, Geländer, 2 Treppen)
 2  8–13  Keller & Bodenplatte             3  13–20 Erdgeschoss (Wände, Säulen, Glasfelder links → rechts, Portal)
 4  20–25 1. Etage                          5  25–30 Decke, Attika, Gründach, PV Reihe für Reihe
 6  30–36 Außenanlagen, Bäume, Markierungen, Licht an, Dämmerung     36–42 Halten (Abschlusskarte kommt per Code)
Kameras: Drohne_A (Start tief in der Gasse hinter dem Schornstein) und Drohne_B (Start hoch über Hochstraße/Sheddächern),
ab 4 s identisch. 24 mm, leicht nach unten geneigt, nie durch Gebäude.
"""
import math
import os
import sys
import bpy
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
arg = lambda n, d: sys.argv[sys.argv.index('--' + n) + 1] if '--' + n in sys.argv else d
END_STAGE = int(arg('endstufe', 6))
bpy.ops.wm.open_mainfile(filepath=os.path.join(HERE, 'neubau.blend'))
sc = bpy.context.scene
FPS = 30
sc.render.fps = FPS; sc.frame_start = 0; sc.frame_end = 42 * FPS
sc['END_STAGE'] = END_STAGE
F = lambda t: int(round(t * FPS))
BT, Y0, Y1, KZ = 16.5, 3.0, 15.0, -3.2


def hexrgb(h):
    h = h.lstrip('#'); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c) + (1.0,)


def coll(name):
    c = bpy.data.collections.get(name)
    if c is None:
        c = bpy.data.collections.new(name); sc.collection.children.link(c)
    return c


def mesh(name, verts, faces, mat, c):
    me = bpy.data.meshes.new(name); me.from_pydata(verts, [], faces); me.update()
    ob = bpy.data.objects.new(name, me); coll(c).objects.link(ob); me.materials.append(mat)
    return ob


def viele_quader(name, liste, mat, c):
    v, f = [], []
    for (x0, y0, z0, x1, y1, z1) in liste:
        k = len(v)
        v += [(x0, y0, z0), (x1, y0, z0), (x1, y1, z0), (x0, y1, z0), (x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1)]
        f += [(k, k + 3, k + 2, k + 1), (k + 4, k + 5, k + 6, k + 7), (k, k + 1, k + 5, k + 4), (k + 1, k + 2, k + 6, k + 5),
              (k + 2, k + 3, k + 7, k + 6), (k + 3, k, k + 4, k + 7)]
    return mesh(name, v, f, mat, c)


def holz(name, hexf):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']; b.inputs['Base Color'].default_value = hexrgb(hexf); b.inputs['Roughness'].default_value = 0.85
    return m


# ------------------------------------------------------------------ Stufe 1: Baugrube (Holzverbau, Geländer, 2 Treppen)
HV = holz('Holz_Verbau', '#8A6A45'); HG = holz('Holz_Gelaender', '#A9875C'); ER = holz('Erde_Grube', '#6E5A44')
D = 0.18
verbau = [(0, Y0, KZ - 0.05, BT, Y0 + D, 0.35), (0, Y1 - D, KZ - 0.05, BT, Y1, 0.35),
          (0, Y0 + D, KZ - 0.05, D, Y1 - D, 0.35), (BT - D, Y0 + D, KZ - 0.05, BT, Y1 - D, 0.35)]
viele_quader('Verbau', verbau, HV, 'S1_Aushub')
# senkrechte Bohlen-Fugen als dünne dunklere Leisten
fugen = [(x, Y0 + D, KZ, x + 0.04, Y0 + D + 0.02, 0.3) for x in [0.6 + k * 0.9 for k in range(17)]]
fugen += [(x, Y1 - D - 0.02, KZ, x + 0.04, Y1 - D, 0.3) for x in [0.6 + k * 0.9 for k in range(17)]]
viele_quader('Verbau_Fugen', fugen, ER, 'S1_Aushub')
gel = []
for (x0, y0, x1, y1) in ((0, Y0 - 0.25, BT, Y0 - 0.15), (0, Y1 + 0.15, BT, Y1 + 0.25), (BT + 0.15, Y0 - 0.25, BT + 0.25, Y1 + 0.25)):
    for z in (0.55, 1.05):
        gel.append((x0, y0, z, x1, y1, z + 0.08))
    n = int(max(x1 - x0, y1 - y0) / 2.0)
    for k in range(n + 1):
        t = k / max(n, 1); px, py = x0 + (x1 - x0) * t, y0 + (y1 - y0) * t
        gel.append((px - 0.05, py - 0.05, 0, px + 0.05, py + 0.05, 1.13))
viele_quader('Gelaender_Grube', gel, HG, 'S1_Aushub')
tr = []
for i in range(16):        # Treppe vorn rechts: entlang der Vorderwand nach links hinunter
    x = BT - 0.4 - (i + 1) * 0.28
    tr.append((x, Y0 + D, KZ, x + 0.28, Y0 + D + 1.0, -0.2 * (i + 1)))
for i in range(16):        # Treppe hinten links: entlang der Rückwand nach rechts hinunter
    x = 0.4 + i * 0.28
    tr.append((x, Y1 - D - 1.0, KZ, x + 0.28, Y1 - D, -0.2 * (i + 1)))
viele_quader('Treppen_Grube', tr, HG, 'S1_Aushub')
grube = bpy.data.objects['Grube_Boden']

# ------------------------------------------------------------------ Geometry-Nodes-Gruppe „Aufbau“
ng = bpy.data.node_groups.new('Aufbau', 'GeometryNodeTree')
ng.interface.new_socket('Geometry', in_out='INPUT', socket_type='NodeSocketGeometry')
ng.interface.new_socket('Geometry', in_out='OUTPUT', socket_type='NodeSocketGeometry')
s_ax = ng.interface.new_socket('Achse', in_out='INPUT', socket_type='NodeSocketVector'); s_ax.default_value = (0, 0, 1)
s_gr = ng.interface.new_socket('Grenze', in_out='INPUT', socket_type='NodeSocketFloat'); s_gr.default_value = 1e6
N = ng.nodes; Lk = ng.links.new
gi = N.new('NodeGroupInput'); go = N.new('NodeGroupOutput')
pos = N.new('GeometryNodeInputPosition')
dot = N.new('ShaderNodeVectorMath'); dot.operation = 'DOT_PRODUCT'
Lk(pos.outputs[0], dot.inputs[0]); Lk(gi.outputs['Achse'], dot.inputs[1])
mn = N.new('ShaderNodeMath'); mn.operation = 'MINIMUM'; Lk(dot.outputs['Value'], mn.inputs[0]); Lk(gi.outputs['Grenze'], mn.inputs[1])
sub = N.new('ShaderNodeMath'); sub.operation = 'SUBTRACT'; Lk(mn.outputs[0], sub.inputs[0]); Lk(dot.outputs['Value'], sub.inputs[1])
scl = N.new('ShaderNodeVectorMath'); scl.operation = 'SCALE'; Lk(gi.outputs['Achse'], scl.inputs[0]); Lk(sub.outputs[0], scl.inputs['Scale'])
sp = N.new('GeometryNodeSetPosition'); Lk(gi.outputs['Geometry'], sp.inputs['Geometry']); Lk(scl.outputs[0], sp.inputs['Offset'])
st = N.new('GeometryNodeAttributeStatistic'); st.data_type = 'FLOAT'; st.domain = 'POINT'
Lk(gi.outputs['Geometry'], st.inputs['Geometry']); Lk(dot.outputs['Value'], st.inputs[2])
cmp = N.new('FunctionNodeCompare'); cmp.data_type = 'FLOAT'; cmp.operation = 'GREATER_EQUAL'
Lk(st.outputs['Min'], cmp.inputs[0]); Lk(gi.outputs['Grenze'], cmp.inputs[1])
dele = N.new('GeometryNodeDeleteGeometry'); dele.domain = 'POINT'
Lk(sp.outputs['Geometry'], dele.inputs['Geometry']); Lk(cmp.outputs['Result'], dele.inputs['Selection'])
Lk(dele.outputs['Geometry'], go.inputs['Geometry'])
ID = {it.name: it.identifier for it in ng.interface.items_tree if getattr(it, 'in_out', '') == 'INPUT'}


def setzen(mod, ident, wert):
    """Eingang eines Geometry-Nodes-Modifiers setzen – Blender ≥ 5.1 (properties.inputs) und älter (mod[ident]).
    Gibt den Datenpfad für Keyframes zurück."""
    if hasattr(mod, 'properties') and hasattr(mod.properties, 'inputs'):
        getattr(mod.properties.inputs, ident).value = wert
        return f'modifiers["{mod.name}"].properties.inputs.{ident}.value'
    mod[ident] = wert
    return f'modifiers["{mod.name}"]["{ident}"]'


def spanne(ob, achse):
    a = Vector(achse); w = [a.dot(ob.matrix_world @ v.co) for v in ob.data.vertices]
    return min(w), max(w)


def aufbau(ob, t0, t1, achse=(0, 0, 1), weg=False, stufe=0):
    """t0→t1: Teil wächst entlang achse (weg=True: verschwindet rückwärts). Stufen über END_STAGE bleiben unsichtbar."""
    if ob.type != 'MESH' or not ob.data.vertices:
        return
    mod = ob.modifiers.get('Aufbau') or ob.modifiers.new('Aufbau', 'NODES'); mod.node_group = ng
    setzen(mod, ID['Achse'], tuple(float(c) for c in achse))
    lo, hi = spanne(ob, achse); aus, an = lo - 0.02, hi + 0.02
    if stufe > END_STAGE:
        setzen(mod, ID['Grenze'], aus); return
    if weg:
        werte = ((t0, an), (t1, aus))
    else:
        werte = ((t0, aus), (t1, an))
    for t, v in werte:
        pfad = setzen(mod, ID['Grenze'], v); ob.keyframe_insert(data_path=pfad, frame=F(t))


def obs(*muster, sammlung=None, ohne=None):
    out = []
    for o in bpy.data.objects:
        if sammlung and not any(c.name == sammlung for c in o.users_collection):
            continue
        if ohne and ohne in o.name:
            continue
        if any(o.name == m or (m.endswith('*') and o.name.startswith(m[:-1])) for m in muster):
            out.append(o)
    return sorted(out, key=lambda o: o.name)


def gruppe(muster, t0, t1, achse=(0, 0, 1), stufe=0, versatz=0.0, weg=False, sammlung=None, ohne=None):
    lst = obs(*muster, sammlung=sammlung, ohne=ohne) if isinstance(muster, (list, tuple)) else obs(muster, sammlung=sammlung, ohne=ohne)
    for i, o in enumerate(lst):
        aufbau(o, t0 + i * versatz, t1 + i * versatz, achse, weg, stufe)


X, Y, Z = (1, 0, 0), (0, 1, 0), (0, 0, 1)
# Stufe 1 – Aushub
if END_STAGE >= 1:
    grube.location.z = 0; grube.keyframe_insert('location', index=2, frame=F(4.3))
    grube.location.z = KZ - 0.07; grube.keyframe_insert('location', index=2, frame=F(7.5))
aufbau(bpy.data.objects['Verbau'], 4.5, 7.8, Z, stufe=1)
aufbau(bpy.data.objects['Verbau_Fugen'], 4.5, 7.8, Z, stufe=1)
aufbau(bpy.data.objects['Gelaender_Grube'], 6.3, 7.8, X, stufe=1)
aufbau(bpy.data.objects['Treppen_Grube'], 6.6, 8.0, Z, stufe=1)
# Stufe 2 – Keller & Bodenplatte; Verbau verschwindet
aufbau(bpy.data.objects['Keller_Bodenplatte'], 8.0, 9.0, X, stufe=2)
gruppe('Keller_Wand*', 9.0, 10.8, Z, 2, 0.15)
if END_STAGE >= 2:
    for n in ('Verbau', 'Verbau_Fugen'):
        aufbau(bpy.data.objects[n], 10.6, 12.0, Z, weg=True, stufe=2)
    aufbau(bpy.data.objects['Gelaender_Grube'], 10.6, 11.6, X, weg=True, stufe=2)
    aufbau(bpy.data.objects['Treppen_Grube'], 10.6, 11.6, Z, weg=True, stufe=2)
aufbau(bpy.data.objects['Kellerdecke'], 11.8, 13.0, X, stufe=2)
# Stufe 3 – Erdgeschoss
gruppe(['EG_Wand*', 'EG_Tuer_Hof'], 13.0, 15.2, Z, 3, 0.2)
gruppe('EG_Saeule*', 13.3, 15.0, Z, 3, 0.15)
gruppe(['EG_Glas', 'EG_Pfosten'], 15.4, 18.6, X, 3)
gruppe('EG_Seitenfenster*', 16.0, 17.4, Z, 3, 0.1)
gruppe('Portal_*', 16.6, 19.6, Z, 3)
gruppe(['EG_Teppich', 'Mihrab*', 'Minbar*'], 17.0, 18.8, X, 3)
# Stufe 4 – 1. Etage
gruppe(['Geschossdecke', 'Geschossband'], 20.0, 21.4, X, 4, 0.2)
gruppe('OG_Wand*', 21.0, 22.8, Z, 4, 0.2)
gruppe('OG_Saeule*', 21.2, 22.6, Z, 4, 0.1)
gruppe(['OG_Glas', 'OG_Pfosten', 'OG_Teppich'], 22.4, 24.6, X, 4)
gruppe('OG_Seitenfenster*', 23.0, 24.2, Z, 4, 0.1)
aufbau(bpy.data.objects['Deckenleuchten'], 19.5, 24.0, Z, stufe=4)
# Stufe 5 – Decke & PV-Dach
aufbau(bpy.data.objects['Dachplatte'], 25.0, 26.0, X, stufe=5)
gruppe('Attika*', 25.8, 27.0, Z, 5, 0.1)
aufbau(bpy.data.objects['Dachkies'], 26.2, 27.2, X, stufe=5)
aufbau(bpy.data.objects['Gruendach'], 26.6, 28.2, X, stufe=5)
gruppe(['PV_Gestell', 'PV_Module'], 27.4, 30.0, X, 5)
# Stufe 6 – Fertigstellung
aufbau(bpy.data.objects['Vorplatz'], 30.0, 31.0, X, stufe=6)
aufbau(bpy.data.objects['Hof_Boden'], 30.0, 31.6, Y, stufe=6)
gruppe('Hofmauer_*', 30.4, 31.6, Z, 6, 0.1)
aufbau(bpy.data.objects['Hof_Wandleuchten'], 31.4, 31.9, Z, stufe=6)
gruppe(['Kuebel*', 'Pflanzkasten*'], 31.0, 32.0, Z, 6, 0.08, ohne='_Gruen')
gruppe('Olive*', 31.6, 33.6, Z, 6, 0.04)
gruppe('Pflanzkasten*_Gruen*', 32.0, 33.2, Z, 6, 0.04)
gruppe(['Hof_Baenke', 'Tisch*', 'Hocker*', 'Schirm*'], 32.4, 33.6, Z, 6, 0.03)
aufbau(bpy.data.objects['Parken_Belag'], 30.4, 31.4, X, stufe=6)
aufbau(bpy.data.objects['Wohnwagen_Belag'], 30.8, 32.0, X, stufe=6)
aufbau(bpy.data.objects['Markierungen'], 31.6, 34.0, X, stufe=6)
aufbau(bpy.data.objects['Hecke'], 32.0, 34.0, X, stufe=6)
aufbau(bpy.data.objects['Wandleuchten_Brandwand'], 32.6, 33.6, X, stufe=6)
aufbau(bpy.data.objects['Zaun_fest'], 33.0, 35.0, X, stufe=6)
gruppe(['Schiebetor', 'Schiebetor_Fuehrung'], 34.0, 35.2, X, 6)


# Licht an + Dämmerung (34–36 s)
an = END_STAGE >= 6
for mname, st_an in (('Innenlicht_warm', 4.0), ('Wandleuchte_warm', 10.0)):
    b = bpy.data.materials[mname].node_tree.nodes['Principled BSDF'].inputs['Emission Strength']
    for t, v in ((0, 0.0), (33.6, 0.0), (35.4, st_an if an else 0.0)):
        b.default_value = v; b.keyframe_insert('default_value', frame=F(t))
for lo in obs('Innenlicht*'):
    if lo.type == 'LIGHT':
        for t, v in ((0, 0.0), (33.6, 0.0), (35.4, 900.0 if an else 0.0)):
            lo.data.energy = v; lo.data.keyframe_insert('energy', frame=F(t))
sonne = bpy.data.objects['Sonne'].data
for t, e, c in ((0, 5.0, (1.0, 0.78, 0.56)), (32.8, 5.0, (1.0, 0.78, 0.56)), (36.0, 0.9 if an else 5.0, (1.0, 0.58, 0.36))):
    sonne.energy = e; sonne.color = c
    sonne.keyframe_insert('energy', frame=F(t)); sonne.keyframe_insert('color', frame=F(t))
bg = sc.world.node_tree.nodes['Background'].inputs['Strength']
for t, v in ((0, 0.22), (32.8, 0.22), (36.0, 0.05 if an else 0.22)):
    bg.default_value = v; bg.keyframe_insert('default_value', frame=F(t))

# ------------------------------------------------------------------ Drohnenflug
GEMEINSAM = [  # (s, Position, Blickziel)
    (4.0, (24, -21, 22), (8, 9, -1.5)),
    (8.0, (14, -24, 23), (8, 9, -1.5)),
    (12.6, (4, -21, 24), (8, 9, 0.0)),
    (14.6, (-3, -5.6, 8.5), (4, 4, 3.5)),
    (19.6, (21, -5.6, 6.8), (12, 4, 4.5)),
    (24.8, (26, -13, 15), (9, 9, 7)),
    (27.4, (13, -1.5, 24), (8, 9, 9)),
    (30.0, (6, 5, 27), (8, 10, 9)),
    (32.2, (4, 22, 24), (8, 9, 5)),
    (34.2, (30, 10, 20), (11, 8, 3)),
    (36.0, (27, -16, 13), (7, 8, 4)),
    (42.0, (26.4, -15.6, 12.8), (7, 8, 4)),
]
START = {
    'A': [(0.0, (33, -3.6, 2.0), (16.9, -8.9, 5.0)), (1.8, (26, -3.8, 7.5), (11, 5, 2.5)), (3.0, (25, -14, 15), (9, 5, 0.0))],
    'B': [(0.0, (-46, -42, 50), (16.9, -8.9, 14.0)), (2.0, (4, -36, 32), (11, 3, 2.0))],
}
for v, start in START.items():
    cd = bpy.data.cameras.new(f'Drohne_{v}'); cd.lens = 24; cd.sensor_width = 36; cd.clip_end = 2000
    cam = bpy.data.objects.new(f'Drohne_{v}', cd); sc.collection.objects.link(cam)
    ziel = bpy.data.objects.new(f'Blickziel_{v}', None); sc.collection.objects.link(ziel)
    con = cam.constraints.new('TRACK_TO'); con.target = ziel; con.track_axis = 'TRACK_NEGATIVE_Z'; con.up_axis = 'UP_Y'
    for t, p, z in start + GEMEINSAM:
        cam.location = p; cam.keyframe_insert('location', frame=F(t))
        ziel.location = z; ziel.keyframe_insert('location', frame=F(t))
    for ob in (cam, ziel):
        for fc in ob.animation_data.action.fcurves if hasattr(ob.animation_data.action, 'fcurves') else []:
            for kp in fc.keyframe_points:
                kp.interpolation = 'BEZIER'; kp.handle_left_type = kp.handle_right_type = 'AUTO_CLAMPED'
sc.camera = bpy.data.objects['Drohne_A']

bpy.ops.wm.save_as_mainfile(filepath=os.path.join(HERE, 'neubau.blend'), relative_remap=True)
print('Animation gespeichert, END_STAGE =', END_STAGE, '| Aufbau-Modifier:', sum(1 for o in bpy.data.objects if o.modifiers.get('Aufbau')))
