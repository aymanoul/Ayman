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

- `site/index.html` — Footer, JSON-LD (`sameAs`)
- `site/template.html` — Footer (identische Links, identisches Markup)
- `site/404.html` — Footer
- **Jede aus `template.html` erzeugte Unterseite** — Footer

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
