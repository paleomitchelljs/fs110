/* The page: state, gestures on the diagram, layer toggles, live brain pressure. */
(function () {
  'use strict';
  const M = window.Model, V = window.View;
  const STORE = 'sauropod-neck-v2';
  const $ = (s) => document.querySelector(s);
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

  /* Layers, in teaching order. Keys 1-9, 0. */
  const LAYERS = ['dh', 'pressure', 'walls', 'heart', 'energy', 'siphon', 'pumps', 'air', 'bones', 'brain'];

  /* Numbers you can drag. */
  const SCRUB = {
    pHead: { min: 20, max: 120, step: 5, px: 6 },
    hr: { min: 3, max: 150, step: 1, px: 3 },
    intensity: { min: 0.05, max: 1.5, step: 0.05, px: 5 },
    veinTol: { min: 0, max: 800, step: 10, px: 2 },
    air: { min: 0, max: 70, step: 1, px: 3 },
    airP: { min: 0, max: 45, step: 0.5, px: 4 },
    cartPct: { min: 0, max: 20, step: 0.5, px: 5 },
    reflexT: { min: 0.5, max: 60, step: 0.5, px: 3 }
  };

  const FRESH = {
    preset: 'giraffatitan', scale: 1, neckAngle: 60, neckRel: 1, curv: 0, pitch: 0, hrMul: 1,
    intensity: 1, pHead: 50, pFloor: 100, veinTol: 10, vapor: 47, pumps: [], headFrac: 5,
    air: 30, airP: 1, cartPct: 10, reflexT: 5, reteT: 0, faintP: 40, burstP: 300,
    wallStress: 90, share: 10, avO2: 50, ef: 60, lvStress: 19.3, rho: 1.055,
    layers: [], predict: true, unmasked: {}, theme: null
  };
  let S = JSON.parse(JSON.stringify(FRESH));
  let frame = null, drag = null, dirty = true, drink = null;
  const brain = { P: null, y: null, t: 0, hist: [] };

  try {
    const saved = JSON.parse(localStorage.getItem(STORE) || 'null');
    if (saved && M.PRESETS[saved.preset]) S = Object.assign(S, saved);
    delete S.heartRel;                 // the heart no longer moves; drop any old offset
  } catch (e) { /* no storage: start fresh */ }
  if (location.hash === '#all') { S.layers = LAYERS.slice(); S.predict = false; }
  const save = () => { try { localStorage.setItem(STORE, JSON.stringify(S)); } catch (e) { /* ignore */ } };

  /* ---------- derived ---------- */
  const animal = () => M.scaled(M.PRESETS[S.preset], S.scale);
  const on = (k) => S.layers.includes(k);
  function values(a, over) {
    const v = Object.assign({}, S, over || {});
    v.neckLen = a.neckLen * S.neckRel;
    v.heartH = a.heartH;                // fixed in the chest
    v.hr = Math.round(M.defaultHeartRate(a.mass) * S.hrMul);
    v.airAssist = on('air') ? S.airP : 0;
    return v;
  }
  function mode() { return on('siphon') ? 'siphon' : on('pumps') && S.pumps.length ? 'pumps' : 'heart'; }
  function compute(over) {
    const a = animal(), v = values(a, over), geo = M.geometry(a, v);
    const circ = M.circulation(a, v, geo, mode());
    const heart = M.heart(a, v, circ.pHeart);
    const energy = M.energy(circ.pHeart, v.share / 100, circ.pumps ? circ.pumps.neckLift : 0, v.headFrac / 100);
    return { a, v, geo, circ, heart, energy };
  }
  function fitFrame(a, v) {
    const extra = [];
    if (on('bones')) M.geometry(a, Object.assign({}, v, { neckAngle: 0, curv: M.cartilage(a, v.cartPct).perJoint })).pts.forEach((p) => extra.push(p));
    return V.bounds(a, v, extra);
  }

  /* ---------- render ---------- */
  const svg = $('#dia');
  let map = null, lastRender = 0;
  function render(now) {
    const box = svg.getBoundingClientRect(), W = Math.max(320, Math.round(box.width)), H = Math.max(240, Math.round(box.height));
    const c = compute(drink ? { neckAngle: drink.angle } : null);
    if (!frame) frame = fitFrame(c.a, c.v);
    const beatPhase = ((now || 0) / 1000 * c.v.hr / 60) % 1;
    const ctx = Object.assign(c, {
      W, H, frame, layers: new Set(S.layers), masked: (k) => S.predict && !S.unmasked[k],
      beat: beatPhase < 0.18 ? Math.sin(Math.PI * beatPhase / 0.18) : 0,
      brain: on('brain') && brain.P != null ? { P: brain.P, brain: brain.y, t: brain.t, hist: brain.hist } : null,
      drag: drag && drag.moved ? drag.kind : null
    });
    const out = V.draw(ctx);
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.innerHTML = out.svg;
    map = out.map;
    lastRender = now || performance.now();
    dirty = false;
    return c;
  }

  /* Live loop: heartbeat, brain pressure, drinking. */
  /* The loop runs only while something moves: a drag, the heartbeat, the brain trace, a drink. */
  let last = 0, running = false;
  function kick() {
    if (running) return;
    running = true; last = performance.now();
    requestAnimationFrame(loop);
  }
  function loop(now) {
    const dt = Math.min(0.1, (now - last) / 1000); last = now;
    if (drink) stepDrink(dt);
    if (on('brain')) stepBrain(dt);
    const busy = on('heart') || on('brain') || drink;
    if (dirty || (busy && now - lastRender > 33)) render(now);
    if (busy || dirty) requestAnimationFrame(loop); else running = false;
  }
  function stepBrain(dt) {
    const c = compute(drink ? { neckAngle: drink.angle } : null);
    const set = c.circ.pHeart, drop = c.circ.pHeart - c.circ.pAtHead;
    if (brain.P == null) { brain.P = set; brain.y = set - drop; }
    const tau = S.reflexT >= 60 ? Infinity : S.reflexT;
    if (isFinite(tau)) brain.P += (set - brain.P) * (1 - Math.exp(-dt / tau));
    const raw = brain.P - drop;
    brain.y = S.reteT > 0 ? brain.y + (raw - brain.y) * (1 - Math.exp(-dt / S.reteT)) : raw;
    brain.t += dt;
    brain.hist.push({ t: brain.t, P: brain.P, brain: brain.y });
    while (brain.hist.length && brain.t - brain.hist[0].t > 31) brain.hist.shift();
  }

  /* Double-click the head: down to drink, hold, back up. */
  function startDrink() {
    const a = animal(), v = values(a);
    const down = M.angleForHeadHeight(a, v, 0.05 * a.shoulderH + 0.4 * S.scale);
    drink = { t: 0, up: S.neckAngle, down, angle: S.neckAngle };
    kick();
  }
  function stepDrink(dt) {
    const T = 3, hold = 5, e = (u) => u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u);
    drink.t += dt;
    const t = drink.t, { up, down } = drink;
    drink.angle = t < T ? up + (down - up) * e(t / T) : t < T + hold ? down : up + (down - up) * (1 - e((t - T - hold) / T));
    if (t > 2 * T + hold) { drink = null; dirty = true; kick(); }
  }

  /* ---------- gestures ---------- */
  function pt(e) {
    const r = svg.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  svg.addEventListener('pointerdown', (e) => {
    const t = e.target.closest('[data-hit],[data-scrub],[data-unmask]');
    if (!t || e.button > 0) return;
    const p = pt(e);
    drag = { kind: t.dataset.hit || (t.dataset.scrub ? 'scrub' : 'unmask'), el: Object.assign({}, t.dataset), x0: p.x, y0: p.y,
      moved: false, start: JSON.parse(JSON.stringify(S)), shift: e.shiftKey };
    try { svg.setPointerCapture(e.pointerId); } catch (err) { /* capture is a nicety */ }
    document.body.classList.add('grabbing');
    e.preventDefault();
  });
  svg.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const p = pt(e), dx = p.x - drag.x0, dy = p.y - drag.y0;
    if (!drag.moved && Math.hypot(dx, dy) < 4) return;
    drag.moved = true;
    const a = animal(), st = drag.start;
    if (drag.kind === 'head' || drag.kind === 'neck') {
      // the head goes where you put it: angle and length
      const v = values(a), geo = M.geometry(a, v), n = geo.pts.length - 1;
      const wx = map.wx(p.x), wy = map.wy(p.y), bx = geo.neckBase.x, by = geo.neckBase.y;
      const c = S.curv * Math.PI / 180;
      let sx = 0, sy = 0; for (let i = 0; i < n; i++) { sx += Math.cos(i * c); sy += Math.sin(i * c); }
      const chord = Math.hypot(sx, sy) / n, offset = Math.atan2(sy, sx) * 180 / Math.PI;
      S.neckAngle = Math.round(clamp(Math.atan2(wy - by, wx - bx) * 180 / Math.PI - offset, -70, 100));
      if (drag.kind === 'head') S.neckRel = clamp(Math.hypot(wx - bx, wy - by) / chord / (M.PRESETS[S.preset].neckLen * S.scale), 0.5, 1.5);
      drink = null;
    } else if (drag.kind === 'body') {
      S.scale = clamp(st.scale * Math.exp(-dy / 260), 0.25, 1.8);
    } else if (drag.kind === 'foot') {
      S.pitch = Math.round(clamp(st.pitch - dy / 4, 0, 60));
    } else if (drag.kind === 'scrub') {
      const k = drag.el.scrub, sp = SCRUB[k], steps = Math.round((dx - dy) / sp.px);
      if (k === 'hr') {
        const base = M.defaultHeartRate(a.mass), hr0 = Math.round(base * st.hrMul);
        S.hrMul = clamp(hr0 + steps, sp.min, sp.max) / base;
      } else S[k] = clamp(+(st[k] + steps * sp.step).toFixed(3), sp.min, sp.max);
    }
    dirty = true; kick();
  });
  function endDrag() {
    if (!drag) return;
    const d = drag; drag = null;
    document.body.classList.remove('grabbing');
    if (!d.moved) click(d);
    if (['body', 'head', 'neck', 'foot', 'ghost'].includes(d.kind)) refit();
    save(); dirty = true; kick();
  }
  svg.addEventListener('pointerup', endDrag);
  svg.addEventListener('pointercancel', endDrag);

  function click(d) {
    const a = animal();
    if (d.kind === 'unmask') S.unmasked[d.el.unmask] = true;
    else if (d.kind === 'heart') S.hrMul = clamp(S.hrMul * (d.shift ? 1 / 1.15 : 1.15), 0.2, 6);
    else if (d.kind === 'rete') S.reteT = S.reteT > 0 ? 0 : 1.5;
    else if (d.kind === 'pump') S.pumps = S.pumps.filter((u) => Math.abs(u - +d.el.u) > 1e-6);
    else if (d.kind === 'neck' && on('pumps')) {
      const geo = M.geometry(a, values(a)), p = { x: map.wx(d.x0), y: map.wy(d.y0) };
      let best = 0, bd = Infinity;
      for (let i = 0; i <= 100; i++) { const q = M.pointAt(geo, i / 100), dd = Math.hypot(q.x - p.x, q.y - p.y); if (dd < bd) { bd = dd; best = i / 100; } }
      if (S.pumps.every((u) => Math.abs(u - best) > 0.04)) S.pumps = S.pumps.concat([best]);
    } else if (d.kind === 'ghost') { S.neckAngle = 0; S.curv = M.cartilage(a, S.cartPct).perJoint; }
    else if (d.kind === 'neck' && on('bones')) S.curv = 0;
  }
  svg.addEventListener('dblclick', (e) => {
    const t = e.target.closest('[data-hit]');
    if (t && t.dataset.hit === 'head') { startDrink(); if (!on('brain')) toggleLayer('brain'); }
  });
  svg.addEventListener('wheel', (e) => {
    const t = e.target.closest('[data-scrub]');
    if (!t) return;
    e.preventDefault();
    const k = t.dataset.scrub, sp = SCRUB[k], dir = e.deltaY < 0 ? 1 : -1;
    if (k === 'hr') { const base = M.defaultHeartRate(animal().mass); S.hrMul = clamp(Math.round(base * S.hrMul) + dir, sp.min, sp.max) / base; }
    else S[k] = clamp(+(S[k] + dir * sp.step).toFixed(3), sp.min, sp.max);
    save(); dirty = true; kick();
  }, { passive: false });

  /* Re-fit the view when the animal outgrows it or shrinks well inside it. */
  function refit() {
    const a = animal(), v = values(a), b = fitFrame(a, v);
    if (!frame || b.y1 > frame.y1 * 1.02 || b.x1 > frame.x1 + 0.5 || b.x0 < frame.x0 - 0.5 || b.y1 < frame.y1 * 0.6) frame = b;
  }

  /* ---------- toolbar ---------- */
  function toggleLayer(k) {
    S.layers = on(k) ? S.layers.filter((x) => x !== k) : S.layers.concat([k]);
    if (k === 'siphon' && on('siphon')) S.layers = S.layers.filter((x) => x !== 'pumps');
    if (k === 'pumps' && on('pumps')) {
      S.layers = S.layers.filter((x) => x !== 'siphon');
      if (!S.pumps.length) S.pumps = [0, 0.34, 0.67];
    }
    if (k === 'brain') { brain.P = null; brain.hist = []; }
    if (k === 'bones') refit();
    syncBar(); save(); dirty = true; kick();
  }
  function isDark() { return S.theme ? S.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches; }
  function syncBar() {
    document.querySelectorAll('[data-layer]').forEach((b) => b.setAttribute('aria-pressed', String(on(b.dataset.layer))));
    $('#predict').setAttribute('aria-pressed', String(S.predict));
    $('#theme').setAttribute('aria-pressed', String(isDark()));
    $('#preset').value = S.preset;
    if (S.theme) document.documentElement.setAttribute('data-theme', S.theme); else document.documentElement.removeAttribute('data-theme');
  }
  function setPreset(id) {
    Object.assign(S, { preset: id, scale: 1, neckAngle: M.PRESETS[id].angle, neckRel: 1, curv: 0, pitch: 0, hrMul: 1,
      pumps: on('pumps') ? [0, 0.34, 0.67] : [] });
    frame = null; drink = null; brain.P = null; brain.hist = [];
    save(); dirty = true; kick();
  }
  let resetArmed = 0;
  $('.bar').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.layer) { toggleLayer(b.dataset.layer); return; }
    if (b.id === 'predict') { S.predict = !S.predict; if (S.predict) S.unmasked = {}; }
    else if (b.id === 'theme') S.theme = isDark() ? 'light' : 'dark';
    else if (b.id === 'help') $('#helpbox').hidden = !$('#helpbox').hidden;
    else if (b.id === 'reset') {
      if (Date.now() - resetArmed > 3000) { resetArmed = Date.now(); b.classList.add('armed'); setTimeout(() => b.classList.remove('armed'), 3000); return; }
      const keep = { theme: S.theme, preset: S.preset };
      S = Object.assign(JSON.parse(JSON.stringify(FRESH)), keep, { neckAngle: M.PRESETS[keep.preset].angle });
      frame = null; drink = null; brain.P = null; brain.hist = []; b.classList.remove('armed');
    }
    syncBar(); save(); dirty = true; kick();
  });
  $('#preset').addEventListener('change', (e) => setPreset(e.target.value));
  $('#helpbox').addEventListener('click', () => { $('#helpbox').hidden = true; });

  document.addEventListener('keydown', (e) => {
    if (e.target.matches('select, input') || e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key.toLowerCase();
    if (/^[0-9]$/.test(k)) { toggleLayer(LAYERS[k === '0' ? 9 : +k - 1]); return; }
    if (k === 'p') { S.predict = !S.predict; if (S.predict) S.unmasked = {}; }
    else if (k === 't') S.theme = isDark() ? 'light' : 'dark';
    else if (k === 'd') { startDrink(); if (!on('brain')) toggleLayer('brain'); }
    else if (k === 'escape') $('#helpbox').hidden = true;
    else if (k === '?' || k === 'h') $('#helpbox').hidden = !$('#helpbox').hidden;
    else return;
    syncBar(); save(); dirty = true; kick();
  });
  window.addEventListener('resize', () => { dirty = true; kick(); });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { syncBar(); dirty = true; kick(); });

  $('#preset').innerHTML = Object.entries(M.PRESETS).map(([id, p]) => `<option value="${id}">${p.name}</option>`).join('');
  syncBar();
  render(performance.now());
  kick();
  window.__app = { S: () => S, compute, toggleLayer, startDrink };
})();
