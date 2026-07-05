import type { Beleg } from '../types'

// ---------------------------------------------------------------------------
// FUNDAMENT — the ground the nine seals rest on. Not a single prophecy: the
// Quran's own falsifiable claim (7:157 — "written with them"), the resolution
// of taḥrīf (the corruption objection), and the rules of fair reading.
// Full verse / source texts live on Beleg records and surface in the modal.
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

export const fundamentThese =
  'Bevor ein einziges Buch geöffnet wird, steht eine Behauptung im Raum: Der Koran sagt, Muhammad ﷺ sei „bei ihnen aufgeschrieben in Tora und Evangelium" (7,157). Das ist kein frommer Wunsch, sondern eine prüfbare — und damit widerlegbare — Aussage. Drei Fundamente müssen halten: Der Koran erhebt den Anspruch wirklich. Die Bibel ist bewahrt genug, um ihn zu prüfen. Und wir lesen nach fairen, wissenschaftlichen Maßstäben. Hält das Fundament, trägt es die ganze Buchreihe.'

export const fundamentSteps: Step[] = [
  {
    n: 'I',
    h: 'Der Anspruch',
    body: 'Der Koran verweist auf Tora und Evangelium: dort sei der kommende Prophet „aufgeschrieben" (maktūban, 7,157), und Jesus kündige einen Gesandten namens Aḥmad an (61,6). Eine Schrift, die sich selbst an einer nachprüfbaren Aussage misst.',
  },
  {
    n: 'II',
    h: 'Der Einwand: taḥrīf',
    body: '„Aber die Bibel ist verfälscht." Wäre sie es vollständig, bräche das ganze Modul zusammen, bevor es beginnt. Also muss zuerst geklärt werden, was „Verfälschung" überhaupt heißt — und wie weit sie reicht.',
  },
  {
    n: 'III',
    h: 'Die Auflösung',
    body: 'Der Koran selbst nennt Tora und Evangelium „Rechtleitung und Licht" (5,46) und fordert, sie „aufzurichten" (5,68). taḥrīf meint Sinnentstellung und Verbergen — nicht das Verschwinden jedes Wortes. Bewahrt genug, dass die Prophezeiungen überdauern.',
  },
  {
    n: 'IV',
    h: 'Die Methode',
    body: 'Originalsprachen, anerkannte Lexika, kein Zirkelschluss — und gleiche Maßstäbe für Jesus und Muhammad ﷺ. Erst diese Regeln machen aus einer Behauptung einen Beweis. Ohne sie ist jedes Buch verworfen, bevor man es liest.',
  },
]

