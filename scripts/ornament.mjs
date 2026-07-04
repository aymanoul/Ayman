// Generator für die Mushaf-Ornamentik (Madina-Stil, Vorlage: klassischer
// grüner Prachtrahmen). Erzeugt zwei statische SVGs nach src/assets/ornaments/:
//
//   mushaf-frame.svg — voll umlaufender Seitenrahmen (9-Slice für border-image,
//                      slice 72, repeat round; Kantenperiode 84 → 4 Motive/Kante)
//   kartusche.svg    — Suren-Kartusche für Titel (slice 26 150, fill;
//                      Rosetten-Medaillons an den Enden, Spitzbogen-Abschluss)
//
// Aufruf: node scripts/ornament.mjs
// Die SVGs werden committet; dieser Generator ist die Quelle der Wahrheit.

import { writeFileSync, mkdirSync } from 'node:fs'

// ---- Palette (muss zu den Tokens in src/index.css passen) ----
const G_DEEP = '#1d6b49' // sattes Madina-Grün (Bandgrund)
const G_DARK = '#124732' // dunkle Kantenschattierung
const G_RULE = '#2e7d54' // innere grüne Regel-Linie
const GOLD = '#b3873a' // brass
const GOLD_B = '#d9b56a' // helles Gold (Fileten, Ranke)
const CREAM = '#f6efdd' // Creme (Blüten, Kerne)
const PINK = '#e0a4b8' // Rosetten-Rosa
const PINK_D = '#c27e9b' // Rosa, tief (Kontur)
const PINK_L = '#f3d5e0' // Rosa, hell (innerer Blattkranz)
const CREAM_BG = '#f8f3e2' // Kartuschen-Innenfeld

const fmt = (n) => Math.round(n * 100) / 100

// Ein Blütenblatt als Tropfenform, Spitze nach oben, Ursprung am Ansatz.
function petalPath(len, w) {
  return `M0,0 C${fmt(w)},-${fmt(len * 0.26)} ${fmt(w * 1.04)},-${fmt(len * 0.72)} 0,-${fmt(len)} C-${fmt(w * 1.04)},-${fmt(len * 0.72)} -${fmt(w)},-${fmt(len * 0.26)} 0,0 Z`
}

// Volle Rosette: zwei Blattkränze (außen rosa, innen hell versetzt) +
// Goldring + Creme-Kern + Goldpunkt — die typische Tezhip-Schichtung.
function rosette(cx, cy, { n = 8, len = 13.5, w = 4.6, ring = 4.8, core = 1.9, fill = PINK, stroke = PINK_D } = {}) {
  const petals = []
  for (let k = 0; k < n; k++) {
    petals.push(`<path d="${petalPath(len, w)}" transform="rotate(${fmt((360 / n) * k)})" fill="${fill}" stroke="${stroke}" stroke-width="0.5"/>`)
  }
  const halfTurn = 360 / n / 2
  for (let k = 0; k < n; k++) {
    petals.push(`<path d="${petalPath(len * 0.58, w * 0.62)}" transform="rotate(${fmt((360 / n) * k + halfTurn)})" fill="${PINK_L}"/>`)
  }
  return `<g transform="translate(${fmt(cx)},${fmt(cy)})">${petals.join('')}<circle r="${ring}" fill="${CREAM}" stroke="${GOLD_B}" stroke-width="1"/><circle r="${core}" fill="${GOLD}"/></g>`
}

// Kleine Creme-Blüte (Zwischenmotiv auf dem Band).
function blossom(cx, cy, { n = 6, len = 6.8, w = 2.5 } = {}) {
  const petals = []
  for (let k = 0; k < n; k++) {
    petals.push(`<path d="${petalPath(len, w)}" transform="rotate(${fmt((360 / n) * k)})" fill="${CREAM}" stroke="${GOLD}" stroke-width="0.4" stroke-opacity="0.7"/>`)
  }
  return `<g transform="translate(${fmt(cx)},${fmt(cy)})">${petals.join('')}<circle r="1.5" fill="${GOLD_B}"/></g>`
}

// Lanzett-Blatt an der Ranke; angle dreht es um den Ansatzpunkt.
function leaf(x, y, angle, len = 9, w = 3.4) {
  return `<path d="M0,0 C${fmt(w)},-${fmt(len * 0.3)} ${fmt(w * 0.9)},-${fmt(len * 0.78)} 0,-${fmt(len)} C-${fmt(w * 0.35)},-${fmt(len * 0.62)} -${fmt(w * 0.55)},-${fmt(len * 0.28)} 0,0 Z" transform="translate(${fmt(x)},${fmt(y)}) rotate(${fmt(angle)})" fill="${GOLD_B}"/>`
}

