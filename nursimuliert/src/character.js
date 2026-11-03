// Figurenbaukasten im Playmobil-Stil (Low-Poly).
//
// OBERSTE REGEL: Keine Figur hat Augen. Es gibt hier weder Augaepfel noch
// Pupillen, Lider, Wimpern, Augenhoehlen oder Punkte im Augenbereich.
// Unter den Augenbrauen ist nur glatte Haut. Gefuehle entstehen nur ueber
// Augenbrauen, Mund, Kopf, Schultern, Haende und Haltung.
//
// Koordinaten: Figur schaut nach +Z, +Y ist oben, +X ist die linke Seite der Figur.

import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { D2R, clamp, lerp } from './util.js';

// ---------------------------------------------------------------- Material

const _mats = new Map();
export function mat(color, extra = {}) {
  const key = String(color) + JSON.stringify(extra);
  if (!_mats.has(key)) {
    _mats.set(key, new THREE.MeshStandardMaterial({
      color, flatShading: true, roughness: 0.8, metalness: 0, ...extra,
    }));
  }
  return _mats.get(key);
}

export function mesh(geo, material, name, { cast = true, receive = true } = {}) {
  const m = new THREE.Mesh(geo, material);
  m.name = name;
  m.castShadow = cast;
  m.receiveShadow = receive;
  return m;
}

function group(name, parent, x = 0, y = 0, z = 0) {
  const g = new THREE.Group();
  g.name = name;
  g.position.set(x, y, z);
  if (parent) parent.add(g);
  return g;
}

function shade(hex, k) {
  const c = new THREE.Color(hex);
  const hsl = {};
  c.getHSL(hsl);
  c.setHSL(hsl.h, hsl.s, clamp(hsl.l * k, 0, 1));
  return '#' + c.getHexString();
}

// ---------------------------------------------------------------- Proportionen

// Kopf gross: Erwachsene ca. 1/4 der Koerperhoehe, Kinder ca. 1/3.
const BUILDS = {
  adult: {
    head: 0.19, neck: 0.045, neckR: 0.062, torsoLow: 0.22, torsoUp: 0.27,
    rTop: 0.228, rMid: 0.2, rBot: 0.19, depth: 0.7, shoulderX: 0.238,
    hipX: 0.098, thigh: 0.35, shin: 0.35, thighR: 0.085, shinR: 0.07,
    upperArm: 0.27, foreArm: 0.25, armR: 0.062, foreR: 0.054,
    hand: [0.058, 0.12, 0.098], shoe: [0.125, 0.08, 0.26],
    walkStep: 0.64, runStep: 1.05,
  },
  teen: {
    head: 0.182, neck: 0.045, neckR: 0.056, torsoLow: 0.21, torsoUp: 0.26,
    rTop: 0.212, rMid: 0.186, rBot: 0.178, depth: 0.7, shoulderX: 0.222,
    hipX: 0.092, thigh: 0.35, shin: 0.35, thighR: 0.078, shinR: 0.064,
    upperArm: 0.265, foreArm: 0.245, armR: 0.057, foreR: 0.05,
    hand: [0.055, 0.115, 0.094], shoe: [0.12, 0.078, 0.255],
    walkStep: 0.62, runStep: 1.05,
  },
  child: {
    head: 0.172, neck: 0.03, neckR: 0.045, torsoLow: 0.135, torsoUp: 0.17,
    rTop: 0.148, rMid: 0.134, rBot: 0.132, depth: 0.74, shoulderX: 0.155,
    hipX: 0.066, thigh: 0.225, shin: 0.22, thighR: 0.057, shinR: 0.048,
    upperArm: 0.165, foreArm: 0.15, armR: 0.042, foreR: 0.038,
    hand: [0.042, 0.085, 0.07], shoe: [0.09, 0.058, 0.18],
    walkStep: 0.4, runStep: 0.72,
  },
};

// ---------------------------------------------------------------- Posen

// Alle Winkel in Grad. Positive Werte: lean = Oberkoerper nach vorn,
// headPitch = Kopf nach unten, sh = Arm nach vorn, ab = Arm seitlich nach aussen,
// el = Ellbogen beugen, hip = Oberschenkel nach vorn, knee = Knie beugen.
export const DEFAULT_POSE = {
  y: 0, lean: 0, spine: 0, twist: 0, side: 0,
  headPitch: 0, headYaw: 0, headRoll: 0,
  shL: 2, shR: 2, abL: 7, abR: 7, twL: 0, twR: 0, elL: 10, elR: 10,
  wrL: 0, wrR: 0, wtL: 0, wtR: 0, thumbL: 0, thumbR: 0,
  hipL: 0, hipR: 0, kneeL: 0, kneeR: 0, hipAbL: 0, hipAbR: 0,
  browIn: 0.1, browUp: 0, smile: 0.15, open: 0, press: 0, talk: 0, breath: 0.25,
  tearL: 0, tearR: 0, wind: 0,
};

