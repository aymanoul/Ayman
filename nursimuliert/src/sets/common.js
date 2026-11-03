// Gemeinsame Bausteine fuer Orte: Himmel, Boden, Wege, Baeume, Laterne, Zaun ...
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { mat, mesh } from '../character.js';
import { rod } from '../props.js';

export function grp(name, parent, x = 0, y = 0, z = 0) {
  const g = new THREE.Group();
  g.name = name;
  g.position.set(x, y, z);
  if (parent) parent.add(g);
  return g;
}

// Himmelskuppel mit Verlauf und Sonnenscheibe (kein Bild, nur Shader)
export function makeSky(name = 'sky') {
  const uniforms = {
    top: { value: new THREE.Color('#6d7fb3') },
    horizon: { value: new THREE.Color('#ffc995') },
    bottom: { value: new THREE.Color('#d9a77c') },
    sunDir: { value: new THREE.Vector3(0, 0.2, -1).normalize() },
    sunColor: { value: new THREE.Color('#fff0d0') },
    sunSize: { value: 0.035 },
    sunGlow: { value: 0.6 },
    sunDisc: { value: 6.0 },
    curve: { value: 0.55 },
  };
  const m = new THREE.ShaderMaterial({
    uniforms,
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    vertexShader: /* glsl */`
      varying vec3 vDir;
      void main() {
        vDir = normalize(position);
        vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        gl_Position = p.xyww;
      }`,
    fragmentShader: /* glsl */`
      uniform vec3 top; uniform vec3 horizon; uniform vec3 bottom;
      uniform vec3 sunDir; uniform vec3 sunColor; uniform float sunSize; uniform float sunGlow; uniform float sunDisc; uniform float curve;
      varying vec3 vDir;
      void main() {
        vec3 d = normalize(vDir);
        float h = d.y;
        vec3 col = h > 0.0 ? mix(horizon, top, pow(clamp(h, 0.0, 1.0), curve)) : mix(horizon, bottom, clamp(-h * 4.0, 0.0, 1.0));
        float c = dot(d, normalize(sunDir));
        float glow = pow(max(c, 0.0), 8.0) * sunGlow + pow(max(c, 0.0), 64.0) * sunGlow;
        col += sunColor * glow;
        float disc = smoothstep(1.0 - sunSize * 0.02, 1.0 - sunSize * 0.015, c);
        col += sunColor * disc * sunDisc;
        gl_FragColor = vec4(col, 1.0);
      }`,
  });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(450, 32, 16), m);
  sky.name = name;
  sky.frustumCulled = false;
  sky.renderOrder = -1;
  sky.userData.uniforms = uniforms;
  return sky;
}

// Boden mit leichter Facettierung; flatZones: Bereiche, die flach bleiben (Funktion x,z -> bool)
export function makeGround(size, seg, color, rand, flat = () => false, amp = 0.05) {
  const g = new THREE.PlaneGeometry(size, size, seg, seg);
  g.rotateX(-Math.PI / 2);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i);
    if (!flat(x, z)) pos.setY(i, (rand() - 0.5) * amp - 0.01);
    else pos.setY(i, -0.01);
  }
  g.computeVertexNormals();
  const m = mesh(g, mat(color), 'ground', { cast: false, receive: true });
  return m;
}

