#!/usr/bin/env python3
"""Rohschnitt zusammenbauen: Blender-Bilder (out/roh, 15 Bilder/s) + Stimmen nach Zeitplan → out/phase3/rohschnitt_720p.mp4
    python3 tools/rohschnitt.py [--fps 15]
"""
import json, os, subprocess, sys
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
fps = int(sys.argv[sys.argv.index('--fps') + 1]) if '--fps' in sys.argv else 15
zp = json.load(open(os.path.join(ROOT, 'audio', 'zeitplan.json')))
out = os.path.join(ROOT, 'out', 'phase3'); os.makedirs(out, exist_ok=True)
# Stimmen-Spur
ins, flt = [], []
for i, (z, t0) in enumerate(zp['stimmen']):
    ins += ['-i', os.path.join(ROOT, 'assets', 'audio', 'zeilen', z + '.wav')]
    flt.append(f'[{i}]adelay={int(t0 * 1000)}:all=1[a{i}]')
n = len(zp['stimmen'])
ton = os.path.join(out, 'stimmen.wav')
subprocess.run(['ffmpeg', '-v', 'error', '-y'] + ins + ['-filter_complex', ';'.join(flt) + ';' + ''.join(f'[a{i}]' for i in range(n)) +
                f'amix=inputs={n}:normalize=0,apad,atrim=0:{zp["dauer"]}', '-ar', '48000', ton], check=True)
video = os.path.join(out, 'rohschnitt_720p.mp4')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-framerate', str(fps), '-start_number', '0', '-i', os.path.join(ROOT, 'out', 'roh', 'f_%05d.png'),
                '-i', ton, '-vf', 'scale=720:1280:flags=lanczos,fps=30', '-c:v', 'libx264', '-crf', '20', '-pix_fmt', 'yuv420p',
                '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', video], check=True)
print('fertig:', os.path.relpath(video, ROOT))
