/* Tanis: a balance for the fact cards.
 *
 * Type a hypothesis over each pan. Pick a card number from the dropdown and
 * the card is dealt onto the table and opened big for the room to read. Then
 * the room decides where it goes:
 *   a pan      it favours that hypothesis (or counts against the other one)
 *   the label  it rules that hypothesis out: the label is struck through, the
 *              pan lifts, and the beam goes all the way over to the other side
 *   the pivot  both hypotheses expect it, so it tips nothing
 *   the floor  it says little either way
 * Every card on a pan weighs the same: 4° per card of difference, never more
 * than 20°. Drag a card, or click it and then click where it goes.
 *
 * What's on the board survives a reload but not a new tab. Only the
 * whiteboard/chalkboard choice is remembered between visits. */
(function () {
  'use strict';
  const T = window.TANIS, FACTS = T.facts, BY = T.byN;
  const W = 1600, H = 900;
  const DEG = 4, MAX = 20;
  const G = {
    cx: W / 2, pivotY: 330, half: 360, chain: 70, panW: 560, pivotZone: 110,
    ground: 640, trayY: 700, cw: 220, ch: 112, onPan: 0.8, onFloor: 0.8, fresh: 1.2,
    hypTop: 34, hypH: 100, hypW: 560, chipY: 168, chipW: 84, chipH: 52
  };
  const STORE = 'tanis-board', THEME = 'tanis-theme';
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ---------- state ---------- */
  const blank = () => ({ labels: ['', ''], zone: {}, order: {}, seq: 0, last: null });
  let S = blank();
  try {
    const raw = sessionStorage.getItem(STORE);
    if (raw) {
      const j = JSON.parse(raw);
      if (j && j.zone && j.labels) { S = Object.assign(blank(), j); }
      for (const n in S.zone) if (!BY[n]) { delete S.zone[n]; delete S.order[n]; }
    }
  } catch (e) { /* storage blocked: the board just starts clean each load */ }
  const save = () => { try { sessionStorage.setItem(STORE, JSON.stringify(S)); } catch (e) { /* ignore */ } };

  /* ---------- helpers ---------- */
  const NS = 'http://www.w3.org/2000/svg';
  function el(tag, cls, parent, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    if (parent) parent.appendChild(e);
    return e;
  }
  function svg(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const stage = document.getElementById('stage');
  let scale = 1;
  function fit() {
    scale = Math.min(innerWidth / W, innerHeight / H);
    stage.style.transform = `scale(${scale})`;
    stage.style.left = (innerWidth - W * scale) / 2 + 'px';
    stage.style.top = (innerHeight - H * scale) / 2 + 'px';
  }
  addEventListener('resize', fit); fit();
  const local = (ev) => {
    const r = stage.getBoundingClientRect();
    return { x: (ev.clientX - r.left) / scale, y: (ev.clientY - r.top) / scale };
  };

  /* ---------- drawing the balance ---------- */
  const cx = G.cx;
  const sv = svg('svg', { class: 'bal', viewBox: `0 0 ${W} ${H}`, width: W, height: H }, stage);
  const ground = svg('line', { class: 'bal-ground', x1: 0, x2: W, y1: G.ground, y2: G.ground }, sv);
  svg('path', { class: 'bal-post', d: `M${cx} ${G.pivotY}V${G.ground - 24}M${cx - 70} ${G.ground}L${cx} ${G.ground - 30}L${cx + 70} ${G.ground}Z` }, sv);
  const beam = svg('g', { class: 'bal-beamg' }, sv);
  svg('rect', { class: 'bal-beam', x: cx - G.half - 10, y: G.pivotY - 7, width: 2 * G.half + 20, height: 14, rx: 7 }, beam);
  const shelf = svg('path', { class: 'bal-shelf', d: `M${cx - 60} ${G.pivotY - 16}H${cx + 60}` }, sv);
  svg('circle', { class: 'bal-cap', cx, cy: G.pivotY, r: 13 }, sv);
  const pans = [0, 1].map((i) => {
    const g = svg('g', { class: 'bal-pan' }, sv);
    svg('path', { class: 'bal-chain', d: `M${-G.panW / 2 + 20} 0L0 ${-G.chain}L${G.panW / 2 - 20} 0` }, g);
    svg('path', { class: 'bal-dish', d: `M${-G.panW / 2} 0Q0 34 ${G.panW / 2} 0Z` }, g);
    return g;
  });

  /* the two labels. Typing here is the only text the page asks for. */
  const hyps = [0, 1].map((i) => {
    const box = el('div', 'hyp', stage,
      `<input type="text" maxlength="60" spellcheck="false" autocomplete="off" placeholder="${i ? 'Hypothesis B' : 'Hypothesis A'}" aria-label="Hypothesis ${i ? 'B' : 'A'}">` +
      '<svg class="hyp-x" viewBox="0 0 44 44" aria-hidden="true"><path d="M10 10L34 34M34 10L10 34"/></svg>');
    box.style.left = (cx + (i ? 1 : -1) * G.half - G.hypW / 2) + 'px';
    box.style.top = G.hypTop + 'px';
    const input = box.querySelector('input');
    input.value = S.labels[i] || '';
    input.addEventListener('input', () => { S.labels[i] = input.value; save(); });
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === 'Escape') input.blur(); });
    return { box, input };
  });

  /* ---------- cards ---------- */
  const READ = '<svg viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-7 7M10 20H4v-6M4 20l7-7"/></svg>';
  const cards = {};                                   // n -> element
  let sel = null, drag = null;

  function makeCard(n) {
    const f = BY[n];
    const e = el('div', 'card', stage,
      `<span class="card-no">${n}</span>` +
      `<button type="button" class="card-read" title="Read it" aria-label="Read fact ${n}">${READ}</button>`);
    e.dataset.n = n;
    e.querySelector('.card-read').addEventListener('click', (ev) => { ev.stopPropagation(); openReader(n); });
    e.addEventListener('dblclick', () => openReader(n));
    e.addEventListener('pointerdown', (ev) => grab(ev, n, e));
    e.style.transform = `translate(${cx - G.cw / 2}px, ${H}px) scale(0.6)`;   // deal in from below
    void e.offsetWidth;
    cards[n] = e;
    return e;
  }

  const zoneOf = (n) => S.zone[n] || 'tray';
  function setZone(n, z) {
    if (S.zone[n] === z) return;
    S.zone[n] = z; S.order[n] = ++S.seq;
    save();
  }
  const tilt = (L, R, out) => {
    if (out[0] && out[1]) return 0;
    if (out[0]) return MAX;
    if (out[1]) return -MAX;
    return clamp(DEG * (R - L), -MAX, MAX);
  };

  function layout() {
    const by = { tray: [], left: [], right: [], pivot: [], floor: [], killL: [], killR: [] };
    Object.keys(S.zone).map(Number).forEach((n) => by[zoneOf(n)].push(n));
    for (const z in by) by[z].sort((a, b) => (S.order[a] || 0) - (S.order[b] || 0));
    const out = [by.killL.length > 0, by.killR.length > 0];
    const a = tilt(by.left.length, by.right.length, out), r = a * Math.PI / 180;
    beam.style.transform = `rotate(${a}deg)`;
    beam.style.transformOrigin = `${cx}px ${G.pivotY}px`;
    const ends = [-1, 1].map((sg) => ({ x: cx + sg * G.half * Math.cos(r), y: G.pivotY + sg * G.half * Math.sin(r) }));
    pans.forEach((p, i) => {
      p.style.transform = `translate(${ends[i].x}px, ${ends[i].y + G.chain}px)`;
      p.classList.toggle('out', out[i]);
      hyps[i].box.classList.toggle('out', out[i]);
    });

    const put = (n, x, y, sc, rot, cls) => {
      const e = cards[n];
      e.classList.toggle('fresh', sc === G.fresh);
      e.classList.toggle('chip', cls === 'chip');
      if (n === drag) return;
      const w = cls === 'chip' ? G.chipW : G.cw, h = cls === 'chip' ? G.chipH : G.ch;
      e.style.transform = `translate(${x - w / 2}px, ${y - h / 2}px) rotate(${rot || 0}deg) scale(${sc})`;
    };
    ['left', 'right'].forEach((z, i) => {
      const e = ends[i], py = e.y + G.chain, cw = G.cw * G.onPan + 6, chh = G.ch * G.onPan + 6;
      by[z].forEach((n, j) => {
        const row = Math.floor(j / 3), inRow = Math.min(3, by[z].length - row * 3), col = j % 3;
        put(n, e.x + (col - (inRow - 1) / 2) * cw, py - 6 - chh / 2 - row * chh, G.onPan);
      });
    });
    by.pivot.forEach((n, j) => put(n, cx + (j % 2 ? 7 : -7), G.pivotY - 18 - G.ch * G.onPan / 2 - j * 40, G.onPan, j % 2 ? 2 : -2));
    const fstep = by.floor.length > 1 ? Math.min(150, (W - 260) / (by.floor.length - 1)) : 0;
    by.floor.forEach((n, j) => put(n, 130 + j * fstep, G.ground + G.ch * G.onFloor / 2 + 12, G.onFloor, j % 2 ? 2.5 : -2.5));
    ['killL', 'killR'].forEach((z, i) => {
      by[z].forEach((n, j) => put(n, cx + (i ? 1 : -1) * G.half + (j - (by[z].length - 1) / 2) * (G.chipW + 8), G.chipY, 1, 0, 'chip'));
    });
    const m = by.tray.length, step = m > 1 ? Math.min(G.cw * G.fresh + 16, (W - 300 - G.cw) / (m - 1)) : 0, x0 = (W - (m - 1) * step) / 2;
    by.tray.forEach((n, j) => {
      const fresh = n === S.last;
      put(n, x0 + j * step, G.trayY + G.ch / 2 + 6 - (fresh ? 14 : 0), fresh ? G.fresh : 1);
    });
    for (const n in cards) {
      cards[n].classList.toggle('sel', sel === +n);
      cards[n].style.zIndex = n == sel ? 8 : '';
    }
    fillMenu();
  }

  /* Which zone a point (stage pixels) falls in. */
  function hypAt(x, y) {
    if (y < G.hypTop + G.hypH + 8 && y > 0) {
      for (let i = 0; i < 2; i++) {
        if (Math.abs(x - (cx + (i ? 1 : -1) * G.half)) <= G.hypW / 2) return i;
      }
    }
    return -1;
  }
  function zoneAt(x, y) {
    const h = hypAt(x, y);
    if (h >= 0) return h ? 'killR' : 'killL';
    if (y >= G.trayY - 6) return 'tray';
    if (y >= G.ground) return 'floor';
    if (Math.abs(x - cx) <= G.pivotZone) return 'pivot';
    return x < cx ? 'left' : 'right';
  }
  function hot(z) {
    pans[0].classList.toggle('hot', z === 'left');
    pans[1].classList.toggle('hot', z === 'right');
    shelf.classList.toggle('hot', z === 'pivot');
    ground.classList.toggle('hot', z === 'floor');
    hyps[0].box.classList.toggle('hot', z === 'killL');
    hyps[1].box.classList.toggle('hot', z === 'killR');
  }

  /* ---------- dragging and clicking ---------- */
  function grab(ev, n, e) {
    if (ev.button > 0 || ev.target.closest('.card-read')) return;
    ev.preventDefault();
    e.setPointerCapture(ev.pointerId);
    const p0 = local(ev), m = (e.style.transform || '').match(/translate\(([-\d.]+)px, ([-\d.]+)px\)/);
    const o = m ? { x: +m[1], y: +m[2] } : { x: 0, y: 0 };
    let moved = false;
    const move = (mv) => {
      const p = local(mv);
      if (!moved && Math.hypot(p.x - p0.x, p.y - p0.y) < 6) return;
      if (!moved) { moved = true; drag = n; e.classList.add('dragging'); e.classList.remove('chip'); sel = null; layout(); }
      e.style.transform = `translate(${o.x + p.x - p0.x}px, ${o.y + p.y - p0.y}px) scale(1.04)`;
      hot(zoneAt(p.x, p.y));
    };
    const up = (u) => {
      e.removeEventListener('pointermove', move); e.removeEventListener('pointerup', up); e.removeEventListener('pointercancel', up);
      hot(null);
      if (moved) {
        const p = local(u);
        drag = null; e.classList.remove('dragging');
        setZone(n, zoneAt(p.x, p.y));
        if (S.last === n) { S.last = null; save(); }
      } else sel = sel === n ? null : n;
      layout();
    };
    e.addEventListener('pointermove', move); e.addEventListener('pointerup', up); e.addEventListener('pointercancel', up);
  }
  /* With a card chosen, a click anywhere else puts it there. */
  stage.addEventListener('pointerdown', (ev) => {
    if (sel == null || ev.target.closest('.card')) return;
    ev.preventDefault();
    const p = local(ev);
    setZone(sel, zoneAt(p.x, p.y));
    if (S.last === sel) { S.last = null; save(); }
    sel = null; hot(null); layout();
  });
  stage.addEventListener('pointermove', (ev) => {
    if (sel == null || drag != null) return;
    const p = local(ev);
    hot(zoneAt(p.x, p.y));
  });

  /* ---------- adding a card by its number ---------- */
  const menu = document.getElementById('add');
  function fillMenu() {
    const free = FACTS.map((f) => f.n).filter((n) => !(n in S.zone)).sort((a, b) => a - b);
    menu.innerHTML = '<option value="">＋</option>' + free.map((n) => `<option value="${n}">${n}</option>`).join('');
    menu.value = '';
    menu.disabled = !free.length;
  }
  menu.addEventListener('change', () => {
    const n = +menu.value;
    menu.blur();
    if (!BY[n] || n in S.zone) { fillMenu(); return; }
    setZone(n, 'tray'); S.last = n; save();
    makeCard(n);
    sel = null;
    layout();
    openReader(n);
  });

  function remove(n) {
    if (!cards[n]) return;
    cards[n].remove(); delete cards[n];
    delete S.zone[n]; delete S.order[n];
    if (S.last === n) S.last = null;
    if (sel === n) sel = null;
    save(); layout();
  }

  /* ---------- reading a card ---------- */
  let reader = null;
  function closeReader() {
    if (!reader) return;
    const r = reader; reader = null;
    r.classList.remove('in');
    setTimeout(() => r.remove(), 250);
  }
  function openReader(n) {
    closeReader();
    const f = BY[n];
    reader = el('div', 'reader', stage,
      `<div class="reader-card"><div class="reader-no">${n}</div><p class="reader-tx">${esc(f.text)}</p></div>`);
    reader.addEventListener('click', closeReader);
    const r = reader;
    requestAnimationFrame(() => r.classList.add('in'));
  }

  /* ---------- keys, theme, start over ---------- */
  addEventListener('keydown', (e) => {
    if (e.target.closest && e.target.closest('input, select')) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (reader) { closeReader(); e.preventDefault(); return; }
    const k = e.key.toLowerCase();
    if (k === 'escape' && sel != null) { sel = null; hot(null); layout(); }
    else if ((k === 'delete' || k === 'backspace') && sel != null) { e.preventDefault(); remove(sel); }
    else if (k === 't') toggleTheme();
  });

  const root = document.documentElement;
  function toggleTheme() {
    const dark = getComputedStyle(root).colorScheme === 'dark';
    const next = dark ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem(THEME, next); } catch (e) { /* ignore */ }
  }
  try { const t = localStorage.getItem(THEME); if (t) root.dataset.theme = t; } catch (e) { /* ignore */ }
  document.getElementById('theme').addEventListener('click', toggleTheme);

  const resetBtn = document.getElementById('reset');
  let armed = 0;
  resetBtn.addEventListener('click', () => {
    if (!armed) {
      resetBtn.classList.add('armed');
      armed = setTimeout(() => { armed = 0; resetBtn.classList.remove('armed'); }, 2500);
      return;
    }
    clearTimeout(armed); armed = 0; resetBtn.classList.remove('armed');
    for (const n in cards) cards[n].remove();
    for (const n in cards) delete cards[n];
    S = blank(); sel = null; save();
    hyps.forEach((h) => { h.input.value = ''; });
    closeReader(); layout();
  });

  /* the control bar fades when the mouse is still */
  const ctl = document.querySelector('.ctl');
  let idle = 0;
  const wake = () => { ctl.classList.remove('idle'); clearTimeout(idle); idle = setTimeout(() => ctl.classList.add('idle'), 3000); };
  addEventListener('pointermove', wake); wake();

  /* ---------- go ---------- */
  Object.keys(S.zone).map(Number).sort((a, b) => (S.order[a] || 0) - (S.order[b] || 0)).forEach(makeCard);
  stage.classList.add('still'); layout(); void stage.offsetWidth; stage.classList.remove('still');

  window.TanisBoard = { state: () => S, zoneAt, zoneOf, remove };   // for the smoke test
})();
