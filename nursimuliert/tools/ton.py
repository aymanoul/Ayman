#!/usr/bin/env python3
"""Geraeusche und Endmischung fuer das Video (keine Musik, keine Stimmen, kein Lachen).

Alle Geraeusche werden hier mit numpy/scipy erzeugt (deterministisch, fester Seed).
Gesteuert wird alles von out/bewegung.json (Export aus dem Renderer):
Schrittphasen der Figuren, Weg von Fahrrad und Auto, Kameraposition, Tuer/Fenster/Blinker
und die Ereignisse aus der Szenenliste (Klingel, Whoosh, Tueren, Gurt, Motor, Hupe ...).

Ergebnis:
  audio/geraeusche.wav   Geraeuschspur (48 kHz Stereo), vor dem Ducking
  out/mix.wav            Endmischung: Stimme (falls audio/stimme.wav da ist) + Geraeusche,
                         Geraeusche -9 dB unter der Stimme (Wortzeiten, 0,15 s Uebergaenge),
                         loudnorm I=-14:TP=-1.5:LRA=11, letzte Sekunde ausgeblendet.
Aufruf: python3 tools/ton.py
"""
import json, os, subprocess, sys
import numpy as np
from scipy import signal
from scipy.io import wavfile

SR = 48000
RNG = np.random.default_rng(20261103)
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)


def p(*a):
    return os.path.join(ROOT, *a)


# ------------------------------------------------------------------ Grundbausteine

def env_ar(n, a, r):
    """Huellkurve: weich ein (a Samples), exponentiell aus (r Samples)."""
    e = np.ones(n)
    a = max(1, min(a, n))
    e[:a] = 0.5 - 0.5 * np.cos(np.linspace(0, np.pi, a))
    t = np.arange(n - a)
    e[a:] *= np.exp(-t / max(1.0, r))
    return e


