import { stammbaum, zwoelfFuersten, ismaelEmpfing, ismaelEmpfingPointe } from '../../data/seals/abraham'

// Three exhibits for Siegel I — one father, two lines:
//  · the family tree (Abraham → Ishmael → Muhammad ﷺ  |  Abraham → Isaac → Jesus)
//  · the twelve princes of Ishmael (mirror of Israel's twelve)
//  · the covenant gifts Ishmael actually received

export function Stammbaum() {
  return (
    <div className="ex ex--wide tree">
      <h3 className="ex__title">Ein Vater, zwei Linien</h3>

      <div className="tree__crown">
        <span className="tree__root">
          <span className="tree__root-name">{stammbaum.wurzel.name}</span>
          <span className="tree__root-ar arabic" dir="rtl" lang="ar">
            {stammbaum.wurzel.ar}
          </span>
        </span>
      </div>

      <div className="tree__split">
        <div className="tree__col tree__col--ismael">
          <span className="tree__col-label">{stammbaum.ismael.label}</span>
          {stammbaum.ismael.nodes.map((n, i) => (
            <span
              key={n}
              className={`tree__node${i === stammbaum.ismael.nodes.length - 1 ? ' tree__node--end' : ''}`}
            >
              {n}
            </span>
          ))}
        </div>

        <div className="tree__col">
          <span className="tree__col-label">{stammbaum.isaak.label}</span>
          {stammbaum.isaak.nodes.map((n, i) => (
            <span
              key={n}
              className={`tree__node${i === stammbaum.isaak.nodes.length - 1 ? ' tree__node--end tree__node--isaak' : ''}`}
            >
              {n}
            </span>
          ))}
        </div>
      </div>

      <p className="ex__pointe">{stammbaum.note}</p>
    </div>
  )
}

export function ZwoelfFuersten() {
  return (
    <div className="ex ex--wide zwoelf-card">
      <h3 className="ex__title">
        Die zwölf Fürsten <span className="zwoelf__ref">{zwoelfFuersten.ref}</span>
      </h3>
      <ul className="zwoelf">
        {zwoelfFuersten.fuersten.map((f, i) => (
          <li key={f} className={`zwoelf__item${f === zwoelfFuersten.highlight ? ' zwoelf__item--hl' : ''}`}>
            <span className="zwoelf__num" aria-hidden>
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="zwoelf__name">{f}</span>
            {f === zwoelfFuersten.highlight && <span className="zwoelf__tag">→ die Araber</span>}
          </li>
        ))}
      </ul>
      <p className="ex__pointe">{zwoelfFuersten.pointe}</p>
    </div>
  )
}

export function Bundesgaben() {
  return (
    <div className="ex ex--wide gaben-card">
      <h3 className="ex__title">Was Ismael empfing</h3>
      <ul className="gaben">
        {ismaelEmpfing.map((g) => (
          <li key={g.gabe}>
            <span className="gaben__check" aria-hidden>
              ✓
            </span>
            <span className="gaben__gabe">{g.gabe}</span>
            <span className="gaben__ref">{g.ref}</span>
          </li>
        ))}
      </ul>
      <p className="ex__pointe">{ismaelEmpfingPointe}</p>
    </div>
  )
}
