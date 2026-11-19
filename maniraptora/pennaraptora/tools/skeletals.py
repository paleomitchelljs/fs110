#!/usr/bin/env python3
"""Fetch the openly licensed skeletal diagrams the deck pairs with fossils, from
Wikimedia Commons, into img/skel-*.png, and add their sizes to js/dims.js.

Each is cut to one animal: a crop box, then white boxes over anything else left in
it (labels, scale bars, other specimens). The white background connected to the
edge becomes transparent, so the drawing sits on the slide and inverts cleanly in
dark mode. Credits go in the slide captions (content.js).

A box is (left, top, right, bottom) as fractions of the original image.

  python3 tools/skeletals.py
"""
import os, io, json, time, subprocess
from PIL import Image, ImageDraw
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'img')
UA = 'fs110-deck/1.0 (educational slides)'
C = 'https://upload.wikimedia.org/wikipedia/commons/'

# name: (Commons path, artist, license, crop, white-outs, mirror[, seeds])
# seeds: points (fractions of the crop) inside white areas the drawing encloses
# that are background too, such as between the legs and the ground line
SKEL = {
    # Sinovenator changii holotype IVPP V12615; white = bones drawn from it
    'sinovenator': (C + '6/6f/Sinovenator_changii_headden.gif', 'Jaime Headden', 'CC BY 3.0',
                    (0, 0, 1, 1), [(0, 0.60, 0.29, 0.92)], False, [(0.585, 0.85)]),
    # Microraptor gui holotype IVPP V13352, the lowest of the three
    'microraptor': (C + 'b/b9/Microraptor_Skeletons_by_Qilong.jpg', 'Jaime Headden', 'CC BY 3.0',
                    (0, 0.30, 1, 1), [(0.30, 0, 1, 0.58), (0.60, 0.72, 1, 0.88)], False),
    # Oviraptor philoceratops; "Missing parts are based on Citipati osmolskae" (artist's note)
    'oviraptor':   (C + 'b/b4/Oviraptor_philoceratops_skeletal%2C_2022.png', 'Ivan Iofrida', 'CC BY-SA 4.0',
                    (0.07, 0.15, 0.95, 0.87), [(0.60, 0, 1, 0.205), (0.74, 0, 1, 0.322), (0.08, 0.80, 0.23, 0.87)], False),
    # Archaeopteryx, the London specimen, fifth of Headden's seven
    'archaeopteryx': (C + '5/55/Archaeopteryx_skeletals.jpg', 'Jaime Headden', 'CC BY 3.0',
                      (0.651, 0.5, 0.7885, 1), [(0.785, 0.752, 1, 0.94)], False),
    # Austroraptor cabazai, top of Headden's sheet of four unenlagiines
    'austroraptor': (C + '7/7b/Unenlagiinae.jpg', 'Jaime Headden', 'CC BY 3.0',
                     (0, 0.08, 1, 0.595), [(0, 0, 1, 0.1), (0.40, 0.10, 0.60, 0.18), (0.13, 0.52, 0.31, 0.585), (0.69, 0.40, 1, 0.65)], False),
    # Anchiornis huxleyi, IVPP V14378 and LPM-B00169 (labels on the drawing)
    'anchiornis': (C + '4/47/Anchiornis_by_Qilong.jpg', 'Jaime Headden', 'CC BY 3.0',
                   (0, 0.04, 0.96, 0.93), [(0.68, 0.36, 1, 0.72)], False),
    # Velociraptor, bottom of Headden's sheet of velociraptorines
    'velociraptor': (C + '3/38/Velociraptorines.jpg', 'Jaime Headden', 'CC BY 3.0',
                     (0, 0.66, 0.86, 0.985), [(0.5, 0.9, 1, 1)], False),
}


def fetch(url):
    return subprocess.run(['curl', '-sfL', '-m', '120', '-A', UA, url], capture_output=True, check=True).stdout


def cut(raw, crop, outs, mirror, seeds=()):
    im = Image.open(io.BytesIO(raw))
    if im.mode in ('RGBA', 'LA', 'P'):
        im = im.convert('RGBA'); bg = Image.new('RGBA', im.size, (255, 255, 255, 255)); bg.alpha_composite(im); im = bg
    im = im.convert('RGB')
    W, H = im.size
    d = ImageDraw.Draw(im)
    for l, t, r, b in outs:
        d.rectangle([l * W, t * H, r * W, b * H], fill=(255, 255, 255))
    im = im.crop((round(crop[0] * W), round(crop[1] * H), round(crop[2] * W), round(crop[3] * H)))
    if mirror:
        im = im.transpose(Image.FLIP_LEFT_RIGHT)
    # pad, flood the outside white, make it transparent
    w, h = im.size
    pad = Image.new('RGB', (w + 2, h + 2), (255, 255, 255)); pad.paste(im, (1, 1))
    ImageDraw.floodfill(pad, (0, 0), (255, 0, 255), thresh=40)
    for fx, fy in seeds:
        ImageDraw.floodfill(pad, (round(fx * w) + 1, round(fy * h) + 1), (255, 0, 255), thresh=40)
    px = pad.load()
    out = Image.new('RGBA', pad.size)
    o = out.load()
    for y in range(pad.size[1]):
        for x in range(pad.size[0]):
            p = px[x, y]
            o[x, y] = (0, 0, 0, 0) if p == (255, 0, 255) else (p[0], p[1], p[2], 255)
    out = out.crop(out.getbbox())
    if out.width > 1600:
        out = out.resize((1600, round(out.height * 1600 / out.width)), Image.LANCZOS)
    return out


def main():
    dims_path = os.path.join(HERE, '..', 'js', 'dims.js')
    t = open(dims_path).read(); dims = json.loads(t[t.index('{'):t.rindex('}') + 1])
    for name, (url, artist, lic, crop, outs, mirror, *seeds) in SKEL.items():
        im = cut(fetch(url), crop, outs, mirror, seeds[0] if seeds else ())
        fn = f'skel-{name}.png'
        im.save(os.path.join(OUT, fn), optimize=True)
        dims[fn] = list(im.size)
        print(fn, *im.size, artist, lic)
        time.sleep(3)
    with open(dims_path, 'w') as f:
        f.write('/* Pixel sizes of the pictures in img/, written by tools/crop_figs.py. */\nwindow.DIMS = ' + json.dumps(dims, sort_keys=True) + ';\n')


if __name__ == '__main__':
    main()
