import type { Beleg } from '../types'

// ---------------------------------------------------------------------------
// SIEGEL I — Abrahams gesegnete Nachkommenschaft (SPEC §6.1). The covenant is
// with Abraham's whole seed; Ishmael receives the sign AND a "great nation" —
// and "great nation" is biblically DEFINED (Deut 4,6-8) as one near to God,
// keeping His law. Only Islam fulfils that for Ishmael's line. Includes the
// Vav-question, the Maimonides trap (Ex 32,10), the sacrifice-son arithmetic,
// Jubilees, Josephus, the Chumash admission, and Ishmael's rehabilitation.
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

export const abrahamThese =
  'Gott schloss den Bund mit Abrahams ganzem Samen und gab Ismael, dem Erstgeborenen, das Bundeszeichen ins Fleisch UND ein „großes Volk" (1. Mose 17,20). Und was ein „großes Volk" ist, definiert die Tora selbst: nicht Zahl oder Macht, sondern ein Volk, dem Gott nahe ist und das gerechte Gesetze hält (5. Mose 4,6-8). Vor-islamisches Arabien war heidnisch — erst mit Muhammad ﷺ wurde Ismaels Linie zu Monotheismus und Gesetz. Die Erwählung Isaaks für den einen Bund verwirft Ismael nicht für den anderen. Bevor man fragt, ob der Prophet kommt: dieses Buch zeigt, dass die Linie, aus der er käme, gesegnet, legitim — und biblisch zum „großen Volk" bestimmt ist.'

export const abrahamSteps: Step[] = [
  {
    n: 'I',
    h: 'Der Bund mit dem ganzen Samen',
    body: 'Gott richtet seinen Bund auf „zwischen mir und dir und deinem Samen (zeraʿ) nach dir … als ewigen Bund" (1. Mose 17,7) — unspezifiziert. Das Zeichen ist die Beschneidung (17,10-11), und Ismael empfängt es eigenhändig von Abraham (17,23). Zeichen = Bundeszugehörigkeit. Ismael steht im Bund.',
  },
  {
    n: 'II',
    h: 'Die eigene Verheißung',
    body: 'Gott segnet Ismael ausdrücklich: „Ich habe ihn gesegnet, fruchtbar gemacht und über die Maßen gemehrt; zwölf Fürsten wird er zeugen, und ich mache ihn zu einem großen Volk" (17,20). Zwölf Fürsten — Spiegel der zwölf Stämme Israels. Dieselbe Bundessprache, die auch Isaak und Jakob trägt.',
  },
  {
    n: 'III',
    h: 'Was „großes Volk" heißt',
    body: 'Die Tora definiert „großes Volk" selbst: „Welches große Volk hat Götter, die ihm so nahe sind … und so gerechte Satzungen?" (5. Mose 4,6-8). Größe = Gottesnähe und Gesetz, nicht Demografie oder Imperium. Vor-islamisches Arabien war götzendienerisch — erst Muhammad ﷺ brachte Tawḥīd und Gesetz. Das Herzstück, das die Maimonides-Falle sprengt.',
  },
  {
    n: 'IV',
    h: 'Der Bund ist übertragbar und offen',
    body: 'Erwählung ist nicht unwiderruflich: das Priestertum wanderte nach dem goldenen Kalb (4. Mose 3,12; 1. Sam 2,30), und Jesus selbst sagt, das Reich werde „genommen und einem Volk gegeben, das Früchte bringt" (Mt 21,43). Nichts sperrt Ismaels gesegnete Linie für Prophetie — den Propheten selbst liefern die folgenden Bücher.',
  },
]

