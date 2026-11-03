// Zeitachse: liest die Einstellungen aus story/shots.json und setzt fuer einen
// Zeitpunkt t alle Figuren, Requisiten und die Kamera.
//
// Keys innerhalb einer Einstellung haben Zeiten relativ zum Beginn der Einstellung.
// Positionen: Hermite-Interpolation (weich, Durchlauf an Zwischen-Keys, hold:true = Ruhe).
// Gelenke/Posen: weiches Ease-in-out zwischen zwei Keys.
import * as THREE from 'three';
import { DEFAULT_POSE, POSES, resolvePose } from './character.js';
import { D2R, EASE, clamp, lerp, hermiteScalar, findSeg } from './util.js';

const PLACE_FIELDS = new Set(['t', 's', 'off', 'p', 'y', 'h', 'pose', 'ease', 'hold', 'ikL', 'ikR', 'ikFL', 'ikFR', 'look', 'note']);
const PROP_FIELDS = new Set(['wobble', 'lean', 'hatch', 'crank0', 'ry', 'rx', 'rz', 'door', 'window', 'blink', 'steer', 'ax', 'ay', 'az']);
const POSE_EXTRA = { walk: 0, run: 0, swingL: 1, swingR: 1, ikLw: 1, ikRw: 1, ikFLw: 1, ikFRw: 1, lookW: 1, levelFeet: 0, mox: 0, moy: 0, moz: 0, moh: 0 };
const IK_KEYS = ['ikL', 'ikR', 'ikFL', 'ikFR', 'look'];

function fillForward(keys, field) {
  let last;
  for (const k of keys) { if (k[field] !== undefined) last = k[field]; else if (last !== undefined) k[field] = last; }
  let first;
  for (let i = keys.length - 1; i >= 0; i--) { if (keys[i][field] !== undefined) first = keys[i][field]; else if (first !== undefined) keys[i][field] = first; }
}

// Positionen in Zwischen-Keys ohne Wert: zeitlich linear zwischen den Nachbarn
function fillInterp(keys, field) {
  const idx = keys.map((k, i) => (k[field] !== undefined ? i : -1)).filter((i) => i >= 0);
  if (!idx.length) return;
  keys.forEach((k, i) => {
    if (k[field] !== undefined) return;
    const a = [...idx].reverse().find((j) => j < i), b = idx.find((j) => j > i);
    if (a === undefined) { k[field] = keys[b][field]; return; }
    if (b === undefined) { k[field] = keys[a][field]; return; }
    const u = (k.t - keys[a].t) / (keys[b].t - keys[a].t);
    const va = keys[a][field], vb = keys[b][field];
    k[field] = Array.isArray(va) ? va.map((v, d) => v + (vb[d] - v) * u) : va + (vb - va) * u;
  });
}

export class Timeline {
  constructor(story, world) {
    this.story = story;
    this.world = world; // { sets: {name: set}, actors: {id: actor}, scene }
    this.shots = story.shots;
    this._v = new THREE.Vector3();
    this.prepare();
  }

  prepare() {
    for (const shot of this.shots) {
      shot.dur = shot.end - shot.start;
      const set = this.world.sets[shot.set];
      if (!set) throw new Error(`Einstellung ${shot.id}: Ort "${shot.set}" unbekannt`);
      for (const [id, tr] of Object.entries(shot.actors || {})) {
        const actor = this.world.actors[id];
        if (!actor) throw new Error(`Einstellung ${shot.id}: Figur "${id}" fehlt in "cast"`);
        tr.id = id;
        tr.keys = (tr.keys || [{ t: 0 }]).map((k) => ({ ...k })).sort((a, b) => a.t - b.t);
        const isPerson = actor.kind === 'person';
        // Felder pruefen
        for (const k of tr.keys) {
          for (const f of Object.keys(k)) {
            if (PLACE_FIELDS.has(f)) continue;
            if (isPerson && (f in DEFAULT_POSE || f in POSE_EXTRA)) continue;
            if (!isPerson && PROP_FIELDS.has(f)) continue;
            throw new Error(`Einstellung ${shot.id}, ${id}: unbekanntes Feld "${f}"`);
          }
          if (k.pose && !POSES[k.pose]) throw new Error(`Einstellung ${shot.id}, ${id}: unbekannte Pose "${k.pose}"`);
        }
        // Fehlende Werte auffuellen. Bei Personen sind lean/y Pose-Parameter (nicht auffuellen).
        for (const f of ['s', 'off', 'p', 'h']) fillInterp(tr.keys, f);
        if (!isPerson) { fillInterp(tr.keys, 'y'); for (const f of PROP_FIELDS) fillForward(tr.keys, f); }
        tr.isPerson = isPerson;
        if (tr.path && !set.paths[tr.path]) throw new Error(`Einstellung ${shot.id}: Pfad "${tr.path}" fehlt im Ort ${shot.set}`);
        // Posen aufloesen (akkumulierend)
        if (isPerson) {
          let prev = null;
          for (const k of tr.keys) {
            const over = {};
            for (const [f, v] of Object.entries(k)) if (f in DEFAULT_POSE || f in POSE_EXTRA || IK_KEYS.includes(f)) over[f] = v;
            const base = k.pose ? { ...POSE_EXTRA, ...resolvePose(k.pose) } : (prev || { ...POSE_EXTRA, ...resolvePose(null) });
            k.P = { ...base, ...over };
            prev = k.P;
          }
        }
        // Weg- und Phasen-Tabelle (fuer Gangzyklus und Raeder)
        this.buildTables(shot, tr, actor, set);
      }
    }
  }

