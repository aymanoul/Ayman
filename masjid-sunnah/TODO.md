# Offene Punkte (wird laufend gepflegt)

Im Code sind dieselben Stellen als sichtbares `TODO:` markiert.

## Von Ayman zu liefern
- [ ] **Hosting:** Anbieter, Paket, Zugangsart, DNS-Verwaltung. Bis dahin statischer Export ohne Hosting-Annahmen.
- [ ] **Kontaktformular:** bewusst nicht gebaut. Bis dahin WhatsApp, mailto, Telefon. Platz im Layout bleibt reserviert.
- [ ] **Fotos:** innen, außen, Unterricht, Gemeinde. Bis dahin Platzhalter `TODO: echtes Foto`. Keine erkennbaren Personen, keine Kinder, bis ausdrücklich bestätigt.
- [ ] **Neubau-Render** in voller Auflösung. Auf dem alten Server liegen `images/neubau-1…6.webp` (nicht geliefert).
- [ ] **Spendenziel, Stand, Datum** (Neubau). Bis dahin kein Fortschrittsbalken, keine Zahlen.
- [ ] **Betriebskosten pro Monat:** bis dahin kein Block „Was der Betrieb kostet“.
- [ ] **Unterricht:** Uhrzeiten, Kosten, Altersgruppen, Anmeldeweg (bis dahin WhatsApp).
- [ ] **Aktuelles:** aktuell keine Veranstaltung → Sektion ausgeblendet.
- [ ] **Social-Designs** als Referenz (Flyer, Reel-Cover, Gebetszeiten-Tabelle).
- [ ] **Gründungsjahr 1997:** nicht bestätigt, steht nicht auf der Seite.
- [x] **Logo:** neues Paket (v2) eingebaut. SVGs rendern bei 1x und 3x korrekt, grauer Fleck ist weg. Header und Footer nutzen die weiße SVG.
- [ ] **Repo `masjid-sunnah`:** konnte ich nicht anlegen. Aufbau liegt im Ordner `masjid-sunnah/` auf Branch `claude/practical-wright-d1vge6`.

## Rechtlich prüfen lassen (nichts daran geändert)
- [ ] Impressum und Datenschutz bleiben wörtlich wie auf der alten Seite. Rechtlich prüfen lassen:
  - Impressum zitiert TMG. Das TMG wurde durch das DDG ersetzt.
  - Datenschutz nennt nicht: Karte (OpenStreetMap, Klick-zum-Laden), TikTok-Einbettung, MAWAQIT (Abruf zur Build-Zeit, kein Besucherkontakt), WhatsApp/Telefon als Kontaktweg, Hoster.
  - Der alte Text nennt Cloudflare Turnstile, Google Fonts und das MAWAQIT-iframe nicht. Die neue Seite lädt sie nicht.

## Freigaben

## Technisch
- [ ] **MAWAQIT:** `mawaqit.net` aus dieser Umgebung nicht erreichbar. Bis dahin Beispieldaten (klar markiert), Skript erst mit echten Daten prüfen (3 Stichtage).
- [ ] **Jumuʿa:** 14:00 Uhr bis 25.10.2026, danach 13:00 Uhr (Winterzeit). Als Einstellung in `content/`. 29.10. = 28.10. in MAWAQIT, unverändert lassen.
- [ ] Open-Graph-Bild: `og-image-1200x630.png` geliefert, in Phase 6 einbinden.
- [ ] Favicons/Manifest: Icons geliefert, Manifest in Phase 6.

## Phase 2 (Design-System)
- [x] Screenshots der alten Seite gestrichen (Entscheidung Ayman). Phase 1 gilt als abgeschlossen, Texte aus `_incoming/alte-seite-text.txt`.
- [ ] **Social-URLs vor Livegang prüfen:** `src/content/site.ts` (Instagram, TikTok, YouTube @sunnahmoschee) sind aus dem Handle abgeleitet und nicht geprüft.
- [ ] `/styleguide/` vor dem Livegang entfernen (ist `noindex`).
- [ ] Mobile-Menü und Header sind nur mit Platzhalterseiten getestet. Zielseiten (`/gebetszeiten/`, `/unterricht/`, `/neubau/`, `/kontakt/`, `/spenden/`, `/impressum/`, `/datenschutz/`) entstehen in den Phasen 3–5. Bis dahin 404.

## Phase 3 (Startseite)
- [ ] **Fotos (Platzhalter mit sichtbarem „TODO: echtes Foto“):** Hero (Querformat), Über uns (Hochformat), Neubau-Render (Querformat, volle Auflösung). In `src/app/page.tsx` über `<Photo src=… />` einsetzen. Keine erkennbaren Personen, keine Kinder.
- [ ] **Karte (Anfahrt):** Platzhalter. Klick-zum-Laden-Karte erst nach Klärung des Datenschutzes. Bis dahin Link zu OpenStreetMap (lädt nichts vorab).
- [ ] **Gebetszeiten:** Karte läuft mit **Beispieldaten** (`src/content/prayer-calendar.json`, erzeugt von `scripts/sample-prayer-data.mjs`, astronomisch berechnet, nicht MAWAQIT). Der sichtbare Hinweis „Beispieldaten“ verschwindet mit echten Daten (Phase 4). Iqāma folgt in Phase 4.
- [ ] **Jumuʻa:** Einstellung in `src/content/settings.ts` (14:00 bis 24.10.2026, ab 25.10.2026 13:00).
- [ ] **Aktuelles:** `src/content/events.ts` ist leer, die Sektion ist ausgeblendet. Ein Eintrag mit Datum blendet sie ein.
- [ ] Hero-Headline, Angebots- und Neubau-Texte sind aus den Texten der alten Seite gekürzt/umformuliert (nicht die Rechtstexte). Bitte gegenlesen.
- [ ] Hijri-Datum: kalendarisches Datum nach Umm al-Qura plus `hijriAdjustment`. Der Tageswechsel erfolgt um Mitternacht, nicht um Maghrib. Mit dem gedruckten Plan abgleichen (Phase 4).
- [ ] Schreibweise: im Text steht `ʻ` (U+02BB) statt `ʿ`, weil Montserrat dieses Zeichen sauber darstellt.
