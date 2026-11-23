#!/usr/bin/env python3
"""Erzeugt die Texturen für den Festsaal im Keller (Ayman 23.11., Vorlage: sein Video vom Festsaal):
- marmor.jpg: weiße, glänzende Feinsteinzeug-Platten 120×120 cm mit feinen braun-goldenen Adern (4×4 Platten = 4,8 m Muster)
- teppich.jpg: heller Teppich mit dunkler Ornament-Bordüre, spitz zulaufendem Innenfeld und Mittelmedaillon (2,4 × 3,6 m)
Nur geometrische Ornamente (keine Gesichter, keine Schrift). Aufruf aus neubau-video/: python3 tools/festsaal_texturen.py"""
import math, os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ZIEL = os.path.join(os.path.dirname(__file__), '..', 'assets', 'tex', 'festsaal'); os.makedirs(ZIEL, exist_ok=True)
rng = np.random.default_rng(7)


def rauschen(n, okt=5, start=4, seed=0):
    r = np.random.default_rng(seed); out = np.zeros((n, n)); amp = 1.0; summe = 0
    for o in range(okt):
        g = start * 2 ** o
        z = (r.random((g, g)) * 255).astype(np.uint8)
        out += amp * np.asarray(Image.fromarray(z.astype(np.float32) / 255, mode='F').resize((n, n), Image.BICUBIC), dtype=float)
        summe += amp; amp *= 0.5
    return out / summe


def gestreckt(n, seed, start, okt, streck, winkel):
    """Rauschen, entlang einer Richtung gestreckt → lange, schräge Adern wie bei Calacatta-Feinsteinzeug."""
    m = int(n * 1.5)
    r = rauschen(m, okt, start, seed)
    img = Image.fromarray(r.astype(np.float32), mode='F').resize((m, max(8, int(m / streck))), Image.BICUBIC).resize((m, m), Image.BICUBIC)
    img = img.rotate(winkel, resample=Image.BICUBIC)
    o = (m - n) // 2
    return np.asarray(img, dtype=float)[o:o + n, o:o + n]


def platte(n, seed):
    """Eine Marmorplatte: warmes Weiß, leichte Wolken, wenige feine, lange Adern (Grat-Rauschen, gestreckt)."""
    r0 = np.random.default_rng(seed)
    wolke = rauschen(n, 4, 2, seed)
    basis = np.stack([0.958 + 0.025 * (wolke - 0.5), 0.952 + 0.025 * (wolke - 0.5), 0.94 + 0.03 * (wolke - 0.5)], -1)
    w = 25 + r0.uniform(-20, 20)
    ader = np.zeros((n, n))
    # (Linienbreite im Rauschwert, Stärke, Oktaven, Streckung): 1 Hauptader, 2 feine Nebenadern, Haarrisse
    # (Linienbreite in Pixel, Stärke, Oktaven, Streckung): Abstand zur Iso-Linie über den Gradienten → gleichmäßig feine Adern
    for k, (px, staerke, okt, streck) in enumerate(((2.2, 0.85, 5, 5.0), (1.2, 0.55, 6, 4.0), (0.8, 0.35, 6, 3.0))):
        r = gestreckt(n, seed * 10 + k, 2, okt, streck, w + r0.uniform(-20, 20))
        gy, gx = np.gradient(r)
        dist = np.abs(r - 0.5) / (np.hypot(gx, gy) + 1e-6)
        linie = np.clip(1 - dist / px, 0, 1)
        if k == 0 and r0.random() < 0.35:
            linie *= 0                                       # manche Platten fast ohne Hauptader
        ader = np.maximum(ader, staerke * linie)
    weich = np.asarray(Image.fromarray((ader * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2.5)), dtype=float) / 255
    ader = np.clip(ader + weich * 0.35, 0, 1)
    farbe_ader = np.array([0.55, 0.45, 0.36])           # braun-gold wie im Video
    return basis * (1 - ader[..., None]) + farbe_ader * ader[..., None]


N, K = 512, 4
atlas = np.zeros((N * K, N * K, 3))
for i in range(K):
    for j in range(K):
        t = platte(N, 100 + i * K + j)
        t = np.rot90(t, (i + j) % 4)
        atlas[i * N:(i + 1) * N, j * N:(j + 1) * N] = t
# Fugen: 2 px hellgrau
for k in range(K + 1):
    a = min(k * N, N * K - 1)
    atlas[max(a - 1, 0):a + 1, :] = (0.80, 0.79, 0.77); atlas[:, max(a - 1, 0):a + 1] = (0.80, 0.79, 0.77)
Image.fromarray((np.clip(atlas, 0, 1) * 255).astype(np.uint8)).save(os.path.join(ZIEL, 'marmor.jpg'), quality=92)
print('marmor.jpg')

