#!/usr/bin/env python3
"""Phase 4: Einblendungen Bild für Bild (30/s) festlegen und als durchsichtige PNGs rendern.

    python3 tools/einblendungen.py [--nur-json]
    braucht: audio/zeitplan.json, assets/audio/zeilen/lines.json, audio/punkte.json (blender/film.py --punkte)
    → out/phase4/zustaende.json, out/phase4/ebenen/f_00000.png …

- Zeitbalken „IQAMA IN mm:ss“: läuft bis S5 in Echtzeit ab 10:00 (B01 „noch zehn Minuten“ passt), ab S6 wird er gold und
  die Zeit läuft schnell bis 0:00 genau bei „Hände hoch“ (A07).
- Hook-Titel in S1, Untertitel Wort für Wort (Gruppen wie im Gebet-Video, ﷻ nach „Allah“ außerhalb von Zitaten).
  Während A04 keine Untertitel: dort steht die Karte H1 mit genau diesem Wortlaut.
- Gebetsnamen abwechselnd über/unter dem Punkt (rechts wird das Schild an den Rand geschoben). S8 goldene Schrift, S9 Bildschirmzeit (Hintergrund abgedunkelt und weich), S10 Gebetsnamen an den Lichtpunkten +
  Wörter „für dich / für deine Eltern / für dein Jenseits“ (zur Stimme), S12 Schlusssatz + Quelle. Logo klein oben.
"""
import json, os, re, subprocess, sys

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
ease = lambda x: (lambda k: k * k * (3 - 2 * k))(clamp01(x))
NAMEN = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']


def wort(z, text, nr=0):
    """Absolute Startzeit des (nr+1)-ten Worts in Zeile z, das mit text beginnt."""
    return START[z] + [w['t0'] for w in LINES[z]['woerter'] if w['w'].startswith(text)][nr]


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


T_FUER = wort('A06', 'für')                  # ab hier stehen die drei Wörter groß im Bild statt Untertitel
SUBS = []
for z, t0 in ZP['stimmen']:
    if z == 'A04':                           # Karte H1 zeigt den Wortlaut
        continue
    gs = gruppen(honor([{'w': w['w'], 't0': round(t0 + w['t0'], 3), 't1': round(t0 + w['t1'], 3)} for w in LINES[z]['woerter']]))
    gs[-1]['t1'] = min(gs[-1]['t1'], ENDE[z] + 0.25)
    if z == 'A06':
        gs = [g for g in gs if g['t0'] < T_FUER - 0.01]
        gs[-1]['t1'] = min(gs[-1]['t1'], T_FUER)
    SUBS += gs


def untertitel(t):
    return next((g for g in SUBS if g['t0'] <= t < g['t1']), None)


# ---- feste Zeiten
T_GOLD = SHOT['S6']['t0'] + 0.5                       # Display geht aus, Balken wird gold
T_NULL = wort('A07', 'Hände')                         # Zeitbalken erreicht 0:00
REST_GOLD = 600 - T_GOLD                              # bis dahin Echtzeit ab 10:00
H1 = {'id': 'H1', 't0': round(START['A04'] + 0.2, 3), 't1': round(ende_shot('S6') - 0.05, 3)}
T_GOLDSCHRIFT = wort('A05', 'wer')
T_WORTE = [wort('A06', 'für', k) for k in range(3)]
T_SCHLUSS = ENDE['A07'] + 0.25
S10 = SHOT['S10']


def rest(t):
    if t < T_GOLD:
        return 600 - t
    return max(0.0, REST_GOLD * (1 - (t - T_GOLD) / (T_NULL - T_GOLD)))


def zustand(n):
    t = n / FPS
    p = PUNKTE[min(n, len(PUNKTE) - 1)]
    sid = p['shot']
    z = {'t': round(t, 4), 'logo': round(ein(t, 0.2, 0.5), 3)}
    gold = ease((t - T_GOLD) / 0.8)
    z['balken'] = {'rest': round(rest(t), 2), 'gold': round(gold, 3), 'a': round(ein(t, 0.1, 0.5), 3)}
    if sid == 'S1':
        z['titel'] = {'zeilen': ['Diese Minuten', 'verschwendet fast jeder.'], 't0': 0.4, 't1': round(ende_shot('S1') - 0.05, 3), 'y': 640}
    if sid == 'S6' and t >= H1['t0']:
        z['karte'] = H1
    if sid == 'S8' and t >= T_GOLDSCHRIFT:
        z['gold'] = 'Wer wartet, ist im Gebet'; z['goldA'] = round(ein(t, T_GOLDSCHRIFT, 0.5) * clamp01((ende_shot('S8') - t) / 0.3), 3)
        z['goldY'] = 640
    if sid == 'S9':
        a = ein(t, SHOT['S9']['t0'], 0.3)
        z['abdunkeln'] = round(0.35 * a, 3)
        z['bildschirmzeit'] = {'minuten': 47, 'a': round(a, 3)}
    if sid == 'S10':
        u = (t - S10['t0']) / S10['t']
        z['schilder'] = []
        for k, (name, xy) in enumerate(zip(NAMEN, p['punkte'])):
            a = ease((u - (0.05 + k * 0.09) - 0.02) / 0.06)
            if a > 0:
                z['schilder'].append({'text': name, 'xy': [round(xy[0]), round(xy[1] + (-75 if k % 2 == 0 else 80))], 'a': round(a, 3)})
        if t >= T_WORTE[0]:
            z['worte'] = ['für dich', 'für deine Eltern', 'für dein Jenseits']
            z['worteT0'] = [round(x, 3) for x in T_WORTE]; z['worteT1'] = round(ende_shot('S10') - 0.05, 3); z['worteY'] = 1150
    if sid == 'S12' and t >= T_SCHLUSS:
        z['titel'] = {'zeilen': ['Zwischen Adhan und Iqama', 'wird das Bittgebet', 'nicht abgelehnt.'], 't0': round(T_SCHLUSS, 3), 't1': 999, 'y': 640}
        z['fuss'] = 'Abū Dāwūd 521 · at-Tirmidhī 212'; z['fussA'] = round(ein(t, T_SCHLUSS + 0.5, 0.4), 3); z['fussY'] = 850
    g = untertitel(t)
    if g:
        z['sub'] = {'gruppe': g}
        if sid == 'S9':
            z['sub']['y'] = 1470
    return z


N = int(round(ZP['dauer'] * FPS))
liste = [{'name': f'f_{n:05d}', 'zustand': zustand(n)} for n in range(N)]
datei = os.path.join(P4, 'zustaende.json')
json.dump(liste, open(datei, 'w'), ensure_ascii=False)
print(f'{N} Zustände → {os.path.relpath(datei, ROOT)}')
print(f'Gold {T_GOLD:.2f} (Rest {REST_GOLD:.0f} s) · 0:00 bei {T_NULL:.2f} · H1 {H1["t0"]}–{H1["t1"]} · Goldschrift {T_GOLDSCHRIFT:.2f} · '
      f'Wörter {[round(x, 2) for x in T_WORTE]} · Schluss {T_SCHLUSS:.2f}')
if '--nur-json' not in sys.argv:
    subprocess.run(['node', os.path.join(ROOT, 'tools', 'overlay.mjs'), datei, os.path.join(P4, 'ebenen')], check=True)
