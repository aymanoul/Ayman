#!/usr/bin/env python3
"""Die zwei Hauptpersonen in Blender – komplett per Code gebaut (bpy 5.2, kein KI-Generator), ohne Augen.

    .venv-blender/bin/python blender/figuren.py            → blender/figuren.blend

Vier Sammlungen, jede eine fertige Figur mit eigenem Skelett:
    A_Qamis · A_Hemd · B_Qamis · B_Hemd
Die Figur schaut in Ruhe nach −Y, ihre linke Seite ist +X, die Füße stehen auf z = 0. Maße in Metern.

Skelett (Knochen): Huefte, Bauch, Brust, Hals, Kopf, Oberarm.L/R, Unterarm.L/R, Hand.L/R,
Oberschenkel.L/R, Unterschenkel.L/R, Fuss.L/R.  Alle Knochen sind so ausgerichtet, dass ihre lokale X-Achse
die Welt-X-Achse ist:  Drehung um X  → Rumpf/Kopf: + = nach vorn beugen · Arme/Beine: + = nach hinten, − = nach vorn.
Posen setzt `pose(skelett, {'Oberarm.R': (-30, 0, 0), …})` in Grad.
"""
import math
import os
import sys
import bpy            # zuerst bpy, erst danach sind bmesh und mathutils verfügbar
import bmesh
import numpy as np
from mathutils import Matrix, Vector

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import raum as R

X, Y, Z = Vector((1, 0, 0)), Vector((0, 1, 0)), Vector((0, 0, 1))
sm = lambda a, b, x: (lambda t: t * t * (3 - 2 * t))(min(1.0, max(0.0, (x - a) / (b - a))))    # weicher Übergang 0..1

# ------------------------------------------------------------------ Maße der Grundfigur (1,80 m)
J = {   # Gelenke
    'huefte': Vector((0, 0, 0.94)), 'bauch': Vector((0, 0, 1.08)), 'brust': Vector((0, 0, 1.30)), 'hals': Vector((0, 0, 1.50)),
    'kopf': Vector((0, 0, 1.585)), 'scheitel': Vector((0, 0, 1.80)),
    'schulter': Vector((0.19, 0, 1.465)), 'ellbogen': Vector((0.232, 0.01, 1.185)), 'handgelenk': Vector((0.262, -0.025, 0.93)), 'fingerspitze': Vector((0.272, -0.04, 0.75)),
    'bein': Vector((0.09, 0, 0.94)), 'knie': Vector((0.09, 0, 0.50)), 'knoechel': Vector((0.09, 0.01, 0.085)), 'zehe': Vector((0.09, -0.17, 0.02)),
}
HEAD_C, HEAD_R = Vector((0, -0.004, 1.69)), Vector((0.077, 0.096, 0.112))
# Rumpf-Querschnitte: (z, halbe Breite, halbe Tiefe, Mitte y)
TORSO = [(0.86, 0.212, 0.158, 0.006), (0.94, 0.205, 0.152, 0.006), (1.08, 0.183, 0.132, 0.0), (1.25, 0.198, 0.138, -0.004), (1.37, 0.214, 0.136, -0.002),
         (1.42, 0.214, 0.126, 0.002), (1.455, 0.19, 0.112, 0.004), (1.488, 0.13, 0.092, 0.006), (1.508, 0.072, 0.074, 0.008)]
SKIRT = [(0.09, 0.285, 0.205, 0.006), (0.30, 0.268, 0.195, 0.006), (0.52, 0.245, 0.182, 0.006), (0.75, 0.224, 0.168, 0.006)]


def section(z, table):
    zs = [t[0] for t in table]
    return tuple(float(np.interp(z, zs, [t[k] for t in table])) for k in (1, 2, 3))


def front_y(x, z, table, off=0.0):
    rx, ry, cy = section(z, table)
    return cy - ry * math.sqrt(max(0.0, 1 - (x / rx) ** 2)) - off


# ------------------------------------------------------------------ Gewichte (welcher Knochen bewegt welchen Punkt)
def w_torso(co):
    z = co.z
    if z < 0.94:
        return {'Huefte': 1}
    if z < 1.08:
        t = sm(0.94, 1.08, z); return {'Huefte': 1 - t, 'Bauch': t}
    if z < 1.30:
        t = sm(1.08, 1.30, z); return {'Bauch': 1 - t, 'Brust': t}
    return {'Brust': 1}


