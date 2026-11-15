#!/usr/bin/env python3
"""Probe: Hauptpersonen an einem Drehort. Holt die Figuren aus figuren.blend in gebaeude.blend oder gebetsraum.blend.

    .venv-blender/bin/python blender/szene_test.py [--ort gebaeude|gebetsraum] [--samples 32]
    → out/blender/szene_<ort>.png
"""
import math, os, sys
import bpy

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import figuren as FG
arg = lambda n, d: sys.argv[sys.argv.index('--' + n) + 1] if '--' + n in sys.argv else d
ort = arg('ort', 'gebaeude')
bpy.ops.wm.open_mainfile(filepath=os.path.join(HERE, ort + '.blend'))
s = bpy.context.scene


def hole(key):
    """Figur (ganze Sammlung mit Skelett) aus figuren.blend anhängen und das Skelett zurückgeben."""
    with bpy.data.libraries.load(os.path.join(HERE, 'figuren.blend'), link=False) as (src, dst):
        dst.collections = [key]
    c = dst.collections[0]
    s.collection.children.link(c)
    return bpy.data.objects[key + '_Skelett']


if ort == 'gebaeude':
    a, b = hole('A_Qamis'), hole('B_Hemd')
    a.location, a.rotation_euler = (0.7, -1.6, 0), (0, 0, math.radians(-125))       # A steht am Eingang, schaut zu B
    b.location, b.rotation_euler = (-1.0, -3.4, 0), (0, 0, math.radians(-95))       # B läuft mit Blick zur Seite vorbei
    FG.pose(a, {'Oberarm.R': (-12, 0, 62), 'Unterarm.R': (-8, 0, 92), 'Kopf': (0, 0, -8)})
    FG.pose(b, {'Oberschenkel.L': (-20, 0, 0), 'Unterschenkel.L': (10, 0, 0), 'Oberschenkel.R': (16, 0, 0), 'Unterschenkel.R': (24, 0, 0),
                'Oberarm.R': (-18, 0, 0), 'Oberarm.L': (14, 0, 0), 'Unterarm.L': (-60, 0, 0), 'Kopf': (0, 0, 25)})
    cam = bpy.data.objects['Kamera_Video_Hochformat']
    cam.location = (3.6, -9.5, 1.45)
    cam.rotation_euler = (bpy.data.objects['Tuer_Haupt_links'].location.to_3d() * 0 + __import__('mathutils').Vector((-0.4, -2.0, 2.3)) - cam.location).to_track_quat('-Z', 'Y').to_euler()
else:
    a, b = hole('A_Qamis'), hole('B_Qamis')
    a.location, a.rotation_euler = (-0.35, 4.25, 0), (0, 0, math.radians(180))     # Reihe vor dem Mihrab, Blick zur Qibla
    b.location, b.rotation_euler = (0.35, 4.25, 0), (0, 0, math.radians(180))
    cam = bpy.data.objects['Kamera_Video_Hochformat']
    cam.location = (0.4, 1.4, 1.75)
    cam.rotation_euler = (__import__('mathutils').Vector((0.0, 5.5, 1.15)) - cam.location).to_track_quat('-Z', 'Y').to_euler()
s.camera = cam
s.cycles.samples = int(arg('samples', 32))
s.render.resolution_x, s.render.resolution_y = 540, 960
s.render.filepath = os.path.join(HERE, '..', 'out', 'blender', f'szene_{ort}.png')
bpy.ops.render.render(write_still=True)
print('fertig', s.render.filepath)
