# AUFTRAG „PROJEKT MOSCHEE NEUBAU – DROHNENFLUG MIT BAU-ZEITRAFFER“ (von Ayman, 19.11.2026, wörtlich übernommen)

für Masjid As-Sunnah Ratingen (Instagram/TikTok @sunnahmoschee)

## 0. WER, WIE, WOMIT
- Auftraggeber: Ayman. Macht die Inhalte für die Masjid As-Sunnah Ratingen.
  Ist kein Techniker, arbeitet viel am iPad, schreibt Deutsch.
  → Alles einfach auf Deutsch erklären. Fragen als kurze Auswahl.
  → Nach JEDER Phase stoppen, Vorschau als Bild oder kurzen Clip schicken,
    Freigabe abwarten. Nichts erneut fragen, was hier schon entschieden ist.
- Falls ein Repo mit Projektgedächtnis existiert (gebet-video/, PROJEKTGEDAECHTNIS,
  UEBERGABE.md): zuerst lesen; dieses Projekt in einem neuen Ordner neubau-video/
  anlegen und das Gedächtnis nach jeder Phase aktualisieren.

BLENDER LÄUFT AUF AYMANS MACBOOK (nicht im Container):
- Blender 5.3.0, macOS, Apple Silicon (arm64).
- Verbunden über das offizielle Blender-Lab-MCP-Add-on (Port 9876).
  Werkzeuge: execute_blender_code (Python mit bpy), get_objects_summary,
  render_viewport_to_path, render_thumbnail_to_path,
  get_screenshot_of_window_as_image u. a.
- Verbindung zuerst testen (bpy.app.version_string ausgeben). Wenn sie nicht
  geht: Ayman bitten, Blender zu öffnen und in Einstellungen → Add-ons →
  MCP auf „Start MCP Server" zu klicken.
- Achtung: Der Code läuft ungeschützt in Aymans Blender → nur Szene-Code, nichts
  am System ändern, keine Dateien außerhalb des Projektordners anfassen.
- Arbeitsdatei: ~/Movies/Neubau/neubau.blend (Ordner anlegen lassen bzw. Ayman
  bitten, den Ordner „Neubau" freizugeben). Nach jedem größeren Schritt speichern
  (bpy.ops.wm.save_as_mainfile), Zwischenstände als neubau_v01.blend, v02 …
- Lange Renderings blockieren Blender und können das MCP-Zeitlimit sprengen:
  Animationen in kleinen Abschnitten rendern (z. B. 30–60 Bilder pro Aufruf)
  oder per Timer im Hintergrund starten und den Fortschritt abfragen.
  Ausgabe als PNG-Bildfolge in ~/Movies/Neubau/render/<stufe>/, fortsetzbar.
- Bilder/Videos vom Mac in den Container holen (für ffmpeg, Higgsfield,
  Vorschau) über die Datei-Werkzeuge des verbundenen Ordners.

## 1. IDEE
Eine Drohnenaufnahme im Hochformat 9:16. Die Kamera IST die Drohne (keine Drohne
im Bild). Sie fliegt in EINER durchgehenden Fahrt um das Grundstück, wechselt
Seiten und Höhen. Gleichzeitig entsteht die Moschee von selbst, von unten nach
oben, in 6 Stufen (Bau-Roadmap): Aushub Keller → Keller & Bodenplatte →
Erdgeschoss → 1. Etage → Decke & PV-Dach → Fertigstellung.
Kein Kran, keine Maschine, kein Mensch – die Bauteile wachsen einfach.
Ablauf: Blender baut alles nach → Rendering → Higgsfield macht es
fotorealistisch → Texte, Logo, Ton per Code darüber.

## 2. FESTE REGELN
- Im Bild NIE: Menschen, Autos, Wohnwagen, Kräne, Bagger, Baumaschinen,
  Gerüste, Bauzaun, Folien, Schutt, Mülltonnen, Tiere, Drohne.
- Keine Musik, keine Instrumente. Ton: Wind, leises Stadtrauschen, dezente
  Bau-Klänge beim Wachsen.
- Higgsfield ist für dieses Video ausdrücklich erlaubt. Vor JEDEM Auftrag
  Kosten nennen und Freigabe abwarten. Aymans Guthaben ca. 1.000 Credits.
- Texte, Logo, Zahlen, QR-Code NIE von Higgsfield erzeugen lassen – immer per Code.
- Hochskalieren lokal (nicht über Higgsfield).
- Name immer „Masjid As-Sunnah". In eigenen Texten nach „Allah" ﷻ, nach dem
  Propheten ﷺ. Hadithe wörtlich, mit Quelle, an der Originalquelle geprüft.
- Farben der Moschee: Marineblau #212242 (dunkel #191a36), Gold #CA9E4E
  (dunkel #B88A38). Schrift: Montserrat. Logo aus assets/brand/
  bzw. von Ayman.

## 3. UNTERLAGEN (Ayman lädt sie hoch → assets/ref/neubau/)
 a) plan/      Architektenplan „Ersatzneubau Werkhallen" (Foto, 1:200)
 b) bilder/    ca. 16 KI-Visualisierungen + „Bau-Roadmap" (Idee & Aussehen)
 c) umgebung/  4 Fotos aus der Gasse (Grundstück heute, Schornstein, Nachbarn)
 d) karte/     Apple-Maps-Screenshots (3D-Ansicht + Satellit)
