#!/usr/bin/env python3
"""Gebetsraum der Masjid As-Sunnah Ratingen – komplett per Code in Blender gebaut (bpy 5.2, kein KI-Generator).

    .venv-blender/bin/python blender/raum.py            → blender/gebetsraum.blend

Achsen (Blender): X nach rechts (wenn man zur Qibla schaut), Y nach vorn zur Qibla-Wand (y = +6), Z nach oben.
Umrechnung aus dem Three.js-Projekt: Blender (x, y, z) = Three (x, −z, y).  Maße in Metern.

Aufbau in Sammlungen: Raum (Boden, Wände, Decke) · Fenster · Mihrab · Saeulen · Tuer · Einrichtung · Licht · Kameras.
Bewegliche Teile haben eigene Objekte mit sinnvollem Drehpunkt: Tuerblatt (Scharnier), Uhr_Stundenzeiger, Uhr_Minutenzeiger.
"""
import math
import os
import bpy            # zuerst bpy, erst danach sind bmesh und mathutils verfügbar
import bmesh
import numpy as np
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
TEX = os.path.join(HERE, 'tex')
os.makedirs(TEX, exist_ok=True)

W, D, H = 10.0, 12.0, 3.4          # Breite, Tiefe, Höhe
QY = D / 2                         # Qibla-Wand
DADO = 1.5                         # Oberkante der Fliesen
TILE_W = 1.32                      # Breite der Fliesen-Textur in Metern
CARPET = 1.28                      # eine Teppich-Kachel = eine Gebetsreihe
COLUMNS = [(-1.75, -1.0), (1.75, -1.0), (-1.75, -4.2), (1.75, -4.2)]
SPOTS = {'mihrab': (0, QY, 0), 'reihe': (0, 4.25, 0), 'sitzA': (-0.55, 3.4, 0), 'sitzB': (0.55, 3.3, 0), 'tuer': (2.5, -QY, 0)}
Z = Vector((0, 0, 1))
rgb = lambda h: tuple(int(h[i:i + 2], 16) / 255 for i in (1, 3, 5))
lin = lambda c: tuple(((v / 12.92) if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4) for v in c)   # sRGB → linear


# ------------------------------------------------------------------ Grundfunktionen
def collection(name):
    c = bpy.data.collections.new(name)
    bpy.context.scene.collection.children.link(c)
    return c


def material(name, color, rough=0.85, metal=0.0, emit=None, emit_strength=1.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*lin(rgb(color)), 1)
    b.inputs['Roughness'].default_value = rough
    b.inputs['Metallic'].default_value = metal
    if emit:
        b.inputs['Emission Color'].default_value = (*lin(rgb(emit)), 1)
        b.inputs['Emission Strength'].default_value = emit_strength
    return m


def image_material(name, image, rough=0.9, emit_strength=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    b = nt.nodes['Principled BSDF']
    t = nt.nodes.new('ShaderNodeTexImage')
    t.image = image
    nt.links.new(t.outputs['Color'], b.inputs['Base Color'])
    b.inputs['Roughness'].default_value = rough
    if emit_strength:
        nt.links.new(t.outputs['Color'], b.inputs['Emission Color'])
        b.inputs['Emission Strength'].default_value = emit_strength
    return m


def wood_material(name, color, dark):
    """Holz mit leichter Maserung (prozedural)."""
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    b = nt.nodes['Principled BSDF']
    co = nt.nodes.new('ShaderNodeTexCoord')
    mp = nt.nodes.new('ShaderNodeMapping')
    mp.inputs['Scale'].default_value = (3, 3, 40)
    no = nt.nodes.new('ShaderNodeTexNoise')
    no.inputs['Scale'].default_value = 2.0
    no.inputs['Detail'].default_value = 3.0
    ramp = nt.nodes.new('ShaderNodeValToRGB')
    ramp.color_ramp.elements[0].position = 0.35
    ramp.color_ramp.elements[0].color = (*lin(rgb(dark)), 1)
    ramp.color_ramp.elements[1].position = 0.7
    ramp.color_ramp.elements[1].color = (*lin(rgb(color)), 1)
    nt.links.new(co.outputs['Object'], mp.inputs['Vector'])
    nt.links.new(mp.outputs['Vector'], no.inputs['Vector'])
    nt.links.new(no.outputs['Fac'], ramp.inputs['Fac'])
    nt.links.new(ramp.outputs['Color'], b.inputs['Base Color'])
    b.inputs['Roughness'].default_value = 0.55
    return m


def mesh_object(name, verts, faces, mats, coll, uvs=None, face_mats=None, parent=None, smooth=False):
    me = bpy.data.meshes.new(name)
    me.from_pydata([tuple(v) for v in verts], [], faces)
    for m in (mats if isinstance(mats, (list, tuple)) else [mats]):
        me.materials.append(m)
    if face_mats:
        for p, i in zip(me.polygons, face_mats):
            p.material_index = i
    if uvs:
        layer = me.uv_layers.new(name='UV')
        for p, fuv in zip(me.polygons, uvs):
            for li, t in zip(p.loop_indices, fuv):
                layer.data[li].uv = t
    if smooth:
        for p in me.polygons:
            p.use_smooth = True
        me.set_sharp_from_angle(angle=math.radians(40))
    me.update()
    ob = bpy.data.objects.new(name, me)
    coll.objects.link(ob)
    if parent:
        ob.parent = parent
    return ob


def box(name, x0, x1, y0, y1, z0, z1, mat, coll, parent=None):
    x0, x1 = sorted((x0, x1)); y0, y1 = sorted((y0, y1)); z0, z1 = sorted((z0, z1))
    v = [(x0, y0, z0), (x1, y0, z0), (x1, y1, z0), (x0, y1, z0), (x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1)]
    f = [(0, 3, 2, 1), (4, 5, 6, 7), (0, 1, 5, 4), (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7)]
    return mesh_object(name, v, f, mat, coll, parent=parent)


def prism(name, profile, x0, x1, mat, coll, parent=None):
    """Profil in der (y, z)-Ebene, entlang x von x0 bis x1 ausgezogen."""
    n = len(profile)
    v = [(x0, y, z) for y, z in profile] + [(x1, y, z) for y, z in profile]
    f = [tuple(range(n - 1, -1, -1)), tuple(range(n, 2 * n))]
    f += [(i, (i + 1) % n, n + (i + 1) % n, n + i) for i in range(n)]
    return mesh_object(name, v, f, mat, coll, parent=parent)


def bm_object(name, bm, mat, coll, parent=None, smooth=True):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    me.materials.append(mat)
    if smooth:
        for p in me.polygons:
            p.use_smooth = True
        me.set_sharp_from_angle(angle=math.radians(40))
    ob = bpy.data.objects.new(name, me)
    coll.objects.link(ob)
    if parent:
        ob.parent = parent
    return ob


def cylinder(name, r, depth, loc, mat, coll, rot=(0, 0, 0), r2=None, seg=28, parent=None):
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=seg, radius1=r, radius2=r if r2 is None else r2, depth=depth)
    ob = bm_object(name, bm, mat, coll, parent)
    ob.location = loc
    ob.rotation_euler = rot
    return ob


