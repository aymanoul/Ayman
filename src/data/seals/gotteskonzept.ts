import type { Beleg } from '../types'
import type { Step, KonterItem, ScholarItem, Regel, Fakt, ZeitPunkt } from './wahrheitssuche'

// ---------------------------------------------------------------------------
// BAND 2 — DAS GOTTESKONZEPT
// Kap. 1 (Die Lehre von der Dreifaltigkeit, Konzile 325-451, Trinität contra
// Vernunft) + die Gott-bezogenen Teile aus Kap. 2 (Tauhid, Sure al-Ikhlas,
// 4:171, "kein Widerspruch zwischen Islam und Vernunft"). Vollstaendig aus der
// MD extrahiert (Zeilen 201-1359 der Quelle).
// ---------------------------------------------------------------------------

export const gotteskonzeptThese =
  'Bevor man fragen kann, wer Jesus ist, muss man fragen: Wer ist Gott? Die Trinitätslehre wurde über Jahrhunderte kaiserlicher Konzile geschmiedet — das Neue Testament kennt weder das Wort noch die Formel. Der Tauhid dagegen ist von Anfang an unverändert derselbe geblieben. Rechtleitung, die als „Mysterium“ verwirren muss, hebt ihren eigenen Zweck auf.'

export const gotteskonzeptFakten: Fakt[] = [
  { wert: '0 ×', label: '„Trinität" in der ganzen Bibel', ton: 'rot' },
  { wert: '451 n. Chr.', label: 'Chalcedon — die Lehre wird erst fertig', ton: 'rot' },
  { wert: '< 20 Wörter', label: 'Sure al-Ikhlas — der ganze Tauhid', ton: 'gruen' },
  { wert: '1450 Jahre', label: 'Tauhid unverändert, ohne ein Konzil', ton: 'gruen' },
]

// Die Konzils-Zeitleiste — jede Etappe der Lehre kam Jahrhunderte nach Jesus.
export const gotteskonzeptZeitleiste: ZeitPunkt[] = [
  {
    jahr: '325',
    titel: 'Nicäa',
    text: 'Kaiser Konstantin schlägt das außerbiblische Homo-ousios selbst vor; 18 widerständige Bischöfe, Arius wird verbannt.',
  },
  {
    jahr: '381',
    titel: 'Konstantinopel',
    text: 'Erst jetzt wird die Gottheit des Heiligen Geistes definiert — 350 Jahre nach Jesus, alle Jünger lange tot.',
  },
  {
    jahr: '451',
    titel: 'Chalcedon',
    text: 'Die „Hypostatische Union" (zwei Naturen, ungetrennt) vollendet die Lehre — über 400 Jahre nach Jesus.',
  },
  {
    jahr: '1531',
    titel: 'Servetus',
    text: 'Wer die Lehre bestreitet, brennt: Michael Servetus wird auf einem Scheiterhaufen aus seinen eigenen Büchern verbrannt.',
    ton: 'out',
  },
]

