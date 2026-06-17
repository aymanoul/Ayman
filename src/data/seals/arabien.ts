import type { Beleg } from '../types'

// ---------------------------------------------------------------------------
// SIEGEL III — Arabische Prophezeiungen (فاران · Paran). SPEC §6.3.
//
// Kern-These: VIER unabhängige Bücher des AT nennen denselben Ort mit
// FÜNF Eigennamen — Paran · Kedar · Sela · Tema · Baca — alle in Westarabien
// (Mekka/Medina), alle verbunden mit einem Gesetzgeber, 10.000 Heiligen und
// einer Pilgerfahrt. Kein geografischer Zufall, sondern ein KOORDINATENNETZ,
// das mathematisch nur auf einen Punkt zeigt: Muhammad ﷺ aus Mekka.
//
//   A — Deut 33,2:  Sinai → Seir → Paran · 10.000 Heilige · feuriges Gesetz
//   B — Jes 42,11:  Kedar + Sela jubeln
//   C — Jes 21,13-15: Flucht nach Tema, „vor dem Schwert fliehen" = Hidschra
//   D — Ps 84,5-6:  Pilgerfahrt durch das Tal Baca = Bakkah (Quran 3,96)
//
// Full verse / source texts live on the Beleg records and surface only in the
// immersive modal — never as body copy on the surface.
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

export const arabienThese =
  'Die Bibel nennt den Ort beim Namen: Paran, Kedar, Sela, Tema, Baca — alles Westarabien. Vier unabhängige Bücher des Alten Testaments fixieren dasselbe geografische Cluster, alle verbunden mit einem Gesetzgeber, mit zehntausend Heiligen und mit einer Pilgerfahrt. Das ist kein einzelner Vers, sondern ein geografisches Koordinatennetz, das mathematisch nur auf einen Punkt zeigt. Kein Israelit, kein Cyrus, kein erwarteter Messias kam von dort. Nur einer: Muhammad ﷺ aus Mekka.'

export const arabienSteps: Step[] = [
  {
    n: 'A',
    h: 'Drei Offenbarungen, ein Höhepunkt',
    body: '„Der HERR kam vom Sinai, ging auf von Seir, strahlte hervor vom Berg Paran, und kam mit zehntausend Heiligen; aus seiner Rechten ein feuriges Gesetz" (5. Mose 33,2). Sinai = Mose/Tora. Seir = Jesus/Evangelium. Paran (Arabien) = Muhammad ﷺ/Quran. Der Höhepunkt des Strahlens liegt bei Paran — der letzten, hellsten Offenbarung.',
  },
  {
    n: 'B',
    h: 'Der Ort namentlich',
    body: '„Die Dörfer, wo Kedar wohnt, sollen jubeln; die Bewohner von Sela sollen jauchzen, von den Berggipfeln rufen" (Jesaja 42,11). Kedar = Sohn Ismaels (1. Mose 25,13). Sela = Mekka/Medina. Der Knecht Gottes erscheint nicht in Juda, sondern in Arabien.',
  },
  {
    n: 'C',
    h: 'Die Flucht nach Tema',
    body: '„Bringt den Durstigen Wasser entgegen … denn sie fliehen vor dem Schwert" (Jesaja 21,14-15). Die Hidschra: verfolgte Gläubige aus Mekka, vor dem Schwert fliehend, empfangen in Medina/Tema, der nordwestarabischen Oase. Eine vierte Bibelstelle, derselbe Wüstenstreifen.',
  },
  {
    n: 'D',
    h: 'Die Pilgerfahrt im Tal Baca',
    body: '„Wohl denen, deren Herz auf Pilgerfahrt sinnt. Wenn sie durch das Tal Baca ziehen …" (Psalm 84,5-6). Baca = Bakkah = Mekka (Quran 3,96). Die Pilgerfahrt = der Hadsch. Ein wasserloses Tal, zum Quellort gemacht, Ziel einer weltweiten Wallfahrt.',
  },
]

