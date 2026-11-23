"""4 Autos auf den 4 Schrägparkplätzen (Ayman 23.11., Vorlagen assets/autos/auto1…4_*.png):
  1 schwarzer Kompakt-Sportwagen (Fünftürer, Dachspoiler, 4 Endrohre, schwarze 10-Speichen-Felgen)
  2 grauer Kompakt (lange Haube, Trapez-Kühlergrill mit Rautenmuster, Vielspeichen-Felgen zweifarbig)
  3 weißer Kompakt-Sportback (großer schwarzer Sechseck-Grill, schwarze Felgen, rote Bremssättel)
  4 schwarzes Kompakt-SUV (höher, Dachreling, Radlauf-Verkleidung, senkrechte Tagfahrlicht-Streifen)
FESTE REGEL: kein Text im Video → KEINE Markenzeichen, Schriftzüge oder Typenbezeichnungen, Kennzeichen leer.
Die Details gestaltet Ayman später mit Higgsfield nach (ebenfalls ohne Text/Logo).

Wird am Ende von moschee.py ausgeführt (exec): braucht dort `coll`, `hexrgb`, die Parkplatz-Konstanten.
Aufbau: Karosserie als Loft aus Querschnitten (Seitenlinie, Gürtellinie, Grundriss, Radhäuser), Scheiben/Säulen über
Materialzuordnung, Lichter/Grill/Kennzeichen/Fugen als „Aufkleber“ per Strahl auf die Karosserie projiziert,
Räder als eigene Objekte (Kinder der Karosserie, drehbar/lenkbar für das Einparken im Video).
"""
import math
import bmesh
from mathutils import Matrix, Vector
from mathutils.bvhtree import BVHTree

AUTO_C = coll('Autos')


# ------------------------------------------------------------------ Materialien
def _mat(name, hexf, rough=0.4, metal=0.0, **kw):
    m = bpy.data.materials.get(name)
    if m:
        return m
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = hexrgb(hexf); b.inputs['Roughness'].default_value = rough
    b.inputs['Metallic'].default_value = metal
    for k, v in kw.items():
        b.inputs[k].default_value = v
    return m


def _leucht(name, hexf, staerke, glas_hex='#202020'):
    m = bpy.data.materials.get(name)
    if m:
        return m
    m = _mat(name, glas_hex, 0.1)
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Emission Color'].default_value = hexrgb(hexf); b.inputs['Emission Strength'].default_value = staerke
    return m


def _gitter(name, muster):
    """Grill: schwarz glänzend mit Waben- bzw. Rautenpunkt-Struktur (Voronoi)."""
    m = bpy.data.materials.get(name)
    if m:
        return m
    m = _mat(name, '#0B0B0C', 0.3); nt = m.node_tree; b = nt.nodes['Principled BSDF']
    tc = nt.nodes.new('ShaderNodeTexCoord'); vo = nt.nodes.new('ShaderNodeTexVoronoi')
    vo.inputs['Scale'].default_value = 55 if muster == 'raute' else 38
    nt.links.new(tc.outputs['Object'], vo.inputs['Vector'])
    if muster == 'raute':                       # helle Punkte auf dunklem Grund
        rp = nt.nodes.new('ShaderNodeValToRGB'); rp.color_ramp.interpolation = 'CONSTANT'
        rp.color_ramp.elements[0].position = 0.0; rp.color_ramp.elements[0].color = (0.55, 0.56, 0.58, 1)
        rp.color_ramp.elements[1].position = 0.22; rp.color_ramp.elements[1].color = hexrgb('#0B0B0C')
        nt.links.new(vo.outputs['Distance'], rp.inputs['Fac']); nt.links.new(rp.outputs['Color'], b.inputs['Base Color'])
        b.inputs['Metallic'].default_value = 0.7
    else:                                       # Waben: Kanten erhaben
        bp = nt.nodes.new('ShaderNodeBump'); bp.inputs['Strength'].default_value = 0.8
        nt.links.new(vo.outputs['Distance'], bp.inputs['Height']); nt.links.new(bp.outputs['Normal'], b.inputs['Normal'])
    return m


SCHWARZ_GL = _mat('Auto_Schwarz_glanz', '#0C0C0D', 0.2, **{'Coat Weight': 0.6})
PLASTIK = _mat('Auto_Kunststoff_matt', '#141516', 0.65)
UNTEN = _mat('Auto_Unterboden', '#0A0A0A', 0.9)
GLAS = _mat('Auto_Scheibe', '#4E5A63', 0.04, 0.0, **{'Coat Weight': 1.0, 'Coat Roughness': 0.02})   # getönt, aber heller als schwarzer Lack
REIFEN = _mat('Auto_Reifen', '#141414', 0.85)
SCHEIBE_BR = _mat('Auto_Bremsscheibe', '#6A6B6D', 0.45, 0.9)
CHROM = _mat('Auto_Chrom_dunkel', '#9A9DA2', 0.18, 1.0)
KENNZ = _mat('Auto_Kennzeichen_leer', '#D6D8DA', 0.45)          # leer – kein Text
SCHEINW = _leucht('Auto_Scheinwerfer', '#FFFFFF', 0.0, '#1A1C20')
TFL = _leucht('Auto_Tagfahrlicht', '#F2F6FF', 7.0, '#FFFFFF')
RUECK = _leucht('Auto_Rueckleuchte', '#FF1010', 3.5, '#5A0608')
RUECK_GLAS = _mat('Auto_Rueckleuchte_Glas', '#4A0508', 0.08, **{'Coat Weight': 1.0})
RUECKSTR = _mat('Auto_Rueckstrahler', '#7A0A0C', 0.3)

