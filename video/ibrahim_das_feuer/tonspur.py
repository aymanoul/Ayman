"""Tonspur zusammensetzen, Wortzeiten bestimmen, Geräusche mischen, Lautheit."""
import json
import re
import subprocess
import difflib
from pathlib import Path

import numpy as np

from inhalt import TEIL_A, TEIL_B, SPOKEN

SR = 48000
ROOT = Path(__file__).parent
BUILD = ROOT / "build"


def load(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-f", "f32le", "-ac", "2",
                          "-ar", str(SR), "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()


def save_wav(path, x):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ac", "2", "-ar", str(SR), "-i", "-",
                    "-c:a", "pcm_s24le", str(path)], input=x.astype(np.float32).tobytes(), check=True)


def db(x):
    return 20 * np.log10(max(x, 1e-9))


def frame_rms(x, hop=0.02):
    n = int(SR * hop)
    m = len(x) // n
    mono = x[:m * n].mean(1).reshape(m, n)
    return np.sqrt((mono ** 2).mean(1) + 1e-12)


def active_level(x):
    """RMS (dB) über aktive Abschnitte (ohne Stille)."""
    r = frame_rms(x)
    peak = r.max()
    act = r[r > peak * 10 ** (-30 / 20)]
    return db(np.sqrt((act ** 2).mean())) if len(act) else -60


def trim_silence(x, thresh_db=-40, margin=0.02):
    r = frame_rms(x, 0.01)
    thr = r.max() * 10 ** (thresh_db / 20)
    idx = np.where(r > thr)[0]
    a = max(0, int((idx[0] * 0.01 - margin) * SR))
    b = min(len(x), int(((idx[-1] + 1) * 0.01 + margin) * SR))
    return x[a:b].copy()


def fade(x, fin, fout):
    x = x.copy()
    ni, no = int(fin * SR), int(fout * SR)
    if ni:
        x[:ni] *= np.linspace(0, 1, ni)[:, None]
    if no:
        x[-no:] *= np.linspace(1, 0, no)[:, None]
    return x


# ---------------------------------------------------------------- Tokens
def tokenize(sentence):
    """Teilt in Tokens; 'عليه السلام' bleibt ein Token."""
    s = sentence.replace("عليه السلام", "عليه\u00a0السلام")
    return [t.replace("\u00a0", " ") for t in s.split(" ") if t]


def norm(w):
    w = w.lower()
    w = re.sub(r"[^\wäöüß]", "", w)
    return w.replace("ä", "ae").replace("ö", "oe").replace("ü", "ue").replace("ß", "ss")


def spoken_parts(tok):
    core = tok.strip("„“‚‘!?.,:;– ")
    if core in SPOKEN:
        return SPOKEN[core]
    if tok in SPOKEN:
        return SPOKEN[tok]
    n = norm(tok)
    return [n] if n else []


def weight(tok):
    parts = spoken_parts(tok)
    if not parts:
        return 2.0 if "ﷻ" in tok else 0.5
    return sum(len(p) for p in parts) + 1


def build_sections():
    secs = []
    for name, sents in (("A", TEIL_A), ("B", TEIL_B)):
        secs.append([{"id": f"{name}{i}", "text": s, "tokens": tokenize(s)} for i, s in enumerate(sents)])
    return secs


# ---------------------------------------------------------------- Zeiten
def whisper_words(path, prompt):
    from faster_whisper import WhisperModel
    model = WhisperModel("small", device="cpu", compute_type="int8")
    segs, _ = model.transcribe(str(path), language="de", word_timestamps=True,
                               initial_prompt=prompt, vad_filter=False, beam_size=5)
    out = []
    for s in segs:
        for w in s.words:
            n = norm(w.word)
            if n:
                out.append((n, w.start, w.end))
    return out


