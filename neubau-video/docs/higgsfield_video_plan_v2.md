# Higgsfield-Video Version 2 – detaillierter Plan (24.11., nach den Fehlern von Teil 1/2)

**Status: nur Plan – nichts gestartet. Start erst nach Aymans Freigabe.**

## 1. Was schiefging – und was wir daraus ändern
| Fehler bei Teil 1/2 | Ursache | Neu |
|---|---|---|
| Sah aus wie Blender, nur eingefärbt | Modus „Video-Edit“ übernimmt die Blender-Oberflächen fast 1:1 | Blender-Video wird **gar nicht mehr hochgeladen**. Das Aussehen kommt **nur aus den 22 echten Fotos** |
| Keine echten Texturen | KI durfte „nichts hinzufügen“ → hat auch keine Details hinzugefügt | Jeder Prompt: „keine neuen Gegenstände – aber echte Oberflächen sind Pflicht“ |
| Ich habe Teil 2 gestartet, ohne Teil 1 genug zu prüfen | zu schnell | Jetzt **Abschnitt für Abschnitt**: erst prüfen, dann der nächste. Höchstens 4 gleichzeitig |
| Foto 2 hatte falsche Solarreihen, Keller-Foto falsche Säulen | KI hat „umgedeutet“ | Alle Fotos sind geprüft; vier Schwächen werden **vor** dem Video korrigiert (siehe 3.) – denn das Video übernimmt jeden Fehler der Fotos |
| Video 23,7 s statt 24 s | Higgsfield rundet anders | Beim Zusammensetzen strecke/stauche ich jeden Abschnitt genau auf seine Länge |

## 2. Neuer Weg: Video zwischen zwei echten Fotos
- Modell **Seedance 2.5**, Modus **„omni_reference“**, **720p**, 16:9, **ohne Ton**.
- Jeder Abschnitt bekommt ein **echtes Startfoto** und ein **echtes Endfoto**. Higgsfield erfindet nur die Bewegung dazwischen.
- Das Endfoto eines Abschnitts ist das Startfoto des nächsten → **keine Sprünge** an den Nahtstellen.
- An den echten Kamera-Schnitten (24 s, 29,5 s, 35,5 s, 48 s) gibt es einen harten Schnitt – wie in unserem Video.
- Jeder Abschnitt mindestens 4 Sekunden (Mindestlänge bei Higgsfield). So passt die Länge zu unserem Video, ohne Zeitraffer-Tricks.

## 3. Vorher: 9 Fotos (je 2 Credits = 18 Credits)
**5 fehlende Endfotos** (letztes Bild vor jedem Kamera-Schnitt und das Schlussbild): bei **23,9 s**, **29,4 s**, **35,4 s**, **47,9 s**, **71,9 s**.
**4 Korrekturen**: Altbau-Putz ohne Flecken (19 s, 40 s), weißes Haus ohne Flecken (65 s), Wohnwagen wie Aymans Vorlage (69,5 s), dunkles Lamellendach im Hof weg (48 s).

## 4. Die 14 Video-Abschnitte (Gesamt 73 s × 7 Credits = 511 Credits)
| # | Zeit im Video | Länge | Startfoto → Endfoto | Kamera | Was passiert |
|---|---|---|---|---|---|
| 1 | 0–4 s | 4 s | 0 s → 4 s | von senkrecht oben steil hinab, kippt nach vorn bis knapp über die Gasse | leeres Grundstück, Abendsonne |
| 2 | 4–8 s | 4 s | 4 s → 8 s | steigt, fährt zurück über die Gasse, blickt in die Grube | Baugrube mit Holzverbau, Kellerboden, Wände, Säulen, Treppe entstehen nacheinander |
| 3 | 8–12 s | 4 s | 8 s → 12 s | zieht nach links über die Altbau-Front, blickt hinab | Kellerdecke, roter Teppich, Glasfront, beide Portale wachsen Stein für Stein |
| 4 | 12–17 s | 5 s | 12 s → 17 s (+13,5 s und 15 s als Zwischenbilder) | steigt und schwenkt vor die Front, dann über das Dach | Obergeschoss, Dachplatte, Erde, **Pflanzen sprießen vorne zuerst und breiten sich nach hinten aus**, 3 Solarreihen erscheinen nacheinander |
| 5 | 17–23,9 s | 7 s | 17 s → 23,9 s (+19 s und 21,5 s) | über das Gründach zum Hof, dann rechts hinüber zum Parkplatz | Hofdach fährt zu und wieder auf (wird nicht gebaut); Wohnwagen und die 2 schwarzen Autos werden abgesetzt; Lichter gehen warm an |
| — | **Schnitt 24 s** | | | | |
| 6 | 24–29,4 s | 6 s | 24 s → 29,4 s (+27 s) | Augenhöhe, langsam auf das rechte Portal zu, Blick am Bogen hinauf | Eingang im Abendlicht, Wohnwagen hinten |
| — | **Schnitt 29,5 s** | | | | |
| 7 | 29,5–35,4 s | 6 s | 29,5 s → 35,4 s (+32,5 s) | langsame Fahrt durch den Festsaal zwischen den Tischen | leerer Saal, warmes Licht |
| — | **Schnitt 35,5 s** | | | | |
| 8 | 35,5–40 s | 4 s | 35,5 s → 40 s | tief über der Brüstung entlang der Solarreihen | Gründach, Altbau hinten |
| 9 | 40–44 s | 4 s | 40 s → 44 s | steigt über die Kante, Blick hinab in den Hof | Hof mit Schirmen, Lichter an |
| 10 | 44–47,9 s | 4 s | 44 s → 47,9 s | senkt sich in den Hof | Hof von nah |
| — | **Schnitt 48 s** | | | | |
| 11 | 48–52 s | 4 s | 48 s → 52 s | Sitzhöhe, Blick schweift langsam umher | Lounge, Laternen, Oliven → Glaswand |
| 12 | 52–57,5 s | 6 s | 52 s → 57,5 s | Blick durch die Glaswand, dann steigt die Kamera senkrecht aus dem Hof | Teppich und Mihrab hinter Glas, dann Hof von oben |
| 13 | 57,5–65 s | 8 s | 57,5 s → 65 s (+61,5 s) | gleitet zur hinteren Parkplatz-Ecke und senkt sich auf Eckblick | **weißer Audi A3 fährt ein und parkt** (Platz 1); grauer Mercedes biegt ein |
| 14 | 65–71,9 s | 7 s | 65 s → 71,9 s (+69,5 s) | hebt ab, schräg über das ganze Grundstück | **grauer Mercedes parkt** (Platz 3); **Schiebetor öffnet und schließt**, Warnleuchte blinkt |

