/* The deck: a fixed 1600 × 900 stage scaled to the window, pages made of builds (one press each).
 * Same stage, keys and control bar as infernogallus/, without the claim rail, votes or answers.
 * A page is { id, title, prompts: [one short line per build], make(host) -> { show(b, how), hide(), key(e), reset() } }.
 * Saved state (position, cards, model) lives in sessionStorage: a reload mid-class keeps it, a new tab starts clean.
 * Only the theme survives across visits. The deck works the same with no storage at all.
 */
(function (root) {
  'use strict';
  const W = 1600, H = 900, STORE = 'exam-v1', THEME = 'exam-theme';
  const $ = (s) => document.querySelector(s);
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const motion = matchMedia('(prefers-reduced-motion: reduce)');

  const Deck = root.Deck = { W, H, clamp, scale: 1 };
  Object.defineProperty(Deck, 'reduced', { get: () => motion.matches });

  Deck.el = function (tag, cls, parent, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    if (parent) parent.appendChild(e);
    return e;
  };
  Deck.svg = function (tag, attrs, parent) {
    const e = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const k in attrs || {}) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  };
  Deck.esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  Deck.replay = function (e, cls) { e.classList.remove(cls); void e.offsetWidth; e.classList.add(cls); };
  /* Pointer position in stage pixels, relative to element e. */
  Deck.local = function (e, ev) {
    const r = e.getBoundingClientRect();
    return { x: (ev.clientX - r.left) / Deck.scale, y: (ev.clientY - r.top) / Deck.scale };
  };
  /* Drag on an element: move(x, y) gets stage pixels relative to host. */
  Deck.drag = function (el, host, move, end) {
    el.classList.add('grab');
    el.addEventListener('pointerdown', (ev) => {
      if (ev.button) return;
      ev.preventDefault(); ev.stopPropagation();
      el.setPointerCapture(ev.pointerId);
      el.classList.add('dragging');
      const m = (e) => { const p = Deck.local(host, e); move(p.x, p.y); };
      const up = () => {
        el.removeEventListener('pointermove', m); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up);
        el.classList.remove('dragging');
        if (end) end();
      };
      el.addEventListener('pointermove', m); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
      m(ev);
    });
  };
  Deck.icon = (name) => Deck.icons[name] || '';

  /* ---------- saved state ---------- */
  const fresh = () => ({ pos: { s: 0, b: 0 }, theme: null, clock: false, started: null, parts: {} });
  let S = fresh();
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORE) || 'null');
    if (saved && saved.pos) S = Object.assign(fresh(), saved);
    S.theme = localStorage.getItem(THEME) || null;
  } catch (e) { /* no storage: start fresh */ }
  let saveTimer = 0;
  Deck.save = () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try {
        sessionStorage.setItem(STORE, JSON.stringify(S));
        if (S.theme) localStorage.setItem(THEME, S.theme); else localStorage.removeItem(THEME);
      } catch (e) { /* ignore */ }
    }, 150);
  };
  /* A part's saved state, made on first use. Fetch it fresh each time: reset replaces it. */
  Deck.get = (id, make) => S.parts[id] || (S.parts[id] = make());

  /* ---------- pages ---------- */
  let pages, stage, promptEl;
  const built = [];

  function build(i) {
    const pg = pages[i], el = Deck.el('div', 'seg off', stage);
    el.dataset.seg = pg.id;
    stage.insertBefore(el, promptEl);
    built[i] = { el, part: pg.make(el) || {} };
  }
  function go(s, b, how) {
    const old = S.pos.s;
    if (old !== s && built[old] && built[old].part.hide) built[old].part.hide();
    if (!built[s]) build(s);
    built.forEach((g, i) => { if (g) g.el.classList.toggle('off', i !== s); });
    if (s >= 1 && !S.started) S.started = Date.now();
    S.pos = { s, b };
    const pg = pages[s], text = pg.prompts[b] || '';
    if (built[s].part.show) built[s].part.show(b, how);
    promptEl.querySelector('.prompt-text').innerHTML = text;
    if (how === 'step' && text) Deck.replay(promptEl, 'play'); else promptEl.classList.remove('play');
    $('#dots').querySelectorAll('button').forEach((d, i) => { d.classList.toggle('here', i === s); d.classList.toggle('done', i < s); });
    tick();
    try { history.replaceState(null, '', '#' + s + (b ? '.' + b : '')); } catch (e) { /* file:// in some browsers */ }
    Deck.save();
  }
  function next() {
    const { s, b } = S.pos;
    if (b + 1 < pages[s].prompts.length) return go(s, b + 1, 'step');
    if (s + 1 < pages.length) go(s + 1, 0, 'step');
  }
  function prev() {
    const { s, b } = S.pos;
    if (b > 0) return go(s, b - 1, 'back');
    if (s > 0) go(s - 1, pages[s - 1].prompts.length - 1, 'back');
  }
  const jump = (t) => { if (t >= 0 && t < pages.length) go(t, 0, 'jump'); };
  Deck.next = next; Deck.prev = prev;
  Deck.where = () => ({ s: S.pos.s, b: S.pos.b });
  Deck.goto = go;
  Deck.isDark = () => S.theme ? S.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  const themeListeners = [];
  Deck.onTheme = (fn) => themeListeners.push(fn);

  function syncBar() {
    $('#theme').setAttribute('aria-pressed', String(Deck.isDark()));
    $('#clockbtn').setAttribute('aria-pressed', String(S.clock));
    if (S.theme) document.documentElement.setAttribute('data-theme', S.theme); else document.documentElement.removeAttribute('data-theme');
  }
  function flipTheme() { S.theme = Deck.isDark() ? 'light' : 'dark'; syncBar(); themeListeners.forEach((f) => f()); Deck.save(); }

  function tick() {
    const el = $('#clock');
    el.hidden = !S.clock;
    if (!S.clock) return;
    const secs = S.started ? (Date.now() - S.started) / 1000 : 0;
    el.innerHTML = '<b>' + Math.floor(secs / 60) + ':' + String(Math.floor(secs % 60)).padStart(2, '0') + '</b>';
  }

  let resetArmed = 0;
  function reset(btn) {
    if (Date.now() - resetArmed > 3000) {
      resetArmed = Date.now(); btn.classList.add('armed');
      setTimeout(() => btn.classList.remove('armed'), 3000);
      return;
    }
    btn.classList.remove('armed'); resetArmed = 0;
    const theme = S.theme;
    S = fresh(); S.theme = theme;
    built.forEach((g) => { if (g && g.part.reset) g.part.reset(); });
    syncBar();
    go(0, 0, 'jump');
  }

  function fit() {
    const vw = innerWidth, vh = innerHeight, s = Math.min(vw / W, vh / H);
    stage.style.transform = 'translate(' + (vw - W * s) / 2 + 'px, ' + (vh - H * s) / 2 + 'px) scale(' + s + ')';
    Deck.scale = s;
  }

  let blank = false;
  function setBlank(v) { blank = v; $('#blank').hidden = !v; }
  function keys() {
    document.addEventListener('keydown', (e) => {
      if ((e.target.closest && e.target.closest('input, textarea, select, [contenteditable]')) || e.metaKey || e.ctrlKey || e.altKey) return;
      if (blank) { setBlank(false); e.preventDefault(); return; }
      const g = built[S.pos.s];
      if (g && g.part.key && g.part.key(e)) { e.preventDefault(); return; }
      const k = e.key, lower = k.toLowerCase();
      if (k === 'ArrowRight' || k === ' ' || k === 'PageDown' || k === 'Enter') next();
      else if (k === 'ArrowLeft' || k === 'PageUp' || k === 'Backspace') prev();
      else if (k === '[') jump(S.pos.s - 1);
      else if (k === ']') jump(S.pos.s + 1);
      else if (lower === 't') flipTheme();
      else if (lower === 'b' || k === '.') setBlank(true);
      else if (lower === 'c') { S.clock = !S.clock; syncBar(); tick(); Deck.save(); }
      else if (k === '?' || lower === 'h') $('#helpbox').hidden = !$('#helpbox').hidden;
      else if (k === 'Escape') $('#helpbox').hidden = true;
      else return;
      e.preventDefault();
    });
    $('.ctl').addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      b.blur();
      if (b.dataset.seg) return jump(+b.dataset.seg);
      if (b.id === 'prev') prev();
      else if (b.id === 'next') next();
      else if (b.id === 'theme') flipTheme();
      else if (b.id === 'clockbtn') { S.clock = !S.clock; syncBar(); tick(); Deck.save(); }
      else if (b.id === 'reset') reset(b);
      else if (b.id === 'help') $('#helpbox').hidden = !$('#helpbox').hidden;
    });
    $('#helpbox').addEventListener('click', () => { $('#helpbox').hidden = true; });
    $('#blank').addEventListener('click', () => setBlank(false));

    /* Swipe for builds on touch screens, unless the finger started on something you can grab. */
    let sw = null;
    stage.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' || e.target.closest('.card, button, input, .grab, [contenteditable]')) return;
      sw = { x: e.clientX, y: e.clientY, t: performance.now() };
    });
    window.addEventListener('pointerup', (e) => {
      if (!sw) return;
      const dx = e.clientX - sw.x, dy = e.clientY - sw.y, dt = performance.now() - sw.t;
      sw = null;
      if (Math.abs(dx) > 60 && Math.abs(dy) < Math.abs(dx) * 0.6 && dt < 700) { if (dx < 0) next(); else prev(); }
    });

    /* The control bar fades when the mouse is still, so it doesn't sit on the projection. */
    let idle = 0;
    const wake = () => {
      $('.ctl').classList.remove('idle');
      clearTimeout(idle);
      idle = setTimeout(() => $('.ctl').classList.add('idle'), 2500);
    };
    window.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse') wake(); });
    wake();
    window.addEventListener('resize', fit);
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { syncBar(); themeListeners.forEach((f) => f()); });
  }

  Deck.start = function (list) {
    pages = Deck.pages = list;
    stage = Deck.stage = $('#stage');
    const h = location.hash.slice(1);
    if (/^\d+(\.\d+)?$/.test(h)) { const [a, c] = h.split('.').map(Number); if (pages[a]) S.pos = { s: a, b: Math.min(c || 0, pages[a].prompts.length - 1) }; }
    if (!pages[S.pos.s]) S.pos = { s: 0, b: 0 };
    promptEl = Deck.el('div', 'prompt', stage, '<div class="prompt-text"></div>');
    $('#dots').innerHTML = pages.map((g, i) => '<button type="button" data-seg="' + i + '" title="' + Deck.esc(g.title) + '" aria-label="' + Deck.esc(g.title) + '"></button>').join('');
    keys(); fit(); syncBar();
    setInterval(tick, 1000);
    go(S.pos.s, S.pos.b, 'jump');
  };
})(this);
