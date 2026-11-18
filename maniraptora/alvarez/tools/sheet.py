#!/usr/bin/env python3
"""Tile screenshots 2 across into one image: tools/sheet.py OUT.png a.png b.png ..."""
import sys
from PIL import Image
out, fs = sys.argv[1], sys.argv[2:]
ims = [Image.open(f) for f in fs]
cols = 2; rows = (len(ims) + 1) // 2
s = Image.new('RGB', (1600 * cols, 900 * rows), 'black')
for i, im in enumerate(ims): s.paste(im, ((i % cols) * 1600, (i // cols) * 900))
s.resize((1200 * cols, 675 * rows)).save(out)
