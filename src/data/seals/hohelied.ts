import type { Beleg } from '../types'

// ---------------------------------------------------------------------------
// SIEGEL IV — Das Hohelied & der arabische Prophet (SPEC §6.4 · Hld 5,16).
// The Song of Songs crowns the description of the beloved with a word that
// stands in the Hebrew text: מַחֲמַדִּים / maḥamaddim (Hld 5,16) — built on the
// root Ḥ-M-D, the very root of Aḥmad/Muhammad. It is the ONLY place in the whole
// Tanakh where the word appears as a masculine noun and yields sense as a proper
// name. Reinforced by Haggai 2,7 (ḥimdat — "the desire of all nations"), the
// pre-Islamic Jewish name-exegesis (Sanhedrin 43a) and a dozen physiognomic
// hits (Hld 5,10-16 ↔ the authentic descriptions of the Prophet ﷺ). The name is
// a resonance, not a sole pillar — its force is CUMULATIVE: name + physiognomy +
// cross-links to five other prophecies + the Jewish method + hostile witnesses.
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

export const hoheliedThese =
  'Der Name steht buchstäblich im Text: „Sein Mund ist lauter Süße, er ist ganz maḥamaddim" (Hohelied 5,16). Das hebräische מַחֲמַדִּים steht auf der Wurzel Ḥ-M-D — derselben Wurzel wie Aḥmad und Muhammad ﷺ. Setze „Muhammad" ein: es ist die einzige Stelle im ganzen Alten Testament, wo das Wort als maskulines Nomen erscheint und als Eigenname Sinn ergibt — kunstvoll gereimt auf das vorangehende mamtaqqim („Süße"). Verstärkt durch Haggai 2,7 (ḥimdat, „das Begehren aller Völker"), die jüdische Namens-Exegese von Sanhedrin 43a und ein Dutzend physiognomischer Treffer mit den authentischen Beschreibungen des Propheten. Wir behaupten keinen Einzelbeweis, sondern ein kumulatives Netz: Name + Physiognomie + fünf Querverbindungen — der Zufall ist ausgeschlossen.'

export const hoheliedSteps: Step[] = [
  {
    n: 'I',
    h: 'Der Name im Text (Hld 5,16)',
    body: 'Die Lobrede der Braut gipfelt: „ḥikkô mamtaqqîm wᵉ-kullô maḥămaddîm" — „sein Mund ist lauter Süße, er ist ganz maḥamaddim". Das מַחֲמַדִּים ist die mit מ gebildete, maskuline Nomen-Form der Wurzel ח־מ־ד (Ḥ-M-D) und gereimt auf mamtaqqim. „Ganz begehrenswert" — und ein Anklang an Muhammad ﷺ.',
  },
  {
    n: 'II',
    h: 'Die Wurzel = der Name',
    body: 'Ḥ-M-D heißt „preisen, begehren, köstlich sein". Genau das bedeutet Muhammad ﷺ („der Gepriesene") und Aḥmad („der Hochgepriesene"). Hebräische ח־מ־ד und arabische ḥ-m-d sind dieselbe semitische Wurzel: Tremper Longman (NICOT) — „maḥamaddim leitet sich von der Wurzel ḤMD ab". Bedeutung des Wortes = Bedeutung des Namens.',
  },
  {
    n: 'III',
    h: 'Die Einsetzprobe',
    body: 'maḥamad steht auch in 1. Könige 20,6; 2. Chronik 36,19; Jesaja 64,11 — aber als „Kostbarkeiten", nie messianisch. Setze dort „Muhammad" ein: „sie raubten alles Muhammad davon" — sinnlos. Nur Hld 5,16 trägt die maskuline Form maḥamaddim und ergibt als Name Sinn. Kein Zufall: der Kontext entscheidet.',
  },
  {
    n: 'IV',
    h: 'Das Begehren aller Völker (Haggai 2,7)',
    body: 'Haggai: „das Begehren aller Völker (ḥimdat) wird kommen, und ich werde dieses Haus mit Herrlichkeit füllen." Dieselbe Wurzel Ḥ-M-D. Die Orthodox Jewish Bible verbindet maḥamaddim (Hld 5,16) ausdrücklich mit ḥimdat (Hag 2,7) als „Moshiach, das Begehren aller Nationen". Maleachi 3,1 ergänzt den „Boten des Bundes" — die Nachtreise (Isrāʾ, Koran 17,1).',
  },
]

