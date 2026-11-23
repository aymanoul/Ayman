"""Fotomaterialien aus freien Poly-Haven-Texturen (CC0, assets/tex/ph, geladen mit tools/polyhaven_laden.py).
Projektion: Box-Projektion auf Objektkoordinaten (Objekte liegen im Weltursprung) → keine UVs nötig.
ph(name, textur, meter, drehung=0, farbe=None, f=0.0, hell=0.0, bump=0.25)"""
import math
import os
import bpy

PH = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'tex', 'ph')


def _hex(h):
    h = h.lstrip('#'); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c) + (1.0,)


def _bild(nt, datei, vec, farbe=True):
    tx = nt.nodes.new('ShaderNodeTexImage')
    tx.image = bpy.data.images.load(datei, check_existing=True)
    if not farbe:
        tx.image.colorspace_settings.name = 'Non-Color'
    tx.projection = 'BOX'; tx.projection_blend = 0.2
    nt.links.new(vec, tx.inputs['Vector'])
    return tx


def _mittel(img):
    import numpy as np
    px = np.empty(len(img.pixels), dtype=np.float32); img.pixels.foreach_get(px)
    px = px.reshape(-1, 4)[:, :3]
    if img.colorspace_settings.name.lower().startswith('srgb'):
        px = np.where(px <= 0.04045, px / 12.92, ((px + 0.055) / 1.055) ** 2.4)
    return tuple(float(v) for v in px.mean(axis=0))


def ph(name, textur, meter, drehung=0.0, farbe=None, f=0.0, hell=0.0, bump=0.25, rough_add=0.0, detail=1.0):
    m = bpy.data.materials.new(name); m.use_nodes = True
    nt = m.node_tree; b = nt.nodes['Principled BSDF']
    tc = nt.nodes.new('ShaderNodeTexCoord'); mp = nt.nodes.new('ShaderNodeMapping')
    mp.inputs['Scale'].default_value = (1 / meter, 1 / meter, 1 / meter)
    mp.inputs['Rotation'].default_value = (0, 0, math.radians(drehung))
    nt.links.new(tc.outputs['Object'], mp.inputs['Vector'])
    vec = mp.outputs['Vector']
    d = os.path.join(PH, textur + '_diff.jpg')
    tx = _bild(nt, d, vec)
    col = tx.outputs['Color']
    if farbe and f > 0:
        # Textur auf ihren Mittelwert normieren und mit der Zielfarbe multiplizieren → Details bleiben, Farbe stimmt
        mittel = _mittel(tx.image)
        ziel = _hex(farbe)
        mix = nt.nodes.new('ShaderNodeMix'); mix.data_type = 'RGBA'; mix.blend_type = 'MULTIPLY'; mix.clamp_result = True
        mix.inputs['Factor'].default_value = f
        mix.inputs['B'].default_value = tuple(min(ziel[i] / max(mittel[i], 1e-3), 8.0) for i in range(3)) + (1.0,)
        nt.links.new(col, mix.inputs['A']); col = mix.outputs['Result']
        if detail < 1.0:      # Textur nur teilweise zeigen (z. B. neuer, sauberer Naturstein)
            mx = nt.nodes.new('ShaderNodeMix'); mx.data_type = 'RGBA'; mx.inputs['Factor'].default_value = detail
            mx.inputs['A'].default_value = ziel
            nt.links.new(col, mx.inputs['B']); col = mx.outputs['Result']
    if hell:
        bc = nt.nodes.new('ShaderNodeBrightContrast'); bc.inputs['Bright'].default_value = hell
        nt.links.new(col, bc.inputs['Color']); col = bc.outputs['Color']
    nt.links.new(col, b.inputs['Base Color'])
    r = os.path.join(PH, textur + '_rough.jpg')
    if os.path.exists(r):
        rx = _bild(nt, r, vec, False)
        if rough_add:
            ad = nt.nodes.new('ShaderNodeMath'); ad.operation = 'ADD'; ad.use_clamp = True; ad.inputs[1].default_value = rough_add
            nt.links.new(rx.outputs['Color'], ad.inputs[0]); nt.links.new(ad.outputs[0], b.inputs['Roughness'])
        else:
            nt.links.new(rx.outputs['Color'], b.inputs['Roughness'])
    for ext in ('png', 'jpg'):
        h = os.path.join(PH, f'{textur}_disp.{ext}')
        if os.path.exists(h) and bump > 0:
            hx = _bild(nt, h, vec, False)
            bp = nt.nodes.new('ShaderNodeBump'); bp.inputs['Strength'].default_value = bump; bp.inputs['Distance'].default_value = 0.03
            nt.links.new(hx.outputs['Color'], bp.inputs['Height']); nt.links.new(bp.outputs['Normal'], b.inputs['Normal'])
            break
    return m
