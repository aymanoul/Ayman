# Phase 7 – Animation und Rendern (begonnen)

## Bewegungsprobe Hook + Straße (ohne Stimmen)

- Szene: `web/shots/film.js` – spielt die Einstellungen aus `web/sheets/board.js` nacheinander ab (Zeitplan = Shotliste)
  und bewegt pro Bild: Gehen mit Fortbewegung, weiche Posen-Übergänge (alle Knoten werden gemischt), Hand auf die Schulter
  wird eingeblendet, Atmen, Nicken, Mund nach Platzhalter-Lautstärke, Kamera: Fahrt (`dolly`), Zoom (`zoomTo`), Schwenk (`pan`).
- Bewegungsangaben je Shot: `MOTION` in `film.js` (bisher S01–S12, sonst langsame Fahrt).
- `web/shots/board.js` gibt dafür `placeCam`, `figs`, `allFigs`, `P` nach außen.
- Ton: `tools/mix.py` + `audio/mix_bewegungsprobe.json` (Straße, Adhan-Platzhalter gedämpft wie durch die offene Tür,
  Whoosh an den Hook-Schnitten, Schritte, Stoff, Tür, Raumklang). Video + Ton → `out/phase7/bewegungsprobe.mp4`.

## Wenn die neuen Stimmen da sind

1. `tools/transcribe.py` auf A und B → Zeilen per Wort-Zeitmarken den Kennungen A01…/B09 zuordnen, an den 1,5-s-Pausen schneiden.
2. Shot-Dauern an die echten Zeilenlängen anpassen (Zeitplan aus den Stimmen statt aus der Shotliste).
3. Lippenbewegung: Lautstärke-Hüllkurve je Zeile (RMS, 30 fps) statt `fakeAmp`; nur der Sprecher bewegt den Mund.
4. Untertitel aus den Wort-Zeitmarken (Stil b), Karten zu den Belegzeilen.
5. 15-Sekunden-Probe mit Ton zur Freigabe, danach Shot für Shot.

## Probe Hook + Straße mit Stimmen (10.11.2026)

- `film.js`: Zeitplan `DUR` (Shot-Dauern) und `VOICE` (Zeile, Startzeit) für S01–S12 aus den echten Aufnahmen; Lippen aus
  `lines.json` (nur der Sprecher), Untertitel Stil b aus Wortzeiten (max. 3 Wörter/18 Zeichen, neue Gruppe nach Satzende
  und bei Zitatanfang), Hook-Titel 0–3,1 s.
- Ton: `audio/mix_probe_hook_strasse.json` → `out/phase7/probe_ton.wav`; Video `probe_video.mp4`; zusammen `probe_hook_strasse.mp4`
  (loudnorm −14 LUFS).
- Behoben: Beim Überblenden wurde die Drehung der ganzen Figur mitgemischt (Euler kippt bei |y| > 90°) → Kamera stand hinter B.
  Jetzt wird `root` nicht gemischt und die Kamera nutzt die gespeicherte Blickrichtung.

## Ganzes Video (10.11.2026)

```bash
python3 tools/schedule.py && python3 tools/build_mix.py && python3 tools/mix.py audio/mix_film.json out/phase7/film_ton.wav
node tools/render.mjs film --from 23.6 --to 60 --out out/phase7/teil_a.mp4
node tools/render.mjs film --from 60 --to 100 --out out/phase7/teil_b.mp4
node tools/render.mjs film --from 100 --to 147.34 --out out/phase7/teil_c.mp4
cd out/phase7 && printf "file 'probe_video.mp4'\nfile 'teil_a.mp4'\nfile 'teil_b.mp4'\nfile 'teil_c.mp4'\n" > film_teile.txt
ffmpeg -f concat -safe 0 -i film_teile.txt -c copy film_video.mp4
ffmpeg -i film_video.mp4 -i film_ton.wav -map 0:v -map 1:a -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11 -ar 48000 -c:a aac -b:a 192k -shortest gebet_video_entwurf.mp4
```
Kamera neigt sich bei Karten (`show`-Faktor, `tilt` je Shot). Zuhörer nicken. ﷻ nach „Allah“ außerhalb von Zitaten.
