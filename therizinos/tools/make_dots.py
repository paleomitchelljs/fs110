#!/usr/bin/env python3
"""Draw the 4,500-dot picture for the last slide (img/bonebed-dots.png).
Grey dots are Falcarius; the ~1% in yellow are bones not called Falcarius in the field.
Needs Pillow."""
import os, random
from PIL import Image, ImageDraw
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'img', 'bonebed-dots.png')
COLS, ROWS, PX, R = 100, 45, 14, 5
random.seed(7)
other = set(random.sample(range(COLS * ROWS), round(COLS * ROWS * 0.01)))
im = Image.new('RGB', (COLS * PX + 20, ROWS * PX + 20), (249, 251, 250))
d = ImageDraw.Draw(im)
for i in range(COLS * ROWS):
    x, y = 10 + (i % COLS) * PX + PX // 2, 10 + (i // COLS) * PX + PX // 2
    if i in other:
        d.ellipse([x - R - 2, y - R - 2, x + R + 2, y + R + 2], fill=(242, 183, 5), outline=(23, 33, 29), width=2)
    else:
        d.ellipse([x - R, y - R, x + R, y + R], fill=(120, 130, 126))
im.save(OUT)
