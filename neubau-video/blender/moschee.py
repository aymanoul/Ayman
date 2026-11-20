#!/usr/bin/env python3
"""Phase 3: Moschee im Endzustand + Keller, Vorplatz, Hof, Parken, Wohnwagen-Stellplätze, Zaun + Schiebetor.
Öffnet blender/neubau.blend (aus umgebung.py) und speichert dorthin zurück.

    .venv-blender/bin/python blender/umgebung.py && .venv-blender/bin/python blender/moschee.py

Maße wie im freigegebenen Lageplan (Phase 1). Höhen: Keller −3,2…0, EG 0…5,5 (Männer), Geschossdecke 5,5…5,95,
OG 5,95…8,7 (Frauen, 2,75 m), Dachplatte 8,7…9,2, Attika bis 10,0 m.
Sammlungen je Baustufe (für den Zeitraffer in Phase 4): S1_Aushub (folgt), S2_Keller, S3_EG, S4_OG, S5_Dach, S6_Aussen, Innen.
Qibla von Ratingen ≈ 127° → im Modell Richtung −X (linke Wand zu den Altbauten): dort Mihrab und Minbar, Gebetsreihen parallel dazu.
Keine Menschen, Autos, Wohnwagen; Parken und Wohnwagen-Plätze leer (nur Markierungen). Schiebetor geschlossen
(Eigenschaft „offen“ 0…1 am Objekt Schiebetor schiebt es per Treiber 6 m nach links, steht auf 0).
"""
import math
import os
import random
import bpy
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
random.seed(11)
bpy.ops.wm.open_mainfile(filepath=os.path.join(HERE, 'neubau.blend'))
sc = bpy.context.scene

L, BT, TT, LT = 50.0, 16.5, 29.0, 12.3
VOR, MT = 3.0, 12.0
Y0, Y1 = VOR, VOR + MT                  # Moschee: y 3 … 15
PORTAL_X = BT - 2.9                     # Portal am rechten Ende: x 13,6 … 16,5
PK, TOR = BT + 9.0, L - 6.0
H_EG, H_DECKE, H_OG, H_DACH, H_ATTIKA = 5.5, 5.95, 8.7, 9.2, 10.0
COLL = {}


def coll(name, parent=None):
    if name not in COLL:
        c = bpy.data.collections.get(name) or bpy.data.collections.new(name)
        if c.name not in [x.name for x in sc.collection.children_recursive]:
            (parent or sc.collection).children.link(c)
        COLL[name] = c
    return COLL[name]


def hexrgb(h):
    h = h.lstrip('#'); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c) + (1.0,)


def node_mat(name):
    m = bpy.data.materials.new(name); m.use_nodes = True
    return m, m.node_tree, m.node_tree.nodes['Principled BSDF']


def farbe(name, hexf, rough=0.8, metal=0.0, variation=0.06, skala=1.5):
    m, nt, b = node_mat(name)
    b.inputs['Roughness'].default_value = rough; b.inputs['Metallic'].default_value = metal
    if variation:
        nz = nt.nodes.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = skala
        mix = nt.nodes.new('ShaderNodeMix'); mix.data_type = 'RGBA'; mix.blend_type = 'MULTIPLY'; mix.inputs['Factor'].default_value = variation * 4
        mix.inputs['A'].default_value = hexrgb(hexf); nt.links.new(nz.outputs['Color'], mix.inputs['B'])
        mix2 = nt.nodes.new('ShaderNodeMix'); mix2.data_type = 'RGBA'; mix2.inputs['Factor'].default_value = 1 - variation
        nt.links.new(mix.outputs['Result'], mix2.inputs['A']); mix2.inputs['B'].default_value = hexrgb(hexf)
        nt.links.new(mix2.outputs['Result'], b.inputs['Base Color'])
    else:
        b.inputs['Base Color'].default_value = hexrgb(hexf)
    return m


def raster(name, hex1, hex2, hexfuge, breite, hoehe, fuge=0.01, boden=True, rough=0.8):
    """Platten/Raster (Brick-Textur) in Metern; boden: (x, y), sonst Wand (x+y, z)."""
    m, nt, b = node_mat(name)
    tc = nt.nodes.new('ShaderNodeTexCoord'); sep = nt.nodes.new('ShaderNodeSeparateXYZ'); nt.links.new(tc.outputs['Object'], sep.inputs[0])
    comb = nt.nodes.new('ShaderNodeCombineXYZ')
    if boden:
        nt.links.new(sep.outputs[0], comb.inputs[0]); nt.links.new(sep.outputs[1], comb.inputs[1])
    else:
        add = nt.nodes.new('ShaderNodeMath'); add.operation = 'ADD'
        nt.links.new(sep.outputs[0], add.inputs[0]); nt.links.new(sep.outputs[1], add.inputs[1])
        nt.links.new(add.outputs[0], comb.inputs[0]); nt.links.new(sep.outputs[2], comb.inputs[1])
    br = nt.nodes.new('ShaderNodeTexBrick'); nt.links.new(comb.outputs[0], br.inputs['Vector'])
    br.offset = 0.0 if not boden else 0.5
    br.inputs['Color1'].default_value = hexrgb(hex1); br.inputs['Color2'].default_value = hexrgb(hex2)
    br.inputs['Mortar'].default_value = hexrgb(hexfuge); br.inputs['Scale'].default_value = 1.0
    br.inputs['Mortar Size'].default_value = fuge; br.inputs['Brick Width'].default_value = breite; br.inputs['Row Height'].default_value = hoehe
    nt.links.new(br.outputs['Color'], b.inputs['Base Color']); b.inputs['Roughness'].default_value = rough
    return m


def leuchte(name, hexf='#FFD9A6', staerke=4.0):
    m, nt, b = node_mat(name)
    b.inputs['Base Color'].default_value = hexrgb(hexf)
    b.inputs['Emission Color'].default_value = hexrgb(hexf); b.inputs['Emission Strength'].default_value = staerke
    return m


def glas_fassade(name):
    m, nt, b = node_mat(name)
    b.inputs['Base Color'].default_value = hexrgb('#8DB4D6'); b.inputs['Roughness'].default_value = 0.02
    for key in ('Transmission Weight', 'Transmission'):
        if key in b.inputs:
            b.inputs[key].default_value = 0.85
    b.inputs['IOR'].default_value = 1.45
    return m


def teppich(name):
    """Grüner Gebetsteppich, Reihen parallel zur Qibla-Wand (x = 0) alle 1,2 m."""
    m, nt, b = node_mat(name)
    tc = nt.nodes.new('ShaderNodeTexCoord'); wv = nt.nodes.new('ShaderNodeTexWave')
    wv.bands_direction = 'X'; wv.wave_profile = 'SAW'; wv.inputs['Scale'].default_value = 1 / 1.2 / 1.0
    nt.links.new(tc.outputs['Object'], wv.inputs['Vector'])
    ramp = nt.nodes.new('ShaderNodeValToRGB')
    ramp.color_ramp.elements[0].position = 0.0; ramp.color_ramp.elements[0].color = hexrgb('#E6D9A8')
    ramp.color_ramp.elements[1].position = 0.06; ramp.color_ramp.elements[1].color = hexrgb('#2E6A44')
    nt.links.new(wv.outputs['Fac'], ramp.inputs['Fac'])
    nt.links.new(ramp.outputs['Color'], b.inputs['Base Color']); b.inputs['Roughness'].default_value = 0.95
    return m


def pv(name):
    m = raster(name, '#18213A', '#1C2742', '#9AA3B0', 0.165, 0.165, 0.004, True, 0.25)
    m.node_tree.nodes['Principled BSDF'].inputs['Metallic'].default_value = 0.2
    return m


