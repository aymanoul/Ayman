import type { Beleg } from '../types'

// ---------------------------------------------------------------------------
// SIEGEL VI — Der Paraklet (أحمد · Aḥmad). In John 14–16 Jesus promises
// "another Paraclete" who comes only after he departs, "does not speak on his
// own but speaks what he hears," guides into all truth and declares what is to
// come. The Quran says Jesus announced a messenger named Aḥmad — "the most
// praised" — which is, sense for sense, the Greek períklytos, a vowel-step from
// the transmitted paráklētos. Three keys: the name's meaning, the prophet-like
// description, and the timing. John 14,26 names "the Holy Spirit" — the boldest
// counter; we weigh it honestly and read by equal measures. A thread, marked.
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

export const parakletThese =
  'In Johannes 14–16 verheißt Jesus „einen anderen Beistand" (Paraklet), der erst nach seinem Weggang kommt, der „nicht aus sich selbst redet, sondern was er hört", der in alle Wahrheit leitet und das Kommende verkündet. Der Koran sagt, Jesus habe einen Gesandten namens Aḥmad angekündigt — „der Hochgepriesene" — und das ist, Bedeutung für Bedeutung, das griechische períklytos, nur einen Vokalschritt vom überlieferten paráklētos entfernt. Drei Schlüssel: die Bedeutung des Namens, die prophetengleiche Beschreibung und die zeitliche Abfolge. Ehrlich gewogen — denn Johannes 14,26 nennt den Parakleten „den Heiligen Geist" — ist dies das kühnste der Siegel; wir markieren seine Grenzen und lesen nach gleichen Maßstäben.'

export const parakletSteps: Step[] = [
  {
    n: 'I',
    h: 'Die Verheißung',
    body: 'Jesus verspricht „einen anderen Beistand" (állon paráklēton, Joh 14,16), den der Vater senden wird. Er kommt erst, wenn Jesus geht (16,7), bleibt „in Ewigkeit" (14,16) und leitet „in alle Wahrheit" (16,13). Eine künftige, gesandte Gestalt.',
  },
  {
    n: 'II',
    h: 'Der Klang: períklytos',
    body: 'Das überlieferte paráklētos heißt „Fürsprecher, Tröster". Nur die Vokale trennen es von períklytos — „der Hochberühmte, Vielgepriesene". Das ist die genaue griechische Entsprechung von Aḥmad / Muhammad (Wurzel Ḥ-M-D, „preisen"). Der Name, den 61,6 nennt.',
  },
  {
    n: 'III',
    h: 'Die Beschreibung',
    body: '„Er wird nicht aus sich selbst reden, sondern was er hört, das wird er reden" (16,13) — das Bild eines Propheten, der Offenbarung empfängt (vgl. 53,3-4). Er verkündet Künftiges, zeugt von Jesus (15,26), und „ihr werdet ihn sehen" (14,17-19): einen Geist empfängt man, eine Person sieht man.',
  },
  {
    n: 'IV',
    h: 'Ehrlich gewogen',
    body: 'Johannes 14,26 nennt den Parakleten „den Heiligen Geist" — der stärkste Einwand, und wir verschweigen ihn nicht. Doch der Geist war längst gegenwärtig (1. Mose 1,2; Joh 1,32; 20,22); ein Beistand, der erst nach Jesu Weggang kommt, weist eher auf eine künftige Gestalt. Wir beanspruchen einen Faden — verwoben mit Siegel IV und V —, keinen Alleinbeweis.',
  },
]

