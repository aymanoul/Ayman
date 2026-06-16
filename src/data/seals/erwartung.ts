import type { Beleg } from '../types'

// ---------------------------------------------------------------------------
// SIEGEL VII — Jüdische Erwartung · Gleiche Maßstäbe (الميزان · al-mīzān, the
// Balance). The capstone: one scale, one set of weights, for Moses, Jesus and
// Muhammad ﷺ alike. The Torah sets the tests of a true prophet (Deut 18: his
// word comes true; Deut 13: he turns no one to other gods) and the Jews awaited
// three figures (Messiah · Elijah · the Prophet, John 1,21). Weighed evenly —
// without special pleading — the recurring double standards fall away and the
// evidence of the seven seals is allowed, at last, to speak.
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

export const erwartungThese =
  'Jedes Siegel ruhte auf einer einzigen Forderung: lies beide Schriften nach denselben Regeln, wäge beide Anwärter auf derselben Waage (al-mīzān). Die Tora nennt selbst die Prüfsteine eines wahren Propheten — sein Wort trifft ein (5. Mose 18), er führt zu keinem anderen Gott (5. Mose 13) — und die Juden erwarteten drei Gestalten: den Messias, Elia und „den Propheten" (Joh 1,21). Legt man Jesus und Muhammad ﷺ auf eine Waage, mit einem Satz Gewichte: Was den einen beweist, muss den anderen beweisen dürfen; was den einen ausschließt, muss den anderen ausschließen. Gleich gewogen, neigt sich die Waage nicht von Muhammad weg — sie neigt sich zu ihm hin.'

export const erwartungSteps: Step[] = [
  {
    n: 'I',
    h: 'Die eine Waage',
    body: 'al-mīzān — die Waage. Ein Satz Gewichte für alle: kein Sondertarif für die eine, kein Sonderstrenge für die andere Seite. „Haltet das Gewicht in Gerechtigkeit und mindert die Waage nicht" (55,9). Erst die gleiche Waage macht aus Behauptung Beweis.',
  },
  {
    n: 'II',
    h: 'Die Prüfsteine der Tora',
    body: 'Die Tora prüft einen Propheten an zwei Steinen: Trifft sein Wort ein? (18,21-22) Und führt er zu einem anderen Gott — oder zum Einen? (13,1-4) Nicht ein neues Gesetz disqualifiziert (Mose brachte eines), sondern der Ruf zu fremden Göttern. Muhammad ﷺ rief zum einen Gott Abrahams.',
  },
  {
    n: 'III',
    h: 'Die drei Erwartungen',
    body: 'Das Judentum erwartete nicht eine, sondern drei Gestalten: den Messias, Elia und „den Propheten" wie Mose (Joh 1,21; vgl. 1QS 9,11 aus Qumran). Selbst Johannes der Täufer verneinte, „der Prophet" zu sein. Der dritte Platz blieb offen — und sein Maßstab ist „wie Mose" (Siegel II).',
  },
  {
    n: 'IV',
    h: 'Die doppelten Maßstäbe',
    body: 'Immer wieder dasselbe Muster: Was für Jesus großzügig gilt, wird Muhammad ﷺ streng verweigert. Die Schrift gilt als Beweis — bis sie ihn stützt; das Sinnbild ist erlaubt — außer bei ihm. Nimmt man die Gewichte gleich, fällt das Muster, und die sieben Siegel dürfen sprechen.',
  },
]

