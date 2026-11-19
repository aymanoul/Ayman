#!/usr/bin/env python3
"""Phase 1: Lageplan von oben mit Maßen und Beschriftung → out/phase1/lageplan.png (3000 × 2100).

Koordinaten in Metern: x nach rechts entlang der Gasse (0 = linke Grundstücksecke an den Altbauten),
y nach hinten (0 = Grundstücksgrenze an der Gasse). Maße aus AUFTRAG.md (ca. ±1 m), Umgebung nach Fotos/Karte (ca.).
    python3 tools/lageplan.py
"""
import math
import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
FONTS = os.path.join(ROOT, 'assets', 'fonts')
OUT = os.path.join(ROOT, 'out', 'phase1')
os.makedirs(OUT, exist_ok=True)

NAVY, NAVY_D, GOLD, GOLD_D = '#212242', '#191a36', '#CA9E4E', '#B88A38'
PAPIER, LINIE, GRAU = '#F4F1EA', '#212242', '#8A8C9E'
W, H = 3000, 2100
S = 26.0                      # Pixel pro Meter
X0, Y0 = 840, 1250            # Bildpunkt von (0 | 0)

img = Image.new('RGB', (W, H), PAPIER)
d = ImageDraw.Draw(img)
f = lambda w, s: ImageFont.truetype(os.path.join(FONTS, f'Montserrat-{w}.ttf'), s)


def P(x, y):
    return (X0 + x * S, Y0 - y * S)


def rect(x0, y0, x1, y1, fill=None, outline=None, width=2):
    a, b = P(x0, y1), P(x1, y0)
    d.rectangle([a, b], fill=fill, outline=outline, width=width)


def poly(pts, fill=None, outline=None, width=2):
    d.polygon([P(*p) for p in pts], fill=fill, outline=outline, width=width)


def text(x, y, s, size=26, w=600, fill=NAVY, anchor='mm', px=False):
    pos = (x, y) if px else P(x, y)
    d.text(pos, s, font=f(w, size), fill=fill, anchor=anchor)


def box(x, y, s, size=22, w=800, fill='#FFFFFF', bg=NAVY):
    tw = d.textlength(s, font=f(w, size)); c = P(x, y)
    d.rectangle([c[0] - tw / 2 - 10, c[1] - size * 0.72, c[0] + tw / 2 + 10, c[1] + size * 0.72], fill=bg)
    d.text(c, s, font=f(w, size), fill=fill, anchor='mm')


