// Renderer-Start. Die Zeit läuft NIE über requestAnimationFrame:
// window.renderFrame(t) setzt alles deterministisch für den Zeitpunkt t (Sekunden).
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { drawGuides } from './lib/overlay.js';

const q = new URLSearchParams(location.search);
const W = +(q.get('w') || 1080), H = +(q.get('h') || 1920);
const shotName = q.get('shot') || 'test';
const layers = q.get('layers') || 'all';      // all | 3d | overlay
const guides = q.get('guides') === '1';
// Standard: direkt rendern (schnell). AO und Bloom sind eingebacken (Kontaktschatten, Leuchtflächen).
// Für einzelne Standbilder (z. B. Titelbild) lassen sich die echten Effekte zuschalten: ?ao=1&bloom=1
const useAO = q.get('ao') === '1';
const useBloom = q.get('bloom') === '1';
const usePost = useAO || useBloom;

const stage = document.getElementById('stage');
stage.style.width = W + 'px'; stage.style.height = H + 'px';
const glCanvas = document.getElementById('gl');
const ovCanvas = document.getElementById('ov');
ovCanvas.width = W; ovCanvas.height = H;
const ov = ovCanvas.getContext('2d');

async function boot() {
  await Promise.all([
    '800 96px "Baloo 2"', '700 96px "Baloo 2"', '700 40px "Fredoka"',
    '700 40px "Montserrat"', '800 40px "Montserrat"', '900 40px "Montserrat"',
    '400 40px "Amiri"', '700 40px "Amiri"', '400 40px "Amiri Quran"',
  ].map((f) => document.fonts.load(f, f.includes('Amiri') ? 'لا إله إلا الله' : 'Äg')));

  const renderer = new THREE.WebGLRenderer({ canvas: glCanvas, antialias: !usePost, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1);
  renderer.setSize(W, H, false);
  glCanvas.style.width = W + 'px'; glCanvas.style.height = H + 'px';
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = q.get('shadow') === 'pcf' ? THREE.PCFShadowMap : THREE.VSMShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const mod = await import(`./shots/${shotName}.js`);
  const shot = await mod.build({ THREE, W, H, renderer, q });
  const { scene, camera } = shot;

  if (shot.environment !== false) {
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = shot.environmentIntensity ?? 0.22;
  }

  let composer = null;
  if (usePost) {
    const target = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, samples: +(q.get('msaa') ?? 4) });
    composer = new EffectComposer(renderer, target);
    composer.setPixelRatio(1);
    composer.setSize(W, H);
    composer.addPass(new RenderPass(scene, camera));
    if (useAO) {
      const ao = new GTAOPass(scene, camera, W, H);
      ao.updateGtaoMaterial({ radius: 0.35, distanceExponent: 1.5, thickness: 1.2, scale: 1.25, samples: 12 });
      ao.blendIntensity = 1.0;
      composer.addPass(ao);
      // AO in reduzierter Auflösung rechnen (Software-Rendering): spart den Großteil der Zeit
      const aos = +(q.get('aoscale') ?? 0.5);
      ao.setSize(Math.round(W * aos), Math.round(H * aos));
    }
    if (useBloom) {
      const bloom = new UnrealBloomPass(new THREE.Vector2(W, H), 0.22, 0.55, 1.35);
      composer.addPass(bloom);
      const bs = +(q.get('bloomscale') ?? 0.5);
      bloom.setSize(Math.round(W * bs), Math.round(H * bs));
    }
    composer.addPass(new OutputPass());
  }
  const draw = () => (composer ? composer.render() : renderer.render(scene, camera));

  window.__dbg = { shot, scene, camera, renderer, composer: { render: draw }, THREE };
  window.shotInfo = { name: shotName, duration: shot.duration, fps: 30, W, H };
  window.renderFrame = (t) => {
    shot.update(t);
    camera.updateProjectionMatrix();
    if (layers !== 'overlay') draw();
    ov.clearRect(0, 0, W, H);
    // Einblendungen werden immer in 1080x1920 gedacht und passend skaliert
    ov.save();
    ov.scale(W / 1080, H / 1920);
    if (layers !== '3d' && shot.overlay) shot.overlay(ov, t);
    if (guides) drawGuides(ov, 1080, 1920);
    ov.restore();
    return true;
  };
  const outCanvas = document.createElement('canvas');
  outCanvas.width = W; outCanvas.height = H;
  const outCtx = outCanvas.getContext('2d');
  window.grabFrame = (t, quality = 0.95, type = 'image/jpeg') => {
    window.renderFrame(t);
    outCtx.drawImage(glCanvas, 0, 0);
    outCtx.drawImage(ovCanvas, 0, 0);
    return outCanvas.toDataURL(type, quality).split(',')[1];
  };
  window.renderFrame(0);
  window.ready = true;
}

boot().catch((e) => { console.error(e); window.bootError = String(e && e.stack || e); });
