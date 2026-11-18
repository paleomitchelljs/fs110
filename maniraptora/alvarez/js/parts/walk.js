/* The walk through a paper: its own page with lines highlighted, the lines blown up,
 * and beside it a figure, a reference, or a model.
 *
 *   page    A printed page with marker highlights from js/lines.js and a lens that
 *           blows the current lines up. steps: [{ q, at }]: the quote shown from build at
 *           on. Earlier quotes on the same page stay faintly marked. lensOnly drops the
 *           page and shows just the lens, with the paper named above it (for a reference
 *           beside the main paper). ref: a quote id from the reference list, shown as a
 *           strip under the lens.
 *   pic     A figure that zooms. views: [{ src, cap, crop: [l, t, r, b], ring, at }]. Views of
 *           the same file glide from one crop to the next.
 *   quotes  Lenses from several papers side by side. cards: [{ q, at }].
 *   shelf   The papers in the folder by year, first pages as thumbnails; cited ones marked.
 *   matrix  Questions down the side, papers across the top, the papers' own words in the cells.
 *
 * Every quote's words come from tools/quotes.py through tools/lines.py, so a lens can
 * only show what the paper printed.
 */
(function () {
  'use strict';
  const D = window.Deck;
  const L = () => window.LINES;
  const PAPER = () => D.content.papers;
  const pageSrc = (q) => `img/pages/${q.paper}-p${q.page}.jpg`;
  const dims = (src) => window.DIMS[src.replace(/^img\//, '')];

  /* A lens: the quote's own printed words, cut from the page image one by one and set
   * again in rows w wide, at a line height of opts.size px (smaller if the quote would
   * run past maxH). A hyphen that only breaks a word at a line end is cut off and the two
   * halves joined. Returns { el, w, h, q }. */
  D.lens = function (parent, qid, w, maxH, opts) {
    const q = L()[qid];
    const el = D.el('div', 'lens', parent);
    if (!q) { console.warn('no quote', qid); return { el, w: 0, h: 0 }; }
    const src = pageSrc(q), [PW, PH] = dims(src);
    const lineH = q.rects.reduce((a, r) => a + r[3] - r[1], 0) / q.rects.length * PH;
    const PAD = 14;
    let size = (opts && opts.size) || 36, place = [], width = 0, height = 0;
    for (; size >= 14; size -= 2) {
      const s = size / lineH, gap = size * 0.3, rowH = size * 1.32;
      place = []; let x = PAD, y = PAD, maxX = 0;
      q.words.forEach((wd, i) => {
        const r = q.rects[wd[2]], nx = q.words[i + 1];
        let x0 = wd[0], x1 = wd[1];
        const joins = nx && nx[2] !== wd[2] && /[a-z]-$/.test(wd[3] || '') && /^[a-z]/.test(nx[3] || '');
        if (joins) x1 -= (x1 - x0) / (wd[3].length) * 0.85;
        const ww = (x1 - x0) * PW * s, hh = (r[3] - r[1]) * PH * s;
        const prev = place[place.length - 1], prevJoin = prev && prev.joins;
        if (x > PAD && x + ww > w - PAD) {
          if (prevJoin && prev.x > PAD) { y += rowH; prev.x = PAD; prev.y += rowH; x = PAD + prev.ww; }
          else if (!prevJoin) { x = PAD; y += rowH; }
        }
        place.push({ x, y: y + (rowH - hh) / 2 - size * 0.12, ww, hh, x0, y0: r[1], s, joins });
        x += ww + (joins ? 0 : gap); maxX = Math.max(maxX, x - (joins ? 0 : gap));
      });
      maxX = Math.max(PAD, ...place.map((p) => p.x + p.ww));
      width = maxX + PAD; height = y + rowH + PAD;
      if (height <= maxH) break;
    }
    place.forEach((p) => {
      const e = D.el('i', 'wd', el);
      e.style.cssText = `left:${p.x.toFixed(1)}px;top:${p.y.toFixed(1)}px;width:${p.ww.toFixed(1)}px;height:${p.hh.toFixed(1)}px;` +
        `background-image:url("${src}");background-size:${(PW * p.s).toFixed(1)}px ${(PH * p.s).toFixed(1)}px;background-position:${(-p.x0 * PW * p.s).toFixed(1)}px ${(-p.y0 * PH * p.s).toFixed(1)}px;`;
    });
    el.setAttribute('role', 'img'); el.setAttribute('aria-label', q.text);
    el.style.width = width.toFixed(1) + 'px'; el.style.height = height.toFixed(1) + 'px';
    return { el, w: width, h: height, q };
  };

  const cite = (key, page) => {
    const p = PAPER()[key];
    return `<b>${D.fmt(p.cite)}</b><span>${D.fmt(p.journal)}${page ? ' · p ' + page : ''}</span>`;
  };

  /* ---------- head ---------- */
  /* Where in the paper we are (left) and the topic card (right). */
  D.parts.head = function (def, host) {
    host.innerHTML = `<div class="hd"><div class="hd-crumb">${D.fmt(def.crumb || '')}</div>` + (def.topic ? `<div class="pl2-topic">${D.fmt(def.topic)}</div>` : '') + '</div>';
    return {};
  };

  /* ---------- page ---------- */
  D.parts.page = function (def, host) {
    const [BX, BY, BW, BH] = [0, 0, def.box[2], def.box[3]];
    host.innerHTML = '<div class="pg"></div>';
    const root = host.firstChild;
    const lensOnly = !!def.lensOnly;
    const LW = def.lensW || (lensOnly ? BW : BW - 10);
    let sheet, img, marks, wire, label;
    let sheetW = 0, sheetH = 0;
    if (!lensOnly) {
      sheetH = BH - 34;
      sheet = D.el('div', 'pg-sheet', root);
      img = D.el('img', '', sheet); img.draggable = false; img.alt = '';
      marks = D.el('div', 'pg-marks', sheet);
      label = D.el('div', 'pg-src', root);
      wire = D.svg('svg', { class: 'pg-wire', width: BW, height: BH }, root);
    } else {
      label = D.el('div', 'pg-cite', root);
    }
    let lensBox = D.el('div', 'pg-lensbox', root);
    let cur = null;

    function setPage(q) {
      const src = pageSrc(q), [PW, PH] = dims(src);
      sheetW = sheetH * PW / PH;
      sheet.style.cssText = `left:${BX}px;top:${BY}px;width:${sheetW.toFixed(1)}px;height:${sheetH}px;`;
      if (img.getAttribute('src') !== src) img.src = src;
      label.style.cssText = `left:${BX}px;top:${BY + sheetH + 4}px;width:${sheetW.toFixed(1)}px;`;
      label.innerHTML = cite(q.paper, q.page);
    }

    function draw(b, how) {
      const steps = def.steps.filter((s) => (s.at || 0) <= b);
      const now = steps[steps.length - 1];
      if (!now) return;
      const q = L()[now.q];
      if (cur === now.q) return;
      cur = now.q;
      lensBox.innerHTML = '';
      const maxH = def.lensH || (lensOnly ? BH - (def.ref ? 150 : 56) : Math.round(BH * 0.55));
      const lz = D.lens(lensBox, now.q, LW, maxH, { size: def.size || 36 });
      if (!lensOnly) {
        setPage(q);
        marks.innerHTML = '';
        steps.forEach((s) => {
          const qq = L()[s.q];
          if (qq.paper !== q.paper || qq.page !== q.page) return;
          qq.rects.forEach((r) => {
            const m = D.el('i', 'mark' + (s.q === now.q ? '' : ' past'), marks);
            m.style.cssText = `left:${(r[0] * 100).toFixed(2)}%;top:${(r[1] * 100).toFixed(2)}%;width:${((r[2] - r[0]) * 100).toFixed(2)}%;height:${((r[3] - r[1]) * 100).toFixed(2)}%;`;
          });
        });
        /* The lens sits at the right of the box, level with the lines it magnifies. */
        const all = q.rects, y0 = Math.min(...all.map((r) => r[1])) * sheetH, y1 = Math.max(...all.map((r) => r[3])) * sheetH;
        const x0 = Math.min(...all.map((r) => r[0])) * sheetW, x1 = Math.max(...all.map((r) => r[2])) * sheetW;
        /* Below the lines if it fits, else above, else wherever covers least of them. */
        const lx = BW - lz.w - 6, G = 26;
        let ly, below;
        if (y1 + G + lz.h <= BH - 4) { ly = y1 + G; below = true; }
        else if (y0 - G - lz.h >= 0) { ly = y0 - G - lz.h; below = false; }
        else { below = (BH - y1) > y0; ly = below ? BH - 4 - lz.h : 0; }
        lensBox.style.cssText = `left:${lx.toFixed(1)}px;top:${ly.toFixed(1)}px;`;
        wire.innerHTML = '';
        const ey = below ? ly : ly + lz.h, sy = below ? y1 + 5 : y0 - 5;
        D.svg('path', { class: 'pg-cone', d: `M${x0 - 6},${sy} L${x1 + 6},${sy} L${lx + lz.w},${ey} L${lx},${ey} Z` }, wire);
        D.svg('rect', { class: 'pg-ring', x: x0 - 6, y: y0 - 5, width: x1 - x0 + 12, height: y1 - y0 + 10, rx: 4 }, wire);
      } else {
        label.innerHTML = cite(q.paper, q.page);
        label.style.cssText = 'left:0;top:0;';
        lensBox.style.cssText = `left:${((BW - lz.w) / 2).toFixed(1)}px;top:56px;`;
        if (def.ref) {
          const rb = D.el('div', 'pg-ref', lensBox);
          rb.style.cssText = `left:${((lz.w - BW) / 2).toFixed(1)}px;top:${(lz.h + 22).toFixed(1)}px;`;
          D.lens(rb, def.ref, BW, 90, { size: 24 });
        }
      }
      if (how === 'step' || how === 'jump') D.replay(lensBox, 'play');
    }
    return { show(b, how) { draw(b, how); }, reset() { cur = null; } };
  };

  /* ---------- pic ---------- */
  D.parts.pic = function (def, host) {
    const BW = def.box[2], BH = def.box[3];
    host.innerHTML = '<div class="pc"><div class="pc-frame"><img draggable="false" alt=""><div class="pc-ring"></div></div><div class="pc-cap"></div></div>';
    const frame = host.querySelector('.pc-frame'), img = frame.querySelector('img'), ring = frame.querySelector('.pc-ring'), cap = host.querySelector('.pc-cap');
    const CAPH = def.noCap ? 0 : 34;
    let curView = null;
    function show(b) {
      const vs = def.views.filter((v) => (v.at || 0) <= b);
      const v = vs[vs.length - 1];
      if (!v || v === curView) return;
      const sameSrc = curView && curView.src === v.src;
      curView = v;
      const [W, H] = dims(v.src), c = v.crop || [0, 0, 1, 1];
      const cw = W * (c[2] - c[0]), ch = H * (c[3] - c[1]);
      const s = Math.min(BW / cw, (BH - CAPH) / ch), fw = cw * s, fh = ch * s;
      frame.classList.toggle('glide', !!sameSrc && !D.reduced);
      frame.style.cssText = `left:${((BW - fw) / 2).toFixed(1)}px;top:${((BH - CAPH - fh) / 2).toFixed(1)}px;width:${fw.toFixed(1)}px;height:${fh.toFixed(1)}px;`;
      if (!sameSrc) img.src = v.src;
      img.style.cssText = `width:${(W * s).toFixed(1)}px;height:${(H * s).toFixed(1)}px;left:${(-c[0] * W * s).toFixed(1)}px;top:${(-c[1] * H * s).toFixed(1)}px;`;
      if (v.ring) {
        const r = v.ring;
        ring.style.cssText = `display:block;left:${((r[0] - c[0]) * W * s).toFixed(1)}px;top:${((r[1] - c[1]) * H * s).toFixed(1)}px;width:${((r[2] - r[0]) * W * s).toFixed(1)}px;height:${((r[3] - r[1]) * H * s).toFixed(1)}px;`;
      } else ring.style.display = 'none';
      cap.style.cssText = `top:${((BH - CAPH - fh) / 2 + fh + 6).toFixed(1)}px;`;
      cap.innerHTML = D.fmt(v.cap || '');
    }
    return { show, reset() { curView = null; } };
  };

  /* ---------- quotes ---------- */
  D.parts.quotes = function (def, host) {
    const BW = def.box[2], BH = def.box[3], n = def.cards.length, cols = def.cols || n, rows = Math.ceil(n / cols);
    const G = 26, cw = (BW - G * (cols - 1)) / cols, chh = (BH - G * (rows - 1)) / rows;
    host.innerHTML = '';
    const cards = def.cards.map((c, i) => {
      const q = L()[c.q];
      const e = D.el('div', 'qc', host);
      e.style.cssText = `left:${((i % cols) * (cw + G)).toFixed(1)}px;top:${(Math.floor(i / cols) * (chh + G)).toFixed(1)}px;width:${cw.toFixed(1)}px;height:${chh.toFixed(1)}px;`;
      D.el('div', 'qc-cite', e, cite(q.paper, q.page));
      const lz = D.lens(e, c.q, cw - 8, chh - 60, { size: def.size || 34 });
      lz.el.style.cssText += `left:${((cw - lz.w) / 2).toFixed(1)}px;top:54px;`;
      return { e, at: c.at || 0 };
    });
    return {
      show(b, how) {
        cards.forEach((k) => {
          const on = b >= k.at, was = k.e.classList.contains('shown');
          k.e.classList.toggle('shown', on);
          if (on && !was && how === 'step') D.replay(k.e, 'play');
        });
      }
    };
  };

  /* ---------- shelf ---------- */
  D.parts.shelf = function (def, host) {
    const BW = def.box[2], BH = def.box[3], n = def.papers.length, G = 18;
    const tw = (BW - G * (n - 1)) / n;
    host.innerHTML = '';
    const items = def.papers.map((p, i) => {
      const src = `img/pages/${p.key}-thumb.jpg`, [W, H] = dims(src), th = tw * H / W;
      const e = D.el('div', 'sh-p', host);
      e.style.cssText = `left:${(i * (tw + G)).toFixed(1)}px;top:${(BH - th - 70).toFixed(1)}px;width:${tw.toFixed(1)}px;height:${th.toFixed(1)}px;`;
      D.el('img', '', e).src = src;
      D.el('div', 'sh-lab', e, D.fmt(PAPER()[p.key].short.replace(/ \d{4}$/, '')));
      D.el('div', 'sh-year', e, String(p.year));
      const badge = p.key === 'mak26' ? null : D.el('div', 'sh-ref' + (p.ref ? '' : ' none'), e, p.ref ? 'ref ' + p.ref : 'not cited');
      return { e, p, badge };
    });
    return {
      show(b) {
        items.forEach((k) => {
          k.e.classList.toggle('shown', b >= (k.p.at || 0));
          if (k.badge) k.badge.classList.toggle('shown', b >= (def.badgesAt || 1));
          k.e.classList.toggle('dim', def.focusAt != null && b >= def.focusAt && !k.p.ref && k.p.key !== 'mak26');
        });
      }
    };
  };

  /* ---------- matrix ---------- */
  D.parts.matrix = function (def, host) {
    const BW = def.box[2], BH = def.box[3];
    const LW = def.labelW || 230, cols = def.cols, rows = def.rows;
    const HH = 66, cw = (BW - LW) / cols.length, rh = (BH - HH) / rows.length;
    host.innerHTML = '';
    cols.forEach((c, j) => {
      D.el('div', 'mx-col', host, cite(c, null).replace(/<span>.*<\/span>/, '')).style.cssText = `left:${(LW + j * cw).toFixed(1)}px;width:${cw.toFixed(1)}px;height:${HH}px;`;
    });
    const rowEls = rows.map((r, i) => {
      const y = HH + i * rh;
      const lab = D.el('div', 'mx-row', host, D.fmt(r.label));
      lab.style.cssText = `top:${y.toFixed(1)}px;width:${LW - 14}px;height:${(rh - 8).toFixed(1)}px;`;
      const cells = cols.map((c, j) => {
        const t = r.cells[c];
        const e = D.el('div', 'mx-cell' + (t ? '' : ' empty'), host, t ? D.fmt(t) : '');
        e.style.cssText = `left:${(LW + j * cw + 4).toFixed(1)}px;top:${y.toFixed(1)}px;width:${(cw - 8).toFixed(1)}px;height:${(rh - 8).toFixed(1)}px;`;
        return e;
      });
      return { at: r.at || 0, els: [lab].concat(cells) };
    });
    return {
      show(b) { rowEls.forEach((r) => r.els.forEach((e) => e.classList.toggle('shown', b >= r.at))); }
    };
  };
})();
