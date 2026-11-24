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
Kameras (Ayman 24.11.): Drohne_B 0–24 s, Rundgang_1 24–48 s, Rundgang_2 48–72 s (Schnitte per Zeitmarke), nie durch Gebäude.
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
sc.render.fps = FPS; sc.frame_start = 0; sc.frame_end = 72 * FPS          # Ayman 24.11.: 72 s (3 Higgsfield-Teile à 24 s)
sc['END_STAGE'] = END_STAGE
# Zeitplan 72 s (Ayman 24.11.): 0–24 s Start + Bau-Zeitraffer (gestrafft), 24–48 s Rundgang 1 (Eingang, Fassade, Solar, in den Hof),
# 48–72 s Rundgang 2 (sitzend im Hof, Parkplatz-Ecke mit Einparken, Schlussblick). Schnitte genau bei 24 s und 48 s
# (dort liegen auch die Higgsfield-Teilgrenzen). Die Bau-Zeiten unten sind in der ALTEN Zeitachse (bis 44 s) notiert und
# werden mit R() auf 0–24 s gestaucht; alles ab dem Rundgang verwendet FN (neue Zeit direkt).
BAU_ALT, BAU_NEU = 44.0, 24.0


def R(t):
    if t <= 3.4:
        return t
    if t <= BAU_ALT:
        return 3.4 + (t - 3.4) * (BAU_NEU - 3.4) / (BAU_ALT - 3.4)
    return BAU_NEU + (t - BAU_ALT)


F = lambda t: int(round(R(t) * FPS))        # Bau (alte Zeitachse, gestaucht)
FN = lambda t: int(round(t * FPS))          # Rundgang (neue Zeitachse)
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
HX0 = BT - 16.43    # Ayman 23.11.: Hof/Keller hinten nur 16,43 m breit (links Nachbarfläche) → Grube L-förmig
verbau = [(0, Y0, KZ - 0.05, BT, Y0 + D, 0.35), (HX0, YG - D, KZ - 0.05, BT, YG, 0.35),
          (0, Y0 + D, KZ - 0.05, D, Y1, 0.35), (0, Y1, KZ - 0.05, HX0 + D, Y1 + D, 0.35),
          (HX0, Y1 + D, KZ - 0.05, HX0 + D, YG - D, 0.35), (BT - D, Y0 + D, KZ - 0.05, BT, YG - D, 0.35)]
viele_quader('Verbau', verbau, HV, 'S1_Aushub')
# senkrechte Bohlen-Fugen als dünne dunklere Leisten
fugen = [(x, Y0 + D, KZ, x + 0.04, Y0 + D + 0.02, 0.3) for x in [0.6 + k * 0.9 for k in range(17)]]
fugen += [(x, YG - D - 0.02, KZ, x + 0.04, YG - D, 0.3) for x in [HX0 + 0.6 + k * 0.9 for k in range(14)]]
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
    x = HX0 + 0.4 + i * 0.28
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
gruppe(['Portal_Pfeiler*', 'Portal_Sturz', 'Portal_Glastuer', 'Portal_Feld_oben', 'Portal_Zwickel*', 'Portal_Sprossen', 'Portal_Bogen*',
        'Portal_Schlussstein', 'Portal_Tuergriffe', 'Portal_Wandleuchten*'], 16.6, 19.6, Z, 3)
