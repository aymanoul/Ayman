#!/usr/bin/env python3
"""Look-Test (18.11.): dasselbe Filmbild „vorher“ (heutige Einstellungen) und „nachher“ (Tipps aus den Blender-Skills
lighting / camera-cinematography / rendering: AgX-Farbumrechnung, Randlicht von hinten, Tiefenschärfe bei Nahaufnahmen,
etwas mehr Lichtbounces).

    .venv-blender/bin/python blender/look_test.py [--breite 720] [--samples 16]
    .venv-blender/bin/python blender/look_test.py --variante 2   (Farben wie bisher, nur Unschärfe + stärkeres Randlicht)
    → out/look_test/<name>_vorher.png, <name>_nachher.png (bzw. <name>_nachher2.png)
Ergebnis Runde 1: AgX macht das goldene Licht-Tor blass → Runde 2 behält „Standard“.
"""
import os
import sys
import bpy
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import film as F                       # noqa: E402  (Szene + Shots; rendert beim Import nichts)

SB, S, sc = F.SB, F.S, F.sc
AUS = os.path.join(F.ROOT, 'out', 'look_test')
os.makedirs(AUS, exist_ok=True)
breite = int(F.arg('breite', 720))
sc.render.resolution_x, sc.render.resolution_y = breite, breite * 16 // 9
sc.cycles.samples = int(F.arg('samples', 16))
cam = S['cam']
V2 = F.arg('variante', '1') == '2'

# Testbilder: Zeit, Schärfe-Ziel (Figur oder None), Blende, Randlicht-Ziel
mitte = lambda: (SB.kopf(F.A) + SB.kopf(F.B)) / 2
TESTS = [
    ('S4_zweier', 17.5, lambda: SB.kopf(F.A), 2.8, lambda: SB.kopf(F.B)),
    ('S6_lichttor', 29.0, lambda: SB.kopf(F.B), 5.6, None),
    ('S7_nah_B', 31.8, lambda: SB.kopf(F.B), 2.0, lambda: SB.kopf(F.B)),
    ('S12_dua', 58.3, lambda: SB.kopf(F.A), 4.0, mitte),
]

# Randlicht (unsichtbar für die Kamera), wird je Bild hinter die Figur gestellt
rd = bpy.data.lights.new('Randlicht', 'AREA'); rd.energy = 0; rd.size = 0.9; rd.color = (1.0, 0.88, 0.7)
rand = bpy.data.objects.new('Randlicht', rd); sc.collection.objects.link(rand)
rand.visible_camera = False; rand.visible_glossy = False


def look(an):
    vs = sc.view_settings
    if an and not V2:
        vs.view_transform = 'AgX'; vs.look = 'AgX - Medium High Contrast'; vs.exposure = 0.45
        sc.cycles.max_bounces = 5; sc.cycles.diffuse_bounces = 3; sc.cycles.glossy_bounces = 2
    elif an:
        vs.view_transform = 'Standard'; vs.look = 'None'; vs.exposure = 0.0
        sc.cycles.max_bounces = 5; sc.cycles.diffuse_bounces = 3; sc.cycles.glossy_bounces = 2
    else:
        vs.view_transform = 'Standard'; vs.look = 'None'; vs.exposure = 0.0
        sc.cycles.max_bounces = 3; sc.cycles.diffuse_bounces = 2; sc.cycles.glossy_bounces = 1


for name, t, fokus, blende, rand_ziel in TESTS:
    for an in ((True,) if V2 else (False, True)):
        F.stellen(t)
        bpy.context.view_layer.update()
        look(an)
        cam.data.dof.use_dof = an
        rd.energy = 0
        if an:
            ziel = fokus()
            cam.data.dof.focus_distance = (ziel - cam.matrix_world.translation).length
            cam.data.dof.aperture_fstop = blende
            if rand_ziel:
                z = rand_ziel()
                weg = z - cam.matrix_world.translation; weg.z = 0; weg.normalize()
                rand.location = z + weg * 1.6 + Vector((0, 0, 0.9))
                rand.rotation_euler = (z - rand.location).to_track_quat('-Z', 'Y').to_euler()
                rd.energy = 260 if V2 else 90
        sc.render.filepath = os.path.join(AUS, f'{name}_{("nachher2" if V2 else "nachher") if an else "vorher"}.png')
        bpy.ops.render.render(write_still=True)
        print('fertig:', os.path.basename(sc.render.filepath), flush=True)
