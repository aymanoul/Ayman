import type { Beleg } from '../types'

// ---------------------------------------------------------------------------
// SIEGEL VI — Der Paraklet (SPEC §6.6). Jesus himself announces a COMING MAN —
// the Paraclete — who comes only AFTER his departure, "does not speak on his
// own" (but is divinely inspired), prophesies the FUTURE, BEARS WITNESS to
// Jesus and holds LASTING authority. That description fits not a spirit but a
// PROPHET — and it repeats, word for word, the "prophet like Moses" (Deut
// 18,18) of Siegel II. The Quran names him: Aḥmad (61,6) — and parakletos
// itself carries the phonetic echo of periklytos = "the highly praised" =
// Aḥmad. The rock-solid core is the "Paraclete problem" (the description
// bursts every spirit-reading) + the four criteria only a prophet meets; the
// periklytos↔parakletos philology is strong but led as an INDICATION (🟡).
//
// Includes: allos (same kind) + Jesus himself Paraclete (1 Joh 2,1); the four
// criteria; the three knockouts vs. Holy Spirit; the textual criticism of
// "holy" (14,26); "Holy Spirit" can mean a man (Assumption of Moses); the
// prophet-like-Moses bridge; Jesus refusing the prophet-king role; the
// parakletos/periklytos/Aḥmad linguistics (marble); Raymond Brown's scholar
// list; the church's own precedent (Origen's pupils → Paul, Mani, Augustine);
// and all eight scholarly sections 6.1–6.8.
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
  'Jesus selbst kündigt im Johannesevangelium einen kommenden Menschen an — den Parakleten —, der erst nach seinem Weggang kommt, der „nicht aus sich selbst" redet (sondern göttlich inspiriert), die Zukunft prophezeit, Zeugnis über Jesus ablegt und bleibende Autorität besitzt. Diese Beschreibung passt nicht auf einen Geist, sondern auf einen Propheten — und sie wiederholt Wort für Wort den „Propheten wie Mose" (5. Mose 18,18) aus Siegel 2. Der Koran nennt ihn beim Namen: Aḥmad (61,6) — und parakletos selbst trägt phonetisch den Anklang an periklytos = „der Hochgepriesene" = Aḥmad. Der felsenfeste Kern ist das „Paraklet-Problem" (die Beschreibung sprengt jede Geist-Deutung) und die vier Kriterien, die nur ein Prophet erfüllt; die periklytos↔parakletos-Linguistik ist stark, aber als Indiz zu führen — die Wucht ist kumulativ, wie bei Siegel 4.'

export const parakletSteps: Step[] = [
  {
    n: 'I',
    h: 'Jesus kündigt einen anderen an (Joh 14,16)',
    body: '„Ich werde den Vater bitten, und er wird euch einen anderen Beistand (parakletos) geben, der für immer bei euch bleibt." Das griechische allos heißt „ein anderer derselben Art" (nicht heteros = anderer Art). Jesus ist selbst ein Paraklet (1. Joh 2,1) — und er war ein Mensch/Prophet. Also ist der verheißene Paraklet von derselben Art wie Jesus = ein Mensch/Prophet, kein Geist.',
  },
  {
    n: 'II',
    h: 'Die vier Kriterien (was der Paraklet tut)',
    body: 'Erstens: er kommt erst nach Jesu Weggang (Joh 16,7) — Muhammad ﷺ kam sechs Jahrhunderte nach Jesus. Zweitens: er spricht nicht aus sich selbst, nur was er hört (Joh 16,13) — der Koran ist Gottes Wort, nicht Muhammads (53,2-5). Drittens: er prophezeit die Zukunft (Joh 16,13) — Koran und Hadith enthalten erfüllte Prophezeiungen. Viertens: er legt Zeugnis über Jesus ab (Joh 15,26) — der Islam bestätigt Jesus: Messias, Jungfrauengeburt, Wunder, Wiederkunft.',
  },
  {
    n: 'III',
    h: 'Warum es NICHT der Heilige Geist sein kann (3 Knockouts)',
    body: 'Erstens „ein anderer derselben Art" (allos, 14,16) → wie Jesus = Mensch; der Heilige Geist ist kein Prophet. Zweitens „Wenn ich nicht weggehe, kommt er nicht" (16,7) → der Heilige Geist war schon da (Jesus war voll des Geistes, Lk 4,1; trieb Dämonen durch ihn aus, Mt 12,28; die Jünger empfingen ihn, Joh 20,22); ein bereits Anwesender kann nicht der erst später Kommende sein. Drittens „Er wird nicht aus sich selbst reden, nur was er hört" (16,13) → ein abhängiges Wesen; wäre er Gott, könnte er aus sich selbst sprechen. Hinzu: maskuline Pronomen („er") — die einzige Stelle im NT, wo der „Geist" mit männlichen Pronomen steht.',
  },
  {
    n: 'IV',
    h: 'Es ist der „Prophet wie Mose" (Brücke zu Siegel 2)',
    body: 'Der Paraklet „spricht nur, was er hört" = 5. Mose 18,18 „Ich lege meine Worte in seinen Mund." Beide prophezeien die Zukunft korrekt (5. Mose 18,22). Da Jesus den Parakleten als separate, künftige Person ankündigt, ist Jesus selbst nicht der Prophet wie Mose — er verweist auf den, der kommt. Jesus lehnt die Rolle sogar ausdrücklich ab (Joh 6,14-15): er zieht sich zurück, als man ihn zum erwarteten Propheten/König machen will.',
  },
]

