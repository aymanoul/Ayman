#!/usr/bin/env python3
"""Test-Video im Gebetsraum: Kamerafahrt von der Eingangstür zum Mihrab (zeigt, dass Videos per Code funktionieren).

    .venv-blender/bin/python blender/kamerafahrt.py [--sek 4] [--fps 24] [--samples 16] [--breite 540]
    → out/blender/kamerafahrt.mp4
"""
import os, subprocess, sys, time
import bpy

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'out', 'blender')
arg = lambda n, d: sys.argv[sys.argv.index('--' + n) + 1] if '--' + n in sys.argv else d
sek, fps, breite = float(arg('sek', 4)), int(arg('fps', 24)), int(arg('breite', 540))
bpy.ops.wm.open_mainfile(filepath=os.path.join(HERE, 'gebetsraum.blend'))
s = bpy.context.scene
cam = bpy.data.objects['Kamera_Video_Hochformat']
s.camera = cam
ziel = bpy.data.objects.new('Kamera_Ziel', None)            # die Kamera schaut immer auf diesen Punkt
s.collection.objects.link(ziel)
c = cam.constraints.new('TRACK_TO'); c.target = ziel; c.track_axis = 'TRACK_NEGATIVE_Z'; c.up_axis = 'UP_Y'
n = int(sek * fps)
s.frame_start, s.frame_end, s.render.fps = 1, n, fps
for f, pos, look in [(1, (2.6, -5.2, 1.55), (1.0, 6, 1.5)), (n, (0.0, 1.6, 1.45), (0, 6, 1.35))]:
    cam.location = pos; cam.keyframe_insert('location', frame=f)
    ziel.location = look; ziel.keyframe_insert('location', frame=f)
tuer = bpy.data.objects['Tuerblatt']                         # die Tür fällt am Anfang langsam zu
tuer.rotation_euler.z = -1.2; tuer.keyframe_insert('rotation_euler', frame=1)
tuer.rotation_euler.z = 0.0; tuer.keyframe_insert('rotation_euler', frame=int(n * 0.5))
s.cycles.samples = int(arg('samples', 16))
s.render.resolution_x, s.render.resolution_y = breite, breite * 16 // 9
tmp = os.path.join(OUT, 'tmp_fahrt')
os.makedirs(tmp, exist_ok=True)
s.render.image_settings.file_format = 'PNG'
t0 = time.time()
for f in range(1, n + 1):
    s.frame_set(f)
    s.render.filepath = os.path.join(tmp, f'{f:04d}.png')
    bpy.ops.render.render(write_still=True)
    if f % 12 == 0:
        print(f'Bild {f}/{n} · {(time.time() - t0) / f:.1f} s pro Bild', flush=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-framerate', str(fps), '-i', os.path.join(tmp, '%04d.png'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
                '-crf', '18', '-movflags', '+faststart', os.path.join(OUT, 'kamerafahrt.mp4')], check=True)
print(f'Fertig: out/blender/kamerafahrt.mp4 · {n} Bilder in {time.time() - t0:.0f} s')
