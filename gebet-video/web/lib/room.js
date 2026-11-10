// Gebetsraum der Masjid As-Sunnah, aufgebaut nach den beiden Fotos (Maße aus Foto 2 abgeleitet:
// Fliesenhöhe 1,5 m als Maßstab). Achsen: +y oben, Qibla-Wand bei z = -D/2, Eingang an der Rückwand (+z).
import * as THREE from 'three';
import {
  PALETTE, CARPET_TILE_M, DADO_TOP,
  carpetTexture, wallTextures, calligraphyTexture, glowTexture, blobShadow, frostedGlassTexture, shaftTexture, loadImage,
} from './textures.js';
import * as P from './props.js';

export const ROOM = { W: 10, D: 12, H: 3.4 };
// Wichtige Orte im Raum (für Kamera und Figuren)
export const SPOTS = {
  mihrab: [0, 0, -6],
  sitzA: [-0.55, 0, -3.4],         // A sitzt links, B rechts, beide schräg zueinander vor dem Mihrab
  sitzB: [0.55, 0, -3.3],
  tuer: [2.5, 0, 6],
  reihe: [0, 0, -4.25],            // erste Gebetsreihe
};
export const COLUMNS = [[-1.75, -2.2], [1.75, -2.2], [-1.75, 1.0], [1.75, 1.0], [-1.75, 4.2], [1.75, 4.2]];

function std(opts) {
  return new THREE.MeshStandardMaterial({ roughness: 0.9, metalness: 0, ...opts });
}

// Wandfläche in der xy-Ebene (lokal), mit Aussparungen.
// openings: [{x, w, y0, y1, arch}]  (arch: Rundbogen über y1)
function wallShape(width, height, openings) {
  const s = new THREE.Shape();
  const x0 = -width / 2, x1 = width / 2;
  s.moveTo(x0, 0);
  const floorOps = openings.filter((o) => o.y0 <= 0).sort((a, b) => a.x - b.x);
  for (const o of floorOps) {
    const l = o.x - o.w / 2, r = o.x + o.w / 2;
    s.lineTo(l, 0);
    s.lineTo(l, o.y1);
    if (o.arch) s.absarc(o.x, o.y1, o.w / 2, Math.PI, 0, true);
    else s.lineTo(r, o.y1);
    s.lineTo(r, 0);
  }
  s.lineTo(x1, 0); s.lineTo(x1, height); s.lineTo(x0, height); s.closePath();
  for (const o of openings.filter((o) => o.y0 > 0)) {
    const h = new THREE.Path();
    const l = o.x - o.w / 2, r = o.x + o.w / 2;
    h.moveTo(l, o.y0); h.lineTo(r, o.y0); h.lineTo(r, o.y1); h.lineTo(l, o.y1); h.closePath();
    s.holes.push(h);
  }
  return s;
}

function wallMaterial(tex) {
  const map = tex.map.clone(); map.needsUpdate = true;
  const rough = tex.roughnessMap.clone(); rough.needsUpdate = true;
  for (const t of [map, rough]) t.repeat.set(1 / tex.widthM, 1 / tex.heightM);
  return std({ map, roughnessMap: rough, roughness: 1 });
}

function buildWall(width, tex, openings = []) {
  const g = new THREE.Group();
  const geo = new THREE.ShapeGeometry(wallShape(width, ROOM.H, openings), 24);
  const m = new THREE.Mesh(geo, wallMaterial(tex));
  m.receiveShadow = true;
  g.add(m);
  // Sockelleiste (zwischen den bodentiefen Öffnungen)
  const floorOps = openings.filter((o) => o.y0 <= 0).sort((a, b) => a.x - b.x);
  let cur = -width / 2;
  const segs = [];
  for (const o of floorOps) { segs.push([cur, o.x - o.w / 2]); cur = o.x + o.w / 2; }
  segs.push([cur, width / 2]);
  for (const [a, b] of segs) {
    const sk = new THREE.Mesh(new THREE.BoxGeometry(b - a, 0.09, 0.025), std({ color: PALETTE.skirting, roughness: 0.6 }));
    sk.position.set((a + b) / 2, 0.045, 0.0125);
    sk.receiveShadow = true;
    g.add(sk);
  }
  return g;
}

