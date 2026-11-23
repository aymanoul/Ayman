# PROJEKTGEDÄCHTNIS – Masjid As-Sunnah Ratingen: Videos (Stand 16.11.2026)

> **Diese Datei immer zuerst lesen.** Sie wird bei jedem Start im Projekt automatisch geladen und ist die
> zentrale, aktuelle Zusammenfassung. Details und Tagebuch: `UEBERGABE.md` (Abschnitte 0–14).
> Pläne: `docs/blender-plan.md`. **Bei jeder Änderung des Stands diese Datei und `UEBERGABE.md` aktualisieren,
> committen und pushen** – Ayman will, dass alles auch nach einem vollen Kontextfenster weitergeht.

---

## 1. Wer, was, wie

- **Auftraggeber:** Ayman, macht die Inhalte für die **Masjid As-Sunnah Ratingen** (Instagram/TikTok **@sunnahmoschee**,
  **masjid-sunnah.de**). Adresse Neubau: Am Westbahnhof 31.
- **Ayman ist kein Techniker, arbeitet am iPad, schreibt Deutsch.** Alles einfach auf Deutsch erklären. Vorschauen als
  **Bilder oder kurze Clips** schicken (SendUserFile). Fragen als **kurze Auswahl** (AskUserQuestion). Nach jeder Phase
  **stoppen und Freigabe abwarten**. Nichts erneut fragen, was hier schon entschieden ist.
- **Repo:** `aymanoul/Ayman`, Zweig **`claude/exciting-planck-xjdkte`**, Ordner **`gebet-video/`**. Nur auf diesen Zweig pushen.
  Kein Pull Request ohne Aufforderung. Keine Modell-ID in Commits/Dateien.
  Commits enden mit `Co-Authored-By: Claude …` + `Claude-Session: https://claude.ai/code/session_01Y7mABu5w37GuCDDEdSAsrV`
  (genaue Zeilen gibt das System vor).
- **Fremde Dateien im Repo nicht anfassen** (Fahrschul-Website): `HANDOFF.md`, `WARTUNG.md`, `site/`, `assets/` im Repo-Root,
  `scripts/`, `gebaeudereinigung-ar/`, `vercel.json`. Deren Regeln gelten nicht für dieses Projekt.
- Aymans E-Mail ist privat – nie nach außen geben.

## 2. FESTE REGELN (immer, nicht verhandelbar)

1. **KEINE AUGEN** bei keiner Figur, auch nicht angedeutet: keine Augäpfel, Lider, Wimpern, Punkte, Striche, Schatten in
   Augenform, keine Sonnenbrille. Augenpartie = glatte Haut. Gilt für Haupt- und Nebenfiguren, Schilder, Icons, Emojis.
   **Keine Augenbrauen** (entschieden). Auch Gegenstände dürfen nicht wie Gesichter wirken (z. B. Autos: Licht als
   durchgehendes Band, runde Punkte vermeiden). Erwünscht: Nase, Mund, Ohren, Bart, Haare. Grund: religiös.
2. Der Prophet ﷺ, andere Propheten, Engel und die Sahaba werden **nie als Figur** gezeigt.
3. **Keine Musik**, keine Instrumente, kein Gesang. (Adhan/Iqāma, Stimmen, Geräusche sind erlaubt.)
4. Quran: **uthmanische Schreibweise** (Schrift: KFGQPC Uthmanic Script HAFS). Übersetzung **wörtlich Bubenheim & Elyas**
   (quranenc.com, `german_bubenheim`). Im Quran-Text und in der Übersetzung nichts ergänzen, auch kein ﷻ/ﷺ.
5. Hadithe **wörtlich**, mit Quelle und Nummer, nur **ṣaḥīḥ/ḥasan**, an der Originalquelle geprüft, Liste zur Freigabe.
6. Im eigenen Text nach „Allah“ **ﷻ**, nach dem Propheten **ﷺ**. „Aisha“ ohne Sonderzeichen. Glaubensfragen nur nach
   Ahl as-Sunnah. Keine Urteile über einzelne Personen.
