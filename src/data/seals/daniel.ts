import type { Beleg } from '../types'

// ---------------------------------------------------------------------------
// SIEGEL V — Daniel. Content from the build spec (§6.5). Verse / source full
// texts live on Beleg records and surface only in the immersive modal.
//
// The seal has a felsenfester Kern (Daniel 2 & 7: the four kingdoms + the
// window) and a complementary, bolder part (the 350-year reckoning, Daniel 9).
// The core carries alone; the reckonings are the cream on top, marked as such.
// ---------------------------------------------------------------------------

export interface StatueZone {
  id: string
  material: string
  reich: string
  jahr: string
  belegId: string
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

export interface Step {
  n: string
  h: string
  body: string
}

export const danielThese =
  'Daniel zeichnet eine lückenlose Kette von fünf Weltreichen — Babylon, Medo-Persien, Griechenland, Rom, und das Reich Gottes. Der „Stein, nicht von Menschenhand" entsteht erst, nachdem Rom geteilt ist, zerschmettert alle vorherigen Reiche und füllt die Erde. Jesus kam Jahrhunderte zu früh. Nur ein Ereignis passt auf jeden Punkt.'

// Methodology note — the seal openly distinguishes its rock-solid core from its
// complementary, bolder reckonings. Surfaced as a calm banner under the thesis.
export const danielMethodik =
  'Dieses Siegel hat einen felsenfesten Kern — Daniel 2 & 7: die vier Reiche und das Zeitfenster — und einen ergänzenden, kühneren Teil: die 350-Jahre-Rechnung und Daniel 9. Der Kern trägt allein; die Rechnungen sind das Sahnehäubchen, klar als solche markiert (✦).'

export const danielSteps: Step[] = [
  {
    n: 'I',
    h: 'Die Statue (Daniel 2)',
    body: 'Nebukadnezar träumt von einer Statue aus fünf Materialien. Daniel deutet sie als fünf aufeinanderfolgende Reiche — und nennt das erste beim Namen.',
  },
  {
    n: 'II',
    h: 'Die vier Bedingungen des Steins',
    body: 'Der Stein muss „in den Tagen jener Könige" kommen, von Gott aufgerichtet sein, zum Berg werden, der die Erde füllt, und die Reiche zermalmen — militärisch, nicht durch Bekehrung.',
  },
  {
    n: 'III',
    h: 'Das Zeitfenster',
    body: 'Rom teilte sich formal erst 395 n. Chr. Der Stein muss danach kommen und Rom zerstören — Rom fiel 1453 an ein muslimisches Reich. Jesus (1. Jh.) lag Jahrhunderte davor.',
  },
  {
    n: 'IV',
    h: 'Das Dilemma',
    body: 'Wer sagt „Jesus ist der Stein", macht entweder Jesus zum Lügner (er erfüllte das Zeitfenster nicht) oder Daniel zum falschen Propheten (die Reiche fielen nicht, als Jesus kam).',
  },
]

export const statueZones: StatueZone[] = [
  { id: 'gold', material: 'Gold', reich: 'Babylon', jahr: '605–539 v. Chr.', belegId: 'dan238' },
  { id: 'silber', material: 'Silber', reich: 'Medo-Persien', jahr: '539–330 v. Chr.', belegId: 'dan820' },
  { id: 'bronze', material: 'Bronze', reich: 'Griechenland', jahr: '330–63 v. Chr.', belegId: 'dan821' },
  { id: 'eisen', material: 'Eisen', reich: 'Rom', jahr: 'ab 63 v. Chr.', belegId: 'dan240' },
  { id: 'fuesse', material: 'Eisen + Ton', reich: 'Geteiltes Rom', jahr: 'ab 395 n. Chr.', belegId: 'dan241' },
  { id: 'stein', material: 'Der Stein', reich: 'Das Reich Gottes', jahr: 'ab 622 n. Chr.', belegId: 'dan244' },
]

// ---- The five-kingdoms table (statue ↔ kingdom ↔ Daniel-internal proof) ----
// Renders as the Vier-/Fünf-Reiche-Tabelle exhibit (SPEC schritt 1 + exhibit 3).
export interface ReichRow {
  teil: string
  reich: string
  beleg: string
  belegRef: string
  stein?: boolean
}
export const fuenfReiche: ReichRow[] = [
  { teil: 'Kopf aus Gold', reich: 'Babylon', beleg: 'Daniel sagt es wörtlich', belegRef: 'Daniel 2,38' },
  { teil: 'Brust aus Silber', reich: 'Medo-Persien', beleg: 'Widder = Meder + Perser', belegRef: 'Daniel 8,20' },
  { teil: 'Bauch / Schenkel Bronze', reich: 'Griechenland', beleg: 'Ziegenbock = Griechen', belegRef: 'Daniel 8,21' },
  { teil: 'Beine aus Eisen', reich: 'Rom', beleg: '„stark wie Eisen, zermalmt alles"', belegRef: 'Daniel 2,40' },
  { teil: 'Füße Eisen + Ton', reich: 'Rom (geteilt)', beleg: '„ein geteiltes Reich"', belegRef: 'Daniel 2,41' },
  { teil: 'Der Stein (ohne Menschenhand)', reich: 'Das Reich Gottes', beleg: 'zerschmettert alle, füllt die Erde', belegRef: 'Daniel 2,44-45', stein: true },
]

// ---- The four beasts of Daniel 7 = the same four kingdoms (exhibit 3) -------
export interface TierRow {
  tier: string
  reich: string
  detail: string
}
export const vierTiere: TierRow[] = [
  { tier: 'Löwe mit Adlerflügeln', reich: 'Babylon', detail: 'der Löwe ist DAS Symbol Babylons; Nebukadnezar in der Bibel als Löwe' },
  { tier: 'Bär (auf einer Seite erhoben, 3 Rippen)', reich: 'Medo-Persien', detail: 'die schwerere Seite = Persien, das stärkere Teil' },
  { tier: 'Leopard, 4 Köpfe / 4 Flügel', reich: 'Griechenland', detail: 'die vier Köpfe = die vier Diadochen-Reiche Alexanders' },
  { tier: 'Schreckliches Tier, Eisenzähne, 10 Hörner', reich: 'Rom', detail: 'Eisenzähne = Eisenbeine der Statue; 10 Hörner = 10 Zehen' },
]
export const vierTierePointe =
  'Babylonischer Talmud, Rabbi Yoḥanan: das vierte Reich = „das ruchlose römische Reich". 4 Esra (1./2. Jh.): der Adler = Daniels viertes Reich, vom Messias-Löwen besiegt. Nach 70 n. Chr. war das Vier-Reiche-Schema das kanonische jüdische Geschichtsmodell.'

// ---- The four conditions for the stone (SPEC schritt 2 / 5.3) --------------
export interface SteinBedingung {
  n: string
  text: string
  detail: string
}
export const steinBedingungen: SteinBedingung[] = [
  { n: '1', text: '„In den Tagen jener Könige"', detail: 'es kommt, während das geteilte Rom existiert — nicht 1500 Jahre vorher.' },
  { n: '2', text: '„Von Gott aufgerichtet"', detail: 'gottesfürchtig, monotheistisch — nicht götzendienerisch.' },
  { n: '3', text: '„Berg, der die Erde füllt"', detail: 'globale Ausbreitung über die ganze Welt.' },
  { n: '4', text: 'Es „zermalmt" die Reiche', detail: 'es zerstört Rom militärisch — nicht durch Bekehrung.' },
]
export const steinPointe =
  'Nur der Islam erfüllt alle vier: entstand „in den Tagen" des geteilten Rom (ab 622), gottesfürchtig und monotheistisch, breitete sich global aus, und zermalmte Rom (1453) und Persien militärisch.'

export const danielKonter: KonterItem[] = [
  {
    tier: 'stone',
    einwand: '„Das Reich ist geistlich, Jesus hat es erfüllt."',
    konter:
      'Daniel 2,44 sagt: das Reich zerschmettert irdische Reiche. Jesus selbst: „Mein Reich ist nicht von dieser Welt" (Joh 18,36) — das widerspricht Daniel direkt. „Zerschmettern" ist Kriegssprache, nicht Bekehrung. Die Kirche fiel unter römische Verfolgung — der Islam eroberte Rom.',
    belegId: 'joh1836',
  },
  {
    tier: 'stone',
    einwand: '„Der Menschensohn (Dan 7,13) ist Jesus."',
    konter:
      'Drei Probleme: (1) Der Menschensohn herrscht und zerschmettert — das NT sagt, Jesu Menschensohn werde gekreuzigt (Mt 20,18-19). Gegensatz. (2) Chronologie: er kommt nach dem kleinen Horn (Konstantin, 4. Jh.) — Jesus kam davor. (3) Daniel 7,27: das Reich wird den Heiligen (Plural = Gemeinschaft) gegeben, nicht einer Einzelfigur → passt zur Umma.',
    belegId: 'mt2018',
  },
  {
    tier: 'stone',
    einwand: '„Der Menschensohn wird „angebetet" (Dan 7,14) → also göttlich."',
    konter:
      'Das aramäische pelach heißt dienen / huldigen, nicht zwingend Gott anbeten. Beweis aus eurer eigenen Bibel: Esra 7,24 (Diener), Gen 14,14 (Soldaten dienen Abraham), Gen 27,29 (Völker dienen Jakob), Gen 29,18 (Jakob „dient" Laban sieben Jahre). Hat Jakob Laban angebetet? Natürlich nicht. Die Völker „dienen" = gehorchen ihm. Passt auf Muhammad ﷺ: weltweit befolgt, in jedem Gebet 5×/Tag namentlich geehrt.',
    belegId: 'pelach',
  },
  {
    tier: 'stone',
    einwand: '„Er kommt „mit den Wolken" (Dan 7,13) → nur Gott reitet Wolken (Ps 104,3)."',
    konter:
      'Der Vers sagt „kommt mit den Wolken", nicht „reitet auf den Wolken". Und: im selben Kapitel kommen die Tiere „aus dem Meer" (7,2-3) — kamen Babylon / Persien / Griechenland / Rom wörtlich aus dem Ozean? Nein. Wolken = Symbol göttlicher Autorität / Eingreifens (Ex 13,21; Jes 19,1). „Mit Wolken" = ihm wird Vollmacht gegeben, nicht dass er Gott ist.',
    belegId: 'dan713',
  },
  {
    tier: 'stone',
    einwand: '„Das Reich währt EWIG — die Osmanen endeten 1924."',
    konter:
      'Hebr./aram. olam heißt „lange Zeit", nicht zwingend Ewigkeit: Joel 2,27 (Israel später exiliert), Jona 2,6 (3 Tage = olam), Ex 21,6 (Diener „ewig" — Menschen sterben), Gen 17,8 (Kanaan-Besitz endete im Exil). UND: das Reich Gottes hat zwei Dimensionen — physisch (politische Macht) + geistlich (Autorität). Mt 21,43 beweist es: die Juden „hatten" das Reich auch ohne Staat. Auch nach 1924 bleibt das geistliche Reich bei der Umma.',
    belegId: 'mt2143',
  },
  {
    tier: 'stone',
    einwand: '„Rom war schon zu Jesu Zeit geteilt (Klientelkönige)."',
    konter:
      'Daniel definiert Teilung formal, nicht funktional. Babylon hatte zwei Könige (Nabonid + Belsazar als Mitregent ~553–539 v. Chr.) — Daniel zählt es trotzdem als EIN ungeteiltes Reich (Goldkopf). Persien: Xerxes-Mitregenten — trotzdem ein Reich. Rom wurde erst 395 formal geteilt (Theodosius → Honorius / Arcadius).',
    belegId: 'formalfunktional',
  },
  {
    tier: 'stone',
    einwand: '„Der „Stein, nicht von Menschenhand" kann kein Mensch (Muhammad) sein."',
    konter:
      'Jesus selbst nennt den Stein (Ps 118,22) in Mt 21,42-43 den Eckstein — und sagt, das Reich werde „genommen und einem Volk gegeben, das Früchte bringt". Und Muhammad ﷺ nannte sich selbst den fehlenden Ziegel, der das Haus vollendet (Bukhārī 3535; Muslim 2286c): „Ich bin dieser Ziegel, ich bin das Siegel der Propheten" — ohne Zugang zu Tanach/NT. (Wichtig: der Hadith sagt „Ziegel"; den Eckstein-Bezug Ps 118,22 / Mt 21,42 liefert die theologische Verknüpfung.) Die Bauleute (Juden) verwarfen ihn — historisch genau eingetreten.',
    belegId: 'bukhari3535',
  },
  {
    tier: 'stone',
    einwand: '„Die Osmanen zerstörten doch nicht Babylon / Persien / Griechenland."',
    konter:
      'Daniel 2,40: das vierte Reich (Rom) zerschmettert alle vorherigen — die Reiche leben im Titel durch Nachfolge weiter. Wer das jüngste (Rom) zerstört, zerstört sukzessive alle, die es in sich trägt. Die Osmanen zerstörten Rom → damit die ganze Kette.',
    belegId: 'dan240',
  },
  {
    tier: 'marble',
    einwand: '„Daniel wurde erst ~165 v. Chr. geschrieben (Makkabäerzeit) — keine echte Prophetie."',
    konter:
      'Zweischneidig (siehe Gelehrten-Ebene 5.7): dieselbe Spätdatierung, die der Gegner gegen Daniel / Jesus benutzt, zerstört auch seine Jesus-Deutung (Daniel 9) erst recht. Wir führen primär Daniel 2 & 7 — deren Vier-Reiche-Deutung (4. Reich = Rom) von den Kirchenvätern selbst stammt, nicht von Muslimen erfunden.',
  },
]

export const danielScholar: ScholarItem[] = [
  {
    tier: 'stone',
    h: '5.1 — Daniel identifiziert die Reiche selbst',
    body: 'Babylon (Gold): wörtlich, Daniel 2,38 („du bist das Haupt aus Gold"). Medo-Persien (Silber): Daniel 8,20 — der Widder mit zwei Hörnern = die Könige von Medien und Persien; Belsazar fiel 539 v. Chr. an Kyros. Griechenland (Bronze): Daniel 8,21 — der Ziegenbock = der König von Griechenland; das große Horn = Alexander; vier Hörner = die vier Diadochen (Ptolemäer, Seleukiden, Pergamon, Makedonien). Rom (Eisen + Ton): nicht namentlich, aber durch „stark wie Eisen, zermalmt alles" (2,40) und „geteilt" (Ost / West ab 395) eindeutig — selbst der Artscroll Tanach (jüd.) nennt die Ost-West-Teilung Roms als mögliche Deutung.',
  },
  {
    tier: 'stone',
    h: '5.2 — Daniel 7: dieselbe Kette als vier Tiere',
    body: 'Vier Tiere = dieselben vier Reiche, nur als Bestien (Daniels Sicht auf ihr wahres Wesen). Löwe mit Adlerflügeln = Babylon (archäologisch DAS Symbol Babylons). Bär (auf einer Seite erhoben, 3 Rippen) = Medo-Persien. Leopard mit 4 Köpfen / Flügeln = Griechenland (4 Diadochen). Schreckliches Tier, Eisenzähne, 10 Hörner = Rom (Eisenzähne = Eisenbeine; 10 Hörner = 10 Zehen). Jüdischer Beleg: Babylonischer Talmud, Rabbi Yoḥanan — das vierte Reich = „das ruchlose römische Reich". 4 Esra: der Adler = Daniels viertes Reich, vom Messias-Löwen besiegt. Nach 70 n. Chr. war das Vier-Reiche-Schema „kanonisches" jüdisches Modell.',
  },
  {
    tier: 'stone',
    h: '5.3 — Der Stein und die vier Bedingungen (Daniel 2,44-45)',
    body: '„In den Tagen jener Könige wird der Gott des Himmels ein Reich aufrichten, das nie zerstört wird … es wird alle diese Reiche zermalmen … es selbst aber wird ewig bestehen." Vier Merkmale: (1) „in den Tagen jener Könige" = während das geteilte Rom existiert; (2) von Gott aufgerichtet = monotheistisch; (3) wird zum Berg, der die Erde füllt = global; (4) zermalmt die Reiche = militärisch. Nur der Islam erfüllt alle vier: entstand in den Tagen des geteilten Rom, gottesfürchtig, global ausgebreitet, zermalmte Rom und Persien militärisch.',
  },
  {
    tier: 'stone',
    h: '5.4 — Josephus: der Kronzeuge, der schwieg',
    body: 'Josephus (1. Jh.) deutet Daniel 2 — bricht aber beim Stein bewusst ab („es schien mir nicht angebracht, dies zu erzählen") und schickt den Leser, selbst Daniel zu lesen. Die Historiker Parente & Sievers: Josephus wollte die römischen Leser nicht beleidigen — „nur ein begriffsstutziger Leser hätte den Punkt verpasst." Ein jüdischer Historiker unter römischer Besatzung wusste, dass der Stein Rom zerstören würde, und schwieg aus Angst.',
  },
  {
    tier: 'marble',
    h: '5.5 — Das kleine Horn = Konstantin (Daniel 7,24-25)',
    body: 'Daniels „kleines Horn" hat präzise Merkmale — alle treffen auf Konstantin zu: (1) „von niedriger Herkunft, steigt auf" → Mutter Helena einfacher Herkunft, Aufstieg vom Militärkommandeur zum Kaiser. (2) „unterwirft drei Könige" → die Tetrarchie (4 Herrscher), Konstantin besiegte seine Rivalen. (3) „spricht gegen den Höchsten" → das Konzil von Nicäa (325); aus rein monotheistischer Sicht ist die Trinität ein „Sprechen gegen Gott"; Theodosius I. verbot Opposition bei Strafe. (4) „unterdrückt die Heiligen" → Verfolgung der nicht-trinitarischen (unitarischen) Christen. (5) „ändert Festzeiten und Gesetze" → Konstantin machte per Gesetz den Sonntag zum Ruhetag statt des Samstag-Sabbats: „Am ehrwürdigen Tag der Sonne sollen die Magistrate ruhen." (6) „seine Macht wird genommen und den Heiligen gegeben" → Konstantinopel (324 gegründet) fiel 1453 an die Muslime.',
  },
  {
    tier: 'marble',
    h: '5.6 — Die 350-Jahre-Rechnung (ergänzend)',
    body: '„Eine Zeit, Zeiten und eine halbe Zeit" (7,25). Aramäisch iddan = Zeitspanne (Tag / Monat / Jahr / Jahrhundert; Keil & Delitzsch: aram. Plural = Dual = „zwei"). Lesart: 1 + 2 + ½ = 3,5 Einheiten → als Jahrhunderte 350 Jahre. Konstantins Geburt 272 + 350 = 622 = die Hidschra (Gründung des islamischen Staates in Medina). Lexikon-Stützen: Brown-Driver-Briggs, Gesenius, HALOT, John Gill, Jamieson-Fausset-Brown, Hieronymus (4. Jh.) — alle: iddan = Zeitspanne, „Zeiten" = 2. Rabbinischer Präzedenzfall: Rabbi Ben Abrahamson rechnet über Daniel 9 ebenfalls auf 622 und nennt den erwarteten „wahren Krieger-Messias" — Eltern in Arabien hätten ein Kind in dieser Hoffnung nach Daniels „Ish ḥamudot" (Mann der Kostbarkeiten) benannt: Muḥamud. Brücke zu 5.9. Ein faszinierendes Zusatzindiz, kein mathematischer Beweis.',
  },
  {
    tier: 'marble',
    h: '5.7 — Die Spätdatierung Daniels: ein Bumerang',
    body: 'Kritische Gelehrte (Collins, Grabbe, Tov, Albertz, VanderKam, Rowley) datieren Daniel 7–12 auf ~165 v. Chr., „weil es Geschichte zu genau erzählt". Für uns zweischneidig: wer Daniel spätdatiert, um echte Prophetie zu leugnen, sägt am eigenen Ast — denn dieselbe Logik vernichtet die christliche Daniel-9-Jesus-Prophetie erst recht. Unsere Position (wie das Buch): wir führen primär Daniel 2 & 7, deren Vier-Reiche-Deutung (4. Reich = Rom) von den Kirchenvätern selbst stammt. Ehrlich benannt: die moderne kritische Mehrheit deutet das 4. Reich als Griechenland (Medien + Persien getrennt), das kleine Horn als Antiochus IV. Unsere Antwort ist NICHT ein falscher Konsens-Anspruch, sondern die vorislamische Auslegung (Kirchenväter, Talmud, Josephus, 4 Esra), die das 4. Reich für Rom hielt — erst nach dem Aufstieg des Islam begannen Rabbiner umzudeuten (Collins bezeugt das).',
  },
  {
    tier: 'marble',
    h: '5.8 — Daniel 9: die Bar-Kochba-Rechnung (ergänzend)',
    body: 'Die christliche 490-Jahre-Rechnung auf Jesus funktioniert mit keinem Startdatum sauber (445 v. Chr. ist gecherry-pickt; Kyros’ Dekret 538 v. Chr. endet Jahrhunderte zu früh). Alternative: Startpunkt Bar-Kochba-Aufstand (132–136 n. Chr.) — Tempel / Jerusalem verwüstet, „alles Unheil über uns gekommen" (Dan 9,13). + 490 Jahre = 622 (Hidschra), „Versiegelung von Vision und Prophetie, Salbung des Allerheiligsten" (9,24). Bar Kochba = „Sohn des Sterns" (Num 24,17); Rabbi Akiva hielt ihn für den Messias; Hieronymus verband den Aufstand mit Daniel 9 — ein gescheiterter Messias, dann der wahre. „Messias" in 9,25-26 = maschiaḥ (Gesalbter) — kein bestimmter Artikel, auch für Könige / Priester / Kyros (Jes 45,1) verwendet. Christen tragen Jesus nachträglich ein.',
  },
  {
    tier: 'stone',
    h: '5.9 — 🔥 Gabriel nennt die Wurzel von Muhammads Namen (Daniel 9,21-23)',
    body: 'Der stärkste linguistische Treffer — und die Brücke zu Siegel IV. Als Gabriel Daniel „in eilendem Flug … zur Zeit des Abendopfers" erscheint (9,21), nennt er ihn „hochgeschätzt / vielgeliebt" = hebr. חֲמוּדוֹת / ḥamudot, Wurzel Ḥ-M-D (ḥamad: begehren, ersehnen, schätzen), Strong H2530. Muhammad (محمد) / Aḥmad (أحمد) stammen aus exakt derselben semitischen Wurzel Ḥ-M-D (arab. ḥamida = preisen) → „der Gepriesene". Die Szene-Parallele ist verblüffend: Gabriel erscheint auch Muhammad ﷺ in Männergestalt (Ṣaḥīḥ Bukhārī 3235), kommt eilend, bringt frohe Botschaft im Gebet — genau wie bei Daniel. „Zwei Seiten einer Medaille: der Höchstgepriesene (Aḥmad) wird erkannt durch die große Begehrtheit (ḥamudot)." Verknüpft mit maḥamaddim (Hld 5,16) und ḥimdat (Haggai 2,7) aus Siegel IV.',
  },
  {
    tier: 'marble',
    h: '5.10 — Habakuk 3,3 in der ältesten arabischen Bibel-Handschrift',
    body: 'Die älteste arabische AT-Handschrift (Sinai-Kloster) übersetzt Habakuk 3,3 mit محمود / Maḥmūd („der Gepriesene", = Name Muhammads, Wurzel Ḥ-M-D) und محامده / Maḥāmidihi („seine Lobpreisungen"). „Berg Paran" = der Hidschaz / Mekka (wo Muhammad ﷺ die erste Offenbarung empfing); „sein Lob erfüllt die ganze Welt" → für die ganze Menschheit gesandt. Vorsicht: Hebräisch → Arabisch ist sprachlich nah (beide semitisch), aber eine arabische Übersetzung ist kein hebräischer Urtext-Beweis. Als bestätigendes Indiz führen, nicht als Primärbeweis — der Paran-Beweis selbst steht in Siegel III.',
  },
]

export const danielBelege: Record<string, Beleg> = {
  // ---- Quran (the religion prevailing = the stone fills the earth) ----
  quran619: {
    typ: 'quran',
    kurz: 'Er gibt der Religion der Wahrheit die Oberhand über alle Religion.',
    original: 'هُوَ الَّذِي أَرْسَلَ رَسُولَهُ بِالْهُدَىٰ وَدِينِ الْحَقِّ لِيُظْهِرَهُ عَلَى الدِّينِ كُلِّهِ وَلَوْ كَرِهَ الْمُشْرِكُونَ',
    sprache: 'ar',
    translit: 'Huwa lladhī arsala rasūlahu bi-l-hudā wa-dīni l-ḥaqqi li-yuẓhirahu ʿalā d-dīni kullihi wa-law kariha l-mushrikūn',
    uebersetzung:
      'Er ist es, der Seinen Gesandten mit der Rechtleitung und der Religion der Wahrheit gesandt hat, um ihr die Oberhand über alle Religion zu geben — auch wenn es den Götzendienern zuwider ist.',
    fundstelle: 'Sure 61 (aṣ-Ṣaff), Vers 9',
    kern: 'لِيُظْهِرَهُ عَلَى الدِّينِ كُلِّهِ',
  },

  // ---- Bibel: the stone kingdom (Aramaic) ----
  dan244: {
    typ: 'bibel',
    kurz: 'Der Gott des Himmels wird ein Reich aufrichten, das alle zermalmt und ewig besteht.',
    original: 'וּבְיוֹמֵיהוֹן דִּי מַלְכַיָּא אִנּוּן יְקִים אֱלָהּ שְׁמַיָּא מַלְכוּ דִּי לְעָלְמִין לָא תִתְחַבַּל',
    sprache: 'he',
    translit: 'û-ḇ-yômêhôn dî malkayyāʾ innûn yᵉqîm Ĕlāh šᵉmayyāʾ malkû dî lᵉ-ʿālmîn lā ṯitḥabbal',
    uebersetzung:
      'Und in den Tagen jener Könige wird der Gott des Himmels ein Reich (malkû) aufrichten, das ewig nicht zerstört wird … es wird alle jene Reiche zermalmen und ihnen ein Ende machen, selbst aber ewig bestehen.',
    fundstelle: 'Daniel 2,44 (Aramäisch)',
    status: 'Strong H4437 · malkû = Reich',
    kern: 'מַלְכוּ',
  },

  // ---- Bibel: the stone strikes the feet and becomes a great mountain ----
  dan245: {
    typ: 'bibel',
    kurz: 'Ein Stein, von keiner Hand losgerissen, zermalmte das Eisen — und wurde ein großer Berg, der die ganze Erde füllte.',
    original: 'דִּי מִן טוּרָא אִתְגְּזֶרֶת אֶבֶן דִּי לָא בִידַיִן',
    sprache: 'he',
    translit: 'dî min ṭûrāʾ ʾitgᵉzeret ʾeḇen dî lāʾ ḇîdayin',
    uebersetzung:
      '„… ein Stein, der ohne Zutun von Menschenhänden vom Berg losgerissen wurde, der das Eisen, das Erz, den Ton, das Silber und das Gold zermalmte … und der Stein, der das Bild zerschlug, wurde zu einem großen Berg, der die ganze Erde erfüllte." (2,34-35.45) Der Stein zermalmt militärisch und wird global.',
    fundstelle: 'Daniel 2,45 (vgl. 2,34-35)',
    status: 'aram. „nicht von Menschenhand"',
    kern: 'אֶבֶן דִּי לָא בִידַיִן',
  },

  // ---- Bibel: the four conditions verse (in the days of those kings) ----
  dan713: {
    typ: 'bibel',
    kurz: 'Einer wie ein Menschensohn kam MIT den Wolken — nicht „auf" ihnen.',
    original: 'חָזֵה הֲוֵית בְּחֶזְוֵי לֵילְיָא וַאֲרוּ עִם עֲנָנֵי שְׁמַיָּא כְּבַר אֱנָשׁ אָתֵה הֲוָה',
    sprache: 'he',
    translit: 'ḥāzēh hăwêṯ bᵉ-ḥezwê lêlᵉyāʾ wa-ʾărû ʿim ʿănānê šᵉmayyāʾ kᵉ-ḇar ʾĕnāš ʾāṯēh hăwāh',
    uebersetzung:
      '„Ich sah in den Nachtgesichten, und siehe, mit (ʿim) den Wolken des Himmels kam einer wie ein Menschensohn." — Der Text sagt „mit", nicht „auf". Im selben Kapitel kommen die vier Tiere „aus dem Meer" (7,2-3) — also symbolisch. Wolken = Symbol göttlicher Vollmacht (Ex 13,21; Jes 19,1), nicht Gottheit.',
    fundstelle: 'Daniel 7,13 (Aramäisch)',
    status: 'aram. ʿim = „mit", nicht „auf"',
    kern: 'עִם עֲנָנֵי שְׁמַיָּא',
  },

  // ---- Bibel: the saints receive the kingdom (Plural = community) ----
  dan727: {
    typ: 'bibel',
    kurz: 'Das Reich wird dem Volk der Heiligen des Höchsten gegeben — einer Gemeinschaft, nicht einer Einzelfigur.',
    uebersetzung:
      '„Das Königtum aber und die Herrschaft und die Größe der Königreiche unter dem ganzen Himmel wird dem Volk der Heiligen des Höchsten gegeben werden." (7,27) Den Heiligen (Plural, „Volk") — eine Gemeinschaft. Das passt zur Umma, nicht zu einer einzelnen göttlichen Gestalt.',
    fundstelle: 'Daniel 7,27',
  },

  // ---- Bibel: the H-M-D bridge (Hebrew) ----
  dan923: {
    typ: 'bibel',
    kurz: 'Gabriel nennt Daniel „ḥamudot" — vielgeliebt. Dieselbe Wurzel wie Muhammad.',
    original: 'בִּתְחִלַּת תַּחֲנוּנֶיךָ יָצָא דָבָר וַאֲנִי בָּאתִי לְהַגִּיד כִּי חֲמוּדוֹת אָתָּה',
    sprache: 'he',
    translit: 'bi-ṯḥillaṯ taḥănûneḵā yāṣāʾ ḏāḇār, wa-ʾănî bāʾṯî lᵉ-haggîḏ, kî ḥămûḏôṯ ʾāttā',
    uebersetzung:
      '„Bei Beginn deines Flehens erging ein Wort, und ich bin gekommen, es dir zu verkünden, denn du bist vielgeliebt / hochgeschätzt (ḥamudot)." — Wurzel Ḥ-M-D, dieselbe wie in Muhammad (محمد) und Aḥmad (أحمد): „der Gepriesene". Gabriel kommt eilend, im Gebet, mit froher Botschaft — wie bei Muhammad ﷺ.',
    fundstelle: 'Daniel 9,23 (Hebräisch)',
    status: 'Strong H2530 · Wurzel Ḥ-M-D',
    kern: 'חֲמוּדוֹת',
  },

  // ---- statue zones ----
  dan238: {
    typ: 'bibel',
    kurz: '„Du bist das Haupt aus Gold."',
    uebersetzung: '„Du, o König … du bist das Haupt aus Gold." Daniel deutet Babylon ausdrücklich als das goldene Haupt.',
    fundstelle: 'Daniel 2,38',
  },
  dan820: {
    typ: 'bibel',
    kurz: 'Der Widder mit zwei Hörnern = die Könige von Medien und Persien.',
    uebersetzung: '„Der Widder mit den zwei Hörnern, den du gesehen hast, sind die Könige von Medien und Persien." Daniel benennt das zweite Reich selbst.',
    fundstelle: 'Daniel 8,20',
  },
  dan821: {
    typ: 'bibel',
    kurz: 'Der Ziegenbock = der König von Griechenland.',
    uebersetzung: '„Der zottige Ziegenbock ist der König von Griechenland." Das große Horn = Alexander; die vier Hörner = die vier Diadochen-Reiche.',
    fundstelle: 'Daniel 8,21',
  },
  dan240: {
    typ: 'bibel',
    kurz: 'Ein viertes Reich, stark wie Eisen, das alles zermalmt.',
    uebersetzung: '„Und ein viertes Reich wird sein, stark wie Eisen; wie Eisen alles zermalmt und zerschlägt, so wird es alle diese zermalmen." = Rom. Wer das vierte zerstört, zerstört die ganze Kette, die es in sich trägt.',
    fundstelle: 'Daniel 2,40',
  },
  dan241: {
    typ: 'bibel',
    kurz: 'Die Füße aus Eisen und Ton — ein geteiltes Reich.',
    uebersetzung: '„Dass du die Füße und Zehen teils aus Töpferton, teils aus Eisen gesehen hast — es wird ein geteiltes Reich sein." Rom, geteilt in Ost und West (395 n. Chr.).',
    fundstelle: 'Daniel 2,41',
  },

  // ---- the little horn (Constantine) ----
  dan725: {
    typ: 'bibel',
    kurz: 'Ein kleines Horn spricht gegen den Höchsten, unterdrückt die Heiligen und will Festzeiten und Gesetz ändern.',
    uebersetzung:
      '„Er wird Worte gegen den Höchsten reden und die Heiligen des Höchsten aufreiben und danach trachten, Festzeiten und Gesetz zu ändern; und sie werden in seine Hand gegeben für eine Zeit, Zeiten und eine halbe Zeit." (7,25) Sechs Merkmale — alle treffen auf Konstantin zu (Nicäa, Sonntags-Dekret, Verfolgung der Unitarier).',
    fundstelle: 'Daniel 7,25',
  },

  // ---- NT: Jesus' kingdom is not of this world ----
  joh1836: {
    typ: 'bibel',
    kurz: 'Jesus: „Mein Reich ist nicht von dieser Welt." Daniels Stein aber zerschmettert irdische Reiche.',
    original: 'ἡ βασιλεία ἡ ἐμὴ οὐκ ἔστιν ἐκ τοῦ κόσμου τούτου',
    sprache: 'grc',
    translit: 'hē basileía hē emḕ ouk éstin ek toû kósmou toútou',
    uebersetzung:
      '„Mein Reich ist nicht von dieser Welt." (Joh 18,36) Daniel 2,44 sagt aber: das Reich zerschmettert irdische Reiche und füllt die Erde. Jesu eigene Aussage steht in direktem Widerspruch zur Beschreibung des Steins.',
    fundstelle: 'Johannes 18,36',
    kern: 'οὐκ ... ἐκ τοῦ κόσμου τούτου',
  },

  // ---- NT: the Son of Man will be crucified (not rule/crush) ----
  mt2018: {
    typ: 'bibel',
    kurz: 'Jesu Menschensohn wird ausgeliefert und gekreuzigt — Daniels Menschensohn herrscht und zerschmettert.',
    uebersetzung:
      '„Siehe, wir ziehen hinauf nach Jerusalem, und der Menschensohn wird den Hohenpriestern und Schriftgelehrten ausgeliefert … sie werden ihn zum Tode verurteilen … verspotten, geißeln und kreuzigen." (Mt 20,18-19) Daniels Menschensohn (7,13-14) dagegen herrscht und empfängt das ewige Reich. Gegensatz.',
    fundstelle: 'Matthäus 20,18-19',
  },

  // ---- NT: the kingdom taken and given to a fruit-bearing people ----
  mt2143: {
    typ: 'bibel',
    kurz: 'Das Reich wird euch genommen und einem Volk gegeben, das Früchte bringt.',
    original: 'ἀρθήσεται ἀφ’ ὑμῶν ἡ βασιλεία τοῦ θεοῦ καὶ δοθήσεται ἔθνει ποιοῦντι τοὺς καρποὺς αὐτῆς',
    sprache: 'grc',
    translit: 'arthḗsetai aph’ hymôn hē basileía toû theoû kai dothḗsetai éthnei poioûnti toùs karpoùs autês',
    uebersetzung:
      '„Das Reich Gottes wird euch genommen und einem Volk gegeben werden, das seine Früchte bringt." (Mt 21,43) Jesus zitiert hier Ps 118,22 (der verworfene Stein wird Eckstein) — Beleg, dass das Reich zwei Dimensionen hat und übertragbar ist: die Juden „hatten" es auch ohne Staat.',
    fundstelle: 'Matthäus 21,42-43',
    kern: 'δοθήσεται ἔθνει',
  },

  // ---- source: Bukhari — the missing brick / seal of the prophets ----
  bukhari3535: {
    typ: 'quelle',
    kurz: 'Muhammad ﷺ: „Ich bin der fehlende Ziegel — und das Siegel der Propheten."',
    uebersetzung:
      '„Mein Gleichnis und das der Propheten vor mir ist wie ein Mann, der ein Haus schön und vollkommen baute, doch an einer Ecke fehlte ein Ziegel. Die Leute gingen umher und bewunderten es, sagten aber: Wäre nur dieser Ziegel gesetzt! Ich bin dieser Ziegel, und ich bin das Siegel der Propheten." (Der Hadith sagt „Ziegel"; den Eckstein-Bezug Ps 118,22 / Mt 21,42 liefert die theologische Verknüpfung.)',
    fundstelle: 'Ṣaḥīḥ al-Bukhārī 3535 · Ṣaḥīḥ Muslim 2286c',
    status: 'ṣaḥīḥ',
  },

  // ---- source: Bukhari — Gabriel appears in the form of a man ----
  bukhari3235: {
    typ: 'quelle',
    kurz: 'Gabriel erscheint Muhammad ﷺ in Männergestalt — wie er Daniel als „Mann" erschien (Dan 9,21).',
    uebersetzung:
      'Überliefert wird, dass der Engel Gabriel (Jibrīl) dem Propheten ﷺ in der Gestalt eines Mannes erschien (Ṣaḥīḥ Bukhārī 3235; vgl. den Hadith Jibrīls, in dem er als Mann in den Kreis tritt). Bei Daniel erscheint Gabriel „in Gestalt eines Mannes" (Dan 8,15; 9,21), kommt in eilendem Flug zur Gebetszeit und bringt frohe Botschaft — dieselbe Szene.',
    fundstelle: 'Ṣaḥīḥ al-Bukhārī 3235 · vgl. Sunnah.com B.2 H.250',
    status: 'ṣaḥīḥ',
  },

  // ---- source: pelach = serve, not worship ----
  pelach: {
    typ: 'quelle',
    kurz: 'pelach = „dienen", nicht „anbeten" — bezeugt in der eigenen Bibel.',
    uebersetzung:
      'Das aramäische pelach erscheint für schlichtes Dienen: Esra 7,24 (Tempeldiener / Diener des Königshauses), Gen 14,14 (Abrahams Männer / Soldaten), Gen 27,29 (Völker dienen Jakob), Gen 29,18 (Jakob dient Laban sieben Jahre). Niemand würde sagen, Jakob habe Laban angebetet. Die Völker „dienen" dem Menschensohn = sie gehorchen ihm. Heiser und Collins bestätigen die Bandbreite des Wortes.',
    fundstelle: 'Esra 7,24 · Gen 14,14 · 27,29 · 29,18',
  },

  // ---- source: formal vs functional division ----
  formalfunktional: {
    typ: 'quelle',
    kurz: 'Daniel zählt Babylon und Persien als EIN Reich — trotz Mitregenten. Teilung = formal, nicht funktional.',
    uebersetzung:
      'Babylon hatte zwei Könige zugleich: Nabonid und sein Sohn Belsazar als Mitregent (~553–539 v. Chr.; Beaulieu) — Daniel zählt es dennoch als EIN ungeteiltes Reich (das goldene Haupt). Persien hatte Xerxes-Mitregenten (Briant) — trotzdem EIN Reich. Rom wurde erst 395 n. Chr. formal geteilt (Theodosius → Honorius / Arcadius). Also war Rom zu Jesu Zeit (1. Jh.) nach Daniels Maßstab NICHT „geteilt".',
    fundstelle: 'Beaulieu (Nabonid / Belsazar) · Briant (Xerxes) · Boatwright (Rom 395)',
  },

  // ---- source: oldest Arabic OT manuscript — Habakkuk 3,3 ----
  habakuk: {
    typ: 'quelle',
    kurz: 'Älteste arab. Bibel-Handschrift: Habakuk 3,3 als Maḥmūd / Maḥāmidihi — Berg Paran = Hidschaz.',
    uebersetzung:
      'Die älteste arabische AT-Handschrift (Sinai-Kloster) übersetzt Habakuk 3,3 mit محمود / Maḥmūd („der Gepriesene") und محامده / Maḥāmidihi („seine Lobpreisungen") — beide aus der Wurzel Ḥ-M-D. „Berg Paran" = der Hidschaz / Mekka. Vorsicht: eine Übersetzung ist kein Urtext-Beweis; der Paran-Beweis selbst steht in Siegel III.',
    fundstelle: 'Älteste arab. AT-Handschrift (Sinai) · vgl. Habakuk 3,3',
    status: 'Übersetzung, kein Urtext (🟡)',
  },

  // ---- source: Josephus breaks off at the stone ----
  josephus: {
    typ: 'quelle',
    kurz: 'Josephus deutet Daniel 2 — bricht aber beim Stein bewusst ab, aus Angst vor den Römern.',
    uebersetzung:
      'Flavius Josephus (Antiquitates X.10.4 §210) deutet Nebukadnezars Traum, hält aber beim Stein inne: „es schien mir nicht angebracht, dies zu erzählen", und schickt den Leser, Daniel selbst zu lesen. Parente & Sievers: er wollte die römischen Leser nicht beleidigen — „nur ein begriffsstutziger Leser hätte den Punkt verpasst." Ein Jude unter römischer Besatzung wusste, dass der Stein Rom zerstören würde.',
    fundstelle: 'Josephus, Antiquitates X.10.4 (§210) · Parente & Sievers',
  },

  // ---- source: the 350-year reckoning (marble) ----
  iddan: {
    typ: 'quelle',
    kurz: '„Zeit, Zeiten und eine halbe Zeit" → 1 + 2 + ½ Jahrhunderte = 350 Jahre. 272 + 350 = 622.',
    uebersetzung:
      'Aramäisch iddan (Dan 7,25) = Zeitspanne (Tag / Monat / Jahr / Jahrhundert). Keil & Delitzsch: der aramäische Plural „Zeiten" ist ein Dual = „zwei". 1 + 2 + ½ = 3,5 Einheiten; als Jahrhunderte gelesen = 350 Jahre. Konstantins Geburt 272 + 350 = 622 = die Hidschra. Lexikon-Stützen: BDB, Gesenius, HALOT, John Gill, Jamieson-Fausset-Brown, Hieronymus. Ergänzend (🟡) — ein faszinierendes Zusatzindiz, kein mathematischer Beweis.',
    fundstelle: 'Daniel 7,25 · Keil & Delitzsch · BDB · Gesenius · HALOT',
    status: 'ergänzend (🟡)',
  },

  // ---- source: Talmud / 4 Esra — fourth kingdom = Rome ----
  talmud: {
    typ: 'quelle',
    kurz: 'Talmud (Rabbi Yoḥanan) & 4 Esra: das vierte Reich = Rom — die vorislamische jüdische Auslegung.',
    uebersetzung:
      'Der Babylonische Talmud (Rabbi Yoḥanan, ʿAvoda Zara 2b) nennt das vierte Reich „das ruchlose römische Reich". 4 Esra (1./2. Jh.) deutet den Adler als Daniels viertes Reich, besiegt vom Messias-Löwen. Nach 70 n. Chr. war das Vier-Reiche-Schema das kanonische jüdische Geschichtsmodell — Rom als viertes Reich ist also keine muslimische Erfindung, sondern vorislamische jüdische und christliche Auslegung.',
    fundstelle: 'b. ʿAvoda Zara 2b (Rabbi Yoḥanan) · 4 Esra 11–12',
  },

  // ---- source: church fathers — fourth kingdom = Rome ----
  kirchenvaeter: {
    typ: 'quelle',
    kurz: 'Die Kirchenväter selbst deuteten Daniels viertes Reich als Rom — lange vor dem Islam.',
    uebersetzung:
      'Hippolytus (Über Christus und den Antichrist V.26.28), Cyrill von Jerusalem (Catech. 15.13) und Irenäus (Adv. Haer.) deuten Daniels viertes Reich als Rom und die zehn Hörner als seine Teilung. Die Vier-Reiche-Deutung (4. Reich = Rom) stammt also von den christlichen Kirchenvätern selbst — nicht von Muslimen erfunden. Erst nach dem Aufstieg des Islam begannen Ausleger umzudeuten (Collins).',
    fundstelle: 'Hippolytus · Cyrill v. Jerusalem · Irenäus · vgl. Collins, Daniel (Hermeneia)',
  },

  // ---- source: Ben Abrahamson — rabbinic 622 reckoning (marble) ----
  benabrahamson: {
    typ: 'quelle',
    kurz: 'Rabbi Ben Abrahamson rechnet über Daniel 9 auf 622 — und erwartet einen Krieger-Messias aus Arabien.',
    uebersetzung:
      'Rabbi Ben Abrahamson rechnet über Daniel 9 ebenfalls auf das Jahr 622 und nennt den erwarteten „wahren Krieger-Messias". Eltern in Arabien, so die Überlegung, hätten ein Kind in dieser Hoffnung nach Daniels „Ish ḥamudot" (Mann der Kostbarkeiten, Dan 10,11.19) benannt: Muḥamud. Ein rabbinischer Präzedenzfall, der die H-M-D-Brücke (5.9) stützt. Ergänzend (🟡).',
    fundstelle: 'Rabbi Ben Abrahamson · vgl. Daniel 9 & 10,11.19',
    status: 'ergänzend (🟡)',
  },
}

export interface TimelinePoint {
  jahr: string
  titel: string
  text: string
  islam?: boolean
  jesus?: boolean
}

export const danielTimeline: TimelinePoint[] = [
  { jahr: '1. Jh.', titel: 'Jesus', text: 'Jesus wirkt — Jahrhunderte vor der Teilung Roms. Außerhalb des Fensters.', jesus: true },
  { jahr: '395', titel: 'Rom teilt sich', text: 'Tod Theodosius’ I. → das Reich teilt sich formal in Ost (Arcadius) und West (Honorius). Erst jetzt: „Füße aus Eisen und Ton".' },
  { jahr: '622', titel: 'Der islamische Staat', text: 'Die Hidschra — Gründung des islamischen Gemeinwesens in Medina. „In den Tagen jener Könige."', islam: true },
  { jahr: '1453', titel: 'Rom fällt', text: 'Konstantinopel — das letzte Rom — fällt an das muslimische Osmanische Reich. Der Stein zerschmettert das Eisen.', islam: true },
]

// Source badges for the timeline (the fall of Rome 1453, SPEC exhibit 2).
export const timelineQuellen = ['Finley', 'Nicolle', 'Crowley', 'Gibbon', 'Norwich', 'Treadgold']

export const danielVernetzung = [
  { ziel: 'Siegel IV — Maḥamaddīm', text: 'Die Statue (Gold-Haupt → Marmor-Beine) ist die Vorlage, mit der das Hohelied bewusst spielt (Bloch, Davis). Und Ḥ-M-D verbindet ḥamudot (Dan 9,23) ↔ maḥamaddim (Hld 5,16) ↔ ḥimdat (Haggai 2,7) ↔ Aḥmad.' },
  { ziel: 'Siegel III — Arabische Prophezeiungen', text: 'Habakuk 3,3 / Berg Paran erscheint hier in der ältesten arab. Handschrift als Maḥmūd; das fünfte Reich „zermalmt Rom und Persien" = die Eroberungen aus Siegel III.' },
  { ziel: 'Siegel II — Prophet wie Mose', text: 'Das kleine Horn „ändert Festzeiten und Gesetze" + der Gesetzgeber-Stein = der gesetzgebende Prophet.' },
  { ziel: 'Verteidigung — Falscher Prophet?', text: 'Konstantins Trinitäts-Konzil = das „Sprechen gegen Gott" + die Abrogations- / Gesetzesänderungs-Thematik.' },
  { ziel: 'Siegel VII — Jüdische Erwartung', text: '4 Esra, Rabbi Akiva, Bar Kochba und Rabbi Ben Abrahamson — Juden erwarteten aktiv das Reich Gottes und einen Krieger-Messias aus Arabien.' },
]

// ---- additional exhibits ----
export const pelachRows = [
  { stelle: 'Esra 7,24', text: 'Tempeldiener / Diener des Königshauses — schlichtes „dienen"' },
  { stelle: 'Genesis 14,14', text: 'Abrahams Männer (Soldaten) dienen ihm' },
  { stelle: 'Genesis 27,29', text: 'Völker dienen Jakob' },
  { stelle: 'Genesis 29,18', text: 'Jakob dient Laban sieben Jahre' },
]
export const pelachPointe =
  'Hat Jakob Laban angebetet? pelach heißt dienen — der Menschensohn wird befolgt, nicht vergöttert.'

export const hmdBridge = {
  root: 'Ḥ · M · D',
  hebrew: 'חֲמוּדוֹת',
  hebrewTrans: 'ḥamudot',
  hebrewRef: 'Daniel 9,23 — „vielgeliebt"',
  arabic: 'مُحَمَّد · أحْمَد',
  arabicTrans: 'Muhammad · Aḥmad',
  arabicRef: '„der Gepriesene"',
  note: 'Dieselbe semitische Wurzel — Strong H2530. Brücke zu Siegel IV (maḥamaddīm, Hld 5,16; ḥimdat, Haggai 2,7).',
}

// The full H-M-D web across the seals (SPEC 5.9 + Vernetzung exhibit 8).
export interface HmdGlied {
  wort: string
  translit: string
  stelle: string
  bedeutung: string
  siegel: string
}
export const hmdGlieder: HmdGlied[] = [
  { wort: 'חֲמוּדוֹת', translit: 'ḥamudot', stelle: 'Daniel 9,23', bedeutung: 'vielgeliebt / hochgeschätzt', siegel: 'Siegel V (hier)' },
  { wort: 'מַחֲמַדִּים', translit: 'maḥamaddim', stelle: 'Hohelied 5,16', bedeutung: '„ganz und gar begehrenswert"', siegel: 'Siegel IV' },
  { wort: 'חֶמְדַּת', translit: 'ḥimdat', stelle: 'Haggai 2,7', bedeutung: '„das Begehrte aller Völker"', siegel: 'Siegel IV' },
  { wort: 'أحْمَد', translit: 'Aḥmad', stelle: 'Sure 61,6', bedeutung: '„der Höchstgepriesene"', siegel: 'der Name' },
]

export const konstantinMarks = [
  { mark: 'Niedrige Herkunft, steigt auf', beleg: 'Helena, einfache Herkunft; Aufstieg vom Kommandeur zum Kaiser' },
  { mark: 'Unterwirft drei Könige', beleg: 'die Tetrarchie (4 Herrscher) — Konstantin besiegt seine Mitherrscher' },
  { mark: 'Spricht gegen den Höchsten', beleg: 'Konzil von Nicäa 325 — die Trinitätsdoktrin; Theodosius verbot Opposition' },
  { mark: 'Unterdrückt die Heiligen', beleg: 'Verfolgung der nicht-trinitarischen (unitarischen) Christen' },
  { mark: 'Ändert Festzeiten & Gesetze', beleg: 'Sonntags-Dekret: „Am ehrwürdigen Tag der Sonne sollen die Magistrate ruhen"' },
  { mark: 'Seine Macht wird genommen', beleg: 'Konstantinopel (324 gegründet) fällt 1453 an die Muslime' },
]

// ---- formal-vs-functional panel (SPEC exhibit 5) ----
export interface FormalRow {
  reich: string
  mitregenten: string
  gezaehlt: string
}
export const formalFunktional: FormalRow[] = [
  { reich: 'Babylon (Goldkopf)', mitregenten: 'Nabonid + Belsazar als Mitregent (~553–539 v. Chr.)', gezaehlt: 'EIN ungeteiltes Reich' },
  { reich: 'Persien (Silber)', mitregenten: 'Xerxes und seine Mitregenten', gezaehlt: 'EIN Reich' },
  { reich: 'Rom (Eisen)', mitregenten: 'Klientelkönige zu Jesu Zeit (funktional)', gezaehlt: 'noch UNGETEILT' },
  { reich: 'Rom (Eisen + Ton)', mitregenten: 'Theodosius → Honorius / Arcadius, 395 n. Chr.', gezaehlt: 'erst JETZT formal geteilt' },
]
export const formalFunktionalPointe =
  'Daniel zählt formal, nicht funktional. Babylon und Persien hatten Mitregenten und galten dennoch als EIN Reich. Also war Rom zu Jesu Zeit nach Daniels eigenem Maßstab nicht „geteilt" — die Teilung kam erst 395.'
export const formalFunktionalQuellen = ['Beaulieu', 'Briant', 'Boatwright']

// ---- 350-year panel (marble, SPEC exhibit 7) ----
export const jahre350 = {
  formel: '1 + 2 + ½ = 3½ Jahrhunderte',
  rechnung: '272 (Konstantins Geburt) + 350 = 622 (die Hidschra)',
  schritte: [
    { wort: '„eine Zeit"', wert: '1 Jahrhundert' },
    { wort: '„Zeiten" (Dual)', wert: '2 Jahrhunderte' },
    { wort: '„eine halbe Zeit"', wert: '½ Jahrhundert' },
  ],
  lexika: ['Brown-Driver-Briggs', 'Gesenius', 'HALOT', 'John Gill', 'Jamieson-Fausset-Brown', 'Hieronymus'],
  note: 'Aramäisch iddan = Zeitspanne; „Zeiten" als Dual = zwei (Keil & Delitzsch). Ausdrücklich ergänzend: ein faszinierendes Zusatzindiz, kein mathematischer Beweis. Konstantins Geburtsjahr und solar vs. lunar sind weiche Annahmen.',
}

// ---- Eckstein / Ziegel synopsis (SPEC exhibit 9, two columns) ----
export const ecksteinSynopse = {
  links: {
    label: 'Bibel — Mt 21,42-43 (Ps 118,22)',
    rows: [
      'Der Stein, den die Bauleute verwarfen, ist zum Eckstein geworden.',
      'Das Reich Gottes wird euch genommen und einem Volk gegeben, das Früchte bringt.',
      'Die Bauleute (die religiöse Führung) verwerfen den Stein — und er wird zum Haupt.',
    ],
  },
  rechts: {
    label: 'Hadith — Ṣaḥīḥ Bukhārī 3535 / Muslim 2286c',
    rows: [
      'Ein Haus, schön gebaut, dem an einer Ecke ein Ziegel fehlt.',
      '„Ich bin dieser Ziegel, und ich bin das Siegel der Propheten."',
      'Muhammad ﷺ nennt sich selbst den fehlenden Baustein — ohne Zugang zu Tanach / NT.',
    ],
  },
  note: 'Der Hadith sagt „Ziegel"; den Eckstein-Bezug (Ps 118,22 / Mt 21,42) liefert die theologische Brücke — beim Bau so gekennzeichnet. Die Bauleute (Juden) verwarfen ihn: historisch eingetreten.',
}

// ---- zwei Dimensionen (physical + spiritual kingdom) ----
export const zweiDimensionen = {
  intro:
    'Das Reich Gottes hat zwei Dimensionen — und beide gehören zusammen. Das entkräftet zugleich den „geistlich"-Einwand und den „die Osmanen endeten 1924"-Einwand.',
  physisch: {
    h: 'Physisch — politische Macht',
    text: 'Der Stein zermalmt Rom und Persien militärisch und wird zum Berg, der die Erde füllt (Dan 2,44-45). „Zerschmettern" ist Kriegssprache. Die Kirche fiel unter römische Verfolgung — der Islam eroberte Rom (1453).',
  },
  geistlich: {
    h: 'Geistlich — bleibende Autorität',
    text: 'Mt 21,43 beweist es: die Juden „hatten" das Reich auch ohne eigenen Staat. olam heißt „lange Zeit", nicht zwingend Ewigkeit (Joel 2,27; Jona 2,6; Ex 21,6; Gen 17,8). Auch nach 1924 bleibt das geistliche Reich bei der Umma.',
  },
  pointe:
    'Jesus sagt „nicht von dieser Welt" (Joh 18,36) — und scheidet damit aus der physischen Dimension aus, die Daniel verlangt. Der Islam erfüllt beide.',
}

export const danielGleicheMassstaebe =
  'Der Kritiker verlangt für den Islam ein perfekt eingetroffenes Zeitfenster — und akzeptiert für Jesus eine Daniel-9-Rechnung, die mit keinem Startdatum aufgeht, plus eine Umdeutung des „Steins" in einen erst bei der Wiederkunft alles zerstörenden „Antichrist". Er nimmt pelach als „göttliche Anbetung", obwohl dasselbe Wort in seiner eigenen Bibel schlicht „dienen" heißt (Jakob / Laban). Auf gleichen Maßstäben zerbricht die Jesus-Deutung an Daniels eigener Chronologie — und genau ein Reich der Geschichte erfüllt alle vier Bedingungen des Steins.'
