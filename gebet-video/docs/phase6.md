# Phase 6 – Einblendungen (Vorbereitung, wartet auf Auswahl)

Vorschau-Shot: `web/shots/cards.js` (Standbilder bei t = 0,5 … 9,5; Animationsprobe t = 10–14,5).
Bibliothek: `web/lib/overlay.js` (`drawSubtitles`, `drawTitle`, `drawCard`, `subtitleY`, `CARD_STYLES`, `SUB_STYLES`).
Dateien: `out/phase6/`.

## Untertitel

- Wort für Wort, 1–3 Wörter, gesprochenes Wort farbig, dunkle Kontur, kleines „Aufpoppen“ pro Gruppe.
- Immer in der Mitte des sicheren Bereichs (x-Mitte 460 px, rechts 160 px frei), Standardhöhe y = 1330.
- Steht eine Beweis-Karte, rückt die Zeile über die Karte (`subtitleY`), nichts überlappt.
- ﷻ und ﷺ werden mit Amiri gesetzt und nie vom vorigen Wort getrennt (`wordGroups` in `cards.js`).
- **Stil a:** Baloo 2 ExtraBold 96 px, weiß, Betonung gelb `#FFE033`, Kontur fast schwarz (wie im Beispielvideo).
- **Stil b:** Montserrat ExtraBold 80 px, weiß, Betonung Gold `#D9B26A`, Kontur Navy `#212242` (Markenlook).

## Beweis-Karten

- Navy-Feld `#212242` (88 % deckend), Ecken 28 px, Rand 4 px, Etikett oben links, unteres Drittel,
  Unterkante 24 px über den unteren 420 px. Breite 840 px (x 40–880).
- **QURAN:** Gold-Rand, Etikett Gold-Verlauf `#CA9E4E → #D9B26A`, arabischer Vers im Gold-Verlauf in der
  **offiziellen Schrift KFGQPC Uthmanic Script HAFS** (`assets/fonts/kfgqpc-uthmanic-script-hafs.otf`), Bubenheim-Übersetzung,
  „Sura …, Vers …“. Mehrere Verse stehen je in einer eigenen Zeile (kein Verszeichen).
- **HADITH:** Türkis-Rand `#2b9c9a`, deutsche Übersetzung, „Überliefert von … · Sammlung Nummer“; arabische Kernzeile
  (Amiri, creme) optional – beide Varianten gezeigt.
- Ein: von unten mit leichtem Überschwingen (0,38 s) + Whoosh/Pop; aus: weich nach unten (0,3 s).
- Lange Hadithe (H4) werden in zwei Karten nacheinander gezeigt.
- Keine Zier-Ornamente.

## Gelernt

- Der Quran-Text von quranenc.com ist **KFGQPC-kodiert** (z. B. U+065E, U+0657 als Tanwīn-Varianten). Mit Amiri Quran
  fehlte U+065E (leeres Kästchen) bzw. würde falsch gezeichnet → nur mit der KFGQPC-Schrift setzen.
  Schrift aus dem npm-Paket `kfgqpc-uthmanic-script-hafs-regular` (Inhalt geprüft: Name „KFGQPC Uthmanic Script HAFS“,
  © King Fahd Glorious Quran Printing Complex, alle Zeichen der Verse vorhanden).
- `ʾ` und `ʿ` fehlen in Montserrat → in Quellenangaben automatisch als ’ und ‘ gesetzt.
- Arabische Hadith-Zeilen ohne «» (Satzzeichen von hadeethenc, nicht Teil des Wortlauts; im RTL-Umbruch sonst verdreht).

## Offen (Aymans Auswahl)

1. Untertitel-Stil a oder b.
2. Hadith-Karte mit oder ohne arabische Kernzeile.

## Hinweis für Phase 7

In Einstellungen mit Beweis-Karte muss das Wichtige (Gesicht, Symbol) in der oberen Bildhälfte stehen, denn die Karte
deckt etwa y 1000–1476 ab. Die Kameras dieser Shots (S18, S20, S24–S27, S31–S34, S39–S43) werden dafür angepasst.
