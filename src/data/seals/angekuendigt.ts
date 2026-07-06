import type { Beleg } from '../types'
import type { Step, KonterItem, ScholarItem, Regel } from './wahrheitssuche'

// ---------------------------------------------------------------------------
// BAND 6 — DER ANGEKÜNDIGTE PROPHET
// Kap. 8 (Jesus prophezeit einen anderen Propheten nach ihm: der Beistand aus
// Johannes 14-16, Deuteronomium 33, Jesaja 42, die Ismael-Kontroverse) +
// Abschliessende Worte. Vollstaendig aus der MD extrahiert (Zeilen 3535-4620).
// ---------------------------------------------------------------------------

export const angekuendigtThese =
  'Jesus selbst kündigt einen Beistand an, der „in die ganze Wahrheit führen" wird — jemand, der nicht aus sich selbst redet, sondern verkündet, was er hört (Johannes 16:13). Zwei alttestamentliche Prophezeiungen zeichnen dieses Kommen im Detail: Mose segnet Israel mit der Vision, dass der Herr „aus dem Gebirge Paran" — Arabien, dem Land Ismaels — strahlen wird, begleitet von „Zehntausend Heiligen" und einem „feurigen Gesetz" (Deuteronomium 33:2). Jesaja beschreibt einen Diener, der mit Kedar und Sela — beides Orte in Arabien, verbunden mit den Nachkommen Ismaels — verknüpft ist, der Götzendienst beendet und den Völkern ein neues Recht bringt (Jesaja 42). Der einzige Grund, warum diese Prophezeiungen nicht längst auf Muhammad ﷺ bezogen werden, ist ein jahrtausendealtes Missverständnis über Ismael selbst — eines, das der Bibeltext an mehreren Stellen gegen sich selbst widerlegt.'

export const angekuendigtSteps: Step[] = [
  {
    n: 'I',
    h: 'Der Beistand nach Jesus',
    body: 'Jesus verspricht: „Ich werde den Vater bitten, und er wird euch einen anderen Beistand geben … Wenn aber jener kommt, der Geist der Wahrheit, wird er euch in die ganze Wahrheit führen. Denn er wird nicht aus sich selbst heraus reden, sondern … euch verkünden, was kommen wird" (Johannes 14:16, 16:13). Diese Beschreibung — jemand, der lehrt, erinnert und ausschließlich verkündet, was ihm eingegeben wurde — passt exakt auf die Offenbarung des Qur’an durch den Engel Gabriel.',
  },
  {
    n: 'II',
    h: 'Deuteronomium 33: Sinai, Seïr, Paran',
    body: 'Mose segnet Israel: „Der Herr kam hervor aus dem Sinai (Moses), er leuchtete vor ihnen auf aus Seïr (Jesus, Palästina), er strahlte aus dem Gebirge Paran (Arabien, Ismaels Wohnort) … er trat heraus aus Zehntausend Heiligen. Ihm zur Rechten flammte das Feuer des Gesetzes" (33:1-2). Paran wird von Strong’s Dictionary, Clarke’s Commentary und der Encyclopaedia Biblica übereinstimmend als arabische Wüste identifiziert. Im Jahr 630 n. Chr. betrat Muhammad ﷺ Mekka mit exakt zehntausend Gefährten — der Eroberung Mekkas — und brachte den Qur’an, das „feurige Gesetz".',
  },
  {
    n: 'III',
    h: 'Jesaja 42: Diener, Kedar, Sela',
    body: '„Mein Knecht, den ich stütze … mein Erwählter" — im Arabischen: Abd-Allah, Mustafa, Habibullah, allesamt Beinamen Muhammads. Jesaja verortet diesen Diener bei „Kedar" (Sohn Ismaels, Stammvater arabischer Stämme) und „Sela" (ein Berg bei Medina). Er wird Götzendienst beenden („meinen Ruhm nicht den Götzen", 42:8) und als Krieger auftreten (42:13) — beides trifft auf Muhammad zu, nicht auf den pazifistischen, unter jüdischen Monotheisten wirkenden Jesus (Matthäus 26:52, Johannes 18:36).',
  },
  {
    n: 'IV',
    h: 'Die Ismael-Vertuschung',
    body: 'Das hebräische yachid („einziger Sohn") in Genesis 22:2 kann sich nur auf Ismael beziehen, der 13 Jahre älter war als Isaak — Isaak war nie Abrahams „einziger" Sohn. Der jüdische Konvertit, den Umar ibn al-Khattab befragte, bestätigt: „Ismael. Die Juden wissen dies, aber sie waren eifersüchtig." Genesis 16:12 („Wildesel") widerspricht dem hebräischen Kontext (pere’/para’, „fruchtbar") und wird von der samaritanischen Tora anders gelesen: „ein fruchtbarer Mann … die Hand aller wird mit ihm sein."',
  },
]

