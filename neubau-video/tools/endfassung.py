#!/usr/bin/env python3
"""Endfassung zusammensetzen: out/phase5/end/f_*.png (720×1280, 30 fps) + Tonspur →
   out/neubau_drohne.mp4 (1080×1920, lokal hochskaliert, −14 LUFS, −1,5 dBTP) und out/neubau_drohne_vorschau_720p.mp4.
Kein Text, kein Logo im Video (Ayman macht das selbst).
    python3 tools/endfassung.py
"""
import json
import os
import subprocess

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
END = os.path.join(ROOT, 'out', 'phase5', 'end')
TON = os.path.join(ROOT, 'out', 'phase5', 'ton.wav')
subprocess.run(['python3', os.path.join(ROOT, 'tools', 'ton.py')], check=True)

# Lautheit: zwei Durchgänge loudnorm → −14 LUFS, −1,5 dBTP
mess = subprocess.run(['ffmpeg', '-hide_banner', '-i', TON, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'],
                      capture_output=True, text=True).stderr
j = json.loads(mess[mess.rindex('{'):mess.rindex('}') + 1])
af = (f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}"
      f":measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true,aresample=48000")
for hoehe, name, crf in ((1920, 'neubau_drohne.mp4', 17), (1280, 'neubau_drohne_vorschau_720p.mp4', 21)):
    aus = os.path.join(ROOT, 'out', name)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-framerate', '30', '-i', os.path.join(END, 'f_%05d.png'), '-i', TON,
                    '-vf', f'scale={hoehe * 9 // 16}:{hoehe}:flags=lanczos,format=yuv420p', '-af', af,
                    '-c:v', 'libx264', '-preset', 'slow', '-crf', str(crf), '-c:a', 'aac', '-b:a', '192k',
                    '-shortest', '-movflags', '+faststart', aus], check=True)
    print('fertig:', os.path.relpath(aus, ROOT), flush=True)
