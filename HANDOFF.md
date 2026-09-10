# Übergabe: Fahrstation Düsseldorf — Projektstand

Dieses Dokument fasst den kompletten Stand eines vorherigen Chats zusammen,
der gelöscht wird. Ziel: der nächste Chat soll ohne Rückfragen genau dort
weitermachen können, wo dieser aufgehört hat. Es ist als erste Nachricht im
neuen Chat gedacht (einfach den Inhalt einfügen).

---

## 1. Projekt-Überblick

**Was:** Website für die Fahrschule "Fahrstation Düsseldorf" — statisches
HTML/CSS/JS, kein Framework, kein Build-Step, kein Paketmanager.

**Repo:** `aymanoul/Ayman`
**Branches (beide IMMER synchron halten, jede Änderung auf beide pushen):**
- `claude/practical-wright-d1vge6` (Default-Branch)
- `claude/karpathy-skills-plugin-ll35ue`

**Workflow für Branch-Sync:** Änderung auf einem Branch committen und
pushen, dann auf den anderen Branch wechseln (`git fetch` + `git reset
--hard origin/<branch>`) und den Commit per `git cherry-pick <hash>`
übernehmen, dann pushen. Das hat in dieser Session durchgehend
konfliktfrei funktioniert, da beide Branches parallel identisch gehalten
wurden.

**Zweites Repo (GitHub-Pages-Spiegel, zusätzlich zu Vercel):**
`aymanoul/fahrstation-` — lokal ausgecheckt unter `/home/user/fahrstation-`.
**Nach JEDER Änderung an `site/` oder `assets/` MUSS dieser Spiegel neu
gebaut und gepusht werden** (siehe Abschnitt 4). Das ist keine Kür, sondern
Pflicht — wurde in dieser Session einmal vergessen und musste nachgeholt
werden, seitdem nach jedem Feature-Commit sofort miterledigt.

**Deployment:** Vercel (Hauptseite, aus `site/` + `assets/`) und GitHub
Pages (Spiegel, projektseiten-typischer Unterpfad `/fahrstation-/...`,
NICHT Domain-Root — wichtiger Unterschied, siehe Build-Skript-Kommentare).

---

## 2. Verzeichnisstruktur

```
/home/user/Ayman/                  <- Hauptrepo (dieser Chat arbeitet hier)
  site/
    index.html                     <- Startseite (Hero, Trust, Klassen, Ablauf, Team, Kontakt-Sektion)
    klasse-a.html, klasse-b.html, klasse-c.html, klasse-d.html
    theorie.html
    ueber-uns.html
    seminare.html
    kontakt.html                   <- NEU in dieser Session, siehe Abschnitt 6
    impressum.html
    datenschutz.html
    404.html
    template.html                  <- Vorlage für neue Unterseiten, kein echter Seiteninhalt
    design-tokens.css              <- EINZIGE Quelle für Farbe/Schrift/Abstand/Komponentenklassen
    styles.css                     <- Layout, Komponenten-Styles
    script.js                      <- Vanilla JS, IIFE, mehrere init*()-Funktionen
    manifest.json
  assets/
    logo.png, favicon etc.
    fonts/anton-latin-400.woff2, inter-latin-400-700.woff2   <- lokal gehostet, kein Google-Fonts-Link
    vehicles/klasse-*-*.jpg/.webp  <- Fahrzeugfotos für Klassen-Seiten
    theorie-raum.jpg/.webp         <- Foto Theorieraum (aus dieser Session)
    btn-voranmelden.png            <- Haupt-CTA-Grafik gelb (aus dieser Session)
    btn-anrufen.png                <- Haupt-CTA-Grafik schwarz (aus dieser Session)
  scripts/
    build-github-pages.py          <- Baut aus site/+assets/ den GitHub-Pages-Output
  WARTUNG.md                       <- Lebendes Dokument: offene Punkte, doppelt gepflegte Angaben
  HANDOFF.md                       <- DIESES DOKUMENT (nicht committed, nur lokal)

/home/user/fahrstation-/           <- GitHub-Pages-Spiegel, separates Git-Repo
```

---

## 3. Design-System (wichtig für jede visuelle Änderung)

**Grundprinzip:** "Signage"-Ästhetik — schräg geschnittene Kanten wie
Verkehrs-/Richtungsschilder, KEINE runden Ecken (außer wo explizit aus
Bedienbarkeitsgründen nötig, z. B. Formularfelder).

