import type { Beleg } from '../types'
import type { Step, KonterItem, ScholarItem, Regel, Fakt, Duo } from './wahrheitssuche'

// ---------------------------------------------------------------------------
// BAND 5 — DIE VERLORENE BOTSCHAFT
// Kap. 6 (Die Bewahrung von Offenbarungen: NT-Handschriften vs. Qur'an-
// Ueberlieferung) + Kap. 7 (Paulus: treuer Anhaenger oder Erfinder einer
// neuen Religion?). Vollstaendig aus der MD extrahiert (Zeilen 2503-3535).
// ---------------------------------------------------------------------------

export const botschaftThese =
  'Zwei Fragen entscheiden, ob eine Botschaft noch die ursprüngliche ist: Wurde der Text bewahrt — und wurde die Lehre bewahrt? Beim Neuen Testament lautet die Antwort zweimal Nein: kein Satz einheitlich überliefert, und zwischen Jesus und Paulus verkehrt sich die Lehre vom Gesetz in ihr Gegenteil. Der Qur’an dagegen wird bis heute von Millionen identisch auswendig rezitiert.'

export const botschaftFakten: Fakt[] = [
  { wert: '≈ 6.000', label: 'griechische NT-Handschriften — keine zwei Seiten identisch', ton: 'rot' },
  { wert: '16. Jh.', label: 'Comma Johanneum — der einzige Trinitätsvers, ein Einschub', ton: 'rot' },
  { wert: '180 Jahre', label: 'größte Lücke bis zum frühesten erhaltenen Fragment (Markus)', ton: 'rot' },
  { wert: 'Millionen', label: 'Menschen, die den ganzen Qur’an auswendig tragen', ton: 'gruen' },
]

// Das Gesetz Moses — zwei Stimmen im selben Neuen Testament.
// Links (rot) die spaetere Umkehrung, rechts (gruen) Jesu eigene Worte.
export const botschaftDuo: Duo = {
  links: {
    titel: 'Paulus über das Gesetz',
    zeilen: [
      { text: '„Durch Werke des Gesetzes wird niemand gerecht."', ref: 'Galater 2,16' },
      { text: '„Alle aber, die nach dem Gesetz leben, stehen unter dem Fluch."', ref: 'Galater 3,10' },
      { text: '„Jetzt aber sind wir frei geworden von dem Gesetz … wir sind tot für das Gesetz."', ref: 'Römer 7,6' },
    ],
  },
  rechts: {
    titel: 'Jesus über das Gesetz',
    zeilen: [
      { text: '„Ich bin nicht gekommen, um aufzuheben, sondern um zu erfüllen."', ref: 'Matthäus 5,17' },
      { text: '„Bis Himmel und Erde vergehen, wird auch nicht der kleinste Buchstabe des Gesetzes vergehen."', ref: 'Matthäus 5,18' },
      { text: '„Wer sie aber hält und halten lehrt, der wird groß sein im Himmelreich."', ref: 'Matthäus 5,19' },
    ],
  },
}

