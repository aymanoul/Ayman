# Buchrücken-Textur für das Regal (`/regal`)

**Erwartete Datei:** `spine.png` (dieser Ordner) — Hochformat, **Seitenverhältnis 2:9**
(z. B. **400 × 1800 px**). Sobald die Datei hier liegt, rendert das Regal sie
automatisch 1:1; ohne sie erscheint ein schlichter CSS-Fallback.

## Was das Bild zeigen muss (Fath-al-Bari-Stil, OHNE Text!)

Ein einzelner Buchrücken, frontal, flach:
- Dunkelgrünes Leder mit leichter zylindrischer Schattierung an den Kanten
- Goldene Doppelrahmen + dichte goldene Arabesken-Bordüren
- **Alle Textzonen LEER** (die Website legt die Texte selbst darüber):

| Zone (von oben, % der Höhe) | Inhalt im Bild |
|---|---|
| 0–6 % | Arabesken-Ornamentband |
| **7–23 %** | **LEER** (Titelzone, grünes Leder) |
| 24–33 % | Ornament/Zierfeld |
| **34–65 %** | **weinrotes Lappen-Medaillon mit Goldrand, innen LEER** |
| **67–73 %** | kleine goldgerahmte Raute, innen LEER |
| **74–83 %** | **LEER** (Autor-Zone) |
| **84–90 %** | weinrote Kartusche mit Goldrand, innen LEER |
| 91–100 % | Arabesken-Ornamentband |

## Fertiger Generierungs-Prompt (z. B. Gemini / Nano Banana, Ratio 1:4 oder 2:3 + zuschneiden)

> A single book spine viewed perfectly straight-on and flat, in the style of
> classical Arabic hadith encyclopedia editions (Dar Ibn al-Jawzi bindings):
> deep forest-green leather with subtle cylindrical shading at the edges,
> ornate embossed gold arabesque border frames running along all four edges,
> dense interlaced gold foliate ornament bands at the very top and bottom.
> In the vertical center a large maroon lobed medallion (mandorla) with a
> double gold outline, ITS INTERIOR COMPLETELY EMPTY. Below it a small
> gold-outlined maroon diamond, EMPTY. Near the bottom a small maroon
> cartouche with gold outline, EMPTY. The upper quarter of the spine is plain
> green leather with NO ornament (reserved text area). ABSOLUTELY NO TEXT, NO
> LETTERS, NO CALLIGRAPHY anywhere. Product photography, even studio lighting,
> gold foil stamping texture. Portrait format, very tall and narrow.

Danach ggf. auf exakt 2:9 zuschneiden:
`magick spine_raw.png -resize 400x1800^ -gravity center -extent 400x1800 spine.png`

Alternativ: Foto/Scan eines echten Rückens (ohne Text bzw. Text wegretuschieren).
