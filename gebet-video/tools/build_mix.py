#!/usr/bin/env python3
"""Ereignisliste für die Tonmischung des ganzen Videos aus audio/timeline.json → audio/mix_film.json
Danach: python3 tools/mix.py audio/mix_film.json out/phase7/film_ton.wav
Keine Musik: Stimmen, Adhan, Iqāma, Raumklang, Geräusche.
"""
import json, os
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
TL = json.load(open(os.path.join(ROOT, 'audio/timeline.json')))
S = {s['id']: s for s in TL['shots']}
dur = TL['duration']
sfx = lambda n: f'assets/sfx/{n}.wav'
ev = [{'file': f'assets/audio/zeilen/{i}.wav', 'at': t, 'gain': 0, 'fadeIn': 0.01, 'fadeOut': 0.04} for i, t in TL['voice']]
# Teil 1–2: wie die freigegebene Probe
ev += json.load(open(os.path.join(ROOT, 'audio/mix_probe_hook_strasse.json')))['events'][7:]
ev = [e for e in ev if 'raumklang' not in e['file']]
inside = S['S13']['t0'] - 1.0
ev.append({'file': sfx('raumklang_moschee'), 'at': inside, 'dur': 20, 'gain': -28, 'fadeIn': 0.8, 'fadeOut': 0.5})
# Raumklang durchgehend (20-s-Datei in Abschnitten, weich überblendet)
t = inside + 19.5
while t < dur:
    ev.append({'file': sfx('raumklang_moschee'), 'at': round(t, 2), 'dur': min(20, dur - t), 'gain': -28, 'fadeIn': 0.5, 'fadeOut': 0.5}); t += 19.5
at = lambda sid, off=0: round(S[sid]['t0'] + off, 2)
ev += [
    {'file': sfx('schuhe_ins_regal'), 'at': at('S13', 0.15), 'gain': -20},
    {'file': sfx('schritte_teppich'), 'at': at('S14'), 'dur': S['S14']['t'], 'gain': -22},
    {'file': sfx('stoff'), 'at': at('S15', 0.2), 'gain': -22},
    {'file': sfx('uhr_ticken'), 'at': at('S18'), 'dur': S['S18']['t'], 'gain': -22},
    {'file': sfx('impact'), 'at': at('S24', 0.1), 'gain': -18},
    {'file': sfx('grollen'), 'at': at('S24'), 'dur': S['S24']['t'] + S['S25']['t'], 'gain': -24, 'fadeOut': 0.8},
    {'file': sfx('waage_klacken'), 'at': at('S31', 0.6), 'gain': -18},
    {'file': sfx('uhr_ticken'), 'at': at('S33'), 'dur': S['S33']['t'], 'gain': -22},
    {'file': sfx('stoff'), 'at': at('S36', 0.4), 'gain': -20},
    {'file': sfx('wasser'), 'at': at('S39'), 'dur': S['S42']['t0'] + S['S42']['t'] - S['S39']['t0'], 'gain': -22, 'fadeIn': 0.6, 'fadeOut': 0.8},
    {'file': sfx('stoff'), 'at': at('S45', 0.1), 'gain': -20},
    {'file': sfx('schritte_teppich'), 'at': at('S46'), 'dur': 2.5, 'gain': -22},
]
# Iqāma (Platzhalter): ab S46, leise unter dem Schlusssatz ausblenden
a14 = next(t for i, t in TL['voice'] if i == 'A14')
ev.append({'file': 'assets/audio/roh/iqama_bildschirmaufnahme.wav', 'at': at('S46'), 'dur': round(a14 + 1.2 - S['S46']['t0'], 2),
           'gain': -12, 'reverb': 0.25, 'fadeIn': 0.3, 'fadeOut': 1.8})
# Beweis-Karten: Whoosh + Pop
for c in TL['cards']:
    ev.append({'file': sfx('whoosh_kurz'), 'at': round(c['t0'] - 0.05, 2), 'gain': -20})
    ev.append({'file': sfx('pop'), 'at': round(c['t0'] + 0.28, 2), 'gain': -18})
json.dump({'duration': dur, 'events': ev}, open(os.path.join(ROOT, 'audio/mix_film.json'), 'w'), indent=1)
print(len(ev), 'Ereignisse, Dauer', dur)
