import type { Beleg } from '../types'
import type { Step, KonterItem, ScholarItem, Regel, Fakt } from './wahrheitssuche'

// ---------------------------------------------------------------------------
// BAND 4 — DAS KREUZ
// Kap. 4 (Das Schuld- und Suehneverhaeltnis / Blutsuehne) + Kap. 5 (Die
// Kreuzigung: unbestrittene Tatsache oder das am meisten missverstandene
// Ereignis der Geschichte?). Vollstaendig aus der MD extrahiert (Zeilen
// 1677-2503 der Quelle).
// ---------------------------------------------------------------------------

export const kreuzThese =
  'Zwei Fragen, ein Band: Kann Gott vergeben, ohne dass Blut fließt? Und: Ist Jesus überhaupt gekreuzigt worden? Die Bibel selbst widerspricht der Blutsühne — und die Kreuzigungsberichte tragen nicht das Gewicht historischer Gewissheit, das ihnen zugeschrieben wird. Der Qur’an: „Sie haben ihn weder getötet noch gekreuzigt … Allah hat ihn zu Sich erhoben."'

export const kreuzFakten: Fakt[] = [
  { wert: '120.000', label: 'Menschen in Ninive — vergeben ohne ein einziges Opfer', ton: 'gruen' },
  { wert: '40–70 Jahre', label: 'zwischen den Ereignissen und den Evangelien', ton: 'rot' },
  { wert: '≈ 180 n. Chr.', label: 'erst dann tragen die Evangelien Namen', ton: 'rot' },
  { wert: '0', label: 'Augenzeugen unter den Evangelien-Autoren', ton: 'rot' },
]

export const kreuzSteps: Step[] = [
  {
    n: 'I',
    h: 'Vergebung ohne Blut',
    body: 'Im Islam ist jeder für seine eigenen Sünden verantwortlich: „Keine lasttragende Seele nimmt die Last einer anderen auf sich" (17:15). Gott vergibt jedem, der aufrichtig bereut — „Er ist ja der Allvergebende und Barmherzige" (39:53). Kein Mittler, kein Opfer, kein zweiter Schuldner.',
  },
  {
    n: 'II',
    h: 'Die Bibel widerspricht der Blutsühne selbst',
    body: 'Hesekiel weist ausdrücklich zurück, dass ein Sohn für die Schuld des Vaters büßt (18:19-23). König Salomo verspricht den Israeliten Vergebung durch bloße Umkehr (1. Könige 8:46-50). Ninive — mehr als 120.000 Menschen — wird verschont, weil es fastet und bereut, nicht weil es opfert (Jona 3:6-10). Jesus selbst lehrt im Vaterunser: „Erlass uns unsere Schulden, wie auch wir sie unseren Schuldnern erlassen haben" (Matthäus 6:12) — Vergebung durch Erlass, nicht durch Übertragung der Schuld auf einen Dritten.',
  },
  {
    n: 'III',
    h: 'Keine göttliche Inspiration, keine Augenzeugen',
    body: 'Die Evangelien sind anonym — die Namen Matthäus, Markus, Lukas, Johannes tauchen erst um 180 n. Chr. auf. Markus entstand um 70, Matthäus/Lukas um 80-85, Johannes um 90-100 n. Chr. — Jahrzehnte nach den Ereignissen, von Autoren in der dritten Person, in literarischer Abhängigkeit voneinander (identische Redaktionskommentare wie „der Leser begreife" in Matthäus 24:15 und Markus 13:14) und mit nachweisbaren Widersprüchen (Kreuzigungsdatum bei Johannes verschoben; Maria Magdalenas Bericht bei Matthäus und Johannes unvereinbar; die Auferstehung „vieler Heiliger" nur bei Matthäus, von keinem Historiker der Zeit, nicht einmal Josephus, bestätigt).',
  },
  {
    n: 'IV',
    h: 'Nicht getötet, nicht gekreuzigt',
    body: 'Der Qur’an: „Aber sie haben ihn weder getötet noch gekreuzigt, sondern es erschien ihnen so" (4:157-158). Jesus selbst betet kurz vor der Verhaftung: „Mein Vater, wenn es möglich ist, gehe dieser Kelch an mir vorüber" (Matthäus 26:39) — kaum die Bitte eines Mannes, dessen Sendung im Kreuzestod bestehen soll. Psalm 91 verspricht dem Gesalbten, dass ihm „kein Unheil" begegnet und die Engel ihn „tragen" — dieselbe Prophezeiung, die Jesus in Matthäus 4:5-7 auf sich selbst bezieht.',
  },
]