export const gotteskonzeptSteps: Step[] = [
  {
    n: 'I',
    h: 'Kein Wort, keine Formel',
    body: 'Der Begriff „Trinität“ kommt in der Bibel kein einziges Mal vor — er taucht erstmals um 180 n. Chr. bei Theophilus von Antiochia auf, in lateinischer Form dann bei Tertullian. Das Oxford Companion to the Bible, mit über 260 Bibelgelehrten als Beitragende, hält fest: Das Konzept „kann innerhalb der Grenzen des Kanons nicht klar erkannt werden“. Eine Lehre, die als das „zentrale Geheimnis des christlichen Glaubens“ gilt, aber im Neuen Testament fehlt, verlangt eine Erklärung.',
  },
  {
    n: 'II',
    h: 'Vier Jahrhunderte, drei Konzile, ein Kaiser',
    body: 'Nicäa (325) verurteilte den Arianismus mit dem außerbiblischen Begriff Homo-ousios — vorgeschlagen von Kaiser Konstantin, nicht aus der Schrift. Rimini/Seleukia (359) kehrten die Mehrheit zurück zum Arianismus. Konstantinopel (381) definierte erst die Gottheit des Heiligen Geistes — 350 Jahre nach Jesus. Chalcedon (451) formulierte die „Hypostatische Union“. Jede Etappe war politisch erzwungen: Achtzehn widerständige Bischöfe wurden nach Nicäa ins Exil geschickt, der Ketzer Servetus 1531 lebendig verbrannt.',
  },
  {
    n: 'III',
    h: 'Die Beweistexte halten nicht',
    body: 'Kolosser 2:9 spricht auch davon, dass Gläubige „mit der ganzen Fülle Gottes erfüllt“ werden (Epheser 3:19) — das macht sie nicht zu Gott. Johannes 1:1 fehlt im Griechischen der bestimmte Artikel; Origenes selbst liest „und das Wort war ein Gott“, nicht „der Gott“. Matthäus 28:19 wird von Eusebius durchgehend als „in meinem Namen“ zitiert — und genau so, nie trinitarisch, taufen die Apostel in der Apostelgeschichte. Jesus selbst zitiert das Sch’ma („der Herr, unser Gott, ist der einzige Herr“, Markus 12:29) und nennt in Johannes 17:3 den Vater „den einzigen wahren Gott“ — unter Ausschluss seiner selbst.',
  },
  {
    n: 'IV',
    h: 'Tauhid: vier Verse, keine Entwicklung',
    body: 'Sure al-Ikhlas (112) sagt in weniger als zwanzig arabischen Wörtern, was die Kirche in 400 Jahren nicht bündig formulieren konnte: Gott ist einer, ewig, zeugt nicht und ist nicht gezeugt, niemand ist Ihm gleich. Seit der Offenbarung an Muhammad ﷺ hat der Tauhid keine einzige historische Entwicklung durchgemacht — kein Konzil, kein Kaiser, keine Verbrennung war nötig, um ihn zu definieren.',
  },
]

