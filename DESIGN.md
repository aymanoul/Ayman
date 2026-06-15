# Die Bibliothek — Design

Direction: **prophetisch / sakral**, experienced as a **journey through
scripture**. Bright vellum, deep emerald + antique brass, intentional arabesque
ornament. Modern and quiet — not a parchment pastiche, not a dark theme.

## Palette (the pigments of the craft)
- `--paper` `#f3f4ec` / `--paper-card` `#fcfdf8` — warm vellum + raised card.
- `--ink` `#16201b` — deep green-black (text).
- `--green` `#0e5b43` / `--green-bright` `#1c8a63` — emerald, the primary accent.
- `--brass` `#a8842f` — antique brass, illumination accent, used sparingly.
- `--rubric` `#9a3b32` — reserved for "Einwand".

Why not the AI defaults: not the dark-+-neon look, not broadsheet columns, and
not the cream-serif-+-terracotta default — the accent is **emerald**, the
ornament is real arabesque, and the structure is a **journey**, not an article.

## Type
- **Display** — `Bodoni Moda` (high-contrast Didone; reads expensive, modern).
- **Body / scholarly** — `Newsreader` (literary, optical sizes).
- **UI / data** — `Jost` (geometric counterpoint; labels & search).
- **Arabic** — `Amiri` (verses) + `Reem Kufi` (the operator name).
- **Hebrew** — `Frank Ruhl Libre`. RTL handled per script.

## Signature element — the Shamsa
The "little sun" rosette that opens a manuscript. Hand-built in SVG (girih star
+ khatam + rosette), recoloured for vellum: **emerald geometry, brass core,
paper-white disk**. It is the platform's emblem and the mark of every seal.

## The journey
The homepage is read top-to-bottom as a route: frontispiece → the two ways in →
"Eine Reise durch die Schrift" → modules as **stations** strung on one emerald
path. Background is kept clean (the old ghost/girih symbols were removed).

## Motion (Emil Kowalski craft)
Custom easings only — `--ease-out: cubic-bezier(.23,1,.32,1)`,
`--ease-in-out: cubic-bezier(.77,0,.175,1)`. Spring entrances (never `scale(0)`),
`scale(.97)` press feedback, origin-aware search dropdown, hover gated to
`(hover:hover) and (pointer:fine)`, transform/opacity only, staggered page-load,
the path draws down on view. `prefers-reduced-motion` fully respected.

## Built
- `src/components/Shamsa.tsx` — emerald/brass signature medallion.
- `src/components/Ornament.tsx` — arabesque crown + footer sprig (intentional).
- `src/pages/Bibliothek.tsx` — homepage: frontispiece + search + question agent
  + modules as stations on the journey path.
- `src/data/` — `Siegel`/module data contract + keyword search index.
- Module page (9 seals as rows) + seal holding pages so nothing dead-ends.

## Next
Daniel (Siegel V) as the showcase seal — interactive Nebuchadnezzar statue,
timeline, two-level layout — and the immersive `Beleg` modal system (illuminated
card → backdrop dim → full verse with original script).