export const POSES = {
  stand: {},
  standRelaxed: { shL: 0, shR: 0, abL: 6, abR: 6, elL: 12, elR: 12, smile: 0.2 },
  // Gebueckt hinter dem Fahrrad, linke Hand am Sattel (per IK), rechter Arm frei.
  bentHold: {
    lean: 40, spine: 8, headPitch: -32, hipL: 22, hipR: 22, kneeL: 30, kneeR: 30, y: -0.06,
    shR: 15, abR: 14, elR: 40, smile: 0.25, browIn: 0.35, browUp: 0.2,
  },
  runBent: {
    lean: 32, spine: 8, headPitch: -28, y: -0.04,
    shR: 10, abR: 14, elR: 50, smile: 0.25, browIn: 0.3, browUp: 0.25,
  },
  // Rennen mit ausgestreckter linker Hand ("nur fuer den Fall")
  reachRun: {
    lean: 18, spine: 4, headPitch: -12, shR: 10, abR: 16, elR: 60,
    shL: 72, abL: 6, elL: 12, wrL: -10, thumbL: 0.4, swingL: 0, browIn: 0.45, browUp: 0.3, smile: 0.1, open: 0.15,
  },
  handsOnKnees: {
    lean: 46, spine: 10, headPitch: -38, y: -0.07, hipL: 32, hipR: 32, kneeL: 34, kneeR: 34,
    shL: 40, shR: 40, abL: 10, abR: 10, elL: 6, elR: 6, browIn: 0.6, browUp: 0.1, smile: 0.55, breath: 1.4,
    ikL: { local: [0.13, 0.5, 0.2], w: 1 }, ikR: { local: [-0.13, 0.5, 0.2], w: 1 }, wtL: -60, wtR: 60, wrL: 25, wrR: 25,
  },
  handsInPockets: {
    shL: -10, shR: -10, abL: 14, abR: 14, elL: 28, elR: 28,
    ikL: { local: [0.17, 0.86, 0.065], w: 1 }, ikR: { local: [-0.17, 0.86, 0.065], w: 1 },
    wtL: -20, wtR: 20, smile: 0.1, browIn: 0.45,
  },
  waveHalf: {
    shL: 62, abL: 20, elL: 70, wrL: -10, thumbL: 0.6, twL: -10, browIn: 0.7, browUp: 0.15, smile: 0.25,
  },
  ride: {
    lean: 22, headPitch: -18, hipL: 70, hipR: 70, kneeL: 80, kneeR: 80,
    shL: 50, shR: 50, elL: 30, elR: 30, browUp: 0.5, browIn: 0.2, smile: 0.05, press: 0.6,
  },
  sitDrive: {
    lean: 4, headPitch: -2, hipL: 85, hipR: 85, kneeL: 80, kneeR: 80,
    shL: 45, shR: 45, abL: 10, abR: 10, elL: 50, elR: 50, smile: 0.2, browIn: 0.4,
  },
  carryBox: {
    lean: -4, headPitch: 6, shL: 38, shR: 38, abL: 22, abR: 22, elL: 60, elR: 60, wtL: -70, wtR: 70, smile: 0.2,
  },
};

// Pose aus Bibliothek + Ueberschreibungen zusammenbauen (ohne Mutieren)
export function resolvePose(name, overrides) {
  const base = POSES[name];
  if (name && !base) throw new Error('Unbekannte Pose: ' + name);
  return { ...DEFAULT_POSE, ...(base || {}), ...(overrides || {}) };
}

// ---------------------------------------------------------------- Bauteile

function limbCyl(r0, r1, len, color, name, seg = 7) {
  const g = new THREE.CylinderGeometry(r0, r1, len, seg, 1);
  g.translate(0, -len / 2, 0);
  return mesh(g, mat(color), name);
}

function ball(r, color, name, seg = 8) {
  return mesh(new THREE.SphereGeometry(r, seg, Math.max(4, seg - 2)), mat(color), name);
}

// Gruppe auf der Kopfkugel platzieren, lokale +Z-Achse = Flaechennormale
function onSphere(parent, name, r, x, y, lift) {
  const g = new THREE.Group();
  g.name = name;
  const zz = Math.sqrt(Math.max(0, r * r - x * x - y * y));
  const n = new THREE.Vector3(x, y, zz).normalize();
  g.position.copy(n.clone().multiplyScalar(r + lift));
  g.rotation.order = 'YXZ';
  g.rotation.y = Math.atan2(n.x, n.z);
  g.rotation.x = -Math.asin(n.y);
  parent.add(g);
  return g;
}

function tube(points, radius, color, name, closed = false, seg = 24) {
  const curve = new THREE.CatmullRomCurve3(points, closed, 'catmullrom', 0.5);
  return mesh(new THREE.TubeGeometry(curve, seg, radius, 5, closed), mat(color), name, { cast: false, receive: false });
}

// ---------------------------------------------------------------- Gesicht

// Lage der Gesichtsteile (in Kopfradien). Getestet (out/koepfe_test.jpg): Gerade
// oder gebogene Striche in Augenhoehe wirken wie geschlossene Augen. Deshalb sitzen
// die Brauen hoch an der Stirn, sind gerade, laufen nach aussen spitz zu und sind
// innen leicht angehoben ("/ \"). Darunter bis zur Nase ist nur glatte Haut.
export const FACE = {
  // Brauen bei 57 % des Kopfradius ueber der Kopfmitte, direkt unter dem Haaransatz:
  // kurz, dick, fast gerade (nie als nach unten offener Bogen).
  browX: 0.29, browY: 0.57, browLen: 0.24, browIn: 0.115, browOut: 0.09, browArch: 0, browDrop: 0, browTilt: 4,
  noseY: 0.0, noseR: 0.13, mouthY: -0.3, mouthW: 0.19, cheekX: 0.53, cheekY: -0.13,
};