let _glow, _shaft, _frost;
// Fenster in einer Nische: Milchglas im weißen Rahmen, Fensterbank, Lichtschein und Lichtkegel
function buildWindow(w, h, { depth = 0.3, shaft = [0.25, -0.8, 1], shaftLen = 4.2, glowOn = true } = {}) {
  const g = new THREE.Group();
  const plaster = std({ color: PALETTE.plaster, side: THREE.DoubleSide });
  const mk = (sx, sy, px, py, rx, ry) => {
    const p = new THREE.Mesh(new THREE.PlaneGeometry(sx, sy), plaster);
    p.position.set(px, py, -depth / 2); p.rotation.set(rx, ry, 0); p.receiveShadow = true; g.add(p);
  };
  mk(depth, h, -w / 2, 0, 0, Math.PI / 2);
  mk(depth, h, w / 2, 0, 0, -Math.PI / 2);
  mk(w, depth, 0, h / 2, Math.PI / 2, 0);
  // Fensterbank
  const sill = new THREE.Mesh(new THREE.BoxGeometry(w + 0.06, 0.035, depth + 0.05), std({ color: '#f1efe9', roughness: 0.5 }));
  sill.position.set(0, -h / 2 + 0.0175, -depth / 2 + 0.025); sill.receiveShadow = true;
  g.add(sill);
  // Milchglas (leuchtet)
  const ft = (_frost ||= frostedGlassTexture());
  const glass = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshStandardMaterial({ color: '#f2f7fb', map: ft, emissive: '#e6f1ff', emissiveMap: ft, emissiveIntensity: 2.6, roughness: 0.4 }),
  );
  glass.position.z = -depth;
  g.add(glass);
  const fm = std({ color: '#fbfbf9', roughness: 0.45 });
  const bar = (sx, sy, px, py) => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, 0.06), fm);
    b.position.set(px, py, -depth + 0.035); g.add(b);
  };
  const t = 0.075;
  bar(w, t, 0, h / 2 - t / 2); bar(w, t, 0, -h / 2 + t / 2 + 0.035);
  bar(t, h, -w / 2 + t / 2, 0); bar(t, h, w / 2 - t / 2, 0);
  bar(w, t, 0, h * 0.2);                                 // Kämpfer: oben ein kleineres Feld
  const handle = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.12, 0.03), std({ color: '#d9dbde', metalness: 0.5, roughness: 0.4 }));
  handle.position.set(w / 2 - t / 2, -h * 0.12, -depth + 0.08); g.add(handle);
  // Lichtschein um das Fenster (ersetzt Bloom)
  const glow = new THREE.Mesh(
    new THREE.PlaneGeometry(w * 2.5, h * 1.6),
    new THREE.MeshBasicMaterial({ map: (_glow ||= glowTexture()), color: '#f3f8ff', transparent: true, opacity: 0.5,
      blending: THREE.AdditiveBlending, depthWrite: false }),
  );
  glow.position.z = 0.03; glow.renderOrder = 3;
  if (glowOn) g.add(glow);
  // Lichtkegel: läuft vom Fenster schräg in den Raum und verblasst
  if (shaft) {
    const dir = new THREE.Vector3(...shaft).normalize();
    const side = new THREE.MeshBasicMaterial({ map: (_shaft ||= shaftTexture()), color: '#fff3dc', transparent: true, opacity: 0.085,
      blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false });
    const none = new THREE.MeshBasicMaterial({ visible: false });
    const beam = new THREE.Mesh(new THREE.BoxGeometry(w * 0.9, shaftLen, h * 0.55), [side, side, none, none, side, side]);
    beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().negate());
    beam.position.copy(dir).multiplyScalar(shaftLen / 2);
    beam.renderOrder = 4;
    g.add(beam);
  }
  return g;
}