// Weg als Band entlang einer Kurve
export function makeRibbon(curve, width, color, y = 0.012, samples = 200, name = 'path') {
  const pts = curve.getSpacedPoints(samples);
  const verts = [], idx = [];
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    const q = pts[Math.min(pts.length - 1, i + 1)], o = pts[Math.max(0, i - 1)];
    const t = new THREE.Vector3().subVectors(q, o).setY(0).normalize();
    const n = new THREE.Vector3(-t.z, 0, t.x);
    verts.push(p.x + n.x * width / 2, y, p.z + n.z * width / 2);
    verts.push(p.x - n.x * width / 2, y, p.z - n.z * width / 2);
    if (i < pts.length - 1) {
      const a = i * 2;
      idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  // Normale nach oben erzwingen
  const nrm = g.attributes.normal;
  for (let i = 0; i < nrm.count; i++) nrm.setXYZ(i, 0, 1, 0);
  return mesh(g, mat(color, { side: THREE.DoubleSide }), name, { cast: false, receive: true });
}

// Pfad mit Bogenlaengen-Abfrage: s (m) -> Position und Richtung
export class PathCurve {
  constructor(points2d) {
    this.curve = new THREE.CatmullRomCurve3(points2d.map(([x, z]) => new THREE.Vector3(x, 0, z)), false, 'centripetal');
    this.curve.arcLengthDivisions = 2000;
    this.length = this.curve.getLength();
  }
  at(s, off = 0) {
    const u = THREE.MathUtils.clamp(s / this.length, 0, 1);
    const p = this.curve.getPointAt(u);
    const t = this.curve.getTangentAt(u).setY(0).normalize();
    // Seitlicher Versatz: positiv = links in Fahrtrichtung
    const left = new THREE.Vector3(t.z, 0, -t.x);
    p.addScaledVector(left, off);
    const heading = Math.atan2(t.x, t.z);
    return { x: p.x, z: p.z, heading };
  }
}

export function makeTree(rand, opts = {}) {
  const g = new THREE.Group();
  g.name = 'tree';
  const h = opts.height || (2.2 + rand() * 1.6);
  const trunkR = 0.12 + rand() * 0.06;
  const trunk = mesh(new THREE.CylinderGeometry(trunkR * 0.75, trunkR, h * 0.55, 6), mat(opts.trunk || '#6b4a33'), 'trunk');
  trunk.position.y = h * 0.275;
  g.add(trunk);
  const greens = opts.greens || ['#4f8a3c', '#5d9945', '#46803a', '#6aa24c'];
  const blobs = opts.blobs || (1 + Math.floor(rand() * 3));
  const cr = opts.crown || (1.0 + rand() * 0.7);
  for (let i = 0; i < blobs; i++) {
    const r = cr * (i === 0 ? 1 : 0.6 + rand() * 0.25);
    const c = mesh(new THREE.IcosahedronGeometry(r, 1), mat(greens[Math.floor(rand() * greens.length)]), 'crown');
    c.position.set(i === 0 ? 0 : (rand() - 0.5) * cr * 1.2, h * 0.55 + r * 0.75 + (i === 0 ? 0 : rand() * cr * 0.5), i === 0 ? 0 : (rand() - 0.5) * cr * 1.2);
    c.scale.y = 0.92;
    c.rotation.set(rand() * 3, rand() * 3, 0);
    g.add(c);
  }
  return g;
}

export function makeBush(rand, color = '#4b8238', size = 0.6) {
  const g = new THREE.Group();
  g.name = 'bush';
  const n = 2 + Math.floor(rand() * 3);
  for (let i = 0; i < n; i++) {
    const r = size * (0.55 + rand() * 0.45);
    const b = mesh(new THREE.IcosahedronGeometry(r, 0), mat(color), 'bush_blob');
    b.position.set((rand() - 0.5) * size * 1.4, r * 0.7, (rand() - 0.5) * size * 1.0);
    b.rotation.set(rand() * 3, rand() * 3, 0);
    g.add(b);
  }
  return g;
}

export function makeFlowers(rand, n, area, colors = ['#f2e6a0', '#f4b6c2', '#ffffff', '#e8a0e0']) {
  const g = new THREE.Group();
  g.name = 'flowers';
  for (let i = 0; i < n; i++) {
    const f = mesh(new THREE.IcosahedronGeometry(0.045, 0), mat(colors[Math.floor(rand() * colors.length)]), 'flower', { cast: false });
    f.position.set((rand() - 0.5) * area, 0.07 + rand() * 0.05, (rand() - 0.5) * area);
    g.add(f);
    const st = mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.1, 3), mat('#4f7f35'), 'stem', { cast: false });
    st.position.set(f.position.x, 0.04, f.position.z);
    g.add(st);
  }
  return g;
}

