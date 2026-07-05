import type { Beleg } from '../types'

// ---------------------------------------------------------------------------
// VERTEIDIGUNGS-SIEGEL — „Falscher Prophet?" (Eingangstür / SPEC §6.V).
// Kern-These: Jesus warnte vor GESETZLOSIGKEIT — und die brachte PAULUS, nicht
// Muhammad ﷺ. Jesu eigener Früchte-Test (Mt 7) entlarvt die Inkonsistenz der
// Ankläger. Dieses Buch dreht den „falscher Prophet"-Vorwurf um: es misst
// beide Männer mit Jesu eigenem Maßstab — und zeigt, wessen Lehre Gesetzlosig-
// keit (anomia) brachte. Enthält den Früchte-Test, das Paulus-Dossier (drei
// faule Früchte), die anomia-Exegese, die zûd-Analyse (Dtn 18,20), die
// Aufhebung als biblisches Prinzip und die Doppelmaß-Pointe.
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

export const verteidigungThese =
  'Der Vorwurf lautet: Muhammad ﷺ sei der „falsche Prophet", vor dem Jesus warnte. Doch Jesus gab selbst den Maßstab — und er trifft den Ankläger. Jesus warnte vor Gesetzlosigkeit (anomia), und er hob das Gesetz nicht auf: „Ich bin nicht gekommen aufzulösen, sondern zu erfüllen" (Mt 5,17). Wer aber löste das Gesetz tatsächlich auf? Nicht Muhammad ﷺ, dessen Lehre dem Evangelium gleicht — sondern Paulus, der die Werke des Gesetzes für nichtig erklärte. Legt man Jesu eigenen Früchte-Test (Mt 7) und seinen eigenen Gesetzes-Test (Mt 5,19) an, zerbricht der Vorwurf in der Hand dessen, der ihn erhebt. Das ist die Eingangstür: nicht wer den Propheten findet, sondern wer den Maßstab überhaupt gleich anlegt.'

export const verteidigungSteps: Step[] = [
  {
    n: 'I',
    h: 'Jesus warnte vor Gesetzlosigkeit',
    body: 'Jesus hob das Gesetz nicht auf: „Denkt nicht, ich sei gekommen, das Gesetz aufzulösen … ich bin nicht gekommen aufzulösen, sondern zu erfüllen" (Mt 5,17). Und er verschärft: „Wer eines dieser kleinsten Gebote auflöst … wird der Kleinste heißen im Himmelreich" (Mt 5,19). Wer ins Leben will, „halte die Gebote" (Mt 19,17). Der Maßstab ist gesetzt — von Jesus selbst.',
  },
  {
    n: 'II',
    h: 'Der Test ist die Frucht, nicht der Name',
    body: '„Hütet euch vor den falschen Propheten … an ihren Früchten werdet ihr sie erkennen" (Mt 7,15-16). Jesus nennt keinen Namen; er gibt einen Test. Und am Ende weist er ab: „Weicht von mir, ihr Täter der Gesetzlosigkeit (anomia)!" (Mt 7,23). Der falsche Prophet ist also der, der Gesetzlosigkeit lehrt — nicht der, der das Gesetz hält.',
  },
  {
    n: 'III',
    h: 'Wer brachte die Gesetzlosigkeit?',
    body: 'Muhammads ﷺ Lehre deckt sich Zug um Zug mit dem Evangelium — Barmherzigkeit, Almosen, Demut, Vergebung, kein Zwang (Synopse). Paulus dagegen erklärte: „der Mensch wird gerecht ohne des Gesetzes Werke" (Röm 3,28) und gab selbst zu, sich „denen ohne Gesetz wie einer ohne Gesetz" zu machen (1 Kor 9,21). Die anomia, vor der Jesus warnte, hat einen Urheber — und es ist nicht der Prophet aus Arabien.',
  },
  {
    n: 'IV',
    h: 'Gleiche Maßstäbe',
    body: 'Der Kritiker akzeptiert bei Paulus eine nicht eingetroffene Prophezeiung (1 Thess 4,15-17), eine selbst zugegebene Doppelrolle (1 Kor 9,20-21) und die Aufhebung des Gesetzes als „inspiriert" — bei Muhammad ﷺ verlangt er Fehlerfreiheit. Zweierlei Gewicht ist „ein Gräuel für den HERRN" (Spr 20,10). Legt man Jesu Test gleich an beide an, fällt der Vorwurf — nicht der Prophet.',
  },
]

