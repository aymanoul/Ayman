# 📖 Die Bibliothek — Aktueller Stand (Sichtung)

> **Erstellt:** 2026-07-04 · **Branch:** `claude/gracious-gates-n4j6z2` · **Remote:** `aymanoul/Ayman`
> **Letzter Commit:** `4a7fd70` „Startseite: das Buchregal wird das Herzstück (Bibliothekssaal)"
> **Build:** `tsc` 0 Fehler · Vite-Build grün · JS 742 kB (gzip 234) · CSS 168 kB (gzip 29)
> Alles committet und gepusht — Arbeitsverzeichnis sauber.

Dieses Dokument beschreibt den **realen, verifizierten Zustand** der Website
(nicht aus dem Gedächtnis — alle Angaben wurden gegen den Code geprüft).

---

## 1. Was ist das Projekt

**„Die Bibliothek"** — eine mehrsprachige (DE + arab./hebr./griech. Originaltexte)
Apologetik-Enzyklopädie. Erstes Modul: **„Muhammad in der Bibel" ﷺ** mit
**9 Siegeln** (Fundament, I–VII, Verteidigung).

**Stack:** React 18 · TypeScript 5.6 · Vite 5 · React Router 6 (HashRouter) ·
framer-motion 11 · handgeschriebenes CSS (Tailwind v4 installiert, kaum genutzt).

---

## 2. Befehle

```bash
npm install
npm run dev        # Dev-Server (Vite)
npm run build      # Production-Build (muss grün bleiben)
npx tsc --noEmit   # Typecheck (0 Fehler)
```

---

## 3. Routen (`src/App.tsx`)

| Pfad | Seite | Inhalt |
|---|---|---|
| `/` | `Bibliothek.tsx` | **Startseite / „Saal"** — Frontispiz + Suche + **Buchregal** + kommende Module |
| `/regal` | `Regal.tsx` | Eigene Regal-Seite (Buchreihe „Ar-Raheeq Al-Makhtoom") |
| `/modul/:moduleId` | `ModulePage.tsx` | Modul-Übersicht — Hero-Titelbild + Siegel-Bild-Karussell |
| `/modul/:moduleId/siegel/:sealId` | `SealPage.tsx` | Dispatcher → konkrete Siegel-Seite |
| `*` | `Bibliothek.tsx` | Fallback |

---

## 4. Design-System (Stand v5 — „Mushaf")

Die Optik hat mehrere Umbaustufen durchlaufen (v3 andalusisch → v4 strukturiert →
v5 Mushaf). **Aktuell gilt v5.** Tokens in `src/index.css`:

### Farben
- **Papier:** `--paper #f4ecdb` (warmes Pergament-Elfenbein) · `--paper-card #fbf6e9`
- **Tinte:** `--ink #2e2718` (warmes Sepia-Schwarz)
- **Salbei/Oliv (Primärakzent):** `--green #5f6f46`
- **Gold (Hairlines/Ornament):** `--brass #b3873a`
- **Andalusisches Rot:** `--anda #7a2e2e` → „Einwand", `<strong>`-Markierungen, `<mark>`
- **Medina-Grün:** `--medina #156b4a` → Kicker, „Konter", Titel (`.gilt`), **zitierte Verse**

### Schrift — EINE Schriftart
- **Alles** läuft in **Happy Time** (`--font-display`, `--font-body`, `--font-ui`).
  Fließtext normal, **Titel = fett (700)**. Fallback: Poppins.
- **Arabisch:** Cairo (UI) · **Koran-Verse:** Amiri Quran (`.quran-script`, im Beleg-Modal).
- **Hebräisch:** Frank Ruhl Libre.
- Alle Fonts **selbst gehostet** (`src/assets/fonts/`, `src/styles/fonts.css`), kein CDN.
- ⚠️ **Kamali** (`kamali.woff2/.otf`) liegt noch im Repo, wird aber **nicht mehr verwendet**
  (in v5 durch Happy Time ersetzt). Kann gelöscht werden.

### Ornamentik (v6 — Madina-Prachtrahmen)
- **Voller Fensterrahmen:** fester, umlaufender Prachtrahmen ums Sichtfeld
  (`body::before`, `border-image` auf `src/assets/ornaments/mushaf-frame.svg`):
  grünes Band, Goldranke, rosa Rosetten, Perlenreihen, Eck-Medaillons.
- **Titel-Rahmen:** Siegel-Titel + Sektions-Köpfe sitzen in **Madina-Kartuschen**
  (`border-image` auf `src/assets/ornaments/kartusche.svg`: grüne Endblöcke mit
  Spitzbogen + Mandorla-Medaillon, Wellenbänder; `.seal__title` / `.sec__head`).
- **Generator:** beide SVGs kommen aus `scripts/ornament.mjs` — dort ändern und
  neu generieren, nie im SVG. SVG-Roots brauchen explizite `width`/`height`.
- Keine freistehenden Deko-Symbole mehr (Shamsa/Sterne/Arabesken-Trenner wurden in
  v4 entfernt). Chevrons sind SVG-Icons (`src/components/icons.tsx`).

> Vollständige Design-Doku: **`DESIGN.md`** im Repo-Root.

---

## 5. Die Startseite (`src/pages/Bibliothek.tsx`) — NEUESTE ÄNDERUNG

Von einer flachen Textliste zu einem **Bibliothekssaal** umgebaut. Reihenfolge:

1. **Frontispiz** — arabischer Titel `اسم الناشر` (⚠️ **Platzhalter**, s. §8) + „Die Bibliothek".
2. **Suche + Frage-Feld** (`SearchPanel.tsx`).
3. **Der Saal (`.hall`, Breakout auf 1320px):**
   - Suren-Kartusche: „Modul I · Neun Siegel / **Muhammad in der Bibel ﷺ**"
   - Darunter das **Buchregal** (Herzstück, s. §6)
   - Button **„Zur Modul-Übersicht"** → `/modul/muhammad`
4. **„Weitere Stationen folgen"** — kommende Module (Jesus-Modul, Badge „bald").
5. Footer.

