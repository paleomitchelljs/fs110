"""Cut Cope's two Elasmosaurus reconstructions out of his plates (Wikimedia Commons,
public domain), drop the paper, and keep the lines as ink with transparency.
1869: Elasmosaurus_Cope.jpg (Cope 1869, Pl. II fig. 1), head on the tail.
1870: Elasmosaurus_corrected.jpg (Cope's corrected 1870 plate).
Get both from https://commons.wikimedia.org/wiki/File:Elasmosaurus_Cope.jpg and
https://commons.wikimedia.org/wiki/File:Elasmosaurus_corrected.jpg, then:
  python3 make_elasmo.py <folder with the two jpgs> <bones/img>
Prints the measurements that js/cases/elasmo.js uses."""
import json, sys
import numpy as np
from PIL import Image, ImageFilter

SRC, OUT = sys.argv[1], sys.argv[2]
INK = (23, 33, 29)
SCALE = 0.8

def to_ink(gray, white_mask=None, gamma=0.85, thicken=False):
    a = np.asarray(gray, dtype=np.float32)
    bg = np.percentile(a, 60)                     # the paper
    lo, hi = 70.0, bg - 28.0
    alpha = np.clip((hi - a) / (hi - lo), 0, 1) ** gamma
    if thicken:                                   # fine lithograph lines vanish on a projector
        alpha = np.asarray(Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(3)), np.float32) / 255
    if white_mask is not None: alpha[white_mask] = 0
    rgba = np.zeros(a.shape + (4,), np.uint8)
    rgba[..., 0], rgba[..., 1], rgba[..., 2] = INK
    rgba[..., 3] = (alpha * 255).astype(np.uint8)
    return Image.fromarray(rgba, 'RGBA')

def shrink(im):
    return im.resize((round(im.width * SCALE), round(im.height * SCALE)), Image.LANCZOS)

# ---- 1869 ----
x0, y0, x1, y1 = 200, 40, 2800, 332
g = Image.open(f'{SRC}/Elasmosaurus_Cope.jpg').convert('L').crop((x0, y0, x1, y1))
H, W = g.height, g.width
yy, xx = np.mgrid[0:H, 0:W]
X, Y = xx + x0, yy + y0
other = (X >= 2480) & (Y >= 230)                                  # fig. 8
skull = (Y >= 46) & (Y <= 122) & (X <= 2790) & ((X >= 2642) | ((Y >= 87) & (X >= 2600)))
headless = shrink(to_ink(g, other | skull, 0.6, True))
sk_box = (2600 - x0, 46 - y0, 2790 - x0, 122 - y0)
sk = to_ink(g, other | ~skull, 0.6, True).crop(sk_box)
sk = shrink(sk)
headless.save(f'{OUT}/cope-1869-headless.png', optimize=True)
whole = shrink(to_ink(g, other, 0.6, True))      # head and all, for labelling a pan
whole.save(f'{OUT}/cope-1869.png', optimize=True)
sk.save(f'{OUT}/cope-1869-skull.png', optimize=True)

# where things are, in the saved (scaled) pixels
# The column's left tip: find the column's rows a little way in (where specks can't fool it),
# then walk left along those rows to the last inked pixel.
al = np.asarray(headless)[..., 3].astype(np.float32) / 255
strip = al[:, 40:120]
rows = np.where(strip.mean(axis=1) > 0.12)[0]
tip_y = float((strip[rows].sum(axis=1) * rows).sum() / strip[rows].sum())
band = al[int(rows.min()):int(rows.max()) + 1, :]
tip_x = int(np.where(band.max(axis=0) > 0.35)[0].min())
meta = {
  'w1869': headless.width, 'h1869': headless.height,
  'skull': {'w': sk.width, 'h': sk.height,
            'tail': [round(sk_box[0] * SCALE, 1), round(sk_box[1] * SCALE, 1)],
            'attach': [round((2642 - 2600) * SCALE, 1), round((70 - 46) * SCALE, 1)]},
  'neckTip': [tip_x, round(tip_y, 1)]
}

# ---- 1870 ----
x0, y0, x1, y1 = 20, 20, 2700, 452
g = Image.open(f'{SRC}/Elasmosaurus_corrected.jpg').convert('L').crop((x0, y0, x1, y1))
H, W = g.height, g.width
yy, xx = np.mgrid[0:H, 0:W]
X, Y = xx + x0, yy + y0
fig3b = ((X >= 580) & (X < 940) & (Y >= 172)) | ((X >= 850) & (X < 925) & (Y >= 165)) | ((X >= 940) & (X <= 1070) & (Y >= 230))   # follows the neck's underside
other = fig3b | ((X >= 2300) & (Y >= 290)) | ((X <= 640) & (Y >= 360))
c70 = shrink(to_ink(g, other, 0.7, True))
c70.save(f'{OUT}/cope-1870.png', optimize=True)
meta['w1870'], meta['h1870'] = c70.width, c70.height
print(json.dumps(meta))
