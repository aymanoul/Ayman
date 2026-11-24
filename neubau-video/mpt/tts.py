import json, subprocess, wave, sys
P = '/home/user/harry0703/moneyprinterturbo/.venv/bin/piper'
M = '/home/user/tts_modelle/de_DE-thorsten-high.onnx'
s = json.load(open('saetze.json'))
d = []
for i, (_, t) in enumerate(s):
    f = f'satz_{i:02d}.wav'
    subprocess.run([P, '-m', M, '--length-scale', '1.08', '--sentence-silence', '0', '-f', f], input=t.encode(), check=True, capture_output=True)
    with wave.open(f) as w:
        d.append(round(w.getnframes() / w.getframerate(), 2))
print(d, sum(d))
json.dump(d, open('dauer.json', 'w'))