function browGeometry(r, F) {
  // Braue als gebogener Strich: innen kraeftiger, nach aussen spitz zulaufend,
  // Hoechster Punkt im aeusseren Drittel. Flach extrudiert (flache dunkle Form).
  const L = F.browLen * r, ti = F.browIn * r, to = F.browOut * r, arch = (F.browArch ?? 0.05) * r;
  const n = 10, up = [], lo = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const x = -L / 2 + u * L;
    const yc = arch * Math.sin(Math.PI * Math.pow(u, 0.75)) - u * (F.browDrop ?? 0) * r;
    const th = ti + (to - ti) * Math.pow(u, 1.2);
    up.push([x, yc + th / 2]);
    lo.push([x, yc - th / 2]);
  }
  const sh = new THREE.Shape();
  sh.moveTo(up[0][0], up[0][1]);
  for (let i = 1; i <= n; i++) sh.lineTo(up[i][0], up[i][1]);
  for (let i = n; i >= 0; i--) sh.lineTo(lo[i][0], lo[i][1]);
  sh.closePath();
  const g = new THREE.ExtrudeGeometry(sh, { depth: r * 0.035, bevelEnabled: true, bevelSize: r * 0.008, bevelThickness: r * 0.01, bevelSegments: 1, curveSegments: 2 });
  g.translate(0, -arch * 0.5, -r * 0.015);
  return g;
}

function buildFace(skull, r, spec, P) {
  const F = { ...FACE, ...(spec.face || {}) };
  const face = { r, F };
  const skin = spec.skin;
  const browColor = spec.browColor || shade(spec.hair.color, 0.72);

  // Kopf: glatte Kugel. Unter den Brauen nur Haut.
  const headGeo = new THREE.SphereGeometry(r, 16, 12);
  headGeo.scale(1, 1.04, 0.98);
  skull.add(mesh(headGeo, mat(skin), 'head', { cast: true, receive: false }));

  // Ohren
  for (const s of [1, -1]) {
    const ear = mesh(new THREE.SphereGeometry(r * 0.17, 8, 6), mat(skin), s > 0 ? 'ear_L' : 'ear_R', { cast: false, receive: false });
    ear.scale.set(0.45, 1, 0.75);
    ear.position.set(s * r * 0.97, -r * 0.06, -r * 0.03);
    skull.add(ear);
  }

  // Nase: klein und abgerundet
  const noseG = onSphere(skull, 'nose_anchor', r, 0, r * F.noseY, r * 0.04);
  const nose = mesh(new THREE.SphereGeometry(r * F.noseR, 8, 6), mat(shade(skin, 0.95)), 'nose', { cast: false, receive: false });
  nose.scale.set(1, 0.9, 0.85);
  noseG.add(nose);

  // Wangen: zartrosa, flach, tief und weit aussen (nicht im Augenbereich)
  const cheekY = r * F.cheekY;
  for (const s of [1, -1]) {
    const cg = onSphere(skull, s > 0 ? 'cheek_L' : 'cheek_R', r, s * r * F.cheekX, cheekY, r * (spec.beard ? 0.04 : 0.006));
    const c = mesh(new THREE.CircleGeometry(1, 12), mat(spec.cheek || '#f2a3a0'), 'cheek', { cast: false, receive: false });
    c.scale.set(r * 0.13, r * 0.085, 1);
    cg.add(c);
  }

  // Augenbrauen: flache dunkle Boxen
  face.brows = [];
  for (const s of [1, -1]) {
    const holder = new THREE.Group();
    holder.name = s > 0 ? 'brow_L' : 'brow_R';
    skull.add(holder);
    const b = mesh(browGeometry(r, F), mat(browColor), 'brow', { cast: false, receive: false });
    if (s < 0) b.scale.x = -1; // innen kraeftiger: rechts gespiegelt
    holder.add(b);
    face.brows.push({ s, holder, mesh: b });
  }

  // Bart (optional): kurze Schale um Kinn und Wangen
  if (spec.beard) {
    const bg = new THREE.SphereGeometry(r * 1.03, 18, 8, Math.PI / 2 - 1.62, 3.24, 0.6 * Math.PI, 0.36 * Math.PI);
    bg.scale(1, 1.04, 0.98);
    const beard = mesh(bg, mat(spec.beard.color || '#9b9b9b', { side: THREE.DoubleSide }), 'beard', { cast: false, receive: false });
    skull.add(beard);
    // Schnurrbart
    const mg = onSphere(skull, 'moustache_anchor', r, 0, r * (F.mouthY + 0.085), r * 0.05);
    const pts = [];
    for (let i = 0; i <= 6; i++) {
      const u = i / 6 - 0.5;
      pts.push(new THREE.Vector3(u * r * 0.42, -Math.abs(u) * r * 0.08, -u * u * r * 0.12));
    }
    mg.add(tube(pts, r * 0.04, spec.beard.color || '#9b9b9b', 'moustache', false, 12));
  }

  // Mund: duenne dunkle Kurve, offen als flache dunkle Ellipse
  const mouthLift = spec.beard ? r * 0.06 : r * 0.008;
  face.mouthG = onSphere(skull, 'mouth_anchor', r, 0, r * F.mouthY, mouthLift);
  face.mouthLine = null;
  face.mouthKey = '';
  const ell = mesh(new THREE.CircleGeometry(1, 16), mat('#5b2b2b'), 'mouth_open', { cast: false, receive: false });
  ell.position.z = r * 0.004;
  face.mouthG.add(ell);
  face.mouthOpen = ell;
  face.mouthColor = spec.mouthColor || '#4a2a26';

  // Brille (optional): duenne Fassung, hinter den Glaesern nur Haut (kein Glas)
  if (spec.glasses) {
    const gc = spec.glasses.color || '#2f2f33';
    const zf = r * 1.0;
    const frame = (cx) => {
      const pts = [];
      const hw = r * 0.16, hh = r * 0.115, rr = r * 0.05;
      const corners = [[hw, hh], [-hw, hh], [-hw, -hh], [hw, -hh]];
      for (const [x, y] of corners) {
        const sx = Math.sign(x), sy = Math.sign(y);
        for (let k = 0; k < 3; k++) {
          const a = Math.atan2(sy, sx) + (k - 1) * 0.5;
          pts.push(new THREE.Vector3(cx + x - sx * rr + Math.cos(a) * rr, r * 0.12 + y - sy * rr + Math.sin(a) * rr, zf));
        }
      }
      return tube(pts, r * 0.014, gc, 'glasses_frame', true, 40);
    };
    skull.add(frame(r * 0.35));
    skull.add(frame(-r * 0.35));
    skull.add(tube([
      new THREE.Vector3(r * 0.19, r * 0.15, zf), new THREE.Vector3(0, r * 0.18, zf + r * 0.01), new THREE.Vector3(-r * 0.19, r * 0.15, zf),
    ], r * 0.013, gc, 'glasses_bridge', false, 8));
    for (const s of [1, -1]) {
      skull.add(tube([
        new THREE.Vector3(s * r * 0.51, r * 0.15, zf), new THREE.Vector3(s * r * 0.86, r * 0.13, r * 0.5),
        new THREE.Vector3(s * r * 1.0, r * 0.1, r * 0.05), new THREE.Vector3(s * r * 0.98, -r * 0.05, -r * 0.18),
      ], r * 0.013, gc, 'glasses_temple', false, 12));
    }
  }

  // Traenen (optional, per Pose tearL/tearR 0..1): kleine glaenzende Tropfen
  face.tears = [];
  for (const s of [1, -1]) {
    const t = mesh(new THREE.SphereGeometry(r * 0.045, 8, 6),
      new THREE.MeshStandardMaterial({ color: '#dff3ff', roughness: 0.12, metalness: 0, emissive: '#7fbfff', emissiveIntensity: 0.35, flatShading: true }),
      'tear', { cast: false, receive: false });
    t.scale.set(0.75, 1.25, 0.6);
    t.visible = false;
    skull.add(t);
    face.tears.push({ s, mesh: t });
  }

  return face;
}

