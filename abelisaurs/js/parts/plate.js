/* Plain slides: pictures laid out for you, with a few short labels.
 *
 *   plate   A header (animal name, where and when, the claim), one to four pictures
 *           in a row, each with an optional label carrying one of the five question
 *           icons, and a foot of short chips. Everything is on screen at once unless
 *           a panel or chip carries at: n (it comes on at build n).
 *   pins    A map with every locality marked at once.
 *
 * D.plateRow lays pictures out inside a box and is shared with fig (the aside).
 * A picture can carry crop: [left, top, right, bottom] as fractions of the file;
 * the crop is what is shown, edge to edge, so a zoom can never miss its target.
 */
(function () {
  'use strict';
  const D = window.Deck;
  const ROLE = (r) => (r && D.icons[r]) || '';
  let LAB = 60;
  const CAPH = 28, GAP = 30;
  const labRaw = (p) => String(p.label).replace(/[_*=]/g, '').length * 13.5 + 80;
  const labW = (p) => Math.min(380, Math.max(200, labRaw(p)));

  D.plateRow = function (root, panels, box, dir) {
    const vertical = dir === 'col';
    LAB = panels.some((p) => p.label && labRaw(p) > 380) ? 96 : 60;
    const items = panels.map((p) => {
      const c = p.crop || [0, 0, 1, 1];
      const cw = p.w * (c[2] - c[0]), ch = p.h * (c[3] - c[1]);
      return { p, c, a: cw / ch, cw, ch };
    });
    const anyLab = items.some((i) => i.p.label), anyCap = items.some((i) => i.p.cap);
    const exOf = (i) => vertical ? (i.p.label ? LAB : 0) + (i.p.cap ? CAPH : 0) : (anyLab ? LAB : 0) + (anyCap ? CAPH : 0);
    const n = items.length;
    let h = 0;
    const sizes = items.map(() => ({ w: 0, h: 0 }));
    if (!vertical) {
      const extra = exOf(items[0]);
      for (h = box[3] - extra; h > 60; h -= 4) {
        const tot = items.reduce((s, i) => s + (i.p.label ? Math.max(i.a * h, labW(i.p)) : i.a * h), 0) + GAP * (n - 1);
        if (tot <= box[2]) break;
      }
      items.forEach((i, k) => { sizes[k] = { w: i.a * h, h }; });
    } else {
      let t;
      for (t = box[3]; t > 40; t -= 4) {
        const tot = items.reduce((s, i) => s + Math.min(box[2] / i.a, (i.p.weight || 1) * t) + exOf(i), 0) + GAP * (n - 1);
        if (tot <= box[3]) break;
      }
      items.forEach((i, k) => { const hh = Math.min(box[2] / i.a, (i.p.weight || 1) * t); sizes[k] = { w: hh * i.a, h: hh }; });
    }
    const slotW = items.map((i, k) => vertical ? sizes[k].w : (i.p.label ? Math.max(sizes[k].w, labW(i.p)) : sizes[k].w));
    const total = vertical
      ? sizes.reduce((s, k, j) => s + k.h + exOf(items[j]), 0) + GAP * (n - 1)
      : slotW.reduce((s, v) => s + v, 0) + GAP * (n - 1);
    const out = [];
    let x = box[0] + (vertical ? 0 : Math.max(0, (box[2] - total) / 2));
    let y = box[1] + (vertical ? Math.max(0, (box[3] - total) * 0.3) : Math.max(0, (box[3] - (h + exOf(items[0]))) * 0.3));
    items.forEach((i, k) => {
      const p = i.p, sw = sizes[k].w, sh = sizes[k].h, ex = exOf(i);
      const sl = vertical ? box[2] : slotW[k];
      const e = D.el('div', 'pl2-p pl2-x', root);
      e.style.cssText = `left:${Math.round(vertical ? box[0] : x)}px;top:${Math.round(y)}px;width:${Math.round(sl)}px;height:${Math.round(sh + ex)}px;`;
      const fr = D.el('div', 'pl2-img', e);
      const off = Math.round((sl - sw) / 2);
      fr.style.cssText = `left:${off}px;top:0;width:${Math.round(sw)}px;height:${Math.round(sh)}px;`;
      const im = D.el('img', '', fr);
      const s = sw / i.cw;
      im.draggable = false; im.alt = p.alt || ''; im.src = p.src;
      im.style.cssText = `width:${(p.w * s).toFixed(2)}px;height:${(p.h * s).toFixed(2)}px;left:${(-i.c[0] * p.w * s).toFixed(2)}px;top:${(-i.c[1] * p.h * s).toFixed(2)}px;`;
      let top = sh + 6;
      if (p.label) {
        const l = D.el('div', 'pl2-lab' + (p.role ? ' r-' + p.role : ''), e, ROLE(p.role) + `<span>${D.fmt(p.label)}</span>`);
        l.style.cssText = `top:${Math.round(top)}px;`;
        top += LAB - 4;
      }
      if (p.cap) D.el('div', 'pl2-cap', e, D.fmt(p.cap)).style.cssText = `top:${Math.round(top)}px;`;
      out.push({ e, at: p.at || 0 });
      if (vertical) y += sh + ex + GAP; else x += slotW[k] + GAP;
    });
    return out;
  };

  /* ---------- plate ---------- */
  D.parts.plate = function (def, host) {
    const H = def.box[3];
    host.innerHTML = '<div class="pl2"></div>';
    const root = host.firstChild;
    const timed = [];
    let top = 0, bottom = H, right = 1560;
    const hd = def.head;
    if (hd) {
      const h = D.el('div', 'pl2-head', root);
      if (hd.name) {
        const who = D.el('div', 'pl2-who', h, `<b>${D.fmt(hd.name)}</b>` + (hd.facts ? `<span>${D.fmt(hd.facts)}</span>` : ''));
        void who;
      }
      if (hd.claim) D.el('div', 'pl2-claim' + (hd.name ? '' : ' solo'), h, ROLE(hd.role === undefined ? 'claim' : hd.role) + `<span>${D.fmt(hd.claim)}</span>`);
      top = 96;
    }
    if (def.foot && def.foot.length) {
      const f = D.el('div', 'pl2-foot', root);
      def.foot.forEach((c) => {
        const e = D.el('div', 'pl2-lab big pl2-x' + (c.role ? ' r-' + c.role : ''), f, ROLE(c.role) + `<span>${D.fmt(c.text)}</span>`);
        timed.push({ e, at: c.at || 0 });
      });
      if (def.side) { f.classList.add('side'); right = 1070; } else bottom = H - 84;
    }
    const els = D.plateRow(root, def.panels, [40, top + 8, right - 40, bottom - top - 8]);
    return {
      show(b) { els.concat(timed).forEach((k) => k.e.classList.toggle('shown', b >= k.at)); }
    };
  };

  /* ---------- pins: a map with every locality at once ---------- */
  D.parts.pins = function (def, host) {
    const BX = def.imgBox || [40, 0, 1520, 640];
    const c = def.crop || [0, 0, 1, 1];
    const cw = def.w * (c[2] - c[0]), ch = def.h * (c[3] - c[1]);
    const s = Math.min(BX[2] / cw, (BX[3] - 30) / ch), W = Math.round(cw * s), Hh = Math.round(ch * s);
    const L = BX[0] + Math.round((BX[2] - W) / 2), T = BX[1];
    host.innerHTML = '<div class="pn"></div>';
    const root = host.firstChild;
    const fr = D.el('div', 'pn-map', root);
    fr.style.cssText = `left:${L}px;top:${T}px;width:${W}px;height:${Hh}px;`;
    const im = D.el('img', '', fr);
    im.draggable = false; im.src = def.src; im.alt = '';
    im.style.cssText = `width:${def.w * s}px;height:${def.h * s}px;left:${-c[0] * def.w * s}px;top:${-c[1] * def.h * s}px;`;
    D.el('div', 'pn-cap', root, D.fmt(def.cap || '')).style.cssText = `left:${L}px;width:${W}px;top:${T + Hh + 6}px;`;
    const sv = D.svg('svg', { class: 'pn-svg', viewBox: '0 0 1600 690', width: 1600, height: 690 }, root);
    const at = (p) => ({ x: L + (p.x * def.w - c[0] * def.w) * s, y: T + (p.y * def.h - c[1] * def.h) * s });
    def.pins.forEach((p) => {
      const q = at(p), lx = q.x + (p.dx || 0), ly = q.y + (p.dy || 0);
      D.svg('line', { class: 'pn-line', x1: q.x, y1: q.y, x2: lx, y2: ly }, sv);
      D.svg('circle', { class: 'pn-dot', cx: q.x, cy: q.y, r: 11 }, sv);
      const names = (p.names || []).map((n) => `<i>${D.esc(n)}</i>`).join('<br>');
      const lab = D.el('div', 'pn-lab ' + (p.side || 'r'), root, (p.place ? `<b>${D.esc(p.place)}</b>` : '') + names);
      lab.style.cssText = `left:${lx}px;top:${ly}px;`;
    });
    return {};
  };
})();
