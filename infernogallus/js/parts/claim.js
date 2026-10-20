/* The claim page. One template, used for every claim in the paper:
 *
 *   build 0         the claim and a picture
 *   evidence rows   one per build
 *   alternatives    one per build
 *   test            what would tell them apart
 *   sure            the room votes (keys 1–5, or tap a bin); the marker is the room's call
 *   quote           the authors' own words, hedges marked
 *
 * Rows are always laid out in the same place, so nothing jumps when one fills in.
 * The room's votes are saved per claim (Deck.cert) and the last slide reads them. */
(function () {
  'use strict';
  const D = window.Deck;
  D.viz = {};
  D.DIST = ['Bone', 'Measure', 'Model', 'Analogy', 'Beyond'];
  const DIST_TIP = [
    'Seen on the bone itself',
    'Measured or counted from the bone',
    'Needs a model or reconstruction',
    'Rests on a comparison with living animals',
    'Reaches beyond the specimens'
  ];

  /* A picture, as large as fits, with its credit under it. */
  D.viz.img = function (layer, v) {
    layer.innerHTML = `<img class="vz-img" src="${D.esc(v.src)}" alt="${D.esc(v.alt || '')}" draggable="false"><div class="vz-cap">${D.fmt(v.cap || '')}</div>`;
  };

  /* Number badge, claim, and the distance-from-the-bone strip. */
  D.claimHead = function (host, c) {
    const head = D.el('div', 'cl-head', host);
    D.el('div', 'cl-num' + (c.extra ? ' extra' : ''), head, c.extra ? '＋' : String(c.n));
    D.el('div', 'cl-title', head, D.fmt(c.claim));
    const dist = D.el('div', 'cl-dist', host);
    D.DIST.forEach((lab, i) => {
      const n = D.el('div', 'd-node' + (i <= c.step ? ' on' : '') + (i === c.step ? ' here' : ''), dist, '<i></i>' + lab);
      n.title = DIST_TIP[i];
    });
  };

  D.parts.claim = function (def, host) {
    const c = def.claim;
    const norm = (x) => (typeof x === 'string' ? { t: x } : x);
    const ev = c.evidence.map(norm), alt = c.alt.map(norm);
    const E = ev.length, A = alt.length;
    const idx = { claim: 0, ev: 1, alt: 1 + E, test: 1 + E + A, sure: 2 + E + A, quote: 3 + E + A };
    let cur = 0;

    host.innerHTML = '';
    D.claimHead(host, c);

    /* pictures */
    const vz = D.el('div', 'cl-viz', host);
    const at = (f) => (typeof f === 'string' ? idx[f] : (f || 0));
    const views = (c.viz || []).map((v) => {
      const layer = D.el('div', 'vz', vz);
      const api = (D.viz[v.kind] && D.viz[v.kind](layer, v, c, idx)) || {};
      return { v, layer, api, from: at(v.from), was: false };
    }).sort((a, b) => a.from - b.from);

    /* rows */
    const rowsEl = D.el('div', 'cl-rows', host);
    const rows = [];
    const addRow = (kind, item, i, gap) => {
      const e = D.el('div', 'row ' + kind + (item.own ? ' mine' : '') + (gap ? ' gap' : ''), rowsEl,
        D.bul[kind] + '<span>' + D.fmt(item.t) + '</span>');
      if (item.own) e.title = 'Added by the deck, not raised in the paper';
      rows.push({ e, at: i });
    };
    ev.forEach((x, i) => addRow('ev', x, idx.ev + i, false));
    alt.forEach((x, i) => addRow('alt', x, idx.alt + i, i === 0));
    addRow('test', { t: c.test }, idx.test, true);

    /* quotes */
    const qs = D.el('div', 'cl-quotes', host);
    const quotes = (c.quotes || []).map((q) => D.el('div', 'q', qs, '<span>“' + D.fmt(q) + '”</span>'));

    /* certainty gauge */
    const g = D.el('div', 'gauge', host);
    const dots = D.el('div', 'g-dots', g), bar = D.el('div', 'g-bar', g);
    const cols = [], bins = [];
    D.BINS.forEach((lab, i) => {
      cols.push(D.el('div', 'g-col', dots));
      const b = D.el('div', 'g-bin', bar, lab);
      b.title = 'Click to add a vote · shift-click to take one back (keys 1–5)';
      b.addEventListener('click', (ev) => vote(i, ev.shiftKey || ev.altKey));
      bins.push(b);
    });
    const undo = D.el('button', 'g-undo', g, '↶');
    undo.title = 'Undo the last vote (and clear the marker if there are no votes left)';
    undo.addEventListener('click', () => vote(-1, true));
    const mark = D.el('div', 'g-mark', g);
    mark.title = "The room's call: drag to move it · double-click to follow the votes";
    D.slide(mark, bar, (k) => { D.cert(c.id).call = k; paint(); }, () => D.save());
    mark.addEventListener('dblclick', () => { D.cert(c.id).call = null; paint(); D.save(); });

    function vote(i, undo) {
      const s = D.cert(c.id);
      s.h = s.h || [];
      if (undo) {
        // i < 0: take back the latest click, wherever it was; otherwise the latest in that bin
        const any = i < 0;
        if (any) i = s.h.length ? s.h[s.h.length - 1] : s.v.reduce((m, n, j) => (n ? j : m), -1);
        if (i < 0 || !s.v[i]) { if (any) s.call = null; }
        else {
          s.v[i]--;
          const at = s.h.lastIndexOf(i);
          if (at >= 0) s.h.splice(at, 1);
        }
      } else { s.v[i]++; s.h.push(i); }
      D.save(); paint();
    }
    function paint() {
      const s = D.cert(c.id);
      s.v.forEach((n, i) => {
        while (cols[i].children.length > n) cols[i].lastChild.remove();
        while (cols[i].children.length < n) D.el('i', 'g-dot', cols[i]);
        // many votes: shrink the dots so the column still fits
        const k = n > 24 ? 10 : n > 14 ? 12 : 15;
        for (const d of cols[i].children) d.style.cssText = `width:${k}px;height:${k}px;`;
      });
      const call = D.callOf(c.id);
      mark.classList.toggle('on', call != null);
      if (call != null) mark.style.left = (call * 100) + '%';
    }
    paint();

    return {
      show(b, how) {
        cur = b;
        rows.forEach((r) => {
          const on = b >= r.at, was = r.e.classList.contains('on');
          r.e.classList.toggle('on', on);
          if (on && !was && how === 'step') D.replay(r.e, 'play');
        });
        g.classList.toggle('on', b >= idx.sure);
        quotes.forEach((q) => q.classList.toggle('on', b >= idx.quote));
        views.forEach((w, k) => {
          const next = views[k + 1], on = b >= w.from && (!next || b < next.from);
          w.layer.classList.toggle('on', on);
          if (w.api.show) w.api.show(b, how, on, !w.was && on);
          if (on) w.was = true;
        });
      },
      hide() { views.forEach((w) => { w.was = false; if (w.api.hide) w.api.hide(); }); },
      digit(n, shift) { if (cur >= idx.sure && n >= 1 && n <= 5) vote(n - 1, shift); },
      reset() { paint(); views.forEach((w) => { w.was = false; if (w.api.reset) w.api.reset(); }); }
    };
  };
})();
