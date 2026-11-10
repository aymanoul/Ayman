# Phase 0 – Sichten und Techniktest

## Gesichtetes Material

- **Beispielvideo** (TikTok-Bildschirmaufnahme, 15 s, in 60 Einzelbildern alle 0,25 s durchgesehen)
- **Foto 1**: Gebetsraum mit Säulen, Stapelstühlen, „Handy verboten“-Schild
- **Foto 2**: Qibla-Wand mit Mihrab, Kalligraphie-Tafel, Wandleuchte, Uhr, Regalen, Tisch, Roll-up, Minbar
- **Logo**: aus `aymanoul/masjid-sunnah/public/brand/` nach `assets/brand/` kopiert

## Der Stil des Beispielvideos

1. Low-Poly-3D wie aus Blender: Figuren aus wenigen, kantigen, flach schattierten Flächen, mit großem Kopf
   und klobigen Haaren.
2. Die Welt drumherum ist dagegen detailreich und kräftig bunt: Holzmaserung, Beschriftungen, viele
   Gegenstände, weiche Schatten, warmes Licht.
3. Sehr schneller Schnitt: in 15 Sekunden etwa 8 Einstellungen, also alle 1,5–3 Sekunden ein neues Bild.
   Dazwischen ständig Bewegung: Kamerafahrt, schneller Zoom, Gegenstände fallen oder poppen ins Bild.
4. Die Perspektiven wechseln stark: nah am Gesicht, Halbtotale von der Seite, Detail auf einen Gegenstand,
   Blick von schräg oben.
5. Untertitel: 1–3 Wörter gleichzeitig, fette runde Schrift, weiß mit dunkler Kontur, das gerade
   gesprochene Wort gelb. Immer auf derselben Höhe, etwa bei zwei Dritteln der Bildhöhe.
6. Oben steht in den ersten Sekunden eine weiße Titelzeile mit dunkler Kontur (2–3 Zeilen).
7. Begriffe werden zu Gegenständen: Kisten mit Aufschrift, ein Schild, Sprechblasen mit Fragezeichen.
   Wichtige Wörter poppen zusätzlich als farbige Etiketten auf.
8. Gefühl entsteht dort vor allem über große Augen. **Bei uns fällt das weg**: Wir arbeiten mit Kopfhaltung,
   Mund, Schultern, Händen und Kamera.

## Technik-Vergleich

| Weg | Ergebnis |
| --- | --- |
| Three.js + Headless-Chromium + ffmpeg | funktioniert, **0,9 s pro Bild** bei 1080×1920 (gemessen am 5-Sekunden-Clip: 150 Bilder in 137 s) |
| Blender (bpy 5.2, Cycles, ohne Grafikkarte) | Download 403 MB in knapp 6 Minuten, rund 27 s pro Bild bei einer Minimal-Szene → verworfen |

Hochrechnung für 2:30 Minuten (4500 Bilder): Three.js rund 70 Minuten, Blender über 30 Stunden.

## Was ich an der Renderzeit gelernt habe

Der erste Versuch mit allen Effekten „in echt“ brauchte 5,5 s pro Bild. Gemessen (nur Rendern, pro Bild):

| Baustein | Kosten | Entscheidung |
| --- | --- | --- |
| Grundbild mit Licht und Schatten | ca. 0,6 s | bleibt |
| Kantenglättung (MSAA 4×) | fast nichts im Direktmodus | bleibt |
| Weiche Schatten (VSM) mit 2048er-Karte, 16 Proben | +1,0 s | auf 1024er-Karte, 8 Proben: kaum sichtbar anders, fast kostenlos |
| Ambient Occlusion (GTAO), volle Auflösung | +2,7 s | ersetzt durch eingebackene Kontaktschatten unter Figuren und Säulen und Verläufe in den Wandtexturen |
| Bloom | +0,4 s | ersetzt durch Leuchtflächen an den Fenstern |
| Seiten-Screenshot | +1,0 bis 1,6 s | ersetzt durch direktes Auslesen des Bildes als JPEG (0,3 s) |

Die echten Effekte lassen sich für einzelne Standbilder weiter zuschalten (`--ao --bloom`), z. B. für das Titelbild.
Zwei parallele Worker bringen nur wenig (0,98 → 0,89 s), weil das Software-Rendering schon alle Kerne nutzt.

## Was der Techniktest zeigt

- Gebetsraum im Grundaufbau: Teppich mit Mäanderbändern, Fliesen mit rostrotem Band, weißer Putz,
  Säulen, Mihrab-Nische, Kalligraphie-Tafel (echte Schrift, korrekt verbunden), Milchglasfenster.
- Zwei Platzhalterfiguren (A weißer Qamis mit Kufi und Vollbart, B blauer Qamis mit kurzem Bart),
  **ohne Augen**: zwischen Nase und Haaransatz ist nur glatte Haut.
- Ein Schnitt (Halbtotale → über die Schulter), langsame Kamerafahrt, Mundbewegung, Geste, Nicken, Atmen.
- Titelzeile und Wort-für-Wort-Untertitel innerhalb der sicheren Bereiche.

Dateien: `out/phase0/` (Clip, zwei Standbilder, Bild mit sicheren Bereichen, Kontaktbogen alle 0,5 s).

## Was noch Platzhalter ist (kommt in Phase 1 und 2)

- Hände (im Moment einfache Klötze), Faltenwurf und Saum des Qamis, Sitzhaltung, Gangbild.
- Kufi-Muster, Hauttöne, Bartlängen, Augenbrauen ja/nein.
- Raumdetails: Uhr mit Zifferblatt, Regale mit Büchern, Tisch, Minbar, Roll-up, Stühle, Schild,
  Mikrofone, genaue Maße und Fensterpositionen, Lichtkegel.
