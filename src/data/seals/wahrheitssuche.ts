import type { Beleg } from '../types'

// ---------------------------------------------------------------------------
// BAND 1 — DIE WAHRHEITSSUCHE (Einfuehrung des Werks)
// Das methodische Fundament: warum die Person Jesu der Schluessel ist, den
// Christentum und Islam teilen; warum Emotion und Herkunft schlechte Fuehrer
// sind; und mit welchen Werkzeugen (Bibel, Geschichte, Vernunft) und Regeln
// (Aufrichtigkeit, gleiche Massstaebe) wir vorgehen. Traegt die ganze Reihe.
// Volltext der Belege liegt auf den Beleg-Karten und oeffnet im Modal.
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

export interface Regel {
  regel: string
  text: string
}

export const wahrheitssucheThese =
  'Bevor ein einziges Buch geöffnet wird, steht eine Entscheidung im Raum: Suchen wir die Wahrheit über Gott mit demselben Ernst, mit dem ein Detektiv einen Fall löst — oder folgen wir blind dem, in das wir hineingeboren wurden? Der Einsatz ist ein einziges Leben. Christentum und Islam teilen eine Schlüsselfigur — Jesus, den Messias —, erheben über ihn aber einander widersprechende Ansprüche. Da nicht beide recht haben können, brauchen wir Werkzeuge (Bibel, Geschichte, Vernunft), Aufrichtigkeit und vor allem gleiche Maßstäbe. Auf diesem Fundament dürfen die sechs Bände sprechen.'

export const wahrheitssucheSteps: Step[] = [
  {
    n: 'I',
    h: 'Der Einsatz',
    body: 'Niemand möchte sein Leben einer Religion widmen, nur um nach dem Tod festzustellen, dass er falsch lag. Wir haben ein Leben, eine Chance — der Einsatz ist hoch. Und Gott gab uns die Fähigkeit zu vernünftigem Urteil: ein Beweis, dass Er kein blindes Folgen will.',
  },
  {
    n: 'II',
    h: 'Emotion ist kein Beweis',
    body: 'Eine Christin in Cambridge gestand, sie zweifle an der Kreuzigung — und werde doch bis ins Grab daran festhalten, um die Familie nicht zu verärgern. Eine schöne, tröstliche Vorstellung ist nicht schon deshalb wahr. Erst die objektive Wahrheit feststellen, dann sich emotional festlegen — nicht umgekehrt.',
  },
  {
    n: 'III',
    h: 'Jesus als Schlüssel',
    body: 'Der Islam ist außer dem Christentum die einzige Weltreligion, die Jesus als Messias anerkennt. Fast zwei Milliarden Christen und über 1,5 Milliarden Muslime glauben an ihn — und doch ist er vielleicht der am meisten missverstandene Mensch der Geschichte. Sein Leben und seine Lehre sind der gemeinsame Boden, auf dem beide Religionen geprüft werden.',
  },
  {
    n: 'IV',
    h: 'Die Werkzeuge',
    body: 'Im Palästina des ersten Jahrhunderts könnten wir Jesus einfach nach seiner Botschaft fragen. Da uns das verwehrt ist, nutzen wir Bibel, Geschichte und Vernunft: Informationen sammeln, konkurrierende Ansprüche vergleichen, Widersprüche beilegen — Ermittlungsarbeit. Dazu Aufrichtigkeit: die eigenen Überzeugungen infrage stellen und Vorurteile über andere beiseitelassen.',
  },
]

