# Die Bibliothek — Design (v7)

Direction: **Mushaf-Layout** — die Seite liest sich wie eine Quran-Seite
(Vorlage: klassischer Madina-Mushaf mit grünem Prachtrahmen).

**Prachtrahmen (v7 — echtes Bild, kein Vektor):** ein voll umlaufender,
fester Fensterrahmen um das Sichtfeld (`body::before`, `position: fixed`,
`border-image` auf `src/assets/ornaments/mushaf-frame-photo.webp`): eine
KI-generierte, fotorealistische Mushaf-Bordüre (sattgrün, goldene Wellenranke,
Rosetten-Medaillons in den Ecken und an den Seitenmitten, Perlenreihen). Der
Inhalt scrollt hinter dem Rahmen wie hinter dem Ausschnitt einer illuminierten
Seite. `border-image-repeat: round` — der Browser passt die Kachelzahl pro
Kante automatisch an, keine sichtbaren Nähte.

**Suren-Kartuschen (v7 — echtes Bild):** Titel (`.seal__title`, `.sec__head`)
sitzen in `src/assets/ornaments/kartusche-photo.webp`: grüne Endblöcke mit
Spitzbogen-Abschluss und Blüten-Medaillon, Wellenranken-Bänder oben/unten,
Creme-Feld für den Text. `border-image-repeat: round stretch` (horizontal
kacheln, vertikal dehnen — wichtig für mehrzeilige Titel).

**Warum Bild statt Vektor:** Eine handgezeichnete SVG-Version (v6) wurde
verworfen — sie wirkte zu steril/"KI-generiert" im negativen Sinn. Echte
(prompt-generierte, aber als Bild gerenderte) Ornamentik trifft die Vorlage
weit besser, genau wie beim Buchregal (`spine.png`).

**Herkunft & Reproduzierbarkeit:** Rohbilder liegen in
`src/assets/ornaments/source/` (`frame-raw.png`, `kartusche-raw.png` —
generiert per ChatGPT-Bildprompt, siehe Chatverlauf für den exakten Wortlaut).
`scripts/ornament-crop.mjs` (braucht `sharp`, ist devDependency) schneidet den
leeren Rand automatisch weg, skaliert auf Web-Größe und exportiert als WebP;
die `border-image-slice`-Werte in `src/index.css` / `src/styles/seal.css`
sind auf genau diese Ausgabedateien vermessen. Bei neuem Rohmaterial: Datei in
`source/` ersetzen, Skript anpassen (Zielgröße/Referenzfarbe) und neu laufen
lassen, Slice-Werte aus der Konsolenausgabe übertragen.

Die klare v4-Struktur darunter bleibt (These-Block, Beweiskette-Raster,
Konter-Reihen, Gelehrten-Raster).

## Schrift (v8): Inter (Titel/UI, kursiv) + Poppins (Fließtext, aufrecht)
Happy Time ist komplett raus (Datei gelöscht) — wirkte zu dekorativ/„KI".
Zwei Rollen, konsequent auf allen Seiten (nicht nur im Chat-Feld):

- **`--font-display` / `--font-ui`** (Titel, Kicker, Labels, Buttons, Karten-
  Titel — überall, wo vorher Happy Time stand): **Inter**, selbst gehostet,
  nur als **Italic** geliefert (`Inter 18pt`, opsz-Achse). Jede Regel, die
  diese Tokens nutzt, bekommt darum explizit `font-style: italic` dazu
  (`scripts/font-italic-insert.py` hat das einmalig mechanisch über alle
  CSS-Dateien ergänzt) — sonst würde der Browser bei angefordertem
  `font-style: normal` auf den Fallback ausweichen statt Inter zu nutzen.
  Gewichts-Mapping: die Datei registriert nur 400 + 800 (kein echtes 700) —
  angeforderte Werte ≥500 matchen laut CSS-Fonts-Spec auf das reale 800
  (kein Faux-Bold mehr, echtes ExtraBold).
- **`--font-body`** (Fließtext — Die-These-Blöcke, Beweisketten, Beleg-Texte):
  bewusst **aufrecht**, nicht kursiv — lange Leseabschnitte in Kursivschrift
  ermüden. **Poppins** (bereits selbst gehostet, kein neues Asset).

Arabisch (Cairo/El Messiri/Amiri) und Hebräisch bleiben für ihre
Schriftsysteme unverändert. Kamali bleibt ungenutztes Altlast-Asset (s. §8).

Bei künftigen neuen Regeln: `--font-display`/`--font-ui` IMMER mit
`font-style: italic` kombinieren, `--font-body` NIE.

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
