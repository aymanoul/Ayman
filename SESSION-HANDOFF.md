# 📖 Die Bibliothek — Session-Handoff

> **Zweck dieses Dokuments:** Alles, was eine neue Claude-Session braucht, um nahtlos
> da weiterzumachen, wo wir aufgehört haben. Lies das zuerst, dann `SPEC.md`.
>
> **Stand:** Inhalt 100 % fertig. Als Nächstes: **Design-Pass mit 21st.dev** (Animationen, Motion-Polish).

---

## 0. Kickoff-Prompt für die neue Session (einfach kopieren)

```
Lies SESSION-HANDOFF.md und SPEC.md im Repo. Das ist "Die Bibliothek" —
eine React+TS+Vite Apologetik-Enzyklopädie. Der Inhalt aller 9 Siegel +
Fundament + Verteidigung ist fertig und SPEC-treu. Die Suche ist fertig.

Jetzt kommt der Design-Pass mit 21st.dev: Animationen, Motion-Polish,
visuelle Verfeinerung — OHNE den Inhalt oder die Zwei-Ebenen-Struktur
zu beschädigen. Branch: claude/vibrant-allen-syff24.

Fang an mit [HIER DEINEN ERSTEN WUNSCH EINSETZEN, z. B.:
"Eingangs-Animationen für die Bibliothek-Startseite und die Siegel-Titel"].
```

---

## 1. Was ist das Projekt

**„Die Bibliothek"** — eine immersive, mehrsprachige (DE, mit AR/HE/GRC-Originaltexten)
Apologetik-Enzyklopädie. Erstes Modul: **„Muhammad in der Bibel"** ﷺ.

Das Modul besteht aus **9 Siegeln + einem Fundament + einer Verteidigung**. Jedes Siegel
ist eine eigene Argumentationskette mit Versen, Quellen und Gelehrtenzeugnissen.

**Didaktisches Kernprinzip — die zwei Ebenen:**
- **Debatten-Ebene** (immer sichtbar): zugänglich, mobil-first, für das schnelle Gespräch.
- **Gelehrten-Ebene** (hinter einem Toggle): die akademische Tiefe für den, der gräbt.

**Stack:** React 18 · TypeScript 5.6 · Vite 5 · React Router 6 (HashRouter) · framer-motion 11.
Tailwind v4 ist installiert, wird aber kaum genutzt — das Design lebt in **handgeschriebenem CSS**.

---

## 2. Befehle & Workflow

```bash
npm install        # Abhängigkeiten
npm run dev        # Dev-Server (Vite)
npm run build      # Production-Build (muss IMMER sauber durchlaufen)
npx tsc --noEmit   # reiner Typecheck (muss 0 Fehler zeigen)
npm run preview    # Build lokal ansehen
```

**Aktueller Build-Stand:** ✅ tsc sauber · JS 743 kB (gzip 234 kB) · CSS 94 kB (gzip 17 kB).
> Die Bundle-Warnung (>500 kB) ist bekannt und unkritisch. Optionales Code-Splitting siehe §10.

### Git
- **Branch (immer hier entwickeln & pushen):** `claude/vibrant-allen-syff24`
- **Remote:** `aymanoul/Ayman`
- Push: `git push -u origin claude/vibrant-allen-syff24` (bei Netzfehler bis zu 4× mit Backoff 2/4/8/16s)
- **Keinen PR** erstellen, außer der User bittet ausdrücklich darum.
- Commits: kurz, beschreibend, im bisherigen Stil (siehe `git log`).

---

## 3. Architektur & Datenfluss

```
main.tsx
 └─ App.tsx ──────────── HashRouter + <BelegProvider>
     Routes:
       /                                  → Bibliothek.tsx     (Startseite, Modul-Kacheln)
       /modul/:moduleId                   → ModulePage.tsx     (Siegel-Liste eines Moduls)
       /modul/:moduleId/siegel/:sealId    → SealPage.tsx       (Dispatcher → konkrete Seite)
```

**`SealPage.tsx`** ist ein Dispatcher: matcht `moduleId === 'muhammad'` + `sealId` und rendert
die passende Seiten-Komponente (`MoseSeal`, `DanielSeal`, …). Nicht gebaute Siegel bekämen eine
Holding-Page — aber **alle sind gebaut**. Hier lebt auch der **Hash-Scroll** (Deep-Link zu
Exhibit-Abschnitten via `#anchor`, 240 ms Delay nach Render).

**Pro Siegel gibt es drei Dateien:**
1. `src/data/seals/<seal>.ts` — **alle Inhalte** (These, Beweiskette, Belege, Konter, Gelehrte).
2. `src/components/exhibits/<Seal>Exhibits.tsx` — die interaktiven/visuellen Bausteine (Tabellen, Karten, Diagramme).
3. `src/pages/seals/<Seal>Seal.tsx` — die Seite, die alles zusammensetzt; importiert ganz oben ihr eigenes CSS.

