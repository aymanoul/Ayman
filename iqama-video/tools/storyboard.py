#!/usr/bin/env python3
"""Phase 2 (Blender-Fassung): Einblendungen rendern, über die Blender-Bilder legen und die Blätter bauen.

    python3 tools/storyboard.py      (vorher: .venv-blender/bin/python blender/storyboard.py)
    → out/phase2/S1.png … S12.png, out/phase2/storyboard.jpg, out/phase2/einzelbilder.jpg
"""
import json, os, subprocess

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
P2 = os.path.join(ROOT, 'out', 'phase2')
EB = os.path.join(P2, 'ebenen')
FONT = os.path.join(ROOT, '..', 'gebet-video', 'node_modules', '@fontsource', 'montserrat', 'files', 'montserrat-latin-700-normal.woff')
lab = json.load(open(os.path.join(P2, 'beschriftung.json')))
NAMEN = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']
L = {'logo': 1}
Z = {
    'S1': {**L, 'balken': {'rest': 600}, 'titel': ['Diese Minuten', 'verschwendet fast jeder.'], 'titelY': 600},
    'S2': {**L, 'balken': {'rest': 575}, 'untertitel': 'verbringen sie am Handy.'},
    'S3': {**L, 'balken': {'rest': 552}, 'untertitel': 'Kurz noch was gucken.'},
    'S4': {**L, 'balken': {'rest': 520}, 'untertitel': 'welche Zeit das gerade ist?'},
    'S5': {**L, 'balken': {'rest': 490}, 'untertitel': 'Frieden auf ihm, sagte:'},
    'S6': {**L, 'balken': {'rest': 470, 'gold': 1}, 'karte': 'H1'},
    'S7': {**L, 'balken': {'rest': 430, 'gold': 1}, 'untertitel': 'In diesen paar Minuten?'},
    'S8': {**L, 'balken': {'rest': 380, 'gold': 1}, 'gold': 'Wer wartet, ist im Gebet', 'untertitel': 'als wäre er im Gebet.'},
    'S9': {**L, 'abdunkeln': 0.35, 'balken': {'rest': 330, 'gold': 1}, 'bildschirmzeit': 47, 'untertitel': 'jeden Tag am Handy verbracht.', 'untertitelY': 1470},
    'S10': {**L, 'balken': {'rest': 260, 'gold': 1}, 'schilder': [{'text': n, 'xy': [x, y - 70]} for n, (x, y) in zip(NAMEN, lab.get('S10', []))],
            'worte': ['für dich', 'für deine Eltern', 'für dein Jenseits'], 'worteY': 1250},
    'S11': {**L, 'balken': {'rest': 120, 'gold': 1}, 'untertitel': 'in der Tasche.'},
    'S12': {**L, 'balken': {'rest': 0, 'gold': 1}, 'titel': ['Zwischen Adhan und Iqama', 'wird das Bittgebet', 'nicht abgelehnt.'], 'titelY': 620},
    'Zeitbalken': {'balken': {'rest': 600, 'y': 900}},
    'Zeitbalken_gold': {'balken': {'rest': 290, 'gold': 1, 'y': 900}},
}
liste = os.path.join(P2, 'zustaende.json')
json.dump([{'name': k, 'zustand': v} for k, v in Z.items()], open(liste, 'w'), ensure_ascii=False, indent=1)
subprocess.run(['node', os.path.join(ROOT, 'tools', 'overlay.mjs'), liste, EB], check=True)


def ff(args):
    subprocess.run(['ffmpeg', '-v', 'error', '-y'] + args, check=True)


for s in [k for k in Z if k.startswith('S')]:
    blur = ',boxblur=10:2' if s == 'S9' else ''
    ff(['-i', os.path.join(P2, f'3d_{s}.png'), '-i', os.path.join(EB, f'{s}.png'), '-filter_complex', f'[0]scale=1080:1920{blur}[b];[b][1]overlay', os.path.join(P2, f'{s}.png')])

TXT = {'S1': 'Totale Hook', 'S2': 'Fahrt auf B (A01)', 'S3': 'nah B Handy (B01)', 'S4': 'A setzt sich (A02 B02)', 'S5': 'nah A (A03)',
       'S6': 'Licht-Tor + Karte H1 (A04)', 'S7': 'nah B (B03)', 'S8': 'Wartende (A05)', 'S9': 'Bildschirmzeit (B04)',
       'S10': 'fuenf Lichtpunkte (A06)', 'S11': 'Handy in die Tasche (B05)', 'S12': 'Bittgebet + Schluss (A07)'}
names = list(TXT)
inp = sum((['-i', os.path.join(P2, f'{s}.png')] for s in names), [])
lab_f = ''.join(f"[{i}]scale=360:640,drawtext=fontfile={FONT}:text='{s} · {TXT[s]}':x=10:y=10:fontsize=20:fontcolor=white:box=1:boxcolor=0x212242@0.85:boxborderw=8[v{i}];" for i, s in enumerate(names))
ff(inp + ['-filter_complex', lab_f + ''.join(f'[v{i}]' for i in range(6)) + 'hstack=6[r1];' + ''.join(f'[v{i}]' for i in range(6, 12)) + 'hstack=6[r2];[r1][r2]vstack',
          '-frames:v', '1', os.path.join(P2, 'storyboard.jpg')])
T = os.path.join(P2, 'tex')
ff(['-i', os.path.join(T, 'handy_display.png'), '-i', os.path.join(T, 'handy_display_dunkel.png'), '-f', 'lavfi', '-i', 'color=c=0x4a4f63:s=1080x1920',
    '-i', os.path.join(EB, 'Zeitbalken.png'), '-i', os.path.join(EB, 'Zeitbalken_gold.png'), '-i', os.path.join(P2, '3d_tor_nah.png'), '-filter_complex',
    '[0]scale=300:638,pad=320:960:10:161:color=0x2a2c55[a];[1]scale=300:638,pad=320:960:10:161:color=0x2a2c55[b];'
    '[2][3]overlay[z1a];[z1a]crop=720:200:180:840,scale=540:150[z1];[2][4]overlay[z2a];[z2a]crop=720:200:180:840,scale=540:150[z2];'
    '[z1][z2]vstack,pad=540:960:0:330:color=0x4a4f63[z];[5]scale=540:960[t];[a][b][z][t]hstack=4', '-frames:v', '1',
    os.path.join(P2, 'einzelbilder.jpg')])
print('fertig: out/phase2/storyboard.jpg, out/phase2/einzelbilder.jpg')
