#!/usr/bin/env python3
"""Fetch the PhyloPic silhouettes the deck pairs with fossils, into img/sil-*.svg,
and add their sizes to js/dims.js. Mirrored ones are flipped to face the same way
as the fossil beside them. Credits go in the slide captions (content.js).

  python3 tools/silhouettes.py
"""
import os, re, json, subprocess
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'img')

# name: (PhyloPic image uuid, taxon, artist, license, mirror)
SIL = {
    'yi':           ('97b7d025-5dfe-4f9e-ad8f-45f036080ede', 'Yi qi', 'Emily Willoughby', 'CC BY-SA 3.0', False),
}


def main():
    dims_path = os.path.join(HERE, '..', 'js', 'dims.js')
    t = open(dims_path).read(); dims = json.loads(t[t.index('{'):t.rindex('}') + 1])
    for name, (uuid, taxon, artist, lic, mirror) in SIL.items():
        url = f'https://images.phylopic.org/images/{uuid}/vector.svg'
        svg = subprocess.run(['curl', '-sf', '-m', '60', url], capture_output=True, text=True, check=True).stdout
        vb = [float(x) for x in re.search(r'viewBox="([^"]+)"', svg).group(1).split()]
        w, h = vb[2], vb[3]
        # px sizes so <img> scales from the viewBox alone
        svg = re.sub(r'width="[^"]+" height="[^"]+"', f'width="{w:.0f}" height="{h:.0f}"', svg, count=1)
        svg = re.sub(r'<metadata>.*?</metadata>', f'<metadata>{taxon} · {artist} · {lic} · phylopic.org/images/{uuid}</metadata>', svg, flags=re.S)
        if mirror:
            body = svg.index('>', svg.index('<svg')) + 1
            end = svg.rindex('</svg>')
            svg = svg[:body] + f'<g transform="translate({w:.0f},0) scale(-1,1)">' + svg[body:end] + '</g>' + svg[end:]
        fn = f'sil-{name}.svg'
        open(os.path.join(OUT, fn), 'w').write(svg)
        dims[fn] = [round(w), round(h)]
        print(fn, round(w), round(h), '(mirrored)' if mirror else '')
    with open(dims_path, 'w') as f:
        f.write('/* Pixel sizes of the pictures in img/, written by tools/crop_figs.py. */\nwindow.DIMS = ' + json.dumps(dims, sort_keys=True) + ';\n')


if __name__ == '__main__':
    main()
