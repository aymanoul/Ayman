#!/usr/bin/env python3
"""Baut aus site/ + assets/ einen GitHub-Pages-tauglichen Output.

Wird bei jeder Änderung an site/ oder assets/ manuell ausgeführt und das
Ergebnis nach aymanoul/fahrstation- gepusht (siehe WARTUNG.md, Abschnitt
"GitHub-Pages-Spiegel"). Kein automatischer Sync, kein Cron, kein Hook --
bewusst ein expliziter, nachvollziehbarer Schritt.

Nötig, weil GitHub Pages (anders als Vercel) zwei Dinge nicht kann:
1. Einen beliebigen Unterordner (site/) als Quelle nutzen -- nur "/" oder
   "/docs". Lösung: jede Unterseite wird als eigener Ordner mit index.html
   ausgegeben (klasse-b.html -> klasse-b/index.html), damit z.B. /klasse-b
   über die native Verzeichnis-Index-Auflösung funktioniert.
2. Root-absolute Pfade wie "/styles.css" funktionieren NICHT, weil GitHub-
   Pages-Projektseiten unter einem Unterpfad laufen (z.B.
   aymanoul.github.io/fahrstation-/...), nicht am echten Domain-Root. Ein
   root-absoluter Pfad würde den Unterpfad-Präfix verlieren. Deshalb ist
   hier ALLES relativ verlinkt, abhängig von der Verschachtelungstiefe:
   Root-Seiten (index.html, 404.html) bare-relativ, verschachtelte Seiten
   mit "../".

Nachweislich beide Fallstricke schon einmal in Produktion gehabt (siehe
Commit-Historie in aymanoul/fahrstation-) -- deshalb die Assertions unten:
sie brechen den Build laut und sofort, statt eine dritte stille Regression
zu riskieren, falls sich die Zahl oder Form dieser Referenzen in site/
jemals ändert.

Aufruf: python3 scripts/build-github-pages.py [ZIEL-VERZEICHNIS]
  ZIEL-VERZEICHNIS: Default ist ein Geschwisterordner "fahrstation-" neben
  diesem Repo-Checkout (../fahrstation- von hier aus). .git/ und
  README.md im Ziel werden nicht angefasst -- alles andere wird geleert
  und neu geschrieben.
"""
import os
import shutil
import sys

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = os.path.join(REPO_ROOT, "site")
ASSETS = os.path.join(REPO_ROOT, "assets")
DEFAULT_OUT = os.path.join(os.path.dirname(REPO_ROOT), "fahrstation-")

OUT = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_OUT

NESTED_PAGES = [
    "klasse-a", "klasse-b", "klasse-c", "klasse-d",
    "theorie", "ueber-uns", "impressum", "datenschutz",
]

# (Original-Attribut) -> (Ersatz für Root-Seiten, Ersatz für eine Ebene tief)
NAV_REWRITES = [
    ('href="/"',            'href="./"',            'href="../"'),
    ('href="/#ablauf"',     'href="#ablauf"',        'href="../#ablauf"'),
    ('href="/#kontakt"',    'href="#kontakt"',       'href="../#kontakt"'),
    ('href="/#vertrauen"',  'href="#vertrauen"',     'href="../#vertrauen"'),
    ('href="/datenschutz"', 'href="datenschutz/"',   'href="../datenschutz/"'),
    ('href="/impressum"',   'href="impressum/"',     'href="../impressum/"'),
    ('href="/klasse-a"',    'href="klasse-a/"',      'href="../klasse-a/"'),
    ('href="/klasse-b"',    'href="klasse-b/"',      'href="../klasse-b/"'),
    ('href="/klasse-c"',    'href="klasse-c/"',      'href="../klasse-c/"'),
    ('href="/klasse-d"',    'href="klasse-d/"',      'href="../klasse-d/"'),
    ('href="/theorie"',     'href="theorie/"',       'href="../theorie/"'),
]