export const hoheliedBelege: Record<string, Beleg> = {
  // ---- A — The name in the text (Hld 5,16) ----
  song516: {
    typ: 'bibel',
    kurz: 'Sein Mund ist lauter Süße, er ist ganz maḥamaddim — gereimt auf mamtaqqim.',
    original:
      'חִכּוֹ מַמְתַקִּים וְכֻלּוֹ מַחֲמַדִּים זֶה דוֹדִי וְזֶה רֵעִי בְּנוֹת יְרוּשָׁלָ͏ִם',
    sprache: 'he',
    translit: 'ḥikkô mamtaqqîm wᵉ-kullô maḥămaddîm, zeh dôdî wᵉ-zeh rēʿî, bᵉnôt Yᵉrûšālāim',
    uebersetzung:
      '„Sein Mund ist lauter Süße, und er ist ganz und gar maḥamaddim (מַחֲמַדִּים). Das ist mein Geliebter, und das ist mein Freund, ihr Töchter Jerusalems." — Das Lob gipfelt im Wort, das Wurzel und Klang des Namens trägt; maḥamaddim ist kunstvoll auf das vorangehende mamtaqqim („Süße") gereimt: Name und Beschreibung zugleich.',
    fundstelle: 'Hohelied (Schir ha-Schirim) 5,16',
    status: 'Strong H4261 · maḥmad ← Ḥ-M-D · einzige maskuline Nomen-Form',
    kern: 'מַחֲמַדִּים',
  },

  // ---- B — Haggai 2,7: the desire of all nations (ḥimdat) ----
  hag27: {
    typ: 'bibel',
    kurz: 'Das Begehren aller Völker (ḥimdat) wird kommen, und ich fülle dies Haus mit Herrlichkeit.',
    original:
      'וְהִרְעַשְׁתִּי אֶת כָּל הַגּוֹיִם וּבָאוּ חֶמְדַּת כָּל הַגּוֹיִם וּמִלֵּאתִי אֶת הַבַּיִת הַזֶּה כָּבוֹד',
    sprache: 'he',
    translit:
      'wᵉ-hirʿaštî ʾet-kol-ha-gôyim, û-vāʾû ḥemdat kol-ha-gôyim, û-millēʾtî ʾet-ha-bayit ha-zeh kāvôd',
    uebersetzung:
      '„Und ich werde alle Völker erschüttern, und das Begehren aller Völker (ḥimdat kol ha-gôyim) wird kommen, und ich werde dieses Haus mit Herrlichkeit (kāvôd) füllen." — Dieselbe Wurzel Ḥ-M-D wie in Hld 5,16. Die Orthodox Jewish Bible verbindet beide Stellen ausdrücklich als „Moshiach, das Begehren aller Nationen".',
    fundstelle: 'Haggai 2,7',
    status: 'Strong H2532 · ḥemdat ← Ḥ-M-D',
    kern: 'חֶמְדַּת',
  },

  // ---- C — Malachi 3,1: the messenger of the covenant ----
  mal31: {
    typ: 'bibel',
    kurz: 'Plötzlich kommt zu seinem Tempel der Bote des Bundes, nach dem ihr verlangt.',
    original:
      'וּפִתְאֹם יָבוֹא אֶל הֵיכָלוֹ הָאָדוֹן אֲשֶׁר אַתֶּם מְבַקְשִׁים וּמַלְאַךְ הַבְּרִית אֲשֶׁר אַתֶּם חֲפֵצִים',
    sprache: 'he',
    translit:
      'û-p̄itʾōm yāvôʾ ʾel-hêḵālô hā-ʾādôn ʾăšer ʾattem mᵉvaqšîm, û-malʾaḵ ha-bᵉrît ʾăšer ʾattem ḥăp̄ēṣîm',
    uebersetzung:
      '„Und plötzlich wird zu seinem Tempel kommen der Herr, den ihr sucht, und der Bote des Bundes (malʾaḵ ha-bᵉrît), nach dem ihr verlangt." — Haggai 2,7 und Maleachi 3,1 sprechen von derselben Figur (Tempel-Bezug). „Plötzlich zum Tempel kommen" = die Nachtreise (Isrāʾ, Koran 17,1: in einer Nacht vom heiligen zum fernsten Gebetshaus).',
    fundstelle: 'Maleachi 3,1',
    kern: 'מַלְאַךְ הַבְּרִית',
  },

  // ---- The beloved: radiant, standard-bearer among ten thousand (dagal) ----
  song510: {
    typ: 'bibel',
    kurz: 'Mein Geliebter ist strahlend und rot, dāgûl — bannertragend unter Zehntausend.',
    original: 'דּוֹדִי צַח וְאָדוֹם דָּגוּל מֵרְבָבָה',
    sprache: 'he',
    translit: 'dôdî ṣaḥ wᵉ-ʾādôm, dāgûl mē-rᵉvāvāh',
    uebersetzung:
      '„Mein Geliebter ist strahlend und rot, hervorragend (bannertragend, dāgûl) unter Zehntausend (rᵉvāvāh)." — Rashi: „von vielen Heeren umgeben"; Barnes: „Anführer von zehntausend Kriegern". Dieselbe „Zehntausend" wie die „Zehntausende Heiliger" von 5. Mose 33,2 (Siegel III) — Sifrei Devarim verbindet beide; mit Zehntausend zog der Prophet ﷺ in Mekka ein.',
    fundstelle: 'Hohelied 5,10',
    kern: 'דָּגוּל מֵרְבָבָה',
  },

  // ---- Head of finest gold — phaz = Arabian gold ----
  song511: {
    typ: 'bibel',
    kurz: 'Sein Haupt ist feinstes Gold (paz), sein Haar lockig, schwarz wie ein Rabe (ʿoreb).',
    original: 'רֹאשׁוֹ כֶּתֶם פָּז קְוֻּצּוֹתָיו תַּלְתַּלִּים שְׁחֹרוֹת כָּעוֹרֵב',
    sprache: 'he',
    translit: 'rōʾšô ketem pāz, qᵉwuṣṣôtāyw taltallîm, šᵉḥōrôt kā-ʿôrēv',
    uebersetzung:
      '„Sein Haupt ist gediegenes Gold (ketem pāz), seine Locken hangend, schwarz wie ein Rabe (ʿôrēv)." — paz = speziell arabisches Gold (Gill; Tanchum Yerushalmi: höchste, „gepriesenste" Qualität; Diodorus: aus Arabien). Und ʿoreb (Rabe) ↔ ʿarab (Araber): Unterschied nur in den Vokalpunkten (Strong).',
    fundstelle: 'Hohelied 5,11',
    kern: 'כֶּתֶם פָּז',
  },

  // ---- Legs like marble pillars, aspect like Lebanon, cedars ----
  song515: {
    typ: 'bibel',
    kurz: 'Seine Beine wie Marmorsäulen; sein Anblick wie der Libanon, erlesen wie die Zedern.',
    original:
      'שׁוֹקָיו עַמּוּדֵי שֵׁשׁ מְיֻסָּדִים עַל אַדְנֵי פָז מַרְאֵהוּ כַּלְּבָנוֹן בָּחוּר כָּאֲרָזִים',
    sprache: 'he',
    translit: 'šôqāyw ʿammûdê šēš mᵉyussādîm ʿal-ʾadnê p̄āz, marʾēhû ka-Lᵉvānôn, bāḥûr kā-ʾărāzîm',
    uebersetzung:
      '„Seine Beine sind Marmorsäulen (ʿammûdê šēš), gegründet auf Sockel von feinem Gold; sein Anblick wie der Libanon, erlesen wie die Zedern." — Hadith: kräftige große Gelenke und kraftvoller Gang; „Ich habe nichts Schöneres gesehen als den Gesandten Gottes" (al-Shamāʾil). Side-by-Side mit der überlieferten Physiognomie.',
    fundstelle: 'Hohelied 5,15',
    kern: 'עַמּוּדֵי שֵׁשׁ',
  },

  // ---- Quran 61,6: Jesus announces Aḥmad ----
  q616: {
    typ: 'quran',
    kurz: 'Jesus: Ich verkünde einen Gesandten, der nach mir kommt; sein Name ist Aḥmad.',
    original:
      'وَمُبَشِّرًا بِرَسُولٍ يَأْتِي مِن بَعْدِي اسْمُهُ أَحْمَدُ',
    sprache: 'ar',
    translit: 'wa-mubashshiran bi-rasūlin yaʾtī min baʿdī smuhu aḥmad',
    uebersetzung:
      '„… und (Jesus kam) als Verkünder eines Gesandten, der nach mir kommt, dessen Name Aḥmad ist." — Aḥmad, „der Hochgepriesene", steht auf derselben Wurzel ḤMD wie das hebräische maḥamaddim. Der koranische Name selbst, mit dem Verweis auf die früheren Schriften.',
    fundstelle: 'Sure 61 (aṣ-Ṣaff), Vers 6',
    kern: 'أَحْمَدُ',
  },

  // ---- Quran 17,1: the Night Journey (Isrāʾ) ----
  q171: {
    typ: 'quran',
    kurz: 'Preis Ihm, der Seinen Diener nachts vom heiligen zum fernsten Gebetshaus führte.',
    original:
      'سُبْحَانَ الَّذِي أَسْرَىٰ بِعَبْدِهِ لَيْلًا مِّنَ الْمَسْجِدِ الْحَرَامِ إِلَى الْمَسْجِدِ الْأَقْصَى الَّذِي بَارَكْنَا حَوْلَهُ',
    sprache: 'ar',
    translit:
      'subḥāna lladhī asrā bi-ʿabdihi laylan mina l-masjidi l-ḥarāmi ilā l-masjidi l-aqṣā lladhī bāraknā ḥawlahu',
    uebersetzung:
      '„Preis sei Ihm, der Seinen Diener nachts (asrā) von der heiligen Gebetsstätte zur fernsten Gebetsstätte (al-Masjid al-Aqṣā) reisen ließ, deren Umgebung Wir gesegnet haben …" — die Nachtreise (Isrāʾ) zum Tempelplatz in Jerusalem: die Erfüllung von Maleachi 3,1 („plötzlich zum Tempel kommen"). „Herrlichkeit" spiegelt Haggai 2,7.',
    fundstelle: 'Sure 17 (al-Isrāʾ), Vers 1',
    kern: 'أَسْرَىٰ',
  },

  // ---- Quran 2,146: they recognise him as their own sons ----
  q2146: {
    typ: 'quran',
    kurz: 'Die das Buch empfingen, erkennen ihn, wie sie ihre eigenen Söhne erkennen.',
    original:
      'الَّذِينَ آتَيْنَاهُمُ الْكِتَابَ يَعْرِفُونَهُ كَمَا يَعْرِفُونَ أَبْنَاءَهُمْ',
    sprache: 'ar',
    translit: 'alladhīna ātaynāhumu l-kitāba yaʿrifūnahu kamā yaʿrifūna abnāʾahum',
    uebersetzung:
      '„Diejenigen, denen Wir die Schrift gegeben haben, erkennen ihn, wie sie ihre eigenen Söhne erkennen." — Wiedererkennen setzt detaillierte Beschreibungen voraus: genau die Physiognomie von Hld 5,10-16, die Zug um Zug mit den Hadithen zusammentrifft.',
    fundstelle: 'Sure 2 (al-Baqara), Vers 146',
    kern: 'يَعْرِفُونَهُ',
  },

  // ---- Source: the root Ḥ-M-D ----
  wurzelhmd: {
    typ: 'quelle',
    kurz: 'Ḥ-M-D im Hebräischen wie im Arabischen: begehren, köstlich sein, preisen.',
    uebersetzung:
      'Die Lexika (BDB, Gesenius, HALOT) geben für die hebräische Wurzel ח־מ־ד (ḥ-m-d): „begehren, Gefallen finden, köstlich/kostbar sein"; das mit מ gebildete Nomen maḥmad bedeutet „Begehrtes, Kostbares". Die arabische Wurzel ḥ-m-d trägt „preisen, loben"; ḥamd = „Lobpreis", muḥammad = „der Gepriesene, Preiswürdige", aḥmad = „der Hochgepriesene". Es ist dieselbe semitische Wurzel — Begehren und Preisen liegen in ihr beieinander. Tremper Longman (NICOT, S. 175): „maḥamaddim leitet sich von der Wurzel ḤMD ab."',
    fundstelle: 'BDB · Gesenius · HALOT · Lisān al-ʿArab · Longman, NICOT S. 175',
  },

  // ---- Source: Sanhedrin 43a — the Jewish name-exegesis ----
  sanhedrin: {
    typ: 'quelle',
    kurz: 'Sanhedrin 43a: die Weisen deuten Verse ohne den Namen als Eigennamen — eure eigene Methode.',
    uebersetzung:
      'Babylonischer Talmud, Sanhedrin 43a: Die Weisen deuteten Verse, die NICHT die wörtlichen Namen enthalten (Mattai, Nakai, Netzer, Buni, Toda), dennoch als Eigennamen — z. B. Toda ← das toda-Opfer (Ps 100,1). Eine vor-islamische, standardjüdische Exegese-Methode: aus einer Beschreibung wird ein Name. Genau diese Methode legitimiert maḥamaddim → Muhammad. Der Gegner kann sie nicht ablehnen, ohne seine eigene Tradition zu verwerfen.',
    fundstelle: 'Babylonischer Talmud, Sanhedrin 43a',
  },

  // ---- Source: hostile witness John Parkhurst ----
  parkhurst: {
    typ: 'quelle',
    kurz: 'John Parkhurst (Bischof, Lexikograph): „Von dieser Wurzel hatte Mohammed seinen Namen."',
    uebersetzung:
      'John Parkhurst — anglikanischer Geistlicher und hebräischer Lexikograph — hält zur Wurzel Ḥ-M-D ausdrücklich fest: „Von dieser Wurzel hatte der angebliche Prophet Mohammed seinen Namen." Er lehnte Muhammad ﷺ entschieden ab, konnte die sprachliche Verbindung der Wurzel zum Namen aber nicht leugnen. Godfrey Higgins nennt ihn „den unwilligsten der Zeugen" — ein feindlicher Zeuge für die ḤMD-Aḥmad-Verbindung.',
    fundstelle: 'John Parkhurst, Hebrew and English Lexicon, S. 217',
  },

  // ---- Source: hostile witness Godfrey Higgins ----
  higgins: {
    typ: 'quelle',
    kurz: 'Godfrey Higgins: „Hier ist Mohammed ausdrücklich von Haggai vorhergesagt … kein Ausweichen."',
    uebersetzung:
      'Der Historiker Godfrey Higgins schreibt zu Haggai 2,7: „Hier ist Mohammed ausdrücklich von Haggai vorhergesagt, und beim Namen … kein Ausweichen vor diesem klaren Text." Er nennt den feindseligen Lexikographen Parkhurst „den unwilligsten der Zeugen", der die Wurzel-Verbindung dennoch einräumt — ein weiterer nicht-muslimischer Zeuge für die ḤMD-Lesart von Haggai 2,7.',
    fundstelle: 'Godfrey Higgins, Anacalypsis X.V.10',
  },

  // ---- Source: Abdul Ahad Dawud ----
  dawud: {
    typ: 'quelle',
    kurz: 'Abdul Ahad Dawud (Ex-Priester): aḥmed ist die arabische Form von ḥimda — unbestreitbar.',
    uebersetzung:
      'Abdul Ahad Dawud — vormals der katholische Priester David Benjamin Keldani — führt die Wurzel Ḥ-M-D auf das hebräische ḥimda zurück und schließt: „Dass aḥmed die arabische Form von ḥimda ist, bleibt unbestreitbar und entscheidend." Ein Gelehrter, der beide Schriftsprachen beherrschte, bestätigt die Wurzel-Identität von Haggais ḥimdat und dem Namen Aḥmad.',
    fundstelle: 'Abdul Ahad Dawud, Muhammad in the Bible, S. 24',
  },

  // ---- Source: Orthodox Jewish Bible links maḥamaddim + ḥimdat ----
  ojb: {
    typ: 'quelle',
    kurz: 'Die Orthodox Jewish Bible verbindet maḥamaddim (Hld 5,16) mit ḥimdat (Hag 2,7) als Moshiach.',
    uebersetzung:
      'Die Orthodox Jewish Bible verknüpft maḥamaddim aus Hohelied 5,16 ausdrücklich mit dem ḥimdat kol ha-gôyim aus Haggai 2,7 und liest beide als Hinweis auf „Moshiach, das Begehren aller Nationen". Eine jüdische Bibelausgabe stellt damit selbst die textliche Verbindung her, auf der dieses Siegel ruht — beide Stellen, eine Wurzel, eine messianische Figur.',
    fundstelle: 'Orthodox Jewish Bible, S. 698 (Hld 5,16 · Hag 2,7)',
  },

  // ---- Source: "the latter glory" — New American Commentary / LXX ----
  herrlichkeit: {
    typ: 'quelle',
    kurz: 'Der „letztere" bezieht sich im Hebräischen auf die Herrlichkeit, nicht auf den Tempel.',
    uebersetzung:
      'Der Tempel-Einwand („Haggai meint den physischen Tempel — der stand zu Muhammads Zeit nicht") greift nicht: Das „letztere" (ha-aḥaron) bezieht sich im Hebräischen auf die Herrlichkeit (kāvôd), nicht auf den Tempel (New American Commentary, Vol. 21A; bestätigt durch Haggai 2,3 und die LXX). „Tempel" meint zudem den Ort. Die frühen Muslime befreiten den Tempelplatz und stellten dort den Monotheismus wieder her — bezeugt von der jüdischen Quelle Sefer Pitron Torah (9. Jh.).',
    fundstelle: 'New American Commentary 21A · LXX · Hag 2,3 · Sefer Pitron Torah',
  },

  // ---- Source: shalom = SLM = salām = Islām (Haggai 2,9) ----
  shalom: {
    typ: 'quelle',
    kurz: 'Haggai 2,9: „An diesem Ort gebe ich shalom" — Wurzel SLM = salām = Islām.',
    uebersetzung:
      '„An diesem Ort werde ich shalom (Frieden) geben" (Haggai 2,9) — shalom steht auf der Wurzel S-L-M, derselben wie salām und Islām. Der Vers verbindet den Ort des „Begehrens aller Völker" mit Frieden/Ergebung. Das Sefer Pitron Torah (jüdisch, 9. Jh.) hält fest: Die Muslime machten den Tempelplatz zu einem würdigen Anbetungsort des einen Gottes — eine jüdische Quelle bezeugt die Wiederherstellung des Monotheismus am Ort.',
    fundstelle: 'Haggai 2,9 · Wurzel S-L-M · Sefer Pitron Torah (9. Jh.)',
  },

  // ---- Source: the Haggai plural-verb is grammatically open (Kaiser/Wolf) ----
  pluralverb: {
    typ: 'quelle',
    kurz: 'Das Plural-Verb baʾu zwingt nicht zur Sach-Lesart — Grammatik mehrdeutig (Kaiser, Wolf).',
    uebersetzung:
      'Der Einwand, das Plural-Verb baʾu („sie werden kommen") in Haggai 2,7 mache aus ḥimdat „Schätze" statt einer Person, ist grammatisch nicht zwingend: Walter Kaiser — bei zwei Nomen („Begehren" + „Völker") richtet sich das Verb oft nach dem zweiten („Völker"), nicht nach dem Subjekt. Herbert Wolf: Haggai wählte bewusst mehrdeutig — eine Bedeutung ist messianisch. ISBE: beide Lesarten sind semantisch möglich. Per Grammatik nicht entscheidbar → beide passen auf den Islam.',
    fundstelle: 'Kaiser, S. 237 · Wolf, Haggai-Aufsatz S. 100 · ISBE',
  },

  // ---- Source: the allegorical license + Aetiology (Beegle) ----
  allegorie: {
    typ: 'quelle',
    kurz: 'Aetiologie / Popular Etymology (Beegle): hebr. Namen tragen die Bedeutung ihres Ursprungs.',
    uebersetzung:
      'Hebräische Namen tragen im AT regelmäßig die Bedeutung ihres Ursprungs — Beegle nennt es „Aetiologie / Popular Etymology": z. B. „Mosheh" (Mose) abgeleitet von mashah, „herausziehen" (2. Mose 2,10), obwohl der Name nicht buchstäblich „der Herausgezogene" ist. Diese Beschreibung-wird-Name-Logik ist im Alten Testament allgegenwärtig und liegt auch Sanhedrin 43a zugrunde — derselbe Mechanismus, der maḥamaddim → Muhammad trägt.',
    fundstelle: 'Beegle, „Aetiology / Popular Etymology" · vgl. Ex 2,10',
  },

  // ---- Source: the plural of majesty / intensity ----
  pluralis: {
    typ: 'quelle',
    kurz: 'Die Endung -īm bildet im Hebräischen auch Hoheit und Steigerung, nicht nur Mehrzahl.',
    uebersetzung:
      'Das Hebräische kennt neben dem Zahl-Plural den pluralis majestatis / intensivus (Gesenius §124): Elohim („Gott", grammatisch Plural, gemeint der eine Gott), adonaw („seine Herren", Gen 24,9, von Abraham — einer Person). maḥamaddim in Hld 5,16 ist ein solcher Hoheits-/Steigerungsplural: „über alle Maßen begehrenswert" — und zugleich, dem Klang nach, ein Hoheitsname. Das „-im" zwingt nicht zur Mehrzahl.',
    fundstelle: 'Gesenius §124 (pluralis majestatis) · Gen 24,9 (adonaw)',
  },

  // ---- Source: Ezekiel 16 — drastic imagery is still prophetic ----
  hesekiel16: {
    typ: 'quelle',
    kurz: 'Hesekiel 16,7.15 nutzt drastische sexuelle Bildsprache — und gilt als großes Prophetenbuch.',
    uebersetzung:
      'Der Einwand „Das Hohelied ist nur erotische Poesie" beweist zu viel: Hesekiel 16,7.15 schildert mit drastischer sexueller Bildsprache (Pubertät, Prostitution) das Verhältnis Gottes zu Jerusalem — und gilt unbestritten als eines der großen Prophetenbücher. Drastische oder erotische Sprache widerlegt prophetischen Status nicht. Wer Hesekiel als prophetisch akzeptiert, kann das Hohelied nicht als „bloß erotisch" disqualifizieren.',
    fundstelle: 'Hesekiel 16,7.15',
  },

  // ---- Source: the physiognomy hadiths ----
  physiognomie: {
    typ: 'quelle',
    kurz: 'Die authentischen Beschreibungen des Propheten ﷺ — Bukhārī, Musnad Aḥmad, al-Shamāʾil.',
    uebersetzung:
      'Die Beschreibung des Geliebten in Hld 5,10-16 (im Traum/Vision, 5,2: „ich schlief, aber mein Herz wachte") trifft Zug um Zug mit den authentischen Überlieferungen über Muhammad ﷺ zusammen: strahlend-rötlicher Teint, kräftige Gestalt, lockiges schwarzes Haar, große Gelenke, kraftvoller Gang, von zehntausend umgeben. Quellen: Ṣaḥīḥ al-Bukhārī 3561 und 2837, Musnad Aḥmad 946, al-Shamāʾil al-Muḥammadiyya 122. Koran 2,146: man erkannte ihn „wie die eigenen Söhne".',
    fundstelle: 'Bukhārī 3561 · 2837 · Musnad Aḥmad 946 · Shamāʾil 122',
  },

  // ---- Source: Ellen Davis — the most biblical of books ----
  davis: {
    typ: 'quelle',
    kurz: 'Ellen F. Davis: Das Hohelied ist „das biblischste der Bücher" — im Gespräch mit anderen Autoren.',
    uebersetzung:
      'Die AT-Forscherin Ellen F. Davis nennt das Hohelied „das biblischste der Bücher": der Dichter stehe im ständigen Gespräch mit anderen biblischen Autoren. Daraus folgen dichte Querverbindungen — „Küsse seines Mundes" (1,2) ↔ Deut 18,18 („Worte in seinen Mund"); „meine Schwester" (5,2) ↔ „aus ihren Brüdern" (Deut 18,18); „süßer als Honig" ↔ das Gesetz (Tanchum Yerushalmi); „Balsamgarten" (6,2) ↔ Baca/Mekka (Ps 84). Das Lied als Knotenpunkt der arabischen Prophezeiungen.',
    fundstelle: 'Ellen F. Davis, Song of Songs (Westminster Bible Companion)',
  },

  // ---- Source: the Quran's inimitable eloquence (the "sweetness of the mouth") ----
  eloquenz: {
    typ: 'quelle',
    kurz: '„Die Süße seines Mundes" (5,16) = die unnachahmliche Eloquenz des Korans (Zammit, Dawood).',
    uebersetzung:
      '„Die Süße seines Mundes" (Hld 5,16) lässt sich auf die unnachahmliche Eloquenz des Korans beziehen — Muhammads einziges angefordertes Wunder war der Koran selbst. Der Linguist Martin Zammit bestätigt die sprachliche Einzigartigkeit; der jüdische Übersetzer N. J. Dawood und Paul Casanova heben dieselbe rhetorische Kraft hervor. Mund und Wort des Geliebten als Bild für eine Offenbarung von überwältigender Sprachgewalt.',
    fundstelle: 'Zammit · N. J. Dawood (jüd. Übersetzer) · Casanova',
  },
}

