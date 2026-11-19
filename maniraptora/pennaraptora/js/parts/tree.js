/* A drawn cladogram of a few groups that the class can rearrange.
 *
 *   tree    tips: [{ id, label, img }]   the groups, each with a small picture
 *           trees: [{ at, t, cap }]      a published arrangement per build. t nests arrays of
 *                                        tip ids; an array of 3+ is a polytomy. cap names the source.
 *           focal: tip id (birds). Its sister group is drawn in the accent color.
 *           Before the first tree's build the tips stand alone, with no branches.
 *
 * Drag one tip onto another to swap them; the tree redraws and the caption reads
 * "Rearranged". Stepping to a build restores that build's published tree.
 */
(function () {
  'use strict';
  const D = window.Deck;
  const NS = 'http://www.w3.org/2000/svg';
  const dims = (src) => window.DIMS[src.replace(/^img\//, '')] || [4, 3];

  D.parts.tree = function (def, host) {
    const BW = def.box[2], BH = def.box[3], CAPH = 40, H = BH - CAPH;
    const n = def.tips.length, row = H / n;
    const TIPW = def.tipW || 520, TX = BW - TIPW, PAD = 30;
    host.innerHTML = '';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'tr-svg'); svg.setAttribute('width', TX); svg.setAttribute('height', H);
    host.appendChild(svg);
    const cap = D.el('div', 'tr-cap', host); cap.style.top = (H + 4) + 'px';

    const byId = {};
    def.tips.forEach((t) => {
      const e = D.el('div', 'tr-tip grab', host);
      const [w, h] = dims(t.img), ih = row * 0.78, iw = Math.min(TIPW * 0.5, w * ih / h);
      e.innerHTML = `<span class="tr-pic"><img draggable="false" alt="" src="${t.img}" style="width:${iw.toFixed(0)}px;height:${(iw * h / w).toFixed(0)}px"></span><span class="tr-lab">${D.fmt(t.label)}</span>`;
      e.style.cssText = `left:${TX}px;width:${TIPW}px;height:${row.toFixed(1)}px;`;
      e.querySelector('.tr-pic').style.width = (TIPW * 0.5) + 'px';
      e.dataset.id = t.id;
      byId[t.id] = e;
    });

    let cur = null, order = def.tips.map((t) => t.id);
    const leaves = (t) => (Array.isArray(t) ? t.flatMap(leaves) : [t]);
    const depth = (t) => (Array.isArray(t) ? 1 + Math.max(...t.map(depth)) : 0);

    /* The clade that sits next to the focal tip: its siblings at the focal tip's parent. */
    function sisters(t) {
      if (!Array.isArray(t)) return null;
      if (t.includes(def.focal)) return t.filter((c) => c !== def.focal);
      for (const c of t) { const s = sisters(c); if (s) return s; }
      return null;
    }

    function place() {
      order.forEach((id, i) => { byId[id].style.top = (i * row).toFixed(1) + 'px'; });
    }

    function draw(t, label) {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      Object.values(byId).forEach((e) => e.classList.remove('hot', 'focal'));
      if (!t) { cap.innerHTML = ''; return; }
      order = leaves(t); place();
      const step = (TX - PAD * 2) / Math.max(1, depth(t));
      const hot = new Set(), sis = sisters(t) || [];
      sis.forEach((c) => leaves(c).forEach((id) => hot.add(id)));
      const isHot = (c) => leaves(c).every((id) => hot.has(id));
      const ln = (x1, y1, x2, y2, cls) => {
        const l = document.createElementNS(NS, 'line');
        l.setAttribute('x1', x1); l.setAttribute('y1', y1); l.setAttribute('x2', x2); l.setAttribute('y2', y2);
        l.setAttribute('class', cls); svg.appendChild(l);
      };
      /* returns [x, y] of the node; tips at the right edge, internal nodes by height */
      function node(c) {
        if (!Array.isArray(c)) return [TX - PAD, (order.indexOf(c) + 0.5) * row];
        const kids = c.map(node), x = TX - PAD - depth(c) * step;
        const ys = kids.map((k) => k[1]), y = (Math.min(...ys) + Math.max(...ys)) / 2;
        ln(x, Math.min(...ys), x, Math.max(...ys), 'tr-br');
        c.forEach((k, i) => {
          const cls = isHot(k) ? 'tr-br hot' : (!Array.isArray(k) && k === def.focal ? 'tr-br focal' : 'tr-br');
          ln(x, kids[i][1], kids[i][0], kids[i][1], cls);
        });
        return [x, y];
      }
      const [rx, ry] = node(t);
      ln(PAD * 0.4, ry, rx, ry, 'tr-br');
      hot.forEach((id) => byId[id].classList.add('hot'));
      if (byId[def.focal]) byId[def.focal].classList.add('focal');
      cap.innerHTML = D.fmt(label || '');
    }

    function swap(a, b) {
      const sw = (t) => (Array.isArray(t) ? t.map(sw) : t === a ? b : t === b ? a : t);
      cur = sw(cur);
      draw(cur, 'Rearranged');
    }

    /* drag a tip onto another */
    Object.values(byId).forEach((e) => {
      e.addEventListener('pointerdown', (ev) => {
        if (!cur) return;
        ev.preventDefault(); ev.stopPropagation();
        const k = host.getBoundingClientRect().width / BW || 1, y0 = ev.clientY, top0 = parseFloat(e.style.top);
        e.setPointerCapture(ev.pointerId); e.classList.add('drag');
        const move = (m) => { e.style.top = (top0 + (m.clientY - y0) / k).toFixed(1) + 'px'; };
        const up = (u) => {
          e.removeEventListener('pointermove', move); e.removeEventListener('pointerup', up); e.removeEventListener('pointercancel', up);
          e.classList.remove('drag');
          const i = Math.max(0, Math.min(n - 1, Math.floor((top0 + (u.clientY - y0) / k + row / 2) / row)));
          const other = order[i];
          if (u.type === 'pointerup' && other && other !== e.dataset.id) swap(e.dataset.id, other); else place();
        };
        e.addEventListener('pointermove', move); e.addEventListener('pointerup', up); e.addEventListener('pointercancel', up);
      });
    });

    place();
    return {
      show(b) {
        let pick = null;
        def.trees.forEach((tr) => { if (tr.at <= b) pick = tr; });
        cur = pick ? JSON.parse(JSON.stringify(pick.t)) : null;
        draw(cur, pick && pick.cap);
      }
    };
  };
})();
