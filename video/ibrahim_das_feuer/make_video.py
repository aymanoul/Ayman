#!/usr/bin/env python3
"""Spur der Propheten – „Ibrahim – Das Feuer“. 1080x1920, 30 fps.

Aufruf:
  python3 make_video.py check                  # Dateien prüfen
  python3 make_video.py prep                   # Bilder, Tonspur, Zeiten
  python3 make_video.py test                   # 0–12 s rendern
  python3 make_video.py full                   # ganzes Video + Cover + SRT + Kontrollblatt
Optionen: --assets PFAD  --fallback-timing  --no-esrgan
"""
import argparse
import json
import multiprocessing as mp
import shutil
import subprocess
import sys
import time
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).parent
sys.path.insert(0, str(ROOT))
import bild as Bm  # noqa: E402
import textlib as T  # noqa: E402
import tonspur as A  # noqa: E402
from inhalt import ASSETS_AUDIO, ASSETS_IMG, OVERLAY_SENTENCES, DUA_AR, DUA_DE, QURAN_AR, QURAN_DE  # noqa

BUILD, OUT = ROOT / "build", ROOT / "out"
W, H, FPS = Bm.W, Bm.H, Bm.FPS


# ================================================================ Prüfen
def check(assets):
    missing = [f for f in ASSETS_AUDIO + ASSETS_IMG if not (assets / f).exists()]
    print(f"Asset-Ordner: {assets}")
    for f in ASSETS_AUDIO + ASSETS_IMG:
        print(("  OK      " if f not in missing else "  FEHLT   ") + f)
    return missing


# ================================================================ Zeitplan
def sent(tl, sid):
    return next(s for s in tl["sentences"] if s["id"] == sid)


def scenes_from(tl):
    qs = tl["quran_start"]
    tz = A.find_word(tl, "A5", "zerschlug")
    lead = 0.12
    cuts = [
        ("01", 0.0),
        ("02", sent(tl, "A2")["start"] - lead),
        ("03", sent(tl, "A4")["start"] - lead),
        ("04", sent(tl, "A5")["start"] - lead),
        ("05", tz - 0.05),
        ("06", sent(tl, "A8")["start"] - lead),
        ("07", sent(tl, "A9")["start"] - lead),
        ("08", sent(tl, "A10")["start"] - lead),
        ("09", qs),
        ("10", sent(tl, "B0")["start"] - lead),
        ("11", sent(tl, "B1")["start"] - lead),
    ]
    scenes = []
    for k, (img, t) in enumerate(cuts):
        end = cuts[k + 1][1] if k + 1 < len(cuts) else tl["total"]
        xf = 2.0 if img == "09" else 0.5  # 08 -> 09 über 2 s
        xin = 0.0 if k == 0 else xf
        # Kreuzblende: 0,5 s zentriert um den Schnitt; 08->09 beginnt mit dem ersten Ton der Rezitation
        fin0 = t if img == "09" else t - xin / 2
        fin1 = fin0 + xin
        scenes.append({"img": img, "start": t, "end": end, "fin0": fin0, "fin1": fin1})
    for k, s in enumerate(scenes):
        nxt = scenes[k + 1] if k + 1 < len(scenes) else None
        s["vis_end"] = nxt["fin1"] if nxt else tl["total"]
        s["vstart"], s["vend"] = s["fin0"], s["vis_end"]
    return scenes


def overlays_from(tl):
    qs, qe = tl["quran_start"], tl["quran_end"]
    a11, a12 = sent(tl, "A11"), sent(tl, "A12")
    b2, b3 = sent(tl, "B2"), sent(tl, "B3")
    return {
        "dua1": (a11["start"] - 0.25, a12["start"] - 0.1),
        "quran": (qs, qe + 0.5),
        "dua2": (b2["start"] - 0.25, b3["start"] - 0.1),
    }


def subtitle_plan(tl):
    chunks = Bm.build_chunks(tl)
    ovs = overlays_from(tl)
    plan = []
    for c in chunks:
        if c["sid"] in OVERLAY_SENTENCES:
            continue
        a, b = c["show_start"], c["show_end"]
        a = max(a, 3.0)  # 0–3 s: Hook
        for o0, o1 in ovs.values():
            if a < o1 and b > o0:  # nie während Einblendungen
                if a >= o0:
                    a = o1 + 0.02
                else:
                    b = o0 - 0.02
        if b - a >= 0.3:
            plan.append({**c, "t0": a, "t1": min(b, a + 2.5)})
    return chunks, plan


# ================================================================ Renderer (Worker)
G = {}


