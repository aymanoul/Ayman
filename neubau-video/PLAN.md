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
| 4 | Animatic 360×640 (Varianten A/B) | Vorschau fertig (19.11.) `out/phase4/animatic_A.mp4`, `animatic_B.mp4` (42 s, 15 fps, 720×1280) → Anfang: **Variante B**; Änderungswünsche umgesetzt (siehe oben), neues Animatic `out/phase4/animatic_B.mp4` (45 s, ohne Text, Schluss über dem weißen Haus – vorher flog die Kamera hindurch) → **wartet auf Freigabe**. Technik: `blender/animation.py` (Geometry-Nodes-Gruppe „Aufbau“: wandernde Grenze je Bauteil, 122 Teile; Baugrube mit Holzverbau, Geländer, 2 Treppen; Licht an + Dämmerung 33–36 s; Kameras Drohne_A/Drohne_B mit Blickziel, ab 4 s gleich; `--endstufe` = END_STAGE). Wichtig: in Blender ≥ 5.1 Modifier-Eingänge über `mod.properties.inputs.<Socket_n>.value` (Funktion `setzen`). Rendern `sh tools/animatic_weiter.sh` (Cycles 4 Samples, 360×640, 15 fps, ~2,7 s/Bild, fortsetzbar) → `out/phase4/anim_A|anim_B/`, zusammensetzen `python3 tools/animatic.py` → `out/phase4/animatic_A.mp4`, `animatic_B.mp4` (720×1280, Stufen-Beschriftung). Proben: `blender/animatic.py --zeiten …`. EEVEE geht im Container nur per Software (27 s/Bild) → Cycles. |
| 5 | Rendering 720×1280, 30 fps (im Container: Cycles 10 Samples, ~12 s/Bild) | **fertig (20.11., 06:42)**, geprüft: 1080×1920, 30 fps, 60,0 s, −14,3 LUFS, kein Text, Tor öffnet/schließt, Hof oben + Augenhöhe, Schluss mit offenem Dach. **Korrektur 20.11. (Ayman):** (1) Schluss: Kamera bleibt auf der offenen Moschee (Key 60 s geändert, kein Rechtsschwenk mehr). (2) Fehler behoben: Dach/Attika/OG-Säulen/Deckenleuchten waren schon am Anfang sichtbar („Frauenbereich“), weil der Dach-Abbau die Aufbau-Achse auf X umstellte – jetzt baut `aufbau(weg=True)` entlang derselben Achse ab wie auf (`ACHSEN`). Neu gerendert: 0–34 s und 50,6–60 s (34–50,6 s unverändert, per Bildvergleich geprüft). **Korrigierte Endfassung fertig (20.11., ~15:15)**, geprüft (1080×1920, 60,0 s, −14,3 LUFS, Übergänge bei 34 s/50,6 s ohne Sprung) und an Ayman geschickt. Nächster Schritt nach Aymans „los“: Higgsfield-Video (siehe `docs/higgsfield_prompts.md`). Ayman: „direkt rendern ohne Bestätigung, morgen früh fertig“. Neuer Ablauf 60 s: Hof von oben + in Augenhöhe (34,6–40), Parken/Wohnwagen + Schiebetor öffnet/schließt (42,6–47,8, Warnleuchte blinkt), senkrecht von oben über den Wohnwagen (49), Schluss wie Aymans Beispielbild: schräg von oben, Dach öffnet sich (51,6–53,6), Blick in den Gebetsraum (Innen2-Details), Schwenk nach rechts bis 60 s. `sh tools/endfassung_weiter.sh` (fortsetzbar) → danach automatisch `tools/endfassung.py` (Ton `tools/ton.py`: Wind, Stadtrauschen, Bau-Klänge, Torantrieb; −14 LUFS; hochskaliert 1080×1920) → `out/neubau_drohne.mp4` + `out/neubau_drohne_vorschau_720p.mp4`. Higgsfield (Phase 6/7) NICHT ohne Kostenfreigabe. |
| 6 | Higgsfield-Test 5 s (ca. 35 Credits, vorher nennen) | offen |
| 7 | Higgsfield ganz (ca. 250 Credits + Reserve, vorher nennen) | offen |
| 8 | ~~Einblendungen, Abschlusskarte~~ (macht Ayman selbst – kein Text im Video), Ton, Vorschau 720p | vorbereitet (als Vorlage für Ayman): Hadith geprüft + gewählt (`docs/belege.md`: „Wer für Allah eine Moschee baut, dem wird Allah im Paradies etwas Gleiches bauen.“ al-Bukhārī 450 · Muslim 533, ohne Arabisch), QR `assets/qr/paypal_qr.png` (`tools/qr.py`, zxing-geprüft) |
| 9 | Endfassung 1080×1920, −14 LUFS, Prüfung, Titelbild, Beschreibung | offen |

