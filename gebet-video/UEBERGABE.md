# Übergabe: Gebet-Video „Die Wichtigkeit des Gebets“ (Masjid As-Sunnah Ratingen)

> **So benutzt du diese Datei:** Kopiere den ganzen Inhalt als erste Nachricht in den neuen Chat.
> Der neue Chat soll danach ohne Rückfragen genau hier weitermachen.

---

## 0. Anweisung an den neuen Chat (zuerst lesen)

1. Du übernimmst ein laufendes Projekt. Alles, was bisher entschieden und gebaut wurde, steht unten.
   Frag nichts erneut, was hier schon entschieden ist.
2. **Projekt holen:** Das Projekt liegt im GitHub-Repo **`aymanoul/Ayman`**, Zweig
   **`claude/exciting-planck-xjdkte`**, Ordner **`gebet-video/`**.
   ```bash
   cd /home/user/Ayman            # oder wo das Repo geklont ist
   git fetch origin claude/exciting-planck-xjdkte
   git checkout claude/exciting-planck-xjdkte    # bzw. den Stand in den eigenen Arbeitszweig holen
   cd gebet-video && npm install
   ```
   Falls der neue Chat einen anderen Arbeitszweig vorgibt: den Stand von `claude/exciting-planck-xjdkte`
   in diesen Zweig übernehmen (merge oder `git checkout -B <neuer-zweig> origin/claude/exciting-planck-xjdkte`)
   und dort weiterarbeiten.
3. **Achtung, fremde Dateien im selben Repo:** `aymanoul/Ayman` ist eigentlich das Repo der Fahrschul-Website
   „Fahrstation Düsseldorf“. Die Dateien `HANDOFF.md`, `WARTUNG.md`, `site/`, `assets/` (im Repo-Hauptordner),
   `scripts/`, `gebaeudereinigung-ar/`, `vercel.json` gehören **nicht** zu diesem Projekt.
   Nicht anfassen. Die dortige Regel „beide Fahrschul-Zweige synchron halten“ gilt **nicht** für das Gebet-Video.
4. **Aktueller Stand:** Phase 0, 1 und 2 sind fertig. Ayman hat Raum und Außenansicht mit „Passt so“ bestätigt,
   aber bei der Frage „Weiter mit Phase 3?“ **„Noch warten“** gewählt. Also: **nicht von selbst mit dem Drehbuch
   anfangen.** Erst kurz den Stand bestätigen und fragen, ob es mit Phase 3 losgehen soll
   (oder ob vorher noch etwas geändert werden soll).
5. Erst die Projektdateien ansehen (`README.md`, `docs/phase0.md`, `docs/phase1.md`, `docs/phase2.md`,
   die Blätter in `out/phase1/` und `out/phase2/`), dann weiterarbeiten.

---

## 1. Wer und was

- **Auftraggeber:** Ayman, erstellt die Inhalte für die **Masjid As-Sunnah Ratingen**
  (Instagram/TikTok **@sunnahmoschee**, Website **masjid-sunnah.de**).
- **Projekt:** Animiertes 3D-Video im Hochformat 9:16, das Muslime an das Gebet in seiner Zeit erinnert.
- **Zielgruppe:** junge deutschsprachige Muslime auf TikTok und Instagram.
- **Ton:** liebevoll und einladend, nicht von oben herab. Die Warnungen kommen aus den Texten selbst
  (Quran, Sunnah, Sahaba), nicht aus eigenem Urteil.
- **Arbeitsweise mit Ayman:** Er ist kein Techniker und arbeitet am **iPad**. Alles einfach auf Deutsch erklären,
  Vorschauen als **Bilder oder kurze Clips** schicken, Fragen als **kurze Auswahl** stellen.
  **Nach jeder Phase stoppen und Freigabe abwarten.**

---

## 2. Feste Regeln (gelten immer, nicht verhandelbar)

1. **KEINE AUGEN.** Keine Figur hat Augen, auch nicht angedeutet: keine Augäpfel, Lider, Wimpern, Punkte,
   Striche, Schatten in Augenform, keine Sonnenbrille als Ersatz. Die Augenpartie ist glatte Haut.
   Erwünscht: Nase, Mund, Ohren, Bart, Haare. Gilt für Haupt- und Nebenfiguren, Schilder, Icons, Emojis.
   Grund ist religiös. **Augenbrauen: entschieden → OHNE.**
   Zusätzlich gelernt: Auch Gegenstände dürfen nicht wie ein Gesicht wirken
   (keine runden Steckdosen-Einsätze, keine QR-Codes, keine Autos mit Scheinwerfern, keine Punkte in Symbolen,
   keine Haut, die durch Haare „durchschimmert“).
2. Der **Prophet ﷺ, andere Propheten, Engel und die Sahaba** werden nie als Figur gezeigt.
   Wenn von ihnen die Rede ist: nur Schrift, Symbolbilder (Fluss, Waage, Uhr) oder A und B im Gespräch.
3. **Keine Musik, keine Instrumente, kein Gesang.** Nur Stimmen, Adhan, Raumklang, Geräusch-Effekte.
4. **Quran:** arabischer Text in uthmanischer Schreibweise, deutsche Übersetzung **wörtlich Bubenheim & Elyas**,
   geholt von `https://quranenc.com/api/v1/translation/sura/german_bubenheim/<Sura-Nr>`, nicht aus dem Gedächtnis.
   Im Quran-Text und in der Übersetzung wird nichts ergänzt, auch kein ﷻ oder ﷺ.
