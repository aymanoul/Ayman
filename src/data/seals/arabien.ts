import type { Beleg } from '../types'

// ---------------------------------------------------------------------------
// SIEGEL III — Arabische Prophezeiungen (فاران · Paran). The Hebrew prophets
// name the place of the final shining: Paran (where Ishmael settled), Kedar
// (the Arab people), Teman, and Bakkah/Baca (Mecca). Deut 33,2 sets three
// mountains — Sinai · Seir · Paran — with an escalating verb (came · dawned ·
// blazed forth). Isaiah 42 calls a new song and a new law up from Kedar and
// Sela. Psalm 84's Valley of Baca is the Quran's Bakkah. The geography is
// explicit and checkable. Full verse / source texts live on Beleg records.
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
  'Die hebräischen Propheten benennen den Ort der letzten Offenbarung — und es ist nicht Jerusalem. „Der HERR kam vom Sinai, ging auf von Seir, strahlte hervor vom Berg Paran" (5. Mose 33,2): drei Berge, ein steigendes Licht — Mose, dann die Linie nach Seir, zuletzt Paran, Ismaels Wohnort (1. Mose 21,21). Jesaja ruft „ein neues Lied" und eine Weisung für die Völker herauf aus Kedar und Sela — arabisches Land. Und das „Tal Baka" des Psalmisten ist die „Bakka" des Korans: Mekka. Die Schrift zeigt nach Süden, nach Arabien.'

export const arabienSteps: Step[] = [
  {
    n: 'I',
    h: 'Drei Aufstrahlungen',
    body: '5. Mose 33,2 nennt drei Berge mit steigendem Verb: Gott „kam" (bāʾ) vom Sinai, „ging auf" (zāraḥ) von Seir, „strahlte hervor" (hôfīaʿ) vom Berg Paran. Das Licht wird heller, je weiter es nach Süden zieht — und endet über Paran.',
  },
  {
    n: 'II',
    h: 'Paran ist Ismaels Land',
    body: '„Er [Ismael] wohnte in der Wüste Paran" (1. Mose 21,21). Habakuk 3,3 wiederholt es: „Gott kommt von Teman, der Heilige vom Berg Paran." Der dritte, hellste Aufgang steht über dem Wohnort der Söhne Ismaels — über Arabien, nicht über Israel.',
  },
  {
    n: 'III',
    h: 'Ein neues Lied aus Kedar',
    body: 'Jesaja 42 ruft „ein neues Lied" und seinen Lobpreis „vom Ende der Erde" herauf — aus den Dörfern Kedars und den Felsen Selas. Der Knecht trägt das Recht zu den Völkern, „und auf seine Weisung (tôrāh) warten die Inseln". Ein neues Gesetz, das aus arabischem Land aufsteigt.',
  },
  {
    n: 'IV',
    h: 'Das Tal Baka = Bakka',
    body: 'Psalm 84 segnet die, die „durch das Tal Baka ziehen" und es „zum Quellort machen". Der Koran nennt Mekka beim selben Namen: „das erste Haus … in Bakka" (3,96). Ein wasserloses Tal, zur Quelle gemacht (Zamzam), Ziel der Pilger — die Schrift kennt den Ort beim Namen.',
  },
]

