/* learning-dag.png as a diagram you can push on, and the same model as a curve.
 * Two things are live: Time (drag across its box) and Study Methods (drag across its box). Everything downstream moves.
 * Chart: study time across, expected score up. The shaded band is every score the model can give at that time, from the
 * worst study method to the best. Drag the dot along the curve for time; drag the knob at the right edge for method.
 * Both share one saved state: Deck.get('model').
 */
(function () {
  'use strict';
  const D = Deck, M = Model, clamp = D.clamp;
  const NQ = [10, 11, 12].map((c) => EXAM.q.filter((q) => q.ch === c).length);
  const CHAPS = [10, 11, 12];
  /* T is the overall study time, always the mean of TC, the time spent on each chapter. split: show the three on the diagram. */
  const state = () => {
    const s = D.get('model', () => ({ T: M.T0, M: M.M0, TC: [M.T0, M.T0, M.T0], split: false }));
    if (!s.TC) { s.TC = [s.T, s.T, s.T]; s.split = false; }
    return s;
  };
  const scoreOf = (s) => M.scoreSplit(s.TC, s.M, NQ);
  D.modelScore = scoreOf;
  D.modelNQ = NQ;
  D.modelState = state;
  const subs = [];
  D.onModel = (fn) => { subs.push(fn); };
  /* p.T sets every chapter to that time; p.TC sets chapters and T follows. */
  function setModel(p) {
    const s = state();
    if (p.T != null) { s.T = p.T; s.TC = [p.T, p.T, p.T]; }
    if (p.TC) { s.TC = p.TC; s.T = M.mean(p.TC); }
    if (p.M != null) s.M = p.M;
    if (p.split != null) s.split = p.split;
    subs.forEach((f) => f()); D.save();
  }
  D.setModel = setModel;
  const BASE = Math.round(M.score(M.T0, M.M0));
  const avg = (f, s) => s.TC.reduce((a, t, i) => a + NQ[i] * f(t), 0) / M.N;

  /* ---------- the diagram ---------- */
  const SC = 0.95, OX = 120, OY = 56;
  const NODES = [
    { id: 'assess', t: 'Assessment', x: 460, y: 55, w: 270, h: 70, c: 'do' },
    { id: 'interest', t: 'Interest', x: 62, y: 160, w: 230, h: 100, c: 'have' },
    { id: 'class', t: 'Class', x: 460, y: 160, w: 155, h: 100, c: 'do' },
    { id: 'time', t: 'Time', x: 128, y: 328, w: 230, h: 100, c: 'have' },
    { id: 'effort', t: 'Effort', x: 430, y: 328, w: 185, h: 100, c: 'do' },
    { id: 'under', t: 'Understanding', x: 790, y: 328, w: 330, h: 100, c: 'get' },
    { id: 'grade', t: 'Grade', x: 1225, y: 328, w: 175, h: 100, c: 'get' },
    { id: 'prior', t: 'Prior Knowledge', x: 62, y: 495, w: 265, h: 100, c: 'have' },
    { id: 'method', t: 'Study Methods', x: 350, y: 495, w: 265, h: 100, c: 'do' }
  ];
  const ARROWS = [
    ['have', 'M292 208C360 208 360 378 428 378'],
    ['have', 'M85 262V493'],
    ['have', 'M358 378H428'],
    ['have', 'M190 596C300 650 700 660 880 604C935 586 952 520 956 432'],
    ['do', 'M615 378C650 378 660 332 712 332'],
    ['do', 'M615 378C650 378 660 426 712 426'],
    ['do', 'M615 210C700 210 712 260 712 332'],
    ['do', 'M615 548C700 548 712 480 712 426'],
    ['do', 'M712 332C750 335 760 360 788 378'],
    ['do', 'M712 426C750 422 760 395 788 378'],
    ['do', 'M730 90C1000 90 1160 200 1167 376'],
    ['get', 'M1120 378H1223'],
    ['get', 'M956 326C950 210 900 120 560 120C400 120 250 135 190 158']
  ];
  const GATES = [[712, 332], [712, 426], [1167, 378]];

  D.Dag = function (host) {
    const root = D.el('div', 'dag', host);
    const svg = D.svg('svg', { viewBox: '0 0 1600 900', class: 'dag-svg' }, root);
    const defs = D.svg('defs', {}, svg);
    ['have', 'do', 'get'].forEach((c) => {
      const m = D.svg('marker', { id: 'ar-' + c, viewBox: '0 0 10 10', refX: 8, refY: 5, markerUnits: 'userSpaceOnUse', markerWidth: 22, markerHeight: 22, orient: 'auto-start-reverse' }, defs);
      D.svg('path', { d: 'M0 0L10 5L0 10z', class: 'ah ' + c }, m);
    });
    const g = D.svg('g', { transform: 'translate(' + OX + ' ' + OY + ') scale(' + SC + ')' }, svg);
    ARROWS.forEach(([c, d]) => D.svg('path', { d, class: 'arr ' + c, 'marker-end': 'url(#ar-' + c + ')' }, g));
    GATES.forEach(([x, y]) => D.svg('circle', { cx: x, cy: y, r: 9, class: 'gate' }, g));

    const nodes = {};
    NODES.forEach((n) => {
      const e = D.el('div', 'nd ' + n.c, root, '<i class="fl"></i><span class="nt">' + n.t + '</span><b class="nv"></b>');
      e.style.left = (OX + n.x * SC) + 'px'; e.style.top = (OY + n.y * SC) + 'px';
      e.style.width = (n.w * SC) + 'px'; e.style.height = (n.h * SC) + 'px';
      nodes[n.id] = { e, fl: e.querySelector('.fl'), nv: e.querySelector('.nv'), n };
    });
    /* the two ends of the method node, and a tick for where each live node started */
    nodes.method.e.insertAdjacentHTML('beforeend', '<span class="end l">' + D.icons.method + '</span><span class="end r">' + D.icons.runner + '</span>');
    [['time', M.T0], ['method', M.M0]].forEach(([id, v]) => {
      const t = D.el('i', 'was', nodes[id].e); t.style.left = (v * 100) + '%';
    });
    const tn = nodes.time.e;
    const subs3 = D.el('div', 'subs', tn, CHAPS.map((c) => '<div class="sr" data-ch="' + c + '"><i></i><b></b></div>').join(''));
    const sr = Array.from(subs3.children);
    const tog = D.el('button', 'tool sm', root, D.icons.chapter);
    tog.type = 'button'; tog.title = 'Time per chapter'; tog.setAttribute('aria-label', 'Time per chapter');
    tog.style.cssText = 'left:' + (OX + 128 * SC + 8) + 'px;top:' + (OY + 262 * SC) + 'px';
    tog.addEventListener('click', () => setModel({ split: !state().split }));
    const live = { time: false, method: false };
    let row = null;
    function wire(id, key) {
      const e = nodes[id].e, n = nodes[id].n;
      D.drag(e, root, (x, y) => {
        if (!live[id]) return;
        const v = clamp((x - (OX + n.x * SC)) / (n.w * SC), 0, 1);
        if (id === 'time' && state().split) {
          if (row == null) row = clamp(Math.floor((y - (OY + n.y * SC)) / (n.h * SC / 3)), 0, 2);
          const tc = state().TC.slice(); tc[row] = v; setModel({ TC: tc });
        } else setModel({ [key]: v });
      }, () => { row = null; });
    }
    wire('time', 'T'); wire('method', 'M');

    const set = (id, frac, txt) => {
      const nd = nodes[id];
      nd.fl.style.width = (clamp(frac, 0, 1) * 100) + '%';
      nd.nv.innerHTML = txt == null ? '' : txt;
    };
    function refresh() {
      const s = state(), sc = scoreOf(s), d = Math.round(sc) - BASE;
      tn.classList.toggle('split', s.split); tog.classList.toggle('on', s.split);
      sr.forEach((r, i) => { r.firstChild.style.width = (s.TC[i] * 100) + '%'; r.lastChild.textContent = Math.round(s.TC[i] * 100); });
      set('time', s.split ? 0 : s.T, s.split ? '' : Math.round(s.T * 100) + '%');
      const ef = avg(M.E, s), un = avg((t) => M.U(t, s.M), s);
      set('effort', ef, Math.round(ef * 100) + '%');
      set('method', s.M, '');
      set('class', M.C, '');
      set('prior', M.P, '');
      set('under', un, Math.round(un * 100) + '%');
      set('grade', sc / M.N, Math.round(sc) + '<small>/' + M.N + '</small>' + (d ? '<u class="' + (d > 0 ? 'up' : 'dn') + '">' + (d > 0 ? '+' : '−') + Math.abs(d) + '</u>' : ''));
    }
    D.onModel(refresh);
    refresh();
    return {
      /* which nodes take a drag, and which are lit as live */
      live(o) {
        Object.assign(live, o);
        tog.classList.toggle('off', !live.time);
        Object.keys(live).forEach((id) => { nodes[id].e.classList.toggle('live', live[id]); nodes[id].e.classList.toggle('locked', !live[id]); });
      },
      refresh
    };
  };

  /* ---------- the curve ---------- */
  D.Chart = function (host, b) {
    const w = b.w, h = b.h, ml = 96, mr = 150, mt = 76, mb = 64, pw = w - ml - mr, ph = h - mt - mb;
    const X = (t) => ml + t * pw, Y = (s) => mt + ph * (1 - s / M.N);
    const box = D.el('div', 'chart', host);
    box.style.cssText = 'left:' + b.x + 'px;top:' + b.y + 'px;width:' + w + 'px;height:' + h + 'px';
    const svg = D.svg('svg', { viewBox: '0 0 ' + w + ' ' + h, width: w, height: h }, box);
    const path = (m, t1) => { let d = ''; for (let i = 0; i <= 60; i++) { const t = i / 60 * (t1 == null ? 1 : t1); d += (i ? 'L' : 'M') + X(t).toFixed(1) + ' ' + Y(M.score(t, m)).toFixed(1); } return d; };
    // axes
    [14, 28, 42].forEach((v) => {
      D.svg('path', { d: 'M' + ml + ' ' + Y(v) + 'H' + (ml + pw), class: 'grid' }, svg);
      D.svg('text', { x: ml - 14, y: Y(v) + 8, 'text-anchor': 'end', class: 'tk' }, svg).textContent = v;
    });
    [0, 0.25, 0.5, 0.75, 1].forEach((t) => {
      D.svg('text', { x: X(t), y: mt + ph + 40, 'text-anchor': 'middle', class: 'tk' }, svg).textContent = Math.round(t * 100) + '%';
    });
    D.svg('path', { d: 'M' + ml + ' ' + mt + 'V' + (mt + ph) + 'H' + (ml + pw), class: 'axis' }, svg);
    // the band: worst method to best method
    let band = path(1); for (let i = 60; i >= 0; i--) { const t = i / 60; band += 'L' + X(t).toFixed(1) + ' ' + Y(M.score(t, 0)).toFixed(1); }
    D.svg('path', { d: band + 'Z', class: 'band' }, svg);
    D.svg('path', { d: path(1), class: 'edge' }, svg);
    D.svg('path', { d: path(0), class: 'edge' }, svg);
    const curve = D.svg('path', { class: 'curve' }, svg);
    // where they started
    D.svg('circle', { cx: X(M.T0), cy: Y(M.score(M.T0, M.M0)), r: 13, class: 'was' }, svg);
    const dropV = D.svg('path', { class: 'drop' }, svg), dropH = D.svg('path', { class: 'drop' }, svg);
    const num = D.svg('text', { class: 'big', 'text-anchor': 'end' }, svg);
    const dot = D.svg('circle', { r: 17, class: 'dot' }, svg);
    // the method knob, on the right edge, between the worst and best method at full time
    const kx = X(1) + 54, track = D.svg('path', { class: 'track', d: 'M' + kx + ' ' + Y(M.score(1, 0)) + 'V' + Y(M.score(1, 1)) }, svg);
    const knob = D.svg('circle', { r: 17, cx: kx, class: 'knob' }, svg);
    const ic = (name, y) => {
      const g = D.svg('g', { transform: 'translate(' + (kx - 18) + ' ' + y + ') scale(1.5)', class: 'kic' }, svg);
      g.innerHTML = D.icons[name].replace(/^<svg[^>]*>|<\/svg>$/g, '');
    };
    ic('runner', Y(M.score(1, 1)) - 48); ic('method', Y(M.score(1, 0)) + 10);
    function refresh() {
      const s = state(), sc = scoreOf(s);
      curve.setAttribute('d', path(s.M, 1));
      dot.setAttribute('cx', X(s.T)); dot.setAttribute('cy', Y(sc));
      dropV.setAttribute('d', 'M' + X(s.T) + ' ' + Y(sc) + 'V' + (mt + ph));
      dropH.setAttribute('d', 'M' + X(s.T) + ' ' + Y(sc) + 'H' + ml);
      num.setAttribute('x', ml - 14); num.setAttribute('y', Y(sc) - 14); num.textContent = Math.round(sc);
      knob.setAttribute('cy', Y(M.score(1, s.M)));
    }
    D.onModel(refresh);
    D.drag(dot, box, (x) => setModel({ T: clamp((x - ml) / pw, 0, 1) }));
    D.drag(knob, box, (x, y) => {
      const sc = M.N * (1 - (y - mt) / ph), u = sc / M.N;
      setModel({ M: clamp(M.methodFor(u, 1), 0, 1) });
    });
    refresh();
    return { el: box, refresh };
  };
})();
