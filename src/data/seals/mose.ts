import type { Beleg } from '../types'

// ---------------------------------------------------------------------------
// SIEGEL II — Prophet wie Mose (5. Mose 18,18). The full argument (SPEC §6.2):
//  · Deut 18:18 gives three criteria (like Moses / from the brothers = non-
//    Israelite / pure relay of God's words).
//  · Deut 34:10 locks the door — no prophet like Moses arose IN ISRAEL — so the
//    one "like Moses" must come from OUTSIDE Israel.
//  · "Brothers" in the Torah are kindred NATIONS (Esau/Edom, Ishmael), proved by
//    Deut 2:4 + the 36×-rule.
//  · John's Gospel itself separates "the Christ", "Elijah" and "the Prophet"
//    (Joh 1:19-21) — Messiah ≠ Prophet-like-Moses.
//  · Mathematically only Muhammad ﷺ remains: Ishmael's brother-nation, a law-
//    giver and statesman, naturally born, naturally dead, a pure relay of
//    revelation (Sure 53:3-4), accepted at last by his people.
// Full source / verse texts live on the Beleg records; surface copy stays lean.
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

export const moseThese =
  '„Kein Prophet erstand je wieder in Israel wie Mose" (5. Mose 34,10) — also MUSS der Verheißene von außerhalb Israels kommen. Jesus ist Israelit. Mose verspricht einen Propheten „wie dich, aus der Mitte ihrer Brüder — und ich lege meine Worte in seinen Mund" (18,18): drei Kriterien. „Brüder" verlangt in der Tora eine verwandte Nicht-Israeliten-Nation; Edom ist biblisch ausgeschlossen, es bleibt Ismael. Das Johannes-Evangelium selbst unterscheidet Jesus und „den Propheten" als zwei Personen. Es bleibt mathematisch nur Muhammad ﷺ.'

export const moseSteps: Step[] = [
  {
    n: 'I',
    h: 'Die Prophezeiung — drei Kriterien',
    body: '5. Mose 18,18: „Einen Propheten will ich ihnen aus ihren Brüdern erstehen lassen, wie dich. Ich will ihm meine Worte in den Mund legen." Drei Kriterien stecken im Vers: (1) wie Mose, (2) aus den Brüdern = Nicht-Israelit, (3) reiner Übermittler göttlicher Worte.',
  },
  {
    n: 'II',
    h: 'Der Ausschluss-Vers',
    body: '5. Mose 34,10: „Nie wieder erstand in Israel ein Prophet wie Mose." Kein zukünftiger Israelit kann die Prophezeiung erfüllen — die Bibel schließt sich selbst. Der Maßstab „wie Mose" und der Riegel „nicht in Israel" zeigen zusammen nach außerhalb.',
  },
  {
    n: 'III',
    h: 'Johannes trennt sie ausdrücklich',
    body: 'Joh 1,19-21: Die Priester fragen Johannes den Täufer: „Bist du der Messias?" — Nein. „Elija?" — Nein. „Der Prophet?" — Nein. Drei separate Identitäten. Messias ≠ Prophet wie Mose. Jesus als Messias ist nicht der Prophet von 5. Mose 18.',
  },
  {
    n: 'IV',
    h: 'Jesus kündigt ihn nach sich an',
    body: 'Joh 16,13: Der Paraklet wird kommen und „nur reden, was er hört" — direkte Sprache aus 5. Mose 18,18 („meine Worte in seinen Mund"). Jesus verweist auf jemanden nach ihm. Paraklet = Prophet wie Mose = Muhammad ﷺ, der reine Übermittler (53,3-4).',
  },
]