export const fundamentBelege: Record<string, Beleg> = {
  // ---- The central claim: "written with them" ----
  q7157: {
    typ: 'quran',
    kurz: 'Den ungelehrten Propheten, den sie bei sich in Tora und Evangelium aufgeschrieben finden.',
    original:
      'الَّذِينَ يَتَّبِعُونَ الرَّسُولَ النَّبِيَّ الْأُمِّيَّ الَّذِي يَجِدُونَهُ مَكْتُوبًا عِندَهُمْ فِي التَّوْرَاةِ وَالْإِنجِيلِ',
    sprache: 'ar',
    translit:
      'alladhīna yattabiʿūna r-rasūla n-nabiyya l-ummiyya lladhī yajidūnahu maktūban ʿindahum fī t-Tawrāti wa-l-Injīl',
    uebersetzung:
      '„… diejenigen, die dem Gesandten folgen, dem ungelehrten Propheten, den sie bei sich in der Tora und im Evangelium aufgeschrieben (maktūban) finden …"',
    fundstelle: 'Sure 7 (al-Aʿrāf), Vers 157',
    kern: 'مَكْتُوبًا',
  },

  // ---- Jesus announces Ahmad ----
  q616: {
    typ: 'quran',
    kurz: 'Jesus: ein Gesandter wird nach mir kommen, dessen Name Aḥmad ist.',
    original: 'وَمُبَشِّرًا بِرَسُولٍ يَأْتِي مِن بَعْدِي اسْمُهُ أَحْمَدُ',
    sprache: 'ar',
    translit: 'wa-mubashshiran bi-rasūlin yaʾtī min baʿdī smuhu Aḥmad',
    uebersetzung:
      '„… und als Verkünder froher Botschaft von einem Gesandten, der nach mir kommen wird, dessen Name Aḥmad ist." (Jesus, Sohn der Maria, spricht)',
    fundstelle: 'Sure 61 (aṣ-Ṣaff), Vers 6',
    kern: 'أَحْمَدُ',
  },

  // ---- They recognize him as their own sons ----
  q2146: {
    typ: 'quran',
    kurz: 'Sie erkennen ihn, wie sie ihre eigenen Söhne erkennen — und ein Teil verbirgt die Wahrheit.',
    original: 'الَّذِينَ آتَيْنَاهُمُ الْكِتَابَ يَعْرِفُونَهُ كَمَا يَعْرِفُونَ أَبْنَاءَهُمْ',
    sprache: 'ar',
    translit: 'alladhīna ātaynāhumu l-kitāba yaʿrifūnahu kamā yaʿrifūna abnāʾahum',
    uebersetzung:
      '„Diejenigen, denen Wir die Schrift gegeben haben, erkennen ihn, wie sie ihre eigenen Söhne erkennen. Doch ein Teil von ihnen verbirgt wahrlich die Wahrheit, obwohl sie es wissen."',
    fundstelle: 'Sure 2 (al-Baqara), Vers 146',
    kern: 'يَعْرِفُونَهُ',
  },

  // ---- What corruption actually is: writing with their own hands ----
  q279: {
    typ: 'quran',
    kurz: 'Wehe denen, die das Buch mit eigenen Händen schreiben und sagen: „Das ist von Gott."',
    original:
      'فَوَيْلٌ لِّلَّذِينَ يَكْتُبُونَ الْكِتَابَ بِأَيْدِيهِمْ ثُمَّ يَقُولُونَ هَٰذَا مِنْ عِندِ اللَّهِ',
    sprache: 'ar',
    translit: 'fa-waylun lilladhīna yaktubūna l-kitāba bi-aydīhim thumma yaqūlūna hādhā min ʿindi llāh',
    uebersetzung:
      '„Wehe denen, die das Buch mit ihren eigenen Händen schreiben und dann sagen: ‚Das ist von Gott‘, um es für einen geringen Preis zu verkaufen." — Verfälschung ist menschliches Hinzufügen und Verbergen, nicht das Verschwinden der Schrift.',
    fundstelle: 'Sure 2 (al-Baqara), Vers 79',
    kern: 'بِأَيْدِيهِمْ',
  },

  // ---- The Quran upholds the Torah and Gospel ----
  q568: {
    typ: 'quran',
    kurz: 'Ihr steht auf nichts, bis ihr die Tora und das Evangelium aufrichtet.',
    original: 'قُلْ يَا أَهْلَ الْكِتَابِ لَسْتُمْ عَلَىٰ شَيْءٍ حَتَّىٰ تُقِيمُوا التَّوْرَاةَ وَالْإِنجِيلَ',
    sprache: 'ar',
    translit: 'qul yā ahla l-kitābi lastum ʿalā shayʾin ḥattā tuqīmū t-Tawrāta wa-l-Injīl',
    uebersetzung:
      '„Sag: O Leute der Schrift, ihr steht auf nichts, bis ihr die Tora und das Evangelium aufrichtet und das, was zu euch von eurem Herrn herabgesandt wurde." — Eine Schrift, die man „aufrichten" soll, ist nicht wertlos.',
    fundstelle: 'Sure 5 (al-Māʾida), Vers 68',
  },

  // ---- The Gospel as guidance and light, confirming the Torah ----
  q546: {
    typ: 'quran',
    kurz: 'Wir gaben ihm das Evangelium — darin Rechtleitung und Licht, bestätigend die Tora.',
    original: 'وَآتَيْنَاهُ الْإِنجِيلَ فِيهِ هُدًى وَنُورٌ وَمُصَدِّقًا لِّمَا بَيْنَ يَدَيْهِ مِنَ التَّوْرَاةِ',
    sprache: 'ar',
    translit: 'wa-ātaynāhu l-Injīla fīhi hudan wa-nūrun wa-muṣaddiqan limā bayna yadayhi mina t-Tawrāh',
    uebersetzung:
      '„Und Wir gaben ihm das Evangelium, in dem Rechtleitung und Licht sind, bestätigend, was an Tora vor ihm vorlag — eine Rechtleitung und Ermahnung für die Gottesfürchtigen."',
    fundstelle: 'Sure 5 (al-Māʾida), Vers 46',
  },

  // ---- Source: the two kinds of taḥrīf ----
  tahrif: {
    typ: 'quelle',
    kurz: 'Klassische Gelehrte unterscheiden: Verfälschung des Sinns ≠ Auslöschung des Textes.',
    uebersetzung:
      'Die klassische Exegese kennt zwei Begriffe: taḥrīf al-maʿnā (Entstellung der Bedeutung — durch Fehldeutung, Verbergen, Übersetzung) und taḥrīf al-lafẓ (Änderung des Wortlauts). Ibn ʿAbbās hielt fest, der überlieferte Text sei nicht ersetzt worden — verdreht werde die Auslegung. Fakhr ad-Dīn ar-Rāzī argumentiert, eine flächendeckende Textänderung sei historisch unmöglich gewesen. Die koranischen „Fälschungs"-Verse sprechen vom Schreiben mit eigenen Händen (2,79), vom Verdrehen mit der Zunge (3,78) und vom Verbergen (2,159) — nicht vom Verschwinden der Schrift.',
    fundstelle: 'Ibn ʿAbbās · ar-Rāzī, Mafātīḥ al-Ghayb · vgl. 2,79 · 3,78 · 2,159',
  },

  // ---- Source: those who knew the scripture recognized him ----
  erkenntnis: {
    typ: 'quelle',
    kurz: 'Wer die Schrift kannte, erkannte die Beschreibung — Rabbiner, Mönche, Könige.',
    uebersetzung:
      'ʿAbdullāh ibn Salām, ein gelehrter Rabbiner Medinas, nahm den Islam an, sobald er den Propheten sah — „sein Gesicht war kein Gesicht eines Lügners". Salmān al-Fārisī durchwanderte das Christentum auf der Suche nach dem in der Schrift beschriebenen Propheten mit dem Siegel zwischen den Schultern. Der Negus von Abessinien und Waraqa ibn Naufal, der die hebräischen Schriften las, erkannten ihn ebenso. Erkennen ist jedoch nicht Folgen (vgl. 2,146).',
    fundstelle: 'Ṣaḥīḥ al-Bukhārī (ʿAbdullāh ibn Salām; Salmān al-Fārisī; Heraklios, Nr. 7)',
  },

  // ---- The covenant of all prophets to aid the coming messenger ----
  q381: {
    typ: 'quran',
    kurz: 'Gott nahm den Bund der Propheten: kommt der bestätigende Gesandte — glaubt an ihn, steht ihm bei.',
    original:
      'وَإِذْ أَخَذَ اللَّهُ مِيثَاقَ النَّبِيِّينَ ... ثُمَّ جَاءَكُمْ رَسُولٌ مُّصَدِّقٌ لِّمَا مَعَكُمْ لَتُؤْمِنُنَّ بِهِ وَلَتَنصُرُنَّهُ',
    sprache: 'ar',
    translit:
      'wa-idh akhadha llāhu mīthāqa n-nabiyyīn … thumma jāʾakum rasūlun muṣaddiqun limā maʿakum la-tuʾminunna bihi wa-la-tanṣurunnah',
    uebersetzung:
      '„Und als Gott den Bund der Propheten nahm: … dann kommt zu euch ein Gesandter, der bestätigt, was bei euch ist — an ihn sollt ihr glauben und ihm beistehen." — Ihn abzulehnen heißt, den Bund Abrahams, Moses und Jesu zu brechen.',
    fundstelle: 'Sure 3 (Āl ʿImrān), Vers 81',
    kern: 'مِيثَاقَ النَّبِيِّينَ',
  },

  // ---- Preservation guaranteed only to the Quran ----
  q159: {
    typ: 'quran',
    kurz: 'Wir haben die Ermahnung herabgesandt, und Wir wachen wahrlich über sie.',
    original: 'إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ',
    sprache: 'ar',
    translit: 'innā naḥnu nazzalnā dh-dhikra wa-innā lahu la-ḥāfiẓūn',
    uebersetzung:
      '„Wahrlich, Wir sind es, die die Ermahnung (den Koran) herabgesandt haben, und Wir wachen wahrlich über sie." — Die Bewahrungsgarantie gilt exklusiv dem Koran, nicht den früheren Schriften. Darum: Spuren, keine Reinschrift.',
    fundstelle: 'Sure 15 (al-Ḥijr), Vers 9',
    kern: 'لَحَافِظُونَ',
  },

  // ---- Source: the two-fold nature of the earlier scriptures ----
  doppelnatur: {
    typ: 'quelle',
    kurz: 'Doppelnatur der Bibel: ursprünglich Licht und Rechtleitung — durch Menschenhand teils verfälscht.',
    uebersetzung:
      'Der Koran beschreibt Tora und Evangelium zweifach: ursprünglich „voll Rechtleitung und Licht" (5,44–46; 3,3), in denen Gottes Wort steht; zugleich aber durch Menschenhand verfälscht — geschrieben „mit ihren eigenen Händen" (2,79), verdreht „mit der Zunge" (3,78), „verborgen" (2,159). Die Bewahrungsgarantie gilt allein dem Koran (15,9). Folglich sind in der Bibel detektierbare, aber bestreitbare Spuren zu erwarten — „Wegweiser, sodass keine Entschuldigung bleibt", nicht eine fehlerlose Reinschrift.',
    fundstelle: 'Koran 5,44–46 · 3,3 · 2,79 · 3,78 · 2,159 · 15,9',
  },

  // ---- Hadith Bukhari 2125: the Torah-description matches Isaiah 42 ----
  bukhari2125: {
    typ: 'quelle',
    kurz: 'ʿAbdullāh ibn ʿAmr: der Prophet ﷺ ist in der Tora beschrieben — Zug um Zug wie Jesaja 42.',
    uebersetzung:
      'ʿAbdullāh ibn ʿAmr ibn al-ʿĀṣ schwört, der Prophet ﷺ sei in der Tora beschrieben: „Zeuge (shāhid), Bringer froher Botschaft (mubashshir) und Warner (nadhīr), Hüter der Schriftunkundigen (ḥirz li-l-ummiyyīn) … Mein Diener und Gesandter; Ich habe ihn al-Mutawakkil genannt — nicht grob, nicht hart, kein Lärmer auf den Märkten; er vergilt Böses nicht mit Bösem, sondern verzeiht … Gott öffnet durch ihn blinde Augen, taube Ohren, verhüllte Herzen." Das deckt sich Zug um Zug mit Jesaja 42,1-3.6-7.',
    fundstelle: 'Ṣaḥīḥ al-Bukhārī 2125 · vgl. Jesaja 42,1-3.6-7',
  },

  // ---- Hadith: the five names, including Ahmad ----
  funfnamen: {
    typ: 'quelle',
    kurz: 'Ich habe (mehrere) Namen: ich bin Muhammad, ich bin Aḥmad …',
    uebersetzung:
      'Der Prophet ﷺ sagte: „Ich habe (mehrere) Namen: Ich bin Muhammad, ich bin Aḥmad, ich bin al-Māḥī (durch den Gott den Unglauben tilgt), ich bin al-Ḥāshir (zu dessen Füßen die Menschen versammelt werden), und ich bin al-ʿĀqib (nach dem kein Prophet kommt)." — Der Name Aḥmad, den Jesus ankündigte (61,6), aus dem Mund des Propheten selbst.',
    fundstelle: 'Ṣaḥīḥ al-Bukhārī 3532 · Ṣaḥīḥ Muslim 2354',
  },

  // ---- Capstone: the prayer of Abraham, the good news of Jesus ----
  capstone: {
    typ: 'quelle',
    kurz: 'Ich bin das Bittgebet meines Vaters Abraham und die frohe Botschaft Jesu.',
    uebersetzung:
      '„Ich bin das Bittgebet (daʿwa) meines Vaters Abraham und die frohe Botschaft Jesu (bushrā ʿĪsā)." — Der Prophet ﷺ verknüpft selbst zwei biblische Fäden: das Gebet Abrahams und Ismaels um einen Gesandten aus ihrer Mitte (2,129) und die Ankündigung Jesu von Aḥmad (61,6). Von al-Albānī als ṣaḥīḥ eingestuft.',
    fundstelle: 'al-Albānī, Silsila aṣ-Ṣaḥīḥa 1546 · vgl. Koran 2,129 · 61,6',
  },
}

