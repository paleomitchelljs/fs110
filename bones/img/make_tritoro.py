"""Cut the Triceratops (A) and Torosaurus (B) skulls out of the two-panel figure,
drop the white background (and the white showing through the frill openings
and orbits), and remove the panel letters and scale bars. Both skulls keep the
figure's shared scale: the two scale bars are the same length (23 px).
  python3 make_tritoro.py <figure.png> <bones/img>
Prints each skull's size in px, which js/content.js uses."""
import json, sys
from collections import deque
import numpy as np
from PIL import Image

src, out = sys.argv[1], sys.argv[2]
im = np.asarray(Image.open(src).convert('RGB')).astype(np.float32)
H, W, _ = im.shape
L = im.mean(axis=2)
for x0, y0, x1, y1 in [(10, 18, 32, 40), (382, 18, 404, 40), (60, 219, 90, 231), (442, 219, 472, 231)]:
    L[y0:y1, x0:x1] = 255                       # panel letters and scale bars

# Background: near-white regions big enough not to be a highlight on the bone.
white = L > 238
seen = np.zeros_like(white)
bg = np.zeros_like(white)
for y in range(H):
    for x in range(W):
        if not white[y, x] or seen[y, x]:
            continue
        q, comp = deque([(y, x)]), []
        seen[y, x] = True
        while q:
            cy, cx = q.popleft(); comp.append((cy, cx))
            for ny, nx in ((cy + 1, cx), (cy - 1, cx), (cy, cx + 1), (cy, cx - 1)):
                if 0 <= ny < H and 0 <= nx < W and white[ny, nx] and not seen[ny, nx]:
                    seen[ny, nx] = True; q.append((ny, nx))
        if len(comp) > 120:
            ys, xs = zip(*comp); bg[ys, xs] = True

# Soft edge: a one-pixel band around the background fades with lightness.
near = bg.copy()
near[1:, :] |= bg[:-1, :]; near[:-1, :] |= bg[1:, :]; near[:, 1:] |= bg[:, :-1]; near[:, :-1] |= bg[:, 1:]
alpha = np.ones((H, W), np.float32)
band = near & ~bg
alpha[band] = np.clip((246 - L[band]) / 50, 0, 1)
alpha[bg] = 0

rgba = np.dstack([im, alpha * 255]).astype(np.uint8)
meta = {}
for name, (x0, x1) in {'triceratops': (0, 356), 'torosaurus': (356, W)}.items():
    a = alpha[:, x0:x1] > 0.05
    ys, xs = np.where(a)
    box = (x0 + xs.min() - 2, ys.min() - 2, x0 + xs.max() + 3, ys.max() + 3)
    piece = Image.fromarray(rgba).crop(box)
    piece.save(f'{out}/{name}.png', optimize=True)
    meta[name] = [piece.width, piece.height]
print(json.dumps(meta))