  placement(shot, tr, tau, set) {
    const keys = tr.keys;
    let x = 0, z = 0, heading = 0;
    if (tr.path) {
      const s = hermiteScalar(keys, tau, (k) => k.s ?? 0);
      const off = hermiteScalar(keys, tau, (k) => k.off ?? 0);
      const p = set.paths[tr.path].at(s, off);
      x = p.x; z = p.z; heading = p.heading;
      if (keys[0].h !== undefined) heading += hermiteScalar(keys, tau, (k) => k.h) * D2R;
    } else if (keys[0].p) {
      x = hermiteScalar(keys, tau, (k) => k.p[0]);
      z = hermiteScalar(keys, tau, (k) => k.p[1]);
      if (keys[0].h !== undefined) heading = hermiteScalar(keys, tau, (k) => k.h) * D2R;
    }
    const y = !tr.isPerson && keys[0].y !== undefined ? hermiteScalar(keys, tau, (k) => k.y) : 0;
    return { x, y, z, heading };
  }

  buildTables(shot, tr, actor, set) {
    if (tr.mount) { tr.dist = null; return; }
    const dt = 1 / 240;
    const n = Math.ceil(shot.dur / dt) + 2;
    const dist = new Float32Array(n), phase = new Float32Array(n);
    let prev = this.placement(shot, tr, 0, set);
    let d = 0, ph = (tr.phase0 || 0) * Math.PI * 2;
    for (let i = 0; i < n; i++) {
      const tau = i * dt;
      const p = this.placement(shot, tr, tau, set);
      const step = Math.hypot(p.x - prev.x, p.z - prev.z);
      d += step;
      if (actor.kind === 'person') {
        const P = this.poseAt(tr, tau);
        const runK = P.run / Math.max(1e-3, P.run + P.walk);
        const stride = lerp(actor.char.B.walkStep, actor.char.B.runStep, clamp(runK, 0, 1));
        ph += (step / (2 * stride)) * Math.PI * 2;
      }
      dist[i] = d; phase[i] = ph;
      prev = p;
    }
    tr.dist = dist; tr.phase = phase; tr.dt = dt;
  }

  lookupTable(arr, tr, tau) {
    if (!arr) return 0;
    const f = clamp(tau / tr.dt, 0, arr.length - 1);
    const i = Math.floor(f), k = f - i;
    return arr[i] + (arr[Math.min(arr.length - 1, i + 1)] - arr[i]) * k;
  }

  // Numerische Pose-Parameter zwischen Keys mit Ease
  poseAt(tr, tau) {
    const keys = tr.keys;
    const { i, k } = findSeg(keys, tau);
    const a = keys[i].P;
    if (i >= keys.length - 1 || k <= 0) return { ...a };
    const b = keys[i + 1].P;
    const e = (EASE[keys[i + 1].ease || 'inOut'])(k);
    const out = {};
    for (const f of Object.keys(a)) {
      if (typeof a[f] === 'number' && typeof b[f] === 'number') out[f] = lerp(a[f], b[f], e);
      else out[f] = a[f];
    }
    for (const f of Object.keys(b)) if (!(f in out)) out[f] = b[f];
    out._seg = { a, b, e };
    return out;
  }

