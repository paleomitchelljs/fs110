#!/usr/bin/env python3
"""Find the lines the deck highlights, from the PDFs' own word positions.

Each quote is (paper, first words, last words[, page]). The tool finds the first
words, then the last words after them, and writes one box per printed line
(fractions of the page) to js/lines.js, with the text it matched. The match is on
letters and digits only, so superscript citation numbers and dashes don't get in
the way. Run it after editing QUOTES, then run crop_figs.py to render any new pages.

  python3 tools/lines.py
"""
import os, re, sys, json, subprocess, html
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from papers import pdf, HERE
from quotes import QUOTES

norm = lambda s: re.sub(r'[^0-9a-z]', '', s.lower().replace('ﬁ', 'fi').replace('ﬂ', 'fl'))
_cache = {}

def words(key):
    """[(page, line_id, xMin, yMin, xMax, yMax, text)] in reading order, and page sizes."""
    if key in _cache: return _cache[key]
    xml = subprocess.run(['pdftotext', '-bbox-layout', pdf(key), '-'], capture_output=True, text=True).stdout
    out, sizes, page, lid = [], {}, 0, 0
    for m in re.finditer(r'<page width="([\d.]+)" height="([\d.]+)">|<line[^>]*>|<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">(.*?)</word>', xml):
        if m.group(1):
            page += 1; sizes[page] = (float(m.group(1)), float(m.group(2)))
        elif m.group(0).startswith('<line'):
            lid += 1
        else:
            out.append((page, lid, *map(float, m.group(3, 4, 5, 6)), html.unescape(m.group(7))))
    _cache[key] = (out, sizes)
    return _cache[key]

def find(key, a, b, page=None):
    ws, sizes = words(key)
    stream, owner = [], []
    for i, w in enumerate(ws):
        if page and w[0] != page: continue
        for ch in norm(w[6]):
            stream.append(ch); owner.append(i)
    S = ''.join(stream)
    s = S.find(norm(a))
    if s < 0: raise SystemExit(f'not found: {key} "{a}"')
    e = S.find(norm(b), s)
    if e < 0: raise SystemExit(f'end not found: {key} "{b}"')
    i0, i1 = owner[s], owner[e + len(norm(b)) - 1]
    sel = ws[i0:i1 + 1]
    pg = sel[0][0]
    if any(w[0] != pg for w in sel): raise SystemExit(f'quote crosses a page: {key} "{a}"')
    pw, ph = sizes[pg]
    lines = {}
    for w in sel:
        if w[3] / ph > 0.955 or w[5] / ph < 0.045: continue  # running heads and page footers
        r = lines.setdefault(w[1], [w[2], w[3], w[4], w[5]])
        r[0] = min(r[0], w[2]); r[1] = min(r[1], w[3]); r[2] = max(r[2], w[4]); r[3] = max(r[3], w[5])
    # Superscripts and drop caps make their own "lines": fold any line level with another into it.
    # Keep reading order, so a quote that turns a column reads foot of one, then head of the next.
    merged = []
    for r in lines.values():
        m = next((q for q in merged if abs((q[1] + q[3]) / 2 - (r[1] + r[3]) / 2) < 0.006 and (r[0] <= q[2] + 0.02 and r[2] >= q[0] - 0.02)), None)
        if m: m[0] = min(m[0], r[0]); m[1] = min(m[1], r[1]); m[2] = max(m[2], r[2]); m[3] = max(m[3], r[3])
        else: merged.append(list(r))
    rects = [[round(r[0] / pw, 4), round(r[1] / ph, 4), round(r[2] / pw, 4), round(r[3] / ph, 4)] for r in merged]
    # Each word, with the line it sits on, so a lens can reflow the words at a readable size.
    wl = []
    for w in sel:
        if w[3] / ph > 0.955 or w[5] / ph < 0.045: continue
        cy = (w[3] + w[5]) / 2
        k = min(range(len(merged)), key=lambda i: 0 if merged[i][1] - 1 <= cy <= merged[i][3] + 1 and merged[i][0] - 1 <= w[2] <= merged[i][2] + 1 else 1 + abs((merged[i][1] + merged[i][3]) / 2 - cy))
        wl.append([round(w[2] / pw, 4), round(w[4] / pw, 4), k, w[6]])
    return {'paper': key, 'page': pg, 'rects': rects, 'words': wl, 'text': ' '.join(w[6] for w in sel)}

def main():
    out = {}
    for k, q in QUOTES.items():
        out[k] = find(q[0], q[1], q[2], q[3] if len(q) > 3 else None)
        print(f"{k:16} {q[0]} p{out[k]['page']:<3} {len(out[k]['rects'])} lines  {out[k]['text'][:90]}")
    with open(os.path.join(HERE, '..', 'js', 'lines.js'), 'w') as f:
        f.write('/* Highlighted lines: page fractions per printed line, from tools/lines.py. Do not edit by hand. */\nwindow.LINES = ' + json.dumps(out, separators=(',', ':'), ensure_ascii=False).replace('},"', '},\n"') + ';\n')

main()