7. **Kein KI-Bild- oder Videogenerator** für Figuren und Räume (auch kein Higgsfield o. Ä.). Alles **3D per Code**.
- Bot-Sperren (Cloudflare auf sunnah.com, dorar.net) **nicht umgehen** – stattdessen hadeethenc.com nutzen.

## 3. Stand der Arbeiten

### A) Gebet-Video „Die Wichtigkeit des Gebets“ (Three.js) – **von Ayman freigegeben (11.11.2026)**
- 9:16, 1080×1920, 30 fps, **2:27**, −14 LUFS. Hook: „Du hörst den Adhan – und gehst weiter?“. Zwei Sprecher A (Ratgeber,
  weißer Qamis, Kufi, voller Bart) und B (junger Mann, blauer Qamis, kurzer Bart). Schlusssatz groß: „Dein nächstes Gebet
  ist dein Neuanfang.“ Keine Endkarte.
- Belege (Beweisliste freigegeben, `docs/phase3-beweisliste.md`): Q1 4:103 · Q4 107:4–5 · Q5 74:42–43 · H2 Muslim 82 (Jābir) ·
  H7 Tamīm ad-Dārī (Abū Dāwūd, Ibn Māja, ad-Dārimī · ḥasan) · H1 Ibn Masʿūd (al-Bukhārī 527, Muslim 85) ·
  H4 Fluss, Abū Huraira (al-Bukhārī 528, Muslim 667, zwei Karten). Genaue Kartentexte: `web/lib/cards-data.js`.
  Sahaba-Aussagen entfallen.
- Letzte Änderungen (alle umgesetzt): neuer Einstieg (Totale mit Schild, A an der Tür, B läuft vorbei), Moschee von außen
  beim Hineingehen, **Imam** vorne in der Schlussreihe, **Aymans eigener Adhan** (`assets/audio/roh/adhan_neu.mp3`),
  Iqāma-Platzhalter bleibt (Ayman: passt).
- **Gewählt:** Titelbild **Variante 1** (`out/phase9/titelbild_variante1.png`, Gebetsreihe), Beschreibung
  `docs/phase9-beschreibung.md` „passt so“.
- Dateien: Entwurf `out/phase7/gebet_video_entwurf.mp4` (157 MB, **nicht im Repo** – >100 MB; neu bauen, siehe 5.),
  Vorschau `out/phase7/gebet_video_entwurf_vorschau.mp4` (720p, im Repo).
- **Offen (Phase 8/9):** Schlussprüfung, Endfassung in voller Qualität, Projekt-ZIP. Ayman sagt dafür „Abgabe machen“.
  Erinnern: **Hadith-Nummern auf sunnah.com prüfen** (von hier gesperrt); Iqāma ist eine YouTube-Aufnahme (Rechte).

### B) Blender-Drehorte und Figuren – für künftige Videos (Plan: `docs/blender-plan.md`)
| Schritt | Inhalt | Stand |
|---|---|---|
| B0 | Blender 5.2.3 als Python-Modul (`bpy`) läuft hier | ✅ |
| B1 | **Gebetsraum** innen (Vorlage `assets/ref/gebetsraum_vorlage_7_ansichten.png`) → `blender/gebetsraum.blend` | ✅ **freigegeben** |
| B1b | **Gebäude außen** (Vorlage `assets/ref/gebaeude_vorlage_6_ansichten.png`) → `blender/gebaeude.blend` | ✅ gebaut, **wartet auf Freigabe** |
| B2 | **Hauptpersonen A und B**, je 2 Outfits (Vorlagen `assets/ref/figuren_vorlage_qamis.png`, `…_hemd_hose.png`) → `blender/figuren.blend` | ✅ gebaut, **wartet auf Freigabe** |
| B2b | Imam, Nebenfiguren | offen |
| B3 | Mund/Sprechen, Hände mit Fingern, Bewegungsabläufe (Gehen, Sitzen, Gebetshaltungen) | offen |
| B4 | Video-Baukasten (Einstellungen als Liste, Untertitel/Karten wie im Gebet-Video) | offen |
| B5 | Rendern + Ton | offen |

