import { Link } from 'react-router-dom'
import Bookshelf from '../components/Bookshelf'
import { ArrowLeft } from '../components/icons'

// Die 9 Siegel des Moduls "Muhammad in der Bibel" als Bände der Reihe —
// Bandnamen sind die arabischen Übersetzungen der Siegel-Titel, jeder Band
// verlinkt auf sein Siegel.
const S = '/modul/muhammad/siegel'
const baende = [
  { nr: 1, name: 'الأساس', to: `${S}/fundament` }, // Das Fundament
  { nr: 2, name: 'ذرية إبراهيم', to: `${S}/abrahams-nachkommen` }, // Abrahams Nachkommen
  { nr: 3, name: 'نبي مثل موسى', to: `${S}/prophet-wie-mose` }, // Prophet wie Mose
  { nr: 4, name: 'النبوءات العربية', to: `${S}/arabische-prophezeiungen` }, // Arabische Prophezeiungen
  { nr: 5, name: 'نشيد الأنشاد', to: `${S}/hohelied` }, // Das Hohelied
  { nr: 6, name: 'دانيال', to: `${S}/daniel` }, // Daniel
  { nr: 7, name: 'الفارقليط', to: `${S}/paraklet` }, // Der Paraklet
  { nr: 8, name: 'انتظار اليهود', to: `${S}/juedische-erwartung` }, // Jüdische Erwartung
  { nr: 9, name: 'الدفاع', to: `${S}/verteidigung` }, // Verteidigung
]

export default function Regal() {
  return (
    <main className="shell">
      <div
        className="wrap"
        style={{ maxWidth: 1320, paddingTop: 'clamp(1.5rem, 5vh, 2.5rem)', paddingBottom: '4rem' }}
      >
        <Link to="/" className="stub__back" style={{ marginTop: 0 }}>
          <ArrowLeft /> Bibliothek
        </Link>

        <header className="seal__head" style={{ marginTop: '1rem' }}>
          <span className="seal__num">Buchreihe</span>
          <h1 className="seal__title">Ar-Raheeq Al-Makhtoom</h1>
          <span className="seal__ar arabic">الرحيق المختوم</span>
        </header>

        <Bookshelf
          titel="الرحيق المختوم"
          autor="ابن محمد والحجي"
          verlag="دار السنة"
          baende={baende}
        />
      </div>
    </main>
  )
}