gruppe(['Portal_Sturz_L', 'Portal_Glastuer_L', 'Portal_Feld_oben_L', 'Portal_Sprossen_L', 'Portal_Schlussstein_L', 'Portal_Tuergriffe_L'], 16.6, 19.6, Z, 3)   # zweites Portal links
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
aufbau(bpy.data.objects['Deckenleuchten'], 26.0, 26.4, Z, stufe=5)       # erst mit der Dachplatte (sonst schweben sie, Ayman 24.11.)
# Stufe 5 – Decke & PV-Dach
aufbau(bpy.data.objects['Dachplatte'], 25.0, 26.0, X, stufe=5)
gruppe('Attika?', 25.8, 27.0, Z, 5, 0.1)
gruppe(['Attika_Abdeckung', 'LED_Attika'], 26.6, 27.4, X, 5)
aufbau(bpy.data.objects['Dachkies'], 26.2, 27.2, X, stufe=5)
aufbau(bpy.data.objects['Gruendach'], 26.6, 28.2, X, stufe=5)
aufbau(bpy.data.objects['Gruendach_Bewuchs'], 26.8, 28.4, X, stufe=5)
gruppe(['PV_Gestell', 'PV_Module'], 27.4, 30.0, X, 5)
# Stufe 6 – Fertigstellung (Ayman 19.11.: Hof voller, länger zeigen; Wohnwagen auf den Plätzen; Zaun + Schiebetor deutlich)
# (23.11.: Vorplatz-Platte entfällt)
aufbau(bpy.data.objects['Hof_Boden'], 30.2, 31.0, Y, stufe=6)
gruppe(['Hofmauer_*'], 30.4, 31.2, Z, 6, 0.1)
gruppe(['Hof_Pflanzbeete', 'Hof_Beeterde'], 30.8, 31.6, Y, 6)
gruppe(['Hof_Busch*', 'Hof_Zypresse*'], 31.2, 32.4, Z, 6, 0.015)
gruppe(['Kuebel*', 'Olive*', 'Palme_*'], 31.6, 33.0, Z, 6, 0.03)
gruppe(['Tische*', 'Stuehle', 'Schirm*', 'Lounge_*', 'Aussenkueche*'], 32.2, 33.4, Z, 6, 0.04)
gruppe(['Hof_Wandleuchten*', 'Hof_Bodenstrahler', 'Hoftuer_Vordach'], 33.0, 33.6, Z, 6)
# Schiebedach über dem Hof (Ayman 20.11.): entsteht geschlossen (Regen), schiebt sich dann auf (Sonne)
# Ayman 24.11.: Hofdach wird NICHT aufgebaut – es ist auf einmal fertig da (zusammengeschoben), fährt zu und wieder auf
sch = bpy.data.objects['Hofdach_Schienen']
for o in obs('Hofdach_*'):
    if o.type == 'MESH':
        ZUGEWIESEN[o.name] = 18.6
        o.hide_render = True; o.keyframe_insert('hide_render', frame=0)
        o.hide_render = False; o.keyframe_insert('hide_render', frame=FN(18.6))
for t, v in ((0, 1.0), (18.9, 1.0), (19.8, 0.0), (20.1, 0.0), (21.0, 1.0)):
    sch['offen'] = v; sch.keyframe_insert('["offen"]', frame=FN(t))
gruppe(['Portal_Stufen', 'Portal_Stufen_L', 'Portal_Kuebel*', 'Portal_Zypresse*'], 30.2, 31.2, Z, 6)
gruppe(['Parken_Kuebel*', 'Parken_Thuja*'], 41.6, 42.4, Z, 6)
aufbau(bpy.data.objects['Parken_Belag'], 40.8, 41.6, X, stufe=6)
aufbau(bpy.data.objects['Wohnwagen_Belag'], 41.0, 41.8, X, stufe=6)
aufbau(bpy.data.objects['Markierungen'], 41.2, 42.4, X, stufe=6)
aufbau(bpy.data.objects['Parken_Radstopper'], 42.0, 42.4, Z, stufe=6)
aufbau(bpy.data.objects['Hecke'], 41.4, 42.6, X, stufe=6)
aufbau(bpy.data.objects['Parken_Hecke'], 41.0, 41.8, X, stufe=6)
aufbau(bpy.data.objects['Parken_Bordstein'], 40.9, 41.5, Y, stufe=6)
aufbau(bpy.data.objects['Wandleuchten_Brandwand'], 41.8, 42.4, X, stufe=6)
aufbau(bpy.data.objects['Wandleuchten_Brandwand_Glas'], 41.8, 42.4, X, stufe=6)
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


def _sichtbar_ab(teile, t, ff=None):
    ff = ff or F
    for o in teile:
        ZUGEWIESEN[o.name] = t
        o.hide_render = True; o.keyframe_insert('hide_render', frame=0)
        o.hide_render = False; o.keyframe_insert('hide_render', frame=ff(t))