**Farben (`design-tokens.css`):**
```css
--primary: #161514;    /* Schwarz */
--accent: #FDDE01;     /* Signalgelb */
--text-light: #FFFFFF;
--text-dark: #1A1A1A;
--background-light: #F5F5F5;
--error: #FF7A6B;      /* NEU in dieser Session — einzige Farbe außerhalb der Signage-Palette,
                           nur für Formularfehler, da Gelb sonst durchgehend "jetzt klicken" bedeutet */
```

**Schrift:** `--font-display` = Anton (Headlines, Buttons, immer
UPPERCASE), `--font-body` = Inter (Fließtext). Beide lokal in
`assets/fonts/` gehostet.

**Signage-Hexagon-Schnitt** (das wiederkehrende Formmotiv — pointed
left+right, wie ein Wegweiser):
```css
clip-path: polygon(
  0 50%,
  var(--badge-notch) 0,
  calc(100% - var(--badge-notch)) 0,
  100% 50%,
  calc(100% - var(--badge-notch)) 100%,
  var(--badge-notch) 100%
);
```
`--badge-notch: 16px` ist der Standard-Token, unabhängig von der
Elementhöhe — wird u. a. von `.signage-badge`, `.class-chip`,
`.testimonial`, `.step-number`, `.contact-action` verwendet.

**Wichtige Falle:** `clip-path` schneidet `box-shadow` UND `border` an den
Schrägen weg (dokumentiert in mehreren Kommentaren in
`design-tokens.css`). Lösung ist die **Zwei-Ebenen-Technik**: äußeres
Element komplett in der Rahmenfarbe füllen, ein `::before` (oder ein
echtes Kind-Element bei hohem Inhalt) 1-2px eingerückt mit der
Hintergrundfarbe füllen — beide mit demselben `clip-path`. Beispiele:
`.class-chip`/`.class-chip::before`, `.contact-action--whatsapp::before`,
`.kontakt-form-card`/`.kontakt-form-card__inner`.

**Neue Haupt-CTA-Komponente `.btn-signage`** (aus dieser Session, ersetzt
`.btn-primary`/`.btn-secondary` als Haupt-CTA-Stil): basiert auf einem vom
Nutzer hochgeladenen Bild (zwei Formen: gelb "Jetzt voranmelden", schwarz
"Anrufen"), umgesetzt per `border-image` mit Drei-Spalten-Slice (`0 160 0
320 fill`), sodass Kappen bei jeder Breite/Höhe unverzerrt bleiben und nur
der Mittelteil streckt. Kappenbreite skaliert per `calc()` mit
`--btn-signage-h`. Siehe `design-tokens.css`, Suchbegriff `.btn-signage`.
Verwendet auf: Hero (Startseite), allen 7 Unterseiten-CTAs, Formular-Submit
in kontakt.html.

---

## 4. GitHub-Pages-Spiegel — Ablauf (bei JEDER site/-Änderung wiederholen)

```bash
cd /home/user/Ayman
python3 scripts/build-github-pages.py /home/user/fahrstation-
cd /home/user/fahrstation-
git add -A
git commit -m "..."
git push origin main
```

**Bekannte Fallstricke** (beide schon einmal in Produktion aufgetreten,
deshalb hat das Skript Assertions, die laut abbrechen statt still falsch zu
bauen):
1. Root-absolute Pfade wie `/styles.css` funktionieren auf GitHub Pages
   NICHT (Projektseite läuft unter `/fahrstation-/...`-Unterpfad, nicht
   Domain-Root). Das Skript schreibt deshalb alle Pfade relativ um,
   abhängig von Verschachtelungstiefe (Root-Seiten bare-relativ,
   verschachtelte Seiten mit `../`).
2. Wenn das Skript mit "Erwartet mindestens 1 Treffer"-Fehler abbricht,
   heißt das: ein Linkziel in `site/` hat sich geändert (z. B. neue
   Unterseite, geänderter Anchor) und die Listen `NAV_REWRITES` /
   `NESTED_PAGES` im Skript müssen nachgezogen werden.
3. **Immer mit realistischem Pfad-Präfix testen**, nicht am bare Root —
   sonst fällt der Unterpfad-Bug nicht auf. Test-Pattern, das in dieser
   Session verwendet wurde:
   ```bash
   python3 -m http.server 8xxx --directory /home/user
   # dann im Browser/Playwright: http://localhost:8xxx/fahrstation-/...
   ```

`NESTED_PAGES` aktuell: `klasse-a, klasse-b, klasse-c, klasse-d, theorie,
ueber-uns, impressum, datenschutz, seminare, kontakt`.

---

## 5. Was in dieser Session gebaut/geändert wurde (chronologisch)