function updateMouth(face, P) {
  const r = face.r;
  const press = clamp(P.press, 0, 1);
  const smile = clamp(P.smile, -1, 1) * (1 - press * 0.6) - press * 0.08;
  const w = r * (face.F.mouthW - press * 0.05);
  const key = smile.toFixed(2) + '|' + w.toFixed(4) + '|' + press.toFixed(1);
  if (key !== face.mouthKey) {
    face.mouthKey = key;
    if (face.mouthLine) {
      face.mouthG.remove(face.mouthLine);
      face.mouthLine.geometry.dispose();
    }
    const pts = [];
    const my = r * face.F.mouthY;
    const z0 = Math.sqrt(r * r - my * my);
    for (let i = 0; i <= 8; i++) {
      const u = i / 8 * 2 - 1;
      const x = u * w;
      const y = smile * r * 0.07 * (u * u) - smile * r * 0.025;
      const z = Math.sqrt(Math.max(0, r * r - x * x - my * my)) - z0;
      pts.push(new THREE.Vector3(x, y, z));
    }
    face.mouthLine = tube(pts, r * (0.022 + press * 0.006), face.mouthColor, 'mouth_line', false, 16);
    face.mouthG.add(face.mouthLine);
  }
  let open = clamp(P.open, 0, 1);
  open = clamp(open, 0, 1);
  face.mouthOpen.visible = open > 0.06;
  face.mouthLine.visible = open <= 0.14;
  face.mouthOpen.scale.set(r * (0.15 + open * 0.03), r * Math.max(0.01, open * 0.13), 1);
  face.mouthOpen.position.y = -open * r * 0.035;
}

function updateBrowsAndTears(face, P) {
  const r = face.r;
  for (const b of face.brows) {
    const x = b.s * r * face.F.browX;
    const y = r * (face.F.browY + clamp(P.browUp, -0.5, 1.2) * 0.035 + clamp(P.browIn, -1, 1) * 0.006);
    const zz = Math.sqrt(Math.max(0, r * r - x * x - y * y));
    const n = new THREE.Vector3(x, y, zz).normalize();
    b.holder.position.copy(n.multiplyScalar(r * 1.012));
    b.holder.rotation.order = 'YXZ';
    b.holder.rotation.y = Math.atan2(x, zz);
    b.holder.rotation.x = -Math.asin(y / r);
    // browIn > 0: innere Enden hoch (weich, traurig, besorgt); < 0: zusammengezogen
    b.mesh.rotation.z = -b.s * (clamp(P.browIn, -1, 1) * 12 + (face.F.browTilt ?? 0)) * D2R;
  }
  for (const tr of face.tears) {
    const k = tr.s > 0 ? P.tearL : P.tearR;
    if (!(k > 0.001 && k < 0.999)) { tr.mesh.visible = false; continue; }
    tr.mesh.visible = true;
    const x = tr.s * r * lerp(0.4, 0.5, k);
    const y = r * lerp(0.06, -0.4, k);
    const zz = Math.sqrt(Math.max(0, r * r - x * x - y * y));
    tr.mesh.position.set(x, y, zz + r * 0.03);
    const sc = Math.min(1, k * 6) * Math.min(1, (1 - k) * 5);
    tr.mesh.scale.set(0.75 * sc + 0.01, 1.25 * sc + 0.01, 0.6 * sc + 0.01);
  }
}

// ---------------------------------------------------------------- Haare, Helm