- **Figuren in Blender:** A = weiße Kufi, langer voller schwarzer Bart; Outfit 1 weißer Qamis + schwarze Schuhe,
  Outfit 2 weißes Hemd + weite schwarze Hose + weiße Sneaker. B = schwarze Locken, kurzer Bart; Outfit 1 dunkelgrüner Qamis
  + schwarze Schuhe, Outfit 2 dunkelgrünes Hemd + cremefarbene Hose + weiße Sneaker. Sammlungen `A_Qamis`, `A_Hemd`,
  `B_Qamis`, `B_Hemd`, je mit Skelett `<Name>_Skelett`. Gesicht glatt (Nase, Ohren; keine Augen/Brauen; Mund fehlt noch).
- **Offene Entscheidung (Ayman „überlegt es sich“):** Wie künftige Videos gerechnet werden – Blender ist hier ohne
  Grafikkarte langsam (Gebetsraum 1080×1920 EEVEE ≈ 32 s/Bild, Cycles 540×960 ≈ 19 s/Bild → 2:30-Video ≈ 40 h),
  Three.js ≈ 2 h. Optionen: kurze Blender-Tests · Blender halbe Auflösung · Three.js behalten (Blender für Titelbilder).
  **Nicht von selbst mit B3/B4 loslegen**, erst Freigabe von B1b/B2 und diese Entscheidung abwarten.

### C) NEUES VIDEO „Jeder Schritt zählt“ (~60 s) – Ordner `schritte-video/` (Plan: `schritte-video/PLAN.md`)
- Auftrag 16.11.2026: im **neuen Blender-Design** (Gebäude außen ohne Autos, Figuren `A_Qamis` + `B_Hemd`), Einblendungen
  mit dem Overlay-Baukasten des Gebet-Videos. Thema: jeder Schritt zur Moschee wird gezählt (Hook: Schrittzähler am Handy).
  Kein Auto/Fahren im Bild. Shotliste S1–S11 und Drehbuch A01–A07 / B01–B05 im Plan.
- Stimme: `schritte-video/assets/audio/roh/stimme_helmut.mp3` (ElevenLabs „Helmut“, 64,8 s, **eine Datei**: A01–A07, dann
  B01–B05; Transkript `assets/audio/transkript/helmut.json`).
- **Phase 1 (Beweisliste) erstellt, wartet auf Freigabe:** `schritte-video/docs/phase1-beweisliste.md`.
  H2 = Muslim 251 (hadeethenc 3574, geprüft; Karte im hadeethenc-Wortlaut „womit Allah die Sünden auslöscht …
  das häufige Schreiten zu den Moscheen“). H1 = Muslim 666 (nicht auf hadeethenc; arabischer Wortlaut mit A04 Wort für
  Wort abgeglichen, A04 passt; Ayman soll auf sunnah.com gegenprüfen).
- **Phase 1 freigegeben (16.11.).** B wird von Ayman **neu aufgenommen** (andere Stimme); B trägt **Hemd und Hose**.
- **Phase 2:** Ayman wollte den Hook anders → S1 = B läuft mit Handy zur Moschee (über die Schulter, Moschee dahinter,
  vergrößerter Handy-Bildschirm daneben). Umgesetzt. **Storyboard freigegeben (16.11.).** Phase 3 mit **B-Platzhalter** (alte Helmut-B-Zeilen, auf Aymans Wunsch): Rohschnitt fertig `schritte-video/out/phase3/rohschnitt_720p.mp4` (65,5 s), **freigegeben (16.11.)**. Phase 4: Vorschau `schritte-video/out/phase4/vorschau_720p.mp4` **freigegeben (16.11.)**; Technik PLAN.md Abschnitt 10. Phase 5: neue B-Stimme (Jörg) eingebaut, Logo entfernt. **Endfassung fertig (17.11.)**: `schritte-video/out/schritte_video.mp4` + `schritte_video_vorschau_720p.mp4`, an Ayman geschickt. Offen: Titelbild-Wahl. Lange Berechnungen: siehe UEBERGABE 14t (Umgebung schaltet bei Untätigkeit ab). Merkpunkt Endfassung: Mund von A ist rötlich und wirkt in Seitenansicht wie ein Fleck → dunkler/flacher machen. Technik: `schritte-video/PLAN.md` Abschnitt 9. Storyboard: `schritte-video/out/phase2/storyboard.jpg`, `display_und_zaehler.jpg`.
  Technik-Stand und Befehle: `schritte-video/PLAN.md` Abschnitt 8.