---

## 4. Die Zwei-Ebenen-Mechanik (WICHTIG — nicht kaputt machen)

Jede Siegel-Seite (`src/pages/seals/*Seal.tsx`) folgt **derselben Sektionsfolge**. Beispiel `MoseSeal.tsx`:

```
1. Hero / Kicker / Titel / arabischer Titel / These        (immer sichtbar)
2. <Eyebrow kicker="Debatten-Ebene"  …>  → 4-Schritt-Beweiskette
3. <Eyebrow kicker="Haupt-Exhibit"   …>  → die zentrale Tabelle/Karte/Grafik   id="vergleich" etc.
4. <Eyebrow kicker="Die Belege"      …>  → Galerie aus <BelegCard>             id="belege"
5. … weitere Exhibit-Sektionen mit eigenen Ankern …
6. <Eyebrow kicker="Einwand · Konter" …> → Akkordeon mit Gegenargumenten
   ── ab hier die zweite Ebene ──
7. <Eyebrow kicker="Gelehrten-Ebene" …>  → Toggle-Button (useState `deep`),
      öffnet eine framer-motion height/opacity-Animation mit den Scholar-Karten.
8. <Eyebrow kicker="Das Netz …" …>       → Vernetzung / Abschluss
```

**Der Toggle-Pattern** (in jeder Seite identisch):
```tsx
const [deep, setDeep] = useState(false)
…
<button className="scholar__toggle" onClick={() => setDeep(v => !v)} aria-expanded={deep}>
  {deep ? 'Gelehrten-Ebene schließen' : 'Gelehrten-Ebene öffnen'}
  <span className={`scholar__chev${deep ? ' is-open' : ''}`} aria-hidden>▾</span>
</button>
<motion.div animate={{ height: deep ? 'auto' : 0, opacity: deep ? 1 : 0 }}>
  <div className="scholar"> …Scholar-Karten… </div>
</motion.div>
```

> **Beim Design-Pass:** Diese Struktur und die `deep`-Mechanik müssen erhalten bleiben.
> Animationen dürfen sie verschönern, aber nicht entfernen.

---

## 5. Die Siegel im Detail

| # | sealId (Route) | Titel | Belege | Seiten-/Exhibit-Datei |
|---|---|---|---|---|
| Fundament | `fundament` | Das Fundament | 14 | FundamentSeal · FundamentExhibits |
| I | `abrahams-nachkommen` | Abrahams Nachkommen | 20 | AbrahamSeal · AbrahamExhibits |
| II | `prophet-wie-mose` | Prophet wie Mose | 38 | MoseSeal · MoseExhibits |
| III | `arabische-prophezeiungen` | Arabische Prophezeiungen | 15 | ArabienSeal · ArabienExhibits |
| IV | `hohelied` | Das Hohelied · Maḥamaddīm | 24 | HoheliedSeal · HoheliedExhibits |
| V | `daniel` | Daniel | 25 | DanielSeal · MoreExhibits + DanielStatue |
| VI | `paraklet` | Der Paraklet | 20 | ParakletSeal · ParakletExhibits |
| VII | `juedische-erwartung` | Jüdische Erwartung · Gleiche Maßstäbe | 29 | ErwartungSeal · ErwartungExhibits |
| Verteidigung | `verteidigung` | Falscher Prophet? | 28 | VerteidigungSeal · VerteidigungExhibits |

**Reihenfolge & Status** stehen in `src/data/modules.ts` (alle `status: 'ready'`). „Fundament" und
„Verteidigung" tragen statt einer Zahl ihren Namen als `nummer`.

