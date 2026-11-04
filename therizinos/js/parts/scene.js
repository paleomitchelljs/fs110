/* The lecture parts: pictures first, a few words at most.
 *
 *   fig       A figure, large. Pills on the right come in one per build; each can
 *             light a zone of the figure (the rest dims), swap the figure, and
 *             carry one of the five question icons (claim, evidence, else, test).
 *   solo      One of the drawn pictures (D.viz) at full size.
 *   sure      A thin "How sure?" bar for the room, placed under a scene.
 *   traitgrid Trait table you drag across taxa, with a photo for some rows.
 */
(function () {
  'use strict';
  const D = window.Deck;
  const ROLE = (r) => (r && D.icons[r]) || '';

  /* ---------- fig ---------- */
  D.parts.fig = function (def, host) {
    const BX = def.imgBox || [40, 8, 1010, 672];
    host.innerHTML = '<div class="fg"><div class="fg-img"><img draggable="false"><div class="fg-hole"></div></div><div class="fg-cap"></div><div class="fg-pills"></div></div>';
    const root = host.firstChild, wrap = root.querySelector('.fg-img'), img = wrap.querySelector('img'), hole = wrap.querySelector('.fg-hole');
    const cap = root.querySelector('.fg-cap'), pills = root.querySelector('.fg-pills');
    function layout(w, h) {
      const s = Math.min(BX[2] / w, (BX[3] - 30) / h), W = Math.round(w * s), H = Math.round(h * s);
      wrap.style.cssText = `left:${BX[0] + Math.round((BX[2] - W) / 2)}px;top:${BX[1]}px;width:${W}px;height:${H}px;`;
      cap.style.cssText = `left:${BX[0]}px;width:${BX[2]}px;top:${BX[1] + H + 6}px;`;
    }
    let curSrc = null;
    function setSrc(src, w, h, c) {
      if (src !== curSrc) { img.src = src; curSrc = src; }
      layout(w, h); cap.innerHTML = D.fmt(c || '');
    }
    setSrc(def.src, def.w, def.h, def.cap); img.alt = def.alt || '';
    const from = def.from == null ? 1 : def.from;
    const zs = def.zones.map((z, i) => {
      const e = D.el('button', 'fg-pill' + (z.role ? ' r-' + z.role : ''), pills, ROLE(z.role) + (z.dot ? `<i class="dt" style="background:${z.dot}"></i>` : '') + `<span>${D.fmt(z.label)}</span>`);
      e.type = 'button';
      e.style.top = (i * (def.pitch || 78)) + 'px';
      e.addEventListener('click', (ev) => { ev.stopPropagation(); if (e.classList.contains('shown')) focus(cur === i ? -1 : i); });
      return { z, e };
    });
    let cur = -1;
    function focus(i) {
      cur = i;
      const z = i >= 0 ? def.zones[i] : null;
      if (z && z.src) setSrc(z.src, z.w, z.h, z.cap); else setSrc(def.src, def.w, def.h, def.cap);
      if (!z || !z.rect) hole.style.cssText = 'left:0;top:0;width:100%;height:100%;box-shadow:0 0 0 0 transparent;';
      else {
        const r = z.rect;
        hole.style.cssText = `left:${r[0] * 100}%;top:${r[1] * 100}%;width:${r[2] * 100}%;height:${r[3] * 100}%;box-shadow:0 0 0 4000px var(--veil);`;
      }
      zs.forEach((k, j) => k.e.classList.toggle('on', j === i));
    }
    focus(-1);
    return {
      show(b) {
        zs.forEach((k, j) => k.e.classList.toggle('shown', b >= j + from));
        const i = b - from;
        focus(i >= 0 && i < def.zones.length ? i : -1);
      },
      reset() { focus(-1); }
    };
  };

  /* ---------- solo: a drawn picture, large ---------- */
  D.parts.solo = function (def, host) {
    const k = def.k || 1.4, v = def.viz;
    const layer = D.el('div', 'solo-layer', host);
    layer._k = k;
    layer.style.cssText = `left:${def.at ? def.at[0] : Math.round((1600 - 740 * k) / 2)}px;top:${def.at ? def.at[1] : 4}px;width:740px;height:480px;transform:scale(${k});`;
    const api = (D.viz[v.kind] && D.viz[v.kind](layer, v, { id: def.id }, {})) || {};
    let was = false;
    return {
      show(b, how) { if (api.show) api.show(b, how, true, !was); was = true; },
      hide() { was = false; if (api.hide) api.hide(); },
      reset() { was = false; if (api.reset) api.reset(); }
    };
  };

  /* ---------- sure: the room's call, as a bar ---------- */
  D.parts.sure = function (def, host) {
    const id = def.id;
    host.innerHTML = '';
    const g = D.el('div', 'gauge on', host);
    const dots = D.el('div', 'g-dots', g), bar = D.el('div', 'g-bar', g);
    const cols = [];
    D.BINS.forEach((lab, i) => {
      cols.push(D.el('div', 'g-col', dots));
      const b = D.el('div', 'g-bin', bar, lab);
      b.title = 'Click to add a vote · shift-click to take one back (keys 1–5)';
      b.addEventListener('click', (ev) => vote(i, ev.shiftKey || ev.altKey));
    });
    const undo = D.el('button', 'g-undo', g, '↶');
    undo.title = 'Undo the last vote';
    undo.addEventListener('click', () => vote(-1, true));
    const mark = D.el('div', 'g-mark', g);
    mark.title = "The room's call: drag to move it · double-click to follow the votes";
    D.slide(mark, bar, (k) => { D.cert(id).call = k; paint(); }, () => D.save());
    mark.addEventListener('dblclick', () => { D.cert(id).call = null; paint(); D.save(); });
    function vote(i, back) {
      const s = D.cert(id); s.h = s.h || [];
      if (back) {
        const any = i < 0;
        if (any) i = s.h.length ? s.h[s.h.length - 1] : s.v.reduce((m, n, j) => (n ? j : m), -1);
        if (i < 0 || !s.v[i]) { if (any) s.call = null; }
        else { s.v[i]--; const at = s.h.lastIndexOf(i); if (at >= 0) s.h.splice(at, 1); }
      } else { s.v[i]++; s.h.push(i); }
      D.save(); paint();
    }
    function paint() {
      const s = D.cert(id);
      s.v.forEach((n, i) => {
        while (cols[i].children.length > n) cols[i].lastChild.remove();
        while (cols[i].children.length < n) D.el('i', 'g-dot', cols[i]);
        const kk = n > 24 ? 10 : n > 14 ? 12 : 15;
        for (const d of cols[i].children) d.style.cssText = `width:${kk}px;height:${kk}px;`;
      });
      const call = D.callOf(id);
      mark.classList.toggle('on', call != null);
      if (call != null) mark.style.left = (call * 100) + '%';
    }
    paint();
    return {
      digit(n, shift) { if (n >= 1 && n <= 5) vote(n - 1, shift); },
      reset() { paint(); }
    };
  };

  /* ---------- traitgrid ---------- */
  D.parts.traitgrid = function (def, host) {
    const s = D.vizTools.svg;
    host.innerHTML = '<div class="tg"><div class="tg-l"></div><div class="tg-r"><img draggable="false"><div class="tg-cap"></div></div></div>';
    const root = host.firstChild, left = root.querySelector('.tg-l'), right = root.querySelector('.tg-r');
    const img = right.querySelector('img'), cap = right.querySelector('.tg-cap');
    const W = 800, N = def.cols.length, LABW = 330, CW = 118, RP = 46, R0 = 86;
    const CX = def.cols.map((c, j) => LABW + 60 + j * CW);
    const sv = D.svg('svg', { class: 'vz-svg', viewBox: `0 0 ${W} ${R0 + RP * def.rows.length + 70}`, width: W, height: R0 + RP * def.rows.length + 70 }, left);
    const band = D.svg('rect', { class: 'tr-band', x: CX[1] - 57, y: 6, width: 114, height: R0 + RP * def.rows.length - 34, rx: 16 }, sv);
    const text = D.vizTools.text;
    const heads = def.cols.map((c, j) => {
      const parts = c.name.split('|');
      const g = D.svg('g', { class: 'tg-col c' + j }, sv);
      const a = text(g, CX[j], parts.length > 1 ? 28 : 50, parts[0], 'tr-head', 'middle');
      if (parts.length > 1) text(g, CX[j], 56, parts[1], 'tr-head', 'middle');
      return g;
    });
    const cells = def.cols.map(() => []);
    const rowEls = def.rows.map((r, i) => {
      const y = R0 + i * RP;
      if (i % 2 === 0) D.svg('rect', { class: 'tr-zebra', x: 0, y: y - 28, width: W, height: RP, rx: 8 }, sv);
      const lab = text(sv, 8, y + 6, r.t + (r.img ? '  ▣' : ''), 'tr-lab' + (r.img ? ' pic' : ''));
      if (r.img) { lab.style.cursor = 'pointer'; lab.addEventListener('pointerdown', (e) => { e.stopPropagation(); showRow(i); }); }
      r.s.forEach((st, j) => {
        const g = D.svg('g', { class: 'tr-cell c' + j, transform: `translate(${CX[j]} ${y})` }, sv);
        if (st === 'P') D.svg('rect', { class: 'tr-p', x: -12, y: -12, width: 24, height: 24, rx: 3 }, g);
        else if (st === 'D') D.svg('circle', { class: 'tr-d', r: 14 }, g);
        else if (st === 'I') D.svg('path', { class: 'tr-i', d: 'M0 -15 L15 12 L-15 12 Z' }, g);
        else text(g, 0, 9, '?', 'tr-q', 'middle');
        cells[j].push(g);
      });
      return lab;
    });
    const cy = R0 + def.rows.length * RP + 22, cnt = {};
    [['P', 0], ['I', 1], ['D', 2]].forEach(([k, n]) => {
      const x = CX[1] - 70 + n * 118, g = D.svg('g', { transform: `translate(${x} ${cy})`, class: 'tg-cnt' }, sv);
      if (k === 'P') D.svg('rect', { class: 'tr-p', x: -12, y: -12, width: 24, height: 24, rx: 3 }, g);
      if (k === 'I') D.svg('path', { class: 'tr-i', d: 'M0 -15 L15 12 L-15 12 Z' }, g);
      if (k === 'D') D.svg('circle', { class: 'tr-d', r: 14 }, g);
      cnt[k] = text(sv, x + 28, cy + 11, '0', 'tr-n');
    });
    let sel = 1, shownCols = 2, stop = null, imgRow = -1, last = {};
    function paintCols() {
      heads.forEach((h, j) => { h.style.opacity = j < shownCols ? 1 : 0; h.classList.toggle('on', j === sel); });
      cells.forEach((col, j) => col.forEach((g) => { g.style.opacity = j < shownCols ? (j === sel ? 1 : 0.4) : 0; }));
      band.style.opacity = sel < shownCols ? 1 : 0;
      const c = { P: 0, I: 0, D: 0 };
      def.rows.forEach((r) => { if (c[r.s[sel]] != null) c[r.s[sel]]++; });
      cnt.P.textContent = c.P; cnt.I.textContent = c.I; cnt.D.textContent = c.D;
    }
    function pick(k, anim) {
      if (k >= shownCols) k = shownCols - 1;
      const x = CX[k] - 57, from = +band.getAttribute('x');
      if (stop) stop();
      if (anim && !D.reduced) stop = D.tween(260, (t) => band.setAttribute('x', from + (x - from) * D.ease(t)));
      else band.setAttribute('x', x);
      sel = k; paintCols();
    }
    function showRow(i) {
      imgRow = i;
      const im = i >= 0 ? def.rows[i].img : null;
      right.classList.toggle('on', !!im);
      rowEls.forEach((l, j) => l.classList.toggle('hot', j === i));
      if (im) { img.src = im.src; cap.innerHTML = D.fmt(im.cap || ''); }
    }
    left.addEventListener('pointerdown', (e) => {
      e.preventDefault(); e.stopPropagation();
      left.setPointerCapture(e.pointerId);
      const at = (m) => {
        const px = D.local(sv, m).x;
        pick(CX.reduce((b, c, j) => (j < shownCols && Math.abs(px - c) < Math.abs(px - CX[b]) ? j : b), 0), true);
      };
      at(e);
      const up = () => { left.removeEventListener('pointermove', at); left.removeEventListener('pointerup', up); left.removeEventListener('pointercancel', up); };
      left.addEventListener('pointermove', at); left.addEventListener('pointerup', up); left.addEventListener('pointercancel', up);
    });
    paintCols(); band.setAttribute('x', CX[1] - 57);
    return {
      show(b) {
        shownCols = def.cols.reduce((n, c, j) => (b >= (c.at || 0) ? j + 1 : n), 0);
        let row = -1;
        Object.keys(def.imgAt || {}).forEach((k) => { if (b >= +k) row = def.imgAt[k]; });
        showRow(row);
        pick(Math.min(sel, shownCols - 1), false);
      },
      reset() { sel = 1; showRow(-1); pick(1, false); }
    };
  };
})();
