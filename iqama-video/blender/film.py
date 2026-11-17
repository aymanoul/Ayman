#!/usr/bin/env python3
"""Der Film „Zwischen Adhan und Iqama“ in Blender: jedes Bild wird nach dem Zeitplan gestellt und gerendert.

    .venv-blender/bin/python blender/film.py --von 0 --bis 62 [--fps 15] [--breite 540] [--samples 8] [--aus out/roh]
    .venv-blender/bin/python blender/film.py --punkte      (nichts rendern: Daten je Bild → audio/punkte.json)
    → <aus>/f_00000.png …  (Bildnummer = runde(t · fps)); fertige Bilder werden übersprungen.

Aufbau und Shots wie im freigegebenen Storyboard (blender/storyboard.py, wird importiert). Zeitplan: audio/zeitplan.json.
Mund nach der Lautstärke-Hüllkurve (assets/audio/zeilen/lines.json). Einblendungen kommen getrennt (web/overlay.js).
"""
import json
import math
import os
import sys
import time
import bpy

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, '..')
sys.path.insert(0, HERE)
import storyboard as SB                # noqa: E402  (Szene, Licht-Tor, Lichtpunkte, Aufstellung)
from mathutils import Vector           # noqa: E402

D, SZ = SB.D, SB.SZ
arg = lambda n, d: sys.argv[sys.argv.index('--' + n) + 1] if '--' + n in sys.argv else d
VON, BIS = float(arg('von', 0)), float(arg('bis', 999))
FPS, BREITE, SAMPLES = int(arg('fps', 15)), int(arg('breite', 540)), int(arg('samples', 8))
AUS = os.path.join(ROOT, arg('aus', 'out/roh'))
os.makedirs(AUS, exist_ok=True)

ZP = json.load(open(os.path.join(ROOT, 'audio', 'zeitplan.json')))
LINES = json.load(open(os.path.join(ROOT, 'assets', 'audio', 'zeilen', 'lines.json')))
S, sc = SB.S, SB.sc
A, B, ph = SB.A, SB.B, SB.ph
sc.cycles.samples = SAMPLES
sc.render.use_persistent_data = True
sc.cycles.max_bounces = 3; sc.cycles.diffuse_bounces = 2; sc.cycles.glossy_bounces = 1
sc.render.resolution_x, sc.render.resolution_y = BREITE, BREITE * 16 // 9
ease = lambda x: (lambda t: t * t * (3 - 2 * t))(max(0.0, min(1.0, x)))
lerp = lambda a, b, k: a + (b - a) * k
aktuell = 0.0


def start_von(z):
    return next(t0 for zz, t0 in ZP['stimmen'] if zz == z)


def stimme(t):
    for z, t0 in ZP['stimmen']:
        if t0 <= t < t0 + LINES[z]['dauer']:
            return z, t - t0
    return None


def mund(t):
    v = stimme(t)
    for who, m in (('A', S['mundA']), ('B', S['mundB'])):
        a = 0.0
        if v and v[0][0] == who:
            env = LINES[v[0]]['env']
            a = env[min(len(env) - 1, int(v[1] * 30))]
        SZ.mund_auf(m, a)


def mische(p, q, k):
    """Zwei Posen weich mischen (Grad je Knochen)."""
    out = {}
    for b in set(p) | set(q):
        a0, a1 = p.get(b, (0, 0, 0)), q.get(b, (0, 0, 0))
        out[b] = tuple(lerp(x, y, k) for x, y in zip(a0, a1))
    return out


def kam(pos0, pos1, ziel0, ziel1, fov0, fov1, k):
    k = ease(k)
    SZ.kamera(S, Vector(pos0).lerp(Vector(pos1), k), Vector(ziel0).lerp(Vector(ziel1), k), SB.objektiv(lerp(fov0, fov1, k)))


def wipp(tl, f=0.9, a=3.0):
    """Leichte Kopfbewegung beim Zuhören/Sprechen."""
    return {'Kopf': (a * math.sin(tl * f), a * 0.6 * math.sin(tl * f * 0.7 + 1), 0)}


def tor_an(k):
    SB.zeige(SB.TOR, k > 0.01)
    for o in SB.TOR.children_recursive:
        if o.type == 'MESH':
            n = o.active_material.node_tree.nodes.get('Emission')
            if n is not None:
                n.inputs['Strength'].default_value = (5.0 if 'Rahmen' in o.name else 1.2) * k
        elif o.type == 'LIGHT':
            o.data.energy = 70 * k


