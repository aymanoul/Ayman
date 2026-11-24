"""Bildvorbereitung, Szenen, prozedurale Effekte, Farblook, Textebenen."""
import math
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

import textlib as T
from inhalt import (KEYWORDS, HOOK_LINES, HOOK_GOLD, DUA_AR, DUA_DE, DUA_SRC, QURAN_AR, QURAN_NR,
                    QURAN_DE, QURAN_SRC, HANDLE, OVERLAY_SENTENCES)

W, H = 1080, 1920
FPS = 30
BASE = (1305, 2320)  # >= 1300x2310, 9:16
ROOT = Path(__file__).parent
BUILD = ROOT / "build"

# Sichere Zone für Text
SAFE_L, SAFE_R, SAFE_T, SAFE_B = 40, W - 140, 160, H - 380
GOLD = T.hexrgb("#D9A862")
PERG = T.hexrgb("#F2E6CC")
NIGHT = np.array(T.hexrgb("#0B0F1F"), np.float32) / 255
SAND = np.array(GOLD, np.float32) / 255


# ================================================================ Bildvorbereitung
def esrgan_upscale(img, model_path):
    import onnxruntime as ort
    sess = ort.InferenceSession(str(model_path), providers=["CPUExecutionProvider"])
    name = sess.get_inputs()[0].name
    tile, ov = 64, 8
    x = np.asarray(img.convert("RGB"), np.float32) / 255
    h, w, _ = x.shape
    out = np.zeros((h * 4, w * 4, 3), np.float32)
    step = tile - 2 * ov
    xp = np.pad(x, ((ov, ov + tile), (ov, ov + tile), (0, 0)), mode="reflect")
    for ty in range(0, h, step):
        for tx in range(0, w, step):
            t = xp[ty:ty + tile, tx:tx + tile].transpose(2, 0, 1)[None]
            y = sess.run(None, {name: np.ascontiguousarray(t)})[0][0].transpose(1, 2, 0)
            core = y[ov * 4:(ov + step) * 4, ov * 4:(ov + step) * 4]
            hh = min(step, h - ty) * 4
            ww = min(step, w - tx) * 4
            out[ty * 4:ty * 4 + hh, tx * 4:tx * 4 + ww] = core[:hh, :ww]
    return Image.fromarray((np.clip(out, 0, 1) * 255 + 0.5).astype(np.uint8))


def cover_resize(img, size):
    tw, th = size
    s = max(tw / img.width, th / img.height)
    nw, nh = math.ceil(img.width * s), math.ceil(img.height * s)
    img = img.resize((nw, nh), Image.LANCZOS)
    l, t = (nw - tw) // 2, (nh - th) // 2
    return img.crop((l, t, l + tw, t + th))