def align(sentences, wwords):
    """Ordnet Whisper-Wörter den Ziel-Tokens zu (über gesprochene Teilwörter)."""
    sub = []  # (sent_idx, tok_idx, part)
    for si, s in enumerate(sentences):
        for ti, tok in enumerate(s["tokens"]):
            parts = spoken_parts(tok)
            if not parts:
                sub.append((si, ti, None))
            for p in parts:
                sub.append((si, ti, p))
    a = [p if p else "\0" for _, _, p in sub]
    b = [w for w, _, _ in wwords]
    sm = difflib.SequenceMatcher(None, a, b, autojunk=False)
    times = [None] * len(sub)
    for blk in sm.get_matching_blocks():
        for k in range(blk.size):
            times[blk.a + k] = (wwords[blk.b + k][1], wwords[blk.b + k][2])
    # Teilweise Treffer (z. B. Komposita) über ähnliche Wörter in replace-Blöcken
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == "replace":
            for i in range(i1, i2):
                if a[i] == "\0":
                    continue
                best, bj = 0, None
                for j in range(j1, j2):
                    r = difflib.SequenceMatcher(None, a[i], b[j]).ratio()
                    if r > best:
                        best, bj = r, j
                if bj is not None and best > 0.6:
                    times[i] = (wwords[bj][1], wwords[bj][2])
    # Monotonie sichern
    last = -1
    for i, t in enumerate(times):
        if t is not None:
            if t[0] < last - 0.05:
                times[i] = None
            else:
                last = t[1]
    # Lücken linear nach Zeichenlänge füllen
    w = [len(p) + 1 if p else 1.0 for _, _, p in sub]
    i = 0
    n = len(sub)
    start_t = wwords[0][1] if wwords else 0
    end_t = wwords[-1][2] if wwords else 1
    while i < n:
        if times[i] is not None:
            i += 1
            continue
        j = i
        while j < n and times[j] is None:
            j += 1
        t0 = times[i - 1][1] if i > 0 else start_t
        t1 = times[j][0] if j < n else end_t
        tot = sum(w[i:j])
        acc = t0
        for k in range(i, j):
            d = (t1 - t0) * w[k] / tot if tot else 0
            times[k] = (acc, acc + d)
            acc += d
        i = j
    # Auf Tokens zusammenführen
    for s in sentences:
        s["times"] = [None] * len(s["tokens"])
    for (si, ti, _), t in zip(sub, times):
        cur = sentences[si]["times"][ti]
        sentences[si]["times"][ti] = t if cur is None else (cur[0], t[1])
    for s in sentences:
        s["start"], s["end"] = s["times"][0][0], s["times"][-1][1]


def silencedetect(path):
    r = subprocess.run(["ffmpeg", "-i", str(path), "-af", "silencedetect=n=-35dB:d=0.22", "-f", "null", "-"],
                       capture_output=True, text=True)
    st = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", r.stderr)]
    en = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", r.stderr)]
    return list(zip(st, en))


def fallback_times(sentences, path, dur):
    sil = silencedetect(path)
    speech0 = sil[0][1] if sil and sil[0][0] < 0.05 else 0.0
    speech1 = sil[-1][0] if sil and sil[-1][1] >= dur - 0.05 else dur
    inner = [s for s in sil if s[0] > speech0 + 0.1 and s[1] < speech1 - 0.1]
    ws = [sum(weight(t) for t in s["tokens"]) for s in sentences]
    tot = sum(ws)
    bounds, acc, used = [], 0, -1
    for i in range(len(sentences) - 1):
        acc += ws[i]
        exp = speech0 + (speech1 - speech0) * acc / tot
        cands = [(abs((a + b) / 2 - exp), k) for k, (a, b) in enumerate(inner) if k > used]
        if cands:
            _, k = min(cands)
            used = k
            bounds.append(inner[k])
        else:
            bounds.append((exp, exp))
    starts = [speech0] + [b[1] for b in bounds]
    ends = [b[0] for b in bounds] + [speech1]
    for s, a, b in zip(sentences, starts, ends):
        w = [weight(t) for t in s["tokens"]]
        tw, acc = sum(w), a
        s["times"] = []
        for x in w:
            d = (b - a) * x / tw
            s["times"].append((acc, acc + d))
            acc += d
        s["start"], s["end"] = a, b


def estimate_times(sentences, t0, rate=13.5):
    t = t0
    for s in sentences:
        s["times"] = []
        for tok in s["tokens"]:
            d = weight(tok) / rate
            s["times"].append((t, t + d))
            t += d
        s["start"], s["end"] = s["times"][0][0], s["times"][-1][1]
        t += 0.4
    return t


