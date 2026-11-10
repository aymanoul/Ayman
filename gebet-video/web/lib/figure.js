// Low-Poly-Figur mit Gelenken.
// FESTE REGEL: KEINE AUGEN – die Augenpartie ist glatte Haut. In dieser Datei gibt es bewusst
// kein Bauteil für Augen, Lider, Wimpern oder Ähnliches. Augenbrauen sind nur eine abschaltbare
// Variante (Standard: aus).
// Die Figur blickt in +z, ihre linke Seite ist +x. Einheiten: Meter (vor der Skalierung).
import * as THREE from 'three';
import { kufiTexture, blobShadow } from './textures.js';

const V3 = THREE.Vector3;
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const flat = (color, extra = {}) =>
  new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.85, metalness: 0, ...extra });
const box = (x, y, z) => new THREE.BoxGeometry(x, y, z);

function mesh(geo, mat, parent, pos, rot) {
  const m = new THREE.Mesh(geo, mat);
  if (pos) m.position.set(...pos);
  if (rot) m.rotation.set(...rot);
  m.castShadow = true;
  m.receiveShadow = true;
  parent.add(m);
  return m;
}
function joint(parent, pos) {
  const j = new THREE.Group();
  if (pos) j.position.set(...pos);
  parent.add(j);
  return j;
}