export const verteidigungBelege: Record<string, Beleg> = {
  // ---- Mt 5,17-19 — Jesus does not abolish the Law ----
  mt517: {
    typ: 'bibel',
    kurz: 'Denkt nicht, ich sei gekommen, das Gesetz aufzulösen — sondern zu erfüllen.',
    original:
      'μὴ νομίσητε ὅτι ἦλθον καταλῦσαι τὸν νόμον ἢ τοὺς προφήτας· οὐκ ἦλθον καταλῦσαι ἀλλὰ πληρῶσαι',
    sprache: 'grc',
    translit:
      'mḕ nomísēte hóti êlthon katalŷsai tòn nómon ḕ toùs prophḗtas; ouk êlthon katalŷsai allà plērôsai',
    uebersetzung:
      '„Denkt nicht, ich sei gekommen, das Gesetz oder die Propheten aufzulösen (katalŷsai); ich bin nicht gekommen aufzulösen, sondern zu erfüllen (plērôsai)." — Jesus selbst stellt sich GEGEN die Aufhebung des Gesetzes.',
    fundstelle: 'Matthäus 5,17',
    status: 'Strong G2647 · katalýō = auflösen',
    kern: 'οὐκ ... καταλῦσαι ἀλλὰ πληρῶσαι',
  },

  // ---- Mt 5,19 — whoever loosens the least commandment ----
  mt519: {
    typ: 'bibel',
    kurz: 'Wer eines dieser kleinsten Gebote auflöst, wird der Kleinste heißen im Himmelreich.',
    original:
      'ὃς ἐὰν οὖν λύσῃ μίαν τῶν ἐντολῶν τούτων τῶν ἐλαχίστων … ἐλάχιστος κληθήσεται ἐν τῇ βασιλείᾳ τῶν οὐρανῶν',
    sprache: 'grc',
    translit:
      'hòs eàn oûn lýsē mían tôn entolôn toútōn tôn elachístōn … eláchistos klēthḗsetai en tê basileíā tôn ouranôn',
    uebersetzung:
      '„Wer nun eines dieser kleinsten Gebote auflöst (lýsē) und die Menschen so lehrt, der wird der Kleinste (eláchistos) heißen im Himmelreich; wer sie aber tut und lehrt, der wird groß heißen." — Wer das Gesetz auflöst, wird „der Kleinste / Geringste" genannt. Der Name „Paulus" heißt lateinisch genau das.',
    fundstelle: 'Matthäus 5,19',
    status: 'Strong G1646 · eláchistos = der Geringste',
    kern: 'ἐλάχιστος',
  },

  // ---- Mt 7,21-23 — depart from me, you lawless ----
  mt721: {
    typ: 'bibel',
    kurz: 'Weicht von mir, ihr Täter der Gesetzlosigkeit (anomia)!',
    original:
      'καὶ τότε ὁμολογήσω αὐτοῖς ὅτι οὐδέποτε ἔγνων ὑμᾶς· ἀποχωρεῖτε ἀπ’ ἐμοῦ οἱ ἐργαζόμενοι τὴν ἀνομίαν',
    sprache: 'grc',
    translit:
      'kaì tóte homologḗsō autoîs hóti oudépote égnōn hymâs; apochōreîte ap’ emoû hoi ergazómenoi tḕn anomían',
    uebersetzung:
      '„Nicht jeder, der zu mir sagt: Herr, Herr! … Und dann werde ich ihnen bekennen: Ich habe euch nie gekannt; weicht von mir, ihr Täter der Gesetzlosigkeit (anomía)!" (Mt 7,21-23). Die abgewiesenen sind die anomoi — die das Gesetz nicht halten.',
    fundstelle: 'Matthäus 7,21-23',
    status: 'Strong G458 · anomía = Gesetzlosigkeit',
    kern: 'τὴν ἀνομίαν',
  },

  // ---- Mt 7,15-16 — by their fruits ----
  mt715: {
    typ: 'bibel',
    kurz: 'Hütet euch vor den falschen Propheten … an ihren Früchten werdet ihr sie erkennen.',
    original:
      'προσέχετε ἀπὸ τῶν ψευδοπροφητῶν, οἵτινες ἔρχονται πρὸς ὑμᾶς ἐν ἐνδύμασιν προβάτων, ἔσωθεν δέ εἰσιν λύκοι ἅρπαγες',
    sprache: 'grc',
    translit:
      'proséchete apò tôn pseudoprophētôn, hoítines érchontai pròs hymâs en endýmasin probátōn, ésōthen dé eisin lýkoi hárpages',
    uebersetzung:
      '„Hütet euch vor den falschen Propheten, die in Schafskleidern zu euch kommen, inwendig aber reißende Wölfe sind. An ihren Früchten werdet ihr sie erkennen." (Mt 7,15-16). Kein Name, sondern ein Test: die Frucht. Das Bild — Wolf im Schafspelz — kehrt unten wieder.',
    fundstelle: 'Matthäus 7,15-16',
    kern: 'λύκοι ἅρπαγες',
  },

  // ---- Mt 19,17 — keep the commandments ----
  mt1917: {
    typ: 'bibel',
    kurz: 'Willst du ins Leben eingehen, so halte die Gebote.',
    original: 'εἰ δὲ θέλεις εἰς τὴν ζωὴν εἰσελθεῖν, τήρησον τὰς ἐντολάς',
    sprache: 'grc',
    translit: 'ei dè théleis eis tḕn zōḕn eiseltheîn, tḗrēson tàs entolás',
    uebersetzung:
      '„Willst du aber ins Leben eingehen, so halte die Gebote (tḗrēson tàs entolás)." — Auf die Frage nach dem ewigen Leben verweist Jesus auf das Halten des Gesetzes, nicht auf seine Aufhebung.',
    fundstelle: 'Matthäus 19,17',
    kern: 'τήρησον τὰς ἐντολάς',
  },

  // ---- Jer 31,31-32 — the new covenant was foretold ----
  jer3131: {
    typ: 'bibel',
    kurz: 'Siehe, es kommen Tage, da ich einen neuen Bund schließen werde.',
    original:
      'הִנֵּה יָמִים בָּאִים נְאֻם יְהוָה וְכָרַתִּי אֶת בֵּית יִשְׂרָאֵל וְאֶת בֵּית יְהוּדָה בְּרִית חֲדָשָׁה',
    sprache: 'he',
    translit:
      'hinnēh yāmîm bāʾîm nᵉʾum YHWH, wᵉ-ḵārattî ʾet-bêt Yiśrāʾēl wᵉ-ʾet-bêt Yᵉhûdāh bᵉrît ḥădāšāh',
    uebersetzung:
      '„Siehe, es kommen Tage, spricht der HERR, da ich mit dem Haus Israel und dem Haus Juda einen neuen Bund (bᵉrît ḥădāšāh) schließen werde — nicht wie der Bund, den ich mit ihren Vätern schloss." — Die Schrift selbst kündigt einen neuen Bund an. Aufhebung des Alten ist also kein Beweis eines falschen Propheten — sie war prophezeit.',
    fundstelle: 'Jeremia 31,31-32',
    status: 'Strong H2319 · ḥādāš = neu',
    kern: 'בְּרִית חֲדָשָׁה',
  },

  // ---- Deut 18,20 — the zûd verse (presumptuous speaking) ----
  dtn1820: {
    typ: 'bibel',
    kurz: 'Der Prophet, der vermessen (zûd) in meinem Namen redet … soll sterben.',
    original:
      'אַךְ הַנָּבִיא אֲשֶׁר יָזִיד לְדַבֵּר דָּבָר בִּשְׁמִי אֵת אֲשֶׁר לֹא צִוִּיתִיו לְדַבֵּר וַאֲשֶׁר יְדַבֵּר בְּשֵׁם אֱלֹהִים אֲחֵרִים',
    sprache: 'he',
    translit:
      'ʾaḵ ha-nāvîʾ ʾăšer yāzîd lᵉ-dabbēr dāvār bi-šmî ʾēt ʾăšer lōʾ ṣiwwîtîw lᵉ-dabbēr wa-ʾăšer yᵉdabbēr bᵉ-šēm ʾĕlōhîm ʾăḥērîm',
    uebersetzung:
      '„Doch der Prophet, der sich vermisst (yāzîd, Wurzel zûd), in meinem Namen ein Wort zu reden, das ich ihm nicht zu reden geboten habe, oder der im Namen anderer Götter redet — dieser Prophet soll sterben." Das Schlüsselwort ist zûd (H2102): vorsätzlich, vermessen — wissentliche Lüge, nicht ehrlicher Irrtum.',
    fundstelle: '5. Mose (Deuteronomium) 18,20',
    status: 'Strong H2102 · zûd = vorsätzlich handeln',
    kern: 'יָזִיד',
  },

  // ---- Deut 18,22 — the test of an unfulfilled prophecy ----
  dtn1822: {
    typ: 'bibel',
    kurz: 'Trifft das Wort nicht ein, so hat es der HERR nicht geredet — der Prophet hat vermessen geredet.',
    original:
      'אֲשֶׁר יְדַבֵּר הַנָּבִיא בְּשֵׁם יְהוָה וְלֹא יִהְיֶה הַדָּבָר וְלֹא יָבוֹא הוּא הַדָּבָר אֲשֶׁר לֹא דִבְּרוֹ יְהוָה בְּזָדוֹן דִּבְּרוֹ הַנָּבִיא',
    sprache: 'he',
    translit:
      'ʾăšer yᵉdabbēr ha-nāvîʾ bᵉ-šēm YHWH wᵉ-lōʾ yihyeh ha-dāvār wᵉ-lōʾ yāvôʾ, hûʾ ha-dāvār ʾăšer lōʾ dibbᵉrô YHWH; bᵉ-zādôn dibbᵉrô ha-nāvîʾ',
    uebersetzung:
      '„Wenn der Prophet im Namen des HERRN redet und das Wort nicht eintrifft und nicht eintritt, so ist es ein Wort, das der HERR nicht geredet hat; vermessen (bᵉ-zādôn, Wurzel zûd) hat der Prophet geredet." — Der Test der nicht eingetroffenen Prophezeiung. Genau dieser Test trifft Paulus’ Naherwartung (1 Thess 4,15-17).',
    fundstelle: '5. Mose (Deuteronomium) 18,22',
    kern: 'בְּזָדוֹן',
  },

  // ---- Gen 20,12 — Abraham married his half-sister ----
  gen2012: {
    typ: 'bibel',
    kurz: 'Sara ist wirklich meine Schwester — meines Vaters Tochter, nur nicht meiner Mutter.',
    original:
      'וְגַם אָמְנָה אֲחֹתִי בַת אָבִי הִוא אַךְ לֹא בַת אִמִּי וַתְּהִי לִי לְאִשָּׁה',
    sprache: 'he',
    translit: 'wᵉ-gam ʾomnāh ʾăḥōtî vat-ʾāvî hîʾ, ʾaḵ lōʾ vat-ʾimmî, wa-tᵉhî lî lᵉ-ʾiššāh',
    uebersetzung:
      '„Auch ist sie wahrhaftig meine Schwester, meines Vaters Tochter, nur nicht meiner Mutter Tochter, und sie wurde meine Frau." — Abraham heiratet seine Halbschwester. Später verbietet die Tora genau das (3. Mose 18,9; 20,17). Gott ändert also sehr wohl seine Gesetze.',
    fundstelle: '1. Mose (Genesis) 20,12',
    kern: 'אֲחֹתִי בַת אָבִי',
  },

  // ---- Gen 9,3 — Noah given all animals to eat ----
  gen93: {
    typ: 'bibel',
    kurz: 'Alles, was sich regt und lebt, soll euch zur Speise sein — wie das grüne Kraut.',
    original: 'כָּל רֶמֶשׂ אֲשֶׁר הוּא חַי לָכֶם יִהְיֶה לְאָכְלָה כְּיֶרֶק עֵשֶׂב נָתַתִּי לָכֶם אֶת כֹּל',
    sprache: 'he',
    translit: 'kol-remeś ʾăšer hûʾ ḥay lāḵem yihyeh lᵉ-ʾoḵlāh, kᵉ-yereq ʿēśev nātattî lāḵem ʾet-kōl',
    uebersetzung:
      '„Alles, was sich regt und lebt, soll euch zur Speise sein; wie das grüne Kraut habe ich euch das alles gegeben." — Noah wird ausdrücklich JEDES Tier zur Speise erlaubt. Später erklärt dieselbe Tora viele davon für unrein (3. Mose 11). Eine klare Gesetzesänderung.',
    fundstelle: '1. Mose (Genesis) 9,3',
    kern: 'יִהְיֶה לְאָכְלָה',
  },

  // ---- Jacob married two sisters (later forbidden) ----
  gen2928: {
    typ: 'bibel',
    kurz: 'Jakob nahm auch Rahel zur Frau — zwei Schwestern zugleich; später verboten.',
    original: 'וַיָּבֹא גַּם אֶל רָחֵל וַיֶּאֱהַב גַּם אֶת רָחֵל מִלֵּאָה',
    sprache: 'he',
    translit: 'wa-yāvōʾ gam ʾel-Rāḥēl, wa-yeʾĕhav gam ʾet-Rāḥēl mi-Lēʾāh',
    uebersetzung:
      '„Und er ging auch zu Rahel ein und liebte Rahel mehr als Lea." (1. Mose 29,28-30). Jakob — Israel selbst — war mit zwei Schwestern zugleich verheiratet. Die Tora verbietet später ausdrücklich, „eine Frau samt ihrer Schwester zu nehmen" (3. Mose 18,18). Gesetz geändert.',
    fundstelle: '1. Mose (Genesis) 29,28-30 · vgl. 3. Mose 18,18',
    kern: 'גַּם אֶת רָחֵל',
  },

  // ---- Ex 12,9 — Passover ROASTED, not boiled ----
  ex129: {
    typ: 'bibel',
    kurz: 'Ihr sollt es nicht roh essen, auch nicht im Wasser gekocht, sondern am Feuer gebraten.',
    original:
      'אַל תֹּאכְלוּ מִמֶּנּוּ נָא וּבָשֵׁל מְבֻשָּׁל בַּמָּיִם כִּי אִם צְלִי אֵשׁ',
    sprache: 'he',
    translit: 'ʾal-tōʾḵᵉlû mimmennû nāʾ û-vāšēl mᵉvuššāl ba-māyim, kî ʾim-ṣᵉlî-ʾēš',
    uebersetzung:
      '„Ihr sollt nichts davon roh essen, auch nicht im Wasser gekocht (bāšēl mᵉvuššāl ba-māyim), sondern allein am Feuer gebraten (ṣᵉlî-ʾēš)." — Exodus verbietet das KOCHEN des Pessach ausdrücklich.',
    fundstelle: '2. Mose (Exodus) 12,9',
    kern: 'צְלִי אֵשׁ',
  },

  // ---- Dtn 16,7 — Passover BOILED (the direct contradiction) ----
  dtn167: {
    typ: 'bibel',
    kurz: 'Und du sollst es kochen und essen — dasselbe Pessach, das Exodus zu kochen verbot.',
    original: 'וּבִשַּׁלְתָּ וְאָכַלְתָּ בַּמָּקוֹם אֲשֶׁר יִבְחַר יְהוָה אֱלֹהֶיךָ בּוֹ',
    sprache: 'he',
    translit: 'û-viššaltā wᵉ-ʾāḵaltā ba-māqôm ʾăšer yivḥar YHWH ʾĕlōhêḵā bô',
    uebersetzung:
      '„Und du sollst es kochen (û-v"iššaltā", Wurzel bāšal — dasselbe Wort wie das Verbot in Ex 12,9) und essen an der Stätte, die der HERR erwählt." — Deuteronomium gebietet, was Exodus verbot. Dieselbe Tora ändert dieselbe Pessach-Vorschrift. Aufhebung ist ein biblisches Prinzip.',
    fundstelle: '5. Mose (Deuteronomium) 16,7',
    kern: 'וּבִשַּׁלְתָּ',
  },

  // ---- Num 30,2 — vows must be kept (Kol Nidre tension) ----
  num302: {
    typ: 'bibel',
    kurz: 'Wer dem HERRN ein Gelübde tut … soll sein Wort nicht brechen.',
    original: 'אִישׁ כִּי יִדֹּר נֶדֶר לַיהוָה … לֹא יַחֵל דְּבָרוֹ כְּכָל הַיֹּצֵא מִפִּיו יַעֲשֶׂה',
    sprache: 'he',
    translit: 'ʾîš kî yiddōr neder la-YHWH … lōʾ yaḥēl dᵉvārô, kᵉ-ḵol ha-yōṣēʾ mi-pîw yaʿăśeh',
    uebersetzung:
      '„Wenn ein Mann dem HERRN ein Gelübde tut … so soll er sein Wort nicht brechen (lōʾ yaḥēl); ganz wie es aus seinem Mund gegangen ist, soll er tun." — Doch das jüdische Kol-Nidre-Gebet löst Gelübde im Voraus auf. Eine rabbinische Aufhebung trotz klarem Tora-Gebot.',
    fundstelle: '4. Mose (Numeri) 30,2',
    kern: 'לֹא יַחֵל דְּבָרוֹ',
  },

  // ---- 1 Cor 9,20-21 — Paul's admitted double role ----
  kor1920: {
    typ: 'bibel',
    kurz: 'Den Juden bin ich wie ein Jude geworden … denen ohne Gesetz wie einer ohne Gesetz.',
    original:
      'καὶ ἐγενόμην τοῖς Ἰουδαίοις ὡς Ἰουδαῖος … τοῖς ἀνόμοις ὡς ἄνομος, μὴ ὢν ἄνομος θεοῦ',
    sprache: 'grc',
    translit:
      'kaì egenómēn toîs Ioudaíois hōs Ioudaîos … toîs anómois hōs ánomos, mḕ ṑn ánomos theoû',
    uebersetzung:
      '„Den Juden bin ich wie ein Jude geworden, um die Juden zu gewinnen … denen ohne Gesetz (anómois) bin ich wie einer ohne Gesetz (ánomos) geworden." — Paulus gibt selbst eine Doppelrolle zu: mal unter dem Gesetz, mal ohne. Genau das Wort — ánomos — gebraucht Jesus für die Abgewiesenen (Mt 7,23).',
    fundstelle: '1. Korinther 9,20-21',
    status: 'Strong G459 · ánomos = ohne Gesetz / gesetzlos',
    kern: 'ὡς ἄνομος',
  },

  // ---- 1 Thess 4,15-17 — the imminent expectation that failed ----
  thess415: {
    typ: 'bibel',
    kurz: 'Wir, die Lebenden, die übrig bleiben bis zur Wiederkunft des Herrn …',
    original:
      'ἡμεῖς οἱ ζῶντες οἱ περιλειπόμενοι εἰς τὴν παρουσίαν τοῦ κυρίου … ἁρπαγησόμεθα ἐν νεφέλαις',
    sprache: 'grc',
    translit:
      'hēmeîs hoi zôntes hoi perileipómenoi eis tḕn parousían toû kyríou … harpagēsómetha en nephélais',
    uebersetzung:
      '„Wir, die Lebenden, die übrig bleiben bis zur Wiederkunft (parousía) des Herrn … wir werden zugleich mit ihnen entrückt werden auf den Wolken." — Paulus zählt sich selbst zu den Lebenden, die die Wiederkunft erleben würden. Sie trat nicht ein. Nach Jesu eigenem Maßstab und Dtn 18,22: vermessen geredet.',
    fundstelle: '1. Thessalonicher 4,15-17',
    kern: 'ἡμεῖς οἱ ζῶντες',
  },

  // ---- Gal 2,6 — Paul above Peter/James ("those of repute") ----
  gal26: {
    typ: 'bibel',
    kurz: 'Die etwas galten — was sie waren, gilt mir gleich; Gott achtet das Ansehen nicht.',
    original:
      'ἀπὸ δὲ τῶν δοκούντων εἶναί τι … ὁποῖοί ποτε ἦσαν οὐδέν μοι διαφέρει· πρόσωπον ὁ θεὸς ἀνθρώπου οὐ λαμβάνει',
    sprache: 'grc',
    translit:
      'apò dè tôn dokoúntōn eînaí ti … hopoîoí pote êsan oudén moi diaphérei; prósōpon ho theòs anthrṓpou ou lambánei',
    uebersetzung:
      '„Von denen aber, die etwas galten (die „Säulen" — Petrus, Jakobus, Johannes) … was sie einst waren, das gilt mir gleich; Gott achtet das Ansehen des Menschen nicht." — Paulus stellt sich neben oder über die Apostel, die Jesus persönlich kannten.',
    fundstelle: 'Galater 2,6',
    kern: 'οὐδέν μοι διαφέρει',
  },

  // ---- 2 Cor 11,5 — "not inferior to the chief apostles" ----
  kor115: {
    typ: 'bibel',
    kurz: 'Ich denke, ich stehe den „Über-Aposteln" in nichts nach.',
    original: 'λογίζομαι γὰρ μηδὲν ὑστερηκέναι τῶν ὑπερλίαν ἀποστόλων',
    sprache: 'grc',
    translit: 'logízomai gàr mēdèn hysterēkénai tôn hyperlían apostólōn',
    uebersetzung:
      '„Denn ich meine, ich stehe den Über-Aposteln (hyperlían apostólōn) in nichts nach." — Paulus, der den historischen Jesus nie traf, bemisst sich an oder über den Aposteln, die mit ihm gingen.',
    fundstelle: '2. Korinther 11,5',
    kern: 'τῶν ὑπερλίαν ἀποστόλων',
  },

  // ---- Ps 119,115 — depart from me, evildoers (parallel to Mt 7,23) ----
  ps119115: {
    typ: 'bibel',
    kurz: 'Weicht von mir, ihr Übeltäter — ich will die Gebote meines Gottes halten.',
    original: 'סוּרוּ מִמֶּנִּי מְרֵעִים וְאֶצְּרָה מִצְוֹת אֱלֹהָי',
    sprache: 'he',
    translit: 'sûrû mimmennî mᵉrēʿîm, wᵉ-ʾeṣṣᵉrāh miṣwōt ʾĕlōhāy',
    uebersetzung:
      '„Weicht von mir, ihr Übeltäter (mᵉrēʿîm), denn ich will die Gebote meines Gottes halten (ʾeṣṣᵉrāh miṣwōt)!" — Der hebräische Hintergrund von Mt 7,23: die Übeltäter sind die, die das Gesetz NICHT halten; der Gerechte hält die Gebote. „Weicht von mir" + „ich halte die Gebote" stehen im selben Vers nebeneinander.',
    fundstelle: 'Psalm 119,115',
    kern: 'וְאֶצְּרָה מִצְוֹת',
  },

  // ---- Gen 49,27 — Benjamin the wolf (patristic reversal) ----
  gen4927: {
    typ: 'bibel',
    kurz: 'Benjamin ist ein reißender Wolf: am Morgen frisst er Raub, am Abend teilt er die Beute.',
    original: 'בִּנְיָמִין זְאֵב יִטְרָף בַּבֹּקֶר יֹאכַל עַד וְלָעֶרֶב יְחַלֵּק שָׁלָל',
    sprache: 'he',
    translit: 'Binyāmîn zᵉʾēv yiṭrāf, ba-bōqer yōʾḵal ʿad, wᵉ-lā-ʿerev yᵉḥallēq šālāl',
    uebersetzung:
      '„Benjamin ist ein reißender Wolf (zᵉʾēv yiṭrāf): am Morgen frisst er Raub, am Abend teilt er die Beute aus." — Tertullian und Hippolyt deuteten diesen „Wolf" als LOB auf Paulus (Benjaminit): morgens der verfolgende Saulus, abends der austeilende Apostel. Damit identifizieren sie selbst Paulus mit dem Wolf — demselben Wolf im Schafspelz aus Mt 7,15.',
    fundstelle: '1. Mose (Genesis) 49,27',
    status: 'patristische Deutung umgekehrt',
    kern: 'זְאֵב יִטְרָף',
  },

  // ---- Spr 20,10 — two kinds of weight, an abomination ----
  spr2010: {
    typ: 'bibel',
    kurz: 'Zweierlei Gewicht und zweierlei Maß — beides ist dem HERRN ein Gräuel.',
    original: 'אֶבֶן וָאֶבֶן אֵיפָה וְאֵיפָה תּוֹעֲבַת יְהוָה גַּם שְׁנֵיהֶם',
    sprache: 'he',
    translit: 'ʾeven wā-ʾeven, ʾêfāh wᵉ-ʾêfāh, tôʿăvat YHWH gam-šᵉnêhem',
    uebersetzung:
      '„Zweierlei Gewicht (ʾeven wā-ʾeven, „Stein und Stein") und zweierlei Maß (ʾêfāh wᵉ-ʾêfāh) — beides ist dem HERRN ein Gräuel (tôʿăvāh)." — Wer Paulus’ Aufhebung, Doppelrolle und Fehlprophezeiung als „inspiriert" durchgehen lässt, aber bei Muhammad ﷺ Fehlerlosigkeit verlangt, misst mit zweierlei Gewicht.',
    fundstelle: 'Sprüche 20,10',
    status: 'Doppelmaß-Pointe',
    kern: 'אֶבֶן וָאֶבֶן',
  },

  // ---- Quran 2,85 — believing in part, denying in part ----
  q285: {
    typ: 'quran',
    kurz: 'Glaubt ihr an einen Teil der Schrift und verleugnet einen anderen?',
    original: 'أَفَتُؤْمِنُونَ بِبَعْضِ الْكِتَابِ وَتَكْفُرُونَ بِبَعْضٍ',
    sprache: 'ar',
    translit: 'a-fa-tuʾminūna bi-baʿḍi l-kitābi wa-takfurūna bi-baʿḍ',
    uebersetzung:
      '„Glaubt ihr denn an einen Teil der Schrift und verleugnet einen anderen Teil? Was ist der Lohn dessen unter euch, der so handelt, außer Schande im diesseitigen Leben?" — Der koranische Spiegel der Doppelmaß-Pointe: man darf nicht den Maßstab beliebig wählen.',
    fundstelle: 'Sure 2 (al-Baqara), Vers 85',
    kern: 'بِبَعْضِ ... بِبَعْضٍ',
  },

  // ---- Source: zûd / H2102 lexically (Chumash & Or HaChaim) ----
  zuwdquelle: {
    typ: 'quelle',
    kurz: 'Hebr. zûd (H2102) = vorsätzlich; Chumash & Or HaChaim: nur WISSENTLICHER Götzendienst tötet.',
    uebersetzung:
      'Das Schlüsselverb in 5. Mose 18,20 ist יָזִיד (yāzîd) von der Wurzel זוד / zûd (Strong H2102): „vorsätzlich, vermessen, anmaßend handeln" — dieselbe Wurzel wie in 18,22 (bᵉ-zādôn, „in Vermessenheit"). Jüdische Kommentare (der Chumash zur Stelle; Or HaChaim) betonen: der todeswürdige Prophet ist der, der WISSENTLICH lügt oder bewusst zum Götzendienst aufruft — nicht der ehrlich Irrende. Da Muhammad ﷺ zum reinen Monotheismus (Tawḥīd) rief, fällt 18,20 von vornherein nicht auf ihn: er redete weder vermessen noch „im Namen anderer Götter".',
    fundstelle: 'Strong H2102 (zûd) · Chumash zu 5. Mose 18,20 · Or HaChaim',
  },

  // ---- Source: the Synopse Muhammad <-> Gospels (the source book pages) ----
  synopsequelle: {
    typ: 'quelle',
    kurz: 'Quellbuch (S. 393–402): Lehre für Lehre deckt sich Muhammad ﷺ mit dem Evangelium.',
    uebersetzung:
      'Eine ausführliche Synopse stellt die Lehren Muhammads ﷺ Zug um Zug neben die Worte Jesu: Barmherzigkeit, Nächstenliebe, Demut, Almosen, Vergebung des Feindes, kein Zwang im Glauben, Sorge um Witwe und Waise. Wer den Früchte-Test (Mt 7,16) konsequent anlegt, findet bei Muhammad ﷺ dieselbe Frucht wie im Evangelium — ein Schild für die Schwachen, kein Schwert gegen sie. Zudem ein Logion: „Es werden Menschen kommen … die in weichen Schafsfellen täuschen, aber das Herz eines Wolfes haben" — das exakte Bild aus Mt 7,15.',
    fundstelle: 'Quellbuch S. 393–402 · vgl. Mt 7,15-16',
  },

  // ---- Source: Saul -> Paulus, Latin "the least" ----
  paulusname: {
    typ: 'quelle',
    kurz: 'Der Name „Paulus" ist LATEINISCH (Paulus = „der Geringste / Kleinste") — nicht aramäisch.',
    uebersetzung:
      'Der Apostel trug zwei Namen: den hebräisch-aramäischen Šaʾûl (Saul) und den römischen Paulus. „Paulus" (lat. paulus) bedeutet wörtlich „klein, gering, der Geringste". Daneben steht Jesu Wort: „Wer eines dieser kleinsten Gebote auflöst …, der wird der Kleinste (eláchistos) heißen im Himmelreich" (Mt 5,19). Ein thematischer, kein beweisender Befund — und ausdrücklich als LATEINISCH (nicht aramäisch) auszuweisen.',
    fundstelle: 'lat. paulus = „der Geringste" · vgl. Apg 13,9 · Mt 5,19',
  },

  // ---- Source: patristic wolf (Gen 49,27) — reversal only ----
  patristikquelle: {
    typ: 'quelle',
    kurz: 'Tertullian & Hippolyt deuteten Benjamins „Wolf" (Gen 49,27) als Lob auf Paulus.',
    uebersetzung:
      'Frühe Kirchenväter — Tertullian (Adversus Marcionem V,1) und Hippolyt, später aufgegriffen von Hieronymus und Augustinus — deuteten den „reißenden Wolf" Benjamin (1. Mose 49,27) als Weissagung auf Paulus, den Benjaminiten: „am Morgen" der verfolgende Saulus, „am Abend" der austeilende Apostel — gemeint als Lob. Dieses Argument wird hier NUR als Umkehrung geführt: nach ihrer eigenen Exegese ist Paulus der Wolf — und Jesus warnte vor dem Wolf im Schafspelz (Mt 7,15).',
    fundstelle: 'Tertullian, Adv. Marcionem V,1 · Hippolyt · vgl. 1. Mose 49,27 · Mt 7,15',
  },

  // ---- Source: abrogation as a biblical principle (Kap. 9) ----
  aufhebungquelle: {
    typ: 'quelle',
    kurz: 'Aufhebung ist biblisches Prinzip: Pessach, Priestertum, Jer 31, Qumran, Kol-Nidre, Techelet.',
    uebersetzung:
      'Die Schrift und die jüdische Tradition kennen die Aufhebung von Geboten als festes Prinzip: das Pessach wird gebraten (Ex 12,9), dann gekocht (Dtn 16,7); das Priestertum wandert (Num 3,12; 1. Sam 2,30); Jeremia kündigt einen „neuen Bund" an (31,31); die Qumran-Gemeinde und das Damaskus-Dokument verschärfen bzw. ändern Halacha; das Kol-Nidre-Gebet löst Gelübde trotz Num 30,2; und die biblisch gebotene Techelet-Farbe (4. Mose 15,38) galt jahrhundertelang als verloren und wurde nicht getragen. Wer also einem Propheten Gesetzes-Aufhebung als Beweis seiner Falschheit vorwirft, müsste die Tora selbst verwerfen.',
    fundstelle: 'Ex 12,9 · Dtn 16,7 · Num 3,12 · Jer 31,31 · Qumran/Damaskus-Dok. · Num 30,2 · Num 15,38',
  },

  // ---- Source: Christian scholar concedes the equal-standard point (Kap. 8) ----
  doppelmassquelle: {
    typ: 'quelle',
    kurz: 'Selbst eine christliche Quelle räumt ein: gleicher Maßstab an Tanach/Talmud → keiner bliebe stehen.',
    uebersetzung:
      'Eine christliche Quelle (Kap. 8) gesteht ein, dass kein biblischer oder talmudischer Prophet bestünde, würde man an ihn denselben überstrengen Maßstab anlegen, den Kritiker an Muhammad ﷺ richten — Fehlerlosigkeit in jedem Detail. Das ist die Doppelmaß-Pointe aus dem Mund der Gegenseite: „Zweierlei Gewicht … ein Gräuel" (Spr 20,10), und koranisch: „Glaubt ihr an einen Teil der Schrift und verleugnet einen anderen?" (2,85).',
    fundstelle: 'christl. Quelle (Kap. 8) · vgl. Spr 20,10 · Koran 2,85',
  },
}

