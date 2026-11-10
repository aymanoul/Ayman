// Symbolbilder: Waage, Fluss, Lichtpunkte der fünf Gebetszeiten. Keine Personen, keine Gesichter.
import * as THREE from 'three';
import { glowTexture, makeCanvas, toTexture, rng } from './textures.js';

const gold = () => new THREE.MeshStandardMaterial({ color: '#d2a84f', metalness: 0.8, roughness: 0.3, flatShading: true });
function m(geo, mat, parent, pos, rot) {
  const o = new THREE.Mesh(geo, mat);
  if (pos) o.position.set(...pos);
  if (rot) o.rotation.set(...rot);
  o.castShadow = true; o.receiveShadow = true;
  parent.add(o);
  return o;
}

// Waage (ca. 1 m hoch). tilt > 0 senkt die linke Schale.
export function scaleProp(tilt = 0.12) {
  const g = new THREE.Group();
  const G = gold();
  m(new THREE.CylinderGeometry(0.2, 0.26, 0.06, 8), G, g, [0, 0.03, 0]);
  m(new THREE.CylinderGeometry(0.025, 0.035, 0.95, 8), G, g, [0, 0.5, 0]);
  m(new THREE.IcosahedronGeometry(0.05, 0), G, g, [0, 0.98, 0]);
  const beam = new THREE.Group();
  beam.position.y = 0.95; beam.rotation.z = tilt;
  m(new THREE.BoxGeometry(0.9, 0.025, 0.03), G, beam);
  g.add(beam);
  const rugMat = new THREE.MeshStandardMaterial({ color: '#5f8fc4', roughness: 1 });
  for (const s of [1, -1]) {
    const hang = new THREE.Group();
    hang.position.set(-s * 0.43, 0, 0);
    beam.add(hang);
    hang.rotation.z = -tilt;                        // Schalen hängen senkrecht
    for (const a of [0, 2.1, 4.2]) {
      const c = m(new THREE.CylinderGeometry(0.004, 0.004, 0.36, 4), G, hang, [Math.cos(a) * 0.08, -0.18, Math.sin(a) * 0.08]);
      c.rotation.z = Math.cos(a) * 0.2; c.rotation.x = -Math.sin(a) * 0.2;
    }
    m(new THREE.CylinderGeometry(0.17, 0.12, 0.04, 10), G, hang, [0, -0.37, 0]);
    if (s === 1) m(new THREE.BoxGeometry(0.16, 0.025, 0.24), rugMat, hang, [0, -0.335, 0], [0, 0.4, 0]);   // kleiner Gebetsteppich
  }
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 2.4), new THREE.MeshBasicMaterial({ map: glowTexture(), color: '#ffdca0', transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false }));
  glow.position.set(0, 0.7, -0.4); glow.renderOrder = 3;
  g.add(glow);
  return g;
}

let _water;
function waterTexture() {
  if (_water) return _water;
  const S = 512, c = makeCanvas(S, S), g = c.getContext('2d');
  const gr = g.createLinearGradient(0, 0, 0, S);
  gr.addColorStop(0, '#3f9fcf'); gr.addColorStop(1, '#2a7fb3');
  g.fillStyle = gr; g.fillRect(0, 0, S, S);
  const r = rng(91);
  g.lineCap = 'round';
  for (let i = 0; i < 70; i++) {
    const x = r() * S, y = r() * S, w = 20 + r() * 70;
    g.strokeStyle = r() > 0.4 ? 'rgba(255,255,255,0.55)' : 'rgba(170,230,255,0.5)';
    g.lineWidth = 2 + r() * 4;
    g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + w / 2, y - 6, x + w, y); g.stroke();
  }
  _water = toTexture(c);
  _water.repeat.set(4, 1);
  return _water;
}

// Klarer Fluss (Low-Poly) quer vor der Moscheetür. Liegt bei z0..z1, y knapp über dem Gehweg.
export function riverProp({ x0 = -9, x1 = 9, z0 = 1.6, z1 = 3.5, y = 0.08 } = {}) {
  const g = new THREE.Group();
  const geo = new THREE.PlaneGeometry(x1 - x0, z1 - z0, 24, 6);
  const p = geo.attributes.position, r = rng(7);
  for (let i = 0; i < p.count; i++) p.setZ(i, (r() - 0.5) * 0.03);
  geo.computeVertexNormals();
  const water = m(geo, new THREE.MeshStandardMaterial({ map: waterTexture(), color: '#ffffff', roughness: 0.12, metalness: 0.15, flatShading: true, emissive: '#1d6f9a', emissiveIntensity: 0.25 }), g, [(x0 + x1) / 2, y, (z0 + z1) / 2], [-Math.PI / 2, 0, 0]);
  water.castShadow = false;
  const stone = new THREE.MeshStandardMaterial({ color: '#b7ad9b', roughness: 0.9, flatShading: true });
  for (let i = 0; i < 26; i++) {
    for (const z of [z0 - 0.05, z1 + 0.05]) {
      const s = m(new THREE.IcosahedronGeometry(0.12 + r() * 0.08, 0), stone, g, [x0 + (i + r()) * (x1 - x0) / 26, y, z]);
      s.scale.y = 0.5;
    }
  }
  for (let i = 0; i < 14; i++) {                    // Glitzern
    const s = new THREE.Mesh(new THREE.PlaneGeometry(0.45, 0.45), new THREE.MeshBasicMaterial({ map: glowTexture(), color: '#ffffff', transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false }));
    s.rotation.x = -Math.PI / 2; s.position.set(x0 + r() * (x1 - x0), y + 0.02, z0 + 0.2 + r() * (z1 - z0 - 0.4)); s.renderOrder = 3;
    g.add(s);
  }
  return g;
}

// Fünf schmale Lichtstriche als Bogen ÜBER der Wanduhr (Tageslauf: Fajr bis Isha).
// Bewusst keine runden Punkte: zwei helle Kreise über einem runden Zifferblatt könnten wie ein Gesicht wirken.
export function prayerDots(width = 0.8) {
  const g = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const x = -width / 2 + (i / 4) * width, y = 0.32 + 0.14 * Math.sin((Math.PI * i) / 4);
    const rot = -((i - 2) / 2) * 0.4;                // Striche zeigen leicht vom Bogenmittelpunkt weg (wie Strahlen)
    const bar = new THREE.Mesh(new THREE.PlaneGeometry(0.03, 0.17), new THREE.MeshBasicMaterial({ color: '#f2c45a' }));
    bar.position.set(x, y, 0.08); bar.rotation.z = rot;
    g.add(bar);
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(0.05, 0.22), new THREE.MeshBasicMaterial({ map: glowTexture(), color: '#ffd27a', transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false }));
    glow.position.set(x, y, 0.085); glow.rotation.z = rot; glow.renderOrder = 3;
    g.add(glow);
  }
  return g;
}
