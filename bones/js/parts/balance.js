/* The balance: one pan per hypothesis. Drop a card on a pan and the beam tips
 * toward it; a card both hypotheses expect goes on the pivot and tips
 * nothing; a card that says little goes on the floor. Every card weighs the
 * same: 4° of tilt per card of difference, never more than 20°.
 *
 * Cards start in the tray along the bottom, or in a face-down pile you click
 * to deal (pile: true), or arrive on a given build (card.at). card.place
 * {build: zone} moves a card by script, for demonstrations.
 *
 * Drag a card, or click it and then click where it goes. */
(function () {
  'use strict';
  const D = window.Deck;

  const DEG = 4, MAX = 20;
  const G = {                      // geometry, in the item's own pixels (box 1520 × 690)
    pivotY: 210, half: 400, chain: 80, panW: 520, pivotZone: 120,
    ground: 500, floorY: 506, trayY: 594,
    cw: 170, ch: 96, onPan: 0.9, onFloor: 0.8
  };
  const tilt = (L, R) => D.clamp(DEG * (R - L), -MAX, MAX);

  D.parts.balance = function (def, host) {
    const w = def.box[2], cx = w / 2;
    const st = () => D.get('bal-' + def.id, () => ({ zone: {}, order: {}, n: 0 }));
    let b = 0, sel = null, drag = null;

    /* ---------- drawing ---------- */
    const svg = D.svg('svg', { class: 'bal', viewBox: `0 0 ${w} ${def.box[3]}`, width: w, height: def.box[3] }, host);
    D.svg('line', { class: 'bal-ground', x1: 0, x2: w, y1: G.ground, y2: G.ground }, svg);
    D.svg('path', { class: 'bal-post', d: `M${cx} ${G.pivotY}V${G.ground - 24}M${cx - 70} ${G.ground}L${cx} ${G.ground - 30}L${cx + 70} ${G.ground}Z` }, svg);
    const beam = D.svg('g', { class: 'bal-beamg' }, svg);
    D.svg('rect', { class: 'bal-beam', x: cx - G.half - 10, y: G.pivotY - 7, width: 2 * G.half + 20, height: 14, rx: 7 }, beam);
    const shelf = D.svg('path', { class: 'bal-shelf', d: `M${cx - 60} ${G.pivotY - 16}H${cx + 60}` }, svg);
    D.svg('circle', { class: 'bal-cap', cx, cy: G.pivotY, r: 13 }, svg);
    const pans = [0, 1].map((i) => {
      const g = D.svg('g', { class: 'bal-pan pan-' + i }, svg);
      const chains = D.svg('path', { class: 'bal-chain' }, g);
      const pan = D.svg('path', { class: 'bal-dish', d: `M${-G.panW / 2} 0Q0 34 ${G.panW / 2} 0Z` }, g);
      const label = D.svg('text', { class: 'bal-label', x: 0, y: 56, 'text-anchor': 'middle' }, g);
      label.textContent = def.labels[i];
      return { g, chains, pan, label };
    });
    const pile = D.el('button', 'pile', host);
    pile.type = 'button'; pile.title = 'Deal a card (D). Shift: deal them all';
    pile.style.transform = `translate(0px, ${G.trayY}px)`;

    /* ---------- cards ---------- */
    const cards = def.cards.map((c) => {
      const e = D.card(c, def.labels, host);
      e.addEventListener('pointerdown', (ev) => grab(ev, c, e));
      return { c, e };
    });
    const zoneOf = (c) => st().zone[c.id];
    function inPlay(c) {
      if (c.extra && !D.flags.extras) return false;
      if (c.at != null && b < c.at) return false;
      if (def.pile && c.at == null) return zoneOf(c) && zoneOf(c) !== 'pile';
      return true;
    }
    function setZone(c, z) {
      const s = st();
      if (s.zone[c.id] === z) return;
      s.zone[c.id] = z; s.order[c.id] = ++s.n;
      D.save();
    }

    function layout() {
      const s = st(), live = cards.filter((k) => inPlay(k.c));
      const by = { tray: [], left: [], right: [], pivot: [], floor: [] };
      live.forEach((k) => by[zoneOf(k.c) || 'tray'].push(k));
      for (const z in by) by[z].sort((p, q) => (s.order[p.c.id] || 0) - (s.order[q.c.id] || 0));
      const a = tilt(by.left.length, by.right.length), r = a * Math.PI / 180;
      beam.style.transform = `rotate(${a}deg)`;
      beam.style.transformOrigin = `${cx}px ${G.pivotY}px`;
      const ends = [-1, 1].map((sg) => ({ x: cx + sg * G.half * Math.cos(r), y: G.pivotY + sg * G.half * Math.sin(r) }));
      pans.forEach((p, i) => {
        const e = ends[i], py = e.y + G.chain;
        p.g.style.transform = `translate(${e.x}px, ${py}px)`;
        p.chains.setAttribute('d', `M${-G.panW / 2 + 20} 0L0 ${-G.chain}L${G.panW / 2 - 20} 0`);
        p.label.style.opacity = i === 1 && def.rightAt != null && b < def.rightAt ? 0 : 1;
      });
      const put = (k, x, y, sc, rot) => {
        k.e.style.opacity = 1; k.e.style.pointerEvents = '';
        if (k === drag) return;
        k.e.style.transform = `translate(${x - G.cw / 2}px, ${y - G.ch / 2}px) rotate(${rot || 0}deg) scale(${sc})`;
      };
      /* pans: rows of three, stacking upward from the dish */
      ['left', 'right'].forEach((z, i) => {
        const e = ends[i], py = e.y + G.chain, cw = G.cw * G.onPan + 8, chh = G.ch * G.onPan + 6;
        by[z].forEach((k, j) => {
          const row = Math.floor(j / 3), inRow = Math.min(3, by[z].length - row * 3), col = j % 3;
          put(k, e.x + (col - (inRow - 1) / 2) * cw, py - 8 - chh / 2 - row * chh, G.onPan);
        });
      });
      by.pivot.forEach((k, j) => put(k, cx + (j % 2 ? 7 : -7), G.pivotY - 18 - G.ch * G.onPan / 2 - j * 44, G.onPan, j % 2 ? 2 : -2));
      const fstep = by.floor.length > 1 ? Math.min(150, (w - 220) / (by.floor.length - 1)) : 0;
      by.floor.forEach((k, j) => put(k, 110 + j * fstep, G.floorY + G.ch * G.onFloor / 2, G.onFloor, j % 2 ? 2.5 : -2.5));
      const left = def.pile ? 210 : 0, room = w - left, n = by.tray.length;
      const step = n > 1 ? Math.min(G.cw + 14, (room - G.cw) / (n - 1)) : 0, x0 = left + (room - (n - 1) * step) / 2;
      by.tray.forEach((k, j) => put(k, x0 + j * step, G.trayY + G.ch / 2, 1));
      cards.filter((k) => !inPlay(k.c)).forEach((k) => {
        k.e.style.opacity = 0; k.e.style.pointerEvents = 'none';
        k.e.style.transform = `translate(${10}px, ${G.trayY}px) scale(0.9)`;
      });
      shelf.classList.toggle('used', by.pivot.length > 0);
      const waiting = def.pile ? cards.filter((k) => k.c.at == null && (!k.c.extra || D.flags.extras) && (!zoneOf(k.c) || zoneOf(k.c) === 'pile')).length : 0;
      pile.hidden = !waiting;
      pile.textContent = waiting ? String(waiting) : '';
      cards.forEach((k) => k.e.classList.toggle('sel', k === sel));
      host.classList.toggle('choosing', !!sel);
    }

    /* Which zone a point (item pixels) falls in. */
    function zoneAt(x, y) {
      if (y >= G.trayY - 6) return 'tray';
      if (y >= G.ground) return 'floor';
      if (Math.abs(x - cx) <= G.pivotZone) return 'pivot';
      return x < cx ? 'left' : 'right';
    }
    function hot(z) {
      pans[0].g.classList.toggle('hot', z === 'left');
      pans[1].g.classList.toggle('hot', z === 'right');
      shelf.classList.toggle('hot', z === 'pivot');
      svg.querySelector('.bal-ground').classList.toggle('hot', z === 'floor');
    }

    /* ---------- dragging and clicking ---------- */
    function grab(ev, c, e) {
      if (ev.button > 0 || ev.target.closest('.card-flip')) return;
      ev.preventDefault();
      e.setPointerCapture(ev.pointerId);
      const k = cards.find((q) => q.c === c), p0 = D.local(host, ev);
      const m = (e.style.transform || '').match(/translate\(([-\d.]+)px, ([-\d.]+)px\)/);
      const o = m ? { x: +m[1], y: +m[2] } : { x: 0, y: 0 };
      let moved = false;
      const move = (mv) => {
        const p = D.local(host, mv);
        if (!moved && Math.hypot(p.x - p0.x, p.y - p0.y) < 6) return;
        if (!moved) { moved = true; drag = k; e.classList.add('dragging'); sel = null; layout(); }
        e.style.transform = `translate(${o.x + p.x - p0.x}px, ${o.y + p.y - p0.y}px) scale(1.04)`;
        hot(zoneAt(p.x, p.y));
      };
      const up = (u) => {
        e.removeEventListener('pointermove', move); e.removeEventListener('pointerup', up); e.removeEventListener('pointercancel', up);
        hot(null);
        if (moved) {
          const p = D.local(host, u);
          drag = null; e.classList.remove('dragging');
          setZone(c, zoneAt(p.x, p.y));
        } else sel = sel === k ? null : k;
        layout();
      };
      e.addEventListener('pointermove', move); e.addEventListener('pointerup', up); e.addEventListener('pointercancel', up);
    }
    /* With a card chosen, a click anywhere else on the balance puts it there. */
    host.addEventListener('pointerdown', (ev) => {
      if (!sel || ev.target.closest('.card, .pile')) return;
      const p = D.local(host, ev);
      setZone(sel.c, zoneAt(p.x, p.y));
      sel = null; layout();
    });
    host.addEventListener('pointermove', (ev) => {
      if (!sel || drag) return;
      const p = D.local(host, ev);
      hot(zoneAt(p.x, p.y));
    });

    function deal(all) {
      for (const k of cards) {
        if (k.c.at != null || (k.c.extra && !D.flags.extras)) continue;
        if (zoneOf(k.c) && zoneOf(k.c) !== 'pile') continue;
        setZone(k.c, 'tray');
        if (!all) break;
      }
      layout();
    }
    pile.addEventListener('click', (ev) => { pile.blur(); deal(ev.shiftKey); });

    /* Scripted moves: the latest place{} entry at or before this build wins. */
    function script() {
      for (const k of cards) {
        if (!k.c.place) continue;
        const keys = Object.keys(k.c.place).map(Number).filter((x) => x <= b);
        if (keys.length) setZone(k.c, k.c.place[Math.max(...keys)]);
      }
    }

    D.on('extras', () => layout());
    return {
      show(nb, how) {
        const first = !host.classList.contains('live');
        b = nb; host.classList.add('live');
        if (first) { host.classList.add('still'); layout(); void host.offsetWidth; host.classList.remove('still'); }
        if (how === 'step' && cards.some((k) => k.c.place)) requestAnimationFrame(() => { script(); layout(); });
        else { script(); layout(); }
      },
      hide() { sel = null; host.classList.remove('live'); },
      key(e) {
        if (e.key === 'Escape' && sel) { sel = null; hot(null); layout(); return true; }
        if (e.key.toLowerCase() === 'f' && sel && D.flags.answers) { D.focus(sel.c, def.labels, true); return true; }
        if (e.key.toLowerCase() === 'd' && def.pile) { deal(e.shiftKey); return true; }
        return false;
      },
      reset() { sel = null; drag = null; layout(); }
    };
  };
})();
