import type { Beleg } from '../types'

// ---------------------------------------------------------------------------
// SIEGEL IV — Das Hohelied · Maḥamaddīm (محمد). Song of Songs 5,16 crowns the
// description of the beloved: "wᵉ-kullô maḥămaddîm" — "and he is altogether
// desirable." The word is built on Ḥ-M-D ("praise · desire") — the very
// meaning of the name Muhammad ﷺ — and its consonants M-Ḥ-M-D plus the Hebrew
// plural of majesty (-īm) sound out "Muḥammadim." The root the Fundament
// traced (ḥamudot · Daniel; ḥemdat · Haggai) here stands almost as the name.
// Read by the same allegorical rules the synagogue and church apply to this
// very book, the resonance is admissible. We claim a thread, not a sole pillar.
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

export const hoheliedThese =
  'Im Hohelied 5,16 krönt die Braut ihre Beschreibung des Geliebten: „… und alles an ihm ist maḥămaddîm" — „ganz und gar begehrenswert, über alles zu preisen". Das Wort steht auf der Wurzel Ḥ-M-D — „preisen, begehren" —, genau der Bedeutung des Namens Muhammad ﷺ; und seine Konsonanten M-Ḥ-M-D mit dem hebräischen Plural der Hoheit (־ים) klingen wie „Muḥammadim". Dieselbe Wurzel, die das Fundament verfolgte — ḥamudot bei Daniel, ḥemdat bei Haggai —, steht hier fast als der Name selbst. Gelesen nach denselben sinnbildlichen Regeln, die Synagoge und Kirche auf eben dieses Buch anwenden, ist die Resonanz zu genau, um sie zu überhören. Wir behaupten einen Faden — keinen alleinstehenden Pfeiler.'

export const hoheliedSteps: Step[] = [
  {
    n: 'I',
    h: 'Das Wort',
    body: 'Hohelied 5,16 endet die Lobrede auf den Geliebten mit „wᵉ-kullô maḥămaddîm" — „und alles an ihm ist begehrenswert". Das hebräische מַחֲמַדִּים ist die stärkste, vollste Form der Wurzel Ḥ-M-D im ganzen Tanach: Vorsilbe מ + Wurzel ח־מ־ד + Endung ־ים.',
  },
  {
    n: 'II',
    h: 'Die Wurzel = der Name',
    body: 'Ḥ-M-D heißt „preisen, begehren, köstlich sein". Genau das bedeutet der Name Muhammad ﷺ — „der Gepriesene" — und Aḥmad — „der Hochgepriesene". Die arabische Wurzel ḥ-m-d und die hebräische ח־מ־ד sind dieselbe semitische Wurzel. Die Bedeutung des Wortes ist die Bedeutung des Namens.',
  },
  {
    n: 'III',
    h: 'Der Plural der Hoheit',
    body: 'Das ־ים (-īm) ist nicht nur Mehrzahl: Hebräisch bildet damit Hoheit und Steigerung — Elohim („Gott"), adonim („Herr"). M-Ḥ-M-D + ־ים ergibt maḥămaddîm: „der ganz und gar Gepriesene". Der Klang trägt vier Buchstaben des Namens in Folge: M·Ḥ·M·D.',
  },
  {
    n: 'IV',
    h: 'Die gleichen Regeln — ehrlich gewogen',
    body: 'Niemand liest das Hohelied wörtlich: das Targum und Rashi deuten es auf Gott und Israel, Origenes und die Kirche auf Christus und die Gemeinde. Wer es sinnbildlich für sich liest, darf eine prophetische Resonanz nicht wörtlich gegen uns abweisen. Wir beanspruchen nur, was die Regel erlaubt: einen Faden im Seil — neben Daniel, Haggai und dem Anspruch des Korans.',
  },
]