export const erwartungBelege: Record<string, Beleg> = {
  // ---- Test of a prophet: the word comes true ----
  deut1822: {
    typ: 'bibel',
    kurz: 'Trifft das Wort, das der Prophet im Namen des HERRN redet, nicht ein, so ist es nicht von Gott.',
    original:
      'אֲשֶׁר יְדַבֵּר הַנָּבִיא בְּשֵׁם יְהוָה וְלֹא יִהְיֶה הַדָּבָר וְלֹא יָבֹא הוּא הַדָּבָר אֲשֶׁר לֹא דִבְּרוֹ יְהוָה',
    sprache: 'he',
    translit:
      'ʾăšer yᵉdabbēr ha-nāvîʾ bᵉ-šēm YHWH wᵉ-lōʾ yihyeh ha-dāvār wᵉ-lōʾ yāvōʾ, hûʾ ha-dāvār ʾăšer lōʾ dibbᵉrô YHWH',
    uebersetzung:
      '„Wenn der Prophet im Namen des HERRN redet und das Wort trifft nicht ein und kommt nicht, so ist es ein Wort, das der HERR nicht geredet hat." — Der erste Prüfstein: das eingetroffene Wort (vgl. Daniels Zeitfenster, Siegel V).',
    fundstelle: '5. Mose (Deuteronomium) 18,22',
    status: 'Prüfstein I — erfülltes Wort',
    kern: 'בְּשֵׁם יְהוָה',
  },

  // ---- Test of a prophet: not toward other gods ----
  deut132: {
    typ: 'bibel',
    kurz: 'Auch wenn das Zeichen eintrifft — sagt er „folgt anderen Göttern", höre nicht auf ihn.',
    original:
      'וְאָמַר נֵלְכָה אַחֲרֵי אֱלֹהִים אֲחֵרִים אֲשֶׁר לֹא יְדַעְתָּם וְנָעָבְדֵם לֹא תִשְׁמַע אֶל דִּבְרֵי הַנָּבִיא הַהוּא',
    sprache: 'he',
    translit:
      'wᵉ-ʾāmar nēlᵉḵāh ʾaḥărê ʾĕlōhîm ʾăḥērîm ʾăšer lōʾ yᵉdaʿtām wᵉ-nāʿovdēm, lōʾ tišmaʿ ʾel-divrê ha-nāvîʾ ha-hûʾ',
    uebersetzung:
      '„… und sagt: ‚Lasst uns anderen Göttern nachfolgen‘ … so höre nicht auf die Worte dieses Propheten." — Der zweite Prüfstein: der wahre Prophet führt zum einen Gott, nicht zu Götzen. Genau das tat Muhammad ﷺ.',
    fundstelle: '5. Mose (Deuteronomium) 13,3-4',
    status: 'Prüfstein II — kein anderer Gott',
    kern: 'אֱלֹהִים אֲחֵרִים',
  },

  // ---- The prophet like Moses — listen to him (recap) ----
  deut1815: {
    typ: 'bibel',
    kurz: 'Einen Propheten wie mich, aus deinen Brüdern — auf ihn sollt ihr hören.',
    original: 'נָבִיא מִקִּרְבְּךָ מֵאַחֶיךָ כָּמֹנִי יָקִים לְךָ יְהוָה אֱלֹהֶיךָ אֵלָיו תִּשְׁמָעוּן',
    sprache: 'he',
    translit: 'nāvîʾ miqqirbᵉḵā mē-ʾaḥeḵā kāmōnî yāqîm lᵉḵā YHWH ʾĕlōheḵā, ʾēlāw tišmāʿûn',
    uebersetzung:
      '„Einen Propheten aus deiner Mitte, aus deinen Brüdern, wie mich, wird dir der HERR erwecken; auf ihn sollt ihr hören." — Der offene dritte Platz der Erwartung (Siegel II).',
    fundstelle: '5. Mose (Deuteronomium) 18,15',
    kern: 'אֵלָיו תִּשְׁמָעוּן',
  },

  // ---- The three expectations (recap, Greek) ----
  john121: {
    typ: 'bibel',
    kurz: 'Bist du der Prophet? — Nein. Drei getrennte Erwartungen: Messias, Elia, der Prophet.',
    original: 'ὁ προφήτης εἶ σύ; καὶ ἀπεκρίθη· οὔ',
    sprache: 'grc',
    translit: 'ho prophḗtēs ei sý? kai apekríthē: oú',
    uebersetzung:
      '„Bist du der Prophet? Und er antwortete: Nein." Die Priester fragen Johannes den Täufer drei getrennte Gestalten ab — den Christus, Elia und „den Propheten". Der dritte Platz war eigen und offen.',
    fundstelle: 'Johannes 1,21 · vgl. 1,25; 7,40',
    kern: 'ὁ προφήτης',
  },

  // ---- The Balance set up by God ----
  q5507: {
    typ: 'quran',
    kurz: 'Er stellte die Waage auf — überschreitet nicht das Maß, mindert die Waage nicht.',
    original:
      'وَالسَّمَاءَ رَفَعَهَا وَوَضَعَ الْمِيزَانَ ۝ أَلَّا تَطْغَوْا فِي الْمِيزَانِ ۝ وَأَقِيمُوا الْوَزْنَ بِالْقِسْطِ وَلَا تُخْسِرُوا الْمِيزَانَ',
    sprache: 'ar',
    translit:
      'wa-s-samāʾa rafaʿahā wa-waḍaʿa l-mīzān · allā taṭghaw fī l-mīzān · wa-aqīmū l-wazna bi-l-qisṭi wa-lā tukhsirū l-mīzān',
    uebersetzung:
      '„Und den Himmel hat Er erhoben und die Waage aufgestellt, damit ihr im Wägen nicht das Maß überschreitet. So haltet das Gewicht in Gerechtigkeit und mindert die Waage nicht." — al-mīzān: das Bild dieses Siegels.',
    fundstelle: 'Sure 55 (ar-Raḥmān), Verse 7–9',
    kern: 'الْمِيزَانَ',
  },

  // ---- Messengers sent with the Book and the Balance ----
  q5725: {
    typ: 'quran',
    kurz: 'Wir sandten die Gesandten mit dem Buch und der Waage, damit die Menschen Gerechtigkeit üben.',
    original:
      'لَقَدْ أَرْسَلْنَا رُسُلَنَا بِالْبَيِّنَاتِ وَأَنزَلْنَا مَعَهُمُ الْكِتَابَ وَالْمِيزَانَ لِيَقُومَ النَّاسُ بِالْقِسْطِ',
    sprache: 'ar',
    translit: 'laqad arsalnā rusulanā bi-l-bayyināt wa-anzalnā maʿahumu l-kitāba wa-l-mīzāna li-yaqūma n-nāsu bi-l-qisṭ',
    uebersetzung:
      '„Wir haben Unsere Gesandten mit den klaren Beweisen gesandt und mit ihnen das Buch und die Waage herabgesandt, damit die Menschen für die Gerechtigkeit eintreten." — Buch und Waage gehören zusammen: Beleg und gerechtes Maß.',
    fundstelle: 'Sure 57 (al-Ḥadīd), Vers 25',
    kern: 'الْكِتَابَ وَالْمِيزَانَ',
  },

  // ---- Bring your proof ----
  q2111: {
    typ: 'quran',
    kurz: 'Sag: Bringt euren Beweis vor, wenn ihr wahrhaftig seid!',
    original: 'تِلْكَ أَمَانِيُّهُمْ قُلْ هَاتُوا بُرْهَانَكُمْ إِن كُنتُمْ صَادِقِينَ',
    sprache: 'ar',
    translit: 'tilka amāniyyuhum, qul hātū burhānakum in kuntum ṣādiqīn',
    uebersetzung:
      '„Das sind ihre Wünsche. Sag: Bringt euren Beweis vor (hātū burhānakum), wenn ihr wahrhaftig seid!" — Der Koran selbst verlangt Beweis statt Wunsch — die Haltung dieser Bibliothek.',
    fundstelle: 'Sure 2 (al-Baqara), Vers 111',
    kern: 'هَاتُوا بُرْهَانَكُمْ',
  },

  // ---- No distinction between the messengers ----
  q384: {
    typ: 'quran',
    kurz: 'Wir machen keinen Unterschied zwischen den Gesandten — und Ihm sind wir ergeben.',
    original: 'وَمَا أُوتِيَ مُوسَىٰ وَعِيسَىٰ وَالنَّبِيُّونَ مِن رَّبِّهِمْ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِّنْهُمْ وَنَحْنُ لَهُ مُسْلِمُونَ',
    sprache: 'ar',
    translit: 'wa-mā ūtiya Mūsā wa-ʿĪsā wa-n-nabiyyūna min rabbihim, lā nufarriqu bayna aḥadin minhum, wa-naḥnu lahu muslimūn',
    uebersetzung:
      '„… und an das, was Mose und Jesus und die Propheten von ihrem Herrn empfingen. Wir machen keinen Unterschied zwischen irgendeinem von ihnen, und Ihm sind wir ergeben." — Eine Waage für alle Gesandten.',
    fundstelle: 'Sure 3 (Āl ʿImrān), Vers 84',
    kern: 'لَا نُفَرِّقُ',
  },

  // ---- Source: the Jewish criteria & the threefold expectation ----
  kriterien: {
    typ: 'quelle',
    kurz: 'Jüdische Prüfsteine eines Propheten — und die Erwartung dreier Gestalten.',
    uebersetzung:
      'Maimonides (Mishne Tora, Jesodej ha-Tora 7–10) nennt die Kennzeichen eines wahren Propheten: untadeliger Charakter, das eintreffende Wort, Treue zum Eingottglauben der Tora. Die Erwartung mehrerer Endzeit-Gestalten ist gut bezeugt: die Gemeinderegel von Qumran (1QS 9,11) erwartet „bis ein Prophet kommt und die Gesalbten Aarons und Israels"; Johannes 1,21 fragt Messias, Elia und „den Propheten" getrennt ab. Der „Prophet wie Mose" war ein eigener, offener Platz.',
    fundstelle: 'Maimonides, Jesodej ha-Tora 7–10 · 1QS 9,11 (Qumran) · Joh 1,21',
  },

  // ---- Source: the catalogue of double standards ----
  doppelmass: {
    typ: 'quelle',
    kurz: 'Dieselbe Regel, zweierlei Anwendung — das wiederkehrende Muster der Einwände.',
    uebersetzung:
      'Quer durch die Siegel kehrt ein Muster wieder: die Bibel gilt als Beweis, bis sie Muhammad stützt — dann heißt sie „verfälscht" (Fundament). Isaaks Segen ist „geistlich", Ismaels gleichlautender Segen „bloß zahlenmäßig" (Siegel I). „Von Seir" deutet man aufs Christentum, „vom Paran" überhört man (Siegel III). Das Hohelied liest die Kirche allegorisch, doch maḥamaddīm müsse wörtlich bleiben (Siegel IV). Gleiche Maßstäbe heißt: die Regel, die man für die eine Seite zulässt, auch der anderen zugestehen — und umgekehrt.',
    fundstelle: 'Methodik · vgl. Fundament · Siegel I, III, IV, VI',
  },
}

