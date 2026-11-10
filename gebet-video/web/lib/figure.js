// Low-Poly-Figur mit Gelenken. FESTE REGEL: KEINE AUGEN – die Augenpartie ist glatte Haut.
// In dieser Datei gibt es bewusst kein Bauteil für Augen, Lider, Wimpern oder Ähnliches.
// Figur blickt in +z, ihre linke Seite ist +x. Einheiten: Meter.
import * as THREE from 'three';
import { kufiTexture, blobShadow } from './textures.js';

const flat = (color, extra = {}) =>
  new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.85, metalness: 0, ...extra });

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

export function createFigure(o = {}) {
  const opt = {
    qamis: '#f4f2ec', skin: '#c99468', hair: '#1d1715',
    beard: 'full',        // 'full' | 'short'
    kufi: true, brows: false, height: 1.0, shoes: '#e9e6df', headScale: 1.2,
    ...o,
  };
  const M = {
    qamis: flat(opt.qamis),
    qamisDark: flat(new THREE.Color(opt.qamis).multiplyScalar(0.86)),
    skin: flat(opt.skin),
    hair: flat(opt.hair, { roughness: 0.95 }),
    mouth: flat('#4a1d1a'),
    teeth: flat('#f5f1e8'),
    tongue: flat('#c9656a'),
    shoes: flat(opt.shoes),
    button: flat('#d9d5cb'),
  };

  const root = new THREE.Group();
  const body = joint(root);                 // wippt beim Gehen
  root.add(blobShadow(1.15, 0.95));         // weicher Kontaktschatten am Boden
  const J = { root, body };

  // ---- Unterteil des Qamis (verdeckt die Beine)
  const HIP = 0.95;
  J.hips = joint(body, [0, HIP, 0]);
  const skirt = mesh(new THREE.CylinderGeometry(0.2, 0.3, HIP - 0.07, 10, 2), M.qamis, J.hips, [0, -(HIP - 0.07) / 2, 0]);
  skirt.scale.z = 0.72;
  J.skirt = skirt;
  // Füße unter dem Saum
  J.footL = mesh(new THREE.BoxGeometry(0.1, 0.07, 0.24), M.shoes, body, [0.1, 0.035, 0.07]);
  J.footR = mesh(new THREE.BoxGeometry(0.1, 0.07, 0.24), M.shoes, body, [-0.1, 0.035, 0.07]);

  // ---- Oberkörper
  J.spine = joint(J.hips);
  const TORSO = 0.5;
  const torso = mesh(new THREE.CylinderGeometry(0.215, 0.2, TORSO, 10, 1), M.qamis, J.spine, [0, TORSO / 2, 0]);
  torso.scale.z = 0.66;
  const yoke = mesh(new THREE.CylinderGeometry(0.085, 0.215, 0.075, 10, 1), M.qamis, J.spine, [0, TORSO + 0.0375, 0]);
  yoke.scale.z = 0.66;
  // Kragen, Knopfleiste, Brusttasche
  const collar = mesh(new THREE.CylinderGeometry(0.075, 0.09, 0.05, 8, 1), M.qamisDark, J.spine, [0, TORSO + 0.085, 0]);
  collar.scale.z = 0.9;
  mesh(new THREE.BoxGeometry(0.045, 0.3, 0.012), M.qamisDark, J.spine, [0, TORSO - 0.13, 0.139]);
  for (let i = 0; i < 3; i++) mesh(new THREE.BoxGeometry(0.016, 0.016, 0.01), M.button, J.spine, [0, TORSO - 0.03 - i * 0.09, 0.148]);
  mesh(new THREE.BoxGeometry(0.085, 0.09, 0.01), M.qamisDark, J.spine, [0.1, TORSO - 0.14, 0.128], [0, 0.35, 0]);

  // ---- Arme
  function arm(side) {
    const s = side === 'L' ? 1 : -1;
    const sh = joint(J.spine, [s * 0.235, TORSO - 0.02, 0]);
    mesh(new THREE.IcosahedronGeometry(0.068, 1), M.qamis, sh, [-s * 0.008, -0.004, 0]);
    mesh(new THREE.CylinderGeometry(0.068, 0.06, 0.29, 6, 1), M.qamis, sh, [0, -0.145, 0]);
    const el = joint(sh, [0, -0.29, 0]);
    mesh(new THREE.CylinderGeometry(0.06, 0.052, 0.25, 6, 1), M.qamis, el, [0, -0.125, 0]);
    mesh(new THREE.CylinderGeometry(0.056, 0.056, 0.05, 6, 1), M.qamisDark, el, [0, -0.255, 0]); // Manschette
    const wr = joint(el, [0, -0.285, 0]);
    // Hand: Fäustling mit Daumen
    mesh(new THREE.BoxGeometry(0.04, 0.075, 0.085), M.skin, wr, [0, -0.035, 0]);
    mesh(new THREE.BoxGeometry(0.034, 0.05, 0.078), M.skin, wr, [0, -0.095, 0.002]);
    mesh(new THREE.BoxGeometry(0.03, 0.055, 0.03), M.skin, wr, [0, -0.045, 0.055], [0.5, 0, 0]);
    J['shoulder' + side] = sh; J['elbow' + side] = el; J['wrist' + side] = wr;
  }
  arm('L'); arm('R');

  // ---- Hals und Kopf
  J.neck = joint(J.spine, [0, TORSO + 0.08, 0]);
  mesh(new THREE.CylinderGeometry(0.055, 0.062, 0.1, 7, 1), M.skin, J.neck, [0, 0.04, 0]);
  J.head = joint(J.neck, [0, 0.085, 0]);
  J.head.scale.setScalar(opt.headScale);
  const HR = 0.168;
  const HC = 0.15;                               // Kopfmitte über dem Gelenk
  const full = opt.beard === 'full';
  const hairMat = M.hair.clone(); hairMat.side = THREE.DoubleSide;

  // Kopfform: Kugel mit schmalerem Kiefer. u = Einheitskoordinaten (Radius 1).
  const shape = (v) => {
    if (v.y < 0) { const k = -v.y; v.x *= 1 - 0.3 * k; v.z *= 1 - 0.1 * k; }
    v.x *= 0.93; v.y *= 1.1;
    return v;
  };
  // Schale aus den Kopf-Dreiecken, die eine Bedingung erfüllen (für Haare und Bart)
  function shell(detail, keep, grow, post) {
    const src = new THREE.IcosahedronGeometry(1, detail).toNonIndexed().attributes.position;
    const out = [];
    const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), m = new THREE.Vector3();
    for (let i = 0; i < src.count; i += 3) {
      a.fromBufferAttribute(src, i); b.fromBufferAttribute(src, i + 1); c.fromBufferAttribute(src, i + 2);
      m.copy(a).add(b).add(c).divideScalar(3).normalize();
      if (!keep(m)) continue;
      for (const v of [a, b, c]) {
        const u = v.clone();
        shape(u).multiplyScalar(grow);
        if (post) post(u, v);
        out.push(u.x * HR, u.y * HR, u.z * HR);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(out, 3));
    g.computeVertexNormals();
    return g;
  }

  const skull = mesh(shell(2, () => true, 1), M.skin, J.head, [0, HC, 0]);
  J.skull = skull;
  // Nase (Keil) und Ohren – die Partie darüber bleibt glatte Haut
  {
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

  // Haare: Haaransatz vorne hoch, an den Seiten über dem Ohr, im Nacken tief
  const hairLine = (m) => (m.z > 0 ? 0.12 + (opt.kufi ? 0.75 : 0.5) * m.z : 0.12 + 0.62 * m.z);
  // Mit Kufi: Haare nur seitlich hinter den Schläfen und im Nacken sichtbar (keine dunklen Flächen auf der Stirn)
  mesh(shell(1, (m) => m.y > hairLine(m) && (!opt.kufi || m.z < 0.3), 1.075), hairMat, J.head, [0, HC, 0]);
  if (!opt.kufi) {
    // oben etwas länger, kantig nach vorne
    const top = mesh(new THREE.IcosahedronGeometry(0.15, 0), M.hair, J.head, [0, HC + 0.135, 0.012], [0.25, 0.4, 0]);
    top.scale.set(1.0, 0.5, 1.12);
  } else {
    const kt = kufiTexture(); kt.repeat.set(4, 1);
    const kufiMat = new THREE.MeshStandardMaterial({ color: '#ffffff', map: kt, flatShading: true, roughness: 0.9 });
    const k = joint(J.head, [0, HC + 0.088, -0.014]);
    k.rotation.x = -0.16;
    mesh(new THREE.CylinderGeometry(0.146, 0.172, 0.11, 12, 1, true), kufiMat, k, [0, 0.045, 0]);
    mesh(new THREE.CylinderGeometry(0.112, 0.146, 0.024, 12, 1), flat('#f6f4ee'), k, [0, 0.112, 0]);
  }

  // Bart: folgt dem Kiefer (Koteletten bis zum Ohr, Wangen frei), Schnurrbart unter der Nase
  const beardTop = (m) => {
    const ax = Math.abs(m.x);
    if (m.z < -0.25) return -9;                                    // Nacken frei
    const mou = full ? -0.3 : -0.37;                               // Schnurrbart unter der Nase
    const chk = full ? -0.56 : -0.7;                               // Wangenlinie
    const top = full ? 0.14 : 0.1;                                 // Koteletten bis zum Ohr
    const mix = (a, b, x0, x1) => a + (b - a) * Math.max(0, Math.min(1, (ax - x0) / (x1 - x0)));
    if (ax < 0.22) return mou;
    if (ax < 0.42) return mix(mou, chk, 0.22, 0.42);
    if (ax < 0.78) return mix(chk, chk + 0.16, 0.42, 0.78);
    return mix(chk + 0.16, top, 0.78, 0.9);
  };
  const beardLen = full ? 0.5 : 0.12;
  const beard = mesh(
    shell(3, (m) => m.y < beardTop(m), full ? 1.07 : 1.04, (u, v) => {
      if (v.y < -0.45) { const k = (-v.y - 0.45) / 0.55; u.y -= beardLen * k; u.z += 0.1 * k * (v.z > 0 ? 1 : 0); }
    }),
    hairMat, J.head, [0, HC, 0],
  );
  J.beard = beard;

  // Optional: Augenbrauen (nur als Varianten-Vorschau in Phase 1; Standard: aus)
  if (opt.brows) {
    for (const s of [1, -1]) {
      mesh(new THREE.BoxGeometry(0.052, 0.013, 0.012), M.hair, J.head, [s * 0.06, HC + 0.05, HR * 0.9], [0, s * 0.4, -s * 0.12]);
    }
  }

  // Mund: 4 Formen, es ist immer genau eine sichtbar
  const mouthZ = HR * (full ? 0.905 : 0.868);
  const mouthY = HC - HR * 0.56;
  const mouth = joint(J.head, [0, mouthY, mouthZ]);
  mouth.rotation.x = 0.38;
  mouth.scale.setScalar(1.15);
  // Mundteile folgen der Rundung des Gesichts, damit im Profil nichts absteht
  const MR = 0.1;
  const bend = (geo) => {
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
  const shapes = {};
  shapes.closed = new THREE.Group();
  mesh(bar(0.06, 0.009), M.mouth, shapes.closed);
  shapes.half = new THREE.Group();
  mesh(bar(0.056, 0.026), M.mouth, shapes.half);
  mesh(bar(0.044, 0.008, 0.009), M.teeth, shapes.half, [0, 0.008, 0.001]);
  shapes.open = new THREE.Group();
  mesh(bar(0.058, 0.05), M.mouth, shapes.open);
  mesh(bar(0.046, 0.01, 0.009), M.teeth, shapes.open, [0, 0.019, 0.001]);
  mesh(bar(0.03, 0.014, 0.009), M.tongue, shapes.open, [0, -0.017, 0.001]);
  shapes.smile = new THREE.Group();
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

  const fig = {
    root, J, opt,
    setMouth(name) { for (const k in shapes) shapes[k].visible = k === name; },
    // amp 0..1 -> Mundform (für Lippenbewegung nach Lautstärke)
    talk(amp) { this.setMouth(amp < 0.12 ? 'closed' : amp < 0.5 ? 'half' : 'open'); },
    // Grundhaltung + Atmen; danach können Shots Gelenke gezielt überschreiben
    idle(t, phase = 0) {
      const b = Math.sin(t * 1.5 + phase);
      J.spine.rotation.set(0.02 + b * 0.012, 0, Math.sin(t * 0.6 + phase) * 0.012);
      J.spine.scale.set(1 + b * 0.006, 1, 1 + b * 0.012);
      J.hips.rotation.z = Math.sin(t * 0.6 + phase) * 0.012;
      J.head.rotation.set(Math.sin(t * 0.9 + phase) * 0.025, Math.sin(t * 0.5 + phase * 2) * 0.05, 0);
      for (const s of ['L', 'R']) {
        const k = s === 'L' ? 1 : -1;
        J['shoulder' + s].rotation.set(0.06, 0, k * 0.1);
        J['elbow' + s].rotation.set(-0.18, 0, 0);
        J['wrist' + s].rotation.set(0, 0, 0);
      }
    },
  };
  root.scale.setScalar(opt.height);
  return fig;
}

// Person A – der Ratgeber
export function createFigureA(o = {}) {
  return createFigure({ qamis: '#f5f3ee', skin: '#c79367', hair: '#1c1614', beard: 'full', kufi: true, shoes: '#ece9e2', height: 1.0, ...o });
}
// Person B – der junge Mann
export function createFigureB(o = {}) {
  return createFigure({ qamis: '#2f6fc4', skin: '#d19d72', hair: '#1a1513', beard: 'short', kufi: false, shoes: '#dfe3ea', height: 0.965, ...o });
}
