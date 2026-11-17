#!/bin/sh
# Rohschnitt fortsetzen (idempotent): Blender-Berechnung neu starten, falls sie steht; sind alle Bilder da → zusammenbauen.
cd "$(dirname "$0")/.." || exit 1
FPS=12
ZIEL=$(python3 -c "import json;print(int(round(json.load(open('audio/zeitplan.json'))['dauer']*$FPS)))")
FERTIG=$(ls out/roh 2>/dev/null | grep -c '^f_.*\.png$')
if pgrep -f "blender/film.py --von 0 --bis 62" >/dev/null; then echo "läuft: $FERTIG/$ZIEL"; exit 0; fi
if [ "$FERTIG" -lt "$ZIEL" ]; then
  nohup sh -c ".venv-blender/bin/python blender/film.py --von 0 --bis 62 --fps $FPS --breite 480 --samples 6 --aus out/roh >> out/roh_log.txt 2>&1" >/dev/null 2>&1 &
  echo "gestartet bei $FERTIG/$ZIEL"; exit 0
fi
if [ ! -f out/phase3/rohschnitt_720p.mp4 ]; then python3 tools/rohschnitt.py --fps $FPS > out/rohschnitt_log.txt 2>&1; fi
echo "FERTIG"