export const wahrheitssucheBelege: Record<string, Beleg> = {
  // ---- The emotional pull of the atonement narrative ----
  joh316: {
    typ: 'bibel',
    kurz: 'Denn Gott hat die Welt so sehr geliebt, dass er seinen einzigen Sohn hingab.',
    uebersetzung:
      '„Denn Gott hat die Welt so sehr geliebt, dass er seinen einzigen Sohn hingab, damit jeder, der an ihn glaubt, nicht zugrunde geht, sondern das ewige Leben hat." — Die emotionale Sprache, die die Bindung an Kreuzigung und Menschwerdung trägt. Schön und tröstlich; aber die Frage bleibt: ist sie auch wahr?',
    fundstelle: 'Johannes 3,16',
    kern: 'den einzigen Sohn hingab',
  },

  // ---- Reason is God-given and meant to be used ----
  q1678: {
    typ: 'quran',
    kurz: 'Er gab euch Gehör, Augenlicht und Herzen — auf dass ihr dankbar seid.',
    original:
      'وَاللَّهُ أَخْرَجَكُم مِّن بُطُونِ أُمَّهَاتِكُمْ لَا تَعْلَمُونَ شَيْئًا وَجَعَلَ لَكُمُ السَّمْعَ وَالْأَبْصَارَ وَالْأَفْئِدَةَ',
    sprache: 'ar',
    translit: 'wa-llāhu akhrajakum min buṭūni ummahātikum lā taʿlamūna shayʾan wa-jaʿala lakumu s-samʿa wa-l-abṣāra wa-l-afʾidah',
    uebersetzung:
      '„Und Allah hat euch aus den Leibern eurer Mütter hervorgebracht, während ihr nichts wusstet. Und Er hat euch Gehör, Augenlicht und Herzen gegeben, auf dass ihr dankbar sein möget." — Verstand und Sinne sind Gottes Gaben, gerade auch für die Wahrheitssuche.',
    fundstelle: 'Sure 16 (an-Naḥl), Vers 78',
    kern: 'الْأَفْئِدَةَ',
  },

  // ---- The Quran as the bridge that unites the Abrahamic faiths ----
  q3113: {
    typ: 'quran',
    kurz: 'Sag: Wir glauben an Allah und an das, was zu Abraham, Mose und Jesus herabgesandt wurde.',
    original:
      'قُلْ آمَنَّا بِاللَّهِ وَمَا أُنزِلَ عَلَيْنَا وَمَا أُنزِلَ عَلَىٰ إِبْرَاهِيمَ ... وَمَا أُوتِيَ مُوسَىٰ وَعِيسَىٰ',
    sprache: 'ar',
    translit: 'qul āmannā bi-llāhi wa-mā unzila ʿalaynā wa-mā unzila ʿalā Ibrāhīma … wa-mā ūtiya Mūsā wa-ʿĪsā',
    uebersetzung:
      '„Sag: Wir glauben an Allah und an das, was zu uns herabgesandt wurde, und an das, was zu Abraham … und (an das,) was Musa und ʿĪsā gegeben wurde. Wir machen keinen Unterschied bei jemandem von ihnen." — Der Koran versteht sich als die Brücke, die Judentum und Christentum verbindet.',
    fundstelle: 'Sure 3 (Āl ʿImrān), Vers 84 · vgl. 2,136',
    kern: 'مُوسَىٰ وَعِيسَىٰ',
  },

  // ---- Source: the arbitrariness of inherited belief ----
  herkunft: {
    typ: 'quelle',
    kurz: 'Blindes Folgen macht Überzeugungen willkürlich — wir haben uns die Religion der Geburt nicht ausgesucht.',
    uebersetzung:
      'Wenn Religion nichts anderes ist, als blind den Vorfahren zu folgen, dann sind unsere Überzeugungen willkürlich — denn wir haben uns die Religion, in die wir hineingeboren wurden, nicht ausgesucht. In Indien geboren wären wir mit derselben Haltung Hindus, im kommunistischen China höchstwahrscheinlich Atheisten. Darum muss man die eigenen Überzeugungen mit kritischem Blick und die anderer unvoreingenommen prüfen.',
    fundstelle: 'Abu Zakariya, Jesus: Mensch, Gesandter, Messias — Einführung',
  },

  // ---- Source: truth as detective work ----
  detektiv: {
    typ: 'quelle',
    kurz: 'Wichtige Informationen sammeln, konkurrierende Ansprüche vergleichen, Meinungsverschiedenheiten beilegen — Ermittlungsarbeit.',
    uebersetzung:
      'Da wir Jesus nicht mehr persönlich befragen können, nutzen wir die verfügbaren Werkzeuge: Bibel, Geschichte und Vernunft. Auf der Suche nach der Wahrheit sammeln wir wichtige Informationen, vergleichen konkurrierende Ansprüche und legen Meinungsverschiedenheiten bei. Wenn das nach der Ermittlungsarbeit eines Detektivs klingt, dann irren Sie sich nicht — es geht darum, unter den Mythen und Neuerungen, die sich in den Jahrhunderten nach Jesus entwickelten, seine wahre Botschaft freizulegen.',
    fundstelle: 'Abu Zakariya, ebd. — Einführung',
  },
}

