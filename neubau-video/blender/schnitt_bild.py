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

# Schnitt-Bereich: zwischen den beiden Portalen, vor y = Y_CUT
X0, X1, Y_CUT = 2.95, 17.05, 1.2
Y_GRUBE = -6.3          # Vorderkante der Grube (in der Gasse)
Z_GRUBE = -3.5          # Grubensohle

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

cut_bau = schneider('Schnitt_Bau', X0, X1, -20, Y_CUT, -3.17, 40)
cut_boden = schneider('Schnitt_Boden', X0, X1, Y_GRUBE, Y_CUT, -3.6, 2.0)

def bbox(o):
    bb = [o.matrix_world @ Vector(c) for c in o.bound_box]
    return [min(v[i] for v in bb) for i in range(3)], [max(v[i] for v in bb) for i in range(3)]

def schneidet(o, x0, x1, y0, y1, z0, z1):
    mn, mx = bbox(o)
    return mn[0] < x1 and mx[0] > x0 and mn[1] < y1 and mx[1] > y0 and mn[2] < z1 and mx[2] > z0

BAU_COLL = {'S2_Keller', 'S3_EG', 'S4_OG', 'S5_Dach', 'Innen', 'Festsaal', 'Grundstueck'}
BODEN_COLL = {'Boden'}
for o in list(sc.objects):
    if o.type != 'MESH' or o.hide_render or o.name.startswith('Schnitt_'):
        continue
    if o.name.startswith('Portal_'):
        continue
    cols = {c.name for c in o.users_collection}
    # Objekte komplett vor der Schnittkante → weg
    mn, mx = bbox(o)
    if cols & BAU_COLL and schneidet(o, X0, X1, -20, Y_CUT, -3.17, 40):
        if mx[1] <= Y_CUT + 0.05 and mn[0] >= X0 - 0.05 and mx[0] <= X1 + 0.05:
            o.hide_render = True
            continue
        md = o.modifiers.new('Schnitt', 'BOOLEAN'); md.operation = 'DIFFERENCE'
        md.solver = 'EXACT'; md.object = cut_bau
        try: md.use_hole_tolerant = True
        except Exception: pass
    elif cols & BODEN_COLL and schneidet(o, X0, X1, Y_GRUBE, Y_CUT, -3.6, 2.0):
        md = o.modifiers.new('Schnitt', 'BOOLEAN'); md.operation = 'DIFFERENCE'
        md.solver = 'EXACT'; md.object = cut_boden
        try: md.use_hole_tolerant = True
        except Exception: pass

# Erdreich der Grube (Waende + Sohle)
def mat_erde():
    m = bpy.data.materials.new('Erde_Schnitt'); m.use_nodes = True
    nt = m.node_tree; b = nt.nodes['Principled BSDF']
    tex = nt.nodes.new('ShaderNodeTexNoise'); tex.inputs['Scale'].default_value = 6.0
    tex.inputs['Detail'].default_value = 12.0
    ramp = nt.nodes.new('ShaderNodeValToRGB')
    ramp.color_ramp.elements[0].color = (0.16, 0.10, 0.06, 1)
    ramp.color_ramp.elements[1].color = (0.36, 0.25, 0.16, 1)
    nt.links.new(tex.outputs['Fac'], ramp.inputs['Fac'])
    nt.links.new(ramp.outputs['Color'], b.inputs['Base Color'])
    b.inputs['Roughness'].default_value = 0.95
    bump = nt.nodes.new('ShaderNodeBump'); bump.inputs['Strength'].default_value = 0.6
    nt.links.new(tex.outputs['Fac'], bump.inputs['Height'])
    nt.links.new(bump.outputs['Normal'], b.inputs['Normal'])
    return m

def mat_beton():
    m = bpy.data.materials.new('Beton_Schnitt'); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (0.55, 0.54, 0.51, 1)
    b.inputs['Roughness'].default_value = 0.85
    return m

ERDE, BETON = mat_erde(), mat_beton()

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

D = 0.4
# Erdwaende links/rechts/vorne, leicht unterhalb der Oberkante, damit Pflaster sauber abschliesst
quader('Grube_Erde_links', X0 - D, X0, Y_GRUBE - D, Y_CUT, Z_GRUBE, -0.02, ERDE)
quader('Grube_Erde_rechts', X1, X1 + D, Y_GRUBE - D, Y_CUT, Z_GRUBE, -0.02, ERDE)
quader('Grube_Erde_vorn', X0 - D, X1 + D, Y_GRUBE - D, Y_GRUBE, Z_GRUBE, -0.02, ERDE)
quader('Grube_Sohle', X0, X1, Y_GRUBE, Y_CUT, Z_GRUBE - 0.2, Z_GRUBE, ERDE)
# Schnittkante der Bodenplatte/Fundament sichtbar (Beton)
quader('Schnitt_Fundament', X0, X1, 0.1, 0.6, -3.5, -3.17, BETON)

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
