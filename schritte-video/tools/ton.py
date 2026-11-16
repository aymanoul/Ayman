#!/usr/bin/env python3
"""Phase 4: Tonspur = Stimmen + Geräusche (keine Musik, keine Instrumente, kein Gesang).

    python3 tools/ton.py   → out/phase4/ton.wav (48 kHz, Stereo, noch nicht lautheitsnormiert)
    braucht: audio/zeitplan.json, audio/punkte.json, assets/audio/zeilen/*.wav

- Schritte auf Pflaster genau dann, wenn ein Fuß der Figur aufsetzt (Gehphase aus blender/film.py --punkte)
- leiser Außenton (Wind, Blätter – keine Autos), ab der offenen Tür ruhiger Raumklang
- sanfter Klick, wenn ein Abdruck aufleuchtet (S5), Wischgeräusche für Karten, Handy und die fünf Wege, Tür in S11
Geräusch-Bausteine: gebet-video/tools/sfx.py und gebet-video/assets/sfx (nur gelesen).
"""
import json, os, sys
import numpy as np
from scipy.io import wavfile

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
GV = os.path.join(ROOT, '..', 'gebet-video')
sys.path.insert(0, os.path.join(GV, 'tools'))
import sfx                                              # noqa: E402  (Hilfsfunktionen, eigener Zufall mit festem Startwert)

SR = 48000
ZP = json.load(open(os.path.join(ROOT, 'audio', 'zeitplan.json')))
P = json.load(open(os.path.join(ROOT, 'audio', 'punkte.json')))
SHOT = {s['id']: s for s in ZP['shots']}
N = int(ZP['dauer'] * SR) + SR
L, R = np.zeros(N), np.zeros(N)
db = lambda d: 10 ** (d / 20)
rng = np.random.default_rng(11)


def lies(f):
    sr, x = wavfile.read(f)
    x = x.astype(np.float64) / 32768
    return x.mean(axis=1) if x.ndim == 2 else x


def leg(x, t, gain_db, pan=0.0):
    i = int(t * SR)
    x = x[: max(0, N - i)] * db(gain_db)
    L[i:i + len(x)] += x * np.sqrt((1 - pan) / 2) * np.sqrt(2)
    R[i:i + len(x)] += x * np.sqrt((1 + pan) / 2) * np.sqrt(2)


FX = {n: lies(os.path.join(GV, 'assets', 'sfx', n + '.wav')) for n in ('pop', 'whoosh_kurz', 'tuer', 'raumklang_moschee')}

# ---- Stimmen
for z, t0 in ZP['stimmen']:
    leg(lies(os.path.join(ROOT, 'assets', 'audio', 'zeilen', z + '.wav')), t0, 0.0)

# ---- Schritte: Fuß setzt auf, wenn die Gehphase eine ganze Zahl überschreitet
LAUT = {'S1': -17, 'S2': -27, 'S5': -21, 'S10': -22, 'S11': -23}
PAN = {'A_Qamis_Skelett': -0.25, 'B_Hemd_Skelett': 0.25}
schritte = 0
for a, b in zip(P, P[1:]):
    if a['shot'] != b['shot'] or b['shot'] not in LAUT:
        continue
    for fig, ph in b['phase'].items():
        if fig in a['phase'] and int(ph) > int(a['phase'][fig]):
            st = sfx.step('gehweg') * rng.uniform(0.75, 1.0)
            leg(st / (np.max(np.abs(st)) + 1e-9), b['t'], LAUT[b['shot']] + rng.uniform(-1.5, 0), PAN[fig] if b['shot'] in ('S10', 'S11') else 0)
            schritte += 1

# ---- Klick beim Aufleuchten eines Abdrucks (S5), leiser Klick beim Hochzählen im Hook (S1)
for a, b in zip(P, P[1:]):
    if b['shot'] == 'S5' and b['abdruecke'] > a['abdruecke']:
        leg(FX['pop'], b['t'], -24, 0.15 if b['abdruecke'] % 2 else -0.15)

# ---- Wischgeräusche: Karten, Handy-Karte, Wege
def start_wort(z, w):
    L_ = json.load(open(os.path.join(ROOT, 'assets', 'audio', 'zeilen', 'lines.json')))
    t0 = dict((k, v) for k, v in ZP['stimmen'])[z]
    return t0 + next(x['t0'] for x in L_[z]['woerter'] if x['w'].startswith(w))


st = dict((k, v) for k, v in ZP['stimmen'])
for t in (st['A04'] + 0.4, start_wort('A05', 'Viele'), SHOT['S8']['t0']):
    leg(FX['whoosh_kurz'], t - 0.05, -22)
S9 = SHOT['S9']
for k in range(5):
    leg(FX['whoosh_kurz'], S9['t0'] + S9['t'] * (0.06 + k * 0.11), -26, -0.6 + 0.3 * k)
leg(FX['pop'], start_wort('A06', 'Mach'), -24)

# ---- Tür und Raumklang (S11)
t_tuer = SHOT['S11']['t0']
leg(FX['tuer'], t_tuer, -20)
raum = FX['raumklang_moschee'][: int((ZP['dauer'] - t_tuer + 1) * SR)].copy()
raum *= np.clip(np.arange(len(raum)) / SR / 1.0, 0, 1)
leg(raum, t_tuer + 0.3, -34)

# ---- Außenton: Wind und Blätter (eigenes Rauschen, keine Autos), blendet nach der Tür aus
dur = ZP['dauer'] + 1
wind = sfx.lp(np.cumsum(sfx.noise(dur)) * 0.02, 700)
wind = wind / (np.max(np.abs(wind)) + 1e-9)
tt = np.arange(len(wind)) / SR
blatt = sfx.bp(sfx.noise(dur), 2500, 7000, 2) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.11 * tt)) * 0.12
aussen = (wind * 0.5 + blatt)
aussen *= np.clip((t_tuer + 1.5 - tt) / 1.5, 0.25, 1) * np.clip(tt / 0.6, 0, 1)
aussen = aussen / (np.sqrt(np.mean(aussen ** 2)) + 1e-9)
leg(aussen[:N], 0, -42)

out = os.path.join(ROOT, 'out', 'phase4')
os.makedirs(out, exist_ok=True)
x = np.stack([L, R], axis=1)[: int(ZP['dauer'] * SR)]
x = np.clip(x, -1, 1)
wavfile.write(os.path.join(out, 'ton.wav'), SR, (x * 32767).astype(np.int16))
print(f'ton.wav · {schritte} Schritte · Spitze {20 * np.log10(np.max(np.abs(x)) + 1e-9):.1f} dBFS')
