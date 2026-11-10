// Phase 9 – Titelbild 9:16. t < 1: Variante 1 (Gebetsreihe vor dem Mihrab), t ≥ 1: Variante 2 (Neubau, B läuft vorbei).
// Text im mittleren Bereich (sichtbar im 3:4-Raster des Profils).
import { build as buildBoard } from './board.js';
import { drawTitle } from '../lib/overlay.js';

export async function build(ctx) {
  const shot = await buildBoard(ctx);
  let cur = null;
  shot.duration = 2;
  shot.update = (t) => { const id = t < 1 ? 'S48' : 'S04'; if (id !== cur) { shot.setCell(id); cur = id; } };
  shot.overlay = (g, t) => {
    g.save();
    const grad = g.createLinearGradient(0, 560, 0, 1300);            // leichte Abdunklung hinter dem Text
    grad.addColorStop(0, 'rgba(33,34,66,0)'); grad.addColorStop(0.5, 'rgba(33,34,66,0.45)'); grad.addColorStop(1, 'rgba(33,34,66,0)');
    g.fillStyle = grad; g.fillRect(0, 560, 1080, 740);
    g.restore();
    drawTitle(g, 1080, 1920, 5, ['Die Wichtigkeit des Gebets'], { t0: 0, t1: 99, y: 740, style: 'b', size: 52 });
    drawTitle(g, 1080, 1920, 5, ['Du hörst den Adhan –', 'und gehst weiter?'], { t0: 0, t1: 99, y: 900, style: 'b', size: 104 });
  };
  return shot;
}