for name, t0 in (('Auto4', 42.5), ('Auto1', 42.75)):     # die beiden schwarzen stehen schon
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
    if E.y - 3.2 > 1.9:
        weg = [Vector((x_start, yl)), Vector((31.6, yl))]
        weg += _bezier(Vector((31.6, yl)), Vector((29.2, yl)), Vector((xg, -0.6)), Vector((xg, 1.4)))[1:]
        weg += [Vector((xg, E.y - 3.2))]
        weg += _bezier(Vector((xg, E.y - 3.2)), Vector((xg, E.y - 1.6)), E - U * 0.9, E + U * 0.6)[1:]
    else:
        # vorderster Platz: direkt aus der Gasse in einem Bogen einparken (vorher fuhr das Auto kurz rueckwaerts).
        # Auf der Geraden bis x = 33 faehrt es zeitlich exakt wie frueher (alte Bilder bleiben gueltig).
        alt = [Vector((x_start, yl)), Vector((31.6, yl))]
        alt += _bezier(Vector((31.6, yl)), Vector((29.2, yl)), Vector((xg, -0.6)), Vector((xg, 1.4)))[1:]
        alt += [Vector((xg, E.y - 3.2))]
        alt += _bezier(Vector((xg, E.y - 3.2)), Vector((xg, E.y - 1.6)), E - U * 0.9, E + U * 0.6)[1:] + [ziel]
        L_alt = sum((a_ - b_).length for a_, b_ in zip(alt, alt[1:]))
        weg = [Vector((x_start, yl)), Vector((33.0, yl))]
        weg += _bezier(Vector((33.0, yl)), Vector((29.0, yl)), E - U * 2.6, E + U * 0.6)[1:]
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

    def s_herm(tau, L):                                                       # Hermite: Startgeschwindigkeit v0, Ende steht
        h10 = tau ** 3 - 2 * tau ** 2 + tau; h01 = -2 * tau ** 3 + 3 * tau ** 2
        return h10 * v0 * T + h01 * L

    if E.y - 3.2 > 1.9:
        s_von = lambda tau: s_herm(tau, Lw)
    else:
        S_GER = x_start - 33.0 - 0.5                                          # gemeinsamer gerader Teil
        tc = 0.0
        while s_herm(tc + 1e-3, L_alt) < S_GER:
            tc += 1e-3
        sc_ = s_herm(tc, L_alt); vc = (s_herm(tc + 1e-4, L_alt) - sc_) / 1e-4
        def s_von(tau):
            if tau <= tc:
                return s_herm(tau, L_alt)
            u = (tau - tc) / (1 - tc); m0 = vc * (1 - tc)
            h00 = 2 * u ** 3 - 3 * u ** 2 + 1; h10 = u ** 3 - 2 * u ** 2 + u; h01 = -2 * u ** 3 + 3 * u ** 2
            return h00 * sc_ + h10 * m0 + h01 * Lw
        print('einparken', name, 'gleich wie alt bis', round(t0 + tc * T, 3), 's')

    def bei(sv):
        sv = max(0.0, min(Lw, sv)); k = 0
        while k < len(sl) - 2 and sl[k + 1] < sv:
            k += 1
        f = (sv - sl[k]) / max(1e-6, sl[k + 1] - sl[k])
        return pts[k].lerp(pts[k + 1], f), k

    _sichtbar_ab(teile, t0, FN)
    RR = b['radius']; wb = b['radstand']; z = b.location.z
    raeder = [o for o in teile if o.name.endswith(('_vl', '_vr', '_hl', '_hr'))]
    gier_alt = None
    for fr in range(FN(t0), FN(t1) + 1):
        tau = (fr / FPS - t0) / T; sv = s_von(tau)
        p, k = bei(sv)
        d = pts[min(k + 1, len(pts) - 1)] - pts[max(k - 1, 0)]
        g = math.atan2(d.y, d.x) if d.length > 1e-6 else gier
        if fr == FN(t1):
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
            r.rotation_euler = (0, sv / RR, lenk if r.get('vorn') else 0.0)
            r.keyframe_insert('rotation_euler', frame=fr)
        gier_alt = g
    for o in teile:
        ad = o.animation_data
        for fc in (ad.action.fcurves if ad and ad.action and hasattr(ad.action, 'fcurves') else []):
            if fc.data_path in ('location', 'rotation_euler'):
                for kp in fc.keyframe_points:
                    kp.interpolation = 'LINEAR'


einparken('Auto3', 59.4, 64.8)                 # weißer Sportback → Platz 0 (an der Gasse) – im Parkplatz-Eckblick
einparken('Auto2', 61.4, 67.2)                 # grauer Kompakt → Platz 2

# (23.11.: fester Zaun entfällt – Schienen, Endpfosten und 3 Schiebeflügel kommen mit 'Schiebetor*')
gruppe(['Schiebetor', 'Schiebetor_*'], 43.2, 44.0, Z, 6)

# Schiebetor zeigen: öffnet und schließt (Warnleuchte blinkt dabei)
tor = bpy.data.objects['Schiebetor']
for t, v in ((0, 0.0), (67.4, 0.0), (68.7, 1.0), (70.2, 1.0), (71.5, 0.0)):      # im Schlussblick (neue Zeit)
    tor['offen'] = v; tor.keyframe_insert('["offen"]', frame=FN(t))