M = {
    'glas': glas_fassade('Glasfassade_blau'),
    'pfosten': farbe('Pfosten_anthrazit', '#2A2D33', 0.35, 0.7, 0),
    'band': farbe('Geschossband_hell', '#E7E2D6', 0.6, 0, 0.03),
    'attika': farbe('Attika_hell', '#EDE8DD', 0.6, 0, 0.03),
    'stein': raster('Naturstein_Portal', '#E4D8C0', '#D9CBB0', '#CBBFA6', 0.9, 0.45, 0.006, False, 0.55),
    'putz': farbe('Putz_Moschee', '#ECE7DD', 0.75, 0, 0.04),
    'beton_roh': farbe('Beton_roh', '#A8A49C', 0.9, 0, 0.12, 0.8),
    'teppich': teppich('Gebetsteppich_gruen'),
    'mihrab': farbe('Mihrab_Stein', '#EADFC8', 0.5, 0, 0.03),
    'gold': farbe('Gold_Zier', '#CA9E4E', 0.3, 0.9, 0),
    'holz': farbe('Holz_Minbar', '#7A4E2C', 0.55, 0, 0.1, 6),
    'saeule': farbe('Saeule_weiss', '#F1EEE7', 0.5, 0, 0.02),
    'licht_innen': leuchte('Innenlicht_warm', '#FFE2B5', 3.0),
    'gruendach': farbe('Gruendach', '#5D7A3A', 0.95, 0, 0.3, 3),
    'kies': farbe('Dachkies', '#B3ACA0', 0.95, 0, 0.15, 8),
    'pv': pv('PV_Module'),
    'pv_rahmen': farbe('PV_Rahmen', '#B8BEC6', 0.3, 0.9, 0),
    'vorplatz': raster('Vorplatz_Platten', '#D8D1C3', '#CFC6B6', '#B8AFA0', 0.6, 0.6, 0.008),
    'hofplatten': raster('Hof_Platten', '#DCD3C2', '#D2C8B5', '#BBB09D', 0.8, 0.8, 0.01),
    'asphalt': farbe('Asphalt_neu', '#3E3F42', 0.85, 0, 0.06, 2),
    'markierung': farbe('Markierung', '#F0F0EC', 0.6, 0, 0),
    'zaun': farbe('Zaun_anthrazit', '#24262A', 0.4, 0.7, 0),
    'kuebel': farbe('Kuebel_Beton', '#8F877B', 0.85, 0, 0.08),
    'oliven': farbe('Olivenlaub', '#7C8C5B', 0.9, 0, 0.25, 6),
    'stamm': farbe('Olivenstamm', '#6A5A49', 0.95, 0, 0.2, 5),
    'pflanzen': farbe('Pflanzen_gruen', '#3F6232', 0.9, 0, 0.3, 6),
    'bank': farbe('Bank_Holz', '#8B5E3C', 0.6, 0, 0.1, 5),
    'schirm': farbe('Schirm_Stoff', '#F1EADB', 0.8, 0, 0.02),
    'hecke': farbe('Hecke', '#3D5C2F', 0.95, 0, 0.3, 5),
    'wandleuchte': leuchte('Wandleuchte_warm', '#FFD08A', 6.0),
    'hofwand': farbe('Hofmauer_hell', '#E9E3D6', 0.8, 0, 0.05),
}


def mesh(name, verts, faces, mat, c):
    me = bpy.data.meshes.new(name); me.from_pydata([tuple(v) for v in verts], [], faces); me.update()
    ob = bpy.data.objects.new(name, me); coll(c).objects.link(ob)
    for mm in (mat if isinstance(mat, (list, tuple)) else [mat]):
        me.materials.append(mm)
    return ob


def quader(name, x0, y0, z0, x1, y1, z1, mat, c):
    v = [(x0, y0, z0), (x1, y0, z0), (x1, y1, z0), (x0, y1, z0), (x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1)]
    f = [(0, 3, 2, 1), (4, 5, 6, 7), (0, 1, 5, 4), (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7)]
    return mesh(name, v, f, mat, c)


def viele_quader(name, liste, mat, c):
    """Viele Quader in einem Objekt (Pfosten, Stäbe, Module)."""
    v, f = [], []
    for (x0, y0, z0, x1, y1, z1) in liste:
        k = len(v)
        v += [(x0, y0, z0), (x1, y0, z0), (x1, y1, z0), (x0, y1, z0), (x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1)]
        f += [(k, k + 3, k + 2, k + 1), (k + 4, k + 5, k + 6, k + 7), (k, k + 1, k + 5, k + 4), (k + 1, k + 2, k + 6, k + 5),
              (k + 2, k + 3, k + 7, k + 6), (k + 3, k, k + 4, k + 7)]
    return mesh(name, v, f, mat, c)


def flaeche(name, pts, z, mat, c):
    return mesh(name, [(x, y, z) for x, y in pts], [tuple(range(len(pts)))], mat, c)


def zylinder(name, x, y, z0, r0, r1, h, mat, c, n=24):
    v, f = [], []
    for i in range(n):
        a = 2 * math.pi * i / n
        v += [(x + r0 * math.cos(a), y + r0 * math.sin(a), z0), (x + r1 * math.cos(a), y + r1 * math.sin(a), z0 + h)]
    for i in range(n):
        j = (i + 1) % n; f.append((2 * i, 2 * j, 2 * j + 1, 2 * i + 1))
    f.append(tuple(2 * i + 1 for i in range(n))); f.append(tuple(2 * i for i in reversed(range(n))))
    ob = mesh(name, v, f, mat, c)
    for p in ob.data.polygons:
        p.use_smooth = True
    return ob


def krone(name, x, y, z, r, mat, c, n=4):
    for i in range(n):
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=1, location=(0, 0, 0))
        ob = bpy.context.active_object; ob.name = f'{name}_{i}'
        dx, dy, dz = random.uniform(-r * 0.5, r * 0.5), random.uniform(-r * 0.5, r * 0.5), random.uniform(-r * 0.2, r * 0.3)
        s = r * random.uniform(0.55, 0.8)
        for v in ob.data.vertices:
            k = 1 + random.uniform(-0.2, 0.2)
            v.co = (x + dx + v.co.x * s * k, y + dy + v.co.y * s * k, z + dz + v.co.z * s * 0.75 * k)
        ob.data.materials.append(mat)
        for cc in ob.users_collection:
            cc.objects.unlink(ob)
        coll(c).objects.link(ob)


def spitzbogen(cx, breite, z0, h_gerade, n=10):
    """Umriss eines Spitzbogens (x, z) – Breite, gerade Höhe bis zum Kämpfer, dann zwei Kreisbögen (Radius = Breite)."""
    r = breite; x0, x1 = cx - breite / 2, cx + breite / 2; zk = z0 + h_gerade
    pts = [(x0, z0), (x1, z0), (x1, zk)]
    a_end = math.acos(0.5)
    for i in range(1, n + 1):          # rechter Bogen: Mittelpunkt links unten (x0, zk)
        a = a_end * i / n; pts.append((x0 + r * math.cos(a), zk + r * math.sin(a)))
    for i in range(n - 1, -1, -1):     # linker Bogen: Mittelpunkt (x1, zk)
        a = a_end * i / n; pts.append((x1 - r * math.cos(a), zk + r * math.sin(a)))
    return pts


