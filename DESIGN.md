# Die Bibliothek — Design (v3)

Direction: **andalusisch-maurisch** — traditionelle Koran-Illumination (Tezhip)
und die Ästhetik der Alhambra. Warmes Pergament-Elfenbein, Salbei/Oliv + mattes
Terrakotta + Gold. Symmetrisch, harmonisch, ruhig; Ornament ist feine Arabeske
und geometrisches Girih-Wasserzeichen — nie Hintergrundrauschen.

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

## Ornamentik
- **Girih-Wasserzeichen:** achtzackiges Sternengitter als `.atmosphere::before`,
  Gold bei ~4,5 % Deckkraft — die Alhambra-Wand als Flüstern.
- **Arabesken-Ecken:** Modul-Platten (`.plate__frame i`) und Hero-Titelbild
  (`.mhero::after`) tragen goldene Eckknoten + innere Gold-Hairline —
  „illuminierte Tafel".
- **`.tezhip`-Utility** (index.css): wiederverwendbarer Rahmen (Doppel-Hairline
  + 4 vorrotierte SVG-Eckornamente) für künftige Container.
- **Divider:** Crown/Sprig/ArabesqueDivider laufen über `currentColor` in Gold.
- Journey-Pfad der Startseite: goldene Linie (statt Smaragd).

## Signatur-Element — die Shamsa
Die „kleine Sonne" als Manuskript-Eröffnung, SVG-handgebaut, umgefärbt:
**Oliv-Geometrie, Goldkern, Elfenbein-Scheibe** (`--seal-*`-Tokens).

## Motion (Emil Kowalski — unverändert)
`--ease-out: cubic-bezier(.23,1,.32,1)`, Spring-Entrances, `scale(.97)` Press,
Hover nur bei `(hover:hover)`, transform/opacity only, `prefers-reduced-motion`
voll respektiert. Das Animations-Vokabular lebt in `src/lib/anim.ts`.

## Nicht verhandelbar
- Zwei-Ebenen-Mechanik (Debatte sichtbar, Gelehrten-Ebene hinter Toggle).
- Beleg-Volltexte nur im Modal.
- Daniel-Statue behält metallische Materialfarben (Gold/Silber/Bronze/Eisen —
  inhaltstragend, nicht Teil der Deko-Palette).
