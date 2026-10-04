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
- [ ] `masjid-sunnah.de.html` (alte Seite) liegt nicht als Datei in `_incoming/`, sie kam nur als Nachrichtentext. Ohne Datei keine Screenshots der alten Seite. Datei dort ablegen, dann rendere ich sie bei 1440 und 390 px.
- [ ] Social-URLs in `src/content/site.ts` (Instagram, TikTok, YouTube @sunnahmoschee) sind aus dem Handle abgeleitet und nicht geprüft.
- [ ] `/styleguide/` vor dem Livegang entfernen (ist `noindex`).
- [ ] Mobile-Menü und Header sind nur mit Platzhalterseiten getestet. Zielseiten (`/gebetszeiten/`, `/unterricht/`, `/neubau/`, `/kontakt/`, `/spenden/`, `/impressum/`, `/datenschutz/`) entstehen in den Phasen 3–5. Bis dahin 404.