def w_legs(co, hip_top=0.94, hip_blend=0.16):
    """Rock des Qamis und Hosenbeine: links/rechts nach x, oben/unten am Knie, zur Hüfte hin weich."""
    l = sm(-0.07, 0.07, co.x)
    k = sm(0.42, 0.58, co.z)                                # 0 = Unterschenkel, 1 = Oberschenkel
    w = {'Oberschenkel.L': l * k, 'Oberschenkel.R': (1 - l) * k, 'Unterschenkel.L': l * (1 - k), 'Unterschenkel.R': (1 - l) * (1 - k)}
    h = sm(hip_top - hip_blend, hip_top, co.z)
    w = {b: v * (1 - h) for b, v in w.items()}
    w['Huefte'] = h
    return w


def w_qamis(co):
    """Der Rock des Qamis folgt den Beinen nur zur Hälfte – sonst bauscht er beim Gehen auf."""
    if co.z >= 0.94:
        return w_torso(co)
    w = {b: v * 0.5 for b, v in w_legs(co).items()}
    w['Huefte'] = w.get('Huefte', 0) + 0.5
    return w


def w_arm(s):
    sgn = 1 if s == 'L' else -1
    sh, el = mirror(J['schulter'], sgn), mirror(J['ellbogen'], sgn)
    d_up = (el - sh).normalized()

    def fn(co):
        a = (co - sh).dot(d_up)                             # Abstand von der Schulter entlang des Oberarms
        e = (co - el).dot(d_up)
        t = sm(-0.06, 0.06, e)
        w = {f'Oberarm.{s}': 1 - t, f'Unterarm.{s}': t}
        c = 1 - sm(-0.02, 0.07, a)                          # ganz oben hält die Brust mit
        return {**{b: v * (1 - 0.6 * c) for b, v in w.items()}, 'Brust': 0.6 * c}
    return fn


fixed = lambda bone: (lambda co: {bone: 1})
mirror = lambda v, sgn: Vector((v.x * sgn, v.y, v.z))


def w_neck(co):
    t = sm(1.50, 1.60, co.z)
    return {'Hals': 1 - t, 'Kopf': t} if co.z > 1.50 else {'Brust': 1 - sm(1.46, 1.50, co.z), 'Hals': sm(1.46, 1.50, co.z)}


# ------------------------------------------------------------------ Netze
def skin_object(name, verts, faces, mat, F, weight_fn, uvs=None, subsurf=1, smooth=True):
    """Netz anlegen, Normalen ausrichten, an das Skelett hängen (Gewichte), glätten."""
    me = bpy.data.meshes.new(name)
    me.from_pydata([tuple(v) for v in verts], [], faces)
    if uvs:
        layer = me.uv_layers.new(name='UV')
        for p, fuv in zip(me.polygons, uvs):
            for li, t in zip(p.loop_indices, fuv):
                layer.data[li].uv = t
    bm = bmesh.new(); bm.from_mesh(me)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(me); bm.free()
    me.materials.append(mat)
    for p in me.polygons:
        p.use_smooth = smooth
    ob = bpy.data.objects.new(name, me)
    F['coll'].objects.link(ob)
    groups = {}
    for v in me.vertices:
        w = weight_fn(v.co)
        tot = sum(w.values()) or 1
        for b, x in w.items():
            if x > 1e-4:
                groups.setdefault(b, ob.vertex_groups.new(name=b)).add([v.index], x / tot, 'REPLACE')
    ob.parent = F['arm']
    md = ob.modifiers.new('Skelett', 'ARMATURE'); md.object = F['arm']
    if subsurf:
        ss = ob.modifiers.new('Glaetten', 'SUBSURF'); ss.levels = 1; ss.render_levels = subsurf
    return ob


def loft(name, rings, mat, F, weight_fn, seg=20, cap0=False, cap1=False, arc=None, subsurf=2, uv=False):
    """Schlauch aus Ringen. Ring = (Mitte, Achse u, Achse v, Radius u, Radius v). arc = (Winkel von, bis) für offene Streifen."""
    closed = arc is None
    n = seg if closed else seg + 1
    angs = [2 * math.pi * k / seg for k in range(seg)] if closed else list(np.linspace(arc[0], arc[1], n))
    verts = [c + u * (ru * math.cos(a)) + v * (rv * math.sin(a)) for c, u, v, ru, rv in rings for a in angs]
    faces, uvs = [], []
    m = len(rings)
    for i in range(m - 1):
        for k in range(n if closed else n - 1):
            k2 = (k + 1) % n
            faces.append((i * n + k, i * n + k2, (i + 1) * n + k2, (i + 1) * n + k))
            uvs.append([(k / seg * 3, i / (m - 1)), ((k + 1) / seg * 3, i / (m - 1)), ((k + 1) / seg * 3, (i + 1) / (m - 1)), (k / seg * 3, (i + 1) / (m - 1))])
    if cap0 and closed:
        faces.append(tuple(range(n - 1, -1, -1))); uvs.append([(0, 0)] * n)
    if cap1 and closed:
        faces.append(tuple(range((m - 1) * n, m * n))); uvs.append([(0, 0)] * n)
    return skin_object(name, verts, faces, mat, F, weight_fn, uvs=uvs if uv else None, subsurf=subsurf)