/* ========================================================================
   1. mushaf-frame.svg — 480×480, Dicke 72, Kantenperiode 84 (4 pro Kante)
   ======================================================================== */
function buildFrame() {
  const S = 480
  const T = 72
  const PERIOD = 112 // 3 Motive pro Kante — bei 42px Rahmenbreite präsent genug
  const mid = 36 // Bandmitte
  const AMP = 15 // Ranken-Amplitude

  // Konzentrische Rahmen-Ringe (laufen durch die Ecken durch)
  const ring = (inset, stroke, w, opacity = 1) =>
    `<rect x="${inset}" y="${inset}" width="${S - 2 * inset}" height="${S - 2 * inset}" fill="none" stroke="${stroke}" stroke-width="${w}"${opacity < 1 ? ` stroke-opacity="${opacity}"` : ''}/>`

  // Grüner Bandgrund als Ring (evenodd)
  const bandRing = `<path d="M7,7 H${S - 7} V${S - 7} H7 Z M65,65 H${S - 65} V${S - 65} H65 Z" fill="${G_DEEP}" fill-rule="evenodd"/>`

  const rings = [
    ring(1.5, GOLD, 1),
    ring(4, GOLD, 0.5, 0.75),
    bandRing,
    ring(7.5, G_DARK, 1, 0.85),
    ring(64.5, G_DARK, 1, 0.85),
    ring(9, GOLD_B, 1.1),
    ring(63, GOLD_B, 1.1),
    ring(67, GOLD, 0.9),
    ring(69.8, G_RULE, 1.6),
  ].join('')

  // ---- Obere Kante: Ranke + Rosetten im Bereich x ∈ [72, 408] ----
  const parts = []
  const Q = PERIOD / 4 // Viertelperiode (28)
  let vine = `M${T},${mid}`
  for (let i = 0; i < 3; i++) {
    const x0 = T + i * PERIOD
    // Sinuslinie: Knoten bei x0, x0+56, x0+112; Kämme bei x0+28 (oben) / x0+84 (unten)
    vine += ` C${fmt(x0 + Q * 0.66)},${fmt(mid - AMP * 1.35)} ${fmt(x0 + Q * 1.34)},${fmt(mid - AMP * 1.35)} ${fmt(x0 + Q * 2)},${mid}`
    vine += ` C${fmt(x0 + Q * 2.66)},${fmt(mid + AMP * 1.35)} ${fmt(x0 + Q * 3.34)},${fmt(mid + AMP * 1.35)} ${fmt(x0 + Q * 4)},${mid}`
  }
  parts.push(`<path d="${vine}" fill="none" stroke="${GOLD_B}" stroke-width="1.8"/>`)

  for (let i = 0; i < 3; i++) {
    const x0 = T + i * PERIOD
    // Blätter an den Kämmen, tangential zur Ranke
    parts.push(leaf(x0 + Q, mid - AMP, -68, 10.5, 3.8))
    parts.push(leaf(x0 + Q, mid - AMP, 118, 8.5, 3.2))
    parts.push(leaf(x0 + Q * 3, mid + AMP, 112, 10.5, 3.8))
    parts.push(leaf(x0 + Q * 3, mid + AMP, -62, 8.5, 3.2))
    // Goldpunkte in den Leerräumen gegenüber der Kämme
    parts.push(`<circle cx="${fmt(x0 + Q)}" cy="${fmt(mid + AMP * 0.6)}" r="1.4" fill="${GOLD_B}"/>`)
    parts.push(`<circle cx="${fmt(x0 + Q * 3)}" cy="${fmt(mid - AMP * 0.6)}" r="1.4" fill="${GOLD_B}"/>`)
    // Große Rosette am Mittelknoten, Creme-Blüte am Periodenanfang
    parts.push(rosette(x0 + Q * 2, mid, { n: 8, len: 15.5, w: 5.2, ring: 5.4, core: 2.2 }))
    parts.push(blossom(x0, mid, { n: 6, len: 7.6, w: 2.8 }))
  }
  // Perlenreihen (Beading) entlang beider Bandkanten, knapp innerhalb der Fileten
  for (let x = T + 7; x < S - T; x += 14) {
    parts.push(`<circle cx="${fmt(x)}" cy="13.5" r="1" fill="${CREAM}" fill-opacity="0.9"/>`)
    parts.push(`<circle cx="${fmt(x)}" cy="58.5" r="1" fill="${CREAM}" fill-opacity="0.9"/>`)
  }
  const topEdge = `<g>${parts.join('')}</g>`

  return { S, rings, topEdge }
}

