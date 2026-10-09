/* Stats: a quiz, then three pictures you push on. Arithmetic lives in model.js. */
(function () {
  'use strict';
  const S = window.Stats;
  const $ = (sel, el) => (el || document).querySelector(sel);
  const $$ = (sel, el) => Array.from((el || document).querySelectorAll(sel));
  const css = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const nf = x => x.toLocaleString('en-US');
  const amount = x => nf(parseFloat(x < 10 ? x.toFixed(1) : Math.round(x)));
  const percent = p => {
    const v = p * 100;
    return (v >= 10 ? String(Math.round(v)) : v >= 1 ? v.toFixed(1) : String(parseFloat(v.toPrecision(2)))) + '%';
  };

  /* ---------- views ---------- */
  const VIEWS = ['quiz', 'kids', 'test', 'doors'];
  let view = 'quiz';
  function show(name) {
    if (VIEWS.indexOf(name) < 0) name = 'quiz';
    view = name;
    $$('main > section').forEach(s => { s.hidden = s.dataset.view !== name; });
    $$('.tabs button').forEach(b => {
      if (b.dataset.view === name) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
    if (name !== 'kids') kidsStop();
    if (name === 'test') drawCrowd();
    if (location.hash.slice(1) !== name) history.replaceState(null, '', '#' + name);
  }
  $$('.tabs button').forEach(b => b.addEventListener('click', () => show(b.dataset.view)));
  $('#done').addEventListener('click', () => show('kids'));

  /* ---------- a: two kids ---------- */
  const bins = $('#bins');
  const counts = {};
  let clue = 'either', kidsTimer = 0, sampled = 0;
  const KIDS_CAP = 20000;
  S.FAMILIES.forEach(f => {
    counts[f] = 0;
    const el = document.createElement('div');
    el.className = 'bin'; el.dataset.f = f;
    el.innerHTML = '<span class="pair">' + f.split('').map(c => '<span class="' + c + '">' + (c === 'B' ? '♂' : '♀') + '</span>').join('') +
      '</span><div class="bar"><div class="fill"></div></div><span class="n"></span>';
    bins.appendChild(el);
  });
  function kidsDraw() {
    const kept = S.kids(clue).kept;
    const top = Math.max(1, ...S.FAMILIES.map(f => counts[f]));
    let keptTotal = 0;
    $$('.bin', bins).forEach(el => {
      const f = el.dataset.f, on = kept.indexOf(f) >= 0;
      el.classList.toggle('in', on); el.classList.toggle('out', !on); el.classList.toggle('both', on && f === 'BB');
      $('.fill', el).style.height = (counts[f] / top * 100) + '%';
      $('.n', el).textContent = counts[f] ? nf(counts[f]) : '';
      if (on) keptTotal += counts[f];
    });
    $('#kidsOut').textContent = keptTotal ? percent(counts.BB / keptTotal) : '';
  }
  function kidsTick() {
    for (let i = 0; i < 12 && sampled < KIDS_CAP; i++, sampled++) counts[S.randomFamily(Math.random)]++;
    kidsDraw();
    if (sampled >= KIDS_CAP) kidsStop();
  }
  function kidsStart() { if (!kidsTimer && sampled < KIDS_CAP) kidsTimer = setInterval(kidsTick, 40); }
  function kidsStop() { clearInterval(kidsTimer); kidsTimer = 0; }
  function kidsReset() { kidsStop(); S.FAMILIES.forEach(f => { counts[f] = 0; }); sampled = 0; kidsDraw(); }
  $('#kidsRun').addEventListener('click', () => (kidsTimer ? kidsStop() : kidsStart()));
  $('#kidsReset').addEventListener('click', kidsReset);
  $$('.clue button').forEach(b => b.addEventListener('click', () => {
    clue = b.dataset.clue;
    $$('.clue button').forEach(x => x.classList.toggle('on', x === b));
    kidsDraw();
  }));
  kidsDraw();

  /* ---------- b: the test ---------- */
  const PREV = [2, 10, 100, 1000, 10000, 100000, 1000000];       // "1 in N"
  const ACC = [50, 70, 90, 95, 99, 99.9, 99.99];                  // percent
  let prevI = PREV.length - 1, accI = ACC.indexOf(99);
  const crowd = $('#crowd'), ctx = crowd.getContext('2d');
  // fixed shuffle of the 10,000 cells, so the red ones stay put while you scrub
  const order = (() => {
    const a = Array.from({ length: 10000 }, (_, i) => i); let s = 12345;
    for (let i = a.length - 1; i > 0; i--) {
      s = (s * 1664525 + 1013904223) % 4294967296;
      const j = Math.floor(s / 4294967296 * (i + 1)); [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  })();
  function drawCrowd() {
    const t = S.test(1 / PREV[prevI], ACC[accI] / 100);
    const red = t.ppv > 0 ? Math.max(1, Math.round(t.ppv * 10000)) : 0;
    ctx.clearRect(0, 0, 100, 100);
    ctx.fillStyle = css('--muted');
    for (let i = 0; i < 10000; i++) ctx.fillRect(i % 100, Math.floor(i / 100), 1, 1);
    ctx.fillStyle = css('--bad');
    for (let i = 0; i < red; i++) { const c = order[i]; ctx.fillRect(c % 100, Math.floor(c / 100), 1, 1); }
    $('#flow').innerHTML = '<span>' + nf(t.n) + '</span><svg viewBox="0 0 24 24"><path d="M4 12h15M13 6l6 6-6 6"/></svg>' +
      '<span class="well">■ ' + amount(t.positives) + '</span><svg viewBox="0 0 24 24"><path d="M4 12h15M13 6l6 6-6 6"/></svg>' +
      '<span class="sick">● ' + amount(t.sickPos) + '</span>';
    $('#testOut').textContent = percent(t.ppv);
  }
  function scrub(el, steps, get, set, label) {
    function paint() {
      el.textContent = label(steps[get()]);
      el.setAttribute('aria-valuemin', 0); el.setAttribute('aria-valuemax', steps.length - 1);
      el.setAttribute('aria-valuenow', get()); el.setAttribute('aria-valuetext', el.textContent);
    }
    function move(i) { i = Math.max(0, Math.min(steps.length - 1, i)); if (i !== get()) { set(i); paint(); drawCrowd(); } }
    let x0 = 0, i0 = 0, dragging = false;
    el.addEventListener('pointerdown', e => { dragging = true; x0 = e.clientX; i0 = get(); el.setPointerCapture(e.pointerId); e.preventDefault(); });
    el.addEventListener('pointermove', e => { if (dragging) move(i0 + Math.round((e.clientX - x0) / 30)); });
    const end = () => { dragging = false; };
    el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
    el.addEventListener('keydown', e => {
      const d = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[e.key];
      if (d) { move(get() + d); e.preventDefault(); e.stopPropagation(); }
    });
    paint();
  }
  scrub($('#prev'), PREV, () => prevI, i => { prevI = i; }, n => '1 in ' + nf(n));
  scrub($('#acc'), ACC, () => accI, i => { accI = i; }, a => a + '%');

  /* ---------- c: three doors ---------- */
  const doorRow = $('#doorRow');
  const CHECK = '<svg class="check" viewBox="0 0 120 60"><rect x="3" y="3" width="114" height="54" rx="6" fill="var(--accent-soft)" stroke="var(--accent-ink)"/>' +
    '<path d="M62 44h46" stroke="var(--ink-2)"/><text x="12" y="26" font-size="22" font-weight="700" fill="var(--ink)" stroke="none">$1M</text></svg>';
  const X = '<svg viewBox="0 0 24 24" style="color:var(--bad)"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  let host = 'knows';
  let rd = null;                    // the round on the table: {car, pick, opened, phase, chosen, voided}
  const tal = { n: 0, stay: 0, swap: 0, voided: 0 };
  for (let i = 0; i < 3; i++) {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'door closed'; b.setAttribute('aria-label', 'Door ' + (i + 1));
    b.addEventListener('click', () => clickDoor(i));
    doorRow.appendChild(b);
  }
  function newRound() { rd = { car: Math.floor(Math.random() * 3), pick: -1, opened: -1, phase: 'pick', chosen: -1, voided: false }; drawDoors(); }
  function clickDoor(i) {
    if (rd.phase === 'done') { newRound(); return; }
    if (rd.phase === 'pick') {
      rd.pick = i;
      const others = [0, 1, 2].filter(d => d !== i);
      const pool = host === 'random' ? others : others.filter(d => d !== rd.car);
      rd.opened = pool[Math.floor(Math.random() * pool.length)];
      rd.voided = rd.opened === rd.car;
      if (rd.voided) { rd.chosen = i; rd.phase = 'done'; tal.voided++; }
      else rd.phase = 'choose';
    } else if (rd.phase === 'choose' && i !== rd.opened) {
      rd.chosen = i; rd.phase = 'done';
      tal.n++; if (rd.pick === rd.car) tal.stay++; else tal.swap++;
    }
    drawDoors(); drawTally();
  }
  function drawDoors() {
    $$('.door', doorRow).forEach((el, i) => {
      const open = rd.phase === 'done' || i === rd.opened;
      let cls = 'door ' + (open ? 'open' : 'closed'), html = '';
      if (open) html = i === rd.car ? CHECK : '<span class="goat">🐐</span>';
      if (rd.phase === 'choose') {
        if (i === rd.pick) cls += ' mine';
        else if (i !== rd.opened) cls += ' offer';
      }
      if (rd.phase === 'done') {
        if (i === rd.chosen) cls += ' mine' + (rd.voided ? '' : i === rd.car ? ' won' : ' lost');
        if (rd.voided && i === rd.opened) html += '<span class="tag">' + X + '</span>';
      }
      el.className = cls; el.innerHTML = html;
    });
  }
  const STAY = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5" class="solid"/></svg>';
  const SWAP = '<svg viewBox="0 0 24 24"><path d="M4 8h15M15 4l4 4-4 4M20 16H5M9 12l-4 4 4 4"/></svg>';
  function drawTally() {
    const row = (cls, icon, p, sub) => icon + '<div class="track ' + cls + '"><div class="fill" style="width:' + (p * 100) + '%"></div></div>' +
      '<span class="num">' + (tal.n ? percent(p) : '') + '<span class="sub"> ' + sub + '</span></span>';
    $('#tally').innerHTML =
      row('stay', STAY, tal.n ? tal.stay / tal.n : 0, tal.n ? nf(tal.stay) : '') +
      row('swap', SWAP, tal.n ? tal.swap / tal.n : 0, tal.n ? nf(tal.swap) : '') +
      (tal.voided ? X + '<span></span><span class="num">' + nf(tal.voided) + '</span>' : '');
    $$('#tally .track').forEach((t, i) => t.classList.toggle('swap', i === 1));
  }
  function play(n) {
    for (let i = 0; i < n; i++) {
      const r = S.round(host, Math.random);
      if (r.voided) tal.voided++; else { tal.n++; tal.stay += r.stay; tal.swap += r.swap; }
    }
    newRound(); drawTally();
  }
  function setHost(h) { host = h; $('#host').classList.toggle('blind', h === 'random'); tal.n = tal.stay = tal.swap = tal.voided = 0; newRound(); drawTally(); }
  $('#host').addEventListener('click', () => setHost(host === 'knows' ? 'random' : 'knows'));
  $('#again').addEventListener('click', newRound);
  $$('.auto').forEach(b => b.addEventListener('click', () => play(+b.dataset.n)));
  $('#doorReset').addEventListener('click', () => { tal.n = tal.stay = tal.swap = tal.voided = 0; newRound(); drawTally(); });
  newRound(); drawTally();

  /* ---------- keys, theme, start ---------- */
  document.addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key, onControl = /^(BUTTON|INPUT)$/.test(e.target.tagName) || e.target.getAttribute('role') === 'slider';
    if (/^[1-4]$/.test(k)) show(VIEWS[+k - 1]);
    else if (k === 'ArrowRight' && !onControl) show(VIEWS[Math.min(3, VIEWS.indexOf(view) + 1)]);
    else if (k === 'ArrowLeft' && !onControl) show(VIEWS[Math.max(0, VIEWS.indexOf(view) - 1)]);
    else if ((k === 'r' || k === 'R') && view === 'kids') kidsReset();
    else if ((k === 'h' || k === 'H') && view === 'doors') setHost(host === 'knows' ? 'random' : 'knows');
    else if (k === ' ' && !onControl) {
      e.preventDefault();
      if (view === 'kids') (kidsTimer ? kidsStop() : kidsStart());
      else if (view === 'doors') newRound();
    }
  });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (view === 'test') drawCrowd(); });
  window.addEventListener('hashchange', () => show(location.hash.slice(1)));
  drawCrowd();
  show(location.hash.slice(1));
})();