export const moseBelege: Record<string, Beleg> = {
  // ---- A — The prophecy: three criteria ----
  deut1818: {
    typ: 'bibel',
    kurz: 'Einen Propheten wie dich, aus ihren Brüdern — meine Worte in seinen Mund.',
    original:
      'נָבִיא אָקִים לָהֶם מִקֶּרֶב אֲחֵיהֶם כָּמוֹךָ וְנָתַתִּי דְבָרַי בְּפִיו וְדִבֶּר אֲלֵיהֶם אֵת כָּל אֲשֶׁר אֲצַוֶּנּוּ',
    sprache: 'he',
    translit:
      'nāvîʾ ʾāqîm lāhem miqqereḇ ʾăḥêhem kāmôḵā, wᵉ-nātattî dᵉvāray bᵉ-fîw, wᵉ-dibber ʾălêhem ʾēt kol-ʾăšer ʾăṣawwennû',
    uebersetzung:
      '„Einen Propheten will ich ihnen aus der Mitte ihrer Brüder erstehen lassen, wie dich; und ich will meine Worte in seinen Mund legen, und er wird zu ihnen alles reden, was ich ihm gebiete." — Drei Kriterien: (1) wie Mose, (2) aus den Brüdern (Nicht-Israelit), (3) reiner Übermittler.',
    fundstelle: '5. Mose (Deuteronomium) 18,18',
    status: 'Strong H251 · ʾaḥ = Bruder',
    kern: 'מִקֶּרֶב אֲחֵיהֶם',
  },

  // ---- B — The exclusion verse: none like Moses IN ISRAEL ----
  deut3410: {
    typ: 'bibel',
    kurz: 'Nie wieder erstand in Israel ein Prophet wie Mose.',
    original: 'וְלֹא קָם נָבִיא עוֹד בְּיִשְׂרָאֵל כְּמֹשֶׁה אֲשֶׁר יְדָעוֹ יְהוָה פָּנִים אֶל פָּנִים',
    sprache: 'he',
    translit: 'wᵉ-lōʾ qām nāvîʾ ʿôd bᵉ-Yiśrāʾēl kᵉ-Mōšeh ʾăšer yᵉdāʿô YHWH pānîm ʾel-pānîm',
    uebersetzung:
      '„Und es stand in Israel kein Prophet mehr auf wie Mose, den der HERR gekannt hätte von Angesicht zu Angesicht." — Kein zukünftiger Israelit kann den Vers erfüllen; der „wie Mose" muss von außerhalb Israels kommen. Die Bibel schließt sich selbst.',
    fundstelle: '5. Mose (Deuteronomium) 34,10',
    status: 'der Knockout-Vers',
    kern: 'בְּיִשְׂרָאֵל',
  },

  // ---- Deut 18:15 — "from your midst, from your brothers" ----
  deut1815: {
    typ: 'bibel',
    kurz: 'Einen Propheten wie mich, aus deinen Brüdern — auf ihn sollt ihr hören.',
    original: 'נָבִיא מִקִּרְבְּךָ מֵאַחֶיךָ כָּמֹנִי יָקִים לְךָ יְהוָה אֱלֹהֶיךָ אֵלָיו תִּשְׁמָעוּן',
    sprache: 'he',
    translit: 'nāvîʾ miqqirbᵉḵā mē-ʾaḥeḵā kāmōnî yāqîm lᵉḵā YHWH ʾĕlōheḵā, ʾēlāw tišmāʿûn',
    uebersetzung:
      '„Einen Propheten aus deiner Mitte, aus deinen Brüdern, wie mich, wird dir der HERR, dein Gott, erwecken; auf ihn sollt ihr hören." — Der Zusatz „aus deiner Mitte" fehlt in LXX, in den Toten-Meer-Rollen und im MT selbst drei Verse später (18,18).',
    fundstelle: '5. Mose (Deuteronomium) 18,15',
    status: '„aus deiner Mitte" — spätere Erweiterung',
    kern: 'מִקִּרְבְּךָ מֵאַחֶיךָ',
  },

  // ---- Deut 2:4 — Esau / Edom is your BROTHER (non-Israelite) ----
  deut24: {
    typ: 'bibel',
    kurz: 'Das Gebiet eurer Brüder, der Nachkommen Esaus — Esau ist kein Israelit.',
    original: 'אַתֶּם עֹבְרִים בִּגְבוּל אֲחֵיכֶם בְּנֵי עֵשָׂו הַיֹּשְׁבִים בְּשֵׂעִיר',
    sprache: 'he',
    translit: 'ʾattem ʿōvᵉrîm bi-ḡvûl ʾăḥêḵem bᵉnê ʿĒśāw ha-yōšᵉvîm bᵉ-Śēʿîr',
    uebersetzung:
      '„Ihr zieht durch das Gebiet eurer Brüder, der Nachkommen Esaus, die in Seïr wohnen." — Das Pronomen „euer" = Israel; „Brüder" = Edomiter = andere Nation. Die Tora selbst nennt Nicht-Israeliten „Brüder" Israels.',
    fundstelle: '5. Mose (Deuteronomium) 2,4',
    status: 'Esau = Bruder, kein Israelit',
    kern: 'אֲחֵיכֶם בְּנֵי עֵשָׂו',
  },

  // ---- Deut 23:7 — do not abhor the Edomite, he is your brother ----
  deut237: {
    typ: 'bibel',
    kurz: 'Du sollst den Edomiter nicht verabscheuen, denn er ist dein Bruder.',
    original: 'לֹא תְתַעֵב אֲדֹמִי כִּי אָחִיךָ הוּא',
    sprache: 'he',
    translit: 'lōʾ tᵉtaʿēv ʾădōmî kî ʾāḥîḵā hûʾ',
    uebersetzung:
      '„Du sollst den Edomiter nicht verabscheuen, denn er ist dein Bruder." — Das AT nennt die Edomiter (Nicht-Israeliten) ausdrücklich „Bruder" Israels. „Bruder" bezeichnet eine verwandte Nation, nicht einen Stammesgenossen.',
    fundstelle: '5. Mose (Deuteronomium) 23,8 (heb. 23,7)',
    status: 'Edomiter = dein Bruder',
    kern: 'כִּי אָחִיךָ הוּא',
  },

  // ---- C — John 1:19-21: three separate figures ----
  john121: {
    typ: 'bibel',
    kurz: 'Messias? — Nein. Elija? — Nein. Der Prophet? — Nein. Drei getrennte Personen.',
    original: 'σὺ Ἠλίας εἶ; … ὁ προφήτης εἶ σύ; καὶ ἀπεκρίθη· οὔ',
    sprache: 'grc',
    translit: 'sỳ Ēlías ei? … ho prophḗtēs ei sý? kai apekríthē: oú',
    uebersetzung:
      '„Bist du Elija? … Bist du der Prophet? Und er antwortete: Nein." — Die Priester fragen Johannes den Täufer drei getrennte Gestalten ab: den Christus, Elija und „den Propheten" (wie Mose). Drei separate Identitäten — Messias ≠ Prophet wie Mose.',
    fundstelle: 'Johannes 1,19-21',
    status: 'drei separate Identitäten',
    kern: 'ὁ προφήτης',
  },

  // ---- D — John 16:13: the Paraclete speaks only what he hears ----
  john1613: {
    typ: 'bibel',
    kurz: 'Er wird nicht aus sich selbst reden, sondern nur, was er hört.',
    original:
      'ὅταν δὲ ἔλθῃ ἐκεῖνος, τὸ πνεῦμα τῆς ἀληθείας … οὐ γὰρ λαλήσει ἀφ’ ἑαυτοῦ, ἀλλ’ ὅσα ἀκούσει λαλήσει',
    sprache: 'grc',
    translit: 'hótan dè élthē ekeînos, tò pneûma tês alētheías … ou gàr lalḗsei aph’ heautoû, all’ hósa akoúsei lalḗsei',
    uebersetzung:
      '„Wenn aber jener kommt, der Geist der Wahrheit … denn er wird nicht aus sich selbst reden, sondern was er hört, das wird er reden." — Direkte Parallele zu 5. Mose 18,18 („meine Worte in seinen Mund"). Jesus verweist auf einen Kommenden nach ihm.',
    fundstelle: 'Johannes 16,13',
    status: '= Deut 18,18 (gehört primär in Buch 6)',
    kern: 'ὅσα ἀκούσει λαλήσει',
  },

  // ---- Acts 3:22 — Peter cites WITHOUT "from your midst" ----
  apg322: {
    typ: 'bibel',
    kurz: 'Petrus zitiert Mose — als inspirierter Apostel ohne „aus deiner Mitte".',
    original:
      'προφήτην ὑμῖν ἀναστήσει κύριος ὁ θεὸς ὑμῶν ἐκ τῶν ἀδελφῶν ὑμῶν ὡς ἐμέ· αὐτοῦ ἀκούσεσθε',
    sprache: 'grc',
    translit: 'prophḗtēn hymîn anastḗsei kýrios ho theòs hymôn ek tôn adelphôn hymôn hōs emé; autoû akoúsesthe',
    uebersetzung:
      '„Einen Propheten wird euch der Herr, euer Gott, erstehen lassen aus euren Brüdern, wie mich; auf ihn sollt ihr hören." — Petrus zitiert 5. Mose 18,15 OHNE den Zusatz „aus deiner Mitte". Er kennt eine Textform ohne die Israel-Einschränkung; er nennt Jesus dort nicht ausdrücklich als Erfüllung.',
    fundstelle: 'Apostelgeschichte 3,22',
    status: 'zitiert ohne „aus deiner Mitte"',
    kern: 'ἐκ τῶν ἀδελφῶν ὑμῶν',
  },

  // ---- Matthew 5:17 — "not to abolish but to fulfil" ----
  mt517: {
    typ: 'bibel',
    kurz: 'Ich bin nicht gekommen, um aufzulösen, sondern zu erfüllen.',
    original:
      'μὴ νομίσητε ὅτι ἦλθον καταλῦσαι τὸν νόμον ἢ τοὺς προφήτας· οὐκ ἦλθον καταλῦσαι ἀλλὰ πληρῶσαι',
    sprache: 'grc',
    translit: 'mḕ nomísēte hóti êlthon katalŷsai tòn nómon ḕ toùs prophḗtas; ouk êlthon katalŷsai allà plērôsai',
    uebersetzung:
      '„Meint nicht, ich sei gekommen, um das Gesetz oder die Propheten aufzulösen; ich bin nicht gekommen, um aufzulösen, sondern um zu erfüllen." — Jesus selbst verneint einen neuen Gesetzeskörper. „Wie Mose" verlangt aber einen neuen Gesetzgeber.',
    fundstelle: 'Matthäus 5,17',
    status: 'kein neues Gesetz',
    kern: 'οὐκ … καταλῦσαι ἀλλὰ πληρῶσαι',
  },

  // ---- John 1:17 — law through Moses, grace through Jesus ----
  john117: {
    typ: 'bibel',
    kurz: 'Das Gesetz durch Mose — die Gnade durch Jesus.',
    original: 'ὅτι ὁ νόμος διὰ Μωϋσέως ἐδόθη, ἡ χάρις καὶ ἡ ἀλήθεια διὰ Ἰησοῦ Χριστοῦ ἐγένετο',
    sprache: 'grc',
    translit: 'hóti ho nómos dià Mōÿséōs edóthē, hē cháris kai hē alḗtheia dià Iēsoû Christoû egéneto',
    uebersetzung:
      '„Denn das Gesetz wurde durch Mose gegeben, die Gnade und die Wahrheit sind durch Jesus Christus geworden." — Das Johannes-Evangelium selbst setzt Mose = Gesetz, Jesus = Gnade. Also nicht Mose = Gesetz und Jesus = NEUES Gesetz. Jesus ist gerade nicht der zweite Gesetzgeber.',
    fundstelle: 'Johannes 1,17',
    status: 'Mose = Gesetz, Jesus = Gnade',
    kern: 'ὁ νόμος διὰ Μωϋσέως',
  },

  // ---- Sure 53:3-4 — he speaks not of his own; only revelation ----
  q5334: {
    typ: 'quran',
    kurz: 'Er spricht nicht aus eigener Neigung — es ist nur Offenbarung.',
    original: 'وَمَا يَنطِقُ عَنِ الْهَوَىٰ ۝ إِنْ هُوَ إِلَّا وَحْيٌ يُوحَىٰ',
    sprache: 'ar',
    translit: 'wa-mā yanṭiqu ʿani l-hawā · in huwa illā waḥyun yūḥā',
    uebersetzung:
      '„Und er spricht nicht aus eigener Neigung. Es ist nichts anderes als eine Offenbarung, die (ihm) eingegeben wird." — Das dritte Kriterium von 5. Mose 18,18: der reine Übermittler. „Ich lege meine Worte in seinen Mund."',
    fundstelle: 'Sure 53 (an-Najm), Verse 3-4',
    status: 'reiner Übermittler',
    kern: 'وَحْيٌ يُوحَىٰ',
  },

  // ---- Sahih Bukhari 3364 — Ishmael's Arab line (Jurhum) ----
  bukhari3364: {
    typ: 'quelle',
    kurz: 'Ṣaḥīḥ Bukhārī 3364: Ismael wuchs unter Jurhum auf — die arabische Linie.',
    uebersetzung:
      'Ṣaḥīḥ al-Bukhārī 3364 berichtet, wie Ismael bei den arabischen Jurhum aufwuchs, ihre Sprache lernte und in ihre Stämme einheiratete — der genealogische Ursprung der arabischen Linie Ismaels. Quraisch (und damit Muhammad ﷺ) steht in dieser Linie: die Brudernation Israels im biblischen Sinn.',
    fundstelle: 'Ṣaḥīḥ al-Bukhārī 3364',
    status: 'ṣaḥīḥ',
  },

  // ---- Sure 2:125 — Abraham + Ishmael at the Kaaba ----
  q2125: {
    typ: 'quran',
    kurz: 'Abraham und Ismael verpflichtet auf die Reinigung des Heiligen Hauses.',
    original: 'وَعَهِدْنَا إِلَىٰ إِبْرَاهِيمَ وَإِسْمَاعِيلَ أَن طَهِّرَا بَيْتِيَ لِلطَّائِفِينَ',
    sprache: 'ar',
    translit: 'wa-ʿahidnā ilā Ibrāhīma wa-Ismāʿīla an ṭahhirā baytiya li-ṭ-ṭāʾifīn',
    uebersetzung:
      '„Und Wir trugen Abraham und Ismael auf: Reinigt Mein Haus für die, die es umkreisen …" — Ismael steht mit Abraham am Heiligen Haus in Mekka; die Linie und der Ort der Verheißung sind arabisch.',
    fundstelle: 'Sure 2 (al-Baqara), Vers 125',
  },

  // ---- Source: textual variants of Deut 18:15 ----
  textvarianten: {
    typ: 'quelle',
    kurz: 'Vier Textzeugen zu 5. Mose 18,15 — drei von vieren ohne „aus deiner Mitte".',
    uebersetzung:
      'Der Befund in vier Schichten: MT (18,15) liest exklusiv „aus deiner Mitte, aus deinen Brüdern". Die LXX (Septuaginta) liest nur „aus deinen Brüdern, wie mich". Die Dead Sea Scrolls (4QTestimonia) lassen 18,15 vollständig aus und kennen nur 18,18. Und der MT selbst wiederholt drei Verse später (18,18) die Prophezeiung ohne „aus deiner Mitte". Lectio brevior potior: die kürzere Lesart ist ursprünglicher, dreifach bezeugt.',
    fundstelle: 'MT · LXX · 4QTestimonia · MT 18,18',
  },

  // ---- Source: NET Bible note on the "expansion" ----
  netbibel: {
    typ: 'quelle',
    kurz: 'NET-Bibel: der Zusatz „aus deiner Mitte" ist eine spätere Betonung — Erweiterung.',
    uebersetzung:
      'Die NET-Bibel notiert zu 5. Mose 18,15: „Die Erweiterung scheint zum Zweck der Betonung zu sein, d. h. der kommende Prophet muss nicht nur aus Israel kommen, sondern Israelit dem Blut nach sein." Die Gegenseite gesteht selbst: es ist Betonung (eine Erweiterung), nicht der ursprüngliche Text.',
    fundstelle: 'NET-Bibel, Anmerkung zu 5. Mose 18,15',
  },

  // ---- Source: Maimonides — Guide for the Perplexed II.34 ----
  maimonides: {
    typ: 'quelle',
    kurz: 'Maimonides (Führer II.34): „aus ihren Brüdern" allein führte natürlich zu Esau und Ismael.',
    uebersetzung:
      'Maimonides (Führer der Unschlüssigen / Guide for the Perplexed II.34) gesteht: „aus ihren Brüdern" allein hätte natürlicherweise auf Esau und Ismael bezogen werden können — weshalb Zusätze nötig waren. Damit gibt er zu: die natürliche Lesart des ursprünglichen Textes schließt Ismael ein. Zudem beschreibt 18,18 für ihn einen Propheten, zu dem ein Engel spricht — das Gabriel-Waḥy-Modell des Islams erfüllt seine eigene Definition.',
    fundstelle: 'Maimonides, Guide for the Perplexed II.34',
  },

  // ---- Source: Blenkinsopp on the Hebrew of Deut 34:10 ----
  blenkinsopp: {
    typ: 'quelle',
    kurz: 'Blenkinsopp: die hebräische Konstruktion heißt „nie und nimmer", nicht „noch nicht".',
    uebersetzung:
      'Der Alttestamentler Joseph Blenkinsopp hält fest: die hebräische Konstruktion in 5. Mose 34,10 bedeutet an keiner anderen Stelle der Bibel „noch nicht / aber später" — sie heißt: nie und nimmer in Israel. Der Vers ist ein absoluter Riegel gegen jeden israelitischen Kandidaten, kein bloßer Zwischenstand.',
    fundstelle: 'Joseph Blenkinsopp, AT-Wissenschaft',
  },

  // ---- Source: Samaritan Pentateuch reading of Deut 34:10 ----
  samaritanus: {
    typ: 'quelle',
    kurz: 'Samaritanischer Pentateuch: „Nie wieder wird ein Prophet wie Mose erstehen."',
    uebersetzung:
      'Der Samaritanische Pentateuch liest 5. Mose 34,10 ausdrücklich futurisch: „Nie wieder wird ein Prophet wie Mose erstehen." Ein eigenständiger Textzeuge, der den Vers als dauerhaften Ausschluss versteht — nicht als historische Bemerkung über die Zeit bis zur Niederschrift.',
    fundstelle: 'Samaritanischer Pentateuch, 5. Mose 34,10',
  },

  // ---- Source: Jewish Study Bible + Baden on the 18:18 / 34:10 tension ----
  baden: {
    typ: 'quelle',
    kurz: 'Jewish Study Bible & Prof. Baden: 18,18 vs. 34,10 ist „schwer bis unmöglich zu versöhnen".',
    uebersetzung:
      'Die Jewish Study Bible und Prof. Joel S. Baden räumen den Widerspruch zwischen 18,18 (ein Prophet wie Mose kommt) und 34,10 (nie in Israel) ausdrücklich ein — „schwer bis unmöglich zu versöhnen" —, wenn 18,18 auf einen Israeliten gelesen wird. Auflösung: der Widerspruch verschwindet vollständig, sobald 18,18 als Nicht-Israelit gelesen wird.',
    fundstelle: 'Jewish Study Bible · Joel S. Baden',
  },

  // ---- Source: Gersonides + Marc Shapiro — prophet from the nations ----
  gersonides: {
    typ: 'quelle',
    kurz: 'Gersonides (via Marc Shapiro): der Mose-gleiche Prophet kommt von den Nationen.',
    uebersetzung:
      'Gersonides (mittelalterlicher jüdischer Philosoph und Talmudist): Ein Prophet wie Mose entsteht „in Israel und unter den anderen Nationen" — er prophezeit für Israel, kommt aber von den Nationen. Prof. Marc B. Shapiro (Judaistik) bestätigt: Gersonides liest 5. Mose 34,10 als Beweis, dass der Messiah-Prophet von den Nationen kommt.',
    fundstelle: 'Gersonides · Marc B. Shapiro, Judaistik',
  },

  // ---- Source: Lamsa — "brother" = peoples related to the Jews ----
  lamsa: {
    typ: 'quelle',
    kurz: 'Lamsa: „Bruder" = den Juden verwandte Völker; Abraham nennt Lot „Bruder".',
    uebersetzung:
      'Der Linguist George Lamsa: „Bruder" meint „den Juden verwandte Völker". Beleg aus der Tora selbst: Abraham nennt Lot, seinen Neffen, „Bruder" (1. Mose 13,8). Die kollektive, völkerbezogene Bedeutung von „Bruder" ist im Hebräischen Standard, nicht Ausnahme.',
    fundstelle: 'George M. Lamsa · 1. Mose 13,8',
  },

  // ---- Source: Rashi on Proverbs 27:10 — Ishmael & Esau brothers of Isaac ----
  rashi: {
    typ: 'quelle',
    kurz: 'Rashi (zu Spr 27,10): Ismael und Esau sind „die Brüder Isaaks".',
    uebersetzung:
      'Rashi kommentiert zu Sprüche 27,10, dass Ismael und Esau „die Brüder Isaaks" sind — der größte mittelalterliche jüdische Bibelkommentator identifiziert Ismael selbst als Bruder Israels. Der Midrasch Tanchuma spricht entsprechend von Ismael und Esau als „eurer Brüder Haus".',
    fundstelle: 'Rashi zu Sprüche 27,10 · Midrasch Tanchuma',
  },

  // ---- Source: Luther's lecture on Deut 18 ----
  luther: {
    typ: 'quelle',
    kurz: 'Luther (Vorlesung über 5. Mose 18): Mose und Christus sind „völlig entgegengesetzt".',
    uebersetzung:
      'Martin Luther (Lecture on Deuteronomy 18): „Mose beschreibt hier sein eigenes Ende … Es geht nicht um persönliche Ähnlichkeit, sondern um Amtsautorität … In Bezug auf die Frucht ihres Wirkens sind sie unähnlich und völlig entgegengesetzt." Luther verschiebt die Ähnlichkeit aufs Amt — und gesteht damit, dass Jesus persönlich gerade nicht „wie Mose" ist.',
    fundstelle: 'Martin Luther, Lecture on Deuteronomy 18',
  },

  // ---- Source: Augustine, Contra Faustum ----
  augustinus: {
    typ: 'quelle',
    kurz: 'Augustinus (Contra Faustum): „überzeugt weder einen Heiden noch einen Juden".',
    uebersetzung:
      'Augustinus schreibt in Contra Faustum: „Ich anerkenne, dass dieses Argument weder einen Heiden noch einen Juden überzeugen wird." Er gesteht offen, es basiere nur auf Glauben an das Neue Testament, nicht auf exegetischen Beweisen. Der bedeutendste Kirchenvater ist damit selbst Zeuge gegen die christliche Deutung von 5. Mose 18.',
    fundstelle: 'Augustinus, Contra Faustum (Buch XVI)',
  },

  // ---- Source: Faustus, quoted by Augustine ----
  faustus: {
    typ: 'quelle',
    kurz: 'Faustus (bei Augustinus): „Christus war kein Prophet, noch war er wie Mose."',
    uebersetzung:
      'Faustus, zitiert von Augustinus (Contra Faustum): „Christus war kein Prophet, noch war er wie Mose: denn Mose war ein Mensch, Christus war Gott …" Der Einwand benennt präzise den Bruch: Mose ist Mensch, der christliche Christus ist Gott — also gerade nicht „wie Mose".',
    fundstelle: 'Faustus, bei Augustinus, Contra Faustum',
  },

  // ---- Source: Teeple — the Matthew fabrication ----
  teeple: {
    typ: 'quelle',
    kurz: 'Teeple: Matthäus fabrizierte die Mose-Jesus-Parallele (Berg statt Ebene).',
    uebersetzung:
      'Der NT-Wissenschaftler Howard M. Teeple zeigt, dass das Matthäus-Evangelium die Mose-Jesus-Parallele fabrizierte: Bergpredigt (Mt 5) gegen die Ebene (Lk 6,17) — Matthäus verlegte den Schauplatz auf einen Berg, um Moses Sinai-Aufstieg zu imitieren. „Dies ist kein treuer Bericht der Worte Jesu, sondern ein Produkt des Autors des Matthäus-Evangeliums." Und: Apg 3,22 deutet er so, dass Jesus im Himmel wartet, bis der Prophet kommt.',
    fundstelle: 'Howard M. Teeple, The Mosaic Eschatological Prophet',
  },

  // ---- Source: Hosea 11:1 context-stripping ----
  hosea111: {
    typ: 'quelle',
    kurz: 'Hosea 11,1 spricht rückblickend vom Exodus — Matthäus schneidet den Kontext heraus.',
    uebersetzung:
      'Mt 2,13-16 zitiert Hosea 11,1 („aus Ägypten rief ich meinen Sohn") als Prophezeiung über Jesus — dabei spricht Hosea 11,1 rückblickend über den Exodus Israels aus Ägypten („als Israel jung war, gewann ich es lieb"). Matthäus schneidet den Kontext heraus, um eine Mose-Parallele zu konstruieren.',
    fundstelle: 'Hosea 11,1 · Matthäus 2,13-16',
  },

  // ---- Source: John's Gospel separates Jesus from "the Prophet" ----
  johEvangelium: {
    typ: 'quelle',
    kurz: 'Das Johannes-Evangelium trennt Jesus systematisch von „dem Propheten".',
    uebersetzung:
      'Das Johannes-Evangelium widerspricht Matthäus systematisch: Joh 1,17 (Mose = Gesetz, Jesus = Gnade → kein neues Gesetz); Joh 1,19-21 (Messias ≠ Elija ≠ Prophet); Joh 6,14-15 (Jesus weicht aus, als man ihn „Prophet" nennt); Joh 7,40-41 (Streit: Messias oder Prophet? → zwei Personen); Joh 7,52 (Jesus aus Galiläa; „der Prophet kommt nicht aus Galiläa"). Teeple: „Die Haltung, dass Christus Mose überlegen ist, zieht sich durch das Johannes-Evangelium." → Jesus übertrifft Mose, er ist nicht wie Mose.',
    fundstelle: 'Joh 1,17 · 1,19-21 · 6,14-15 · 7,40-41 · 7,52',
  },

  // ---- Source: Josephus, Antiquities I.12 ----
  josephus: {
    typ: 'quelle',
    kurz: 'Josephus (Antiquities I.12): Ismaels 12 Söhne = die arabische Nation.',
    uebersetzung:
      'Flavius Josephus (Antiquitates I.12 §214) nennt Ismaels zwölf Söhne als die arabische Nation vom Euphrat bis zum Roten Meer — und hält fest, die Araber beschneiden mit dreizehn, weil Ismael, „der Gründer ihrer Nation", es in diesem Alter tat. Ein gegnerischer Zeuge für Ismaels arabische Brudernation.',
    fundstelle: 'Josephus, Antiquitates I.12 (§214)',
  },

  // ---- Source: Franz Delitzsch — the mediator is the prophet like Moses ----
  delitzsch: {
    typ: 'quelle',
    kurz: 'Franz Delitzsch: der Mittler der dem Sinai gleichen Offenbarung ist der Prophet wie Mose.',
    uebersetzung:
      'Der Hebraist Franz Delitzsch: „Die göttliche Offenbarung, die der Sinaitischen gleich ist, liegt für alle in der Zukunft — ihr Mittler ist der prophezeite Prophet wie Mose." Damit bindet er das Kriterium des neuen, Sinai-gleichen Gesetzes an den Verheißenen — genau das, was Muhammad ﷺ mit dem Koran brachte.',
    fundstelle: 'Franz Delitzsch, Hebraist',
  },

  // ---- Source: NIV Study Bible on Isaiah 42 = a new Moses ----
  niv: {
    typ: 'quelle',
    kurz: 'NIV Study Bible (Jes 42): „der Knecht wird ein neuer Moses sein (vgl. Deut 18,15-18)."',
    uebersetzung:
      'Die NIV Study Bible notiert zu Jesaja 42: „der Knecht wird ein neuer Moses sein (vgl. 5. Mose 18,15-18)." Eine christliche Studienbibel verbindet die Knecht-Prophezeiung von Jes 42 ausdrücklich mit dem Propheten wie Mose — die Brücke zu den arabischen Prophezeiungen (Buch 4).',
    fundstelle: 'NIV Study Bible, zu Jesaja 42',
  },

  // ---- Source: Rabbi Greenberg ----
  greenberg: {
    typ: 'quelle',
    kurz: 'Rabbiner Greenberg: „Der einzige vergleichbare Mensch zu Mose ist Muhammad."',
    uebersetzung:
      'Rabbiner Greenberg: „Der einzige Analoge zu Mose in der Religionsgeschichte ist Muhammad — gleiche Vielfalt der Rollen: Orakel, politisch-militärischer Führer, Kultgründer und Gesetzgeber." Ein jüdischer Zeuge dafür, dass gerade Muhammad ﷺ, nicht Jesus, das „wie Mose" erfüllt.',
    fundstelle: 'Rabbiner Greenberg',
  },

  // ---- Source: Rev. James L. Dow, Collins Dictionary of the Bible ----
  dow: {
    typ: 'quelle',
    kurz: 'Rev. James L. Dow (Collins Dictionary): „der einzige … der ihm verglichen werden kann, ist Mohammed."',
    uebersetzung:
      'Rev. James L. Dow schreibt im Collins Dictionary of the Bible (Eintrag „Moses"): „Der einzige Mensch in der Geschichte, der ihm auch nur entfernt verglichen werden kann, ist Mohammed." Ein christlicher Nachschlagewerk-Autor benennt Muhammad ﷺ — nicht Jesus — als den einzigen Mose-Vergleichbaren.',
    fundstelle: 'Rev. James L. Dow, Collins Dictionary of the Bible',
  },

  // ---- Source: Exodus 33:11 vs 33:20 — "face to face" is idiom ----
  exodus33: {
    typ: 'quelle',
    kurz: 'Ex 33,11 („von Angesicht zu Angesicht") vs. Ex 33,20 („kein Mensch sieht mich und lebt").',
    uebersetzung:
      '„Angesicht zu Angesicht" (2. Mose 33,11) kann nicht wörtlich sein: derselbe Text sagt „kein Mensch kann mein Gesicht sehen und leben" (2. Mose 33,20). Die Wendung meint enge Freundschaft/Vertrautheit — und genau das beschreibt die Nacht der Himmelfahrt (Isrāʾ wal-Miʿrāj) des Propheten ﷺ. Der Einwand, Muhammad habe nicht „Angesicht zu Angesicht" gesprochen, beruht auf einem Missverständnis des Idioms.',
    fundstelle: '2. Mose 33,11 vs. 33,20',
  },

  // ---- Source: Deut 18:21-22 verification test ----
  deut1821: {
    typ: 'quelle',
    kurz: '5. Mose 18,21-22: ein Echtheitstest — impliziert einen künftigen, umstrittenen Propheten.',
    uebersetzung:
      '5. Mose 18,21-22 gibt einen Echtheitsprüfungs-Mechanismus: Was der Prophet im Namen des HERRN sagt und es trifft nicht ein, das hat der HERR nicht geredet. Das impliziert einen zukünftigen Propheten, über dessen Echtheit Zweifel bestehen werden — also keinen unmittelbaren Zeitgenossen. Rashi: „dieser Vers weist auf eine zukünftige Zeit hin." Muhammad ﷺ machte präzise, eingetroffene Prophezeiungen (Sieg über Persien und Byzanz, Rückkehr nach Mekka).',
    fundstelle: '5. Mose 18,21-22 · Rashi z. St.',
  },

  // ---- Source: Sure 5:3 — mission completed ----
  q53: {
    typ: 'quran',
    kurz: 'Heute habe Ich euch eure Religion vollendet.',
    original: 'الْيَوْمَ أَكْمَلْتُ لَكُمْ دِينَكُمْ وَأَتْمَمْتُ عَلَيْكُمْ نِعْمَتِي',
    sprache: 'ar',
    translit: 'al-yawma akmaltu lakum dīnakum wa-atmamtu ʿalaykum niʿmatī',
    uebersetzung:
      '„Heute habe Ich euch eure Religion vollendet und Meine Gunst an euch vollendet …" — Die Mission Muhammads ﷺ war zu Lebzeiten vollendet. Mose und Muhammad vollenden ihr Werk; Jesus erwartet ein zweites Kommen.',
    fundstelle: 'Sure 5 (al-Māʾida), Vers 3',
    status: 'Mission vollendet',
    kern: 'أَكْمَلْتُ لَكُمْ دِينَكُمْ',
  },

  // ---- Source: Matthew 15:24 — sent only to Israel ----
  mt1524: {
    typ: 'bibel',
    kurz: 'Ich bin nur zu den verlorenen Schafen des Hauses Israel gesandt.',
    original: 'οὐκ ἀπεστάλην εἰ μὴ εἰς τὰ πρόβατα τὰ ἀπολωλότα οἴκου Ἰσραήλ',
    sprache: 'grc',
    translit: 'ouk apestálēn ei mḕ eis tà próbata tà apolōlóta oíkou Israḗl',
    uebersetzung:
      '„Ich bin nur zu den verlorenen Schafen des Hauses Israel gesandt." — Jesus selbst begrenzt seine Sendung auf Israel. Mose ging zu den Polytheisten Ägyptens, Muhammad ﷺ zu den Polytheisten Arabiens; Jesus nicht zu den Heiden.',
    fundstelle: 'Matthäus 15,24',
    status: 'nur zu Israel',
    kern: 'οἴκου Ἰσραήλ',
  },

  // ---- Source: John 1:11 — his own did not receive him ----
  john111: {
    typ: 'bibel',
    kurz: 'Er kam in sein Eigentum, und die Seinen nahmen ihn nicht auf.',
    original: 'εἰς τὰ ἴδια ἦλθεν, καὶ οἱ ἴδιοι αὐτὸν οὐ παρέλαβον',
    sprache: 'grc',
    translit: 'eis tà ídia êlthen, kai hoi ídioi autòn ou parélabon',
    uebersetzung:
      '„Er kam in sein Eigentum, und die Seinen nahmen ihn nicht auf." — Jesus wurde von seinem Volk nicht als Führer angenommen. Mose und Muhammad ﷺ wurden zuletzt von ihrem Volk angenommen; das ist das erste der fünfzehn Kriterien.',
    fundstelle: 'Johannes 1,11',
    status: 'vom Volk nicht angenommen',
    kern: 'οἱ ἴδιοι … οὐ παρέλαβον',
  },
}