// ---- Exhibit 1: the Torah's touchstones (reuses .merkmale list) -------------
export const pruefsteine = {
  intro:
    'Die Tora nennt selbst die Prüfsteine eines wahren Propheten. Legt man sie unvoreingenommen an Muhammad ﷺ an:',
  tests: [
    { test: 'Sein Wort trifft ein', ref: '5. Mose 18,21-22', sinn: 'Daniels Zeitfenster, der Fall des geteilten Rom, die Ausbreitung — eingetroffen (Siegel V).' },
    { test: 'Er führt zu keinem anderen Gott', ref: '5. Mose 13,1-4', sinn: 'Strenger Eingottglaube (tauḥīd) — er zerbrach die Götzen, statt zu ihnen zu rufen.' },
    { test: 'Er spricht im Namen des HERRN', ref: '5. Mose 18,19', sinn: 'Jede Sure bis auf eine beginnt „Im Namen Gottes, des Erbarmers".' },
    { test: 'Er bestätigt die früheren Propheten', ref: 'vgl. Mt 7,15-20', sinn: 'Er ehrt Mose und Jesus als Gesandte, reinigt Jesus vom Vorwurf des Betrugs.' },
  ],
  pointe: 'An den eigenen Prüfsteinen der Tora gemessen, besteht er — Stein für Stein.',
}