export const gotteskonzeptBelege: Record<string, Beleg> = {
  ikhlas: {
    typ: 'quran',
    kurz: 'Sag: Er ist Allah, ein Einer. Er hat nicht gezeugt und ist nicht gezeugt worden.',
    original: 'قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
    sprache: 'ar',
    translit: 'qul huwa llāhu aḥad, allāhu ṣ-ṣamad, lam yalid wa-lam yūlad, wa-lam yakun lahū kufuwan aḥad',
    uebersetzung:
      '„Sag: Er ist Allah, ein Einer, Allah, der Überlegene. Er hat nicht gezeugt und ist nicht gezeugt worden, und niemand ist Ihm jemals gleich." — Das ganze Kapitel 112 (al-Ikhlas), keine zwanzig Wörter im Original: das Manifest des Tauhid, ohne Konzil, ohne spätere Zusätze.',
    fundstelle: 'Sure 112 (al-Ikhlas)',
    kern: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
  },
  q573: {
    typ: 'quran',
    kurz: 'Ungläubig sind, die sagen: Allah ist einer von dreien.',
    original: 'لَّقَدْ كَفَرَ الَّذِينَ قَالُوا إِنَّ اللَّهَ ثَالِثُ ثَلَاثَةٍ',
    sprache: 'ar',
    translit: 'laqad kafara lladhīna qālū inna llāha thālithu thalāthah',
    uebersetzung:
      '„Fürwahr, ungläubig sind diejenigen, die sagen: ‚Gewiss, Allah ist einer von dreien.‘ Es gibt aber keinen Gott außer dem Einen Einzigen. Wenn sie mit dem, was sie sagen, nicht aufhören, so wird denjenigen von ihnen, die ungläubig sind, ganz gewiss schmerzhafte Strafe widerfahren." — Anders als „Trinität" in der Bibel, kommt diese Warnung im Qur’an ausdrücklich vor.',
    fundstelle: 'Sure 5 (al-Māʾida), Vers 73',
    kern: 'ثَالِثُ ثَلَاثَةٍ',
  },
  q4171: {
    typ: 'quran',
    kurz: 'Al-Masih ist nur Allahs Gesandter — und sagt nicht „Drei“.',
    original: 'إِنَّمَا الْمَسِيحُ عِيسَى ابْنُ مَرْيَمَ رَسُولُ اللَّهِ وَكَلِمَتُهُ ... وَلَا تَقُولُوا ثَلَاثَةٌ ۚ انتَهُوا خَيْرًا لَّكُمْ ۚ إِنَّمَا اللَّهُ إِلَٰهٌ وَاحِدٌ',
    sprache: 'ar',
    translit: 'innamā l-masīḥu ʿīsā bnu maryama rasūlu llāhi wa-kalimatuh … wa-lā taqūlū thalāthah, intahū khayran lakum, innamā llāhu ilāhun wāḥid',
    uebersetzung:
      '„O Leute der Schrift, übertreibt nicht in eurer Religion … Al-Masih ʿĪsā, der Sohn Maryams, ist nur Allahs Gesandter und Sein Wort, das Er Maryam entbot, und Geist von Ihm. Darum glaubt an Allah und Seine Gesandten und sagt nicht ‚Drei‘. Hört auf damit, das ist besser für euch! Allah ist nur ein Einziger Gott." — Jahrhunderte der Mythenbildung in einem einzigen Vers aufgelöst.',
    fundstelle: 'Sure 4 (an-Nisāʾ), Vers 171',
    kern: 'لَا تَقُولُوا ثَلَاثَةٌ',
  },
  johannes173: {
    typ: 'bibel',
    kurz: 'Das ist das ewige Leben: dich, den einzig wahren Gott, zu erkennen — und Jesus Christus, den du gesandt hast.',
    uebersetzung:
      '„Das ist das ewige Leben, dich und den einzigen wahren Gott zu erkennen und Jesus Christus, den du gesandt hast." — Jesus betet zum Vater und nennt ihn den einzig wahren Gott, sich selbst, den Sohn, ausdrücklich davon unterschieden. Augustinus manipulierte diesen Vers in seinen „Predigten über Johannes", indem er „dich" und „Jesus Christus" zu einer Einheit verschmolz — ein Eingeständnis, wie unbequem der Originaltext für die Trinitätslehre ist.',
    fundstelle: 'Johannes 17,3',
    kern: 'den einzigen wahren Gott',
  },
  markus1229: {
    typ: 'bibel',
    kurz: 'Höre, Israel! Der Herr, unser Gott, ist der einzige Herr.',
    uebersetzung:
      'Ein Schriftgelehrter fragt Jesus nach dem wichtigsten Gebot. Jesus antwortet mit dem Sch’ma aus Deuteronomium 6,4: „Höre, Israel, der Herr, unser Gott, ist der einzige Herr." Der Schriftgelehrte bestätigt: „Er allein ist der Herr, und es gibt keinen anderen außer ihm" — und Jesus lobt ihn dafür, er sei „nicht fern vom Reich Gottes". Die perfekte Gelegenheit, Trinität zu lehren — und Jesus bekräftigt stattdessen den reinen Monotheismus des Alten Testaments.',
    fundstelle: 'Markus 12,28–34 · vgl. Deuteronomium 6,4',
    kern: 'der einzige Herr',
  },
  johannes111: {
    typ: 'bibel',
    kurz: 'Im Griechischen fehlt der bestimmte Artikel — „ein Gott", nicht „der Gott".',
    uebersetzung:
      '„Am Anfang war das Wort, und das Wort war bei Gott, und das Wort war Gott." Im griechischen Original fehlt vor „Gott" im letzten Satzteil der bestimmte Artikel — der Vers lässt sich ebenso mit „das Wort war göttlich" oder „ein Gott" übersetzen. Origenes von Alexandria, der wichtigste Grammatik-Theologe der frühen griechischen Kirche, hält fest: Johannes benutzt den Artikel für die „nicht erschaffene Ursache aller Dinge" und lässt ihn weg, „wenn der Logos Gott genannt wird". Der wahre Gott ist „der Gott" — nicht das Wort.',
    fundstelle: 'Johannes 1,1',
    kern: 'und das Wort war Gott',
  },
  eusebiusTaufe: {
    typ: 'quelle',
    kurz: 'Eusebius zitiert Matthäus 28,19 immer als „in meinem Namen" — nie trinitarisch.',
    uebersetzung:
      'Der Kirchenhistoriker Eusebius (3. Jh.) zitiert den Taufbefehl wiederholt in seinen Schriften, endet ihn aber stets mit „in meinem Namen", nie mit „im Namen des Vaters, des Sohnes und des Heiligen Geistes". Passend dazu berichtet die Apostelgeschichte durchgängig nur von Taufen „im Namen Jesu" (Apg 10,48; 22,16) — keine einzige trinitarische Taufformel kommt vor. Das früheste Manuskript, das Eusebius vorlag, muss also „in meinem Namen" enthalten haben.',
    fundstelle: 'Abu Zakariya, ebd., Anm. 34 · vgl. Matthäus 28,19; Apostelgeschichte 10,48; 22,16',
  },
  homoousios: {
    typ: 'quelle',
    kurz: 'Homo-ousios — ein Wort, das nirgendwo in der Bibel steht, vom Kaiser selbst vorgeschlagen.',
    uebersetzung:
      'Um den Arianismus auszuschließen, brauchte das Konzil von Nicäa (325) einen Begriff, der in der Bibel nicht vorkommt: Homo-ousios („von derselben Substanz"). Vorgeschlagen wurde er von Kaiser Konstantin selbst — nicht von einem Theologen. Papst Benedikt XVI. bestätigt: Die Kirche musste „ihre eigene Terminologie mit Hilfe bestimmter Begriffe philosophischen Ursprungs" entwickeln: „Substanz", „Person", „Hypostase". Das Konzept, nicht die Bibel, gab den Ausschlag.',
    fundstelle: 'Abu Zakariya, ebd., Anm. 17–18 · Konzil von Nicäa, 325 n. Chr.',
  },
  servetus: {
    typ: 'quelle',
    kurz: 'Michael Servetus wurde 1531 lebendig verbrannt, weil er die Trinität leugnete.',
    uebersetzung:
      'Der spanische Theologe Michael Servetus veröffentlichte 1531 „Fehler der Dreieinigkeit" und nannte Trinitarier Tritheisten. Er wurde als Ketzer verurteilt und auf einem Scheiterhaufen aus seinen eigenen Büchern lebendig verbrannt. Zwischen dem Konzept „ein Gott in drei Personen" und dem Preis für seine Ablehnung lagen über 1100 Jahre Kirchengeschichte — kein Beweis für Wahrheit, sondern für Durchsetzungsmacht.',
    fundstelle: 'Abu Zakariya, ebd., Anm. 10',
  },
  vernunftgabe: {
    typ: 'quran',
    kurz: 'Er gab euch Gehör, Augenlicht und Herzen — auf dass ihr dankbar seid.',
    original: 'وَجَعَلَ لَكُمُ السَّمْعَ وَالْأَبْصَارَ وَالْأَفْئِدَةَ لَعَلَّكُمْ تَشْكُرُونَ',
    sprache: 'ar',
    translit: 'wa-jaʿala lakumu s-samʿa wa-l-abṣāra wa-l-afʾidata laʿallakum tashkurūn',
    uebersetzung:
      '„Und Er hat euch Gehör, Augenlicht und Herzen gegeben, auf dass ihr dankbar sein möget." Der Qur’an fordert an vielen Stellen, den gottgegebenen Verstand auch auf Glaubensfragen anzuwenden — nicht nur auf Weltliches. Wer diese Gabe nicht nutzt, ist laut Sure 8:22 „schlimmer als das Vieh".',
    fundstelle: 'Sure 16 (an-Naḥl), Vers 78 · vgl. 7:179; 8:22',
    kern: 'الْأَفْئِدَةَ',
  },
  faelschungstest: {
    typ: 'quran',
    kurz: 'Wenn er von jemand anderem als Allah wäre, würden sie darin viel Widerspruch finden.',
    original: 'أَفَلَا يَتَدَبَّرُونَ الْقُرْآنَ ۚ وَلَوْ كَانَ مِنْ عِندِ غَيْرِ اللَّهِ لَوَجَدُوا فِيهِ اخْتِلَافًا كَثِيرًا',
    sprache: 'ar',
    translit: 'a-falā yatadabbarūna l-qurʾāna wa-law kāna min ʿindi ghayri llāhi la-wajadū fīhi khtilāfan kathīrā',
    uebersetzung:
      '„Denken sie denn nicht sorgfältig über den Qur’an nach? Wenn er von jemand anderem wäre als von Allah, würden sie in ihm wahrlich viel Widerspruch finden." — Der Qur’an liefert selbst das Kriterium: Widerspruchsfreiheit als Prüfstein göttlicher Herkunft. Eine Theologie voller ungelöster Paradoxien (Kreuzigung: Gott oder Mensch? Zwei Naturen getrennt oder ungetrennt?) besteht diesen Test nicht.',
    fundstelle: 'Sure 4 (an-Nisāʾ), Vers 82',
    kern: 'اخْتِلَافًا كَثِيرًا',
  },
}