def gestrichelt(p0, p1, fill, width=3, dash=14, gap=10):
    (xa, ya), (xb, yb) = p0, p1
    L = math.hypot(xb - xa, yb - ya); n = int(L // (dash + gap)) + 1
    for i in range(n):
        t0 = i * (dash + gap) / L; t1 = min(1, (i * (dash + gap) + dash) / L)
        if t0 >= 1:
            break
        d.line([(xa + (xb - xa) * t0, ya + (yb - ya) * t0), (xa + (xb - xa) * t1, ya + (yb - ya) * t1)], fill=fill, width=width)


def mass_h(x0, x1, y, label, off=0):
    """Waagerechte Maßlinie bei y (Meter)."""
    a, b = P(x0, y), P(x1, y)
    d.line([a, b], fill=GOLD_D, width=3)
    for p in (a, b):
        d.line([(p[0], p[1] - 12), (p[0], p[1] + 12)], fill=GOLD_D, width=3)
    tw = d.textlength(label, font=f(700, 26)) + 18
    m = ((a[0] + b[0]) / 2, a[1] + off)
    d.rectangle([m[0] - tw / 2, m[1] - 17, m[0] + tw / 2, m[1] + 17], fill=PAPIER)
    d.text(m, label, font=f(700, 26), fill=GOLD_D, anchor='mm')


def mass_v(x, y0, y1, label):
    a, b = P(x, y0), P(x, y1)
    d.line([a, b], fill=GOLD_D, width=3)
    for p in (a, b):
        d.line([(p[0] - 12, p[1]), (p[0] + 12, p[1])], fill=GOLD_D, width=3)
    m = (a[0], (a[1] + b[1]) / 2)
    lay = Image.new('RGBA', (240, 44), (0, 0, 0, 0)); ld = ImageDraw.Draw(lay)
    tw = ld.textlength(label, font=f(700, 26)) + 18
    ld.rectangle([120 - tw / 2, 5, 120 + tw / 2, 39], fill=PAPIER)
    ld.text((120, 22), label, font=f(700, 26), fill=GOLD_D, anchor='mm')
    lay = lay.rotate(90, expand=True)
    img.paste(lay, (int(m[0] - lay.width / 2), int(m[1] - lay.height / 2)), lay)


# ------------------------------------------------------------------ Umgebung (ca.)
# Hochstraße hinter den Altbauten
rect(-31, -17, -19, 34, fill='#B9BAC4')
for k in (-28, -22):
    gestrichelt(P(k, -17), P(k, 34), '#F4F1EA', 3)
d.line([P(-25, -17), P(-25, 34)], fill='#F4F1EA', width=4)
rect(-19, -17, -18.4, 34, fill='#9C9DAA')
box(-25, 30, 'HOCHSTRASSE', 22, 800)
box(-25, 28.4, 'erhöht, 2 Spuren je Richtung', 16, 600, NAVY, '#DCDDE3')
# Gasse
rect(-18.4, -6.5, 72, 0, fill='#D8D2C4')
d.line([P(-18.4, -6.5), P(62, -6.5)], fill='#6E6A62', width=4); d.line([P(-18.4, 0), P(62, 0)], fill='#6E6A62', width=4)
text(30, -3.3, 'GASSE  ·  Verbundpflaster, ca. 6,5 m', 26, 700, '#5A564E')
# Altbauten links (Rückseiten zum Grundstück) + hellblaues Haus mit Außentreppe
rect(-18.4, 7, -0.3, 30, fill='#B5654A', outline='#7E3F2C', width=3)
text(-12.2, 20.5, 'BACKSTEIN-', 22, 800, '#FFFFFF'); text(-12.2, 19.2, 'ALTBAUTEN', 22, 800, '#FFFFFF'); text(-12.2, 17.7, '3–4 Geschosse,', 16, 600, '#FFFFFF'); text(-12.2, 16.7, 'Rückseiten', 16, 600, '#FFFFFF')
rect(-18.4, 0, -0.3, 7, fill='#C9DCEA', outline='#7F9BB1', width=3)
text(-12.2, 4.6, 'Hellblaues Haus', 19, 700, NAVY); text(-12.2, 3.1, 'mit Außentreppe', 17, 600, NAVY)
# Hinten: Backsteinmauer mit Betonpfeilern, dahinter altes Hallendach
rect(-0.3, 28.3, 52, 33.5, fill='#C7C4BB')
text(8, 31, 'altes Hallendach (Wellplatten)', 20, 600, '#5E5B53')
# Langes Nachbargebäude (rechts / hinter dem langen Teil)
rect(15.8, 12.3, 52, 28.3, fill='#C9CAD3', outline='#8E8FA0', width=3)
for i in range(9):
    rect(19 + i * 3.6, 22.5, 20.6 + i * 3.6, 24.3, fill='#9FB6CF')
text(34, 18.6, 'LANGES NACHBARGEBÄUDE', 24, 800, NAVY)
text(34, 16.8, 'helle Putzfassade, graues Dach mit Dachfenstern', 19, 600, NAVY)
text(17, 20.2, 'Stirnwand', 17, 700, NAVY, anchor='lm')
# Rechts daneben
rect(48, 0, 58, 12.3, fill='#E3DED3', outline='#B9B2A3', width=2)
text(53, 8.5, 'Nachbar', 17, 600, GRAU)
# Gegenüber: weißes Haus + Schornstein
rect(3, -16.5, 14, -8.2, fill='#FFFFFF', outline='#A7A7A7', width=3)
rect(3, -8.2, 14, -6.5, fill='#C9A79E')
text(8.5, -11.6, 'Weißes Haus', 19, 800, NAVY); text(8.5, -13.2, '2 Geschosse, Glas-Vordach', 15, 600, NAVY)
cx, cy, r = 15.6, -8.4, 1.6
d.ellipse([P(cx - r, cy + r), P(cx + r, cy - r)], fill='#9C3B2A', outline='#5E2015', width=4)
d.ellipse([P(cx - 0.8, cy + 0.8), P(cx + 0.8, cy - 0.8)], fill='#3A1A12')
text(cx + 2.4, -8.6, 'SCHORNSTEIN', 24, 800, '#9C3B2A', anchor='lm')
text(cx + 2.4, -10.1, 'rund, Backstein, ca. 25–30 m hoch', 18, 600, '#9C3B2A', anchor='lm')
# Torgebäude am Ende der Gasse
rect(62, -11, 72, 7, fill='#EFE7D6', outline='#B7A98C', width=3)
rect(63.2, -6.5, 70.8, 0, fill='#3D3B38')
text(67, 4.6, 'Torgebäude', 19, 800, NAVY); text(67, 3.0, '(weiter hinten)', 15, 600, NAVY)
text(67, -3.3, 'Durchfahrt', 15, 700, '#FFFFFF')
for (tx, ty, tr, col) in ((68, 11.5, 2.6, '#3F5E3A'), (59, 15, 1.9, '#7B6E5B')):
    d.ellipse([P(tx - tr, ty + tr), P(tx + tr, ty - tr)], fill=col)
text(68, 15.2, 'Kiefer', 16, 700, NAVY); text(59, 18, 'Laubbaum', 16, 700, NAVY)
d.rectangle([P(55.6, 23.6), P(56.4, 22.8)], fill=NAVY); text(56, 25, 'Funkmast', 16, 700, NAVY)

# ------------------------------------------------------------------ Grundstück
GR = [(0, 0), (47.5, 0), (47.5, 12), (15.5, 12), (15.5, 28), (0, 28)]
# Vorplatz
rect(0, 0, 15.5, 3, fill='#E4DCCB')
for i in range(1, 16):
    d.line([P(i, 0), P(i, 3)], fill='#D2C8B4', width=1)
text(5.0, 0.95, 'VORPLATZ ~3 m', 16, 800, NAVY)
# Moschee (Dach: Gründach + PV)
rect(0, 3, 15.5, 15, fill='#7FA36A')
for i in range(10):
    x = 1.0 + i * 1.42
    rect(x, 4.0, x + 0.95, 14.0, fill=NAVY_D)
d.line([P(0, 3), P(15.5, 3)], fill='#5FA3D6', width=9)          # Glasfassade
rect(12.9, 2.5, 15.5, 3.6, fill='#E9E0CC', outline='#B5A786', width=2)   # Portal
rect(0, 3, 15.5, 15, outline=NAVY, width=5)
lab = [(7.75, 9.9, 'MOSCHEE', 34, 800, '#FFFFFF'), (7.75, 8.3, '2 Geschosse + Keller · ca. 10 m hoch', 18, 700, '#FFFFFF'),
       (7.75, 6.9, 'Gründach + 10 PV-Reihen', 18, 600, '#FFFFFF')]
for x, y, s, sz, w, c in lab:
    tw = d.textlength(s, font=f(w, sz))
    d.rectangle([P(x, y)[0] - tw / 2 - 10, P(x, y)[1] - sz * 0.7, P(x, y)[0] + tw / 2 + 10, P(x, y)[1] + sz * 0.7], fill=NAVY)
    text(x, y, s, sz, w, c)
text(14.2, 1.2, 'Portal', 17, 800, GOLD_D)
# Keller (gestrichelt, nur unter der Moschee)
for a, b in (((-0.6, 2.4), (16.1, 2.4)), ((16.1, 2.4), (16.1, 15.6)), ((16.1, 15.6), (-0.6, 15.6)), ((-0.6, 15.6), (-0.6, 2.4))):
    gestrichelt(P(*a), P(*b), GOLD, 3)
# Hof
rect(0, 15, 15.5, 28, fill='#E8DFCE')
for i in range(1, 13):
    d.line([P(0, 15 + i), P(15.5, 15 + i)], fill='#D9CDB6', width=1)
rect(0, 15, 15.5, 28, outline='#9A8F7A', width=8)
for (tx, ty) in ((4.5, 19.5), (11, 19.5), (2.2, 26), (13.3, 26)):
    rect(tx - 1.1, ty - 1.1, tx + 1.1, ty + 1.1, fill='#B9A98C'); d.ellipse([P(tx - 1.4, ty + 1.4), P(tx + 1.4, ty - 1.4)], fill='#6F8F55')
for (bx, by) in ((5.5, 26.6), (10, 26.6)):
    rect(bx - 1.2, by - 0.4, bx + 1.2, by + 0.4, fill='#8B5E3C')
for (sx, sy) in ((5, 23), (10.5, 23)):
    d.ellipse([P(sx - 1.4, sy + 1.4), P(sx + 1.4, sy - 1.4)], fill='#F4F1EA', outline='#B9A98C', width=3)
box(7.75, 17.0, 'HOF', 26, 800); text(7.75, 21.2, 'Olivenbäume, Bänke, Schirme', 15, 700, NAVY)
# Parken (4 schräge Plätze)
rect(15.5, 0, 24.5, 12, fill='#8C8D94')
for i in range(5):
    y = 1.5 + i * 2.5
    d.line([P(15.5, y), P(20.0, y + 2.2)], fill='#FFFFFF', width=4)
d.line([P(15.5, 1.5), P(15.5, 11.5)], fill='#FFFFFF', width=4)
box(21.7, 10.6, 'PARKEN', 19, 800); box(21.7, 9.3, '4 schräg, leer', 14, 600)
# Wohnwagen-Stellplätze
rect(24.5, 0, 47.5, 12, fill='#7E7F86')
rect(24.5, 11.3, 47.5, 12, fill='#4E7A43')
for i in range(8):
    x = 24.5 + i * 23 / 7
    d.line([P(x, 4.5), P(x, 11.3)], fill='#FFFFFF', width=4)
d.line([P(24.5, 4.5), P(47.5, 4.5)], fill='#FFFFFF', width=3)
for i in range(7):
    d.ellipse([P(26.1 + i * 23 / 7 - 0.25, 11.85), P(26.1 + i * 23 / 7 + 0.25, 11.45)], fill=GOLD)
box(36, 8.9, 'WOHNWAGEN-STELLPLÄTZE', 21, 800); box(36, 7.5, '7 Plätze je ca. 3,3 × 7,5 m, leer', 15, 600); box(36, 6.3, 'hinten Hecke + Wandleuchten', 15, 600)
# Zaun + Schiebetor (rechts, freitragend, rollt nach links hinter das feste Feld)
d.line([P(24.5, 0.3), P(41.5, 0.3)], fill=NAVY_D, width=8)
for i in range(4):
    x = 24.5 + i * 17 / 3
    d.ellipse([P(x - 0.25, 0.55), P(x + 0.25, 0.05)], fill=NAVY_D)
d.line([P(41.5, 0.3), P(47.5, 0.3)], fill=GOLD, width=10)
gestrichelt(P(35.2, 0.9), P(41.5, 0.9), GOLD_D, 3)
d.line([P(43.5, 1.6), P(39.5, 1.6)], fill=GOLD_D, width=4)
d.polygon([P(38.8, 1.6), P(39.6, 2.0), P(39.6, 1.2)], fill=GOLD_D)
box(44.5, 3.0, 'Schiebetor 6 m', 15, 800, NAVY, GOLD)
text(30, 1.6, 'Stabgitterzaun', 15, 700, '#FFFFFF')
# Grundstücksgrenze
for a, b in zip(GR, GR[1:] + GR[:1]):
    gestrichelt(P(*a), P(*b), '#C0392B', 5, 22, 10)

# ------------------------------------------------------------------ Maße
mass_h(0, 47.5, 37.6, 'ca. 48 m an der Gasse (15,5 + 32)')
mass_h(0, 15.5, 35.4, '15,5 m')
mass_h(15.5, 24.5, 35.4, '9 m'); mass_h(24.5, 47.5, 35.4, '23 m')
mass_v(-5.0, 0, 28, 'ca. 28 m tief')
mass_v(50.0, 0, 12, '12 m')

# kleine Teilmaße als Text
d.line([P(-1.8, 0), P(-1.8, 28)], fill=GOLD_D, width=3)
for yy in (0, 3, 15, 28):
    d.line([P(-2.3, yy), P(-1.3, yy)], fill=GOLD_D, width=3)
for yy, s_ in ((1.5, '3'), (9.0, '12 m'), (21.5, '13 m')):
    box(-1.8, yy, s_, 15, 800, GOLD_D, PAPIER)

# ------------------------------------------------------------------ Kopf, Legende, Maßstab, Hinweise
d.rectangle([0, 0, W, 150], fill=NAVY)
d.text((70, 52), 'LAGEPLAN', font=f(800, 50), fill=GOLD, anchor='lm')
d.text((70, 110), 'PROJEKT MOSCHEE NEUBAU  ·  Masjid As-Sunnah Ratingen  ·  Am Westbahnhof 31', font=f(600, 28), fill='#FFFFFF', anchor='lm')
try:
    logo = Image.open(os.path.join(ROOT, '..', 'gebet-video', 'assets', 'brand', 'logo-gestapelt-weiss.png')).convert('RGBA')
    logo.thumbnail((260, 120)); img.paste(logo, (W - logo.width - 60, (150 - logo.height) // 2), logo)
except FileNotFoundError:
    pass

# Maßstab
bx, by = 2240, 2010
for i in range(5):
    d.rectangle([bx + i * 2 * S, by, bx + (i + 1) * 2 * S, by + 14], fill=NAVY if i % 2 == 0 else PAPIER, outline=NAVY, width=2)
for m in (0, 5, 10):
    d.text((bx + m * S, by + 34), f'{m} m', font=f(700, 20), fill=NAVY, anchor='mm')
d.text((bx - 20, by + 7), 'Maßstab', font=f(700, 20), fill=NAVY, anchor='rm')

# Legende
lx, ly = 2240, 1700
d.text((lx, ly), 'LEGENDE', font=f(800, 26), fill=NAVY)
items = [('#C0392B', 'Grundstücksgrenze (ca. 818 m² bei diesen Maßen)', 'strich'), (GOLD, 'Keller (nur unter der Moschee, ca. 3 m tief)', 'strich'),
         ('#5FA3D6', 'Glasfassade', 'linie'), (GOLD, 'Schiebetor, freitragend (im Video zu)', 'linie'), (NAVY_D, 'PV-Module auf Gründach', 'kasten')]
for i, (c, s, art) in enumerate(items):
    y = ly + 50 + i * 40
    if art == 'strich':
        gestrichelt((lx, y), (lx + 60, y), c, 5, 14, 8)
    elif art == 'linie':
        d.line([(lx, y), (lx + 60, y)], fill=c, width=9)
    else:
        d.rectangle([lx + 10, y - 12, lx + 50, y + 12], fill=c)
    d.text((lx + 80, y), s, font=f(600, 21), fill=NAVY, anchor='lm')

# Hinweise
hx, hy = 70, 1760
hinweise = ['Maße aus dem Auftrag (aus dem Architektenplan abgeleitet, ca. ±1 m). Umgebung nach Fotos und Karte, Lage ca.',
            'Prüfen: 15,5 × 28 m + 32 × 12 m ergeben ca. 818 m², laut Plan 900 m² → Abgleich, sobald der Architektenplan da ist.',
            'Im Video bleiben Parken und Wohnwagen-Plätze leer (nur Markierungen). Keine Autos, keine Menschen.']
for i, s in enumerate(hinweise):
    d.text((hx, hy + i * 40), '•  ' + s, font=f(600, 22), fill=NAVY)

img.save(os.path.join(OUT, 'lageplan.png'))
img.convert('RGB').resize((1500, 1050), Image.LANCZOS).save(os.path.join(OUT, 'lageplan_klein.jpg'), quality=88)
print('fertig: out/phase1/lageplan.png')
