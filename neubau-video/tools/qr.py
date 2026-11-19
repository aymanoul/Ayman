#!/usr/bin/env python3
"""PayPal-QR-Code für die Abschlusskarte (per Code, nie per KI) + Prüfung mit zxing-cpp.
    <venv mit segno, zxing-cpp, pillow>/bin/python tools/qr.py  → assets/qr/paypal_qr.png (navy auf weiß)
"""
import os
import segno
import zxingcpp
from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
URL = 'https://www.paypal.com/qrcodes/managed/bf1079a8-bd1e-4110-9456-99a2161943f6?utm_source=payandgetpaid'
AUS = os.path.join(ROOT, 'assets', 'qr', 'paypal_qr.png')
qr = segno.make(URL, error='h', micro=False)
qr.save(AUS, scale=16, border=4, dark='#191a36', light='#ffffff')
erg = zxingcpp.read_barcodes(Image.open(AUS))
assert erg and erg[0].text == URL, f'QR-Prüfung fehlgeschlagen: {erg}'
# Probe wie im Video: verkleinert auf 300 px
klein = Image.open(AUS).convert('RGB').resize((300, 300), Image.LANCZOS)
erg2 = zxingcpp.read_barcodes(klein)
assert erg2 and erg2[0].text == URL, 'QR in 300 px nicht lesbar'
print('QR ok:', qr.version, qr.error, '| gelesen:', erg[0].text)
