#!/usr/bin/env python3
"""Phase 1: Lageplan von oben mit Maßen und Beschriftung → out/phase1/lageplan.png (3000 × 2100).

Koordinaten in Metern: x nach rechts entlang der Gasse (0 = linke Grundstücksecke an den Altbauten),
y nach hinten (0 = Grundstücksgrenze an der Gasse). Grundstück nach Architektenplan 1.01 (900 m²), Umgebung nach Fotos/Karte (ca.).
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
# Maße nach Architektenplan 1.01 (Konzept Ersatzbau, 24.03.2025), aus dem Plan-Foto abgegriffen (ca. ±0,5 m):
# Grundstück 900 m², Länge an der Gasse ca. 50 m; tiefer Teil 16,5 × 29 m, langer Teil 33,5 × 12,3 m (16,5·29 + 33,5·12,3 ≈ 891 m²).
L, BT, TT, LT = 50.0, 16.5, 29.0, 12.3     # Länge, Breite tiefer Teil, Tiefe tiefer Teil, Tiefe langer Teil
VOR, MT = 3.0, 12.0                         # Vorplatz, Moschee-Tiefe → Hof = TT − VOR − MT = 14 m
HOF0 = VOR + MT
PK = BT + 9.0                               # Ende Parkfläche
TOR = L - 6.0                               # Beginn Schiebetor
# Langes Nachbargebäude (hinter dem langen Teil, Stirnwand zum Hof)
rect(BT + 0.3, LT + 0.3, L + 4.5, TT + 0.3, fill='#C9CAD3', outline='#8E8FA0', width=3)
for i in range(9):
    rect(BT + 4 + i * 3.6, 23.5, BT + 5.6 + i * 3.6, 25.3, fill='#9FB6CF')
text((BT + L) / 2 + 2, 19.6, 'LANGES NACHBARGEBÄUDE', 24, 800, NAVY)
text((BT + L) / 2 + 2, 17.8, 'helle Putzfassade, graues Dach mit Dachfenstern', 19, 600, NAVY)
text(BT + 1.5, 21.2, 'Stirnwand', 17, 700, NAVY, anchor='lm')
# Rechts daneben
rect(L + 0.5, 0, L + 4.5, LT + 0.3, fill='#E3DED3', outline='#B9B2A3', width=2)
text(L + 2.5, 8.5, 'Nachbar', 15, 600, GRAU)
# Gegenüber: weißes Haus + Schornstein (gegenüber dem Portal)
cx, cy, r = BT + 0.4, -8.4, 1.6
rect(cx - 13.5, -16.5, cx - 1.7, -8.2, fill='#FFFFFF', outline='#A7A7A7', width=3)
rect(cx - 13.5, -8.2, cx - 1.7, -6.5, fill='#C9A79E')
text(cx - 7.6, -11.6, 'Weißes Haus', 19, 800, NAVY); text(cx - 7.6, -13.2, '2 Geschosse, Glas-Vordach', 15, 600, NAVY)
d.ellipse([P(cx - r, cy + r), P(cx + r, cy - r)], fill='#9C3B2A', outline='#5E2015', width=4)
d.ellipse([P(cx - 0.8, cy + 0.8), P(cx + 0.8, cy - 0.8)], fill='#3A1A12')
text(cx + 2.4, -8.6, 'SCHORNSTEIN', 24, 800, '#9C3B2A', anchor='lm')
text(cx + 2.4, -10.1, 'rund, Backstein, ca. 25–30 m hoch', 18, 600, '#9C3B2A', anchor='lm')
# Torgebäude am Ende der Gasse (weiter hinten)
rect(62, -11, 72, 7, fill='#EFE7D6', outline='#B7A98C', width=3)
rect(63.2, -6.5, 70.8, 0, fill='#3D3B38')
text(67, 4.6, 'Torgebäude', 19, 800, NAVY); text(67, 3.0, '(weiter hinten)', 15, 600, NAVY)
text(67, -3.3, 'Durchfahrt', 15, 700, '#FFFFFF')
for (tx, ty, tr, col) in ((68, 11.5, 2.6, '#3F5E3A'), (60, 16, 1.9, '#7B6E5B')):
    d.ellipse([P(tx - tr, ty + tr), P(tx + tr, ty - tr)], fill=col)
text(68, 15.2, 'Kiefer', 16, 700, NAVY); text(60, 19, 'Laubbaum', 16, 700, NAVY)
d.rectangle([P(57.6, 24.6), P(58.4, 23.8)], fill=NAVY); text(58, 26, 'Funkmast', 16, 700, NAVY)

# ------------------------------------------------------------------ Grundstück
GR = [(0, 0), (L, 0), (L, LT), (BT, LT), (BT, TT), (0, TT)]
# Vorplatz
rect(0, 0, BT, VOR, fill='#E4DCCB')
for i in range(1, int(BT) + 1):
    d.line([P(i, 0), P(i, VOR)], fill='#D2C8B4', width=1)
text(5.0, 0.95, 'VORPLATZ ~3 m', 16, 800, NAVY)
# Moschee (Dach: Gründach + PV, 10 Reihen von der Glasfront nach hinten)
rect(0, VOR, BT, HOF0, fill='#7FA36A')
for i in range(10):
    x = 1.0 + i * (BT - 2.0) / 10 + 0.1
    rect(x, VOR + 1.0, x + 1.0, HOF0 - 1.0, fill=NAVY_D)
d.line([P(0, VOR), P(BT, VOR)], fill='#5FA3D6', width=9)                 # Glasfassade
rect(BT - 2.6, VOR - 0.5, BT, VOR + 0.6, fill='#E9E0CC', outline='#B5A786', width=2)   # Portal
rect(0, VOR, BT, HOF0, outline=NAVY, width=5)
lab = [(BT / 2, 9.9, 'MOSCHEE', 34, 800, '#FFFFFF'), (BT / 2, 8.3, '16,5 × 12 m · 2 Geschosse + Keller · ca. 10 m', 17, 700, '#FFFFFF'),
       (BT / 2, 6.9, 'Gründach + 10 PV-Reihen', 17, 600, '#FFFFFF')]
for x, y, s, sz, w, c in lab:
    tw = d.textlength(s, font=f(w, sz))
    d.rectangle([P(x, y)[0] - tw / 2 - 10, P(x, y)[1] - sz * 0.7, P(x, y)[0] + tw / 2 + 10, P(x, y)[1] + sz * 0.7], fill=NAVY)
    text(x, y, s, sz, w, c)
text(BT - 1.3, 1.2, 'Portal', 17, 800, GOLD_D)
# Keller (gestrichelt, nur unter der Moschee)
k0, k1, k2, k3 = -0.6, BT + 0.6, VOR - 0.6, HOF0 + 0.6
for a, b in (((k0, k2), (k1, k2)), ((k1, k2), (k1, k3)), ((k1, k3), (k0, k3)), ((k0, k3), (k0, k2))):
    gestrichelt(P(*a), P(*b), GOLD, 3)
# Hof
rect(0, HOF0, BT, TT, fill='#E8DFCE')
for i in range(1, int(TT - HOF0)):
    d.line([P(0, HOF0 + i), P(BT, HOF0 + i)], fill='#D9CDB6', width=1)
rect(0, HOF0, BT, TT, outline='#9A8F7A', width=8)
for (tx, ty) in ((4.6, 19.8), (BT - 4.6, 19.8), (2.2, TT - 2.2), (BT - 2.2, TT - 2.2)):
    rect(tx - 1.1, ty - 1.1, tx + 1.1, ty + 1.1, fill='#B9A98C'); d.ellipse([P(tx - 1.4, ty + 1.4), P(tx + 1.4, ty - 1.4)], fill='#6F8F55')
for (bx, by) in ((BT / 2 - 2.4, TT - 1.4), (BT / 2 + 2.4, TT - 1.4)):
    rect(bx - 1.2, by - 0.4, bx + 1.2, by + 0.4, fill='#8B5E3C')
for (sx, sy) in ((BT / 2 - 2.8, 23.8), (BT / 2 + 2.8, 23.8)):
    d.ellipse([P(sx - 1.4, sy + 1.4), P(sx + 1.4, sy - 1.4)], fill='#F4F1EA', outline='#B9A98C', width=3)
box(BT / 2, 17.0, 'HOF', 26, 800); text(BT / 2, 21.4, 'Olivenbäume, Bänke, Schirme', 15, 700, NAVY)
# Parken (4 schräge Plätze)
rect(BT, 0, PK, LT, fill='#8C8D94')
for i in range(5):
    y = 1.5 + i * 2.5
    d.line([P(BT, y), P(BT + 4.5, y + 2.2)], fill='#FFFFFF', width=4)
d.line([P(BT, 1.5), P(BT, 11.5)], fill='#FFFFFF', width=4)
box(BT + 6.2, 10.6, 'PARKEN', 19, 800); box(BT + 6.2, 9.3, '4 schräg, leer', 14, 600)
# Wohnwagen-Stellplätze (7 × 3,5 m)
WB = (L - PK) / 7
rect(PK, 0, L, LT, fill='#7E7F86')
rect(PK, LT - 0.7, L, LT, fill='#4E7A43')
for i in range(8):
    x = PK + i * WB
    d.line([P(x, LT - 7.5), P(x, LT - 0.7)], fill='#FFFFFF', width=4)
d.line([P(PK, LT - 7.5), P(L, LT - 7.5)], fill='#FFFFFF', width=3)
for i in range(7):
    d.ellipse([P(PK + (i + 0.5) * WB - 0.25, LT - 0.15), P(PK + (i + 0.5) * WB + 0.25, LT - 0.55)], fill=GOLD)
mx = (PK + L) / 2
box(mx, 9.2, 'WOHNWAGEN-STELLPLÄTZE', 21, 800); box(mx, 7.8, '7 Plätze je ca. 3,5 × 7,5 m, leer', 15, 600); box(mx, 6.6, 'hinten Hecke + Wandleuchten', 15, 600)
# Zaun + Schiebetor (rechts, freitragend, rollt nach links hinter das feste Feld)
d.line([P(PK, 0.3), P(TOR, 0.3)], fill=NAVY_D, width=8)
for i in range(4):
    x = PK + i * (TOR - PK) / 3
    d.ellipse([P(x - 0.25, 0.55), P(x + 0.25, 0.05)], fill=NAVY_D)
d.line([P(TOR, 0.3), P(L, 0.3)], fill=GOLD, width=10)
gestrichelt(P(TOR - 6.3, 0.9), P(TOR, 0.9), GOLD_D, 3)
d.line([P(TOR + 2, 1.6), P(TOR - 2, 1.6)], fill=GOLD_D, width=4)
d.polygon([P(TOR - 2.7, 1.6), P(TOR - 1.9, 2.0), P(TOR - 1.9, 1.2)], fill=GOLD_D)
box(TOR + 3, 3.0, 'Schiebetor 6 m', 15, 800, NAVY, GOLD)
text(PK + 5.5, 1.6, 'Stabgitterzaun', 15, 700, '#FFFFFF')
# Grundstücksgrenze
for a, b in zip(GR, GR[1:] + GR[:1]):
    gestrichelt(P(*a), P(*b), '#C0392B', 5, 22, 10)

# ------------------------------------------------------------------ Maße
mass_h(0, L, 37.6, 'ca. 50 m an der Gasse')
mass_h(0, BT, 35.4, '16,5 m')
mass_h(BT, PK, 35.4, '9 m'); mass_h(PK, L, 35.4, '24,5 m')
mass_v(-5.0, 0, TT, 'ca. 29 m tief')
mass_v(L + 6.0, 0, LT, 'ca. 12,3 m')
d.line([P(-1.8, 0), P(-1.8, TT)], fill=GOLD_D, width=3)
for yy in (0, VOR, HOF0, TT):
    d.line([P(-2.3, yy), P(-1.3, yy)], fill=GOLD_D, width=3)
for yy, s_ in ((1.5, '3'), (9.0, '12 m'), (22.0, '14 m')):
    box(-1.8, yy, s_, 15, 800, GOLD_D, PAPIER)

# Nordpfeil (nach dem Lageplan im Architektenplan, ca.): Gasse läuft etwa nach NNW
nx, ny = 2620, 330
ang = math.radians(-22)          # Nord zeigt ca. 22° unter die Gassenrichtung (+x), zur Gasse hin
ux, uy = math.cos(ang), -math.sin(ang)
d.ellipse([nx - 58, ny - 58, nx + 58, ny + 58], outline=NAVY, width=3)
tip = (nx + ux * 52, ny + uy * 52); tail = (nx - ux * 40, ny - uy * 40)
d.line([tail, tip], fill=NAVY, width=5)
d.polygon([tip, (nx + ux * 18 - uy * 15, ny + uy * 18 + ux * 15), (nx + ux * 18 + uy * 15, ny + uy * 18 - ux * 15)], fill=NAVY)
d.text((nx + ux * 84, ny + uy * 84), 'N', font=f(800, 34), fill=NAVY, anchor='mm')
d.text((nx, ny + 92), 'Norden (ca.)', font=f(600, 18), fill=NAVY, anchor='mm')

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
items = [('#C0392B', 'Grundstücksgrenze (900 m² laut Plan)', 'strich'), (GOLD, 'Keller (nur unter der Moschee, ca. 3 m tief)', 'strich'),
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
hinweise = ['Grundstück nach Architektenplan 1.01 (kretz architekten, 24.03.2025): 900 m², Maße aus dem Plan abgegriffen, ca. ±0,5 m.',
            'Moschee, Hof, Parken, Wohnwagen und Tor nach Auftrag und Bildern. Umgebung nach Fotos und Karte, Lage ca.',
            'Im Video bleiben Parken und Wohnwagen-Plätze leer (nur Markierungen). Keine Autos, keine Menschen.']
for i, s in enumerate(hinweise):
    d.text((hx, hy + i * 40), '•  ' + s, font=f(600, 22), fill=NAVY)

img.save(os.path.join(OUT, 'lageplan.png'))
img.convert('RGB').resize((1500, 1050), Image.LANCZOS).save(os.path.join(OUT, 'lageplan_klein.jpg'), quality=88)
print('fertig: out/phase1/lageplan.png')
