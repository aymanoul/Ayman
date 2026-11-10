#!/usr/bin/env python3
"""Zerlegt eine Sprecher-Aufnahme in die Drehbuch-Zeilen (A01 … / B01 …).

    python3 tools/split_voices.py A assets/audio/roh/stimme_A_neu.mp3

1. Spracherkennung mit Wort-Zeitmarken (tools/transcribe.py) muss vorher gelaufen sein:
   assets/audio/transkript/<A|B>_neu.json  (wird sonst automatisch erzeugt)
2. Die Wörter werden per Textvergleich den Zeilen aus docs/phase3-drehbuch.md zugeordnet.
3. Jede Zeile wird mit 80 ms Vorlauf / 150 ms Nachlauf ausgeschnitten → assets/audio/zeilen/A01.wav …
4. Übersicht mit Länge und Übereinstimmung → assets/audio/zeilen/<A|B>.json  (Zeilen unter 70 % bitte anhören)
"""
import difflib, json, os, re, subprocess, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
who, src = sys.argv[1], sys.argv[2]
tr = os.path.join(ROOT, f'assets/audio/transkript/{who}_neu.json')
if not os.path.exists(tr):
    subprocess.run([sys.executable, os.path.join(ROOT, 'tools/transcribe.py'), src, tr, 'de'], check=True)
words = [w for seg in json.load(open(tr)) for w in seg['words']]

md = open(os.path.join(ROOT, 'docs/phase3-drehbuch.md')).read()
sec = md[md.index('## Sprechertext für ElevenLabs'):]
lines = [(i, t.strip()) for i, _, t, _ in re.findall(r'^\| ([AB]\d\d) \| ([^|]+) \| ([^|]+) \| ([^|]+) \|$', sec, re.M) if i.startswith(who)]

norm = lambda s: re.sub(r'[^a-zäöüß]', '', s.lower().replace('ß', 'ss'))
W = [norm(w['w']) for w in words]
# 1+2) Lückenlose Aufteilung aller Wörter auf die Zeilen (in Drehbuch-Reihenfolge), die insgesamt am besten zum Text passt
N, L = len(W), len(lines)
targets = [[norm(x) for x in t.split() if norm(x)] for _, t in lines]
NEG = -1e9
best = [[NEG] * (N + 1) for _ in range(L + 1)]
back = [[0] * (N + 1) for _ in range(L + 1)]
best[0][0] = 0.0
for i in range(1, L + 1):
    tg = targets[i - 1]
    for e in range(1, N + 1):
        for st in range(max(0, e - len(tg) - 8), e - max(1, len(tg) - 6) + 1):
            if best[i - 1][st] <= NEG / 2: continue
            v = best[i - 1][st] + difflib.SequenceMatcher(None, tg, W[st:e]).ratio()
            if v > best[i][e]: best[i][e], back[i][e] = v, st
spans, e = [], N
for i in range(L, 0, -1):
    st = back[i][e]; spans.append([0, st, e]); e = st
spans.reverse()
# 3) ausschneiden, mit Treffer neu bewerten
out = []
for (lid, text), (r0, a, b) in zip(lines, spans):
    target = [norm(x) for x in text.split() if norm(x)]
    r = difflib.SequenceMatcher(None, target, W[a:b]).ratio()
    t0, t1 = max(0, words[a]['start'] - 0.08), words[b - 1]['end'] + 0.15
    dst = os.path.join(ROOT, f'assets/audio/zeilen/{lid}.wav')
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{t0:.3f}', '-to', f'{t1:.3f}', '-i', src, '-ac', '1', '-ar', '48000',
                    '-af', 'afade=t=in:d=0.02,areverse,afade=t=in:d=0.05,areverse', dst], check=True)
    out.append({'id': lid, 'start': round(t0, 3), 'end': round(t1, 3), 'dauer': round(t1 - t0, 2), 'treffer': round(r, 2),
                'text': text, 'erkannt': ' '.join(w['w'] for w in words[a:b]),
                'woerter': [{'w': w['w'], 't0': round(w['start'] - t0, 3), 't1': round(w['end'] - t0, 3)} for w in words[a:b]]})
    print(f'{lid}  {t1 - t0:5.2f} s  Treffer {r:4.0%}  {"⚠️ bitte anhören" if r < 0.7 else ""}')
json.dump(out, open(os.path.join(ROOT, f'assets/audio/zeilen/{who}.json'), 'w'), ensure_ascii=False, indent=1)