- Phasen: 1 Beweisliste · 2 Storyboard (11 Bilder + Handy-Display) · 3 Stimmen/Zeitplan/Rohschnitt 720p ·
  4 Zähler, Fußabdrücke, fünf Wege, Karten, Untertitel, Geräusche · 5 Endfassung, 2 Titelbilder, Beschreibung (genau 5 Hashtags).

### D) Iqama-Video „Zwischen Adhan und Iqama“ (Ordner `iqama-video/`) – Auftrag 17.11.2026
- ~60 s, 9:16, nur Gebetsraum. **Ayman 17.11.: „mit Blender, im bekannten Stil“** (wie „Jeder Schritt zählt“) statt Three.js →
  Blender-Gebetsraum `gebetsraum.blend`, A = `A_Qamis`, B = `B_Hemd`, Nebenfiguren = umgefärbte Kopien. Code `iqama-video/blender/`.
  Das Three.js-Storyboard (freigegeben) bleibt als Vorlage für Ablauf und Einblendungen; Blender-Storyboard **freigegeben (17.11.)**. Phase 3: Stimme (Helmut für A und B, eine Datei) zerlegt, Adhan-Ende = letzte Worte von adhan_neu.mp3, Zeitplan 61,3 s, Rohschnitt fertig `iqama-video/out/phase3/rohschnitt_720p.mp4` (61,3 s, −14,9 LUFS) → **freigegeben (17.11.)**. Phase 4: Vorschau `iqama-video/out/phase4/vorschau_720p.mp4` → **freigegeben (17.11.)**. **Endfassung fertig (18.11.)**: `iqama-video/out/iqama_video.mp4` + `iqama_video_vorschau_720p.mp4`, geprüft, von Ayman **freigegeben (18.11.)**. Titelbild: **Variante 1** (`iqama-video/out/phase5/titelbild_variante1.png`). Offen nur: Ayman prüft Hadith-Nummern auf sunnah.com. Beschreibung `iqama-video/docs/phase5-beschreibung.md`. Technik: `iqama-video/PLAN.md` Abschnitt „Technik (Blender)“.
- Phase 1: Beweisliste `iqama-video/docs/phase1-beweisliste.md`. H1 hadeethenc 5479 (Abū Dāwūd 521, at-Tirmidhī 212, ṣaḥīḥ),
  geprüfte Übersetzung „Das Bittgebet zwischen Adhan und Iqamah wird nicht abgelehnt.“ → **Beweisliste freigegeben (17.11.)**; A04 wird mit dem geprüften
  Wortlaut neu aufgenommen, A01/B03/Schlusssatz ebenfalls „abgelehnt“ (Drehbuch in `iqama-video/PLAN.md`).
  Phase 2: Storyboard `iqama-video/out/phase2/storyboard.jpg` **freigegeben (17.11.)**. H2 hadeethenc 3435 (Muslim 649, al-Bukhārī 647) passt zu A05. Stand: `iqama-video/PLAN.md`.

### E) NEUES VIDEO „Projekt Moschee Neubau – Drohnenflug mit Bau-Zeitraffer“ (Ordner `neubau-video/`) – Auftrag 19.11.2026
- **Zuerst `neubau-video/AUFTRAG.md` (wörtlicher Auftrag) und `neubau-video/PLAN.md` (Stand) lesen.**
- Ausnahmen nur für dieses Video: **Higgsfield erlaubt** (vor jedem Auftrag Kosten nennen, Freigabe abwarten; nie Text/Logo/QR);
  Blender läuft auf **Aymans MacBook** (`~/Movies/Neubau/neubau.blend`). Keine Figuren/Autos/Maschinen im Bild, keine Musik.