export const arabienBelege: Record<string, Beleg> = {
  // ---- The three shinings ----
  deut332: {
    typ: 'bibel',
    kurz: 'Der HERR kam vom Sinai, ging auf von Seir, strahlte hervor vom Berg Paran.',
    original:
      'יְהוָה מִסִּינַי בָּא וְזָרַח מִשֵּׂעִיר לָמוֹ הוֹפִיעַ מֵהַר פָּארָן וְאָתָה מֵרִבְבֹת קֹדֶשׁ מִימִינוֹ אֵשׁ דָּת לָמוֹ',
    sprache: 'he',
    translit:
      'YHWH mi-Sînay bāʾ, wᵉ-zāraḥ mi-Śēʿîr lāmô, hôfîaʿ mē-har Pārān, wᵉ-ʾātāh mē-rivᵉvōt qōdeš, mî-mînô ʾēš dāt lāmô',
    uebersetzung:
      '„Der HERR kam vom Sinai und ging ihnen auf von Seir; er strahlte hervor vom Berg Paran und kam von Zehntausenden Heiliger; zu seiner Rechten ein flammendes Gesetz für sie." — Drei Berge, ein steigendes Verb, ein „feuriges Gesetz" (ēsh dāt).',
    fundstelle: '5. Mose (Deuteronomium) 33,2',
    status: 'Strong H6290 · Pārān = Paran',
    kern: 'מֵהַר פָּארָן',
  },

  // ---- Habakkuk: God from Teman and Paran ----
  hab33: {
    typ: 'bibel',
    kurz: 'Gott kommt von Teman, der Heilige vom Berg Paran — sein Lob füllt die Erde.',
    original:
      'אֱלוֹהַ מִתֵּימָן יָבוֹא וְקָדוֹשׁ מֵהַר פָּארָן סֶלָה כִּסָּה שָׁמַיִם הוֹדוֹ וּתְהִלָּתוֹ מָלְאָה הָאָרֶץ',
    sprache: 'he',
    translit:
      'ʾĕlôah mi-Têmān yāvôʾ, wᵉ-qādôš mē-har Pārān. selāh. kissāh šāmayim hôdô, û-tᵉhillātô mālᵉʾāh hā-ʾāreṣ',
    uebersetzung:
      '„Gott kommt von Teman und der Heilige vom Berg Paran. Sela. Seine Hoheit bedeckt die Himmel, und seines Lobes (tᵉhillāh) ist die Erde voll." — Ein zweiter Zeuge für denselben Berg; und „sein Lob" trägt die Wurzel, die der Name Aḥmad wiedergibt.',
    fundstelle: 'Habakuk 3,3',
    kern: 'תְּהִלָּתוֹ',
  },

  // ---- Ishmael settles in Paran ----
  gen2121: {
    typ: 'bibel',
    kurz: 'Und er [Ismael] wohnte in der Wüste Paran.',
    original: 'וַיֵּשֶׁב בְּמִדְבַּר פָּארָן וַתִּקַּח לוֹ אִמּוֹ אִשָּׁה מֵאֶרֶץ מִצְרָיִם',
    sprache: 'he',
    translit: 'wayyēšev bᵉ-midbar Pārān, wattiqqaḥ lô ʾimmô ʾiššāh mē-ʾereṣ Miṣrāyim',
    uebersetzung:
      '„Und er wohnte in der Wüste Paran, und seine Mutter nahm ihm eine Frau aus dem Land Ägypten." — Die Tora selbst verankert Ismael in Paran: dem Ort des dritten Aufgangs.',
    fundstelle: '1. Mose (Genesis) 21,21',
    kern: 'בְּמִדְבַּר פָּארָן',
  },

  // ---- The servant who brings law to the nations ----
  isa421: {
    typ: 'bibel',
    kurz: 'Mein Knecht trägt das Recht zu den Völkern — auf seine Weisung warten die Inseln.',
    original:
      'הֵן עַבְדִּי אֶתְמָךְ בּוֹ בְּחִירִי רָצְתָה נַפְשִׁי נָתַתִּי רוּחִי עָלָיו מִשְׁפָּט לַגּוֹיִם יוֹצִיא',
    sprache: 'he',
    translit:
      'hēn ʿavdî ʾetmāk bô, bᵉḥîrî rāṣᵉtāh nafšî, nātattî rûḥî ʿālāyw, mišpāṭ la-gôyim yôṣîʾ',
    uebersetzung:
      '„Siehe, mein Knecht, den ich stütze, mein Erwählter, an dem meine Seele Wohlgefallen hat: Ich habe meinen Geist auf ihn gelegt; er wird das Recht zu den Völkern hinaustragen." Weiter (V. 2-4): „Er wird nicht schreien … und auf seine Weisung (tôrāh) warten die Inseln."',
    fundstelle: 'Jesaja 42,1-4',
    kern: 'מִשְׁפָּט לַגּוֹיִם',
  },

  // ---- New song from Kedar and Sela ----
  isa4210: {
    typ: 'bibel',
    kurz: 'Singt dem HERRN ein neues Lied — jubeln sollen die Dörfer Kedars, die Bewohner Selas.',
    original:
      'שִׁירוּ לַיהוָה שִׁיר חָדָשׁ תְּהִלָּתוֹ מִקְצֵה הָאָרֶץ יִשְׂאוּ מִדְבָּר וְעָרָיו חֲצֵרִים תֵּשֵׁב קֵדָר יָרֹנּוּ יֹשְׁבֵי סֶלַע',
    sprache: 'he',
    translit:
      'šîrû la-YHWH šîr ḥādāš, tᵉhillātô mi-qᵉṣēh hā-ʾāreṣ … yiśʾû midbār wᵉ-ʿārāyw, ḥăṣērîm tēšēv Qēdār, yārōnnû yōšᵉvê Selaʿ',
    uebersetzung:
      '„Singt dem HERRN ein neues Lied, seinen Lobpreis vom Ende der Erde! … Die Wüste und ihre Städte sollen sich erheben, die Dörfer, wo Kedar wohnt; jubeln sollen die Bewohner von Sela, vom Gipfel der Berge sollen sie rufen." — Das neue Lied steigt aus Kedars Land.',
    fundstelle: 'Jesaja 42,10-11',
    kern: 'תֵּשֵׁב קֵדָר',
  },

  // ---- The valley of Baca ----
  ps846: {
    typ: 'bibel',
    kurz: 'Wenn sie durch das Tal Baka ziehen, machen sie es zu einem Quellort.',
    original: 'עֹבְרֵי בְּעֵמֶק הַבָּכָא מַעְיָן יְשִׁיתוּהוּ גַּם בְּרָכוֹת יַעְטֶה מוֹרֶה',
    sprache: 'he',
    translit: 'ʿōvᵉrê bᵉ-ʿēmeq ha-Bākāʾ maʿyān yᵉšîtûhû, gam bᵉrāḵôt yaʿṭeh môreh',
    uebersetzung:
      '„Die durch das Tal Baka (ha-Bākāʾ) ziehen, machen es zu einem Quellort; auch mit Segen bedeckt es der Frühregen." — Ein wasserloses Tal, das die Pilger zur Quelle machen. Der Koran nennt Mekka „Bakka".',
    fundstelle: 'Psalm 84,7 (dt. 84,6)',
    kern: 'עֵמֶק הַבָּכָא',
  },

  // ---- The flocks of Kedar on the altar ----
  isa607: {
    typ: 'bibel',
    kurz: 'Alle Herden Kedars sammeln sich zu dir, die Widder Nebajots dienen dir — auf meinem Altar.',
    original:
      'כָּל צֹאן קֵדָר יִקָּבְצוּ לָךְ אֵילֵי נְבָיוֹת יְשָׁרְתוּנֶךְ יַעֲלוּ עַל רָצוֹן מִזְבְּחִי וּבֵית תִּפְאַרְתִּי אֲפָאֵר',
    sprache: 'he',
    translit:
      'kol ṣōʾn Qēdār yiqqāvᵉṣû lāk, ʾêlê Nᵉvāyôt yᵉšārᵉtûnek; yaʿălû ʿal rāṣôn mizbᵉḥî, û-vêt tifʾartî ʾăfāʾēr',
    uebersetzung:
      '„Alle Herden Kedars sammeln sich zu dir, die Widder Nebajots dienen dir; sie steigen wohlgefällig auf meinen Altar, und ich verherrliche mein herrliches Haus." — Kedar und Nebajot, Ismaels erste zwei Söhne, im Dienst am Hause Gottes.',
    fundstelle: 'Jesaja 60,7',
    kern: 'צֹאן קֵדָר',
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
      '„Wahrlich, das erste Haus, das für die Menschen errichtet wurde, ist das in Bakka — als ein gesegnetes und als Rechtleitung für die Welten." — Der Koran nennt Mekka „Bakka": denselben Namen wie das Tal Baka des Psalms.',
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
      '„Und rufe unter den Menschen zur Pilgerfahrt auf: Sie werden zu dir kommen, zu Fuß und auf jedem hageren Kamel, aus jedem tiefen Talweg." — Die Pilger, die das Tal zur Quelle machen (Ps 84,7).',
    fundstelle: 'Sure 22 (al-Ḥajj), Vers 27',
    kern: 'بِالْحَجِّ',
  },

  // ---- Source: the midrash links Seir to Esau, Paran to Ishmael ----
  midrasch: {
    typ: 'quelle',
    kurz: 'Jüdische Tradition selbst: Gott bot die Tora Seir (Esau) und Paran (Ismael) an.',
    uebersetzung:
      'Der Midrasch (Sifre Devarim 343; Pesiqta de-Rav Kahana; vgl. Talmud, ʿAvoda Zara 2b) deutet die drei Orte von 5. Mose 33,2 als drei Völker: Gott „erschien" von Seir, dem Land Esaus/Edoms, und von Paran, dem Land Ismaels, ehe er sich Israel am Sinai zuwandte. Damit verbindet die rabbinische Tradition selbst Seir mit Esau und Paran mit Ismael — genau die Brudernationen aus Siegel I und II.',
    fundstelle: 'Sifre Devarim 343 · Pesiqta de-Rav Kahana · b. ʿAvoda Zara 2b',
  },

  // ---- Source: the geography of Paran ----
  parangeo: {
    typ: 'quelle',
    kurz: 'Paran liegt in der nordwestarabischen Wüste — dem Hedschas, Ismaels Siedlungsraum.',
    uebersetzung:
      'Die „Wüste Paran" (midbar Pārān) erstreckt sich von der Sinai-Halbinsel südostwärts in den nordwestarabischen Hedschas. Eusebius (Onomastikon) lokalisiert Pharan östlich von Aila (ʿAqaba), tief in Arabien. 1. Mose 25,18 beschreibt Ismaels Nachkommen als wohnend „von Hawila bis Schur … in Richtung Assyrien" — quer über die arabische Halbinsel. Paran ist nicht Israel, sondern das Land der Söhne Ismaels.',
    fundstelle: 'Eusebius, Onomastikon · vgl. 1. Mose 25,18 · 21,21',
  },
}