export const kreuzBelege: Record<string, Beleg> = {
  q3953: {
    typ: 'quran',
    kurz: 'Verliert nicht die Hoffnung auf Allahs Barmherzigkeit. Allah vergibt die Sünden alle.',
    original: 'قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا',
    sprache: 'ar',
    translit: 'qul yā ʿibādiya lladhīna asrafū ʿalā anfusihim lā taqnaṭū min raḥmati llāh, inna llāha yaghfiru dh-dhunūba jamīʿā',
    uebersetzung:
      '„Sag: O Meine Diener, die ihr gegen euch selbst maßlos gewesen seid, verliert nicht die Hoffnung auf Allahs Barmherzigkeit. Gewiss, Allah vergibt die Sünden alle. Er ist ja der Allvergebende und Barmherzige." Keine Bedingung außer der Umkehr selbst.',
    fundstelle: 'Sure 39 (az-Zumar), Vers 53',
    kern: 'يَغْفِرُ الذُّنُوبَ جَمِيعًا',
  },
  q1715: {
    typ: 'quran',
    kurz: 'Keine lasttragende Seele nimmt die Last einer anderen auf sich.',
    original: 'وَلَا تَزِرُ وَازِرَةٌ وِزْرَ أُخْرَىٰ',
    sprache: 'ar',
    translit: 'wa-lā taziru wāziratun wizra ukhrā',
    uebersetzung:
      '„Wer der Rechtleitung folgt, der ist nur zu seinem eigenen Vorteil rechtgeleitet. Und wer irregeht, der geht nur zu seinem Nachteil irre. Und keine lasttragende Seele nimmt die Last einer anderen auf sich." — Jeder trägt seine eigene Schuld; niemand kann sie stellvertretend übernehmen.',
    fundstelle: 'Sure 17 (al-Isrāʾ), Vers 15',
    kern: 'وِزْرَ أُخْرَىٰ',
  },
  hesekiel18: {
    typ: 'bibel',
    kurz: 'Wenn der Schuldige umkehrt, wird ihm keines seiner Vergehen angerechnet.',
    uebersetzung:
      'Das jüdische Volk im babylonischen Exil fragt: „Warum trägt der Sohn nicht mit an der Schuld seines Vaters?" Gottes Antwort durch Hesekiel: „Wenn der Schuldige sich von allen Sünden, die er getan hat, abwendet … dann wird er bestimmt am Leben bleiben und nicht sterben. Keines der Vergehen … wird ihm angerechnet … Habe ich etwa Gefallen am Tod des Schuldigen … und nicht vielmehr daran, dass er seine bösen Wege verlässt?" Vergebung durch Umkehr — ohne jedes Blutopfer.',
    fundstelle: 'Hesekiel 18,19–23',
    kern: 'wird ihm keines … angerechnet',
  },
  jonaNinive: {
    typ: 'bibel',
    kurz: 'Über 120.000 Menschen vergeben — durch Fasten und Umkehr, ohne ein einziges Opfer.',
    uebersetzung:
      'Gott droht Ninive, „die große Stadt, in der mehr als hundertzwanzigtausend Menschen leben", mit Zerstörung. Der König ruft zum Fasten und zur Umkehr auf — Mensch und Tier. „Und Gott sah ihr Verhalten; er sah, dass sie umkehrten … Da reute Gott das Unheil … und er führte die Drohung nicht aus." Obwohl Tiere zur Verfügung standen, wurde keines geopfert.',
    fundstelle: 'Jona 1,1–2 · 3,6–10 · 4,11',
    kern: 'kein Opfer',
  },
  vaterunser: {
    typ: 'bibel',
    kurz: 'Erlass uns unsere Schulden, wie auch wir sie unseren Schuldnern erlassen haben.',
    uebersetzung:
      'Im Vaterunser lehrt Jesus: „Und erlass uns unsere Schulden, wie auch wir sie unseren Schuldnern erlassen haben … Denn wenn ihr den Menschen ihre Verfehlungen vergebt, dann wird euer himmlischer Vater auch euch vergeben." Vergebung heißt: auf die Schuld verzichten — nicht, sie auf einen Dritten zu übertragen. Wer die Schuld eines Schuldners von jemand anderem eintreiben lässt, hat nicht vergeben.',
    fundstelle: 'Matthäus 6,9–15',
    kern: 'erlass uns unsere Schulden',
  },
  zachaeus: {
    typ: 'bibel',
    kurz: 'Heute ist diesem Haus das Heil geschenkt worden — noch vor dem Kreuz.',
    uebersetzung:
      'Der Zöllner Zachäus verspricht Buße und Wiedergutmachung. Jesus sagt sofort: „Heute ist diesem Haus das Heil geschenkt worden." Errettung wird hier durch Reue und Wiedergutmachung gewährt — am selben Tag, nicht erst durch ein späteres Kreuzesereignis Jahre danach.',
    fundstelle: 'Lukas 19,1–10',
    kern: 'Heute ist … das Heil geschenkt',
  },
  q4157: {
    typ: 'quran',
    kurz: 'Sie haben ihn weder getötet noch gekreuzigt — vielmehr hat Allah ihn zu Sich erhoben.',
    original: 'وَمَا قَتَلُوهُ وَمَا صَلَبُوهُ وَلَٰكِن شُبِّهَ لَهُمْ ۚ ... بَل رَّفَعَهُ اللَّهُ إِلَيْهِ',
    sprache: 'ar',
    translit: 'wa-mā qatalūhu wa-mā ṣalabūhu wa-lākin shubbiha lahum … bal rafaʿahu llāhu ilayh',
    uebersetzung:
      '„Aber sie haben ihn weder getötet noch gekreuzigt, sondern es erschien ihnen so. Und diejenigen, die sich darüber uneinig sind, befinden sich wahrlich im Zweifel darüber. Sie haben kein Wissen darüber, außer dass sie Mutmaßungen folgen. Und sie haben ihn mit Gewissheit nicht getötet. Nein! Vielmehr hat Allah ihn zu Sich erhoben."',
    fundstelle: 'Sure 4 (an-Nisāʾ), Vers 157–158',
    kern: 'بَل رَّفَعَهُ اللَّهُ',
  },
  psalm91: {
    typ: 'bibel',
    kurz: 'Dir begegnet kein Unheil — Er befiehlt Seinen Engeln, dich zu behüten.',
    uebersetzung:
      '„Dir begegnet kein Unheil, kein Unglück naht deinem Zelt. Denn er befiehlt seinen Engeln, dich zu behüten auf all deinen Wegen; sie tragen dich auf ihren Händen … Wenn er mich anruft, dann will ich ihn erhören. Ich bin bei ihm in der Not, befreie ihn." Jesus selbst bestätigt diese Prophezeiung als über sich selbst (Matthäus 4:5–7) — sie schließt jede Möglichkeit eines geschädigten, gekreuzigten Messias aus.',
    fundstelle: 'Psalm 91,10–15 · vgl. Matthäus 4,5–7',
    kern: 'kein Unheil',
  },
  gethsemane: {
    typ: 'bibel',
    kurz: 'Mein Vater, wenn es möglich ist, gehe dieser Kelch an mir vorüber.',
    uebersetzung:
      '„Meine Seele ist zu Tode betrübt … Mein Vater, wenn es möglich ist, gehe dieser Kelch an mir vorüber. Aber nicht wie ich will, sondern wie du willst." Wenn die Kreuzigung der zentrale Zweck der Sendung Jesu war, warum bittet er Gott, sie zu verhindern?',
    fundstelle: 'Matthäus 26,38–39',
    kern: 'gehe dieser Kelch … vorüber',
  },
  jesaja53Kinder: {
    typ: 'bibel',
    kurz: 'Er wird Nachkommen sehen und lange leben — ein Detail, das nicht zu Jesus passt.',
    uebersetzung:
      'Jesaja 53:10 sagt vom leidenden Knecht: „Er wird Nachkommen sehen und lange leben." Das Neue Testament berichtet nirgends von Kindern Jesu, und ein „langes Leben" widerspricht der Ewigkeit, die Trinitarier ihm zuschreiben. Wer Leiden wörtlich, aber Nachkommenschaft und langes Leben metaphorisch liest, wählt willkürlich aus demselben Vers aus.',
    fundstelle: 'Jesaja 53,10',
    kern: 'Nachkommen sehen und lange leben',
  },
  basiliden: {
    typ: 'quelle',
    kurz: 'Simon von Kyrene wurde an Christi statt gekreuzigt — eine Lehre aus dem 1. Jahrhundert.',
    uebersetzung:
      'Die Basiliden, Anhänger des Gelehrten Basilides von Alexandria (1. Jh.), lehrten: „Es war jedoch nicht Christus, der litt, sondern Simon von Kyrene, der gezwungen war, das Kreuz für ihn zu tragen, und fälschlicherweise an Christi statt gekreuzigt wurde." Der Gedanke einer stellvertretenden Kreuzigung ist damit keine qur’anische Erfindung, sondern reicht in die früheste Kirchengeschichte zurück — mit Überlieferungen, die Basilides mit Jüngern wie Petrus in Verbindung bringen.',
    fundstelle: 'Abu Zakariya, ebd., Anm. 69–70',
  },
}

