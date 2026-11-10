// Phase 4 – Storyboard: Shotliste als Daten (für Standbilder, Blätter und docs/phase4-shotliste.md).
// Zeiten sind Schätzungen und werden in Phase 5/7 an die echten Tonaufnahmen angepasst.
export const SHOT = 'board';
export const SIZE = [540, 960];
export const KICKER = 'Masjid As-Sunnah · Die Wichtigkeit des Gebets · Phase 4 Storyboard';

const TAU = Math.PI * 2;
// ---- Bausteine
const A_SIT = { who: 'A', pos: [-0.55, 0, -3.4], ry: 0.85, footwear: 'socks' };
const B_SIT = { who: 'B', pos: [0.55, 0, -3.3], ry: -0.95, footwear: 'socks' };
const B_PHONE_ARM = { reach: [-0.1, 0.27, 0.3], pole: [-1, -1, -0.2], palm: [0.15, 0.75, -0.6], flex: -0.1, hand: 'hold' };
const B_WALK = (ph) => ({ walk: ph, walkOpt: { hurry: 1 }, neck: [0.14, 0, 0], head: [0.3, 0, 0], R: B_PHONE_ARM });
const sitHead = (h, extra = {}) => ['sitzen', { head: h, ...extra }];
const ROW = (who, i) => ({ who, pos: [(i - 2.5) * 0.6, 0, -4.25], ry: Math.PI, footwear: 'socks', pose: { head: [0.1, 0, 0] } });
const ROW_EXTRAS = [0, 1, 4, 5].map((i) => ({ extra: i, pos: [(i - 2.5) * 0.6, 0, -4.25], ry: Math.PI, pose: { head: [0.1, 0, 0] } }));
// Imam: allein vorn vor dem Mihrab, Blick zur Qibla
const IMAM = { extra: 6, pos: [0, 0, -5.25], ry: Math.PI, footwear: 'socks', pose: { head: [0.05, 0, 0] } };

