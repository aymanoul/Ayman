# Phase 5 – Ton (begonnen)

## Geräusche (fertig, selbst erzeugt)

`python3 tools/sfx.py` erzeugt alle Effekte synthetisch nach `assets/sfx/` (48 kHz, mono). Keine fremden Dateien,
keine Musik, keine Melodien, keine Vogelstimmen. Hörprobe: `out/phase5/geraeusche-hoerprobe.mp3`
(Reihenfolge wie unten, je 0,6 s Pause).

| Datei | Einsatz laut Drehbuch |
| --- | --- |
| whoosh, whoosh_kurz | Schnitte im Hook, Karte fährt ein |
| pop | Karte erscheint |
| impact | Q5 (Saqar) |
| papier | optional bei Karten |
| schritte_gehweg_eilig / _ruhig | B auf der Straße / A |
| schritte_teppich | in der Moschee, Reihe bildet sich |
| tuer | Eintritt in die Moschee |
| stoff | Hand auf die Schulter, Hinsetzen, Aufstehen |
| schuhe_ins_regal | S13 |
| strasse | Teil 1–2 (leise) |
| raumklang_moschee | Teil 3–5 (sehr leise) |
| uhr_ticken | S18, S33 |
| wasser | S39–S42 (Fluss) |
| waage_klacken | S31 (Waage) |
| grollen | S24 (Glutschimmer) |

Mischung später: Stimmen vorn, Geräusche etwa 15–20 dB leiser, Adhan aus der offenen Tür gedämpft (Tiefpass + Hall),
Endmix −14 LUFS.

## Noch ausstehend (von Ayman)

- ElevenLabs: **eine Datei für A, eine für B** (Zeilen laut `docs/phase3-drehbuch.md`, mit 0,5 s Pause zwischen den Zeilen).
  Schneiden an den Pausen, Zuordnung zu A01…/B01… per Spracherkennung (z. B. faster-whisper).
- Adhan und Iqāma als echte Aufnahmen.
