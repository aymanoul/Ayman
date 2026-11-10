// Inhalt der Figurenblätter (Phase 1). Reine Daten: wird im Browser (Rendern) und in Node (Layout) gelesen.
const TAU = Math.PI * 2;
export const SHOT = 'sheet';
export const SIZE = [640, 960];
export const KICKER = 'Masjid As-Sunnah · Die Wichtigkeit des Gebets · Phase 1';

const SKIN = { A: ['#b3804f', '#c79367', '#ddb088'], B: ['#bd885b', '#d19d72', '#e6bd97'] };
const BEARD = { A: [0.3, 0.5, 0.78], B: [0.04, 0.12, 0.26] };
const EMO = [['freundlich', 'freundlich'], ['nachdenklich', 'nachdenklich'], ['erschrocken', 'erschrocken'], ['beschaemt', 'beschämt'], ['erleichtert', 'erleichtert']];

function figureSheet(F) {
  const isA = F === 'A';
  const c = (id, label, o) => ({ id: `${F}_${id}`, label, fig: F, ...o });
  const walkOpt = isA ? { hurry: 0 } : { hurry: 1, arms: true };
  const walkPose = (ph) => (isA
    ? { walk: ph, walkOpt, head: [0.02, 0, 0] }
    : { walk: ph, walkOpt, neck: [0.14, 0, 0], head: [0.3, 0, 0],
        R: { reach: [-0.1, 0.27, 0.3], pole: [-1, -1, -0.2], palm: [0.15, 0.75, -0.6], flex: -0.1, hand: 'hold' }, phone: true });
  const sheet = {
    file: `figurenblatt-${F}`,
    title: isA ? 'Person A – der Ratgeber' : 'Person B – der junge Mann',
    facts: isA
      ? ['Ende 20 bis Mitte 30, ruhig und warm, aufrechte Haltung', 'Weißer saudischer Qamis: knöchellang, Hemdkragen, Knopfleiste, Manschetten, Brusttasche', 'Ägyptische Kufi: weiß, eng anliegend, gehäkelt mit Lochmuster', 'Voller, gepflegter dunkler Bart · draußen schlichte Schuhe, in der Moschee Socken']
      : ['18–25, am Anfang in Eile und abgelenkt, am Ende entschlossen', 'Blauer saudischer Qamis: gleicher Schnitt wie bei A, kräftiges Mittelblau', 'Keine Kopfbedeckung · Kurzhaarschnitt (Seiten kurz, oben länger)', 'Kurzer Bart · draußen helle Turnschuhe, in der Moschee Socken'],
    sections: [
      { title: 'Ansichten', cols: 4, cells: [
        c('vorne', 'von vorne', { pose: 'neutral', frame: 'full', az: 0 }),
        c('dreiviertel', 'Dreiviertel', { pose: 'neutral', frame: 'full', az: -0.75 }),
        c('seite', 'von der Seite', { pose: 'neutral', frame: 'full', az: -Math.PI / 2 }),
        c('hinten', 'von hinten', { pose: 'neutral', frame: 'full', az: Math.PI }),
      ] },
      { title: 'Kopf (Augenpartie = glatte Haut)', cols: 4, cells: [
        c('kopf_vorne', 'Kopf von vorne', { pose: 'neutral', frame: 'head', az: 0 }),
        c('kopf_34', 'Kopf Dreiviertel', { pose: 'neutral', frame: 'head', az: -0.7 }),
        c('kopf_profil', 'Kopf im Profil', { pose: 'neutral', frame: 'head', az: -Math.PI / 2 }),
        c('kopf_hinten', 'Kopf von hinten', { pose: 'neutral', frame: 'head', az: Math.PI }),
      ] },
      { title: 'Mund: 4 Formen', cols: 4, aspect: '1 / 1', cells: [
        c('mund_zu', 'zu', { pose: { mouth: 'closed' }, frame: 'mouth', az: -0.3 }),
        c('mund_halb', 'halb offen', { pose: { mouth: 'half' }, frame: 'mouth', az: -0.3 }),
        c('mund_offen', 'offen', { pose: { mouth: 'open' }, frame: 'mouth', az: -0.3 }),
        c('mund_laecheln', 'Lächeln', { pose: { mouth: 'smile' }, frame: 'mouth', az: -0.3 }),
      ] },
      { title: '5 Gefühlslagen – ohne Augen, nur über Kopf, Mund, Schultern und Hände', cols: 5, cells:
        EMO.map(([p, l]) => c('emo_' + p, l, { pose: p, frame: 'waist', az: -0.35 })) },
      { title: 'Hände und Gesten', cols: 4, cells: isA ? [
        c('hand_offen', 'offene Hand (einladend)', { pose: 'offeneHand', frame: 'handR', az: -0.25 }),
        c('hand_herz', 'Hand aufs Herz', { pose: 'handHerz', frame: 'chest', az: -0.2 }),
        c('hand_schulter', 'Hand auf der Schulter von B', { pose: 'neutral', frame: 'duo', az: 0, duo: true }),
        c('hand_ruhe', 'Hand in Ruhe', { pose: 'neutral', frame: 'handL', az: 0.9 }),
      ] : [
        c('hand_handy', 'Handy in der Hand', { pose: 'handy', frame: 'phone', az: Math.PI - 0.75, phone: true }),
        c('hand_offen', 'offene Hand (fragend)', { pose: 'offeneHand', frame: 'handR', az: -0.25 }),
        c('hand_faust', 'entschlossen', { pose: 'entschlossen', frame: 'waist', az: -0.3 }),
        c('hand_ruhe', 'Hand in Ruhe', { pose: 'neutral', frame: 'handL', az: 0.9 }),
      ] },
      { title: isA ? 'Gangbild – ruhig (Saum schwingt, Füße unter dem Saum, leichtes Wippen)' : 'Gangbild – in Eile, Handy in der Hand, Kopf gesenkt', cols: 6,
        cells: [0, 1, 2, 3, 4, 5].map((i) => c('gang_' + i, `Schritt ${i + 1}`, { pose: walkPose((i / 6) * TAU), frame: 'full', az: Math.PI / 2 - 0.25, phone: !isA })) },
      { title: 'Sitzen auf dem Teppich · Schuhe draußen, Socken in der Moschee', cols: 4, cells: [
        c('sitz_34', 'Sitzen, Dreiviertel', { pose: 'sitzen', frame: 'seated', az: -0.6, footwear: 'socks' }),
        c('sitz_spricht', isA ? 'Sitzen, erklärt' : 'Sitzen, fragt', { pose: 'sitzenSpricht', frame: 'seated', az: 0.5, footwear: 'socks' }),
        c('fuss_schuhe', 'draußen: Schuhe', { pose: 'neutral', frame: 'feet', az: -0.6, footwear: 'shoes' }),
        c('fuss_socken', 'drinnen: Socken', { pose: 'neutral', frame: 'feet', az: -0.6, footwear: 'socks' }),
      ] },
    ],
    foot: ['Gelenke: Hüfte, Rücken, Hals, Kopf, Schultern (auch heben/senken), Ellbogen, Handgelenke, Finger, Daumen, Füße.',
      'Keine Figur hat Augen – auch nicht angedeutet. Zwischen Nase und Haaransatz bzw. Kufi ist nur glatte Haut.'],
  };
  const name = sheet.title;
  return [
    { ...sheet, file: `figurenblatt-${F}-1-ansichten`, title: name + ' · Blatt 1: Ansichten', sections: sheet.sections.slice(0, 3), foot: [sheet.foot[1]] },
    { ...sheet, file: `figurenblatt-${F}-2-ausdruck`, title: name + ' · Blatt 2: Ausdruck und Bewegung', facts: [], sections: sheet.sections.slice(3) },
  ];
}