export const hoheliedBelege: Record<string, Beleg> = {
  // ---- The core verse ----
  song516: {
    typ: 'bibel',
    kurz: 'Sein Gaumen ist Süßigkeit, und alles an ihm ist maḥămaddîm — begehrenswert.',
    original:
      'חִכּוֹ מַמְתַקִּים וְכֻלּוֹ מַחֲמַדִּים זֶה דוֹדִי וְזֶה רֵעִי בְּנוֹת יְרוּשָׁלָ͏ִם',
    sprache: 'he',
    translit: 'ḥikkô mamtaqqîm wᵉ-kullô maḥămaddîm, zeh dôdî wᵉ-zeh rēʿî, bᵉnôt Yᵉrûšālāim',
    uebersetzung:
      '„Sein Gaumen ist Süßigkeit, und alles an ihm ist begehrenswert (maḥămaddîm). Das ist mein Geliebter, und das ist mein Freund, ihr Töchter Jerusalems." — Das Lob gipfelt im Wort, das Wurzel und Klang des Namens trägt.',
    fundstelle: 'Hohelied (Schir ha-Schirim) 5,16',
    status: 'Strong H4261 · maḥmad ← Ḥ-M-D',
    kern: 'מַחֲמַדִּים',
  },

  // ---- The beloved: radiant, standard-bearer among ten thousand ----
  song510: {
    typ: 'bibel',
    kurz: 'Mein Geliebter ist strahlend und rot, bannertragend unter Zehntausend.',
    original: 'דּוֹדִי צַח וְאָדוֹם דָּגוּל מֵרְבָבָה',
    sprache: 'he',
    translit: 'dôdî ṣaḥ wᵉ-ʾādôm, dāgûl mē-rᵉvāvāh',
    uebersetzung:
      '„Mein Geliebter ist strahlend und rot, hervorragend (bannertragend) unter Zehntausend (dāgûl mē-rᵉvāvāh)." — Dieselbe „Zehntausend" wie die „Zehntausende Heiliger" von 5. Mose 33,2; mit Zehntausend zog der Prophet ﷺ in Mekka ein.',
    fundstelle: 'Hohelied 5,10',
    kern: 'דָּגוּל מֵרְבָבָה',
  },

  // ---- Daniel: greatly beloved (ḥamudot) ----
  dan923: {
    typ: 'bibel',
    kurz: 'Gabriel zu Daniel: denn du bist ḥamudot — vielgeliebt.',
    original:
      'בִּתְחִלַּת תַּחֲנוּנֶיךָ יָצָא דָבָר וַאֲנִי בָּאתִי לְהַגִּיד כִּי חֲמוּדוֹת אָתָּה',
    sprache: 'he',
    translit: 'bi-tḥillat taḥănûneḵā yāṣāʾ dāvār, wa-ʾănî bāʾtî lᵉhaggîd, kî ḥămûdôt ʾāttāh',
    uebersetzung:
      '„Zu Beginn deines Flehens erging ein Wort, und ich bin gekommen, es zu verkünden, denn du bist vielgeliebt (ḥămûdôt)." — Dieselbe Wurzel Ḥ-M-D, im Mund des Engels Gabriel. Siegel V entfaltet die Stelle.',
    fundstelle: 'Daniel 9,23',
    kern: 'חֲמוּדוֹת',
  },

  // ---- Haggai: the desire of all nations (ḥemdat) ----
  hag27: {
    typ: 'bibel',
    kurz: 'Das Begehrte aller Völker (ḥemdat) wird kommen, und ich fülle dies Haus mit Herrlichkeit.',
    original:
      'וְהִרְעַשְׁתִּי אֶת כָּל הַגּוֹיִם וּבָאוּ חֶמְדַּת כָּל הַגּוֹיִם וּמִלֵּאתִי אֶת הַבַּיִת הַזֶּה כָּבוֹד',
    sprache: 'he',
    translit:
      'wᵉ-hirʿaštî ʾet-kol-ha-gôyim, û-vāʾû ḥemdat kol-ha-gôyim, û-millēʾtî ʾet-ha-bayit ha-zeh kāvôd',
    uebersetzung:
      '„Und ich werde alle Völker erschüttern, und das Begehrte aller Völker (ḥemdat kol ha-gôyim) wird kommen, und ich werde dieses Haus mit Herrlichkeit füllen." — Wieder Ḥ-M-D: „der Ersehnte der Völker".',
    fundstelle: 'Haggai 2,7',
    kern: 'חֶמְדַּת',
  },

  // ---- Quran: Muhammad, messenger of God — described in Torah and Gospel ----
  q4829: {
    typ: 'quran',
    kurz: 'Muhammad ist der Gesandte Gottes — so ihr Gleichnis in der Tora und im Evangelium.',
    original:
      'مُّحَمَّدٌ رَّسُولُ اللَّهِ وَالَّذِينَ مَعَهُ أَشِدَّاءُ عَلَى الْكُفَّارِ رُحَمَاءُ بَيْنَهُمْ ذَٰلِكَ مَثَلُهُمْ فِي التَّوْرَاةِ وَمَثَلُهُمْ فِي الْإِنجِيلِ',
    sprache: 'ar',
    translit:
      'muḥammadun rasūlu llāh, wa-lladhīna maʿahu ashiddāʾu ʿalā l-kuffāri ruḥamāʾu baynahum … dhālika mathaluhum fī t-Tawrāti wa-mathaluhum fī l-Injīl',
    uebersetzung:
      '„Muhammad ist der Gesandte Gottes. Und die mit ihm sind, sind hart gegen die Ungläubigen, barmherzig untereinander … Das ist ihr Gleichnis in der Tora und ihr Gleichnis im Evangelium." — Der Name selbst, und der Verweis auf die früheren Schriften.',
    fundstelle: 'Sure 48 (al-Fatḥ), Vers 29',
    kern: 'مُحَمَّدٌ',
  },

  // ---- Quran: Muhammad is but a messenger ----
  q3144: {
    typ: 'quran',
    kurz: 'Und Muhammad ist nur ein Gesandter; vor ihm sind Gesandte dahingegangen.',
    original: 'وَمَا مُحَمَّدٌ إِلَّا رَسُولٌ قَدْ خَلَتْ مِن قَبْلِهِ الرُّسُلُ',
    sprache: 'ar',
    translit: 'wa-mā muḥammadun illā rasūl, qad khalat min qablihi r-rusul',
    uebersetzung:
      '„Und Muhammad ist nur ein Gesandter; vor ihm sind bereits die Gesandten dahingegangen." — Der Name Muḥammad, „der Gepriesene", im Koran selbst.',
    fundstelle: 'Sure 3 (Āl ʿImrān), Vers 144',
    kern: 'مُحَمَّدٌ',
  },

  // ---- Source: the root Ḥ-M-D ----
  wurzelhmd: {
    typ: 'quelle',
    kurz: 'Ḥ-M-D im Hebräischen wie im Arabischen: begehren, köstlich sein, preisen.',
    uebersetzung:
      'Die Lexika (BDB, Gesenius, HALOT) geben für die hebräische Wurzel ח־מ־ד (ḥ-m-d): „begehren, Gefallen finden, köstlich/kostbar sein"; das mit מ gebildete Substantiv maḥmad bedeutet „Begehrtes, Kostbares". Die arabische Wurzel ḥ-m-d trägt „preisen, loben"; ḥamd = „Lobpreis", muḥammad = „der Gepriesene, Preiswürdige", aḥmad = „der Hochgepriesene". Es ist dieselbe semitische Wurzel — Begehren und Preisen liegen in ihr beieinander.',
    fundstelle: 'BDB · Gesenius · HALOT · Lisān al-ʿArab (ḥ-m-d)',
  },

  // ---- Source: the allegorical reading of the Song ----
  allegorie: {
    typ: 'quelle',
    kurz: 'Niemand liest das Hohelied wörtlich — Targum, Rashi, Origenes lesen es sinnbildlich.',
    uebersetzung:
      'Das Hohelied gilt kanonisch als sinnbildlich. Rabbi Akiva nannte es „das Allerheiligste" der Schriften. Das aramäische Targum liest es als Geschichte der Liebe Gottes zu Israel von Ägypten bis zur messianischen Zeit; Rashi deutet es allegorisch ebenso. Origenes und die Kirchenväter lesen es als Christus und die Gemeinde/Seele. Wenn beide Traditionen dieses Buch nicht-wörtlich lesen, ist eine prophetische Lesart nach denselben Regeln zulässig.',
    fundstelle: 'Mischna Jadajim 3,5 (Akiva) · Targum Schir ha-Schirim · Rashi · Origenes',
  },

  // ---- Source: the plural of majesty/intensity ----
  pluralis: {
    typ: 'quelle',
    kurz: 'Die Endung -īm bildet im Hebräischen auch Hoheit und Steigerung, nicht nur Mehrzahl.',
    uebersetzung:
      'Das Hebräische kennt neben dem Zahl-Plural den „pluralis majestatis / intensivus" (Gesenius §124): Elohim („Gott", grammatisch Plural, gemeint der eine Gott), adonim/adonai („Herr"), sowie Abstrakt- und Steigerungsplurale (ḥayyim „Leben", neʿurim „Jugend"). maḥămaddîm in Hld 5,16 ist ein solcher Steigerungsplural: „über alle Maßen begehrenswert" — und zugleich, dem Klang nach, ein Hoheitsname.',
    fundstelle: 'Gesenius, Hebräische Grammatik §124 (pluralis intensivus / majestatis)',
  },
}

