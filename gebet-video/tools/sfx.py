#!/usr/bin/env python3
"""Erzeugt alle Geräusch-Effekte selbst (keine fremden Dateien, keine Musik, keine Melodien).

    python3 tools/sfx.py            → assets/sfx/*.wav (48 kHz, mono, 16 bit)

Jeder Effekt ist zufallsbasiert, aber mit festem Startwert (immer gleiches Ergebnis).
"""
import os
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt, fftconvolve

SR = 48000
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'sfx')
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(7)


def t_(dur):
    return np.arange(int(dur * SR)) / SR


def noise(dur):
    return rng.standard_normal(int(dur * SR))


def bp(x, lo, hi, order=4):
    return sosfilt(butter(order, [lo, hi], 'bandpass', fs=SR, output='sos'), x)


def lp(x, f, order=4):
    return sosfilt(butter(order, f, 'lowpass', fs=SR, output='sos'), x)


def hp(x, f, order=4):
    return sosfilt(butter(order, f, 'highpass', fs=SR, output='sos'), x)


def env(n, a, d, shape=4.0):
    """Hüllkurve: Anstieg a Sekunden, dann exponentielles Abklingen über d Sekunden."""
    t = np.arange(n) / SR
    e = np.where(t < a, t / max(a, 1e-4), np.exp(-(t - a) / max(d, 1e-4) * shape / 4))
    return e


def fade(x, fi=0.01, fo=0.05):
    n = len(x)
    i, o = int(fi * SR), int(fo * SR)
    if i: x[:i] *= np.linspace(0, 1, i)
    if o: x[-o:] *= np.linspace(1, 0, o)
    return x


def reverb(x, rt=0.8, mix=0.25, pre=0.012):
    n = int(rt * SR)
    ir = rng.standard_normal(n) * np.exp(-np.arange(n) / SR * 6.9 / rt)
    ir = lp(ir, 5000)
    ir[: int(pre * SR)] = 0
    wet = fftconvolve(x, ir)
    dry = np.concatenate([x, np.zeros(len(wet) - len(x))])
    wet /= np.max(np.abs(wet)) + 1e-9
    return dry * (1 - mix) + wet * mix * np.max(np.abs(x))


def save(name, x, peak=0.89):
    x = np.asarray(x, dtype=np.float64)
    x = x / (np.max(np.abs(x)) + 1e-9) * peak
    wavfile.write(os.path.join(OUT, name + '.wav'), SR, (x * 32767).astype(np.int16))
    print(f'{name:22s} {len(x) / SR:5.2f} s')


# ---------------------------------------------------------------- Übergänge
def whoosh(dur=0.5):
    n = noise(dur)
    t = t_(dur)
    out = np.zeros_like(n)
    # gleitender Bandpass: tief → hoch (in Blöcken)
    blocks = 40
    for k in range(blocks):
        a, b = k * len(n) // blocks, (k + 1) * len(n) // blocks
        f = 300 + 3200 * (k / blocks) ** 1.6
        seg = bp(n, f * 0.6, min(f * 1.6, 20000), 2)[a:b]
        out[a:b] = seg
    e = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 1.5
    return fade(out * e, 0.005, 0.03)


def pop():
    t = t_(0.12)
    f = 900 * np.exp(-t * 28) + 260
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.002, 0.05)
    x += 0.25 * hp(noise(0.12), 2000) * env(len(t), 0.001, 0.01)
    return fade(x, 0.001, 0.02)


def impact():
    t = t_(1.2)
    f = 70 * np.exp(-t * 2.5) + 38
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.004, 0.55)
    x += 0.5 * lp(noise(1.2), 400) * env(len(t), 0.002, 0.18)
    return fade(reverb(x, 1.4, 0.3), 0.001, 0.2)


def paper():
    d = 0.45
    x = np.zeros(int(d * SR))
    for _ in range(14):
        s = int(rng.uniform(0, d - 0.04) * SR)
        g = bp(noise(0.04), 1500, 7000, 2) * env(int(0.04 * SR), 0.001, 0.015) * rng.uniform(0.3, 1)
        x[s:s + len(g)] += g
    return fade(x, 0.002, 0.05)


# ---------------------------------------------------------------- Schritte
def step(kind):
    if kind == 'gehweg':   # Schuhe auf Pflaster: kurzer Absatz-Klick + dumpfer Körper
        n = 0.18
        x = lp(noise(n), 2500) * env(int(n * SR), 0.001, 0.035)
        x += 0.6 * np.sin(2 * np.pi * 110 * t_(n)) * env(int(n * SR), 0.001, 0.03)
        x += 0.35 * bp(noise(n), 2500, 6000, 2) * env(int(n * SR), 0.0005, 0.008)
    else:                  # Socken auf Teppich: weich und gedämpft
        n = 0.22
        x = lp(noise(n), 700) * env(int(n * SR), 0.01, 0.06)
    return x


def steps(kind, dur, interval, jitter=0.03):
    x = np.zeros(int(dur * SR) + SR)
    t = 0.05
    while t < dur:
        s = step(kind) * rng.uniform(0.7, 1.0)
        i = int(t * SR)
        x[i:i + len(s)] += s
        t += interval + rng.uniform(-jitter, jitter)
    return fade(x[: int(dur * SR)], 0.01, 0.1)


