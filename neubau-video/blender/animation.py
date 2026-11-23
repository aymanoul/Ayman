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
import fnmatch
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
sc.render.fps = FPS; sc.frame_start = 0; sc.frame_end = 60 * FPS
sc['END_STAGE'] = END_STAGE
F = lambda t: int(round(t * FPS))
BT, Y0, Y1, KZ = 20.0, 0.3, 12.3, -3.2
TT, LT = 29.0, 12.3


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
YG = TT     # Ayman 20.11.: Grube reicht unter den Hof bis zur hinteren Grenze
verbau = [(0, Y0, KZ - 0.05, BT, Y0 + D, 0.35), (0, YG - D, KZ - 0.05, BT, YG, 0.35),
          (0, Y0 + D, KZ - 0.05, D, YG - D, 0.35), (BT - D, Y0 + D, KZ - 0.05, BT, YG - D, 0.35)]
viele_quader('Verbau', verbau, HV, 'S1_Aushub')
# senkrechte Bohlen-Fugen als dünne dunklere Leisten
fugen = [(x, Y0 + D, KZ, x + 0.04, Y0 + D + 0.02, 0.3) for x in [0.6 + k * 0.9 for k in range(17)]]
fugen += [(x, YG - D - 0.02, KZ, x + 0.04, YG - D, 0.3) for x in [0.6 + k * 0.9 for k in range(17)]]
viele_quader('Verbau_Fugen', fugen, ER, 'S1_Aushub')
gel = []
for (x0, y0, x1, y1) in ((0, Y0 - 0.25, BT, Y0 - 0.15), (BT + 0.15, Y0 - 0.25, BT + 0.25, LT - 0.1)):   # hinten steht die Grenzmauer, rechts ab LT das Nachbargebäude
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
    tr.append((x, YG - D - 1.0, KZ, x + 0.28, YG - D, -0.2 * (i + 1)))
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


ZUGEWIESEN = {}


ACHSEN = {}


def aufbau(ob, t0, t1, achse=(0, 0, 1), weg=False, stufe=0):
    """t0→t1: Teil wächst entlang achse (weg=True: verschwindet rückwärts). Stufen über END_STAGE bleiben unsichtbar."""
    if ob.type != 'MESH' or not ob.data.vertices:
        return
    if ob.name in ZUGEWIESEN and not weg:
        print('WARNUNG doppelt:', ob.name); return
    if weg and ob.name in ACHSEN:
        achse = ACHSEN[ob.name]          # Abbau entlang derselben Achse wie der Aufbau (sonst ist das Teil am Anfang schon sichtbar)
    ACHSEN.setdefault(ob.name, achse)
    ZUGEWIESEN[ob.name] = t0
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
        if any(fnmatch.fnmatchcase(o.name, m) for m in muster):
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
gruppe('Keller_Wand?', 9.0, 10.8, Z, 2, 0.15)
if END_STAGE >= 2:
    for n in ('Verbau', 'Verbau_Fugen'):
        aufbau(bpy.data.objects[n], 10.6, 12.0, Z, weg=True, stufe=2)
    aufbau(bpy.data.objects['Gelaender_Grube'], 10.6, 11.6, X, weg=True, stufe=2)
    aufbau(bpy.data.objects['Treppen_Grube'], 10.6, 11.6, Z, weg=True, stufe=2)
