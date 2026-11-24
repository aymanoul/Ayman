# Gestaffelte Explosionsansicht (Stufen wie eine Treppe): Keller vorn unten, dann EG, OG, Dach hinten oben.
# Jede Ebene ist oben offen (ihre Decke gehoert zur naechsten Ebene) → man sieht in alle Geschosse hinein.
# Nur Standbild, aendert das Video-Modell NICHT (laedt festsaal.blend, speichert nichts).
# Aufruf (aus neubau-video/):
#   ../iqama-video/.venv-blender/bin/python blender/stufen_bild.py -- "(pos)" "(ziel)" lens out.png [breite hoehe samples versatz luecke]
import bpy, bmesh, sys, math
from mathutils import Vector

a = sys.argv[sys.argv.index('--') + 1:]
pos, ziel, lens, out = eval(a[0]), eval(a[1]), float(a[2]), a[3]
W = int(a[4]) if len(a) > 4 else 1280
H = int(a[5]) if len(a) > 5 else 720
SAMPLES = int(a[6]) if len(a) > 6 else 24
S = float(a[7]) if len(a) > 7 else 6.0        # Versatz nach vorn je Stufe (m)
G = float(a[8]) if len(a) > 8 else 2.0        # Luft zwischen den Ebenen (m)

bpy.ops.wm.open_mainfile(filepath='blender/festsaal.blend')
sc = bpy.context.scene
for m in list(sc.timeline_markers):
    sc.timeline_markers.remove(m)
sc.frame_set(int(67.3 * 30))
for o in bpy.data.objects:
    vis = o.hide_render
    if o.animation_data:
        o.animation_data_clear()
    o.hide_render = vis

def coll_objs(name):
    c = bpy.data.collections.get(name)
    return list(c.all_objects) if c else []

def bbox(o):
    bb = [o.matrix_world @ Vector(c) for c in o.bound_box]
    return [min(v[i] for v in bb) for i in range(3)], [max(v[i] for v in bb) for i in range(3)]

# ---------------------------------------------------------------- Aufraeumen
for c in ('S1_Aushub', 'Gegenueber'):
    for o in coll_objs(c):
        o.hide_render = True
for n in ('Grube_Boden', 'Saal_Decke', 'Saal_Einbaustrahler', 'Keller_Unterzuege', 'Keller_Saeulen',
          'Keller_TreppeB_Stufen', 'Keller_TreppeB_Handlauf', 'Keller_TreppeB_Pfosten'):
    if n in bpy.data.objects:
        bpy.data.objects[n].hide_render = True
# Vordere Fassade (Glas, Pfosten, Lisenen, Baender) weg → offener Blick in jede Ebene; Portale bleiben
# Obergeschoss ganz ohne Glas/Pfosten (Fokus auf Innenraum), EG ohne Front- und rechte Glaswand
for n in ('EG_Glas', 'EG_Pfosten', 'EG_Glas_rechts', 'EG_Pfosten_rechts',
          'OG_Glas', 'OG_Pfosten', 'OG_Glas_rechts', 'OG_Pfosten_rechts', 'Geschossband_rechts',
          'Fassade_Lisenen_EG', 'Fassade_Lisenen_OG',
          'Fassade_Sockel', 'LED_Geschossband', 'LED_Attika', 'Geschossband', 'Keller_Wand0', 'Keller_Wand3'):
    if n in bpy.data.objects:
        bpy.data.objects[n].hide_render = True
for n in ('Keller_TreppeA_Stufen', 'Keller_TreppeA_Handlauf', 'Keller_TreppeA_Pfosten'):
    if n in bpy.data.objects:
        bpy.data.objects[n].hide_render = False

# Kellerteil unter dem Hof (y > 12,3) abschneiden → nur das Geschoss unter dem Gebaeude wird herausgezogen
def kasten(name, x0, x1, y0, y1, z0, z1):
    me = bpy.data.meshes.new(name); bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co.x = x0 if v.co.x < 0 else x1
        v.co.y = y0 if v.co.y < 0 else y1
        v.co.z = z0 if v.co.z < 0 else z1
    bm.to_mesh(me); bm.free()
    o = bpy.data.objects.new(name, me); sc.collection.objects.link(o)
    return o

