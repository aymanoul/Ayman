# 📖 Die Bibliothek — Vollständiger Stand & Übergabe

> **Stand:** 2026-07-06 · **Branch:** `claude/gracious-gates-n4j6z2` · **Remote:** `aymanoul/Ayman`
> **Letzter Commit:** `665f0e8` „PWA + Offline-Modus"
> **Live:** https://aymanoul.github.io/Ayman/ (öffentliches Repo, GitHub Pages)
> **Build:** `npx tsc --noEmit` 0 Fehler · `npm run build` grün · Service Worker (53 Precache-Einträge, ~5,9 MB)

Dieses Dokument ist die **einzige nötige Wissensquelle für die nächste Sitzung**.
Alle Angaben sind gegen den Code geprüft. Ergänzend: `DESIGN.md` (Design-Doku),
`SPEC.md` (inhaltliche Wahrheit aller Bücher). `SESSION-HANDOFF.md` ist **veraltet**
(Stand vor allen Umbauten) — ignorieren.

---

## 1. Was ist das Projekt

**„Die Bibliothek"** — eine mehrsprachige (DE + arab./hebr./griech. Originaltexte)
Apologetik-Enzyklopädie der vergleichenden Religion. Erstes und einziges fertiges
Werk: die Buchreihe **„Der versiegelte Nektar"** (arab. الرحيق المختوم) —
**9 Bücher** (Buch 1 = Das Fundament … Buch 9 = Verteidigung), die eine prüfbare
Frage entfalten: Ist Muhammad ﷺ in den früheren Schriften angekündigt?

> ⚠️ Historie: Hieß früher Modul „Muhammad in der Bibel ﷺ" mit „Siegeln". Seit v9
> heißt alles „Der versiegelte Nektar" / „Buch 1–9". Zweites Modul „Jesus, der
> Gesandte Gottes" existiert als Platzhalter-Kachel (Status `coming`), ohne Inhalt.

**Stack:** React 18 · TypeScript 5.6 (`strict:false`) · Vite 5 · React Router 6
(**HashRouter** — wichtig für statisches Hosting) · framer-motion 11 · **handgeschriebenes
CSS** (Tailwind v4 installiert, praktisch ungenutzt) · vite-plugin-pwa · sharp (nur dev).

---

## 2. Befehle

```bash
npm install
npm run dev          # Dev-Server
npm run build        # Production-Build (muss grün bleiben) → erzeugt dist/ + sw.js
npm run preview      # gebautes dist/ testen (SW funktioniert nur hier/HTTPS, nicht in dev)
npx tsc --noEmit     # Typecheck (0 Fehler halten)
node scripts/pwa-icons.mjs       # App-Icons neu erzeugen (nach public/icons/)
node scripts/ornament-crop.mjs   # Mushaf-Ornament-Bilder zuschneiden (braucht sharp)
```

---

## 3. Hosting / Deploy (WICHTIG — hier steckt die meiste Reibung)

- **Workflow:** `.github/workflows/deploy-pages.yml` — baut bei jedem Push auf den
  Branch und deployt auf GitHub Pages (`actions/deploy-pages@v4`). `base: './'` +
  HashRouter = keine Server-Rewrites nötig, läuft im Unterpfad `/Ayman/`.