// ---- The Synopse Muhammad ﷺ ↔ the Gospels (the fruit-test, side by side) -----
export const synopse = {
  intro:
    'Jesus gab einen Test: „An ihren Früchten werdet ihr sie erkennen" (Mt 7,16). Legt man ihn konsequent an, deckt sich die Lehre Muhammads ﷺ Zug um Zug mit dem Evangelium — ein Schild für die Schwachen, kein Schwert gegen sie.',
  spalten: ['Lehre Muhammads ﷺ', 'Parallele im Evangelium'],
  zeilen: [
    {
      h: 'Barmherzigkeit: „Die Barmherzigen — ihrer erbarmt sich der Allerbarmer." (Tirmidhī)',
      j: '„Selig sind die Barmherzigen, denn sie werden Barmherzigkeit erlangen." (Mt 5,7)',
    },
    {
      h: 'Nächstenliebe: „Keiner glaubt, bis er seinem Bruder wünscht, was er sich selbst wünscht." (Bukhārī)',
      j: '„Du sollst deinen Nächsten lieben wie dich selbst." (Mt 22,39)',
    },
    {
      h: 'Demut: „Wer sich demütigt um Gottes willen, den erhöht Gott." (Muslim)',
      j: '„Wer sich selbst erniedrigt, der wird erhöht werden." (Mt 23,12)',
    },
    {
      h: 'Almosen: „Schütze dich vor dem Feuer, sei es mit einer halben Dattel." (Bukhārī)',
      j: '„Verkauft, was ihr habt, und gebt Almosen." (Lk 12,33)',
    },
    {
      h: 'Vergebung: „Vergib dem, der dir Unrecht tut." (Aḥmad)',
      j: '„Liebt eure Feinde und betet für die, die euch verfolgen." (Mt 5,44)',
    },
    {
      h: 'Kein Zwang: „Kein Zwang im Glauben." (Koran 2,256)',
      j: '„Wer nicht hören will … schüttelt den Staub von euren Füßen." (Mt 10,14)',
    },
    {
      h: 'Witwe & Waise: „Ich und der Versorger der Waise sind im Paradies so nah." (Bukhārī)',
      j: '„Reine Frömmigkeit: Witwen und Waisen in ihrer Not besuchen." (Jak 1,27)',
    },
    {
      h: 'Wahrhaftigkeit: „Haltet euch an die Wahrheit, sie führt zur Frömmigkeit." (Muslim)',
      j: '„Eure Rede sei: Ja, ja; nein, nein." (Mt 5,37)',
    },
  ],
  pointe:
    'Acht Lehren, eine Frucht. Wer den Früchte-Test ehrlich anlegt, findet bei Muhammad ﷺ das Evangelium — nicht seinen Gegensatz. Der „Wolf im Schafspelz" (Mt 7,15) ist, wessen Lehre Gesetzlosigkeit bringt, nicht wessen Lehre dem Evangelium gleicht.',
}