5. **Hadithe und Aussagen:** wörtlich treu übersetzen, innerhalb der Anführungszeichen nichts umformulieren,
   immer mit Quelle und Nummer. Nur ṣaḥīḥ oder ḥasan. Jede Stelle vor Verwendung an einer Originalquelle prüfen
   (dorar.net, sunnah.com, hadeethenc.com) und Ayman die Liste zur Freigabe zeigen.
6. **Schreibweisen im eigenen Text:** nach „Allah“ ﷻ, nach dem Propheten ﷺ, nach anderen Propheten ein kleines
   عليه السلام, „Aisha“ ohne Sonderzeichen. Deutsch einfach und natürlich. Bei Glaubensfragen nur Formulierungen,
   die Gelehrte der Ahl as-Sunnah (z. B. Ibn Baz, Ibn Uthaimin) selbst verwenden. Keine eigenen Urteile über Personen.
7. **Kein KI-Bild- oder Videogenerator** für Figuren und Räume. Alles als 3D-Szene per Code (Three.js), damit
   Regel 1 zu 100 % kontrollierbar ist. (Auch keine Higgsfield- oder ähnlichen Generatoren benutzen.)

---

## 3. Getroffene Entscheidungen (alle von Ayman bestätigt)

| Thema | Entscheidung |
| --- | --- |
| Umfang | **Ein einzelnes Video** (keine Serie). Ziel 2:00–2:30 min; wird das Drehbuch länger, Teilung in Teil 1/2 vorschlagen |
| Endkarte | **Nein, keine Endkarte.** Das Video endet mit dem Schlussbild in der Gebetsreihe |
| Außenszene | **Neubau wie auf Aymans Visualisierung** (`assets/ref/aussen-neubau-visualisierung.jpg`). Innen bleibt der **heutige** Raum nach den Fotos |
| Technik | **Three.js** + Headless-Chromium + ffmpeg. Blender getestet und verworfen (27 s pro Bild) |
| Augenbrauen | **Ohne** (für A und B) |
| Hautton | **Mittel** für beide: A `#c79367`, B `#d19d72` |
| Bart | A **mittel** (Vollbart, `beardLen 0.5`), B **kurz** (`beardLen 0.12`) |
| Phase 0 | freigegeben |
| Phase 1 (Figuren) | freigegeben |
| Phase 2 (Orte) | Gebetsraum „Passt so“, Außen „Passt so“. Weiter mit Phase 3: **„Noch warten“** |

Zum Gebetsraum frei ergänzt und von Ayman so akzeptiert: Eingangstür und Schuhregal an der Rückwand,
Fenster an den Seitenwänden, Deckenbalken. Zum Außenbild ergänzt und akzeptiert: Schild „Masjid As-Sunnah“
mit Logo-Kalligrafie über der Tür, offene Tür mit warmem Licht, Gehweg direkt vor dem Eingang.

Offene kleine Punkte, die ich Ayman genannt habe (noch keine Antwort):
- Die Lichtkegel an den Fenstern sind in den Standbildern kaum sichtbar → bei Wunsch stärker einstellen.
- Schild an der Säule zeigt nur Symbol + „Bitte Handy aus“ (arabischer Text vom Foto weggelassen, weil nicht sicher lesbar).
- Roll-up vereinfacht (ohne QR-Code und Bankdaten).

---

## 4. Material (alles im Projektordner)

| Datei | Was |
| --- | --- |
| `assets/ref/moschee-saeulen.webp` | Foto 1: Gebetsraum mit Säulen, Stapelstühlen, Handy-Schild |
| `assets/ref/moschee-qibla-wand.webp` | Foto 2: Qibla-Wand mit Mihrab, Tafel, Leuchte, Uhr, Regalen, Tisch, Roll-up, Minbar |
| `assets/ref/aussen-neubau-visualisierung.jpg` | Visualisierung „Neubau Masjid As-Sunnah, Ratingen, Am Westbahnhof 31“ |
| `assets/ref/beispielvideo/kontaktbogen_01–05.jpg` | Beispielvideo (TikTok, 15 s) alle 0,25 s als Kontaktbögen |
| `assets/ref/beispielvideo/einzelbild_*.jpg` | zwei Einzelbilder aus dem Beispielvideo |
| `assets/brand/*` | Logo aus `aymanoul/masjid-sunnah/public/brand/` (logo-gestapelt, logo-horizontal, kalligrafie, je navy/weiß, SVG+PNG) |

Das Beispielvideo selbst (28 MB, HEVC 1206×2622, 60 fps) ist **nicht** im Repo, nur die Kontaktbögen.
Noch ausstehend von Ayman: **ElevenLabs-Tonspuren** (nach dem Drehbuch) und eine **echte Adhan-Aufnahme**.

---

## 5. Stil (aus dem Beispielvideo, Phase 0)

1. Low-Poly-3D im Blender-Look: Figuren aus wenigen kantigen, flach schattierten Flächen, großer Kopf.
2. Welt drumherum detailreich und kräftig bunt: Texturen, Beschriftungen, weiche Schatten, warmes Licht.
3. Sehr schneller Schnitt: ca. 8 Einstellungen in 15 s (alle 1,5–3 s).
4. Ständig Bewegung: Kamerafahrt, schneller Zoom, Gegenstände fallen oder poppen ins Bild.
5. Perspektiven wechseln stark: nah am Gesicht, Halbtotale, Detail, Blick schräg von oben.
6. Untertitel: 1–3 Wörter, fette runde Schrift, weiß mit dunkler Kontur, gesprochenes Wort gelb, immer gleiche Höhe.
7. Titelzeile oben in den ersten Sekunden (weiß, dunkle Kontur, 2–3 Zeilen).
8. Begriffe werden zu Gegenständen (Kisten mit Aufschrift, Schilder, Sprechblasen).
9. Unterschied zu uns: dort große Augen. Bei uns Gefühl nur über Kopfhaltung, Mund, Schultern, Hände, Kamera.

