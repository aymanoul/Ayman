#!/usr/bin/env python3
"""Phase 2: echte Umgebung des Grundstücks (Am Westbahnhof 31) als Blender-Szene → blender/neubau.blend

    .venv-blender/bin/python blender/umgebung.py        (im Container; auf dem Mac: Blender -b -P blender/umgebung.py)

Koordinaten wie im freigegebenen Lageplan (tools/lageplan.py), Meter: X entlang der Gasse (0 = linke Grundstücksecke an den
Altbauten, + Richtung Torgebäude), Y nach hinten (0 = Grundstücksgrenze an der Gasse), Z nach oben. Die Gasse liegt bei Y < 0.
Norden ≈ +X (22° zur Gasse hin). Sonne: Aymans Wahl „von vorn“ (tief, warm, von vorn links über der Gasse), nicht die echte Nachmittagsrichtung.
Grundstück leer (Stufe 0: eingeebneter Schotter). Moschee folgt in Phase 3.
Alle Objekte liegen im Ursprung, Eckpunkte in Weltkoordinaten → Material-Koordinaten „Object“ = Meter.
Nichts im Bild: Menschen, Autos, Gerüste, Bauzaun, Folien, Schutt, Tonnen, Schriftzüge.
"""
import math
import os
import random
import sys
import bpy
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, '..')
TEX = os.path.join(ROOT, 'assets', 'tex')
random.seed(7)

# Lageplan-Maße (freigegeben 19.11.)
L, BT, TT, LT = 50.0, 20.0, 29.0, 12.3      # Ayman/Chef 23.11.: Moschee 20 m
GASSE = -6.5
NORD = Vector((math.cos(math.radians(-22)), math.sin(math.radians(-22)), 0))   # +X, leicht zur Gasse

# ------------------------------------------------------------------ Grundlagen
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.unit_settings.system = 'METRIC'
COLL = {}


def coll(name):
    if name not in COLL:
        c = bpy.data.collections.new(name); sc.collection.children.link(c); COLL[name] = c
    return COLL[name]


def node_mat(name):
    m = bpy.data.materials.new(name); m.use_nodes = True
    nt = m.node_tree; bsdf = nt.nodes['Principled BSDF']
    return m, nt, bsdf


def hexrgb(h):
    h = h.lstrip('#'); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c) + (1.0,)


def wand_uv(nt, skala_u, skala_v):
    """Vektor (u, v) = (x + y, z) in Metern / Kachelgröße – passt für Wände in X- und Y-Richtung."""
    tc = nt.nodes.new('ShaderNodeTexCoord'); sep = nt.nodes.new('ShaderNodeSeparateXYZ')
    add = nt.nodes.new('ShaderNodeMath'); add.operation = 'ADD'
    du = nt.nodes.new('ShaderNodeMath'); du.operation = 'DIVIDE'; du.inputs[1].default_value = skala_u
    dv = nt.nodes.new('ShaderNodeMath'); dv.operation = 'DIVIDE'; dv.inputs[1].default_value = skala_v
    comb = nt.nodes.new('ShaderNodeCombineXYZ')
    nt.links.new(tc.outputs['Object'], sep.inputs[0])
    nt.links.new(sep.outputs[0], add.inputs[0]); nt.links.new(sep.outputs[1], add.inputs[1])
    nt.links.new(add.outputs[0], du.inputs[0]); nt.links.new(sep.outputs[2], dv.inputs[0])
    nt.links.new(du.outputs[0], comb.inputs[0]); nt.links.new(dv.outputs[0], comb.inputs[1])
    return comb.outputs[0]


def boden_uv(nt, skala):
    tc = nt.nodes.new('ShaderNodeTexCoord'); mp = nt.nodes.new('ShaderNodeMapping')
    mp.inputs['Scale'].default_value = (1 / skala, 1 / skala, 1)
    nt.links.new(tc.outputs['Object'], mp.inputs['Vector'])
    return mp.outputs[0]


def farbe(name, hexf, rough=0.85, metal=0.0, variation=0.08, skala=1.5):
    """Einfaches Material mit leichter Schmutz-/Farbvariation (Rauschen)."""
    m, nt, b = node_mat(name)
    b.inputs['Roughness'].default_value = rough; b.inputs['Metallic'].default_value = metal
    if variation > 0:
        nz = nt.nodes.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = skala; nz.inputs['Detail'].default_value = 6
        mix = nt.nodes.new('ShaderNodeMix'); mix.data_type = 'RGBA'; mix.blend_type = 'MULTIPLY'
        mix.inputs['Factor'].default_value = variation * 4
        mix.inputs['A'].default_value = hexrgb(hexf)
        nt.links.new(nz.outputs['Color'], mix.inputs['B'])
        mix2 = nt.nodes.new('ShaderNodeMix'); mix2.data_type = 'RGBA'
        mix2.inputs['Factor'].default_value = 1 - variation
        nt.links.new(mix.outputs['Result'], mix2.inputs['A']); mix2.inputs['B'].default_value = hexrgb(hexf)
        nt.links.new(mix2.outputs['Result'], b.inputs['Base Color'])
    else:
        b.inputs['Base Color'].default_value = hexrgb(hexf)
    return m


def bild(name, datei, skala_u, skala_v, boden=False, rough=0.9):
    m, nt, b = node_mat(name)
    tx = nt.nodes.new('ShaderNodeTexImage'); tx.image = bpy.data.images.load(os.path.join(TEX, datei))
    tx.extension = 'MIRROR'
    nt.links.new(boden_uv(nt, skala_u) if boden else wand_uv(nt, skala_u, skala_v), tx.inputs['Vector'])
    nt.links.new(tx.outputs['Color'], b.inputs['Base Color'])
    b.inputs['Roughness'].default_value = rough
    return m


def ziegel(name, hex_stein, hex_fuge, groesse=(0.25, 0.075), rough=0.9):
    m, nt, b = node_mat(name)
    br = nt.nodes.new('ShaderNodeTexBrick')
    br.inputs['Color1'].default_value = hexrgb(hex_stein)
    c2 = [x * 0.78 for x in hexrgb(hex_stein)[:3]] + [1]; br.inputs['Color2'].default_value = c2
    br.inputs['Mortar'].default_value = hexrgb(hex_fuge); br.inputs['Scale'].default_value = 1.0
    br.inputs['Mortar Size'].default_value = 0.012; br.inputs['Brick Width'].default_value = groesse[0]
    br.inputs['Row Height'].default_value = groesse[1]
    nt.links.new(wand_uv(nt, 1, 1), br.inputs['Vector'])
    nz = nt.nodes.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 0.6
    mix = nt.nodes.new('ShaderNodeMix'); mix.data_type = 'RGBA'; mix.blend_type = 'MULTIPLY'; mix.inputs['Factor'].default_value = 0.35
    nt.links.new(br.outputs['Color'], mix.inputs['A']); nt.links.new(nz.outputs['Color'], mix.inputs['B'])
    nt.links.new(mix.outputs['Result'], b.inputs['Base Color'])
    b.inputs['Roughness'].default_value = rough
    return m


def glas(name, hexf='#2A3440', rough=0.08):
    m, nt, b = node_mat(name)
    b.inputs['Base Color'].default_value = hexrgb(hexf); b.inputs['Roughness'].default_value = rough
    b.inputs['Metallic'].default_value = 0.3
    return m


def welle(name, hexf, richtung='X', abstand=0.18):
    """Wellplatten: Streifen-Bump."""
    m = farbe(name, hexf, 0.8, 0.1, 0.12, 0.4); nt = m.node_tree; b = nt.nodes['Principled BSDF']
    wv = nt.nodes.new('ShaderNodeTexWave'); wv.bands_direction = richtung; wv.inputs['Scale'].default_value = 1 / abstand / 6.28
    tc = nt.nodes.new('ShaderNodeTexCoord'); nt.links.new(tc.outputs['Object'], wv.inputs['Vector'])
    bump = nt.nodes.new('ShaderNodeBump'); bump.inputs['Strength'].default_value = 0.35
    nt.links.new(wv.outputs['Fac'], bump.inputs['Height']); nt.links.new(bump.outputs['Normal'], b.inputs['Normal'])
    return m