export const gotteskonzeptSpielregeln: Regel[] = [
  { regel: 'Der Fälschungstest', text: 'Gott ist vollkommen im Wissen; Seine Offenbarung muss frei von Widersprüchen sein (Sure 4:82). Eine Lehre voller ungelöster Paradoxa kann nicht Seine letzte Offenbarung sein.' },
  { regel: 'Analogien beweisen nichts', text: 'Ei, Wasser, Mann-Vater-Sohn — jede gängige Trinitäts-Analogie widerspricht selbst der offiziellen Lehre, wie christliche Theologen einräumen. Eine unerklärbare Lehre bleibt unerklärt, ganz gleich wie viele Bilder man dafür findet.' },
  { regel: '„Geheimnis" ist keine Antwort', text: 'Wenn Rechtleitung zu Verwirrung führt, widerspricht das dem Zweck der Offenbarung selbst. Ein Konzept, das man „nicht vollständig verstehen" darf, kann nicht die Grundlage der Errettung sein.' },
  { regel: 'Progressive Offenbarung hat Grenzen', text: 'Vom reinen Monotheismus zur Dreiheit ist kein graduelles Fortschreiten, sondern eine radikale Umkehr. Und ohne feste Obergrenze könnte „progressiv" ebenso vier oder sieben Personen rechtfertigen.' },
  { regel: 'Mehrheit ist kein Beweis', text: 'Die Trinität war nicht immer Mehrheitsmeinung — zeitweise dominierte der Arianismus im Osten des Reiches. Wenn Popularität über Wahrheit entscheiden würde, wäre einst der Arianismus die Orthodoxie gewesen.' },
]