# ------------------------------------------------------------------ Modelle (Maße in m; u = 0 Heck … L Front)
AUTOS = [
    dict(name='Auto1', L=4.29, B=1.79, wb=2.63, fo=0.88, R=0.335, felge=0.245, unten=0.16, schweller=0.27,
         lack=_mat('Auto1_Lack_schwarz', '#060607', 0.14, **{'Coat Weight': 1.0, 'Coat Roughness': 0.03}),
         top=[(0, 0.94), (0.07, 1.02), (0.22, 1.18), (0.42, 1.33), (0.62, 1.41), (1.7, 1.46), (2.45, 1.44), (2.62, 1.4),
              (3.3, 0.97), (3.8, 0.87), (4.13, 0.77), (4.29, 0.63)],
         guertel=[(0, 0.94), (0.4, 1.0), (3.25, 0.95), (4.29, 0.8)],
         fenster=[(0.74, 1.92), (2.02, 3.14)], frontscheibe=(2.64, 3.28), heckscheibe=(0.12, 0.6), dach=None,
         felgen=dict(speichen=10, breite=0.022, farbe='#0E0E10', zweifarbig=False), sattel='#2A2C30',
         front='sport', heck='sport', auspuff='vier_rund', spoiler=True, reling=False, verkleidung=False),
    dict(name='Auto2', L=4.42, B=1.80, wb=2.73, fo=0.90, R=0.34, felge=0.245, unten=0.15, schweller=0.27,
         lack=_mat('Auto2_Lack_grau', '#7A7E83', 0.3, 0.6, **{'Coat Weight': 1.0, 'Coat Roughness': 0.04}),
         top=[(0, 0.93), (0.08, 1.03), (0.25, 1.2), (0.5, 1.34), (0.75, 1.41), (1.8, 1.44), (2.5, 1.42), (2.68, 1.37),
              (3.38, 0.96), (3.95, 0.85), (4.27, 0.73), (4.42, 0.6)],
         guertel=[(0, 0.96), (0.45, 1.0), (3.3, 0.94), (4.42, 0.78)],
         fenster=[(0.8, 1.95), (2.05, 3.22)], frontscheibe=(2.7, 3.36), heckscheibe=(0.13, 0.7), dach=None,
         felgen=dict(speichen=15, breite=0.014, farbe='#2B2D31', zweifarbig=True), sattel='#3A3C40',
         front='kompakt', heck='kompakt', auspuff='zwei_trapez', spoiler=False, reling=False, verkleidung=False),
    dict(name='Auto3', L=4.34, B=1.82, wb=2.64, fo=0.89, R=0.335, felge=0.245, unten=0.16, schweller=0.27,
         lack=_mat('Auto3_Lack_weiss', '#E9E9E7', 0.22, **{'Coat Weight': 1.0, 'Coat Roughness': 0.03}),
         top=[(0, 0.95), (0.08, 1.05), (0.24, 1.21), (0.46, 1.34), (0.68, 1.4), (1.7, 1.43), (2.45, 1.41), (2.62, 1.37),
              (3.3, 0.96), (3.85, 0.86), (4.2, 0.75), (4.34, 0.62)],
         guertel=[(0, 0.96), (0.4, 1.0), (3.25, 0.95), (4.34, 0.8)],
         fenster=[(0.68, 1.92), (2.02, 3.15)], frontscheibe=(2.64, 3.28), heckscheibe=(0.12, 0.64), dach='schwarz',
         felgen=dict(speichen=10, breite=0.03, farbe='#0E0E10', zweifarbig=False, doppel=True), sattel='#B3141B',
         front='sportback', heck='sportback', auspuff='eins_trapez', spoiler=True, reling=False, verkleidung=False, spiegel_schwarz=True),
    dict(name='Auto4', L=4.25, B=1.82, wb=2.60, fo=0.86, R=0.355, felge=0.245, unten=0.22, schweller=0.36,
         lack=_mat('Auto4_Lack_schwarz', '#060607', 0.14, **{'Coat Weight': 1.0, 'Coat Roughness': 0.03}),
         top=[(0, 1.03), (0.08, 1.14), (0.24, 1.33), (0.45, 1.48), (0.7, 1.55), (1.8, 1.57), (2.5, 1.55), (2.7, 1.49),
              (3.3, 1.07), (3.78, 0.99), (4.1, 0.9), (4.25, 0.76)],
         guertel=[(0, 1.05), (0.45, 1.1), (3.25, 1.04), (4.25, 0.92)],
         fenster=[(0.74, 1.9), (2.0, 3.12)], frontscheibe=(2.72, 3.28), heckscheibe=(0.12, 0.62), dach=None,
         felgen=dict(speichen=10, breite=0.026, farbe='#0E0E10', zweifarbig=False, geschwungen=True), sattel='#2A2C30',
         front='suv', heck='suv', auspuff='zwei_trapez', spoiler=True, reling=True, verkleidung=True),
]


