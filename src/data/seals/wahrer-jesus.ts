import type { Beleg } from '../types'
import type { Step, KonterItem, ScholarItem, Regel, Fakt, Duo } from './wahrheitssuche'

// ---------------------------------------------------------------------------
// BAND 3 — DER WAHRE JESUS
// Die Jesus-Teile aus Kap. 2 (Geburt, Wunder, Natur Jesu) + Kap. 3 (Die
// Darstellung Jesu und anderer Propheten in den Schriften: Aaron, David, Noah,
// Ijob). Vollstaendig aus der MD extrahiert (Zeilen 1045-1121 und 1359-1677).
// ---------------------------------------------------------------------------

export const wahrerJesusThese =
  'Wer war Jesus wirklich? Der Qur’an zeichnet ihn als Wort von Gott, wundersam geboren — und doch als Diener, Gesandter, Mensch. Der schärfste Test aber ist der Charakter: Wo die Bibel Jesus harte Worte in den Mund legt und Propheten schwerste Sünden zuschreibt, zeichnet der Qur’an ausnahmslos Vorbilder.'

export const wahrerJesusFakten: Fakt[] = [
  { wert: 'Sure 19', label: 'nach Maria benannt — eine Ehre, die das NT ihr nicht gibt', ton: 'gruen' },
  { wert: '3:59', label: 'das Adam-Gleichnis: Wunder ≠ Göttlichkeit', ton: 'gruen' },
  { wert: '5:75', label: '„sie pflegten Speise zu essen" — Bedürftigkeit schließt Gottheit aus' },
  { wert: '4 Propheten', label: 'Aaron · David · Noah · Ijob — der Charaktertest, doppelt erzählt' },
]

// Zwei Portraets desselben Mannes — Zeile fuer Zeile gegenuebergestellt.
export const wahrerJesusDuo: Duo = {
  links: {
    titel: 'Jesus in der Bibel',
    zeilen: [
      { text: 'Eine flehende Mutter abgewiesen: „… das Brot den Kindern wegzunehmen und den Hunden vorzuwerfen."', ref: 'Matthäus 15,26' },
      { text: 'Zum engsten Jünger: „Weg mit dir, Satan, geh mir aus den Augen!"', ref: 'Matthäus 16,23' },
      { text: 'Zur eigenen Mutter, distanziert: „Wer ist meine Mutter …?"', ref: 'Matthäus 12,48' },
      { text: 'Am Kreuz, klagend: „Mein Gott, mein Gott, warum hast du mich verlassen?"', ref: 'Matthäus 27,46' },
    ],
  },
  rechts: {
    titel: 'Jesus im Qur’an',
    zeilen: [
      { text: 'Das erste Wort in der Wiege: „Ich bin wahrlich Allahs Diener."', ref: 'Sure 19,30' },
      { text: '„… und gütig gegen meine Mutter zu sein. Er hat mich weder gewalttätig noch unglücklich gemacht."', ref: 'Sure 19,32' },
      { text: 'Zu seinem Volk: „Ich komme mit der Weisheit … so fürchtet Allah und gehorcht mir."', ref: 'Sure 43,63' },
      { text: 'Vor Gott im Endgericht: „Preis sei Dir! Es steht mir nicht zu, etwas zu sagen, wozu ich kein Recht habe."', ref: 'Sure 5,116' },
    ],
  },
}

