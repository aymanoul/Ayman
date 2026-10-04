// BEISPIELDATEN für die Gebetszeiten (astronomisch berechnet, NICHT aus MAWAQIT).
// Zweck: Layout und Countdown entwickeln, solange mawaqit.net nicht erreichbar ist.
// Phase 4 ersetzt content/prayer-calendar.json durch echte MAWAQIT-Daten im selben Format.
//
// Format: { source, generatedAt, hijriAdjustment, days: { "YYYY-MM-DD": [fajr, shuruq, dhuhr, asr, maghrib, isha] } }
import { writeFileSync } from "node:fs";

const LAT = 51.3, LNG = 6.85; // Ratingen (ca.)
const rad = (d) => (d * Math.PI) / 180, deg = (r) => (r * 180) / Math.PI;

function berlinOffsetHours(y, m, d) {
  const noon = Date.UTC(y, m - 1, d, 12);
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Berlin", hourCycle: "h23", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric" }).formatToParts(new Date(noon)).map((x) => [x.type, +x.value]));
  return (Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute) - noon) / 3600000;
}

function sun(y, m, d) {
  const n = Math.floor((Date.UTC(y, m - 1, d) - Date.UTC(y, 0, 0)) / 86400000);
  const g = rad((360 / 365) * (n - 1));
  const decl = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
  const eqt = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
  return { decl, eqt };
}

const hourAngle = (alt, decl) => {
  const c = (Math.sin(rad(alt)) - Math.sin(rad(LAT)) * Math.sin(decl)) / (Math.cos(rad(LAT)) * Math.cos(decl));
  return Math.abs(c) > 1 ? NaN : deg(Math.acos(c)) / 15;
};

const fmt = (h) => {
  const t = Math.round(h * 60);
  return `${String(Math.floor(t / 60) % 24).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
};

function day(y, m, d) {
  const { decl, eqt } = sun(y, m, d);
  const noon = 12 + berlinOffsetHours(y, m, d) - LNG / 15 - eqt / 60;
  const rise = noon - hourAngle(-0.833, decl), set = noon + hourAngle(-0.833, decl);
  const night = 24 - (set - rise);
  let fajr = noon - hourAngle(-18, decl), isha = noon + hourAngle(-17, decl);
  if (Number.isNaN(fajr)) fajr = rise - night / 7; // Sommer in hohen Breiten: Nachtbruchteil
  if (Number.isNaN(isha)) isha = set + night / 7;
  const asrAlt = deg(Math.atan(1 / (1 + Math.tan(Math.abs(rad(LAT) - decl)))));
  const asr = noon + hourAngle(asrAlt, decl);
  return [fajr, rise, noon, asr, set, isha].map(fmt);
}

const days = {};
for (let t = Date.UTC(2026, 0, 1); t <= Date.UTC(2027, 1, 28); t += 86400000) {
  const dt = new Date(t);
  days[dt.toISOString().slice(0, 10)] = day(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate());
}
writeFileSync(new URL("../src/content/prayer-calendar.json", import.meta.url), JSON.stringify({ source: "beispiel", generatedAt: new Date().toISOString(), hijriAdjustment: 0, days }));
console.log("2026-10-04", days["2026-10-04"], "2026-07-01", days["2026-07-01"], "2026-12-21", days["2026-12-21"]);
