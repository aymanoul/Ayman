#!/bin/sh
# Phase 4: Animatic-Bildfolgen rendern (fortsetzbar). Aufruf aus neubau-video/:  sh tools/animatic_weiter.sh
PY=../iqama-video/.venv-blender/bin/python
if pgrep -f "blender/animatic.py --kamera" >/dev/null; then echo "läuft: A $(ls out/phase4/anim_A 2>/dev/null | wc -l)/630, B $(ls out/phase4/anim_B 2>/dev/null | wc -l)/60"; exit 0; fi
A=$(ls out/phase4/anim_A 2>/dev/null | wc -l); B=$(ls out/phase4/anim_B 2>/dev/null | wc -l)
if [ "$A" -ge 630 ] && [ "$B" -ge 60 ]; then echo "FERTIG: Bilder vollständig"; exit 0; fi
nohup sh -c "$PY blender/animatic.py --kamera A --von 0 --bis 42 --fps 15 --breite 360 --samples 4 --aus out/phase4/anim_A && \
  $PY blender/animatic.py --kamera B --von 0 --bis 4 --fps 15 --breite 360 --samples 4 --aus out/phase4/anim_B" >> out/phase4/render_log.txt 2>&1 &
echo "neu gestartet bei A $A/630, B $B/60"
