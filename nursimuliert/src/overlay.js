// Textebene als HTML/CSS ueber dem Canvas: Titel, Zaehler, Untertitel, Zeitsprung, Abblende.
// Alle Werte kommen aus der Story (story/shots.json). update(t) setzt den Zustand fuer Zeitpunkt t.
import { fadeWindow, clamp } from './util.js';

const SAFE = { right: 900, bottom: 1480 };

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
  ui.innerHTML = `
    <div id="title"></div>
    <div id="counter"><div class="c-label"></div><div class="c-num"></div><div class="c-l3"></div><div class="c-l4"></div></div>
    <div id="sub"></div>
    <div id="skip"></div>`;
  const el = {
    title: ui.querySelector('#title'), counter: ui.querySelector('#counter'),
    label: ui.querySelector('.c-label'), num: ui.querySelector('.c-num'), l3: ui.querySelector('.c-l3'), l4: ui.querySelector('.c-l4'),
    sub: ui.querySelector('#sub'), skip: ui.querySelector('#skip'),
  };

  // Titel
  const T = story.title;
  const titleText = (T.lines ? T.lines.join('\n') : T.text);
  let html = esc(titleText);
  if (T.highlight) html = html.replace(esc(T.highlight), '<span class="gold">' + esc(T.highlight) + '</span>');
  el.title.innerHTML = html.replace(/\n/g, '<br>');

  // Untertitel: aus den Einstellungen sammeln
  const subs = [];
  for (const sh of story.shots) {
    if (!sh.subtitle) continue;
    const s = typeof sh.subtitle === 'string' ? { text: sh.subtitle } : sh.subtitle;
    subs.push({
      text: s.text,
      start: s.start ?? (sh.start + (s.delay ?? 0.2)),
      end: s.end ?? (sh.end - 0.05),
      fade: s.fade ?? 0.25,
    });
  }
  let curSub = null;
  const setSub = (text) => {
    if (text === curSub) return;
    curSub = text;
    el.sub.innerHTML = text ? esc(text) + '<span class="base"></span>' : '';
    if (!text) return;
    el.sub.style.top = '1000px';
    const base = el.sub.querySelector('.base').getBoundingClientRect().bottom;
    const st = stage.getBoundingClientRect().top;
    el.sub.style.top = (1000 + (story.layout?.subtitleBaseline ?? 1140) - (base - st)) + 'px';
  };

  // Zeitsprung
  const skip = story.timeskip;
  if (skip) el.skip.innerHTML = skip.lines.map((l) => '<div>' + esc(l) + '</div>').join('');

  let curCounterKey = '';
  function counterAt(t) {
    const list = story.counters;
    let c = list[0];
    for (const k of list) if (t >= k.start) c = k;
    return c;
  }

  function update(t) {
    // Titel
    el.title.style.opacity = fadeWindow(t, T.start ?? 0, (T.end ?? 3.2) + (T.fadeOut ?? 0.4), 0, T.fadeOut ?? 0.4).toFixed(3);

    // Zaehler
    const c = counterAt(t);
    let v;
    if (t <= c.countStart) v = c.from;
    else if (t >= c.countEnd) v = c.to ?? 0;
    else {
      const k = (t - c.countStart) / (c.countEnd - c.countStart);
      v = Math.ceil(c.from * (1 - k) - 1e-9);
    }
    const key = c.label + '|' + v + '|' + c.line3 + '|' + c.line4;
    if (key !== curCounterKey) {
      curCounterKey = key;
      el.label.textContent = c.label;
      el.num.innerHTML = fmtClock(v);
      el.l3.textContent = c.line3 || '';
      el.l4.textContent = c.line4 || '';
    }
    let cOp = 1;
    if (skip && skip.hideCounter) {
      // Der Zeitsprung steht am Platz des Zaehlers: Zaehler aus -> Text -> Zaehler (Teil 2) an
      const f = skip.counterFade ?? 0.3;
      if (t >= skip.start && t < skip.end) cOp = Math.max(1 - (t - skip.start) / f, Math.max(0, (t - (skip.end - f)) / f));
      cOp = clamp(cOp, 0, 1);
    }
    el.counter.style.opacity = cOp.toFixed(3);

    // Untertitel
    let active = null, op = 0;
    for (const s of subs) {
      const a = fadeWindow(t, s.start, s.end, s.fade, s.fade);
      if (a > 0) { active = s; op = a; }
    }
    setSub(active ? active.text : null);
    el.sub.style.opacity = op.toFixed(3);

    // Zeitsprung + Abdunkeln
    if (skip) {
      const f = skip.counterFade ?? 0.3;
      const tf = skip.textFade ?? 0.25;
      el.skip.style.opacity = (skip.hideCounter
        ? fadeWindow(t, skip.start + f, skip.end - f, tf, tf)
        : fadeWindow(t, skip.start, skip.end, tf, tf)).toFixed(3);
      dim.style.opacity = (fadeWindow(t, skip.start, skip.end, skip.dimIn ?? 0.45, 0.0) * (skip.dim ?? 0.6)).toFixed(3);
    }
    // Abblende ins Schwarze
    const fo = story.fadeOut;
    fade.style.opacity = fo ? clamp((t - fo.start) / (fo.end - fo.start), 0, 1).toFixed(3) : '0';
  }

  // Pruefung: Liegen alle Texte im sicheren Bereich? (fuer render.mjs)
  function checkLayout(t) {
    update(t);
    const st = stage.getBoundingClientRect();
    const out = [];
    for (const [name, node] of Object.entries({ title: el.title, counter: el.counter, sub: el.sub, skip: el.skip })) {
      if (!node.textContent.trim() || parseFloat(node.style.opacity || '1') <= 0) continue;
      // Textzeilen messen (Range liefert die echte Ausdehnung der Schrift)
      const range = document.createRange();
      range.selectNodeContents(node);
      const rects = [...range.getClientRects()].filter((r) => r.width > 0);
      for (const r of rects) {
        const box = { name, left: r.left - st.left, right: r.right - st.left, top: r.top - st.top, bottom: r.bottom - st.top };
        if (box.right > SAFE.right || box.bottom > SAFE.bottom || box.left < 0 || box.top < 0) out.push(box);
      }
    }
    return out;
  }

  return { update, checkLayout, el };
}