// ---------------------------------------------------------------------------
// EXHIBIT 1 — the 15-criteria table (the centrepiece). Three figures, fifteen
// rows. Moses ↔ Muhammad: 15/15 · Jesus: 1/15. Uses the global .vgl classes.
// The wrong "Alter 40" row is replaced by "Berufung im reifen Alter, nicht ~30".
// ---------------------------------------------------------------------------
export const fuenfzehn = {
  spalten: ['Mose', 'Muhammad ﷺ', 'Jesus'],
  zeilen: [
    { k: 'Vom Volk als Führer angenommen', mose: 'ja', muh: 'ja', jesus: 'nein (Joh 1,11)' },
    { k: 'Politisch / militärischer Führer', mose: 'ja', muh: 'ja', jesus: '„nicht von dieser Welt"' },
    { k: 'Führte Kriege', mose: 'ja', muh: 'ja', jesus: 'nein' },
    { k: 'Natürliche Geburt', mose: 'ja', muh: 'ja', jesus: 'Jungfrauengeburt' },
    { k: 'Natürlicher Tod', mose: 'ja', muh: 'ja', jesus: 'Kreuzigung / Erhebung' },
    { k: 'Leichnam auf der Erde', mose: 'ja', muh: 'ja', jesus: 'Himmelfahrt' },
    { k: 'Familie (Frau, Kinder)', mose: 'ja', muh: 'ja', jesus: 'ledig' },
    { k: 'Spaltungs-Wunder', mose: 'ja (Meer)', muh: 'ja (Mond)', jesus: 'nein' },
    { k: 'Auswanderung aus der Heimat', mose: 'ja (Ägypten → Sinai)', muh: 'ja (Hidschra)', jesus: 'nein' },
    { k: 'Bringt neues Gesetz / Scharia', mose: 'ja', muh: 'ja', jesus: 'nein (Mt 5,17)' },
    { k: 'Reiner Übermittler göttl. Worte', mose: 'ja', muh: 'ja (53,3-4)', jesus: 'spricht als Gott selbst' },
    { k: 'Siegreich gegen Feinde', mose: 'ja', muh: 'ja', jesus: 'nein' },
    { k: 'Mission zu Lebzeiten vollendet', mose: 'ja', muh: 'ja (5,3)', jesus: '2. Kommen nötig' },
    { k: 'Gesendet zu Polytheisten', mose: 'ja (Ägypten)', muh: 'ja (Arabien)', jesus: 'nur Israel (Mt 15,24)' },
    { k: 'Von nicht-jüdischer Brudernation', mose: 'ja (Ägypten/Sinai-Umfeld)', muh: 'ja (Ismael → Arabien)', jesus: 'Israelit' },
  ],
  // SPEC note: the false "Alter 40" criterion (Ex 7:7 — Moses was 80 at his call)
  // is corrected to "Berufung im reifen Alter, nicht ~30" and shown as an aside,
  // so the scored grid keeps exactly the fifteen rows above (15/15 · 1/15).
  korrektur:
    'Berufung im reifen Erwachsenenalter — nicht mit ~30 wie Jesus. (Das oft genannte „Alter 40 bei der Berufung" für Mose ist falsch: Mose war 80, 2. Mose 7,7. Zeile entsprechend angepasst.)',
  score: { mose: '15 / 15', muh: '15 / 15', jesus: '1 / 15' },
  pointe:
    'Mose und Muhammad ﷺ gleichen sich in allen fünfzehn Kriterien; Jesus weicht in jedem ab — bis auf das eine: er kommt in der Zukunft. „Wie Mose" ist der Maßstab des Verses selbst, und an ihm hat 5. Mose 18,18 genau einen Erfüller.',
}

