/* The last slide: every claim as a chip on one line from guess to solid.
 * A chip starts where the room put its marker; claims nobody rated wait in the
 * tray. Drag any chip to move it. Builds add the distance-from-the-bone dots,
 * then the authors' own hedge word for each claim. */
(function () {
  'use strict';
  const D = window.Deck;
  const BX = 100, BW = 1400, CW = 290, CH = 80, PITCH = 88, LANES = 5;

  D.parts.rank = function (def, host) {
    host.innerHTML = '<div class="rk"><div class="rk-band"></div><div class="rk-tray"></div></div>';
    const root = host.firstChild;
    D.BINS.forEach((lab, i) => {
      const x = BX + BW * (i + 0.5) / 5;
      D.el('div', 'rk-bin', root, lab).style.left = x + 'px';
      if (i) D.el('div', 'rk-tick', root).style.left = (BX + BW * i / 5) + 'px';
    });
    const st = () => D.get('rank', () => ({ pos: {} }));
    let b0 = 0;

    const chips = def.chips.map((c) => {
      const e = D.el('div', 'rk-chip' + (c.extra ? ' extra' : ''), root,
        `<b>${c.extra ? '＋' : c.n}</b><span class="lab">${D.fmt(c.label)}</span><span class="stp"></span><small class="word">${D.fmt(c.word)}</small>`);
      e.title = 'Distance from the bone: ' + D.DIST[c.step];
      const stp = e.querySelector('.stp');
      for (let i = 1; i <= 4; i++) D.el('i', i <= c.step ? '' : 'o', stp);
      D.drag(e, root, {
        minX: 0, maxX: 1600 - CW, minY: 0, maxY: 690 - CH,
        end(x, y) { st().pos[c.id] = { x, y }; D.save(); }
      });
      return { c, e };
    });

    function live() { return chips.filter((k) => !k.c.extra || D.flags.extras); }
    function layout() {
      const vis = live();
      chips.forEach((k) => k.e.style.display = vis.includes(k) ? '' : 'none');
      const pos = st().pos;
      // chips with a call, left to right, into the first lane with room
      const laneEnd = Array(LANES).fill(-1e9);
      const ranked = vis.filter((k) => !pos[k.c.id] && D.callOf(k.c.id) != null)
        .sort((a, b) => D.callOf(a.c.id) - D.callOf(b.c.id));
      const tray = vis.filter((k) => !pos[k.c.id] && D.callOf(k.c.id) == null);
      const cols = Math.max(1, Math.ceil(tray.length / 2));
      const pitch = cols > 1 ? Math.min(CW + 10, (BW - CW) / (cols - 1)) : 0;
      vis.forEach((k) => {
        let x, y;
        const p = pos[k.c.id];
        if (p) { x = p.x; y = p.y; }
        else if (D.callOf(k.c.id) != null) {
          x = D.clamp(BX + BW * D.callOf(k.c.id) - CW / 2, 40, 1600 - CW - 40);
          let lane = laneEnd.findIndex((end) => x >= end);
          if (lane < 0) lane = ranked.indexOf(k) % LANES;
          laneEnd[lane] = x + CW + 10;
          y = 18 + lane * PITCH;
        } else {
          const i = tray.indexOf(k);
          x = BX + (i % cols) * pitch; y = 524 + Math.floor(i / cols) * 82;
        }
        k.e.style.left = x + 'px'; k.e.style.top = y + 'px';
      });
    }
    layout();
    D.on('extras', layout);

    return {
      show(b, how) {
        b0 = b;
        root.classList.toggle('dots', b >= 1);
        root.classList.toggle('words', b >= 2);
        chips.forEach((k) => {
          k.e.querySelector('.stp').style.visibility = b >= 1 ? 'visible' : 'hidden';
          k.e.querySelector('.word').style.display = b >= 2 ? '' : 'none';
        });
        layout();
      },
      reset() { layout(); }
    };
  };
})();