export const kreuzSpielregeln: Regel[] = [
  { regel: 'Stellvertretung ist keine Vergebung', text: 'Wer die Schuld eines anderen begleichen lässt, hat nicht vergeben, sondern die Rechnung weitergereicht. Echte Vergebung verzichtet, ohne Bezahlung zu verlangen.' },
  { regel: 'Ein Justizmaßstab für alle', text: 'Ein menschliches Gericht, das Unschuldige stellvertretend bestraft, gilt als korrupt. Derselbe Maßstab muss für die Theologie gelten, die Gott hinter ein solches System stellt.' },
  { regel: 'Augenzeugenschaft prüfen', text: 'Identität, Inhalt und Entstehungsdatum eines Berichts entscheiden über seinen Beweiswert — genau wie bei einem Zeugen vor Gericht.' },
  { regel: 'Literarische Abhängigkeit als Signal', text: 'Wortgleiche Formulierungen und identische redaktionelle Einschübe an derselben Stelle zeigen Abschreiben, nicht unabhängige, göttlich inspirierte Zeugenschaft.' },
]

export const kreuzKonter: KonterItem[] = [
  {
    tier: 'stone',
    einwand: '„Ohne Blutvergießen gibt es keine Vergebung — das steht doch in der Bibel selbst (Hebräer 9:22)."',
    konter:
      'Genau das widerlegt das Alte Testament an mehreren Stellen: Hesekiel weist ausdrücklich zurück, dass ein Sohn für die Schuld des Vaters büßt, und verspricht Vergebung durch bloße Umkehr. Ninive — über 120.000 Menschen — wird vergeben, ohne dass auch nur ein Tier geopfert wird, obwohl Tiere vorhanden waren. Die Prämisse der Blutsühne steht damit im Widerspruch zum Rest der Schrift, auf die sie sich beruft.',
    belegId: 'hesekiel18',
  },
  {
    tier: 'stone',
    einwand: '„Gottes Liebe zeigt sich doch gerade darin, dass er seinen Sohn für uns hingab."',
    konter:
      'Ein menschliches Gericht, das einen Unschuldigen stellvertretend für den Schuldigen bestraft, würde als Justizirrtum gelten. Wie viel ungerechter wäre dasselbe System, wenn Gott dahinterstünde? Zudem: Wenn Jesus Gott ist, läuft die Kreuzigung darauf hinaus, dass Gott sich selbst opfert, um sich selbst zu besänftigen — ein in sich widersprüchliches System, kein Akt reiner Liebe.',
    belegId: 'vaterunser',
  },
  {
    tier: 'stone',
    einwand: '„Die Kreuzigung ist doch eine der bestbezeugten Tatsachen der Geschichte."',
    konter:
      'Die vier Evangelien sind anonym verfasst — die Zuschreibungen an Matthäus, Markus, Lukas und Johannes tauchen erst um 180 n. Chr. auf, laut Justin dem Märtyrer noch um 150 n. Chr. schlicht „Memoiren der Apostel". Sie entstanden 40 bis 70 Jahre nach den Ereignissen, in literarischer Abhängigkeit voneinander (identische redaktionelle Kommentare wie „der Leser begreife"), mit nachweislichen Widersprüchen bei Datum, Ablauf und Zeugen. Das ist nicht das Profil unabhängiger Augenzeugenberichte.',
    belegId: 'basiliden',
  },
  {
    tier: 'stone',
    einwand: '„Der Qur’an behauptet doch nur 600 Jahre später das Gegenteil, ohne jede Grundlage."',
    konter:
      'Psalm 91 — von Jesus selbst als Prophezeiung über sich bestätigt (Matthäus 4:5–7) — verspricht dem Gesalbten, dass ihm „kein Unheil" begegnet und die Engel ihn „tragen". Jesus betet in Gethsemane ausdrücklich, der Kreuzestod möge an ihm vorübergehen (Matthäus 26:39). Und bereits im 1. und 2. Jahrhundert leugneten christliche Gruppen wie die Basiliden die tatsächliche Kreuzigung Jesu. Der Qur’an steht damit nicht allein gegen, sondern in Übereinstimmung mit älteren Fäden der eigenen Tradition.',
    belegId: 'psalm91',
  },
  {
    tier: 'marble',
    einwand: '„Die Auferstehung vieler Heiliger in Matthäus 27 zeigt doch die Macht der Kreuzigung."',
    konter:
      'Kein anderes Evangelium erwähnt dieses Ereignis — nicht einmal Markus, dessen Bericht sonst fast wortgleich ist. Paulus, der die Gelegenheit gehabt hätte, es gegen Auferstehungsskeptiker zu verwenden (1. Korinther 15:12), erwähnt es nie. Der Historiker Josephus, Zeitgenosse und Chronist Jerusalems, schweigt ebenfalls. Selbst konservative Apologeten wie Mike Licona nennen die Passage eine „Legende" und „Spezialeffekte"; William Lane Craig räumt ein, kaum ein zeitgenössischer konservativer Gelehrter behandle sie als historisch.',
    belegId: 'jesaja53Kinder',
  },
]

