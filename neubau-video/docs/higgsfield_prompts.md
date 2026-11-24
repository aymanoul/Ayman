# Higgsfield – 4 fotorealistische Bilder (Ayman 20.11.)

Modell: **Nano Banana 2.1** (Google), Auflösung 2k, Format 9:16, je **1 Bild** (keine Varianten).
Vorlage je Bild: unser Blender-Standbild `out/higgsfield/<n>.png` (wird von Claude hochgeladen – Ayman muss nichts hochladen).
Kosten (Schätzung Higgsfield): **2 Credits je Bild → 8 Credits gesamt** (Guthaben vorher 1004,5).
Regel 7: Higgsfield nur für das NEUBAU-Video, kein Text/Logo/QR über Higgsfield, Kosten vor jedem Auftrag freigeben.

## Gemeinsamer Teil (wird an jede Beschreibung angehängt)
> Turn this 3D render into a real photograph. Keep the exact camera angle, framing, composition, building shapes,
> proportions, window positions and layout exactly as in the reference image – change only materials, lighting and realism.
> Photorealistic, shot on a full-frame camera, natural daylight in the late afternoon, soft realistic shadows, real material
> textures, sharp details, realistic sky. Location: a quiet side street in Ratingen, Germany. Absolutely no text, no letters,
> no numbers, no signs, no logos, no watermark. No people, no animals, no cars.

## 1 – Moschee (`1_moschee.png`)
> A newly built modern two-storey mosque: front façade of light beige natural limestone panels, a tall floor-to-ceiling glass
> curtain wall with slim black aluminium mullions on both floors, a tall pointed Islamic arch entrance portal in stone with a
> thin gold trim and glass door, two wall lanterns beside it, two slim cypress trees in planters next to the entrance, a flat
> roof with a stone parapet, a thin warm light line between the floors. No dome, no minaret. On the left an existing white
> plastered four-storey residential house, older red-brick houses behind. Foreground: a real asphalt lane, a few parking bays
> with white lines on the right.

## 2 – Hof (`2_hof.png`)
> The private inner courtyard behind the mosque, seen from slightly above: light grey large-format stone paving, dining areas
> with dark wooden tables and chairs under large white square sun umbrellas, olive trees in big planters, a palm tree in a
> concrete planter, slim cypresses along a light rendered garden wall. The rear façade of the mosque in light render with dark
> windows and a small canopy over a dark door; an old red-brick building on the right. New, clean, well-kept and inviting.

## 3 – Parkplatz (`3_parken.png`)
> A private parking yard next to the mosque, seen from the lane: six plain white modern caravans (travel trailers) with dark
> window bands parked side by side in marked bays on dark asphalt with white lines; in front a black steel bar fence with light
> stone pillars and a black cantilever sliding gate; behind a large light-plastered warehouse wall with a flat roof.
> No branding on the caravans.

## 4 – Von oben (`4_oben.png`)
> Straight top-down drone photograph (nadir view) of the whole plot: at the top the new mosque with a flat green roof covered by
> rows of dark blue solar panels and a light stone parapet; next to it the inner courtyard with paving, trees, white umbrellas
> and tables; below the mosque a dark asphalt parking area with white lines and seven white caravans in a row, a narrow green
> strip along the right edge, a grey asphalt lane along the left, neighbouring roofs around. Realistic drone photo from about
> 60 m height, sharp, natural daylight.

## Ergebnis (20.11., von Ayman freigegeben: 8 Credits)
Erstellt mit Nano Banana 2.1, 2k (1536 × 2752, 9:16), je 1 Bild → `out/higgsfield/echt/1_moschee_echt.png`, `2_hof_echt.png`,
`3_parken_echt.png`, `4_oben_echt.png`. Geprüft (Ausschnitte vergrößert): kein Text, keine Schilder, keine Logos, keine Menschen.
Higgsfield hat von sich aus 2 kleine Überwachungskameras an die Fassade gesetzt (Bild 1). Higgsfield-Job-IDs:
bc0d001a… (1), edbbf0e0… (2), 3dd6afe8… (3), 3a562533… (4).
Netz: `upload.higgsfield.ai` und `d8j0ntlcm91z4.cloudfront.net` mussten in der Umgebung freigegeben werden (Hochladen/Herunterladen).