wl = bpy.data.materials['Warnleuchte_orange'].node_tree.nodes['Principled BSDF'].inputs['Emission Strength']
wl.default_value = 0.0; wl.keyframe_insert('default_value', frame=FN(0))
for a, b in ((67.2, 68.8), (70.0, 71.6)):
    t = a
    while t < b:
        wl.default_value = 6.0; wl.keyframe_insert('default_value', frame=FN(t))
        wl.default_value = 0.0; wl.keyframe_insert('default_value', frame=FN(t + 0.25))
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
    for t, v in ((0, 0.0), (21.5, 0.0), (23.0, st_an if an else 0.0)):
        b.default_value = v; b.keyframe_insert('default_value', frame=FN(t))
for lo in obs('Innenlicht*'):
    if lo.type == 'LIGHT':
        for t, v in ((0, 0.0), (21.5, 0.0), (23.0, 260.0 if an else 0.0)):
            lo.data.energy = v; lo.data.keyframe_insert('energy', frame=FN(t))
for lo in obs('Wandlicht_*', 'Parken_Strahler*'):                    # Wandleuchten Eingang/Glaswand + Thujen-Strahler (Ayman 23.11.)
    if lo.type == 'LIGHT':
        for t, v in ((0, 0.0), (21.5, 0.0), (23.0, lo.data.get('ziel_energie', 60.0) if an else 0.0)):
            lo.data.energy = v; lo.data.keyframe_insert('energy', frame=FN(t))
sonne = bpy.data.objects['Sonne'].data
for t, e, c in ((0, 4.8, (1.0, 0.88, 0.74)), (48.0, 4.8, (1.0, 0.88, 0.74)), (51.0, 4.8, (1.0, 0.86, 0.72))):   # Ayman 23.11.: hell bis zum Schluss, keine Dämmerung
    sonne.energy = e; sonne.color = c
    sonne.keyframe_insert('energy', frame=FN(t)); sonne.keyframe_insert('color', frame=FN(t))
bg = sc.world.node_tree.nodes['Background'].inputs['Strength']
for t, v in ((0, 0.3), (48.0, 0.3), (51.0, 0.3)):
    bg.default_value = v; bg.keyframe_insert('default_value', frame=FN(t))

