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

- **Entscheidung 16.11.:** B wird **neu aufgenommen** (andere, jüngere Stimme, B01–B05) – Ayman liefert. A bleibt („Helmut“).
  **B trägt Hemd und Hose** (bestätigt).

- Aymans Datei enthält **alle 12 Zeilen in einer Datei**: zuerst A01–A07, danach B01–B05 (Transkript
  `assets/audio/transkript/helmut.json`). Zerlegen mit `gebet-video/tools/split_voices.py`-Verfahren in A01–A07, B01–B05.
- Geräusche: Schritte auf Gehweg/Pflaster, leiser Außenton, dezenter Ton beim Hochzählen, Türgeräusch. Keine Musik.

## 5. Phasen (nach jeder stoppen)

| Phase | Inhalt | Stand |
|---|---|---|
| 1 | Beweisliste H1/H2 prüfen, Wortlaut bestätigen (`docs/phase1-beweisliste.md`) | ✅ **freigegeben** (16.11.) |
| 2 | Storyboard: 11 Standbilder auf einem Blatt + Handy-Display und Zähler als Einzelbild | ✅ **freigegeben** (16.11., mit neuem Hook S1) |
| 3 | Stimmen zerlegen, Zeitplan, Rohschnitt 720p ohne Feinheiten | ✅ A01–A07 + **B01–B05 als Platzhalter** (alte Helmut-Zeilen, Ayman: „mit Platzhalter anfangen“), Zeitplan 65,5 s, Mund, `blender/film.py`; **Rohschnitt fertig** `out/phase3/rohschnitt_720p.mp4` (15 Bilder/s gerendert, 540 × 960 → 720p, ~1,5 h), **freigegeben** (16.11.) |
| 4 | Zähler, Fußabdrücke, fünf Wege, Karten, Untertitel, Geräusche; Vorschau 720p | ✅ Vorschau `out/phase4/vorschau_720p.mp4` **freigegeben** (16.11.) |
| 5 | Endfassung 1080 × 1920, Schlussprüfung, 2 Titelbilder, Beschreibung mit genau 5 deutschen Hashtags | in Arbeit: neue B-Stimme (Jörg) eingebaut → 63,7 s; Logo entfernt (Aymans Wunsch); 3D rendert in 720 × 1280, 30/s (Ayman: „720p, 30 Bilder/s“) nach `out/end`, dann hochskaliert; Titelbilder + `docs/phase5-beschreibung.md` fertig |

## 6. Shotliste (Richtzeiten, später an die Tonlängen angepasst)

S1 0–4 Hook (geändert 16.11. auf Aymans Wunsch): B geht mit dem Handy auf die Moschee zu, über die Schulter gesehen,
Moschee im Hintergrund; daneben vergrößert der Handy-Bildschirm (feine Goldlinie zum Handy), Zähler läuft bis „8.432“ · S2 4–8 Kamera zieht auf, B auf dem Gehweg mit Handy (B01) ·
S3 8–13 A am Vordach, geht neben B, Schuss/Gegenschuss (A02, B02) · S4 13–16 nah A (A03) · S5 16–31 Kernbild: zwei Zähler,
seitliche Fahrt, B geht vom Gehweg über den Hof zur Tür, leuchtende Fußabdrücke, Karte H1 (A04) · S6 31–34 nah B, Blick auf
die Füße (B03) · S7 34–41 Draufsicht Hof, Spur, Karte H2 (A05) · S8 41–45 Handy: 8.432 und die neuen Zähler fast null (B04) ·
S9 45–53 Totale von oben, fünf Wege, Gebetsnamen, Wudu-Symbol (A06) · S10 53–58 B steckt Handy ein, geht neben A zur Tür (B05) ·
S11 58–64 beide gehen durch die Tür, Abdrücke leuchten nach (A07), Schlusssatz „Jeder Schritt zur Moschee zählt.“,
klein „Muslim 666 · Muslim 251“.