aufbau(bpy.data.objects['Kellerdecke'], 12.0, 13.2, X, stufe=2)
aufbau(bpy.data.objects['Keller_Estrich'], 9.2, 9.8, X, stufe=2)
aufbau(bpy.data.objects['Keller_Saeulen'], 9.6, 10.8, Z, stufe=2)
aufbau(bpy.data.objects['Keller_Wandstuetzen'], 9.6, 10.8, Z, stufe=2)
aufbau(bpy.data.objects['Keller_Unterzuege'], 10.4, 10.9, Z, stufe=2)
gruppe(['Keller_Treppe*'], 10.0, 11.0, Z, 2)
aufbau(bpy.data.objects['Keller_Wandleuchten'], 10.8, 11.2, Z, stufe=2)
aufbau(bpy.data.objects['Kellerdecke_Hof'], 12.4, 13.6, Y, stufe=2)
# Stufe 3 – Erdgeschoss
gruppe(['EG_Wand_links_Qibla', 'EG_Wand_hinten_*'], 13.0, 15.2, Z, 3, 0.2)
gruppe('EG_Saeule*', 13.3, 15.0, Z, 3, 0.15)
gruppe(['EG_Glas', 'EG_Pfosten', 'Fassade_Lisenen_EG', 'Fassade_Sockel'], 15.4, 18.6, X, 3)
gruppe(['EG_Glas_hinten', 'EG_Pfosten_hinten'], 16.0, 18.8, X, 3)
gruppe(['EG_Glas_rechts', 'EG_Pfosten_rechts'], 15.8, 18.4, Y, 3)
gruppe(['Portal_Pfeiler*', 'Portal_Sturz', 'Portal_Glastuer', 'Portal_Feld_oben', 'Portal_Zwickel*', 'Portal_Sprossen', 'Portal_Goldkante', 'Portal_Laternen*'], 16.6, 19.6, Z, 3)
gruppe(['EG_Teppich', 'Mihrab*', 'Minbar*', 'Innen_Regal*'], 17.0, 18.8, X, 3)
gruppe('Innen_Ringleuchte*', 18.4, 19.6, Z, 3, 0.1)
gruppe(['Innen2_*'], 17.4, 19.4, Z, 3, 0.02)
# Stufe 4 – 1. Etage
gruppe(['Geschossdecke', 'Geschossband'], 20.0, 21.4, X, 4, 0.2)
gruppe('OG_Wand*', 21.0, 22.8, Z, 4, 0.2)
gruppe('OG_Saeule*', 21.2, 22.6, Z, 4, 0.1)
gruppe(['OG_Glas', 'OG_Pfosten', 'OG_Teppich', 'Fassade_Lisenen_OG', 'LED_Geschossband'], 22.4, 24.6, X, 4)
gruppe('Rueckseite_Fenster*', 22.6, 24.4, Z, 4)
gruppe(['OG_Glas_rechts', 'OG_Pfosten_rechts', 'Geschossband_rechts'], 22.6, 24.6, Y, 4)
aufbau(bpy.data.objects['Deckenleuchten'], 19.5, 24.0, Z, stufe=4)
# Stufe 5 – Decke & PV-Dach
aufbau(bpy.data.objects['Dachplatte'], 25.0, 26.0, X, stufe=5)
gruppe('Attika?', 25.8, 27.0, Z, 5, 0.1)
gruppe(['Attika_Abdeckung', 'LED_Attika'], 26.6, 27.4, X, 5)
aufbau(bpy.data.objects['Dachkies'], 26.2, 27.2, X, stufe=5)
aufbau(bpy.data.objects['Gruendach'], 26.6, 28.2, X, stufe=5)
gruppe(['PV_Gestell', 'PV_Module'], 27.4, 30.0, X, 5)
# Stufe 6 – Fertigstellung (Ayman 19.11.: Hof voller, länger zeigen; Wohnwagen auf den Plätzen; Zaun + Schiebetor deutlich)
# (23.11.: Vorplatz-Platte entfällt)
aufbau(bpy.data.objects['Hof_Boden'], 30.2, 31.0, Y, stufe=6)
gruppe(['Hofmauer_*'], 30.4, 31.2, Z, 6, 0.1)
gruppe(['Hof_Pflanzbeete', 'Hof_Beeterde'], 30.8, 31.6, Y, 6)
gruppe(['Hof_Busch*', 'Hof_Zypresse*'], 31.2, 32.4, Z, 6, 0.015)
gruppe(['Kuebel*', 'Olive*', 'Palme_*'], 31.6, 33.0, Z, 6, 0.03)
gruppe(['Tische', 'Stuehle', 'Schirm*', 'Lounge_*', 'Aussenkueche*'], 32.2, 33.4, Z, 6, 0.04)
gruppe(['Hof_Wandleuchten', 'Hof_Bodenstrahler', 'Hoftuer_Vordach'], 33.0, 33.6, Z, 6)
# Schiebedach über dem Hof (Ayman 20.11.): entsteht geschlossen (Regen), schiebt sich dann auf (Sonne)
aufbau(bpy.data.objects['Hofdach_Stuetzen'], 33.2, 33.8, Z, stufe=6)
aufbau(bpy.data.objects['Hofdach_Schienen'], 33.5, 34.0, Y, stufe=6)
gruppe(['Hofdach_Feld?'], 33.8, 34.2, X, 6, 0.08)
sch = bpy.data.objects['Hofdach_Schienen']
for t, v in ((0, 0.0), (35.0, 0.0), (36.6, 1.0)):
    sch['offen'] = v; sch.keyframe_insert('["offen"]', frame=F(t))
