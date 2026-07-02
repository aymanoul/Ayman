# Die Bibliothek — Design (v4)

Direction: **redaktionelles Nachschlagewerk** auf warmem Pergament — die
andalusische Palette (v3) bleibt, aber **ohne jede Symbolik/Ornamentik**:
keine Shamsa, keine Arabesken-Ecken, kein Girih-Wasserzeichen, keine
Trenn-Ornamente, kein Gradient-Text. Struktur trägt das Design: linksbündige
Laufköpfe mit Oberlinien, nummerierte Raster, klare Chips.

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
