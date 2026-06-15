import type { Beleg } from '../types'

// ---------------------------------------------------------------------------
// SIEGEL II — Prophet wie Mose (5. Mose 18,18). Two keys in one verse:
// "like you (Moses)" — yet Deut 34:10 says none like Moses arose IN ISRAEL —
// and "from among their brothers" — the brother-nation is Ishmael's line.
// "I will put my words in his mouth" — verbatim revelation.
// ---------------------------------------------------------------------------

export interface Step {
  n: string
  h: string
  body: string
}

export interface KonterItem {
  tier: 'stone' | 'marble'
  einwand: string
  konter: string
  belegId?: string
}

export interface ScholarItem {
  tier: 'stone' | 'marble'
  h: string
  body: string
}

export const moseThese =
  'Mose verheißt im Namen Gottes einen kommenden Propheten: „wie dich, aus der Mitte ihrer Brüder — und ich werde meine Worte in seinen Mund legen" (5. Mose 18,18). Zwei Schlüssel stecken im Vers. „Wie Mose" — doch die Tora selbst sagt: in Israel stand kein Prophet wie Mose auf (34,10). „Aus ihren Brüdern" — und Israels Brudernation ist Ismaels gesegnete Linie. Gemessen an Mose selbst gleicht ihm einer mehr als jeder andere: ein Gesetzgeber und Staatsmann, normal geboren, natürlich gestorben, am Ende von seinem Volk angenommen.'

export const moseSteps: Step[] = [
  {
    n: 'I',
    h: 'Die Verheißung',
    body: 'In 5. Mose 18,18 spricht Gott zu Mose: „Einen Propheten will ich ihnen erwecken aus der Mitte ihrer Brüder, wie dich, und ich will meine Worte in seinen Mund legen." Ein bestimmter, künftiger, einzelner Prophet — mit Konsequenz für jeden, der nicht hört (18,19).',
  },
  {
    n: 'II',
    h: '„Wie Mose"',
    body: 'Der Maßstab ist ausdrücklich die Ähnlichkeit zu Mose. Und 5. Mose 34,10 hält fest: „In Israel stand kein Prophet mehr auf wie Mose." Der Erwartete muss also Mose gleichen — und von außerhalb Israels kommen.',
  },
  {
    n: 'III',
    h: '„Aus ihren Brüdern"',
    body: 'Israels „Brüder" sind in der Tora die verwandten Völker — Edom/Esau (5. Mose 23,8) und vor allem Ismaels Linie. 18,18 sagt „ihre Brüder", nicht „euch". Die Brudernation Israels ist Arabien.',
  },
  {
    n: 'IV',
    h: '„Worte in seinen Mund"',
    body: 'Wörtliche Offenbarung: Muhammad ﷺ rezitiert, was ihm eingegeben wird — „er spricht nicht aus eigener Neigung; es ist nur eine Offenbarung" (53,3-4). Der „ungelehrte" Prophet (7,157) gibt Wort für Wort weiter — genau das Bild von „meine Worte in seinen Mund".',
  },
]