// ---- The three shinings (centre-piece exhibit) ------------------------------
export const dreiAufstrahlungen = {
  intro:
    '5. Mose 33,2 zeichnet das Licht Gottes in drei Stufen — drei Berge, drei Völker, ein steigendes Verb. Das Hebräische wird heller: kommen, aufgehen, hervorstrahlen.',
  berge: [
    {
      ort: 'Sinai',
      verb: 'kam',
      verbHe: 'בָּא · bāʾ',
      figur: 'Mose',
      volk: 'Israel',
      schrift: 'die Tora',
      hl: false,
    },
    {
      ort: 'Seir',
      verb: 'ging auf',
      verbHe: 'זָרַח · zāraḥ',
      figur: 'die Linie nach Seir/Edom',
      volk: 'die Völker im Norden',
      schrift: 'das Evangelium',
      hl: false,
    },
    {
      ort: 'Paran',
      verb: 'strahlte hervor',
      verbHe: 'הוֹפִיעַ · hôfîaʿ',
      figur: 'der Prophet aus Ismaels Land',
      volk: 'Arabien',
      schrift: 'der Koran',
      hl: true,
    },
  ],
  pointe:
    'Das hellste Verb — hôfîaʿ, „hervorstrahlen wie die volle Sonne" — steht über Paran, dem Wohnort Ismaels (1. Mose 21,21). Und „zu seiner Rechten ein feuriges Gesetz" (ēsh dāt): eine neue Offenbarung.',
}