- Stand: Unterlagen + Architektenplan da; **Phase 1 Lageplan freigegeben (19.11.)** (`neubau-video/out/phase1/lageplan.png`, Grundstück 900 m², ~50 m). Phase 2 (Umgebung) im Container gebaut (`neubau-video/blender/umgebung.py` → `neubau.blend`), Vorschau `neubau-video/out/phase2/uebersicht.jpg` + `vergleich.jpg` wartet auf Freigabe und Wahl der Sonnenrichtung. Phase 2 freigegeben (Sonne von vorn). Phase 3 freigegeben. Phase 4: Variante B, Aymans Änderungen umgesetzt (Schornstein weg, **kein Text im Video**, Wohnwagen, Hof voller, mehr Details, 60 s, Schluss wie sein Beispielbild mit offenem Dach). Korrigierte Endfassung geschickt (20.11.); danach weitere Änderungen (Keller unter Moschee+Hof mit Säulen/Treppen/Leuchten, Wohnwagen fallen auf den Platz) + Glas-Rückwand zum Hof, Schiebedach über dem Hof, Keller ohne Trennwand → **neue Endfassung fertig (20.11., 23:32 UTC), geprüft und an Ayman geschickt** (`neubau-video/out/neubau_drohne.mp4`), siehe PLAN.md. **23.11. neue Änderungen** (Umgebung wie Aymans Bild, Parkplätze andersherum, neuer Anfang von oben, Schluss ohne offenes Dach) + Korrektur 23.11. nachmittags (Front bündig, rechte Seite Glas, schmale Häuserzeile links, Hallenreihe gegenüber) → Neu-Rendern auf Aymans Wunsch GESTOPPT (**nie ohne seinen ausdrücklichen Befehl ein Video rendern**). 23.11. abends: Keller-Stützen 3×3 je Raum; Keller = Mehrzweckraum (festsaal.py); Wohnwagen-Front 3 Schiebeflügel; keine Platte vor der Moschee; roter Gebetsteppich; 4 Autos (autos.py, läuft in moschee.py), 2 parken im Video ein – siehe PLAN.md. 4 fotorealistische Higgsfield-Bilder gemacht (8 Credits, `neubau-video/out/higgsfield/echt/`). **Offen:** Ayman schaut das Video an; danach auf sein „los“ Higgsfield-Video Seedance 2.5, 720p, 2×30 s, 450 Credits, Prompt + Ablauf in `neubau-video/docs/higgsfield_prompts.md`; Claude schneidet zusammen, skaliert auf 1080p, eigener Ton. Hadith Abschlusskarte gewählt (al-Bukhārī 450 · Muslim 533), QR geprüft. Ayman möchte später LIVE in seinem Blender zusehen (execute_blender_code/MCP, `~/Movies/Neubau/neubau.blend`, nach jedem Schritt melden) – bis dahin auf seinen Wunsch im Container weiter. Siehe `neubau-video/PLAN.md`.

## 4. Wo was liegt (in `gebet-video/`)

| Pfad | Inhalt |
|---|---|
| `UEBERGABE.md` | Ausführliche Übergabe: Regeln, alle Entscheidungen, Technik, Tagebuch 14a–14r |
| `docs/` | Phasen-Dokumente 0–9, Beweisliste, Drehbuch, Shotliste, `blender-plan.md`, `quellen/` (Quran/Hadith-JSON) |
| `web/` | Three.js-Film: `main.js`, `lib/` (figure, poses, room, exterior, props, overlay, cards-data …), `shots/film.js`, `sheets/board.js` (49 Shots) |
| `tools/` | `render.mjs`, `schedule.py`, `build_mix.py`, `mix.py`, `sfx.py`, `prep_lines.py`, `split_voices.py`, `transcribe.py`, `blender_tex.mjs` |
| `audio/` | `timeline.json`, `mix_film.json`, `mix_probe_hook_strasse.json` |
| `assets/audio/` | `roh/` (Stimmen, Adhan, Iqāma), `zeilen/` (A01–A14, B01–B09 + `lines.json`), `transkript/` |
| `assets/ref/` | Alle Vorlagen von Ayman (Fotos, Gebetsraum 7 Ansichten, Gebäude 6 Ansichten, Figuren-Outfits) |
| `assets/brand/` | Logos/Kalligrafie der Moschee |
| `blender/` | `raum.py`, `gebaeude.py`, `figuren.py` (bauen die `.blend`), `ansichten.py`, `blaetter.py`, `szene_test.py`, `kamerafahrt.py`, `tex/` |
| `out/` | Ergebnisse je Phase (`phase0`…`phase9`), `out/blender/` (Ansichten, Figurenblätter, Proben) |