export const parakletBelege: Record<string, Beleg> = {
  // ---- Another Paraclete ----
  john1416: {
    typ: 'bibel',
    kurz: 'Ich werde den Vater bitten, und er gibt euch einen anderen Beistand — für immer.',
    original:
      'κἀγὼ ἐρωτήσω τὸν πατέρα καὶ ἄλλον παράκλητον δώσει ὑμῖν ἵνα μεθ’ ὑμῶν εἰς τὸν αἰῶνα ᾖ',
    sprache: 'grc',
    translit: 'kagṑ erōtḗsō ton patéra, kai állon paráklēton dṓsei hymîn, hína meth’ hymôn eis ton aiôna ȇ',
    uebersetzung:
      '„Und ich werde den Vater bitten, und er wird euch einen anderen Beistand (állon paráklēton) geben, dass er bei euch sei in Ewigkeit." — „Ein anderer" (allos) — von Jesu eigener Art.',
    fundstelle: 'Johannes 14,16',
    status: 'allos = ein anderer derselben Art',
    kern: 'ἄλλον παράκλητον',
  },

  // ---- The Holy Spirit — the counter-verse, included honestly ----
  john1426: {
    typ: 'bibel',
    kurz: 'Der Beistand aber, der Heilige Geist, den der Vater senden wird … wird euch alles lehren.',
    original:
      'ὁ δὲ παράκλητος, τὸ πνεῦμα τὸ ἅγιον, ὃ πέμψει ὁ πατὴρ ἐν τῷ ὀνόματί μου, ἐκεῖνος ὑμᾶς διδάξει πάντα',
    sprache: 'grc',
    translit: 'ho de paráklētos, to pneûma to hágion, ho pémpsei ho patḕr en tô onómatí mou, ekeînos hymâs didáxei pánta',
    uebersetzung:
      '„Der Beistand aber, der Heilige Geist, den der Vater senden wird in meinem Namen, der wird euch alles lehren." — Der stärkste Gegen-Vers. Wir stellen ihn offen hin und wägen ihn ehrlich.',
    fundstelle: 'Johannes 14,26',
    kern: 'τὸ πνεῦμα τὸ ἅγιον',
  },

  // ---- He will testify of me ----
  john1526: {
    typ: 'bibel',
    kurz: 'Wenn der Beistand kommt, den ich vom Vater senden werde — der wird von mir zeugen.',
    original:
      'ὅταν ἔλθῃ ὁ παράκλητος ὃν ἐγὼ πέμψω ὑμῖν παρὰ τοῦ πατρός, τὸ πνεῦμα τῆς ἀληθείας … ἐκεῖνος μαρτυρήσει περὶ ἐμοῦ',
    sprache: 'grc',
    translit: 'hótan élthē ho paráklētos hon egṑ pémpsō hymîn parà toû patrós, to pneûma tês alētheías … ekeînos martyrḗsei perì emoû',
    uebersetzung:
      '„Wenn aber der Beistand kommt, den ich euch vom Vater senden werde, der Geist der Wahrheit … der wird von mir zeugen." — Er bestätigt und ehrt Jesus, wie der Koran Jesus ehrt.',
    fundstelle: 'Johannes 15,26',
    kern: 'μαρτυρήσει περὶ ἐμοῦ',
  },

  // ---- If I do not go, he will not come ----
  john167: {
    typ: 'bibel',
    kurz: 'Wenn ich nicht weggehe, kommt der Beistand nicht zu euch.',
    original:
      'συμφέρει ὑμῖν ἵνα ἐγὼ ἀπέλθω. ἐὰν γὰρ μὴ ἀπέλθω, ὁ παράκλητος οὐκ ἐλεύσεται πρὸς ὑμᾶς· ἐὰν δὲ πορευθῶ, πέμψω αὐτὸν πρὸς ὑμᾶς',
    sprache: 'grc',
    translit: 'sympférei hymîn hína egṑ apélthō. eàn gàr mḕ apélthō, ho paráklētos ouk eleúsetai pròs hymâs; eàn dè poreuthô, pémpsō autòn pròs hymâs',
    uebersetzung:
      '„Es ist gut für euch, dass ich weggehe. Denn wenn ich nicht weggehe, wird der Beistand nicht zu euch kommen; wenn ich aber gehe, werde ich ihn zu euch senden." — Eine klare zeitliche Abfolge: erst nach Jesu Weggang.',
    fundstelle: 'Johannes 16,7',
    kern: 'ἐὰν μὴ ἀπέλθω',
  },

  // ---- He speaks what he hears ----
  john1613: {
    typ: 'bibel',
    kurz: 'Er wird nicht aus sich selbst reden, sondern was er hört — und das Kommende verkünden.',
    original:
      'ὅταν δὲ ἔλθῃ ἐκεῖνος, τὸ πνεῦμα τῆς ἀληθείας, ὁδηγήσει ὑμᾶς ἐν τῇ ἀληθείᾳ πάσῃ· οὐ γὰρ λαλήσει ἀφ’ ἑαυτοῦ, ἀλλ’ ὅσα ἀκούσει λαλήσει, καὶ τὰ ἐρχόμενα ἀναγγελεῖ ὑμῖν',
    sprache: 'grc',
    translit:
      'hótan dè élthē ekeînos, to pneûma tês alētheías, hodēgḗsei hymâs en tê alētheíā pásē; ou gàr lalḗsei aph’ heautoû, all’ hósa akoúsei lalḗsei, kaì tà erchómena anangeleî hymîn',
    uebersetzung:
      '„Wenn aber jener kommt, der Geist der Wahrheit, wird er euch in die ganze Wahrheit leiten; denn er wird nicht aus sich selbst reden, sondern was er hört, das wird er reden, und das Kommende wird er euch verkünden." — Das Bild des Propheten, der Offenbarung weitergibt.',
    fundstelle: 'Johannes 16,13',
    kern: 'ὅσα ἀκούσει λαλήσει',
  },

  // ---- Quran: Jesus announces Ahmad ----
  q616: {
    typ: 'quran',
    kurz: 'Jesus: ein Gesandter wird nach mir kommen, dessen Name Aḥmad ist.',
    original: 'وَمُبَشِّرًا بِرَسُولٍ يَأْتِي مِن بَعْدِي اسْمُهُ أَحْمَدُ',
    sprache: 'ar',
    translit: 'wa-mubashshiran bi-rasūlin yaʾtī min baʿdī smuhu Aḥmad',
    uebersetzung:
      '„… und als Verkünder eines Gesandten, der nach mir kommen wird, dessen Name Aḥmad ist." (Jesus, Sohn der Maria, spricht) — Aḥmad: „der Hochgepriesene" = períklytos.',
    fundstelle: 'Sure 61 (aṣ-Ṣaff), Vers 6',
    kern: 'أَحْمَدُ',
  },

  // ---- Quran: he speaks only revelation ----
  q5334: {
    typ: 'quran',
    kurz: 'Er spricht nicht aus eigener Neigung — es ist nur Offenbarung.',
    original: 'وَمَا يَنطِقُ عَنِ الْهَوَىٰ ۝ إِنْ هُوَ إِلَّا وَحْيٌ يُوحَىٰ',
    sprache: 'ar',
    translit: 'wa-mā yanṭiqu ʿani l-hawā · in huwa illā waḥyun yūḥā',
    uebersetzung:
      '„Und er spricht nicht aus eigener Neigung. Es ist nichts anderes als eine Offenbarung, die (ihm) eingegeben wird." — Genau „was er hört, das redet er" (Joh 16,13).',
    fundstelle: 'Sure 53 (an-Najm), Verse 3–4',
    kern: 'وَحْيٌ يُوحَىٰ',
  },

  // ---- Source: paraclete / periklytos philology ----
  periklytos: {
    typ: 'quelle',
    kurz: 'paráklētos „Beistand" — períklytos „der Gepriesene" = Aḥmad. Nähe in Klang, Treffer im Sinn.',
    uebersetzung:
      'Griech. παράκλητος (paráklētos) bedeutet „der Herbeigerufene": Fürsprecher, Beistand, Tröster. περικλυτός (períklytos) bedeutet „weithin berühmt, hochgepriesen" — die exakte Entsprechung von Aḥmad / Muhammad (Wurzel Ḥ-M-D, „preisen, rühmen"). Die beiden Wörter trennt im Wesentlichen die Vokalisierung. Ehrlich: keine erhaltene griechische Handschrift liest períklytos — wir behaupten keine Textvariante, sondern die auffällige Nähe in Klang und die genaue Übereinstimmung im Sinn mit dem in 61,6 genannten Namen.',
    fundstelle: 'Liddell-Scott-Jones (παράκλητος · περικλυτός) · vgl. Koran 61,6',
  },

  // ---- Source: the Spirit was already present ----
  geistschon: {
    typ: 'quelle',
    kurz: 'Der Heilige Geist war längst gegenwärtig — warum dann „erst wenn ich gehe"?',
    uebersetzung:
      'Die Bibel bezeugt den Heiligen Geist lange vor Jesu Weggang: bei der Schöpfung schwebt er über den Wassern (1. Mose 1,2), er kommt über die Propheten (1. Samuel 10,10; 4. Mose 11,25), er steigt bei der Taufe sichtbar auf Jesus herab (Johannes 1,32-33), und Jesus selbst haucht ihn den Jüngern ein (Johannes 20,22). War der Geist also schon gegenwärtig, so passt „wenn ich nicht weggehe, kommt er nicht" (16,7) besser auf eine künftige, eigene Gestalt als auf den immer schon wirkenden Geist.',
    fundstelle: '1. Mose 1,2 · 1. Samuel 10,10 · Johannes 1,32-33 · 20,22',
  },

  // ---- Source: "another" of the same kind + traits of a person ----
  anderer: {
    typ: 'quelle',
    kurz: '„Ein anderer" (allos) Paraklet — von Jesu Art; und Züge, die auf eine Person weisen.',
    uebersetzung:
      'Jesus sagt „einen ANDEREN Beistand" (állon paráklēton, 14,16). Das griechische allos meint „ein anderer derselben Art" (im Unterschied zu heteros, „ein andersartiger"). Da Jesus selbst ein menschlicher Gesandter war, ist der „andere" von gleicher Art. Hinzu treten die Züge: „ihr werdet ihn sehen" (14,19), „er hört und redet" (16,13), „er verkündet das Kommende" — Merkmale, die eine Person besser fassen als einen körperlosen Geist.',
    fundstelle: 'Johannes 14,16-19 · 16,13 · Grammatik: allos vs. heteros',
  },
}