export const arabienBelege: Record<string, Beleg> = {
  // ============================ KERN-VERSE A–D ============================

  // ---- A · Deut 33,2 — three shinings, 10.000, fiery law ----
  deut332: {
    typ: 'bibel',
    kurz: 'Der HERR kam vom Sinai, ging auf von Seir, strahlte hervor vom Berg Paran — mit zehntausend Heiligen.',
    original:
      'יְהוָה מִסִּינַי בָּא וְזָרַח מִשֵּׂעִיר לָמוֹ הוֹפִיעַ מֵהַר פָּארָן וְאָתָה מֵרִבְבֹת קֹדֶשׁ מִימִינוֹ אֵשׁ דָּת לָמוֹ',
    sprache: 'he',
    translit:
      'YHWH mi-Sînay bāʾ, wᵉ-zāraḥ mi-Śēʿîr lāmô, hôfîaʿ mē-har Pārān, wᵉ-ʾātāh mē-rivᵉvōt qōdeš, mî-mînô ʾēš dāt lāmô',
    uebersetzung:
      '„Der HERR kam vom Sinai und ging ihnen (lāmô) auf von Seir; er strahlte hervor vom Berg Paran und kam von Zehntausenden (rᵉvāvāh) Heiliger; zu seiner Rechten ein feuriges Gesetz (ēsh dāt) für sie." — Drei Berge, drei steigende Verben (kam · ging auf · strahlte hervor), Höhepunkt bei Paran. Das Pronomen „ihnen" (nicht „euch") zeigt ein anderes Volk als Israel.',
    fundstelle: '5. Mose (Deuteronomium) 33,2',
    status: 'Strong H6290 · Pārān = Paran',
    kern: 'מֵהַר פָּארָן',
  },

  // ---- B · Jes 42,11 — Kedar + Sela rejoice ----
  isa4211: {
    typ: 'bibel',
    kurz: 'Jubeln sollen die Dörfer Kedars, die Bewohner Selas — von den Berggipfeln sollen sie rufen.',
    original:
      'יִשְׂאוּ מִדְבָּר וְעָרָיו חֲצֵרִים תֵּשֵׁב קֵדָר יָרֹנּוּ יֹשְׁבֵי סֶלַע מֵרֹאשׁ הָרִים יִצְוָחוּ',
    sprache: 'he',
    translit:
      'yiśʾû midbār wᵉ-ʿārāyw, ḥăṣērîm tēšēv Qēdār; yārōnnû yōšᵉvê Selaʿ, mē-rōʾš hārîm yiṣwāḥû',
    uebersetzung:
      '„Die Wüste und ihre Städte sollen die Stimme erheben, die Dörfer, wo Kedar wohnt; jubeln sollen die Bewohner von Sela, vom Gipfel der Berge sollen sie rufen." — Kedar = Ismaels Sohn (1. Mose 25,13), Sammelbegriff für die Wüstenstämme Westarabiens. Sela mit Kedar genannt → Arabien, nicht Petra/Edom.',
    fundstelle: 'Jesaja 42,11',
    kern: 'תֵּשֵׁב קֵדָר',
  },

  // ---- C · Jes 21,13-15 — the flight to Tema (the missing verse) ----
  isa2113: {
    typ: 'bibel',
    kurz: 'Bringt dem Durstigen Wasser entgegen, ihr Bewohner von Tema — denn sie fliehen vor dem Schwert.',
    original:
      'לִקְרַאת צָמֵא הֵתָיוּ מָיִם יֹשְׁבֵי אֶרֶץ תֵּימָא בְּלַחְמוֹ קִדְּמוּ נֹדֵד כִּי מִפְּנֵי חֲרָבוֹת נָדָדוּ',
    sprache: 'he',
    translit:
      'liqraʾt ṣāmēʾ hētāyû māyim, yōšᵉvê ʾereṣ Têmāʾ, bᵉ-laḥmô qiddᵉmû nōdēd; kî mi-pᵉnê ḥărāvôt nādādû',
    uebersetzung:
      '„Bringt dem Durstigen Wasser entgegen, ihr Bewohner des Landes Tema, kommt dem Flüchtling mit Brot entgegen; denn sie fliehen vor dem Schwert (mi-pᵉnê ḥărāvôt), vor dem gezückten Schwert, vor dem gespannten Bogen, vor der Schwere des Krieges." — Die Hidschra: verfolgte Muslime fliehen aus Mekka „vor dem Schwert", empfangen in Medina/Tema.',
    fundstelle: 'Jesaja 21,14-15',
    kern: 'אֶרֶץ תֵּימָא',
  },

  // ---- D · Ps 84,5-6 — pilgrimage through the valley of Baca ----
  ps845: {
    typ: 'bibel',
    kurz: 'Wohl denen, deren Herz auf Pilgerfahrt sinnt — wenn sie durch das Tal Baca ziehen.',
    original:
      'אַשְׁרֵי אָדָם עוֹז לוֹ בָךְ מְסִלּוֹת בִּלְבָבָם עֹבְרֵי בְּעֵמֶק הַבָּכָא מַעְיָן יְשִׁיתוּהוּ גַּם בְּרָכוֹת יַעְטֶה מוֹרֶה',
    sprache: 'he',
    translit:
      'ʾašrê ʾādām ʿôz lô bāk, mᵉsillôt bi-lᵉvāvām; ʿōvᵉrê bᵉ-ʿēmeq ha-Bākāʾ maʿyān yᵉšîtûhû, gam bᵉrāḵôt yaʿṭeh môreh',
    uebersetzung:
      '„Wohl den Menschen, deren Stärke in dir ist, in deren Herz die Pilgerwege (mᵉsillôt) sind! Die durch das Tal Baca (ha-Bākāʾ) ziehen, machen es zu einem Quellort; auch mit Segen (bᵉrāḵôt) bedeckt es der Lehrer/Regen (môreh)." — Pilgerfahrt + Tal Baca + Lehrer/Gesetzgeber + Segen (baraka). Baca = Bakkah = Mekka (Quran 3,96).',
    fundstelle: 'Psalm 84,5-6 (dt. 84,6-7)',
    status: 'B-K-ʾ · mowreh = Lehrer/Regen · berakah = Segen',
    kern: 'עֵמֶק הַבָּכָא',
  },

  // ============================ STÜTZ-VERSE ============================

  // ---- Habakkuk 3,3 — God from Teman and Paran, future tense ----
  hab33: {
    typ: 'bibel',
    kurz: 'Gott wird von Teman kommen, der Heilige vom Berg Paran — Zukunftsform, Sinai fehlt.',
    original:
      'אֱלוֹהַ מִתֵּימָן יָבוֹא וְקָדוֹשׁ מֵהַר פָּארָן סֶלָה כִּסָּה שָׁמַיִם הוֹדוֹ וּתְהִלָּתוֹ מָלְאָה הָאָרֶץ',
    sprache: 'he',
    translit:
      'ʾĕlôah mi-Têmān yāvôʾ, wᵉ-qādôš mē-har Pārān. selāh. kissāh šāmayim hôdô, û-tᵉhillātô mālᵉʾāh hā-ʾāreṣ',
    uebersetzung:
      '„Gott wird von Teman kommen (yāvôʾ — Zukunftsform) und der Heilige vom Berg Paran. Sela. Seine Hoheit bedeckt die Himmel, und seines Lobes (tᵉhillāh) ist die Erde voll." — Wiederholung von 5. Mose 33,2 in Zukunftsform; Teman = Seir (1. Mose 36,11; Jamieson-Fausset-Brown); Sinai fehlt → Barnes: ein Gesetzgeber wie Mose (5. Mose 18,15-18).',
    fundstelle: 'Habakuk 3,3',
    status: 'yāvôʾ = er wird kommen (Imperfekt/Zukunft)',
    kern: 'מֵהַר פָּארָן',
  },

  // ---- Gen 21,21 — Ishmael settles in Paran ----
  gen2121: {
    typ: 'bibel',
    kurz: 'Und er [Ismael] wohnte in der Wüste Paran.',
    original: 'וַיֵּשֶׁב בְּמִדְבַּר פָּארָן וַתִּקַּח לוֹ אִמּוֹ אִשָּׁה מֵאֶרֶץ מִצְרָיִם',
    sprache: 'he',
    translit: 'wayyēšev bᵉ-midbar Pārān, wattiqqaḥ lô ʾimmô ʾiššāh mē-ʾereṣ Miṣrāyim',
    uebersetzung:
      '„Und er wohnte in der Wüste Paran, und seine Mutter nahm ihm eine Frau aus dem Land Ägypten." — Die Tora selbst verankert Ismael in Paran: dem Ort des dritten, hellsten Aufgangs. Der unbestreitbare geografische Anker.',
    fundstelle: '1. Mose (Genesis) 21,21',
    kern: 'בְּמִדְבַּר פָּארָן',
  },

  // ---- Gen 25,13 — Kedar is Ishmael's (second) son ----
  gen2513: {
    typ: 'bibel',
    kurz: 'Die Söhne Ismaels: Nebajot, der Erstgeborene, und Kedar … — zwölf Fürsten.',
    original:
      'וְאֵלֶּה שְׁמוֹת בְּנֵי יִשְׁמָעֵאל ... נְבָיֹת וְקֵדָר וְאַדְבְּאֵל וּמִבְשָׂם',
    sprache: 'he',
    translit: 'wᵉ-ʾēlleh šᵉmôt bᵉnê Yišmāʿēl … Nᵉvāyōt wᵉ-Qēdār wᵉ-ʾAdbᵉʾēl û-Mivśām',
    uebersetzung:
      '„Und dies sind die Namen der Söhne Ismaels … Nebajot, der Erstgeborene Ismaels, und Kedar und Adbeel und Mibsam …" — Kedar ist Ismaels zweiter Sohn und wird im Tanach zum Namen der Araber (Jes 21,16; Ps 120,5). „Kedar" in Jesaja 42,11 = Ismaels Linie.',
    fundstelle: '1. Mose (Genesis) 25,13',
    kern: 'וְקֵדָר',
  },

  // ---- Quran: the first house at Bakkah ----
  q396: {
    typ: 'quran',
    kurz: 'Das erste Haus, das für die Menschen errichtet wurde, ist das in Bakka (Mekka).',
    original:
      'إِنَّ أَوَّلَ بَيْتٍ وُضِعَ لِلنَّاسِ لَلَّذِي بِبَكَّةَ مُبَارَكًا وَهُدًى لِّلْعَالَمِينَ',
    sprache: 'ar',
    translit: 'inna awwala baytin wuḍiʿa li-n-nāsi la-lladhī bi-Bakkata mubārakan wa-hudan li-l-ʿālamīn',
    uebersetzung:
      '„Wahrlich, das erste Haus, das für die Menschen errichtet wurde, ist das in Bakka — als ein gesegnetes und als Rechtleitung für die Welten." — Der Koran nennt Mekka „Bakka": denselben Konsonantenstamm (B-K-ʾ) wie das „Tal Baka" des Psalms 84.',
    fundstelle: 'Sure 3 (Āl ʿImrān), Vers 96',
    kern: 'بِبَكَّةَ',
  },

  // ---- Quran: the call to pilgrimage ----
  q2227: {
    typ: 'quran',
    kurz: 'Rufe unter den Menschen zur Pilgerfahrt auf — sie kommen aus jedem tiefen Talweg.',
    original:
      'وَأَذِّن فِي النَّاسِ بِالْحَجِّ يَأْتُوكَ رِجَالًا وَعَلَىٰ كُلِّ ضَامِرٍ يَأْتِينَ مِن كُلِّ فَجٍّ عَمِيقٍ',
    sprache: 'ar',
    translit: 'wa-adhdhin fī n-nāsi bi-l-ḥajji yaʾtūka rijālan wa-ʿalā kulli ḍāmirin yaʾtīna min kulli fajjin ʿamīq',
    uebersetzung:
      '„Und rufe unter den Menschen zur Pilgerfahrt auf: Sie werden zu dir kommen, zu Fuß und auf jedem hageren Kamel, aus jedem tiefen Talweg." — Der Hadsch: die Pilger, die durch das Tal ziehen und es zur Quelle machen (Ps 84,6).',
    fundstelle: 'Sure 22 (al-Ḥajj), Vers 27',
    kern: 'بِالْحَجِّ',
  },

  // ============================ QUELLEN (Gelehrte) ============================

  // ---- Source: the Deut 33,2 textual variants (MT/LXX/DSS/SP) ----
  textvarianten: {
    typ: 'quelle',
    kurz: 'Textvarianten 5. Mose 33,2: MT „feuriges Gesetz" · LXX „Engel" · DSS „feuriges Gesetz" · SP „Aufleuchten".',
    uebersetzung:
      'Die letzte Wendung von 5. Mose 33,2 („aus seiner Rechten …") variiert in den Textzeugen: Der Masoretische Text (MT) liest ēsh dāt, „feuriges Gesetz"; die Septuaginta (LXX) liest „Engel" (angeloi); die Qumran-Rollen (DSS, 4QDeut) lesen „feuriges Gesetz"; der Samaritanische Pentateuch (SP) liest eine Form von „aufleuchten". Drei von vier Zeugen → „Gesetz". Selbst bei der LXX-Lesart „Engel": Quran 3,124 — Gott sandte 3.000 Engel bei Badr.',
    fundstelle: 'MT · LXX · 4QDeut (DSS) · Samaritanus, zu 5. Mose 33,2',
  },

  // ---- Source: rebabah = ten thousand; the conquest of Mecca ----
  zehntausend: {
    typ: 'quelle',
    kurz: 'rᵉvāvāh = „zehntausend" (Gesenius). Eroberung Mekkas mit exakt 10.000 Mann — bezeugt von Augenzeugen.',
    uebersetzung:
      'Hebr. rᵉvāvāh bedeutet strikt „zehntausend" (Gesenius); 5. Mose 33,17 unterscheidet grammatikalisch „zehntausend" (V. 2) von „Zehntausende" (V. 17). Erfüllung: die Eroberung Mekkas mit exakt 10.000 Mann — bezeugt von Ibn ʿAbbās und Anas ibn Mālik, beiden Augenzeugen. Die abweichende Zahl 12.000 entstand durch Verwechslung mit der Schlacht von Ḥunayn zwei Wochen später (10.000 + 2.000 Mekkaner). Zur Zeit Moses gab es nur zwei gerechte Israeliten (Kaleb, Josua; 4. Mose 14,30) — keine 10.000.',
    fundstelle: 'Gesenius · Ibn ʿAbbās · Anas ibn Mālik · vgl. 5. Mose 33,17',
  },

  // ---- Source: Christopher North — mishpat = din ----
  north: {
    typ: 'quelle',
    kurz: 'Prof. Christopher North: das mishpāṭ des Knechts (Jes 42) im Sinn des islamischen „dīn".',
    uebersetzung:
      'Der Jesaja-Kommentator Prof. Christopher R. North deutet das mishpāṭ, das der Knecht „zu den Nationen trägt" (Jes 42,1), „im umfassenden Sinn des islamischen dīn, das Glaube und Praxis umfasst" — ein Hebraist nennt das islamische dīn beim Namen. Dazu die NIV Study Bible: „Der Knecht wird ein neuer Moses sein" (vgl. 5. Mose 18,15-18) — die „neue torah", auf die „die Inseln hoffen" (42,4).',
    fundstelle: 'C. R. North, The Second Isaiah · NIV Study Bible zu Jes 42',
  },

  // ---- Source: the alternative-candidate refutation (Cyrus / Isaiah / Israel) ----
  knechtquellen: {
    typ: 'quelle',
    kurz: 'Knecht Jes 42 ≠ Cyrus / Israel / Jesaja: alle scheitern an Kedar/Sela. Saadia Gaon nahm sogar einen Heiden an.',
    uebersetzung:
      'Alle klassischen Alternativ-Kandidaten scheitern an der Geografie: Cyrus betrat Arabien nie (die Halbinsel wurde nie von einem Fremdreich erobert) und starb in der Schlacht (Beckwith); Jesaja nennt sich sonst beim Namen (Jes 20,2) — hier Zukunftsform; Israel kann nicht „Licht für Israel" sein. Saadia Gaon hielt Cyrus (einen Heiden!) für den Knecht — selbst klassische jüdische Gelehrte akzeptierten also einen nicht-israelitischen Knecht. Die schiere Verwirrung der Kommentatoren (vier widersprüchliche Kandidaten) zeigt: alle falsch.',
    fundstelle: 'Beckwith (Cyrus) · Saadia Gaon · vgl. Jes 20,2',
  },

  // ---- Source: Tema, the NW-Arabian oasis ----
  temaquelle: {
    typ: 'quelle',
    kurz: 'Tema: Oase in Nordwestarabien, besiedelt vor 3000 v. Chr., bekannt für Wasser und Gastfreundschaft.',
    uebersetzung:
      'Tema (Taymāʾ) ist eine archäologisch belegte Oase in Nordwestarabien (Besiedlung vor 3000 v. Chr.), bekannt für Wasser und Gastfreundschaft. Warum sollte Jesaja gerade Tema auffordern, Wasser zu geben, was es ohnehin tut? → ein Hinweis, dass diese Flüchtlinge bedeutend sind. Jesaja 21,16: „innerhalb eines Jahres ist die Herrlichkeit Kedars zu Ende" → die Schlacht von Badr 624. Jesaja 21 vernetzt Kedar/Sela (Jes 42), Paran (Deut 33) und Teman (Hab 3) zu einem geografischen Cluster.',
    fundstelle: 'Tema/Taymāʾ (archäologisch) · vgl. Jes 21,16',
  },

  // ---- Source: Baca = Bakkah, the B/M shift, and "lawgiver" ----
  bacaquelle: {
    typ: 'quelle',
    kurz: 'Baca = Bakkah (Quran 3,96); LXX/Aramäisch/Peschitta lesen „Gesetzgeber"; B/M-Wechsel (Hieronymus).',
    uebersetzung:
      'Das „Tal Baca" (Ps 84) zählt zu den schwierigsten Versen der Psalmen (Barnes). Baca = Bakkah = Mekka (Quran 3,96); der B/M-Wechsel in semitischen Dialekten ist belegt (Hieronymus: „m und b werden in orientalischen Dialekten oft vertauscht"; Eusebius zu Dibon/Dimon). mowreh („Regen") heißt auch „Lehrer", im Plural sogar „Prophet" (Gesenius, Jes 30,20); bᵉrāḵāh („Segen") = arab. baraka. Septuaginta, Aramäische Bibel und Syrische Peschitta lesen ausdrücklich „Gesetzgeber" (gr. nomotheteō): „der Gesetzgeber wird Segen gewähren." Drei alte Versionen nennen einen Gesetzgeber im Tal Baca — Verbindung zu Jes 42,4.',
    fundstelle: 'Quran 3,96 · LXX/Targum/Peschitta · Hieronymus · Gesenius',
  },
}

