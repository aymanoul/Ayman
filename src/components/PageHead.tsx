import { Link } from 'react-router-dom'
import { ArrowLeft } from './icons'

// Schlichter, einheitlicher Kopf für die Utility-Seiten (Einstellungen,
// Favoriten, Notizen, Verlauf, Über) — zurück zur Bibliothek + Kicker + Titel.
export default function PageHead({ kicker, title }: { kicker: string; title: string }) {
  return (
    <header className="pagehead">
      <Link to="/bibliothek" className="stub__back" style={{ marginTop: 0 }}>
        <ArrowLeft /> Bibliothek
      </Link>
      <span className="pagehead__kicker">{kicker}</span>
      <h1 className="pagehead__title gilt">{title}</h1>
    </header>
  )
}