def _lin(pts, u):
    if u <= pts[0][0]:
        return pts[0][1]
    for (u0, z0), (u1, z1) in zip(pts, pts[1:]):
        if u <= u1:
            t = (u - u0) / (u1 - u0); t = t * t * (3 - 2 * t)          # weich
            return z0 + (z1 - z0) * t
    return pts[-1][1]


def _karosserie(a):
    L, W = a['L'], a['B']; R = a['R']
    xf = L - a['fo']; xr = xf - a['wb']; xm = (xf + xr) / 2                # Achsen (u), Mitte = Objektursprung
    under, sill = a['unten'], a['schweller']
    ztop = lambda u: _lin(a['top'], u)
    belt = lambda u: min(_lin(a['guertel'], u), ztop(u) - 0.03)

    def w(u):                                                            # halbe Breite im Grundriss (runde Ecken)
        sf = min(1.0, (L - u) / 0.55); sr = min(1.0, u / 0.38)
        f = 0.70 + 0.30 * math.sin(min(sf, sr) * math.pi / 2) ** 0.8
        return W / 2 * f

    def unter(u):                                                        # Unterkante steigt an Front/Heck (runde Stoßfänger)
        df, dr = L - u, u
        z = under
        if df < 0.45:
            z = max(z, under + (0.31 - under) * (1 - df / 0.45) ** 2)
        if dr < 0.35:
            z = max(z, under + (0.33 - under) * (1 - dr / 0.35) ** 2)
        return z

    Ra = R + 0.045

    def sb(u):                                                           # Unterkante außen (Schweller / Radhaus-Bogen)
        z = sill
        for ua in (xf, xr):
            d = abs(u - ua)
            if d < Ra:
                z = max(z, R + math.sqrt(Ra * Ra - d * d))
        return z

    def halb(u):
        ww = w(u); zt = ztop(u); zb = belt(u); un = unter(u); s = max(sb(u), un + 0.06)
        inner = s if sb(u) > sill + 1e-3 else un
        zs = max(min(zb - 0.15, zt - 0.06), s + 0.14)                  # Schulter (breiteste Stelle) knapp unter der Gürtellinie
        wr = ww - 0.23                                                   # Dachkante deutlich eingezogen (Tumblehome)
        g = max(0.0, min(1.0, (zt - zb - 0.08) / 0.3))
        cab = [(wr + 0.06, zb + 0.012), (wr, zt - 0.07), (wr * 0.72, zt - 0.01)]
        hood = [((ww - 0.03) * 0.93, zb + (zt - zb) * 0.5), (ww * 0.68, zt - 0.006), (ww * 0.33, zt)]
        mid = [(hood[k][0] + (cab[k][0] - hood[k][0]) * g, hood[k][1] + (cab[k][1] - hood[k][1]) * g) for k in range(3)]
        return [(0.0, un), (ww - 0.36, un), (ww - 0.36, inner), (ww - 0.07, s), (ww - 0.03, s + 0.1), (ww, zs),
                (ww - 0.03, zb)] + mid + [(0.0, zt)]

    n_st = int(L / 0.025) + 1
    us = [L * i / (n_st - 1) for i in range(n_st)]
    bm = bmesh.new(); ringe = []
    for u in us:
        h = halb(u)
        links = [(y, z) for (y, z) in h]                                  # +y
        rechts = [(-y, z) for (y, z) in reversed(h[1:-1])]                # −y (ohne Mittelpunkte)
        ringe.append([bm.verts.new((u - xm, y, z)) for (y, z) in links + rechts])
    nh = 11; n = len(ringe[0])
    # Segmentindex je Ringkante (0…9 links, gespiegelt rechts)
    seg = list(range(10)) + list(reversed(range(10)))
    for i in range(len(ringe) - 1):
        u = (us[i] + us[i + 1]) / 2
        for k in range(n):
            f = bm.faces.new((ringe[i][k], ringe[i + 1][k], ringe[i + 1][(k + 1) % n], ringe[i][(k + 1) % n]))
            f.material_index = _matwahl(a, seg[k], u, (ringe[i][k].co + ringe[i + 1][(k + 1) % n].co) / 2, belt, ztop, xf, xr, Ra)
            f.smooth = True
    for r, rev in ((ringe[0], True), (ringe[-1], False)):
        f = bm.faces.new(list(reversed(r)) if rev else r); f.material_index = 0; f.smooth = False
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    return bm, dict(xm=xm, xf=xf, xr=xr, w=w, ztop=ztop, belt=belt, sb=sb)


