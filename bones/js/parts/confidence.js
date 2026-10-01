/* How sure, 1–5. Count hands: click a bar or press its number (shift takes
 * one back). Round 2 of the same id draws over a dashed ghost of round 1, and
 * the mean moves from one to the other. */
(function () {
  'use strict';
  const D = window.Deck, T = window.BONES.confidence;

  D.parts.confidence = function (def, host) {
    const w = def.box[2], h = def.box[3];
    const st = () => D.get('conf-' + def.id, () => ({ r1: [0, 0, 0, 0, 0], r2: [0, 0, 0, 0, 0] }));
    const mine = () => st()['r' + def.round];
    const ghost = () => def.round === 2 ? st().r1 : null;

    const L = 110, R = w - 110, base = h - 150, top = 70, slot = (R - L) / 5, bw = slot * 0.62;
    const svg = D.svg('svg', { class: 'conf', viewBox: `0 0 ${w} ${h}`, width: w, height: h }, host);
    D.svg('line', { class: 'conf-base', x1: L - 20, x2: R + 20, y1: base, y2: base }, svg);
    const bars = [0, 1, 2, 3, 4].map((i) => {
      const x = L + slot * i + (slot - bw) / 2, g = D.svg('g', { class: 'conf-col' }, svg);
      D.svg('rect', { class: 'conf-hit', x: L + slot * i, y: top - 40, width: slot, height: base - top + 130 }, g);
      const was = D.svg('rect', { class: 'conf-ghost', x, y: top, width: bw, height: base - top }, g);
      const bar = D.svg('rect', { class: 'conf-bar', x, y: top, width: bw, height: base - top }, g);
      const n = D.svg('text', { class: 'conf-n', x: x + bw / 2, 'text-anchor': 'middle' }, g);
      const k = D.svg('text', { class: 'conf-k', x: x + bw / 2, y: base + 56, 'text-anchor': 'middle' }, g);
      k.textContent = String(i + 1);
      g.addEventListener('click', (e) => bump(i, e.shiftKey ? -1 : 1));
      g.addEventListener('contextmenu', (e) => { e.preventDefault(); bump(i, -1); });
      return { was, bar, n, x };
    });
    [[0, T.low], [4, T.high]].forEach(([i, t]) => {
      D.svg('text', { class: 'conf-end', x: bars[i].x + bw / 2, y: base + 100, 'text-anchor': 'middle' }, svg).textContent = t;
    });
    const mean = D.svg('text', { class: 'conf-mean', x: R + 20, y: 30, 'text-anchor': 'end' }, svg);

    const avg = (a) => { const n = a.reduce((s, x) => s + x, 0); return n ? a.reduce((s, x, i) => s + x * (i + 1), 0) / n : null; };
    function bump(i, d) {
      const a = mine();
      a[i] = Math.max(0, a[i] + d);
      D.save(); draw();
    }
    function draw() {
      const a = mine(), g = ghost();
      const peak = Math.max(4, ...a, ...(g || [0]));
      bars.forEach((b, i) => {
        b.bar.style.transform = `scaleY(${a[i] / peak})`;
        b.was.style.transform = `scaleY(${g ? g[i] / peak : 0})`;
        b.was.style.display = g ? '' : 'none';
        b.n.textContent = a[i] ? String(a[i]) : '';
        b.n.setAttribute('y', base - (base - top) * a[i] / peak - 14);
      });
      const m1 = g ? avg(g) : null, m2 = avg(a);
      const f = (x) => x === null ? '–' : x.toFixed(1);
      mean.textContent = m2 === null && m1 === null ? '' : `${T.mean} ${g ? f(m1) + ' → ' : ''}${f(m2)}`;
    }
    draw();
    return {
      show() { draw(); },
      digit(n, shift) { if (n >= 1 && n <= 5) bump(n - 1, shift ? -1 : 1); },
      reset() { draw(); }
    };
  };
})();