- **Einmalige Einstellungen (alle bereits erledigt):**
  1. Repo ist **öffentlich** (Pages gibt's für private Repos nur mit Bezahlplan).
  2. Settings → Pages → **Source = „GitHub Actions"**.
  3. Settings → Environments → **github-pages** → Deployment branches = **„No restriction"**
     (sonst darf der Nicht-`main`-Branch nicht deployen → deploy-Job scheitert sofort ohne Runner).
- **Transiente Deploy-Fehler:** GitHub Pages liefert gelegentlich
  „Deployment failed, try again later." — das ist **kein Code-Fehler** (der `build`-Job
  ist grün, das Artefakt gültig). Lösung: **den fehlgeschlagenen Deploy-Job erneut
  ausführen** (Actions → Run → „Re-run failed jobs"), dann geht's live. Genau das ist
  am 2026-07-06 beim PWA-Commit passiert.
- Ich (Agent) kann `https://aymanoul.github.io` aus der Sandbox **nicht** selbst
  aufrufen (Netzwerk-Whitelist blockt github.io) — nur über die GitHub-MCP-API prüfen.

---

## 4. Routen (`src/App.tsx`)

| Pfad | Seite | Inhalt |
|---|---|---|
| `/` | `Bibliothek.tsx` | Startseite/„Saal": Titel, Suche + Frage-Feld, Buchregal, kommende Module |
| `/regal` | `Regal.tsx` | Eigene Regal-Seite (dieselbe Buchreihe) |
| `/modul/:moduleId` | `ModulePage.tsx` | Inhaltsverzeichnis — Hero + Buch-Karussell |
| `/modul/:moduleId/buch/:sealId` | `SealPage.tsx` | Dispatcher → konkrete Buch-Seite + `BuchExtras` |
| `/modul/:moduleId/siegel/:sealId` | `SealPage.tsx` | **Alias** — alte Links bleiben gültig |
| `/einstellungen` `/favoriten` `/notizen` `/verlauf` `/ueber` | je eigene Seite | neu (PWA) |
| `*` | `Bibliothek.tsx` | Fallback |

`sealId`-Slugs: `fundament`, `abrahams-nachkommen`, `prophet-wie-mose`,
`arabische-prophezeiungen`, `hohelied`, `daniel`, `paraklet`, `juedische-erwartung`,
`verteidigung`. (Achtung: Slugs sind historisch, `nummer` ist 1–9.)

---

## 5. Design-System (Stand v10)

Umbaustufen: v3 andalusisch → v4 strukturiert → v5 Mushaf → v6 Vektor-Ornamentik
(**verworfen**) → v7 Foto-Ornamentik → v8 Schrift Inter → v9 „Der versiegelte Nektar" →
v10 PWA/Offline. Tokens in `src/index.css`. **Vollständige Doku: `DESIGN.md`.**

### Farben (CSS-Variablen in `src/index.css`)
- Papier `--paper #f4ecdb` · `--paper-card #fbf6e9` · Tinte `--ink #2e2718`
- Salbei/Oliv `--green #5f6f46` · Gold `--brass #b3873a`
- Andalusisch-Rot `--anda #7a2e2e` (Einwand/Markierung) · Medina-Grün `--medina #156b4a`
  (Kicker/Konter/Titel `.gilt`/zitierte Verse)

### Schrift (v8) — **Inter (Titel/UI, kursiv) + Poppins (Fließtext, aufrecht)**
- Happy Time & Kamali **entfernt** (wirkten „KI"/dekorativ).
- `--font-display` / `--font-ui` = **Inter 18pt**, selbst gehostet, **nur Italic** vorhanden.
  ⚠️ **Jede Regel mit diesen Tokens MUSS `font-style: italic` mitsetzen**, sonst weicht der
  Browser auf den Fallback aus. Bei neuen Regeln immer ergänzen. (`scripts/font-italic-insert.py`
  hat das mechanisch über alle CSS-Dateien gemacht.)
- `--font-body` = **Poppins**, aufrecht (lange Leseabschnitte).
- Arabisch: Cairo · Hebräisch: Frank Ruhl Libre · Koran-Verse: Amiri Quran (im Beleg-Modal).
- Alle Fonts selbst gehostet in `src/assets/fonts/` + `src/styles/fonts.css`, kein CDN.

### Ornamentik (v7) — **echte Bilder, keine Vektoren**
- Voller umlaufender **Mushaf-Prachtrahmen** ums Sichtfeld (`body::before`, `border-image`
  auf `src/assets/ornaments/mushaf-frame-photo.webp`).
- **Madina-Kartuschen** für Titel (`.seal__title`/`.sec__head`, `border-image` auf
  `kartusche-photo.webp`).
- **Herkunft/Workflow:** Rohbilder (vom Nutzer via ChatGPT-Bild erzeugt) in
  `src/assets/ornaments/source/*-raw.png` → `scripts/ornament-crop.mjs` (sharp) schneidet zu +
  exportiert `*-photo.webp`. **Slice-Werte in `index.css`/`seal.css` sind auf genau diese
  WebP-Maße vermessen** — bei neuem Bild: Skript neu laufen, Slice-Werte aus Konsole übernehmen.
- Handy: Rahmen reduziert auf Zierband oben/unten + schmale Goldlinie seitlich (sonst Matsch).
  ⚠️ `border-image-width` MUSS in der Mobile-Media-Query mitgesetzt werden (nicht nur `border-width`).

### Text-Einfärbung (`src/lib/fmt.tsx`)
`fmt(text)` färbt in Prosa automatisch, ohne die Datenstrings zu ändern: zitierte „…"-Phrasen
grün (`.tx-q`), Stellenangaben `(7,157)` gold (`.tx-ref`), Eulogie ﷺ gold (`.tx-hon`).
Angewendet auf **These + Schritt-Texte** jeder Buch-Seite. Erweiterbar auf Leads/Konter.

---

## 6. Inhalts-Datenmodell

- `src/data/modules.ts` — `module1` (id `muhammad`, titel „Der versiegelte Nektar", arab.
  الرحيق المختوم) mit 9 `SealMeta` (`id`, `nummer` „1"–„9", `titel`, `arabic`, `keywords`, `status`).
  Plus `module2` (jesus, `coming`). `findModule`, `findSeal`, `searchIndex`.
- `src/data/seals/<name>.ts` (9 Dateien) — je Buch: `<name>These` (String), `<name>Steps`
  (`{n,h,body}[]`), `<name>Konter` (`{einwand,konter}[]`), `<name>Scholar` (`{h,body}[]`),
  `<name>Belege` (Objekt aus `Beleg`), plus Exhibit-Daten & `Vernetzung`. **SPEC-treu, nicht
  frei umschreiben** — Quelle der Wahrheit ist `SPEC.md`.
- `src/data/belegRegistry.ts` — alle Belege global, Key `sealId:key`; Modal öffnet via `?beleg=<ref>`.
- `src/data/sealText.ts` — `sealFullText[sealId]`: rekursiv gesammelter Volltext je Buch (Basis
  für Suche + Offline-Index).
- `src/data/searchIndex.ts` — kuratierte Sucheinträge (Ziel + Anchor).
- `src/data/types.ts` — `SealMeta`, `ModuleMeta`, `Beleg`.
- ⚠️ Geschützte Begriffe, **nicht** umbenennen: „Siegel der Propheten" / „Siegel zwischen den
  Schultern" (Hadith-Inhalte, kein Kapitelverweis).

---

## 7. Such- & Antwort-Engine (kein Backend, alles im Browser)

- `src/lib/search.ts` — Client-Suche: Normalisierung (Diakritika/ß/Umlaute), Stopwords,
  Synonyme, Token-Scoring, Levenshtein-Fuzzy, Vers-Referenzen. Exportiert auch
  `tokenize`/`normalize`/`canon`. `SearchPanel.tsx` Suchfeld navigiert zu Zielen.
- `src/lib/antwort.ts` — **Antwort-Engine** des Frage-Felds. Baut Korpus aus
  These/Schritten/Einwand→Konter/Gelehrten/Belegen aller Bücher; scort mit derselben
  Normalisierung; die kuratierte Suche dient als thematischer Kompass + liefert Exponat-
  Direktlinks. Einwand-artige Fragen werden mit dem **Konter** beantwortet.
  **Konversationsmodus:** `antworte(frage, ctx)` — Folgefragen erben Buch + Thema der letzten
  Antwort (`AntwortKontext`), Intent-Routing (Belege/Gelehrte/Konter/These), bereits gezeigte
  Passagen werden nicht wiederholt; lange neue Fragen lösen sich vom Kontext.
- `SearchPanel.tsx` rendert den Chat-Verlauf (Frage-Bubble + Antwort-Karte mit Quellen-Pill
  „Aus Buch N", „Auch dazu"-Chips, Folge-Chips „Belege/Gelehrte/Einwände", „Verlauf löschen").
  Styles: `.chat*` in `src/styles/app.css`.
- `src/lib/offlineBooks.ts` — separate Offline-Suche in heruntergeladenen Büchern (IndexedDB).
- Das Frage-Feld ist eine **eigene Komponente** `src/components/ui/gradient-ai-chat-input.tsx`
  (Pastell-Verlaufsrahmen, nur Textzeile + Papierflieger; Attach/Modell-Chip wurden entfernt).
- ⚠️ **Es ist KEINE echte KI** (kein LLM, kein API-Key). Funktioniert daher voll offline.

---

## 8. PWA & Offline (v10 — jüngste große Arbeit)

- **PWA:** `vite-plugin-pwa` (`vite.config.ts`), `registerType: 'autoUpdate'`,
  `injectRegister: false`. Precache des kompletten App-Shells (JS/CSS/Fonts/Bilder). Da die 9
  Bücher im JS-Bundle stecken, ist **die ganze Bibliothek + Suche + Antwort-Engine offline nutzbar**.
  Manifest im Plugin, Icons in `public/icons/` (`scripts/pwa-icons.mjs`, Medina-grüner Achtstern).
  `index.html`: theme-color, apple-touch, standalone-Metas.
- **SW-Registrierung:** manuell in `src/main.tsx` via `src/lib/pwa.ts` (`enableOffline`/
  `disableOffline`), gekoppelt an den Offline-Schalter der Einstellungen (Default an).
- **Lokale Nutzerdaten (IndexedDB):** `src/lib/db.ts` — DB `bibliothek`, Stores `favoriten`,
  `notizen`, `verlauf` (keyPath `sealId`). Kein Server → keine Synchronisierung; Daten bleiben
  auf dem Gerät.
- **Offline-Bücher (IndexedDB):** `src/lib/offlineBooks.ts` — DB `bibliothek-offline`, Store
  `buecher`. Jedes Buch einzeln speicherbar (Volltext + Token-Index + Metadaten) → Offline-Suche.
- **App-Hülle:** `src/components/AppChrome.tsx` (+ `styles/chrome.css`) — Hamburger oben links →
  Side-Panel von links (Bibliothek, Bücher, Favoriten, Notizen, Zuletzt gelesen, Einstellungen,
  Über), Online/Offline-Statuschip + Toast bei Verbindungswechsel. In `App.tsx` global gerendert.
- **Buch-Extras:** `src/components/BuchExtras.tsx` (+ `styles/buchextras.css`) — schwebender
  Stern (Favorit) + Notiz-Sheet oben rechts auf jeder Buch-Seite; erfasst „Zuletzt gelesen"
  automatisch beim Öffnen. Eingehängt in `SealPage.tsx` (Dispatcher rendert `<Built/>` + `<BuchExtras/>`).
- **Einstellungen:** `src/pages/Einstellungen.tsx` (+ `styles/pages.css`, geteilt mit den
  Listen-Seiten). Bereiche: **Darstellung** (Farbschema Hell aktiv / Dunkel *vorbereitet*,
  Schriftgröße 90–130 %, Animationen reduzieren), **Sprache** (Deutsch aktiv, English/Arabisch
  *vorbereitet*), **Offline** (Modus an/aus, 9 Bücher einzeln laden/löschen, echte Speicheranzeige
  via `navigator.storage.estimate`, alles löschen), **Meine Daten** (Fav/Notiz/Verlauf löschen).
- **Einstellungs-Store:** `src/lib/settings.tsx` — Context + localStorage-Key `bibliothek:settings`.
  Wirkt sofort: `fontScale` = `:root` font-size, `theme` = `data-theme`, `reduceMotion` = `data-reduce-motion`
  + framer `MotionConfig` (in `App.tsx`). `src/lib/useOnline.ts` = Online-Hook.
- **Utility-Seiten:** `Favoriten.tsx`, `Notizen.tsx`, `Verlauf.tsx`, `Ueber.tsx`, gemeinsamer
  Kopf `src/components/PageHead.tsx`.

> **Bewusste Abweichungen von der PWA-Spec (ehrlich, dem Nutzer erklärt):**
> 1. Der „KI-Chat" braucht KEIN Internet → funktioniert offline weiter, **keine** „braucht
>    Internet"-Karte (die wäre falsch). 2. **Keine geräteübergreifende Synchronisierung** (kein
>    Backend). 3. Beispiel-Werke „Riyad as-Salihin/Bulugh al-Maram" existieren nicht → Offline-Liste
>    zeigt real die 9 Bücher.

---

## 9. Die Zwei-Ebenen-Mechanik der Buch-Seiten (nicht kaputt machen)

Jede `src/pages/seals/*Seal.tsx`: **Debatten-Ebene** (These-Block, 4-Schritt-Beweiskette,
Einwand/Konter), **Gelehrten-Ebene** (Toggle), **Beleg-Modal** (`src/components/Beleg.tsx`,
Volltexte Original/Translit/Übersetzung, zitierte Verse grün). Inhalte aller 9 Bücher fertig.

---

## 10. Datei-Landkarte (das Wichtigste)

```
src/
  App.tsx                         Routen + AppChrome + MotionConfig
  main.tsx                        SettingsProvider + SW-Registrierung
  index.css                       Design-Tokens (v10) + Mushaf-Rahmen
  pages/
    Bibliothek.tsx  Regal.tsx  ModulePage.tsx  SealPage.tsx(Dispatcher+BuchExtras)
    Einstellungen.tsx  Favoriten.tsx  Notizen.tsx  Verlauf.tsx  Ueber.tsx   [PWA]
    seals/*Seal.tsx (9)           die fertigen Bücher
  components/
    AppChrome.tsx  BuchExtras.tsx  PageHead.tsx                              [PWA]
    SearchPanel.tsx               Suche + Frage-Feld/Chat
    ui/gradient-ai-chat-input.tsx Frage-Eingabe
    Beleg.tsx  Bookshelf.tsx  SiegelCarousel.tsx  ModulePlate.tsx  icons.tsx
    exhibits/*                    interaktive Exponate pro Buch
  lib/
    search.ts  antwort.ts  fmt.tsx        Suche/Antwort/Einfärbung
    settings.tsx  useOnline.ts  pwa.ts  db.ts  offlineBooks.ts               [PWA]
    anim.ts  useImage.ts
  data/
    modules.ts  types.ts  searchIndex.ts  belegRegistry.ts  sealText.ts
    regal.ts  seals/*.ts (9)
  styles/
    app.css(+.chat, .seek, .hall)  seal.css  chrome.css[PWA]  pages.css[PWA]
    buchextras.css[PWA]  gradient-ai-chat-input.css  bookshelf.css  carousel.css  fonts.css
  assets/fonts/*  assets/ornaments/{*-photo.webp, source/*-raw.png}
public/icons/*  (PWA-App-Icons)
scripts/  pwa-icons.mjs  ornament-crop.mjs  font-italic-insert.py  seal-textstyle.py  (+ Screenshot-Helfer)
.github/workflows/deploy-pages.yml
DESIGN.md (Design)  SPEC.md (Inhalt, Wahrheit)  STAND.md (dieses Dokument)
```

---

## 11. Offene Punkte / mögliche nächste Schritte

1. **Dunkelmodus** ist verkabelt (Umschalter + `data-theme="dark"`), aber **optisch nicht
   ausgestaltet** — kein dunkles Token-Set. Nächster logischer Schritt.
2. **i18n (English/Arabisch)** nur als Umschalter *vorbereitet* — keine echte Übersetzung/kein
   Übersetzungs-Layer implementiert.
3. **Buch-Titelbilder fehlen:** `public/images/siegel/` leer → Karussell zeigt gestaltete
   Platzhalter. `public/images/module/muhammad.jpg` (Hero) fehlt → Frontispiz-Fallback.
4. **Betreibername** auf der Startseite wurde entfernt (früherer arabischer Platzhalter). Falls
   ein echter Name/Kalligrafie kommt: in `Bibliothek.tsx` einsetzen.
5. **Echte KI** (frei formulierende Antworten / Bildverständnis) bräuchte externe API + kleinen
   Proxy (z. B. Cloudflare) + laufende Kosten — bewusst nicht gebaut. Andockstelle: `antwort.ts`.
6. Bundle > 500 kB (JS ~773 kB, gzip 244) — bekannt/unkritisch. Optional Code-Splitting.
7. `SESSION-HANDOFF.md` ist veraltet — kann gelöscht werden.

---

## 12. Kickoff für die nächste Sitzung (zum Kopieren)

```
Lies STAND.md, DESIGN.md und SPEC.md im Repo-Root. Branch: claude/gracious-gates-n4j6z2,
Remote aymanoul/Ayman, live unter https://aymanoul.github.io/Ayman/.

Es ist eine React+TS+Vite PWA (HashRouter, handgeschriebenes CSS, Mushaf-Design v10,
Schrift Inter italic + Poppins). Werk: „Der versiegelte Nektar", 9 Bücher (Buch 1–9),
Routen /modul/muhammad/buch/<slug>. Das Frage-Feld antwortet client-seitig aus den
Inhalten (lib/antwort.ts, KEIN LLM) mit Konversationsmodus. Offline-fähig: Service Worker
(vite-plugin-pwa) + IndexedDB für Favoriten/Notizen/Verlauf + offline speicherbare Bücher.
Side-Menü/Einstellungen/Favoriten/Notizen/Verlauf/Über sind gebaut.

Arbeitsweise: alles auf Branch claude/gracious-gates-n4j6z2 committen+pushen; nach jedem
Push baut .github/workflows/deploy-pages.yml automatisch (bei „Deployment failed, try again
later" einfach den deploy-Job erneut ausführen — GitHub-Transient). tsc 0 Fehler + Build
grün halten. Bei --font-display/--font-ui immer font-style:italic mitsetzen.

Offene Punkte stehen in STAND.md §11 (u. a. Dunkelmodus ausgestalten, i18n, Buch-Titelbilder).
```