# ------------------------------------------------------------------ S2: Keller (Ayman 20.11.: unter Moschee UND Hof, nicht unter den Parkplätzen) + Kellerdecke
KZ = -3.2
quader('Keller_Bodenplatte', -0.2, Y0 - 0.2, KZ - 0.3, BT + 0.2, TT, KZ, M['beton_roh'], 'S2_Keller')
for i, (x0, y0, x1, y1) in enumerate(((0, Y0, BT, Y0 + 0.3), (0, TT - 0.3, BT, TT), (0, Y0, 0.3, TT), (BT - 0.3, Y0, BT, TT),
                                      (0.3, Y1 - 0.3, BT - 0.3, Y1))):   # Wand4 = Innenwand unter der Moschee-Rückwand
    quader(f'Keller_Wand{i}', x0, y0, KZ, x1, y1, -0.3, M['beton_roh'], 'S2_Keller')
quader('Kellerdecke', 0, Y0, -0.3, BT, Y1, 0.15, M['beton_roh'], 'S2_Keller')
quader('Kellerdecke_Hof', 0, Y1, -0.3, BT, TT, 0.0, M['beton_roh'], 'S2_Keller')   # endet unter den Hofplatten (0,035)
# Keller-Innenausbau nach Aymans Beispielbild (20.11.): heller Estrich, Betonsäulen, 2 Treppen mit Metallgeländer, warme Wandleuchten
beton_k = farbe('Beton_Keller_hell', '#CFC9BE', 0.75, 0, 0.08)
estrich = farbe('Estrich_hell', '#C9C3B7', 0.45, 0, 0.05)
gel_k = farbe('Gelaender_Metall', '#9EA3A8', 0.35, 0.85, 0)
quader('Keller_Estrich', 0.3, Y0 + 0.3, KZ, BT - 0.3, TT - 0.3, KZ + 0.03, estrich, 'S2_Keller')
viele_quader('Keller_Saeulen', [(x - 0.25, y - 0.25, KZ + 0.03, x + 0.25, y + 0.25, -0.3)
                                for x in (4.2, 8.25, 12.3) for y in (7.2, 11.0, 19.0, 23.0)], beton_k, 'S2_Keller')


def schraeg(p0, p1, t):
    """Kantiger Stab von p0 nach p1 (für Handläufe entlang x)."""
    v = []
    for (x, y, z) in (p0, p1):
        v += [(x, y - t, z - t), (x, y + t, z - t), (x, y + t, z + t), (x, y - t, z + t)]
    return v


def treppe(name, x_oben, richtung, y0, y1):
    """Betontreppe vom Gelände (0) in den Keller (KZ), läuft entlang x; richtung = ±1 (Laufrichtung nach unten)."""
    stufen, n, auf, tritt = [], 16, -KZ / 16, 0.28
    for i in range(n):
        xa = x_oben + richtung * i * tritt; xb = xa + richtung * tritt
        stufen.append((min(xa, xb), y0, KZ, max(xa, xb), y1, -auf * (i + 1) + auf * 0 + (0 if i == 0 else 0)))
    viele_quader(name + '_Stufen', stufen, beton_k, 'S2_Keller')
    x_unten = x_oben + richtung * n * tritt
    v, f = [], []
    for yy in (y0 + 0.05, y1 - 0.05):                 # Handläufe beidseitig
        k = len(v); v += schraeg((x_oben, yy, 0.95), (x_unten, yy, KZ + 0.95), 0.025)
        f += [(k, k + 1, k + 2, k + 3), (k + 4, k + 7, k + 6, k + 5), (k, k + 4, k + 5, k + 1), (k + 1, k + 5, k + 6, k + 2),
              (k + 2, k + 6, k + 7, k + 3), (k + 3, k + 7, k + 4, k)]
    mesh(name + '_Handlauf', v, f, gel_k, 'S2_Keller')
    pf = []
    for yy in (y0 + 0.05, y1 - 0.05):                 # Pfosten
        for j in range(0, n + 1, 3):
            x = x_oben + richtung * j * tritt; zf = -auf * j
            pf.append((x - 0.025, yy - 0.025, zf, x + 0.025, yy + 0.025, zf + 0.95))
    viele_quader(name + '_Pfosten', pf, gel_k, 'S2_Keller')


treppe('Keller_TreppeA', BT - 0.6, -1, Y0 + 0.3, Y0 + 1.6)      # vorn rechts beim Portal, nach links hinunter
treppe('Keller_TreppeB', 0.6, 1, TT - 1.6, TT - 0.3)            # hinten links unter dem Hof, nach rechts hinunter
wl_k = []
for x in (2.2, 6.2, 10.3, 14.3):
    for y in (Y0 + 0.3, TT - 0.3):
        if not (y > Y1 and x < 6) and not (y < Y1 and x > 10):    # nicht hinter den Treppen
            d = 0.06 if y < Y1 else -0.06
            wl_k.append((x - 0.12, min(y, y + d), KZ + 1.9, x + 0.12, max(y, y + d), KZ + 2.15))
for y in (6.0, 10.0, 14.0, 18.0, 22.0, 26.0):
    wl_k.append((0.3, y - 0.12, KZ + 1.9, 0.36, y + 0.12, KZ + 2.15)); wl_k.append((BT - 0.36, y - 0.12, KZ + 1.9, BT - 0.3, y + 0.12, KZ + 2.15))
viele_quader('Keller_Wandleuchten', wl_k, M['wandleuchte'], 'S2_Keller')

# ------------------------------------------------------------------ S3: Erdgeschoss (Männer) 0 … 5,5
quader('EG_Wand_links_Qibla', 0, Y0, 0.15, 0.3, Y1, H_EG, M['putz'], 'S3_EG')
quader('EG_Wand_hinten', 0.3, Y1 - 0.3, 0.15, BT, Y1, H_EG, M['putz'], 'S3_EG')
quader('EG_Wand_rechts', BT - 0.3, Y0 + 0.6, 0.15, BT, Y1 - 0.3, H_EG, M['putz'], 'S3_EG')
quader('EG_Tuer_Hof', 7.0, Y1 + 0.001, 0.15, 9.2, Y1 + 0.03, 2.8, M['pfosten'], 'S3_EG')
# Glasfassade EG (x 0 … PORTAL_X), Pfosten alle ~1,5 m, Riegel bei 2,8 m
N_F = 9
fx = [i * PORTAL_X / N_F for i in range(N_F + 1)]
flaeche_v = lambda name, x0, x1, y, z0, z1, mat, c: mesh(name, [(x0, y, z0), (x1, y, z0), (x1, y, z1), (x0, y, z1)], [(0, 1, 2, 3)], mat, c)
flaeche_v('EG_Glas', 0.05, PORTAL_X, Y0 + 0.07, 0.15, H_EG, M['glas'], 'S3_EG')
pf = [(x - 0.05, Y0, 0.15, x + 0.05, Y0 + 0.16, H_EG) for x in fx[1:-1]] + [(0, Y0, 0.15, 0.12, Y0 + 0.16, H_EG)]
pf += [(0, Y0, z - 0.04, PORTAL_X, Y0 + 0.14, z + 0.04) for z in (0.2, 2.8)]
viele_quader('EG_Pfosten', pf, M['pfosten'], 'S3_EG')
# rechte Seite: drei hohe schmale Fenster
for i, y in enumerate((5.5, 9.0, 12.5)):
    quader(f'EG_Seitenfenster{i}', BT + 0.001, y - 0.45, 1.0, BT + 0.03, y + 0.45, 4.6, M['glas'], 'S3_EG')
    quader(f'EG_Seitenfenster{i}_Rahmen', BT, y - 0.55, 0.9, BT + 0.02, y + 0.55, 4.7, M['pfosten'], 'S3_EG')
