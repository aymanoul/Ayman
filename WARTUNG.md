# GitHub-Pages-Spiegel (zusätzlich zu Vercel)

Die Website läuft zusätzlich auf GitHub Pages, als robusterer Ersatz für
das zeitweise kaputte Vercel-Deployment — **nicht** als Ablösung von
Vercel, das bleibt die eigentliche Zielumgebung.

- **Live-URL:** https://aymanoul.github.io/fahrstation-/
- **Separates Repository:** `aymanoul/fahrstation-` (Endet bewusst mit
  Bindestrich — beim Anlegen so entstanden, nicht mehr geändert, um die
  URL nicht ein zweites Mal zu verschieben.) Bewusst ein **eigenes**
  Repository und nicht einfach der bestehende Pages-Slot von
  `aymanoul/Ayman`: Dort läuft bereits eine andere, aktiv genutzte App
  ("Dar as-Sunnah", Branch `claude/gracious-gates-n4j6z2`) über GitHub
  Pages — die durfte nicht angetastet oder überschrieben werden.
- **Kein automatischer Sync.** `aymanoul/fahrstation-` enthält einen
  statischen Build aus `site/` + `assets/`, erzeugt von
  `scripts/build-github-pages.py` (in diesem Repo, siehe dessen
  Docstring für alle Details). Kurzfassung: jede Unterseite wird als
  `name/index.html` statt `name.html` ausgegeben, damit `/klasse-b` &
  Co. ohne Vercels `cleanUrls` funktionieren; alle internen Links und
  die vier gemeinsamen Dateien (`design-tokens.css`/`styles.css`/
  `script.js`/`manifest.json`) sind **komplett relativ** verlinkt statt
  root-absolut — GitHub-Pages-Projektseiten laufen unter einem
  Unterpfad (`/fahrstation-/...`), root-absolute Pfade wie
  `/styles.css` würden diesen Präfix verlieren und ins Leere laufen
  (genau das ist beim ersten Build passiert: komplett unstyled Seite,
  seitdem behoben und mit einem echten Pfad-Präfix lokal
  nachgestellt/verifiziert, nicht nur am Root getestet).
  `template.html` wird bewusst nicht mit veröffentlicht. **Bei jeder
  künftigen Änderung an `site/` oder `assets/` muss
  `python3 scripts/build-github-pages.py` erneut laufen und das
  Ergebnis nach `aymanoul/fahrstation-` gepusht werden** — sonst läuft
  die Pages-Version aus dem Ruder. Bislang übernehme ich das als
  Teil derselben Session, in der ich die Änderung mache.
- **Manueller Schritt für den Betreiber:** In den Settings von
  `aymanoul/fahrstation-` unter „Pages" die Source auf „Deploy from a
  branch" → `main` → `/ (root)` stellen, falls das nicht schon so
  eingestellt ist.

# VOR DEM LIVE-GANG ZWINGEND ERLEDIGEN

- **OFFEN: Kontaktformular-Dienst wählen und Datenschutzerklärung nachziehen.**
  `site/kontakt.html` ist fertig gebaut, sendet aber noch nichts: die
  Endpunkt-URL in `site/script.js` (Konstante `CONTACT_FORM_ENDPOINT`, ganz
  oben, die einzige Stelle) ist leer. Solange sie leer ist, prüft das
  Formular nur die Eingaben und zeigt den Hinweis, stattdessen anzurufen.

  Sobald ein Dienst (z. B. Formspree, Web3Forms) eingetragen ist, **muss**
  der Abschnitt „Kontaktformular" in `site/datenschutz.html` angepasst
  werden. Dort steht derzeit sinngemäß, dass keine Daten übertragen werden —
  das stimmt dann nicht mehr. Zu ergänzen sind:
  Name des Auftragsverarbeiters, Serverstandort, Rechtsgrundlage
  (Art. 6 Abs. 1 lit. b bzw. f DSGVO), Speicherdauer und der Hinweis auf den
  abgeschlossenen AV-Vertrag. Ohne diese Ergänzung ist das Formular nicht
  DSGVO-konform.

- ~~`/impressum` existiert noch nicht~~ — **erledigt.** `site/impressum.html`
  ist angelegt, Inhalt wortwörtlich aus dem alten Impressum übernommen.
  Die Footer-Links auf `/impressum` und `/datenschutz` wurden in allen 10
  HTML-Dateien geprüft — überall korrekte, funktionierende Ziele, keine
  Platzhalter mehr.