export const moseBelege: Record<string, Beleg> = {
  // ---- The promise ----
  deut1818: {
    typ: 'bibel',
    kurz: 'Einen Propheten wie dich, aus ihren Brüdern — meine Worte in seinen Mund.',
    original:
      'נָבִיא אָקִים לָהֶם מִקֶּרֶב אֲחֵיהֶם כָּמוֹךָ וְנָתַתִּי דְבָרַי בְּפִיו וְדִבֶּר אֲלֵיהֶם אֵת כָּל אֲשֶׁר אֲצַוֶּנּוּ',
    sprache: 'he',
    translit:
      'nāvîʾ ʾāqîm lāhem miqqereḇ ʾăḥêhem kāmôḵā, wᵉ-nātattî dᵉvāray bᵉ-fîw, wᵉ-dibber ʾălêhem ʾēt kol-ʾăšer ʾăṣawwennû',
    uebersetzung:
      '„Einen Propheten will ich ihnen erwecken aus der Mitte ihrer Brüder, wie dich; und ich will meine Worte in seinen Mund legen, und er wird zu ihnen alles reden, was ich ihm gebiete."',
    fundstelle: '5. Mose (Deuteronomium) 18,18',
    status: 'Strong H251 · ʾaḥ = Bruder',
    kern: 'מִקֶּרֶב אֲחֵיהֶם',
  },

  // ---- None like Moses in Israel ----
  deut3410: {
    typ: 'bibel',
    kurz: 'In Israel stand kein Prophet mehr auf wie Mose.',
    original: 'וְלֹא קָם נָבִיא עוֹד בְּיִשְׂרָאֵל כְּמֹשֶׁה אֲשֶׁר יְדָעוֹ יְהוָה פָּנִים אֶל פָּנִים',
    sprache: 'he',
    translit: 'wᵉ-lōʾ qām nāvîʾ ʿôd bᵉ-Yiśrāʾēl kᵉ-Mōšeh ʾăšer yᵉdāʿô YHWH pānîm ʾel-pānîm',
    uebersetzung:
      '„Und es stand in Israel kein Prophet mehr auf wie Mose, den der HERR gekannt hätte von Angesicht zu Angesicht." — Der eine „wie Mose" ist also nicht aus Israel.',
    fundstelle: '5. Mose (Deuteronomium) 34,10',
    kern: 'בְּיִשְׂרָאֵל',
  },

  // ---- From your brothers, listen to him ----
  deut1815: {
    typ: 'bibel',
    kurz: 'Einen Propheten wie mich, aus deinen Brüdern — auf ihn sollt ihr hören.',
    original: 'נָבִיא מִקִּרְבְּךָ מֵאַחֶיךָ כָּמֹנִי יָקִים לְךָ יְהוָה אֱלֹהֶיךָ אֵלָיו תִּשְׁמָעוּן',
    sprache: 'he',
    translit: 'nāvîʾ miqqirbᵉḵā mē-ʾaḥeḵā kāmōnî yāqîm lᵉḵā YHWH ʾĕlōheḵā, ʾēlāw tišmāʿûn',
    uebersetzung:
      '„Einen Propheten aus deiner Mitte, aus deinen Brüdern, wie mich, wird dir der HERR, dein Gott, erwecken; auf ihn sollt ihr hören."',
    fundstelle: '5. Mose (Deuteronomium) 18,15',
  },

  // ---- The Quran's own "like Moses" claim ----
  q7315: {
    typ: 'quran',
    kurz: 'Wir sandten zu euch einen Gesandten — so wie Wir zu Pharao einen Gesandten sandten.',
    original: 'إِنَّا أَرْسَلْنَا إِلَيْكُمْ رَسُولًا شَاهِدًا عَلَيْكُمْ كَمَا أَرْسَلْنَا إِلَىٰ فِرْعَوْنَ رَسُولًا',
    sprache: 'ar',
    translit: 'innā arsalnā ilaykum rasūlan shāhidan ʿalaykum kamā arsalnā ilā firʿawna rasūlā',
    uebersetzung:
      '„Wir haben zu euch einen Gesandten geschickt, der Zeuge über euch ist, so wie Wir zu Pharao einen Gesandten geschickt haben." — Der Koran selbst stellt Muhammad ﷺ an die Seite des Mose.',
    fundstelle: 'Sure 73 (al-Muzzammil), Vers 15',
    kern: 'كَمَا أَرْسَلْنَا',
  },

  // ---- Words put in his mouth ----
  q5334: {
    typ: 'quran',
    kurz: 'Er spricht nicht aus eigener Neigung — es ist nur Offenbarung.',
    original: 'وَمَا يَنطِقُ عَنِ الْهَوَىٰ ۝ إِنْ هُوَ إِلَّا وَحْيٌ يُوحَىٰ',
    sprache: 'ar',
    translit: 'wa-mā yanṭiqu ʿani l-hawā · in huwa illā waḥyun yūḥā',
    uebersetzung:
      '„Und er spricht nicht aus eigener Neigung. Es ist nichts anderes als eine Offenbarung, die (ihm) eingegeben wird." — „Meine Worte in seinen Mund."',
    fundstelle: 'Sure 53 (an-Najm), Verse 3–4',
    kern: 'وَحْيٌ يُوحَىٰ',
  },

  // ---- The three expectations (John 1) ----
  john121: {
    typ: 'bibel',
    kurz: 'Bist du der Prophet? — Nein. Drei getrennte Erwartungen: Messias, Elia, der Prophet.',
    original: 'ὁ προφήτης εἶ σύ; καὶ ἀπεκρίθη· οὔ',
    sprache: 'grc',
    translit: 'ho prophḗtēs ei sý? kai apekríthē: oú',
    uebersetzung:
      '„Bist du der Prophet? Und er antwortete: Nein." Die Priester fragen Johannes den Täufer drei getrennte Gestalten ab — den Christus, Elia und „den Propheten" (wie Mose).',
    fundstelle: 'Johannes 1,21 · vgl. 6,14; 7,40',
    kern: 'ὁ προφήτης',
  },

  // ---- Source: Peter cites it as open expectation ----
  apg322: {
    typ: 'quelle',
    kurz: 'Petrus zitiert Mose noch als offene Verheißung — der Maßstab bleibt „wie Mose".',
    uebersetzung:
      'In Apostelgeschichte 3,22-23 zitiert Petrus: „Einen Propheten wie mich wird euch der Herr erwecken aus euren Brüdern; auf ihn sollt ihr hören." Er führt den Vers als noch ausstehende Verheißung an. Die jüdische Erwartung kannte „den Propheten" (wie Mose) als eigene Gestalt — neben dem Messias und Elia (Joh 1,21; 6,14; 7,40). Die Identifikation mit Jesus ist Deutung; das Kriterium des Verses ist die Gleichheit mit Mose.',
    fundstelle: 'Apostelgeschichte 3,22-23 · Johannes 1,21',
  },
}