# ------------------------------------------------------------------ Teppich
W, H = 1024, 1536
creme, dunkel, gold, feld = (232, 222, 200), (78, 72, 54), (176, 150, 96), (236, 228, 210)
im = Image.new('RGB', (W, H), dunkel); d = ImageDraw.Draw(im)


def stern(cx, cy, r, f, spitzen=8, tief=0.55, dreh=0.0):
    pts = []
    for k in range(spitzen * 2):
        rr = r if k % 2 == 0 else r * tief; a = dreh + math.pi * k / spitzen
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    d.polygon(pts, fill=f)


def muster_flaeche(x0, y0, x1, y1, schritt=40):
    """Dichtes Ornament (helle Linien/Sterne auf dunklem Grund)."""
    for yy in range(int(y0), int(y1), schritt):
        for xx in range(int(x0), int(x1), schritt):
            cx, cy = xx + schritt / 2, yy + schritt / 2
            stern(cx, cy, schritt * 0.42, gold, 8, 0.6)
            stern(cx, cy, schritt * 0.26, dunkel, spitzen=8, tief=0.6, dreh=math.pi / 8)
            d.ellipse((cx - 3, cy - 3, cx + 3, cy + 3), fill=creme)
            d.line((xx, yy, xx + schritt, yy + schritt), fill=(120, 108, 80), width=1)
            d.line((xx + schritt, yy, xx, yy + schritt), fill=(120, 108, 80), width=1)


B = 110                                   # Bordürenbreite
d.rectangle((0, 0, W, H), fill=dunkel)
# Bordüre: Kartuschen-Reihe
for k in range(0, H, 64):
    for x in (B / 2, W - B / 2):
        stern(x, k + 32, 34, gold, 8, 0.62); stern(x, k + 32, 20, dunkel, 8, 0.6, math.pi / 8); d.ellipse((x - 6, k + 26, x + 6, k + 38), fill=creme)
for k in range(0, W, 64):
    for y in (B / 2, H - B / 2):
        stern(k + 32, y, 34, gold, 8, 0.62); stern(k + 32, y, 20, dunkel, 8, 0.6, math.pi / 8); d.ellipse((k + 26, y - 6, k + 38, y + 6), fill=creme)
for off, c, w in ((6, creme, 4), (B - 8, gold, 5), (B, creme, 3)):
    d.rectangle((off, off, W - off, H - off), outline=c, width=w)
# Innenfläche: Ornament, darauf das helle Feld mit spitzen Enden
muster_flaeche(B + 4, B + 4, W - B - 4, H - B - 4)
x0, x1, y0, y1, h = B + 40, W - B - 40, B + 40, H - B - 40, 260
feldpoly = [(x0, y0 + h), (W / 2, y0), (x1, y0 + h), (x1, y1 - h), (W / 2, y1), (x0, y1 - h)]
d.polygon(feldpoly, fill=feld)
d.line(feldpoly + [feldpoly[0]], fill=gold, width=8)
d.line([(x + (W / 2 - x) * 0.04, y + (H / 2 - y) * 0.03) for x, y in feldpoly] + [(feldpoly[0][0] + (W / 2 - feldpoly[0][0]) * 0.04, feldpoly[0][1] + (H / 2 - feldpoly[0][1]) * 0.03)], fill=dunkel, width=3)
# Medaillon in der Mitte
cx, cy = W / 2, H / 2
stern(cx, cy, 150, dunkel, 8, 0.72); stern(cx, cy, 126, gold, 8, 0.72, math.pi / 8); stern(cx, cy, 104, creme, 8, 0.7)
stern(cx, cy, 86, dunkel, 16, 0.8); stern(cx, cy, 58, gold, 8, 0.6, math.pi / 8); stern(cx, cy, 36, dunkel, 8, 0.6)
d.ellipse((cx - 12, cy - 12, cx + 12, cy + 12), fill=creme)
for a in range(16):                                       # Rankenpunkte um das Medaillon
    ang = 2 * math.pi * a / 16; d.ellipse((cx + 170 * math.cos(ang) - 7, cy + 170 * math.sin(ang) - 7, cx + 170 * math.cos(ang) + 7, cy + 170 * math.sin(ang) + 7), fill=gold)
# Webstruktur + leichte Unschärfe
a = np.asarray(im.filter(ImageFilter.GaussianBlur(1.1)), dtype=float)
korn = rng.normal(0, 7, (H, W, 1)) + 6 * np.sin(np.arange(W) * 2.1)[None, :, None] * np.sin(np.arange(H) * 1.7)[:, None, None]
Image.fromarray(np.clip(a + korn, 0, 255).astype(np.uint8)).save(os.path.join(ZIEL, 'teppich.jpg'), quality=92)
print('teppich.jpg')