---

## 6. Technik – wie das Projekt gebaut ist

### Umgebung
- Cloud-Container, Node 22, ffmpeg vorhanden, **Playwright + Chromium vorinstalliert** (nicht neu installieren).
- Chromium-Flags: `--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist`
  (WebGL2 per Software).
- npm-Pakete in `gebet-video/package.json`: `three` (0.187.0), `@fontsource/montserrat`, `@fontsource/amiri`,
  `@fontsource/amiri-quran`, `@fontsource/baloo-2`, `@fontsource/fredoka`.
- **Wichtig zu three 0.187:** `PCFSoftShadowMap` gibt es nicht mehr → es wird `VSMShadowMap` benutzt
  (weiche Schatten, `shadow.radius` + `shadow.blurSamples`).

### Renderzeit (gemessen)
- **ca. 0,9 s pro Bild** bei 1080×1920 (150 Bilder in 137 s). Ganzes Video (4500 Bilder) ≈ 70 min.
- Echte Ambient Occlusion (GTAO) +2,7 s/Bild und Bloom +0,4 s → **standardmäßig AUS**, stattdessen eingebacken:
  weiche Kontaktschatten (`blobShadow`) unter Figuren, Säulen, Möbeln; Verläufe in den Wandtexturen;
  Leuchtflächen (`glowTexture`) an Fenstern. Für einzelne Standbilder (z. B. Titelbild) zuschaltbar: `--ao --bloom`.
- Bild wird über `window.grabFrame(t)` als JPEG direkt aus dem Canvas geholt (schneller als Screenshot).
- 2 parallele Worker bringen nur wenig (Software-Rendering nutzt schon alle Kerne).

### Prinzip
- Zeit läuft **nie** über requestAnimationFrame. `window.renderFrame(t)` setzt alles deterministisch.
- **Jede Einstellung (Shot) = eine Datei** in `web/shots/`, wird einzeln als Clip gerendert.
- Einblendungen (Untertitel, Titel, Karten) werden in einem 2D-Canvas über dem 3D-Bild gezeichnet,
  Koordinaten **immer in 1080×1920** gedacht (wird automatisch skaliert).
- **Sichere Bereiche:** oben 250 px, unten 420 px, rechts 160 px frei von Text und wichtigen Bildteilen
  (`SAFE` in `overlay.js`, Hilfslinien mit `--guides`).

### Dateien

| Pfad | Inhalt |
| --- | --- |
| `README.md` | Projektübersicht, Befehle, Phasen-Stand |
| `UEBERGABE.md` | diese Datei |
| `docs/phase0.md` | Stil-Analyse, Technikvergleich, Renderzeit-Messungen |
| `docs/phase1.md` | Figurenaufbau, Augen-Regel, Entscheidungen |
| `docs/phase2.md` | Raummaße aus den Fotos, Außenbau, was ergänzt/vereinfacht ist |
| `web/index.html` | Seite mit Schriften (@font-face) und Import-Map für three |
| `web/main.js` | Renderer: lädt `?shot=<name>`, baut Szene, `renderFrame(t)`, `grabFrame(t)`, Optionen `ao`, `bloom`, `shadow=pcf`, `msaa`, `layers=all/3d/overlay`, `guides=1` |
| `web/lib/textures.js` | Prozedurale Texturen: Teppich mit Mäanderband (`CARPET_TILE_M` = 1,28 m = 1 Reihe), Fliesen/Putz (`DADO_TOP` = 1,5 m), Holz, Kufi, Kalligraphie-Tafel, Glow, Kontaktschatten, Milchglas, Uhr, Handy-Schild, Roll-up, Samt, Lichtkegel, Außen-Texturen (Pflaster, Glasraster, Gitter, Himmel, Eingangsschild); `PALETTE` |
| `web/lib/figure.js` | Figuren (siehe unten) |
| `web/lib/poses.js` | `applyPose(fig, pose)`, `POSES`, `pose(name, extra)` |
| `web/lib/room.js` | Gebetsraum: `buildRoom()` (async!), `addRoomLights(scene, {focus, range})`, `ROOM`, `SPOTS`, `COLUMNS` |
| `web/lib/props.js` | Uhr (`setTime`), Regal (`green`/`dark`), Tisch, Stuhl, Schwanenhals-Mikrofon (`table`/`floor`), Minbar, Roll-up, Stapelstuhl, Handy-Schild, Wandleuchte, Gebetsteppich, Doppeltür, Schuhregal, Steckdose |
| `web/lib/exterior.js` | Neubau außen: `buildExterior()` (async), `addExteriorLights(scene, {focus, range})`, `EXT` (Tür bei `[0,0,0.9]`, Gehweg z≈3,2) |
| `web/lib/overlay.js` | `drawSubtitles` (Stile `a` = Baloo 2 + gelb, `b` = Montserrat + Gold `#D9B26A`), `drawTitle`, `drawGuides`, `SAFE` |
| `web/shots/test.js` | Techniktest (5 s, 2 Figuren im Raum, 1 Schnitt) |
| `web/shots/sheet.js` | Fotostudio für die Figurenblätter |
| `web/shots/orte.js` | Kamerastandpunkte für die Ortsblätter (innen und außen, wechselt zwischen 2 Szenen) |
| `web/sheets/cells.js` | Inhalt der Figurenblätter (Phase 1) |
| `web/sheets/orte.js` | Inhalt der Ortsblätter (Phase 2), Farbpaletten |
| `tools/render.mjs` | Shot rendern: Standbilder oder Clip |
| `tools/sheets.mjs` | Blätter rendern und als JPG zusammensetzen (`--set figuren` / `--set orte`) |
| `tools/dbg.mjs` | Debug-Standbild mit eigenem JS in der Seite |
| `tools/bench.mjs` | Renderzeit pro Bild messen |
| `out/phase0/` | Techniktest-Clip, Standbilder, Bild mit sicheren Bereichen, Kontaktbogen |
| `out/phase1/` | 4 Figurenblätter, 2 Variantenblätter, Nebenfiguren |
| `out/phase2/` | 3 Ortsblätter |
| `out/stills/`, `out/sheets/` | Zwischenergebnisse (nicht im Git) |

