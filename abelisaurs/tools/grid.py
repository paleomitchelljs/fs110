#!/usr/bin/env python3
"""Page with a 10% grid, to read crop fractions: grid.py out.jpg paper-key page [paper-key page ...]"""
import os, re, subprocess, sys, tempfile
from PIL import Image, ImageDraw
HERE = os.path.dirname(os.path.abspath(__file__))
P = eval(re.search(r'P = (\{.*?\n\})', open(os.path.join(HERE, 'crop_figs.py')).read(), re.S).group(1))
out = sys.argv[1]; args = sys.argv[2:]; ims = []
for k, pg in zip(args[::2], args[1::2]):
    d = tempfile.mkdtemp(); subprocess.run(['pdftoppm', '-r', '85', '-f', pg, '-l', pg, '-jpeg', os.path.join(HERE, '..', 'papers', P[k]), os.path.join(d, 'p')], check=True)
    im = Image.open(os.path.join(d, os.listdir(d)[0])).convert('RGB'); dr = ImageDraw.Draw(im)
    for i in range(1, 10):
        x, y = im.width * i / 10, im.height * i / 10
        dr.line([(x, 0), (x, im.height)], fill=(220, 40, 40), width=1); dr.line([(0, y), (im.width, y)], fill=(220, 40, 40), width=1)
        dr.text((x + 2, 2), '.%d' % i, fill=(220, 0, 0)); dr.text((2, y + 2), '.%d' % i, fill=(220, 0, 0))
    ims.append(im)
sh = Image.new('RGB', (sum(i.width for i in ims), max(i.height for i in ims)), 'white'); x = 0
for i in ims: sh.paste(i, (x, 0)); x += i.width
sh.save(out, quality=82)