# Portal: Rahmen aus hellem Naturstein, Spitzbogen-Glastür
PX0, PX1 = PORTAL_X, BT
quader('Portal_Pfeiler_links', PX0, Y0 - 0.6, 0.0, PX0 + 0.45, Y0 + 0.6, 9.6, M['stein'], 'S3_EG')
quader('Portal_Pfeiler_rechts', PX1 - 0.45, Y0 - 0.6, 0.0, PX1 + 0.03, Y0 + 0.6, 9.6, M['stein'], 'S3_EG')
quader('Portal_Sturz', PX0 + 0.45, Y0 - 0.55, 7.2, PX1 - 0.45, Y0 + 0.55, 9.6, M['stein'], 'S3_EG')   # zwischen den Pfeilern (keine deckungsgleichen Flächen)
bogen = spitzbogen((PX0 + PX1) / 2, PX1 - PX0 - 0.9, 0.15, 4.6)
# Stein-Fläche zwischen Bogen und Sturz (vorn) + Glas im Bogen
gl = [(x, Y0 - 0.35, z) for x, z in bogen]
mesh('Portal_Glastuer', gl, [tuple(range(len(gl)))], M['glas'], 'S3_EG')
top = max(z for _, z in bogen)
st_v = [(PX0 + 0.45, Y0 - 0.5, top - 0.0), (PX1 - 0.45, Y0 - 0.5, top), (PX1 - 0.45, Y0 - 0.5, 7.2), (PX0 + 0.45, Y0 - 0.5, 7.2)]
mesh('Portal_Feld_oben', st_v, [(0, 1, 2, 3)], M['stein'], 'S3_EG')
# Bogenzwickel links/rechts als Fächer
cxm = (PX0 + PX1) / 2
for seite, xs in (('l', PX0 + 0.45), ('r', PX1 - 0.45)):
    pts = [(x, z) for x, z in bogen[2:] if (x <= cxm + 1e-6 if seite == 'l' else x >= cxm - 1e-6)]
    pts.sort(key=lambda p: p[1])
    v = [(xs, Y0 - 0.5, pts[0][1]), (xs, Y0 - 0.5, top)] + [(x, Y0 - 0.5, z) for x, z in reversed(pts)]
    mesh(f'Portal_Zwickel_{seite}', v, [tuple(range(len(v)))], M['stein'], 'S3_EG')
viele_quader('Portal_Sprossen', [(cxm - 0.03, Y0 - 0.4, 0.15, cxm + 0.03, Y0 - 0.32, top - 0.05), (PX0 + 0.45, Y0 - 0.4, 2.6, PX1 - 0.45, Y0 - 0.32, 2.68)], M['gold'], 'S3_EG')
# Säulen EG
for i, (x, y) in enumerate(((5.5, 7.0), (11.0, 7.0), (5.5, 11.0), (11.0, 11.0))):
    zylinder(f'EG_Saeule{i}', x, y, 0.15, 0.28, 0.28, H_EG - 0.15, M['saeule'], 'S3_EG')

# ------------------------------------------------------------------ Innen (durch das Glas sichtbar)
flaeche('EG_Teppich', [(0.3, Y0 + 0.2), (BT - 0.3, Y0 + 0.2), (BT - 0.3, Y1 - 0.3), (0.3, Y1 - 0.3)], 0.17, M['teppich'], 'Innen')
mihrab = spitzbogen(0, 2.0, 0.17, 2.4)
v = [(0.31, Y0 + MT / 2 + x, z) for x, z in mihrab]
mesh('Mihrab_Nische', v, [tuple(range(len(v)))], M['mihrab'], 'Innen')
rahmen = spitzbogen(0, 2.6, 0.17, 2.6)
v = [(0.305, Y0 + MT / 2 + x, z) for x, z in rahmen]
mesh('Mihrab_Rahmen_Gold', v, [tuple(range(len(v)))], M['gold'], 'Innen')
# Minbar (Holztreppe, steigt zur Qibla-Wand)
st = []
for i in range(7):
    x0 = 0.6 + (6 - i) * 0.32
    st.append((x0, Y0 + MT / 2 + 1.6, 0.17, x0 + 0.32, Y0 + MT / 2 + 2.5, 0.17 + 0.3 * (i + 1)))
viele_quader('Minbar', st, M['holz'], 'Innen')
quader('Minbar_Kanzel', 0.4, Y0 + MT / 2 + 1.55, 0.17, 0.7, Y0 + MT / 2 + 2.55, 3.4, M['holz'], 'Innen')
# Deckenleuchten EG und OG (warm)
dl = []
for z in (H_EG - 0.02, H_OG - 0.02):
    for x in (3.0, 8.25, 13.5):
        for y in (5.5, 9.0, 12.5):
            dl.append((x - 0.6, y - 0.6, z - 0.04, x + 0.6, y + 0.6, z))
viele_quader('Deckenleuchten', dl, M['licht_innen'], 'Innen')
for i, z in enumerate((3.0, 7.5)):
    ld = bpy.data.lights.new(f'Innenlicht{i}', 'AREA'); ld.energy = 900; ld.shape = 'RECTANGLE'; ld.size = BT - 1.5; ld.size_y = MT - 1.5; ld.color = (1.0, 0.85, 0.65)
    lo = bpy.data.objects.new(f'Innenlicht{i}', ld); coll('Innen').objects.link(lo); lo.location = (BT / 2, (Y0 + Y1) / 2, z + (1.9 if i == 0 else 1.0))
    lo.visible_camera = False; lo.visible_glossy = False; lo.visible_transmission = False

# ------------------------------------------------------------------ S4: Geschossdecke + 1. Etage (Frauen)
quader('Geschossdecke', 0, Y0, H_EG, BT, Y1, H_DECKE, M['beton_roh'], 'S4_OG')
quader('Geschossband', -0.02, Y0 - 0.04, H_EG, PORTAL_X + 0.1, Y0 + 0.2, H_DECKE, M['band'], 'S4_OG')
quader('OG_Wand_links', 0, Y0, H_DECKE, 0.3, Y1, H_OG, M['putz'], 'S4_OG')
quader('OG_Wand_hinten', 0.3, Y1 - 0.3, H_DECKE, BT, Y1, H_OG, M['putz'], 'S4_OG')
quader('OG_Wand_rechts', BT - 0.3, Y0 + 0.6, H_DECKE, BT, Y1 - 0.3, H_OG, M['putz'], 'S4_OG')
flaeche_v('OG_Glas', 0.05, PORTAL_X, Y0 + 0.07, H_DECKE, H_OG, M['glas'], 'S4_OG')
pf = [(x - 0.05, Y0, H_DECKE, x + 0.05, Y0 + 0.16, H_OG) for x in fx[1:-1]] + [(0, Y0, H_DECKE, 0.12, Y0 + 0.16, H_OG)]
viele_quader('OG_Pfosten', pf, M['pfosten'], 'S4_OG')
for i, y in enumerate((5.5, 9.0, 12.5)):
    quader(f'OG_Seitenfenster{i}', BT + 0.001, y - 0.45, H_DECKE + 0.5, BT + 0.03, y + 0.45, H_OG - 0.4, M['glas'], 'S4_OG')
flaeche('OG_Teppich', [(0.3, Y0 + 0.2), (BT - 0.3, Y0 + 0.2), (BT - 0.3, Y1 - 0.3), (0.3, Y1 - 0.3)], H_DECKE + 0.01, M['teppich'], 'Innen')
for i, (x, y) in enumerate(((5.5, 7.0), (11.0, 7.0), (5.5, 11.0), (11.0, 11.0))):
    zylinder(f'OG_Saeule{i}', x, y, H_DECKE, 0.24, 0.24, H_OG - H_DECKE, M['saeule'], 'S4_OG')

