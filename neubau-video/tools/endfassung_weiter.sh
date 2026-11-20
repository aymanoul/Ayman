#!/bin/sh
# Phase 5: Endfassung rendern (Variante B, 0–60 s, 30 fps, 720×1280, Cycles 10 Samples), fortsetzbar; danach automatisch
# zusammensetzen (tools/endfassung.py → out/neubau_drohne.mp4). Aufruf aus neubau-video/:  sh tools/endfassung_weiter.sh
PY=../iqama-video/.venv-blender/bin/python
ZIEL=1800
if pgrep -f "blender/animatic.py --kamera B --von 0 --bis 60" >/dev/null; then echo "läuft: $(ls out/phase5/end 2>/dev/null | wc -l)/$ZIEL"; exit 0; fi
if pgrep -f "tools/endfassung.py" >/dev/null; then echo "Zusammenbau läuft"; exit 0; fi
N=$(ls out/phase5/end 2>/dev/null | wc -l)
if [ "$N" -ge "$ZIEL" ] && [ -f out/neubau_drohne.mp4 ]; then echo "FERTIG: out/neubau_drohne.mp4"; exit 0; fi
nohup sh -c "$PY blender/animatic.py --kamera B --von 0 --bis 60 --fps 30 --breite 720 --samples 10 --aus out/phase5/end >> out/phase5/render_log.txt 2>&1 && python3 tools/endfassung.py >> out/phase5/render_log.txt 2>&1" >/dev/null 2>&1 &
echo "neu gestartet bei $N/$ZIEL"
