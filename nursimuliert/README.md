# nursimuliert – Low-Poly-Videos für TikTok

Emotionale Low-Poly-3D-Simulationen, 1080 × 1920, 30 fps, MP4 (H.264 + AAC).
Die Geschichte steht komplett in **`story/shots.json`** (Sprechertext, Titel, Zähler,
Figuren, Einstellungen). Für ein neues Video tauschst du nur diese Datei aus.

## Oberste Regel: keine Augen

Keine Figur hat Augen – kein Augapfel, keine Pupille, kein Lid, kein Strich, kein Bogen
und kein Punkt im Augenbereich. Unter den Augenbrauen ist nur glatte Haut. Auch keine
Brillen (die Ringe wirken wie Augen). Gefühle laufen über Brauenwinkel, Mund, Kopf,
Hände und Haltung.

* Brauen sitzen bei 57 % des Kopfradius über der Kopfmitte, direkt unter dem Haaransatz,
  kurz, dick und fast gerade (`FACE` in `src/character.js`).
* `node render.mjs check` prüft Quelltext und Szene: kein Objekt heißt `eye`, `pupil`,
  `iris`, `lid` oder `lash`.

## Ablauf

```bash
npm install                       # three 0.160.0, esbuild, playwright, Schriften
npm run stimme:setup              # einmalig: .venv-stimme mit Chatterbox + faster-whisper
                                  # (braucht Zugriff auf pypi.org und huggingface.co)

# 1) Stimme: Referenz vorbereiten, 12 Sätze x 3 Versionen erzeugen und prüfen, zusammensetzen
.venv-stimme/bin/python tools/stimme.py alles pfad/zur/stimmprobe.m4a
#    -> audio/referenz.wav, audio/saetze/satz_XX.wav, audio/stimme.wav (-16 LUFS),
#       audio/transkript.json (Wortzeiten), audio/hinweise.txt

# 2) Bild und Ton bauen, prüfen, rendern
node build.mjs                    # Zeiten aus audio/transkript.json -> dist/
node render.mjs frame             # Bildausschnitt-Optimierer (schreibt camera.adjust), danach erneut bauen
node render.mjs check             # alle Prüfungen
node render.mjs export            # out/untertitel.srt, out/abgleich.txt, out/bewegung.json
python3 tools/ton.py              # Geräusche + Endmischung -> out/mix.wav
node render.mjs frames            # frames/%05d.jpg (ca. 1 s pro Frame ohne Grafikkarte)
node render.mjs video             # out/video.mp4, out/cover.jpg, out/kontaktbogen.jpg
```

**Fertige Aufnahmen statt Klon (z. B. ElevenLabs):** 12 Dateien in Satz-Reihenfolge übergeben.
Wenn faster-whisper sein Modell nicht laden kann, richtet das Skript den bekannten Text am
Signal aus (Pausen, Hüllkurven-Minima, erwartete Wortlängen).

```bash
.venv-stimme/bin/python tools/sprachspur.py importieren satz01.mp3 ... satz12.mp3
.venv-stimme/bin/python tools/sprachspur.py zusammensetzen    # audio/stimme.wav + audio/transkript.json
```

Einzelne Sätze austauschen: eine andere Version nach `audio/saetze/satz_XX.wav`
kopieren, dann `tools/stimme.py zusammensetzen` und ab Schritt 2 neu bauen.

Ohne Stimme (kein `audio/transkript.json`) rechnet `build.mjs` mit einem **Entwurf**
aus geschätzten Satzlängen. Das Bild trägt dann oben die rote Marke
„ENTWURF · ZEITEN GESCHÄTZT · OHNE STIMME“. So lassen sich Bild und Geräusche schon
vorher prüfen (`--out out/vorschau_ohne_stimme.mp4` beim `video`-Befehl).

## Zeitachse aus der Stimme

* Jede Einstellung gehört zu einem Satz (`"sentence"`) und beginnt 0,25 s vor dessen erstem
  Wort; zwischen zwei Sätzen bleibt die Einstellung stehen. Einstellungen ohne Satz
  (`"sentence": null`) laufen nach dem vorigen Satz (`"afterSentence"`, `"minDuration"`).
* Zeiten in Keys: Zahl (Sekunden ab Einstellungsbeginn), `"end"`, `"end-0.3"`, `"40%"`,
  `"@null"` (Beginn des Wortes im Satz der Einstellung), `"@losgelassen+1.1"`, `"@4:null"`.
* Zähler: `zeroAt: { sentence, word }` – die Zahl erreicht 0:00 genau beim Beginn des Wortes
  und wächst dann 0,4 s lang kurz auf 114 %. `hold` + `countFromShot` für „steht auf 0:20,
  zählt ab Einstellung 10“.
* Untertitel = Sprechertext (`script[].display` oder kleingeschriebener `text`), ein Untertitel
  pro Satz, über 2 Zeilen an Komma oder Pause > 0,25 s geteilt; ein 0,08 s vor dem ersten Wort,
  aus 0,25 s nach dem letzten (spätestens 0,05 s vor dem nächsten), 0,15 s Blenden.
* Videolänge = Ende des letzten Wortes + 2 s; letzte Sekunde Abblende (Bild und Ton).

## Ton

