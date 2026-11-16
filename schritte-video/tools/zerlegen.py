#!/usr/bin/env python3
"""Stimmen in Zeilen zerlegen: Schnitt jeweils an der leisesten Stelle zwischen zwei Zeilen (Wortzeiten aus der Spracherkennung).

    python3 tools/zerlegen.py <datei> <transkript.json> A01,A02,…   → assets/audio/zeilen/<Zeile>.wav (normalisiert, −16 LUFS)
Die Zeilen werden in der Reihenfolge der Datei erwartet; die Grenzen stehen in GRENZEN (Wort, mit dem die nächste Zeile beginnt).
"""
import json, os, subprocess, sys
import numpy as np

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
src, tr, namen = sys.argv[1], sys.argv[2], sys.argv[3].split(',')
# ungefährer Beginn jeder Zeile (s), aus dem Transkript; optional mit Suchfenster: 28.2:0.2
starts = [tuple(float(v) for v in x.split(':')) if ':' in x else (float(x), 0.45) for x in sys.argv[4].split(',')]
SR = 48000
pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True, check=True).stdout
x = np.frombuffer(pcm, np.int16).astype(np.float64) / 32768
dur = len(x) / SR
hop = SR // 100
rms = np.array([np.sqrt(np.mean(x[i:i + hop] ** 2)) for i in range(0, len(x), hop)])


def leise(t, fenster=0.45):
    """Leiseste Stelle (10-ms-Raster) im Fenster ±fenster um t."""
    a, b = max(0, int((t - fenster) * 100)), min(len(rms) - 1, int((t + fenster) * 100))
    sm = np.convolve(rms, np.ones(5) / 5, mode='same')
    return (a + int(np.argmin(sm[a:b]))) / 100


cuts = [max(0.0, starts[0][0] - 0.15)] + [leise(s, f) for s, f in starts[1:]] + [dur]
out = os.path.join(ROOT, 'assets', 'audio', 'zeilen')
os.makedirs(out, exist_ok=True)
info = []
for n, a, b in zip(namen, cuts, cuts[1:]):
    f = os.path.join(out, n + '.wav')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{a:.3f}', '-to', f'{b:.3f}', '-i', src,
                    '-af', 'silenceremove=start_periods=1:start_threshold=-45dB:stop_periods=-1:stop_threshold=-45dB:stop_duration=0.25,'
                           'afade=t=in:d=0.01,loudnorm=I=-16:TP=-2:LRA=11', '-ar', '48000', '-ac', '1', f], check=True)
    d = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], capture_output=True, text=True).stdout)
    info.append({'zeile': n, 'von': a, 'bis': b, 'dauer': round(d, 2)})
    print(f'{n}: {a:6.2f}–{b:6.2f} s → {d:.2f} s')
json.dump(info, open(os.path.join(out, 'schnitt_' + os.path.basename(src) + '.json'), 'w'), indent=1)