Fehlen Unterlagen: Ayman konkret darum bitten. Ideal wäre der Plan als PDF.

## 4. ENTSCHEIDUNG: WAS GEBAUT WIRD
Das Video zeigt die Version aus den BILDERN: Moschee + Innenhof + Parkfläche +
Wohnwagen-Stellfläche. Der Architektenplan (L-Bau aus „Kranbahnhalle" + Riegel)
wird NICHT gebaut – er liefert nur Form, Grenzen und Maße des Grundstücks.
Die KI-Bilder widersprechen sich (Umgebung, Anzahl Wohnwagen, PV-Anordnung,
Portal-Lage). Verbindlich sind diese Datei und Aymans Korrekturen.

## 5. GRUNDSTÜCK UND MASSE (aus dem Plan abgeleitet, ca. ±1 m)
- 900 m², L-förmig, an der Gasse ca. 48 m lang.
- TIEFER TEIL (links, neben den Backstein-Altbauten): ca. 15,5 m breit,
  ca. 28 m tief (vorne ca. 3 m freie Zone zur Gasse).
  Links: Rückseiten der Altbauten. Hinten: alte Backsteinmauer mit
  Betonpfeilern. Rechts hinten: Stirnwand des langen Nachbargebäudes.
- LANGER TEIL (rechts, vor dem langen Nachbargebäude): ca. 32 m lang,
  ca. 12 m tief bis zur Gasse. Hinten: Brandwand des langen Nachbargebäudes
  (heute rote Folie) → im Video helle Putzwand.
- Herleitung: Plan zeigt „Kranbahnhalle" 393 m² (≈15,5 × 25 m), „Werkhalle"
  256 m² + 2 Treppenhäuser (≈32 × 9 m); 745 m² bebaut, 155 m² frei.

Lageplan (Blick von der Gasse, oben = hinten):

```
  +-----------------+
  |  HOF            |   ← rechts: Stirnwand Nachbargebäude
  |  ~15,5 × 13 m   |
  +-----------------+------------------------------------------+
  |  MOSCHEE        |  Brandwand des langen Nachbargebäudes     |
  |  ~15,5 × 12 m   |  PARKEN      |  WOHNWAGEN-STELLPLÄTZE      |
  |  2 Geschosse    |  (4 schräg)  |  (6–7 quer, leer)           |
  |  + Keller       |              |                             |
  +--Glasfront--[Portal]---------Zaun ------------[Schiebetor]---+
  |  Vorplatz ~3 m  |
  ================ GASSE (Pflaster) =============================
          gegenüber: runder Schornstein + weißes Haus
  Links neben Moschee und Hof: Backstein-Altbauten, dahinter die Hochstraße.
```

## 6. DIE MOSCHEE (Aussehen aus den Bildern + Aymans Korrekturen)
- Maße: ca. 15,5 m (Gassenseite) × 12 m. EG Männer 5,5 m (5–6 m),
  1. Etage Frauen 2,8 m (2,5–3 m), mit Decken und Attika ≈ 10 m hoch.
- KELLER nur unter der Moschee, ca. 15,5 × 12 m, ca. 3 m tief.
  Hof und Parkfläche sind NICHT unterkellert.
- Straßenfassade: Glasfassade VOLLSTÄNDIG über die ganze Gassenseite, vom Boden
  bis zum Dach, beide Geschosse; leicht blau getönt, schlanke Pfosten,
  schmales Band auf Höhe der Geschossdecke. Vor der Fassade KEINE Autos,
  sondern ca. 3 m gepflasterter Vorplatz.
- Portal am rechten Ende (Richtung Parkfläche): hoher Rahmen aus hellem
  Naturstein, Spitzbogen-Glastür.
- Flachdach: Gründach + PV-Module (Anordnung wie in der Bau-Roadmap).
- Innen, durch das Glas sichtbar (schlicht): grüner Gebetsteppich mit Reihen,
  Mihrab-Nische, Minbar aus Holz, Säulen, Frauen-Etage, warmes Licht.
- HOF hinter der Moschee, ca. 15,5 × 13 m, ummauert: Bodenplatten,
  Pflanzkübel, Olivenbäume, Bänke, Sitzgruppen mit Schirmen.
- PARKFLÄCHE direkt rechts neben der Moschee: 4 schräge Stellplätze (ca. 9 m
  breit) – LEER, nur Markierungen.
- WOHNWAGEN-STELLPLÄTZE im Rest des langen Teils (ca. 23 m): 6–7 Plätze quer
  (je ca. 3,3 × 7,5 m) – LEER, nur Markierungen. Entlang der Rückwand Hecke
  und Wandleuchten wie in den Bildern.
- ZAUN an der Gasse vor den Wohnwagen-Plätzen: dunkler Stabgitterzaun wie in den
  Bildern, aber schon als Schiebetor angelegt:
  · feste Zaunfelder + eigenes Objekt „Schiebetor" an der Einfahrt (rechtes
    Ende, laut roter Markierung in Aymans Bild – bestätigen lassen)
  · Vorschlag: freitragendes Schiebetor (ohne Bodenschiene, rollt hinter das
    feste Zaunfeld), Durchfahrt ca. 5–6 m; bei wenig Platz Teleskop-Schiebetor
  · im Video geschlossen; Laufweg als Animation vorbereitet, aber aus.