// ---- Exhibit 1 (🔥 HAUPT): the Hebrew root graphic — maḥamaddim ↔ ḥimdat ↔ Aḥmad/Muhammad
// Reuses the .namen thread styling: the two Arabic name cards, the ḤMD bridge,
// and the Hebrew traces — the visual centre of the seal.
export const wurzelThread = {
  root: 'ח · מ · ד  ·  Ḥ-M-D',
  bedeutung: 'preisen · begehren · köstlich sein',
  namen: [
    { ar: 'مُحَمَّد', trans: 'Muḥammad', glanz: '„der Gepriesene / Vielgelobte"' },
    { ar: 'أَحْمَد', trans: 'Aḥmad', glanz: '„der Hochpreisende / Gepriesenste" (61,6)' },
  ],
  spuren: [
    { heb: 'מַחֲמַדִּים', wort: 'maḥamaddim', sinn: '„ganz und gar begehrenswert"', stelle: 'Hohelied 5,16', siegel: 'Siegel IV', hl: true },
    { heb: 'חֶמְדַּת', wort: 'ḥimdat', sinn: '„Begehren aller Völker"', stelle: 'Haggai 2,7', siegel: '—', hl: false },
    { heb: 'חֲמוּדוֹת', wort: 'ḥamudot', sinn: '„vielgeliebt"', stelle: 'Daniel 9,23', siegel: 'Siegel V', hl: false },
    { heb: 'מַחְמַד', wort: 'maḥmad', sinn: '„das Begehrte (der Augen)"', stelle: 'Hesekiel 24,16', siegel: '—', hl: false },
  ],
  pointe:
    'Eine Wurzel, drei Stellen — und an den hoffnungsvollsten Versen verdichtet sie sich. Im Hohelied steht sie, mit Vorsilbe und Hoheitsplural, dem Namen am nächsten: מַחֲמַדִּים ↔ أحمد / محمد, alle auf Ḥ-M-D.',
}

