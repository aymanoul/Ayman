// Beweis-Karten: exakter, freigegebener Wortlaut (docs/phase3-beweisliste.md, docs/phase3-drehbuch.md).
// Quran: Arabisch von quranenc.com (KFGQPC-kodiert, nur mit KFGQPC-Schrift setzen), Deutsch Bubenheim & Elyas.
// Hadith: Wortlaut und Gradierung von hadeethenc.com. Nummern mit ⚠️ in der Beweisliste: vor Abgabe prüfen.
export const CARDS = {
  Q1: { kind: 'quran', ar: 'إِنَّ ٱلصَّلَوٰةَ كَانَتۡ عَلَى ٱلۡمُؤۡمِنِينَ كِتَٰبٗا مَّوۡقُوتٗا', de: '„Das Gebet ist den Gläubigen zu bestimmten Zeiten vorgeschrieben.“', src: 'Sura an-Nisāʾ, Vers 103 (Auszug)' },
  Q4: { kind: 'quran', ar: 'فَوَيۡلٞ لِّلۡمُصَلِّينَ\nٱلَّذِينَ هُمۡ عَن صَلَاتِهِمۡ سَاهُونَ', de: '„Wehe nun den Betenden, denjenigen, die auf ihre Gebete nicht achten,“', src: 'Sura al-Māʿūn, Vers 4–5' },
  Q5: { kind: 'quran', ar: 'مَا سَلَكَكُمۡ فِي سَقَرَ\nقَالُواْ لَمۡ نَكُ مِنَ ٱلۡمُصَلِّينَ', de: '„Was hat euch in Saqar geführt? Sie werden sagen: Wir gehörten nicht zu denjenigen, die beteten,“', src: 'Sura al-Muddaththir, Vers 42–43' },
  H2: { kind: 'hadith', ar: 'إِنَّ بَيْنَ الرَّجُلِ وَبَيْنَ الشِّرْكِ وَالْكُفْرِ تَرْكَ الصَّلَاةِ', de: '„Zwischen einer Person und dem Götzendienst (Schirk) und dem Unglauben (Kufr) steht die Unterlassung des Gebets.“', src: 'Überliefert von Jābir · Muslim 82' },
  H7: { kind: 'hadith', ar: 'إن أول ما يحاسب به العبد الصلاة', de: '„Das Erste, worüber der Diener abgerechnet wird, ist das Gebet.“', src: 'Überliefert von Tamīm ad-Dārī · Abū Dāwūd, Ibn Māja, ad-Dārimī · ḥasan' },
  H1: { kind: 'hadith', ar: 'الصَّلاَةُ عَلَى وَقْتِهَا', de: '„Ich fragte den Propheten - Allahs Segen und Frieden auf ihm -: ‚Welche Tat ist Allah am liebsten?‘ Er sagte: ‚Das Gebet zur rechten Zeit.‘ …“', src: 'Überliefert von ʿAbdullāh ibn Masʿūd · al-Bukhārī 527, Muslim 85' },
  H4a: { kind: 'hadith', de: '„Was meint ihr, wenn vor der Tür eines von euch ein Fluss wäre, in dem er sich jeden Tag fünfmal wäscht, würde das etwas von seinem Schmutz übriglassen?“', src: 'Überliefert von Abū Huraira · al-Bukhārī 528, Muslim 667 (1/2)' },
  H4b: { kind: 'hadith', de: 'Sie sagten: „Es würde nichts von seinem Schmutz übriglassen.“ Er sagte: „So ist es mit den fünf Gebeten, Allah tilgt damit die Sünden.“', src: 'Überliefert von Abū Huraira · al-Bukhārī 528, Muslim 667 (2/2)' },
};