## 7. ECHTE UMGEBUNG (aus Fotos + Karte – NICHT wie in den KI-Bildern)
Lage: alter Gewerbehof neben dem Westbahnhof, Ratingen (Am Westbahnhof 31).
- GASSE vor der Moschee: grau-beiges Verbundpflaster, dunkle Randsteine,
  Gullys. Führt zum Torgebäude des Gewerbehofs (helle Fassade, rundes Fenster,
  Rundbogentür, große offene Durchfahrt; Schriftzug weglassen). Dahinter große
  Kiefer, kahler Laubbaum, Mobilfunkmast.
- GEGENÜBER DEM EINGANG: freistehender, runder Backstein-SCHORNSTEIN, rot,
  stellenweise verputzt/geflickt, oben etwas schmaler, deutlich höher als
  alles ringsum (geschätzt 25–30 m) → Wahrzeichen des Videos. Daran ein weiß
  verputztes 2-geschossiges Haus (weiße Fenster mit Rollläden, Glas-Vordach mit
  schwarzem Ziergestell), davor rötliches Pflaster.
- LINKS: hellblau/weiß verputztes mehrgeschossiges Haus mit Außentreppe aus Beton
  und Metallgeländer; dahinter rote Backstein-Altbauten (3–4 Geschosse,
  Satteldächer, Rückseiten zum Grundstück, Balkon mit rotem Geländer).
- HINTEN: Backsteinmauer mit Betonpfeilern, dahinter altes Hallendach
  (Wellplatten).
- RECHTS: langes Gebäude mit grauem Dach und vielen Dachfenstern (wird gerade
  saniert) → ohne Gerüst/Folie, schlichte helle Putzfassade
  (Ayman fragen, wie es nach der Sanierung aussieht).
- HOCHSTRASSE: breite Straße (2 Spuren je Richtung, Mittellinie), erhöht, mit
  Betonbrüstung, direkt hinter den Altbauten; weiter hinten als Brücke über die
  Bahngleise. LEER. Graffiti weglassen.