## NEUER PLAN (24.11.): Video 72 s, 16:9 → fotorealistisch mit Higgsfield
**Status: nur Plan. Start NUR nach Aymans ausdrücklichem „los“ (er braucht vorher das Go seines Chefs). Kosten vor jedem Auftrag nennen.**
Die 4 Bilder vom 20.11. (`out/higgsfield/echt/*`) werden NICHT mehr benutzt: alte Fassade, nur 1 Portal, Palme, alter (niedriger) Altbau.

### Ablauf (4 Schritte, jeder mit Aymans Freigabe)
| Schritt | Was | Werkzeug | Credits |
|---|---|---|---|
| 0 | 4 neue Standbilder 16:9 aus dem fertigen Blender-Modell: (A) Front mit beiden Portalen + Altbau, (B) Keller-Festsaal, (C) Hof mit Glaswand, (D) Parkplatz mit 4 Autos, Wohnwagen, Tor | Blender (Claude) | 0 |
| 1 | Daraus 4 Fotos (je 1 Bild, 2k, 16:9) = **Probe**: zeigt, ob Higgsfield etwas dazudichtet/weglässt. Ayman prüft jedes Bild. | Nano Banana 2.1 | 4 × 2 = **8** |
| 2 | Video-Edit in 3 Teilen à 24 s (0–24, 24–48, 48–72 s = genau unsere Kamera-Schnitte → keine Sprünge an den Nahtstellen), 720p, 16:9, ohne Ton; nach jedem Teil Kontrolle, erst dann der nächste | Seedance 2.5 `video_edit` | 3 × 24 s × 7,5 = **540** |
| 3 | Teile zusammensetzen, auf 1920×1080 hochrechnen, ohne Ton (Ayman 24.11.), Bild-für-Bild-Kontrolle | Claude | 0 |
**Gesamt 548 von max. 550 Credits.** Preise vom letzten Stand (Seedance 7,5 Credits/s bei 720p, max. 30 s je Auftrag; Nano Banana 2 Credits/Bild) –
direkt vor dem Start mit der Higgsfield-Kostenschätzung neu prüfen. Ein misslungener Teil neu = +180 Credits → über Budget → nur mit Aymans Freigabe.

### Autos (Ayman 24.11.): so wie in seinen Vorlagen – Logos und Schriftzüge BLEIBEN
Weiß = **Audi A3 Sportback** (`assets/autos/auto_weiss_audi_a3.png`), schwarzer SUV = **VW T-Roc** (`auto_schwarz_suv_vw_t_roc.png`),
grau = **Mercedes A-Klasse** (`auto_grau_mercedes_a_klasse.png`), schwarz sportlich = **VW Golf R** (`auto_schwarz_sport_vw_golf_r.png`).
Reihenfolge von der Gasse: Audi (parkt ein), T-Roc (steht), Mercedes (parkt ein), Golf R (steht). Marken-Logos und Modell-Schriftzüge
wie in den Vorlagen; **Kennzeichen bleiben leer** (in den Vorlagen grau); sonst nirgends Text. Die 4 Vorlagen werden zusätzlich als
Bild-Referenz hochgeladen (Foto D und Video-Teil 3, in Teil 1 nur die zwei schwarzen – Teil 1 bekommt keine Fotos vom fertigen Gebäude). Vor dem Start prüfen, wie viele Bild-Referenzen
Seedance je Auftrag annimmt; falls zu wenige: Auto-Vorlagen haben Vorrang vor den Look-Fotos, die nichts mit dem Teil zu tun haben.

### Was hochgeladen wird (sonst nichts – keine fremden Bilder)
- Schritt 1: je Foto genau 1 Blender-Standbild aus Schritt 0 (Vorlage für Form und Bildausschnitt).
- Schritt 2 je Teil: `video_references` = der 24-s-Ausschnitt aus unserem fertigen Video `out/neubau_drohne.mp4` (ohne Ton);
  `image_references` = die 4 von Ayman freigegebenen Fotos aus Schritt 1, **nur als Look-Vorlage** (Materialien, Licht),
  plus die Auto-Vorlagen von Ayman (`assets/autos/auto_*_{audi_a3,vw_t_roc,mercedes_a_klasse,vw_golf_r}.png`) für die Autos.