Scroll-Reveal per framer-motion (`whileInView`), `prefers-reduced-motion` respektiert.

---

## 6. Das Buchregal (1:1 Fath-al-Bari-Stil) — jüngste große Arbeit

**Komponente:** `src/components/Bookshelf.tsx` · **CSS:** `src/styles/bookshelf.css` ·
**Daten:** `src/data/regal.ts` (geteilt von Startseite + `/regal`).

- **Echte Bild-Textur, KEINE gezeichneten Vektoren:** `public/images/regal/spine.png`
  (558×2042, vom Betreiber gelieferter dunkelgrüner Leder-Rücken mit Gold-Arabesken,
  leerem Medaillon/Raute/Kartusche). Das Bild trägt die gesamte Ornamentik.
- **Nur die Texte** (Werktitel, Bandname, Bandnummer, المجلد, Autor, Verlag) liegen als
  HTML exakt in den **pixel-vermessenen** leeren Zonen der Textur (per Farbanalyse
  kalibriert). Name + Nummer + المجلد bilden eine im Medaillon zentrierte Gruppe.
- **9 Bände = die 9 Siegel**, arabisch übersetzt, jeder Rücken verlinkt auf sein Siegel:

  | # | Rücken (arab.) | Deutsch → Route |
  |---|---|---|
  | ١ | الأساس | Das Fundament → `fundament` |
  | ٢ | ذرية إبراهيم | Abrahams Nachkommen → `abrahams-nachkommen` |
  | ٣ | نبي مثل موسى | Prophet wie Mose → `prophet-wie-mose` |
  | ٤ | النبوءات العربية | Arabische Prophezeiungen → `arabische-prophezeiungen` |
  | ٥ | نشيد الأنشاد | Das Hohelied → `hohelied` |
  | ٦ | دانيال | Daniel → `daniel` |
  | ٧ | الفارقليط | Der Paraklet → `paraklet` |
  | ٨ | انتظار اليهود | Jüdische Erwartung → `juedische-erwartung` |
  | ٩ | الدفاع | Verteidigung → `verteidigung` |

  Werktitel `الرحيق المختوم` · Autor `ابن محمد والحجي` · Verlag `دار السنة`.
- **Deutsche Zuordnung:** Unter dem Regalbrett trägt jeder Band ein Schild
  „Band N · deutscher Titel" (immer sichtbar, selbst klickbar). **Hover koppelt beide
  Richtungen:** Buch anvisiert → Schild leuchtet grün; Schild anvisiert → Buch hebt sich.