// ---------------------------------------------------------------------------
// EXHIBIT 2 — textual variants of Deut 18:15. Four witnesses; three of four
// lack "aus deiner Mitte". Uses the global .synopse 2-col table is too narrow;
// rendered as a dedicated 3-col grid (mose.css .varianten).
// ---------------------------------------------------------------------------
export const varianten = {
  intro:
    'Der Zusatz „aus deiner Mitte" (5. Mose 18,15) steht nur im Masoretischen Text. Drei von vier Zeugen kennen ihn nicht — und der MT selbst lässt ihn drei Verse später (18,18) wieder fallen.',
  spalten: ['Textzeuge', 'Lesart', '„aus deiner Mitte"'],
  zeilen: [
    { z: 'MT (Masoret. Text, 18,15)', t: '„aus deiner Mitte, aus deinen Brüdern" — der Zusatz erscheint hier exklusiv.', hat: true },
    { z: 'LXX (Septuaginta)', t: '„aus deinen Brüdern, wie mich" — ohne „aus deiner Mitte".', hat: false },
    { z: 'Dead Sea Scrolls (4QTestimonia)', t: '18,15 vollständig ausgelassen; die Gemeinschaft kannte nur 18,18.', hat: false },
    { z: 'MT selbst (18,18)', t: 'Gott wiederholt die Prophezeiung drei Verse später — ohne „aus deiner Mitte".', hat: false },
  ],
  pointe:
    'Lectio brevior potior: die kürzere Lesart ist ursprünglicher (Abschreiber erweitern, kürzen selten). Dreifach bezeugt (LXX + DSS + MT-18:18). Die NET-Bibel gesteht: eine Erweiterung zur Betonung — kein ursprünglicher Text.',
}

