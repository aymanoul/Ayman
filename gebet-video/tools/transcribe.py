#!/usr/bin/env python3
"""Spracherkennung mit Wort-Zeitmarken (faster-whisper) → JSON.
    python3 tools/transcribe.py assets/audio/roh/stimme_A.mp3 assets/audio/transkript/A.json
"""
import json, subprocess, sys
import numpy as np
from faster_whisper import WhisperModel

src, dst = sys.argv[1], sys.argv[2]
model = WhisperModel('small', device='cpu', compute_type='int8')
pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-ac', '1', '-ar', '16000', '-f', 's16le', '-'], capture_output=True, check=True).stdout
audio = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768
lang = sys.argv[3] if len(sys.argv) > 3 else 'de'
segs, info = model.transcribe(audio, language=lang, word_timestamps=True, vad_filter=False, beam_size=5)
out = []
for s in segs:
    out.append({'start': s.start, 'end': s.end, 'text': s.text.strip(),
                'words': [{'w': w.word.strip(), 'start': w.start, 'end': w.end} for w in s.words]})
    print(f'{s.start:7.2f}–{s.end:7.2f}  {s.text.strip()}', flush=True)
json.dump(out, open(dst, 'w'), ensure_ascii=False, indent=1)
