/* Tanis: balances for the fact cards.
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
 * Up to three balances sit side by side, each with its own pair of labels, for
 * questions that come in more than two parts. A card can be copied (the copy
 * button, or D) so the same fact can be weighed on more than one balance; a
 * balance holds at most one copy of any card.
 *
 * What's on the board survives a reload but not a new tab. Only the
 * whiteboard/chalkboard choice is remembered between visits. */
(function () {
  'use strict';
  const T = window.TANIS, FACTS = T.facts, BY = T.byN;
  const W = 1600, H = 900;
  const DEG = 4, MAX = 20, MAXN = 3;
  const G = {
    pivotY: 350, chain: 70, ground: 660, trayY: 716, onPan: 0.8, onFloor: 0.8, fresh: 1.2,
    hypTop: 62, hypH: 96, chipY: 186
  };
  /* Sizes by how many balances share the stage (stage pixels). Vertical
   * positions are the same for all; only the widths change. */
  const MODE = {
    1: { half: 360, panW: 560, pivotZone: 110, cw: 220, ch: 112, row: 3, hypW: 560, hypFont: 44, hypPad: 56, xs: 44, no: 64, btn: 38, chipW: 84, chipH: 52, chipNo: 32, floorPad: 130, floorStep: 150, ph: ['Hypothesis A', 'Hypothesis B'] },
    2: { half: 190, panW: 330, pivotZone: 60, cw: 150, ch: 76, row: 2, hypW: 340, hypFont: 34, hypPad: 40, xs: 32, no: 44, btn: 28, chipW: 66, chipH: 44, chipNo: 28, floorPad: 90, floorStep: 110, ph: ['A', 'B'] },
    3: { half: 140, panW: 190, pivotZone: 44, cw: 104, ch: 54, row: 2, hypW: 236, hypFont: 26, hypPad: 28, xs: 24, no: 32, btn: 20, chipW: 52, chipH: 36, chipNo: 24, floorPad: 60, floorStep: 72, ph: ['A', 'B'] }
  };
  const STORE = 'tanis-board-2', THEME = 'tanis-theme';
  const ZONES = ['tray', 'left', 'right', 'pivot', 'floor', 'killL', 'killR'];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ---------- state ----------
   * cards: id -> { n: card number, s: balance index (null in the tray), z: zone, o: order placed }
   * A card number can appear under several ids (copies). */
  const blank = () => ({ N: 1, labels: [['', ''], ['', ''], ['', '']], cards: {}, seq: 0, nid: 0, last: null });
  let S = blank();
  try {
    const raw = sessionStorage.getItem(STORE);
    if (raw) {
      const j = JSON.parse(raw);
      if (j && j.cards && j.labels && MODE[j.N]) {
        S = Object.assign(blank(), j);
        for (const id in S.cards) {
          const c = S.cards[id];
          const ok = BY[c.n] && ZONES.includes(c.z) && (c.z === 'tray' ? c.s == null : c.s >= 0 && c.s < S.N);
          if (!ok) delete S.cards[id];
        }
        if (!S.cards[S.last]) S.last = null;
      }
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
  const pics = document.querySelector('.pics');
  let scale = 1;
  function fit() {
    scale = Math.min(innerWidth / W, innerHeight / H);
    const top = (innerHeight - H * scale) / 2;
    stage.style.transform = `scale(${scale})`;
    stage.style.left = (innerWidth - W * scale) / 2 + 'px';
    stage.style.top = top + 'px';
    pics.style.top = top + 6 + 'px';
  }
  addEventListener('resize', fit); fit();
  const local = (ev) => {
    const r = stage.getBoundingClientRect();
    return { x: (ev.clientX - r.left) / scale, y: (ev.clientY - r.top) / scale };
  };

  /* ---------- drawing the balances ---------- */
  const sv = svg('svg', { class: 'bal', viewBox: `0 0 ${W} ${H}`, width: W, height: H }, stage);
  let mods = [];          // per balance: { cx, beam, shelf, ground, pans, hyps }
  const colX = (i) => (i + 0.5) * W / S.N;

  function build() {
    const N = S.N, M = MODE[N], colW = W / N;
    sv.replaceChildren();
    stage.querySelectorAll('.hyp').forEach((h) => h.remove());
    const v = { cw: M.cw, ch: M.ch, no: M.no, btn: M.btn, chipw: M.chipW, chiph: M.chipH, chipno: M.chipNo, hypfont: M.hypFont, hyppad: M.hypPad, xs: M.xs };
    for (const k in v) stage.style.setProperty('--' + k, v[k] + 'px');
    stage.dataset.n = N;

    for (let i = 1; i < N; i++) svg('line', { class: 'bal-sep', x1: i * colW, x2: i * colW, y1: G.hypTop, y2: G.trayY - 6 }, sv);
    mods = [];
    for (let i = 0; i < N; i++) {
      const cx = colX(i), m = { cx };
      m.ground = svg('line', { class: 'bal-ground', x1: i * colW + 12, x2: (i + 1) * colW - 12, y1: G.ground, y2: G.ground }, sv);
      svg('path', { class: 'bal-post', d: `M${cx} ${G.pivotY}V${G.ground - 24}M${cx - 70 * M.cw / 220 - 20} ${G.ground}L${cx} ${G.ground - 30}L${cx + 70 * M.cw / 220 + 20} ${G.ground}Z` }, sv);
      m.beam = svg('g', { class: 'bal-beamg' }, sv);
      svg('rect', { class: 'bal-beam', x: cx - M.half - 10, y: G.pivotY - 7, width: 2 * M.half + 20, height: 14, rx: 7 }, m.beam);
      m.shelf = svg('path', { class: 'bal-shelf', d: `M${cx - M.pivotZone * 0.55} ${G.pivotY - 16}H${cx + M.pivotZone * 0.55}` }, sv);
      svg('circle', { class: 'bal-cap', cx, cy: G.pivotY, r: 13 }, sv);
      m.pans = [0, 1].map(() => {
        const g = svg('g', { class: 'bal-pan' }, sv);
        svg('path', { class: 'bal-chain', d: `M${-M.panW / 2 + 20} 0L0 ${-G.chain}L${M.panW / 2 - 20} 0` }, g);
        svg('path', { class: 'bal-dish', d: `M${-M.panW / 2} 0Q0 34 ${M.panW / 2} 0Z` }, g);
        return g;
      });
      /* the two labels. Typing here is the only text the page asks for. */
      m.hyps = [0, 1].map((side) => {
        const box = el('div', 'hyp', stage,
          '<div class="hyp-grow"><div class="hyp-mirror"></div>' +
          `<textarea rows="1" maxlength="60" spellcheck="false" autocomplete="off" placeholder="${M.ph[side]}" aria-label="Hypothesis ${side ? 'B' : 'A'}${N > 1 ? ', balance ' + (i + 1) : ''}"></textarea></div>` +
          '<svg class="hyp-x" viewBox="0 0 44 44" aria-hidden="true"><path d="M10 10L34 34M34 10L10 34"/></svg>');
        box.style.left = (cx + (side ? 1 : -1) * M.half - M.hypW / 2) + 'px';
        box.style.top = G.hypTop + 'px';
        box.style.width = M.hypW + 'px';
        box.style.height = G.hypH + 'px';
        const ta = box.querySelector('textarea'), mir = box.querySelector('.hyp-mirror');
        const grow = () => { mir.textContent = (ta.value || ta.placeholder) + ' '; };
        ta.value = S.labels[i][side] || '';
        grow();
        ta.addEventListener('input', () => { S.labels[i][side] = ta.value.replace(/\n/g, ' '); grow(); save(); });
        ta.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === 'Escape') { e.preventDefault(); ta.blur(); } });
        return { box, ta };
      });
      mods.push(m);
    }
    document.getElementById('more').disabled = N >= MAXN;
    document.getElementById('fewer').disabled = N <= 1;
  }

  /* ---------- cards ---------- */
  const READ = '<svg viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-7 7M10 20H4v-6M4 20l7-7"/></svg>';
  const COPY = '<svg viewBox="0 0 24 24"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M15 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h3"/></svg>';
  const cards = {};                                   // id -> element
  let sel = null, drag = null;

  function makeCard(id) {
    const n = S.cards[id].n;
    const e = el('div', 'card', stage,
      `<span class="card-no">${n}</span>` +
      `<button type="button" class="card-read" title="Read it" aria-label="Read fact ${n}">${READ}</button>` +
      `<button type="button" class="card-copy" title="Copy it onto another balance (D)" aria-label="Copy fact ${n}">${COPY}</button>`);
    e.dataset.n = n;
    e.querySelector('.card-read').addEventListener('click', (ev) => { ev.stopPropagation(); openReader(n); });
    e.querySelector('.card-copy').addEventListener('click', (ev) => { ev.stopPropagation(); copyCard(id); });
    e.addEventListener('dblclick', () => openReader(n));
    e.addEventListener('pointerdown', (ev) => grab(ev, id, e));
    e.style.transform = `translate(${W / 2 - MODE[S.N].cw / 2}px, ${H}px) scale(0.6)`;   // deal in from below
    void e.offsetWidth;
    cards[id] = e;
    return e;
  }

  /* Put a card (by id) on balance s in zone z; the tray belongs to no balance.
   * A balance holds one copy of a number, so an older copy there is replaced. */
  function place(id, s, z) {
    const c = S.cards[id];
    if (z === 'tray') s = null;
    if (c.s === s && c.z === z) return;
    if (s != null) {
      for (const k in S.cards) if (k !== id && S.cards[k].n === c.n && S.cards[k].s === s) discard(k, true);
    }
    c.s = s; c.z = z; c.o = ++S.seq;
    if (S.last === id) S.last = null;
    save();
  }
  function discard(id, quiet) {
    if (cards[id]) { cards[id].remove(); delete cards[id]; }
    delete S.cards[id];
    if (S.last === id) S.last = null;
    if (sel === id) sel = null;
    if (!quiet) { save(); layout(); }
  }
  function copyCard(id) {
    const c = S.cards[id];
    if (!c) return;
    const nid = 'c' + (++S.nid);
    S.cards[nid] = { n: c.n, s: null, z: 'tray', o: ++S.seq };
    S.last = nid; sel = null;
    save(); makeCard(nid); layout();
  }

  const tilt = (L, R, out) => {
    if (out[0] && out[1]) return 0;
    if (out[0]) return MAX;
    if (out[1]) return -MAX;
    return clamp(DEG * (R - L), -MAX, MAX);
  };

  function layout() {
    const N = S.N, M = MODE[N], colW = W / N;
    const fresh0 = () => ({ left: [], right: [], pivot: [], floor: [], killL: [], killR: [] });
    const by = Array.from({ length: N }, fresh0), tray = [];
    for (const id in S.cards) { const c = S.cards[id]; (c.z === 'tray' ? tray : by[c.s][c.z]).push(id); }
    const ord = (a, b) => S.cards[a].o - S.cards[b].o;
    tray.sort(ord);
    by.forEach((b) => { for (const z in b) b[z].sort(ord); });

    const put = (id, x, y, sc, rot, chip) => {
      const e = cards[id];
      e.classList.toggle('fresh', sc === G.fresh);
      e.classList.toggle('chip', !!chip);
      if (id === drag) return;
      const w = chip ? M.chipW : M.cw, h = chip ? M.chipH : M.ch;
      e.style.transform = `translate(${x - w / 2}px, ${y - h / 2}px) rotate(${rot || 0}deg) scale(${sc})`;
    };

    mods.forEach((m, i) => {
      const b = by[i], cx = m.cx;
      const out = [b.killL.length > 0, b.killR.length > 0];
      const a = tilt(b.left.length, b.right.length, out), r = a * Math.PI / 180;
      m.beam.style.transform = `rotate(${a}deg)`;
      m.beam.style.transformOrigin = `${cx}px ${G.pivotY}px`;
      const ends = [-1, 1].map((sg) => ({ x: cx + sg * M.half * Math.cos(r), y: G.pivotY + sg * M.half * Math.sin(r) }));
      m.pans.forEach((p, k) => {
        p.style.transform = `translate(${ends[k].x}px, ${ends[k].y + G.chain}px)`;
        p.classList.toggle('out', out[k]);
        m.hyps[k].box.classList.toggle('out', out[k]);
      });
      m.shelf.classList.toggle('used', b.pivot.length > 0);

      ['left', 'right'].forEach((z, k) => {
        const e = ends[k], py = e.y + G.chain, cw = M.cw * G.onPan + 6, chh = M.ch * G.onPan + 6;
        b[z].forEach((id, j) => {
          const row = Math.floor(j / M.row), inRow = Math.min(M.row, b[z].length - row * M.row), col = j % M.row;
          put(id, e.x + (col - (inRow - 1) / 2) * cw, py - 6 - chh / 2 - row * chh, G.onPan);
        });
      });
      const pstep = Math.round(M.ch * 0.36);
      b.pivot.forEach((id, j) => put(id, cx + (j % 2 ? 7 : -7), G.pivotY - 18 - M.ch * G.onPan / 2 - j * pstep, G.onPan, j % 2 ? 2 : -2));
      const fstep = b.floor.length > 1 ? Math.min(M.floorStep, (colW - 2 * M.floorPad) / (b.floor.length - 1)) : 0;
      b.floor.forEach((id, j) => put(id, i * colW + M.floorPad + j * fstep, G.ground + M.ch * G.onFloor / 2 + 12, G.onFloor, j % 2 ? 2.5 : -2.5));
      ['killL', 'killR'].forEach((z, k) => {
        b[z].forEach((id, j) => put(id, cx + (k ? 1 : -1) * M.half + (j - (b[z].length - 1) / 2) * (M.chipW + 8), G.chipY, 1, 0, true));
      });
    });

    const m = tray.length, step = m > 1 ? Math.min(M.cw * G.fresh + 16, (W - 300 - M.cw) / (m - 1)) : 0, x0 = (W - (m - 1) * step) / 2;
    tray.forEach((id, j) => {
      const fresh = id === S.last;
      put(id, x0 + j * step, G.trayY + M.ch / 2 + 6 - (fresh ? 14 : 0), fresh ? G.fresh : 1);
    });
    for (const id in cards) {
      cards[id].classList.toggle('sel', sel === id);
      cards[id].style.zIndex = id === sel ? 8 : '';
    }
    fillMenu();
  }

  /* Which balance and zone a point (stage pixels) falls in. */
  function zoneAt(x, y) {
    const N = S.N, M = MODE[N], s = clamp(Math.floor(x / (W / N)), 0, N - 1), cx = colX(s);
    if (y > 0 && y < G.hypTop + G.hypH + 8) {
      for (let k = 0; k < 2; k++) {
        if (Math.abs(x - (cx + (k ? 1 : -1) * M.half)) <= M.hypW / 2) return { s, z: k ? 'killR' : 'killL' };
      }
    }
    if (y >= G.trayY - 6) return { s: null, z: 'tray' };
    if (y >= G.ground) return { s, z: 'floor' };
    if (Math.abs(x - cx) <= M.pivotZone) return { s, z: 'pivot' };
    return { s, z: x < cx ? 'left' : 'right' };
  }
  function hot(t) {
    mods.forEach((m, i) => {
      const on = (z) => !!t && t.s === i && t.z === z;
      m.pans[0].classList.toggle('hot', on('left'));
      m.pans[1].classList.toggle('hot', on('right'));
      m.shelf.classList.toggle('hot', on('pivot'));
      m.ground.classList.toggle('hot', on('floor'));
      m.hyps[0].box.classList.toggle('hot', on('killL'));
      m.hyps[1].box.classList.toggle('hot', on('killR'));
    });
  }

  /* ---------- dragging and clicking ---------- */
  function grab(ev, id, e) {
    if (ev.button > 0 || ev.target.closest('.card-read, .card-copy')) return;
    ev.preventDefault();
    e.setPointerCapture(ev.pointerId);
    const p0 = local(ev), m = (e.style.transform || '').match(/translate\(([-\d.]+)px, ([-\d.]+)px\)/);
    const o = m ? { x: +m[1], y: +m[2] } : { x: 0, y: 0 };
    let moved = false;
    const move = (mv) => {
      const p = local(mv);
      if (!moved && Math.hypot(p.x - p0.x, p.y - p0.y) < 6) return;
      if (!moved) { moved = true; drag = id; e.classList.add('dragging'); e.classList.remove('chip'); sel = null; layout(); }
      e.style.transform = `translate(${o.x + p.x - p0.x}px, ${o.y + p.y - p0.y}px) scale(1.04)`;
      hot(zoneAt(p.x, p.y));
    };
    const up = (u) => {
      e.removeEventListener('pointermove', move); e.removeEventListener('pointerup', up); e.removeEventListener('pointercancel', up);
      hot(null);
      if (moved) {
        const t = zoneAt(local(u).x, local(u).y);
        drag = null; e.classList.remove('dragging');
        place(id, t.s, t.z);
      } else sel = sel === id ? null : id;
      layout();
    };
    e.addEventListener('pointermove', move); e.addEventListener('pointerup', up); e.addEventListener('pointercancel', up);
  }
  /* With a card chosen, a click anywhere else puts it there. */
  stage.addEventListener('pointerdown', (ev) => {
    if (sel == null || ev.target.closest('.card')) return;
    ev.preventDefault();
    const p = local(ev), t = zoneAt(p.x, p.y);
    place(sel, t.s, t.z);
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
    const used = new Set(Object.values(S.cards).map((c) => c.n));
    const free = FACTS.map((f) => f.n).filter((n) => !used.has(n)).sort((a, b) => a - b);
    menu.innerHTML = '<option value="">＋</option>' + free.map((n) => `<option value="${n}">${n}</option>`).join('');
    menu.value = '';
    menu.disabled = !free.length;
  }
  menu.addEventListener('change', () => {
    const n = +menu.value;
    menu.blur();
    if (!BY[n] || Object.values(S.cards).some((c) => c.n === n)) { fillMenu(); return; }
    const id = 'c' + (++S.nid);
    S.cards[id] = { n, s: null, z: 'tray', o: ++S.seq };
    S.last = id; save();
    makeCard(id);
    sel = null;
    layout();
    openReader(n);
  });

  /* ---------- more or fewer balances ---------- */
  function setBalances(next) {
    next = clamp(next, 1, MAXN);
    if (next === S.N) return;
    if (next < S.N) {
      for (const id of Object.keys(S.cards)) {
        const c = S.cards[id];
        if (c.s == null || c.s < next) continue;
        const twin = Object.keys(S.cards).some((k) => k !== id && S.cards[k].n === c.n);
        if (twin) discard(id, true);
        else { c.s = null; c.z = 'tray'; c.o = ++S.seq; }
      }
      for (let i = next; i < S.N; i++) S.labels[i] = ['', ''];
    }
    S.N = next; sel = null; save();
    stage.classList.add('still'); build(); layout(); void stage.offsetWidth; stage.classList.remove('still');
  }
  const fewer = document.getElementById('fewer');
  let armedFewer = 0;
  document.getElementById('more').addEventListener('click', () => setBalances(S.N + 1));
  fewer.addEventListener('click', () => {
    const last = S.N - 1;
    const busy = Object.values(S.cards).some((c) => c.s === last) || S.labels[last].some(Boolean);
    if (busy && !armedFewer) {
      fewer.classList.add('armed');
      armedFewer = setTimeout(() => { armedFewer = 0; fewer.classList.remove('armed'); }, 2500);
      return;
    }
    clearTimeout(armedFewer); armedFewer = 0; fewer.classList.remove('armed');
    setBalances(S.N - 1);
  });

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

  /* ---------- the pictures: thumbnails along the top, one opens full screen ---------- */
  const box = document.querySelector('.lightbox'), boxImg = box.querySelector('img');
  let shown = -1;
  const thumbs = Array.from(pics.querySelectorAll('button'));
  function showPic(i) {
    if (i === shown) i = -1;
    shown = i;
    thumbs.forEach((b, k) => b.classList.toggle('on', k === i));
    if (i < 0) { box.hidden = true; return; }
    closeReader();
    boxImg.src = thumbs[i].dataset.src;
    boxImg.alt = thumbs[i].getAttribute('aria-label') || '';
    box.hidden = false;
  }
  thumbs.forEach((b, k) => b.addEventListener('click', () => showPic(k)));
  box.addEventListener('click', () => showPic(shown));

  /* ---------- keys, theme, start over ---------- */
  addEventListener('keydown', (e) => {
    if (e.target.closest && e.target.closest('input, select, textarea')) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key.toLowerCase();
    if (shown >= 0) {
      if (k === 'arrowright' || k === 'arrowleft') {
        const i = (shown + (k === 'arrowright' ? 1 : -1) + thumbs.length) % thumbs.length;
        shown = -1; showPic(i);
      } else if (['1', '2', '3'].includes(k) && thumbs[+k - 1]) { const i = +k - 1; if (i !== shown) showPic(i); }
      else showPic(shown);
      e.preventDefault(); return;
    }
    if (reader) { closeReader(); e.preventDefault(); return; }
    if (k === 'escape' && sel != null) { sel = null; hot(null); layout(); }
    else if ((k === 'delete' || k === 'backspace') && sel != null) { e.preventDefault(); discard(sel); }
    else if (k === 'd' && sel != null) copyCard(sel);
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
    for (const id in cards) { cards[id].remove(); delete cards[id]; }
    S = blank(); sel = null; save();
    closeReader(); showPic(-1);
    stage.classList.add('still'); build(); layout(); void stage.offsetWidth; stage.classList.remove('still');
  });

  /* the control bars fade when the mouse is still */
  const bars = [document.querySelector('.ctl'), pics];
  let idle = 0;
  const wake = () => { bars.forEach((b) => b.classList.remove('idle')); clearTimeout(idle); idle = setTimeout(() => bars.forEach((b) => b.classList.add('idle')), 3000); };
  addEventListener('pointermove', wake); wake();

  /* ---------- go ---------- */
  build();
  Object.keys(S.cards).sort((a, b) => S.cards[a].o - S.cards[b].o).forEach(makeCard);
  stage.classList.add('still'); layout(); void stage.offsetWidth; stage.classList.remove('still');

  window.TanisBoard = { state: () => S, zoneAt, copyCard, setBalances, place, discard };   // for the smoke test
})();