def placeholder(idx, name):
    """Abstrakter Platzhalter (nur Farbverläufe und Rauschen, keine Formen)."""
    rng = np.random.default_rng(idx)
    pal = {
        1: [(20, 4, 2), (150, 40, 8), (255, 150, 40)], 2: [(10, 14, 30), (60, 50, 60), (180, 140, 90)],
        3: [(12, 10, 14), (70, 50, 35), (210, 170, 110)], 4: [(14, 14, 24), (80, 70, 70), (200, 170, 120)],
        5: [(14, 12, 14), (90, 70, 50), (220, 190, 140)], 6: [(10, 8, 16), (110, 50, 20), (240, 150, 60)],
        7: [(16, 8, 6), (120, 50, 15), (240, 140, 50)], 8: [(25, 4, 0), (190, 60, 10), (255, 200, 90)],
        9: [(6, 12, 28), (60, 90, 140), (200, 225, 255)], 10: [(20, 24, 40), (140, 120, 120), (255, 215, 160)],
        11: [(8, 10, 24), (40, 50, 80), (210, 180, 130)]}[idx]
    w, h = BASE
    noise = np.zeros((h, w), np.float32)
    for oct_, amp in ((6, 1.0), (14, 0.5), (34, 0.25)):
        small = rng.random((oct_ * 16 // 9 + 2, oct_ + 2)).astype(np.float32)
        noise += amp * np.asarray(Image.fromarray(small).resize((w, h), Image.BICUBIC))
    noise = (noise - noise.min()) / (noise.max() - noise.min())
    yy = np.linspace(0, 1, h, dtype=np.float32)[:, None]
    fire = idx in (1, 6, 7, 8)
    v = (0.55 * (yy if fire else 1 - np.abs(yy - 0.45) * 1.6) + 0.45 * noise)
    v = np.clip(v, 0, 1)
    p = np.array(pal, np.float32) / 255
    rgb = np.where(v[..., None] < 0.5, p[0] + (p[1] - p[0]) * (v[..., None] * 2),
                   p[1] + (p[2] - p[1]) * (v[..., None] * 2 - 1))
    img = Image.fromarray((rgb * 255).astype(np.uint8))
    d = ImageDraw.Draw(img)
    s = BASE[0] / W
    d.text((int(80 * s), int(240 * s)), f"PLATZHALTER {name}", font=T.font("semibold", int(30 * s)),
           fill=(255, 255, 255))
    return img


def prepare_images(assets, names, use_esrgan=True):
    out = BUILD / "img"
    out.mkdir(parents=True, exist_ok=True)
    report = {}
    model = ROOT / "models" / "realesrgan_x4.onnx"
    for i, name in enumerate(names, 1):
        dst = out / f"{i:02d}.png"
        src = assets / name
        if not src.exists():
            placeholder(i, name).save(dst)
            report[name] = "PLATZHALTER"
            continue
        if dst.exists() and dst.stat().st_mtime > src.stat().st_mtime:
            report[name] = "vorhanden"
            continue
        img = Image.open(src).convert("RGB")
        need = max(BASE[0] / img.width, BASE[1] / img.height)
        how = "Lanczos"
        if need > 1.0 and use_esrgan and model.exists():
            try:
                img = esrgan_upscale(img, model)
                how = "Real-ESRGAN x4 + Lanczos"
            except Exception as e:
                print("  Real-ESRGAN fehlgeschlagen:", e)
        cover_resize(img, BASE).save(dst)
        report[name] = f"{how} -> {BASE[0]}x{BASE[1]}"
    return report


# ================================================================ Hilfen
def ease(x):
    x = min(max(x, 0.0), 1.0)
    return 0.5 - 0.5 * math.cos(math.pi * x)


def smoothstep(a, b, x):
    if b == a:
        return 1.0 if x >= b else 0.0
    t = min(max((x - a) / (b - a), 0), 1)
    return t * t * (3 - 2 * t)


def flicker(t, seed=0):
    v = (math.sin(t * 7.3 + seed) * 0.5 + math.sin(t * 13.1 + seed * 2) * 0.3 +
         math.sin(t * 23.7 + seed * 3) * 0.2)
    return v  # [-1, 1]


# ================================================================ Partikel
class Particles:
    """Prozedurale Punktpartikel (keine Formen), deterministisch über t."""

    def __init__(self, kind, seed):
        self.kind = kind
        rng = np.random.default_rng(seed)
        if kind == "embers":
            n = 140
            self.x0 = rng.uniform(-50, W + 50, n)
            self.y0 = rng.uniform(H * 0.75, H + 120, n)
            self.v = rng.uniform(70, 230, n)
            self.life = rng.uniform(2.5, 6.0, n)
            self.size = rng.choice([1.2, 1.8, 2.5, 3.5], n, p=[.35, .35, .2, .1])
            self.bright = rng.uniform(0.5, 1.0, n)
            self.hue = rng.uniform(0, 1, n)  # 0 = gold, 1 = orange
        elif kind == "sparks":
            n = 45
            self.x0 = rng.uniform(100, W - 100, n)
            self.y0 = rng.uniform(H * 0.85, H + 50, n)
            self.v = rng.uniform(260, 520, n)
            self.life = rng.uniform(0.9, 2.0, n)
            self.size = rng.uniform(0.9, 1.6, n)
            self.bright = rng.uniform(0.8, 1.0, n)
            self.hue = rng.uniform(0, 0.5, n)
        elif kind == "dust":
            n = 110
            self.x0 = rng.uniform(0, W, n)
            self.y0 = rng.uniform(0, H, n)
            self.v = rng.uniform(-14, 14, n)
            self.life = rng.uniform(5, 10, n)
            self.size = rng.choice([1.0, 1.5, 2.2, 3.2], n, p=[.4, .3, .2, .1])
            self.bright = rng.uniform(0.15, 0.45, n)
            self.hue = rng.uniform(0, 1, n)
        elif kind == "snow":
            n = 120
            self.x0 = rng.uniform(-40, W + 40, n)
            self.y0 = rng.uniform(-200, H, n)
            self.v = rng.uniform(28, 75, n)
            self.life = rng.uniform(6, 12, n)
            self.size = rng.choice([1.2, 1.8, 2.6, 3.4], n, p=[.35, .35, .2, .1])
            self.bright = rng.uniform(0.35, 0.8, n)
            self.hue = rng.uniform(0, 1, n)
        self.phase = rng.uniform(0, 100, len(self.x0))
        self.wob = rng.uniform(0.3, 1.4, len(self.x0))
        self.wamp = rng.uniform(6, 30, len(self.x0))

    def positions(self, t):
        age = (t + self.phase) % self.life
        cyc = np.floor((t + self.phase) / self.life)
        lf = age / self.life
        jitter = (np.sin(cyc * 12.9898 + self.phase) * 43758.5453) % 1  # neue Startposition je Zyklus
        if self.kind in ("embers", "sparks"):
            x = (self.x0 + (jitter - 0.5) * 300) % (W + 100) - 50 + np.sin(t * self.wob + self.phase) * self.wamp
            y = self.y0 - self.v * age
            a = np.sin(np.pi * lf) ** 0.6
            fl = 0.65 + 0.35 * np.sin(t * (9 + self.wob * 8) + self.phase * 3)
            return x, y, a * fl * self.bright
        if self.kind == "dust":
            x = self.x0 + np.sin(t * 0.25 * self.wob + self.phase) * self.wamp * 2 + self.v * age * 0.6
            y = self.y0 - 10 * age + np.cos(t * 0.2 * self.wob + self.phase) * self.wamp
            a = np.sin(np.pi * lf) * self.bright * (0.7 + 0.3 * np.sin(t * 1.3 + self.phase))
            return x, y, a
        # snow: fällt
        x = (self.x0 + (jitter - 0.5) * 200) + np.sin(t * 0.6 * self.wob + self.phase) * self.wamp
        y = (self.y0 + self.v * age) % (H + 240) - 120
        a = np.sin(np.pi * lf) ** 0.5 * self.bright * (0.75 + 0.25 * np.sin(t * 2.1 + self.phase))
        return x, y, a

    def render(self, t, layer, strength=1.0):
        """Addiert die Partikel in layer (float32 HxWx3)."""
        x, y, a = self.positions(t)
        if self.kind in ("embers", "sparks"):
            cols = [(np.array([1.0, 0.78, 0.38]), self.hue < 0.5), (np.array([1.0, 0.45, 0.10]), self.hue >= 0.5)]
            gain, glow_r, glow_g = 1.0, 6, 1.6
        elif self.kind == "dust":
            cols = [(np.array([1.0, 0.92, 0.78]), np.ones_like(x, bool))]
            gain, glow_r, glow_g = 0.9, 3, 0.8
        else:
            cols = [(np.array([0.78, 0.86, 1.0]), self.hue < 0.6), (np.array([0.92, 0.95, 1.0]), self.hue >= 0.6)]
            gain, glow_r, glow_g = 0.9, 5, 1.3
        for col, mask in cols:
            core = Image.new("L", (W, H), 0)
            d = ImageDraw.Draw(core)
            for xi, yi, ai, si in zip(x[mask], y[mask], a[mask], self.size[mask]):
                if ai <= 0.02 or not (-10 < xi < W + 10 and -10 < yi < H + 10):
                    continue
                v = int(255 * min(1, ai * strength))
                if self.kind == "sparks":  # kurze Lichtspur
                    d.line([(xi, yi), (xi, yi + si * 9)], fill=v, width=max(1, int(si)))
                else:
                    d.ellipse([xi - si, yi - si, xi + si, yi + si], fill=v)
            c = np.asarray(core, np.float32) / 255
            g = np.asarray(core.filter(ImageFilter.GaussianBlur(glow_r)), np.float32) / 255
            layer += (c * gain + g * glow_g)[..., None] * col[None, None, :]


def star_layer(t, pos=(300, 360)):
    """Leicht funkelnder Stern (Lichtpunkt mit Strahlen)."""
    size = 160
    tw = 0.72 + 0.18 * math.sin(t * 2.3) + 0.10 * math.sin(t * 5.7 + 1)
    im = Image.new("L", (size, size), 0)
    d = ImageDraw.Draw(im)
    c = size // 2
    L = 22 + 10 * tw
    d.line([(c - L, c), (c + L, c)], fill=int(150 * tw), width=1)
    d.line([(c, c - L * 1.3), (c, c + L * 1.3)], fill=int(170 * tw), width=1)
    d.ellipse([c - 2, c - 2, c + 2, c + 2], fill=255)
    a = np.asarray(im.filter(ImageFilter.GaussianBlur(1.2)), np.float32) / 255
    g = np.asarray(im.filter(ImageFilter.GaussianBlur(7)), np.float32) / 255
    v = (a * 1.2 + g * 2.0 * tw)[..., None] * np.array([0.95, 0.93, 1.0])[None, None]
    return v, (pos[0] - c, pos[1] - c)


# ================================================================ Look
_VIG = None
_GRAIN = None


def vignette():
    global _VIG
    if _VIG is None:
        yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
        r = np.sqrt(((xx - W / 2) / (W / 2)) ** 2 * 0.8 + ((yy - H / 2) / (H / 2)) ** 2)
        _VIG = (1 - 0.42 * np.clip(r - 0.35, 0, None) ** 1.6)[..., None].astype(np.float32)
    return _VIG


def grain(fi):
    global _GRAIN
    if _GRAIN is None:
        rng = np.random.default_rng(7)
        _GRAIN = [rng.normal(0, 1, (H // 2, W // 2)).astype(np.float32) for _ in range(6)]
    g = _GRAIN[fi % 6]
    g = np.roll(g, ((fi * 37) % (H // 2), (fi * 91) % (W // 2)), (0, 1))
    return np.repeat(np.repeat(g, 2, 0), 2, 1)[..., None]


def grade(x, fi):
    """Schatten -> Nachtblau, Lichter -> Sandgold, Vignette, Filmkorn."""
    L = (x[..., 0:1] * 0.2126 + x[..., 1:2] * 0.7152 + x[..., 2:3] * 0.0722)
    ws = np.clip(1 - L * 2.2, 0, 1) ** 2
    wh = np.clip(L * 1.6 - 0.6, 0, 1) ** 2
    x = x + ws * 0.38 * (NIGHT - x)
    x = x * (1 - wh * 0.22) + wh * 0.22 * (x * (SAND / SAND.max()) * 1.08)
    x = x * vignette()
    x = x + grain(fi) * (0.018 + 0.01 * (1 - L))
    return x


def heat_shimmer(arr, t, amp=2.2):
    yy = np.arange(H, dtype=np.float32)
    xx = np.arange(W, dtype=np.float32)
    # stärker im unteren Bilddrittel
    w = (0.35 + 0.65 * np.clip((yy - H * 0.35) / (H * 0.55), 0, 1))[:, None]
    dx = (np.sin(yy[:, None] * 0.045 - t * 5.2 + np.sin(xx[None, :] * 0.011 + t * 1.3) * 1.5) * amp * w)
    dy = (np.sin(xx[None, :] * 0.03 + t * 3.7 + yy[:, None] * 0.013) * amp * 0.6 * w)
    xi = np.clip((xx[None, :] + dx).round().astype(np.int32), 0, W - 1)
    yi = np.clip((yy[:, None] + dy).round().astype(np.int32), 0, H - 1)
    return arr[yi, xi]


# ================================================================ Szenen
SCENE_FX = {
    "01": dict(particles=["embers", "sparks"], flicker=True, shimmer=True),
    "02": dict(), "03": dict(particles=["dust"]), "04": dict(),
    "05": dict(particles=["dust"]), "06": dict(flicker=True),
    "07": dict(particles=["embers", "sparks"], flicker=True),
    "08": dict(particles=["embers", "sparks"], flicker=True, shimmer=True),
    "09": dict(particles=["snow"]), "10": dict(), "11": dict(star=True),
}
MOTIONS = ["zoom_in", "pan_lr", "zoom_out", "pan_ud", "zoom_in", "pan_rl", "zoom_out", "zoom_in",
           "pan_du", "zoom_out", "zoom_in"]


class SceneRenderer:
    def __init__(self, scene, index):
        self.s = scene
        self.motion = MOTIONS[index % len(MOTIONS)]
        self.img = Image.open(BUILD / "img" / f"{scene['img']}.png").convert("RGB")
        fx = SCENE_FX[scene["img"]]
        self.fx = fx
        self.parts = [Particles(k, seed=index * 10 + j) for j, k in enumerate(fx.get("particles", []))]

    def frame(self, t):
        s = self.s
        p = ease((t - s["vstart"]) / max(0.1, s["vend"] - s["vstart"]))
        bw, bh = self.img.size
        m = self.motion
        z, cx, cy = 1.0, 0.5, 0.5
        if m == "zoom_in":
            z = 1.0 + 0.10 * p
        elif m == "zoom_out":
            z = 1.10 - 0.10 * p
        else:
            z = 1.08
            span = (1 - 1 / z) / 2 * 0.95
            d = {"pan_lr": (-1, 0), "pan_rl": (1, 0), "pan_ud": (0, -1), "pan_du": (0, 1)}[m]
            cx = 0.5 + d[0] * span * (2 * p - 1)
            cy = 0.5 + d[1] * span * (2 * p - 1)
        ww, wh = bw / z, bh / z
        x0, y0 = cx * bw - ww / 2, cy * bh - wh / 2
        sx = ww / W
        im = self.img.transform((W, H), Image.AFFINE, (sx, 0, x0, 0, wh / H, y0), resample=Image.BICUBIC)
        arr = np.asarray(im, np.float32) / 255
        if self.fx.get("shimmer"):
            arr = heat_shimmer(arr, t)
        if self.fx.get("flicker"):
            arr = arr * (1 + 0.04 * flicker(t, int(s["img"])))
        if self.parts:
            layer = np.zeros((H, W, 3), np.float32)
            for pt in self.parts:
                pt.render(t, layer)
            arr = arr + layer * (1 - arr * 0.5)  # additiv, weich begrenzt
        if self.fx.get("star"):
            v, (ox, oy) = star_layer(t)
            h, w = v.shape[:2]
            arr[oy:oy + h, ox:ox + w] += v
        return arr


# ================================================================ Text
def place_x(w, cx=W / 2):
    x = cx - w / 2
    if x + w > SAFE_R:
        x = SAFE_R - w
    return int(max(SAFE_L, x))


class TextLayer:
    """Vorgerendertes Textbild (prämultipliziert) mit Position und Zeitverlauf."""

    def __init__(self, img, x, y, t0, t1, fin=0.12, fout=0.12):
        self.rgb, self.a = T.to_premult(img)
        self.x, self.y, self.t0, self.t1, self.fin, self.fout = x, y, t0, t1, fin, fout
        self.w, self.h = img.width, img.height

    def opacity(self, t):
        if t < self.t0 or t > self.t1:
            return 0.0
        return min(smoothstep(self.t0, self.t0 + self.fin, t), 1 - smoothstep(self.t1 - self.fout, self.t1, t))

    def bbox(self):
        return self.x, self.y, self.x + self.w, self.y + self.h

    def comp(self, arr, t):
        o = self.opacity(t)
        if o <= 0:
            return
        x0, y0 = max(0, self.x), max(0, self.y)
        x1, y1 = min(W, self.x + self.w), min(H, self.y + self.h)
        sl = (slice(y0 - self.y, y1 - self.y), slice(x0 - self.x, x1 - self.x))
        a = self.a[sl][..., None] * o
        arr[y0:y1, x0:x1] = arr[y0:y1, x0:x1] * (1 - a) + self.rgb[sl] * o


def is_kw(tok):
    core = tok.strip("„“‚‘!?.,:;– ")
    return any(core.startswith(k) for k in KEYWORDS)


SUB_SIZE = 58
SUB_MAXW = SAFE_R - SAFE_L - 20


def sub_runs(tokens):
    reg, bold = T.font("semibold", SUB_SIZE), T.font("extrabold", SUB_SIZE)
    ar = T.font("amiri", 60)
    runs = []
    for i, tok in enumerate(tokens):
        if i:
            runs.append((" ", reg, "white", False))
        if T.AR_RE.search(tok):
            runs.append((tok, ar, "white", True))
        else:
            runs.append((tok, bold if is_kw(tok) else reg, "white", False))
    return runs


def chunk_tokens(tokens):
    """Teilt Tokens in einzeilige Einblendungen (<=30 Zeichen, passt in sichere Breite)."""
    n = len(tokens)
    INF = 1e9
    best = [INF] * (n + 1)
    prev = [0] * (n + 1)
    best[0] = 0
    for j in range(1, n + 1):
        for i in range(max(0, j - 12), j):
            text = " ".join(tokens[i:j])
            if len(text) > 30 or T.runs_width(sub_runs(tokens[i:j])) > SUB_MAXW:
                continue
            last = tokens[j - 1]
            c = 1.0
            if j < n and not last.endswith((",", ".", ":", "!", "?", "“", ";")):
                c += 0.45
            if tokens[i] == "–":
                c += 0.3
            if j < n and T.AR_RE.search(tokens[j]):  # „Ibrahim“ nicht von عليه السلام / ﷻ trennen
                c += 2.0
            c += 0.0015 * (30 - len(text)) ** 2
            if best[i] + c < best[j]:
                best[j], prev[j] = best[i] + c, i
    cuts, j = [], n
    while j > 0:
        cuts.append((prev[j], j))
        j = prev[j]
    return cuts[::-1]


def build_chunks(tl):
    """Alle Untertitel-Einblendungen mit Zeiten (inkl. Overlay-Sätze für SRT)."""
    out = []
    for s in tl["sentences"]:
        for i, j in chunk_tokens(s["tokens"]):
            out.append({"sid": s["id"], "tokens": s["tokens"][i:j], "text": " ".join(s["tokens"][i:j]),
                        "start": s["times"][i][0], "end": s["times"][j - 1][1]})
    for k, c in enumerate(out):
        nxt = out[k + 1]["start"] if k + 1 < len(out) else c["end"] + 1.0
        c["show_start"] = c["start"] - 0.05
        c["show_end"] = min(max(c["end"] + 0.3, c["start"] + 0.6), nxt - 0.08, c["show_start"] + 2.5)
    return out


def sub_layer(chunk, t0, t1):
    img, base = T.render_runs(sub_runs(chunk["tokens"]))
    asc, desc = T.font("semibold", SUB_SIZE).getmetrics()
    mid = base - (asc - desc) / 2  # Zeilenmitte relativ zum Bild
    sh, pad = T.add_shadow(img, radius=8, opacity=0.9, offset=(0, 3), spread=2)
    x = place_x(img.width) - pad
    y = int(round(1250 - mid)) - pad
    return TextLayer(sh, x, y, t0, t1, 0.08, 0.1)


def stack_lines(items, gap=14):
    """items: Liste von (Image, extra_gap_before). Zentriert gestapelt, auf Tinte beschnitten."""
    crops = []
    for img, g in items:
        bb = img.getchannel("A").getbbox()
        crops.append((img.crop((0, bb[1], img.width, bb[3])), g))
    width = max(c.width for c, _ in crops)
    height = sum(c.height for c, _ in crops) + sum(g for _, g in crops[1:]) + gap * (len(crops) - 1)
    out = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    y = 0
    for k, (c, g) in enumerate(crops):
        if k:
            y += gap + g
        out.alpha_composite(c, ((width - c.width) // 2, y))
        y += c.height
    return out


def backdrop(w, h, strength=0.5):
    """Weiche Abdunklung hinter Einblendungen (Verlauf, keine Form)."""
    pad = 120
    a = Image.new("L", (w + 2 * pad, h + 2 * pad), 0)
    ImageDraw.Draw(a).rounded_rectangle([pad, pad, pad + w, pad + h], radius=60, fill=int(255 * strength))
    a = a.filter(ImageFilter.GaussianBlur(55))
    im = Image.new("RGBA", a.size, (4, 6, 14, 0))
    im.putalpha(a)
    return im, pad


def block_layer(lines, cy, t0, t1, fin, fout, back=0.5):
    block = stack_lines(lines)
    sh, pad = T.add_shadow(block, radius=9, opacity=0.9, offset=(0, 3), spread=2)
    bd, bpad = backdrop(block.width, block.height, back)
    comp = Image.new("RGBA", bd.size, (0, 0, 0, 0))
    comp.alpha_composite(bd)
    comp.alpha_composite(sh, (bpad - pad, bpad - pad))
    x = place_x(block.width) - bpad
    y = int(cy - block.height / 2) - bpad
    lay = TextLayer(comp, x, y, t0, t1, fin, fout)
    lay.ink = (x + bpad, y + bpad, x + bpad + block.width, y + bpad + block.height)
    return lay


def dua_block(cy, t0, t1):
    ar, _ = T.render_runs([(DUA_AR, T.font("amiri", 72), "white", True)])
    f = T.font("regular", 40)
    de = [T.render_runs([(l, f, PERG, False)])[0] for l in T.balanced_wrap(DUA_DE, f, SUB_MAXW)]
    src, _ = T.render_runs([(DUA_SRC, T.font("regular", 28), GOLD, False)])
    items = [(ar, 0)] + [(d, 10 if k == 0 else -4) for k, d in enumerate(de)] + [(src, 8)]
    return block_layer(items, cy, t0, t1, 0.45, 0.45)


def quran_block(cy, t0, t1):
    fq = T.font("quran", 76)
    fn = T.font("amiriquran", 70)
    lines = T.balanced_wrap(QURAN_AR, fq, SUB_MAXW - 130, rtl=True)
    items = []
    for k, l in enumerate(lines):
        runs = [(l, fq, "white", True)]
        if k == len(lines) - 1:  # Versnummer links vom Versende (RTL)
            runs = [(QURAN_NR, fn, "white", True), ("  ", T.font("regular", 40), "white", False)] + runs
        items.append((T.render_runs(runs)[0], 0 if k == 0 else 6))
    f = T.font("regular", 40)
    for k, l in enumerate(T.balanced_wrap(QURAN_DE, f, SUB_MAXW)):
        items.append((T.render_runs([(l, f, PERG, False)])[0], 18 if k == 0 else -4))
    items.append((T.render_runs([(QURAN_SRC, T.font("regular", 28), GOLD, False)])[0], 8))
    return block_layer(items, cy, t0, t1, 0.7, 0.7, back=0.45)


def hook_layer(t0, t1):
    f = T.font("extrabold", 96)
    lines = []
    for words in HOOK_LINES:
        runs = []
        for i, wd in enumerate(words):
            if i:
                runs.append((" ", f, "white", False))
            if wd.startswith(HOOK_GOLD):
                runs.append((HOOK_GOLD, f, GOLD, False))
                rest = wd[len(HOOK_GOLD):]
                if rest:
                    runs.append((rest, f, "white", False))
            else:
                runs.append((wd, f, "white", False))
        lines.append((T.render_runs(runs)[0], 0))
    block = stack_lines(lines, gap=22)
    sh, pad = T.add_shadow(block, radius=12, opacity=0.9, offset=(0, 4), spread=3)
    x = place_x(block.width) - pad
    y = int(900 - block.height / 2) - pad
    lay = TextLayer(sh, x, y, t0, t1, 0.25, 0.3)
    lay.ink = (x + pad, y + pad, x + pad + block.width, y + pad + block.height)
    return lay


def handle_layer(t0, t1):
    img, _ = T.render_runs([(HANDLE, T.font("regular", 36), PERG, False)])
    sh, pad = T.add_shadow(img, radius=6, opacity=0.85)
    lay = TextLayer(sh, place_x(img.width) - pad, 1400 - img.height // 2 - pad, t0, t1, 0.5, 0.4)
    return lay