// ===========================================================================
// EXHIBIT DATA
// ===========================================================================

// ---- 🔥 HAUPT-EXHIBIT: the five-point map (Paran · Kedar · Sela · Tema · Baca)
export const arabienKarte = {
  intro:
    'Fünf Eigennamen aus vier unabhängigen Büchern der hebräischen Bibel — Paran, Kedar, Sela, Tema, Baca — und alle fünf liegen in einem einzigen Wüstenstreifen: Westarabien. Ein geografisches Cluster, das mathematisch nur auf einen Punkt zeigt.',
  // coordinates in a 0–100 × 0–120 viewBox (north up, south down)
  punkte: [
    { id: 'sinai', label: 'Sinai', sub: 'Mose · Tora', stelle: '', x: 22, y: 16, tone: 'muted' as const },
    { id: 'seir', label: 'Seir · Teman', sub: 'der zweite Aufgang', stelle: 'Deut 33 · Hab 3', x: 60, y: 14, tone: 'muted' as const },
    { id: 'tema', label: 'Tema', sub: 'NW-Oase · die Hidschra', stelle: 'Jesaja 21,14', x: 73, y: 38, tone: 'brass' as const },
    { id: 'paran', label: 'Wüste Paran', sub: 'Ismaels Wohnort', stelle: '1. Mose 21,21 · Deut 33,2', x: 40, y: 52, tone: 'green' as const },
    { id: 'sela', label: 'Sela', sub: 'Medina-Berg · Masjid Nabawi', stelle: 'Jesaja 42,11', x: 66, y: 70, tone: 'green' as const },
    { id: 'kedar', label: 'Kedar', sub: 'Quraisch-Gebiet · Ismaels Sohn', stelle: 'Jes 42,11 · 1. Mose 25,13', x: 36, y: 84, tone: 'brass' as const },
    { id: 'baca', label: 'Baca · Bakka · Mekka', sub: 'das erste Haus · die Pilgerfahrt', stelle: 'Ps 84,6 · Koran 3,96', x: 54, y: 102, tone: 'green' as const },
  ],
  // the four independent books, each pinning a name
  buecher: [
    { buch: '5. Mose 33', namen: 'Paran' },
    { buch: 'Jesaja 42', namen: 'Kedar · Sela' },
    { buch: 'Jesaja 21', namen: 'Tema' },
    { buch: 'Psalm 84', namen: 'Baca' },
  ],
  // the descending shining route: sinai → paran → kedar → baca
  pfad: ['sinai', 'paran', 'kedar', 'baca'],
  pointe:
    'Paran, Kedar, Sela, Tema, Baca — fünf Namen, vier Bücher, ein Land. Alle verbunden mit demselben Begleitmerkmal: Gesetzgeber, Pilgerfahrt, 10.000, Jubel. Cyrus betrat Arabien nie; kein israelitischer Prophet wurde je in Kedar oder Sela bejubelt. Auf gleichen Maßstäben gibt es exakt einen Erfüller.',
}

