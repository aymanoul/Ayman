# Gebetsraum in 3D (Browser-Ansicht, 18.11.)

Link (privat, über „Teilen“ freigeben): https://claude.ai/artifact/3UjYjSZ2jRzN3Vtonpik1N

Neu bauen:
1. `iqama-video/.venv-blender/bin/python gebet-video/ansicht3d/export.py gebet-video/blender/gebetsraum.blend <ordner>/gebetsraum.glb`
   (ohne Kameras und Lichter)
2. GLB als Base64 in `gebetsraum-modell.js` (`window.GEBETSRAUM_GLB="…"`) – Artefakte liefern keine .glb aus.
3. `gebetsraum-3d.html` + `gebetsraum-modell.js` mit dem Artifact-Werkzeug veröffentlichen (gleicher Link: gleiche Datei).
Three.js r147 (jsDelivr), Achsen: Blender (x, y, z) → (x, z, −y). Nur Raum, keine Figuren.