def init_worker():
    tl = json.loads((BUILD / "timeline.json").read_text())
    scenes = scenes_from(tl)
    _, plan = subtitle_plan(tl)
    ovs = overlays_from(tl)
    layers = [Bm.hook_layer(0.0, 3.0)]
    layers += [Bm.sub_layer(c, c["t0"], c["t1"]) for c in plan]
    layers += [Bm.dua_block(890, *ovs["dua1"]), Bm.quran_block(890, *ovs["quran"]),
               Bm.dua_block(890, *ovs["dua2"]), Bm.handle_layer(sent(tl, "B3")["start"], tl["total"])]
    G.update(tl=tl, scenes=scenes, layers=layers,
             rend={s["img"]: Bm.SceneRenderer(s, k) for k, s in enumerate(scenes)})


def scene_weights(t):
    out = []
    for k, s in enumerate(G["scenes"]):
        if t < s["fin0"] or t >= s["vis_end"]:
            continue
        w = 1.0 if k == 0 else Bm.smoothstep(s["fin0"], s["fin1"], t)
        out.append((s, w))
    return out


def render_frame(fi):
    t = fi / FPS
    acc = None
    for s, w in scene_weights(t):
        img = G["rend"][s["img"]].frame(t)
        acc = img if acc is None else acc * (1 - w) + img * w
    acc = Bm.grade(acc, fi)
    acc = np.clip(acc, 0, 1)
    for L in G["layers"]:
        L.comp(acc, t)
    return (acc * 255 + 0.5).astype(np.uint8).tobytes()


def render(t0, t1, out, audio=True, workers=4):
    n0, n1 = int(round(t0 * FPS)), int(round(t1 * FPS))
    cmd = ["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
           "-r", str(FPS), "-i", "-"]
    if audio:
        cmd += ["-ss", f"{t0:.3f}", "-t", f"{(n1 - n0) / FPS:.3f}", "-i", str(BUILD / "mix.wav")]
    cmd += ["-c:v", "libx264", "-profile:v", "high", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p",
            "-r", str(FPS)]
    if audio:
        cmd += ["-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-shortest"]
    cmd += ["-movflags", "+faststart", str(out)]
    p = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    t_start = time.time()
    with mp.get_context("fork").Pool(workers, initializer=init_worker) as pool:
        for k, buf in enumerate(pool.imap(render_frame, range(n0, n1), chunksize=2)):
            p.stdin.write(buf)
            if k % 90 == 0:
                el = time.time() - t_start
                print(f"  Bild {k}/{n1 - n0}  ({el:.0f} s)", flush=True)
    p.stdin.close()
    p.wait()
    print(f"  fertig: {out} in {time.time() - t_start:.0f} s")


# ================================================================ Ausgaben
def srt(tl, path):
    chunks, _ = subtitle_plan(tl)

    def ts(x):
        ms = int(round(x * 1000))
        return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"
    lines = []
    for k, c in enumerate(chunks, 1):
        lines += [str(k), f"{ts(c['show_start'])} --> {ts(c['show_end'])}", c["text"], ""]
    path.write_text("\n".join(lines), encoding="utf-8")


def cover(path):
    img = Image.open(BUILD / "img" / "08.png").convert("RGB")
    img = Bm.cover_resize(img, (W, H))
    arr = np.asarray(img, np.float32) / 255 * 0.42
    arr = np.clip(Bm.grade(arr, 0), 0, 1)
    im = Image.fromarray((arr * 255).astype(np.uint8)).convert("RGBA")
    t1, _ = T.render_runs([("IBRAHIM", T.font("cormorant", 150), Bm.GOLD, False)])
    t2, _ = T.render_runs([("Das Feuer", T.font("semibold", 64), "white", False)])
    block = Bm.stack_lines([(t1, 0), (t2, 18)])
    sh, pad = T.add_shadow(block, radius=14, opacity=0.9, offset=(0, 4), spread=3)
    cy = (820 + 1100) // 2
    x = Bm.place_x(block.width) - pad
    y = cy - block.height // 2 - pad
    im.alpha_composite(sh, (x, y))
    im.convert("RGB").save(path)
    return (x + pad, y + pad, x + pad + block.width, y + pad + block.height)


