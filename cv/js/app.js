/* CV and resume: walk the CV, take a line apart, then move the pieces on a one-page resume. Data lives in data.js. */
(function () {
  'use strict';
  const D = window.CVData;
  const $ = (sel, el) => (el || document).querySelector(sel);
  const $$ = (sel, el) => Array.from((el || document).querySelectorAll(sel));
  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const md = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\*(.+?)\*/g, '<i>$1</i>');
  const unmd = s => s.replace(/\*/g, '');

  /* ---------- icons ---------- */
  const PATHS = {
    person: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.5 3.5-7 8-7s8 2.5 8 7"/>',
    edu: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/>',
    pubs: '<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4M9 12h7M9 16h7"/>',
    teach: '<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 20h8M12 16v4"/>',
    service: '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.5 3-6 6-6s6 2.5 6 6"/><circle cx="17" cy="9" r="2.5"/><path d="M17 14c2.5 0 4.5 2 4.5 5"/>',
    outreach: '<path d="M3 10v4h4l8 5V5L7 10z"/><path d="M18 9a4 4 0 0 1 0 6"/>',
    grants: '<circle cx="12" cy="12" r="9"/><path d="M12 6.5v11M15 9.5c0-1.2-1.3-2-3-2s-3 .8-3 2 1.3 1.8 3 2.2 3 1 3 2.3-1.3 2-3 2-3-.8-3-2"/>',
    training: '<circle cx="12" cy="9" r="5"/><path d="M9 13.5L7.5 21l4.5-2.5 4.5 2.5-1.5-7.5"/>',
    societies: '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.2 10.8l7.6-3.6M8.2 13.2l7.6 3.6"/>',
    media: '<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M7 9h6M7 13h10M7 16h10"/>',
    field: '<path d="M2 20l7-12 4 6 3-4 6 10z"/>',
    exp: '<rect x="3" y="7" width="18" height="13" rx="1.5"/><path d="M9 7V4h6v3M3 13h18"/>',
    lines: '<path d="M5 6h14M5 11h14M5 16h9"/>',
    research: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3"/><path d="M7.5 15h9"/>',
    layers: '<rect x="4" y="3" width="16" height="5" rx="1"/><rect x="4" y="10" width="16" height="4" rx="1"/><rect x="4" y="16" width="16" height="5" rx="1"/>',
    blocks: '<rect x="2.5" y="8" width="6" height="8" rx="1"/><rect x="10.5" y="8" width="4" height="8" rx="1"/><rect x="16.5" y="8" width="5" height="8" rx="1"/>',
    sheet: '<rect x="5" y="3" width="14" height="18" rx="1.5"/><circle cx="12" cy="9" r="2"/><path d="M8.5 15h7M8.5 18h5"/>',
    left: '<path d="M15 5l-7 7 7 7"/>', right: '<path d="M9 5l7 7-7 7"/>',
    pencil: '<path d="M4 20h4L19.5 8.5a2.1 2.1 0 0 0-3-3L5 17z"/><path d="M14 7l3 3"/>',
    eye: '<path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    reset: '<path d="M4 12a8 8 0 1 0 2.5-5.8"/><path d="M4 3.5v4h4"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    grip: '<g class="solid"><circle cx="9" cy="6" r="1.7"/><circle cx="15" cy="6" r="1.7"/><circle cx="9" cy="12" r="1.7"/><circle cx="15" cy="12" r="1.7"/><circle cx="9" cy="18" r="1.7"/><circle cx="15" cy="18" r="1.7"/></g>',
  };
  const svg = name => '<svg viewBox="0 0 24 24" aria-hidden="true">' + PATHS[name] + '</svg>';
  function icon(btn, name) { btn.innerHTML = svg(name); }

  const SEC = {}; D.SECTIONS.forEach(s => { SEC[s.id] = s; });
  const RSEC = {}; D.RSECS.forEach(s => { RSEC[s.id] = s; });
  const E = D.ENTRIES;

  /* ---------- views ---------- */
  const VIEWS = ['cv', 'parts', 'resume'];
  let view = 'cv';
  function show(name) {
    if (VIEWS.indexOf(name) < 0) name = 'cv';
    view = name;
    $$('main > section').forEach(s => { s.hidden = s.dataset.view !== name; });
    $$('.tabs button').forEach(b => {
      if (b.dataset.view === name) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
    if (name === 'resume') measure();
    if (location.hash.slice(1) !== name) history.replaceState(null, '', '#' + name);
  }
  [['cv', 'layers'], ['parts', 'blocks'], ['resume', 'sheet']].forEach(([v, ic]) => {
    const b = $('.tabs [data-view="' + v + '"]'); icon(b, ic); b.addEventListener('click', () => show(v));
  });

  /* ---------- a CV line, as html ---------- */
  const piece = (sec, c) => '<span class="p p-' + c.role + (sec.id === 'pubs' && c.role === 'where' ? ' pub' : '') + '" data-role="' + c.role + '">' + md(c.text) + '</span>';
  function rowHTML(sec, cells) {
    const full = cells.filter(c => c.text !== '');
    if (sec.layout === 'head') {
      return '<div class="hdline"><div class="nm">' + piece(sec, cells[0]) + '</div><div class="ct">' + cells.slice(1).map(c => piece(sec, c)).join(sec.join) + '</div></div>';
    }
    const left = sec.left && cells[0].text !== '' ? piece(sec, cells[0]) : '';
    let rest = (sec.left ? cells.slice(1) : cells).filter(c => c.text !== '');
    let hf = '';
    if (sec.hfill && rest.length > 1) hf = '<span class="h">' + piece(sec, rest.pop()) + '</span>';
    return '<div class="l">' + left + '</div><div class="r"><span class="m">' + rest.map(c => piece(sec, c)).join(sec.join) + '</span>' + hf + '</div>';
  }
  const rowEl = (sec, cells, i) => {
    const d = document.createElement(sec.layout === 'head' ? 'div' : 'div');
    d.className = sec.layout === 'head' ? 'cvrow headrow' : 'cvrow'; d.dataset.i = i;
    if (sec.layout === 'head') { d.style.display = 'block'; d.style.background = 'none'; }
    d.innerHTML = rowHTML(sec, cells);
    return d;
  };

  /* ---------- a: the CV, a section at a time ---------- */
  const cvpage = $('#cvpage');
  let openI = -1;
  const bar = (i, j) => 38 + ((i * 53 + j * 37) % 62);   // fixed pseudo-random widths, so the bars don't jump
  D.SECTIONS.forEach((sec, i) => {
    const band = document.createElement('section');
    band.className = 'band'; band.dataset.i = i;
    band.innerHTML =
      '<button type="button" class="bh" aria-expanded="false">' + svg(sec.icon) + '<span class="nm">' + esc(sec.name) + '</span>' +
      (sec.layout === 'head' ? '' : '<span class="ct">' + sec.rows.length + '</span>') + '</button>' +
      '<div class="bars">' + sec.rows.map((r, j) => '<i style="width:' + bar(i, j) + '%"></i>').join('') + '</div><div class="rows"></div>';
    cvpage.appendChild(band);
    $('.bh', band).addEventListener('click', () => setOpen(openI === i ? -1 : i));
  });
  function setOpen(i, scroll) {
    openI = i;
    $$('.band', cvpage).forEach((band, k) => {
      const on = k === i, rows = $('.rows', band);
      band.classList.toggle('open', on);
      $('.bh', band).setAttribute('aria-expanded', on);
      if (on && !rows.firstChild) SEC[D.SECTIONS[k].id].rows.forEach((cells, j) => rows.appendChild(rowEl(D.SECTIONS[k], cells, j)));
    });
    if (i >= 0 && scroll !== false) $$('.band', cvpage)[i].scrollIntoView({ block: 'nearest', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    $('#cvPrev').disabled = i <= 0; $('#cvNext').disabled = i >= D.SECTIONS.length - 1;
  }
  icon($('#cvPrev'), 'left'); icon($('#cvNext'), 'right'); icon($('#cvParts'), 'blocks');
  $('#cvPrev').addEventListener('click', () => setOpen(Math.max(0, openI - 1)));
  $('#cvNext').addEventListener('click', () => setOpen(Math.min(D.SECTIONS.length - 1, openI + 1)));
  function toggleCvParts() {
    const on = cvpage.classList.toggle('parts');
    cvpage.classList.toggle('walk', true);
    $('#cvParts').setAttribute('aria-pressed', on);
  }
  $('#cvParts').addEventListener('click', toggleCvParts);
  cvpage.classList.add('walk');
  // click a line to take it apart
  cvpage.addEventListener('click', e => {
    const r = e.target.closest('.cvrow'); if (!r) return;
    const band = r.closest('.band');
    parts.sec = D.SECTIONS[+band.dataset.i].id; parts.i = +r.dataset.i; parts.hi = null;
    renderParts(); show('parts');
  });
  setOpen(-1);

  /* ---------- b: one line, taken apart ---------- */
  const parts = { sec: 'pubs', i: 1, hi: null };
  const pick = $('#secpick');
  D.SECTIONS.forEach(sec => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'icon'; b.dataset.sec = sec.id; b.title = sec.name; b.setAttribute('aria-label', sec.name);
    b.innerHTML = svg(sec.icon); pick.appendChild(b);
    b.addEventListener('click', () => { parts.sec = sec.id; parts.i = sec.id === 'pubs' ? 1 : 0; parts.hi = null; renderParts(); });
  });
  icon($('#rowPrev'), 'left'); icon($('#rowNext'), 'right');
  function stepRow(d) {
    const n = SEC[parts.sec].rows.length;
    parts.i = (parts.i + d + n) % n; parts.hi = null; renderParts();
  }
  $('#rowPrev').addEventListener('click', () => stepRow(-1));
  $('#rowNext').addEventListener('click', () => stepRow(1));
  function renderParts() {
    const sec = SEC[parts.sec], cells = sec.rows[parts.i];
    $$('.icon', pick).forEach(b => b.classList.toggle('on', b.dataset.sec === parts.sec));
    $('#rowN').textContent = (parts.i + 1) + '/' + sec.rows.length;
    const line = $('#specLine');
    line.innerHTML = '';
    line.appendChild(rowEl(sec, cells, parts.i));
    $('#cards').innerHTML = cells.filter(c => c.text !== '').map(c =>
      '<button type="button" class="card p-' + c.role + '" data-role="' + c.role + '"><span class="lab">' + esc(sec.legend[c.role] || c.role) + '</span><span class="tx">' + md(c.text) + '</span></button>').join('');
    applyHi();
  }
  function applyHi() {
    const hi = parts.hi;
    $$('#specLine .p, #cards .card').forEach(el => {
      el.classList.toggle('dim', !!hi && el.dataset.role !== hi);
      if (el.classList.contains('card')) el.classList.toggle('hi', !!hi && el.dataset.role === hi);
    });
  }
  function toggleHi(role) { parts.hi = parts.hi === role ? null : role; applyHi(); }
  $('#cards').addEventListener('click', e => { const c = e.target.closest('.card'); if (c) toggleHi(c.dataset.role); });
  $('#specLine').addEventListener('click', e => { const p = e.target.closest('.p'); if (p) toggleHi(p.dataset.role); });

  /* ---------- c: the resume ---------- */
  const rs = { order: [], on: {}, edited: {}, sw: {}, target: 'teach', edit: false, heat: false };
  const sheet = $('#sheet'), inner = $('#inner'), tray = $('#tray'), meter = $('#meter');

  function applyPreset(k) {
    const p = D.PRESETS[k];
    rs.target = k; rs.order = p.order.slice(); rs.on = {}; rs.edited = {}; rs.sw = {};
    D.RSECS.forEach(s => { rs.on[s.id] = (p.on[s.id] || []).slice(); });
    renderAll();
  }
  // the line's current text as markup, with the chosen word of each {a|b|c} filled in, or the typed version
  function resolved(id) {
    if (rs.edited[id] != null) return rs.edited[id];
    let k = 0;
    return E[id].t.replace(D.SWAP, (m, g) => { const o = g.split('|'); return o[(rs.sw[id + ':' + (k++)] || 0) % o.length]; });
  }
  function textHTML(id) {
    if (rs.edit || rs.edited[id] != null) return md(resolved(id));
    let k = 0, out = '', last = 0, t = E[id].t, m;
    D.SWAP.lastIndex = 0;
    while ((m = D.SWAP.exec(t))) {
      const o = m[1].split('|'), n = k++;
      out += md(t.slice(last, m.index)) + '<button type="button" class="sw" data-id="' + id + '" data-k="' + n + '" title="Click to swap">' + esc(o[(rs.sw[id + ':' + n] || 0) % o.length]) + '</button>';
      last = m.index + m[0].length;
    }
    return out + md(t.slice(last));
  }
  function renderSheet() {
    let h = '<header class="hd"><h2>Jonathan S. Mitchell</h2><p>jonsmitchell.com · jonsmitch2@gmail.com</p></header>';
    rs.order.forEach(sid => {
      const ids = rs.on[sid]; if (!ids.length) return;
      h += '<div class="rs' + (sid === 'profile' ? ' bare' : '') + '" data-sec="' + sid + '"><div class="rh">' +
        '<button type="button" class="grip" data-grip="sec" title="Move this section (drag, or ↑ ↓)" aria-label="Move ' + esc(RSEC[sid].name) + '">' + svg('grip') + '</button>' +
        (sid === 'profile' ? '' : '<span>' + esc(RSEC[sid].name) + '</span>') + '</div><ul class="rl">' +
        ids.map(id => '<li data-id="' + id + '"><button type="button" class="grip" data-grip="ent" title="Move this line (drag, or ↑ ↓)" aria-label="Move line">' + svg('grip') + '</button>' +
          '<span class="t"' + (rs.edit ? ' contenteditable="true" spellcheck="false"' : '') + '>' + textHTML(id) + '</span><span class="w">' + esc(E[id].w) + '</span>' +
          '<button type="button" class="x" title="Back to the CV (drag off the page, or Delete)" aria-label="Remove line">' + svg('x') + '</button></li>').join('') + '</ul></div>';
    });
    inner.innerHTML = h;
    sheet.classList.toggle('editing', rs.edit);
    sheet.classList.toggle('heat', rs.heat);
  }
  function renderTray() {
    let h = '<div class="tn">' + svg('pubs') + '</div>';
    let any = false;
    D.RSECS.forEach(sec => {
      const off = Object.keys(E).filter(id => E[id].sec === sec.id && rs.on[sec.id].indexOf(id) < 0);
      if (!off.length) return;
      any = true;
      h += '<div class="tg"><div class="tn">' + svg(sec.icon) + '<span>' + esc(sec.name) + '</span></div>' +
        off.map(id => '<button type="button" class="chip" data-id="' + id + '" title="Click or drag onto the page"><span>' + esc(unmd(resolved(id))) + '</span></button>').join('') + '</div>';
    });
    if (!any) h += '<div class="done">' + svg('check') + '</div>';
    tray.innerHTML = h;
  }
  function renderAll() {
    renderSheet(); renderTray();
    $$('#tools [data-target]').forEach(b => b.classList.toggle('on', b.dataset.target === rs.target));
    $('#editBtn').setAttribute('aria-pressed', rs.edit); $('#heatBtn').setAttribute('aria-pressed', rs.heat);
    measure();
  }
  // how full is the page? One page is 11/8.5 of the sheet's width; the bottom margin doesn't count.
  function measure() {
    const W = sheet.clientWidth; if (!W) return;
    const room = W * 11 / 8.5 - W * 0.055;
    const used = inner.offsetTop + inner.offsetHeight;
    sheet.classList.toggle('over', used > room);
    meter.classList.toggle('over', used > room);
    $('i', meter).style.width = Math.min(100, used / room * 100) + '%';
  }
  if (window.ResizeObserver) new ResizeObserver(measure).observe(sheet);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);

  // toolbar
  [['teach', 'teach'], ['research', 'research'], ['outreach', 'outreach']].forEach(([t, ic]) => { icon($('#tools [data-target="' + t + '"]'), ic); });
  $$('#tools [data-target]').forEach(b => b.addEventListener('click', () => applyPreset(b.dataset.target)));
  icon($('#editBtn'), 'pencil'); icon($('#heatBtn'), 'eye'); icon($('#rsReset'), 'reset');
  function toggleEdit() { rs.edit = !rs.edit; renderAll(); }
  function toggleHeat() { rs.heat = !rs.heat; renderAll(); }
  $('#editBtn').addEventListener('click', toggleEdit);
  $('#heatBtn').addEventListener('click', toggleHeat);
  $('#rsReset').addEventListener('click', () => applyPreset(rs.target));

  // click a dotted word to swap it
  inner.addEventListener('click', e => {
    const w = e.target.closest('.sw'); if (w) {
      const key = w.dataset.id + ':' + w.dataset.k, n = E[w.dataset.id].t.match(D.SWAP)[+w.dataset.k].slice(1, -1).split('|').length;
      rs.sw[key] = ((rs.sw[key] || 0) + 1) % n;
      w.textContent = E[w.dataset.id].t.match(D.SWAP)[+w.dataset.k].slice(1, -1).split('|')[rs.sw[key]];
      w.classList.remove('pop'); void w.offsetWidth; w.classList.add('pop');
      renderTray(); measure(); return;
    }
    const x = e.target.closest('.x'); if (x) removeEntry(x.closest('li').dataset.id);
  });
  // typed edits: keep them as markup, so bold and italic survive a re-render
  const toMd = node => Array.from(node.childNodes).map(n =>
    n.nodeType === 3 ? n.nodeValue :
    /^(B|STRONG)$/.test(n.nodeName) ? '**' + toMd(n) + '**' :
    /^(I|EM)$/.test(n.nodeName) ? '*' + toMd(n) + '*' : toMd(n)).join('');
  inner.addEventListener('input', e => {
    const t = e.target.closest('.t'); if (!t) return;
    rs.edited[t.closest('li').dataset.id] = toMd(t).replace(/ /g, ' '); measure();
  });
  inner.addEventListener('focusout', e => { if (e.target.closest && e.target.closest('.t')) renderTray(); });
  inner.addEventListener('keydown', e => {
    if (e.target.closest('.t') && e.key === 'Enter') { e.preventDefault(); e.target.blur(); }
  });
  inner.addEventListener('paste', e => {
    if (!e.target.closest('.t')) return;
    e.preventDefault(); document.execCommand('insertText', false, (e.clipboardData || window.clipboardData).getData('text/plain').replace(/\s+/g, ' '));
  });

  function addEntry(id) { rs.on[E[id].sec].push(id); renderAll(); }
  function removeEntry(id) { const l = rs.on[E[id].sec]; l.splice(l.indexOf(id), 1); renderAll(); }

  /* ---------- dragging: sections, lines, and tray chips ---------- */
  let suppress = false;
  function drag(e, o) {
    if (e.button !== 0) return;
    const r = o.el.getBoundingClientRect(), ox = e.clientX - r.left, oy = e.clientY - r.top, sx = e.clientX, sy = e.clientY;
    let ghost = null, moved = false;
    function move(ev) {
      if (!moved) {
        if (Math.hypot(ev.clientX - sx, ev.clientY - sy) < 5) return;
        moved = true;
        ghost = o.el.cloneNode(true); ghost.classList.add('ghost'); ghost.style.width = r.width + 'px';
        ghost.style.fontSize = getComputedStyle(o.el).fontSize;
        document.body.appendChild(ghost); document.body.classList.add('dragging');
        if (o.start) o.start();
      }
      ghost.style.transform = 'translate(' + (ev.clientX - ox) + 'px,' + (ev.clientY - oy) + 'px)';
      if (o.move) o.move(ev.clientX, ev.clientY, ghost);
    }
    function up(ev) {
      window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up);
      if (ghost) ghost.remove();
      document.body.classList.remove('dragging'); sheet.classList.remove('dropout', 'dropin'); tray.classList.remove('hot');
      if (moved) { suppress = true; setTimeout(() => { suppress = false; }, 0); }
      if (o.end) o.end(ev.type === 'pointercancel' ? null : ev.clientX, ev.clientY, moved);
    }
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
  }
  const inside = (x, y, r) => x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  // put item where the pointer is among its siblings
  function place(parent, item, y, sel) {
    let ref = null;
    for (const s of Array.from(parent.children)) {
      if (s === item || !s.matches(sel)) continue;
      const r = s.getBoundingClientRect();
      if (y < r.top + r.height / 2) { ref = s; break; }
    }
    if (ref !== item.nextElementSibling) parent.insertBefore(item, ref);
  }
  inner.addEventListener('pointerdown', e => {
    const g = e.target.closest('.grip'); if (!g) return;
    const isSec = g.dataset.grip === 'sec', item = g.closest(isSec ? '.rs' : 'li'), parent = item.parentNode;
    e.preventDefault();
    drag(e, {
      el: item,
      start() { item.classList.add('dragging'); },
      move(x, y, ghost) {
        const out = !inside(x, y, sheet.getBoundingClientRect());
        ghost.classList.toggle('out', out && !isSec);
        sheet.classList.toggle('dropout', out && !isSec); tray.classList.toggle('hot', out && !isSec);
        if (!out) place(parent, item, y, isSec ? '.rs' : 'li');
      },
      end(x, y, moved) {
        if (!moved) return renderAll();
        const out = x == null || !inside(x, y, sheet.getBoundingClientRect());
        if (isSec) {
          if (!out) {
            const vis = $$('.rs', inner).map(s => s.dataset.sec), next = vis.slice();
            rs.order.forEach((s, i) => { if (vis.indexOf(s) < 0) next.splice(Math.min(i, next.length), 0, s); });
            rs.order = next;
          }
        } else {
          const sid = item.closest('.rs').dataset.sec, id = item.dataset.id;
          rs.on[sid] = out ? rs.on[sid].filter(k => k !== id) : $$('li', parent).map(l => l.dataset.id);
        }
        renderAll();
      },
    });
  });
  tray.addEventListener('pointerdown', e => {
    const c = e.target.closest('.chip'); if (!c) return;
    drag(e, {
      el: c,
      move(x, y, ghost) { const on = inside(x, y, sheet.getBoundingClientRect()); sheet.classList.toggle('dropin', on); ghost.classList.toggle('out', false); },
      end(x, y, moved) { if (moved && x != null && inside(x, y, sheet.getBoundingClientRect())) addEntry(c.dataset.id); },
    });
  });
  tray.addEventListener('click', e => { const c = e.target.closest('.chip'); if (c && !suppress) addEntry(c.dataset.id); });
  // keys on a handle: ↑ ↓ move it, Delete takes a line off the page
  inner.addEventListener('keydown', e => {
    const g = e.target.closest('.grip'); if (!g) return;
    const isSec = g.dataset.grip === 'sec', item = g.closest(isSec ? '.rs' : 'li');
    const d = e.key === 'ArrowUp' ? -1 : e.key === 'ArrowDown' ? 1 : 0;
    if (!d && !(e.key === 'Delete' || e.key === 'Backspace')) return;
    e.preventDefault();
    if (!d) { if (!isSec) removeEntry(item.dataset.id); return; }
    if (isSec) {
      const vis = $$('.rs', inner).map(s => s.dataset.sec), i = vis.indexOf(item.dataset.sec), j = i + d;
      if (j < 0 || j >= vis.length) return;
      const a = rs.order.indexOf(vis[i]), b = rs.order.indexOf(vis[j]);
      rs.order.splice(a, 1); rs.order.splice(b, 0, vis[i]);
    } else {
      const l = rs.on[item.closest('.rs').dataset.sec], i = l.indexOf(item.dataset.id), j = i + d;
      if (j < 0 || j >= l.length) return;
      l.splice(i, 1); l.splice(j, 0, item.dataset.id);
    }
    renderAll();
    const sel = isSec ? '.rs[data-sec="' + item.dataset.sec + '"] > .rh .grip' : 'li[data-id="' + item.dataset.id + '"] .grip';
    const again = $(sel, inner); if (again) again.focus();
  });

  /* ---------- keys ---------- */
  document.addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const tag = e.target && e.target.tagName;
    if (tag === 'INPUT' || (e.target.isContentEditable)) return;
    if (e.target.closest && e.target.closest('.grip')) return;
    const n = '123'.indexOf(e.key);
    if (n >= 0 && e.key) { show(VIEWS[n]); return; }
    if (view === 'cv') {
      if (e.key === 'ArrowRight') { $('#cvNext').click(); e.preventDefault(); }
      else if (e.key === 'ArrowLeft') { $('#cvPrev').click(); e.preventDefault(); }
      else if (e.key === 'p' || e.key === 'P') toggleCvParts();
    } else if (view === 'parts') {
      if (e.key === 'ArrowRight') stepRow(1); else if (e.key === 'ArrowLeft') stepRow(-1);
    } else if (view === 'resume') {
      if (e.key === 'e' || e.key === 'E') toggleEdit();
      else if (e.key === 'h' || e.key === 'H') toggleHeat();
      else if (e.key === 'r' || e.key === 'R') applyPreset(rs.target);
    }
  });

  /* ---------- start ---------- */
  renderParts();
  applyPreset('teach');
  show(location.hash.slice(1));
  window.addEventListener('hashchange', () => show(location.hash.slice(1)));
})();
