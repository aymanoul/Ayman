import json, subprocess
d = json.load(open('dauer.json')); s = json.load(open('saetze.json'))
VOR, NACH = 0.8, 1.8
PAUSE = [0.45, 0.7, 0.7, 0.7, 0.7, 0.7, 0.5, 0.7, 0.9, 0.5, 0.0]
starts, t = [], VOR
for i, x in enumerate(d):
    starts.append(round(t, 3)); t += x + PAUSE[i]
gesamt = round(t + NACH, 3)
# Tonspur: Stille + Saetze an exakten Zeitpunkten (adelay), dann normalisieren
inp = []; flt = []
for i in range(len(d)):
    inp += ['-i', f'satz_{i:02d}.wav']
    ms = int(starts[i] * 1000)
    flt.append(f'[{i}:a]aresample=44100,adelay={ms}|{ms}[a{i}]')
mix = ''.join(f'[a{i}]' for i in range(len(d)))
flt.append(f'{mix}amix=inputs={len(d)}:normalize=0,apad,atrim=0:{gesamt},loudnorm=I=-16:TP=-1.5:LRA=7,aresample=44100[out]')
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error'] + inp + ['-filter_complex', ';'.join(flt), '-map', '[out]', '-ac', '2', 'sprecher.wav'], check=True)
# SRT (exakt aus den Satzzeiten)
def ts(x):
    h = int(x // 3600); m = int(x % 3600 // 60); sec = x % 60
    return f'{h:02d}:{m:02d}:{int(sec):02d},{int(round((sec - int(sec)) * 1000)):03d}'
with open('untertitel.srt', 'w') as f:
    for i, (txt, _) in enumerate(s):
        f.write(f'{i+1}\n{ts(starts[i])} --> {ts(starts[i] + d[i] + min(PAUSE[i], 0.3))}\n{txt}\n\n')
json.dump({'starts': starts, 'dauer': d, 'gesamt': gesamt}, open('zeiten.json', 'w'))
print(starts, gesamt)
