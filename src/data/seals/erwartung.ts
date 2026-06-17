import type { Beleg } from '../types'

// ---------------------------------------------------------------------------
// SIEGEL VII — Jüdische Erwartung & gleiche Maßstäbe (الميزان · al-mīzān, the
// Balance). The capstone — the SCHLUSS-STEIN — that does two things (SPEC §6.7):
//   (1) it shows the Jews ACTIVELY EXPECTED the Arabian prophet — they migrated
//       into the lifeless desert around Medina BEFORE Islam, because their own
//       scriptures (Isaiah 42/21, Daniel) had given them place and time;
//   (2) it exposes the DOUBLE STANDARD — impossible weights laid on Muhammad ﷺ,
//       blind leniency toward Jesus. On equal weights there is exactly one
//       fulfiller — and the davidic Messiah narrative fails God's own test
//       (Deut 18,22). It is the META-EBENE: "with which measure do you weigh?"
//
// This file KEEPS the al-mīzān balance + the Doppelmaß-Katalog (zweierlei) and
// the Tora touchstones (pruefsteine), and ADDS Teil A (the active expectation),
// the Banū-Qurayẓa defence, and the davidic-narrative deconstruction.
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
  'Das ist der Schluss-Stein. Er tut zweierlei. Erstens: Die Juden erwarteten den arabischen Propheten aktiv — sie wanderten vor dem Islam in die lebensfeindliche Wüste um Medina, weil ihre eigenen Schriften (Jesaja 42 und 21, Daniel) ihnen Ort und Zeit verrieten. Zweitens: Er entlarvt die Doppelmoral — an die Belege für Muhammad ﷺ legt der Kritiker unmöglich hohe Maßstäbe, während er für Jesus vage, aus dem Kontext gerissene, sich widersprechende „Prophezeiungen" blind akzeptiert. Auf gleichen Maßstäben (al-mīzān, die Waage) gibt es genau einen Erfüller — und das davidische Messias-Narrativ besteht Gottes eigenen Test nicht (5. Mose 18,22). Siegel 1–6 liefern die Beweise; Siegel 7 zieht das Netz zu und nimmt dem Gegner die Methode, mit der er sich herauswinden will. Es ist weniger ein neues Thema als die Meta-Ebene: „Mit welchem Maßstab misst du eigentlich?"'

export const erwartungSteps: Step[] = [
  {
    n: 'I',
    h: 'Eine unerklärliche Wanderung',
    body: 'Jüdische Stämme siedelten vor dem Islam mitten in der arabischen Wüste — Medina, Khaybar, Tema, Dedan, Al-Hijr. Arabien war eine der lebensfeindlichsten Regionen der Erde: Dürre, Beduinen-Raubzüge. Warum zog eine wohlhabende, gebildete Bevölkerung freiwillig dorthin? Niemand tut das für Komfort. (Teil A)',
  },
  {
    n: 'II',
    h: 'Sie warteten auf einen Propheten',
    body: 'Sie verhöhnten ihre heidnischen Nachbarn: „Wenn unser Prophet kommt, werden wir euch auslöschen" (Sīra des Ibn Hischām). Rabbi Ibn al-Haybān, zwei Jahre vor der Berufung aus Syrien zugewandert, kündigte sterbend „einen Propheten, dessen Zeit nahe ist … das Land seiner Auswanderung: folgt ihm!" an. Und sie begruben ihre Toten am Berg Sela in Medina (Ṭabarī) — dem Ort aus Jesaja 42,11 (Siegel 3).',
  },
  {
    n: 'III',
    h: 'Sie hatten Karte UND Zeitplan',
    body: 'Jesaja 42 (Kedar, Sela) gab das Wo: Medina (Siegel 3). Jesaja 21 (Beduinisierung der Dedaniter im 3. Jh.) gab das Wann: jetzt aufbrechen — die Migration folgte historisch genau darauf. Daniel (350-Jahre- / Bar-Kochba-Rechnung) gab das Jahr 622. Rabbi Ben Abrahamson rechnet selbst auf 622 und den „wahren Krieger-Messias".',
  },
  {
    n: 'IV',
    h: 'Ablehnung aus Feindschaft, nicht Unwissen',
    body: 'Ṣafiyya bint Ḥuyayy berichtet: ihr Vater und Onkel kehrten von Muhammad ﷺ zurück. „Erkennst du ihn?" — „Ja, nur zu gut." — „Was empfindest du?" — „Feindschaft, Feindschaft, solange ich lebe." Sie erkannten ihn (Koran 2,146: „wie ihre eigenen Söhne"), lehnten ihn aber aus Stolz auf die Abstammung und Vorurteil gegen einen Araber ab.',
  },
  {
    n: 'V',
    h: 'Der vage Jesus-Maßstab',
    body: '„300+ erfüllte Prophezeiungen über Jesus" — doch sie müssen gedehnt werden. Mt 2,15 zitiert „aus Ägypten rief ich meinen Sohn" als Jesus-Prophezeiung — Hosea 11,1 spricht von Israels Exodus (Vergangenheit). Mt 27,9 schreibt eine Prophezeiung Jeremia zu — sie steht aber bei Sacharja. Die zwei Genealogien (Mt 1 vs. Lk 3) sind „beide fantasievoll und einander widersprechend" (Randel Helms). (Teil B)',
  },
  {
    n: 'VI',
    h: 'Der unmögliche Muhammad-Maßstab',
    body: 'Für Muhammad ﷺ liefert die Bibel Eigennamen (Paran, Kedar, Sela, Baca, maḥamaddīm), Geografie, Gesetzgeber-Profil, Zeitachse — und der Kritiker verlangt trotzdem den buchstäblichen Schriftzug „Muhammad". Mit diesem Maßstab bliebe keine einzige Jesus-Prophezeiung stehen. Auf einer ehrlichen Waage (Sprichwort 20,10) bleibt genau ein Erfüller.',
  },
]