function buildMihrab(w, springY, tex) {
  const g = new THREE.Group();
  const r = w / 2;
  const plaster = std({ color: PALETTE.plaster, side: THREE.BackSide });
  const tm = wallMaterial(tex);
  tm.side = THREE.BackSide;
  tm.map.repeat.set((Math.PI * r) / tex.widthM, DADO_TOP / tex.heightM);
  tm.roughnessMap.repeat.copy(tm.map.repeat);
  const low = new THREE.Mesh(new THREE.CylinderGeometry(r, r, DADO_TOP, 14, 1, true, Math.PI / 2, Math.PI), tm);
  low.position.y = DADO_TOP / 2; low.receiveShadow = true;
  g.add(low);
  const mid = new THREE.Mesh(new THREE.CylinderGeometry(r, r, springY - DADO_TOP, 14, 1, true, Math.PI / 2, Math.PI), plaster);
  mid.position.y = (springY + DADO_TOP) / 2; mid.receiveShadow = true;
  g.add(mid);
  const dome = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 7, Math.PI, Math.PI, 0, Math.PI / 2), plaster);
  dome.position.y = springY; dome.receiveShadow = true;
  g.add(dome);
  g.scale.z = 0.62;                                      // flache Nische
  // weiße Kantenleisten links und rechts (wie auf dem Foto)
  const out = new THREE.Group();
  out.add(g);
  for (const s of [-1, 1]) {
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.03, DADO_TOP, 0.03), std({ color: '#f7f6f2', roughness: 0.6 }));
    strip.position.set(s * (r - 0.012), DADO_TOP / 2, -0.012);
    out.add(strip);
  }
  // eingebackene Verschattung in der Nische
  const sh = new THREE.Mesh(new THREE.PlaneGeometry(w * 1.5, 1.2), new THREE.MeshBasicMaterial({ map: blobShadow(1, 1).material.map, transparent: true, opacity: 0.55, depthWrite: false }));
  sh.rotation.x = -Math.PI / 2; sh.position.set(0, 0.007, -0.1); sh.renderOrder = 2;
  out.add(sh);
  return out;
}

