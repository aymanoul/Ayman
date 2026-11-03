// Szene + Zeitachse. Stellt window.renderAt(t) bereit: setzt Figuren, Kamera,
// Zaehler und Untertitel fuer Zeitpunkt t und rendert genau einen Frame.
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

import { Character, DEFAULT_POSE, mat, mesh } from './character.js';
import { Bike, Car, Box } from './props.js';
import { buildPark } from './sets/park.js';
import { buildDriveway } from './sets/driveway.js';
import { makeSky } from './sets/common.js';
import { createOverlay } from './overlay.js';
import { Timeline } from './timeline.js';

const SET_BUILDERS = { park: buildPark, driveway: buildDriveway };

// Lichtstimmungen. Abend: warmes tiefes Licht. Nacht: warme Lampe, sehr dunkel. Morgen: kuehl und hell.
const LIGHTING = {
  evening: {
    sun: '#ffb36b', sunI: 3.6, hemiSky: '#ffcf9f', hemiGround: '#55603a', hemiI: 0.85,
    fill: '#ffe0c0', fillI: 0.7, fog: '#d99a6c', fogNear: 45, fogFar: 260, exposure: 0.95, lamps: 3.2,
    sky: { top: '#56649c', horizon: '#f2a46c', bottom: '#b3805e', sun: '#ffd09a', glow: 0.4, disc: 5 },
  },
  morning: {
    sun: '#dfe9ff', sunI: 3.3, hemiSky: '#cfe0ff', hemiGround: '#7f8f72', hemiI: 0.8,
    fill: '#eef3ff', fillI: 0.4, fog: '#cddcee', fogNear: 60, fogFar: 280, exposure: 0.88, lamps: 0,
    sky: { top: '#5a8fd8', horizon: '#d3e3f5', bottom: '#b9c8da', sun: '#f4f8ff', glow: 0.25, disc: 3 },
  },
  night: {
    sun: '#5d6f9e', sunI: 0.18, hemiSky: '#1d2540', hemiGround: '#07080c', hemiI: 0.12,
    fill: '#ffcf8f', fillI: 0.08, fog: '#0a0d16', fogNear: 15, fogFar: 70, exposure: 1.05, lamps: 5.0, lampLight: 9,
    sky: { top: '#05070f', horizon: '#141b2e', bottom: '#05060a', sun: '#9fb4ff', glow: 0.05, disc: 0 },
  },
};

const W = 1080, H = 1920;