// ---- Exhibit 1: the two Greek words (reuses .baca bridge styling) ----------
export const zweiWoerter = {
  intro:
    'Ein Vokalschritt trennt zwei griechische Wörter — und das zweite ist, Bedeutung für Bedeutung, der Name Aḥmad.',
  links: { titel: 'Der überlieferte Text', wort: 'παράκλητος', trans: 'paráklētos', sinn: '„Beistand · Fürsprecher · Tröster"' },
  rechts: { titel: 'Bedeutung wie Aḥmad', wort: 'περικλυτός', trans: 'períklytos', sinn: '„der Hochberühmte · Vielgepriesene"' },
  parallelen: [
    { merkmal: 'Nur ein Klangschritt', text: 'paráklētos und períklytos unterscheiden sich im Wesentlichen in den Vokalen — im Konsonantengerüst stehen sie eng beieinander.' },
    { merkmal: 'Die Bedeutung des Namens', text: 'períklytos „der Gepriesene" ist die genaue griechische Entsprechung von Aḥmad / Muhammad (Ḥ-M-D, „preisen").' },
    { merkmal: 'Ehrliche Grenze', text: 'Keine erhaltene Handschrift liest períklytos. Wir behaupten keine Textvariante — nur die Nähe im Klang und den Treffer im Sinn.' },
    { merkmal: 'Der Faden Ḥ-M-D', text: 'Aḥmad (61,6) schließt den Faden aus Siegel IV und V: derselbe „Gepriesene", nun auf Griechisch.' },
  ],
  pointe: 'Die Bedeutung trifft genau; der Klang steht nah. Mehr behaupten wir nicht — und nicht weniger.',
}