Die Zwischenbilder (+…) gehen als zusätzliche Vorlage mit, damit Higgsfield den Weg dazwischen kennt.
Autos in jedem Abschnitt, in dem sie zu sehen sind: Aymans 4 Vorlagen (Logos und Schriftzüge bleiben, Kennzeichen leer). Wohnwagen: Aymans Vorlage, ohne Schriftzug.

## 5. Prompt-Aufbau (jeder Abschnitt)
**A – Ziel:** „Unbearbeitete echte Drohnen-/Kameraaufnahme eines echten Ortes, keine Computergrafik.“
**B – Start/Ende:** „Beginnt exakt auf dem Startbild, endet exakt auf dem Endbild.“
**C – Kamera:** genaue Bewegung aus der Tabelle, gleichmäßig, ohne Wackeln, ohne Zoom-Sprünge, ohne Schnitt.
**D – Was sich ändert:** nur die Ereignisse aus der Tabelle, in der genannten Reihenfolge. Bauteile werden ruhig an ihren Platz gesetzt wie im Bau-Zeitraffer – **nichts verformt oder verschmilzt**.
**E – Was gleich bleibt:** „Alles andere bleibt fest und unverändert: Gebäude sind starr, gleiche Formen, Positionen, Anzahl.“
**F – Aussehen:** echte Materialien und Details wie in den Fotos (Pflicht), Licht wie in Start- und Endbild, Schatten in gleicher Richtung.
**G – Ordnung:** neu, sauber, gepflegt, mit natürlicher feiner Unregelmäßigkeit – kein Dreck, keine Flecken.
**H – Verbote:** keine Menschen, Arbeiter, Gesichter, Tiere, Kräne, Maschinen; keine Schrift/Buchstaben/Zahlen/Schilder/Logos außer den Original-Logos auf den 4 Autos; Kennzeichen leer; keine Kuppeln, Minarette, Fahnen, Kameras, neuen Gegenstände; kein Ton.

## 6. Ablauf und Kontrolle
1. 9 Fotos (Punkt 3) → Ayman prüft.
2. Abschnitte in Gruppen: **1–5** (Bau) → prüfen → **6–10** → prüfen → **11–14** → prüfen.
3. Prüfung je Abschnitt: Kontaktbogen Sekunde für Sekunde, Anfang und Ende gegen die Fotos, vergrößerte Ausschnitte (Schrift, Kennzeichen, Menschen, neue Gegenstände, Verformungen).
4. Misslungener Abschnitt: Prompt schärfen, nur diesen neu (28–56 Credits).
5. Zusammensetzen (Claude): jede Länge exakt angleichen, harte Schnitte an den Kamera-Schnitten, auf 1920×1080 hochrechnen, ohne Ton, Endkontrolle.

## 7. Kosten
| Posten | Credits |
|---|---|
| 9 Fotos | 18 |
| 14 Abschnitte, 73 s × 7 | 511 |
| **Summe** | **529** |
| Guthaben jetzt | 580,5 |
| Reserve für Nachbesserungen | ≈ 51 (reicht für 1–2 Abschnitte) |
