#!/usr/bin/env python3
"""Phase 3: Übersichtsblatt → out/phase3/uebersicht.jpg (aus den Renderbildern von blender/ansicht.py --ordner phase3)."""
import os
from PIL import Image, ImageDraw, ImageFont
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
O = os.path.join(ROOT, 'out', 'phase3') + '/'
F = lambda w, s: ImageFont.truetype(os.path.join(ROOT, 'assets', 'fonts', f'Montserrat-{w}.ttf'), s)
NAVY, GOLD = '#212242', '#CA9E4E'
B = Image.new('RGB', (1880, 1130), NAVY); d = ImageDraw.Draw(B)
d.text((20, 45), 'PHASE 3 · MOSCHEE IM ENDZUSTAND + KELLER', font=F(800, 34), fill=GOLD, anchor='lm')


def put(f, x, y, w, h, t):
    im = Image.open(O + f).convert('RGB'); im.thumbnail((w, h)); B.paste(im, (x, y + 40))
    d.text((x, y + 18), t, font=F(700, 24), fill='white', anchor='lm')


put('portal.png', 20, 80, 430, 765, 'Glasfront + Portal')
put('hof.png', 470, 80, 690, 390, 'Hof: Olivenbäume, Bänke, Schirme')
put('keller.png', 1170, 80, 690, 390, 'Keller (Schnitt, nur unter der Moschee)')
put('parken.png', 470, 520, 690, 390, 'Parken + Wohnwagen-Plätze (leer), Zaun, Schiebetor')
put('ki_schraeg.png', 1170, 520, 690, 390, 'Übersicht')
for i, (s, c) in enumerate((('Innen durch das Glas: grüner Teppich mit Reihen, Mihrab (links, Richtung Qibla), Minbar, Säulen, warmes Licht.', 'white'),
                             ('Dach: Gründach mit 10 PV-Reihen. Höhen: EG 5,5 m · 1. Etage 2,75 m · gesamt 10 m.', 'white'),
                             ('Noch einfacher Modell-Look – fotorealistisch wird es später (Higgsfield bzw. Plan B Cycles).', GOLD))):
    d.text((470, 1000 + i * 40), s, font=F(600, 22), fill=c)
B.save(O + 'uebersicht.jpg', quality=88)
print('fertig: out/phase3/uebersicht.jpg')
