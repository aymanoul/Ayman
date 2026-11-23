#!/usr/bin/env python3
"""Festsaal im Keller (Ayman 23.11.): Einrichtung nach seinem Video von einem Festsaal (Hochzeitssaal-Stil, für Babyfeiern,
Nikah usw.): weißer, glänzender Marmorboden 120×120 mit feinen braun-goldenen Adern, Teppiche mit Ornament-Bordüre,
Kassettendecke mit indirekten LED-Bändern und Einbaustrahlern, schlichte Ringleuchten, runde Tische mit weißen Tischdecken,
schlichte Bankettstühle, Bildschirm + Rednerpult. Ayman 23.11.: Mehrzweckraum für Feiern UND Wissens-Seminare – kein reiner
Hochzeitssaal (keine Bühne/Sofa), wenig Schmuck, kein Gold, nicht zu edel, nicht zu glänzend.
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
HX0 = BT - 16.43                                             # Ayman 23.11.: Keller unter dem Hof nur HX0 … BT (L-Form)
HXI = HX0 + 0.3                                              # Innenkante der linken Kellerwand unter dem Hof
XM_A, XM_B, YM_A, YM_B = BT / 2, (HX0 + BT) / 2, (Y0 + Y1) / 2, (Y1 + TT) / 2
SAULEN = [(XM_A, YM_A), (XM_A, Y1), (XM_B, YM_B)]            # die 3 frei stehenden Stützen
RAUM_A, RAUM_B = (RX0, RY0, RX1, Y1), (HXI, Y1, RX1, RY1)    # Raum unter der Moschee / Raum unter dem Hof
# Innenkanten der Kellerwände (L-Form) mit Normale in den Raum
WAND_LINIEN = [((RX0, RY0), (RX1, RY0), (0, 1)), ((RX1, RY0), (RX1, RY1), (-1, 0)), ((HXI, RY1), (RX1, RY1), (0, -1)),
               ((HXI, Y1), (HXI, RY1), (1, 0)), ((RX0, Y1), (HXI, Y1), (0, -1)), ((RX0, RY0), (RX0, Y1), (1, 0))]


def wand_streifen(b, dicke, z0, z1, mi, abstand=0.0, kuerzen=0.0):
    """Für jede Wandlinie einen Quader (dicke) innen an der Wand (abstand = Versatz von der Wand)."""
    for (x0, y0), (x1, y1), (nx, ny) in WAND_LINIEN:
        if nx:
            xa = x0 + nx * abstand; xb = xa + nx * dicke
            b.quader(min(xa, xb), y0 + kuerzen, z0, max(xa, xb), y1 - kuerzen, z1, mi)
        else:
            ya = y0 + ny * abstand; yb = ya + ny * dicke
            b.quader(x0 + kuerzen, min(ya, yb), z0, x1 - kuerzen, max(ya, yb), z1, mi)

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
    t = nt.nodes.new('ShaderNodeTexImage'); t.image = bpy.data.images.load(datei if os.path.isabs(datei) else os.path.join(TEX, datei))
    nt.links.new(t.outputs['Color'], b.inputs['Base Color'])
    b.inputs['Roughness'].default_value = rough
    for k, v in kw.items():
        b.inputs[k].default_value = v
    return m


MARMOR = bild_mat('Saal_Marmor', 'marmor.jpg', 4.8, 4.8, rough=0.2)          # Ayman 23.11.: nicht so glänzend
TEPPICH = bild_mat('Saal_Teppich', 'teppich.jpg', 2.4, 3.6, rough=0.95, **{'Sheen Weight': 0.4})
# Farbvarianten (Ayman 23.11.: „zu weiß, zu eintönig“): Umgebungsvariable FARBE = A | B | C (leer = alles hell)
#  A „Warm & Holz“: Wände sandbeige, Eichen-Verkleidung unten, Stühle taupe, Tischläufer salbeigrün
#  B „Salbeigrün“: Wände salbeigrün, Stühle grau, Tischläufer sand
#  C „Holzboden“: Boden Eiche (Laminat-Optik), Wände hell-warm, Stühle anthrazit, Tischläufer terrakotta
FARBE = os.environ.get('FARBE', 'W')                     # W = Aymans Wahl (23.11.)
VAR = {'A': dict(wand='#E0D3C0', stoff='#958675', laeufer='#8A9A79', holz_unten=True, boden='marmor'),
       'B': dict(wand='#B3BEA6', stoff='#8C918A', laeufer='#C9B696', holz_unten=False, boden='marmor'),
       'C': dict(wand='#EAE2D6', stoff='#6C6864', laeufer='#AE6A4E', holz_unten=False, boden='holz'),
       # Ayman 23.11.: C gewählt (Holzboden bleibt), Tischdecken + Stühle besser kombinieren → C1/C2/C3
       'C1': dict(wand='#EAE2D6', stoff='#8A7A69', laeufer='#8A9A79', tuch='#E4DACA', gestell='#5E5A55', holz_unten=False, boden='holz'),
       'C2': dict(wand='#EAE2D6', stoff='#6E7458', laeufer='#6E7458', tuch='#F1EEE7', gestell='#8F8D88', holz_unten=False, boden='holz'),
       'C3': dict(wand='#EAE2D6', stoff='#946A4B', laeufer=None, tuch='#DCD8D0', gestell='#3E3C3A', holz_unten=False, boden='holz'),
       # Aymans Wahl 23.11. (Bild `assets/saal_wahl_ayman.jpg`): wie A, aber DUNKELBRAUNES Holz an der Wand und bei den Stühlen,
       # Tischläufer in derselben Farbe, in der Tischmitte eine größere marokkanische Atay-Kanne mit traditionellen Teegläsern
       'W': dict(wand='#E0D3C0', stoff='#5C4434', laeufer='#4A3326', gestell='#3B2719', holz_unten=True, holz='dunkel',
                 boden='marmor', holzstuhl=True, atay=True),
       }.get(FARBE)
EICHE = os.path.join(HERE, '..', 'assets', 'tex', 'ph', 'laminate_floor_02_diff.jpg')
HOLZ_M = bild_mat('Saal_Eiche', EICHE, 2.0, 2.0, rough=0.45)
if VAR and VAR.get('holz') == 'dunkel':
    HOLZ_M = bild_mat('Saal_Holz_dunkel', 'holz_dunkel.jpg', 2.0, 2.0, rough=0.5)
WAND = mat('Saal_Wand', VAR['wand'] if VAR else '#EFECE7', 0.55)
DECKE_M = mat('Saal_Decke', '#F4F3F1', 0.7)
WEISS_GL = mat('Saal_Weiss_glanz', '#F1EFEA', 0.5)
GOLD = mat('Saal_Gold', '#C8B89A', 0.5, 0.55)              # Ayman 23.11.: weniger Gold → mattes Champagner
GOLD_MATT = mat('Saal_Gold_matt', '#C4B699', 0.6, 0.4)
SAMT = mat('Saal_Samt_beige', '#D3C8B6', 0.85, **{'Sheen Weight': 0.4, 'Sheen Roughness': 0.5})
TUCH = mat('Saal_Tischdecke', VAR.get('tuch', '#F3F1EC') if VAR else '#F3F1EC', 0.7, **{'Sheen Weight': 0.2, 'Sheen Roughness': 0.5})
if VAR and VAR.get('atay'):
    # Damast-Tischdecke creme (Aymans Vorlage), Muster über Objektkoordinaten (Würfelprojektion, Wiederholung 0,4 m)
    TUCH = bpy.data.materials.new('Saal_Tischdecke_Damast'); TUCH.use_nodes = True; _nt = TUCH.node_tree
    _bs = _nt.nodes['Principled BSDF']; _bs.inputs['Roughness'].default_value = 0.6
    _bs.inputs['Sheen Weight'].default_value = 0.45; _bs.inputs['Sheen Roughness'].default_value = 0.35
    _tc = _nt.nodes.new('ShaderNodeTexCoord'); _mp = _nt.nodes.new('ShaderNodeMapping'); _mp.inputs['Scale'].default_value = (2.5, 2.5, 2.5)
    _im = _nt.nodes.new('ShaderNodeTexImage'); _im.image = bpy.data.images.load(os.path.join(TEX, 'damast.jpg'))
    _im.projection = 'BOX'; _im.projection_blend = 0.3
    _nt.links.new(_tc.outputs['Object'], _mp.inputs['Vector']); _nt.links.new(_mp.outputs['Vector'], _im.inputs['Vector'])
    _nt.links.new(_im.outputs['Color'], _bs.inputs['Base Color'])
PORZELLAN = mat('Saal_Porzellan', '#FBFAF7', 0.15)
GLAS = mat('Saal_Glas', '#FFFFFF', 0.0, **{'Transmission Weight': 1.0, 'IOR': 1.45})
KRISTALL = mat('Saal_Kristall', '#FFFFFF', 0.0, **{'Transmission Weight': 1.0, 'IOR': 1.6})
SPIEGEL = mat('Saal_Spiegel', '#E9ECEE', 0.02, 1.0)
BLUETE_W = mat('Saal_Bluete_weiss', '#F6F2EA', 0.6, **{'Subsurface Weight': 0.3})
BLUETE_R = mat('Saal_Bluete_rosa', '#E9BFC0', 0.6, **{'Subsurface Weight': 0.3})
BLATT = mat('Saal_Blatt', '#5E7550', 0.6)
LED_KALT = licht_mat('Saal_LED_kalt', (0.86, 0.93, 1.0), 40.0)
SPOT_M = licht_mat('Saal_Spot', (1.0, 0.97, 0.92), 25.0)
KERZE = licht_mat('Saal_Kerzenbirne', (1.0, 0.84, 0.62), 30.0)


# ------------------------------------------------------------------ Bau-Hilfen (bmesh mit Materialindex)
class Bau:
    def __init__(self, mats):
        self.bm = bmesh.new(); self.mats = list(mats)

    def _setze(self, faces, mi, glatt=False):
        for f in faces:
            f.material_index = mi; f.smooth = glatt

    def quader(self, x0, y0, z0, x1, y1, z1, mi=0, fase=0.0, seg=2, glatt=False, scher=None, wulst=0.0):
        vor = set(self.bm.faces)
        r = bmesh.ops.create_cube(self.bm, size=1.0, matrix=Matrix.Translation(((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2))
                                  @ Matrix.Diagonal((x1 - x0, y1 - y0, z1 - z0, 1)))
        if fase:
            es = list({e for v in r['verts'] for e in v.link_edges})
            bmesh.ops.bevel(self.bm, geom=es, offset=fase, segments=seg, affect='EDGES', profile=0.5)
        neu = [f for f in self.bm.faces if f not in vor]
        vs = {v for f in neu for v in f.verts}
        if wulst:                                    # Polster: Mitte leicht aufgewölbt (Unterteilen + Aufwölben der Oberseite)
            for v in vs:
                if v.co.z > (z0 + z1) / 2:
                    u = 1 - (2 * (v.co.x - (x0 + x1) / 2) / (x1 - x0)) ** 2; w = 1 - (2 * (v.co.y - (y0 + y1) / 2) / (y1 - y0)) ** 2
                    v.co.z += wulst * max(0, u) * max(0, w)
        if scher:                                    # Scherung y += k·(z − zref) (geneigte Lehne)
            zref, k = scher
            for v in vs:
                v.co.y += k * (v.co.z - zref)
        self._setze(neu, mi, glatt)

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
if VAR and VAR['boden'] == 'holz':
    b = Bau([HOLZ_M]); [b.quader(r[0], r[1], KZ + 0.03, r[2], r[3], FB, 0) for r in (RAUM_A, RAUM_B)]; b.objekt('Saal_Boden', (2.0, 2.0))
else:
    b = Bau([MARMOR]); [b.quader(r[0], r[1], KZ + 0.03, r[2], r[3], FB, 0) for r in (RAUM_A, RAUM_B)]; b.objekt('Saal_Boden', (4.8, 4.8))

b = Bau([WAND, WEISS_GL, GOLD_MATT])
d = 0.02
wand_streifen(b, d, FB, DECKE, 0)                                           # Wandputz (L-Form)
wand_streifen(b, 0.015, FB, FB + 0.12, 1, abstand=d)                       # Sockelleiste
# Treppenhäuser: die beiden Kellertreppen liegen hinter weißen Wänden mit Doppeltür (Tür weiß mit Goldgriffen)
TH = [(14.6, RY0, RX1, 2.2, 'y'), (HXI, 27.0, HXI + 5.2, RY1, 'y')]
for (x0, y0, x1, y1, _) in TH:
    if y0 <= RY0 + 0.01:                                  # vorn rechts: Wand bei y1, Seite bei x0
        b.quader(x0, y1 - 0.15, FB, x1 - d, y1, DECKE, 0); b.quader(x0, y0 + d, FB, x0 + 0.15, y1 - 0.15, DECKE, 0)
        b.quader(x0 + 0.15, y1, FB, x1 - d, y1 + 0.03, FB + 0.12, 1)
    else:                                                  # hinten links: Wand bei y0, Seite bei x1
        b.quader(x0 + d, y0, FB, x1, y0 + 0.15, DECKE, 0); b.quader(x1 - 0.15, y0 + 0.15, FB, x1, y1 - d, DECKE, 0)
        b.quader(x0 + d, y0 - 0.03, FB, x1 - 0.15, y0, FB + 0.12, 1)
b.objekt('Saal_Waende')
if VAR and VAR['holz_unten']:                                         # Eichen-Verkleidung bis 1,1 m mit Abschlussleiste
    b = Bau([HOLZ_M]); h = FB + 1.1
    wand_streifen(b, 0.035, FB + 0.12, h, 0, abstand=0.02)
    wand_streifen(b, 0.055, h, h + 0.03, 0, abstand=0.02)
    b.objekt('Saal_Holzverkleidung', (2.0, 2.0))


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


tuer(16.9, 2.2, 1); tuer(HXI + 2.7, 27.0, -1)

# ------------------------------------------------------------------ Kassettendecke mit indirekten LED-Bändern + Strahlern
# Bänder je Raum (Raum A unter der Moschee, Raum B unter dem Hof): Rand 0,9 m, Mittelachsen 1,1 m, gemeinsame Grenze y = Y1
RAEUME = [dict(r=RAUM_A, XB=[(RX0, RX0 + 0.9), (XM_A - 0.55, XM_A + 0.55), (RX1 - 0.9, RX1)],
               YB=[(RY0, RY0 + 0.9), (YM_A - 0.55, YM_A + 0.55), (Y1 - 0.55, Y1)], xm=XM_A, ym=YM_A),
          dict(r=RAUM_B, XB=[(HXI, HXI + 0.9), (XM_B - 0.55, XM_B + 0.55), (RX1 - 0.9, RX1)],
               YB=[(Y1, Y1 + 0.55), (YM_B - 0.55, YM_B + 0.55), (RY1 - 0.9, RY1)], xm=XM_B, ym=YM_B)]


def intervalle(bands, a, z):
    grenzen = sorted({a} | {z} | {v for bb in bands for v in bb})
    return [((u, v), any(abs(u - bb[0]) < 1e-6 and abs(v - bb[1]) < 1e-6 for bb in bands)) for u, v in zip(grenzen, grenzen[1:])]


b = Bau([DECKE_M, LED_KALT])
kassetten = []
for R_ in RAEUME:
    x0r, y0r, x1r, y1r = R_['r']
    b.quader(x0r, y0r, DECKE - 0.02, x1r, y1r, DECKE, 0)                   # weiße Deckenfläche
    for (xa, xb), xband in intervalle(R_['XB'], x0r, x1r):
        for (ya, yb), yband in intervalle(R_['YB'], y0r, y1r):
            if xband or yband:
                b.quader(xa, ya, BAND_U, xb, yb, BAND_O, 0)
            else:
                kassetten.append((xa, ya, xb, yb))
    # Unterzüge weiß verkleidet (in der Lichtfuge sichtbar)
    b.quader(R_['xm'] - 0.25, y0r, BAND_O, R_['xm'] + 0.25, y1r, DECKE - 0.02, 0)
    b.quader(x0r, R_['ym'] - 0.25, BAND_O, x1r, R_['ym'] + 0.25, DECKE - 0.02, 0)
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
for R_ in RAEUME:
    x0r, y0r, x1r, y1r = R_['r']
    nx_ = int((x1r - x0r - 0.6) / 1.9) + 1
    for i in range(nx_):
        x = x0r + 0.7 + i * (x1r - x0r - 1.4) / max(1, nx_ - 1)
        for (ya, yb) in R_['YB']:
            spots.append((x, (ya + yb) / 2))
    ny_ = int((y1r - y0r) / 2.0)
    for j in range(ny_):
        y = y0r + 1.0 + j * (y1r - y0r - 2.0) / max(1, ny_ - 1)
        for (xa, xb) in R_['XB']:
            if not any(ya - 0.3 < y < yb + 0.3 for ya, yb in R_['YB']):
                spots.append(((xa + xb) / 2, y))
b = Bau([GOLD_MATT, SPOT_M])
for (x, y) in spots:
    b.scheibe((x, y), 0.075, BAND_U - 0.008, BAND_U, 0, 20); b.scheibe((x, y), 0.05, BAND_U - 0.012, BAND_U - 0.008, 1, 20)
b.objekt('Saal_Einbaustrahler')
for i, (x, y) in enumerate(spots):
    ld = bpy.data.lights.new(f'Saal_Spot{i}', 'SPOT'); ld.energy = 18; ld.spot_size = math.radians(80); ld.spot_blend = 0.6
    ld.color = (1.0, 0.95, 0.88); ld.shadow_soft_size = 0.05
    lo = bpy.data.objects.new(f'Saal_Spot{i}', ld); lo.location = (x, y, BAND_U - 0.02); C.objects.link(lo)

# ------------------------------------------------------------------ Ringleuchten (Ayman 23.11.: schlicht statt Kronleuchter)
LEUCHTRING = licht_mat('Saal_Leuchtring', (1.0, 0.95, 0.88), 12.0)
b = Bau([GOLD_MATT, LEUCHTRING])
R, ZR = 0.55, -0.42
n = 48
for k in range(n):                                                    # Ring: flaches Profil, unten leuchtend
    a0, a1 = 2 * math.pi * k / n, 2 * math.pi * (k + 1) / n
    pts = lambda r, z: [(r * math.cos(a0), r * math.sin(a0), z), (r * math.cos(a1), r * math.sin(a1), z)]
    (p0, p1), (p2, p3) = pts(R - 0.035, ZR), pts(R + 0.035, ZR)
    (q0, q1), (q2, q3) = pts(R - 0.035, ZR + 0.05), pts(R + 0.035, ZR + 0.05)
    b.polygon([p0, p2, p3, p1], 1); b.polygon([q0, q1, q3, q2], 0)
    b.polygon([p0, p1, q1, q0], 0); b.polygon([p2, q2, q3, p3], 0)
for i in range(3):                                                    # Abhängung: 3 dünne Seile
    a = 2 * math.pi * i / 3
    b.rohr((R * math.cos(a), R * math.sin(a), ZR + 0.05), (R * math.cos(a), R * math.sin(a), 0.0), 0.002, mi=0, n=4)
b.scheibe((0, 0), 0.0001, 0, 0.0001, 0, 3)
RINGL = b.objekt('Saal_Ringleuchte0')
orte = []
for (xa, ya, xb, yb) in kassetten:
    cx, cy = (xa + xb) / 2, (ya + yb) / 2
    orte += [(cx, cy - (yb - ya) / 4), (cx, cy + (yb - ya) / 4)] if (yb - ya) > 7 else [(cx, cy)]
for k, (cx, cy) in enumerate(orte):
    o = RINGL if k == 0 else kopie(RINGL, 'Saal_Ringleuchte', (0, 0, 0))
    o.location = (cx, cy, DECKE - 0.02)
    ld = bpy.data.lights.new('Saal_Ringleuchte_Licht', 'POINT'); ld.energy = 110; ld.shadow_soft_size = 0.5
    ld.color = (1.0, 0.94, 0.86)
    lo = bpy.data.objects.new('Saal_Ringleuchte_Licht', ld); lo.location = (cx, cy, DECKE - 0.5); C.objects.link(lo)

# ------------------------------------------------------------------ Stützen weiß verkleidet (Sockel, Kapitell, Goldband)
b = Bau([WEISS_GL, GOLD_MATT])
for (x, y) in SAULEN:
    b.quader(x - 0.32, y - 0.32, FB, x + 0.32, y + 0.32, BAND_U, 0)
    b.quader(x - 0.38, y - 0.38, FB, x + 0.38, y + 0.38, FB + 0.18, 0, fase=0.02)
    b.quader(x - 0.37, y - 0.37, BAND_U - 0.16, x + 0.37, y + 0.37, BAND_U, 0, fase=0.02)
b.objekt('Saal_Stuetzen')
if VAR and VAR['holz_unten']:                                         # Ayman 23.11.: Holz auch an den Säulen (wie die Wände, bis 1,1 m)
    b = Bau([HOLZ_M])
    for (x, y) in SAULEN:
        b.quader(x - 0.345, y - 0.345, FB + 0.18, x + 0.345, y + 0.345, FB + 1.1, 0)
        b.quader(x - 0.365, y - 0.365, FB + 1.1, x + 0.365, y + 0.365, FB + 1.13, 0, fase=0.006)
        b.quader(x - 0.335, y - 0.335, BAND_U - 0.36, x + 0.335, y + 0.335, BAND_U - 0.2, 0)   # Holzband unter dem Kapitell
    b.objekt('Saal_Stuetzen_Holz', (2.0, 2.0))


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


# ------------------------------------------------------------------ Tisch (rund, schlichte weiße Tischdecke, ohne Deko)
b = Bau([TUCH])
n = 64; ringe = []
for k, z in enumerate((0.0, 0.25, 0.5, 0.70, 0.745)):
    amp = 0.018 * (1 - z / 0.75) ** 1.5
    r = 0.985 - 0.06 * (z / 0.75)
    ringe.append([((r + amp * math.sin(14 * 2 * math.pi * i / n)) * math.cos(2 * math.pi * i / n),
                   (r + amp * math.sin(14 * 2 * math.pi * i / n)) * math.sin(2 * math.pi * i / n), z + 0.005) for i in range(n)])
ringe.append([(0.915 * math.cos(2 * math.pi * i / n), 0.915 * math.sin(2 * math.pi * i / n), 0.76) for i in range(n)])
b.ring(ringe, 0, True, True, False)
b.polygon([(0.915 * math.cos(2 * math.pi * i / n), 0.915 * math.sin(2 * math.pi * i / n), 0.76) for i in range(n)], 0)
if VAR and VAR.get('laeufer'):                                      # Tischläufer quer über den Tisch, an den Enden herabhängend
    LAEUFER = mat('Saal_Tischlaeufer', VAR['laeufer'], 0.85, **{'Sheen Weight': 0.3})
    b.mats.append(LAEUFER); mi = len(b.mats) - 1
    b.quader(-0.958, -0.19, 0.76, 0.958, 0.19, 0.766, mi)
    for sx in (-1, 1):
        x0, x1 = (0.946, 0.958) if sx > 0 else (-0.958, -0.946)
        b.quader(x0, -0.19, 0.50, x1, 0.19, 0.766, mi)
if VAR and VAR.get('atay'):
    # Marokkanische Atay-Kanne (Berrad, Silber, etwas größer als üblich) auf rundem Silbertablett mit 6 traditionellen Teegläsern
    SILBER = mat('Saal_Silber', '#D2D2CE', 0.34, 1.0)                 # Ayman 23.11.: Kanne nicht so stark spiegelnd (gebürstet)
    SILBER_T = mat('Saal_Silber_Tablett', '#CFCFCB', 0.4, 1.0)
    TEE = None  # unten nach helles_glas gesetzt
    def helles_glas(name, hexf, deckend=0.4):
        """Helles, buntes Teeglas: durchsichtig getönt (ohne Brechung → bleibt hell) + Spiegelung am Rand (Fresnel)."""
        m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree
        for nd in list(nt.nodes):
            nt.nodes.remove(nd)
        tr0 = nt.nodes.new('ShaderNodeBsdfTransparent'); tr0.inputs['Color'].default_value = hexrgb(hexf)
        df = nt.nodes.new('ShaderNodeBsdfDiffuse'); df.inputs['Color'].default_value = hexrgb(hexf)
        tr = nt.nodes.new('ShaderNodeMixShader'); tr.inputs[0].default_value = deckend      # halb deckend bemalt → hell und bunt
        nt.links.new(tr0.outputs[0], tr.inputs[1]); nt.links.new(df.outputs[0], tr.inputs[2])
        gl = nt.nodes.new('ShaderNodeBsdfGlossy'); gl.inputs['Roughness'].default_value = 0.02
        fr = nt.nodes.new('ShaderNodeFresnel'); fr.inputs['IOR'].default_value = 1.5
        mx = nt.nodes.new('ShaderNodeMixShader'); out = nt.nodes.new('ShaderNodeOutputMaterial')
        nt.links.new(fr.outputs[0], mx.inputs[0]); nt.links.new(tr.outputs[0], mx.inputs[1]); nt.links.new(gl.outputs[0], mx.inputs[2])
        nt.links.new(mx.outputs[0], out.inputs[0])
        return m
    # nach Aymans Vorlage (assets/tisch_vorlage_ayman.png): kräftig bunt, durchscheinend – Blau, Rot, Grün, Bernstein, Rauchglas, Rot
    GLAS_F = [helles_glas(f'Saal_Teeglas_{k}', c, 0.12) for k, c in (('blau', '#4F86DE'), ('rot', '#D8463E'), ('gruen', '#3FAF5C'),
                                                                   ('bernstein', '#E7922E'), ('rauch', '#6E6280'), ('rubin', '#C23A4A'))]
    TEE = helles_glas('Saal_Tee', '#F6C78E', 0.3)
    GOLDRAND = mat('Saal_Glas_Goldrand', '#D8B25E', 0.32, 1.0)
    _nt = GOLDRAND.node_tree; _tc = _nt.nodes.new('ShaderNodeTexCoord'); _wv = _nt.nodes.new('ShaderNodeTexWave')   # eingeprägtes Ornament
    _wv.inputs['Scale'].default_value = 260; _wv.inputs['Distortion'].default_value = 6; _wv.inputs['Detail'].default_value = 4
    _bp = _nt.nodes.new('ShaderNodeBump'); _bp.inputs['Strength'].default_value = 0.6
    _nt.links.new(_tc.outputs['Object'], _wv.inputs['Vector']); _nt.links.new(_wv.outputs['Fac'], _bp.inputs['Height'])
    _nt.links.new(_bp.outputs['Normal'], _nt.nodes['Principled BSDF'].inputs['Normal'])
    base = len(b.mats); b.mats += [SILBER, TEE] + GLAS_F + [GOLDRAND, SILBER_T]
    MS, MT, MG, MGR, MST = base, base + 1, tuple(range(base + 2, base + 8)), base + 8, base + 9
    z0 = 0.766
    def drehkoerper(profil, mi, n=32, x=0.0, y=0.0, deckel=True, rippen=0, tiefe=0.0):
        f = lambda i: 1 + tiefe * abs(math.cos(rippen * math.pi * i / n)) if rippen else 1
        b.ring([[(x + r * f(i) * math.cos(2 * math.pi * i / n), y + r * f(i) * math.sin(2 * math.pi * i / n), z) for i in range(n)]
                for r, z in profil], mi, True, True, deckel)
    # Tablett
    drehkoerper([(0.245, z0), (0.245, z0 + 0.022), (0.235, z0 + 0.022), (0.235, z0 + 0.006)], MST, 48, deckel=False)
    b.polygon([(0.236 * math.cos(2 * math.pi * i / 48), 0.236 * math.sin(2 * math.pi * i / 48), z0 + 0.006) for i in range(48)], MST)
    # Kanne (Profil r, z über dem Tablett), Maßstab 1,25
    k = 1.25; zt = z0 + 0.006
    prof = [(0.050, 0.0), (0.054, 0.006), (0.040, 0.022), (0.060, 0.045), (0.074, 0.075), (0.072, 0.105), (0.055, 0.135),
            (0.040, 0.150), (0.038, 0.158), (0.048, 0.162)]
    drehkoerper([(r * k, zt + z * k) for r, z in prof], MS, 48)
    deckel_p = [(0.048, 0.162), (0.050, 0.168), (0.046, 0.176), (0.038, 0.192), (0.026, 0.207), (0.014, 0.216)]   # gerillte Kuppel
    drehkoerper([(r * k, zt + z * k) for r, z in deckel_p], MS, 96, rippen=12, tiefe=0.07, deckel=False)
    spitze = [(0.014, 0.216), (0.017, 0.222), (0.009, 0.232), (0.013, 0.241), (0.005, 0.254), (0.009, 0.262), (0.004, 0.275),
              (0.0005, 0.29)]                                           # Knauf mit Spitze
    drehkoerper([(r * k, zt + z * k) for r, z in spitze], MS, 24)
    sp = [Vector((0.068 * k, 0, zt + 0.08 * k)), Vector((0.10 * k, 0, zt + 0.10 * k)), Vector((0.125 * k, 0, zt + 0.14 * k)),
          Vector((0.145 * k, 0, zt + 0.175 * k)), Vector((0.17 * k, 0, zt + 0.19 * k))]
    for i in range(len(sp) - 1):                                       # Ausguss, verjüngt
        r0 = 0.014 - 0.0022 * i; b.rohr(sp[i], sp[i + 1], r0 * k, (r0 - 0.0022) * k, MS, 10, deckel=(i == len(sp) - 2))
    hd = [Vector((-0.045 * k, 0, zt + 0.15 * k)), Vector((-0.112 * k, 0, zt + 0.153 * k)), Vector((-0.128 * k, 0, zt + 0.137 * k)),
          Vector((-0.128 * k, 0, zt + 0.078 * k)), Vector((-0.105 * k, 0, zt + 0.058 * k)), Vector((-0.066 * k, 0, zt + 0.055 * k))]
    b.pfad(hd, 0.0085 * k, MS, 4)                                       # eckiger Griff wie in der Vorlage
    # Teegläser: leicht ausgestellt, farbiges Glas mit Goldrand-Band, mit Tee gefüllt
    for i in range(6):
        a = 2 * math.pi * i / 6 + math.pi / 6; gx, gy = 0.175 * math.cos(a), 0.175 * math.sin(a)
        # einwandig (nur Außenhaut, Boden zu, oben offen) → wenige Glasschichten, bleibt hell
        drehkoerper([(0.024, zt + 0.004), (0.031, zt + 0.095)], MG[i % 6], 20, gx, gy, deckel=False)
        b.polygon([(gx + 0.024 * math.cos(2 * math.pi * j / 20), gy + 0.024 * math.sin(2 * math.pi * j / 20), zt + 0.004)
                   for j in reversed(range(20))], MG[i % 6])
        drehkoerper([(0.0302, zt + 0.048), (0.0322, zt + 0.08)], MGR, 24, gx, gy, deckel=False)   # breites Goldband
        drehkoerper([(0.0225, zt + 0.006), (0.0285, zt + 0.07)], MT, 20, gx, gy, deckel=True)
TISCH = b.objekt('Saal_Tisch0')

# ------------------------------------------------------------------ Stuhl
def holz_maserung(name, hexf):
    """Echtholz-Optik ohne UV: gestrecktes Rauschen entlang z (Maserung), dunkles Braun, seidenmatt."""
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; bs = nt.nodes['Principled BSDF']
    tc = nt.nodes.new('ShaderNodeTexCoord'); mp = nt.nodes.new('ShaderNodeMapping'); mp.inputs['Scale'].default_value = (60, 60, 3)
    nz = nt.nodes.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 6; nz.inputs['Detail'].default_value = 8
    nz.inputs['Distortion'].default_value = 0.6
    rp = nt.nodes.new('ShaderNodeValToRGB'); c = hexrgb(hexf)
    rp.color_ramp.elements[0].position = 0.35; rp.color_ramp.elements[0].color = tuple(v * 0.55 for v in c[:3]) + (1,)
    rp.color_ramp.elements[1].position = 0.7; rp.color_ramp.elements[1].color = tuple(min(1, v * 1.45) for v in c[:3]) + (1,)
    nt.links.new(tc.outputs['Object'], mp.inputs['Vector']); nt.links.new(mp.outputs['Vector'], nz.inputs['Vector'])
    nt.links.new(nz.outputs['Fac'], rp.inputs['Fac']); nt.links.new(rp.outputs['Color'], bs.inputs['Base Color'])
    bs.inputs['Roughness'].default_value = 0.42; bs.inputs['Coat Weight'].default_value = 0.15
    return m


def polsterstoff(name, hexf):
    """Polsterstoff: feine Webstruktur (Bump), leichter Samtglanz."""
    m = mat(name, hexf, 0.92, **{'Sheen Weight': 0.5, 'Sheen Roughness': 0.45}); nt = m.node_tree; bs = nt.nodes['Principled BSDF']
    tc = nt.nodes.new('ShaderNodeTexCoord'); nz = nt.nodes.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 900
    bp = nt.nodes.new('ShaderNodeBump'); bp.inputs['Strength'].default_value = 0.15
    nt.links.new(tc.outputs['Object'], nz.inputs['Vector']); nt.links.new(nz.outputs['Fac'], bp.inputs['Height'])
    nt.links.new(bp.outputs['Normal'], bs.inputs['Normal'])
    return m


if VAR and VAR.get('holzstuhl'):
    # Ayman 23.11.: Stuhl aus echtem Holz und gepolstert – runde Holzbeine, Zarge, Querstreben, dickes Sitzpolster,
    # gepolsterte Rückenlehne zwischen den Holmen, Holz-Abschlussleiste oben
    GESTELL = mat('Saal_Metall_grau', '#9E9D99', 0.55, 0.5)                                     # für Bildschirmrahmen/Pult
    HOLZ_S = holz_maserung('Saal_Stuhl_Holz', VAR['gestell'])
    STOFF = polsterstoff('Saal_Stuhl_Polster', VAR['stoff'])
    b = Bau([HOLZ_S, STOFF])
    for sx in (-1, 1):
        x = sx * 0.195
        b.rohr((x, -0.2, 0.0), (x, -0.195, 0.40), 0.016, 0.021, 0, 12)                            # Vorderbein, verjüngt
        b.pfad([(x, 0.225, 0.0), (x, 0.2, 0.40), (x, 0.212, 0.56), (x, 0.245, 0.78), (x, 0.27, 0.96)], 0.019, 0, 12)  # Hinterbein + Holm
        b.kugel((x, 0.27, 0.96), 0.019, 0, n=2)
        b.rohr((x, -0.195, 0.15), (x, 0.215, 0.15), 0.009, mi=0, n=10)                           # seitliche Querstrebe
    b.rohr((-0.195, 0.06, 0.15), (0.195, 0.06, 0.15), 0.009, mi=0, n=10)                         # mittlere Querstrebe
    b.quader(-0.18, -0.215, 0.34, 0.18, -0.19, 0.405, 0, fase=0.005)                             # Zarge vorn
    b.quader(-0.18, 0.18, 0.34, 0.18, 0.205, 0.405, 0, fase=0.005)                               # Zarge hinten
    for sx in (-1, 1):
        b.quader(sx * 0.18 - 0.0125, -0.19, 0.34, sx * 0.18 + 0.0125, 0.18, 0.405, 0, fase=0.005)  # Zarge seitlich
    b.quader(-0.222, -0.232, 0.405, 0.222, 0.198, 0.475, 1, fase=0.03, seg=4, glatt=True, wulst=0.012)  # Sitzpolster
    b.quader(-0.172, 0.205, 0.54, 0.172, 0.255, 0.885, 1, fase=0.022, seg=4, glatt=True, scher=(0.54, 0.16))  # Rückenpolster
    b.pfad([(-0.195, 0.268, 0.935), (0.0, 0.285, 0.945), (0.195, 0.268, 0.935)], 0.016, 0, 12)  # obere Holzleiste
    b.rohr((-0.195, 0.212, 0.53), (0.195, 0.212, 0.53), 0.011, mi=0, n=10)                       # untere Lehnenleiste
    STUHL = b.objekt('Saal_Stuhl0')
    for p in STUHL.data.polygons:
        p.use_smooth = True
else:
  # ---------------------------------------------------------------- schlichter, stapelbarer Bankettstuhl (Ayman 23.11.)
  GESTELL = mat('Saal_Stuhlgestell', VAR.get('gestell', '#9E9D99') if VAR else '#9E9D99', 0.55, 0.5)
  if VAR and VAR.get('holzstuhl'):
      GESTELL = mat('Saal_Stuhl_Holz_dunkel', VAR['gestell'], 0.5)
  STOFF = mat('Saal_Stuhlstoff', VAR['stoff'] if VAR else '#B8B1A5', 0.9)
  b = Bau([GESTELL, STOFF])
  b.quader(-0.22, -0.21, 0.42, 0.22, 0.21, 0.445, 0)                                           # Sitzrahmen
  b.quader(-0.215, -0.22, 0.445, 0.215, 0.2, 0.5, 1, fase=0.015)                               # Sitzpolster
  for sx in (-1, 1):
      d = 0.019 if VAR and VAR.get('holzstuhl') else 0.0125                                        # Holzstuhl: kräftigere Beine
      b.quader(sx * 0.2 - d, -0.2 - d, 0.0, sx * 0.2 + d, -0.2 + d, 0.42, 0)                       # Vorderbeine
      b.rohr((sx * 0.2, 0.21, 0.0), (sx * 0.2, 0.2, 0.43), d * 1.1, mi=0, n=4)                     # Hinterbeine
      b.rohr((sx * 0.2, 0.2, 0.43), (sx * 0.2, 0.25, 0.93), d * 1.1, mi=0, n=4)                    # Holme der Lehne
  neig = 0.05 / 0.5
  for dy in (0.0,):
      b.quader(-0.2, 0.205, 0.58, 0.2, 0.245, 0.9, 1, fase=0.015)                                  # Rückenpolster
  STUHL = b.objekt('Saal_Stuhl0')
  # Lehne leicht nach hinten geneigt
  for v in STUHL.data.vertices:
      if v.co.z > 0.55 and v.co.y > 0.19 and abs(v.co.x) < 0.21:
          v.co.y += (v.co.z - 0.58) * neig

# Tischordnung: 4 Reihen in x (Mittelgang mit Teppichen frei), 6 Reihen in y → 24 Tische × 10 Stühle = 240 Plätze
# Ayman 23.11. (L-Form): unter der Moschee 2 Reihen à 4, unter dem Hof 3 Reihen à 4 (Lücke um die freie Stütze) → 20 Tische, 200 Plätze
PLAETZE = [(tx, ty) for ty in (3.9, 8.0) for tx in (2.95, 6.85, 13.15, 17.05)]
PLAETZE += [(tx, ty) for ty in (15.6, 19.7, 23.8) for tx in (HXI + 2.1, HXI + 5.6, XM_B + 2.35, XM_B + 5.85)]
erster = True
for tx, ty in PLAETZE:
    if True:
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
for (y0, y1) in ((1.7, 5.3),):
    b.quader(8.8, y0, FB, 11.2, y1, FB + 0.012, 0)
ob = b.objekt('Saal_Teppiche')
uv = ob.data.uv_layers.new(name='UVMap')
for poly in ob.data.polygons:
    for li in poly.loop_indices:
        co = ob.data.vertices[ob.data.loops[li].vertex_index].co
        y0 = 1.7 if co.y < 13 else 21.6
        uv.data[li].uv = ((co.x - 8.8) / 2.4, (co.y - y0) / 3.6)

# (Ayman 23.11.: KEINE Bühne mit Sofa für ein Brautpaar und kein Teppich davor – der Saal ist kein reiner Hochzeitssaal,
#  sondern für alle Feiern der Gemeinde: Babyfeier, Nikah, Iftar usw.)
zb = FB


def bogen_pts(cx, w, z0, zg, n=24, y=0.0):
    pts = [(cx - w / 2, y, z0), (cx - w / 2, y, zg)]
    for i in range(1, n):
        a = math.pi - math.pi * i / n
        pts.append((cx + w / 2 * math.cos(a), y, zg + w / 2 * math.sin(a)))
    pts += [(cx + w / 2, y, zg), (cx + w / 2, y, z0)]
    return pts


# ------------------------------------------------------------------ Seminar: großer Bildschirm an der Rückwand + Rednerpult
SCHIRM = mat('Saal_Bildschirm', '#0E0F11', 0.18)
HOLZ = mat('Saal_Holz_hell', '#CDB792', 0.6)
yw = RY1 - 0.02
b = Bau([SCHIRM, GESTELL])
b.quader(XM_B - 1.55, yw - 0.06, FB + 0.62, XM_B + 1.55, yw, FB + 2.36, 1)                     # Rahmen (Mitte der Rückwand)
b.quader(XM_B - 1.52, yw - 0.065, FB + 0.65, XM_B + 1.52, yw - 0.06, FB + 2.33, 0)               # Bildfläche (aus)
b.objekt('Saal_Bildschirm')
b = Bau([HOLZ, GESTELL])
px, py = XM_B + 2.3, 27.3
b.quader(px - 0.3, py - 0.2, FB, px + 0.3, py + 0.2, FB + 0.05, 1)
b.quader(px - 0.27, py - 0.17, FB + 0.05, px + 0.27, py + 0.17, FB + 1.05, 0, fase=0.01)
b.quader(px - 0.31, py - 0.24, FB + 1.05, px + 0.31, py + 0.2, FB + 1.09, 0, fase=0.008)
b.objekt('Saal_Rednerpult')
# Rohbau-Teile des Kellers, die der Ausbau ersetzt/verdeckt
for o in bpy.data.objects:
    if o.name.startswith(('Keller_Wandleuchten', 'Keller_Unterzuege', 'Keller_Saeulen', 'Keller_Treppe')):
        o.hide_render = True
print('Festsaal gebaut:', len(C.objects), 'Objekte,', len(spots), 'Strahler,', len(kassetten), 'Kassetten')
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(HERE, f'festsaal{"_" + FARBE if FARBE not in ("", "W") else ""}.blend'), relative_remap=True)
