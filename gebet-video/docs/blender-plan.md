# Blender-Plan: Drehorte und Hauptpersonen

Ziel: Gebetsraum, Gebäude von außen und die zwei Hauptpersonen stehen als **Blender-Dateien** bereit, komplett per Code gebaut.
Damit entstehen künftig die Videos – ebenfalls per Code (Kamera, Figuren, Bewegung, Licht).
Es gelten alle festen Regeln aus `UEBERGABE.md` (keine Augen, kein KI-Generator für Figuren und Räume usw.).

## Stand

| Schritt | Inhalt | Stand |
|---|---|---|
| B0 | Technik: Blender 5.2.3 (`bpy`) läuft hier, Cycles und EEVEE getestet | ✅ |
| B1 | Raum nach der Vorlage (7 Ansichten) bauen, Kontroll-Ansichten rendern | ✅ von Ayman freigegeben („Passt so“, 15.11.2026) |
| B1b | Gebäude von außen nach der Vorlage (6 Ansichten): Altbau, Glas-Verbindungsbau, Neubau mit Kuppeln, Vorplatz | ✅ gebaut, wartet auf Freigabe |
| B2 | Hauptpersonen A und B, je zwei Outfits (Qamis · Hemd und Hose), ohne Augen, mit Skelett zum Bewegen | ✅ gebaut, wartet auf Freigabe |
| B2b | Imam und Nebenfiguren | offen |
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

## B1b – Gebäude von außen (zweiter Drehort)

Vorlage: `assets/ref/gebaeude_vorlage_6_ansichten.png`. Datei: `blender/gebaeude.py` → `blender/gebaeude.blend`.
Achsen: Die Hauptfassade liegt bei y = 0 und schaut nach −Y (zum Vorplatz); man geht in Richtung +Y hinein –
dieselbe Richtung wie im Gebetsraum (Tür hinten, Qibla vorn). Der Haupteingang (linkes Portal) liegt bei x = 0.

- **Neubau (rechts):** helle Putzfassade, zwei vorspringende Portale mit Spitzbogenfenster, Ornamentfeld und Glastür,
  dazwischen zwei Spitzbogenfenster in dunklen Feldern, verglastes Erdgeschoss, Flachdach mit einer großen und zwei
  kleinen Glaskuppeln, schlankes Minarett. Über dem Haupteingang das Schild „Masjid As-Sunnah“.
- **Verbindungsbau (Mitte):** zwei Fensterbänder aus blauem Glas, Erdgeschoss offen als Durchfahrt mit Stützen.
- **Altbau (links):** Putzbau mit dunklem Satteldach, weiße Fenster, Gaube.
- **Umgebung:** gepflasterter Vorplatz, Straße, Rasen, Bäume, Poller, vier parkende Autos (seitlich geparkt,
  Scheinwerfer als Lichtband – nichts soll wie ein Gesicht wirken).
- **Beweglich:** die Flügel der Glastür am Haupteingang (`Tuer_Haupt_links`, `Tuer_Haupt_rechts`).
- **Licht:** Sonne und Himmel. **Kameras:** die sechs Ansichten der Vorlage + `Kamera_Video_Hochformat`.

## B2 – Hauptpersonen

Vorlagen: `assets/ref/figuren_vorlage_qamis.png`, `assets/ref/figuren_vorlage_hemd_hose.png`.
Datei: `blender/figuren.py` → `blender/figuren.blend` (vier Sammlungen, je eine Figur mit eigenem Skelett).

| Figur | Outfit 1 | Outfit 2 |
|---|---|---|
| **A** – weiße Kufi, langer voller schwarzer Bart | weißer Qamis mit Stehkragen, Knopfleiste, Brusttasche, schwarze Schuhe | weißes Hemd, weite schwarze Hose, weiße Sneaker |
| **B** – schwarze Locken, kurzer gepflegter Bart | dunkelgrüner Qamis, schwarze Schuhe | dunkelgrünes Hemd, cremefarbene Hose, weiße Sneaker |

