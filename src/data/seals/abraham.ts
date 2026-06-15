import type { Beleg } from '../types'

// ---------------------------------------------------------------------------
// SIEGEL I — Abrahams Nachkommen. Before any prophecy: is the line itself
// legitimate? The Torah blesses Ishmael — Abraham's firstborn — into a "great
// nation" of twelve princes, calls him Abraham's "seed", gives him the
// covenant sign. Election of Isaac for one covenant is not rejection of
// Ishmael for the other.
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

export const abrahamThese =
  'Die Einwände gegen Muhammad ﷺ beginnen oft an der Wurzel: ein Prophet aus Arabien, aus Ismaels Linie? Doch die Tora selbst segnet Ismael — Abrahams Erstgeborenen — zum „großen Volk" mit zwölf Fürsten (1. Mose 17,20), nennt ihn Abrahams „Samen" (21,13) und gibt ihm das Bundeszeichen ins Fleisch. Die Erwählung Isaaks für den einen Bund verwirft Ismael nicht für den anderen. Bevor man fragt, ob der Prophet kommt — dieses Siegel zeigt: die Linie, aus der er käme, ist gesegnet und legitim.'

export const abrahamSteps: Step[] = [
  {
    n: 'I',
    h: 'Der Erstgeborene',
    body: 'Ismael ist Abrahams erster Sohn (1. Mose 16,15), geboren, als Abraham 86 war — vierzehn Jahre vor Isaak. Abraham beschnitt ihn eigenhändig mit dreizehn (17,25). Das Bundeszeichen war zuerst in Ismaels Fleisch.',
  },
  {
    n: 'II',
    h: 'Die eigene Verheißung',
    body: 'Gott segnet Ismael ausdrücklich: „Ich will ihn fruchtbar machen und über die Maßen mehren … und ihn zu einem großen Volk machen" (17,20). Dieselbe Bundessprache — segnen, fruchtbar, mehren — die auch Isaak und Jakob trägt.',
  },
  {
    n: 'III',
    h: 'Das große Volk',
    body: 'Zwölf Fürsten zeugt Ismael (25,16) — Spiegel der zwölf Stämme Israels. Sein Sohn Kedar wird in der Bibel selbst zum Namen der Araber (Jes 21,16). Das verheißene große Volk steht sichtbar in der Geschichte.',
  },
  {
    n: 'IV',
    h: 'Die Linie ist offen',
    body: 'Nichts in der Schrift sperrt Ismaels gesegnete Linie für Prophetie. Im Gegenteil: Mose verheißt einen Propheten „aus der Mitte ihrer Brüder" (5. Mose 18,18). Siegel I beansprucht nur die Grundlage — den Propheten selbst liefern die folgenden Siegel.',
  },
]

