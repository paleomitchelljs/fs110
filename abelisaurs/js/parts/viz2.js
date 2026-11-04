/* Two more claim pictures you can drag.
 *
 *   lever    a claw and its sheath: drag the tip to make the sheath longer and
 *            watch the bending arm at the base. Statics only (M = F × L), not data.
 *   density  clutches per 100 m² at nesting sites, log axis; drag the line for
 *            "how many is a colony?". Densities are computed from Table DR1. */
(function () {
  'use strict';
  const D = window.Deck, { svg, text } = D.vizTools;
  const rad = (d) => d * Math.PI / 180;

  /* ---------- lever: a sheath makes the claw a longer lever ----------
   * A diagram, not data. Pull on the tip of a bent claw and the bending at each
   * point is the force times its straight-line distance to the tip, so the base
   * takes the most. Colour is that bending, blue (low) to red (high), on the same
   * scale as the claw stress figures. Drag the claw tip (or the slider) to add
   * sheath beyond the bone; the base goes redder. */
  D.viz.lever = function (layer, v) {
    const s = svg(layer, 740, 480);
    const R = 190, B = [150, 62], C = [B[0], B[1] + R], TH = 90, MAXE = 0.6, SNAP = 0.4, N = 30, VMAX = 1.3;
    const pt = (deg) => [C[0] + R * Math.sin(rad(deg)), C[1] - R * Math.cos(rad(deg))];
    const arc = (a, b) => { const p = pt(a), q = pt(b); return `M${p[0].toFixed(1)} ${p[1].toFixed(1)} A${R} ${R} 0 ${b - a > 180 ? 1 : 0} 1 ${q[0].toFixed(1)} ${q[1].toFixed(1)}`; };
    const chord = (deg) => 2 * R * Math.sin(rad(deg) / 2);
    const L0 = chord(TH);
    const BL = [45, 95, 208], RD = [208, 59, 59];
    const mix = (k) => { k = D.clamp(k, 0, 1); return `rgb(${BL.map((b, n) => Math.round(b + (RD[n] - b) * k)).join(',')})`; };

    const keratin = D.svg('path', { class: 'lv-ker', d: arc(TH, TH) }, s);
    const segs = [];
    for (let k = 0; k < N; k++) segs.push(D.svg('path', { class: 'lv-seg', d: arc(TH * k / N, TH * (k + 1) / N) }, s));
    D.svg('circle', { class: 'lv-joint', cx: B[0], cy: B[1], r: 15 }, s);
    const force = D.svg('path', { class: 'lv-force', d: '' }, s);
    const handle = D.svg('circle', { class: 'lv-handle grab', r: 22 }, s);
    text(s, B[0] + 28, B[1] - 28, 'joint', 'ms-lab');
    const lbBone = text(s, 0, 0, v.lab.bone, 'lv-lab-b');
    const lbKer = text(s, 0, 0, v.lab.sheath, 'lv-lab-k');

    // readout
    text(s, 440, 118, v.lab.ref, 'lv-cap');
    const ratio = text(s, 440, 206, '', 'lv-ratio');
    // colour key, same wording as the stress figures
    const key = (y, rgb, lab) => { D.svg('rect', { x: 440, y, width: 34, height: 34, rx: 8, fill: rgb, stroke: 'var(--outline)', 'stroke-width': 3 }, s); text(s, 486, y + 27, lab, 'lv-key'); };
    key(268, mix(1), v.lab.hi);
    key(318, mix(0), v.lab.lo);
    text(s, 440, 392, v.lab.note, 'lv-note');

    // slider: how much sheath beyond the bone
    const TX0 = 40, TX1 = 400, TY = 446, xE = (e) => TX0 + (e / MAXE) * (TX1 - TX0);
    text(s, TX0, TY - 34, v.lab.slide, 'lv-cap2');
    D.svg('path', { class: 'ms-axis', d: `M${TX0} ${TY} H${TX1}` }, s);
    [[0, '0'], [SNAP, '+40%'], [MAXE, '+60%']].forEach(([e, l]) => { D.svg('path', { class: 'ms-axis', d: `M${xE(e)} ${TY - 8} v16` }, s); text(s, xE(e), TY + 34, l, 'ms-tick', 'middle'); });
    text(s, xE(SNAP), TY + 62, v.lab.mark, 'lv-mark', 'middle');
    const knob = D.svg('circle', { class: 'ms-me grab', cx: TX0, cy: TY, r: 15 }, s);
    const st = () => D.get('lever', () => ({ e: 0.4 }));
    let e = 0;
    function set(x, save) {
      e = D.clamp(x, 0, MAXE);
      if (Math.abs(e - SNAP) < 0.012) e = SNAP;
      const deg = TH * (1 + e), tip = pt(deg), tail = [tip[0] - 0.9 * 86, tip[1] + 0.44 * 86];
      keratin.setAttribute('d', arc(TH, TH + Math.max(0.0001, deg - TH)));
      keratin.style.opacity = e > 0.004 ? 1 : 0;
      segs.forEach((g, k) => {
        const m = pt(TH * (k + 0.5) / N), dist = Math.hypot(tip[0] - m[0], tip[1] - m[1]);
        g.setAttribute('stroke', mix(dist / L0 / VMAX / (1 + e * 1.5)));
      });
      handle.setAttribute('cx', tip[0]); handle.setAttribute('cy', tip[1]);
      force.setAttribute('d', `M${tail[0]} ${tail[1]} L${tip[0]} ${tip[1]} M${tip[0] - 22} ${tip[1] + 3} L${tip[0]} ${tip[1]} L${tip[0] - 7} ${tip[1] + 22}`);
      knob.setAttribute('cx', xE(e));
      ratio.textContent = '× ' + (1 / (1 + e)).toFixed(2);
      const bm = pt(TH * 0.55); lbBone.setAttribute('x', bm[0] + 30); lbBone.setAttribute('y', bm[1] - 6);
      lbKer.setAttribute('x', Math.min(tip[0] + 30, 400)); lbKer.setAttribute('y', Math.min(tip[1] + 44, 410));
      lbKer.style.opacity = e > 0.004 ? 1 : 0;
      if (save) { st().e = e; D.save(); }
    }
    const fromTip = (m) => {
      const p = D.localv(layer, m), a = Math.atan2(p.y - C[1], p.x - C[0]) * 180 / Math.PI;
      set((a + 90) / TH - 1, true);
    };
    const fromSlide = (m) => { const p = D.localv(layer, m); set(((p.x - TX0) / (TX1 - TX0)) * MAXE, true); };
    const wire = (el, fn) => el.addEventListener('pointerdown', (ev) => {
      ev.preventDefault(); ev.stopPropagation();
      el.setPointerCapture(ev.pointerId); fn(ev);
      const up = () => { el.removeEventListener('pointermove', fn); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up); };
      el.addEventListener('pointermove', fn); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
    });
    wire(handle, fromTip);
    wire(knob, fromSlide);
    const hit = D.svg('rect', { x: TX0 - 20, y: TY - 30, width: TX1 - TX0 + 40, height: 60, fill: 'transparent', class: 'grab' }, s);
    s.insertBefore(hit, knob);
    wire(hit, fromSlide);
    set(st().e || 0, false);
    return { reset() { set(0, false); } };
  };

  /* ---------- density ---------- */
  D.viz.density = function (layer, v) {
    const s = svg(layer, 740, 480);
    const X0 = 262, X1 = 724, Y0 = 62, RP = 42, LO = Math.log10(0.01), HI = Math.log10(100);
    const xOf = (val) => X0 + (Math.log10(val) - LO) / (HI - LO) * (X1 - X0);
    const AXY = Y0 + v.rows.length * RP + 6;
    [0.01, 0.1, 1, 10, 100].forEach((t) => {
      D.svg('path', { class: 'dn-grid', d: `M${xOf(t)} ${Y0 - 10} V${AXY}` }, s);
      text(s, xOf(t), AXY + 34, String(t), 'ms-tick', 'middle');
    });
    D.svg('path', { class: 'ms-axis', d: `M${X0} ${AXY} H${X1}` }, s);
    const rows = v.rows.map((r, i) => {
      const y = Y0 + i * RP + RP / 2;
      const g = D.svg('g', { class: 'dn-row' + (r.mine ? ' mine' : '') }, s);
      const lab = text(g, 0, y + 7, r.name, 'dn-lab');
      if (r.lo != null && r.hi != null) D.svg('rect', { class: 'dn-range', x: xOf(r.lo), y: y - 8, width: xOf(r.hi) - xOf(r.lo), height: 16, rx: 8 }, g);
      const x = xOf(r.v != null ? r.v : (r.lo != null ? r.lo : r.hi));
      const dot = D.svg('circle', { class: 'dn-dot', cx: x, cy: y, r: r.mine ? 14 : 10 }, g);
      if (r.open === '>') D.svg('path', { class: 'dn-arr', d: `M${x + 16} ${y} h22 m-9 -8 l9 8 -9 8` }, g);
      if (r.open === '<') D.svg('path', { class: 'dn-arr', d: `M${x - 16} ${y} h-22 m9 -8 l-9 8 9 8` }, g);
      const val = r.v != null ? r.v : r.lo != null && r.hi != null ? (r.lo + r.hi) / 2 : (r.open === '>' ? r.lo : r.hi);
      return { g, lab, dot, val, r };
    });
    // the line
    const st = () => D.get('density', () => ({ t: 1 }));
    const line = D.svg('path', { class: 'dn-line', d: `M0 ${Y0 - 14} V${AXY}` }, s);
    const knob = D.svg('g', { class: 'dn-knob grab' }, s);
    D.svg('rect', { x: -40, y: -18, width: 80, height: 36, rx: 18, class: 'dn-pill' }, knob);
    const tv = text(knob, 0, 8, '1', 'dn-tv', 'middle');
    const cnt = text(s, 8, 30, '', 'dn-cnt');
    text(s, X1, AXY + 62, v.axis, 'ms-lab', 'end');
    function set(t) {
      t = D.clamp(t, 0.01, 100); st().t = t;
      const x = xOf(t);
      line.setAttribute('transform', `translate(${x} 0)`);
      knob.setAttribute('transform', `translate(${x} ${Y0 - 32})`);
      tv.textContent = t >= 10 ? Math.round(t) : t >= 1 ? (+t.toFixed(1)).toString() : (+t.toFixed(2)).toString();
      let n = 0;
      rows.forEach((k) => { const on = k.val >= t; if (on) n++; k.g.classList.toggle('hit', on); });
      cnt.textContent = n + ' of ' + rows.length;
    }
    const mv = (m) => { const p = D.localv(layer, m); set(Math.pow(10, LO + (D.clamp(p.x, X0, X1) - X0) / (X1 - X0) * (HI - LO))); };
    const catcher = D.svg('rect', { x: X0 - 10, y: 0, width: X1 - X0 + 20, height: AXY + 4, fill: 'transparent', class: 'grab' }, s);
    s.insertBefore(catcher, line);
    [catcher, knob].forEach((el) => el.addEventListener('pointerdown', (ev) => {
      ev.preventDefault(); ev.stopPropagation(); el.setPointerCapture(ev.pointerId); mv(ev);
      const up = () => { el.removeEventListener('pointermove', mv); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up); D.save(); };
      el.addEventListener('pointermove', mv); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
    }));
    set(st().t || 1);
    return { reset() { set(1); } };
  };
})();