Y_HINTEN = 12.3
cut = kasten('Schnitt_Hof', -5, 25, Y_HINTEN, 60, -6, -0.31); cut.hide_render = True; cut.hide_viewport = True
KELLER_COLL = {'S2_Keller', 'Festsaal'}
keller = []
for o in list(sc.objects):
    if o.hide_render or o == cut:
        continue
    if not ({c.name for c in o.users_collection} & KELLER_COLL):
        continue
    mn, mx = bbox(o)
    if o.type == 'LIGHT':
        if o.location.y > Y_HINTEN:
            o.hide_render = True
        else:
            keller.append(o)
        continue
    if mn[1] >= Y_HINTEN - 0.05:
        o.hide_render = True
        continue
    if mx[1] > Y_HINTEN and o.type == 'MESH':
        md = o.modifiers.new('Schnitt', 'BOOLEAN'); md.operation = 'DIFFERENCE'
        md.solver = 'EXACT'; md.object = cut
    if o.name != 'Kellerdecke':
        keller.append(o)

# Keller: vordere und rechte Wand (zur Kamera hin) wegschneiden → offener Blick in den Festsaal
cut_v = kasten('Schnitt_K_vorn', -5, 25, -5, 0.95, -6, -0.31); cut_v.hide_render = True; cut_v.hide_viewport = True
cut_r = kasten('Schnitt_K_rechts', 19.35, 25, -5, 13, -6, -0.31); cut_r.hide_render = True; cut_r.hide_viewport = True
for o in keller:
    if o.type != 'MESH' or o.hide_render:
        continue
    mn, mx = bbox(o)
    for c in (cut_v, cut_r):
        cmn, cmx = bbox(c)
        if mn[0] < cmx[0] and mx[0] > cmn[0] and mn[1] < cmx[1] and mx[1] > cmn[1] and mn[2] < cmx[2] and mx[2] > cmn[2]:
            if mn[0] >= cmn[0] and mx[0] <= cmx[0] and mn[1] >= cmn[1] and mx[1] <= cmx[1]:
                o.hide_render = True
                break
            md = o.modifiers.new('Schnitt_' + c.name, 'BOOLEAN'); md.operation = 'DIFFERENCE'
            md.solver = 'EXACT'; md.object = c
# Naechste Halle gegenueber (Shed mit blauen Lichtbaendern) stoert im Vordergrund
for o in sc.objects:
    if o.name.startswith('Shedhalle_gegenueber_hinten'):
        o.hide_render = True

# ---------------------------------------------------------------- Ebenen zuordnen
FUSS = (-0.6, 20.6, -1.0, 12.6)       # Grundriss des Neubaus inkl. Portale
def im_fuss(mn, mx):
    return mn[0] >= FUSS[0] and mx[0] <= FUSS[1] and mn[1] >= FUSS[2] and mx[1] <= FUSS[3]

ebenen = {'K': set(keller), 'EG': set(), 'OG': set(), 'D': set()}
ZWANG = {'Kellerdecke': 'EG', 'Geschossdecke': 'OG', 'Dachplatte': 'D'}
for o in sc.objects:
    if o.hide_render or o in ebenen['K'] or o.type not in ('MESH', 'LIGHT', 'CURVE'):
        continue
    cols = {c.name for c in o.users_collection}
    if cols & {'Links', 'Boden', 'Grundstueck', 'Autos', 'Wohnwagen', 'Hinten', 'Hallen', 'Hochstrasse'}:
        continue
    mn, mx = bbox(o)
    if not im_fuss(mn, mx):
        continue
    if o.name in ZWANG:
        ebenen[ZWANG[o.name]].add(o); continue
    if o.name.startswith('Portal_') or o.name.startswith('Wandlicht_P') or o.name.startswith('Wandlicht_0') or o.name.startswith('Wandlicht_1'):
        ebenen['EG'].add(o); continue
    if o.name == 'Deckenleuchten':
        continue
    zc = (mn[2] + mx[2]) / 2 if o.type != 'LIGHT' else o.location.z
    if zc < -0.35:
        ebenen['K'].add(o)
    elif zc < 5.45:
        ebenen['EG'].add(o)
    elif zc < 8.65:
        ebenen['OG'].add(o)
    else:
        ebenen['D'].add(o)

