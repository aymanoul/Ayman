// 2D-Einblendungen (Titel, Wort-für-Wort-Untertitel, Hilfslinien für sichere Bereiche).
export const SAFE = { top: 250, bottom: 420, right: 160 };
export const SUB_STYLES = {
  a: { font: '800 96px "Baloo 2"', color: '#ffffff', accent: '#FFE033', stroke: '#141414', strokeW: 16 },
  b: { font: '800 84px "Montserrat"', color: '#ffffff', accent: '#D9B26A', stroke: '#212242', strokeW: 16 },
};

const easeOutBack = (x) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
const clamp01 = (x) => Math.max(0, Math.min(1, x));

function strokeFill(g, text, x, y, fill, stroke, lw) {
  g.lineJoin = 'round';
  g.lineWidth = lw;
  g.strokeStyle = stroke;
  g.shadowColor = 'rgba(0,0,0,0.45)';
  g.shadowBlur = 14; g.shadowOffsetY = 6;
  g.strokeText(text, x, y);
  g.shadowColor = 'transparent'; g.shadowBlur = 0; g.shadowOffsetY = 0;
  g.fillStyle = fill;
  g.fillText(text, x, y);
}

// words: [{w:'Text', t0, t1, accent?}], group: Wörter, die gleichzeitig stehen (1–3)
export function drawSubtitles(g, W, H, t, groups, { style = 'a', y = 1300 } = {}) {
  const st = SUB_STYLES[style];
  const grp = groups.find((gr) => t >= gr.t0 && t < gr.t1);
  if (!grp) return;
  g.save();
  g.font = st.font;
  g.textBaseline = 'middle';
  g.textAlign = 'left';
  const gap = 26;
  const widths = grp.words.map((w) => g.measureText(w.w).width);
  const total = widths.reduce((a, b) => a + b, 0) + gap * (grp.words.length - 1);
  const cx = (W - SAFE.right * 0.5) / 2;
  const pop = easeOutBack(clamp01((t - grp.t0) / 0.14));
  g.translate(cx, y);
  g.scale(0.82 + 0.18 * pop, 0.82 + 0.18 * pop);
  let x = -total / 2;
  grp.words.forEach((w, i) => {
    const active = t >= w.t0 && t < w.t1;
    strokeFill(g, w.w, x, 0, active ? st.accent : st.color, st.stroke, st.strokeW);
    x += widths[i] + gap;
  });
  g.restore();
}

export function drawTitle(g, W, H, t, lines, { t0 = 0, t1 = 4, y = 330 } = {}) {
  if (t < t0 || t > t1) return;
  const a = clamp01((t - t0) / 0.25) * clamp01((t1 - t) / 0.3);
  g.save();
  g.globalAlpha = a;
  g.font = '800 84px "Baloo 2"';
  g.textAlign = 'center'; g.textBaseline = 'middle';
  const cx = (W - SAFE.right * 0.5) / 2;
  lines.forEach((ln, i) => strokeFill(g, ln, cx, y + i * 92, '#ffffff', '#141414', 16));
  g.restore();
}

export function drawGuides(g, W, H) {
  g.save();
  g.fillStyle = 'rgba(255,40,40,0.22)';
  g.fillRect(0, 0, W, SAFE.top);
  g.fillRect(0, H - SAFE.bottom, W, SAFE.bottom);
  g.fillRect(W - SAFE.right, SAFE.top, SAFE.right, H - SAFE.top - SAFE.bottom);
  g.strokeStyle = 'rgba(255,255,255,0.9)'; g.lineWidth = 3; g.setLineDash([14, 10]);
  g.strokeRect(0, SAFE.top, W - SAFE.right, H - SAFE.top - SAFE.bottom);
  g.setLineDash([]);
  g.font = '700 30px "Montserrat"'; g.fillStyle = '#fff'; g.textAlign = 'center';
  g.fillText('frei lassen: TikTok/Instagram-Oberfläche', W / 2, 130);
  g.fillText('frei lassen: Beschreibung und Knöpfe', W / 2, H - 200);
  g.restore();
}