// ---- The geographic schema (built as inline SVG) ----------------------------
export const arabienKarte = {
  intro:
    'Die Namen stehen im hebräischen Text — und sie zeigen nach Süden. Von Sinai über Paran bis Bakka zieht das Licht in Ismaels Land hinein.',
  // coordinates in a 0–100 × 0–120 viewBox (north up)
  punkte: [
    { id: 'sinai', label: 'Sinai', sub: 'Mose · Tora', x: 26, y: 22, tone: 'muted' as const },
    { id: 'seir', label: 'Seir · Teman', sub: 'der zweite Aufgang', x: 66, y: 18, tone: 'muted' as const },
    { id: 'paran', label: 'Wüste Paran', sub: 'Ismaels Wohnort · 1. Mose 21,21', x: 47, y: 54, tone: 'green' as const },
    { id: 'kedar', label: 'Kedar', sub: 'die arabischen Stämme', x: 78, y: 64, tone: 'brass' as const },
    { id: 'mekka', label: 'Bakka · Mekka', sub: 'das erste Haus · Koran 3,96', x: 54, y: 99, tone: 'green' as const },
  ],
  // the descending shining: sinai → paran → mekka
  pfad: ['sinai', 'paran', 'mekka'],
  pointe:
    'Paran, Kedar, Teman, Baka — vier Namen aus der hebräischen Bibel, alle in Arabien. Die Linie der Offenbarung läuft von Norden nach Süden, weg von Israel, hin zum Haus in Bakka.',
}