## Verbindung zum Mac (Optionen)
1. **Computer-Ordner freigeben:** Claude-Desktop-App auf dem Mac → Einstellungen → Claude Code → Remote Control → Ordner
   `~/Movies/Neubau` hinzufügen; dann kann diese Sitzung dort Befehle ausführen (nicht für alle Konten verfügbar).
   Blender dann am besten ohne Oberfläche: `/Applications/Blender.app/Contents/MacOS/Blender -b neubau.blend -P skript.py`
   (lange Renderings blockieren nichts, kein MCP-Zeitlimit) – oder über das MCP-Add-on (Port 9876).
2. **Sitzung direkt auf dem Mac:** Claude-Desktop-App (Code) oder `claude remote-control` im Ordner Neubau; dort das
   Blender-MCP einbinden. Dieser Ordner im Repo ist das Gedächtnis.
3. **Notlösung:** Blender hier im Container (5.2.3, CPU, langsam: EEVEE-Rendern ohne GPU kaum möglich, Cycles ~20–40 s/Bild bei 720p).

## Änderungen von Ayman nach dem ersten Animatic (19.11.) – gehen dem AUFTRAG vor
- **Schornstein weg** (stand zu sehr im Weg; `SCHORNSTEIN = False` in `umgebung.py`).
- **Absolut kein Text im Video** – keine Stufen-Einblendungen, kein Titel, kein Logo, keine Abschlusskarte, kein QR im Video.
  Das macht Ayman später selbst. (Hadith-Wortlaut und QR in `docs/belege.md` bleiben als Vorlage für ihn.)
- **Wohnwagen stehen auf den Plätzen rechts** (7 Stück, wie im Beispielbild; Sammlung „Wohnwagen“, Front nur mit einem
  durchgehenden Fensterband – nichts Gesichtsartiges).
- **Hof wie in den Beispielen** (Pflanzbeete mit Büschen + Zypressen, Bodenstrahler, Oliven, Palme, 2 Essplätze mit Schirmen,
  Lounge, Außenküche) und **ein paar Sekunden zeigen** (Drohne ca. 31,6–36 s über dem Hof).
- **Mehr Details** an Gebäude (Sockel, Lisenen, LED-Linien, Attika-Abdeckung, Goldkante am Portal, Laternen, Stufen, Zypressen,
  Natursteinplatten rechts, Fenster zum Hof, Ringleuchten + Regal innen, Dachtechnik) und Parken (Radstopper, Steinpfeiler im Zaun,
  Schiebetor mit Antrieb, Laufrollen, Warnleuchte; Tor gut sichtbar bei ca. 39–40 s).
- **Variante B** als Anfang. Ablauf jetzt 45 s: Hof 30–33,6 · Parken + Wohnwagen 36,4–39,6 · Licht/Dämmerung 39–42 · Schluss 42,4–45.

## Entscheidungen von Ayman (19.11.)
- Verbindung: **Ordner freigeben** (Remote Control, Ordner „Neubau“ in Filme) – wartet darauf, dass Ayman ihn auf dem Mac hinzufügt.
- Portal: **rechtes Ende** der Glasfassade (Richtung Parkfläche).
- Einfahrt: **rechtes Ende, freitragendes Schiebetor**, ohne Bodenschiene, 5–6 m Durchfahrt (im Video geschlossen).
- Nachbargebäude rechts: **helle Putzfassade**, graues Dach mit Dachfenstern.
- PV-Anordnung: wie Bau-Roadmap, ca. 10 Modul-Streifen von der Glasfront nach hinten, Rest Gründach.


## Änderungen von Ayman am 20.11. nachmittags (gehen dem AUFTRAG vor)
- **Keller unter Moschee UND Hof** (nicht unter Parken/Wohnwagen): Grube x 0…16,5, y 3…29 (`umgebung.py` GY1 = TT, `animation.py` YG = TT),
  Keller-Bodenplatte/Wände bis TT, Innenwand unter der Moschee-Rückwand (Keller_Wand4), `Kellerdecke_Hof` (oben 0,0 unter den Hofplatten).
- **Keller-Innenausbau nach Aymans Beispielbild**: heller Estrich, 12 Betonsäulen, 2 Betontreppen mit Metallgeländer
  (vorn rechts am Portal, hinten links unter dem Hof), warme Wandleuchten (`moschee.py`). Neue Kamerapunkte 10,6 s und 12,6 s tief über der Grube.
- **Wohnwagen** werden nicht mehr von unten aufgebaut: fertig, unsichtbar bis 42,0 + i·0,2 s, fallen 1,8 m leicht auf den Platz
  und federn kurz nach (`animation.py`), Aufsetz-Geräusch in `tools/ton.py`.
- **Keller ohne Trennwand** (eine durchgehende Fläche, Ayman 20.11. abends).
- **Rückwand EG zum Hof aus Glas** (Hinweis aus der Gemeinde, „für Sommer und so“): 6 Hebe-Schiebetüren, Felder 2 und 5 aufgeschoben,
  Blick vom Hof in den Gebetsraum bis zum Mihrab. EG-Tür und EG-Rückfenster entfallen; Quran-Regale an die rechte Seitenwand;
  Waschraum aus dem EG entfernt (gedacht im Keller).
