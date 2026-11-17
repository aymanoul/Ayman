#!/usr/bin/env python3
"""Drehort für „Zwischen Adhan und Iqama“ in Blender: freigegebener Gebetsraum (gebet-video/blender/gebetsraum.blend)
+ Hauptpersonen A (A_Qamis) und B (B_Hemd) + Nebenfiguren (Kopien mit anderen Farben), im Stil von „Jeder Schritt zählt“.

    import drehort as D;  S = D.aufbauen()

Baut auf gebet-video/blender (raum.py, figuren.py, *.blend) und schritte-video/blender/szene.py (Mund, Handy, Kamera)
auf – dort wird nichts verändert.
Achsen wie in raum.py: X rechts (Blick zur Qibla), Y zur Qibla-Wand (y = +6), Z oben. Säulen bei (±1,75 | −1,0) und
(±1,75 | −4,2). Figur in Ruhe schaut nach −Y; rot_z = 180° → schaut zur Qibla (+Y).
"""
import importlib.util
import math
import os
import sys
import bpy            # zuerst bpy, danach bmesh/mathutils
import bmesh
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
GV = os.path.join(HERE, '..', '..', 'gebet-video', 'blender')
SV = os.path.join(HERE, '..', '..', 'schritte-video', 'blender')
sys.path.insert(0, GV)
import raum as R          # noqa: E402
import figuren as FG      # noqa: E402
_spec = importlib.util.spec_from_file_location('schritte_szene', os.path.join(SV, 'szene.py'))
SZ = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(SZ)     # Mund, Handy, Kamera, stell, bildpunkt

GOLD, NAVY = '#CA9E4E', '#212242'
SITZ_TIEFE = 0.74                       # so weit sinkt die Hüfte beim Sitzen im Schneidersitz

# ------------------------------------------------------------------ Posen (Grad, Knochen-Achsen wie figuren.py)
SITZEN = {                                           # Schneidersitz: Oberschenkel nach vorn und außen, Unterschenkel gekreuzt
    'Oberschenkel.L': (-90, -40, -10), 'Oberschenkel.R': (-90, 40, 10),       # per Suche: Knie links/rechts vorn
    'Unterschenkel.L': (60, -90, 75), 'Unterschenkel.R': (60, 90, -75),      # Knöchel unter dem anderen Knie
    'Fuss.L': (-20, 0, 0), 'Fuss.R': (-20, 0, 0),
    'Bauch': (4, 0, 0), 'Brust': (3, 0, 0),
    'Oberarm.L': (-14, 0, -6), 'Oberarm.R': (-14, 0, 6), 'Unterarm.L': (-42, 0, 0), 'Unterarm.R': (-42, 0, 0),
}
HANDY = {'Oberarm.R': (-24, 0, -10), 'Unterarm.R': (-82, 0, 0), 'Hand.R': (-10, 0, 0), 'Hals': (12, 0, 0), 'Kopf': (16, 0, 0)}
HANDY_UNTEN = {'Oberarm.R': (-16, 0, -6), 'Unterarm.R': (-50, 0, 0), 'Hand.R': (-8, 0, 0), 'Hals': (2, 0, 0), 'Kopf': (4, 0, 0)}
TASCHE = {'Oberarm.R': (-10, 0, 22), 'Unterarm.R': (-96, 0, -30), 'Hand.R': (0, 0, 0), 'Kopf': (14, 0, 0)}
SPRECHEN = {'Oberarm.R': (-26, 0, -12), 'Unterarm.R': (-58, 0, 0), 'Hand.R': (0, 0, 0)}
DUA = {                                              # Bittgebet: Hände offen vor der Brust, Handflächen nach oben (per Suche)
    'Oberarm.L': (-42, 30, -40), 'Unterarm.L': (-80, 0, -10), 'Hand.L': (-30, -135, -20),
    'Oberarm.R': (-42, -30, 40), 'Unterarm.R': (-80, 0, 10), 'Hand.R': (-30, 135, 20),
    'Hals': (10, 0, 0), 'Kopf': (8, 0, 0),
}