export async function buildRoom() {
  const { W, D, H } = ROOM;
  const room = new THREE.Group();
  const tex = wallTextures({ heightM: H });
  const add = (o, x, y, z, ry = 0) => { o.position.set(x, y, z); o.rotation.y = ry; room.add(o); return o; };
  let logo = null;
  try { logo = await loadImage('/assets/brand/logo-gestapelt-navy.png'); } catch (e) { /* ohne Logo weiter */ }

  // ---- Teppich (reicht bis in die Mihrab-Nische), Decke mit Unterzügen
  const carpet = carpetTexture();
  carpet.repeat.set(W / CARPET_TILE_M, (D + 1) / CARPET_TILE_M);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D + 1), std({ map: carpet, roughness: 1 }));
  floor.rotation.x = -Math.PI / 2; floor.position.z = -0.5; floor.receiveShadow = true;
  room.add(floor);
  const ceilMat = std({ color: '#f6f5f1', emissive: '#fff8ee', emissiveIntensity: 0.5 });
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(W, D), ceilMat);
  ceil.rotation.x = Math.PI / 2; ceil.position.y = H;
  room.add(ceil);
  for (const z of [-2.2, 1.0, 4.2]) add(new THREE.Mesh(new THREE.BoxGeometry(W, 0.24, 0.34), ceilMat), 0, H - 0.12, z);
  for (const x of [-1.75, 1.75]) add(new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.22, D), ceilMat), x, H - 0.11, 0);

  // ---- Qibla-Wand: Mihrab in der Mitte, links und rechts ein Fenster in einer Nische
  const mihrabW = 1.23, springY = 1.69;
  const winL = { x: -3.05, w: 1.2, y0: 0.8, y1: 3.0 }, winR = { x: 2.0, w: 1.25, y0: 0.8, y1: 3.0 };
  const qibla = buildWall(W, tex, [{ x: 0, w: mihrabW, y0: 0, y1: springY, arch: true }, winL, winR]);
  qibla.position.z = -D / 2;
  room.add(qibla);
  add(buildMihrab(mihrabW, springY, tex), 0, 0, -D / 2);
  add(buildWindow(winL.w, winL.y1 - winL.y0, { shaft: [0.35, -0.75, 1] }), winL.x, (winL.y0 + winL.y1) / 2, -D / 2);
  // rechtes Fenster: davor steht das Roll-up, deshalb ohne Lichtschein und Lichtkegel
  add(buildWindow(winR.w, winR.y1 - winR.y0, { shaft: null, glowOn: false }), winR.x, (winR.y0 + winR.y1) / 2, -D / 2);
  const zq = -D / 2;
  // Kalligraphie-Tafel (Schahāda), goldene Wandleuchte
  const plate = new THREE.Mesh(
    new THREE.BoxGeometry(1.21, 0.26, 0.03),
    [0, 1, 2, 3, 4, 5].map((i) => (i === 4 ? std({ map: calligraphyTexture(), roughness: 0.45, metalness: 0.2 }) : std({ color: '#3a2c14', roughness: 0.5 }))),
  );
  add(plate, 0, 2.83, zq + 0.02);
  add(P.wallLamp(), 0, 2.42, zq + 0.005);
  // links: Uhr, Regal mit grünen Büchern, Tisch mit Mikrofon und Stuhl
  const clock = add(P.clock(), -1.69, 2.12, zq);
  add(P.shelf('green', 1), -1.7, DADO_TOP, zq);
  add(P.table(), -1.95, 0, zq + 1.25);
  add(P.chair(), -1.85, 0, zq + 0.62, 0.12);
  add(P.gooseneckMic('table'), -1.75, 0.74, zq + 1.18, Math.PI);
  // rechts: Roll-up auf der Fensterbank, Regal mit dunklen Büchern, Minbar
  add(P.rollup(logo), 1.92, 0.835, zq - 0.1);
  add(P.shelf('dark', 2), 3.2, DADO_TOP, zq);
  add(P.minbar(), 4.25, 0, zq + 1.76);
  // vor dem Mihrab: blauer Gebetsteppich, Schwanenhals-Mikrofon, Steckdosen
  add(P.prayerRug(), 0, 0, zq + 0.42);
  add(P.gooseneckMic('floor'), 0.36, 0, zq + 0.32, Math.PI);
  add(P.socket(), -0.78, 0.32, zq); add(P.socket(), 0.78, 0.32, zq); add(P.socket(), 1.25, 0.32, zq);

  // ---- Seitenwände: links zwei Fenster und die Stuhlreihe, rechts zwei Fenster
  const win = { w: 1.1, y0: 0.9, y1: 2.9 };
  const leftOpen = [{ x: 3.4, ...win }, { x: -1.4, ...win }];       // lokal x = -Welt-z
  const left = buildWall(D, tex, leftOpen);
  left.rotation.y = Math.PI / 2; left.position.x = -W / 2;
  room.add(left);
  for (const o of leftOpen) add(buildWindow(o.w, o.y1 - o.y0, { shaft: [-0.1, -0.7, 1], shaftLen: 4.6 }), -W / 2, (o.y0 + o.y1) / 2, -o.x, Math.PI / 2);
  for (let i = 0; i < 6; i++) add(P.stackChair(), -W / 2 + 0.34, 0, 2.55 + i * 0.52, Math.PI / 2);
  const rightOpen = [{ x: -3.0, ...win }, { x: 1.8, ...win }];      // lokal x = Welt-z
  const right = buildWall(D, tex, rightOpen);
  right.rotation.y = -Math.PI / 2; right.position.x = W / 2;
  room.add(right);
  for (const o of rightOpen) add(buildWindow(o.w, o.y1 - o.y0, { shaft: null }), W / 2, (o.y0 + o.y1) / 2, o.x, -Math.PI / 2);

  // ---- Rückwand mit Eingangstür und Schuhregal
  const doorW = 1.7, doorH = 2.15, doorX = 2.5;
  const back = buildWall(W, tex, [{ x: -doorX, w: doorW, y0: 0, y1: doorH }]);       // lokal x = -Welt-x
  back.rotation.y = Math.PI; back.position.z = D / 2;
  room.add(back);
  add(P.doubleDoor(doorW, doorH, 0.9), doorX, 0, D / 2 + 0.05, Math.PI);
  const hall = new THREE.Mesh(new THREE.BoxGeometry(doorW + 1.2, doorH + 0.4, 2.2), new THREE.MeshStandardMaterial({ color: '#efe6d6', emissive: '#ffe2b8', emissiveIntensity: 0.55, side: THREE.BackSide }));
  add(hall, doorX, (doorH + 0.4) / 2 - 0.01, D / 2 + 1.16);
  add(P.shoeRack(3), -0.2, 0, D / 2 - 0.2, Math.PI);

  // ---- Säulen (quadratisch, gefliest), an einer hängt das "Handy aus"-Schild
  const colW = 0.46;
  const colTex = wallTextures({ widthM: colW, heightM: H, tileW: colW, seed: 9 });
  const colMat = std({ map: colTex.map, roughnessMap: colTex.roughnessMap, roughness: 1 });
  const colGeo = new THREE.BoxGeometry(colW, H, colW);
  const skGeo = new THREE.BoxGeometry(colW + 0.04, 0.09, colW + 0.04);
  const skMat = std({ color: PALETTE.skirting, roughness: 0.6 });
  for (const [x, z] of COLUMNS) {
    const c = add(new THREE.Mesh(colGeo, colMat), x, H / 2, z);
    c.castShadow = true; c.receiveShadow = true;
    add(new THREE.Mesh(skGeo, skMat), x, 0.045, z);
    const bs = blobShadow(colW * 2.6, colW * 2.6, 0.8);
    bs.position.x = x; bs.position.z = z;
    room.add(bs);
  }
  add(P.phoneSign(), -1.75, 1.36, 1.0 + colW / 2);
  add(P.phoneSign(), 1.75, 1.36, -2.2 + colW / 2);

  room.userData = { clock };
  return room;
}