# Materialslots der Karosserie
SL_LACK, SL_UNTEN, SL_GLAS, SL_SCHWARZ, SL_PLASTIK = 0, 1, 2, 3, 4


def _matwahl(a, s, u, c, belt, ztop, xf, xr, Ra):
    if s <= 2:
        return SL_UNTEN
    z = c.z
    if a['verkleidung'] and s in (3, 4) and (z < a['schweller'] + 0.13 or min(abs(u - xf), abs(u - xr)) < Ra + 0.07):
        return SL_PLASTIK                                               # SUV: Schweller + Radlauf-Verkleidung
    if s == 7:
        for (u0, u1) in a['fenster']:
            if u0 <= u <= u1 and belt(u) + 0.01 < z < ztop(u) - 0.05:
                return SL_GLAS
        if a['fenster'][0][1] < u < a['fenster'][1][0] and z > belt(u):
            return SL_SCHWARZ                                           # B-Säule
        fs = a['frontscheibe']
        if fs[1] - 0.02 < u < fs[1] + 0.12 and z > belt(u):
            return SL_SCHWARZ                                           # Spiegeldreieck
    if s in (8, 9):
        for (u0, u1) in (a['frontscheibe'], a['heckscheibe']):
            if u0 + 0.02 < u < u1 - 0.02:
                return SL_GLAS
        if a.get('dach') == 'schwarz' and a['heckscheibe'][1] <= u <= a['frontscheibe'][0]:
            return SL_SCHWARZ
    return SL_LACK


# ------------------------------------------------------------------ Aufkleber per Strahl (Lichter, Grill, Fugen …)
class Aufkleber:
    def __init__(self, bm, info, L):
        self.bvh = BVHTree.FromBMesh(bm); self.i = info; self.L = L
        self.bm = bmesh.new(); self.mats = []

    def mi(self, m):
        if m not in self.mats:
            self.mats.append(m)
        return self.mats.index(m)

    def _strahl(self, seite, a, b):
        xm = self.i['xm']; L = self.L
        if seite == 'front':
            o, d = Vector((L - xm + 1.0, a, b)), Vector((-1, 0, 0))
        elif seite == 'heck':
            o, d = Vector((-xm - 1.0, a, b)), Vector((1, 0, 0))
        elif seite == 'links':
            o, d = Vector((a - xm, 2.0, b)), Vector((0, -1, 0))
        elif seite == 'rechts':
            o, d = Vector((a - xm, -2.0, b)), Vector((0, 1, 0))
        else:                                                            # oben
            o, d = Vector((a - xm, b, 3.0)), Vector((0, 0, -1))
        hit = self.bvh.ray_cast(o, d, 4.0)
        if hit[0] is None:
            return None
        return hit[0] + hit[1].normalized() * 0.004

    def flaeche(self, seite, a0, a1, b0, b1, mat, maske=None, zelle=0.015):
        na = max(1, int(abs(a1 - a0) / zelle)); nb = max(1, int(abs(b1 - b0) / zelle))
        gitter = {}
        for i in range(na + 1):
            for j in range(nb + 1):
                gitter[i, j] = self._strahl(seite, a0 + (a1 - a0) * i / na, b0 + (b1 - b0) * j / nb)
        m = self.mi(mat); vs = {}
        for i in range(na):
            for j in range(nb):
                ac = a0 + (a1 - a0) * (i + 0.5) / na; bc = b0 + (b1 - b0) * (j + 0.5) / nb
                if maske and not maske(ac, bc):
                    continue
                ecken = [(i, j), (i + 1, j), (i + 1, j + 1), (i, j + 1)]
                if any(gitter[e] is None for e in ecken):
                    continue
                for e in ecken:
                    if e not in vs:
                        vs[e] = self.bm.verts.new(gitter[e])
                q = [vs[e] for e in ecken]
                if seite in ('heck', 'links'):
                    q = list(reversed(q))
                try:
                    f = self.bm.faces.new(q); f.material_index = m; f.smooth = True
                except ValueError:
                    pass

    def beide(self, seite, y0, y1, z0, z1, mat, maske=None, zelle=0.015):
        """Symmetrisch links/rechts (front/heck: y-Bereich als |y|)."""
        self.flaeche(seite, y0, y1, z0, z1, mat, maske, zelle)
        self.flaeche(seite, -y1, -y0, z0, z1, mat, (lambda a, b: maske(-a, b)) if maske else None, zelle)

    def box(self, c, s, mat, dreh=0.0, fase=0.0):
        vor = set(self.bm.faces)
        bmesh.ops.create_cube(self.bm, size=1.0, matrix=Matrix.Translation(c) @ Matrix.Rotation(dreh, 4, 'Z') @ Matrix.Diagonal((*s, 1)))
        neu = [f for f in self.bm.faces if f not in vor]
        if fase:
            es = list({e for f in neu for e in f.edges})
            bmesh.ops.bevel(self.bm, geom=es, offset=fase, segments=3, affect='EDGES', profile=0.5)
            neu = [f for f in self.bm.faces if f not in vor]
        m = self.mi(mat)
        for f in neu:
            f.material_index = m; f.smooth = bool(fase)

    def zyl(self, p0, p1, r, mat, n=16, r1=None):
        p0, p1 = Vector(p0), Vector(p1); r1 = r if r1 is None else r1
        ax = (p1 - p0).normalized(); hlp = Vector((0, 0, 1)) if abs(ax.z) < 0.9 else Vector((1, 0, 0))
        u = ax.cross(hlp).normalized(); v = ax.cross(u)
        ring = [[self.bm.verts.new(p + rr * (math.cos(2 * math.pi * k / n) * u + math.sin(2 * math.pi * k / n) * v)) for k in range(n)]
                for p, rr in ((p0, r), (p1, r1))]
        m = self.mi(mat)
        for k in range(n):
            f = self.bm.faces.new((ring[0][k], ring[0][(k + 1) % n], ring[1][(k + 1) % n], ring[1][k])); f.material_index = m; f.smooth = True
        for rr, rev in ((ring[0], True), (ring[1], False)):
            f = self.bm.faces.new(list(reversed(rr)) if rev else rr); f.material_index = m