// ---- Exhibit 2: the Einsetzprobe — insert "Muhammad" into each verse ----------
export const einsetzprobe = {
  intro:
    'maḥamad steht an mehreren Stellen — aber nur an einer ergibt es als Eigenname Sinn. Setze „Muhammad" ein und lies, was herauskommt:',
  spalten: ['Stelle · hebr. Wort', 'Mit „Muhammad" eingesetzt'],
  zeilen: [
    {
      stelle: '1. Könige 20,6 · maḥamadeha',
      wort: 'מַחְמַדֶּיהָ',
      satz: '„… und sie raubten alles Muhammad davon."',
      sinn: 'Unsinn — „Kostbarkeiten", kein Name.',
      hl: false,
    },
    {
      stelle: '2. Chronik 36,19 · maḥamadeha',
      wort: 'מַחֲמַדֶּיהָ',
      satz: '„… und verbrannten alle Muhammad-Gefäße."',
      sinn: 'Unsinn — Sachbegriff „Kleinode".',
      hl: false,
    },
    {
      stelle: 'Jesaja 64,11 · maḥamadenu',
      wort: 'מַחֲמַדֵּינוּ',
      satz: '„… und all unser Muhammad liegt in Trümmern."',
      sinn: 'Unsinn — „unsere kostbaren Dinge".',
      hl: false,
    },
    {
      stelle: 'Hohelied 5,16 · maḥamaddim',
      wort: 'מַחֲמַדִּים',
      satz: '„… und er ist ganz Muhammad. Das ist mein Geliebter."',
      sinn: 'Sinn — als Name einer Person stimmig; einzige maskuline Nomen-Form.',
      hl: true,
    },
  ],
  pointe:
    'Nur Hld 5,16 trägt die spezifische maskuline Nomen-Form maḥamaddim und ergibt als Name Sinn. Drei andere Stellen scheitern an der Einsetzprobe — der Kontext entscheidet, nicht das bloße Vorkommen der Wurzel.',
}

