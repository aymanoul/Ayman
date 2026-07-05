#!/usr/bin/env python3
# Fügt nach jedem "font-family: var(--font-display);" bzw.
# "font-family: var(--font-ui);" eine passende "font-style: italic;"-Zeile
# ein (gleiche Einrückung) — noetig, weil die neuen Inter-Schnitte NUR als
# Italic vorliegen und der Browser sonst bei "normal" auf den Fallback
# (Poppins) statt auf Inter ausweichen könnte. --font-body bleibt unberuehrt
# (aufrechter Lesetext).
import re
import sys
from pathlib import Path

FILES = [
    "src/index.css",
    "src/styles/app.css",
    "src/styles/bookshelf.css",
    "src/styles/carousel.css",
    "src/styles/seal.css",
    "src/styles/seals/arabien.css",
    "src/styles/seals/daniel.css",
    "src/styles/seals/erwartung.css",
    "src/styles/seals/hohelied.css",
    "src/styles/seals/mose.css",
    "src/styles/seals/paraklet.css",
    "src/styles/seals/verteidigung.css",
]

pattern = re.compile(r'^(\s*)font-family: var\(--font-(display|ui)\);\s*$')

total = 0
for rel in FILES:
    p = Path(rel)
    lines = p.read_text().splitlines(keepends=True)
    out = []
    n = 0
    for line in lines:
        out.append(line)
        m = pattern.match(line)
        if m:
            indent = m.group(1)
            out.append(f"{indent}font-style: italic;\n")
            n += 1
    p.write_text("".join(out))
    print(f"{rel}: {n} insertions")
    total += n

print("total:", total)
