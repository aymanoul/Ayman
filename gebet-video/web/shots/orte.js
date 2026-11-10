// Ortsblätter: Gebetsraum und Außenansicht, mit festen Kamerastandpunkten (und Figuren zum Größenvergleich).
import * as THREE from 'three';
import { buildRoom, addRoomLights, SPOTS } from '../lib/room.js';
import { buildExterior, addExteriorLights } from '../lib/exterior.js';
import { createFigure, createFigureA, createFigureB } from '../lib/figure.js';
import { applyPose, POSES } from '../lib/poses.js';

export async function build({ W, H }) {
  // ---- innen
  const inScene = new THREE.Scene();
  inScene.background = new THREE.Color('#dfe8ea');
  inScene.add(await buildRoom());
  const inL = addRoomLights(inScene, { focus: [0, 0, -2.5], range: 7 });
  // ---- außen
  const outScene = new THREE.Scene();
  outScene.background = new THREE.Color('#9cc1e6');
  outScene.fog = new THREE.Fog('#ecd8ba', 70, 290);
  outScene.add(await buildExterior());
  const outL = addExteriorLights(outScene, { focus: [0, 0, 5], range: 24 });

  const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 700);
  let figs = [];
  const shot = { scene: inScene, scenes: [inScene, outScene], camera, duration: 1, update() {}, environmentIntensity: 0.25 };
  const put = (f, x, y, z, ry) => { f.root.position.set(x, y, z); f.root.rotation.y = ry; shot.scene.add(f.root); figs.push(f); return f; };
  const cam = (pos, look, fov) => { camera.fov = fov; camera.position.set(...pos); camera.lookAt(...look); camera.updateProjectionMatrix(); };
  const sun = (L, focus, range) => {
    L.sun.target.position.set(focus[0], 0, focus[2]);
    const sc = L.sun.shadow.camera; sc.left = -range; sc.right = range; sc.top = range; sc.bottom = -range; sc.updateProjectionMatrix();
  };

  shot.setCell = (id) => {
    for (const f of figs) f.root.parent.remove(f.root);
    figs = [];
    const inside = id.startsWith('innen');
    shot.scene = inside ? inScene : outScene;
    if (inside) { inL.sun.position.set(-6, 7.5, -1); sun(inL, [0, 0, -2.5], 7); }
    switch (id) {
      case 'innen_totale': cam([1.05, 1.6, 5.3], [-0.25, 1.25, -6], 58); sun(inL, [0, 0, 0], 8); inL.sun.position.set(-6, 7.5, 1.5); break;
      case 'innen_qibla': cam([0, 1.5, 1.9], [0, 1.52, -6], 52); break;
      case 'innen_saeulen': cam([3.5, 1.55, -0.9], [-4.4, 0.75, 3.9], 56); sun(inL, [-1, 0, 2.5], 7); inL.sun.position.set(-7, 7.5, 1.0); break;
      case 'innen_mihrab': cam([0.95, 1.35, -2.9], [-0.05, 1.42, -6], 50); break;
      case 'innen_links': cam([-0.35, 1.5, -2.5], [-1.95, 1.35, -6], 50); break;
      case 'innen_rechts': cam([0.75, 1.5, -2.75], [3.35, 1.2, -6], 56); break;
      case 'innen_schild': cam([-1.15, 1.25, 2.75], [-1.75, 0.95, 1.2], 50); sun(inL, [-1.5, 0, 1.5], 4); inL.sun.position.set(-7.5, 7.5, 3); break;
      case 'innen_licht': {
        const a = put(createFigureA({ footwear: 'socks' }), ...SPOTS.sitzA, 0.85);
        const b = put(createFigureB({ footwear: 'socks' }), ...SPOTS.sitzB, -0.95);
        applyPose(a, POSES.sitzenSpricht); applyPose(b, { ...POSES.sitzen, head: [0.06, 0.2, 0.05] });
        cam([1.9, 1.05, -0.9], [-0.1, 0.72, -3.7], 40); sun(inL, [0, 0, -3.3], 4); inL.sun.position.set(-6, 7.5, -1.8);
        break;
      }
      case 'innen_reihe': {
        const defs = [
          { qamis: '#8a8f98', skin: '#c08a5e', kufi: true, height: 0.9, beard: 'short' },
          { qamis: '#e7dcc6', skin: '#d6a57b', kufi: false, height: 0.94, beard: 'full' },
          null, null,
          { qamis: '#4f6b57', skin: '#b3804f', kufi: true, height: 0.95, beard: 'full' },
          { qamis: '#6b5444', skin: '#ddb088', kufi: false, height: 0.88, beard: 'short' },
        ];
        defs.forEach((d, i) => {
          const f = d ? createFigure({ ...d, footwear: 'socks' }) : (i === 2 ? createFigureA : createFigureB)({ footwear: 'socks' });
          applyPose(f, { head: [0.1, 0, 0], R: { reach: [0.03, 0.2, 0.215], pole: [-1, -0.8, 0], palm: [0, 0, -1], hand: 'flat' }, L: { reach: [-0.03, 0.18, 0.2], pole: [1, -0.8, 0], palm: [0, 0, -1], hand: 'flat' } });
          put(f, (i - 2.5) * 0.6, 0, SPOTS.reihe[2], Math.PI);
        });
        cam([0.15, 1.75, -0.6], [0, 1.2, -6], 44); sun(inL, [0, 0, -4], 4.5); inL.sun.position.set(-6, 7.5, -2.5);
        break;
      }
      case 'innen_eingang': cam([0.9, 1.55, 0.2], [2.2, 1.1, 6], 54); sun(inL, [1, 0, 4], 6); inL.sun.position.set(-5, 7.5, 5.5); break;
      case 'aussen_totale': cam([-13.5, 1.55, 23], [0.8, 6.6, 0], 52); sun(outL, [0, 0, 5], 26); break;
      case 'aussen_eingang': {
        const a = put(createFigureA(), 0.55, 0.07, 1.75, -0.35);
        applyPose(a, { head: [0.02, -0.25, 0.04], mouth: 'smile', R: { reach: [-0.3, 0.42, 0.25], pole: [-1, -0.8, -0.3], palm: [0.2, 0, 1], flex: -0.4, hand: 'open' } });
        const b = put(createFigureB(), -1.25, 0.07, 4.2, Math.PI / 2);
        b.addPhone('R');
        applyPose(b, { walk: 1.2, walkOpt: { hurry: 1 }, neck: [0.14, 0, 0], head: [0.3, 0, 0], R: { reach: [-0.1, 0.27, 0.3], pole: [-1, -1, -0.2], palm: [0.15, 0.75, -0.6], flex: -0.1, hand: 'hold' } });
        cam([1.2, 1.45, 9.6], [-1.0, 1.75, 2.0], 46); sun(outL, [0, 0, 3], 9);
        break;
      }
      case 'aussen_portal': cam([-3.4, 1.5, 11.5], [0.2, 6.3, 0.9], 54); sun(outL, [0, 0, 5], 22); break;
      default: cam([0, 1.5, 5], [0, 1.3, -6], 55);
    }
    return true;
  };
  shot.setCell('innen_totale');
  return shot;
}