// ---- Deut 33,2 rising-light diagram (Dawn → Sunrise → Zenith) ---------------
export const dreiAufstrahlungen = {
  intro:
    '5. Mose 33,2 zeichnet das Licht Gottes in drei Stufen — drei Berge, drei Völker, ein steigendes Verb. Das Hebräische wird heller: kommen → aufgehen → hervorstrahlen. Wie Morgendämmerung → Sonnenaufgang → Sonne im Zenit.',
  berge: [
    {
      ort: 'Sinai',
      verb: 'kam',
      verbHe: 'בָּא · bāʾ',
      licht: 'Dämmerung',
      figur: 'Mose',
      volk: 'Israel',
      schrift: 'die Tora',
      hl: false,
    },
    {
      ort: 'Seir',
      verb: 'ging auf',
      verbHe: 'זָרַח · zāraḥ',
      licht: 'Sonnenaufgang',
      figur: 'Jesus',
      volk: 'die Völker im Norden',
      schrift: 'das Evangelium',
      hl: false,
    },
    {
      ort: 'Paran',
      verb: 'strahlte hervor',
      verbHe: 'הוֹפִיעַ · hôfîaʿ',
      licht: 'Zenit',
      figur: 'Muhammad ﷺ',
      volk: 'Arabien',
      schrift: 'der Quran',
      hl: true,
    },
  ],
  pointe:
    'Das hellste Verb — hôfîaʿ, „hervorstrahlen wie die volle Sonne" — steht über Paran, dem Wohnort Ismaels (1. Mose 21,21). Bei einer bloßen Routenaufzählung müsste der Höhepunkt am Sinai liegen. Der Höhepunkt liegt bei Paran. Und „zu seiner Rechten ein feuriges Gesetz" (ēsh dāt): eine neue Offenbarung.',
}

