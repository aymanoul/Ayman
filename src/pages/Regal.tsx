import { Link } from 'react-router-dom'
import Bookshelf from '../components/Bookshelf'
import { ArrowLeft } from '../components/icons'

// Demo-Ansicht: die Buchreihe "Ar-Raheeq Al-Makhtoom" als Regal.
// Die Bandnamen sind PLATZHALTER (Stationen der Sira) — in baende[] anpassen,
// und `to` auf die echten Ziel-Routen zeigen lassen.
const baende = [
  { nr: 1, name: 'العهد المكي', to: '#' },
  { nr: 2, name: 'البعثة النبوية', to: '#' },
  { nr: 3, name: 'الهجرة', to: '#' },
  { nr: 4, name: 'العهد المدني', to: '#' },
  { nr: 5, name: 'الغزوات', to: '#' },
  { nr: 6, name: 'فتح مكة', to: '#' },
  { nr: 7, name: 'حجة الوداع', to: '#' },
]

export default function Regal() {
  return (
    <main className="shell">
      <div
        className="wrap"
        style={{ maxWidth: 1120, paddingTop: 'clamp(1.5rem, 5vh, 2.5rem)', paddingBottom: '4rem' }}
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