export const abrahamBelege: Record<string, Beleg> = {
  // ---- The covenant with the whole seed ----
  gen177: {
    typ: 'bibel',
    kurz: 'Ich richte meinen Bund auf zwischen mir und dir und deinem Samen nach dir — ein ewiger Bund.',
    original:
      'וַהֲקִמֹתִי אֶת בְּרִיתִי בֵּינִי וּבֵינֶךָ וּבֵין זַרְעֲךָ אַחֲרֶיךָ לְדֹרֹתָם לִבְרִית עוֹלָם',
    sprache: 'he',
    translit: 'wa-hăqimōtî ʾet-bᵉrîtî bênî û-vênekā û-vên zarʿăkā ʾaḥărekā lᵉ-dōrōtām li-vrît ʿôlām',
    uebersetzung:
      '„Und ich will meinen Bund aufrichten zwischen mir und dir und deinem Samen (zeraʿ) nach dir, für ihre Geschlechter, als einen ewigen Bund." — Der Same ist unspezifiziert; das Zeichen (17,10-11) trägt zuerst Ismael (17,23).',
    fundstelle: '1. Mose (Genesis) 17,7',
    status: 'Strong H2233 · zeraʿ = Same',
    kern: 'זַרְעֲךָ',
  },

  // ---- Ishmael receives the covenant sign ----
  gen1723: {
    typ: 'bibel',
    kurz: 'Abraham nahm Ismael, seinen Sohn, und beschnitt ihn an ebendiesem Tag.',
    original: 'וַיִּקַּח אַבְרָהָם אֶת יִשְׁמָעֵאל בְּנוֹ ... וַיָּמָל אֶת בְּשַׂר עָרְלָתָם בְּעֶצֶם הַיּוֹם הַזֶּה',
    sprache: 'he',
    translit: 'wayyiqqaḥ ʾAvrāhām ʾet-Yišmāʿēl bᵉnô … wayyāmol ʾet-bᵉśar ʿorlātām bᵉ-ʿeṣem ha-yôm ha-zeh',
    uebersetzung:
      '„Und Abraham nahm Ismael, seinen Sohn, … und beschnitt das Fleisch ihrer Vorhaut an ebendiesem Tag." Das Bundeszeichen kam zuerst in Ismaels Fleisch. Der ICC räumt ein: Ismaels Beschneidung ist mit seinem Ausschluss unvereinbar.',
    fundstelle: '1. Mose (Genesis) 17,23',
    kern: 'בְּעֶצֶם הַיּוֹם הַזֶּה',
  },

  // ---- The great-nation blessing on Ishmael ----
  gen1720: {
    typ: 'bibel',
    kurz: 'Ich habe Ismael gesegnet: zwölf Fürsten — und ein großes Volk.',
    original:
      'וּלְיִשְׁמָעֵאל שְׁמַעְתִּיךָ הִנֵּה בֵּרַכְתִּי אֹתוֹ וְהִפְרֵיתִי אֹתוֹ וְהִרְבֵּיתִי אֹתוֹ בִּמְאֹד מְאֹד שְׁנֵים־עָשָׂר נְשִׂיאִם יוֹלִיד וּנְתַתִּיו לְגוֹי גָּדוֹל',
    sprache: 'he',
    translit:
      'û-lᵉ-Yišmāʿēl šᵉmaʿtîḵā, hinnēh bēraḵtî ʾōtô wᵉ-hip̄rêtî ʾōtô wᵉ-hirbêtî ʾōtô bi-mᵉʾōd mᵉʾōd; šᵉnêm-ʿāśār nᵉśîʾim yôlîd, û-nᵉtattîw lᵉ-gôy gādôl',
    uebersetzung:
      '„Und was Ismael betrifft, so habe ich dich erhört: Siehe, ich habe ihn gesegnet und will ihn fruchtbar machen (pārāh) und über die Maßen mehren; zwölf Fürsten wird er zeugen, und ich will ihn zu einem großen Volk (gôy gādôl) machen."',
    fundstelle: '1. Mose (Genesis) 17,20',
    status: 'Strong H1419 · gôy gādôl = großes Volk',
    kern: 'לְגוֹי גָּדוֹל',
  },

  // ---- The DEFINITION of a great nation (the heart-piece) ----
  dtn46: {
    typ: 'bibel',
    kurz: 'Welches große Volk hat Götter, die ihm nahe sind, und so gerechte Gesetze?',
    original:
      'כִּי מִי גוֹי גָּדוֹל אֲשֶׁר לוֹ אֱלֹהִים קְרֹבִים אֵלָיו כַּיהוָה אֱלֹהֵינוּ ... וּמִי גּוֹי גָּדוֹל אֲשֶׁר לוֹ חֻקִּים וּמִשְׁפָּטִים צַדִּיקִם',
    sprache: 'he',
    translit:
      'kî mî gôy gādôl ʾăšer lô ʾĕlōhîm qᵉrōvîm ʾēlāyw ka-YHWH ʾĕlōhênû … û-mî gôy gādôl ʾăšer lô ḥuqqîm û-mišpāṭîm ṣaddîqim',
    uebersetzung:
      '„Denn welches große Volk hat Götter, die ihm so nahe sind, wie der HERR, unser Gott …? Und welches große Volk hat so gerechte Satzungen und Rechte?" — Die Tora definiert „großes Volk" selbst: Gottesnähe + gerechtes Gesetz, nicht Zahl. Nur der Islam erfüllt das für Ismaels Linie.',
    fundstelle: '5. Mose (Deuteronomium) 4,6-8',
    status: 'Definition gôy gādôl',
    kern: 'גּוֹי גָּדוֹל',
  },

  // ---- Ishmael is Abraham's seed ----
  gen2113: {
    typ: 'bibel',
    kurz: 'Auch den Sohn der Magd mache ich zu einem Volk — denn er ist dein Same.',
    original: 'וְגַם אֶת בֶּן הָאָמָה לְגוֹי אֲשִׂימֶנּוּ כִּי זַרְעֲךָ הוּא',
    sprache: 'he',
    translit: 'wᵉ-gam ʾet-ben hā-ʾāmāh lᵉ-gôy ʾăśîmennû, kî zarʿăḵā hûʾ',
    uebersetzung:
      '„Und auch den Sohn der Magd will ich zu einem Volk machen, weil er dein Same (zeraʿ) ist." — Ismael trägt dasselbe Bundeswort wie Isaak: Abrahams Same.',
    fundstelle: '1. Mose (Genesis) 21,13',
    kern: 'זַרְעֲךָ',
  },

  // ---- Lift up the boy: a great nation ----
  gen2118: {
    typ: 'bibel',
    kurz: 'Steh auf, nimm den Knaben — denn ich will ihn zu einem großen Volk machen.',
    original: 'קוּמִי שְׂאִי אֶת הַנַּעַר וְהַחֲזִיקִי אֶת יָדֵךְ בּוֹ כִּי לְגוֹי גָּדוֹל אֲשִׂימֶנּוּ',
    sprache: 'he',
    translit: 'qûmî śᵉʾî ʾet-ha-naʿar wᵉ-haḥăzîqî ʾet-yādēḵ bô, kî lᵉ-gôy gādôl ʾăśîmennû',
    uebersetzung:
      '„Steh auf, nimm den Knaben und halte ihn fest an deiner Hand, denn ich will ihn zu einem großen Volk machen." — Gottes Wort an Hagar in der Wüste.',
    fundstelle: '1. Mose (Genesis) 21,18',
  },

  // ---- The sacrifice son: "your only son" — impossible for Isaac ----
  gen222: {
    typ: 'bibel',
    kurz: 'Nimm deinen Sohn, deinen einzigen (yeḥid) — doch Ismael war 14 Jahre älter.',
    original: 'קַח נָא אֶת בִּנְךָ אֶת יְחִידְךָ אֲשֶׁר אָהַבְתָּ אֶת יִצְחָק',
    sprache: 'he',
    translit: 'qaḥ-nā ʾet-binkā ʾet-yᵉḥîdkā ʾăšer ʾāhavtā ʾet-Yiṣḥāq',
    uebersetzung:
      '„Nimm deinen Sohn, deinen einzigen (yeḥid), den du liebst, den Isaak …" — Arithmetisch unmöglich: Abraham war 86 bei Ismaels Geburt (16,16) und 100 bei Isaaks (21,5). Vierzehn Jahre lang war Ismael der einzige Sohn; Isaak war nie „einzig".',
    fundstelle: '1. Mose (Genesis) 22,2',
    kern: 'יְחִידְךָ',
  },

  // ---- Circumcised at thirteen ----
  gen1726: {
    typ: 'bibel',
    kurz: 'Ismael war dreizehn Jahre alt, als er beschnitten wurde.',
    uebersetzung:
      '„Ismael, sein Sohn, war dreizehn Jahre alt, als er beschnitten wurde … an ebendemselben Tag wurde Abraham beschnitten und Ismael, sein Sohn." Das Bundeszeichen kam Jahre vor Isaaks Geburt.',
    fundstelle: '1. Mose (Genesis) 17,25-26',
  },

  // ---- In your seed all nations blessed ----
  gen2218: {
    typ: 'bibel',
    kurz: 'In deinem Samen sollen alle Völker der Erde gesegnet werden.',
    original: 'וְהִתְבָּרֲכוּ בְזַרְעֲךָ כֹּל גּוֹיֵי הָאָרֶץ',
    sprache: 'he',
    translit: 'wᵉ-hitbārăḵû ḇᵉ-zarʿăḵā kōl gôyê hā-ʾāreṣ',
    uebersetzung:
      '„Und in deinem Samen sollen alle Völker der Erde gesegnet werden." — Der universale Segen reicht über Isaak hinaus zu allen Völkern.',
    fundstelle: '1. Mose (Genesis) 22,18',
    kern: 'כֹּל גּוֹיֵי הָאָרֶץ',
  },

  // ---- "Wild donkey of a man" — rehabilitated ----
  gen1612: {
    typ: 'bibel',
    kurz: 'Ein Wildesel-Mensch — seine Hand mit allen (Samaritanus), wohnend vor seinen Brüdern.',
    original: 'וְהוּא יִהְיֶה פֶּרֶא אָדָם יָדוֹ בַכֹּל וְיַד כֹּל בּוֹ וְעַל פְּנֵי כָל אֶחָיו יִשְׁכֹּן',
    sprache: 'he',
    translit: 'wᵉ-hûʾ yihyeh pere ʾādām, yādô va-kōl wᵉ-yad kōl bô, wᵉ-ʿal pᵉnê ḵol ʾeḥāyw yiškōn',
    uebersetzung:
      '„Und er wird ein Wildesel-Mensch (pere ʾadam) sein" — im Hebräischen Bild für frei und ungezähmt (vgl. Hiob 39,5), nicht Fluch. „Seine Hand mit allen" (Samaritanus „mit", ein Konsonant) — „und er wird wohnen im Angesicht aller seiner Brüder": gegenwärtig, nicht ausgestoßen.',
    fundstelle: '1. Mose (Genesis) 16,12',
    kern: 'פֶּרֶא אָדָם',
  },

  // ---- God makes Moses a great nation — proof "great" ≠ number ----
  ex3210: {
    typ: 'bibel',
    kurz: 'Lass mich Mose zu einem großen Volk machen — nach dem goldenen Kalb. Also kein Zahlen-Versprechen.',
    original: 'וְעַתָּה הַנִּיחָה לִּי ... וְאֶעֱשֶׂה אוֹתְךָ לְגוֹי גָּדוֹל',
    sprache: 'he',
    translit: 'wᵉ-ʿattāh hannîḥāh llî … wᵉ-ʾeʿĕśeh ʾôtkā lᵉ-gôy gādôl',
    uebersetzung:
      '„Und nun lass mich … ich will dich (Mose) zu einem großen Volk machen." — Gott sagt es zu Moses allein, nach dem goldenen Kalb. „Großes Volk" kann hier unmöglich „viele Nachkommen" heißen — es meint geistlichen Rang. Maimonides’ „Zahl"-Lesart bricht an seinem eigenen Text.',
    fundstelle: '2. Mose (Exodus) 32,10',
    kern: 'לְגוֹי גָּדוֹל',
  },

  // ---- The kingdom given to a fruit-bearing nation ----
  mt2143: {
    typ: 'bibel',
    kurz: 'Das Reich Gottes wird euch genommen und einem Volk gegeben, das Früchte bringt.',
    original:
      'ἀρθήσεται ἀφ’ ὑμῶν ἡ βασιλεία τοῦ θεοῦ καὶ δοθήσεται ἔθνει ποιοῦντι τοὺς καρποὺς αὐτῆς',
    sprache: 'grc',
    translit: 'arthḗsetai aph’ hymôn hē basileía toû theoû kai dothḗsetai éthnei poioûnti toùs karpoùs autês',
    uebersetzung:
      '„Das Reich Gottes wird euch genommen und einem Volk (ethnos) gegeben werden, das seine Früchte bringt." — Jesus selbst lehrt die Übertragbarkeit des Bundes: nicht Blutlinie, sondern Frucht. Präzedenz: das Priestertum nach dem goldenen Kalb.',
    fundstelle: 'Matthäus 21,43',
    kern: 'ἔθνει ... τοὺς καρποὺς',
  },

  // ---- Abraham and Ishmael's prayer at the Kaaba ----
  q2129: {
    typ: 'quran',
    kurz: 'Unser Herr, erwecke unter ihnen einen Gesandten aus ihrer Mitte.',
    original:
      'رَبَّنَا وَابْعَثْ فِيهِمْ رَسُولًا مِّنْهُمْ يَتْلُو عَلَيْهِمْ آيَاتِكَ وَيُعَلِّمُهُمُ الْكِتَابَ وَالْحِكْمَةَ',
    sprache: 'ar',
    translit: 'rabbanā wa-bʿath fīhim rasūlan minhum yatlū ʿalayhim āyātika wa-yuʿallimuhumu l-kitāba wa-l-ḥikmah',
    uebersetzung:
      '„Unser Herr, und erwecke unter ihnen einen Gesandten aus ihrer Mitte, der ihnen Deine Zeichen verliest und sie das Buch und die Weisheit lehrt …" — Abraham und Ismael beim Bau der Kaaba (2,127-129); 2,128 bittet um eine „ummah muslimah".',
    fundstelle: 'Sure 2 (al-Baqara), Vers 129',
    kern: 'رَسُولًا مِّنْهُمْ',
  },

  // ---- Abraham settles his offspring at the Sacred House ----
  q1437: {
    typ: 'quran',
    kurz: 'Ich habe einen Teil meiner Nachkommen im Tal bei Deinem Heiligen Haus angesiedelt.',
    original: 'رَّبَّنَا إِنِّي أَسْكَنتُ مِن ذُرِّيَّتِي بِوَادٍ غَيْرِ ذِي زَرْعٍ عِندَ بَيْتِكَ الْمُحَرَّمِ',
    sprache: 'ar',
    translit: 'rabbanā innī askantu min dhurriyyatī bi-wādin ghayri dhī zarʿin ʿinda baytika l-muḥarram',
    uebersetzung:
      '„Unser Herr, ich habe einen Teil meiner Nachkommenschaft in einem Tal ohne Ackerland angesiedelt, bei Deinem geschützten Haus …" — Abraham siedelt Hagar und Ismael in Mekka an.',
    fundstelle: 'Sure 14 (Ibrāhīm), Vers 37',
  },

  // ---- Source: the Book of Jubilees — an inclusive covenant ----
  jubilaeen: {
    typ: 'quelle',
    kurz: 'Das Buch der Jubiläen (vor-islam., jüd.): Abraham verpflichtet ALLE Söhne auf den Bund.',
    uebersetzung:
      'Das Buch der Jubiläen (≥100 v. Chr., Umfeld der Toten-Meer-Rollen) berichtet: Abraham ruft alle seine Nachkommen zusammen — Ismael mit seinen zwölf Söhnen, Isaak mit zweien, Keturas sechs —, verpflichtet sie zur Beschneidung „gemäß dem Bund" und betet, dass Isaak UND Ismael ein „erwähltes Volk … in alle Zeitalter" seien. Ein vor-islamischer jüdischer Zeuge für den inklusiven Bund.',
    fundstelle: 'Buch der Jubiläen 15 (vgl. S. 14-15)',
  },

  // ---- Source: Josephus — the Arabs are Ishmael's nation ----
  josephus: {
    typ: 'quelle',
    kurz: 'Josephus: die Araber beschneiden mit 13 — weil Ismael, Gründer ihrer Nation, es mit 13 tat.',
    uebersetzung:
      'Flavius Josephus (Antiquitates I.12.2 §214) hält fest: die Araber beschneiden ihre Söhne im Alter von dreizehn Jahren, „weil Ismael, der Gründer ihrer Nation … in diesem Alter beschnitten wurde". Er nennt Ismaels zwölf Söhne als die arabische Nation vom Euphrat bis zum Roten Meer. Ein gegnerischer Zeuge für die Genealogie und das „große Volk".',
    fundstelle: 'Josephus, Antiquitates I.12.2 (§214)',
  },

  // ---- Source: the Chumash admission — fulfilled with the rise of Islam ----
  chumash: {
    typ: 'quelle',
    kurz: 'Jüdischer Chumash-Kommentar: Ismaels „großes Volk" erfüllte sich erst mit dem Islam im 7. Jh.',
    uebersetzung:
      'Ein jüdischer Chumash-Kommentar gesteht, dass sich die Verheißung, Ismael zu einem „großen Volk" zu machen, erst mit dem Aufkommen des Islam im 7. Jahrhundert verwirklichte — rund 2337 Jahre nach der Prophezeiung. Der stärkste externe Beleg: die Gegenseite nennt selbst den Islam als die Erfüllung.',
    fundstelle: 'Chumash-Kommentar (vgl. S. 8)',
  },

  // ---- Source: ICC concedes the exclusion is inconsistent ----
  icc: {
    typ: 'quelle',
    kurz: 'Der ICC räumt ein: Ismaels Beschneidung ist mit seinem Ausschluss vom Bund unvereinbar.',
    uebersetzung:
      'Der International Critical Commentary (ICC) räumt ein, dass Ismaels Aufnahme ins Bundeszeichen (Beschneidung, 17,23) mit der Behauptung, er sei vom Bund ausgeschlossen, nicht vereinbar ist. Und der Samaritanische Pentateuch liest 17,21 ausdrücklich „und meinen Bund" — nicht „aber".',
    fundstelle: 'International Critical Commentary, Genesis (vgl. S. 11)',
  },

  // ---- Source: the genealogy to the Prophet ----
  genealogie: {
    typ: 'quelle',
    kurz: 'Ismael → Kedar → ʿAdnān → Quraisch → Muhammad ﷺ — die Linie der Nordaraber.',
    uebersetzung:
      'Die klassische arabische Genealogie (Ibn Isḥāq, aṭ-Ṭabarī) führt den Propheten ﷺ über die Quraisch und ʿAdnān auf Kedar (Qaydār), den zweiten Sohn Ismaels, zurück — die etablierte Position der Nordaraber als „Söhne Ismaels". Das deckt sich mit dem biblischen Befund: Kedar ist im Tanach der Name der Araber (Jes 21,16).',
    fundstelle: 'Ibn Isḥāq, Sīra · aṭ-Ṭabarī · vgl. Jes 21,16',
  },

  // ---- Source: Jewish recognition of the great nation ----
  maimonides: {
    typ: 'quelle',
    kurz: 'Jüdische Quellen selbst nennen die Ismaeliter die Araber — und bezeugen das große Volk.',
    uebersetzung:
      'Josephus, Genesis Rabbah und spätere Autoritäten — bis hin zu Maimonides (Mishneh Tora, Hilchot Melachim) — identifizieren Ismaels Nachkommen mit dem arabischen Volk. Selbst gegnerische Quellen bestätigen damit unfreiwillig die Erfüllung der Verheißung vom „großen Volk".',
    fundstelle: 'Josephus · Genesis Rabbah · Maimonides, Hilchot Melachim',
  },
}

