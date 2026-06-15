# Die Bibliothek — Design

Direction: **prophetisch / sakral**, grounded in the craft of the *illuminated
Quran manuscript* — lapis lazuli + gold leaf on a midnight ground, warm ivory
as the written word. A modern, fluid web experience, never a parchment pastiche.

## Palette (the pigments of the craft)
- `--ground` `#0a0e1c` — deep midnight indigo; lets gold glow.
- `--gold` `#c9a227` / `--gold-lit` `#f3dc92` — antique gold leaf + its highlight.
- `--lapis` `#2a4f9e` — lapis lazuli, the second pigment.
- `--ivory` `#ece3cd` — the written word.
- `--rubric` `#b14a42` — manuscript red, reserved for "Einwand".
- `--konter` `#6aa886` — sage/verdigris, reserved for "Konter".

Why not the AI defaults: not cream-parchment-serif-terracotta (explicitly
rejected), not black-+-single-neon (this is a two-pigment system from a real
craft), not broadsheet columns. The risk we spend our boldness on is the
**Shamsa**.

## Type
- **Display** — `Bodoni Moda` (high-contrast Didone; reads expensive, sings on gold).
- **Body / scholarly** — `Newsreader` (literary, optical sizes, italic for accents).
- **UI / data** — `Jost` (refined geometric counterpoint, labels & search).
- **Arabic** — `Amiri` (verses) + `Reem Kufi` (emblematic / the operator name).
- **Hebrew** — `Frank Ruhl Libre`. RTL handled per script.

## Motion (emil-design craft)
Strong custom curves (`--ease-out: cubic-bezier(.23,1,.32,1)`), spring entrances,
scale-on-press (`:active` / `whileTap`), 90ms stagger, transform/opacity only.
Hero: shaft of light + vignette, parallax ghost Shamsa on scroll, gold-leaf
shimmer on the name. Plates lift on a spring, the seal ignites and turns, corner
ornaments kindle. All gated behind `prefers-reduced-motion`.

## Signature element — the Shamsa
The "little sun" rosette that opens a manuscript. Hand-built in SVG (girih star
+ khatam + rosette on lapis), it is the platform's emblem **and** the mark of
every seal. It illuminates on load and turns slowly. The homepage reads like an
illuminated frontispiece; the modules then rise along a single gold thread
("Das Netz spannt sich"). The seal-breaking / stone moment lives in Daniel.

## Motion
Orchestrated page-load (frontispiece → search → threaded modules), scroll
reveals, hover micro-interactions on plates/seals. `prefers-reduced-motion`
fully respected (entrances become instant).

## Built
- `src/components/Shamsa.tsx` — signature medallion (entrance + idle turn + halo).
- `src/components/GirihField.tsx` — ambient eightfold tessellation.
- `src/pages/Bibliothek.tsx` — homepage: frontispiece + search + question agent
  + module plates + footer.
- `src/data/` — `Siegel`/module data contract + keyword search index.
- Module page (9 seals as medallion rows) + seal holding pages so nothing
  dead-ends.

## Next
Daniel (Siegel V) as the showcase seal — real interactive Nebuchadnezzar
statue, timeline, two-level layout — and the immersive `Beleg` modal system
(golden card → backdrop dim → illuminated full verse with original script).
Then the remaining seals in the same system.