// ---- Exhibit 3: physiognomy side-by-side (Hld 5,10-16 ↔ hadith) --------------
export const physiognomie = {
  intro:
    'Hld 5,10-16 beschreibt den Geliebten in der Vision (5,2: „ich schlief, aber mein Herz wachte"). Zeile für Zeile neben den authentischen Beschreibungen Muhammads ﷺ (Bukhārī, Musnad Aḥmad, al-Shamāʾil):',
  spalten: ['Hohelied 5,10-16', 'Hadith (Bukhārī · Aḥmad · Shamāʾil)'],
  zeilen: [
    {
      h: '„hervorragend (dāgûl) unter Zehntausend" (5,10) — Bannerträger/Heerführer (Rashi, Barnes).',
      j: 'Mit zehntausend zog der Prophet ﷺ siegreich in Mekka ein; „Anführer von zehntausend Kriegern".',
    },
    {
      h: '„strahlend und rot (ṣaḥ wᵉ-ʾādôm)" (5,10).',
      j: 'Heller, ins Rötliche spielender Teint (azhar al-lawn) — Bukhārī.',
    },
    {
      h: '„Haupt aus feinstem Gold (ketem pāz)" (5,11) — paz = arabisches Gold (Gill, Tanchum, Diodorus).',
      j: 'Edelste, „gepriesenste" Qualität — die höchste Auszeichnung der Erscheinung.',
    },
    {
      h: '„Haar … schwarz wie ein Rabe (ʿoreb)" (5,11).',
      j: 'Dichtes, schwarzes, leicht gewelltes Haar; ʿoreb ↔ ʿarab (nur Vokalpunkte, Strong).',
    },
    {
      h: '„Beine wie Marmorsäulen (ʿammûdê šēš)" (5,15).',
      j: 'Kräftige, große Gelenke und ein kraftvoller, fester Gang — al-Shamāʾil.',
    },
    {
      h: '„Anblick wie der Libanon, erlesen wie die Zedern" (5,15).',
      j: '„Ich habe nichts Schöneres gesehen als den Gesandten Gottes" — al-Shamāʾil 122.',
    },
  ],
  pointe:
    'Ein Dutzend Treffer in sieben Versen. Koran 2,146: man erkannte ihn „wie die eigenen Söhne" — was detaillierte Beschreibungen voraussetzt, genau wie hier.',
}

