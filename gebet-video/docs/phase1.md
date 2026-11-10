# Phase 1 – Figurenblätter

Dateien: `out/phase1/`

| Datei | Inhalt |
| --- | --- |
| `figurenblatt-A-1-ansichten.jpg` | Person A: vorne, Dreiviertel, Seite, hinten; Kopf aus 4 Richtungen; Mund in 4 Formen |
| `figurenblatt-A-2-ausdruck.jpg` | Person A: 5 Gefühlslagen, Hände und Gesten, Gangbild, Sitzen, Schuhe/Socken |
| `figurenblatt-B-1-ansichten.jpg` | Person B: wie oben |
| `figurenblatt-B-2-ausdruck.jpg` | Person B: wie oben, Gangbild in Eile mit Handy |
| `varianten-A.jpg`, `varianten-B.jpg` | Hautton (3), Bartlänge (3), Augenbrauen ohne/mit, Gefühlslagen ohne/mit Augenbrauen |
| `nebenfiguren.jpg` | Betende in der Reihe, von hinten und aus der Ferne |

## Aufbau der Figur

- Gelenke: Hüfte, Rücken, Hals, Kopf, Schultern (drehen, heben, senken), Ellbogen, Handgelenke,
  vier Finger mit je zwei Gliedern, Daumen, Füße.
- Arme lassen sich über Winkel oder über einen Zielpunkt fürs Handgelenk steuern (`reach`), die
  Handfläche über eine Richtung (`palm`). So entstehen „Hand aufs Herz“ oder „Hand auf die Schulter von B“.
- Mund: zu, halb offen, offen, Lächeln. Der Mund folgt der Rundung des Gesichts.
- Qamis: Oberteil und Unterteil aus kantigen Ringen. Beim Gehen schwingt der Saum, die Füße
  schauen darunter hervor, der Körper wippt leicht. Fürs Sitzen gibt es einen Schneidersitz.
- Schuhe (draußen) und Socken (in der Moschee) sind umschaltbar.
- Gefühl ohne Augen: Kopfhaltung, Mundform (auch schief oder schmal), Schultern, Hände, Rücken.

## Augen-Regel

- In `web/lib/figure.js` gibt es kein Bauteil für Augen.
- Beim Prüfen der Blätter fiel auf: Am Hinterkopf schimmerten zwei helle Hautpunkte durch die Haare.
  Ursache war eine zu grobe Haarschale. Behoben (feinere Schale, größerer Abstand) und danach jede
  Kopfansicht einzeln kontrolliert.
- Augenbrauen: Die Variante „mit“ ist gebaut und gezeigt. Empfehlung: ohne, weil zwei dunkle Striche
  auf der Stirn ohne Augen darunter wie geschlossene Augen wirken können.

## Entscheidungen (freigegeben)

- Augenbrauen: **ohne** (für A und B).
- Hautton: **mittel** (A `#c79367`, B `#d19d72`).
- Bart: A **mittel** (voller Bart, `beardLen 0.5`), B **kurz** (`beardLen 0.12`).
- Phase 1 ist freigegeben.