# Die vier gemeinsamen Dateien: am Root bleiben sie bare-relativ (die
# Original-Schreibweise ist dort schon korrekt), eine Ebene tiefer
# brauchen sie "../".
ASSET_REWRITES = [
    ('href="design-tokens.css"', 'href="../design-tokens.css"'),
    ('href="styles.css"',        'href="../styles.css"'),
    ('href="manifest.json"',     'href="../manifest.json"'),
    ('src="script.js"',          'src="../script.js"'),
]


def read(path):
    with open(path, encoding="utf-8") as f:
        return f.read()


def write(path, content):
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)


def replace_exact(text, old, new, expected):
    n = text.count(old)
    if n != expected:
        raise SystemExit(
            f"Erwartet {expected} Treffer für {old!r}, gefunden {n} -- "
            f"site/ hat sich vermutlich geändert, Skript prüfen."
        )
    return text.replace(old, new)


def replace_min(text, old, new, minimum=1):
    n = text.count(old)
    if n < minimum:
        raise SystemExit(
            f"Erwartet mindestens {minimum} Treffer für {old!r}, gefunden {n} -- "
            f"site/ hat sich vermutlich geändert, Skript prüfen."
        )
    return text.replace(old, new)


def rewrite_page(html, depth):
    """depth: 0 = Root-Seite (index.html, 404.html), 1 = eine Ebene tief."""
    for old, root_new, nested_new in NAV_REWRITES:
        html = replace_min(html, old, root_new if depth == 0 else nested_new)
    if depth == 1:
        for old, new in ASSET_REWRITES:
            html = replace_exact(html, old, new, expected=1)
    else:
        # Root-Seiten liegen auf derselben Ebene wie assets/ selbst (nicht
        # eine Ebene darunter, wie das Original für Vercel/eine einzelne
        # Verzeichnisebene annimmt) -- "../assets/" ginge hier eine Ebene
        # zu weit nach oben und würde den Unterpfad-Präfix verlieren.
        html = replace_min(html, "../assets/", "assets/")
    return html


def main():
    if not os.path.isdir(SITE) or not os.path.isdir(ASSETS):
        raise SystemExit(f"site/ oder assets/ nicht gefunden unter {REPO_ROOT}")

    os.makedirs(OUT, exist_ok=True)
    for name in os.listdir(OUT):
        if name in (".git", "README.md"):
            continue
        p = os.path.join(OUT, name)
        shutil.rmtree(p) if os.path.isdir(p) else os.remove(p)

    # styles.css hat keine relativen url()-Referenzen -- unverändert kopierbar.
    shutil.copy2(os.path.join(SITE, "styles.css"), os.path.join(OUT, "styles.css"))

    # design-tokens.css, script.js, manifest.json liegen hier als einzelne
    # geteilte Kopien direkt NEBEN assets/ (nicht wie im Original eine Ebene
    # darunter) -- ihre "../assets/"-Referenzen (Font-url()s, Hero-Video-Pfad,
    # Icon-Pfade) müssen zu "assets/" werden.
    tokens_css = replace_min(
        read(os.path.join(SITE, "design-tokens.css")), "../assets/", "assets/"
    )
    write(os.path.join(OUT, "design-tokens.css"), tokens_css)

    script_js = replace_exact(
        read(os.path.join(SITE, "script.js")), "../assets/", "assets/", expected=1
    )
    write(os.path.join(OUT, "script.js"), script_js)

    manifest_json = replace_exact(
        read(os.path.join(SITE, "manifest.json")), "../assets/", "assets/", expected=2
    )
    write(os.path.join(OUT, "manifest.json"), manifest_json)

    shutil.copytree(ASSETS, os.path.join(OUT, "assets"))

    for name in ["index.html", "404.html"]:
        html = rewrite_page(read(os.path.join(SITE, name)), depth=0)
        write(os.path.join(OUT, name), html)

    for name in NESTED_PAGES:
        html = rewrite_page(read(os.path.join(SITE, f"{name}.html")), depth=1)
        write(os.path.join(OUT, name, "index.html"), html)

    # Verhindert, dass GitHub die Dateien durch Jekyll verarbeitet.
    write(os.path.join(OUT, ".nojekyll"), "")

    print(f"Build fertig: {OUT}")
    print("Nächste Schritte: dort git add -A, commit, push auf main.")


if __name__ == "__main__":
    main()
