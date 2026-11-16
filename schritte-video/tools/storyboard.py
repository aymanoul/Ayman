#!/usr/bin/env python3
"""Phase 2: Einblendungen für die Storyboard-Bilder rendern, über die 3D-Bilder legen und das Blatt bauen.

    python3 tools/storyboard.py      (vorher: blender/storyboard.py für die 3D-Bilder)
    → out/phase2/S1.png … S11.png, out/phase2/storyboard.jpg, out/phase2/display_und_zaehler.jpg
"""
import json, os, subprocess

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
P2 = os.path.join(ROOT, 'out', 'phase2')
EB = os.path.join(P2, 'ebenen')
FONT = os.path.join(ROOT, '..', 'gebet-video', 'node_modules', '@fontsource', 'montserrat', 'files', 'montserrat-latin-700-normal.woff')
lab = json.load(open(os.path.join(P2, 'beschriftung.json')))

Z = {
    'S1':  {'logo': 1, 'lupe': {'schritte': 8432, 'ring': 0.84, 'an': lab['S1']['handy'], 'x': 600, 'y': 640, 'w': 330}, 'titel': ['Dein Handy zählt', 'jeden Schritt.'], 'titelY': 470},
    'S2':  {'logo': 1, 'untertitel': 'Achttausend Schritte heute.'},
    'S3':  {'logo': 1, 'untertitel': 'auf dem Weg zur Moschee?'},
    'S4':  {'logo': 1, 'untertitel': 'Allahs Segen und Frieden auf ihm,'},
    'S5':  {'logo': 1, 'zaehler': {'s': 4, 'r': 3, 'blitz': {'feld': 'sunde', 'alter': 0.1}}, 'karte': 'H1', 'untertitel': 'dessen Schritte sind so:'},
    'S6':  {'logo': 1, 'untertitel': 'Bei jedem einzelnen Schritt?'},
    'S7':  {'logo': 1, 'zaehler': {'s': 8, 'r': 7, 'blitz': {'feld': 'rang', 'alter': 0.15}}, 'karte': 'H2', 'untertitel': 'Rangstufen erhöht.'},
    'S8':  {'handy': {'alt': 8432, 's': 0, 'r': 1}, 'untertitel': 'ganz schön viele verschenkt.', 'untertitelY': 1470},
    'S9':  {'logo': 1, 'schilder': [{'text': s['text'], 'xy': s['xy']} for s in lab.get('S9', [])], 'wudu': 1, 'wuduY': 900},
    'S10': {'logo': 1, 'untertitel': 'zähle ich anders.'},
    'S11': {'logo': 1, 'titel': ['Jeder Schritt', 'zur Moschee zählt.'], 'fuss': 'Muslim 666 · Muslim 251'},
    'Display_2': {'display': {'schritte': 8432, 'ring': 0.84, 'zeile': 1}},
    'Zaehler': {'zaehler': {'s': 12, 'r': 11, 'blitz': {'feld': 'sunde', 'alter': 0.05}}, 'logo': 1},
}
liste = os.path.join(P2, 'zustaende.json')
json.dump([{'name': k, 'zustand': v} for k, v in Z.items()], open(liste, 'w'), ensure_ascii=False, indent=1)
subprocess.run(['node', os.path.join(ROOT, 'tools', 'overlay.mjs'), liste, EB], check=True)


def ff(args):
    subprocess.run(['ffmpeg', '-v', 'error', '-y'] + args, check=True)


for s in Z:
    if s in ('Display_2', 'Zaehler'):
        continue
    out = os.path.join(P2, f'{s}.png')
    ov = os.path.join(EB, f'{s}.png')
    bg = os.path.join(P2, f'3d_{s}.png')
    blur = ',boxblur=12:2' if s == 'S8' else ''
    ff(['-i', bg, '-i', ov, '-filter_complex', f'[0]scale=1080:1920{blur}[b];[b][1]overlay', out])
# Zähler als Einzelbild über dem Hof-Bild
ff(['-i', os.path.join(P2, '3d_S7.png'), '-i', os.path.join(EB, 'Zaehler.png'), '-filter_complex', '[0]scale=1080:1920[b];[b][1]overlay', os.path.join(P2, 'Zaehler.png')])
ff(['-i', os.path.join(EB, 'Display_2.png'), os.path.join(P2, 'Display_2.png')])

TXT = {'S1': 'Hook B mit Handy', 'S2': 'B auf dem Gehweg', 'S3': 'A am Vordach', 'S4': 'nah A', 'S5': 'Kernbild Spur + H1', 'S6': 'nah B, Fuesse',
       'S7': 'Draufsicht + H2', 'S8': 'Handy 8.432', 'S9': 'fuenf Wege', 'S10': 'zur Tuer', 'S11': 'Schluss'}
names = list(TXT)
inp = []
for s in names:
    inp += ['-i', os.path.join(P2, f'{s}.png')]
lab_f = ''.join(f"[{i}]scale=360:640,drawtext=fontfile={FONT}:text='{s} · {TXT[s]}':x=10:y=10:fontsize=22:fontcolor=white:box=1:boxcolor=0x212242@0.85:boxborderw=8[v{i}];" for i, s in enumerate(names))
pad = '[v11]' if False else ''
ff(inp + ['-f', 'lavfi', '-i', 'color=c=0x2a2c55:s=360x640', '-filter_complex',
          lab_f + '[11]null[v11];' + ''.join(f'[v{i}]' for i in range(6)) + 'hstack=6[r1];' + ''.join(f'[v{i}]' for i in range(6, 12)) + 'hstack=6[r2];[r1][r2]vstack',
          '-frames:v', '1', os.path.join(P2, 'storyboard.jpg')])
ff(['-i', os.path.join(P2, 'S1.png'), '-i', os.path.join(P2, 'Display_2.png'), '-i', os.path.join(P2, 'Zaehler.png'), '-filter_complex',
    '[0]scale=540:960[a];[1]scale=540:960[b];[2]scale=540:960[c];[a][b][c]hstack=3', os.path.join(P2, 'display_und_zaehler.jpg')])
print('fertig: out/phase2/storyboard.jpg, out/phase2/display_und_zaehler.jpg')