hring = lambda z, rx, ry, cy=0.0, cx=0.0: (Vector((cx, cy, z)), X, Y, rx, ry)           # waagerechter Ring


def tube_along(points, radii):
    """Ringe entlang einer Linie (für Ärmel, Arme, Beine): radii = [(ru, rv), …] je Punkt."""
    rings = []
    for i, p in enumerate(points):
        d = (points[min(i + 1, len(points) - 1)] - points[max(i - 1, 0)]).normalized()
        u = (X - d * X.dot(d)).normalized()
        v = d.cross(u)
        rings.append((p, u, v, radii[i][0], radii[i][1]))
    return rings


def blob(name, size, loc, mat, F, bone, shape=None, subsurf=2, rot=None):
    """Abgerundeter Quader (Schuh, Hand …): Würfel + Glätten; shape(v) verformt die Ecken."""
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.subdivide_edges(bm, edges=bm.edges[:], cuts=1, use_grid_fill=True)
    for v in bm.verts:
        v.co = Vector((v.co.x * size[0], v.co.y * size[1], v.co.z * size[2]))
        if shape:
            shape(v.co)
        if rot:
            v.co = rot @ v.co
        v.co += Vector(loc)
    verts = [v.co.copy() for v in bm.verts]
    faces = [tuple(v.index for v in f.verts) for f in bm.faces]
    bm.free()
    return skin_object(name, verts, faces, mat, F, fixed(bone), subsurf=subsurf)


def patch(name, x0, x1, z0, z1, off, mat, F, table=TORSO, nx=3, nz=6, wfn=None):
    """Stoffstück, das der Rumpf-Oberfläche folgt (Knopfleiste, Brusttasche)."""
    xs, zs = np.linspace(x0, x1, nx), np.linspace(z0, z1, nz)
    verts = [Vector((x, front_y(x, z, table, off), z)) for z in zs for x in xs]
    faces = [(j * nx + i, j * nx + i + 1, (j + 1) * nx + i + 1, (j + 1) * nx + i) for j in range(nz - 1) for i in range(nx - 1)]
    return skin_object(name, verts, faces, mat, F, wfn or w_torso, subsurf=1)


# ------------------------------------------------------------------ Kopf: Form und Bereiche (Haare, Bart)
def head_point(n, off=0.0):
    """Punkt auf dem Kopf zur Richtung n (Einheitsvektor: −y = Gesicht, +z = oben), off = Abstand nach außen."""
    d = -n.z if n.z < 0 else 0.0
    fx = 1 - 0.30 * d ** 1.6                                 # Kiefer wird nach unten schmaler
    fy = 1 - (0.42 * d ** 1.3 if n.y > 0 else 0.10 * d ** 2)   # Hinterkopf läuft zum Nacken ein
    p = Vector((HEAD_R.x * n.x * fx, HEAD_R.y * n.y * fy, HEAD_R.z * n.z))
    nd = Vector((n.x / HEAD_R.x, n.y / HEAD_R.y, n.z / HEAD_R.z)).normalized()
    return HEAD_C + p + nd * off


NI, NJ = 48, 30