export const wahrheitssucheSpielregeln: Regel[] = [
  { regel: 'Objektiv vorgehen', text: 'Erst die Wahrheit feststellen, dann sich emotional festlegen — nie umgekehrt.' },
  { regel: 'Vernunft einsetzen', text: 'Der gottgegebene Intellekt unterscheidet uns vom Tier; Beweise systematisch und logisch abwägen.' },
  { regel: 'Werkzeuge nutzen', text: 'Bibel, Geschichte und Vernunft — Informationen sammeln, Ansprüche vergleichen, Widersprüche beilegen.' },
  { regel: 'Gleiche Maßstäbe', text: 'Was als Beweis für die eine Seite zählt, muss auch für die andere zählen — und umgekehrt.' },
  { regel: 'Aufrichtigkeit', text: 'Die eigenen Überzeugungen infrage stellen und vorgefasste Meinungen über andere beiseitelassen.' },
  { regel: 'Nicht blind folgen', text: 'Die Religion der Geburt ist nicht schon deshalb wahr; das Erbe rechtfertigt keine Überzeugung.' },
]

export const wahrheitssucheKonter: KonterItem[] = [
  {
    tier: 'stone',
    einwand: '„Religion ist doch einfach das, worin man aufgewachsen ist."',
    konter:
      'Eben deshalb ist blindes Folgen kein Grund: Es macht jede Überzeugung willkürlich. In Indien geboren, wären wir Hindus; im kommunistischen China Atheisten. Niemand hat sich die Religion der Geburt ausgesucht. Nur die unvoreingenommene Prüfung — der eigenen wie der fremden Überzeugungen — kann zur Wahrheit führen.',
    belegId: 'herkunft',
  },
  {
    tier: 'stone',
    einwand: '„Der Glaube gibt mir Trost — warum ihn überhaupt hinterfragen?"',
    konter:
      'Weil eine schöne Vorstellung nicht schon deshalb wahr ist. Die Christin in Cambridge zweifelte an der Kreuzigung und hielt dennoch fest — aus Angst, die Familie zu verärgern. Sie war bereit, eine Lüge zu leben. Der Einsatz ist aber ein ganzes, einmaliges Leben; da darf Emotion den Blick nicht trüben.',
    belegId: 'joh316',
  },
  {
    tier: 'stone',
    einwand: '„2000 Jahre später kann man über Jesus doch gar nichts mehr sicher wissen."',
    konter:
      'Wir können nicht mehr zu ihm gehen und fragen — aber wir sind nicht mittellos. Bibel, Geschichte und Vernunft sind die Werkzeuge des Ermittlers: Quellen sammeln, konkurrierende Ansprüche vergleichen, Widersprüche beilegen. Genau das leisten die folgenden Bände, Zug um Zug.',
    belegId: 'detektiv',
  },
  {
    tier: 'stone',
    einwand: '„Glaube und Vernunft schließen sich aus — such die Wahrheit nicht mit dem Kopf."',
    konter:
      'Der Koran sagt das Gegenteil: Gott gab uns Gehör, Augenlicht und Herzen, „auf dass ihr dankbar seid" (16,78). Dass Er uns die Fähigkeit zu urteilen gab, ist selbst der Beweis, dass Er kein blindes Folgen will. Vernunft ist nicht der Feind des Glaubens, sondern sein Werkzeug.',
    belegId: 'q1678',
  },
  {
    tier: 'marble',
    einwand: '„Christentum und Islam sind zu verschieden, um sie an einem Maßstab zu messen."',
    konter:
      'Sie teilen mehr, als man denkt: beide erkennen Jesus als Messias an, verehren Abraham, Mose und Jesus und glauben an den Gerichtstag. Der Koran versteht sich ausdrücklich als Brücke, die Judentum und Christentum vereint (3,84). Gerade diese gemeinsame Figur — Jesus — macht einen fairen, gemeinsamen Prüfstein möglich.',
    belegId: 'q3113',
  },
]