// ---- Textual variants of Deut 33,2 (MT / LXX / DSS / SP) --------------------
export const textvariantenTabelle = {
  intro:
    'Die Schlusswendung von 5. Mose 33,2 („aus seiner Rechten …") in den vier wichtigsten Textzeugen. Drei von vier lesen „Gesetz" — und selbst die Ausnahme (LXX „Engel") findet ihre Entsprechung in Quran 3,124.',
  spalten: ['Textzeuge', 'Lesart', 'Bedeutung'],
  zeilen: [
    { zeuge: 'Masoretischer Text (MT)', lesart: 'אֵשׁ דָּת · ēsh dāt', sinn: '„feuriges Gesetz"', law: true },
    { zeuge: 'Septuaginta (LXX)', lesart: 'ἄγγελοι · angeloi', sinn: '„Engel" → vgl. Quran 3,124 (3.000 Engel bei Badr)', law: false },
    { zeuge: 'Qumran-Rollen (DSS · 4QDeut)', lesart: 'אש דת · ēsh dāt', sinn: '„feuriges Gesetz"', law: true },
    { zeuge: 'Samaritanischer Pentateuch (SP)', lesart: 'Wurzel √hôfīaʿ', sinn: '„Aufleuchten / Hervorstrahlen"', law: false },
  ],
  pointe:
    '„Feuriges Gesetz" steht in der Mehrheit der Zeugen (3 von 4) — eine Gesetzes-Offenbarung, nicht bloß eine Erscheinung. Das ist der Quran.',
}

// ---- the order-proof: Exodus route vs prophecy sequence --------------------
export const reihenfolgeBeweis = {
  intro:
    'Der häufigste Einwand lautet, 5. Mose 33,2 zähle nur die Exodus-Route auf. Aber die Reihenfolge stimmt dann nicht: Laut Numeri zogen die Israeliten erst durch Paran und dann nach Seir — nicht umgekehrt. Als Prophezeiung dagegen ist die Sequenz lückenlos.',
  spalten: ['Exodus-Route (Numeri)', 'Prophezeiungs-Sequenz (Deut 33,2)'],
  zeilen: [
    { route: 'Sinai (Aufbruch)', prophetie: 'Sinai → Tora (Mose)' },
    { route: 'Wüste Paran (4. Mose 10,12; 12,16)', prophetie: 'Seir → Evangelium (Jesus)' },
    { route: 'dann erst Seir/Edom (4. Mose 20,14 ff.)', prophetie: 'Paran → Quran (Muhammad ﷺ)' },
    { route: '→ Paran VOR Seir: Reihenfolge widerspricht 33,2', prophetie: '→ Tora → Evangelium → Quran: Sequenz perfekt' },
  ],
  pointe:
    'Für die Exodus-Deutung ist die Reihenfolge falsch und der Höhepunkt am falschen Ort (er liegt bei Paran statt am Sinai). Als prophetische Abfolge dreier Offenbarungen ist sie exakt.',
}

// ---- the etmokh / etmokhah letter comparison (🟡 marble) --------------------
export const etmokhVergleich = {
  marble: true,
  intro:
    'Jesaja 42,1 nennt den Knecht im Masoretischen Text „etmokh" („den ich stütze"). Die Große Jesaja-Rolle (1QIsaᵃ, die älteste Handschrift) liest „etmokhah" — durch Hinzufügung der Buchstaben Waw + He. Diese erweiterte Konsonantenfolge erlaubt eine Lesung, die phonetisch an Aḥmad anklingt.',
  links: { titel: 'Masoretischer Text', wort: 'אֶתְמָךְ', trans: 'ʾetmōk', sinn: '„den ich stütze" — vier Konsonanten א-ת-מ-ך' },
  rechts: { titel: '1QIsaᵃ (Große Jesaja-Rolle)', wort: 'אֶתְמָכָה', trans: 'ʾetmōkāh', sinn: 'mit Waw + He hinzugefügt → klingt an Aḥmad an' },
  // letter-by-letter, RTL: read right→left
  buchstabenMT: ['א', 'ת', 'מ', 'ך'],
  buchstaben1Q: ['א', 'ת', 'מ', 'כ', 'ה'],
  pointe:
    'Linguistisch suggestiv, aber bestreitbar — als Indiz geführt, nicht als harter Namens-Beweis. Der eigentliche Namens-Beweis kommt in Siegel IV (Machamaddim). Vgl. auch 1QIsaᵃ zu Hld 5,16.',
}