### Inhaltliche Stichworte je Siegel (zum schnellen Wiederfinden)
- **Fundament:** Koran 7:157 / 61:6 (maktūban), Doppelnatur/taḥrīf, 15:9, Ibn ʿAmr ↔ Jesaja 42 (Buchārī 2125), Spielregeln.
- **I Abraham:** Dtn 4,6–8, Vav-Tabelle, Zwölf Fürsten, „großes Volk"/goy gadol-Waage, Maimonides-Falle (Ex 32,10), Jubiläen, Josephus, Chumash-Eingeständnis, Ismael-Rehabilitierung.
- **II Mose:** 15-Kriterien-Tabelle (`id="vergleich"`), LXX/DSS-Textkritik („aus deiner Mitte"), 36×-Regel, Sieb-Methode, Augustinus/Luther/Teeple/Gersonides.
- **III Arabien:** 5-Namen-Karte (Paran·Kedar·Sela·Tema·Baca), Jes 21 Hidschra, mishpat = dīn, etmokh, Drei Aufstrahlungen (Dtn 33,2).
- **IV Hohelied:** Hld 5,16 maḥamaddīm, Sanhedrin 43a, Einsetzprobe, Physiognomie, Maleachi 3,1, Parkhurst/Higgins/Dawud.
- **V Daniel:** 5-Reiche-Tabelle, 4 Tiere, Stein-Bedingungen, Konstantin = kleines Horn, 350-Jahre, ḥamudot-Brücke, Eckstein/Ziegel, **interaktive Statue** (`DanielStatue.tsx`, `id="statue"`).
- **VI Paraklet:** Joh 14–16, Raymond-Brown-Liste, Paraklet/Periklytos (παράκλητος vs περικλυτός), Textkritik „heilig" (Metzger), Papyrus 66, Kriterien-Matrix.
- **VII Erwartung:** al-mīzān-Waage, Dtn 13 + 18 Prüfsteine, Ibn al-Haybān, Berg Sela, Safiyya, Banū Qurayẓa-Timeline, davidisches Narrativ seziert.
- **Verteidigung:** Früchte-Synopse Muhammad ↔ Evangelien, Paulus-Dossier (3 faule Früchte), zûd/zuwd-Analyse, Abrogationsliste (naskh), Sprüche 20,10, Mt 7 / Mt 5,17 / Jer 31.

---

## 6. Das Beleg-System (Verse & Quellen)

**Datei:** `src/components/Beleg.tsx`. Eine globale Mechanik, ein Modal, überall wiederverwendet.

- **`Beleg`-Typ** (`src/data/types.ts`): `typ` (`quran`|`bibel`|`quelle`), `kurz`, `original`,
  `sprache`, `translit`, `uebersetzung`, `fundstelle`, `status`, `kern`.
- **`<BelegCard beleg={…}>`** — die schimmernde Vorschaukarte (in den „Belege"-Galerien).
- **`<BelegProvider>`** (in `App.tsx`) — hält genau ein Modal. Öffnet per Klick.
- **Deep-Link:** `?beleg=<sealId:key>` in der URL öffnet das Modal direkt (von der Suche genutzt),
  dann wird der Param via `navigate(..., {replace:true})` entfernt.
- **Volltexte** (Originalschrift, Übersetzung) erscheinen **nur im Modal**, nie im Fließtext.
- Quran-Belege: grün+gold; Bibel: das Schlüsselwort (`kern`) lodert; Quelle: Manuskript-Zitat.

---

## 7. Das Suchsystem (fertig — natürliche Sprache)

Vier Dateien arbeiten zusammen:

1. **`src/lib/search.ts`** — die Engine. Normalisierung (ß/Umlaute/Diakritika), Stopwörter,
   Synonym-/Namens-Kanonisierung (mohammed→muhammad, tabelle→vergleich …), **Vers-Parsing**
   (`18,18` → `18:18`), Tokenisierung, **Levenshtein-Fuzzy** + Prefix, Coverage-/Phrasen-/Vers-Boosts.
   Generiert via `belegEntries()` automatisch für **jeden Beleg** ein Suchziel (öffnet das Modal).
2. **`src/data/searchIndex.ts`** — 40 handgepflegte Exhibit-Einträge mit `tags`, `anchor`, `belegRef`, `typ`.
3. **`src/data/sealText.ts`** — extrahiert rekursiv allen Text jedes Siegels (Catch-all-Volltextschicht).
4. **`src/data/belegRegistry.ts`** — globales Register aller Belege, Schlüssel `sealId:key`.

**Was die Suche kann:** Themen, Vers-Nummern (`18,18`), Gelehrtennamen (`Teeple`, `Blenkinsopp`),
Buchnamen/Abkürzungen (`Hab`, `Dtn`), Tippfehler, ganze Fragen. Einzelne Belege werden direkt als
Treffer angezeigt (Badge Koran/Bibel/Quelle) und öffnen beim Klick das Modal.

**UI:** `src/components/SearchPanel.tsx` — Live-Suchfeld + Frage-Box (gleiche Engine).
Navigiert mit `?beleg=…` (Modal) oder `#anchor` (Exhibit-Sektion).

---

## 8. CSS-Architektur

- **`src/index.css`** — Reset/Basis.
- **`src/styles/app.css`** — globale Tokens (Farb-Variablen `--green`, `--gilt` …), Layout-Shells,
  Bibliothek/Module/Search/Beleg-Modal, `.scholar*`-Klassen (Gelehrten-Ebene), `.sec`, `.kicker`.
- **`src/styles/seal.css`** — gemeinsame Siegel-Grundstruktur (Hero, `.beleg-card*`, Eyebrow …).
- **`src/styles/seals/<seal>.css`** — **pro Siegel eine eigene Datei** für dessen Exhibit-Styles.
  Wird **ganz oben in der jeweiligen `*Seal.tsx`** importiert (`import '../../styles/seals/mose.css'`).
  (Fundament/Abraham nutzen vorrangig die geteilten Styles; die übrigen 7 haben eigene Dateien.)

**Fonts/Schriften:** arabisch via `.quran-script` / `.arabic`, hebräisch `.hebrew`, mit `dir="rtl"`.

---

## 9. Animations-Vokabular (`src/lib/anim.ts`)

```ts
EASE = [0.23, 1, 0.32, 1]   // starkes ease-out, überall verwendet
rise        // opacity+y, 0.7s
riseSpring  // mit leichtem Spring
stagger     // staggerChildren 0.09, delayChildren 0.12
```
Alle Seiten benutzen `initial="hidden" animate="shown" variants={stagger}` + `motion.*` mit `rise`.
`useReducedMotion()` wird respektiert (Barrierefreiheit). **Das ist die Basis, auf der der
21st.dev-Pass aufsetzt** — neue Animationen sollen in dieses Vokabular passen (oder es bewusst erweitern).

---

## 10. Status & nächste Schritte

### ✅ Fertig
- Alle 9 Siegel + Fundament + Verteidigung — **voll SPEC-treu**, nichts ausgelassen.
- Zwei-Ebenen-Mechanik überall implementiert.
- Beleg-Modal + Deep-Links.
- Smart-Search (Themen/Verse/Gelehrte/Bücher/Belege).
- Mobile-Polish-Pass.
- `tsc` sauber, Build grün.
- `SPEC.md` (1309 Zeilen) liegt als Quelle der Wahrheit im Repo.

### 🎯 Als Nächstes — Design-Pass mit 21st.dev
Ziel: Animationen & Motion-Polish, visuelle Verfeinerung. Kandidaten:
- Eingangs-Animationen Bibliothek-Startseite (Shamsa, Modul-Kacheln, Girih-Feld).
- Siegel-Übergänge (Seitenwechsel), Hero-Reveal pro Siegel.
- Beleg-Card-Hover/Shimmer und Modal-Auftritt verfeinern.
- Gelehrten-Ebene: schönere Aufklapp-Animation.
- Mikro-Interaktionen in den Exhibits (Tabellen-Reveal, Karten-Pins, Statue).
- Scroll-getriggerte Reveals (z. B. via framer-motion `whileInView`).

> **Leitplanken für den Design-Pass:** Inhalt nicht anfassen, Zwei-Ebenen-Struktur erhalten,
> `useReducedMotion` respektieren, Build grün halten, mobil zuerst prüfen.

### 🔧 Optional (technische Schuld)
- **Code-Splitting:** Bundle ~743 kB. Pro Siegel `React.lazy()` + `Suspense` → schnellerer Erststart.
- Bilder (`statue.png` 418 kB, `karte.png` 553 kB) ggf. optimieren/WebP.

---

## 11. Gelöste Fallstricke (nicht wieder einbauen)

- **JSX + deutsche Anführungszeichen:** Bei `title="… „x" …"` bricht JSX. Lösung:
  `title={'… „x" …'}` (einfache äußere Quotes).
- **Vers-Query-Ranking:** Bei `61,6` muss der Vers selbst vor einer ihn *zitierenden* Quelle stehen →
  in `search.ts`: `score += entry.typ === 'quelle' ? 3 : 4.5`.
- **Phrasen-Boost nur für Wort-Queries:** `if (/[a-z]/.test(qNorm)) …` — sonst verzerren Zahlen.
- **„paraklet" als bare Query** rankte fälschlich Mose #1 → Cross-Ref-Tag aus Mose entfernt.
- **Exhibit-Daten-Shapes:** Beim Umbau von Exports prüfen, dass `*Exhibits.tsx` die **neuen**
  Feldnamen nutzt (früher crashte Paraklet auf alten Exports).
- **3-Spalten-Tabellen** (Mose Varianten): `grid-template-columns: 1.1fr 1.7fr auto`.
- **Mobile-Glitch** beim Bus-Fahrer-`≠`: kein `rotate`, stattdessen `display:block; text-align:center`.

---

## 12. SPEC.md

`SPEC.md` (im Repo-Root, 1309 Zeilen, ~140 kB) ist die **vollständige inhaltliche Quelle der Wahrheit**
für alle Siegel. Wenn je Zweifel besteht, ob ein Argument/Beleg vollständig umgesetzt ist:
**dort nachschlagen**, nicht aus dem Gedächtnis rekonstruieren (genau dieser Fehler kostete früher Zeit).

---

*Erstellt am 2026-06-18 als Übergabe für die Folge-Session. Branch `claude/vibrant-allen-syff24`.*