function buildHair(skull, r, spec) {
  const color = spec.hair.color;
  const style = spec.hair.style || 'short';
  const front = spec.hair.front ?? (style === 'receding' ? 0.41 : 0.43);
  const g = new THREE.SphereGeometry(r * 1.075, 16, 9, 0, Math.PI * 2, 0, front * Math.PI);
  const hair = mesh(g, mat(color, { side: THREE.DoubleSide }), 'hair', { cast: true, receive: false });
  hair.rotation.x = -0.42;
  hair.scale.set(1.0, 1.04, 1.0);
  skull.add(hair);
  // Haarbuescheln (wehen im Fahrtwind, Pose-Parameter "wind")
  const tufts = [];
  const nTop = spec.hair.tuft === true ? 3 : Math.min(3, spec.hair.tuft || 0);
  const ids = [...Array(nTop).keys(), ...[3, 4].slice(0, spec.hair.tuftBack || 0)];
  for (const i of ids) {
    const piv = new THREE.Group();
    piv.name = 'hair_tuft_pivot';
    const a = -0.5 + (i % 3) * 0.5;
    const back = i >= 3;
    piv.position.set(Math.sin(a) * r * 0.35, r * (back ? 0.85 : 1.0), back ? -r * 0.5 : r * 0.22 + Math.cos(a) * r * 0.05);
    const baseX = back ? -0.9 : 0.6;
    piv.rotation.set(baseX, 0, -a * 0.8);
    const t = mesh(new THREE.ConeGeometry(r * 0.13, r * 0.3, 5), mat(color), 'hair_tuft', { cast: true, receive: false });
    t.position.y = r * 0.1;
    piv.add(t);
    skull.add(piv);
    tufts.push({ piv, baseX, baseZ: -a * 0.8, i });
  }
  return tufts;
}

function buildHelmet(skull, r, color) {
  const h = new THREE.Group();
  h.name = 'helmet';
  const g = new THREE.SphereGeometry(r * 1.13, 14, 7, 0, Math.PI * 2, 0, 0.4 * Math.PI);
  const shell = mesh(g, mat(color, { side: THREE.DoubleSide }), 'helmet_shell', { cast: true, receive: false });
  shell.scale.set(1, 0.88, 1.1);
  h.add(shell);
  for (let i = -1; i <= 1; i++) {
    const v = mesh(new THREE.BoxGeometry(r * 0.09, r * 0.05, r * 0.9), mat('#1d2b4a'), 'helmet_vent', { cast: false, receive: false });
    v.position.set(i * r * 0.3, r * 0.97, -r * 0.05);
    v.rotation.z = -i * 0.28;
    h.add(v);
  }
  h.position.y = r * 0.15;
  h.rotation.x = -0.3;
  skull.add(h);
  for (const s of [1, -1]) {
    skull.add(tube([
      new THREE.Vector3(s * r * 1.0, r * 0.32, -r * 0.3), new THREE.Vector3(s * r * 0.97, -r * 0.25, -r * 0.24),
      new THREE.Vector3(s * r * 0.62, -r * 0.82, -r * 0.02), new THREE.Vector3(0, -r * 0.99, r * 0.1),
    ], r * 0.02, '#2a2a2e', 'helmet_strap', false, 12));
  }
}

// ---------------------------------------------------------------- Figur