// ---------------------------------------------------------------------------
// EXHIBIT 3 — the Augustine panel ("they say it themselves").
// ---------------------------------------------------------------------------
export const augustinusPanel = {
  werk: 'Contra Faustum',
  autor: 'Augustinus von Hippo',
  zitat:
    'Ich anerkenne, dass dieses Argument weder einen Heiden noch einen Juden überzeugen wird.',
  kontext:
    'Augustinus gesteht offen, die christliche Deutung von 5. Mose 18 basiere nur auf Glauben an das Neue Testament, nicht auf exegetischen Beweisen. Faustus hatte eingewandt: „Christus war kein Prophet, noch war er wie Mose: denn Mose war ein Mensch, Christus war Gott." Der bedeutendste Kirchenvater ist damit selbst Zeuge gegen die Behauptung.',
  pointe: 'Der Hauptkirchenvater gibt die exegetische Niederlage zu — aus eigenem Mund.',
}

// ---------------------------------------------------------------------------
// EXHIBIT 4 — the John 1:19-21 schema: three questions → three persons.
// ---------------------------------------------------------------------------
export const dreiErwartungen = {
  intro:
    'Als die Priester Johannes den Täufer befragen, zählen sie drei getrennte Gestalten auf (Johannes 1,19-21). Drei Fragen, drei Personen — und „der Prophet wie Mose" ist nicht der Messias.',
  fragen: [
    { wer: 'Der Messias', f: 'Bist du der Christus?', a: 'Nein.' },
    { wer: 'Elija', f: 'Bist du Elija?', a: 'Nein.' },
    { wer: 'Der Prophet — wie Mose', f: 'Bist du der Prophet?', a: 'Nein.', hl: true },
  ],
  pointe:
    '„Der Prophet" steht neben dem Messias und Elija — eine eigene, dritte Erwartung (vgl. Joh 6,14; 7,40-41). Jesus als Messias ist nicht automatisch „der Prophet" von 5. Mose 18.',
}

