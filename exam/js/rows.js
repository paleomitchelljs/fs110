/* Four students, forty-two questions. One column per question, green for right, red for wrong (red also gets hatching).
 * The same columns move between orders: exam order, by chapter, hardest first. Results can be dealt out at random into
 * the chapter slots, which is the "luck" test: same score, no pattern but chance.
 *
 * Rows(host, { x0, y0, cellH, pitch }) -> { set(state), deal(n), real(), state, gaps }
 * state: layout 'exam' | 'chapter' | 'hard' | 'nest'; thirds (exam order in three blocks); caps (a chapter-colored cap on every column);
 *   pct (percent right per block, with the class's own percent as a tick); cls (the class row); luck (the dealt-gap dot plots);
 *   head (chapter pills); scores (the letter's score); ring (circle each uneven student's weakest chapter);
 *   nest (for layout 'nest': { order, leaves, gaps, levels }, see claims.js); lens (a length bar over every column).
 */
(function () {
  'use strict';
  const D = Deck, M = Model, X = EXAM, Q = X.q, ST = X.students, NQ = Q.length;
  const CHAPS = [10, 11, 12];
  const GAP = 34, CW = 22, DOT_X = 1344, DOT_W = 236, DOT_MAX = 0.8, RING_GAP = 0.3;
  const SPAN = 1160, GAP_BUDGET = 280, LEN_MAX = 80, LEN_H = 30;   // nested layouts: width of the columns, most room for gaps, the longest question

  const idx = Q.map((x, i) => i);
  const orders = {
    exam: idx.slice(),
    chapter: idx.slice().sort((a, b) => Q[a].ch - Q[b].ch || a - b),
    hard: idx.slice().sort((a, b) => Q[a].avg - Q[b].avg || a - b)
  };
  const FLAT = { order: idx.slice(), leaves: [{ a: 0, b: NQ }], gaps: idx.map(() => 0), levels: [] };
  function groupsFor(layout, thirds, nest) {
    if (layout === 'nest') return (nest || FLAT).leaves;
    if (layout === 'chapter') {
      let a = 0;
      return CHAPS.map((ch) => { const n = Q.filter((x) => x.ch === ch).length, g = { a, b: a + n, ch }; a += n; return g; });
    }
    if (layout === 'hard') return [{ a: 0, b: NQ / 2 }, { a: NQ / 2, b: NQ }];
    return thirds ? M.thirds(NQ) : [{ a: 0, b: NQ }];
  }
  /* Slot positions in px from the left of the first column, with a gap between groups. */
  function slots(layout, thirds, pitch, nest) {
    const gs = groupsFor(layout, thirds, nest), x = [], g = [];
    if (layout === 'nest') {
      // gaps shrink with depth; if there are many, they and then the columns give way so the row stays inside SPAN
      const gp = (nest || FLAT).gaps, total = gp.reduce((a, b) => a + b, 0), k = total > GAP_BUDGET ? GAP_BUDGET / total : 1;
      const p = Math.max(14, Math.min(pitch, (SPAN - total * k) / NQ));
      let acc = 0;
      for (let s = 0; s < NQ; s++) { acc += gp[s] * k; x[s] = s * p + acc; }
      gs.forEach((grp, gi) => { for (let s = grp.a; s < grp.b; s++) g[s] = gi; });
      return { gs, x, g, pitch: p, cw: p - 4 };
    }
    gs.forEach((grp, gi) => { for (let s = grp.a; s < grp.b; s++) { x[s] = s * pitch + gi * GAP; g[s] = gi; } });
    return { gs, x, g, pitch, cw: CW };
  }

  D.Rows = function (host, o) {
    const x0 = o.x0 == null ? 140 : o.x0, y0 = o.y0 || 150, cellH = o.cellH || 70, pitch = o.pitch || 26, rowPitch = o.rowPitch || 150;
    const root = D.el('div', 'rows still', host);
    const st = { layout: 'exam', thirds: false, caps: false, pct: false, cls: false, luck: false, head: false, scores: false, ring: false, nest: FLAT, lens: false };
    let dealt = null;                       // per student: results dealt into chapter slots, or null
    const draws = ST.map(() => []);         // per student: the gap of every deal so far
    let last = null;                        // the gap of the most recent deal
    const rowY = (k) => y0 + k * rowPitch;

    /* labels */
    const lab = ST.map((s, k) => {
      const e = D.el('div', 'slab', root, '<b>' + s.id + '</b><span></span>');
      e.style.left = (x0 - 112) + 'px'; e.style.top = (rowY(k) + 2) + 'px';
      return e;
    });
    const clsLab = D.el('div', 'slab cls', root, D.icons.people);
    clsLab.style.left = (x0 - 104) + 'px';

    /* cells: ST × questions, plus the class row (k = -1) */
    const cell = ST.map((s) => Q.map((x, j) => {
      const e = D.el('div', 'cell', root, '<i class="cap"></i><i class="len"></i>');
      e.style.height = cellH + 'px'; e.dataset.ch = x.ch; e.title = 'Q' + x.n;
      e.lastChild.style.height = Math.round(x.words / LEN_MAX * LEN_H) + 'px';
      return e;
    }));
    const clsCell = Q.map((x, j) => {
      const e = D.el('div', 'cell cls', root);
      e.style.height = Math.round(cellH * x.avg) + 'px'; e.title = 'Q' + x.n + ' · ' + Math.round(x.avg * 100) + '%';
      return e;
    });

    /* chapter pills, per-group bars, rings */
    const pills = CHAPS.map((ch) => D.el('div', 'gpill', root, String(ch)));
    pills.forEach((p, i) => p.dataset.ch = CHAPS[i]);
    const mkBar = () => {
      const b = D.el('div', 'pct', root, '<i></i><b></b>'), n = D.el('div', 'pnum', root);
      return { b, n, fill: b.firstChild, tick: b.lastChild };
    };
    const bars = ST.map(() => [0, 1, 2].map(mkBar));       // grown on demand: a nested layout can have a couple of dozen groups
    const glabs = [];                                      // nested layouts: one label per group per level
    const mkLab = () => D.el('div', 'glab', root);
    const rings = ST.map(() => D.el('div', 'ring', root));
    const legend = D.el('div', 'legend', root, D.icons.people + '<i></i>');
    legend.style.left = DOT_X + 'px'; legend.style.top = (y0 - 46) + 'px';

    /* dot plots */
    const svg = D.svg('svg', { class: 'dp', viewBox: '0 0 1600 900' }, root);
    const dg = ST.map((s, k) => {
      const g = D.svg('g', {}, svg);
      D.svg('path', { d: 'M' + DOT_X + ' ' + (rowY(k) + cellH) + 'H' + (DOT_X + DOT_W), class: 'axis' }, g);
      return g;
    });

    const dealable = () => st.layout === 'chapter' || st.layout === 'nest';
    const outcome = (k, j) => (dealt && dealable()) ? dealt[k][j] : ST[k].v[j];
    const slotOf = {};
    Object.keys(orders).forEach((n) => { slotOf[n] = []; orders[n].forEach((j, s) => { slotOf[n][j] = s; }); });
    const useNest = (n) => {
      orders.nest = n.order; slotOf.nest = [];
      n.order.forEach((j, s) => { slotOf.nest[j] = s; });
    };
    useNest(FLAT);
    const realPct = (k) => M.chapters(Q, ST[k].v);
    const realGap = ST.map((s, k) => M.gap(realPct(k)));
    const classPct = (qs) => M.mean(qs.map((j) => Q[j].avg));

    function groupStats(k, layout) {
      const L = slots(layout, st.thirds, pitch, st.nest), order = orders[layout];
      return L.gs.map((g) => {
        const qs = order.slice(g.a, g.b);
        return { g, qs, pct: M.mean(qs.map((j) => outcome(k, j))), cls: classPct(qs) };
      });
    }
    /* Best group minus worst, for results vals (by question) laid out as the current layout groups them. */
    function gapOver(vals) {
      const order = orders[st.layout];
      return M.gap(groupsFor(st.layout, st.thirds, st.nest).map((g) => ({ pct: M.mean(order.slice(g.a, g.b).map((j) => vals[j])) })));
    }
    const curGap = (k) => gapOver(ST[k].v);
    const dotMax = () => st.layout === 'nest' ? 1 : DOT_MAX;
    /* A nested layout changes the groups, so the pile of deals is rebuilt for them: the rest of the page compares against it. */
    const FILL = 400;
    function refill() {
      draws.forEach((d) => { d.length = 0; });
      if (groupsFor('nest', false, st.nest).length < 2) return;
      const rand = M.rng((Math.random() * 4294967296) >>> 0);
      ST.forEach((s, k) => { for (let i = 0; i < FILL; i++) draws[k].push(gapOver(M.deal(s.v, rand))); });
    }

    function render() {
      const layout = st.layout, L = slots(layout, st.thirds, pitch, st.nest), order = orders[layout], cw = L.cw, p = L.pitch;
      host.classList.toggle('caps', st.caps);
      host.classList.toggle('lens', st.lens);
      ST.forEach((s, k) => {
        const gsx = groupStats(k, layout), score = M.sum(Q.map((x, j) => outcome(k, j)));
        lab[k].lastChild.textContent = st.scores ? score : '';
        lab[k].classList.toggle('big', st.scores);
        Q.forEach((x, j) => {
          const e = cell[k][j], sl = slotOf[layout][j];
          e.style.transform = 'translate(' + (x0 + L.x[sl]) + 'px,' + rowY(k) + 'px)';
          e.style.width = cw + 'px';
          const v = outcome(k, j);
          e.classList.toggle('ok', !!v); e.classList.toggle('no', !v);
        });
        // per-group bars
        while (bars[k].length < gsx.length) bars[k].push(mkBar());
        bars[k].forEach((bx, gi) => {
          const gr = gsx[gi], show = st.pct && gr && gsx.length > 1;
          bx.b.classList.toggle('on', !!show); bx.n.classList.toggle('on', !!show);
          if (!show) return;
          const w = (gr.g.b - gr.g.a) * p - (p - cw), left = x0 + L.x[gr.g.a];
          bx.b.style.left = left + 'px'; bx.b.style.top = (rowY(k) + cellH + 10) + 'px'; bx.b.style.width = w + 'px';
          bx.fill.style.width = (gr.pct * 100) + '%'; bx.tick.style.left = (gr.cls * 100) + '%';
          bx.n.style.left = left + 'px'; bx.n.style.top = (rowY(k) + cellH + 24) + 'px'; bx.n.style.width = w + 'px';
          bx.n.textContent = w >= 30 ? Math.round(gr.pct * 100) : '';
        });
        // ring round the weakest chapter, for those whose real gap is large
        const rg = rings[k], pc = realPct(k);
        const on = st.ring && layout === 'chapter' && !dealt && realGap[k] >= RING_GAP;
        rg.classList.toggle('on', on);
        if (on) {
          const wi = pc.reduce((m, c, i) => c.pct < pc[m].pct ? i : m, 0), g = L.gs[wi];
          rg.style.left = (x0 + L.x[g.a] - 8) + 'px'; rg.style.top = (rowY(k) - 10) + 'px';
          rg.style.width = ((g.b - g.a) * p - (p - cw) + 16) + 'px'; rg.style.height = (cellH + 64) + 'px';
        }
      });
      // the class row
      clsLab.style.top = (y0 - 76 + (cellH < 60 ? 0 : 12)) + 'px';
      clsLab.classList.toggle('on', st.cls); 
      Q.forEach((x, j) => {
        const e = clsCell[j], sl = slotOf[layout][j];
        e.style.transform = 'translate(' + (x0 + L.x[sl]) + 'px,' + (y0 - 76 + (cellH - Math.round(cellH * x.avg))) + 'px)';
        e.classList.toggle('on', st.cls);
      });
      // chapter pills
      pills.forEach((p, i) => {
        const g = L.gs[i], on = st.head && layout === 'chapter';
        p.classList.toggle('on', !!on);
        if (on) { const w = (g.b - g.a) * pitch - (pitch - cw); p.style.left = (x0 + L.x[g.a]) + 'px'; p.style.width = w + 'px'; p.style.top = (y0 - 44) + 'px'; }
      });
      legend.classList.toggle('on', st.pct);
      renderLabels(L);
      renderDots();
    }

    /* Nested layouts: a pill over every group, one row per level, outermost on top. */
    function renderLabels(L) {
      const lv = st.layout === 'nest' ? st.nest.levels : [], tops = lv.length;
      let used = 0;
      lv.forEach((groups, li) => groups.forEach((gr) => {
        const e = glabs[used] || (glabs[used] = mkLab()), left = x0 + L.x[gr.a], w = L.x[gr.b - 1] - L.x[gr.a] + L.cw;
        used++;
        e.classList.add('on'); e.dataset.lv = li; e.title = gr.label;
        e.style.left = left + 'px'; e.style.width = w + 'px'; e.style.top = (y0 - 40 - (tops - li) * 30) + 'px';
        e.textContent = w < 36 ? '' : gr.label.length * 9.5 <= w ? gr.label : gr.label.slice(0, Math.floor(w / 11));
      }));
      for (let i = used; i < glabs.length; i++) glabs[i].classList.remove('on');
    }

    function renderDots() {
      svg.classList.toggle('on', st.luck);
      ST.forEach((s, k) => {
        const g = dg[k];
        Array.from(g.querySelectorAll('.d, .mk, .pv')).forEach((e) => e.remove());
        if (!st.luck) return;
        if (st.layout === 'nest' && st.nest.leaves.length < 2) return;     // one group: nothing to measure
        const base = rowY(k) + cellH, bins = 20, bw = DOT_W / bins, cnt = new Array(bins).fill(0), top = dotMax();
        draws[k].forEach((v) => { cnt[Math.min(bins - 1, Math.floor(v / top * bins))]++; });
        const mx = Math.max(1, ...cnt), r = Math.min(5, (cellH - 10) / 2 / mx);
        if (draws[k].length > 150) {           // too many to stack as dots: bars
          cnt.forEach((c, b) => { if (c) D.svg('rect', { class: 'd', x: DOT_X + b * bw + 1, y: base - 2 - (cellH - 14) * c / mx, width: bw - 2, height: (cellH - 14) * c / mx, rx: 2 }, g); });
        } else cnt.forEach((c, b) => { for (let i = 0; i < c; i++) D.svg('circle', { class: 'd', cx: DOT_X + (b + 0.5) * bw, cy: base - 3 - r - i * 2 * r, r: Math.max(1.6, r) }, g); });
        const mxX = DOT_X + Math.min(1, curGap(k) / top) * DOT_W;
        D.svg('path', { class: 'mk', d: 'M' + mxX + ' ' + (base + 6) + 'V' + (base - cellH + 6) }, g);
        if (last) D.svg('circle', { class: 'd now', cx: DOT_X + Math.min(1, last[k] / top) * DOT_W, cy: base - 3 - Math.max(1.6, r), r: Math.max(3, r + 1.5) }, g);
      });
    }

    const api = {
      state: st,
      get dealt() { return !!dealt; },
      draws, gaps: realGap,
      set(next) {
        const nested = next.nest && next.nest !== st.nest;
        Object.assign(st, next);
        if (nested) useNest(st.nest);
        if (!dealable() && dealt) { dealt = null; last = null; }
        if (nested) { refill(); last = dealt ? dealt.map((v) => gapOver(v)) : null; }
        render();
      },
      /* Deal every student's results into the chapter slots at random, n times. The last deal stays on screen. */
      deal(n) {
        if (!dealable()) st.layout = 'chapter';
        const rand = M.rng((Math.random() * 4294967296) >>> 0);
        for (let i = 0; i < (n || 1); i++) {
          dealt = ST.map((s) => M.deal(s.v, rand));
          last = ST.map((s, k) => gapOver(dealt[k]));
          last.forEach((g, k) => { if (draws[k].length < 3000) draws[k].push(g); });
        }
        render();
        if (!D.reduced) cell.forEach((r) => r.forEach((e) => { e.classList.remove('flip'); void e.offsetWidth; e.classList.add('flip'); }));
      },
      real() { dealt = null; last = null; render(); },
      clearDraws() { draws.forEach((d) => { d.length = 0; }); dealt = null; last = null; if (st.layout === 'nest') refill(); render(); },
      render
    };
    render();
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('still')));
    return api;
  };
})();
