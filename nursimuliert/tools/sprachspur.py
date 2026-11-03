#!/usr/bin/env python3
"""Sprachspur aus fertigen Satz-Aufnahmen (z. B. ElevenLabs) und Wortzeiten.

  .venv-stimme/bin/python tools/sprachspur.py importieren <datei1> ... <datei12>   # in Satz-Reihenfolge
  .venv-stimme/bin/python tools/sprachspur.py zusammensetzen

importieren:    audio/quellen/ (unveraenderte Kopien), audio/saetze/satz_XX.wav (Mono 48 kHz)
zusammensetzen: Stille je Satz auf 0,1 s kuerzen, Pausen nach story/shots.json (voice.gap,
                voice.pauseBefore), -16 LUFS -> audio/stimme.wav; Wortzeiten -> audio/transkript.json

Wortzeiten: Wenn faster-whisper (Modell) verfuegbar ist, wird es benutzt. Sonst richtet das
Skript den bekannten Text am Signal aus: Sprechpausen trennen Satzteile an Satzzeichen,
Silbenkerne (Huellkurvenmaxima) werden den Silben der Woerter zugeordnet, Wortgrenzen liegen
in den Huellkurvenminima dazwischen.
"""
import json, os, re, shutil, stat, subprocess, sys
import numpy as np
import soundfile as sf
from scipy import signal

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
A = lambda *p: os.path.join(ROOT, 'audio', *p)
SR = 48000


def ff(args):
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', *args], check=True)


def load(path):
    x, sr = sf.read(path, dtype='float64', always_2d=False)
    if x.ndim > 1:
        x = x.mean(1)
    assert sr == SR, sr
    return x


def story():
    return json.load(open(os.path.join(ROOT, 'story', 'shots.json'), encoding='utf-8'))


def envelope(x, frame=0.005):
    """Sprachhuellkurve (300-3500 Hz), 5-ms-Raster, in dB."""
    sos = signal.butter(3, [300 / (SR / 2), 3500 / (SR / 2)], btype='band', output='sos')
    y = signal.sosfiltfilt(sos, x)
    n = int(frame * SR)
    m = len(y) // n
    e = np.sqrt(np.mean(y[: m * n].reshape(m, n) ** 2, axis=1) + 1e-12)
    k = 7
    e = np.convolve(e, np.hanning(k) / np.hanning(k).sum(), 'same')
    return 20 * np.log10(e + 1e-9), frame


def syllables(word):
    w = word.lower()
    groups = re.findall(r'[aeiouyäöü]+', w)
    return max(1, len(groups))


def importieren(files):
    sc = story()['script']
    if len(files) != len(sc):
        sys.exit(f'{len(files)} Dateien, aber {len(sc)} Saetze')
    os.makedirs(A('quellen'), exist_ok=True)
    os.makedirs(A('saetze'), exist_ok=True)
    for s, f in zip(sc, files):
        dst = A('quellen', f'satz_{s["id"]:02d}_' + os.path.basename(f).split('-', 1)[-1])
        if not os.path.exists(dst):
            shutil.copyfile(f, dst)
            os.chmod(dst, stat.S_IRUSR | stat.S_IRGRP | stat.S_IROTH)
        ff(['-i', dst, '-ac', '1', '-ar', str(SR), A('saetze', f'satz_{s["id"]:02d}.wav')])
        d = len(load(A('saetze', f'satz_{s["id"]:02d}.wav'))) / SR
        print(f'Satz {s["id"]:2d}: {d:5.2f} s  <- {os.path.basename(f)}')


def trim(x, keep=0.1):
    e, fr = envelope(x)
    thr = max(e.max() - 45, -70)
    idx = np.where(e > thr)[0]
    a = max(0, int((idx[0] * fr - keep) * SR))
    b = min(len(x), int(((idx[-1] + 1) * fr + keep) * SR))
    return x[a:b]