### Befehle (im Ordner `gebet-video/`)
```bash
npm install
node tools/render.mjs test --still 1.0,3.6           # Standbilder → out/stills/
node tools/render.mjs test --still 1.0 --guides      # mit sicheren Bereichen
node tools/render.mjs test --scale 0.5               # Vorschau halbe Größe
node tools/render.mjs test --out out/clips/x.mp4     # Clip 1080x1920 (--workers 2, --from, --to)
node tools/render.mjs test --still 1.0 --ao --bloom  # echte AO/Bloom (nur Standbilder)
node tools/sheets.mjs                                # alle Figurenblätter → out/sheets/
node tools/sheets.mjs --only A_emo --cols 5          # nur einzelne Zellen (Vorschau)
node tools/sheets.mjs --set orte                     # Ortsblätter
node tools/bench.mjs "x=1" "ao=1"                    # Renderzeit messen
```
Lange Renderings im Hintergrund starten.

### Aufbau eines Shots (`web/shots/<name>.js`)
```js
export async function build({ W, H, renderer, q }) {
  const scene = new THREE.Scene();
  scene.add(await buildRoom());                         // buildRoom ist async
  addRoomLights(scene, { focus: [0, 0, -3], range: 5 }); // Schattenbereich um den Fokus
  const A = createFigureA({ footwear: 'socks' });        // in der Moschee Socken
  const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 700);
  return {
    scene, camera, duration: 3,
    update(t) { applyPose(A, POSES.sitzenSpricht); A.breathe(t); A.talk(amp(t)); /* Kamera setzen */ },
    overlay(g, t) { drawSubtitles(g, 1080, 1920, t, groups, { style: 'a', y: 1300 }); },
    // optional: scenes: [scene1, scene2] + shot.scene wechseln; environmentIntensity
  };
}
```

### Figuren-API (`web/lib/figure.js`)
- `createFigureA(opts)` = Person A, `createFigureB(opts)` = Person B, `createFigure(opts)` = Nebenfigur.
  Optionen: `qamis, skin, hair, beard ('full'|'short'|'none'), beardLen, kufi, brows (immer false lassen),
  height, headScale (1.34), shoes, sole, socks, footwear ('shoes'|'socks')`.
- Figur blickt nach **+z**, ihre linke Seite ist **+x**. Gelenke in `fig.J`: `root, body, hips, spine, neck, head,
  shoulderL/R, elbowL/R, wristL/R, footL/R, skull, beard`.
- `applyPose(fig, pose)` setzt pro Bild alles neu (zuerst `reset`). Pose-Felder: `seated, turn, hips, spine, neck,
  head` (Winkel [x,y,z]), `shrug`, `walk` (Phase in rad) + `walkOpt {amount, hurry, arms}`, `L`/`R` mit
  `reach [x,y,z]` (Handgelenk-Ziel in Oberkörper-Koordinaten) + `pole`, oder `swing/out/twist/bend`;
  `palm [x,y,z]` (Richtung der Handfläche), `flex`, `dev`, `wrist`, `hand` (`open|flat|relaxed|hold|fist`), `mouth`
  (`closed|half|open|smile`), `mouthOpt {skew, dx, dy, wide}`.
- `POSES`: `neutral, freundlich, nachdenklich, erschrocken, beschaemt, erleichtert, handHerz, offeneHand, handy,
  entschlossen, sitzen, sitzenSpricht`.
- Methoden: `breathe(t, phase, amount)` (nach der Pose aufrufen), `talk(amp 0..1)`, `setMouth`, `walk(phase, opt)`,
  `reach(side, worldVec3, pole)` (z. B. Hand auf die Schulter von B: Ziel `b.worldPoint('shoulderL',[0,0.075,0])`),
  `aimPalm`, `setSeated`, `setFootwear`, `addPhone('R')`, `headCenter()`, `worldPoint(joint, local)`.
- Beine sind unter dem knöchellangen Qamis verborgen; beim Gehen schwingt der Saum, Füße schauen hervor;
  Sitzen = Schneidersitz mit Knien unter dem Stoff.

### Wichtige Orte
- Innen (`SPOTS` in `room.js`): Raum 10 × 12 m, Höhe 3,4 m, Qibla-Wand bei z = −6, Tür an der Rückwand bei
  x = 2,5 / z = 6. `mihrab [0,0,-6]`, `sitzA [-0.55,0,-3.4]`, `sitzB [0.55,0,-3.3]`, `tuer [2.5,0,6]`,
  `reihe [0,0,-4.25]`. Säulen bei x = ±1,75 und z = −2,2 / 1,0 / 4,2. Stapelstühle an der linken Wand (x = −5).
- Außen (`EXT` in `exterior.js`): Fassade bei z = 0, Portal in der Mitte (Tür bei z = 0,9, Breite 2,5 m),
  Gehweg z ≈ 0–5,6, Bordstein bei z = 5,7, Parkplatz davor. Sonne von links vorn.

---

## 7. Figuren (Phase 1, freigegeben)