def punkte_an(ks):
    SB.zeige(SB.PUNKT, any(k > 0.01 for k in ks))
    for i, k in enumerate(ks):
        kugel = bpy.data.objects[f'Lichtpunkt_{i}']; licht = bpy.data.objects[f'Lichtpunkt_{i}_Licht']
        kugel.hide_render = k <= 0.01; licht.hide_render = k <= 0.01
        kugel.scale = (max(0.01, k),) * 3
        licht.data.energy = 25 * k


# ------------------------------------------------------------------ Shots: f(u = 0..1, tl = Sekunden im Shot, d = Dauer)
def S1(u, tl, d):     # Totale von hinten, Adhan klingt aus; langsame Fahrt
    SB.grundstellung(); SB.wartende(); SB.nur_b(D.HANDY, wipp(tl, 0.6, 2))
    kam((1.3, -5.2, 2.1), (1.0, -4.4, 1.95), (-1.3, 0.6, 0.8), (-1.4, 0.6, 0.8), 50, 46, u)


def S2(u, tl, d):     # langsame Fahrt auf B
    SB.grundstellung(); SB.wartende(3); SB.nur_b(D.HANDY, wipp(tl, 0.6, 2))
    kam((-0.1, 2.3, 1.5), (-0.5, 1.35, 1.35), (-1.75, -0.45, 0.78), (-1.75, -0.45, 0.72), 40, 38, u)


def S3(u, tl, d):     # nah auf B mit Handy (B01)
    SB.grundstellung(); SB.nur_b(D.HANDY, wipp(tl, 1.1, 3))
    k = SB.kopf(B)
    kam((k.x + 0.6, k.y + 1.7, k.z + 0.12), (k.x + 0.5, k.y + 1.5, k.z + 0.1), (k.x, k.y, k.z - 0.22), (k.x, k.y, k.z - 0.22), 34, 34, u)


def S4(u, tl, d):     # A neben B: Zwei-Shot (A02, B02)
    SB.grundstellung()
    a_pose = [D.SPRECHEN] if aktuell < start_von('B02') else [wipp(tl, 0.8, 2)]
    b_pose = [D.HANDY] if aktuell < start_von('B02') else [mische(D.HANDY, D.HANDY_UNTEN, 0.4), {'Kopf': (6, 0, 0)}]
    SB.a_b(b_pose, a_pose)
    kam((-0.35, 1.6, 1.15), (-0.45, 1.45, 1.12), (-1.4, -0.45, 0.7), (-1.4, -0.45, 0.7), 40, 38, u)


def S5(u, tl, d):     # nah A, leicht von der Seite (A03)
    SB.grundstellung(); SB.a_b([D.HANDY_UNTEN], [D.SPRECHEN, wipp(tl, 0.9, 2)])
    k = SB.kopf(A)
    kam((k.x + 1.25, k.y + 1.25, k.z + 0.02), (k.x + 1.05, k.y + 1.05, k.z + 0.02), (k.x, k.y, k.z - 0.18), (k.x, k.y, k.z - 0.18), 34, 34, u)


def S6(u, tl, d):     # Kernbild: Raum dämmert, Display geht aus, Licht-Tor erscheint (A04 + Lesezeit)
    k = ease(tl / 1.6)
    SB.grundstellung(dimmen=lerp(1.0, 0.45, k), display='handy_display_dunkel' if tl > 0.6 else 'handy_display')
    SB.wartende(); SB.a_b([D.HANDY_UNTEN])
    tor_an(ease((tl - 0.4) / 1.4))
    kam((0.3, -1.6, 1.2), (0.3, -0.9, 1.25), (0.0, 5.0, 1.85), (0.0, 5.0, 1.9), 54, 50, u)


def S7(u, tl, d):     # nah B, das Handy sinkt (B03)
    SB.grundstellung(display='handy_display_dunkel')
    SB.a_b([mische(D.HANDY, D.HANDY_UNTEN, ease(tl / 1.2)), {'Kopf': (lerp(26, 6, ease(tl / 1.2)), 0, 0)}])
    k = SB.kopf(B)
    kam((k.x + 0.75, k.y + 1.6, k.z + 0.08), (k.x + 0.7, k.y + 1.5, k.z + 0.08), (k.x, k.y, k.z - 0.25), (k.x, k.y, k.z - 0.25), 34, 34, u)


