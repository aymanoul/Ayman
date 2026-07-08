// ---------------------------------------------------------------------------
// Kuratierte Städteliste für die Orts-Anzeige im Qibla-Finder. Kein externer
// Geocoding-Dienst (Privatsphäre-Zusage der App: nichts verlässt das Gerät)
// — stattdessen wird die nächstgelegene Stadt aus dieser Liste bestimmt.
// Liegt keine Stadt nah genug (< 60 km), werden ehrlich die Koordinaten
// gezeigt statt eines geratenen Namens.
// ---------------------------------------------------------------------------

export interface Stadt {
  name: string
  land: string
  lat: number
  lon: number
}

export const staedte: Stadt[] = [
  // Deutschland
  { name: 'Berlin', land: 'Deutschland', lat: 52.52, lon: 13.405 },
  { name: 'Hamburg', land: 'Deutschland', lat: 53.55, lon: 9.99 },
  { name: 'München', land: 'Deutschland', lat: 48.14, lon: 11.58 },
  { name: 'Köln', land: 'Deutschland', lat: 50.94, lon: 6.96 },
  { name: 'Frankfurt am Main', land: 'Deutschland', lat: 50.11, lon: 8.68 },
  { name: 'Stuttgart', land: 'Deutschland', lat: 48.78, lon: 9.18 },
  { name: 'Düsseldorf', land: 'Deutschland', lat: 51.23, lon: 6.78 },
  { name: 'Dortmund', land: 'Deutschland', lat: 51.51, lon: 7.47 },
  { name: 'Essen', land: 'Deutschland', lat: 51.46, lon: 7.01 },
  { name: 'Bremen', land: 'Deutschland', lat: 53.08, lon: 8.81 },
  { name: 'Hannover', land: 'Deutschland', lat: 52.37, lon: 9.73 },
  { name: 'Nürnberg', land: 'Deutschland', lat: 49.45, lon: 11.08 },
  { name: 'Duisburg', land: 'Deutschland', lat: 51.43, lon: 6.76 },
  { name: 'Bochum', land: 'Deutschland', lat: 51.48, lon: 7.22 },
  { name: 'Wuppertal', land: 'Deutschland', lat: 51.26, lon: 7.15 },
  { name: 'Mannheim', land: 'Deutschland', lat: 49.49, lon: 8.47 },
  { name: 'Karlsruhe', land: 'Deutschland', lat: 49.01, lon: 8.4 },
  { name: 'Leipzig', land: 'Deutschland', lat: 51.34, lon: 12.37 },
  { name: 'Dresden', land: 'Deutschland', lat: 51.05, lon: 13.74 },
  { name: 'Münster', land: 'Deutschland', lat: 51.96, lon: 7.63 },
  // Österreich / Schweiz
  { name: 'Wien', land: 'Österreich', lat: 48.21, lon: 16.37 },
  { name: 'Graz', land: 'Österreich', lat: 47.07, lon: 15.44 },
  { name: 'Salzburg', land: 'Österreich', lat: 47.8, lon: 13.05 },
  { name: 'Zürich', land: 'Schweiz', lat: 47.37, lon: 8.54 },
  { name: 'Genf', land: 'Schweiz', lat: 46.2, lon: 6.14 },
  { name: 'Basel', land: 'Schweiz', lat: 47.56, lon: 7.59 },
  { name: 'Bern', land: 'Schweiz', lat: 46.95, lon: 7.45 },
  // Westeuropa
  { name: 'London', land: 'Vereinigtes Königreich', lat: 51.51, lon: -0.13 },
  { name: 'Paris', land: 'Frankreich', lat: 48.86, lon: 2.35 },
  { name: 'Madrid', land: 'Spanien', lat: 40.42, lon: -3.7 },
  { name: 'Barcelona', land: 'Spanien', lat: 41.39, lon: 2.17 },
  { name: 'Rom', land: 'Italien', lat: 41.9, lon: 12.5 },
  { name: 'Mailand', land: 'Italien', lat: 45.46, lon: 9.19 },
  { name: 'Amsterdam', land: 'Niederlande', lat: 52.37, lon: 4.9 },
  { name: 'Brüssel', land: 'Belgien', lat: 50.85, lon: 4.35 },
  { name: 'Lissabon', land: 'Portugal', lat: 38.72, lon: -9.14 },
  { name: 'Dublin', land: 'Irland', lat: 53.35, lon: -6.26 },
  // Nordeuropa
  { name: 'Kopenhagen', land: 'Dänemark', lat: 55.68, lon: 12.57 },
  { name: 'Stockholm', land: 'Schweden', lat: 59.33, lon: 18.06 },
  { name: 'Oslo', land: 'Norwegen', lat: 59.91, lon: 10.75 },
  { name: 'Helsinki', land: 'Finnland', lat: 60.17, lon: 24.94 },
  // Ost-/Südosteuropa
  { name: 'Warschau', land: 'Polen', lat: 52.23, lon: 21.01 },
  { name: 'Prag', land: 'Tschechien', lat: 50.08, lon: 14.44 },
  { name: 'Budapest', land: 'Ungarn', lat: 47.5, lon: 19.04 },
  { name: 'Bukarest', land: 'Rumänien', lat: 44.43, lon: 26.1 },
  { name: 'Sofia', land: 'Bulgarien', lat: 42.7, lon: 23.32 },
  { name: 'Athen', land: 'Griechenland', lat: 37.98, lon: 23.73 },
  { name: 'Sarajevo', land: 'Bosnien und Herzegowina', lat: 43.86, lon: 18.41 },
  { name: 'Belgrad', land: 'Serbien', lat: 44.79, lon: 20.45 },
  { name: 'Zagreb', land: 'Kroatien', lat: 45.81, lon: 15.98 },
  { name: 'Skopje', land: 'Nordmazedonien', lat: 42.0, lon: 21.43 },
  { name: 'Pristina', land: 'Kosovo', lat: 42.66, lon: 21.17 },
  { name: 'Tirana', land: 'Albanien', lat: 41.33, lon: 19.82 },
  { name: 'Moskau', land: 'Russland', lat: 55.76, lon: 37.62 },
  { name: 'Kiew', land: 'Ukraine', lat: 50.45, lon: 30.52 },
  // Türkei
  { name: 'Istanbul', land: 'Türkei', lat: 41.01, lon: 28.98 },
  { name: 'Ankara', land: 'Türkei', lat: 39.93, lon: 32.86 },
  { name: 'Izmir', land: 'Türkei', lat: 38.42, lon: 27.14 },
  // Naher Osten
  { name: 'Mekka', land: 'Saudi-Arabien', lat: 21.42, lon: 39.83 },
  { name: 'Medina', land: 'Saudi-Arabien', lat: 24.47, lon: 39.61 },
  { name: 'Riad', land: 'Saudi-Arabien', lat: 24.71, lon: 46.68 },
  { name: 'Jeddah', land: 'Saudi-Arabien', lat: 21.54, lon: 39.17 },
  { name: 'Dubai', land: 'Vereinigte Arabische Emirate', lat: 25.2, lon: 55.27 },
  { name: 'Abu Dhabi', land: 'Vereinigte Arabische Emirate', lat: 24.45, lon: 54.38 },
  { name: 'Doha', land: 'Katar', lat: 25.29, lon: 51.53 },
  { name: 'Kuwait-Stadt', land: 'Kuwait', lat: 29.38, lon: 47.99 },
  { name: 'Manama', land: 'Bahrain', lat: 26.23, lon: 50.59 },
  { name: 'Amman', land: 'Jordanien', lat: 31.95, lon: 35.93 },
  { name: 'Beirut', land: 'Libanon', lat: 33.89, lon: 35.5 },
  { name: 'Damaskus', land: 'Syrien', lat: 33.51, lon: 36.28 },
  { name: 'Bagdad', land: 'Irak', lat: 33.31, lon: 44.36 },
  { name: 'Teheran', land: 'Iran', lat: 35.69, lon: 51.39 },
  { name: 'Jerusalem', land: 'Palästina/Israel', lat: 31.78, lon: 35.22 },
  // Nordafrika
  { name: 'Kairo', land: 'Ägypten', lat: 30.04, lon: 31.24 },
  { name: 'Alexandria', land: 'Ägypten', lat: 31.2, lon: 29.92 },
  { name: 'Casablanca', land: 'Marokko', lat: 33.57, lon: -7.59 },
  { name: 'Rabat', land: 'Marokko', lat: 34.02, lon: -6.83 },
  { name: 'Tunis', land: 'Tunesien', lat: 36.81, lon: 10.18 },
  { name: 'Algier', land: 'Algerien', lat: 36.75, lon: 3.06 },
  { name: 'Tripolis', land: 'Libyen', lat: 32.89, lon: 13.19 },
  { name: 'Khartum', land: 'Sudan', lat: 15.5, lon: 32.56 },
  // Südasien
  { name: 'Islamabad', land: 'Pakistan', lat: 33.68, lon: 73.05 },
  { name: 'Karachi', land: 'Pakistan', lat: 24.86, lon: 67.01 },
  { name: 'Lahore', land: 'Pakistan', lat: 31.55, lon: 74.34 },
  { name: 'Dhaka', land: 'Bangladesch', lat: 23.81, lon: 90.41 },
  { name: 'Neu-Delhi', land: 'Indien', lat: 28.61, lon: 77.21 },
  { name: 'Mumbai', land: 'Indien', lat: 19.08, lon: 72.88 },
  { name: 'Kabul', land: 'Afghanistan', lat: 34.56, lon: 69.21 },
  // Südostasien
  { name: 'Jakarta', land: 'Indonesien', lat: -6.21, lon: 106.85 },
  { name: 'Kuala Lumpur', land: 'Malaysia', lat: 3.14, lon: 101.69 },
  { name: 'Singapur', land: 'Singapur', lat: 1.35, lon: 103.82 },
  // Ostasien
  { name: 'Tokio', land: 'Japan', lat: 35.68, lon: 139.65 },
  { name: 'Peking', land: 'China', lat: 39.9, lon: 116.4 },
  { name: 'Shanghai', land: 'China', lat: 31.23, lon: 121.47 },
  // Nordamerika
  { name: 'New York', land: 'USA', lat: 40.71, lon: -74.01 },
  { name: 'Los Angeles', land: 'USA', lat: 34.05, lon: -118.24 },
  { name: 'Chicago', land: 'USA', lat: 41.88, lon: -87.63 },
  { name: 'Houston', land: 'USA', lat: 29.76, lon: -95.37 },
  { name: 'Toronto', land: 'Kanada', lat: 43.65, lon: -79.38 },
  { name: 'Montreal', land: 'Kanada', lat: 45.5, lon: -73.57 },
  // Ozeanien
  { name: 'Sydney', land: 'Australien', lat: -33.87, lon: 151.21 },
  { name: 'Melbourne', land: 'Australien', lat: -37.81, lon: 144.96 },
  // Afrika (Subsahara)
  { name: 'Lagos', land: 'Nigeria', lat: 6.52, lon: 3.38 },
  { name: 'Nairobi', land: 'Kenia', lat: -1.29, lon: 36.82 },
  { name: 'Johannesburg', land: 'Südafrika', lat: -26.2, lon: 28.05 },
  // Lateinamerika
  { name: 'Mexiko-Stadt', land: 'Mexiko', lat: 19.43, lon: -99.13 },
  { name: 'São Paulo', land: 'Brasilien', lat: -23.55, lon: -46.63 },
  { name: 'Buenos Aires', land: 'Argentinien', lat: -34.6, lon: -58.38 },
]

function toRad(d: number): number {
  return (d * Math.PI) / 180
}

/** Kürzeste Entfernung (km, Haversine) zwischen zwei Punkten auf der Erde. */
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const φ1 = toRad(lat1)
  const φ2 = toRad(lat2)
  const Δφ = toRad(lat2 - lat1)
  const Δλ = toRad(lon2 - lon1)
  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/** Nächstgelegene Stadt aus der Liste, oder null wenn keine nah genug liegt (< 60 km). */
export function naheStadt(lat: number, lon: number): Stadt | null {
  let best: Stadt | null = null
  let bestKm = Infinity
  for (const s of staedte) {
    const km = haversineKm(lat, lon, s.lat, s.lon)
    if (km < bestKm) {
      bestKm = km
      best = s
    }
  }
  return best && bestKm < 60 ? best : null
}

export function formatKoordinate(lat: number, lon: number): string {
  const ns = lat >= 0 ? 'N' : 'S'
  const ew = lon >= 0 ? 'O' : 'W'
  return `${Math.abs(lat).toFixed(2)}° ${ns}, ${Math.abs(lon).toFixed(2)}° ${ew}`
}