def sphere(name, r, loc, mat, coll, scale=(1, 1, 1), parent=None):
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=20, v_segments=12, radius=r)
    ob = bm_object(name, bm, mat, coll, parent)
    ob.location = loc
    ob.scale = scale
    return ob


def image_plane(name, corners, mat, coll, parent=None):
    """Viereck mit Bild: Ecken unten links, unten rechts, oben rechts, oben links."""
    return mesh_object(name, corners, [(0, 1, 2, 3)], mat, coll, uvs=[[(0, 0), (1, 0), (1, 1), (0, 1)]], parent=parent)


def empty(name, loc, coll, rot_z=0.0, parent=None):
    e = bpy.data.objects.new(name, None)
    e.empty_display_size = 0.2
    e.location = loc
    e.rotation_euler = (0, 0, rot_z)
    coll.objects.link(e)
    if parent:
        e.parent = parent
    return e


class Frame:
    """Wand-Koordinaten: u entlang der Wand, d nach außen (negativ = in den Raum), z nach oben."""

    def __init__(self, origin, udir):
        self.o = Vector((origin[0], origin[1], 0))
        self.u = Vector((udir[0], udir[1], 0))
        self.out = -self.u.cross(Z)                      # Normale in den Raum = u × Z, außen ist das Gegenteil

    def P(self, u, d, z):
        return self.o + self.u * u + self.out * d + Z * z

    def box(self, name, u0, u1, d0, d1, z0, z1, mat, coll):
        a, b = self.P(u0, d0, z0), self.P(u1, d1, z1)
        return box(name, a.x, b.x, a.y, b.y, a.z, b.z, mat, coll)


# ------------------------------------------------------------------ Texturen (mit numpy gemalt, als PNG gespeichert)
def save_image(name, arr):
    """arr: Höhe × Breite × 3, Werte 0..1 (sRGB), Zeile 0 = unten."""
    h, w = arr.shape[:2]
    img = bpy.data.images.new(name, w, h, alpha=False)
    rgba = np.ones((h, w, 4), np.float32)
    rgba[..., :3] = np.clip(arr, 0, 1)
    img.pixels.foreach_set(rgba.ravel())
    img.filepath_raw = os.path.join(TEX, name + '.png')
    img.file_format = 'PNG'
    img.save()
    return img


def noise(h, w, cells, seed):
    """Weiches, kachelbares Rauschen 0..1."""
    r = np.random.default_rng(seed)
    g = r.random((cells, cells))
    g = np.pad(g, ((0, 1), (0, 1)), mode='wrap')
    y = np.linspace(0, cells, h, endpoint=False); x = np.linspace(0, cells, w, endpoint=False)
    yi, xi = y.astype(int), x.astype(int)
    fy, fx = (y - yi)[:, None], (x - xi)[None, :]
    fy, fx = fy * fy * (3 - 2 * fy), fx * fx * (3 - 2 * fx)
    a = g[yi][:, xi]; b = g[yi][:, xi + 1]; c = g[yi + 1][:, xi]; d = g[yi + 1][:, xi + 1]
    return a * (1 - fy) * (1 - fx) + b * (1 - fy) * fx + c * fy * (1 - fx) + d * fy * fx


def tex_carpet():
    S = 1024
    base = np.array(rgb('#2b9c9a')); dark = np.array(rgb('#1a4f78'))
    n = noise(S, S, 7, 1)[..., None] * 0.6 + noise(S, S, 23, 2)[..., None] * 0.4
    fine = np.random.default_rng(3).random((S, S, 1))
    a = base * (0.86 + 0.24 * n) * (0.96 + 0.08 * fine)
    m = np.zeros((S, S), bool)
    c = S // 2
    for off in (-74, 66):                                   # zwei Randlinien des Bandes
        m[c + off:c + off + 9, :] = True
    t = 9
    for k in range(8):                                      # Mäander zwischen den Linien
        x0 = k * 128
        def hl(xa, xb, y): m[c + y:c + y + t, x0 + xa:x0 + xb + t] = True
        def vl(x, ya, yb): m[c + ya:c + yb + t, x0 + x:x0 + x + t] = True
        vl(8, -46, 38); hl(8, 100, 38); vl(100, -18, 38); hl(40, 100, -18); vl(40, -18, 10); hl(40, 70, 10)
        hl(8, 128, -46)
    a[m] = dark * (0.9 + 0.2 * n[m])
    return save_image('teppich', a)


def tex_tiles():
    px = 400
    Wp, Hp = int(TILE_W * px), int(DADO * px)
    r = np.random.default_rng(5)
    a = np.zeros((Hp, Wp, 3))
    tile, band, grout = np.array(rgb('#dcc7a6')), np.array(rgb('#b3603d')), np.array(rgb('#eadfc9'))
    marble = noise(Hp, Wp, 9, 6)[..., None] * 0.5 + noise(Hp, Wp, 31, 7)[..., None] * 0.5
    rows = [(0, 0.55, False), (0.55, 1.1, False), (1.1, 1.18, True), (1.18, DADO, False)]
    for z0, z1, is_band in rows:
        n = 8 if is_band else 4
        tw = Wp // n
        for i in range(n):
            x0, x1, y0, y1 = i * tw, (i + 1) * tw, int(z0 * px), int(z1 * px)
            col = (band if is_band else tile) * (0.95 + 0.1 * r.random())
            a[y0:y1, x0:x1] = col * (0.93 + 0.14 * marble[y0:y1, x0:x1])
            a[y0:y0 + 2, x0:x1] = grout; a[y1 - 2:y1, x0:x1] = grout
            a[y0:y1, x0:x0 + 2] = grout; a[y0:y1, x1 - 2:x1] = grout
    return save_image('fliesen', a)