// ---- The comparison: Moses · Muhammad ﷺ · Jesus ----------------------------
export const vergleich = {
  spalten: ['Mose', 'Muhammad ﷺ', 'Jesus'],
  zeilen: [
    { k: 'Geburt', mose: 'normal', muh: 'normal', jesus: 'jungfräulich (Mt 1,18)' },
    { k: 'Vater & Mutter', mose: 'beide', muh: 'beide', jesus: 'nur Mutter' },
    { k: 'Ehe & Kinder', mose: 'ja', muh: 'ja', jesus: 'nein' },
    { k: 'Neues Gesetz', mose: 'ja — die Tora', muh: 'ja — die Scharia', jesus: '„nicht aufheben" (Mt 5,17)' },
    { k: 'Volk & Staat', mose: 'Führer', muh: 'Führer', jesus: '„nicht von dieser Welt" (Joh 18,36)' },
    { k: 'Auswanderung', mose: 'nach Midian', muh: 'nach Medina', jesus: '—' },
    { k: 'Tod', mose: 'natürlich', muh: 'natürlich', jesus: 'Kreuzigung (so die Kirche)' },
    { k: 'Vom Volk angenommen', mose: 'zuletzt ja', muh: 'zuletzt ja', jesus: '„die Seinen nahmen ihn nicht an" (Joh 1,11)' },
    { k: 'Natur', mose: 'Mensch', muh: 'Mensch', jesus: 'göttlich (so die Kirche)' },
  ],
  pointe:
    'Neun Kriterien — in jedem gleicht Muhammad ﷺ dem Mose, während Jesus abweicht. „Wie Mose" ist der Maßstab des Verses selbst.',
}

// ---- The three awaited figures (John 1) -------------------------------------
export const dreiErwartungen = {
  intro: 'Als die Priester Johannes den Täufer befragen, zählen sie drei getrennte Gestalten auf (Johannes 1,19-21):',
  fragen: [
    { wer: 'Der Messias', f: 'Bist du der Christus?', a: 'Nein.' },
    { wer: 'Elia', f: 'Bist du Elia?', a: 'Nein.' },
    { wer: 'Der Prophet — wie Mose', f: 'Bist du der Prophet?', a: 'Nein.', hl: true },
  ],
  pointe:
    '„Der Prophet" steht neben dem Messias und Elia — eine eigene, dritte Erwartung (vgl. Joh 6,14; 7,40). Nicht automatisch Jesus.',
}

