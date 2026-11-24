# Schnittansicht (Split-View) fuer ein Standbild – Vorlage fuer spaetere Higgsfield-Ueberarbeitung.
# Aufruf (aus neubau-video/):
#   ../iqama-video/.venv-blender/bin/python blender/schnitt_bild.py -- "(pos)" "(ziel)" lens out.png [breite hoehe samples dach_hoch]
import bpy, bmesh, sys, math
from mathutils import Vector

a = sys.argv[sys.argv.index('--') + 1:]
pos, ziel, lens, out = eval(a[0]), eval(a[1]), float(a[2]), a[3]
W = int(a[4]) if len(a) > 4 else 1280
H = int(a[5]) if len(a) > 5 else 720
SAMPLES = int(a[6]) if len(a) > 6 else 24
DACH_HOCH = float(a[7]) if len(a) > 7 else 3.5

bpy.ops.wm.open_mainfile(filepath='blender/festsaal.blend')
sc = bpy.context.scene
for m in list(sc.timeline_markers):
    sc.timeline_markers.remove(m)
sc.frame_set(int(67.3 * 30))

# Animationen einfrieren, damit Verschieben/Verstecken nicht ueberschrieben wird
for o in bpy.data.objects:
    vis = o.hide_render
    loc = o.matrix_world.copy()
    if o.animation_data:
        o.animation_data_clear()
    o.hide_render = vis

def coll_objs(name):
    c = bpy.data.collections.get(name)
    return list(c.all_objects) if c else []

# Baugruben-Hilfsobjekte (Verbau, Gelaender) weg
for o in coll_objs('S1_Aushub'):
    o.hide_render = True
GEG_X = float(a[8]) if len(a) > 8 else 999
for o in coll_objs('Gegenueber'):
    if max((o.matrix_world @ Vector(c)).x for c in o.bound_box) > GEG_X:
        o.hide_render = True
for n in ('Portal_Kuebel0', 'Portal_Zypresse0', 'Portal_Kuebel1_L', 'Portal_Zypresse1_L', 'Gully_0'):
    if n in bpy.data.objects:
        bpy.data.objects[n].hide_render = True

# ---------------------------------------------------------------- Schnitt / Gelaendeaufschnitt
# Gebaeude: komplette Front zwischen den Aussenwaenden (x 0,3–19,7) bis y = Y_CUT aufgeschnitten.
# Gelaende: Baugrube ueber die ganze Gebaeudebreite vor der Fassade, bis unter das Fundament.
BX0, BX1, Y_CUT = 0.3, 19.7, 1.2        # Schnitt im Gebaeude
GX0, GX1 = -0.3, 20.3                   # Grube (links Altbau ab x -0,4, rechts Parkplatz)
Y_GRUBE = -6.3                          # Vorderkante der Grube (in der Gasse)
Z_GRUBE = -4.1                          # Grubensohle (unter Streifenfundament)

for n in ('Portal_Kuebel0', 'Portal_Zypresse0', 'Portal_Kuebel1', 'Portal_Zypresse1',
          'Portal_Kuebel0_L', 'Portal_Zypresse0_L', 'Portal_Kuebel1_L', 'Portal_Zypresse1_L'):
    if n in bpy.data.objects:
        bpy.data.objects[n].hide_render = True
# Kellertreppe vorn rechts sichtbar machen (Zugang zum Keller)
for n in ('Keller_TreppeA_Stufen', 'Keller_TreppeA_Handlauf', 'Keller_TreppeA_Pfosten'):
    if n in bpy.data.objects:
        bpy.data.objects[n].hide_render = False

def schneider(name, x0, x1, y0, y1, z0, z1):
    me = bpy.data.meshes.new(name)
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co.x = x0 if v.co.x < 0 else x1
        v.co.y = y0 if v.co.y < 0 else y1
        v.co.z = z0 if v.co.z < 0 else z1
    bm.to_mesh(me); bm.free()
    o = bpy.data.objects.new(name, me)
    sc.collection.objects.link(o)
    o.hide_render = True; o.hide_viewport = True
    return o