// ---- Exhibit 2: traits — Spirit or messenger? ------------------------------
export const merkmale = {
  intro:
    'Die Beschreibung des Parakleten in Johannes 14–16 — Zug um Zug. Manche Merkmale fassen einen körperlosen Geist; viele fassen eine kommende Person besser.',
  zeilen: [
    { merkmal: '„Ein anderer" Beistand', ref: 'Joh 14,16', sinn: 'allos — von Jesu eigener Art; Jesus war ein menschlicher Gesandter.' },
    { merkmal: 'Kommt erst nach Jesu Weggang', ref: 'Joh 16,7', sinn: '„Wenn ich nicht weggehe, kommt er nicht." Ein zeitlicher Nachfolger.' },
    { merkmal: 'Redet nicht aus sich selbst', ref: 'Joh 16,13', sinn: '„Was er hört, das redet er" — das Bild eines Propheten (vgl. 53,3-4).' },
    { merkmal: 'Verkündet das Kommende', ref: 'Joh 16,13', sinn: 'Er sagt Zukünftiges an — eine prophetische Funktion.' },
    { merkmal: '„Ihr werdet ihn sehen"', ref: 'Joh 14,17-19', sinn: 'Einen Geist empfängt man; eine Person sieht man.' },
    { merkmal: 'Zeugt von Jesus', ref: 'Joh 15,26', sinn: 'Er bestätigt und ehrt Jesus — wie der Koran Jesus als Messias ehrt.' },
  ],
  caveat:
    'Der stärkste Gegen-Vers steht in Johannes 14,26: dort heißt der Paraklet „der Heilige Geist". Wir wägen ihn unten ehrlich — und lesen nach gleichen Maßstäben.',
  pointe:
    'Kein einzelner Zug zwingt; in der Summe aber neigt sich die Beschreibung zu einer kommenden, redenden, bezeugten Gestalt.',
}