- Ringsum alte Fabrikhallen mit vielen Sheddächern (Sägezahn, graue
  verwitterte Platten mit Flicken, Lichtbänder), weiter hinten große helle
  Gewerbehallen mit Flachdächern, ein leerer Parkplatz, ein Haus mit rotem
  Ziegeldach, einzelne Bäume, ganz hinten Grüngürtel mit Feldern.
- Bauweise: Satelliten-Screenshot als Lageplan (entzerren, Maßstab z. B. über
  Fahrspur ≈ 3,5 m). Nahe Gebäude detailliert mit Foto-Texturen aus Aymans
  Fotos (Backstein, Putz, Schornstein, Pflaster – entzerrt, gekachelt);
  Weiteres als texturierte Baukörper; ganz hinten Hintergrundbild.
- Licht: späte Nachmittagssonne, warm, lange Schatten (der Schornstein wirft
  einen langen Schatten über die Dächer). Am Ende Dämmerung: Licht im
  Gebetsraum und an den Hofmauern geht an.

## 8. BAU-ZEITRAFFER (6 Stufen, ca. 36 s + 6 s Abschlusskarte)
Technik: jedes Bauteil wird von einer nach oben wandernden Schnittebene
aufgebaut (Geometry Nodes, Delete Geometry über Z bzw. Reihenfolge-Index),
leicht zeitversetzt, gleichmäßig, weich. Nichts fliegt herein.
Endstufe als Einstellung END_STAGE (Standard 6).
```
 0  0–4 s   Ausgangslage: aufgeräumtes, eingeebnetes Grundstück (Schotter).
 1  4–8 s   AUSHUB KELLER: Boden senkt sich in Form der Moschee-Grundfläche,
            Holz-/Spundwand-Verbau, Geländer, 2 Treppen in die Grube.
 2  8–13 s  KELLER & BODENPLATTE: Bodenplatte, Kellerwände wachsen,
            Verbau verschwindet, Kellerdecke schließt die Grube.
 3  13–20 s ERDGESCHOSS MÄNNER: Stützen und Rückwände in rohem Beton, dann
            setzen sich die Glasfelder von links nach rechts ein, Portal wächst.
 4  20–25 s 1. ETAGE FRAUEN: Geschossdecke, obere Glasreihe, Band dazwischen.
 5  25–30 s DECKE & PV-DACH: Dachplatte, Attika, Gründach breitet sich aus,
            PV-Module Reihe für Reihe.
 6  30–36 s FERTIGSTELLUNG: Hofplatten, Kübel, Bäume wachsen, Möbel,
            Parkmarkierungen ziehen sich, Licht geht an.
 36–42 s    Abschlusskarte (siehe 11.).
```

## 9. DROHNENFLUG (eine Fahrt, kein Schnitt)
```
 0–4 s   Anfang – im Animatic BEIDE Varianten zeigen, Ayman wählt:
         A) tief in der Gasse hinter dem Schornstein starten, daran vorbei
            hochsteigen, dann Blick auf das Grundstück
         B) hoch starten (Hochstraße, Sheddächer, Schornstein im Bild), dann
            am Schornstein vorbei zum Grundstück absinken
 4–8 s   Schrägblick ca. 45° von der Gasse, Blick in die Grube
 8–13 s  langsame Kurve, Höhe ca. 25 m
 13–20 s tiefer Vorbeiflug über der Gasse an der Glasfassade (6–8 m Höhe)
 20–25 s mit dem Gebäude steigen
 25–30 s über das Dach, steiler Blick auf die PV-Reihen
 30–36 s Bogen über Hof und Parkfläche zur Schlussansicht schräg über der Gasse,
         Schornstein angeschnitten im Vordergrund, Moschee mit Licht
```
- Weich wie eine echte Drohne, ca. 24 mm, leicht nach unten geneigt.
  Nie durch Gebäude oder den Schornstein fliegen.
- 9:16: eher diagonal kadrieren. Wichtiges nicht in die oberen 12 % und
  unteren 20 % (Instagram-Bedienflächen).

## 10. PHASEN (nach jeder stoppen, Vorschau, Freigabe)
- Phase 0  Blender-Verbindung testen, Datei anlegen, Unterlagen sichten.
  Offene Punkte als kurze Auswahl: Portal-Lage, Einfahrt/Schiebetor,
  PV-Anordnung, Fassade des sanierten Nachbargebäudes.
