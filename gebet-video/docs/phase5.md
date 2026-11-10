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

## Eingang der Tonspuren (10.11.2026) – Befund

Dateien: `assets/audio/roh/` (stimme_A.mp3 162 s, stimme_B.mp3 43 s, adhan_bildschirmaufnahme.wav 11,6 s,
iqama_bildschirmaufnahme.wav 22,4 s). Transkripte mit Wort-Zeitmarken: `assets/audio/transkript/*.json`
(`tools/transcribe.py`, faster-whisper „small“, Modell von huggingface.co – Hosts in der Umgebung „Ayman“ freigegeben).

**Die Stimmen folgen NICHT dem freigegebenen Drehbuch (`docs/phase3-drehbuch.md`), sondern einem anderen Text:**
- A: Hook gleich, dann eigener Ablauf (Q1 4:103, H1 „zu seiner Zeit“, H2, **Maryam 19:59**, „Das Erste … am Tag der
  Auferstehung … ist sein Gebet. Ist es in Ordnung, hat er Erfolg … im Verlust“ (= Abū-Huraira-Fassung at-Tirmidhī 413,
  **nicht geprüft**), **ʿUmar: „Wer das Gebet verlässt, hat keinen Anteil am Islam“ (Sahaba – entfällt, nicht geprüft)**,
  Fluss-Hadith, Hoffnung, Schluss „Der nächste Adhan wartet auf dich“).
- B: 12 andere Sätze (u. a. „Gibt es dazu auch einen Vers im Quran?“, „Ich bin oft so müde und abgelenkt“, „Ich bin bereit.
  Von heute an zu seiner Zeit. InshaAllah.“).
- Gesamt A 162 s + B 43 s ≈ 3:25 reine Sprechzeit → deutlich über 2:30.
- Mögliche Aussprachefehler laut Spracherkennung (bitte anhören): „Kuffer“ (Kufr), „Irama“ (Iqāma), „Awan“ (Adhan) am Ende.

**Adhan/Iqāma:** Bildschirmaufnahmen von YouTube (Adhan: Omar Hisham Al Arabi, nur das erste „Allāhu akbar“, 11,6 s;
Iqāma: Kanal @rachidfilali_Ta-Amal, endet nach „Allāhu akbar, Allāhu akbar“ – das abschließende „Lā ilāha illa-llāh“ fehlt).
Fremde Aufnahmen → vor Veröffentlichung Erlaubnis klären oder eigene Aufnahme der Moschee verwenden.
