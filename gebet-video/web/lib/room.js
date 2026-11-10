// Gebetsraum der Masjid As-Sunnah (Phase-0-Stand: Grundaufbau nach den Fotos).
// Achsen: +y oben, Qibla-Wand bei z = -D/2, Blick in den Raum Richtung -z.
import * as THREE from 'three';
import {
  PALETTE, CARPET_TILE_M, DADO_TOP,
  carpetTexture, wallTextures, calligraphyTexture, glowTexture, blobShadow,
} from './textures.js';

export const ROOM = { W: 11, D: 12, H: 3.4 };

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

function buildWindow(w, h, depth = 0.28) {
  const g = new THREE.Group();
  const plaster = std({ color: PALETTE.plaster, side: THREE.DoubleSide });
  // Laibung
  const mk = (sx, sy, px, py, rx, ry) => {
    const p = new THREE.Mesh(new THREE.PlaneGeometry(sx, sy), plaster);
    p.position.set(px, py, -depth / 2); p.rotation.set(rx, ry, 0); p.receiveShadow = true; g.add(p);
  };
  mk(depth, h, -w / 2, 0, 0, Math.PI / 2);
  mk(depth, h, w / 2, 0, 0, -Math.PI / 2);
  mk(w, depth, 0, h / 2, Math.PI / 2, 0);
  mk(w, depth, 0, -h / 2, -Math.PI / 2, 0);
  // Milchglas (leuchtet, damit der Bloom greift)
  const glass = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshStandardMaterial({ color: '#eef5fb', emissive: '#e4f0ff', emissiveIntensity: 3.2, roughness: 0.4 }),
  );
  glass.position.z = -depth;
  g.add(glass);
  // Lichtschein um das Fenster
  const glow = new THREE.Mesh(
    new THREE.PlaneGeometry(w * 2.6, h * 1.7),
    new THREE.MeshBasicMaterial({ map: (buildWindow.glow ||= glowTexture()), color: '#f3f8ff', transparent: true, opacity: 0.6,
      blending: THREE.AdditiveBlending, depthWrite: false }),
  );
  glow.position.z = 0.03;
  glow.renderOrder = 3;
  g.add(glow);
  // Rahmen
  const fm = std({ color: '#fbfbf9', roughness: 0.5 });
  const bar = (sx, sy, px, py) => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, 0.05), fm);
    b.position.set(px, py, -depth + 0.03); g.add(b);
  };
  const t = 0.07;
  bar(w, t, 0, h / 2 - t / 2); bar(w, t, 0, -h / 2 + t / 2);
  bar(t, h, -w / 2 + t / 2, 0); bar(t, h, w / 2 - t / 2, 0);
  bar(w, t * 0.8, 0, h * 0.18);
  return g;
}

function buildMihrab(w, springY, tex) {
  const g = new THREE.Group();
  const r = w / 2;
  const depthScale = 0.62; // flache Nische
  const plaster = std({ color: PALETTE.plaster, side: THREE.BackSide });
  // unten gefliest
  const tm = wallMaterial(tex);
  tm.side = THREE.BackSide;
  tm.map.repeat.set((Math.PI * r) / tex.widthM, DADO_TOP / tex.heightM);
  tm.roughnessMap.repeat.copy(tm.map.repeat);
  const low = new THREE.Mesh(new THREE.CylinderGeometry(r, r, DADO_TOP, 14, 1, true, Math.PI / 2, Math.PI), tm);
  low.position.y = DADO_TOP / 2;
  low.receiveShadow = true;
  g.add(low);
  if (springY > DADO_TOP) {
    const mid = new THREE.Mesh(new THREE.CylinderGeometry(r, r, springY - DADO_TOP, 14, 1, true, Math.PI / 2, Math.PI), plaster);
    mid.position.y = (springY + DADO_TOP) / 2;
    mid.receiveShadow = true;
    g.add(mid);
  }
  const dome = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 7, Math.PI, Math.PI, 0, Math.PI / 2), plaster);
  dome.position.y = springY;
  dome.receiveShadow = true;
  g.add(dome);
  g.scale.z = depthScale;
  return g;
}

