#!/usr/bin/env python3
"""Contact sheet of crops to check edges: montage.py out.jpg name1 name2 ... (names without .jpg)"""
import sys, os
from PIL import Image, ImageDraw
out, names = sys.argv[1], sys.argv[2:]
T = 330; cols = 5
ims = []
for n in names:
    p = os.path.join('img', n + '.jpg')
    if not os.path.exists(p): p = os.path.join('img', n + '.png')
    im = Image.open(p).convert('RGB'); s = min(T / im.height, 380 / im.width); im = im.resize((int(im.width * s), int(im.height * s)))
    ims.append((n, im))
rows = (len(ims) + cols - 1) // cols
sheet = Image.new('RGB', (cols * 390, rows * (T + 24)), 'white'); d = ImageDraw.Draw(sheet)
for i, (n, im) in enumerate(ims):
    x, y = (i % cols) * 390 + 5, (i // cols) * (T + 24)
    d.text((x, y + 4), n, fill='black'); sheet.paste(im, (x, y + 20)); d.rectangle([x, y + 20, x + im.width, y + 20 + im.height], outline='#c33')
sheet.save(out, quality=82)