cut_bau = schneider('Schnitt_Bau', BX0, BX1, -20, Y_CUT, -3.17, 40)
cut_boden = schneider('Schnitt_Boden', GX0, GX1, Y_GRUBE, 0.3, -6.0, 2.0)

def bbox(o):
    bb = [o.matrix_world @ Vector(c) for c in o.bound_box]
    return [min(v[i] for v in bb) for i in range(3)], [max(v[i] for v in bb) for i in range(3)]

def schneidet(o, x0, x1, y0, y1, z0, z1):
    mn, mx = bbox(o)
    return mn[0] < x1 and mx[0] > x0 and mn[1] < y1 and mx[1] > y0 and mn[2] < z1 and mx[2] > z0

def bool_mod(o, cutter):
    md = o.modifiers.new('Schnitt', 'BOOLEAN'); md.operation = 'DIFFERENCE'
    md.solver = 'EXACT'; md.object = cutter
    try: md.use_hole_tolerant = True
    except Exception: pass

def loch_in_flaeche(o, x0, x1, y0, y1):
    """Flache Bodenbelaege (Pflaster, Gasse, Gelaende) entlang der Grubenkanten schneiden, Inneres loeschen."""
    me = o.data.copy(); o.data = me
    mw = o.matrix_world; inv = mw.inverted()
    bm = bmesh.new(); bm.from_mesh(me)
    for v in bm.verts:
        v.co = mw @ v.co
    for co, no in (((x0, 0, 0), (1, 0, 0)), ((x1, 0, 0), (1, 0, 0)), ((0, y0, 0), (0, 1, 0)), ((0, y1, 0), (0, 1, 0))):
        geom = bm.verts[:] + bm.edges[:] + bm.faces[:]
        bmesh.ops.bisect_plane(bm, geom=geom, plane_co=co, plane_no=no)
    weg = [f for f in bm.faces if x0 < f.calc_center_median().x < x1 and y0 < f.calc_center_median().y < y1]
    bmesh.ops.delete(bm, geom=weg, context='FACES')
    for v in bm.verts:
        v.co = inv @ v.co
    bm.to_mesh(me); bm.free()

BAU_COLL = {'S2_Keller', 'S3_EG', 'S4_OG', 'S5_Dach', 'Innen', 'Festsaal', 'Grundstueck'}
BODEN_COLL = {'Boden'}
for o in list(sc.objects):
    if o.type != 'MESH' or o.hide_render or o.name.startswith(('Schnitt_', 'Portal_')):
        continue
    cols = {c.name for c in o.users_collection}
    mn, mx = bbox(o)
    if cols & BAU_COLL and schneidet(o, BX0, BX1, -20, Y_CUT, -3.17, 40):
        if mx[1] <= Y_CUT + 0.05 and mn[0] >= BX0 - 0.05 and mx[0] <= BX1 + 0.05:
            o.hide_render = True          # liegt ganz vor der Schnittkante (Glasfront, Lisenen …)
            continue
        bool_mod(o, cut_bau)
    if cols & (BODEN_COLL | {'Grundstueck'}) and schneidet(o, GX0, GX1, Y_GRUBE, 0.3, -6.0, 2.0):
        if mx[2] - mn[2] < 0.3:
            loch_in_flaeche(o, GX0, GX1, Y_GRUBE, 0.3)   # flache Belaege: sauber ausschneiden
        else:
            bool_mod(o, cut_boden)