def _details(a, ak):
    """Front, Heck, Seiten nach den Vorlagen – nur Formen/Farben, KEINE Logos oder Schrift."""
    i = ak.i; L = a['L']; w = i['w']; xm = i['xm']
    lack = a['lack']; schwarz = SCHWARZ_GL; gr = _gitter('Auto_Grill_Waben', 'wabe'); raute = _gitter('Auto_Grill_Raute', 'raute')
    # ---------------- Front
    if a['front'] == 'sport':
        ak.flaeche('front', -0.56, 0.56, 0.655, 0.72, schwarz)                                  # schmaler oberer Grill
        ak.flaeche('front', -0.62, 0.62, 0.695, 0.703, TFL, zelle=0.008)                       # durchgehender Lichtstreifen
        ak.beide('front', 0.48, 0.8, 0.655, 0.75, SCHEINW, lambda y, z: z < 0.75 - (y - 0.48) * 0.12)
        ak.beide('front', 0.5, 0.78, 0.66, 0.672, TFL, zelle=0.008)                            # LED-Leiste im Scheinwerfer
        ak.flaeche('front', -0.6, 0.6, 0.3, 0.5, gr, lambda y, z: abs(y) < 0.6 - (0.5 - z) * 0.25)   # großer Lufteinlass
        ak.beide('front', 0.62, 0.84, 0.32, 0.56, schwarz, lambda y, z: z < 0.56 - (y - 0.62) * 0.5)  # seitliche Einlässe
        kz = (0.47, 0.58)
    elif a['front'] == 'kompakt':
        ak.flaeche('front', -0.42, 0.42, 0.48, 0.72, raute, lambda y, z: abs(y) < 0.36 + (z - 0.48) * 0.25)   # Trapez-Grill, Rautenpunkte
        ak.flaeche('front', -0.4, 0.4, 0.6, 0.612, CHROM, lambda y, z: abs(y) < 0.38, zelle=0.008)           # Querlamelle (ohne Stern)
        ak.beide('front', 0.45, 0.8, 0.64, 0.76, SCHEINW, lambda y, z: z > 0.64 + (y - 0.45) * 0.1)
        ak.beide('front', 0.47, 0.78, 0.648, 0.66, TFL, lambda y, z: True, 0.008)
        ak.flaeche('front', -0.56, 0.56, 0.3, 0.42, schwarz)
        ak.beide('front', 0.6, 0.82, 0.32, 0.5, gr)
        kz = (0.43, 0.53)
    elif a['front'] == 'sportback':
        ak.flaeche('front', -0.5, 0.5, 0.36, 0.74, gr,
                   lambda y, z: abs(y) < (0.44 if z > 0.62 else 0.48 - (0.62 - z) * 0.4))                  # Sechseck-Grill
        ak.beide('front', 0.48, 0.82, 0.63, 0.75, SCHEINW, lambda y, z: z < 0.75 - (y - 0.48) * 0.18)
        for k in range(5):                                                                     # gestufte LED-Signatur
            ak.beide('front', 0.52 + k * 0.05, 0.55 + k * 0.05, 0.655, 0.67, TFL, None, 0.006)
        ak.beide('front', 0.58, 0.84, 0.3, 0.52, gr, lambda y, z: z < 0.52 - (y - 0.58) * 0.3)
        ak.flaeche('front', -0.62, 0.62, 0.285, 0.31, CHROM, zelle=0.01)                     # Spoilerlippe
        kz = (0.47, 0.58)
    else:                                                                                      # SUV
        ak.flaeche('front', -0.55, 0.55, 0.7, 0.85, gr, lambda y, z: abs(y) < 0.55 - (0.85 - z) * 0.3)
        ak.flaeche('front', -0.6, 0.6, 0.79, 0.8, CHROM, zelle=0.008)
        ak.beide('front', 0.5, 0.84, 0.74, 0.86, SCHEINW, lambda y, z: z > 0.74 + (y - 0.5) * 0.08)
        ak.beide('front', 0.52, 0.8, 0.79, 0.8, TFL, None, 0.006)
        ak.beide('front', 0.62, 0.7, 0.44, 0.62, TFL, lambda y, z: True, 0.008)               # senkrechte Tagfahrlichter
        ak.beide('front', 0.6, 0.8, 0.42, 0.64, schwarz, lambda y, z: not (0.62 <= y <= 0.7))
        ak.flaeche('front', -0.5, 0.5, 0.3, 0.46, gr)
        kz = (0.5, 0.61)
    ak.flaeche('front', -0.26, 0.26, kz[0], kz[1], KENNZ, zelle=0.02)                          # leeres Kennzeichen
    # ---------------- Heck
    if a['heck'] == 'sport':
        ak.beide('heck', 0.36, 0.84, 0.86, 0.97, RUECK_GLAS, lambda y, z: z < 0.97 - (0.84 - y) * 0.05)
        ak.beide('heck', 0.42, 0.82, 0.9, 0.915, RUECK, None, 0.006)
        ak.flaeche('heck', -0.72, 0.72, 0.28, 0.42, schwarz)
        kz, rs = (0.5, 0.61), (0.66, 0.82, 0.45, 0.47)
    elif a['heck'] == 'kompakt':
        ak.beide('heck', 0.3, 0.86, 0.85, 0.95, RUECK_GLAS, lambda y, z: z > 0.85 + (0.86 - y) * 0.06)
        ak.beide('heck', 0.34, 0.84, 0.9, 0.912, RUECK, None, 0.006)
        ak.flaeche('heck', -0.7, 0.7, 0.28, 0.38, schwarz)
        kz, rs = (0.6, 0.71), (0.62, 0.8, 0.43, 0.45)
    elif a['heck'] == 'sportback':
        ak.beide('heck', 0.4, 0.86, 0.87, 0.97, RUECK_GLAS, lambda y, z: z > 0.87 + (y - 0.4) * 0.05)
        for k in range(6):
            ak.beide('heck', 0.44 + k * 0.065, 0.48 + k * 0.065, 0.9, 0.93, RUECK, None, 0.006)
        ak.flaeche('heck', -0.74, 0.74, 0.28, 0.42, schwarz)
        ak.beide('heck', 0.72, 0.82, 0.36, 0.48, RUECKSTR)
        kz, rs = (0.82, 0.92), None
    else:
        ak.beide('heck', 0.4, 0.86, 0.97, 1.07, RUECK_GLAS, lambda y, z: z < 1.07 - (0.86 - y) * 0.06)
        ak.beide('heck', 0.44, 0.84, 1.0, 1.015, RUECK, None, 0.006)
        ak.flaeche('heck', -0.72, 0.72, 0.3, 0.46, schwarz)
        ak.beide('heck', 0.66, 0.74, 0.46, 0.62, RUECKSTR)
        kz, rs = (0.6, 0.72), None
    ak.flaeche('heck', -0.26, 0.26, kz[0], kz[1], KENNZ, zelle=0.02)
    if rs:
        ak.beide('heck', rs[0], rs[1], rs[2], rs[3], RUECKSTR, None, 0.008)
    ak.flaeche('heck', -0.22, 0.22, 1.37 if a['front'] != 'suv' else 1.5, 1.39 if a['front'] != 'suv' else 1.52, RUECK, zelle=0.01)  # 3. Bremslicht
    # Endrohre
    xh = -xm + 0.03
    if a['auspuff'] == 'vier_rund':
        for y in (-0.6, -0.48, 0.48, 0.6):
            ak.zyl((xh - 0.06, y, 0.33), (xh + 0.12, y, 0.33), 0.045, CHROM, 16)
    else:
        seiten = (-1, 1) if a['auspuff'] == 'zwei_trapez' else (-1,)
        for sg in seiten:
            ak.box(Vector((xh + 0.03, sg * 0.63, 0.33)), (0.12, 0.2, 0.07), CHROM, fase=0.015)
    # ---------------- Seiten: Türfugen, Griffe, Schwellerleiste
    xf, xr = i['xf'], i['xr']
    for sd in ('links', 'rechts'):
        fu = a['fenster']
        for u in (fu[1][1] + 0.12, fu[0][1] + 0.05, fu[0][0] - 0.05):                       # vordere, mittlere, hintere Türkante
            ak.flaeche(sd, u - 0.004, u + 0.004, a['schweller'] + 0.06, i['belt'](u) - 0.01, schwarz, None, 0.004)
        for u in (fu[1][1] - 0.55, fu[0][1] - 0.45):                                          # Türgriffe
            ak.flaeche(sd, u - 0.1, u + 0.1, i['belt'](u) - 0.16, i['belt'](u) - 0.13, CHROM if a['name'] == 'Auto2' else schwarz, None, 0.008)
        ak.flaeche(sd, xr + a['R'] + 0.1, xf - a['R'] - 0.1, a['schweller'] + 0.02, a['schweller'] + 0.07, PLASTIK, None, 0.02)
        if a['front'] == 'sport' or a['front'] == 'kompakt':                                          # Lichtkante (Charakterlinie)
            ak.flaeche(sd, 0.4, L - 0.6, 0.83, 0.835, schwarz, lambda u, z: True, 0.02)
    # Außenspiegel
    for sg in (1, -1):
        u = a['fenster'][1][1] - 0.02
        c = Vector((u - xm, sg * (w(u) + 0.08), i['belt'](u) + 0.11))
        ak.box(c, (0.2, 0.16, 0.12), PLASTIK if a.get('spiegel_schwarz') or a['name'] in ('Auto1', 'Auto4') else a['lack'], fase=0.04)
        ak.box(c + Vector((0.04, -sg * 0.09, -0.03)), (0.08, 0.06, 0.03), PLASTIK)
    # Dachspoiler, Dachreling
    if a['spoiler']:
        u0 = a['heckscheibe'][1]
        ak.box(Vector((u0 - xm - 0.02, 0, i['ztop'](u0) + 0.015)), (0.28, w(u0) * 2 - 0.42, 0.035), a['lack'], fase=0.012)
    if a['reling']:
        for sg in (1, -1):
            for u0, u1 in ((0.55, 2.45),):
                yy = sg * (w(1.5) - 0.24)
                ak.zyl((u0 - xm, yy, i['ztop'](u0) + 0.04), (u1 - xm, yy, i['ztop'](u1) + 0.04), 0.014, PLASTIK, 10)
                for u in (u0, u1):
                    ak.box(Vector((u - xm, yy, i['ztop'](u) + 0.02)), (0.08, 0.04, 0.05), PLASTIK)
    # Bremssättel (fest an der Karosserie, drehen nicht mit)
    for ua in (xf, xr):
        for sg in (1, -1):
            yy = sg * (a['B'] / 2 - 0.125)                                    # zwischen Bremsscheibe und Speichen
            ak.box(Vector((ua - xm - 0.13, yy, a['R'] + 0.075)), (0.08, 0.06, 0.17), _mat(a['name'] + '_Sattel', a['sattel'], 0.35), dreh=0.0, fase=0.01)


