#!/usr/bin/env python3
"""Zeitplan für das ganze Video aus den echten Zeilenlängen → audio/timeline.json

- Reihenfolge der Zeilen und Zuordnung zu den Einstellungen: Spalte „zeile“ in web/sheets/board.js
- Einstellungen ohne Stimme behalten ihre geschätzte Dauer aus der Shotliste
- Einstellungen derselben Zeile teilen sich deren Länge im Verhältnis ihrer geschätzten Dauer
- Beweis-Karten: ab dem Zitatanfang („) bis Zeilenende + Lesezeit, mindestens 4,5 s
Die Hook-Einstellungen S01–S12 behalten den in film.js abgestimmten Zeitplan (DUR/VOICE).
"""
import json, os, re, subprocess

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
GAP = 0.35                      # Pause zwischen zwei Zeilen
LINES = json.load(open(os.path.join(ROOT, 'assets/audio/zeilen/lines.json')))
shots = json.loads(subprocess.run(['node', '-e', "import('./web/sheets/board.js').then(m=>console.log(JSON.stringify(m.SHOTS.map(s=>({id:s.id,t:s.t,zeile:s.zeile,teil:s.teil})))))"],
                                  cwd=ROOT, capture_output=True, text=True, check=True).stdout)
HOOK = {'S01': 3.15, 'S02': 1.1, 'S03': 1.1, 'S05': 1.95, 'S06': 3.75, 'S07': 1.55, 'S08': 1.95, 'S09': 2.65, 'S10': 3.3, 'S11': 1.1, 'S12': 2.0}
HOOK_VOICE = [['A01', 0.0], ['A02', 5.45], ['B01', 7.45], ['A03', 11.15], ['B02', 14.65], ['A04', 17.35], ['B03', 20.65]]
CARDS = {'A05': ['Q1'], 'A06': ['Q4'], 'A07': ['Q5'], 'A08': ['H2'], 'A09': ['H7'], 'A10': ['H1'], 'A12': ['H4a', 'H4b']}

out_shots, voice, cards = [], list(HOOK_VOICE), []
t = 0.0
i = 0
while i < len(shots):
    s = shots[i]
    if s['id'] in HOOK:
        out_shots.append({'id': s['id'], 't0': round(t, 3), 't': HOOK[s['id']]}); t += HOOK[s['id']]; i += 1; continue
    z = s['zeile']
    if z in LINES:
        grp = [x for x in shots[i:] if x['zeile'] == z]
        grp = grp[: next((k for k, x in enumerate(shots[i:]) if x['zeile'] != z), len(grp))]
        L = LINES[z]['dauer']
        total = L + GAP
        est = sum(x['t'] for x in grp)
        at = t + 0.15
        voice.append([z, round(at, 3)])
        for x in grp:
            d = total * x['t'] / est
            out_shots.append({'id': x['id'], 't0': round(t, 3), 't': round(d, 3)}); t += d
        # Karten
        ws = LINES[z]['woerter']
        q0 = next((w['t0'] for w in ws if w['w'].startswith('„')), ws[0]['t0'])
        names = CARDS.get(z, [])
        if len(names) == 2:                                     # langer Hadith: zwei Teile, Wechsel bei „Sie sagten“
            mid = next((w['t0'] for w in ws if w['w'].startswith('Sie') and w['t0'] > q0 + 3), (q0 + L) / 2)
            cards.append({'card': names[0], 't0': round(at + q0, 3), 't1': round(at + mid, 3)})
            cards.append({'card': names[1], 't0': round(at + mid, 3), 't1': round(at + L + 1.2, 3)})
        elif names:
            cards.append({'card': names[0], 't0': round(at + q0, 3), 't1': round(max(at + L + 1.2, at + q0 + 4.5), 3)})
        i += len(grp)
    else:
        out_shots.append({'id': s['id'], 't0': round(t, 3), 't': s['t']}); t += s['t']; i += 1
# Schlussbild 2 s stehen lassen
out_shots[-1]['t'] = round(out_shots[-1]['t'] + 2.0, 3); t += 2.0
# Karten dürfen sich nicht überlappen
for a, b in zip(cards, cards[1:]):
    if a['t1'] > b['t0'] - 0.1: a['t1'] = round(b['t0'] - 0.1, 3)
json.dump({'duration': round(t, 3), 'shots': out_shots, 'voice': voice, 'cards': cards}, open(os.path.join(ROOT, 'audio/timeline.json'), 'w'), indent=1)
print(f'Gesamtlänge {int(t // 60)}:{t % 60:04.1f} · {len(out_shots)} Einstellungen · {len(voice)} Zeilen · {len(cards)} Karten')
for c in cards: print(f"  {c['card']:4s} {c['t0']:6.1f}–{c['t1']:6.1f} s")
