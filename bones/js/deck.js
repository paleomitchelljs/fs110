/* The deck: a fixed 1600 × 900 stage scaled to the window, segments made of
 * builds (one press each), and items that show for a range of builds. Parts
 * (js/parts, js/cases) register a factory under Deck.parts[kind]; content.js
 * says which items go where. Saved state lives in localStorage and the page
 * works the same without it.
 *
 * A part factory gets (def, host, seg) and returns any of:
 *   show(build, how)   how: 'step' (forward one), 'back', 'jump', 'reveal' (answers just shown), 'flag'
 *   hide()             the item just went off screen
 *   key(e)             return true if it used the key
 *   digit(n, shift)    number keys while it's the newest item on screen
 *   add()              N key: type a new item
 *   reset()            start over
 */
(function (root) {
  'use strict';
  const W = 1600, H = 900, STORE = 'bones-v1';
  const $ = (s) => document.querySelector(s);
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const motion = matchMedia('(prefers-reduced-motion: reduce)');

  const Deck = root.Deck = { W, H, clamp, parts: {}, sketches: {}, scale: 1 };
  Object.defineProperty(Deck, 'reduced', { get: () => motion.matches });

  /* ---------- helpers ---------- */
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
  Deck.place = function (e, b) {
    if (!b) return;
    e.style.left = b[0] + 'px'; e.style.top = b[1] + 'px';
    if (b[2] != null) e.style.width = b[2] + 'px';
    if (b[3] != null) e.style.height = b[3] + 'px';
  };
  /* Pointer position in stage pixels, relative to element e. */
  Deck.local = function (e, ev) {
    const r = e.getBoundingClientRect();
    return { x: (ev.clientX - r.left) / Deck.scale, y: (ev.clientY - r.top) / Deck.scale };
  };
  Deck.esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  /* *stress* and one ~~struck~~ phrase; whatever follows a strike fades in after it. */
  Deck.md = function (s) {
    let h = Deck.esc(s || '').replace(/\*([^*]+)\*/g, '<em>$1</em>');
    const m = h.match(/^(.*?)~~(.+?)~~(.*)$/);
    if (m) h = `${m[1]}<s>${m[2]}</s><span class="after">${m[3]}</span>`;
    return h;
  };
  /* Restart a CSS animation class. */
  Deck.replay = function (e, cls) { e.classList.remove(cls); void e.offsetWidth; e.classList.add(cls); };
  Deck.ease = (k) => k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
  /* fn(k) for k from 0 to 1 over ms. Returns a stop function. */
  Deck.tween = function (ms, fn, done) {
    if (Deck.reduced || ms <= 0) { fn(1); if (done) done(); return () => {}; }
    let stopped = false;
    const t0 = performance.now();
    const step = (t) => {
      if (stopped) return;
      const k = Math.min(1, (t - t0) / ms);
      fn(k);
      if (k < 1) requestAnimationFrame(step); else if (done) done();
    };
    requestAnimationFrame(step);
    return () => { stopped = true; };
  };
  /* Drag a number: horizontal right or vertical up increases it. */
  Deck.scrub = function (e, get, set, perPx) {
    e.addEventListener('pointerdown', (ev) => {
      ev.preventDefault(); ev.stopPropagation();
      e.setPointerCapture(ev.pointerId);
      const x0 = ev.clientX, y0 = ev.clientY, v0 = get();
      const move = (m) => set(v0 + ((m.clientX - x0) - (m.clientY - y0)) / Deck.scale * perPx);
      const up = () => { e.removeEventListener('pointermove', move); e.removeEventListener('pointerup', up); e.removeEventListener('pointercancel', up); };
      e.addEventListener('pointermove', move); e.addEventListener('pointerup', up); e.addEventListener('pointercancel', up);
    });
    e.addEventListener('wheel', (ev) => { ev.preventDefault(); set(get() + (ev.deltaY < 0 ? 1 : -1) * perPx * 4); }, { passive: false });
  };

  /* Icons for the five framework questions (24 × 24, stroked). */
  Deck.icons = {
    claim: '<svg viewBox="0 0 24 24"><path d="M4 4.5h16v11.5H10l-6 4.5z"/></svg>',
    evidence: '<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5.5 5.5"/></svg>',
    else: '<svg viewBox="0 0 24 24"><path d="M12 21v-8M12 13 6.5 5M12 13l5.5-8"/><path d="M5.5 9.2 6.5 5l4 1.2M18.5 9.2 17.5 5l-4 1.2"/></svg>',
    test: '<svg viewBox="0 0 24 24"><path d="M12 4v16M8 20h8M4.5 7.5h15"/><path d="M4.5 7.5 2 14h5zM19.5 7.5 17 14h5z"/></svg>',
    sure: '<svg viewBox="0 0 24 24"><path d="M4 17a8 8 0 0 1 16 0"/><path d="M12 17l4.5-6"/></svg>'
  };
  Deck.eyeIcon = '<svg viewBox="0 0 24 24"><path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';

  /* ---------- events ---------- */
  const listeners = {};
  Deck.on = (ev, fn) => { (listeners[ev] = listeners[ev] || []).push(fn); };
  const emit = (ev, a) => (listeners[ev] || []).forEach((fn) => fn(a));

  /* ---------- saved state ---------- */
  const fresh = () => ({ pos: { s: 0, b: 0 }, answers: false, extras: false, theme: null, clock: false, started: null, parts: {} });
  let S = fresh();
  try {
    const saved = JSON.parse(localStorage.getItem(STORE) || 'null');
    if (saved && saved.pos) S = Object.assign(fresh(), saved);
  } catch (e) { /* no storage: start fresh */ }
  let saveTimer = 0;
  Deck.save = () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => { try { localStorage.setItem(STORE, JSON.stringify(S)); } catch (e) { /* ignore */ } }, 150);
  };
  /* A part's saved state, made on first use. Fetch it fresh each time: reset replaces it. */
  Deck.get = (id, make) => S.parts[id] || (S.parts[id] = make());
  Deck.peek = (id) => S.parts[id];
  Deck.flags = { get answers() { return S.answers; }, get extras() { return S.extras; } };

  /* ---------- segments and builds ---------- */
  let C, segs, stage, promptEl, tagEl, eyeEl, railEl;
  const built = [];

  const allowed = (s, b) => { const bd = segs[s] && segs[s].builds[b]; return !!bd && (!bd.extra || S.extras); };
  function firstOf(s) { for (let b = 0; b < segs[s].builds.length; b++) if (allowed(s, b)) return b; return null; }
  function lastOf(s) { for (let b = segs[s].builds.length - 1; b >= 0; b--) if (allowed(s, b)) return b; return null; }

  function visible(d, b) {
    if (d.extra && !S.extras) return false;
    if (d.ans && !S.answers) return false;
    if (d.builds) return d.builds.includes(b);
    return b >= (d.at || 0) && b < (d.until == null ? Infinity : d.until);
  }
  /* The build at which an item most recently came on: decides which item gets the keys. */
  function since(d, b) {
    if (d.builds) return Math.max(...d.builds.filter((x) => x <= b));
    return d.at || 0;
  }

  function build(s) {
    const seg = segs[s], el = Deck.el('div', 'seg off', stage);
    el.dataset.seg = seg.id;
    stage.insertBefore(el, promptEl);
    const items = seg.items.map((def) => {
      const host = Deck.el('div', 'item off item-' + def.kind, el);
      Deck.place(host, def.box);
      const make = Deck.parts[def.kind];
      const part = make ? make(def, host, seg) || {} : {};
      return { def, el: host, part, on: false };
    });
    built[s] = { el, items };
  }
  function leave(s) {
    for (const it of built[s].items) if (it.on) { it.on = false; it.el.classList.add('off'); if (it.part.hide) it.part.hide(); }
  }

  function go(s, b, how) {
    const old = S.pos.s;
    if (old !== s && built[old]) leave(old);
    if (!built[s]) build(s);
    built.forEach((g, i) => { if (g) g.el.classList.toggle('off', i !== s); });
    if (s >= 1 && !S.started) S.started = Date.now();
    S.pos = { s, b };
    emit('go', S.pos);
    render(how);
    try { history.replaceState(null, '', '#' + s + (b ? '.' + b : '')); } catch (e) { /* file:// in some browsers */ }
    Deck.save();
  }

  function render(how) {
    const { s, b } = S.pos, seg = segs[s], bd = seg.builds[b] || {};
    for (const it of built[s].items) {
      if (visible(it.def, b)) {
        if (!it.on) { it.on = true; it.el.classList.remove('off'); }
        if (it.part.show) it.part.show(b, how);
      } else if (it.on) {
        it.on = false; it.el.classList.add('off');
        if (it.part.hide) it.part.hide();
      }
    }
    const text = promptEl.querySelector('.prompt-text');
    text.innerHTML = Deck.md(bd.prompt);
    if (how === 'step') Deck.replay(promptEl, 'play'); else promptEl.classList.remove('play');
    tagEl.textContent = bd.tag || '';
    tagEl.classList.toggle('off', !bd.tag);
    if (bd.tag && how === 'step') Deck.replay(tagEl, 'play');
    eyeEl.classList.toggle('off', !(bd.eye && !S.answers));

    const fw = segs.findIndex((x) => x.id === C.railFrom);
    railEl.classList.toggle('off', !(s > fw || (s === fw && b >= (segs[fw].railFrom || 0))));
    railEl.querySelectorAll('.ri').forEach((r) => r.classList.toggle('lit', r.dataset.k === bd.rail));
    syncDots(); tick();
  }

  function next() {
    const { s, b } = S.pos;
    for (let k = b + 1; k < segs[s].builds.length; k++) if (allowed(s, k)) return go(s, k, 'step');
    for (let t = s + 1; t < segs.length; t++) { const f = firstOf(t); if (f !== null) return go(t, f, 'step'); }
  }
  function prev() {
    const { s, b } = S.pos;
    for (let k = b - 1; k >= 0; k--) if (allowed(s, k)) return go(s, k, 'back');
    for (let t = s - 1; t >= 0; t--) { const l = lastOf(t); if (l !== null) return go(t, l, 'back'); }
  }
  function jumpSeg(t) {
    if (t < 0 || t >= segs.length) return;
    const f = firstOf(t);
    if (f !== null) go(t, f, 'jump');
  }
  Deck.next = next; Deck.prev = prev;
  Deck.where = () => ({ s: S.pos.s, b: S.pos.b });

  /* The newest item on screen that can take this kind of input. */
  function active(cap) {
    const g = built[S.pos.s];
    if (!g) return null;
    let best = null, bestAt = -1;
    for (const it of g.items) {
      if (!it.on || !it.part[cap]) continue;
      const at = since(it.def, S.pos.b);
      if (at >= bestAt) { best = it; bestAt = at; }
    }
    return best;
  }

  /* ---------- answers, extras, theme ---------- */
  function setFlag(k, v) {
    S[k] = v;
    document.body.classList.toggle(k, v);
    if (k === 'extras' && !allowed(S.pos.s, S.pos.b)) {
      const { s, b } = S.pos;
      let nb = null;
      for (let x = b - 1; x >= 0 && nb === null; x--) if (allowed(s, x)) nb = x;
      for (let x = b + 1; x < segs[s].builds.length && nb === null; x++) if (allowed(s, x)) nb = x;
      if (nb !== null) S.pos.b = nb; else { syncBar(); emit(k, v); return next(); }
    }
    syncBar(); emit(k, v);
    render(k === 'answers' && v ? 'reveal' : 'flag');
    Deck.save();
  }
  Deck.toggleAnswers = () => setFlag('answers', !S.answers);
  const isDark = () => S.theme ? S.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  Deck.isDark = isDark;

  function syncBar() {
    $('#answers').setAttribute('aria-pressed', String(!S.answers));
    $('#extras').setAttribute('aria-pressed', String(S.extras));
    $('#theme').setAttribute('aria-pressed', String(isDark()));
    $('#clockbtn').setAttribute('aria-pressed', String(S.clock));
    if (S.theme) document.documentElement.setAttribute('data-theme', S.theme); else document.documentElement.removeAttribute('data-theme');
    document.body.classList.toggle('answers', S.answers);
    document.body.classList.toggle('extras', S.extras);
  }
  function syncDots() {
    $('#dots').querySelectorAll('button').forEach((d, i) => {
      d.classList.toggle('here', i === S.pos.s);
      d.classList.toggle('done', i < S.pos.s);
    });
  }

  /* ---------- clock ---------- */
  function tick() {
    const el = $('#clock');
    el.hidden = !S.clock;
    if (!S.clock) return;
    const seg = segs[S.pos.s], secs = S.started ? (Date.now() - S.started) / 1000 : 0;
    const m = Math.floor(secs / 60), sec = Math.floor(secs % 60);
    el.innerHTML = `<b>${m}:${String(sec).padStart(2, '0')}</b> <span>${seg.mins[0]}–${seg.mins[1]}</span>`;
    el.classList.toggle('late', S.started && secs / 60 > seg.mins[1]);
  }

  /* ---------- reset ---------- */
  let resetArmed = 0;
  function reset(btn) {
    if (Date.now() - resetArmed > 3000) {
      resetArmed = Date.now(); btn.classList.add('armed');
      setTimeout(() => btn.classList.remove('armed'), 3000);
      return;
    }
    btn.classList.remove('armed'); resetArmed = 0;
    const theme = S.theme;
    built.forEach((g, i) => { if (g) leave(i); });
    S = fresh(); S.theme = theme;
    built.forEach((g) => { if (g) g.items.forEach((it) => { if (it.part.reset) it.part.reset(); }); });
    emit('reset');
    syncBar();
    go(0, 0, 'jump');
  }

  /* ---------- fit the stage to the window ---------- */
  function fit() {
    const vw = innerWidth, vh = innerHeight, s = Math.min(vw / W, vh / H);
    stage.style.transform = `translate(${(vw - W * s) / 2}px, ${(vh - H * s) / 2}px) scale(${s})`;
    Deck.scale = s;
    emit('resize', s);
  }

  /* ---------- input ---------- */
  let blank = false;
  function setBlank(v) { blank = v; $('#blank').hidden = !v; }
  function keys() {
    document.addEventListener('keydown', (e) => {
      if ((e.target.closest && e.target.closest('input, textarea, select')) || e.metaKey || e.ctrlKey || e.altKey) return;
      if (blank) { setBlank(false); e.preventDefault(); return; }
      if (Deck.focusKey && Deck.focusKey(e)) { e.preventDefault(); return; }
      const keyed = active('key');
      if (keyed && keyed.part.key(e)) { e.preventDefault(); return; }
      const k = e.key, lower = k.toLowerCase();
      if (k === 'ArrowRight' || k === ' ' || k === 'PageDown' || k === 'Enter') next();
      else if (k === 'ArrowLeft' || k === 'PageUp' || k === 'Backspace') prev();
      else if (k === '[') jumpSeg(S.pos.s - 1);
      else if (k === ']') jumpSeg(S.pos.s + 1);
      else if (/^Digit[0-9]$/.test(e.code) && active('digit')) active('digit').part.digit(+e.code.slice(5), e.shiftKey);
      else if (lower === 'n' && active('add')) active('add').part.add();
      else if (lower === 'p') setFlag('answers', !S.answers);
      else if (lower === 'x') setFlag('extras', !S.extras);
      else if (lower === 't') { S.theme = isDark() ? 'light' : 'dark'; syncBar(); emit('theme'); Deck.save(); }
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
      if (b.dataset.seg) return jumpSeg(+b.dataset.seg);
      if (b.id === 'prev') prev();
      else if (b.id === 'next') next();
      else if (b.id === 'answers') setFlag('answers', !S.answers);
      else if (b.id === 'extras') setFlag('extras', !S.extras);
      else if (b.id === 'theme') { S.theme = isDark() ? 'light' : 'dark'; syncBar(); emit('theme'); Deck.save(); }
      else if (b.id === 'clockbtn') { S.clock = !S.clock; syncBar(); tick(); Deck.save(); }
      else if (b.id === 'reset') reset(b);
      else if (b.id === 'help') $('#helpbox').hidden = !$('#helpbox').hidden;
    });
    $('#helpbox').addEventListener('click', () => { $('#helpbox').hidden = true; });
    $('#blank').addEventListener('click', () => setBlank(false));
    eyeEl.addEventListener('click', () => setFlag('answers', true));

    /* Swipe for builds on touch screens, unless the finger started on something you can grab. */
    let sw = null;
    stage.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' || e.target.closest('.card, button, input, .scrub, .grab')) return;
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
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { syncBar(); emit('theme'); });
  }

  /* ---------- start ---------- */
  Deck.start = function (content) {
    C = Deck.content = content; segs = content.segments;
    stage = Deck.stage = $('#stage');

    const h = location.hash.slice(1);
    if (h === 'all') { S.answers = true; S.extras = true; }
    else if (h === 'extras') S.extras = true;
    else if (/^\d+(\.\d+)?$/.test(h)) { const [a, c] = h.split('.').map(Number); if (segs[a]) S.pos = { s: a, b: c || 0 }; }
    if (!segs[S.pos.s] || !allowed(S.pos.s, S.pos.b)) S.pos = { s: 0, b: 0 };

    railEl = Deck.el('div', 'rail off', stage);
    railEl.innerHTML = `<div class="rail-title">${Deck.esc(content.railTitle)}</div><div class="rail-icons">` +
      content.rail.map((r) => `<div class="ri" data-k="${r.key}">${Deck.icons[r.key]}<span>${Deck.esc(r.label)}</span></div>`).join('') + '</div>';
    promptEl = Deck.el('div', 'prompt', stage, '<div class="prompt-text"></div>');
    eyeEl = Deck.el('button', 'eyehint off', promptEl, Deck.eyeIcon);
    eyeEl.type = 'button'; eyeEl.title = 'Show answers (P)'; eyeEl.setAttribute('aria-label', 'Show answers');
    tagEl = Deck.el('div', 'tagpill off', promptEl);

    $('#dots').innerHTML = segs.map((g, i) => `<button type="button" data-seg="${i}" title="${Deck.esc(g.title)}" aria-label="${Deck.esc(g.title)}"></button>`).join('');

    keys(); fit(); syncBar();
    setInterval(tick, 1000);
    go(S.pos.s, S.pos.b, 'jump');
  };
})(this);