# ---------------------------------------------------------------- Materialien
def mat_erde():
    """Erdreich mit Schichten: Mutterboden, Lehm, Kies/Sand, steiniger Untergrund."""
    m = bpy.data.materials.new('Erde_Schichten'); m.use_nodes = True
    nt = m.node_tree; b = nt.nodes['Principled BSDF']; L = nt.links.new
    geo = nt.nodes.new('ShaderNodeNewGeometry')
    sep = nt.nodes.new('ShaderNodeSeparateXYZ'); L(geo.outputs['Position'], sep.inputs[0])
    n1 = nt.nodes.new('ShaderNodeTexNoise'); n1.inputs['Scale'].default_value = 0.9; n1.inputs['Detail'].default_value = 4
    L(geo.outputs['Position'], n1.inputs['Vector'])
    st = nt.nodes.new('ShaderNodeMath'); st.operation = 'MULTIPLY_ADD'
    L(n1.outputs['Fac'], st.inputs[0]); st.inputs[1].default_value = 0.35; L(sep.outputs['Z'], st.inputs[2])
    # z (0 … -4,1) → 0 … 1
    mr = nt.nodes.new('ShaderNodeMapRange'); mr.inputs['From Min'].default_value = 0.2
    mr.inputs['From Max'].default_value = -4.3; L(st.outputs['Value'], mr.inputs['Value'])
    ramp = nt.nodes.new('ShaderNodeValToRGB'); cr = ramp.color_ramp; cr.interpolation = 'EASE'
    farben = [(0.00, (0.045, 0.028, 0.016)), (0.09, (0.055, 0.034, 0.02)), (0.14, (0.17, 0.095, 0.045)),
              (0.40, (0.20, 0.115, 0.055)), (0.48, (0.33, 0.25, 0.15)), (0.68, (0.36, 0.28, 0.17)),
              (0.76, (0.17, 0.15, 0.13)), (1.00, (0.12, 0.11, 0.10))]
    cr.elements[0].position, cr.elements[0].color = farben[0][0], (*farben[0][1], 1)
    cr.elements[1].position, cr.elements[1].color = farben[-1][0], (*farben[-1][1], 1)
    for pos_, col in farben[1:-1]:
        e = cr.elements.new(pos_); e.color = (*col, 1)
    L(mr.outputs['Result'], ramp.inputs['Fac'])
    # Koernung / Steine
    vor = nt.nodes.new('ShaderNodeTexVoronoi'); vor.inputs['Scale'].default_value = 9.0
    L(geo.outputs['Position'], vor.inputs['Vector'])
    n2 = nt.nodes.new('ShaderNodeTexNoise'); n2.inputs['Scale'].default_value = 25; n2.inputs['Detail'].default_value = 10
    L(geo.outputs['Position'], n2.inputs['Vector'])
    mix = nt.nodes.new('ShaderNodeMix'); mix.data_type = 'RGBA'; mix.blend_type = 'MULTIPLY'
    mix.inputs['Factor'].default_value = 0.3
    L(ramp.outputs['Color'], mix.inputs[6]); L(n2.outputs['Color'], mix.inputs[7])
    L(mix.outputs[2], b.inputs['Base Color'])
    b.inputs['Roughness'].default_value = 0.97
    add = nt.nodes.new('ShaderNodeMath'); add.operation = 'ADD'
    L(vor.outputs['Distance'], add.inputs[0]); L(n2.outputs['Fac'], add.inputs[1])
    bump = nt.nodes.new('ShaderNodeBump'); bump.inputs['Strength'].default_value = 0.8
    bump.inputs['Distance'].default_value = 0.05
    L(add.outputs['Value'], bump.inputs['Height']); L(bump.outputs['Normal'], b.inputs['Normal'])
    return m

def mat_einfach(name, farbe, rau, metall=0.0):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*farbe, 1)
    b.inputs['Roughness'].default_value = rau
    b.inputs['Metallic'].default_value = metall
    return m

def mat_beton():
    m = mat_einfach('Beton_Schnitt', (0.45, 0.44, 0.42), 0.8)
    nt = m.node_tree; b = nt.nodes['Principled BSDF']
    n = nt.nodes.new('ShaderNodeTexNoise'); n.inputs['Scale'].default_value = 18; n.inputs['Detail'].default_value = 8
    r = nt.nodes.new('ShaderNodeValToRGB')
    r.color_ramp.elements[0].color = (0.36, 0.35, 0.33, 1); r.color_ramp.elements[1].color = (0.50, 0.49, 0.46, 1)
    nt.links.new(n.outputs['Fac'], r.inputs['Fac']); nt.links.new(r.outputs['Color'], b.inputs['Base Color'])
    return m