def head_grid(region, off, shift=None):
    """Teil der Kopf-Oberfläche als Netz: alle Felder, deren Mitte in `region(n)` liegt, um `off` nach außen versetzt."""
    dirs = [[Vector((math.sin(th) * math.cos(ph), math.sin(th) * math.sin(ph), math.cos(th)))
             for ph in (2 * math.pi * i / NI for i in range(NI))] for th in (math.pi * j / NJ for j in range(NJ + 1))]
    idx, verts, faces = {}, [], []

    def vid(j, i):
        i = 0 if j in (0, NJ) else i % NI                    # am Pol nur ein Punkt
        if (j, i) not in idx:
            n = dirs[j][i]
            p = head_point(n, off(n) if callable(off) else off)
            if shift:
                p = p + shift(n)
            idx[(j, i)] = len(verts); verts.append(p)
        return idx[(j, i)]
    for j in range(NJ):
        for i in range(NI):
            c = (dirs[j][i] + dirs[j][(i + 1) % NI] + dirs[j + 1][i] + dirs[j + 1][(i + 1) % NI]).normalized()
            if region(c):
                q = [vid(j, i), vid(j, i + 1), vid(j + 1, i + 1), vid(j + 1, i)]
                q = list(dict.fromkeys(q))                    # an den Polen fallen Ecken zusammen
                if len(q) >= 3:
                    faces.append(tuple(q))
    return verts, faces


hairline = lambda n: n.z > float(np.interp(n.y, [-1, -0.45, -0.05, 0.35, 1], [0.60, 0.42, -0.02, -0.46, -0.52]))
sideburn = lambda n: abs(n.x) > 0.70 and -0.34 < n.y < 0.02 and -0.42 < n.z < 0.2


def beard_long(n):       # A: voller, langer Bart mit Schnurrbart – nur vorn und an den Seiten, nicht am Hinterkopf
    mous = n.y < -0.72 and abs(n.x) < 0.42 and -0.40 < n.z < -0.26
    jaw = n.y < 0.0 and n.z < float(np.interp(n.y, [-1, -0.75, -0.35, 0.0], [-0.40, -0.38, -0.24, -0.16]))
    return mous or jaw or (sideburn(n) and n.y < -0.02)


def beard_short(n):      # B: kurzer, gepflegter Bart entlang des Kiefers, Kinn und Schnurrbart
    jaw = n.y < 0.12 and n.z < float(np.interp(n.y, [-1, -0.55, -0.1, 0.12], [-0.50, -0.56, -0.40, -0.2]))
    mous = n.y < -0.70 and abs(n.x) < 0.40 and -0.36 < n.z < -0.25
    link = n.y < -0.55 and 0.27 < abs(n.x) < 0.43 and -0.52 < n.z < -0.25
    return jaw or mous or link or sideburn(n)


def tex_kufi():
    S = 256
    yy, xx = np.mgrid[0:S, 0:S]
    u = (xx % 32) / 32 - 0.5; v = (yy % 32) / 32 - 0.5
    hole = (np.abs(u) + np.abs(v) < 0.2) | ((np.abs(u) > 0.42) & (np.abs(v) > 0.42))
    a = np.ones((S, S, 3)) * 0.97
    a[hole] = (0.74, 0.74, 0.76)
    a[(yy % 64) < 5] = (0.86, 0.86, 0.87)
    return R.save_image('kufi', a)


# ------------------------------------------------------------------ Skelett
def armature(name, coll, loc):
    ad = bpy.data.armatures.new(name)
    ob = bpy.data.objects.new(name, ad)
    coll.objects.link(ob)
    ob.location = loc
    ad.display_type = 'STICK'
    bpy.context.view_layer.objects.active = ob
    bpy.ops.object.mode_set(mode='EDIT')
    eb = {}

    def bone(nm, head, tail, parent=None):
        b = ad.edit_bones.new(nm)
        b.head, b.tail = head, tail
        b.align_roll(X.cross((Vector(tail) - Vector(head)).normalized()))      # lokale X-Achse = Welt-X
        if parent:
            b.parent = eb[parent]
        eb[nm] = b
    bone('Huefte', J['huefte'], J['bauch'])
    bone('Bauch', J['bauch'], J['brust'], 'Huefte')
    bone('Brust', J['brust'], J['hals'], 'Bauch')
    bone('Hals', J['hals'], J['kopf'], 'Brust')
    bone('Kopf', J['kopf'], J['scheitel'], 'Hals')
    for s, sgn in (('L', 1), ('R', -1)):
        m = lambda k: mirror(J[k], sgn)
        bone(f'Oberarm.{s}', m('schulter'), m('ellbogen'), 'Brust')
        bone(f'Unterarm.{s}', m('ellbogen'), m('handgelenk'), f'Oberarm.{s}')
        bone(f'Hand.{s}', m('handgelenk'), m('fingerspitze'), f'Unterarm.{s}')
        bone(f'Oberschenkel.{s}', m('bein'), m('knie'), 'Huefte')
        bone(f'Unterschenkel.{s}', m('knie'), m('knoechel'), f'Oberschenkel.{s}')
        bone(f'Fuss.{s}', m('knoechel'), m('zehe'), f'Unterschenkel.{s}')
    bpy.ops.object.mode_set(mode='OBJECT')
    for pb in ob.pose.bones:
        pb.rotation_mode = 'XYZ'
    return ob


