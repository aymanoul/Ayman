// Storyboard (Phase 2) „Zwischen Adhan und Iqama“: baut jede Einstellung aus board-data.js als Standbild auf,
// mit Einblendungen. Bausteine aus dem Gebet-Video (nur gelesen): Raum, Figuren, Posen, Overlay, Texturen.
import * as THREE from 'three';
import { buildRoom, addRoomLights } from '/web/lib/room.js';
import { createFigure, createFigureA, createFigureB } from '/web/lib/figure.js';
import { applyPose, POSES } from '/web/lib/poses.js';
import { glowTexture } from '/web/lib/textures.js';
import { drawSubtitles, drawTitle, drawCard, subtitleY } from '/web/lib/overlay.js';
import { SHOTS } from '/iq/web/board-data.js';
import { CARDS } from '/iq/web/cards.js';
import * as G from '/iq/web/grafik.js';

const EXTRAS = [
  { qamis: '#8a8f98', skin: '#c08a5e', kufi: true, height: 0.9, beard: 'short' },
  { qamis: '#e7dcc6', skin: '#d6a57b', kufi: false, height: 0.94, beard: 'full' },
  null, null,
  { qamis: '#4f6b57', skin: '#b3804f', kufi: true, height: 0.95, beard: 'full' },
  { qamis: '#6b5444', skin: '#ddb088', kufi: false, height: 0.88, beard: 'short' },
  { qamis: '#ece3cf', skin: '#c48c5f', kufi: true, height: 0.93, beard: 'full', beardLen: 0.6, footwear: 'socks' },   // 6: Imam
];
const P = (p) => (!p ? {} : typeof p === 'string' ? POSES[p] : Array.isArray(p) ? Object.assign({}, ...p.map(P)) : p);

// ---- Licht-Tor: weicher goldener Bogen aus Licht, ohne Figur oder Gesicht darin
function lichtTor() {
  const g = new THREE.Group();
  const w = 2.4, h = 2.9, r = w / 2;
  const aussen = new THREE.Shape();
  aussen.moveTo(-r, 0); aussen.lineTo(-r, h - r); aussen.absarc(0, h - r, r, Math.PI, 0, true); aussen.lineTo(r, 0); aussen.lineTo(-r, 0);
  const innen = new THREE.Path();
  const ri = r - 0.12;
  innen.moveTo(-ri, 0); innen.lineTo(-ri, h - r); innen.absarc(0, h - r, ri, Math.PI, 0, true); innen.lineTo(ri, 0); innen.lineTo(-ri, 0);
  aussen.holes.push(innen);
  const rahmen = new THREE.Mesh(new THREE.ShapeGeometry(aussen, 48), new THREE.MeshBasicMaterial({ color: '#f2b544', transparent: true, opacity: 0.95, depthWrite: false, toneMapped: false }));
  g.add(rahmen);
  const fuell = new THREE.Shape();
  fuell.moveTo(-ri, 0); fuell.lineTo(-ri, h - r); fuell.absarc(0, h - r, ri, Math.PI, 0, true); fuell.lineTo(ri, 0); fuell.lineTo(-ri, 0);
  const licht = new THREE.Mesh(new THREE.ShapeGeometry(fuell, 48), new THREE.MeshBasicMaterial({ color: '#ffd27a', transparent: true, opacity: 0.38, depthWrite: false, toneMapped: false }));
  licht.position.z = -0.01; g.add(licht);
  for (const [s, o] of [[5.0, 0.22], [8, 0.12]]) {
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(s, s), new THREE.MeshBasicMaterial({ map: glowTexture(), color: '#ffcf7a', transparent: true, opacity: o, blending: THREE.AdditiveBlending, depthWrite: false }));
    glow.position.set(0, h * 0.55, -0.02); g.add(glow);
  }
  g.traverse((o) => { o.renderOrder = 6; });
  
  return g;
}

// ---- fünf goldene Lichtpunkte (Draufsicht S10) auf dem Teppich, im Bogen vor dem Mihrab
export const PUNKTE = [[-2.2, -3.0], [-1.1, -3.9], [0, -4.25], [1.1, -3.9], [2.2, -3.0]];
function lichtPunkte() {
  const g = new THREE.Group();
  for (const [x, z] of PUNKTE) {
    const p = new THREE.Group();
    p.add(new THREE.Mesh(new THREE.SphereGeometry(0.12, 20, 14), new THREE.MeshBasicMaterial({ color: '#ffe1a0' })));
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.4), new THREE.MeshBasicMaterial({ map: glowTexture(), color: '#ffc35e', transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false }));
    glow.rotation.x = -Math.PI / 2; glow.position.y = 0.02; p.add(glow);
    p.position.set(x, 0.14, z);
    g.add(p);
  }
  return g;
}