- Phase 1  Lageplan von oben als Bild mit Maßen und Beschriftung.
- Phase 2  Umgebung in Blender; Standbilder von oben und schräg, dazu ein
  Vergleich mit Aymans Fotos aus derselben Perspektive.
- Phase 3  Moschee im Endzustand + Keller; Vergleichsblatt mit 3 Architekten-
  Bildern aus gleichen Blickwinkeln.
- Phase 4  Animatic (Bau-Zeitraffer + Flug, Varianten A/B), 360×640, einfacher Look.
- Phase 5  Rendering 720×1280, 30 fps, EEVEE auf dem Mac, je Stufe eine
  Bildfolge, in Abschnitten; Kontrollbilder.
- Phase 6  Higgsfield-TEST: 5 s aus Stufe 3, Seedance 2.5, Modus „video_edit",
  720p, ohne Ton (ca. 35 Credits, vorher nennen). Prompt-Vorlage:
  „Photorealistic aerial drone footage, construction time-lapse of a
   modern mosque with a full glass facade rising floor by floor, in an old
   German industrial courtyard with red-brick buildings, a historic round
   brick chimney and a narrow paved lane, warm late-afternoon light. Keep
   the exact building shape, proportions, glass panels, camera movement
   and timing. No people, no cars, no caravans, no cranes, no construction
   machines, no scaffolding, no construction fence, no plastic sheeting,
   no rubble, no bins, no drone, no text, no logos."
  Optional 2–3 Ausschnitte aus Aymans Fotos als Stil-Referenz – nur
  Ausschnitte ohne Bauzaun, Gerüst, Folie, Autos.
  Prüfen: Form/Fassade gleich? Etwas dazuerfunden? Flackern?
- Phase 7  Alles durch Higgsfield in Abschnitten von 5–10 s mit 1 s Überlappung
  (≈ 7 Credits/s in 720p → ca. 250 Credits + Reserve; vorher genau
  nennen). Fehlerhafte Abschnitte neu erzeugen oder Blender-Version
  nehmen. Danach lokal auf 1080×1920 hochskalieren.
  PLAN B, falls Higgsfield den Bau nicht stabil hält: realistische
  Materialien direkt in Blender (Cycles) rendern.
- Phase 8  Darüberlegen per Code: Logo klein oben, Titel „PROJEKT MOSCHEE NEUBAU"
  am Anfang, Stufen-Einblendung wie in der Bau-Roadmap
  („1 · AUSHUB KELLER" … „6 · FERTIGSTELLUNG"), Abschlusskarte, Ton.
  Vorschau 720p.
- Phase 9  Endfassung 1080×1920, −14 LUFS. Schlussprüfung: in KEINEM Bild Menschen/
  Autos/Wohnwagen/Kräne/Gerüste; QR-Code scanbar; Texte korrekt.
  Titelbild + Beschreibung mit genau 5 deutschen Hashtags.

## 11. ABSCHLUSSKARTE (Stil des Spenden-Beitrags: Marineblau/Gold)
- Hadith: „Wer für Allah ﷻ eine Moschee baut, dem baut Allah ﷻ ein Haus im
  Paradies." – Wortlaut und Quelle an der Originalquelle prüfen.
- Überweisung: Marokkanischer Kulturverein Ratingen e.V.
  IBAN DE35 3345 0000 0042 3034 95 · Verwendungszweck „Neubau"
- PayPal-QR-Code auf genau diesen Link (im Video scanbar, mit zxing prüfen):
  https://www.paypal.com/qrcodes/managed/bf1079a8-bd1e-4110-9456-99a2161943f6?utm_source=payandgetpaid
- Am Westbahnhof 31, 40878 Ratingen · www.masjid-sunnah.de

## 12. ABGABE
neubau_drohne.mp4 (voll), Vorschau 720p, Titelbild, Beschreibung, Lageplan-Bild,
neubau.blend, Liste aller Higgsfield-Aufträge mit Kosten.
Projektgedächtnis aktualisieren; falls Repo: committen und pushen (nur
vereinbarter Zweig, kein Pull Request).
