#!/usr/bin/env python3
"""Zeitplan aus den echten Zeilenlängen → audio/zeitplan.json und assets/audio/zeilen/lines.json

- lines.json: je Zeile Dauer, Lautstärke-Hüllkurve (30 Bilder/s, für den Mund) und Wortzeiten in Drehbuch-Schreibweise
  (Wortzeiten aus der Spracherkennung assets/audio/transkript/zeilen/<Zeile>.json, dort 0,5 s Vorlauf).
- zeitplan.json: Shots S1–S11 mit Start und Dauer, Stimmen mit Startzeit, Gesamtlänge.
    python3 tools/zeitplan.py
"""
import difflib, json, os, re, subprocess
import numpy as np

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
Z = os.path.join(ROOT, 'assets', 'audio', 'zeilen')
T = os.path.join(ROOT, 'assets', 'audio', 'transkript', 'zeilen')
FPS, GAP, VORLAUF, SCHLUSS = 30, 0.25, 0.2, 2.6

DREHBUCH = {
    'A01': 'Dein Handy zählt jeden deiner Schritte. Aber es gibt Schritte, die ganz anders gezählt werden.',
    'B01': 'Achttausend Schritte heute. Nicht schlecht, oder?',
    'A02': 'Und wie viele davon waren auf dem Weg zur Moschee?',
    'B02': 'Keine Ahnung. Schritt ist doch Schritt.',
    'A03': 'Nicht ganz. Der Prophet, Allahs Segen und Frieden auf ihm, sagte:',
    'A04': '„Wer sich in seinem Haus reinigt und dann zu einem der Häuser Allahs geht, um eine der Pflichten Allahs zu erfüllen, '
           'dessen Schritte sind so: Der eine tilgt eine Sünde, und der andere erhöht um eine Rangstufe.“',
    'B03': 'Bei jedem einzelnen Schritt?',
    'A05': 'Bei jedem einzelnen. Viele Schritte zu den Moscheen gehören zu dem, womit Allah Sünden tilgt und Rangstufen erhöht.',
    'B04': 'Dann habe ich heute ganz schön viele verschenkt.',
    'A06': 'Fünf Gebete am Tag, fünf Wege dorthin. Mach deinen Wudu zu Hause, und sammle sie.',
    'B05': 'Ab dem nächsten Gebet zähle ich anders.',
    'A07': 'Dein Handy zählt deine Schritte. Bei Allah zählt, wohin sie führen.',
}
# Shots und ihre Zeilen (Reihenfolge = Film)
SHOTS = [('S1', ['A01']), ('S2', ['B01']), ('S3', ['A02', 'B02']), ('S4', ['A03']), ('S5', ['A04']), ('S6', ['B03']),
         ('S7', ['A05']), ('S8', ['B04']), ('S9', ['A06']), ('S10', ['B05']), ('S11', ['A07'])]

norm = lambda w: re.sub(r'[^a-zäöüß0-9]', '', w.lower().replace('ß', 'ss')).replace('allas', 'allahs').replace('8000', 'achttausend').replace('5', 'fünf')


def dauer(f):
    return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], capture_output=True, text=True).stdout)


def huelle(f):
    pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-ac', '1', '-ar', '48000', '-f', 's16le', '-'], capture_output=True, check=True).stdout
    x = np.frombuffer(pcm, np.int16).astype(np.float64) / 32768
    hop = 48000 // FPS
    rms = np.array([np.sqrt(np.mean(x[i:i + hop * 2] ** 2)) for i in range(0, len(x), hop)])
    return [round(float(v), 3) for v in np.clip(rms / (np.percentile(rms, 95) + 1e-9), 0, 1)]


lines = {}
for z, text in DREHBUCH.items():
    f = os.path.join(Z, z + '.wav')
    d = dauer(f)
    asr = [w for s in json.load(open(os.path.join(T, z + '.json'))) for w in s['words']]
    asr = [{'w': w['w'], 't0': max(0.0, w['start'] - 0.5), 't1': max(0.0, w['end'] - 0.5)} for w in asr]
    script = text.split()
    times = [None] * len(script)
    sm = difflib.SequenceMatcher(None, [norm(w) for w in script], [norm(w['w']) for w in asr])
    for a, b, n in sm.get_matching_blocks():
        for k in range(n):
            times[a + k] = (asr[b + k]['t0'], asr[b + k]['t1'])
    i = 0                                                    # Lücken nach Wortlänge auffüllen
    while i < len(script):
        if times[i] is not None:
            i += 1; continue
        j = i
        while j < len(script) and times[j] is None:
            j += 1
        t0 = times[i - 1][1] if i > 0 else 0.05
        t1 = times[j][0] if j < len(script) else d - 0.05
        L = sum(len(w) for w in script[i:j]) or 1
        t = t0
        for k in range(i, j):
            dt = (t1 - t0) * len(script[k]) / L
            times[k] = (t, t + dt); t += dt
        i = j
    treffer = sum(n for _, _, n in sm.get_matching_blocks()) / len(script)
    lines[z] = {'dauer': round(d, 3), 'env': huelle(f), 'woerter': [{'w': w, 't0': round(a, 3), 't1': round(b, 3)} for w, (a, b) in zip(script, times)],
                'treffer': round(treffer, 2)}
    print(f'{z}: {d:5.2f} s · Wörter erkannt {treffer:.0%}')
json.dump(lines, open(os.path.join(Z, 'lines.json'), 'w'), ensure_ascii=False)

t = 0.0
shots, stimmen = [], []
for sid, zs in SHOTS:
    t0 = t
    t += VORLAUF if sid == 'S1' else 0.0
    for z in zs:
        stimmen.append([z, round(t, 3)])
        t += lines[z]['dauer'] + GAP
    if sid == 'S11':
        t += SCHLUSS
    shots.append({'id': sid, 't0': round(t0, 3), 't': round(t - t0, 3)})
json.dump({'dauer': round(t, 3), 'fps': FPS, 'shots': shots, 'stimmen': stimmen}, open(os.path.join(ROOT, 'audio', 'zeitplan.json'), 'w'), indent=1)
print(f'Gesamtlänge {t:.1f} s')
for s in shots:
    print(f"  {s['id']:4s} {s['t0']:6.2f} + {s['t']:5.2f}")
