# Blender-Plan: Gebetsraum als fester Drehort

Ziel: Der Gebetsraum der Masjid As-Sunnah steht als **Blender-Datei** bereit, komplett per Code gebaut.
In diesem Raum entstehen künftig die Videos – ebenfalls per Code (Kamera, Figuren, Bewegung, Licht).
Es gelten alle festen Regeln aus `UEBERGABE.md` (keine Augen, kein KI-Generator für Figuren und Räume usw.).

## Stand

| Schritt | Inhalt | Stand |
|---|---|---|
| B0 | Technik: Blender 5.2.3 (`bpy`) läuft hier, Cycles und EEVEE getestet | ✅ |
| B1 | Raum nach der Vorlage (7 Ansichten) bauen, Kontroll-Ansichten rendern | ✅ von Ayman freigegeben („Passt so“, 15.11.2026) |
| B2 | Figuren A, B, Imam, Nebenfiguren in Blender (ohne Augen), mit Gelenken | offen |
| B3 | Bewegungen: Gehen, Sitzen, Gebetshaltungen, Sprechen (Mund nach Tonspur) | offen |
| B4 | Video-Baukasten: Einstellungen als Liste (Kamera, Figuren, Dauer), Untertitel und Karten wie bisher | offen |
| B5 | Rendern in Abschnitten, Zusammenbau mit Ton (ffmpeg, −14 LUFS) | offen |

## B1 – Was im Raum gebaut ist

Vorlage: `assets/ref/gebetsraum_vorlage_7_ansichten.png` (Frontansicht, Rückansicht, linke/rechte Seite, zwei Diagonalen, Eingang).
Maße wie im bisherigen Projekt: 10 m breit, 12 m tief, 3,4 m hoch. Die Qibla-Wand liegt bei y = +6.

- **Hülle:** Teppich in Türkis mit Mäanderband pro Gebetsreihe (alle 1,28 m), Wände unten gefliest (beige, bis 1,5 m)
  mit rotbraunem Streifen, oben weiß verputzt, Sockelleisten in Teppichfarbe, Decke mit Unterzügen.
- **Qibla-Wand:** Mihrab-Nische mit Halbkuppel und goldenem Aufsatz, Tafel mit der Schahāda, Wanduhr, zwei Regale mit
  grünen Büchern, zwei Fenster, Gebetsteppich des Imams, Mikrofon, Steckdosen, Minbar rechts.
- **Seiten und hinten:** je zwei Fenster mit Milchglas, Regale, Stuhlreihe, vier geflieste Säulen, Schild „Handy aus“,
  graue Eingangstür mit Notausgang-Schild (nur Pfeil und Tür, keine Figur), Fußmatte, Flur hinter der Tür.
- **Licht:** 12 runde Deckenleuchten und Tageslicht aus 6 Fenstern.
- **Beweglich:** `Tuerblatt` (dreht am Scharnier), `Uhr_Stundenzeiger`, `Uhr_Minutenzeiger`.
- **Orte für Figuren:** `Ort_mihrab`, `Ort_reihe`, `Ort_sitzA`, `Ort_sitzB`, `Ort_tuer`.
- **Kameras:** `Kamera_1` bis `Kamera_7` (die sieben Ansichten) und `Kamera_Video_Hochformat` (9:16).

Abweichungen von der Vorlage (bewusst): Die Vorlage widerspricht sich zwischen den Ansichten (Lage von Tür, Stühlen,
Minbar). Gebaut ist die Anordnung des bisherigen, freigegebenen Raums: Tür in der Rückwand rechts, Stühle an der
linken Wand hinten, Minbar vorn rechts. Vier Säulen in der hinteren Raumhälfte.

## Dateien

| Datei | Zweck |
|---|---|
| `blender/raum.py` | baut den Raum und speichert `blender/gebetsraum.blend` (Texturen eingepackt) |
| `blender/ansichten.py` | rendert die Kontroll-Ansichten nach `out/blender/` |
| `blender/kamerafahrt.py` | Test-Video: Fahrt von der Tür zum Mihrab |
| `tools/blender_tex.mjs` | malt die Schahāda-Tafel (arabische Schrift braucht den Browser) |
| `blender/tex/` | erzeugte Texturen (Teppich, Fliesen, Milchglas, Gebetsteppich, Schilder, Tafel) |

## Einrichten und Befehle

```bash
cd gebet-video
python3 -m venv .venv-blender && .venv-blender/bin/pip install bpy==5.2.3 numpy    # einmalig, ca. 400 MB
apt-get update && apt-get install -y --no-install-recommends libegl1 libgl1-mesa-dri libgles2   # nur für EEVEE
node tools/blender_tex.mjs                           # Tafel-Textur
.venv-blender/bin/python blender/raum.py             # Raum bauen → blender/gebetsraum.blend
.venv-blender/bin/python blender/ansichten.py        # 7 Ansichten + Hochformat
.venv-blender/bin/python blender/kamerafahrt.py      # Test-Video
```

Die Datei `blender/gebetsraum.blend` lässt sich auch in einem normalen Blender (ab 5.2) öffnen und von Hand ansehen.

## Rechenzeit (hier, ohne Grafikkarte, 4 Kerne)

| Art | Auflösung | Zeit pro Bild |
|---|---|---|
| Cycles, 24 Samples, entrauscht | 576 × 384 | ca. 11 s |
| Cycles, 64 Samples, entrauscht | 960 × 640 | ca. 70 s |
| Cycles, 16 Samples, entrauscht (Test-Video) | 540 × 960 | ca. 19 s |
| EEVEE (Software-Grafik) | 1080 × 1920 | ca. 32 s |

Ein Video von 2:30 Minuten in voller Auflösung braucht damit rund 40 Stunden (EEVEE). Wege, das zu verkürzen:
halbe Auflösung rendern und hochskalieren, 24 statt 30 Bilder pro Sekunde, stehende Einstellungen nur einmal rendern,
oder die `.blend`-Datei auf einem Rechner mit Grafikkarte rendern (dort Sekunden statt Minuten).
Zum Vergleich: Die bisherige Three.js-Lösung braucht für dasselbe Video etwa 2 Stunden.

## Offene Entscheidung

Wie künftige Videos gerechnet werden (kurze Blender-Tests, Blender in halber Auflösung oder weiter Three.js):
Ayman überlegt noch („Ich überlege es mir“, 15.11.2026). **Bis dahin nicht mit B2 (Figuren) anfangen.**
