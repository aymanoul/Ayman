# VOR DEM LIVE-GANG ZWINGEND ERLEDIGEN

- **`/impressum` und `/datenschutz` existieren noch nicht.** `site/index.html`
  (Footer, Formular-Checkbox) und `site/template.html` (Footer) verlinken
  bereits korrekt auf `/impressum` und `/datenschutz` — die Zielseiten selbst
  fehlen aber noch. Ein Impressum ist in Deutschland (§ 5 DDG, vormals TMG)
  für eine öffentlich erreichbare Website **gesetzlich vorgeschrieben**.
  Bevor die Domain öffentlich freigegeben wird, müssen beide Seiten stehen.
- **Facebook-Seite ungeklärt.** Es ist nicht bestätigt, ob überhaupt eine
  Facebook-Seite zur Fahrschule existiert. Der zuvor im Code hinterlegte Link
  (`https://www.facebook.com/fahrstationduesseldorf`) wurde nicht verifiziert
  und ist auf `index.html` als unbestätigt eingestuft worden. Das
  Facebook-Icon im Footer von `index.html` ist deshalb vorerst auskommentiert
  (nicht gelöscht) und im JSON-LD `sameAs` entfernt worden. Sobald geklärt
  ist, ob/welche Facebook-Seite existiert: Icon wieder einkommentieren (oder
  entfernen) und ggf. `sameAs` ergänzen — **in `index.html` UND, falls dort
  ebenfalls unverändert übernommen, in `template.html`** (dort steht der
  alte, unbestätigte Link aktuell noch unverändert, siehe Abweichungs-Hinweis
  unten).
- **Instagram-URL-Abweichung zwischen `index.html` und `template.html`.**
  `index.html` verlinkt jetzt bewusst ohne „www." auf
  `https://instagram.com/fahrschule_fahrstation` (explizite Vorgabe).
  `template.html` verwendet an derselben Stelle weiterhin
  `https://www.instagram.com/fahrschule_fahrstation` (mit „www."). Nicht
  eigenmächtig angeglichen — bitte entscheiden, welche Variante für alle
  Unterseiten gelten soll, dann einmalig in `template.html` und allen bereits
  daraus erzeugten Seiten nachziehen.

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

- `site/index.html` — Footer, JSON-LD (`sameAs`). **Stand jetzt abweichend**
  von den übrigen Dateien: Instagram ohne „www.", Facebook-Icon
  auskommentiert und aus `sameAs` entfernt (unbestätigte URL) — Details und
  offene Entscheidung siehe „VOR DEM LIVE-GANG ZWINGEND ERLEDIGEN" oben.
- `site/template.html` — Footer (noch der alte Stand: Instagram mit „www.",
  Facebook-Link aktiv/unbestätigt)
- `site/404.html` — Footer (vermutlich ebenfalls alter Stand, nicht Teil
  dieser Aufgabe geprüft)
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
