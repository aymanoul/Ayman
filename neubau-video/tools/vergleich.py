#!/usr/bin/env python3
"""Phase 2: Vergleichsblatt Foto (Ayman) ↔ Blender aus gleicher Perspektive → out/phase2/vergleich.jpg
    python3 tools/vergleich.py
"""
import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
REF = os.path.join(ROOT, 'assets', 'ref', 'neubau', 'umgebung')
OUT = os.path.join(ROOT, 'out', 'phase2')
F = lambda w, s: ImageFont.truetype(os.path.join(ROOT, 'assets', 'fonts', f'Montserrat-{w}.ttf'), s)
NAVY, GOLD = '#212242', '#CA9E4E'
PAARE = [('gasse_blick_zum_torgebaeude.jpg', 'foto1.png', 'Gasse Richtung Torgebäude'),
         ('grundstueck_links_altbauten.jpg', 'foto3.png', 'Grundstück links: hellblaues Haus, Altbauten'),
         ('grundstueck_frontal_rueckwand.jpg', 'foto4.png', 'Grundstück frontal: Rückwand')]
W = 900; H = int(W * 9 / 16); KOPF = 56
blatt = Image.new('RGB', (2 * W + 60, len(PAARE) * (H + KOPF + 20) + 110), NAVY)
d = ImageDraw.Draw(blatt)
d.text((20, 50), 'PHASE 2 · UMGEBUNG: FOTO ↔ BLENDER', font=F(800, 36), fill=GOLD, anchor='lm')
for i, (foto, render, titel) in enumerate(PAARE):
    y = 110 + i * (H + KOPF + 20)
    d.text((20, y + KOPF / 2), titel, font=F(700, 26), fill='#FFFFFF', anchor='lm')
    a = Image.open(os.path.join(REF, foto)).convert('RGB').resize((W, H), Image.LANCZOS)
    b = Image.open(os.path.join(OUT, render)).convert('RGB').resize((W, H), Image.LANCZOS)
    blatt.paste(a, (20, y + KOPF)); blatt.paste(b, (40 + W, y + KOPF))
    for x, s in ((30, 'FOTO'), (50 + W, 'BLENDER')):
        tw = d.textlength(s, font=F(800, 20))
        d.rectangle([x, y + KOPF + 10, x + tw + 20, y + KOPF + 42], fill=NAVY)
        d.text((x + 10, y + KOPF + 26), s, font=F(800, 20), fill=GOLD, anchor='lm')
blatt.save(os.path.join(OUT, 'vergleich.jpg'), quality=88)
print('fertig: out/phase2/vergleich.jpg')
