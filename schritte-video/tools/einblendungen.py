#!/usr/bin/env python3
"""Phase 4: Einblendungen Bild für Bild (30/s) festlegen und als durchsichtige PNGs rendern.

    python3 tools/einblendungen.py [--nur-json]
    braucht: audio/zeitplan.json, assets/audio/zeilen/lines.json, audio/punkte.json (blender/film.py --punkte)
    → out/phase4/zustaende.json, out/phase4/ebenen/f_00000.png …

Untertitel Wort für Wort (Gruppen wie im Gebet-Video, ﷻ nach „Allah“ außerhalb von Zitaten), Hook-Titel statt Untertitel in S1,
Zähler S5–S7 synchron zu den sichtbaren Abdrücken (gold = Sünde getilgt, weiß = Rangstufe erhöht), Karten H1/H2,
Handy-Karte S8, Gebetsnamen + Wudu in S9, Schlusssatz in S11.
"""
import json, math, os, re, subprocess, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
FPS = 30
ZP = json.load(open(os.path.join(ROOT, 'audio', 'zeitplan.json')))
LINES = json.load(open(os.path.join(ROOT, 'assets', 'audio', 'zeilen', 'lines.json')))
PUNKTE = json.load(open(os.path.join(ROOT, 'audio', 'punkte.json')))
SHOT = {s['id']: s for s in ZP['shots']}
START = dict((z, t0) for z, t0 in ZP['stimmen'])
ENDE = {z: START[z] + LINES[z]['dauer'] for z in START}
P4 = os.path.join(ROOT, 'out', 'phase4')
os.makedirs(P4, exist_ok=True)
clamp01 = lambda x: max(0.0, min(1.0, x))
ein = lambda t, t0, d=0.3: clamp01((t - t0) / d)


def wort(z, text):
    """Absolute Startzeit des ersten Worts in Zeile z, das mit text beginnt."""
    return START[z] + next(w['t0'] for w in LINES[z]['woerter'] if w['w'].startswith(text))


def ende_shot(sid):
    return SHOT[sid]['t0'] + SHOT[sid]['t']


# ---- Untertitel: Wörter → Gruppen (wie groupWords/honor im Gebet-Video)
HON = re.compile(r'^[ﷺﷻ]$')


def honor(ws):
    out, im_zitat = [], False
    for w in ws:
        if w['w'].startswith('„'):
            im_zitat = True
        out.append(w)
        if not im_zitat and re.match(r'^Allah[,.:!?]?$', w['w']):
            out.append({'w': 'ﷻ', 't0': w['t0'], 't1': w['t1']})
        if re.search(r'“[,.:!?]?$', w['w']):
            im_zitat = False
    return out


def gruppen(ws):
    gs, cur = [], []
    laenge = lambda a: sum(len(w['w']) + 1 for w in a if not HON.match(w['w'])) - 1
    for w in ws:
        if HON.match(w['w']) and cur:
            cur.append(w); continue
        satzende = cur and re.search(r'[.?!:…]$|[.?!]“$', cur[-1]['w'])
        if cur and (len([x for x in cur if not HON.match(x['w'])]) >= 3 or laenge(cur + [w]) > 20 or re.match(r'^[„‚]', w['w']) or satzende):
            gs.append(cur); cur = []
        cur.append(w)
    if cur:
        gs.append(cur)
    return [{'t0': g[0]['t0'], 't1': (gs[i + 1][0]['t0'] if i + 1 < len(gs) else g[-1]['t1'] + 0.25), 'words': g} for i, g in enumerate(gs)]


SUBS = []
for z, t0 in ZP['stimmen']:
    if z == 'A01':                    # Hook: Titel statt Untertitel
        continue
    gs = gruppen(honor([{'w': w['w'], 't0': round(t0 + w['t0'], 3), 't1': round(t0 + w['t1'], 3)} for w in LINES[z]['woerter']]))
    gs[-1]['t1'] = min(gs[-1]['t1'], ENDE[z] + 0.25)
    SUBS += gs


def untertitel(t):
    return next((g for g in SUBS if g['t0'] <= t < g['t1']), None)


# ---- feste Zeiten
T_ABER = wort('A01', 'Aber')
H1 = {'id': 'H1', 't0': round(START['A04'] + 0.4, 3), 't1': round(ende_shot('S5') - 0.05, 3)}
H2 = {'id': 'H2', 't0': round(wort('A05', 'Viele'), 3), 't1': round(ende_shot('S7') - 0.05, 3)}
T_WUDU = wort('A06', 'Mach')
T_SCHLUSS = ENDE['A07'] + 0.25
S9 = SHOT['S9']
SCHILDER = json.load(open(os.path.join(ROOT, 'out', 'phase2', 'beschriftung.json')))['S9']   # Reihe Fajr … Isha (links → rechts)
S8_ALT, S8_S, S8_R = 8432, 9, 8   # Handy in S8: 8.432 Schritte heute, davon zur Moschee nur der Weg eben (9 / 8 wie die Zähler)