// ---- The family tree: one father, two blessed lines -------------------------
export const stammbaum = {
  wurzel: { name: 'Abraham', ar: 'إبراهيم' },
  ismael: {
    label: 'Ismael · der Erstgeborene',
    nodes: ['Ismael', 'Kedar', 'die arabischen Stämme', 'ʿAdnān · Quraisch', 'Muhammad ﷺ'],
  },
  isaak: {
    label: 'Isaak',
    nodes: ['Isaak', 'Jakob · Israel', 'die zwölf Stämme', 'David', 'Jesus'],
  },
  note: 'Ein Vater, zwei gesegnete Linien. Die Bibel verwirft Ismael nicht — sie gibt ihm einen eigenen Bundessegen und ein eigenes großes Volk.',
}

// ---- The twelve princes (Gen 25) --------------------------------------------
export const zwoelfFuersten = {
  ref: '1. Mose 25,13-16',
  fuersten: [
    'Nebajot',
    'Kedar',
    'Adbeel',
    'Mibsam',
    'Mischma',
    'Duma',
    'Massa',
    'Hadad',
    'Tema',
    'Jetur',
    'Naphisch',
    'Kedma',
  ],
  highlight: 'Kedar',
  pointe:
    'Zwölf Fürsten (nesiʾim) Ismaels — Spiegel der zwölf Stämme Israels. Israels Zwölf wurden zum Volk unter Mose; Ismaels Zwölf zum großen Volk unter Muhammad ﷺ. Kedar wird in der Bibel selbst zum Namen der Araber (Jes 21,16).',
}

