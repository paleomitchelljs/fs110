/* Two sorting parts.
 *
 *   sort   Cards are dealt one per build and dragged into bins. At def.finalAt
 *          every card with a `to` slides into its bin (as the sources read it),
 *          and each bin shows a count. Cards with no `to` stay where they were put.
 *   guess  A timeline of who put the animal where. One guess per build; the
 *          year cursor can also be dragged to scrub back and forth.
 */
(function () {
  'use strict';
  const D = window.Deck;

  D.parts.sort = function (def, host) {
    const N = def.bins.length, GAP = 20, BW = Math.floor((1520 - (N - 1) * GAP) / N), BH = 352;
    const CW = Math.min(470, BW - 20), CH = 52;
    host.innerHTML = '<div class="pl"></div>';
    const root = host.firstChild;
    const bins = def.bins.map((b, i) => {
      const e = D.el('div', 'pl-bin', root, `<span class="pl-head">${D.fmt(b.label)}</span><b class="pl-n"></b>`);
      e.style.cssText = `left:${40 + i * (BW + GAP)}px;top:0;width:${BW}px;height:${BH}px;`;
      return { e, n: e.querySelector('.pl-n'), x: 40 + i * (BW + GAP), id: b.id };
    });
    const tray = D.el('div', 'pl-tray', root);
    tray.style.cssText = `left:40px;top:${BH + 14}px;width:1520px;height:${690 - BH - 22}px;`;
    const cols = Math.max(1, Math.floor(1520 / (CW + 16))), pitchX = Math.floor((1520 - CW) / Math.max(1, cols - 1));
    const st = () => D.get('sort:' + def.id, () => ({ pos: {} }));
    const trayPos = (i) => ({ x: 40 + (i % cols) * Math.min(pitchX, CW + 16), y: BH + 26 + Math.floor(i / cols) * (CH + 8) });
    let b0 = 0;
    const cards = def.cards.map((c, i) => {
      const e = D.el('div', 'pl-card off ' + (c.look ? 'look' : 'detail'), root, `<span>${D.fmt(c.text)}</span><i class="pl-tag">${D.fmt(c.basis || '')}</i>`);
      e.style.width = CW + 'px'; e.style.height = CH + 'px';
      D.drag(e, root, {
        minX: 0, maxX: 1600 - CW, minY: 0, maxY: 690 - CH,
        end(x, y) { st().pos[c.id] = { x, y }; D.save(); count(); }
      });
      return { c, e, i };
    });
    function binAt(x, y) {
      const cx = x + CW / 2;
      if (y + CH / 2 > BH) return -1;
      return bins.findIndex((b, k) => cx >= b.x && cx < b.x + BW);
    }
    function count() {
      const n = bins.map(() => 0);
      cards.forEach((k) => {
        if (k.e.classList.contains('off')) return;
        const x = k.e.offsetLeft, y = k.e.offsetTop, j = binAt(x, y);
        if (j >= 0) n[j]++;
      });
      bins.forEach((b, j) => { b.n.textContent = n[j] || ''; b.n.classList.toggle('on', n[j] > 0); });
    }
    function place() {
      const final = b0 >= def.finalAt;
      const stack = bins.map(() => 0);
      cards.forEach((k) => {
        let x, y;
        const bi = final && k.c.to ? bins.findIndex((b) => b.id === k.c.to) : -1;
        if (bi >= 0) { x = bins[bi].x + (BW - CW) / 2; y = 58 + stack[bi]++ * (CH + 5); }
        else { const p = st().pos[k.c.id] || trayPos(k.i); x = p.x; y = p.y; }
        k.e.style.left = x + 'px'; k.e.style.top = y + 'px';
        k.e.classList.toggle('revealed', final);
      });
      setTimeout(count, final ? 700 : 0);
      count();
    }
    return {
      show(b, how) {
        b0 = b;
        cards.forEach((k) => {
          const on = b >= k.c.at, was = !k.e.classList.contains('off');
          k.e.classList.toggle('off', !on);
          if (on && !was && how === 'step') D.replay(k.e, 'pop');
        });
        place();
      },
      reset() { place(); }
    };
  };

  /* ---------- the timeline of guesses ---------- */
  D.parts.guess = function (def, host) {
    const X0 = 270, X1 = 1450, Y0 = def.y0, Y1 = def.y1, TOP = 62, LANE = 46;
    const xOf = (y) => X0 + (y - Y0) * (X1 - X0) / (Y1 - Y0);
    host.innerHTML = '<div class="gs"></div>';
    const root = host.firstChild;
    // lanes by overlap within a row, then each row as tall as its lanes
    const laneEnd = def.rows.map(() => []);
    const plan = def.events.map((e) => {
      const w = Math.round(e.label.length * 12.6 + 112), right = e.right || (!def.rows[e.row].chrono && xOf(e.year) - 18 + w > 1595);
      const x0 = right ? xOf(e.year) - w + 18 : xOf(e.year) - 18;
      const ends = laneEnd[e.row];
      let lane = ends.findIndex((end) => x0 > end + 8);
      if (lane < 0) lane = ends.length;
      ends[lane] = x0 + w;
      return { e, w, x0, lane };
    });
    const rowH = laneEnd.map((l) => Math.max(1, l.length) * LANE + 16);
    const rowTop = []; let acc = TOP;
    rowH.forEach((h, i) => { rowTop[i] = acc; acc += h + 6; });
    def.rows.forEach((r, i) => {
      const band = D.el('div', 'gs-row' + (r.hot ? ' hot' : ''), root);
      band.style.cssText = `top:${rowTop[i]}px;height:${rowH[i]}px;`;
      D.el('div', 'gs-lab', band, D.fmt(r.label));
    });
    const AX = acc + 8;
    const axis = D.el('div', 'gs-axis', root); axis.style.cssText = `left:${X0}px;width:${X1 - X0}px;top:${AX}px;`;
    for (let y = Math.ceil(Y0 / 10) * 10; y <= Y1; y += 10) {
      const t = D.el('div', 'gs-tick', root, String(y)); t.style.cssText = `left:${xOf(y)}px;top:${AX + 8}px;`;
    }
    const ev = plan.map((p) => {
      const el = D.el('div', 'gs-pill', root, `<i></i><span>${D.fmt(p.e.label)}</span>`);
      el.style.cssText = `left:${p.x0}px;top:${rowTop[p.e.row] + 8 + p.lane * LANE}px;width:${p.w}px;`;
      const dot = D.el('div', 'gs-dot', root); dot.style.cssText = `left:${xOf(p.e.year)}px;top:${AX}px;`;
      D.el('div', 'gs-yr', el, String(p.e.year));
      return { e: p.e, el, dot };
    });
    const marks = (def.marks || []).map((m, i) => {
      const el = D.el('div', 'gs-mark', root, `<i></i><span>${D.fmt(m.label)}</span>`);
      el.style.cssText = `left:${xOf(m.year)}px;top:${AX + 44 + (i % 4) * 30}px;--drop:${44 + (i % 4) * 30}px;`;
      return { m, el };
    });
    const cur = D.el('div', 'gs-cur grab', root, '<b></b>');
    cur.style.top = '0px'; cur.style.height = (AX + 8) + 'px';
    const read = cur.querySelector('b');
    let year = Y0, stop = null;
    function setYear(v) {
      year = D.clamp(v, Y0, Y1);
      cur.style.left = xOf(year) + 'px';
      read.textContent = Math.round(year);
      ev.forEach((k) => { const on = year >= k.e.year - 0.01; k.el.classList.toggle('on', on); k.dot.classList.toggle('on', on); });
      marks.forEach((k) => k.el.classList.toggle('on', year >= k.m.year - 0.01));
    }
    cur.addEventListener('pointerdown', (e) => {
      e.preventDefault(); e.stopPropagation(); if (stop) stop();
      cur.setPointerCapture(e.pointerId);
      const move = (m) => { const p = D.local(root, m); setYear(Y0 + (p.x - X0) / (X1 - X0) * (Y1 - Y0)); };
      const up = () => { cur.removeEventListener('pointermove', move); cur.removeEventListener('pointerup', up); cur.removeEventListener('pointercancel', up); };
      cur.addEventListener('pointermove', move); cur.addEventListener('pointerup', up); cur.addEventListener('pointercancel', up);
    });
    return {
      show(b, how) {
        if (stop) stop();
        const target = b <= 0 ? Y0 : def.events[Math.min(b, def.events.length) - 1].year;
        if (how === 'step') {
          const from = year;
          stop = D.tween(Math.min(900, 60 + Math.abs(target - from) * 25), (k) => setYear(from + (target - from) * D.ease(k)));
        } else setYear(target);
      },
      reset() { setYear(Y0); }
    };
  };
})();