export const SHOTS = [
  // ---------------------------------------------------------------- 1 Hook
  { id: 'S01', teil: 1, t: 3.15, zeile: 'A01', kamera: 'Totale schräg von der Straße, langsame Fahrt', handlung: 'Neubau mit Schild „Masjid As-Sunnah“ über der Tür; A steht an der Tür, B läuft mit dem Handy vorne vorbei', einbl: 'Hook-Titel oben',
    scene: 'out', figs: [{ who: 'A', pos: [0.45, 0.07, 1.45], ry: 0.35, pose: { head: [0.05, -0.25, 0] } }, { who: 'B', pos: [0.4, 0.07, 6.3], ry: Math.PI / 2, phone: true, pose: B_WALK(0.6) }],
    cam: { pos: [3.6, 1.45, 11.6], look: [-0.5, 2.45, 1.6], fov: 50 }, sun: [0, 0, 3, 9] },
  { id: 'S02', teil: 1, t: 1.1, zeile: 'A01', kamera: 'schneller Zoom über die Schulter von A auf B', handlung: 'B läuft mit dem Handy vorbei', einbl: '–',
    scene: 'out', figs: [{ who: 'A', pos: [0.3, 0.07, 1.5], ry: -0.55 }, { who: 'B', pos: [-1.1, 0.07, 3.9], ry: Math.PI / 2, phone: true, pose: B_WALK(2.2) }],
    cam: { over: 'A', at: 'B', fov: 26 } },
  { id: 'S03', teil: 2, t: 1.1, zeile: '(Adhan)', kamera: 'Detail, tief am Boden, seitlich', handlung: 'Turnschuhe und blauer Saum von B hasten über den Gehweg', einbl: '–',
    scene: 'out', figs: [{ who: 'B', pos: [-0.9, 0.07, 3.6], ry: Math.PI / 2, phone: true, pose: B_WALK(1.0) }],
    cam: { pos: [0.6, 0.2, 5.4], look: [-0.9, 0.28, 3.6], fov: 40 } },
  { id: 'S05', teil: 2, t: 2.0, zeile: 'A02', kamera: 'halbnah von vorn', handlung: 'A tritt aus der Tür ins warme Licht und hebt grüßend die Hand', einbl: 'Untertitel',
    scene: 'out', figs: [{ who: 'A', pos: [0.2, 0.07, 1.4], ry: -0.45, pose: { mouth: 'smile', head: [0, -0.15, 0.05], R: { reach: [-0.4, 0.74, 0.18], pole: [-1, -0.3, -0.4], palm: [0, 0.1, 1], hand: 'open' } } }],
    cam: { pos: [-0.6, 1.5, 4.6], look: [0.2, 1.5, 1.3], fov: 40 } },
  { id: 'S06', teil: 2, t: 3.0, zeile: 'B01', kamera: 'über die Schulter von A auf B', handlung: 'B bleibt stehen, schaut vom Handy hoch', einbl: 'Untertitel',
    scene: 'out', figs: [{ who: 'A', pos: [0.2, 0.07, 1.6], ry: -0.5 }, { who: 'B', pos: [-1.1, 0.07, 3.9], ry: 2.68, phone: true, pose: ['handy', { neck: [0, 0, 0], head: [-0.04, 0, 0], mouth: 'half' }] }],
    cam: { over: 'A', at: 'B', fov: 32 } },
  { id: 'S07', teil: 2, t: 1.5, zeile: 'A03', kamera: 'nah, A im Profil', handlung: 'A zeigt mit offener Hand zur Tür', einbl: 'Untertitel',
    scene: 'out', figs: [{ who: 'A', pos: [0.2, 0.07, 1.6], ry: -0.5, pose: 'offeneHand' }],
    cam: { on: 'A', part: 'head', dist: 1.5, yaw: -0.75, up: -0.1, fov: 38, lookUp: -0.2 } },
  { id: 'S08', teil: 2, t: 1.5, zeile: 'A03', kamera: 'Detail, leichte Fahrt auf die Tür', handlung: 'offene Tür, warmes Licht, türkiser Teppich innen', einbl: 'Untertitel',
    scene: 'out', figs: [], cam: { pos: [0.7, 1.35, 6.6], look: [0, 1.6, 0.6], fov: 34 } },
  { id: 'S09', teil: 2, t: 2.0, zeile: 'B02', kamera: 'nah, leicht von unten', handlung: 'B zieht die Schultern hoch, Blick zurück aufs Handy', einbl: 'Untertitel',
    scene: 'out', figs: [{ who: 'B', pos: [-1.1, 0.07, 3.9], ry: 2.68, phone: true, pose: ['handy', { shrug: 0.9 }] }],
    cam: { on: 'B', part: 'head', dist: 1.3, yaw: 0.35, up: -0.25, fov: 36 } },
  { id: 'S10', teil: 2, t: 3.0, zeile: 'A04', kamera: 'Zwei-Shot von der Seite', handlung: 'A legt B freundlich die Hand auf die Schulter', einbl: 'Untertitel',
    scene: 'out', figs: [{ who: 'B', pos: [-1.0, 0.07, 3.9], ry: 2.68, phone: true, pose: ['handy', { neck: [0, 0, 0], head: [0.05, 0.25, 0] }] },
      { who: 'A', pos: [-0.45, 0.07, 4.18], ry: 3.18, pose: { mouth: 'smile', head: [0.08, 0.3, 0.06] }, reachTo: 'B' }],
    cam: { pos: [-0.2, 1.4, 1.9], look: [-0.72, 1.3, 4.0], fov: 40 } },
  { id: 'S11', teil: 2, t: 1.5, zeile: 'B03', kamera: 'Detail Brust', handlung: 'B steckt das Handy in die Brusttasche', einbl: 'Untertitel',
    scene: 'out', figs: [{ who: 'B', pos: [-1.0, 0.07, 3.9], ry: 2.68, phone: true, pose: { head: [0.35, 0, 0], R: { reach: [0.08, 0.37, 0.21], pole: [-1, -1, 0], palm: [0, 0, -1], hand: 'hold' } } }],
    cam: { on: 'B', part: 'chest', dist: 0.8, yaw: 0.2, up: 0.05, fov: 38 } },
  { id: 'S12', teil: 2, t: 2.0, zeile: '–', kamera: 'Totale von der Straße, beide gehen auf die Moschee zu', handlung: 'A und B gehen nebeneinander hinein, Fassade mit Schild und Bogenfenster im Bild', einbl: '–',
    scene: 'out', figs: [{ who: 'A', pos: [0.4, 0.07, 3.3], ry: Math.PI, pose: { walk: 0.8 } }, { who: 'B', pos: [-0.35, 0.07, 3.5], ry: Math.PI, pose: { walk: 2.4 } }],
    cam: { pos: [1.6, 1.5, 10.5], look: [0, 3.6, 0.9], fov: 52 }, sun: [0, 0, 3, 9] },
  // ---------------------------------------------------------------- 3 Moschee
  { id: 'S13', teil: 3, t: 1.0, zeile: '–', kamera: 'Detail, tief', handlung: 'B stellt die Turnschuhe ins Schuhregal', einbl: '–',
    scene: 'in', figs: [{ who: 'B', pos: [0.5, 0, 5.15], ry: -0.5, footwear: 'socks', pose: { spine: [0.35, 0, 0], head: [0.3, 0, 0], R: { reach: [-0.15, 0.05, 0.42], pole: [-1, -1, 0], palm: [0, -1, 0.3], hand: 'hold' } } }],
    cam: { pos: [-1.3, 0.95, 4.2], look: [-0.1, 0.42, 5.6], fov: 46 }, sun: [0, 0, 4.5, 5] },
  { id: 'S14', teil: 3, t: 1.0, zeile: '–', kamera: 'Detail am Boden', handlung: 'Socken auf dem Mäanderband, beide gehen Richtung Mihrab', einbl: '–',
    scene: 'in', figs: [{ who: 'B', pos: [0.3, 0, 3.4], ry: Math.PI, footwear: 'socks', pose: { walk: 1.0 } }, { who: 'A', pos: [-0.35, 0, 3.55], ry: Math.PI, footwear: 'socks', pose: { walk: 2.8 } }],
    cam: { pos: [0.25, 0.5, 2.3], look: [0, 0.1, 3.45], fov: 44 }, sun: [0, 0, 3.5, 5] },
  { id: 'S15', teil: 3, t: 2.0, zeile: 'B04', kamera: 'Halbtotale von der Seite', handlung: 'beide sitzen vor dem Mihrab', einbl: 'Untertitel',
    scene: 'in', figs: [{ ...A_SIT, pose: 'sitzen' }, { ...B_SIT, pose: sitHead([0.1, 0.2, 0], { mouth: 'half' }) }],
    cam: { pos: [2.9, 1.15, -2.2], look: [0, 0.75, -3.6], fov: 46 } },
  { id: 'S16', teil: 3, t: 2.0, zeile: 'B04', kamera: 'nah B', handlung: 'B fragt, ein bisschen verlegen', einbl: 'Untertitel',
    scene: 'in', figs: [{ ...A_SIT, pose: 'sitzen' }, { ...B_SIT, pose: sitHead([0.12, 0.25, 0.05], { mouth: 'half', shrug: 0.4 }) }],
    cam: { on: 'B', part: 'head', dist: 1.15, yaw: 0.35, up: 0, fov: 36 } },
  { id: 'S17', teil: 3, t: 2.0, zeile: 'A05', kamera: 'nah A', handlung: 'A antwortet ruhig, offene Hand', einbl: 'Untertitel',
    scene: 'in', figs: [{ ...A_SIT, pose: 'sitzenSpricht' }, { ...B_SIT, pose: 'sitzen' }],
    cam: { on: 'A', part: 'head', dist: 1.3, yaw: -0.2, up: -0.08, fov: 38, lookUp: -0.12 } },
  { id: 'S18', teil: 3, t: 2.5, zeile: 'A05', kamera: 'Detail Wanduhr, leichter Zoom', handlung: 'Zeiger springen, fünf Lichtstriche im Bogen (Tageslauf) erscheinen über der Uhr', einbl: 'QURAN-Karte Q1',
    scene: 'in', figs: [], fx: ['clockDots'], cam: { pos: [-1.62, 2.05, -4.15], look: [-1.69, 2.3, -6], fov: 44 } },
  { id: 'S19', teil: 3, t: 2.5, zeile: 'B05', kamera: 'über die Schulter von A auf B', handlung: 'B zuckt mit den Schultern', einbl: 'Untertitel',
    scene: 'in', figs: [{ ...A_SIT, pose: 'sitzen' }, { ...B_SIT, pose: sitHead([0, 0.2, 0.08], { shrug: 1, mouth: 'half' }) }],
    cam: { over: 'A', at: 'B', fov: 34 } },
  { id: 'S20', teil: 3, t: 3.0, zeile: 'A06', kamera: 'nah A', handlung: 'A ernst, aber freundlich', einbl: 'QURAN-Karte Q4',
    scene: 'in', figs: [{ ...A_SIT, pose: ['sitzenSpricht', { head: [0.05, 0.12, 0], mouth: 'half' }] }, { ...B_SIT, pose: 'sitzen' }],
    cam: { on: 'A', part: 'head', dist: 1.1, yaw: 0.1, up: 0, fov: 36 } },
  { id: 'S21', teil: 3, t: 3.0, zeile: 'A06', kamera: 'Vogelperspektive', handlung: 'beide auf dem Teppich, Reihenlinien sichtbar', einbl: 'QURAN-Karte Q4',
    scene: 'in', figs: [{ ...A_SIT, pose: 'sitzenSpricht' }, { ...B_SIT, pose: sitHead([0.2, 0.2, 0]) }],
    cam: { pos: [0.4, 3.1, -1.9], look: [0, 0, -3.4], fov: 62 } },
  { id: 'S22', teil: 3, t: 2.5, zeile: 'B06', kamera: 'nah B', handlung: 'B unsicher, Blick zum Boden', einbl: 'Untertitel',
    scene: 'in', figs: [{ ...A_SIT, pose: 'sitzen' }, { ...B_SIT, pose: sitHead([0.35, 0.1, 0], { spine: [0.15, 0, 0], mouth: 'half' }) }],
    cam: { on: 'B', part: 'head', dist: 1.1, yaw: 0.25, up: -0.1, fov: 36 } },
  { id: 'S23', teil: 3, t: 3.5, zeile: 'A07', kamera: 'langsame Fahrt auf A', handlung: 'A spricht langsam und ernst', einbl: 'Untertitel',
    scene: 'in', figs: [{ ...A_SIT, pose: ['sitzen', { head: [0.08, 0.15, 0], mouth: 'half' }] }, { ...B_SIT, pose: 'sitzen' }],
    cam: { on: 'A', part: 'head', dist: 1.7, yaw: 0.3, up: 0.1, fov: 38 } },
  { id: 'S24', teil: 3, t: 3.0, zeile: 'A07', kamera: 'nah A von unten', handlung: 'Raum wird dunkler, warmer Glutschimmer am Bildrand (keine Personen, keine Hölle gezeigt)', einbl: 'QURAN-Karte Q5',
    scene: 'in', figs: [{ ...A_SIT, pose: ['sitzen', { head: [0.05, 0.1, 0], mouth: 'half' }] }, { ...B_SIT, pose: 'sitzen' }], fx: ['ember'],
    cam: { on: 'A', part: 'head', dist: 1.9, yaw: 0.15, up: -0.2, fov: 38 } },
  { id: 'S25', teil: 3, t: 3.5, zeile: 'A07', kamera: 'nah B', handlung: 'B erschrocken, Schultern hoch', einbl: 'QURAN-Karte Q5',
    scene: 'in', figs: [{ ...A_SIT, pose: 'sitzen' }, { ...B_SIT, pose: sitHead([-0.08, 0.2, 0], { spine: [-0.08, 0, 0], shrug: 1.1, mouth: 'open' }) }], fx: ['ember'],
    cam: { on: 'B', part: 'head', dist: 1.9, yaw: 0.25, up: 0, fov: 36 } },
  { id: 'S26', teil: 3, t: 3.0, zeile: 'A08', kamera: 'nah auf die Hände von A', handlung: 'A erklärt mit ruhigen Händen', einbl: 'HADITH-Karte H2',
    scene: 'in', figs: [{ ...A_SIT, pose: 'sitzenSpricht' }, { ...B_SIT, pose: 'sitzen' }],
    cam: { on: 'A', part: 'hands', dist: 0.9, yaw: 0.1, up: 0.2, fov: 40 } },
  { id: 'S27', teil: 3, t: 3.5, zeile: 'A08', kamera: 'Detail von oben', handlung: 'dunkelblaues Mäanderband zwischen beiden als „Grenzlinie“', einbl: 'HADITH-Karte H2',
    scene: 'in', figs: [{ ...A_SIT, pose: 'sitzenSpricht' }, { ...B_SIT, pose: 'sitzen' }],
    cam: { pos: [0.05, 1.5, -2.5], look: [0, 0, -3.35], fov: 46 } },
  { id: 'S28', teil: 3, t: 3.5, zeile: 'A08', kamera: 'Zwei-Shot schräg von vorn', handlung: 'B hört zu, Kopf gesenkt', einbl: 'HADITH-Karte H2',
    scene: 'in', figs: [{ ...A_SIT, pose: 'sitzenSpricht' }, { ...B_SIT, pose: sitHead([0.4, 0.15, 0], { spine: [0.15, 0, 0] }) }],
    cam: { pos: [0.9, 1.05, -1.4], look: [0, 0.75, -3.4], fov: 42 } },
  { id: 'S29', teil: 3, t: 3.0, zeile: 'B07', kamera: 'nah B', handlung: 'B hebt hoffnungsvoll den Kopf', einbl: 'Untertitel',
    scene: 'in', figs: [{ ...A_SIT, pose: 'sitzen' }, { ...B_SIT, pose: sitHead([-0.12, 0.3, 0.05], { mouth: 'half' }) }],
    cam: { on: 'B', part: 'head', dist: 1.1, yaw: 0.3, up: 0.05, fov: 36 } },
  { id: 'S30', teil: 3, t: 3.0, zeile: 'A09', kamera: 'nah A', handlung: 'A lächelt sanft', einbl: 'Untertitel',
    scene: 'in', figs: [{ ...A_SIT, pose: ['sitzen', { head: [0, 0.2, 0.06], mouth: 'smile' }] }, { ...B_SIT, pose: 'sitzen' }],
    cam: { on: 'A', part: 'head', dist: 1.1, yaw: 0.2, up: 0, fov: 36 } },
  { id: 'S31', teil: 3, t: 3.5, zeile: 'A09', kamera: 'Symbol, leichte Fahrt', handlung: 'Waage vor dem Mihrab, in einer Schale ein kleiner Gebetsteppich', einbl: 'HADITH-Karte H7',
    scene: 'in', figs: [], fx: ['scale'], cam: { pos: [0.45, 1.0, -3.25], look: [0, 0.62, -5.1], fov: 44 } },
  { id: 'S32', teil: 3, t: 3.0, zeile: 'A09', kamera: 'über die Schulter von B auf A', handlung: 'A spricht weiter, B hört zu', einbl: 'HADITH-Karte H7',
    scene: 'in', figs: [{ ...A_SIT, pose: 'sitzenSpricht' }, { ...B_SIT, pose: 'sitzen' }],
    cam: { over: 'B', at: 'A', side: -1, fov: 34 } },
  { id: 'S33', teil: 3, t: 2.5, zeile: 'A10', kamera: 'Detail Wanduhr', handlung: 'Uhr steht auf einer Gebetszeit, warmes Licht', einbl: 'HADITH-Karte H1',
    scene: 'in', figs: [], fx: ['clockDots'], cam: { pos: [-1.8, 2.05, -5.3], look: [-1.69, 2.12, -6], fov: 34 } },
  { id: 'S34', teil: 3, t: 4.0, zeile: 'A10', kamera: 'halbnah A, langsame Fahrt', handlung: 'A legt die Hand aufs Herz', einbl: 'HADITH-Karte H1',
    scene: 'in', figs: [{ ...A_SIT, pose: ['sitzen', { mouth: 'smile', head: [0.03, 0.15, 0.04], R: { reach: [-0.05, 0.33, 0.225], pole: [-1, -0.9, 0.1], palm: [0, 0, -1], flex: 0.1, hand: 'flat' } }] }, { ...B_SIT, pose: 'sitzen' }],
    cam: { on: 'A', part: 'chest', dist: 1.5, yaw: 0.1, up: 0.15, fov: 38 } },
  { id: 'S35', teil: 3, t: 3.5, zeile: 'B08', kamera: 'nah B', handlung: 'B beschämt, Kopf gesenkt, Schultern hängen', einbl: 'Untertitel',
    scene: 'in', figs: [{ ...A_SIT, pose: 'sitzen' }, { ...B_SIT, pose: sitHead([0.45, 0.2, 0], { spine: [0.2, 0, 0], shrug: -0.6, mouth: 'closed' }) }],
    cam: { on: 'B', part: 'head', dist: 1.15, yaw: 0.2, up: -0.15, fov: 36 } },
  { id: 'S36', teil: 3, t: 4.0, zeile: 'A11', kamera: 'Zwei-Shot schräg von vorn', handlung: 'A legt B die Hand auf die Schulter', einbl: 'Untertitel',
    scene: 'in', figs: [{ who: 'B', pos: [0.42, 0, -3.3], ry: -0.95, footwear: 'socks', pose: sitHead([0.3, 0.2, 0], { spine: [0.12, 0, 0] }) },
      { who: 'A', pos: [-0.25, 0, -3.35], ry: 0.9, footwear: 'socks', pose: ['sitzen', { mouth: 'half', head: [0.06, 0.1, 0.05] }], reachTo: 'B' }],
    cam: { pos: [0.4, 1.1, -1.5], look: [0.05, 0.75, -3.35], fov: 40 } },
  { id: 'S37', teil: 3, t: 3.5, zeile: 'A11', kamera: 'nah A', handlung: 'A ermutigend: „Mit diesem hier.“', einbl: 'Untertitel',
    scene: 'in', figs: [{ ...A_SIT, pose: ['sitzenSpricht', { mouth: 'smile' }] }, { ...B_SIT, pose: 'sitzen' }],
    cam: { on: 'A', part: 'head', dist: 1.15, yaw: 0.25, up: 0, fov: 36 } },
  // ---------------------------------------------------------------- 4 Hoffnung
  { id: 'S38', teil: 4, t: 3.0, zeile: 'A12', kamera: 'halbnah A, erzählend', handlung: 'A beginnt das Gleichnis', einbl: 'Untertitel',
    scene: 'in', figs: [{ ...A_SIT, pose: 'sitzenSpricht' }, { ...B_SIT, pose: 'sitzen' }],
    cam: { on: 'A', part: 'chest', dist: 1.7, yaw: -0.15, up: 0.1, fov: 40 } },
  { id: 'S39', teil: 4, t: 4.0, zeile: 'A12', kamera: 'Symbol, tief über dem Wasser, Fahrt auf die Tür', handlung: 'vor der Moscheetür fließt ein klarer Fluss', einbl: 'HADITH-Karte H4 (Teil 1)',
    scene: 'out', figs: [], fx: ['river'], cam: { pos: [1.4, 1.15, 5.8], look: [0, 0.35, 2.3], fov: 46 } },
  { id: 'S40', teil: 4, t: 4.0, zeile: 'A12', kamera: 'Symbol, von schräg oben', handlung: 'Wasser glitzert im Abendlicht', einbl: 'HADITH-Karte H4 (Teil 1)',
    scene: 'out', figs: [], fx: ['river'], cam: { pos: [2.6, 3.2, 5.6], look: [0, 0, 2.5], fov: 46 } },
  { id: 'S41', teil: 4, t: 4.0, zeile: 'A12', kamera: 'nah B', handlung: 'B hört zu, Schultern entspannen sich', einbl: 'Untertitel',
    scene: 'in', figs: [{ ...A_SIT, pose: 'sitzenSpricht' }, { ...B_SIT, pose: sitHead([0.05, 0.25, 0.04], { shrug: -0.5 }) }],
    cam: { on: 'B', part: 'head', dist: 1.15, yaw: 0.3, up: 0, fov: 36 } },
  { id: 'S42', teil: 4, t: 4.0, zeile: 'A12', kamera: 'Symbol, weit', handlung: 'Fluss vor der offenen Tür, warmes Licht von innen', einbl: 'HADITH-Karte H4 (Teil 2)',
    scene: 'out', figs: [], fx: ['river'], cam: { pos: [3.0, 2.7, 9.2], look: [0, 0.9, 2.0], fov: 46 } },
  { id: 'S43', teil: 4, t: 4.0, zeile: 'A12', kamera: 'nah A', handlung: 'A lächelt: „Allah tilgt damit die Sünden.“', einbl: 'HADITH-Karte H4 (Teil 2)',
    scene: 'in', figs: [{ ...A_SIT, pose: ['sitzenSpricht', { mouth: 'smile' }] }, { ...B_SIT, pose: 'sitzen' }],
    cam: { on: 'A', part: 'head', dist: 1.1, yaw: 0.1, up: 0, fov: 36 } },
  { id: 'S44', teil: 4, t: 2.0, zeile: 'B09', kamera: 'nah B, leicht von unten', handlung: 'B entschlossen, aufrecht', einbl: 'Untertitel',
    scene: 'in', figs: [{ ...A_SIT, pose: 'sitzen' }, { ...B_SIT, pose: sitHead([-0.06, 0.2, 0], { spine: [-0.02, 0, 0], shrug: -0.3, mouth: 'closed' }) }],
    cam: { on: 'B', part: 'head', dist: 1.1, yaw: 0.2, up: -0.15, fov: 36 } },
  // ---------------------------------------------------------------- 5 Schluss
  { id: 'S45', teil: 5, t: 2.0, zeile: 'A13', kamera: 'halbnah von der Seite', handlung: 'A steht auf und reicht B die Hand', einbl: 'Untertitel',
    scene: 'in', figs: [{ who: 'A', pos: [0.0, 0, -2.85], ry: 2.3, footwear: 'socks', pose: { mouth: 'smile', spine: [0.15, 0, 0], head: [0.2, 0, 0], R: { reach: [-0.12, 0.08, 0.4], pole: [-1, -1, -0.3], palm: [0, 0.4, 1], hand: 'open' } } },
      { ...B_SIT, pose: sitHead([-0.2, 0.1, 0], { R: { reach: [-0.08, 0.45, 0.36], pole: [-1, -0.6, -0.4], palm: [0, -0.4, 1], hand: 'open' } }) }],
    cam: { pos: [1.15, 1.25, -1.25], look: [0.25, 0.85, -3.1], fov: 44 } },
  { id: 'S46', teil: 5, t: 3.0, zeile: '(Iqāma)', kamera: 'halbnah von hinten', handlung: 'die Reihe bildet sich, A und B in der Mitte', einbl: '–',
    scene: 'in', figs: [ROW('A', 2), ROW('B', 3), ...ROW_EXTRAS, IMAM], cam: { pos: [0.15, 2.05, -2.0], look: [0, 1.05, -5.5], fov: 44 }, sun: [0, 0, -4.25, 4.5] },
  { id: 'S47', teil: 5, t: 3.0, zeile: '(Iqāma)', kamera: 'Detail Füße von hinten', handlung: 'Säume Seite an Seite auf der Reihenlinie', einbl: '–',
    scene: 'in', figs: [ROW('A', 2), ROW('B', 3), ...ROW_EXTRAS, IMAM], cam: { pos: [0.0, 0.26, -3.55], look: [0, 0.05, -4.35], fov: 46 }, sun: [0, 0, -4.25, 4.5] },
  { id: 'S48', teil: 5, t: 3.0, zeile: '(Iqāma)', kamera: 'Fahrt zurück bis zur Totale', handlung: 'Reihe vor dem Mihrab, Licht durch das Milchglas', einbl: '–',
    scene: 'in', figs: [ROW('A', 2), ROW('B', 3), ...ROW_EXTRAS, IMAM], cam: { pos: [0.3, 2.3, 1.2], look: [0, 1.15, -6], fov: 50 }, sun: [0, 0, -3, 6] },
  { id: 'S49', teil: 5, t: 5.0, zeile: 'A14', kamera: 'Schlussbild von hinten, steht 2 s', handlung: 'Reihe von hinten, A und B Schulter an Schulter', einbl: 'Schlusssatz groß in der Mitte',
    scene: 'in', figs: [ROW('A', 2), ROW('B', 3), ...ROW_EXTRAS, IMAM], cam: { pos: [0.4, 2.15, -1.3], look: [0.1, 1.2, -6], fov: 46 }, sun: [0, 0, -4.25, 4.5] },
];