// ---- What Ishmael received (the covenant gifts) -----------------------------
export const ismaelEmpfing = [
  { gabe: 'Von Gott benannt', ref: '1. Mose 16,11 — „Ismael" = „Gott hört"' },
  { gabe: 'Abrahams Same (zeraʿ)', ref: '1. Mose 21,13' },
  { gabe: 'Das Bundeszeichen — Beschneidung', ref: '1. Mose 17,23-26' },
  { gabe: 'Gesegnet · fruchtbar · gemehrt', ref: '1. Mose 17,20' },
  { gabe: 'Zwölf Fürsten', ref: '1. Mose 17,20; 25,16' },
  { gabe: 'Ein großes Volk', ref: '1. Mose 21,18' },
]
export const ismaelEmpfingPointe =
  'Sechs Bundesgaben — dieselben Worte, die auch Isaaks Linie tragen. „Nur Isaak" hält dem Text nicht stand.'

// ---- The Vav-question (Gen 17,21): "and" vs "but" ---------------------------
export const vavTabelle = {
  intro:
    'Der Einwand steht und fällt mit einem hebräischen Buchstaben: dem Vav (ו) in 1. Mose 17,21, das „und" oder „aber" heißen kann. Der Kontext — Ismael wird im selben Kapitel beschnitten — erzwingt „und".',
  spalten: ['Übersetzung', 'Lesart von 17,21'],
  zeilen: [
    { h: "Young's Literal (YLT)", j: '„And My covenant I establish with Isaac" — und' },
    { h: 'ISV', j: 'Isaak tritt zum Bund hinzu — nicht statt Ismael' },
    { h: 'Samaritanischer Pentateuch', j: 'explizit „And My covenant with Yesaahq" — und' },
    { h: 'NIV u. a.', j: '„But my covenant" — aber (spätere exklusive Lesart)' },
  ],
  pointe:
    'Drei Zeugen lesen „und". Maimonides’ „nur Isaak" ist eine spätere exklusivistische Lesart — der ICC räumt die Inkonsistenz selbst ein.',
}