export const angekuendigtBelege: Record<string, Beleg> = {
  johannes1613: {
    typ: 'bibel',
    kurz: 'Wenn der Geist der Wahrheit kommt, wird er euch in die ganze Wahrheit führen.',
    uebersetzung:
      '„Noch vieles habe ich euch zu sagen, aber ihr könnt es jetzt nicht tragen. Wenn aber jener kommt, der Geist der Wahrheit, wird er euch in die ganze Wahrheit führen. Denn er wird nicht aus sich selbst heraus reden, sondern er wird sagen, was er hört, und euch verkünden, was kommen wird." Ein Beistand, der nicht aus sich selbst spricht, sondern nur weitergibt, was er empfängt — die Beschreibung einer Offenbarung, nicht einer göttlichen Person.',
    fundstelle: 'Johannes 16,12–13 · vgl. 14,16.26',
    kern: 'in die ganze Wahrheit führen',
  },
  deut332: {
    typ: 'bibel',
    kurz: 'Der Herr kam aus dem Sinai, leuchtete aus Seïr, strahlte aus dem Gebirge Paran — mit Zehntausend Heiligen.',
    uebersetzung:
      '„Der Herr kam hervor aus dem Sinai, er leuchtete vor ihnen auf aus Seïr, er strahlte aus dem Gebirge Paran, er trat heraus aus Tausenden von Heiligen. Ihm zur Rechten flammte vor ihnen das Feuer des Gesetzes." Drei Orte, drei Offenbarungen: Sinai (Mose), Seïr/Palästina (Jesus), Paran — die Wüste Ismaels in Arabien, wo Muhammad mit „Zehntausend" (rebabah, hebr. „eine sehr große Zahl") und einem neuen Gesetz hervortrat.',
    fundstelle: 'Deuteronomium 33,1–2',
    kern: 'aus dem Gebirge Paran',
  },
  q7157: {
    typ: 'quran',
    kurz: 'Sie finden ihn bei sich in der Tora und im Evangelium aufgeschrieben.',
    original: 'الَّذِينَ يَتَّبِعُونَ الرَّسُولَ النَّبِيَّ الْأُمِّيَّ الَّذِي يَجِدُونَهُ مَكْتُوبًا عِندَهُمْ فِي التَّوْرَاةِ وَالْإِنجِيلِ',
    sprache: 'ar',
    translit: 'alladhīna yattabiʿūna r-rasūla n-nabiyya l-ummiyya lladhī yajidūnahū maktūban ʿindahum fī t-tawrāti wa-l-injīl',
    uebersetzung:
      '„Die dem Gesandten, dem schriftunkundigen Propheten, folgen, den sie bei sich in der Tora und im Evangelium aufgeschrieben finden. Er gebietet ihnen das Rechte und verbietet ihnen das Verwerfliche … und er nimmt ihnen ihre Bürde und die Fesseln ab, die auf ihnen lagen." Der Qur’an behauptet ausdrücklich, Muhammad sei in den früheren Schriften angekündigt.',
    fundstelle: 'Sure 7 (al-Aʿrāf), Vers 157',
    kern: 'مَكْتُوبًا عِندَهُمْ',
  },
  jesaja421: {
    typ: 'bibel',
    kurz: 'Mein Knecht, den ich stütze, mein Erwählter — er bringt den Völkern das Recht.',
    uebersetzung:
      '„Seht, das ist mein Knecht, den ich stütze; das ist mein Erwählter, an ihm finde ich Gefallen. Ich habe meinen Geist auf ihn gelegt, er bringt den Völkern das Recht." Drei Titel — „Knecht" (Abd-Allah), „Erwählter" (Mustafa), „an ihm finde ich Gefallen" (Habibullah) — sind sämtlich traditionelle arabische Beinamen des Propheten Muhammad ﷺ.',
    fundstelle: 'Jesaja 42,1',
    kern: 'mein Erwählter',
  },
  jesaja4211: {
    typ: 'bibel',
    kurz: 'Die Dörfer, die Kedar bewohnt — die Bewohner von Sela sollen singen vor Freude.',
    uebersetzung:
      '„Die Wüste und ihre Städte sollen sich freuen, die Dörfer, die Kedar bewohnt. Die Bewohner von Sela sollen singen vor Freude und jubeln auf den Gipfeln der Berge." Kedar, Sohn Ismaels (Genesis 25:13), ist laut Smith’s Bible Dictionary Stammvater eines „großen arabischen Stammes" im Hedschas; Sela ist ein Berg bei Medina — exakt die Orte, in denen Muhammad und seine Gefährten bei der Ankunft in Medina „vor Freude schrien".',
    fundstelle: 'Jesaja 42,11',
    kern: 'die Dörfer, die Kedar bewohnt',
  },
  genesis222: {
    typ: 'bibel',
    kurz: 'Nimm deinen Sohn, deinen einzigen — ein Titel, der nur auf Ismael passt.',
    uebersetzung:
      '„Nimm deinen Sohn, deinen einzigen, den du liebst, Isaak … und bring ihn als Brandopfer dar." Das hebräische yachid („einzig Gezeugter") kann sich nicht auf Isaak beziehen, der Ismaels 13 Jahre jüngerer Bruder war — Ismael war Abrahams tatsächlicher „einziger" Sohn, bis Isaak geboren wurde. Selbst Paulus übernimmt in Hebräer 11:17 dasselbe Wort (griech. monogenes, „einzig Gezeugter").',
    fundstelle: 'Genesis 22,2 · vgl. Hebräer 11,17',
    kern: 'deinen Sohn, deinen einzigen',
  },
  umarKonvertit: {
    typ: 'quelle',
    kurz: 'Ismael. Die Juden wissen dies, aber sie waren eifersüchtig auf euch Araber.',
    uebersetzung:
      'Auf die Frage des Kalifen Umar, welcher Sohn geopfert werden sollte, antwortet ein zum Islam konvertierter jüdischer Gelehrter: „Ismael. Bei Gott, o Führer der Gläubigen, die Juden wissen dies, aber sie waren eifersüchtig auf euch Araber, weil es euer Vater war, bezüglich dessen Gott diesen Befehl erteilte … Sie bestritten das und behaupteten, es sei Isaak gewesen, weil er ihr Vater ist."',
    fundstelle: 'Abu Zakariya, ebd., Anm. 146',
  },
  genesis1612: {
    typ: 'bibel',
    kurz: '„Wildesel" oder „fruchtbarer Mann"? Die samaritanische Tora liest es anders.',
    uebersetzung:
      'Die masoretische Lesart „Er wird ein Mensch sein wie ein Wildesel" widerspricht dem Kontext — der Engel hatte Hagar gerade reichen Kindersegen verheißen. Das hebräische Wort pere’ ähnelt para’ („fruchtbar"), das Genesis 17:20 für dasselbe Versprechen verwendet. Der Samaritanische Pentateuch liest tatsächlich: „Er wird ein fruchtbarer Mann sein … die Hand aller wird mit ihm sein." Ein positiver, kein negativer Segen.',
    fundstelle: 'Genesis 16,12 · vgl. 17,20 und Samaritanischer Pentateuch',
    kern: 'ein fruchtbarer Mann',
  },
}

