#!/usr/bin/env python3
"""Festsaal im Keller (Ayman 23.11.): Einrichtung nach seinem Video von einem Festsaal (Hochzeitssaal-Stil, für Babyfeiern,
Nikah usw.): weißer, glänzender Marmorboden 120×120 mit feinen braun-goldenen Adern, Teppiche mit Ornament-Bordüre,
Kassettendecke mit indirekten LED-Bändern und Einbaustrahlern, Kristall-Kronleuchter, runde Tische mit weißen Tischdecken,
goldene Stühle mit ovaler Polsterlehne, Blumen-Säulen, Bühne mit Sofa und Bögen, Bogen-Spiegel an den Wänden.
Keine Menschen, keine Schrift, keine Gesichter (FESTE REGELN).

Öffnet blender/neubau.blend (fertig gebaut: umgebung → moschee → animation) und speichert nach blender/festsaal.blend
(neubau.blend und das Video bleiben unverändert). Texturen vorher: python3 tools/festsaal_texturen.py
    ../iqama-video/.venv-blender/bin/python blender/festsaal.py
Standbild: blender/festsaal_bild.py
"""
import math
import os
import random
import bpy
import bmesh  # erst nach bpy verfügbar
from mathutils import Matrix, Vector

HERE = os.path.dirname(os.path.abspath(__file__))
TEX = os.path.join(HERE, '..', 'assets', 'tex', 'festsaal')
random.seed(5)
bpy.ops.wm.open_mainfile(filepath=os.path.join(HERE, 'neubau.blend'))
sc = bpy.context.scene

BT, Y0, TT, KZ = 20.0, 0.3, 29.0, -3.2
Y1 = 12.3
RX0, RX1, RY0, RY1 = 0.3, BT - 0.3, Y0 + 0.3, TT - 0.3     # Innenkante der Kellerwände
FB = KZ + 0.035                                              # Oberkante Marmorboden
DECKE = -0.32                                                # weiße Decke (unter der Rohdecke)
BAND_U, BAND_O = -0.80, -0.64                                # abgehängte Bänder (Kassetten-Rahmen)
SAULEN = [(BT / 2, (Y0 + Y1) / 2), (BT / 2, Y1), (BT / 2, (Y1 + TT) / 2)]   # die 3 frei stehenden Stützen

C = bpy.data.collections.new('Festsaal'); sc.collection.children.link(C)


# ------------------------------------------------------------------ Materialien
def hexrgb(h):
    h = h.lstrip('#'); s = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(((c + 0.055) / 1.055) ** 2.4 if c > 0.04045 else c / 12.92 for c in s) + (1.0,)


def mat(name, hexf, rough=0.5, metal=0.0, **kw):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = hexrgb(hexf)
    b.inputs['Roughness'].default_value = rough; b.inputs['Metallic'].default_value = metal
    for k, v in kw.items():
        b.inputs[k].default_value = v
    return m


def licht_mat(name, farbe, staerke):
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    e = nt.nodes.new('ShaderNodeEmission'); o = nt.nodes.new('ShaderNodeOutputMaterial')
    e.inputs['Color'].default_value = farbe + (1,) if len(farbe) == 3 else farbe; e.inputs['Strength'].default_value = staerke
    nt.links.new(e.outputs[0], o.inputs[0])
    return m


def bild_mat(name, datei, meter_u, meter_v, rough=0.5, **kw):
    """Material mit Bildtextur über UV (die UV wird beim Bauen in Metern / Kachelgröße gesetzt)."""
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree
    b = nt.nodes['Principled BSDF']
    t = nt.nodes.new('ShaderNodeTexImage'); t.image = bpy.data.images.load(os.path.join(TEX, datei))
    nt.links.new(t.outputs['Color'], b.inputs['Base Color'])
    b.inputs['Roughness'].default_value = rough
    for k, v in kw.items():
        b.inputs[k].default_value = v
    return m


