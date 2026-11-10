// Inhalt der Ortsblätter (Phase 2). Reine Daten.
export const SHOT = 'orte';
export const SIZE = [720, 1280];
export const KICKER = 'Masjid As-Sunnah · Die Wichtigkeit des Gebets · Phase 2';

const c = (id, label, o = {}) => ({ id, label, ...o });

const PAL_INNEN = [
  ['Teppich', '#2b9c9a'], ['Mäanderband', '#1b4c7c'], ['Sockelleiste', '#1f8f93'], ['Fliese beige', '#dcc7a6'],
  ['Fliesenband rostrot', '#b3603d'], ['Putz weiß', '#f3f1eb'], ['Holz hell (Minbar, Tisch)', '#e2c591'], ['Gebetsteppich blau', '#6a97cb'],
  ['Gold (Leuchte, Fransen)', '#d2a84f'], ['Tafel schwarz', '#16130f'], ['Stapelstuhl braun', '#4f3527'], ['Milchglas', '#eef4f8'],
];
const PAL_AUSSEN = [
  ['Fassade sandfarben', '#cfc0a2'], ['Portal hell', '#ece7dc'], ['Glas dunkelblau', '#27508a'], ['Glaskuppel', '#3f9aa8'],
  ['Gold (Halbmonde)', '#d2a84f'], ['Schild Navy', '#212242'], ['Asphalt', '#77716a'], ['Pflaster', '#bab2a4'],
  ['Himmel', '#6fa6de'], ['Abendsonne', '#ffc98f'], ['Türlicht warm', '#ffc983'], ['Hecke, Bäume', '#5f8f4a'],
];

export const SHEETS = [
  {
    file: 'ortsblatt-innen-1-raum',
    title: 'Gebetsraum · Blatt 1: Totale, Qibla-Wand, Säulen',
    facts: ['Nachgebaut nach deinen zwei Fotos. Maßstab: Fliesenhöhe 1,5 m.', 'Alle Flächen sind per Code erzeugt (Teppich, Fliesen, Putz, Holz, Schrift).'],
    sections: [
      { title: 'Drei Standbilder im Videoformat 9:16', cols: 3, cells: [
        c('innen_totale', 'Totale vom Eingang zur Qibla-Wand'),
        c('innen_qibla', 'Qibla-Wand mit Mihrab'),
        c('innen_saeulen', 'Säulen, Stuhlreihe, Reihenlinien'),
      ] },
      { title: 'Farbpalette innen', palette: PAL_INNEN },
    ],
    foot: [],
  },
  {
    file: 'ortsblatt-innen-2-details',
    title: 'Gebetsraum · Blatt 2: Details und Lichtstimmung',
    facts: [],
    sections: [
      { title: 'Details', cols: 4, cells: [
        c('innen_mihrab', 'Mihrab: Nische, Gebetsteppich, Mikrofon, Leuchte, Tafel'),
        c('innen_links', 'links: Uhr, Regal mit grünen Büchern, Tisch'),
        c('innen_rechts', 'rechts: Roll-up, Regal, Minbar'),
        c('innen_schild', 'Säule mit Schild, Teppichband, Sockelleiste'),
      ] },
      { title: 'Lichtstimmung mit Figuren', cols: 3, cells: [
        c('innen_licht', 'A und B sitzen vor dem Mihrab'),
        c('innen_reihe', 'Gebetsreihe von hinten (Schlussbild)'),
        c('innen_eingang', 'Blick zurück zum Eingang'),
      ] },
      { title: 'Licht innen', text: [
        'Weiches Tageslicht: Die Milchglasfenster leuchten kühl-weiß, um jedes Fenster liegt ein leichter Lichtschein.',
        'Von den Fenstern fallen schwache Lichtkegel schräg in den Raum. Sie sind bewusst dezent, damit Untertitel lesbar bleiben.',
        'Ein warmes Hauptlicht von links wirft weiche Schatten von Säulen und Figuren auf den Teppich. Der Teppich wirft türkises Licht zurück.',
        'Unter Figuren, Säulen und Möbeln liegen weiche Kontaktschatten, in Ecken und am Boden sind die Wände leicht abgedunkelt.',
      ] },
    ],
    foot: ['Frei ergänzt (nicht auf den Fotos zu sehen): Eingangstür und Schuhregal an der Rückwand, Fenster an den Seitenwänden, Deckenbalken. Sag mir, wenn es in echt anders ist.'],
  },
  {
    file: 'ortsblatt-aussen',
    title: 'Außen · Neubau Masjid As-Sunnah, Am Westbahnhof 31',
    facts: ['Nachgebaut nach deiner Visualisierung des Neubaus.', 'Ergänzt: Schild über der Tür, offene Tür mit warmem Licht, Gehweg vor dem Eingang.'],
    sections: [
      { title: 'Standbilder im Videoformat 9:16', cols: 3, cells: [
        c('aussen_totale', 'Totale (wie auf deinem Bild)'),
        c('aussen_eingang', 'Eingang: A an der Tür, B geht vorbei'),
        c('aussen_portal', 'Portal: Schild, Spitzbogen, Gitterfeld'),
      ] },
      { title: 'Farbpalette außen', palette: PAL_AUSSEN },
      { title: 'Licht außen', text: [
        'Später Nachmittag: warme, tiefe Sonne von links vorn, lange weiche Schatten über Vorplatz und Gehweg.',
        'Der Himmel ist oben blau und wird zum Horizont hin warm, mit weichen Wolken.',
        'Die Tür steht offen. Aus dem Inneren fällt warmes Licht auf den Gehweg. Der Adhan kommt aus dem Inneren durch die offene Tür, es gibt keinen Lautsprecher außen.',
      ] },
    ],
    foot: [],
  },
];
export const ALL_CELLS = SHEETS.flatMap((s) => s.sections.flatMap((x) => x.cells || []));
