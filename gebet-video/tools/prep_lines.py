#!/usr/bin/env python3
"""Bereitet die geschnittenen Zeilen für den Film vor → assets/audio/zeilen/lines.json

Je Zeile: Dauer, Lautstärke-Hüllkurve (30 Werte pro Sekunde, 0..1) für die Lippenbewegung und Untertitel-Wörter
im Wortlaut des Drehbuchs (Schreibweise aus dem Drehbuch, Zeiten aus der Spracherkennung).
"""
import difflib, json, os, re, subprocess
import numpy as np

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
Z = os.path.join(ROOT, 'assets/audio/zeilen')
FPS, SR = 30, 48000
norm = lambda s: re.sub(r'[^a-zäöüß]', '', s.lower().replace('ß', 'ss'))
# Schreibweise im Untertitel (Aussprache-Hilfen für die KI wieder zurück)
SPELL = {'Sakar': 'Saqar', 'Sakar,': 'Saqar,', 'aleikum,': 'alaikum,', 'aleikum': 'alaikum'}

out = {}
for who in 'AB':
    for z in json.load(open(os.path.join(Z, f'{who}.json'))):
        pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', os.path.join(Z, z['id'] + '.wav'), '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'],
                             capture_output=True, check=True).stdout
        x = np.frombuffer(pcm, np.int16).astype(np.float64) / 32768
        hop = SR // FPS
        rms = np.array([np.sqrt(np.mean(x[i:i + hop * 2] ** 2)) for i in range(0, len(x), hop)])
        env = np.clip(rms / (np.percentile(rms, 95) + 1e-9), 0, 1)
        # Untertitel: Drehbuch-Wörter mit Zeiten der erkannten Wörter
        script = [SPELL.get(w, w) for w in re.sub(r'\s*…', '…', z['text']).split() if w not in ('–', '-', '…')]
        asr = z['woerter']
        sm = difflib.SequenceMatcher(None, [norm(w) for w in script], [norm(w['w']) for w in asr])
        times = [None] * len(script)
        for a, b, n in sm.get_matching_blocks():
            for k in range(n): times[a + k] = (asr[b + k]['t0'], asr[b + k]['t1'])
        # Lücken (anders erkannte Wörter) gleichmäßig nach Wortlänge auffüllen
        i = 0
        dur = len(x) / SR
        while i < len(script):
            if times[i] is not None: i += 1; continue
            j = i
            while j < len(script) and times[j] is None: j += 1
            t0 = times[i - 1][1] if i > 0 else 0.05
            t1 = times[j][0] if j < len(script) else dur - 0.1
            L = sum(len(w) for w in script[i:j]) or 1
            t = t0
            for k in range(i, j):
                d = (t1 - t0) * len(script[k]) / L
                times[k] = (t, t + d); t += d
            i = j
        out[z['id']] = {'who': who, 'dauer': round(dur, 3), 'env': [round(v, 3) for v in env],
                        'woerter': [{'w': w, 't0': round(a, 3), 't1': round(b, 3)} for w, (a, b) in zip(script, times)]}
json.dump(out, open(os.path.join(Z, 'lines.json'), 'w'), ensure_ascii=False)
print(len(out), 'Zeilen →', os.path.join('assets/audio/zeilen', 'lines.json'))
for k in ('A02', 'B01', 'A07'):
    print(k, ' '.join(f"{w['w']}@{w['t0']:.2f}" for w in out[k]['woerter'][:9]))