// Licht innen: weiches Tageslicht. focus/range legen den Bereich der weichen Schatten fest.
export function addRoomLights(scene, { focus = [0, 0, -2.5], range = 5, shadowMap = 1024, blurSamples = 8 } = {}) {
  const hemi = new THREE.HemisphereLight('#fff6e8', '#8cc7c2', 1.0);
  scene.add(hemi);
  // schwaches Gegenlicht ohne Schatten, damit Wände im Schatten nicht grau absaufen
  const fill = new THREE.DirectionalLight('#eef2ff', 0.55);
  fill.position.set(6, 5, 8); fill.target.position.set(-1, 1.5, -2);
  scene.add(fill, fill.target);
  const sun = new THREE.DirectionalLight('#ffdcae', 2.7);
  sun.position.set(focus[0] - 6, 7.5, focus[2] + 1.5);
  sun.target.position.set(focus[0], 0, focus[2]);
  sun.castShadow = true;
  sun.shadow.mapSize.set(shadowMap, shadowMap);
  const sc = sun.shadow.camera;
  sc.left = -range; sc.right = range; sc.top = range; sc.bottom = -range; sc.near = 1; sc.far = 24;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.015;
  sun.shadow.radius = 4;
  sun.shadow.blurSamples = blurSamples;
  scene.add(sun, sun.target);
  return { hemi, sun };
}