# ---------------------------------------------------------------- Räume und Stoff
def street(dur=20):
    base = lp(np.cumsum(noise(dur)) * 0.02, 900) + 0.15 * lp(noise(dur), 2500)   # Grundrauschen der Stadt
    t = t_(dur)
    cars = np.zeros_like(t)
    for c in (2.5, 9.0, 15.5):                                                   # entfernte, vorbeifahrende Autos
        g = np.exp(-((t - c) / 1.6) ** 2)
        cars += g * lp(noise(dur), 650)
    birds = np.zeros_like(t)                                                      # keine Vogelmelodie: nur leises Rascheln von Blättern
    leaves = bp(noise(dur), 2500, 7000, 2) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.13 * t)) * 0.05
    x = base / (np.max(np.abs(base)) + 1e-9) * 0.5 + cars * 0.6 + leaves + birds
    return fade(x, 0.5, 0.5)


def room(dur=20):
    x = lp(noise(dur), 300) * 0.6 + lp(noise(dur), 1500) * 0.08                  # ruhiger Raum, ferne Lüftung
    return fade(reverb(x, 1.2, 0.2)[: int(dur * SR)], 0.5, 0.5)


def door():
    t = t_(1.0)
    x = 0.8 * np.sin(2 * np.pi * 85 * t) * env(len(t), 0.002, 0.12)               # Türblatt
    click = bp(noise(1.0), 2500, 8000, 2) * env(len(t), 0.0005, 0.006)            # Klinke
    x += 0.5 * np.roll(click, int(0.02 * SR))
    x += 0.3 * lp(noise(1.0), 600) * env(len(t), 0.003, 0.08)
    return fade(reverb(x, 0.9, 0.3), 0.001, 0.2)


def fabric(dur=0.6):
    t = t_(dur)
    x = bp(noise(dur), 1200, 6000, 2) * (np.sin(np.pi * t / dur) ** 2) * (0.6 + 0.4 * np.sin(2 * np.pi * 9 * t))
    return fade(x, 0.01, 0.05)


def shoes_down():
    x = np.zeros(int(0.7 * SR))
    for at in (0.05, 0.38):
        s = lp(noise(0.12), 1800) * env(int(0.12 * SR), 0.001, 0.025)
        x[int(at * SR):int(at * SR) + len(s)] += s
    return fade(x, 0.001, 0.05)


# ---------------------------------------------------------------- Symbolbilder
def clock_tick(dur=3.0):
    x = np.zeros(int(dur * SR))
    for k in range(int(dur)):
        s = bp(noise(0.03), 2000, 6000, 2) * env(int(0.03 * SR), 0.0005, 0.004)
        x[int((k + 0.1) * SR):int((k + 0.1) * SR) + len(s)] += s
    return fade(reverb(x, 0.5, 0.15)[: len(x)], 0.001, 0.05)


def water(dur=8):
    t = t_(dur)
    x = bp(noise(dur), 300, 2500, 2) * 0.4
    for _ in range(int(dur * 25)):                                                # kleine Blasen und Plätschern
        at = rng.uniform(0, dur - 0.05)
        f = rng.uniform(500, 1500)
        tt = t_(0.04)
        b = np.sin(2 * np.pi * (f + 3000 * tt) * tt) * env(len(tt), 0.001, 0.015) * rng.uniform(0.1, 0.4)
        i = int(at * SR)
        x[i:i + len(b)] += b
    return fade(x, 0.4, 0.4)


def scale_clink():
    """Kurzes, dumpfes Metallklacken (kein Klang mit Tonhöhenfolge)."""
    t = t_(0.5)
    x = sum(a * np.sin(2 * np.pi * f * t) * np.exp(-t * d) for f, a, d in ((410, 1, 18), (1130, 0.5, 26), (2470, 0.25, 35)))
    x += 0.3 * hp(noise(0.5), 3000) * env(len(t), 0.0005, 0.004)
    return fade(x, 0.001, 0.05)


def rumble(dur=3.0):
    t = t_(dur)
    x = lp(noise(dur), 120) * (np.sin(np.pi * t / dur) ** 1.5)
    return fade(x, 0.2, 0.3)


if __name__ == '__main__':
    save('whoosh', whoosh(0.5))
    save('whoosh_kurz', whoosh(0.28))
    save('pop', pop())
    save('impact', impact())
    save('papier', paper())
    save('schritte_gehweg_eilig', steps('gehweg', 6, 0.42))
    save('schritte_gehweg_ruhig', steps('gehweg', 6, 0.6))
    save('schritte_teppich', steps('teppich', 6, 0.62))
    save('strasse', street(20))
    save('raumklang_moschee', room(20))
    save('tuer', door())
    save('stoff', fabric())
    save('schuhe_ins_regal', shoes_down())
    save('uhr_ticken', clock_tick())
    save('wasser', water())
    save('waage_klacken', scale_clink())
    save('grollen', rumble())