export const botschaftSteps: Step[] = [
  {
    n: 'I',
    h: 'Handschriften ohne Original',
    body: 'Das früheste Fragment des Neuen Testaments (P52) datiert auf ~125 n. Chr. — Jahrzehnte nach der Abfassung der Evangelien. Fast 6.000 griechische Handschriften existieren, „von denen keine zwei Seiten identisch sind" (Interpreter’s Dictionary of the Bible). Ohne das Original gibt es keine Methode, mit Sicherheit festzustellen, welche Lesart die ursprüngliche ist — wie selbst der führende Textkritiker Bruce Metzger bei Lukas 10:1 (70 oder 72 Jünger?) eingesteht: „Es ist nicht möglich, mit Sicherheit zu entscheiden."',
  },
  {
    n: 'II',
    h: 'Theologisch folgenreiche Einschübe',
    body: 'Das Comma Johanneum (1. Johannes 5:7) — der einzige Vers, der die Dreifaltigkeit ausdrücklich nennt — findet sich in keinem griechischen Manuskript vor dem 16. Jahrhundert. Die Geschichte der Ehebrecherin (Johannes 7:53-8:11) fehlt vor dem 5. Jahrhundert. Die Schlangen-Verse (Markus 16:9-20) fehlen in den ältesten vollständigen Codizes. Und 1. Korinther 14:34-35 (Frauen sollen schweigen) widerspricht Paulus’ eigenem Vers 11:5 und wandert in verschiedenen Handschriften an verschiedene Stellen — ein klassisches Zeichen späteren Einschubs.',
  },
  {
    n: 'III',
    h: 'Der Qur’an: Bewahrung durch Auswendiglernen',
    body: '„Wir sind es, die Wir die Ermahnung offenbart haben, und Wir werden wahrlich ihr Hüter sein" (15:9). Millionen Muslime weltweit kennen den gesamten Qur’an auswendig, in einer ununterbrochenen Kette bis zum Propheten Muhammad ﷺ zurück — verstärkt durch Tajwid (Ausspracheregeln) und die Isnad-Wissenschaft der Hadith-Überprüfung. Fälschungen wie die des Comma Johanneum wären sofort von tausenden unabhängigen Rezitatoren entdeckt worden.',
  },
  {
    n: 'IV',
    h: 'Paulus contra Jesus',
    body: 'Jesus: „Ich bin nicht gekommen, um aufzuheben, sondern um zu erfüllen … bis Himmel und Erde vergehen" (Matthäus 5:17-19). Paulus: „Durch Werke des Gesetzes wird niemand gerecht" (Galater 2:16), das Gesetz sei ein „Fluch" (Galater 3:10). Das Jerusalemer Konzil (Apostelgeschichte 15) verlangte von Heiden weiterhin, sich an vier Speisegesetze zu halten — Paulus erklärte später Götzenopferfleisch für unbedenklich (1. Korinther 8:4-8) und geriet in offenen Konflikt mit der Jerusalemer Gemeinde um Jakobus.',
  },
]