// ---- The brother-nations ----------------------------------------------------
export const brueder = {
  intro: 'In der Tora sind „Brüder" nicht nur Israeliten, sondern die verwandten Völker:',
  zeilen: [
    { volk: 'Edom · Esau', sinn: '„Du sollst den Edomiter nicht verabscheuen, denn er ist dein Bruder."', ref: '5. Mose 23,8; 4. Mose 20,14' },
    { volk: 'Ismael', sinn: 'Abrahams erster Sohn — „im Angesicht aller seiner Brüder".', ref: '1. Mose 16,15; 25,18' },
  ],
  wort: 'אָח · ʾaḥ',
  pointe:
    '5. Mose 18,18 sagt „aus der Mitte ihrer Brüder" — die Brudernationen sind Esau und Ismael. Die Linie weist über Israel hinaus.',
}

export const moseKonter: KonterItem[] = [
  {
    tier: 'stone',
    einwand: '„‚Aus deinen Brüdern‘ (Dtn 18,15) meint einen Israeliten — wie beim König (Dtn 17,15)."',
    konter:
      'Zwei Antworten. (1) Selbst wenn „Brüder" Israeliten meinte — der Maßstab „wie Mose" schließt Israel aus: 34,10 sagt, in Israel sei kein Prophet wie Mose aufgestanden. (2) „Bruder" gilt in der Tora den verwandten Völkern: Edom/Esau ist „dein Bruder" (Dtn 23,8; Num 20,14), und Ismael ist Abrahams Sohn. Zudem heißt es in 18,18 „ihre Brüder", nicht „euch".',
    belegId: 'deut3410',
  },
  {
    tier: 'stone',
    einwand: '„Der Prophet wie Mose ist Jesus — so deutet ihn Petrus (Apg 3,22)."',
    konter:
      'Petrus zitiert die Stelle als noch offene Erwartung — die Erfüllung wird am Kriterium „wie Mose" gemessen, nicht an einem Anspruch. Jesus ist gerade ungleich Mose: jungfräulich geboren, ohne neues Gesetz („nicht aufheben", Mt 5,17), ohne Reich „von dieser Welt", von göttlicher Natur (so die Kirche). Mose und Muhammad ﷺ gleichen sich Punkt für Punkt.',
    belegId: 'q7315',
  },
  {
    tier: 'stone',
    einwand: '„Nach Jesus erwartet das Neue Testament keinen weiteren Propheten."',
    konter:
      'Doch — die Juden erwarteten drei Gestalten: den Messias, Elia und „den Propheten" (Joh 1,19-21). Die Priester fragen Johannes den Täufer alle drei getrennt ab. „Der Prophet" (wie Mose) war eine eigene, dritte Erwartung; auch Joh 6,14 und 7,40 nennen ihn gesondert.',
    belegId: 'john121',
  },
  {
    tier: 'stone',
    einwand: '„‚Worte in seinen Mund legen‘ passt auf jeden Propheten."',
    konter:
      'Es passt besonders genau auf eine wörtliche Offenbarung: Muhammad ﷺ rezitiert, was ihm eingegeben wird — „er spricht nicht aus eigener Neigung; es ist nur eine Offenbarung" (53,3-4). Der „ungelehrte" Prophet (7,157) gibt Wort für Wort weiter, was ihm in den Mund gelegt wird — wie der Koran selbst seine Entstehung beschreibt.',
    belegId: 'q5334',
  },
  {
    tier: 'stone',
    einwand: '„Muhammad war Araber — Prophetie gehört zu Israel."',
    konter:
      'Zirkelschluss — und durch Siegel I bereits widerlegt: Ismaels Linie ist gesegnet (Gen 17,20). 18,18 sagt ausdrücklich „aus der Mitte ihrer Brüder". Wäre der Verheißene ein gewöhnlicher Israelit, wären „wie Mose" und der Hinweis auf die „Brüder" überflüssig. Der Vers weist über Israel hinaus.',
  },
  {
    tier: 'marble',
    einwand: '„5. Mose 34 wurde nach Mose geschrieben — ‚keiner wie Mose‘ ist späterer Zusatz."',
    konter:
      'Zweischneidig: dieselbe Quellenkritik, die 34,10 spätdatiert, trifft die ganze Tora-Redaktion — auch die Stellen, die der Gegner für Jesus nutzt. Wir lesen den Endtext, wie beide Seiten ihn überliefern. Und der Endtext sagt klar: in Israel keiner wie Mose.',
  },
]