// ---- Ibn ʿAmr (Bukhari 2125) ↔ Isaiah 42: the description, side by side ------
export const ibnAmrJesaja = {
  intro:
    'Der „Zeig-mir-den-Vers"-Einwand verlangt den Schriftzug „Muhammad". Doch der ṣaḥīḥ-Hadith Bukhārī 2125 nennt die Tora-Beschreibung des Propheten ﷺ — und sie deckt sich Zug um Zug mit Jesaja 42. Eine Beschreibung, kein Buchstabenrätsel.',
  spalten: ['Hadith (Bukhārī 2125) — die Tora-Beschreibung', 'Jesaja 42 — der Knecht Gottes'],
  zeilen: [
    { h: '„Mein Diener und Gesandter"', j: '„Siehe, mein Knecht, den ich halte" (42,1)' },
    { h: '„Zeuge, Bringer froher Botschaft und Warner"', j: '„als Bund des Volkes, als Licht der Heiden" (42,6)' },
    { h: '„kein Lärmer auf den Märkten"', j: '„er schreit nicht und erhebt seine Stimme nicht auf der Gasse" (42,2)' },
    { h: '„nicht grob, nicht hart … verzeiht"', j: '„das geknickte Rohr zerbricht er nicht" (42,3)' },
    { h: '„Gott öffnet durch ihn blinde Augen, taube Ohren"', j: '„blinde Augen zu öffnen, Gefangene herauszuführen" (42,7)' },
    { h: '„Hüter der Schriftunkundigen (ummiyyīn)"', j: '„ich gab dich … zum Licht der Völker (gôyīm)" (42,6)' },
  ],
  pointe:
    'Sechs Züge, eine Gestalt. Die Tora-Beschreibung, die der Prophet ﷺ für sich beanspruchte, steht — lesbar — in Jesaja 42. Das entfaltet Buch 4.',
}