### Ayman 24.11. (wichtig)
- **Nichts überspringen:** Higgsfield darf nicht direkt zum fertigen Gebäude/Standbild springen. Deshalb bekommt **Teil 1 (Bauphase)
  KEINE Fotos vom fertigen Gebäude** als Referenz – nur unser Video (+ die 2 schwarzen Auto-Vorlagen); der Look kommt dort nur über
  den Prompt-Text. Im Prompt zusätzlich: jede Zwischenstufe in gleicher Reihenfolge und Zeit, nie zum Endzustand springen.
  Kontrolle: Bilder von Higgsfield-Teil 1 im Sekundenabstand neben unser Video legen.
- **Lichter an, gemütlich:** Hof (Wandlichter, Laternen, Lichtlinien), beide Eingänge, Parkplatz neben den Thujas/Pflanzen – warm (~2700 K),
  Stimmung goldene Stunde bis frühe Dämmerung, sobald im Video die Lichter angehen.
- **Echt, aber sauber und ordentlich:** neu, gepflegt; kein Dreck, Flecken, Müll, Pfützen, Risse, Graffiti, Rost, Laub.

### Schutz gegen Dazudichten / Umdeuten / Weglassen
1. **Video-Edit statt Neu-Erfinden:** Kamera, Formen, Positionen und Timing kommen 1:1 aus unserem Video.
2. **Inventarliste je Teil** (was wann zu sehen ist) → nichts wird ausgelassen (2 Portale, Hofdach fährt, Autos parken, Tor …).
3. **Verbotsliste** in jedem Prompt (Menschen, Gesichter, Tiere, jede Schrift inkl. Kennzeichen/Kalligrafie, Logos, Schilder, Kameras, Kuppel/Minarett, Fahnen, zusätzliche Autos/Pflanzen/Lampen/Gebäude, Musik).
4. **Bauphase ausdrücklich beschrieben** (Teil 1), damit das fertige Gebäude nicht zu früh erscheint.
5. **Probe mit den 4 Fotos** (8 Credits) vor dem teuren Video; letztes Mal hat Higgsfield 2 Überwachungskameras erfunden → jetzt ausdrücklich verboten.
6. **Kontrolle nach jedem Teil** (Kontaktbogen + Ausschnitte vergrößert, Vergleich mit dem Blender-Video Bild für Bild). Bei Fehlern: Prompt für die nächsten Teile schärfen.
7. **Autos:** sehen aus wie in Aymans 4 Vorlagen, Logos und Schriftzüge bleiben (Ayman 24.11.). **Kennzeichen** sind im Modell leer. Erfindet Higgsfield trotzdem Zeichen → Claude macht sie unkenntlich oder ersetzt die Stelle durch das Blender-Bild. Kein KI-Text im Endvideo.
Ehrlich: 100 % Garantie gibt es bei KI nicht; Kleinigkeiten (Zahl der Stühle, Fensterteilung) können leicht abweichen → deshalb Probe + Kontrolle.

### Prompts Schritt 1 (Fotos) – gemeinsamer Teil
> Turn this 3D render into a real architectural photograph. Keep the exact camera angle, framing, composition, every building,
> shape, proportion, window, door, plant, piece of furniture and vehicle exactly as in the reference image – same number, same
> position, same colour. Do not add, remove or reinterpret anything. Change only materials, lighting and realism: real
> textures, natural late-afternoon light, soft realistic shadows and reflections, realistic sky, sharp detail, full-frame camera.
> Strictly no people, no faces, no animals, no text, no letters, no numbers, no calligraphy, no signs, no logos, no brand
> badges (except on the four cars, which keep the logos and lettering of their reference images), no watermark, no characters
> on licence plates (plates stay blank), no surveillance cameras, no domes, no minarets,
> no flags, no extra lamps, plants, cars or buildings.

