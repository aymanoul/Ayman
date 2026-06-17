import {
  arabienKarte,
  dreiAufstrahlungen,
  textvariantenTabelle,
  reihenfolgeBeweis,
  etmokhVergleich,
  synopseDeut,
  synopseJes,
  synopsePs,
} from '../../data/seals/arabien'

// Exhibits for Siegel III — the geographic coordinate net that points to Arabia:
//  · 🔥 the five-point map (Paran · Kedar · Sela · Tema · Baca), four books
//  · the Deut 33,2 rising-light diagram (Sinai → Seir → Paran · Dawn→Zenit)
//  · the textual variants of Deut 33,2 (MT / LXX / DSS / SP)
//  · the order-proof (Exodus route vs prophecy sequence)
//  · the etmokh / etmokhah letter comparison (🟡 marble, Hebrew RTL)
//  · three summary tables (Deut 33 · Jes 42 · Ps 84: Prophezeiung ↔ Erfüllung)

const TONE: Record<string, string> = {
  muted: 'var(--ink-faint)',
  green: 'var(--green)',
  brass: 'var(--brass)',
}

// ---- 🔥 HAUPT-EXHIBIT: the five-point map -----------------------------------
export function ArabienKarte() {
  const find = (id: string) => arabienKarte.punkte.find((p) => p.id === id)!
  const pfadPunkte = arabienKarte.pfad.map(find)
  const pfadD = pfadPunkte.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  return (
    <div className="ex ex--wide netz-karte">
      <h3 className="ex__title">Das Arabische Prophezeiungs-Netz</h3>
      <p className="erwart__intro">{arabienKarte.intro}</p>

      {/* the four independent books, each pinning a name */}
      <ul className="netz-karte__buecher">
        {arabienKarte.buecher.map((b) => (
          <li key={b.buch} className="netz-karte__buch">
            <span className="netz-karte__buch-name">{b.buch}</span>
            <span className="netz-karte__buch-ort">{b.namen}</span>
          </li>
        ))}
      </ul>

      <div className="kschema kschema--tall">
        <svg className="kschema__svg" viewBox="0 0 100 120" preserveAspectRatio="xMidYMid meet" aria-hidden>
          {/* the descending shining: Sinai → Paran → Kedar → Bakka */}
          <path className="kschema__pfad" d={pfadD} fill="none" />
          {arabienKarte.punkte.map((p) => (
            <circle
              key={p.id}
              className="kschema__dot"
              cx={p.x}
              cy={p.y}
              r={p.tone === 'muted' ? 1.5 : 2.3}
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
            {p.stelle && <span className="netz-karte__stelle">{p.stelle}</span>}
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

// ---- the Deut 33,2 rising-light diagram -------------------------------------
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
            <span className="strahl__licht" aria-hidden>
              {b.licht}
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

// ---- the textual variants of Deut 33,2 (MT / LXX / DSS / SP) ----------------
export function Textvarianten() {
  return (
    <div className="ex ex--wide textvar">
      <h3 className="ex__title">Textvarianten · 5. Mose 33,2</h3>
      <p className="erwart__intro">{textvariantenTabelle.intro}</p>
      <div className="textvar__table">
        <div className="textvar__head">
          {textvariantenTabelle.spalten.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
        {textvariantenTabelle.zeilen.map((z) => (
          <div className={`textvar__row${z.law ? ' is-law' : ''}`} key={z.zeuge}>
            <span className="textvar__zeuge" data-lbl="Textzeuge">
              {z.zeuge}
            </span>
            <span className="textvar__lesart hebrew" data-lbl="Lesart" dir="auto">
              {z.lesart}
            </span>
            <span className="textvar__sinn" data-lbl="Bedeutung">
              {z.sinn}
              {z.law && (
                <span className="textvar__mark" aria-hidden>
                  ✦
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
      <p className="ex__pointe">{textvariantenTabelle.pointe}</p>
    </div>
  )
}

// ---- the order-proof: Exodus route vs prophecy sequence --------------------
export function ReihenfolgeBeweis() {
  return (
    <div className="ex ex--wide reihenf">
      <h3 className="ex__title">Reihenfolge-Beweis</h3>
      <p className="erwart__intro">{reihenfolgeBeweis.intro}</p>
      <div className="reihenf__pair">
        <div className="reihenf__col reihenf__col--route">
          <span className="reihenf__lbl">{reihenfolgeBeweis.spalten[0]}</span>
          <ol className="reihenf__list">
            {reihenfolgeBeweis.zeilen.map((z, i) => (
              <li key={i} className={i === reihenfolgeBeweis.zeilen.length - 1 ? 'is-verdict' : ''}>
                {z.route}
              </li>
            ))}
          </ol>
        </div>
        <span className="reihenf__vs" aria-hidden>
          vs
        </span>
        <div className="reihenf__col reihenf__col--proph">
          <span className="reihenf__lbl">{reihenfolgeBeweis.spalten[1]}</span>
          <ol className="reihenf__list">
            {reihenfolgeBeweis.zeilen.map((z, i) => (
              <li key={i} className={i === reihenfolgeBeweis.zeilen.length - 1 ? 'is-verdict' : ''}>
                {z.prophetie}
              </li>
            ))}
          </ol>
        </div>
      </div>
      <p className="ex__pointe">{reihenfolgeBeweis.pointe}</p>
    </div>
  )
}

// ---- the etmokh / etmokhah letter comparison (🟡 marble, Hebrew RTL) --------
export function EtmokhVergleich() {
  return (
    <div className="ex ex--wide etmokh">
      <span className="marble-tag">✦ Ergänzender Befund</span>
      <h3 className="ex__title">etmokh · etmokhah — Buchstabe für Buchstabe</h3>
      <p className="erwart__intro">{etmokhVergleich.intro}</p>

      <div className="etmokh__pair">
        <div className="etmokh__card">
          <span className="etmokh__titel">{etmokhVergleich.links.titel}</span>
          <span className="etmokh__wort hebrew" dir="rtl" lang="he">
            {etmokhVergleich.links.wort}
          </span>
          <span className="etmokh__letters hebrew" dir="rtl" lang="he" aria-hidden>
            {etmokhVergleich.buchstabenMT.map((c, i) => (
              <span key={i} className="etmokh__cell">
                {c}
              </span>
            ))}
          </span>
          <span className="etmokh__trans">{etmokhVergleich.links.trans}</span>
          <span className="etmokh__sinn">{etmokhVergleich.links.sinn}</span>
        </div>

        <div className="etmokh__bridge" aria-hidden>
          <span className="etmokh__arrow">→</span>
        </div>

        <div className="etmokh__card etmokh__card--hl">
          <span className="etmokh__titel">{etmokhVergleich.rechts.titel}</span>
          <span className="etmokh__wort hebrew" dir="rtl" lang="he">
            {etmokhVergleich.rechts.wort}
          </span>
          <span className="etmokh__letters hebrew" dir="rtl" lang="he" aria-hidden>
            {etmokhVergleich.buchstaben1Q.map((c, i) => (
              <span
                key={i}
                className={`etmokh__cell${i >= etmokhVergleich.buchstabenMT.length - 1 ? ' etmokh__cell--add' : ''}`}
              >
                {c}
              </span>
            ))}
          </span>
          <span className="etmokh__trans">{etmokhVergleich.rechts.trans}</span>
          <span className="etmokh__sinn">{etmokhVergleich.rechts.sinn}</span>
        </div>
      </div>

      <p className="ex__pointe">{etmokhVergleich.pointe}</p>
    </div>
  )
}

// ---- one summary table (Prophezeiung ↔ Erfüllung) — reuses .synopse ---------
function SynopseTabelle({ data }: { data: typeof synopseDeut }) {
  return (
    <div className="synopse synopse--seal">
      <span className="synopse__titel">{data.titel}</span>
      <div className="synopse__head">
        <span>{data.paar[0]}</span>
        <span>{data.paar[1]}</span>
      </div>
      {data.zeilen.map((z, i) => (
        <div className="synopse__row" key={i}>
          <span className="synopse__a" data-lbl={data.paar[0]}>
            {z.a}
          </span>
          <span className="synopse__b" data-lbl={data.paar[1]}>
            {z.b}
          </span>
        </div>
      ))}
    </div>
  )
}

export function SynopseTabellen() {
  return (
    <div className="synopse-stack">
      <SynopseTabelle data={synopseDeut} />
      <SynopseTabelle data={synopseJes} />
      <SynopseTabelle data={synopsePs} />
    </div>
  )
}