// ---- three summary tables (Prophezeiung ↔ Erfüllung) ------------------------
export const synopseDeut = {
  titel: 'Synopse · 5. Mose 33,2',
  paar: ['Prophezeiung', 'Erfüllung'],
  zeilen: [
    { a: '„strahlte hervor vom Berg Paran" (hellstes Verb)', b: 'Die letzte, hellste Offenbarung aus Ismaels Land' },
    { a: '„zehntausend Heilige" (rᵉvāvāh)', b: 'Eroberung Mekkas mit 10.000 Mann (Ibn ʿAbbās, Anas)' },
    { a: '„ein feuriges Gesetz aus seiner Rechten"', b: 'Der Quran (3 von 4 Textzeugen: „Gesetz")' },
    { a: 'Pronomen „ihnen" (Seir/Paran), nicht „euch"', b: 'Ein anderes Volk als das Israel des Mose' },
  ],
}

export const synopseJes = {
  titel: 'Synopse · Jesaja 42',
  paar: ['Prophezeiung', 'Erfüllung'],
  zeilen: [
    { a: '„die Dörfer Kedars … die Bewohner Selas jubeln"', b: 'Mekka/Medina jubeln (labbayka; Ankunft in Medina, Anas)' },
    { a: '„auf seine torah hoffen die Inseln" (42,4)', b: 'Ein neues Gesetz — der Knecht als neuer Mose (Deut 18)' },
    { a: '„er trägt mishpāṭ zu den Nationen" (42,1)', b: 'Das islamische dīn (Prof. Christopher North)' },
    { a: '„er schreit nicht, erhebt seine Stimme nicht" (42,2)', b: 'Muhammads ﷺ sanftes Wesen (Gefährten bezeugen)' },
  ],
}

export const synopsePs = {
  titel: 'Synopse · Psalm 84',
  paar: ['Prophezeiung', 'Erfüllung'],
  zeilen: [
    { a: '„deren Herz auf Pilgerfahrt sinnt" (84,5)', b: 'Der Hadsch (Quran 22,27)' },
    { a: '„durch das Tal Baca ziehen" (84,6)', b: 'Bakkah = Mekka (Quran 3,96)' },
    { a: '„der Lehrer/Regen mit Segen" (mowreh · berakah)', b: 'Ein Gesetzgeber (LXX/Targum/Peschitta) · baraka' },
    { a: '„besser ein Tag … als tausend" (84,10)', b: 'Hadith: ein Gebet dort besser als 100.000 anderswo' },
  ],
}

// ===========================================================================
// EINWAND-KONTER (SPEC box, lines 462–469) — six objections
// ===========================================================================
export const arabienKonter: KonterItem[] = [
  {
    tier: 'stone',
    einwand: '„5. Mose 33 zählt nur die Exodus-Route auf."',
    konter:
      'Unmöglich: Die Reihenfolge ist falsch für den Exodus — laut Numeri zogen sie nach Paran zu Seir, nicht umgekehrt (Paran: 4. Mose 10,12; 12,16 / Seir erst 20,14 ff.). Als Prophezeiung (Sinai→Seir→Paran = Tora→Evangelium→Quran) ist die Sequenz perfekt. Und das Strahlen ist am stärksten bei Paran — nicht bei Sinai. Bei einer Routenaufzählung müsste Sinai der Höhepunkt sein.',
    belegId: 'deut332',
  },
  {
    tier: 'stone',
    einwand: '„Mose spricht direkt zu Israel, also geht es um Israel."',
    konter:
      'Falsch — Pronomenwechsel. Bei Seir und Paran steht „ihnen" (lāmô, them), nicht „euch" (you). Überall sonst in 5. Mose 33 redet Mose Israel mit „du/euch" an (z. B. 33,29). Der Wechsel zu „ihnen" zeigt: ein anderes Volk als das Israel des Mose.',
    belegId: 'deut332',
  },
  {
    tier: 'stone',
    einwand: '„Die 10.000 Heiligen waren Engel am Sinai."',
    konter:
      'Der Ort der 10.000 ist Paran, nicht Sinai. Und der nächste Vers (33,3) sagt ausdrücklich: „er liebte das Volk … sie saßen zu deinen Füßen" — Menschen, keine Engel. Zur Zeit Moses gab es nur zwei gerechte Israeliten (Kaleb, Josua; 4. Mose 14,30) — keine 10.000. → Erfüllung: Eroberung Mekkas (10.000 Mann) + Abschiedswallfahrt.',
    belegId: 'zehntausend',
  },
  {
    tier: 'stone',
    einwand: '„Sela liegt in Petra (Edom/Jordanien), nicht Arabien."',
    konter:
      'Jesaja nennt Sela zusammen mit Kedar. Kedar = Westarabien (Ismaels Sohn, 1. Mose 25,13). Hätte er das Sela Edoms gemeint, hätte er das Jubeln der Edomiter genannt, nicht Kedars. Und: Welcher Prophet zog je nach Edom und wurde von jubelnden Menschen empfangen? Keiner.',
    belegId: 'isa4211',
  },
  {
    tier: 'stone',
    einwand: '„Baca heißt ‚Weinen/Balsambäume‘, nicht Mekka."',
    konter:
      'Selbst bei „Balsambäume": Mekka ist berühmt für Balsambäume. Aber Ps 84 verbindet Baca mit Pilgerfahrt — das ist der Hadsch. Und Quran 3,96: „Das erste Haus für die Menschen ist das in Bakkah." B/M-Wechsel in semitischen Dialekten ist belegt (Hieronymus: „m und b werden in orientalischen Dialekten oft vertauscht").',
    belegId: 'bacaquelle',
  },
  {
    tier: 'stone',
    einwand: '„Der Knecht in Jesaja 42 ist Cyrus / Israel / Jesaja selbst."',
    konter:
      'Alle scheitern an Kedar/Sela: Cyrus betrat Arabien nie (die Halbinsel wurde nie von einem Fremdreich erobert). Jesaja nennt sich sonst beim Namen (Jes 20,2) — hier Zukunftsform. Israel kann nicht „Licht für Israel" sein. Die schiere Verwirrung der Kommentatoren (vier widersprüchliche Kandidaten) zeigt: alle falsch.',
    belegId: 'knechtquellen',
  },
]