export const erwartungBelege: Record<string, Beleg> = {
  // ============================== TEIL B — DIE WAAGE / al-mīzān =============
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
    original:
      'وَمَا أُوتِيَ مُوسَىٰ وَعِيسَىٰ وَالنَّبِيُّونَ مِن رَّبِّهِمْ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِّنْهُمْ وَنَحْنُ لَهُ مُسْلِمُونَ',
    sprache: 'ar',
    translit: 'wa-mā ūtiya Mūsā wa-ʿĪsā wa-n-nabiyyūna min rabbihim, lā nufarriqu bayna aḥadin minhum, wa-naḥnu lahu muslimūn',
    uebersetzung:
      '„… und an das, was Mose und Jesus und die Propheten von ihrem Herrn empfingen. Wir machen keinen Unterschied zwischen irgendeinem von ihnen, und Ihm sind wir ergeben." — Eine Waage für alle Gesandten.',
    fundstelle: 'Sure 3 (Āl ʿImrān), Vers 84',
    kern: 'لَا نُفَرِّقُ',
  },

  // ---- They recognise him as their own sons ----
  q2146: {
    typ: 'quran',
    kurz: 'Die, denen Wir die Schrift gaben, erkennen ihn, wie sie ihre eigenen Söhne erkennen.',
    original:
      'الَّذِينَ آتَيْنَاهُمُ الْكِتَابَ يَعْرِفُونَهُ كَمَا يَعْرِفُونَ أَبْنَاءَهُمْ وَإِنَّ فَرِيقًا مِّنْهُمْ لَيَكْتُمُونَ الْحَقَّ وَهُمْ يَعْلَمُونَ',
    sprache: 'ar',
    translit:
      'alladhīna ātaynāhumu l-kitāba yaʿrifūnahu kamā yaʿrifūna abnāʾahum, wa-inna farīqan minhum la-yaktumūna l-ḥaqqa wa-hum yaʿlamūn',
    uebersetzung:
      '„Diejenigen, denen Wir die Schrift gaben, erkennen ihn, wie sie ihre eigenen Söhne erkennen. Doch ein Teil von ihnen verbirgt die Wahrheit, obwohl sie es wissen." — Erkenntnis, dann Verbergen aus Vorurteil: der Ṣafiyya-Bericht in einem Vers.',
    fundstelle: 'Sure 2 (al-Baqara), Vers 146 · vgl. 6,20',
    kern: 'يَعْرِفُونَهُ',
  },

  // ---- The learned of Israel recognised it ----
  q26197: {
    typ: 'quran',
    kurz: 'Ist es ihnen kein Zeichen, dass die Gelehrten der Kinder Israels es erkannten?',
    original: 'أَوَلَمْ يَكُن لَّهُمْ آيَةً أَن يَعْلَمَهُ عُلَمَاءُ بَنِي إِسْرَائِيلَ',
    sprache: 'ar',
    translit: 'a-wa-lam yakun lahum āyatan an yaʿlamahu ʿulamāʾu banī Isrāʾīl',
    uebersetzung:
      '„Ist es ihnen denn kein Zeichen, dass die Gelehrten der Kinder Israels es (als wahr) erkannten?" — Der Koran beruft sich auf das Wissen jüdischer Gelehrter selbst.',
    fundstelle: 'Sure 26 (asch-Schuʿarāʾ), Vers 197',
    kern: 'عُلَمَاءُ بَنِي إِسْرَائِيلَ',
  },

  // ---- They believe part of the Book, disbelieve part ----
  q285: {
    typ: 'quran',
    kurz: 'Glaubt ihr an einen Teil der Schrift und verleugnet einen anderen?',
    original: 'أَفَتُؤْمِنُونَ بِبَعْضِ الْكِتَابِ وَتَكْفُرُونَ بِبَعْضٍ',
    sprache: 'ar',
    translit: 'a-fa-tuʾminūna bi-baʿḍi l-kitābi wa-takfurūna bi-baʿḍ',
    uebersetzung:
      '„Glaubt ihr denn an einen Teil der Schrift und verleugnet einen anderen Teil?" — Die koranische Fassung von Sprichwort 20,10: kein zweierlei Maß an der eigenen Offenbarung.',
    fundstelle: 'Sure 2 (al-Baqara), Vers 85',
    kern: 'بِبَعْضِ الْكِتَابِ',
  },

  // ============================== DIE PRÜFSTEINE DER TORA ===================
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
      '„Wenn der Prophet im Namen des HERRN redet und das Wort trifft nicht ein und kommt nicht, so ist es ein Wort, das der HERR nicht geredet hat." — Der Todesstoß für das davidische Narrativ: über mehrere Exile traf es nie ein. Das arabische erfüllte jeden Punkt (Siegel V).',
    fundstelle: '5. Mose (Deuteronomium) 18,21-22',
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
    fundstelle: '5. Mose (Deuteronomium) 13,1-4',
    status: 'Prüfstein II — kein anderer Gott',
    kern: 'אֱלֹהִים אֲחֵרִים',
  },

  // ---- Two kinds of weights — abomination ----
  spr2010: {
    typ: 'bibel',
    kurz: 'Zweierlei Gewicht und zweierlei Maß — ein Gräuel für den HERRN, beides.',
    original: 'אֶבֶן וָאֶבֶן אֵיפָה וְאֵיפָה תּוֹעֲבַת יְהוָה גַּם שְׁנֵיהֶם',
    sprache: 'he',
    translit: 'ʾeven wā-ʾeven ʾêfāh wᵉ-ʾêfāh, tôʿăvat YHWH gam šᵉnêhem',
    uebersetzung:
      '„Zweierlei Gewichtstein und zweierlei Maß (Epha) — ein Gräuel für den HERRN sind sie beide." — Das Prinzip der ganzen Waage: ein Satz Gewichte für Jesus und Muhammad ﷺ. Koran 2,85 sagt dasselbe.',
    fundstelle: 'Sprichwörter (Mischlej) 20,10',
    status: 'Das Prinzip — al-mīzān',
    kern: 'אֶבֶן וָאֶבֶן',
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

  // ============================== TEIL A — DIE AKTIVE ERWARTUNG =============
  // ---- Isaiah 42 — the WHERE (Kedar / Sela), recap of Siegel 3 ----
  jes4211: {
    typ: 'bibel',
    kurz: 'Es jauchze die Steppe Kedars, die Bewohner von Sela jubeln vom Gipfel der Berge.',
    original:
      'יִשְׂאוּ מִדְבָּר וְעָרָיו חֲצֵרִים תֵּשֵׁב קֵדָר יָרֹנּוּ יֹשְׁבֵי סֶלַע מֵרֹאשׁ הָרִים יִצְוָחוּ',
    sprache: 'he',
    translit: 'yiśʾû midbār wᵉ-ʿārāyw, ḥăṣērîm tēšēv Qēdār, yārōnnû yōšᵉvê Selaʿ, mē-rōʾš hārîm yiṣwāḥû',
    uebersetzung:
      '„Es sollen die Wüste und ihre Städte ihre Stimme erheben, die Gehöfte, die Kedar bewohnt; jubeln sollen die Bewohner von Sela, vom Gipfel der Berge sollen sie jauchzen." — Kedar = die Söhne Ismaels, Sela ein Ort in Medina: das „Wo". Genau dort begruben die Juden ihre Toten (Ṭabarī).',
    fundstelle: 'Jesaja 42,11 · vgl. Siegel 3',
    kern: 'קֵדָר ... סֶלַע',
  },

  // ---- Isaiah 21 — the WHEN (the Dedanites bedouinise) ----
  jes2113: {
    typ: 'bibel',
    kurz: 'Im Gestrüpp Arabiens müsst ihr nächtigen, ihr Karawanen der Dedaniter.',
    original:
      'מַשָּׂא בַּעְרָב בַּיַּעַר בַּעְרַב תָּלִינוּ אֹרְחוֹת דְּדָנִים ... כִּי מִפְּנֵי חֲרָבוֹת נָדָדוּ',
    sprache: 'he',
    translit: 'maśśāʾ ba-ʿrāv: ba-yaʿar ba-ʿrav tālînû, ʾōrᵉḥôt Dᵉdānîm … kî mippᵉnê ḥărāvôt nādādû',
    uebersetzung:
      '„Lastwort über Arabien: Im Wald (Gestrüpp) in Arabien müsst ihr übernachten, ihr Karawanen der Dedaniter … denn vor den Schwertern sind sie geflohen. Binnen eines Jahres … endet alle Herrlichkeit Kedars" (21,16). — Die Beduinisierung der Dedaniter (3. Jh.) war das Signal: das „Wann". „Herrlichkeit Kedars" endet = Schlacht von Badr (624).',
    fundstelle: 'Jesaja 21,13-17',
    status: 'das „Wann" — Dedaniter-Beduinisierung',
    kern: 'אֹרְחוֹת דְּדָנִים',
  },

  // ---- Hosea 11,1 — Israel's exodus, NOT Jesus ----
  hos111: {
    typ: 'bibel',
    kurz: 'Als Israel jung war, hatte ich es lieb, und aus Ägypten rief ich meinen Sohn.',
    original: 'כִּי נַעַר יִשְׂרָאֵל וָאֹהֲבֵהוּ וּמִמִּצְרַיִם קָרָאתִי לִבְנִי',
    sprache: 'he',
    translit: 'kî naʿar Yiśrāʾēl wā-ʾōhăvēhû, û-mi-Miṣrayim qārāʾtî li-vᵉnî',
    uebersetzung:
      '„Als Israel jung war, gewann ich es lieb, und aus Ägypten rief ich meinen Sohn." — Der Vers blickt zurück auf Israels Exodus (Vergangenheit). Mt 2,15 zitiert ihn als Zukunfts-Prophezeiung über Jesus — der Musterfall des Aus-dem-Kontext-Reißens.',
    fundstelle: 'Hosea 11,1 · vgl. Mt 2,15',
    kern: 'בְּנִי',
  },

  // ---- Mt 27,9 — Jeremiah cited but it's Zechariah ----
  mt279: {
    typ: 'bibel',
    kurz: 'Matthäus schreibt die Prophezeiung „Jeremia" zu — sie steht aber bei Sacharja.',
    original:
      'τότε ἐπληρώθη τὸ ῥηθὲν διὰ Ἰερεμίου τοῦ προφήτου λέγοντος· καὶ ἔλαβον τὰ τριάκοντα ἀργύρια',
    sprache: 'grc',
    translit: 'tóte eplērṓthē tò rhēthèn dià Ieremíou toû prophḗtou légontos: kaì élabon tà triákonta argýria',
    uebersetzung:
      '„Da erfüllte sich, was durch den Propheten Jeremia gesagt ist: Und sie nahmen die dreißig Silberlinge …" — Doch die Stelle steht bei Sacharja 11,12-13, nicht bei Jeremia (und die Details widersprechen Apg 1,18). Eine falsch zugeschriebene, gedehnte „Erfüllung".',
    fundstelle: 'Matthäus 27,9 · vgl. Sacharja 11,12-13',
    kern: 'Ἰερεμίου',
  },

  // ---- Jesus questions the Davidic criterion ----
  mt2241: {
    typ: 'bibel',
    kurz: 'Wie kann der Christus Davids Sohn sein, wenn David ihn „Herr" nennt?',
    original:
      'πῶς οὖν Δαυὶδ ἐν πνεύματι καλεῖ αὐτὸν κύριον λέγων ... εἰ οὖν Δαυὶδ καλεῖ αὐτὸν κύριον, πῶς υἱὸς αὐτοῦ ἐστιν;',
    sprache: 'grc',
    translit: 'pôs oûn Dauìd en pneúmati kaleî autòn kýrion légōn … ei oûn Dauìd kaleî autòn kýrion, pôs huiòs autoû estin?',
    uebersetzung:
      '„Wie nennt David ihn denn im Geist ‚Herr‘ …? Wenn nun David ihn ‚Herr‘ nennt, wie ist er dann sein Sohn?" — Jesus selbst stellt das davidische Abkunfts-Kriterium in Frage. Wer die Davids-Linie zur unverzichtbaren Bedingung macht, widerspricht dem NT.',
    fundstelle: 'Matthäus 22,41-45 · vgl. Ps 110,1',
    kern: 'πῶς υἱὸς αὐτοῦ',
  },

  // ============================== QUELLEN ==================================
  // ---- Source: Ibn al-Haybān — the rabbi's deathbed announcement ----
  ibnAlHayban: {
    typ: 'quelle',
    kurz: 'Rabbi Ibn al-Haybān auf dem Sterbebett: „in Erwartung eines Propheten … folgt ihm!"',
    uebersetzung:
      'Ibn al-Qayyim (Hidāyat al-Ḥayārā, S. 36-37) berichtet von Rabbi Ibn al-Haybān, der zwei Jahre vor Muhammads ﷺ Berufung aus Syrien nach Medina einwanderte. Sterbend sagte er den Stämmen der Banū Quraiẓa und Naḍīr: „Ich verließ das Land von Wein und Brot und kam in dieses Land der Not und des Hungers — in Erwartung eines Propheten, dessen Zeit nahe ist. Dies ist das Land seiner Auswanderung. Folgt ihm, und seid nicht die Letzten!" Ein freiwillig in die Wüste gezogener Rabbi, der den Ort der Hidschra benennt.',
    fundstelle: 'Ibn al-Qayyim, Hidāyat al-Ḥayārā S. 36-37',
  },

  // ---- Source: the Jewish taunt + burial at Sela ----
  ibnHischam: {
    typ: 'quelle',
    kurz: 'Sīra: „Wenn unser Prophet kommt, werden wir euch auslöschen" + Begräbnis am Berg Sela.',
    uebersetzung:
      'Die Sīra des Ibn Hischām hält den Spott der Juden gegen ihre heidnischen Nachbarn fest: „Wenn unser Prophet kommt — dessen Zeit nun naht —, werden wir euch mit ihm vernichten" (vgl. Koran 2,89; Rodinson, Muhammad, S. 143). Aṭ-Ṭabarī (4/413) bezeugt, dass die Juden ihre Toten am Berg Sela in Medina begruben — exakt der Ort aus Jesaja 42,11. Sie kannten Ort und Erwartung.',
    fundstelle: 'Ibn Hischām, Sīra · aṭ-Ṭabarī 4/413 · vgl. Jes 42,11',
  },

  // ---- Source: Safiyya — "enmity as long as I live" ----
  safiyya: {
    typ: 'quelle',
    kurz: 'Ṣafiyya bint Ḥuyayy: ihr Vater erkannte ihn — „Feindschaft, Feindschaft, solange ich lebe."',
    uebersetzung:
      'Ṣafiyya bint Ḥuyayy, die jüdische Frau des Propheten ﷺ, berichtet (Sīra Ibn Hischām II/363): ihr Vater Ḥuyayy und ihr Onkel Abū Yāsir kehrten von Muhammad ﷺ zurück. Onkel: „Ist er es?" Vater: „Ja, bei Gott." — „Erkennst du ihn, bestätigst du ihn?" — „Ja." — „Was empfindest du ihm gegenüber?" — „Feindschaft, Feindschaft, solange ich lebe." Kein Wissensmangel — Vorurteil gegen die arabische Abstammung (Koran 2,146).',
    fundstelle: 'Sīra Ibn Hischām II/363',
  },

  // ---- Source: the jewish settlements of the Hijaz ----
  hidschaz: {
    typ: 'quelle',
    kurz: 'Jüdische Siedlungen quer durch den Hidschaz — und das Rätsel, warum man dorthin zog.',
    uebersetzung:
      'Jüdische Gemeinden lagen quer durch den Hidschaz: Medina, Khaybar (von hebr. ḥeber „Liga/Bund"), Dedan, Al-Hijr, Tema, Ablaq, Yamama, Taif, evtl. Mekka (Zeitlin, The Historical Muhammad S. 78-84; Baron Kap. XVI; Margolis/Marx). Sie hoben Nordarabien fast auf das Niveau von „Arabia Felix" (Baron) — und wurden gerade dadurch Ziel von Beduinen-Raubzügen. Das Rätsel: warum eine wohlhabende, gebildete Bevölkerung freiwillig in die härteste Wüste der Erde zog. Antwort der Quellen: Erwartung des Propheten.',
    fundstelle: 'Zeitlin S. 78-84 · Baron Kap. XVI · Margolis/Marx',
  },

  // ---- Source: Ben Abrahamson — Daniel → 622 → Muḥamud ----
  benAbrahamson: {
    typ: 'quelle',
    kurz: 'Rabbi Ben Abrahamson rechnet selbst auf 622 und den „wahren Krieger-Messias".',
    uebersetzung:
      'Die Beduinisierung der Dedaniter im 3. Jh. (Caskel, Peters, Hoyland, Shuaib) gab das historische „Wann"; die Migration nach Medina folgte unmittelbar. Daniels 350-Jahre- / Bar-Kochba-Rechnung (Siegel 5) zeigt auf das Jahr 622. Rabbi Ben Abrahamson kommt selbst auf 622 und nennt den erwarteten „wahren Krieger-Messias" — Eltern hätten ihr Kind in dieser Hoffnung nach Daniels „Ish ḥamudot" benannt: Muḥamud. (⚠️ moderne rabbinische Einzelstimme — als Illustration, nicht als harter Beweis.)',
    fundstelle: 'Ben Abrahamson · Caskel · Peters · Hoyland · vgl. Daniel 9-12',
  },

  // ---- Source: Banū Qurayẓa — the full defence ----
  qurayza: {
    typ: 'quelle',
    kurz: 'Banū Qurayẓa: Vertrag → Verrat im Grabenkrieg → eigenes Gesetz Deut 20 → Karen Armstrong.',
    uebersetzung:
      'Bei der Hidschra schloss Muhammad ﷺ einen Schutzpakt mit allen (Heiden und Juden): „Dem Juden, der uns folgt, gebührt Hilfe und Gleichheit … sie stehen einander gegen jeden Angreifer bei." Beim Grabenkrieg verbündeten sich die Banū Qurayẓa mit dem Belagererheer (10.000) gegen 3.000 Muslime — existenzielle Bedrohung von innen. Ihre erste Treulosigkeit war begnadigt worden; bestraft wurde erst der wiederholte Verrat. Das Urteil fällte ihr eigener Verbündeter Saʿd ibn Muʿādh nach Deut 20,10-14, ihrem eigenen Kriegsgesetz. Karen Armstrong: „nicht aus religiösen oder rassischen Gründen — wegen Verrats; keine andere jüdische Sippe protestierte." Beim goldenen Kalb ließ Mose ~3.000 töten (Ex 32,27-29). Gleicher Maßstab: entweder beide Propheten oder keiner.',
    fundstelle: 'Sīra Ibn Hischām · K. Armstrong, Muhammad · Deut 20,10-14 · Ex 32,27-29',
  },

  // ---- Source: the davidic narrative as propaganda ----
  davidisch: {
    typ: 'quelle',
    kurz: 'Das davidische Messias-Narrativ: vier Propaganda-Schichten — und der Deut-18,22-Todesstoß.',
    uebersetzung:
      'Vier Schichten. (a) Stammes-Polemik: Genesis untergräbt systematisch Esau (Edom) zugunsten Jakobs — 7 Varianten des Konflikts (Rosenberg); dasselbe Muster gegen Ismael (Siegel 1). (b) Eingefügte Davids-Texte: Jeremia 23,5-6 (davidischer „Spross"); in Sacharja 6,11-12 wurde Serubbabels Name getilgt und durch Josua ersetzt, als Serubbabel die Davids-Rolle nicht erfüllte (Reginald Fuller). Nach dem Exil verblasste die Davids-Hoffnung (James Dunn; Collins: kaum Messianismus 500–200 v. Chr.). (c) Fehl-Exegese: 2 Sam 7,25-26 (Davids Gebet) als „künftiger Messias" umgedeutet; Jes 11,1 „Stumpf Isais" — yišay = Kurzform von yišmaʿel (Encyclopaedia Biblica). (d) NT-Anpassung: zwei widersprüchliche Genealogien (Mt 1 vs. Lk 3) „beide erfunden" (Helms); Lukas führt Marias Linie auf Aaron, nicht David; Butz: Davids-Abkunft = Kirchen-Polemik (S. 288). Todesstoß: Deut 18,21-22 — das davidische Narrativ traf über mehrere Exile nie ein, das arabische jeden Punkt.',
    fundstelle: 'Rosenberg · R. Fuller · Dunn · Collins · Helms · Butz S. 288 · Enc. Biblica',
  },

  // ---- Source: Michael Brown's admission ----
  michaelBrown: {
    typ: 'quelle',
    kurz: 'Dr. Michael Brown leugnet das Aus-dem-Kontext-Zitieren nicht — er nennt es „legitime Methode".',
    uebersetzung:
      'Dr. Michael Brown, der führende christliche Experte für Messias-Prophezeiungen (Answering Jewish Objections), leugnet nicht, dass das Neue Testament aus dem Kontext zitiert — er verteidigt es bloß als „legitime Methode" (mit Verweis auf Qumran und Joseph Fitzmyer). Damit gibt der Top-Experte selbst zu, dass die „Erfüllungen" nicht im Wortsinn aus dem Kontext folgen. Eure eigenen Experten räumen die Methode ein.',
    fundstelle: 'M. Brown, Answering Jewish Objections (Bd. 1/4) · Fitzmyer · Qumran',
  },

  // ---- Source: Augustine concedes ----
  augustinus: {
    typ: 'quelle',
    kurz: 'Augustinus (Contra Faustum): er kann die Juden mit Exegese nicht überzeugen — nur durch NT-Glauben.',
    uebersetzung:
      'In Contra Faustum gestand Augustinus, dass er die Juden nicht überzeugen könne, Jesus sei der „Prophet wie Mose" (Deut 18) — seine Position beruhe allein auf dem Glauben an das Neue Testament, nicht auf der Exegese der hebräischen Schrift selbst. Ein Kirchenvater räumt ein: ohne den NT-Glaubensschritt trägt die Exegese die These nicht.',
    fundstelle: 'Augustinus, Contra Faustum (vgl. Siegel 2)',
  },

  // ---- Source: rabbinic low standards ----
  rabbinisch: {
    typ: 'quelle',
    kurz: 'Rabbinische Tiefstmaßstäbe: „bara" → „für Abraham"; Buchstaben-Umordnung (Sanhedrin 43a).',
    uebersetzung:
      'Rabbinische Auslegung deutet „bara" (Gen 2,4, „erschaffen") durch Buchstaben-Umordnung zu be-Abraham („für Abraham") um; Sanhedrin 43a leitet Namen durch Buchstaben-Exegese ab (Siegel 4). Wenn Rabbiner solche Maßstäbe für ihre eigene Theologie akzeptieren, ist die Ablehnung von maḥamaddīm (Hld 5,16) reine Doppelmoral — wir wenden ihre eigene Methode an, nur strenger (Eigennamen + Geografie + Zeitachse). Fairness: das Buch nennt selbst Gegenstimmen (Rabbi Eliezer ben Hyrcanus, David Ben Gurion kritisierten solche Umdeutungen) — wir behaupten nicht, alle Rabbiner täten dies, nur dass es in Mainstream-Quellen verbreitet ist.',
    fundstelle: 'Sanhedrin 43a · Mischna/Talmud · vgl. R. Eliezer ben Hyrcanus, Ben Gurion',
  },

  // ---- Source: Muhammad ﷺ accomplished the Messiah-works ----
  messiasWerke: {
    typ: 'quelle',
    kurz: 'Muhammad ﷺ vollbrachte die Messias-Werke: Persien & Rom besiegt, Rückkehr, Tempelplatz gereinigt.',
    uebersetzung:
      'Historisch tat Muhammad ﷺ (bzw. die frühen Muslime) genau das, was man vom davidischen Messias erwartete: Persien und Rom besiegt, den Juden die Rückkehr ins Heilige Land eröffnet, den Tempelplatz gereinigt und dort den Monotheismus wiederhergestellt (jüd. Zeuge Sefer Pitron Torah, Siegel 4). Würde man sagen „vielleicht kommt der davidische Messias erst noch", machte das Deut 18 zur Farce: der „falsche Prophet" hätte jedes einzelne Messias-Werk schon vollbracht. Die Ablehnung erfolgt allein wegen der Blutlinie (nicht-davidisch), nicht wegen mangelnder Erfüllung.',
    fundstelle: 'Sefer Pitron Torah (vgl. Siegel 4) · vgl. Deut 18',
  },

  // ---- Source: the threefold expectation & jewish criteria ----
  kriterien: {
    typ: 'quelle',
    kurz: 'Jüdische Prüfsteine eines Propheten — und die Erwartung mehrerer Endzeit-Gestalten.',
    uebersetzung:
      'Maimonides (Mishne Tora, Jesodej ha-Tora 7–10) nennt die Kennzeichen eines wahren Propheten: untadeliger Charakter, das eintreffende Wort, Treue zum Eingottglauben der Tora. Die Erwartung mehrerer Endzeit-Gestalten ist gut bezeugt: die Gemeinderegel von Qumran (1QS 9,11) erwartet „bis ein Prophet kommt und die Gesalbten Aarons und Israels"; Johannes 1,21 fragt Messias, Elia und „den Propheten" getrennt ab. Der „Prophet wie Mose" war ein eigener, offener Platz.',
    fundstelle: 'Maimonides, Jesodej ha-Tora 7–10 · 1QS 9,11 (Qumran) · Joh 1,21',
  },

  // ---- Source: the catalogue of double standards ----
  doppelmass: {
    typ: 'quelle',
    kurz: 'Dieselbe Regel, zweierlei Anwendung — das wiederkehrende Muster der Einwände.',
    uebersetzung:
      'Quer durch die Siegel kehrt ein Muster wieder: die Bibel gilt als Beweis, bis sie Muhammad stützt — dann heißt sie „verfälscht" (Fundament). Isaaks Segen ist „geistlich", Ismaels gleichlautender Segen „bloß zahlenmäßig" (Siegel I). „Von Seir" deutet man aufs Christentum, „vom Paran" überhört man (Siegel III). Das Hohelied liest die Kirche allegorisch, doch maḥamaddīm müsse wörtlich bleiben (Siegel IV). „Dieses Geschlecht" deutet man großzügig in die Zukunft (Siegel VI) — dem Parakleten verweigert man dieselbe Offenheit. Gleiche Maßstäbe (Sprichwort 20,10) heißt: die Regel, die man der einen Seite zugesteht, auch der anderen — und umgekehrt.',
    fundstelle: 'Methodik · vgl. Fundament · Siegel I, III, IV, VI',
  },
}

