// Phase 6 – Vorschau der Einblendungen: Untertitel-Stile a/b, Beweis-Karten (mit/ohne Arabisch), Hook, Schlusssatz.
// Standbilder bei t = 0,5 / 1,5 / … (je eine Variante pro Sekunde), Animationsprobe von t = 10 bis 14,5.
import { build as buildBoard } from './board.js';
import { drawSubtitles, drawTitle, drawCard, subtitleY } from '../lib/overlay.js';

// Text → Untertitel-Gruppen (1–3 Wörter), Zeit gleichmäßig verteilt. ﷻ/ﷺ hängen am vorigen Wort.
export function wordGroups(text, t0, t1, per = 3, maxChars = 18) {
  const isHonor = (w) => /^[\uFDFA\uFDFB]$/.test(w);
  const raw = text.split(/\s+/).filter(Boolean);
  const dt = (t1 - t0) / raw.filter((w) => !isHonor(w)).length;
  const words = []; let t = t0;
  for (const w of raw) {
    if (isHonor(w) && words.length) { const p = words[words.length - 1]; words.push({ w, t0: p.t0, t1: p.t1 }); continue; }
    words.push({ w, t0: t, t1: t + dt }); t += dt;
  }
  // Gruppen: höchstens `per` Wörter und `maxChars` Zeichen (lange Wörter stehen allein), Ehrenformel nie abtrennen
  const groups = []; let cur = [];
  const len = (ws) => ws.filter((x) => !isHonor(x.w)).reduce((a, x) => a + x.w.length, 0) + Math.max(0, ws.length - 1);
  for (const w of words) {
    if (isHonor(w.w)) { cur.push(w); continue; }
    const n = cur.filter((x) => !isHonor(x.w)).length;
    if (cur.length && (n >= per || len([...cur, w]) > maxChars || /^[„‚]/.test(w.w))) { groups.push(cur); cur = []; }   // Zitatanfang beginnt neue Gruppe
    cur.push(w);
  }
  if (cur.length) groups.push(cur);
  return groups.map((ws) => ({ t0: ws[0].t0, t1: ws[ws.length - 1].t1, words: ws }));
}

const CARDS = {
  Q1: { kind: 'quran', ar: 'إِنَّ ٱلصَّلَوٰةَ كَانَتۡ عَلَى ٱلۡمُؤۡمِنِينَ كِتَٰبٗا مَّوۡقُوتٗا', de: '„Das Gebet ist den Gläubigen zu bestimmten Zeiten vorgeschrieben.“', src: 'Sura an-Nisāʾ, Vers 103 (Auszug)' },
  Q4: { kind: 'quran', ar: 'فَوَيۡلٞ لِّلۡمُصَلِّينَ\nٱلَّذِينَ هُمۡ عَن صَلَاتِهِمۡ سَاهُونَ', de: '„Wehe nun den Betenden, denjenigen, die auf ihre Gebete nicht achten,“', src: 'Sura al-Māʿūn, Vers 4–5' },
  H2: { kind: 'hadith', de: '„Zwischen einer Person und dem Götzendienst (Schirk) und dem Unglauben (Kufr) steht die Unterlassung des Gebets.“', src: 'Überliefert von Jābir · Muslim 82' },
  H2ar: { kind: 'hadith', ar: '«إِنَّ بَيْنَ الرَّجُلِ وَبَيْنَ الشِّرْكِ وَالْكُفْرِ تَرْكَ الصَّلَاةِ»', de: '„Zwischen einer Person und dem Götzendienst (Schirk) und dem Unglauben (Kufr) steht die Unterlassung des Gebets.“', src: 'Überliefert von Jābir · Muslim 82' },
  H7: { kind: 'hadith', ar: '«إن أول ما يحاسب به العبد الصلاة»', de: '„Das Erste, worüber der Diener abgerechnet wird, ist das Gebet.“', src: 'Überliefert von Tamīm ad-Dārī · Abū Dāwūd, Ibn Māja, ad-Dārimī · ḥasan' },
  H4a: { kind: 'hadith', de: '„Was meint ihr, wenn vor der Tür eines von euch ein Fluss wäre, in dem er sich jeden Tag fünfmal wäscht, würde das etwas von seinem Schmutz übriglassen?“', src: 'Überliefert von Abū Huraira · al-Bukhārī 528, Muslim 667 (1/2)' },
};

// Varianten (eine pro Sekunde)
const V = [
  { bg: 'S17', style: 'a', text: 'Allah ﷻ sagt:' },
  { bg: 'S17', style: 'b', text: 'Allah ﷻ sagt:' },
  { bg: 'S18', style: 'a', text: 'zu bestimmten Zeiten', card: 'Q1' },
  { bg: 'S20', style: 'b', text: 'auf ihre Gebete', card: 'Q4' },
  { bg: 'S26', style: 'a', text: 'die Unterlassung des', card: 'H2' },
  { bg: 'S26', style: 'a', text: 'die Unterlassung des', card: 'H2ar' },
  { bg: 'S39', style: 'a', text: 'vor der Tür', card: 'H4a' },
  { bg: 'S01', style: 'a', title: ['Du hörst den Adhan –', 'und gehst weiter?'], ty: 470 },
  { bg: 'S49', style: 'a', title: ['Dein nächstes Gebet', 'ist dein Neuanfang.'], ty: 900 },
  { bg: 'S31', style: 'b', text: 'ist das Gebet.', card: 'H7' },
];
const ANIM = { from: 10, to: 14.5, bg: 'S18', card: 'Q1', cardIn: 10.7, cardOut: 14.1,
  text: 'Allah ﷻ sagt: „Das Gebet ist den Gläubigen zu bestimmten Zeiten vorgeschrieben.“' };

export async function build(ctx) {
  const shot = await buildBoard(ctx);
  let cur = null;
  const setBg = (id) => { if (id !== cur) { shot.setCell(id); cur = id; } };
  const animGroups = wordGroups(ANIM.text, ANIM.from + 0.3, ANIM.to - 0.3);
  shot.duration = ANIM.to;
  shot.update = (t) => setBg(t >= ANIM.from ? ANIM.bg : V[Math.min(V.length - 1, Math.floor(t))].bg);
  shot.overlay = (g, t) => {
    if (t >= ANIM.from) {
      const top = drawCard(g, t, CARDS[ANIM.card], { t0: ANIM.cardIn, t1: ANIM.cardOut });
      drawSubtitles(g, 1080, 1920, t, animGroups, { style: 'a', y: subtitleY(top) });
      return;
    }
    const v = V[Math.min(V.length - 1, Math.floor(t))];
    const i = Math.floor(t);
    let top = null;
    if (v.card) top = drawCard(g, 5, CARDS[v.card], { t0: 0, t1: 99 });
    if (v.title) drawTitle(g, 1080, 1920, 5, v.title, { t0: 0, t1: 99, y: v.ty, style: v.style });
    if (v.text) {
      const ws = v.text.split(/\s+/);
      const words = ws.map((w, k) => ({ w, t0: k === ws.length - 1 ? i : i + 9, t1: i + 1 }));   // letztes Wort hervorgehoben
      if (/^[ﷺﷻ]$/.test(ws[ws.length - 1])) words[words.length - 2].t0 = i;
      drawSubtitles(g, 1080, 1920, t, [{ t0: i, t1: i + 1, words }], { style: v.style, y: subtitleY(top) });
    }
  };
  return shot;
}
