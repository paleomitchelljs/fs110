/* Case 2, second half: we didn't find it. Why not? Each reason the room gives
 * becomes a gate between columns of dots. A thousand animals lived; the ones
 * that get through a gate fly on to the next column. Gate rates are made up
 * and draggable. Order doesn't change the final count (it's a product), so
 * typed-in reasons just join the end at 50%.
 *
 * "Never there" isn't a gate. It gets its own empty lane underneath, which
 * ends at 0, next to the main lane's handful. */
(function () {
  'use strict';
  const D = window.Deck, Sim = window.Sim, T = window.BONES.funnel;
  const N = 1000, PER_ROW = 22, PITCH = 7, R = 2.6, MAX_GATES = 16;
  const LANE_Y = 300, NEVER_Y = 606;
  const BLOCK_W = PER_ROW * PITCH;

  D.parts.funnel = function (def, host) {
    const items = [def.never].concat(def.gates.map((g) => g.text));
    const m = D.listModel(def.id, items);
    const st = () => D.get('funnel', () => ({ rates: {} }));
    const draws = Sim.funnelDraws(Sim.SEED + 1, N, MAX_GATES);
    const w = def.box[2], h = def.box[3];

    const canvas = D.el('canvas', 'fn-canvas', host);
    const ctx = canvas.getContext('2d');
    const over = D.el('div', 'fn-over', host);
    const madeUp = D.el('div', 'fn-madeup', host, D.esc(T.madeUp));
    const reserve = D.listReserve(m, host, () => retarget(900));
    const heads = new Map();               // gate text -> { lab, rate, line }
    const sprites = new Map();             // individual * 32 + column -> sprite
    let raf = 0, cols = [];

    /* Gates in funnel order: preloaded ones in their own order, then typed ones. */
    function gates() {
      const shown = m.shown(), out = [];
      def.gates.forEach((g, k) => { if (shown.includes(k + 1)) out.push({ text: g.text, draw: k, rate0: g.rate }); });
      shown.filter((e) => typeof e === 'string').forEach((text, k) => out.push({ text, draw: def.gates.length + k, rate0: 0.5 }));
      return out.slice(0, MAX_GATES - 1).map((g) => Object.assign(g, { rate: st().rates[g.text] != null ? st().rates[g.text] : g.rate0 }));
    }
    function columns(gs) {
      const n = gs.length + 1, sp = n > 1 ? D.clamp((w - 360) / (n - 1), 170, 270) : 0;
      const x0 = (w - (n - 1) * sp) / 2;
      let alive = [];
      for (let i = 0; i < N; i++) alive.push(i);
      const out = [{ cx: x0, alive, gate: null }];
      gs.forEach((g, c) => {
        alive = alive.filter((i) => draws[i][g.draw] < g.rate);
        out.push({ cx: x0 + (c + 1) * sp, alive, gate: g });
      });
      return out;
    }
    const spot = (col, r) => {
      const rows = Math.ceil(col.alive.length / PER_ROW), top = LANE_Y - rows * PITCH / 2;
      return { x: col.cx - BLOCK_W / 2 + (r % PER_ROW) * PITCH + PITCH / 2, y: top + Math.floor(r / PER_ROW) * PITCH + PITCH / 2 };
    };

    /* New positions for every dot. New dots fly in from their spot one column back. */
    function retarget(ms) {
      if (D.reduced) ms = 0;
      const now = performance.now(), gs = gates();
      cols = columns(gs);
      const seen = new Set();
      cols.forEach((col, c) => {
        const n = col.alive.length;
        col.alive.forEach((i, r) => {
          const key = i * 32 + c, t = spot(col, r);
          seen.add(key);
          let s = sprites.get(key);
          if (!s) {
            const from = c > 0 && sprites.get(i * 32 + c - 1);
            s = from ? { x: from.x, y: from.y, a: 1 } : { x: t.x, y: t.y, a: 0 };
            sprites.set(key, s);
          }
          Object.assign(s, { fx: s.x, fy: s.y, fa: s.a, tx: t.x, ty: t.y, ta: 1, dead: false, ms,
            t0: now + (ms > 300 && n ? (r / n) * 300 : 0), last: c > 0 && c === cols.length - 1 });
        });
      });
      for (const [key, s] of sprites) {
        if (seen.has(key)) continue;
        Object.assign(s, { fx: s.x, fy: s.y, fa: s.a, tx: s.x, ty: s.y, ta: 0, dead: true, ms: ms ? 250 : 0, t0: now });
      }
      labels(gs);
      if (!raf) raf = requestAnimationFrame(frame);
    }

    function frame(now) {
      raf = 0;
      let busy = false;
      for (const [key, s] of sprites) {
        const k = s.ms ? D.clamp((now - s.t0) / s.ms, 0, 1) : 1, e = D.ease(k);
        s.x = s.fx + (s.tx - s.fx) * e; s.y = s.fy + (s.ty - s.fy) * e; s.a = s.fa + (s.ta - s.fa) * e;
        if (k < 1) busy = true; else if (s.dead) sprites.delete(key);
      }
      draw();
      if (busy) raf = requestAnimationFrame(frame);
    }
    function draw() {
      const css = getComputedStyle(host);
      ctx.clearRect(0, 0, w, h);
      for (const last of [false, true]) {
        ctx.fillStyle = css.getPropertyValue(last ? '--accent-ink' : '--ink').trim();
        for (const s of sprites.values()) {
          if (s.last !== last || s.a <= 0.01) continue;
          ctx.globalAlpha = s.a;
          ctx.beginPath(); ctx.arc(s.x, s.y, R, 0, 2 * Math.PI); ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    }
    function size() {
      const k = D.scale * (window.devicePixelRatio || 1);
      canvas.width = Math.max(1, Math.round(w * k)); canvas.height = Math.max(1, Math.round(h * k));
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      ctx.setTransform(k, 0, 0, k, 0, 0);
      draw();
    }

    /* Words and numbers over the canvas. Gate heads are kept, not rebuilt, so a rate can be dragged. */
    function labels(gs) {
      const keep = new Set(gs.map((g) => g.text));
      for (const [t, e] of heads) if (!keep.has(t)) { e.lab.remove(); e.rate.remove(); e.line.remove(); heads.delete(t); }
      cols.forEach((col, c) => {
        if (!col.gate) return;
        const g = col.gate, gx = (cols[c - 1].cx + col.cx) / 2;
        let e = heads.get(g.text);
        if (!e) {
          e = { lab: D.el('div', 'fn-head play', over, D.md(g.text)), rate: D.el('div', 'scrub fn-rate', over), line: D.el('div', 'fn-gate', over) };
          const text = g.text;
          D.scrub(e.rate, () => rateOf(text), (v) => {
            st().rates[text] = Math.round(D.clamp(v, 0.01, 1) * 100) / 100;
            D.save(); retarget(150);
          }, 0.004);
          heads.set(g.text, e);
        }
        const lw = Math.min(210, (col.cx - cols[c - 1].cx) - 14);
        e.lab.style.left = gx + 'px'; e.lab.style.width = lw + 'px'; e.lab.style.marginLeft = -lw / 2 + 'px';
        e.rate.style.left = gx + 'px'; e.line.style.left = gx + 'px';
        e.rate.textContent = Math.round(g.rate * 100) + '%';
      });
      over.querySelectorAll('.fn-count, .fn-lived, .fn-never').forEach((e) => e.remove());
      const lived = D.el('div', 'fn-lived', over, D.esc(T.lived));
      lived.style.left = cols[0].cx + 'px';
      cols.forEach((col, c) => {
        const last = c === cols.length - 1 && c > 0;
        const e = D.el('div', 'fn-count' + (last ? ' found' : ''), over,
          `<b>${col.alive.length.toLocaleString('en-US')}</b>` + (last ? `<span>${D.esc(T.found)}</span>` : ''));
        e.style.left = col.cx + 'px';
      });
      if (m.has(0)) {
        const x0 = cols[0].cx, x1 = cols.length > 1 ? cols[cols.length - 1].cx : x0 + 220;
        const lane = D.el('div', 'fn-never', over,
          `<span class="fn-nlab">${D.md(def.never)}</span><i class="fn-nbox"></i><i class="fn-narrow"></i><b class="fn-nzero">0</b>`);
        lane.style.left = (x0 - BLOCK_W / 2) + 'px'; lane.style.top = NEVER_Y + 'px';
        lane.style.width = (x1 - x0 + BLOCK_W / 2 + 30) + 'px';
      }
      madeUp.classList.toggle('on', gs.length > 0);
      reserve.draw();
    }
    const rateOf = (text) => { const g = gates().find((x) => x.text === text); return g ? g.rate : 0.5; };

    D.on('resize', size);
    D.on('theme', () => draw());
    size();
    retarget(0);

    return {
      show(b, how) { size(); if (how !== 'step') retarget(0); },
      hide() { reserve.close(); },
      digit(n, shift) {
        if (n < 1) return;
        if (shift) { if (m.remove(n - 1)) retarget(500); }
        else if (m.reveal(n - 1)) retarget(900);
      },
      add() { reserve.type(); },
      reset() {
        sprites.clear();
        heads.forEach((e) => { e.lab.remove(); e.rate.remove(); e.line.remove(); });
        heads.clear();
        retarget(0);
      }
    };
  };
})();
