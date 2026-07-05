#!/usr/bin/env python3
# Einmalige mechanische Umbauten an allen 9 Siegel-Seiten:
#   1. Den dekorativen arabischen Titel-Untertitel (.seal__ar) entfernen
#      (3-Zeilen-Block) — auf Nutzerwunsch, wie schon der Startseiten-Platzhalter.
#   2. fmt-Import ergänzen.
#   3. Die These ({<name>These}) und die Schritt-Texte ({s.body}) durch
#      {fmt(...)} ersetzen, damit wichtige Aspekte eingefärbt werden.
import re
from pathlib import Path

files = sorted(Path("src/pages/seals").glob("*.tsx"))

# 3-Zeilen-Block der arabischen Zeile (Zeile 1 = öffnendes span, 3 = schließendes)
ar_open = re.compile(r'^\s*<motion\.span className="seal__ar arabic".*$')

for p in files:
    lines = p.read_text().splitlines(keepends=True)
    out = []
    i = 0
    removed_ar = False
    while i < len(lines):
        if ar_open.match(lines[i]) and i + 2 < len(lines) and "</motion.span>" in lines[i + 2]:
            i += 3  # den ganzen 3-Zeilen-Block überspringen
            removed_ar = True
            continue
        out.append(lines[i])
        i += 1
    text = "".join(out)

    # fmt-Import nach dem anim-Import einfügen (nur einmal)
    if "lib/fmt" not in text:
        text = text.replace(
            "from '../../lib/anim'\n",
            "from '../../lib/anim'\nimport { fmt } from '../../lib/fmt'\n",
            1,
        )

    # These umschließen: {abcThese} -> {fmt(abcThese)}
    text = re.sub(r'\{(\w+These)\}', r'{fmt(\1)}', text)
    # Schritt-Text umschließen: step__b">{s.body} -> {fmt(s.body)}
    text = text.replace('className="step__b">{s.body}</p>',
                        'className="step__b">{fmt(s.body)}</p>')

    p.write_text(text)
    print(f"{p.name}: ar_removed={removed_ar}")

print("done")