def mat_glas():
    m = bpy.data.materials.new('Gelaender_Glas'); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (0.85, 0.93, 0.95, 1)
    b.inputs['Roughness'].default_value = 0.02
    b.inputs['Transmission Weight'].default_value = 1.0
    b.inputs['IOR'].default_value = 1.5
    return m

ERDE, BETON = mat_erde(), mat_beton()
KIES = mat_einfach('Kies_Sauberkeit', (0.42, 0.40, 0.37), 0.95)
GLAS, EDELSTAHL = mat_glas(), mat_einfach('Edelstahl', (0.78, 0.78, 0.78), 0.25, 1.0)

def quader(name, x0, x1, y0, y1, z0, z1, mat):
    me = bpy.data.meshes.new(name); bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co.x = x0 if v.co.x < 0 else x1
        v.co.y = y0 if v.co.y < 0 else y1
        v.co.z = z0 if v.co.z < 0 else z1
    bm.to_mesh(me); bm.free()
    o = bpy.data.objects.new(name, me); sc.collection.objects.link(o)
    o.data.materials.append(mat)
    return o

# ---------------------------------------------------------------- Baugrube
D = 0.6
quader('Grube_Erde_links', GX0 - D, GX0, Y_GRUBE - D, 0.3, Z_GRUBE - 0.3, -0.03, ERDE)
quader('Grube_Erde_rechts', GX1, GX1 + D, Y_GRUBE - D, 0.3, Z_GRUBE - 0.3, -0.03, ERDE)
quader('Grube_Erde_vorn', GX0 - D, GX1 + D, Y_GRUBE - D, Y_GRUBE, Z_GRUBE - 0.3, -0.03, ERDE)
SOHLE = mat_einfach('Grubensohle', (0.06, 0.045, 0.035), 0.98)
quader('Grube_Sohle', GX0, GX1, Y_GRUBE, 0.9, Z_GRUBE - 0.3, Z_GRUBE, SOHLE)
quader('Grube_Kiesbett', GX0 + 0.3, GX1 - 0.3, -1.2, 0.9, Z_GRUBE, Z_GRUBE + 0.08, KIES)

# ---------------------------------------------------------------- Fundamente / Tragwerk im Schnitt
# Streifenfundament unter der Kelleraussenwand + Bodenplatte (Schnittkante)
quader('Schnitt_Streifenfundament', -0.1, 20.1, -0.25, 0.95, Z_GRUBE + 0.08, -3.5, BETON)
quader('Schnitt_Bodenplatte', 0.0, 20.0, 0.1, Y_CUT, -3.5, -3.2, BETON)
# Portale stehen auf Kellerstuetzen (Pfeiler setzen sich im Keller fort) + Auflagerbalken
for x0, x1 in ((0.0, 0.4), (2.4, 2.9), (17.1, 17.5), (19.5, 20.0)):
    quader(f'Schnitt_Portalstuetze_{x0:.1f}', x0, x1, -0.3, 0.9, -3.5, -0.35, BETON)
for x0, x1 in ((0.0, 2.9), (17.1, 20.0)):
    quader(f'Schnitt_Portalbalken_{x0:.1f}', x0, x1, -0.65, 0.9, -0.35, 0.0, BETON)
# Kellerdecke / Geschossdecke als klare Schnittbaender (Beton)
quader('Schnitt_Kellerdecke_Kante', BX0, BX1, Y_CUT - 0.02, Y_CUT + 0.01, -0.3, 0.2, BETON)
quader('Schnitt_Geschossdecke_Kante', BX0, BX1, Y_CUT - 0.02, Y_CUT + 0.01, 5.5, 5.9, BETON)

# ---------------------------------------------------------------- Glasgelaender an den offenen Geschosskanten
for name, z in (('EG', 0.2), ('OG', 5.9)):
    quader(f'Gelaender_{name}_Glas', BX0, BX1, Y_CUT - 0.10, Y_CUT - 0.08, z + 0.05, z + 1.0, GLAS)
    quader(f'Gelaender_{name}_Handlauf', BX0, BX1, Y_CUT - 0.13, Y_CUT - 0.05, z + 1.0, z + 1.05, EDELSTAHL)
    quader(f'Gelaender_{name}_Schiene', BX0, BX1, Y_CUT - 0.12, Y_CUT - 0.06, z, z + 0.06, EDELSTAHL)

