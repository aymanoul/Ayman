#!/usr/bin/env python3
"""Phase 3: Moschee im Endzustand + Keller, Hof, Parken, Wohnwagen-Stellplätze, 3 Schiebeflügel über die ganze Breite.
Öffnet blender/neubau.blend (aus umgebung.py) und speichert dorthin zurück.

    .venv-blender/bin/python blender/umgebung.py && .venv-blender/bin/python blender/moschee.py

Maße wie im freigegebenen Lageplan (Phase 1). Höhen: Keller −3,2…0, EG 0…5,5 (Männer), Geschossdecke 5,5…5,95,
OG 5,95…8,7 (Frauen, 2,75 m), Dachplatte 8,7…9,2, Attika bis 10,0 m.
Sammlungen je Baustufe (für den Zeitraffer in Phase 4): S1_Aushub (folgt), S2_Keller, S3_EG, S4_OG, S5_Dach, S6_Aussen, Innen.
Qibla von Ratingen ≈ 127° → im Modell Richtung −X (linke Wand zu den Altbauten): dort Mihrab und Minbar, Gebetsreihen parallel dazu.
Keine Menschen. Wohnwagen + 4 Autos (blender/autos.py, wird am Ende ausgeführt; Ayman 23.11.). Schiebetor geschlossen
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

L, BT, TT, LT = 50.0, 20.0, 29.0, 12.3      # Ayman/Chef 23.11.: Moschee 20 m statt 16,5 m, Parken + Wohnwagen 30 m
X = lambda v: v * BT / 16.5                  # Innenpositionen, ursprünglich für 16,5 m geplant
VOR, MT = 0.3, 12.0                      # Ayman 23.11.: Front bündig mit den Nachbarhäusern (kein Vorplatz)
Y0, Y1 = VOR, VOR + MT                  # Moschee: y 0,3 … 12,3
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
    """Roter Gebetsteppich (Ayman 23.11., Vorlage assets/moschee_teppich_vorlage_ayman.png): kräftiges Rot mit samtigem,
    fleckigem Flor, beige Reihenstreifen parallel zur Qibla-Wand (x = 0) alle 1,2 m."""
    m, nt, b = node_mat(name)
    tc = nt.nodes.new('ShaderNodeTexCoord'); wv = nt.nodes.new('ShaderNodeTexWave')
    wv.bands_direction = 'X'; wv.wave_profile = 'SAW'; wv.inputs['Scale'].default_value = 2 * math.pi / (20 * 1.2)   # Periode 1,2 m
    nt.links.new(tc.outputs['Object'], wv.inputs['Vector'])
    nz = nt.nodes.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 3.5; nz.inputs['Detail'].default_value = 6
    nt.links.new(tc.outputs['Object'], nz.inputs['Vector'])
    flor = nt.nodes.new('ShaderNodeValToRGB')                       # samtiger Flor: dunkle und helle Rot-Flecken
    flor.color_ramp.elements[0].position = 0.35; flor.color_ramp.elements[0].color = hexrgb('#7C1119')
    flor.color_ramp.elements[1].position = 0.65; flor.color_ramp.elements[1].color = hexrgb('#A81F27')
    nt.links.new(nz.outputs['Fac'], flor.inputs['Fac'])
    streif = nt.nodes.new('ShaderNodeValToRGB'); streif.color_ramp.interpolation = 'CONSTANT'
    streif.color_ramp.elements[0].position = 0.0; streif.color_ramp.elements[0].color = (1, 1, 1, 1)
    streif.color_ramp.elements[1].position = 0.11; streif.color_ramp.elements[1].color = (0, 0, 0, 1)
    nt.links.new(wv.outputs['Fac'], streif.inputs['Fac'])
    mix = nt.nodes.new('ShaderNodeMix'); mix.data_type = 'RGBA'
    nt.links.new(streif.outputs['Color'], mix.inputs['Factor']); nt.links.new(flor.outputs['Color'], mix.inputs['A'])
    mix.inputs['B'].default_value = hexrgb('#CDBD98')               # beige Reihenstreifen
    nt.links.new(mix.outputs['Result'], b.inputs['Base Color']); b.inputs['Roughness'].default_value = 0.9
    b.inputs['Sheen Weight'].default_value = 0.6; b.inputs['Sheen Roughness'].default_value = 0.4
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
    'teppich': teppich('Gebetsteppich_rot'),
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

# Fototexturen (Ayman 23.11.: detailreicher) – freie Poly-Haven-Texturen, siehe ph_texturen.py
import sys
sys.path.insert(0, HERE)
from ph_texturen import ph
M.update({
    'stein': ph('PH_Naturstein_Moschee', 'large_sandstone_blocks', 3.2, 0, '#E6CFA2', 1.0, 0.0, 0.35, detail=0.3),
    'putz': ph('PH_Putz_Moschee', 'plastered_wall_02', 3.5, 0, '#EEE9DF', 1.0, 0.0, 0.1),
    'hofwand': ph('PH_Hofmauer', 'plastered_wall_02', 3.5, 0, '#E9E3D6', 1.0, 0.0, 0.1),
    'asphalt': ph('PH_Asphalt_neu', 'asphalt_02', 4.0, 0, '#3E3F42', 1.0, 0.0, 0.25),
    'kies': ph('PH_Dachkies', 'gravel_floor', 1.5, 0, None, 0, 0.05, 0.4),
    'gruendach': ph('PH_Gruendach', 'leafy_grass', 2.5, 0, '#5D7A3A', 1.0, 0.0, 0.3),
    'hecke': ph('PH_Hecke', 'forest_leaves_02', 1.5, 0, '#3D5C2F', 1.0, 0.0, 0.6),
    'hofplatten': ph('PH_Hofplatten', 'concrete_tiles', 2.4, 0, '#DCD3C2', 1.0, 0.0, 0.2),
    'vorplatz': ph('PH_Gehweg', 'concrete_pavers_02', 2.0, 0, '#D8D1C3', 1.0, 0.0, 0.2),
})

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


def rundbogen(cx, breite, z0, h_gerade, n=24):
    """Umriss eines Rundbogens (x, z) im selben Format wie spitzbogen: unten links, unten rechts, Kämpfer rechts, Bogen bis Kämpfer links."""
    r = breite / 2; x0, x1 = cx - r, cx + r; zk = z0 + h_gerade
    return [(x0, z0), (x1, z0), (x1, zk)] + [(cx + r * math.cos(math.pi * i / n), zk + r * math.sin(math.pi * i / n)) for i in range(1, n + 1)]


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
for i, (x0, y0, x1, y1) in enumerate(((0, Y0, BT, Y0 + 0.3), (0, TT - 0.3, BT, TT), (0, Y0 + 0.3, 0.3, TT - 0.3), (BT - 0.3, Y0 + 0.3, BT, TT - 0.3))):
    # Ayman 20.11.: EIN durchgehender Keller unter Moschee und Hof, keine Trennwand
    quader(f'Keller_Wand{i}', x0, y0, KZ, x1, y1, -0.3, M['beton_roh'], 'S2_Keller')
quader('Kellerdecke', 0, Y0, -0.3, BT, Y1, 0.15, M['beton_roh'], 'S2_Keller')
quader('Kellerdecke_Hof', 0, Y1, -0.3, BT, TT, 0.0, M['beton_roh'], 'S2_Keller')   # endet unter den Hofplatten (0,035)
# Keller-Innenausbau nach Aymans Beispielbild (20.11.): heller Estrich, Betonsäulen, 2 Treppen mit Metallgeländer, warme Wandleuchten
beton_k = farbe('Beton_Keller_hell', '#CFC9BE', 0.75, 0, 0.08)
estrich = farbe('Estrich_hell', '#C9C3B7', 0.45, 0, 0.05)
gel_k = farbe('Gelaender_Metall', '#9EA3A8', 0.35, 0.85, 0)
quader('Keller_Estrich', 0.3, Y0 + 0.3, KZ, BT - 0.3, TT - 0.3, KZ + 0.03, estrich, 'S2_Keller')
# Stützenraster nach Architekt (Ayman 23.11.): je Raum (unter Moschee / unter Hof) 3×3 = 9 Stützen. Die mittlere bleibt
# frei in der Mitte, alle übrigen sitzen in den Außenwänden (bündig, nur 5 cm Lisene sichtbar) → der Saal bleibt frei.
# An der Grenze Moschee/Hof (y = Y1) gibt es keine Wand: dort steht die mittlere Stütze frei (trägt Unterzüge).
K_XS = (0.0, BT / 2, BT)
K_YS = (Y0, (Y0 + Y1) / 2, Y1, (Y1 + TT) / 2, TT)
K_FREI = [(BT / 2, (Y0 + Y1) / 2), (BT / 2, Y1), (BT / 2, (Y1 + TT) / 2)]
_ks, _kw = [], []
for x in K_XS:
    for y in K_YS:
        if (x, y) in K_FREI:
            _ks.append((x - 0.25, y - 0.25, KZ + 0.03, x + 0.25, y + 0.25, -0.5))   # endet im Unterzug
            continue
        # Wandstütze: in der Wand (0,3 m), 5 cm Lisene nach innen, 0,5 m breit entlang der Wand
        xa = 0.03 if x == 0 else (BT - 0.35 if x == BT else x - 0.25)          # 3 cm hinter der Außenfläche (keine
        xb = 0.35 if x == 0 else (BT - 0.03 if x == BT else x + 0.25)          # deckungsgleichen Flächen mit der Wand)
        ya = Y0 + 0.03 if y == Y0 else (TT - 0.35 if y == TT else y - 0.25)
        yb = Y0 + 0.35 if y == Y0 else (TT - 0.03 if y == TT else y + 0.25)
        _kw.append((xa, ya, KZ + 0.03, xb, yb, -0.32))
viele_quader('Keller_Saeulen', _ks, beton_k, 'S2_Keller')
viele_quader('Keller_Wandstuetzen', _kw, beton_k, 'S2_Keller')
# Unterzüge unter der Decke entlang der Rasterlinien (wie im Architektenbild), 0,4 breit, 0,45 tief
_uz = [(BT / 2 - 0.2, Y0 + 0.3, -0.75, BT / 2 + 0.2, TT - 0.3, -0.3)]
_uz += [(0.3, y - 0.2, -0.74, BT - 0.3, y + 0.2, -0.31) for y in K_YS[1:4]]     # 1 cm versetzt: keine deckungsgleichen Flächen
viele_quader('Keller_Unterzuege', _uz, beton_k, 'S2_Keller')


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
for x in (X(2.2), X(6.2), X(10.3), X(14.3)):
    for y in (Y0 + 0.3, TT - 0.3):
        if not (y > Y1 and x < X(6)) and not (y < Y1 and x > X(10)):    # nicht hinter den Treppen
            d = 0.06 if y < Y1 else -0.06
            wl_k.append((x - 0.12, min(y, y + d), KZ + 1.9, x + 0.12, max(y, y + d), KZ + 2.15))
for y in (3.3, 9.3, 16.5, 24.8):            # zwischen den Wandstützen
    wl_k.append((0.3, y - 0.12, KZ + 1.9, 0.36, y + 0.12, KZ + 2.15)); wl_k.append((BT - 0.36, y - 0.12, KZ + 1.9, BT - 0.3, y + 0.12, KZ + 2.15))
viele_quader('Keller_Wandleuchten', wl_k, M['wandleuchte'], 'S2_Keller')

# ------------------------------------------------------------------ S3: Erdgeschoss (Männer) 0 … 5,5
quader('EG_Wand_links_Qibla', 0, Y0, 0.15, 0.3, Y1, H_EG, M['putz'], 'S3_EG')
# Rückwand zum Hof (Ayman 20.11.): ganz aus Glas, große Hebe-Schiebetüren – zwei Felder offen, Blick vom Hof in den Gebetsraum
quader('EG_Wand_hinten_Ecke', BT - 0.3, Y1 - 0.3, 0.15, BT, Y1, H_EG, M['putz'], 'S3_EG')
quader('EG_Wand_hinten_Sturz', 0.3, Y1 - 0.3, H_EG - 0.35, BT - 0.3, Y1, H_EG, M['putz'], 'S3_EG')
_nb = 6; _w = (BT - 0.6) / _nb; _gx = [0.3 + k * _w for k in range(_nb + 1)]
_gl = []
for k in range(_nb):
    if k in (1, 4):                      # diese Felder sind aufgeschoben (liegen hinter dem Nachbarfeld)
        a = _gx[k - 1] if k == 1 else _gx[k + 1]; yy = Y1 - 0.22
    else:
        a = _gx[k]; yy = Y1 - 0.10
    _gl.append((a + 0.04, yy - 0.01, 0.2, a + _w - 0.04, yy + 0.01, H_EG - 0.4))
viele_quader('EG_Glas_hinten', _gl, M['glas'], 'S3_EG')
_pf = [(x - 0.045, Y1 - 0.28, 0.15, x + 0.045, Y1 - 0.04, H_EG - 0.35) for x in _gx]
_pf += [(0.3, Y1 - 0.28, 0.15, BT - 0.3, Y1 - 0.04, 0.22), (0.3, Y1 - 0.28, H_EG - 0.42, BT - 0.3, Y1 - 0.04, H_EG - 0.35)]
_pf += [(a + 0.02, yy - 0.03, 0.2, a + 0.07, yy + 0.03, H_EG - 0.4) for (a, yy, _, b, _, _) in [(g[0], (g[1] + g[4]) / 2, 0, 0, 0, 0) for g in _gl]]
viele_quader('EG_Pfosten_hinten', _pf, M['pfosten'], 'S3_EG')
# rechte Seite zum Parkplatz (Ayman 23.11.): Glasfassade wie vorn, möglichst viel Glas
_ry = [Y0 + 0.6 + k * (Y1 - 0.3 - Y0 - 0.6) / 7 for k in range(8)]
mesh('EG_Glas_rechts', [(BT - 0.07, _ry[0], 0.15), (BT - 0.07, _ry[-1], 0.15), (BT - 0.07, _ry[-1], H_EG), (BT - 0.07, _ry[0], H_EG)], [(0, 1, 2, 3)], M['glas'], 'S3_EG')
viele_quader('EG_Pfosten_rechts', [(BT - 0.16, y - 0.05, 0.15, BT, y + 0.05, H_EG) for y in _ry]
             + [(BT - 0.14, _ry[0], z - 0.04, BT, _ry[-1], z + 0.04) for z in (0.2, 2.8)], M['pfosten'], 'S3_EG')
# Glasfassade EG (x 0 … PORTAL_X), Pfosten alle ~1,5 m, Riegel bei 2,8 m
N_F = 11
fx = [i * PORTAL_X / N_F for i in range(N_F + 1)]
flaeche_v = lambda name, x0, x1, y, z0, z1, mat, c: mesh(name, [(x0, y, z0), (x1, y, z0), (x1, y, z1), (x0, y, z1)], [(0, 1, 2, 3)], mat, c)
flaeche_v('EG_Glas', 0.05, PORTAL_X, Y0 + 0.07, 0.15, H_EG, M['glas'], 'S3_EG')
pf = [(x - 0.05, Y0, 0.15, x + 0.05, Y0 + 0.16, H_EG) for x in fx[1:-1]] + [(0, Y0, 0.15, 0.12, Y0 + 0.16, H_EG)]
pf += [(0, Y0, z - 0.04, PORTAL_X, Y0 + 0.14, z + 0.04) for z in (0.2, 2.8)]
viele_quader('EG_Pfosten', pf, M['pfosten'], 'S3_EG')
# Portal (Ayman 23.11., Vorlage assets/eingang_vorlage_ayman.jpg): heller Sandstein-Block, RUNDBOGEN mit Bogenrahmen,
# dunkel gerahmte Glas-Doppeltür, Oberlicht, Bogenfenster mit Sprossen; Wandleuchten (Licht nach oben/unten)
PX0, PX1 = PORTAL_X, BT
quader('Portal_Pfeiler_links', PX0, Y0 - 0.6, 0.0, PX0 + 0.45, Y0 + 0.6, 9.6, M['stein'], 'S3_EG')
quader('Portal_Pfeiler_rechts', PX1 - 0.45, Y0 - 0.6, 0.0, PX1 + 0.03, Y0 + 0.6, 9.6, M['stein'], 'S3_EG')
quader('Portal_Sturz', PX0 + 0.45, Y0 - 0.55, 7.2, PX1 - 0.45, Y0 + 0.55, 9.6, M['stein'], 'S3_EG')   # zwischen den Pfeilern (keine deckungsgleichen Flächen)
bogen = rundbogen((PX0 + PX1) / 2, PX1 - PX0 - 0.9, 0.15, 4.45)
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
# Rahmen + Sprossen (anthrazit): Doppeltür 0,15–2,65 mit Kämpfer, Oberlicht, 2 senkrechte Sprossen bis zum Bogen, Fächer im Bogen
_bx0, _bx1 = PX0 + 0.45, PX1 - 0.45; _zk = 0.15 + 4.45; _r = (_bx1 - _bx0) / 2; _yf = Y0 - 0.36
_spr = [(cxm - 0.04, _yf - 0.06, 0.15, cxm + 0.04, _yf, _zk + _r - 0.05)]                         # Mittelsprosse / Türstoß
_spr += [(_bx0 + 0.04, _yf - 0.06, z - 0.045, _bx1 - 0.04, _yf, z + 0.045) for z in (2.65, 3.6, _zk)]   # Kämpfer + Querriegel
_spr += [(x - 0.025, _yf - 0.05, 2.7, x + 0.025, _yf, _zk) for x in (_bx0 + (_bx1 - _bx0) / 4, _bx1 - (_bx1 - _bx0) / 4)]
_spr += [(_bx0, _yf - 0.07, 0.15, _bx0 + 0.07, _yf, _zk), (_bx1 - 0.07, _yf - 0.07, 0.15, _bx1, _yf, _zk)]   # Rahmen seitlich
_spr += [(_bx0 + 0.07, _yf - 0.07, 0.15, _bx1 - 0.07, _yf, 0.22)]                                    # Schwelle
_spr += [(x - 0.06, _yf - 0.07, 0.15, x + 0.06, _yf, 2.65) for x in (_bx0 + 0.1, _bx1 - 0.1)]       # Türblatt-Rahmen außen
_spr += [(x - 0.06, _yf - 0.07, 0.15, x + 0.06, _yf, 2.65) for x in (cxm - 0.1, cxm + 0.1)]         # Türblatt-Rahmen Mitte
viele_quader('Portal_Sprossen', _spr, M['pfosten'], 'S3_EG')
# Fächersprossen + Rahmen im Rundbogen
_fv, _ff = [], []
def _stab(p0, p1, w=0.025, y0=_yf - 0.05, y1=_yf):
    (xa, za), (xb, zb) = p0, p1; dx, dz = xb - xa, zb - za; ln = math.hypot(dx, dz) or 1; nx, nz = -dz / ln * w, dx / ln * w
    k = len(_fv)
    for yy in (y0, y1):
        _fv.extend([(xa - nx, yy, za - nz), (xb - nx, yy, zb - nz), (xb + nx, yy, zb + nz), (xa + nx, yy, za + nz)])
    _ff.extend([(k, k + 1, k + 2, k + 3), (k + 4, k + 7, k + 6, k + 5), (k, k + 4, k + 5, k + 1), (k + 1, k + 5, k + 6, k + 2),
                (k + 2, k + 6, k + 7, k + 3), (k + 3, k + 7, k + 4, k)])
for i in range(1, 5):
    a_ = math.pi * i / 5
    _stab((cxm + 0.18 * math.cos(a_), _zk + 0.18 * math.sin(a_)), (cxm + _r * math.cos(a_), _zk + _r * math.sin(a_)))
_bp = [(cxm + _r * math.cos(math.pi * i / 24), _zk + _r * math.sin(math.pi * i / 24)) for i in range(25)]
for p0_, p1_ in zip(_bp, _bp[1:]):
    _stab(p0_, p1_, 0.04, _yf - 0.07)
_ip = [(cxm + 0.18 * math.cos(math.pi * i / 12), _zk + 0.18 * math.sin(math.pi * i / 12)) for i in range(13)]
for p0_, p1_ in zip(_ip, _ip[1:]):
    _stab(p0_, p1_, 0.022)
mesh('Portal_Bogensprossen', _fv, _ff, M['pfosten'], 'S3_EG')
# Türgriffe (lange Edelstahl-Stangen)
viele_quader('Portal_Tuergriffe', [(x - 0.018, _yf - 0.16, 0.9, x + 0.018, _yf - 0.12, 2.0) for x in (cxm - 0.22, cxm + 0.22)]
             + [(x - 0.012, _yf - 0.12, z - 0.012, x + 0.012, _yf - 0.07, z + 0.012) for x in (cxm - 0.22, cxm + 0.22) for z in (1.0, 1.9)],
             farbe('Edelstahl', '#B9BCC0', 0.25, 1.0, 0), 'S3_EG')
# Säulen EG – Raster 3×3 nach Architekt (Ayman 23.11.): nur die Mittelstütze steht frei im Raum, die 8 übrigen sitzen
# stark nach außen versetzt in den Außenwänden bzw. hinter den Pfosten der Glasfassaden (kein Platzverlust innen)
for i, (x, y) in enumerate(((BT / 2, (Y0 + Y1) / 2),)):
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
    for x in (X(3.0), X(8.25), X(13.5)):
        for y in (Y0 + 2.5, Y0 + 6.0, Y0 + 9.5):
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
mesh('OG_Glas_rechts', [(BT - 0.07, _ry[0], H_DECKE), (BT - 0.07, _ry[-1], H_DECKE), (BT - 0.07, _ry[-1], H_OG), (BT - 0.07, _ry[0], H_OG)], [(0, 1, 2, 3)], M['glas'], 'S4_OG')
viele_quader('OG_Pfosten_rechts', [(BT - 0.16, y - 0.05, H_DECKE, BT, y + 0.05, H_OG) for y in _ry], M['pfosten'], 'S4_OG')
quader('Geschossband_rechts', BT - 0.2, Y0 + 0.6, H_EG, BT + 0.02, Y1, H_DECKE, M['band'], 'S4_OG')
flaeche_v('OG_Glas', 0.05, PORTAL_X, Y0 + 0.07, H_DECKE, H_OG, M['glas'], 'S4_OG')
pf = [(x - 0.05, Y0, H_DECKE, x + 0.05, Y0 + 0.16, H_OG) for x in fx[1:-1]] + [(0, Y0, H_DECKE, 0.12, Y0 + 0.16, H_OG)]
viele_quader('OG_Pfosten', pf, M['pfosten'], 'S4_OG')
flaeche('OG_Teppich', [(0.3, Y0 + 0.2), (BT - 0.3, Y0 + 0.2), (BT - 0.3, Y1 - 0.3), (0.3, Y1 - 0.3)], H_DECKE + 0.01, M['teppich'], 'Innen')
for i, (x, y) in enumerate(((BT / 2, (Y0 + Y1) / 2),)):     # wie EG: nur die Mittelstütze frei
    zylinder(f'OG_Saeule{i}', x, y, H_DECKE, 0.24, 0.24, H_OG - H_DECKE, M['saeule'], 'S4_OG')

# ------------------------------------------------------------------ S5: Dachplatte, Attika, Gründach, PV
quader('Dachplatte', 0, Y0, H_OG, BT, Y1, H_DACH, M['beton_roh'], 'S5_Dach')
for i, (x0, y0, x1, y1) in enumerate(((-0.015, Y0 - 0.05, BT + 0.015, Y0 + 0.3), (0, Y1 - 0.3, BT, Y1 + 0.01), (0, Y0 + 0.3, 0.3, Y1 - 0.3), (BT - 0.3, Y0 + 0.3, BT, Y1 - 0.3))):
    quader(f'Attika{i}', x0, y0, H_OG if i == 0 else H_DACH, x1, y1, H_ATTIKA, M['attika'], 'S5_Dach')
flaeche('Dachkies', [(0.3, Y0 + 0.3), (BT - 0.3, Y0 + 0.3), (BT - 0.3, Y1 - 0.3), (0.3, Y1 - 0.3)], H_DACH + 0.06, M['kies'], 'S5_Dach')
flaeche('Gruendach', [(0.8, Y0 + 0.8), (BT - 0.8, Y0 + 0.8), (BT - 0.8, Y1 - 0.8), (0.8, Y1 - 0.8)], H_DACH + 0.1, M['gruendach'], 'S5_Dach')
mods, gest = [], []
for r in range(3):                       # Ayman 23.11. (Bild von oben): 3 lange PV-Reihen quer über das Dach
    y0 = Y0 + 1.5 + r * 3.0
    for i in range(14):
        x = 1.0 + i * (BT - 2.0) / 14 + 0.03
        mods.append((x, y0, H_DACH + 0.42, x + (BT - 2.0) / 14 - 0.06, y0 + 1.9, H_DACH + 0.46))
    for x in (1.2, BT / 2, BT - 1.3):
        gest += [(x, y0 + 0.2, H_DACH + 0.1, x + 0.08, y0 + 0.28, H_DACH + 0.42), (x, y0 + 1.6, H_DACH + 0.1, x + 0.08, y0 + 1.68, H_DACH + 0.42)]
viele_quader('PV_Module', mods, M['pv'], 'S5_Dach')
viele_quader('PV_Gestell', gest, M['pv_rahmen'], 'S5_Dach')

# ------------------------------------------------------------------ S6: Außenanlagen (Vorplatz, Hof, Parken, Wohnwagen, Zaun, Tor, Licht)
# (Ayman 23.11.: KEINE Bodenplatte vor der Moschee – die Glasfront ist bündig mit dem Nachbarhaus, davor wie beim Nachbarn Randstein + Gasse)
# Hof (Ayman 19.11.: „besser bebauen wie in den Beispielen“): Plattenboden, Mauern mit Leuchten, durchgehende Pflanzbeete
# mit Büschen und Zypressen, Bodenstrahler, 2 Olivenbäume, 1 Palme, 2 Essplätze mit Sonnenschirm, Lounge-Ecke, Außenküche.
flaeche('Hof_Boden', [(0.25, Y1), (BT - 0.25, Y1), (BT - 0.25, TT), (0.25, TT)], 0.035, M['hofplatten'], 'S6_Aussen')
quader('Hofmauer_links', 0, Y1, 0, 0.25, TT, 3.2, M['hofwand'], 'S6_Aussen')
quader('Hofmauer_rechts', BT - 0.25, Y1, 0, BT, TT, 3.2, M['hofwand'], 'S6_Aussen')
viele_quader('Hofmauer_Abdeckung', [(-0.03, Y1, 3.2, 0.28, TT, 3.28), (BT - 0.28, Y1, 3.2, BT + 0.03, TT, 3.28)], M['band'], 'S6_Aussen')
wl = []
for y in (14.4, 17.0, 19.6, 22.2, 24.8, 27.4):
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
# Parken (Ayman 23.11.: „Sinn ergeben, quer aber parallel und ordentlich“): 4 Schrägplätze im Winkel 75° zur Fahrgasse,
# je 2,45 m breit und 4,8 m tief, alle Striche parallel; Autos fahren von der Gasse (vorn) vorwärts schräg hinein.
# Vor der Glaswand ein 0,5 m Bordstein-Streifen, in jedem Platz ein Radstopper; Fahrgasse 3,7 m, Pfeil Richtung Einfahrt.
P_WINKEL, P_BREITE, P_TIEFE, P_BORD, P_Y0 = math.radians(75), 2.45, 4.8, 0.5, 0.45
P_U = Vector((-math.sin(P_WINKEL), math.cos(P_WINKEL), 0))          # in den Platz hinein (zur Moschee, leicht nach hinten)
P_DY = P_BREITE / math.sin(P_WINKEL)                                 # Abstand der Striche entlang der Fahrgasse
P_XA = BT + P_BORD + P_TIEFE                                         # Außenkante der Plätze (Fahrgassen-Seite)
P_LANG = P_TIEFE / math.sin(P_WINKEL)


def strich(a, b, w=0.06, z=0.04):
    a, b = Vector((a[0], a[1], 0)), Vector((b[0], b[1], 0)); d = (b - a).normalized(); n = Vector((-d.y, d.x, 0)) * w
    return [Vector((p.x, p.y, z)) for p in (a - n, b - n, b + n, a + n)]


mk = []
for i in range(5):
    pa = Vector((P_XA, P_Y0 + i * P_DY, 0)); mk.append(strich(pa, pa + P_U * P_LANG))
# (Ayman 23.11.: kein Pfeil, keine langen Linien – nur die parallelen Platzstriche)
# Wohnwagen: 7 Plätze à 3,5 × 7,5 m, leer; Hecke + Wandleuchten an der Brandwand
quader('Parken_Bordstein', BT, 0.3, 0, BT + P_BORD, P_Y0 + 4 * P_DY + P_TIEFE / math.tan(P_WINKEL) + 0.3, 0.14, M['stein'], 'S6_Aussen')
flaeche('Wohnwagen_Belag', [(PK, 0.25), (L, 0.25), (L, LT), (PK, LT)], 0.03, M['asphalt'], 'S6_Aussen')
WB = (L - PK) / 7
for i in range(8):
    x = PK + i * WB
    mk.append([Vector((x - 0.06, LT - 7.5, 0.04)), Vector((x + 0.06, LT - 7.5, 0.04)), Vector((x + 0.06, LT - 0.8, 0.04)), Vector((x - 0.06, LT - 0.8, 0.04))])
mk.append([Vector((PK, LT - 7.56, 0.04)), Vector((L, LT - 7.56, 0.04)), Vector((L, LT - 7.44, 0.04)), Vector((PK, LT - 7.44, 0.04))])
mesh('Markierungen', [p for q in mk for p in q], [tuple(range(4 * i, 4 * i + 4)) for i in range(len(mk))], M['markierung'], 'S6_Aussen')
quader('Hecke', PK, LT - 0.75, 0, L, LT, 1.3, M['hecke'], 'S6_Aussen')
quader('Parken_Hecke', BT + 0.3, LT - 0.35, 0, PK, LT, 0.9, M['hecke'], 'S6_Aussen')   # niedrig, hinter den Parkplätzen
viele_quader('Wandleuchten_Brandwand', [(PK + (i + 0.5) * WB - 0.15, LT + 0.22, 2.4, PK + (i + 0.5) * WB + 0.15, LT + 0.3, 2.75) for i in range(7)],
             M['wandleuchte'], 'S6_Aussen')
# Front der Wohnwagen-Plätze (Ayman 23.11.: mit festem Zaun + Pfeilern kamen 5 von 7 Wohnwagen nicht heraus):
# KEIN fester Zaun, KEINE Zwischenpfeiler. Über die ganze Breite (PK … L, 21 m) 3 Schiebeflügel à ~7 m auf 3 parallelen
# Bodenschienen mit Kippsicherung (U-Profil mit seitlichen Führungsrollen), von Hand verschiebbar und hintereinander
# schiebbar → jede Stelle lässt sich öffnen (bis 14 m breit), jeder Wohnwagen fährt gerade nach vorn hinaus.
# Nur ganz außen schlanke Stahl-Endpfosten (12 cm) – Abstand zum äußeren Wohnwagen ≥ 0,2 m.
H_Z = 1.9
SPUR = (0.40, 0.58, 0.76)                                # Mittellinien der 3 Schienen
F_X0, F_X1, UEB = PK + 0.15, L - 0.15, 0.2               # Flügelbereich, Überlappung im geschlossenen Zustand
F_LEN = (F_X1 - F_X0 + 2 * UEB) / 3
viele_quader('Schiebetor_Schienen', [(PK, y - 0.04, 0.0, L, y + 0.04, 0.035) for y in SPUR]
             + [(PK, y - 0.012, 0.035, L, y + 0.012, 0.05) for y in SPUR], M['zaun'], 'S6_Aussen')
viele_quader('Schiebetor_Pfosten', [(PK, 0.30, 0, PK + 0.12, 0.86, H_Z + 0.15), (L - 0.12, 0.30, 0, L, 0.86, H_Z + 0.15)], M['zaun'], 'S6_Aussen')


def fluegel(x0, y):
    """Ein Schiebeflügel: Rahmen, Stabgitter, 2 Rollenwagen in der Schiene, Griffstange, Bodenriegel."""
    x1 = x0 + F_LEN; t = []
    t += [(x0, y - 0.03, zz, x1, y + 0.03, zz + 0.07) for zz in (0.10, H_Z - 0.07)]
    t += [(x, y - 0.035, 0.10, x + 0.07, y + 0.035, H_Z) for x in (x0, x1 - 0.07)]
    t += [(x - 0.012, y - 0.015, 0.17, x + 0.012, y + 0.015, H_Z - 0.07) for x in [x0 + 0.13 + k * 0.12 for k in range(int((F_LEN - 0.2) / 0.12))]]
    t += [(x - 0.18, y - 0.05, 0.035, x + 0.18, y + 0.05, 0.12) for x in (x0 + 0.6, x1 - 0.6)]                       # Rollenwagen
    t += [(x0 + 0.25, y + 0.035, 0.9, x0 + 0.29, y + 0.075, 1.4), (x1 - 0.29, y + 0.035, 0.9, x1 - 0.25, y + 0.075, 1.4)]   # Griffe
    t += [(x0 + 0.12, y + 0.035, 0.12, x0 + 0.16, y + 0.07, 0.6)]                                                    # Bodenriegel
    return t


tor = viele_quader('Schiebetor', fluegel(F_X1 - F_LEN, SPUR[2]), M['zaun'], 'S6_Aussen')     # rechter Flügel (wird im Video geöffnet)
viele_quader('Schiebetor_FluegelA', fluegel(F_X0, SPUR[0]), M['zaun'], 'S6_Aussen')
viele_quader('Schiebetor_FluegelB', fluegel(F_X0 + F_LEN - UEB, SPUR[1]), M['zaun'], 'S6_Aussen')
tor['offen'] = 0.0
fc = tor.driver_add('location', 0); dv = fc.driver; dv.type = 'SCRIPTED'
var = dv.variables.new(); var.name = 'offen'; var.targets[0].id = tor; var.targets[0].data_path = '["offen"]'
dv.expression = f'-{F_LEN - UEB:.3f} * offen'                 # schiebt sich hinter den mittleren Flügel

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
# Portal: Bogenrahmen aus Sandstein (vorstehend) mit Schlussstein, Wandleuchten (Licht nach oben/unten), zwei Stufen,
# Kegel-Thujen in hellen Betonkübeln (Ayman 23.11., Vorlage assets/eingang_vorlage_ayman.jpg)
gv, gf = [], []
w = 0.24
for i in range(1, len(bogen) - 1):
    (xa, za), (xb, zb) = bogen[i], bogen[i + 1]
    dx, dz = xb - xa, zb - za; ln = math.hypot(dx, dz) or 1; nx, nz = dz / ln, -dx / ln
    k0 = len(gv)
    for yy in (Y0 - 0.49, Y0 - 0.66):
        gv += [(xa, yy, za), (xb, yy, zb), (xb + nx * w, yy, zb + nz * w), (xa + nx * w, yy, za + nz * w)]
    gf += [(k0, k0 + 1, k0 + 2, k0 + 3), (k0 + 4, k0 + 7, k0 + 6, k0 + 5), (k0 + 2, k0 + 6, k0 + 7, k0 + 3), (k0, k0 + 4, k0 + 5, k0 + 1)]
mesh('Portal_Bogenrahmen', gv, gf, farbe('Sandstein_Bogen', '#E2CFA6', 0.6, 0, 0.05), 'S3_EG')
_ks = max(bogen, key=lambda p: p[1])
quader('Portal_Schlussstein', _ks[0] - 0.15, Y0 - 0.7, _ks[1] - 0.02, _ks[0] + 0.15, Y0 - 0.49, _ks[1] + 0.34, bpy.data.materials['Sandstein_Bogen'], 'S3_EG')
# Wandleuchten: schwarze Zylinder, Licht nach oben und unten (Lichtkegel auf dem Stein); an den Portalpfeilern + an der Glaswand zum Parkplatz
SCHWARZ_L = farbe('Leuchte_schwarz', '#151617', 0.4, 0.6, 0)
LEUCHTEN = [((PX0 + 0.225, Y0 - 0.6), (0, -1)), ((PX1 - 0.225, Y0 - 0.6), (0, -1)), ((PX1 + 0.03, Y0 + 0.2), (1, 0))]
LEUCHTEN += [((BT, y), (1, 0)) for y in _ry[1::2]]
_lv = []
for (lx, ly), (ox, oy) in LEUCHTEN:
    cx_, cy_ = lx + ox * 0.08, ly + oy * 0.08
    _lv.append((cx_ - 0.05, cy_ - 0.05, 2.25, cx_ + 0.05, cy_ + 0.05, 2.6))
    _lv.append((min(lx, cx_) - (0.03 if oy else 0), min(ly, cy_) - (0.03 if ox else 0), 2.4, max(lx, cx_) + (0.03 if oy else 0), max(ly, cy_) + (0.03 if ox else 0), 2.45))
viele_quader('Portal_Wandleuchten', _lv, SCHWARZ_L, 'S3_EG')
viele_quader('Portal_Wandleuchten_Glas', [(lx + ox * 0.08 - 0.04, ly + oy * 0.08 - 0.04, z, lx + ox * 0.08 + 0.04, ly + oy * 0.08 + 0.04, z + 0.005)
                                          for (lx, ly), (ox, oy) in LEUCHTEN for z in (2.245, 2.6)], M['wandleuchte'], 'S3_EG')
for k, ((lx, ly), (ox, oy)) in enumerate(LEUCHTEN):
    for richtung, z in (('auf', 2.62), ('ab', 2.23)):
        ld = bpy.data.lights.new(f'Wandlicht_{k}_{richtung}', 'SPOT'); ld.energy = 0.0; ld.spot_size = math.radians(38); ld.spot_blend = 0.5
        ld.color = (1.0, 0.78, 0.5); ld.shadow_soft_size = 0.02; ld['ziel_energie'] = 90.0
        lo = bpy.data.objects.new(f'Wandlicht_{k}_{richtung}', ld); coll('S3_EG').objects.link(lo)
        lo.location = (lx + ox * 0.08, ly + oy * 0.08, z)
        lo.rotation_euler = (0, 0, 0) if richtung == 'auf' else (math.pi, 0, 0)
viele_quader('Portal_Stufen', [(PX0 + 0.3, Y0 - 0.95, 0.0, PX1 - 0.3, Y0 - 0.6, 0.08), (PX0 + 0.4, Y0 - 0.8, 0.0, PX1 - 0.4, Y0 - 0.6, 0.15)], M['stein'], 'S6_Aussen')
BETON_HELL = farbe('Kuebel_Beton_hell', '#BDB8AE', 0.8, 0, 0.06)


def kegel_thuja(name, x, y, z0, r, h, c='S6_Aussen', seed=0):
    """Kegelförmige Thuja/Formschnitt-Konifere: dichte, leicht unregelmäßige Laub-Oberfläche (keine glatte Kegelform)."""
    rnd = random.Random(seed); n, m = 20, 14
    v, f = [], []
    for j in range(m + 1):
        t = j / m; rr = r * (1 - t) ** 0.85
        for i in range(n):
            a_ = 2 * math.pi * i / n; ru = rr * (0.86 + 0.24 * rnd.random()) if 0 < j < m else rr
            v.append((x + ru * math.cos(a_), y + ru * math.sin(a_), z0 + h * t + (0.03 * rnd.random() if 0 < j < m else 0)))
    for j in range(m):
        for i in range(n):
            a0, a1 = j * n + i, j * n + (i + 1) % n
            f.append((a0, a1, a1 + n, a0 + n))
    f.append(tuple(range(n - 1, -1, -1)))
    ob = mesh(name, v, f, M['hecke'], c)
    for p_ in ob.data.polygons:
        p_.use_smooth = True
    return ob


for i, x in enumerate((PX0 - 0.55, PX1 + 0.55)):
    quader(f'Portal_Kuebel{i}', x - 0.32, Y0 - 0.92, 0, x + 0.32, Y0 - 0.28, 0.62, BETON_HELL, 'S6_Aussen')
    kegel_thuja(f'Portal_Zypresse{i}', x, Y0 - 0.6, 0.58, 0.36, 1.75, seed=10 + i)
# rechte Seite mit Natursteinplatten statt Putz
# Rückseite zum Hof: Fenster, Vordach über der Hoftür
fen = []
# EG-Rückseite ist jetzt Glas (siehe S3) – nur noch OG-Fenster
for x in (X(2.2), X(5.0), X(8.25), X(11.5), X(14.3)):
    fen.append((x - 0.6, Y1 + 0.005, H_DECKE + 0.6, x + 0.6, Y1 + 0.02, H_OG - 0.5))
viele_quader('Rueckseite_Fenster', fen, M['glas'], 'S4_OG')
viele_quader('Rueckseite_Fensterrahmen', [(a - 0.07, b + 0.0, c - 0.07, d + 0.07, e - 0.008, f + 0.07) for a, b, c, d, e, f in fen], M['pfosten'], 'S4_OG')
quader('Hoftuer_Vordach', X(6.6), Y1, 2.95, X(9.6), Y1 + 1.3, 3.1, M['pv_rahmen'], 'S6_Aussen')
# Schiebedach über dem Hof (Ayman 20.11.): bei Regen zu, bei Sonne auf. Stützen + Laufschienen auf den Hofmauern,
# 5 Dachfelder, die sich nach hinten zusammenschieben. Steuerung: Eigenschaft „offen“ (0 = zu, 1 = auf) an Hofdach_Schienen.
HD = 4.8
dach_feld = farbe('Hofdach_Feld', '#E9E6DF', 0.45, 0.15, 0.02)
alu = farbe('Hofdach_Alu', '#A9AEB4', 0.35, 0.85, 0)
_st = [(x0, y - 0.07, 3.28, x0 + 0.14, y + 0.07, HD) for x0 in (0.055, BT - 0.195) for y in [Y1 + 0.35 + k * (TT - 0.55 - Y1) / 5 for k in range(6)]]
viele_quader('Hofdach_Stuetzen', _st, alu, 'S6_Aussen')
sch = viele_quader('Hofdach_Schienen', [(0.02, Y1 + 0.05, HD, 0.26, TT, HD + 0.16), (BT - 0.26, Y1 + 0.05, HD, BT - 0.02, TT, HD + 0.16)], alu, 'S6_Aussen')
sch['offen'] = 0.0
_L = 3.6
_SCH = (TT - 0.15 - _L - Y1 - 0.1) / 4
for k in range(5):
    y0 = Y1 + 0.1 + k * _SCH; z0 = HD + 0.17 + k * 0.05
    f = viele_quader(f'Hofdach_Feld{k}', [(0.15, y0, z0, BT - 0.15, y0 + _L, z0 + 0.035),           # Feld
                                          (0.12, y0, z0 - 0.01, BT - 0.12, y0 + 0.08, z0 + 0.05),   # Profil vorn
                                          (0.12, y0 + _L - 0.08, z0 - 0.01, BT - 0.12, y0 + _L, z0 + 0.05)], dach_feld, 'S6_Aussen')
    ziel = TT - _L - 0.05 - (4 - k) * 0.12                       # Endlage: hinten zusammengeschoben
    d = ziel - y0
    fc = f.driver_add('location', 1); dv = fc.driver; dv.type = 'SCRIPTED'
    var = dv.variables.new(); var.name = 'offen'; var.targets[0].id = sch; var.targets[0].data_path = '["offen"]'
    dv.expression = f'{d:.3f} * offen'
# Innen: Hängeleuchten (Ringe), Quran-Regal an der Rückwand
for i, (x, y) in enumerate(((X(5.5), Y0 + 6.0), (X(11.0), Y0 + 6.0))):
    zylinder(f'Innen_Ringleuchte{i}', x, y, 4.2, 1.1, 1.1, 0.08, M['licht_innen'], 'Innen', 32)
    zylinder(f'Innen_Ringleuchte{i}_Seil', x, y, 4.28, 0.01, 0.01, H_EG - 4.3, M['zaun'], 'Innen', 6)
# Quran-Regale an der rechten Seitenwand zwischen den Fenstern (Rückwand ist jetzt Glas, Ayman 20.11.)
viele_quader('Innen_Regal', [(BT - 0.75, Y0 + 3.25, 0.17, BT - 0.41, Y0 + 5.25, 1.25), (BT - 0.75, Y0 + 6.75, 0.17, BT - 0.41, Y0 + 8.75, 1.25)], M['holz'], 'Innen')   # niedrig, vor der Glaswand
viele_quader('Innen_Regal_Buecher', [(BT - 0.78, y0 + 0.1 + j * 0.5, 0.3 + r * 0.45, BT - 0.74, y0 + 0.5 + j * 0.5, 0.6 + r * 0.45) for y0 in (Y0 + 3.25, Y0 + 6.75) for j in range(4) for r in range(2)], M['gold'], 'Innen')
# Dach: Ausstieg, zwei Lüftungsgeräte
# Dach_Technik (3 Kästen) entfernt – Ayman 23.11.

# ------------------------------------------------------------------ Wohnwagen (Ayman 19.11.: „wie im Beispiel“) – 7 Stück, Deichsel zur Gasse
# Wohnwagen (Ayman 23.11., Vorlage assets/wohnwagen_vorlage_ayman.png): moderner Tandem-Wohnwagen, abgerundet, Panorama-Front,
# LED-Leiste, grauer Seitenstreifen, Fenster mit Rahmen, Tür, Radkästen, 4 Alufelgen, Deichsel mit Kupplung und Stützrad,
# rote Rücklichter, Dachluken + Klima. KEINE Schriftzüge/Logos (Regel: kein Text im Video).
weiss = farbe('Wohnwagen_weiss', '#F3F3F0', 0.22, 0, 0.01)
grau = farbe('Wohnwagen_Streifen', '#8E9297', 0.4, 0, 0)
dunkel = farbe('Wohnwagen_Fenster', '#15191E', 0.06, 0.3, 0)
rahmen_ww = farbe('Wohnwagen_Rahmen', '#202226', 0.5, 0, 0)
kunst = farbe('Wohnwagen_Kunststoff', '#2C2E33', 0.55, 0, 0.02)
reifen = farbe('Reifen', '#161616', 0.85, 0, 0)
felge = farbe('Alufelge', '#C7CBD0', 0.28, 0.9, 0)
chassis = farbe('Chassis_verzinkt', '#A4A8AD', 0.4, 0.8, 0.03)
led = leuchte('Wohnwagen_LED', '#F4F8FF', 3.0)
rot = leuchte('Wohnwagen_Ruecklicht', '#E0261B', 1.5)
vorhang = farbe('Wohnwagen_Vorhang', '#6E6A64', 0.9, 0, 0.05)
W_W, W_L0, W_L1 = 2.3, LT - 7.3, LT - 1.0           # Breite, Front (zur Gasse), Heck


def ww_profil(y0, y1):
    return [(y0 + 0.15, 0.42), (y1 - 0.1, 0.42), (y1, 0.58), (y1, 2.55), (y1 - 0.22, 2.72), (y0 + 0.95, 2.72),
            (y0 + 0.28, 2.47), (y0, 1.92), (y0, 0.78), (y0 + 0.04, 0.52)]


def extrudiere(name, prof, xa, xb, mat, c='Wohnwagen'):
    n = len(prof)
    v = [(xa, y, z) for y, z in prof] + [(xb, y, z) for y, z in prof]
    f = [tuple(reversed(range(n))), tuple(range(n, 2 * n))] + [(k, (k + 1) % n, n + (k + 1) % n, n + k) for k in range(n)]
    return mesh(name, v, f, mat, c)


def seitenflaeche(pts, x, aussen):
    """Polygon (y, z) auf der Seitenwand bei x; aussen = +1/-1 (Blickrichtung)."""
    v = [(x, y, z) for y, z in pts]
    return v, (list(range(len(pts))) if aussen > 0 else list(reversed(range(len(pts)))))


def sammle(name, polys, mat):
    v, f = [], []
    for pv, pf in polys:
        k = len(v); v += pv; f.append(tuple(k + i for i in pf))
    if v:
        mesh(name, v, f, mat, 'Wohnwagen')


def balken(p0, p1, b, h):
    p0, p1 = Vector(p0), Vector(p1); d = (p1 - p0).normalized(); s = Vector((-d.y, d.x, 0)).normalized() * b / 2; u = Vector((0, 0, h / 2))
    return [p0 - s - u, p0 + s - u, p1 + s - u, p1 - s - u, p0 - s + u, p0 + s + u, p1 + s + u, p1 - s + u]


def box_faces(k):
    return [(k, k + 3, k + 2, k + 1), (k + 4, k + 5, k + 6, k + 7), (k, k + 1, k + 5, k + 4), (k + 1, k + 2, k + 6, k + 5), (k + 2, k + 3, k + 7, k + 6), (k + 3, k, k + 4, k + 7)]


def rad(name, x, y, z, r, b, mat, n=24):
    ob = zylinder(name, 0, 0, -b / 2, r, r, b, mat, 'Wohnwagen', n)
    for vv in ob.data.vertices:
        vv.co = Vector((x + vv.co.z, y + vv.co.x, z + vv.co.y))
    return ob


for i in range(7):
    cx = PK + (i + 0.5) * WB
    y0, y1 = W_L0, W_L1
    xa, xb = cx - W_W / 2, cx + W_W / 2
    kor = extrudiere(f'Wohnwagen{i}_Aufbau', ww_profil(y0, y1), xa, xb, weiss)
    bev = kor.modifiers.new('Rundung', 'BEVEL'); bev.width = 0.07; bev.segments = 3; bev.limit_method = 'ANGLE'
    for p in kor.data.polygons:
        p.use_smooth = True
    # Front: Panoramafenster (läuft über die Schräge aufs Dach), LED-Leiste, dunkle Schürze mit Leuchten
    fr = []
    for ((ya, za), (yb, zb)), (xl, xr) in ((((y0, 1.5), (y0, 1.92)), (xa + 0.18, xb - 0.18)), (((y0, 1.92), (y0 + 0.28, 2.47)), (xa + 0.2, xb - 0.2)),
                                          (((y0 + 0.28, 2.47), (y0 + 0.8, 2.66)), (xa + 0.28, xb - 0.28))):
        dy, dz = yb - ya, zb - za; ln = math.hypot(dy, dz); ny, nz = -dz / ln * 0.012, dy / ln * 0.012
        fr.append(([(xl, ya + ny, za + nz), (xr, ya + ny, za + nz), (xr, yb + ny, zb + nz), (xl, yb + ny, zb + nz)], [3, 2, 1, 0]))
    sammle(f'Wohnwagen{i}_Panorama', fr, dunkel)
    sammle(f'Wohnwagen{i}_LED', [([(xa + 0.3, y0 - 0.012, 1.34), (xb - 0.3, y0 - 0.012, 1.34), (xb - 0.3, y0 - 0.012, 1.39), (xa + 0.3, y0 - 0.012, 1.39)], [3, 2, 1, 0]),
                                 ([(xa + 0.12, y0 - 0.012, 1.24), (xa + 0.32, y0 - 0.012, 1.34), (xa + 0.32, y0 - 0.012, 1.39), (xa + 0.12, y0 - 0.012, 1.3)], [3, 2, 1, 0]),
                                 ([(xb - 0.32, y0 - 0.012, 1.34), (xb - 0.12, y0 - 0.012, 1.24), (xb - 0.12, y0 - 0.012, 1.3), (xb - 0.32, y0 - 0.012, 1.39)], [3, 2, 1, 0])], led)
    sammle(f'Wohnwagen{i}_Frontschuerze', [([(xa + 0.15, y0 - 0.01, 0.62), (xb - 0.15, y0 - 0.01, 0.62), (xb - 0.15, y0 - 0.01, 0.98), (xa + 0.15, y0 - 0.01, 0.98)], [3, 2, 1, 0])], kunst)
    # Seiten: grauer Streifen, 2 Fenster je Seite, Tür (rechts), Schweller, Radkästen
    band, fen, glas_w, vh, schw, kast = [], [], [], [], [], []
    yc = (y0 + y1) / 2 + 0.25; ya_, yb_ = yc - 0.42, yc + 0.42
    for sx, x in ((-1, xa), (1, xb)):
        e = x + sx * 0.006
        band.append(seitenflaeche([(y0 + 0.55, 1.05), (y1 - 0.45, 1.05), (y1 - 0.45, 2.22), (y0 + 1.55, 2.22), (y0 + 0.95, 1.7)], e, sx))
        for wy in (y0 + 2.1, y0 + 3.6):
            fen.append(seitenflaeche([(wy - 0.56, 1.5), (wy + 0.56, 1.5), (wy + 0.56, 2.12), (wy - 0.56, 2.12)], x + sx * 0.01, sx))
            glas_w.append(seitenflaeche([(wy - 0.48, 1.56), (wy + 0.48, 1.56), (wy + 0.48, 2.06), (wy - 0.48, 2.06)], x + sx * 0.014, sx))
            vh.append(seitenflaeche([(wy - 0.46, 1.58), (wy - 0.2, 1.58), (wy - 0.2, 2.04), (wy - 0.46, 2.04)], x + sx * 0.016, sx))
            vh.append(seitenflaeche([(wy + 0.2, 1.58), (wy + 0.46, 1.58), (wy + 0.46, 2.04), (wy + 0.2, 2.04)], x + sx * 0.016, sx))
        schw.append(seitenflaeche([(y0 + 0.15, 0.42), (y1 - 0.1, 0.42), (y1 - 0.1, 0.56), (y0 + 0.15, 0.56)], x + sx * 0.012, sx))
        arc = [(ya_ - 0.45, 0.42)] + [(ya_ - 0.45 * math.cos(a), 0.42 + 0.42 * math.sin(a)) for a in [k * math.pi / 16 for k in range(1, 8)]]
        arc += [(ya_, 0.84), (yb_, 0.84)] + [(yb_ + 0.45 * math.sin(a), 0.42 + 0.42 * math.cos(a)) for a in [k * math.pi / 16 for k in range(1, 8)]] + [(yb_ + 0.45, 0.42)]
        kast.append(seitenflaeche(arc, x + sx * 0.014, sx))
    sammle(f'Wohnwagen{i}_Streifen', band, grau)
    sammle(f'Wohnwagen{i}_Fensterrahmen', fen, rahmen_ww)
    sammle(f'Wohnwagen{i}_Fenster', glas_w, dunkel)
    sammle(f'Wohnwagen{i}_Vorhang', vh, vorhang)
    sammle(f'Wohnwagen{i}_Schweller', schw, kunst)
    sammle(f'Wohnwagen{i}_Radkasten', kast, kunst)
    # Tür auf der rechten Seite (Fuge als dunkler Rahmen, kleines Fenster, Griff)
    tx, ty0, ty1 = xb + 0.012, y1 - 1.75, y1 - 1.05
    tuer = [seitenflaeche(p, tx, 1) for p in ([(ty0, 0.6), (ty1, 0.6), (ty1, 0.63), (ty0, 0.63)], [(ty0, 2.02), (ty1, 2.02), (ty1, 2.05), (ty0, 2.05)],
                                                [(ty0, 0.6), (ty0 + 0.03, 0.6), (ty0 + 0.03, 2.05), (ty0, 2.05)], [(ty1 - 0.03, 0.6), (ty1, 0.6), (ty1, 2.05), (ty1 - 0.03, 2.05)])]
    sammle(f'Wohnwagen{i}_Tuerfuge', tuer, rahmen_ww)
    sammle(f'Wohnwagen{i}_Tuerfenster', [seitenflaeche([(ty0 + 0.15, 1.5), (ty1 - 0.15, 1.5), (ty1 - 0.15, 1.92), (ty0 + 0.15, 1.92)], tx + 0.002, 1)], dunkel)
    quader(f'Wohnwagen{i}_Tuergriff', xb + 0.01, ty1 - 0.14, 1.2, xb + 0.05, ty1 - 0.08, 1.34, rahmen_ww, 'Wohnwagen')
    # Heck: L-förmige Rücklichter, Lichtband oben, Stoßfänger, leeres Kennzeichenfeld (ohne Schrift)
    hk = []
    for s_ in (-1, 1):
        xo = cx + s_ * (W_W / 2 - 0.12)
        hk.append(([(min(xo, xo - s_ * 0.08), y1 + 0.012, 0.8), (max(xo, xo - s_ * 0.08), y1 + 0.012, 0.8), (max(xo, xo - s_ * 0.08), y1 + 0.012, 1.25), (min(xo, xo - s_ * 0.08), y1 + 0.012, 1.25)], [0, 1, 2, 3]))
        hk.append(([(min(xo, xo - s_ * 0.3), y1 + 0.012, 0.8), (max(xo, xo - s_ * 0.3), y1 + 0.012, 0.8), (max(xo, xo - s_ * 0.3), y1 + 0.012, 0.88), (min(xo, xo - s_ * 0.3), y1 + 0.012, 0.88)], [0, 1, 2, 3]))
    hk.append(([(cx - 0.6, y1 + 0.012, 2.32), (cx + 0.6, y1 + 0.012, 2.32), (cx + 0.6, y1 + 0.012, 2.36), (cx - 0.6, y1 + 0.012, 2.36)], [0, 1, 2, 3]))
    sammle(f'Wohnwagen{i}_Ruecklichter', hk, rot)
    quader(f'Wohnwagen{i}_Stossfaenger', xa + 0.1, y1 - 0.05, 0.45, xb - 0.1, y1 + 0.04, 0.68, kunst, 'Wohnwagen')
    quader(f'Wohnwagen{i}_Kennzeichenfeld', cx - 0.26, y1 + 0.04, 0.52, cx + 0.26, y1 + 0.05, 0.63, rahmen_ww, 'Wohnwagen')
    # Dach: 3 Luken, großes Panorama-Dachfenster, Klimagerät
    dv, df = [], []
    for (ly, lw, ll) in ((y0 + 1.6, 0.55, 0.55), (y0 + 3.0, 0.9, 0.7), (y1 - 1.0, 0.45, 0.45)):
        k = len(dv); dv += [Vector(p) for p in [(cx - lw / 2, ly - ll / 2, 2.72), (cx + lw / 2, ly - ll / 2, 2.72), (cx + lw / 2, ly + ll / 2, 2.72), (cx - lw / 2, ly + ll / 2, 2.72),
                                                (cx - lw / 2 + 0.04, ly - ll / 2 + 0.04, 2.8), (cx + lw / 2 - 0.04, ly - ll / 2 + 0.04, 2.8), (cx + lw / 2 - 0.04, ly + ll / 2 - 0.04, 2.8), (cx - lw / 2 + 0.04, ly + ll / 2 - 0.04, 2.8)]]
        df += box_faces(k)
    mesh(f'Wohnwagen{i}_Dachluken', dv, df, dunkel, 'Wohnwagen')
    quader(f'Wohnwagen{i}_Klima', cx - 0.4, y0 + 4.2, 2.72, cx + 0.4, y0 + 5.05, 2.96, weiss, 'Wohnwagen')
    # Fahrwerk: Tandemachse, 4 Räder mit Alufelgen und Nabe
    for j, yy in enumerate((ya_, yb_)):
        for k_, sx in enumerate((-1, 1)):
            xr = cx + sx * (W_W / 2 - 0.02)
            rad(f'Wohnwagen{i}_Rad{j}{k_}', xr, yy, 0.34, 0.34, 0.2, reifen)
            rad(f'Wohnwagen{i}_Felge{j}{k_}', xr + sx * 0.1, yy, 0.34, 0.22, 0.02, felge, 16)
            rad(f'Wohnwagen{i}_Nabe{j}{k_}', xr + sx * 0.115, yy, 0.34, 0.06, 0.02, kunst, 10)
    # Deichsel (A-Rahmen), Abdeckhaube, Kupplung, Stützrad
    bv = balken((cx - 0.85, y0 + 0.3, 0.45), (cx - 0.05, y0 - 1.25, 0.48), 0.08, 0.12) + balken((cx + 0.85, y0 + 0.3, 0.45), (cx + 0.05, y0 - 1.25, 0.48), 0.08, 0.12)
    bv += balken((cx, y0 - 1.25, 0.5), (cx, y0 - 1.55, 0.52), 0.1, 0.12)
    mesh(f'Wohnwagen{i}_Deichsel', bv, box_faces(0) + box_faces(8) + box_faces(16), chassis, 'Wohnwagen')
    quader(f'Wohnwagen{i}_Deichselhaube', cx - 0.45, y0 - 0.75, 0.5, cx + 0.45, y0 - 0.05, 0.78, kunst, 'Wohnwagen')
    quader(f'Wohnwagen{i}_Kupplung', cx - 0.08, y0 - 1.72, 0.48, cx + 0.08, y0 - 1.5, 0.62, chassis, 'Wohnwagen')
    zylinder(f'Wohnwagen{i}_Stuetzrohr', cx + 0.15, y0 - 1.0, 0.16, 0.04, 0.04, 0.42, chassis, 'Wohnwagen', 10)
    rad(f'Wohnwagen{i}_Stuetzrad', cx + 0.15, y0 - 1.0, 0.1, 0.1, 0.06, reifen, 14)
# Parken: Radstopper; Zaun: Steinpfeiler; Schiebetor: Antrieb, Laufrollen, Warnleuchte
stopper_v, stopper_f = [], []
for i in range(4):                       # Radstopper quer zur Platzachse, 0,8 m vor dem Bordstein
    m = Vector((P_XA, P_Y0 + (i + 0.5) * P_DY, 0)) + P_U * (P_LANG - 0.8)
    q = Vector((-P_U.y, P_U.x, 0)) * 0.85; t = P_U * 0.09
    k = len(stopper_v)
    for zz in (0.03, 0.13):
        stopper_v += [m - q - t + Vector((0, 0, zz)), m + q - t + Vector((0, 0, zz)), m + q + t + Vector((0, 0, zz)), m - q + t + Vector((0, 0, zz))]
    stopper_f += [(k, k + 3, k + 2, k + 1), (k + 4, k + 5, k + 6, k + 7), (k, k + 1, k + 5, k + 4), (k + 1, k + 2, k + 6, k + 5), (k + 2, k + 3, k + 7, k + 6), (k + 3, k, k + 4, k + 7)]
mesh('Parken_Radstopper', stopper_v, stopper_f, granit, 'S6_Aussen')
# Parkplatz-Grün (Ayman 23.11.): schlanke Thujen an den Platzgrenzen vor der Glaswand (zwischen den Autos), je ein Bodenstrahler
for i in range(5):
    pe = Vector((P_XA, P_Y0 + i * P_DY, 0)) + P_U * P_LANG
    ty = min(pe.y, LT - 0.6)
    quader(f'Parken_Kuebel{i}', BT + 0.05, ty - 0.22, 0.14, BT + 0.47, ty + 0.22, 0.6, BETON_HELL, 'S6_Aussen')
    kegel_thuja(f'Parken_Thuja{i}', BT + 0.26, ty, 0.58, 0.24, 1.9, seed=20 + i)
    ld = bpy.data.lights.new(f'Parken_Strahler{i}', 'SPOT'); ld.energy = 0.0; ld.spot_size = math.radians(30); ld.spot_blend = 0.4
    ld.color = (1.0, 0.8, 0.55); ld['ziel_energie'] = 45.0
    lo = bpy.data.objects.new(f'Parken_Strahler{i}', ld); coll('S6_Aussen').objects.link(lo)
    lo.location = (BT + 0.62, ty, 0.2); lo.rotation_euler = (0, math.radians(-20), 0)
# (23.11.: Steinpfeiler, Torantrieb und separate Laufrollen entfallen – Flügel von Hand, Rollenwagen sind Teil der Flügel)
viele_quader('Schiebetor_Warnleuchte', [(L - 0.11, 0.48, H_Z + 0.15, L - 0.01, 0.68, H_Z + 0.33)], leuchte('Warnleuchte_orange', '#FF9A2E', 3.0), 'S6_Aussen')

# ------------------------------------------------------------------ Innen für die Schlussansicht von oben (Ayman 20.11.: Blick wie im Beispielbild)
# Zimmerpflanzen, senkrechte Lichtleisten, Ornamentfelder neben dem Mihrab, Schuhregale am Eingang, kleiner Waschraum hinten rechts.
for i, (x, y) in enumerate(((0.8, Y0 + 1.0), (0.8, Y1 - 0.9), (BT - 0.9, Y1 - 0.9), (X(6.0), Y1 - 0.9), (X(10.5), Y1 - 0.9))):
    quader(f'Innen2_Topf{i}', x - 0.25, y - 0.25, 0.17, x + 0.25, y + 0.25, 0.65, M['kuebel'], 'Innen')
    krone(f'Innen2_Pflanze{i}', x, y, 1.15, 0.45, M['pflanzen'], 'Innen', 2)
viele_quader('Innen2_Lichtleisten', [(0.31, y - 0.05, 0.6, 0.36, y + 0.05, H_EG - 0.6) for y in (Y0 + 2.0, Y0 + 4.0, Y0 + 8.0, Y0 + 10.0)]
             + [(x - 0.05, Y1 - 0.36, 0.6, x + 0.05, Y1 - 0.31, H_EG - 0.6) for x in (X(2.0), X(14.5))], M['wandleuchte'], 'Innen')
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
# Waschraum: nicht mehr im EG (Rückwand ist Glas zum Hof, Ayman 20.11.) – gedacht im Keller
# (entfernt 20.11.: Waschraum nicht mehr hinter der Glas-Rückwand) 
# (entfernt 20.11.: Waschraum nicht mehr hinter der Glas-Rückwand) 
fl = farbe('Fliesen_Waschraum', '#CFCBC2', 0.4, 0, 0.03)
# (entfernt 20.11.: Waschraum nicht mehr hinter der Glas-Rückwand) 

# 4 Autos auf den Parkplätzen (Ayman 23.11.) – eigene Datei, läuft im Namensraum dieses Skripts
exec(compile(open(os.path.join(HERE, 'autos.py'), encoding='utf-8').read(), os.path.join(HERE, 'autos.py'), 'exec'))

# Abschluss
for o in bpy.data.objects:
    if o.type == 'MESH' and any(o.name.startswith(p) for p in ('EG_Saeule', 'OG_Saeule', 'Olive', 'Tisch', 'Schirm')):
        for p in o.data.polygons:
            p.use_smooth = True
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(HERE, 'neubau.blend'), relative_remap=True)
print('gespeichert mit Moschee:', len(bpy.data.objects), 'Objekte')
