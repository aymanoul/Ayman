#!/usr/bin/env python3
"""Phase 4/5: Bildfolge aus blender/neubau.blend (nach animation.py) rendern, fortsetzbar (fertige Bilder werden übersprungen).

    .venv-blender/bin/python blender/animatic.py --kamera A --von 0 --bis 42 --fps 15 --breite 360 --samples 4 --aus out/phase4/anim_A
    .venv-blender/bin/python blender/animatic.py --kamera A --zeiten 2,6,10 --aus out/phase4/proben     (einzelne Zeitpunkte)
→ <aus>/f_00000.png …  (Bildnummer = runde(t · fps)).  Szene läuft mit 30 fps; t = Sekunden.
"""
import os
import sys
import time
import bpy

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, '..')
arg = lambda n, d: sys.argv[sys.argv.index('--' + n) + 1] if '--' + n in sys.argv else d
bpy.ops.wm.open_mainfile(filepath=os.path.join(HERE, 'neubau.blend'))
sc = bpy.context.scene
WECHSEL = [(int(e.split(':')[0]), e.split(':')[1]) for e in sc.get('kamera_wechsel', '').split(';') if e]   # Schnitte (Ayman 24.11.)
if not WECHSEL:
    sc.camera = bpy.data.objects['Drohne_' + arg('kamera', 'A')]


def kamera_fuer(fr):
    if WECHSEL:
        sc.camera = bpy.data.objects[[n for f, n in WECHSEL if f <= fr][-1]]
FPS = int(arg('fps', 15)); B = int(arg('breite', 360))
sc.render.resolution_x, sc.render.resolution_y = B, B * 9 // 16      # Ayman 24.11.: 16:9 QUERFORMAT
sc.render.engine = 'CYCLES'; sc.cycles.samples = int(arg('samples', 4)); sc.cycles.use_denoising = True
sc.render.use_persistent_data = True
AUS = os.path.join(ROOT, arg('aus', 'out/phase4/anim_A')); os.makedirs(AUS, exist_ok=True)
if arg('zeiten', ''):
    zeiten = [float(x) for x in arg('zeiten', '').split(',')]
    namen = [f't_{t:05.1f}' for t in zeiten]
else:
    n0, n1 = int(round(float(arg('von', 0)) * FPS)), int(round(float(arg('bis', 42)) * FPS))
    zeiten = [n / FPS for n in range(n0, n1)]
    namen = [f'f_{n:05d}' for n in range(n0, n1)]
t_start = time.time(); k = 0
for t, nm in zip(zeiten, namen):
    f = os.path.join(AUS, nm + '.png')
    if os.path.exists(f):
        continue
    if sc.get('keller_von', -1) <= int(round(t * 30)) < sc.get('keller_bis', -1) and not arg('zeiten', ''):
        continue                                     # Kellerbilder kommen aus tools/keller_clip.py (festsaal.blend)
    sc.frame_set(int(round(t * 30)))
    kamera_fuer(int(round(t * 30)))
    sc.render.filepath = f
    bpy.ops.render.render(write_still=True)
    k += 1
    if k % 15 == 0 or arg('zeiten', ''):
        print(f'Bild {nm} ({t:.1f} s) · {(time.time() - t_start) / k:.1f} s/Bild', flush=True)
print('fertig', len(zeiten), flush=True)
