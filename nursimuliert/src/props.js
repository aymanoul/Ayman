// Requisiten: Kinderfahrrad, kleines Auto, Umzugskarton. Alles Low-Poly.
// Lokale Koordinaten: Vorderseite zeigt nach +Z, Ursprung am Boden in der Mitte.

import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { mat, mesh } from './character.js';
import { D2R } from './util.js';

function grp(name, parent, x = 0, y = 0, z = 0) {
  const g = new THREE.Group();
  g.name = name;
  g.position.set(x, y, z);
  if (parent) parent.add(g);
  return g;
}

// Zylinder zwischen zwei Punkten
export function rod(a, b, r, color, name, seg = 6) {
  const A = new THREE.Vector3(...a), Bv = new THREE.Vector3(...b);
  const len = A.distanceTo(Bv);
  const m = mesh(new THREE.CylinderGeometry(r, r, len, seg, 1), mat(color), name);
  m.position.copy(A).add(Bv).multiplyScalar(0.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), Bv.clone().sub(A).normalize());
  return m;
}

// ---------------------------------------------------------------- Fahrrad

export class Bike {
  constructor(id, spec = {}) {
    this.id = id;
    this.kind = 'bike';
    const color = spec.color || '#d7263d';
    const dark = '#2a2a2e';
    this.R = 0.2;
    const R = this.R;
    this.root = grp('bike_' + id, null);
    this.lean = grp('bike_lean', this.root);       // Rollen (Wackeln)
    const L = this.lean;

    const wheel = (name, z) => {
      const w = grp(name, L, 0, R, z);
      const spin = grp(name + '_spin', w);
      const tire = mesh(new THREE.TorusGeometry(R - 0.025, 0.026, 6, 16), mat(dark), 'tire');
      tire.rotation.y = Math.PI / 2;
      spin.add(tire);
      const rim = mesh(new THREE.TorusGeometry(R - 0.05, 0.008, 4, 16), mat('#c9c9cc'), 'rim');
      rim.rotation.y = Math.PI / 2;
      spin.add(rim);
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI;
        spin.add(rod([0, Math.cos(a) * (R - 0.05), Math.sin(a) * (R - 0.05)], [0, -Math.cos(a) * (R - 0.05), -Math.sin(a) * (R - 0.05)], 0.004, '#bfbfc4', 'spoke', 3));
      }
      const hub = mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.07, 6), mat('#9a9aa0'), 'hub');
      hub.rotation.z = Math.PI / 2;
      w.add(hub);
      return spin;
    };
    this.wheelF = wheel('wheel_front', 0.37);
    this.wheelB = wheel('wheel_back', -0.37);

    const bb = [0, 0.21, 0];
    const seatTop = [0, 0.47, -0.13];
    const head = [0, 0.5, 0.27];
    const fr = (a, b, r = 0.018, n = 'frame') => L.add(rod(a, b, r, color, n));
    fr(head, bb, 0.02);
    fr(bb, seatTop, 0.018);
    fr([0, 0.47, 0.265], [0, 0.42, -0.11], 0.016);
    fr(bb, [0, R, -0.37], 0.012);
    fr([0, 0.44, -0.12], [0.03, R, -0.37], 0.011);
    fr([0, 0.44, -0.12], [-0.03, R, -0.37], 0.011);
    fr([0, 0.55, 0.26], [0.035, R, 0.37], 0.012);
    fr([0, 0.55, 0.26], [-0.035, R, 0.37], 0.012);
    // Schutzbleche
    for (const z of [0.37, -0.37]) {
      const g = mesh(new THREE.TorusGeometry(R + 0.02, 0.022, 4, 10, Math.PI * 0.75), mat(color), 'fender');
      g.rotation.y = Math.PI / 2;
      g.rotation.x = z > 0 ? -0.1 : Math.PI * 0.25 + 0.15;
      g.position.set(0, R, z);
      g.scale.set(1, 1, 1.6);
      L.add(g);
    }
    // Lenker
    L.add(rod([0, 0.5, 0.27], [0, 0.66, 0.24], 0.014, '#b8b8be', 'stem'));
    L.add(rod([0.2, 0.67, 0.2], [-0.2, 0.67, 0.2], 0.012, '#b8b8be', 'handlebar'));
    L.add(rod([0, 0.66, 0.24], [0, 0.67, 0.2], 0.012, '#b8b8be', 'handlebar_mid'));
    for (const s of [1, -1]) L.add(rod([s * 0.2, 0.67, 0.2], [s * 0.26, 0.67, 0.18], 0.02, dark, 'grip'));
    // Sattel
    const saddle = mesh(new RoundedBoxGeometry(0.13, 0.045, 0.27, 2, 0.02), mat('#3a2f2a'), 'saddle');
    saddle.position.set(0, 0.5, -0.155);
    L.add(saddle);
    L.add(rod([0, 0.47, -0.13], [0, 0.49, -0.135], 0.012, '#b8b8be', 'seatpost'));
    // Tretlager, Kurbeln, Pedale
    const ring = mesh(new THREE.TorusGeometry(0.06, 0.008, 4, 12), mat('#9a9aa0'), 'chainring');
    ring.rotation.y = Math.PI / 2;
    ring.position.set(-0.045, 0.21, 0);
    L.add(ring);
    this.crank = grp('crank', L, 0, 0.21, 0);
    this.pedals = {};
    for (const s of [1, -1]) {
      const arm = grp('crank_' + (s > 0 ? 'L' : 'R'), this.crank, s * 0.06, 0, 0);
      arm.add(rod([0, 0, 0], [0, s > 0 ? -0.085 : 0.085, 0], 0.01, '#9a9aa0', 'crank_arm'));
      const ped = grp('pedal_' + (s > 0 ? 'L' : 'R'), this.crank, s * 0.1, s > 0 ? -0.085 : 0.085, 0);
      const pm = mesh(new THREE.BoxGeometry(0.07, 0.018, 0.05), mat(dark), 'pedal');
      ped.add(pm);
      this.pedals[s > 0 ? 'L' : 'R'] = ped;
    }
    // Klingel
    const bell = mesh(new THREE.SphereGeometry(0.018, 6, 4), mat('#d8d8dc'), 'bell');
    bell.position.set(0.12, 0.69, 0.2);
    L.add(bell);

    this.seat = grp('seat_anchor', L, 0, 0.525, -0.1);
    this.wheelAngle = 0;
    this.root.traverse((o) => { o.userData.actor = id; });
  }

  // dist: zurueckgelegter Weg (m), wobble: Wackeln 0..1, t: Zeit
  update(state, t) {
    const R = this.R;
    const ang = state.dist / R;
    this.wheelF.rotation.x = ang;
    this.wheelB.rotation.x = ang;
    this.crank.rotation.x = ang * 0.5 + (state.crank0 || 0);
    for (const k of ['L', 'R']) this.pedals[k].rotation.x = -this.crank.rotation.x;
    const wb = state.wobble || 0;
    const roll = wb * (Math.sin(t * 2.3 + 0.4) * 5.5 + Math.sin(t * 5.1 + 1.3) * 2.2) * D2R + (state.lean || 0) * D2R;
    this.lean.rotation.z = roll;
    this.steer = wb * Math.sin(t * 2.3 - 0.6) * 9 * D2R;
  }

  anchor(name, out = new THREE.Vector3()) {
    this.root.updateWorldMatrix(true, true);
    switch (name) {
      case 'seat': return this.seat.localToWorld(out.set(0, 0, 0));
      case 'saddleBack': return this.lean.localToWorld(out.set(0, 0.585, -0.325));
      case 'saddleRear': return this.lean.localToWorld(out.set(0, 0.52, -0.27));
      case 'saddle': return this.lean.localToWorld(out.set(0, 0.52, -0.14));
      case 'gripL': return this.lean.localToWorld(out.set(0.22, 0.69, 0.18));
      case 'gripR': return this.lean.localToWorld(out.set(-0.22, 0.69, 0.18));
      case 'pedalL': return this.pedals.L.localToWorld(out.set(0, 0.05, 0.0));
      case 'pedalR': return this.pedals.R.localToWorld(out.set(0, 0.05, 0.0));
      case 'root': return this.root.localToWorld(out.set(0, 0, 0));
      default: throw new Error('Unbekannter Anker ' + name + ' am Fahrrad');
    }
  }
}