def contact_sheet(video, path, step=3):
    tmp = BUILD / "sheet"
    shutil.rmtree(tmp, ignore_errors=True)
    tmp.mkdir()
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0",
                                str(video)], capture_output=True, text=True).stdout)
    times = list(np.arange(0, dur, step))
    tw, th = 270, 480
    for k, t in enumerate(times):
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t:.2f}", "-i", str(video), "-frames:v", "1",
                        str(tmp / f"{k:03d}.png")], check=True)
    cols = 6
    rows = (len(times) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * (tw + 10) + 10, rows * (th + 46) + 10), (18, 18, 22))
    d = ImageDraw.Draw(sheet)
    f = T.font("semibold", 22)
    for k, t in enumerate(times):
        fr = Image.open(tmp / f"{k:03d}.png").convert("RGB")
        g = ImageDraw.Draw(fr)  # sichere Zonen markieren
        g.rectangle([0, 0, W, 160], outline=(255, 0, 80), width=4)
        g.rectangle([0, H - 380, W, H], outline=(255, 0, 80), width=4)
        g.rectangle([W - 140, 0, W, H], outline=(255, 0, 80), width=4)
        fr = fr.resize((tw, th), Image.LANCZOS)
        x, y = 10 + (k % cols) * (tw + 10), 10 + (k // cols) * (th + 46)
        sheet.paste(fr, (x, y + 36))
        d.text((x, y + 4), f"{int(t // 60)}:{t % 60:04.1f}", font=f, fill=(230, 230, 230))
    sheet.save(path)
    return dur


def verify(tl):
    """Textprüfungen und Sichere-Zonen-Prüfung aller Textebenen."""
    problems = []
    for name, s in (("Quran-Text", QURAN_AR), ("Quran-Übersetzung", QURAN_DE),
                    ("Hadith arabisch", DUA_AR), ("Hadith deutsch", DUA_DE)):
        if "ﷻ" in s or "عليه السلام" in s:
            problems.append(f"{name} enthält ﷻ oder عليه السلام")
    init_worker()
    for L in G["layers"]:
        x0, y0, x1, y1 = getattr(L, "ink", None) or ink_box(L)
        if y0 < 160 or y1 > H - 380 or x1 > W - 140 or x0 < 0:
            problems.append(f"Text in sicherer Zone: {(x0, y0, x1, y1)}")
    return problems


def ink_box(L):
    m = L.a > 0.5  # nur echte Schrift, nicht der weiche Schatten
    ys, xs = np.where(m)
    return (L.x + xs.min(), L.y + ys.min(), L.x + xs.max(), L.y + ys.max())


def has_music_check():
    """Dokumentiert die Quellen der Tonspur: nur Stimme, Rezitation und Geräusche."""
    return ["sprecher_A.mp3", "quran_21_69.mp3", "sprecher_B.mp3"] + \
        ["sfx_feuer_gross.mp3", "sfx_steine.mp3", "sfx_fackeln.mp3", "sfx_zuenden.mp3", "sfx_glut.mp3", "sfx_wind.mp3"]


# ================================================================ Haupt
def prep(assets, args):
    missing = check(assets)
    have_audio = all((assets / f).exists() for f in ASSETS_AUDIO)
    print("Bilder vorbereiten …")
    rep = Bm.prepare_images(assets, ASSETS_IMG, use_esrgan=not args.no_esrgan)
    for k, v in rep.items():
        print(f"  {k}: {v}")
    print("Tonspur und Zeiten …")
    tl = A.build(assets, have_audio, "fallback" if args.fallback_timing else "auto")
    scenes = scenes_from(tl)
    if have_audio:
        m = A.mix(assets, tl, scenes)
        tl["loudnorm"] = m
    else:
        A.silent_mix(tl)
    tl["missing"] = missing
    (BUILD / "timeline.json").write_text(json.dumps(tl, ensure_ascii=False, indent=1))
    print(f"  Zeitmodus: {tl['timing_mode']}, Länge {tl['total']:.2f} s")
    for s in scenes:
        print(f"  Szene {s['img']}: {s['start']:6.2f} – {s['end']:6.2f} s")
    return tl


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("cmd", choices=["check", "prep", "test", "full", "extras"])
    ap.add_argument("--assets", default=str(ROOT / "assets"))
    ap.add_argument("--fallback-timing", action="store_true")
    ap.add_argument("--no-esrgan", action="store_true")
    ap.add_argument("--workers", type=int, default=4)
    args = ap.parse_args()
    assets = Path(args.assets)
    BUILD.mkdir(exist_ok=True)
    OUT.mkdir(exist_ok=True)
    if args.cmd == "check":
        m = check(assets)
        print(f"\n{len(m)} Datei(en) fehlen." if m else "\nAlle Dateien vorhanden.")
        return
    if args.cmd == "prep":
        prep(assets, args)
        return
    tl = json.loads((BUILD / "timeline.json").read_text())
    suffix = "_PLATZHALTER" if tl.get("missing") else ""
    if args.cmd == "test":
        render(0, min(12, tl["total"]), OUT / f"test_0-12s{suffix}.mp4", workers=args.workers)
        return
    if args.cmd == "full":
        render(0, tl["total"], OUT / f"ibrahim_das_feuer{suffix}.mp4", workers=args.workers)
    extras(tl, suffix)


def extras(tl, suffix):
    srt(tl, OUT / "untertitel.srt")
    box = cover(OUT / f"cover_ibrahim{suffix}.png")
    print("Cover-Titelblock:", box)
    video = OUT / f"ibrahim_das_feuer{suffix}.mp4"
    if video.exists():
        dur = contact_sheet(video, OUT / f"kontrollblatt{suffix}.png")
        I, P = A.measure(video)
        print(f"Länge {dur:.2f} s | Lautheit {I} LUFS | True Peak {P} dBTP")
    probs = verify(tl)
    print("Prüfung:", "keine Probleme" if not probs else probs)


if __name__ == "__main__":
    main()