export const kreuzScholar: ScholarItem[] = [
  {
    tier: 'stone',
    h: '4.1 — Die synoptische Abhängigkeit als Beweis gegen Inspiration',
    body: 'Matthäus 24:15–16 und Markus 13:14 enthalten denselben redaktionellen Einschub „der Leser begreife" an exakt derselben Stelle der Jesus-Rede — ein Kommentar der Autoren an ihre Leser, kein Jesus-Zitat. Zwei unabhängig, göttlich inspirierte Zeugen würden nicht zufällig denselben Einschub an derselben Stelle produzieren; die wahrscheinlichste Erklärung ist literarisches Abschreiben mit Bearbeitung — belegt auch am Fall der blutflüssigen Frau (Markus 5 vs. Matthäus 9) und der Sturmstillung (Markus 4 vs. Lukas 8), wo jeweils der spätere Text die Darstellung glättet oder Jesus mächtiger erscheinen lässt.',
  },
  {
    tier: 'stone',
    h: '4.2 — Datierung: Zwischen 30 und 150 n. Chr. eingegrenzt',
    body: 'Die Evangelien müssen nach Jesu Himmelfahrt (~30 n. Chr.) und vor Justins expliziten Zitaten (~150 n. Chr.) entstanden sein. Paulus (50er/60er Jahre) erwähnt oder zitiert keines der Evangelien, obwohl er als vielgereister, gut vernetzter Mann davon gewusst hätte — das schiebt die Entstehung nach 60 n. Chr. Auf Basis literarischer Abhängigkeiten und historischer Anspielungen datiert die Forschung: Markus ~70, Matthäus/Lukas ~80–85, Johannes ~90–100 n. Chr. Der neutestamentliche Gelehrte Christopher Tuckett hält fest, man lerne aus den Evangelien „so viel, wenn nicht sogar mehr, über [die späteren Christen] als über Jesus selbst".',
  },
  {
    tier: 'stone',
    h: '4.3 — Johannes datiert die Kreuzigung um',
    body: 'Markus, Matthäus und Lukas lassen Jesus das Passahmahl mit den Jüngern essen; Johannes lässt ihn stattdessen am Rüsttag des Passahfestes sterben — zeitgleich mit der Schlachtung der Passahlämmer. Nur Johannes nennt Jesus das „Lamm Gottes" (1:29). Bauckham und Tuckett stimmen überein: Johannes ist „eine viel gründlicher interpretierte Version der Geschichte Jesu" — theologisch bedeutsam, aber nicht chronologisch verlässlich.',
  },
  {
    tier: 'marble',
    h: '4.4 — Docetische Gruppen und die Zuverlässigkeit ihrer Gegner',
    body: 'Basiliden, Philadelphier und Trallianer bezweifelten je auf ihre Weise die reale Kreuzigung — Überlieferungen, die teils bis zu den Jüngern zurückreichen sollen. Kritiker entwerten sie über die Berichte ihrer kirchlichen Gegner; doch dieselben Gegner (Irenäus, Eusebius, Epiphanius) erhoben gegen andere Gruppen erwiesenermaßen erfundene Vorwürfe von Kannibalismus und Orgien — widerlegt durch die Nag-Hammadi-Funde, die stattdessen strenge Askese zeigen. Anklagen der Kirchenväter gegen abweichende Gruppen sind daher mit Vorsicht zu lesen.',
  },
]