// ---- The zûd passage (Deut 18,20) — presumptuous vs. honest -----------------
export const zuwd = {
  intro:
    'Der „Deut 18,20"-Einwand übersieht das Schlüsselwort. Das Hebräische sagt nicht „jeder Prophet", sondern der, der יָזִיד (yāzîd) handelt — von der Wurzel זוד / zûd.',
  wort: { heb: 'יָזִיד', translit: 'yāzîd', wurzel: 'זוד · zûd', strong: 'H2102' },
  bedeutung: 'vorsätzlich · vermessen · anmaßend — WISSENTLICH handeln',
  punkte: [
    'Dieselbe Wurzel kehrt in 18,22 wieder: bᵉ-zādôn („in Vermessenheit") — der Prophet, dessen Wort nicht eintrifft, hat „vermessen" geredet.',
    'Der Chumash zur Stelle und Or HaChaim: todeswürdig ist nur der WISSENTLICH lügende Prophet oder der, der bewusst zum Götzendienst aufruft.',
    'Muhammad ﷺ rief zum reinen Monotheismus (Tawḥīd) — weder „im Namen anderer Götter" noch vermessen. 18,20 trifft ihn von vornherein nicht.',
  ],
  pointe:
    'Der Vers verurteilt den vorsätzlichen Lügner und den Götzendiener — nicht den, der zur Anbetung des einen Gottes ruft. Mit der eigenen jüdischen Auslegung gelesen, entlastet 18,20 den Propheten, statt ihn zu treffen.',
}