1. **Theorieraum-Foto** auf `site/theorie.html` eingebaut — `<picture>`
   mit WebP+JPEG-Fallback, volle Breite, 4:3, `object-fit: cover`, KEIN
   Signage-Rahmen (bewusst anders als Fahrzeugfotos), Bildunterschrift.
   Dateien: `assets/theorie-raum.jpg` (255 KB), `.webp` (111 KB).

2. **Testlauf Anrede-Umstellung auf `klasse-b.html`:** Ihr/Euch/Euer →
   Du/Dich/Dein, jeder Satz einzeln auf korrekte Fallform geprüft (nicht
   pauschal ersetzt). Zusätzlich Aufmacher-Absatz in direkterem,
   kürzerem Stil umformuliert ("Variante C": z. B. "Mit der Klasse B
   nimmst du die meisten PKW – bis 3500 kg, dazu einen Anhänger bis 750
   kg. Erst bei schwereren Anhängern brauchst du zusätzlich die BE.").

3. **Anrede-Umstellung auf allen restlichen Seiten** ausgerollt:
   klasse-a/c/d, theorie, ueber-uns, seminare — gleiches Prinzip: Du-Form
   überall, direkterer Aufmacher-Absatz nur beim jeweils ersten Absatz
   (bei seminare.html: bei allen vier Kurzbeschreibungen einzeln).

4. **Nachtrag Anrede-Reste:** Nutzer bat um vollständige Volltextsuche
   über ALLE `site/*.html` nach Ihr/Euch/Euer/Eure (inkl. aller
   Deklinationsformen wie "eurem", die in einer früheren Regex-Runde
   übersehen worden waren). Fund: `index.html` (Meta-Descriptions,
   Ablauf-Schritte, "Bereit?"-Kontaktblock, Formular-Hinweis) und
   `404.html` (Meta-Description, Fließtext) hatten noch Reste — behoben.
   `datenschutz.html`/`impressum.html` bewusst unverändert gelassen: nutzen
   durchgehend die formelle Sie-Anrede, kein Ihr/Euch-Plural.
   **Lektion:** bei sowas immer case-insensitive UND mit vollständigem
   Formen-Set suchen (`ihr|euch|euer|eure|eurem|euren|eurer|eures`), plus
   separat nach bloßen Imperativen ohne Pronomen suchen (z. B. "Ruft an,
   schreibt uns" → "Ruf an, schreib uns").

5. **Hero-Bereich bereinigt:** auf Nutzerwunsch (Screenshot mit
   Einkreisungen) die A/B/C/D-Klassen-Chips (`.hero-chips`) und den
   Untertext (`.hero-section__subline`) aus `index.html` entfernt — nur
   Überschrift + die zwei CTA-Buttons bleiben im Hero.

6. **Haupt-CTA-Buttons neu gebaut** (`.btn-signage`, siehe Abschnitt 3):
   - Nutzer hatte ein Referenzbild geschickt (zwei Formen im
     Fahrstation-Signage-Stil), erst wurde eine reine CSS-Variante
     vorgeschlagen (clip-path + skewX-Doppelstreifen), die der Nutzer
     ablehnte ("sieht nicht gut aus, will genau das von mir").
   - Danach das tatsächlich hochgeladene Bild per Python/PIL vermessen
     (Alpha-Kanal-Analyse, Kappenbreiten bestimmt), in zwei PNGs
     zerlegt, Mittelteil gekürzt (wird eh gestreckt) und auf 128 Farben
     quantisiert: 350 KB → 10 KB / 8,6 KB.
   - Als `border-image` mit 3-Spalten-Slice umgesetzt (siehe Abschnitt
     3), auf Hero, allen 7 Unterseiten-CTAs und Formular-Submit
     angewendet. Alter `.hero-section__cta`-clip-path-Code (inkl.
     Pfeil-Span) dabei entfernt.

7. **Neue Kontaktseite `site/kontakt.html`** (aktuellster, größter
   Baustein — siehe Abschnitt 6 für Details).

---

## 6. site/kontakt.html — vollständiger Stand (WICHTIGSTER OFFENER PUNKT)

**Warum gebaut:** "Jetzt voranmelden" führte bisher nur zur
Telefon/WhatsApp-Sektion auf der Startseite, es gab keine echte
Anmeldemöglichkeit.

**Seitenaufbau** (in dieser Reihenfolge):
1. Direktwege oben (Anrufen, WhatsApp) — identische `.contact-action`-
   Kacheln wie bisher auf der Startseite.
2. Formular (Name*, E-Mail*, Betreff optional, Nachricht*, Pflicht-
   Checkbox Datenschutz, Honeypot).
3. Adresse + Öffnungszeiten (`.contact-info`, `.contact-hours`,
   `.contact-address` — wiederverwendet aus der Startseite).

**SEO:** Title "Kontakt & Anmeldung | Fahrstation Düsseldorf", Meta
Description, `canonical`, BreadcrumbList-Schema Start > Kontakt.

**Formular-Validierung (eigener JS-Code, nicht Browser-nativ):**
- Funktion `initKontaktForm()` in `site/script.js`.
- Deutsche, freundliche Fehlermeldungen direkt unter dem Feld.
- Wichtige technische Lektion: Nachprüfung während des Tippens läuft auf
  `input`-Event, NICHT auf `blur` — Grund: wenn eine Fehlermeldung beim
  Verlassen eines Feldes verschwindet, rutscht das Layout nach oben,
  genau in dem Moment, in dem der nächste Klick/Tap passiert (mousedown
  und mouseup landen dann auf verschiedenen Elementen, der Klick geht
  verloren). Mit Playwright reproduziert und verifiziert.
- Checkbox war anfangs mit 13×13px (Browser-Default) zu klein für
  Touch — auf 20×20px vergrößert.
- Erfolgsfall: Formular wird versteckt, Bestätigungstext eingeblendet
  (kein Reload), Fokus wandert dorthin (`tabindex="-1"` +
  `.focus()`).
- Honeypot-Feld: bei Befüllung wird nach außen ein Erfolg vorgetäuscht
  (Bot soll nicht merken, dass er geblockt wurde).

**DER ZENTRALE OFFENE PUNKT — Versand-Dienst noch nicht gewählt:**
```js
// In site/script.js, ganz oben im IIFE:
var CONTACT_FORM_ENDPOINT = '';   // <-- HIER einzutragen, sobald entschieden
```
Solange leer: Formular validiert nur, zeigt Hinweis "Ruf uns an oder
schreib per WhatsApp", sendet nichts. **Der Nutzer wurde nach seiner
Entscheidung gefragt, hat aber in diesem Chat noch NICHT geantwortet,
bevor der Chat beendet wurde.** Vorgeschlagene Optionen waren:

1. **Web3Forms** (empfohlen, unter Vorbehalt) — kostenlos, kein Server,
   wirbt mit EU-Servern + AV-Vertrag, aber vom Nutzer noch zu verifizieren
   (Netzwerkzugriff auf Anbieterseiten war in der Sandbox gesperrt, daher
   keine Live-Prüfung möglich).
2. **Formspree** — etabliert, aber EU-Datenregion vermutlich nur in
   kostenpflichtigen Stufen; auf der Gratisstufe Drittlandübertragung USA.
3. **Eigene Vercel-Funktion** — sauberste DSGVO-Lage (ein
   Auftragsverarbeiter weniger), aber mehr Bauaufwand und vermutlich
   Vercel-Pro nötig (~20$/Monat).

Bei Formspree/Web3Forms ist die Anbindung identisch (POST + FormData +
`Accept: application/json`), deshalb genügt für den späteren Wechsel die
eine Codezeile. **Ausnahme Web3Forms:** braucht zusätzlich ein verstecktes
`access_key`-Feld im Formular-Markup, das noch ergänzt werden muss, sobald
der Key vorliegt.

**Zweiter offener Punkt — Startseiten-Kontaktsektion:**
Die alte Kontakt-Sektion auf `index.html` (`#kontakt`, "Bereit?" mit
Telefon/WhatsApp + dem alten, nie fertiggestellten Formular) existiert
noch unverändert, aber nichts verlinkt mehr dorthin (alle Links zeigen
jetzt auf `/kontakt`). **Empfehlung, die dem Nutzer gegeben wurde, auf die
er noch nicht geantwortet hat:** altes Formular auf der Startseite
entfernen, Direktwege (Telefon/WhatsApp/Öffnungszeiten/Adresse) dort
behalten, stattdessen einen Textlink "Zum Kontaktformular" zu `/kontakt`
einfügen. Doppelte Formulare = doppelte Pflege, doppeltes Datenschutz-
Risiko.

**Dritter offener Punkt — Datenschutzerklärung:**
Sobald der Formular-Dienst feststeht, MUSS der Abschnitt "Kontaktformular"
in `site/datenschutz.html` angepasst werden — dort steht aktuell (noch
korrekt, aber bald falsch), dass keine Daten übertragen werden. Als
offener Punkt in `WARTUNG.md` eingetragen (Abschnitt "VOR DEM LIVE-GANG
ZWINGEND ERLEDIGEN"), Text selbst wurde bewusst noch NICHT geändert, da
der Dienst noch nicht gewählt ist. Nötige Ergänzungen bei Wahl: Name des
Auftragsverarbeiters, Serverstandort, Rechtsgrundlage (Art. 6 Abs. 1 lit.
b bzw. f DSGVO), Speicherdauer, Hinweis auf AV-Vertrag.

**Alle Linkziele bereits umgestellt** (in dieser Session erledigt):
- Alle "Jetzt voranmelden"-Buttons → `/kontakt` (statt `/#kontakt`)
- Menüpunkt "Kontakt" im Mobilmenü → `/kontakt`
- `page-cta__link`-Textlink im Abschluss-Block (ex "Alle Infos & Formular
  ›") → "Zum Kontaktformular ›", zeigt auf `/kontakt`
- Feste mobile Aktionsleiste (Anrufen/WhatsApp) bewusst UNVERÄNDERT
  gelassen — kein Platz für dritten Button.

---

## 7. Letzter bekannter Commit-Stand (vor Chat-Ende)

- `claude/karpathy-skills-plugin-ll35ue`: `ce69b0a` "Kontaktseite mit
  echtem Formular anlegen"
- `claude/practical-wright-d1vge6`: `1daae10` (identischer Inhalt, per
  Cherry-Pick übernommen)
- `aymanoul/fahrstation-` (main): `cf56e45`

Alle drei sind gepusht und der Arbeitsbaum war zum Zeitpunkt des
Chat-Endes sauber (`git status --short` leer auf beiden Branches).

---

## 8. Offene ToDos für den nächsten Chat (Priorität von oben nach unten)

1. **Nutzer nach Formular-Dienst fragen** (falls noch nicht entschieden) —
   die drei Optionen aus Abschnitt 6 stehen zur Wahl. Bei Entscheidung:
   - `CONTACT_FORM_ENDPOINT` in `site/script.js` eintragen
   - Bei Web3Forms: verstecktes `access_key`-Feld in
     `site/kontakt.html` ergänzen
   - `site/datenschutz.html` entsprechend Abschnitt 6 anpassen
   - Den entsprechenden WARTUNG.md-Punkt als erledigt markieren
   - Auf beide Branches + GitHub-Pages-Spiegel pushen (siehe Abschnitt 4)

2. **Nutzer nach Startseiten-Kontaktsektion fragen** (falls noch nicht
   entschieden) — Empfehlung: altes Formular entfernen, Textlink zu
   `/kontakt` ergänzen, Direktwege/Öffnungszeiten/Adresse behalten.

3. Ansonsten: auf neue Anweisungen des Nutzers warten. Es gibt keine
   sonstigen offenen/angefangenen Aufgaben aus dieser Session.

---

## 9. Allgemeine Arbeitsweise, die sich in dieser Session bewährt hat

- **Immer mit Playwright visuell verifizieren** (Chromium unter
  `/opt/pw-browsers/chromium`), bevor committed wird — Screenshots,
  Klick-Interaktionen, Netzwerk-Fehler (`response.status >= 400`),
  JS-Fehler (`pageerror`) prüfen. Wurde bei JEDER Änderung in dieser
  Session gemacht, hat mehrfach echte Bugs vor dem Commit gefunden (z. B.
  die blur/input-Timing-Falle, den fehlenden Rahmen durch
  margin-collapsing).
- **Vor jedem `git checkout`/Reset:** `git status --short` prüfen, nichts
  Unbeabsichtigtes verlieren.
- **HTML-Validierung** vor jedem Commit: `python3 -c "import
  html.parser; ..."` — einfacher Wellformedness-Check, hat in dieser
  Session zuverlässig funktioniert.
- **Bei Volltextsuchen nach sprachlichen Mustern:** immer
  case-insensitive UND mit allen Flexionsformen suchen, nicht nur der
  offensichtlichsten. Ein einziges übersehenes "eurem" hat in dieser
  Session einen ganzen Nachtrags-Task ausgelöst.
- **Bei clip-path-Elementen:** box-shadow/border funktionieren nicht wie
  erwartet — immer die Zwei-Ebenen-Technik verwenden und das vorher kurz
  denken, nicht erst nach dem Rendern merken.
- Der Nutzer reagiert gut auf **kurze, konkrete Rückfragen mit klarer
  Empfehlung**, wenn eine Entscheidung ansteht (siehe die
  AskUserQuestion-artigen Formulierungen in den Abschlusstexten dieser
  Session) — lieber einmal kurz nachfragen als eine Annahme treffen, die
  falsch sein könnte, besonders bei Geschäftsentscheidungen (Formular-
  Dienst, Datenschutz).
