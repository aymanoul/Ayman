# nursimuliert – Low-Poly-Videos für TikTok

Emotionale Low-Poly-3D-Simulationen ohne Sprecher, 1080 × 1920, 30 fps, H.264.
Die Geschichte steht komplett in **`story/shots.json`**. Für ein neues Video
tauschst du nur diese Datei aus (oder legst eine neue an und übergibst sie
dem Build).

## Oberste Regel: keine Augen

Keine Figur hat Augen – kein Augapfel, keine Pupille, kein Lid, kein Strich und
kein Punkt im Augenbereich. Unter den Augenbrauen ist nur glatte Haut.
Gefühle laufen über Brauen (Winkel/Höhe), Mund, Kopf, Hände und Haltung.

* Die Brauen sitzen hoch an der Stirn, sind gerade, laufen spitz zu und sind
  innen leicht angehoben („/ \“). Gerade oder gebogene Striche in Augenhöhe
  wirken wie geschlossene Augen und sind deshalb verboten (getestet, siehe
  `src/character.js`, Konstante `FACE`).
* `node render.mjs check` prüft Quelltext und Szene: kein Objekt darf
  `eye`, `pupil`, `iris`, `lid` oder `lash` im Namen tragen.

## Befehle

```bash
npm install                 # einmalig (three 0.160.0, esbuild, playwright, Schriften)
node build.mjs              # bündelt nach dist/ (Story: story/shots.json)
node build.mjs story/neu.json   # ... oder eine andere Story-Datei

node render.mjs sheet       # Figuren vorn/seitlich/hinten -> out/figuren.jpg, out/koepfe.jpg
node render.mjs preview     # ein Bild pro Einstellung   -> out/vorschau.jpg
node render.mjs preview --n 3 --shots 2,4   # Anfang/Mitte/Ende einzelner Einstellungen
node render.mjs stills 1.5 11.0             # einzelne Zeitpunkte -> out/stills/
node render.mjs check       # Augen-Namen, Text im sicheren Bereich, Determinismus
node render.mjs frames      # alle Frames -> frames/00000.png ... (ca. 2,5 s pro Frame)
node render.mjs video       # ffmpeg -> out/video.mp4, out/cover.jpg (1,5 s), out/kontaktbogen.jpg
```

`render.mjs` startet bei Bedarf selbst `npx http-server dist -p 8080 -s`.
Gerendert wird deterministisch: Die Seite stellt `window.renderAt(t)` bereit,
das Figuren, Kamera, Zähler und Untertitel für Zeitpunkt `t` setzt und genau
einen Frame zeichnet. Danach macht Playwright einen PNG-Screenshot (1080 × 1920).
Zufall (Bäume, Büsche, Filmkorn) kommt nur aus festen Seeds.

## Aufbau

| Datei | Inhalt |
|---|---|
| `story/shots.json` | **Die Story**: Titel, Zähler, Zeitsprung, Figuren, Einstellungen |
| `src/main.js` | Szene, Licht, Nachbearbeitung (ACES, Bloom, Bokeh, SMAA, Vignette, Korn), `renderAt` |
| `src/timeline.js` | Keyframes, Gangzyklus, IK-Ziele, Kamera |
| `src/character.js` | Figurenbaukasten (Playmobil-Stil), Posen-Bibliothek `POSES`, Gesicht `FACE` |
| `src/props.js` | Fahrrad, Auto, Umzugskarton |
| `src/sets/*.js` | Orte: `park` (Parkweg), `driveway` (Einfahrt) + gemeinsame Bausteine |
| `src/overlay.js`, `src/style.css` | Texte als HTML/CSS über dem Canvas |
| `render.mjs` | Playwright-Rendering, Prüfungen, ffmpeg |
| `tools/anchors.mjs` | Planungshilfe: Weltposition von Ankern zu einem Zeitpunkt |

## Die Story-Datei (`story/shots.json`)

```jsonc
{
  "meta": { "fps": 30, "width": 1080, "height": 1920, "duration": 31.5 },
  "title": { "lines": ["Zeile 1", "Zeile 2"], "highlight": "Goldwort", "start": 0, "end": 3.2, "fadeOut": 0.4 },
  "counters": [   // Zähler oben links; ab "start" gilt der jeweilige Eintrag
    { "start": 0, "label": "BIS ER LOSLÄSST", "from": 30, "to": 0,
      "countStart": 0, "countEnd": 11.0, "line3": "18:42 UHR", "line4": "DU BIST 6" }
  ],
  "timeskip": { "lines": ["12 JAHRE", "SPÄTER"], "start": 20.0, "end": 21.8, "dim": 0.62, "hideCounter": true },
  "fadeOut": { "start": 30.8, "end": 31.5 },
  "cast": { ... },   // Figuren und Requisiten
  "shots": [ ... ]   // Einstellungen
}
```

### Figuren (`cast`)

```jsonc
"papa": {
  "type": "person", "build": "adult",          // adult | teen | child
  "skin": "#e8b48e",
  "hair": { "color": "#3a2618", "style": "short" },   // style: short | receding, "tuft": true
  "top": { "type": "sweater", "color": "#2f6f5e" },   // sweater | tshirt | hoodie
  "bottom": { "type": "jeans", "color": "#2b3a55" },  // jeans | shorts
  "shoes": "#6b4428",
  "beard": { "color": "#9b9b9b" },      // optional
  "glasses": { "color": "#38383d" },    // optional, hinter den Gläsern nur Haut
  "helmet": "#2f6fd0",                  // optional
  "stoop": 0.6                          // optional, leicht gebeugt (ältere Figuren)
}
```
Requisiten: `{ "type": "bike", "color": ... }`, `{ "type": "car", "color": ... }`, `{ "type": "box" }`.