- **Schiebedach über dem Hof**: Alu-Stützen + Laufschienen auf den Hofmauern (4,8 m), 5 Dachfelder; Eigenschaft `offen` an
  `Hofdach_Schienen` (Treiber). Im Video: entsteht geschlossen (33,8–34,2 = Regen), öffnet 35,0–36,6 (Sonne), Kamera schwebt
  darüber und taucht danach durch die offene Fläche in den Hof (Keys 36,2 / 37,4). Motorbrummen in `tools/ton.py`.
- **Neue Endfassung fertig (20.11., 23:32 UTC)**: neu gerendert alles außer 44–48 s; geprüft 1080×1920, 30 fps, 60,0 s,
  −14,2 LUFS, Kontaktbogen ohne Text, Übergänge bei 44 s/48 s ohne Sprung (Bilddifferenz wie Nachbarbilder). An Ayman geschickt.
  Nächster Schritt erst nach Aymans „los“: Higgsfield-Video (`docs/higgsfield_prompts.md`).
- Neu gerendert: alles außer 44–48 s (per Bildvergleich identisch).

## Änderungen von Ayman am 23.11. (gehen dem AUFTRAG vor)
- **Umgebung wie Aymans Bild** (`assets/umgebung_vorlage_ayman.jpg`): links cremefarbene Altbauten (3 Häuser, Schieferdach, Gauben,
  Backstein-Kamine, Gesimse, Fensterbänke, Dachrinnen/Fallrohre, Hauseingang mit Laternen) statt hellblauem Haus/Backstein;
  Lärmschutzwand (grünes Glas) auf der Hochstraße; langes Nachbargebäude und Halle hinter dem Hof mit dunklem Ziegel-Walmdach und
  blauen Dachfenstern; kleines Haus mit rotem Ziegeldach rechts außen; hinten Flachdach-Hallen mit Dachlüftern. Balkon entfernt.
- **Parkplätze andersherum schräg**: Autos fahren von der Gasse vorwärts schräg hinein (`moschee.py`, Vorlage `assets/parken_vorlage_ayman.jpg`).
- **Anfang**: senkrecht von oben über dem leeren Grundstück, Drohne kommt herunter bis auf Augenhöhe vor den (künftigen) Eingang (3,4 s),
  dann steigt sie auf und die Grube entsteht (Rückfrage abgelehnt → sinnvolle Wahl, Ayman kann ändern).
- **Schluss**: Dach öffnet sich NICHT mehr (kein Blick ins OG/Frauenbereich); stattdessen ganzes Grundstück von vorn oben, Hof etwas sichtbar.
- **Maße** (Pläne in `docs/plaene/`): Bestand 1.01 → Hallenteil 16,43 × ca. 25,6 m (Ayman: „ca. 26 × 16“), langer Teil ca. 33 × 10,3 m,
  Gesamtlänge ca. 50 m, Grundstück 900 m². Unser Modell: Moschee + Hof 16,5 × 26 m, Parken/Wohnwagen 33,5 × 12,3 m (mit Vorstreifen) → passt.

## Korrektur von Ayman am 23.11. nachmittags (Bilder `assets/korrektur_pfeile_ayman.jpg`, `front_vorlage_ayman.jpg`, `oben_vorlage_ayman.jpg`)
- **Front bündig** mit den Nachbarhäusern: kein Vorplatz mehr, Moschee y 0,3 … 12,3 (`moschee.py` VOR = 0,3; `animation.py` Y0/Y1;
  `umgebung.py` GY0 = 0,3). Vor der Glasfront nur ein schmaler heller Gehweg-Streifen („Vorplatz“, 1,2 m). Hof jetzt 12,3 … 29 (16,7 m),
  Schiebedach mit 5 Feldern à 3,6 m angepasst. Parken/Wohnwagen enden hinten bei LT = 12,3 = Moschee-Rückwand.
- **Rechte Seite (zum Parkplatz) ganz aus Glas**, EG und OG, Pfosten wie vorn (`EG/OG_Glas_rechts`, `EG/OG_Pfosten_rechts`); Quran-Regale niedrig davor.
- **Proportionen**: Häuserzeile links jetzt schmal (7,2 m, x −7,6 … −0,4) und lang (4 Abschnitte bis y 35), 3 Geschosse (Traufe ~9,4 m),
  Giebel zur Gasse mit Haustür + Laternen, kleine Dachfenster zur Moschee → Moschee-Front (16,5 m) wirkt im richtigen Verhältnis.
  Dahinter Gehweg + Straße mit Mittellinie unter/neben der Hochstraße.