// ---- The taḥrīf spectrum (centre-piece exhibit) ------------------------------
export const tahrifSpektrum = {
  lead: 'Die Frage „Ist die Bibel verfälscht?" hat nicht zwei Antworten, sondern ein ganzes Spektrum. An beiden Rändern stehen Positionen, die scheitern — die belegte Haltung liegt dazwischen, näher am bewahrten Text.',
  links: 'Jedes Wort göttlich bewahrt',
  rechts: 'Alles frei erfunden',
  marker: 64,
  these: 'Sinn verfälscht · Text weithin bewahrt',
  pointe:
    'taḥrīf al-maʿnā — Entstellung des Sinns, Verbergen, Fehlübersetzung. Der Konsonantentext blieb so stabil (von Qumran bis zu den griechischen Codices), dass die Prophezeiungen ihn überdauerten. Genau dieser Rest ist es, den wir lesen.',
}

// ---- The name root Ḥ-M-D (introduces the thread the seals follow) ------------
export const nameThread = {
  root: 'Ḥ · M · D',
  bedeutung: 'preisen · loben · begehren',
  namen: [
    { ar: 'أَحْمَد', trans: 'Aḥmad', glanz: '„der Hochpreisende / Gepriesenste"', ref: 'Koran 61,6 — Jesu Ankündigung' },
    { ar: 'مُحَمَّد', trans: 'Muhammad', glanz: '„der Gepriesene / Vielgelobte"', ref: 'der Name des Propheten ﷺ' },
  ],
  spuren: [
    { heb: 'חֲמוּדוֹת', wort: 'ḥamudot', sinn: '„vielgeliebt"', stelle: 'Daniel 9,23', siegel: 'Buch 6' },
    { heb: 'מַחֲמַדִּים', wort: 'maḥamaddīm', sinn: '„ganz und gar begehrenswert"', stelle: 'Hohelied 5,16', siegel: 'Buch 5' },
    { heb: 'חֶמְדַּת', wort: 'ḥemdat', sinn: '„das Begehrte aller Völker"', stelle: 'Haggai 2,7', siegel: '—' },
  ],
  note: 'Eine semitische Wurzel, die im Hebräischen wie im Arabischen denselben Klang trägt: der „Gepriesene / Begehrte". Was hier eingeführt wird, wenden die Bücher 5 und 6 am Text selbst an.',
}