export const wahrerJesusSteps: Step[] = [
  {
    n: 'I',
    h: 'Die wunderbare Geburt',
    body: 'Ein Engel verkündet Maria „ein Wort von Gott" — al-Masih ʿĪsā (3:45). Sie ist verwundert, „wo mich doch kein menschliches Wesen berührt hat" — und die Antwort lautet: „Allah erschafft, was Er will" (3:47). Als sie mit dem Kind zu ihrem Volk zurückkehrt, wird sie der Unzucht bezichtigt (19:27–28) — bis das Kind in der Wiege spricht und selbst sein Prophetentum verkündet (19:30–33).',
  },
  {
    n: 'II',
    h: 'Wunder machen nicht göttlich',
    body: 'Jesus heilt Blinde und Aussätzige, erweckt Tote — „mit Allahs Erlaubnis" (3:49). Der Qur’an stellt klar: Alle Gesandten erhielten Zeichen, um ihr Volk zu überzeugen (57:25); Moses teilte das Meer, ohne dass ihm jemand Göttlichkeit zuschriebe. Das stärkste Gegenargument: „Das Gleichnis ʿĪsās ist bei Allah wie das Gleichnis Adams" (3:59) — Adam hatte weder Vater noch Mutter, und niemand nennt ihn Gott.',
  },
  {
    n: 'III',
    h: 'Ein Gesandter, der isst',
    body: '„Al-Masih, der Sohn Maryams, war doch nur ein Gesandter, vor dem bereits Gesandte vorübergegangen waren … sie (beide, er und seine Mutter) pflegten Speise zu essen" (5:75). Ein Bedürfnis nach Nahrung — und damit Verletzlichkeit, Sterblichkeit — schließt Göttlichkeit aus. Was isst, muss sich auch erleichtern; ein solcher Gedanke über Gott wäre blasphemisch.',
  },
  {
    n: 'IV',
    h: 'Der Charaktertest',
    body: 'Die Bibel lässt Jesus eine Frau „Hund" nennen (Matthäus 15:26), Petrus „Satan" (16:23), seine Mutter distanziert abweisen (12:47–49) und am Kreuz Gott der Verlassenheit anklagen (27:46). Im Qur’an spricht Jesus durchgehend respektvoll — zu seiner Mutter, zu Fremden, zu Gott selbst (19:30–32; 43:63; 5:116–117). Dasselbe Muster zeigt sich bei Aaron, David, Noah und Ijob: Wo die Bibel sie der schwersten Sünden bezichtigt, zeichnet der Qur’an makellose Propheten.',
  },
]

