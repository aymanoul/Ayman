# Plan: Video „Jeder Schritt zählt“ (ca. 60–65 s)

Auftrag von Ayman (16.11.2026), Sprecher-Aufnahme `assets/audio/roh/stimme_helmut.mp3` (ElevenLabs, 64,8 s).
Alle festen Regeln aus `gebet-video/CLAUDE.md` gelten unverändert (keine Augen, keine Brauen, keine Musik, Prophet ﷺ /
Sahaba / Engel nie als Figur, Hadithe wörtlich mit Quelle, kein KI-Bildgenerator, alles 3D per Code).
Nach jeder Phase stoppen, Vorschau schicken, Freigabe abwarten.

## 1. Eckdaten

- 9:16, 1080 × 1920, 30 fps, Ziel 60–65 s, Ton −14 LUFS. Keine Endkarte.
- **Look: das neue Blender-Design** (Aymans ausdrücklicher Wunsch): Gebäude außen aus `gebet-video/blender/gebaeude.py`
  (Variante **ohne Autos**, warmes Licht am späten Nachmittag, lange Schatten), Figuren aus `gebet-video/blender/figuren.py`:
  **A = `A_Qamis`** (weißer Qamis, Kufi, voller Bart), **B = `B_Hemd`** (grünes Hemd, cremefarbene Hose – passt zum jungen
  Mann mit Handy). Innen nur der letzte Blick durch die offene Tür (Vorraum, dahinter Gebetsraum-Teppich).
- **Einblendungen** (Handy-Display, Zähler, Untertitel, Karten, Schlusssatz, Logo, Gebetsnamen, Wudu-Symbol) mit dem
  bestehenden Baukasten aus `gebet-video/web/lib/overlay.js` und dem Karten-Stil aus dem Gebet-Video: im Browser als
  durchsichtige Bildfolge gerendert und mit ffmpeg über die Blender-Bilder gelegt. Das Gebet-Video bleibt unverändert
  (nur lesen/importieren, nichts darin ändern).
- KEINE Autos, KEIN Thema Auto/Fahren. Keine Aussage, dass andere Wege weniger wert sind.

## 2. Was in Blender noch fehlt (wird in Phase 2–3 gebaut)

| Baustein | Umsetzung |
|---|---|
| Mund zum Sprechen | schlichter Mund (Form-Keys „zu/halb/offen“), gesteuert von der Lautstärke-Hüllkurve jeder Zeile – keine Augen |
| Gehen | Geh-Zyklus als Schlüsselbilder aus der Posen-Bibliothek (Beine, Arme, leichtes Wippen), Figur bewegt sich entlang eines Pfads |
| Handy | einfaches Gerät in Bs Hand, Display als Bild (eigenes Design, Moscheefarben, keine echte App, keine Emojis) |
| Fußabdrücke | schlichte Sohlenform als leuchtende Fläche, abwechselnd gold/weiß, erscheinen synchron zum Zähler, glimmen nach |
| Fünf Wege (S9) | Draufsicht, fünf leuchtende Bänder aus fünf Richtungen zur Moschee, nacheinander an; Namen als Einblendung |
| Tür | Glastür des Haupteingangs öffnet sich (vorhanden: `Tuer_Haupt_links/rechts`) |
| Licht | Sonne tief, warm (später Nachmittag), Himmel wärmer |

## 3. Ablauf und Rechenzeit

- Shots als Liste (Kamera, Figuren, Bewegung, Dauer) in `blender/shots.py`; Zeitplan aus den echten Tonlängen.
- Rendern mit Cycles auf der CPU (keine Grafikkarte hier). Schätzung: ca. 8–12 s pro Bild in 720 × 1280 →
  3D-Anteil (~55 s = 1650 Bilder) ≈ 4–5 Stunden, in Abschnitten im Hintergrund. Endfassung auf 1080 × 1920 hochskaliert
  (oder direkt 1080 × 1920, wenn die Zeit reicht). Rohschnitt (Phase 3) schneller in 540 × 960 mit wenig Samples.
- S1 (Handy-Display) ist reine Grafik, S9 (Draufsicht) wenige bewegte Teile – beides schnell.

## 4. Ton

- Aymans Datei enthält **alle 12 Zeilen in einer Datei**: zuerst A01–A07, danach B01–B05 (Transkript
  `assets/audio/transkript/helmut.json`). Zerlegen mit `gebet-video/tools/split_voices.py`-Verfahren in A01–A07, B01–B05.
- Geräusche: Schritte auf Gehweg/Pflaster, leiser Außenton, dezenter Ton beim Hochzählen, Türgeräusch. Keine Musik.

## 5. Phasen (nach jeder stoppen)

| Phase | Inhalt | Stand |
|---|---|---|
| 1 | Beweisliste H1/H2 prüfen, Wortlaut bestätigen (`docs/phase1-beweisliste.md`) | ✅ erstellt, wartet auf Freigabe |
| 2 | Storyboard: 11 Standbilder auf einem Blatt + Handy-Display und Zähler als Einzelbild | offen |
| 3 | Stimmen zerlegen, Zeitplan, Rohschnitt 720p ohne Feinheiten | offen |
| 4 | Zähler, Fußabdrücke, fünf Wege, Karten, Untertitel, Geräusche; Vorschau 720p | offen |
| 5 | Endfassung 1080 × 1920, Schlussprüfung, 2 Titelbilder, Beschreibung mit genau 5 deutschen Hashtags | offen |

## 6. Shotliste (Richtzeiten, später an die Tonlängen angepasst)

S1 0–4 Hook Handy-Display, Zähler läuft bis „8.432“ · S2 4–8 Kamera zieht auf, B auf dem Gehweg mit Handy (B01) ·
S3 8–13 A am Vordach, geht neben B, Schuss/Gegenschuss (A02, B02) · S4 13–16 nah A (A03) · S5 16–31 Kernbild: zwei Zähler,
seitliche Fahrt, B geht vom Gehweg über den Hof zur Tür, leuchtende Fußabdrücke, Karte H1 (A04) · S6 31–34 nah B, Blick auf
die Füße (B03) · S7 34–41 Draufsicht Hof, Spur, Karte H2 (A05) · S8 41–45 Handy: 8.432 und die neuen Zähler fast null (B04) ·
S9 45–53 Totale von oben, fünf Wege, Gebetsnamen, Wudu-Symbol (A06) · S10 53–58 B steckt Handy ein, geht neben A zur Tür (B05) ·
S11 58–64 beide gehen durch die Tür, Abdrücke leuchten nach (A07), Schlusssatz „Jeder Schritt zur Moschee zählt.“,
klein „Muslim 666 · Muslim 251“.

## 7. Abgabe

`out/schritte_video.mp4` (voll), Vorschau 720p, Titelbild, Beschreibung als Textdatei. Projektgedächtnis
(`gebet-video/CLAUDE.md`) und `gebet-video/UEBERGABE.md` ergänzen, committen, pushen (Zweig `claude/exciting-planck-xjdkte`).
