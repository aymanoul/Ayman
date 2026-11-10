# Gebet-Video – „Die Wichtigkeit des Gebets“

Animiertes 9:16-Video (1080×1920, 30 fps) für die Masjid As-Sunnah Ratingen (@sunnahmoschee).
Alles wird als 3D-Szene per Code gebaut (Three.js), Bild für Bild in Headless-Chromium gerendert
und mit ffmpeg zum Video zusammengesetzt. Kein KI-Bild- oder Videogenerator.

## Feste Regeln (gelten in jeder Phase)

1. **Keine Augen.** Keine Figur hat Augen, auch nicht angedeutet. `web/lib/figure.js` enthält bewusst
   kein Bauteil dafür. Augenbrauen sind nur als abschaltbare Variante vorgesehen (Standard: aus).
2. Der Prophet ﷺ, andere Propheten, Engel und die Sahaba werden nie als Figur gezeigt.
3. Keine Musik, keine Instrumente, kein Gesang.
4. Quran: uthmanische Schreibweise, Übersetzung wörtlich Bubenheim & Elyas (von quranenc.com holen).
5. Hadithe: wörtlich, mit Quelle und Nummer, nur ṣaḥīḥ/ḥasan, vorher an der Originalquelle prüfen.
6. Sichere Bereiche: oben 250 px, unten 420 px, rechts 160 px frei von Text und wichtigen Bildteilen.

## Aufbau

| Pfad | Inhalt |
| --- | --- |
| `web/index.html`, `web/main.js` | Renderer: `window.renderFrame(t)` setzt alles deterministisch für Zeitpunkt `t` |
| `web/lib/textures.js` | Prozedurale Texturen: Teppich mit Mäanderband, Fliesen, Putz, Holz, Kufi, Kalligraphie-Tafel |
| `web/lib/room.js` | Gebetsraum (Qibla-Wand, Mihrab, Säulen, Fenster, Licht) |
| `web/lib/figure.js` | Figuren mit Gelenken, Händen mit Fingern, Mund in 4 Formen, Gehen, Sitzen; Person A und B |
| `web/lib/poses.js` | Posen als Daten (Gefühlslagen, Gesten, Sitzen) und `applyPose` |
| `web/sheets/cells.js`, `web/shots/sheet.js`, `tools/sheets.mjs` | Figurenblätter: Inhalt, Studio-Szene, Rendern und Zusammensetzen |
| `web/lib/overlay.js` | Titel, Wort-für-Wort-Untertitel, Hilfslinien für sichere Bereiche |
| `web/shots/*.js` | Eine Datei pro Einstellung (Shot) |
| `tools/render.mjs` | Rendert einen Shot zu Standbildern oder zu einem Clip |
| `out/` | Ergebnisse (Standbilder, Clips) |

## Rendern

```bash
npm install
node tools/render.mjs test --still 1.0,3.6          # Standbilder nach out/stills/
node tools/render.mjs test --still 1.0 --guides     # mit Hilfslinien der sicheren Bereiche
node tools/render.mjs test --scale 0.5              # schnelle Vorschau in halber Größe
node tools/render.mjs test --out out/clips/x.mp4    # Clip in voller Größe (ca. 0,9 s pro Bild)
node tools/render.mjs test --still 1.0 --ao --bloom # echte AO und Bloom, nur für Standbilder sinnvoll
node tools/bench.mjs "x=1" "ao=1"                  # Renderzeit pro Bild messen
node tools/sheets.mjs                               # alle Figurenblätter nach out/sheets/
node tools/sheets.mjs --only A_emo --cols 5         # nur einzelne Zellen als Vorschau
```

Chromium läuft mit Software-WebGL (`--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader
--ignore-gpu-blocklist`). Playwright ist in der Cloud-Umgebung vorinstalliert.

## Technik-Entscheidung (Phase 0)

- **Three.js** (gewählt): Messwert siehe `docs/phase0.md`.
- **Blender (bpy 5.2)** getestet und verworfen: Download 403 MB in knapp 6 Minuten, Cycles braucht
  ohne Grafikkarte rund 27 s pro Bild schon bei einer Minimal-Szene. Für 2:30 Minuten (4500 Bilder)
  wären das über 30 Stunden.

## Stand

- [x] Phase 0 – Sichten und Techniktest
- [x] Phase 1 – Figurenblätter (wartet auf Auswahl: Hautton, Bart, Augenbrauen)
- [ ] Phase 2 – Ortsblätter
- [ ] Phase 3 – Drehbuch
- [ ] Phase 4 – Storyboard
- [ ] Phase 5 – Ton
- [ ] Phase 6 – Einblendungen
- [ ] Phase 7 – Animation und Rendern
- [ ] Phase 8 – Prüfung
- [ ] Phase 9 – Abgabe