export const wahrerJesusBelege: Record<string, Beleg> = {
  q345: {
    typ: 'quran',
    kurz: 'Allah verkündet dir ein Wort von Ihm: al-Masih ʿĪsā, der Sohn Maryams.',
    original: 'إِذْ قَالَتِ الْمَلَائِكَةُ يَا مَرْيَمُ إِنَّ اللَّهَ يُبَشِّرُكِ بِكَلِمَةٍ مِّنْهُ اسْمُهُ الْمَسِيحُ عِيسَى ابْنُ مَرْيَمَ',
    sprache: 'ar',
    translit: 'idh qālati l-malāʾikatu yā maryamu inna llāha yubashshiruki bi-kalimatin minhu smuhu l-masīḥu ʿīsā bnu maryam',
    uebersetzung:
      '„Als die Engel sagten: ‚O Maryam, Allah verkündet dir ein Wort von Ihm, dessen Name al-Masih ʿĪsā, der Sohn Maryams ist, angesehen im Diesseits und Jenseits und einer der Allah Nahegestellten.‘"',
    fundstelle: 'Sure 3 (Āl ʿImrān), Vers 45',
    kern: 'كَلِمَةٍ مِّنْهُ',
  },
  q347: {
    typ: 'quran',
    kurz: 'Allah erschafft, was Er will. Wenn Er eine Sache bestimmt, sagt Er nur „Sei!"',
    original: 'قَالَتْ رَبِّ أَنَّىٰ يَكُونُ لِي وَلَدٌ وَلَمْ يَمْسَسْنِي بَشَرٌ ۖ قَالَ كَذَٰلِكِ اللَّهُ يَخْلُقُ مَا يَشَاءُ',
    sprache: 'ar',
    translit: 'qālat rabbi annā yakūnu lī waladun wa-lam yamsasnī basharun, qāla kadhāliki llāhu yakhluqu mā yashāʾ',
    uebersetzung:
      '„Sie sagte: ‚Mein Herr, wie sollte ich ein Kind haben, wo mich doch kein menschliches Wesen berührt hat?‘ Er sagte: ‚So wird es sein; Allah erschafft, was Er will. Wenn Er eine Angelegenheit bestimmt, so sagt Er zu ihr nur: Sei! und so ist sie.‘"',
    fundstelle: 'Sure 3 (Āl ʿImrān), Vers 47',
    kern: 'يَخْلُقُ مَا يَشَاءُ',
  },
  q359: {
    typ: 'quran',
    kurz: 'Das Gleichnis ʿĪsās ist bei Allah wie das Gleichnis Adams.',
    original: 'إِنَّ مَثَلَ عِيسَىٰ عِندَ اللَّهِ كَمَثَلِ آدَمَ ۖ خَلَقَهُ مِن تُرَابٍ ثُمَّ قَالَ لَهُ كُن فَيَكُونُ',
    sprache: 'ar',
    translit: 'inna mathala ʿīsā ʿinda llāhi ka-mathali ādam, khalaqahū min turābin thumma qāla lahū kun fa-yakūn',
    uebersetzung:
      '„Gewiss, das Gleichnis ʿĪsās ist bei Allah wie das Gleichnis Adams. Er erschuf ihn aus Erde. Hierauf sagte Er zu ihm: ‚Sei!‘ und da war er." — Adams Erschaffung ohne Vater und Mutter war ebenso wunderbar wie Jesu Geburt ohne Vater. Niemand schreibt Adam deshalb Göttlichkeit zu.',
    fundstelle: 'Sure 3 (Āl ʿImrān), Vers 59',
    kern: 'كَمَثَلِ آدَمَ',
  },
  q575: {
    typ: 'quran',
    kurz: 'Al-Masih war nur ein Gesandter — er und seine Mutter pflegten Speise zu essen.',
    original: 'مَّا الْمَسِيحُ ابْنُ مَرْيَمَ إِلَّا رَسُولٌ قَدْ خَلَتْ مِن قَبْلِهِ الرُّسُلُ وَأُمُّهُ صِدِّيقَةٌ ۖ كَانَا يَأْكُلَانِ الطَّعَامَ',
    sprache: 'ar',
    translit: 'mā l-masīḥu bnu maryama illā rasūlun qad khalat min qablihi r-rusulu wa-ummuhū ṣiddīqatun, kānā yaʾkulāni ṭ-ṭaʿām',
    uebersetzung:
      '„Al-Masih, der Sohn Maryams, war doch nur ein Gesandter, vor dem bereits Gesandte vorübergegangen waren. Und seine Mutter war sehr wahrheitsliebend; sie beide pflegten Speise zu essen." — Wer Nahrung braucht, kann nicht Gott sein: Bedürftigkeit schließt Allmacht aus.',
    fundstelle: 'Sure 5 (al-Māʾida), Vers 75',
    kern: 'كَانَا يَأْكُلَانِ الطَّعَامَ',
  },
  q5116: {
    typ: 'quran',
    kurz: 'Preis sei Dir! Es steht mir nicht zu, etwas zu sagen, wozu ich kein Recht habe.',
    original: 'قَالَ سُبْحَانَكَ مَا يَكُونُ لِي أَنْ أَقُولَ مَا لَيْسَ لِي بِحَقٍّ',
    sprache: 'ar',
    translit: 'qāla subḥānaka mā yakūnu lī an aqūla mā laysa lī bi-ḥaqq',
    uebersetzung:
      'Am Jüngsten Tag fragt Gott: „O ʿĪsā, Sohn Maryams, bist du es, der zu den Menschen gesagt hat: Nehmt mich und meine Mutter außer Allah zu Göttern?" Jesus antwortet: „Preis sei Dir! Es steht mir nicht zu, etwas zu sagen, wozu ich kein Recht habe … Ich habe ihnen nur gesagt, was Du mir befohlen hast: Dient Allah, meinem und eurem Herrn!" — Durchgehend respektvoll, selbst im letzten Gericht.',
    fundstelle: 'Sure 5 (al-Māʾida), Vers 116–117',
    kern: 'سُبْحَانَكَ',
  },
  matthaeusHund: {
    typ: 'bibel',
    kurz: 'Es ist nicht recht, das Brot den Kindern wegzunehmen und den Hunden vorzuwerfen.',
    uebersetzung:
      'Eine kanaanäische Frau bittet Jesus flehentlich um Hilfe für ihre kranke Tochter und spricht ihn mit „Herr, du Sohn Davids" an. Jesus schweigt zunächst, dann antwortet er: „Ich bin nur zu den verlorenen Schafen des Hauses Israel gesandt … Es ist nicht recht, das Brot den Kindern wegzunehmen und den Hunden vorzuwerfen." Eine schwere Beleidigung als Antwort auf eine verzweifelte Bitte um Hilfe.',
    fundstelle: 'Matthäus 15,22–26',
    kern: 'den Hunden vorzuwerfen',
  },
  matthaeusSatan: {
    typ: 'bibel',
    kurz: 'Weg mit dir, Satan! — zu Petrus.',
    uebersetzung:
      '„Jesus aber wandte sich um und sagte zu Petrus: Weg mit dir, Satan, geh mir aus den Augen! Du willst mich zu Fall bringen; denn du hast nicht das im Sinn, was Gott will, sondern was die Menschen wollen." Der engste Jünger wird mit dem Namen des Widersachers belegt.',
    fundstelle: 'Matthäus 16,23',
    kern: 'Weg mit dir, Satan',
  },
  matthaeusEliEli: {
    typ: 'bibel',
    kurz: 'Mein Gott, mein Gott, warum hast du mich verlassen?',
    uebersetzung:
      '„Um die neunte Stunde rief Jesus laut: Eli, Eli, lema sabachtani?, das heißt: Mein Gott, mein Gott, warum hast du mich verlassen?" — Ein Ausruf, der selbst von manchen christlichen Auslegern als Zweifel an Gottes Nähe gelesen wird; im Qur’an findet sich für Jesus nirgendwo eine vergleichbare Anklage gegen Gott.',
    fundstelle: 'Matthäus 27,46',
    kern: 'warum hast du mich verlassen',
  },
  q1930: {
    typ: 'quran',
    kurz: 'Ich bin wahrlich Allahs Diener — und gütig gegen meine Mutter zu sein.',
    original: 'قَالَ إِنِّي عَبْدُ اللَّهِ آتَانِيَ الْكِتَابَ وَجَعَلَنِي نَبِيًّا',
    sprache: 'ar',
    translit: 'qāla innī ʿabdu llāhi ātāniya l-kitāba wa-jaʿalanī nabiyyā',
    uebersetzung:
      'Das Jesuskind spricht in der Wiege: „Ich bin wahrlich Allahs Diener; Er hat mir die Schrift gegeben und mich zu einem Propheten gemacht … und gütig gegen meine Mutter zu sein." Die erste Handlung des Qur’an-Jesus verteidigt seine Mutter und bekennt sich als Diener — der genaue Gegenentwurf zur distanzierten Zurückweisung Marias in Matthäus 12:47–49.',
    fundstelle: 'Sure 19 (Maryam), Vers 30–32',
    kern: 'عَبْدُ اللَّهِ',
  },
  aaronKalb: {
    typ: 'bibel',
    kurz: 'Aaron goss das goldene Kalb — und blieb ungestraft.',
    uebersetzung:
      '„Da nahm das ganze Volk die goldenen Ohrringe ab und brachte sie zu Aaron. Er nahm sie von ihnen entgegen … und goss danach ein Kalb." Der Prophet, der Israel vor Götzendienst hätte bewahren sollen, fertigt selbst das Götzenbild — und bleibt von der Strafe verschont, die das Volk trifft (Exodus 32:35), während er sich bei Moses nur herausredet: „Du weißt doch, wie böse das Volk ist" (32:22).',
    fundstelle: 'Exodus 32,3–4.22.35',
    kern: 'goss danach ein Kalb',
  },
  aaronQuran: {
    typ: 'quran',
    kurz: 'Harun hatte ihnen bereits gesagt: Folgt mir und gehorcht meinem Befehl.',
    original: 'وَلَقَدْ قَالَ لَهُمْ هَارُونُ مِن قَبْلُ يَا قَوْمِ إِنَّمَا فُتِنتُم بِهِ',
    sprache: 'ar',
    translit: 'wa-laqad qāla lahum hārūnu min qablu yā qawmi innamā futintum bihī',
    uebersetzung:
      '„Harun hatte ihnen ja bereits zuvor gesagt: O mein Volk, ihr seid damit nur der Versuchung ausgesetzt worden. Gewiss, euer Herr ist der Allerbarmer; so folgt mir und gehorcht meinem Befehl." Der Qur’an entlastet Aaron vollständig und nennt einen anderen Schuldigen, Samiri (20:95–96) — konsistent mit dem, was man von einem Propheten erwartet.',
    fundstelle: 'Sure 20 (Ṭāhā), Vers 90–91',
    kern: 'فُتِنتُم بِهِ',
  },
  davidBibel: {
    typ: 'bibel',
    kurz: 'Du hast den Hetiter Urija mit dem Schwert erschlagen und dir seine Frau genommen.',
    uebersetzung:
      'David sieht Batseba, lässt sie holen und schläft mit ihr, obwohl sie mit dem Hetiter Urija verheiratet ist. Als sie schwanger wird, arrangiert David den Tod Urijas im Kampf. Der Prophet Natan konfrontiert ihn: „Du hast den Hetiter Urija mit dem Schwert erschlagen und hast dir seine Frau zur Frau genommen." Das aus der Beziehung geborene Kind wird von Gott mit dem Tod geschlagen (2. Samuel 12:14) — entgegen dem biblischen Grundsatz, dass niemand für die Sünde eines anderen sterben soll (Deuteronomium 24:16).',
    fundstelle: '2. Samuel 11,2–26 · 12,1–14',
    kern: 'mit dem Schwert erschlagen',
  },
  davidQuran: {
    typ: 'quran',
    kurz: 'Da bat Dawud seinen Herrn um Vergebung und wandte sich Ihm reuig zu.',
    original: 'فَاسْتَغْفَرَ رَبَّهُ وَخَرَّ رَاكِعًا وَأَنَابَ ۩',
    sprache: 'ar',
    translit: 'fa-staghfara rabbahū wa-kharra rākiʿan wa-anāb',
    uebersetzung:
      'Zwei Streitende testen David mit einem erfundenen Fall; er urteilt vorschnell, ohne beide Seiten zu hören. „Da bat er seinen Herrn um Vergebung und fiel in Verbeugung nieder und wandte sich Ihm reuig zu. Und so vergaben Wir ihm dies." Kein Ehebruch, kein Mord — nur ein Urteilsfehler, sofort bereut. Der Qur’an zeichnet einen Propheten, der Fehler eingesteht, statt sie zu vertuschen.',
    fundstelle: 'Sure 38 (Ṣād), Vers 21–25',
    kern: 'خَرَّ رَاكِعًا',
  },
  noahBibel: {
    typ: 'bibel',
    kurz: 'Noah pflanzte einen Weinberg, trank und lag entblößt in seinem Zelt.',
    uebersetzung:
      'Direkt nach der Flut: „Noah wurde der erste Ackerbauer und pflanzte einen Weinberg. Er trank von dem Wein, wurde davon betrunken und lag entblößt in seinem Zelt." Als sein jüngster Sohn Ham dies bemerkt und den Brüdern erzählt, verflucht Noah nicht Ham, sondern dessen unschuldigen Sohn Kanaan.',
    fundstelle: 'Genesis 9,20–25',
    kern: 'wurde davon betrunken',
  },
  noahQuran: {
    typ: 'quran',
    kurz: '950 Jahre rief Noah sein Volk zu Gott — bei Tag und bei Nacht.',
    original: 'فَلَبِثَ فِيهِمْ أَلْفَ سَنَةٍ إِلَّا خَمْسِينَ عَامًا',
    sprache: 'ar',
    translit: 'fa-labitha fīhim alfa sanatin illā khamsīna ʿāmā',
    uebersetzung:
      '„Und Wir sandten bereits Nuh zu seinem Volk. Er verweilte unter ihnen tausend Jahre weniger fünfzig Jahre." Ein Mann von solcher Ausdauer und Disziplin verliert nicht unmittelbar nach der Rettung jede Selbstbeherrschung. Statt Trunkenheit zeigt der Qur’an einen trauernden Vater, der um seinen ungläubigen, ertrunkenen Sohn zu Gott fleht (11:42–45).',
    fundstelle: 'Sure 29 (al-ʿAnkabūt), Vers 14 · vgl. 11:42–45',
    kern: 'أَلْفَ سَنَةٍ',
  },
}