// ---- The rules of fair reading ----------------------------------------------
export const spielregeln = [
  { regel: 'Originalsprachen', text: 'Hebräisch, Aramäisch, Griechisch — nicht die deutsche Übersetzung allein.' },
  { regel: 'Anerkannte Lexika', text: 'Strong, Brown-Driver-Briggs, Gesenius, HALOT — keine selbstgemachten Wörterbücher.' },
  { regel: 'Der Text spricht selbst', text: 'Keine Lesart hineintragen; die Schrift auf ihren eigenen Begriffen lesen.' },
  { regel: 'Gleiche Maßstäbe', text: 'Was als Beweis für Jesus zählt, muss auch für Muhammad ﷺ zählen — und umgekehrt.' },
  { regel: 'Kein Zirkelschluss', text: 'Wir setzen nicht voraus, was wir erst beweisen wollen.' },
  { regel: 'Schwache Belege bleiben draußen', text: 'Kein Barnabas-Evangelium, keine späten Fälschungen — nur kanonische Texte.' },
]

export const fundamentKonter: KonterItem[] = [
  {
    tier: 'stone',
    einwand: '„Der Koran nennt die Bibel gefälscht — das ist ein Widerspruch!"',
    konter:
      'Kein Widerspruch, sondern Doppelnatur: Tora und Evangelium sind ursprünglich „Rechtleitung und Licht" (5,44–46; 3,3), doch durch Menschenhand teils verfälscht — geschrieben „mit eigenen Händen" (2,79), verdreht „mit der Zunge" (3,78), „verborgen" (2,159). Die Bewahrungsgarantie gilt allein dem Koran (15,9). Also erwarten wir Spuren, keine Reinschrift — genug, dass die Prophezeiungen überdauern.',
    belegId: 'doppelnatur',
  },
  {
    tier: 'stone',
    einwand: '„Dann zeig den Vers, der ‚Muhammad‘ buchstabiert!"',
    konter:
      'Falscher Maßstab: Gott bewahrte Wegweiser, keinen Schriftzug. Der ṣaḥīḥ-Hadith Bukhārī 2125 nennt die Tora-Beschreibung des Propheten ﷺ — Zeuge, Bringer froher Botschaft, Warner, kein Lärmer auf den Märkten, öffnet blinde Augen — und sie deckt sich Zug um Zug mit Jesaja 42. Eine prüfbare Beschreibung, kein Buchstabenrätsel.',
    belegId: 'bukhari2125',
  },
  {
    tier: 'stone',
    einwand: '„Das ist muslimische Rückprojektion — nachträglich hineingelesen."',
    konter:
      'Nein: jüdische Stämme zogen schon VOR dem Islam in die lebensfeindliche Wüste um Medina, ausdrücklich in Erwartung eines arabischen Propheten, dessen Ort und Zeit ihre eigenen Schriften verrieten (Ibn Isḥāq). Sie verhöhnten ihre heidnischen Nachbarn: „Wenn unser Prophet kommt …" Die Erwartung ging dem Ereignis voraus — das entfaltet Buch 8.',
  },
  {
    tier: 'stone',
    einwand: '„Selbst wenn — warum sollte ich ihn deshalb annehmen?"',
    konter:
      'Weil der Koran den Bund aller Propheten nennt: kommt der bestätigende Gesandte, „glaubt an ihn und steht ihm bei" (3,81). Ihn abzulehnen heißt nicht, eine Religion abzulehnen, sondern den Bund Abrahams, Moses und Jesu zu brechen — die ihn vorausverkündeten.',
    belegId: 'q381',
  },
  {
    tier: 'stone',
    einwand: '„Stünde Muhammad in der Bibel, wären alle Juden und Christen Muslime geworden."',
    konter:
      'Manche wurden es — gerade weil sie die Schrift kannten: ʿAbdullāh ibn Salām (Rabbiner), Salmān al-Fārisī (suchte den Propheten nach den Schriftzeichen), der Negus, Waraqa ibn Naufal. Der Koran sagt: sie erkennen ihn „wie ihre eigenen Söhne" (2,146) — und ein Teil verbirgt es bewusst. Erkennen ist nicht dasselbe wie Folgen.',
    belegId: 'q2146',
  },
  {
    tier: 'stone',
    einwand: '„‚Aḥmad‘ (61,6) — diesen Namen trägt kein Evangelium."',
    konter:
      'Der Prophet ﷺ trägt mehrere Namen, darunter Aḥmad (Bukhārī 3532; Muslim 2354). Auf der Sinn-Ebene heißt Aḥmad „der Hochgepriesene" — exakt die Bedeutung des griechischen períklytos, das dem paráklētos (Joh 14–16) zum Verwechseln ähnelt (Buch 7). Auf der Namens-Ebene zählt: der Koran nennt einen kommenden Gesandten, nachprüfbar an dem, was die Schrift über ihn sagt.',
    belegId: 'funfnamen',
  },
  {
    tier: 'stone',
    einwand: '„Muslime rufen ‚Fälschung‘, wenn es passt, und zitieren die Bibel, wenn es passt."',
    konter:
      'Kein Widerspruch, wenn man zwei Ebenen trennt: die Textüberlieferung (Handschriften — weithin stabil, von Qumran bis zu den griechischen Codices) und die Deutung / Übersetzung / das Verbergen (dort sitzt das taḥrīf). Die überlebenden Prophezeiungen sind gerade der Rest, den keine Redaktion getilgt hat — peinlich genug, um echt zu sein.',
    belegId: 'tahrif',
  },
  {
    tier: 'marble',
    einwand: '„Das Barnabas-Evangelium nennt Muhammad beim Namen — das ist euer Beweis."',
    konter:
      'Nein — und wir lehnen es ausdrücklich ab. Es ist spätmittelalterlich, voller Anachronismen, kein Beleg. Das Fundament steht auf den kanonischen Texten von Juden und Christen selbst, nicht auf späten Fälschungen. Schwache Belege bleiben draußen — auch wenn sie unsere These zu stützen scheinen.',
  },
]