// ---- The Maimonides trap: "great nation" ≠ number ---------------------------
export const grosseNationWaage = {
  intro:
    'Maimonides reduziert „großes Volk" auf Zahl (Dtn 11,23). Doch dieselbe Tora und dieselben jüdischen Autoritäten widerlegen das — mit ihren eigenen Texten.',
  these: 'Maimonides: „großes Volk" = viele Nachkommen',
  gegen: [
    { q: '2. Mose 32,10', t: 'Gott macht MOSES zum „großen Volk" — nach dem goldenen Kalb. Kann nicht „Zahl" sein.' },
    { q: 'Ibn Ezra', t: '„großes Volk" meint „die den Herrn fürchten" — geistlich.' },
    { q: 'Benson-Kommentar', t: '„nicht in Pomp und Macht, sondern in der Gerechtigkeit der Gesetze".' },
    { q: 'Siftei Chakhamim', t: 'rechtschaffenes Verhalten, nicht Demografie.' },
  ],
  pointe:
    'Die „Zahl"-Lesart bricht an 5. Mose 4,6-8 (der Definition) und an Exodus 32,10. „Großes Volk" heißt: Gottesnähe und Gesetz.',
}

// ---- The chronology: Ishmael was the "only son" for 14 years ----------------
export const chronologie = {
  intro: 'Der „einzige Sohn" (Gen 22,2) kann arithmetisch nicht Isaak sein:',
  zeilen: [
    { e: 'Abraham bei Ismaels Geburt', wert: '86 Jahre', ref: '1. Mose 16,16' },
    { e: 'Abraham bei Isaaks Geburt', wert: '100 Jahre', ref: '1. Mose 21,5' },
    { e: 'Ismael älter als Isaak', wert: '14 Jahre', ref: '→ 14 Jahre einziger Sohn' },
    { e: 'Ismael beschnitten mit', wert: '13 Jahren', ref: '1. Mose 17,25' },
  ],
  pointe:
    'Vierzehn Jahre lang war Ismael Abrahams einziger Sohn. Isaak war nie „einzig". Rashi: „kein Früher und Später in der Tora" — die Re-Anordnung ist redaktionell.',
}