gruppe(['Portal_Stufen', 'Portal_Kuebel*', 'Portal_Zypresse*'], 30.2, 31.2, Z, 6)
aufbau(bpy.data.objects['Parken_Belag'], 40.8, 41.6, X, stufe=6)
aufbau(bpy.data.objects['Wohnwagen_Belag'], 41.0, 41.8, X, stufe=6)
aufbau(bpy.data.objects['Markierungen'], 41.2, 42.4, X, stufe=6)
aufbau(bpy.data.objects['Parken_Radstopper'], 42.0, 42.4, Z, stufe=6)
aufbau(bpy.data.objects['Hecke'], 41.4, 42.6, X, stufe=6)
aufbau(bpy.data.objects['Parken_Hecke'], 41.0, 41.8, X, stufe=6)
aufbau(bpy.data.objects['Parken_Bordstein'], 40.9, 41.5, Y, stufe=6)
aufbau(bpy.data.objects['Wandleuchten_Brandwand'], 41.8, 42.4, X, stufe=6)
# Wohnwagen (Ayman 20.11.): fertig, werden leicht auf den Platz „fallen gelassen“ (nicht von unten aufgebaut)
for i in range(7):
    t0 = 42.0 + i * 0.2
    for o in obs(f'Wohnwagen{i}_*'):
        ZUGEWIESEN[o.name] = t0
        o.hide_render = True; o.keyframe_insert('hide_render', frame=0)
        o.hide_render = False; o.keyframe_insert('hide_render', frame=F(t0))
        z = o.location.z
        for t, dz in ((t0, 1.8), (t0 + 0.45, 0.0), (t0 + 0.6, 0.06), (t0 + 0.75, 0.0)):
            o.location.z = z + dz; o.keyframe_insert('location', index=2, frame=F(t))
        o.location.z = z
        fcs = o.animation_data.action.fcurves if hasattr(o.animation_data.action, 'fcurves') else []
        for fc in fcs:
            if fc.data_path == 'location':
                kps = fc.keyframe_points
                kps[0].interpolation = 'QUAD'; kps[0].easing = 'EASE_IN'     # beschleunigt fallen
                for kp in kps[1:]:
                    kp.interpolation = 'SINE'
# Autos (Ayman 23.11.): 2 stehen schon (werden wie die Wohnwagen auf den Platz gesetzt), 2 parken im Video ein
def _auto_teile(name):
    b = bpy.data.objects[name + '_Karosserie']
    return b, [b] + [o for o in bpy.data.objects if o.parent == b]


def _sichtbar_ab(teile, t):
    for o in teile:
        ZUGEWIESEN[o.name] = t
        o.hide_render = True; o.keyframe_insert('hide_render', frame=0)
        o.hide_render = False; o.keyframe_insert('hide_render', frame=F(t))


for name, t0 in (('Auto2', 42.5), ('Auto3', 42.75)):
    b, teile = _auto_teile(name)
    _sichtbar_ab(teile, t0)
    z = b.location.z
    for t, dz in ((t0, 1.2), (t0 + 0.38, 0.0), (t0 + 0.5, 0.04), (t0 + 0.62, 0.0)):
        b.location.z = z + dz; b.keyframe_insert('location', index=2, frame=F(t))
    b.location.z = z


def _bezier(p0, p1, p2, p3, n=40):
    return [p0 * (1 - t) ** 3 + p1 * 3 * (1 - t) ** 2 * t + p2 * 3 * (1 - t) * t * t + p3 * t ** 3 for t in [k / n for k in range(n + 1)]]


