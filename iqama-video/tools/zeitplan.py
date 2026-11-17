#!/usr/bin/env python3
"""Zeitplan „Zwischen Adhan und Iqama“ aus den echten Zeilenlängen → audio/zeitplan.json und assets/audio/zeilen/lines.json

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

ADHAN = {'datei': '../gebet-video/assets/audio/roh/adhan_neu.mp3', 'von': 72.0, 'bis': 77.5}   # letzte Worte der Datei (Ayman 17.11.)
DREHBUCH = {
    'A01': 'Es gibt Minuten am Tag, in denen dein Bittgebet nicht abgelehnt wird. Und die meisten verbringen sie am Handy.',
    'B01': 'Noch zehn Minuten bis zur Iqama. Kurz noch was gucken.',
    'A02': 'Weißt du, welche Zeit das gerade ist?',
    'B02': 'Na ja, Wartezeit eben.',
    'A03': 'Der Prophet, Allahs Segen und Frieden auf ihm, sagte:',
    'A04': '„Das Bittgebet zwischen Adhan und Iqamah wird nicht abgelehnt.“',
    'B03': 'Nicht abgelehnt? In diesen paar Minuten?',
    'A05': 'Genau jetzt. Und wer auf das Gebet wartet, gilt die ganze Zeit, als wäre er im Gebet.',
    'B04': 'Und ich hab die Zeit jeden Tag am Handy verbracht.',
    'A06': 'Fünfmal am Tag öffnet sich diese Tür. Bitte um alles, was du brauchst: für dich, für deine Eltern, für dein Jenseits.',
    'B05': 'Dann bleibt das Handy jetzt in der Tasche.',
    'A07': 'Zwischen Adhan und Iqama: Handy weg, Hände hoch.',
}
# Shots und ihre Zeilen (Reihenfolge = Film); S1 = Ende des Adhan, danach Stille
NACH = {'A04': 1.6}   # Zeit zum Lesen der Hadith-Karte im Kernbild
SHOTS = [('S1', []), ('S2', ['A01']), ('S3', ['B01']), ('S4', ['A02', 'B02']), ('S5', ['A03']), ('S6', ['A04']), ('S7', ['B03']),
         ('S8', ['A05']), ('S9', ['B04']), ('S10', ['A06']), ('S11', ['B05']), ('S12', ['A07'])]

norm = lambda w: re.sub(r'[^a-zäöüß0-9]', '', w.lower().replace('ß', 'ss')).replace('allahs', 'allahs').replace('iqamah', 'iqama').replace('10', 'zehn').replace('habe', 'hab')


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
    if sid == 'S1':
        t += ADHAN['bis'] - ADHAN['von'] - 0.6        # Adhan klingt aus, kurze Stille
    for z in zs:
        stimmen.append([z, round(t, 3)])
        t += lines[z]['dauer'] + GAP + NACH.get(z, 0.0)
    if sid == 'S12':
        t += SCHLUSS
    shots.append({'id': sid, 't0': round(t0, 3), 't': round(t - t0, 3)})
json.dump({'dauer': round(t, 3), 'fps': FPS, 'shots': shots, 'stimmen': stimmen, 'adhan': ADHAN}, open(os.path.join(ROOT, 'audio', 'zeitplan.json'), 'w'), indent=1)
print(f'Gesamtlänge {t:.1f} s')
for s in shots:
    print(f"  {s['id']:4s} {s['t0']:6.2f} + {s['t']:5.2f}")