export const kreuzVernetzung = [
  { ziel: 'Band 3 — Der wahre Jesus', text: 'Ein Jesus, der durchgehend als Diener spricht und in Gethsemane um Rettung vor dem Kreuz bittet, passt schwer zu einer Sendung, deren Zentrum das Kreuz sein soll.' },
  { ziel: 'Band 5 — Die verlorene Botschaft', text: 'Dass die Evangelien anonym, spät und literarisch voneinander abhängig sind, wirft dieselbe Frage auf, die auch die Überlieferung des restlichen Neuen Testaments betrifft: Was wurde bewahrt — und was verändert?' },
  { ziel: 'Band 2 — Das Gotteskonzept', text: 'Wenn Jesus Gott ist, bedeutet die Kreuzigung, dass Gott sich selbst opfert, um sich selbst zu besänftigen — ein weiteres Paradox, das zum Fälschungstest aus Band 2 zurückführt.' },
]

export const kreuzKernaussage =
  'Vergebung, die ein Opfer verlangt, ist keine Vergebung — die Bibel selbst sagt das an Hesekiel und Ninive. Und ein Bericht, dessen anonyme Autoren Jahrzehnte später, literarisch voneinander abschreibend und widersprüchlich schrieben, trägt nicht das Gewicht historischer Gewissheit. Der Qur’an schließt die Lücke: nicht getötet, nicht gekreuzigt — erhoben.'