def einparken(name, t0, t1, x_start=58.0):
    """Fährt auf der Gasse heran (von rechts), biegt in die Fahrgasse und parkt vorwärts schräg ein. Räder drehen, Vorderräder lenken."""
    b, teile = _auto_teile(name)
    ziel = b.location.copy().to_2d(); gier = b.rotation_euler.z
    U = Vector((math.cos(gier), math.sin(gier)))
    i = int(b['platz']); E = Vector((25.3, 0.45 + (i + 0.5) * 2.5364))         # Einfahrt in den Platz (Fahrgassen-Kante)
    xg, yl = 27.45, -2.3                                                      # Mitte Fahrgasse, Fahrspur auf der Gasse
    weg = [Vector((x_start, yl)), Vector((31.6, yl))]
    weg += _bezier(Vector((31.6, yl)), Vector((29.2, yl)), Vector((xg, -0.6)), Vector((xg, 1.4)))[1:]
    weg += [Vector((xg, E.y - 3.2))]
    weg += _bezier(Vector((xg, E.y - 3.2)), Vector((xg, E.y - 1.6)), E - U * 0.9, E + U * 0.6)[1:]
    weg += [ziel]
    # dicht abtasten, Bogenlänge
    pts = [weg[0]]
    for a_, b_ in zip(weg, weg[1:]):
        n = max(1, int((b_ - a_).length / 0.1))
        pts += [a_.lerp(b_, k / n) for k in range(1, n + 1)]
    sl = [0.0]
    for a_, b_ in zip(pts, pts[1:]):
        sl.append(sl[-1] + (a_ - b_).length)
    Lw = sl[-1]; T = t1 - t0; v0 = 8.0

    def s_von(tau):                                                           # Hermite: Startgeschwindigkeit v0, Ende steht
        h10 = tau ** 3 - 2 * tau ** 2 + tau; h01 = -2 * tau ** 3 + 3 * tau ** 2
        return h10 * v0 * T + h01 * Lw

    def bei(sv):
        sv = max(0.0, min(Lw, sv)); k = 0
        while k < len(sl) - 2 and sl[k + 1] < sv:
            k += 1
        f = (sv - sl[k]) / max(1e-6, sl[k + 1] - sl[k])
        return pts[k].lerp(pts[k + 1], f), k

    _sichtbar_ab(teile, t0)
    R = b['radius']; wb = b['radstand']; z = b.location.z
    raeder = [o for o in teile if o.name.endswith(('_vl', '_vr', '_hl', '_hr'))]
    gier_alt = None
    for fr in range(F(t0), F(t1) + 1):
        tau = (fr / FPS - t0) / T; sv = s_von(tau)
        p, k = bei(sv)
        d = pts[min(k + 1, len(pts) - 1)] - pts[max(k - 1, 0)]
        g = math.atan2(d.y, d.x) if d.length > 1e-6 else gier
        if fr == F(t1):
            p, g = ziel, gier
        if gier_alt is not None:                                              # Winkel stetig halten
            while g - gier_alt > math.pi: g -= 2 * math.pi
            while g - gier_alt < -math.pi: g += 2 * math.pi
        # Lenkwinkel aus der Krümmung kurz voraus
        p2, k2 = bei(sv + 1.0); d2 = pts[min(k2 + 1, len(pts) - 1)] - pts[max(k2 - 1, 0)]
        g2 = math.atan2(d2.y, d2.x) if d2.length > 1e-6 else g
        dg = (g2 - g + math.pi) % (2 * math.pi) - math.pi
        lenk = max(-0.6, min(0.6, math.atan(wb * dg / 1.0)))
        b.location = (p.x, p.y, z); b.rotation_euler = (0, 0, g)
        b.keyframe_insert('location', frame=fr); b.keyframe_insert('rotation_euler', index=2, frame=fr)
        for r in raeder:
            r.rotation_euler = (0, sv / R, lenk if r.get('vorn') else 0.0)
            r.keyframe_insert('rotation_euler', frame=fr)
        gier_alt = g
    for o in teile:
        ad = o.animation_data
        for fc in (ad.action.fcurves if ad and ad.action and hasattr(ad.action, 'fcurves') else []):
            if fc.data_path in ('location', 'rotation_euler'):
                for kp in fc.keyframe_points:
                    kp.interpolation = 'LINEAR'


einparken('Auto1', 48.4, 55.6)                 # schwarzer Kompakt → Platz 3 (hinten)
einparken('Auto4', 50.6, 57.4)                 # schwarzes SUV → Platz 2

