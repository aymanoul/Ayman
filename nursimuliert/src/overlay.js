// Textebene als HTML/CSS ueber dem Canvas: Titel (mit Verlaufsstreifen), Zaehler,
// Untertitel, Zeitsprung, Schwarzbild, Abblende. Alle Zeiten kommen aufgeloest aus
// story.timing (tools/zeitplan.mjs). update(t) setzt den Zustand fuer Zeitpunkt t.
import { fadeWindow, clamp } from './util.js';

// TikTok-Bedienelemente: hier steht nie Text
export const ZONES = [
  { name: 'oben', x0: 0, y0: 0, x1: 1080, y1: 280 },
  { name: 'rechts', x0: 920, y0: 700, x1: 1080, y1: 1580 },
  { name: 'unten', x0: 0, y0: 1480, x1: 1080, y1: 1920 },
];

function esc(s) {
  return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
}

function fmtClock(sec) {
  const m = Math.floor(sec / 60), s = sec % 60;
  const str = m + ':' + String(s).padStart(2, '0');
  return [...str].map((ch) => (ch === ':' ? '<span class="colon">:</span>' : '<span class="d">' + ch + '</span>')).join('');
}

export function createOverlay(stage, story) {
  const ui = stage.querySelector('#ui');
  const dim = stage.querySelector('#dim');
  const fade = stage.querySelector('#fade');
  const TM = story.timing;
  ui.innerHTML = `
    <div id="titleBand"></div>
    <div id="title"></div>
    <div id="counter"><div class="c-label"></div><div class="c-num"></div><div class="c-l3"></div><div class="c-l4"></div></div>
    <div id="sub"></div>
    <div id="skip"></div>
    <div id="measure"></div>
    <div id="zones">${ZONES.map((z) => `<div style="left:${z.x0}px;top:${z.y0}px;width:${z.x1 - z.x0}px;height:${z.y1 - z.y0}px"></div>`).join('')}</div>
    ${TM.draft ? '<div id="draft">ENTWURF · ZEITEN GESCHÄTZT · OHNE STIMME</div>' : ''}`;
  const el = {
    band: ui.querySelector('#titleBand'), title: ui.querySelector('#title'), counter: ui.querySelector('#counter'),
    label: ui.querySelector('.c-label'), num: ui.querySelector('.c-num'), l3: ui.querySelector('.c-l3'), l4: ui.querySelector('.c-l4'),
    sub: ui.querySelector('#sub'), skip: ui.querySelector('#skip'), measure: ui.querySelector('#measure'), zones: ui.querySelector('#zones'),
  };

  // Titel: Zeilen mit eigener Schrift
  const T = story.title;
  el.title.innerHTML = T.lines.map((l) => `<div class="${l.style === 'big' ? 't-big' : 't-small'}${l.gold ? ' gold' : ''}">${esc(l.text)}</div>`).join('');

  // Untertitel: ein Untertitel pro Satz; laenger als 2 Zeilen -> an Komma oder Sprechpause > 0,25 s teilen
  const R = { lead: 0.08, tail: 0.25, gap: 0.05, fade: 0.15, maxLines: 2, pause: 0.25, ...(TM.subtitleRules || {}) };
  const lineH = 56 * 1.15;
  const linesOf = (text) => { el.measure.textContent = text; return Math.round(el.measure.getBoundingClientRect().height / lineH); };
  // Erst nach dem Laden der Schriften messen (prepare)
  const cues = [];
  let prepared = false;
  function prepare() {
  if (prepared) return;
  prepared = true;
  for (const s of TM.subtitles) {
    const toks = s.text.split(/\s+/).filter(Boolean);
    const W = s.words;
    // Zeit fuer Token i (Anfang/Ende): gleiche Anzahl -> direkt, sonst anteilig
    const tStart = (i) => (W.length === toks.length ? W[i].start : W[Math.min(W.length - 1, Math.floor((i / toks.length) * W.length))].start);
    const tEnd = (i) => (W.length === toks.length ? W[i].end : W[Math.min(W.length - 1, Math.ceil(((i + 1) / toks.length) * W.length) - 1)].end);
    const split = (a, b) => {
      const text = toks.slice(a, b).join(' ');
      if (b - a <= 1 || linesOf(text) <= R.maxLines) return [[a, b]];
      // Kandidaten: nach Komma/Punkt oder vor einer Pause > 0,25 s
      let best = null;
      for (let i = a + 1; i < b; i++) {
        const punct = /[,.;:!?‘’“”]$/.test(toks[i - 1]);
        const pause = tStart(i) - tEnd(i - 1) > R.pause;
        if (!punct && !pause) continue;
        const bal = Math.abs(toks.slice(a, i).join(' ').length - toks.slice(i, b).join(' ').length);
        if (!best || bal < best.bal) best = { i, bal };
      }
      if (!best) return [[a, b]];
      return [...split(a, best.i), ...split(best.i, b)];
    };
    for (const [a, b] of split(0, toks.length)) {
      cues.push({ id: s.id, text: toks.slice(a, b).join(' '), start: tStart(a) - R.lead, end: tEnd(b - 1) + R.tail, words: W.filter((w) => w.start >= tStart(a) - 0.01 && w.end <= tEnd(b - 1) + 0.01) });
    }
  }
  cues.sort((x, y) => x.start - y.start);
  cues.forEach((c, i) => {
    if (i < cues.length - 1) c.end = Math.min(c.end, cues[i + 1].start - R.gap);
    else if (story.lastSubtitleToEnd !== false) c.end = TM.duration;
  });
  }
  let curSub = null;
  const setSub = (text) => {
    if (text === curSub) return;
    curSub = text;
    el.sub.textContent = text || '';
  };

  // Zeitsprung
  const skip = story.timeskip;
  if (skip) el.skip.innerHTML = skip.lines.map((l) => '<div>' + esc(l) + '</div>').join('');

  let curCounterKey = '';
  const titleGone = T.end + (T.fadeOut ?? 0.4);
  const inBlack = (t) => TM.black.some((b) => t >= b.start && t < b.end);

  function counterState(t) {
    let c = null;
    for (const k of story.counters) if (t >= k.visibleFrom - 1e-6 && t < k.visibleTo) c = k;
    return c;
  }

  function update(t) {
    prepare();
    // Titel + Streifen
    const top = fadeWindow(t, 0, T.end + (T.fadeOut ?? 0.4), 0, T.fadeOut ?? 0.4);
    el.title.style.opacity = top.toFixed(3);
    el.band.style.opacity = top.toFixed(3);

    // Zaehler (nie gleichzeitig mit dem Titel, auf Schwarz aus)
    const c = counterState(t);
    let cOp = 0, scale = 1;
    if (c && !inBlack(t) && t >= titleGone) {
      let v;
      if (t <= c.countStart) v = c.hold ?? c.from;
      else if (t >= c.countEnd) v = 0;
      else {
        const k = (t - c.countStart) / (c.countEnd - c.countStart);
        v = Math.ceil((c.hold ?? c.from) * (1 - k) - 1e-9);
      }
      if (c.countStart === 0 && t <= 0) v = c.from;
      const key = c.label + '|' + v + '|' + c.line3 + '|' + c.line4;
      if (key !== curCounterKey) {
        curCounterKey = key;
        el.label.textContent = c.label;
        el.num.innerHTML = fmtClock(v);
        el.l3.textContent = c.line3 || '';
        el.l4.textContent = c.line4 || '';
      }
      cOp = Math.min(1, (t - Math.max(c.visibleFrom, titleGone)) / 0.3);
      const pk = (t - c.countEnd) / 0.4;
      if (pk >= 0 && pk <= 1) scale = 1 + 0.14 * Math.sin(Math.PI * pk);
    }
    el.counter.style.opacity = clamp(cOp, 0, 1).toFixed(3);
    el.num.style.transform = `scale(${scale.toFixed(4)})`;

    // Untertitel
    let active = null, op = 0;
    for (const s of cues) {
      const a = fadeWindow(t, s.start, s.end, R.fade, s.end >= TM.duration - 1e-3 ? 0 : R.fade);
      if (a > 0) { active = s; op = a; }
    }
    setSub(active ? active.text : null);
    el.sub.style.opacity = op.toFixed(3);

    // Schwarz + Zeitsprung
    dim.style.opacity = inBlack(t) ? '1' : '0';
    if (skip) el.skip.style.opacity = (inBlack(t) ? fadeWindow(t, skip.start, skip.end, 0.15, 0.15) : 0).toFixed(3);

    // Abblende in der letzten Sekunde
    const fo = TM.fadeOut;
    fade.style.opacity = clamp((t - fo.start) / (fo.end - fo.start), 0, 1).toFixed(3);
  }

  // Alle Textzeilen messen und gegen die TikTok-Bereiche pruefen
  function textRects() {
    const st = stage.getBoundingClientRect();
    const out = [];
    for (const [name, node] of Object.entries({ title: el.title, counter: el.counter, sub: el.sub, skip: el.skip })) {
      if (!node.textContent.trim() || parseFloat(node.style.opacity || '1') <= 0.001) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      for (const r of range.getClientRects()) {
        if (r.width <= 0) continue;
        out.push({ name, x0: r.left - st.left, y0: r.top - st.top, x1: r.right - st.left, y1: r.bottom - st.top });
      }
    }
    return out;
  }
  function checkLayout(t) {
    update(t);
    const bad = [];
    for (const r of textRects()) {
      for (const z of ZONES) {
        if (r.x0 < z.x1 && r.x1 > z.x0 && r.y0 < z.y1 && r.y1 > z.y0) bad.push({ ...r, zone: z.name });
      }
      if (r.x0 < 0 || r.y0 < 0 || r.x1 > 1080 || r.y1 > 1920) bad.push({ ...r, zone: 'Rand' });
    }
    return bad;
  }
  const showZones = (on) => { el.zones.style.display = on ? 'block' : 'none'; };
  const isSubVisible = (t) => cues.some((s) => t >= s.start && t <= s.end);
  const isCounterVisible = (t) => { update(t); return parseFloat(el.counter.style.opacity) > 0.01; };

  return { update, prepare, checkLayout, textRects, showZones, cues, isSubVisible, isCounterVisible, el };
}