export function buildRoom() {
  const { W, D, H } = ROOM;
  const room = new THREE.Group();
  const tex = wallTextures({ heightM: H });

  // Teppich
  const carpet = carpetTexture();
  carpet.repeat.set(W / CARPET_TILE_M, (D + 1) / CARPET_TILE_M);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D + 1), std({ map: carpet, roughness: 1 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.z = -0.5;                    // reicht bis in die Mihrab-Nische
  floor.receiveShadow = true;
  room.add(floor);

  // Decke
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(W, D), std({ color: '#f6f5f1', emissive: '#fff8ee', emissiveIntensity: 0.5 }));
  ceil.rotation.x = Math.PI / 2; ceil.position.y = H;
  room.add(ceil);

  // Qibla-Wand mit Mihrab und zwei Fenstern
  const mihrabW = 1.25, springY = 1.62;
  const win = { w: 0.95, y0: 0.82, y1: 2.85 };
  const qOpen = [
    { x: 0, w: mihrabW, y0: 0, y1: springY, arch: true },
    { x: -2.9, ...win }, { x: 2.5, ...win },
  ];
  const qibla = buildWall(W, tex, qOpen);
  qibla.position.z = -D / 2;
  room.add(qibla);
  const mihrab = buildMihrab(mihrabW, springY, tex);
  mihrab.position.z = -D / 2;
  room.add(mihrab);
  for (const o of qOpen.slice(1)) {
    const wn = buildWindow(o.w, o.y1 - o.y0);
    wn.position.set(o.x, (o.y0 + o.y1) / 2, -D / 2);
    room.add(wn);
  }

  // Seitenwände (links mit Fenstern) und Rückwand
  const leftOpen = [{ x: -3.2, ...win }, { x: 0.2, ...win }, { x: 3.6, ...win }];
  const left = buildWall(D, tex, leftOpen);
  left.rotation.y = Math.PI / 2; left.position.x = -W / 2;
  room.add(left);
  for (const o of leftOpen) {
    const wn = buildWindow(o.w, o.y1 - o.y0);
    wn.rotation.y = Math.PI / 2;
    wn.position.set(-W / 2, (o.y0 + o.y1) / 2, -o.x);
    room.add(wn);
  }
  const right = buildWall(D, tex);
  right.rotation.y = -Math.PI / 2; right.position.x = W / 2;
  room.add(right);
  const back = buildWall(W, tex);
  back.rotation.y = Math.PI; back.position.z = D / 2;
  room.add(back);

  // Säulen (quadratisch, gefliest)
  const colW = 0.46;
  const colTex = wallTextures({ widthM: colW, heightM: H, tileW: colW, seed: 9 });
  const colMat = std({ map: colTex.map, roughnessMap: colTex.roughnessMap, roughness: 1 });
  const colGeo = new THREE.BoxGeometry(colW, H, colW);
  const skGeo = new THREE.BoxGeometry(colW + 0.04, 0.09, colW + 0.04);
  const skMat = std({ color: PALETTE.skirting, roughness: 0.6 });
  const cols = [];
  for (const x of [-2.1, 2.1]) for (const z of [-2.4, 1.2]) cols.push([x, z]);
  for (const [x, z] of cols) {
    const c = new THREE.Mesh(colGeo, colMat);
    c.position.set(x, H / 2, z);
    c.castShadow = true; c.receiveShadow = true;
    room.add(c);
    const sk = new THREE.Mesh(skGeo, skMat);
    sk.position.set(x, 0.045, z);
    room.add(sk);
    const bs = blobShadow(colW * 2.6, colW * 2.6, 0.8);
    bs.position.x = x; bs.position.z = z;
    room.add(bs);
  }

  // Kalligraphie-Tafel und Wandleuchte über dem Mihrab
  const plate = new THREE.Mesh(
    new THREE.BoxGeometry(1.25, 0.27, 0.03),
    [null, null, null, null, std({ map: calligraphyTexture(), roughness: 0.45, metalness: 0.2 }), null]
      .map((m) => m || std({ color: '#3a2c14', roughness: 0.5 })),
  );
  plate.position.set(0, 2.78, -D / 2 + 0.03);
  room.add(plate);
  const lamp = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.2, 6), std({ color: '#c9a04e', metalness: 0.7, roughness: 0.35 }));
  lamp.position.set(0, 2.42, -D / 2 + 0.1);
  room.add(lamp);

  // Wanduhr (ohne Ziffern-Details, kommt in Phase 2)
  const clock = new THREE.Group();
  clock.add(new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.04, 20), std({ color: '#b9bcc0', metalness: 0.6, roughness: 0.4 })));
  const face = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.045, 20), std({ color: '#fafafa' }));
  clock.add(face);
  clock.rotation.x = Math.PI / 2;
  clock.position.set(-1.75, 2.15, -D / 2 + 0.03);
  room.add(clock);

  // Gebetsteppich vor dem Mihrab
  const rug = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.02, 1.1), std({ color: '#5f8fc4', roughness: 1 }));
  rug.position.set(0, 0.012, -D / 2 + 0.75);
  rug.receiveShadow = true;
  room.add(rug);
  const fringe = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.015, 0.06), std({ color: '#d7b25e', roughness: 0.8 }));
  fringe.position.set(0, 0.012, -D / 2 + 1.32);
  room.add(fringe);

  return room;
}

export function addRoomLights(scene, { focus = [0, 0, -2.5], range = 5, shadowMap = 1024, blurSamples = 8, fills = false } = {}) {
  const hemi = new THREE.HemisphereLight('#fff6e8', '#4fa6a4', 0.85);
  scene.add(hemi);
  // warmes Tageslicht von der Fensterseite (links), wirft die weichen Schatten
  const sun = new THREE.DirectionalLight('#ffdcae', 3.1);
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
  // kühles Licht aus den Fenstern der Qibla-Wand
  for (const x of fills ? [2.5, -2.9] : []) {
    const fill = new THREE.PointLight('#dbe8ff', 9, 8, 1.5);
    fill.position.set(x, 1.9, -ROOM.D / 2 + 0.9);
    scene.add(fill);
  }
  return { hemi, sun };
}