# ------------------------------------------------------------------ Kameras (Ayman 24.11.: ästhetisch, nah, abwechslungsreich; 9:16)
# Drei Kameras, Wechsel per Zeitmarke (Schnitt) bei 24 s und 48 s. Je Schlüssel: (s, Position, Blickziel, Brennweite mm).
KAMERAS = {
    'Drohne_B': [                                               # 0–24 s: von oben herab zum (künftigen) Eingang, dann Bau-Zeitraffer im Bogen
        (0.0, (10.9, 5, 64), (10.9, 9, 0.0), 24), (1.8, (14.5, -3, 26), (15.8, 5, 0.0), 24), (3.4, (18.2, -5.8, 1.6), (18.2, 3, 4.2), 24),
        (5.5, (17, -8.5, 9.5), (10, 12, -1.5), 24),             # steigt auf, Blick in die Baugrube
        (8.3, (7, -10.5, 13.5), (9, 13, -1.5), 24),             # Keller mit Stützen
        (11.0, (-3.0, -5.5, 14.0), (9, 9, 2.5), 24),            # Erdgeschoss wächst (von links)
        (13.8, (4, -13, 19), (10, 8, 6), 24),                   # 1. Etage
        (16.5, (14, -5, 22), (10, 7, 9.5), 24),                 # Dach, Gründach, Solar Reihe für Reihe
        (19.0, (10, 7, 24), (12, 21, 0.0), 24),                 # Blick von oben in den entstehenden Hof
        (20.8, (12, 9, 22), (12, 22, 0.0), 24),                 # Hofdach schiebt sich auf
        (22.4, (34, -13, 25), (35, 6, 0.0), 24),                # Parkplatz, Autos, Wohnwagen setzen auf
        (24.0, (25, -14, 34), (27, 9, 0.0), 26),                # fertiges Grundstück im Überblick
    ],
    'Rundgang_1': [                                             # 24–48 s
        (24.0, (11.5, -5.8, 1.65), (18.6, 0.3, 3.2), 18),       # wie ein Mensch auf der Gasse, Blick zum Eingang
        (27.0, (14.6, -4.3, 1.65), (18.6, 0.3, 4.2), 18),       # langsam darauf zu …
        (29.5, (17.3, -2.75, 1.68), (18.6, 0.3, 6.0), 18),      # … und staunend den Bogen hinauf
        # 29,5–35,5 s: Schnitt in den Keller (Kamera „Keller“, gerendert aus festsaal.blend, tools/keller_clip.py)
        (35.5, (19.6, 2.4, 11.5), (8, 4.0, 10.2), 22),          # Schnitt aufs Dach: über der Attika, Blick über Gründach und Solar
        (37.0, (17.0, 4.0, 10.8), (5, 4.1, 10.2), 22),          # gleitet tief zwischen den Solarreihen entlang
        (39.2, (10.0, 4.0, 10.75), (0, 4.1, 10.2), 22),
        (41.4, (3.0, 4.0, 11.2), (7, 16, 8.5), 22),             # Ende der Reihe, dreht schon zum Hof
        (43.2, (4.8, 9.0, 14.0), (11, 21, 0.5), 22),            # hebt ab und dreht zum Hof
        (44.6, (6.5, 11.4, 13.4), (11.5, 22, 0.8), 22),
        (46.3, (8.8, 14.3, 7.5), (12.5, 25, 1.2), 21),          # sinkt durch das offene Hofdach
        (48.0, (12.6, 14.6, 2.4), (13.5, 27, 1.3), 20),
    ],
    'Rundgang_2': [                                             # 48–72 s
        (48.0, (15.6, 22.1, 1.24), (7.0, 26.2, 1.1), 20),       # sitzt am langen Teaktisch und schaut sich um: Lounge …
        (50.2, (15.6, 22.1, 1.24), (5.2, 20.5, 1.3), 20),      # … Schirme und runde Tische …
        (52.4, (15.6, 22.08, 1.25), (8.5, 13.2, 2.1), 20),     # … Olivenbäume …
        (54.5, (15.6, 22.05, 1.26), (13.5, 12.3, 2.4), 20),     # … durch die Glaswand in die Moschee
        (57.5, (15.0, 21.0, 15.0), (12.5, 19.5, 0.0), 24),      # steigt senkrecht aus dem Hof
        (59.6, (24.8, 11.5, 8.5), (22, 3, 0.5), 22),            # schwebt über den Parkplatz
        (61.2, (28.4, 11.2, 1.75), (21.0, 1.0, 2.0), 20),       # Ecke hinten am Parkplatz: Glaswand, Thujen, Eingang
        (66.4, (27.9, 10.5, 1.8), (21.5, 0.4, 2.3), 20),        # Autos parken ein (weiß, grau)
        (68.6, (30.0, 4.0, 12.5), (23, 8, 0.0), 24),            # hebt ab, Schiebetor öffnet
        (72.0, (60, -16, 38), (21, 12, 0.0), 26),               # Schluss: ganzes Grundstück schräg von vorn rechts oben (passt ins Hochformat)
    ],
}
WECHSEL = [(0.0, 'Drohne_B'), (24.0, 'Rundgang_1'), (48.0, 'Rundgang_2')]
for name, keys in KAMERAS.items():
    cd = bpy.data.cameras.new(name); cd.sensor_width = 36; cd.clip_end = 2000
    cam = bpy.data.objects.new(name, cd); sc.collection.objects.link(cam)
    ziel = bpy.data.objects.new('Blickziel_' + name, None); sc.collection.objects.link(ziel)
    con = cam.constraints.new('TRACK_TO'); con.target = ziel; con.track_axis = 'TRACK_NEGATIVE_Z'; con.up_axis = 'UP_Y'
    for t, p, z, mm in keys:
        cam.location = p; cam.keyframe_insert('location', frame=FN(t))
        ziel.location = z; ziel.keyframe_insert('location', frame=FN(t))
        cd.lens = mm; cd.keyframe_insert('lens', frame=FN(t))
    for idb in (cam, ziel, cd):
        ad = idb.animation_data
        for fc in (ad.action.fcurves if ad and ad.action and hasattr(ad.action, 'fcurves') else []):
            for kp in fc.keyframe_points:
                kp.interpolation = 'BEZIER'; kp.handle_left_type = kp.handle_right_type = 'AUTO_CLAMPED'
for t, name in WECHSEL:
    m = sc.timeline_markers.new(f'Schnitt_{name}', frame=FN(t)); m.camera = bpy.data.objects[name]
sc['kamera_wechsel'] = ';'.join(f'{FN(t)}:{n}' for t, n in WECHSEL)          # „Bild:Kamera;…“
sc.camera = bpy.data.objects['Drohne_B']
sc['keller_von'], sc['keller_bis'] = FN(29.5), FN(35.5)       # Kellerfahrt (Ayman 24.11.)

bpy.ops.wm.save_as_mainfile(filepath=os.path.join(HERE, 'neubau.blend'), relative_remap=True)
print('Animation gespeichert, END_STAGE =', END_STAGE, '| Aufbau-Modifier:', sum(1 for o in bpy.data.objects if o.modifiers.get('Aufbau')))