export const parakletBelege: Record<string, Beleg> = {
  // ---- Joh 14,16 — another Paraclete (allos) ----
  john1416: {
    typ: 'bibel',
    kurz: 'Ich werde den Vater bitten, und er gibt euch einen anderen Beistand — für immer.',
    original:
      'κἀγὼ ἐρωτήσω τὸν πατέρα καὶ ἄλλον παράκλητον δώσει ὑμῖν ἵνα μεθ’ ὑμῶν εἰς τὸν αἰῶνα ᾖ',
    sprache: 'grc',
    translit: 'kagṑ erōtḗsō ton patéra, kai állon paráklēton dṓsei hymîn, hína meth’ hymôn eis ton aiôna ȇ',
    uebersetzung:
      '„Und ich werde den Vater bitten, und er wird euch einen anderen Beistand (állon paráklēton) geben, dass er bei euch sei in Ewigkeit." — allos = „ein anderer derselben Art" (nicht heteros). Da Jesus selbst Paraklet ist (1. Joh 2,1) und ein Mensch war, ist der verheißene Paraklet von gleicher Art: ein Mensch/Prophet.',
    fundstelle: 'Johannes 14,16',
    status: 'allos = ein anderer derselben Art',
    kern: 'ἄλλον παράκλητον',
  },

  // ---- Joh 14,17 — the Spirit of truth, "with you" ----
  john1417: {
    typ: 'bibel',
    kurz: 'Den Geist der Wahrheit — er bleibt bei euch (frühe Hss „bei", nicht „in").',
    original:
      'τὸ πνεῦμα τῆς ἀληθείας, ὃ ὁ κόσμος οὐ δύναται λαβεῖν … ὑμεῖς γινώσκετε αὐτό, ὅτι παρ’ ὑμῖν μένει καὶ ἐν ὑμῖν ἔσται',
    sprache: 'grc',
    translit: 'to pneûma tês alētheías, ho ho kósmos ou dýnatai labeîn … hymeîs ginṓskete autó, hóti par’ hymîn ménei kaì en hymîn éstai',
    uebersetzung:
      '„… den Geist der Wahrheit, den die Welt nicht empfangen kann … ihr aber kennt ihn, denn er bleibt bei euch und wird in euch sein." Frühe Handschriften lesen „und ist bei euch" (Präsens); „in euch" meint Einheit/Gegenwart wie in Joh 17,21-23, kein körperliches Innewohnen. Ohne „heilig" (14,26) steht „der Paraklet, der Geist" — und „Geist der Wahrheit".',
    fundstelle: 'Johannes 14,17',
    kern: 'παρ’ ὑμῖν μένει',
  },

  // ---- Joh 14,26 — the Holy Spirit, the counter-verse (open!) ----
  john1426: {
    typ: 'bibel',
    kurz: 'Der Beistand aber, der Heilige Geist … wird euch alles lehren. Der Gegenvers — offen.',
    original:
      'ὁ δὲ παράκλητος, τὸ πνεῦμα τὸ ἅγιον, ὃ πέμψει ὁ πατὴρ ἐν τῷ ὀνόματί μου, ἐκεῖνος ὑμᾶς διδάξει πάντα',
    sprache: 'grc',
    translit: 'ho de paráklētos, to pneûma to hágion, ho pémpsei ho patḕr en tô onómatí mou, ekeînos hymâs didáxei pánta',
    uebersetzung:
      '„Der Beistand aber, der Heilige Geist, den der Vater senden wird in meinem Namen, der wird euch alles lehren." — Der stärkste Gegen-Vers, offen hingestellt. Drei Antworten: (1) „heilig" (to hagion) fehlt in frühen Hss (Metzger); (2) „Heiliger Geist" kann einen Menschen meinen (Himmelfahrt Moses nennt Mose so); (3) „in meinem Namen" = „an meiner Stelle" (Barrett, Goodspeed).',
    fundstelle: 'Johannes 14,26',
    status: 'Gegenvers · Textkritik „to hagion"',
    kern: 'τὸ πνεῦμα τὸ ἅγιον',
  },

  // ---- Joh 15,26 — he will testify of me ----
  john1526: {
    typ: 'bibel',
    kurz: 'Wenn der Beistand kommt, den ich vom Vater senden werde — der wird von mir zeugen.',
    original:
      'ὅταν ἔλθῃ ὁ παράκλητος ὃν ἐγὼ πέμψω ὑμῖν παρὰ τοῦ πατρός, τὸ πνεῦμα τῆς ἀληθείας … ἐκεῖνος μαρτυρήσει περὶ ἐμοῦ',
    sprache: 'grc',
    translit: 'hótan élthē ho paráklētos hon egṑ pémpsō hymîn parà toû patrós, to pneûma tês alētheías … ekeînos martyrḗsei perì emoû',
    uebersetzung:
      '„Wenn aber der Beistand kommt, den ich euch vom Vater senden werde, der Geist der Wahrheit … der wird von mir zeugen." — Das vierte Kriterium: er bestätigt und ehrt Jesus. Genau das tut der Islam: Jesus als Messias, jungfräulich geboren, Wundertäter, Wiederkehrender — gereinigt vom Vorwurf des Betrugs.',
    fundstelle: 'Johannes 15,26',
    kern: 'μαρτυρήσει περὶ ἐμοῦ',
  },

  // ---- Joh 16,7 — if I do not go, he will not come ----
  john167: {
    typ: 'bibel',
    kurz: 'Wenn ich nicht weggehe, kommt der Beistand nicht zu euch.',
    original:
      'συμφέρει ὑμῖν ἵνα ἐγὼ ἀπέλθω. ἐὰν γὰρ μὴ ἀπέλθω, ὁ παράκλητος οὐκ ἐλεύσεται πρὸς ὑμᾶς· ἐὰν δὲ πορευθῶ, πέμψω αὐτὸν πρὸς ὑμᾶς',
    sprache: 'grc',
    translit: 'sympférei hymîn hína egṑ apélthō. eàn gàr mḕ apélthō, ho paráklētos ouk eleúsetai pròs hymâs; eàn dè poreuthô, pémpsō autòn pròs hymâs',
    uebersetzung:
      '„Es ist gut für euch, dass ich weggehe. Denn wenn ich nicht weggehe, wird der Beistand nicht zu euch kommen; wenn ich aber gehe, werde ich ihn zu euch senden." — Der zweite Knockout: der Heilige Geist war längst da (Lk 4,1; Mt 12,28; Joh 20,22). Ein bereits Anwesender kann nicht der erst nach Jesu Weggang Kommende sein.',
    fundstelle: 'Johannes 16,7',
    kern: 'ἐὰν μὴ ἀπέλθω',
  },

  // ---- Joh 16,13 — he speaks what he hears, declares the future ----
  john1613: {
    typ: 'bibel',
    kurz: 'Er wird nicht aus sich selbst reden, sondern was er hört — und das Kommende verkünden.',
    original:
      'ὅταν δὲ ἔλθῃ ἐκεῖνος, τὸ πνεῦμα τῆς ἀληθείας, ὁδηγήσει ὑμᾶς ἐν τῇ ἀληθείᾳ πάσῃ· οὐ γὰρ λαλήσει ἀφ’ ἑαυτοῦ, ἀλλ’ ὅσα ἀκούσει λαλήσει, καὶ τὰ ἐρχόμενα ἀναγγελεῖ ὑμῖν',
    sprache: 'grc',
    translit:
      'hótan dè élthē ekeînos, to pneûma tês alētheías, hodēgḗsei hymâs en tê alētheíā pásē; ou gàr lalḗsei aph’ heautoû, all’ hósa akoúsei lalḗsei, kaì tà erchómena anangeleî hymîn',
    uebersetzung:
      '„Wenn aber jener kommt, der Geist der Wahrheit, wird er euch in die ganze Wahrheit leiten; denn er wird nicht aus sich selbst reden, sondern was er hört, das wird er reden, und das Kommende wird er euch verkünden." — Abhängigkeit (dritter Knockout) UND das Bild des Propheten wie Mose: „meine Worte in seinen Mund" (5. Mose 18,18); „er spricht nicht aus Neigung; es ist nur Offenbarung" (53,3-4).',
    fundstelle: 'Johannes 16,13',
    kern: 'ὅσα ἀκούσει λαλήσει',
  },

  // ---- Joh 16,15 — all the Father has is mine (later insertion) ----
  john1615: {
    typ: 'bibel',
    kurz: '„Alles, was der Vater hat, ist mein" — fehlt in Papyrus 66, spätere Einfügung.',
    original: 'πάντα ὅσα ἔχει ὁ πατὴρ ἐμά ἐστιν· διὰ τοῦτο εἶπον ὅτι ἐκ τοῦ ἐμοῦ λαμβάνει καὶ ἀναγγελεῖ ὑμῖν',
    sprache: 'grc',
    translit: 'pánta hósa échei ho patḕr emá estin; dià toûto eîpon hóti ek toû emoû lambánei kaì anangeleî hymîn',
    uebersetzung:
      '„Alles, was der Vater hat, ist mein; darum sagte ich, dass er von dem Meinen nimmt und es euch verkünden wird." — Der Einwand „Jesus spricht hier wie Gott" greift nicht: der Vers fehlt in vielen frühen Handschriften, inkl. Papyrus 66 (ältester fast vollständiger Johannes-Codex) = spätere Einfügung. Selbst wenn echt: es geht um Offenbarungs-Mitteilung, nicht Trinität (Brown).',
    fundstelle: 'Johannes 16,15',
    status: 'fehlt in Papyrus 66',
    kern: 'πάντα ... ἐμά ἐστιν',
  },

  // ---- Sure 53,2-5 — he speaks only revelation ----
  q5325: {
    typ: 'quran',
    kurz: 'Euer Gefährte irrt nicht, noch spricht er aus eigener Neigung — es ist nur Offenbarung.',
    original:
      'مَا ضَلَّ صَاحِبُكُمْ وَمَا غَوَىٰ ۝ وَمَا يَنطِقُ عَنِ الْهَوَىٰ ۝ إِنْ هُوَ إِلَّا وَحْيٌ يُوحَىٰ ۝ عَلَّمَهُ شَدِيدُ الْقُوَىٰ',
    sprache: 'ar',
    translit: 'mā ḍalla ṣāḥibukum wa-mā ghawā · wa-mā yanṭiqu ʿani l-hawā · in huwa illā waḥyun yūḥā · ʿallamahu shadīdu l-quwā',
    uebersetzung:
      '„Euer Gefährte irrt nicht und ist nicht im Wahn, und er spricht nicht aus eigener Neigung. Es ist nichts anderes als eine Offenbarung, die (ihm) eingegeben wird; gelehrt hat sie ihn der mit gewaltigen Kräften (Gabriel)." — Genau „was er hört, das redet er" (Joh 16,13). Das Profil des Parakleten und des „Propheten wie Mose".',
    fundstelle: 'Sure 53 (an-Najm), Verse 2–5',
    kern: 'وَحْيٌ يُوحَىٰ',
  },

  // ---- Sure 61,6 — Jesus announces Ahmad ----
  q616: {
    typ: 'quran',
    kurz: 'Jesus: ein Gesandter wird nach mir kommen, dessen Name Aḥmad ist.',
    original: 'وَمُبَشِّرًا بِرَسُولٍ يَأْتِي مِن بَعْدِي اسْمُهُ أَحْمَدُ',
    sprache: 'ar',
    translit: 'wa-mubashshiran bi-rasūlin yaʾtī min baʿdī smuhu Aḥmad',
    uebersetzung:
      '„… und als Verkünder eines Gesandten, der nach mir kommen wird, dessen Name Aḥmad ist." (Jesus, Sohn der Maria, spricht) — Aḥmad: „der Höchstgepriesene" (afʿal-Form der Wurzel Ḥ-M-D) = griech. periklytos. Der Koran nennt den Parakleten beim Namen.',
    fundstelle: 'Sure 61 (aṣ-Ṣaff), Vers 6',
    kern: 'أَحْمَدُ',
  },

  // ---- Sure 16,102 — the Holy Spirit brought it down ----
  q16102: {
    typ: 'quran',
    kurz: 'Der Heilige Geist (Gabriel) hat die Offenbarung von deinem Herrn herabgebracht.',
    original: 'قُلْ نَزَّلَهُ رُوحُ الْقُدُسِ مِن رَّبِّكَ بِالْحَقِّ لِيُثَبِّتَ الَّذِينَ آمَنُوا',
    sprache: 'ar',
    translit: 'qul nazzalahu rūḥu l-qudusi min rabbika bi-l-ḥaqqi li-yuthabbita lladhīna āmanū',
    uebersetzung:
      '„Sprich: Der Heilige Geist (rūḥ al-qudus, Gabriel) hat sie von deinem Herrn mit der Wahrheit herabgebracht, um die Gläubigen zu festigen." — Manche deuten den Heiligen Geist als „Geist der Prophetie", der künftige Propheten inspiriert. Auch dann passt jede Lesart von „Heiliger Geist" auf Muhammad ﷺ: der Geist brachte ihm die Offenbarung herab.',
    fundstelle: 'Sure 16 (an-Naḥl), Vers 102',
    kern: 'رُوحُ الْقُدُسِ',
  },

  // ---- Source: Raymond Brown — leading Johannine authority ----
  raymondBrown: {
    typ: 'quelle',
    kurz: 'Raymond Brown listet Gelehrte: der Paraklet war ursprünglich eine eigenständige menschliche Gestalt.',
    uebersetzung:
      'Raymond E. Brown, die führende Johannes-Autorität, hält fest, dass keine einzige Übersetzung die Komplexität der Paraklet-Funktionen erfasst, und listet Gelehrte (Spitta, Delafosse, Windisch, Sasse, Bultmann, Betz), die zeigen: der Paraklet war ursprünglich eine eigenständige menschliche Heilsgestalt, erst später mit dem Heiligen Geist verschmolzen. Zu Joh 14,26: es ist die einzige Stelle in Johannes mit der vollen Form „Heiliger Geist"; selbst Befürworter vermuten, dass „heilig" erst in der johanneischen Redaktion eingefügt wurde.',
    fundstelle: 'R. E. Brown, The Gospel According to John (xiii–xxi, Appendix V; S. 650, 709, 594)',
  },

  // ---- Source: Bruce Metzger — text criticism of "holy" ----
  metzger: {
    typ: 'quelle',
    kurz: 'Metzger: Schreiber fügten „heilig" gewohnheitsmäßig hinzu — eine Tilgung wäre unerklärlich.',
    uebersetzung:
      'Bruce M. Metzger (Textual Commentary on the Greek New Testament, S. 218) erklärt zu Joh 14,26: Schreiber fügten „heilig" zu „Geist" gewohnheitsmäßig hinzu; eine nachträgliche Tilgung wäre dagegen unerklärlich. Daher hatte das Original „heilig" (to hagion) vermutlich nicht. George Johnston (Spirit-Paraclete, S. 31) plädiert ebenfalls für die Streichung (folgend dem Sinai-Syrer), weil dies die Varianten am besten erklärt. Ohne „heilig" bleibt nur „der Paraklet, der Geist" — im Einklang mit „Geist der Wahrheit" (14,17). Ehrlich: eine respektable Minderheits-/Varianten-Frage, nicht der Konsens aller Textkritiker.',
    fundstelle: 'Metzger, Textual Commentary S. 218 · Johnston, Spirit-Paraclete S. 31',
  },

  // ---- Source: Glenn Nielsen — the Paraclete problem ----
  nielsen: {
    typ: 'quelle',
    kurz: 'Nielsen: sichtbare Lücke zwischen Titel und Funktion — „ein Busfahrer, der euch operiert".',
    uebersetzung:
      'Glenn Nielsen benennt das „Paraklet-Problem": eine sichtbare Lücke zwischen dem Titel parakletos („Beistand") und den Funktionen, die Jesus dem Parakleten gibt (Lehrer, Zeuge, Überführer, Zukunftskünder). Vorschläge — Comforter, Advocate, Intercessor, Convincer, Strengthener, Helper, Friend — fanden keine breite Zustimmung. Es ist, als sage man: „Ich schicke euch einen Busfahrer, der euch operiert" — der Berufstitel passt nicht zur Funktion. Lösung: parakletos ist kein Funktionstitel, sondern ein Name.',
    fundstelle: 'Glenn Nielsen · vgl. Gary Burge, John (NIVAC) S. 398',
  },

  // ---- Source: periklytos etymology ----
  periklytos: {
    typ: 'quelle',
    kurz: 'para („mehr als") + kletos („gepriesen") = periklytos „der über die Maßen Gepriesene" = Aḥmad.',
    uebersetzung:
      'parakletos = para + kletos. para heißt (Strong/Thayer/Liddell-Scott-Jones) nicht nur „neben", sondern „mehr als / über die Maßen / im Übermaß" — und behält das auch im Kompositum. kletos (von kaleo, verwandt mit kleo „rühmen", vgl. Hesychius-Lexikon) = „gerufen/gepriesen". → „der über die Maßen Gepriesene" = griech. periklytos = arab. Aḥmad (afʿal-Form, „der Höchstgepriesene"; vgl. al-Rāzī, Ibn ʿĀshūr). Wahrscheinlich stieß der Autor auf das semitische Aḥmad aus Jesu Sprache und gab es griechisch wieder. Ehrlich: keine erhaltene Handschrift liest periklytos — geführt als Indiz/Vorausschattung, nicht als Textvariante.',
    fundstelle: 'Liddell-Scott-Jones · Thayer · Strong (para, kletos) · Hesychius · al-Rāzī / Ibn ʿĀshūr',
  },

  // ---- Source: Assumption of Moses — "Holy Spirit" = a man ----
  himmelfahrtMoses: {
    typ: 'quelle',
    kurz: 'Himmelfahrt Moses nennt MOSE „den heiligen Geist" — gestützt durch Judas 1,9.',
    uebersetzung:
      'Die Himmelfahrt Moses (jüd. apokryph, 1. Jh.) nennt Mose „den heiligen Geist … Gottes obersten Propheten, den vollkommensten Lehrer" (11,9-11). „Heiliger Geist" kann also einen Menschen meinen. Und das Werk ist kein wertloser Text: Kirchenväter (Clemens v. Alex., Origenes) bezeugen, dass Judas 1,9 daraus zitiert. Hinzu: „Geist" bezeichnet im NT auch menschliche Propheten (1. Joh 4,1 „prüft die Geister"; 1. Kor 14,32 „die Geister der Propheten"). Ehrlich: ein sekundäres, stützendes Argument.',
    fundstelle: 'Himmelfahrt Moses 11,9-11 · Judas 1,9 · 1. Joh 4,1 · 1. Kor 14,32',
  },

  // ---- Source: the church's own precedent ----
  kirchenPraezedenz: {
    typ: 'quelle',
    kurz: 'Origenes’ Schüler hielten Paulus für den Parakleten; Mani beanspruchte den Titel.',
    uebersetzung:
      'Die Deutung „Paraklet = Mensch" ist keine muslimische Erfindung — die Kirche selbst kannte sie: Schüler des Origenes hielten Paulus für den verheißenen Parakleten (koppelt an das Paulus-Dossier der Verteidigung); Mani beanspruchte im 3. Jh. den Titel für sich; Augustinus berichtet von solchen Ansprüchen. Wer den Parakleten als kommenden Menschen liest, steht also in einer alten, innerchristlichen Tradition.',
    fundstelle: 'Origenes (Schüler) · Mani · Augustinus (Bericht)',
  },

  // ---- Source: "in my name" = "in my place" ----
  anMeinerStelle: {
    typ: 'quelle',
    kurz: '„in meinem Namen" (14,26) = „an meiner Stelle" — Barrett, Goodspeed; vgl. Mk 13,6.',
    uebersetzung:
      'Der Einwand „‚in meinem Namen‘ gesandt — also von Jesus, nicht von Gott" greift nicht. „in meinem Namen" bedeutet „an meiner Stelle" (C. K. Barrett, S. 467; Goodspeed-NT übersetzt: „den der Vater an meiner Stelle senden wird"). Mk 13,6: falsche Propheten kommen „in meinem Namen" = an seiner Stelle. Und 14,16 sagt klar: Gott sendet ihn. → harmoniert mit dem Islam: Muhammad ﷺ wurde nach Jesus gesandt.',
    fundstelle: 'C. K. Barrett, John S. 467 · Goodspeed-NT · vgl. Markus 13,6',
  },

  // ---- Source: masculine pronouns — Burke & Warrington ----
  maskulinePronomen: {
    typ: 'quelle',
    kurz: 'Burke & Warrington: die einzige NT-Stelle, wo der „Geist" mit maskulinen Pronomen steht.',
    uebersetzung:
      'Im Griechischen ist pneuma („Geist") grammatisch Neutrum; üblicherweise stehen dazu sächliche Pronomen. In den Paraklet-Sprüchen aber steht ekeinos („jener", maskulin) — Burke & Warrington (S. 245-246) heben hervor: es ist die einzige Stelle im NT, an der der „Geist" mit männlichen Pronomen verbunden wird. Ein grammatischer Fingerzeig auf einen männlichen Menschen, nicht einen körperlosen Geist.',
    fundstelle: 'Burke & Warrington, S. 245-246',
  },
}