export const abrahamBelege: Record<string, Beleg> = {
  // ---- The great-nation blessing on Ishmael ----
  gen1720: {
    typ: 'bibel',
    kurz: 'Ich habe Ismael gesegnet: zwölf Fürsten — und ein großes Volk.',
    original:
      'וּלְיִשְׁמָעֵאל שְׁמַעְתִּיךָ הִנֵּה בֵּרַכְתִּי אֹתוֹ וְהִפְרֵיתִי אֹתוֹ וְהִרְבֵּיתִי אֹתוֹ בִּמְאֹד מְאֹד שְׁנֵים־עָשָׂר נְשִׂיאִם יוֹלִיד וּנְתַתִּיו לְגוֹי גָּדוֹל',
    sprache: 'he',
    translit:
      'û-lᵉ-Yišmāʿēl šᵉmaʿtîḵā, hinnēh bēraḵtî ʾōtô wᵉ-hip̄rêtî ʾōtô wᵉ-hirbêtî ʾōtô bi-mᵉʾōd mᵉʾōd; šᵉnêm-ʿāśār nᵉśîʾim yôlîd, û-nᵉtattîw lᵉ-gôy gādôl',
    uebersetzung:
      '„Und was Ismael betrifft, so habe ich dich erhört: Siehe, ich habe ihn gesegnet und will ihn fruchtbar machen und über die Maßen mehren; zwölf Fürsten wird er zeugen, und ich will ihn zu einem großen Volk machen."',
    fundstelle: '1. Mose (Genesis) 17,20',
    status: 'Strong H1419 · gôy gādôl = großes Volk',
    kern: 'לְגוֹי גָּדוֹל',
  },

  // ---- Ishmael is Abraham's seed ----
  gen2113: {
    typ: 'bibel',
    kurz: 'Auch den Sohn der Magd mache ich zu einem Volk — denn er ist dein Same.',
    original: 'וְגַם אֶת בֶּן הָאָמָה לְגוֹי אֲשִׂימֶנּוּ כִּי זַרְעֲךָ הוּא',
    sprache: 'he',
    translit: 'wᵉ-gam ʾet-ben hā-ʾāmāh lᵉ-gôy ʾăśîmennû, kî zarʿăḵā hûʾ',
    uebersetzung:
      '„Und auch den Sohn der Magd will ich zu einem Volk machen, weil er dein Same (zeraʿ) ist." — Ismael trägt dasselbe Bundeswort wie Isaak: Abrahams Same.',
    fundstelle: '1. Mose (Genesis) 21,13',
    status: 'Strong H2233 · zeraʿ = Same / Nachkommen',
    kern: 'זַרְעֲךָ',
  },

  // ---- Lift up the boy: a great nation ----
  gen2118: {
    typ: 'bibel',
    kurz: 'Steh auf, nimm den Knaben — denn ich will ihn zu einem großen Volk machen.',
    original: 'קוּמִי שְׂאִי אֶת הַנַּעַר וְהַחֲזִיקִי אֶת יָדֵךְ בּוֹ כִּי לְגוֹי גָּדוֹל אֲשִׂימֶנּוּ',
    sprache: 'he',
    translit: 'qûmî śᵉʾî ʾet-ha-naʿar wᵉ-haḥăzîqî ʾet-yādēḵ bô, kî lᵉ-gôy gādôl ʾăśîmennû',
    uebersetzung:
      '„Steh auf, nimm den Knaben und halte ihn fest an deiner Hand, denn ich will ihn zu einem großen Volk machen." — Gottes Wort an Hagar in der Wüste.',
    fundstelle: '1. Mose (Genesis) 21,18',
  },

  // ---- Ishmael circumcised at thirteen ----
  gen1726: {
    typ: 'bibel',
    kurz: 'An ebendiesem Tag wurden Abraham und sein Sohn Ismael beschnitten.',
    uebersetzung:
      '„Ismael, sein Sohn, war dreizehn Jahre alt, als er beschnitten wurde … an ebendemselben Tag wurde Abraham beschnitten und Ismael, sein Sohn." Das Bundeszeichen kam zuerst in Ismaels Fleisch — Jahre vor Isaaks Geburt.',
    fundstelle: '1. Mose (Genesis) 17,25–26',
  },

  // ---- In your seed all nations blessed ----
  gen2218: {
    typ: 'bibel',
    kurz: 'In deinem Samen sollen alle Völker der Erde gesegnet werden.',
    original: 'וְהִתְבָּרֲכוּ בְזַרְעֲךָ כֹּל גּוֹיֵי הָאָרֶץ',
    sprache: 'he',
    translit: 'wᵉ-hitbārăḵû ḇᵉ-zarʿăḵā kōl gôyê hā-ʾāreṣ',
    uebersetzung:
      '„Und in deinem Samen sollen alle Völker der Erde gesegnet werden." — Der universale Segen reicht über Isaak hinaus zu allen Völkern.',
    fundstelle: '1. Mose (Genesis) 22,18',
    kern: 'כֹּל גּוֹיֵי הָאָרֶץ',
  },

  // ---- Abraham and Ishmael's prayer at the Kaaba ----
  q2129: {
    typ: 'quran',
    kurz: 'Unser Herr, erwecke unter ihnen einen Gesandten aus ihrer Mitte.',
    original:
      'رَبَّنَا وَابْعَثْ فِيهِمْ رَسُولًا مِّنْهُمْ يَتْلُو عَلَيْهِمْ آيَاتِكَ وَيُعَلِّمُهُمُ الْكِتَابَ وَالْحِكْمَةَ',
    sprache: 'ar',
    translit: 'rabbanā wa-bʿath fīhim rasūlan minhum yatlū ʿalayhim āyātika wa-yuʿallimuhumu l-kitāba wa-l-ḥikmah',
    uebersetzung:
      '„Unser Herr, und erwecke unter ihnen einen Gesandten aus ihrer Mitte, der ihnen Deine Zeichen verliest und sie das Buch und die Weisheit lehrt …" — Abraham und Ismael beim Bau der Kaaba.',
    fundstelle: 'Sure 2 (al-Baqara), Vers 129',
    kern: 'رَسُولًا مِّنْهُمْ',
  },

  // ---- Abraham settles his offspring at the Sacred House ----
  q1437: {
    typ: 'quran',
    kurz: 'Ich habe einen Teil meiner Nachkommen im Tal bei Deinem Heiligen Haus angesiedelt.',
    original: 'رَّبَّنَا إِنِّي أَسْكَنتُ مِن ذُرِّيَّتِي بِوَادٍ غَيْرِ ذِي زَرْعٍ عِندَ بَيْتِكَ الْمُحَرَّمِ',
    sprache: 'ar',
    translit: 'rabbanā innī askantu min dhurriyyatī bi-wādin ghayri dhī zarʿin ʿinda baytika l-muḥarram',
    uebersetzung:
      '„Unser Herr, ich habe einen Teil meiner Nachkommenschaft in einem Tal ohne Ackerland angesiedelt, bei Deinem geschützten Haus …" — Abraham siedelt Hagar und Ismael in Mekka an.',
    fundstelle: 'Sure 14 (Ibrāhīm), Vers 37',
  },

  // ---- Source: the genealogy to the Prophet ----
  genealogie: {
    typ: 'quelle',
    kurz: 'Ismael → Kedar → ʿAdnān → Quraisch → Muhammad ﷺ — die Linie der Nordaraber.',
    uebersetzung:
      'Die klassische arabische Genealogie (Ibn Isḥāq, aṭ-Ṭabarī) führt den Propheten ﷺ über die Quraisch und ʿAdnān auf Kedar (Qaydār), den zweiten Sohn Ismaels, zurück. Das deckt sich mit dem biblischen Befund: Kedar ist im Tanach der Name der Araber (Jes 21,16; 42,11; Ps 120,5; Hld 1,5). Die Nordaraber verstanden sich seit jeher als „Söhne Ismaels".',
    fundstelle: 'Ibn Isḥāq, Sīra · aṭ-Ṭabarī · vgl. Jes 21,16; Ps 120,5',
  },

  // ---- Source: Jewish recognition of the great nation ----
  maimonides: {
    typ: 'quelle',
    kurz: 'Jüdische Quellen selbst nennen die Ismaeliter die Araber — und bezeugen das große Volk.',
    uebersetzung:
      'Josephus (Antiquitates 1.12.4) hält fest: die Ismaeliter sind die Araber. Genesis Rabbah und spätere Autoritäten — bis hin zu Maimonides (Mishneh Tora, Hilchot Melachim) — identifizieren Ismaels Nachkommen mit dem arabischen Volk. Selbst gegnerische Quellen bestätigen damit unfreiwillig die Erfüllung der Verheißung vom „großen Volk".',
    fundstelle: 'Josephus, Ant. 1.12.4 · Genesis Rabbah · Maimonides, Hilchot Melachim',
  },
}