def tex_glass():
    S = 512
    n = noise(S, S, 5, 11) * 0.65 + noise(S, S, 13, 12) * 0.35
    orn = np.clip((np.sin(n * 16) - 0.1) * 2.5, 0, 1)[..., None]            # weiche, wolkige Ornamente
    a = np.array((0.74, 0.87, 0.96)) * (1 - orn) + np.array((0.93, 0.97, 1.0)) * orn
    a = a * (0.95 + 0.05 * noise(S, S, 4, 13)[..., None])
    return save_image('milchglas', a)


def tex_rug():
    Wp, Hp = 280, 460
    a = np.zeros((Hp, Wp, 3)); a[:] = rgb('#2f86cf')
    gold, deep, light = np.array(rgb('#d9bd6a')), np.array(rgb('#1c5aa0')), np.array(rgb('#69b4ea'))
    a[:16] = gold; a[-16:] = gold; a[:, :16] = gold; a[:, -16:] = gold
    a[20:26, 20:-20] = deep; a[-26:-20, 20:-20] = deep; a[20:-20, 20:26] = deep; a[20:-20, -26:-20] = deep
    for k in range(34, Hp - 34, 22):                         # Rauten im Rand
        a[k:k + 8, 30:38] = gold; a[k:k + 8, -38:-30] = gold
    yy, xx = np.mgrid[0:Hp, 0:Wp]
    cx, r0, top = Wp / 2, 74, Hp - 150                       # Bogen-Motiv (zeigt zur Qibla = oben)
    arch = ((np.abs(xx - cx) < r0) & (yy > 70) & (yy < top)) | ((xx - cx) ** 2 + (yy - top) ** 2 < r0 ** 2)
    arch2 = ((np.abs(xx - cx) < r0 - 10) & (yy > 80) & (yy < top)) | ((xx - cx) ** 2 + (yy - top) ** 2 < (r0 - 10) ** 2)
    a[arch] = gold; a[arch2] = light
    return save_image('gebetsteppich', a)


def tex_exit():
    Wp, Hp = 256, 128
    a = np.zeros((Hp, Wp, 3)); a[:] = rgb('#0d9a52')
    white = (1, 1, 1)
    a[26:102, 168:216] = white; a[34:102, 176:208] = rgb('#0d9a52')        # Tür-Rahmen
    a[58:70, 40:120] = white                                                # Pfeil-Schaft
    yy, xx = np.mgrid[0:Hp, 0:Wp]
    a[(xx >= 110) & (xx <= 146) & (np.abs(yy - 64) <= (146 - xx) * 0.9)] = white   # Pfeil-Spitze
    return save_image('notausgang', a)


def tex_phone():
    S = 256
    a = np.ones((S, S, 3))
    yy, xx = np.mgrid[0:S, 0:S]
    c = S / 2
    a[(np.abs(xx - c) < 30) & (np.abs(yy - c) < 58)] = (0.1, 0.1, 0.12)       # Handy
    a[(np.abs(xx - c) < 23) & (np.abs(yy - c - 4) < 42)] = (0.75, 0.8, 0.85)
    rr = np.hypot(xx - c, yy - c)
    red = np.array(rgb('#d2232a'))
    a[(rr > 92) & (rr < 114)] = red
    a[(np.abs((xx - c) + (yy - c)) < 15) & (rr < 100)] = red                 # Schrägstrich
    return save_image('handy_aus', a)


