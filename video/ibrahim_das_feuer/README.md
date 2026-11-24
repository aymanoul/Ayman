# Spur der Propheten – „Ibrahim – Das Feuer“

Vertikales Kurzvideo 1080x1920, 30 fps. Nur Python, ffmpeg, Pillow, numpy
(+ faster-whisper für Wortzeiten, onnxruntime für Real-ESRGAN).

## Ablauf
```
./setup.sh                          # Schriften, Pakete, Upscaler-Modell
# 20 Dateien nach assets/ legen (siehe inhalt.py: ASSETS_AUDIO, ASSETS_IMG)
python3 make_video.py check         # prüft, ob alles da ist
python3 make_video.py prep          # Bilder hochskalieren, Tonspur, Wortzeiten, Mischung
python3 make_video.py test          # out/test_0-12s.mp4
python3 make_video.py full          # out/ibrahim_das_feuer.mp4, cover, srt, kontrollblatt
```
Fehlen Dateien, baut das Skript mit abstrakten Platzhaltern (Farbverläufe) und
geschätzten Zeiten ohne Ton; die Ausgaben tragen dann `_PLATZHALTER` im Namen.

## Dateien
- `inhalt.py` – alle Texte (exakt nach Vorgabe), Schlüsselwörter, Asset-Liste
- `tonspur.py` – Zusammensetzen, Stille-Trim, Whisper/silencedetect-Zeiten, SFX-Mischung, loudnorm -14 LUFS / -1 dBTP
- `bild.py` – Upscaling, Bewegung, Partikel, Farblook, Textebenen
- `textlib.py` – Textsatz inkl. Arabisch (RAQM, RTL)
- `make_video.py` – Zeitplan, paralleles Rendern, Cover, SRT, Kontrollblatt, Prüfungen