# ------------------------------------------------------------------ S5: Dachplatte, Attika, Gründach, PV
quader('Dachplatte', 0, Y0, H_OG, BT, Y1, H_DACH, M['beton_roh'], 'S5_Dach')
for i, (x0, y0, x1, y1) in enumerate(((-0.015, Y0 - 0.05, BT + 0.015, Y0 + 0.3), (0, Y1 - 0.3, BT, Y1 + 0.01), (0, Y0 + 0.3, 0.3, Y1 - 0.3), (BT - 0.3, Y0 + 0.3, BT, Y1 - 0.3))):
    quader(f'Attika{i}', x0, y0, H_OG if i == 0 else H_DACH, x1, y1, H_ATTIKA, M['attika'], 'S5_Dach')
flaeche('Dachkies', [(0.3, Y0 + 0.3), (BT - 0.3, Y0 + 0.3), (BT - 0.3, Y1 - 0.3), (0.3, Y1 - 0.3)], H_DACH + 0.06, M['kies'], 'S5_Dach')
flaeche('Gruendach', [(0.8, Y0 + 0.8), (BT - 0.8, Y0 + 0.8), (BT - 0.8, Y1 - 0.8), (0.8, Y1 - 0.8)], H_DACH + 0.1, M['gruendach'], 'S5_Dach')
mods, gest = [], []
for i in range(10):
    x = 1.0 + i * (BT - 2.0) / 10 + 0.1
    for k in range(5):
        y0 = Y0 + 1.1 + k * 1.95
        mods.append((x, y0, H_DACH + 0.42, x + 1.0, y0 + 1.75, H_DACH + 0.46))
        gest += [(x + 0.1, y0 + 0.2, H_DACH + 0.1, x + 0.16, y0 + 0.26, H_DACH + 0.42), (x + 0.84, y0 + 1.5, H_DACH + 0.1, x + 0.9, y0 + 1.56, H_DACH + 0.42)]
viele_quader('PV_Module', mods, M['pv'], 'S5_Dach')
viele_quader('PV_Gestell', gest, M['pv_rahmen'], 'S5_Dach')

# ------------------------------------------------------------------ S6: Außenanlagen (Vorplatz, Hof, Parken, Wohnwagen, Zaun, Tor, Licht)
flaeche('Vorplatz', [(0, 0.25), (BT, 0.25), (BT, Y0), (0, Y0)], 0.035, M['vorplatz'], 'S6_Aussen')
# Hof (Ayman 19.11.: „besser bebauen wie in den Beispielen“): Plattenboden, Mauern mit Leuchten, durchgehende Pflanzbeete
# mit Büschen und Zypressen, Bodenstrahler, 2 Olivenbäume, 1 Palme, 2 Essplätze mit Sonnenschirm, Lounge-Ecke, Außenküche.
flaeche('Hof_Boden', [(0.25, Y1), (BT - 0.25, Y1), (BT - 0.25, TT), (0.25, TT)], 0.035, M['hofplatten'], 'S6_Aussen')
quader('Hofmauer_links', 0, Y1, 0, 0.25, TT, 3.2, M['hofwand'], 'S6_Aussen')
quader('Hofmauer_rechts', BT - 0.25, Y1, 0, BT, TT, 3.2, M['hofwand'], 'S6_Aussen')
viele_quader('Hofmauer_Abdeckung', [(-0.03, Y1, 3.2, 0.28, TT, 3.28), (BT - 0.28, Y1, 3.2, BT + 0.03, TT, 3.28)], M['band'], 'S6_Aussen')
wl = []
for y in (17.0, 19.6, 22.2, 24.8, 27.4):
    wl += [(0.25, y - 0.12, 2.4, 0.33, y + 0.12, 2.7), (BT - 0.33, y - 0.12, 2.4, BT - 0.25, y + 0.12, 2.7)]
viele_quader('Hof_Wandleuchten', wl, M['wandleuchte'], 'S6_Aussen')
BEET = [(0.25, Y1 + 0.6, 1.15, TT - 0.1), (BT - 1.15, Y1 + 0.6, BT - 0.25, TT - 0.1), (1.15, TT - 0.95, BT - 1.15, TT - 0.1)]
viele_quader('Hof_Pflanzbeete', [(x0, y0, 0, x1, y1, 0.5) for x0, y0, x1, y1 in BEET], M['kuebel'], 'S6_Aussen')
erde = farbe('Erde_Beet', '#4A3C2E', 0.95, 0, 0.2, 6)
viele_quader('Hof_Beeterde', [(x0 + 0.08, y0 + 0.08, 0.5, x1 - 0.08, y1 - 0.08, 0.52) for x0, y0, x1, y1 in BEET], erde, 'S6_Aussen')
k = 0
strahler = []
for x0, y0, x1, y1 in BEET:
    lang = max(x1 - x0, y1 - y0); n = int(lang / 1.25)
    for j in range(n):
        t = (j + 0.5) / n; px, py = x0 + (x1 - x0) * t if x1 - x0 > 1 else (x0 + x1) / 2, y0 + (y1 - y0) * t if y1 - y0 > 1 else (y0 + y1) / 2
        if j % 3 == 1:
            zylinder(f'Hof_Zypresse{k}', px, py, 0.5, 0.42, 0.03, 3.4, M['hecke'], 'S6_Aussen', 10)
        else:
            krone(f'Hof_Busch{k}', px, py, 0.95, 0.55, M['pflanzen'], 'S6_Aussen', 2)
        if j % 2 == 0:
            strahler.append((px - 0.1, py - 0.1, 0.52, px + 0.1, py + 0.1, 0.58))
        k += 1
viele_quader('Hof_Bodenstrahler', strahler, M['wandleuchte'], 'S6_Aussen')
# Olivenbäume (2) und Palme
for i, (tx, ty) in enumerate(((4.0, 17.6), (BT - 4.0, 17.6))):
    quader(f'Kuebel{i}', tx - 0.75, ty - 0.75, 0, tx + 0.75, ty + 0.75, 0.75, M['kuebel'], 'S6_Aussen')
    zylinder(f'Olive{i}_Stamm', tx, ty, 0.7, 0.13, 0.08, 1.7, M['stamm'], 'S6_Aussen', 8)
    krone(f'Olive{i}_Krone', tx, ty, 2.7, 1.4, M['oliven'], 'S6_Aussen', 5)
quader('Kuebel_Palme', BT / 2 - 0.6, 24.6, 0, BT / 2 + 0.6, 25.8, 0.7, M['kuebel'], 'S6_Aussen')
zylinder('Palme_Stamm', BT / 2, 25.2, 0.7, 0.16, 0.11, 3.2, M['stamm'], 'S6_Aussen', 10)
for j in range(9):
    a = j * 2 * math.pi / 9
    v = [(BT / 2, 25.2, 3.9), (BT / 2 + math.cos(a - 0.18) * 0.4, 25.2 + math.sin(a - 0.18) * 0.4, 4.05),
         (BT / 2 + math.cos(a) * 1.7, 25.2 + math.sin(a) * 1.7, 3.55), (BT / 2 + math.cos(a + 0.18) * 0.4, 25.2 + math.sin(a + 0.18) * 0.4, 4.05)]
    mesh(f'Palme_Blatt{j}', v, [(0, 1, 2, 3)], M['pflanzen'], 'S6_Aussen')