- **Fallback:** Fehlt `spine.png`, rendert ein schlichter CSS-Rücken (aktuell nicht aktiv,
  Datei ist vorhanden).

---

## 7. Zwei-Ebenen-Mechanik (unverändert, nicht kaputt machen)

Jede Siegel-Seite (`src/pages/seals/*Seal.tsx`) hat:
- **Debatten-Ebene** (immer sichtbar): „Die These"-Block, 4-Schritt-Beweiskette
  (2-Spalten-Raster), Einwand/Konter-Akkordeon.
- **Gelehrten-Ebene** (hinter grünem Toggle-Button): 2-Spalten-Referenzraster.
- **Beleg-Modal** (`src/components/Beleg.tsx`): Volltexte (Original/Translit/Übersetzung)
  erscheinen NUR im Modal. Zitierte Verse in Grün.

> Inhalte aller 9 Siegel sind fertig und SPEC-treu. Quelle der Wahrheit: **`SPEC.md`**.

---

## 8. Offene Punkte (ehrlich — noch NICHT erledigt)

1. **Betreibername:** `اسم الناشر` auf der Startseite ist ein **Platzhalter**. Sobald
   der echte Name / die Kalligrafie geliefert wird, in `Bibliothek.tsx` ersetzen.
2. **Handy — Regal-Scroll ohne Andeutung:** Das Regal ist auf dem Handy horizontal
   scrollbar (man wischt durch alle 9 Bände), aber es gibt **keine sichtbare
   Andeutung** (Scrollbar ausgeblendet). Empfehlung: Fade-Kante / Wisch-Hinweis
   ergänzen. **← vom Nutzer angemerkt, noch offen.**
3. **Siegel-Titelbilder fehlen:** `public/images/siegel/` ist leer → das Karussell auf
   der Modul-Seite zeigt gestaltete Platzhalter-Karten. Format: 3:2 quer, Titel im Bild.
   Ebenso `public/images/module/muhammad.jpg` (Hero) fehlt → Frontispiz-Fallback.
4. **Kamali-Fontdateien** liegen ungenutzt im Repo (können entfernt werden).
5. **Bundle > 500 kB** (JS 742 kB): bekannt, unkritisch. Optional Code-Splitting.

---

## 9. Wichtige Dateien auf einen Blick

```
src/
  pages/
    Bibliothek.tsx      ← Startseite (Saal + Regal)  [NEU]
    Regal.tsx           ← /regal-Seite               [NEU]
    ModulePage.tsx      ← Hero + Karussell
    SealPage.tsx        ← Dispatcher
    seals/*Seal.tsx     ← 9 Siegel
  components/
    Bookshelf.tsx       ← Buchregal (Bild-Textur + Text-Overlay)  [NEU]
    SearchPanel.tsx · Beleg.tsx · ModulePlate.tsx · SiegelCarousel.tsx · icons.tsx
  data/
    regal.ts            ← Bände der Buchreihe         [NEU]
    modules.ts · seals/*.ts · types.ts · searchIndex.ts
  styles/
    bookshelf.css       ← Regal-Styles                [NEU]
    app.css (+ .hall)   ← Shells, Startseite, Saal
    seal.css · fonts.css · seals/*.css
  index.css             ← Design-Tokens (v5), Mushaf-Ränder
public/images/regal/
    spine.png           ← echte Buchrücken-Textur (558×2042)
    README.md           ← Zonen-Spezifikation
DESIGN.md · SPEC.md · STAND.md (dieses Dokument)
```

---

## 10. Kickoff für die nächste Session

```
Lies STAND.md, DESIGN.md und SPEC.md im Repo. Branch: claude/gracious-gates-n4j6z2.
Die Website ist eine React+TS+Vite Apologetik-Enzyklopädie im Mushaf-Design (v5).
Startseite = Bibliothekssaal mit echtem Buchregal (9 Siegel als Bände über einer
Bildtextur). Alle Inhalte fertig. Nächste offene Punkte stehen in STAND.md §8.
```

*Hinweis: Die ältere `SESSION-HANDOFF.md` (18.06.) beschreibt den Stand VOR den
Design-Umbauten und ist überholt — dieses Dokument (`STAND.md`) gilt.*