// ---- Exhibit 1: the anatomy of the word maḥamaddīm --------------------------
export const wortAnatomie = {
  wort: 'מַחֲמַדִּים',
  translit: 'maḥămaddîm',
  fundstelle: 'Hohelied 5,16',
  // morpheme chips, shown right-to-left as in Hebrew
  teile: [
    { he: 'מַ', label: 'Präfix מ (mem)', sinn: 'bildet das Substantiv', root: false },
    { he: 'חֲמַדּ', label: 'Wurzel ח־מ־ד', sinn: 'preisen · begehren', root: true },
    { he: 'ִים', label: 'Endung ־ים (-īm)', sinn: 'Plural der Hoheit', root: false },
  ],
  skelett: ['M', 'Ḥ', 'M', 'D'],
  name: { ar: 'مُحَمَّد', trans: 'Muḥammad', sinn: 'der Gepriesene' },
  bedeutung: '„… und er ist ganz und gar begehrenswert, über alles zu preisen."',
  pointe:
    'Ein Wort, drei Bausteine — und im Kern vier Buchstaben in Folge: M·Ḥ·M·D. Bedeutung und Klang fallen mit dem Namen zusammen.',
}

// ---- Exhibit 2: the root Ḥ-M-D across the scriptures ------------------------
export const wurzelThread = {
  root: 'ח · מ · ד  ·  Ḥ-M-D',
  bedeutung: 'preisen · begehren · köstlich sein',
  namen: [
    { ar: 'مُحَمَّد', trans: 'Muḥammad', glanz: '„der Gepriesene / Vielgelobte"' },
    { ar: 'أَحْمَد', trans: 'Aḥmad', glanz: '„der Hochpreisende / Gepriesenste"' },
  ],
  spuren: [
    { heb: 'מַחֲמַדִּים', wort: 'maḥămaddîm', sinn: '„ganz und gar begehrenswert"', stelle: 'Hohelied 5,16', siegel: 'Siegel IV', hl: true },
    { heb: 'חֲמוּדוֹת', wort: 'ḥamudot', sinn: '„vielgeliebt"', stelle: 'Daniel 9,23', siegel: 'Siegel V', hl: false },
    { heb: 'חֶמְדַּת', wort: 'ḥemdat', sinn: '„Begehrtes aller Völker"', stelle: 'Haggai 2,7', siegel: '—', hl: false },
    { heb: 'מַחְמַד', wort: 'maḥmad', sinn: '„das Begehrte (der Augen)"', stelle: 'Hesekiel 24,16', siegel: '—', hl: false },
  ],
  pointe:
    'Eine Wurzel, viele Stellen — und an den hoffnungsvollsten Versen verdichtet sie sich. Im Hohelied steht sie, mit Vorsilbe und Hoheitsplural, dem Namen am nächsten.',
}