// ---- Exhibit 4: the Sanhedrin 43a panel — "your own method" ------------------
export const sanhedrinPanel = {
  intro:
    'Babylonischer Talmud, Sanhedrin 43a: Fünf Schüler werden vor Gericht gestellt; die Weisen deuten Verse, die ihre Namen NICHT enthalten, dennoch als Anspielung auf eben diese Namen. Beschreibung wird zum Namen — eine vor-islamische, standardjüdische Methode.',
  faelle: [
    { name: 'Mattai', heb: 'מתי', deutung: 'aus „mātai" (wann/genug?), Ps 42,3 — kein Vers nennt „Mattai".' },
    { name: 'Nakai', heb: 'נקאי', deutung: 'aus „nāqî" (unschuldig), Ex 23,7 — der Name selbst fehlt.' },
    { name: 'Netzer', heb: 'נצר', deutung: 'aus „nēṣer" (Spross), Jes 11,1 — als Eigenname gelesen.' },
    { name: 'Buni', heb: 'בוני', deutung: 'aus „bᵉnî" (mein Sohn), Ex 4,22 — Beschreibung → Name.' },
    { name: 'Toda', heb: 'תודה', deutung: 'aus dem toda-Opfer (Dank), Ps 100,1 — Wort wird Name.' },
  ],
  pointe:
    'Genau diese Methode — Beschreibung wird Eigenname — legitimiert maḥamaddim → Muhammad. Der Gegner kann sie nicht für Mattai/Nakai/Netzer akzeptieren und für maḥamaddim verwerfen, ohne mit zweierlei Maß zu messen.',
}

// ---- Exhibit 5: the cross-link diagram — the Song as hub ---------------------
export const verknuepfung = {
  intro:
    'Ellen Davis: das Hohelied ist „das biblischste der Bücher". Es steht als Knotenpunkt im ständigen Gespräch mit den anderen arabischen Prophezeiungen — Pfeile in fünf Richtungen:',
  nabe: { wort: 'מַחֲמַדִּים', stelle: 'Hohelied' },
  speichen: [
    { ziel: 'Deut 18,18', text: '„Küsse seines Mundes" (1,2) ↔ „Worte in seinen Mund"; „meine Schwester" (5,2) ↔ „aus ihren Brüdern".' },
    { ziel: 'Deut 33', text: '„Zehntausend" (dāgûl, 5,10) ↔ die 10.000 Heiligen (33,2) — Sifrei Devarim verbindet beide.' },
    { ziel: 'Psalm 84', text: '„Balsamgarten" (6,2) ↔ das „Tal Baca" (Baca = Balsambäume = Mekka).' },
    { ziel: 'Haggai 2,7', text: 'ḥimdat = „Begehren aller Völker", dieselbe Wurzel ḤMD — das Begehrte kommt zum Haus.' },
    { ziel: 'Maleachi 3,1', text: '„plötzlich zum Tempel kommen" ↔ die Nachtreise (Isrāʾ, Koran 17,1).' },
  ],
  pointe:
    'Ein Namens-Anklang allein wäre Zufall. Aber Name (Ḥ-M-D) + ein Dutzend physiognomische Treffer + Querverbindungen zu fünf weiteren Prophezeiungen — der Zufall ist ausgeschlossen.',
}

// ---- Exhibit 6: the hostile-witnesses panel (Parkhurst + Higgins) -----------
export const feindzeugen = {
  intro:
    'Zwei nicht-muslimische Gelehrte räumen die Wurzel-Verbindung ein — gegen die eigene Überzeugung. Kurzzitate, sauber attribuiert:',
  zeugen: [
    {
      name: 'John Parkhurst',
      rolle: 'Anglik. Geistlicher · hebr. Lexikograph',
      zitat: '„Von dieser Wurzel hatte Mohammed seinen Namen."',
      kontext: 'Lehnte Muhammad ﷺ ab — konnte die ḤMD-Verbindung aber nicht leugnen.',
      belegId: 'parkhurst',
    },
    {
      name: 'Godfrey Higgins',
      rolle: 'Historiker',
      zitat: '„Hier ist Mohammed ausdrücklich von Haggai vorhergesagt."',
      kontext: 'Nennt Parkhurst „den unwilligsten der Zeugen" — kein Ausweichen vor dem Text.',
      belegId: 'higgins',
    },
  ],
  pointe:
    'Selbst der feindselige Lexikograph gibt die ḤMD-Aḥmad-Verbindung zu. Wer den unwilligen Zeugen ernst nimmt, hat den schwersten Teil schon eingeräumt.',
}

// ---- Exhibit 7 (kept): the plural of majesty --------------------------------
export const pluralHoheit = {
  intro:
    'Die Endung ־ים (-īm) ist im Hebräischen nicht nur Mehrzahl. Sie drückt auch Hoheit und Steigerung aus — der eine Gott heißt grammatisch im Plural; Abraham heißt adonaw („seine Herren"), und ist eine Person.',
  beispiele: [
    { he: 'אֱלֹהִים', t: 'Elohim', wort: '„Gott"', sinn: 'grammatisch Plural — gemeint ist der eine Gott', hl: false },
    { he: 'אֲדֹנָיו', t: 'adonaw', wort: '„seine Herren"', sinn: 'Gen 24,9 — von Abraham, einer Person', hl: false },
    { he: 'מַחֲמַדִּים', t: 'maḥamaddim', wort: '„der ganz Gepriesene"', sinn: 'Steigerung: über alles begehrenswert', hl: true },
  ],
  pointe:
    'Als Steigerungs- und Hoheitsform gelesen, ist maḥamaddim kein bloßer Plural von „nett", sondern: „der über alles Gepriesene". Das „-im" zwingt nicht zur Mehrzahl.',
}

