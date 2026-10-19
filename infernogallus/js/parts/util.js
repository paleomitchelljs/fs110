/* Shared helpers for the parts: text formatting, dragging, icons, and the
 * saved certainty for each claim (which the final sort reads). */
(function () {
  'use strict';
  const D = window.Deck;

  /* _Genus_ in italics, *stress* in the accent colour, ==hedge== marked. */
  D.fmt = function (s) {
    return D.esc(s || '')
      .replace(/_([^_]+)_/g, '<i>$1</i>')
      .replace(/==([^=]+)==/g, '<mark>$1</mark>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>');
  };

  /* Drag an absolutely positioned element inside host. o: start(), move(x, y),
   * end(x, y), and optional bounds minX, maxX, minY, maxY (host pixels). */
  D.drag = function (el, host, o) {
    el.classList.add('grab');
    el.addEventListener('pointerdown', (ev) => {
      if (ev.button) return;
      ev.preventDefault(); ev.stopPropagation();
      el.setPointerCapture(ev.pointerId);
      const p0 = D.local(host, ev), x0 = el.offsetLeft, y0 = el.offsetTop;
      let x = x0, y = y0;
      el.classList.add('dragging');
      if (o.start) o.start();
      const move = (m) => {
        const p = D.local(host, m);
        x = D.clamp(x0 + p.x - p0.x, o.minX == null ? -1e9 : o.minX, o.maxX == null ? 1e9 : o.maxX);
        y = D.clamp(y0 + p.y - p0.y, o.minY == null ? -1e9 : o.minY, o.maxY == null ? 1e9 : o.maxY);
        el.style.left = x + 'px'; el.style.top = y + 'px';
        if (o.move) o.move(x, y);
      };
      const up = () => {
        el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up);
        el.classList.remove('dragging');
        if (o.end) o.end(x, y);
      };
      el.addEventListener('pointermove', move); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
    });
  };

  /* Drag a knob along a horizontal track; set(k) gets 0–1. */
  D.slide = function (knob, track, set, end) {
    knob.addEventListener('pointerdown', (ev) => {
      ev.preventDefault(); ev.stopPropagation();
      knob.setPointerCapture(ev.pointerId);
      knob.classList.add('drag');
      const move = (m) => { const r = track.getBoundingClientRect(); set(D.clamp((m.clientX - r.left) / r.width, 0, 1)); };
      const up = () => {
        knob.removeEventListener('pointermove', move); knob.removeEventListener('pointerup', up); knob.removeEventListener('pointercancel', up);
        knob.classList.remove('drag');
        if (end) end();
      };
      knob.addEventListener('pointermove', move); knob.addEventListener('pointerup', up); knob.addEventListener('pointercancel', up);
    });
  };

  /* More icons (24 × 24, stroked) for the map of a paper. */
  Object.assign(D.icons, {
    method: '<svg viewBox="0 0 24 24"><path d="M9 3h6M10 3v6l-5.5 10a1.5 1.5 0 0 0 1.3 2.2h12.4a1.5 1.5 0 0 0 1.3-2.2L14 9V3"/><path d="M7.5 15h9"/></svg>',
    fine: '<svg viewBox="0 0 24 24"><rect x="7" y="3" width="13" height="15" rx="1.5"/><path d="M3.5 7v13.5h13M10.5 8h6M10.5 12h6"/></svg>'
  });

  /* Row bullets: filled for evidence, hollow for an alternative, the balance for the test. */
  D.bul = {
    ev: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="6" fill="currentColor" stroke="none"/></svg>',
    alt: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5.5" stroke-width="3"/></svg>',
    test: D.icons.test
  };

  /* Certainty: five bins, 0–1 along the bar. */
  D.BINS = ['Guess', 'Maybe', 'Likely', 'Strong', 'Solid'];
  D.cert = (id) => D.get('cert:' + id, () => ({ v: [0, 0, 0, 0, 0], call: null }));
  /* The room's call for a claim: the marker if it was placed, else the mean of the votes. */
  D.callOf = function (id) {
    if (id === 'c7') {
      const L = D.peek('ladder:c7');
      if (L && L.v[3] != null) return L.v[3];
    }
    const c = D.peek('cert:' + id);
    if (!c) return null;
    if (c.call != null) return c.call;
    const n = c.v.reduce((a, b) => a + b, 0);
    if (!n) return null;
    return c.v.reduce((a, b, i) => a + b * (i + 0.5) / 5, 0) / n;
  };
})();