// ---- Exhibit 3: the plural of majesty --------------------------------------
export const pluralHoheit = {
  intro:
    'Die Endung ־ים (-īm) ist im Hebräischen nicht nur Mehrzahl. Sie drückt auch Hoheit und Steigerung aus — der eine Gott heißt grammatisch im Plural.',
  beispiele: [
    { he: 'אֱלֹהִים', t: 'Elohim', wort: '„Gott"', sinn: 'grammatisch Plural — gemeint ist der eine Gott', hl: false },
    { he: 'אֲדוֹנִים', t: 'adonim', wort: '„Herr"', sinn: 'Hoheitsplural für einen einzelnen Herrn', hl: false },
    { he: 'מַחֲמַדִּים', t: 'maḥămaddîm', wort: '„der ganz Gepriesene"', sinn: 'Steigerung: über alles begehrenswert', hl: true },
  ],
  pointe:
    'Als Steigerungs- und Hoheitsform gelesen, ist maḥămaddîm kein bloßer Plural von „nett", sondern: „der über alles Gepriesene".',
}

export const hoheliedKonter: KonterItem[] = [
  {
    tier: 'stone',
    einwand: '„maḥămaddîm ist ein gewöhnliches Wort (‚begehrenswert‘), kein Eigenname."',
    konter:
      'Auf der schlichten Ebene stimmt das — und genau diese schlichte Bedeutung IST die Bedeutung des Namens Muhammad ﷺ („der Gepriesene/Begehrte"). Wir behaupten nicht, der Dichter habe bewusst einen Eigennamen geschrieben; wir zeigen, dass das Wort, das die Lobrede krönt, in Wurzel und Klang sein Name ist. Die Bedeutungs-Übereinstimmung allein ist auffällig; die Klang-Übereinstimmung (M-Ḥ-M-D + ־ים) verdoppelt sie.',
    belegId: 'song516',
  },
  {
    tier: 'stone',
    einwand: '„Das ־ים ist die normale Pluralendung — du machst künstlich einen Namen daraus."',
    konter:
      'Das ־ים ist eine Endung — aber das Hebräische bildet damit den Plural der Hoheit und Steigerung: Elohim („Gott"), adonim („Herr"), Steigerungsplurale wie ḥayyim („Leben"). maḥămaddîm „über alle Maßen begehrenswert" ist selbst ein solcher Intensivplural. Als Ehrenform gelesen — „der ganz und gar Gepriesene" — passt die Gestalt genau.',
    belegId: 'pluralis',
  },
  {
    tier: 'stone',
    einwand: '„Das Hohelied ist ein Liebesgedicht zwischen Mann und Frau — keine Prophetie."',
    konter:
      'Nach den Regeln beider Traditionen wird das Hohelied gerade NICHT wörtlich gelesen: Targum und Rashi deuten es auf Gott und Israel, Origenes und die Kirche auf Christus und die Gemeinde. Wenn Allegorie und Typologie die zugelassene Lesart dieses Buches sind, ist eine prophetische Resonanz nach demselben Maßstab zulässig. Man kann es nicht für sich geistlich und gegen uns wörtlich lesen.',
    belegId: 'allegorie',
  },
  {
    tier: 'stone',
    einwand: '„Die Wurzel Ḥ-M-D steht überall — sogar im Gebot ‚du sollst nicht begehren‘. Das beweist nichts."',
    konter:
      'Gewiss ist die Wurzel häufig — das ist das Wesen einer Wurzel. Der Faden lautet nicht „jedes Ḥ-M-D = Muhammad", sondern: die Wurzel bedeutet „preisen/begehren", den exakten Sinn seines Namens, und an messianisch getönten Versen verdichtet sie sich — „das Begehrte der Völker" (Hag 2,7), „vielgeliebt" (Dan 9,23). Im Hohelied steht ihre vollste Form: Vorsilbe + Wurzel + Hoheitsplural.',
    belegId: 'hag27',
  },
  {
    tier: 'stone',
    einwand: '„Die Konsonanten sind M-Ḥ-M-D-Y-M, nicht M-Ḥ-M-D — die Endung verändert das Wort."',
    konter:
      'Das Gerüst des Namens ist Ḥ-M-D; Muhammad = mu-ḥammad, die mit מ gebildete Partizipform „der Gepriesene". Das hebräische maḥmad (מַחְמָד) ist dieselbe מ-Bildung. Mit dem Hoheitsplural ־ים wird daraus maḥămaddîm. Die Kernbuchstaben M·Ḥ·M·D stehen da — in Folge; die Endung fügt die Hoheit hinzu, sie tilgt den Namen nicht.',
    belegId: 'song510',
  },
  {
    tier: 'marble',
    einwand: '„Selbst wenn — ein einziges Wort trägt keine Lehre."',
    konter:
      'Einverstanden — und wir stützen den Fall nicht auf ein Wort. Siegel IV ist ein Faden, kein Pfeiler: es bekräftigt, was die Siegel I–III und V–VI tragen. Für sich allein ist es eine Resonanz; verwoben mit Daniels ḥamudot, Haggais ḥemdat und dem Anspruch des Korans, er sei „der Gepriesene", ist es ein heller Strang im Seil. So, ehrlich gewogen, und nicht mehr.',
  },
]

