# Plan & Stand: „Projekt Moschee Neubau – Drohnenflug mit Bau-Zeitraffer“

Auftrag vollständig in `AUFTRAG.md` (verbindlich, zusammen mit Aymans Korrekturen). Nach jeder Phase stoppen, Vorschau, Freigabe.

## Besonderheiten gegenüber den anderen Videos
- **Higgsfield ist für DIESES Video erlaubt** (Ausnahme von Regel 7 in `gebet-video/CLAUDE.md`), aber vor jedem Auftrag
  Kosten nennen und Freigabe abwarten (Guthaben ca. 1.000 Credits). Texte, Logo, Zahlen, QR-Code nie über Higgsfield.
  Hochskalieren lokal. Liste aller Aufträge mit Kosten: `docs/higgsfield-auftraege.md` (anlegen beim ersten Auftrag).
- **Keine Figuren** im Bild (keine Menschen, Autos, Wohnwagen, Kräne, Maschinen, Gerüste, Bauzaun, Folien, Schutt, Tonnen, Tiere, Drohne).
- **Blender läuft auf Aymans MacBook** (Blender 5.3.0, Apple Silicon), Arbeitsdatei `~/Movies/Neubau/neubau.blend`.
  Nur Szene-Code, nichts am System ändern, nur im Ordner Neubau arbeiten.

## Phasen
| Phase | Inhalt | Stand |
|---|---|---|
| 0 | Blender-Verbindung, Datei anlegen, Unterlagen sichten, offene Punkte abfragen | **fast fertig (19.11.)**: Ordner `neubau-video/` + `AUFTRAG.md` angelegt. Unterlagen gesichtet (`docs/phase0-sichtung.md`): 4 Fotos, 9 Bilder/Entwürfe, 2 Karten. Architektenplan da (`plan/`). **Fehlt nur noch:** Verbindung zum Mac (Ordner noch nicht freigegeben) → nötig ab Phase 2. |
| 1 | Lageplan von oben mit Maßen | Vorschau `out/phase1/lageplan.png` (`python3 tools/lageplan.py`, Montserrat in `assets/fonts/`, OFL). **Maße nach Architektenplan** (`assets/ref/neubau/plan/architektenplan_1-01_konzept_ersatzbau.jpg`, Foto 1206 px, Maße per Pixel abgegriffen, Maßstab über BF 745 m² = 28,4 px/m in 4×-Ausschnitt): Grundstück 900 m², ca. 50 m an der Gasse; tiefer Teil 16,5 × 29 m, langer Teil 33,5 × 12,3 m; Moschee 16,5 × 12 m, Vorplatz 3 m, Hof 14 m tief, Parken 9 m, Wohnwagen 24,5 m (7 × 3,5 m), Schiebetor 6 m. Norden ca. 22° unter der Gassenrichtung (Gasse läuft nach NNW, Grundstück liegt westlich der Gasse) → ✅ **freigegeben (19.11.)** |
| 2 | Umgebung in Blender + Vergleich mit Fotos | Vorschau (19.11., **im Container gebaut**, Mac noch nicht verbunden): `blender/umgebung.py` → `blender/neubau.blend` (Baukörper-Modell, ~570 Objekte; Foto-Texturen `tools/texturen.py` → `assets/tex/`), Standbilder `blender/ansicht.py [--sonne vorn]` → `out/phase2/*.png` (Cycles CPU, 24 Samples, 20–50 s/Bild), Blätter `out/phase2/uebersicht.jpg`, `out/phase2/vergleich.jpg` (`tools/vergleich.py`) → ✅ **freigegeben (19.11.)**; Sonne: **von vorn** (Aymans Wahl, tief und warm von vorn links, Glasfront im Licht) |
| 3 | Moschee Endzustand + Keller + Vergleichsblatt | Vorschau (19.11., **im Container** – Ayman: „mache ich später, mach weiter“): `blender/moschee.py` (nach `umgebung.py`; Sammlungen S2_Keller, S3_EG, S4_OG, S5_Dach, S6_Aussen, Innen; Schiebetor mit Eigenschaft „offen“ + Treiber), Bilder `blender/ansicht.py --ordner phase3` (portal, hof, keller, parken, ki_oben, ki_plakat, ki_schraeg), Blätter `out/phase3/uebersicht.jpg` (`tools/blatt_phase3.py`), `out/phase3/vergleich.jpg` (`tools/vergleich_phase3.py`) → ✅ **freigegeben (19.11.)**. Wichtig für später: Ayman möchte live in seinem Blender zusehen (execute_blender_code über MCP, Datei `~/Movies/Neubau/neubau.blend`, nach jedem Schritt melden) – sobald eine Sitzung auf dem Mac mit Blender-MCP läuft. Gelernt: deckungsgleiche Flächen (gleiche Ebene, gleiches Material) rendern in Cycles schwarz → Bauteile 1–3 cm versetzen. |
| 4 | Animatic 360×640 (Varianten A/B) | Vorschau fertig (19.11.) `out/phase4/animatic_A.mp4`, `animatic_B.mp4` (42 s, 15 fps, 720×1280) → Anfang: **Variante B** gewählt (19.11.); Ayman will noch etwas ändern (wartet auf Angabe). Technik: `blender/animation.py` (Geometry-Nodes-Gruppe „Aufbau“: wandernde Grenze je Bauteil, 122 Teile; Baugrube mit Holzverbau, Geländer, 2 Treppen; Licht an + Dämmerung 33–36 s; Kameras Drohne_A/Drohne_B mit Blickziel, ab 4 s gleich; `--endstufe` = END_STAGE). Wichtig: in Blender ≥ 5.1 Modifier-Eingänge über `mod.properties.inputs.<Socket_n>.value` (Funktion `setzen`). Rendern `sh tools/animatic_weiter.sh` (Cycles 4 Samples, 360×640, 15 fps, ~2,7 s/Bild, fortsetzbar) → `out/phase4/anim_A|anim_B/`, zusammensetzen `python3 tools/animatic.py` → `out/phase4/animatic_A.mp4`, `animatic_B.mp4` (720×1280, Stufen-Beschriftung). Proben: `blender/animatic.py --zeiten …`. EEVEE geht im Container nur per Software (27 s/Bild) → Cycles. |
| 5 | Rendering 720×1280, 30 fps, EEVEE auf dem Mac | offen |
| 6 | Higgsfield-Test 5 s (ca. 35 Credits, vorher nennen) | offen |
| 7 | Higgsfield ganz (ca. 250 Credits + Reserve, vorher nennen) | offen |
| 8 | Einblendungen, Abschlusskarte, Ton, Vorschau 720p | vorbereitet: Hadith geprüft + gewählt (`docs/belege.md`: „Wer für Allah eine Moschee baut, dem wird Allah im Paradies etwas Gleiches bauen.“ al-Bukhārī 450 · Muslim 533, ohne Arabisch), QR `assets/qr/paypal_qr.png` (`tools/qr.py`, zxing-geprüft) |
| 9 | Endfassung 1080×1920, −14 LUFS, Prüfung, Titelbild, Beschreibung | offen |