export const fundamentScholar: ScholarItem[] = [
  {
    tier: 'stone',
    h: '0.1 — Die koranische Tatsachenbehauptung',
    body: 'Der Koran stellt es ohne Konjunktiv fest: der Prophet ﷺ ist „bei ihnen aufgeschrieben in Tora und Evangelium" (7,157); Jesus kündigt Aḥmad an (61,6); die Schriftbesitzer „erkennen ihn, wie sie ihre eigenen Söhne erkennen" (2,146; 6,20). Es ist keine Bitte um Bestätigung, sondern eine festgestellte Tatsache — und damit eine prüfbare, widerlegbare.',
  },
  {
    tier: 'stone',
    h: '0.2 — Die Doppelnatur der Bibel',
    body: 'Tora und Evangelium waren ursprünglich „voll Rechtleitung und Licht" (5,44–46; 3,3) — echtes Gotteswort. Zugleich verfälscht durch Menschenhand: geschrieben „mit eigenen Händen" (2,79), verdreht „mit der Zunge" (3,78), „verborgen" (2,159). Die Bewahrungsgarantie gilt exklusiv dem Koran: „Wir wachen über ihn" (15,9). Kein Widerspruch, sondern zwei Schichten.',
  },
  {
    tier: 'stone',
    h: '0.3 — Daraus folgt: Spuren, keine Reinschrift',
    body: 'Aus der Doppelnatur folgt zwingend, was wir erwarten dürfen: detektierbare, aber bestreitbare Spuren — „Wegweiser, sodass keine Entschuldigung bleibt", nicht eine fehlerlose, eindeutige Reinschrift. Wer einen makellosen Schriftzug „Muhammad" verlangt, fordert genau das, was die Doppelnatur ausschließt.',
  },
  {
    tier: 'stone',
    h: '0.4 — Die Erkenntnishaltung gegenüber der Schrift',
    body: 'Der Prophet ﷺ gebot eine mittlere Haltung: „Bestätigt die Leute der Schrift nicht und erklärt sie nicht für Lügner, sondern sagt: Wir glauben an das, was zu uns und zu euch herabgesandt wurde" (Sunan Abī Dāwūd 3644; Parallele bei Bukhārī). Weder blinde Übernahme noch pauschale Verwerfung — Prüfung.',
  },
  {
    tier: 'stone',
    h: '0.5 — Der Hadith-Beleg: Ibn ʿAmr = Jesaja 42',
    body: 'ʿAbdullāh ibn ʿAmr ibn al-ʿĀṣ schwört, der Prophet ﷺ sei in der Tora beschrieben — „Zeuge, Bringer froher Botschaft, Warner, Hüter der Schriftunkundigen, al-Mutawakkil … kein Lärmer auf den Märkten" (Bukhārī 2125). Das deckt sich mit Jesaja 42. Capstone: „Ich bin das Bittgebet meines Vaters Abraham und die frohe Botschaft Jesu" (Albānī, Silsila 1546) — verknüpft 2,129 und 61,6.',
  },
  {
    tier: 'marble',
    h: '0.6 — Die Handschriften stützen die These',
    body: 'Die Schriftrollen vom Toten Meer, der masoretische Text und die griechischen Codices zeigen einen erstaunlich stabilen Konsonantentext. Das hilft dem Argument: Ist der Text alt und stabil, kann man die Prophezeiungen nicht als späte Einfügungen abtun. Ein bewahrter Text ist der Freund dieses Beweises, nicht sein Feind.',
  },
  {
    tier: 'stone',
    h: '0.7 — Die Methode: gleiche Maßstäbe',
    body: 'Sechs Regeln: Originalsprachen; anerkannte Lexika (Strong, BDB, Gesenius, HALOT); der Text spricht selbst; kein Zirkelschluss; schwache Belege bleiben draußen; und vor allem — gleiche Maßstäbe für Jesus und Muhammad ﷺ. Was als Erfüllung für den einen gilt, muss auch für den anderen gelten dürfen.',
  },
]

export const fundamentVernetzung = [
  { ziel: 'Buch 4 — Arabische Prophezeiungen', text: 'Die Tora-Beschreibung aus Bukhārī 2125 deckt sich mit Jesaja 42 — dort wird sie zum vollen geografischen Beweis.' },
  { ziel: 'Buch 7 — Der Paraklet', text: 'Hier devotional eingeführt, wird Aḥmad (61,6) dort zum Vollbeweis: períklytos / paráklētos (Joh 14–16).' },
  { ziel: 'Verteidigung — Falscher Prophet?', text: 'Die Doppelnatur (Bewahrung nur des Koran, 15,9) ist zugleich die Antwort auf den Abrogations-Einwand.' },
]

export const fundamentGleicheMassstaebe =
  'Wer von der Bibel verlangt, jedes Wort sei göttlich bewahrt, ehe eine Prophezeiung gelten darf — und zugleich vom Koran nichts dergleichen fordert — misst mit zweierlei Maß. Das Fundament verlangt nur eines: lies beide Schriften nach denselben Regeln, in ihren eigenen Sprachen, mit denselben Lexika. Auf gleichen Maßstäben hält der Anspruch — und die neun Bücher dürfen sprechen.'
