#!/usr/bin/env python3
"""Drehort für „Jeder Schritt zählt“: Gebäude außen (ohne Autos, später Nachmittag) + Hauptpersonen A und B.

Wird von storyboard.py / film.py importiert:  S = szene.aufbauen()  → dict mit Skeletten, Handy, Helfern.
Baut auf gebet-video/blender (gebaeude.blend, figuren.blend, figuren.py) auf – dort wird nichts verändert.

Achsen wie in gebaeude.py: Fassade bei y = 0, Vorplatz in −Y, Haupteingang bei x = 0. Gehweg entlang der Straße bei
y ≈ −15, Hof = Vorplatz zwischen Gehweg und Tür. Figur: Ruhe-Blick nach −Y; rot_z = 90° → schaut nach +X, 180° → zur Tür (+Y).
"""
import math
import os
import sys
import bpy            # zuerst bpy, danach bmesh/mathutils
import bmesh
import numpy as np
from mathutils import Matrix, Vector

HERE = os.path.dirname(os.path.abspath(__file__))
GV = os.path.join(HERE, '..', '..', 'gebet-video', 'blender')
sys.path.insert(0, GV)
import raum as R          # noqa: E402  (Grundfunktionen)
import figuren as FG      # noqa: E402  (pose, reset_pose)

TEX = os.path.join(HERE, 'tex')
os.makedirs(TEX, exist_ok=True)
GOLD, WEISS, NAVY = '#CA9E4E', '#F7F3EA', '#212242'
GEHWEG_Y = -15.0


# ------------------------------------------------------------------ Geh-Zyklus und Posen
def geh_pose(phase, amp=1.0, arme=True):
    """Pose eines Schritts. phase in Schritten (0..1 = linker Schritt, 1..2 = rechter Schritt)."""
    a = math.sin(phase * math.pi)                           # +1 linkes Bein vorn, −1 rechtes Bein vorn
    kl = max(0.0, -math.sin(phase * math.pi + 0.6))        # Knie beugt beim Zurückschwingen
    kr = max(0.0, math.sin(phase * math.pi + 0.6))
    p = {
        'Oberschenkel.L': (-22 * a * amp, 0, 0), 'Oberschenkel.R': (22 * a * amp, 0, 0),
        'Unterschenkel.L': (28 * kl * amp + 4, 0, 0), 'Unterschenkel.R': (28 * kr * amp + 4, 0, 0),
        'Fuss.L': (-6 * a * amp, 0, 0), 'Fuss.R': (6 * a * amp, 0, 0),
        'Bauch': (2, 0, -3 * a * amp), 'Brust': (2, 0, 4 * a * amp),
    }
    if arme:
        p.update({'Oberarm.L': (16 * a * amp, 0, 0), 'Oberarm.R': (-16 * a * amp, 0, 0),
                  'Unterarm.L': (-12 - 6 * max(a, 0), 0, 0), 'Unterarm.R': (-12 - 6 * max(-a, 0), 0, 0)})
    return p


def huepf(phase):
    """Leichtes Auf und Ab beim Gehen (Meter)."""
    return 0.012 * abs(math.cos(phase * math.pi))


HANDY_HALTEN = {'Oberarm.R': (-28, 0, -8), 'Unterarm.R': (-78, 0, 0), 'Hand.R': (-12, 0, 0), 'Hals': (10, 0, 0), 'Kopf': (14, 0, 0)}
HANDY_HALTEN_GEHEN = {'Oberarm.R': (-24, 0, -8), 'Unterarm.R': (-74, 0, 0), 'Hand.R': (-12, 0, 0), 'Hals': (8, 0, 0), 'Kopf': (12, 0, 0)}
AUF_FUESSE = {'Hals': (16, 0, 0), 'Kopf': (22, 0, 0), 'Brust': (4, 0, 0)}
ERKLAEREN = {'Oberarm.R': (-30, 0, -10), 'Unterarm.R': (-55, 0, 0), 'Hand.R': (0, 0, 0), 'Kopf': (0, 0, 8)}


def stell(arm, *posen, loc=None, rot_z=None):
    """Pose zusammensetzen (spätere überschreiben frühere) und Figur platzieren."""
    FG.reset_pose(arm)
    p = {}
    for x in posen:
        p.update(x)
    FG.pose(arm, p)
    if loc is not None:
        arm.location = loc
    if rot_z is not None:
        arm.rotation_euler = (0, 0, math.radians(rot_z))
    bpy.context.view_layer.update()


