// Phase 2 – Storyboard „Zwischen Adhan und Iqama“: Shotliste S1–S12 als Daten (Standbilder + Einblendungen).
// Zeiten sind Richtwerte und werden in Phase 3 an die echten Tonlängen angepasst.
// Achsen wie im Gebet-Video: +y oben, Qibla-Wand bei z = −6, Eingang hinten (+z). Säulen: room.js COLUMNS.

// B sitzt mit dem Rücken an der Säule (−1,75 | 1,0), Blick zur Qibla; A setzt sich rechts daneben.
const B_POS = [-1.75, 0, 0.5], A_POS = [-1.05, 0, 0.42];
const B_RY = Math.PI - 0.45, A_RY = Math.PI + 0.55;              // leicht einander zugewandt
const B_ARM_HANDY = { reach: [-0.1, 0.27, 0.3], pole: [-1, -1, -0.2], palm: [0.15, 0.75, -0.6], flex: -0.1, hand: 'hold' };
const B_HANDY = ['sitzen', { neck: [0.15, 0, 0], head: [0.32, 0, 0], R: B_ARM_HANDY }];
const B_HANDY_UNTEN = ['sitzen', { neck: [0.05, 0, 0], head: [0.1, -0.3, 0], R: { reach: [-0.2, 0.08, 0.3], pole: [-1, -1, -0.2], palm: [0.1, 0.9, -0.3], hand: 'hold' } }];
const B_TASCHE = ['sitzen', { head: [0.3, 0, 0], R: { reach: [0.08, 0.37, 0.21], pole: [-1, -1, 0], palm: [0, 0, -1], hand: 'hold' } }];
// Bittgebet: Hände offen vor der Brust, Handflächen nach oben
const DUA = ['sitzen', { head: [0.12, 0, 0], neck: [0.05, 0, 0],
  R: { reach: [-0.11, 0.33, 0.3], pole: [-1, -1, -0.3], palm: [0, 1, 0.25], flex: 0.1, hand: 'open' },
  L: { reach: [0.11, 0.33, 0.3], pole: [1, -1, -0.3], palm: [0, 1, 0.25], flex: 0.1, hand: 'open' } }];
const A_SPRICHT = ['sitzenSpricht', { mouth: 'half' }];
const A_B = (bPose, aPose = 'sitzen', bPhone = true) => [
  { who: 'B', pos: B_POS, ry: B_RY, phone: bPhone, pose: bPose },
  { who: 'A', pos: A_POS, ry: A_RY, pose: aPose },
];
// Wartende im Raum (Nebenfiguren, sitzen mit dem Rücken zur Kamera zur Qibla)
const WARTENDE = [
  { extra: 0, pos: [-0.6, 0, -3.6] }, { extra: 1, pos: [0.9, 0, -3.9] }, { extra: 4, pos: [2.4, 0, -3.2] },
  { extra: 5, pos: [-2.6, 0, -2.6] }, { extra: 0, pos: [0.2, 0, -1.6] },
].map((d) => ({ ...d, ry: Math.PI, pose: ['sitzen', { head: [0.1, 0, 0] }] }));
const IMAM = { extra: 6, pos: [0, 0, -5.2], ry: Math.PI, pose: { head: [0.05, 0, 0] } };