- **Gegenüber**: durchgehende Reihe aus 10 alten Hallen (je 9,5 m, Giebel zur Gasse, dunkle Ziegel-/Schieferdächer mit Dachfenstern,
  Lüfter, Brandwände, Fenster + Rolltore); weißes Haus, Garagen und Shedhallen vorn entfernt.
- **PV** in 3 langen Reihen quer über das Gründach (wie Aymans Bild von oben).
- Kamera: Key 6,0 s über der Gasse, neuer Key 22,2 s – Kamerapfad per Skript geprüft (keine Kollision mit Hallen/Häusern).
- Wichtig: Szene immer komplett neu bauen (umgebung → moschee → animation), sonst bleiben alte Kameras im .blend.
- **Parkplätze neu geplant** (Ayman: „Sinn ergeben, quer aber parallel und ordentlich“): 4 Schrägplätze 75° zur Fahrgasse,
  2,45 × 4,8 m, alle Striche parallel, Abschlusslinie zur Fahrgasse, Bordstein (0,5 m) vor der Glaswand, Radstopper quer in
  jedem Platz, Fahrgasse 3,7 m mit Pfeil (Symbol), Randlinie zu den Wohnwagen; niedrige Hecke hinter den Plätzen.
- **Wetter heller** (Ayman: „viel zu dunkel“): Sonne 38° hoch (statt 13°), neutral-warmes Tageslicht, hellerer blauer Himmel,
  keine Dämmerung mehr am Schluss (`umgebung.py` Licht, `animation.py` Sonne/Himmel-Keys).
- **Nachkorrektur 23.11. abends**: Pfeil und lange Linien bei den Parkplätzen entfernt (nur die parallelen Platzstriche);
  Helligkeit auf die Mitte gestellt (Sonne 25°, Sonne 4,8 warm-neutral, Himmel 0,3, Belichtung −0,1).
  Vergleichsbild wie Aymans Draufsicht: `out/phase5/neu4_von_oben.jpg`.
- **Fototexturen** (Ayman: „blockartig, bitte detailreicher“): freie CC0-Texturen von Poly Haven (`tools/polyhaven_laden.py` →
  `assets/tex/ph/`, Netz: api.polyhaven.com + dl.polyhaven.org freigegeben). `blender/ph_texturen.py`: Box-Projektion auf
  Objektkoordinaten, Farbe auf Zielton normiert (Details bleiben), Rauheit + Höhen-Bump. Schiefer, graue/rote Ziegel, Putz,
  Beton, Asphalt, Kies, Backstein, Rasen, Hecke, Hofplatten, Gehweg, Naturstein Moschee (nur 30 % Textur → neu und sauber).
  Dächer < 45° geneigt (Box-Projektion). Renderzeit ~20 s/Bild.
- **3 Technik-Kästen auf dem Moscheedach entfernt** (Ayman 23.11.).
- Hinweis an Ayman: sein Vergleichsbild ist KI-erzeugt (Bild-KI), nicht Blender; den Foto-Look bringt später der Higgsfield-Schritt.
- Offen: Schlussansicht höher + Zoom (weniger Perspektive)? Ayman noch nicht geantwortet.
- **Proportionen nach Aymans Chef** (`assets/proportionen_chef.jpg`: „Bau länger, Parkplatz kürzer“): BT = 20 m statt 16,5 m
  (Plan sagt 16,43 m – bewusste Abweichung für die Wirkung im Video), Parken 9 m (PK = 29), Wohnwagen 7 × 3,0 m (statt 3,5 m).
  Innenpositionen mit X() skaliert (`moschee.py`), Kamera-x mit XU() umgerechnet (`animation.py`, Tor-Szene 43–48,5 s unverändert),
  Glasfront 11 Felder. Kamerapfad geprüft (keine Kollision). Verhältnis Moschee : Rest jetzt ~1 : 1,5 im Bild.
- **Wohnwagen neu modelliert** (Vorlage `assets/wohnwagen_vorlage_ayman.png`): abgerundeter Aufbau (Profil + Bevel), Panorama-Front
  über die Schräge, LED-Leiste, dunkle Frontschürze, grauer Seitenstreifen mit schräger Vorderkante, je Seite 2 Fenster mit Rahmen
  und Vorhängen, Tür mit Fenster und Griff, Schweller, Radkästen, Tandemachse mit 4 Rädern + Alufelgen, Deichsel (A-Rahmen,
  Haube, Kupplung, Stützrad), L-Rücklichter + Lichtband, Stoßfänger, leeres Kennzeichenfeld, 3 Dachluken, Klimagerät.
  KEINE Schriftzüge/Logos (Regel). Alle Teile heißen `Wohnwagen{i}_*` (Fall-Animation greift sie).
