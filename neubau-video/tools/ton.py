#!/usr/bin/env python3
"""Tonspur für das Neubau-Video (72 s, Ayman 24.11.) → out/phase5/ton.wav (48 kHz, Stereo, noch nicht lautheitsnormiert).
Keine Musik, keine Instrumente, kein Gesang. Nur: Wind, leises Stadtrauschen, dezente Bau-Klänge beim Wachsen,
Torantrieb beim Öffnen/Schließen. Zeiten passend zu blender/animation.py.
Geräusche: gebet-video/assets/sfx (nur gelesen) + synthetisch (numpy).
    python3 tools/ton.py
"""
import os
import subprocess
import numpy as np
from scipy.io import wavfile

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
SFX = os.path.join(ROOT, '..', 'gebet-video', 'assets', 'sfx')
AUS = os.path.join(ROOT, 'out', 'phase5', 'ton.wav')
SR, DAUER = 48000, 72.0
N = int(DAUER * SR)
L, R = np.zeros(N), np.zeros(N)
db = lambda d: 10 ** (d / 20)
rng = np.random.default_rng(11)


def RZ(t):                                # wie blender/animation.py: Bauzeiten (alte Achse bis 44 s) → 0–24 s
    if t <= 3.4:
        return t
    if t <= 44.0:
        return 3.4 + (t - 3.4) * (24.0 - 3.4) / (44.0 - 3.4)
    return 24.0 + (t - 44.0)


def lies(name):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', os.path.join(SFX, name), '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.int16).astype(np.float64) / 32768


def setze(sig, t, pegel_db, pan=0.0):
    i = int(t * SR); sig = sig[:max(0, N - i)] * db(pegel_db)
    L[i:i + len(sig)] += sig * np.sqrt((1 - pan) / 2); R[i:i + len(sig)] += sig * np.sqrt((1 + pan) / 2)


# Wind: gefiltertes Rauschen mit langsamer Hüllkurve (Stereo leicht unterschiedlich)
t = np.arange(N) / SR
for kanal, phase in ((L, 0.0), (R, 1.7)):
    w = rng.standard_normal(N)
    w = np.convolve(w, np.ones(60) / 60, mode='same')          # dunkler
    w = np.convolve(w, np.ones(25) / 25, mode='same')
    huell = 0.55 + 0.45 * np.sin(2 * np.pi * t / 9.0 + phase) * np.sin(2 * np.pi * t / 3.7 + phase * 0.5)
    w = w / (np.abs(w).max() + 1e-9) * huell
    kanal += w * db(-24)
# leises Stadtrauschen (Schleife aus strasse.wav)
st = lies('strasse.wav'); st = np.tile(st, int(np.ceil(N / len(st))))[:N]
L += st * db(-30); R += st * db(-31)

# dezente Bau-Klänge an den Stufen (leise, nie laut)
grollen, impact, whoosh, wk, pop = lies('grollen.wav'), lies('impact.wav'), lies('whoosh.wav'), lies('whoosh_kurz.wav'), lies('pop.wav')
setze(grollen, RZ(4.3), -20)              # Boden senkt sich
for zeit in (8.0, 9.0, 11.8, 13.0, 20.0, 25.0):
    setze(impact, RZ(zeit), -27, rng.uniform(-0.3, 0.3))
for zeit in (15.4, 16.6, 22.4):
    setze(whoosh, RZ(zeit), -26, rng.uniform(-0.4, 0.4))
for k in range(26):                      # PV-Module Reihe für Reihe: feine Klicks
    setze(pop, RZ(27.4) + k * 0.05, -32, rng.uniform(-0.6, 0.6))
for k in range(7):                       # Wohnwagen setzen auf
    setze(impact, RZ(42.45 + k * 0.2), -31, -0.2 + k * 0.08)
for zeit in (42.88, 43.13):              # die beiden schwarzen Autos setzen auf
    setze(impact, RZ(zeit), -32, -0.4)
# Hofdach fährt zu (18,9–19,8) und wieder auf (20,1–21,0): leises Motorbrummen
for _a, _b in ((18.9, 19.8), (20.1, 21.0)):
    _d = _b - _a; _n = int(_d * SR); _tt = np.arange(_n) / SR
    _m = (np.sin(2 * np.pi * 80 * _tt) * 0.6 + np.sin(2 * np.pi * 160 * _tt) * 0.2 + rng.standard_normal(_n) * 0.05)
    _m *= np.minimum(1, np.minimum(_tt / 0.15, (_d - _tt) / 0.15))
    setze(_m, _a, -32)
    setze(pop, _b, -27)
# Rundgang: sanfte Luftbewegungen an den Kamerawechseln und Steigflügen
for zeit in (24.0, 29.5, 35.5, 41.4, 48.0, 54.5, 57.5, 66.4):
    setze(wk, zeit, -29)


def motor(a, b, f0, pegel, pan, rauh=0.08):
    n = int((b - a) * SR); tt = np.arange(n) / SR
    m = (np.sin(2 * np.pi * f0 * tt) * 0.6 + np.sin(2 * np.pi * 2 * f0 * tt) * 0.25 + rng.standard_normal(n) * rauh)
    m *= np.minimum(1, np.minimum(tt / 0.4, (b - a - tt) / 0.6))
    setze(m, a, pegel, pan)


# Autos fahren heran und parken ein (weiß 59,4–64,8, grau 61,4–67,2): leises Motorgeräusch, von rechts kommend
motor(59.4, 64.8, 48, -31, 0.5, 0.12)
motor(61.4, 67.2, 44, -32, 0.6, 0.12)
# Schiebetor öffnet (67,4–68,7) und schließt (70,2–71,5), Klick am Ende
for a, b in ((67.4, 68.7), (70.2, 71.5)):
    motor(a, b, 95, -30, 0.35, 0.05)
    setze(pop, b, -24, 0.35)

mix = np.stack([L, R], axis=1)
mix *= db(-1.0) / max(1e-9, np.abs(mix).max())
os.makedirs(os.path.dirname(AUS), exist_ok=True)
wavfile.write(AUS, SR, (mix * 32767).astype(np.int16))
print('fertig:', os.path.relpath(AUS, ROOT))