// ---- The abrogation list (abrogation as a biblical principle, Kap. 9) -------
export const abrogationsliste = {
  intro:
    'Der Vorwurf „er hob das Gesetz auf" setzt voraus, Gott ändere seine Gebote nie. Doch die Tora selbst — und die jüdische Tradition — heben Gebote auf, ändern sie, lassen sie ruhen. Aufhebung ist ein biblisches Prinzip, kein Kennzeichen des falschen Propheten.',
  spalten: ['Frühere Regelung', 'Spätere Änderung / Aufhebung'],
  zeilen: [
    {
      a: 'Abraham heiratet seine Halbschwester Sara (1. Mose 20,12)',
      b: 'Später streng verboten: „die Blöße deiner Schwester …" (3. Mose 18,9; 20,17)',
    },
    {
      a: 'Jakob ist mit zwei Schwestern zugleich verheiratet (1. Mose 29,28-30)',
      b: 'Später verboten: „eine Frau samt ihrer Schwester" (3. Mose 18,18)',
    },
    {
      a: 'Noah wird JEDES lebende Tier zur Speise erlaubt (1. Mose 9,3)',
      b: 'Später viele Tiere für unrein erklärt (3. Mose 11)',
    },
    {
      a: 'Pessach: nur am Feuer gebraten, nicht gekocht (2. Mose 12,9)',
      b: 'Pessach: „du sollst es kochen und essen" (5. Mose 16,7) — dasselbe Wort bāšal',
    },
    {
      a: 'Das Priestertum bei einer Linie (Levi / Eli)',
      b: 'Es wandert: nach dem Kalb (4. Mose 3,12), weg von Eli (1. Sam 2,30)',
    },
    {
      a: 'Gelübde müssen gehalten werden: „er soll sein Wort nicht brechen" (4. Mose 30,2)',
      b: 'Das Kol-Nidre-Gebet löst Gelübde im Voraus auf (jüd. Liturgie)',
    },
    {
      a: 'Die blaue Techelet-Schnur ist geboten (4. Mose 15,38)',
      b: 'Jahrhundertelang als verloren betrachtet und nicht getragen',
    },
  ],
  pointe:
    'Sieben Mal ändert, hebt auf oder lässt die Schrift selbst (oder ihre Tradition) ruhen, was sie zuvor gebot. Und Jeremia kündigt es sogar an: einen „neuen Bund, nicht wie der … mit ihren Vätern" (31,31). Wer Aufhebung zum Beweis des falschen Propheten macht, verwirft damit die Tora.',
}