// ---------------------------------------------------------------- Karton

export function makeBox(w = 0.46, h = 0.34, d = 0.36, name = 'box') {
  const g = new THREE.Group();
  g.name = name;
  const b = mesh(new RoundedBoxGeometry(w, h, d, 1, 0.01), mat('#c89f6e'), 'carton');
  b.position.y = h / 2;
  g.add(b);
  const tape = mesh(new THREE.BoxGeometry(0.07, 0.006, d + 0.004), mat('#e6d7b0'), 'carton_tape');
  tape.position.y = h + 0.002;
  g.add(tape);
  const tape2 = mesh(new THREE.BoxGeometry(0.07, h * 0.3, 0.006), mat('#e6d7b0'), 'carton_tape');
  tape2.position.set(0, h * 0.85, d / 2 + 0.002);
  g.add(tape2);
  return g;
}

export class Box {
  constructor(id, spec = {}) {
    this.id = id;
    this.kind = 'box';
    const [w, h, d] = spec.size || [0.46, 0.34, 0.36];
    this.size = [w, h, d];
    this.root = makeBox(w, h, d, 'box_' + id);
    this.root.traverse((o) => { o.userData.actor = id; });
  }
  update() {}
  anchor(name, out = new THREE.Vector3()) {
    this.root.updateWorldMatrix(true, true);
    const [w, h] = this.size;
    switch (name) {
      case 'sideL': return this.root.localToWorld(out.set(w / 2 + 0.03, h * 0.45, 0));
      case 'sideR': return this.root.localToWorld(out.set(-w / 2 - 0.03, h * 0.45, 0));
      case 'root': return this.root.localToWorld(out.set(0, h / 2, 0));
      default: throw new Error('Unbekannter Anker ' + name + ' am Karton');
    }
  }
}