export const angekuendigtSpielregeln: Regel[] = [
  { regel: 'Gleicher Maßstab für Jesus und Muhammad', text: 'Wer vage Prophezeiungen für Jesus akzeptiert, muss aus Gründen der Konsequenz denselben Standard auch für Muhammad gelten lassen — nicht zwei Maßstäbe für zwei Personen.' },
  { regel: 'Das prophetische Perfekt', text: 'Hebräische Prophezeiungen beschreiben oft zukünftige Ereignisse in der Vergangenheitsform, um deren Gewissheit zu betonen (vgl. Genesis 6:18, 41:30) — die Zeitform allein schließt eine Zukunftsdeutung nicht aus.' },
  { regel: 'Ort vor Deutung', text: 'Wenn ein Prophezeiungsvers einen Ort nennt (Kedar, Sela, Paran), muss die Identifikation dieses Ortes der Interpretation vorausgehen — nicht umgekehrt an die gewünschte Person angepasst werden.' },
  { regel: 'Textinterne Widersprüche als Signal', text: 'Wenn derselbe Bibeltext an einer Stelle einen Segen und an der nächsten einen Fluch für dieselbe Person ausspricht (Ismael), ist das ein Hinweis auf spätere Veränderung, nicht auf ursprüngliche Kohärenz.' },
]