// ---- Ishmael rehabilitated (Gen 16,12) --------------------------------------
export const ismaelReha = {
  intro: 'Die negative Lesart von 1. Mose 16,12 ist Deutung, nicht Text — ein Konsonant entscheidet:',
  zeilen: [
    { neg: '„gegen jedermann"', pos: '„mit jedermann" (Samaritanus — ein Konsonant)' },
    { neg: '„Wildesel" als Schimpf', pos: '„fruchtbar" (parah, wiederholt in 17,20) — Bild der Freiheit (Hiob 39,5)' },
    { neg: 'ausgestoßen', pos: '„wohnt im Angesicht aller seiner Brüder" (25,18) — gegenwärtig' },
  ],
  pointe:
    'Rabbinerin Nancy Fuchs Kreimer: die negative Deutung spiegelt den sozialen Kontext der Autoren, nicht den Text. Ismael ist ein freies Wüstenvolk, kein Fluch.',
}

export const abrahamKonter: KonterItem[] = [
  {
    tier: 'stone',
    einwand: '„1. Mose 17,21: ‚ABER mit Isaak‘ — Ismael ist ausgeschlossen."',
    konter:
      'Das hebräische Vav (ו) heißt „und" oder „aber" — der Kontext entscheidet. Und der Kontext erzwingt „und": nur zwei Verse später beschneidet Abraham Ismael (17,23), nimmt ihn also ins Bundeszeichen. YLT, ISV und der Samaritanische Pentateuch lesen „und". Der ICC räumt ein: Ismaels Beschneidung ist mit seinem Ausschluss unvereinbar. „Nur Isaak" ist spätere exklusive Lesart.',
    belegId: 'icc',
  },
  {
    tier: 'stone',
    einwand: '„Maimonides sagt: der Bund läuft nur über Isaak."',
    konter:
      'Maimonides liest spät und exklusiv. Der Text selbst widerspricht: Ismael empfängt das Zeichen (17,23), heißt Abrahams „Same" (21,13), und der Samaritanus liest 17,21 „und meinen Bund". Zwei Bünde schließen einander nicht aus — der eine partikular (Isaak: Land, Tora), der andere universal: „in deinem Samen alle Völker" (22,18).',
    belegId: 'gen1723',
  },
  {
    tier: 'stone',
    einwand: '„‚Großes Volk‘ heißt nur: viele Araber — reine Demografie."',
    konter:
      'Eure eigene Tora definiert „großes Volk": „Welches große Volk hat Götter, die ihm so nahe sind … und so gerechte Gesetze?" (5. Mose 4,6-8). Größe = Gottesnähe und Gesetz, nicht Zahl. Vor-islamisches Arabien war heidnisch; erst der Islam brachte Monotheismus und Gesetz. Genau diese Definition erfüllt Ismaels Linie erst mit Muhammad ﷺ.',
    belegId: 'dtn46',
  },
  {
    tier: 'stone',
    einwand: '„Propheten kommen aus Isaaks Linie."',
    konter:
      'Das Alte Testament kennt nicht-israelitische Propheten und Richter — etwa Obadja, oder Othniel (Richter 3,9-10). Nichts in der Schrift sperrt Prophetie für Ismaels Linie. Mose verheißt sogar einen Propheten „aus der Mitte ihrer Brüder" (5. Mose 18,18) — das entfaltet Buch 3.',
  },
  {
    tier: 'stone',
    einwand: '„Isaak war der ‚einzige Sohn‘ (1. Mose 22,2) — also der Erbe."',
    konter:
      'Arithmetisch unmöglich: Abraham war 86 bei Ismaels Geburt (16,16) und 100 bei Isaaks (21,5). Vierzehn Jahre lang war Ismael der einzige Sohn. Isaak war nie „einzig" (yeḥid). Die Spannung ist ein redaktioneller Befund — Rashi selbst: „kein Früher und Später in der Tora".',
    belegId: 'gen222',
  },
  {
    tier: 'stone',
    einwand: '„Maimonides: ‚großes Volk‘ bedeutet schlicht eine große Zahl."',
    konter:
      'Widerlegt mit euren eigenen Leuten: 2. Mose 32,10 — Gott macht MOSES zum „großen Volk" (nach dem goldenen Kalb), das kann keine Zahl sein. Ibn Ezra: „die den Herrn fürchten". Benson: „nicht Pomp und Macht, sondern Gerechtigkeit der Gesetze". Siftei Chakhamim: rechtschaffenes Verhalten. Die „Zahl"-Lesart bricht an Exodus 32,10 und an 5. Mose 4.',
    belegId: 'ex3210',
  },
  {
    tier: 'stone',
    einwand: '„Der Bund ist unwiderruflich — er bleibt bei Israel."',
    konter:
      'Erwählung ist nicht unwiderruflich: das Priestertum wanderte nach dem goldenen Kalb (4. Mose 3,12; 1. Sam 2,30). Und Jesus selbst: „Das Reich wird euch genommen und einem Volk gegeben, das Früchte bringt" (Mt 21,43); „Gott kann aus diesen Steinen dem Abraham Kinder erwecken" (Mt 3,9). Frucht, nicht Blutlinie.',
    belegId: 'mt2143',
  },
  {
    tier: 'stone',
    einwand: '„Selbst wenn geistlich gemeint — warum gerade der Islam?"',
    konter:
      'Weil die Gegenseite es selbst sagt: ein jüdischer Chumash-Kommentar gesteht, dass sich Ismaels „große Nation" erst mit dem Aufkommen des Islam im 7. Jahrhundert verwirklichte — rund 2337 Jahre nach der Prophezeiung. Kein Muslim trägt das ein; es steht im rabbinischen Kommentar.',
    belegId: 'chumash',
  },
  {
    tier: 'stone',
    einwand: '„Ismael war ein ‚wilder, gewalttätiger Mann‘ (1. Mose 16,12)."',
    konter:
      'פֶּרֶא אָדָם (pere ʾadam), „Wildesel-Mensch", ist im Hebräischen das Bild für frei und ungezähmt (vgl. Hiob 39,5), kontrastiert mit „fruchtbar" (parah, wiederholt in 17,20). „Gegen jedermann" vs. „mit jedermann" trennt nur ein Konsonant (Samaritanus). Und der Satz endet: „er wohnt im Angesicht aller seiner Brüder" (25,18). Rabbinerin Fuchs Kreimer: die negative Lesart ist Vorurteil, nicht Text.',
    belegId: 'gen1612',
  },
  {
    tier: 'stone',
    einwand: '„Warum sollte ‚Segen‘ für Ismael geistlich sein, nicht bloß weltlich?"',
    konter:
      'Weil er als Trost für Abraham gegeben wird (1. Mose 17,18: „Ach, dass Ismael leben möge vor dir!"). Was tröstet einen Propheten um seinen Sohn? Nicht Macht — Götzenvölker hatten Macht und waren geistlich tot. Nur geistlicher Rang tröstet. Also ist Ismaels „großes Volk" geistlich gemeint.',
  },
  {
    tier: 'marble',
    einwand: '„Das widersprüchliche Ismael-Bild zeigt nur einen unklaren Text."',
    konter:
      'Die Juxtaposition (gesegnet und im Bund vs. „verstoßen", Gen 21,10) ist gerade ein Verfälschungs-Indiz (vgl. Koran 4,82: im Gotteswort gäbe es keine Widersprüche). Ein redaktioneller Bruch — die ältere, segnende Schicht scheint durch. (Setzt Redaktionskritik voraus; daher ergänzend.)',
  },
  {
    tier: 'marble',
    einwand: '„Muslime segnen Abraham im Gebet — das ‚beweist‘ doch nichts."',
    konter:
      'Richtig — und wir behaupten es auch nicht als Beweis. 1. Mose 12,3 („die dich segnen, segne ich") und die Ṣalawāt auf Ibrāhīm im täglichen Gebet sind eine devotionale Resonanz, kein Schriftbeweis. Ehrlich als das geführt, was es ist: schön, aber nicht tragend.',
  },
]