## Verbindung zum Mac (Optionen)
1. **Computer-Ordner freigeben:** Claude-Desktop-App auf dem Mac → Einstellungen → Claude Code → Remote Control → Ordner
   `~/Movies/Neubau` hinzufügen; dann kann diese Sitzung dort Befehle ausführen (nicht für alle Konten verfügbar).
   Blender dann am besten ohne Oberfläche: `/Applications/Blender.app/Contents/MacOS/Blender -b neubau.blend -P skript.py`
   (lange Renderings blockieren nichts, kein MCP-Zeitlimit) – oder über das MCP-Add-on (Port 9876).
2. **Sitzung direkt auf dem Mac:** Claude-Desktop-App (Code) oder `claude remote-control` im Ordner Neubau; dort das
   Blender-MCP einbinden. Dieser Ordner im Repo ist das Gedächtnis.
3. **Notlösung:** Blender hier im Container (5.2.3, CPU, langsam: EEVEE-Rendern ohne GPU kaum möglich, Cycles ~20–40 s/Bild bei 720p).

## Entscheidungen von Ayman (19.11.)
- Verbindung: **Ordner freigeben** (Remote Control, Ordner „Neubau“ in Filme) – wartet darauf, dass Ayman ihn auf dem Mac hinzufügt.
- Portal: **rechtes Ende** der Glasfassade (Richtung Parkfläche).
- Einfahrt: **rechtes Ende, freitragendes Schiebetor**, ohne Bodenschiene, 5–6 m Durchfahrt (im Video geschlossen).
- Nachbargebäude rechts: **helle Putzfassade**, graues Dach mit Dachfenstern.
- PV-Anordnung: wie Bau-Roadmap, ca. 10 Modul-Streifen von der Glasfront nach hinten, Rest Gründach.