# ------------------------------------------------------------------ Bausteine
def figur_holen(key):
    with bpy.data.libraries.load(os.path.join(GV, 'figuren.blend'), link=False) as (src, dst):
        dst.collections = [key]
    c = dst.collections[0]
    bpy.context.scene.collection.children.link(c)
    return bpy.data.objects[key + '_Skelett']


def handy(arm, coll, screen_img=None):
    """Handy in der rechten Hand (am Knochen Hand.R). Display als Bild (eigenes Design)."""
    gehaeuse = R.material('Handy_Gehaeuse', '#1b1c20', 0.35, 0.4)
    ob = R.box('Handy', -0.036, 0.036, -0.0045, 0.0045, -0.076, 0.076, gehaeuse, coll)
    md = ob.modifiers.new('Rundung', 'BEVEL'); md.width = 0.008; md.segments = 4
    if screen_img is None:
        screen_img = bpy.data.images.new('Handy_Display', 4, 8)
    m = R.image_material('Handy_Display', screen_img, 0.2, emit_strength=1.2)
    disp = R.image_plane('Handy_Display', [(-0.032, -0.0047, -0.07), (0.032, -0.0047, -0.07), (0.032, -0.0047, 0.07), (-0.032, -0.0047, 0.07)], m, coll)
    disp.parent = ob
    ob.parent = arm
    ob.parent_type = 'BONE'
    ob.parent_bone = 'Hand.R'
    # relativ zum Knochenende (Fingerspitze): zurück zur Handfläche, vor die Handinnenseite, Display zum Gesicht
    ob.location = (0.03, -0.075, 0.0)
    ob.rotation_euler = (math.radians(90), math.radians(0), math.radians(90))
    return ob


def fussabdruck_mesh():
    """Schlichte Sohlenform (Ballen + Ferse, verbunden), 26 cm lang – keine Zehenpunkte, nichts Gesichtsähnliches."""
    pts = []
    for t in np.linspace(0, 2 * math.pi, 40, endpoint=False):
        y = 0.13 * math.sin(t)                               # −0,13 Ferse … +0,13 Spitze
        w = 0.048 if y > 0.02 else (0.036 if y < -0.06 else 0.03 + 0.12 * (y + 0.06))
        x = w * math.cos(t) * (1.0 if y > -0.02 else 0.9)
        pts.append((x + 0.012 * max(y, 0) / 0.13, y, 0.0))
    me = bpy.data.meshes.new('Fussabdruck')
    me.from_pydata(pts, [], [tuple(range(len(pts)))])
    return me


def fussspur(coll, start, ende, n, seite_abstand=0.11, erster='L'):
    """n Abdrücke auf der Linie start→ende, abwechselnd links/rechts. Gibt [(Objekt, Material)] zurück, in Reihenfolge."""
    me = fussabdruck_mesh()
    a, b = Vector(start), Vector(ende)
    d = (b - a).normalized()
    q = Vector((-d.y, d.x, 0))
    out = []
    for i in range(n):
        p = a + (b - a) * (i / max(n - 1, 1))
        links = (i % 2 == 0) == (erster == 'L')
        p = p + q * (seite_abstand if links else -seite_abstand)
        farbe = GOLD if i % 2 == 0 else WEISS                 # gold = Sünde getilgt, weiß = Rangstufe erhöht
        m = R.material(f'Abdruck_{i:02d}', farbe, 0.4, emit=farbe, emit_strength=0.0)
        ob = bpy.data.objects.new(f'Abdruck_{i:02d}', me)
        ob.data = me.copy(); ob.data.materials.append(m)
        ob.location = (p.x, p.y, 0.012)
        ob.rotation_euler = (0, 0, math.atan2(d.y, d.x) - math.pi / 2)
        coll.objects.link(ob)
        out.append((ob, m))
    return out


def abdruck_leuchten(spur, stark):
    """stark: Liste 0..1 je Abdruck (0 = unsichtbar)."""
    for (ob, m), s in zip(spur, stark):
        ob.hide_render = s <= 0.001
        b = m.node_tree.nodes['Principled BSDF']
        b.inputs['Emission Strength'].default_value = 6.0 * s
        b.inputs['Alpha'].default_value = min(1.0, s * 1.5)