**Person A – der Ratgeber:** Ende 20 bis Mitte 30, ruhig und warm, aufrechte Haltung, langsame einladende Gesten
(offene Hand, Hand aufs Herz, Hand auf die Schulter von B). Weißer saudischer Qamis (knöchellang, gerader Schnitt,
Hemdkragen mit Knopfleiste, lange Ärmel mit Manschette, Brusttasche). Ägyptische Kufi (weiß, eng anliegend,
gehäkelt, feines Lochmuster). Voller dunkler Bart. Draußen dunkelbraune Schuhe, in der Moschee helle Socken.

**Person B – der junge Mann:** 18–25. Am Anfang in Eile und abgelenkt (Handy in der Hand, Kopf gesenkt, schnelle
Schritte), im Verlauf ruhiger, am Ende entschlossen. Blauer saudischer Qamis (gleicher Schnitt, Mittelblau
`#2f6fc4`). Keine Kopfbedeckung, Kurzhaarschnitt (Seiten kurz, oben länger), kurzer Bart. Draußen helle
Turnschuhe, in der Moschee dunkle Socken.

**Nebenfiguren** (Betende in der Reihe): nur von hinten oder aus der Ferne, gleiche Bauweise, andere Farben
(grau, beige, grün, braun), mit/ohne Kufi, ohne Augen.

---

## 8. Orte (Phase 2, abgenommen)

**Innen (nach den Fotos, Maßstab Fliesenhöhe 1,5 m):** türkiser Teppich mit dunkelblauen Mäanderbändern alle
1,28 m, türkise Sockelleiste; Wände und quadratische Säulen (0,46 m) unten beige marmorierte Fliesen mit
rostrotem Band, darüber weißer Putz. Qibla-Wand: weiße Rundbogen-Nische (1,23 m breit), davor blauer
Gebetsteppich mit goldenen Fransen und Schwanenhals-Mikrofon, darüber goldene Wandleuchte und gold-schwarze Tafel
mit der Schahāda لا إله إلا الله محمد رسول الله (echte Amiri-Schrift, RTL). Links: Uhr, Regal mit grünen
Büchern, Tisch mit Tischmikrofon und Stuhl. Rechts: Roll-up „Projekt Moschee Neubau in Ratingen“ auf der
Fensterbank, Regal mit dunklen Büchern, heller Holz-Minbar mit Treppe. Milchglasfenster in weißen Rahmen,
braune Stapelstühle mit Chrom an der linken Wand, „Bitte Handy aus“-Schild an zwei Säulen.

**Licht innen:** weiches Tageslicht, Fenster leuchten kühl-weiß mit Lichtschein, schwache Lichtkegel,
warmes Hauptlicht von links mit weichen Schatten, Gegenlicht ohne Schatten, türkiser Rückschein vom Teppich.

**Außen (Neubau):** sandfarbene Baukörper links und rechts, helles Portal in der Mitte mit großem
Spitzbogenfenster und Gitterfeld, dunkelblaue Fensterbänder, vier hohe Spitzbogenfenster rechts, zwei türkise
Glaskuppeln und zwei Türmchen mit goldenem Halbmond, Vorplatz mit gelben Parkstreifen, Gehweg, Hecken, Bäume,
Laternen, Himmel mit Wolken. Schild über der Tür, Tür offen, warmes Licht von innen.

**Licht außen:** später Nachmittag, warme tiefe Sonne von links vorn, lange weiche Schatten. Der Adhan ist aus
dem Inneren durch die offene Tür zu hören, kein Lautsprecher außen.

**Farbpaletten:**
Innen – Teppich `#2B9C9A`, Mäanderband `#1B4C7C`, Sockelleiste `#1F8F93`, Fliese `#DCC7A6`, Fliesenband `#B3603D`,
Putz `#F3F1EB`, Holz `#E2C591`, Gebetsteppich `#6A97CB`, Gold `#D2A84F`, Tafel `#16130F`, Stapelstuhl `#4F3527`,
Milchglas `#EEF4F8`.
Außen – Fassade `#CFC0A2`, Portal `#ECE7DC`, Glas `#27508A`, Kuppel `#3F9AA8`, Gold `#D2A84F`, Schild Navy `#212242`,
Asphalt `#77716A`, Pflaster `#BAB2A4`, Himmel `#6FA6DE`, Abendsonne `#FFC98F`, Türlicht `#FFC983`, Grün `#5F8F4A`.
Marke – Navy `#212242`, Gold `#CA9E4E` / `#D9B26A`, Creme `#F3E9D6`.

---

## 9. Nächster Schritt: Phase 3 – Drehbuch (erst nach Aymans „weiter“)

Aufbau:
1. **Hook (0–3 s):** spricht jeden Muslim direkt an. 3 schnelle Perspektiven in 3 s (z. B. Füße von B hasten am
   Eingang vorbei → Blick aus der Tür mit A im Gegenlicht → schneller Zoom über die Schulter auf B) plus großer
   Text. **3 Varianten vorschlagen**, z. B.:
   - „Du hörst den Adhan – und gehst weiter?“
   - „Was, wenn dieser Adhan dein letzter war?“
   - „Das Erste, wonach du gefragt wirst: dein Gebet.“
2. **Straße:** Adhan ertönt (aus der offenen Tür), B läuft vorbei. A steht an der Tür, sieht ihn, grüßt mit
   Salām, spricht ihn freundlich an und nimmt ihn liebevoll mit hinein (Hand auf die Schulter, kein Vorwurf).
3. **In der Moschee:** Sie setzen sich auf den Teppich. A erklärt in dieser Reihenfolge: **Quran → Sunnah →
   Aussagen der Sahaba.** B stellt echte Fragen, z. B. „Ich hole es doch später nach, reicht das nicht?“,
   „Ich hatte Schule und Arbeit.“, „Allah ist doch barmherzig?“, „Was ist, wenn man es ganz lässt?“,
   „Wie fange ich wieder an?“
