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
| 2 | Umgebung in Blender + Vergleich mit Fotos | Vorschau (19.11., **im Container gebaut**, Mac noch nicht verbunden): `blender/umgebung.py` → `blender/neubau.blend` (Baukörper-Modell, ~570 Objekte; Foto-Texturen `tools/texturen.py` → `assets/tex/`), Standbilder `blender/ansicht.py [--sonne vorn]` → `out/phase2/*.png` (Cycles CPU, 24 Samples, 20–50 s/Bild), Blätter `out/phase2/uebersicht.jpg`, `out/phase2/vergleich.jpg` (`tools/vergleich.py`) → **wartet auf Freigabe + Wahl Sonnenrichtung** (realistisch Nachmittag = Sonne von hinten/Südwest, Glasfront im Schatten; oder Sonne von vorn = Glasfront im Licht) |
| 3 | Moschee Endzustand + Keller + Vergleichsblatt | offen |
| 4 | Animatic 360×640 (Varianten A/B) | offen |
| 5 | Rendering 720×1280, 30 fps, EEVEE auf dem Mac | offen |
| 6 | Higgsfield-Test 5 s (ca. 35 Credits, vorher nennen) | offen |
| 7 | Higgsfield ganz (ca. 250 Credits + Reserve, vorher nennen) | offen |
| 8 | Einblendungen, Abschlusskarte, Ton, Vorschau 720p | offen |
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
