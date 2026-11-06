/* Plain slides: pictures laid out for you, with a few short labels.
 *
 *   plate   A header (animal name, where and when, the topic), one to four pictures
 *           in a row, each with an optional label carrying one of the five question
 *           icons, and a foot of short chips. Everything is on screen at once unless
 *           a panel or chip carries at: n (it comes on at build n).
 *           def.key puts a numbered key beside a figure that labels things by number.
 *           def.between puts one card in the gap between two figures.
 *           def.tall gives one figure its own full-height column at the right; the
 *           other pictures and the foot share the left.
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
  const CAPH = 28, GAP = 30, MIDGAP = 300;
  const labRaw = (p) => String(p.label).replace(/[_*=]/g, '').length * 13.5 + 80;
  const labW = (p) => Math.min(380, Math.max(200, labRaw(p)));

  /* opts.gap widens the space between pictures; opts.lab fixes the label's height. */
  D.plateRow = function (root, panels, box, dir, opts) {
    const vertical = dir === 'col';
    const G = (opts && opts.gap) || GAP;
    LAB = (opts && opts.lab) || (panels.some((p) => p.label && labRaw(p) > 380) ? 96 : 60);
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
        const tot = items.reduce((s, i) => s + (i.p.label ? Math.max(i.a * h, labW(i.p)) : i.a * h), 0) + G * (n - 1);
        if (tot <= box[2]) break;
      }
      items.forEach((i, k) => { sizes[k] = { w: i.a * h, h }; });
    } else {
      let t;
      for (t = box[3]; t > 40; t -= 4) {
        const tot = items.reduce((s, i) => s + Math.min(box[2] / i.a, (i.p.weight || 1) * t) + exOf(i), 0) + G * (n - 1);
        if (tot <= box[3]) break;
      }
      items.forEach((i, k) => { const hh = Math.min(box[2] / i.a, (i.p.weight || 1) * t); sizes[k] = { w: hh * i.a, h: hh }; });
    }
    const slotW = items.map((i, k) => vertical ? sizes[k].w : (i.p.label ? Math.max(sizes[k].w, labW(i.p)) : sizes[k].w));
    const total = vertical
      ? sizes.reduce((s, k, j) => s + k.h + exOf(items[j]), 0) + G * (n - 1)
      : slotW.reduce((s, v) => s + v, 0) + G * (n - 1);
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
      out.push({ e, at: p.at || 0, x, y, w: sl, h: sh });
      if (vertical) y += sh + ex + G; else x += slotW[k] + G;
    });
    return out;
  };

  /* ---------- plate ---------- */
  D.parts.plate = function (def, host) {
    const H = def.box[3];
    host.innerHTML = '<div class="pl2"></div>';
    const root = host.firstChild;
    const timed = [];
    let top = 0, bottom = H, right = 1560, foot = null;
    const hd = def.head;
    if (hd) {
      const h = D.el('div', 'pl2-head', root);
      if (hd.name) {
        const who = D.el('div', 'pl2-who', h, `<b>${D.fmt(hd.name)}</b>` + (hd.facts ? `<span>${D.fmt(hd.facts)}</span>` : ''));
        void who;
      }
      if (hd.topic) D.el('div', 'pl2-topic' + (hd.name ? '' : ' solo'), h, `<span>${D.fmt(hd.topic)}</span>`);
      top = 96;
    }
    if (def.foot && def.foot.length) {
      const f = foot = D.el('div', 'pl2-foot', root);
      def.foot.forEach((c) => {
        const e = D.el('div', 'pl2-lab big pl2-x' + (c.role ? ' r-' + c.role : ''), f, ROLE(c.role) + `<span>${D.fmt(c.text)}</span>`);
        timed.push({ e, at: c.at || 0 });
      });
      if (def.side) { f.classList.add('side'); right = 1070; } else bottom = H - 84;
    }
    if (def.key) {
      const k = D.el('div', 'pl2-key', root);
      def.key.forEach((r) => { D.el('b', '', k, D.esc(r.n)); D.el('span', '', k, D.fmt(r.text)); });
      right = 1040;
    }
    let els = [];
    if (def.tall) {
      const t = def.tall, c = t.crop || [0, 0, 1, 1], free = H - top - 8;
      const tallH = free - (t.label ? 60 : 0) - (t.cap ? CAPH : 0);
      const tallW = Math.round(tallH * (t.w * (c[2] - c[0])) / (t.h * (c[3] - c[1])));
      right -= tallW + GAP;
      els = D.plateRow(root, [t], [right + GAP, top + 8, tallW, free], 'row', { lab: 60 });
      if (foot) foot.style.right = (1600 - right) + 'px';
    }
    els = els.concat(D.plateRow(root, def.panels, [40, top + 8, right - 40, bottom - top - 8], 'row', { gap: def.between ? MIDGAP : 0 }));
    if (def.between) {
      const a = els[0], b = els[1], m = def.between;
      const card = D.el('div', 'pl2-lab big pl2-x pl2-mid' + (m.role ? ' r-' + m.role : ''), root, ROLE(m.role) + `<span>${D.fmt(m.text)}</span>`);
      card.style.cssText = `left:${Math.round(a.x + a.w + 16)}px;width:${Math.round(b.x - a.x - a.w - 32)}px;top:${Math.round(a.y + a.h / 2)}px;`;
      timed.push({ e: card, at: 0 });
    }
    return {
      show(b) { els.concat(timed).forEach((k) => k.e.classList.toggle('shown', b >= k.at)); }
    };
  };
})();