# Abdrücke: Zeitpunkt, ab dem n Abdrücke sichtbar sind (für das Aufleuchten des Zählers)
seit = {}
for p in PUNKTE:
    if p['shot'] in ('S5', 'S6', 'S7'):
        seit.setdefault(p['abdruecke'], p['t'])


def zustand(n):
    t = n / FPS
    p = PUNKTE[min(n, len(PUNKTE) - 1)]
    sid = p['shot']
    z = {'t': round(t, 4)}
    if sid != 'S8':
        z['logo'] = 1
    if sid == 'S1':                                         # Hook: vergrößerter Bildschirm + Titel
        schritte = 8424 + int(p['phase'].get('B_Hemd_Skelett', 0))
        z['lupe'] = {'schritte': schritte, 'ring': round(0.8 + 0.04 * (schritte - 8424) / 8, 4), 'an': p['handy'],
                     'x': 600, 'y': 640, 'w': 330, 'a': round(ein(t, 0.15, 0.4), 3)}
        if t < T_ABER:
            z['titel'] = {'zeilen': ['Dein Handy zählt', 'jeden Schritt.'], 't0': 0.2, 't1': round(T_ABER - 0.05, 3), 'y': 470}
        else:
            z['titel'] = {'zeilen': ['Aber manche Schritte', 'werden anders gezählt.'], 't0': round(T_ABER, 3), 't1': round(ende_shot('S1') - 0.02, 3), 'y': 470}
    if sid in ('S5', 'S6', 'S7'):                           # zwei Zähler, synchron zu den Abdrücken
        k = p['abdruecke']
        z['zaehler'] = {'s': (k + 1) // 2, 'r': k // 2, 'y': 380,
                        'a': round(ein(t, SHOT['S5']['t0'], 0.35) * clamp01((ende_shot('S7') - t) / 0.3), 3)}
        if k and t - seit[k] < 0.45:
            z['zaehler']['blitz'] = {'feld': 'sunde' if k % 2 == 1 else 'rang', 'alter': round(t - seit[k], 3)}
    if sid == 'S5' and t >= H1['t0']:
        z['karte'] = H1
    if sid == 'S7' and t >= H2['t0']:
        z['karte'] = H2
    if sid == 'S8':                                         # Handy als Grafik über dem unscharfen Bild
        z['handy'] = {'alt': S8_ALT, 's': S8_S, 'r': S8_R, 'a': round(ein(t, SHOT['S8']['t0'], 0.3), 3)}
    if sid == 'S9':
        u = (t - S9['t0']) / S9['t']
        z['schilder'] = [{'text': s['text'], 'xy': s['xy'], 'a': round(ein(u, 0.06 + k * 0.11 + 0.03, 0.06), 3)}
                         for k, s in enumerate(SCHILDER) if u > 0.06 + k * 0.11 + 0.03]
        if t >= T_WUDU:
            z['wudu'] = round(ein(t, T_WUDU, 0.3), 3); z['wuduY'] = 900
    if sid == 'S11' and t >= T_SCHLUSS:
        z['titel'] = {'zeilen': ['Jeder Schritt', 'zur Moschee zählt.'], 't0': round(T_SCHLUSS, 3), 't1': 999, 'y': 900}
        z['fuss'] = 'Muslim 666 · Muslim 251'; z['fussA'] = round(ein(t, T_SCHLUSS + 0.5, 0.4), 3)
    g = untertitel(t)
    if g:
        z['sub'] = {'gruppe': g}
        if sid == 'S8':
            z['sub']['y'] = 1470
        if sid == 'S9':
            z['sub']['y'] = 1450
    return z


N = int(round(ZP['dauer'] * FPS))
liste = [{'name': f'f_{n:05d}', 'zustand': zustand(n)} for n in range(N)]
datei = os.path.join(P4, 'zustaende.json')
json.dump(liste, open(datei, 'w'), ensure_ascii=False)
print(f'{N} Zustände → {os.path.relpath(datei, ROOT)}')
print(f'H1 {H1["t0"]}–{H1["t1"]} · H2 {H2["t0"]}–{H2["t1"]} · Wudu {T_WUDU:.2f} · Schluss {T_SCHLUSS:.2f} · Abdrücke {sorted(seit.items())[:3]} …')
if '--nur-json' not in sys.argv:
    subprocess.run(['node', os.path.join(ROOT, 'tools', 'overlay.mjs'), datei, os.path.join(P4, 'ebenen')], check=True)
