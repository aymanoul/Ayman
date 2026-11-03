// Ort B: Einfahrt vor einem kleinen Haus (morgens).
// Hausfront bei z=-6 (schaut nach +Z), Garage rechts (x 3..6.6), Einfahrt x 3.2..6.4,
// Gehweg z 4.5..6.3, Strasse z 6.3..13 entlang X.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { rng } from '../util.js';
import { mat, mesh } from '../character.js';
import { Bike, rod } from '../props.js';
import { grp, makeGround, makeTree, makeBush, makeFlowers, makeLamp, makePicketFence, makeHills, PathCurve } from './common.js';

function box(w, h, d, color, name, x, y, z, parent, opts) {
  const m = mesh(new THREE.BoxGeometry(w, h, d), mat(color, opts), name);
  m.position.set(x, y, z);
  if (parent) parent.add(m);
  return m;
}

function gableRoof(width, depth, rise, color, name) {
  // Satteldach, First entlang X
  const shp = new THREE.Shape();
  shp.moveTo(-depth / 2, 0); shp.lineTo(0, rise); shp.lineTo(depth / 2, 0); shp.closePath();
  const g = new THREE.ExtrudeGeometry(shp, { depth: width, bevelEnabled: false });
  g.translate(0, 0, -width / 2);
  g.rotateY(Math.PI / 2);
  return mesh(g, mat(color), name);
}

function windowUnit(parent, x, y, z, w, h, name = 'window') {
  const g = grp(name, parent, x, y, z);
  box(w + 0.12, h + 0.12, 0.08, '#f6f4ee', 'window_frame', 0, 0, 0, g);
  box(w, h, 0.05, '#6f879c', 'window_pane', 0, 0, 0.03, g, { roughness: 0.35 });
  box(0.05, h, 0.06, '#f6f4ee', 'window_bar', 0, 0, 0.05, g);
  box(w, 0.05, 0.06, '#f6f4ee', 'window_bar', 0, 0, 0.05, g);
  box(w + 0.22, 0.06, 0.16, '#e9e5dc', 'window_sill', 0, -h / 2 - 0.08, 0.07, g);
  return g;
}

function makeHouse(rand, opts) {
  const g = grp('house', null);
  const { w, d, h, wall, roof } = opts;
  box(w, h, d, wall, 'house_wall', 0, h / 2, 0, g);
  const r = gableRoof(w + 0.6, d + 0.8, opts.rise || 1.9, roof, 'house_roof');
  r.position.y = h;
  g.add(r);
  box(w + 0.6, 0.12, 0.2, '#f1ede4', 'gutter', 0, h - 0.02, d / 2 + 0.38, g);
  box(w + 0.04, 0.25, d + 0.04, '#b9b2a6', 'house_plinth', 0, 0.12, 0, g);
  return g;
}

