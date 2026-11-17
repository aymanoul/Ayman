#!/usr/bin/env python3
"""Phase 2: Storyboard-Blatt aus den Einzelbildern bauen.

    python3 tools/blatt.py    (vorher: node tools/storyboard.mjs)
    → out/phase2/storyboard.jpg (12 Bilder, 6 × 2) und out/phase2/einzelbilder.jpg (Handy-Display, Zeitbalken, Licht-Tor)
"""
import json, os, subprocess

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
P2 = os.path.join(ROOT, 'out', 'phase2')
FONT = os.path.join(ROOT, '..', 'gebet-video', 'node_modules', '@fontsource', 'montserrat', 'files', 'montserrat-latin-700-normal.woff')
TXT = {'S1': 'Totale Hook', 'S2': 'Fahrt auf B (A01)', 'S3': 'nah B Handy (B01)', 'S4': 'A setzt sich (A02 B02)', 'S5': 'nah A (A03)',
       'S6': 'Licht-Tor + Karte H1 (A04)', 'S7': 'nah B (B03)', 'S8': 'Wartende (A05)', 'S9': 'Bildschirmzeit (B04)',
       'S10': 'fuenf Lichtpunkte (A06)', 'S11': 'Handy in die Tasche (B05)', 'S12': 'Bittgebet + Schluss (A07)'}


def ff(args):
    subprocess.run(['ffmpeg', '-v', 'error', '-y'] + args, check=True)


names = list(TXT)
inp = []
for s in names:
    inp += ['-i', os.path.join(P2, 'cells', f'{s}.png')]
lab = ''.join(f"[{i}]scale=360:640,drawtext=fontfile={FONT}:text='{s} · {TXT[s]}':x=10:y=10:fontsize=20:fontcolor=white:box=1:boxcolor=0x212242@0.85:boxborderw=8[v{i}];"
              for i, s in enumerate(names))
ff(inp + ['-filter_complex', lab + ''.join(f'[v{i}]' for i in range(6)) + 'hstack=6[r1];' + ''.join(f'[v{i}]' for i in range(6, 12)) + 'hstack=6[r2];[r1][r2]vstack',
          '-frames:v', '1', os.path.join(P2, 'storyboard.jpg')])
E = os.path.join(P2, 'einzel')
ff(['-i', os.path.join(E, 'handy_display.png'), '-i', os.path.join(E, 'handy_display_dunkel.png'), '-i', os.path.join(E, 'zeitbalken.png'),
    '-i', os.path.join(E, 'zeitbalken_gold.png'), '-i', os.path.join(E, 'licht_tor.png'), '-filter_complex',
    '[0]scale=300:638,pad=320:960:10:161:color=0x2a2c55[a];[1]scale=300:638,pad=320:960:10:161:color=0x2a2c55[b];'
    '[2]crop=720:200:180:840,scale=540:150[z1];[3]crop=720:200:180:840,scale=540:150[z2];'
    '[z1][z2]vstack,pad=540:960:0:330:color=0x4a4f63[z];[4]scale=540:960[t];[a][b][z][t]hstack=4',
    os.path.join(P2, 'einzelbilder.jpg')])
print('fertig: out/phase2/storyboard.jpg, out/phase2/einzelbilder.jpg')