export const hoheliedScholar: ScholarItem[] = [
  {
    tier: 'stone',
    h: '4.1 — Hld 5,16: das Wort maḥămaddîm',
    body: 'Der Vers schließt die Lobrede der Braut: „ḥikkô mamtaqqîm wᵉ-kullô maḥămaddîm" — „sein Gaumen ist Süße, und alles an ihm ist begehrenswert". מַחֲמַדִּים ist die mit מ gebildete, plural-gesteigerte Form der Wurzel Ḥ-M-D — die vollste Ausprägung dieser Wurzel im Tanach: Vorsilbe מ, Wurzel ח־מ־ד, Endung ־ים.',
  },
  {
    tier: 'stone',
    h: '4.2 — Die Wurzel Ḥ-M-D',
    body: 'Hebr. ḥ-m-d (BDB, Gesenius, HALOT): „begehren, Gefallen finden, köstlich sein"; maḥmad = „Begehrtes, Kostbares". Arab. ḥ-m-d: „preisen"; ḥamd = „Lobpreis", muḥammad = „der Gepriesene", aḥmad = „der Hochgepriesene". Dieselbe semitische Wurzel; in ihr liegen Begehren und Preisen beieinander — Sinn des Namens und Sinn des Wortes fallen zusammen.',
  },
  {
    tier: 'stone',
    h: '4.3 — Der Plural der Hoheit (-īm)',
    body: 'Neben dem Zahl-Plural kennt das Hebräische den pluralis majestatis / intensivus (Gesenius §124): Elohim, adonai, sowie Steigerungsplurale (ḥayyim, neʿurim). maḥămaddîm gehört hierher: „über alle Maßen begehrenswert". Als Hoheits- und Steigerungsform gelesen, ist es nicht „viele nette Dinge", sondern „der ganz und gar Gepriesene".',
  },
  {
    tier: 'marble',
    h: '4.4 — Die sinnbildliche Lizenz',
    body: 'Rabbi Akiva nannte das Hohelied „das Allerheiligste"; das Targum liest es als Liebe Gottes zu Israel bis zur messianischen Zeit, Rashi allegorisch, Origenes und die Väter als Christus und Gemeinde. Da beide Traditionen das Buch grundsätzlich nicht-wörtlich lesen, ist eine prophetische/typologische Lesart nach denselben Regeln zulässig — sonst misst man mit zweierlei Maß.',
  },
  {
    tier: 'stone',
    h: '4.5 — Der Faden quer durch den Tanach',
    body: 'Dieselbe Wurzel taucht an gewichtigen Stellen auf: ḥamudot („vielgeliebt", Dan 9,23, aus Gabriels Mund), ḥemdat kol ha-gôyim („das Begehrte aller Völker", Hag 2,7, beim Kommen zum Haus), maḥmad („das Begehrte der Augen", Hes 24,16). Im Hohelied steht ihre vollste Form. Ein wiederkehrender Klang an hoffnungsvollen Versen.',
  },
  {
    tier: 'marble',
    h: '4.6 — Ehrliche Grenzen · gleiche Maßstäbe',
    body: 'Was dieses Siegel zeigt: Bedeutung und Klang des Wortes maḥămaddîm fallen mit dem Namen Muhammad ﷺ zusammen, und die Lesart ist nach der allegorischen Regel des Buches zulässig. Was es nicht behauptet: einen wörtlichen Namens-Beweis, der allein trägt. Es ist ein korroborierender Strang — admissibel nach genau dem Maßstab, den Synagoge und Kirche selbst an dieses Buch legen.',
  },
]