// ---- The Paulus-Dossier: three rotten fruits (Mt 7) -------------------------
export const paulusDossier = {
  intro:
    'Legt man Jesu Früchte-Test (Mt 7,16) an Paulus an — den Mann, der das Gesetz für nichtig erklärte —, zeigen sich drei faule Früchte. Kein Schmähen einer Person: ein Anlegen genau des Maßstabs, den die Ankläger gegen Muhammad ﷺ führen.',
  fruechte: [
    {
      n: 'I',
      titel: 'Inkonsistenz',
      body: 'Paulus gibt selbst eine Doppelrolle zu: „Den Juden bin ich wie ein Jude … denen ohne Gesetz (ánomos) wie einer ohne Gesetz geworden" (1 Kor 9,20-21). Mal unter dem Gesetz, mal ohne — und ánomos ist exakt das Wort der Abgewiesenen in Mt 7,23.',
      belegId: 'kor1920',
    },
    {
      n: 'II',
      titel: 'Anmaßung',
      body: 'Paulus traf den historischen Jesus nie und stellt sich dennoch neben oder über die, die mit ihm gingen: „den Über-Aposteln stehe ich in nichts nach" (2 Kor 11,5); „was sie galten, gilt mir gleich; Gott achtet kein Ansehen" (Gal 2,6). Autorität ohne den lebendigen Jesus.',
      belegId: 'kor115',
    },
    {
      n: 'III',
      titel: 'Falsche Prophetie',
      body: 'Paulus zählte sich zu den Lebenden, die die Wiederkunft erleben würden: „wir, die Lebenden, die übrig bleiben bis zur Wiederkunft des Herrn" (1 Thess 4,15-17). Sie trat nicht ein. Nach Dtn 18,22 und Jesu eigenem Maßstab: vermessen geredet.',
      belegId: 'thess415',
    },
  ],
  pointe:
    'Inkonsistenz, Anmaßung, falsche Prophetie — drei faule Früchte. Genau die Frucht, vor der Jesus warnte. Wendet man den Test ehrlich an, trifft er nicht den Propheten aus Arabien.',
}

