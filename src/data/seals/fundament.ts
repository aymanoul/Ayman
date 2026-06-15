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
  'Bevor ein einziges Siegel geöffnet wird, steht eine Behauptung im Raum: Der Koran sagt, Muhammad ﷺ sei „bei ihnen aufgeschrieben in Tora und Evangelium" (7,157). Das ist kein frommer Wunsch, sondern eine prüfbare — und damit widerlegbare — Aussage. Drei Fundamente müssen halten: Der Koran erhebt den Anspruch wirklich. Die Bibel ist bewahrt genug, um ihn zu prüfen. Und wir lesen nach fairen, wissenschaftlichen Maßstäben. Hält das Fundament, trägt es neun Siegel.'

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
    body: 'Originalsprachen, anerkannte Lexika, kein Zirkelschluss — und gleiche Maßstäbe für Jesus und Muhammad ﷺ. Erst diese Regeln machen aus einer Behauptung einen Beweis. Ohne sie ist jedes Siegel verworfen, bevor man es liest.',
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
    { heb: 'חֲמוּדוֹת', wort: 'ḥamudot', sinn: '„vielgeliebt"', stelle: 'Daniel 9,23', siegel: 'Siegel V' },
    { heb: 'מַחֲמַדִּים', wort: 'maḥamaddīm', sinn: '„ganz und gar begehrenswert"', stelle: 'Hohelied 5,16', siegel: 'Siegel IV' },
    { heb: 'חֶמְדַּת', wort: 'ḥemdat', sinn: '„das Begehrte aller Völker"', stelle: 'Haggai 2,7', siegel: '—' },
  ],
  note: 'Eine semitische Wurzel, die im Hebräischen wie im Arabischen denselben Klang trägt: der „Gepriesene / Begehrte". Was hier eingeführt wird, wenden die Siegel IV und V am Text selbst an.',
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
    einwand: '„Die Bibel ist verfälscht — wie kannst du sie überhaupt benutzen?"',
    konter:
      'taḥrīf bedeutet im Koran nicht totalen Textverlust. 2,79: Menschen schreiben „mit eigenen Händen". 3,78: sie „verdrehen mit der Zunge". 2,159: sie „verbergen". Das ist Sinnentstellung und Verbergen — nicht das Verschwinden jedes Wortes. Zugleich beruft sich der Koran selbst auf Tora und Evangelium als „Licht und Rechtleitung" (5,46) und fordert, sie „aufzurichten" (5,68). Bewahrt genug, dass die Prophezeiungen überdauern.',
    belegId: 'q279',
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
    einwand: '„Der Koran sagt nur ‚er ist vorausgesagt‘ — ohne Kapitel und Vers."',
    konter:
      'Genau das liefern die neun Siegel. 7,157 macht eine prüfbare Behauptung: „aufgeschrieben (maktūban) bei ihnen in Tora und Evangelium". Eine prüfbare Behauptung ist eine widerlegbare Behauptung — der Koran setzt sich selbst aufs Spiel. Das Fundament zeigt, dass der Anspruch existiert; die Siegel zeigen, wo er steht.',
    belegId: 'q7157',
  },
  {
    tier: 'stone',
    einwand: '„‚Aḥmad‘ (61,6) — diesen Namen trägt kein Evangelium."',
    konter:
      'Auf der Sinn-Ebene heißt Aḥmad „der Hochgepriesene" — und genau diese Bedeutung trägt das griechische períklytos, das dem paráklētos (Joh 14–16) zum Verwechseln ähnelt. Das entfaltet Siegel VI. Auf der Namens-Ebene zählt: der Koran nennt einen kommenden Gesandten, nachprüfbar an dem, was die Schrift über ihn sagt.',
  },
  {
    tier: 'stone',
    einwand: '„Du liest den Islam in den Text hinein."',
    konter:
      'Die Regeln verbieten das: Originalsprachen, anerkannte Lexika (Strong, BDB, Gesenius, HALOT), kein Zirkelschluss. Und entscheidende Deutungen stammen nicht von Muslimen — die Kirchenväter selbst lasen Daniels viertes Reich als Rom. Wir tragen nichts hinein, was die Quellen nicht selbst sagen.',
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
    h: '0.1 — Was taḥrīf wirklich heißt',
    body: 'Zwei klassische Begriffe: taḥrīf al-maʿnā (Entstellung der Bedeutung) und taḥrīf al-lafẓ (Änderung des Wortlauts). Ibn ʿAbbās: der überlieferte Text wurde nicht ausgetauscht — verdreht wird die Auslegung. ar-Rāzī: eine flächendeckende Textänderung über alle Gemeinden und Sprachen hinweg war historisch unmöglich. Die koranischen Belege sprechen vom Schreiben mit eigenen Händen (2,79), Verdrehen der Zunge (3,78) und Verbergen (2,42; 2,159; 2,174) — nicht vom Verschwinden der Schrift.',
  },
  {
    tier: 'stone',
    h: '0.2 — Der Koran als Zeuge der früheren Schriften',
    body: 'Der Koran nennt Tora und Evangelium muṣaddiq (bestätigend, 5,46–48), „Rechtleitung und Licht", und fordert, sie „aufzurichten" (5,68). 10,94: „Wenn du im Zweifel bist über das, was Wir herabgesandt haben, so frage die, welche die Schrift vor dir lesen." Eine Schrift, auf die man die Zweifler verweist, kann man nicht zugleich für wertlos erklären.',
  },
  {
    tier: 'stone',
    h: '0.3 — Die historische Wiedererkennung',
    body: 'Menschen, die die Schrift beherrschten, erkannten die Beschreibung: ʿAbdullāh ibn Salām (Rabbiner Medinas), Salmān al-Fārisī (suchte den versprochenen Propheten mit dem „Siegel zwischen den Schultern"), der Negus von Abessinien, Waraqa ibn Naufal. Selbst Kaiser Heraklios bestätigt im Bericht des Abū Sufyān (Bukhārī 7) die prophetischen Zeichen. Die Zeichen waren lesbar — für die, die lesen wollten.',
  },
  {
    tier: 'marble',
    h: '0.4 — Die Handschriften stützen die These',
    body: 'Die Schriftrollen vom Toten Meer, der masoretische Text und die griechischen Codices zeigen einen erstaunlich stabilen Konsonantentext. Das hilft dem Argument: Ist der Text alt und stabil, kann man die Prophezeiungen nicht als späte Einfügungen abtun. Ein bewahrter Text ist der Freund dieses Beweises, nicht sein Feind.',
  },
  {
    tier: 'stone',
    h: '0.5 — Die Methode: gleiche Maßstäbe',
    body: 'Sechs Regeln: Originalsprachen; anerkannte Lexika (Strong, BDB, Gesenius, HALOT); der Text spricht selbst; kein Zirkelschluss; schwache Belege bleiben draußen; und vor allem — gleiche Maßstäbe für Jesus und Muhammad ﷺ. Was als Erfüllung für den einen gilt, muss auch für den anderen gelten dürfen.',
  },
  {
    tier: 'marble',
    h: '0.6 — Warum „Fundament" und nicht „Siegel I"',
    body: 'Dieses Kapitel ist keine einzelne Prophezeiung, sondern der Boden, auf dem die neun Siegel ruhen: der Anspruch (7,157), die Auflösung des Fälschungs-Einwands und die Leseregeln. Ohne dieses Fundament wäre jede Prophezeiung verworfen, bevor man sie liest. Erst wenn der Boden trägt, lohnt der Aufstieg.',
  },
]

export const fundamentVernetzung = [
  { ziel: 'Siegel V — Daniel', text: 'Die Wurzel Ḥ-M-D, hier eingeführt, erscheint dort als ḥamudot (Dan 9,23) — Gabriel nennt Daniel „vielgeliebt".' },
  { ziel: 'Siegel IV — Hohelied', text: 'maḥamaddīm (Hld 5,16): „ganz und gar begehrenswert" — dieselbe Wurzel, fast der Name selbst.' },
  { ziel: 'Siegel VI — Der Paraklet', text: 'Aḥmad (61,6) trifft das griechische períklytos / paráklētos (Joh 14–16): „der Gepriesene" gegen „der Tröster".' },
]

export const fundamentGleicheMassstaebe =
  'Wer von der Bibel verlangt, jedes Wort sei göttlich bewahrt, ehe eine Prophezeiung gelten darf — und zugleich vom Koran nichts dergleichen fordert — misst mit zweierlei Maß. Das Fundament verlangt nur eines: lies beide Schriften nach denselben Regeln, in ihren eigenen Sprachen, mit denselben Lexika. Auf gleichen Maßstäben hält der Anspruch — und die neun Siegel dürfen sprechen.'