export async function build({ W, H }) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#dfe8ea');
  scene.add(await buildRoom());
  const L = addRoomLights(scene, { focus: [-0.8, 0, -1.5], range: 5.5 });
  // ruhiges, warmes Licht kurz vor dem Gebet
  scene.traverse((o) => { if (o.isLight && o.color) o.color.lerp(new THREE.Color('#ffe2bf'), 0.25); });

  const lichter = []; scene.traverse((o) => { if (o.isLight) lichter.push([o, o.intensity]); });
  const fx = { tor: lichtTor(), punkte: lichtPunkte() };
  fx.tor.position.set(0, 0.55, -4.9);
  scene.add(fx.tor, fx.punkte);

  // Handy-Display als Textur (eigenes Design)
  const dc = document.createElement('canvas'); dc.width = 256; dc.height = 544;
  const dtex = new THREE.CanvasTexture(dc); dtex.colorSpace = THREE.SRGBColorSpace;
  const dmat = new THREE.MeshBasicMaterial({ map: dtex, toneMapped: false });
  const zeichneDisplay = (scroll, dunkel) => { G.display(dc.getContext('2d'), dc.width, dc.height, { scroll, dunkel }); dtex.needsUpdate = true; };

  const camera = new THREE.PerspectiveCamera(40, W / H, 0.05, 200);
  const shot = { scene, camera, duration: 1, update() {}, environmentIntensity: 0.25 };
  let figs = {}, all = [], cell = SHOTS[0];
  const V = (a) => new THREE.Vector3(...a);
  const fwd = (ry) => new THREE.Vector3(Math.sin(ry), 0, Math.cos(ry));
  function partPoint(f, part) {
    switch (part) {
      case 'chest': return f.worldPoint('spine', [0, 0.36, 0.05]);
      case 'hands': return f.worldPoint('wristR', [0, -0.06, 0]);
      default: return f.headCenter();
    }
  }
  shot.placeCam = (k) => {
    camera.fov = k.fov || 40;
    if (k.pos) { camera.position.set(...k.pos); camera.lookAt(...k.look); }
    else if (k.on) {
      const f = figs[k.on];
      const t = partPoint(f, k.part);
      const ry = f._d.ry + (k.yaw || 0);
      camera.position.copy(t).addScaledVector(fwd(ry), k.dist).add(V([0, k.up || 0, 0]));
      camera.lookAt(t.clone().add(V([0, k.lookUp || 0, 0])));
    } else if (k.over) {
      const a = figs[k.over], b = figs[k.at];
      const ha = a.headCenter(), hb = b.headCenter();
      const dir = hb.clone().sub(ha).setY(0).normalize();
      const r = new THREE.Vector3(-dir.z, 0, dir.x).multiplyScalar(k.side || 1);
      camera.position.copy(ha).addScaledVector(dir, -(k.back || 0.6)).addScaledVector(r, k.sideOff || 0.32).add(V([0, k.up || 0.06, 0]));
      camera.lookAt(hb.clone().add(V([0, -0.05, 0])));
    }
    camera.updateProjectionMatrix();
  };

  shot.setCell = (id) => {
    cell = SHOTS.find((x) => x.id === id) || cell;
    for (const f of all) f.root.parent.remove(f.root);
    figs = {}; all = [];
    for (const k in fx) fx[k].visible = (cell.fx || []).includes(k);
    for (const [l, i] of lichter) l.intensity = i * (cell.dimmen || 1);          // Raum abdunkeln, damit das Licht-Tor wirkt
    for (const d of cell.figs) {
      const opts = { footwear: 'socks' };
      const f = d.who === 'A' ? createFigureA(opts) : d.who === 'B' ? createFigureB(opts) : createFigure({ ...EXTRAS[d.extra], ...opts });
      if (d.phone) {
        const ph = f.addPhone('R');
        ph.traverse((o) => { if (o.isMesh && o.material.emissive) o.material = dmat; });
      }
      f.root.position.set(...d.pos);
      f.root.rotation.y = d.ry;
      applyPose(f, P(d.pose));
      scene.add(f.root);
      if (d.who) figs[d.who] = f;
      f._d = d;
      all.push(f);
    }
    zeichneDisplay(cell.id === 'S3' ? 1.3 : 0.4, cell.dunkel ? 0.92 : 0);
    shot.placeCam(cell.cam);
    return true;
  };

  // Einblendungen des aktuellen Bilds (1080 × 1920)
  const projiziere = (x, y, z) => { const v = new THREE.Vector3(x, y, z).project(camera); return [(v.x + 1) / 2 * 1080, (1 - v.y) / 2 * 1920]; };
  shot.overlay = (g) => {
    const o = cell.ov || {};
    if (cell.unscharf) { g.save(); g.fillStyle = 'rgba(20,21,44,0.45)'; g.fillRect(0, 0, 1080, 1920); g.restore(); }
    G.zeichneLogo(g);
    if (o.balken) G.zeitbalken(g, o.balken);
    if (o.bildschirmzeit) G.bildschirmzeit(g, { minuten: o.bildschirmzeit });
    if (o.gold) G.goldSchrift(g, o.gold, { y: 640 });
    if (o.punkte) {
      const namen = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
      PUNKTE.forEach(([x, z], i) => { const [px, py] = projiziere(x, 0.14, z); G.beschriftung(g, namen[i], px, py - 62); });
    }
    if (o.worte) G.worte(g, o.worte, { y: 1180 });
    let card = null;
    if (o.karte) card = drawCard(g, 5, CARDS[o.karte], { t0: 0, t1: 99 });
    if (o.titel) drawTitle(g, 1080, 1920, 5, o.titel, { t0: 0, t1: 99, y: o.titelY || 600, style: 'b', size: 84 });
    if (o.sub) {
      const ws = o.sub.split(/\s+/);
      const words = ws.map((w, k) => ({ w, t0: k === ws.length - 1 ? 0 : 9, t1: 1 }));
      drawSubtitles(g, 1080, 1920, 0.5, [{ t0: 0, t1: 1, words }], { style: 'b', y: o.subY || subtitleY(card) });
    }
  };
  // Einzelbilder für das Blatt: Handy-Display groß
  shot.displayBild = (dunkel = 0) => {
    const c = document.createElement('canvas'); c.width = 540; c.height = 1148;
    G.display(c.getContext('2d'), c.width, c.height, { scroll: 1.3, dunkel });
    return c.toDataURL('image/png').split(',')[1];
  };
  window.__zb = (g, c) => G.zeitbalken(g, { ...c, y: 900 });
  await G.logoBereit;
  shot.setCell(SHOTS[0].id);
  return shot;
}