// ---------------------------------------------------------------------------
// EXHIBIT DATA
// ---------------------------------------------------------------------------

// ---- Exhibit 1 (HAUPT): the four-criteria matrix + struck-through Spirit ----
export const kriterienMatrix = {
  intro:
    'Das didaktische Zentrum: links Jesu Worte (Johannes-Verse), rechts die Erfüllung durch Muhammad ﷺ — vier Kriterien, je mit Häkchen. Darunter, rot durchgestrichen, „der Heilige Geist" mit den drei Knockout-Gründen.',
  spalten: ['Jesu Worte (Joh)', 'Erfüllung durch Muhammad ﷺ'],
  zeilen: [
    {
      wort: 'Kommt erst nach Jesu Weggang',
      ref: 'Joh 16,7',
      erfuellung: 'Muhammad ﷺ kam sechs Jahrhunderte nach Jesus.',
    },
    {
      wort: 'Spricht nicht aus sich selbst, nur was er hört',
      ref: 'Joh 16,13',
      erfuellung: 'Der Koran ist Gottes Wort, nicht Muhammads (53,2-5).',
    },
    {
      wort: 'Prophezeit die Zukunft',
      ref: 'Joh 16,13',
      erfuellung: 'Koran und Hadith enthalten erfüllte Prophezeiungen.',
    },
    {
      wort: 'Legt Zeugnis über Jesus ab',
      ref: 'Joh 15,26',
      erfuellung: 'Der Islam bestätigt Jesus: Messias, Jungfrauengeburt, Wunder, Wiederkunft.',
    },
  ],
  durchgestrichen: 'der Heilige Geist',
  knockouts: [
    {
      h: '„ein anderer derselben Art" (allos, 14,16)',
      t: 'wie Jesus = Mensch. Der Heilige Geist ist kein Prophet.',
    },
    {
      h: '„Wenn ich nicht weggehe, kommt er nicht" (16,7)',
      t: 'der Geist war schon da: Jesus voll des Geistes (Lk 4,1), Dämonen durch ihn (Mt 12,28), die Jünger empfingen ihn (Joh 20,22).',
    },
    {
      h: '„Nicht aus sich selbst … nur was er hört" (16,13)',
      t: 'ein abhängiges Wesen; dazu maskuline Pronomen — die einzige NT-Stelle, wo der „Geist" männlich steht.',
    },
  ],
  pointe:
    'Vier Kriterien — alle erfüllt von einem Menschen. Der „Heilige Geist" scheitert an dreien. Die Beschreibung zeigt auf einen Propheten.',
}

