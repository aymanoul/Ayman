# Plan: Video „Zwischen Adhan und Iqama“ (ca. 60 s)

Auftrag von Ayman (17.11.2026). Alle festen Regeln aus `gebet-video/CLAUDE.md` gelten unverändert.
Nach jeder Phase stoppen, Vorschau schicken, Freigabe abwarten.

## Eckdaten
- 9:16, 1080 × 1920, 30 fps, Ziel 58–64 s, −14 LUFS. Keine Endkarte.
- **Technik: Three.js-Baukasten wie beim Gebet-Video** (`gebet-video/web`, `gebet-video/tools`) – Bausteine wiederverwenden
  (figure, poses, room, overlay, Karten), ohne das Gebet-Video zu ändern. Neuer Ordner `iqama-video/`.
- Figuren A (weißer Qamis, Kufi, voller Bart) und B (junger Mann, kurzer Bart) wie im Gebet-Video. Drehort nur Gebetsraum.
  Nebenfiguren nur von hinten/weit weg. Imam höchstens am Ende von hinten in der ersten Reihe.

## Phasen
| Phase | Inhalt | Stand |
|---|---|---|
| 1 | Beweisliste H1/H2 (`docs/phase1-beweisliste.md`) | geprüft: H1 = hadeethenc 5479 (Abū Dāwūd 521, at-Tirmidhī 212, ṣaḥīḥ), H2 = hadeethenc 3435 (Muslim 649, al-Bukhārī 647). ✅ **freigegeben** (17.11.); A04 neu (geprüfter Wortlaut), dazu A01/B03/Schlusssatz „abgelehnt“ |
| 2 | Storyboard 12 Bilder + Handy-Display, Zeitbalken, Licht-Tor | Blatt fertig `out/phase2/storyboard.jpg`, `einzelbilder.jpg` – Freigabe offen |
| 3 | Stimmen (A und B von Ayman), Zeitplan, Rohschnitt 720p | offen |
| 4 | Zeitbalken, Licht-Tor, Lichtpunkte, Karten, Untertitel, Geräusche; Vorschau 720p | offen |
| 5 | Endfassung, Schlussprüfung, 2 Titelbilder, Beschreibung (genau 5 deutsche Hashtags) | offen |

## Drehbuch (fest; Änderungen vom 17.11. fett)

(Einstieg: die letzten Sekunden von Aymans Adhan, `gebet-video/assets/audio/roh/adhan_neu.mp3`, „Lā ilāha illa-llāh“, danach Stille)

- A01 (Hook, aus dem Off): Es gibt Minuten am Tag, in denen dein Bittgebet nicht **abgelehnt** wird. Und die meisten verbringen sie am Handy.
- B01: Noch zehn Minuten bis zur Iqama. Kurz noch was gucken.
- A02: Weißt du, welche Zeit das gerade ist?
- B02: Na ja, Wartezeit eben.
- A03: Der Prophet, Allahs Segen und Frieden auf ihm, sagte:
- A04: **Das Bittgebet zwischen Adhan und Iqamah wird nicht abgelehnt.** (= Karte H1, Wort für Wort)
- B03: Nicht **abgelehnt**? In diesen paar Minuten?
- A05: Genau jetzt. Und wer auf das Gebet wartet, gilt die ganze Zeit, als wäre er im Gebet. (Stütze H2)
- B04: Und ich hab die Zeit jeden Tag am Handy verbracht.
- A06: Fünfmal am Tag öffnet sich diese Tür. Bitte um alles, was du brauchst: für dich, für deine Eltern, für dein Jenseits.
- B05: Dann bleibt das Handy jetzt in der Tasche.
- A07: Zwischen Adhan und Iqama: Handy weg, Hände hoch.
- Schlusssatz groß: „Zwischen Adhan und Iqama wird das Bittgebet nicht **abgelehnt**.“ Keine Endkarte.

Karte H1: «الدُّعَاءُ لَا يُرَدُّ بَيْنَ الْأَذَانِ وَالْإِقَامَةِ» · „Das Bittgebet zwischen Adhan und Iqamah wird nicht abgelehnt.“ ·
„Überliefert von Anas ibn Mālik · Abū Dāwūd 521 · at-Tirmidhī 212“.

## Shotliste (Richtzeiten)
S1 Totale Gebetsraum, Adhan-Ende, Zeitbalken „IQAMA IN 10:00“, Hook „Diese Minuten verschwendet fast jeder.“ · S2 A01 aus dem
Off, Fahrt auf B an einer Säule mit Handy · S3 nah B mit Handy, B01, Tippen · S4 A setzt sich neben B, Schuss/Gegenschuss A02/B02 ·
S5 nah A (Profil/leicht von hinten), A03 · S6 KERNBILD: Display wird dunkel, Zeitbalken wird gold → Licht-Tor über dem Raum,
Karte H1 zu A04 · S7 nah B, Handy sinkt, B03 · S8 Halbtotale, weitere Wartende von hinten, A05, goldene Schrift „Wer wartet, ist
im Gebet“ · S9 Handy: Bildschirmzeit „heute: 47 Min.“, B04 · S10 Draufsicht, fünf goldene Lichtpunkte Fajr…Isha, Wörter „für
dich / für deine Eltern / für dein Jenseits“, A06 · S11 B steckt Handy ein, B05 · S12 A und B heben die Hände zum Bittgebet
(Rücken-/Seitenansicht), A07, Zeitbalken auf 0:00, Schlusssatz.

## Gestaltung / Ton
- Handy-Display eigenes Design (abstrakte Kacheln, keine App-Namen/Logos/Gesichter/Emojis). Zeitbalken oben, außerhalb der
  Bedienflächen, Marineblau #212242 / Gold #CA9E4E / Weiß. Licht-Tor weich golden, ohne Figur. Logo klein oben.
- Stimmen: zwei ElevenLabs-Dateien (A komplett, B komplett) von Ayman. Adhan-Ende weich ausblenden. Geräusche: Raumklang,
  Handy-Tippen (S3), Ton bei Karte, Rascheln beim Einstecken. Keine Musik.

## Technik (Phase 2)
- `web/index.html` + `web/main.js` (Kopie des Gebet-Renderers; Shots aus `/iq/web/shots`, Bausteine aus `/web/lib` des Gebet-Videos, nur gelesen).
- `web/board-data.js` (Shots S1–S12: Figuren, Posen, Kamera, Einblendungen), `web/shots/board.js` (Licht-Tor, fünf Lichtpunkte,
  Handy-Display als Textur, Raum dimmen), `web/grafik.js` (Zeitbalken, Display, Bildschirmzeit, Goldschrift, Wörter, Logo), `web/cards.js` (H1).
- `node tools/storyboard.mjs` → `out/phase2/cells/*.png`, `out/phase2/einzel/*.png`; `python3 tools/blatt.py` → Blätter.
- Server: `/iq/…` = iqama-video, sonst gebet-video.