const TEILE = { 1: 'Hook', 2: 'Straße', 3: 'Moschee', 4: 'Hoffnung', 5: 'Schluss' };
const fmt = (x) => x.toFixed(1).replace('.', ',');
let tc = 0;
for (const s of SHOTS) { s.t0 = tc; tc += s.t; }
export const TOTAL = tc;
const mmss = (x) => `${Math.floor(x / 60)}:${String(Math.floor(x % 60)).padStart(2, '0')}`;
const label = (s) => `<b>${s.id} · ${fmt(s.t)} s · ${mmss(s.t0)}</b><span style="display:block;text-align:left;font-weight:500;font-size:16px;line-height:1.35;margin-top:6px">`
  + `<b>${s.zeile}</b> · ${s.kamera}<br>${s.handlung}${s.einbl && s.einbl !== '–' ? `<br><i>Einblendung: ${s.einbl}</i>` : ''}</span>`;
const cell = (s) => ({ id: s.id, label: label(s) });
const sec = (teil, title) => ({ title: `Teil ${teil} · ${TEILE[teil]}${title || ''}`, cols: 4, cells: SHOTS.filter((s) => s.teil === teil).map(cell) });
const part = (lo, hi, t) => ({ title: t, cols: 4, cells: SHOTS.filter((s) => +s.id.slice(1) >= lo && +s.id.slice(1) <= hi).map(cell) });