# (23.11.: fester Zaun entfällt – Schienen, Endpfosten und 3 Schiebeflügel kommen mit 'Schiebetor*')
gruppe(['Schiebetor', 'Schiebetor_*'], 43.2, 44.0, Z, 6)

# Schiebetor zeigen: öffnet und schließt (Warnleuchte blinkt dabei)
tor = bpy.data.objects['Schiebetor']
for t, v in ((0, 0.0), (44.6, 0.0), (45.9, 1.0), (46.5, 1.0), (47.8, 0.0)):
    tor['offen'] = v; tor.keyframe_insert('["offen"]', frame=F(t))
wl = bpy.data.materials['Warnleuchte_orange'].node_tree.nodes['Principled BSDF'].inputs['Emission Strength']
wl.default_value = 0.0; wl.keyframe_insert('default_value', frame=F(0))
for a, b in ((44.4, 46.0), (46.4, 47.9)):
    t = a
    while t < b:
        wl.default_value = 6.0; wl.keyframe_insert('default_value', frame=F(t))
        wl.default_value = 0.0; wl.keyframe_insert('default_value', frame=F(t + 0.25))
        t += 0.5
for fc in (wl.id_data.animation_data.action.fcurves if hasattr(wl.id_data.animation_data.action, 'fcurves') else []):
    for kp in fc.keyframe_points:
        kp.interpolation = 'CONSTANT'

# Schluss: Dach bleibt zu (Ayman 23.11.: kein Blick ins Obergeschoss/Frauenbereich), stattdessen Gesamtansicht von vorn oben

# Sicherheit: jedes Bauteil der Moschee/Außenanlagen braucht einen Aufbau, sonst wäre es von Anfang an sichtbar
for c in ('S2_Keller', 'S3_EG', 'S4_OG', 'S5_Dach', 'S6_Aussen', 'Innen', 'Wohnwagen'):
    for o in bpy.data.collections[c].objects:
        if o.type == 'MESH' and not o.modifiers.get('Aufbau') and o.name not in ZUGEWIESEN:
            print('ohne Aufbau, ergänze Stufe 6:', o.name)
            aufbau(o, 36.0, 37.0, Z, stufe=6)


# Licht an + Dämmerung (34–36 s)
an = END_STAGE >= 6
for mname, st_an in (('Innenlicht_warm', 4.0), ('Wandleuchte_warm', 10.0)):
    b = bpy.data.materials[mname].node_tree.nodes['Principled BSDF'].inputs['Emission Strength']
    for t, v in ((0, 0.0), (49.0, 0.0), (50.6, st_an if an else 0.0)):
        b.default_value = v; b.keyframe_insert('default_value', frame=F(t))
for lo in obs('Innenlicht*'):
    if lo.type == 'LIGHT':
        for t, v in ((0, 0.0), (49.0, 0.0), (50.6, 260.0 if an else 0.0)):
            lo.data.energy = v; lo.data.keyframe_insert('energy', frame=F(t))
sonne = bpy.data.objects['Sonne'].data
for t, e, c in ((0, 4.8, (1.0, 0.88, 0.74)), (48.0, 4.8, (1.0, 0.88, 0.74)), (51.0, 4.8, (1.0, 0.86, 0.72))):   # Ayman 23.11.: hell bis zum Schluss, keine Dämmerung
    sonne.energy = e; sonne.color = c
    sonne.keyframe_insert('energy', frame=F(t)); sonne.keyframe_insert('color', frame=F(t))
bg = sc.world.node_tree.nodes['Background'].inputs['Strength']
for t, v in ((0, 0.3), (48.0, 0.3), (51.0, 0.3)):
    bg.default_value = v; bg.keyframe_insert('default_value', frame=F(t))

