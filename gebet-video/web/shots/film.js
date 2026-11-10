// Phase 7 – der Film: Einstellungen aus web/sheets/board.js hintereinander, mit Bewegung pro Bild.
// URL-Parameter: from/to werden über render.mjs (--from/--to) gesteuert. Zeitplan = Shotliste (bis die Stimmen da sind).
import * as THREE from 'three';
import { build as buildBoard } from './board.js';
import { applyPose } from '../lib/poses.js';
import { drawTitle, drawSubtitles } from '../lib/overlay.js';
import { SHOTS } from '../sheets/board.js';

const ease = (x) => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
const lerp = (a, b, k) => a + (b - a) * k;

// Bewegung je Einstellung. figs: Index wie in board.js. Zeiten u = 0..1 innerhalb des Shots.
const MOTION = {
  S01: { figs: { 0: { walk: { speed: 1.6, hurry: 1 } } } },
  S02: { cam: { dolly: 0.35 }, figs: { 0: { breathe: 1 } } },
  S03: { cam: { zoomTo: 20 }, figs: { 1: { walk: { speed: 1.4, hurry: 1 } } } },
  S04: { cam: { pan: -0.06, dolly: 1.2 }, figs: { 0: { walk: { speed: 1.4, hurry: 1 } } } },
  S05: { cam: { dolly: 0.25 }, figs: { 0: { stepIn: 0.5, blendFrom: { mouth: 'closed' }, blend: [0.15, 0.55], talk: [0.3, 0.9] } } },
  S06: { figs: { 1: { blendFrom: ['handy'], blend: [0.0, 0.35], talk: [0.15, 0.9] } } },
  S07: { cam: { dolly: 0.2 }, figs: { 0: { blendFrom: {}, blend: [0, 0.4], talk: [0.05, 0.95] } } },
  S08: { cam: { dolly: 1.2 } },
  S09: { figs: { 0: { blendFrom: ['handy'], blend: [0, 0.5], talk: [0.1, 0.8] } } },
  S10: { cam: { dolly: 0.25 }, figs: { 1: { reachBlend: [0.05, 0.4], talk: [0.3, 0.95] }, 0: { nod: [0.55, 0.85] } } },
  S11: { figs: { 0: { blendFrom: ['handy', { neck: [0, 0, 0], head: [0.1, 0, 0] }], blend: [0, 0.7], talk: [0.0, 0.3] } } },
  S12: { cam: { dolly: 1.4 }, figs: { 0: { walk: { speed: 0.95 } }, 1: { walk: { speed: 1.0 } } } },
};

// Zeitplan aus den echten Stimmen (Hook + Straße). Dauer je Shot in Sekunden; Stimmen: [Zeile, Startzeit absolut].
const DUR = { S01: 1.0, S02: 1.05, S03: 1.1, S04: 2.2, S05: 1.95, S06: 3.75, S07: 1.55, S08: 1.95, S09: 2.65, S10: 3.3, S11: 1.1, S12: 2.0 };
export const VOICE = [['A01', 0.0], ['A02', 5.45], ['B01', 7.45], ['A03', 11.15], ['B02', 14.65], ['A04', 17.35], ['B03', 20.65]];
const SCHED = (() => { let t = 0; return SHOTS.map((s) => { const o = { ...s, t: DUR[s.id] ?? s.t, t0: t }; t += o.t; return o; }); })();

// Untertitel-Gruppen aus echten Wortzeiten: höchstens 3 Wörter / 18 Zeichen, Zitatanfang beginnt neue Gruppe
function groupWords(ws) {
  const groups = []; let cur = [];
  const len = (a) => a.reduce((n, w) => n + w.w.length, 0) + Math.max(0, a.length - 1);
  for (const w of ws) {
    const endOfSentence = cur.length && /[.?!:…]$|[.?!]“$/.test(cur[cur.length - 1].w);
    if (cur.length && (cur.length >= 3 || len([...cur, w]) > 20 || /^[„‚]/.test(w.w) || endOfSentence)) { groups.push(cur); cur = []; }
    cur.push(w);
  }
  if (cur.length) groups.push(cur);
  return groups.map((g, i) => ({ t0: g[0].t0, t1: (groups[i + 1] ? groups[i + 1][0].t0 : g[g.length - 1].t1 + 0.25), words: g }));
}

// Platzhalter-Lautstärke für Lippenbewegung (nur wo noch keine Stimme liegt)
const fakeAmp = (t) => Math.max(0, 0.55 + 0.45 * Math.sin(t * 13.1) * Math.sin(t * 4.3 + 1.1)) * (Math.sin(t * 2.2) > -0.75 ? 1 : 0);