// ---------------------------------------------------------------------------
// EXHIBIT 5 — the sieve: Joshua / all Israelites / Jesus → sifted out;
// Muhammad ﷺ remains.
// ---------------------------------------------------------------------------
export const sieb = {
  intro:
    'Wer alle Kandidaten durch die drei Kriterien siebt — wie Mose, Nicht-Israelit, neues Gesetz —, bei dem bleibt am Ende genau einer übrig.',
  kandidaten: [
    {
      name: 'Josua',
      grund: 'Brachte kein neues Gesetz (folgte Moses Tora); war Israelit; war bereits zu Moses Lebzeiten eingesetzt (Num 27,15-23) — die Prophezeiung meint eine künftige Sendung.',
    },
    {
      name: 'Die 70 Ältesten (Num 11)',
      grund: 'Bereits zu Moses Zeit aktiv — dieselbe Logik. Kein künftiger Prophet, kein neues Gesetz.',
    },
    {
      name: 'Alle israelitischen Propheten nach Mose',
      grund: 'Keiner brachte ein neues Gesetz vergleichbar dem Sinai-Bund; keiner ist Nicht-Israelit. 5. Mose 34,10 schlägt sie alle aus.',
    },
    {
      name: 'Jesus',
      grund: 'Israelit → ausgeschlossen durch 5. Mose 34,10. Brachte kein neues Gesetz (Mt 5,17). Jungfrauengeburt, göttliche Natur → das Gegenteil von Moses Menschlichkeit.',
    },
  ],
  uebrig: {
    name: 'Muhammad ﷺ',
    grund: 'Aus Ismaels Brudernation (Bukhārī 3364; Josephus I.12); brachte den Koran = neues, vollständiges Gesetz; reiner Übermittler (53,3-4); in unspezifizierter Zukunft gesandt. Alle drei Kriterien erfüllt.',
  },
  pointe:
    'Deut 18,21-22 verlangt zudem einen künftigen, prüfbaren Propheten — keinen Zeitgenossen Moses. Das Sieb lässt am Ende nur einen Namen stehen.',
}