// ===========================================================================
// GELEHRTEN-EBENE — 3.1 to 3.4 (SPEC lines 475–538)
// ===========================================================================
export const arabienScholar: ScholarItem[] = [
  // ---------------------------- 3.1 — Deuteronomium 33 ----------------------------
  {
    tier: 'stone',
    h: '3.1 — Deut 33: Geografie der drei Orte',
    body: 'Sinai = Mose, Empfang der Tora. Seir = Palästina (Berg Seir im Königreich Edom; „das Bergland der Edomiter östlich des Sinai") → Jesus; selbst der Midrasch verbindet Edom mit dem Messias. Paran = Westarabien (Hidschaz): das Buch der Jubiläen lokalisiert Paran in der Region, die als umgekehrtes L zur arabischen Wüste hin liegt — exakt der Hidschaz; Ismael ließ sich in Paran nieder (1. Mose 21,21).',
  },
  {
    tier: 'stone',
    h: '3.1 — Die Strahlen-Progression',
    body: 'Drei Verben wachsender Helligkeit: „kam" (bāʾ, Sinai) → „ging auf" (zāraḥ, wie Sonnenaufgang, Seir) → „strahlte hervor" (hôfîaʿ, blendend hell, Paran). Wie Morgendämmerung → Sonnenaufgang → Sonne im Zenit. Der Höhepunkt liegt bei Paran = letzte, hellste Offenbarung = Quran — nicht am Sinai, wie es eine Exodus-Route verlangte.',
  },
  {
    tier: 'stone',
    h: '3.1 — Sieben Beweise gegen die „Exodus-Route"',
    body: '(1) Chronologie falsch (Numeri: Paran vor Seir). (2) Strahl-Höhepunkt bei Paran, nicht Sinai (widerspricht jüd. Theologie). (3) Habakuk 3,3 wiederholt die Prophezeiung in Zukunftsform: „Gott wird von Teman kommen, der Heilige vom Berg Paran" — Teman = Seir (1. Mose 36,11; Jamieson-Fausset-Brown), Sinai fehlt → Barnes: Auslassung weist auf einen Gesetzgeber wie Mose (5. Mose 18,15-18). (4) Qumran deutete Deut 33 als Zukunftsprophezeiung (Priester-Messias). (5) Vers 33,3 spricht von „den Völkern" (am-mim, Plural = Nationen) → universale Sendung. (6) Pronomen „ihnen" (Seir/Paran) vs. „du/euch" (Israel sonst). (7) Präposition „von" (me) bei jedem Ort — Ursprungsort der Offenbarung, nicht „zu" (physischer Besuch); selbst Rabbeinu Bahya findet „von Sinai" statt „an Sinai" hochproblematisch.',
  },
  {
    tier: 'stone',
    h: '3.1 — Die 10.000 + das feurige Gesetz',
    body: 'rᵉvāvāh = strikt „zehntausend" (Gesenius); 33,17 unterscheidet grammatikalisch „zehntausend" (V. 2) von „Zehntausende" (V. 17). Erfüllung: Eroberung Mekkas mit exakt 10.000 Mann (Augenzeugen Ibn ʿAbbās und Anas ibn Mālik); die abweichende Zahl 12.000 entstand durch Verwechslung mit Ḥunayn zwei Wochen später (10.000 + 2.000 Mekkaner). Bei unbestimmter Lesart „Zehntausende": Abschiedswallfahrt vor 100.000 Gläubigen. „Feuriges Gesetz" = Quran; Textvarianten: MT „feuriges Gesetz", LXX „Engel", DSS „feuriges Gesetz", SP „Aufleuchten" — Mehrheit 3 von 4 = Gesetz. Selbst bei „Engel": Quran 3,124 — Gott sandte 3.000 Engel bei Badr.',
  },
  // ---------------------------- 3.2 — Jesaja 42 ----------------------------
  {
    tier: 'stone',
    h: '3.2 — Jes 42: Kedar und Sela (Doppel-Koordinate)',
    body: 'Kedar = zweiter Sohn Ismaels (1. Mose 25,13); Sammelbegriff für die arabischen Wüstenstämme Westarabiens. Quraisch (Stamm des Propheten ﷺ) lebten in Mekka, dem Land Kedars. Sela = hebr. „zerklüfteter Fels": als Gattungsname → Mekka (von felsigen Bergen umgeben), als Eigenname → Berg Sela in Medina (neben der Prophetenmoschee) — beide Lesarten zeigen auf Muhammad ﷺ. Bethlehem-Prinzip: Wie „Bet Lehem" (Haus des Brotes) als Eigenname nur einen Ort meint, fixiert Sela im Kontext Kedars Mekka/Medina.',
  },
  {
    tier: 'stone',
    h: '3.2 — Die Reaktion und das neue Gesetz',
    body: '„Sela soll jauchzen, von Berggipfeln rufen" → Mekka: Pilger singen labbayka Allāhumma labbayk von den Bergen beim Hadsch; Medina: bei Muhammads ﷺ Ankunft jubelten die Bewohner („Hier ist der Gesandte Gottes!", bezeugte Anas). Niemand sonst wurde so von Medina empfangen. „Inseln hoffen auf seine torah" (42,4) — ein neues Gesetz (Zukunftsform, nicht Moses bereits existierende Tora); NIV Study Bible: „Der Knecht wird ein neuer Moses sein" (vgl. 5. Mose 18,15-18) → direkte Verbindung zu Siegel II. „Gerechtigkeit zu den Nationen" — mishpāṭ; Prof. Christopher North: im Sinn des islamischen dīn, das Glaube und Praxis umfasst. „Er wird nicht schreien noch seine Stimme auf der Gasse erheben" (42,2) — exakt Muhammads ﷺ Wesen. „Götzendienst beschämt zurückgewendet" — der Islam befreite Arabien vom Götzendienst.',
  },
  {
    tier: 'marble',
    h: '3.2 — Der Name des Knechts (etmokh → etmokhah)',
    body: 'MT: etmokh („den ich stütze"). Große Jesaja-Rolle (1QIsaᵃ, älteste Handschrift): etmokhah — durch Hinzufügung der Buchstaben Waw + He. Diese Konsonanten erlauben eine Lesung, die phonetisch an Aḥmad/Muhammad anklingt. Linguistisch suggestiv, aber bestreitbar — als Indiz führen, nicht als harten Namens-Beweis; der harte Namens-Beweis kommt in Siegel IV (Machamaddim).',
  },
  {
    tier: 'stone',
    h: '3.2 — Alle Alternativ-Kandidaten widerlegt',
    body: 'Cyrus: starb in der Schlacht (Beckwith), betrat Arabien nie, keine Verbindung zu Mekka/Medina. Jesaja selbst: Zukunftsform, nennt sich sonst beim Namen (Jes 20,2). Israel: kann nicht „Licht für Israel" sein. Saadia Gaon hielt Cyrus (einen Heiden!) für den Knecht → beweist: selbst klassische jüdische Gelehrte akzeptierten einen nicht-israelitischen Knecht. Die Verwirrung der Kommentatoren (vier widersprüchliche Kandidaten) zeigt: alle falsch.',
  },
  // ---------------------------- 3.3 — Jesaja 21 ----------------------------
  {
    tier: 'stone',
    h: '3.3 — Jes 21: Die Flucht nach Tema (Verbindungsglied)',
    body: 'Jesaja 21,13-15: Karawanen im arabischen Buschland; „bringt Wasser den Durstigen … sie fliehen vor dem gezückten Schwert." Tema = Oase in Nordwestarabien (archäologisch belegt, Besiedlung vor 3000 v. Chr.), bekannt für Wasser und Gastfreundschaft. Warum Tema auffordern, Wasser zu geben, was es ohnehin tut? → Hinweis: diese Flüchtlinge sind bedeutend. Erfüllung: die Hidschra — verfolgte Muslime fliehen aus Mekka „vor dem Schwert", empfangen in Medina. „Innerhalb eines Jahres endet die Herrlichkeit Kedars" (21,16) → die Schlacht von Badr 624. Jesaja 21 nennt zusammen mit Jesaja 42 (Kedar, Sela), Deut 33 (Paran) und Habakuk 3 (Teman/Paran) dasselbe geografische Cluster — ein vernetztes Prophezeiungsnetz.',
  },
  // ---------------------------- 3.4 — Psalm 84 ----------------------------
  {
    tier: 'stone',
    h: '3.4 — Ps 84: Pilgerfahrt im Tal Baca',
    body: '„Tal Baca" — einer der schwierigsten Verse der Psalmen (Barnes). Verbunden mit Pilgerfahrt → Hadsch. Baca = Bakkah = Mekka: Quran 3,96; B/M-Wechsel in semitischen Dialekten belegt (Hieronymus; Eusebius zu Dibon/Dimon). „Der Herbstregen bedeckt es mit Segen" — mowreh („Regen") = auch „Lehrer", im Plural sogar „Prophet" (Gesenius, Jes 30,20); berakah („Pools") = „Segen" (identisch mit arab. baraka) → Übersetzung: „Der Lehrer ist erfüllt mit Segen."',
  },
  {
    tier: 'stone',
    h: '3.4 — Der „Gesetzgeber" der alten Versionen',
    body: 'LXX, Aramäische Bibel und Syrische Peschitta lesen ausdrücklich „Gesetzgeber" (gr. nomotheteō): „der Gesetzgeber wird Segen gewähren." → Drei alte Versionen nennen einen Gesetzgeber im Tal Baca; Verbindung zu Jes 42,4 (neue torah). „Von Kraft zu Kraft" (84,7) → rascher Aufstieg des Islams; „erscheinen vor Zion" → Befreiung Jerusalems durch frühe Muslime. „Besser ein Tag in deinen Vorhöfen als tausend anderswo" (84,10) → Muhammad ﷺ: „Ein Gebet in meiner Moschee ist besser als 1.000 anderswo, außer der Heiligen Moschee — und ein Gebet dort ist besser als 100.000."',
  },
]

