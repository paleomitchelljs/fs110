/* Claim 7 as a ladder. "Specialized in fruit eating" is really four claims,
 * each one narrower than the one below it. Evidence and alternatives come in
 * rung by rung, and each rung gets its own certainty marker. A narrower claim
 * can't be surer than the wider one under it, so the markers can't be dragged
 * past the rung below: lower one and every rung above comes down with it. */
(function () {
  'use strict';
  const D = window.Deck;

  D.parts.ladder = function (def, host) {
    const c = def.claim, R = def.rungs, N = R.length;
    const RH = 124, GAP = 8, TOP = 196;
    D.claimHead(host, c);
    const root = D.el('div', 'ld', host);

    // one build per row, rung by rung; the rung shows with its first row, its marker with its last
    let n = 1;
    const rungs = R.map((r, i) => {
      const e = D.el('div', 'rung', root);
      e.style.top = (TOP + (N - 1 - i) * (RH + GAP)) + 'px';
      e.style.height = RH + 'px';
      e.innerHTML = `<div class="rung-name"><b>${i + 1}</b><span>${D.fmt(r.name)}</span></div><div class="rung-rows"></div><div class="mg"><div class="mg-knob"></div><div class="mg-ends"><span>Guess</span><span>Solid</span></div><button class="g-undo" title="Clear this marker">↶</button></div>`;
      const rows = r.rows.map((x) => {
        const row = D.el('div', 'row ' + (x.k === 'ev' ? 'ev' : 'alt') + (x.own ? ' mine' : ''), e.querySelector('.rung-rows'),
          D.bul[x.k] + '<span>' + D.fmt(x.t) + '</span>');
        return { e: row, at: n++ };
      });
      return { e, rows, first: rows[0].at, last: rows[rows.length - 1].at, mg: e.querySelector('.mg'), knob: e.querySelector('.mg-knob') };
    });
    const tAt = n++, qAt = n++;
    const test = D.el('div', 'row test ld-test', root, D.bul.test + '<span>' + D.fmt(c.test) + '</span>');
    test.style.width = '640px';
    const qs = D.el('div', 'cl-quotes', root);
    qs.style.cssText = 'left:720px;top:726px;width:830px;height:70px;';
    const quotes = (c.quotes || []).map((q) => { const e = D.el('div', 'q', qs, '<span>“' + D.fmt(q) + '”</span>'); e.style.fontSize = '25px'; return e; });

    const L = () => D.get('ladder:' + c.id, () => ({ v: R.map(() => null) }));
    function setRung(i, k) {
      const v = L().v;
      if (i > 0 && v[i - 1] != null) k = Math.min(k, v[i - 1]);
      v[i] = k;
      for (let j = i + 1; j < N; j++) if (v[j] != null && v[j] > k) v[j] = k;
      D.save(); paint();
    }
    function paint() {
      const v = L().v;
      rungs.forEach((r, i) => {
        r.knob.classList.toggle('on', v[i] != null);
        if (v[i] != null) r.knob.style.left = (v[i] * 100) + '%';
      });
    }
    rungs.forEach((r, i) => {
      const apply = (ev) => { const b = r.mg.getBoundingClientRect(); setRung(i, D.clamp((ev.clientX - b.left) / b.width, 0, 1)); };
      r.mg.addEventListener('pointerdown', (ev) => {
        ev.preventDefault(); ev.stopPropagation();
        r.mg.setPointerCapture(ev.pointerId);
        r.knob.classList.add('drag');
        apply(ev);
        const up = () => { r.mg.removeEventListener('pointermove', apply); r.mg.removeEventListener('pointerup', up); r.mg.removeEventListener('pointercancel', up); r.knob.classList.remove('drag'); };
        r.mg.addEventListener('pointermove', apply); r.mg.addEventListener('pointerup', up); r.mg.addEventListener('pointercancel', up);
      });
    });
    rungs.forEach((r, i) => {
      const b = r.mg.querySelector('.g-undo');
      b.addEventListener('pointerdown', (ev) => ev.stopPropagation());
      b.addEventListener('click', () => { L().v[i] = null; D.save(); paint(); });
    });
    paint();

    let cur = 0;
    return {
      show(b, how) {
        cur = b;
        rungs.forEach((r) => {
          const on = b >= r.first, was = r.e.classList.contains('on');
          r.e.classList.toggle('on', on);
          if (on && !was && how === 'step') D.replay(r.e, 'play');
          r.rows.forEach((x) => {
            const xo = b >= x.at, xw = x.e.classList.contains('on');
            x.e.classList.toggle('on', xo);
            if (xo && !xw && how === 'step') D.replay(x.e, 'play');
          });
          r.mg.classList.toggle('on', b >= r.last);
        });
        test.classList.toggle('on', b >= tAt);
        if (b >= tAt && how === 'step' && b === tAt) D.replay(test, 'play');
        quotes.forEach((q) => q.classList.toggle('on', b >= qAt));
      },
      // 1–5 sets the newest rung's marker to the middle of that bin
      digit(k) {
        if (k < 1 || k > 5) return;
        let i = -1;
        rungs.forEach((r, j) => { if (cur >= r.last) i = j; });
        if (i >= 0) setRung(i, (k - 0.5) / 5);
      },
      reset() { paint(); }
    };
  };
})();