export const gotteskonzeptKonter: KonterItem[] = [
  {
    tier: 'stone',
    einwand: '„Das Wort ‚Trinität‘ muss nicht in der Bibel stehen — das Konzept ist überall zu finden."',
    konter:
      'Die am häufigsten zitierten Beweistexte (Kolosser 2:9, Johannes 1:1, Matthäus 28:19) tragen die Last nicht: Keiner definiert Gott ausdrücklich als drei gleichewige Personen, und jeder lässt sich im Kontext anders lesen. Selbst das Oxford Companion to the Bible — mit über 260 Bibelgelehrten — hält fest, dass das entwickelte Konzept „innerhalb der Grenzen des Kanons nicht klar erkannt werden" kann.',
    belegId: 'johannes111',
  },
  {
    tier: 'stone',
    einwand: '„Die Dreieinigkeit ist eben ein heiliges Geheimnis — das ist doch kein Widerspruch."',
    konter:
      'Ein Geheimnis, das laut der katholischen Kirche selbst „im Schleier des Glaubens verborgen" bleibt, kollidiert mit dem Zweck der Offenbarung: Rechtleitung. Harold Lindsell und Charles Woodbridge bringen es auf den Punkt: „Wer versucht, das Geheimnis vollständig zu verstehen, wird seinen Verstand verlieren; wer aber die Trinität leugnet, wird seine Seele verlieren." Eine Lehre, an deren Verständnis man scheitern muss, aber deren Ablehnung die Seele kostet — das ist keine Rechtleitung, das ist ein Dilemma.',
    belegId: 'faelschungstest',
  },
  {
    tier: 'stone',
    einwand: '„Wer starb am Kreuz — Gott oder der Mensch Jesus? Das ist doch klar geregelt."',
    konter:
      'Ist es nicht. Sagt man, Gott starb, widerspricht das der biblischen Unsterblichkeit Gottes (Deuteronomium 32:40). Sagt man, nur der Mensch in Jesus starb, verletzt das Chalcedon selbst, das die zwei Naturen für „ungetrennt, ungesondert" erklärt. Trinitarier müssen sich praktisch aussuchen, welche Häresie sie begehen — ein Jahrhunderte altes, ungelöstes Dilemma.',
    belegId: 'johannes173',
  },
  {
    tier: 'stone',
    einwand: '„Der Vergleich mit heidnischen Gottmenschen ist unfair — das Christentum ist doch monotheistisch entstanden."',
    konter:
      'Genau das ist der Punkt: Das Christentum begann als jüdische, streng monotheistische Bewegung. Erst als die Botschaft in die hellenistisch-römische Welt eindrang — mit ihren Gottmenschen wie Herkules, Perseus, dem vergöttlichten Julius Caesar („Nachfahre von Ares und Aphrodite, der Gott, der sich manifestiert hat") — begann sich der jüdische Begriff „Sohn Gottes" in eine buchstäbliche Göttlichkeit zu wandeln. Gregor von Nyssa selbst beschreibt die Trinitätslehre als Mittelweg zwischen jüdischem Monotheismus und griechischem Polytheismus.',
    belegId: 'eusebiusTaufe',
  },
  {
    tier: 'marble',
    einwand: '„Auch der Islam hat Konzile und Gelehrtenstreit gehabt — das ist also kein Unterschied."',
    konter:
      'Der Unterschied liegt nicht darin, dass es Diskussionen gab, sondern worüber: Islamische Gelehrtenstreitigkeiten betrafen Recht und Praxis (fiqh), nie die Grundformel des Tauhid selbst. Sure al-Ikhlas stand 1450 Jahre unveränderlich fest, ohne Kaiser, ohne Exil, ohne Scheiterhaufen. Die Trinität dagegen wurde zwischen 325 und 451 in ihrer heutigen Form erst geschmiedet — mit kaiserlichem Zwang als treibender Kraft.',
    belegId: 'homoousios',
  },
  {
    tier: 'marble',
    einwand: '„Vernunft und Glaube schließen sich ohnehin aus — warum die Trinität dann rational prüfen?"',
    konter:
      'Der Qur’an widerspricht dem ausdrücklich: Gott gab Gehör, Augenlicht und Herzen „auf dass ihr dankbar seid" (16:78) und nennt jene, die nicht nachdenken, „schlimmer als das Vieh" (7:179). Genau dieses Werkzeug — Vernunft, angewandt auf Widerspruchsfreiheit — ist der Fälschungstest aus Sure 4:82. Der Islam fordert die rationale Prüfung der Theologie, statt sie zu verbieten.',
    belegId: 'vernunftgabe',
  },
]

