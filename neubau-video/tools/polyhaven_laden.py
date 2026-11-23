#!/usr/bin/env python3
"""Lädt freie Fototexturen (CC0) von Poly Haven nach assets/tex/ph/ (1k: Farbe, Rauheit, Höhe).
Aufruf aus neubau-video/:  python3 tools/polyhaven_laden.py"""
import json, os, urllib.request
H = {'User-Agent': 'neubau-video-texturen/1.0'}
laden = lambda u: urllib.request.urlopen(urllib.request.Request(u, headers=H), timeout=60).read()
ZIEL = os.path.join(os.path.dirname(__file__), '..', 'assets', 'tex', 'ph'); os.makedirs(ZIEL, exist_ok=True)
NAMEN = ['roof_slates_02', 'grey_roof_tiles', 'clay_roof_tiles_02', 'beige_wall_001', 'plastered_wall_02', 'grey_plaster',
         'asphalt_02', 'gravel_floor', 'large_sandstone_blocks', 'red_brick_03', 'concrete_wall_008', 'leafy_grass',
         'concrete_tiles', 'brick_wall_02', 'forest_leaves_02', 'concrete_pavers_02']
for n in NAMEN:
    try:
        info = json.loads(laden(f'https://api.polyhaven.com/files/{n}'))
    except Exception as e:
        print('fehlt', n, e); continue
    for art, schluessel in (('diff', 'Diffuse'), ('rough', 'Rough'), ('disp', 'Displacement')):
        try:
            url = info[schluessel]['1k']['jpg']['url'] if 'jpg' in info[schluessel]['1k'] else info[schluessel]['1k']['png']['url']
        except KeyError:
            continue
        datei = os.path.join(ZIEL, f'{n}_{art}.jpg' if url.endswith('jpg') else f'{n}_{art}.png')
        if not os.path.exists(datei):
            open(datei, 'wb').write(laden(url))
    print('ok', n)
