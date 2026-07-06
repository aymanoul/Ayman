import { motion } from 'framer-motion'
import PageHead from '../components/PageHead'
import '../styles/pages.css'

export default function Ueber() {
  return (
    <main className="shell">
      <div className="wrap page">
        <PageHead kicker="Das Projekt" title="Über die Bibliothek" />
        <motion.section className="card prose" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <p>
            <strong>Die Bibliothek</strong> ist eine mehrsprachige Enzyklopädie der vergleichenden Religion. Das erste
            Werk, <em>Der versiegelte Nektar</em>, ist eine Buchreihe aus neun Büchern, die eine einzige, prüfbare
            Frage entfalten: Ist der Prophet Muhammad ﷺ in den früheren Schriften angekündigt?
          </p>
          <p>
            Das zweite Werk, <em>Jesus, der Gesandte Gottes</em>, entfaltet in sechs Bänden die Gegenfrage: Wer war
            Jesus wirklich — Gott, Gottes Sohn oder Mensch, Gesandter und Messias? Von der Methode der Wahrheitssuche
            über Trinität und Tauhid, die Kreuzigung und die Überlieferung des Neuen Testaments bis zu den
            Prophezeiungen über den Propheten, der nach ihm kommt.
          </p>
          <p>
            Jedes Buch führt seine These, eine Beweiskette, Einwände samt Entgegnung und die Belege im Original —
            Arabisch, Hebräisch, Griechisch — mit Umschrift, Übersetzung und Fundstelle. Das Frage-Feld antwortet
            direkt aus diesen Inhalten; nichts verlässt dein Gerät.
          </p>
          <p>
            Die Anwendung ist eine <strong>Progressive Web App</strong>: Sie lässt sich zum Startbildschirm hinzufügen
            und funktioniert vollständig offline — inklusive Suche, Favoriten, Notizen und Leseverlauf.
          </p>
          <p className="card__note">
            Quellen und Belege sind in den jeweiligen Büchern ausgewiesen. Rückmeldungen und Korrekturen sind
            willkommen.
          </p>
        </motion.section>
      </div>
    </main>
  )
}