// ---- Exhibit 1: the Torah's touchstones ------------------------------------
export const pruefsteine = {
  intro:
    'Die Tora nennt selbst die Prüfsteine eines wahren Propheten. Legt man sie unvoreingenommen an Muhammad ﷺ an:',
  tests: [
    { test: 'Sein Wort trifft ein', ref: '5. Mose 18,21-22', sinn: 'Daniels Zeitfenster, der Fall des geteilten Rom, die Ausbreitung — eingetroffen (Siegel V). Das davidische Narrativ traf über mehrere Exile nie ein.' },
    { test: 'Er führt zu keinem anderen Gott', ref: '5. Mose 13,1-4', sinn: 'Strenger Eingottglaube (tauḥīd) — er zerbrach die Götzen, statt zu ihnen zu rufen.' },
    { test: 'Er spricht im Namen des HERRN', ref: '5. Mose 18,19', sinn: 'Jede Sure bis auf eine beginnt „Im Namen Gottes, des Erbarmers".' },
    { test: 'Er bestätigt die früheren Propheten', ref: 'vgl. Mt 7,15-20', sinn: 'Er ehrt Mose und Jesus als Gesandte, reinigt Jesus vom Vorwurf des Betrugs.' },
  ],
  pointe: 'An den eigenen Prüfsteinen der Tora gemessen, besteht er — Stein für Stein.',
}