def wege(coll):
    """Fünf leuchtende Wege aus fünf Richtungen zur Moschee (für die Draufsicht S9)."""
    out = []
    ziel = Vector((0, -1.5, 0))
    for k, ang in enumerate([200, 235, 270, 305, 340]):     # Richtungen (Grad, 270 = genau von vorn)
        a = math.radians(ang)
        start = ziel + Vector((math.cos(a), math.sin(a), 0)) * 34
        mid = ziel + Vector((math.cos(a), math.sin(a), 0)) * 14 + Vector((3.0 * math.sin(k * 1.7), 0, 0))
        cu = bpy.data.curves.new(f'Weg_{k + 1}', 'CURVE'); cu.dimensions = '3D'
        cu.bevel_depth = 0.25; cu.bevel_resolution = 2
        sp = cu.splines.new('BEZIER'); sp.bezier_points.add(2)
        for p, co in zip(sp.bezier_points, [start, mid, ziel]):
            p.co = (co.x, co.y, 0.05); p.handle_left_type = p.handle_right_type = 'AUTO'
        ob = bpy.data.objects.new(f'Weg_{k + 1}', cu)
        m = R.material(f'Weg_{k + 1}', GOLD, 0.4, emit=GOLD, emit_strength=4.0)
        ob.data.materials.append(m)
        ob.scale = (1, 1, 0.15)
        coll.objects.link(ob)
        out.append((ob, m, start))
    return out


def vordach(coll):
    """Schlichtes Vordach über dem Haupteingang (über dem Schild), mit zwei dünnen Stützen."""
    m = R.material('Vordach', '#e9e4d8', 0.6)
    rand = R.material('Vordach_Rand', '#33373d', 0.5, 0.3)
    R.box('Vordach_Platte', -1.9, 1.9, -2.6, -0.7, 3.7, 3.82, m, coll)
    R.box('Vordach_Rand', -1.92, 1.92, -2.62, -2.56, 3.66, 3.86, rand, coll)
    for s in (-1, 1):
        R.cylinder(f'Vordach_Stuetze_{s}', 0.045, 3.7, (s * 1.75, -2.45, 1.85), rand, coll, seg=12)


def licht_nachmittag(scene):
    sun = bpy.data.objects.get('Sonne')
    sun.data.energy = 3.6
    sun.data.color = (1.0, 0.80, 0.58)
    sun.data.angle = math.radians(1.5)
    sun.rotation_euler = Vector((0.62, 0.55, -0.32)).to_track_quat('-Z', 'Y').to_euler()   # tief von links vorn → lange Schatten
    nt = scene.world.node_tree
    nt.nodes['Background'].inputs['Strength'].default_value = 0.7
    ramp = [n for n in nt.nodes if n.type == 'VALTORGB'][0].color_ramp
    ramp.elements[0].color = (*R.lin(R.rgb('#e9cfae')), 1)
    ramp.elements[-1].color = (*R.lin(R.rgb('#5f95d2')), 1)


def aufbauen():
    bpy.ops.wm.open_mainfile(filepath=os.path.join(GV, 'gebaeude.blend'))
    scene = bpy.context.scene
    for ob in list(bpy.data.objects):                       # keine Autos im Bild
        if ob.name.startswith('Auto_'):
            bpy.data.objects.remove(ob, do_unlink=True)
    licht_nachmittag(scene)
    neu = R.collection('Schritte')
    vordach(neu)
    A = figur_holen('A_Qamis')
    B = figur_holen('B_Hemd')
    ph = handy(B, neu)
    cd = bpy.data.cameras.new('Kamera_Shot'); cd.lens = 35; cd.sensor_width = 36; cd.clip_start = 0.05; cd.clip_end = 400
    cam = bpy.data.objects.new('Kamera_Shot', cd)
    neu.objects.link(cam)
    scene.camera = cam
    cy = scene.cycles
    cy.samples = 24
    scene.render.resolution_x, scene.render.resolution_y = 1080, 1920
    return {'scene': scene, 'A': A, 'B': B, 'handy': ph, 'cam': cam, 'coll': neu}


def kamera(S, pos, ziel, lens=35):
    cam = S['cam']
    cam.location = pos
    cam.rotation_euler = (Vector(ziel) - Vector(pos)).to_track_quat('-Z', 'Y').to_euler()
    cam.data.lens = lens


def bildpunkt(S, welt):
    """Bildschirm-Position (Pixel, 1080 × 1920) eines Weltpunkts – für Beschriftungen in der Einblendung."""
    from bpy_extras.object_utils import world_to_camera_view
    v = world_to_camera_view(S['scene'], S['cam'], Vector(welt))
    return (round(v.x * 1080), round((1 - v.y) * 1920))
