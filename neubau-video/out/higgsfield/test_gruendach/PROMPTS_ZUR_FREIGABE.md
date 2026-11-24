# Test Gründach – Prompts Version 2 (nach Analyse) – zur Freigabe, noch NICHTS hochgeladen

## Analyse: Wo die KI uns falsch verstehen könnte (Version 1)
| # | Formulierung in Version 1 | Gefahr | Lösung in Version 2 |
|---|---|---|---|
| 1 | „Do not add anything“ | KI hält auch Texturen, Fugen, Schmutzfreiheit-Details, Lichtreflexe für „hinzugefügt“ → bleibt glatt wie Blender | Klar trennen: **keine neuen GEGENSTÄNDE**, aber **ausdrücklich** echte Oberflächen-Details, Texturen, Reflexe, Mikro-Details hinzufügen |
| 2 | „Keep … exactly as it is / same colours“ | KI übernimmt die flachen Blender-Farben und -Flächen 1:1 | Nur **Form, Lage, Größe, Anzahl** bleiben; **jede Oberfläche wird durch echtes Material ersetzt** (Farbton ungefähr gleich) |
| 3 | „3D render“ im Text | kann den CG-Stil sogar verstärken | Bild 1 nur als „Bauplan/Vorlage für Bildaufbau“ bezeichnen; Ziel = „unbearbeitetes Foto einer echten Drohne“ |
| 4 | „Clean, tidy“ | KI macht alles steril und glatt → sieht künstlich aus | „gepflegt und neu, aber mit natürlicher, feiner Unregelmäßigkeit echter Materialien“ (kein Dreck, keine Schäden) |
| 5 | Foto 1: „keep exactly“ + „Dach mit Erde“ | Widerspruch → KI lässt das graue Dach | Die **eine gewollte Änderung** ausdrücklich benennen |
| 6 | Fotos getrennt erzeugt | Licht, Himmel, Farben passen zwischen Start- und Endbild nicht → Sprung im Video | Foto 2 bekommt **Foto 1 als zweite Vorlage** für Licht, Himmel, Materialien |
| 7 | „row by row“ (Pflanzen) | KI verwechselt mit den Solarreihen oder macht Streifen-Muster | genau beschreiben: **kleine Triebe tauchen zuerst am vorderen Dachrand auf, das Grün breitet sich gleichmäßig nach hinten aus** |
| 8 | Solarmodule „mounted“ ohne Menschen/Maschinen | Module flackern oder fliegen | „erscheinen ruhig nacheinander, vorderste Reihe zuerst, und stehen dann fest“ |
| 9 | Kamera „slightly rising and turning“ | zu ungenau → KI erfindet eigene Fahrt | Start- und Endansicht genau benennen, gleichmäßige Fahrt ohne Wackeln, ohne Zoom-Sprünge |
| 10 | Licht nur „late-afternoon“ | Schattenrichtung kann im Video wechseln | Sonne fest **von vorn links**, Schatten fallen nach hinten rechts, gleich im ganzen Clip |
| 11 | Verbotsliste „no text“ | KI könnte Fenster-/Fugen-Linien als „Zeichen“ entfernen | „keine Schrift/Buchstaben/Zahlen/Schilder“ – Architektur-Linien sind erlaubt |

## Was hochgeladen wird
1. `kf1_blender_15s.png` – vorhandenes Bild aus unserem Video bei 15,0 s (Dach noch leer) – nichts neu gerendert
2. `kf2_blender_17s.png` – vorhandenes Bild bei 17,0 s (Gründach + Solar fertig)
Für das Video danach nur die zwei echten Fotos (die siehst du vorher).
**Kosten:** 2 × 2 Credits + 5 s Video ≈ **42 Credits** (wird vor dem Start geprüft).

