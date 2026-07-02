# Die Bibliothek — Design (v5)

Direction: **Mushaf-Layout** — die Seite liest sich wie eine Quran-Seite:
ornamentale Randbordüren links + rechts über die volle Länge (grünes Band,
Creme-Rauten, Rosetten, goldene Außenlinien; `body::before/::after`,
repeat-y-SVG), Titel in **Suren-Kartuschen** (`border-image`-Ornamentrahmen
auf `.seal__title` + `.sec__head`, helle Kartuschenfläche). Die klare
v4-Struktur darunter bleibt (These-Block, Beweiskette-Raster, Konter-Reihen,
Gelehrten-Raster).

## Schrift (v5): EINE Schriftart
**Happy Time für alles** — Fließtext normal (400), Titel dieselbe Schrift in
**fett** (700, synthetisiert). Kamali wird nicht mehr verwendet. Arabisch
(Cairo/El Messiri/Amiri) und Hebräisch bleiben für ihre Schriftsysteme.

## Verse (v5): Grün
Alle zitierten Verse erscheinen in Medina-Grün: BelegCard-Kurztexte
(`.beleg-card__kurz`) + Zitat-Elemente der Exhibits (`.abfolge__quote`,
`.einge__zitat`, `.haybanner__zitat`, `.feind__zitat`, `.aug-panel__zitat`,
`.zeugen__zitat`, `.vt-prov__vers`). Dunkle Modal-Tafeln behalten ihr
Gold-auf-Dunkel (Lesbarkeit).

## Struktur (v4 — die Debatten-Ebene)
- **Siegel-Kopf:** linksbündig — Laufmarke („Siegel II"), Kamali-Titel,
  arabischer Untertitel gedämpft.
- **„Die These":** eigener beschrifteter Block mit Medina-grüner Linksleiste
  auf Kartenfläche (kein zentrierter Textblock mehr).
- **Beweiskette:** 2-Spalten-Raster; jeder Schritt mit Oberlinie (2px Ink),
  Nummer (I–IV, Medina-grün), Titel, Text. Mobil einspaltig.
- **Sektionen:** Oberlinie + Kicker (Medina) + linksbündiger Titel —
  Referenzwerk-Rhythmus statt zentrierter Eyebrow-Kaskade.
- **Einwand/Konter:** Akkordeon-Reihen in voller Breite; Chips rot/grün.
- **Gelehrten-Ebene:** solider grüner Toggle-Button, Inhalte als
  2-Spalten-Referenzraster mit Hairline-Oberkanten (keine Kartenboxen).
- Chevrons sind SVG (icons.tsx), keine Text-Glyphen; ✦/◆ entfernt.

## Palette (die Pigmente)
- `--paper` `#f4ecdb` / `--paper-card` `#fbf6e9` / `--paper-sink` `#eadfc6` —
  warmes Pergament-Elfenbein statt Weiß.
- `--ink` `#2e2718` — warmes Sepia-Schwarz (Text).
- `--green` `#5f6f46` / `--green-deep` `#414f2f` / `--green-bright` `#7d905a` —
  Salbei/Oliv, der Primärakzent.
- `--brass` `#b3873a` / `--brass-soft` `#d3b06a` — Gold: Hairlines, Ornamente,
  Initialen. Alle `--line*`-Hairlines sind goldbasiert (Tezhip-Rahmenlinien).
- `--terra` `#a85a40` / `--rubric` `#a04e36` — mattes Terrakotta/Ziegelrot,
  reserviert für Rubrizierung („Einwand").
- Dunkle Tafeln (Beleg-Modal) sind **warm-dunkel** (Oliv/Umbra), nie kühl.

## Typografie (zweisprachig, geometrisch × traditionell)
- **Display (DE/EN)** — `Montserrat` 600–800: markante, geometrische Headlines.
- **Body / UI (DE/EN)** — `Poppins` 400–600.
- **Arabisch (UI/Titel)** — `Cairo`; **monumental** (Betreibername, Modul-Titel)
  — `El Messiri`.
- **Koran-Verse** — bewusst weiterhin `Amiri Quran`/`Amiri` (`.quran-script`,
  Beleg-Modal): geometrisches Kufi trägt volle Taškīl-Diakritika nicht lesbar.
- **Hebräisch** — `Frank Ruhl Libre`. RTL pro Schrift.
- **Selbst gehostet:** alle Fonts liegen als woff2 in `src/assets/fonts/`
  (`src/styles/fonts.css`), kein Google-CDN zur Laufzeit.

## Motion (Emil Kowalski — unverändert)
`--ease-out: cubic-bezier(.23,1,.32,1)`, Spring-Entrances, `scale(.97)` Press,
Hover nur bei `(hover:hover)`, transform/opacity only, `prefers-reduced-motion`
voll respektiert. Das Animations-Vokabular lebt in `src/lib/anim.ts`.

## Nicht verhandelbar
- Zwei-Ebenen-Mechanik (Debatte sichtbar, Gelehrten-Ebene hinter Toggle).
- Beleg-Volltexte nur im Modal.
- Daniel-Statue behält metallische Materialfarben (Gold/Silber/Bronze/Eisen —
  inhaltstragend, nicht Teil der Deko-Palette).
