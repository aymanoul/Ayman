#!/usr/bin/env python3
"""Damast-Tischdecke (Ayman 23.11., Vorlage assets/tisch_vorlage_ayman.png): Creme mit hellerem Ornament (Medaillons, Ranken,
Blätter – nur pflanzlich/geometrisch), kachelbar → assets/tex/festsaal/damast.jpg. Aufruf aus neubau-video/: python3 tools/damast_textur.py"""
import math, os
from PIL import Image, ImageDraw, ImageFilter
Z = os.path.join(os.path.dirname(__file__), '..', 'assets', 'tex', 'festsaal', 'damast.jpg')
N = 1024; bg = (236, 228, 212); hi = (246, 240, 228)
im = Image.new('RGB', (N, N), bg); d = ImageDraw.Draw(im)


def motiv(cx, cy, s):
    for k in range(8):
        a = k * math.pi / 4; x = cx + 0.32 * s * math.cos(a); y = cy + 0.42 * s * math.sin(a)
        d.ellipse((x - 0.11 * s, y - 0.06 * s, x + 0.11 * s, y + 0.06 * s), outline=hi, width=max(2, int(s * 0.025)))
    d.ellipse((cx - 0.2 * s, cy - 0.28 * s, cx + 0.2 * s, cy + 0.28 * s), outline=hi, width=max(3, int(s * 0.035)))
    d.ellipse((cx - 0.08 * s, cy - 0.12 * s, cx + 0.08 * s, cy + 0.12 * s), fill=hi)
    for sgn in (-1, 1):
        d.line([(cx + sgn * 0.2 * s * math.sin(t * math.pi), cy - 0.55 * s + t * 1.1 * s) for t in [i / 20 for i in range(21)]],
               fill=hi, width=max(2, int(s * 0.02)))
    for dy in (-0.62, 0.62):
        d.polygon([(cx, cy + dy * s - 0.08 * s), (cx + 0.05 * s, cy + dy * s), (cx, cy + dy * s + 0.08 * s), (cx - 0.05 * s, cy + dy * s)], fill=hi)


for ox in (-N, 0, N):
    for oy in (-N, 0, N):
        motiv(N / 4 + ox, N / 4 + oy, N / 2 * 0.9); motiv(3 * N / 4 + ox, 3 * N / 4 + oy, N / 2 * 0.9)
        for (fx, fy) in ((3 * N / 4, N / 4), (N / 4, 3 * N / 4)):
            for k in range(6):
                a = k * math.pi / 3; x = fx + ox + 40 * math.cos(a); y = fy + oy + 40 * math.sin(a)
                d.ellipse((x - 18, y - 9, x + 18, y + 9), outline=hi, width=3)
im = im.filter(ImageFilter.GaussianBlur(1.2))
lay = Image.new('L', (N * 3, N * 3), 0); dl = ImageDraw.Draw(lay)
for k in range(-3, 7):                                         # Ranken mit Blättern
    dl.line([(i, k * N / 2 + 0.5 * N * math.sin(2 * math.pi * i / N) + N) for i in range(0, 3 * N, 6)], fill=255, width=4)
    for i in range(0, 3 * N, N // 6):
        y = k * N / 2 + 0.5 * N * math.sin(2 * math.pi * i / N) + N; a = math.cos(2 * math.pi * i / N) * 0.9
        for sgn in (-1, 1):
            leaf = Image.new('L', (60, 30), 0); ImageDraw.Draw(leaf).ellipse((2, 4, 58, 26), fill=255)
            leaf = leaf.rotate(math.degrees(a) + sgn * 40, expand=True)
            lay.paste(255, (int(i + sgn * 22 * math.sin(a + 0.8) - leaf.size[0] / 2), int(y - sgn * 22 * math.cos(a + 0.8) - leaf.size[1] / 2)), leaf)
lay = lay.crop((N, N, 2 * N, 2 * N)).filter(ImageFilter.GaussianBlur(1.2))
Image.composite(Image.new('RGB', (N, N), hi), im, lay.point(lambda v: int(v * 0.8))).save(Z, quality=92)
print('damast.jpg')