# Hoehen: Keller steht auf Strassenniveau, darueber jeweils Luft G
H_K, H_EG, H_OG = 3.2 - 0.3, 5.8, 3.2     # Bauteilhoehen (Unterkante → Oberkante der offenen Ebene)
dz_K = 3.4                                 # Kellerboden −3,2 → +0,2
oben_K = -0.3 + dz_K
dz_EG = (oben_K + G) - (-0.3)              # EG-Unterkante = Kellerdecke −0,3
oben_EG = 5.5 + dz_EG
dz_OG = (oben_EG + G) - 5.5
oben_OG = 8.7 + dz_OG
dz_D = (oben_OG + G) - 8.7
VERS = {'K': (-3 * S, dz_K), 'EG': (-2 * S, dz_EG), 'OG': (-S, dz_OG), 'D': (0.0, dz_D)}
print('Versatz:', {k: (round(v[0], 1), round(v[1], 1)) for k, v in VERS.items()})

for k, obs in ebenen.items():
    dy, dz = VERS[k]
    for o in obs:
        if o.parent and o.parent in obs:
            continue
        o.location.y += dy; o.location.z += dz

# Deckenleuchten: untere Reihe (EG-Decke) haengt an der OG-Ebene, obere Reihe (OG-Decke) am Dach
dl = bpy.data.objects.get('Deckenleuchten')
if dl:
    me = dl.data.copy(); dl.data = me
    mw = dl.matrix_world; inv = mw.inverted()
    for v in me.vertices:
        w = mw @ v.co
        dy, dz = VERS['OG'] if w.z < 7.0 else VERS['D']
        w.y += dy; w.z += dz; v.co = inv @ w

# ---------------------------------------------------------------- Baufeld markieren (Grube, wo das Gebaeude stand)
def mat(name, farbe, rau, metall=0.0):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*farbe, 1); b.inputs['Roughness'].default_value = rau
    b.inputs['Metallic'].default_value = metall
    return m
BETON = mat('Beton_Stufen', (0.40, 0.39, 0.37), 0.8)
bf = kasten('Baufeld_Bodenplatte', 0.0, 20.0, 0.1, 12.3, -0.05, 0.03); bf.data.materials.append(BETON)

# ---------------------------------------------------------------- Licht: warme Abendsonne
son = bpy.data.objects.get('Sonne')
if son:
    HOEHE = math.radians(18)
    rich = Vector((-0.55, -0.83, 0)).normalized()
    zur = Vector((rich.x * math.cos(HOEHE), rich.y * math.cos(HOEHE), math.sin(HOEHE)))
    son.rotation_euler = (-zur).to_track_quat('-Z', 'Y').to_euler()
    son.data.color = (1.0, 0.80, 0.58); son.data.energy = 4.2
    for nd in sc.world.node_tree.nodes:
        if nd.type == 'TEX_SKY':
            for attr, val in (('sun_elevation', HOEHE), ('sun_rotation', math.atan2(zur.x, zur.y))):
                if hasattr(nd, attr): setattr(nd, attr, val)
            if hasattr(nd, 'sun_direction'): nd.sun_direction = zur

# ---------------------------------------------------------------- Kamera + Rendern
cd = bpy.data.cameras.new('C'); cd.lens = lens; cd.clip_end = 3000
cam = bpy.data.objects.new('C', cd); sc.collection.objects.link(cam); sc.camera = cam
cam.location = pos
cam.rotation_euler = (Vector(ziel) - Vector(pos)).to_track_quat('-Z', 'Y').to_euler()
sc.render.engine = 'CYCLES'; sc.cycles.samples = SAMPLES; sc.cycles.use_denoising = True
sc.render.resolution_x, sc.render.resolution_y, sc.render.resolution_percentage = W, H, 100
sc.render.filepath = out
bpy.ops.render.render(write_still=True)
