// Einblendungen „Zwischen Adhan und Iqama“ (Blender-Fassung): Zeitbalken, Hook/Schluss-Titel, Untertitel, Karte H1,
// goldene Schrift, Bildschirmzeit, Gebetsnamen, Wörter, Logo; dazu das Handy-Display als Bild für die 3D-Textur.
// window.zeichne(zustand) malt eine durchsichtige Ebene (1080 × 1920); window.bild() gibt sie als PNG zurück.
import { drawSubtitles, drawTitle, drawCard, subtitleY } from '/web/lib/overlay.js';
import { CARDS } from '/iq/web/cards.js';
import * as G from '/iq/web/grafik.js';

const c = document.getElementById('c');
const g = c.getContext('2d');

function untertitelStill(text, y) {
  const ws = text.split(/\s+/);
  const words = ws.map((w, k) => ({ w, t0: k === ws.length - 1 ? 0 : 9, t1: 1 }));
  drawSubtitles(g, 1080, 1920, 0.5, [{ t0: 0, t1: 1, words }], { style: 'b', y });
}

const SCHRIFTEN = ['900 84px "Cairo"', '500 34px "Montserrat"', '700 34px "Montserrat"', '800 34px "Montserrat"', '400 42px "Amiri"', '700 42px "Amiri"'];
const schriftenGeladen = Promise.all(SCHRIFTEN.map((f) => document.fonts.load(f, 'Aaß')));
window.zeichne = async (z) => {
  await G.logoBereit; await schriftenGeladen; await document.fonts.ready;
  if (z.groesse) { c.width = z.groesse[0]; c.height = z.groesse[1]; } else if (c.width !== 1080) { c.width = 1080; c.height = 1920; }
  g.clearRect(0, 0, c.width, c.height);
  if (z.display) { G.display(g, c.width, c.height, z.display); return true; }       // nur das Handy-Display (Textur)
  if (z.abdunkeln) { g.fillStyle = `rgba(20,21,44,${z.abdunkeln})`; g.fillRect(0, 0, 1080, 1920); }
  if (z.logo) G.zeichneLogo(g, z.logo);
  if (z.balken) G.zeitbalken(g, z.balken);
  if (z.bildschirmzeit) G.bildschirmzeit(g, typeof z.bildschirmzeit === 'number' ? { minuten: z.bildschirmzeit } : z.bildschirmzeit);
  if (z.gold) G.goldSchrift(g, z.gold, { y: z.goldY || 640, a: z.goldA ?? 1 });
  (z.schilder || []).forEach((s) => G.beschriftung(g, s.text, s.xy[0], s.xy[1], s.a ?? 1));
  // Film (Phase 4): mit z.t laufen Wörter, Karte, Titel und Untertitel nach der Zeit (Ein-/Ausblenden wie im Gebet-Video)
  const t = z.t ?? 5;
  if (z.worte) G.worte(g, z.worte, { y: z.worteY || 1180, t, t0s: z.worteT0 || null, t1: z.worteT1 ?? 99 });
  let card = null;
  if (z.karte) card = typeof z.karte === 'string' ? drawCard(g, 5, CARDS[z.karte], { t0: 0, t1: 99 }) : drawCard(g, t, CARDS[z.karte.id], z.karte);
  if (z.titel) {
    if (Array.isArray(z.titel)) drawTitle(g, 1080, 1920, 5, z.titel, { t0: 0, t1: 99, y: z.titelY || 600, style: 'b', size: 84 });
    else drawTitle(g, 1080, 1920, t, z.titel.zeilen, { t0: z.titel.t0, t1: z.titel.t1, y: z.titel.y || 600, style: 'b', size: z.titel.size || 84 });
  }
  if (z.fuss) {
    g.save(); g.globalAlpha = z.fussA ?? 1; g.font = '700 30px "Montserrat"'; g.fillStyle = 'rgba(255,255,255,0.88)'; g.textAlign = 'center';
    g.shadowColor = 'rgba(0,0,0,0.7)'; g.shadowBlur = 10; g.fillText(z.fuss, 500, z.fussY || 1000); g.restore();
  }
  if (z.sub) drawSubtitles(g, 1080, 1920, t, [z.sub.gruppe], { style: 'b', y: z.sub.y || subtitleY(card) });
  if (z.untertitel) untertitelStill(z.untertitel, z.untertitelY || subtitleY(card));
  return true;
};
window.bild = () => c.toDataURL('image/png');
window.bereit = true;
