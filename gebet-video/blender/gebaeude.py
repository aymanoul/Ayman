#!/usr/bin/env python3
"""Masjid As-Sunnah Ratingen von außen – komplett per Code in Blender gebaut (bpy 5.2, kein KI-Generator).

    .venv-blender/bin/python blender/gebaeude.py            → blender/gebaeude.blend

Achsen: Die Hauptfassade liegt bei y = 0 und schaut nach −Y (Vorplatz). Hinein geht es in Richtung +Y –
dieselbe Richtung wie im Gebetsraum. x = 0 ist die Mitte des Haupteingangs (linkes Portal des Neubaus). Z nach oben.

Sammlungen: Boden · Neubau · Verbindungsbau · Altbau · Umgebung · Licht · Kameras.
Beweglich: Tuer_Haupt_links / Tuer_Haupt_rechts (Drehpunkt am Scharnier, um Z drehen).
"""
import math
import os
import sys
import bpy            # zuerst bpy, erst danach sind bmesh und mathutils verfügbar
import bmesh
import numpy as np
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import raum as R      # Grundfunktionen (Quader, Material, Texturen …)

X0, X1, DEPTH, HN = -2.6, 18.6, 17.0, 10.4          # Neubau: links, rechts, Tiefe, Höhe
XA = -14.0                                           # Verbindungsbau von XA bis X0
XL, XR = -24.0, -14.0                                # Altbau
SPOTS = {'eingang': (0, -1.5, 0), 'gehweg': (0, -6, 0), 'strasse': (0, -20, 0), 'durchfahrt': (-8, 4, 0)}


def prism_y(name, profile, y0, y1, mat, coll, uv=None):
    """Profil in der (x, z)-Ebene (gegen den Uhrzeigersinn von vorn gesehen), entlang y ausgezogen."""
    n = len(profile)
    v = [(x, y0, z) for x, z in profile] + [(x, y1, z) for x, z in profile]
    f = [tuple(range(n)), tuple(range(2 * n - 1, n - 1, -1))] + [((i + 1) % n, i, n + i, n + (i + 1) % n) for i in range(n)]
    uvs = None
    if uv:
        front = [(x / uv, z / uv) for x, z in profile]
        uvs = [front, front[::-1]] + [[(0, 0)] * 4] * n
    return R.mesh_object(name, v, f, mat, coll, uvs=uvs)


def pointed_arch(c, w, z0, zs, n=9):
    """Spitzbogen: Breite w, unten z0, Bogenansatz zs, Scheitel bei zs + 0,866·w."""
    pts = [(c - w / 2, z0), (c + w / 2, z0)]
    pts += [(c - w / 2 + w * math.cos(t), zs + w * math.sin(t)) for t in np.linspace(0, math.pi / 3, n)]
    pts += [(c + w / 2 + w * math.cos(t), zs + w * math.sin(t)) for t in np.linspace(2 * math.pi / 3, math.pi, n)[1:]]
    return pts


def arch_half_width(w, zs, z):
    return w / 2 if z <= zs else max(0.0, math.sqrt(max(w * w - (z - zs) ** 2, 0)) - w / 2)


