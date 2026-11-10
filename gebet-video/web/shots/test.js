// Phase 0 – Techniktest: 5 Sekunden, zwei Platzhalterfiguren im Gebetsraum, ein Schnitt.
import * as THREE from 'three';
import { buildRoom, addRoomLights, ROOM } from '../lib/room.js';
import { createFigureA, createFigureB } from '../lib/figure.js';
import { drawSubtitles, drawTitle } from '../lib/overlay.js';

const smooth = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;

export async function build({ W, H, q }) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#dfe8ea');
  scene.add(await buildRoom());
  addRoomLights(scene, { focus: [0, 0, -2.8], range: 4.5, shadowMap: +(q.get('sm') ?? 1024), blurSamples: +(q.get('bs') ?? 8), fills: q.get('fills') === '1' });

  const A = createFigureA();
  const B = createFigureB();
  A.root.position.set(-0.5, 0, -2.9); A.root.rotation.y = 1.05;
  B.root.position.set(0.5, 0, -2.75); B.root.rotation.y = -1.2;
  scene.add(A.root, B.root);

  const camera = new THREE.PerspectiveCamera(36, W / H, 0.1, 60);
  const CUT = 2.6;

  // Platzhalter für die Stimme: Lautstärkekurve aus Sinuswellen (später echte Tonspur)
  const voice = (t) => {
    if (t < 0.35 || t > 4.7) return 0;
    const v = 0.5 + 0.5 * Math.sin(t * 17.0) * Math.sin(t * 6.3 + 1.0);
    const gate = Math.sin(t * 2.4 + 0.5) > -0.75 ? 1 : 0;
    return Math.max(0, v * gate);
  };

  const subs = [
    { t0: 0.35, t1: 1.45, words: [{ w: 'Das', t0: 0.35, t1: 0.7 }, { w: 'ist', t0: 0.7, t1: 1.0 }, { w: 'ein', t0: 1.0, t1: 1.45 }] },
    { t0: 1.45, t1: 2.6, words: [{ w: 'Techniktest', t0: 1.45, t1: 2.6 }] },
    { t0: 2.6, t1: 3.7, words: [{ w: 'Figuren', t0: 2.6, t1: 3.15 }, { w: 'ohne', t0: 3.15, t1: 3.7 }] },
    { t0: 3.7, t1: 4.8, words: [{ w: 'Augen.', t0: 3.7, t1: 4.8 }] },
  ];

  function update(t) {
    A.idle(t, 0.0);
    B.idle(t, 1.7);
    const amp = voice(t);
    A.talk(amp);
    B.setMouth('closed');

    // A spricht: offene rechte Hand, die mit der Stimme mitgeht
    const g = smooth(0.2, 0.9, t);
    const beat = Math.sin(t * 5.2) * 0.06 + amp * 0.08;
    A.J.shoulderR.rotation.set(lerp(0.06, -0.75, g) - beat, 0, lerp(-0.1, -0.22, g));
    A.J.elbowR.rotation.set(lerp(-0.18, -1.15, g) - beat * 1.5, 0, 0);
    A.J.wristR.rotation.set(0, lerp(0, -1.1, g), lerp(0, 0.35, g));
    A.J.head.rotation.x += amp * 0.03 - 0.03;
    A.J.head.rotation.y += -0.12;
    A.J.spine.rotation.x += 0.03;

    // B hört zu: Kopf leicht geneigt, nickt bei 3,4 s
    const nod = Math.sin(smooth(3.3, 4.1, t) * Math.PI * 2) * 0.16;
    B.J.head.rotation.x += 0.1 + nod;
    B.J.head.rotation.z += 0.07;
    B.J.head.rotation.y += 0.1;
    B.J.spine.rotation.x += 0.05;
    B.J.elbowL.rotation.x = -0.35; B.J.elbowR.rotation.x = -0.35;

    if (t < CUT) {
      // Einstellung 1: Halbtotale, langsame Fahrt nach vorn
      const k = t / CUT;
      camera.fov = 36;
      camera.position.set(lerp(0.3, 0.12, k), lerp(1.55, 1.5, k), lerp(2.6, 2.0, k));
      camera.lookAt(0, 1.22, -2.85);
    } else {
      // Einstellung 2: über die Schulter von B auf A, leichter Zoom
      const k = (t - CUT) / (5 - CUT);
      camera.fov = lerp(31, 28, k);
      camera.position.set(lerp(1.74, 1.68, k), 1.68, lerp(-1.32, -1.4, k));
      camera.lookAt(-0.45, 1.52, -2.9);
    }
  }

  function overlay(g, t) {
    drawTitle(g, 1080, 1920, t, ['Die Wichtigkeit', 'des Gebets'], { t0: 0, t1: 2.5 });
    drawSubtitles(g, 1080, 1920, t, subs, { style: 'a', y: 1330 });
  }

  return { scene, camera, duration: 5, update, overlay };
}