export const hoheliedVernetzung = [
  { ziel: 'Das Fundament', text: 'Der dort eingeführte Faden Ḥ-M-D findet hier sein vollstes Wort: maḥămaddîm — Wurzel, Vorsilbe und Hoheitsplural, fast der Name.' },
  { ziel: 'Siegel V — Daniel', text: 'ḥamudot (Dan 9,23): dieselbe Wurzel im Mund Gabriels — „du bist vielgeliebt". Ein zweiter Strang desselben Seils.' },
  { ziel: 'Siegel VI — Der Paraklet', text: 'Aḥmad (61,6) „der Gepriesene" trifft das griechische períklytos — die Bedeutung des Namens, in einer anderen Sprache.' },
]

export const hoheliedGleicheMassstaebe =
  'Wer das Hohelied sinnbildlich liest — als Gott und Israel, als Christus und Gemeinde — und dann eine prophetische Resonanz für maḥămaddîm verbietet, misst mit zweierlei Maß. Nach derselben allegorischen Lizenz, die beide Traditionen für dieses Buch in Anspruch nehmen, darf das Wort, das den Geliebten krönt — „ganz und gar gepriesen", in Wurzel und Klang sein Name —, gehört werden. Wir beanspruchen nicht mehr, als die Regel erlaubt: eine Resonanz, ehrlich gewogen, verwoben ins Seil der übrigen Siegel.'
