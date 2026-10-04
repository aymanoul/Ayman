import calendar from "@/content/prayer-calendar.json";

export const prayers = [
  { key: "fajr", name: "Fajr", idx: 0 },
  { key: "dhuhr", name: "Dhuhr", idx: 2 },
  { key: "asr", name: "ʻAsr", idx: 3 },
  { key: "maghrib", name: "Maghrib", idx: 4 },
  { key: "isha", name: "ʻIshāʼ", idx: 5 },
] as const;

export const data = calendar as { source: string; generatedAt: string; hijriAdjustment: number; days: Record<string, string[]> };
export const isSample = data.source === "beispiel";

/** Aktuelle Wanduhrzeit in Deutschland, unabhängig von der Zeitzone des Geräts. */
export function berlinNow(d = new Date()) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Berlin", hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" })
      .formatToParts(d).map((x) => [x.type, x.value]),
  );
  return { date: `${p.year}-${p.month}-${p.day}`, secs: +p.hour * 3600 + +p.minute * 60 + +p.second };
}

export const addDays = (iso: string, n: number) => new Date(Date.parse(iso + "T12:00:00Z") + n * 86400000).toISOString().slice(0, 10);
const toSecs = (hhmm: string) => +hhmm.slice(0, 2) * 3600 + +hhmm.slice(3, 5) * 60;

/** Nächstes Gebet und Sekunden bis dahin. Nach ʻIshāʼ: Fajr von morgen. */
export function nextPrayer(now: { date: string; secs: number }) {
  const today = data.days[now.date];
  if (today) {
    for (const p of prayers) if (toSecs(today[p.idx]) > now.secs) return { prayer: p, tomorrow: false, left: toSecs(today[p.idx]) - now.secs };
  }
  const tm = data.days[addDays(now.date, 1)];
  if (!tm) return null;
  return { prayer: prayers[0], tomorrow: true, left: 86400 - now.secs + toSecs(tm[0]) };
}

const hijriMonths = ["Muharram", "Safar", "Rabīʻ al-awwal", "Rabīʻ ath-thānī", "Jumādā al-ūlā", "Jumādā al-ākhira", "Rajab", "Shaʻbān", "Ramaḍān", "Shawwāl", "Dhū al-qaʻda", "Dhū al-ḥijja"];

/** Hijri-Datum nach Umm al-Qura, verschoben um hijriAdjustment (aus MAWAQIT). */
export function hijri(dateISO: string) {
  const d = new Date(Date.parse(addDays(dateISO, data.hijriAdjustment) + "T12:00:00Z"));
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", { timeZone: "UTC", day: "numeric", month: "numeric", year: "numeric" }).formatToParts(d).map((x) => [x.type, x.value]));
  return `${p.day}. ${hijriMonths[+p.month - 1]} ${p.year}`;
}

export const fmtLeft = (s: number) => {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
  return [h, m, x].map((n) => String(n).padStart(2, "0")).join(":");
};
