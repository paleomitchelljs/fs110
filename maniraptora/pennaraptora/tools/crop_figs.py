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
    # groups
    'mei-fig1':   ('xn04', 2, (0.08, 0.35, 0.90, 0.893)),
    'mei2-fig1':  ('gao12', 2, (0.09, 0.07, 0.70, 0.755)),
    'zhen-fig1':  ('lu15', 2, (0.255, 0.055, 0.67, 0.307)),
    'wulong-fig1':('poust20', 6, (0.085, 0.09, 0.915, 0.726)),
    'arch-fig1':  ('oc25a', 2, (0.064, 0.07, 0.42, 0.643)),
    'arch-ed9':   ('oc25a', 18, (0.198, 0.058, 0.811, 0.403)),
    'yi-fig1':    ('xu15', 2, (0.06, 0.07, 0.487, 0.635)),
    'yi-fig3':    ('xu15', 3, (0.06, 0.355, 0.487, 0.82)),
    'caud-fig1':  ('tal18', 2, (0.257, 0.055, 0.931, 0.381)),
    'caud-fig7':  ('tal18', 7, (0.257, 0.565, 0.931, 0.797)),
    'vel-fig10':  ('bin25', 21, (0.052, 0.479, 0.943, 0.898)),
    # phylogeny
    'xia-fig4':   ('xia11', 5, (0.02, 0.06, 0.47, 0.585)),
    'bru-fig1':   ('bru14', 2, (0.09, 0.103, 0.633, 0.885)),
    'bru-fig2':   ('bru14', 3, (0.45, 0.153, 0.912, 0.879)),
    'pei-fig1':   ('pei20', 5, (0.163, 0.126, 0.849, 0.912)),
    'pei-fig2':   ('pei20', 7, (0.155, 0.126, 0.857, 0.686)),
    'pei-fig4':   ('pei20', 10, (0.084, 0.126, 0.627, 0.588)),
    'har-fig18':  ('har19', 39, (0.051, 0.107, 0.943, 0.842)),
    'zel-tf1':    ('zel08', 5, (0.117, 0.742, 0.506, 0.846)),
    'zel-tf2':    ('zel08', 6, (0.082, 0.407, 0.471, 0.748)),
    'nov-fig2':   ('nov09', 5, (0.245, 0.152, 0.78, 0.643)),
    # behavior
    'fun-fig2':   ('fun16', 2, (0.257, 0.485, 0.81, 0.769)),
    'fun-fig3':   ('fun16', 5, (0.257, 0.055, 0.931, 0.445)),
    'fun-fig7':   ('fun16', 9, (0.162, 0.055, 0.936, 0.383)),
    'fre-fig2':   ('fre20', 5, (0.15, 0.385, 0.851, 0.78)),
    'per-fig11':  ('per14', 14, (0.091, 0.067, 0.971, 0.438)),
    'li-fig4':    ('li10', 4, (0.358, 0.358, 0.942, 0.615)),
    'cla-fig6':   ('cla26', 11, (0.053, 0.119, 0.945, 0.479)),
    'fan-fig7':   ('fan26', 14, (0.096, 0.166, 0.929, 0.879)),
    'ma-fig3':    ('ma20', 5, (0.074, 0.497, 0.64, 0.939)),
    # reproduction
    'bi-fig1':    ('bi21', 18, (0.19, 0.137, 0.81, 0.644)),
    'bi-fig4':    ('bi21', 21, (0.19, 0.137, 0.81, 0.696)),
    'jin-fig1':   ('jin20', 4, (0.072, 0.072, 0.928, 0.749)),
    'jin-fig7':   ('jin20', 13, (0.073, 0.735, 0.485, 0.903)),
    'tan15-fig3': ('tan15', 13, (0.055, 0.094, 0.855, 0.557)),
    'tan15-fig6': ('tan15', 16, (0.055, 0.094, 0.716, 0.417)),
    'wie-fig1':   ('wie17', 5, (0.297, 0.105, 0.948, 0.511)),
    'wie-fig4':   ('wie17', 11, (0.297, 0.105, 0.948, 0.441)),
    'tan18-fig1': ('tan18', 2, (0.127, 0.051, 0.91, 0.759)),
    'tan18-fig2': ('tan18', 3, (0.077, 0.265, 0.471, 0.484)),
    'var18-fig1': ('var18', 2, (0.257, 0.055, 0.931, 0.38)),
    'var02-fig1': ('var02', 4, (0.123, 0.095, 0.878, 0.498)),
    'yan-fig4':   ('yan19', 46, (0.19, 0.137, 0.81, 0.41)),
    'yan-fig9':   ('yan19', 50, (0.19, 0.137, 0.81, 0.417)),
    'hog-fig1':   ('hog23', 3, (0.21, 0.046, 0.79, 0.196)),
    'hog-fig2':   ('hog23', 5, (0.193, 0.046, 0.635, 0.471)),
    'hog-fig3':   ('hog23', 6, (0.234, 0.055, 0.766, 0.138)),
    'vj-fig2':    ('vj16', 5, (0.202, 0.09, 0.798, 0.465)),
    'vj-fig7':    ('vj16', 21, (0.202, 0.09, 0.798, 0.397)),
    # feathers and flight
    'kia-fig2':   ('kia24', 4, (0.058, 0.042, 0.698, 0.812)),
    'kia-fig5':   ('kia24', 6, (0.06, 0.042, 0.94, 0.484)),
    'xu17-fig5':  ('xu17', 7, (0.19, 0.06, 0.81, 0.569)),
    'xu17-fig7':  ('xu17', 9, (0.06, 0.045, 0.505, 0.226)),
    'dec16-fig2': ('dec16', 15, (0.03, 0.06, 0.97, 0.795)),
    'dec20-fig6': ('dec20', 9, (0.093, 0.128, 0.726, 0.49)),
    'wu-fig1':    ('wu24', 4, (0.297, 0.105, 0.932, 0.796)),
    'voe-fig1':   ('voe18', 2, (0.088, 0.572, 0.912, 0.847)),
    'voe-fig2':   ('voe18', 4, (0.206, 0.068, 0.625, 0.854)),
    # brains and the bird line
    'bal-fig1':   ('bal13', 1, (0.24, 0.385, 0.80, 0.835)),
    'bal-fig2':   ('bal13', 2, (0.505, 0.05, 0.97, 0.503)),
    'tor-fig3':   ('tor21', 3, (0.102, 0.641, 0.898, 0.918)),
    'tor-fig5':   ('tor21', 4, (0.106, 0.416, 0.902, 0.818)),
    'bro-fig2':   ('bro25', 5, (0.099, 0.126, 0.912, 0.419)),
    'lee-fig2':   ('lee14', 4, (0.02, 0.615, 0.97, 0.85)),
    'lee-fig3':   ('lee14', 5, (0.07, 0.39, 0.94, 0.86)),
    'xu23-fig3':  ('xu23', 5, (0.06, 0.04, 0.97, 0.685)),
    # second round of papers, 2026-11-19
    'cla99-fig1':  ('cla99', 4, (0.07, 0.105, 0.975, 0.615)),
    'cla99-fig13': ('cla99', 19, (0.13, 0.735, 0.97, 0.842)),
    'fan12-fig3':  ('fan12', 4, (0.095, 0.499, 0.906, 0.856)),
    'var08-fig1':  ('var08', 1, (0.084, 0.512, 0.939, 0.897)),
    'bir13-fig1':  ('bir13', 2, (0.53, 0.025, 0.905, 0.335)),
    'li08-fig2':   ('li08', 4, (0.086, 0.068, 0.486, 0.422)),
    'li08-fig3':   ('li08', 4, (0.3, 0.651, 0.916, 0.903)),
    'tsu21-fig5':  ('tsu21', 6, (0.07, 0.084, 0.93, 0.301)),
    'agn19-fig2':  ('agn19', 4, (0.179, 0.089, 0.818, 0.597)),
    'agn19-fig8':  ('agn19', 11, (0.226, 0.089, 0.77, 0.815)),
    'li12-fig1':   ('li12', 3, (0.272, 0.505, 0.94, 0.947)),
    'li12-fig4':   ('li12', 5, (0.062, 0.047, 0.638, 0.581)),
    # third round, 2026-11-19
    'rb07-fig1':   ('rb07', 2, (0.148, 0.075, 0.865, 0.856)),
    'rb07-fig5':   ('rb07', 15, (0.14, 0.084, 0.879, 0.449)),
    'rb07-fig6':   ('rb07', 25, (0.109, 0.075, 0.915, 0.341)),
    'xb25-fig1':   ('xb25', 3, (0.294, 0.05, 0.706, 0.452)),
    'xb25-fig2':   ('xb25', 4, (0.05, 0.02, 0.905, 0.53)),
    'wz23-fig4':   ('wz23', 6, (0.06, 0.05, 0.94, 0.515)),
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
        for name, (key, page, box) in FIGS.items():
            if want not in name or box is None: continue
            im = render(key, page, DPI, d)
            W, H = im.size; l, t, r, b = box
            c = trim(im.crop((int(l * W), int(t * H), int(r * W), int(b * H))))
            c.save(os.path.join(OUT, name + '.jpg'), quality=86)
            dims[name + '.jpg'] = list(c.size)
            print(name, c.size)
        for key in []:
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