## Foto 1 (aus kf1) – Nano Banana 2.1, 2k, 16:9
> Goal: an unedited photograph from a real high-end drone camera (large sensor, natural colours, fine detail) – it must look like a
> real photo of a real place. Image 1 is only the blueprint for composition: use exactly its camera position, angle, framing and the
> shape, position, size and number of every building, roof, window, portal and wall. Do not add or remove any objects.
> Replace every surface with real material and real surface detail (this is required, not optional): the old four-storey house on
> the left has real lime plaster with fine natural unevenness, deep window reveals, white window frames with real glass reflections,
> and a grey natural-slate roof made of individual overlapping slates with roof windows, gutters and downpipes; the two portals are
> light beige natural limestone blocks with visible joints and fine stone grain; the glass façade has slim black aluminium mullions
> and real reflections of the sky; the warehouse roofs behind are real grey slate tiles with roof windows; the wall is real render.
> The one intended change: the flat roof of the new building (inside the light stone parapet) is covered with a fresh, even layer of
> dark brown green-roof substrate soil with natural crumbly texture, still without plants and without solar panels.
> Light: warm late-afternoon sun from the front left, soft natural shadows falling to the back right, slight natural haze.
> Everything new and well-kept, but with the subtle natural irregularity of real materials – no dirt, damage, stains, graffiti or rust.
> No people, faces or animals; no writing, letters, numbers, signs, logos or watermarks; no cameras, domes, minarets, flags, cranes,
> machines or other new objects.

## Foto 2 (aus kf2, mit Foto 1 als zweiter Vorlage) – Nano Banana 2.1, 2k, 16:9
> Goal: an unedited photograph from a real high-end drone camera – it must look like a real photo of a real place, taken a few
> minutes after image 2 from a slightly different position. Image 1 is only the blueprint for composition: use exactly its camera
> position, angle, framing and the shape, position, size and number of every building, roof, wall and solar panel row (exactly three
> rows). Do not add or remove any objects. Image 2 (a real photo of the same place) defines the light, sky, colours and materials –
> match them exactly.
> Replace every surface with real material and real surface detail (required): the flat roof is a lush, real extensive green roof –
> dense low sedum carpets in several shades of green, short grasses and small wildflowers growing naturally out of the brown soil,
> irregular and natural, not uniform; three rows of tilted dark-blue monocrystalline solar panels with thin silver aluminium frames on
> aluminium mounting rails, with real reflections; a light stone parapet; on the left the old cream-plastered house with real lime
> plaster, white window frames and a natural-slate roof; behind, the courtyard wall and warehouse slate roofs.
> Light: identical to image 2 – warm late-afternoon sun from the front left, shadows to the back right.
> New and well-kept with natural material irregularity – no dirt or damage. No people, faces or animals; no writing, letters,
> numbers, signs, logos or watermarks; no cameras, domes, minarets, flags or other new objects.

## Video (5 s) – Seedance 2.5, Modus „omni_reference“, 720p, 16:9, ohne Ton
Start-Bild = Foto 1, End-Bild = Foto 2. Kein Blender-Video als Vorlage.
> Unedited real drone footage of a real place – photorealistic, natural colours, real textures, not computer graphics. The clip
> begins exactly on the start image and ends exactly on the end image. Camera: one smooth, steady glide without shake, zoom jumps or
> cuts – from the high view at the front of the building forward and slightly upward until it looks down at an angle over the roof as
> in the end image. On the roof, a natural time-lapse: first tiny green shoots appear in the brown soil near the front edge of the
> roof, then the green spreads evenly towards the back and grows into a dense, lush green roof of sedum, short grasses and small
> wildflowers, exactly as in the end image. Meanwhile the three rows of dark-blue solar panels appear calmly one after another (the
> front row first) and then stay fixed. Nothing else changes: the old house, the slate roofs, the portals and the walls keep their
> real textures, shapes and positions throughout. Light stays constant: warm late-afternoon sun from the front left, shadows to the
> back right. No people, workers, faces, animals, machines or cranes; no writing, letters, numbers, signs, logos or watermarks; no
> domes, minarets, flags or new objects. No sound, no music.
