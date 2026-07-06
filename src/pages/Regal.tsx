import { Link } from 'react-router-dom'
import Bookshelf from '../components/Bookshelf'
import { ArrowLeft } from '../components/icons'
import { regalBaende, regalTitel, regalVerlag } from '../data/regal'


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
          <h1 className="seal__title seal__title--green">Der versiegelte Nektar</h1>
        </header>

        <Bookshelf titel={regalTitel} verlag={regalVerlag} baende={regalBaende} />
      </div>
    </main>
  )
}