// ---- Exhibit 3: the sequence (Spirit already present vs Paraclete after) ----
export const abfolge = {
  intro: '„Wenn ich nicht weggehe, kommt der Paraklet nicht zu euch" (Joh 16,7). Doch der Heilige Geist war längst gegenwärtig:',
  geist: {
    label: 'Der Geist — schon gegenwärtig',
    nodes: [
      { e: 'Schwebt über den Wassern', ref: '1. Mose 1,2' },
      { e: 'Kommt über die Propheten', ref: '1. Samuel 10,10' },
      { e: 'Steigt auf Jesus herab', ref: 'Johannes 1,32' },
      { e: 'Von Jesus angehaucht', ref: 'Johannes 20,22' },
    ],
  },
  paraklet: {
    label: 'Der Paraklet — erst nach Jesu Weggang',
    text: '„Es ist gut für euch, dass ich weggehe. Denn wenn ich nicht weggehe, wird der Beistand nicht zu euch kommen."',
    ref: 'Johannes 16,7',
  },
  pointe:
    'War der Geist schon da, dann weist ein Beistand, der erst nach Jesu Weggang kommen kann, eher auf eine künftige, eigene Gestalt.',
}

export const parakletKonter: KonterItem[] = [
  {
    tier: 'stone',
    einwand: '„Johannes 14,26 sagt ausdrücklich ‚der Heilige Geist‘ — damit ist alles entschieden."',
    konter:
      'Das ist der stärkste Einwand, und wir stellen ihn offen hin. Zweierlei dazu: (1) Die Beschreibung passt schlecht zum immer schon gegenwärtigen Geist — er „hört und redet" (16,13), „kommt erst, wenn ich gehe" (16,7), „ihr werdet ihn sehen" (14,19). (2) Der Geist war längst da (1. Mose 1,2; Joh 1,32; 20,22). Wir behaupten nicht, 14,26 sei getilgt; wir lesen die Gesamtbeschreibung — und sie neigt sich zu einer kommenden Person. Ehrlich: hier ist die Last am größten.',
    belegId: 'john1426',
  },
  {
    tier: 'stone',
    einwand: '„períklytos ist Spekulation — keine Handschrift liest es so."',
    konter:
      'Stimmt — und wir sagen es selbst. Keine erhaltene griechische Handschrift hat períklytos; wir behaupten keine Textvariante. Der Punkt ist doppelt: erstens die genaue Bedeutungs-Übereinstimmung — períklytos „der Gepriesene" = Aḥmad —, zweitens die Nähe im Klang. Selbst ohne Variante bleibt: der angekündigte Name (61,6) trägt exakt den Sinn, den das griechische períklytos hätte.',
    belegId: 'periklytos',
  },
  {
    tier: 'stone',
    einwand: '„Der Paraklet kam an Pfingsten (Apostelgeschichte 2) — Sache erledigt."',
    konter:
      'Pfingsten ist das Kommen des Geistes — aber die Züge des Parakleten reichen darüber hinaus: einer, der „in alle Wahrheit leitet", „das Kommende verkündet" und „von dem ihr hört, was er hört". Und die zeitliche Aussage „nur wenn ich gehe" (16,7) bleibt erklärungsbedürftig, wenn der Geist schon vor und bei Jesus wirkte. Eine künftige, lehrende Gestalt fasst die Worte besser.',
    belegId: 'geistschon',
  },
  {
    tier: 'stone',
    einwand: '„‚Er bleibt bei euch in Ewigkeit‘ (14,16) — ein Mensch stirbt, ein Geist bleibt."',
    konter:
      'Was „in Ewigkeit bleibt", ist die Botschaft und das Prophetenamt, das mit ihm versiegelt ist — der bewahrte Koran bleibt, anders als frühere Schriften. Zudem steht direkt davor „ein ANDERER Beistand" (allos, von Jesu Art): Jesus blieb auch nicht leiblich, und doch bleibt sein Wort. „Bleiben in Ewigkeit" trifft eine fortdauernde Offenbarung, nicht zwingend einen körperlosen Geist.',
    belegId: 'anderer',
  },
  {
    tier: 'stone',
    einwand: '„Wie kann Muhammad ‚von Jesus zeugen‘ (15,26)? Der Islam leugnet die Kreuzigung."',
    konter:
      'Der Koran ehrt Jesus hoch: als Messias, Wort Gottes und Geist von ihm, jungfräulich geboren, Wundertäter — und reinigt ihn vom Vorwurf, ein Betrüger zu sein. „Von Jesus zeugen" heißt: ihn bezeugen und ehren, nicht jede kirchliche Lehre bestätigen. Genau das tut Muhammad ﷺ: er bezeugt Jesus als wahren Propheten gegen seine Verleugner.',
  },
  {
    tier: 'marble',
    einwand: '„Selbst zusammengenommen — das ist Deutung, kein zwingender Beweis."',
    konter:
      'Einverstanden, und so markieren wir es. Siegel VI ist das kühnste: ein Faden, kein eiserner Pfeiler. Sein Gewicht liegt im Verbund — der Name Aḥmad (61,6) schließt den Ḥ-M-D-Faden aus Siegel IV und V, die Beschreibung spiegelt „Prophet wie Mose" (Siegel II). Allein steht es als ernstzunehmende Lesart; verwoben ist es ein heller Strang. Nach gleichen Maßstäben gelesen — nicht mehr, nicht weniger.',
  },
]

