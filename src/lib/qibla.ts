// ---------------------------------------------------------------------------
// Qibla-Berechnung — Großkreis-Peilung (Great-Circle Initial Bearing) zu den
// Koordinaten der Kaaba. Dieselbe sphärische Formel wie in adhan.js
// (Batoul Apps) und in den meisten etablierten Gebets-Apps: keine externe
// API, keine Näherung — reine Mathematik, läuft vollständig auf dem Gerät.
// Gegen bekannte Referenzwerte geprüft (Berlin ≈ 136,7°, Istanbul ≈ 151,6°,
// New York ≈ 58,5°).
// ---------------------------------------------------------------------------

export const KAABA = { lat: 21.4225241, lon: 39.8261818 }

function toRad(d: number): number {
  return (d * Math.PI) / 180
}
function toDeg(r: number): number {
  return (r * 180) / Math.PI
}

/** Peilung zur Kaaba in Grad ab Norden, im Uhrzeigersinn (0–360). */
export function qiblaBearing(lat: number, lon: number): number {
  const φ1 = toRad(lat)
  const λ1 = toRad(lon)
  const φ2 = toRad(KAABA.lat)
  const λ2 = toRad(KAABA.lon)
  const Δλ = λ2 - λ1
  const y = Math.sin(Δλ)
  const x = Math.cos(φ1) * Math.tan(φ2) - Math.sin(φ1) * Math.cos(Δλ)
  return (toDeg(Math.atan2(y, x)) + 360) % 360
}

/** Entfernung zur Kaaba in Kilometern (Haversine, mittlerer Erdradius). */
export function distanceToKaaba(lat: number, lon: number): number {
  const R = 6371
  const φ1 = toRad(lat)
  const φ2 = toRad(KAABA.lat)
  const Δφ = toRad(KAABA.lat - lat)
  const Δλ = toRad(KAABA.lon - lon)
  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

const RICHTUNGEN = [
  'nördlich',
  'nordöstlich',
  'östlich',
  'südöstlich',
  'südlich',
  'südwestlich',
  'westlich',
  'nordwestlich',
]

/** Grad → Himmelsrichtung als Adjektiv ("südöstlich"). */
export function richtungswort(deg: number): string {
  return RICHTUNGEN[Math.round(deg / 45) % 8]
}

export function formatKm(km: number): string {
  return `${Math.round(km).toLocaleString('de-DE')} km`
}
