import type { Band } from '../components/Bookshelf'

// Die Buchreihe "Jesus: Mensch, Gesandter, Messias" (Abu Zakariya, iERA) —
// das zweite Werk der Bibliothek, in 9 Baende gegliedert. Aufbau spiegelt
// "Der versiegelte Nektar" 1:1: auf dem Ruecken der DEUTSCHE Bandtitel
// (Feld `deutsch`), `name` haelt einen arabischen Bezugsbegriff.
//
// Quelle: Einfuehrung + Kapitel 1-8 des Werks. Baende 1-3 (Einfuehrung,
// Dreifaltigkeit, Tauhid) sind ausgearbeitet; 4-9 folgen, sobald der
// restliche Text (S. 74-264) vorliegt.
export const regalJesusTitel = 'عيسى'
export const regalJesusVerlag = 'ابن مريم'

const S = '/modul/jesus/buch'
export const regalJesusBaende: Band[] = [
  { nr: 1, name: 'الحق', deutsch: 'Die Wahrheitssuche', to: `${S}/wahrheitssuche` },
  { nr: 2, name: 'التثليث', deutsch: 'Die Dreifaltigkeit', to: `${S}/dreifaltigkeit` },
  { nr: 3, name: 'التوحيد', deutsch: 'Der eine Gott', to: `${S}/tauhid` },
  { nr: 4, name: 'الأنبياء', deutsch: 'Die Propheten', to: `${S}/propheten` },
  { nr: 5, name: 'الفداء', deutsch: 'Schuld & Sühne', to: `${S}/suehne` },
  { nr: 6, name: 'الصلب', deutsch: 'Die Kreuzigung', to: `${S}/kreuzigung` },
  { nr: 7, name: 'الحفظ', deutsch: 'Bewahrung der Schrift', to: `${S}/bewahrung` },
  { nr: 8, name: 'بولس', deutsch: 'Paulus', to: `${S}/paulus` },
  { nr: 9, name: 'البشارة', deutsch: 'Der angekündigte Prophet', to: `${S}/angekuendigt` },
]
