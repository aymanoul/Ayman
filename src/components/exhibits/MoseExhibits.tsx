import { vergleich, dreiErwartungen, brueder } from '../../data/seals/mose'

// Three exhibits for Siegel II:
//  · the comparison Moses · Muhammad ﷺ · Jesus (nine criteria)
//  · the three awaited figures (John 1: Messiah, Elijah, the Prophet)
//  · the brother-nations (ʾaḥ in Torah usage)

export function Vergleich() {
  return (
    <div className="ex ex--wide vergleich">
      <h3 className="ex__title">Mose · Muhammad ﷺ · Jesus</h3>
      <div className="vgl">
        <div className="vgl__head">
          <span className="vgl__corner" aria-hidden />
          <span className="vgl__col">{vergleich.spalten[0]}</span>
          <span className="vgl__col vgl__col--hl">{vergleich.spalten[1]}</span>
          <span className="vgl__col">{vergleich.spalten[2]}</span>
        </div>
        {vergleich.zeilen.map((z) => (
          <div className="vgl__row" key={z.k}>
            <span className="vgl__k">{z.k}</span>
            <span className="vgl__cell" data-fig={vergleich.spalten[0]}>
              {z.mose}
            </span>
            <span className="vgl__cell vgl__cell--hl" data-fig={vergleich.spalten[1]}>
              {z.muh}
            </span>
            <span className="vgl__cell vgl__cell--off" data-fig={vergleich.spalten[2]}>
              {z.jesus}
            </span>
          </div>
        ))}
      </div>
      <p className="ex__pointe">{vergleich.pointe}</p>
    </div>
  )
}

export function DreiErwartungen() {
  return (
    <div className="ex ex--wide erwartungen">
      <h3 className="ex__title">Die drei Erwartungen</h3>
      <p className="erwart__intro">{dreiErwartungen.intro}</p>
      <div className="erwart__row">
        {dreiErwartungen.fragen.map((q) => (
          <div className={`erwart__card${q.hl ? ' erwart__card--hl' : ''}`} key={q.wer}>
            <span className="erwart__wer">{q.wer}</span>
            <span className="erwart__f">„{q.f}"</span>
            <span className="erwart__a">{q.a}</span>
          </div>
        ))}
      </div>
      <p className="ex__pointe">{dreiErwartungen.pointe}</p>
    </div>
  )
}

export function Brudernationen() {
  return (
    <div className="ex ex--wide brueder-card">
      <h3 className="ex__title">
        „Aus ihren Brüdern" <span className="brueder__wort hebrew">{brueder.wort}</span>
      </h3>
      <p className="erwart__intro">{brueder.intro}</p>
      <ul className="brueder">
        {brueder.zeilen.map((z) => (
          <li key={z.volk}>
            <span className="brueder__volk">{z.volk}</span>
            <span className="brueder__sinn">{z.sinn}</span>
            <span className="brueder__ref">{z.ref}</span>
          </li>
        ))}
      </ul>
      <p className="ex__pointe">{brueder.pointe}</p>
    </div>
  )
}