// ---- Baca = Bakkah bridge ---------------------------------------------------
export const bacaBruecke = {
  intro: 'Ein Tal, zwei Schriften, ein Name. Das hebräische „Baka" und das koranische „Bakka" bezeichnen denselben Ort.',
  links: {
    titel: 'Psalm 84,7',
    wort: 'בָּכָא',
    trans: 'Bākāʾ',
    sinn: '„das Tal Baka" — wasserlos, von Pilgern zur Quelle gemacht',
  },
  rechts: {
    titel: 'Koran 3,96',
    wort: 'بَكَّة',
    trans: 'Bakka',
    sinn: '„das erste Haus … in Bakka" — Mekka, gesegnet für alle Welten',
  },
  parallelen: [
    { merkmal: 'Wasserloses Tal', text: 'Mekka liegt in einem „Tal ohne Ackerland" (Koran 14,37) — kein Wasser, kein Anbau.' },
    { merkmal: 'Zur Quelle gemacht', text: 'Die Pilger machen es „zum Quellort" (Ps 84,7) — die Quelle Zamzam sprudelt bis heute.' },
    { merkmal: 'Ziel der Pilger', text: '„Sie ziehen hindurch" (Ps 84,7) ↔ „rufe zur Pilgerfahrt auf" (Koran 22,27) — der Ḥaddsch.' },
    { merkmal: 'Von Kraft zu Kraft', text: '„Sie gehen von Kraft zu Kraft" (Ps 84,8) — die Karawanen der Pilger nach Mekka.' },
  ],
  pointe:
    'Derselbe Konsonantenstamm, dasselbe wasserlose Tal, dieselbe Pilgerschaft. Baka ist Bakka — und Bakka ist Mekka.',
}