// ---- The family tree: one father, two blessed lines -------------------------
export const stammbaum = {
  wurzel: { name: 'Abraham', ar: 'إبراهيم' },
  ismael: {
    label: 'Ismael · der Erstgeborene',
    nodes: ['Ismael', 'Kedar', 'die arabischen Stämme', 'ʿAdnān · Quraisch', 'Muhammad ﷺ'],
  },
  isaak: {
    label: 'Isaak',
    nodes: ['Isaak', 'Jakob · Israel', 'die zwölf Stämme', 'David', 'Jesus'],
  },
  note: 'Ein Vater, zwei gesegnete Linien. Die Bibel verwirft Ismael nicht — sie gibt ihm einen eigenen Bundessegen und ein eigenes großes Volk.',
}

// ---- The twelve princes (Gen 25) --------------------------------------------
export const zwoelfFuersten = {
  ref: '1. Mose 25,13–16',
  fuersten: [
    'Nebajot',
    'Kedar',
    'Adbeel',
    'Mibsam',
    'Mischma',
    'Duma',
    'Massa',
    'Hadad',
    'Tema',
    'Jetur',
    'Naphisch',
    'Kedma',
  ],
  highlight: 'Kedar',
  pointe:
    'Zwölf Fürsten Ismaels — Spiegel der zwölf Stämme Israels. Kedar (קֵדָר) wird in der Bibel selbst zum Namen der Araber: Jes 21,16; Ps 120,5; Hld 1,5.',
}

