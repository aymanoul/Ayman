import type { Beleg } from '../types'

// ---------------------------------------------------------------------------
// SIEGEL V — Daniel. Content from the build spec (§6.5). Verse / source full
// texts live on Beleg records and surface only in the immersive modal.
// ---------------------------------------------------------------------------

export interface StatueZone {
  id: string
  material: string
  reich: string
  jahr: string
  belegId: string
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

export interface Step {
  n: string
  h: string
  body: string
}

export const danielThese =
  'Daniel zeichnet eine lückenlose Kette von fünf Weltreichen — Babylon, Medo-Persien, Griechenland, Rom, und das Reich Gottes. Der „Stein, nicht von Menschenhand" entsteht erst, nachdem Rom geteilt ist, zerschmettert alle vorherigen Reiche und füllt die Erde. Jesus kam Jahrhunderte zu früh. Nur ein Ereignis passt auf jeden Punkt.'

export const danielSteps: Step[] = [
  {
    n: 'I',
    h: 'Die Statue (Daniel 2)',
    body: 'Nebukadnezar träumt von einer Statue aus fünf Materialien. Daniel deutet sie als fünf aufeinanderfolgende Reiche — und nennt das erste beim Namen.',
  },
  {
    n: 'II',
    h: 'Die vier Bedingungen des Steins',
    body: 'Der Stein muss „in den Tagen jener Könige" kommen, von Gott aufgerichtet sein, zum Berg werden, der die Erde füllt, und die Reiche zermalmen — militärisch, nicht durch Bekehrung.',
  },
  {
    n: 'III',
    h: 'Das Zeitfenster',
    body: 'Rom teilte sich formal erst 395 n. Chr. Der Stein muss danach kommen und Rom zerstören — Rom fiel 1453 an ein muslimisches Reich. Jesus (1. Jh.) lag Jahrhunderte davor.',
  },
  {
    n: 'IV',
    h: 'Das Dilemma',
    body: 'Wer sagt „Jesus ist der Stein", macht entweder Jesus zum Lügner (er erfüllte das Zeitfenster nicht) oder Daniel zum falschen Propheten (die Reiche fielen nicht, als Jesus kam).',
  },
]

export const statueZones: StatueZone[] = [
  { id: 'gold', material: 'Gold', reich: 'Babylon', jahr: '605–539 v. Chr.', belegId: 'dan238' },
  { id: 'silber', material: 'Silber', reich: 'Medo-Persien', jahr: '539–330 v. Chr.', belegId: 'dan820' },
  { id: 'bronze', material: 'Bronze', reich: 'Griechenland', jahr: '330–63 v. Chr.', belegId: 'dan821' },
  { id: 'eisen', material: 'Eisen', reich: 'Rom', jahr: 'ab 63 v. Chr.', belegId: 'dan240' },
  { id: 'fuesse', material: 'Eisen + Ton', reich: 'Geteiltes Rom', jahr: 'ab 395 n. Chr.', belegId: 'dan241' },
  { id: 'stein', material: 'Der Stein', reich: 'Das Reich Gottes', jahr: 'ab 622 n. Chr.', belegId: 'dan244' },
]

export const danielKonter: KonterItem[] = [
  {
    tier: 'stone',
    einwand: '„Das Reich ist geistlich, Jesus hat es erfüllt."',
    konter:
      'Daniel 2,44 sagt: das Reich zerschmettert irdische Reiche. Jesus selbst: „Mein Reich ist nicht von dieser Welt" (Joh 18,36) — das widerspricht Daniel direkt. „Zerschmettern" ist Kriegssprache, nicht Bekehrung. Die Kirche fiel unter römische Verfolgung — der Islam eroberte Rom.',
  },
  {
    tier: 'stone',
    einwand: '„Der Menschensohn (Dan 7,13) ist Jesus."',
    konter:
      'Drei Probleme: (1) Der Menschensohn herrscht und zerschmettert — das NT sagt, Jesu Menschensohn werde gekreuzigt (Mt 20,18-19). (2) Chronologie: er kommt nach dem kleinen Horn (Konstantin, 4. Jh.) — Jesus kam davor. (3) Daniel 7,27: das Reich wird den Heiligen (Plural) gegeben, nicht einer Einzelfigur.',
  },
  {
    tier: 'stone',
    einwand: '„Der Menschensohn wird „angebetet" (Dan 7,14) → also göttlich."',
    konter:
      'Das aramäische pelach heißt dienen / huldigen, nicht zwingend Gott anbeten. Beweis aus eurer eigenen Bibel: Esra 7,24, Gen 14,14, Gen 27,29, Gen 29,18 — Jakob „dient" Laban. Hat Jakob Laban angebetet? Die Völker „dienen" = gehorchen ihm.',
    belegId: 'pelach',
  },
  {
    tier: 'stone',
    einwand: '„Er kommt „mit den Wolken" (Dan 7,13) → nur Gott reitet Wolken."',
    konter:
      'Der Vers sagt „mit den Wolken", nicht „auf den Wolken". Im selben Kapitel kommen die Tiere „aus dem Meer" (7,2-3) — kamen die Reiche wörtlich aus dem Ozean? Wolken = Symbol göttlicher Vollmacht (Ex 13,21; Jes 19,1). Ihm wird Autorität gegeben.',
  },
  {
    tier: 'stone',
    einwand: '„Das Reich währt EWIG — die Osmanen endeten 1924."',
    konter:
      'Aramäisch olam heißt „lange Zeit", nicht zwingend Ewigkeit (Jona 2,6: 3 Tage = olam; Ex 21,6; Gen 17,8). Und das Reich Gottes hat zwei Dimensionen: physisch (Macht) + geistlich (Autorität). Mt 21,43 beweist: die Juden „hatten" das Reich auch ohne Staat. Auch nach 1924 bleibt das geistliche Reich.',
  },
  {
    tier: 'stone',
    einwand: '„Rom war schon zu Jesu Zeit geteilt (Klientelkönige)."',
    konter:
      'Daniel definiert Teilung formal, nicht funktional. Babylon hatte zwei Könige (Nabonid + Belsazar) — Daniel zählt es als EIN ungeteiltes Reich (Goldkopf). Persien: Xerxes-Mitregenten — trotzdem ein Reich. Rom wurde erst 395 formal geteilt.',
  },
  {
    tier: 'stone',
    einwand: '„Der „Stein, nicht von Menschenhand" kann kein Mensch sein."',
    konter:
      'Jesus selbst nennt den Stein (Ps 118,22) in Mt 21,42-43 den Eckstein — das Reich werde „genommen und einem Volk gegeben, das Früchte bringt". Und Muhammad ﷺ nannte sich selbst den fehlenden Ziegel, der das Haus vollendet — ohne Zugang zu Tanach/NT.',
    belegId: 'bukhari3535',
  },
  {
    tier: 'marble',
    einwand: '„Daniel wurde erst ~165 v. Chr. geschrieben — keine echte Prophetie."',
    konter:
      'Zweischneidig: dieselbe Spätdatierung, die der Gegner gegen Daniel benutzt, zerstört auch seine Jesus-Deutung (Daniel 9). Wir führen primär Daniel 2 & 7 — deren Vier-Reiche-Deutung (4. Reich = Rom) von den Kirchenvätern selbst stammt, nicht von Muslimen erfunden.',
  },
]

export const danielScholar: ScholarItem[] = [
  {
    tier: 'stone',
    h: '5.1 — Daniel identifiziert die Reiche selbst',
    body: 'Babylon (Gold): wörtlich, Daniel 2,38. Medo-Persien (Silber): Daniel 8,20 (Widder = Könige von Medien und Persien). Griechenland (Bronze): Daniel 8,21 (Ziegenbock = König von Griechenland; das große Horn = Alexander). Rom (Eisen + Ton): „stark wie Eisen, zermalmt alles" + „geteilt" (Ost/West ab 395) — selbst der Artscroll Tanach nennt die Teilung Roms.',
  },
  {
    tier: 'stone',
    h: '5.2 — Daniel 7: dieselbe Kette als vier Tiere',
    body: 'Löwe mit Adlerflügeln = Babylon. Bär (3 Rippen) = Medo-Persien. Leopard mit 4 Köpfen = Griechenland (4 Diadochen). Schreckliches Tier, Eisenzähne, 10 Hörner = Rom. Jüdischer Beleg: Babylonischer Talmud, Rabbi Yoḥanan — das vierte Reich = „das ruchlose römische Reich". Nach 70 n. Chr. war das Vier-Reiche-Schema kanonisches jüdisches Modell.',
  },
  {
    tier: 'stone',
    h: '5.4 — Josephus: der Kronzeuge, der schwieg',
    body: 'Josephus (1. Jh.) deutet Daniel 2 — bricht aber beim Stein bewusst ab („es schien mir nicht angebracht, dies zu erzählen") und schickt den Leser, selbst Daniel zu lesen. Parente & Sievers: er wollte die römischen Leser nicht beleidigen — „nur ein begriffsstutziger Leser hätte den Punkt verpasst." Ein Jude unter römischer Besatzung wusste, dass der Stein Rom zerstören würde.',
  },
  {
    tier: 'marble',
    h: '5.5 — Das kleine Horn = Konstantin (Daniel 7,24-25)',
    body: 'Niedrige Herkunft, steigt auf (Helena). Unterwirft drei Könige (Tetrarchie). „Spricht gegen den Höchsten" (Konzil von Nicäa 325). Unterdrückt die Heiligen (Verfolgung unitarischer Christen). Ändert Festzeiten und Gesetze (Sonntag statt Sabbat per Dekret). „Seine Macht wird genommen" → Konstantinopel fiel 1453 an die Muslime.',
  },
  {
    tier: 'marble',
    h: '5.6 — Die 350-Jahre-Rechnung (ergänzend)',
    body: '„Eine Zeit, Zeiten und eine halbe Zeit" (7,25). Aramäisch iddan = Zeitspanne; Plural = Dual = „zwei". 1 + 2 + ½ = 3,5 Einheiten → als Jahrhunderte 350 Jahre. Konstantins Geburt 272 + 350 = 622 = die Hidschra. Lexikon-Stützen: Brown-Driver-Briggs, Gesenius, HALOT, Hieronymus. Ein faszinierendes Zusatzindiz, kein Beweis.',
  },
  {
    tier: 'stone',
    h: '5.9 — Gabriel nennt die Wurzel von Muhammads Namen',
    body: 'Als Gabriel Daniel erscheint (9,21-23), nennt er ihn „hochgeschätzt / vielgeliebt" = hebr. ḥamudot, Wurzel Ḥ-M-D (Strong H2530). Muhammad (محمد) und Aḥmad (أحمد) stammen aus exakt derselben semitischen Wurzel → „der Gepriesene". Die Szene-Parallele: Gabriel erscheint auch Muhammad ﷺ in Männergestalt, eilend, mit froher Botschaft. Brücke zu Siegel IV (maḥamaddim, Hld 5,16).',
  },
]

export const danielBelege: Record<string, Beleg> = {
  // ---- Quran (the religion prevailing = the stone fills the earth) ----
  quran619: {
    typ: 'quran',
    kurz: 'Er gibt der Religion der Wahrheit die Oberhand über alle Religion.',
    original: 'هُوَ الَّذِي أَرْسَلَ رَسُولَهُ بِالْهُدَىٰ وَدِينِ الْحَقِّ لِيُظْهِرَهُ عَلَى الدِّينِ كُلِّهِ وَلَوْ كَرِهَ الْمُشْرِكُونَ',
    sprache: 'ar',
    translit: 'Huwa lladhī arsala rasūlahu bi-l-hudā wa-dīni l-ḥaqqi li-yuẓhirahu ʿalā d-dīni kullihi wa-law kariha l-mushrikūn',
    uebersetzung:
      'Er ist es, der Seinen Gesandten mit der Rechtleitung und der Religion der Wahrheit gesandt hat, um ihr die Oberhand über alle Religion zu geben — auch wenn es den Götzendienern zuwider ist.',
    fundstelle: 'Sure 61 (aṣ-Ṣaff), Vers 9',
    kern: 'لِيُظْهِرَهُ عَلَى الدِّينِ كُلِّهِ',
  },

  // ---- Bibel: the stone kingdom (Aramaic) ----
  dan244: {
    typ: 'bibel',
    kurz: 'Der Gott des Himmels wird ein Reich aufrichten, das alle zermalmt und ewig besteht.',
    original: 'וּבְיוֹמֵיהוֹן דִּי מַלְכַיָּא אִנּוּן יְקִים אֱלָהּ שְׁמַיָּא מַלְכוּ דִּי לְעָלְמִין לָא תִתְחַבַּל',
    sprache: 'he',
    translit: 'û-ḇ-yômêhôn dî malkayyāʾ innûn yᵉqîm Ĕlāh šᵉmayyāʾ malkû dî lᵉ-ʿālmîn lā ṯitḥabbal',
    uebersetzung:
      'Und in den Tagen jener Könige wird der Gott des Himmels ein Reich (malkû) aufrichten, das ewig nicht zerstört wird … es wird alle jene Reiche zermalmen und ihnen ein Ende machen, selbst aber ewig bestehen.',
    fundstelle: 'Daniel 2,44 (Aramäisch)',
    status: 'Strong H4437 · malkû = Reich',
    kern: 'מַלְכוּ',
  },

  // ---- Bibel: the H-M-D bridge (Hebrew) ----
  dan923: {
    typ: 'bibel',
    kurz: 'Gabriel nennt Daniel „ḥamudot" — vielgeliebt. Dieselbe Wurzel wie Muhammad.',
    original: 'כִּי חֲמוּדוֹת אָתָּה',
    sprache: 'he',
    translit: 'kî ḥămûdôt ʾāttā',
    uebersetzung:
      '„Denn du bist vielgeliebt / hochgeschätzt (ḥamudot)." — Wurzel Ḥ-M-D, dieselbe wie in Muhammad (محمد) und Aḥmad (أحمد): „der Gepriesene".',
    fundstelle: 'Daniel 9,23 (Hebräisch)',
    status: 'Strong H2530 · Wurzel Ḥ-M-D',
    kern: 'חֲמוּדוֹת',
  },

  // ---- statue zones ----
  dan238: {
    typ: 'bibel',
    kurz: '„Du bist das Haupt aus Gold."',
    uebersetzung: '„Du, o König … du bist das Haupt aus Gold." Daniel deutet Babylon ausdrücklich als das goldene Haupt.',
    fundstelle: 'Daniel 2,38',
  },
  dan820: {
    typ: 'bibel',
    kurz: 'Der Widder mit zwei Hörnern = die Könige von Medien und Persien.',
    uebersetzung: '„Der Widder mit den zwei Hörnern, den du gesehen hast, sind die Könige von Medien und Persien." Daniel benennt das zweite Reich selbst.',
    fundstelle: 'Daniel 8,20',
  },
  dan821: {
    typ: 'bibel',
    kurz: 'Der Ziegenbock = der König von Griechenland.',
    uebersetzung: '„Der zottige Ziegenbock ist der König von Griechenland." Das große Horn = Alexander; die vier Hörner = die vier Diadochen-Reiche.',
    fundstelle: 'Daniel 8,21',
  },
  dan240: {
    typ: 'bibel',
    kurz: 'Ein viertes Reich, stark wie Eisen, das alles zermalmt.',
    uebersetzung: '„Und ein viertes Reich wird sein, stark wie Eisen; wie Eisen alles zermalmt und zerschlägt, so wird es alle diese zermalmen." = Rom.',
    fundstelle: 'Daniel 2,40',
  },
  dan241: {
    typ: 'bibel',
    kurz: 'Die Füße aus Eisen und Ton — ein geteiltes Reich.',
    uebersetzung: '„Dass du die Füße und Zehen teils aus Töpferton, teils aus Eisen gesehen hast — es wird ein geteiltes Reich sein." Rom, geteilt in Ost und West (395 n. Chr.).',
    fundstelle: 'Daniel 2,41',
  },

  // ---- source ----
  bukhari3535: {
    typ: 'quelle',
    kurz: 'Muhammad ﷺ: „Ich bin der fehlende Ziegel — und das Siegel der Propheten."',
    uebersetzung:
      '„Mein Gleichnis und das der Propheten vor mir ist wie ein Mann, der ein Haus schön und vollkommen baute, doch an einer Ecke fehlte ein Ziegel. Die Leute gingen umher und bewunderten es, sagten aber: Wäre nur dieser Ziegel gesetzt! Ich bin dieser Ziegel, und ich bin das Siegel der Propheten."',
    fundstelle: 'Ṣaḥīḥ al-Bukhārī 3535 · Ṣaḥīḥ Muslim 2286',
    status: 'ṣaḥīḥ',
  },

  pelach: {
    typ: 'quelle',
    kurz: 'pelach = „dienen", nicht „anbeten" — bezeugt in der eigenen Bibel.',
    uebersetzung:
      'Das aramäische pelach erscheint für schlichtes Dienen: Esra 7,24 (Tempeldiener), Gen 14,14 (Abrahams Männer), Gen 27,29 (Völker dienen Jakob), Gen 29,18 (Jakob dient Laban sieben Jahre). Niemand würde sagen, Jakob habe Laban angebetet. Die Völker „dienen" dem Menschensohn = sie gehorchen ihm.',
    fundstelle: 'Esra 7,24 · Gen 14,14 · 27,29 · 29,18',
  },
}

export interface TimelinePoint {
  jahr: string
  titel: string
  text: string
  islam?: boolean
  jesus?: boolean
}

export const danielTimeline: TimelinePoint[] = [
  { jahr: '1. Jh.', titel: 'Jesus', text: 'Jesus wirkt — Jahrhunderte vor der Teilung Roms. Außerhalb des Fensters.', jesus: true },
  { jahr: '395', titel: 'Rom teilt sich', text: 'Tod Theodosius’ I. → das Reich teilt sich formal in Ost (Arcadius) und West (Honorius). Erst jetzt: „Füße aus Eisen und Ton".' },
  { jahr: '622', titel: 'Der islamische Staat', text: 'Die Hidschra — Gründung des islamischen Gemeinwesens in Medina. „In den Tagen jener Könige."', islam: true },
  { jahr: '1453', titel: 'Rom fällt', text: 'Konstantinopel — das letzte Rom — fällt an das muslimische Osmanische Reich. Der Stein zerschmettert das Eisen.', islam: true },
]

export const danielVernetzung = [
  { ziel: 'Siegel IV — Maḥamaddīm', text: 'Die Statue (Gold-Haupt → Marmor-Beine) ist die Vorlage, mit der das Hohelied spielt. Ḥ-M-D verbindet ḥamudot ↔ maḥamaddim ↔ Aḥmad.' },
  { ziel: 'Siegel III — Arabische Prophezeiungen', text: 'Habakuk 3,3 / Berg Paran erscheint als Maḥmūd; das fünfte Reich „zermalmt Rom und Persien" = die Eroberungen.' },
  { ziel: 'Siegel VII — Jüdische Erwartung', text: '4 Esra, Rabbi Akiva, Bar Kochba — Juden erwarteten aktiv das Reich Gottes und einen Krieger-Messias.' },
]

export const danielGleicheMassstaebe =
  'Der Kritiker verlangt für den Islam ein perfekt eingetroffenes Zeitfenster — und akzeptiert für Jesus eine Daniel-9-Rechnung, die mit keinem Startdatum aufgeht, plus eine Umdeutung des „Steins". Er nimmt pelach als „göttliche Anbetung", obwohl dasselbe Wort in seiner eigenen Bibel „dienen" heißt. Auf gleichen Maßstäben zerbricht die Jesus-Deutung an Daniels eigener Chronologie.'
