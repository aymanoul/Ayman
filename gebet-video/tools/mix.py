#!/usr/bin/env python3
"""Tonmischung: legt Stimmen, Adhan/Iqāma und Geräusche nach einer Ereignisliste (JSON) übereinander.

    python3 tools/mix.py audio/mix_probe.json out/phase7/ton.wav

Ereignis: {"file": "assets/sfx/whoosh.wav", "at": 0.95, "gain": -14, "from": 0, "dur": 2.0,
           "fadeIn": 0.05, "fadeOut": 0.3, "lowpass": 3000, "reverb": 0.3}
Ergebnis: 48 kHz Stereo-WAV. Lautheit wird beim Zusammenführen mit dem Video per ffmpeg loudnorm eingestellt.
Keine Musik: nur Stimmen, Adhan, Iqāma, Raumklang und Geräusche.
"""
import json, subprocess, sys
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

SR = 48000


def load(path):
    pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(pcm, np.int16).astype(np.float64) / 32768


def room(x, amount):
    n = int(0.9 * SR)
    rng = np.random.default_rng(3)
    ir = rng.standard_normal(n) * np.exp(-np.arange(n) / SR * 7.5)
    ir = sosfilt(butter(2, 4000, 'lowpass', fs=SR, output='sos'), ir)
    wet = fftconvolve(x, ir)[: len(x)]
    wet *= np.max(np.abs(x)) / (np.max(np.abs(wet)) + 1e-9)
    return x * (1 - amount) + wet * amount


def main(spec_path, out_path):
    spec = json.load(open(spec_path))
    total = spec['duration']
    mixbuf = np.zeros(int(total * SR) + SR)
    cache = {}
    for e in spec['events']:
        x = cache.setdefault(e['file'], load(e['file']))
        a = int(e.get('from', 0) * SR)
        d = int(e['dur'] * SR) if 'dur' in e else len(x) - a
        seg = x[a:a + d].copy()
        if e.get('lowpass'):
            seg = sosfilt(butter(4, e['lowpass'], 'lowpass', fs=SR, output='sos'), seg)
        if e.get('reverb'):
            seg = room(seg, e['reverb'])
        fi, fo = int(e.get('fadeIn', 0.01) * SR), int(e.get('fadeOut', 0.05) * SR)
        if fi: seg[:fi] *= np.linspace(0, 1, min(fi, len(seg)))
        if fo: seg[-fo:] *= np.linspace(1, 0, min(fo, len(seg)))
        seg *= 10 ** (e.get('gain', 0) / 20)
        i = int(e['at'] * SR)
        n = min(len(seg), len(mixbuf) - i)
        mixbuf[i:i + n] += seg[:n]
    mixbuf = mixbuf[: int(total * SR)]
    peak = np.max(np.abs(mixbuf))
    if peak > 0.98: mixbuf *= 0.98 / peak
    st = np.stack([mixbuf, mixbuf], 1)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', str(SR), '-ac', '2', '-i', '-', out_path],
                   input=(st * 32767).astype(np.int16).tobytes(), check=True)
    print(f'Mischung: {out_path} ({total:.1f} s, Spitze {20 * np.log10(peak + 1e-9):.1f} dBFS)')


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