export const wahrerJesusSpielregeln: Regel[] = [
  { regel: 'Wunder ≠ Göttlichkeit', text: 'Adam und Eva wurden ebenso wunderbar erschaffen wie Jesus geboren wurde — ohne dass ihnen Göttlichkeit zugeschrieben wird. Der Maßstab muss für alle gleich gelten.' },
  { regel: 'Bedürftigkeit schließt Gottheit aus', text: 'Wer essen muss, kann nicht allmächtig sein (5:75). Ein Gott, der hungert, ist ein Widerspruch in sich.' },
  { regel: 'Charakter ist der schärfste Prüfstein', text: 'Propheten sind laut Bibel und Qur’an gleichermaßen Vorbilder „an ihren Früchten werdet ihr sie erkennen" (Matthäus 7:16) — an ihrem tatsächlichen Verhalten muss sich jede Erzählung messen lassen.' },
  { regel: 'Fehler ja, schwerste Sünden nein', text: 'Der Qur’an bestreitet nicht, dass Propheten irren können (David: ein voreiliges Urteil) — aber er weist Götzendienst, Mord und Ehebruch als Erzählungen zurück, die dem Prophetentum selbst widersprechen.' },
]

export const wahrerJesusKonter: KonterItem[] = [
  {
    tier: 'stone',
    einwand: '„Die Jungfrauengeburt beweist doch, dass Jesus der Sohn Gottes ist."',
    konter:
      'Der Qur’an begegnet diesem Schluss direkt: „Das Gleichnis ʿĪsās ist bei Allah wie das Gleichnis Adams. Er erschuf ihn aus Erde." Adams Erschaffung ganz ohne Eltern war mindestens ebenso wunderbar — und niemand zieht daraus den Schluss auf seine Göttlichkeit. Derselbe Maßstab muss für Jesus gelten.',
    belegId: 'q359',
  },
  {
    tier: 'stone',
    einwand: '„Jesu harte Worte zeigen nur seine menschliche Autorität — das ist kein Problem."',
    konter:
      'Das Problem ist nicht Autorität, sondern der Ton: eine verzweifelt bittende Frau mit „Hund" abzuweisen, den engsten Jünger „Satan" zu nennen, die eigene Mutter zurückzuweisen. Der Qur’an zeigt denselben Jesus durchgehend respektvoll — auch unter Druck, auch im Endgericht vor Gott selbst („Preis sei Dir! Es steht mir nicht zu …", 5:116). Zwei Bilder desselben Mannes — nur eines erfüllt den eigenen biblischen Maßstab „an ihren Früchten werdet ihr sie erkennen".',
    belegId: 'matthaeusHund',
  },
  {
    tier: 'stone',
    einwand: '„Auch Propheten sind nur Menschen — warum sollten ihre Fehler die Bibel diskreditieren?"',
    konter:
      'Ehrliche Fehler sind menschlich, auch Propheten machen sie — der Qur’an bestreitet das nicht (David: ein voreiliges Urteil, sofort bereut). Aber Götzendienst (Aaron), Ehebruch und Mord (David), Trunkenheit (Noah) oder wiederholte Gotteslästerung (Ijob) sind etwas anderes: Sie widersprechen der Funktion des Propheten als „Sprecher" (hebr. navi) Gottes und der Erwartung, dass Schrift „nützlich zur Erziehung in der Gerechtigkeit" ist (2. Timotheus 3:16). Welche Moral lässt sich aus Gotteslästerung lernen?',
    belegId: 'davidBibel',
  },
  {
    tier: 'stone',
    einwand: '„Ijobs Klagen gegen Gott sind doch nur menschlicher Schmerzensausdruck."',
    konter:
      'Die Bibel selbst lässt einen Nicht-Propheten, den jungen Elihu, Ijob korrigieren: Er wirft ihm vor, „ohne Wissen" und „unbedacht" zu reden (Ijob 34:34–35). Wenn ein einfacher Mann mehr religiöse Einsicht zeigt als der Prophet, den „seinesgleichen es auf der Erde nicht gab", stellt das die Erzählung selbst infrage. Der Qur’an löst das Problem, indem Ijob nie Gott anklagt, sondern nur Satan für seine Not verantwortlich macht (38:41).',
    belegId: 'noahQuran',
  },
  {
    tier: 'marble',
    einwand: '„Der Qur’an beschönigt die Propheten doch nur, um den Islam gut aussehen zu lassen."',
    konter:
      'Der Qur’an bestreitet Fehlbarkeit nicht grundsätzlich — Adam isst von der verbotenen Frucht, Jona verlässt seinen Posten, David urteilt vorschnell. Was der Qur’an konsequent zurückweist, sind spezifisch die schwersten Kategorien: Götzendienst, Mord, dauerhafte Gotteslästerung. Das ist kein blindes Beschönigen, sondern eine klare, durchgehend angewandte Grenze zwischen menschlichem Fehler und Verrat an der eigenen Sendung.',
    belegId: 'aaronQuran',
  },
]

