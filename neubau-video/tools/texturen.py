#!/usr/bin/env python3
"""Phase 2: Foto-Texturen aus Aymans Fotos (assets/ref/neubau/umgebung) → assets/tex/*.jpg

- schornstein.jpg : Backstein mit Putzflicken (Ausschnitt aus gasse_schornstein_nah, fast frontal), ca. 0,7 × 2,1 m
- mauer.jpg       : alte Backsteinmauer hinten (grundstueck_links_altbauten, über dem Bauzaun), ca. 2,2 × 0,9 m
- pflaster.jpg    : Verbundpflaster der Gasse, perspektivisch entzerrt (gasse_blick_zum_torgebaeude), ca. 2 × 2 m
    python3 tools/texturen.py
"""
import os
from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
REF = os.path.join(ROOT, 'assets', 'ref', 'neubau', 'umgebung')
TEX = os.path.join(ROOT, 'assets', 'tex')
os.makedirs(TEX, exist_ok=True)


def perspektive(img, quad, groesse):
    """quad = 4 Bildpunkte (oben links, oben rechts, unten rechts, unten links) → Rechteck groesse."""
    w, h = groesse
    (x0, y0), (x1, y1), (x2, y2), (x3, y3) = quad
    return img.transform((w, h), Image.QUAD, (x0, y0, x3, y3, x2, y2, x1, y1), Image.BICUBIC)


a = Image.open(os.path.join(REF, 'gasse_schornstein_nah.jpg')).convert('RGB')
a.crop((2120, 0, 2560, 1450)).resize((440, 1320)).save(os.path.join(TEX, 'schornstein.jpg'), quality=92)

b = Image.open(os.path.join(REF, 'grundstueck_links_altbauten.jpg')).convert('RGB')
b.crop((1802, 664, 2096, 782)).resize((882, 354), Image.LANCZOS).save(os.path.join(TEX, 'mauer.jpg'), quality=92)

c = Image.open(os.path.join(REF, 'gasse_blick_zum_torgebaeude.jpg')).convert('RGB')
p = perspektive(c, [(1040, 1010), (1380, 1010), (1720, 1440), (700, 1440)], (768, 768))
p.save(os.path.join(TEX, 'pflaster.jpg'), quality=92)
print('fertig:', sorted(os.listdir(TEX)))