## 7. Abgabe

`out/schritte_video.mp4` (voll), Vorschau 720p, Titelbild, Beschreibung als Textdatei. Projektgedächtnis
(`gebet-video/CLAUDE.md`) und `gebet-video/UEBERGABE.md` ergänzen, committen, pushen (Zweig `claude/exciting-planck-xjdkte`).

## 8. Technik-Stand (Phase 2)

- `blender/szene.py`: lädt `gebet-video/blender/gebaeude.blend`, entfernt Autos, Licht später Nachmittag, Vordach über dem
  Haupteingang, holt `A_Qamis` und `B_Hemd` aus `figuren.blend`, Handy am Knochen `Hand.R`, Fußspur (Sohlenform,
  abwechselnd gold/weiß, Leuchtstärke je Abdruck), fünf Wege (leuchtende Kurven), Geh-Pose `geh_pose(phase)`, Posen
  `HANDY_HALTEN`, `AUF_FUESSE`, `ERKLAEREN`, Kamera-Helfer, `bildpunkt()` für Beschriftungen.
- `blender/storyboard.py` → `out/phase2/3d_S2…S11.png` (540 × 960, 24 Samples, ca. 6–10 s pro Bild).
- `web/overlay.js` + `web/overlay.html` + `web/cards.js`: Einblendungen (Display, Zähler, Karten H1/H2, Untertitel Stil b,
  Schilder, Wudu, Schlusssatz, Logo) – nutzt `gebet-video/web/lib/overlay.js` (nur lesen).
- `tools/overlay.mjs` (Chromium rendert Ebenen als PNG), `tools/storyboard.py` (Ebenen + Zusammenbau + Blätter).
- Befehle: `cd schritte-video && ln -sfn ../gebet-video/.venv-blender .venv-blender`;
  `.venv-blender/bin/python blender/storyboard.py --samples 24 --breite 540`; `python3 tools/storyboard.py`.
- Karte H1: Arabisch nur der Kernsatz „كَانَتْ خَطْوَتَاهُ …“, Deutsch vollständig (A04). Steht ein Zähler oben und eine
  Karte unten, steht der Untertitel unter der Karte (y 1450).

## 9. Technik-Stand (Phase 3)

- `tools/zerlegen.py` schneidet an der leisesten Stelle zwischen Zeilen (Startzeiten aus dem Transkript, optional `t:fenster`).
  Aufruf für die Helmut-Datei: `python3 tools/zerlegen.py assets/audio/roh/stimme_helmut.mp3 x A01,…,B05 0.0,6.24,9.58,14.74,28.4:0.4,37.40,44.20,49.36,52.98,56.22,58.74,61.90`
- Transkripte je Zeile: `assets/audio/transkript/zeilen/<Zeile>.json` (0,5 s Stille vorangestellt, Zeiten −0,5 s).
- `tools/zeitplan.py` → `assets/audio/zeilen/lines.json` (Dauer, Mund-Hüllkurve, Wortzeiten) und `audio/zeitplan.json`
  (Shots S1–S11, Stimmen; Pause 0,25 s, Schluss +2,6 s). Gesamtlänge mit Platzhalter-B: **65,5 s**.
- Mund: `szene.mund()` / `mund_auf()` – flache dunkle Ellipse am Knochen „Kopf“ (A vor dem Bart), öffnet nach Lautstärke.
- `blender/film.py --von --bis --fps --breite --samples --aus`: stellt jedes Bild nach Zeitplan (Gehen, Kamerafahrten,
  Schuss/Gegenschuss in S3, Spur wächst mit Bs Schritten, Wege leuchten nacheinander, Tür öffnet), überspringt fertige Bilder.
  ~5,6 s/Bild bei 540 × 960, 8 Samples (persistente Daten an).