// ---- The Ornament-banner: Sprüche 20,10 (the double-standard verdict) ------
export const prov2010 = {
  vers: '„Zweierlei Gewicht und zweierlei Maß — beides ist dem HERRN ein Gräuel."',
  ref: 'Sprüche 20,10',
  unterzeile: 'tôʿăvat YHWH gam-šᵉnêhem — beides ist dem HERRN ein Gräuel.',
}

export const verteidigungKonter: KonterItem[] = [
  {
    tier: 'stone',
    einwand: '„Jesus warnte vor falschen Propheten — und das ist Muhammad ﷺ."',
    konter:
      'Jesus nennt keinen Namen, er gibt einen Test: „An ihren Früchten werdet ihr sie erkennen" (Mt 7,16). Also prüfe die Frucht. Muhammads ﷺ Lehre deckt sich Zug um Zug mit dem Evangelium — Barmherzigkeit, Nächstenliebe, Demut, Almosen, Vergebung, kein Zwang (Synopse). Der „Wolf im Schafspelz" ist, wessen Lehre Gesetzlosigkeit bringt, nicht wessen Lehre dem Evangelium gleicht.',
    belegId: 'mt715',
  },
  {
    tier: 'stone',
    einwand: '„Er hob das Gesetz auf — also ein falscher Prophet."',
    konter:
      'Dann wäre Paulus es zuerst: er erklärte „der Mensch wird gerecht ohne des Gesetzes Werke" (Röm 3,28) und machte sich „denen ohne Gesetz wie einer ohne Gesetz" (1 Kor 9,21). Jesus dagegen: „ich bin nicht gekommen aufzulösen, sondern zu erfüllen" (Mt 5,17). Und die Aufhebung selbst war prophezeit: Jeremia kündigt einen „neuen Bund" an (31,31). Aufhebung ist kein Beweis — sie steht in der Schrift.',
    belegId: 'jer3131',
  },
  {
    tier: 'stone',
    einwand: '„Gott ändert seine Gesetze nie."',
    konter:
      'Doch — und zwar in eurer eigenen Tora: Abraham heiratet seine Halbschwester (1. Mose 20,12), später verboten (3. Mose 18,9); Jakob heiratet zwei Schwestern (1. Mose 29,28), später verboten (3. Mose 18,18); Noah wird JEDES Tier zur Speise erlaubt (1. Mose 9,3), später viele für unrein erklärt (3. Mose 11). Gott ändert sehr wohl seine Gebote — die Aufhebung ist ein biblisches Prinzip.',
    belegId: 'gen2012',
  },
  {
    tier: 'stone',
    einwand: '„Deut 18,20: wer im Namen anderer Götter redet, ist ein falscher Prophet."',
    konter:
      'Das Schlüsselwort ist יָזִיד / zûd (H2102) = vorsätzlich, vermessen — wissentlich lügen. Der Chumash und Or HaChaim: todeswürdig ist nur der WISSENTLICH lügende Prophet oder der, der bewusst zum Götzendienst aufruft. Muhammad ﷺ rief zum reinen Monotheismus (Tawḥīd) — weder „im Namen anderer Götter" noch vermessen. Mit eurer eigenen Auslegung gelesen, trifft 18,20 ihn gar nicht.',
    belegId: 'zuwdquelle',
  },
  {
    tier: 'stone',
    einwand: '„Paulus’ Autorität kam direkt von Christus — das genügt."',
    konter:
      'Paulus traf den historischen Jesus nie (nur eine Vision auf dem Weg nach Damaskus) und stellt sich dennoch neben oder über die Apostel, die mit ihm gingen: „den Über-Aposteln stehe ich in nichts nach" (2 Kor 11,5); „was sie galten, gilt mir gleich" (Gal 2,6). Autorität ohne den lebendigen Jesus — geprüft am selben Maßstab wie jeder andere.',
    belegId: 'gal26',
  },
  {
    tier: 'stone',
    einwand: '„Paulus war konsequent in seiner Lehre."',
    konter:
      'Er gibt das Gegenteil selbst zu: „Den Juden bin ich wie ein Jude … denen ohne Gesetz (ánomos) wie einer ohne Gesetz geworden" (1 Kor 9,20-21). Eine offen eingestandene Doppelrolle — mal unter dem Gesetz, mal ohne. Und ánomos ist genau das Wort, mit dem Jesus die Abgewiesenen benennt: „weicht von mir, ihr anomoi" (Mt 7,23).',
    belegId: 'kor1920',
  },
  {
    tier: 'stone',
    einwand: '„Paulus war ein wahrer Prophet."',
    konter:
      'Dann scheitert er an Jesu eigenem Test: er zählte sich zu den Lebenden, die die Wiederkunft erleben würden — „wir, die Lebenden, die übrig bleiben bis zur Wiederkunft des Herrn" (1 Thess 4,15-17). Sie trat nicht ein. Nach 5. Mose 18,22 — trifft das Wort nicht ein, hat der Prophet „vermessen geredet" — fällt Paulus durch genau den Test, den man Muhammad ﷺ anlegt.',
    belegId: 'thess415',
  },
]