// ---- Exhibit 2: the balance & the double standards --------------------------
export const zweierlei = {
  intro:
    'Die Waage zeigt das Muster: dieselbe Regel, zweierlei Anwendung. Links, was man für Jesus großzügig gelten lässt; rechts, was man Muhammad ﷺ mit derselben Regel verweigert.',
  faelle: [
    { standard: 'Die Schrift', jesus: 'Man zitiert die Bibel als Beweis.', muhammad: 'Man ruft „Fälschung", sobald sie ihn stützt.', siegel: 'Fundament' },
    { standard: 'Abrahams Segen', jesus: 'Isaaks Segen gilt als geistlich.', muhammad: 'Ismaels gleichlautender Segen sei „bloß zahlenmäßig".', siegel: 'Siegel I' },
    { standard: '„Wie Mose"', jesus: '5. Mose 18 gilt als in ihm erfüllt.', muhammad: 'Das Kriterium „wie Mose" (34,10) wird übergangen.', siegel: 'Siegel II' },
    { standard: 'Die Berge', jesus: '„Von Seir" deutet man aufs Christentum.', muhammad: '„Vom Berg Paran" bleibt unbeachtet.', siegel: 'Siegel III' },
    { standard: 'Das Sinnbild', jesus: 'Das Hohelied liest die Kirche allegorisch.', muhammad: 'maḥamaddīm müsse dagegen wörtlich bleiben.', siegel: 'Siegel IV' },
    { standard: 'Der Paraklet', jesus: 'Joh 14,26 („der Geist") entscheidet sofort.', muhammad: 'Die übrige Beschreibung soll nicht zählen.', siegel: 'Siegel VI' },
    { standard: 'Spätere Schrift', jesus: 'Dass das Neue Testament nach Jesus entstand, stört nicht.', muhammad: 'Dass der Koran später kam, gilt als Einwand.', siegel: '—' },
  ],
  pointe:
    'Sieben Fälle, ein Muster. Legt man auf beide Schalen dieselben Gewichte, steht die Waage still — und die Belege entscheiden.',
}

