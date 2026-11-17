#!/usr/bin/env python3
"""Phase 4: Tonspur = Adhan-Ende + Stimmen + Geräusche (keine Musik, keine Instrumente, kein Gesang).

    python3 tools/ton.py   → out/phase4/ton.wav (48 kHz, Stereo, noch nicht lautheitsnormiert)
    braucht: audio/zeitplan.json, assets/audio/zeilen/*.wav + lines.json

- Adhan: letzte Worte von adhan_neu.mp3 (Aymans Wahl), weich ein- und ausgeblendet, wie im Rohschnitt
- ruhiger Raumklang der Moschee über das ganze Video
- Handy-Tippen in S3 (B scrollt), weicher Wisch bei Karte H1, Goldschrift, Bildschirmzeit und Schlusssatz,
  leiser heller Klick je Lichtpunkt in S10, Stoff-Rascheln beim Einstecken des Handys (S11) und beim Händeheben (S12)
Geräusch-Bausteine: gebet-video/tools/sfx.py und gebet-video/assets/sfx (nur gelesen).
"""
import json, os, subprocess, sys
import numpy as np
from scipy.io import wavfile

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
GV = os.path.join(ROOT, '..', 'gebet-video')
sys.path.insert(0, os.path.join(GV, 'tools'))
import sfx                                              # noqa: E402

SR = 48000
ZP = json.load(open(os.path.join(ROOT, 'audio', 'zeitplan.json')))
LINES = json.load(open(os.path.join(ROOT, 'assets', 'audio', 'zeilen', 'lines.json')))
SHOT = {s['id']: s for s in ZP['shots']}
START = dict((z, t0) for z, t0 in ZP['stimmen'])
N = int(ZP['dauer'] * SR) + SR
L, R = np.zeros(N), np.zeros(N)
db = lambda d: 10 ** (d / 20)
rng = np.random.default_rng(7)


def lies(f, von=None, dauer=None):
    """Beliebige Tondatei → Mono float (48 kHz) über ffmpeg."""
    zeit = (['-ss', str(von)] if von is not None else []) + (['-t', str(dauer)] if dauer is not None else [])
    raw = subprocess.run(['ffmpeg', '-v', 'error'] + zeit + ['-i', f, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.int16).astype(np.float64) / 32768


def leg(x, t, gain_db, pan=0.0):
    i = int(t * SR)
    x = x[: max(0, N - i)] * db(gain_db)
    L[i:i + len(x)] += x * np.sqrt((1 - pan) / 2) * np.sqrt(2)
    R[i:i + len(x)] += x * np.sqrt((1 + pan) / 2) * np.sqrt(2)


def wort(z, text, nr=0):
    return START[z] + [w['t0'] for w in LINES[z]['woerter'] if w['w'].startswith(text)][nr]


FX = {n: lies(os.path.join(GV, 'assets', 'sfx', n + '.wav')) for n in ('pop', 'whoosh_kurz', 'stoff', 'raumklang_moschee')}

# ---- Adhan-Ende (−6 dB, Ein-/Ausblenden wie im freigegebenen Rohschnitt)
ad = ZP['adhan']
d = ad['bis'] - ad['von']
adhan = lies(os.path.join(ROOT, ad['datei']), ad['von'], d)
tt = np.arange(len(adhan)) / SR
adhan *= np.clip(tt / 0.4, 0, 1) * np.clip((d - tt) / 1.6, 0, 1)
leg(adhan, 0, -6)

# ---- Stimmen
for z, t0 in ZP['stimmen']:
    leg(lies(os.path.join(ROOT, 'assets', 'audio', 'zeilen', z + '.wav')), t0, 0.0)

# ---- Raumklang: ruhig, über das ganze Video
raum = FX['raumklang_moschee']
while len(raum) < N:
    raum = np.concatenate([raum, raum])
raum = raum[:N] * np.clip(np.arange(N) / SR / 0.8, 0, 1)
leg(raum, 0, -36)


# ---- Handy-Tippen (S3): kurze, weiche Klicks auf Glas
def tipp():
    n = int(0.03 * SR)
    x = sfx.bp(rng.standard_normal(n), 1800, 6000, 2) * np.exp(-np.arange(n) / (0.004 * SR))
    return x / (np.max(np.abs(x)) + 1e-9)


s3 = SHOT['S3']['t0']
for dt in (0.35, 0.9, 1.25, 2.3, 2.95):
    leg(tipp(), s3 + dt + rng.uniform(-0.03, 0.03), -30, 0.2)

# ---- Wische: Karte H1, Goldschrift, Bildschirmzeit, Schlusssatz
for t, g in ((START['A04'] + 0.2, -22), (wort('A05', 'wer'), -27), (SHOT['S9']['t0'], -25), (START['A07'] + LINES['A07']['dauer'] + 0.25, -24)):
    leg(FX['whoosh_kurz'], t - 0.05, g)

# ---- Lichtpunkte (S10): leiser heller Klick, wenn ein Punkt aufleuchtet (Zeiten wie in blender/film.py)
s10 = SHOT['S10']
for k in range(5):
    leg(FX['pop'], s10['t0'] + s10['t'] * (0.05 + k * 0.09 + 0.02), -30, -0.6 + 0.3 * k)

# ---- Stoff-Rascheln: Handy in die Tasche (S11), Hände heben (S12)
leg(FX['stoff'], SHOT['S11']['t0'] + 0.1, -22, -0.2)
leg(FX['stoff'], SHOT['S12']['t0'] + 0.3, -27, 0.1)

out = os.path.join(ROOT, 'out', 'phase4')
os.makedirs(out, exist_ok=True)
x = np.stack([L, R], axis=1)[: int(ZP['dauer'] * SR)]
x = np.clip(x, -1, 1)
wavfile.write(os.path.join(out, 'ton.wav'), SR, (x * 32767).astype(np.int16))
print(f'ton.wav · {len(x) / SR:.2f} s · Spitze {20 * np.log10(np.max(np.abs(x)) + 1e-9):.1f} dBFS')
