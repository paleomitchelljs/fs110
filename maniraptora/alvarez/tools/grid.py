#!/usr/bin/env python3
"""Render a page with a 5% grid, to read crop boxes by eye.
  python3 tools/grid.py mak26 3 out.png [dpi]"""
import sys, subprocess, tempfile, os
from PIL import Image, ImageDraw
sys.path.insert(0, os.path.dirname(__file__)); from papers import pdf
key, page, out = sys.argv[1], int(sys.argv[2]), sys.argv[3]
dpi = int(sys.argv[4]) if len(sys.argv) > 4 else 70
with tempfile.TemporaryDirectory() as d:
    subprocess.run(['pdftoppm', '-r', str(dpi), '-png', '-f', str(page), '-l', str(page), '-singlefile', pdf(key), d + '/p'], check=True, stderr=subprocess.DEVNULL)
    im = Image.open(d + '/p.png').convert('RGB')
w, h = im.size; dr = ImageDraw.Draw(im)
for i in range(1, 20):
    c = (255, 0, 0) if i % 2 == 0 else (255, 170, 170)
    dr.line([(w * i / 20, 0), (w * i / 20, h)], fill=c); dr.line([(0, h * i / 20), (w, h * i / 20)], fill=c)
    if i % 2 == 0:
        dr.text((w * i / 20 + 2, 2), str(i * 5), fill=(200, 0, 0)); dr.text((2, h * i / 20 + 2), str(i * 5), fill=(200, 0, 0))
im.save(out)