def fade(x, fi, fo):
    n = len(x)
    fi, fo = int(min(fi, n // 2)), int(min(fo, n // 2))
    if fi > 0:
        x[:fi] *= 0.5 - 0.5 * np.cos(np.linspace(0, np.pi, fi))
    if fo > 0:
        x[-fo:] *= 0.5 + 0.5 * np.cos(np.linspace(0, np.pi, fo))
    return x


def bp(x, lo, hi, order=2):
    sos = signal.butter(order, [lo / (SR / 2), hi / (SR / 2)], btype='band', output='sos')
    return signal.sosfilt(sos, x)


def lp(x, f, order=2):
    sos = signal.butter(order, f / (SR / 2), btype='low', output='sos')
    return signal.sosfilt(sos, x)


def hp(x, f, order=2):
    sos = signal.butter(order, f / (SR / 2), btype='high', output='sos')
    return signal.sosfilt(sos, x)


def noise(n):
    return RNG.standard_normal(n)


def pink(n):
    w = noise(n)
    b = [0.049922035, -0.095993537, 0.050612699, -0.004408786]
    a = [1, -2.494956002, 2.017265875, -0.522189400]
    return signal.lfilter(b, a, w) * 3.0


class Track:
    def __init__(self, dur):
        self.n = int(dur * SR) + SR
        self.buf = np.zeros((self.n, 2))

    def add(self, t, mono, gain=1.0, pan=0.0):
        i = int(t * SR)
        if i >= self.n or len(mono) == 0:
            return
        if i < 0:
            mono = mono[-i:]
            i = 0
        m = mono[: self.n - i] * gain
        l = np.cos((pan + 1) * np.pi / 4)
        r = np.sin((pan + 1) * np.pi / 4)
        self.buf[i:i + len(m), 0] += m * l
        self.buf[i:i + len(m), 1] += m * r

    def add_st(self, t, st, gain=1.0):
        i = int(t * SR)
        m = st[: max(0, self.n - i)] * gain
        self.buf[i:i + len(m)] += m


def db(v):
    return 10 ** (v / 20)


# ------------------------------------------------------------------ Geraeusche

def bird_chirp():
    """Kurzer Vogelruf: Triller aus 2-6 FM-Toenen."""
    k = RNG.integers(2, 7)
    base = RNG.uniform(2600, 4800)
    parts = []
    for j in range(k):
        dur = RNG.uniform(0.04, 0.12)
        n = int(dur * SR)
        t = np.arange(n) / SR
        f0 = base * RNG.uniform(0.85, 1.2)
        sweep = f0 * (1 + RNG.uniform(-0.25, 0.35) * t / dur)
        ph = 2 * np.pi * np.cumsum(sweep) / SR
        tone = np.sin(ph) + 0.25 * np.sin(2 * ph)
        tone *= np.sin(np.pi * np.arange(n) / n) ** 2
        parts.append(tone)
        parts.append(np.zeros(int(RNG.uniform(0.02, 0.07) * SR)))
    return np.concatenate(parts) * 0.6


def birds(dur, rate, level):
    out = np.zeros((int(dur * SR) + SR, 2))
    t = RNG.uniform(0, 1.0)
    while t < dur:
        c = bird_chirp()
        pan = RNG.uniform(-0.8, 0.8)
        g = level * RNG.uniform(0.4, 1.0)
        i = int(t * SR)
        m = c[: len(out) - i]
        out[i:i + len(m), 0] += m * g * np.cos((pan + 1) * np.pi / 4)
        out[i:i + len(m), 1] += m * g * np.sin((pan + 1) * np.pi / 4)
        t += RNG.exponential(1 / rate) + 0.3
    return out[: int(dur * SR)]


def wind_trees(dur, level):
    n = int(dur * SR)
    st = np.zeros((n, 2))
    tt = np.arange(n) / SR
    for c in range(2):
        rust = bp(pink(n), 900, 3800) * 0.6 + lp(pink(n), 500) * 0.8
        lfo = 0.55 + 0.45 * np.sin(2 * np.pi * (0.11 + 0.03 * c) * tt + c) * np.sin(2 * np.pi * 0.047 * tt + 1.3 * c)
        st[:, c] = rust * lfo
    return st * level / (np.std(st) + 1e-9) * 0.3


def distant_kids(dur, level):
    """Entfernter Spielplatz ohne Worte: weiches, gefiltertes Rauschen mit langsamer Bewegung."""
    n = int(dur * SR)
    tt = np.arange(n) / SR
    x = bp(noise(n), 500, 1800, 2)
    am = np.clip(np.sin(2 * np.pi * 0.7 * tt) * 0.5 + np.sin(2 * np.pi * 1.9 * tt + 2) * 0.3 + 0.35, 0, None)
    am = lp(am, 3)
    x = lp(x * am, 1400)
    x = x / (np.std(x) + 1e-9) * level * 0.25
    return np.stack([x, np.roll(x, 900)], 1)


def lawnmower(dur, level):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    f = 31 + 1.5 * np.sin(2 * np.pi * 0.13 * tt)
    ph = 2 * np.pi * np.cumsum(f) / SR
    eng = sum(np.sin(k * ph) / k for k in range(1, 14))
    x = lp(eng + 0.3 * noise(n), 650)
    lvl = 0.6 + 0.4 * np.sin(2 * np.pi * 0.05 * tt)
    x = x / (np.std(x) + 1e-9) * level * lvl * 0.25
    return np.stack([x * 0.8, x], 1)


def gravel_step(heavy=1.0):
    n = int(RNG.uniform(0.07, 0.12) * SR * (1 + 0.3 * heavy))
    x = noise(n)
    crack = (RNG.random(n) < 0.02) * RNG.standard_normal(n) * 4
    x = bp(x * 0.5 + crack, 500, 5200)
    x *= env_ar(n, int(0.004 * SR), 0.03 * SR)
    thump = np.sin(2 * np.pi * 85 * np.arange(n) / SR) * np.exp(-np.arange(n) / (0.02 * SR)) * 0.6 * heavy
    return x * 0.7 + thump


def exhale(soft=1.0, dur=0.4):
    n = int(dur * SR)
    x = bp(noise(n), 350, 1700)
    x *= np.sin(np.pi * np.arange(n) / n) ** 1.5
    return x * 0.35 * soft


def freewheel_tick():
    n = int(0.008 * SR)
    t = np.arange(n) / SR
    return np.sin(2 * np.pi * 4200 * t) * np.exp(-t / 0.0015) * 0.5


def bell():
    n = int(1.2 * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for start in (0.0, 0.16):
        i = int(start * SR)
        tt = t[: n - i]
        tone = sum(a * np.sin(2 * np.pi * f * tt) * np.exp(-tt / d) for f, a, d in ((2410, 1.0, 0.45), (3580, 0.55, 0.3), (5320, 0.3, 0.18), (7100, 0.12, 0.1)))
        out[i:] += tone * np.minimum(1, tt / 0.002)
    return out * 0.35


def whoosh(dur=0.9):
    """Leiser Wind-Whoosh: drei Frequenzbaender nacheinander (tief -> hoch -> tief)."""
    n = int(dur * SR)
    t = np.arange(n) / n
    out = np.zeros(n)
    for (lo, hi), c in (((250, 700), 0.3), ((700, 1800), 0.5), ((1500, 3800), 0.62)):
        out += bp(noise(n), lo, hi) * np.exp(-((t - c) / 0.22) ** 2)
    out *= np.sin(np.pi * t) ** 1.5
    return out * 0.5


def click(f=2500, d=0.01, a=0.6):
    n = int(d * SR * 3)
    t = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * t) + 0.5 * noise(n) * 0.3) * np.exp(-t / d) * a


def thump(f=70, d=0.12, a=1.0):
    n = int(d * SR * 4)
    t = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * t) * np.exp(-t / d) + lp(noise(n), 400) * 0.25 * np.exp(-t / (d * 0.5))) * a