# ---------------------------------------------------------------- Aufbau
def build(assets, have_audio, timing_mode="auto"):
    """Erzeugt build/voice.wav und build/timeline.json. Ohne Audio: Schätzung."""
    BUILD.mkdir(exist_ok=True)
    secA, secB = build_sections()
    tl = {"placeholder_audio": not have_audio}
    if have_audio:
        A = load(assets / "sprecher_A.mp3")
        B = load(assets / "sprecher_B.mp3")
        Q = trim_silence(load(assets / "quran_21_69.mp3"))
        Q = fade(Q, 0.05, 0.05)
        gapAQ, gapQB, tail = int(0.5 * SR), int(0.6 * SR), int(1.5 * SR)
        a0 = 0
        q0 = len(A) + gapAQ
        b0 = q0 + len(Q) + gapQB
        total = b0 + len(B) + tail
        voice = np.zeros((total, 2), np.float32)
        voice[a0:a0 + len(A)] += A
        voice[q0:q0 + len(Q)] += Q
        voice[b0:b0 + len(B)] += B
        save_wav(BUILD / "voice.wav", voice)
        save_wav(BUILD / "quran_trim.wav", Q)
        tl.update(quran_start=q0 / SR, quran_end=(q0 + len(Q)) / SR, B_start=b0 / SR,
                  A_end=len(A) / SR, B_end=(b0 + len(B)) / SR, total=total / SR,
                  level_voice=active_level(np.concatenate([A, B])), level_quran=active_level(Q))
        mode = "whisper"
        for sec, path, off in ((secA, assets / "sprecher_A.mp3", 0), (secB, assets / "sprecher_B.mp3", b0 / SR)):
            plain = " ".join(s["text"] for s in sec).replace("عليه السلام", "Friede sei auf ihm").replace("ﷻ", "")
            try:
                if timing_mode == "fallback":
                    raise RuntimeError("fallback erzwungen")
                ww = whisper_words(path, plain)
                if len(ww) < 5:
                    raise RuntimeError("zu wenige Wörter erkannt")
                align(sec, ww)
                (BUILD / f"whisper_{path.stem}.json").write_text(json.dumps(ww, ensure_ascii=False, indent=0))
            except Exception as e:
                print(f"  faster-whisper nicht nutzbar ({e}) -> silencedetect-Verfahren")
                mode = "silencedetect"
                fallback_times(sec, path, len(A if sec is secA else B) / SR)
            for s in sec:
                s["times"] = [(a + off, b + off) for a, b in s["times"]]
                s["start"] += off
                s["end"] += off
        tl["timing_mode"] = mode
    else:
        endA = estimate_times(secA, 0.15)
        q0 = endA + 0.5
        qd = 9.0
        b0 = q0 + qd + 0.6
        endB = estimate_times(secB, b0 + 0.1)
        tl.update(quran_start=q0, quran_end=q0 + qd, B_start=b0, A_end=endA, B_end=endB,
                  total=endB + 1.5, timing_mode="geschaetzt")
    tl["sentences"] = secA + secB
    (BUILD / "timeline.json").write_text(json.dumps(tl, ensure_ascii=False, indent=1))
    return tl


# ---------------------------------------------------------------- Mischung
def find_word(tl, sid, word):
    s = next(x for x in tl["sentences"] if x["id"] == sid)
    for tok, t in zip(s["tokens"], s["times"]):
        if word in tok:
            return t[0]
    return s["start"]


def sent(tl, sid):
    return next(x for x in tl["sentences"] if x["id"] == sid)


def fit_len(x, n, xf=0.3):
    """Schleife mit Kreuzblende auf Länge n."""
    if len(x) >= n:
        return x[:n].copy()
    c = int(xf * SR)
    out = x.copy()
    while len(out) < n:
        ramp = np.linspace(0, 1, c)[:, None]
        mix = out[-c:] * (1 - ramp) + x[:c] * ramp
        out = np.concatenate([out[:-c], mix, x[c:]])
    return out[:n]