export class Character {
  constructor(id, spec) {
    this.id = id;
    this.spec = spec;
    const B = { ...BUILDS[spec.build || 'adult'] };
    if (spec.scale) for (const k of Object.keys(B)) if (typeof B[k] === 'number') B[k] *= spec.scale;
    this.B = B;
    const skin = spec.skin;
    const top = spec.top || { type: 'sweater', color: '#777' };
    const bottom = spec.bottom || { type: 'jeans', color: '#334' };
    const topColor = top.color, botColor = bottom.color;

    this.root = group('char_' + id, null);
    this.body = group('body', this.root);
    const shoeH = B.shoe[1];
    this.hipY = shoeH + B.shin + B.thigh;

    // Becken
    this.pelvis = group('pelvis', this.body, 0, this.hipY, 0);
    const pel = mesh(new RoundedBoxGeometry(B.rBot * 2.05, 0.13 * (B.thigh / 0.36), B.rBot * 2 * B.depth * 1.05, 1, 0.03), mat(botColor), 'pelvis_mesh');
    pel.position.y = 0.015;
    this.pelvis.add(pel);

    // Beine
    this.legs = {};
    for (const s of [1, -1]) {
      const L = s > 0 ? 'L' : 'R';
      const hip = group('hip_' + L, this.pelvis, s * B.hipX, 0, 0);
      const longPants = bottom.type !== 'shorts';
      hip.add(limbCyl(B.thighR * 1.05, B.thighR * 0.92, B.thigh + 0.02, botColor, 'thigh'));
      if (!longPants) {
        // Shorts: Hosenbein etwas weiter, darunter Haut
        hip.children[0].scale.set(1.12, 0.74, 1.12);
      }
      const knee = group('knee_' + L, hip, 0, -B.thigh, 0);
      knee.add(ball(B.shinR * 1.05, longPants ? botColor : skin, 'knee_ball', 7));
      if (!longPants) {
        const skinThigh = limbCyl(B.thighR * 0.9, B.shinR * 1.02, B.thigh * 0.33, skin, 'thigh_skin');
        skinThigh.position.y = B.thigh * 0.31;
        knee.add(skinThigh);
      }
      knee.add(limbCyl(B.shinR, B.shinR * 0.85, B.shin, longPants ? botColor : skin, 'shin'));
      if (!longPants && spec.socks) {
        const sock = limbCyl(B.shinR * 0.95, B.shinR * 0.9, B.shin * 0.22, spec.socks, 'sock');
        sock.position.y = -B.shin * 0.78;
        knee.add(sock);
      }
      const ankle = group('ankle_' + L, knee, 0, -B.shin, 0);
      const shoe = mesh(new RoundedBoxGeometry(B.shoe[0], B.shoe[1] * 1.15, B.shoe[2], 2, B.shoe[1] * 0.4), mat(spec.shoes || '#5a3b26'), 'shoe');
      shoe.position.set(0, -B.shoe[1] * 0.5 + 0.004, B.shoe[2] * 0.22);
      ankle.add(shoe);
      if (spec.shoeSole) {
        const sole = mesh(new THREE.BoxGeometry(B.shoe[0] * 1.02, B.shoe[1] * 0.25, B.shoe[2] * 0.98), mat(spec.shoeSole), 'shoe_sole');
        sole.position.set(0, -B.shoe[1] * 0.92, B.shoe[2] * 0.22);
        ankle.add(sole);
      }
      this.legs[L] = { hip, knee, ankle };
    }

    // Rumpf (leicht konisch, oben breiter)
    this.spine = group('spine', this.pelvis, 0, 0.05 * (B.thigh / 0.36), 0);
    const low = mesh(new THREE.CylinderGeometry(B.rMid, B.rBot, B.torsoLow, 9), mat(topColor), 'torso_low');
    low.scale.z = B.depth;
    low.position.y = B.torsoLow / 2;
    this.spine.add(low);
    const waist = mesh(new THREE.SphereGeometry(B.rMid * 0.9, 9, 6), mat(topColor), 'waist_joint');
    waist.scale.set(1, 0.55, B.depth);
    waist.position.y = B.torsoLow;
    this.spine.add(waist);
    this.chest = group('chest', this.spine, 0, B.torsoLow, 0);
    const up = mesh(new THREE.CylinderGeometry(B.rTop, B.rMid, B.torsoUp, 9), mat(topColor), 'torso_up');
    up.scale.z = B.depth;
    up.position.y = B.torsoUp / 2;
    this.chest.add(up);
    // Bund / Saum
    if (top.type !== 'tshirt') {
      const hem = mesh(new THREE.CylinderGeometry(B.rBot * 1.03, B.rBot * 1.035, 0.04 * (B.thigh / 0.36), 9), mat(shade(topColor, 0.86)), 'hem');
      hem.scale.z = B.depth * 1.02;
      hem.position.y = 0.012;
      this.spine.add(hem);
    }

    // Kleidungsdetails
    const collar = mesh(new THREE.TorusGeometry(B.neckR * 1.15, B.neckR * 0.32, 5, 10), mat(shade(topColor, 0.85)), 'collar');
    collar.rotation.x = Math.PI / 2;
    collar.scale.y = B.depth * 1.4;
    collar.position.y = B.torsoUp - 0.004;
    this.chest.add(collar);
    if (top.type === 'hoodie') {
      const hood = mesh(new THREE.SphereGeometry(B.rTop * 0.62, 10, 6), mat(shade(topColor, 0.9)), 'hood');
      hood.scale.set(1.25, 0.55, 0.75);
      hood.position.set(0, B.torsoUp - 0.01, -B.rTop * B.depth * 0.62);
      hood.rotation.x = -0.35;
      this.chest.add(hood);
      const pocket = mesh(new RoundedBoxGeometry(B.rMid * 1.15, B.torsoLow * 0.55, 0.03, 1, 0.01), mat(shade(topColor, 0.9)), 'hoodie_pocket');
      pocket.position.set(0, B.torsoLow * 0.42, B.rMid * B.depth * 0.98);
      this.spine.add(pocket);
      for (const s of [1, -1]) {
        const str = mesh(new THREE.CylinderGeometry(0.006, 0.006, B.torsoUp * 0.45, 4), mat('#f2efe8'), 'hoodie_string', { cast: false });
        str.position.set(s * 0.045, B.torsoUp * 0.72, B.rTop * B.depth * 0.95);
        this.chest.add(str);
      }
    }

    // Arme
    this.arms = {};
    const sleeveLong = top.type !== 'tshirt';
    for (const s of [1, -1]) {
      const L = s > 0 ? 'L' : 'R';
      const sh = group('shoulder_' + L, this.chest, s * B.shoulderX, B.torsoUp - B.armR * 1.25, 0);
      sh.rotation.order = 'XZY';
      sh.add(ball(B.armR * 1.15, topColor, 'shoulder_ball', 8));
      if (sleeveLong) {
        sh.add(limbCyl(B.armR, B.armR * 0.94, B.upperArm, topColor, 'upper_arm'));
      } else {
        const sleeve = limbCyl(B.armR * 1.22, B.armR * 1.18, B.upperArm * 0.48, topColor, 'sleeve');
        sh.add(sleeve);
        sh.add(limbCyl(B.armR * 0.9, B.armR * 0.85, B.upperArm, skin, 'upper_arm'));
      }
      const elbow = group('elbow_' + L, sh, 0, -B.upperArm, 0);
      elbow.add(ball(B.foreR * 1.08, sleeveLong ? topColor : skin, 'elbow_ball', 7));
      elbow.add(limbCyl(B.foreR, B.foreR * 0.9, B.foreArm, sleeveLong ? topColor : skin, 'forearm'));
      if (sleeveLong) {
        const cuff = limbCyl(B.foreR * 1.02, B.foreR * 1.0, B.foreArm * 0.16, shade(topColor, 0.86), 'cuff');
        cuff.position.y = -B.foreArm * 0.84;
        elbow.add(cuff);
      }
      const wrist = group('wrist_' + L, elbow, 0, -B.foreArm, 0);
      wrist.rotation.order = 'YXZ';
      const hand = new THREE.Group();
      hand.name = 'hand_' + L;
      wrist.add(hand);
      const [ht, hl, hw] = B.hand;
      const mitten = mesh(new RoundedBoxGeometry(ht, hl, hw, 2, ht * 0.45), mat(skin), 'mitten');
      mitten.position.y = -hl * 0.5;
      hand.add(mitten);
      const thumbPivot = group('thumb_pivot', hand, -s * ht * 0.05, -hl * 0.18, hw * 0.4);
      const thumb = mesh(new THREE.CapsuleGeometry(ht * 0.32, hl * 0.32, 2, 6), mat(skin), 'thumb');
      thumb.position.y = -hl * 0.22;
      thumbPivot.add(thumb);
      this.arms[L] = { sh, elbow, wrist, hand, thumbPivot, s };
    }

    // Hals und Kopf
    const neck = mesh(new THREE.CylinderGeometry(B.neckR, B.neckR * 1.08, B.neck + 0.05, 8), mat(skin), 'neck');
    neck.position.y = B.torsoUp + (B.neck + 0.05) / 2 - 0.03;
    this.chest.add(neck);
    this.headPivot = group('head_pivot', this.chest, 0, B.torsoUp + B.neck, 0);
    this.headPivot.rotation.order = 'YXZ';
    const r = B.head;
    this.skull = group('skull', this.headPivot, 0, r * 0.88, r * 0.02);
    this.face = buildFace(this.skull, r, { ...spec, hair: spec.hair || { color: '#333' } }, DEFAULT_POSE);
    this.tufts = buildHair(this.skull, r, { ...spec, hair: spec.hair || { color: '#333' } });
    if (spec.helmet) buildHelmet(this.skull, r, spec.helmet);

    this.root.traverse((o) => { o.userData.actor = id; });
    this._v = new THREE.Vector3();
    this.stoop = spec.stoop || 0;
    this.applyPose({ ...DEFAULT_POSE });
  }