export const moseScholar: ScholarItem[] = [
  {
    tier: 'stone',
    h: '2.1 — „Wie Mose": der explizite Maßstab',
    body: 'Der Vergleich zu Mose steht zweimal (18,15.18: kāmōnî / kāmôḵā, „wie mich / wie dich"). 34,10 verriegelt die Richtung: „kein Prophet wie Mose in Israel". Der Erwartete muss Mose gleichen und von außerhalb Israels kommen — beide Bedingungen zugleich.',
  },
  {
    tier: 'stone',
    h: '2.2 — „Brüder" in der Tora',
    body: 'Hebr. ʾaḥ / ʾaḥim (Strong H251) bezeichnet auch verwandte Völker: Edom/Esau ist „dein Bruder" (Dtn 2,4; 23,8), Israel spricht zu Edom „dein Bruder Israel" (Num 20,14). Die Brudernationen sind Esau und Ismael. Lexika (BDB, Gesenius) führen diese kollektive Bedeutung ausdrücklich.',
  },
  {
    tier: 'stone',
    h: '2.3 — Die drei Erwartungen (Johannes 1)',
    body: 'Joh 1,19-21: Messias, Elia und „der Prophet" werden als drei getrennte Gestalten abgefragt. Joh 6,14 („das ist wahrhaftig der Prophet") und 7,40 bestätigen: „der Prophet" wie Mose war eine eigenständige jüdische Erwartung — nicht deckungsgleich mit dem Messias.',
  },
  {
    tier: 'marble',
    h: '2.4 — „Worte in seinen Mund"',
    body: 'Die Formel beschreibt diktierte, wörtliche Offenbarung. Der Koran versteht sich genau so: rezitierte Eingabe (53,3-4), empfangen vom „ungelehrten" Propheten (7,157), der nicht aus sich selbst spricht. Das Bild „in seinen Mund legen" trifft den koranischen Offenbarungsmodus exakt.',
  },
  {
    tier: 'stone',
    h: '2.5 — Mose und Muhammad: die Parallelen',
    body: 'Geburt, Familie, Gesetzgebung, Staatsführung, Auswanderung (Midian / Medina), natürlicher Tod, schließliche Annahme durch das Volk: Punkt für Punkt steht Muhammad ﷺ dem Mose näher als Jesus. Siehe das Vergleichs-Exhibit — neun Kriterien, eine Linie.',
  },
  {
    tier: 'marble',
    h: '2.6 — Apg 3,22-23: offene Verheißung',
    body: 'Petrus zitiert Dtn 18 als noch zu erfüllende Verheißung und warnt, „wer nicht hört, wird ausgerottet" (18,19). Die Schwere der Folge zeigt: gemeint ist ein Prophet von Mose-Rang. Die christliche Zuordnung zu Jesus ist Auslegung; der Text nennt als Kriterium allein „wie Mose".',
  },
]

export const moseVernetzung = [
  { ziel: 'Siegel I — Abrahams Nachkommen', text: '„Aus der Mitte ihrer Brüder" — die Brudernation ist Ismaels gesegnete Linie, die Siegel I belegt.' },
  { ziel: 'Das Fundament', text: '„Worte in seinen Mund" = die wörtliche Offenbarung des Koran (7,157; 53,3-4).' },
  { ziel: 'Siegel VI — Der Paraklet', text: 'Eine zweite Ankündigung eines Kommenden — im Mund Jesu selbst (Joh 14–16).' },
]

export const moseGleicheMassstaebe =
  'Wer 5. Mose 18 auf Jesus bezieht, muss den Maßstab des Verses selbst akzeptieren: „wie Mose". An diesem Maßstab gemessen gleicht Jesus dem Mose am wenigsten — und Muhammad ﷺ am meisten. Misst man beide gleich, weist der Vers nicht nach Bethlehem, sondern nach Arabien.'
