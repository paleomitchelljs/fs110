/* Four students, forty-two questions. One column per question, green for right, red for wrong (red also gets hatching).
 * The same columns move between orders: exam order, by chapter, hardest first. Results can be dealt out at random into
 * the chapter slots, which is the "luck" test: same score, no pattern but chance.
 *
 * Rows(host, { x0, y0, cellH, pitch }) -> { set(state), deal(n), real(), state, gaps }
 * state: layout 'exam' | 'chapter' | 'hard'; thirds (exam order in three blocks); caps (a chapter-colored cap on every column);
 *   pct (percent right per block, with the class's own percent as a tick); cls (the class row); luck (the dealt-gap dot plots);
 *   head (chapter pills); scores (the letter's score); ring (circle each uneven student's weakest chapter).
 */
(function () {
  'use strict';
  const D = Deck, M = Model, X = EXAM, Q = X.q, ST = X.students, NQ = Q.length;
  const CHAPS = [10, 11, 12];
  const GAP = 34, CW = 22, DOT_X = 1344, DOT_W = 236, DOT_MAX = 0.8, RING_GAP = 0.3;

  const idx = Q.map((x, i) => i);
  const orders = {
    exam: idx.slice(),
    chapter: idx.slice().sort((a, b) => Q[a].ch - Q[b].ch || a - b),
    hard: idx.slice().sort((a, b) => Q[a].avg - Q[b].avg || a - b)
  };
  function groupsFor(layout, thirds) {
    if (layout === 'chapter') {
      let a = 0;
      return CHAPS.map((ch) => { const n = Q.filter((x) => x.ch === ch).length, g = { a, b: a + n, ch }; a += n; return g; });
    }
    if (layout === 'hard') return [{ a: 0, b: NQ / 2 }, { a: NQ / 2, b: NQ }];
    return thirds ? M.thirds(NQ) : [{ a: 0, b: NQ }];
  }
  /* Slot positions in px from the left of the first column, with a gap between groups. */
  function slots(layout, thirds, pitch) {
    const gs = groupsFor(layout, thirds), x = [], g = [];
    gs.forEach((grp, gi) => { for (let s = grp.a; s < grp.b; s++) { x[s] = s * pitch + gi * GAP; g[s] = gi; } });
    return { gs, x, g };
  }

  D.Rows = function (host, o) {
    const x0 = o.x0 == null ? 140 : o.x0, y0 = o.y0 || 150, cellH = o.cellH || 70, pitch = o.pitch || 26, rowPitch = o.rowPitch || 150;
    const root = D.el('div', 'rows still', host);
    const st = { layout: 'exam', thirds: false, caps: false, pct: false, cls: false, luck: false, head: false, scores: false, ring: false };
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
      const e = D.el('div', 'cell', root, '<i class="cap"></i>');
      e.style.height = cellH + 'px'; e.dataset.ch = x.ch; e.title = 'Q' + x.n;
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
    const bars = ST.map(() => [0, 1, 2].map(() => {
      const b = D.el('div', 'pct', root, '<i></i><b></b>'), n = D.el('div', 'pnum', root);
      return { b, n, fill: b.firstChild, tick: b.lastChild };
    }));
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

    const outcome = (k, j) => (dealt && st.layout === 'chapter') ? dealt[k][slotOf.chapter[j]] : ST[k].v[j];
    const slotOf = {};
    Object.keys(orders).forEach((n) => { slotOf[n] = []; orders[n].forEach((j, s) => { slotOf[n][j] = s; }); });
    const chOrder = orders.chapter;
    const realPct = (k) => M.chapters(Q, ST[k].v);
    const realGap = ST.map((s, k) => M.gap(realPct(k)));
    const classPct = (qs) => M.mean(qs.map((j) => Q[j].avg));

    function groupStats(k, layout) {
      const L = slots(layout, st.thirds, pitch), order = orders[layout];
      return L.gs.map((g) => {
        const qs = order.slice(g.a, g.b);
        return { g, qs, pct: M.mean(qs.map((j) => outcome(k, j))), cls: classPct(qs) };
      });
    }
    const dealtGap = (k) => M.gap(groupStats(k, 'chapter'));

    function render() {
      const layout = st.layout, L = slots(layout, st.thirds, pitch), order = orders[layout];
      host.classList.toggle('caps', st.caps);
      ST.forEach((s, k) => {
        const gsx = groupStats(k, layout), score = M.sum(Q.map((x, j) => outcome(k, j)));
        lab[k].lastChild.textContent = st.scores ? score : '';
        lab[k].classList.toggle('big', st.scores);
        Q.forEach((x, j) => {
          const e = cell[k][j], sl = slotOf[layout][j];
          e.style.transform = 'translate(' + (x0 + L.x[sl]) + 'px,' + rowY(k) + 'px)';
          const v = outcome(k, j);
          e.classList.toggle('ok', !!v); e.classList.toggle('no', !v);
        });
        // per-group bars
        bars[k].forEach((bx, gi) => {
          const gr = gsx[gi], show = st.pct && gr && gsx.length > 1;
          bx.b.classList.toggle('on', !!show); bx.n.classList.toggle('on', !!show);
          if (!show) return;
          const w = (gr.g.b - gr.g.a) * pitch - (pitch - CW), left = x0 + L.x[gr.g.a];
          bx.b.style.left = left + 'px'; bx.b.style.top = (rowY(k) + cellH + 10) + 'px'; bx.b.style.width = w + 'px';
          bx.fill.style.width = (gr.pct * 100) + '%'; bx.tick.style.left = (gr.cls * 100) + '%';
          bx.n.style.left = left + 'px'; bx.n.style.top = (rowY(k) + cellH + 24) + 'px'; bx.n.style.width = w + 'px';
          bx.n.textContent = Math.round(gr.pct * 100);
        });
        // ring round the weakest chapter, for those whose real gap is large
        const rg = rings[k], pc = realPct(k);
        const on = st.ring && layout === 'chapter' && !dealt && realGap[k] >= RING_GAP;
        rg.classList.toggle('on', on);
        if (on) {
          const wi = pc.reduce((m, c, i) => c.pct < pc[m].pct ? i : m, 0), g = L.gs[wi];
          rg.style.left = (x0 + L.x[g.a] - 8) + 'px'; rg.style.top = (rowY(k) - 10) + 'px';
          rg.style.width = ((g.b - g.a) * pitch - (pitch - CW) + 16) + 'px'; rg.style.height = (cellH + 64) + 'px';
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
        if (on) { const w = (g.b - g.a) * pitch - (pitch - CW); p.style.left = (x0 + L.x[g.a]) + 'px'; p.style.width = w + 'px'; p.style.top = (y0 - 44) + 'px'; }
      });
      legend.classList.toggle('on', st.pct);
      renderDots();
    }

    function renderDots() {
      svg.classList.toggle('on', st.luck);
      ST.forEach((s, k) => {
        const g = dg[k];
        Array.from(g.querySelectorAll('.d, .mk, .pv')).forEach((e) => e.remove());
        if (!st.luck) return;
        const base = rowY(k) + cellH, bins = 20, bw = DOT_W / bins, cnt = new Array(bins).fill(0);
        draws[k].forEach((v) => { cnt[Math.min(bins - 1, Math.floor(v / DOT_MAX * bins))]++; });
        const mx = Math.max(1, ...cnt), r = Math.min(5, (cellH - 10) / 2 / mx);
        cnt.forEach((c, b) => { for (let i = 0; i < c; i++) D.svg('circle', { class: 'd', cx: DOT_X + (b + 0.5) * bw, cy: base - 3 - r - i * 2 * r, r: Math.max(1.6, r) }, g); });
        const mxX = DOT_X + Math.min(1, realGap[k] / DOT_MAX) * DOT_W;
        D.svg('path', { class: 'mk', d: 'M' + mxX + ' ' + (base + 6) + 'V' + (base - cellH + 6) }, g);
        if (last) D.svg('circle', { class: 'd now', cx: DOT_X + Math.min(1, last[k] / DOT_MAX) * DOT_W, cy: base - 3 - Math.max(1.6, r), r: Math.max(3, r + 1.5) }, g);
      });
    }

    const api = {
      state: st,
      get dealt() { return !!dealt; },
      draws, gaps: realGap,
      set(next) { Object.assign(st, next); if (st.layout !== 'chapter' && dealt) { dealt = null; last = null; } render(); },
      /* Deal every student's results into the chapter slots at random, n times. The last deal stays on screen. */
      deal(n) {
        if (st.layout !== 'chapter') st.layout = 'chapter';
        const rand = M.rng((Math.random() * 4294967296) >>> 0);
        const base = ST.map((s) => chOrder.map((j) => s.v[j]));
        for (let i = 0; i < (n || 1); i++) {
          dealt = base.map((v) => M.deal(v, rand));
          last = ST.map((s, k) => dealGap(dealt[k]));
          last.forEach((g, k) => { if (draws[k].length < 3000) draws[k].push(g); });
        }
        render();
        if (!D.reduced) cell.forEach((r) => r.forEach((e) => { e.classList.remove('flip'); void e.offsetWidth; e.classList.add('flip'); }));
      },
      real() { dealt = null; last = null; render(); },
      clearDraws() { draws.forEach((d) => { d.length = 0; }); dealt = null; last = null; render(); },
      render
    };
    function dealGap(v) {          // v is in chapter-slot order
      const L = groupsFor('chapter');
      return M.gap(L.map((g) => ({ pct: M.mean(v.slice(g.a, g.b)) })));
    }
    render();
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('still')));
    return api;
  };
})();