def schotter(name):
    m, nt, b = node_mat(name)
    vo = nt.nodes.new('ShaderNodeTexVoronoi'); vo.inputs['Scale'].default_value = 28
    nz = nt.nodes.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 3
    tc = nt.nodes.new('ShaderNodeTexCoord'); nt.links.new(tc.outputs['Object'], vo.inputs['Vector']); nt.links.new(tc.outputs['Object'], nz.inputs['Vector'])
    ramp = nt.nodes.new('ShaderNodeValToRGB')
    ramp.color_ramp.elements[0].color = hexrgb('#6E6A63'); ramp.color_ramp.elements[1].color = hexrgb('#B9B2A6')
    nt.links.new(vo.outputs['Distance'], ramp.inputs['Fac'])
    mix = nt.nodes.new('ShaderNodeMix'); mix.data_type = 'RGBA'; mix.blend_type = 'MULTIPLY'; mix.inputs['Factor'].default_value = 0.4
    nt.links.new(ramp.outputs['Color'], mix.inputs['A']); nt.links.new(nz.outputs['Color'], mix.inputs['B'])
    nt.links.new(mix.outputs['Result'], b.inputs['Base Color'])
    bump = nt.nodes.new('ShaderNodeBump'); bump.inputs['Strength'].default_value = 0.6
    nt.links.new(vo.outputs['Distance'], bump.inputs['Height']); nt.links.new(bump.outputs['Normal'], b.inputs['Normal'])
    b.inputs['Roughness'].default_value = 0.95
    return m


M = {
    'pflaster': bild('Pflaster_Gasse', 'pflaster.jpg', 2.0, 2.0, boden=True),
    'randstein': farbe('Randstein_dunkel', '#3B3B3D', 0.8, 0, 0.05),
    'pflaster_rot': farbe('Pflaster_rot', '#7E5048', 0.9, 0, 0.15, 3),
    'beton_boden': farbe('Betonboden_Hof', '#8E8B85', 0.9, 0, 0.12, 0.8),
    'asphalt': farbe('Asphalt', '#4C4B49', 0.9, 0, 0.1, 1.2),
    'schotter': schotter('Schotter_Grundstueck'),
    'mauer': ziegel('Backsteinmauer_hinten', '#9A4B36', '#A39A8E', (0.24, 0.072)),
    'backstein': ziegel('Backstein_Altbau', '#84402C', '#968D80'),
    'backstein2': ziegel('Backstein_Altbau_dunkel', '#6A3326', '#857D72'),
    'putz_weiss': farbe('Putz_weiss', '#ECEBE6', 0.85, 0, 0.05),
    'putz_hell': farbe('Putz_hell', '#DCD6C8', 0.85, 0, 0.08),
    'putz_blau': farbe('Putz_hellblau', '#C7D9E6', 0.85, 0, 0.06),
    'putz_creme': farbe('Putz_creme', '#E6DCC4', 0.85, 0, 0.1),
    'putz_gruen': farbe('Putz_gruenlich', '#B8BC97', 0.85, 0, 0.1),
    'beton': farbe('Beton', '#9C988F', 0.85, 0, 0.18, 0.6),
    'beton_hell': farbe('Beton_hell', '#C9C6BE', 0.85, 0, 0.08),
    'dach_grau': farbe('Dach_Schiefer_grau', '#55585E', 0.75, 0, 0.12, 0.7),
    'dach_ziegel': farbe('Dach_Ziegel_dunkel', '#4A3A36', 0.8, 0, 0.15, 0.7),
    'dach_rot': farbe('Dach_Ziegel_rot', '#9C4A32', 0.8, 0, 0.15, 0.7),
    'wellplatten': welle('Wellplatten', '#9A968C', 'Y'),
    'shed': welle('Sheddach_Platten', '#6F6D68', 'X', 0.2),
    'lichtband': glas('Lichtband', '#9FB3C2', 0.25),
    'flachdach': farbe('Flachdach_hell', '#B9B6AE', 0.8, 0, 0.15, 0.2),
    'fenster': glas('Fensterglas', '#27303A'),
    'rahmen_weiss': farbe('Fensterrahmen_weiss', '#F2F2EF', 0.5, 0, 0),
    'rollladen': farbe('Rollladen', '#D9D9D4', 0.6, 0, 0.02),
    'dachfenster': glas('Dachfenster', '#8FA6BC', 0.15),
    'metall_dunkel': farbe('Metall_dunkel', '#222326', 0.4, 0.8, 0),
    'metall_grau': farbe('Metall_grau', '#9DA0A5', 0.4, 0.8, 0),
    'gelaender_rot': farbe('Gelaender_rot', '#A3241C', 0.5, 0.5, 0),
    'tuer_dunkel': farbe('Durchfahrt_dunkel', '#1C1C1E', 0.9, 0, 0),
    'holz_tuer': farbe('Tuer_weiss', '#EDEDE8', 0.5, 0, 0),
    'kiefer': farbe('Kiefer_Nadeln', '#2E4A2A', 0.9, 0, 0.25, 2.5),
    'rinde': farbe('Rinde', '#5A4A3E', 0.95, 0, 0.2, 4),
    'kahl': farbe('Aeste_kahl', '#6E6258', 0.95, 0, 0.1),
    'gruen': farbe('Wiese', '#5E7A3E', 0.95, 0, 0.25, 0.05),
    'feld': farbe('Feld', '#8C8A55', 0.95, 0, 0.25, 0.03),
    'baum': farbe('Laub_fern', '#3F5A33', 0.95, 0, 0.3, 1.5),
    'markierung': farbe('Markierung_weiss', '#E8E8E3', 0.7, 0, 0),
}
M['glas_vordach'] = glas('Vordach_Glas', '#C9D4DB', 0.05)


def schornstein_mat(cx, cy, r):
    """Runder Backstein mit Putzflicken (Farben aus Aymans Fotos), zylindrisch abgewickelt: u = Winkel · r, v = z."""
    m, nt, b = node_mat('Schornstein_Backstein')
    tc = nt.nodes.new('ShaderNodeTexCoord'); sep = nt.nodes.new('ShaderNodeSeparateXYZ'); nt.links.new(tc.outputs['Object'], sep.inputs[0])
    dx = nt.nodes.new('ShaderNodeMath'); dx.operation = 'SUBTRACT'; dx.inputs[1].default_value = cx
    dy = nt.nodes.new('ShaderNodeMath'); dy.operation = 'SUBTRACT'; dy.inputs[1].default_value = cy
    nt.links.new(sep.outputs[0], dx.inputs[0]); nt.links.new(sep.outputs[1], dy.inputs[0])
    at = nt.nodes.new('ShaderNodeMath'); at.operation = 'ARCTAN2'
    nt.links.new(dy.outputs[0], at.inputs[0]); nt.links.new(dx.outputs[0], at.inputs[1])
    mu = nt.nodes.new('ShaderNodeMath'); mu.operation = 'MULTIPLY'; mu.inputs[1].default_value = r
    nt.links.new(at.outputs[0], mu.inputs[0])
    comb = nt.nodes.new('ShaderNodeCombineXYZ'); nt.links.new(mu.outputs[0], comb.inputs[0]); nt.links.new(sep.outputs[2], comb.inputs[1])
    br = nt.nodes.new('ShaderNodeTexBrick')
    br.inputs['Color1'].default_value = hexrgb('#74301F'); br.inputs['Color2'].default_value = hexrgb('#4F2018')
    br.inputs['Mortar'].default_value = hexrgb('#7E766C'); br.inputs['Scale'].default_value = 1.0
    br.inputs['Mortar Size'].default_value = 0.012; br.inputs['Brick Width'].default_value = 0.24; br.inputs['Row Height'].default_value = 0.075
    nt.links.new(comb.outputs[0], br.inputs['Vector'])
    nz = nt.nodes.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 0.35; nz.inputs['Detail'].default_value = 10
    nt.links.new(comb.outputs[0], nz.inputs['Vector'])
    ramp = nt.nodes.new('ShaderNodeValToRGB'); ramp.color_ramp.elements[0].position = 0.54; ramp.color_ramp.elements[1].position = 0.57
    nt.links.new(nz.outputs['Fac'], ramp.inputs['Fac'])
    mix = nt.nodes.new('ShaderNodeMix'); mix.data_type = 'RGBA'
    nt.links.new(ramp.outputs['Color'], mix.inputs['Factor']); nt.links.new(br.outputs['Color'], mix.inputs['A'])
    mix.inputs['B'].default_value = hexrgb('#9D958A')
    nt.links.new(mix.outputs['Result'], b.inputs['Base Color']); b.inputs['Roughness'].default_value = 0.92
    return m


def mesh(name, verts, faces, mat, c='Umgebung'):
    me = bpy.data.meshes.new(name); me.from_pydata([tuple(v) for v in verts], [], faces); me.update()
    ob = bpy.data.objects.new(name, me); coll(c).objects.link(ob)
    if isinstance(mat, (list, tuple)):
        for mm in mat:
            me.materials.append(mm)
    else:
        me.materials.append(mat)
    for p in me.polygons:
        p.use_smooth = False
    return ob


