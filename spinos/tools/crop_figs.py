#!/usr/bin/env python3
"""Cut the figure panels the deck shows out of the PDFs in spinos/papers/.

Needs poppler (pdftoppm, pdfinfo). No other packages. The papers are
gitignored; the cropped images in img/ are committed (fair use for teaching).

A box is (left, top, right, bottom) as fractions of the page, so it does not
depend on the render resolution.

  python3 spinos/tools/crop_figs.py            # all
  python3 spinos/tools/crop_figs.py zanno09    # names containing this
"""
import os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PAPERS = os.path.join(HERE, '..', 'papers')
OUT = os.path.join(HERE, '..', 'img')
DPI = 260
# Figures shown zoomed get more resolution. gat16-fig2 has vector labels, so they stay sharp.
DPI_FOR = {'ser22-fig1a': 420, 'ser22-fig1f': 420, 'ser22-fig2': 350, 'ser22-fig9': 350, 'ser26-fig1': 350, 'ser26-fig2': 350, 'ser26-fig3': 350, 'ser26-fig4': 350, 'ser26-fig5b': 350, 'gor25-fig1a': 420, 'gor25-fig5a': 450, 'ibr14-fig2': 350, 'fab22-fig1': 350, 'hh21-fig1': 350, 'hh21-fig6': 350, 'hh21-fig9': 350, 'mat22-fig2': 350, 'bar21-fig1': 350, 'bru21-fig1': 300, 'ibrsm-figS3': 400}
FULLPAGE = {'buf04'}  # pages with printer's marks: render the whole page, then cut by fraction

P = {
    'ibr14': 'science.1258750.pdf',
    'ibrsm': 'ibrahim.sm.pdf',
    'ibr20': 'Tail_propelled_aquatic_locomotion_in_a_t.pdf',
    'kk': 'ibrahim-2020b-kem-kem-monograph.pdf',
    'sto15': 'stromer-1915-spinosaurus.pdf',
    'sto34': 'stromer-1934-dinosauria.pdf',
    'hh17': 'A_Century_of_Spinosaurs_-_A_Review_and_Revision_of.pdf',
    'hh19': '1-s2.0-S0195667119300485-main.pdf',
    'hh21': 'honeholtz21.pdf',
    'ard19': '1-s2.0-S0195667117303427-main.pdf',
    'ami10': 'Amiotetal.20101.pdf',
    'buf04': 'BuffetautMartillEscuillie-Pterosaursaspartofasp.pdf',
    'ser22': 'elife-80092-v1.pdf',
    'ser26': 'science.adx5486.pdf',
    'hen18': 'peerj-5409.pdf',
    'fab22': 'Fabbri_et_al_2022_subaqueous_foraging_among.pdf',
    'myh24': 'journal.pone.0298957.pdf',
    'gor25': 'gordon-2025-current-biology.pdf',
    'cau25': 'cau-paterna-2025-stromers-riddle.pdf',
    'pit26': 'geodiversitas2026v48a12.pdf',
    'dam24': "The Anatomical Record - 2024 - D'Amore - Prey size and ecological separation in spinosaurid theropods based on heterodonty.pdf",
    'sal17': 'salesschultz.pdf',
    'kel11': 'kellner-2011-oxalaia.pdf',
    'mat22': 'mateus-2022-iberospinus.pdf',
    'bar21': 'barker-2021-wessex-spinosaurids.pdf',
    'sch20': 'schade-2020-irritator-neuroanatomy.pdf',
    'sch23': 'schade-2023-irritator-osteology.pdf',
    'cha97': 'part75343.pdf',
    'gim16': 'the-riddle-of-spinosaurus-aegyptiacus-dorsal-sail.pdf',
    'vul16': 'vullo-2016-pike-conger.pdf',
    'bee21': 'Taphonomic_evidence_supports_an_aquatic.pdf',
    'has18': 'rspb20180197.pdf',
    'sma24': 'peerj-17544.pdf',
    'hnd16': 'hendrickx-2016-quadrate.pdf',
    'eve15': 'evers-2015-sigilmassasaurus.pdf',
    'bru21': 'PIIS0960982221012124.pdf',
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
    if key in FULLPAGE:
        from PIL import Image
        stem = os.path.join(OUT, name)
        subprocess.check_call(['pdftoppm', '-jpeg', '-jpegopt', 'quality=92', '-singlefile', '-r', str(DPI_FOR.get(name, DPI)), '-f', str(page), '-l', str(page), pdf, stem])
        im = Image.open(stem + '.jpg').convert('RGB'); W, H = im.size; l, t, r, b = box
        im.crop((int(l * W), int(t * H), int(r * W), int(b * H))).save(stem + '.jpg', quality=88)
        return
    w, h = page_size(pdf, page)
    dpi = DPI_FOR.get(name, DPI)
    pw, ph = w / 72 * dpi, h / 72 * dpi
    l, t, r, b = box
    x, y, W, H = int(pw * l), int(ph * t), int(pw * (r - l)), int(ph * (b - t))
    stem = os.path.join(OUT, name)
    subprocess.check_call(['pdftoppm', '-jpeg', '-jpegopt', 'quality=88', '-singlefile', '-r', str(dpi),
                           '-f', str(page), '-l', str(page), '-x', str(x), '-y', str(y), '-W', str(W), '-H', str(H), pdf, stem])

if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    want = sys.argv[1:]
    for name, (key, page, box) in FIGS.items():
        if want and not any(s in name for s in want):
            continue
        crop(name, key, page, box)
        print('ok', name)