// ---- Exhibit 2: the balance & the double standards (Doppelmaß-Katalog) ------
export const zweierlei = {
  intro:
    'Die Waage zeigt das Muster: dieselbe Regel, zweierlei Anwendung. Links, was man für Jesus großzügig (vage) gelten lässt; rechts, was man Muhammad ﷺ mit Eigennamen, Geografie und Zeitachse trotzdem verweigert. Darüber Sprichwort 20,10.',
  faelle: [
    { standard: 'Die Schrift', jesus: 'Man zitiert die Bibel als Beweis.', muhammad: 'Man ruft „Fälschung", sobald sie ihn stützt.', siegel: 'Fundament' },
    { standard: 'Abrahams Segen', jesus: 'Isaaks Segen gilt als geistlich.', muhammad: 'Ismaels gleichlautender Segen sei „bloß zahlenmäßig".', siegel: 'Siegel I' },
    { standard: '„Wie Mose"', jesus: '5. Mose 18 gilt als in ihm erfüllt.', muhammad: 'Das Kriterium „wie Mose" (34,10) wird übergangen.', siegel: 'Siegel II' },
    { standard: 'Die Berge', jesus: '„Von Seir" deutet man aufs Christentum.', muhammad: '„Vom Berg Paran" bleibt unbeachtet.', siegel: 'Siegel III' },
    { standard: 'Das Sinnbild', jesus: 'Das Hohelied liest die Kirche allegorisch.', muhammad: 'maḥamaddīm müsse dagegen wörtlich bleiben.', siegel: 'Siegel IV' },
    { standard: 'Genealogie', jesus: 'Zwei widersprüchliche Stammbäume (Mt 1 / Lk 3) stören nicht.', muhammad: 'Eine lückenlose Linie zu Ismael wird gefordert.', siegel: 'Siegel I' },
    { standard: 'Aus-dem-Kontext', jesus: 'Hosea 11,1 (Israels Exodus) gilt als Jesus-Prophezeiung.', muhammad: 'Eigennamen im Wortlaut genügen angeblich nicht.', siegel: 'Siegel III/IV' },
    { standard: 'Der Paraklet', jesus: 'Joh 14,26 („der Geist") entscheidet sofort.', muhammad: 'Die übrige Beschreibung soll nicht zählen.', siegel: 'Siegel VI' },
    { standard: '„Dieses Geschlecht"', jesus: 'Man dehnt es großzügig in die Zukunft.', muhammad: 'Dem Parakleten verweigert man dieselbe Offenheit.', siegel: 'Siegel VI' },
    { standard: 'Spätere Schrift', jesus: 'Dass das Neue Testament nach Jesus entstand, stört nicht.', muhammad: 'Dass der Koran später kam, gilt als Einwand.', siegel: '—' },
  ],
  pointe:
    'Zehn Fälle, ein Muster. Legt man auf beide Schalen dieselben Gewichte (Sprichwort 20,10), steht die Waage still — und auf einer ehrlichen Waage bleibt genau ein Erfüller stehen.',
}