// ---- What Ishmael received (the covenant gifts) -----------------------------
export const ismaelEmpfing = [
  { gabe: 'Von Gott benannt', ref: '1. Mose 16,11 — „Ismael" = „Gott hört"' },
  { gabe: 'Abrahams Same (zeraʿ)', ref: '1. Mose 21,13' },
  { gabe: 'Das Bundeszeichen — Beschneidung', ref: '1. Mose 17,25–26' },
  { gabe: 'Gesegnet · fruchtbar · gemehrt', ref: '1. Mose 17,20' },
  { gabe: 'Zwölf Fürsten', ref: '1. Mose 17,20; 25,16' },
  { gabe: 'Ein großes Volk', ref: '1. Mose 21,18' },
]
export const ismaelEmpfingPointe =
  'Sechs Bundesgaben — dieselben Worte, die auch Isaaks Linie tragen. „Nur Isaak" hält dem Text nicht stand.'

export const abrahamKonter: KonterItem[] = [
  {
    tier: 'stone',
    einwand: '„Der Bund läuft NUR über Isaak — ‚meinen Bund richte ich mit Isaak auf‘ (1. Mose 17,21)."',
    konter:
      '17,21 betrifft den partikularen Bund — Land, Gesetz, die Linie Israels —, nicht die Aufhebung von Ismaels Segen. Nur einen Vers zuvor (17,20) segnet Gott Ismael ausdrücklich zum „großen Volk" mit zwölf Fürsten. Zwei Bünde schließen einander nicht aus: der eine partikular (Isaak), der andere universal — „in deinem Samen alle Völker" (22,18). Ismael wird nicht enterbt, sondern gesegnet.',
    belegId: 'gen1720',
  },
  {
    tier: 'stone',
    einwand: '„Ismael war der Sohn der Sklavin — kein legitimer Erbe."',
    konter:
      'Die Bibel nennt ihn dennoch Abrahams „Samen" (zeraʿ, 21,13) und Abrahams Sohn (16,15). Abraham beschnitt ihn eigenhändig (17,23). Hagar war Abrahams Frau (16,3). Und Isaak und Ismael begruben gemeinsam ihren Vater (25,9) — keine Feinde. Der Status der Mutter hebt weder die Vaterschaft noch den Segen Gottes auf.',
    belegId: 'gen2113',
  },
  {
    tier: 'stone',
    einwand: '„Ismael war ein ‚Wildesel von einem Menschen‘ (1. Mose 16,12) — eine negative Prophezeiung."',
    konter:
      'פֶּרֶא אָדָם (pere ʾadam), „Wildesel-Mensch", ist im Hebräischen das Bild für frei, ungezähmt, unabhängig (vgl. Hiob 39,5: der Wildesel als Sinnbild der Freiheit). Und der Satz endet: „er wird wohnen im Angesicht aller seiner Brüder" (25,18) — gegenwärtig, nicht ausgestoßen. Die Beschreibung eines freien Wüstenvolkes, kein Fluch.',
  },
  {
    tier: 'stone',
    einwand: '„Ismaels Verheißung ist rein zahlenmäßig — viele Nachkommen, nichts Geistliches."',
    konter:
      'Dieselben Worte — „segnen", „fruchtbar machen", „mehren", „großes Volk" — gebraucht Gott für Isaak und Jakob. Ismaels zwölf Fürsten (25,16) spiegeln Israels zwölf Stämme. Wenn die Formel bei Isaak geistlich ist, kann sie bei Ismael nicht bloß demographisch sein. Gleiche Worte, gleiches Gewicht.',
    belegId: 'gen2118',
  },
  {
    tier: 'stone',
    einwand: '„Aus Ismael kam nie ein Prophet — Prophetie gehört zu Israel."',
    konter:
      'Das setzt voraus, was zu beweisen ist (Zirkelschluss). Die Schrift sperrt Prophetie aus Ismaels Linie nirgends. Im Gegenteil: Mose verheißt einen Propheten „aus der Mitte ihrer Brüder" (5. Mose 18,18) — und Israels „Brüder" sind die Linien Ismaels und Esaus. Das entfaltet Siegel II. Siegel I zeigt nur: die Linie ist legitim und gesegnet.',
  },
  {
    tier: 'stone',
    einwand: '„Die Araber stammen gar nicht von Ismael ab — das ist islamische Legende."',
    konter:
      'Die Abstammung der Nordaraber von Ismael ist keine islamische Erfindung, sondern steht schon im Tanach: Ismaels Sohn Kedar ist der biblische Name der Araber (Jes 21,16-17; Ps 120,5; Hld 1,5). Jüdische Quellen — Josephus, Genesis Rabbah, Maimonides — identifizieren die Ismaeliter mit den Arabern. Das große Volk steht sichtbar da.',
    belegId: 'maimonides',
  },
  {
    tier: 'marble',
    einwand: '„Die Verheißung erfüllte sich schon zu Abrahams Zeit — kein Bezug zu Muhammad."',
    konter:
      'Die zwölf Fürsten erfüllten sich früh — der Segen aber wirkt fort; „großes Volk" ist kein Einmal-Ereignis. Siegel I beansprucht nicht mehr, als die Schrift sagt: Ismaels Linie ist gesegnet und für Prophetie nicht gesperrt. Den konkreten Propheten liefern die folgenden Siegel.',
  },
]

