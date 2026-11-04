#!/usr/bin/env python3
"""Cut the figure panels the deck shows out of the PDFs in therizinos/papers/.

Needs poppler (pdftoppm, pdfinfo). No other packages. The papers are
gitignored; the cropped images in img/ are committed (fair use for teaching).

A box is (left, top, right, bottom) as fractions of the page, so it does not
depend on the render resolution.

  python3 therizinos/tools/crop_figs.py            # all
  python3 therizinos/tools/crop_figs.py zanno09    # names containing this
"""
import os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PAPERS = os.path.join(HERE, '..', 'papers')
OUT = os.path.join(HERE, '..', 'img')
DPI = 200

P = {
    'xu99': '1999-xu-beipiaosaurus_inexpectus.pdf',
    'kun08': '2008-kundrat-therizinosauroid_embryos.pdf',
    'zanno09': '2009-zanno-nothronychus_graffami.pdf',
    'xu09': '2009-xu-beipiaosaurus_sp.pdf',
    'zanno10': '2010-zanno-therizinosauria.pdf',
    'zm11': '2011-zanno-coelurosauria_herbivory.pdf',
    'fa12': '2012-fiorillo-therizinosaur_track.pdf',
    'lau13': '2013-lautenschlager-erlikosaurus_andrewsi.pdf',
    'lau14': '2014-lautenschlager-therizinosauria_claws.pdf',
    'lau17': '2017-lautenschlager-therizinosauria_mandibles.pdf',
    'fio18': '2018-fiorillo-therizinosaur_hadrosaur_tracks.pdf',
    'tan19': '2019-tanaka-dendroolithid_theropod_SUPPLEMENT.pdf',
    'but20': '2020-button-herbivorous_dinosaurs.pdf',
    'qin23': '2023-qin-maniraptoran_unguals.pdf',
    'fre25': '2025-freimuth-falcarius_utahensis.pdf',
    'kob25': '2025-kobayashi-duonychus_tsogtbaatari.pdf',
    'cgq': '2007-suarez-falcarius_quarry.pdf',
    'smi25': '2025-smith-falcarius_utahensis.pdf',
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
