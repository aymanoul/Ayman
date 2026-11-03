// Zeitplan: macht aus Sprechertext + Wortzeiten absolute Zeiten fuer Einstellungen,
// Untertitel, Titel, Zaehler und Zeitsprung.
//
// Quelle der Wortzeiten:
//   audio/transkript.json  (faster-whisper auf audio/stimme.wav)  -> endgueltig
//   sonst ein ENTWURF aus geschaetzten Satzlaengen (nur fuer Vorschauen, wird
//   im Bild als "ENTWURF" markiert)
import { existsSync, readFileSync } from 'node:fs';

export const norm = (w) => w.toLowerCase().normalize('NFC').replace(/[^\p{L}\p{N}]/gu, '');

// Silben grob zaehlen (fuer den Entwurf)
function syllables(word) {
  const m = word.toLowerCase().match(/[aeiouyäöü]+/g);
  return Math.max(1, m ? m.length : 1);
}

// Entwurf der Stimme: gleiche Pausenregeln wie beim echten Zusammensetzen
export function draftVoice(story) {
  const V = story.voice;
  const sentences = [];
  let t = 0;
  for (const s of story.script) {
    const pause = s.id === 1 ? 0 : (V.pauseBefore?.[s.id] ?? V.gap);
    t += pause + 0.1;               // Pause + 0,1 s Reststille der Aufnahme
    const words = [];
    const toks = (s.speak || s.text).split(/\s+/).filter(Boolean);
    toks.forEach((tok, i) => {
      const dur = syllables(tok) / V.draftSyllablesPerSecond;
      words.push({ word: tok, start: +t.toFixed(3), end: +(t + dur).toFixed(3) });
      t += dur + 0.06;
      if (i === toks.length - 1) return;
      if (/[.!?“"]$/.test(tok)) t += 0.32;
      else if (/,$/.test(tok)) t += 0.16;
    });
    t -= 0.06;
    sentences.push({ id: s.id, words, start: words[0].start, end: words[words.length - 1].end });
    t += 0.1;
  }
  return { draft: true, sentences, duration: t };
}

export function loadTranscript(story, file = 'audio/transkript.json') {
  if (existsSync(file)) {
    const tr = JSON.parse(readFileSync(file, 'utf8'));
    return { draft: false, ...tr };
  }
  return draftVoice(story);
}

// "t" in Keys: Zahl | "end" | "end-0.4" | "50%" | "@null" | "@null+0.2" | "@4:null-0.1"
function resolveT(v, shot, words, ctx) {
  if (typeof v === 'number') return v;
  const s = String(v).trim();
  let m;
  if ((m = s.match(/^end([+-][\d.]+)?$/))) return shot.dur + (m[1] ? parseFloat(m[1]) : 0);
  if ((m = s.match(/^([\d.]+)%$/))) return shot.dur * parseFloat(m[1]) / 100;
  if ((m = s.match(/^@(?:(\d+):)?([^+-]+)([+-][\d.]+)?$/))) {
    const sid = m[1] ? Number(m[1]) : shot.sentence;
    const list = ctx.wordsOf(sid);
    const target = norm(m[2]);
    const w = list.find((x) => norm(x.word) === target);
    if (!w) throw new Error(`Einstellung ${shot.id}: Wort "${m[2]}" nicht in Satz ${sid} gefunden`);
    return w.start - shot.start + (m[3] ? parseFloat(m[3]) : 0);
  }
  throw new Error(`Einstellung ${shot.id}: Zeitangabe "${v}" unbekannt`);
}

export function resolveStory(story, transcript) {
  const out = JSON.parse(JSON.stringify(story));
  const off = story.voice.offset ?? 0;
  const sentences = transcript.sentences.map((s) => ({
    id: s.id,
    start: s.start + off, end: s.end + off,
    words: s.words.map((w) => ({ word: w.word, start: w.start + off, end: w.end + off, prob: w.prob })),
  }));
  const sent = (id) => {
    const s = sentences.find((x) => x.id === id);
    if (!s) throw new Error('Satz ' + id + ' fehlt in den Wortzeiten');
    return s;
  };
  const ctx = { wordsOf: (id) => sent(id).words };
  const lastEnd = Math.max(...sentences.map((s) => s.end));
  const duration = +(lastEnd + (story.meta.tail ?? 2)).toFixed(3);

  // Einstellungen: beginnen 0,25 s vor ihrem Satz; ohne Satz: nach dem vorigen Satz
  const lead = story.voice.shotLead ?? 0.25;
  const shots = out.shots;
  shots.forEach((sh, i) => {
    if (i === 0) sh.start = 0;
    else if (sh.sentence) sh.start = sent(sh.sentence).start - lead;
    else {
      const prevSentence = shots.slice(0, i).reverse().find((x) => x.sentence)?.sentence;
      sh.start = sent(prevSentence).end + (sh.afterSentence ?? 0.5);
    }
  });
  shots.forEach((sh, i) => {
    sh.end = i < shots.length - 1 ? shots[i + 1].start : duration;
    sh.start = +sh.start.toFixed(4); sh.end = +sh.end.toFixed(4);
    sh.dur = sh.end - sh.start;
    if (sh.minDuration && sh.dur < sh.minDuration - 1e-3) throw new Error(`Einstellung ${sh.id} nur ${sh.dur.toFixed(2)} s (min ${sh.minDuration})`);
  });
  // Key-Zeiten aufloesen
  for (const sh of shots) {
    const fix = (keys) => { for (const k of keys || []) k.t = +resolveT(k.t, sh, null, ctx).toFixed(4); keys?.sort((a, b) => a.t - b.t); };
    fix(sh.camera?.keys);
    for (const tr of Object.values(sh.actors || {})) fix(tr.keys);
    for (const keys of Object.values(sh.setKeys || {})) fix(keys);
    for (const fx of sh.sfx || []) { fx.t = +resolveT(fx.t, sh, null, ctx).toFixed(4); if (fx.until !== undefined) fx.until = +resolveT(fx.until, sh, null, ctx).toFixed(4); }
    for (const k of sh.camera?.keys || []) if (k.t > sh.dur + 1e-3 || k.t < -1e-3) throw new Error(`Einstellung ${sh.id}: Kamera-Key bei ${k.t} ausserhalb 0..${sh.dur.toFixed(2)}`);
  }

  // Titel
  const T = out.title;
  const s1 = sent(T.sentence ?? 1);
  T.start = 0;
  T.end = +Math.max(s1.end + (T.after ?? 0.4), T.min ?? 3.5).toFixed(3);
  const titleGone = T.end + (T.fadeOut ?? 0.4);

  // Schwarzbild + Zeitsprung
  const black = shots.filter((s) => s.black).map((s) => ({ start: s.start, end: s.end }));
  if (out.timeskip) {
    const s7 = sent(out.timeskip.sentence);
    out.timeskip.start = +s7.start.toFixed(3);
    out.timeskip.end = +(s7.end + (out.timeskip.after ?? 0.3)).toFixed(3);
  }

  // Zaehler
  const shotById = (id) => shots.find((s) => s.id === id);
  out.counters = out.counters.map((c) => {
    const r = { ...c };
    const from = shotById(c.fromShot);
    r.visibleFrom = c.fromShot === shots[0].id ? titleGone : from.start;
    r.visibleTo = c.toShot ? shotById(c.toShot).end : duration;
    r.countStart = c.countFromShot ? shotById(c.countFromShot).start : 0;
    const zw = ctx.wordsOf(c.zeroAt.sentence).find((w) => norm(w.word) === norm(c.zeroAt.word));
    if (!zw) throw new Error(`Zaehler: Wort "${c.zeroAt.word}" nicht in Satz ${c.zeroAt.sentence}`);
    r.countEnd = zw.start;
    return r;
  });

  // Untertitel (Rohdaten; Aufteilung in Zeilen macht die Textebene im Browser)
  const subs = [];
  for (const s of story.script) {
    if (s.subtitle === false) continue;
    const S = sent(s.id);
    subs.push({ id: s.id, text: s.display ?? s.text.toLowerCase(), words: S.words });
  }

  out.timing = {
    draft: !!transcript.draft, duration, fps: story.meta.fps,
    sentences, subtitles: subs, black,
    fadeOut: { start: duration - (story.meta.fadeOut ?? 1), end: duration },
    subtitleRules: story.subtitleRules,
  };
  out.meta.duration = duration;
  return out;
}