export const SHOTS = [
  { id: 'S1', t: 4, zeile: '(Adhan-Ende)', kamera: 'Totale von hinten, Raum ruhig', handlung: 'Gebetsraum kurz vor dem Gebet, B an der Säule mit Handy, weitere Wartende',
    einbl: 'Zeitbalken „IQAMA IN 10:00“, Hook „Diese Minuten verschwendet fast jeder.“',
    figs: [...A_B(B_HANDY).slice(0, 1), ...WARTENDE], cam: { pos: [1.3, 2.1, 5.2], look: [-1.3, 0.8, -0.6], fov: 50 },
    ov: { balken: { rest: 600 }, titel: ['Diese Minuten', 'verschwendet fast jeder.'] } },
  { id: 'S2', t: 4, zeile: 'A01', kamera: 'langsame Fahrt auf B', handlung: 'B sitzt an der Säule und schaut aufs Handy, das Display leuchtet',
    einbl: 'Zeitbalken, Untertitel',
    figs: [...A_B(B_HANDY).slice(0, 1), ...WARTENDE.slice(0, 3)], cam: { pos: [-0.2, 1.45, -1.6], look: [-1.75, 0.8, 0.45], fov: 42 },
    ov: { balken: { rest: 575 }, sub: 'verbringen sie am Handy.' } },
  { id: 'S3', t: 3, zeile: 'B01', kamera: 'nah auf B mit Handy', handlung: 'B scrollt, das Display zeigt abstrakte Kacheln', einbl: 'Zeitbalken läuft, Untertitel',
    figs: A_B(B_HANDY).slice(0, 1), cam: { on: 'B', part: 'head', dist: 2.1, yaw: -0.4, up: 0.15, fov: 34, lookUp: -0.32 },
    ov: { balken: { rest: 552 }, sub: 'Kurz noch was gucken.' } },
  { id: 'S4', t: 5, zeile: 'A02 · B02', kamera: 'Schuss/Gegenschuss', handlung: 'A setzt sich neben B und fragt', einbl: 'Untertitel',
    figs: A_B(B_HANDY, A_SPRICHT), cam: { pos: [-0.35, 1.15, -1.55], look: [-1.4, 0.72, 0.45], fov: 40 },
    ov: { balken: { rest: 520 }, sub: 'welche Zeit das gerade ist?' } },
  { id: 'S5', t: 3, zeile: 'A03', kamera: 'nah A, leicht von der Seite', handlung: 'A spricht ruhig', einbl: 'Untertitel',
    figs: A_B(B_HANDY, A_SPRICHT), cam: { on: 'A', part: 'head', dist: 2.0, yaw: 0.75, up: 0.0, fov: 34, lookUp: -0.2 },
    ov: { balken: { rest: 490 }, sub: 'Frieden auf ihm, sagte:' } },
  { id: 'S6', t: 8, zeile: 'A04', kamera: 'Totale zur Qibla, leicht von unten', handlung: 'Handy-Display wird dunkel, über dem Raum ein offenes Tor aus Licht', einbl: 'Zeitbalken wird gold, Karte H1',
    figs: [...A_B(B_HANDY_UNTEN, 'sitzen'), ...WARTENDE], fx: ['tor'], dunkel: 1, dimmen: 0.45, cam: { pos: [0.3, 1.2, 1.6], look: [0, 1.85, -5], fov: 54 },
    ov: { balken: { rest: 470, gold: 1 }, karte: 'H1' } },
  { id: 'S7', t: 3, zeile: 'B03', kamera: 'nah B', handlung: 'B lässt das Handy sinken', einbl: 'Untertitel',
    figs: A_B(B_HANDY_UNTEN), dunkel: 1, cam: { on: 'B', part: 'head', dist: 2.0, yaw: -0.3, up: 0.05, fov: 34, lookUp: -0.25 },
    ov: { balken: { rest: 430, gold: 1 }, sub: 'In diesen paar Minuten?' } },
  { id: 'S8', t: 7, zeile: 'A05', kamera: 'Halbtotale von hinten', handlung: 'weitere Wartende sitzen ruhig, alle von hinten', einbl: 'goldene Schrift „Wer wartet, ist im Gebet“, Untertitel',
    figs: [...A_B(B_HANDY_UNTEN), ...WARTENDE], dunkel: 1, cam: { pos: [0.2, 1.75, 2.4], look: [0, 0.75, -3.4], fov: 46 },
    ov: { balken: { rest: 380, gold: 1 }, gold: 'Wer wartet, ist im Gebet', sub: 'als wäre er im Gebet.' } },
  { id: 'S9', t: 4, zeile: 'B04', kamera: 'Handy groß (Grafik) vor B', handlung: 'B schaut auf seine Bildschirmzeit', einbl: 'Bildschirmzeit „heute: 47 Min.“, Untertitel',
    figs: A_B(B_HANDY), dunkel: 1, unscharf: true, cam: { on: 'B', part: 'head', dist: 2.1, yaw: -0.4, up: 0.15, fov: 34, lookUp: -0.32 },
    ov: { balken: { rest: 330, gold: 1 }, bildschirmzeit: 47, sub: 'jeden Tag am Handy verbracht.', subY: 1470 } },
  { id: 'S10', t: 9, zeile: 'A06', kamera: 'Draufsicht auf den Raum', handlung: 'fünf goldene Lichtpunkte leuchten nacheinander auf (Fajr … Isha)', einbl: 'Gebetsnamen, Wörter „für dich · für deine Eltern · für dein Jenseits“',
    figs: [...A_B(B_HANDY_UNTEN, 'sitzen', false), ...WARTENDE], fx: ['punkte'], cam: { pos: [0.0, 3.25, -0.6], look: [0, 0, -2.6], fov: 82 },
    ov: { balken: { rest: 260, gold: 1 }, punkte: 5, worte: ['für dich', 'für deine Eltern', 'für dein Jenseits'] } },
  { id: 'S11', t: 4, zeile: 'B05', kamera: 'halbnah B', handlung: 'B steckt das Handy in die Tasche', einbl: 'Untertitel',
    figs: A_B(B_TASCHE, 'sitzen'), dunkel: 1, cam: { on: 'B', part: 'chest', dist: 1.9, yaw: -0.35, up: 0.2, fov: 38 },
    ov: { balken: { rest: 120, gold: 1 }, sub: 'in der Tasche.' } },
  { id: 'S12', t: 6, zeile: 'A07', kamera: 'von hinten, leicht seitlich', handlung: 'A und B heben die Hände zum Bittgebet; vorn der Imam von hinten', einbl: 'Zeitbalken 0:00, Schlusssatz groß',
    figs: [...A_B(DUA, DUA, false), ...WARTENDE.slice(0, 3), IMAM], cam: { pos: [-3.5, 1.25, -0.9], look: [-1.35, 0.8, 0.5], fov: 42 },
    ov: { balken: { rest: 0, gold: 1 }, titel: ['Zwischen Adhan und Iqama', 'wird das Bittgebet', 'nicht abgelehnt.'], titelY: 600 } },
];
let tc = 0;
for (const s of SHOTS) { s.t0 = tc; tc += s.t; }
export const TOTAL = tc;