// ---- Exhibit 3: Karte + Zeitplan — the MAIN exhibit -------------------------
// A schematic map of the Jewish settlements in Arabia, with two layers:
// Isaiah 42 = WHERE (arrow on Medina/Sela), Isaiah 21 = WHEN (Dedanite
// bedouinisation 3rd c. → migration arrow). Ties visually to Siegel 3.
export const karteZeitplan = {
  intro:
    'Das Haupt-Exhibit. Die Juden hatten Koordinaten UND Timing: Jesaja 42 (Kedar, Sela) gab das Wo — Medina; Jesaja 21 (Beduinisierung der Dedaniter im 3. Jh.) gab das Wann — jetzt aufbrechen. Die jüdische Migration in die Wüste folgte historisch genau auf die Beduinisierung der Dedaniter.',
  // viewBox 0 0 100 120, north at top
  punkte: [
    { id: 'tema', label: 'Tema', sub: 'jüd. Oase im Norden', x: 60, y: 22, tone: 'green' as const },
    { id: 'dedan', label: 'Dedan · Al-Hijr', sub: 'Jes 21 — Beduinisierung (3. Jh.)', x: 50, y: 36, tone: 'brass' as const },
    { id: 'khaybar', label: 'Khaybar', sub: 'von ḥeber „Bund"', x: 44, y: 52, tone: 'green' as const },
    { id: 'medina', label: 'Medina · Sela', sub: 'Jes 42,11 — das „Wo"', x: 40, y: 66, tone: 'green' as const },
    { id: 'badr', label: 'Badr', sub: '624 — „Herrlichkeit Kedars" endet', x: 30, y: 80, tone: 'muted' as const },
    { id: 'mekka', label: 'Mekka', sub: 'Bakka (Siegel 3)', x: 34, y: 92, tone: 'muted' as const },
  ],
  // the migration path: Dedan → Khaybar → Medina (the WHEN-driven move south)
  pfad: ['dedan', 'khaybar', 'medina'],
  woWann: [
    { tag: 'Jesaja 42', frage: 'das WO', text: 'Kedar (die Söhne Ismaels) und Sela — ein Ort in Medina. Genau dort begruben die Juden ihre Toten (Ṭabarī). → Siegel 3.', ref: 'Jes 42,11' },
    { tag: 'Jesaja 21', frage: 'das WANN', text: '„Karawanen der Dedaniter … vor den Schwertern geflohen." Die Beduinisierung der Dedaniter (3. Jh.) war das Signal; die Migration folgte unmittelbar. „Binnen eines Jahres endet alle Herrlichkeit Kedars" = Badr (624).', ref: 'Jes 21,13-17' },
    { tag: 'Daniel', frage: 'das JAHR', text: 'Die 350-Jahre- / Bar-Kochba-Rechnung zeigt auf 622. Rabbi Ben Abrahamson kommt selbst auf 622 und den „wahren Krieger-Messias".', ref: 'vgl. Siegel 5' },
  ],
  pointe:
    'Koordinaten aus Jesaja 42, Timing aus Jesaja 21, das Jahr aus Daniel — ein historisch nachweisbarer Migrationsstrom in die Wüste vor dem Ereignis. Niemand zieht für Komfort in die härteste Wüste der Erde.',
}

// ---- Exhibit 4: Banū-Qurayẓa context timeline (5 stations) ------------------
export const qurayzaTimeline = {
  intro:
    'Der Einwand „Muhammad ﷺ tötete Juden" fällt mit dem vollen Kontext. Fünf Stationen — nie eine ohne die anderen vier:',
  stationen: [
    { n: '1', titel: 'Der Vertrag', text: 'Bei der Hidschra ein Schutzpakt mit allen (Heiden + Juden): „Dem Juden, der uns folgt, gebührt Hilfe und Gleichheit … sie stehen einander gegen jeden Angreifer bei."' },
    { n: '2', titel: 'Erster Verrat — begnadigt', text: 'Die erste Treulosigkeit wurde vergeben; sie durften bleiben. Bestraft wurde erst der wiederholte Bruch.' },
    { n: '3', titel: 'Der Grabenkrieg', text: 'Beim Grabenkrieg verbündeten sich die Banū Qurayẓa mit dem Belagererheer (10.000) gegen 3.000 Muslime — existenzielle Bedrohung von innen.' },
    { n: '4', titel: 'Urteil nach eigenem Gesetz', text: 'Das Urteil fällte ihr eigener Verbündeter Saʿd ibn Muʿādh — nach Deut 20,10-14, ihrem eigenen Kriegsgesetz. Karen Armstrong: „wegen Verrats, nicht aus religiösen oder rassischen Gründen."' },
    { n: '5', titel: 'Mose-Parallele', text: 'Beim goldenen Kalb ließ Mose ~3.000 töten (Ex 32,27-29). Gleicher Maßstab: entweder beide Propheten oder keiner. → verstärkt „Prophet wie Mose" (Siegel 2).' },
  ],
  pointe:
    'Vertragsbruch, Hochverrat im Krieg, ihr eigenes Gesetz, ein Historiker und Mose selbst — wer Muhammad ﷺ deshalb verurteilt, verurteilt Mose.',
}