export const abrahamScholar: ScholarItem[] = [
  {
    tier: 'stone',
    h: '1.1 — Der Bund umfasst den ganzen Samen',
    body: '1. Mose 17,7 schließt den Bund mit Abraham und seinem „Samen" (unspezifiziert) für alle Geschlechter. Das Zeichen ist die Beschneidung (17,10-11); Ismael empfängt es (17,23). Dreischluss: Zeichen = Bundeszugehörigkeit → Ismael im Bund. Der ICC räumt die Inkonsistenz eines Ausschlusses ausdrücklich ein.',
  },
  {
    tier: 'stone',
    h: '1.2 — Die Vav-Frage (1. Mose 17,21)',
    body: 'Das Vav (ו) bedeutet je nach Kontext „und" oder „aber". YLT liest „and"; die ISV lässt Isaak hinzutreten; der Samaritanische Pentateuch liest explizit „And My covenant with Yesaahq". Der Kontext (17,23, Ismaels Beschneidung) erzwingt „und". Maimonides’ exklusive Lesart ist spät.',
  },
  {
    tier: 'stone',
    h: '1.3 — Die Definition „großes Volk" (das Herzstück)',
    body: '17,20 verheißt gôy gādôl; 5. Mose 4,6-8 definiert: weise, Gott nahe, gerechte Gesetze. Größe = Gottesnähe + Gesetz, nicht Zahl oder Imperium. Vor-islamisches Arabien war heidnisch → erst Muhammad ﷺ erfüllt die Definition. „Muhammads Ankunft brachte die Erfüllung der Verheißung, Ismael … zu einem großen Volk zu machen."',
  },
  {
    tier: 'stone',
    h: '1.4 — Zwölf Fürsten & die Gesetzgeber-Brücke',
    body: 'Die nesiʾim (1. Mose 25,13-16) spiegeln Israels zwölf Stämme. Israels Zwölf wurden zum Volk unter Mose; Ismaels Zwölf zum großen Volk unter Muhammad ﷺ. Ein großes Volk braucht einen Gesetzgeber — das ist die Brücke zu Buch 3.',
  },
  {
    tier: 'stone',
    h: '1.5 — Das Buch der Jubiläen (vor-islam. jüd. Zeuge)',
    body: 'Jubiläen (≥100 v. Chr.): Abraham ruft alle Nachkommen — Ismael und seine zwölf, Isaak und zwei, Keturas sechs —, verpflichtet sie zur Beschneidung „gemäß dem Bund" und betet, dass Isaak und Ismael ein „erwähltes Volk in alle Zeitalter" seien. Ein inklusiver Bund, jüdisch bezeugt vor dem Islam.',
  },
  {
    tier: 'stone',
    h: '1.6 — Der koranische Rahmen',
    body: 'Das Gebet Abrahams und Ismaels beim Bau der Kaaba: „Unser Herr, erwecke unter ihnen einen Gesandten aus ihrer Mitte" (2,127-129); 2,128 bittet um eine „ummah muslimah". Der Koran verankert die Verheißung an Ismaels Ort und Linie.',
  },
  {
    tier: 'stone',
    h: '1.7 — Der Opfersohn: Ismael als „einziger Sohn"',
    body: '1. Mose 22,2 nennt den Sohn „yeḥid" (einzig). Arithmetik: Abraham 86 (16,16) / 100 (21,5) → Ismael 14 Jahre älter, mit 13 beschnitten (17,25). Vierzehn Jahre war Ismael der einzige Sohn; Isaak war nie „einzig". Eine chronologische Re-Anordnung; Rashi: „kein Früher und Später in der Tora".',
  },
  {
    tier: 'stone',
    h: '1.8 — Die Maimonides-Falle zertrümmert',
    body: 'Maimonides: großes Volk = Zahl (Dtn 11,23). Widerlegung mit eigenen Leuten: 2. Mose 32,10 (Gott macht MOSES zum großen Volk nach dem goldenen Kalb — keine Zahl); Ibn Ezra („die den Herrn fürchten"); Benson („Gerechtigkeit der Gesetze, nicht Pomp"); Siftei Chakhamim (rechtschaffenes Verhalten). Die Zange schließt sich.',
  },
  {
    tier: 'stone',
    h: '1.9 — Der übertragbare Bund (drei Prämissen)',
    body: 'P1: 17,9-10 — Bund mit „Nachkommen" (Plural). P2: 5. Mose 32,21 — „Nicht-Volk … törichte Nation". P3: Mt 21,43 — „genommen … einem Volk gegeben, das Früchte bringt"; Mt 3,9 — Abraham aus Steinen Kinder. Präzedenz: das Priestertum wanderte nach dem goldenen Kalb (4. Mose 3,12; 1. Sam 2,30). Erwählung ist an Frucht gebunden, nicht an Blut.',
  },
  {
    tier: 'stone',
    h: '1.10 — Externe Zeugen: Josephus & Mekka',
    body: 'Josephus (Antiquitates I.12.2 §214): die Araber beschneiden mit 13, „weil Ismael, der Gründer ihrer Nation, in diesem Alter beschnitten wurde"; Ismaels zwölf Söhne = arabische Nation. Und Mekka: vom Götzendienst (360 Idole) zum Tawḥīd in 23 Jahren — die Definition „großes Volk" wird historisch erfüllt.',
  },
  {
    tier: 'stone',
    h: '1.11 — Der Segen ist geistlich (Trost-Logik)',
    body: 'Ismaels Größe wird als Trost für Abraham gegeben (17,18) und als Segen (17,20). Was tröstet einen Propheten? Geistlicher Rang, nicht Macht — die Götzenvölker hatten Macht und waren geistlich tot. Also ist „großes Volk" hier zwingend geistlich zu lesen.',
  },
  {
    tier: 'stone',
    h: '1.12 — Das Chumash-Eingeständnis',
    body: 'Ein jüdischer Chumash-Kommentar gesteht: Ismaels „große Nation" erfüllte sich erst mit dem Aufkommen des Islam im 7. Jahrhundert — rund 2337 Jahre nach der Prophezeiung. Der stärkste externe Beleg, weil er von der Gegenseite kommt.',
  },
  {
    tier: 'stone',
    h: '1.13 — Die Rehabilitierung Ismaels (1. Mose 16,12)',
    body: '„Wildesel" (pere) vs. „fruchtbar" (parah, wiederholt 17,20); „gegen jedermann" vs. „mit jedermann" (ein Konsonant; Samaritanus: „Seine Hand wird mit jedermann sein … er wird unter all seinen Brüdern wohnen"). Rabbinerin Nancy Fuchs Kreimer: die negative Deutung spiegelt den sozialen Kontext der Autoren, nicht den Text.',
  },
  {
    tier: 'marble',
    h: '1.14 — Juxtaposition als Verfälschungs-Indiz',
    body: 'Das widersprüchliche Ismael-Bild (gesegnet/im Bund vs. „verstoßen", Gen 21,10) lässt sich als redaktioneller Bruch lesen — ein Tampering-Indiz (vgl. Koran 4,82). Setzt Redaktions-/Dokumentenkritik (Friedman, Gen-15) voraus; daher nur sekundär.',
  },
  {
    tier: 'marble',
    h: '1.15 — Gen 12,3 + Ṣalawāt (devotional, kein Beweis)',
    body: '„Die dich segnen, segne ich" (1. Mose 12,3) und die Ṣalawāt der Muslime auf Ibrāhīm im täglichen Gebet bilden eine devotionale Resonanz. Ehrlich markiert: schön, aber kein Schriftbeweis — und nicht im Quellbuch als solcher geführt.',
  },
]

