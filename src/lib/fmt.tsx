import React from 'react'

// Leichte, inhaltsschonende Text-Auszeichnung: wandelt einen reinen String in
// React-Knoten und färbt „wichtige Aspekte" in den Farben des Design-Systems,
// OHNE die SPEC-Inhalte (die Datenstrings) zu verändern:
//
//   • zitierte Schrift-/Schlüsselphrasen in „…"  → Medina-Grün  (.tx-q)
//     (konsistent mit der Regel „zitierte Verse in Grün")
//   • Stellenangaben in Klammern, z. B. (7,157)  → Gold/Brass   (.tx-ref)
//   • die Eulogie ﷺ                              → Gold         (.tx-hon)
//
// Bewusst zurückhaltend („ein wenig"): nur Farbe, kein Fettdruck. Kann an jeder
// Prosa-Stelle als {fmt(text)} eingesetzt werden.

// Reihenfolge der Alternativen egal, sie überschneiden sich nicht:
//   1) „…"  (deutsche Anführung: U+201E … U+201C)
//   2) (Zahl…)  Klammer, die mit einer Ziffer beginnt — Stellenangaben
//   3) ﷺ
const TOKEN = /(„[^„""]*")|(\(\d[\d.,\s–—-]*\))|(ﷺ)/g

export function fmt(text: string): React.ReactNode {
  if (!text) return text
  const nodes: React.ReactNode[] = []
  let last = 0
  let key = 0
  let m: RegExpExecArray | null
  TOKEN.lastIndex = 0
  while ((m = TOKEN.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index))
    if (m[1] !== undefined) nodes.push(<span key={key++} className="tx-q">{m[1]}</span>)
    else if (m[2] !== undefined) nodes.push(<span key={key++} className="tx-ref">{m[2]}</span>)
    else nodes.push(<span key={key++} className="tx-hon">{m[3]}</span>)
    last = m.index + m[0].length
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}