# zwei Essplätze mit 6 Stühlen und eckigem Sonnenschirm
stuhl, tisch = [], []
for i, (sx, sy) in enumerate(((4.4, 21.6), (BT - 4.4, 21.6))):
    tisch += [(sx - 0.5, sy - 1.0, 0.72, sx + 0.5, sy + 1.0, 0.77), (sx - 0.06, sy - 0.06, 0, sx + 0.06, sy + 0.06, 0.72)]
    for dx in (-0.85, 0.85):
        for dy in (-0.65, 0.0, 0.65):
            stuhl += [(sx + dx - 0.22, sy + dy - 0.22, 0.42, sx + dx + 0.22, sy + dy + 0.22, 0.47)]
            bx = sx + dx + (0.2 if dx > 0 else -0.24)
            stuhl += [(bx, sy + dy - 0.22, 0.47, bx + 0.04, sy + dy + 0.22, 0.95)]
            stuhl += [(sx + dx - 0.2, sy + dy - 0.2, 0, sx + dx - 0.16, sy + dy - 0.16, 0.42), (sx + dx + 0.16, sy + dy + 0.16, 0, sx + dx + 0.2, sy + dy + 0.2, 0.42)]
    zylinder(f'Schirm{i}_Stange', sx, sy, 0.77, 0.03, 0.03, 1.8, M['zaun'], 'S6_Aussen', 8)
    v = [(sx - 1.5, sy - 1.5, 2.2), (sx + 1.5, sy - 1.5, 2.2), (sx + 1.5, sy + 1.5, 2.2), (sx - 1.5, sy + 1.5, 2.2), (sx, sy, 2.65)]
    mesh(f'Schirm{i}', v, [(0, 1, 4), (1, 2, 4), (2, 3, 4), (3, 0, 4)], M['schirm'], 'S6_Aussen')
viele_quader('Tische', tisch, M['bank'], 'S6_Aussen')
viele_quader('Stuehle', stuhl, M['bank'], 'S6_Aussen')
# Lounge-Ecke hinten links (L-Sofa mit Kissen, Couchtisch)
polster = farbe('Polster_hell', '#E7E0D2', 0.9, 0, 0.03)
viele_quader('Lounge_Sofa_Gestell', [(1.4, 25.2, 0, 2.2, 27.8, 0.42), (2.2, 27.0, 0, 5.4, 27.8, 0.42)], M['zaun'], 'S6_Aussen')
viele_quader('Lounge_Sofa_Kissen', [(1.45, 25.25, 0.42, 2.15, 27.75, 0.58), (2.2, 27.05, 0.42, 5.35, 27.75, 0.58),
                                      (1.4, 25.2, 0.58, 1.65, 27.8, 0.95), (2.2, 27.55, 0.58, 5.4, 27.8, 0.95)], polster, 'S6_Aussen')
quader('Lounge_Tisch', 2.9, 25.5, 0, 4.3, 26.5, 0.38, M['bank'], 'S6_Aussen')
# Außenküche hinten rechts (Steintheke mit dunkler Platte, Grillhaube)
quader('Aussenkueche', BT - 5.4, TT - 1.75, 0, BT - 1.5, TT - 1.05, 0.9, M['stein'], 'S6_Aussen')
quader('Aussenkueche_Platte', BT - 5.45, TT - 1.8, 0.9, BT - 1.45, TT - 1.0, 0.95, M['pfosten'], 'S6_Aussen')
quader('Aussenkueche_Grill', BT - 3.0, TT - 1.6, 0.95, BT - 2.1, TT - 1.15, 1.35, M['pv_rahmen'], 'S6_Aussen')
# Parken: 4 schräge Plätze, leer
flaeche('Parken_Belag', [(BT, 0.25), (PK, 0.25), (PK, LT), (BT, LT)], 0.03, M['asphalt'], 'S6_Aussen')
mk = []
for i in range(5):
    y = 1.5 + i * 2.5; d = Vector((4.5, 2.2, 0)).normalized()
    p0 = Vector((BT + 0.3, y, 0.04)); p1 = p0 + d * 5.0; nrm = Vector((-d.y, d.x, 0)) * 0.06
    mk.append([p0 - nrm, p1 - nrm, p1 + nrm, p0 + nrm])
# Wohnwagen: 7 Plätze à 3,5 × 7,5 m, leer; Hecke + Wandleuchten an der Brandwand
flaeche('Wohnwagen_Belag', [(PK, 0.25), (L, 0.25), (L, LT), (PK, LT)], 0.03, M['asphalt'], 'S6_Aussen')
WB = (L - PK) / 7
for i in range(8):
    x = PK + i * WB
    mk.append([Vector((x - 0.06, LT - 7.5, 0.04)), Vector((x + 0.06, LT - 7.5, 0.04)), Vector((x + 0.06, LT - 0.8, 0.04)), Vector((x - 0.06, LT - 0.8, 0.04))])
mk.append([Vector((PK, LT - 7.56, 0.04)), Vector((L, LT - 7.56, 0.04)), Vector((L, LT - 7.44, 0.04)), Vector((PK, LT - 7.44, 0.04))])
mesh('Markierungen', [p for q in mk for p in q], [tuple(range(4 * i, 4 * i + 4)) for i in range(len(mk))], M['markierung'], 'S6_Aussen')
quader('Hecke', BT + 0.3, LT - 0.75, 0, L, LT, 1.3, M['hecke'], 'S6_Aussen')
viele_quader('Wandleuchten_Brandwand', [(PK + (i + 0.5) * WB - 0.15, LT + 0.22, 2.4, PK + (i + 0.5) * WB + 0.15, LT + 0.3, 2.75) for i in range(7)],
             M['wandleuchte'], 'S6_Aussen')
# Zaun (Stabgitter, fest) + freitragendes Schiebetor
H_Z = 1.9
z = [(x - 0.04, 0.32, 0, x + 0.04, 0.4, H_Z + 0.05) for x in [PK + k * (TOR - PK) / 7 for k in range(8)]]
z += [(PK, 0.34, zz, TOR, 0.38, zz + 0.05) for zz in (0.12, H_Z - 0.1)]
z += [(x - 0.012, 0.345, 0.12, x + 0.012, 0.375, H_Z - 0.05) for x in [PK + 0.1 + k * 0.12 for k in range(int((TOR - PK - 0.2) / 0.12))]]
viele_quader('Zaun_fest', z, M['zaun'], 'S6_Aussen')
t = [(TOR - 2.6, 0.62, zz, L, 0.68, zz + 0.07) for zz in (0.08, H_Z - 0.12)]
t += [(x - 0.012, 0.635, 0.12, x + 0.012, 0.665, H_Z - 0.08) for x in [TOR + 0.08 + k * 0.12 for k in range(int((L - TOR - 0.1) / 0.12))]]
t += [(x - 0.04, 0.6, 0.08, x + 0.04, 0.7, H_Z - 0.05) for x in (TOR - 2.6, TOR, L - 0.05)]
t += [(TOR - 2.6 + k * 0.65, 0.63, 0.15, TOR - 2.6 + k * 0.65 + 0.05, 0.67, H_Z - 0.15) for k in range(4)]     # Gegengewicht-Teil
tor = viele_quader('Schiebetor', t, M['zaun'], 'S6_Aussen')
tor['offen'] = 0.0
fc = tor.driver_add('location', 0); dv = fc.driver; dv.type = 'SCRIPTED'
var = dv.variables.new(); var.name = 'offen'; var.targets[0].id = tor; var.targets[0].data_path = '["offen"]'
dv.expression = '-6.0 * offen'
viele_quader('Schiebetor_Fuehrung', [(L - 0.15, 0.5, 0, L + 0.1, 0.85, H_Z + 0.1), (TOR - 3.0, 0.75, 0, TOR - 0.4, 1.05, 0.25)], M['zaun'], 'S6_Aussen')

