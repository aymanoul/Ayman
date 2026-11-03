// Szene + Zeitachse. Stellt window.renderAt(t) bereit: setzt Figuren, Kamera,
// Zaehler und Untertitel fuer Zeitpunkt t und rendert genau einen Frame.
// Alle Zustaende sind reine Funktionen der Zeit (kein Simulationszustand), daher ist
// jedes Standbild sofort "eingeschwungen" und das Rendern deterministisch.
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

import { Character, DEFAULT_POSE, mat, mesh } from './character.js';
import { Bike, Car, Box, License } from './props.js';
import { buildPark } from './sets/park.js';
import { buildDriveway } from './sets/driveway.js';
import { makeSky } from './sets/common.js';
import { createOverlay, ZONES } from './overlay.js';
import { Timeline } from './timeline.js';

const SET_BUILDERS = { park: buildPark, driveway: buildDriveway };

// Lichtstimmungen. Gesichter bekommen immer Aufhelllicht von der Kamera aus (fill).
const LIGHTING = {
  evening: {
    sun: '#ffb36b', sunI: 3.3, hemiSky: '#ffcf9f', hemiGround: '#55603a', hemiI: 0.8,
    fill: '#ffe2c8', fillI: 0.85, fog: '#c98f66', fogNear: 45, fogFar: 240, exposure: 0.92, lamps: 3.0,
    sky: { top: '#4f5d96', horizon: '#ef9f68', bottom: '#a8775a', sun: '#ffd09a', glow: 0.35, disc: 5 },
  },
  afternoon: {
    sun: '#ffe2b8', sunI: 3.4, hemiSky: '#d9e6ff', hemiGround: '#8a8a62', hemiI: 0.85,
    fill: '#fff0dc', fillI: 0.7, fog: '#dbe3ec', fogNear: 60, fogFar: 280, exposure: 0.9, lamps: 0,
    sky: { top: '#4b86d6', horizon: '#e6ecef', bottom: '#c8c2b0', sun: '#fff4dc', glow: 0.3, disc: 3 },
  },
  golden: {
    sun: '#ffbe73', sunI: 3.5, hemiSky: '#ffd8a8', hemiGround: '#5f6a3e', hemiI: 0.8,
    fill: '#ffe4c4', fillI: 0.85, fog: '#e5a874', fogNear: 50, fogFar: 260, exposure: 0.95, lamps: 1.2,
    sky: { top: '#5f78b8', horizon: '#ffb070', bottom: '#b8845e', sun: '#ffd6a0', glow: 0.5, disc: 6 },
  },
  sunset: {
    sun: '#ff9a52', sunI: 3.0, hemiSky: '#ffbf8f', hemiGround: '#4a4a36', hemiI: 0.75,
    fill: '#ffd6b0', fillI: 0.6, fog: '#d58358', fogNear: 40, fogFar: 230, exposure: 0.95, lamps: 3.4,
    sky: { top: '#3f4c8a', horizon: '#ff8e4e', bottom: '#9a6346', sun: '#ffd08a', glow: 0.8, disc: 9 },
  },
  morning: {
    sun: '#dfe9ff', sunI: 3.3, hemiSky: '#cfe0ff', hemiGround: '#7f8f72', hemiI: 0.8,
    fill: '#eef3ff', fillI: 0.45, fog: '#cddcee', fogNear: 60, fogFar: 280, exposure: 0.88, lamps: 0,
    sky: { top: '#5a8fd8', horizon: '#d3e3f5', bottom: '#b9c8da', sun: '#f4f8ff', glow: 0.25, disc: 3 },
  },
  night: {
    sun: '#5d6f9e', sunI: 0.18, hemiSky: '#1d2540', hemiGround: '#07080c', hemiI: 0.12,
    fill: '#ffcf8f', fillI: 0.12, fog: '#0a0d16', fogNear: 15, fogFar: 70, exposure: 1.05, lamps: 5.0, lampLight: 9,
    sky: { top: '#05070f', horizon: '#141b2e', bottom: '#05060a', sun: '#9fb4ff', glow: 0.05, disc: 0 },
  },
};