// ---- Exhibit 5: the davidic-narrative dissection table (4 layers + Deut 18) -
export const davidischSeziertisch = {
  intro:
    'Der Seziertisch. Das davidische Messias-Narrativ in vier Propaganda-Schichten — jede mit einem Beleg — und darunter der Deut-18,22-Todesstoß.',
  schichten: [
    { n: 'a', titel: 'Stammes-Polemik im Text', beleg: 'Genesis untergräbt systematisch Esau (Edom) zugunsten Jakobs — 7 Varianten des Konflikts (Rosenberg). Dasselbe Muster gegen Ismael (Siegel 1).' },
    { n: 'b', titel: 'Eingefügte Davids-Texte', beleg: 'Jeremia 23,5-6 (davidischer „Spross"); in Sacharja 6,11-12 wurde Serubbabels Name getilgt und durch Josua ersetzt (Reginald Fuller). Nach dem Exil verblasste die Davids-Hoffnung (Dunn; Collins: kaum Messianismus 500–200 v. Chr.).' },
    { n: 'c', titel: 'Fehl-Exegese authentischer Texte', beleg: '2 Sam 7,25-26 (Davids Gebet) als „künftiger Messias" umgedeutet. Jes 11,1 „Stumpf Isais" — yišay = Kurzform von yišmaʿel (Encyclopaedia Biblica) + „Frucht" = Ismael.' },
    { n: 'd', titel: 'NT-Anpassung der Genealogien', beleg: 'Zwei widersprüchliche Stammbäume (Mt 1 vs. Lk 3) — „beide erfunden" (Helms). Lukas führt Marias Linie auf Aaron (Priester), nicht David. Butz: Davids-Abkunft = Kirchen-Polemik. Jesus selbst zweifelt das Kriterium an (Mt 22,41-45).' },
  ],
  todesstoss: {
    titel: 'Der Todesstoß · 5. Mose 18,21-22',
    text: 'Wahre Prophetie trifft ein. Das davidische Narrativ traf über mehrere Exile nie ein → es besteht Gottes eigenen Test nicht. Das arabische Narrativ erfüllte jeden Punkt (Deut 33, Jes 42, Ps 84 …).',
  },
}

// ---- Exhibit 6: the admissions gallery ("Sie-sagen-es-selbst") -------------
export const eingestaendnisse = {
  intro:
    'Drei „Sie-sagen-es-selbst"-Karten: Die Gegenseite räumt die Methode mit eigenen Worten ein.',
  karten: [
    { wer: 'Dr. Michael Brown', was: 'Aus-dem-Kontext = „legitim"', zitat: 'Der Top-Experte für Messias-Prophezeiungen leugnet das Aus-dem-Kontext-Zitieren nicht — er nennt es „legitime Methode" (Verweis auf Qumran/Fitzmyer).', belegId: 'michaelBrown' },
    { wer: 'Augustinus', was: 'kann Juden nicht überzeugen', zitat: 'Contra Faustum: Die Position „Jesus = Prophet wie Mose" beruhe allein auf dem Glauben ans NT, nicht auf der Exegese der hebräischen Schrift.', belegId: 'augustinus' },
    { wer: 'Jeffrey Butz', was: 'Davids-Abkunft = Polemik', zitat: 'Die davidische Abstammung Jesu sei „spätere Kirchen-Polemik", kein historisches Faktum (S. 288).', belegId: 'davidisch' },
  ],
  pointe: 'Wenn die eigenen Gewährsleute die Methode zugeben, ist die Doppelmoral nicht mehr zu halten.',
}

// ---- Exhibit 7: the Ibn al-Haybān quote banner (emotional anchor) ----------
export const ibnAlHaybanBanner = {
  quelle: 'Rabbi Ibn al-Haybān — auf dem Sterbebett, zwei Jahre vor der Berufung',
  zitat:
    'Ich verließ das Land von Wein und Brot und kam in dieses Land der Not und des Hungers — in Erwartung eines Propheten, dessen Zeit nahe ist. Dies ist das Land seiner Auswanderung. Folgt ihm, und seid nicht die Letzten!',
  fundstelle: 'Ibn al-Qayyim, Hidāyat al-Ḥayārā S. 36-37',
}

// ---- Exhibit 8: the rope of strands (synthesis, reuses .netz) ---------------
export const straenge = {
  intro: 'Kein Siegel trägt allein. Verwoben bilden sie ein Seil aus vielen Strängen — das ist, was auf der Waage liegt:',
  items: [
    { siegel: 'Fundament', was: 'Der prüfbare Anspruch (7,157) und die Leseregeln.' },
    { siegel: 'Siegel I', was: 'Die gesegnete, legitime Linie Ismaels — der Abstammungs-Bund.' },
    { siegel: 'Siegel II', was: 'Der Prophet „wie Mose", aus den Brüdern.' },
    { siegel: 'Siegel III', was: 'Paran, Kedar, Bakka — die Orte in Arabien.' },
    { siegel: 'Siegel IV', was: 'maḥamaddīm — Wurzel und Klang des Namens.' },
    { siegel: 'Siegel V', was: 'Daniels Zeitfenster — das Jahr 622, nach dem geteilten Rom.' },
    { siegel: 'Siegel VI', was: 'Der Paraklet / Aḥmad — der Gepriesene.' },
    { siegel: 'Siegel VII', was: 'Die historisch belegte jüdische Erwartung.' },
  ],
  pointe: 'Ein einzelner Strang mag sich biegen; das Seil aus sieben trägt. Die gemeinsame Wahrscheinlichkeit all dessen als Zufall ist praktisch null.',
}

