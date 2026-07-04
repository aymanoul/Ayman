import type { Band } from '../components/Bookshelf'

// Die Buchreihe "Ar-Raheeq Al-Makhtoom" — die 9 Siegel des Moduls
// "Muhammad in der Bibel" als Bände. Genutzt von der Startseite (Saal)
// und der Regal-Seite.
export const regalTitel = 'الرحيق المختوم'
export const regalAutor = 'ابن محمد والحجي'
export const regalVerlag = 'دار السنة'

const S = '/modul/muhammad/siegel'
export const regalBaende: Band[] = [
  { nr: 1, name: 'الأساس', deutsch: 'Das Fundament', to: `${S}/fundament` },
  { nr: 2, name: 'ذرية إبراهيم', deutsch: 'Abrahams Nachkommen', to: `${S}/abrahams-nachkommen` },
  { nr: 3, name: 'نبي مثل موسى', deutsch: 'Prophet wie Mose', to: `${S}/prophet-wie-mose` },
  { nr: 4, name: 'النبوءات العربية', deutsch: 'Arabische Prophezeiungen', to: `${S}/arabische-prophezeiungen` },
  { nr: 5, name: 'نشيد الأنشاد', deutsch: 'Das Hohelied', to: `${S}/hohelied` },
  { nr: 6, name: 'دانيال', deutsch: 'Daniel', to: `${S}/daniel` },
  { nr: 7, name: 'الفارقليط', deutsch: 'Der Paraklet', to: `${S}/paraklet` },
  { nr: 8, name: 'انتظار اليهود', deutsch: 'Jüdische Erwartung', to: `${S}/juedische-erwartung` },
  { nr: 9, name: 'الدفاع', deutsch: 'Verteidigung', to: `${S}/verteidigung` },
]