// Mantel aus übereinanderliegenden Ellipsen (kantig, flach schattiert). Verformbar pro Bild.
// rings: von oben nach unten [{y, rx, rz, w}]  (w = Gewicht für Verformung, 0 = fest)
function ringBody(rings, seg, { pleat = 0, capTop = true, capBottom = true } = {}) {
  const nR = rings.length;
  const count = nR * seg + 2;
  const pos = new Float32Array(count * 3);
  const idx = [];
  for (let i = 0; i < nR - 1; i++) {
    for (let j = 0; j < seg; j++) {
      const a = i * seg + j, b = i * seg + ((j + 1) % seg), c = (i + 1) * seg + ((j + 1) % seg), d = (i + 1) * seg + j;
      idx.push(a, b, c, a, c, d);
    }
  }
  const top = nR * seg, bot = nR * seg + 1;
  for (let j = 0; j < seg; j++) {
    const j2 = (j + 1) % seg;
    if (capTop) idx.push(top, j2, j);
    if (capBottom) idx.push(bot, (nR - 1) * seg + j, (nR - 1) * seg + j2);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setIndex(idx);
  const v = new V3();
  function update(deform) {
    for (let i = 0; i < nR; i++) {
      const r = rings[i];
      for (let j = 0; j < seg; j++) {
        const th = (j / seg) * Math.PI * 2 + Math.PI / seg;
        const pl = 1 + pleat * (r.w || 0) * (j % 2 ? 1 : -1);
        v.set(r.rx * pl * Math.cos(th), r.y, r.rz * pl * Math.sin(th) + (r.z || 0));
        if (deform) deform(v, r, Math.cos(th), Math.sin(th));
        pos.set([v.x, v.y, v.z], (i * seg + j) * 3);
      }
    }
    for (const [k, i] of [[top, 0], [bot, nR - 1]]) {
      let x = 0, z = 0;
      for (let j = 0; j < seg; j++) { x += pos[(i * seg + j) * 3]; z += pos[(i * seg + j) * 3 + 2]; }
      pos.set([x / seg, rings[i].y, z / seg], k * 3);
    }
    geo.attributes.position.needsUpdate = true;
  }
  update();
  geo.computeBoundingSphere();
  geo.boundingSphere.radius *= 1.6;
  return { geo, update };
}

export const HAND = {
  open: { curl: 0.07, spread: 1, thumb: 0 },
  flat: { curl: 0.03, spread: 0.1, thumb: 0.15 },
  relaxed: { curl: 0.4, spread: 0.3, thumb: 0.25 },
  hold: { curl: 0.82, spread: 0, thumb: 0.5 },
  fist: { curl: 1, spread: 0, thumb: 1 },
};

function buildHand(parent, s, skin) {
  const g = joint(parent);                       // sitzt am Handgelenk, Hand zeigt nach -y
  mesh(box(0.032, 0.088, 0.084), skin, g, [0, -0.046, 0]);
  const fingers = [];
  const lens = [0.07, 0.078, 0.072, 0.058];
  for (let i = 0; i < 4; i++) {
    const b = joint(g, [0, -0.09, 0.0315 - i * 0.021]);
    mesh(box(0.027, lens[i] * 0.56, 0.0188), skin, b, [0, -lens[i] * 0.27, 0]);
    const m = joint(b, [0, -lens[i] * 0.55, 0]);
    mesh(box(0.025, lens[i] * 0.46, 0.0176), skin, m, [0, -lens[i] * 0.22, 0]);
    fingers.push([b, m]);
  }
  const tb = joint(g, [0, -0.028, 0.044]);
  mesh(box(0.027, 0.052, 0.025), skin, tb, [0, -0.026, 0]);
  const tm = joint(tb, [0, -0.05, 0]);
  mesh(box(0.025, 0.04, 0.023), skin, tm, [0, -0.02, 0]);
  function set(p) {
    const h = typeof p === 'string' ? HAND[p] : p;
    fingers.forEach(([b, m], i) => {
      b.rotation.set((1.5 - i) * h.spread * 0.11, 0, -s * h.curl * (1.35 + i * 0.05));
      m.rotation.set(0, 0, -s * h.curl * 1.5);
    });
    tb.rotation.set(-0.75 + h.thumb * 0.45, 0, -s * h.thumb * 0.95);
    tm.rotation.set(0, 0, -s * h.thumb * 0.6);
  }
  set('relaxed');
  return { group: g, set };
}

export function createFigure(o = {}) {
  const opt = {
    qamis: '#f4f2ec', skin: '#c99468', hair: '#1d1715',
    beard: 'full',          // 'full' | 'short' | 'none'
    beardLen: null,         // überschreibt die Länge (0.1 kurz … 0.7 lang)
    kufi: true, brows: false, height: 0.92, headScale: 1.34,
    shoes: '#3a2b22', sole: '#1d1814', socks: '#e9e6df',
    footwear: 'shoes',      // 'shoes' | 'socks'
    ...o,
  };
  const qc = new THREE.Color(opt.qamis);
  const M = {
    qamis: flat(opt.qamis, { side: THREE.DoubleSide }),
    qamisDark: flat(qc.clone().multiplyScalar(0.84)),
    qamisIn: flat(qc.clone().multiplyScalar(0.55)),
    skin: flat(opt.skin),
    hair: flat(opt.hair, { roughness: 0.95, side: THREE.DoubleSide }),
    mouth: flat('#4a1d1a'),
    teeth: flat('#f5f1e8'),
    tongue: flat('#c9656a'),
    shoes: flat(opt.shoes),
    sole: flat(opt.sole),
    socks: flat(opt.socks),
    button: flat(qc.clone().multiplyScalar(0.72).lerp(new THREE.Color('#ffffff'), 0.25)),
  };

  const root = new THREE.Group();
  const shadow = blobShadow(1.15, 0.95);
  root.add(shadow);
  const body = joint(root);                   // wippt beim Gehen, sinkt beim Sitzen
  const J = { root, body };

  // ---------------------------------------------------------------- Unterteil des Qamis
  const HIP = 0.86, HEM = 0.07;
  J.hips = joint(body, [0, HIP, 0]);
  const skirtRings = [
    { y: 0, rx: 0.205, rz: 0.15, w: 0 },
    { y: -0.2, rx: 0.218, rz: 0.163, w: 0.2 },
    { y: -0.48, rx: 0.246, rz: 0.186, w: 0.6 },
    { y: -(HIP - HEM), rx: 0.285, rz: 0.215, w: 1 },
  ];
  const skirt = ringBody(skirtRings, 12, { pleat: 0.035, capTop: true, capBottom: true });
  const skirtMesh = mesh(skirt.geo, M.qamis, J.hips);
  // Sitzform: Schneidersitz unter dem Qamis – Oberschenkel nach außen, Unterschenkel gekreuzt, Stoff darüber
  const lap = joint(J.hips);
  {
    const FL = -0.205;                                   // Boden relativ zur Hüfte
    const limb = (a, b, r1, r2, mat = M.qamis) => {
      const va = new V3(...a), vb = new V3(...b), d = vb.clone().sub(va);
      const m = mesh(new THREE.CylinderGeometry(r2, r1, d.length(), 7, 1), mat, lap, va.clone().add(vb).multiplyScalar(0.5).toArray());
      m.quaternion.setFromUnitVectors(new V3(0, 1, 0), d.normalize());
      return m;
    };
    const base = mesh(new THREE.IcosahedronGeometry(1, 1), M.qamis, lap, [0, FL + 0.115, -0.03]);
    base.scale.set(0.235, 0.125, 0.19);
    for (const s of [1, -1]) {
      const knee = [s * 0.37, FL + 0.105, 0.27];
      limb([s * 0.1, FL + 0.115, 0.0], knee, 0.115, 0.095);
      mesh(new THREE.IcosahedronGeometry(0.097, 1), M.qamis, lap, knee);
      limb(knee, [-s * 0.07, FL + 0.075 + (s > 0 ? 0.02 : 0), 0.36], 0.09, 0.07);
      mesh(box(0.085, 0.06, 0.13), M.socks, lap, [-s * 0.13, FL + 0.05, 0.36], [0, s * 1.1, 0]);
    }
    // Stoff zwischen den Knien
    const P = [[0, -0.005, 0.13], [0.17, -0.01, -0.02], [0.4, FL + 0.19, 0.25], [0.2, FL + 0.15, 0.43], [-0.2, FL + 0.15, 0.43], [-0.4, FL + 0.19, 0.25], [-0.17, -0.01, -0.02]];
    const tri = [];
    for (let i = 1; i < P.length; i++) { const n = i === P.length - 1 ? 1 : i + 1; tri.push(...P[0], ...P[n], ...P[i]); }
    const ag = new THREE.BufferGeometry();
    ag.setAttribute('position', new THREE.Float32BufferAttribute(tri, 3));
    ag.computeVertexNormals();
    mesh(ag, M.qamis, lap);
  }
  lap.visible = false;

  // ---------------------------------------------------------------- Füße (Schuhe / Socken)
  function foot(s) {
    const f = joint(body, [s * 0.098, 0, 0.05]);
    const shoes = joint(f), socks = joint(f);
    mesh(box(0.1, 0.022, 0.26), M.sole, shoes, [0, 0.011, 0.02]);
    mesh(box(0.094, 0.06, 0.15), M.shoes, shoes, [0, 0.052, -0.03]);
    mesh(box(0.09, 0.042, 0.11), M.shoes, shoes, [0, 0.041, 0.092], [0.22, 0, 0]);
    mesh(box(0.088, 0.07, 0.13), M.socks, socks, [0, 0.036, -0.03]);
    mesh(box(0.084, 0.05, 0.11), M.socks, socks, [0, 0.026, 0.082], [0.12, 0, 0]);
    return { f, shoes, socks };
  }
  const feet = { L: foot(1), R: foot(-1) };
  J.footL = feet.L.f; J.footR = feet.R.f;

  // ---------------------------------------------------------------- Oberkörper
  J.spine = joint(J.hips);
  const SH = 0.462;                                  // Schulterhöhe über der Hüfte
  const torso = ringBody([
    { y: 0.6, rx: 0.07, rz: 0.066, z: 0.005 },
    { y: 0.56, rx: 0.105, rz: 0.09 },
    { y: 0.505, rx: 0.2, rz: 0.14 },
    { y: 0.45, rx: 0.232, rz: 0.152 },
    { y: 0.34, rx: 0.232, rz: 0.158 },
    { y: 0.12, rx: 0.203, rz: 0.147 },
    { y: -0.05, rx: 0.196, rz: 0.142 },
  ], 12);
  mesh(torso.geo, M.qamis, J.spine);
  // Hemdkragen: Stehkragen + zwei Kragenspitzen, Knopfleiste mit Knöpfen, Brusttasche
  mesh(new THREE.CylinderGeometry(0.068, 0.074, 0.04, 8, 1, true), M.qamisDark, J.spine, [0, 0.605, 0.004]);
  for (const s of [1, -1]) {
    const cg = new THREE.BufferGeometry();
    const a = [0, 0.02, 0.01], b = [s * 0.062, 0.025, -0.016], c = [s * 0.045, -0.045, 0.012], d = [0.004 * s, -0.012, 0.016];
    cg.setAttribute('position', new THREE.Float32BufferAttribute(s > 0 ? [...a, ...c, ...b, ...a, ...d, ...c] : [...a, ...b, ...c, ...a, ...c, ...d], 3));
    cg.computeVertexNormals();
    mesh(cg, M.qamisDark, J.spine, [s * 0.004, 0.585, 0.07]);
  }
  mesh(box(0.042, 0.29, 0.012), M.qamisDark, J.spine, [0, 0.4, 0.152], [0.035, 0, 0]);
  for (let i = 0; i < 3; i++) mesh(box(0.015, 0.015, 0.01), M.button, J.spine, [0, 0.5 - i * 0.095, 0.16 - i * 0.002]);
  mesh(box(0.085, 0.095, 0.01), M.qamisDark, J.spine, [0.112, 0.35, 0.134], [0, 0.52, 0]);

  // ---------------------------------------------------------------- Arme
  const L1 = 0.29, L2 = 0.285;
  const hands = {};
  function arm(side) {
    const s = side === 'L' ? 1 : -1;
    const sh = joint(J.spine, [s * 0.228, SH, 0]);
    sh.rotation.order = 'XZY';              // x: vor/zurück, z: abspreizen, y: Drehung um die Armachse
    mesh(new THREE.IcosahedronGeometry(0.06, 1), M.qamis, sh, [-s * 0.02, -0.014, 0]);
    mesh(new THREE.CylinderGeometry(0.064, 0.058, L1, 6, 1), M.qamis, sh, [0, -L1 / 2, 0]);
    const el = joint(sh, [0, -L1, 0]);
    mesh(new THREE.IcosahedronGeometry(0.06, 0), M.qamis, el);
    mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.245, 6, 1), M.qamis, el, [0, -0.1225, 0]);
    mesh(new THREE.CylinderGeometry(0.054, 0.054, 0.05, 6, 1), M.qamisDark, el, [0, -0.258, 0]);   // Manschette
    mesh(box(0.012, 0.012, 0.008), M.button, el, [s * 0.05, -0.258, 0.02]);
    const wr = joint(el, [0, -L2, 0]);
    wr.rotation.order = 'YXZ';              // y: Unterarm-Drehung (Handfläche ausrichten), x: beugen, z: kippen
    hands[side] = buildHand(wr, s, M.skin);
    J['shoulder' + side] = sh; J['elbow' + side] = el; J['wrist' + side] = wr;
  }
  arm('L'); arm('R');

  // ---------------------------------------------------------------- Hals und Kopf
  J.neck = joint(J.spine, [0, 0.6, 0.004]);
  mesh(new THREE.CylinderGeometry(0.054, 0.06, 0.1, 7, 1), M.skin, J.neck, [0, 0.03, 0]);
  J.head = joint(J.neck, [0, 0.07, 0]);
  J.head.scale.setScalar(opt.headScale);
  const HR = 0.168, HC = 0.15;
  const full = opt.beard === 'full';

  const shape = (v) => {                          // Kugel mit schmalerem Kiefer
    if (v.y < 0) { const k = -v.y; v.x *= 1 - 0.3 * k; v.z *= 1 - 0.1 * k; }
    v.x *= 0.93; v.y *= 1.1;
    return v;
  };
  // Schale aus der Kopfform (Haare, Bart). f(m) > 0 heißt "gehört dazu"; Dreiecke an der Grenze
  // werden sauber abgeschnitten, damit Haaransatz und Bartkante glatte Linien sind.
  function shell(detail, f, grow, post) {
    const src = new THREE.IcosahedronGeometry(1, detail).attributes.position;
    const out = [];
    const emit = (v) => {
      const u = v.clone();
      shape(u).multiplyScalar(grow);
      if (post) post(u, v);
      out.push(u.x * HR, u.y * HR, u.z * HR);
    };
    const cut = (inside, outside) => {
      const a = inside.clone(), b = outside.clone(), m = new V3();
      for (let i = 0; i < 12; i++) { m.copy(a).add(b).normalize(); if (f(m) > 0) a.copy(m); else b.copy(m); }
      return a;
    };
    for (let i = 0; i < src.count; i += 3) {
      const vs = [0, 1, 2].map((k) => new V3().fromBufferAttribute(src, i + k).normalize());
      const ins = vs.map((v) => f(v) > 0);
      const n = ins.filter(Boolean).length;
      if (n === 0) continue;
      const poly = [];
      for (let k = 0; k < 3; k++) {
        const p = vs[k], q = vs[(k + 1) % 3];
        if (ins[k]) poly.push(p);
        if (ins[k] !== ins[(k + 1) % 3]) poly.push(ins[k] ? cut(p, q) : cut(q, p));
      }
      for (let k = 1; k < poly.length - 1; k++) { emit(poly[0]); emit(poly[k]); emit(poly[k + 1]); }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(out, 3));
    g.computeVertexNormals();
    return g;
  }

  J.skull = mesh(shell(2, () => 1, 1), M.skin, J.head, [0, HC, 0]);
  {                                                // Nase (Keil) – die Partie darüber bleibt glatte Haut
    const T = [0, 0.05, 0], BL = [-0.03, -0.04, 0], BR = [0.03, -0.04, 0], P = [0, -0.028, 0.052];
    const ng = new THREE.BufferGeometry();
    ng.setAttribute('position', new THREE.Float32BufferAttribute([...T, ...BL, ...P, ...T, ...P, ...BR, ...BL, ...BR, ...P], 3));
    ng.computeVertexNormals();
    mesh(ng, M.skin, J.head, [0, HC - 0.012, HR * 0.955]);
  }
  for (const s of [1, -1]) {
    const ear = mesh(new THREE.IcosahedronGeometry(0.042, 0), M.skin, J.head, [s * (HR * 0.92), HC - 0.02, -0.012]);
    ear.scale.set(0.42, 1.0, 0.72);
  }

  // Haare: Ansatz vorne hoch, an den Seiten über dem Ohr, im Nacken tief.
  // Mit Kufi sind Haare nur seitlich hinter den Schläfen und im Nacken sichtbar.
  const hairLine = (m) => (m.z > 0 ? 0.12 + (opt.kufi ? 0.75 : 0.52) * m.z : 0.12 + 0.95 * m.z);
  const ss = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const hairF = (m) => Math.min(m.y - hairLine(m), opt.kufi ? 0.3 - m.z : 9);
  mesh(shell(2, hairF, opt.kufi ? 1.07 : 1.045, opt.kufi ? null : (u, v) => {
    const k = ss(0.2, 0.9, v.y);                    // Seiten kurz, oben länger und leicht nach vorn
    u.y += 0.24 * k; u.z += 0.1 * k * ss(-0.5, 0.7, v.z); u.x *= 1 + 0.1 * k; u.z *= 1 + 0.06 * k;
  }), M.hair, J.head, [0, HC, 0]);
  if (opt.kufi) {
    // Ägyptische Kufi: eng anliegende, gehäkelte Kappe mit feinem Lochmuster
    const kt = kufiTexture(); kt.repeat.set(9, 3);
    const kufiMat = new THREE.MeshStandardMaterial({ color: '#ffffff', map: kt, flatShading: true, roughness: 0.92 });
    const k = joint(J.head, [0, HC + 0.062, -0.012]);
    k.rotation.x = -0.17;
    const prof = [[0.171, 0], [0.171, 0.045], [0.158, 0.088], [0.122, 0.122], [0.06, 0.139], [0.001, 0.142]].map(([r, y]) => new THREE.Vector2(r, y));
    const km = mesh(new THREE.LatheGeometry(prof, 14), kufiMat, k);
    km.scale.set(0.955, 1, 1.02);
    mesh(new THREE.CylinderGeometry(0.1655, 0.1655, 0.012, 14, 1, true), flat('#e4e1d8'), k, [0, 0.006, 0]).scale.set(0.955, 1, 1.02);
  }

  // Bart: folgt dem Kiefer (Koteletten bis zum Ohr, Wangen frei), Schnurrbart unter der Nase
  if (opt.beard !== 'none') {
    const beardLen = opt.beardLen ?? (full ? 0.5 : 0.12);
    const beardTop = (m) => {
      const ax = Math.abs(m.x);
      if (m.z < 0.02) return -9;                     // hinter dem Ohr kein Bart
      const mou = full ? -0.3 : -0.37, chk = full ? -0.56 : -0.7, top = 0.34;   // Koteletten gehen ins Haar über
      const mix = (a, b, x0, x1) => a + (b - a) * clamp((ax - x0) / (x1 - x0), 0, 1);
      if (ax < 0.22) return mou;
      if (ax < 0.42) return mix(mou, chk, 0.22, 0.42);
      if (ax < 0.78) return mix(chk, chk + 0.16, 0.42, 0.78);
      return mix(chk + 0.16, top, 0.78, 0.9);
    };
    J.beard = mesh(
      shell(3, (m) => beardTop(m) - m.y, full ? 1.07 : 1.04, (u, v) => {
        if (v.y < -0.45) { const k = ((-v.y - 0.45) / 0.55) * ss(0.05, 0.55, v.z); u.y -= beardLen * k; u.z += 0.1 * k; }   // am Kinn lang, zum Ohr hin kurz
      }),
      M.hair, J.head, [0, HC, 0],
    );
  }

  // Optional: Augenbrauen (Variante; Standard aus)
  const brows = [];
  if (opt.brows) {
    for (const s of [1, -1]) {
      const b = joint(J.head, [s * 0.06, HC + 0.052, HR * 0.9]);
      mesh(box(0.058, 0.01, 0.012), M.hair, b, null, [0, s * 0.4, -s * 0.1]);
      b.userData.s = s;
      brows.push(b);
    }
  }

  // Mund: 4 Formen (zu, halb offen, offen, Lächeln), es ist immer genau eine sichtbar
  const mouth = joint(J.head, [0, HC - HR * 0.56, HR * (full ? 0.925 : 0.856)]);
  mouth.rotation.x = 0.38;
  mouth.scale.setScalar(1.15);
  const MR = 0.1;
  const bend = (geo) => {                         // Mundteile folgen der Rundung des Gesichts
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), z = p.getZ(i), ang = x / MR;
      p.setX(i, (MR + z) * Math.sin(ang));
      p.setZ(i, (MR + z) * Math.cos(ang) - MR);
    }
    geo.computeVertexNormals();
    return geo;
  };
  const bar = (w, h, d = 0.008) => bend(new THREE.BoxGeometry(w, h, d, 6, 1, 1));
  const shapes = { closed: new THREE.Group(), half: new THREE.Group(), open: new THREE.Group(), smile: new THREE.Group() };
  mesh(bar(0.06, 0.009), M.mouth, shapes.closed);
  mesh(bar(0.056, 0.026), M.mouth, shapes.half);
  mesh(bar(0.044, 0.008, 0.009), M.teeth, shapes.half, [0, 0.008, 0.001]);
  mesh(bar(0.058, 0.05), M.mouth, shapes.open);
  mesh(bar(0.046, 0.01, 0.009), M.teeth, shapes.open, [0, 0.019, 0.001]);
  mesh(bar(0.03, 0.014, 0.009), M.tongue, shapes.open, [0, -0.017, 0.001]);
  {
    const s = new THREE.Shape();
    const top = [-0.04, -0.027, -0.013, 0, 0.013, 0.027, 0.04];
    s.moveTo(top[0], 0.012);
    for (const x of top.slice(1)) s.lineTo(x, 0.012);
    for (const x of [0.024, 0.012, 0, -0.012, -0.024]) s.lineTo(x, -0.014);
    s.closePath();
    mesh(bend(new THREE.ExtrudeGeometry(s, { depth: 0.008, bevelEnabled: false }).translate(0, 0, -0.004)), M.mouth, shapes.smile);
    mesh(bar(0.056, 0.008, 0.009), M.teeth, shapes.smile, [0, 0.007, 0.001]);
  }
  for (const k in shapes) { mouth.add(shapes[k]); shapes[k].visible = false; }
  shapes.closed.visible = true;
  const mouthBase = mouth.position.clone();

  // ---------------------------------------------------------------- Requisit: Handy (für B)
  let phone = null;
  function addPhone(side = 'R') {
    const s = side === 'L' ? 1 : -1;
    phone = joint(J['wrist' + side], [-s * 0.03, -0.1, 0.012]);
    mesh(box(0.011, 0.15, 0.074), flat('#1b1d24', { roughness: 0.4 }), phone);
    const scr = mesh(box(0.002, 0.136, 0.064), new THREE.MeshStandardMaterial({ color: '#dfeaff', emissive: '#cfe0ff', emissiveIntensity: 0.9 }), phone, [-s * 0.0062, 0, 0]);
    scr.castShadow = false;
    return phone;
  }

  // ---------------------------------------------------------------- Steuerung
  const tmp = { d: new V3(), n: new V3(), u: new V3(), e: new V3(), w: new V3(), X: new V3(), Y: new V3(), Z: new V3(), m: new THREE.Matrix4(), q: new THREE.Quaternion() };
  let seated = false;

  const fig = {
    root, J, opt, hands, HIP,
    get phone() { return phone; },
    addPhone,

    // Grundhaltung: alle Gelenke zurücksetzen (wird in jedem Bild zuerst aufgerufen)
    reset() {
      body.position.set(0, seated ? -(HIP - 0.205) : 0, 0);
      body.rotation.set(0, 0, 0);
      J.hips.rotation.set(0, 0, 0);
      J.spine.rotation.set(0.02, 0, 0); J.spine.scale.set(1, 1, 1);
      J.neck.rotation.set(0, 0, 0);
      J.head.rotation.set(0, 0, 0);
      for (const sd of ['L', 'R']) {
        const k = sd === 'L' ? 1 : -1;
        J['shoulder' + sd].position.y = SH;
        J['shoulder' + sd].rotation.set(0.05, 0, k * 0.11);
        J['elbow' + sd].rotation.set(-0.2, 0, 0);
        J['wrist' + sd].rotation.set(0, 0, 0);
        hands[sd].set('relaxed');
        J['foot' + sd].position.set(k * 0.098, 0, 0.05);
        J['foot' + sd].rotation.set(0, 0, 0);
      }
      skirt.update();
      this.setMouth('closed');
      this.setBrows(0, 0);
      return this;
    },

    setMouth(name, { skew = 0, dx = 0, dy = 0, wide = 1 } = {}) {
      for (const k in shapes) shapes[k].visible = k === name;
      mouth.position.set(mouthBase.x + dx, mouthBase.y + dy, mouthBase.z);
      mouth.rotation.z = skew;
      mouth.scale.set(1.15 * wide, 1.15, 1.15);
    },
    // amp 0..1 -> Mundform (Lippenbewegung nach Lautstärke der Stimme)
    talk(amp) { this.setMouth(amp < 0.12 ? 'closed' : amp < 0.5 ? 'half' : 'open'); },
    setBrows(raise = 0, tilt = 0) {             // nur wirksam, wenn die Variante "mit Augenbrauen" gebaut wurde
      for (const b of brows) { b.position.y = HC + 0.052 + raise * 0.018; b.rotation.z = -b.userData.s * tilt; }
    },
    setHand(side, p) { hands[side].set(p); },
    shrug(a, side) {                             // Schultern hoch (+) / hängen lassen (-)
      for (const sd of side ? [side] : ['L', 'R']) J['shoulder' + sd].position.y = SH + a * 0.045;
    },
    setFootwear(name) {
      for (const sd of ['L', 'R']) { feet[sd].shoes.visible = name === 'shoes' && !seated; feet[sd].socks.visible = name === 'socks' && !seated; }
      this.footwear = name;
    },
    setSeated(v) {
      seated = v;
      skirtMesh.visible = !v; lap.visible = v;
      shadow.scale.set(v ? 1.25 : 1, v ? 1.2 : 1, 1);
      this.setFootwear(this.footwear);
    },

    // Arm per Zielpunkt ausrichten (Zielpunkt = Handgelenk, in Koordinaten des Oberkörpers)
    reachLocal(side, target, pole) {
      const s = side === 'L' ? 1 : -1;
      const { d, n, u, e, w, X, Y, Z, m } = tmp;
      const sh = J['shoulder' + side], el = J['elbow' + side];
      d.set(target[0] ?? target.x, target[1] ?? target.y, target[2] ?? target.z).sub(sh.position);
      const dist = clamp(d.length(), Math.abs(L1 - L2) + 0.03, L1 + L2 - 0.003);
      n.copy(d).normalize();
      const A = Math.acos(clamp((L1 * L1 + dist * dist - L2 * L2) / (2 * L1 * dist), -1, 1));
      const p = pole || [s * 0.7, -1, -0.5];
      e.set(p[0], p[1], p[2]).normalize();
      e.addScaledVector(n, -e.dot(n)).normalize();
      u.copy(n).multiplyScalar(Math.cos(A)).addScaledVector(e, Math.sin(A));
      w.copy(n).multiplyScalar(dist).addScaledVector(u, -L1).normalize();
      Z.copy(w).addScaledVector(u, -w.dot(u));
      if (Z.lengthSq() < 1e-6) Z.copy(e).negate();
      Z.normalize();
      Y.copy(u).negate();
      X.crossVectors(Y, Z);
      sh.quaternion.setFromRotationMatrix(m.makeBasis(X, Y, Z));
      const flex = Math.PI - Math.acos(clamp((L1 * L1 + L2 * L2 - dist * dist) / (2 * L1 * L2), -1, 1));
      el.rotation.set(-flex, 0, 0);
    },
    // Handfläche in eine Richtung drehen (Richtung in Oberkörper-Koordinaten), z. B. [0,1,0] = nach oben
    aimPalm(side, dir) {
      const s = side === 'L' ? 1 : -1;
      root.updateWorldMatrix(true, true);
      const d = tmp.d.set(dir[0], dir[1], dir[2]).applyQuaternion(J.spine.getWorldQuaternion(tmp.q));
      d.applyQuaternion(J['elbow' + side].getWorldQuaternion(tmp.q).invert());
      J['wrist' + side].rotation.y = Math.atan2(s * d.z, -s * d.x);
    },
    // Zielpunkt in Weltkoordinaten (z. B. Schulter der anderen Figur)
    reach(side, worldTarget, pole) {
      root.updateWorldMatrix(true, true);
      const t = J.spine.worldToLocal(worldTarget.clone());
      this.reachLocal(side, t, pole);
    },
    worldPoint(jointName, local = [0, 0, 0]) {
      root.updateWorldMatrix(true, true);
      return J[jointName].localToWorld(new V3(...local));
    },
    headCenter() { return this.worldPoint('head', [0, HC, 0]); },

    // Gehen: phase läuft pro Doppelschritt um 2π. amount 0..1, hurry 0..1 (eilig: größere Schritte, Oberkörper vor)
    walk(phase, { amount = 1, hurry = 0, arms = true } = {}) {
      const s = Math.sin(phase), c = Math.cos(phase);
      const stride = (0.17 + 0.09 * hurry) * amount;
      body.position.y += (-0.024 - 0.012 * hurry) * s * s * amount;
      body.rotation.z += 0.022 * s * amount;
      J.hips.rotation.y += 0.07 * s * amount;
      J.spine.rotation.y += -0.11 * s * amount;
      J.spine.rotation.x += 0.03 + 0.1 * hurry;
      for (const [sd, k] of [['L', 1], ['R', -1]]) {
        const ft = J['foot' + sd];
        ft.position.z = 0.05 + stride * s * k;
        const lift = Math.max(0, c * k);
        ft.position.y = lift * (0.05 + 0.03 * hurry) * amount;
        ft.rotation.x = (lift * 0.35 - Math.max(0, s * k) * 0.25 * (1 - lift)) * amount;
        if (arms) {
          J['shoulder' + sd].rotation.x += (0.38 + 0.22 * hurry) * s * k * amount;
          J['elbow' + sd].rotation.x += (-0.12 - 0.5 * hurry - 0.18 * Math.max(0, -s * k)) * amount;
        }
      }
      // schwingender Saum: das vordere Bein drückt den Stoff nach vorn, der Rest zieht nach
      skirt.update((v, r, cs) => {
        const w = r.w;
        v.z += w * ((0.72 * stride) * s * Math.sign(cs) * Math.sqrt(Math.abs(cs)) - 0.035 * amount * (1 + hurry));
        v.x += w * 0.02 * c * amount;
      });
    },

    // Atmen und kleine Gewichtsverlagerung (kommt nach der Pose obendrauf)
    breathe(t, phase = 0, amount = 1) {
      const b = Math.sin(t * 1.5 + phase) * amount;
      J.spine.rotation.x += b * 0.012;
      J.spine.scale.set(1 + b * 0.006, 1, 1 + b * 0.014);
      J.spine.rotation.z += Math.sin(t * 0.6 + phase) * 0.012 * amount;
      J.hips.rotation.z += Math.sin(t * 0.6 + phase) * 0.01 * amount;
      J.head.rotation.x += Math.sin(t * 0.9 + phase) * 0.022 * amount;
      J.head.rotation.y += Math.sin(t * 0.5 + phase * 2) * 0.04 * amount;
      for (const sd of ['L', 'R']) J['shoulder' + sd].position.y += b * 0.004;
    },
    // Abwärtskompatibel zum Techniktest
    idle(t, phase = 0) { this.reset(); this.breathe(t, phase); },
  };
  fig.footwear = opt.footwear;
  fig.setFootwear(opt.footwear);
  root.scale.setScalar(opt.height);
  fig.reset();
  return fig;
}

// Person A – der Ratgeber: weißer Qamis, ägyptische Kufi, voller dunkler Bart
export function createFigureA(o = {}) {
  return createFigure({ qamis: '#f5f3ee', skin: '#c79367', hair: '#1c1614', beard: 'full', kufi: true,
    shoes: '#3a2b22', sole: '#1d1814', socks: '#eceae4', height: 0.9, ...o });
}
// Person B – der junge Mann: mittelblauer Qamis, Kurzhaarschnitt, kurzer Bart
export function createFigureB(o = {}) {
  return createFigure({ qamis: '#2f6fc4', skin: '#d19d72', hair: '#1a1513', beard: 'short', kufi: false,
    shoes: '#f1f1ee', sole: '#c9ccd2', socks: '#3b4252', height: 0.87, ...o });
}