// ---------------------------------------------------------------- Auto

export class Car {
  // Kleines blaues Auto mit Innenraum. Hohe Kabine, damit die grossen Koepfe Platz haben.
  // Lokal: +Z vorn, +X linke Seite (Fahrer), -X rechte Seite (Beifahrertuer, Fenster versenkbar).
  constructor(id, spec = {}) {
    this.id = id;
    this.kind = 'car';
    const color = spec.color || '#3e6db5';
    const dark = '#26282d', seatC = '#3b3f48', trim = '#2c2f36';
    this.R = 0.32;
    const W = 1.72, HW = W / 2;
    this.W = W;
    this.root = grp('car_' + id, null);
    const body = grp('car_body', this.root);
    this.body = body;
    const extrudeX = (pts, x0, x1, c, name) => {
      const shp = new THREE.Shape();
      pts.forEach(([z, y], i) => (i ? shp.lineTo(z, y) : shp.moveTo(z, y)));
      shp.closePath();
      const g = new THREE.ExtrudeGeometry(shp, { depth: x1 - x0, bevelEnabled: false });
      g.rotateY(-Math.PI / 2);         // Profil-z -> Auto-z, Extrusion -> -x
      g.translate(x1, 0, 0);
      return mesh(g, mat(c), name);
    };
    const BELT = 0.97, ROOF = 1.7, ZF = 0.84, ZB = -0.56, ZR = -1.42;
    // Vorderteil, Heckteil (ueber die ganze Breite), Boden
    body.add(extrudeX([[1.86, 0.26], [1.88, 0.64], [1.76, 0.84], [0.86, BELT], [ZF, BELT], [ZF, 0.26]], -HW, HW, color, 'car_front'));
    body.add(extrudeX([[ZB, 0.26], [ZB, BELT], [-1.74, 1.0], [-1.86, 0.9], [-1.88, 0.26]], -HW, HW, color, 'car_rear'));
    const floorM = mesh(new THREE.BoxGeometry(W, 0.14, ZF - ZB), mat(trim), 'car_floor');
    floorM.position.set(0, 0.33, (ZF + ZB) / 2);
    body.add(floorM);
    for (const sx of [1, -1]) {
      const sill = mesh(new THREE.BoxGeometry(0.08, 0.14, ZF - ZB), mat(color), 'car_sill');
      sill.position.set(sx * (HW - 0.04), 0.33, (ZF + ZB) / 2);
      body.add(sill);
    }
    // Fahrertuer (zu, Teil der Karosserie)
    body.add(extrudeX([[ZF, 0.3], [ZF, BELT], [ZB, BELT], [ZB, 0.3]], HW - 0.07, HW, color, 'door_driver'));
    // Beifahrertuer mit Scharnier an der Vorderkante
    this.door = grp('door_passenger', body, -HW, 0, ZF);
    const doorPanel = extrudeX([[0, 0.3], [0, BELT], [ZB - ZF, BELT], [ZB - ZF, 0.3]], 0, 0.07, color, 'door_passenger_panel');
    this.door.add(doorPanel);
    const handleO = mesh(new THREE.BoxGeometry(0.03, 0.03, 0.15), mat('#cfd3da'), 'door_handle');
    handleO.position.set(-0.01, 0.84, ZB - ZF + 0.25);
    this.door.add(handleO);
    const innerTrim = mesh(new THREE.BoxGeometry(0.02, 0.5, ZF - ZB - 0.1), mat(trim), 'door_inner_trim');
    innerTrim.position.set(0.075, 0.66, (ZB - ZF) / 2);
    this.door.add(innerTrim);
    // Kabine: Saeulen, Dach, Scheiben
    const glass = new THREE.MeshStandardMaterial({ color: '#b9d0e0', roughness: 0.2, metalness: 0, transparent: true, opacity: 0.12, flatShading: true, depthWrite: false, side: THREE.DoubleSide });
    this.glass = glass;
    const roof = mesh(new RoundedBoxGeometry(W - 0.1, 0.07, 0.05 - ZR + 0.08, 1, 0.025), mat(color), 'car_roof');
    roof.position.set(0, ROOF, (0.05 + ZR) / 2);
    body.add(roof);
    const pillar = (a, b, n) => body.add(rod(a, b, 0.04, color, n, 6));
    for (const sx of [1, -1]) {
      const x = sx * (HW - 0.06);
      pillar([x, BELT, 0.86], [x, ROOF, 0.05], 'a_pillar');
      pillar([x, BELT, ZB], [x, ROOF, ZB], 'b_pillar');
      pillar([x, 1.0, -1.74], [x, ROOF, ZR], 'c_pillar');
      pillar([x, ROOF - 0.02, 0.05], [x, ROOF - 0.02, ZR], 'roof_rail');
    }
    const pane = (pts, name) => {
      const shp = new THREE.Shape();
      pts.forEach(([z, y], i) => (i ? shp.lineTo(z, y) : shp.moveTo(z, y)));
      shp.closePath();
      const g = new THREE.ShapeGeometry(shp);
      g.rotateY(-Math.PI / 2);
      return mesh(g, glass, name, { cast: false, receive: false });
    };
    const ws = new THREE.PlaneGeometry(W - 0.16, Math.hypot(0.86 - 0.05, ROOF - BELT));
    const wsm = mesh(ws, glass, 'windshield', { cast: false, receive: false });
    wsm.position.set(0, (ROOF + BELT) / 2, (0.86 + 0.05) / 2);
    wsm.rotation.x = -Math.atan2(0.86 - 0.05, ROOF - BELT);
    body.add(wsm);
    const rw = new THREE.PlaneGeometry(W - 0.16, Math.hypot(-1.74 - ZR, ROOF - 1.0));
    const rwm = mesh(rw, glass, 'rear_window', { cast: false, receive: false });
    rwm.position.set(0, (ROOF + 1.0) / 2, (-1.74 + ZR) / 2);
    rwm.rotation.x = Math.atan2(1.74 + ZR, ROOF - 1.0);
    body.add(rwm);
    // Seitenscheiben: links vorn/hinten, rechts hinten fest
    const frontWin = [[0.84, BELT], [0.06, ROOF - 0.03], [ZB, ROOF - 0.03], [ZB, BELT]];
    const backWin = [[ZB, BELT], [ZB, ROOF - 0.03], [ZR, ROOF - 0.03], [-1.72, 1.02]];
    const lf = pane(frontWin, 'side_window_front_l'); lf.position.x = HW - 0.06; body.add(lf);
    const lb = pane(backWin, 'side_window_back_l'); lb.position.x = HW - 0.06; body.add(lb);
    const rb = pane(backWin, 'side_window_back_r'); rb.position.x = -HW + 0.06; body.add(rb);
    // Beifahrerfenster in der Tuer (faehrt nach unten)
    this.winHolder = grp('passenger_window', this.door, 0.04, 0, -ZF);
    this.win = pane(frontWin, 'side_window_front_r');
    this.winHolder.add(this.win);
    this.winEdge = mesh(new THREE.BoxGeometry(0.03, 0.025, 0.62), mat('#1e2026'), 'window_edge');
    this.door.add(this.winEdge);
    this.winH = ROOF - 0.03 - BELT;
    this.BELT = BELT;

    // Innenraum
    const seat = (x, z, n) => {
      const sgrp = grp(n, body, x, 0, z);
      const c = mesh(new RoundedBoxGeometry(0.52, 0.1, 0.5, 1, 0.03), mat(seatC), 'seat_cushion');
      c.position.set(0, 0.45, 0);
      sgrp.add(c);
      const b = mesh(new RoundedBoxGeometry(0.52, 0.66, 0.12, 1, 0.03), mat(seatC), 'seat_back');
      b.position.set(0, 0.82, -0.3);
      b.rotation.x = -0.18;
      sgrp.add(b);
      const h = mesh(new RoundedBoxGeometry(0.26, 0.16, 0.1, 1, 0.03), mat(seatC), 'headrest');
      h.position.set(0, 1.24, -0.38);
      sgrp.add(h);
      return sgrp;
    };
    seat(0.38, 0.12, 'seat_front_L');
    seat(-0.38, 0.12, 'seat_front_R');
    const rear = mesh(new RoundedBoxGeometry(W - 0.28, 0.12, 0.5, 1, 0.03), mat(seatC), 'rear_bench');
    rear.position.set(0, 0.46, -0.95);
    body.add(rear);
    const rearBack = mesh(new RoundedBoxGeometry(W - 0.28, 0.6, 0.1, 1, 0.03), mat(seatC), 'rear_bench_back');
    rearBack.position.set(0, 0.8, -1.22);
    body.add(rearBack);
    const dash = mesh(new RoundedBoxGeometry(W - 0.16, 0.22, 0.4, 1, 0.05), mat(trim), 'dashboard');
    dash.position.set(0, 0.93, 0.74);
    body.add(dash);
    const dashTop = mesh(new RoundedBoxGeometry(W - 0.2, 0.06, 0.32, 1, 0.02), mat('#3a3e47'), 'dashboard_top');
    dashTop.position.set(0, 1.05, 0.72);
    body.add(dashTop);
    const console = mesh(new RoundedBoxGeometry(0.2, 0.22, 0.6, 1, 0.03), mat(trim), 'center_console');
    console.position.set(0, 0.5, 0.35);
    body.add(console);
    const gear = mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.14, 5), mat('#15161a'), 'gear_stick');
    gear.position.set(0, 0.67, 0.45);
    body.add(gear);
    this.wheelPos = new THREE.Vector3(0.38, 1.08, 0.5);
    const sw = grp('steering', body, 0.38, 1.08, 0.5);
    sw.rotation.x = -0.5;
    sw.add(mesh(new THREE.TorusGeometry(0.17, 0.022, 5, 14), mat('#1e2026'), 'steering_wheel'));
    sw.add(mesh(new THREE.BoxGeometry(0.3, 0.03, 0.03), mat('#1e2026'), 'steering_spoke'));
    sw.add(rod([0, 0, 0], [0, 0, 0.25], 0.025, '#1e2026', 'steering_column'));
    this.steering = sw;
    // Haltegriff ueber der Beifahrertuer
    const hg = grp('grab_handle', body, -HW + 0.13, ROOF - 0.12, 0.02);
    hg.add(rod([0, 0.07, -0.11], [0, -0.02, -0.09], 0.016, '#2a2c31', 'grab_handle_part'));
    hg.add(rod([0, -0.02, -0.09], [0, -0.02, 0.09], 0.016, '#2a2c31', 'grab_handle_part'));
    hg.add(rod([0, -0.02, 0.09], [0, 0.07, 0.11], 0.016, '#2a2c31', 'grab_handle_part'));
    this.handle = hg;
    // Innenspiegel
    const mirrorIn = mesh(new RoundedBoxGeometry(0.22, 0.06, 0.03, 1, 0.01), mat('#2a2c31'), 'inner_mirror');
    mirrorIn.position.set(0, ROOF - 0.15, 0.12);
    body.add(mirrorIn);

    // Lichter, Kennzeichen, Spiegel, Stossstangen
    const lightMat = (c, e, i) => new THREE.MeshStandardMaterial({ color: c, emissive: e, emissiveIntensity: i, roughness: 0.5, metalness: 0, flatShading: true });
    this.blinkMats = [];
    for (const sx of [1, -1]) {
      const hl = mesh(new RoundedBoxGeometry(0.3, 0.11, 0.05, 1, 0.02), lightMat('#f4f1e6', '#fff3d6', 0.2), 'headlight');
      hl.position.set(sx * 0.58, 0.68, 1.86);
      body.add(hl);
      const tl = mesh(new RoundedBoxGeometry(0.1, 0.24, 0.05, 1, 0.02), lightMat('#b3242c', '#ff2a2a', 0.35), 'taillight');
      tl.position.set(sx * 0.74, 0.74, -1.88);
      body.add(tl);
      const bm = lightMat('#d9822b', '#ffa030', 0.0);
      this.blinkMats.push(bm);
      for (const z of [1.84, -1.87]) {
        const bl = mesh(new RoundedBoxGeometry(0.09, 0.06, 0.04, 1, 0.01), bm, 'turn_signal');
        bl.position.set(sx * 0.78, z > 0 ? 0.56 : 0.56, z);
        body.add(bl);
      }
      const mir = mesh(new RoundedBoxGeometry(0.16, 0.1, 0.08, 1, 0.02), mat(color), 'mirror');
      mir.position.set(sx * (HW + 0.08), 1.02, 0.74);
      body.add(mir);
    }
    for (const z of [1.88, -1.9]) {
      const plate = mesh(new THREE.BoxGeometry(0.5, 0.11, 0.02), mat('#f3f3ef'), 'number_plate');
      plate.position.set(0, 0.44, z);
      body.add(plate);
      const bumper = mesh(new RoundedBoxGeometry(W + 0.04, 0.16, 0.14, 1, 0.04), mat('#33363d'), 'bumper');
      bumper.position.set(0, 0.33, z > 0 ? 1.82 : -1.84);
      body.add(bumper);
    }
    // Raeder (vorn lenkbar)
    this.wheels = [];
    this.frontWheels = [];
    for (const z of [1.2, -1.2]) for (const sx of [1, -1]) {
      const w = grp('car_wheel', this.root, sx * 0.76, this.R, z);
      const spin = grp('car_wheel_spin', w);
      const tire = mesh(new THREE.CylinderGeometry(this.R, this.R, 0.21, 12), mat(dark), 'car_tire');
      tire.rotation.z = Math.PI / 2;
      spin.add(tire);
      const cap = mesh(new THREE.CylinderGeometry(this.R * 0.55, this.R * 0.55, 0.215, 8), mat('#b9bdc6'), 'hubcap');
      cap.rotation.z = Math.PI / 2;
      spin.add(cap);
      this.wheels.push(spin);
      if (z > 0) this.frontWheels.push(w);
      const arch = mesh(new THREE.CylinderGeometry(0.39, 0.39, 0.02, 10, 1, false, 0, Math.PI), mat('#1d1f24'), 'wheel_arch');
      arch.position.set(sx * (HW + 0.002), 0.32, z);
      arch.rotation.set(0, 0, Math.PI / 2);
      body.add(arch);
    }
    // Sitzpunkte
    this.mounts = {
      driver: grp('driver_anchor', body, 0.38, 0.5, 0.12),
      passenger: grp('passenger_anchor', body, -0.38, 0.5, 0.12),
    };
    this.driver = this.mounts.driver;
    this.root.traverse((o) => { o.userData.actor = id; });
  }

  update(state, t) {
    const ang = state.dist / this.R;
    for (const w of this.wheels) w.rotation.x = ang;
    const steer = (state.steer || 0) * D2R;
    for (const w of this.frontWheels) w.rotation.y = steer;
    this.steering.rotation.z = -steer * 3;
    this.door.rotation.y = (state.door || 0) * 62 * D2R;
    const k = Math.min(1, Math.max(0, state.window || 0));
    this.win.scale.y = 1;
    this.winHolder.position.y = 0;
    // Scheibe faehrt nach unten in die Tuer: von oben her kuerzen
    this.win.visible = k < 0.98;
    this.win.scale.y = 1 - k;
    this.winHolder.position.y = this.BELT * k;
    this.winEdge.position.set(0.04, this.BELT + this.winH * (1 - k), -1.09);
    this.winEdge.visible = k > 0.02;
    const on = (state.blink || 0) > 0.5 && Math.floor((t || 0) * 3) % 2 === 0;
    for (const m of this.blinkMats) m.emissiveIntensity = on ? 2.2 : 0;
  }

  anchor(name, out = new THREE.Vector3()) {
    this.root.updateWorldMatrix(true, true);
    switch (name) {
      case 'driver': return this.mounts.driver.localToWorld(out.set(0, 0, 0));
      case 'passenger': return this.mounts.passenger.localToWorld(out.set(0, 0, 0));
      case 'driverHead': return this.body.localToWorld(out.set(0.38, 1.3, 0.1));
      case 'passengerHead': return this.body.localToWorld(out.set(-0.38, 1.3, 0.1));
      case 'wheelL': return this.steering.localToWorld(out.set(0.15, 0.06, 0.02));
      case 'wheelR': return this.steering.localToWorld(out.set(-0.15, 0.06, 0.02));
      case 'handle': return this.handle.localToWorld(out.set(0.04, -0.08, 0));
      case 'doorEdge': return this.door.localToWorld(out.set(-0.04, 0.95, -1.3));
      case 'doorTop': return this.door.localToWorld(out.set(-0.04, 1.0, -1.0));
      case 'sill': return this.body.localToWorld(out.set(-0.74, 1.02, 0.02));
      case 'windowOut': return this.body.localToWorld(out.set(-1.15, 1.22, -0.2));
      case 'root': return this.root.localToWorld(out.set(0, 0.7, 0));
      default: throw new Error('Unbekannter Anker ' + name + ' am Auto');
    }
  }
}