export const parakletScholar: ScholarItem[] = [
  {
    tier: 'stone',
    h: '6.1 — paráklētos und períklytos',
    body: 'παράκλητος (LSJ): „der Herbeigerufene" — Fürsprecher, Beistand, Tröster. περικλυτός: „weithin berühmt, hochgepriesen". Die Wörter trennt im Kern die Vokalisierung. períklytos „der Gepriesene" ist die genaue Entsprechung von Aḥmad (Ḥ-M-D). Wichtig und ehrlich: keine erhaltene Handschrift liest períklytos — der Befund ist semantisch (Sinn) und phonetisch (Klang), nicht textkritisch.',
  },
  {
    tier: 'stone',
    h: '6.2 — „ein anderer" (allos) Beistand',
    body: 'Joh 14,16: állon paráklēton. Griech. allos = „ein anderer derselben Art" (gegenüber heteros, „ein andersartiger"). Da Jesus ein menschlicher Gesandter war, ist der „andere" von gleicher Art. Das spricht für eine Person wie Jesus — einen Propheten —, nicht selbstverständlich für einen körperlosen Geist.',
  },
  {
    tier: 'stone',
    h: '6.3 — „Was er hört, das redet er" (16,13)',
    body: 'Der Paraklet „redet nicht aus sich selbst, sondern was er hört" und „verkündet das Kommende". Das ist das klassische Bild des Offenbarungsempfangs — Wort für Wort die Lage von „Prophet wie Mose" (Siegel II) und des Korans über sich selbst: „er spricht nicht aus Neigung; es ist nur Offenbarung" (53,3-4).',
  },
  {
    tier: 'stone',
    h: '6.4 — Die zeitliche Abfolge (16,7)',
    body: '„Wenn ich nicht weggehe, kommt der Beistand nicht." Doch der Geist war schon gegenwärtig: Schöpfung (1. Mose 1,2), Propheten (1. Sam 10,10), Jesu Taufe (Joh 1,32), das Anhauchen der Jünger (Joh 20,22). Die Bedingung „erst nach meinem Weggang" fasst eine künftige, eigene Gestalt besser als den immer schon wirkenden Geist.',
  },
  {
    tier: 'marble',
    h: '6.5 — Johannes 14,26: der stärkste Gegen-Vers',
    body: 'Wir verschweigen ihn nicht: 14,26 nennt den Parakleten „den Heiligen Geist" (to pneûma to hágion). Das ist die schwerste Last dieses Siegels. Antwort nach gleichen Maßstäben: die identifizierende Wendung steht neben einer Beschreibung, die in mehreren Zügen auf eine Person weist; wo beide spannen, darf die Gesamtbeschreibung mitsprechen. Wir lösen die Spannung nicht einseitig auf — wir markieren sie.',
  },
  {
    tier: 'marble',
    h: '6.6 — Grenzen · gleiche Maßstäbe',
    body: 'Was Siegel VI zeigt: der angekündigte Name Aḥmad trifft den Sinn von períklytos, und die Paraklet-Beschreibung spiegelt einen kommenden Propheten. Was es nicht behauptet: einen textkritischen Beweis oder die Tilgung von 14,26. Es ist der kühnste, am offensten markierte Strang — admissibel als Lesart, gewichtig im Verbund mit dem Ḥ-M-D-Faden (Siegel IV, V).',
  },
]