`tools/ton.py` erzeugt alle Geräusche selbst (numpy/scipy, fester Seed, keine Musik, keine
Stimmen): Vögel, Wind in den Bäumen, ferner Spielplatz ohne Worte, Freilauf-Ticken, Reifen
auf Kies, Schritte im Takt der Gangphase, Ausatmen, Klingel, Whoosh, Haustür, Stoffrascheln,
Autotüren, Gurt, Motorstart, Blinker, Motor und Reifen nach Tempo, Fensterhebermotor,
Fahrtwind, Doppelhupen, ferner Rasenmäher. Gesteuert wird alles von der Bewegungsspur des
Renderers (`out/bewegung.json`) und von `sfx` in den Einstellungen. Beim Zeitsprung ist es
völlig still. Mischung: Stimme Hochpass 80 Hz, Kompression −20 dB 3:1, −16 LUFS; Geräusche
während der Stimme −9 dB (0,15 s Übergänge); Ende `loudnorm I=-14:TP=-1.5:LRA=11`, 48 kHz Stereo.

## Texte und TikTok-Bereiche

Nie Text in: oben y 0–280, rechts ab x 920 (y 700–1580), unten ab y 1480.
Gesichter, Hände und der Führerschein liegen nie unter den Untertiteln (y 1130–1300), nie
hinter dem Zähler (x 96–440, y 690–900) und nie in den TikTok-Bereichen.

* `node render.mjs preview` zeigt jede Einstellung mit rot umrandeten TikTok-Bereichen.
* `node render.mjs check` misst Texte (alle 0,1 s), Gesichter/Hände/Führerschein mit
  Verdeckungstest (alle 0,2 s; Hinterköpfe zählen nicht als Gesicht), den Titelkontrast
  (WCAG, mind. 4,5 : 1 gegen Bild + Verlaufsstreifen), Untertitel Wort für Wort, den Zähler
  bei „null“/„losgelassen“ und den Determinismus.
* `node render.mjs frame [ids]` sucht je Einstellung Schwenk/Neigung/Abstand
  (`camera.adjust`), damit alles frei liegt; `camera.must` hält Pflichtpunkte im Bild,
  `camera.solve` begrenzt den Suchraum.

## Logo für TikTok

```bash
node tools/logo.mjs stills        # Standbilder
node tools/logo.mjs alles         # zusätzlich 4-s-Schleife als MP4 und GIF
```

Figur im dunkelblauen Anzug (weißes Hemd, gelbe Krawatte), ohne Augen, im goldenen Ring auf
hellem Elfenbein-Hintergrund. Unten schneidet der Kreis die Figur ab, oben ragt der Kopf über den Ring. In der
Schleife hebt die Figur die rechte Hand und winkt mit offener Handfläche zur Kamera.
Szene: `src/logo/` (Pose und Kamera in `logo.js`), Anzug: `top.type: 'suit'` in `src/character.js`.

| Datei | Zweck |
|---|---|
| `out/logo/profilbild.png` | 1080 × 1080, Profilbild (TikTok zeigt es rund, alles liegt im Kreis) |
| `out/logo/profilbild_ruhig.png` | Profilbild ohne Winken |
| `out/logo/logo_mit_schrift.png` | Figur + Schriftzug „nursimuliert“ (Intro, Endkarte, andere Kanäle) |
| `out/logo/logo_animiert.mp4` / `.gif` | 4-s-Schleife, 30 fps (TikTok-Profilbilder selbst sind immer Standbilder) |
| `out/logo/pruefung_kreis.png` | Profilbild mit rotem Kreis = Ausschnitt in der App |

## Aufbau

| Datei | Inhalt |
|---|---|
| `story/shots.json` | **Die Story**: Sprechertext, Titel, Zähler, Zeitsprung, Figuren, Einstellungen |
| `tools/zeitplan.mjs` | Wortzeiten -> absolute Zeiten (Einstellungen, Untertitel, Zähler, Länge) |
| `tools/stimme.py` | Stimmprobe, Chatterbox-Klon, faster-whisper-Prüfung, Sprachspur, Transkript |
| `tools/sprachspur.py` | fertige Satz-Aufnahmen importieren, Sprachspur (-16 LUFS), Wortzeiten per Signal-Ausrichtung |
| `tools/ton.py` | Geräusche und Endmischung |
| `src/main.js` | Szene, Licht, Nachbearbeitung, `renderAt(t)`, Prüf- und Optimierfunktionen |
| `src/timeline.js` | Keyframes, Gangzyklus, IK, Einsteigen (Sitzpunkt-Versatz), Kamera |
| `src/character.js` | Figurenbaukasten (Playmobil-Stil), Posen, Gesicht ohne Augen |
| `src/props.js` | Fahrrad, Auto (Beifahrertür, Fenster, Innenraum, Haltegriff), Führerschein, Karton |
| `src/sets/*.js` | Orte: `park` (Parkweg + Allee-Straße), `driveway` (Einfahrt, Haustür) |
| `src/overlay.js`, `src/style.css` | Titel, Zähler, Untertitel, Zeitsprung als HTML/CSS |
| `render.mjs` | Playwright-Rendering, Prüfungen, Export, ffmpeg |

Gerendert wird deterministisch: `window.renderAt(t)` setzt alles für den Zeitpunkt `t`
(reine Funktion der Zeit, daher sofort „eingeschwungen“) und zeichnet genau einen Frame.
Ohne Grafikkarte: Canvas mit Faktor 0,75, auf 1080 × 1920 gestreckt, Texte in voller
Auflösung darüber, kein Bokeh, Schattenkarten 1024, Frames als JPEG (Qualität 93).
