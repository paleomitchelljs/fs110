/* Your own website: a path of steps, each a gif with one short bullet per numbered caption. Steps and paths live in steps.js.
 * The path is how the student got the notes (forked, downloaded the ZIP, cloned). Remembers (in this browser only) the path,
 * the username, Windows or Mac, and which steps are ticked. ← → step through; #zip/upload links to one step of one path. */
(function () {
  'use strict';
  const D = window.WebsiteSteps;
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));
  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const store = {
    get(k, d) { try { const v = localStorage.getItem('website.' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('website.' + k, JSON.stringify(v)); } catch (e) { /* private window: fine */ } },
  };
  const guessOS = () => /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent) ? 'mac' : 'win';
  const pathById = id => D.PATHS.find(p => p.id === id);

  const S = {
    path: pathById(store.get('path', '')) || D.PATHS[0],
    user: store.get('user', ''),
    os: store.get('os', guessOS()),
    done: store.get('done', {}),
    i: 0,
  };
  const steps = () => D.stepsOf(S.path);

  /* #zip/upload, or #upload alone (on the path already chosen, else the first path that has it) */
  function fromHash() {
    const [a, b] = location.hash.slice(1).split('/');
    const p = b ? pathById(a) : D.stepsOf(S.path).some(s => s.id === a) ? S.path : D.PATHS.find(x => D.stepsOf(x).some(s => s.id === a));
    if (!p) return false;
    const i = D.stepsOf(p).findIndex(s => s.id === (b || a));
    if (i < 0) return false;
    S.path = p; S.i = i; store.set('path', p.id);
    return true;
  }

  /* **bold**, *italic*, [words](url), [[copyable]], after the names are filled in */
  function md(text) {
    return esc(D.fill(text, S.user))
      .replace(/\[\[([^\]]+)\]\]/g, '<span class="cp"><code>$1</code><button type="button" class="small" data-copy="$1">Copy</button></span>')
      .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
      .replace(/\*(.+?)\*/g, '<i>$1</i>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, words, url) => '<a href="' + url + '"' + (url[0] === '#' ? '' : ' target="_blank" rel="noopener"') + '>' + words + '</a>');
  }
  const list = (el, items) => { el.innerHTML = (items || []).map(x => '<li>' + md(D.pick(x, S.os)) + '</li>').join(''); };
  function copy(b, text) {
    const label = b.textContent;
    const ok = () => { b.textContent = 'Copied'; setTimeout(() => { b.textContent = label; }, 1500); };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(ok, () => {}); else ok();
  }

  /* ---------- the path and its step buttons ---------- */
  function buildPaths() {
    $('#paths').innerHTML = D.PATHS.map(p => '<button type="button" data-path="' + p.id + '">' + esc(p.label) + '</button>').join('');
    $$('#paths button').forEach(b => b.addEventListener('click', () => {
      if (b.dataset.path === S.path.id) return;
      const was = steps()[S.i].id;
      S.path = pathById(b.dataset.path); store.set('path', S.path.id);
      buildNav();
      go(Math.max(0, steps().findIndex(s => s.id === was)));
    }));
  }
  function buildNav() {
    let n = 0;
    $('#steps').innerHTML = S.path.groups.map(ids => '<div class="row">' +
      ids.map(id => { const s = D.STEPS.find(x => x.id === id), i = n++; return '<button type="button" data-i="' + i + '"><span class="n">' + (i + 1) + '</span><span>' + esc(s.title) + '</span></button>'; }).join('') +
      '</div>').join('<i class="sep"></i>');
    $$('#steps button').forEach(b => b.addEventListener('click', () => go(+b.dataset.i)));
    $$('#paths button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.path === S.path.id)));
  }
  function paintNav() {
    $$('#steps button').forEach(b => {
      const s = steps()[+b.dataset.i];
      b.classList.toggle('ok', !!S.done[s.id]);
      if (+b.dataset.i === S.i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
      b.title = S.done[s.id] ? 'Done' : '';
    });
  }

  /* ---------- one step ---------- */
  function playGif(img, src) {
    // setting the same src again doesn't restart a gif; clearing it first does
    img.removeAttribute('src');
    requestAnimationFrame(() => { img.src = src; });
  }
  function render() {
    const all = steps(), s = all[S.i];
    $('#title').innerHTML = '<span class="k">' + (S.i + 1) + '</span>' + esc(s.title);
    const link = $('#link');
    link.textContent = s.link ? s.link[0] + ' ↗' : '';
    if (s.link) link.href = D.fill(s.link[1], S.user); else link.removeAttribute('href');
    list($('#pre'), s.pre);
    list($('#lines'), D.pick(s.lines, S.os));
    $('#stucklist').innerHTML = s.help.map(x => { const [q, a] = D.pick(x, S.os); return '<div><dt>' + md(q) + '</dt><dd>' + md(D.pick(a, S.os)) + '</dd></div>'; }).join('');
    $('#stuck').open = false;
    const src = D.gifFor(s, S.os);
    const img = $('#gif');
    if (img.getAttribute('src') !== src) img.src = src;
    img.alt = 'Video: ' + D.pick(s.lines, S.os).map(l => D.fill(D.pick(l, S.os), S.user).replace(/\*|\[\[|\]\]/g, '')).join('. ');
    $('#prev').disabled = S.i === 0;
    $('#next').disabled = S.i === all.length - 1;
    const d = !!S.done[s.id];
    $('#done').setAttribute('aria-pressed', String(d));
    $('#done').textContent = d ? '✓ Done' : 'Done';
    paintNav();
  }
  function go(i) {
    S.i = Math.max(0, Math.min(steps().length - 1, i));
    history.replaceState(null, '', '#' + S.path.id + '/' + steps()[S.i].id);
    render();
    if (window.scrollY > $('#steps').offsetTop) $('#steps').scrollIntoView({ block: 'start' });
  }

  /* ---------- who and which computer ---------- */
  function paintWho() {
    const site = $('#site');
    site.textContent = D.siteFor(S.user);
    site.classList.toggle('ph', !S.user);
    $$('.os button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.os === S.os)));
  }
  const userIn = $('#user');
  userIn.value = S.user;
  userIn.addEventListener('input', () => {
    const raw = userIn.value.trim();
    S.user = D.cleanUser(raw);
    const bad = raw !== '' && !S.user;
    userIn.classList.toggle('bad', bad);
    $('#userwarn').hidden = !bad;
    store.set('user', S.user);
    paintWho(); render();
  });
  $$('.os button').forEach(b => b.addEventListener('click', () => {
    S.os = b.dataset.os; store.set('os', S.os); paintWho(); render();
  }));
  $('#copy').addEventListener('click', () => copy($('#copy'), D.siteFor(S.user)));
  $('#step').addEventListener('click', e => { const b = e.target.closest('[data-copy]'); if (b) copy(b, b.dataset.copy); });

  /* ---------- buttons, keys ---------- */
  $('#prev').addEventListener('click', () => go(S.i - 1));
  $('#next').addEventListener('click', () => go(S.i + 1));
  $('#done').addEventListener('click', () => {
    const id = steps()[S.i].id;
    S.done[id] = !S.done[id];
    store.set('done', S.done);
    render();
    if (S.done[id] && S.i < steps().length - 1) setTimeout(() => go(S.i + 1), 350);
  });
  const gifNow = () => D.gifFor(steps()[S.i], S.os);
  $('#replay').addEventListener('click', () => playGif($('#gif'), gifNow()));
  const big = $('#big');
  function openBig() { big.showModal(); playGif($('#biggif'), gifNow()); }
  $('#bigger').addEventListener('click', openBig);
  $('#gif').addEventListener('click', openBig);
  $('#close').addEventListener('click', () => big.close());
  big.addEventListener('click', e => { if (e.target === big) big.close(); });
  document.addEventListener('keydown', e => {
    if (e.target.closest('input') || big.open || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === 'ArrowRight') go(S.i + 1);
    else if (e.key === 'ArrowLeft') go(S.i - 1);
  });
  window.addEventListener('hashchange', () => {
    const was = S.path;
    if (!fromHash()) return;
    if (S.path !== was) buildNav();
    go(S.i);
  });

  fromHash();
  buildPaths();
  buildNav();
  paintWho();
  render();
})();