// ===========================================================================
// VERNETZUNG — the net closes (SPEC lines 580–586)
// ===========================================================================
export const arabienVernetzung = [
  {
    ziel: 'Siegel II — Prophet wie Mose',
    text: '„Feuriges Gesetz" (Deut 33) + „Inseln hoffen auf seine torah" (Jes 42) + „Gesetzgeber" (Ps 84, LXX) = der Gesetzgeber-Prophet wie Mose. Habakuk 3,3 zitiert Barnes direkt auf 5. Mose 18,15-18.',
  },
  {
    ziel: 'Siegel I — Abrahams Nachkommen',
    text: 'Kedar = Sohn Ismaels (1. Mose 25,13) → die arabische Linie des „großen Volkes", die Siegel I belegt, wird zum Schauplatz der Prophezeiung.',
  },
  {
    ziel: 'Siegel IV — Machamaddim',
    text: 'Das etmokhah-Indiz hier (1QIsaᵃ, klingt nach Aḥmad) wird in Siegel IV zum harten Namens-Beweis (Machamaddim) ausgebaut.',
  },
  {
    ziel: 'Siegel VII — Jüdische Erwartung',
    text: 'Jesaja 21 (Flucht nach Tema/Medina) leitet direkt zur Ansiedlung jüdischer Stämme in Medina über — die jüdische Erwartung eines Propheten in Arabien.',
  },
  {
    ziel: 'Akkumulativ',
    text: 'Ein einzelner Ortsname könnte Zufall sein. Fünf Eigennamen, in vier Büchern, alle in einem Wüstenstreifen, alle mit denselben Begleitmerkmalen (Gesetzgeber, Pilgerfahrt, 10.000, Jubel, Licht für die Heiden) — das macht den Zufall mathematisch unmöglich.',
  },
]

export const arabienGleicheMassstaebe =
  'Der Kritiker akzeptiert vage messianische Geografie für Jesus (Bethlehem aus Micha, oft umgedeutet) — verlangt aber für Muhammad ﷺ Unmögliches, obwohl die Bibel hier fünf Eigennamen liefert, alle in Westarabien, alle in vier unabhängigen Büchern, alle verbunden mit Gesetzgeber + Pilgerfahrt + 10.000. Cyrus betrat Arabien nie; kein israelitischer Prophet wurde je in Kedar oder Sela bejubelt. Auf gleichen Maßstäben gibt es exakt einen Erfüller: Muhammad ﷺ aus Mekka.'