Zusatz je Bild: (A) „New mosque façade between an old cream-plastered house (left) and a warehouse: two identical portals of light
beige limestone with a round arch and a tall round-arched glass door, a glass curtain wall with slim black mullions between them,
warm LED light lines, thujas in planters.“ (B) „Empty basement multipurpose hall, no people: white marble floor, white ceiling with
cove lighting and ring pendants, white columns with dark brown wood cladding, dark brown wood wall panelling, round tables with
white tablecloths and dark brown runners, upholstered dark wooden chairs, a silver Moroccan teapot with coloured tea glasses on
each table.“ (C) „Private courtyard: teak tables and armchairs, lounge, black lanterns, white octagonal umbrellas, olive trees in
light-grey planters, thujas, warm wall lights, large glass wall into the prayer hall with red carpet.“ (D) „Parking next to the
mosque: four cars exactly as in the car reference images, including their original brand logos and model lettering: a white Audi A3 Sportback, a black VW T-Roc, a grey Mercedes-Benz A-Class and a black VW Golf R; licence plates blank, seven plain white caravans, black
three-leaf sliding gate, thujas and lights along the walls.“

### Prompt Schritt 2 (Video) – gemeinsamer Teil (an jeden Teil angehängt)
> Restyle this video into a photorealistic real-world video, as if filmed with a high-end cinema drone camera. The source video
> is the master and must be followed exactly, frame by frame: keep the exact camera path, angles, lens, speed, cuts and timing;
> keep every building, wall, window, door, roof, fence, gate, tree, plant, piece of furniture and vehicle exactly as it is – same
> shape, position, size, number, colour and timing. Do not remove, merge, replace or reinterpret anything, and do not add
> anything that is not in the source video. Change only the look: real materials, realistic light, shadows, reflections, sky and
> fine photographic detail. Keep the time of day and every lighting change of the source (late-afternoon sun; façade and
> interior lights switch on exactly when they do in the source). The reference images show only the photographic look and
> materials of the finished buildings – use them for style, never for content or timing. Never jump to the finished state shown
> in the reference images and never skip, shorten or merge any stage or moment of the source video: every intermediate frame of
> the source must appear in the result in the same order and at the same time.
> Mood: brand-new, clean, tidy and orderly – realistic but immaculate: no dirt, stains, litter, puddles, cracks, graffiti,
> weathering, rust or fallen leaves (during the construction stages a clean, well-organised building site). Once the lights are
> on, every light of the source is clearly on with a warm, cosy glow (about 2700 K): the wall lights, lanterns and light lines in
> the courtyard, the lamps at both entrance portals and the façade light lines, the spotlights and wall lights at the parking
> area next to the thujas and plants, and the warm interior light behind the glass – inviting and cosy like a calm evening
> gathering place, in a soft golden-hour to early-dusk atmosphere.
> Materials: two entrance portals of light beige natural limestone with a round arch and a tall round-arched glass door with
> black frames and a small wall lamp on each side; glass curtain wall with slim black aluminium mullions; thin warm LED light
> lines; flat roof with light parapet; plain red prayer carpet with thin light lines (no pattern, no writing); to the left the
> old mosque – a cream-plastered house with white window frames and a grey slate roof with roof windows and a chimney;
> warehouse with grey slate roof and roof windows; small annex with orange clay tiles; elevated motorway with green noise
> barrier; dark asphalt with white lines.
> Strictly forbidden: people, faces, figures, animals, birds; any text, letters, numbers, calligraphy, inscriptions, signs,
> logos, brand badges or watermarks – EXCEPT on the four cars, which must look exactly like their car reference images including
> their original brand logos and model lettering; licence plates stay completely blank; domes, minarets, crescents,
> flags, surveillance cameras, satellite dishes, antennas; extra lamps, plants, vehicles or buildings. No sound, no music.

**Teil 1 (0–24 s, eine durchgehende Drohnenfahrt):**
> Content in order: high above the empty flat plot between the old cream house and the warehouse, the camera descends; then a
> construction timelapse: excavation pit with timber shoring, basement concrete walls and columns, ground-floor slab, glass
> façade, the two stone portals (far left and far right of the façade), upper floor, flat roof, green roof with rows of tilted
> dark-blue solar panels; a white retractable fabric roof over the courtyard appears complete (it is not built), slides closed
> and opens again; the seven white caravans and two black cars (a black VW T-Roc and a black VW Golf R as in their reference images) are gently set
> down onto their spaces (they are not built); at the end the lights switch on. Every part
> appears exactly when it appears in the source – never show the finished building earlier.