4. **Hoffnung und Ausweg:** Reue, heute anfangen, das Gebet als Reinigung.
5. **Schluss:** Iqāma, beide stehen Schulter an Schulter in der Reihe (von hinten gezeigt), kurzer Schlusssatz.
   **Keine Endkarte** (entschieden).

**Beweis-Auswahl** (Ausgangspunkt; jede Stelle vor Verwendung an der Quelle prüfen; Stichworte sind
Inhaltsangaben, keine fertigen Übersetzungen; **6–8 auswählen** passend zur Länge):

Quran
- an-Nisāʾ 4:103 (das Gebet zu festgelegten Zeiten)
- al-Baqara 2:238 (die Gebete einhalten)
- Maryam 19:59 (Nachfolger, die das Gebet vernachlässigten)
- al-Māʿūn 107:4–5 (die auf ihr Gebet nicht achten)
- al-Muddaththir 74:42–43 („Was hat euch in Saqar geführt?“)

Sunnah
- Welche Tat ist Allah am liebsten? Das Gebet zu seiner Zeit. (Ibn Masʿūd; al-Bukhārī 527, Muslim 85)
- Zwischen dem Mann und dem Schirk und Kufr ist das Unterlassen des Gebets. (Jābir; Muslim 82)
- Der Bund zwischen uns und ihnen ist das Gebet. (Buraida; at-Tirmidhī 2621, ṣaḥīḥ nach al-Albānī)
- Das Erste, worüber der Diener am Tag der Auferstehung abgerechnet wird, ist sein Gebet. (Abū Huraira; at-Tirmidhī 413)
- Gleichnis vom Fluss vor der Tür, in dem man sich fünfmal am Tag wäscht. (Abū Huraira; al-Bukhārī 528, Muslim 667)

Sahaba
- ʿUmar ibn al-Khattāb: «لا حظَّ في الإسلام لمن ترك الصلاة» (Muwaṭṭaʾ Mālik, Kitāb aṭ-Ṭahāra; Nummer je nach Ausgabe, z. B. 82)
- ʿAbdullāh ibn Schaqīq über die Gefährten: Sie sahen bei keiner Tat das Unterlassen als Kufr an außer beim Gebet. (at-Tirmidhī 2622, ṣaḥīḥ nach al-Albānī)
- Ibn Masʿūd über das Einhalten der Gebete dort, wo zu ihnen gerufen wird. (Muslim 654)

**Liefern in Phase 3:**
- Beweisliste mit geprüftem Wortlaut, Quelle, Nummer, Gradierung → **zuerst Ayman zur Freigabe zeigen**.
- Drehbuch als Tabelle: Nr. · Sprecher · gesprochener Text · Bild und Perspektive · Einblendung · Geräusch.
- Sprechertext für ElevenLabs: jede Zeile mit Kennung (A01, B01, A02 …), genau so ausgeschrieben, wie sie
  gesprochen wird (z. B. „der Prophet, Allahs Segen und Frieden auf ihm“), mit Aussprachehinweisen für arabische
  Wörter und gewünschter Stimmung pro Zeile.
- Arabische Quranverse lässt die KI-Stimme **nicht** rezitieren (Tajwīd-Fehler). A spricht die deutsche
  Übersetzung, das Arabische erscheint als Schrift. Liefert Ayman eine echte Rezitation, kann sie kurz eingespielt werden.
- Wenn es länger als 2:30 wird: Teilung in Teil 1 / Teil 2 vorschlagen.

---

## 10. Weitere Phasen (nach Phase 3)

### Phase 4 – Storyboard
Shotliste mit Dauer, Kamera, Handlung, Einblendung pro Shot + ein grob gerendertes Standbild pro Shot.
Kein Shot länger als 4 s ohne Schnitt oder Kamerabewegung. Schnitt alle 2–4 s, wechselnde Perspektiven
(Totale, über die Schulter, nah: Profil/Hände/Mund, Detail: Teppichmuster/Mihrab/Tür, Vogelperspektive,
langsame Fahrten, schnelle Zooms). Gegenstände machen Begriffe sichtbar (Uhr mit den fünf Gebetszeiten, Waage, Fluss).

### Phase 5 – Ton
- Ayman lädt ElevenLabs-Aufnahmen hoch, am liebsten eine Datei pro Zeile (A01.mp3 …). Geht auch: eine pro Sprecher
  oder eine Gesamtdatei → dann selbst an den Pausen schneiden (Zeitmarken per Spracherkennung, z. B. faster-whisper).
- Adhan: echte Aufnahme von Ayman. **Kein KI-Adhan.**
- Geräusche selbst erzeugen oder aus freien Quellen: Straße, Schritte, Tür, Raumklang, Whoosh, Pop, dumpfer Impact,
  Papier. Keine Melodien.
- Mundbewegung und Gesten an die Lautstärke koppeln (`fig.talk(amp)`). Nur der Sprecher bewegt den Mund,
  der andere hört sichtbar zu (nicken, Kopf neigen).
- Stimmen klar vorn, Geräusche deutlich leiser. Endmix ca. **−14 LUFS**.

### Phase 6 – Einblendungen
- Untertitel Wort für Wort, im sicheren Bereich, immer gleiche Höhe. **2 Stilvarianten zeigen:**
  (a) wie im Beispiel, runde fette Schrift (Baloo 2), Betonung gelb; (b) Markenlook, Montserrat fett, Betonung Gold `#D9B26A`.
  (Beide sind in `overlay.js` schon angelegt.)