export const hoheliedKonter: KonterItem[] = [
  {
    tier: 'stone',
    einwand: '„maḥamaddim heißt nur ‚begehrenswert‘ — kein Name."',
    konter:
      'Die jüdische Standard-Exegese verwandelt Beschreibungen in Namen — und das VOR dem Islam. Sanhedrin 43a deutet Verse, die die Namen Mattai, Nakai, Netzer gar nicht enthalten, dennoch als eben diese Eigennamen. Mit derselben Methode gilt maḥamaddim = Muhammad. Wer die Methode für Mattai/Nakai/Netzer akzeptiert und hier verwirft, misst mit zweierlei Maß.',
    belegId: 'sanhedrin',
  },
  {
    tier: 'stone',
    einwand: '„Das ‚-im‘ am Ende ist Plural — es geht nicht um eine Person."',
    konter:
      'Das hebräische ־im bedeutet nicht immer Mehrzahl, sondern oft Majestät und Steigerung. Beispiel: Elohim (wörtl. „Götter") = der EINE Gott Israels. Und Gen 24,9 nennt Abraham „adonaw" („seine Herren") — eine einzelne Person. So auch maḥamaddim: eine Person, im Pluralis Majestatis — „der ganz und gar Gepriesene".',
    belegId: 'pluralis',
  },
  {
    tier: 'stone',
    einwand: '„maḥamad steht auch in 1 Kön 20,6 / 2 Chr 36,19 — also reiner Zufall."',
    konter:
      'Setze dort „Muhammad" ein: „sie raubten alles Muhammad davon" — sinnlos. Nur in Hld 5,16 ergibt es als Name Sinn. Und nur dort erscheint die spezifische maskuline Nomen-Form maḥamaddim. Die anderen Stellen bedeuten „Kostbarkeiten". Kein Zufall — die Einsetzprobe trennt das Sachwort vom Namen, und nur eine Stelle besteht sie.',
    belegId: 'song516',
  },
  {
    tier: 'stone',
    einwand: '„Das Hohelied ist nur erotische Poesie — keine Prophetie."',
    konter:
      'Dann wäre Hesekiel „Pornografie"? Hes 16,7.15 nutzt drastische sexuelle Bildsprache (Pubertät, Prostitution) — und gilt als eines der großen Prophetenbücher. Drastische oder erotische Sprache widerlegt prophetischen Status nicht. Wer Hesekiel als prophetisch akzeptiert, kann das Hohelied nicht als „bloß erotisch" disqualifizieren.',
    belegId: 'hesekiel16',
  },
  {
    tier: 'marble',
    einwand: '„Haggai: ‚Begehren‘ ist Plural (baʾu), also Schätze, nicht eine Person."',
    konter:
      'Die hebräische Grammatik ist hier mehrdeutig. Kaiser: bei zwei Nomen („Begehren" + „Völker") richtet sich das Verb oft nach dem zweiten. Wolf: Haggai wählte bewusst mehrdeutig — eine Bedeutung ist messianisch. ISBE: beide Lesarten sind möglich. Per Grammatik nicht entscheidbar → beide Lesarten offen, und beide passen auf den Islam. Ehrlich: nicht „Singular bewiesen", sondern „offen".',
    belegId: 'pluralverb',
  },
  {
    tier: 'stone',
    einwand: '„Haggai meint den physischen Tempel — der stand zu Muhammads Zeit nicht."',
    konter:
      'Der „letztere" (ha-aḥaron) bezieht sich im Hebräischen auf die HERRLICHKEIT, nicht auf den Tempel (New American Commentary; bestätigt durch Hag 2,3 und die LXX). „Tempel" meint zudem den Ort. Die Muslime befreiten den Tempelplatz und stellten dort den Monotheismus wieder her — bezeugt von der jüdischen Quelle Sefer Pitron Torah (9. Jh.). Haggai 2,9: „shalom" (SLM = salām = Islām).',
    belegId: 'herrlichkeit',
  },
]