export const botschaftBelege: Record<string, Beleg> = {
  q159: {
    typ: 'quran',
    kurz: 'Wir haben die Ermahnung offenbart, und Wir werden wahrlich ihr Hüter sein.',
    original: 'إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ',
    sprache: 'ar',
    translit: 'innā naḥnu nazzalnā dh-dhikra wa-innā lahū la-ḥāfiẓūn',
    uebersetzung:
      '„Gewiss, Wir sind es, die Wir die Ermahnung offenbart haben, und Wir werden wahrlich ihr Hüter sein." Ein Bewahrungsversprechen, das keiner früheren Schrift gegeben wurde — und das durch massenhaftes Auswendiglernen bis heute eingelöst ist.',
    fundstelle: 'Sure 15 (al-Ḥijr), Vers 9',
    kern: 'لَحَافِظُونَ',
  },
  commaJohanneum: {
    typ: 'bibel',
    kurz: 'Drei sind es, die Zeugnis ablegen im Himmel — ein Vers ohne griechisches Manuskript vor dem 16. Jh.',
    uebersetzung:
      '„Drei sind es, die Zeugnis ablegen im Himmel: der Vater, das Wort und der Heilige Geist, und diese drei sind eins." Dieser Vers — bekannt als Comma Johanneum, die einzige explizite Erwähnung der Dreifaltigkeit im Neuen Testament — fehlt in jedem griechischen Manuskript vor dem 16. Jahrhundert. Moderne Übersetzungen wie Einheitsübersetzung und Lutherbibel haben ihn entfernt.',
    fundstelle: '1. Johannes 5,7 (Textus Receptus)',
    kern: 'diese drei sind eins',
  },
  metzgerLukas: {
    typ: 'quelle',
    kurz: 'Der Textkritiker muss eingestehen, dass es nicht möglich ist, mit Sicherheit zu entscheiden.',
    uebersetzung:
      'Bruce Metzger, einer der einflussreichsten neutestamentlichen Gelehrten des 20. Jahrhunderts, zur Frage, ob Jesus 70 oder 72 Jünger aussandte (Lukas 10:1): „Die externen Beweise sind nahezu gleichmäßig verteilt … Eine Gesamtbewertung … muss unentschieden bleiben … der Textkritiker muss schlicht und ergreifend eingestehen, dass es nicht möglich ist, mit Sicherheit zwischen den beiden zu entscheiden."',
    fundstelle: 'Abu Zakariya, ebd., Anm. 85',
  },
  galater216: {
    typ: 'bibel',
    kurz: 'Durch Werke des Gesetzes wird niemand gerecht.',
    uebersetzung:
      '„Weil wir aber erkannt haben, dass der Mensch nicht durch Werke des Gesetzes gerecht wird, sondern durch den Glauben an Jesus Christus … denn durch Werke des Gesetzes wird niemand gerecht." Paulus erklärt das Gesetz an anderer Stelle sogar zum „Fluch" (Galater 3:10) — eine radikale Umkehrung dessen, was Jesus selbst lehrte.',
    fundstelle: 'Galater 2,16 · 3,10',
    kern: 'wird niemand gerecht',
  },
  matthaeus517: {
    typ: 'bibel',
    kurz: 'Ich bin nicht gekommen, um aufzuheben, sondern um zu erfüllen.',
    uebersetzung:
      '„Denkt nicht, ich sei gekommen, um das Gesetz und die Propheten aufzuheben. Ich bin nicht gekommen, um aufzuheben, sondern um zu erfüllen. Amen, das sage ich euch: Bis Himmel und Erde vergehen, wird auch nicht der kleinste Buchstabe des Gesetzes vergehen … Wer sie aber hält und halten lehrt, der wird groß sein im Himmelreich." Das genaue Gegenteil von Paulus’ späterer Lehre.',
    fundstelle: 'Matthäus 5,17–20',
    kern: 'nicht aufzuheben, sondern zu erfüllen',
  },
  apg1520: {
    typ: 'bibel',
    kurz: 'Das Jerusalemer Konzil: Heiden sollen Götzenopferfleisch, Blut, Ersticktes und Unzucht meiden.',
    uebersetzung:
      'Als Streit über die Beschneidung von Heidenchristen ausbricht, entscheidet Jakobus, Jesu Bruder, mit Zustimmung der Apostel: Heiden müssen nicht beschnitten werden, sollen aber „Verunreinigung durch Götzen(opferfleisch) und Unzucht meiden und weder Ersticktes noch Blut essen" — eine direkte Anwendung von Levitikus 17-18 auf die neuen Gläubigen. Jahre später bekräftigt Paulus dieses Dekret persönlich vor denselben Ältesten (Apostelgeschichte 21,17-26) — bevor er in seinen eigenen Briefen Götzenopferfleisch für unbedenklich erklärt (1. Korinther 8,4-8).',
    fundstelle: 'Apostelgeschichte 15,12–21 · 21,17–26',
    kern: 'Eiferer für das Gesetz',
  },
  falschprophezeiung: {
    typ: 'bibel',
    kurz: 'Wir, die Lebenden, die noch übrig sind — Paulus erwartete das Ende zu seinen Lebzeiten.',
    uebersetzung:
      '„Wir, die Lebenden, die noch übrig sind, wenn der Herr kommt, werden den Verstorbenen nichts voraushaben … dann werden wir, die Lebenden, die noch übrig sind, zugleich mit ihnen auf den Wolken in die Luft entrückt." C. K. Barrett kommentiert: „Paulus erwartete die Parusie zu seinen Lebzeiten." Nach dem biblischen Test selbst (Deuteronomium 18:22) disqualifiziert eine nicht eingetroffene Prophezeiung ihren Sprecher als von Gott inspiriert.',
    fundstelle: '1. Thessalonicher 4,15–17 · 1. Korinther 15,51–52 · vgl. Deuteronomium 18,22',
    kern: 'die Lebenden, die noch übrig sind',
  },
  deuteronomium3014: {
    typ: 'bibel',
    kurz: 'Das Wort ist nah — du kannst es halten. Paulus zitiert es, ohne die letzten drei Worte.',
    uebersetzung:
      'Deuteronomium im Original: „Das Wort ist ganz nah bei dir, es ist in deinem Mund und in deinem Herzen, du kannst es halten." Paulus in Römer 10:8 zitiert denselben Satz — lässt aber „du kannst es halten" konsequent weg, um das genaue Gegenteil zu belegen: dass das Gesetz eben nicht gehalten werden kann.',
    fundstelle: 'Deuteronomium 30,14 · vgl. Römer 10,8',
    kern: 'du kannst es halten',
  },
  psalm14: {
    typ: 'bibel',
    kurz: 'Paulus zitiert „keiner tut Gutes" — und lässt die Gerechten im selben Psalm aus.',
    uebersetzung:
      'Paulus (Römer 3:10-12) zitiert Psalm 14: „Es gibt keinen, der gerecht ist … keiner tut Gutes." Doch derselbe Psalm spricht ausdrücklich von einer Gruppe der „Gerechten", die den Frevlern gegenübergestellt wird: „Gott steht auf der Seite der Gerechten." Aus dem Kontext gerissen, dient das Zitat einem Schluss, den der Psalm selbst widerlegt.',
    fundstelle: 'Psalm 14,1–5 · vgl. Römer 3,10–20',
    kern: 'auf der Seite der Gerechten',
  },
}

