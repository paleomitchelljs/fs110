/* Pictures drawn for particular claims. Each is a view on the claim page:
 * D.viz[kind](layer, view, claim, idx) returns { show(b, how, on, entering), reset() }.
 * layer is 740 × 480 stage pixels. Numbers are the paper's; the drawings are schematic. */
(function () {
  'use strict';
  const D = window.Deck;
  const svg = (layer, w, h) => D.svg('svg', { class: 'vz-svg', viewBox: `0 0 ${w} ${h}`, width: w, height: h }, layer);
  const text = (p, x, y, s, cls, anchor) => {
    const t = D.svg('text', { x, y, class: cls, 'text-anchor': anchor || 'start' }, p);
    t.innerHTML = D.fmt(s).replace(/<i>/g, '<tspan font-style="italic">').replace(/<\/i>/g, '</tspan>');
    return t;
  };

  /* ---------- claim 2: femur and mass ---------- */
  D.viz.mass = function (layer, v) {
    const s = svg(layer, 740, 480);
    const X0 = 190;
    const show = {};
    const grp = (k) => (show[k] = D.svg('g', { class: 'reveal' }, s));

    // femur bars, 1 px per mm
    const a = grp('anzu');
    text(a, 0, 76, '_Anzu_', 'ms-lab');
    D.svg('rect', { class: 'ms-bar', x: X0, y: 48, width: 500, height: 32, rx: 4 }, a);
    D.svg('rect', { class: 'ms-ext', x: X0 + 500, y: 48, width: 25, height: 32, rx: 4 }, a);
    text(a, X0, 38, '500–525 mm', 'ms-val');

    const f = grp('femur');
    text(f, 0, 186, '_Infernogallus_', 'ms-lab');
    D.svg('rect', { class: 'ms-bar', x: X0, y: 158, width: 185, height: 32, rx: 4 }, f);
    text(f, X0 + 200, 186, '~185 mm', 'ms-val');

    // femur -> equation -> mass
    const q = grp('eq');
    D.svg('path', { class: 'ms-arrow', d: `M${X0 + 92} 206 V276 M${X0 + 80} 262 l12 14 12 -14` }, q);
    text(q, X0 + 120, 250, 'equation', 'ms-lab');

    // mass axis 0–20 kg
    const kx = (k) => X0 + k * 25.5;
    D.svg('path', { class: 'ms-axis', d: `M${kx(0)} 350 H${kx(20)}` }, s);
    [0, 5, 10, 15, 20].forEach((k) => {
      D.svg('path', { class: 'ms-axis', d: `M${kx(k)} 350 v10` }, s);
      text(s, kx(k), 388, String(k), 'ms-tick', 'middle');
    });
    text(s, 0, 360, 'kg', 'ms-lab');
    const m = grp('mass');
    D.svg('rect', { class: 'ms-range', x: kx(9), y: 306, width: kx(15) - kx(9), height: 40, rx: 6 }, m);
    D.svg('circle', { class: 'ms-me', cx: kx(12), cy: 326, r: 15 }, m);
    text(m, kx(12), 292, '12 kg', 'ms-val', 'middle');
    text(m, kx(9), 438, '9', 'ms-tick', 'middle');
    return {
      show(b) {
        const at = v.at;
        show.femur.classList.toggle('on', b >= at.femur);
        show.eq.classList.toggle('on', b >= at.eq);
        show.mass.classList.toggle('on', b >= at.mass);
        show.anzu.classList.toggle('on', b >= at.anzu);
      }
    };
  };

  /* ---------- claim 4: which "oviraptor"? ---------- */
  D.viz.nest = function (layer) {
    const s = svg(layer, 740, 430);
    const box = (k, x, y, w, h, label, lx, ly, size) => {
      const r = D.svg('rect', { class: 'ns-box', x, y, width: w, height: h, rx: 20 }, s);
      const t = text(s, lx, ly, label, 'ns-lab');
      if (size) t.setAttribute('style', `font-size:${size}px`);
      return r;
    };
    const B = {};
    B.osaur = box('osaur', 6, 6, 728, 392, 'Oviraptorosauria', 26, 40);
    B.idae = box('idae', 30, 64, 262, 318, 'Oviraptoridae', 46, 98);
    B.cae = box('cae', 316, 64, 398, 318, 'Caenagnathidae', 332, 98);
    box('euc', 336, 112, 358, 258, 'Eucaenagnathinae', 350, 142, 22);
    B.genus = D.svg('rect', { class: 'ns-box', x: 52, y: 270, width: 218, height: 54, rx: 12 }, s);
    text(s, 161, 306, 'Oviraptor', 'ns-lab', 'middle');
    ['Citipati', 'Conchoraptor', 'Khaan'].forEach((n, i) => text(s, 161, 150 + i * 30, '_' + n + '_', 'ns-dim', 'middle'));
    ['Anzu', 'Chirostenotes', 'Elmisaurus'].forEach((n, i) => text(s, 352, 188 + i * 30, '_' + n + '_', 'ns-dim'));
    D.svg('circle', { class: 'ns-dot', cx: 612, cy: 288, r: 15 }, s);
    text(s, 612, 334, '_Infernogallus_', 'ns-lab', 'middle').setAttribute('style', 'font-size:23px');
    const verdict = text(s, 690, 62, '', 'ns-verdict', 'end');

    const pills = D.el('div', 'ns-pills', layer);
    const picks = [['Oviraptor', 'genus', false], ['Oviraptoridae', 'idae', false], ['Oviraptorosauria', 'osaur', true]];
    const btn = picks.map(([label, key, yes]) => {
      const p = D.el('button', 'ns-pill', pills, label);
      p.type = 'button';
      p.addEventListener('click', () => pick(p.classList.contains('on') ? null : key));
      return { p, key, yes };
    });
    function pick(key) {
      Object.values(B).forEach((r) => r.setAttribute('class', 'ns-box'));
      btn.forEach((x) => x.p.classList.toggle('on', x.key === key));
      verdict.classList.toggle('on', !!key);
      if (!key) return;
      const hit = btn.find((x) => x.key === key);
      B[key].setAttribute('class', 'ns-box pick' + (hit.yes ? '' : ' no'));
      verdict.textContent = hit.yes ? '✓' : '✗';
      verdict.style.fill = hit.yes ? 'var(--accent-ink)' : 'var(--critical)';
    }
    return { reset() { pick(null); } };
  };

  /* ---------- claim 6: the sliding jaw joint ---------- */
  D.viz.jaw = function (layer, v, c, idx) {
    const s = svg(layer, 740, 480);
    const PX = 5.2, MAX = 78;                        // 15 mm; the skull block is ~557 px, so 15 mm is 14%
    D.svg('path', { class: 'jw-skull', d: 'M70 60 H627 V200 H500 Q496 170 480 170 H360 Q344 170 340 200 H70 Z' }, s);
    text(s, 250, 44, '◀ front', 'jw-lab');
    text(s, 420, 150, 'saddle', 'jw-lab', 'middle');
    text(s, 200, 135, 'skull', 'jw-lab', 'middle');
    const jaw = D.svg('g', { class: 'jw-handle' }, s);
    D.svg('path', { class: 'jw-jaw', d: 'M58 232 H438 V190 Q438 176 452 176 H466 Q480 176 480 190 V232 H582 Q600 232 600 250 V294 Q600 312 582 312 H58 Q40 312 40 294 V250 Q40 232 58 232 Z' }, jaw);
    text(jaw, 459, 276, 'ridge', 'jw-lab', 'middle');
    text(jaw, 300, 280, 'jaw', 'jw-lab', 'middle');
    // a fat invisible target so the jaw is easy to grab
    D.svg('rect', { x: 20, y: 160, width: 600, height: 170, fill: 'transparent' }, jaw);

    // how far it moved, live
    const ry = 392;
    text(s, 0, ry + 8, '_Infernogallus_', 'jw-lab');
    D.svg('rect', { x: 250, y: ry - 14, width: MAX, height: 28, rx: 6, fill: 'none', stroke: 'var(--ink-2)', 'stroke-width': 3 }, s);
    const fill = D.svg('rect', { x: 250, y: ry - 14, width: 0, height: 28, rx: 6, fill: 'var(--accent)' }, s);
    const read = text(s, 250 + MAX + 18, ry + 14, '0 mm', 'jw-read');
    read.setAttribute('style', 'font-size:44px');
    // the comparison the paper doesn't put a number on
    text(s, 0, ry + 74, 'typical oviraptor', 'jw-lab');
    D.svg('path', { class: 'jw-unk', d: `M250 ${ry + 62} v12 h30 v-12` }, s);
    text(s, 300, ry + 86, '?', 'jw-unk-t');

    const unk = [...s.querySelectorAll('.jw-unk, .jw-unk-t')];
    let dx = 0, stop = null;
    const set = (x) => {
      dx = D.clamp(x, -MAX, 0);
      jaw.setAttribute('transform', `translate(${dx} 0)`);
      fill.setAttribute('width', -dx);
      read.textContent = Math.round(-dx / PX) + ' mm';
    };
    // drag
    jaw.addEventListener('pointerdown', (ev) => {
      ev.preventDefault(); ev.stopPropagation();
      if (stop) stop();
      jaw.setPointerCapture(ev.pointerId);
      const x0 = ev.clientX, d0 = dx;
      const move = (m) => set(d0 + (m.clientX - x0) / D.scale);
      const up = () => { jaw.removeEventListener('pointermove', move); jaw.removeEventListener('pointerup', up); jaw.removeEventListener('pointercancel', up); };
      jaw.addEventListener('pointermove', move); jaw.addEventListener('pointerup', up); jaw.addEventListener('pointercancel', up);
    });
    set(0);
    return {
      show(b, how, on, entering) {
        unk.forEach((e) => e.classList.toggle('on', b >= idx.alt + 2));
        // a short glide as it comes on, so the motion is the first thing seen
        if (entering && how === 'step') {
          if (stop) stop();
          stop = D.tween(1800, (k) => set(-MAX * Math.sin(Math.PI * k)));
        }
      },
      hide() { if (stop) stop(); },
      reset() { set(0); }
    };
  };

  /* ---------- claim 9: found so far, and two ways it could go on ---------- */
  D.viz.accum = function (layer, v, c, idx) {
    const s = svg(layer, 740, 480);
    const X0 = 70, Y0 = 400, W = 630, H = 300, T = 0.55;
    const G = (t) => 1 - Math.exp(-3 * t);
    const px = (t) => X0 + W * t, py = (g) => Y0 - H * g;
    const path = (f, t0, t1) => { let d = ''; for (let i = 0; i <= 40; i++) { const t = t0 + (t1 - t0) * i / 40; d += (i ? 'L' : 'M') + px(t).toFixed(1) + ' ' + py(f(t)).toFixed(1); } return d; };
    D.svg('path', { class: 'ac-axis', d: `M${X0} 30 V${Y0} H710` }, s);
    text(s, 390, 442, 'digging', 'ac-lab', 'middle');
    const yl = text(s, 28, 215, 'species found', 'ac-lab', 'middle');
    yl.setAttribute('transform', 'rotate(-90 28 215)');
    D.svg('path', { class: 'ac-data', d: path(G, 0, T) }, s);
    const g = D.svg('g', { class: 'reveal' }, s);
    D.svg('path', { class: 'ac-fork ac-a', d: path(G, T, 1) }, g);
    const slope = 3 * Math.exp(-3 * T);
    D.svg('path', { class: 'ac-fork ac-b', d: path((t) => G(T) + slope * (t - T), T, 1) }, g);
    text(g, 640, py(G(1)) + 30, 'levelling off', 'ac-lab', 'end');
    text(g, 650, py(G(T) + slope * (1 - T)) - 14, 'still climbing', 'ac-lab', 'end').setAttribute('style', 'fill:var(--accent-ink)');
    D.svg('circle', { class: 'ac-now', cx: px(T), cy: py(G(T)), r: 13 }, s);
    text(s, px(T) - 20, py(G(T)) + 40, 'now', 'ac-lab', 'end');
    text(s, 705, 468, 'schematic', 'ac-tag', 'end');
    return { show(b) { g.classList.toggle('on', b >= idx.alt + 2); } };
  };
})();