export const hoheliedScholar: ScholarItem[] = [
  {
    tier: 'stone',
    h: '4.1 — Der Name: maḥamaddim (Hld 5,16)',
    body: 'Hld 5,16: „ḥikkô mamtaqqîm wᵉ-kullô maḥămaddîm" — „sein Mund ist Süße, er ist ganz begehrenswert". מַחֲמַדִּים ist die mit מ gebildete maskuline Nomen-Form der Wurzel Ḥ-M-D, die vollste im Tanach. Konsens zur Wurzel: Tremper Longman (NICOT) — „maḥamaddim leitet sich von der Wurzel ḤMD ab"; Herbert Wolf — kullo maḥamaddim illustriert den Bezug auf ein Individuum; Pulpit Commentary — „das Ganze von ihm ist desires", verbindet es mit Haggais ḥimdat. Die poetische Tarnung: der Autor reimt maḥamaddim kunstvoll auf das vorangehende mamtaqqim („Süße") — Name UND Beschreibung zugleich (Richard S. Hess bestätigt die Wortwahl-Nähe). Pluralis Majestatis (־im): wie Elohim (ein Gott) und adonaw (Abraham, Gen 24,9) — ־im = Majestät, nicht zwingend Mehrzahl. Die Einsetzprobe (entscheidend): maḥamad/maḥamadeha/maḥamadenu steht auch in 1 Kön 20,6; 2 Chr 36,19; Jes 64,11 — aber als „Kostbarkeiten", nie messianisch, und „Muhammad" eingesetzt ergibt Unsinn. NUR Hld 5,16 trägt die maskuline Form und ergibt als Name Sinn.',
  },
  {
    tier: 'stone',
    h: '4.2 — Haggai 2,7: ḥimdat — das Begehren aller Völker',
    body: 'ḥimdat (חמדת) = dieselbe Wurzel Ḥ-M-D wie Aḥmad. Eingeständnisse FEINDLICHER Zeugen: John Parkhurst (Bischof, Lexikograph) — „Von dieser Wurzel hatte der angebliche Prophet Mohammed seinen Namen" (lehnte ihn ab, konnte die Verbindung aber nicht leugnen). Godfrey Higgins (Historiker) — „Hier ist Mohammed ausdrücklich von Haggai vorhergesagt … kein Ausweichen vor diesem klaren Text", und nennt Parkhurst „den unwilligsten der Zeugen". Abdul Ahad Dawud (Ex-katholischer Priester, früher David Benjamin Keldani) — „dass aḥmed die arabische Form von ḥimda ist, bleibt unbestreitbar und entscheidend". Die Orthodox Jewish Bible verbindet maḥamaddim (Hld 5,16) explizit mit ḥimdat (Hag 2,7) als „Moshiach, das Begehren aller Nationen". Plural-Verb-Einwand entkräftet: baʾu (Plural) zwingt nicht zur Sach-Lesart (Kaiser: Verb-Kongruenz mit zweitem Nomen; Wolf: bewusste Ambiguität, eine Bedeutung messianisch; ISBE: beide Lesarten möglich). Tempel-Einwand entkräftet: „letztere HERRLICHKEIT", nicht „letzterer Tempel" (New American Commentary; LXX; Hag 2,3); Tempel = auch der Ort → frühe Muslime stellten dort Monotheismus her. shalom-Verbindung: Hag 2,9 „an diesem Ort gebe ich shalom" — Wurzel SLM = salām = Islām; Sefer Pitron Torah (9. Jh., jüd.): die Muslime machten den Tempel zu einem würdigen Anbetungsort des einen Gottes.',
  },
  {
    tier: 'marble',
    h: '4.3 — Maleachi 3,1: Der Bote des Bundes & die Nachtreise',
    body: 'Maleachi 3,1: „Plötzlich wird zu seinem Tempel kommen … der Bote des Bundes." Haggai 2,7 + Mal 3,1 = dieselbe Figur (Tempel-Bezug). Erfüllung: die Nachtreise (Isrāʾ, Koran 17,1) — Muhammad ﷺ in einer Nacht von Mekka zum Tempel(platz) in Jerusalem. „Plötzlich zum Tempel kommen" = Augenzeugen in Jerusalem hätten sein plötzliches Erscheinen wahrgenommen. „Herrlichkeit" (Koran 17,1: „deren Umgebung Wir gesegnet haben") spiegelt Haggai 2,7. (Stark als kohärente Lesart; „plötzlich zum Tempel" bleibt auslegungsoffen — daher als Erfüllung, nicht als Zwang geführt.)',
  },
  {
    tier: 'stone',
    h: '4.4 — Die jüdische Namens-Exegese (Sanhedrin 43a)',
    body: 'Babylonischer Talmud, Sanhedrin 43a: Die Weisen deuteten Verse, die NICHT die wörtlichen Namen (Mattai, Nakai, Netzer, Buni, Toda) enthalten, dennoch als Eigennamen — z. B. Toda ← das toda-Opfer (Ps 100,1). Eine vor-islamische, standardjüdische Exegese-Methode: aus einer Beschreibung wird ein Name. Genau diese Methode legitimiert maḥamaddim → Muhammad. Der Gegner kann die Methode nicht ablehnen, ohne seine eigene Tradition zu verwerfen. „Aetiologie / Popular Etymology" (Beegle): hebräische Namen tragen die Bedeutung ihres Ursprungs — Beispiel „Mosheh" ← mashah, „herausziehen" (Ex 2,10). Im AT allgegenwärtig.',
  },
  {
    tier: 'stone',
    h: '4.5 — Die Physiognomie: passt „wie angegossen"',
    body: 'Hld 5,10-16 beschreibt den Geliebten im Traum/Vision (5,2: „ich schlief, aber mein Herz wachte" → symbolisch, nicht wörtlich). Treffer mit den authentischen Beschreibungen Muhammads ﷺ (Bukhārī 3561/2837, Musnad Aḥmad 946, al-Shamāʾil 122): „hervorragend unter Zehntausend" (5,10) — dāgûl = Bannerträger/Heerführer (Rashi: „von vielen Heeren umgeben"; Barnes: „Anführer von zehntausend Kriegern") → direkte Brücke zu Deut 33 (10.000 Heilige, Siegel III), und Sifrei Devarim verbindet beide. „Haupt aus feinstem Gold" (5,11) — paz = speziell ARABISCHES Gold (Gill; Tanchum Yerushalmi: höchste, „gepriesenste" Qualität; Diodorus: aus Arabien). „Haar … schwarz wie ein Rabe" (5,11) — ʿoreb (Rabe) ↔ ʿarab (Araber), Unterschied nur in den Vokalpunkten (Strong; daher als suggestiver Zusatz markiert). „Beine wie Marmorsäulen" — Hadith: große Gelenke, kraftvoller Gang. „Anblick wie der Libanon, erlesen wie seine Zedern" — Hadith: „Ich habe nichts Schöneres gesehen als den Gesandten Gottes." Koran 2,146: die Schriftkundigen erkannten ihn „wie ihre eigenen Söhne" → setzt detaillierte Beschreibungen voraus, genau wie hier.',
  },
  {
    tier: 'stone',
    h: '4.6 — Die Verknüpfung aller arabischen Prophezeiungen (Ellen Davis)',
    body: 'AT-Forscherin Ellen F. Davis: Das Hohelied ist „das biblischste der Bücher" — der Dichter im ständigen Gespräch mit anderen biblischen Autoren. Querverbindungen im Hohelied: „Küsse seines Mundes" (1,2) ↔ Deut 18,18 „Worte in seinen Mund" (Artscroll Tanach: „Küsse des Mundes" = Prophetie). „meine Schwester, meine Freundin" (5,2) — der Geliebte ist „Bruder" Israels ↔ Deut 18,18 „aus ihren Brüdern". „Mund süß … süßer als Honig" ↔ Ps 19,8-10 (Gottes Gebote süßer als Honig); Tanchum Yerushalmi bezieht es auf das GESETZ. Geliebter im „Garten, wo Balsambäume wachsen" (6,2) ↔ Ps 84 „Tal Baca" (Baca = Balsambäume = Mekka, Siegel III). „Wächter … nahmen mir den Schleier" (5,7) — negativ dargestellte Jerusalemer Wächter; passt nicht zur erotischen Lesart, wohl aber zur prophetischen. „Süße seines Mundes" (5,16) = die unnachahmliche Eloquenz des Korans (Zammit; Dawood [jüd. Übersetzer]; Casanova: Muhammads einziges angefordertes Wunder war der Koran).',
  },
]

export const hoheliedVernetzung = [
  { ziel: 'Das Fundament', text: 'Jesus nennt ihn Aḥmad (61,6) — hier der hebräische Beleg derselben Wurzel ḤMD im Alten Testament: maḥamaddim.' },
  { ziel: 'Siegel II — Prophet wie Mose', text: '„Küsse des Mundes" (1,2) und „meine Schwester" (5,2) = Deut 18,18 („Worte in den Mund", „aus ihren Brüdern").' },
  { ziel: 'Siegel III — Arabische Prophezeiungen', text: 'dāgûl „zehntausend" (5,10) = Deut 33 (10.000 Heilige); „Balsambäume" (6,2) = Baca/Mekka (Ps 84) — Sifrei Devarim verbindet beide.' },
  { ziel: 'Siegel V — Daniel', text: 'Hld 5,10-15 (Statue: Haupt aus Gold → Beine aus Marmor) spielt bewusst mit Daniel 2,31-33 (Nebukadnezars Statue) — Ariel Bloch & Ellen Davis bestätigen die Parallele.' },
]

export const hoheliedGleicheMassstaebe =
  'Der Kritiker akzeptiert die jüdische Methode aus Sanhedrin 43a (Beschreibung → Name) für Mattai, Nakai und Netzer — verwirft sie aber bei maḥamaddim. Er akzeptiert die drastische Bildsprache Hesekiels als prophetisch — disqualifiziert aber das Hohelied als „bloß erotisch". Selbst der feindselige Lexikograph Parkhurst gibt die ḤMD-Aḥmad-Verbindung zu. Auf gleichen Maßstäben trägt der Text einen Namen — und es ist nur einer. Wir behaupten keinen Einzelbeweis: ein Namens-Anklang wäre Zufall, aber Name + ein Dutzend physiognomischer Treffer + Querverbindungen zu fünf weiteren Prophezeiungen + die jüdische Exegese-Methode + feindliche Zeugen schließen den Zufall aus.'