export const botschaftSpielregeln: Regel[] = [
  { regel: 'Ohne Original keine Gewissheit', text: 'Wer nur Kopien von Kopien besitzt, kann bestenfalls eine Schätzung der ursprünglichen Worte liefern — nie hundertprozentige Sicherheit.' },
  { regel: 'Kontext vor Zitat', text: 'Ein Zitat, das seinen Ursprungskontext verändert oder verkürzt, um das Gegenteil des Originalsinns zu belegen, ist keine Auslegung, sondern eine Verzerrung.' },
  { regel: 'Der Prophetentest', text: '„Wenn ein Prophet im Namen des Herrn spricht und sein Wort sich nicht erfüllt … dann ist es ein Wort, das nicht der Herr gesprochen hat" (Deuteronomium 18:22) — ein Maßstab, den auch neutestamentliche Autoren bestehen müssen.' },
  { regel: 'Autorität durch Nähe, nicht durch Vision', text: 'Wer Jesus persönlich kannte und mit ihm lebte, hat mehr Anspruch auf sein Verständnis als jemand, der ihm nie begegnete und sich auf eine private Vision beruft.' },
]

export const botschaftKonter: KonterItem[] = [
  {
    tier: 'stone',
    einwand: '„Textvarianten sind doch nur Rechtschreibfehler, die keine theologische Rolle spielen."',
    konter:
      'Die meisten Varianten sind das — aber nicht alle. Das Comma Johanneum ist die einzige explizite Dreifaltigkeitsformel im Neuen Testament und ein nachweislicher Einschub aus dem 16. Jahrhundert. Die Ehebrecherin-Geschichte, das lange Markus-Ende mit dem Schlangenhantieren und der Frauen-Schweigebefehl in 1. Korinther 14 sind allesamt spätere Zusätze mit erheblicher Lehrwirkung — keine bloßen Tippfehler.',
    belegId: 'commaJohanneum',
  },
  {
    tier: 'stone',
    einwand: '„Moderne Bibelwissenschaft hat doch längst alle Fälschungen identifiziert."',
    konter:
      'Das setzt voraus, dass genug frühe Manuskripte überlebt haben, um sie zu entdecken. Zwischen der Abfassung der Evangelien und ihren frühesten erhaltenen Fragmenten liegen 35 bis 180 Jahre einer Überlieferungslücke, in der nichts überlebt hat, was zum Vergleich herangezogen werden könnte. Fälschungen aus dieser Lücke blieben und bleiben grundsätzlich unentdeckbar — wie Bruce Metzger selbst bei ungelösten Fällen wie Lukas 10:1 eingesteht.',
    belegId: 'metzgerLukas',
  },
  {
    tier: 'stone',
    einwand: '„Paulus hat das Christentum doch nur weiterentwickelt, nicht Jesus widersprochen."',
    konter:
      'Jesus sagt ausdrücklich: „Ich bin nicht gekommen, um aufzuheben … bis Himmel und Erde vergehen, wird auch nicht der kleinste Buchstabe des Gesetzes vergehen." Paulus lehrt das Gegenteil: „Durch Werke des Gesetzes wird niemand gerecht", das Gesetz sei ein „Fluch". Das ist keine Weiterentwicklung, sondern eine Umkehrung — bestätigt durch den offenen Konflikt zwischen Paulus und der Jerusalemer Gemeinde um Jakobus.',
    belegId: 'galater216',
  },
  {
    tier: 'stone',
    einwand: '„Paulus berief sich doch auf das Alte Testament, um seine Theologie zu begründen."',
    konter:
      'Er tat es — aber nachweislich fehlerhaft. Bei Deuteronomium 30:14 lässt er den entscheidenden Schlussteil „du kannst es halten" weg, um das Gegenteil zu belegen. Bei Psalm 14 ignoriert er, dass derselbe Psalm ausdrücklich von den „Gerechten" spricht. Ein Schüler des berühmten Rabbi Gamaliel, wie Paulus sich selbst beschreibt, hätte diese Kontexte gekannt.',
    belegId: 'deuteronomium3014',
  },
  {
    tier: 'marble',
    einwand: '„Die vielen Handschriften des Neuen Testaments beweisen doch gerade seine gute Bezeugung."',
    konter:
      'Menge ersetzt keine Einheitlichkeit: Unter fast 6.000 griechischen Handschriften ist laut Interpreter’s Dictionary of the Bible „kein einziger Satz … völlig einheitlich" überliefert. Der Qur’an dagegen wird von Millionen Menschen weltweit identisch auswendig rezitiert, in einer durchgehenden Kette zum Propheten zurück — ein Bewahrungsmodell, das dem Neuen Testament aufgrund seiner Entstehungsgeschichte nie zur Verfügung stand.',
    belegId: 'q159',
  },
]