def _rad(a, name, sg):
    """Rad: Reifen (gedreht), Felge mit Speichen nach Vorlage, Bremsscheibe. Achse = lokale y, außen = sg."""
    R, rf = a['R'], a['felge']; bw = 0.225
    f = a['felgen']; bm = bmesh.new(); mats = [REIFEN, _mat(a['name'] + '_Felge', f['farbe'], 0.3, 0.6), SCHEIBE_BR,
                                               _mat('Auto_Felge_hell', '#A8ABB0', 0.25, 1.0)]
    n = 40

    def ring(r, y, mi_):
        return [bm.verts.new((r * math.cos(2 * math.pi * k / n), y, r * math.sin(2 * math.pi * k / n))) for k in range(n)]

    def band(r0, r1, mi_):
        for k in range(n):
            ff = bm.faces.new((r0[k], r0[(k + 1) % n], r1[(k + 1) % n], r1[k])); ff.material_index = mi_; ff.smooth = True

    # Reifen: Profil (r, y) rund um, außen = +y·sg
    prof = [(rf + 0.012, -bw / 2), (R - 0.03, -bw / 2 - 0.006), (R - 0.006, -bw / 2 + 0.02), (R, -bw / 2 + 0.05), (R, bw / 2 - 0.05),
            (R - 0.006, bw / 2 - 0.02), (R - 0.03, bw / 2 + 0.006), (rf + 0.012, bw / 2)]
    rs = [ring(r, y * sg, 0) for r, y in prof]
    for r0, r1 in zip(rs, rs[1:]):
        band(r0, r1, 0) if sg > 0 else band(r1, r0, 0)
    # Felgenbett + Felgenhorn
    yo = sg * (bw / 2 - 0.01)
    rb = [ring(rf, sg * (-bw / 2 + 0.01), 1), ring(rf, yo, 1), ring(rf - 0.015, yo, 1)]
    for r0, r1 in zip(rb, rb[1:]):
        band(r1, r0, 1) if sg > 0 else band(r0, r1, 1)
    # Bremsscheibe
    ff = bm.faces.new(ring(0.17, sg * 0.02, 2)); ff.material_index = 2
    # Speichen (Boxen radial), leicht nach außen gewölbt
    for k in range(f['speichen']):
        a0 = 2 * math.pi * k / f['speichen']
        teile = (-0.03, 0.03) if f.get('doppel') else (0.0,)
        for off in teile:
            ang = a0 + off * (1.5 if f.get('doppel') else 0)
            for j in range(6):
                t0, t1 = j / 6, (j + 1) / 6
                r0_, r1_ = 0.07 + (rf - 0.085) * t0, 0.07 + (rf - 0.085) * t1
                bog = (0.08 * math.sin(math.pi * (t0 + t1) / 2) if f.get('geschwungen') else 0.0)
                aa = ang + bog
                c = Vector(((r0_ + r1_) / 2 * math.cos(aa), sg * (bw / 2 - 0.045 + 0.02 * (1 - (t0 + t1) / 2)), (r0_ + r1_) / 2 * math.sin(aa)))
                vor = set(bm.faces)
                bmesh.ops.create_cube(bm, size=1.0, matrix=Matrix.Translation(c) @ Matrix.Rotation(-aa, 4, 'Y')
                                      @ Matrix.Diagonal(((r1_ - r0_) * 1.08, 0.03, f['breite'] * (1.0 - 0.3 * t0), 1)))
                for ff in bm.faces:
                    if ff not in vor:
                        ff.material_index = 3 if (f.get('zweifarbig') and j >= 2) else 1
    # Nabe (ohne Logo)
    hub = [ring(0.075, sg * (bw / 2 - 0.035), 1), ring(0.05, sg * (bw / 2 - 0.02), 1)]
    band(hub[0], hub[1], 1) if sg > 0 else band(hub[1], hub[0], 1)
    ff = bm.faces.new(hub[1] if sg > 0 else list(reversed(hub[1]))); ff.material_index = 1
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    for m in mats:
        me.materials.append(m)
    ob = bpy.data.objects.new(name, me); AUTO_C.objects.link(ob)
    ob.rotation_mode = 'XYZ'
    return ob