- **Gesicht:** wie in der Vorlage glatt – keine Augen, keine Brauen. Ohren, Bart und Haare sind da.
- **Körper:** normale Proportionen (nicht mehr der große Low-Poly-Kopf), glatte Formen.
- **Skelett:** Hüfte, Wirbelsäule, Brust, Hals, Kopf, Schultern, Ober-/Unterarme, Hände, Ober-/Unterschenkel, Füße.
  Kleidung und Körper hängen am Skelett und biegen sich mit (Gewichte per Code).
- **Kontrolle:** Figurenblatt wie die Vorlage (vorn, Seite, hinten, Kopf nah) + eine Bewegungsprobe (Gehen, Grüßen).

## Dateien

| Datei | Zweck |
|---|---|
| `blender/raum.py` | baut den Raum und speichert `blender/gebetsraum.blend` (Texturen eingepackt) |
| `blender/ansichten.py` | rendert die Kontroll-Ansichten nach `out/blender/` |
| `blender/kamerafahrt.py` | Test-Video: Fahrt von der Tür zum Mihrab |
| `blender/gebaeude.py` | baut das Gebäude von außen → `blender/gebaeude.blend` |
| `blender/figuren.py` | baut die Hauptpersonen → `blender/figuren.blend` |
| `blender/blaetter.py` | Figurenblätter (`out/blender/figurenblatt_qamis.jpg`, `_hemd.jpg`) und Bewegungsprobe (`figuren_posen.jpg`) |
| `blender/ansichten.py --datei gebaeude` | Kontroll-Ansichten des Gebäudes → `out/blender/gebaeude_ansichten.jpg` |
| `blender/szene_test.py --ort gebaeude\|gebetsraum` | holt die Figuren an einen Drehort (Probe-Standbild) |
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
Ayman überlegt noch („Ich überlege es mir“, 15.11.2026). Gebäude und Hauptpersonen hat er inzwischen ausdrücklich
beauftragt („bald werden Videos gebaut“) – die Frage der Rechenzeit ist damit aber noch nicht entschieden.

## Stand 15.11.2026 – Gebäude und Hauptpersonen

- **Gebäude:** `blender/gebaeude.blend` (404 Teile). Neubau mit Portalen, Spitzbogenfenstern, Ornamentfeldern, verglastem EG,
  drei Glaskuppeln und Minarett, Schild „Masjid As-Sunnah“ (Logo + Schrift) über dem Haupteingang, Vorraum hinter der Glastür.
  Verbindungsbau mit Fensterbändern und Durchfahrt, Altbau mit Satteldach und Gaube, Vorplatz, Straße, Bäume, 4 Autos
  (Licht als durchgehendes Band, nichts wirkt wie ein Gesicht). Rechenzeit: ca. 15–20 s pro Bild (960 × 640, 48 Samples).
- **Figuren:** `blender/figuren.blend` – Sammlungen `A_Qamis`, `A_Hemd`, `B_Qamis`, `B_Hemd`, jede mit Skelett `<Name>_Skelett`.
  Glattes Gesicht mit Nase und Ohren, keine Augen, keine Brauen. Mund kommt mit B3 (Sprechen).
  Posen per `figuren.pose(skelett, {'Oberarm.R': (-12, 0, 62), …})`. Der Qamis-Rock folgt den Beinen zur Hälfte.
- **Zusammenspiel:** `blender/szene_test.py` hängt Figuren an einen Drehort an (`bpy.data.libraries.load`) –
  Proben `out/blender/szene_gebaeude.png` und `szene_gebetsraum.png`.
- **Noch offen:** Mund (Sprechen), Hände mit Fingern (für Gebetshaltungen), Gesichtsausdruck nur über Kopfhaltung,
  Imam und Nebenfiguren (B2b), Bewegungsabläufe (B3), Video-Baukasten (B4).