export const erwartungKonter: KonterItem[] = [
  {
    tier: 'stone',
    einwand: '„Der Messias muss vom Stamm Davids kommen — ein Araber scheidet aus."',
    konter:
      'Das davidische Narrativ ist gescheitert (über mehrere Exile nie erfüllt) und besteht Gottes eigenen Test nicht (Deut 18,22: wahre Prophetie trifft ein). Selbst das NT zweifelt die Davids-Abkunft an: Jesus selbst fragt, ob der Messias Davids Sohn sein muss (Mt 22,41-45). Die zwei Stammbäume (Mt 1 / Lk 3) widersprechen sich. Moderne Gelehrte (Butz): die Davids-Abkunft ist „spätere Kirchen-Polemik", kein historisches Faktum. Saubere Prophetie trifft ein — die davidische tat es nie.',
    belegId: 'mt2241',
  },
  {
    tier: 'stone',
    einwand: '„Muhammad tötete Juden (Banū Qurayẓa) — kein Retter Israels."',
    konter:
      'Kontext: Die Banū Qurayẓa brachen den Medina-Vertrag und verbündeten sich beim Grabenkrieg mit den Belagerern (10.000 gegen 3.000). Ihre erste Treulosigkeit wurde begnadigt; bestraft wurden sie erst beim zweiten Verrat. Das Urteil sprach ihr eigener Verbündeter Saʿd ibn Muʿādh — nach ihrem eigenen Gesetz (Deut 20,10-14). Karen Armstrong: „nicht aus religiösen oder rassischen Gründen — wegen Verrats." Und Mose tat beim goldenen Kalb dasselbe (Ex 32,27-29, ~3.000 Tote). Wer Muhammad ﷺ deshalb verurteilt, verurteilt Mose. → verstärkt sogar „Prophet wie Mose" (Siegel 2).',
    belegId: 'qurayza',
  },
  {
    tier: 'stone',
    einwand: '„Es gibt über 300 erfüllte Prophezeiungen über Jesus."',
    konter:
      'Keine ist spezifisch — alle müssen gedehnt oder aus dem Kontext gerissen werden (Hosea 11,1 = Israels Exodus, nicht Jesus; Mt 27,9 schreibt Sacharja fälschlich „Jeremia" zu). Selbst Dr. Michael Brown, der Top-Experte für Messias-Prophezeiungen, leugnet das Aus-dem-Kontext-Zitieren nicht — er nennt es bloß „legitime Methode". Eure eigenen Experten geben die Methode zu.',
    belegId: 'michaelBrown',
  },
  {
    tier: 'stone',
    einwand: '„Eure Auslegung ist auch nur Umdeutung."',
    konter:
      'Im Gegenteil — unser Maßstab ist höher: wir liefern Eigennamen + Geografie + Zeitachse. Rabbiner deuten „bara" (Gen 2,4) zu „für Abraham" um und ordnen Buchstaben um (Sanhedrin-Methode) — wenn sie solche Maßstäbe akzeptieren, müssen sie maḥamaddīm erst recht akzeptieren. Wir wenden ihre eigene Methode an, nur strenger.',
    belegId: 'rabbinisch',
  },
  {
    tier: 'stone',
    einwand: '„Vielleicht kommt der davidische Messias ja noch."',
    konter:
      'Das macht Deut 18 zur Farce: es würde bedeuten, Gott habe so schlechte Kriterien gesetzt, dass der „falsche Prophet" Muhammad ﷺ jedes einzelne davidische Messias-Werk bereits vollbrachte (Persien & Rom besiegt, Rückkehr nach Jerusalem, Tempel-Reinigung). Ein Gott, dessen Prophezeiungen man beliebig in die Zukunft schieben kann, prophezeit nichts.',
    belegId: 'messiasWerke',
  },
  {
    tier: 'stone',
    einwand: '„Die jüdische Erwartung erfüllte sich ganz in Jesus — mehr ist nicht offen."',
    konter:
      'Die Erwartung kannte mehrere Gestalten: Messias, Elia und „den Propheten" (Joh 1,21; 1QS 9,11). Johannes der Täufer verneint ausdrücklich, „der Prophet" zu sein. Selbst wenn man den Messias-Platz Jesus zuschreibt, bleibt der Platz „des Propheten wie Mose" offen — und sein Maßstab führt nach Arabien (Siegel II). Und historisch wanderten die Juden vor dem Islam in die Wüste, weil sie genau diesen Propheten erwarteten.',
    belegId: 'kriterien',
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
    einwand: '„Ihr beruft euch auf ‚gleiche Maßstäbe‘ nur, wenn es euch nützt."',
    konter:
      'Die Regel schneidet in beide Richtungen, und wir tragen das: Wir lehnen das Barnabas-Evangelium ab (Fundament), wir markieren die Grenzen des Parakleten und sagen selbst, dass keine Handschrift „períklytos" liest (Siegel VI), wir nennen das Hohelied einen Faden, keinen Pfeiler (Siegel IV). Wir behaupten auch nicht, alle Rabbiner verfälschten — Eliezer ben Hyrcanus und Ben Gurion kritisierten solche Umdeutungen selbst. Gleiches Maß heißt gleiches Maß.',
    belegId: 'doppelmass',
  },
  {
    tier: 'marble',
    einwand: '„Jesse/Isai in Jes 11,1 beweist den Davids-Spross."',
    konter:
      'Dann müsste es „Stumpf Davids" heißen, nicht „Isais". Hebr. yišay (Isai) lasse sich als Kurzform von yišmaʿel (Ismael) lesen — wie „Bob" aus „Robert" (Encyclopaedia Biblica) — plus „Zweig, der Frucht (parah) bringt" = Ismael (Gen 17,20). ⚠️ Vorsicht: das ist die Cheyne’sche Minderheitstheorie, heute weithin ignoriert (gängige Etymologien: „Yah existiert"/„Geschenk"). Nur als schwaches Indiz / rhetorischer Spiegel führen, nie als harter Beweis.',
    belegId: 'davidisch',
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
    h: '7.1 — Die jüdischen Stämme von Medina (historischer Befund)',
    body: 'Jüdische Siedlungen quer durch den Hidschaz: Medina, Khaybar (von hebr. ḥeber „Liga/Bund"), Dedan, Al-Hijr, Tema, Ablaq, Yamama, Taif, evtl. Mekka (Zeitlin, The Historical Muhammad S. 78-84; Baron Kap. XVI; Margolis/Marx). Sie hoben Nordarabien fast auf „Arabia Felix"-Niveau (Baron) — und wurden dadurch Ziel von Beduinen-Raubzügen. Das Rätsel: warum eine wohlhabende, gebildete Bevölkerung freiwillig in die härteste Wüste zog. Antwort der Quellen: Erwartung des Propheten. Ibn al-Haybān (Ibn al-Qayyim, Hidāya) wandert sterbend aus Syrien ein und kündigt „das Land seiner Auswanderung" an. Parallel: Salmān al-Fārisī und der christliche Mönch von Amorion (Kap. 11) — dieselbe Erwartung quer durch Rabbiner und Mönche.',
  },
  {
    tier: 'stone',
    h: '7.2 — Karte + Zeitplan: Jesaja 42 & 21 als Wegweiser',
    body: 'Jesaja 42 (Kedar/Sela) gab das Wo: Medina → Siegel 3. Jesaja 21,13-17 gab das Wann: „die Dedaniter lagern im Gebüsch Arabiens" → die Beduinisierung der Dedaniter im 3. Jh. war das Signal. Historisch belegt: die jüdische Migration nach Medina folgte unmittelbar darauf (Caskel, Peters, Hoyland, Shuaib). „Innerhalb eines Jahres … endet alle Herrlichkeit Kedars" (21,16) = Schlacht von Badr (624). Daniel (350-Jahre- / Bar-Kochba-Rechnung, Siegel 5) gab das Jahr 622. Rabbi Ben Abrahamson kommt selbst auf 622 und nennt den „wahren Krieger-Messias" — Eltern hätten ihr Kind nach Daniels „Ish ḥamudot" benannt: Muḥamud.',
  },
  {
    tier: 'stone',
    h: '7.3 — Die Ablehnung war Feindschaft (Koran 2,146 / 6,20)',
    body: 'Koran 6,20 / 2,146: „Die, denen Wir die Schrift gaben, erkennen ihn, wie sie ihre eigenen Söhne erkennen." 26,197: „Ist es ihnen kein Zeichen, dass die Gelehrten der Kinder Israels es als wahr erkannten?" Der Ṣafiyya-bint-Ḥuyayy-Bericht (Sīra Ibn Hischām II/363) liefert das offene Eingeständnis: „Feindschaft, solange ich lebe." Keine Wissenslücke, sondern Vorurteil gegen die arabische Abstammung. (Differenzieren: manche erkannten und lehnten aus Feindschaft ab — nicht pauschal alle.)',
  },
  {
    tier: 'stone',
    h: '7.4 — Der Banū-Qurayẓa-Vorfall (vollständige Verteidigung)',
    body: '(1) Vertrag: bei der Hidschra ein Schutzpakt mit allen (Heiden + Juden): „Dem Juden, der uns folgt, gebührt Hilfe und Gleichheit … sie sollen einander gegen jeden Angreifer beistehen." (2) Verrat: beim Grabenkrieg verbündeten sich die Banū Qurayẓa mit dem Belagererheer (10.000) gegen 3.000 Muslime. (3) Begnadigung zuerst: die erste Treulosigkeit wurde vergeben; bestraft wurde erst der wiederholte Verrat. (4) Eigenes Gesetz: das Urteil fällte Saʿd ibn Muʿādh nach Deut 20,10-14. (5) Karen Armstrong: „nicht aus religiösen oder rassischen Gründen … wegen Verrats; keine andere jüdische Sippe protestierte." (6) Mose-Parallele: beim goldenen Kalb ~3.000 Tote (Ex 32,27-29). Gleicher Maßstab → entweder beide Propheten oder keiner. → verstärkt „Prophet wie Mose".',
  },
  {
    tier: 'stone',
    h: '7.5 — Das davidische Messias-Narrativ: Prophezeiung oder Propaganda?',
    body: 'Vier Schichten. (a) Stammes-Polemik: Genesis untergräbt systematisch Esau (Edom) zugunsten Jakobs — 7 Konflikt-Varianten (Rosenberg); dasselbe gegen Ismael (Siegel 1). (b) Eingefügte Davids-Texte: Jeremia 23,5-6 (davidischer „Spross"); Sacharja 6,11-12 — Serubbabels Name getilgt und durch Josua ersetzt, als Serubbabel die Davids-Rolle nicht erfüllte (Reginald Fuller); nach dem Exil verblasste die Davids-Hoffnung (James Dunn; Collins: kaum Messianismus 500–200 v. Chr.). (c) Fehl-Exegese: 2 Sam 7,25-26 (Davids Gebet) umgedeutet; Jes 11,1 yišay = yišmaʿel (Enc. Biblica). (d) NT-Genealogien: Mt 1 vs. Lk 3 „beide erfunden" (Helms); Lukas → Aaron, nicht David; Butz: Kirchen-Polemik; Jesus zweifelt das Kriterium an (Mt 22,41-45). Todesstoß: Deut 18,21-22 — das davidische Narrativ traf nie ein, das arabische jeden Punkt.',
  },
  {
    tier: 'stone',
    h: '7.6 — Gleiche Maßstäbe (das methodische Herzstück)',
    body: 'Sprichwort 20,10: „Zweierlei Gewicht … ein Gräuel für den Herrn." Koran 2,85 (Teilglaube an die Schrift) — das Prinzip. Vage Jesus-Prophezeiungen: Hosea 11,1 (Israels Exodus, nicht Jesus); Mt 27,9 (Sacharja fälschlich „Jeremia"); „über 300" nur durch Dehnung. Dr. Michael Brown leugnet das Aus-dem-Kontext-Zitieren nicht, sondern nennt es (mit Verweis auf Qumran/Fitzmyer) „legitime Methode" — der Top-Experte gibt es selbst zu. Rabbinische Tiefstmaßstäbe: „bara" (Gen 2,4) → „für Abraham"; Buchstaben-Umordnung; Sanhedrin-43a-Namens-Exegese. FAIRNESS-Disziplin: das Buch nennt selbst Gegenbeispiele — Rabbi Eliezer ben Hyrcanus und David Ben Gurion kritisierten solche Umdeutungen. Wir behaupten NICHT, alle Rabbiner täten das — nur dass es in Mainstream-Quellen verbreitet ist. Augustinus-Eingeständnis (Contra Faustum, Siegel 2): er kann Juden nicht überzeugen; seine Position beruhe allein auf NT-Glauben, nicht auf Exegese.',
  },
  {
    tier: 'stone',
    h: '7.7 — Muhammad ﷺ vollbrachte die Messias-Werke',
    body: 'Historisch tat Muhammad ﷺ (bzw. die frühen Muslime) genau das, was man vom davidischen Messias erwartete: Persien und Rom besiegt, den Juden die Rückkehr ins Heilige Land eröffnet, den Tempelplatz gereinigt und dort den Monotheismus wiederhergestellt (jüd. Zeuge Sefer Pitron Torah, Siegel 4). Die Ablehnung erfolgt allein wegen der Blutlinie (nicht-davidisch), nicht wegen mangelnder Erfüllung. Wer einwendet „der davidische Messias kommt erst noch", macht Deut 18 zur Farce.',
  },
  {
    tier: 'stone',
    h: '7.8 — al-mīzān: das Prinzip der einen Waage',
    body: 'Der Koran macht die Waage zum Bild der Gerechtigkeit: Gott „stellte die Waage auf … mindert die Waage nicht" (55,7-9); Er sandte „das Buch und die Waage, damit die Menschen Gerechtigkeit üben" (57,25); und er verlangt Beweis statt Wunsch: „Bringt euren Beweis vor" (2,111). Eine Waage, ein Satz Gewichte — für Mose, Jesus und Muhammad ﷺ gleich (3,84). Was den einen beweist, muss den anderen beweisen dürfen; was den einen ausschließt, muss den anderen ausschließen.',
  },
  {
    tier: 'marble',
    h: '7.9 — 5. Mose 13 richtig gelesen',
    body: 'Der Einwand „neues Gesetz = falscher Prophet" verwechselt die Prüfung. 13,3 warnt vor dem Ruf zu fremden Göttern, nicht vor neuer Gesetzgebung — Mose selbst gab Gesetz. Ein Prophet „wie Mose" (18,18) bringt notwendig eine neue Ordnung. Maßstab ist die Richtung des Glaubens (zum Einen oder weg von ihm), nicht die Neuheit der Vorschrift.',
  },
  {
    tier: 'marble',
    h: '7.10 — Was die Waage leistet — und was nicht',
    body: 'al-mīzān beweist nichts aus sich; sie ist die Methode, nicht die Materie. Ihre Aufgabe ist, Sonderstrenge und Sondergroßzügigkeit zu entfernen, damit die Belege gleich zählen. Gleiches Maß verpflichtet auch zur Selbstkritik (schwache Belege wie Jes 11,1=Ismael bleiben markiert, die 350-Jahre-Rechnung gilt nur ergänzend). So gelesen, ist dieses Siegel das Gewissen der übrigen — kein neuer Beweis, sondern ihre faire Wägung.',
  },
]