# ------------------------------------------------------------------ Drohnenflug
GEMEINSAM = [  # (s, Position, Blickziel)
    (4.2, (15.5, -6.8, 2.0), (14, 4, 3.2)),       # unten am (künftigen) Eingang
    (6.0, (20, -3.5, 13), (9, 9, -1.0)),         # steigt über der Gasse auf, Grube entsteht
    (8.0, (14, -24, 23), (8, 9, -1.5)),
    (10.6, (13, -4, 11.5), (8, 15, -2.6)),        # tief und nah über die Grube: Keller mit Säulen, Treppen, Leuchten (Ayman 20.11.)
    (12.6, (6, -6, 12.5), (8, 16, -1.5)),
    (14.6, (-3, -5.6, 8.5), (4, 4, 3.5)),
    (19.6, (21, -5.6, 6.8), (12, 4, 4.5)),
    (22.2, (24, -6.8, 11.0), (10.8, 6.0, 5.6)),   # über der Gasse bleiben (Hallen gegenüber, Ayman 23.11.)
    (24.8, (26, -13, 15), (9, 9, 7)),
    (27.4, (13, -1.5, 24), (8, 9, 9)),
    (29.6, (7, 6, 15.5), (8, 12, 9.3)),          # nah über den PV-Reihen
    (31.6, (7, 10.5, 22), (8, 22.5, 0.5)),       # über den Hof, Blick hinein (von oben)
    (34.6, (9.5, 13.5, 16.5), (8, 23.0, 0.5)),
    (36.2, (9, 12.5, 15), (8, 22, 1.0)),         # schwebt über dem Hof: Schiebedach schiebt sich auf (35,0–36,6)
    (37.4, (12.5, 22.5, 6.0), (7, 18, 2.0)),     # durch die offene Dachfläche in den Hof hinunter
    (38.6, (13.8, 27.2, 2.1), (6, 18.5, 2.2)),   # Hof in Augenhöhe: Essplätze, Oliven, Rückseite der Moschee
    (40.0, (11.5, 26.2, 2.0), (5, 17.5, 2.2)),
    (41.0, (11, 24.5, 13), (20, 12, 2.0)),       # senkrecht aus dem Hof hinaus
    (42.6, (26, 9, 15), (37, 6, 0.0)),           # über die Parkfläche: Markierungen, Wohnwagen
    (43.8, (40, -6, 4.5), (44, 1.5, 1.2)),       # tief an Zaun + Schiebetor
    (45.8, (45.5, -6.4, 4.0), (45, 1.5, 1.0)),   # Tor öffnet …
    (47.8, (47, -6, 4.2), (44, 2, 1.2)),         # … und schließt
    (49.2, (37, 5.2, 34), (37, 6.2, 0.0)),       # senkrecht von oben über den Wohnwagen
    (50.6, (31, 4.6, 32), (31, 6.0, 0.0)),
    (53.0, (22, -19, 54), (23, 13, 0.0)),        # Schluss (Ayman 23.11.): ganzes Grundstück von vorn oben, Hof sichtbar
    (60.0, (25, -23, 59), (24, 14, 0.0)),        # ruhig, Dach bleibt zu
]
START = {
    'A': [(0.0, (33, -3.6, 2.0), (16.9, -8.9, 5.0)), (1.8, (26, -3.8, 7.5), (11, 5, 2.5)), (3.0, (25, -14, 15), (9, 5, 0.0))],
    'B': [(0.0, (9, 5, 64), (9, 9, 0.0)), (1.8, (12, -3, 26), (13, 5, 0.0)), (3.4, (15, -5.8, 1.6), (15, 3, 4.2))],   # Ayman 23.11.: von oben herab bis zum Eingang
}
def XU(x):
    """Kamera-x vom alten Plan (Moschee 16,5 m, Parken bis 25,5) auf den neuen (Moschee 20 m, Parken bis 29) umrechnen."""
    if 0 <= x <= 16.5:
        return x * BT / 16.5
    if 16.5 < x <= 25.5:
        return x + (BT - 16.5)
    if 25.5 < x <= 50:
        return 29.0 + (x - 25.5) * (50 - 29.0) / (50 - 25.5)
    return x


def umrechnen(keys):
    return [(t, (XU(p[0]), p[1], p[2]), (XU(z[0]), z[1], z[2])) if not (43.0 <= t <= 48.5) else (t, p, z) for t, p, z in keys]


GEMEINSAM = umrechnen(GEMEINSAM)
START = {k: umrechnen(v) for k, v in START.items()}
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
sc.camera = bpy.data.objects['Drohne_B']      # Aymans Wahl (19.11.)

bpy.ops.wm.save_as_mainfile(filepath=os.path.join(HERE, 'neubau.blend'), relative_remap=True)
print('Animation gespeichert, END_STAGE =', END_STAGE, '| Aufbau-Modifier:', sum(1 for o in bpy.data.objects if o.modifiers.get('Aufbau')))
