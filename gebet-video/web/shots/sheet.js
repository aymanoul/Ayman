// "Fotostudio" für die Figurenblätter: neutrale Hohlkehle, eine oder mehrere Figuren, feste Kamera-Ausschnitte.
import * as THREE from 'three';
import { createFigure, createFigureA, createFigureB } from '../lib/figure.js';
import { applyPose, POSES } from '../lib/poses.js';
import { ALL_CELLS } from '../sheets/cells.js';

export async function build({ W, H }) {
  const scene = new THREE.Scene();
  const BG = '#e9e3d6';
  scene.background = new THREE.Color(BG);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.MeshStandardMaterial({ color: BG, roughness: 1 }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true;
  scene.add(floor);
  scene.fog = new THREE.Fog(BG, 9, 22);
  scene.add(new THREE.HemisphereLight('#fff8ee', '#cbbfa8', 1.05));
  const sun = new THREE.DirectionalLight('#ffe9cc', 2.5);
  sun.position.set(-3.2, 5.5, 4.2);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -3.5, right: 3.5, top: 3.5, bottom: -3.5, near: 1, far: 16 });
  sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.015; sun.shadow.radius = 4; sun.shadow.blurSamples = 8;
  scene.add(sun, sun.target);

  const camera = new THREE.PerspectiveCamera(28, W / H, 0.05, 80);
  let figs = [];
  const look = new THREE.Vector3();

  function make(F, opts = {}) { return (F === 'A' ? createFigureA : F === 'B' ? createFigureB : createFigure)(opts); }
  function cam(target, dist, { fov = 28, up = 0.0, yaw = 0 } = {}) {
    camera.fov = fov;
    camera.position.set(target.x + Math.sin(yaw) * dist, target.y + up * dist, target.z + Math.cos(yaw) * dist);
    camera.lookAt(target);
    camera.updateProjectionMatrix();
  }

  function setCell(id) {
    const c = typeof id === 'string' ? ALL_CELLS.find((x) => x.id === id) : id;
    for (const f of figs) scene.remove(f.root);
    figs = [];
    if (c.scene === 'row') {
      const defs = [
        { qamis: '#8a8f98', skin: '#c08a5e', kufi: true, height: 0.88, beard: 'short' },
        { qamis: '#e7dcc6', skin: '#d6a57b', kufi: false, height: 0.92, beard: 'full' },
        { qamis: '#f5f3ee', skin: '#c79367', kufi: true, height: 0.9, beard: 'full' },
        { qamis: '#2f6fc4', skin: '#d19d72', kufi: false, height: 0.87, beard: 'short' },
        { qamis: '#4f6b57', skin: '#b3804f', kufi: true, height: 0.93, beard: 'full' },
        { qamis: '#6b5444', skin: '#ddb088', kufi: false, height: 0.86, beard: 'short' },
      ];
      defs.forEach((d, i) => {
        const f = createFigure({ ...d, footwear: 'socks' });
        applyPose(f, { head: [0.1, 0, 0], R: { reach: [0.03, 0.2, 0.215], pole: [-1, -0.8, 0], palm: [0, 0, -1], hand: 'flat' }, L: { reach: [-0.03, 0.18, 0.2], pole: [1, -0.8, 0], palm: [0, 0, -1], hand: 'flat' } });
        f.root.position.set((i - 2.5) * 0.62, 0, 0);
        f.root.rotation.y = Math.PI;
        scene.add(f.root); figs.push(f);
      });
      if (c.frame === 'rowBack') cam(look.set(0, 0.95, 0), 5.4, { fov: 30, up: 0.1 });
      else cam(look.set(0.2, 0.75, 0), 9.5, { fov: 30, up: 0.25, yaw: 0.6 });
      return true;
    }
    const f = make(c.fig, { ...(c.opts || {}), ...(c.footwear ? { footwear: c.footwear } : {}) });
    if (c.phone) f.addPhone('R');
    const p = typeof c.pose === 'string' ? POSES[c.pose] : c.pose;
    applyPose(f, p);
    f.root.rotation.y = c.az || 0;
    scene.add(f.root); figs.push(f);

    if (c.duo) {
      // A legt B die Hand auf die Schulter
      const b = createFigureB();
      applyPose(b, { head: [0.12, 0.25, 0], spine: [0.04, 0, 0] });
      b.root.position.set(-0.5, 0, 0.12); b.root.rotation.y = 0.35;
      scene.add(b.root); figs.push(b);
      f.root.position.set(0.12, 0, -0.05); f.root.rotation.y = -0.45;
      applyPose(f, { head: [0.06, 0.35, 0.05], mouth: 'smile', spine: [0.03, 0.1, 0] });
      const t = b.worldPoint('shoulderL', [0.0, 0.075, 0.0]);
      f.reach('R', t, [-0.2, -1, -0.8]);
      f.aimPalm('R', [0.3, -1, 0.2]);
      f.J.wristR.rotation.x = -0.25;
      f.setHand('R', 'relaxed');
      cam(look.set(-0.2, 1.2, 0), 2.6, { up: 0.1 });
      return true;
    }

    const h = f.opt.height;
    const seatedY = p && p.seated ? -(f.HIP - 0.205) * h : 0;
    switch (c.frame) {
      case 'full': cam(look.set(0, 0.9, 0), 4.25, { up: 0.03 }); break;
      case 'waist': cam(look.set(0, 1.28 * h / 0.9, 0), 2.55, { up: 0.04 }); break;
      case 'bust': cam(f.headCenter().add(new THREE.Vector3(0, -0.13, 0)), 1.75, { fov: 26, up: 0.03 }); break;
      case 'head': cam(f.headCenter().add(new THREE.Vector3(0, -0.03, 0)), 1.45, { fov: 24, up: 0.02 }); break;
      case 'mouth': cam(f.headCenter().add(new THREE.Vector3(0, -0.1, 0)), 0.95, { fov: 22 }); break;
      case 'chest': cam(look.set(0, 1.27 * h / 0.9, 0), 1.55, { up: 0.06 }); break;
      case 'handR': cam(f.worldPoint('wristR', [0, -0.07, 0]), 1.0, { up: 0.15 }); break;
      case 'handL': cam(f.worldPoint('wristL', [0, -0.07, 0]), 0.85, { up: 0.1 }); break;
      case 'phone': cam(f.worldPoint('wristR', [0, -0.06, 0]), 1.15, { up: 0.6 }); break;
      case 'feet': cam(look.set(0, 0.2, 0), 1.6, { up: 0.3 }); break;
      case 'seated': cam(look.set(0, 0.52, 0), 3.0, { up: 0.12 }); break;
      default: cam(look.set(0, 0.93, 0), 4.9);
    }
    return true;
  }

  setCell(ALL_CELLS[0].id);
  return { scene, camera, duration: 1, update() {}, setCell, environmentIntensity: 0.3 };
}
