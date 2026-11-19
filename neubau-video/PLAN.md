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
| 0 | Blender-Verbindung, Datei anlegen, Unterlagen sichten, offene Punkte abfragen | **läuft (19.11.)**: Ordner `neubau-video/` + `AUFTRAG.md` angelegt. **Blockiert:** (a) Diese Cloud-Sitzung erreicht den Mac noch nicht – keine Blender-MCP-Werkzeuge hier, kein freigegebener Computer-Ordner. (b) Unterlagen fehlen noch (`assets/ref/neubau/plan|bilder|umgebung|karte` leer; vorhanden nur `gebet-video/assets/ref/aussen-neubau-visualisierung.jpg`). |
| 1 | Lageplan von oben mit Maßen | offen |
| 2 | Umgebung in Blender + Vergleich mit Fotos | offen |
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
- Noch offen: PV-Anordnung (wie in der Bau-Roadmap – Bild abwarten).