def pose(arm, rots):
    """Pose setzen: {'Knochen': (x, y, z) in Grad}. Nicht genannte Knochen bleiben, wie sie sind."""
    for b, r in rots.items():
        arm.pose.bones[b].rotation_euler = [math.radians(a) for a in r]


def reset_pose(arm):
    for pb in arm.pose.bones:
        pb.rotation_euler = (0, 0, 0); pb.location = (0, 0, 0)


# ------------------------------------------------------------------ eine Figur bauen
def figure(key, who, outfit, loc, M):
    coll = R.collection(key)
    F = {'coll': coll, 'arm': armature(f'{key}_Skelett', coll, loc)}
    A = who == 'A'
    stoff = M['weiss'] if A else M['gruen']
    naht = M['weiss_naht'] if A else M['gruen_naht']
    knopf = M['knopf_hell'] if A else M['knopf_gruen']
    P = lambda s: f'{key}_{s}'

    # ---- Kopf, Hals, Ohren (glattes Gesicht: keine Augen, keine Brauen)
    hv, hf = head_grid(lambda n: True, 0.0)
    skin_object(P('Kopf'), hv, hf, M['haut'], F, fixed('Kopf'), subsurf=2)
    loft(P('Hals'), [hring(1.455, 0.06, 0.058, 0.012), hring(1.52, 0.052, 0.054, 0.012), hring(1.60, 0.05, 0.055, 0.006)], M['haut'], F, w_neck, seg=14)
    def nose_shape(v):
        if v.z > 0:
            v.x *= 0.55; v.y *= 0.6                         # oben schmal, unten breiter
    blob(P('Nase'), (0.03, 0.03, 0.05), (0, HEAD_C.y - HEAD_R.y * 0.93, HEAD_C.z - 0.012), M['haut'], F, 'Kopf', nose_shape)
    for s in (-1, 1):
        blob(P(f'Ohr_{"L" if s > 0 else "R"}'), (0.016, 0.03, 0.058), (s * 0.077, 0.012, 1.683), M['haut'], F, 'Kopf',
             rot=Matrix.Rotation(math.radians(-12 * s), 3, 'Z') @ Matrix.Rotation(math.radians(8), 3, 'X'))

    # ---- Haare und Bart
    rng = np.random.default_rng(7 if A else 11)
    if A:
        hv, hf = head_grid(lambda n: hairline(n) or sideburn(n), 0.006)
        skin_object(P('Haare'), hv, hf, M['haar'], F, fixed('Kopf'), subsurf=1)

        def lang(n):                                        # der Bart hängt vom Kinn nach unten und etwas nach vorn
            g = max(0.0, (-n.z - 0.25) / 0.75) * max(0.0, (0.35 - n.y) / 1.35)
            return Vector((0, -0.02 * g, -0.075 * g))
        hv, hf = head_grid(beard_long, lambda n: 0.012 + 0.004 * rng.random(), lang)
        skin_object(P('Bart'), hv, hf, M['haar'], F, fixed('Kopf'), subsurf=2)
        # Kufi: gerader Rand, flach gewölbter Deckel, durchbrochenes Muster
        zb = HEAD_C.z + 0.33 * HEAD_R.z
        kr = 1.035
        rings = [hring(zb, HEAD_R.x * kr, HEAD_R.y * kr, HEAD_C.y), hring(zb + 0.045, HEAD_R.x * kr, HEAD_R.y * kr, HEAD_C.y)]
        for t in np.linspace(0.25, 1.0, 5):
            a = t * math.pi / 2
            rings.append(hring(zb + 0.045 + 0.042 * math.sin(a), HEAD_R.x * kr * max(math.cos(a), 0.03), HEAD_R.y * kr * max(math.cos(a), 0.03), HEAD_C.y))
        loft(P('Kufi'), rings, M['kufi'], F, fixed('Kopf'), seg=24, uv=True)
    else:
        hv, hf = head_grid(lambda n: hairline(n), 0.012)
        skin_object(P('Haare_Ansatz'), hv, hf, M['haar'], F, fixed('Kopf'), subsurf=1)
        hv, hf = head_grid(beard_short, 0.0055)
        skin_object(P('Bart'), hv, hf, M['haar'], F, fixed('Kopf'), subsurf=1)
        bm = bmesh.new()                                    # Locken: viele kleine Kugeln auf der Kopfhaut
        k = 0
        while k < 300:
            n = Vector(rng.normal(size=3)).normalized()
            if not hairline(n) or (n.z < 0.1 and n.y < -0.2):
                continue
            k += 1
            c = head_point(n, 0.01 + 0.012 * rng.random() + 0.008 * max(n.z, 0))
            r = 0.015 + 0.009 * rng.random()
            bmesh.ops.create_icosphere(bm, subdivisions=1, radius=r, matrix=Matrix.Translation(c))
        verts = [v.co.copy() for v in bm.verts]; faces = [tuple(v.index for v in f.verts) for f in bm.faces]
        bm.free()
        skin_object(P('Locken'), verts, faces, M['haar'], F, fixed('Kopf'), subsurf=1)

    # ---- Hände und Handgelenke
    for s, sgn in (('L', 1), ('R', -1)):
        wr, tip, el = mirror(J['handgelenk'], sgn), mirror(J['fingerspitze'], sgn), mirror(J['ellbogen'], sgn)
        d = (tip - wr).normalized()
        loft(P(f'Handgelenk_{s}'), tube_along([wr + (el - wr) * 0.35, wr, wr + d * 0.02], [(0.03, 0.033), (0.026, 0.03), (0.024, 0.03)]), M['haut'], F, fixed(f'Unterarm.{s}'), seg=10)

        def hand_shape(v):
            if v.z < 0:
                v.x *= 0.72; v.y *= 0.86                    # Finger schmaler als die Handfläche
        c = wr + d * 0.092
        blob(P(f'Hand_{s}'), (0.032, 0.08, 0.16), c, M['haut'], F, f'Hand.{s}', hand_shape)
        blob(P(f'Daumen_{s}'), (0.024, 0.026, 0.075), wr + d * 0.075 + Vector((-0.006 * sgn, -0.05, 0)), M['haut'], F, f'Hand.{s}',
             rot=Matrix.Rotation(math.radians(18), 3, 'X'))

    # ---- Kleidung
    def sleeves(cuff):
        for s, sgn in (('L', 1), ('R', -1)):
            sh, el, wr = (mirror(J[k], sgn) for k in ('schulter', 'ellbogen', 'handgelenk'))
            pts = [sh + Vector((-0.045 * sgn, 0, -0.04)), sh + (el - sh) * 0.1 + Vector((-0.004 * sgn, 0, -0.012)), sh + (el - sh) * 0.5, el, el + (wr - el) * 0.5, el + (wr - el) * 0.86, el + (wr - el) * 0.97]
            rad = [(0.052, 0.06), (0.06, 0.068), (0.06, 0.066), (0.057, 0.06), (0.052, 0.055), (0.048, 0.05), (0.046, 0.048)]
            loft(P(f'Aermel_{s}'), tube_along(pts, rad), stoff, F, w_arm(s), seg=14, cap0=True)
            if cuff:
                a, b = el + (wr - el) * 0.84, el + (wr - el) * 0.985
                loft(P(f'Manschette_{s}'), tube_along([a, (a + b) / 2, b], [(0.053, 0.055)] * 3), naht, F, fixed(f'Unterarm.{s}'), seg=14)
                cyl_button(P(f'Manschettenknopf_{s}'), (a + b) / 2 + Vector((0.056 * sgn, 0, 0)), 'x', knopf, F, f'Unterarm.{s}')

    def cyl_button(name, loc, axis, mat, F, bone=None, r=0.0068):
        bm = bmesh.new()
        rot = Matrix.Rotation(math.pi / 2, 4, 'X') if axis == 'y' else Matrix.Rotation(math.pi / 2, 4, 'Y')
        bmesh.ops.create_cone(bm, cap_ends=True, segments=10, radius1=r, radius2=r, depth=0.005, matrix=Matrix.Translation(loc) @ rot)
        verts = [v.co.copy() for v in bm.verts]; faces = [tuple(v.index for v in f.verts) for f in bm.faces]
        bm.free()
        return skin_object(name, verts, faces, mat, F, fixed(bone) if bone else w_torso, subsurf=0, smooth=False)

    def front_details(z_bottom, n_buttons, table=TORSO):
        patch(P('Knopfleiste'), -0.017, 0.017, z_bottom, 1.492, 0.004, naht, F, table, nx=3, nz=10)
        for i, z in enumerate(np.linspace(1.468, z_bottom + 0.04, n_buttons)):
            cyl_button(P(f'Knopf_{i + 1}'), Vector((0, front_y(0, z, table, 0.008), z)), 'y', knopf, F)
        patch(P('Brusttasche'), 0.062, 0.148, 1.235, 1.335, 0.0035, naht, F, table, nx=3, nz=3)

    if outfit == 'Qamis':
        rings = [hring(z, rx, ry, cy) for z, rx, ry, cy in SKIRT + TORSO[1:]]
        loft(P('Qamis'), rings, stoff, F, w_qamis, seg=24)
        sleeves(False)
        loft(P('Stehkragen'), [hring(1.497, 0.07, 0.072, 0.008), hring(1.522, 0.064, 0.067, 0.009), hring(1.545, 0.061, 0.065, 0.009)], naht, F, w_neck, seg=18, arc=(-math.pi / 2 + 0.16, 1.5 * math.pi - 0.16), subsurf=1)
        front_details(1.19, 4)
        for s, sgn in (('L', 1), ('R', -1)):                 # Beine unter dem Qamis (weite Unterhose in Stofffarbe)
            hp, kn, an = (mirror(J[k], sgn) for k in ('bein', 'knie', 'knoechel'))
            loft(P(f'Bein_{s}'), tube_along([hp, kn, an + Vector((0, 0, 0.03))], [(0.085, 0.095), (0.07, 0.075), (0.06, 0.065)]), stoff, F, w_legs, seg=10)
        shoe_mat, sole_mat, sneaker = M['schuh'], M['schuh_sohle'], False
    else:
        rings = [hring(z, rx, ry, cy) for z, rx, ry, cy in TORSO]
        loft(P('Hemd'), rings, stoff, F, w_torso, seg=24)
        sleeves(True)
        loft(P('Kragen_Steg'), [hring(1.497, 0.068, 0.07, 0.008), hring(1.535, 0.061, 0.065, 0.009)], stoff, F, w_neck, seg=18, arc=(-math.pi / 2 + 0.2, 1.5 * math.pi - 0.2), subsurf=1)
        loft(P('Kragen'), [hring(1.537, 0.063, 0.067, 0.009), hring(1.515, 0.082, 0.084, 0.006), hring(1.488, 0.094, 0.094, 0.004)], naht, F, w_neck, seg=18, arc=(-math.pi / 2 + 0.26, 1.5 * math.pi - 0.26), subsurf=1)
        front_details(0.875, 7)
        hose = M['hose_schwarz'] if A else M['hose_creme']
        loft(P('Hose_Bund'), [hring(1.03, 0.176, 0.126, 0.0), hring(0.94, 0.2, 0.148, 0.006), hring(0.83, 0.203, 0.15, 0.006), hring(0.79, 0.19, 0.14, 0.006)], hose, F, lambda co: w_legs(co, 0.90, 0.12), seg=20, cap1=True)
        for s, sgn in (('L', 1), ('R', -1)):
            hp, kn, an = (mirror(J[k], sgn) for k in ('bein', 'knie', 'knoechel'))
            pts = [hp + Vector((0.008 * sgn, 0.004, -0.06)), hp + Vector((0.01 * sgn, 0.004, -0.2)), kn + Vector((0.008 * sgn, 0, 0)), an + Vector((0.005 * sgn, -0.005, 0.2)), an + Vector((0.005 * sgn, -0.01, -0.015))]
            rad = [(0.1, 0.118), (0.1, 0.116), (0.094, 0.108), (0.092, 0.106), (0.094, 0.11)]
            loft(P(f'Hosenbein_{s}'), tube_along(pts, rad), hose, F, lambda co: w_legs(co, 0.90, 0.12), seg=14)
        shoe_mat, sole_mat, sneaker = M['sneaker'], M['sneaker_sohle'], True

    # ---- Schuhe
    for s, sgn in (('L', 1), ('R', -1)):
        def shoe_shape(v, sn=sneaker):
            if v.y < 0 and v.z > 0:
                v.z *= 0.55 if not sn else 0.62             # Schuhspitze flacher
            if v.y < 0:
                v.x *= 0.9
        h = 0.10 if sneaker else 0.085
        blob(P(f'Schuh_{s}'), (0.1 if sneaker else 0.094, 0.285 if sneaker else 0.275, h), (0.09 * sgn, -0.055, 0.02 + h / 2), shoe_mat, F, f'Fuss.{s}', shoe_shape)
        blob(P(f'Sohle_{s}'), (0.104 if sneaker else 0.097, 0.292 if sneaker else 0.28, 0.03 if sneaker else 0.02), (0.09 * sgn, -0.055, 0.015 if sneaker else 0.01), sole_mat, F, f'Fuss.{s}', subsurf=1)
    if not A:
        F['arm'].scale = (0.985, 0.985, 0.985)               # B ist etwas kleiner
    return F