export const parakletVernetzung = [
  { ziel: 'Siegel IV — Das Hohelied', text: 'Aḥmad „der Gepriesene" = períklytos: derselbe Ḥ-M-D-Faden wie maḥămaddîm — nun auf Griechisch.' },
  { ziel: 'Siegel II — Prophet wie Mose', text: '„Was er hört, das redet er" (16,13) spiegelt „meine Worte in seinen Mund" (5. Mose 18,18; Koran 53,3-4).' },
  { ziel: 'Das Fundament', text: 'Hier wird eingelöst, was das Fundament ankündigte: Aḥmad (61,6) gegen das griechische paráklētos / períklytos.' },
]

export const parakletGleicheMassstaebe =
  'Wer aus „der Heilige Geist" (14,26) sofort schließt, der Paraklet könne kein kommender Prophet sein, muss dieselbe Strenge auf die übrige Beschreibung wenden: einer, der erst nach Jesu Weggang kommt, der hört und redet, den man sieht, der das Kommende verkündet. Nach gleichen Maßstäben gelesen, spannt der Text in beide Richtungen — und der angekündigte Name Aḥmad trifft den Sinn von períklytos zu genau, um ihn beiseitezuschieben. Wir markieren die Grenze offen: ein gewichtiger Faden im Seil, kein Alleinbeweis.'