const W = 1080, H = 1920;
const SCALE = 0.75;                       // ohne Grafikkarte: Canvas mit 0,75 rendern, auf 1080 x 1920 strecken
const RW = Math.round(W * SCALE), RH = Math.round(H * SCALE);

async function init() {
  const story = await (await fetch('story.json')).json();
  const TM = story.timing;
  const stage = document.getElementById('stage');
  const canvas = document.getElementById('gl');

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(1);
  renderer.setSize(RW, RH, false);
  canvas.style.width = W + 'px';
  canvas.style.height = H + 'px';
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, W / H, 0.1, 1200);

  // Licht
  const sun = new THREE.DirectionalLight('#ffffff', 3);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.bias = -0.0005;
  sun.shadow.normalBias = 0.025;
  sun.shadow.radius = 3;
  scene.add(sun, sun.target);
  const hemi = new THREE.HemisphereLight('#ffffff', '#444444', 1);
  scene.add(hemi);
  const fill = new THREE.DirectionalLight('#ffffff', 0.5); // Aufhelllicht, folgt der Kamera, ohne Schatten
  scene.add(fill, fill.target);
  const lampLight = new THREE.PointLight('#ffc27a', 0, 14, 1.6);
  scene.add(lampLight);
  scene.fog = new THREE.Fog('#ffffff', 30, 160);
  const sky = makeSky();
  scene.add(sky);

  // Orte (nur die benutzten)
  const sets = {};
  for (const name of new Set(story.shots.map((s) => s.set))) {
    if (!SET_BUILDERS[name]) throw new Error('Ort fehlt: ' + name);
    sets[name] = SET_BUILDERS[name]();
    scene.add(sets[name].root);
  }

  // Figuren und Requisiten
  const actors = {};
  for (const [id, spec] of Object.entries(story.cast)) {
    const type = spec.type || 'person';
    let obj;
    if (type === 'person') {
      const ch = new Character(id, spec);
      obj = { root: ch.root, anchor: (n, o) => ch.anchor(n, o) };
      actors[id] = { id, kind: 'person', char: ch, obj, root: ch.root };
    } else {
      const C = { bike: Bike, car: Car, box: Box, license: License }[type];
      if (!C) throw new Error('Unbekannter Typ ' + type);
      obj = new C(id, spec, story.cast);
      actors[id] = { id, kind: type, obj, root: obj.root };
    }
    scene.add(actors[id].root);
  }

  const timeline = new Timeline(story, { sets, actors, scene });

  // Nachbearbeitung: ACES, Bloom um Lichtquellen, SMAA, sanfte Vignette, leichtes Korn (kein Bokeh)
  const composer = new EffectComposer(renderer);
  composer.setPixelRatio(1);
  composer.setSize(RW, RH);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(RW, RH), 0.35, 0.5, 0.85);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
  composer.addPass(new SMAAPass(RW, RH));
  const finish = new ShaderPass({
    uniforms: { tDiffuse: { value: null }, frame: { value: 0 }, vignette: { value: 0.28 }, grain: { value: 0.02 }, res: { value: new THREE.Vector2(RW, RH) } },
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
    const L = { ...LIGHTING[shot.light], ...(shot.lightOverrides || {}) };
    if (!LIGHTING[shot.light]) throw new Error('Unbekannte Lichtstimmung ' + shot.light);
    const key = shot.set + '|' + shot.light + '|' + JSON.stringify(shot.lightOverrides || {});
    if (key !== currentLight) {
      currentLight = key;
      sun.color.set(L.sun); sun.intensity = L.sunI;
      hemi.color.set(L.hemiSky); hemi.groundColor.set(L.hemiGround); hemi.intensity = L.hemiI;
      fill.color.set(L.fill); fill.intensity = L.fillI;
      scene.fog.color.set(L.fog); scene.fog.near = L.fogNear; scene.fog.far = L.fogFar;
      renderer.toneMappingExposure = L.exposure;
      const sk = { ...L.sky, ...((set.sky && set.sky[shot.light]) || {}), ...(shot.skyOverrides || {}) };
      const u = sky.userData.uniforms;
      u.top.value.set(sk.top); u.horizon.value.set(sk.horizon); u.bottom.value.set(sk.bottom);
      u.sunColor.value.set(sk.sun); u.sunGlow.value = sk.glow; u.sunDisc.value = sk.disc;
      for (const l of set.lamps || []) l.userData.glass.emissiveIntensity = L.lamps;
    }
    const dir = shot.sun ? new THREE.Vector3(...shot.sun).normalize() : ((set.sun && set.sun[shot.light]) || new THREE.Vector3(0.4, 0.6, 0.5).normalize());
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
    lampLight.intensity = 0;
  }

  const inBlack = (t) => TM.black.some((b) => t >= b.start && t < b.end);
  // Kamera setzen; adjust = { pan, tilt (Grad), zoom (Abstandsfaktor) } aus dem Bildausschnitt-Optimierer
  const D2R = Math.PI / 180;
  function setCamera(cam, adj) {
    const pos = cam.pos.clone();
    if (adj && adj.zoom && adj.zoom !== 1) pos.copy(cam.look).add(cam.pos.clone().sub(cam.look).multiplyScalar(adj.zoom));
    camera.position.copy(pos);
    camera.fov = cam.fov;
    camera.updateProjectionMatrix();
    camera.lookAt(cam.look);
    if (adj && adj.pan) camera.rotateY(adj.pan * D2R);
    if (adj && adj.tilt) camera.rotateX(adj.tilt * D2R);
    camera.updateMatrixWorld();
  }
  function renderAt(t) {
    stage.querySelector('#ui').style.display = '';
    const { shot, tau } = timeline.evaluate(t);
    if (sets[shot.set].animate) sets[shot.set].animate(timeline.setState(shot, tau), t);
    applyLighting(shot);
    const cam = timeline.camera(shot, tau);
    setCamera(cam, shot.camera.adjust);
    // Aufhelllicht von vorn-oben (aus Kamerarichtung), damit Gesichter nie im Gegenlicht liegen
    // Requisiten mit faceCamera (Fuehrerschein) zeigen ihre Vorderseite zur Kamera
    for (const [id, tr] of Object.entries(shot.actors || {})) {
      if (tr.faceCamera) { const r = actors[id].obj.root; r.lookAt(camera.position); r.rotateZ((tr.tilt || 0) * Math.PI / 180); }
    }
    fill.position.copy(camera.position).add(new THREE.Vector3(0, 1.5, 0));
    fill.target.position.copy(cam.look);
    finish.uniforms.frame.value = Math.round(t * (story.meta.fps || 30));
    overlay.update(t);
    if (inBlack(t)) { renderer.setRenderTarget(null); renderer.setClearColor(0x000000, 1); renderer.clear(); }
    else composer.render();
    return { shot: shot.id };
  }

  // ------------------------------------------------ Pruef- und Hilfsfunktionen
  window.renderAt = renderAt;
  window.storyMeta = () => ({ duration: TM.duration, fps: story.meta.fps, draft: TM.draft, shots: story.shots.map((s) => ({ id: s.id, start: s.start, end: s.end, sentence: s.sentence ?? null })) });
  window.anchorAt = (t, specs) => {
    timeline.evaluate(t);
    const out = {};
    for (const s of specs) { const v = timeline.anchorPos(s, new THREE.Vector3()); out[s] = [+v.x.toFixed(3), +v.y.toFixed(3), +v.z.toFixed(3)]; }
    return out;
  };
  window.meshNames = () => { const names = []; scene.traverse((o) => { if (o.name) names.push(o.name); }); return names; };
  window.checkLayout = (t) => overlay.checkLayout(t);
  window.showZones = (on) => overlay.showZones(on);
  window.subtitleCues = () => overlay.cues.map((c) => ({ text: c.text, start: +c.start.toFixed(3), end: +c.end.toFixed(3), words: c.words.map((w) => w.word) }));

  // Wichtige Punkte (Gesichter, Haende, Fuehrerschein) duerfen nicht unter Texten oder TikTok-Elementen liegen
  const project = (v) => { const p = v.clone().project(camera); return { x: (p.x * 0.5 + 0.5) * W, y: (-p.y * 0.5 + 0.5) * H, z: p.z }; };
  // Ist der Punkt von der Kamera aus sichtbar? (verdeckt -> zaehlt nicht)
  const ray = new THREE.Raycaster();
  const faceTowardCamera = (actor) => {
    const ch = actor.char;
    const f = ch.anchor('face'), h = ch.anchor('head');
    return f.clone().sub(h).dot(camera.position.clone().sub(f)) > 0;
  };
  const visibleFrom = (v, ownId) => {
    const dir = v.clone().sub(camera.position);
    const dist = dir.length();
    ray.set(camera.position, dir.normalize());
    ray.far = dist - 0.06;
    const hits = ray.intersectObjects(scene.children, true);
    for (const h of hits) {
      const o = h.object;
      if (!o.visible || !o.isMesh) continue;
      let vis = true;
      for (let p = o; p; p = p.parent) if (!p.visible) { vis = false; break; }
      if (!vis) continue;
      const m = o.material;
      if (m && m.transparent && m.opacity < 0.5) continue;
      if (o.name === 'sky') continue;
      if (o.userData.actor === ownId) continue;
      return false;
    }
    return true;
  };
  window.keyPointCheck = (t, ids) => {
    renderAt(t);
    const shot = timeline.shotAt(t);
    const bad = [];
    if (inBlack(t)) return bad;
    const subOn = overlay.isSubVisible(t), cntOn = parseFloat(overlay.el.counter.style.opacity) > 0.01;
    const titleOn = parseFloat(overlay.el.title.style.opacity) > 0.01;
    const pts = [];
    for (const id of Object.keys(shot.actors || {})) {
      const a = actors[id];
      if (a.kind === 'person') for (const n of ['face', 'handL', 'handR']) if (n !== 'face' || faceTowardCamera(a)) pts.push([id + ':' + n, a.char.anchor(n)]);
      if (a.kind === 'license') pts.push([id + ':center', a.obj.anchor('center')]);
    }
    for (const [name, v] of pts) {
      if (ids && !ids.some((i) => name.startsWith(i))) continue;
      const p = project(v);
      if (!visibleFrom(v, name.split(':')[0])) continue;
      if (p.z > 1 || p.x < 0 || p.x > W || p.y < 0 || p.y > H) continue;
      const camDist = v.distanceTo(camera.position);
      if (camDist > 12) continue; // sehr kleine Figuren in Totalen
      if (subOn && p.y > 1130 && p.y < 1300 && p.x > 110 && p.x < 890) bad.push({ name, where: 'Untertitel', ...p });
      if (cntOn && p.x > 96 && p.x < 440 && p.y > 690 && p.y < 900) bad.push({ name, where: 'Zaehler', ...p });
      if (titleOn && shot.id === story.shots[0].id && p.y > 250 && p.y < 800) bad.push({ name, where: 'Titel', ...p });
      for (const z of ZONES) if (p.x > z.x0 && p.x < z.x1 && p.y > z.y0 && p.y < z.y1) bad.push({ name, where: 'TikTok ' + z.name, ...p });
    }
    return bad.map((b) => ({ ...b, x: Math.round(b.x), y: Math.round(b.y) }));
  };

  // Bildausschnitt-Optimierer: sucht pan/tilt/zoom, damit Gesichter, Haende und der
  // Fuehrerschein nicht unter Texten oder TikTok-Elementen liegen (ohne Rendern).
  window.solveFraming = (shotId, opts = {}) => {
    const shot = story.shots.find((s) => s.id === shotId);
    const nT = opts.times || 26;
    const M = 16; // Sicherheitsrand in Pixeln
    const samples = [];
    for (let i = 0; i < nT; i++) {
      const t = shot.start + 0.05 + (shot.dur - 0.1) * (i / (nT - 1));
      timeline.evaluate(t);
      if (sets[shot.set].animate) sets[shot.set].animate(timeline.setState(shot, t - shot.start), t);
      const cam = timeline.camera(shot, t - shot.start);
      setCamera(cam, null);
      for (const [id, tr] of Object.entries(shot.actors || {})) if (tr.faceCamera) actors[id].obj.root.lookAt(camera.position);
      scene.updateMatrixWorld(true);
      overlay.update(t);
      const subOn = overlay.isSubVisible(t), cntOn = parseFloat(overlay.el.counter.style.opacity) > 0.01;
      const titleOn = parseFloat(overlay.el.title.style.opacity) > 0.01 && shot.id === story.shots[0].id;
      const pts = [];
      for (const id of Object.keys(shot.actors || {})) {
        const a = actors[id];
        if (a.kind === 'person') for (const n of ['face', 'handL', 'handR']) if (n !== 'face' || faceTowardCamera(a)) pts.push({ name: id + ':' + n, face: n === 'face', v: a.char.anchor(n) });
        if (a.kind === 'license') pts.push({ name: id + ':center', face: true, v: a.obj.anchor('center') });
      }
      const vis = pts.filter((p) => p.v.distanceTo(camera.position) <= 12 && visibleFrom(p.v, p.name.split(':')[0]));
      // Pflichtpunkte: muessen im Bild bleiben (z.B. Hand, Sattel, Ruecken)
      const must = (shot.camera.must || []).map((m) => ({ name: m, v: timeline.anchorPos(m, new THREE.Vector3()) }));
      samples.push({ t, cam, pts: vis, must, subOn, cntOn, titleOn });
    }
    const score = (adj) => {
      let pen = 0.12 * Math.abs(adj.pan) + 0.12 * Math.abs(adj.tilt) + 4 * Math.abs(adj.zoom - 1);
      const issues = [];
      for (const s of samples) {
        setCamera(s.cam, adj);
        for (const m of s.must) {
          const q = project(m.v);
          if (q.z > 1 || q.x < 40 || q.x > W - 40 || q.y < 40 || q.y > H - 40) { pen += 20; issues.push(m.name + ' nicht im Bild t=' + s.t.toFixed(1)); }
        }
        for (const p of s.pts) {
          const q = project(p.v);
          if (q.z > 1) continue;
          const out = q.x < 0 || q.x > W || q.y < 0 || q.y > H;
          if (out) { if (p.face) { pen += 3; issues.push(p.name + ' ausserhalb'); } continue; }
          const hit = (w) => { pen += 10; issues.push(`${p.name} ${w} t=${s.t.toFixed(1)}`); };
          if (s.subOn && q.y > 1130 - M && q.y < 1300 + M && q.x > 110 - M && q.x < 890 + M) hit('Untertitel');
          if (s.cntOn && q.x > 96 - M && q.x < 440 + M && q.y > 690 - M && q.y < 900 + M) hit('Zaehler');
          if (s.titleOn && q.y > 250 && q.y < 800 + M) hit('Titel');
          for (const z of ZONES) if (q.x > z.x0 - M && q.x < z.x1 + M && q.y > z.y0 - M && q.y < z.y1 + M) hit('TikTok ' + z.name);
        }
      }
      return { pen, issues };
    };
    let best = null;
    const so = shot.camera.solve || {};
    const pans = so.pans || opts.pans || [-7, -5.5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5.5, 7];
    const tilts = so.tilts || opts.tilts || [-7, -5.5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5.5, 7];
    const zooms = so.zooms || opts.zooms || [0.85, 1, 1.15, 1.3, 1.5];
    for (const zoom of zooms) for (const pan of pans) for (const tilt of tilts) {
      const r = score({ pan, tilt, zoom });
      if (!best || r.pen < best.pen) best = { pan, tilt, zoom, pen: r.pen, issues: r.issues };
    }
    const base = score({ pan: 0, tilt: 0, zoom: 1 });
    return { shot: shotId, best: { pan: best.pan, tilt: best.tilt, zoom: best.zoom }, pen: +best.pen.toFixed(2), issues: [...new Set(best.issues)].slice(0, 8), before: [...new Set(base.issues)].length };
  };

  // Kontrast der Titelschrift gegen Bild + Verlaufsstreifen (WCAG-Kontrastverhaeltnis)
  window.titleContrast = (t) => {
    renderAt(t);
    const gl = renderer.getContext();
    const px = new Uint8Array(RW * RH * 4);
    gl.readPixels(0, 0, RW, RH, gl.RGBA, gl.UNSIGNED_BYTE, px);
    const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
    const lum = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
    const st = stage.getBoundingClientRect();
    const res = [];
    for (const line of overlay.el.title.children) {
      const range = document.createRange();
      range.selectNodeContents(line);
      const r = [...range.getClientRects()][0];
      const color = getComputedStyle(line).color.match(/\d+/g).map(Number);
      const Lt = lum(color[0], color[1], color[2]);
      const vals = [];
      for (let y = r.top - st.top; y < r.bottom - st.top; y += 4) {
        for (let x = r.left - st.left; x < r.right - st.left; x += 4) {
          const sx = Math.floor(x * SCALE), sy = RH - 1 - Math.floor(y * SCALE);
          const i = (sy * RW + sx) * 4;
          // Verlaufsstreifen: Alpha 0 -> 0,55 -> 0 zwischen y 250 und 850
          const k = (y - 250) / 600;
          const a = k <= 0 || k >= 1 ? 0 : 0.55 * (1 - Math.abs(k - 0.5) * 2);
          const mix = (c, s) => Math.round(c * (1 - a) + s * a);
          vals.push(lum(mix(px[i], 20), mix(px[i + 1], 14), mix(px[i + 2], 10)));
        }
      }
      vals.sort((p, q) => p - q);
      const Lb = vals[Math.floor(vals.length * 0.95)];   // 95 % des Hintergrunds sind dunkler
      res.push({ text: line.textContent, ratio: +((Lt + 0.05) / (Lb + 0.05)).toFixed(2) });
    }
    return res;
  };

  // Geraeusch-Ereignisse aus der Bewegung: Schritte, Raddrehung, Fahrzeuggeschwindigkeit
  window.motionTrack = (dt = 1 / 60) => timeline.motionTrack(dt);

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
      if (a.kind === 'person') a.char.applyPose({ ...DEFAULT_POSE, ...(opts.pose || {}) }, 0);
    });
    sun.color.set('#fff6ec'); sun.intensity = 2.6; sun.position.set(3, 6, 6); sun.target.position.set(0, 0.8, 0);
    const cam = sun.shadow.camera; cam.left = -4; cam.right = 4; cam.top = 4; cam.bottom = -4; cam.updateProjectionMatrix();
    hemi.color.set('#ffffff'); hemi.groundColor.set('#8a8277'); hemi.intensity = 1.2;
    fill.intensity = 0.5;
    renderer.toneMappingExposure = 1.0;
    scene.fog.near = 100; scene.fog.far = 400;
    const u = sky.userData.uniforms;
    u.top.value.set('#cfd6de'); u.horizon.value.set('#eceae6'); u.bottom.value.set('#d9d4cc'); u.sunDisc.value = 0; u.sunGlow.value = 0;
    currentLight = '';
    const dist = opts.dist || 4.2;
    camera.fov = 34; camera.position.set(0, opts.height || 1.0, dist); camera.updateProjectionMatrix();
    camera.lookAt(0, opts.lookY || 0.85, 0);
    fill.position.set(0, 2, dist); fill.target.position.set(0, 0.8, 0);
    finish.uniforms.frame.value = 0;
    stage.querySelector('#ui').style.display = 'none';
    stage.querySelector('#dim').style.opacity = '0';
    stage.querySelector('#fade').style.opacity = '0';
    composer.render();
    studio.visible = false;
  };

  await document.fonts.ready;
  await Promise.all([
    document.fonts.load('italic 500 62px "Cormorant Garamond"'), document.fonts.load('400 104px "DM Serif Display"'),
    document.fonts.load('400 116px "Instrument Serif"'), document.fonts.load('600 24px "Inter"'),
  ]);
  // Untertitel-Aufteilung erst nach dem Laden der Schriften messen
  overlay.update(0);
  window.ready = true;
}

init().catch((e) => { window.initError = String(e && e.stack || e); console.error(e); });