**Teil 2 (24–48 s):**
> 0–5.5 s: eye-level walk along the lane towards the right entrance portal, looking up at the stone arch; glass façade, thujas,
> lamps. 5.5–11.5 s: the empty basement multipurpose hall (no people): glossy white marble floor with light grey veining, white
> ceiling with recessed lights, cove lighting and ring pendants, white columns with dark brown wood cladding, dark brown wood
> wall panelling, round tables with white tablecloths and dark brown runners, upholstered dark wooden chairs, a silver Moroccan
> teapot with small coloured tea glasses on each table, a screen and a lectern at the back wall. 11.5–24 s: low flight over the
> parapet along the rows of tilted solar panels on a green roof with grasses and small plants, then over the edge down into
> the courtyard.

**Teil 3 (48–72 s):**
> 0–6.5 s: seated eye-level view in the courtyard looking around: teak tables and armchairs, lounge with dark cushions, black
> lanterns, white octagonal umbrellas, olive trees in light-grey square planters, thujas and box balls along light rendered
> walls with warm wall lights, light stone paving; it ends looking through the large glass wall into the prayer hall (red
> carpet, mihrab arch). 6.5–13 s: the camera rises vertically out of the courtyard and glides to the rear corner of the parking
> area. 11.4–16.8 s: a white Audi A3 Sportback drives in from the lane and parks forwards in the first space next to the glass side wall;
> 13.4–19.2 s: a grey Mercedes-Benz A-Class parks in the third space; a black VW T-Roc (second space) and a black VW Golf R (fourth space)
> are already parked; all four cars look exactly like their car reference images, with their original logos and lettering and
> blank licence plates. 18.5–24 s: the camera lifts; the black three-leaf sliding gate in front of the
> seven white caravans opens and closes again while a small warning light flashes; final high oblique view over the whole plot.

## (ÜBERHOLT) Alter Video-Plan vom 20.11. – 9:16, 60 s – gilt NICHT mehr, siehe neuer Plan oben
Ayman: „ganzes Video 720p, aber erst wenn das Video fertig gerendert ist und ich es mir angeguckt habe“.
Plan: Seedance 2.5 (`seedance_2_5`), mode `video_edit`, 720p, 9:16, `generate_audio: false` (keine Musik), 2 Teile à 30 s
(0–30 s, 30–60 s) aus `out/neubau_drohne.mp4`, die 4 Bilder `out/higgsfield/echt/*` als image_references für den Look.
Kosten laut Higgsfield: 225 Credits je 30 s → **450 Credits** (Guthaben ~996). Danach Claude selbst: beide Teile zusammenschneiden,
auf 1080×1920 hochskalieren, eigenen Ton (tools/ton.py, −14 LUFS) darunterlegen, auf Text/Personen/Gesichter prüfen.
Start erst nach Aymans ausdrücklichem „los“.

### Video-Prompt (beide Teile gleich, Ayman 20.11.: Gebäude zu 100 % wie im 3D-Video)
> Restyle this video into a photorealistic real-world drone video. The source video is the master: follow it 100 % exactly.
> Keep every building, wall, window, roof, fence, gate, caravan, tree and object exactly as it is in the source video, frame by frame:
> same shapes, same positions, same sizes, same number, same timing. Do NOT remove anything that is in the source video and do
> NOT add anything that is not in the source video – no extra buildings, floors, domes, minarets, signs, cameras, lamps, plants,
> vehicles or decorations. When the source video shows a construction stage (pit, basement, walls growing, roof appearing,
> parts appearing or disappearing), show exactly that stage at exactly that moment – never show the finished building earlier.
> Keep the exact camera path, camera angles, speed and cuts of the source video.
> Change ONLY the look: real materials (light beige natural limestone, glass with real reflections, dark aluminium frames, real
> asphalt, concrete, wood, plants, gravel, solar panels), realistic light and shadows, realistic sky, natural colours, real
> photographic detail like a high-end drone camera. The reference images show ONLY the desired photographic look and materials
> of the finished building – use them for style, not for content or timing.
> Absolutely no text, no letters, no numbers, no signs, no logos, no watermark. No people, no animals, no cars, no faces.
> No music, no sound.

Medien je Teil: `video_references` = der 30-s-Teil aus `out/neubau_drohne.mp4`; `image_references` = die 4 Bilder aus
`out/higgsfield/echt/` (nur als Look-Vorlage, siehe Satz im Prompt).