export const arabienKonter: KonterItem[] = [
  {
    tier: 'stone',
    einwand: '„Paran liegt auf der Sinai-Halbinsel, nicht in Arabien — der Bezug zu Mekka ist konstruiert."',
    konter:
      'Wo immer man Paran eng verortet — die Tora selbst macht es zu Ismaels Land: „Er wohnte in der Wüste Paran" (1. Mose 21,21), und seine Nachkommen siedeln „von Hawila bis Schur … in Richtung Assyrien" (25,18), quer über Arabien. Eusebius setzt Pharan tief in die arabische Wüste östlich von ʿAqaba. Der dritte Aufgang steht über Ismaels Gebiet, nicht über Juda.',
    belegId: 'gen2121',
  },
  {
    tier: 'stone',
    einwand: '„5. Mose 33,2 beschreibt nur die eine Sinai-Offenbarung an Israel — alle drei Orte gehören dazu."',
    konter:
      'Der Vers nennt drei verschiedene Berge mit drei verschiedenen, sich steigernden Verben (kam · ging auf · strahlte hervor), und Habakuk 3,3 wiederholt Teman und Paran als eigene Erscheinung. Entscheidend: der jüdische Midrasch selbst (Sifre 343; ʿAvoda Zara 2b) liest Seir als Esau und Paran als Ismael — Gott wandte sich erst den Brudernationen zu. Die drei Orte sind drei Völker.',
    belegId: 'midrasch',
  },
  {
    tier: 'stone',
    einwand: '„Das ‚neue Lied‘ (Jes 42) meint neue Lobpsalmen, keine neue Offenbarung."',
    konter:
      'Der Knecht des Liedes „trägt das Recht (mishpāṭ) zu den Völkern", und „auf seine Weisung (tôrāh) warten die Inseln" (42,1.4) — das ist ein Gesetz, kein Gesang. Und es steigt namentlich „aus den Dörfern Kedars" und „den Felsen Selas" (42,11) auf, arabischem Land. Ein neues Gesetz vom Ende der Erde, aus Kedar.',
    belegId: 'isa421',
  },
  {
    tier: 'stone',
    einwand: '„Kedar ist bloß ein altes Beduinenvolk — kein Bezug zu Muhammad."',
    konter:
      'Kedar ist der biblische Name der Araber (Siegel I: Jes 21,16; Ps 120,5), Ismaels zweiter Sohn. Jesaja 60,7 bringt „die Herden Kedars" und „die Widder Nebajots" — Ismaels erste zwei Söhne — „wohlgefällig auf meinen Altar"; Gott „verherrlicht sein Haus". Arabische Anbetung am Hause Gottes, von den Propheten vorhergesagt.',
    belegId: 'isa607',
  },
  {
    tier: 'stone',
    einwand: '„Baka ist nicht Mekka — es ist ein Tal bei Jerusalem auf dem Weg zum Tempel."',
    konter:
      'Der Konsonantenstamm ist identisch (B-K-ʾ), der Koran nennt Mekka ausdrücklich „Bakka" (3,96), und die Beschreibung passt genau: ein wasserloses Tal (vgl. Koran 14,37: „ohne Ackerland"), von den Pilgern „zum Quellort" gemacht (Ps 84,7) — die Quelle Zamzam —, Ziel einer Pilgerschaft, „von Kraft zu Kraft" (84,8). Kein Tal bei Jerusalem trägt diesen Namen oder diese Züge.',
    belegId: 'q396',
  },
  {
    tier: 'stone',
    einwand: '„Du liest arabische Orte in hebräische Verse hinein."',
    konter:
      'Die Namen stehen im hebräischen Konsonantentext selbst: Paran (פָּארָן), Kedar (קֵדָר), Teman (תֵּימָן), Baka (בָּכָא). Wir tragen nichts ein — wir lesen, was dort steht. Und der geografische Anker ist die Tora selbst: Ismael in Paran (21,21), seine Söhne über ganz Arabien (25,18). Die Schrift nennt die Orte beim Namen.',
  },
  {
    tier: 'marble',
    einwand: '„Habakuk 3 ist ein Gebet, keine Zukunftsprophetie über einen Ort."',
    konter:
      'Es ist eine prophetische Schau (Gebet im Modus der Theophanie), deren Bildsprache 5. Mose 33 spiegelt: der Heilige, der von Paran „hervorstrahlt", dessen „Lob (tᵉhillāh) die Erde füllt". Zwei Zeugen, ein Berg. Und tᵉhillāh — „Lobpreis" — trägt genau die Wurzel, die der Name Aḥmad / Muhammad („der Gepriesene") wiedergibt.',
    belegId: 'hab33',
  },
]