def expected_len(word):
    """Erwartete relative Wortdauer: Laute (Buchstaben, Doppellaute zaehlen einfach) + Grundlaenge."""
    w = re.sub(r'[^a-zäöüß]', '', word.lower())
    w = re.sub(r'(sch|ch|ei|ie|au|eu|äu|ng|ss|ll|nn|tt|mm|rr|hh)', 'X', w)
    return len(w) + 1.5


def align_phrase(e, fr, words, a, b, top):
    """Wortgrenzen per dynamischer Programmierung: Kandidaten sind Huellkurven-Minima und
    Lautanfaenge nach Pausen; Kosten = Abweichung der Wortdauern von der Erwartung - Tiefe der Grenze."""
    n = len(words)
    if n == 1:
        return [{'word': words[0], 'start': round(a * fr, 3), 'end': round(b * fr, 3), 'prob': None}]
    seg = e[a:b]
    silent = seg < top - 32
    cands = {}
    # Lautanfaenge nach Stille (starke Grenze)
    for i in range(1, len(seg)):
        if silent[i - 1] and not silent[i]:
            cands[i] = 30.0
    # lokale Minima mit Tiefe
    w = int(0.06 / fr)
    for i in range(w, len(seg) - w):
        if silent[i]:
            continue
        if seg[i] == seg[i - w:i + w + 1].min():
            depth = min(seg[i - w:i].max(), seg[i + 1:i + w + 1].max()) - seg[i]
            if depth >= 1.5:
                cands[i] = max(cands.get(i, 0), min(depth, 25.0))
    C = sorted(cands)
    exp = np.array([expected_len(x) for x in words])
    exp = exp / exp.sum() * len(seg)
    INF = 1e18
    # dp[k][j]: beste Kosten, wenn Grenze k (Beginn von Wort k+1) bei Kandidat j liegt
    m = len(C)
    if m < n - 1:
        acc = np.concatenate([[0], np.cumsum(exp)]).astype(int)
        bounds = list(acc)
    else:
        def wcost(i, d):
            if d < 0.05 / fr:
                return INF
            return 6.0 * np.log(d / exp[i]) ** 2
        dp = np.full((n - 1, m), INF)
        bp = np.zeros((n - 1, m), dtype=int)
        for j, c in enumerate(C):
            dp[0, j] = wcost(0, c) - cands[c] / 10
        for k in range(1, n - 1):
            for j, c in enumerate(C):
                best, arg = INF, -1
                for i in range(j):
                    if dp[k - 1, i] >= INF:
                        continue
                    v = dp[k - 1, i] + wcost(k, c - C[i])
                    if v < best:
                        best, arg = v, i
                if arg >= 0:
                    dp[k, j] = best - cands[c] / 10
                    bp[k, j] = arg
        tot = [dp[n - 2, j] + wcost(n - 1, len(seg) - C[j]) if dp[n - 2, j] < INF else INF for j in range(m)]
        j = int(np.argmin(tot))
        idx = [j]
        for k in range(n - 2, 0, -1):
            j = bp[k, j]; idx.append(j)
        bounds = [0] + [C[i] for i in reversed(idx)] + [len(seg)]
    res = []
    for i, word in enumerate(words):
        s0, s1 = bounds[i], bounds[i + 1]
        # Wortende vor einer folgenden Pause
        e1 = s1
        while e1 - 1 > s0 and silent[e1 - 1]:
            e1 -= 1
        res.append({'word': word, 'start': round((a + s0) * fr, 3), 'end': round((a + e1) * fr, 3), 'prob': None})
    return res