- **Beweis-Karte** im unteren Drittel (oberhalb der unteren 420 px), jedes Mal wenn Vers/Hadith/Aussage genannt wird.
  Dunkles, leicht transparentes Navy-Feld `#212242`, abgerundete Ecken, farbiger Rand und Etikett:
  - **QURAN** in Gold (`#CA9E4E` → `#D9B26A`): arabischer Vers im Gold-Verlauf (Amiri Quran), Bubenheim-Übersetzung, „Sura …, Vers …“
  - **HADITH** in Türkis (Teppichfarbe): deutsche Übersetzung, Überlieferer, Sammlung, Nummer. Arabische Kernzeile nur
    wenn Platz (beide Varianten zeigen).
  - **SAHABA** in Creme/Rostrot (Fliesenfarben): Aussage, Name, Quelle.
- Karte fährt mit Whoosh und Pop ein, bleibt lange genug zum Lesen, fährt weich aus. Untertitel rücken so lange
  nach oben, nichts überlappt.
- **Keine Zier-Ornamente** (Striche mit Rauten o. Ä., wirkt nach KI).

### Phase 7 – Animation und Rendern
Zuerst eine **15-Sekunden-Probe (Hook + Straße)** zur Freigabe, dann den Rest Shot für Shot. Figuren stehen nie starr
(atmen, Gewicht verlagern, Kopf bewegen). Licht außen warme tiefe Sonne, innen weiches Tageslicht mit leichten Lichtkegeln.

### Phase 8 – Prüfung vor der Abgabe
- **Augen-Check:** aus jedem Shot Standbilder ziehen und einzeln ansehen (auch Nebenfiguren, Schilder, Icons).
  Ein einziger Treffer heißt: Shot neu.
- Jeden eingeblendeten Vers und Hadith nochmals gegen die Quelle prüfen (Wortlaut, Übersetzung, Quelle, Nummer).
  Arabisch korrekt verbunden und RTL.
- Text und Figuren in den sicheren Bereichen, Untertitel synchron, keine Tonsprünge, keine Musik.
- Ganzes Video alle 0,5 s als Standbilder durchgehen und Auffälligkeiten beheben.

### Phase 9 – Abgabe
Fertiges Video (MP4, 1080×1920, 30 fps, H.264 + AAC, −14 LUFS) · Titelbild 9:16 im selben Look (Text im mittleren
Bereich, damit er im Raster sichtbar bleibt) · Beschreibung zum Kopieren mit Hashtags · Projektordner als ZIP.

---

## 11. Git und Sicherung

- Repo `aymanoul/Ayman`, Zweig `claude/exciting-planck-xjdkte`, Ordner `gebet-video/`.
- Push: `git push -u origin <zweig>`, bei Netzwerkfehler bis zu 4× mit 2/4/8/16 s Pause wiederholen.
- **Keinen Pull Request** erstellen, außer Ayman fragt ausdrücklich danach.
- Keine Modellbezeichnung in Commits oder Dateien schreiben.
- Commit-Nachrichten enden mit den Attribution-Zeilen, die die Sitzung vorgibt.
- Der Arbeitsbereich kann zurückgesetzt werden → regelmäßig committen und pushen, wichtige Dateien an Ayman schicken.
- `.gitignore`: `node_modules/`, `out/tmp/`, `out/stills/`, `out/sheets/`, `out/clips/*.part*.mp4`, `*.log`.
- Bisherige Commits:
  - `31c1f5a` Phase 0 – Renderer, Raum-Grundaufbau, Platzhalterfiguren, Techniktest
  - `21937a7` Messwerte in den Phase-0-Notizen präzisiert
  - `1e224c7` Außenreferenz (Visualisierung Neubau) abgelegt
  - `002a066` Phase 1 – Figuren ausgebaut und Figurenblätter
  - `0846c19` Phase 2 – Gebetsraum nach Fotos, Neubau außen, Ortsblätter
  - (danach) Übergabe-Datei und Kontaktbögen des Beispielvideos

Das Logo-Repo `aymanoul/masjid-sunnah` ist öffentlich und nur gelesen worden (Logo liegt schon in `assets/brand/`).

---

## 12. Gelernte Stolperstellen

- Zu starker Bloom machte das ganze Bild milchig → Bloom aus, Leuchtflächen statt Bloom.
- Grobe Haarschale ließ am Hinterkopf zwei helle Hautpunkte durchscheinen (wirkte wie Augen) → feinere Schale,
  Dreiecke an der Haar- und Bartkante sauber abschneiden. Nach jeder Kopf-Änderung den Hinterkopf prüfen.
- Augenbrauen ohne Augen darunter wirken wie geschlossene Augen → entschieden: ohne.
- Mund stand im Profil ab → Mundteile folgen der Gesichtsrundung (`bend`).
- Bart lief zu weit nach hinten / Wangen zu voll → Bartkante folgt dem Kiefer, lang nur am Kinn.
- Wandleuchte zuerst falsch herum (Spitze nach unten) → jetzt Schale nach oben, Licht darunter.
- Rechtes Qibla-Fenster mit Roll-up davor: kein Lichtschein/Lichtkegel, sonst wird das Roll-up überstrahlt.
- Rückwand im Schatten zu grau → schattenloses Gegenlicht ergänzt.
- Türlicht außen war zu grell → Stärke reduziert.
- `IcosahedronGeometry` ist schon „non-indexed“ → kein `toNonIndexed()` aufrufen.
- `sleep` im Bash ist blockiert → für Warten `run_in_background` mit `until`-Schleife nutzen.

---

## 13. Was Ayman als Nächstes von dir erwartet