// ---- Exhibit 3: the rope of strands (synthesis, reuses .netz) ---------------
export const straenge = {
  intro: 'Kein Siegel trägt allein. Verwoben bilden sie ein Seil aus vielen Strängen — das ist, was auf der Waage liegt:',
  items: [
    { siegel: 'Fundament', was: 'Der prüfbare Anspruch (7,157) und die Leseregeln.' },
    { siegel: 'Siegel I', was: 'Die gesegnete, legitime Linie Ismaels.' },
    { siegel: 'Siegel II', was: 'Der Prophet „wie Mose", aus den Brüdern.' },
    { siegel: 'Siegel III', was: 'Paran, Kedar, Bakka — die Orte in Arabien.' },
    { siegel: 'Siegel IV', was: 'maḥamaddīm — Wurzel und Klang des Namens.' },
    { siegel: 'Siegel V', was: 'Daniels Zeitfenster — nach dem geteilten Rom.' },
    { siegel: 'Siegel VI', was: 'Der Paraklet / Aḥmad — der Gepriesene.' },
  ],
  pointe: 'Ein einzelner Strang mag sich biegen; das Seil aus sieben trägt.',
}

export const erwartungKonter: KonterItem[] = [
  {
    tier: 'stone',
    einwand: '„Ihr beruft euch auf ‚gleiche Maßstäbe‘ nur, wenn es euch nützt."',
    konter:
      'Die Regel schneidet in beide Richtungen, und wir tragen das: Wir lehnen das Barnabas-Evangelium ab (Fundament), wir markieren die Grenzen des Parakleten und sagen selbst, dass keine Handschrift „períklytos" liest (Siegel VI), wir nennen das Hohelied einen Faden, keinen Pfeiler (Siegel IV). Gleiches Maß heißt gleiches Maß — auch gegen schwache eigene Argumente.',
    belegId: 'doppelmass',
  },
  {
    tier: 'stone',
    einwand: '„5. Mose 13 schließt Muhammad aus — er brachte ein neues Gesetz."',
    konter:
      'Der Prüfstein von 5. Mose 13 ist der Ruf zu ANDEREN GÖTTERN, nicht ein neues Gesetz. Mose selbst brachte ein Gesetz; der „Prophet wie Mose" bringt eines (Siegel II). Muhammad ﷺ rief zum einen Gott Abrahams, Moses und Jesu und zerbrach die Götzen — das genaue Gegenteil dessen, wovor 13,3 warnt. Der Stein trifft ihn nicht; er besteht ihn.',
    belegId: 'deut132',
  },
  {
    tier: 'stone',
    einwand: '„Ein wahrer Prophet darf die Tora nie ändern — sie ist ewig."',
    konter:
      'Dann scheitert auch Jesus an diesem Maß: die Kirche ließ Beschneidung, Sabbat und Speisegebote fallen, obwohl er sagte, er sei „nicht gekommen aufzulösen" (Mt 5,17). Misst man gleich, kann der Einwand nicht allein Muhammad treffen. Ein Prophet „wie Mose" bringt definitionsgemäß eine neue Ordnung — sonst wäre „wie Mose" leer.',
    belegId: 'deut1815',
  },
  {
    tier: 'stone',
    einwand: '„Die jüdische Erwartung erfüllte sich ganz in Jesus — mehr ist nicht offen."',
    konter:
      'Die Erwartung kannte drei Gestalten, nicht eine: Messias, Elia und „den Propheten" (Joh 1,21; 1QS 9,11). Johannes der Täufer verneint ausdrücklich, „der Prophet" zu sein. Selbst wenn man den Messias-Platz Jesus zuschreibt, bleibt der Platz „des Propheten wie Mose" offen — und sein Maßstab führt nach Arabien (Siegel II).',
    belegId: 'john121',
  },
  {
    tier: 'stone',
    einwand: '„Nach den letzten Propheten Israels war die Prophetie versiegelt."',
    konter:
      'Dann fielen Johannes der Täufer und Jesus selbst unter dasselbe Verdikt — beide kamen nach Maleachi. Das „keine Propheten mehr" kann nicht Muhammad ﷺ ausschließen und zugleich Jesus zulassen. Gleich gewogen, ist „die Prophetie endete" kein Maß, sondern ein doppelter Maßstab.',
  },
  {
    tier: 'marble',
    einwand: '„‚Gleiche Maßstäbe‘ ist nur Rhetorik — es beweist nichts Positives."',
    konter:
      'Stimmt, und das ist gewollt: al-mīzān ist nicht selbst der Beweis, sondern die Waage, auf der die Beweise liegen. Ihr Werk ist, das Sonderplädoyer zu entfernen, damit die Belege der Siegel I–VI ungehindert sprechen. Das positive Gewicht kommt von ihnen; dieses Siegel sorgt nur dafür, dass gerecht gewogen wird.',
  },
]