// ---- Exhibit 2: periklytos root graphic ----
export const periklytosGrafik = {
  intro:
    'παράκλητος → para („mehr als / über die Maßen") + kletos („gepriesen") → περικλυτός periklytos → أحمد Aḥmad. Sinn für Sinn derselbe Name.',
  start: { wort: 'παράκλητος', trans: 'paráklētos', sinn: '„Beistand · Fürsprecher · Tröster"' },
  teile: [
    { gr: 'παρά', trans: 'para', sinn: '„mehr als / über die Maßen" (Strong/Thayer/LSJ)' },
    { gr: 'κλητός', trans: 'kletos', sinn: '„gerufen / gepriesen" (von kaleo, vgl. kleo „rühmen")' },
  ],
  ziel: { gr: 'περικλυτός', trans: 'periklytos', sinn: '„der über die Maßen Gepriesene · Hochberühmte"' },
  arabisch: { ar: 'أَحْمَد', trans: 'Aḥmad', sinn: '„der Höchstgepriesene" (afʿal-Form, Wurzel Ḥ-M-D)' },
  verweise: [
    { ziel: '→ Siegel 4', text: 'ḤMD = maḥamaddim (Hld 5,16): derselbe „Gepriesene", nun auf Griechisch.' },
    { ziel: '→ Fundament', text: 'Koran 61,6 nennt den Namen Aḥmad — hier der griechische Beleg.' },
  ],
  pointe:
    'Die Bedeutung trifft genau; der Klang steht nah. Geführt als Indiz/Vorausschattung — nicht als Textvariante (keine Handschrift liest periklytos).',
}