  shotAt(t) {
    let s = this.shots[0];
    for (const sh of this.shots) if (t >= sh.start) s = sh;
    return s;
  }

  // Anker "figur:punkt" -> Weltposition
  anchorPos(spec, out = new THREE.Vector3()) {
    if (Array.isArray(spec)) return out.set(spec[0], spec[1], spec[2]);
    const [id, name] = spec.split(':');
    const a = this.world.actors[id];
    if (!a) throw new Error('Anker: unbekannte Figur ' + id);
    return a.obj.anchor(name, out);
  }

  ikTarget(spec, actor) {
    if (!spec) return null;
    if (typeof spec === 'string' || Array.isArray(spec)) return this.anchorPos(spec, new THREE.Vector3());
    if (spec.local) {
      actor.char.root.updateWorldMatrix(true, false);
      return actor.char.root.localToWorld(new THREE.Vector3(...spec.local));
    }
    if (spec.anchor) {
      const p = this.anchorPos(spec.anchor, new THREE.Vector3());
      if (spec.off) p.add(new THREE.Vector3(...spec.off));
      return p;
    }
    return null;
  }

  // IK-Ziel zwischen zwei Keys mischen
  blendIK(P, field, actor) {
    const seg = P._seg;
    const wa = (sp, Pk) => (sp ? (sp.w ?? Pk[field + 'w'] ?? 1) : 0);
    if (!seg) {
      const sp = P[field];
      const tgt = this.ikTarget(sp, actor);
      return tgt ? { w: wa(sp, P), pos: tgt } : null;
    }
    const sa = seg.a[field], sb = seg.b[field];
    const ta = this.ikTarget(sa, actor), tb = this.ikTarget(sb, actor);
    if (!ta && !tb) return null;
    const w = lerp(wa(sa, seg.a), wa(sb, seg.b), seg.e);
    const pos = ta && tb ? ta.lerp(tb, seg.e) : (ta || tb);
    return { w, pos };
  }

  applyGait(P, phase) {
    const w = P.walk || 0, r = P.run || 0;
    if (w + r < 0.001) return;
    const hipA = 24 * w + 40 * r, kneeA = 38 * w + 80 * r, armA = 18 * w + 36 * r, elbA = 6 * w + 55 * r;
    const bob = 0.022 * w + 0.045 * r;
    const s = Math.sin(phase), c = Math.cos(phase);
    P.hipL += hipA * s; P.hipR -= hipA * s;
    P.kneeL += kneeA * Math.max(0, c) + 12 * r; P.kneeR += kneeA * Math.max(0, -c) + 12 * r;
    P.shL -= armA * s * P.swingL; P.shR += armA * s * P.swingR;
    P.elL += elbA * P.swingL; P.elR += elbA * P.swingR;
    P.y += bob * (Math.abs(c) - 0.6);
    P.lean += 2 * w + 7 * r;
    P.twist -= (4 * w + 7 * r) * s;
  }

  // Setzt alles fuer Zeit t. Gibt Kamera-Info zurueck.
  evaluate(t) {
    const shot = this.shotAt(t);
    const tau = clamp(t - shot.start, 0, shot.dur);
    const set = this.world.sets[shot.set];
    const actors = this.world.actors;
    for (const [name, s] of Object.entries(this.world.sets)) s.root.visible = name === shot.set;

    const tracks = shot.actors || {};
    for (const [id, a] of Object.entries(actors)) a.root.visible = !!tracks[id];

    // Reihenfolge: Requisiten, dann aufsitzende Figuren, dann uebrige Figuren
    const order = Object.values(tracks).sort((a, b) => rank(actors[a.id], a) - rank(actors[b.id], b));
    for (const tr of order) {
      const actor = actors[tr.id];
      if (actor.kind !== 'person') this.evalProp(shot, tr, tau, set, actor, t);
      else this.evalPerson(shot, tr, tau, set, actor, t);
    }
    return { shot, tau };
  }