export const verteidigungScholar: ScholarItem[] = [
  {
    tier: 'stone',
    h: 'V.1 — Der Früchte-Test, konsequent angelegt',
    body: 'Jesus gibt einen Test, keinen Namen: „An ihren Früchten werdet ihr sie erkennen" (Mt 7,16); „hütet euch vor … reißenden Wölfen im Schafspelz" (7,15). Die Synopse (Quellbuch S. 393–402) stellt Lehre für Lehre Muhammads ﷺ neben das Evangelium — Barmherzigkeit, Nächstenliebe, Demut, Almosen, Vergebung, kein Zwang: ein Schild für die Schwachen, kein Schwert. Dazu das Logion „Menschen … die in weichen Schafsfellen täuschen, aber das Herz eines Wolfes haben" — das exakte Bild aus Mt 7,15. Die Frucht entscheidet, und sie entlastet den Propheten.',
  },
  {
    tier: 'stone',
    h: 'V.2 — Paulus-Dossier: drei faule Früchte',
    body: 'Legt man denselben Test an Paulus an: (1) Inkonsistenz — „den Juden wie ein Jude … denen ohne Gesetz wie einer ohne Gesetz" (1 Kor 9,20-21), eine zugegebene Doppelrolle; (2) Anmaßung — nie den historischen Jesus getroffen, doch „den Über-Aposteln stehe ich in nichts nach" (2 Kor 11,5; Gal 2,6); (3) falsche Prophetie — „wir, die Lebenden … bis zur Wiederkunft" (1 Thess 4,15-17), die nicht eintrat. Drei faule Früchte, am Maßstab der Ankläger.',
  },
  {
    tier: 'stone',
    h: 'V.3 — anomia-Exegese (Mt 7,23 + Ps 119,115)',
    body: 'Jesus weist die Abgewiesenen ab als ἐργαζόμενοι τὴν ἀνομίαν — „Täter der Gesetzlosigkeit" (Mt 7,23). Der hebräische Hintergrund steht in Ps 119,115: „Weicht von mir, ihr Übeltäter, denn ich will die Gebote meines Gottes halten." Dort stehen „weicht von mir" und „ich halte die Gebote" im selben Vers — die Übeltäter sind also gerade die, die das Gesetz NICHT halten. anomia ist Gesetzlosigkeit; der falsche Prophet ist ihr Lehrer.',
  },
  {
    tier: 'marble',
    h: 'V.4 — Saul → Paulus: „der Geringste" (lateinisch)',
    body: 'Der Apostel trug zwei Namen: Šaʾûl (Saul) und den römischen Paulus. „Paulus" ist LATEINISCH (lat. paulus = „klein, gering, der Geringste") — ausdrücklich nicht aramäisch. Daneben Jesu Wort: „Wer eines dieser kleinsten Gebote auflöst …, der wird der Kleinste (eláchistos) heißen im Himmelreich" (Mt 5,19). Ein thematischer, kein beweisender Befund — ergänzend geführt und korrekt als lateinisch ausgewiesen.',
  },
  {
    tier: 'marble',
    h: 'V.5 — Patristik-Wolf (Gen 49,27) — als Umkehrung',
    body: 'Tertullian (Adv. Marcionem V,1) und Hippolyt deuteten den „reißenden Wolf" Benjamin (1. Mose 49,27) als Weissagung auf Paulus, den Benjaminiten — „am Morgen" der verfolgende Saulus, „am Abend" der austeilende Apostel —, und zwar als LOB. Hier wird das NUR als Umkehrung ihrer eigenen Exegese geführt: nach ihrer Deutung ist Paulus der Wolf — und Jesus warnte vor dem Wolf im Schafspelz (Mt 7,15). Kein eigenständiger Beweis.',
  },
  {
    tier: 'stone',
    h: 'V.6 — Aufhebung als biblisches Prinzip (Kap. 9)',
    body: 'Die Aufhebung von Geboten ist biblisch verankert: das Pessach gebraten (Ex 12,9) ↔ gekocht (Dtn 16,7); das Priestertum wandert (Num 3,12; 1. Sam 2,30); Jeremia kündigt einen „neuen Bund" an (31,31); Qumran und das Damaskus-Dokument ändern Halacha. Dazu rabbinische Aufhebungen: das Kol-Nidre löst Gelübde trotz Num 30,2; die gebotene Techelet-Farbe (Num 15,38) galt jahrhundertelang als verloren. Wer Aufhebung zum Beweis des falschen Propheten macht, verwirft die Tora selbst.',
  },
  {
    tier: 'stone',
    h: 'V.7 — Die zûd-Analyse (Dtn 18,20)',
    body: 'Das Verb in 5. Mose 18,20 ist יָזִיד / zûd (H2102): „vorsätzlich, vermessen" — dieselbe Wurzel wie bᵉ-zādôn in 18,22. Der Chumash und Or HaChaim lesen: todeswürdig ist nur der wissentlich lügende Prophet oder der bewusste Aufruf zum Götzendienst, nicht der ehrliche Irrtum. Da Muhammad ﷺ zum Tawḥīd rief, trifft 18,20 ihn von vornherein nicht — er redete weder vermessen noch „im Namen anderer Götter".',
  },
  {
    tier: 'stone',
    h: 'V.8 — Doppelmaß-Pointe (Kap. 8)',
    body: 'Der Kritiker akzeptiert bei Paulus eine nicht eingetroffene Prophezeiung, eine zugegebene Doppelrolle und die Gesetzes-Aufhebung als „inspiriert" — bei Muhammad ﷺ verlangt er Fehlerfreiheit. „Zweierlei Gewicht und zweierlei Maß — beides ist dem HERRN ein Gräuel" (Spr 20,10), koranisch: „Glaubt ihr an einen Teil der Schrift und verleugnet einen anderen?" (2,85). Selbst eine christliche Quelle (Kap. 8) räumt ein: gleicher Maßstab an Tanach und Talmud → keiner bliebe stehen.',
  },
]

export const verteidigungVernetzung = [
  {
    ziel: 'Buch 3 — Prophet wie Mose',
    text: '5. Mose 18,18 erlaubt ausdrücklich den „Aufheber" — den Propheten „wie Mose", der Neues bringt. Es ist derselbe Abschnitt wie 18,20, mit dem man Muhammad ﷺ verurteilen will: ein Vers verurteilt nicht, was der vorige verheißt.',
  },
  {
    ziel: 'Buch 7 / 8 — Der erwartete Prophet',
    text: 'Der „Prophet wie Mose" (Gesetzgeber, neuer Bund) ist genau der erwartete — nicht der Gesetzlose. Wer einen Propheten wie Mose erwartet, kann ihm Gesetzgebung nicht zum Vorwurf machen.',
  },
  {
    ziel: 'Prinzip — Gleiche Maßstäbe',
    text: 'Dieses Buch ist die reinste Anwendung des Grundprinzips: ein Maßstab für Paulus und Muhammad ﷺ. „Zweierlei Gewicht … ein Gräuel" (Spr 20,10).',
  },
  {
    ziel: 'Buch 2 — Abrahams Nachkommen',
    text: 'Mt 21,43 („einem Volk gegeben, das Früchte bringt") ist derselbe Früchte-Test — dort am Bund, hier am Propheten. Und das wandernde Priestertum ist die Abrogations-Mechanik.',
  },
]

export const verteidigungGleicheMassstaebe =
  'Der Kritiker akzeptiert bei Paulus dreierlei als „inspiriert": eine nicht eingetroffene Prophezeiung (1 Thess 4,15-17), die Aufhebung des Gesetzes (Röm 3,28) und eine selbst zugegebene Doppelrolle (1 Kor 9,20-21). Bei Muhammad ﷺ aber verlangt er Fehlerfreiheit in jedem Detail. Das ist „zweierlei Gewicht und zweierlei Maß — beides ist dem HERRN ein Gräuel" (Spr 20,10), und koranisch: „Glaubt ihr an einen Teil der Schrift und verleugnet einen anderen?" (2,85). Selbst eine christliche Quelle (Kap. 8) räumt ein: legte man denselben überstrengen Maßstab an Tanach und Talmud an, bliebe kein Prophet stehen. Legt man Jesu eigenen Test gleich an beide an, fällt der Vorwurf — nicht der Prophet.'
