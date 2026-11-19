#!/bin/sh
# Phase 4: Animatic (Variante B, 0–45 s, 15 fps) rendern, fortsetzbar. Aufruf aus neubau-video/:  sh tools/animatic_weiter.sh
PY=../iqama-video/.venv-blender/bin/python
ZIEL=675
if pgrep -f "blender/animatic.py --kamera" >/dev/null; then echo "läuft: B $(ls out/phase4/anim_B 2>/dev/null | wc -l)/$ZIEL"; exit 0; fi
B=$(ls out/phase4/anim_B 2>/dev/null | wc -l)
if [ "$B" -ge "$ZIEL" ]; then echo "FERTIG: Bilder vollständig"; exit 0; fi
nohup $PY blender/animatic.py --kamera B --von 0 --bis 45 --fps 15 --breite 360 --samples 4 --aus out/phase4/anim_B >> out/phase4/render_log.txt 2>&1 &
echo "neu gestartet bei B $B/$ZIEL"