def S8(u, tl, d):     # Halbtotale von hinten: Wartende (A05)
    SB.grundstellung(display='handy_display_dunkel'); SB.wartende(); SB.a_b([D.HANDY_UNTEN])
    kam((0.2, -2.6, 1.8), (0.15, -1.9, 1.7), (0.0, 3.4, 0.75), (0.0, 3.4, 0.8), 46, 44, u)


def S9(u, tl, d):     # B schaut aufs Handy (Bildschirmzeit als Einblendung davor) (B04)
    SB.grundstellung(); SB.nur_b(D.HANDY, wipp(tl, 0.7, 2))
    k = SB.kopf(B)
    kam((k.x + 0.6, k.y + 1.7, k.z + 0.12), (k.x + 0.6, k.y + 1.6, k.z + 0.12), (k.x, k.y, k.z - 0.22), (k.x, k.y, k.z - 0.22), 34, 34, u)


def S10(u, tl, d):    # Draufsicht, fünf Lichtpunkte leuchten nacheinander (A06)
    SB.grundstellung(); SB.a_b([], [], handy=False)
    punkte_an([ease((u - 0.05 - i * 0.09) / 0.07) for i in range(5)])
    kam((-0.4, 0.2, 3.3), (-0.4, 0.5, 3.3), (-0.3, 2.3, 0.0), (-0.3, 2.5, 0.0), 86, 84, u)


def S11(u, tl, d):    # B steckt das Handy in die Tasche (B05)
    SB.grundstellung()
    k = ease(tl / 1.3)
    SB.a_b([mische(D.HANDY_UNTEN, D.TASCHE, k)], handy=k < 0.98)
    kk = SB.kopf(B)
    kam((kk.x + 0.75, kk.y + 1.75, kk.z - 0.05), (kk.x + 0.7, kk.y + 1.65, kk.z - 0.05), (kk.x, kk.y, kk.z - 0.4), (kk.x, kk.y, kk.z - 0.4), 38, 38, u)


def S12(u, tl, d):    # A und B heben die Hände zum Bittgebet; vorn der Imam von hinten (A07), danach Schlussbild
    SB.grundstellung(); SB.wartende(3); SB.imam()
    k = ease((tl - 0.3) / 1.2)
    SB.a_b([mische({}, D.DUA, k)], [mische({}, D.DUA, k)], handy=False)
    kam((-3.5, 0.9, 1.25), (-3.1, 1.3, 1.3), (-1.35, -0.5, 0.8), (-1.2, -0.3, 0.82), 42, 46, u)


SHOTS = {f'S{i}': globals()[f'S{i}'] for i in range(1, 13)}


def stellen(t):
    global aktuell
    aktuell = t
    shot = next((s for s in ZP['shots'] if s['t0'] <= t < s['t0'] + s['t']), ZP['shots'][-1])
    tor_an(0.0); punkte_an([0] * 5)
    tl = t - shot['t0']
    SHOTS[shot['id']](tl / shot['t'], tl, shot['t'])
    mund(t)
    return shot['id']


def punkte():
    """--punkte: Bildpunkte der Lichtpunkte (S10) je Bild für die Beschriftungen → audio/punkte.json."""
    out = []
    for n in range(int(round(ZP['dauer'] * 30))):
        sid = stellen(n / 30)
        d = {'t': round(n / 30, 4), 'shot': sid}
        if sid == 'S10':
            d['punkte'] = [SZ.bildpunkt(S, (x, y, 0.14)) for x, y in SB.PUNKTE]
        out.append(d)
    json.dump(out, open(os.path.join(ROOT, 'audio', 'punkte.json'), 'w'))
    print('punkte:', len(out), 'Bilder')


if __name__ == '__main__' and '--punkte' in sys.argv:
    punkte()
elif __name__ == '__main__':
    n0, n1 = int(round(VON * FPS)), int(round(min(BIS, ZP['dauer']) * FPS))
    t_start = time.time(); k = 0
    for n in range(n0, n1):
        f = os.path.join(AUS, f'f_{n:05d}.png')
        if os.path.exists(f):
            continue
        sid = stellen(n / FPS)
        sc.render.filepath = f
        bpy.ops.render.render(write_still=True)
        k += 1
        if k % 10 == 0:
            print(f'Bild {n} ({sid}) · {(time.time() - t_start) / k:.1f} s/Bild', flush=True)
    print(f'fertig {n0}–{n1}', flush=True)