export function buildDriveway() {
  const rand = rng(4711);
  const root = grp('set_driveway', null);

  // Boden: Rasen, Einfahrt, Gehweg, Strasse
  root.add(makeGround(240, 60, '#79a356', rand, (x, z) => z > 3.5 && z < 14, 0.04));
  box(3.2, 0.03, 10.6, '#cdc8be', 'driveway', 4.8, 0.005, -0.7, root);
  for (let i = 0; i < 14; i++) box(3.2, 0.032, 0.02, '#b9b3a8', 'driveway_joint', 4.8, 0.006, -5.6 + i * 0.75, root);
  box(200, 0.06, 1.8, '#d6d3cc', 'sidewalk', 0, 0.02, 5.4, root);
  box(200, 0.12, 0.16, '#bdb9b1', 'curb', 0, 0.05, 6.32, root);
  box(200, 0.02, 6.8, '#5d6068', 'street', 0, 0.0, 9.7, root);
  for (let i = -20; i < 20; i++) box(1.6, 0.025, 0.12, '#e8e6df', 'lane_mark', i * 4, 0.012, 9.7, root);
  box(200, 0.12, 0.16, '#bdb9b1', 'curb', 0, 0.05, 13.1, root);
  box(200, 0.06, 1.8, '#d6d3cc', 'sidewalk', 0, 0.02, 14.1, root);
  // Einfahrtsabsenkung im Bordstein (heller Streifen)
  box(3.2, 0.13, 0.17, '#c9c5bd', 'curb_cut', 4.8, 0.03, 6.32, root);
  // Trittsteine zur Haustuer
  for (let i = 0; i < 7; i++) {
    const s = mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.04, 7), mat('#cfc9bd'), 'stepping_stone', { cast: false });
    s.position.set(-0.8 + (i % 2) * 0.1, 0.01, 3.9 - i * 1.4);
    root.add(s);
  }

  // Haus
  const house = makeHouse(rand, { w: 9, d: 7, h: 3.0, wall: '#e9d6b8', roof: '#a5574a', rise: 2.0 });
  house.position.set(-1.5, 0, -9.5);
  root.add(house);
  windowUnit(root, -4.3, 1.6, -5.97, 1.1, 1.0);
  windowUnit(root, -2.6, 1.6, -5.97, 1.1, 1.0);
  windowUnit(root, 1.5, 1.6, -5.97, 0.9, 1.0);
  // Gaube / Giebelfenster angedeutet durch Dachfenster
  const dorm = grp('dormer', root, -2.2, 3.55, -6.6);
  box(1.4, 0.9, 1.0, '#e9d6b8', 'dormer_wall', 0, 0, 0, dorm);
  windowUnit(dorm, 0, 0.0, 0.52, 0.7, 0.55, 'dormer_window');
  const dr = gableRoof(1.6, 1.2, 0.5, '#a5574a', 'dormer_roof');
  dr.rotation.y = Math.PI / 2;
  dr.position.set(0, 0.45, 0);
  dorm.add(dr);
  // Haustuer
  box(1.1, 2.15, 0.1, '#f6f4ee', 'door_frame', -0.8, 1.07, -5.96, root);
  box(0.92, 2.02, 0.08, '#2f5d50', 'front_door', -0.8, 1.04, -5.9, root);
  const knob = mesh(new THREE.SphereGeometry(0.04, 6, 4), mat('#c9a45a'), 'door_knob');
  knob.position.set(-0.45, 1.05, -5.84);
  root.add(knob);
  box(1.5, 0.16, 0.7, '#cfc9bd', 'door_step', -0.8, 0.08, -5.6, root);
  box(1.6, 0.08, 0.8, '#8f8a82', 'door_canopy', -0.8, 2.45, -5.6, root);
  // Lampe neben der Tuer, Hausnummer-Schild (ohne Text), Pflanzen
  box(0.12, 0.2, 0.1, '#2b2f2e', 'wall_lamp', -1.55, 2.05, -5.9, root);
  box(0.26, 0.18, 0.03, '#25303a', 'house_sign', 0.0, 2.0, -5.94, root);
  for (const x of [-1.6, 0.0]) {
    const pot = mesh(new THREE.CylinderGeometry(0.2, 0.15, 0.32, 7), mat('#b8643f'), 'plant_pot');
    pot.position.set(x, 0.16, -5.45);
    root.add(pot);
    const pl = makeBush(rand, '#4f8a3c', 0.22);
    pl.position.set(x, 0.28, -5.45);
    root.add(pl);
  }

  // Garage
  const gar = grp('garage', root, 4.8, 0, -9);
  box(3.6, 2.7, 6, '#e2d1b4', 'garage_wall', 0, 1.35, 0, gar);
  box(3.8, 0.18, 6.2, '#8f8a82', 'garage_roof', 0, 2.79, 0, gar);
  box(3.0, 2.2, 0.06, '#f1efe9', 'garage_door', 0, 1.1, 3.01, gar);
  for (let i = 1; i < 5; i++) box(2.96, 0.025, 0.02, '#cfccc4', 'garage_door_groove', 0, i * 0.44, 3.05, gar);
  box(0.4, 0.04, 0.03, '#9a9894', 'garage_handle', 0, 0.5, 3.06, gar);
  box(3.2, 0.12, 0.1, '#f6f4ee', 'garage_lintel', 0, 2.26, 3.02, gar);

  // Altes Kinderfahrrad an der Hauswand (Erinnerung)
  const oldBike = new Bike('old_bike', { color: '#c7323f' });
  oldBike.update({ dist: 0.3 }, 0);
  oldBike.root.position.set(2.72, 0, -5.68);
  oldBike.root.rotation.set(0, Math.PI / 2, 0);
  oldBike.lean.rotation.z = 0.22;
  root.add(oldBike.root);

  // Briefkasten an der Einfahrt
  const mb = grp('mailbox', root, 2.85, 0, 4.25);
  box(0.08, 1.05, 0.08, '#3a3f3d', 'mailbox_post', 0, 0.52, 0, mb);
  const mbox = mesh(new RoundedBoxGeometry(0.34, 0.42, 0.24, 1, 0.04), mat('#3d6b5a'), 'mailbox_box');
  mbox.position.set(0, 1.22, 0);
  mb.add(mbox);
  box(0.22, 0.03, 0.02, '#1d2421', 'mailbox_slot', 0, 1.33, 0.125, mb);
  box(0.03, 0.18, 0.02, '#c8453b', 'mailbox_flag', 0.19, 1.28, 0, mb);

  // Zaun, Hecke
  const f1 = makePicketFence(10.0);
  f1.position.set(-6.2, 0, 4.3);
  root.add(f1);
  const f2 = makePicketFence(0.9);
  f2.position.set(2.15, 0, 4.3);
  root.add(f2);
  for (let i = 0; i < 9; i++) {
    const b = makeBush(rand, '#3f7536', 0.55);
    b.position.set(7.1, 0, -5 + i * 1.15);
    b.scale.set(1, 1.5, 1);
    root.add(b);
  }
  // Baum im Vorgarten, Blumenbeet
  const t = makeTree(rand, { height: 3.6, crown: 1.7, blobs: 2 });
  t.position.set(-4.6, 0, 0.6);
  root.add(t);
  const fl = makeFlowers(rand, 26, 2.2);
  fl.position.set(-3.0, 0, -4.7);
  root.add(fl);
  for (const x of [-5.2, -3.6, -1.9]) {
    const b = makeBush(rand, '#4b8238', 0.35);
    b.position.set(x, 0, -5.4);
    root.add(b);
  }

  // Strassenlaterne (morgens aus), Nachbarhaeuser, Baeume
  const sl = makeLamp({ height: 4.2, intensity: 0.0, glow: '#000000' });
  sl.position.set(9.5, 0, 13.6);
  root.add(sl);
  const nb = [
    { x: -13.5, z: -9.5, w: 8, d: 7, h: 3.0, wall: '#e6ddd0', roof: '#6f6a70' },
    { x: 15.5, z: -10, w: 9, d: 7, h: 3.2, wall: '#e9e1d2', roof: '#8a4d43' },
    { x: -6, z: 22, w: 9, d: 7, h: 3.0, wall: '#ece4d6', roof: '#7a5248' },
    { x: 8, z: 22.5, w: 8, d: 7, h: 3.1, wall: '#dfe2e3', roof: '#5f6670' },
    { x: 26, z: -10, w: 8, d: 7, h: 3.0, wall: '#e6ddd0', roof: '#9a5a4a' },
    { x: -26, z: -9.5, w: 8, d: 7, h: 3.0, wall: '#ebe3d5', roof: '#6c6872' },
    { x: 22, z: 22, w: 8, d: 7, h: 3.0, wall: '#e9e1d2', roof: '#8a4d43' },
  ];
  for (const n of nb) {
    const h = makeHouse(rand, n);
    h.position.set(n.x, 0, n.z);
    if (n.z > 10) h.rotation.y = Math.PI;
    root.add(h);
    const facadeZ = n.z > 10 ? n.z - n.d / 2 - 0.03 : n.z + n.d / 2 + 0.03;
    for (const dx of [-2.2, 0.0, 2.2]) {
      windowUnit(root, n.x + dx, 1.6, facadeZ, 1.0, 0.95);
      root.children[root.children.length - 1].rotation.y = n.z > 10 ? Math.PI : 0;
    }
  }
  for (const [x, z] of [[-9, 1], [12.5, 1.5], [-17, 3], [18, 2.5], [0, 17.5], [14, 17.5], [-12, 17], [28, 2]]) {
    const tr = makeTree(rand, { height: 3.2 + rand() * 1.5 });
    tr.position.set(x, 0, z);
    root.add(tr);
  }
  for (let i = 0; i < 40; i++) {
    const a = rand() * Math.PI * 2, r = 50 + rand() * 30;
    const tr = makeTree(rand, { height: 3 + rand() * 3, crown: 1.8 + rand() * 1.4, blobs: 1 });
    tr.position.set(Math.cos(a) * r, 0, Math.sin(a) * r);
    root.add(tr);
  }
  root.add(makeHills(rand, 9, 120, ['#7f9a86', '#8ea596', '#7a948a'], 0.22));

  // Fahrweg des Autos: aus der Einfahrt auf die Strasse, dann nach +X (rechts)
  const drive = new PathCurve([[4.8, -1.5], [4.8, 3.0], [5.6, 7.4], [8.5, 8.6], [14, 8.5], [40, 8.5], [70, 8.5]]);

  return {
    name: 'driveway',
    root,
    paths: { carOut: { at: (s, off) => drive.at(s, off), length: drive.length } },
    lamps: [],
    sun: { morning: new THREE.Vector3(0.55, 0.62, 0.55).normalize(), evening: new THREE.Vector3(-0.9, 0.22, 0.4).normalize(), night: new THREE.Vector3(0.2, 0.7, 0.3).normalize() },
    sky: {
      morning: { top: '#5a8fd8', horizon: '#d3e3f5', bottom: '#b9c8da', sun: '#f4f8ff', glow: 0.25, disc: 3 },
    },
  };
}