// ---- Exhibit 3: text-criticism panel "holy" (Joh 14,26) ----
export const textkritik = {
  intro:
    'Joh 14,26 ist die einzige Stelle in Johannes mit der vollen Form „Heiliger Geist". Frühe Zeugen und führende Textkritiker stellen das „heilig" infrage.',
  varianten: [
    {
      lesart: '„der Paraklet, der Heilige Geist"',
      typ: 'Mehrheitstext',
      note: 'die vertraute, harmonisierte Form — to pneûma to hágion.',
      hl: false,
    },
    {
      lesart: '„der Paraklet, der Geist [der Wahrheit]"',
      typ: 'frühe Zeugen',
      note: 'ohne „heilig"; im Einklang mit „Geist der Wahrheit" (14,17). Sinai-Syrer.',
      hl: true,
    },
  ],
  zeugen: [
    { name: 'Bruce Metzger', sinn: 'Hinzufügung gewohnheitsmäßig; Tilgung unerklärlich.' },
    { name: 'Raymond Brown', sinn: 'einzige Stelle mit voller Form; „heilig" wohl Redaktion.' },
    { name: 'Gary Burge', sinn: 'manche Hss lassen „heilig" weg / lesen „Geist der Wahrheit".' },
    { name: 'George Johnston', sinn: '„heilig" zu streichen (folgt dem Sinai-Syrer).' },
    { name: 'Sinai-Syrer', sinn: 'altsyrischer Zeuge ohne „heilig".' },
  ],
  pointe:
    'Ehrlich geführt: kein Konsens aller Textkritiker, sondern eine respektable Minderheits-/Varianten-Frage. Ohne „heilig" steht nur „der Paraklet, der Geist".',
}

