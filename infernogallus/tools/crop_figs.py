"""Cut the figure panels the deck uses out of the paper's embedded figure images.

    python3 infernogallus/tools/crop_figs.py

Needs infernogallus/infernogallus.pdf (gitignored), poppler's pdfimages, and Pillow.
Figures are the paper's own (Funston et al. 2026, Nature Communications), cropped
for teaching. img/recon.png (the skeleton alone, from Fig. 1c) was cleaned by hand and is not made here. Panel boxes are (left, top, right, bottom) in each figure's own pixels.
"""
import subprocess, sys, tempfile, pathlib
from PIL import Image

here = pathlib.Path(__file__).resolve().parent.parent
pdf = here / 'infernogallus.pdf'
out = here / 'img'
if not pdf.exists():
    sys.exit('put the paper at ' + str(pdf))

# page 2 = Fig 1, page 3 = Fig 2, page 4 = Fig 3, page 5 = Fig 4
CROPS = {
    0: {  # Fig 1  1350 x 1524
        'fig1-recon':  (0, 890, 1350, 1524),
        'fig1-hist':   (985, 1060, 1350, 1524),
        'fig1-block':  (0, 0, 1350, 880),
    },
    1: {  # Fig 2  1350 x 1641
        'fig2-skull':  (0, 0, 1350, 470),
        'fig2-crushed': (0, 0, 690, 470),
        'fig2-life':   (0, 1000, 700, 1641),
        'fig2-vs':     (0, 990, 1350, 1641),
    },
    2: {  # Fig 3  950 x 1627
        'fig3-pca':    (0, 380, 950, 1160),
        'fig3-joint':  (0, 1170, 950, 1627),
        'fig3-vectors': (0, 0, 950, 370),
    },
    3: {  # Fig 4  2000 x 1247
        'fig4':        (0, 0, 2000, 1247),
        'fig4-tree':   (0, 0, 1130, 1247),
        'fig4-fruit':  (1090, 0, 2000, 1247),
    },
}

def restore_pair(fig2):
    """Crushed skull (2a) and the restored one (2e) side by side with an arrow."""
    from PIL import ImageDraw
    a, e = fig2.crop((0, 0, 690, 470)), fig2.crop((0, 1000, 700, 1641))
    gap = 130
    im = Image.new('RGB', (a.width + gap + e.width, e.height), 'white')
    im.paste(a, (0, (e.height - a.height) // 2))
    im.paste(e, (a.width + gap, 0))
    d = ImageDraw.Draw(im)
    y, x0 = e.height // 2, a.width + 22
    d.polygon([(x0, y - 14), (x0 + 58, y - 14), (x0 + 58, y - 36), (x0 + gap - 44, y), (x0 + 58, y + 36), (x0 + 58, y + 14), (x0, y + 14)], fill=(120, 130, 125))
    return im

with tempfile.TemporaryDirectory() as t:
    subprocess.run(['pdfimages', '-png', '-f', '2', '-l', '5', str(pdf), t + '/f'], check=True)
    for i, crops in CROPS.items():
        im = Image.open(f'{t}/f-{i:03d}.png').convert('RGB')
        for name, box in crops.items():
            c = im.crop(box)
            c.save(out / (name + '.jpg'), quality=88, optimize=True)
            print(name, c.size)
        if i == 1:
            c = restore_pair(im)
            c.save(out / 'fig2-restore.jpg', quality=88, optimize=True)
            print('fig2-restore', c.size)