function variantSheet(F) {
  const c = (id, label, o) => ({ id: `${F}_var_${id}`, label, fig: F, pose: 'neutral', frame: 'bust', az: -0.35, ...o });
  const skin = SKIN[F].map((x, i) => c('haut' + i, ['dunkler', 'mittel', 'heller'][i] + (i === 1 ? ' (mein Vorschlag)' : ''), { opts: { skin: x } }));
  const beard = BEARD[F].map((x, i) => c('bart' + i, (F === 'A' ? ['kürzer', 'mittel', 'länger'] : ['sehr kurz', 'kurz', 'etwas länger'])[i] + (i === 1 ? ' (mein Vorschlag)' : ''), { opts: { beardLen: x } }));
  const brows = [c('brauen0', 'ohne Augenbrauen (mein Vorschlag)', { frame: 'head', az: -0.2, opts: { brows: false } }), c('brauen1', 'mit Augenbrauen', { frame: 'head', az: -0.2, opts: { brows: true } })];
  const emo = (b) => EMO.map(([p, l]) => c((b ? 'emoB_' : 'emoN_') + p, l, { pose: p, opts: { brows: b } }));
  return {
    file: `varianten-${F}`,
    title: `Varianten für Person ${F}: Hautton, Bart, Augenbrauen`,
    facts: ['Bitte pro Abschnitt eine Variante wählen. Meine Vorschläge sind markiert.', 'Regel 1 gilt in jeder Variante: Es gibt nie Augen.'],
    sections: [
      { title: 'Hautton', cols: 3, aspect: '1 / 1', cells: skin },
      { title: 'Bartlänge', cols: 3, aspect: '1 / 1', cells: beard },
      { title: 'Augenbrauen: ohne oder mit', cols: 2, aspect: '4 / 3', cells: brows },
      { title: 'Gefühlslagen ohne Augenbrauen', cols: 5, cells: emo(false) },
      { title: 'Dieselben Gefühlslagen mit Augenbrauen', cols: 5, cells: emo(true) },
    ],
    foot: ['Hinweis zu den Augenbrauen: Ohne Augen darunter können zwei dunkle Striche auf der Stirn wie geschlossene Augen wirken. Deshalb empfehle ich die Variante ohne.'],
  };
}

function extrasSheet() {
  return {
    file: 'nebenfiguren',
    title: 'Nebenfiguren – Betende in der Reihe',
    facts: ['Nur von hinten oder aus der Ferne zu sehen, ebenfalls ohne Augen.', 'Gleicher Aufbau wie A und B, andere Farben, Größen und Kopfbedeckungen.'],
    sections: [
      { title: 'Reihe von hinten', cols: 2, cells: [
        { id: 'N_reihe_hinten', label: 'von hinten (so im Schlussbild)', scene: 'row', frame: 'rowBack' },
        { id: 'N_reihe_fern', label: 'aus der Ferne, schräg von hinten', scene: 'row', frame: 'rowFar' },
      ] },
    ],
    foot: [],
  };
}

export const SHEETS = [...figureSheet('A'), ...figureSheet('B'), variantSheet('A'), variantSheet('B'), extrasSheet()];
export const ALL_CELLS = SHEETS.flatMap((s) => s.sections.flatMap((x) => x.cells || []));
