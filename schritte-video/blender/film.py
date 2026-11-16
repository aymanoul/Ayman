#!/usr/bin/env python3
"""Der Film „Jeder Schritt zählt“ in Blender: jedes Bild wird nach dem Zeitplan gestellt und gerendert.

    ../gebet-video/.venv-blender/bin/python blender/film.py --von 0 --bis 65.5 [--fps 30] [--breite 720] [--samples 8] [--aus out/roh]
    → <aus>/f_00000.png …  (Bildnummer = runde(t · fps))

Zeitplan: audio/zeitplan.json (tools/zeitplan.py). Mund nach der Lautstärke-Hüllkurve: assets/audio/zeilen/lines.json.
Einblendungen (Zähler, Karten, Untertitel, Handy-Lupe …) kommen getrennt aus web/overlay.js und werden mit ffmpeg darübergelegt.
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
import szene as SZ                     # noqa: E402
from mathutils import Vector           # noqa: E402

arg = lambda n, d: sys.argv[sys.argv.index('--' + n) + 1] if '--' + n in sys.argv else d
VON, BIS = float(arg('von', 0)), float(arg('bis', 999))
FPS, BREITE, SAMPLES = int(arg('fps', 30)), int(arg('breite', 720)), int(arg('samples', 8))
AUS = os.path.join(ROOT, arg('aus', 'out/roh'))
os.makedirs(AUS, exist_ok=True)

ZP = json.load(open(os.path.join(ROOT, 'audio', 'zeitplan.json')))
LINES = json.load(open(os.path.join(ROOT, 'assets', 'audio', 'zeilen', 'lines.json')))
S = SZ.aufbauen()
sc = S['scene']
sc.cycles.samples = SAMPLES
sc.render.use_persistent_data = True                  # Szene zwischen Bildern im Speicher halten (schneller)
sc.cycles.max_bounces = 3; sc.cycles.diffuse_bounces = 2; sc.cycles.glossy_bounces = 1
sc.render.resolution_x, sc.render.resolution_y = BREITE, BREITE * 16 // 9
A, B, ph = S['A'], S['B'], S['handy']
SPUR_START, SPUR_ENDE = Vector((0.55, SZ.GEHWEG_Y + 0.6, 0)), Vector((0.55, -1.4, 0))
spur = SZ.fussspur(S['coll'], SPUR_START, SPUR_ENDE, 24)
wege = SZ.wege(S['coll'])
SZ.handy_bild(S, os.path.join(ROOT, 'out', 'phase2', 'handy_display.png'))
ease = lambda x: (lambda t: t * t * (3 - 2 * t))(max(0.0, min(1.0, x)))
lerp = lambda a, b, k: a + (b - a) * k
SCHRITT = 0.55                         # Meter pro Schritt (ein Fuß)


def stimme(t):
    """(Zeile, Sekunde in der Zeile) der gerade gesprochenen Zeile oder None."""
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


def sichtbar(a=True, b=True, handy=True):
    bpy.data.collections['A_Qamis'].hide_render = not a
    bpy.data.collections['B_Hemd'].hide_render = not b
    ph.hide_render = not (b and handy)
    S['mundA'].hide_render = not a
    S['mundB'].hide_render = not b


def handy_an_hand():
    ph.parent = B; ph.parent_type = 'BONE'; ph.parent_bone = 'Hand.R'
    ph.matrix_parent_inverse.identity(); ph.location = (0.03, -0.075, 0.0); ph.rotation_euler = (math.radians(90), 0, math.radians(90))


def tuer(k):
    for o in bpy.data.objects:
        if o.name == 'Tuer_Haupt_links':
            o.rotation_euler.z = math.radians(-100 * k)
        if o.name == 'Tuer_Haupt_rechts':
            o.rotation_euler.z = math.radians(100 * k)


def spur_bis(y, nachglimmen=True, voll=1.0):
    """Abdrücke bis zur Höhe y sichtbar; der jüngste leuchtet am stärksten (glimmt nach)."""
    st = []
    for i, (ob, _) in enumerate(spur):
        if ob.location.y < y - 0.15:
            alter = (y - ob.location.y) / SCHRITT
            st.append(voll * (max(0.35, 1 - 0.06 * alter) if nachglimmen else 1.0))
        else:
            st.append(0.0)
    SZ.abdruck_leuchten(spur, st)


def gehen(arm, start, richtung_grad, tempo, tl, zusatz=None, phase0=0.0):
    """Figur geht ab `start` in Blickrichtung (Grad wie rot_z) mit `tempo` m/s; tl = Zeit seit Beginn."""
    a = math.radians(richtung_grad)
    d = Vector((math.sin(a), -math.cos(a), 0))
    weg = tempo * tl
    ph_ = phase0 + weg / SCHRITT
    p = Vector(start) + d * weg
    posen = [SZ.geh_pose(ph_)] + ([zusatz] if zusatz else [])
    SZ.stell(arm, *posen, loc=(p.x, p.y, SZ.huepf(ph_)), rot_z=richtung_grad)
    return p


# ------------------------------------------------------------------ Shots: f(u = 0..1, tl = Sekunden im Shot, d = Dauer)
def S1(u, tl, d):     # Hook: B geht mit dem Handy auf die Moschee zu, über die Schulter
    sichtbar(False, True)
    ziel = Vector((0, -2.0, 0))
    pos0 = Vector((-6.8, SZ.GEHWEG_Y + 0.9, 0))
    h = (ziel - pos0).normalized()
    rot = math.degrees(math.atan2(h.x, -h.y))
    pos = gehen(B, pos0, rot, 0.75, tl, SZ.HANDY_HALTEN_GEHEN)
    SZ.handy_zum_gesicht(S, B)
    r = Vector((h.y, -h.x, 0))
    cam = pos - h * 1.9 + r * 0.75 + Vector((0, 0, 1.62))
    SZ.kamera(S, cam, pos + h * 6.0 + Vector((0, 0, 2.6)), 30)


def S2(u, tl, d):     # Kamera zieht auf: B auf dem Gehweg vor der Moschee
    sichtbar(False, True)
    gehen(B, (-1.0, SZ.GEHWEG_Y, 0), 90, 0.8, tl, SZ.HANDY_HALTEN_GEHEN)
    k = ease(u)
    SZ.kamera(S, (lerp(2.4, 3.6, k), lerp(-17.5, -21.0, k), lerp(1.5, 1.4, k)), (-0.4, -10.0, 2.6), lerp(36, 30, k))


T_B02 = None


def S3(u, tl, d):     # A am Vordach, B bleibt stehen – Schuss (A02) / Gegenschuss (B02)
    sichtbar(True, True)
    SZ.stell(A, SZ.ERKLAEREN if stimme_bei('A02') else {}, loc=(0.3, -3.2, 0), rot_z=8)
    SZ.stell(B, SZ.HANDY_HALTEN, {'Kopf': (2, 0, 0), 'Hals': (0, 0, 0)}, loc=(1.9, -6.0, 0), rot_z=210)
    if aktuell < start_von('B02') - 0.1:
        SZ.kamera(S, (2.4 - 0.15 * u, -8.6 + 0.3 * u, 1.62), (0.3, -3.2, 1.45), 40)
    else:                                        # über As Schulter auf B
        SZ.kamera(S, (-0.55, -2.45, 1.7), (1.9, -6.0, 1.45), 38)


def S4(u, tl, d):     # nah auf A, langsam heran
    sichtbar(True, False)
    SZ.stell(A, SZ.ERKLAEREN, {'Kopf': (0, 0, 6 + 4 * math.sin(tl * 1.3))}, loc=(0.3, -3.2, 0), rot_z=8)
    SZ.kamera(S, (lerp(-1.3, -0.95, ease(u)), lerp(-5.5, -5.0, ease(u)), 1.62), (0.3, -3.2, 1.6), 55)


def S5(u, tl, d):     # Kernbild: B geht vom Gehweg über den Hof, die Spur leuchtet, seitliche Fahrt
    sichtbar(False, True)
    y0, y1 = SPUR_START.y - 0.3, -5.0
    tempo = (y1 - y0) / d
    p = gehen(B, (0.55, y0, 0), 180, tempo, tl, SZ.HANDY_HALTEN_GEHEN)
    spur_bis(p.y)
    SZ.kamera(S, (4.6, p.y + 1.0, 1.7), (0.3, p.y - 1.6, 0.7), 26)


def S6(u, tl, d):     # nah auf B, er schaut auf seine Füße
    sichtbar(False, True)
    SZ.stell(B, SZ.AUF_FUESSE, {'Oberarm.R': (-8, 0, 0), 'Unterarm.R': (-20, 0, 0), 'Kopf': (22 + 6 * ease(u * 2), 0, 0)}, loc=(0.55, -5.0, 0), rot_z=180)
    spur_bis(-5.0, nachglimmen=False)
    SZ.kamera(S, (1.7, lerp(-2.6, -2.9, u), 1.3), (0.5, -5.6, 0.95), 38)


def S7(u, tl, d):     # Draufsicht auf den Hof, Kamera steigt langsam
    sichtbar(False, True)
    SZ.stell(B, SZ.AUF_FUESSE, loc=(0.55, -5.0, 0), rot_z=180)
    spur_bis(-5.0, nachglimmen=False)
    SZ.kamera(S, (0.6, -9.0, lerp(9.5, 12.5, ease(u))), (0.55, -8.0, 0.0), 40)


def S8(u, tl, d):     # B schaut auf sein Handy (Hintergrund; das Display kommt als Einblendung)
    sichtbar(False, True)
    SZ.stell(B, SZ.HANDY_HALTEN, loc=(0.55, -5.0, 0), rot_z=180)
    SZ.handy_zum_gesicht(S, B)
    spur_bis(-5.0, nachglimmen=False)
    SZ.kamera(S, (0.95, -5.45, 1.8), (0.4, -3.2, 1.3), 30)


def S9(u, tl, d):     # große Totale von oben: fünf Wege leuchten nacheinander auf
    sichtbar(False, False)
    for k, (ob, m, _) in enumerate(wege):
        an = ease((u - 0.06 - k * 0.11) / 0.08)
        ob.hide_render = an <= 0.001
        m.node_tree.nodes['Principled BSDF'].inputs['Emission Strength'].default_value = 4.0 * an
    SZ.kamera(S, (0.0, lerp(-28.0, -31.0, u), lerp(60.0, 63.0, u)), (0.0, -9.0, 0.0), 26)


def S10(u, tl, d):    # B steckt das Handy ein und geht neben A zur Tür
    sichtbar(True, True, handy=u < 0.18)
    pa = gehen(A, (-0.45, -6.2, 0), 180, 0.85, tl, phase0=0.3)
    pb = gehen(B, (0.45, -6.4, 0), 180, 0.85, tl, {'Oberarm.R': (6, 0, 0), 'Unterarm.R': (-14, 0, 0)} if u > 0.18 else SZ.HANDY_HALTEN_GEHEN, phase0=1.1)
    spur_bis(pb.y, voll=0.7)
    SZ.kamera(S, (2.6, lerp(-11.0, -10.0, u), 1.7), (0.0, pb.y + 3.0, 1.6), 32)


def S11(u, tl, d):    # beide gehen durch die offene Tür, die Abdrücke leuchten nach; danach Schlussbild
    sichtbar(True, True, handy=False)
    tuer(ease(tl / 1.2))
    gehdauer = d - 2.6
    tg = min(tl, gehdauer)
    pa = gehen(A, (-0.35, -3.6, 0), 180, 0.85, tg, phase0=0.6)
    pb = gehen(B, (0.4, -3.8, 0), 180, 0.85, tg, phase0=1.6)
    spur_bis(pb.y)
    if tl > gehdauer:                            # sie sind drin: Abdrücke leuchten gleichmäßig nach
        SZ.abdruck_leuchten(spur, [1.0] * len(spur))
    SZ.kamera(S, (0.3, lerp(-9.5, -8.6, u), 1.45), (0.0, -1.0, 1.7), 30)


SHOTS = {'S1': S1, 'S2': S2, 'S3': S3, 'S4': S4, 'S5': S5, 'S6': S6, 'S7': S7, 'S8': S8, 'S9': S9, 'S10': S10, 'S11': S11}
aktuell = 0.0


def start_von(z):
    return next(t0 for zz, t0 in ZP['stimmen'] if zz == z)


def stimme_bei(z):
    v = stimme(aktuell)
    return v is not None and v[0] == z


def stellen(t):
    global aktuell
    aktuell = t
    shot = next((s for s in ZP['shots'] if s['t0'] <= t < s['t0'] + s['t']), ZP['shots'][-1])
    for o in bpy.data.objects:
        if o.name.startswith('Weg_'):
            o.hide_render = True
    SZ.abdruck_leuchten(spur, [0] * len(spur))
    tuer(0.0)
    handy_an_hand()
    tl = t - shot['t0']
    SHOTS[shot['id']](tl / shot['t'], tl, shot['t'])
    mund(t)
    return shot['id']


if __name__ == '__main__':
    n0, n1 = int(round(VON * FPS)), int(round(min(BIS, ZP['dauer']) * FPS))
    t_start = time.time()
    for n in range(n0, n1):
        f = os.path.join(AUS, f'f_{n:05d}.png')
        if os.path.exists(f):
            continue
        sid = stellen(n / FPS)
        sc.render.filepath = f
        bpy.ops.render.render(write_still=True)
        k = n - n0 + 1
        if k % 10 == 0:
            print(f'Bild {n} ({sid}) · {(time.time() - t_start) / k:.1f} s/Bild', flush=True)
    print(f'fertig {n0}–{n1}', flush=True)
