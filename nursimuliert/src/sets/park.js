// Ort A: Parkweg (abends). Heller Weg, Wiese, runde Baeume, Laternen, Bank.
// Der Weg laeuft von (-45,0) gerade nach +X, macht bei x=2 eine Kehre (Radius 7)
// und laeuft bei z=-14 zurueck. Pfad "main": s = 0 bei x=-45.
import * as THREE from 'three';
import { rng } from '../util.js';
import { grp, makeGround, makeRibbon, PathCurve, makeTree, makeBush, makeFlowers, makeLamp, makeBench, makeHills } from './common.js';

export function buildPark() {
  const rand = rng(1207);
  const root = grp('set_park', null);

  // Weg
  const pts = [[-60, 0], [-45, 0], [-30, 0], [-15, 0], [-5, 0], [2, 0]];
  for (const f of [0.25, 0.5, 0.75]) {
    const a = f * Math.PI;
    pts.push([2 + 7 * Math.sin(a), -7 + 7 * Math.cos(a)]);
  }
  pts.push([2, -14], [-5, -14], [-15, -14], [-30, -14], [-45, -14], [-60, -14]);
  const main = new PathCurve(pts);
  // s=0 soll bei x=-45 liegen: Offset bestimmen
  main.s0 = 15;
  const pathAt = (s, off) => main.at(s + main.s0, off);

  const nearPath = (x, z) => {
    if (Math.abs(z) < 1.6 && x < 3) return true;
    if (Math.abs(z + 14) < 1.6 && x < 3) return true;
    const d = Math.hypot(x - 2, z + 7);
    return x >= 1.5 && Math.abs(d - 7) < 1.6;
  };
  const ground = makeGround(260, 110, '#76a04a', rand, nearPath, 0.07);
  root.add(ground);
  root.add(makeRibbon(main.curve, 2.3, '#cdb68f', 0.006, 400, 'path_edge'));
  root.add(makeRibbon(main.curve, 2.0, '#e6d6b2', 0.014, 400, 'path'));

  // Baeume: Allee links/rechts und Hintergrund. Abstand zum Weg halten.
  const trees = grp('trees', root);
  const placeTree = (x, z, opts = {}) => {
    const t = makeTree(rand, opts);
    t.position.set(x, 0, z);
    t.rotation.y = rand() * 6.28;
    trees.add(t);
    return t;
  };
  const free = (x, z, m = 3.2) => {
    if (Math.abs(z) < m && x < 4) return false;
    if (Math.abs(z + 14) < m && x < 4) return false;
    const d = Math.hypot(x - 2, z + 7);
    if (x > 0 && Math.abs(d - 7) < m) return false;
    return true;
  };
  let placed = 0, guard = 0;
  while (placed < 70 && guard++ < 4000) {
    const x = -60 + rand() * 95;
    const z = -45 + rand() * 75;
    if (!free(x, z)) continue;
    // nicht direkt vor Kameras im Nahbereich: einzelne Zonen frei lassen
    if (x > -34 && x < 4 && z > 2.0 && z < 26) continue;
    placeTree(x, z);
    placed++;
  }
  // gezielte Alleebaeume
  for (const x of [-40, -33, -24, -11.5]) placeTree(x, -3.6 - rand() * 0.8, { height: 3.0 + rand() });
  for (const x of [-37, -14]) placeTree(x, 4.4 + rand() * 0.6, { height: 3.0 + rand() });
  placeTree(-2, -9.5, { height: 3.4, crown: 1.6 });
  placeTree(-12, -10.0, { height: 3.0, crown: 1.4 });
  // Baumreihe am Horizont
  for (let i = 0; i < 70; i++) {
    const a = rand() * Math.PI * 2;
    const r = 55 + rand() * 25;
    placeTree(Math.cos(a) * r, Math.sin(a) * r, { height: 3 + rand() * 3, crown: 1.8 + rand() * 1.5, blobs: 1 });
  }
  root.add(makeHills(rand, 10, 130, ['#5c7d5a', '#6b8a63', '#587457']));

  // Buesche, Blumen
  for (let i = 0; i < 38; i++) {
    const x = -50 + rand() * 70, z = -30 + rand() * 50;
    if (!free(x, z, 2.2)) continue;
    if (x > -34 && x < 4 && z > 2.0 && z < 26) continue;
    const b = makeBush(rand, ['#4b8238', '#5a9142', '#43773a'][i % 3], 0.45 + rand() * 0.4);
    b.position.set(x, 0, z);
    root.add(b);
  }
  for (let i = 0; i < 14; i++) {
    const x = -45 + rand() * 50, z = (rand() > 0.5 ? 1 : -1) * (2.2 + rand() * 6) + (rand() > 0.6 ? -14 : 0);
    if (!free(x, z, 1.4)) continue;
    const f = makeFlowers(rand, 14, 1.4);
    f.position.set(x, 0, z);
    root.add(f);
  }

  // Laternen und Bank
  const lamps = [];
  for (const [x, z] of [[-17.5, 1.75], [-44, -1.75], [7, 2.2], [-9, -15.75], [-30, -12.25]]) {
    const l = makeLamp();
    l.position.set(x, 0, z);
    root.add(l);
    lamps.push(l);
  }
  const bench = makeBench();
  bench.position.set(-19, 0, 2.1);
  bench.rotation.y = Math.PI;
  root.add(bench);
  const bench2 = makeBench();
  bench2.position.set(-21, 0, -16.1);
  root.add(bench2);

  return {
    name: 'park',
    root,
    paths: { main: { at: pathAt, length: main.length - main.s0 } },
    lamps,
    sun: { evening: new THREE.Vector3(-1, 0.19, -0.42).normalize(), morning: new THREE.Vector3(0.6, 0.5, 0.6).normalize(), night: new THREE.Vector3(-0.3, 0.6, -0.5).normalize() },
    sky: {
      evening: { top: '#56649c', horizon: '#f2a46c', bottom: '#b3805e', sun: '#ffd09a', glow: 0.4, disc: 5 },
    },
  };
}