# Nebenfiguren: Kopien der Hauptfiguren in anderen Farben (nur von hinten oder weit weg)
NEBEN = [('A_Qamis', '#9aa0a8'), ('B_Qamis', '#d9cdb5'), ('A_Qamis', '#56705c'), ('B_Qamis', '#7a6250'), ('A_Qamis', '#e8dfcc'), ('B_Qamis', '#4f5d78')]


def figur_kopie(key, farbe, nr):
    """Figur noch einmal anhängen und die Kleidung umfärben → Nebenfigur."""
    vorher = set(bpy.data.objects)
    with bpy.data.libraries.load(os.path.join(GV, 'figuren.blend'), link=False) as (src, dst):
        dst.collections = [key]
    c = dst.collections[0]
    c.name = f'Neben_{nr}'
    bpy.context.scene.collection.children.link(c)
    neu = [o for o in bpy.data.objects if o not in vorher]
    arm = next(o for o in neu if o.type == 'ARMATURE')
    arm.name = f'Neben_{nr}_Skelett'
    gefaerbt = {}
    for o in neu:
        if o.type != 'MESH':
            continue
        for i, m in enumerate(o.data.materials):
            if m and any(k in m.name.lower() for k in ('qamis', 'kleid', 'stoff')):
                if m.name not in gefaerbt:
                    m2 = m.copy(); m2.name = f'Neben_{nr}_Stoff'
                    b = m2.node_tree.nodes.get('Principled BSDF')
                    if b:
                        b.inputs['Base Color'].default_value = (*R.lin(R.rgb(farbe)), 1)
                    gefaerbt[m.name] = m2
                o.data.materials[i] = gefaerbt[m.name]
    return arm


def sitzen(arm, *posen, loc=(0, 0, 0), rot_z=180.0):
    """Figur im Schneidersitz an loc (Boden), Blick rot_z (180° = zur Qibla); weitere Posen überschreiben."""
    SZ.stell(arm, SITZEN, *posen, loc=(loc[0], loc[1], loc[2] - SITZ_TIEFE), rot_z=rot_z)


def licht_warm(scene):
    """Ruhiges, warmes Licht kurz vor dem Gebet."""
    for o in bpy.data.objects:
        if o.type == 'LIGHT':
            if o.name.startswith('LED_'):
                o.data.color = (1.0, 0.86, 0.68)
            elif 'Tageslicht' in o.name:
                o.data.color = (1.0, 0.83, 0.62)
                o.data.energy *= 0.8


def aufbauen():
    bpy.ops.wm.open_mainfile(filepath=os.path.join(GV, 'gebetsraum.blend'))
    scene = bpy.context.scene
    licht_warm(scene)
    neu = R.collection('Iqama')
    A = SZ.figur_holen('A_Qamis')
    B = SZ.figur_holen('B_Hemd')
    ph = SZ.handy(B, neu)
    MA = SZ.mund(A, neu, 'Mund_A', vor=0.018)
    MB = SZ.mund(B, neu, 'Mund_B', vor=0.009)
    neben = [figur_kopie(k, f, i) for i, (k, f) in enumerate(NEBEN)]
    cd = bpy.data.cameras.new('Kamera_Shot'); cd.lens = 35; cd.sensor_width = 36; cd.clip_start = 0.05; cd.clip_end = 200
    cam = bpy.data.objects.new('Kamera_Shot', cd)
    neu.objects.link(cam)
    scene.camera = cam
    scene.render.engine = 'CYCLES'
    scene.cycles.samples = 24
    scene.cycles.use_denoising = True
    scene.render.resolution_x, scene.render.resolution_y = 1080, 1920
    return {'scene': scene, 'A': A, 'B': B, 'handy': ph, 'cam': cam, 'coll': neu, 'mundA': MA, 'mundB': MB, 'neben': neben}