// ---------------------------------------------------------------- Fuehrerschein

// Rosa Karte (ca. 11 x 7 cm, fuer die Kamera etwas groesser), Foto des Sohns OHNE Augen.
function licenseTexture(spec) {
  const c = document.createElement('canvas');
  c.width = 704; c.height = 448;
  const g = c.getContext('2d');
  g.fillStyle = '#f4b8c6';
  g.fillRect(0, 0, 704, 448);
  // feine Wellenlinien
  g.strokeStyle = 'rgba(255,255,255,.35)';
  g.lineWidth = 3;
  for (let y = 60; y < 448; y += 34) {
    g.beginPath();
    for (let x = 0; x <= 704; x += 8) g.lineTo(x, y + Math.sin(x / 40) * 6);
    g.stroke();
  }
  // blaues Band links
  g.fillStyle = '#2f4fa8';
  g.fillRect(0, 0, 70, 448);
  g.fillStyle = '#ffffff';
  g.font = '600 44px Inter, sans-serif';
  g.textAlign = 'center';
  g.fillText('D', 35, 420);
  // Schriftzug
  g.fillStyle = '#7a2440';
  g.font = '600 50px Inter, sans-serif';
  g.textAlign = 'left';
  g.fillText('FÜHRERSCHEIN', 96, 74);
  // Foto: Kopf ohne Augen (Haare, Brauen hoch, Nase, Mund), roter Hoodie
  const px = 100, py = 112, pw = 196, ph = 250;
  g.fillStyle = '#dfe7ef';
  g.fillRect(px, py, pw, ph);
  g.fillStyle = spec.hoodie || '#d7263d';
  g.beginPath(); g.ellipse(px + pw / 2, py + ph + 30, 110, 110, 0, Math.PI, 0); g.fill();
  const cx = px + pw / 2, cy = py + 128, r = 66;
  g.fillStyle = spec.skin || '#efc19d';
  g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.fill();
  g.fillStyle = spec.hair || '#6b4226';
  g.beginPath(); g.arc(cx, cy, r + 4, Math.PI * 1.02, Math.PI * 1.98); g.lineTo(cx + r, cy - r * 0.5); g.quadraticCurveTo(cx, cy - r * 0.78, cx - r, cy - r * 0.5); g.fill();
  g.fillStyle = spec.brow || '#4a2e1b';
  g.fillRect(cx - r * 0.5, cy - r * 0.6, r * 0.34, r * 0.13);
  g.fillRect(cx + r * 0.16, cy - r * 0.6, r * 0.34, r * 0.13);
  g.fillStyle = '#e0aa86';
  g.beginPath(); g.ellipse(cx, cy + r * 0.04, r * 0.12, r * 0.1, 0, 0, Math.PI * 2); g.fill();
  g.strokeStyle = '#5a2e26';
  g.lineWidth = 5;
  g.beginPath(); g.moveTo(cx - r * 0.2, cy + r * 0.36); g.quadraticCurveTo(cx, cy + r * 0.46, cx + r * 0.2, cy + r * 0.36); g.stroke();
  // Textzeilen als graue Balken
  g.fillStyle = 'rgba(80,40,60,.55)';
  for (let i = 0; i < 6; i++) g.fillRect(330, 130 + i * 42, 300 - (i % 3) * 60, 16);
  g.fillStyle = '#7a2440';
  g.font = '600 26px Inter, sans-serif';
  g.fillText('B', 330, 410);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export class License {
  constructor(id, spec = {}, cast = {}) {
    this.id = id;
    this.kind = 'license';
    const holder = cast[spec.photoOf] || {};
    this.root = grp('license_' + id, null);
    const card = new THREE.Group();
    card.name = 'license_card';
    this.root.add(card);
    const w = spec.size?.[0] ?? 0.11, h = spec.size?.[1] ?? 0.07;
    const edge = mesh(new RoundedBoxGeometry(w, h, 0.004, 1, 0.006), mat('#e9a8b8'), 'license_edge');
    card.add(edge);
    const face = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.98, h * 0.97),
      new THREE.MeshStandardMaterial({ map: null, roughness: 0.6, metalness: 0, color: '#ffffff' }));
    face.name = 'license_face';
    face.position.z = 0.0025;
    card.add(face);
    this.face = face;
    this.spec = { skin: holder.skin, hair: holder.hair?.color, hoodie: holder.top?.color };
    this.card = card;
    this.root.traverse((o) => { o.userData.actor = id; });
  }
  update() {
    if (!this.face.material.map) { this.face.material.map = licenseTexture(this.spec); this.face.material.needsUpdate = true; }
  }
  anchor(name, out = new THREE.Vector3()) {
    this.root.updateWorldMatrix(true, true);
    if (name === 'center' || name === 'root') return this.card.localToWorld(out.set(0, 0, 0));
    throw new Error('Unbekannter Anker ' + name + ' am Fuehrerschein');
  }
}

function rodV(a, b, r, color, name) { return rod(a, b, r, color, name, 6); }