export const SHEETS = [
  { file: 'storyboard-1-hook-strasse', title: 'Storyboard 1: Hook und Straße (S01–S12)', facts: [`Gesamtlänge laut Shotliste ca. ${mmss(TOTAL)} – wird in Phase 5/7 an die echten Aufnahmen angepasst.`, 'Grob gerenderte Standbilder: Licht, Mimik und Einblendungen kommen in Phase 6 und 7.'], sections: [sec(1), sec(2)], foot: [] },
  { file: 'storyboard-2-moschee', title: 'Storyboard 2: In der Moschee – Quran (S13–S25)', facts: [], sections: [part(13, 25, 'Teil 3 · Moschee: Ankommen, Fragen, Quran')], foot: [] },
  { file: 'storyboard-3-moschee', title: 'Storyboard 3: In der Moschee – Sunnah (S26–S37)', facts: [], sections: [part(26, 37, 'Teil 3 · Moschee: Sunnah und Neuanfang')], foot: [] },
  { file: 'storyboard-4-hoffnung-schluss', title: 'Storyboard 4: Hoffnung und Schluss (S38–S49)', facts: [], sections: [sec(4), sec(5)], foot: ['Symbolbilder (Uhr, Waage, Fluss) zeigen keine Personen. Der Prophet ﷺ und die Sahaba werden nie gezeigt.'] },
];
export const ALL_CELLS = SHOTS.map((s) => ({ ...s, label: label(s) }));