export const erwartungScholar: ScholarItem[] = [
  {
    tier: 'stone',
    h: '7.1 — al-mīzān: das Prinzip der einen Waage',
    body: 'Der Koran macht die Waage zum Bild der Gerechtigkeit: Gott „stellte die Waage auf … mindert die Waage nicht" (55,7-9); Er sandte „das Buch und die Waage, damit die Menschen Gerechtigkeit üben" (57,25); und er verlangt Beweis statt Wunsch: „Bringt euren Beweis vor" (2,111). Eine Waage, ein Satz Gewichte — für Mose, Jesus und Muhammad ﷺ gleich (3,84).',
  },
  {
    tier: 'stone',
    h: '7.2 — Die Prüfsteine der Tora',
    body: '5. Mose 18,21-22: der wahre Prophet wird am eintreffenden Wort erkannt. 5. Mose 13,1-4: selbst ein eingetroffenes Zeichen rechtfertigt keinen, der zu „anderen Göttern" ruft. Zwei Steine: Erfüllung und reiner Eingottglaube. Beide bestätigt Muhammad ﷺ — er kündete Eintreffendes und rief allein zum einen Gott.',
  },
  {
    tier: 'marble',
    h: '7.3 — 5. Mose 13 richtig gelesen',
    body: 'Der Einwand „neues Gesetz = falscher Prophet" verwechselt die Prüfung. 13,3 warnt vor dem Ruf zu fremden Göttern, nicht vor neuer Gesetzgebung — Mose selbst gab Gesetz. Ein Prophet „wie Mose" (18,18) bringt notwendig eine neue Ordnung. Maßstab ist die Richtung des Glaubens (zum Einen oder weg von ihm), nicht die Neuheit der Vorschrift.',
  },
  {
    tier: 'stone',
    h: '7.4 — Die drei Erwartungen',
    body: 'Die Endzeit-Erwartung des Zweiten Tempels war mehrgestaltig: 1QS 9,11 (Qumran) erwartet „einen Propheten und die Gesalbten Aarons und Israels"; Joh 1,19-21 fragt Messias, Elia und „den Propheten" getrennt ab; 7,40-41 unterscheidet „der Prophet" und „der Christus". „Der Prophet wie Mose" war ein eigener, unbesetzter Platz.',
  },
  {
    tier: 'stone',
    h: '7.5 — Die doppelten Maßstäbe, katalogisiert',
    body: 'Sieben wiederkehrende Asymmetrien: Schrift als Beweis vs. „Fälschung" (Fundament); Isaaks Segen geistlich vs. Ismaels zahlenmäßig (I); „wie Mose" erfüllt vs. übergangen (II); Seir gedeutet vs. Paran überhört (III); Hohelied allegorisch vs. maḥamaddīm wörtlich (IV); 14,26 entscheidet vs. die Beschreibung zählt nicht (VI). Gleich gewogen, fallen sie.',
  },
  {
    tier: 'marble',
    h: '7.6 — Was die Waage leistet — und was nicht',
    body: 'al-mīzān beweist nichts aus sich; sie ist die Methode, nicht die Materie. Ihre Aufgabe ist, Sonderstrenge und Sondergroßzügigkeit zu entfernen, damit die Belege gleich zählen. Gleiches Maß verpflichtet auch zur Selbstkritik (schwache Belege bleiben draußen). So gelesen, ist dieses Siegel das Gewissen der übrigen — kein neuer Beweis, sondern ihre faire Wägung.',
  },
]

export const erwartungVernetzung = [
  { ziel: 'Das Fundament', text: 'al-mīzān ist die Regel, die das Fundament aufstellte — hier wird sie zum eigenen Siegel.' },
  { ziel: 'Siegel II — Prophet wie Mose', text: 'Die drei Erwartungen und der offene Platz „des Propheten" werden hier auf die Waage gelegt.' },
  { ziel: 'Verteidigung — Falscher Prophet?', text: 'Das nächste Siegel beantwortet die Anklagen — diese Waage liefert ihm den Maßstab.' },
]

export const erwartungGleicheMassstaebe =
  'Dieses Siegel ist die Waage selbst. Ein Satz Gewichte — für Mose, Jesus und Muhammad ﷺ gleich. Wer den einen großzügig und den anderen streng wägt, hat die Waage bereits verlassen. Legt sie eben: dann darf die Schrift Beweis sein, wo sie für beide spricht; dann gilt das Sinnbild für beide oder für keinen; dann zählt das eintreffende Wort und der eine Gott. Gerecht gewogen, dürfen die sieben Siegel endlich sprechen — und sie sprechen.'