// ---- Exhibit 4: Raymond Brown's list of six scholars ----
export const brownListe = {
  intro:
    'Selbst christliche Wissenschaftler: Raymond Brown listet sechs Gelehrte, die zeigen, dass der Paraklet ursprünglich eine eigenständige menschliche Heilsgestalt war — erst später mit dem Heiligen Geist verschmolzen.',
  gelehrte: [
    { name: 'Spitta', sinn: 'Paraklet als eigenständige Gestalt.' },
    { name: 'Delafosse', sinn: 'ursprünglich nicht der Heilige Geist.' },
    { name: 'Windisch', sinn: 'eigene Quelle vom Geist-Material getrennt.' },
    { name: 'Sasse', sinn: 'der Paraklet als personale Größe.' },
    { name: 'Bultmann', sinn: 'aus vorchristlicher Erlöser-Vorstellung.' },
    { name: 'Betz', sinn: 'eigenständige Heilsgestalt im Hintergrund.' },
  ],
  pointe:
    'Die Liste stammt von Brown, der führenden Johannes-Autorität — nicht aus muslimischer Apologetik. „Paraklet = Mensch" ist innerchristlich diskutiert.',
}

// ---- Exhibit 5: the "bus-driver-who-operates" illustration ----
export const busfahrer = {
  titel: 'Das Paraklet-Problem, einprägsam',
  links: { rolle: 'Der Titel', wort: 'Busfahrer', sinn: 'parakletos = „Beistand · Tröster"' },
  rechts: { rolle: 'Die Funktion', wort: 'operiert', sinn: 'Lehrer · Zeuge · Überführer · Zukunftskünder' },
  erklaerung:
    '„Ich schicke euch einen Busfahrer, der euch operiert." Der Berufstitel passt nicht zur Funktion. Genauso deckt parakletos („Beistand") die Aufgaben nicht ab, die Jesus dem Parakleten gibt. Glenn Nielsen: keine Übersetzung fand breite Zustimmung.',
  pointe: 'Lösung: parakletos ist kein Funktionstitel — sondern ein Name.',
}

// ---- Exhibit 6: Deut-18,18 bridge (Joh 16,13 ↔ Deut 18,18) ----
export const deutBruecke = {
  intro:
    'Das Paraklet-Profil (Joh 16,7-13) spiegelt den „Propheten wie Mose" (5. Mose 18,18) Wort für Wort — die Brücke zu Siegel 2.',
  spalten: ['Der Paraklet (Joh)', 'Prophet wie Mose (5. Mose)'],
  zeilen: [
    {
      a: '„spricht nicht aus sich selbst, nur was er hört" (16,13)',
      b: '„Ich lege meine Worte in seinen Mund" (18,18)',
    },
    {
      a: '„das Kommende wird er verkünden" (16,13)',
      b: 'prophezeit die Zukunft korrekt (18,22)',
    },
    {
      a: 'kommt erst nach Jesu Weggang (16,7)',
      b: 'eine künftige, separate Person',
    },
    {
      a: 'der Koran bestätigt das Profil (53,2-5)',
      b: '„er spricht nicht aus Neigung; es ist nur Offenbarung"',
    },
  ],
  pointe:
    'Da Jesus den Parakleten als kommende, separate Person ankündigt, ist Jesus selbst nicht der Prophet wie Mose — er verweist auf den, der kommt.',
}

// ---- Exhibit 7: church-precedent panel ----
export const kirchenPanel = {
  intro:
    'Die Kirche selbst hielt den Parakleten zeitweise für einen Menschen — „Paraklet = Mensch" ist keine muslimische Erfindung.',
  faelle: [
    { wer: 'Origenes’ Schüler', anspruch: 'hielten Paulus für den verheißenen Parakleten.', note: 'koppelt an das Paulus-Dossier (Verteidigung).' },
    { wer: 'Mani (3. Jh.)', anspruch: 'beanspruchte den Titel des Parakleten für sich.', note: 'eine eigene, menschliche Heilsgestalt.' },
    { wer: 'Augustinus', anspruch: 'berichtet von solchen Paraklet-Ansprüchen.', note: 'kirchliche Bezeugung der Deutung.' },
  ],
  pointe:
    'Wer den Parakleten als kommenden Menschen liest, steht in einer alten, innerchristlichen Tradition — nicht außerhalb der Kirche.',
}

