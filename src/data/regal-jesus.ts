import type { Band } from '../components/Bookshelf'

// Die Buchreihe "Jesus, der Gesandte Gottes" (Abu Zakariya, iERA) — das zweite
// Werk der Bibliothek, in 6 Baende nach Oberthemen gegliedert. Aufbau spiegelt
// "Der versiegelte Nektar": auf dem Ruecken der DEUTSCHE Bandtitel (Feld
// `deutsch`) im Medaillon, `name` haelt einen arabischen Bezugsbegriff.
//
// Ruecken-Textur: public/images/regal/spine2.png (770x2042, navy/gold).
// Kopf-Feld traegt den arabischen Reihentitel, Fuss-Kartusche den "Verlag".
//
// 6-Oberthemen-Struktur (Argumente nach Sinn gebuendelt):
//   1 Wahrheitssuche  → Einfuehrung (Methode)
//   2 Gotteskonzept   → Kap. 1 (Trinitaet) + Gottes-Teile aus Kap. 2 (Tauhid)
//   3 Der wahre Jesus → Jesus-Teile aus Kap. 2 + Kap. 3 (Propheten in der Schrift)
//   4 Das Kreuz       → Kap. 4 (Suehne) + Kap. 5 (Kreuzigung)
//   5 Botschaft       → Kap. 6 (Bewahrung) + Kap. 7 (Paulus)
//   6 Angekuendigt    → Kap. 8 (Prophezeiungen) + Abschluss
export const regalJesusTitel = 'عيسى رسول الله'
export const regalJesusVerlag = 'دار السنة'

const S = '/modul/jesus/buch'
export const regalJesusBaende: Band[] = [
  { nr: 1, name: 'الحق', deutsch: 'Die Wahrheitssuche', to: `${S}/wahrheitssuche` },
  { nr: 2, name: 'التوحيد', deutsch: 'Das Gotteskonzept', to: `${S}/gotteskonzept` },
  { nr: 3, name: 'المسيح', deutsch: 'Der wahre Jesus', to: `${S}/wahrer-jesus` },
  { nr: 4, name: 'الصليب', deutsch: 'Das Kreuz', to: `${S}/kreuz` },
  { nr: 5, name: 'الرسالة', deutsch: 'Die verlorene Botschaft', to: `${S}/botschaft` },
  { nr: 6, name: 'البشارة', deutsch: 'Der angekündigte Prophet', to: `${S}/angekuendigt` },
]