  evalProp(shot, tr, tau, set, actor, t) {
    const root = actor.obj.root;
    const num = (f, d = 0) => (tr.keys[0][f] !== undefined ? hermiteScalarEase(tr.keys, tau, f) : d);
    if (tr.attach) {
      // In der Hand einer Figur (z.B. Fuehrerschein): Versatz ax/ay/az, Drehung rx/ry/rz relativ zur Hand
      const [pid, hand] = tr.attach.split(':');
      const holder = this.world.actors[pid].char.arms[hand === 'handL' ? 'L' : 'R'].hand;
      if (root.parent !== holder) holder.add(root);
      root.position.set(num('ax'), num('ay'), num('az'));
      root.rotation.set(num('rx') * D2R, num('ry') * D2R, num('rz') * D2R);
      actor.obj.update({}, t);
      return;
    }
    const pl = this.placement(shot, tr, tau, set);
    if (root.parent !== this.world.scene) this.world.scene.add(root);
    root.position.set(pl.x, pl.y, pl.z);
    root.rotation.set(num('rx') * D2R, pl.heading + num('ry') * D2R, num('rz') * D2R);
    const state = { dist: this.lookupTable(tr.dist, tr, tau), wobble: num('wobble'), lean: num('lean'), hatch: num('hatch'), crank0: num('crank0'),
      door: num('door'), window: num('window'), blink: num('blink'), steer: num('steer') };
    actor.obj.update(state, t);
    if (actor.kind === 'bike' && state.wobble > 0) root.rotation.y += (actor.obj.steer || 0) * 0.25;
  }

  evalPerson(shot, tr, tau, set, actor, t) {
    const ch = actor.char;
    const P = this.poseAt(tr, tau);
    // Platzierung
    if (tr.mount) {
      const [mid, mname] = tr.mount.split(':');
      const host = this.world.actors[mid].obj;
      const holder = (host.mounts && host.mounts[mname]) || (mname === 'seat' ? host.seat : host.driver);
      if (ch.root.parent !== holder) holder.add(ch.root);
      // mox/moy/moz/moh: Versatz zum Sitzpunkt (z.B. Einsteigen ins Auto)
      ch.root.position.set(P.mox || 0, 0.05 - ch.hipY + (P.moy || 0), P.moz || 0);
      ch.root.rotation.set(0, (P.moh || 0) * D2R, 0);
      if ((P.walk || 0) + (P.run || 0) > 0.01) this.applyGait(P, (shot.start + tau) * 2 * Math.PI * 0.9);
    } else {
      if (ch.root.parent !== this.world.scene) this.world.scene.add(ch.root);
      const pl = this.placement(shot, tr, tau, set);
      ch.root.position.set(pl.x, pl.y, pl.z);
      ch.root.rotation.set(0, pl.heading, 0);
      this.applyGait(P, this.lookupTable(tr.phase, tr, tau));
    }
    ch.applyPose(P, t);
    ch.root.updateWorldMatrix(true, true);
    // Beine (z.B. Pedale), dann Arme, dann Kopf
    for (const [field, kind, side] of [['ikFL', 'leg', 'L'], ['ikFR', 'leg', 'R'], ['ikL', 'arm', 'L'], ['ikR', 'arm', 'R']]) {
      const ik = this.blendIK(P, field, actor);
      if (!ik || ik.w <= 0.001) continue;
      const s = side === 'L' ? 1 : -1;
      const pole = kind === 'arm' ? new THREE.Vector3(s * 0.55, -0.35, -1) : new THREE.Vector3(s * 0.08, 0.2, 1);
      if (kind === 'leg') {
        // Ziel ist die Fusssohle: Knoechel liegt um Schuhhoehe darueber
        ik.pos.y += ch.B.shoe[1] * 0.6;
      }
      ch.solveLimb(kind, side, ik.pos, ik.w, pole);
      ch.root.updateWorldMatrix(true, true);
    }
    if (P.levelFeet > 0.5) ch.levelFeet();
    const lk = this.blendIK(P, 'look', actor);
    if (lk && lk.w > 0.001) ch.lookAt(lk.pos, lk.w * (P.lookW ?? 1));
  }

  // Animierte Teile des Ortes (z.B. Haustuer): shot.setKeys = { frontDoor: [{t, v}] }
  setState(shot, tau) {
    const out = {};
    for (const [name, keys] of Object.entries(shot.setKeys || {})) {
      const ks = keys.map((k) => ({ ...k })).sort((a, b) => a.t - b.t);
      out[name] = hermiteScalarEase(ks, tau, 'v');
    }
    return out;
  }

