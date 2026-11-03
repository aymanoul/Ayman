// Logo-Szene: 3D-Figur im Anzug (ohne Augen) vor hellem Hintergrund, 4-s-Schleife.
// window.renderLogo(t, variante) setzt Pose und Kamera fuer Zeitpunkt t und rendert einen Frame.
import * as THREE from 'three';
import { Character, DEFAULT_POSE } from '../character.js';

const S = 1080, T = 4.0;
const canvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(S, S, false);
renderer.setClearColor(0x000000, 0);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 50);
scene.add(new THREE.HemisphereLight('#fffaf2', '#c9bba5', 1.25));
const key = new THREE.DirectionalLight('#fff3e2', 2.6);
key.position.set(-2.2, 3.2, 3.4);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
key.shadow.bias = -0.0004;
key.shadow.normalBias = 0.02;
Object.assign(key.shadow.camera, { left: -1.5, right: 1.5, top: 2.5, bottom: -0.5, near: 0.5, far: 12 });
scene.add(key, key.target);
key.target.position.set(0, 1.3, 0);
const fillL = new THREE.DirectionalLight('#eef3ff', 0.9);
fillL.position.set(3, 1.6, 2.5);
scene.add(fillL);
const rim = new THREE.DirectionalLight('#ffe7b8', 1.4);
rim.position.set(0.5, 2.5, -3);
scene.add(rim);

const man = new Character('logo', {
  type: 'person', build: 'adult', skin: '#ebb995',
  hair: { color: '#3b2a1f', style: 'short', tuft: 3 },
  top: { type: 'suit', color: '#1f2a44', shirt: '#f6f4ef', tie: '#f2c14e' },
  bottom: { type: 'jeans', color: '#1a2236' }, shoes: '#2a2420',
});
scene.add(man.root);
man.root.traverse((o) => { if (o.isMesh) { o.castShadow = true; } });

const smooth = (a, b, x) => { const k = Math.min(1, Math.max(0, (x - a) / (b - a))); return k * k * (3 - 2 * k); };
function poseAt(t) {
  const u = ((t % T) + T) % T;
  const ph = (2 * Math.PI * u) / T;
  // Winken: heben 0,35-0,95 s, winken bis 2,7 s, senken bis 3,35 s
  const up = smooth(0.35, 0.95, u) * (1 - smooth(2.7, 3.35, u));
  const wave = Math.sin((u - 0.95) * 2 * Math.PI * 1.7) * smooth(0.9, 1.15, u) * (1 - smooth(2.5, 2.75, u));
  return {
    ...DEFAULT_POSE,
    headRoll: 3.5 * Math.sin(ph) + 4 * up, headYaw: -6 * up + 2 * Math.sin(ph + 1), headPitch: -3 + 2 * Math.sin(ph * 2),
    shL: 4, abL: 7, elL: 14,
    shR: 4, abR: 7, elR: 14,  _up: up, _wave: wave,
    smile: 0.62 + 0.25 * up, open: 0.18 * up, browUp: 0.15 + 0.55 * up, browIn: 0.05, breath: 0.6,
    lean: 0, spine: 0, twist: 4 * up,
  };
}

const target = new THREE.Vector3();
const qParent = new THREE.Quaternion(), qWant = new THREE.Quaternion(), qRock = new THREE.Quaternion();
const zAxis = new THREE.Vector3(0, 0, 1), rest = new THREE.Vector3(), vWave = new THREE.Vector3();
const mBasis = new THREE.Matrix4().makeBasis(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, -1, 0), new THREE.Vector3(1, 0, 0));
function renderLogo(t, variant = 'profil') {
  const P = poseAt(t);
  man.applyPose(P, t);
  man.root.updateWorldMatrix(true, true);
  if (P._up > 0.001) {
    // Winkhand neben dem Kopf, Ellbogen nach unten-aussen. Die Hand faehrt vom Ruhepunkt
    // dicht am Koerper (leicht nach vorn) hoch, statt den Arm seitlich auszuschwenken.
    const e = P._up;
    man.arms.R.wrist.getWorldPosition(rest);
    const wave = man.root.localToWorld(vWave.set(-0.4 - 0.05 * P._wave, 1.56 + 0.015 * Math.abs(P._wave), 0.16));
    const goal = rest.lerp(wave, e);
    goal.z += 0.16 * Math.sin(Math.PI * e);
    goal.x += 0.05 * Math.sin(Math.PI * e);
    man.solveLimb('arm', 'R', goal, smooth(0, 0.15, e), new THREE.Vector3(-0.8, -1, 0.15));
    man.root.updateWorldMatrix(true, true);
    // Offene Hand zur Kamera: Handflaeche (lokal +x) -> +Z, Finger (lokal -y) -> oben,
    // Daumenseite (lokal +z) -> zum Kopf; Winken = Kippen um die Blickachse
    const arm = man.arms.R;
    arm.elbow.getWorldQuaternion(qParent);
    qWant.setFromRotationMatrix(mBasis);
    qRock.setFromAxisAngle(zAxis, 0.12 + 0.3 * P._wave);
    qWant.premultiply(qRock);
    qWant.premultiply(qParent.invert());
    arm.wrist.quaternion.slerp(qWant, P._up);
    arm.thumbPivot.rotation.set(0.35 - 0.95 * P._up, 0, 0.25 * (1 - P._up));
    man.root.updateWorldMatrix(true, true);
  }
  const head = man.anchor('head');
  // Profilbild: Kopf und Schultern im Kreis; mit Schrift: etwas weiter, Platz unten
  const wide = variant === 'schrift';
  // Abzeichen: Ring (cx, cy, R); unterhalb der Ringmitte schneidet der Kreis die Figur ab,
  // oberhalb darf der Kopf ueber den Ring hinausragen
  const R = wide ? 330 : 405, cx = 540, cy = wide ? 455 : 585;
  const ring = document.getElementById('ring');
  Object.assign(ring.style, { left: cx - R + 'px', top: cy - R + 'px', width: 2 * R + 'px', height: 2 * R + 'px' });
  const r = R - 16;
  canvas.style.clipPath = `path('M ${cx - r} 0 L ${cx + r} 0 L ${cx + r} ${cy} A ${r} ${r} 0 0 1 ${cx - r} ${cy} Z')`;
  const dist = wide ? 3.95 : 3.3;
  target.set(0, head.y - (wide ? 0.49 : 0.3), 0);
  camera.position.set(0, target.y + 0.1, dist);
  camera.lookAt(target);
  document.getElementById('mark').style.display = wide ? 'block' : 'none';
  renderer.render(scene, camera);
}
window.renderLogo = renderLogo;
window.showGuide = (on) => { document.getElementById('guide').style.display = on ? 'block' : 'none'; };
window.meshNames = () => { const n = []; scene.traverse((o) => o.name && n.push(o.name)); return n; };
document.fonts.ready.then(() => document.fonts.load('400 112px "DM Serif Display"')).then(() => { renderLogo(0); window.ready = true; });
