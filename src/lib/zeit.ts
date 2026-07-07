// Relative Zeitangabe ("vor 3 Std.", "gestern") — genutzt in Verlauf und der
// "Weiterlesen"-Karte der Startseite.
export function wann(ts: number): string {
  const min = Math.floor((Date.now() - ts) / 60000)
  if (min < 1) return 'gerade eben'
  if (min < 60) return `vor ${min} Min.`
  const h = Math.floor(min / 60)
  if (h < 24) return `vor ${h} Std.`
  const d = Math.floor(h / 24)
  return d === 1 ? 'gestern' : `vor ${d} Tagen`
}