# ------------------------------------------------------------------ Details (Ayman 19.11.: „viel zu wenig Details“)
granit = farbe('Granit_Sockel', '#3A3C40', 0.4, 0, 0.08, 6)
# Fassade: dunkler Sockel, außen liegende Lisenen vor den Pfosten, LED-Linie unter dem Geschossband und unter der Attika
viele_quader('Fassade_Sockel', [(0.0, Y0 - 0.06, 0.0, PORTAL_X, Y0 + 0.02, 0.38)], granit, 'S3_EG')
viele_quader('Fassade_Lisenen_EG', [(x - 0.035, Y0 - 0.2, 0.38, x + 0.035, Y0 + 0.0, H_EG) for x in fx[1:-1]], M['pfosten'], 'S3_EG')
viele_quader('Fassade_Lisenen_OG', [(x - 0.035, Y0 - 0.2, H_DECKE, x + 0.035, Y0 + 0.0, H_OG) for x in fx[1:-1]], M['pfosten'], 'S4_OG')
viele_quader('LED_Geschossband', [(0.0, Y0 - 0.07, H_EG - 0.04, PORTAL_X, Y0 - 0.03, H_EG + 0.0)], M['wandleuchte'], 'S4_OG')
viele_quader('Attika_Abdeckung', [(-0.05, Y0 - 0.1, H_ATTIKA - 0.01, BT + 0.05, Y0 + 0.35, H_ATTIKA + 0.07), (-0.05, Y1 - 0.35, H_ATTIKA - 0.01, BT + 0.05, Y1 + 0.05, H_ATTIKA + 0.07),
                                    (-0.05, Y0 + 0.35, H_ATTIKA - 0.01, 0.35, Y1 - 0.35, H_ATTIKA + 0.07), (BT - 0.35, Y0 + 0.35, H_ATTIKA - 0.01, BT + 0.05, Y1 - 0.35, H_ATTIKA + 0.07)], M['pv_rahmen'], 'S5_Dach')
viele_quader('LED_Attika', [(0.0, Y0 - 0.08, H_OG - 0.02, PORTAL_X, Y0 - 0.04, H_OG + 0.02)], M['wandleuchte'], 'S5_Dach')
# Portal: Goldkante um den Spitzbogen, zwei Laternen, zwei Stufen, Zypressen in Pflanzkübeln links und rechts
gv, gf = [], []
w = 0.09
for i in range(1, len(bogen) - 1):
    (xa, za), (xb, zb) = bogen[i], bogen[i + 1]
    dx, dz = xb - xa, zb - za; ln = math.hypot(dx, dz) or 1; nx, nz = dz / ln, -dx / ln
    k0 = len(gv)
    gv += [(xa, Y0 - 0.52, za), (xb, Y0 - 0.52, zb), (xb + nx * w, Y0 - 0.52, zb + nz * w), (xa + nx * w, Y0 - 0.52, za + nz * w)]
    gf.append((k0, k0 + 1, k0 + 2, k0 + 3))
mesh('Portal_Goldkante', gv, gf, M['gold'], 'S3_EG')
viele_quader('Portal_Laternen_Gehaeuse', [(x - 0.16, Y0 - 0.72, 2.45, x + 0.16, Y0 - 0.6, 3.15) for x in (PX0 + 0.22, PX1 - 0.22)], M['pfosten'], 'S3_EG')
viele_quader('Portal_Laternen_Licht', [(x - 0.11, Y0 - 0.74, 2.52, x + 0.11, Y0 - 0.71, 3.08) for x in (PX0 + 0.22, PX1 - 0.22)], M['wandleuchte'], 'S3_EG')
viele_quader('Portal_Stufen', [(PX0 + 0.3, Y0 - 1.25, 0.0, PX1 - 0.3, Y0 - 0.6, 0.08), (PX0 + 0.4, Y0 - 0.95, 0.0, PX1 - 0.4, Y0 - 0.6, 0.15)], M['stein'], 'S6_Aussen')
for i, x in enumerate((PX0 - 0.55, PX1 + 0.55)):
    quader(f'Portal_Kuebel{i}', x - 0.35, Y0 - 1.1, 0, x + 0.35, Y0 - 0.4, 0.6, granit, 'S6_Aussen')
    zylinder(f'Portal_Zypresse{i}', x, Y0 - 0.75, 0.6, 0.32, 0.02, 2.6, M['hecke'], 'S6_Aussen', 10)
# rechte Seite mit Natursteinplatten statt Putz
for n in ('EG_Wand_rechts', 'OG_Wand_rechts'):
    bpy.data.objects[n].data.materials[0] = M['stein']
# Rückseite zum Hof: Fenster, Vordach über der Hoftür
fen = []
for x in (2.2, 4.6, 11.9, 14.3):
    fen.append((x - 0.6, Y1 + 0.005, 1.2, x + 0.6, Y1 + 0.02, 4.4))
for x in (2.2, 5.0, 8.25, 11.5, 14.3):
    fen.append((x - 0.6, Y1 + 0.005, H_DECKE + 0.6, x + 0.6, Y1 + 0.02, H_OG - 0.5))
viele_quader('Rueckseite_Fenster', fen, M['glas'], 'S4_OG')
viele_quader('Rueckseite_Fensterrahmen', [(a - 0.07, b + 0.0, c - 0.07, d + 0.07, e - 0.008, f + 0.07) for a, b, c, d, e, f in fen], M['pfosten'], 'S4_OG')
quader('Hoftuer_Vordach', 6.6, Y1, 2.95, 9.6, Y1 + 1.3, 3.1, M['pv_rahmen'], 'S6_Aussen')
# Innen: Hängeleuchten (Ringe), Quran-Regal an der Rückwand
for i, (x, y) in enumerate(((5.5, 9.0), (11.0, 9.0))):
    zylinder(f'Innen_Ringleuchte{i}', x, y, 4.2, 1.1, 1.1, 0.08, M['licht_innen'], 'Innen', 32)
    zylinder(f'Innen_Ringleuchte{i}_Seil', x, y, 4.28, 0.01, 0.01, H_EG - 4.3, M['zaun'], 'Innen', 6)
viele_quader('Innen_Regal', [(3.0, Y1 - 0.65, 0.17, 13.0, Y1 - 0.31, 1.9)], M['holz'], 'Innen')
viele_quader('Innen_Regal_Buecher', [(3.1 + j * 0.5, Y1 - 0.68, 0.3 + r * 0.55, 3.5 + j * 0.5, Y1 - 0.64, 0.6 + r * 0.55) for j in range(19) for r in range(3)], M['gold'], 'Innen')
# Dach: Ausstieg, zwei Lüftungsgeräte
viele_quader('Dach_Technik', [(BT - 2.2, Y1 - 1.6, H_DACH, BT - 1.0, Y1 - 0.5, H_DACH + 0.7), (1.0, Y1 - 1.4, H_DACH, 2.1, Y1 - 0.6, H_DACH + 0.9),
                               (3.0, Y1 - 1.4, H_DACH, 4.1, Y1 - 0.6, H_DACH + 0.9)], M['pv_rahmen'], 'S5_Dach')