def quader(name, x0, y0, z0, x1, y1, z1, mat, c='Umgebung'):
    v = [(x0, y0, z0), (x1, y0, z0), (x1, y1, z0), (x0, y1, z0), (x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1)]
    f = [(0, 3, 2, 1), (4, 5, 6, 7), (0, 1, 5, 4), (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7)]
    return mesh(name, v, f, mat, c)


def flaeche(name, pts, z, mat, c='Umgebung'):
    return mesh(name, [(x, y, z) for x, y in pts], [tuple(range(len(pts)))], mat, c)


def satteldach(name, x0, y0, x1, y1, z_trauf, z_first, achse, mat, ueber=0.35, c='Umgebung', giebel=None):
    """Satteldach (First entlang achse 'x' oder 'y'), mit Giebeldreiecken."""
    if achse == 'x':
        ym = (y0 + y1) / 2
        v = [(x0 - ueber, y0 - ueber, z_trauf), (x1 + ueber, y0 - ueber, z_trauf), (x1 + ueber, ym, z_first), (x0 - ueber, ym, z_first),
             (x0 - ueber, y1 + ueber, z_trauf), (x1 + ueber, y1 + ueber, z_trauf),
             (x0, y0, z_trauf), (x0, y1, z_trauf), (x0, ym, z_first), (x1, y0, z_trauf), (x1, y1, z_trauf), (x1, ym, z_first)]
        f = [(0, 1, 2, 3), (3, 2, 5, 4), (6, 7, 8), (9, 11, 10)]
    else:
        xm = (x0 + x1) / 2
        v = [(x0 - ueber, y0 - ueber, z_trauf), (xm, y0 - ueber, z_first), (xm, y1 + ueber, z_first), (x0 - ueber, y1 + ueber, z_trauf),
             (x1 + ueber, y0 - ueber, z_trauf), (x1 + ueber, y1 + ueber, z_trauf),
             (x0, y0, z_trauf), (x1, y0, z_trauf), (xm, y0, z_first), (x0, y1, z_trauf), (x1, y1, z_trauf), (xm, y1, z_first)]
        f = [(0, 1, 2, 3), (1, 4, 5, 2), (6, 7, 8), (9, 11, 10)]
    ob = mesh(name, v, f, [mat, giebel or M['putz_hell']], c)
    for i, p in enumerate(ob.data.polygons):
        p.material_index = 0 if i < 2 else 1
    return ob


def fenster(name, seite, ebene, us, zs, w=1.1, h=1.4, rollladen=False, c='Umgebung'):
    """Fensterreihe auf einer Wand. seite: '+x','-x','+y','-y' (Blickrichtung nach außen), ebene = Wandkoordinate,
    us = Mittelpunkte entlang der Wand, zs = Unterkanten."""
    vg, fg, vr, fr = [], [], [], []
    n = {'+x': (1, 0), '-x': (-1, 0), '+y': (0, 1), '-y': (0, -1)}[seite]

    def quad(vs, fs, u0, u1, z0, z1, off):
        k = len(vs)
        for (u, z) in ((u0, z0), (u1, z0), (u1, z1), (u0, z1)):
            if seite in ('+x', '-x'):
                vs.append((ebene + n[0] * off, u, z))
            else:
                vs.append((u, ebene + n[1] * off, z))
        fs.append((k, k + 1, k + 2, k + 3) if seite in ('-x', '+y') else (k + 3, k + 2, k + 1, k))
    for u in us:
        for z in zs:
            quad(vr, fr, u - w / 2 - 0.08, u + w / 2 + 0.08, z - 0.08, z + h + 0.08, 0.03)
            if rollladen:
                quad(vg, fg, u - w / 2, u + w / 2, z, z + h * 0.55, 0.045)
                quad(vr, fr, u - w / 2, u + w / 2, z + h * 0.55, z + h, 0.045)
            else:
                quad(vg, fg, u - w / 2, u + w / 2, z, z + h, 0.045)
    mesh(name + '_Rahmen', vr, fr, M['rollladen'] if rollladen else M['rahmen_weiss'], c)
    mesh(name + '_Glas', vg, fg, M['fenster'], c)