def front_door():
    out = np.zeros(int(1.0 * SR))
    c = click(1800, 0.008, 0.5)
    out[: len(c)] += c
    n = int(0.6 * SR)
    t = np.arange(n) / SR
    creak = np.sin(2 * np.pi * (220 + 90 * t) * t) * (0.5 + 0.5 * np.sin(2 * np.pi * 23 * t)) * np.sin(np.pi * t / t[-1]) * 0.12
    out[int(0.08 * SR):int(0.08 * SR) + n] += bp(creak + noise(n) * 0.02, 150, 2500)
    return out


def cloth_rustle(dur=0.9):
    n = int(dur * SR)
    x = lp(bp(noise(n), 1200, 5000, 3), 6000, 4)
    am = lp(np.abs(noise(n)), 12)
    am = am / am.max()
    x *= am * np.sin(np.pi * np.arange(n) / n)
    return x * 0.25


def car_door_open():
    out = np.zeros(int(0.6 * SR))
    for t0, f in ((0.0, 1600), (0.05, 1100)):
        c = click(f, 0.006, 0.45)
        i = int(t0 * SR)
        out[i:i + len(c)] += c
    th = thump(140, 0.05, 0.4)
    out[int(0.09 * SR):int(0.09 * SR) + len(th)] += th
    return out


def car_door_close():
    out = np.zeros(int(0.7 * SR))
    th = thump(62, 0.11, 1.0)
    out[: len(th)] += th
    c = click(900, 0.01, 0.35)
    out[: len(c)] += c
    return out


def seatbelt():
    out = np.zeros(int(0.5 * SR))
    for t0 in (0.0, 0.07):
        c = click(3200, 0.004, 0.45)
        i = int(t0 * SR)
        out[i:i + len(c)] += c
    return out


def engine(dur, rpm_curve, level, idle=False):
    """Motorbrummen; rpm_curve: Werte 0..1 je Sample (Last)."""
    n = int(dur * SR)
    f = 26 + 40 * rpm_curve[:n]
    ph = 2 * np.pi * np.cumsum(f) / SR
    eng = sum(np.sin(k * ph + k) / (k ** 0.9) for k in range(1, 18))
    x = lp(eng + 0.15 * noise(n), 900)
    return x / (np.std(x) + 1e-9) * level * 0.2


def engine_start():
    n1 = int(0.7 * SR)
    t = np.arange(n1) / SR
    starter = (np.sign(np.sin(2 * np.pi * 14 * t)) * 0.4 + 0.3 * noise(n1)) * 0.4
    starter = lp(starter, 1200)
    n2 = int(1.6 * SR)
    rpm = np.concatenate([np.linspace(0.5, 0.15, n2)])
    catch = engine(1.6, rpm, 1.0)
    catch *= np.minimum(1, np.arange(n2) / (0.08 * SR))
    out = np.zeros(n1 + n2)
    out[:n1] += starter
    out[int(0.6 * SR):int(0.6 * SR) + n2] += catch
    return out


def blinker_tick():
    return click(2100, 0.004, 0.4)


