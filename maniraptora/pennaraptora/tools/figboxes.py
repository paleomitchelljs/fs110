#!/usr/bin/env python3
"""Print image boxes and figure-caption starts on pages, as page fractions.
  tools/figboxes.py key:page [key:page ...]"""
import sys, re, pdfplumber
from papers import pdf
for a in sys.argv[1:]:
    k, p = a.split(':'); p = int(p)
    with pdfplumber.open(pdf(k)) as d:
        pg = d.pages[p - 1]; W, H = pg.width, pg.height
        ims = [(round(i['x0']/W,3), round(i['top']/H,3), round(i['x1']/W,3), round(i['bottom']/H,3)) for i in pg.images if (i['x1']-i['x0'])*(i['bottom']-i['top']) > 0.01*W*H]
        caps = []
        for l in pg.extract_text_lines():
            if re.match(r'^(F\s?I\s?G|Fig|FIG|Figure|FIGURE|T E X T)', l['text']):
                caps.append((round(l['x0']/W,3), round(l['top']/H,3), l['text'][:40]))
        print(f'{k}:{p} imgs={ims} caps={caps}')