# ------------------------------------------------------------------ Texturen
def tex_paving():
    S = 512                                                  # 2 m × 2 m
    r = np.random.default_rng(21)
    a = np.zeros((S, S, 3))
    base = np.array(R.rgb('#b9b1a3'))
    bw, bh = 64, 32                                          # Stein 25 × 12,5 cm
    for j in range(S // bh):
        for i in range(-1, S // bw + 1):
            x0 = i * bw + (bw // 2 if j % 2 else 0)
            xa, xb = max(x0, 0), min(x0 + bw, S)
            if xa >= xb:
                continue
            a[j * bh:(j + 1) * bh, xa:xb] = base * (0.88 + 0.2 * r.random())
            a[j * bh:j * bh + 2, xa:xb] *= 0.72
            if x0 >= 0:
                a[j * bh:(j + 1) * bh, x0:x0 + 2] *= 0.72
    a *= (0.94 + 0.1 * R.noise(S, S, 6, 22)[..., None])
    return R.save_image('pflaster', a)


def tex_ornament():
    S = 512
    yy, xx = np.mgrid[0:S, 0:S]
    cell = 128
    u = (xx % cell) / cell - 0.5; v = (yy % cell) / cell - 0.5
    sq = np.abs(np.maximum(np.abs(u), np.abs(v)) - 0.34) < 0.028
    di = np.abs((np.abs(u) + np.abs(v)) / math.sqrt(2) - 0.34) < 0.028
    grid = (np.abs(u) > 0.478) | (np.abs(v) > 0.478)
    m = (sq | di | grid)[..., None]
    a = np.array(R.rgb('#2b2f36')) * (1 - m) + np.array(R.rgb('#e9e2d0')) * m
    return R.save_image('ornament', a)


# ------------------------------------------------------------------ Bau
def build():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    C = {n: R.collection(n) for n in ['Boden', 'Neubau', 'Verbindungsbau', 'Altbau', 'Umgebung', 'Licht', 'Kameras']}
    mat = R.material
    M = {
        'putz': mat('Putz', '#e7dfcc', 0.9), 'putz_hell': mat('Putz_hell', '#f2ede1', 0.9),
        'anthrazit': mat('Anthrazit', '#33373d', 0.7), 'rahmen': mat('Rahmen_dunkel', '#1f2226', 0.5, 0.3),
        'glas': mat('Glas_blau', '#2f7fbf', 0.08, 0.75), 'glas_dunkel': mat('Glas_dunkel', '#3c5a70', 0.1, 0.6),
        'kuppelglas': mat('Kuppelglas', '#5fa9d8', 0.06, 0.8), 'kuppelrahmen': mat('Kuppelrahmen', '#1d3f5c', 0.4, 0.6),
        'dach': mat('Dach_dunkel', '#3b3634', 0.8), 'flachdach': mat('Flachdach', '#8d8b86', 0.95),
        'altputz': mat('Altbau_Putz', '#e6d8b9', 0.92), 'sockel': mat('Sockel', '#b8b0a0', 0.9),
        'weiss': mat('Fenster_weiss', '#f6f6f3', 0.4), 'metall': mat('Metall', '#9aa0a8', 0.35, 0.9),
        'gold': mat('Gold', '#CA9E4E', 0.3, 0.9), 'navy': mat('Navy', '#212242', 0.5),
        'asphalt': mat('Asphalt', '#47484b', 0.95), 'linie': mat('Markierung', '#e8e6df', 0.8),
        'gras': mat('Rasen', '#6a8f4a', 1.0), 'stamm': mat('Stamm', '#5b4636', 0.9),
        'laub1': mat('Laub_1', '#3f7a35', 0.95), 'laub2': mat('Laub_2', '#4c8c3c', 0.95), 'laub3': mat('Laub_3', '#356b30', 0.95),
        'reifen': mat('Reifen', '#18181a', 0.8), 'felge': mat('Felge', '#b5b9be', 0.3, 0.9), 'autoglas': mat('Autoglas', '#1c2630', 0.08, 0.5),
        'licht_w': mat('Lichtband_weiss', '#ffffff', 0.3, emit='#fff6e0', emit_strength=1.5), 'licht_r': mat('Lichtband_rot', '#c0202a', 0.3, emit='#ff2030', emit_strength=1.0),
        'flur': mat('Vorraum', '#efe6d6', 0.9, emit='#ffe2b8', emit_strength=0.8), 'teppich': mat('Vorraum_Teppich', '#2b9c9a', 1.0),
    }
    M['pflaster'] = R.image_material('Pflaster', tex_paving(), 0.9)
    M['ornament'] = R.image_material('Ornament', tex_ornament(), 0.7)
    M['schild'] = R.image_material('Schild', bpy.data.images.load(os.path.join(R.TEX, 'schild_masjid.png')), 0.5)
    box, cyl = R.box, R.cylinder

    # ---- Boden: Vorplatz (Pflaster), Straße, Rasen
    g = [(-70, -60, 0), (70, -60, 0), (70, 70, 0), (-70, 70, 0)]
    R.mesh_object('Vorplatz_Pflaster', g, [(0, 1, 2, 3)], M['pflaster'], C['Boden'], uvs=[[(x / 2, y / 2) for x, y, _ in g]])
    box('Strasse', -70, 70, -25, -17.5, 0, 0.02, M['asphalt'], C['Boden'])
    box('Bordstein', -70, 70, -17.5, -17.2, 0, 0.1, M['sockel'], C['Boden'])
    for i in range(-11, 12):
        box(f'Strasse_Strich_{i + 12:02d}', i * 6 - 1.5, i * 6 + 1.5, -21.33, -21.17, 0.02, 0.025, M['linie'], C['Boden'])
    for nm, a in [('rechts', (24, 70, -17, 70)), ('links', (-70, -29, -17, 70)), ('hinten', (-29, 24, 22, 70)), ('vorn', (-70, 70, -60, -25))]:
        box(f'Rasen_{nm}', a[0], a[1], a[2], a[3], 0, 0.03, M['gras'], C['Boden'])

    # ---- Neubau: Baukörper (vorn mit Lücke für den Vorraum hinter dem Haupteingang), Attika, Flachdach
    N = C['Neubau']
    top = HN - 0.35
    box('Neubau_Koerper_hinten', X0, X1, 3.0, DEPTH, 0, top, M['putz'], N)
    box('Neubau_Koerper_vorn_links', X0, -1.1, 0, 3.0, 0, top, M['putz'], N)
    box('Neubau_Koerper_vorn_rechts', 1.1, X1, 0, 3.0, 0, top, M['putz'], N)
    box('Neubau_Koerper_vorn_ueber_Tuer', -1.1, 1.1, 0, 3.0, 2.8, top, M['putz'], N)
    for nm, a in [('vorn', (X0, X1, 0, 0.3)), ('hinten', (X0, X1, DEPTH - 0.3, DEPTH)), ('links', (X0, X0 + 0.3, 0.3, DEPTH - 0.3)), ('rechts', (X1 - 0.3, X1, 0.3, DEPTH - 0.3))]:
        box(f'Neubau_Attika_{nm}', a[0], a[1], a[2], a[3], top, HN, M['putz'], N)
    box('Neubau_Flachdach', X0 + 0.3, X1 - 0.3, 0.3, DEPTH - 0.3, top, top + 0.03, M['flachdach'], N)
    box('Neubau_Sockel', X0 - 0.02, X1 + 0.02, 0.0, DEPTH + 0.02, 0, 0.25, M['sockel'], N)

    def arch_window(name, c, w, z0, zs, y, panel):
        """Spitzbogenfenster: heller Rand, blaues Glas, dunkle Sprossen. y = Vorderkante der Fläche dahinter."""
        prism_y(f'{name}_Bogenrand', pointed_arch(c, w + 0.26, z0 - 0.13, zs - 0.03), y - 0.03, y, M['putz_hell'], N)
        prism_y(f'{name}_Glas', pointed_arch(c, w, z0, zs), y - 0.05, y - 0.03, M['glas'], N)
        apex = zs + 0.866 * w
        box(f'{name}_Sprosse_senkrecht', c - 0.03, c + 0.03, y - 0.07, y - 0.05, z0, apex - 0.05, M['rahmen'], N)
        z = z0 + 0.95
        k = 0
        while z < apex - 0.5:
            hw = arch_half_width(w, zs, z + 0.03)
            if hw > 0.1:
                k += 1
                box(f'{name}_Sprosse_{k}', c - hw, c + hw, y - 0.07, y - 0.05, z - 0.025, z + 0.025, M['rahmen'], N)
            z += 0.95

    # Portale (springen 0,7 m vor): links der Haupteingang mit Schild, rechts ein zweiter Eingang
    yp = -0.7
    for c, main in [(0.0, True), (16.0, False)]:
        nm = 'Portal_Haupt' if main else 'Portal_rechts'
        box(f'{nm}_Pfeiler_links', c - 2.0, c - 1.1, yp, 0, 0, HN, M['putz_hell'], N)
        box(f'{nm}_Pfeiler_rechts', c + 1.1, c + 2.0, yp, 0, 0, HN, M['putz_hell'], N)
        box(f'{nm}_Sturz', c - 1.1, c + 1.1, yp, 0, 2.8, HN, M['putz_hell'], N)
        box(f'{nm}_Feld_dunkel', c - 1.25, c + 1.25, yp - 0.04, yp, 3.75, 9.85, M['anthrazit'], N)
        R.image_plane(f'{nm}_Ornament', [(c - 1.25, yp - 0.045, 7.75), (c + 1.25, yp - 0.045, 7.75), (c + 1.25, yp - 0.045, 9.85), (c - 1.25, yp - 0.045, 9.85)], M['ornament'], N)
        o = bpy.data.objects[f'{nm}_Ornament']
        for li, t in zip(o.data.polygons[0].loop_indices, [(0, 0), (2.5, 0), (2.5, 2.1), (0, 2.1)]):
            o.data.uv_layers[0].data[li].uv = t
        arch_window(f'{nm}_Fenster', c, 1.9, 4.0, 6.85, yp - 0.05, True)
        # Tür: dunkle Zarge, zwei Glasflügel
        box(f'{nm}_Zarge_links', c - 1.1, c - 1.04, yp - 0.02, yp + 0.12, 0, 2.8, M['rahmen'], N)
        box(f'{nm}_Zarge_rechts', c + 1.04, c + 1.1, yp - 0.02, yp + 0.12, 0, 2.8, M['rahmen'], N)
        box(f'{nm}_Zarge_oben', c - 1.04, c + 1.04, yp - 0.02, yp + 0.12, 2.72, 2.8, M['rahmen'], N)
        for s in (-1, 1):
            side = 'links' if s < 0 else 'rechts'
            leaf = box(f'Tuer_{"Haupt" if main else "rechts"}_{side}', 0, -s * 1.03, -0.02, 0.02, 0.02, 2.72, M['rahmen'], N)
            leaf.location = (c + s * 1.04, yp + 0.05, 0)                 # Scharnier außen; zum Öffnen nach innen um Z drehen
            box(f'{leaf.name}_Glas', -s * 0.07, -s * 0.96, -0.025, 0.025, 0.12, 2.62, M['glas'], N, leaf)
            box(f'{leaf.name}_Griff', -s * 0.9, -s * 0.86, -0.07, -0.025, 0.85, 1.45, M['metall'], N, leaf)
        if main:
            box('Schild_Platte', c - 1.35, c + 1.35, yp - 0.05, yp, 2.95, 3.6, M['navy'], N)
            R.image_plane('Schild_Masjid_As_Sunnah', [(c - 1.3, yp - 0.055, 2.975), (c + 1.3, yp - 0.055, 2.975), (c + 1.3, yp - 0.055, 3.575), (c - 1.3, yp - 0.055, 3.575)], M['schild'], N)
        else:
            box(f'{nm}_Fuellung', c - 1.1, c + 1.1, yp + 0.12, yp + 0.2, 0, 2.8, M['anthrazit'], N)
    # Vorraum hinter dem Haupteingang (sichtbar, wenn die Tür offen ist)
    box('Vorraum_Boden', -1.1, 1.1, yp, 3.0, 0.0, 0.012, M['teppich'], N)
    R.mesh_object('Vorraum_Rueckwand', [(-1.1, 2.99, 0), (1.1, 2.99, 0), (1.1, 2.99, 2.8), (-1.1, 2.99, 2.8)], [(0, 1, 2, 3)], M['flur'], N)
    R.mesh_object('Vorraum_Decke', [(-1.1, yp, 2.79), (-1.1, 3.0, 2.79), (1.1, 3.0, 2.79), (1.1, yp, 2.79)], [(0, 1, 2, 3)], M['flur'], N)

    # Felder zwischen den Portalen: helle Lisenen, dunkles Feld, Spitzbogenfenster
    for k, c in enumerate([5.5, 10.5]):
        nm = f'Feld_{k + 1}'
        box(f'{nm}_Lisene_links', c - 1.8, c - 1.25, -0.3, 0, 3.0, HN, M['putz_hell'], N)
        box(f'{nm}_Lisene_rechts', c + 1.25, c + 1.8, -0.3, 0, 3.0, HN, M['putz_hell'], N)
        box(f'{nm}_Band_oben', c - 1.25, c + 1.25, -0.3, 0, 9.75, HN, M['putz_hell'], N)
        box(f'{nm}_Feld_dunkel', c - 1.25, c + 1.25, -0.06, 0, 3.0, 9.75, M['anthrazit'], N)
        arch_window(f'{nm}_Fenster', c, 1.6, 3.7, 6.95, -0.06, True)
    # Verglastes Erdgeschoss zwischen den Portalen
    box('EG_Glasband', 2.0, 14.0, -0.05, 0, 0.3, 2.85, M['glas'], N)
    box('EG_Glasband_Sockel', 2.0, 14.0, -0.08, 0, 0, 0.3, M['sockel'], N)
    box('EG_Glasband_Riegel', 2.0, 14.0, -0.08, -0.05, 2.78, 2.85, M['rahmen'], N)
    for i in range(11):
        x = 2.0 + i * 1.2
        box(f'EG_Glasband_Pfosten_{i + 1:02d}', x - 0.03, x + 0.03, -0.09, -0.05, 0.3, 2.85, M['rahmen'], N)

    # Rechte Seite und Rückseite: kleine Fenster, je eine Tür
    def small_window(name, axis, pos, z0=6.0, w=0.75, h=1.05):
        if axis == 'x':                                      # an der rechten Wand (x = X1), pos = y
            box(f'{name}_Rahmen', X1, X1 + 0.05, pos - w / 2 - 0.06, pos + w / 2 + 0.06, z0 - 0.06, z0 + h + 0.06, M['weiss'], N)
            box(f'{name}_Glas', X1, X1 + 0.07, pos - w / 2, pos + w / 2, z0, z0 + h, M['glas_dunkel'], N)
        else:                                                # an der Rückwand (y = DEPTH), pos = x
            box(f'{name}_Rahmen', pos - w / 2 - 0.06, pos + w / 2 + 0.06, DEPTH, DEPTH + 0.05, z0 - 0.06, z0 + h + 0.06, M['weiss'], N)
            box(f'{name}_Glas', pos - w / 2, pos + w / 2, DEPTH, DEPTH + 0.07, z0, z0 + h, M['glas_dunkel'], N)
    for i, y in enumerate([3.5, 6.5, 9.5, 12.5]):
        small_window(f'Fenster_rechts_{i + 1}', 'x', y)
    box('Tuer_Seite_rechts', X1, X1 + 0.06, 14.3, 15.3, 0, 2.15, M['glas_dunkel'], N)
    for i in range(7):
        small_window(f'Fenster_hinten_{i + 1}', 'y', X0 + 2.6 + i * 2.67)
    box('Tuer_hinten', 7.5, 8.5, DEPTH, DEPTH + 0.06, 0, 2.15, M['glas_dunkel'], N)

    # Kuppeln aus Glas (Stahlrahmen als Drahtgitter), Minarett
    def dome(name, r, x, y):
        cyl(f'{name}_Tambour', r * 1.02, 0.5, (x, y, top + 0.25), M['putz_hell'], N, seg=32)
        bm = bmesh.new()
        bmesh.ops.create_uvsphere(bm, u_segments=20, v_segments=10, radius=r)
        bmesh.ops.delete(bm, geom=[v for v in bm.verts if v.co.z < -1e-4], context='VERTS')
        gl = R.bm_object(f'{name}_Glas', bm, M['kuppelglas'], N, smooth=False)
        gl.location = (x, y, top + 0.5)
        fr = gl.copy(); fr.data = gl.data.copy(); fr.name = f'{name}_Rahmen'
        N.objects.link(fr)
        fr.data.materials.clear(); fr.data.materials.append(M['kuppelrahmen'])
        md = fr.modifiers.new('Draht', 'WIREFRAME'); md.thickness = 0.07; md.use_replace = True
        R.sphere(f'{name}_Knauf', 0.14, (x, y, top + 0.5 + r + 0.08), M['gold'], N)
    dome('Kuppel_gross', 3.3, 8.0, 8.0)
    dome('Kuppel_klein_rechts', 1.6, 14.2, 6.2)
    dome('Kuppel_klein_links', 1.6, 2.6, 10.6)
    mx, my = 17.4, 1.3
    box('Minarett_Sockel', mx - 0.5, mx + 0.5, my - 0.5, my + 0.5, top, HN + 0.9, M['putz_hell'], N)
    cyl('Minarett_Schaft', 0.3, 2.9, (mx, my, HN + 0.9 + 1.45), M['putz_hell'], N, seg=16)
    cyl('Minarett_Umgang', 0.48, 0.16, (mx, my, HN + 2.9), M['putz'], N, seg=16)
    cyl('Minarett_Helm', 0.36, 1.7, (mx, my, HN + 3.8 + 0.85), M['kuppelrahmen'], N, r2=0.0, seg=16)
    cyl('Minarett_Stab', 0.02, 0.5, (mx, my, HN + 5.75), M['gold'], N, seg=8)
    R.sphere('Minarett_Knauf', 0.08, (mx, my, HN + 6.0), M['gold'], N)

    # ---- Verbindungsbau: zwei Fensterbänder, darunter offene Durchfahrt mit Stützen
    V = C['Verbindungsbau']
    yv0, yv1, zv0, zv1 = 1.0, 11.0, 3.0, 9.2
    box('Verbindungsbau_Koerper', XA, X0, yv0, yv1, zv0, zv1, M['putz'], V)
    box('Verbindungsbau_Dach', XA, X0, yv0, yv1, zv1, zv1 + 0.03, M['flachdach'], V)
    for k, (za, zb) in enumerate([(3.7, 5.35), (6.45, 8.1)]):
        box(f'Fensterband_{k + 1}_Glas', XA + 0.25, X0 - 0.25, yv0 - 0.04, yv0, za, zb, M['glas'], V)
        box(f'Fensterband_{k + 1}_Riegel', XA + 0.25, X0 - 0.25, yv0 - 0.07, yv0 - 0.04, (za + zb) / 2 - 0.025, (za + zb) / 2 + 0.025, M['rahmen'], V)
        n = int((X0 - XA - 0.5) / 1.1)
        for i in range(n + 1):
            x = XA + 0.25 + i * (X0 - XA - 0.5) / n
            box(f'Fensterband_{k + 1}_Pfosten_{i + 1:02d}', x - 0.025, x + 0.025, yv0 - 0.07, yv0 - 0.04, za, zb, M['rahmen'], V)
    for i, x in enumerate([-12.6, -9.2, -5.8]):
        box(f'Stuetze_{i + 1}', x - 0.2, x + 0.2, yv0 + 0.3, yv0 + 0.7, 0, zv0, M['putz'], V)
    box('Durchfahrt_Rueckwand', XA, X0, yv1 - 0.3, yv1, 0, zv0, M['anthrazit'], V)

    # ---- Altbau: Putzbau mit dunklem Satteldach (First entlang x), weiße Fenster, Gaube
    A = C['Altbau']
    ya0, ya1, ze, zr = 0.5, 11.5, 6.6, 10.4
    ym = (ya0 + ya1) / 2
    box('Altbau_Koerper', XL, XR, ya0, ya1, 0, ze, M['altputz'], A)
    box('Altbau_Sockel', XL - 0.03, XR + 0.03, ya0 - 0.03, ya1 + 0.03, 0, 0.5, M['sockel'], A)
    R.prism('Altbau_Giebel', [(ya0, ze), (ya1, ze), (ym, zr)], XL, XR, M['altputz'], A)
    R.prism('Altbau_Dach', [(ya0 - 0.45, ze - 0.3), (ym, zr + 0.07), (ya1 + 0.45, ze - 0.3), (ya1 + 0.45, ze - 0.02), (ym, zr + 0.38), (ya0 - 0.45, ze - 0.02)],
            XL - 0.4, XR + 0.4, M['dach'], A)

    def old_window(name, face, pos, z0, w=1.0, h=1.5):
        if face == 'front':
            box(f'{name}_Rahmen', pos - w / 2, pos + w / 2, ya0 - 0.05, ya0, z0, z0 + h, M['weiss'], A)
            box(f'{name}_Glas_l', pos - w / 2 + 0.07, pos - 0.03, ya0 - 0.06, ya0, z0 + 0.07, z0 + h - 0.07, M['glas_dunkel'], A)
            box(f'{name}_Glas_r', pos + 0.03, pos + w / 2 - 0.07, ya0 - 0.06, ya0, z0 + 0.07, z0 + h - 0.07, M['glas_dunkel'], A)
        else:                                                # Giebelseite links (x = XL)
            box(f'{name}_Rahmen', XL - 0.05, XL, pos - w / 2, pos + w / 2, z0, z0 + h, M['weiss'], A)
            box(f'{name}_Glas_l', XL - 0.06, XL, pos - w / 2 + 0.07, pos - 0.03, z0 + 0.07, z0 + h - 0.07, M['glas_dunkel'], A)
            box(f'{name}_Glas_r', XL - 0.06, XL, pos + 0.03, pos + w / 2 - 0.07, z0 + 0.07, z0 + h - 0.07, M['glas_dunkel'], A)
    for j, z in enumerate([1.3, 4.2]):
        for i, x in enumerate([XL + 1.9, XL + 4.6, XL + 7.3]):
            if j == 0 and i == 2:
                continue
            old_window(f'Altbau_Fenster_vorn_{j + 1}_{i + 1}', 'front', x, z)
        for i, y in enumerate([3.2, 8.6]):
            old_window(f'Altbau_Fenster_Giebel_{j + 1}_{i + 1}', 'side', y, z)
    old_window('Altbau_Fenster_Giebel_Dach', 'side', ym, 7.3, 0.8, 1.0)
    box('Altbau_Tuer', XL + 6.8, XL + 7.8, ya0 - 0.05, ya0, 0.5, 2.6, M['weiss'], A)
    box('Altbau_Tuer_Stufe', XL + 6.6, XL + 8.0, ya0 - 0.5, ya0, 0, 0.5, M['sockel'], A)
    box('Gaube', XR - 4.6, XR - 1.0, ya0 + 0.9, ya0 + 4.2, ze + 0.2, ze + 2.0, M['anthrazit'], A)
    box('Gaube_Dach', XR - 4.8, XR - 0.8, ya0 + 0.7, ya0 + 4.3, ze + 2.0, ze + 2.12, M['dach'], A)
    for i in range(3):
        x = XR - 4.2 + i * 1.1
        box(f'Gaube_Fenster_{i + 1}', x, x + 0.8, ya0 + 0.85, ya0 + 0.9, ze + 0.75, ze + 1.65, M['weiss'], A)
        box(f'Gaube_Fenster_{i + 1}_Glas', x + 0.07, x + 0.73, ya0 + 0.84, ya0 + 0.9, ze + 0.82, ze + 1.58, M['glas_dunkel'], A)

    # ---- Umgebung: Poller, Autos, Bäume
    U = C['Umgebung']
    for i, x in enumerate([-2.4, 2.4]):
        cyl(f'Poller_{i + 1}', 0.09, 0.85, (x, -4.2, 0.425), M['anthrazit'], U, seg=12)

    def car(name, x, y, rot, color):
        paint = mat(f'Lack_{name}', color, 0.25, 0.4)
        e = R.empty(name, (x, y, 0), U, rot)
        parts = [box(f'{name}_Karosserie', -2.1, 2.1, -0.87, 0.87, 0.3, 0.92, paint, U, e), box(f'{name}_Kabine', -1.25, 1.0, -0.76, 0.76, 0.9, 1.44, paint, U, e)]
        for p in parts:
            md = p.modifiers.new('Rundung', 'BEVEL'); md.width = 0.14; md.segments = 4
            for f in p.data.polygons:
                f.use_smooth = True
        for s in (-1, 1):
            box(f'{name}_Scheibe_Seite_{s}', -1.08, 0.84, s * 0.74, s * 0.775, 0.98, 1.36, M['autoglas'], U, e)
            for sx in (-1.38, 1.38):
                w = cyl(f'{name}_Rad_{sx}_{s}', 0.33, 0.24, (sx, s * 0.8, 0.33), M['reifen'], U, rot=(math.pi / 2, 0, 0), seg=20, parent=e)
                cyl(f'{name}_Felge_{sx}_{s}', 0.2, 0.25, (sx, s * 0.8, 0.33), M['felge'], U, rot=(math.pi / 2, 0, 0), seg=16, parent=e)
        box(f'{name}_Scheibe_vorn', 0.98, 1.02, -0.66, 0.66, 0.98, 1.36, M['autoglas'], U, e)
        box(f'{name}_Scheibe_hinten', -1.27, -1.23, -0.66, 0.66, 0.98, 1.36, M['autoglas'], U, e)
        box(f'{name}_Lichtband_vorn', 2.08, 2.115, -0.7, 0.7, 0.66, 0.72, M['licht_w'], U, e)      # ein durchgehendes Band, keine zwei „Augen“
        box(f'{name}_Lichtband_hinten', -2.115, -2.08, -0.7, 0.7, 0.68, 0.74, M['licht_r'], U, e)
        return e
    car('Auto_rot', 6.0, -3.6, 0, '#8c1f24'); car('Auto_weiss', 11.4, -3.6, math.pi, '#eef0f1')
    car('Auto_silber', -10.9, 4.6, 0, '#d9dcdf'); car('Auto_schwarz', -6.4, 4.6, 0, '#1b1c1f')

    rng = np.random.default_rng(4)

    def tree(name, x, y, h):
        cyl(f'{name}_Stamm', 0.2 + h * 0.012, h * 0.45, (x, y, h * 0.225), M['stamm'], U, seg=8)
        for k in range(6):
            bm = bmesh.new()
            bmesh.ops.create_icosphere(bm, subdivisions=2, radius=h * (0.2 + 0.1 * rng.random()))
            for v in bm.verts:
                v.co *= 0.85 + 0.3 * rng.random()
            ob = R.bm_object(f'{name}_Krone_{k + 1}', bm, M[f'laub{1 + k % 3}'], U, smooth=False)
            a = rng.random() * 2 * math.pi
            ob.location = (x + math.cos(a) * h * 0.16 * (k > 0), y + math.sin(a) * h * 0.16 * (k > 0), h * (0.55 + 0.33 * rng.random()))
    for i, (x, y, h) in enumerate([(31, 9, 12), (33, 21, 13), (29, 33, 11), (-20, 31, 13), (-33, 22, 12), (-37, -13, 10), (-47, 34, 14),
                                   (46, 36, 14), (-52, -40, 11), (50, -42, 12), (-30, 44, 13), (12, 46, 14), (-6, 50, 13), (40, 50, 13)]):
        tree(f'Baum_{i + 1:02d}', x, y, h)

    # ---- Licht: Sonne und Himmel
    sun = bpy.data.lights.new('Sonne', 'SUN'); sun.energy = 3.2; sun.angle = math.radians(2.5); sun.color = (1.0, 0.96, 0.9)
    so = bpy.data.objects.new('Sonne', sun)
    so.rotation_euler = Vector((0.45, 0.62, -0.64)).to_track_quat('-Z', 'Y').to_euler()        # Licht von vorn links oben
    so.location = (-20, -30, 30)
    C['Licht'].objects.link(so)
    vl = bpy.data.lights.new('Vorraum_Licht', 'AREA'); vl.energy = 120; vl.size = 1.2; vl.color = (1.0, 0.9, 0.75)
    vo = bpy.data.objects.new('Vorraum_Licht', vl); vo.location = (0, 1.2, 2.7)
    C['Licht'].objects.link(vo)
    world = bpy.data.worlds.new('Himmel'); world.use_nodes = True
    nt = world.node_tree
    bg = nt.nodes['Background']
    co = nt.nodes.new('ShaderNodeTexCoord'); sep = nt.nodes.new('ShaderNodeSeparateXYZ'); ramp = nt.nodes.new('ShaderNodeValToRGB')
    mr = nt.nodes.new('ShaderNodeMapRange')
    mr.inputs['From Min'].default_value = -1; mr.inputs['From Max'].default_value = 1
    nt.links.new(co.outputs['Generated'], sep.inputs['Vector'])
    nt.links.new(sep.outputs['Z'], mr.inputs['Value'])
    nt.links.new(mr.outputs['Result'], ramp.inputs['Fac'])
    el = ramp.color_ramp.elements
    el[0].position = 0.45; el[0].color = (*R.lin(R.rgb('#c9d6e2')), 1)
    el[1].position = 0.9; el[1].color = (*R.lin(R.rgb('#3d86d8')), 1)
    mid = el.new(0.53); mid.color = (*R.lin(R.rgb('#bcd9f2')), 1)
    nt.links.new(ramp.outputs['Color'], bg.inputs['Color'])
    bg.inputs['Strength'].default_value = 1.0
    scene.world = world

    # ---- Kameras: die sechs Ansichten der Vorlage + Hochformat-Kamera am Haupteingang
    def camera(name, pos, look, lens):
        cd = bpy.data.cameras.new(name); cd.lens = lens; cd.sensor_width = 36; cd.clip_start = 0.1; cd.clip_end = 400
        ob = bpy.data.objects.new(name, cd)
        ob.location = pos
        ob.rotation_euler = (Vector(look) - Vector(pos)).to_track_quat('-Z', 'Y').to_euler()
        C['Kameras'].objects.link(ob)
        return ob
    camera('Kamera_1_Frontansicht', (-2.7, -50, 6.5), (-2.7, 0, 5.6), 35)
    camera('Kamera_2_Rueckansicht', (6, 44, 6.5), (6, 17, 5.2), 30)
    camera('Kamera_3_Linke_Seite', (-56, 3, 5.5), (-24, 6.5, 5.2), 32)
    camera('Kamera_4_Rechte_Seite', (30, -26, 5.5), (8, 3, 5.2), 32)
    camera('Kamera_5_Diagonal_Links', (-34, -32, 8), (-3, 4, 4.8), 33)
    camera('Kamera_6_Diagonal_Rechts', (36, -26, 9), (7, 7, 4.4), 32)
    scene.camera = camera('Kamera_Video_Hochformat', (4.4, -11.5, 1.5), (-0.4, 0, 2.7), 24)

    r = scene.render
    r.engine = 'CYCLES'
    r.resolution_x, r.resolution_y, r.fps = 1080, 1920, 30
    cy = scene.cycles
    cy.device = 'CPU'; cy.samples = 48; cy.use_adaptive_sampling = True; cy.adaptive_threshold = 0.05
    cy.use_denoising = True; cy.denoiser = 'OPENIMAGEDENOISE'
    cy.max_bounces = 4; cy.diffuse_bounces = 2; cy.glossy_bounces = 3
    cy.caustics_reflective = cy.caustics_refractive = False
    scene.view_settings.view_transform = 'Standard'
    scene.unit_settings.system = 'METRIC'
    for k2, v in SPOTS.items():
        R.empty(f'Ort_{k2}', v, C['Boden'])
    return scene


if __name__ == '__main__':
    build()
    bpy.ops.file.pack_all()
    out = os.path.join(HERE, 'gebaeude.blend')
    bpy.ops.wm.save_as_mainfile(filepath=out, compress=True)
    n = len([o for o in bpy.data.objects if o.type == 'MESH'])
    print(f'Gespeichert: {out} · {n} Teile · {len(bpy.data.materials)} Materialien')
