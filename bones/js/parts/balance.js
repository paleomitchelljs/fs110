/* The balance, which every case runs on. Two hypotheses, one per pan, each
 * shown above its pan as a picture, a sketch, an icon or words. On the
 * predict build the room votes (click a hypothesis, or press 1 or 2) and the
 * votes stay up as dots. Then evidence arrives one card per build (card.at)
 * and you place it: a pan if one hypothesis expects it and the other doesn't,
 * the pivot if both expect it (it tips nothing), the floor if it says little.
 * Every card weighs the same: 4° per card of difference, never more than 20°.
 *
 * Drag a card, or click it and then click where it goes. */
(function () {
  'use strict';
  const D = window.Deck;

  const DEG = 4, MAX = 20;
  const G = {                      // geometry, in the item's own pixels (box 1520 × 690)
    pivotY: 250, half: 360, chain: 70, panW: 460, pivotZone: 120,
    ground: 500, floorY: 506, trayY: 594,
    cw: 170, ch: 96, onPan: 0.8, onFloor: 0.8, fresh: 1.3
  };
  const tilt = (L, R) => D.clamp(DEG * (R - L), -MAX, MAX);

  /* What sits above a pan: a picture, a sketch, an icon, or words. */
  function headHTML(p) {
    if (p.img) return `<img class="ink-img" src="${D.esc(p.img)}" alt="${D.esc(p.text)}" style="width:${p.w}px" draggable="false">`;
    if (p.sketch) return `<svg class="sketch" viewBox="0 0 300 200" width="150" height="100" role="img" aria-label="${D.esc(p.text)}">${D.sketches[p.sketch]()}</svg>`;
    if (p.icon) return `<svg class="hyp-icon" viewBox="0 0 24 24" width="84" height="84" role="img" aria-label="${D.esc(p.text)}">${D.hypIcons[p.icon]}</svg>`;
    return `<b>${D.md(p.text)}</b>`;
  }

  D.parts.balance = function (def, host) {
    const w = def.box[2], cx = w / 2, labels = def.pans.map((p) => p.text);
    const st = () => D.get('bal-' + def.id, () => ({ zone: {}, order: {}, n: 0, votes: [0, 0] }));
    let b = 0, sel = null, drag = null;

    /* ---------- drawing ---------- */
    const svg = D.svg('svg', { class: 'bal', viewBox: `0 0 ${w} ${def.box[3]}`, width: w, height: def.box[3] }, host);
    const ground = D.svg('line', { class: 'bal-ground', x1: 0, x2: w, y1: G.ground, y2: G.ground }, svg);
    D.svg('path', { class: 'bal-post', d: `M${cx} ${G.pivotY}V${G.ground - 24}M${cx - 70} ${G.ground}L${cx} ${G.ground - 30}L${cx + 70} ${G.ground}Z` }, svg);
    const beam = D.svg('g', { class: 'bal-beamg' }, svg);
    D.svg('rect', { class: 'bal-beam', x: cx - G.half - 10, y: G.pivotY - 7, width: 2 * G.half + 20, height: 14, rx: 7 }, beam);
    const shelf = D.svg('path', { class: 'bal-shelf', d: `M${cx - 60} ${G.pivotY - 16}H${cx + 60}` }, svg);
    D.svg('circle', { class: 'bal-cap', cx, cy: G.pivotY, r: 13 }, svg);
    const pans = [0, 1].map((i) => {
      const g = D.svg('g', { class: 'bal-pan pan-' + i }, svg);
      D.svg('path', { class: 'bal-chain', d: `M${-G.panW / 2 + 20} 0L0 ${-G.chain}L${G.panW / 2 - 20} 0` }, g);
      D.svg('path', { class: 'bal-dish', d: `M${-G.panW / 2} 0Q0 34 ${G.panW / 2} 0Z` }, g);
      const head = D.el('button', 'hyp hyp-' + i, host, `<span class="hyp-what">${headHTML(def.pans[i])}</span><span class="hyp-votes"></span>`);
      head.type = 'button';
      head.style.left = (cx + (i ? 1 : -1) * G.half - 280) + 'px';
      head.addEventListener('click', (e) => { head.blur(); vote(i, e.shiftKey ? -1 : 1); });
      head.addEventListener('contextmenu', (e) => { e.preventDefault(); vote(i, -1); });
      return { g, head };
    });

    /* ---------- cards ---------- */
    const cards = def.cards.map((c) => {
      const e = D.card(c, labels, host);
      e.addEventListener('pointerdown', (ev) => grab(ev, c, e));
      return { c, e };
    });
    const zoneOf = (c) => st().zone[c.id];
    const inPlay = (c) => !(c.extra && !D.flags.extras) && (c.at == null || b >= c.at);
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
      pans.forEach((p, i) => { p.g.style.transform = `translate(${ends[i].x}px, ${ends[i].y + G.chain}px)`; });
      const put = (k, x, y, sc, rot) => {
        k.e.style.opacity = 1; k.e.style.pointerEvents = '';
        k.e.classList.toggle('fresh', sc === G.fresh);
        if (k === drag) return;
        k.e.style.transform = `translate(${x - G.cw / 2}px, ${y - G.ch / 2}px) rotate(${rot || 0}deg) scale(${sc})`;
      };
      /* pans: rows of three, stacking upward from the dish */
      ['left', 'right'].forEach((z, i) => {
        const e = ends[i], py = e.y + G.chain, cw = G.cw * G.onPan + 6, chh = G.ch * G.onPan + 6;
        by[z].forEach((k, j) => {
          const row = Math.floor(j / 3), inRow = Math.min(3, by[z].length - row * 3), col = j % 3;
          put(k, e.x + (col - (inRow - 1) / 2) * cw, py - 6 - chh / 2 - row * chh, G.onPan);
        });
      });
      by.pivot.forEach((k, j) => put(k, cx + (j % 2 ? 7 : -7), G.pivotY - 18 - G.ch * G.onPan / 2 - j * 40, G.onPan, j % 2 ? 2 : -2));
      const fstep = by.floor.length > 1 ? Math.min(150, (w - 220) / (by.floor.length - 1)) : 0;
      by.floor.forEach((k, j) => put(k, 110 + j * fstep, G.floorY + G.ch * G.onFloor / 2, G.onFloor, j % 2 ? 2.5 : -2.5));
      /* tray: the card dealt on this build sits bigger, so everyone can read it */
      const n = by.tray.length, step = n > 1 ? Math.min(G.cw * G.fresh + 16, (w - G.cw) / (n - 1)) : 0, x0 = (w - (n - 1) * step) / 2;
      by.tray.forEach((k, j) => {
        const fresh = k.c.at === b;
        put(k, x0 + j * step, G.trayY + G.ch / 2 - (fresh ? 22 : 0), fresh ? G.fresh : 1);
      });
      cards.filter((k) => !inPlay(k.c)).forEach((k) => {
        k.e.style.opacity = 0; k.e.style.pointerEvents = 'none'; k.e.classList.remove('fresh');
        k.e.style.transform = `translate(${cx - G.cw / 2}px, ${G.trayY + 40}px) scale(0.5)`;
      });
      shelf.classList.toggle('used', by.pivot.length > 0);
      cards.forEach((k) => k.e.classList.toggle('sel', k === sel));
      host.classList.toggle('choosing', !!sel);
      drawVotes();
    }

    /* ---------- the room's prediction ---------- */
    const voting = () => def.vote != null && b === def.vote;
    function vote(i, d) {
      if (!voting()) return;
      const v = st().votes;
      v[i] = Math.max(0, v[i] + d);
      D.save(); drawVotes();
    }
    function drawVotes() {
      const v = st().votes, shown = def.vote != null && b >= def.vote;
      host.classList.toggle('voting', voting());
      pans.forEach((p, i) => {
        p.head.querySelector('.hyp-votes').innerHTML = shown && v[i] ? '<i></i>'.repeat(Math.min(v[i], 30)) + `<b>${v[i]}</b>` : '';
      });
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
      ground.classList.toggle('hot', z === 'floor');
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
      if (!sel || ev.target.closest('.card, .hyp')) return;
      const p = D.local(host, ev);
      setZone(sel.c, zoneAt(p.x, p.y));
      sel = null; layout();
    });
    host.addEventListener('pointermove', (ev) => {
      if (!sel || drag) return;
      const p = D.local(host, ev);
      hot(zoneAt(p.x, p.y));
    });

    D.on('extras', () => layout());
    return {
      show(nb) {
        const first = !host.classList.contains('live');
        b = nb; host.classList.add('live');
        if (first) { host.classList.add('still'); layout(); void host.offsetWidth; host.classList.remove('still'); }
        layout();
      },
      hide() { sel = null; host.classList.remove('live'); },
      key(e) {
        if (e.key === 'Escape' && sel) { sel = null; hot(null); layout(); return true; }
        if (e.key.toLowerCase() === 'f' && sel && D.flags.answers) { D.focus(sel.c, labels, true); return true; }
        return false;
      },
      digit(n, shift) { if (n === 1 || n === 2) vote(n - 1, shift ? -1 : 1); },
      reset() { sel = null; drag = null; layout(); }
    };
  };
})();
