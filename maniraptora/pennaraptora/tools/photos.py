#!/usr/bin/env python3
"""Fetch openly licensed photos and restorations from Wikimedia Commons into img/,
at 960 px wide, and add their sizes to js/dims.js. Credits go in the captions.

  python3 tools/photos.py
"""
import os, io, json, time, subprocess, urllib.parse
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'img')
UA = 'fs110-deck/1.0 (educational slides)'

# file name: (Commons file title, artist, license)
PHOTOS = {
    'life-meilong.jpg': ('Meilong mmartyniuk wiki.png', 'Matt Martyniuk', 'CC BY-SA 3.0'),
    'care-croc.jpg':    ('Guarding the nest.jpg', 'Eliza68', 'CC BY-SA 4.0'),          # female saltwater crocodile at her nest, Daintree River
    'care-ostrich.jpg': ('Struthio camelus -Serengeti, Tanzania -female on nest-8.jpg', 'Joachim Huber', 'CC BY-SA 2.0'),
    'care-rhea.jpg':    ("Rhea on nest at Kisak's Cinnamon Hill.jpg", 'Paul F. Kisak', 'CC BY-SA 4.0'),
    'pack-wolves.jpg':  ('Wolves Kill.jpg', 'Patrick Bell', 'CC BY 2.0'),  # two wolves at a deer carcass
    'pack-komodo.jpg':  ('Komodo Dragon Eating Rinca.jpg', 'Mats Stafseng Einarsen', 'CC BY 2.5'),  # young Komodo dragon at a water buffalo carcass
    'life-zhenyuanlong.jpg': ('Zhenyuanlong life restoration.jpg', 'Emily Willoughby', 'CC BY-SA 4.0'),
}


def main():
    dims_path = os.path.join(HERE, '..', 'js', 'dims.js')
    t = open(dims_path).read(); dims = json.loads(t[t.index('{'):t.rindex('}') + 1])
    for fn, (title, artist, lic) in PHOTOS.items():
        url = 'https://commons.wikimedia.org/wiki/Special:FilePath/' + urllib.parse.quote(title.replace(' ', '_')) + '?width=960'
        raw = subprocess.run(['curl', '-sfL', '-m', '120', '-A', UA, url], capture_output=True, check=True).stdout
        im = Image.open(io.BytesIO(raw))
        if im.mode in ('RGBA', 'LA', 'P'):
            im = im.convert('RGBA'); bg = Image.new('RGBA', im.size, (255, 255, 255, 255)); bg.alpha_composite(im); im = bg
        im = im.convert('RGB')
        im.save(os.path.join(OUT, fn), quality=86)
        dims[fn] = list(im.size)
        print(fn, *im.size, artist, lic)
        time.sleep(3)
    with open(dims_path, 'w') as f:
        f.write('/* Pixel sizes of the pictures in img/, written by tools/crop_figs.py. */\nwindow.DIMS = ' + json.dumps(dims, sort_keys=True) + ';\n')


if __name__ == '__main__':
    main()
