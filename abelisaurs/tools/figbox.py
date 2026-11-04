#!/usr/bin/env python3
"""Where are the pictures on a page? Prints each embedded raster as (l, t, r, b) page fractions,
ready to paste into figs_table.py. Vector figures (trees, line drawings) are not listed:
use the grid trick for those. Usage: figbox.py <paper key> <page> [<page> ...]"""
import os, re, subprocess, sys, tempfile
HERE = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(HERE, 'crop_figs.py')).read()
P = eval(re.search(r'P = (\{.*?\n\})', src, re.S).group(1))
key = sys.argv[1]
pdf = os.path.join(HERE, '..', 'papers', P[key])
for pg in sys.argv[2:]:
    d = tempfile.mkdtemp()
    subprocess.run(['pdftohtml', '-xml', '-f', pg, '-l', pg, '-q', pdf, os.path.join(d, 'h')], capture_output=True)
    x = open(os.path.join(d, 'h.xml')).read()
    m = re.search(r'<page number="\d+" position="absolute" top="\d+" left="\d+" height="(\d+)" width="(\d+)"', x)
    H, W = float(m.group(1)), float(m.group(2))
    for im in re.finditer(r'<image top="(-?\d+)" left="(-?\d+)" width="(\d+)" height="(\d+)"', x):
        t, l, w, h = map(float, im.groups())
        if w * h < 0.02 * W * H: continue
        print(f'{key} p{pg}: ({l/W:.3f}, {t/H:.3f}, {(l+w)/W:.3f}, {(t+h)/H:.3f})')
