#!/usr/bin/env python3
"""Phase 4: Animatic zusammensetzen → out/phase4/animatic_A.mp4, animatic_B.mp4 (720 × 1280, 15 fps, ohne Ton).
Variante B = eigene Bilder 0–4 s + gemeinsame Bilder von A ab 4 s. Einfache Beschriftung (Stufe, Variante) per PIL –
die richtigen Einblendungen kommen in Phase 8.
    python3 tools/animatic.py
"""
import os
import shutil
import subprocess
import tempfile
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
P4 = os.path.join(ROOT, 'out', 'phase4')
FONT = lambda w, s: ImageFont.truetype(os.path.join(ROOT, 'assets', 'fonts', f'Montserrat-{w}.ttf'), s)
NAVY, GOLD = (33, 34, 66), (202, 158, 78)
FPS, N = 15, 630
STUFEN = [(0, 4, 'PROJEKT MOSCHEE NEUBAU'), (4, 8, '1 · AUSHUB KELLER'), (8, 13, '2 · KELLER & BODENPLATTE'),
          (13, 20, '3 · ERDGESCHOSS MÄNNER'), (20, 25, '4 · 1. ETAGE FRAUEN'), (25, 30, '5 · DECKE & PV-DACH'),
          (30, 36, '6 · FERTIGSTELLUNG'), (36, 42, '(hier folgt die Abschlusskarte)')]


def beschriften(src, dst, t, variante):
    im = Image.open(src).convert('RGB').resize((720, 1280), Image.LANCZOS)
    d = ImageDraw.Draw(im)
    text = next(s for a, b, s in STUFEN if a <= t < b + 1e-6)
    f = FONT(800, 34); tw = d.textlength(text, font=f)
    y = int(1280 * 0.135)                      # unterhalb der oberen 12 % (Bedienflächen)
    d.rectangle([360 - tw / 2 - 22, y - 30, 360 + tw / 2 + 22, y + 30], fill=NAVY)
    d.text((360, y), text, font=f, fill=GOLD, anchor='mm')
    f2 = FONT(700, 20); s2 = f'ANIMATIC · VARIANTE {variante} · {t:4.1f} s'
    d.text((360, int(1280 * 0.76)), s2, font=f2, fill=(255, 255, 255), anchor='mm', stroke_width=2, stroke_fill=NAVY)
    im.save(dst)


for variante in ('A', 'B'):
    tmp = tempfile.mkdtemp()
    for n in range(N):
        t = n / FPS
        quelle = os.path.join(P4, 'anim_B' if (variante == 'B' and t < 4) else 'anim_A', f'f_{n:05d}.png')
        beschriften(quelle, os.path.join(tmp, f'b_{n:05d}.png'), t, variante)
    aus = os.path.join(P4, f'animatic_{variante}.mp4')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-framerate', str(FPS), '-i', os.path.join(tmp, 'b_%05d.png'),
                    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-movflags', '+faststart', aus], check=True)
    shutil.rmtree(tmp)
    print('fertig:', os.path.relpath(aus, ROOT))
