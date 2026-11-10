// Posen als Daten. applyPose setzt die Figur in jedem Bild neu (erst Grundhaltung, dann Pose).
// Winkel in Radiant. Arme: entweder Winkel (swing/out/twist/bend) oder Zielpunkt (reach) fürs Handgelenk
// in Oberkörper-Koordinaten (x: links +, y: über der Hüfte, z: nach vorn).

export function applyPose(fig, p = {}) {
  const J = fig.J;
  fig.setSeated(!!p.seated);
  fig.reset();
  const add = (rot, v) => { if (v) { rot.x += v[0]; rot.y += v[1]; rot.z += v[2]; } };
  if (p.turn) J.body.rotation.y += p.turn;
  add(J.hips.rotation, p.hips);
  add(J.spine.rotation, p.spine);
  add(J.neck.rotation, p.neck);
  add(J.head.rotation, p.head);
  if (p.shrug) fig.shrug(p.shrug);
  if (p.walk !== undefined) fig.walk(p.walk, p.walkOpt || {});
  for (const [sd, k] of [['L', 1], ['R', -1]]) {
    const a = p[sd];
    if (!a) continue;
    if (a.reach) fig.reachLocal(sd, a.reach, a.pole);
    else {
      const sh = J['shoulder' + sd];
      if (a.swing !== undefined || a.out !== undefined || a.twist !== undefined) {
        sh.rotation.set(a.swing ?? 0.05, -k * (a.twist ?? 0), k * (a.out ?? 0.11));
      }
      if (a.bend !== undefined) J['elbow' + sd].rotation.x = -a.bend;
    }
    const wr = J['wrist' + sd];
    if (a.wrist) wr.rotation.set(a.wrist[0], a.wrist[1] * -k, a.wrist[2] * k);
    if (a.palm) fig.aimPalm(sd, a.palm);
    if (a.flex !== undefined) wr.rotation.x = a.flex;
    if (a.dev !== undefined) wr.rotation.z = a.dev * k;
    if (a.hand) fig.setHand(sd, a.hand);
  }
  fig.setMouth(p.mouth || 'closed', p.mouthOpt || {});
  if (p.brows) fig.setBrows(p.brows[0], p.brows[1]);
}

// Gefühlslagen ohne Augen: Kopfhaltung, Mund, Schultern, Hände
export const POSES = {
  neutral: { },
  freundlich: {
    spine: [0.01, 0, 0.015], head: [-0.03, 0.1, 0.09], mouth: 'smile', brows: [0.5, 0],
    R: { reach: [-0.2, 0.31, 0.36], pole: [-0.5, -1, -0.5], palm: [0.25, 1, 0.1], flex: -0.15, hand: 'open' },
  },
  nachdenklich: {
    spine: [0.03, -0.06, 0], head: [0.13, -0.2, -0.1], mouth: 'closed', mouthOpt: { skew: 0.14, dx: 0.006, wide: 0.85 }, brows: [-0.3, -0.12],
    R: { reach: [-0.07, 0.46, 0.22], pole: [-0.6, -1, 0.3], palm: [0.3, 0.2, -1], flex: 0.3, hand: 'hold' },
    L: { reach: [-0.15, 0.2, 0.2], pole: [0.9, -1, 0.1], palm: [0, 0.3, -1], hand: 'relaxed' },
  },
  erschrocken: {
    spine: [-0.13, 0, 0], neck: [-0.05, 0, 0], head: [-0.1, 0, 0], shrug: 1.1, mouth: 'open', brows: [1.4, 0.12],
    R: { reach: [-0.3, 0.42, 0.24], pole: [-1, -0.7, -0.5], palm: [0.2, -0.2, 1], flex: -0.5, hand: 'open' },
    L: { reach: [0.3, 0.42, 0.24], pole: [1, -0.7, -0.5], palm: [-0.2, -0.2, 1], flex: -0.5, hand: 'open' },
  },
  beschaemt: {
    spine: [0.17, 0.05, 0], neck: [0.12, 0, 0], head: [0.36, 0.3, 0.05], shrug: 0.45, mouth: 'closed', mouthOpt: { wide: 0.78, dy: -0.003 }, brows: [-0.2, 0.3],
    R: { reach: [-0.01, 0.05, 0.2], pole: [-1, -0.8, -0.2], palm: [0, 0.2, -1], hand: 'relaxed' },
    L: { reach: [0.0, 0.02, 0.225], pole: [1, -0.8, -0.2], palm: [0, 0.2, -1], hand: 'relaxed' },
  },
  erleichtert: {
    spine: [-0.035, 0, 0], head: [-0.13, 0.05, 0.05], shrug: -0.9, mouth: 'smile', brows: [0.7, 0.1],
    R: { reach: [-0.05, 0.33, 0.225], pole: [-1, -0.9, 0.1], palm: [0, 0, -1], flex: 0.1, hand: 'flat' },
  },
  // Gesten
  handHerz: {
    head: [0.05, 0.06, 0.04], mouth: 'smile',
    R: { reach: [-0.05, 0.33, 0.225], pole: [-1, -0.9, 0.1], palm: [0, 0, -1], flex: 0.1, hand: 'flat' },
  },
  offeneHand: {
    head: [-0.02, 0.08, 0.05], mouth: 'half',
    R: { reach: [-0.3, 0.21, 0.33], pole: [-0.5, -1, -0.5], palm: [0.25, 1, 0.1], flex: -0.15, hand: 'open' },
  },
  handy: {
    spine: [0.1, 0, 0], neck: [0.15, 0, 0], head: [0.34, -0.05, 0], mouth: 'closed',
    R: { reach: [-0.1, 0.27, 0.3], pole: [-1, -1, -0.2], palm: [0.15, 0.75, -0.6], flex: -0.1, hand: 'hold' },
  },
  entschlossen: {
    spine: [-0.02, 0, 0], head: [-0.06, 0, 0], shrug: -0.3, mouth: 'closed', brows: [-0.4, -0.2],
    R: { swing: 0.02, out: 0.14, bend: 0.25, hand: 'fist' }, L: { swing: 0.02, out: 0.14, bend: 0.25, hand: 'fist' },
  },
  sitzen: {
    seated: true, spine: [0.07, 0, 0], head: [0.02, 0, 0],
    R: { reach: [-0.31, 0.05, 0.25], pole: [-1, -0.3, -0.6], palm: [0, -1, 0.2], hand: 'relaxed' },
    L: { reach: [0.31, 0.05, 0.25], pole: [1, -0.3, -0.6], palm: [0, -1, 0.2], hand: 'relaxed' },
  },
  sitzenSpricht: {
    seated: true, spine: [0.05, 0.08, 0], head: [-0.02, 0.15, 0.05], mouth: 'half',
    R: { reach: [-0.3, 0.26, 0.33], pole: [-0.5, -1, -0.5], palm: [0.25, 1, 0.1], flex: -0.15, hand: 'open' },
    L: { reach: [0.31, 0.05, 0.25], pole: [1, -0.3, -0.6], palm: [0, -1, 0.2], hand: 'relaxed' },
  },
};

export function pose(name, extra = {}) { return { ...POSES[name], ...extra }; }
