#!/usr/bin/env python3
"""Draw every zone rectangle of every figure scene on its picture, to check alignment without a browser.
Needs node. python3 tools/zones.py out_prefix [segment ids ...]  ->  out_prefix_N.jpg sheets (6 scenes each)."""
import json, os, subprocess, sys
from PIL import Image, ImageDraw
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.join(HERE, '..')
js = """
global.window = { DIMS: JSON.parse(require('fs').readFileSync('%s/js/dims.js','utf8').replace(/^[^{]*/,'').replace(/;\\s*$/,'')) };
global.window.window = global.window;
new Function('window', require('fs').readFileSync('%s/js/content.js','utf8') + '; window.ABEL=window.ABEL;').call(global.window, global.window);
const segs = (global.window.ABEL||{}).segments;
console.log(JSON.stringify(segs.filter(s => s.items.some(i => i.kind==='fig')).map(s => ({id:s.id, tier:s.tier, fig:s.items.find(i=>i.kind==='fig')}))));
""" % (ROOT, ROOT)
open('/tmp/_zones.js', 'w').write(js)
segs = json.loads(subprocess.check_output(['node', '/tmp/_zones.js'], text=True))
want = sys.argv[2:]
COL = [(230, 50, 50), (40, 90, 220), (20, 150, 60), (200, 120, 0), (150, 40, 180), (0, 150, 170), (120, 120, 0)]
panels = []
for sg in segs:
    if want and sg['id'] not in want: continue
    fig = sg['fig']; src, zones = fig['src'], fig['zones']
    cur = src
    for zi, z in enumerate(zones):
        if z.get('src'): cur = z['src']
        if not z.get('rect'): continue
        im = Image.open(os.path.join(ROOT, cur)).convert('RGB'); s = 520 / max(im.size); im = im.resize((int(im.width * s), int(im.height * s)))
        d = ImageDraw.Draw(im, 'RGBA'); l, t, w, h = z['rect']
        box = [l * im.width, t * im.height, (l + w) * im.width, (t + h) * im.height]
        d.rectangle(box, fill=COL[zi % 7] + (60,), outline=COL[zi % 7] + (255,), width=3)
        cv = Image.new('RGB', (540, im.height + 26), 'white'); cv.paste(im, (10, 22))
        ImageDraw.Draw(cv).text((10, 4), '%s #%d %s' % (sg['id'], zi, z['label'][:40]), fill='black')
        panels.append(cv)
n = 0
for k in range(0, len(panels), 8):
    grp = panels[k:k + 8]; rows = []
    for r in range(0, len(grp), 4):
        row = grp[r:r + 4]; H = max(p.height for p in row)
        im = Image.new('RGB', (540 * 4, H), 'white')
        for i, p in enumerate(row): im.paste(p, (i * 540, 0))
        rows.append(im)
    sh = Image.new('RGB', (2160, sum(r.height for r in rows)), 'white'); y = 0
    for r in rows: sh.paste(r, (0, y)); y += r.height
    sh.save('%s_%d.jpg' % (sys.argv[1], n), quality=80); n += 1
print(len(panels), 'panels,', n, 'sheets')
