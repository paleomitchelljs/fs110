#!/usr/bin/env python3
"""Cut the figures the deck shows out of the PDFs in ../papers/, and render the
whole pages the deck walks through (img/pages/). Writes js/dims.js.

A box is (left, top, right, bottom) as fractions of the page. It only has to be
roughly right: each crop is trimmed to its ink, so a box can include white margin
but must not include text. Needs poppler (pdftoppm) and Pillow.

  python3 tools/crop_figs.py          # all
  python3 tools/crop_figs.py mak-ed   # names containing this
"""
import os, sys, json, subprocess, tempfile
from PIL import Image, ImageChops
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from papers import pdf, HERE
OUT = os.path.join(HERE, '..', 'img')
DPI = 300

FIGS = {
    # Makovicky et al. 2026
    'mak-fig1': ('mak26', 2, (0.07, 0.055, 0.97, 0.322)),
    'mak-fig2a': ('mak26', 3, (0.03, 0.04, 0.97, 0.31)),
    'mak-fig2b': ('mak26', 3, (0.03, 0.325, 0.97, 0.605)),
    'mak-fig3': ('mak26', 4, (0.03, 0.05, 0.505, 0.525)),
    'mak-ed1': ('mak26', 8, (0.06, 0.05, 0.97, 0.635)),
    'mak-ed2': ('mak26', 9, (0.06, 0.04, 0.98, 0.475)),
    'mak-ed3': ('mak26', 10, (0.06, 0.05, 0.97, 0.475)),
    'mak-ed4': ('mak26', 11, (0.06, 0.05, 0.97, 0.60)),
    'mak-ed5': ('mak26', 12, (0.06, 0.05, 0.97, 0.605)),
    'mak-ed6': ('mak26', 13, (0.06, 0.05, 0.97, 0.60)),
    'mak-ed7': ('mak26', 14, (0.06, 0.05, 0.97, 0.664)),
    'mak-ed8': ('mak26', 15, (0.06, 0.05, 0.97, 0.61)),
    'mak-ed9': ('mak26', 16, (0.06, 0.05, 0.97, 0.39)),
    # Qin et al. 2021
    'qin-fig1': ('qin21', 3, (0.08, 0.09, 0.638, 0.385)),
    'qin-tab1':  ('qin21', 4, (0.0, 0.105, 1.0, 0.48)),
    'qin-fig3': ('qin21', 5, (0.0, 0.105, 0.83, 0.775)),
    # Xu et al. 2018
    'xu18-fig3': ('xu18', 5, (0.14, 0.08, 0.99, 0.43)),
    'xu18-fig4': ('xu18', 6, (0.02, 0.10, 0.615, 0.30)),
    # Xu et al. 2011
    'xu11-fig3': ('xu11', 3, (0.07, 0.04, 0.49, 0.145)),
    'xu11-fig4': ('xu11', 3, (0.58, 0.68, 0.93, 0.86)),
    # Choiniere et al. 2010
    'cho10-fig1': ('cho10', 2, (0.205, 0.03, 0.52, 0.35)),
    'cho10-fig2': ('cho10', 2, (0.635, 0.035, 0.95, 0.46)),
    'cho10-fig3': ('cho10', 3, (0.19, 0.04, 0.99, 0.335)),
    # Longrich & Currie 2009
    'lon09-fig12': ('lon09', 9, (0.05, 0.066, 0.98, 0.37)),
    'lon09-fig13': ('lon09', 9, (0.05, 0.445, 0.98, 0.905)),
    'lon09-fig14': ('lon09', 10, (0.07, 0.08, 0.98, 0.385)),
    # Lü et al. 2018
    'lu18-fig2': ('lu18', 2, (0.03, 0.715, 0.97, 0.905)),
    'lu18-fig4': ('lu18', 5, (0.17, 0.28, 0.73, 0.685)),
    # Lee et al. 2019
    'lee19-fig2': ('lee19', 2, (0.20, 0.40, 0.63, 0.535)),
}

# Whole pages shown on the left of a walk slide (and as the source of each lens).
PAGE_DPI = 200

def render(key, page, dpi, d):
    base = os.path.join(d, f'{key}-{page}-{dpi}')
    if not os.path.exists(base + '.png'):
        subprocess.run(['pdftoppm', '-r', str(dpi), '-png', '-f', str(page), '-l', str(page), '-singlefile', pdf(key), base],
                       check=True, stderr=subprocess.DEVNULL)
    return Image.open(base + '.png').convert('RGB')

def trim(im, pad=8):
    bg = Image.new('RGB', im.size, (255, 255, 255))
    diff = ImageChops.difference(im, bg).convert('L').point(lambda v: 255 if v > 22 else 0)
    box = diff.getbbox()
    if not box: return im
    l, t, r, b = box
    return im.crop((max(0, l - pad), max(0, t - pad), min(im.width, r + pad), min(im.height, b + pad)))

def pages_used():
    """Every (paper, page) a walk slide shows, read from js/lines.js."""
    path = os.path.join(HERE, '..', 'js', 'lines.js')
    if not os.path.exists(path): return set()
    txt = open(path).read()
    data = json.loads(txt[txt.index('{'):txt.rindex('}') + 1])
    return {(v['paper'], v['page']) for v in data.values()}

def main():
    want = sys.argv[1] if len(sys.argv) > 1 else ''
    os.makedirs(os.path.join(OUT, 'pages'), exist_ok=True)
    dims_path = os.path.join(HERE, '..', 'js', 'dims.js')
    dims = {}
    if os.path.exists(dims_path):
        t = open(dims_path).read(); dims = json.loads(t[t.index('{'):t.rindex('}') + 1])
    with tempfile.TemporaryDirectory() as d:
        for name, (key, page, (l, t, r, b)) in FIGS.items():
            if want not in name: continue
            im = render(key, page, DPI, d)
            W, H = im.size
            c = trim(im.crop((int(l * W), int(t * H), int(r * W), int(b * H))))
            c.save(os.path.join(OUT, name + '.jpg'), quality=86)
            dims[name + '.jpg'] = list(c.size)
            print(name, c.size)
        for key in ['lon09', 'cho10', 'xu11', 'xu18', 'lu18', 'lee19', 'qin21', 'mak26']:
            name = f'pages/{key}-thumb.jpg'
            if want and want not in name: continue
            im = render(key, 1, 40, d)
            im.save(os.path.join(OUT, name), quality=80)
            dims[name] = list(im.size)
        for key, page in sorted(pages_used()):
            name = f'pages/{key}-p{page}.jpg'
            if want and want not in name: continue
            im = render(key, page, PAGE_DPI, d)
            im.save(os.path.join(OUT, name), quality=80)
            dims[name] = list(im.size)
            print(name, im.size)
    with open(dims_path, 'w') as f:
        f.write('/* Pixel sizes of the pictures in img/, written by tools/crop_figs.py. */\nwindow.DIMS = ' + json.dumps(dims, sort_keys=True) + ';\n')

main()
