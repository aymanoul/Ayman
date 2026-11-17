#!/usr/bin/env python3
"""Phase 5: zwei Titelbilder (1080 × 1920) = 3D-Bild in voller Größe + Schrift-Ebene.

    vorher: .venv-blender/bin/python blender/film.py --von 29 --bis 29.02 --fps 30 --breite 1080 --samples 24 --aus out/phase5/titel
            (und dasselbe mit --von 58.3 --bis 58.32)
    python3 tools/titelbild.py → out/phase5/titelbild_variante1.png, titelbild_variante2.png
Variante 1: Kernbild S6 (Licht-Tor, goldener Zeitbalken) + Hook. Variante 2: Bittgebet S12 + „Handy weg. Hände hoch.“
"""
import json, os, subprocess

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
T = os.path.join(ROOT, 'out', 'phase5', 'titel')
Z = [
    ('ebene1', 'f_00870.png', {'logo': 1, 'balken': {'rest': 549, 'gold': 1}, 'titel': ['Diese Minuten', 'verschwendet', 'fast jeder.'], 'titelY': 1180}),
    ('ebene2', 'f_01749.png', {'logo': 1, 'balken': {'rest': 0, 'gold': 1}, 'titel': ['Handy weg.', 'Hände hoch.'], 'titelY': 620}),
]
liste = os.path.join(T, 'zustaende.json')
json.dump([{'name': n, 'zustand': z} for n, _, z in Z], open(liste, 'w'), ensure_ascii=False, indent=1)
subprocess.run(['node', os.path.join(ROOT, 'tools', 'overlay.mjs'), liste, T], check=True)
for i, (n, bild, _) in enumerate(Z, start=1):
    aus = os.path.join(ROOT, 'out', 'phase5', f'titelbild_variante{i}.png')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(T, bild), '-i', os.path.join(T, n + '.png'),
                    '-filter_complex', '[0]scale=1080:1920[b];[b][1]overlay', '-frames:v', '1', aus], check=True)
    print('fertig:', os.path.relpath(aus, ROOT))
