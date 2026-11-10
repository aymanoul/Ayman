// Storyboard (Phase 4): baut jede Einstellung aus web/sheets/board.js als Standbild auf.
import * as THREE from 'three';
import { buildRoom, addRoomLights } from '../lib/room.js';
import { buildExterior, addExteriorLights } from '../lib/exterior.js';
import { createFigure, createFigureA, createFigureB } from '../lib/figure.js';
import { applyPose, POSES } from '../lib/poses.js';
import { scaleProp, riverProp, prayerDots } from '../lib/symbols.js';
import { glowTexture } from '../lib/textures.js';
import { ALL_CELLS } from '../sheets/board.js';

const EXTRAS = [
  { qamis: '#8a8f98', skin: '#c08a5e', kufi: true, height: 0.9, beard: 'short' },
  { qamis: '#e7dcc6', skin: '#d6a57b', kufi: false, height: 0.94, beard: 'full' },
  null, null,
  { qamis: '#4f6b57', skin: '#b3804f', kufi: true, height: 0.95, beard: 'full' },
  { qamis: '#6b5444', skin: '#ddb088', kufi: false, height: 0.88, beard: 'short' },
];

// Pose aus Name, Objekt oder Liste (spätere Einträge überschreiben frühere)
const P = (p) => (!p ? {} : typeof p === 'string' ? POSES[p] : Array.isArray(p) ? Object.assign({}, ...p.map(P)) : p);