export const angekuendigtKonter: KonterItem[] = [
  {
    tier: 'stone',
    einwand: '„Der Beistand in Johannes 14-16 ist doch eindeutig der Heilige Geist der Dreifaltigkeit."',
    konter:
      'Diese Lesart setzt die Dreifaltigkeit voraus, die wir bereits als unbiblisch und historisch spät entstanden identifiziert haben. Der Beistand „redet nicht aus sich selbst", sondern gibt nur weiter, „was er hört" — exakt die Beschreibung einer Offenbarung durch einen Boten (den Engel Gabriel), nicht die einer göttlichen Person, die es laut Trinitätslehre selbst wäre.',
    belegId: 'johannes1613',
  },
  {
    tier: 'stone',
    einwand: '„Deuteronomium 33 steht in der Vergangenheitsform — das kann keine Zukunftsprophezeiung sein."',
    konter:
      'Das „prophetische Perfekt" ist eine anerkannte literarische Technik der hebräischen Prophetie, belegt u. a. bei Noah (Genesis 6:18), Josef (Genesis 41:30) und sogar bei Paulus (Epheser 2:6) — zukünftige, aber gewisse Ereignisse werden in der Vergangenheitsform geschildert, um ihre Unausweichlichkeit zu betonen.',
    belegId: 'deut332',
  },
  {
    tier: 'stone',
    einwand: '„Sela bezieht sich auf Petra in Edom (Jordanien), nicht auf Arabien."',
    konter:
      'Jesaja nennt Sela in direkter Verbindung mit „den Dörfern, die Kedar bewohnt" — und Kedar ist zweifelsfrei mit Arabien verknüpft (Genesis 25:13, Ezechiel 27:21). Die Edomiter und die Kedariten waren zwei getrennte Völker in getrennten Ländern; hätte Jesaja Edom gemeint, hätte er von den Edomitern gesprochen, nicht von Kedar. Zudem berichtet die Bibel von keinem Propheten, der je in Edom von jubelnden Menschenmengen empfangen wurde.',
    belegId: 'jesaja4211',
  },
  {
    tier: 'stone',
    einwand: '„Ismael war nur Abrahams unehelicher Sohn einer Sklavin — er kann nicht der ‚einzige Sohn‘ gewesen sein."',
    konter:
      'Die Bibel selbst widerlegt das: Hagar wird ausdrücklich als Abrahams „Frau" bezeichnet (Genesis 16:3), nicht als Konkubine, und Ismael wird noch nach Abrahams Tod als sein legitimer Sohn geführt, der ihn gemeinsam mit Isaak begräbt (Genesis 25:9). Das hebräische yachid passt nur auf einen einzigen, zu diesem Zeitpunkt einzigen Sohn — und das war 13 Jahre lang nur Ismael.',
    belegId: 'genesis222',
  },
  {
    tier: 'marble',
    einwand: '„Das ist doch reine muslimische Wunschinterpretation, um Muhammad nachträglich in die Bibel hineinzulesen."',
    konter:
      'Die textkritischen Anomalien existieren unabhängig von islamischer Auslegung: Der Widerspruch zwischen „einziger Sohn" und der Erwähnung Ismaels als älterem Bruder: Ismaels Alter beim Wüstenvorfall (Genesis 21 beschreibt einen Säugling, obwohl er laut Chronologie ein Teenager gewesen sein müsste), und der plötzliche Wechsel von Segen zu Fluch in Genesis 16:12 sind alles Beobachtungen, die auch nicht-muslimische Bibelkommentare (Interpreter’s Bible) als „widersprüchlich" einstufen.',
    belegId: 'genesis1612',
  },
]

