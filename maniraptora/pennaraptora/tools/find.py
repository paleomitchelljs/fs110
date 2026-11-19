#!/usr/bin/env python3
"""Search a paper's text: tools/find.py KEY 'regex' [width]"""
import sys, re, subprocess
from papers import pdf
k, pat = sys.argv[1], sys.argv[2]; w = int(sys.argv[3]) if len(sys.argv) > 3 else 220
t = subprocess.run(['pdftotext', pdf(k), '-'], capture_output=True, text=True).stdout
pages = t.split('\f')
for pi, pg in enumerate(pages, 1):
    s = ' '.join(pg.split())
    for m in re.finditer(pat, s, re.I):
        print(f'p{pi}: ...{s[max(0, m.start()-w):m.end()+w]}...\n')