export const wahrheitssucheScholar: ScholarItem[] = [
  {
    tier: 'stone',
    h: '1.1 — Der erkenntnistheoretische Ausgangspunkt',
    body: 'Die Suche beginnt nicht mit einer Glaubensbehauptung, sondern mit einer Methode: Überzeugungen dürfen nicht aus Herkunft oder Gefühl stammen, sondern aus geprüften Beweisen. Da Gott jedem die Vernunft gab, ist blindes Folgen selbst ein Verstoß gegen die Absicht des Schöpfers. Erst die festgestellte Wahrheit rechtfertigt die emotionale Bindung — nicht umgekehrt.',
  },
  {
    tier: 'stone',
    h: '1.2 — Warum gerade Jesus der Prüfstein ist',
    body: 'Jesus ist die einzige Schlüsselfigur, die beide Religionen als real, bedeutend und messianisch anerkennen — und über die sie zugleich unvereinbare Aussagen treffen (bloßer Mensch/Gesandter versus göttlicher Sohn). Weil nicht beide recht haben können, liefert seine Person den schärfsten gemeinsamen Testfall: An ihm entscheidet sich die Frage nach der wahren Botschaft.',
  },
  {
    tier: 'stone',
    h: '1.3 — Die Werkzeuge und ihre Grenzen',
    body: 'Ohne den historischen Jesus befragen zu können, bleiben Bibel, Geschichte und Vernunft. Diese Werkzeuge werden nach festen Regeln geführt: Quellen im Kontext lesen, Zeugnisse vergleichen, Widersprüche als Signale ernst nehmen. Das Ziel ist, die ursprüngliche Botschaft freizulegen, die unter späteren Mythen und Neuerungen verschüttet wurde.',
  },
  {
    tier: 'marble',
    h: '1.4 — Aufrichtigkeit als Bedingung',
    body: 'Die schwierigste Regel ist die letzte: die eigenen Prämissen zur Disposition stellen. Wer nur die fremde Position prüft und die eigene ausnimmt, misst mit zweierlei Maß und wird die Wahrheit verfehlen. Die Reise ist nicht immer angenehm — doch für das, was im Leben wertvoll ist, lohnt der Kampf.',
  },
]

export const wahrheitssucheVernetzung = [
  { ziel: 'Band 2 — Das Gotteskonzept', text: 'Der erste Testfall: Hält der christliche Gottesbegriff (Dreifaltigkeit) der Prüfung durch Bibel, Geschichte und Vernunft stand — und was setzt der Tauhid dagegen?' },
  { ziel: 'Band 3 — Der wahre Jesus', text: 'Wer war Jesus wirklich? Mensch, Gesandter und Messias — im Licht von Koran und der Prophetentradition der Schrift.' },
  { ziel: 'Band 6 — Der angekündigte Prophet', text: 'Am Ende schließt sich der Kreis: dieselbe Ermittlungsmethode, angewandt auf die Prophezeiungen der Schrift.' },
]

export const wahrheitssucheGleicheMassstaebe =
  'Wer die Ansprüche der einen Religion streng prüft und die der eigenen ungeprüft lässt, hat die Wahrheitssuche schon verfehlt. Dieses Fundament verlangt nur eines: Miss beide Seiten mit demselben Maß — dieselben Quellen, dieselbe Vernunft, dieselbe Aufrichtigkeit. Erst auf gleichen Maßstäben darf am Ende ein Urteil stehen.'