def align(x, text):
    """Woerter des Textes am Signal ausrichten. Zeiten relativ zum Clip-Anfang."""
    words = text.split()
    e, fr = envelope(x)
    top = e.max()
    voiced = e > top - 32
    # Sprechbereiche (Luecken < 60 ms schliessen)
    runs, i = [], 0
    while i < len(voiced):
        if voiced[i]:
            j = i
            while j < len(voiced) and voiced[j]:
                j += 1
            runs.append([i, j]); i = j
        else:
            i += 1
    merged = []
    for r in runs:
        if merged and (r[0] - merged[-1][1]) * fr < 0.06:
            merged[-1][1] = r[1]
        else:
            merged.append(r)
    merged = [r for r in merged if (r[1] - r[0]) * fr > 0.04]
    # Satzteile an Satzzeichen; passen sie zu den Sprechbereichen, werden sie getrennt ausgerichtet
    phrases, cur = [], []
    for w in words:
        cur.append(w)
        if re.search(r'[,.;:!?“”‘]$', w):
            phrases.append(cur); cur = []
    if cur:
        phrases.append(cur)
    big = [k for k in range(len(merged) - 1) if (merged[k + 1][0] - merged[k][1]) * fr > 0.12]
    if len(phrases) > 1 and len(big) == len(phrases) - 1:
        # deutliche Pausen genau an den Satzzeichen: Satzteile getrennt ausrichten
        cuts = big
        spans, start = [], 0
        for c in cuts:
            spans.append([merged[start][0], merged[c][1]]); start = c + 1
        spans.append([merged[start][0], merged[-1][1]])
    else:
        phrases = [words]
        spans = [[merged[0][0], merged[-1][1]]]
    out = []
    for ph, (a, b) in zip(phrases, spans):
        out += align_phrase(e, fr, ph, a, b, top)
    return out


def zusammensetzen():
    st = story()
    V = st['voice']
    parts, clips, t = [], [], 0.0
    for s in st['script']:
        x = trim(load(A('saetze', f'satz_{s["id"]:02d}.wav')), 0.1)
        if parts:
            p = float(V.get('pauseBefore', {}).get(str(s['id']), V['gap']))
            parts.append(np.zeros(int(p * SR)))
            t += p
        clips.append((s, t, x))
        parts.append(x)
        t += len(x) / SR
    y = np.concatenate(parts)
    import pyloudnorm as pyln
    meter = pyln.Meter(SR)
    raw = A('stimme_roh.wav')
    sf.write(raw, y.astype(np.float32), SR)
    # -16 LUFS, True Peak -1,5 dBFS (ffmpeg loudnorm, zwei Durchgaenge, linear)
    r = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', raw, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
    m = json.loads(r[r.rfind('{'):r.rfind('}') + 1])
    ff(['-i', raw, '-af', f"loudnorm=I=-16:TP=-1.5:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true", '-ar', str(SR), '-ac', '1', A('stimme.wav')])
    os.remove(raw)
    y = load(A('stimme.wav'))
    sentences = []
    for s, t0, x in clips:
        text = s.get('speak') or re.sub(r'[„“"‚‘]', '', s['text'])
        ws = align(x, text)
        for w in ws:
            w['start'] = round(w['start'] + t0, 3); w['end'] = round(w['end'] + t0, 3)
        sentences.append({'id': s['id'], 'start': ws[0]['start'], 'end': ws[-1]['end'], 'words': ws})
    json.dump({'source': 'audio/stimme.wav', 'method': 'Signal-Ausrichtung (Silbenkerne, Pausen) am bekannten Text',
               'duration': round(len(y) / SR, 3), 'sentences': sentences},
              open(A('transkript.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'audio/stimme.wav {len(y)/SR:.2f} s, {meter.integrated_loudness(y):.1f} LUFS, Peak {20*np.log10(np.abs(y).max()):.1f} dBFS')
    for s in sentences:
        print(f'  Satz {s["id"]:2d} {s["start"]:6.2f}-{s["end"]:6.2f}: ' + ' '.join(f'{w["word"]}@{w["start"]:.2f}' for w in s['words']))


if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == 'importieren':
        importieren(sys.argv[2:])
    elif len(sys.argv) > 1 and sys.argv[1] == 'zusammensetzen':
        zusammensetzen()
    else:
        print(__doc__)