def window_motor(dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    whine = sum(np.sin(2 * np.pi * f * t) / k for k, f in enumerate((310, 620, 930), 1))
    x = (whine * 0.35 + bp(noise(n), 200, 2500) * 0.3) * np.sin(np.pi * t / t[-1]) ** 0.4
    return x * 0.3


def honk_double():
    out = np.zeros(int(0.8 * SR))
    for t0 in (0.0, 0.3):
        n = int(0.18 * SR)
        t = np.arange(n) / SR
        h = sum(np.sign(np.sin(2 * np.pi * f * t)) for f in (415, 520)) * 0.3
        h = lp(h, 2500) * np.minimum(1, np.minimum(t / 0.01, (t[-1] - t) / 0.02))
        i = int(t0 * SR)
        out[i:i + n] += h
    return out * 0.6


EVENTS = {
    'bell': (bell, -14), 'whoosh': (whoosh, -20), 'exhaleDeep': (lambda: exhale(1.6, 1.1), -18),
    'frontDoor': (front_door, -16), 'clothRustle': (cloth_rustle, -27), 'carDoorOpen': (car_door_open, -14),
    'carDoorClose': (car_door_close, -11), 'seatbelt': (seatbelt, -17), 'engineStart': (engine_start, -16),
    'honkDouble': (honk_double, -13),
}


# ------------------------------------------------------------------ Aufbau aus der Bewegungsspur

def dist_gain(cam, a, near=2.0, minimum=0.12):
    d = np.sqrt((cam[0] - a['x']) ** 2 + (cam[1] - a.get('y', 0) - 0.8) ** 2 + (cam[2] - a['z']) ** 2)
    return float(np.clip(near / max(d, near * 0.5), minimum, 1.0))


def build(data):
    dur = data['duration']
    tr = Track(dur)
    frames = data['frames']
    shots = {s['id']: s for s in data['shots']}
    dt = frames[1]['t'] - frames[0]['t']

    # Grundgeraeusche je Ort/Licht, an den Einstellungsgrenzen weich ueberblendet
    amb_cache = {}
    for s in data['shots']:
        if s['black']:
            continue
        key = data['ambience'].get(f"{s['set']}/{s['light']}", 'parkEvening')
        if key not in amb_cache:
            if key == 'parkEvening':
                a = birds(dur, 0.45, db(-30)) + wind_trees(dur, db(-33)) + distant_kids(dur, db(-44))
            elif key == 'suburbAfternoon':
                a = birds(dur, 0.8, db(-28)) + wind_trees(dur, db(-40)) + lawnmower(dur, db(-41))
            else:
                a = birds(dur, 0.35, db(-33)) + wind_trees(dur, db(-36))
            amb_cache[key] = a
        a = amb_cache[key]
        i0, i1 = int(s['start'] * SR), int(s['end'] * SR)
        seg = a[i0:i1].copy()
        f = int(0.12 * SR)
        for c in range(2):
            fade(seg[:, c], f, f)
        tr.add_st(s['start'], seg)

    # Personen: Schritte im Takt der Gangphase, Ausatmen beim Rennen
    last_phase = {}
    breath_t = {}
    for f in frames:
        sh = shots[f['shot']]
        if sh['black']:
            continue
        on_gravel = sh['set'] == 'park'
        for aid, a in f['a'].items():
            if 'phase' not in a or a.get('mounted'):
                continue
            amp = a['walk'] + a['run']
            prev = last_phase.get((aid, f['shot']))
            last_phase[(aid, f['shot'])] = a['phase']
            if prev is None or amp < 0.08:
                continue
            if np.floor(a['phase'] / np.pi) != np.floor(prev / np.pi):
                g = dist_gain(f['cam'], a) * (0.45 + 0.55 * min(1, amp)) * (1.0 if on_gravel else 0.55)
                step = gravel_step(heavy=0.6 + a['run']) if on_gravel else lp(gravel_step(0.4), 1800)
                tr.add(f['t'], step, g * db(-17), RNG.uniform(-0.2, 0.2))
            if a['run'] > 0.3 and aid.startswith('papa') and f['t'] - breath_t.get(aid, -9) > 1.15:
                breath_t[aid] = f['t']
                tr.add(f['t'], exhale(0.8), dist_gain(f['cam'], a) * db(-24))

    # Fahrrad: Freilauf-Ticken + Reifen auf Kies (durchgehendes Signal, Huellkurve nach Tempo)
    bike_lvl = np.zeros(tr.n)
    acc = 0.0
    prev = None
    for f in frames:
        a = f['a'].get('rad')
        sh = shots[f['shot']]
        if a is None or sh['black']:
            prev = None
            continue
        if prev is not None and prev[0] == f['shot']:
            v = max(0.0, (a['dist'] - prev[1]) / dt)
            g = dist_gain(f['cam'], a, near=2.5)
            acc += v * dt / (2 * np.pi * 0.2) * 14
            while acc >= 1:
                acc -= 1
                tr.add(f['t'] + RNG.uniform(0, dt), freewheel_tick(), g * db(-31) * (0.6 + 0.4 * RNG.random()))
            bike_lvl[int(f['t'] * SR):int((f['t'] + dt) * SR)] = g * min(1.0, v / 2.5)
        prev = (f['shot'], a['dist'])
    k = int(0.12 * SR)
    bike_lvl = np.convolve(bike_lvl, np.ones(k) / k, 'same')
    if bike_lvl.max() > 0:
        crunch = bp(noise(tr.n), 700, 3800, 3)
        crunch = crunch * (0.55 + 0.45 * lp(np.abs(noise(tr.n)), 40) / 0.8)
        crunch = crunch / (np.std(crunch) + 1e-9) * 0.15
        tr.buf[:, 0] += crunch * bike_lvl * db(-28)
        tr.buf[:, 1] += np.roll(crunch, 200) * bike_lvl * db(-28)

    # Auto: Motor + Reifen nach Geschwindigkeit, Blinker, Fenster, Fahrtwind
    car_rpm = np.zeros(tr.n)
    car_lvl = np.zeros(tr.n)
    wind_lvl = np.zeros(tr.n)
    prev = None
    blink_next = 0.0
    win_prev = None
    for f in frames:
        a = f['a'].get('auto')
        sh = shots[f['shot']]
        if a is None or sh['black']:
            prev, win_prev = None, None
            continue
        i0, i1 = int(f['t'] * SR), int((f['t'] + dt) * SR)
        v = 0.0
        if prev is not None and prev[0] == f['shot']:
            v = max(0.0, (a['dist'] - prev[1]) / dt)
        moving = v > 0.2
        g = dist_gain(f['cam'], a, near=4.0, minimum=0.2)
        if moving or f['shot'] >= 10:
            car_rpm[i0:i1] = min(1, 0.15 + v / 14)
            car_lvl[i0:i1] = g
        wind_lvl[i0:i1] = a.get('window', 0) * min(1, v / 9) * g
        if a.get('blink') and f['t'] >= blink_next:
            tr.add(f['t'], blinker_tick(), db(-22))
            blink_next = f['t'] + 0.33
        win_prev = a.get('window', 0)
        prev = (f['shot'], a['dist'])
    sm = int(0.15 * SR)
    kern = np.ones(sm) / sm
    car_rpm = np.convolve(car_rpm, kern, 'same')
    car_lvl = np.convolve(car_lvl, kern, 'same')
    wind_lvl = np.convolve(wind_lvl, kern, 'same')
    if car_lvl.max() > 0:
        eng = engine(tr.n / SR, car_rpm, 1.0)
        tire = lp(pink(tr.n), 700) * 0.5
        tire = tire / (np.std(tire) + 1e-9) * 0.15
        mono = (eng * db(-24) + tire * db(-26) * np.clip(car_rpm * 1.5, 0, 1)) * car_lvl
        wind = lp(pink(tr.n), 1300) / 3 * db(-26) * wind_lvl
        tr.buf[:, 0] += mono + wind
        tr.buf[:, 1] += mono * 0.95 + np.roll(wind, 300)

    # Ereignisse aus der Szenenliste
    for e in data['events']:
        if e['type'] == 'windowMotor':
            d = max(0.3, (e.get('until') or e['t'] + 0.9) - e['t'])
            tr.add(e['t'], window_motor(d), db(-20))
            continue
        fn, lvl = EVENTS[e['type']]
        tr.add(e['t'], fn(), db(lvl), 0.0)

    # Zeitsprung: voellige Stille (0,2 s weich aus und wieder ein)
    out = tr.buf[: int(dur * SR)]
    gain = np.ones(len(out))
    f = int(0.2 * SR)
    for s in data['shots']:
        if s['black']:
            i0, i1 = int(s['start'] * SR), int(s['end'] * SR)
            gain[i0:i1] = 0
            a0 = max(0, i0 - f)
            gain[a0:i0] = np.minimum(gain[a0:i0], np.linspace(1, 0, i0 - a0))
            b1 = min(len(out), i1 + f)
            gain[i1:b1] = np.minimum(gain[i1:b1], np.linspace(0, 1, b1 - i1))
    out = out * gain[:, None]
    # keine Klicks: sanfter Hochpass gegen Gleichanteil
    out = np.stack([hp(out[:, 0], 30), hp(out[:, 1], 30)], 1)
    return out


def voice_mask(words, n, offset=0.0):
    """1 waehrend die Stimme spricht (Woerter, Luecken < 0,3 s verbunden), weich 0,15 s."""
    m = np.zeros(n)
    spans = sorted((s + offset, e + offset) for s, e in words)
    merged = []
    for s, e in spans:
        if merged and s - merged[-1][1] < 0.3:
            merged[-1][1] = max(merged[-1][1], e)
        else:
            merged.append([s, e])
    for s, e in merged:
        m[int(max(0, s - 0.15) * SR):int(min(n / SR, e + 0.15) * SR)] = 1
    k = int(0.15 * SR)
    m = np.convolve(m, np.ones(k) / k, 'same')
    return np.clip(m, 0, 1)


def ff(args):
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', *args], check=True)


def main():
    data = json.load(open(p('out', 'bewegung.json')))
    story = json.load(open(p('dist', 'story.json')))
    dur = data['duration']
    os.makedirs(p('audio'), exist_ok=True)
    sfx = build(data)
    peak = np.abs(sfx).max()
    if peak > 0.98:
        sfx *= 0.98 / peak
    wavfile.write(p('audio', 'geraeusche.wav'), SR, sfx.astype(np.float32))
    n = len(sfx)
    voice_file = p('audio', 'stimme.wav')
    have_voice = os.path.exists(voice_file) and not data.get('draft')
    if have_voice:
        # Stimme: Hochpass 80 Hz, leichte Kompression (-20 dB, 3:1), -16 LUFS, an ihre Position im Video
        off = story['voice'].get('offset', 0)
        ff(['-i', voice_file, '-af', f'highpass=f=80,acompressor=threshold=-20dB:ratio=3:attack=5:release=120,loudnorm=I=-16:TP=-1.5:LRA=11,adelay={int(off*1000)}|{int(off*1000)},aresample={SR}', '-ac', '2', '-ar', str(SR), p('audio', 'work_stimme.wav')])
        sr, v = wavfile.read(p('audio', 'work_stimme.wav'))
        v = v.astype(np.float64) / (32768.0 if v.dtype == np.int16 else 1.0)
        if v.ndim == 1:
            v = np.stack([v, v], 1)
        vv = np.zeros((n, 2))
        vv[: min(n, len(v))] = v[:n]
        words = data['words']   # bereits mit Versatz
        duck = 1 - (1 - db(-9)) * voice_mask(words, n)
        mix = vv + sfx * duck[:, None]
    else:
        print('HINWEIS: keine Stimme (audio/stimme.wav fehlt oder Zeiten sind ein Entwurf) - Mischung nur mit Geraeuschen.')
        mix = sfx.copy()
    wavfile.write(p('audio', 'work_mix_raw.wav'), SR, mix.astype(np.float32))
    fo = max(0, dur - 1.0)
    target = '-14' if have_voice else '-20'
    ff(['-i', p('audio', 'work_mix_raw.wav'), '-af', f'loudnorm=I={target}:TP=-1.5:LRA=11,afade=t=out:st={fo:.3f}:d=1.0,aresample={SR}', '-ar', str(SR), '-ac', '2', '-c:a', 'pcm_s16le', p('out', 'mix.wav')])
    for f in ('work_mix_raw.wav', 'work_stimme.wav'):
        if os.path.exists(p('audio', f)):
            os.remove(p('audio', f))
    r = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', p('out', 'mix.wav'), '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
    summ = r[r.rfind('Summary:'):]
    print('out/mix.wav', ' '.join(summ.split()))


if __name__ == '__main__':
    main()
