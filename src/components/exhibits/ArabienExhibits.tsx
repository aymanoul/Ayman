import { dreiAufstrahlungen, arabienKarte, bacaBruecke } from '../../data/seals/arabien'

// Three exhibits for Siegel III — the prophecies that name Arabia:
//  · the three shinings of Deut 33,2 (Sinai · Seir · Paran) with rising verbs
//  · a schematic map placing Paran · Kedar · Teman · Bakka in Arabia
//  · the Baca = Bakkah bridge (Psalm 84 ↔ Quran 3,96)

const TONE: Record<string, string> = {
  muted: 'var(--ink-faint)',
  green: 'var(--green)',
  brass: 'var(--brass)',
}

export function DreiAufstrahlungen() {
  return (
    <div className="ex ex--wide strahlen">
      <h3 className="ex__title">Die drei Aufstrahlungen · 5. Mose 33,2</h3>
      <p className="erwart__intro">{dreiAufstrahlungen.intro}</p>
      <div className="strahlen__row">
        {dreiAufstrahlungen.berge.map((b, i) => (
          <div className={`strahl${b.hl ? ' strahl--hl' : ''}`} key={b.ort}>
            <span className="strahl__stufe" aria-hidden>
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="strahl__ort">{b.ort}</span>
            <span className="strahl__verb">{b.verb}</span>
            <span className="strahl__verbhe hebrew" dir="rtl" lang="he">
              {b.verbHe}
            </span>
            <span className="strahl__rule" aria-hidden />
            <span className="strahl__figur">{b.figur}</span>
            <span className="strahl__volk">{b.volk}</span>
            <span className="strahl__schrift">{b.schrift}</span>
          </div>
        ))}
      </div>
      <p className="ex__pointe">{dreiAufstrahlungen.pointe}</p>
    </div>
  )
}

export function ArabienKarte() {
  const find = (id: string) => arabienKarte.punkte.find((p) => p.id === id)!
  const pfadPunkte = arabienKarte.pfad.map(find)
  const pfadD = pfadPunkte
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ')

  return (
    <div className="ex ex--wide karte-schema">
      <h3 className="ex__title">Vier Namen, ein Land</h3>
      <p className="erwart__intro">{arabienKarte.intro}</p>

      <div className="kschema">
        <svg
          className="kschema__svg"
          viewBox="0 0 100 120"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          {/* the descending shining: Sinai → Paran → Mekka */}
          <path className="kschema__pfad" d={pfadD} fill="none" />
          {arabienKarte.punkte.map((p) => (
            <circle
              key={p.id}
              className="kschema__dot"
              cx={p.x}
              cy={p.y}
              r={p.tone === 'muted' ? 1.6 : 2.4}
              style={{ fill: TONE[p.tone] }}
            />
          ))}
        </svg>

        {arabienKarte.punkte.map((p) => (
          <span
            key={p.id}
            className={`kschema__label kschema__label--${p.tone}`}
            style={{ left: `${p.x}%`, top: `${(p.y / 120) * 100}%` }}
          >
            <span className="kschema__name">{p.label}</span>
            <span className="kschema__sub">{p.sub}</span>
          </span>
        ))}

        <span className="kschema__kompass" aria-hidden>
          <span className="kschema__n">N</span>
          <span className="kschema__arrow">↓</span>
          <span className="kschema__s">S</span>
        </span>
      </div>

      <p className="ex__pointe">{arabienKarte.pointe}</p>
    </div>
  )
}

export function BacaBruecke() {
  return (
    <div className="ex ex--wide baca">
      <h3 className="ex__title">Baka = Bakka</h3>
      <p className="erwart__intro">{bacaBruecke.intro}</p>

      <div className="baca__pair">
        <div className="baca__card">
          <span className="baca__titel">{bacaBruecke.links.titel}</span>
          <span className="baca__wort hebrew" dir="rtl" lang="he">
            {bacaBruecke.links.wort}
          </span>
          <span className="baca__trans">{bacaBruecke.links.trans}</span>
          <span className="baca__sinn">{bacaBruecke.links.sinn}</span>
        </div>

        <div className="baca__bridge" aria-hidden>
          <span className="baca__eq">=</span>
        </div>

        <div className="baca__card baca__card--ar">
          <span className="baca__titel">{bacaBruecke.rechts.titel}</span>
          <span className="baca__wort arabic" dir="rtl" lang="ar">
            {bacaBruecke.rechts.wort}
          </span>
          <span className="baca__trans">{bacaBruecke.rechts.trans}</span>
          <span className="baca__sinn">{bacaBruecke.rechts.sinn}</span>
        </div>
      </div>

      <ul className="baca__parallelen">
        {bacaBruecke.parallelen.map((p) => (
          <li key={p.merkmal}>
            <span className="baca__merkmal">{p.merkmal}</span>
            <span className="baca__text">{p.text}</span>
          </li>
        ))}
      </ul>

      <p className="ex__pointe">{bacaBruecke.pointe}</p>
    </div>
  )
}