def mix(assets, tl, scenes):
    voice = load(BUILD / "voice.wav")
    N = len(voice)
    Lv = tl["level_voice"]
    # Sprachaktivität (nur Sprecher, Rezitation separat behandelt)
    hop = 0.02
    r = frame_rms(voice, hop)
    act = (r > 10 ** ((Lv - 22) / 20)).astype(np.float32)
    k = int(0.18 / hop)
    act = np.convolve(act, np.ones(2 * k + 1), "same") > 0  # Dilatation
    act = act.astype(np.float32)
    sm = int(0.25 / hop)
    act = np.convolve(act, np.ones(sm) / sm, "same")
    # Gain relativ zur Stimme: Sprache -24 dB, Pause -16 dB
    gdb = Lv - 16 - 8 * act
    gain = 10 ** (np.repeat(gdb, int(SR * hop)) / 20)
    gain = np.pad(gain, (0, max(0, N - len(gain))), mode="edge")[:N]

    sfx = {}

    def get(name):
        if name not in sfx:
            x = load(assets / f"{name}.mp3")
            x = x / (10 ** (active_level(x) / 20))  # auf 0 dB aktiv normiert
            sfx[name] = x
        return sfx[name]

    bed = np.zeros_like(voice)

    def place(name, t0, t1, fin, fout, fixed_db=None, oneshot=False):
        a = max(0, int(t0 * SR))
        x = get(name)
        if oneshot:
            n = min(len(x), int((t1 - t0) * SR)) if t1 else len(x)
        else:
            n = int((t1 - t0) * SR)
        n = min(n, N - a)
        if n <= 0:
            return
        y = fit_len(x, n)
        y = fade(y, min(fin, n / SR / 2), min(fout, n / SR / 2))
        g = (10 ** (fixed_db / 20)) if fixed_db is not None else gain[a:a + n, None]
        bed[a:a + n] += y * g

    qs, qe = tl["quran_start"], tl["quran_end"]
    S = {s["img"]: s for s in scenes}
    # 01 Flammenwand: Feuer
    place("sfx_feuer_gross", 0, S["02"]["start"] + 0.4, 0.4, 1.2)
    # 05 Splitter: Steine genau bei "zerschlug"
    tz = find_word(tl, "A5", "zerschlug")
    place("sfx_steine", tz - 0.04, tz + 4.0, 0.01, 0.6, oneshot=True)
    # 06 Platz: Fackeln
    place("sfx_fackeln", S["06"]["start"] - 0.2, S["07"]["start"] + 0.5, 0.6, 0.8)
    # 07 Bau: Zünden bei "Verbrennt"
    tv = find_word(tl, "A9", "Verbrennt")
    place("sfx_zuenden", tv - 0.1, tv + 5.0, 0.02, 0.8, oneshot=True)
    # 08 Inferno: großes Feuer, ab erstem Ton der Rezitation 1,5 s Ausblendung
    place("sfx_feuer_gross", S["08"]["start"] - 0.2, qs + 1.5, 1.0, 1.5)
    # Rezitation: nur leise Glut, danach 10 Morgen mit Glut + Wind
    place("sfx_glut", qs, qe + 0.3, 1.0, 0.5, fixed_db=tl["level_quran"] - 30)
    place("sfx_glut", S["10"]["start"] - 0.3, S["11"]["start"] + 0.8, 0.6, 1.0)
    place("sfx_wind", S["10"]["start"] - 0.3, S["11"]["start"] + 1.2, 0.8, 1.2)

    out = voice + bed
    save_wav(BUILD / "mix_raw.wav", out)
    # Lautheit: zwei Durchgänge loudnorm, -14 LUFS, TP -1
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(BUILD / "mix_raw.wav"), "-af",
                        "loudnorm=I=-14:TP=-1:LRA=11:print_format=json", "-f", "null", "-"],
                       capture_output=True, text=True)
    m = json.loads(r.stderr[r.stderr.rfind("{"):])
    af = (f"loudnorm=I=-14:TP=-1:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:"
          f"measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:"
          f"linear=true:print_format=json")
    r = subprocess.run(["ffmpeg", "-hide_banner", "-y", "-i", str(BUILD / "mix_raw.wav"), "-af", af,
                        "-ar", str(SR), "-c:a", "pcm_s24le", str(BUILD / "mix.wav")],
                       capture_output=True, text=True, check=True)
    m2 = json.loads(r.stderr[r.stderr.rfind("{"):])
    return m2


def silent_mix(tl):
    n = int(tl["total"] * SR)
    save_wav(BUILD / "mix.wav", np.zeros((n, 2), np.float32))


def measure(path):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(path), "-af", "ebur128=peak=true", "-f", "null", "-"],
                       capture_output=True, text=True)
    tail = r.stderr[r.stderr.rfind("Summary:"):]
    I = re.search(r"I:\s+(-?[\d.]+) LUFS", tail)
    P = re.search(r"Peak:\s+(-?[\d.inf]+) dBFS", tail)
    return (float(I.group(1)) if I else None, P.group(1) if P else None)
