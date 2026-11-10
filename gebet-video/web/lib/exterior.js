// Außenansicht: Neubau der Masjid As-Sunnah (nach der Visualisierung "Neubau Masjid As-Sunnah, Ratingen,
// Am Westbahnhof 31"). Fassade liegt bei z = 0 und blickt nach +z, das Portal steht in der Mitte (x = 0).
import * as THREE from 'three';
import {
  PALETTE, rng, noiseTexture, pavingTexture, glassGridTexture, latticeTexture, skyTexture, entranceSignTexture,
  glowTexture, blobShadow, carpetTexture, loadImage,
} from './textures.js';

const std = (o) => new THREE.MeshStandardMaterial({ roughness: 0.9, metalness: 0, ...o });
const flat = (color, o = {}) => std({ color, flatShading: true, ...o });
function m(geo, mat, parent, pos, rot) {
  const o = new THREE.Mesh(geo, mat);
  if (pos) o.position.set(...pos);
  if (rot) o.rotation.set(...rot);
  o.castShadow = true; o.receiveShadow = true;
  parent.add(o);
  return o;
}
const B = (x0, x1, y0, y1, z0, z1) => { const g = new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0); g.translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); return g; };

export const EXT = {
  door: [0, 0, 0.9],             // Mitte der Eingangstür
  walk: 3.2,                     // Gehweg entlang der Fassade (z-Mitte)
  colors: { sand: '#cfc0a2', portal: '#ece7dc', glass: '#27508a', dome: '#3f9aa8', asphalt: '#77716a', gold: '#d2a84f' },
};

// Spitzbogen-Fläche (Fenster): Breite w, gerade bis springY, Spitze bei topY. UV wird auf 0..1 gelegt.
function archGeometry(w, y0, springY, topY) {
  const s = new THREE.Shape();
  const h = w / 2;
  s.moveTo(-h, y0); s.lineTo(h, y0); s.lineTo(h, springY);
  s.quadraticCurveTo(h * 0.92, springY + (topY - springY) * 0.62, 0, topY);
  s.quadraticCurveTo(-h * 0.92, springY + (topY - springY) * 0.62, -h, springY);
  s.closePath();
  const g = new THREE.ShapeGeometry(s, 10);
  const p = g.attributes.position, uv = g.attributes.uv;
  for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) + h) / w, (p.getY(i) - y0) / (topY - y0));
  return g;
}

function crescent(parent, x, y, z, scale = 1) {
  const gold = std({ color: EXT.colors.gold, metalness: 0.85, roughness: 0.3 });
  const g = new THREE.Group();
  g.position.set(x, y, z); g.scale.setScalar(scale);
  m(new THREE.CylinderGeometry(0.035, 0.05, 1.1, 6), gold, g, [0, 0.55, 0]);
  m(new THREE.IcosahedronGeometry(0.11, 0), gold, g, [0, 0.55, 0]);
  m(new THREE.TorusGeometry(0.26, 0.05, 5, 12, Math.PI * 1.35), gold, g, [0, 1.3, 0], [0, 0, Math.PI * 0.82]);
  parent.add(g);
}

function dome(parent, x, y, z, r) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  m(new THREE.CylinderGeometry(r * 1.03, r * 1.06, 0.7, 14), flat('#d9cfb9'), g, [0, 0.35, 0]);
  const geo = new THREE.SphereGeometry(r, 14, 6, 0, Math.PI * 2, 0, Math.PI / 2);
  m(geo, std({ color: EXT.colors.dome, flatShading: true, metalness: 0.35, roughness: 0.22, emissive: '#1d5f6a', emissiveIntensity: 0.25 }), g, [0, 0.7, 0]);
  const ribs = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 1), new THREE.LineBasicMaterial({ color: '#1c4a55' }));
  ribs.position.y = 0.7; ribs.scale.setScalar(1.003);
  g.add(ribs);
  crescent(g, 0, 0.7 + r - 0.05, 0, 1.25);
  parent.add(g);
}

function tree(parent, x, z, s = 1, seed = 1) {
  const r = rng(seed * 77);
  const g = new THREE.Group();
  g.position.set(x, 0, z); g.scale.setScalar(s);
  m(new THREE.CylinderGeometry(0.13, 0.19, 2.4, 6), flat('#6b4f3a'), g, [0, 1.2, 0]);
  const greens = ['#5f8f4a', '#6c9c52', '#527f41'];
  for (let i = 0; i < 4; i++) {
    const b = m(new THREE.IcosahedronGeometry(1.0 + r() * 0.5, 1), flat(greens[i % 3]), g, [(r() - 0.5) * 1.3, 3.0 + r() * 1.4, (r() - 0.5) * 1.3]);
    b.scale.y = 0.85;
  }
  g.add(blobShadow(4, 4, 0.5));
  parent.add(g);
}