MARMOR = bild_mat('Saal_Marmor', 'marmor.jpg', 4.8, 4.8, rough=0.07, **{'Coat Weight': 0.4, 'Coat Roughness': 0.03})
TEPPICH = bild_mat('Saal_Teppich', 'teppich.jpg', 2.4, 3.6, rough=0.95, **{'Sheen Weight': 0.4})
WAND = mat('Saal_Wand', '#EFECE7', 0.55)
DECKE_M = mat('Saal_Decke', '#F4F3F1', 0.7)
WEISS_GL = mat('Saal_Weiss_glanz', '#F3F1EC', 0.25)
GOLD = mat('Saal_Gold', '#E8C27A', 0.22, 1.0)
GOLD_MATT = mat('Saal_Gold_matt', '#D9B36B', 0.38, 1.0)
SAMT = mat('Saal_Samt_beige', '#D7C6AA', 0.75, **{'Sheen Weight': 0.8, 'Sheen Roughness': 0.4})
TUCH = mat('Saal_Tischdecke', '#F5F3EF', 0.4, **{'Sheen Weight': 0.5, 'Sheen Roughness': 0.3})
PORZELLAN = mat('Saal_Porzellan', '#FBFAF7', 0.15)
GLAS = mat('Saal_Glas', '#FFFFFF', 0.0, **{'Transmission Weight': 1.0, 'IOR': 1.45})
KRISTALL = mat('Saal_Kristall', '#FFFFFF', 0.0, **{'Transmission Weight': 1.0, 'IOR': 1.6})
SPIEGEL = mat('Saal_Spiegel', '#E9ECEE', 0.02, 1.0)
BLUETE_W = mat('Saal_Bluete_weiss', '#F6F2EA', 0.6, **{'Subsurface Weight': 0.3})
BLUETE_R = mat('Saal_Bluete_rosa', '#E9BFC0', 0.6, **{'Subsurface Weight': 0.3})
BLATT = mat('Saal_Blatt', '#5E7550', 0.6)
VORHANG = mat('Saal_Vorhang', '#FBF7F2', 0.6, **{'Transmission Weight': 0.35, 'Sheen Weight': 0.6})
LED_KALT = licht_mat('Saal_LED_kalt', (0.86, 0.93, 1.0), 40.0)
LED_WARM = licht_mat('Saal_LED_warm', (1.0, 0.82, 0.6), 18.0)
SPOT_M = licht_mat('Saal_Spot', (1.0, 0.97, 0.92), 25.0)
KERZE = licht_mat('Saal_Kerzenbirne', (1.0, 0.84, 0.62), 30.0)
BUEHNE_LICHT = licht_mat('Saal_Buehne_hinterleuchtet', (1.0, 0.92, 0.85), 2.5)


