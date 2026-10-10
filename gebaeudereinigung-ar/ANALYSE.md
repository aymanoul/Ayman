# Phase 1: Analyse (Stand 2026-10-10)

## Status: alte Seite nicht abrufbar
- `www.gebaeudereinigung-ar.de` und `www.daarhadeeth.com` werden von der Netzwerk-Richtlinie dieser Cloud-Umgebung blockiert (Proxy antwortet 403, DNS über WebFetch: ENOTFOUND, Internet Archive gesperrt).
- Folge: keine Screenshots, kein Originaltext, keine Aussage zu CMS/Hosting/Formular. Nichts davon wird geraten.
- Weiter geht es, sobald entweder die Domains freigegeben sind oder die HTML-Dateien in `_incoming/alte-seite/` liegen.

## Was bisher feststeht (nur aus dem Auftrag, nicht selbst geprüft)
Die Mängelliste aus Abschnitt 3 des Auftrags wird übernommen und nach dem Abruf der alten Seite Punkt für Punkt bestätigt:
- leere Leistungsseiten, widersprüchliche Leistungsliste (8 / 3 / FAQ inkl. „Gebäudeservice“)
- Grammatikfehler im Slider („Ihr zuverlässige Partner“), Floskeln, „impressum“ klein, „Hegelstr.“, „Kundenzufriedenh|eit“
- Telefon nicht antippbar, kein WhatsApp, Formular nur Name/E-Mail/Nachricht
- `noindex,nofollow` auf „Über uns“, leeres Logo-`src`, fehlende Alt-Texte, `&amp;` in Title/Description

## Strukturvorbild
- Die Moschee-Seite (masjid-sunnah) liegt in der Git-Historie dieses Repos (Commit `c595855`, Ordner `masjid-sunnah/`, im Commit `73e4a73` entfernt). Aufbau, Komponenten und Build-Weg werden von dort übernommen, ohne islamische Gestaltungselemente.

## Stack-Empfehlung (vorbehaltlich Hosting)
Wie bei der Moschee-Seite: Next.js (App Router) + TypeScript + Tailwind CSS 4, `output: 'export'`, `trailingSlash: true`.
- Läuft auf jedem Hosting (Apache/nginx/IONOS/Strato/Netcup, Vercel, Netlify, GitHub Pages).
- Montserrat selbst gehostet über `@fontsource-variable/montserrat`, Icons über `lucide-react`.
- Inhalte in `src/content/*.ts`.
- Formular: hängt am Hosting (siehe Fragen). Statischer Export kann kein PHP; Optionen: kleines PHP-Skript beim bestehenden Hoster, oder ein EU-Formulardienst.
- URLs bleiben gleich (`/leistungen/...`). Ob die alte Seite mit oder ohne Schrägstrich am Ende arbeitet, wird nach dem Abruf geprüft und ggf. per Weiterleitung abgefangen.