export const angekuendigtScholar: ScholarItem[] = [
  {
    tier: 'stone',
    h: '6.1 — Die Eroberung Mekkas als Erfüllung von Deuteronomium 33',
    body: 'Ibn Abbas überliefert, dass der Prophet Muhammad ﷺ Mekka „in Begleitung von zehntausend" Kriegern betrat, achteinhalb Jahre nach der Auswanderung nach Medina — eine friedliche Eroberung ohne Plünderung, gekrönt von einer Generalamnestie für die einstigen Verfolger. Das hebräische rebabah in Deuteronomium 33:2 bedeutet laut Gesenius’ Lexikon „eine sehr große Zahl" — unabhängig von der genauen Übersetzung (zehntausend, Myriaden) bleibt die Kernaussage: eine Vielzahl von Anhängern mit einem feurigen Gesetz aus Arabien.',
  },
  {
    tier: 'stone',
    h: '6.2 — Jesaja 42 im Vergleich mit einem authentischen Hadith',
    body: 'Der Gefährte Abdullah ibn Amr beschreibt die in der Tora gefundenen Eigenschaften des Propheten fast wortgleich zu Jesaja 42:1-3.6-7: „Du bist Mein Diener und Mein Gesandter … Du bist weder grob noch hart noch machst du Lärm auf den Märkten … Gott wird ihn nicht sterben lassen, ehe er die Verdrehten aufgerichtet hat." Die Parallele legt nahe, dass frühe Muslime — vermutlich über jüdische Konvertiten wie Abdullah ibn Salaam — von dieser Prophezeiung wussten, ohne sie wörtlich zu zitieren.',
  },
  {
    tier: 'stone',
    h: '6.3 — Die Schriftrollen vom Toten Meer bestätigen Ibn Kathir',
    body: 'Der Qur’an-Exeget Ibn Kathir (14. Jh.) behauptete, das Alte Testament habe ursprünglich vom „erstgeborenen Sohn" gesprochen, nicht von Isaak namentlich — eine Lesart, die durch das Buch der Jubiläen aus den Schriftrollen vom Toten Meer (18:11: „deinen erstgeborenen Sohn") fast 700 Jahre nach Ibn Kathirs Tod bestätigt wurde. Die Äthiopisch-Orthodoxe Kirche zählt die Jubiläen bis heute zum Kanon.',
  },
  {
    tier: 'marble',
    h: '6.4 — Warum der Qur’an Isaak häufiger nennt als Ismael',
    body: 'Der Qur’an erwähnt Isaak 17-mal, Ismael 12-mal — ein auffälliger Befund, wenn man annimmt, arabische Überlieferer hätten den Text nationalistisch verzerrt, um den eigenen Ahnen Ismael überzubetonen. Stattdessen zeichnet der Qur’an beide Söhne konsistent als große Propheten (2:136), ohne den einen gegen den anderen auszuspielen — ein Kontrast zur biblischen Erzählung, die zwischen Segen und Verwerfung Ismaels schwankt.',
  },
]

export const angekuendigtVernetzung = [
  { ziel: 'Band 5 — Die verlorene Botschaft', text: 'Dass Genesis 22 und 16 gegen sich selbst widersprechen, ist derselbe Typ von Textbefund, der bereits beim Comma Johanneum und den Paulusbriefen zu finden war: verändert, nicht ursprünglich.' },
  { ziel: 'Band 1 — Die Wahrheitssuche', text: 'Der Kreis schließt sich: Dieselbe Ermittlungsmethode — Bibel, Geschichte, Vernunft, gleiche Maßstäbe für alle Seiten — führt am Ende zur Frage nach dem letzten Gesandten in der Kette, die mit Abraham begann.' },
  { ziel: 'Band 3 — Der wahre Jesus', text: 'Wenn Jesus selbst einen Beistand ankündigt, der „in die ganze Wahrheit führt", ergänzt das genau die Rolle, die der Qur’an für sich beansprucht: nicht Ersatz, sondern Wiederherstellung.' },
]

export const angekuendigtKernaussage =
  'Zwei Prophezeiungen, ein Ort: Arabien. Nicht weil man es so will, sondern weil Paran, Kedar und Sela es so benennen — und weil die Einwände gegen Ismael sich bei näherem Hinsehen gegen den Bibeltext selbst richten, der sie erhebt. Der angekündigte Beistand kam nicht als eine vierte göttliche Person, sondern als das letzte Glied einer Kette, die mit Abraham begann.'