export const parakletKonter: KonterItem[] = [
  {
    tier: 'stone',
    einwand: '„Joh 14,26 sagt doch ausdrücklich: ‚der Heilige Geist‘."',
    konter:
      'Drei Probleme. (1) Textkritik: „heilig" (to hagion) fehlt in frühen Handschriften; Metzger: Schreiber fügten „heilig" gewohnheitsmäßig hinzu, eine Tilgung wäre unerklärlich. Ohne „heilig" steht nur „der Paraklet, der Geist" — harmoniert mit „Geist der Wahrheit" (14,17). (2) Selbst mit „Heiliger Geist": das Wort kann einen Menschen meinen — die Himmelfahrt Moses nennt Mose „den heiligen Geist". (3) „Geist" bezeichnet im NT auch menschliche Propheten (1. Joh 4,1; 1. Kor 14,32).',
    belegId: 'metzger',
  },
  {
    tier: 'stone',
    einwand: '„Der Paraklet ist ein Geist, kein Mensch."',
    konter:
      'Raymond Brown (führende Johannes-Autorität) listet Gelehrte — Spitta, Delafosse, Windisch, Sasse, Bultmann, Betz —, die zeigen: der Paraklet war ursprünglich eine eigenständige menschliche Heilsgestalt, erst später mit dem Heiligen Geist verwechselt. Und die Kirche selbst: Origenes’ Schüler hielten Paulus für den Parakleten, Mani beanspruchte den Titel. → „Paraklet = Mensch" ist keine muslimische Erfindung.',
    belegId: 'raymondBrown',
  },
  {
    tier: 'stone',
    einwand: '„‚Beistand/Tröster‘ passt nicht zu einem Propheten."',
    konter:
      'Genau — das ist das „Paraklet-Problem" der Wissenschaft. Jesus gibt dem Parakleten Aufgaben (Lehrer, Zeuge, Überführer, Zukunftskünder), die parakletos („Beistand") nicht abdeckt. Glenn Nielsen: sichtbare Lücke zwischen Titel und Funktion; keine Übersetzung fand breite Zustimmung. Es ist, als sage man „Ich schicke euch einen Busfahrer, der euch operiert" — der Titel passt nicht zur Funktion. → Lösung: parakletos ist kein Titel, sondern ein Name.',
    belegId: 'nielsen',
  },
  {
    tier: 'stone',
    einwand: '„Wieso soll der Name Aḥmad drinstecken?"',
    konter:
      'parakletos = para + kletos. para heißt nicht nur „neben", sondern (Strong/Thayer/Liddell-Scott) „mehr als / im Übermaß"; kletos (von kaleo/kleo) = „gerufen/gepriesen". → „der über die Maßen Gepriesene" = griech. periklytos = arab. Aḥmad („der Höchstgepriesene"). Wahrscheinlich stieß der Autor auf das semitische Aḥmad und gab es griechisch wieder. Ehrlich: keine Handschrift liest periklytos — als Indiz geführt, nicht als Textvariante.',
    belegId: 'periklytos',
  },
  {
    tier: 'stone',
    einwand: '„Joh 14,26: ‚in meinem Namen‘ gesandt — also von Jesus, nicht von Gott."',
    konter:
      '„in meinem Namen" = „an meiner Stelle" (C. K. Barrett; Goodspeed-NT: „den der Vater an meiner Stelle senden wird"). Mk 13,6: falsche Propheten kommen „in meinem Namen" = an seiner Stelle. Und 14,16 sagt klar: Gott sendet ihn. → harmoniert mit dem Islam (Muhammad ﷺ nach Jesus gesandt).',
    belegId: 'anMeinerStelle',
  },
  {
    tier: 'stone',
    einwand: '„Der Paraklet ‚wohnt in euch‘ (14,17) — also ein Geist."',
    konter:
      'Frühe Handschriften lesen „und ist bei euch" (Präsens), nicht „in euch" (NIV-Fußnote). Und „in euch" meint Einheit/Gegenwart wie in Joh 17,21-23 („dass sie eins seien, wie wir eins sind") — kein körperliches Innewohnen.',
    belegId: 'john1417',
  },
  {
    tier: 'stone',
    einwand: '„Joh 16,15: ‚Alles, was der Vater hat, ist mein‘ — Jesus spricht wie Gott."',
    konter:
      'Fehlt in vielen frühen Handschriften (inkl. Papyrus 66, ältester fast vollständiger Johannes-Codex) = spätere Einfügung. Selbst wenn echt: Brown — es geht um Offenbarungs-Mitteilung, nicht Trinität („alles, was der Vater sagt, sage auch ich" — God’s Word Translation).',
    belegId: 'john1615',
  },
  {
    tier: 'stone',
    einwand: '„Der Paraklet kam zu Pfingsten zu den Jüngern, nicht 600 Jahre später."',
    konter:
      'Christen deuten Jesu „dieses Geschlecht" (Mt 24,34) selbst als „künftige, unbestimmte Generation" um. Dann sollen sie fair sein und dieselbe zeitliche Offenheit dem Parakleten zugestehen. Doppelmoral, wenn man das eine großzügig und das andere eng liest.',
  },
]