function frameSvg() {
  const { S, rings, topEdge } = buildFrame()

  // Ecke (oben links): großes 12-Blatt-Medaillon + Punktkranz
  const cornerParts = []
  cornerParts.push(`<circle cx="36" cy="36" r="28.5" fill="none" stroke="${CREAM}" stroke-width="0.8" stroke-opacity="0.45"/>`)
  for (let k = 0; k < 8; k++) {
    const a = (Math.PI / 4) * k + Math.PI / 8
    cornerParts.push(`<circle cx="${fmt(36 + 31 * Math.cos(a))}" cy="${fmt(36 + 31 * Math.sin(a))}" r="1.5" fill="${CREAM}" fill-opacity="0.85"/>`)
  }
  cornerParts.push(rosette(36, 36, { n: 12, len: 19, w: 5.2, ring: 8, core: 3.4 }))
  const cornerTL = `<g>${cornerParts.join('')}</g>`

  const edges = [
    topEdge,
    `<g transform="rotate(90 ${S / 2} ${S / 2})">${topEdge}</g>`,
    `<g transform="rotate(180 ${S / 2} ${S / 2})">${topEdge}</g>`,
    `<g transform="rotate(270 ${S / 2} ${S / 2})">${topEdge}</g>`,
  ].join('')

  const corners = [
    cornerTL,
    `<g transform="rotate(90 ${S / 2} ${S / 2})">${cornerTL}</g>`,
    `<g transform="rotate(180 ${S / 2} ${S / 2})">${cornerTL}</g>`,
    `<g transform="rotate(270 ${S / 2} ${S / 2})">${cornerTL}</g>`,
  ].join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">${rings}${edges}${corners}</svg>`
}

/* ========================================================================
   2. kartusche.svg — 720×120, Slice 26/150, Creme-Feld mit Spitzbogen-Enden
   ======================================================================== */