### Einstellungen (`shots`)

```jsonc
{
  "id": 4, "start": 9.5, "end": 13.0,
  "set": "park",                  // park | driveway
  "light": "evening",             // evening | morning | night
  "camera": {
    "fov": 30, "rel": "papa",     // rel: Kamera-Keys relativ zur Figur (Mitfahrt)
    "focus": "papa:handL",        // Bokeh-Fokus auf einen Anker oder eine Distanz in m
    "aperture": 0.003, "maxblur": 0.009,
    "keys": [ { "t": 0, "pos": [x, y, z], "look": [x, y, z] }, { "t": 3.5, ... } ]
  },
  "shadow": { "follow": "papa", "size": 6 },   // Schattenbereich
  "actors": {
    "rad":  { "path": "main", "keys": [ { "t": 0, "s": 24.5, "wobble": 0.3 }, { "t": 3.5, "s": 34.4 } ] },
    "kind": { "mount": "rad:seat", "keys": [ { "t": 0, "pose": "ride", "ikFL": "rad:pedalL", ... } ] },
    "papa": { "path": "main", "keys": [
      { "t": 0, "s": 23.8, "off": -0.34, "pose": "runBent", "ikL": "rad:saddleBack", "run": 0.85 },
      { "t": 2.6, "ikLw": 0, "shL": 56, "thumbL": 1 }
    ] }
  },
  "subtitle": "bei null hat er losgelassen."     // oder { "text": ..., "end": 30.8 }
}
```

* **Zeiten in Keys** sind relativ zum Beginn der Einstellung.
* **Platzierung**: entweder auf einem Pfad des Ortes (`"path"`, `s` = Meter entlang
  des Weges, `off` = seitlicher Versatz, + links) oder frei (`"p": [x, z]`, `"h"` =
  Blickrichtung in Grad, 0 = +Z). Positionen werden weich interpoliert;
  `"hold": true` = Anfahren/Abbremsen aus dem Stand.
* **Posen**: `"pose": "name"` aus `POSES` in `src/character.js`
  (`stand`, `standRelaxed`, `bentHold`, `runBent`, `reachRun`, `handsOnKnees`,
  `handsInPockets`, `waveHalf`, `ride`, `sitDrive`, `carryBox`). Einzelne Gelenke
  lassen sich direkt im Key überschreiben (Grad): `lean`, `spine`, `headPitch`,
  `headYaw`, `shL/shR` (Arm vor), `abL/abR` (Arm seitlich), `elL/elR` (Ellbogen),
  `wrL/wrR`, `thumbL/thumbR`, `hipL/hipR`, `kneeL/kneeR`, `y`.
  Zwischen Keys wird weich (Ease-in-out) überblendet.
* **Gesicht**: `browIn` (+ Innenenden hoch = weich/traurig), `browUp` (Brauen hoch),
  `smile` (−1…1), `open` (Mund offen), `press` (Lippen zusammen), `talk` (spricht),
  `tearL/tearR` (Träne 0…1).
* **Gehen/Rennen**: `walk`, `run` (0…1). Die Schrittphase folgt dem zurückgelegten Weg.
* **IK** (Hand/Fuß an einen Punkt): `ikL`, `ikR`, `ikFL`, `ikFR` mit einem Anker
  `"figur:punkt"`, `{ "local": [x,y,z] }` (relativ zur Figur) oder Gewicht `ikLw` usw.
  `look`: Kopf schaut zu einem Anker.
* **Anker**: Personen `head`, `face`, `chest`, `pelvis`, `handL`, `handR`, `root`;
  Fahrrad `seat`, `saddle`, `saddleBack`, `saddleRear`, `gripL/R`, `pedalL/R`;
  Auto `driver`, `driverHead`, `trunk`, `hatchEdge`; Karton `sideL`, `sideR`.
* Requisiten-Werte: `wobble` (Rad wackelt), `lean`, `hatch` (Heckklappe 0…1), `y`.

Tippfehler in Feldnamen, unbekannte Posen oder Orte brechen den Build mit einer
Meldung ab, statt still falsch zu rendern.

## Texte und sicherer Bereich

Rechts ab x = 900 und unten ab y = 1480 steht nie Text (TikTok-Buttons und
Beschreibung). `render.mjs check` misst alle Textzeilen alle 0,1 s nach.
Titel 74 px (Cormorant Garamond 500, Oberkante 170), Zähler bei x 48 / y 700,
Untertitel 50 px kursiv mit Grundlinie bei y 1140, Zeitsprung 84 px bei x 48 / y 720.

**Zeitsprung und Zähler:** Beide stehen laut Vorgabe an derselben Stelle
(x 48, y 700 bzw. 720). Damit sich die Texte nicht überlagern, blendet der
Zähler für die Dauer des Zeitsprungs kurz aus, der Zeitsprung-Text erscheint an
seinem Platz, danach kommt der Zähler mit Teil 2 zurück (`"hideCounter": true`).

## Neue Orte

Ein Ort ist eine Funktion in `src/sets/<name>.js`, die `{ root, paths, lamps, sun, sky }`
zurückgibt, und wird in `SET_BUILDERS` in `src/main.js` eingetragen. Bausteine
(Bäume, Laterne, Zaun, Bank, Himmel, Wege) liegen in `src/sets/common.js`.
