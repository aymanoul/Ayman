"""Textsatz: Latein (Montserrat) und Arabisch (RAQM, RTL, korrekt verbunden)."""
import re
from functools import lru_cache
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

FONTS = Path(__file__).parent / "fonts"
RAQM = ImageFont.Layout.RAQM

AR_RE = re.compile(r"[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]")
# Arabische Läufe (inkl. Leerzeichen zwischen arabischen Wörtern)
AR_RUN_RE = re.compile(r"[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]+"
                       r"(?:\s+[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]+)*")


def quran_font_file():
    k = FONTS / "KFGQPC_HAFS.ttf"
    return k if k.exists() else FONTS / "AmiriQuran.ttf"


@lru_cache(maxsize=None)
def font(name, size):
    files = {
        "regular": "Montserrat-Regular.ttf",
        "semibold": "Montserrat-SemiBold.ttf",
        "bold": "Montserrat-Bold.ttf",
        "extrabold": "Montserrat-ExtraBold.ttf",
        "cormorant": "CormorantGaramond-Bold.ttf",
        "amiri": "Amiri-Regular.ttf",
        "amiriquran": "AmiriQuran.ttf",
        "quran": str(quran_font_file().name),
    }
    return ImageFont.truetype(str(FONTS / files[name]), size, layout_engine=RAQM)


def hexrgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def _run_img(text, fnt, fill, rtl):
    """Rendert einen einzelnen Lauf; gibt (RGBA-Image, ascent-Offset) zurück."""
    kw = {"direction": "rtl", "language": "ar"} if rtl else {}
    asc, desc = fnt.getmetrics()
    bbox = fnt.getbbox(text, **kw)
    w = max(1, bbox[2] - min(0, bbox[0]))
    top = min(0, bbox[1])
    h = max(asc + desc, bbox[3]) - top
    pad = 4
    img = Image.new("RGBA", (w + 2 * pad, h + 2 * pad), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.text((pad - min(0, bbox[0]), pad - top), text, font=fnt, fill=fill, **kw)
    # Baseline-Position im Bild
    baseline = pad - top + asc
    adv = fnt.getlength(text, **kw)
    return img, baseline, adv, pad - min(0, bbox[0])


def render_runs(runs):
    """runs: Liste von (text, font, fill, rtl). Läufe werden links->rechts auf
    gemeinsamer Grundlinie gesetzt. Gibt RGBA-Image + Baseline-y zurück."""
    pieces = []
    for text, fnt, fill, rtl in runs:
        if text == "":
            continue
        pieces.append(_run_img(text, fnt, fill, rtl))
    if not pieces:
        return Image.new("RGBA", (1, 1)), 0
    max_base = max(p[1] for p in pieces)
    max_below = max(p[0].height - p[1] for p in pieces)
    x = 0
    placements = []
    for img, base, adv, x0 in pieces:
        placements.append((img, x - x0, max_base - base))
        x += adv
    left = min(px for _, px, _ in placements)
    right = max(px + im.width for im, px, _ in placements)
    out = Image.new("RGBA", (int(right - left) + 1, max_base + max_below), (0, 0, 0, 0))
    for im, px, py in placements:
        out.alpha_composite(im, (int(round(px - left)), int(py)))
    return out, max_base


def runs_width(runs):
    w = 0
    for text, fnt, fill, rtl in runs:
        kw = {"direction": "rtl", "language": "ar"} if rtl else {}
        w += fnt.getlength(text, **kw)
    return w


def split_mixed(text, latin_font, fill, arabic_font=None):
    """Teilt einen deutschen Text mit eingebetteten arabischen Läufen
    (z. B. عليه السلام, ﷻ) in Runs mit passender Schrift."""
    arabic_font = arabic_font or font("amiri", int(latin_font.size * 1.05))
    runs, pos = [], 0
    for m in AR_RUN_RE.finditer(text):
        if m.start() > pos:
            runs.append((text[pos:m.start()], latin_font, fill, False))
        runs.append((m.group(0), arabic_font, fill, True))
        pos = m.end()
    if pos < len(text):
        runs.append((text[pos:], latin_font, fill, False))
    return runs


def add_shadow(img, radius=7, opacity=0.85, offset=(0, 3), spread=2):
    """Weicher schwarzer Schatten unter einem RGBA-Textbild."""
    pad = radius * 3 + spread
    W, H = img.width + 2 * pad, img.height + 2 * pad
    a = Image.new("L", (W, H), 0)
    a.paste(img.getchannel("A"), (pad + offset[0], pad + offset[1]))
    if spread:
        a = a.filter(ImageFilter.MaxFilter(spread * 2 + 1))
    a = a.filter(ImageFilter.GaussianBlur(radius))
    a = a.point(lambda v: int(v * opacity))
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sh.putalpha(a)
    sh.alpha_composite(img, (pad, pad))
    return sh, pad


def to_premult(img):
    arr = np.asarray(img, dtype=np.float32) / 255.0
    rgb = arr[..., :3] * arr[..., 3:4]
    return rgb, arr[..., 3]


def wrap_words(text, fnt, max_w, rtl=False):
    kw = {"direction": "rtl", "language": "ar"} if rtl else {}
    words, lines, cur = text.split(" "), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if fnt.getlength(t, **kw) <= max_w or not cur:
            cur = t
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def balanced_wrap(text, fnt, max_w, rtl=False):
    """Umbruch mit möglichst gleich langen Zeilen."""
    lines = wrap_words(text, fnt, max_w, rtl)
    n = len(lines)
    if n <= 1:
        return lines
    kw = {"direction": "rtl", "language": "ar"} if rtl else {}
    words = text.split(" ")
    lo, hi = 1, max_w
    best = lines
    while hi - lo > 4:
        mid = (lo + hi) / 2
        cand = wrap_words(text, fnt, mid, rtl)
        if len(cand) <= n and all(fnt.getlength(l, **kw) <= max_w for l in cand):
            best, hi = cand, mid
        else:
            lo = mid
    return best
