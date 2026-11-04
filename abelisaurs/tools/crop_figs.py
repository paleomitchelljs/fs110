#!/usr/bin/env python3
"""Cut the figure panels the deck shows out of the PDFs in abelisaurs/papers/.

Needs poppler (pdftoppm, pdfinfo). No other packages. The papers are
gitignored; the cropped images in img/ are committed (fair use for teaching).

A box is (left, top, right, bottom) as fractions of the page, so it does not
depend on the render resolution.

  python3 abelisaurs/tools/crop_figs.py            # all
  python3 abelisaurs/tools/crop_figs.py zanno09    # names containing this
"""
import os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PAPERS = os.path.join(HERE, '..', 'papers')
OUT = os.path.join(HERE, '..', 'img')
DPI = 200

P = {
    'sereno': '2004-sereno-rugops.pdf',
    'rogers': '2003-rogers-majungatholus.pdf',
    'persons': '2011-persons-carnotaurus.pdf',
    'burch': '2012-burch-majungasaurus.pdf',
    'tortosa': '2014-tortosa-arcovenator.pdf',
    'gates': '2016-gates-theropoda.pdf',
    'grillo': '2017-grillo-pycnonemosaurus.pdf',
    'longrich': '2017-longrich-chenanisaurus.pdf',
    'wang': '2017-wang-limusaurus.pdf',
    'delcourt': '2018-delcourt-ceratosauria.pdf',
    'demic': '2019-demic-majungasaurus.pdf',
    'langer': '2019-langer-vespersaurus.pdf',
    'hendrickx': '2021-hendrickx-carnotaurus.pdf',
    'baiano23': '2023-baiano-aucasaurus.pdf',
    'baiano24': '2024-baiano-abelisauridae.pdf',
    'pol': '2024-pol-koleken.pdf',
    'velandia': '2025-velandia-vitosaura.pdf',
    'mazzetta': '2009-mazzetta-carnotaurus.pdf',
    'canale': '2009-canale-skorpiovenator.pdf',
    'gianechini': '2021-gianechini-llukalkan.pdf',
}

# name: (paper, page, (l, t, r, b))
FIGS = {}
exec(open(os.path.join(HERE, 'figs_table.py')).read())

def page_size(pdf, page):
    out = subprocess.check_output(['pdfinfo', '-f', str(page), '-l', str(page), pdf], text=True)
    m = re.search(r'Page\s+%d size:\s+([\d.]+) x ([\d.]+)' % page, out)
    return float(m.group(1)), float(m.group(2))

def crop(name, key, page, box):
    pdf = os.path.join(PAPERS, P[key])
    w, h = page_size(pdf, page)
    pw, ph = w / 72 * DPI, h / 72 * DPI
    l, t, r, b = box
    x, y, W, H = int(pw * l), int(ph * t), int(pw * (r - l)), int(ph * (b - t))
    stem = os.path.join(OUT, name)
    subprocess.check_call(['pdftoppm', '-jpeg', '-jpegopt', 'quality=88', '-singlefile', '-r', str(DPI),
                           '-f', str(page), '-l', str(page), '-x', str(x), '-y', str(y), '-W', str(W), '-H', str(H), pdf, stem])

if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    want = sys.argv[1:]
    for name, (key, page, box) in FIGS.items():
        if want and not any(s in name for s in want):
            continue
        crop(name, key, page, box)
        print('ok', name)