export const arabienScholar: ScholarItem[] = [
  {
    tier: 'stone',
    h: '3.1 — Die drei Berge und die steigenden Verben',
    body: '5. Mose 33,2 ordnet drei Theophanie-Orte mit drei Verben wachsender Helligkeit: bāʾ („kam", Sinai), zāraḥ („ging auf", wie Sonnenaufgang, Seir), hôfîaʿ („strahlte hervor", blendend hell, Paran). Die Klimax liegt auf Paran. „ēsh dāt" („feuriges Gesetz") zu seiner Rechten signalisiert eine Gesetzes-Offenbarung — nicht bloß eine Erscheinung.',
  },
  {
    tier: 'stone',
    h: '3.2 — Paran ist Ismaels Wüste',
    body: '1. Mose 21,21 setzt Ismael „in die Wüste Paran"; 25,18 beschreibt seine Nachkommen über die ganze Halbinsel „bis in Richtung Assyrien". Eusebius (Onomastikon) lokalisiert Pharan tief in Arabien östlich von Aila. Geografisch wie textlich gehört Paran zu Ismael — und damit der dritte, hellste Aufgang zu Arabien.',
  },
  {
    tier: 'marble',
    h: '3.3 — Der Midrasch: Seir = Esau, Paran = Ismael',
    body: 'Sifre Devarim 343, Pesiqta de-Rav Kahana und b. ʿAvoda Zara 2b deuten die Orte von 33,2 als Völker: Gott bot die Tora den Söhnen Esaus (Seir) und Ismaels (Paran) an. Die rabbinische Tradition selbst verbindet also Paran mit Ismael — ein gegnerischer Zeuge für die These. Nicht Muslime tragen die Deutung ein; sie steht im Midrasch.',
  },
  {
    tier: 'stone',
    h: '3.4 — Jesaja 42: neues Lied, neues Gesetz aus Kedar',
    body: 'Der Knecht (42,1-4) empfängt den Geist, „trägt das Recht (mishpāṭ) zu den Völkern", schreit nicht auf der Gasse, und „die Inseln warten auf seine tôrāh". Das „neue Lied" (42,10) steigt „vom Ende der Erde" auf — aus „den Dörfern Kedars" und „den Bewohnern Selas" (42,11). Ein neues, nicht-davidisches Gesetz aus arabischem Land.',
  },
  {
    tier: 'stone',
    h: '3.5 — Baka = Bakka: Philologie und Ort',
    body: 'Psalm 84,7 nennt das „Tal Baka" (ʿēmeq ha-Bākāʾ): wasserlos, von Pilgern zur Quelle gemacht. Koran 3,96 nennt Mekka „Bakka". Gleicher Konsonantenstamm, gleiches wasserloses Tal (vgl. 14,37), gleiche Quelle (Zamzam), gleiche Pilgerschaft (84,8 „von Kraft zu Kraft" ↔ 22,27 der Ḥaddsch). Die Identifikation ruht auf Wortlaut und Geografie.',
  },
  {
    tier: 'marble',
    h: '3.6 — Kedar und Nebajot am Altar (Jes 60,7)',
    body: 'Jesaja 60,7 sammelt „alle Herden Kedars" und „die Widder Nebajots" — Ismaels erste zwei Söhne (1. Mose 25,13) — als wohlgefälliges Opfer auf Gottes Altar; Gott „verherrlicht sein Haus". Eine Prophetie arabischer Anbetung am Hause Gottes. Zusammen mit Baka/Bakka zeigt sie das Heiligtum, zu dem Ismaels Söhne strömen.',
  },
]

export const arabienVernetzung = [
  { ziel: 'Siegel I — Abrahams Nachkommen', text: 'Kedar und Paran sind Ismaels Sohn und Ismaels Wohnort — die gesegnete Linie, die Siegel I belegt, wird zum Schauplatz.' },
  { ziel: 'Siegel II — Prophet wie Mose', text: 'Der dritte Aufgang steht über „den Brüdern" Israels — dem Land, aus dem der Prophet wie Mose kommt.' },
  { ziel: 'Das Fundament', text: '„Sein Lob füllt die Erde" (Hab 3,3): tᵉhillāh trägt die Wurzel des Namens Aḥmad — der rote Faden Ḥ-M-D.' },
]

export const arabienGleicheMassstaebe =
  'Wer den zweiten Aufgang — „von Seir" — bereitwillig auf das Christentum bezieht, das durch edomitisch-römisches Land kam, der muss den dritten und hellsten Aufgang — „vom Berg Paran" — mit demselben Maß auf Ismaels Land beziehen. Man kann nicht den zweiten Berg für Jesus deuten und den dritten für Muhammad ﷺ verschweigen. Auf gleichen Maßstäben zeigt 5. Mose 33,2 nach Arabien.'
