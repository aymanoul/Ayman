import type { Band } from '../components/Bookshelf'

// Die Buchreihe "Der versiegelte Nektar" (Ar-Raheeq Al-Makhtoom) —
// die 9 Buecher als Baende. Genutzt von der Startseite (Saal)
// und der Regal-Seite.
//
// Auf dem Buchruecken traegt jeder Band den DEUTSCHEN Titel (Feld `deutsch`);
// `name` haelt den arabischen Originaltitel als Referenz (nicht mehr gerendert).
export const regalTitel = 'الرحيق المختوم'
export const regalVerlag = 'دار السنة'

const S = '/modul/muhammad/buch'
export const regalBaende: Band[] = [
  { nr: 1, name: 'الأساس', deutsch: 'Das Fundament', to: `${S}/fundament` },
  { nr: 2, name: 'ذرية إبراهيم', deutsch: 'Abrahams Nachkommen', to: `${S}/abrahams-nachkommen` },
  { nr: 3, name: 'نبي مثل موسى', deutsch: 'Prophet wie Mose', to: `${S}/prophet-wie-mose` },
  { nr: 4, name: 'النبوءات العربية', deutsch: 'Arabische Prophezeiungen', to: `${S}/arabische-prophezeiungen` },
  { nr: 5, name: 'نشيد الأنشاد', deutsch: 'Das Hohelied', to: `${S}/hohelied` },
  { nr: 6, name: 'دانيال', deutsch: 'Daniel', to: `${S}/daniel` },
  { nr: 7, name: 'الفارقليط', deutsch: 'Der Paraklet', to: `${S}/paraklet` },
  { nr: 8, name: 'انتظار اليهود', deutsch: 'Jüdische Erwartung', to: `${S}/juedische-erwartung` },
  { nr: 9, name: 'الدفاع', deutsch: 'Falscher Prophet', to: `${S}/verteidigung` },
]