# ---------------------------------------------------------------- Warme Architekturbeleuchtung
son = bpy.data.objects.get('Sonne')
if son:
    HOEHE = math.radians(16)
    rich = Vector((-0.55, -0.83, 0)).normalized()
    zur = Vector((rich.x * math.cos(HOEHE), rich.y * math.cos(HOEHE), math.sin(HOEHE)))
    son.rotation_euler = (-zur).to_track_quat('-Z', 'Y').to_euler()
    son.data.color = (1.0, 0.78, 0.55); son.data.energy = 4.2
    for nd in sc.world.node_tree.nodes:
        if nd.type == 'TEX_SKY':
            for attr, val in (('sun_elevation', HOEHE), ('sun_rotation', math.atan2(zur.x, zur.y))):
                if hasattr(nd, attr): setattr(nd, attr, val)
            if hasattr(nd, 'sun_direction'): nd.sun_direction = zur
# Aufhellung der Baugrube (wie Baustellen-/Architekturlicht), warm
ld = bpy.data.lights.new('Grube_Licht', 'AREA'); ld.shape = 'RECTANGLE'
ld.size, ld.size_y = 22.0, 4.0; ld.energy = 700; ld.color = (1.0, 0.82, 0.62)
lo = bpy.data.objects.new('Grube_Licht', ld); sc.collection.objects.link(lo)
lo.location = (10.0, -6.0, 3.0)
lo.rotation_euler = (Vector((10.0, 0.5, -3.0)) - lo.location).to_track_quat('-Z', 'Y').to_euler()
lo.visible_camera = False
# Erdwaende seitlich anstrahlen
for nm, x, zx in (('Grube_Licht_L', 3.0, -1.0), ('Grube_Licht_R', 17.0, 21.5)):
    l2 = bpy.data.lights.new(nm, 'AREA'); l2.size = 4.0; l2.energy = 900; l2.color = (1.0, 0.8, 0.6)
    o2 = bpy.data.objects.new(nm, l2); sc.collection.objects.link(o2)
    o2.location = (x, -3.0, -0.5)
    o2.rotation_euler = (Vector((zx, -3.0, -2.5)) - o2.location).to_track_quat('-Z', 'Y').to_euler()
    o2.visible_camera = False

# Dach (inkl. PV und Gruendach) anheben → Split-Ansicht
if DACH_HOCH > 0:
    for o in coll_objs('S5_Dach'):
        o.location.z += DACH_HOCH
    for o in sc.objects:
        if o.name.startswith(('PV_', 'Gruendach', 'Dach')) and o not in coll_objs('S5_Dach'):
            mn, mx = bbox(o)
            if mn[2] > 8.5 and mn[0] > -0.5 and mx[0] < 20.5 and mx[1] < 12.6:
                o.location.z += DACH_HOCH
    # Deckenleuchten des OG haengen an der Dachplatte → mit anheben
    dl = bpy.data.objects.get('Deckenleuchten')
    if dl:
        me = dl.data.copy(); dl.data = me
        mw = dl.matrix_world; inv = mw.inverted()
        for v in me.vertices:
            w = mw @ v.co
            if w.z > 7.5:
                w.z += DACH_HOCH; v.co = inv @ w

# Licht: Abendstimmung mit Innenbeleuchtung (wie im Video), Saal-Lichter an
cd = bpy.data.cameras.new('C'); cd.lens = lens
cam = bpy.data.objects.new('C', cd); sc.collection.objects.link(cam); sc.camera = cam
cam.location = pos
cam.rotation_euler = (Vector(ziel) - Vector(pos)).to_track_quat('-Z', 'Y').to_euler()
cd.clip_end = 2000
sc.render.engine = 'CYCLES'; sc.cycles.samples = SAMPLES; sc.cycles.use_denoising = True
sc.render.resolution_x, sc.render.resolution_y, sc.render.resolution_percentage = W, H, 100
sc.render.filepath = out
bpy.ops.render.render(write_still=True)
