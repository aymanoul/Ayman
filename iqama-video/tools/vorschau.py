#!/usr/bin/env python3
"""Phase 4: Vorschau zusammenbauen = 3D-Bilder (out/roh, 12/s) + Einblendungen (out/phase4/ebenen, 30/s) + Ton (out/phase4/ton.wav).

    python3 tools/vorschau.py [--roh out/roh --fps 12 --hoehe 1280 --aus out/phase4/vorschau_720p.mp4]
In S9 wird das 3D-Bild weichgezeichnet (Bildschirmzeit als Grafik davor). Ton zweistufig auf −14 LUFS / −1,5 dBTP.
"""
import json, os, re, subprocess, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
arg = lambda n, d: sys.argv[sys.argv.index('--' + n) + 1] if '--' + n in sys.argv else d
roh, fps, hoehe = arg('roh', 'out/roh'), int(arg('fps', 12)), int(arg('hoehe', 1280))
aus = os.path.join(ROOT, arg('aus', 'out/phase4/vorschau_720p.mp4'))
ZP = json.load(open(os.path.join(ROOT, 'audio', 'zeitplan.json')))
s9 = next(s for s in ZP['shots'] if s['id'] == 'S9')
ton = os.path.join(ROOT, 'out', 'phase4', 'ton.wav')

# Lautheit messen (1. Durchgang)
m = subprocess.run(['ffmpeg', '-hide_banner', '-i', ton, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'],
                   capture_output=True, text=True).stderr
j = json.loads(re.search(r'\{[^{}]*"input_i"[^{}]*\}', m, re.S).group(0))
ln = (f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}"
      f":measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true")
breite = hoehe * 9 // 16
vf = (f"[0]scale=1080:1920:flags=lanczos,fps=30,boxblur=14:2:enable='between(t,{s9['t0']:.3f},{s9['t0'] + s9['t']:.3f})'[b];"
      f"[b][1]overlay=format=auto,scale={breite}:{hoehe}:flags=lanczos,format=yuv420p[v]")
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-framerate', str(fps), '-i', os.path.join(ROOT, roh, 'f_%05d.png'),
                '-framerate', '30', '-i', os.path.join(ROOT, 'out', 'phase4', 'ebenen', 'f_%05d.png'), '-i', ton,
                '-filter_complex', vf, '-map', '[v]', '-map', '2:a', '-af', ln + ',aresample=48000',
                '-c:v', 'libx264', '-crf', '20', '-preset', 'medium', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', aus], check=True)
print('fertig:', os.path.relpath(aus, ROOT))
