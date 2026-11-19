#!/usr/bin/env python3
"""Phase 4: Animatic zusammensetzen → out/phase4/animatic_B.mp4 (720 × 1280, 15 fps, 45 s, ohne Ton).
Ayman 19.11.: Variante B, KEIN Text im Video (macht er später selbst).
    python3 tools/animatic.py
"""
import os
import shutil
import subprocess
import tempfile
from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
P4 = os.path.join(ROOT, 'out', 'phase4')
FPS, N = 15, 675

def vorbereiten(src, dst):
    """Ayman 19.11.: absolut kein Text im Video – nur hochskalieren."""
    Image.open(src).convert('RGB').resize((720, 1280), Image.LANCZOS).save(dst)


for variante in ('B',):
    tmp = tempfile.mkdtemp()
    for n in range(N):
        vorbereiten(os.path.join(P4, 'anim_B', f'f_{n:05d}.png'), os.path.join(tmp, f'b_{n:05d}.png'))
    aus = os.path.join(P4, f'animatic_{variante}.mp4')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-framerate', str(FPS), '-i', os.path.join(tmp, 'b_%05d.png'),
                    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-movflags', '+faststart', aus], check=True)
    shutil.rmtree(tmp)
    print('fertig:', os.path.relpath(aus, ROOT))