async function init() {
  const story = await (await fetch('story.json')).json();
  const stage = document.getElementById('stage');
  const canvas = document.getElementById('gl');

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(1);
  renderer.setSize(W, H, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, W / H, 0.1, 1200);

  // Licht
  const sun = new THREE.DirectionalLight('#ffffff', 3);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.02;
  sun.shadow.radius = 4;
  scene.add(sun, sun.target);
  const hemi = new THREE.HemisphereLight('#ffffff', '#444444', 1);
  scene.add(hemi);
  const fill = new THREE.DirectionalLight('#ffffff', 0.5); // folgt der Kamera, ohne Schatten
  scene.add(fill, fill.target);
  const lampLight = new THREE.PointLight('#ffc27a', 0, 14, 1.6);
  lampLight.castShadow = false;
  scene.add(lampLight);
  scene.fog = new THREE.Fog('#ffffff', 30, 160);
  const sky = makeSky();
  scene.add(sky);

  // Orte (nur die benutzten)
  const sets = {};
  const used = new Set(story.shots.map((s) => s.set));
  for (const name of used) {
    if (!SET_BUILDERS[name]) throw new Error('Ort fehlt: ' + name);
    sets[name] = SET_BUILDERS[name]();
    scene.add(sets[name].root);
  }

  // Figuren und Requisiten
  const actors = {};
  for (const [id, spec] of Object.entries(story.cast)) {
    const type = spec.type || 'person';
    let obj;
    if (type === 'person') { const ch = new Character(id, spec); obj = { root: ch.root, anchor: (n, o) => ch.anchor(n, o) }; actors[id] = { id, kind: 'person', char: ch, obj, root: ch.root }; }
    else if (type === 'bike') { obj = new Bike(id, spec); actors[id] = { id, kind: 'bike', obj, root: obj.root }; }
    else if (type === 'car') { obj = new Car(id, spec); actors[id] = { id, kind: 'car', obj, root: obj.root }; }
    else if (type === 'box') { obj = new Box(id, spec); actors[id] = { id, kind: 'box', obj, root: obj.root }; }
    else throw new Error('Unbekannter Typ ' + type);
    scene.add(actors[id].root);
  }
  scene.traverse((o) => { if (o.isMesh && o.material && o.material.isMeshStandardMaterial) o.material.shadowSide = THREE.FrontSide; });

  const timeline = new Timeline(story, { sets, actors, scene });

  // Nachbearbeitung
  const composer = new EffectComposer(renderer);
  composer.setPixelRatio(1);
  composer.setSize(W, H);
  composer.addPass(new RenderPass(scene, camera));
  const bokeh = new BokehPass(scene, camera, { focus: 5, aperture: 0.002, maxblur: 0.006 });
  composer.addPass(bokeh);
  const bloom = new UnrealBloomPass(new THREE.Vector2(W, H), 0.35, 0.5, 0.85);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
  composer.addPass(new SMAAPass(W, H));
  const finish = new ShaderPass({
    uniforms: { tDiffuse: { value: null }, frame: { value: 0 }, vignette: { value: 0.3 }, grain: { value: 0.022 }, res: { value: new THREE.Vector2(W, H) } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: /* glsl */`
      uniform sampler2D tDiffuse; uniform float frame; uniform float vignette; uniform float grain; uniform vec2 res;
      varying vec2 vUv;
      float hash(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
      void main() {
        vec4 c = texture2D(tDiffuse, vUv);
        vec2 d = (vUv - 0.5) * vec2(1.0, 0.82);
        float v = smoothstep(0.78, 0.22, length(d) * 1.25);
        c.rgb *= mix(1.0 - vignette, 1.0, v);
        float n = hash(vUv * res + vec2(frame * 37.0, frame * 11.0)) + hash(vUv * res * 0.5 + frame * 3.1) - 1.0;
        c.rgb += n * grain * (0.6 + 0.4 * (1.0 - dot(c.rgb, vec3(0.333))));
        gl_FragColor = c;
      }`,
  });
  composer.addPass(finish);

  const overlay = createOverlay(stage, story);

  let currentLight = '';
  function applyLighting(shot) {
    const set = sets[shot.set];
    const key = shot.set + '|' + shot.light + '|' + JSON.stringify(shot.lightOverrides || {});
    const L = { ...LIGHTING[shot.light], ...(shot.lightOverrides || {}) };
    if (!LIGHTING[shot.light]) throw new Error('Unbekannte Lichtstimmung ' + shot.light);
    if (key !== currentLight) {
      currentLight = key;
      sun.color.set(L.sun); sun.intensity = L.sunI;
      hemi.color.set(L.hemiSky); hemi.groundColor.set(L.hemiGround); hemi.intensity = L.hemiI;
      fill.color.set(L.fill); fill.intensity = L.fillI;
      scene.fog.color.set(L.fog); scene.fog.near = L.fogNear; scene.fog.far = L.fogFar;
      renderer.toneMappingExposure = L.exposure;
      const sk = { ...L.sky, ...((set.sky && set.sky[shot.light]) || {}) };
      const u = sky.userData.uniforms;
      u.top.value.set(sk.top); u.horizon.value.set(sk.horizon); u.bottom.value.set(sk.bottom);
      u.sunColor.value.set(sk.sun); u.sunGlow.value = sk.glow; u.sunDisc.value = sk.disc;
      for (const l of set.lamps || []) l.userData.glass.emissiveIntensity = L.lamps;
    }
    const dir = (set.sun && set.sun[shot.light]) || new THREE.Vector3(0.4, 0.6, 0.5).normalize();
    sky.userData.uniforms.sunDir.value.copy(dir);
    const sc = shot.shadow || {};
    const c = new THREE.Vector3(...(sc.center ? [sc.center[0], 0, sc.center[1]] : [0, 0, 0]));
    if (sc.follow) { c.copy(actors[sc.follow].root.getWorldPosition(new THREE.Vector3())); c.y = 0; }
    const size = sc.size || 16;
    sun.position.copy(c).addScaledVector(dir, 80);
    sun.target.position.copy(c);
    const cam = sun.shadow.camera;
    cam.left = -size; cam.right = size; cam.top = size; cam.bottom = -size; cam.near = 1; cam.far = 200;
    cam.updateProjectionMatrix();
    // Nachts: Licht an der naechsten Laterne
    if (shot.light === 'night' && (set.lamps || []).length) {
      const lamp = set.lamps[0];
      lamp.updateWorldMatrix(true, false);
      lampLight.position.copy(lamp.userData.lightPos).applyMatrix4(lamp.matrixWorld);
      lampLight.intensity = L.lampLight || 8;
    } else lampLight.intensity = 0;
    scene.background = null;
  }

  const focusTmp = new THREE.Vector3();
  function renderAt(t) {
    stage.querySelector('#ui').style.display = '';
    const { shot, tau } = timeline.evaluate(t);
    applyLighting(shot);
    const cam = timeline.camera(shot, tau);
    camera.position.copy(cam.pos);
    camera.fov = cam.fov;
    camera.updateProjectionMatrix();
    camera.lookAt(cam.look);
    camera.updateMatrixWorld();
    fill.position.copy(camera.position).add(new THREE.Vector3(0, 2, 0));
    fill.target.position.copy(cam.look);
    // Fokus auf die Hauptfigur
    const sc = shot.camera;
    let focusDist = 5;
    if (typeof sc.focus === 'number') focusDist = sc.focus;
    else if (sc.focus) {
      timeline.anchorPos(sc.focus, focusTmp);
      const dir = new THREE.Vector3();
      camera.getWorldDirection(dir);
      focusDist = focusTmp.sub(camera.position).dot(dir);
    }
    bokeh.uniforms.focus.value = focusDist;
    bokeh.uniforms.aperture.value = sc.aperture ?? 0.0012;
    bokeh.uniforms.maxblur.value = sc.maxblur ?? 0.006;
    bokeh.uniforms.aspect.value = W / H;
    bloom.strength = 0.35;
    finish.uniforms.frame.value = Math.round(t * (story.meta?.fps || 30));
    overlay.update(t);
    composer.render();
    return { shot: shot.id, focus: focusDist };
  }

  // ------------------------------------------------ Pruef- und Hilfsfunktionen
  window.renderAt = renderAt;
  window.storyMeta = () => ({ duration: story.meta.duration, fps: story.meta.fps, shots: story.shots.map((s) => ({ id: s.id, start: s.start, end: s.end })) });
  // Planungshilfe: Weltposition eines Ankers zum Zeitpunkt t
  window.anchorAt = (t, specs) => {
    timeline.evaluate(t);
    const out = {};
    for (const s of specs) { const v = timeline.anchorPos(s, new THREE.Vector3()); out[s] = [+v.x.toFixed(3), +v.y.toFixed(3), +v.z.toFixed(3)]; }
    return out;
  };
  window.meshNames = () => {
    const names = [];
    scene.traverse((o) => { if (o.name) names.push(o.name); });
    return names;
  };
  window.checkLayout = (t) => overlay.checkLayout(t);

  // Figuren-Standbild (vorn/seitlich/hinten) vor neutralem Hintergrund
  const studio = new THREE.Group();
  const floor = mesh(new THREE.CircleGeometry(4, 32), mat('#d9d4cc'), 'studio_floor', { cast: false, receive: true });
  floor.rotation.x = -Math.PI / 2;
  studio.add(floor);
  scene.add(studio);
  studio.visible = false;
  window.renderSheet = (ids, view, opts = {}) => {
    for (const s of Object.values(sets)) s.root.visible = false;
    for (const a of Object.values(actors)) a.root.visible = false;
    studio.visible = true;
    const list = Array.isArray(ids) ? ids : [ids];
    const yaw = { front: 0, side: Math.PI / 2, back: Math.PI, threequarter: Math.PI / 4 }[view] ?? 0;
    list.forEach((id, i) => {
      const a = actors[id];
      scene.add(a.root);
      a.root.visible = true;
      a.root.position.set((i - (list.length - 1) / 2) * 0.95, 0, 0);
      a.root.rotation.set(0, yaw, 0);
      if (a.kind === 'person') { a.char.applyPose({ ...DEFAULT_POSE, ...(opts.pose || {}) }, 0); }
    });
    const L = LIGHTING.morning;
    sun.color.set('#fff6ec'); sun.intensity = 2.6; sun.position.set(3, 6, 6); sun.target.position.set(0, 0.8, 0);
    const cam = sun.shadow.camera; cam.left = -4; cam.right = 4; cam.top = 4; cam.bottom = -4; cam.updateProjectionMatrix();
    hemi.color.set('#ffffff'); hemi.groundColor.set('#8a8277'); hemi.intensity = 1.2;
    fill.intensity = 0.5;
    scene.fog.near = 100; scene.fog.far = 400;
    const u = sky.userData.uniforms;
    u.top.value.set('#cfd6de'); u.horizon.value.set('#eceae6'); u.bottom.value.set('#d9d4cc'); u.sunDisc.value = 0; u.sunGlow.value = 0;
    currentLight = '';
    const h = opts.height || 1.0;
    const dist = opts.dist || 4.2;
    camera.fov = 34; camera.position.set(0, h, dist); camera.updateProjectionMatrix();
    camera.lookAt(0, opts.lookY || 0.85, 0);
    fill.position.set(0, 2, dist); fill.target.position.set(0, 0.8, 0);
    bokeh.uniforms.focus.value = dist; bokeh.uniforms.aperture.value = 0.0001; bokeh.uniforms.maxblur.value = 0.001;
    finish.uniforms.frame.value = 0;
    stage.querySelector('#ui').style.display = 'none';
    composer.render();
    studio.visible = false;
  };

  await document.fonts.ready;
  await Promise.all([
    document.fonts.load('500 74px "Cormorant Garamond"'), document.fonts.load('300 104px "Cormorant Garamond"'),
    document.fonts.load('400 84px "Cormorant Garamond"'), document.fonts.load('italic 500 50px "Cormorant Garamond"'),
    document.fonts.load('600 24px "Inter"'),
  ]);
  window.ready = true;
}

init().catch((e) => { window.initError = String(e && e.stack || e); console.error(e); });