export const parakletScholar: ScholarItem[] = [
  {
    tier: 'stone',
    h: '6.1 — Das „Paraklet-Problem" (der wissenschaftliche Kern)',
    body: 'Jesus zeichnet einen multifunktionalen Lehrer-Propheten: er spricht Gottes inspirierte Worte, prophezeit die Zukunft, lehrt über Jesus, repräsentiert Gottes letzte Autorität. Das sprengt die Bedeutung von parakletos („Beistand/Anwalt/Tröster"). Zeugen: Glenn Nielsen (sichtbare Lücke zwischen Titel und Funktion; Comforter, Advocate, Intercessor, Convincer, Strengthener, Helper, Friend — keiner fand breite Zustimmung); Raymond Brown (keine Übersetzung erfasst die Komplexität); George Ladd (primär Lehrer, nicht Anwalt); Gary Burge (Etymologie und Bedeutung = „verblüffendes Problem"); „The Anointed Community" („schwer zu klärendes Problem"). Analogie: „ein Busfahrer, der euch operiert". Lösung: parakletos ist ein Name, kein Funktionstitel.',
  },
  {
    tier: 'stone',
    h: '6.2 — allos: „ein anderer derselben Art"',
    body: 'Joh 14,16: állon paráklēton. Griech. allos (≠ heteros „andersartig") = „ein anderer derselben Art". Da Jesus selbst Paraklet ist (1. Joh 2,1) und ein Mensch war, muss der verheißene Paraklet ebenfalls ein Mensch/Prophet sein. Der „Beistand" wird mit Jesus in eine Reihe gestellt — also auf einen anderen Propheten anwendbar.',
  },
  {
    tier: 'stone',
    h: '6.3 — Die vier Knockouts gegen „Heiliger Geist"',
    body: 'Erstens allos (s. o.) → Mensch, nicht Geist. Zweitens die Bedingung des Weggangs (16,7): „Wenn ich nicht weggehe, kommt er nicht" — aber der Heilige Geist war schon präsent: Jesus „voll Heiligen Geistes" (Lk 4,1), trieb Dämonen durch ihn aus (Mt 12,28), die Jünger empfingen ihn vor Jesu Weggang (Joh 20,22). Drittens Abhängigkeit (16,13): „spricht nicht aus sich selbst, nur was er hört" — ein eingeschränktes Wesen; Gott (per christl. Theologie allmächtig) wäre nicht eingeschränkt. Viertens maskuline Pronomen: die einzige NT-Stelle, wo der „Geist" mit männlichen Pronomen steht (Burke & Warrington) → Hinweis auf einen männlichen Menschen.',
  },
  {
    tier: 'stone',
    h: '6.4 — Die Textkritik des „Heiligen" (Joh 14,26)',
    body: 'Raymond Brown: 14,26 ist die einzige Stelle in Johannes mit der vollen Form „Heiliger Geist" — selbst Befürworter vermuten, dass „heilig" erst in der johanneischen Redaktion eingefügt wurde. Gary Burge: einige Handschriften lassen „heilig" weg, andere lesen „Geist der Wahrheit" (harmonisierend mit 14,17). Bruce Metzger: Schreiber fügten „heilig" gewohnheitsmäßig hinzu; eine Tilgung wäre unerklärlich → das Original hatte es vermutlich nicht. George Johnston: „heilig" ist zu streichen (folgend dem Sinai-Syrer). Ohne „heilig" bleibt „der Paraklet, der Geist" → und „Geist" meint im NT auch menschliche Propheten (1. Joh 4,1; 1. Kor 14,32).',
  },
  {
    tier: 'stone',
    h: '6.6 — Der Paraklet = der Prophet wie Mose (Vernetzung mit Siegel 2)',
    body: 'Joh 16,7-13 spiegelt 5. Mose 18,18 Wort für Wort: „spricht nur, was er hört" ↔ „ich lege meine Worte in seinen Mund"; „verkündet, was kommt" ↔ „prophezeit die Zukunft" (5. Mose 18,22). Der Koran bestätigt das Profil: „Euer Gefährte irrt nicht … noch spricht er aus eigener Neigung. Es ist nur Offenbarung" (53,2-5). Da Jesus den Parakleten als kommende, separate Person ankündigt, ist Jesus nicht der Prophet wie Mose.',
  },
  {
    tier: 'stone',
    h: '6.7 — Jesus lehnt es ab, dieser Prophet zu sein (Joh 6,14-15)',
    body: 'Nach dem Brotwunder sagen die Leute: „Das ist wirklich der Prophet, der in die Welt kommen soll" — und wollen ihn zum König machen. Jesus zieht sich zurück (6,15). Er weist die Rolle des erwarteten Propheten/irdischen Herrschers bewusst von sich. Ergänzend: Mt 15,24 „Ich bin nur gesandt zu den verlorenen Schafen Israels" — Jesu Mission ist begrenzt; der Paraklet dagegen universal.',
  },
  {
    tier: 'marble',
    h: '6.5 — Selbst „Heiliger Geist" kann einen Menschen meinen',
    body: 'Die Himmelfahrt Moses (jüd. apokryph, 1. Jh.) nennt Mose „den heiligen Geist … Gottes obersten Propheten, den vollkommensten Lehrer". Und: Kirchenväter (Clemens v. Alex., Origenes) bezeugen, dass Judas 1,9 aus diesem Werk zitiert → es ist kein wertloser Text. Manche Gelehrte deuten den Heiligen Geist als „Geist der Prophetie", der künftige Propheten inspiriert — exakt das, was der Koran von Muhammad ﷺ sagt (16,102: der Heilige Geist [Gabriel] brachte die Offenbarung herab). → Jede Lesart von „Heiliger Geist" passt auf Muhammad ﷺ. (Sekundäres, stützendes Argument.)',
  },
  {
    tier: 'marble',
    h: '6.8 — Die Linguistik: parakletos ↔ periklytos ↔ Aḥmad',
    body: 'parakletos = para + kletos. para (Strong/Thayer/Liddell-Scott-Jones): nicht nur „neben", sondern „mehr als / über die Maßen / im Übermaß" — und behält das auch im Kompositum. kletos (von kaleo, verwandt mit kleo „rühmen"): „gerufen/gepriesen". → „der über die Maßen Gepriesene" = griech. periklytos = arab. Aḥmad (afʿal-Form, „der Höchstgepriesene"; vgl. al-Rāzī, Ibn ʿĀshūr). Koran 61,6: Jesus kündigt „einen Gesandten an, dessen Name Aḥmad ist". Wichtige Disziplin: Wir behaupten NICHT, dass parakletos überall „Aḥmad" heißt (das ergäbe Unsinn in 1. Joh 2,1 „wir haben einen Aḥmad beim Vater = Jesus"). Es ist eine Vorausschattung des Namens in bestimmten Paraklet-Sprüchen — genau wie christliche Theologen hebräische Wörter als Vorausschattungen Jesu lesen.',
  },
]

export const parakletVernetzung = [
  { ziel: 'Siegel 2 — Prophet wie Mose', text: 'Das Paraklet-Profil (Joh 16,13) = 5. Mose 18,18 Wort für Wort. Jesus bestätigt selbst, dass der Prophet wie Mose noch kommt — also nicht er ist.' },
  { ziel: 'Das Fundament', text: 'Hier wird 61,6 vom devotionalen zum vollen Beweis: Jesus nannte „Aḥmad" — und parakletos / periklytos ist der griechische Beleg.' },
  { ziel: 'Siegel 4 — Maḥamaddīm', text: 'periklytos = „Hochgepriesener" = Aḥmad = Wurzel ḤMD = maḥamaddim (Hld 5,16) / ḥimdat (Haggai). Der Name spannt sich über Hebräisch und Griechisch.' },
  { ziel: 'Verteidigung — falscher Prophet?', text: 'Origenes’ Schüler hielten Paulus für den Parakleten — koppelt an das Paulus-Dossier.' },
  { ziel: 'Siegel 5 — Daniel', text: 'Gabriel-als-Mann im Gebet (Dan 9,21 ↔ Bukhārī 3235) + der „Geist der Wahrheit" als inspirierter Prophet.' },
]

export const parakletGleicheMassstaebe =
  'Der Kritiker deutet Jesu „dieses Geschlecht" (Mt 24,34) großzügig als ferne Zukunft um — verweigert aber dem Parakleten dieselbe zeitliche Offenheit. Er liest hebräische Wörter routinemäßig als „Vorausschattungen Jesu" — verbietet aber die periklytos-Vorausschattung Aḥmads. Er nennt den Parakleten „Geist", obwohl die Beschreibung (abhängig, eingeschränkt, männlich, erst nach Jesu Weggang kommend) auf einen Menschen zeigt und seine eigenen Gelehrten (Brown & Co.) das einräumen. Auf gleichen Maßstäben ist der Paraklet ein kommender Prophet — und der Koran nennt seinen Namen.'
