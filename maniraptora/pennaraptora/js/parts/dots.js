/* A redrawn dot-and-range chart: one value (or range) per taxon, grouped, with a
 * reference line. One series, so no legend; the group names label the rows.
 *
 *   dots    groups: [{ name, items: [{ name, lo, hi }] }]   hi optional
 *           min, max: the axis. line: { at, label }. axis: the axis title. cap: source.
 *           Hover a dot for its value.
 */
(function () {
  'use strict';
  const D = window.Deck;
  const NS = 'http://www.w3.org/2000/svg';
  D.parts.dots = function (def, host) {
    const BW = def.box[2], BH = def.box[3], CAPH = 34, AX = 46, H = BH - CAPH - AX;
    const LW = def.labelW || 360, GW = def.groupW || 170, X0 = GW + LW, X1 = BW - 30;
    const rows = []; def.groups.forEach((g, gi) => g.items.forEach((it, i) => rows.push({ g, gi, it, first: i === 0 })));
    const n = rows.length + def.groups.length * 0.5, rh = H / n;
    const x = (v) => X0 + (v - def.min) / (def.max - def.min) * (X1 - X0);
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'dt-svg'); svg.setAttribute('width', BW); svg.setAttribute('height', BH - CAPH);
    host.appendChild(svg);
    const add = (tag, attrs, text) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; svg.appendChild(e); return e; };
    /* grid and axis */
    for (let v = Math.ceil(def.min * 10) / 10; v <= def.max + 1e-9; v += 0.2) {
      add('line', { class: 'dt-grid', x1: x(v), x2: x(v), y1: 0, y2: H });
      add('text', { class: 'dt-tick', x: x(v), y: H + 26, 'text-anchor': 'middle' }, v.toFixed(1));
    }
    add('text', { class: 'dt-axis', x: (X0 + X1) / 2, y: H + AX + 2, 'text-anchor': 'middle' }, def.axis || '');
    let y = 0, last = -1;
    rows.forEach((r) => {
      if (r.gi !== last) { y += rh * (last < 0 ? 0.25 : 0.5); last = r.gi; add('text', { class: 'dt-group', x: 0, y: y + rh * 0.68 }, r.g.name); }
      const cy = y + rh / 2;
      const t = add('text', { class: 'dt-name', x: X0 - 16, y: cy + 7, 'text-anchor': 'end' }, r.it.name);
      if (r.it.hi != null) add('line', { class: 'dt-range', x1: x(r.it.lo), x2: x(r.it.hi), y1: cy, y2: cy });
      const v = r.it.hi != null ? (r.it.lo + r.it.hi) / 2 : r.it.lo;
      const c = add('circle', { class: 'dt-dot', cx: x(v), cy, r: 8 });
      const tip = document.createElementNS(NS, 'title');
      tip.textContent = `${r.it.name}: ${r.it.hi != null ? r.it.lo.toFixed(2) + '–' + r.it.hi.toFixed(2) : r.it.lo.toFixed(2)}`;
      c.appendChild(tip); t.appendChild(tip.cloneNode(true));
      y += rh;
    });
    if (def.line) {
      add('line', { class: 'dt-ref', x1: x(def.line.at), x2: x(def.line.at), y1: -6, y2: H });
      add('text', { class: 'dt-reflab', x: x(def.line.at) + 10, y: 14 }, def.line.label);
    }
    const cap = D.el('div', 'tr-cap', host); cap.style.top = (BH - CAPH + 4) + 'px'; cap.innerHTML = D.fmt(def.cap || '');
    return {};
  };
})();