// Laterne mit leuchtendem Kopf (Bloom). light: optional PointLight fuer die Nacht
export function makeLamp(opts = {}) {
  const g = new THREE.Group();
  g.name = 'lamp_post';
  const pole = '#2b3330';
  const h = opts.height || 3.6;
  const p = mesh(new THREE.CylinderGeometry(0.05, 0.075, h, 7), mat(pole), 'lamp_pole');
  p.position.y = h / 2;
  g.add(p);
  const base = mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.3, 7), mat(pole), 'lamp_base');
  base.position.y = 0.15;
  g.add(base);
  const cap = mesh(new THREE.ConeGeometry(0.24, 0.18, 6), mat(pole), 'lamp_cap');
  cap.position.y = h + 0.42;
  g.add(cap);
  const glassMat = new THREE.MeshStandardMaterial({
    color: '#ffe2a8', emissive: opts.glow || '#ffc773', emissiveIntensity: opts.intensity ?? 3.2,
    roughness: 0.6, metalness: 0, flatShading: true,
  });
  const lantern = mesh(new THREE.CylinderGeometry(0.17, 0.12, 0.34, 6), glassMat, 'lamp_glass', { cast: false, receive: false });
  lantern.position.y = h + 0.17;
  g.add(lantern);
  g.userData.glass = glassMat;
  const ring = mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.04, 6), mat(pole), 'lamp_ring');
  ring.position.y = h;
  g.add(ring);
  g.userData.lightPos = new THREE.Vector3(0, h + 0.15, 0);
  return g;
}

export function makeBench() {
  const g = new THREE.Group();
  g.name = 'bench';
  const wood = '#8a5a3b', iron = '#2b2f2e';
  for (let i = 0; i < 3; i++) {
    const s = mesh(new RoundedBoxGeometry(1.6, 0.04, 0.12, 1, 0.01), mat(wood), 'bench_slat');
    s.position.set(0, 0.45, -0.14 + i * 0.14);
    g.add(s);
  }
  for (let i = 0; i < 2; i++) {
    const s = mesh(new RoundedBoxGeometry(1.6, 0.11, 0.04, 1, 0.01), mat(wood), 'bench_back');
    s.position.set(0, 0.62 + i * 0.15, -0.24);
    s.rotation.x = -0.15;
    g.add(s);
  }
  for (const x of [-0.7, 0.7]) {
    g.add(rod([x, 0, 0.12], [x, 0.45, 0.1], 0.025, iron, 'bench_leg'));
    g.add(rod([x, 0, -0.18], [x, 0.9, -0.28], 0.025, iron, 'bench_leg'));
  }
  return g;
}

export function makePicketFence(length, color = '#f3efe6', height = 0.8) {
  const g = new THREE.Group();
  g.name = 'fence';
  const n = Math.max(2, Math.round(length / 0.16));
  for (let i = 0; i <= n; i++) {
    const x = -length / 2 + (i / n) * length;
    const p = mesh(new THREE.BoxGeometry(0.07, height, 0.03), mat(color), 'fence_picket');
    p.position.set(x, height / 2, 0);
    g.add(p);
    const tip = mesh(new THREE.ConeGeometry(0.05, 0.08, 4), mat(color), 'fence_tip');
    tip.position.set(x, height + 0.04, 0);
    tip.rotation.y = Math.PI / 4;
    g.add(tip);
  }
  for (const y of [height * 0.3, height * 0.75]) {
    const r = mesh(new THREE.BoxGeometry(length, 0.06, 0.025), mat(color), 'fence_rail');
    r.position.set(0, y, -0.025);
    g.add(r);
  }
  return g;
}

export function makeHills(rand, count, radius, colors, yScale = 0.25) {
  const g = new THREE.Group();
  g.name = 'hills';
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + rand() * 0.3;
    const r = 18 + rand() * 22;
    const h = mesh(new THREE.IcosahedronGeometry(r, 1), mat(colors[i % colors.length]), 'hill', { cast: false, receive: false });
    h.scale.set(1.6, yScale, 1.2);
    h.position.set(Math.cos(a) * radius, -r * yScale * 0.35, Math.sin(a) * radius);
    h.rotation.y = rand() * 3;
    g.add(h);
  }
  return g;
}