  // Grundhaltung aus Parametern (Grad) setzen
  applyPose(P, time = 0) {
    const st = this.stoop;
    const b = this.body;
    const breath = Math.sin(time * Math.PI * 2 * (0.24 + 0.3 * clamp(P.breath - 1, 0, 1))) * 0.004 * P.breath;
    b.position.y = P.y || 0;
    this.pelvis.rotation.set(0, 0, 0);
    this.spine.rotation.set((P.lean + st * 3) * D2R, P.twist * 0.5 * D2R, P.side * D2R);
    this.chest.rotation.set((P.spine + st * 9) * D2R + breath * 2, P.twist * 0.5 * D2R, 0);
    this.chest.scale.set(1 + breath * 1.5, 1 + breath, 1 + breath * 2);
    this.headPivot.rotation.set((P.headPitch - st * 8) * D2R, P.headYaw * D2R, P.headRoll * D2R);
    this.headPivot.position.z = st * 0.02;
    for (const L of ['L', 'R']) {
      const a = this.arms[L];
      const s = a.s;
      a.sh.quaternion.identity();
      a.sh.rotation.set(-(P['sh' + L] + st * 6) * D2R, P['tw' + L] * D2R, s * P['ab' + L] * D2R);
      a.elbow.rotation.set(-P['el' + L] * D2R, 0, 0);
      a.wrist.rotation.set(-P['wr' + L] * D2R, P['wt' + L] * D2R, 0);
      a.thumbPivot.rotation.set(0.35 - P['thumb' + L] * 0.25, 0, -s * (0.25 + P['thumb' + L] * 0.7));
      const lg = this.legs[L];
      lg.hip.rotation.set(-P['hip' + L] * D2R, 0, s * (P['hipAb' + L] || 0) * D2R);
      lg.knee.rotation.set(P['knee' + L] * D2R, 0, 0);
      lg.ankle.rotation.set((P['hip' + L] - P['knee' + L]) * D2R * 0.85, 0, 0);
    }
    // Haare im Wind
    if (this.tufts) for (const tf of this.tufts) {
      const w = P.wind || 0;
      tf.piv.rotation.x = tf.baseX - w * 0.5 + w * 0.32 * Math.sin(time * 23 + tf.i * 1.7) + w * 0.12 * Math.sin(time * 41 + tf.i);
      tf.piv.rotation.z = tf.baseZ + w * 0.2 * Math.sin(time * 17 + tf.i * 2.3);
    }
    // Gesicht
    const talk = P.talk > 0 ? P.talk * (0.35 + 0.3 * Math.sin(time * 19.0) + 0.25 * Math.sin(time * 7.3 + 1.1)) : 0;
    updateMouth(this.face, { ...P, open: clamp(P.open + Math.max(0, talk), 0, 1) });
    updateBrowsAndTears(this.face, P);
  }