export async function buildExterior() {
  const g = new THREE.Group();
  let kalli = null;
  try { kalli = await loadImage('/assets/brand/kalligrafie-weiss.png'); } catch (e) { /* ohne Logo weiter */ }
  const C = EXT.colors;
  const sandTex = noiseTexture(C.sand, 5, 71, 256, 30); sandTex.repeat.set(6, 4);
  const sand = std({ map: sandTex });
  const sandDark = std({ color: '#b9aa8c' });
  const white = std({ color: C.portal });
  const trim = std({ color: '#f6f3ec', roughness: 0.7 });
  const frame = std({ color: '#1c2028', roughness: 0.5 });
  const glassMat = (cols, rows, o) => std({ map: glassGridTexture(cols, rows, o), roughness: 0.12, metalness: 0.45, emissive: '#16345e', emissiveIntensity: 0.25 });

  // ---------------------------------------------------------------- Boden
  const asTex = noiseTexture(C.asphalt, 12, 81, 256, 40); asTex.repeat.set(30, 20);
  const ground = m(new THREE.PlaneGeometry(220, 160), std({ map: asTex, roughness: 1 }), g, [0, 0, 30], [-Math.PI / 2, 0, 0]);
  ground.castShadow = false;
  const pv = pavingTexture(); pv.repeat.set(26, 3.2);
  m(B(-19, 19, 0, 0.07, 0, 5.6), std({ map: pv, roughness: 1 }), g).castShadow = false;
  m(B(-19, 19, 0, 0.1, 5.6, 5.78), flat('#b6b0a4'), g);                                  // Bordstein
  const yellow = std({ color: '#e0b93a', roughness: 0.9 });
  for (let i = 0; i < 7; i++) m(B(-17 + i * 2.6, -16.86 + i * 2.6, 0.004, 0.012, 6.4, 11.4), yellow, g).castShadow = false;
  for (let i = 0; i < 5; i++) m(B(5 + i * 2.6, 5.14 + i * 2.6, 0.004, 0.012, 6.4, 11.4), yellow, g).castShadow = false;

  // ---------------------------------------------------------------- linker Baukörper
  m(B(-16, -2.9, 0, 10, -12, 0), sand, g);
  m(B(-16.15, -2.75, 10, 10.35, -12.15, 0.12), sandDark, g);                             // Attika
  for (const y of [4.1, 7.0]) {
    m(B(-15.5, -3.5, y - 0.08, y + 1.75, 0, 0.05), frame, g).castShadow = false;
    const gl = m(new THREE.PlaneGeometry(11.8, 1.6), glassMat(11, 2), g, [-9.5, y + 0.83, 0.06]);
    gl.castShadow = false;
  }
  m(B(-15.6, -3.4, 3.05, 3.4, 0, 0.5), sandDark, g);                                     // Vordach-Kante
  m(B(-15.5, -3.5, 0.15, 3.05, -0.05, 0.03), frame, g).castShadow = false;
  m(new THREE.PlaneGeometry(11.8, 2.75), glassMat(9, 1, { top: '#27466f', bottom: '#0f2238' }), g, [-9.5, 1.6, 0.04]).castShadow = false;

  // ---------------------------------------------------------------- Türmchen links vom Portal und ganz rechts
  m(B(-2.9, -2.3, 0, 13.4, -1.4, -0.2), sandDark, g);
  crescent(g, -2.6, 13.4, -0.8, 1.1);
  m(B(15.4, 16.1, 0, 12.4, -1.4, -0.2), sandDark, g);
  crescent(g, 15.75, 12.4, -0.8, 1.1);

  // ---------------------------------------------------------------- Portal (weiß, springt vor)
  const PZ = 0.9, PW = 2.3;
  {
    const s = new THREE.Shape();                    // Frontfläche mit Türöffnung
    s.moveTo(-PW, 0); s.lineTo(-1.25, 0); s.lineTo(-1.25, 2.9); s.lineTo(1.25, 2.9); s.lineTo(1.25, 0); s.lineTo(PW, 0);
    s.lineTo(PW, 11.6); s.lineTo(-PW, 11.6); s.closePath();
    m(new THREE.ShapeGeometry(s), white, g, [0, 0, PZ]);
  }
  m(B(-PW, -PW + 0.02, 0, 11.6, -3, PZ), white, g); m(B(PW - 0.02, PW, 0, 11.6, -3, PZ), white, g);
  m(B(-PW, PW, 11.58, 11.6, -3, PZ), white, g);
  m(B(-PW - 0.12, PW + 0.12, 11.6, 11.95, -3.1, PZ + 0.12), trim, g);                    // Gesims
  // großes Spitzbogenfenster
  m(archGeometry(3.0, 3.95, 7.0, 8.75), trim, g, [0, 0, PZ + 0.02]).castShadow = false;
  m(archGeometry(2.6, 4.15, 6.95, 8.45), glassMat(4, 7), g, [0, 0, PZ + 0.04]).castShadow = false;
  // Gitterfeld über dem Bogen
  m(B(-1.55, 1.55, 8.95, 10.75, PZ, PZ + 0.05), trim, g).castShadow = false;
  const lt = latticeTexture(); lt.wrapS = lt.wrapT = THREE.RepeatWrapping; lt.repeat.set(2, 1.1);
  m(new THREE.PlaneGeometry(2.9, 1.6), std({ map: lt, roughness: 0.8 }), g, [0, 9.85, PZ + 0.06]).castShadow = false;
  // Schild über der Tür
  m(B(-1.3, 1.3, 3.03, 3.73, PZ, PZ + 0.06), std({ color: PALETTE.navy }), g).castShadow = false;
  m(new THREE.PlaneGeometry(2.6, 0.65), std({ map: entranceSignTexture(kalli), roughness: 0.6 }), g, [0, 3.38, PZ + 0.065]).castShadow = false;
  // Türrahmen, offene Glastüren, warmer Vorraum
  m(B(-1.25, -1.17, 0, 2.9, PZ - 0.1, PZ + 0.02), frame, g); m(B(1.17, 1.25, 0, 2.9, PZ - 0.1, PZ + 0.02), frame, g);
  m(B(-1.25, 1.25, 2.8, 2.9, PZ - 0.1, PZ + 0.02), frame, g);
  const doors = [];
  for (const s of [-1, 1]) {
    const hinge = new THREE.Group();
    hinge.position.set(s * 1.17, 0, PZ - 0.05);
    hinge.rotation.y = -s * 1.42;                   // nach innen geöffnet
    m(B(Math.min(0, -s * 1.15), Math.max(0, -s * 1.15), 0.02, 2.78, -0.025, 0.025), frame, hinge);
    const gl = m(new THREE.PlaneGeometry(0.98, 2.56), std({ color: '#9fc0d8', transparent: true, opacity: 0.35, roughness: 0.1, metalness: 0.3, side: THREE.DoubleSide }), hinge, [-s * 0.575, 1.4, 0.03]);
    gl.castShadow = false;
    m(B(-s * 1.06 - 0.02, -s * 1.06 + 0.02, 0.95, 1.5, 0.03, 0.08), std({ color: '#d5d8dc', metalness: 0.8, roughness: 0.3 }), hinge);
    g.add(hinge); doors.push(hinge);
  }
  const ct = carpetTexture(); ct.repeat.set(2, 3.2);
  m(new THREE.PlaneGeometry(2.5, 4), std({ map: ct, roughness: 1 }), g, [0, 0.075, PZ - 2], [-Math.PI / 2, 0, 0]).castShadow = false;
  // Vorraum: Innenseiten sichtbar, die Vorderseite (zur Tür hin) bleibt offen, damit man von innen hinaussehen kann
  const hallMat = new THREE.MeshStandardMaterial({ color: '#f1e3c8', emissive: '#ffb563', emissiveIntensity: 0.62, side: THREE.BackSide });
  const hall = new THREE.Mesh(B(-1.25, 1.25, 0.07, 2.9, PZ - 4, PZ - 0.02), [hallMat, hallMat, hallMat, hallMat, new THREE.MeshBasicMaterial({ visible: false }), hallMat]);
  g.add(hall);
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 5.2), new THREE.MeshBasicMaterial({ map: glowTexture(), color: '#ffca85', transparent: true, opacity: 0.26, blending: THREE.AdditiveBlending, depthWrite: false }));
  glow.position.set(0, 1.5, PZ - 0.3); glow.renderOrder = 3;
  g.add(glow);
  const pool = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 4.6), new THREE.MeshBasicMaterial({ map: glowTexture(), color: '#ffc27a', transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending, depthWrite: false }));
  pool.rotation.x = -Math.PI / 2; pool.position.set(0, 0.085, PZ + 1.3); pool.renderOrder = 3;
  g.add(pool);
  const warm = new THREE.PointLight('#ffb866', 16, 8, 1.6);
  warm.position.set(0, 1.9, PZ + 0.6);
  g.add(warm);

  // ---------------------------------------------------------------- rechter Baukörper mit hohen Spitzbogenfenstern
  m(B(2.9, 15.4, 0, 10.6, -12, 0), sand, g);
  m(B(2.75, 15.55, 10.6, 10.95, -12.15, 0.12), sandDark, g);
  for (const x of [4.75, 7.35, 9.95, 12.55]) {
    m(B(x - 0.98, x + 0.98, 3.5, 10.25, 0, 0.16), trim, g);
    m(archGeometry(1.45, 3.9, 8.3, 9.55), glassMat(3, 9), g, [x, 0, 0.175]).castShadow = false;
  }
  m(B(3.2, 15.2, 3.05, 3.4, 0, 0.5), sandDark, g);
  m(B(3.3, 15.1, 0.15, 3.05, -0.05, 0.03), frame, g).castShadow = false;
  m(new THREE.PlaneGeometry(11.6, 2.75), glassMat(9, 1, { top: '#27466f', bottom: '#0f2238' }), g, [9.2, 1.6, 0.04]).castShadow = false;

  // ---------------------------------------------------------------- Glaskuppeln
  dome(g, -9.6, 10.35, -5.2, 3.3);
  dome(g, 8.4, 10.95, -5.2, 3.5);

  // ---------------------------------------------------------------- Umgebung: Bäume, Hecke, Laterne, ferne Häuser
  for (const [x, z, s, sd] of [[-20.5, 3, 1.5, 1], [-23, -6, 1.8, 2], [20.5, 2.5, 1.4, 3], [23.5, -5, 1.9, 4], [-21, 17, 1.3, 5], [21.5, 16, 1.5, 6]]) tree(g, x, z, s, sd);
  m(B(-19, -17.2, 0, 1.1, 0.4, 5.4), flat('#5d8748'), g); m(B(17.2, 19, 0, 1.1, 0.4, 5.4), flat('#5d8748'), g);
  for (const x of [-10.5, 10.5]) {
    m(new THREE.CylinderGeometry(0.06, 0.08, 4.6, 6), flat('#3a3d44'), g, [x, 2.3, 5.2]);
    m(B(x - 0.35, x + 0.1, 4.55, 4.68, 5.05, 5.35), flat('#3a3d44'), g);
  }
  for (const x of [-2.2, 2.2]) m(new THREE.CylinderGeometry(0.09, 0.09, 0.8, 8), flat('#4a4e57'), g, [x, 0.47, 5.2]);
  const far = [['#b9b4aa', -46, 9, -30, 16], ['#a9a094', 44, 7, -34, 18], ['#c4b8a4', -60, 6, 6, 14], ['#b0a696', 58, 8, 10, 15], ['#bdb7ad', -30, 6, -44, 20], ['#a69c8f', 24, 7, -46, 22]];
  for (const [c, x, h, z, w] of far) m(B(x - w / 2, x + w / 2, 0, h, z - 7, z + 7), flat(c), g).castShadow = false;

  // ---------------------------------------------------------------- Himmel
  const sky = new THREE.Mesh(new THREE.SphereGeometry(300, 24, 12), new THREE.MeshBasicMaterial({ map: skyTexture(), side: THREE.BackSide, fog: false, toneMapped: false }));
  sky.rotation.y = 1.9;
  g.add(sky);

  g.userData = { doors };
  return g;
}

// Licht außen: warme, tiefe Nachmittagssonne von links vorn, lange Schatten
export function addExteriorLights(scene, { focus = [0, 0, 4], range = 16, shadowMap = 2048 } = {}) {
  const hemi = new THREE.HemisphereLight('#cfe0ff', '#bca887', 0.95);
  const sun = new THREE.DirectionalLight('#ffc98f', 3.3);
  sun.position.set(focus[0] - 26, 17, focus[2] + 24);
  sun.target.position.set(focus[0], 2, focus[2]);
  sun.castShadow = true;
  sun.shadow.mapSize.set(shadowMap, shadowMap);
  const sc = sun.shadow.camera;
  sc.left = -range; sc.right = range; sc.top = range; sc.bottom = -range; sc.near = 2; sc.far = 90;
  sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.03; sun.shadow.radius = 3; sun.shadow.blurSamples = 8;
  scene.add(hemi, sun, sun.target);
  return { hemi, sun };
}