- **ODR-Verweis im Impressum prüfen** — die EU-Plattform zur
  Online-Streitbeilegung wurde möglicherweise eingestellt, wodurch der
  Verweis in `site/impressum.html` (Abschnitt „Online-Streitbeilegung")
  ins Leere laufen könnte. Formulierung ggf. anpassen oder streichen.
- **Urheberrechts-Absatz im Impressum ist unvollständig** — der Absatz
  in `site/impressum.html` besteht nur aus einem Satz und wirkt
  abgeschnitten (üblicherweise folgen dort noch Sätze zu
  Vervielfältigung, Bearbeitung und Downloads). Wortwörtlich aus dem
  alten Impressum übernommen, nichts ergänzt — vom Betreiber prüfen und
  ggf. vervollständigen lassen.
- ~~Facebook-Seite ungeklärt~~ — **erledigt.** Die Fahrschule hat
  `https://www.facebook.com/fahrstationduesseldorf` bestätigt. Das Icon war
  nur in `index.html` auskommentiert (alle anderen Dateien hatten es bereits
  aktiv) — jetzt überall aktiv, plus in `index.html`s JSON-LD `sameAs`
  ergänzt.
- ~~Instagram-URL-Abweichung~~ — **erledigt.** Die Fahrschule hat
  `https://www.instagram.com/fahrschule_fahrstation` bestätigt (mit „www.").
  `index.html` verlinkte abweichend ohne „www." — jetzt auf die „www."-Form
  vereinheitlicht, die alle anderen Dateien bereits verwendeten.
- ~~Google Fonts wurden extern von fonts.googleapis.com/fonts.gstatic.com
  geladen~~ — **erledigt.** Beide Schriften (Anton, Inter) liegen jetzt
  lokal unter `assets/fonts/` und werden per `@font-face` in
  `design-tokens.css` eingebunden. Kein `<link>` zu einer Google-Domain
  mehr in irgendeiner der 9 HTML-Dateien. Mit Playwright/Chromium
  verifiziert: keine Google-Requests, beide `.woff2` werden lokal
  geladen.
- **`site/datenschutz.html` ist ein Entwurf, kein geprüfter Rechtstext.**
  Basiert auf einer alten Datenschutzerklärung, wurde an die tatsächlich
  eingesetzte Technik dieser Website angepasst (siehe Commit-Historie für
  die Prüfung: keine Cookies, kein Tracking, kein eingebettetes Google
  Maps, Kontaktformular überträgt aktuell keine Daten). **Vor
  Veröffentlichung von einer fachkundigen Stelle prüfen lassen** — dies
  ist keine Rechtsberatung.
- **Datenschutzbeauftragter — offen, in `site/datenschutz.html` als
  HTML-Kommentar markiert** (Abschnitt „Datenschutzbeauftragter"). Ist
  einer bestellt? Falls ja: Name/Anschrift/E-Mail dort ergänzen. Falls
  nein: den Unterpunkt ersatzlos streichen. Nicht geraten.
- **Anschrift der Aufsichtsbehörde — offen, in `site/datenschutz.html`
  als HTML-Kommentar markiert** (Abschnitt „Ihre Rechte als betroffene
  Person" → „Recht auf Beschwerde bei einer Aufsichtsbehörde"). Zuständig
  ist die Landesbeauftragte für Datenschutz und Informationsfreiheit
  Nordrhein-Westfalen — aktuelle Anschrift/Telefon/E-Mail vor dem
  Live-Gang aus einer offiziellen Quelle ergänzen, nicht recherchiert
  oder geraten.
- **Auftragsverarbeitungsvertrag (AVV/DPA) mit dem Hosting-Anbieter
  (Vercel Inc.) abschließen bzw. prüfen, ob er automatisch Bestandteil
  der Nutzungsbedingungen ist.** `site/datenschutz.html` beschreibt im
  Abschnitt „Erhebung von Daten beim Besuch dieser Website (Hosting)"
  bereits, dass eine Auftragsverarbeitung und eine Datenübermittlung in
  die USA stattfindet — das operative Nachhalten (AVV vorhanden ja/nein)
  muss der Betreiber übernehmen.

# Wartungshinweise — doppelt gepflegte Angaben

Header und Footer werden bewusst auf jeder Seite als eigenes HTML dupliziert
(nicht per JavaScript eingefügt — siehe Begründung im Auftrag: bessere
SEO-Erfassbarkeit, kein Flackern beim Laden). Das bedeutet: die folgenden
Angaben stehen in **mehreren Dateien** und müssen bei einer Änderung überall
angefasst werden. `site/template.html` ist die Vorlage für alle künftigen
Unterseiten — jede daraus erzeugte Datei (z. B. `site/klasse-b.html`) erbt
diese Angaben und muss bei einer Änderung ebenfalls mitgepflegt werden.

## Telefonnummer (0211 15828104 / tel:+4921115828104)

- `site/index.html` — Header-CTA, `#kontakt`-Sektion (Anrufen-Button),
  JSON-LD (`telephone`)
- `site/template.html` — Mobile-Menü-Button, Abschluss-CTA-Block, feste
  mobile Aktionsleiste
- `site/404.html` — Abschluss-CTA-Block, feste mobile Aktionsleiste
- **Jede aus `template.html` erzeugte Unterseite** — dieselben drei Stellen

## WhatsApp-Nummer (+49 152 29653650 / wa.me-Link)

- `site/index.html` — `#kontakt`-Sektion (WhatsApp-Button)
- `site/template.html` — Abschluss-CTA-Block, feste mobile Aktionsleiste
- `site/404.html` — Abschluss-CTA-Block, feste mobile Aktionsleiste
- **Jede aus `template.html` erzeugte Unterseite** — beide Stellen

## Adresse (Kölner Straße 292, 40227 Düsseldorf)

- `site/index.html` — `#kontakt`-Sektion (Adressblock), Footer, JSON-LD
  (`address`)
- `site/template.html` — Footer
- `site/404.html` — Footer
- **Jede aus `template.html` erzeugte Unterseite** — Footer

Die E-Mail-Adresse (info@fahrstation.de) steht dagegen nur einmal, in
`site/index.html`s `#kontakt`-Sektion — der Footer zeigt sie nicht, ist also
hiervon nicht betroffen.

## Öffnungszeiten (Mo–Fr 10:30–18:00 · Sa 11:00–15:00)

- `site/index.html` — `#kontakt`-Sektion (Öffnungszeiten-Liste + Live-Status),
  JSON-LD (`openingHoursSpecification`), Untertext am Anrufen-Button
  ("Mo–Fr 10:30–18:00 · Sa 11:00–15:00")
- `site/template.html` — derselbe Untertext am Anrufen-Button im
  Abschluss-CTA-Block (der Live-Status/die volle Liste stehen NICHT auf
  Unterseiten, nur dieser eine Satz)
- `site/404.html` — dieselbe Stelle
- **Jede aus `template.html` erzeugte Unterseite** — dieselbe Stelle

## Social-Links (Instagram, Facebook)

Beide URLs sind bestätigt (Instagram `https://www.instagram.com/fahrschule_fahrstation`,
Facebook `https://www.facebook.com/fahrstationduesseldorf`) und stehen jetzt
einheitlich in allen Dateien: Footer überall, JSON-LD `sameAs` nur in
`site/index.html` (einzige Datei mit Organization-Schema).

- `site/index.html` — Footer, JSON-LD (`sameAs`)
- `site/template.html` — Footer
- `site/404.html` — Footer
- **Jede aus `template.html` erzeugte Unterseite** — Footer, erbt den Stand
  von `template.html`

## Firmenname (Fahrschule Fahrstation DUS GmbH & Co. KG)

- `site/index.html` — Footer-Copyright, JSON-LD (`name`)
- `site/template.html` — Footer-Copyright
- `site/404.html` — Footer-Copyright
- **Jede aus `template.html` erzeugte Unterseite** — Footer-Copyright

## Nicht dupliziert (bewusst nur an einer Stelle)

- **LocalBusiness-JSON-LD** — existiert ausschließlich in `site/index.html`.
  Unterseiten bekommen stattdessen optional ein eigenes Course-/Service-
  Schema (in `template.html` auskommentiert vorbereitet).
- **E-Mail-Adresse** — nur in `site/index.html`.

## TEMPORÄR — Platzhalter-Fotos in `assets/vehicles/`

Motorrad- und Auto-Foto (`klasse-a-motorrad.jpg`/`.webp`,
`klasse-b-auto.jpg`/`.webp`) werden später an derselben Location wie
LKW/Bus neu fotografiert und ausgetauscht. Beim Austausch nur die Dateien
in `assets/vehicles/` ersetzen, Dateinamen beibehalten — dann ist kein
Code-Eingriff in `site/template.html` oder in einer daraus erzeugten
Klassen-Seite nötig. LKW- (`klasse-c-lkw.*`) und Bus-Foto
(`klasse-d-bus.*`) bleiben bestehen.