# ------------------------------------------------------------------ Wohnwagen (Ayman 19.11.: „wie im Beispiel“) – 7 Stück, Deichsel zur Gasse
weiss = farbe('Wohnwagen_weiss', '#F1F1EC', 0.35, 0, 0.02)
grau = farbe('Wohnwagen_Streifen', '#9AA0A6', 0.5, 0, 0)
dunkel = farbe('Wohnwagen_Fenster', '#1F252B', 0.15, 0.2, 0)
reifen = farbe('Reifen', '#161616', 0.8, 0, 0)
for i in range(7):
    cx = PK + (i + 0.5) * WB
    y0, y1 = LT - 7.0, LT - 1.0
    kor = quader(f'Wohnwagen{i}_Aufbau', cx - 1.15, y0, 0.45, cx + 1.15, y1, 2.75, weiss, 'Wohnwagen')
    bev = kor.modifiers.new('Rundung', 'BEVEL'); bev.width = 0.22; bev.segments = 4
    viele_quader(f'Wohnwagen{i}_Fenster', [(cx - 1.17, y0 + 0.8, 1.65, cx - 1.14, y1 - 1.6, 2.1), (cx + 1.14, y0 + 0.8, 1.65, cx + 1.17, y1 - 1.6, 2.1),
                                            (cx - 0.95, y0 - 0.03, 1.75, cx + 0.95, y0 + 0.02, 2.2)], dunkel, 'Wohnwagen')
    viele_quader(f'Wohnwagen{i}_Streifen', [(cx - 1.17, y0 + 0.3, 1.0, cx - 1.15, y1 - 0.3, 1.12), (cx + 1.15, y0 + 0.3, 1.0, cx + 1.17, y1 - 0.3, 1.12),
                                             (cx + 1.14, y1 - 1.3, 0.7, cx + 1.17, y1 - 0.5, 2.3)], grau, 'Wohnwagen')
    viele_quader(f'Wohnwagen{i}_Dach', [(cx - 0.4, y0 + 1.5, 2.75, cx + 0.4, y0 + 2.3, 2.92), (cx - 0.35, y1 - 2.2, 2.75, cx + 0.35, y1 - 1.5, 2.88)], grau, 'Wohnwagen')
    viele_quader(f'Wohnwagen{i}_Deichsel', [(cx - 0.75, y0 - 0.9, 0.42, cx - 0.65, y0 + 0.1, 0.5), (cx + 0.65, y0 - 0.9, 0.42, cx + 0.75, y0 + 0.1, 0.5),
                                             (cx - 0.75, y0 - 1.05, 0.42, cx + 0.75, y0 - 0.9, 0.5), (cx - 0.05, y0 - 1.0, 0.05, cx + 0.05, y0 - 0.9, 0.42)], M['zaun'], 'Wohnwagen')
    for j, sx in enumerate((-1.2, 1.2)):
        rad = zylinder(f'Wohnwagen{i}_Rad{j}', 0, 0, -0.12, 0.34, 0.34, 0.24, reifen, 'Wohnwagen', 20)
        for v in rad.data.vertices:
            v.co = Vector((cx + sx + v.co.z, (y0 + y1) / 2 + v.co.x, 0.34 + v.co.y))
# Parken: Radstopper; Zaun: Steinpfeiler; Schiebetor: Antrieb, Laufrollen, Warnleuchte
stopper = []
for i in range(4):
    y = 1.5 + i * 2.5 + 1.25; d = Vector((4.5, 2.2, 0)).normalized()
    p = Vector((BT + 0.3, y, 0)) + d * 4.3
    stopper.append((p.x - 0.4, p.y - 0.4, 0.03, p.x + 0.4, p.y + 0.4, 0.13))
viele_quader('Parken_Radstopper', stopper, granit, 'S6_Aussen')
viele_quader('Zaun_Steinpfeiler', [(x - 0.22, 0.26, 0, x + 0.22, 0.5, 2.15) for x in (PK + 0.22, PK + (TOR - PK) / 3, PK + 2 * (TOR - PK) / 3, TOR - 0.22, L - 0.22)], M['stein'], 'S6_Aussen')
viele_quader('Schiebetor_Antrieb', [(TOR - 1.3, 0.85, 0, TOR - 0.8, 1.2, 0.55)], M['pv_rahmen'], 'S6_Aussen')
viele_quader('Schiebetor_Warnleuchte', [(L - 0.3, 0.3, 2.15, L - 0.12, 0.48, 2.35)], leuchte('Warnleuchte_orange', '#FF9A2E', 3.0), 'S6_Aussen')
viele_quader('Schiebetor_Laufrollen', [(x - 0.12, 0.6, 0, x + 0.12, 0.72, 0.18) for x in (TOR - 2.4, TOR - 0.9)], M['zaun'], 'S6_Aussen')

# ------------------------------------------------------------------ Innen für die Schlussansicht von oben (Ayman 20.11.: Blick wie im Beispielbild)
# Zimmerpflanzen, senkrechte Lichtleisten, Ornamentfelder neben dem Mihrab, Schuhregale am Eingang, kleiner Waschraum hinten rechts.
for i, (x, y) in enumerate(((0.8, 4.0), (0.8, Y1 - 0.9), (BT - 0.9, Y1 - 0.9), (6.0, Y1 - 0.9), (10.5, Y1 - 0.9))):
    quader(f'Innen2_Topf{i}', x - 0.25, y - 0.25, 0.17, x + 0.25, y + 0.25, 0.65, M['kuebel'], 'Innen')
    krone(f'Innen2_Pflanze{i}', x, y, 1.15, 0.45, M['pflanzen'], 'Innen', 2)
viele_quader('Innen2_Lichtleisten', [(0.31, y - 0.05, 0.6, 0.36, y + 0.05, H_EG - 0.6) for y in (5.0, 7.0, 11.0, 13.0)]
             + [(x - 0.05, Y1 - 0.36, 0.6, x + 0.05, Y1 - 0.31, H_EG - 0.6) for x in (2.0, 14.5)], M['wandleuchte'], 'Innen')
orn = []
for yc in (Y0 + MT / 2 - 2.6, Y0 + MT / 2 + 2.6):
    orn += [(0.31, yc - 0.7, 1.6, 0.34, yc + 0.7, 3.4)]
viele_quader('Innen2_Ornamentfeld', orn, M['mihrab'], 'Innen')
viele_quader('Innen2_Ornamentrahmen', [(0.33, a - 0.03, b - 0.03, 0.36, c + 0.03, d + 0.03) for (_, a, b, _, c, d) in orn]
             + [(0.345, (a + c) / 2 - 0.02, b, 0.36, (a + c) / 2 + 0.02, d) for (_, a, b, _, c, d) in orn]
             + [(0.345, a, (b + d) / 2 - 0.02, 0.36, c, (b + d) / 2 + 0.02) for (_, a, b, _, c, d) in orn], M['gold'], 'Innen')
# Schuhregale links und rechts innen neben dem Portal
viele_quader('Innen2_Schuhregal', [(PORTAL_X - 2.6, Y0 + 0.35, 0.17, PORTAL_X - 0.4, Y0 + 0.75, 1.2),
                                    (PORTAL_X + 0.3, Y0 + 2.4, 0.17, PORTAL_X + 0.7, Y0 + 4.6, 1.2)], M['holz'], 'Innen')
# Waschraum hinten rechts (Trennwände, Waschbecken-Theke)
viele_quader('Innen2_Waschraum_Wand', [(BT - 3.6, Y1 - 3.0, 0.17, BT - 3.45, Y1 - 0.3, 2.6), (BT - 3.6, Y1 - 3.0, 0.17, BT - 0.3, Y1 - 2.85, 2.6)], M['putz'], 'Innen')
viele_quader('Innen2_Waschraum_Theke', [(BT - 3.3, Y1 - 0.85, 0.17, BT - 0.4, Y1 - 0.35, 0.85)], M['stein'], 'Innen')
fl = farbe('Fliesen_Waschraum', '#CFCBC2', 0.4, 0, 0.03)
flaeche('Innen2_Waschraum_Boden', [(BT - 3.45, Y1 - 2.85), (BT - 0.3, Y1 - 2.85), (BT - 0.3, Y1 - 0.3), (BT - 3.45, Y1 - 0.3)], 0.18, fl, 'Innen')

# Abschluss
for o in bpy.data.objects:
    if o.type == 'MESH' and any(o.name.startswith(p) for p in ('EG_Saeule', 'OG_Saeule', 'Olive', 'Tisch', 'Schirm')):
        for p in o.data.polygons:
            p.use_smooth = True
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(HERE, 'neubau.blend'), relative_remap=True)
print('gespeichert mit Moschee:', len(bpy.data.objects), 'Objekte')