- **Dachfenster echt eingebaut** (Vorlage `assets/dachfenster_vorlage_ayman.png`, „nicht draufgeklatscht, nicht so viele“):
  `dachfenster_bauen()` in `umgebung.py`: Eindeckrahmen, Blendrahmen als Ring (ragt 14 cm aus dem Dach), eingesetztes blaues Glas,
  Sprossenkreuz. Anzahl: Halle hinten 3, langes Nachbargebäude 3 versetzt, je Halle gegenüber 1, je Altbau-Abschnitt 1.
  Dunklere Ziegel (#46423E).
- Neu-Rendern komplett seit 23.11. ~19:15 UTC, ~10 h (`sh tools/endfassung_weiter.sh`).

## Keller-Stützenraster + Festsaal (Ayman 23.11. abends; Bilder `assets/keller_raster_architekt.jpg`, `keller_raster_architekt2.jpg`)
- **WICHTIG: KEIN Video-Rendern ohne ausdrücklichen Befehl von Ayman!** (Das Neu-Rendern vom 23.11. wurde auf seinen Wunsch
  bei Bild 386/1800 gestoppt. Die Bilder in `out/phase5/end/` sind veraltet und müssen vor dem nächsten Rendern gelöscht werden.) Standbilder als Vorschau sind erlaubt.
- Stützen wie beim Architekten: **je Raum 3×3 = 9 Stützen** (Raum unter der Moschee und Raum unter dem Hof), auf allen Geschossen.
  Nur die **Mittelstütze steht frei**, alle anderen sitzen **stark nach außen versetzt in den Außenwänden** (Keller: `Keller_Wandstuetzen`;
  EG/OG: in Wänden bzw. Glasfassaden, nur `EG_Saeule0`/`OG_Saeule0` in der Mitte). An der Grenze Moschee/Hof (y = Y1) gibt es im Keller keine
  Wand, dort steht die mittlere Stütze frei. Unterzüge entlang der Rasterlinien (`Keller_Unterzuege`).
- Keller wird ein **Mehrzweckraum** für Feiern (Babyfeier, Nikah …) und Wissens-Seminare (siehe unten).
- Vorschau: `out/phase5/keller_raster.jpg`.
- **Mehrzweckraum im Keller (23.11. abends, Vorlage: Aymans Festsaal-Video, Standbilder `assets/festsaal_vorlage_ayman.jpg`):**
  `blender/festsaal.py` (öffnet neubau.blend, speichert `blender/festsaal.blend`; Video unverändert), Texturen `tools/festsaal_texturen.py`
  (Marmor 120×120 weiß mit feinen Adern, Teppich mit Ornament-Bordüre, nur Geometrie).
  **Ayman 23.11.: Raum für Feiern UND Wissens-Seminare – kein reiner Hochzeitssaal (keine Bühne/Sofa, kein Teppich davor), wenig Schmuck,
  kein Gold, nicht zu edel, nichts zu glänzend.** Stand: matter Marmorboden, Kassettendecke mit LED-Lichtfugen + 80 Einbaustrahlern,
  10 schlichte Ringleuchten, 3 weiß verkleidete Stützen, 24 runde Tische mit weißer Decke (ohne Deko) × 10 schlichte Bankettstühle,
  1 Teppich am Eingang, Bildschirm + Rednerpult an der Rückwand, Treppen hinter weißen Wänden mit Doppeltür.
  Standbilder: `blender/festsaal_bild.py` → `out/phase5/festsaal_blick.jpg`, `festsaal_ecke.jpg`.

- **Farbvarianten (23.11.)**, Ayman: „zu weiß“: `FARBE=A|B|C` beim Bauen (→ `festsaal_A.blend` …), Probebild `out/phase5/saal_farbvarianten.jpg`.
  A Warm & Holz (Wände sand, Eiche unten, Stühle taupe, Läufer salbeigrün) · B Salbeigrün (Wände grün, Stühle grau, Läufer sand) ·
  C Holzboden (Eiche, Wände hell-warm, Stühle anthrazit, Läufer terrakotta). **Ayman wählt C, Boden bleibt; Tischdecken + Stühle besser
  kombinieren** → `FARBE=C1|C2|C3`, Probebild `out/phase5/saal_farbvarianten_C.jpg` (1 sand/taupe/salbei, 2 olivgrün, 3 cognac).
- **AYMANS WAHL (23.11., Bild `assets/saal_wahl_ayman.jpg`) = Standard `FARBE=W`:** wie A (Marmorboden matt, Wände sandbeige, Holz unten an
  den Wänden), aber **dunkelbraunes Holz** (`assets/tex/festsaal/holz_dunkel.jpg`) an der Wand und bei den Stühlen (Holzstühle dunkelbraun),
  **Tischläufer in derselben Farbe**, Tischdecken weiß, in der Tischmitte je eine **etwas größere marokkanische Atay-Kanne** (Silber) auf
  Silbertablett mit **6 traditionellen Teegläsern** (grün/blau/rot, Goldrand, mit Tee). Vorschau `out/phase5/saal_wahl.jpg`.
- **Ayman 23.11. (Tisch-Vorlage `assets/tisch_vorlage_ayman.png`, „daran halten“):** Stühle aus echtem Holz, gepolstert (runde Beine,
  Zarge, Querstreben, Polster Sitz + Lehne); Teegläser kräftig bunt durchscheinend mit breitem Goldband; Atay-Kanne gebürstetes Silber
  (**nicht so stark spiegelnd**), gerillter Deckel mit Spitze, eckiger Griff; Tablett matt; Tischdecke Damast creme (`tools/damast_textur.py`);
  **Säulen unten (bis 1,1 m) + Band unter dem Kapitell in dunklem Holz.** Vorschau `out/phase5/saal_wahl.jpg`.
- **Wohnwagen-Ausfahrt (Ayman 23.11.):** Mit festem Zaun (x 29–44) + Steinpfeilern + nur 6 m Schiebetor kamen 5 von 7 Wohnwagen nicht heraus
  (Rangierfläche nur 4,5 m tief, nötig ≈ 8 m). **Neu:** fester Zaun, Zwischenpfeiler, Torantrieb entfallen; über die ganze Breite
  (21 m) **3 Schiebeflügel à ~7 m auf 3 parallelen Bodenschienen mit Kippsicherung**, von Hand verschiebbar und hintereinander schiebbar
  → jede Stelle bis 14 m breit zu öffnen, jeder Wohnwagen fährt gerade nach vorn hinaus. Nur außen schlanke Stahl-Endpfosten (12 cm),
  Abstand zum äußeren Wohnwagen 0,23 m. Objekte `Schiebetor` (rechter Flügel, Eigenschaft „offen“), `Schiebetor_FluegelA/B`,
  `Schiebetor_Schienen`, `Schiebetor_Pfosten`. Vorschau `out/phase5/tor_neu.jpg`. Genaue Ausführung (Schienen, Kippsicherung) mit einem Metallbauer klären.
- **Ayman 23.11.: keine Bodenplatte vor der Moschee** (Objekt `Vorplatz` entfernt). Glasfront bündig mit dem Nachbarhaus links, davor wie beim
  Nachbarn Randstein + Gasse. Portal mit Stufen, Laternen und Zypressen-Kübeln bleibt. Vorschau `out/phase5/front_buendig.jpg`.
- **Ayman 23.11.: roter Gebetsteppich** in der Moschee (EG + OG, Vorlage `assets/moschee_teppich_vorlage_ayman.png`): kräftiges Rot mit samtigem
  Flor, beige Reihenstreifen alle 1,2 m parallel zur Qibla-Wand (vorher grün, Streifenabstand war fälschlich 0,38 m). Vorschau `out/phase5/teppich_rot.jpg`.
- **4 Autos auf den Parkplätzen (Ayman 23.11., Vorlagen `assets/autos/auto1…4_*.png`):** `blender/autos.py` (wird am Ende von moschee.py
  per exec ausgeführt – keine eigene Pipeline-Stufe). Karosserie als Loft (Seitenlinie, Gürtellinie, Grundriss, Radhäuser), Scheiben/Säulen
  per Material, Lichter/Grill/Kennzeichen/Türfugen als projizierte Aufkleber, Räder eigene Objekte (drehen + lenken).
  **Kein Text: keine Logos/Schriftzüge, Kennzeichen leer.** **Reihenfolge (Ayman 23.11.) von der Gasse aus: Platz 0 weißer
  Sportback (Auto3), Platz 1 schwarzes SUV (Auto4), Platz 2 grauer Kompakt (Auto2), Platz 3 schwarzer Kompakt-Sportwagen (Auto1).**
  Video: die beiden schwarzen (Auto4, Auto1) werden bei 42,5/42,75 s wie die Wohnwagen auf den Platz gesetzt; **Auto3 (weiß) parkt 48,4–54,8 s ein,
  Auto2 (grau) 50,6–57,4 s**.
  Vorschau `out/phase5/autos_parkplatz.jpg`. Feinheiten macht Ayman später mit Higgsfield (ebenfalls ohne Text/Logo).
- **Eingang hübscher (Ayman 23.11., Vorlage `assets/eingang_vorlage_ayman.jpg`):** Rundbogen statt Spitzbogen, vorstehender Sandstein-Bogenrahmen
  mit Schlussstein, anthrazit gerahmte Glas-Doppeltür (Edelstahl-Stangengriffe), Kämpfer + Oberlicht, Sprossen, Fächer im Bogen; schwarze
  Zylinder-Wandleuchten mit Licht nach oben/unten (Spots `Wandlicht_*`) an den Portalpfeilern und an jedem 2. Pfosten der Glaswand zum
  Parkplatz; Kegel-Thujen in hellen Betonkübeln am Eingang; **am Parkplatz an jeder Platzgrenze vor der Glaswand eine schlanke Thuja im
  Kübel mit Bodenstrahler** (`Parken_Thuja*`, `Parken_Strahler*`). Lichter gehen bei 49–50,6 s an (bei Tageslicht nur schwach sichtbar).
  Vorschau `out/phase5/eingang.jpg`.
- **Rückwand hinter Wohnwagen + Parkplatz (Ayman 23.11., wie rechts im Eingangs-Vorlagebild):** Hecke → Rindenmulch-Beet mit Reihe Kegel-Thujen
  (`Parken_Thuja_B*`; hinter den Wohnwagen 3,0–3,45 m hoch, hinter dem Parkplatz 2,0–2,45 m), jede 2. mit Bodenstrahler; an der Brandwand
  10 schwarze Zylinder-Wandleuchten mit Licht nach oben/unten (hinter den Wohnwagen auf 3,35 m, hinter dem Parkplatz auf 2,25 m).
  Korrigiert: Lichtkegel der Wandleuchten waren vertauscht, Bodenstrahler zeigten nach unten. Vorschau `out/phase5/rueckwand_gruen.jpg`.
- **Hof nach Aymans Bild von oben (23.11., `assets/oben_vorlage_ayman.jpg`):** warme beige Platten, breite Beete ringsum (211 Laubbüsche in 4 Grüntönen,
  Blütenpunkte, Palmen mit gefiederten Wedeln, Thujen in den Ecken), Strahler in den Beeten (leuchten die Mauern an), Zylinder-Wandleuchten,
  2 runde Essplätze mit runden weißen Schirmen, 2 lange Holztische mit Holzstühlen, weiße Lounge hinten links, Außenküche + Grill hinten rechts,
  Palmen in Kübeln. Vorschau `out/phase5/hof_neu.jpg`.
- **WICHTIG (Ayman 23.11.): Hof NICHT über die ganze Breite – nur HX0 = BT − 16,43 … BT (16,43 m, rechtsbündig, wie im Vorlagebild und
  Architektenplan). Links davon (x 0 … 3,57, hinter der Moschee) ist Fläche des NACHBARN – nicht nutzen.** Konstante `HX0` in moschee.py,
  festsaal.py, umgebung.py, animation.py. Folgen: Hofmauern, Beete, Möbel, Schiebedach schmaler; Keller **L-förmig** (unter der Moschee voll,
  unter dem Hof nur 16,43 m; Wand 4 = Absatz, Wand 5 = linke Wand unter dem Hof), Stützenraster Hofteil x = HX0 / Mitte / BT, Treppe B nach
  rechts verschoben, Baugrube L-förmig, Nachbarstreifen mit eigenem Pflaster (`Nachbar_Hof_Pflaster`); Festsaal L-förmig, 20 Tische (200 Plätze),
  Bildschirm in der Mitte der Rückwand unter dem Hof. Vorschau Saal `out/phase5/saal_lform.jpg`.
- **Hof überarbeitet (Ayman 23.11.): KEINE Palmen.** Beete: Laubbüsche, Buchskugeln an der Kante, schlanke Thujen (alle ~3 m + Ecken);
  in Kübeln 5 Olivenbäume (hohe Betonkübel, von unten angestrahlt). **Hochwertige Möbel aus gemasertem Teak:** 2 runde Säulentische + 2 Tafeln
  mit Zarge, 28 Armlehnstühle mit dicken Creme-Polstern, Sonnenschirme mit Holzstange/8 Speichen/Volant, Laternen auf den Tischen;
  Lounge: Outdoor-Teppich, großes L-Sofa (Teak-Sockel, dicke Polster, Zierkissen terrakotta/salbei/sand), 2 Sessel, Couchtisch mit
  Travertin-Platte, Bodenlaternen; Außenküche mit Edelstahl-Grill. Licht: Wandleuchten (auf/ab) an den Seitenmauern UND an der hinteren Wand,
  Strahler in den Beeten, Laternenlicht. Vorschau `out/phase5/hof_neu.jpg`.
- **Nachbar rechts (Ayman 23.11., mehrfach korrigiert – Bild von oben „genau so“):** Das lange Nachbarhaus hinter den Wohnwagen läuft
  nach rechts weiter (bis x 72). Davor hängt der orangene Anbau mit Pultdach (x 50,3 … 60, nur 4 m tief, y 8,6 … 12,6; hohe Seite am langen Haus),
  davor ein heller Plattenhof bis zur Gasse, Grenzmauer zu den Wohnwagen. Rechts daneben (ab x 60) das nächste Haus, das vorn bis an die Gasse
  reicht. Kahler Baum nach hinten versetzt. Vorschau `out/phase5/nachbar_rechts.jpg` (oben Vorlage, Mitte Modell).
- **Dach wie Vorlage (Ayman 23.11., `assets/gruendach_pv_vorlage_ayman.jpg`):** 3 Reihen à 17 aufgeständerte PV-Module (25° zur Gasse geneigt,
  silberner Rahmen, Alu-Dreiecksgestelle, Längsträger) – Objekt `PV_Module` enthält Module + Gestelle; Gründach mit 3D-Bewuchs
  (`Gruendach_Bewuchs`: ~950 Grashorste grün bis strohgelb, Sedum-Polster, Blütenpunkte). Higgsfield soll das später fotoreal machen.
- **Bilder für den Chef:** `out/chef/1…10_*.jpg` (1280×720; 9 = Hof mit Blick durch die Glaswand in die Moschee, 10 = Dach).

## FAHRPLAN ab 23.11. abends (mit Ayman abgestimmt) – Higgsfield-Budget max. 550 Credits
Higgsfield-Preise (Abfrage 23.11., Seedance 2.5 `video_edit`, 9:16, ohne Ton): **720p = 7,5 Credits/s** (30 s = 225, 13 s = 98),
480p = 3,5 Credits/s (30 s = 105); **ein Auftrag max. 30 s**. Guthaben 996,5.
→ **Bei 720p reichen 550 Credits für höchstens 73 s.** Vorschläge: (a) **72 s = 3 Teile à 24 s = 540 Credits** (+ 8 Credits für 4 neue
Stil-Referenzbilder = 548), kein Puffer; (b) 60 s = 2 × 30 s = 450 Credits, 100 Credits Puffer für eine Wiederholung (~13 s). **Ayman wählt (a): 72 s, 3 × 24 s, 548 Credits.**
1. Ayman prüft das Vogelperspektive-Bild (`out/chef/11_vogelperspektive.jpg`) – letzte Korrekturen am Modell.
2. Videolänge festlegen (60 oder 72 s) → Claude passt Kamerafahrt + Ablauf an (bei 72 s: mehr Zeit für Dach/Solar, Hof, Parkplatz/Einparken,
   Wohnwagen/Schiebetore), zeigt Standbilder der Schlüsselstellen.
3. **Nur auf Aymans ausdrücklichen Befehl:** Blender-Video rendern (720×1280, ~25 s/Bild → 60 s ≈ 12 h, 72 s ≈ 15 h), automatisch mit Ton.
4. Claude prüft (kein Text/Logo, Übergänge, Lautheit −14 LUFS) und schickt es Ayman.
5. Ayman schaut es an und sagt „los“ → Claude aktualisiert `docs/higgsfield_prompts.md` (neuer Stand: kein Dachöffnen, Hof 16,43 m, Autos ohne
   Logos/Kennzeichen leer, Gründach + aufgeständerte PV, Thujen/Lichter, orangener Anbau …), nennt die genauen Kosten, Ayman bestätigt.
6. Higgsfield Seedance 2.5 video_edit 720p in Teilen (≤ 30 s), keine Musik, kein Text.
7. Claude schneidet die Teile zusammen, skaliert auf 1080×1920, eigener Ton (keine Musik), prüft und schickt das Endvideo.

## VIDEO 72 s, 16:9 QUER (Ayman 24.11.) – Render gestartet auf Aymans Befehl („dann rendern“), OHNE Higgsfield
**Format: 16:9 Querformat (1280×720 gerendert → 1920×1080).** Higgsfield erst nach Aymans ausdrücklichem Go (er braucht vorher das Go seines Chefs).
Ablauf (Schnitte bei 24 s und 48 s = Higgsfield-Teilgrenzen):
- 0–24 s `Drohne_B`: von oben herab zum Eingang, dann Bau-Zeitraffer im Bogen (alte Bauzeiten 3,4–44 s per R() auf 3,4–24 s gestaucht);
  Hofdach erscheint fertig (nicht aufgebaut), fährt 18,9–19,8 zu und 20,1–21,0 wieder auf; Lichter an 21,5–23 s.
- 24–29,5 s `Rundgang_1`: in Augenhöhe auf der Gasse auf den Eingang zu, Blick staunend den Bogen hinauf (18 mm).
- 29,5–35,5 s Keller: langsame Fahrt durch den Mehrzweckraum (tools/keller_clip.py aus festsaal.blend).
- 35,5–48 s: über der Attika, tief zwischen den Solarreihen entlang, dann durch das offene Hofdach in den Hof.
- 48–54,5 s `Rundgang_2`: sitzend am Teaktisch, Blick schweift über Lounge, Schirme, Oliven bis durch die Glaswand in die Moschee.
- 54,5–61 s: steigt senkrecht aus dem Hof, schwebt zur hinteren Parkplatz-Ecke; 61–66,5 s Eckblick (Glaswand, Thujen, Eingang),
  weißes Auto parkt 59,4–64,8, graues 61,4–67,2 ein; 66,5–72 s hebt ab, Schiebetor öffnet/schließt, Schluss schräg über das Grundstück.
Neu gebaut: Kameras mit Brennweiten-Animation, Zeitmarken-Schnitte (`kamera_wechsel` in der Szene, animatic.py schaltet je Bild),
Deckenleuchten erst mit der Dachplatte (schwebten), PV-Streben korrigiert, ton.py 72 s. Rendern: `sh tools/endfassung_weiter.sh`
(Keller-Clip zuerst, dann animatic, dann Zusammenbau). ~2160 Bilder, geschätzt 12–15 h.