export async function build({ W, H }) {
  const inScene = new THREE.Scene();
  inScene.background = new THREE.Color('#dfe8ea');
  const room = await buildRoom();
  inScene.add(room);
  const inL = addRoomLights(inScene, { focus: [0, 0, -3.3], range: 4 });
  const outScene = new THREE.Scene();
  outScene.background = new THREE.Color('#9cc1e6');
  outScene.fog = new THREE.Fog('#ecd8ba', 70, 290);
  outScene.add(await buildExterior());
  const outL = addExteriorLights(outScene, { focus: [0, 0, 3], range: 8 });

  const lights = [];
  for (const sc of [inScene, outScene]) sc.traverse((o) => { if (o.isLight) lights.push([o, o.intensity]); });

  // Symbolobjekte (einmal bauen, je nach Shot ein- oder ausblenden)
  const fx = {
    clockDots: prayerDots(), scale: scaleProp(0.14), river: riverProp(),
    ember: new THREE.Group(),
  };
  fx.clockDots.position.set(-1.69, 2.12, -6 + 0.01);
  fx.scale.position.set(0, 0, -5.1);
  inScene.add(fx.clockDots, fx.scale, fx.ember);
  outScene.add(fx.river);
  {
    const emberLight = new THREE.PointLight('#ff5a1f', 9, 6, 1.4);
    emberLight.position.set(-0.6, 0.3, -2.4);
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 1.6), new THREE.MeshBasicMaterial({ map: glowTexture(), color: '#ff6a2a', transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }));
    glow.position.set(0, 0.05, -2.3); glow.rotation.x = -Math.PI / 2.4; glow.renderOrder = 5;
    fx.ember.add(emberLight, glow);
  }

  const camera = new THREE.PerspectiveCamera(40, W / H, 0.05, 700);
  const shot = { scene: inScene, scenes: [inScene, outScene], camera, duration: 1, update() {}, environmentIntensity: 0.25 };
  let figs = {};
  let all = [];

  const V = (a) => new THREE.Vector3(...a);
  const fwd = (ry) => new THREE.Vector3(Math.sin(ry), 0, Math.cos(ry));
  const right = (ry) => new THREE.Vector3(-Math.cos(ry), 0, Math.sin(ry));
  function partPoint(f, part) {
    switch (part) {
      case 'chest': return f.worldPoint('spine', [0, 0.36, 0.05]);
      case 'hands': return f.worldPoint('wristR', [0, -0.06, 0]);
      case 'feet': return f.root.position.clone().add(V([0, 0.12, 0]));
      default: return f.headCenter();
    }
  }

  // Kamera nach Angabe setzen: {pos, look} | {on, part, dist, yaw, up, lookUp} | {over, at, side}
  shot.placeCam = (k) => {
    camera.fov = k.fov || 40;
    if (k.pos) { camera.position.set(...k.pos); camera.lookAt(...k.look); }
    else if (k.on) {
      const f = figs[k.on];
      const t = partPoint(f, k.part);
      const ry = (f._d ? f._d.ry : f.root.rotation.y) + (k.yaw || 0);   // nicht aus der Euler-Drehung lesen (kippt bei |y| > 90°)
      camera.position.copy(t).addScaledVector(fwd(ry), k.dist).add(V([0, k.up || 0, 0]));
      camera.lookAt(t.clone().add(V([0, k.lookUp || 0, 0])));
    } else if (k.over) {
      const a = figs[k.over], b = figs[k.at];
      const ha = a.headCenter(), hb = b.headCenter();
      const dir = hb.clone().sub(ha).setY(0).normalize();
      const r = new THREE.Vector3(-dir.z, 0, dir.x).multiplyScalar(k.side || 1);
      camera.position.copy(ha).addScaledVector(dir, -0.6).addScaledVector(r, 0.32).add(V([0, 0.06, 0]));
      camera.lookAt(hb.clone().add(V([0, -0.05, 0])));
    }
    camera.updateProjectionMatrix();
  };
  shot.figs = () => figs;
  shot.allFigs = () => all;
  shot.P = P;

  shot.setCell = (id) => {
    const c = ALL_CELLS.find((x) => x.id === id);
    for (const f of all) f.root.parent.remove(f.root);
    figs = {}; all = [];
    for (const [l, i] of lights) l.intensity = i;
    for (const k in fx) fx[k].visible = (c.fx || []).includes(k);
    shot.scene = c.scene === 'out' ? outScene : inScene;

    // Figuren bauen und posieren
    for (const d of c.figs) {
      const opts = { footwear: d.footwear || (c.scene === 'out' ? 'shoes' : 'socks') };
      const f = d.who === 'A' ? createFigureA(opts) : d.who === 'B' ? createFigureB(opts) : createFigure({ ...EXTRAS[d.extra], ...opts });
      if (d.phone) f.addPhone('R');
      f.root.position.set(...d.pos);
      f.root.rotation.y = d.ry;
      applyPose(f, P(d.pose));
      shot.scene.add(f.root);
      if (d.who) figs[d.who] = f;
      f._d = d;
      all.push(f);
    }
    // Hand auf die Schulter: nächstgelegene Schulter des anderen, nähere eigene Hand
    for (const f of all) {
      const to = f._d.reachTo && figs[f._d.reachTo];
      if (!to) continue;
      const me = f.worldPoint('spine', [0, 0.4, 0]);
      const cands = ['shoulderL', 'shoulderR'].map((j) => to.worldPoint(j, [0, 0.07, 0]));
      const target = cands.sort((a, b) => a.distanceTo(me) - b.distanceTo(me))[0];
      const side = f.worldPoint('shoulderL').distanceTo(target) < f.worldPoint('shoulderR').distanceTo(target) ? 'L' : 'R';
      f.reach(side, target, side === 'L' ? [0.3, -1, -0.6] : [-0.3, -1, -0.6]);
      f.aimPalm(side, [0, -1, 0.2]);
      f.J['wrist' + side].rotation.x = -0.2;
      f.setHand(side, 'relaxed');
    }

    shot.placeCam(c.cam);

    // Licht: Schattenbereich um die Handlung, Glut dunkelt den Raum ab
    const L = c.scene === 'out' ? outL : inL;
    const s = c.sun || (c.scene === 'out' ? [0, 0, 3, 8] : [0, 0, -3.3, 4]);
    L.sun.target.position.set(s[0], 0, s[2]);
    if (c.scene === 'out') L.sun.position.set(s[0] - 26, 17, s[2] + 24); else L.sun.position.set(s[0] - 6, 7.5, s[2] + 1.5);
    const sc = L.sun.shadow.camera; sc.left = -s[3]; sc.right = s[3]; sc.top = s[3]; sc.bottom = -s[3]; sc.updateProjectionMatrix();
    if ((c.fx || []).includes('ember')) for (const [l, i] of lights) if (l.parent !== fx.ember) l.intensity = i * 0.45;
    return true;
  };
  shot.setCell(ALL_CELLS[0].id);
  return shot;
}