export const wahrerJesusScholar: ScholarItem[] = [
  {
    tier: 'stone',
    h: '3.1 — Die Geburtserzählung: Gemeinsamkeiten und Differenz',
    body: 'Sure 19 (Maryam) und Sure 3 (Āl ʿImrān) erzählen die Ankündigung, die Wehen am Palmenstamm, die Anschuldigung des Volkes und das sprechende Kind — Details, von denen einige (Palmenstamm, Bächlein) im Neuen Testament fehlen. Der zentrale Unterschied liegt nicht in der Faktenlage, sondern in der Deutung: „Ein Wort von Ihm" (3:45) wird im Qur’an nie zu „Gott der Sohn" — das Kind selbst korrigiert diese Deutung in der Wiege (19:30).',
  },
  {
    tier: 'stone',
    h: '3.2 — Das navi-Argument',
    body: 'Das hebräische navi („Sprecher") definiert den Propheten über seine Funktion: Gottes Botschaft glaubwürdig zu vermitteln. Eine Erzählung, die denselben Mann als Ehebrecher, Mörder oder Götzendiener zeichnet, unterminiert genau diese Funktion — seine Gemeinschaft kann seinen Ruf zu Gott mit dem Hinweis auf sein eigenes Leben kontern. Der Qur’an vermeidet dieses Problem systematisch bei Aaron, David, Noah und Ijob.',
  },
  {
    tier: 'stone',
    h: '3.3 — Elihu contra Ijob: ein biblisches Eigentor',
    body: 'Besonders aufschlussreich ist Ijob 32–35: Der junge, nicht-prophetische Elihu wird als derjenige dargestellt, der Ijobs „unbedachte" Reden gegen Gott korrigiert. Damit widerlegt der biblische Text implizit seine eigene Einleitung, Ijob sei ohnegleichen auf Erden — ein Widerspruch, den der Qur’an durch die durchgehend fromme Darstellung Ijobs (38:41–44) gar nicht erst entstehen lässt.',
  },
  {
    tier: 'marble',
    h: '3.4 — Warum die Nahrungsaufnahme (5:75) mehr ist als ein Nebensatz',
    body: 'Dass Jesus und Maria „Speise zu essen pflegten" wirkt beiläufig, ist aber ein vollständiges Argument: Bedürftigkeit impliziert Abhängigkeit, Abhängigkeit schließt Allmacht aus. Der Vers spricht bewusst zu jedem Publikum — vom Kind bis zum Gelehrten —, ohne Spezialwissen vorauszusetzen, und ist damit ein Beispiel für die vom Autor hervorgehobene qur’anische „Einfachheit ohne Kompromisse bei der Klarheit".',
  },
]

