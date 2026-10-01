/* Case 2. Twenty taxa, every one alive from level −50 until it dies at 0.
 * Each level gives up a fossil with chance p. Dig upward and the last find of
 * almost every taxon lands below 0; sort them and the record looks like a slow
 * decline. The eye shows the true ranges. Drag p and the gaps shrink.
 *
 * Builds (from the item def): sortAt sorts and adds the diversity panel,
 * truthAt shows true ranges (answers on), knobAt brings up the p controls. */
(function () {
  'use strict';
  const D = window.Deck, Sim = window.Sim, T = window.BONES.signor;

  /* Sketches for the prediction picker: eight range bars and the line at 0. */
  function sketch(ends) {
    const x0 = 40, dx = 220 / (ends.length - 1);
    return '<line class="sk-zero" x1="16" x2="284" y1="34" y2="34"/>' +
      ends.map((e, i) => `<line class="sk-bar" x1="${x0 + i * dx}" x2="${x0 + i * dx}" y1="184" y2="${34 + e}"/>`).join('');
  }
  D.sketches.abrupt = () => sketch([0, 0, 0, 0, 0, 0, 0, 0]);
  D.sketches.taper = () => sketch([126, 108, 90, 72, 54, 36, 18, 2]);
  D.sketches.scatter = () => sketch([70, 4, 118, 30, 140, 12, 88, 50]);

  const P_MIN = 0.01, P_MAX = 0.6, PRESETS = [0.03, 0.08, 0.2, 0.5];
  const DIG_MS = 4000, REDIG_MS = 1500;
  const X0 = 140, DX = 46, Y0 = 44, YS = 11.2;          // columns; level 0 at Y0, YS px per level
  const DIV_X = 1150, DIV_S = 12;                       // diversity panel: x of 0 taxa, px per taxon
  const y = (lvl) => Y0 + (-lvl) * YS;

  D.parts.signor = function (def, host) {
    const st = () => D.get('signor', () => ({ seed: Sim.SEED, p: 0.08 }));
    let draws = null, seed = null, dig = 0.5, stopDig = null, b = 0, shown = false;
    let flags = { sorted: false, truth: false, knob: false };

    const svg = D.svg('svg', { class: 'sg', viewBox: `0 0 ${def.box[2]} ${def.box[3]}`, width: def.box[2], height: def.box[3] }, host);
    /* axis and the boundary */
    const axis = D.svg('g', { class: 'sg-axis' }, svg);
    D.svg('line', { class: 'sg-axisline', x1: X0 - 36, x2: X0 - 36, y1: y(0) - 10, y2: y(-50) + 6 }, axis);
    for (let l = 0; l >= -50; l -= 10) {
      const t = D.svg('text', { class: 'sg-tick', x: X0 - 46, y: y(l) + 7, 'text-anchor': 'end' }, axis);
      t.textContent = l === 0 ? '0' : '−' + (-l);
    }
    const colsG = D.svg('g', {}, svg);
    D.svg('line', { class: 'sg-zero', x1: X0 - 36, x2: X0 + 19 * DX + 30, y1: y(0), y2: y(0) }, svg);
    const zl = D.svg('text', { class: 'sg-zerolab', x: X0 + 19 * DX + 40, y: y(0) + 8 }, svg);
    zl.textContent = T.boundary;
    const digLine = D.svg('line', { class: 'sg-dig', x1: X0 - 36, x2: X0 + 19 * DX + 30 }, svg);

    /* diversity panel: taxa whose last find is at or above each level */
    const div = D.svg('g', { class: 'sg-div' }, svg);
    D.svg('line', { class: 'sg-axisline', x1: DIV_X, x2: DIV_X + 20 * DIV_S, y1: y(-50) + 6, y2: y(-50) + 6 }, div);
    [0, 10, 20].forEach((n) => {
      const t = D.svg('text', { class: 'sg-tick', x: DIV_X + n * DIV_S, y: y(-50) + 36, 'text-anchor': 'middle' }, div);
      t.textContent = String(n);
    });
    const dl = D.svg('text', { class: 'sg-divlab', x: DIV_X + 10 * DIV_S, y: y(-50) + 70, 'text-anchor': 'middle' }, div);
    dl.textContent = T.taxa;
    D.svg('path', { class: 'sg-divtrue truth', d: `M${DIV_X + 20 * DIV_S} ${y(-50)}V${y(0)}` }, div);
    const divArea = D.svg('path', { class: 'sg-divarea' }, div);
    const divLine = D.svg('path', { class: 'sg-divline' }, div);

    /* the room's prediction, pinned top right */
    const pin = D.svg('g', { class: 'sg-pin', transform: 'translate(1398 0)' }, svg);

    /* p controls */
    const knob = D.el('div', 'sg-knob', host);
    knob.innerHTML = `<span class="sg-klab">${D.esc(T.chance)}</span><span class="scrub sg-p"></span>` +
      PRESETS.map((p) => `<button type="button" class="sg-pre" data-p="${p}">${p.toFixed(2)}</button>`).join('') +
      '<button type="button" class="sg-dice" title="Dig again" aria-label="Dig again"><svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="9" r="1.3"/><circle cx="15" cy="15" r="1.3"/><circle cx="15" cy="9" r="1.3"/><circle cx="9" cy="15" r="1.3"/></svg></button>';
    const pEl = knob.querySelector('.sg-p');
    D.scrub(pEl, () => st().p, setP, 0.0025);
    knob.addEventListener('click', (e) => {
      const t = e.target.closest('button');
      if (!t) return;
      t.blur();
      if (t.dataset.p) setP(+t.dataset.p);
      else if (t.classList.contains('sg-dice')) { st().seed = 1 + Math.floor(Math.random() * 1e6); D.save(); rebuild(); runDig(REDIG_MS); }
    });

    /* ---------- one group per taxon ---------- */
    let taxa = [];
    function rebuild() {
      seed = st().seed;
      draws = Sim.draws(seed);
      colsG.innerHTML = '';
      taxa = draws.map((row, i) => {
        const g = D.svg('g', { class: 'sg-col' }, colsG);
        D.svg('rect', { class: 'sg-true truth', x: -8, y: y(0), width: 16, height: 50 * YS, rx: 8 }, g);
        const gap = D.svg('line', { class: 'sg-gap truth', x1: 0, x2: 0, y2: y(0) }, g);
        const range = D.svg('line', { class: 'sg-range', x1: 0, x2: 0 }, g);
        /* a dot for every level that could ever turn up a fossil at the highest p */
        const dots = [];
        for (let j = 0; j < row.length; j++) {
          if (row[j] >= P_MAX) continue;
          const c = D.svg('circle', { class: 'sg-dot', cx: 0, cy: y(Sim.BOTTOM + j), r: 6 }, g);
          dots.push({ c, lvl: Sim.BOTTOM + j, u: row[j] });
        }
        const last = D.svg('rect', { class: 'sg-last', x: -15, width: 30, height: 7, rx: 3.5 }, g);
        return { i, g, gap, range, last, dots, row };
      });
      place(flags.sorted);
    }

    const lastOf = (t) => Sim.lastSeen(t.row, st().p);
    /* Draw every taxon as dug down to level `dig`. */
    function paint() {
      const p = st().p;
      for (const t of taxa) {
        let first = null, last = null;
        for (const d of t.dots) {
          const on = d.u < p && d.lvl <= dig;
          d.c.classList.toggle('on', on);
          if (on) { if (first === null) first = d.lvl; last = d.lvl; }
        }
        t.range.style.display = first === null ? 'none' : '';
        if (first !== null) { t.range.setAttribute('y1', y(first)); t.range.setAttribute('y2', y(last)); }
        t.last.style.display = last === null ? 'none' : '';
        if (last !== null) t.last.setAttribute('y', y(last) - 3.5);
        const L = lastOf(t);
        t.gap.setAttribute('y1', L === null ? y(-50) : y(L));
      }
      const digging = dig < 0.5;
      digLine.style.display = digging ? '' : 'none';
      if (digging) { digLine.setAttribute('y1', y(dig)); digLine.setAttribute('y2', y(dig)); }
      paintDiversity();
    }
    function paintDiversity() {
      const lasts = taxa.map(lastOf);
      let d = '', a = `M${DIV_X} ${y(-50)}`;
      for (let l = -50; l <= 0; l++) {
        const n = Sim.seenAtOrAbove(lasts, l), xx = DIV_X + n * DIV_S;
        const yb = y(l) + YS / 2, yt = y(l) - YS / 2;
        d += (d ? 'L' : 'M') + `${xx} ${l === -50 ? y(-50) : yb}L${xx} ${l === 0 ? y(0) : yt}`;
        a += `L${xx} ${l === -50 ? y(-50) : yb}L${xx} ${l === 0 ? y(0) : yt}`;
      }
      divLine.setAttribute('d', d);
      divArea.setAttribute('d', a + `L${DIV_X} ${y(0)}Z`);
    }
    /* Column positions: in taxon order, or sorted by last find (never found first). */
    function place(sorted) {
      const order = taxa.slice();
      if (sorted) order.sort((p, q) => {
        const a = lastOf(p), c = lastOf(q);
        if (a === c) return p.i - q.i;
        if (a === null) return -1;
        if (c === null) return 1;
        return a - c;
      });
      order.forEach((t, k) => { t.g.style.transform = `translate(${X0 + k * DX}px, 0px)`; });
    }
    function setP(v) {
      st().p = Math.round(D.clamp(v, P_MIN, P_MAX) * 100) / 100;
      D.save();
      pEl.textContent = st().p.toFixed(2);
      knob.querySelectorAll('.sg-pre').forEach((e) => e.classList.toggle('on', +e.dataset.p === st().p));
      paint(); place(flags.sorted);
    }
    function runDig(ms) {
      if (stopDig) stopDig();
      dig = Sim.BOTTOM - 0.5;
      paint();
      stopDig = D.tween(ms, (k) => { dig = Sim.BOTTOM - 0.5 + k * (1 - Sim.BOTTOM); paint(); }, () => { stopDig = null; dig = 0.5; paint(); });
    }
    function drawPin() {
      const k = D.picked(def.picker);
      pin.innerHTML = '';
      if (k === null) return;
      const pick = D.content.segments.flatMap((s) => s.items).find((it) => it.kind === 'picker' && it.id === def.picker);
      const o = pick.options[k];
      pin.innerHTML = `<rect class="sg-pinbox" x="0" y="0" width="122" height="96" rx="10"/>` +
        `<svg x="6" y="12" width="110" height="74" viewBox="0 0 300 200" class="sketch">${D.sketches[o.sketch]()}</svg>` +
        `<text class="sg-pink" x="114" y="30" text-anchor="end">${D.esc(o.key)}</text>`;
    }

    rebuild();
    pEl.textContent = st().p.toFixed(2);
    setP(st().p);

    return {
      show(nb, how) {
        const before = flags, firstTime = !shown;
        b = nb; shown = true;
        if (st().seed !== seed) rebuild();
        flags = { sorted: b >= def.sortAt, truth: b >= def.truthAt && D.flags.answers, knob: b >= def.knobAt };
        host.classList.toggle('sorted', flags.sorted);
        host.classList.toggle('show-truth', flags.truth);
        host.classList.toggle('knob', flags.knob);
        if (firstTime && how === 'step' && b === def.builds[0]) runDig(DIG_MS);
        else if (firstTime) { dig = 0.5; paint(); }
        if (flags.sorted !== before.sorted || firstTime) place(flags.sorted);
        if (flags.sorted && !before.sorted && how === 'step') D.replay(host, 'divplay');
        drawPin();
      },
      hide() { shown = false; if (stopDig) { stopDig(); stopDig = null; dig = 0.5; paint(); } },
      key(e) {
        if (!flags.knob) return false;
        if (e.key === 'ArrowUp') { setP(st().p + 0.01); return true; }
        if (e.key === 'ArrowDown') { setP(st().p - 0.01); return true; }
        return false;
      },
      reset() { rebuild(); setP(st().p); flags = { sorted: false, truth: false, knob: false }; }
    };
  };
})();