  // Zwei-Knochen-IK. target in Welt-Koordinaten. Ellbogen/Knie zeigt Richtung pole (lokal zur Elternachse).
  solveLimb(kind, L, targetWorld, w, poleLocal) {
    if (!(w > 0.001)) return;
    const isArm = kind === 'arm';
    const limb = isArm ? this.arms[L] : this.legs[L];
    const j1 = isArm ? limb.sh : limb.hip;
    const j2 = isArm ? limb.elbow : limb.knee;
    const a = isArm ? this.B.upperArm : this.B.thigh;
    const bLen = isArm ? this.B.foreArm : this.B.shin;
    const sgn = isArm ? 1 : -1;
    const parent = j1.parent;
    parent.updateWorldMatrix(true, false);
    const inv = new THREE.Matrix4().copy(parent.matrixWorld).invert();
    const S = j1.position.clone();
    const T = targetWorld.clone().applyMatrix4(inv);
    // Skalierung des Elternknotens (Atmen) ignorierbar klein
    let d = T.clone().sub(S);
    let dist = d.length();
    const maxD = (a + bLen) * 0.999, minD = Math.abs(a - bLen) + 0.01;
    if (dist > maxD) { d.multiplyScalar(maxD / dist); dist = maxD; }
    if (dist < minD) { d.multiplyScalar(minD / Math.max(dist, 1e-5)); dist = minD; }
    const n = d.clone().normalize();
    const p = poleLocal.clone().normalize();
    const m = p.clone().sub(n.clone().multiplyScalar(p.dot(n)));
    if (m.lengthSq() < 1e-8) m.set(0, 0, -sgn);
    m.normalize();
    const cosA = clamp((a * a + dist * dist - bLen * bLen) / (2 * a * dist), -1, 1);
    const sinA = Math.sqrt(1 - cosA * cosA);
    const E = S.clone().add(n.clone().multiplyScalar(a * cosA)).add(m.clone().multiplyScalar(a * sinA));
    const Tc = S.clone().add(d);
    const u = E.clone().sub(S).normalize();
    const f = Tc.clone().sub(E).normalize();
    let wv = f.clone().sub(u.clone().multiplyScalar(f.dot(u)));
    if (wv.lengthSq() < 1e-8) wv = m.clone().multiplyScalar(-1);
    wv.normalize();
    const bend = Math.acos(clamp(u.dot(f), -1, 1));
    const ey = u.clone().multiplyScalar(-1);
    const ez = wv.clone().multiplyScalar(sgn);
    const ex = new THREE.Vector3().crossVectors(ey, ez).normalize();
    const M = new THREE.Matrix4().makeBasis(ex, ey, ez);
    const q = new THREE.Quaternion().setFromRotationMatrix(M);
    j1.quaternion.slerp(q, clamp(w, 0, 1));
    const fk = j2.rotation.x;
    j2.rotation.x = lerp(fk, -sgn * bend, clamp(w, 0, 1));
    if (!isArm) {
      // Fuss waagerecht halten
      this.root.updateWorldMatrix(true, true);
    }
  }

  // Kopf schaut zu einem Weltpunkt
  lookAt(targetWorld, w) {
    if (!(w > 0.001)) return;
    const parent = this.headPivot.parent;
    parent.updateWorldMatrix(true, false);
    const inv = new THREE.Matrix4().copy(parent.matrixWorld).invert();
    const T = targetWorld.clone().applyMatrix4(inv).sub(this.headPivot.position);
    T.y -= this.B.head * 0.9;
    const yaw = clamp(Math.atan2(T.x, T.z), -75 * D2R, 75 * D2R);
    const pitch = clamp(-Math.atan2(T.y, Math.hypot(T.x, T.z)), -45 * D2R, 45 * D2R);
    const r = this.headPivot.rotation;
    r.y = lerp(r.y, yaw, w);
    r.x = lerp(r.x, pitch, w);
  }

  // Fuesse nach IK waagerecht ausrichten
  levelFeet() {
    for (const L of ['L', 'R']) {
      const lg = this.legs[L];
      lg.ankle.rotation.set(0, 0, 0);
      lg.ankle.updateWorldMatrix(true, false);
      const q = new THREE.Quaternion();
      lg.ankle.getWorldQuaternion(q);
      const rootQ = new THREE.Quaternion();
      this.root.getWorldQuaternion(rootQ);
      const rel = q.clone().premultiply(rootQ.clone().invert());
      lg.ankle.quaternion.copy(rel.invert());
    }
  }

  // Ankerpunkte fuer Kamera, Fokus und Blickrichtung
  anchor(name, out = new THREE.Vector3()) {
    this.root.updateWorldMatrix(true, true);
    const r = this.B.head;
    switch (name) {
      case 'head': return this.skull.localToWorld(out.set(0, 0, 0));
      case 'face': return this.skull.localToWorld(out.set(0, 0, r));
      case 'chest': return this.chest.localToWorld(out.set(0, this.B.torsoUp * 0.5, 0));
      case 'pelvis': return this.pelvis.localToWorld(out.set(0, 0, 0));
      case 'handL': return this.arms.L.hand.localToWorld(out.set(0, -this.B.hand[1] * 0.5, 0));
      case 'handR': return this.arms.R.hand.localToWorld(out.set(0, -this.B.hand[1] * 0.5, 0));
      case 'root': return this.root.localToWorld(out.set(0, 0, 0));
      // Ruecken (fuer Umarmungen): links/rechts aus Sicht der Figur
      case 'backL': return this.chest.localToWorld(out.set(this.B.rTop * 0.55, this.B.torsoUp * 0.55, -this.B.rTop * this.B.depth * 1.15));
      case 'backR': return this.chest.localToWorld(out.set(-this.B.rTop * 0.55, this.B.torsoUp * 0.55, -this.B.rTop * this.B.depth * 1.15));
      case 'shoulderL': return this.arms.L.sh.localToWorld(out.set(0, 0.04, 0));
      case 'shoulderR': return this.arms.R.sh.localToWorld(out.set(0, 0.04, 0));
      default: throw new Error('Unbekannter Anker ' + name + ' an ' + this.id);
    }
  }
}

export { BUILDS };