  // Bewegungsspur fuer die Geraeusche: pro Zeitschritt Einstellung, Positionen,
  // Schrittphase (Personen), Weg (Fahrrad/Auto) und Zustaende (Tuer, Fenster, Blinker)
  motionTrack(dt) {
    const dur = this.story.timing.duration;
    const frames = [];
    for (let t = 0; t <= dur + 1e-9; t += dt) {
      const { shot, tau } = this.evaluate(t);
      const f = { t: +t.toFixed(4), shot: shot.id, a: {} };
      for (const [id, tr] of Object.entries(shot.actors || {})) {
        const actor = this.world.actors[id];
        const p = new THREE.Vector3();
        actor.obj.root.getWorldPosition(p);
        const e = { x: +p.x.toFixed(3), y: +p.y.toFixed(3), z: +p.z.toFixed(3) };
        if (actor.kind === 'person') {
          const P = this.poseAt(tr, tau);
          e.phase = tr.mount ? 0 : +this.lookupTable(tr.phase, tr, tau).toFixed(4);
          e.walk = +(P.walk || 0).toFixed(3); e.run = +(P.run || 0).toFixed(3); e.mounted = !!tr.mount;
          e.breath = +(P.breath || 0).toFixed(3); e.wind = +(P.wind || 0).toFixed(3);
        } else if (!tr.attach) {
          const num = (fl) => (tr.keys[0][fl] !== undefined ? hermiteScalarEase(tr.keys, tau, fl) : 0);
          e.dist = +this.lookupTable(tr.dist, tr, tau).toFixed(4);
          if (actor.kind === 'car') { e.door = +num('door').toFixed(3); e.window = +num('window').toFixed(3); e.blink = num('blink') > 0.5 ? 1 : 0; }
        }
        f.a[id] = e;
      }
      frames.push(f);
    }
    return frames;
  }

  // Kamera fuer Zeit t
  camera(shot, tau) {
    const cam = shot.camera;
    const keys = cam.keys;
    const relPos = new THREE.Vector3();
    if (cam.rel) {
      const a = this.world.actors[cam.rel];
      a.obj.root.updateWorldMatrix(true, false);
      // Position der Figur ohne Wippen: Wurzel der Figur
      relPos.setFromMatrixPosition(a.obj.root.matrixWorld);
      if (cam.relY === false) relPos.y = 0;
    }
    const pos = new THREE.Vector3(
      hermiteScalar(keys, tau, (k) => k.pos[0]), hermiteScalar(keys, tau, (k) => k.pos[1]), hermiteScalar(keys, tau, (k) => k.pos[2]));
    const look = new THREE.Vector3(
      hermiteScalar(keys, tau, (k) => k.look[0]), hermiteScalar(keys, tau, (k) => k.look[1]), hermiteScalar(keys, tau, (k) => k.look[2]));
    if (cam.rel && cam.relYaw) {
      // Versatz dreht mit der Fahrtrichtung (Kamera faehrt mit dem Auto mit)
      const q = new THREE.Quaternion();
      this.world.actors[cam.rel].obj.root.getWorldQuaternion(q);
      const e = new THREE.Euler().setFromQuaternion(q, 'YXZ');
      const qy = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), e.y);
      pos.applyQuaternion(qy); look.applyQuaternion(qy);
    }
    if (cam.rel) { pos.add(relPos); look.add(relPos); }
    if (cam.lookAnchor) look.add(this.anchorPos(cam.lookAnchor, new THREE.Vector3()));
    const fov = keys[0].fov !== undefined ? hermiteScalar(keys, tau, (k) => k.fov ?? cam.fov) : cam.fov;
    // leichtes, deterministisches Schweben (Handkamera-Gefuehl), optional
    const sh = cam.float ?? 0.004;
    const T = shot.start + tau;
    pos.x += Math.sin(T * 0.9 + 1.3) * sh; pos.y += Math.sin(T * 1.3 + 0.2) * sh * 0.7; pos.z += Math.sin(T * 0.7 + 2.1) * sh;
    return { pos, look, fov };
  }
}

function rank(actor, tr) {
  if (actor.kind !== 'person') return tr.attach ? 3 : 0;
  if (tr.mount) return 1;
  return 2;
}

function hermiteScalarEase(keys, tau, f) {
  // Requisiten-Werte (Wackeln, Klappe): weich zwischen Keys
  const { i, k } = findSeg(keys, tau);
  const a = keys[i][f] ?? 0;
  if (i >= keys.length - 1) return a;
  const b = keys[i + 1][f] ?? a;
  return lerp(a, b, EASE[keys[i + 1].ease || 'inOut'](k));
}
