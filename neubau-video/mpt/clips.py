# Baut 9:16-Clips (1080x1920) aus unseren eigenen Renderings fuer MoneyPrinterTurbo (Quelle "local").
# Layout: unscharfer, abgedunkelter Hintergrund + scharfer Bildausschnitt (1080x960) im oberen Drittel.
import json, subprocess, sys, os
Z = json.load(open('zeiten.json')); st = Z['starts']; ges = Z['gesamt']
END = '../out/phase5/end/f_%05d.png'
FPS = 30
# Schnittpunkte: an den Satzanfaengen
cuts = [0.0, st[2], st[3], st[4], st[5], st[6], st[7], st[8], st[9], ges + 0.4]
dur = [round(cuts[i + 1] - cuts[i], 3) for i in range(9)]
FG_H, FG_Y = 960, 250

def layout(src_label):
    return (f"{src_label}split=2[a][b];"
            f"[a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=30:3,eq=brightness=-0.12:saturation=0.85[bg];"
            f"[b]scale=-2:{FG_H},crop=1080:{FG_H}[fg];"
            f"[bg][fg]overlay=0:{FG_Y},format=yuv420p[v]")

def aus_bildern(name, t0, d, tempo=1.0):
    n0 = int(round(t0 * FPS)); nsrc = int(round(d * tempo * FPS)) + 2
    flt = f"[0:v]setpts=PTS/{tempo},fps={FPS},trim=duration={d},setpts=PTS-STARTPTS," + layout('')[0:]
    flt = f"[0:v]setpts=PTS/{tempo},fps={FPS},trim=duration={d},setpts=PTS-STARTPTS[s];" + layout('[s]')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-start_number', str(n0), '-i', END,
                    '-frames:v', str(int(round(d * FPS))), '-filter_complex', flt, '-map', '[v]',
                    '-c:v', 'libx264', '-crf', '17', '-preset', 'slow', '-r', str(FPS), name], check=True)

def aus_standbild(name, bild, d, z0, z1, cx0, cy0, cx1, cy1):
    """Ken-Burns: Zoom z0→z1, Zentrum (cx,cy) in Bildanteilen von 0..1 wandert."""
    n = int(round(d * FPS))
    zz = f"({z0}+({z1}-{z0})*on/{n})"
    cx = f"({cx0}+({cx1}-{cx0})*on/{n})"; cy = f"({cy0}+({cy1}-{cy0})*on/{n})"
    kb = (f"[0:v]scale=3840:-2,zoompan=z='{zz}':x='iw*{cx}-iw/zoom/2':y='ih*{cy}-ih/zoom/2':d={n}:s=1920x1080:fps={FPS},"
          f"trim=duration={d}[s];")
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', bild, '-filter_complex', kb + layout('[s]'),
                    '-map', '[v]', '-frames:v', str(n), '-c:v', 'libx264', '-crf', '17', '-preset', 'slow', '-r', str(FPS), name], check=True)

nur = sys.argv[1:]  # optional: nur bestimmte Clips bauen
plan = [
    ('c1_aufbau.mp4',   lambda n, d: aus_bildern(n, 4.0, d, tempo=2.0)),
    ('c2_eingang.mp4',  lambda n, d: aus_bildern(n, 24.0, d)),
    ('c3_keller.mp4',   lambda n, d: aus_bildern(n, 29.5, d)),
    ('c4_dach.mp4',     lambda n, d: aus_bildern(n, 35.6, d)),
    ('c5_hof.mp4',      lambda n, d: aus_bildern(n, 48.0, d)),
    ('c6_stufen.mp4',   lambda n, d: aus_standbild(n, '../out/schnitt/stufen_gesamt.png', d, 1.0, 1.25, 0.5, 0.5, 0.45, 0.42)),
    ('c7_altbau.mp4',   lambda n, d: aus_standbild(n, '../out/chef/14_hoehe_altbau.jpg', d, 1.0, 1.18, 0.5, 0.5, 0.42, 0.45)),
    ('c8_parken.mp4',   lambda n, d: aus_bildern(n, 59.4, d)),
    ('c9_schluss.mp4',  lambda n, d: aus_bildern(n, 72.0 - d - 0.05, d)),
]
for i, (n, f) in enumerate(plan):
    if nur and n not in nur:
        continue
    f(n, dur[i]); print(n, dur[i])
