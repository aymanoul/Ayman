#!/usr/bin/env python3
"""Phase 3: Vergleichsblatt KI-/Architektenbild ↔ Blender (Moschee im Endzustand) → out/phase3/vergleich.jpg
    python3 tools/vergleich_phase3.py
"""
import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
REF = os.path.join(ROOT, 'assets', 'ref', 'neubau', 'bilder')
OUT = os.path.join(ROOT, 'out', 'phase3')
F = lambda w, s: ImageFont.truetype(os.path.join(ROOT, 'assets', 'fonts', f'Montserrat-{w}.ttf'), s)
NAVY, GOLD = '#212242', '#CA9E4E'
PAARE = [('ki_draufsicht_fertig.jpg', None, 'ki_oben.png', 'Von oben'),
         ('ki_bau_roadmap_plakat.jpg', (0, 150, 1055, 672), 'ki_plakat.png', 'Schräg von vorn links (Bau-Roadmap)'),
         ('ki_schraeg_rote_markierungen.jpg', None, 'ki_schraeg.png', 'Schräg über der Gasse')]
W = 900; H = 506; KOPF = 56
blatt = Image.new('RGB', (2 * W + 60, len(PAARE) * (H + KOPF + 20) + 110), NAVY)
d = ImageDraw.Draw(blatt)
d.text((20, 50), 'PHASE 3 · MOSCHEE: ENTWURFSBILD ↔ BLENDER', font=F(800, 36), fill=GOLD, anchor='lm')
for i, (ki, crop, render, titel) in enumerate(PAARE):
    y = 110 + i * (H + KOPF + 20)
    d.text((20, y + KOPF / 2), titel, font=F(700, 26), fill='#FFFFFF', anchor='lm')
    a = Image.open(os.path.join(REF, ki)).convert('RGB')
    if crop:
        a = a.crop(crop)
    a = a.resize((W, H), Image.LANCZOS)
    b = Image.open(os.path.join(OUT, render)).convert('RGB').resize((W, H), Image.LANCZOS)
    blatt.paste(a, (20, y + KOPF)); blatt.paste(b, (40 + W, y + KOPF))
    for x, s in ((30, 'ENTWURF'), (50 + W, 'BLENDER')):
        tw = d.textlength(s, font=F(800, 20))
        d.rectangle([x, y + KOPF + 10, x + tw + 20, y + KOPF + 42], fill=NAVY)
        d.text((x + 10, y + KOPF + 26), s, font=F(800, 20), fill=GOLD, anchor='lm')
blatt.save(os.path.join(OUT, 'vergleich.jpg'), quality=88)
print('fertig: out/phase3/vergleich.jpg')