Kurz bestätigen: „Ich habe den Stand übernommen: Phase 0–2 fertig, Figuren und Orte abgenommen.“
Dann fragen (als kurze Auswahl), ob es jetzt mit **Phase 3 (Drehbuch)** losgehen soll oder ob er vorher noch etwas
an Figuren oder Orten ändern möchte (z. B. Lichtkegel deutlicher). Erst nach seinem „weiter“ mit Phase 3 beginnen,
und dort zuerst die **geprüfte Beweisliste** zur Freigabe zeigen.

---

## 14. Nachtrag: Phase 3 begonnen (nach Aymans „Weiter machen“)

- Neue Umgebung **„Ayman“** angelegt (persönlich, für Repo `aymanoul/Ayman`) mit freigegebenen Hosts:
  quranenc.com, sunnah.com, dorar.net, www.dorar.net, hadeethenc.com, api.hadeethenc.com.
- **quranenc.com** und **hadeethenc.com** (offizielle API) funktionieren. **sunnah.com und dorar.net** zeigen eine
  Cloudflare-Bot-Sperre → **nicht umgehen** (wurde vom System als Bot-Umgehung abgelehnt).
- Rohdaten in `docs/quellen/` (sura_*.json, he_*.json). Beweisliste: **`docs/phase3-beweisliste.md`**.
- Geprüft: Q1–Q5 (4:103, 2:238, 19:59, 107:4–5, 74:42–43) wörtlich; H1–H6 Wortlaut + Gradierung von hadeethenc
  (IDs 3365, 65093, 65094, 4968, 11287, 3591); H7 „Das Erste, worüber abgerechnet wird“ nur arabisch
  (Tamim ad-Dari, Abu Dawud/Ibn Maja/ad-Darimi, ḥasan, hadeethenc 65424), deutsche Übersetzung = eigener Vorschlag.
- **Nicht geprüft:** Hadith-Nummern (aus dem Auftrag bzw. Gedächtnis: Muslim 653, Muslim 233), Tirmidhi 413
  (Abu Huraira-Fassung), alle drei Sahaba-Aussagen (S1 ʿUmar, S2 Ibn Schaqiq, S3 Ibn Masʿud).
- **Wartet auf Ayman:** Freigabe der Beweisliste und Entscheidung, wie mit den ungeprüften Stellen umgegangen wird.
  Erst danach Drehbuch-Tabelle, 3 Hook-Varianten und Sprechertext (A01, B01 …) schreiben.

### 14b. Stand nach Aymans Antwort (10.11.2026)

- Sahaba-Aussagen: **entfallen**. Beweisliste: **freigegeben** (inkl. eigener Übersetzung H7).
- **Drehbuch geschrieben:** `docs/phase3-drehbuch.md` – 26 Zeilen in 5 Teilen, ca. 2:25–2:35,
  Belege Q1, Q4, Q5, H2, H7, H1, H4 (Reihenfolge Quran → Sunnah), 3 Hook-Varianten (Empfehlung: „Du hörst den
  Adhan – und gehst weiter?“), exakte Kartentexte, Sprechertext A01–A14 / B01–B09 mit Stimmung und Aussprache.
- Kein Endkarte; Schlusssatz A14 (Off): „Dein nächstes Gebet ist dein Neuanfang.“
- Wenn länger als 2:30: zuerst A10 (H1) streichen.
- Zusätzlich angefragt: echte **Iqāma**-Aufnahme (neben dem Adhan).
- **Wartet auf Ayman:** Wahl der Hook-Variante, Freigabe des Drehbuchs, Antwort zur Iqāma-Aufnahme.
  Danach Phase 4 (Storyboard: Shotliste + grob gerendertes Standbild pro Shot).

### 14c. Drehbuch freigegeben (10.11.2026)

- Hook: **Variante 1** „Du hörst den Adhan – und gehst weiter?“. Drehbuch **freigegeben**. Ayman liefert **Adhan und Iqāma**
  (echte Aufnahmen) und nimmt den Sprechertext in ElevenLabs auf.
- Nächster Schritt: **Phase 4 Storyboard** (Shotliste + grob gerendertes Standbild pro Shot), Dateien:
  `web/sheets/board.js` (Shot-Daten), `web/shots/board.js` (Szene), `web/lib/symbols.js` (Waage, Fluss, Lichtpunkte),
  `docs/phase4-shotliste.md`, Blätter in `out/phase4/`.

### 14d. Phase 4 Storyboard erstellt (10.11.2026)

- `web/sheets/board.js`: **49 Einstellungen S01–S49** mit Teil, Dauer, Startzeit, Drehbuch-Zeile, Kamera, Handlung,
  Einblendung und Render-Angaben (Figuren, Posen, Kamera `pos/look`, `on`-Figur oder `over`-Schulter, Effekte).
  Summe ca. 2:14 (+ Pausen ≈ 2:20–2:30), Zeiten werden in Phase 5/7 an die echten Aufnahmen angepasst.
- `web/shots/board.js`: baut jede Einstellung (innen/außen) als Standbild. `web/lib/symbols.js`: Waage, Fluss vor der Tür,
  fünf Lichtstriche im Bogen über der Uhr (bewusst keine runden Punkte → Augen-Regel).
- Vorraum außen: Vorderseite der Lichtbox ist jetzt offen (man kann von innen hinaussehen).
- `docs/phase4-shotliste.md` (Tabelle), Blätter `out/phase4/storyboard-1…4.jpg`.
- **Wartet auf Ayman:** Freigabe des Storyboards. Danach Phase 5 (Ton) – braucht Aymans ElevenLabs-Dateien, Adhan und Iqāma.
  Bis die Tonspuren da sind, kann Phase 6 (Einblendungen: 2 Untertitel-Stile, Beweis-Karten) vorbereitet werden.