def build():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    mat = R.material
    M = {
        'haut': mat('Haut', '#d9a57e', 0.6), 'haar': mat('Haar', '#0d0d0e', 0.85),
        'weiss': mat('Stoff_weiss', '#f3f2ee', 0.85), 'weiss_naht': mat('Stoff_weiss_Naht', '#e4e3df', 0.85),
        'gruen': mat('Stoff_gruen', '#1c2c22', 0.85), 'gruen_naht': mat('Stoff_gruen_Naht', '#15231a', 0.85),
        'hose_schwarz': mat('Hose_schwarz', '#161617', 0.85), 'hose_creme': mat('Hose_creme', '#e0d6c3', 0.85),
        'knopf_hell': mat('Knopf_hell', '#dcdad2', 0.35), 'knopf_gruen': mat('Knopf_gruen', '#15241b', 0.35),
        'schuh': mat('Schuh_schwarz', '#121213', 0.35), 'schuh_sohle': mat('Schuh_Sohle', '#0a0a0a', 0.7),
        'sneaker': mat('Sneaker_weiss', '#f4f4f2', 0.55), 'sneaker_sohle': mat('Sneaker_Sohle', '#e6e6e2', 0.7),
    }
    M['kufi'] = R.image_material('Kufi', tex_kufi(), 0.8)
    figs = {}
    for i, (key, who, outfit) in enumerate([('A_Qamis', 'A', 'Qamis'), ('A_Hemd', 'A', 'Hemd'), ('B_Qamis', 'B', 'Qamis'), ('B_Hemd', 'B', 'Hemd')]):
        figs[key] = figure(key, who, outfit, ((i - 1.5) * 1.2, 0, 0), M)

    # ---- Studio: grauer Hintergrund, weiches Licht (für die Figurenblätter)
    S = R.collection('Studio')
    grau = mat('Studio_grau', '#6d6f73', 0.95)
    for nm, loc, e, size in [('Licht_vorn', (-2.5, -4.5, 3.6), 900, 3.0), ('Licht_seite', (5, -1.5, 2.6), 500, 3.0), ('Licht_hinten', (1.5, 5, 3.4), 600, 3.0), ('Licht_oben', (0, 0, 5), 300, 4.0)]:
        L = bpy.data.lights.new(nm, 'AREA'); L.energy = e; L.size = size
        o = bpy.data.objects.new(nm, L); o.location = loc
        o.rotation_euler = (Vector((0, 0, 1.1)) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler()
        S.objects.link(o)
    world = bpy.data.worlds.new('Studio_Welt'); world.use_nodes = True
    world.node_tree.nodes['Background'].inputs['Color'].default_value = (*R.lin(R.rgb('#6d6f73')), 1)
    world.node_tree.nodes['Background'].inputs['Strength'].default_value = 1.0
    scene.world = world
    cd = bpy.data.cameras.new('Kamera'); cd.lens = 70
    cam = bpy.data.objects.new('Kamera', cd); cam.location = (0, -6, 1.0)
    cam.rotation_euler = (math.pi / 2, 0, 0)
    S.objects.link(cam); scene.camera = cam
    r = scene.render
    r.engine = 'CYCLES'; r.resolution_x, r.resolution_y, r.fps = 1080, 1920, 30
    cy = scene.cycles
    cy.device = 'CPU'; cy.samples = 48; cy.use_adaptive_sampling = True; cy.adaptive_threshold = 0.05
    cy.use_denoising = True; cy.denoiser = 'OPENIMAGEDENOISE'; cy.max_bounces = 4
    scene.view_settings.view_transform = 'Standard'
    return figs


if __name__ == '__main__':
    build()
    bpy.ops.file.pack_all()
    out = os.path.join(HERE, 'figuren.blend')
    bpy.ops.wm.save_as_mainfile(filepath=out, compress=True)
    n = len([o for o in bpy.data.objects if o.type == 'MESH'])
    print(f'Gespeichert: {out} · {n} Teile · {len(bpy.data.materials)} Materialien')