- `tools/rohschnitt.py`: Bilder + Stimmen → `out/phase3/rohschnitt_720p.mp4`.
- **Wenn die neue B-Aufnahme kommt:** transkribieren, mit `zerlegen.py` in B01–B05 schneiden, je Zeile transkribieren,
  `zeitplan.py` neu, betroffene Shots neu rendern.
- Merkpunkte aus der Prüfung des Rohschnitts: Mund von A rötlich, in Seitenansicht (S4) wie ein Fleck → dunkler und flacher;
  sonst keine Augen/Brauen sichtbar, Bewegungen und Schnitte wie geplant. Lautheit −15 LUFS (Endfassung zweistufig auf −14).

## 10. Technik-Stand (Phase 4)

- `blender/film.py --punkte`: rendert nichts, schreibt je Bild (30/s) Shot, Gehphasen, Zahl sichtbarer Abdrücke und den
  Bildpunkt des Handys (S1) → `audio/punkte.json` (~2 min). Grundlage für Einblendungen und Schritt-Geräusche.
- `tools/einblendungen.py`: Zustände je Bild → `out/phase4/zustaende.json`, rendert `out/phase4/ebenen/f_*.png`
  (gleiche Zustände werden kopiert, ~15 min). Untertitel Wort für Wort (Gruppen + ﷻ wie im Gebet-Video), S1 Titel statt
  Untertitel, Handy-Lupe folgt dem Handy, Zähler = sichtbare Abdrücke (gold ungerade = Sünde, weiß = Rangstufe; Ende 9/8),
  Karte H1 ab A04+0,4 s, H2 ab „Viele“ (A05), S8 Handy-Grafik 8.432 mit 9/8, S9 Gebetsnamen nacheinander + Wudu ab „Mach“,
  Schlusssatz nach A07 mit „Muslim 666 · Muslim 251“.
- `tools/ton.py` → `out/phase4/ton.wav`: Stimmen, Schritte beim Aufsetzen der Füße, Klick je Abdruck, Wischer (Karten,
  Handy, Wege), Tür + Raumklang in S11, Außenton (Wind/Blätter, keine Autos). Bausteine aus gebet-video (nur gelesen).
- `tools/vorschau.py`: 3D (out/roh, 15/s) + Ebenen + Ton, Weichzeichner in S8, Lautheit zweistufig −14 LUFS.
- Reihenfolge nach neuer B-Aufnahme: zeitplan.py → film.py (betroffene Bilder) → film.py --punkte → einblendungen.py → ton.py → vorschau.py.

## 11. Phase 5

- **Neue B-Stimme** (16.11.): `assets/audio/roh/stimme_B_joerg.mp3` (ElevenLabs „Jörg M.“, 13,6 s), zerlegt mit
  `python3 tools/zerlegen.py assets/audio/roh/stimme_B_joerg.mp3 x B01,B02,B03,B04,B05 0.0,3.46,6.16,8.30,11.08`, Text Wort für Wort wie Drehbuch.
  Zeitplan neu: **63,7 s**.
- **Kein Logo** mehr im Bild (Ayman 16.11.: „das Logo … weg machen“).
- Mund A: dunkler (#24100e), flacher, tiefer im Bart (`vor=0.018`) → in Seitenansicht kein Fleck mehr.
- Endfassung: `.venv-blender/bin/python blender/film.py --von 0 --bis 64 --fps 30 --breite 720 --samples 10 --aus out/end`
  (~15 s/Bild, ~8 h), danach `python3 tools/vorschau.py --roh out/end --fps 30 --hoehe 1920 --aus out/schritte_video.mp4`
  und `… --hoehe 1280 --aus out/schritte_video_vorschau_720p.mp4`.
- Titelbilder `out/phase5/titelbild_variante1.png` (Hof, Zähler, „Jeder Schritt zählt.“), `…variante2.png` (offene Tür,
  „Wohin führen deine Schritte?“). Beschreibung `docs/phase5-beschreibung.md` (#moschee #gebet #islam #muslime #ratingen).