// ---------------------------------------------------------------------------
// EXHIBIT 6 — Greenberg + Dow panel: external western & Jewish witnesses.
// ---------------------------------------------------------------------------
export const zeugen = {
  intro:
    'Nicht nur Muslime ziehen den Vergleich. Ein Rabbiner und ein christlicher Lexikon-Autor benennen denselben Befund: der einzige Mose-Vergleichbare ist Muhammad ﷺ.',
  stimmen: [
    {
      wer: 'Rabbiner Greenberg',
      was: '„Der einzige Analoge zu Mose in der Religionsgeschichte ist Muhammad — gleiche Vielfalt der Rollen: Orakel, politisch-militärischer Führer, Kultgründer und Gesetzgeber."',
      quelle: 'jüdischer Zeuge',
    },
    {
      wer: 'Rev. James L. Dow',
      was: '„Der einzige Mensch in der Geschichte, der ihm auch nur entfernt verglichen werden kann, ist Mohammed."',
      quelle: 'Collins Dictionary of the Bible, Eintrag „Moses"',
    },
  ],
  pointe:
    'Externe Zeugen — jüdisch und christlich — bestätigen aus eigenem Munde: das „wie Mose" passt auf Muhammad ﷺ, nicht auf Jesus.',
}

// ---------------------------------------------------------------------------
// EINWAND · KONTER — the six rows of the SPEC box (lines 243-250).
// ---------------------------------------------------------------------------
export const moseKonter: KonterItem[] = [
  {
    tier: 'stone',
    einwand: '„5. Mose 18,18 = Jesus, denn Petrus zitiert es in Apg 3,22."',
    konter:
      'Petrus identifiziert Jesus dort nicht ausdrücklich als Erfüllung. Bibelwissenschaftler Teeple: der Vers bedeutet, Jesus wartet im Himmel, bis der Prophet kommt. Und: Petrus selbst zitiert 5. Mose 18,15 ohne den Zusatz „aus deiner Mitte" — er benutzte eine Textform, die keine Israel-Einschränkung kennt.',
    belegId: 'apg322',
  },
  {
    tier: 'stone',
    einwand: '„‚Brüder‘ = Israeliten, also ein Jude."',
    konter:
      'Falsch — Tora-Definition: 5. Mose 2,4: „das Gebiet eurer Brüder, der Nachkommen Esaus." Esau ist kein Israelit, heißt aber „Bruder". Die Wendung „aus ihren Brüdern" erscheint 36× im AT — jedes Mal ist „Bruder" jemand anderes als die Gruppe, auf die „ihre" verweist. „Israel ist der Bruder Israels" ist so absurd wie „ich bin mein eigener Bruder".',
    belegId: 'deut24',
  },
  {
    tier: 'stone',
    einwand: '„‚Aus deiner Mitte‘ (5. Mose 18,15) begrenzt es auf Israel."',
    konter:
      'Dieser Zusatz fehlt in der LXX (Septuaginta), in den Dead Sea Scrolls (18,15 vollständig ausgelassen) und im MT selbst drei Verse später in 18,18. NET-Bibel: eine bewusste spätere Erweiterung zur Betonung. Maimonides gesteht: ohne diesen Zusatz hätte man natürlich auf Esau und Ismael gelesen. → Spätere Einfügung, keine ursprüngliche Offenbarung.',
    belegId: 'textvarianten',
  },
  {
    tier: 'stone',
    einwand: '„Augustinus und die Kirchenväter sehen Jesus hier."',
    konter:
      'Augustinus schreibt in Contra Faustum: „Ich anerkenne, dass dieses Argument weder einen Heiden noch einen Juden überzeugen wird." Er gesteht offen, es basiere nur auf Glauben an das NT, nicht auf exegetischen Beweisen. Damit ist der Hauptkirchenvater selbst Zeuge gegen die Behauptung.',
    belegId: 'augustinus',
  },
  {
    tier: 'stone',
    einwand: '„Jesus brachte auch eine neue Lehre."',
    konter:
      'Matthäus 5,17: „Ich bin nicht gekommen, um aufzulösen, sondern zu erfüllen." Mt 15,3; 19,17: Halte die Gebote. Jesus selbst verneinte einen neuen Gesetzeskörper. Johannes 1,17 kontrastiert: „das Gesetz durch Mose, Gnade durch Jesus" — sein eigenes Evangelium macht Mose = Gesetz und Jesus = Gnade, nicht Jesus = neues Gesetz.',
    belegId: 'john117',
  },
  {
    tier: 'stone',
    einwand: '„Muhammad ist auch kein Prophet wie Mose — er sprach nicht Angesicht zu Angesicht mit Gott."',
    konter:
      '„Angesicht zu Angesicht" (2. Mose 33,11) kann nicht wörtlich sein: derselbe Text sagt „kein Mensch kann mein Gesicht sehen und leben" (2. Mose 33,20). Es bedeutet enge Freundschaft/Vertrautheit — und genau das beschreibt die Nacht der Himmelfahrt (Isrāʾ wal-Miʿrāj) des Propheten ﷺ. Rabbiner Greenberg: „Der einzige vergleichbare Mensch zu Mose in der Religionsgeschichte ist Muhammad."',
    belegId: 'exodus33',
  },
]

