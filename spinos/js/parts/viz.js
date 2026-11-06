/* Figure pages and the pictures drawn for particular claims.
 *
 *   fig     (a page) a figure with zones; each build lights one zone and dims the rest
 *   traits  (claim viz) trait grid with a handle that slides across taxa
 *   predict (claim viz) 27 tiles and a guess marker, then the count
 *   bones   (claim viz) 4,500 dots
 *   body    (claim viz) filaments drawn on a therizinosaur outline
 *
 * Claim viz layers are 740 × 480 stage pixels: D.viz[kind](layer, view, claim, idx)
 * returns { show(b, how, on, entering), reset() }. Numbers are the papers';
 * the drawings are schematic. */
(function () {
  'use strict';
  const D = window.Deck;
  const svg = (layer, w, h) => D.svg('svg', { class: 'vz-svg', viewBox: `0 0 ${w} ${h}`, width: w, height: h }, layer);
  const text = (p, x, y, s, cls, anchor) => {
    const t = D.svg('text', { x, y, class: cls, 'text-anchor': anchor || 'start' }, p);
    t.innerHTML = D.fmt(s).replace(/<i>/g, '<tspan font-style="italic">').replace(/<\/i>/g, '</tspan>');
    return t;
  };
  D.vizTools = { svg, text };

  /* ---------- predict: how many of 27 hold up? ---------- */
  D.viz.predict = function (layer, v, c) {
    const s = svg(layer, 740, 480), N = v.total, K = v.hit, COLS = 9, P = 64, X0 = 12, Y0 = 20;
    const sq = [];
    for (let i = 0; i < N; i++) {
      const r = D.svg('rect', { class: 'pd-sq', x: X0 + (i % COLS) * P, y: Y0 + Math.floor(i / COLS) * P, width: 54, height: 54, rx: 9 }, s);
      r.style.transitionDelay = (i * 40) + 'ms';
      sq.push(r);
    }
    const TX0 = X0 + 27, TX1 = X0 + (COLS - 1) * P + 27, TY = 292;       // slider track under the grid, 0…N
    D.svg('path', { class: 'ms-axis', d: `M${X0} ${TY} H${X0 + COLS * P - 10}` }, s);
    const xAt = (g) => X0 + (g / N) * (COLS * P - 10);
    [0, 9, 18, 27].forEach((k) => { D.svg('path', { class: 'ms-axis', d: `M${xAt(k)} ${TY} v10` }, s); text(s, xAt(k), TY + 38, String(k), 'ms-tick', 'middle'); });
    const knob = D.svg('g', { class: 'pd-knob' }, s);
    D.svg('circle', { class: 'ms-me', cx: 0, cy: 0, r: 20 }, knob);
    const gtxt = text(knob, 0, -34, '', 'ms-val', 'middle');
    const hit = D.svg('rect', { x: X0 - 20, y: TY - 50, width: COLS * P + 30, height: 100, fill: 'transparent', class: 'grab' }, s);
    const big = text(s, 610, 190, '', 'pd-big'); big.setAttribute('class', 'pd-big reveal');
    const of = text(s, 610, 232, '/ ' + N, 'pd-of'); of.setAttribute('class', 'pd-of reveal');
    const st = () => D.get('predict:' + c.id, () => ({ g: null }));
    function setG(g) {
      g = Math.round(D.clamp(g, 0, N)); st().g = g;
      knob.setAttribute('transform', `translate(${xAt(g)} ${TY})`);
      knob.classList.add('on'); knob.classList.remove('idle'); gtxt.textContent = g;
    }
    let shown = false;
    const toVal = (m) => { const p = D.localv(layer, m); return ((p.x - X0) / (COLS * P - 10)) * N; };
    hit.addEventListener('pointerdown', (e) => {
      e.preventDefault(); e.stopPropagation();
      hit.setPointerCapture(e.pointerId); setG(toVal(e));
      const mv = (m) => setG(toVal(m));
      const up = () => { hit.removeEventListener('pointermove', mv); hit.removeEventListener('pointerup', up); hit.removeEventListener('pointercancel', up); D.save(); };
      hit.addEventListener('pointermove', mv); hit.addEventListener('pointerup', up); hit.addEventListener('pointercancel', up);
    });
    big.textContent = K;
    knob.setAttribute('transform', `translate(${xAt(N / 2)} ${TY})`); knob.classList.add('on', 'idle'); gtxt.textContent = '?';
    if (st().g != null) setG(st().g);
    return {
      show(b) {
        const on = b >= v.at;
        sq.forEach((r, i) => r.classList.toggle('hit', on && i < K));
        sq.forEach((r) => r.classList.toggle('shown', on));
        big.classList.toggle('on', on); of.classList.toggle('on', on);
        shown = on;
      },
      reset() { knob.classList.add('idle'); gtxt.textContent = '?'; knob.setAttribute('transform', `translate(${xAt(N / 2)} ${TY})`); sq.forEach((r) => r.classList.remove('hit', 'shown')); }
    };
  };

  /* ---------- bones: 4,500 dots ---------- */
  D.viz.bones = function (layer, v) {
    const COLS = 100, ROWS = 45, PX = 7.2, R = 2.7;
    const cv = D.el('canvas', 'bn-cv', layer);
    cv.width = 1480; cv.height = 680; cv.style.cssText = 'position:absolute;left:0;top:0;width:740px;height:340px;';
    const ctx = cv.getContext && cv.getContext('2d');
    const other = new Set(); let seed = 7;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    while (other.size < Math.round(COLS * ROWS * 0.01)) other.add(Math.floor(rnd() * COLS * ROWS));
    const nums = D.el('div', 'bn-nums', layer, `<div class="bn-a"><b>${D.fmt(v.total)}</b><span>${D.fmt(v.l1)}</span></div><div class="bn-b reveal"><div class="bn-key"><i class="g"></i><b>99%</b><span>${D.fmt(v.l2)}</span></div><div class="bn-key"><i class="y"></i><b>1%</b><span>${D.fmt(v.l3)}</span></div></div>`);
    const bb = nums.querySelector('.bn-b');
    let stage = 0, on = false;
    function css(n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim() || '#888'; }
    function paint() {
      if (!ctx) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.scale(2, 2);
      const dark = css('--ink-2'), acc = css('--accent'), line = css('--outline');
      const ox = (740 - COLS * PX) / 2 + PX / 2;
      for (let i = 0; i < COLS * ROWS; i++) {
        const x = ox + (i % COLS) * PX, y = 8 + Math.floor(i / COLS) * PX + PX / 2;
        ctx.beginPath();
        if (stage >= 1 && other.has(i)) { ctx.arc(x, y, R + 0.9, 0, 6.2832); ctx.fillStyle = acc; ctx.fill(); ctx.lineWidth = 1.4; ctx.strokeStyle = line; ctx.stroke(); }
        else { ctx.arc(x, y, R, 0, 6.2832); ctx.fillStyle = dark; ctx.globalAlpha = stage >= 1 ? 0.55 : 0.9; ctx.fill(); ctx.globalAlpha = 1; }
      }
    }
    D.on('theme', paint); D.on('resize', paint);
    paint();
    return {
      show(b) { const s = b >= v.at ? 1 : 0; stage = s; bb.classList.toggle('on', s >= 1); paint(); },
      reset() { stage = 0; paint(); }
    };
  };

  /* ---------- body: filaments on an outline ---------- */
  function smooth(pts) {
    const n = pts.length; let d = `M${pts[0][0]} ${pts[0][1]}`;
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      d += ` C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0]} ${p2[1]}`;
    }
    return d + 'Z';
  }
  D.viz.body = function (layer, v) {
    const s = svg(layer, 740, 440);
    const body = [[52, 110], [78, 94], [116, 88], [138, 100], [158, 124], [190, 150], [250, 150], [330, 146], [420, 150], [480, 160], [560, 171], [640, 184], [708, 196], [640, 203], [560, 200], [494, 206], [472, 232], [458, 286], [472, 330], [480, 358], [440, 372], [392, 372], [410, 350], [418, 320], [400, 286], [370, 266], [320, 300], [268, 290], [234, 250], [205, 216], [180, 176], [150, 148], [122, 122], [92, 116]];
    D.svg('path', { class: 'bd-body', d: smooth(body) }, s);
    D.svg('path', { class: 'bd-arm', d: 'M236 196 Q214 246 188 292' }, s);
    ['M188 292 q-20 6 -30 26', 'M190 294 q-12 14 -14 36', 'M194 292 q2 18 -2 38'].forEach((d) => D.svg('path', { class: 'bd-claw', d }, s));
    const eye = D.svg('circle', { class: 'bd-eye', cx: 96, cy: 100, r: 4 }, s);
    const lineSet = (cls, segs) => {
      const g = D.svg('g', { class: 'bd-layer ' + cls }, s);
      segs.forEach(([x, y, a, l]) => {
        const r = a * Math.PI / 180;
        D.svg('line', { x1: x, y1: y, x2: (x + Math.cos(r) * l).toFixed(1), y2: (y + Math.sin(r) * l).toFixed(1) }, g);
      });
      return g;
    };
    const along = (pts, step, ang, len, jit) => {
      const out = []; let k = 0;
      for (let i = 0; i < pts.length - 1; i++) {
        const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], d = Math.hypot(x1 - x0, y1 - y0), n = Math.max(1, Math.round(d / step));
        for (let j = 0; j < n; j++, k++) { const t = j / n; out.push([x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, ang + (jit ? ((k * 37) % jit) - jit / 2 : 0), len]); }
      }
      return out;
    };
    const shortSegs = [].concat(
      along([[110, 90], [138, 100], [158, 124], [190, 150], [250, 150], [330, 146], [420, 150], [480, 160]], 13, -88, 14, 24),
      along([[180, 176], [150, 148], [122, 122], [95, 116]], 13, 95, 13, 24),
      along([[236, 196], [214, 246], [190, 292]], 12, 180, 14, 30)
    );
    const longSegs = [].concat(
      along([[122, 92], [140, 104], [156, 122], [172, 138]], 12, -48, 62, 10),     // behind the skull, front of neck
      along([[96, 114], [112, 120], [128, 126]], 14, 118, 46, 10),                 // under the back of the jaw
      along([[330, 146], [370, 147], [420, 150], [470, 156]], 12, -40, 56, 10),    // back half of the trunk
      along([[490, 164], [540, 170], [600, 178], [660, 190]], 14, -34, 54, 10),    // tail, upper
      along([[520, 200], [580, 198], [640, 202]], 20, 38, 46, 10)                  // tail, lower
    );
    const gShort = lineSet('bd-short', shortSegs), gLong = lineSet('bd-long', longSegs);
    const btns = D.el('div', 'bd-btns', layer);
    const mk = (cls, label, icon) => D.el('button', 'bd-btn ' + cls, btns, icon + `<span>${D.fmt(label)}</span>`);
    const bS = mk('s', v.lab.short, '<svg viewBox="0 0 40 24"><path d="M4 18l3-8M13 18l3-8M22 18l3-8M31 18l3-8"/></svg>');
    const bL = mk('l', v.lab.long, '<svg viewBox="0 0 40 24"><path d="M4 22L14 2M16 22L26 2M28 22L38 2"/></svg>');
    const on = { s: false, l: false };
    const paint = () => { gShort.classList.toggle('on', on.s); gLong.classList.toggle('on', on.l); bS.classList.toggle('on', on.s); bL.classList.toggle('on', on.l); };
    [[bS, 's'], [bL, 'l']].forEach(([b, k]) => { b.type = 'button'; b.addEventListener('pointerdown', (e) => e.stopPropagation()); b.addEventListener('click', () => { on[k] = !on[k]; paint(); }); });
    return {
      show(b) { on.s = b >= v.at.short; on.l = b >= v.at.long; paint(); },
      reset() { on.s = on.l = false; paint(); }
    };
  };
})();
