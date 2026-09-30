/* Drawing. One function, draw(ctx), returns the whole diagram as SVG markup in
 * screen pixels. Anything the pointer can grab carries data-hit, data-scrub
 * or data-unmask; app.js does the rest. Colours come from CSS classes. */
(function (root) {
  'use strict';
  const M = root.Model;

  const f = (n, dp) => {
    if (!isFinite(n)) return '–';
    const s = Math.abs(n) >= 1000 && !dp ? Math.round(n).toLocaleString('en-US') : n.toFixed(dp || 0);
    return s.replace('-', '−');
  };
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const P = (x, y) => x.toFixed(1) + ',' + y.toFixed(1);
  const PAD = { l: 56, r: 84, t: 24, b: 58 };

  /* ---------- geometry helpers ---------- */
  function smooth(pts, closed) {
    const n = pts.length;
    if (n < 2) return '';
    const g = (i) => closed ? pts[(i + n) % n] : pts[clamp(i, 0, n - 1)];
    let d = 'M' + P(pts[0][0], pts[0][1]);
    const last = closed ? n : n - 1;
    for (let i = 0; i < last; i++) {
      const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
      d += 'C' + P(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6) + ' ' +
        P(p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6) + ' ' + P(p2[0], p2[1]);
    }
    return d + (closed ? 'Z' : '');
  }
  const poly = (pts) => 'M' + pts.map((p) => P(p[0], p[1])).join('L');

  function rotateBody(p, geo) {
    const a = geo.pitch * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
    const x = p.x - geo.hip.x, y = p.y - geo.hip.y;
    return { x: geo.hip.x + x * c - y * s, y: geo.hip.y + x * s + y * c };
  }
  function tailPoints(a, geo) {
    const n = 10, pts = [];
    let p = rotateBody({ x: -0.25 * a.torsoLen / 5, y: a.hipH * 1.02 - 0.42 * a.tailW0 }, geo);
    let ang = 186 + geo.pitch;
    const seg = a.tailLen / n;
    pts.push(p);
    for (let i = 0; i < n; i++) {
      ang += i < 4 ? 3 : -2.5;
      const r = ang * Math.PI / 180;
      p = { x: p.x + seg * Math.cos(r), y: Math.max(p.y + seg * Math.sin(r), a.tailW0 * 0.15 * (1 - (i + 1) / n) + 0.05) };
      pts.push(p);
    }
    return pts;
  }

  /* World box that fits this animal at any neck angle. */
  function bounds(a, v, extra) {
    let x0 = Infinity, x1 = -Infinity, y1 = a.shoulderH + 1;
    const add = (p) => { x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); y1 = Math.max(y1, p.y); };
    [-60, -30, 0, 30, 60, 90].forEach((ang) => {
      const g = M.geometry(a, Object.assign({}, v, { neckAngle: ang }));
      g.pts.forEach(add);
      add({ x: g.brain.x + a.headLen, y: g.brain.y + a.headLen * 0.5 });
      tailPoints(a, g).forEach(add);
    });
    (extra || []).forEach(add);
    const m = Math.max(0.6, 0.06 * (x1 - x0));
    return { x0: x0 - m - 1.2, x1: x1 + m, y1: y1 + m };
  }

  function mapper(frame, W, H) {
    const s = Math.min((W - PAD.l - PAD.r) / (frame.x1 - frame.x0), (H - PAD.t - PAD.b) / frame.y1);
    const ox = PAD.l + ((W - PAD.l - PAD.r) - (frame.x1 - frame.x0) * s) / 2;
    return {
      s, W, H, frame,
      X: (x) => ox + (x - frame.x0) * s, Y: (y) => H - PAD.b - y * s,
      wx: (px) => (px - ox) / s + frame.x0, wy: (py) => (H - PAD.b - py) / s
    };
  }

  /* ---------- the animal ---------- */
  function neckOutline(a, geo, m, from, to) {
    const n = geo.pts.length - 1, L = [], R = [];
    from = from == null ? 0 : from; to = to == null ? n : to;
    for (let i = from; i <= to; i++) {
      const th = i === 0 ? geo.angles[0] : i === n ? geo.angles[n - 1] : (geo.angles[i - 1] + geo.angles[i]) / 2;
      const w = (a.neckW0 + (a.neckW1 - a.neckW0) * Math.pow(i / n, 0.8)) / 2;
      const nx = -Math.sin(th), ny = Math.cos(th), p = geo.pts[i];
      L.push([m.X(p.x + nx * w), m.Y(p.y + ny * w)]);
      R.push([m.X(p.x - nx * w), m.Y(p.y - ny * w)]);
    }
    if (from === 0) {
      const th0 = geo.angles[0], w0 = a.neckW0 / 2 * 1.1, back = 0.12 * a.torsoLen;
      const b = { x: geo.pts[0].x - back * Math.cos(th0), y: geo.pts[0].y - back * Math.sin(th0) };
      L.unshift([m.X(b.x - Math.sin(th0) * w0), m.Y(b.y + Math.cos(th0) * w0)]);
      R.unshift([m.X(b.x + Math.sin(th0) * w0), m.Y(b.y - Math.cos(th0) * w0)]);
    }
    return smooth(L.concat(R.reverse()), true);
  }

  function headShape(a, geo, m) {
    const Lh = a.headLen, h = a.isGiraffe ? Lh * 0.38 : Lh * 0.46;
    const loc = a.isGiraffe
      ? [[-0.05, 0.3], [0.25, 0.55], [0.6, 0.35], [1.0, 0.1], [1.0, -0.25], [0.55, -0.45], [0.1, -0.5], [-0.08, -0.15]]
      : [[-0.06, 0.25], [0.3, 0.55], [0.75, 0.42], [1.0, 0.1], [0.98, -0.3], [0.55, -0.5], [0.1, -0.5], [-0.08, -0.2]];
    const r = geo.headAngle * Math.PI / 180, c = Math.cos(r), s = Math.sin(r);
    const at = (u, w) => [m.X(geo.brain.x + u * Lh * c - w * h * s), m.Y(geo.brain.y + u * Lh * s + w * h * c)];
    return { d: smooth(loc.map(([u, w]) => at(u, w)), true), eye: at(0.32, 0.18), mid: at(0.45, 0), horn: a.isGiraffe ? [at(0.12, 0.5), at(0.12, 0.9)] : null };
  }

  function torsoPath(a, geo, m) {
    const T = a.torsoLen, hi = Math.max(a.hipH, a.shoulderH), u = T / 5;
    return smooth([
      { x: -0.5 * u, y: a.hipH + 0.04 * a.hipH }, { x: 0.2 * u, y: a.hipH + 0.1 * a.hipH },
      { x: T * 0.55, y: hi + 0.07 * hi }, { x: T + 0.05 * u, y: a.shoulderH + 0.03 * a.shoulderH },
      { x: T + 0.35 * u, y: (a.shoulderH + a.bellyH) / 2 + 0.05 * a.shoulderH },
      { x: T * 0.82, y: a.bellyH }, { x: T * 0.3, y: a.bellyH + 0.04 * a.bellyH },
      { x: -0.25 * u, y: a.hipH - 0.62 * (a.hipH - a.bellyH) }
    ].map((p) => rotateBody(p, geo)).map((p) => [m.X(p.x), m.Y(p.y)]), true);
  }

  function tailPath(a, geo, m) {
    const pts = tailPoints(a, geo), n = pts.length - 1, L = [], R = [];
    for (let i = 0; i <= n; i++) {
      const p = pts[i], q = pts[Math.min(i + 1, n)], o = pts[Math.max(i - 1, 0)];
      const th = Math.atan2(q.y - o.y, q.x - o.x), w = a.tailW0 / 2 * Math.pow(1 - i / n, 0.9) + 0.01 * a.tailLen;
      L.push([m.X(p.x - Math.sin(th) * w), m.Y(p.y + Math.cos(th) * w)]);
      R.push([m.X(p.x + Math.sin(th) * w), m.Y(p.y - Math.cos(th) * w)]);
    }
    return smooth(L.concat(R.reverse()), true);
  }

  function legPath(a, top, len, pitch, m, dx) {
    const r = (pitch - 90) * Math.PI / 180;
    const t = { x: top.x + (dx || 0), y: top.y };
    const bot = { x: t.x + len * Math.cos(r), y: t.y + len * Math.sin(r) };
    const wt = a.legW * 0.7, wb = a.legW * 0.5, nx = -Math.sin(r), ny = Math.cos(r);
    const d = poly([
      [t.x + nx * wt, t.y + ny * wt], [bot.x + nx * wb, bot.y + ny * wb], [bot.x + nx * wb * 1.25, bot.y],
      [bot.x - nx * wb * 1.25, bot.y], [bot.x - nx * wb, bot.y - ny * wb], [t.x - nx * wt, t.y - ny * wt]
    ].map(([x, y]) => [m.X(x), m.Y(Math.max(y, 0))])) + 'Z';
    return { d, foot: bot };
  }

  function heartPath(cx, cy, size) {
    const s = size / 2;
    return `M${P(cx, cy + s * 0.9)}C${P(cx - s * 1.5, cy - s * 0.1)} ${P(cx - s * 0.9, cy - s * 1.2)} ${P(cx, cy - s * 0.45)}` +
      `C${P(cx + s * 0.9, cy - s * 1.2)} ${P(cx + s * 1.5, cy - s * 0.1)} ${P(cx, cy + s * 0.9)}Z`;
  }

  function humanIcon(x, g, h) {
    const hd = h * 0.12, w = h * 0.14;
    return `<circle cx="${x}" cy="${g - h + hd}" r="${hd}"/>` +
      `<path d="M${P(x - w, g - h + hd * 2.3)}L${P(x + w, g - h + hd * 2.3)}L${P(x + w * 0.75, g - h * 0.47)}L${P(x - w * 0.75, g - h * 0.47)}Z` +
      `M${P(x - w * 0.6, g - h * 0.5)}L${P(x - w * 0.15, g - h * 0.5)}L${P(x - w * 0.2, g)}L${P(x - w * 0.62, g)}Z` +
      `M${P(x + w * 0.15, g - h * 0.5)}L${P(x + w * 0.6, g - h * 0.5)}L${P(x + w * 0.62, g)}L${P(x + w * 0.2, g)}Z"/>`;
  }
  function giraffeIcon(x, g, h) {
    const u = h / 10;
    return `<path d="M${P(x - 3 * u, g)}l${u},${-4 * u}l${4 * u},0l${u},${4 * u}l${-u},0l${-0.6 * u},${-2.6 * u}l${-2.8 * u},0l${-0.6 * u},${2.6 * u}Z` +
      `M${P(x + 1.6 * u, g - 4 * u)}l${1.6 * u},${-5.2 * u}l${1.3 * u},${0.3 * u}l${-1.8 * u},${5 * u}Z"/>`;
  }

  /* ---------- labels ---------- */
  function label(ctx, x, y, text, key, cls, anchor) {
    anchor = anchor || 'start';
    if (key && ctx.masked(key)) {
      const w = 34, cx = anchor === 'end' ? x - w / 2 : anchor === 'middle' ? x : x + w / 2;
      return `<g class="qmask" data-unmask="${key}"><rect x="${cx - w / 2}" y="${y - 19}" width="${w}" height="26" rx="13"/><text x="${cx}" y="${y}" text-anchor="middle">?</text></g>`;
    }
    return `<text class="${cls || 'lab'} halo" x="${x}" y="${y}" text-anchor="${anchor}">${text}</text>`;
  }
  function scrub(x, y, text, param, tip, anchor) {
    return `<text class="scrub halo" data-scrub="${param}" x="${x}" y="${y}" text-anchor="${anchor || 'start'}"><title>${tip}</title>${text}</text>`;
  }

  /* ---------- arteries, veins, pressure along the way ---------- */
  function localP(ctx, y, u) {
    const c = ctx.circ, k = c.k, hy = ctx.geo.heart.y;
    if (c.pumps && u != null) {
      let last = null;
      c.pumps.list.forEach((p) => { if (p.u <= u + 1e-9) last = p; });
      if (last) return ctx.v.pHead + last.boost - k * (y - last.y) + c.assist * 0;
    }
    return c.pHeart - k * (y - hy) + c.assist * (u == null ? 0 : u);
  }

  function arteries(ctx, m) {
    const { a, geo, layers } = ctx, walls = layers.has('walls'), n = geo.pts.length - 1;
    const route = [{ x: geo.heart.x, y: geo.heart.y, u: null }];
    for (let i = 0; i <= n; i++) {
      const th = geo.angles[Math.min(i, n - 1)], w = (a.neckW0 + (a.neckW1 - a.neckW0) * i / n) * 0.18;
      route.push({ x: geo.pts[i].x + Math.sin(th) * w, y: geo.pts[i].y - Math.cos(th) * w, u: i / n });
    }
    const top = rotateBody({ x: a.torsoLen * 0.92, y: a.shoulderH * 0.95 }, geo);
    const r = (geo.pitch - 90) * Math.PI / 180, len = a.shoulderH * 0.95;
    const foot = { x: top.x + len * Math.cos(r), y: Math.max(0.04 * a.shoulderH, top.y + len * Math.sin(r)) };
    let s = '';
    const seg = (p, q, u) => {
      const pm = localP(ctx, (p.y + q.y) / 2, u);
      const w = walls ? clamp(2 + 8 * Math.abs(pm) / 1000, 2, 12) : 3;
      s += `<line class="${pm < 0 ? 'vessel-suction' : 'artery'}" x1="${m.X(p.x)}" y1="${m.Y(p.y)}" x2="${m.X(q.x)}" y2="${m.Y(q.y)}" stroke-width="${w.toFixed(1)}"/>`;
    };
    for (let i = 0; i < route.length - 1; i++) seg(route[i], route[i + 1], route[i + 1].u);
    if (walls) {
      const leg = [{ x: geo.heart.x, y: geo.heart.y }, { x: top.x, y: (top.y + geo.heart.y) / 2 }, foot];
      for (let i = 0; i < 2; i++) for (let j = 0; j < 6; j++) {
        const p = leg[i], q = leg[i + 1], u0 = j / 6, u1 = (j + 1) / 6;
        seg({ x: p.x + (q.x - p.x) * u0, y: p.y + (q.y - p.y) * u0 }, { x: p.x + (q.x - p.x) * u1, y: p.y + (q.y - p.y) * u1 }, null);
      }
    }
    return { svg: s, foot };
  }

  function veins(ctx, m) {
    const { a, geo } = ctx, n = geo.pts.length - 1, pts = [];
    for (let i = n; i >= 0; i--) {
      const th = geo.angles[Math.min(i, n - 1)], w = (a.neckW0 + (a.neckW1 - a.neckW0) * i / n) * 0.24;
      pts.push([m.X(geo.pts[i].x - Math.sin(th) * w), m.Y(geo.pts[i].y + Math.cos(th) * w)]);
    }
    pts.push([m.X(geo.heart.x), m.Y(geo.heart.y)]);
    return `<path class="vein" d="${smooth(pts, false)}"/>`;
  }

  function ring(cx, cy, ratio, tip) {
    const r = 8, R = r * (1 + Math.min(ratio, 3.5));
    return `<g><title>${tip}</title><circle class="wall" cx="${cx}" cy="${cy}" r="${R}"/><circle class="lumen" cx="${cx}" cy="${cy}" r="${r}"/></g>`;
  }

  /* ---------- side instruments ---------- */
  function gauge(ctx) {
    const p = ctx.circ.pHeart, H = ctx.H, x = ctx.W - 44, yb = H - PAD.b, yt = PAD.t + 150;
    const top = Math.max(1000, Math.ceil((p + 100) / 250) * 250);
    const Y = (q) => yb - (yb - yt) * clamp(q, 0, top) / top;
    const lvl = p <= 150 ? 'good' : p <= 250 ? 'warning' : 'critical';
    let s = `<g class="gauge"><title>Pressure at the heart (mmHg). Marks: human, giraffe.</title>`;
    for (let t = 0; t <= top; t += 250) s += `<line class="tick" x1="${x - 16}" y1="${Y(t)}" x2="${x - 10}" y2="${Y(t)}"/><text class="t-tick" x="${x - 19}" y="${Y(t) + 4}" text-anchor="end">${t}</text>`;
    s += `<rect class="tube" x="${x - 9}" y="${yt - 6}" width="18" height="${yb - yt + 6}" rx="9"/>`;
    if (!ctx.masked('pHeart')) s += `<rect class="fill-${lvl}" x="${x - 5}" y="${Y(p)}" width="10" height="${Math.max(0, yb - Y(p) - 3)}" rx="5"/>`;
    s += `<g class="ref-icon">${humanIcon(x + 22, Y(95) + 7, 14)}${giraffeIcon(x + 22, Y(205) + 7, 16)}</g>`;
    s += `<line class="tick" x1="${x + 10}" y1="${Y(95)}" x2="${x + 16}" y2="${Y(95)}"/><line class="tick" x1="${x + 10}" y1="${Y(205)}" x2="${x + 16}" y2="${Y(205)}"/>`;
    s += `<text class="t-tick" x="${x}" y="${yb + 18}" text-anchor="middle">mmHg</text></g>`;
    return s;
  }

  function sparkline(ctx) {
    const b = ctx.brain; if (!b) return '';
    const x0 = PAD.l + 48, y0 = PAD.t, w = Math.min(300, ctx.W * 0.3), h = 118, span = 30;
    const now = b.t, max = Math.max(1000, ...b.hist.map((r) => Math.max(r.P, r.brain)));
    const top = Math.ceil(max / 250) * 250, bot = -100;
    const X = (t) => x0 + w * (1 - (now - t) / span), Y = (p) => y0 + h - h * (clamp(p, bot, top) - bot) / (top - bot);
    let s = `<g class="spark"><title>Blood pressure at the brain (red) and heart (grey), last 30 s</title>`;
    s += `<rect class="spark-bg" x="${x0}" y="${y0}" width="${w}" height="${h}" rx="6"/>`;
    s += `<rect class="zone-critical" x="${x0}" y="${y0}" width="${w}" height="${Math.max(0, Y(ctx.v.burstP) - y0)}"/>`;
    s += `<rect class="zone-warning" x="${x0}" y="${Y(ctx.v.faintP)}" width="${w}" height="${Math.max(0, y0 + h - Y(ctx.v.faintP))}"/>`;
    [0, top / 2, top].forEach((t) => { s += `<text class="t-tick" x="${x0 - 4}" y="${Y(t) + 4}" text-anchor="end">${f(t)}</text>`; });
    const pts = b.hist.filter((r) => now - r.t <= span);
    if (pts.length > 1) {
      s += `<path class="line-heart" d="M${pts.map((r) => P(X(r.t), Y(r.P))).join('L')}"/>`;
      s += `<path class="line-brain" d="M${pts.map((r) => P(X(r.t), Y(r.brain))).join('L')}"/>`;
    }
    s += scrub(x0 + w - 6, y0 + h + 18, `τ ${ctx.v.reflexT >= 60 ? '∞' : f(ctx.v.reflexT, 1)} s`, 'reflexT', 'Reflex response time: how fast the heart re-sets its pressure. Drag.', 'end');
    return s + '</g>';
  }

  function donut(ctx, cx, cy) {
    const e = ctx.energy, r = 22, frac = clamp(e.circFrac, 0, 0.999), a = frac * 2 * Math.PI;
    const x1 = cx + r * Math.sin(a), y1 = cy - r * Math.cos(a);
    let s = `<g class="donut"><title>Share of the energy budget spent circulating blood</title><circle class="donut-track" cx="${cx}" cy="${cy}" r="${r}"/>`;
    if (!ctx.masked('energy')) {
      s += `<path class="donut-arc" d="M${cx},${cy - r}A${r},${r} 0 ${a > Math.PI ? 1 : 0} 1 ${P(x1, y1)}"/>`;
      s += `<text class="lab-sm" x="${cx}" y="${cy + 5}" text-anchor="middle">${f(100 * e.circFrac)}%</text>`;
    }
    s += '</g>';
    if (ctx.masked('energy')) s += label(ctx, cx, cy + 6, '', 'energy', '', 'middle');
    s += scrub(cx, cy + r + 20, '×' + f(ctx.v.intensity, ctx.v.intensity < 1 ? 2 : 1), 'intensity', 'Metabolic rate, × a mammal of this size. Drag. (~0.1 lizard-like)', 'middle');
    return s;
  }

  /* ---------- the whole picture ---------- */
  function draw(ctx) {
    const { a, v, geo, layers, W, H } = ctx;
    const m = mapper(ctx.frame, W, H);
    const on = (k) => layers.has(k);
    let s = `<defs><pattern id="bubbles" width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="3.5" cy="3.5" r="2.3" class="bubble"/><circle cx="9.5" cy="9" r="1.6" class="bubble"/></pattern></defs>`;

    // ground and ruler
    s += `<rect class="ground" x="0" y="${m.Y(0)}" width="${W}" height="${PAD.b}"/><line class="ground-line" x1="0" y1="${m.Y(0)}" x2="${W}" y2="${m.Y(0)}"/>`;
    const topM = m.wy(PAD.t), step = topM > 24 ? 5 : topM > 12 ? 2 : 1, rx = PAD.l - 16;
    s += `<line class="rule" x1="${rx}" y1="${m.Y(0)}" x2="${rx}" y2="${PAD.t}"/>`;
    for (let y = 0; y <= topM; y += step) s += `<line class="rule" x1="${rx - 6}" y1="${m.Y(y)}" x2="${rx}" y2="${m.Y(y)}"/><text class="t-tick" x="${rx - 9}" y="${m.Y(y) + 4}" text-anchor="end">${y}</text>`;
    s += `<text class="t-tick" x="${rx - 9}" y="${m.Y(0) + 20}" text-anchor="end">m</text>`;

    // reach (energy layer)
    if (on('energy')) {
      const R = (v.neckLen + a.headLen * 0.3) * m.s, c = geo.neckBase;
      s += `<circle class="sphere" cx="${m.X(c.x)}" cy="${m.Y(c.y)}" r="${R}"><title>Reach from the shoulders</title></circle>`;
    }

    // far legs
    const hipTop = { x: geo.hip.x, y: geo.hip.y * 0.95 };
    const shTop = rotateBody({ x: a.torsoLen * 0.92, y: a.shoulderH * 0.95 }, geo);
    const off = a.legW * 0.9;
    const farH = legPath(a, hipTop, a.hipH * 0.95, 0, m, off), farF = legPath(a, shTop, a.shoulderH * 0.95, geo.pitch, m, off);
    s += `<g class="far"><path class="sil-o" d="${farH.d}"/><path class="sil-o" d="${farF.d}"/><path class="sil-f" d="${farH.d}"/><path class="sil-f" d="${farF.d}"/></g>`;

    // near side: outline pass then fill pass gives one silhouette
    const hd = headShape(a, geo, m);
    const nearH = legPath(a, hipTop, a.hipH * 0.95, 0, m, 0), nearF = legPath(a, shTop, a.shoulderH * 0.95, geo.pitch, m, 0);
    const neckD = neckOutline(a, geo, m);
    const parts = [['body', tailPath(a, geo, m)], ['body', torsoPath(a, geo, m)], ['neck', neckD], ['head', hd.d], ['body', nearH.d], ['foot', nearF.d]];
    s += '<g class="near">' + parts.map(([, d]) => `<path class="sil-o" d="${d}"/>`).join('') +
      parts.map(([hit, d]) => `<path class="sil-f h-${hit}" data-hit="${hit}" d="${d}"/>`).join('') + '</g>';
    if (hd.horn) s += `<line class="sil-line" x1="${hd.horn[0][0]}" y1="${hd.horn[0][1]}" x2="${hd.horn[1][0]}" y2="${hd.horn[1][1]}"/>`;

    // air in the neck
    if (on('air')) s += `<path class="air-fill" d="${neckD}" style="opacity:${(0.1 + 0.9 * v.air / 70).toFixed(2)}"/>`;

    // siphon: shade the stretch of neck under suction
    if (on('siphon') && ctx.circ.mode === 'siphon') {
      const n = geo.pts.length - 1;
      let from = null;
      for (let i = 0; i <= n; i++) if (from == null && localP(ctx, geo.pts[i].y, i / n) < 0) from = i;
      if (from != null && from < n) s += `<path class="suction-zone" d="${neckOutline(a, geo, m, from, n)}"><title>Blood here is below air pressure (suction)</title></path>`;
    }

    // vessels
    let foot = null;
    if (on('siphon')) s += veins(ctx, m);
    if (on('pressure') || on('walls')) { const art = arteries(ctx, m); s += art.svg; foot = art.foot; }

    // pumps
    if (on('pumps') && ctx.circ.pumps) ctx.circ.pumps.list.forEach((p) => {
      const q = M.pointAt(geo, p.u);
      s += `<circle class="pump" data-hit="pump" data-u="${p.u}" cx="${m.X(q.x)}" cy="${m.Y(q.y)}" r="8"><title>Neck pump (click to remove)</title></circle>`;
    });

    // heart
    const hx = m.X(geo.heart.x), hy = m.Y(geo.heart.y);
    let hs = clamp(0.4 * m.s * Math.cbrt(a.mass / 20000) * 1.3, 12, 32);
    if (on('heart')) {
      const big = clamp(hs * Math.cbrt(ctx.heart.times), 8, 110);
      s += `<path class="heart-ghost" d="${heartPath(hx, hy, hs)}"/>`;
      hs = big;
    }
    const beat = on('heart') ? 1 + 0.13 * ctx.beat : 1;
    s += `<g class="h-heart" data-hit="heart"><title>Heart: click to speed up (shift-click slows)</title><circle class="hit" cx="${hx}" cy="${hy}" r="${Math.max(18, hs * 0.8)}"/><path class="heart" d="${heartPath(hx, hy, hs * beat)}"/></g>`;

    // rings for artery walls
    if (on('walls')) {
      const st = v.wallStress;
      s += ring(hx, hy - hs * 0.7 - 30, M.wallRatio(ctx.circ.pHeart, st), 'Artery wall at the heart');
      const bx = m.X(geo.brain.x), by = m.Y(geo.brain.y);
      s += ring(bx - 26, by - 26, M.wallRatio(ctx.circ.pAtHead, st), 'Artery wall at the head');
      if (foot) s += ring(m.X(foot.x) - 34, m.Y(0) + 28, M.wallRatio(ctx.circ.pAtFeet, st), 'Artery wall at the feet');
    }

    // bones: neutral poses
    if (on('bones')) {
      const c = M.cartilage(a, v.cartPct);
      const onp = M.geometry(a, Object.assign({}, v, { neckAngle: 0, curv: 0 }));
      const cnp = M.geometry(a, Object.assign({}, v, { neckAngle: 0, curv: c.perJoint }));
      const line = (g) => 'M' + g.pts.map((p) => P(m.X(p.x), m.Y(p.y))).join('L');
      s += `<path class="ghost-onp" d="${line(onp)}"><title>Bones only (osteological neutral pose)</title></path>`;
      s += `<g data-hit="ghost" class="h-ghost"><title>Bones + cartilage (click to use this pose)</title><path class="ghost-hit" d="${line(cnp)}"/><path class="ghost-cnp" d="${line(cnp)}"/></g>`;
      const apex = cnp.pts.reduce((b, p) => (p.y > b.y ? p : b), cnp.pts[0]);
      s += scrub(m.X(apex.x), m.Y(apex.y) - 14, f(v.cartPct, 1) + '%', 'cartPct', 'Cartilage thickness, % of centrum length (Taylor 2014). Drag.', 'middle');
    }

    // numbers on the animal
    const bx = m.X(geo.brain.x), by = m.Y(geo.brain.y);
    if (on('pressure')) {
      s += label(ctx, hx - hs * 0.75 - 8, hy + 7, f(ctx.circ.pHeart) + ' mmHg', 'pHeart', 'lab', 'end');
      if (!on('brain')) {
        if (ctx.circ.mode === 'heart' || ctx.circ.pumps) s += scrub(bx + 14, by - 30, f(ctx.circ.pAtHead) + ' mmHg', 'pHead', 'Pressure the head needs (Seymour 2009 used 50). Drag.');
        else s += label(ctx, bx + 14, by - 30, f(ctx.circ.pAtHead) + ' mmHg', 'pHeart', 'lab');
      }
      s += gauge(ctx);
    }
    if (on('walls') && foot) s += label(ctx, m.X(foot.x) + 4, m.Y(0) + 36, f(ctx.circ.pAtFeet) + ' mmHg', 'wall', 'lab-sm', 'start');
    if (on('heart')) {
      s += label(ctx, hx + hs * 0.75 + 8, hy + 6, f(ctx.heart.pct, ctx.heart.pct < 1 ? 2 : 1) + '%', 'lv', 'lab-sm');
      s += scrub(hx, hy + hs * 0.7 + 22, f(v.hr) + '/min', 'hr', 'Heart rate. Drag, or click the heart.', 'middle');
    }
    if (on('energy')) {
      const back = rotateBody({ x: a.torsoLen * 0.35, y: Math.max(a.hipH, a.shoulderH) * 1.07 }, geo);
      s += donut(ctx, m.X(back.x), m.Y(back.y) - 34);
    }
    if (on('siphon') && ctx.circ.mode === 'siphon') {
      const mid = M.pointAt(geo, 0.78), th = geo.angles[Math.floor(0.78 * (geo.pts.length - 1))], off = a.neckW1 * m.s + 16;
      s += scrub(m.X(mid.x) + Math.sin(th) * off + 4, m.Y(mid.y) + Math.cos(th) * off + 6, '−' + f(v.veinTol) + ' mmHg', 'veinTol', 'Most suction the veins hold before they collapse. Drag. (Blood boils past ~−713.)', 'start');
      if (ctx.circ.siphon.boiling) for (let i = 0; i < 5; i++) s += `<circle class="boil" cx="${bx - 10 + i * 7}" cy="${by - 16 - (i % 2) * 6}" r="${2.5 + (i % 3)}"><title>Blood boils: the siphon can't pull harder</title></circle>`;
    }
    if (on('air')) {
      const mid = M.pointAt(geo, 0.45), nb = { x: m.X(geo.neckBase.x), y: m.Y(geo.neckBase.y) };
      const th = geo.angles[Math.floor(0.45 * (geo.pts.length - 1))];
      const off = (a.neckW0 * 0.8) * m.s + 14;
      s += scrub(m.X(mid.x) + Math.sin(th) * off, m.Y(mid.y) + Math.cos(th) * off + 6, f(v.air) + '% air', 'air', 'Air in the neck, % of its volume. Drag.', 'middle');
      const tq = M.neckMechanics(a, v, geo).torque / 1000;
      s += `<path class="torque" d="M${P(nb.x + 30, nb.y)}A30,30 0 1 1 ${P(nb.x, nb.y + 30)}"/><path class="torque-head" d="M${P(nb.x - 6, nb.y + 24)}L${P(nb.x, nb.y + 30)}L${P(nb.x - 6, nb.y + 36)}"/>`;
      s += label(ctx, nb.x + 40, nb.y - 16, f(tq) + ' kN·m', 'air', 'lab-sm');
      s += scrub(nb.x + 40, nb.y + 6, '+' + f(v.airP, 1) + ' mmHg', 'airP', 'Air-sac pressure squeezing the vessels. Birds: ~1 breathing, up to ~44 singing. Drag.');
    }
    if (on('brain') && ctx.brain) {
      const b = ctx.brain, lvl = b.brain > v.burstP ? 'critical' : b.brain < v.faintP ? 'warning' : 'good';
      s += `<text class="lab live-${lvl} halo" x="${bx + 14}" y="${by - 30}">${f(b.brain)} mmHg</text>`;
      s += sparkline(ctx);
      s += `<g class="rete-btn${v.reteT > 0 ? ' on' : ''}" data-hit="rete"><title>Rete mirabile: ${v.reteT > 0 ? 'on' : 'off'} (click)</title><circle cx="${bx - 34}" cy="${by + 6}" r="10"/><path d="M${bx - 41},${by + 3}l4,5l4,-6l4,6M${bx - 41},${by + 9}l4,-4l4,5l4,-5"/></g>`;
    }

    // head-above-heart
    if (on('dh')) {
      const X = clamp(Math.max(m.X(geo.brain.x + a.headLen * 1.2), hx + 40), 0, W - PAD.r - 30), y0 = hy, y1 = by;
      s += `<line class="dim-guide" x1="${hx + hs * 0.6}" y1="${y0}" x2="${X}" y2="${y0}"/><line class="dim-guide" x1="${bx}" y1="${y1}" x2="${X}" y2="${y1}"/>`;
      if (Math.abs(y1 - y0) > 16) {
        const up = y1 < y0 ? 1 : -1;
        s += `<line class="dim" x1="${X}" y1="${y0}" x2="${X}" y2="${y1}"/><path class="dim" d="M${X - 5},${y1 + 9 * up}L${X},${y1}L${X + 5},${y1 + 9 * up}M${X - 5},${y0 - 9 * up}L${X},${y0}L${X + 5},${y0 - 9 * up}"/>`;
      }
      s += label(ctx, X + 8, (y0 + y1) / 2 + 8, f(geo.dh, 1) + ' m', 'dh', 'lab-big');
    }

    // the eye: shut when the brain faints, a star when a vessel bursts
    const b = ctx.brain, fainted = on('brain') && b && b.brain < v.faintP, burst = on('brain') && b && b.brain > v.burstP;
    if (fainted) s += `<path class="eye-shut" d="M${hd.eye[0] - 5},${hd.eye[1]}l10,0"/>`;
    else s += `<circle class="eye" cx="${hd.eye[0]}" cy="${hd.eye[1]}" r="${clamp(0.035 * a.headLen * m.s * 3, 2, 4)}"/>`;
    if (burst) s += `<path class="burst" d="M${bx},${by - 16}l4,10l10,-4l-6,9l9,6l-11,1l1,11l-7,-8l-7,8l1,-11l-11,-1l9,-6l-6,-9l10,4z"/>`;

    // head handle
    s += `<circle class="hit h-head" data-hit="head" cx="${hd.mid[0]}" cy="${hd.mid[1]}" r="${Math.max(22, a.headLen * m.s * 0.7)}"><title>Drag the head. Double-click to drink.</title></circle>`;
    s += `<circle class="grip" cx="${hd.mid[0]}" cy="${hd.mid[1]}" r="${Math.max(16, a.headLen * m.s * 0.6)}"/>`;

    // while dragging: show what is changing
    if (ctx.drag === 'head') {
      const nb = { x: m.X(geo.neckBase.x), y: m.Y(geo.neckBase.y) }, r = 40, t = -v.neckAngle * Math.PI / 180;
      s += `<path class="angle" d="M${nb.x + r},${nb.y}A${r},${r} 0 0 ${v.neckAngle > 0 ? 0 : 1} ${P(nb.x + r * Math.cos(t), nb.y + r * Math.sin(t))}"/>`;
      s += `<text class="lab-sm halo" x="${nb.x + r + 6}" y="${nb.y + (v.neckAngle > 0 ? -6 : 18)}">${f(v.neckAngle)}°</text>`;
    }
    s += `<text class="t-mass halo" x="${m.X(a.torsoLen * 0.45)}" y="${m.Y(a.bellyH) + 24}" text-anchor="middle">${f(a.mass / 1000, a.mass < 10000 ? 1 : 0)} t</text>`;

    // a person for scale
    s += `<g class="human"><title>1.75 m person</title>${humanIcon(m.X(m.frame.x0 + 0.5), m.Y(0), 1.75 * m.s)}</g>`;
    return { svg: s, map: m };
  }

  root.View = { draw, bounds, mapper, f };
})(this);