// ---------------------------------------------------------------------------
// GELEHRTEN-EBENE — sections 2.1-2.5 (stone), 2.6 (marble).
// ---------------------------------------------------------------------------
export const moseScholar: ScholarItem[] = [
  {
    tier: 'stone',
    h: '2.1 — Textkritik: der nachträglich eingeschmuggelte Zusatz (18,15)',
    body: 'Der Befund in vier Schichten: MT (18,15) liest exklusiv „aus deiner Mitte, aus deinen Brüdern"; die LXX nur „aus deinen Brüdern, wie mich"; die Dead Sea Scrolls (4QTestimonia) lassen 18,15 vollständig aus und kennen nur 18,18; und der MT selbst wiederholt drei Verse später (18,18) ohne den Zusatz. Lectio brevior potior — die kürzere, dreifach bezeugte Lesart ist ursprünglicher. NET-Bibel: die Erweiterung diene der Betonung (die Gegenseite gesteht: kein ursprünglicher Text). Maimonides (Guide II.34): ohne den Zusatz hätte man natürlich auf Esau und Ismael gelesen. Und Petrus (Apg 3,22) zitiert als inspirierter Apostel ohne „aus deiner Mitte" — er kennt eine Textform ohne diese Einschränkung.',
  },
  {
    tier: 'stone',
    h: '2.2 — Der Knockout: 5. Mose 34,10 macht jeden Israeliten unmöglich',
    body: '34,10: „Nie wieder erstand in Israel ein Prophet wie Mose." Blenkinsopp: die hebräische Konstruktion bedeutet nirgends „noch nicht / aber später" — sie heißt „nie und nimmer in Israel". Der Samaritanische Pentateuch liest ausdrücklich futurisch: „Nie wieder wird ein Prophet wie Mose erstehen." Die Jewish Study Bible und Prof. Joel S. Baden räumen ein: 18,18 (kommt) und 34,10 (nie in Israel) seien „schwer bis unmöglich zu versöhnen" — wenn 18,18 auf einen Israeliten gelesen wird. Der Widerspruch verschwindet, sobald 18,18 als Nicht-Israelit gelesen wird. Gersonides (via Marc B. Shapiro): der Mose-gleiche Prophet kommt von den Nationen. Knock-Out-Kette: 34,10 → kein Israelit → Jesus ist Israelit → ausgeschlossen → einzige Brudernation übrig: Ismael.',
  },
  {
    tier: 'stone',
    h: '2.3 — „Brüder" = verwandte Nation: die 36×-Regel',
    body: 'Linguistischer Beweis: 5. Mose 2,4 — „das Gebiet eurer Brüder, der Nachkommen Esaus" (Pronomen „euer" = Israel; „Brüder" = Edomiter). 5. Mose 18,2 — die Leviten haben „kein Erbteil unter ihren Brüdern" (zwei verschiedene Gruppen); dieselben Kommentatoren lesen hier korrekt und kippen methodenwidrig bei 18,18. Die Wendung „aus ihren/deinen Brüdern" erscheint ~36× im AT — in jedem einzigen Fall sind „Brüder" eine andere Gruppe als das Pronomen; bei 18,18 eine Ausnahme zu behaupten ist Sonderpleading. Lamsa: „Bruder" = „den Juden verwandte Völker" (Abraham nennt Lot „Bruder", Gen 13,8). Rashi (zu Spr 27,10): Ismael und Esau sind „die Brüder Isaaks". Midrasch Tanchuma: „eurer Brüder Haus". 5. Mose 23,7: „Du sollst den Edomiter nicht verabscheuen, denn er ist dein Bruder." Hebr. ʾach (אח) = Vollbruder, Halbbruder oder Verwandter; Ismael = Halbbruder Isaaks = ʾach = „Bruder der Israeliten". Linguistisch einwandfrei.',
  },
  {
    tier: 'stone',
    h: '2.4 — Ausschluss aller Kandidaten: die Sieb-Methode',
    body: 'Jüdische Kandidaten (alle gescheitert): Josua brachte kein neues Gesetz, war Israelit, war bereits zu Moses Lebzeiten eingesetzt (Num 27,15-23). Die 70 Ältesten (Num 11) waren schon zu Moses Zeit aktiv. Alle israelitischen Propheten nach Mose brachten kein Sinai-gleiches Gesetz und sind keine Nicht-Israeliten — 34,10 schlägt sie aus. 5. Mose 18,21-22 (Verifikationstest) impliziert einen künftigen, umstrittenen Propheten, keinen Zeitgenossen (Rashi: „eine zukünftige Zeit"). Jesus (gescheitert): Israelit → 34,10; kein neues Gesetz (Mt 5,17; 15,3; 19,17); Jungfrauengeburt und göttliche Natur — das Gegenteil von Moses Menschlichkeit. Luther (Lecture on Deuteronomy 18): es gehe um Amtsautorität, nicht persönliche Ähnlichkeit; „in Bezug auf die Frucht … unähnlich und völlig entgegengesetzt". Faustus (bei Augustinus): „Christus war kein Prophet, noch war er wie Mose." Augustinus’ Antwort: „überzeugt weder einen Heiden noch einen Juden." Teeple: Matthäus fabrizierte die Mose-Parallele — Bergpredigt (Mt 5) gegen die Ebene (Lk 6,17), Berg statt Ebene zur Imitation des Sinai-Aufstiegs („kein treuer Bericht … sondern ein Produkt des Autors"). Hosea-11,1-Manipulation: Mt 2,13-16 zitiert einen rückblickenden Exodus-Vers als Prophezeiung. Das Johannes-Evangelium widerspricht Matthäus: Joh 1,17 (Mose = Gesetz, Jesus = Gnade), 1,19-21 (drei Personen), 6,14-15 (Jesus weicht aus), 7,40-41 (Messias oder Prophet?), 7,52 (der Prophet kommt nicht aus Galiläa). Teeple: „Christus ist Mose überlegen" zieht sich durch Johannes — Jesus übertrifft Mose, er ist nicht wie Mose.',
  },
  {
    tier: 'stone',
    h: '2.5 — Die Beweiskette für Muhammad ﷺ: alle Kriterien erfüllt',
    body: 'Abstammung (Brüder-Kriterium): Ismaels arabische Linie — Ṣaḥīḥ Bukhārī 3364 (Heirat mit Jurhum); Josephus (Antiquities I.12): Ismaels zwölf Söhne = arabische Nation vom Euphrat bis zum Roten Meer; Sure 2,125 (Abraham + Ismael, Kaaba). Quraisch = Ismaels Linie → Muhammad ﷺ = Bruder der Israeliten im biblischen Sinn. Gesetzgeber-Kriterium: Franz Delitzsch — der Mittler der dem Sinai gleichen Offenbarung ist der prophezeite Prophet wie Mose; Muhammad ﷺ brachte den Koran = neues vollständiges Gesetz; NIV Study Bible zu Jes 42: „der Knecht wird ein neuer Moses sein (vgl. 5. Mose 18,15-18)." Rabbiner Greenberg: „Der einzige Analoge zu Mose … ist Muhammad — gleiche Vielfalt der Rollen." Rev. James L. Dow (Collins Dictionary of the Bible, Eintrag Moses): „Der einzige Mensch … der ihm verglichen werden kann, ist Mohammed." Übermittler-Kriterium (18,18b): Sure 53,3-4 — „Er spricht nicht aus eigenem Antrieb; es ist nur Offenbarung." Maimonides (Guide II.34): 18,18 beschreibt einen Propheten, zu dem ein Engel spricht — das Gabriel-Waḥy-Modell erfüllt seine eigene Definition. Zukunfts-Kriterium: ~2000 Jahre nach Mose, unspezifizierte Zukunft; 18,21-22 (Verifikationstest) — Muhammads ﷺ präzise Prophezeiungen (Sieg über Persien und Byzanz, Rückkehr nach Mekka) trafen ein.',
  },
  {
    tier: 'marble',
    h: '2.6 — Historisch-kritische Dekonstruktion von 5. Mose 17 (Auxiliarlinie)',
    body: 'Die Einrede: 5. Mose 17,15 benutzt dasselbe Wort „Bruder" wie 18,15 → „Bruder = Israelit". Der Anachronismus: 5. Mose 17,14-20 (Königsgesetz: Pferde, Frauen, Reichtum) setzt eine Monarchie voraus — in der nomadischen Wüstenzeit gibt es kein Königtum. Historische Passung: die Verbote spiegeln exakt die Exzesse Salomos (1 Kön 10-11). Gelehrten-Eingeständnisse: Prof. Baruch Halpern listet literarische und historische Gründe, warum das Königsgesetz nicht deuteronomisch-mosaischen Ursprungs ist; Prof. Dewey Beegle: „Kein Beweis … zeigt, dass Deut 17 in der Frühzeit der Monarchie bekannt war. Es waren wahrscheinlich Salomos Exzesse, die die Beschränkungen hervorriefen." Und 1 Sam 8,4-7: als Israel einen König forderte, sagte Gott „sie haben mich verworfen" — wäre 17,15 schon mosaisch, warum dann „verworfen"? → Deut 17 entstand nach Deut 18; sein restriktiver „Bruder"-Begriff kann 18,18 nicht definieren. Die 36×-Regel und Deut 2,4 sind primär; Deut 17 ist sekundär. (Setzt Redaktionskritik voraus — daher ergänzend; bei traditionalistischen Gegnern Priorität auf 2.2, 2.3 und Augustinus.)',
  },
]

export const moseVernetzung = [
  {
    ziel: 'Buch 2 — Abrahams Nachkommen',
    text: 'Ein „großes Volk" (5. Mose 4) braucht einen Gesetzgeber — und 18,18 liefert ihn „aus der Mitte ihrer Brüder", der gesegneten Linie Ismaels.',
  },
  {
    ziel: 'Buch 4 — Arabische Prophezeiungen',
    text: '5. Mose 33 (Paran / 10.000 Heilige) ist dieselbe Gesetzgeber-Figur; die NIV Study Bible verbindet Jesaja 42 ausdrücklich mit 5. Mose 18.',
  },
  {
    ziel: 'Buch 7 — Der Paraklet',
    text: 'Joh 16,13 („spricht nur, was er hört") = 5. Mose 18,18 („Worte in den Mund legen") — Jesus selbst verbindet beide Verheißungen.',
  },
  {
    ziel: 'Verteidigung — Falscher Prophet?',
    text: 'Das Gesetz, das Muhammad ﷺ brachte, ist Deut-18-verheißen — kein Einwand gegen die Aufhebung, sondern ihre Erfüllung.',
  },
]

export const moseGleicheMassstaebe =
  'Der Kritiker akzeptiert Matthäus’ Jesus-Mose-Parallele (Bergpredigt, Ägypten-Flucht) — obwohl Teeple und die Evangelien selbst zeigen, dass Matthäus die Biografie Jesu umschrieb. Für Muhammad ﷺ verlangt er unveränderte Texte. Augustinus — der bedeutendste Kirchenvater — gibt zu, das Argument überzeuge keine Nichtchristen. Der Muslim fragt nur: gleiche Maßstäbe. Und auf gleichen Maßstäben hat 5. Mose 18,18 genau einen Erfüller.'