## 5. Befehle

```bash
cd gebet-video && npm install                 # Three.js-Teil (Playwright/Chromium ist vorinstalliert)
# Gebet-Video: Zeitplan, Ton, Rendern in Abschnitten, Zusammenbau (Details docs/phase7.md)
python3 tools/schedule.py && python3 tools/build_mix.py && python3 tools/mix.py audio/mix_film.json out/phase7/film_ton.wav
for r in "0 23.6 0" "23.6 60 a" "60 100 b" "100 147.34 c"; do set -- $r; node tools/render.mjs film --from $1 --to $2 --out out/phase7/teil_$3.mp4; done
#   dann concat (teil_0, a, b, c) → film_video.mp4, mux mit film_ton.wav + loudnorm=I=-14:TP=-1.5 → gebet_video_entwurf.mp4
node tools/render.mjs film --still 12.5,40     # Standbilder zur Kontrolle → out/stills/

# Blender (einmalig einrichten, ca. 400 MB):
python3 -m venv .venv-blender && .venv-blender/bin/pip install bpy==5.2.3 numpy
apt-get update && apt-get install -y --no-install-recommends libegl1 libgl1-mesa-dri libgles2   # nur für EEVEE
node tools/blender_tex.mjs                                    # Tafel- und Schild-Texturen
.venv-blender/bin/python blender/raum.py                      # → blender/gebetsraum.blend
.venv-blender/bin/python blender/gebaeude.py                  # → blender/gebaeude.blend
.venv-blender/bin/python blender/figuren.py                   # → blender/figuren.blend
.venv-blender/bin/python blender/ansichten.py --datei gebaeude --samples 48    # Kontroll-Ansichten
.venv-blender/bin/python blender/blaetter.py                  # Figurenblätter + Bewegungsprobe
.venv-blender/bin/python blender/szene_test.py --ort gebaeude # Figuren an einem Drehort
```
Hinweise: In Blender-Skripten zuerst `import bpy`, dann `bmesh`/`mathutils`. Achsen Blender: X rechts, **Y zur Qibla**,
Z oben (Three.js: (x, y, z)_Blender = (x, −z, y)_Three). Figuren-Knochen: lokale X-Achse = Welt-X; Pose in Grad über
`figuren.pose(skelett, {...})`. Große Dateien (>100 MB) nicht committen (`.gitignore` regelt Zwischenstände).

## 6. Umgebung

- Cloud-Umgebung „Ayman“ (persönlich) erlaubt u. a. quranenc.com, hadeethenc.com/api.hadeethenc.com, huggingface (für
  faster-whisper), sunnah.com/dorar.net (dort aber Cloudflare-Sperre – nicht umgehen).
- Spracherkennung: faster-whisper „small“ (int8, CPU), Audio über ffmpeg dekodieren.
- Kein Blender auf Aymans Gerät erreichbar (kein Computer verbunden); Blender läuft nur hier im Container.
- Blender-Skills (Auswahl aus github.com/arjun988/blender-skills, MIT, 18.11. auf Aymans Wunsch): `.claude/skills/` im
  Repo-Wurzelordner – lighting, camera-cinematography, rendering, animation, materials. Nur als Fachwissen nutzen; feste Regeln
  gehen vor (keine Augen); die Skills setzen „Blender MCP“ voraus, wir arbeiten mit bpy. Siehe `.claude/skills/README-blender-skills.md`.

## 7. Nächste Schritte (Reihenfolge)

0. **Schritte-Video:** Titelbild-Wahl von Ayman abwarten; Erinnerung Muslim 666/251 auf sunnah.com prüfen.
1. Aymans Rückmeldung zu **Gebäude außen** und **Hauptpersonen** abwarten → ggf. Änderungen.
2. Entscheidung zur Rechenweise künftiger Videos abfragen, wenn Ayman so weit ist.
3. Auf „Abgabe machen“: Phase 8 (Prüfung, Belege nochmals gegen Quelle) und Phase 9 (Endfassung, Titelbild V1,
   Beschreibung, Projekt-ZIP) für das Gebet-Video.