# ------------------------------------------------------------------ Bau-Hilfen (bmesh mit Materialindex)
class Bau:
    def __init__(self, mats):
        self.bm = bmesh.new(); self.mats = list(mats)

    def _setze(self, faces, mi, glatt=False):
        for f in faces:
            f.material_index = mi; f.smooth = glatt

    def quader(self, x0, y0, z0, x1, y1, z1, mi=0, fase=0.0):
        vor = set(self.bm.faces)
        r = bmesh.ops.create_cube(self.bm, size=1.0, matrix=Matrix.Translation(((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2))
                                  @ Matrix.Diagonal((x1 - x0, y1 - y0, z1 - z0, 1)))
        if fase:
            es = list({e for v in r['verts'] for e in v.link_edges})
            bmesh.ops.bevel(self.bm, geom=es, offset=fase, segments=2, affect='EDGES', profile=0.5)
        self._setze([f for f in self.bm.faces if f not in vor], mi)

    def kugel(self, c, r, mi=0, sx=1, sy=1, sz=1, n=1, glatt=True):
        res = bmesh.ops.create_icosphere(self.bm, subdivisions=n, radius=r,
                                         matrix=Matrix.Translation(c) @ Matrix.Diagonal((sx, sy, sz, 1)))
        self._setze({f for v in res['verts'] for f in v.link_faces}, mi, glatt)

    def ring(self, pts, mi=0, glatt=True, zu=True, deckel=False):
        """Fläche aus übereinanderliegenden Punktringen (Liste von Ringen gleicher Länge)."""
        vs = [[self.bm.verts.new(p) for p in r] for r in pts]
        n = len(pts[0]); fs = []
        for a, b in zip(vs, vs[1:]):
            for i in range(n if zu else n - 1):
                j = (i + 1) % n
                fs.append(self.bm.faces.new((a[i], a[j], b[j], b[i])))
        if deckel:
            fs.append(self.bm.faces.new(vs[-1])); fs.append(self.bm.faces.new(list(reversed(vs[0]))))
        self._setze(fs, mi, glatt)
        return vs

    def rohr(self, p0, p1, r0, r1=None, mi=0, n=8, deckel=True):
        p0, p1 = Vector(p0), Vector(p1); r1 = r0 if r1 is None else r1
        a = (p1 - p0).normalized(); hilf = Vector((0, 0, 1)) if abs(a.z) < 0.9 else Vector((1, 0, 0))
        u = a.cross(hilf).normalized(); w = a.cross(u)
        ringe = [[p + rr * (math.cos(2 * math.pi * i / n) * u + math.sin(2 * math.pi * i / n) * w) for i in range(n)]
                 for p, rr in ((p0, r0), (p1, r1))]
        self.ring(ringe, mi, True, True, deckel)

    def pfad(self, pts, r, mi=0, n=6, zu=False):
        for i in range(len(pts) - (0 if zu else 1)):
            self.rohr(pts[i], pts[(i + 1) % len(pts)], r, r, mi, n, deckel=False)

    def scheibe(self, c, r, z0, z1, mi=0, n=32):
        self.ring([[(c[0] + r * math.cos(2 * math.pi * i / n), c[1] + r * math.sin(2 * math.pi * i / n), z) for i in range(n)]
                   for z in (z0, z1)], mi, True, True, True)

    def polygon(self, pts, mi=0):
        f = self.bm.faces.new([self.bm.verts.new(p) for p in pts]); self._setze([f], mi)

    def objekt(self, name, uv_meter=None):
        me = bpy.data.meshes.new(name); self.bm.to_mesh(me); self.bm.free()
        for m in self.mats:
            me.materials.append(m)
        if uv_meter:
            uv = me.uv_layers.new(name='UVMap')
            for poly in me.polygons:
                nrm = poly.normal
                for li in poly.loop_indices:
                    co = me.vertices[me.loops[li].vertex_index].co
                    if abs(nrm.z) > 0.7:
                        uv.data[li].uv = (co.x / uv_meter[0], co.y / uv_meter[1])
                    elif abs(nrm.x) > 0.7:
                        uv.data[li].uv = (co.y / uv_meter[0], co.z / uv_meter[1])
                    else:
                        uv.data[li].uv = (co.x / uv_meter[0], co.z / uv_meter[1])
        ob = bpy.data.objects.new(name, me); C.objects.link(ob)
        return ob


def kopie(ob, name, ort, dreh=0.0):
    o = bpy.data.objects.new(name, ob.data); C.objects.link(o)
    o.location = ort; o.rotation_euler = (0, 0, dreh)
    return o


# ------------------------------------------------------------------ Boden, Wände, Treppenhäuser
b = Bau([MARMOR]); b.quader(RX0, RY0, KZ + 0.03, RX1, RY1, FB, 0); b.objekt('Saal_Boden', (4.8, 4.8))

b = Bau([WAND, WEISS_GL, GOLD_MATT])
d = 0.02
b.quader(RX0, RY0, FB, RX0 + d, RY1, DECKE, 0); b.quader(RX1 - d, RY0, FB, RX1, RY1, DECKE, 0)
b.quader(RX0 + d, RY0, FB, RX1 - d, RY0 + d, DECKE, 0); b.quader(RX0 + d, RY1 - d, FB, RX1 - d, RY1, DECKE, 0)
# Sockelleiste
for (x0, y0, x1, y1) in ((RX0 + d, RY0 + d, RX0 + 0.035, RY1 - d), (RX1 - 0.035, RY0 + d, RX1 - d, RY1 - d),
                         (RX0 + 0.035, RY0 + d, RX1 - 0.035, RY0 + 0.035), (RX0 + 0.035, RY1 - 0.035, RX1 - 0.035, RY1 - d)):
    b.quader(x0, y0, FB, x1, y1, FB + 0.12, 1)
# Treppenhäuser: die beiden Kellertreppen liegen hinter weißen Wänden mit Doppeltür (Tür weiß mit Goldgriffen)
TH = [(14.6, RY0, RX1, 2.2, 'y'), (RX0, 27.0, 5.5, RY1, 'y')]
for (x0, y0, x1, y1, _) in TH:
    if y0 <= RY0 + 0.01:                                  # vorn rechts: Wand bei y1, Seite bei x0
        b.quader(x0, y1 - 0.15, FB, x1 - d, y1, DECKE, 0); b.quader(x0, y0 + d, FB, x0 + 0.15, y1 - 0.15, DECKE, 0)
        b.quader(x0 + 0.15, y1, FB, x1 - d, y1 + 0.03, FB + 0.12, 1)
    else:                                                  # hinten links: Wand bei y0, Seite bei x1
        b.quader(x0 + d, y0, FB, x1, y0 + 0.15, DECKE, 0); b.quader(x1 - 0.15, y0 + 0.15, FB, x1, y1 - d, DECKE, 0)
        b.quader(x0 + d, y0 - 0.03, FB, x1 - 0.15, y0, FB + 0.12, 1)
b.objekt('Saal_Waende')


def tuer(cx, y, richtung):
    """Weiße Doppeltür mit Füllungen und Goldgriffen; richtung = Seite des Saals (+1: Saal bei größerem y)."""
    b = Bau([WEISS_GL, GOLD])
    s = richtung * 0.03; yy = y + richtung * 0.0
    b.quader(cx - 0.95, min(yy, yy + s), FB, cx + 0.95, max(yy, yy + s), FB + 2.35, 0)            # Zarge/Blatt
    for k in (-1, 1):
        x0 = cx + (0.08 if k > 0 else -0.86); x1 = x0 + 0.78
        for (z0, z1) in ((0.18, 1.0), (1.15, 2.15)):                                              # Füllungen
            b.pfad([(x0 + 0.08, yy + s * 1.6, FB + z0), (x1 - 0.08, yy + s * 1.6, FB + z0), (x1 - 0.08, yy + s * 1.6, FB + z1),
                    (x0 + 0.08, yy + s * 1.6, FB + z1)], 0.012, 1, 6, True)
        gx = cx + k * 0.12
        b.rohr((gx, yy + s * 2.2, FB + 0.85), (gx, yy + s * 2.2, FB + 1.25), 0.014, mi=1)
    b.pfad([(cx - 0.97, yy + s, FB), (cx - 0.97, yy + s, FB + 2.37), (cx + 0.97, yy + s, FB + 2.37), (cx + 0.97, yy + s, FB)], 0.03, 0, 6)
    return b.objekt(f'Saal_Tuer_{cx:.0f}_{y:.0f}')


tuer(16.9, 2.2, 1); tuer(3.0, 27.0, -1)

# ------------------------------------------------------------------ Kassettendecke mit indirekten LED-Bändern + Strahlern
XB = [(RX0, 1.2), (9.45, 10.55), (18.8, RX1)]
YB = [(RY0, 1.5), (5.75, 6.85), (11.75, 12.85), (20.1, 21.2), (27.8, RY1)]


def intervalle(bands, a, z):
    grenzen = sorted({a} | {z} | {v for bb in bands for v in bb})
    return [((u, v), any(abs(u - bb[0]) < 1e-6 and abs(v - bb[1]) < 1e-6 for bb in bands)) for u, v in zip(grenzen, grenzen[1:])]


XI, YI = intervalle(XB, RX0, RX1), intervalle(YB, RY0, RY1)
b = Bau([DECKE_M, LED_KALT])
b.quader(RX0, RY0, DECKE - 0.02, RX1, RY1, DECKE, 0)                       # weiße Deckenfläche
kassetten = []
for (xa, xb), xband in XI:
    for (ya, yb), yband in YI:
        if xband or yband:
            b.quader(xa, ya, BAND_U, xb, yb, BAND_O, 0)
        else:
            kassetten.append((xa, ya, xb, yb))
# Unterzüge weiß verkleidet (über den Bändern sichtbar in der Lichtfuge)
b.quader(BT / 2 - 0.25, RY0, BAND_O, BT / 2 + 0.25, RY1, DECKE - 0.02, 0)
for (ya, yb) in YB[1:4]:
    yc = (ya + yb) / 2; b.quader(RX0, yc - 0.25, BAND_O, BT / 2 - 0.25, yc + 0.25, DECKE - 0.02, 0)
    b.quader(BT / 2 + 0.25, yc - 0.25, BAND_O, RX1, yc + 0.25, DECKE - 0.02, 0)
# Lichtfuge: LED-Streifen auf dem Band, davor eine kleine Aufkantung (Streifen von unten nicht sichtbar)
for (xa, ya, xb, yb) in kassetten:
    o, w = 0.10, 0.03
    for (x0, y0, x1, y1) in ((xa - o - w, ya - o - w, xb + o + w, ya - o), (xa - o - w, yb + o, xb + o + w, yb + o + w),
                             (xa - o - w, ya - o, xa - o, yb + o), (xb + o, ya - o, xb + o + w, yb + o)):
        b.quader(x0, y0, BAND_O, x1, y1, BAND_O + 0.012, 1)
    for (x0, y0, x1, y1) in ((xa - 0.03, ya - 0.03, xb + 0.03, ya), (xa - 0.03, yb, xb + 0.03, yb + 0.03),
                             (xa - 0.03, ya, xa, yb), (xb, ya, xb + 0.03, yb)):
        b.quader(x0, y0, BAND_O, x1, y1, BAND_O + 0.06, 0)
b.objekt('Saal_Decke')

# Einbaustrahler in den Bändern (Leuchtscheibe + Spot nach unten)
spots = []
for x in [i * 1.9 + 1.0 for i in range(10)]:
    if 0.6 < x < 19.4:
        for (ya, yb) in YB:
            spots.append((x, (ya + yb) / 2))
for y in [i * 2.0 + 2.6 for i in range(13)]:
    for (xa, xb) in XB:
        if not any(ya - 0.3 < y < yb + 0.3 for ya, yb in YB):
            spots.append(((xa + xb) / 2, y))
b = Bau([GOLD_MATT, SPOT_M])
for (x, y) in spots:
    b.scheibe((x, y), 0.075, BAND_U - 0.008, BAND_U, 0, 20); b.scheibe((x, y), 0.05, BAND_U - 0.012, BAND_U - 0.008, 1, 20)
b.objekt('Saal_Einbaustrahler')
for i, (x, y) in enumerate(spots):
    ld = bpy.data.lights.new(f'Saal_Spot{i}', 'SPOT'); ld.energy = 18; ld.spot_size = math.radians(80); ld.spot_blend = 0.6
    ld.color = (1.0, 0.95, 0.88); ld.shadow_soft_size = 0.05
    lo = bpy.data.objects.new(f'Saal_Spot{i}', ld); lo.location = (x, y, BAND_U - 0.02); C.objects.link(lo)

# ------------------------------------------------------------------ Kristall-Kronleuchter (einer gebaut, Rest verknüpfte Kopien)
b = Bau([GOLD, KRISTALL, KERZE, PORZELLAN])
b.scheibe((0, 0), 0.13, -0.05, 0.0, 0, 24); b.rohr((0, 0, -0.05), (0, 0, -0.14), 0.07, 0.03, 0, 16)
for k in range(8):                                                    # Kristallkette im Schaft
    b.kugel((0, 0, -0.16 - k * 0.032), 0.016, 1, sz=1.3)
RINGE = [(0.48, -0.36, 40, 5), (0.34, -0.47, 28, 4), (0.20, -0.57, 18, 4)]
for (r, z, n, lang) in RINGE:
    b.pfad([(r * math.cos(2 * math.pi * i / 36), r * math.sin(2 * math.pi * i / 36), z) for i in range(36)], 0.009, 0, 6, True)
    for i in range(n):
        a = 2 * math.pi * (i + 0.5) / n
        for k in range(lang):
            b.kugel((r * math.cos(a), r * math.sin(a), z - 0.03 - k * 0.034), 0.0135, 1, sz=1.35)
        b.kugel((r * math.cos(a), r * math.sin(a), z - 0.035 - lang * 0.034), 0.022, 1, sz=1.8)     # Tropfen
for i in range(6):                                                    # Arme vom Schaft zu den Ringen
    a = 2 * math.pi * i / 6
    b.pfad([(0, 0, -0.30), (0.25 * math.cos(a), 0.25 * math.sin(a), -0.33), (0.48 * math.cos(a), 0.48 * math.sin(a), -0.36)], 0.01, 0)
# Krone oben: Vorhang aus Kristallketten
for i in range(24):
    a = 2 * math.pi * i / 24
    for k in range(5):
        b.kugel((0.24 * math.cos(a), 0.24 * math.sin(a), -0.13 - k * 0.034), 0.012, 1, sz=1.3)
b.pfad([(0.24 * math.cos(2 * math.pi * i / 24), 0.24 * math.sin(2 * math.pi * i / 24), -0.12) for i in range(24)], 0.007, 0, 6, True)
# Girlanden zwischen den Ringpunkten
for i in range(12):
    a0, a1 = 2 * math.pi * i / 12, 2 * math.pi * (i + 1) / 12
    for k in range(1, 9):
        t = k / 9; a = a0 + (a1 - a0) * t
        b.kugel((0.48 * math.cos(a), 0.48 * math.sin(a), -0.36 - 0.07 * math.sin(math.pi * t)), 0.011, 1)
# Kerzenbirnen auf dem oberen Ring
for i in range(12):
    a = 2 * math.pi * i / 12; x, y = 0.48 * math.cos(a), 0.48 * math.sin(a)
    b.scheibe((x, y), 0.022, -0.355, -0.27, 3, 10); b.kugel((x, y, -0.245), 0.02, 2, sz=1.5)
b.kugel((0, 0, -0.66), 0.055, 1, n=2)                                 # Kristallkugel unten
KRONE = b.objekt('Saal_Kronleuchter0')
orte = []
for (xa, ya, xb, yb) in kassetten:
    cx, cy = (xa + xb) / 2, (ya + yb) / 2
    orte += [(cx, cy - (yb - ya) / 4), (cx, cy + (yb - ya) / 4)] if (yb - ya) > 7 else [(cx, cy)]
for k, (cx, cy) in enumerate(orte):
    o = KRONE if k == 0 else kopie(KRONE, 'Saal_Kronleuchter', (0, 0, 0))
    o.location = (cx, cy, DECKE - 0.02)
    ld = bpy.data.lights.new('Saal_Kronleuchter_Licht', 'POINT'); ld.energy = 140; ld.shadow_soft_size = 0.2
    ld.color = (1.0, 0.86, 0.68)
    lo = bpy.data.objects.new('Saal_Kronleuchter_Licht', ld); lo.location = (cx, cy, DECKE - 0.45); C.objects.link(lo)

# ------------------------------------------------------------------ Stützen weiß verkleidet (Sockel, Kapitell, Goldband)
b = Bau([WEISS_GL, GOLD_MATT])
for (x, y) in SAULEN:
    b.quader(x - 0.32, y - 0.32, FB, x + 0.32, y + 0.32, BAND_U, 0)
    b.quader(x - 0.38, y - 0.38, FB, x + 0.38, y + 0.38, FB + 0.18, 0, fase=0.02)
    b.quader(x - 0.37, y - 0.37, BAND_U - 0.16, x + 0.37, y + 0.37, BAND_U, 0, fase=0.02)
    b.quader(x - 0.335, y - 0.335, FB + 0.2, x + 0.335, y + 0.335, FB + 0.23, 1)
    b.quader(x - 0.335, y - 0.335, BAND_U - 0.2, x + 0.335, y + 0.335, BAND_U - 0.17, 1)
b.objekt('Saal_Stuetzen')


# ------------------------------------------------------------------ Blumen
def blumenball(b, c, r, n, mi_w, mi_r, anteil_rosa=0.35, blatt_mi=None):
    for i in range(n):
        u, v = random.random(), random.random()
        th = 2 * math.pi * u; ph = math.acos(2 * v - 1)
        if ph > 2.3:
            continue
        rr = r * (0.92 + 0.1 * random.random())
        p = (c[0] + rr * math.sin(ph) * math.cos(th), c[1] + rr * math.sin(ph) * math.sin(th), c[2] + rr * math.cos(ph))
        b.kugel(p, r * (0.16 + 0.08 * random.random()), mi_r if random.random() < anteil_rosa else mi_w, sz=0.75, n=1)
    if blatt_mi is not None:
        for i in range(n // 6):
            th = 2 * math.pi * random.random()
            p = (c[0] + r * 1.02 * math.cos(th), c[1] + r * 1.02 * math.sin(th), c[2] - r * 0.35)
            b.kugel(p, r * 0.2, blatt_mi, sx=1.6, sy=0.6, sz=0.25, n=1)


def blumensaeule(name, x, y, h=1.05, r=0.32):
    """Weiße Säule mit goldener Vase und großem Blumenstrauß (wie im Video)."""
    b = Bau([WEISS_GL, GOLD, BLUETE_W, BLUETE_R, BLATT])
    b.quader(x - 0.24, y - 0.24, FB, x + 0.24, y + 0.24, FB + 0.08, 0, fase=0.015)
    b.quader(x - 0.19, y - 0.19, FB + 0.08, x + 0.19, y + 0.19, FB + h - 0.08, 0)
    b.quader(x - 0.24, y - 0.24, FB + h - 0.08, x + 0.24, y + 0.24, FB + h, 0, fase=0.015)
    zz = FB + h
    b.ring([[(x + rr * math.cos(2 * math.pi * i / 24), y + rr * math.sin(2 * math.pi * i / 24), zz + dz) for i in range(24)]
            for rr, dz in ((0.08, 0.0), (0.16, 0.08), (0.17, 0.22), (0.13, 0.3), (0.15, 0.34))], 1, True, True, False)
    blumenball(b, (x, y, zz + 0.34 + r * 0.6), r, 160, 2, 3, 0.45, 4)
    return b.objekt(name)


# ------------------------------------------------------------------ Tisch (rund, Tischdecke bis zum Boden) + Gedeck + Blumen
b = Bau([TUCH, GOLD, PORZELLAN, GLAS, BLUETE_W, BLUETE_R, BLATT])
n = 64; ringe = []
for k, z in enumerate((0.0, 0.25, 0.5, 0.70, 0.745)):
    amp = 0.018 * (1 - z / 0.75) ** 1.5
    r = 0.985 - 0.06 * (z / 0.75)
    ringe.append([((r + amp * math.sin(14 * 2 * math.pi * i / n)) * math.cos(2 * math.pi * i / n),
                   (r + amp * math.sin(14 * 2 * math.pi * i / n)) * math.sin(2 * math.pi * i / n), z + 0.005) for i in range(n)])
ringe.append([(0.915 * math.cos(2 * math.pi * i / n), 0.915 * math.sin(2 * math.pi * i / n), 0.76) for i in range(n)])
b.ring(ringe, 0, True, True, False)
b.polygon([(0.915 * math.cos(2 * math.pi * i / n), 0.915 * math.sin(2 * math.pi * i / n), 0.76) for i in range(n)], 0)
for i in range(10):
    a = 2 * math.pi * i / 10; x, y = 0.66 * math.cos(a), 0.66 * math.sin(a)
    b.scheibe((x, y), 0.16, 0.76, 0.768, 1, 28); b.scheibe((x, y), 0.12, 0.768, 0.778, 2, 28)
    b.quader(x - 0.05, y - 0.05, 0.778, x + 0.05, y + 0.05, 0.80, 0)                         # gefaltete Serviette
    gx, gy = 0.70 * math.cos(a + 0.2), 0.70 * math.sin(a + 0.2)
    b.ring([[(gx + rr * math.cos(2 * math.pi * j / 14), gy + rr * math.sin(2 * math.pi * j / 14), 0.76 + z) for j in range(14)]
            for rr, z in ((0.03, 0.0), (0.03, 0.005), (0.005, 0.01), (0.005, 0.09), (0.035, 0.12), (0.042, 0.19))], 3, True, True, False)
# Mittelstück: hohe Glasvase mit Goldfuß und weißem Blumenball
b.scheibe((0, 0), 0.12, 0.76, 0.78, 1, 24)
b.ring([[(0.045 * math.cos(2 * math.pi * j / 16), 0.045 * math.sin(2 * math.pi * j / 16), z) for j in range(16)]
        for z in (0.78, 1.28)], 3, True, True, False)
b.scheibe((0, 0), 0.09, 1.28, 1.3, 1, 24)
blumenball(b, (0, 0, 1.48), 0.22, 120, 4, 5, 0.25, 6)
for i in range(6):                                                    # kleine Teelichter
    a = 2 * math.pi * i / 6 + 0.3
    b.scheibe((0.3 * math.cos(a), 0.3 * math.sin(a)), 0.03, 0.76, 0.82, 3, 12)
TISCH = b.objekt('Saal_Tisch0')

# ------------------------------------------------------------------ Stuhl: goldenes Gestell, ovale Polsterlehne (Blick nach −y)
b = Bau([GOLD, SAMT])
b.quader(-0.225, -0.215, 0.43, 0.225, 0.215, 0.455, 0)                                       # Sitzrahmen
b.quader(-0.215, -0.21, 0.455, 0.215, 0.205, 0.52, 1, fase=0.025)                             # Sitzpolster
for sx in (-1, 1):
    b.rohr((sx * 0.215, -0.235, 0.0), (sx * 0.2, -0.2, 0.44), 0.013, 0.017, 0)                  # Vorderbeine (leicht gespreizt)
    b.rohr((sx * 0.215, 0.27, 0.0), (sx * 0.2, 0.2, 0.44), 0.013, 0.017, 0)                      # Hinterbeine (nach hinten)
ell = []
for i in range(40):
    t = 2 * math.pi * i / 40
    x, z = 0.205 * math.sin(t), 0.285 * math.cos(t)
    ell.append((x, z))
neig = math.radians(8)
P = lambda x, z, dy=0.0: (x, 0.215 + dy + (z + 0.285) * math.sin(neig), 0.52 + (z + 0.285) * math.cos(neig))
b.pfad([P(x, z) for x, z in ell], 0.016, 0, 8, True)                                         # Goldrahmen der Lehne
for dy in (-0.022, 0.022):                                                                    # Polster (Vorder- und Rückseite)
    pts = [P(x * 0.92, z * 0.93, dy) for x, z in ell]
    b.polygon(pts if dy > 0 else list(reversed(pts)), 1)
b.ring([[P(x * 0.92, z * 0.93, dy) for x, z in ell] for dy in (-0.022, 0.022)], 1, True, True, False)
STUHL = b.objekt('Saal_Stuhl0')
for p in STUHL.data.polygons:
    p.use_smooth = p.material_index == 0 or len(p.vertices) == 4

# Tischordnung: 4 Reihen in x (Mittelgang mit Teppichen frei), 6 Reihen in y → 24 Tische × 10 Stühle = 240 Plätze
TX = (2.95, 6.85, 13.15, 17.05)
TY = (4.1, 7.95, 11.8, 15.65, 19.5, 23.35)
erster = True
for tx in TX:
    for ty in TY:
        t = TISCH if erster else kopie(TISCH, 'Saal_Tisch', (0, 0, 0))
        t.location = (tx, ty, FB); t.rotation_euler = (0, 0, random.random() * 0.6)
        for i in range(10):
            a = 2 * math.pi * i / 10 + t.rotation_euler.z + math.pi / 10
            s = STUHL if erster and i == 0 else kopie(STUHL, 'Saal_Stuhl', (0, 0, 0))
            s.location = (tx + 1.22 * math.cos(a), ty + 1.22 * math.sin(a), FB)
            s.rotation_euler = (0, 0, a - math.pi / 2 + random.uniform(-0.06, 0.06))
        erster = False

# ------------------------------------------------------------------ Teppiche im Mittelgang (wie im Video)
b = Bau([TEPPICH])
for (y0, y1) in ((1.7, 5.3), (21.6, 25.2)):
    b.quader(8.8, y0, FB, 11.2, y1, FB + 0.012, 0)
ob = b.objekt('Saal_Teppiche')
uv = ob.data.uv_layers.new(name='UVMap')
for poly in ob.data.polygons:
    for li in poly.loop_indices:
        co = ob.data.vertices[ob.data.loops[li].vertex_index].co
        y0 = 1.7 if co.y < 13 else 21.6
        uv.data[li].uv = ((co.x - 8.8) / 2.4, (co.y - y0) / 3.6)

# ------------------------------------------------------------------ Bühne mit Sofa, Bögen und Blumen (hinten, Mitte)
SB0, SB1, SY0, SH = 6.0, 14.0, 25.9, 0.35
b = Bau([MARMOR, WEISS_GL, LED_WARM, GOLD_MATT])
b.quader(SB0, SY0, FB, SB1, RY1 - 0.02, FB + SH, 0)
b.quader(SB0 - 0.01, SY0 - 0.01, FB + 0.02, SB1 + 0.01, SY0, FB + SH - 0.04, 1)
b.quader(SB0, SY0 - 0.03, FB + SH - 0.03, SB1, SY0 - 0.01, FB + SH - 0.015, 2)                # Lichtkante
for k, (yy, zz) in enumerate(((SY0 - 0.35, SH * 2 / 3), (SY0 - 0.7, SH / 3))):
    b.quader(8.6, yy, FB, 11.4, yy + 0.35, FB + zz, 0)
ob = b.objekt('Saal_Buehne', (4.8, 4.8))
# Rückwand der Bühne: drei Bögen mit Goldrahmen, hinterleuchteter Stoff
b = Bau([WEISS_GL, GOLD, VORHANG, BUEHNE_LICHT])
yw = RY1 - 0.05
zb = FB + SH
b.quader(5.6, yw - 0.06, zb, 14.4, yw, BAND_U, 0)


def bogen_pts(cx, w, z0, zg, n=24, y=0.0):
    pts = [(cx - w / 2, y, z0), (cx - w / 2, y, zg)]
    for i in range(1, n):
        a = math.pi - math.pi * i / n
        pts.append((cx + w / 2 * math.cos(a), y, zg + w / 2 * math.sin(a)))
    pts += [(cx + w / 2, y, zg), (cx + w / 2, y, z0)]
    return pts


for cx, w, hg in ((10.0, 2.6, 0.9), (7.3, 1.7, 0.75), (12.7, 1.7, 0.75)):
    pts = bogen_pts(cx, w, zb, zb + hg, 24, yw - 0.07)
    b.pfad(pts, 0.035, 1, 8)
    b.polygon(list(reversed([(x, yw - 0.065, z) for x, _, z in pts])), 3)
    # Stoffbahnen in Falten vor dem Licht
    for k in range(int(w / 0.12)):
        x = cx - w / 2 + 0.06 + k * 0.12
        top = zb + hg + math.sqrt(max(0, (w / 2) ** 2 - (x - cx) ** 2)) - 0.02
        b.rohr((x, yw - 0.12, zb), (x, yw - 0.12, top), 0.05, 0.03, 2, 8)
b.objekt('Saal_Buehne_Boegen')
# Sofa (getuftet angedeutet)
b = Bau([SAMT, GOLD])
sy = 27.9
b.quader(8.95, sy - 0.45, zb + 0.08, 11.05, sy + 0.35, zb + 0.45, 0, fase=0.04)
b.quader(8.95, sy + 0.18, zb + 0.45, 11.05, sy + 0.42, zb + 1.0, 0, fase=0.06)
for sx in (8.95, 10.88):
    b.quader(sx, sy - 0.45, zb + 0.45, sx + 0.17, sy + 0.3, zb + 0.72, 0, fase=0.06)
for i in range(9):
    for j in range(2):
        b.kugel((9.15 + i * 0.21, sy + 0.17, zb + 0.62 + j * 0.2), 0.012, 1)
for sx in (9.0, 11.0):
    for sy2 in (sy - 0.4, sy + 0.3):
        b.rohr((sx, sy2, zb), (sx, sy2, zb + 0.08), 0.02, 0.015, 1)
b.objekt('Saal_Sofa')
# Blumen: Säulen links/rechts der Bühne, Girlande an der Bühnenkante, Säulen am Eingang des Mittelgangs
blumensaeule('Saal_Blumensaeule_BL', 5.4, 25.4); blumensaeule('Saal_Blumensaeule_BR', 14.6, 25.4)
blumensaeule('Saal_Blumensaeule_EL', 8.3, 1.4, 1.1); blumensaeule('Saal_Blumensaeule_ER', 11.7, 1.4, 1.1)
b = Bau([BLUETE_W, BLUETE_R, BLATT])
for k in range(30):
    x = SB0 + 0.1 + k * (SB1 - SB0 - 0.2) / 29
    if 8.5 < x < 11.5:
        continue
    blumenball(b, (x, SY0 - 0.05, FB + SH + 0.06), 0.13, 26, 0, 1, 0.5, 2)
for x in (8.7, 11.3):
    blumenball(b, (x, 27.9, zb + 0.35), 0.28, 120, 0, 1, 0.45, 2)
b.objekt('Saal_Blumen_Buehne')

# ------------------------------------------------------------------ Seitenwände: Bogen-Spiegel mit Goldrahmen + Wandleuchten
b = Bau([SPIEGEL, GOLD, KERZE, WEISS_GL])
spiegel_y = (3.6, 7.95, 11.8, 15.65, 19.5, 23.35)
for xw, s in ((RX0 + 0.02, 1), (RX1 - 0.02, -1)):
    for yc in spiegel_y:
        if s < 0 and yc < 3.0:
            continue                                                 # dort ist das Treppenhaus vorn rechts
        w, z0, zg = 1.2, FB + 0.25, FB + 1.55
        pts = [(xw + s * 0.015, yc + (y - 0), z) for (y, _, z) in [(p[0] - 0, p[1], p[2]) for p in bogen_pts(0.0, w, z0, zg, 24)]]
        b.polygon(pts if s > 0 else list(reversed(pts)), 0)
        b.pfad([(xw + s * 0.03, yy, zz) for (_, yy, zz) in pts], 0.03, 1, 8)
        b.pfad([(xw + s * 0.03, pts[0][1], z0), (xw + s * 0.03, pts[-1][1], z0)], 0.03, 1, 8)
        for dy in (-1.0, 1.0):                                        # Wandleuchten links/rechts vom Spiegel
            yy = yc + dy
            b.quader(min(xw, xw + s * 0.03), yy - 0.06, FB + 1.75, max(xw, xw + s * 0.03), yy + 0.06, FB + 1.95, 1)
            b.rohr((xw + s * 0.03, yy, FB + 1.8), (xw + s * 0.16, yy, FB + 1.85), 0.012, mi=1)
            b.scheibe((xw + s * 0.16, yy), 0.025, FB + 1.85, FB + 1.93, 3, 12)
            b.kugel((xw + s * 0.16, yy, FB + 1.96), 0.02, 2, sz=1.5)
b.objekt('Saal_Spiegel_Wandleuchten')

# ------------------------------------------------------------------ Licht-Stimmung: zartes Flieder an der Bühnenwand (wie im Video)
for i, x in enumerate((6.2, 13.8)):
    ld = bpy.data.lights.new(f'Saal_Flieder{i}', 'AREA'); ld.energy = 220; ld.size = 0.6; ld.color = (0.78, 0.6, 1.0)
    lo = bpy.data.objects.new(f'Saal_Flieder{i}', ld); lo.location = (x, RY1 - 0.6, zb + 0.05)
    lo.rotation_euler = (math.radians(-60), 0, 0); C.objects.link(lo)

# Rohbau-Teile des Kellers, die der Ausbau ersetzt/verdeckt
for o in bpy.data.objects:
    if o.name.startswith(('Keller_Wandleuchten', 'Keller_Unterzuege', 'Keller_Saeulen', 'Keller_Treppe')):
        o.hide_render = True
print('Festsaal gebaut:', len(C.objects), 'Objekte,', len(spots), 'Strahler,', len(kassetten), 'Kassetten')
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(HERE, 'festsaal.blend'), relative_remap=True)