# ------------------------------------------------------------------ Bau
def build():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    C = {n: collection(n) for n in ['Raum', 'Fenster', 'Mihrab', 'Saeulen', 'Tuer', 'Einrichtung', 'Licht', 'Kameras']}

    # ---- Materialien
    M = {
        'putz': material('Putz', '#f3f1eb', 0.92),
        'decke': material('Decke', '#f7f6f2', 0.95, emit='#fffaf0', emit_strength=0.22),
        'leiste': material('Sockelleiste', '#1f8f93', 0.6),
        'rahmen': material('Fensterrahmen', '#fafafa', 0.35),
        'gold': material('Gold', '#CA9E4E', 0.3, 0.9),
        'schwarz': material('Schwarz', '#17181b', 0.45),
        'chrom': material('Chrom', '#c9ccd2', 0.25, 1.0),
        'tuer': material('Tuer', '#4a4d52', 0.45, 0.2),
        'tuerglas': material('Tuerglas', '#8fa6b8', 0.1, 0.3),
        'weiss': material('Kunststoff_weiss', '#f4f4f2', 0.4),
        'uhr': material('Zifferblatt', '#fbfbf8', 0.5),
        'buch_gruen': material('Buch_gruen', '#1f5a3a', 0.6),
        'buch_gruen2': material('Buch_gruen_hell', '#2c7350', 0.6),
        'buch_dunkel': material('Buch_dunkel', '#4a2a22', 0.6),
        'flur': material('Flur', '#efe6d6', 0.9, emit='#ffe2b8', emit_strength=0.6),
        'led': material('LED', '#ffffff', 0.5, emit='#fff6e6', emit_strength=2.0),
        'holz': wood_material('Holz', '#d6a868', '#b9864a'),
        'holz_dunkel': wood_material('Holz_dunkel', '#b88a52', '#946a3a'),
    }
    img = {
        'teppich': tex_carpet(), 'fliesen': tex_tiles(), 'glas': tex_glass(), 'rug': tex_rug(), 'exit': tex_exit(), 'phone': tex_phone(),
        'kalli': bpy.data.images.load(os.path.join(TEX, 'kalligraphie.png')),
    }
    M['teppich'] = image_material('Teppich', img['teppich'], 1.0)
    M['fliesen'] = image_material('Fliesen', img['fliesen'], 0.35)
    M['glas'] = image_material('Milchglas', img['glas'], 0.3, emit_strength=0.55)
    M['rug'] = image_material('Gebetsteppich', img['rug'], 1.0)
    M['exit'] = image_material('Notausgang', img['exit'], 0.5, emit_strength=1.2)
    M['phone'] = image_material('Handy_aus', img['phone'], 0.5)
    M['kalli'] = image_material('Kalligraphie', img['kalli'], 0.4)

    # ---- Boden (reicht in die Mihrab-Nische) und Decke mit Unterzügen
    y1 = QY + 0.45
    fl = [(-W / 2, -QY, 0), (W / 2, -QY, 0), (W / 2, y1, 0), (-W / 2, y1, 0)]
    mesh_object('Boden_Teppich', fl, [(0, 1, 2, 3)], M['teppich'], C['Raum'], uvs=[[(x / CARPET, y / CARPET) for x, y, _ in fl]])
    mesh_object('Decke', [(-W / 2, -QY, H), (-W / 2, QY, H), (W / 2, QY, H), (W / 2, -QY, H)], [(0, 1, 2, 3)], M['decke'], C['Raum'])
    for i, y in enumerate([2.2, -1.0, -4.2]):
        box(f'Unterzug_quer_{i + 1}', -W / 2, W / 2, y - 0.17, y + 0.17, H - 0.24, H, M['decke'], C['Raum'])
    for i, x in enumerate([-1.75, 1.75]):
        box(f'Unterzug_laengs_{i + 1}', x - 0.17, x + 0.17, -QY, QY, H - 0.22, H, M['decke'], C['Raum'])

    # ---- Wände
    def wall(name, frame, length, openings):
        us = sorted({0, length, *[o['u'] - o['w'] / 2 for o in openings], *[o['u'] + o['w'] / 2 for o in openings]})
        zs = {0, DADO, H}
        for o in openings:
            zs |= {o['z0'], o['z1']}
            if o.get('arch'):
                zs.add(o['z1'] + o['w'] / 2)
        zs = sorted(zs)
        verts, faces, uvs, fm = [], [], [], []

        def add(poly):
            i0 = len(verts)
            verts.extend(frame.P(u, 0, z) for u, z in poly)
            faces.append(tuple(range(i0, i0 + len(poly))))
            tile = max(z for _, z in poly) <= DADO + 1e-6
            uvs.append([(u / TILE_W, z / DADO) for u, z in poly])
            fm.append(0 if tile else 1)

        for ua, ub in zip(us, us[1:]):
            for za, zb in zip(zs, zs[1:]):
                um, zm = (ua + ub) / 2, (za + zb) / 2
                skip = False
                for o in openings:
                    l, r = o['u'] - o['w'] / 2, o['u'] + o['w'] / 2
                    if l < um < r and o['z0'] < zm < o['z1'] + (o['w'] / 2 if o.get('arch') else 0):
                        skip = True
                if not skip:
                    add([(ua, za), (ub, za), (ub, zb), (ua, zb)])
        for o in openings:                                   # Zwickel links und rechts über dem Rundbogen
            if not o.get('arch'):
                continue
            cx, rad, sp = o['u'], o['w'] / 2, o['z1']
            arc = [(cx - rad * math.cos(t), sp + rad * math.sin(t)) for t in np.linspace(0, math.pi / 2, 13)]
            add(arc + [(cx - rad, sp + rad)])
            arc = [(cx + rad * math.cos(t), sp + rad * math.sin(t)) for t in np.linspace(math.pi / 2, 0, 13)]
            add(arc + [(cx + rad, sp + rad)])
        return mesh_object(name, verts, faces, [M['fliesen'], M['putz']], C['Raum'], uvs=uvs, face_mats=fm)

    F_q = Frame((-W / 2, QY), (1, 0))        # Qibla-Wand: u = x + 5
    F_r = Frame((W / 2, QY), (0, -1))        # rechte Wand: u = 6 − y
    F_b = Frame((W / 2, -QY), (-1, 0))       # Rückwand:    u = 5 − x
    F_l = Frame((-W / 2, -QY), (0, 1))       # linke Wand:  u = y + 6

    mw, spring = 1.23, 1.69                                  # Mihrab: Breite, Beginn des Bogens
    q_win = [{'u': W / 2 - 3.0, 'w': 1.2, 'z0': 0.85, 'z1': 3.0}, {'u': W / 2 + 2.2, 'w': 1.2, 'z0': 0.85, 'z1': 3.0}]
    wall('Wand_Qibla', F_q, W, [{'u': W / 2, 'w': mw, 'z0': 0, 'z1': spring, 'arch': True}, *q_win])
    side = {'w': 1.1, 'z0': 0.9, 'z1': 2.9}
    l_win = [{'u': QY + 3.4, **side}, {'u': QY - 1.4, **side}]
    r_win = [{'u': QY - 3.0, **side}, {'u': QY + 1.8, **side}]
    wall('Wand_links', F_l, D, l_win)
    wall('Wand_rechts', F_r, D, r_win)
    door_x, door_w, door_h = 2.5, 1.1, 2.12
    wall('Wand_hinten', F_b, W, [{'u': W / 2 - door_x, 'w': door_w, 'z0': 0, 'z1': door_h}])

    # Sockelleisten (in Teppichfarbe)
    def skirting(name, frame, u0, u1):
        frame.box(name, u0, u1, 0, -0.018, 0, 0.085, M['leiste'], C['Raum'])
    skirting('Leiste_Qibla_links', F_q, 0, W / 2 - mw / 2); skirting('Leiste_Qibla_rechts', F_q, W / 2 + mw / 2, W)
    skirting('Leiste_links', F_l, 0, D); skirting('Leiste_rechts', F_r, 0, D)
    skirting('Leiste_hinten_1', F_b, 0, W / 2 - door_x - door_w / 2 - 0.06); skirting('Leiste_hinten_2', F_b, W / 2 - door_x + door_w / 2 + 0.06, W)

    # ---- Fenster: Laibung, weißer Rahmen mit Oberlicht und zwei Flügeln, leuchtendes Milchglas
    def window(name, frame, o, light=45):
        u0, u1, z0, z1 = o['u'] - o['w'] / 2, o['u'] + o['w'] / 2, o['z0'], o['z1']
        dp = 0.24
        g = C['Fenster']
        e = 0.003                                           # kleiner Abstand hinter der Wandfläche (keine deckungsgleichen Flächen)
        frame.box(f'{name}_Laibung_links', u0 - 0.02, u0, e, dp, z0, z1, M['putz'], g)
        frame.box(f'{name}_Laibung_rechts', u1, u1 + 0.02, e, dp, z0, z1, M['putz'], g)
        frame.box(f'{name}_Sturz', u0 - 0.02, u1 + 0.02, e, dp, z1, z1 + 0.02, M['putz'], g)
        frame.box(f'{name}_Bruestung', u0 - 0.02, u1 + 0.02, e, dp, z0 - 0.02, z0, M['putz'], g)
        frame.box(f'{name}_Fensterbank', u0 + 0.001, u1 - 0.001, -0.035, 0.13, z0, z0 + 0.022, M['weiss'], g)
        d0, d1 = 0.13, 0.19
        t = 0.06
        zk = z1 - 0.5                                       # Kämpfer: darüber das Oberlicht
        for nm, a, b, c, d in [('Rahmen_links', u0, u0 + t, z0, z1), ('Rahmen_rechts', u1 - t, u1, z0, z1),
                               ('Rahmen_unten', u0 + t, u1 - t, z0, z0 + t), ('Rahmen_oben', u0 + t, u1 - t, z1 - t, z1),
                               ('Kaempfer', u0 + t, u1 - t, zk, zk + t), ('Pfosten', o['u'] - 0.04, o['u'] + 0.04, z0 + t, zk)]:
            frame.box(f'{name}_{nm}', a, b, d0, d1, c, d, M['rahmen'], g)
        frame.box(f'{name}_Griff', o['u'] - 0.012, o['u'] + 0.012, d0 - 0.03, d0, z0 + 0.75, z0 + 0.87, M['weiss'], g)
        cs = [frame.P(u0, 0.17, z0), frame.P(u1, 0.17, z0), frame.P(u1, 0.17, z1), frame.P(u0, 0.17, z1)]
        gl = mesh_object(f'{name}_Glas', cs, [(0, 1, 2, 3)], M['glas'], g,
                         uvs=[[(0, 0), (o['w'] / 1.2, 0), (o['w'] / 1.2, (z1 - z0) / 1.2), (0, (z1 - z0) / 1.2)]])
        # Tageslicht: Flächenlicht knapp vor dem Glas, strahlt in den Raum
        L = bpy.data.lights.new(f'{name}_Tageslicht', 'AREA')
        L.shape = 'RECTANGLE'; L.size = o['w'] * 0.9; L.size_y = (z1 - z0) * 0.9
        L.energy = light; L.color = (1.0, 0.97, 0.92)
        lo = bpy.data.objects.new(f'{name}_Tageslicht', L)
        lo.location = frame.P(o['u'], 0.1, (z0 + z1) / 2)
        lo.rotation_euler = (frame.out).to_track_quat('Z', 'Y').to_euler()      # −Z des Lichts zeigt in den Raum
        C['Licht'].objects.link(lo)
        return gl

    window('Fenster_Qibla_links', F_q, q_win[0]); window('Fenster_Qibla_rechts', F_q, q_win[1])
    window('Fenster_links_vorn', F_l, l_win[0]); window('Fenster_links_hinten', F_l, l_win[1])
    window('Fenster_rechts_vorn', F_r, r_win[0]); window('Fenster_rechts_hinten', F_r, r_win[1])

    # ---- Mihrab: flache Rundnische mit Halbkuppel, unten gefliest
    rad, depth, seg = mw / 2, 0.40, 24
    verts, faces, uvs, fm = [], [], [], []
    ang = np.linspace(0, math.pi, seg + 1)
    ring = lambda z, k=1.0: [(-rad * math.cos(a) * k, QY + depth * math.sin(a) * k, z) for a in ang]
    arc_len = [rad * a for a in ang]

    def strip(r0, r1, mat_i, uv0=None, uv1=None):
        i0 = len(verts); verts.extend(r0); i1 = len(verts); verts.extend(r1)
        for j in range(seg):
            faces.append((i0 + j, i0 + j + 1, i1 + j + 1, i1 + j)); fm.append(mat_i)
            uvs.append([uv0[j], uv0[j + 1], uv1[j + 1], uv1[j]] if uv0 else [(0, 0)] * 4)
    strip(ring(0), ring(DADO), 0, [(s / TILE_W, 0) for s in arc_len], [(s / TILE_W, 1) for s in arc_len])
    strip(ring(DADO), ring(spring), 1)
    el = np.linspace(0, math.pi / 2, 9)
    for e0, e1 in zip(el, el[1:]):
        strip(ring(spring + rad * math.sin(e0), math.cos(e0)), ring(spring + rad * math.sin(e1), max(math.cos(e1), 1e-4)), 1)
    mesh_object('Mihrab_Nische', verts, faces, [M['fliesen'], M['putz']], C['Mihrab'], uvs=uvs, face_mats=fm, smooth=True)
    for s in (-1, 1):                                        # weiße Kantenleisten
        box(f'Mihrab_Kante_{"links" if s < 0 else "rechts"}', s * rad - 0.015, s * rad + 0.015, QY - 0.02, QY + 0.012, 0, DADO, M['weiss'], C['Mihrab'])
    # goldener Aufsatz über dem Bogen, Kalligraphie-Tafel (Schahāda)
    top = spring + rad
    cylinder('Mihrab_Aufsatz_Scheibe', 0.085, 0.02, (0, QY - 0.012, top + 0.13), M['gold'], C['Mihrab'], rot=(math.pi / 2, 0, 0))
    cylinder('Mihrab_Aufsatz_Spitze', 0.05, 0.12, (0, QY - 0.03, top + 0.26), M['gold'], C['Mihrab'], r2=0.0, seg=6)
    box('Mihrab_Aufsatz_Fuss', -0.1, 0.1, QY - 0.03, QY, top + 0.02, top + 0.05, M['gold'], C['Mihrab'])
    pw, ph, pz = 1.3, 0.32, 2.93
    box('Tafel_Rahmen', -pw / 2 - 0.03, pw / 2 + 0.03, QY - 0.035, QY, pz - ph / 2 - 0.03, pz + ph / 2 + 0.03, M['holz_dunkel'], C['Mihrab'])
    image_plane('Tafel_Kalligraphie', [(-pw / 2, QY - 0.037, pz - ph / 2), (pw / 2, QY - 0.037, pz - ph / 2), (pw / 2, QY - 0.037, pz + ph / 2), (-pw / 2, QY - 0.037, pz + ph / 2)],
                M['kalli'], C['Mihrab'])
    # Gebetsteppich des Imams, Mikrofon, Steckdosen
    rw, rl, ry = 0.72, 1.18, QY - 0.38
    image_plane('Gebetsteppich_Imam', [(-rw / 2, ry - rl / 2, 0.008), (rw / 2, ry - rl / 2, 0.008), (rw / 2, ry + rl / 2, 0.008), (-rw / 2, ry + rl / 2, 0.008)], M['rug'], C['Mihrab'])
    for i in range(18):                                      # Fransen
        x = -rw / 2 + 0.02 + i * (rw - 0.04) / 17
        for yy in (ry - rl / 2 - 0.035, ry + rl / 2):
            box(f'Franse_{i}_{"v" if yy > ry else "h"}', x - 0.006, x + 0.006, yy, yy + 0.035, 0.004, 0.009, M['weiss'], C['Mihrab'])
    cylinder('Mikrofon_Fuss', 0.09, 0.02, (0.34, QY + 0.12, 0.01), M['schwarz'], C['Mihrab'])
    cu = bpy.data.curves.new('Mikrofon_Hals', 'CURVE'); cu.dimensions = '3D'; cu.bevel_depth = 0.007; cu.bevel_resolution = 3
    sp = cu.splines.new('BEZIER'); pts = [(0.34, QY + 0.12, 0.02), (0.34, QY + 0.12, 0.85), (0.3, QY + 0.02, 1.22), (0.26, QY - 0.1, 1.3)]
    sp.bezier_points.add(len(pts) - 1)
    for p, co in zip(sp.bezier_points, pts):
        p.co = co; p.handle_left_type = p.handle_right_type = 'AUTO'
    mo = bpy.data.objects.new('Mikrofon_Hals', cu); mo.data.materials.append(M['schwarz']); C['Mihrab'].objects.link(mo)
    cylinder('Mikrofon_Kopf', 0.016, 0.08, (0.25, QY - 0.13, 1.31), M['schwarz'], C['Mihrab'], rot=(math.radians(70), 0, math.radians(15)))
    for i, x in enumerate([-0.82, 0.82, 1.3, -3.6, 3.4]):
        box(f'Steckdose_{i + 1}', x - 0.04, x + 0.04, QY - 0.012, QY, 0.3, 0.38, M['weiss'], C['Mihrab'])

    # ---- Wanduhr (Zeiger einzeln drehbar um die Y-Achse)
    E = C['Einrichtung']
    cx, cz, cr, cy = -1.72, 2.2, 0.17, QY - 0.02
    cylinder('Uhr_Gehaeuse', cr + 0.015, 0.045, (cx, cy, cz), M['chrom'], E, rot=(math.pi / 2, 0, 0), seg=40)
    cylinder('Uhr_Zifferblatt', cr, 0.05, (cx, cy - 0.001, cz), M['uhr'], E, rot=(math.pi / 2, 0, 0), seg=40)
    for k in range(12):
        a = k * math.pi / 6
        big = k % 3 == 0
        t = box(f'Uhr_Strich_{k:02d}', -0.006 if big else -0.003, 0.006 if big else 0.003, -0.002, 0.002, cr - (0.045 if big else 0.03), cr - 0.012, M['schwarz'], E)
        t.location = (cx, cy - 0.027, cz); t.rotation_euler = (0, a, 0)
    for nm, ln, wd, a in [('Uhr_Stundenzeiger', 0.085, 0.009, math.radians(125)), ('Uhr_Minutenzeiger', 0.125, 0.006, math.radians(250))]:
        hnd = box(nm, -wd, wd, -0.002, 0.002, -0.02, ln, M['schwarz'], E)
        hnd.location = (cx, cy - 0.031, cz); hnd.rotation_euler = (0, a, 0)
    cylinder('Uhr_Nabe', 0.012, 0.012, (cx, cy - 0.034, cz), M['schwarz'], E, rot=(math.pi / 2, 0, 0), seg=16)

    # ---- Wandregale mit Büchern
    def shelf(name, frame, u, n_books, mats, z=DADO + 0.03):
        w, dp = 0.92, 0.2
        frame.box(f'{name}_Boden', u - w / 2, u + w / 2, 0, -dp, z, z + 0.025, M['holz'], E)
        frame.box(f'{name}_Rueckwand', u - w / 2, u + w / 2, 0, -0.015, z, z + 0.34, M['holz'], E)
        frame.box(f'{name}_Deckel', u - w / 2, u + w / 2, 0, -dp, z + 0.33, z + 0.355, M['holz'], E)
        for s in (-1, 1):
            frame.box(f'{name}_Seite_{"l" if s < 0 else "r"}', u + s * w / 2, u + s * (w / 2 - 0.02), 0, -dp, z, z + 0.355, M['holz'], E)
        r = np.random.default_rng(len(name))
        x = u - w / 2 + 0.03
        for i in range(n_books):
            bw = 0.03 + r.random() * 0.022
            if x + bw > u + w / 2 - 0.03:
                break
            bh = 0.23 + r.random() * 0.055
            frame.box(f'{name}_Buch_{i:02d}', x, x + bw, -0.02, -0.02 - (0.14 + r.random() * 0.025), z + 0.025, z + 0.025 + bh, mats[i % len(mats)], E)
            x += bw + 0.003

    green, darkb = [M['buch_gruen'], M['buch_gruen2'], M['buch_gruen']], [M['buch_dunkel'], M['buch_gruen'], M['buch_dunkel']]
    shelf('Regal_Qibla_links', F_q, W / 2 - 1.72, 26, green)
    shelf('Regal_Qibla_rechts', F_q, W / 2 + 3.28, 26, green)
    shelf('Regal_Wand_links', F_l, QY + 1.1, 26, green)
    shelf('Regal_Wand_rechts', F_r, QY - 0.9, 26, darkb)

    # ---- Minbar (rechts vorn): Treppe zur Wand hin, Seitenwangen, Geländer, Rückwand
    mb = empty('Minbar', (4.25, QY - 0.03, 0), E)
    hw, plat, run, rise, n = 0.42, 0.7, 0.28, 0.2, 4
    top_z = rise * (n + 1)
    box('Minbar_Podest', -hw, hw, -plat, 0, 0, top_z, M['holz'], E, mb)
    for i in range(n):
        ya = -(plat + run * (n - i)); yb = ya + run
        box(f'Minbar_Stufe_{i + 1}', -hw, hw, ya, yb, 0, rise * (i + 1), M['holz'], E, mb)
        box(f'Minbar_Trittkante_{i + 1}', -hw, hw, ya - 0.015, ya + 0.02, rise * (i + 1) - 0.03, rise * (i + 1) + 0.006, M['holz_dunkel'], E, mb)
    L = plat + run * n
    rail_h = 0.8
    for s in (-1, 1):
        nm = 'links' if s < 0 else 'rechts'
        x0, x1 = s * hw, s * (hw + 0.03)
        prism(f'Minbar_Wange_{nm}', [(0, 0), (-L, 0), (-L, rise + 0.1), (-plat, top_z + 0.1), (0, top_z + 0.1)], x0, x1, M['holz_dunkel'], E, mb)
        prism(f'Minbar_Fuellung_{nm}', [(-L + 0.05, rise + 0.1), (-plat, top_z + 0.1), (-0.03, top_z + 0.1), (-0.03, top_z + rail_h), (-plat, top_z + rail_h), (-L + 0.05, rise + rail_h)],
              s * (hw + 0.008), s * (hw + 0.022), M['holz'], E, mb)
        prism(f'Minbar_Handlauf_{nm}', [(-L - 0.02, rise + rail_h), (-plat, top_z + rail_h), (0, top_z + rail_h), (0, top_z + rail_h + 0.05), (-plat, top_z + rail_h + 0.05), (-L - 0.02, rise + rail_h + 0.05)],
              s * (hw - 0.015), s * (hw + 0.045), M['holz_dunkel'], E, mb)
        for nm2, y, z1 in [('unten', -L, rise + rail_h + 0.12), ('oben', -plat, 2.05)]:
            box(f'Minbar_Pfosten_{nm2}_{nm}', s * (hw - 0.02), s * (hw + 0.05), y - 0.035, y + 0.035, 0, z1, M['holz_dunkel'], E, mb)
            sphere(f'Minbar_Knauf_{nm2}_{nm}', 0.045, (s * (hw + 0.015), y, z1 + 0.035), M['holz_dunkel'], E, parent=mb)
    box('Minbar_Sturz', -hw - 0.05, hw + 0.05, -plat - 0.035, -plat + 0.035, 1.93, 2.05, M['holz_dunkel'], E, mb)
    box('Minbar_Rueckwand', -hw - 0.03, hw + 0.03, -0.03, 0, 0, 2.05, M['holz'], E, mb)

    # ---- Stuhlreihe an der linken Wand (hinten)
    def chair(name, loc, rot_z):
        g = empty(name, loc, E, rot_z)
        box(f'{name}_Sitz', -0.22, 0.22, -0.21, 0.21, 0.43, 0.465, M['schwarz'], E, g)
        b = box(f'{name}_Lehne', -0.21, 0.21, -0.015, 0.015, 0.0, 0.36, M['schwarz'], E, g)
        b.location = (0, -0.215, 0.56); b.rotation_euler = (math.radians(-10), 0, 0)
        for sx in (-1, 1):
            for sy in (-1, 1):
                leg = cylinder(f'{name}_Bein_{sx}_{sy}', 0.011, 0.45, (sx * 0.2, sy * 0.19, 0.215), M['chrom'], E, seg=10, parent=g)
                leg.rotation_euler = (math.radians(-5 * sy), math.radians(5 * sx), 0)
            box(f'{name}_Lehnenrohr_{sx}', sx * 0.2 - 0.008, sx * 0.2 + 0.008, -0.225, -0.205, 0.43, 0.62, M['chrom'], E, g)
        return g
    for i in range(6):
        chair(f'Stuhl_{i + 1}', (-W / 2 + 0.36, -2.6 - i * 0.52, 0), -math.pi / 2)

    # ---- Säulen: unten gefliest, oben verputzt, Sockel in Teppichfarbe
    cw = 0.46
    for k, (x, y) in enumerate(COLUMNS):
        verts, faces, uvs, fm = [], [], [], []
        cs = [(x - cw / 2, y - cw / 2), (x + cw / 2, y - cw / 2), (x + cw / 2, y + cw / 2), (x - cw / 2, y + cw / 2)]
        for j in range(4):
            (ax, ay), (bx, by) = cs[j], cs[(j + 1) % 4]
            for za, zb, mi in [(0, DADO, 0), (DADO, H, 1)]:
                i0 = len(verts)
                verts += [(ax, ay, za), (bx, by, za), (bx, by, zb), (ax, ay, zb)]
                faces.append((i0, i0 + 1, i0 + 2, i0 + 3)); fm.append(mi)
                uvs.append([(j * cw / TILE_W, za / DADO), ((j + 1) * cw / TILE_W, za / DADO), ((j + 1) * cw / TILE_W, zb / DADO), (j * cw / TILE_W, zb / DADO)])
        mesh_object(f'Saeule_{k + 1}', verts, faces, [M['fliesen'], M['putz']], C['Saeulen'], uvs=uvs, face_mats=fm)
        box(f'Saeule_{k + 1}_Sockel', x - cw / 2 - 0.018, x + cw / 2 + 0.018, y - cw / 2 - 0.018, y + cw / 2 + 0.018, 0, 0.09, M['leiste'], C['Saeulen'])
    sx, sy = COLUMNS[1]
    ps, pz2, py = 0.24, 1.72, sy + cw / 2 + 0.004                 # Schild „Handy aus“ an der Säule (zur Qibla hin sichtbar)
    box('Schild_Handy_Platte', sx - ps / 2 - 0.01, sx + ps / 2 + 0.01, py - 0.004, py + 0.004, pz2 - ps / 2 - 0.01, pz2 + ps / 2 + 0.01, M['weiss'], C['Saeulen'])
    image_plane('Schild_Handy', [(sx + ps / 2, py + 0.006, pz2 - ps / 2), (sx - ps / 2, py + 0.006, pz2 - ps / 2), (sx - ps / 2, py + 0.006, pz2 + ps / 2), (sx + ps / 2, py + 0.006, pz2 + ps / 2)],
                M['phone'], C['Saeulen'])

    # ---- Eingangstür in der Rückwand: Zarge, Türblatt (Drehpunkt am Scharnier), Notausgang-Schild, Fußmatte, Flur dahinter
    T = C['Tuer']
    ud = W / 2 - door_x
    F_b.box('Tuer_Zarge_links', ud - door_w / 2 - 0.06, ud - door_w / 2, -0.02, 0.14, 0, door_h + 0.06, M['tuer'], T)
    F_b.box('Tuer_Zarge_rechts', ud + door_w / 2, ud + door_w / 2 + 0.06, -0.02, 0.14, 0, door_h + 0.06, M['tuer'], T)
    F_b.box('Tuer_Zarge_oben', ud - door_w / 2, ud + door_w / 2, -0.02, 0.14, door_h, door_h + 0.06, M['tuer'], T)
    leaf = box('Tuerblatt', -door_w + 0.01, 0, -0.022, 0.022, 0.012, door_h - 0.008, M['tuer'], T)
    leaf.location = (door_x + door_w / 2 - 0.005, -QY - 0.07, 0)       # Scharnier; zum Öffnen um Z drehen (negativ = nach außen)
    box('Tuerblatt_Glas', -door_w + 0.2, -door_w + 0.38, -0.026, 0.026, 0.55, door_h - 0.25, M['tuerglas'], T, leaf)
    box('Tuerblatt_Griff', -door_w + 0.08, -door_w + 0.2, 0.022, 0.07, 1.02, 1.05, M['chrom'], T, leaf)
    box('Tuerblatt_Griffsockel', -door_w + 0.07, -door_w + 0.1, 0.022, 0.07, 1.0, 1.07, M['chrom'], T, leaf)
    ez = door_h + 0.32
    F_b.box('Notausgang_Kasten', ud - 0.19, ud + 0.19, -0.05, 0, ez - 0.1, ez + 0.1, M['weiss'], T)
    image_plane('Notausgang_Schild', [F_b.P(ud - 0.17, -0.052, ez - 0.085), F_b.P(ud + 0.17, -0.052, ez - 0.085), F_b.P(ud + 0.17, -0.052, ez + 0.085), F_b.P(ud - 0.17, -0.052, ez + 0.085)], M['exit'], T)
    box('Fussmatte', door_x - 0.5, door_x + 0.5, -QY + 0.12, -QY + 0.78, 0.004, 0.012, material('Fussmatte', '#2f86cf', 1.0), T)
    hx0, hx1, hy = door_x - 1.2, door_x + 1.2, -QY - 2.2             # Flur hinter der Tür (sichtbar, wenn sie offen ist)
    hv = [(hx0, -QY - 0.15, 0), (hx1, -QY - 0.15, 0), (hx1, hy, 0), (hx0, hy, 0), (hx0, -QY - 0.15, 2.5), (hx1, -QY - 0.15, 2.5), (hx1, hy, 2.5), (hx0, hy, 2.5)]
    mesh_object('Flur', hv, [(0, 1, 2, 3), (7, 6, 5, 4), (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0)], M['flur'], T)

    # ---- Licht: runde LED-Leuchten an der Decke (sichtbare Scheibe + Flächenlicht), Fenster siehe oben
    k = 0
    for y in [4.1, 0.6, -2.6, -5.1]:
        for x in [-3.4, 0.0, 3.4]:
            k += 1
            cylinder(f'LED_{k:02d}', 0.16, 0.02, (x, y, H - 0.011), M['led'], C['Licht'], seg=32)
            L = bpy.data.lights.new(f'LED_{k:02d}_Licht', 'AREA')
            L.shape = 'DISK'; L.size = 0.6; L.energy = 14; L.color = (1.0, 0.96, 0.9)
            lo = bpy.data.objects.new(f'LED_{k:02d}_Licht', L)
            lo.location = (x, y, H - 0.05)
            C['Licht'].objects.link(lo)
    world = bpy.data.worlds.new('Welt'); world.use_nodes = True
    bg = world.node_tree.nodes['Background']
    bg.inputs['Color'].default_value = (0.9, 0.93, 1.0, 1); bg.inputs['Strength'].default_value = 0.6
    scene.world = world

    # ---- Kameras: die sieben Ansichten der Vorlage (Querformat) + eine Hochformat-Kamera für Videos
    def camera(name, pos, look, lens=20):
        cd = bpy.data.cameras.new(name); cd.lens = lens; cd.sensor_width = 36; cd.clip_start = 0.05; cd.clip_end = 60
        ob = bpy.data.objects.new(name, cd)
        ob.location = pos
        ob.rotation_euler = (Vector(look) - Vector(pos)).to_track_quat('-Z', 'Y').to_euler()
        C['Kameras'].objects.link(ob)
        return ob
    camera('Kamera_1_Frontansicht', (0, 0.2, 1.45), (0, 6, 1.4), 18)
    camera('Kamera_2_Rueckansicht', (-0.3, 4.6, 1.5), (0.6, -6, 1.3), 18)
    camera('Kamera_3_Linke_Seite', (3.6, 2.2, 1.5), (-5, 2.9, 1.3), 18)
    camera('Kamera_4_Rechte_Seite', (-3.6, 1.6, 1.5), (5, 2.4, 1.3), 18)
    camera('Kamera_5_Diagonale_Links', (2.6, -0.6, 1.6), (-2.6, 6, 1.2), 20)
    camera('Kamera_6_Diagonale_Rechts', (-3.6, -0.2, 1.6), (2.4, 6, 1.2), 20)
    camera('Kamera_7_Eingangsbereich', (3.4, -1.6, 1.5), (2.4, -6, 1.25), 20)
    scene.camera = camera('Kamera_Video_Hochformat', (0, 0.6, 1.5), (0, 6, 1.35), 24)

    # ---- Render-Einstellungen (Cycles auf der CPU, entrauscht; Video-Format 1080 × 1920, 30 Bilder/s)
    r = scene.render
    r.engine = 'CYCLES'
    r.resolution_x, r.resolution_y, r.fps = 1080, 1920, 30
    cy = scene.cycles
    cy.device = 'CPU'; cy.samples = 48; cy.use_adaptive_sampling = True; cy.adaptive_threshold = 0.05
    cy.use_denoising = True; cy.denoiser = 'OPENIMAGEDENOISE'
    cy.max_bounces = 5; cy.diffuse_bounces = 3; cy.glossy_bounces = 2; cy.transmission_bounces = 2
    cy.caustics_reflective = cy.caustics_refractive = False
    scene.view_settings.view_transform = 'Standard'
    scene.unit_settings.system = 'METRIC'
    for k2, v in SPOTS.items():                              # wichtige Orte als Markierungen (für Figuren und Kamera)
        empty(f'Ort_{k2}', v, C['Raum'])
    return scene


if __name__ == '__main__':
    build()
    bpy.ops.file.pack_all()
    out = os.path.join(HERE, 'gebetsraum.blend')
    bpy.ops.wm.save_as_mainfile(filepath=out, compress=True)
    n = len([o for o in bpy.data.objects if o.type == 'MESH'])
    print(f'Gespeichert: {out} · {n} Teile · {len(bpy.data.materials)} Materialien')
