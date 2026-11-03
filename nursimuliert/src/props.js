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
  constructor(id, spec = {}) {
    this.id = id;
    this.kind = 'car';
    const color = spec.color || '#3e6db5';
    const dark = '#26282d';
    this.R = 0.3;
    const W = 1.64;
    this.root = grp('car_' + id, null);
    const body = grp('car_body', this.root);
    this.body = body;

    // Unterteil: Seitenprofil (Z/Y), entlang X extrudiert
    const prof = [
      [1.8, 0.24], [1.82, 0.6], [1.7, 0.78], [0.78, 0.9], [-1.66, 0.94], [-1.78, 0.88], [-1.8, 0.24],
    ];
    const shp = new THREE.Shape();
    prof.forEach(([z, y], i) => (i ? shp.lineTo(z, y) : shp.moveTo(z, y)));
    shp.closePath();
    const eg = new THREE.ExtrudeGeometry(shp, { depth: W - 0.08, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04, bevelSegments: 1 });
    eg.translate(0, 0, -(W - 0.08) / 2);
    eg.rotateY(-Math.PI / 2); // Profil-x -> Auto-z, Extrusion -> Breite (x)
    const lower = mesh(eg, mat(color), 'car_lower');
    body.add(lower);
    // Radkaesten (dunkel, angedeutet)
    for (const z of [1.18, -1.18]) for (const s of [1, -1]) {
      const arch = mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.02, 10, 1, false, 0, Math.PI), mat('#1d1f24'), 'wheel_arch');
      arch.position.set(s * (W / 2 + 0.003), 0.3, z);
      arch.rotation.set(0, 0, Math.PI / 2);
      body.add(arch);
    }

    // Kabine: Saeulen, Dach, Glas
    const glass = new THREE.MeshStandardMaterial({ color: '#a9c3d6', roughness: 0.25, metalness: 0, transparent: true, opacity: 0.32, flatShading: true, depthWrite: false, side: THREE.DoubleSide });
    const roofY = 1.42, roofF = 0.02, roofB = -1.32;
    const base = 0.92;
    const roof = mesh(new RoundedBoxGeometry(W - 0.12, 0.06, roofF - roofB + 0.06, 1, 0.02), mat(color), 'car_roof');
    roof.position.set(0, roofY, (roofF + roofB) / 2);
    body.add(roof);
    const pillar = (s, z0, y0, z1, y1, n) => body.add(rodV([s * (W / 2 - 0.08), y0, z0], [s * (W / 2 - 0.08), y1, z1], 0.035, color, n));
    for (const s of [1, -1]) {
      pillar(s, 0.8, base, roofF, roofY, 'a_pillar');
      pillar(s, -0.55, base, -0.55, roofY, 'b_pillar');
    }
    // Scheiben
    const pane = (w, h, name) => mesh(new THREE.PlaneGeometry(w, h), glass, name, { cast: false, receive: false });
    const ws = pane(W - 0.16, Math.hypot(0.78 - roofF, roofY - base), 'windshield');
    ws.position.set(0, (roofY + base) / 2, (0.8 + roofF) / 2);
    ws.rotation.x = -Math.atan2(0.78 - roofF, roofY - base);
    body.add(ws);
    for (const s of [1, -1]) {
      const sideFront = new THREE.Shape();
      sideFront.moveTo(0.78, base); sideFront.lineTo(roofF, roofY - 0.02); sideFront.lineTo(-0.55, roofY - 0.02); sideFront.lineTo(-0.55, base);
      const sideBack = new THREE.Shape();
      sideBack.moveTo(-0.55, base); sideBack.lineTo(-0.55, roofY - 0.02); sideBack.lineTo(roofB, roofY - 0.02); sideBack.lineTo(-1.66, base + 0.04);
      for (const [shape, n] of [[sideFront, 'side_window_front'], [sideBack, 'side_window_back']]) {
        const g = new THREE.ShapeGeometry(shape);
        g.rotateY(-Math.PI / 2); // Form-x -> Auto-z
        const m = mesh(g, glass, n, { cast: false, receive: false });
        m.position.x = s * (W / 2 - 0.075);
        body.add(m);
      }
    }
    // Heckklappe (scharniert an der Dachkante)
    this.hatch = grp('hatch', body, 0, roofY, roofB);
    const hw = pane(W - 0.16, Math.hypot(1.66 + roofB, roofY - base - 0.04), 'rear_window');
    const hy = -(roofY - base - 0.04) / 2, hz = -(1.66 + roofB) / 2;
    hw.position.set(0, hy, hz);
    hw.rotation.x = Math.atan2(1.66 + roofB, roofY - base - 0.04);
    this.hatch.add(hw);
    this.hatch.add(rodV([W / 2 - 0.08, 0, 0], [W / 2 - 0.08, -(roofY - base - 0.04), -(1.66 + roofB)], 0.035, color, 'c_pillar'));
    this.hatch.add(rodV([-(W / 2 - 0.08), 0, 0], [-(W / 2 - 0.08), -(roofY - base - 0.04), -(1.66 + roofB)], 0.035, color, 'c_pillar'));
    const hatchLow = mesh(new RoundedBoxGeometry(W - 0.1, 0.05, 0.06, 1, 0.02), mat(color), 'hatch_edge');
    hatchLow.position.set(0, -(roofY - base - 0.04), -(1.66 + roofB));
    this.hatch.add(hatchLow);

    // Innenraum
    const seat = (x, z, n) => {
      const s = grp(n, body, x, 0, z);
      const c = mesh(new RoundedBoxGeometry(0.5, 0.12, 0.5, 1, 0.03), mat('#3b3f48'), 'seat_cushion');
      c.position.set(0, 0.55, 0);
      s.add(c);
      const b = mesh(new RoundedBoxGeometry(0.5, 0.6, 0.12, 1, 0.03), mat('#3b3f48'), 'seat_back');
      b.position.set(0, 0.88, -0.25);
      b.rotation.x = -0.15;
      s.add(b);
      return s;
    };
    seat(0.36, 0.05, 'seat_front_L');
    seat(-0.36, 0.05, 'seat_front_R');
    const rear = mesh(new RoundedBoxGeometry(W - 0.25, 0.12, 0.5, 1, 0.03), mat('#3b3f48'), 'rear_bench');
    rear.position.set(0, 0.55, -0.85);
    body.add(rear);
    const rearBack = mesh(new RoundedBoxGeometry(W - 0.25, 0.55, 0.1, 1, 0.03), mat('#3b3f48'), 'rear_bench_back');
    rearBack.position.set(0, 0.85, -1.1);
    body.add(rearBack);
    const dash = mesh(new RoundedBoxGeometry(W - 0.2, 0.18, 0.35, 1, 0.04), mat('#2c2f36'), 'dashboard');
    dash.position.set(0, 0.92, 0.72);
    body.add(dash);
    const wheelS = mesh(new THREE.TorusGeometry(0.15, 0.022, 5, 12), mat('#1e2026'), 'steering_wheel');
    wheelS.position.set(0.36, 1.0, 0.5);
    wheelS.rotation.x = -0.45;
    body.add(wheelS);
    // Kartons auf der Rueckbank und im Kofferraum
    const boxes = [
      [0.35, 0.62, -0.85, 0.46, 0.36, 0.4, 0.1], [-0.3, 0.62, -0.85, 0.5, 0.42, 0.38, -0.08],
      [0.05, 0.98, -0.9, 0.42, 0.28, 0.34, 0.05], [0.4, 0.5, -1.45, 0.42, 0.34, 0.3, 0.0],
    ];
    for (const [x, y, z, w, h, d, ry] of (spec.boxes === false ? [] : boxes)) {
      const b = makeBox(w, h, d, 'car_box');
      b.position.set(x, y, z);
      b.rotation.y = ry;
      body.add(b);
    }

    // Lichter, Kennzeichen, Spiegel, Griffe
    for (const s of [1, -1]) {
      const hl = mesh(new RoundedBoxGeometry(0.28, 0.1, 0.05, 1, 0.02), new THREE.MeshStandardMaterial({ color: '#f4f1e6', emissive: '#fff3d6', emissiveIntensity: 0.25, roughness: 0.5, metalness: 0, flatShading: true }), 'headlight');
      hl.position.set(s * 0.56, 0.66, 1.82);
      body.add(hl);
      const tl = mesh(new RoundedBoxGeometry(0.1, 0.22, 0.05, 1, 0.02), new THREE.MeshStandardMaterial({ color: '#b3242c', emissive: '#ff2a2a', emissiveIntensity: 0.4, roughness: 0.5, metalness: 0, flatShading: true }), 'taillight');
      tl.position.set(s * 0.72, 0.72, -1.81);
      body.add(tl);
      const mir = mesh(new RoundedBoxGeometry(0.16, 0.1, 0.08, 1, 0.02), mat(color), 'mirror');
      mir.position.set(s * (W / 2 + 0.08), 1.0, 0.72);
      body.add(mir);
      for (const z of [0.25, -0.75]) {
        const h = mesh(new THREE.BoxGeometry(0.03, 0.03, 0.14), mat('#cfd3da'), 'door_handle');
        h.position.set(s * (W / 2 + 0.035), 0.82, z);
        body.add(h);
      }
      const seam = mesh(new THREE.BoxGeometry(0.01, 0.6, 0.012), mat('#2b4a7f'), 'door_seam');
      seam.position.set(s * (W / 2 + 0.035), 0.6, -0.55);
      body.add(seam);
    }
    for (const z of [1.84, -1.83]) {
      const p = mesh(new THREE.BoxGeometry(0.5, 0.11, 0.02), mat('#f3f3ef'), 'number_plate');
      p.position.set(0, 0.42, z);
      body.add(p);
    }
    const bumperF = mesh(new RoundedBoxGeometry(W + 0.04, 0.16, 0.14, 1, 0.04), mat('#33363d'), 'bumper');
    bumperF.position.set(0, 0.32, 1.78);
    body.add(bumperF);
    const bumperB = bumperF.clone();
    bumperB.position.z = -1.78;
    body.add(bumperB);

    // Raeder
    this.wheels = [];
    for (const z of [1.18, -1.18]) for (const s of [1, -1]) {
      const w = grp('car_wheel', this.root, s * 0.735, this.R, z);
      const spin = grp('car_wheel_spin', w);
      const tire = mesh(new THREE.CylinderGeometry(this.R, this.R, 0.2, 12), mat(dark), 'car_tire');
      tire.rotation.z = Math.PI / 2;
      spin.add(tire);
      const cap = mesh(new THREE.CylinderGeometry(this.R * 0.55, this.R * 0.55, 0.205, 8), mat('#b9bdc6'), 'hubcap');
      cap.rotation.z = Math.PI / 2;
      spin.add(cap);
      this.wheels.push(spin);
    }
    this.driver = grp('driver_anchor', body, 0.36, 0.6, -0.02);
    this.root.traverse((o) => { o.userData.actor = id; });
  }

  update(state) {
    const ang = state.dist / this.R;
    for (const w of this.wheels) w.rotation.x = ang;
    this.hatch.rotation.x = (state.hatch || 0) * 72 * D2R;
  }

  anchor(name, out = new THREE.Vector3()) {
    this.root.updateWorldMatrix(true, true);
    switch (name) {
      case 'driver': return this.driver.localToWorld(out.set(0, 0, 0));
      case 'driverHead': return this.body.localToWorld(out.set(0.36, 1.2, 0.0));
      case 'trunk': return this.body.localToWorld(out.set(0, 0.95, -1.5));
      case 'hatchEdge': return this.hatch.localToWorld(out.set(0.3, -0.48, -0.34));
      case 'root': return this.root.localToWorld(out.set(0, 0.7, 0));
      default: throw new Error('Unbekannter Anker ' + name + ' am Auto');
    }
  }
}

function rodV(a, b, r, color, name) { return rod(a, b, r, color, name, 6); }