export const gotteskonzeptScholar: ScholarItem[] = [
  {
    tier: 'stone',
    h: '2.1 — Die drei Jesusbilder der Frühkirche',
    body: 'Vor Nicäa existierten mindestens drei konkurrierende Ansichten gleichberechtigt nebeneinander: die Ebioniten (Jesus rein menschlich, adoptiert bei der Taufe), die Marcioniten (Jesus rein göttlich, sein Menschsein nur Illusion) und die Subordinationisten wie Origenes (Jesus göttlich, aber dem Vater untergeordnet, von Ihm erschaffen). Bart Ehrman bestätigt, dass „adoptistische Christologien … auf Quellen zurückgeführt werden [können], die älter sind als die Bücher des Neuen Testaments." Historiker bezeichnen die frühesten Trinitätsanhänger daher treffend als „proto-trinitarisch", nicht orthodox.',
  },
  {
    tier: 'stone',
    h: '2.2 — Nicäa: Eine Minderheit setzt sich politisch durch',
    body: 'Nach dem Kirchenhistoriker Philip Schaff war die orthodoxe (trinitarische) Partei in Nicäa „zuerst in der Minderheit"; die strengen Arianer zählten rund zwanzig Bischöfe; die überwiegende Mehrheit unter Eusebius von Caesarea nahm einen Mittelweg. Konstantin selbst schlug den entscheidenden Begriff Homo-ousios vor und drohte Verweigerern mit Exil — achtzehn Bischöfe mussten am Ende überzeugt, zwei libysche Bischöfe und Arius selbst verbannt werden.',
  },
  {
    tier: 'stone',
    h: '2.3 — Konstantinopel und Chalcedon: Die Lehre wächst nach',
    body: 'Erst 381 in Konstantinopel wurde die Gottheit des Heiligen Geistes offiziell — 350 Jahre nach den Jüngern. Harold Brown nennt Gründe für die Verspätung: Pneuma („Atem") klingt im Griechischen unpersönlich, und die Persönlichkeit des Geistes wurde in der Frühkirche oft mit häretischen Gruppen wie den Montanisten assoziiert. Erst 451 in Chalcedon wurde die Formel der zwei ungetrennten Naturen in einer Person („Hypostatische Union") festgelegt — nach Wayne Grudems eigener Aussage „erst allmählich" und „endgültig" erst zu diesem späten Zeitpunkt.',
  },
  {
    tier: 'marble',
    h: '2.4 — Das Filioque: Ein bis heute ungelöster Bruch',
    body: 'Das Glaubensbekenntnis von Konstantinopel (381) sagt, der Heilige Geist gehe „aus dem Vater" hervor. Westliche Kirchen fügten später „und dem Sohn" (Filioque) hinzu; östliche Kirchen lehnen das bis heute ab, weil es den Geist dem Sohn unterordne. Diese eine Frage spaltete die Kirche 1054 in West und Ost — ein Nebeneffekt einer Lehre, die selbst nach 700 Jahren dogmatischer Arbeit noch keinen Konsens gefunden hatte.',
  },
]