export const abrahamScholar: ScholarItem[] = [
  {
    tier: 'stone',
    h: '1.1 — Ismael, der Erstgeborene',
    body: 'Geboren, als Abraham 86 war (1. Mose 16,16) — vierzehn Jahre vor Isaak. Mit dreizehn beschnitten (17,25), am selben Tag wie Abraham selbst. Im altorientalischen wie im biblischen Recht trägt der Erstgeborene besonderes Gewicht; die Schrift verschweigt Ismaels Vorrang an Jahren nirgends.',
  },
  {
    tier: 'stone',
    h: '1.2 — Die Bundessprache gilt auch Ismael',
    body: 'bārak (segnen), pārāh (fruchtbar), rāvāh (mehren), gôy gādôl (großes Volk), zeraʿ (Same): Wort für Wort dieselben Termini, mit denen Gott Isaak und Jakob bedenkt. Lexika (BDB, Gesenius, HALOT) führen keine zwei Bedeutungsklassen — ein Wort, ein Gewicht, gleich für beide Söhne.',
  },
  {
    tier: 'stone',
    h: '1.3 — Kedar ist der biblische Name der Araber',
    body: 'Ismaels zweiter Sohn Kedar (1. Mose 25,13) ist im Tanach der Standardname für die Araber: Jes 21,16-17; 42,11; 60,7; Jer 49,28; Ps 120,5; Hld 1,5; Hes 27,21. Die biblischen Propheten kannten die Ismaeliter als reales arabisches Wüstenvolk — nicht als Legende.',
  },
  {
    tier: 'marble',
    h: '1.4 — Jüdische Anerkennung der Genealogie',
    body: 'Josephus (Antiquitates 1.12.2-4) nennt die zwölf Söhne Ismaels und die Araber ihre Nachkommen. Genesis Rabbah und Maimonides (Hilchot Melachim) bestätigen die Linie. Selbst islamkritische Autoritäten setzen Ismaeliter = Araber — und bezeugen so das „große Volk".',
  },
  {
    tier: 'stone',
    h: '1.5 — Zwei Bünde, kein Widerspruch',
    body: 'Der partikulare Bund (Isaak: Land und Tora, 17,21) und der universale Segen (22,18: „alle Völker der Erde") stehen nebeneinander. Erwählung des einen ist nicht Verwerfung des anderen — wie auch Esau/Edom „Bruder" bleibt. Die Schrift kennt mehr als eine gesegnete Linie.',
  },
  {
    tier: 'marble',
    h: '1.6 — Der Ort: die Wüste Paran',
    body: 'Hagar und Ismael ließen sich in der Wüste Paran nieder (1. Mose 21,21) — die Region der nordwestarabischen Halbinsel / des Hedschas. Damit verankert die Tora Ismaels Volk geografisch genau dort, wo Siegel III ansetzt: Paran, Kedar, Mekka.',
  },
]

export const abrahamVernetzung = [
  { ziel: 'Das Fundament', text: 'Die Genealogie ist der erste Baustein: die gesegnete, legitime Linie, durch die der Verheißene überhaupt kommen kann.' },
  { ziel: 'Siegel II — Prophet wie Mose', text: '„Aus der Mitte ihrer Brüder" (5. Mose 18,18) — die Brüder Israels sind die Linien Ismaels und Esaus.' },
  { ziel: 'Siegel III — Arabische Prophezeiungen', text: 'Kedar und Paran — Ismaels Söhne und Ismaels Wohnort — werden zum Schauplatz der Prophezeiung.' },
]

export const abrahamGleicheMassstaebe =
  'Wer Isaaks Segen geistlich liest und Ismaels Segen mit denselben Worten bloß demographisch — der misst mit zweierlei Maß. Die Bibel gebraucht für beide Söhne dieselbe Bundessprache: gesegnet, fruchtbar, gemehrt, ein großes Volk, Abrahams Same. Auf gleichen Maßstäben gelesen, steht Ismaels Linie gesegnet da — und für den Verheißenen offen.'
