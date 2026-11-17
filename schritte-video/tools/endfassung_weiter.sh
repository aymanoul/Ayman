#!/bin/sh
# Endfassung fortsetzen (idempotent): startet die Blender-Berechnung neu, falls sie nicht läuft (fertige Bilder werden
# übersprungen); sind alle Bilder da, wird das Video zusammengebaut. Gedacht für den stündlichen Weckruf.
cd "$(dirname "$0")/.." || exit 1
ZIEL=$(python3 -c "import json;print(int(round(json.load(open('audio/zeitplan.json'))['dauer']*30)))")
FERTIG=$(ls out/end 2>/dev/null | grep -c '^f_.*\.png$')
if pgrep -f "blender/film.py --von 0" >/dev/null; then
  echo "läuft: $FERTIG/$ZIEL Bilder"; exit 0
fi
if pgrep -f "tools/vorschau.py" >/dev/null; then echo "Zusammenbau läuft"; exit 0; fi
if [ "$FERTIG" -lt "$ZIEL" ]; then
  nohup sh -c ".venv-blender/bin/python blender/film.py --von 0 --bis 64 --fps 30 --breite 720 --samples 10 --aus out/end >> out/end_log.txt 2>&1 && \
    python3 tools/vorschau.py --roh out/end --fps 30 --hoehe 1920 --aus out/schritte_video.mp4 && \
    python3 tools/vorschau.py --roh out/end --fps 30 --hoehe 1280 --aus out/schritte_video_vorschau_720p.mp4" > out/endschnitt_log.txt 2>&1 &
  echo "neu gestartet bei $FERTIG/$ZIEL Bildern"; exit 0
fi
if [ ! -f out/schritte_video_vorschau_720p.mp4 ]; then
  nohup sh -c "python3 tools/vorschau.py --roh out/end --fps 30 --hoehe 1920 --aus out/schritte_video.mp4 && \
    python3 tools/vorschau.py --roh out/end --fps 30 --hoehe 1280 --aus out/schritte_video_vorschau_720p.mp4" > out/endschnitt_log.txt 2>&1 &
  echo "alle Bilder da – Zusammenbau gestartet"; exit 0
fi
echo "FERTIG: out/schritte_video.mp4"