export const gotteskonzeptVernetzung = [
  { ziel: 'Band 1 — Die Wahrheitssuche', text: 'Der Fälschungstest aus Sure 4:82 — Widerspruchsfreiheit als Kriterium für göttliche Herkunft — ist dieselbe Vernunft-Regel, mit der die Reise begann.' },
  { ziel: 'Band 3 — Der wahre Jesus', text: 'Wenn Gott einer ist ohne Partner, wer war dann der Mensch, den beide Religionen als Messias anerkennen? Die Antwort verlangt einen genauen Blick auf Jesu eigene Worte.' },
  { ziel: 'Band 5 — Die verlorene Botschaft', text: 'Dass die Trinität sich erst über Jahrhunderte entwickelte, wirft dieselbe Frage auf, die auch die Überlieferung des Neuen Testaments betrifft: Was wurde bewahrt — und was hinzugefügt?' },
]

export const gotteskonzeptKernaussage =
  'Eine Theologie, die vier Konzile, einen Kaiser und einen Scheiterhaufen brauchte, um sich selbst zu definieren, und die am Ende doch „Geheimnis" bleiben muss, hat den Fälschungstest der Widerspruchsfreiheit nicht bestanden. Tauhid braucht keine Konzile: vier Verse, seit 1450 Jahren unverändert.'