def baue_auto(a):
    bm, info = _karosserie(a)
    ak = Aufkleber(bm, info, a['L'])
    _details(a, ak)
    me = bpy.data.meshes.new(a['name'] + '_Karosserie'); bm.to_mesh(me); bm.free()
    for m in (a['lack'], UNTEN, GLAS, SCHWARZ_GL, PLASTIK):
        me.materials.append(m)
    body = bpy.data.objects.new(a['name'] + '_Karosserie', me); AUTO_C.objects.link(body)
    me2 = bpy.data.meshes.new(a['name'] + '_Details'); ak.bm.to_mesh(me2); ak.bm.free()
    for m in ak.mats:
        me2.materials.append(m)
    det = bpy.data.objects.new(a['name'] + '_Details', me2); AUTO_C.objects.link(det); det.parent = body
    raeder = []
    for (ua, vorn) in ((info['xf'], True), (info['xr'], False)):
        for sg in (1, -1):
            r = _rad(a, f"{a['name']}_Rad_{'v' if vorn else 'h'}{'l' if sg > 0 else 'r'}", sg)
            r.parent = body; r.location = (ua - info['xm'], sg * (a['B'] / 2 - 0.155), a['R'])
            r['vorn'] = vorn; raeder.append(r)
    body['radstand'] = a['wb']; body['radius'] = a['R']
    return body, raeder


# ------------------------------------------------------------------ auf die Parkplätze stellen (Front voran eingeparkt)
GIER = math.atan2(P_U.y, P_U.x)                     # Fahrtrichtung in den Platz (165°)
PLATZ = {'Auto3': 0, 'Auto4': 1, 'Auto2': 2, 'Auto1': 3}   # Ayman 23.11.: von der Gasse aus weiß, SUV, grau, schwarzer Sportwagen; grau + weiß parken im Video ein
AUTO_ZIEL = {}
for a in AUTOS:
    body, raeder = baue_auto(a)
    i = PLATZ[a['name']]
    vorderrad = P_LANG - 0.8 - 0.09 - a['R'] - 0.02           # Vorderräder kurz vor dem Radstopper
    ziel = Vector((P_XA, P_Y0 + (i + 0.5) * P_DY, 0)) + P_U * (vorderrad - a['wb'] / 2)
    body.location = ziel; body.rotation_euler = (0, 0, GIER)
    AUTO_ZIEL[a['name']] = (tuple(ziel), GIER, i)
    body['platz'] = i
print('Autos gebaut:', ', '.join(f"{a['name']}→Platz {PLATZ[a['name']]}" for a in AUTOS))