export const wahrerJesusVernetzung = [
  { ziel: 'Band 2 — Das Gotteskonzept', text: 'Wenn Bedürftigkeit Gottheit ausschließt (5:75) und Wunder sie nicht beweisen (3:59), steht die Frage aus Band 2 erneut: Was genau macht den christlichen Anspruch auf Jesu Göttlichkeit aus, wenn nicht Analogie und späte Konzilsformel?' },
  { ziel: 'Band 4 — Das Kreuz', text: 'Wenn Jesus durchgehend als Diener spricht, der nichts sagt, „wozu ich kein Recht habe" — wie verträgt sich das mit der Lehre, sein Tod am Kreuz habe die Menschheit von der Erbsünde erlöst?' },
  { ziel: 'Band 6 — Der angekündigte Prophet', text: 'Derselbe Jesus, der im Qur’an nie mehr als Gesandter beansprucht, kündigt selbst einen Propheten nach sich an — der letzte Baustein des Arguments.' },
]

export const wahrerJesusKernaussage =
  'Zwei Bücher, ein Prüfstein: An ihren Früchten sollt ihr sie erkennen. Wo die Bibel Propheten — Jesus eingeschlossen — Härte, Zweifel und schwerste Sünden zuschreibt, zeichnet der Qur’an durchgehend das Bild, das man von Gottes Auserwählten erwartet: Diener, nicht Gott; Vorbild, nicht Fallstudie.'