export const botschaftScholar: ScholarItem[] = [
  {
    tier: 'stone',
    h: '5.1 — Die Datierungslücke der Evangelien-Manuskripte',
    body: 'P52 (Johannes) datiert etwa 35 Jahre nach seiner mutmaßlichen Abfassung; P64/P67 (Matthäus) etwa 70 Jahre; P75 (Lukas) etwa 95 Jahre; P45 (Markus) sogar 180 Jahre. Vollständige Kopien existieren erst ab dem 4. Jahrhundert (Codex Sinaiticus). In dieser Lücke fehlt jeder Vergleichsmaßstab, der spätere Eingriffe zuverlässig sichtbar machen könnte.',
  },
  {
    tier: 'stone',
    h: '5.2 — Isnad contra anonyme Überlieferung',
    body: 'Jeder Hadith besteht aus Bericht und Überliefererkette (Isnad); islamische Gelehrte dokumentierten Geburts- und Sterbedaten, geografischen Standort und Gedächtnisstärke jedes Überlieferers, um authentische von schwachen Berichten zu unterscheiden. Das Neue Testament kennt dieses Instrument nicht: Die Evangelien sind anonym, ihre Zuschreibungen entstanden erst Generationen später, ohne nachvollziehbare Kette zu einem Augenzeugen.',
  },
  {
    tier: 'stone',
    h: '5.3 — Der Bruch zwischen Jakobus und Paulus',
    body: 'Jakobus, Jesu Bruder und laut Paulus selbst eine der „Säulen" der Jerusalemer Gemeinde (Galater 2:9), erweiterte lediglich vier alttestamentliche Gebote für Fremde (Levitikus 17-18) auf Heidenchristen — er hob das Gesetz nicht auf. Als Paulus Jahre später erneut nach Jerusalem kommt, wird er mit dem Vorwurf konfrontiert, er lehre Juden, „von Mose abzufallen", und muss sich einem Reinigungsritual unterziehen, um seine Rechtgläubigkeit zu demonstrieren (Apostelgeschichte 21:17-26) — während seine eigenen Briefe genau das lehren, wessen man ihn beschuldigt.',
  },
  {
    tier: 'marble',
    h: '5.4 — Warum Paulus, nicht Jakobus, das Neue Testament dominiert',
    body: 'Jakobus hinterlässt nur einen kurzen Brief; Paulus wird fast die Hälfte der 27 neutestamentlichen Bücher zugeschrieben. Die Zerstörung des Jerusalemer Tempels 70 n. Chr. traf die gesetzestreue Jerusalemer Gemeinde ins Mark, während das gesetzesfreie paulinische Christentum unter heidnischen Konvertiten leichter Anklang fand — ein historischer, kein theologischer Grund für die spätere Dominanz.',
  },
]

export const botschaftVernetzung = [
  { ziel: 'Band 4 — Das Kreuz', text: 'Dieselbe anonyme, spät entstandene und literarisch abhängige Überlieferung, die die Kreuzigungsberichte prägt, prägt auch den restlichen neutestamentlichen Text — mit denselben Konsequenzen für seine Verlässlichkeit.' },
  { ziel: 'Band 2 — Das Gotteskonzept', text: 'Dass der einzige explizite Trinitätsvers (1. Johannes 5:7) ein Einschub aus dem 16. Jahrhundert ist, bestätigt direkt, was Band 2 über das Fehlen der Lehre im Text selbst zeigte.' },
  { ziel: 'Band 6 — Der angekündigte Prophet', text: 'Wenn Jesus laut eigener Aussage nur zu den Israeliten gesandt war (Matthäus 15:24), wer sollte dann die Botschaft zur ganzen Menschheit tragen? Die Antwort schließt die Reihe.' },
]

export const botschaftKernaussage =
  'Ein Text, der in fast 6.000 nicht identischen Handschriften überlebt, und eine Lehre, die sich zwischen Jesus und Paulus in ihr Gegenteil verkehrt — beides zusammen ergibt keine verlässliche Grundlage. Der Qur’an bietet, was dem Neuen Testament fehlt: eine ununterbrochene, identische, überprüfbare Kette bis zur Quelle.'