function kartuscheSvg() {
  const W = 720
  const H = 120
  const parts = []

  // Grund: Creme über alles (der 'fill'-Bereich der border-image)
  parts.push(`<rect width="${W}" height="${H}" fill="${CREAM_BG}"/>`)

  // Horizontale Bänder oben/unten (y 6..20 bzw. gespiegelt), Periode 60
  const band = (yTop) => {
    const y0 = yTop
    const y1 = yTop + 14
    const cy = yTop + 7
    const seg = []
    seg.push(`<rect x="3" y="${y0}" width="${W - 6}" height="14" fill="${G_DEEP}"/>`)
    seg.push(`<line x1="3" y1="${y0 + 0.6}" x2="${W - 3}" y2="${y0 + 0.6}" stroke="${G_DARK}" stroke-width="0.8" stroke-opacity="0.8"/>`)
    seg.push(`<line x1="3" y1="${y1 - 0.6}" x2="${W - 3}" y2="${y1 - 0.6}" stroke="${G_DARK}" stroke-width="0.8" stroke-opacity="0.8"/>`)
    seg.push(`<line x1="3" y1="${y0 - 1.6}" x2="${W - 3}" y2="${y0 - 1.6}" stroke="${GOLD_B}" stroke-width="1"/>`)
    seg.push(`<line x1="3" y1="${y1 + 1.6}" x2="${W - 3}" y2="${y1 + 1.6}" stroke="${GOLD_B}" stroke-width="1"/>`)
    // Mini-Ranke
    let v = `M0,${cy}`
    for (let i = 0; i < W / 60; i++) {
      const x0 = i * 60
      v += ` C${fmt(x0 + 10)},${fmt(cy - 6)} ${fmt(x0 + 20)},${fmt(cy - 6)} ${fmt(x0 + 30)},${cy}`
      v += ` C${fmt(x0 + 40)},${fmt(cy + 6)} ${fmt(x0 + 50)},${fmt(cy + 6)} ${fmt(x0 + 60)},${cy}`
    }
    seg.push(`<path d="${v}" fill="none" stroke="${CREAM}" stroke-width="0.9" stroke-opacity="0.85"/>`)
    for (let i = 0; i < W / 60; i++) {
      const x0 = i * 60
      seg.push(`<circle cx="${fmt(x0 + 30)}" cy="${cy}" r="1.7" fill="${CREAM}"/>`)
      seg.push(`<circle cx="${fmt(x0)}" cy="${cy}" r="1.1" fill="${GOLD_B}"/>`)
    }
    return seg.join('')
  }
  parts.push(band(6))
  parts.push(band(H - 20))

  // Äußerer Goldrahmen
  parts.push(`<rect x="1.5" y="1.5" width="${W - 3}" height="${H - 3}" fill="none" stroke="${GOLD}" stroke-width="1"/>`)

  // Endzone links: grüner Block mit Spitzbogen-Abschluss + Mandorla-Medaillon.
  // WICHTIG für 9-Slice: alles Figürliche bleibt in der vertikalen Mittelzone
  // (y 26..94), sonst zerschneiden die Eck-Slices das Medaillon. Die Mandorla
  // (Spitzoval) verträgt die vertikale Dehnung der Seiten-Slices gutmütig.
  const endZone = () => {
    const seg = []
    const shape = `M3,3 H112 C126,22 140,40 140,60 C140,80 126,98 112,117 H3 Z`
    seg.push(`<path d="${shape}" fill="${G_DEEP}"/>`)
    seg.push(`<path d="M5.5,5.5 H110.5 C124,24 137.5,41 137.5,60 C137.5,79 124,96 110.5,114.5 H5.5 Z" fill="none" stroke="${GOLD_B}" stroke-width="1.1"/>`)
    // Mandorla (Spitzoval), Spitzen bei y=28/92 — bleibt in der Mittelzone
    const mandorla = (inset) => {
      const t = 28 + inset
      const b2 = 92 - inset
      const rx = 27 - inset * 0.9
      return `M58,${fmt(t)} C${fmt(58 + rx * 0.62)},${fmt(t + 10)} ${fmt(58 + rx)},${fmt(48)} ${fmt(58 + rx)},60 C${fmt(58 + rx)},${fmt(72)} ${fmt(58 + rx * 0.62)},${fmt(b2 - 10)} 58,${fmt(b2)} C${fmt(58 - rx * 0.62)},${fmt(b2 - 10)} ${fmt(58 - rx)},${fmt(72)} ${fmt(58 - rx)},60 C${fmt(58 - rx)},${fmt(48)} ${fmt(58 - rx * 0.62)},${fmt(t + 10)} 58,${fmt(t)} Z`
    }
    seg.push(`<path d="${mandorla(0)}" fill="${G_DARK}" stroke="${GOLD_B}" stroke-width="1.3"/>`)
    seg.push(`<path d="${mandorla(3.2)}" fill="none" stroke="${CREAM}" stroke-width="0.7" stroke-opacity="0.55"/>`)
    seg.push(rosette(58, 60, { n: 8, len: 13, w: 4.4, ring: 4.8, core: 2 }))
    // Goldpunkte an den Mandorla-Spitzen + Zwickel-Blätter
    seg.push(`<circle cx="58" cy="33.5" r="1.4" fill="${GOLD_B}"/>`)
    seg.push(`<circle cx="58" cy="86.5" r="1.4" fill="${GOLD_B}"/>`)
    seg.push(leaf(22, 52, -30, 10, 3.6))
    seg.push(leaf(22, 68, -150, 10, 3.6))
    seg.push(leaf(102, 52, 30, 10, 3.6))
    seg.push(leaf(102, 68, 150, 10, 3.6))
    // Creme-Punktlinie, die dem Spitzbogen innen folgt (Mittelzone)
    const cuspDots = [
      [116, 33], [124, 45], [127.5, 60], [124, 75], [116, 87],
    ]
    for (const [dx, dy] of cuspDots) {
      seg.push(`<circle cx="${dx}" cy="${dy}" r="1.3" fill="${CREAM}" fill-opacity="0.9"/>`)
    }
    return seg.join('')
  }
  parts.push(endZone())
  parts.push(`<g transform="translate(${W},0) scale(-1,1)">${endZone()}</g>`)

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${parts.join('')}</svg>`
}

mkdirSync('src/assets/ornaments', { recursive: true })
writeFileSync('src/assets/ornaments/mushaf-frame.svg', frameSvg())
writeFileSync('src/assets/ornaments/kartusche.svg', kartuscheSvg())
console.log('ornaments written: mushaf-frame.svg, kartusche.svg')