def shedhalle(name, x0, y0, x1, y1, h, zahn=5.0, hz=2.2, achse='x', c='Hallen'):
    """Halle mit Sheddach (Sägezahn). Lichtbänder zeigen nach Norden (≈ +x): Zähne entlang achse."""
    quader(name + '_Wand', x0, y0, 0, x1, y1, h, M['beton'], c)
    vd, fd, vl, fl = [], [], [], []
    a0, a1 = (x0, x1) if achse == 'x' else (y0, y1)
    b0, b1 = (y0, y1) if achse == 'x' else (x0, x1)
    n = max(1, int((a1 - a0) // zahn))
    st = (a1 - a0) / n
    for i in range(n):
        a = a1 - i * st; b = a - st          # Lichtband bei a (nordseitig), Schräge nach b
        P = (lambda aa, bb, z: (aa, bb, z)) if achse == 'x' else (lambda aa, bb, z: (bb, aa, z))
        k = len(vd)
        vd += [P(b, b0, h), P(a, b0, h + hz), P(a, b1, h + hz), P(b, b1, h)]
        fd.append((k, k + 1, k + 2, k + 3) if achse == 'x' else (k + 3, k + 2, k + 1, k))
        k = len(vl)
        vl += [P(a, b0, h), P(a, b1, h), P(a, b1, h + hz), P(a, b0, h + hz)]
        fl.append((k, k + 1, k + 2, k + 3) if achse == 'x' else (k + 3, k + 2, k + 1, k))
        # Giebeldreiecke
        k = len(vd)
        vd += [P(b, b0, h), P(a, b0, h), P(a, b0, h + hz), P(b, b1, h), P(a, b1, h), P(a, b1, h + hz)]
        fd += [(k, k + 1, k + 2), (k + 3, k + 5, k + 4)]
    ob = mesh(name + '_Dach', vd, fd, M['shed'], c)
    mesh(name + '_Lichtband', vl, fl, M['lichtband'], c)
    # Flicken: hellere/dunklere Platten
    for i in range(int((x1 - x0) * (y1 - y0) / 120)):
        px, py = random.uniform(x0 + 1, x1 - 2), random.uniform(y0 + 1, y1 - 2)
        col = random.choice([M['dach_grau'], M['flachdach'], M['beton_hell']])
        if achse == 'x':
            # Platte auf der Schräge: Höhe interpolieren
            rel = ((x1 - px) % st) / st
            z = h + hz * (1 - rel) + 0.03
            flaeche(name + f'_Flicken{i}', [(px, py), (px + 1.2, py), (px + 1.2, py + 2.0), (px, py + 2.0)], z, col, c)
    return ob


def flachhalle(name, x0, y0, x1, y1, h, c='Hallen', wand=None, luefter=True):
    quader(name, x0, y0, 0, x1, y1, h, wand or M['putz_hell'], c)
    flaeche(name + '_Dach', [(x0, y0), (x1, y0), (x1, y1), (x0, y1)], h + 0.02, M['flachdach'], c)
    quader(name + '_Attika', x0 - 0.1, y0 - 0.1, h, x1 + 0.1, y0 + 0.2, h + 0.5, M['beton_hell'], c)
    # Fensterband zur Gasse (blau) + Lichtkuppeln / Technik / Dachlüfter (wie im Bild)
    quader(name + '_Fensterband', x0 + 1, y0 - 0.05, h * 0.55, x1 - 1, y0, h * 0.55 + 1.2, M['dachfenster'], c)
    for i in range(int((x1 - x0) * (y1 - y0) / 250)):
        px, py = random.uniform(x0 + 2, x1 - 4), random.uniform(y0 + 2, y1 - 4)
        quader(name + f'_Kuppel{i}', px, py, h, px + 1.6, py + 1.6, h + 0.5, M['dachfenster'] if i % 2 else M['metall_grau'], c)
    if luefter:
        for i in range(int((x1 - x0) * (y1 - y0) / 160)):
            px, py = random.uniform(x0 + 2, x1 - 2), random.uniform(y0 + 2, y1 - 2)
            zylinder(name + f'_Luefter{i}', px, py, h, 0.45, 0.45, 0.9, M['metall_grau'], 12, c)
            zylinder(name + f'_Luefterkappe{i}', px, py, h + 0.9, 0.6, 0.2, 0.35, M['metall_grau'], 12, c)


def zylinder(name, x, y, z0, r0, r1, hoehe, mat, n=40, c='Umgebung'):
    v, f = [], []
    for i in range(n):
        a = 2 * math.pi * i / n
        v += [(x + r0 * math.cos(a), y + r0 * math.sin(a), z0), (x + r1 * math.cos(a), y + r1 * math.sin(a), z0 + hoehe)]
    for i in range(n):
        j = (i + 1) % n
        f.append((2 * i, 2 * j, 2 * j + 1, 2 * i + 1))
    f.append(tuple(2 * i + 1 for i in range(n)))
    ob = mesh(name, v, f, mat, c)
    for p in ob.data.polygons:
        p.use_smooth = True
    return ob


def kugelkrone(name, x, y, z, rx, rz, mat, c='Baeume'):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=1, location=(0, 0, 0))
    ob = bpy.context.active_object; ob.name = name
    for v in ob.data.vertices:
        co = v.co.copy(); s = 1 + random.uniform(-0.18, 0.18)
        v.co = (x + co.x * rx * s, y + co.y * rx * s, z + co.z * rz * s)
    ob.data.materials.append(mat)
    for cc in ob.users_collection:
        cc.objects.unlink(ob)
    coll(c).objects.link(ob)
    return ob


def ast(name, p0, p1, r0, r1, mat, c='Baeume'):
    d = Vector(p1) - Vector(p0); ln = d.length
    ob = zylinder(name, 0, 0, 0, r0, r1, ln, mat, 8, c)
    rot = d.to_track_quat('Z', 'Y')
    for v in ob.data.vertices:
        v.co = Vector(p0) + rot @ v.co
    return ob


def kahler_baum(name, x, y, hoehe=13):
    ast(name + '_Stamm', (x, y, 0), (x, y, hoehe * 0.45), 0.32, 0.22, M['rinde'])
    k = [0]

    def zweig(p, d, lng, r, tiefe):
        if tiefe == 0 or lng < 0.6:
            return
        q = Vector(p) + d * lng
        k[0] += 1; ast(f'{name}_Ast{k[0]}', p, q, r, r * 0.65, M['kahl'])
        for _ in range(3 if tiefe > 1 else 2):
            nd = (d + Vector((random.uniform(-0.7, 0.7), random.uniform(-0.7, 0.7), random.uniform(0.1, 0.6)))).normalized()
            zweig(q, nd, lng * random.uniform(0.6, 0.75), r * 0.62, tiefe - 1)
    for i in range(4):
        a = i * math.pi / 2 + random.uniform(-0.3, 0.3)
        zweig((x, y, hoehe * 0.45), Vector((math.cos(a) * 0.6, math.sin(a) * 0.6, 0.8)).normalized(), hoehe * 0.28, 0.16, 4)


def kiefer(name, x, y, hoehe=16):
    ast(name + '_Stamm', (x, y, 0), (x, y, hoehe * 0.8), 0.4, 0.25, M['rinde'])
    for i, (dx, dy, z, rx, rz) in enumerate([(0, 0, 0.62, 4.2, 1.6), (1.2, -0.8, 0.72, 3.4, 1.4), (-1.0, 0.9, 0.8, 3.0, 1.3),
                                              (0.4, 0.3, 0.9, 2.4, 1.1), (-1.6, -1.2, 0.55, 2.2, 1.0)]):
        kugelkrone(f'{name}_Krone{i}', x + dx, y + dy, hoehe * z, rx, rz, M['kiefer'])


def laubbaum_fern(name, x, y, h):
    ast(name + '_Stamm', (x, y, 0), (x, y, h * 0.5), 0.25, 0.18, M['rinde'], 'Ferne')
    kugelkrone(name + '_Krone', x, y, h * 0.7, h * 0.32, h * 0.32, M['baum'], 'Ferne')


# ------------------------------------------------------------------ Boden, Gasse, Grundstück
# Boden mit Aussparung für die Baugrube (Ayman 20.11.: Keller unter Moschee UND Hof → x 0…BT, y 3…TT; nicht unter den Parkplätzen)
GX0, GX1, GY0, GY1 = 0.0, BT, 0.3, TT     # Ayman 23.11.: Moschee bündig an der Gasse
mesh('Boden_weit', [(-200, -200, -0.02), (260, -200, -0.02), (260, GY0, -0.02), (-200, GY0, -0.02),
                    (-200, GY1, -0.02), (260, GY1, -0.02), (260, 260, -0.02), (-200, 260, -0.02),
                    (GX0, GY0, -0.02), (GX0, GY1, -0.02), (GX1, GY0, -0.02), (GX1, GY1, -0.02)],
     [(0, 1, 2, 3), (4, 5, 6, 7), (3, 8, 9, 4), (10, 2, 5, 11)], M['asphalt'], 'Boden')
flaeche('Gasse_Pflaster', [(-18.4, GASSE), (68, GASSE), (68, 0), (-18.4, 0)], 0.0, M['pflaster'], 'Boden')
for i, (y0, y1) in enumerate(((GASSE - 0.25, GASSE), (0, 0.25))):
    flaeche(f'Randstein_{i}', [(-18.4, y0), (68, y0), (68, y1), (-18.4, y1)], 0.012, M['randstein'], 'Boden')
for i, x in enumerate((8, 26, 44)):
    flaeche(f'Gully_{i}', [(x, -3.6), (x + 0.5, -3.6), (x + 0.5, -3.1), (x, -3.1)], 0.015, M['metall_dunkel'], 'Boden')
# Grundstück: eingeebneter Schotter (Stufe 0)
# ohne die Moschee-Grundfläche; die liegt als eigenes Stück „Grube_Boden“ darin (senkt sich in Stufe 1 ab)
mesh('Grundstueck_Schotter', [(0, 0.25, 0.02), (L, 0.25, 0.02), (L, GY0, 0.02), (0, GY0, 0.02),
                              (GX1, GY0, 0.02), (L, LT, 0.02), (GX1, LT, 0.02)],
     [(0, 1, 2, 3), (4, 2, 5, 6)], M['schotter'], 'Grundstueck')
flaeche('Grube_Boden', [(GX0, GY0), (GX1, GY0), (GX1, GY1), (GX0, GY1)], 0.02, M['schotter'], 'Grundstueck')
# gegenüber: Vorfläche weißes Haus (rötliches Pflaster), Flächen zwischen den Hallen (Beton)
flaeche('Hofflaeche_gegenueber', [(-18.4, -40), (68, -40), (68, GASSE - 0.25), (-18.4, GASSE - 0.25)], 0.0, M['beton_boden'], 'Boden')

# ------------------------------------------------------------------ Hochstraße (leer, ohne Graffiti)
DZ = 6.2
quader('Hochstrasse_Fahrbahn', -31, -120, DZ - 0.9, -19, 160, DZ, M['asphalt'], 'Hochstrasse')
for i, x in enumerate((-31, -19.4)):
    quader(f'Hochstrasse_Bruestung{i}', x, -120, DZ, x + 0.4, 160, DZ + 1.05, M['beton_hell'], 'Hochstrasse')
for i, y in enumerate(range(-110, 160, 22)):
    quader(f'Hochstrasse_Pfeiler{i}', -27.5, y, 0, -22.5, y + 1.6, DZ - 0.9, M['beton'], 'Hochstrasse')
mk = []
for xm in (-28, -22):
    for y in range(-118, 158, 9):
        mk.append([(xm - 0.08, y, DZ + 0.01), (xm + 0.08, y, DZ + 0.01), (xm + 0.08, y + 4, DZ + 0.01), (xm - 0.08, y + 4, DZ + 0.01)])
for xm in (-25.15, -24.85):
    mk.append([(xm - 0.07, -120, DZ + 0.01), (xm + 0.07, -120, DZ + 0.01), (xm + 0.07, 160, DZ + 0.01), (xm - 0.07, 160, DZ + 0.01)])
mesh('Hochstrasse_Markierung', [p for q in mk for p in q], [tuple(range(4 * i, 4 * i + 4)) for i in range(len(mk))], M['markierung'], 'Hochstrasse')

# ------------------------------------------------------------------ Umgebung nach Aymans Bild (23.11.): cremefarbene Altbauten mit
# dunklen Schieferdächern, Gauben, Kaminen; Lärmschutzwand an der Hochstraße; dunkle Ziegeldächer mit blauen Dachfenstern rechts
# und hinten; kleines Haus mit rotem Ziegeldach rechts außen; Gewerbehallen mit Dachlüftern im Hintergrund.
def dachziegel(name, hexf, reihe=0.30, breite=0.42):
    m, nt, b = node_mat(name)
    br = nt.nodes.new('ShaderNodeTexBrick')
    br.inputs['Color1'].default_value = hexrgb(hexf)
    br.inputs['Color2'].default_value = [x * 0.8 for x in hexrgb(hexf)[:3]] + [1]
    br.inputs['Mortar'].default_value = [x * 0.55 for x in hexrgb(hexf)[:3]] + [1]
    br.inputs['Scale'].default_value = 1.0; br.inputs['Mortar Size'].default_value = 0.018
    br.inputs['Brick Width'].default_value = breite; br.inputs['Row Height'].default_value = reihe
    nt.links.new(wand_uv(nt, 1, 1), br.inputs['Vector'])
    nz = nt.nodes.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 0.25; nz.inputs['Detail'].default_value = 8
    mix = nt.nodes.new('ShaderNodeMix'); mix.data_type = 'RGBA'; mix.blend_type = 'MULTIPLY'; mix.inputs['Factor'].default_value = 0.45
    nt.links.new(br.outputs['Color'], mix.inputs['A']); nt.links.new(nz.outputs['Color'], mix.inputs['B'])
    nt.links.new(mix.outputs['Result'], b.inputs['Base Color'])
    bump = nt.nodes.new('ShaderNodeBump'); bump.inputs['Strength'].default_value = 0.5
    nt.links.new(br.outputs['Fac'], bump.inputs['Height']); nt.links.new(bump.outputs['Normal'], b.inputs['Normal'])
    b.inputs['Roughness'].default_value = 0.7
    return m


def leuchtglas(name, hexf, staerke):
    m = glas(name, hexf, 0.1)
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Emission Color'].default_value = hexrgb(hexf); b.inputs['Emission Strength'].default_value = staerke
    return m


M.update({
    'putz_alt': farbe('Putz_Altbau_creme', '#E9D6AE', 0.85, 0, 0.12, 0.9),
    'putz_alt2': farbe('Putz_Altbau_sand', '#DCC497', 0.85, 0, 0.12, 0.9),
    'sockel': farbe('Sockel_grau', '#7E776C', 0.9, 0, 0.12, 2),
    'gesims': farbe('Gesims_hell', '#F1E8D6', 0.7, 0, 0.04),
    'schiefer': dachziegel('Dach_Schiefer_dunkel', '#43464B', 0.26, 0.34),
    'ziegel_dunkel': dachziegel('Dach_Ziegel_anthrazit', '#4B4C50', 0.32, 0.30),
    'ziegel_rot': dachziegel('Dach_Ziegel_rot2', '#B0502F', 0.30, 0.28),
    'dachfenster_blau': leuchtglas('Dachfenster_blau', '#7CC3F0', 0.6),
    'laermschutz': glas('Laermschutz_gruen', '#5E8A63', 0.25),
    'rinne': farbe('Dachrinne', '#6B6E72', 0.45, 0.7, 0),
    'lampe': leuchtglas('Lampe_Hauseingang', '#FFC877', 4.0),
    'kamin': ziegel('Kamin_Backstein', '#8E4430', '#9A9186', (0.24, 0.072)),
    'tuer_holz': farbe('Haustuer_Holz', '#5C4030', 0.6, 0, 0.1),
})


# Fototexturen (Ayman 23.11.: „detailreicher, wie bei anderen“): freie Poly-Haven-Texturen statt einfarbiger Flächen
sys.path.insert(0, HERE)
from ph_texturen import ph
M.update({
    'schiefer': ph('PH_Schiefer', 'roof_slates_02', 2.5, 90, '#4A4E55', 1.0, 0.0, 0.4),
    'ziegel_dunkel': ph('PH_Ziegel_grau', 'grey_roof_tiles', 3.0, 0, '#5A5D63', 1.0, 0.0, 0.4),
    'ziegel_dunkel_y': ph('PH_Ziegel_grau_y', 'grey_roof_tiles', 3.0, 90, '#5A5D63', 1.0, 0.0, 0.4),
    'ziegel_rot': ph('PH_Ziegel_rot', 'clay_roof_tiles_02', 2.5, 90, None, 0, 0.0, 0.4),
    'putz_alt': ph('PH_Putz_creme', 'beige_wall_001', 3.0, 0, '#E9D6AE', 1.0, 0.0, 0.15),
    'putz_alt2': ph('PH_Putz_sand', 'beige_wall_001', 3.0, 0, '#DCC497', 1.0, 0.0, 0.15),
    'putz_hell': ph('PH_Putz_hell', 'plastered_wall_02', 3.5, 0, '#DCD6C8', 1.0, 0.0, 0.15),
    'putz_creme': ph('PH_Putz_creme2', 'beige_wall_001', 3.0, 0, '#E6DCC4', 1.0, 0.0, 0.15),
    'putz_weiss': ph('PH_Putz_weiss', 'plastered_wall_02', 3.5, 0, '#F0EEE8', 1.0, 0.0, 0.15),
    'beton': ph('PH_Beton', 'concrete_wall_008', 3.0, 0, None, 0, 0.0, 0.2),
    'beton_hell': ph('PH_Beton_hell', 'grey_plaster', 3.0, 0, None, 0, 0.05, 0.15),
    'asphalt': ph('PH_Asphalt', 'asphalt_02', 4.0, 0, None, 0, -0.05, 0.3),
    'schotter': ph('PH_Schotter', 'gravel_floor', 2.0, 0, None, 0, 0.0, 0.5),
    'backstein': ph('PH_Backstein', 'red_brick_03', 1.6, 0, None, 0, 0.0, 0.3),
    'backstein2': ph('PH_Backstein_dunkel', 'red_brick_03', 1.6, 0, None, 0, -0.08, 0.3),
    'kamin': ph('PH_Kamin', 'red_brick_03', 1.2, 0, None, 0, 0.0, 0.3),
    'mauer': ph('PH_Mauer', 'brick_wall_02', 1.8, 0, None, 0, 0.0, 0.3),
    'gruen': ph('PH_Wiese', 'leafy_grass', 3.0, 0, None, 0, 0.0, 0.2),
})


def roof_z(x0, x1, zt, zf, x):
    xm = (x0 + x1) / 2
    return zt + (zf - zt) * (1 - abs(x - xm) / ((x1 - x0) / 2))


def walmdach(name, x0, y0, x1, y1, zt, zf, mat, walm=4.0, ueber=0.4, c='Umgebung'):
    """Walmdach, First entlang x."""
    ym = (y0 + y1) / 2
    a, b, cc, d = (x0 - ueber, y0 - ueber), (x1 + ueber, y0 - ueber), (x1 + ueber, y1 + ueber), (x0 - ueber, y1 + ueber)
    v = [(*a, zt), (*b, zt), (*cc, zt), (*d, zt), (x0 + walm, ym, zf), (x1 - walm, ym, zf)]
    f = [(0, 1, 5, 4), (2, 3, 4, 5), (1, 2, 5), (3, 0, 4)]
    return mesh(name, v, f, mat, c)


def dachfenster_reihe(name, x0, x1, y_trauf, y_first, zt, zf, xs, ys_rel, mat, w=1.3, l=1.6, c='Umgebung'):
    """Dachfenster auf einer Dachfläche (First entlang x). ys_rel: 0 = Traufe … 1 = First."""
    vd, fd = [], []
    for x in xs:
        for r in ys_rel:
            ya = y_trauf + (y_first - y_trauf) * r; yb = ya + (l if y_first > y_trauf else -l) * abs(y_first - y_trauf) / math.hypot(y_first - y_trauf, zf - zt)
            za = zt + (zf - zt) * (ya - y_trauf) / (y_first - y_trauf) + 0.05; zb = zt + (zf - zt) * (yb - y_trauf) / (y_first - y_trauf) + 0.05
            k = len(vd); vd += [(x, ya, za), (x + w, ya, za), (x + w, yb, zb), (x, yb, zb)]
            fd.append((k, k + 1, k + 2, k + 3) if y_first > y_trauf else (k + 3, k + 2, k + 1, k))
    mesh(name, vd, fd, mat, c)


def altbau(name, x0, y0, x1, y1, zt, zf, wand, seiten, gauben=(), kamine=(), c='Links', giebel_vorn=False):
    """Altes Stadthaus: First entlang y, Putz, Sockel, Gesims, Fenster mit Bänken, Dachrinnen, Fallrohre, Kamine, Gauben."""
    quader(name, x0, y0, 0, x1, y1, zt, wand, c)
    quader(name + '_Sockel', x0 - 0.06, y0 - 0.06, 0, x1 + 0.06, y1 + 0.06, 0.75, M['sockel'], c)
    quader(name + '_Gesims', x0 - 0.18, y0 - 0.18, zt - 0.35, x1 + 0.18, y1 + 0.18, zt, M['gesims'], c)
    for zz in [1.0 + k * 3.2 + 3.0 for k in range(int((zt - 4) // 3.2))]:
        quader(name + f'_Band{int(zz*10)}', x0 - 0.05, y0 - 0.05, zz, x1 + 0.05, y1 + 0.05, zz + 0.16, M['gesims'], c)
    satteldach(name + '_Dach', x0, y0, x1, y1, zt, zf, 'y', M['schiefer'], 0.45, c, giebel=wand)
    zs = [1.25 + k * 3.2 for k in range(int((zt - 1.5) // 3.2))]
    baenke = []
    for seite, us in seiten.items():
        ebene = {'+x': x1, '-x': x0, '+y': y1, '-y': y0}[seite]
        fenster(f'{name}_F{seite}', seite, ebene, us, zs, 1.05, 1.6, c=c)
        for u in us:
            for z in zs:
                if seite in ('+x', '-x'):
                    e = ebene + (0.0 if seite == '+x' else -0.16)
                    baenke.append((e, u - 0.68, z - 0.16, e + 0.16, u + 0.68, z - 0.04))
                else:
                    e = ebene + (0.0 if seite == '+y' else -0.16)
                    baenke.append((u - 0.68, e, z - 0.16, u + 0.68, e + 0.16, z - 0.04))
    if giebel_vorn:   # Giebelfenster unter dem First
        xm = (x0 + x1) / 2
        fenster(f'{name}_F_Giebel', '-y', y0, [xm - 1.4, xm + 1.4], [zt + 0.6], 0.9, 1.3, c=c)
        fenster(f'{name}_F_Giebel2', '-y', y0, [xm], [zt + 0.6 + (zf - zt) * 0.5], 0.7, 0.9, c=c)
    for i, bb in enumerate(baenke):
        pass
    mesh(name + '_Fensterbaenke', [p for q in baenke for p in ((q[0], q[1], q[5]), (q[3], q[1], q[5]), (q[3], q[4], q[5]), (q[0], q[4], q[5]),
                                                              (q[0], q[1], q[2]), (q[3], q[1], q[2]), (q[3], q[4], q[2]), (q[0], q[4], q[2]))],
         [f for i in range(len(baenke)) for f in ((8*i, 8*i+1, 8*i+2, 8*i+3), (8*i+4, 8*i+5, 8*i+1, 8*i), (8*i+5, 8*i+6, 8*i+2, 8*i+1),
                                                  (8*i+6, 8*i+7, 8*i+3, 8*i+2), (8*i+7, 8*i+4, 8*i, 8*i+3))], M['gesims'], c)
    # Dachrinnen + Fallrohre
    for xr in (x0 - 0.45, x1 + 0.45):
        ast(name + f'_Rinne{int(xr*10)}', (xr, y0 - 0.45, zt - 0.05), (xr, y1 + 0.45, zt - 0.05), 0.09, 0.09, M['rinne'], c)
        for yr in (y0 + 0.4, y1 - 0.4):
            ast(name + f'_Fallrohr{int(xr*10)}_{int(yr*10)}', (xr, yr, 0.1), (xr, yr, zt - 0.05), 0.05, 0.05, M['rinne'], c)
    for i, (kx, ky) in enumerate(kamine):
        zr = roof_z(x0, x1, zt, zf, kx)
        quader(name + f'_Kamin{i}', kx - 0.4, ky - 0.3, zr - 0.5, kx + 0.4, ky + 0.3, zf + 1.6, M['kamin'], c)
        quader(name + f'_Kaminkopf{i}', kx - 0.48, ky - 0.38, zf + 1.6, kx + 0.48, ky + 0.38, zf + 1.78, M['sockel'], c)
    for i, (gy, seite) in enumerate(gauben):   # Gaube auf der Dachfläche +x oder -x
        sgn = 1 if seite == '+x' else -1
        xm = (x0 + x1) / 2; xf = xm + sgn * (x1 - x0) * 0.27
        zr = roof_z(x0, x1, zt, zf, xf); gx0, gx1 = sorted((xf, xf - sgn * 2.2))
        quader(name + f'_Gaube{i}', gx0, gy - 1.0, zr - 0.3, gx1, gy + 1.0, zr + 1.9, wand, c)
        satteldach(name + f'_Gaube{i}_Dach', gx0, gy - 1.0, gx1, gy + 1.0, zr + 1.9, zr + 2.6, 'x', M['schiefer'], 0.15, c, giebel=wand)
        fenster(name + f'_Gaube{i}_F', seite, xf, [gy], [zr + 0.25], 1.0, 1.3, c=c)
    return name


def dachfenster_y(name, x_trauf, x_first, zt, zf, ys, rels, mat, w=0.9, l=1.1, c='Links'):
    """Dachfenster auf einer Dachfläche mit First entlang y (Fläche von x_trauf bis x_first)."""
    vd, fd = [], []
    dx = x_first - x_trauf; ln = math.hypot(dx, zf - zt)
    for y in ys:
        for r in rels:
            xa = x_trauf + dx * r; xb = xa + dx * l / ln
            za = zt + (zf - zt) * (xa - x_trauf) / dx + 0.05; zb = zt + (zf - zt) * (xb - x_trauf) / dx + 0.05
            k = len(vd); vd += [(xa, y - w / 2, za), (xa, y + w / 2, za), (xb, y + w / 2, zb), (xb, y - w / 2, zb)]
            fd.append((k, k + 1, k + 2, k + 3) if dx < 0 else (k + 3, k + 2, k + 1, k))
    mesh(name, vd, fd, mat, c)


# ------------------------------------------------------------------ links: schmale lange Häuserzeile (Ayman 23.11., Bild von oben):
# ca. 7 m breit, Giebel zur Gasse, 3 Geschosse, mehrere Dachabschnitte mit kleinen Dachfenstern zur Moschee hin
HX0, HX1 = -7.6, -0.4
ZEILE = [('Altbau_vorn', 0.3, 9.5, 9.4, 12.5, M['putz_alt']), ('Altbau_2', 9.5, 18.0, 9.0, 12.1, M['putz_alt2']),
         ('Altbau_3', 18.0, 26.5, 9.6, 12.7, M['putz_alt']), ('Altbau_4', 26.5, 35.0, 9.1, 12.2, M['putz_alt2'])]
for i, (n, y0, y1, zt, zf, mat) in enumerate(ZEILE):
    us = [y0 + 1.4 + k * 2.0 for k in range(int((y1 - y0 - 1.0) // 2.0))]
    altbau(n, HX0, y0, HX1, y1, zt, zf, mat, {'+x': us, '-x': us[::2]}, kamine=[(-2.2, y0 + 1.2)] if i % 2 == 0 else [(-5.6, y1 - 1.2)])
    dachfenster_y(n + '_Dachfenster', HX1 + 0.45, (HX0 + HX1) / 2, zt, zf, [y0 + (y1 - y0) * 0.3, y0 + (y1 - y0) * 0.7], [0.35], M['dachfenster'], 0.8, 1.0)
# Vorderseite (Giebel zur Gasse): 3 Fensterachsen, Haustür mit Rundbogen, zwei Laternen
fenster('Altbau_vorn_F_vorn_OG', '-y', 0.3, [-6.0, -4.0, -2.0], [4.45, 7.65], 1.05, 1.6, c='Links')
fenster('Altbau_vorn_F_vorn_EG', '-y', 0.3, [-6.0, -2.0], [1.25], 1.05, 1.6, c='Links')
fenster('Altbau_vorn_F_Giebel', '-y', 0.3, [-4.0], [10.0], 0.9, 1.2, c='Links')
quader('Altbau_vorn_Tuer', -4.6, 0.24, 0.3, -3.4, 0.3, 2.6, M['tuer_holz'], 'Links')
quader('Altbau_vorn_Stufe', -4.9, -0.3, 0, -3.1, 0.3, 0.3, M['sockel'], 'Links')
for i, x in enumerate((-5.0, -3.0)):
    quader(f'Altbau_vorn_Laterne{i}', x - 0.15, 0.12, 2.1, x + 0.15, 0.3, 2.5, M['lampe'], 'Links')
for i, x in enumerate((-6.9, -1.1)):
    quader(f'Altbau_vorn_Kuebel{i}', x - 0.3, -0.4, 0, x + 0.3, 0.2, 0.5, M['sockel'], 'Links')
    kugelkrone(f'Altbau_vorn_Pflanze{i}', x, -0.1, 0.85, 0.35, 0.4, M['kiefer'], 'Links')
kiefer('Kiefer_Altbau', -3.5, 37.5, 14)
# Straße zwischen Häuserzeile und Hochstraße: Gehweg + gestrichelte Mittellinie
flaeche('Gehweg_links', [(-9.3, -6.5), (HX0, -6.5), (HX0, 40), (-9.3, 40)], 0.03, M['pflaster'], 'Boden')
flaeche('Randstein_links', [(-9.5, -6.5), (-9.3, -6.5), (-9.3, 40), (-9.5, 40)], 0.035, M['randstein'], 'Boden')
mesh('Strasse_links_Mittellinie', [p for y in range(-60, 120, 6) for p in ((-14.3, y, 0.01), (-14.15, y, 0.01), (-14.15, y + 3, 0.01), (-14.3, y + 3, 0.01))],
     [tuple(range(4 * i, 4 * i + 4)) for i in range(30)], M['markierung'], 'Boden')

# ------------------------------------------------------------------ Lärmschutzwand auf der Hochstraße (grünliches Glas mit Pfosten)
quader('Laermschutz_Glas', -19.4, -120, DZ + 1.05, -19.25, 160, DZ + 4.2, M['laermschutz'], 'Hochstrasse')
viele_p = []
for i, y in enumerate(range(-120, 161, 4)):
    quader(f'Laermschutz_Pfosten{i}', -19.5, y - 0.1, DZ + 1.0, -19.15, y + 0.1, DZ + 4.35, M['metall_grau'], 'Hochstrasse')

# ------------------------------------------------------------------ hinten: Mauer + große Halle mit dunklem Ziegeldach und blauen Dachfenstern
quader('Mauer_hinten', 0, TT, 0, BT, TT + 0.3, 4.6, M['mauer'], 'Hinten')
quader('Mauer_Abdeckung', -0.05, TT - 0.05, 4.6, BT + 0.05, TT + 0.35, 4.75, M['beton_hell'], 'Hinten')
for i, x in enumerate((0.0, BT / 2 - 0.2, BT - 0.4)):
    quader(f'Mauer_Pfeiler{i}', x, TT - 0.15, 0, x + 0.42, TT + 0.3, 4.9, M['beton_hell'], 'Hinten')
quader('Halle_hinten', -0.4, TT + 0.3, 0, 56, 44, 5.6, M['putz_hell'], 'Hinten')
walmdach('Halle_hinten_Dach', -0.4, TT + 0.3, 56, 44, 5.6, 11.0, M['ziegel_dunkel'], 5.0, 0.45, 'Hinten')
dachfenster_reihe('Halle_hinten_Dachfenster', -0.4, 56, TT + 0.3 - 0.45, (TT + 0.3 + 44) / 2, 5.6, 11.0,
                  [4.0, 14.0, 24.0, 34.0, 44.0], [0.35], M['dachfenster_blau'], 1.6, 1.8, 'Hinten')
for i, x in enumerate((-0.4 - 0.45, 56 + 0.45)):
    pass
ast('Halle_hinten_Rinne', (-0.85, TT - 0.15, 5.55), (56.45, TT - 0.15, 5.55), 0.1, 0.1, M['rinne'], 'Hinten')

# ------------------------------------------------------------------ rechts: langes Nachbargebäude (helle Fassade, großes dunkles Ziegeldach)
NX0, NY0, NX1, NY1 = BT + 0.3, LT + 0.3, L + 4.5, TT + 0.3
quader('Nachbar_lang', NX0, NY0, 0, NX1, NY1, 5.2, M['putz_hell'], 'Rechts')
quader('Nachbar_lang_Sockel', NX0 - 0.05, NY0 - 0.05, 0, NX1 + 0.05, NY1, 0.6, M['sockel'], 'Rechts')
walmdach('Nachbar_lang_Dach', NX0, NY0, NX1, NY1, 5.2, 12.0, M['ziegel_dunkel'], 4.5, 0.5, 'Rechts')
dachfenster_reihe('Nachbar_lang_Dachfenster', NX0, NX1, NY0 - 0.5, (NY0 + NY1) / 2, 5.2, 12.0,
                  [NX0 + 5 + i * 5.2 for i in range(6)], [0.3], M['dachfenster_blau'], 1.5, 1.7, 'Rechts')
dachfenster_reihe('Nachbar_lang_Dachfenster2', NX0, NX1, NY0 - 0.5, (NY0 + NY1) / 2, 5.2, 12.0,
                  [NX0 + 7.6 + i * 5.2 for i in range(5)], [0.62], M['dachfenster_blau'], 1.5, 1.7, 'Rechts')
ast('Nachbar_lang_Rinne', (NX0 - 0.5, NY0 - 0.55, 5.15), (NX1 + 0.5, NY0 - 0.55, 5.15), 0.1, 0.1, M['rinne'], 'Rechts')
fenster('Nachbar_lang_F_Stirn', '-x', NX0, [16, 20, 24], [2.2], 1.0, 1.4, c='Rechts')
# kleiner Nachbar rechts außen: helles Haus mit rotem Ziegeldach (wie im Bild)
quader('Nachbar_rechts', L + 0.5, 0.3, 0, L + 5.5, NY0, 4.6, M['putz_weiss'], 'Rechts')
satteldach('Nachbar_rechts_Dach', L + 0.5, 0.3, L + 5.5, NY0, 4.6, 6.8, 'y', M['ziegel_rot'], 0.35, 'Rechts', giebel=M['putz_weiss'])
fenster('Nachbar_rechts_F', '-y', 0.3, [L + 3.0], [1.2], 1.4, 1.2, c='Rechts')
quader('Zeile_vor_Torgebaeude', L + 5.5, 0.3, 0, 68, 9, 6.2, M['putz_creme'], 'Rechts')
satteldach('Zeile_vor_Torgebaeude_Dach', L + 5.5, 0.3, 68, 9, 6.2, 8.4, 'x', M['ziegel_dunkel'], 0.3, 'Rechts', giebel=M['putz_creme'])
fenster('Zeile_vor_Torgebaeude_F', '-y', 0.3, [58, 61, 64], [1.0, 3.8], 1.1, 1.3, c='Rechts')

# ------------------------------------------------------------------ gegenüber: weißes Haus + Schornstein
SX, SY = BT + 0.4, -8.9
SCHORNSTEIN = False      # Ayman 19.11.: Schornstein steht zu sehr im Weg → weg (Code bleibt für später)
if SCHORNSTEIN:
    zylinder('Schornstein', SX, SY, 0, 2.1, 1.35, 28.0, schornstein_mat(SX, SY, 1.7), 48, 'Schornstein')
    zylinder('Schornstein_Kopf', SX, SY, 27.6, 1.42, 1.42, 0.6, M['backstein2'], 48, 'Schornstein')
# gegenüber (Ayman 23.11., Bild von oben): durchgehende Reihe alter Hallen, je ca. 9,5 m breit, Giebel zur Gasse,
# dunkle Ziegel-/Schieferdächer mit Dachfenstern und kleinen Lüftern, Brandwände dazwischen
GY_V, GY_H = -8.4, -30.0
GXS = [-18.0 + k * 9.5 for k in range(10)]
for i, gx in enumerate(GXS):
    x0, x1 = gx, gx + 9.5; zt, zf = 5.0 + (i % 3) * 0.35, 8.6 + (i % 3) * 0.35
    wand = [M['putz_hell'], M['beton'], M['putz_creme'], M['backstein2']][i % 4]
    quader(f'Halle_gegenueber{i}', x0 + 0.15, GY_H, 0, x1 - 0.15, GY_V, zt, wand, 'Gegenueber')
    satteldach(f'Halle_gegenueber{i}_Dach', x0 + 0.15, GY_H, x1 - 0.15, GY_V, zt, zf, 'y', M['ziegel_dunkel_y'] if i % 2 else M['schiefer'], 0.15, 'Gegenueber', giebel=wand)
    quader(f'Halle_gegenueber{i}_Brandwand', x1 - 0.15, GY_H, 0, x1 + 0.15, GY_V, zt + 0.5, M['beton_hell'], 'Gegenueber')
    for sgn, xt in ((1, x0), (-1, x1)):
        dachfenster_y(f'Halle_gegenueber{i}_Dachfenster{sgn}', xt + sgn * 0.15, (x0 + x1) / 2, zt, zf, [GY_V - 6.0, GY_V - 14.5], [0.4], M['dachfenster'], 1.2, 1.3, 'Gegenueber')
    zylinder(f'Halle_gegenueber{i}_Luefter', (x0 + x1) / 2 - 1.2, GY_V - 10.0, zf - 0.6, 0.25, 0.25, 1.0, M['metall_grau'], 10, 'Gegenueber')
    fenster(f'Halle_gegenueber{i}_F', '+y', GY_V, [x0 + 2.0, x1 - 2.0], [1.2, 3.2] if zt > 5.2 else [1.4], 1.3, 1.2, c='Gegenueber')
    quader(f'Halle_gegenueber{i}_Tor', x0 + 3.6, GY_V, 0, x1 - 3.6, GY_V + 0.05, 3.2, M['rollladen'] if i % 2 else M['tuer_dunkel'], 'Gegenueber')
    fenster(f'Halle_gegenueber{i}_F_Giebel', '+y', GY_V, [(x0 + x1) / 2], [zt + 0.5], 1.0, 1.0, c='Gegenueber')
flaeche('Gehweg_gegenueber', [(-18.4, GY_V), (68, GY_V), (68, GASSE - 0.25), (-18.4, GASSE - 0.25)], 0.02, M['pflaster'], 'Boden')

# ------------------------------------------------------------------ Ende der Gasse: Torgebäude, Kiefer, Laubbaum, Funkmast
quader('Torgebaeude', 68, -14, 0, 80, 9, 7.4, M['putz_creme'], 'Torgebaeude')
satteldach('Torgebaeude_Dach', 68, -14, 80, 9, 7.4, 10.2, 'y', M['dach_grau'], 0.3, 'Torgebaeude', giebel=M['putz_creme'])
quader('Torgebaeude_Durchfahrt', 67.9, -6.2, 0, 68.4, -0.4, 4.8, M['tuer_dunkel'], 'Torgebaeude')
quader('Torgebaeude_Rahmen_o', 67.85, -6.5, 4.8, 68.0, -0.1, 5.15, M['dach_rot'], 'Torgebaeude')
quader('Torgebaeude_Rundbogentuer', 67.95, 1.2, 0, 68.0, 2.5, 2.6, M['holz_tuer'], 'Torgebaeude')
zylinder('Torgebaeude_Rundfenster', 0, 0, 0, 0.62, 0.62, 0.06, M['fenster'], 32, 'Torgebaeude')
o = bpy.data.objects['Torgebaeude_Rundfenster']
for v in o.data.vertices:
    v.co = Vector((67.95 - v.co.z, 1.85 + v.co.x, 3.6 + v.co.y))
kiefer('Kiefer', 73, 12.5, 17)
kahler_baum('Laubbaum', 61, 15, 14)
quader('Funkmast', 57.7, 23.7, 0, 58.3, 24.3, 27, M['metall_grau'], 'Baeume')
for i, a in enumerate((0, 2.1, 4.2)):
    quader(f'Funkmast_Antenne{i}', 58 + math.cos(a) * 0.5 - 0.15, 24 + math.sin(a) * 0.5 - 0.1, 23.5, 58 + math.cos(a) * 0.5 + 0.15, 24 + math.sin(a) * 0.5 + 0.1, 25.8, M['beton_hell'], 'Baeume')

# ------------------------------------------------------------------ ringsum: alte Fabrikhallen (Sheddächer), helle Gewerbehallen, Parkplatz
shedhalle('Shedhalle_gegenueber_hinten', -17, -48, 34, -33, 5.0)
flachhalle('Halle_hinten_flach1', -16, 45, 40, 70, 7.5)          # Ayman 23.11.: Flachdach-Hallen mit Dachlüftern
flachhalle('Halle_hinten_flach2', 42, 45, 95, 72, 8.0)
shedhalle('Shedhalle_rechts', 82, -40, 116, 20, 6.5)
shedhalle('Shedhalle_weit1', -17, -95, 30, -50, 5.5)
flachhalle('Gewerbehalle_hell1', 40, 80, 120, 115, 9.0)
flachhalle('Gewerbehalle_hell2', -16, 78, 36, 112, 8.0)
flachhalle('Gewerbehalle_hell3', 115, -30, 165, 45, 9.5)
flachhalle('Gewerbehalle_hell4', 35, -100, 95, -48, 8.5)
flaeche('Parkplatz_leer', [(76, 24), (112, 24), (112, 42), (76, 42)], 0.01, M['asphalt'], 'Hallen')
for i in range(12):
    x = 77 + i * 2.8
    flaeche(f'Parkplatz_Linie{i}', [(x, 24.5), (x + 0.12, 24.5), (x + 0.12, 29.5), (x, 29.5)], 0.02, M['markierung'], 'Hallen')
quader('Haus_Ziegeldach', 64, 26, 0, 74, 36, 5.5, M['putz_creme'], 'Hallen')
satteldach('Haus_Ziegeldach_Dach', 64, 26, 74, 36, 5.5, 8.5, 'x', M['dach_rot'], 0.4, 'Hallen')
for i, (x, y, h) in enumerate(((80, 46, 9), (60, 40, 8), (-10, 46, 7), (118, 60, 10), (100, -45, 8), (-40, 40, 11), (-45, -20, 12))):
    laubbaum_fern(f'Baum_einzeln{i}', x, y, h)
# Grüngürtel mit Feldern ganz hinten (+Y) und rechts
flaeche('Gruenguertel', [(-200, 120), (260, 120), (260, 260), (-200, 260)], 0.0, M['gruen'], 'Ferne')
flaeche('Felder', [(-60, 150), (200, 150), (200, 250), (-60, 250)], 0.02, M['feld'], 'Ferne')
for i in range(40):
    laubbaum_fern(f'Baum_Guertel{i}', random.uniform(-150, 230), random.uniform(122, 145), random.uniform(8, 14))

# ------------------------------------------------------------------ Licht: späte Nachmittagssonne aus Südwest, warm
w = bpy.data.worlds.new('Himmel'); sc.world = w; w.use_nodes = True
bg = w.node_tree.nodes['Background']
try:
    sky = w.node_tree.nodes.new('ShaderNodeTexSky')
    for t in ('MULTIPLE_SCATTERING', 'NISHITA', 'HOSEK_WILKIE'):
        try:
            sky.sky_type = t; break
        except TypeError:
            continue
    mixw = w.node_tree.nodes.new('ShaderNodeMix'); mixw.data_type = 'RGBA'; mixw.inputs['Factor'].default_value = 0.35
    w.node_tree.links.new(sky.outputs['Color'], mixw.inputs['A']); mixw.inputs['B'].default_value = (0.93, 0.86, 0.78, 1)   # Ayman 23.11.: helles, freundliches Wetter
    w.node_tree.links.new(mixw.outputs['Result'], bg.inputs['Color'])
    bg.inputs['Strength'].default_value = 0.3
    SKY = sky
except Exception:
    bg.inputs['Color'].default_value = (0.55, 0.65, 0.85, 1); bg.inputs['Strength'].default_value = 0.8
    SKY = None
SUED = Vector((-NORD.x, -NORD.y, 0)); WEST = Vector((NORD.y, -NORD.x, 0))   # West = Nord um 90° gegen den Uhrzeigersinn
WEST = Vector((-NORD.y, NORD.x, 0)) if WEST.y < 0 else WEST              # West zeigt nach hinten (+Y)
SW = (SUED * 0.45 + WEST * 0.89).normalized()                           # echt: Azimut ≈ 243° (Nov., ca. 15:30) = von hinten
SW = Vector((-0.55, -0.83, 0)).normalized()                            # Aymans Wahl (19.11.): tiefe warme Sonne von vorn links → Glasfront im Licht
HOEHE = math.radians(25)     # Ayman 23.11.: „viel heller“ → Sonne höher (heller Tag statt tiefer Abendsonne)
zur_sonne = Vector((SW.x * math.cos(HOEHE), SW.y * math.cos(HOEHE), math.sin(HOEHE)))
sd = bpy.data.lights.new('Sonne', 'SUN'); sd.energy = 4.8; sd.color = (1.0, 0.88, 0.74); sd.angle = math.radians(0.8)
so = bpy.data.objects.new('Sonne', sd); sc.collection.objects.link(so)
so.rotation_euler = (-zur_sonne).to_track_quat('-Z', 'Y').to_euler()
if SKY is not None:
    try:
        SKY.sun_direction = zur_sonne
    except AttributeError:
        pass
    for attr, val in (('sun_elevation', HOEHE), ('sun_rotation', math.atan2(zur_sonne.x, zur_sonne.y))):
        if hasattr(SKY, attr):
            setattr(SKY, attr, val)
    if hasattr(SKY, 'sun_disc'):
        SKY.sun_disc = False

# ------------------------------------------------------------------ Render-Grundeinstellungen + Kamera
sc.render.engine = 'CYCLES'
sc.cycles.device = 'CPU'; sc.cycles.samples = 32; sc.cycles.use_denoising = True
sc.cycles.max_bounces = 4
sc.view_settings.view_transform = 'AgX'
sc.view_settings.exposure = -0.1
try:
    sc.view_settings.look = 'AgX - Medium High Contrast'
except TypeError:
    pass
cd = bpy.data.cameras.new('Drohne'); cd.lens = 24; cd.sensor_width = 36; cd.clip_end = 2000
cam = bpy.data.objects.new('Drohne', cd); sc.collection.objects.link(cam); sc.camera = cam
cam.location = (-12, -48, 34)
cam.rotation_euler = (Vector((24, 6, 0)) - cam.location).to_track_quat('-Z', 'Y').to_euler()

AUS = os.path.join(HERE, 'neubau.blend')
bpy.ops.wm.save_as_mainfile(filepath=AUS, relative_remap=True)
print('gespeichert:', AUS, '| Objekte:', len(bpy.data.objects), '| Sonne Richtung:', tuple(round(c, 2) for c in zur_sonne))