export async function build(ctx) {
  const shot = await buildBoard(ctx);
  const LINES = await (await fetch('/assets/audio/zeilen/lines.json')).json();
  const voiceAt = (t) => { for (const [id, at] of VOICE) { const L = LINES[id]; if (L && t >= at && t < at + L.dauer) return { id, at, L }; } return null; };
  const subs = VOICE.filter(([id]) => id !== 'A01' && LINES[id]).flatMap(([id, at]) => groupWords(LINES[id].woerter.map((w) => ({ w: w.w, t0: at + w.t0, t1: at + w.t1 }))));
  const camera = shot.camera;
  let curId = null;
  let total = 0;
  for (const s of SCHED) total = Math.max(total, s.t0 + s.t);

  // Zustand aller Knoten einer Figur merken / mischen (für weiche Übergänge zwischen Posen)
  // Die Figur selbst (root) wird nicht gemischt: Position und Blickrichtung setzt der Shot.
  const snap = (f) => { const a = []; f.root.traverse((o) => { if (o !== f.root) a.push([o, o.position.clone(), o.quaternion.clone(), o.scale.clone()]); }); return a; };
  const mix = (state, k) => { for (const [o, p, q, s] of state) { o.position.lerpVectors(p, o.position.clone(), k); o.quaternion.copy(q.clone().slerp(o.quaternion.clone(), k)); o.scale.lerpVectors(s, o.scale.clone(), k); } };

  function reachTo(f, to) {
    const me = f.worldPoint('spine', [0, 0.4, 0]);
    const cands = ['shoulderL', 'shoulderR'].map((j) => to.worldPoint(j, [0, 0.07, 0]));
    const target = cands.sort((a, b) => a.distanceTo(me) - b.distanceTo(me))[0];
    const side = f.worldPoint('shoulderL').distanceTo(target) < f.worldPoint('shoulderR').distanceTo(target) ? 'L' : 'R';
    f.reach(side, target, side === 'L' ? [0.3, -1, -0.6] : [-0.3, -1, -0.6]);
    f.aimPalm(side, [0, -1, 0.2]);
    f.J['wrist' + side].rotation.x = -0.2;
    f.setHand(side, 'relaxed');
  }

  shot.duration = total;
  shot.update = (t) => {
    const s = SCHED.find((x) => t >= x.t0 && t < x.t0 + x.t) || SCHED[SCHED.length - 1];
    const v = voiceAt(t);
    if (s.id !== curId) { shot.setCell(s.id); curId = s.id; }
    const u = (t - s.t0) / s.t;
    const tl = t - s.t0;
    const m = MOTION[s.id] || { cam: { dolly: 0.15 } };
    const figs = shot.figs();
    const all = shot.allFigs();

    // Figuren
    s.figs.forEach((d, i) => {
      const f = all[i];
      if (!f) return;
      const fm = (m.figs || {})[i] || {};
      const base = shot.P(d.pose);
      // Position (Gehen, Schritt nach vorn)
      const fwd = new THREE.Vector3(Math.sin(d.ry), 0, Math.cos(d.ry));
      f.root.position.set(...d.pos);
      let pose = { ...base };
      if (fm.walk) {
        const dist = fm.walk.speed * (tl - s.t / 2);
        f.root.position.addScaledVector(fwd, dist);
        const stride = fm.walk.hurry ? 1.25 : 1.1;
        pose = { ...pose, walk: (base.walk || 0) + (dist / stride) * Math.PI * 2, walkOpt: { ...(base.walkOpt || {}), hurry: fm.walk.hurry || 0 } };
      }
      if (fm.stepIn) f.root.position.addScaledVector(fwd, fm.stepIn * (ease(u / 0.4) - 1));
      // Pose, weich übergeblendet
      if (fm.blendFrom) {
        applyPose(f, shot.P(fm.blendFrom));
        const st = snap(f);
        applyPose(f, pose);
        mix(st, ease((u - fm.blend[0]) / (fm.blend[1] - fm.blend[0])));
      } else applyPose(f, pose);
      if (d.reachTo && figs[d.reachTo]) {
        const st = snap(f);
        reachTo(f, figs[d.reachTo]);
        mix(st, fm.reachBlend ? ease((u - fm.reachBlend[0]) / (fm.reachBlend[1] - fm.reachBlend[0])) : 1);
      }
      // Atmen, Nicken, Sprechen (Mund nach Platzhalter-Lautstärke)
      f.breathe(t, i * 1.7, 1);
      if (fm.nod) f.J.head.rotation.x += Math.sin(ease((u - fm.nod[0]) / (fm.nod[1] - fm.nod[0])) * Math.PI * 2) * 0.12;
      const speaking = v && d.who === v.L.who;
      if (speaking || (!v && fm.talk && u >= fm.talk[0] && u <= fm.talk[1])) {
        const a = speaking ? (v.L.env[Math.min(v.L.env.length - 1, Math.floor((t - v.at) * 30))] || 0) : fakeAmp(t);
        if (base.mouth === 'smile' && a < 0.3) f.setMouth('smile'); else f.talk(a);
        f.J.head.rotation.x += (a - 0.5) * 0.03;
      }
    });

    // Kamera: Grundeinstellung + Bewegung
    shot.placeCam(s.cam);
    const c = m.cam || {};
    const k = ease(u);
    if (c.zoomTo) { camera.fov = lerp(s.cam.fov || 40, c.zoomTo, ease(u * 1.6)); camera.updateProjectionMatrix(); }
    if (c.pan) camera.rotateY(c.pan * (k - 0.5));
    if (c.dolly) camera.translateZ(-c.dolly * k);
  };
  shot.overlay = (g, t) => {
    drawTitle(g, 1080, 1920, t, ['Du hörst den Adhan –', 'und gehst weiter?'], { t0: 0.05, t1: 3.1, y: 420, style: 'b' });
    drawSubtitles(g, 1080, 1920, t, subs, { style: 'b', y: 1330 });
  };
  return shot;
}