export const erwartungVernetzung = [
  { ziel: 'Siegel 1 — Abrahams Nachkommen', text: 'Die Stammes-Polemik gegen Ismael ist dieselbe Maschine wie gegen Esau; das Ismael-Vorurteil erklärt die Ablehnung.' },
  { ziel: 'Siegel 2 — Prophet wie Mose', text: 'Banū Qurayẓa (Ex 32) verstärkt „Prophet wie Mose"; dazu das Augustinus-Eingeständnis (Contra Faustum).' },
  { ziel: 'Siegel 3 — Arabische Prophezeiungen', text: 'Jesaja 42 (Wo) + Jesaja 21 (Wann) = die Karte, der die Juden folgten; der Berg Sela.' },
  { ziel: 'Siegel 4 — maḥamaddīm', text: 'Ish ḥamudot → Muḥamud; die Sanhedrin-Methode als Maßstab.' },
  { ziel: 'Siegel 5 — Daniels Fenster', text: 'Daniel / Bar-Kochba = das Jahr 622; die Tempel-Reinigung.' },
  { ziel: 'Siegel 6 — Der Paraklet', text: '„Dieses Geschlecht"-Doppelmoral; die Paraklet-Eingeständnisse.' },
  { ziel: 'Verteidigung — Falscher Prophet?', text: 'Der Deut-18,22-Test trifft auch das davidische Narrativ — er liefert dem nächsten Siegel den Maßstab.' },
]

export const erwartungGleicheMassstaebe =
  'Dies ist nicht nur die Pointe eines Siegels, sondern des ganzen Moduls. Der Kritiker akzeptiert für Jesus Prophezeiungen, die aus dem Kontext gerissen (Hosea 11,1), falsch zugeschrieben (Mt 27,9) und in sich widersprüchlich (zwei Genealogien) sind — verlangt aber für Muhammad ﷺ den buchstäblichen Namenszug; er nimmt rabbinische Buchstaben-Umordnung und Sanhedrin-Namens-Exegese hin — verwirft aber maḥamaddīm; er deutet „dieses Geschlecht" großzügig in die Zukunft (Siegel 6) — verweigert dem Parakleten dieselbe Offenheit; er legt unmögliche Maßstäbe an islamische Belege und blinde Milde an die eigenen. Auf einer einzigen, ehrlichen Waage (Sprichwort 20,10) bleibt nur ein Erfüller stehen. Selbst die Gegenseite gibt es ein: Brown (Aus-Kontext = Methode), Augustinus (kann nicht überzeugen), Butz (Polemik), der Chumash (Islam = großes Volk, Siegel 1), North (mishpat = dīn, Siegel 3), Parkhurst (ḤMD = Aḥmad, Siegel 4), Brown & Co. (Paraklet = Mensch, Siegel 6). Geografie + Name (in zwei Sprachen) + Gesetzgeber-Profil + Weltreich-Zeitachse + Abstammungs-Bund + die historisch belegte jüdische Erwartung bilden ein Netz. Genau ein Mensch der Weltgeschichte steht im Schnittpunkt aller Fäden: Muhammad ﷺ.'