export const abrahamVernetzung = [
  { ziel: 'Das Fundament', text: 'Die gesegnete, legitime Linie ist der erste Baustein — der Bund (3,81) und das Gebet Abrahams (2,127-129).' },
  { ziel: 'Buch 3 — Prophet wie Mose', text: 'Ein „großes Volk" (Dtn 4) braucht einen Gesetzgeber — „aus der Mitte ihrer Brüder" (5. Mose 18,18).' },
  { ziel: 'Buch 4 — Arabische Prophezeiungen', text: 'Kedar und Paran — Ismaels Sohn und Wohnort — werden zum Schauplatz der Prophezeiung.' },
  { ziel: 'Verteidigung — Falscher Prophet?', text: 'Mt 21,43 („Früchte") ist derselbe Test, mit dem die Verteidigung Paulus misst; das Priestertum = die Abrogations-Mechanik.' },
]

export const abrahamGleicheMassstaebe =
  'Akzeptiert man 5. Mose 4,6-8 als Definition von „großes Volk" — Gottesnähe und Gesetz —, dann erfüllt der Islam sie. Reduziert man „großes Volk" auf Demografie, widerspricht man derselben Tora. Diese Zange ist der Sieg. Und das Chumash-Eingeständnis liefert die Gegenseite gleich selbst: Ismaels große Nation kam mit dem Islam. Wer Isaaks Segen geistlich liest und Ismaels gleichlautenden Segen bloß demografisch, misst mit zweierlei Maß.'
