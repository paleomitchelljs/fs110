/* Your own website: seven steps, each a gif and the same clicks in words. Steps live in steps.js.
 * Remembers (in this browser only) the username, Windows or Mac, and which steps are ticked. ← → step through. */
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

  const S = {
    user: store.get('user', ''),
    os: store.get('os', guessOS()),
    done: store.get('done', {}),
    i: Math.max(0, D.STEPS.findIndex(s => '#' + s.id === location.hash)),
  };

  /* **bold**, `code`, [words](url), after the names are filled in */
  function md(text) {
    return esc(D.fill(text, S.user))
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  }
  const list = (el, items) => { el.innerHTML = (items || []).map(x => '<li>' + md(D.pick(x, S.os)) + '</li>').join(''); };

  /* ---------- the step buttons ---------- */
  function buildNav() {
    const parts = [];
    D.STEPS.forEach((s, i) => {
      let g = parts[parts.length - 1];
      if (!g || g.name !== s.part) parts.push(g = { name: s.part, items: [] });
      g.items.push('<button type="button" data-i="' + i + '"><span class="n">' + (i + 1) + '</span><span>' + esc(s.title) + '</span></button>');
    });
    $('#steps').innerHTML = parts.map(g => '<div class="grp"><span>' + esc(g.name) + '</span><div class="row">' + g.items.join('') + '</div></div>').join('<i class="sep"></i>');
    $$('#steps button').forEach(b => b.addEventListener('click', () => go(+b.dataset.i)));
  }
  function paintNav() {
    $$('#steps button').forEach(b => {
      const s = D.STEPS[+b.dataset.i];
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
    const s = D.STEPS[S.i];
    $('#title').innerHTML = '<span class="k">Step ' + (S.i + 1) + ' of ' + D.STEPS.length + ' ·</span> ' + esc(s.title);
    $('#word').innerHTML = md(s.word);
    list($('#pre'), s.pre);
    list($('#lines'), D.pick(s.lines, S.os));
    $('#after').innerHTML = s.after ? md(s.after) : '';
    $('#stucklist').innerHTML = s.stuck.map(x => { const [q, a] = D.pick(x, S.os); return '<dt>' + md(q) + '</dt><dd>' + md(D.pick(a, S.os)) + '</dd>'; }).join('');
    $('#stuck').open = false;
    const src = D.gifFor(s, S.os);
    const img = $('#gif');
    if (img.getAttribute('src') !== src) img.src = src;
    img.alt = 'A short video of step ' + (S.i + 1) + ': ' + s.title + '.';
    $('#prev').disabled = S.i === 0;
    $('#next').disabled = S.i === D.STEPS.length - 1;
    const d = !!S.done[s.id];
    $('#done').setAttribute('aria-pressed', String(d));
    $('#done').textContent = d ? '✓ Done' : '✓ I did this';
    paintNav();
  }
  function go(i) {
    S.i = Math.max(0, Math.min(D.STEPS.length - 1, i));
    history.replaceState(null, '', '#' + D.STEPS[S.i].id);
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
  $('#copy').addEventListener('click', () => {
    const b = $('#copy'), text = D.siteFor(S.user);
    const ok = () => { b.textContent = 'Copied'; setTimeout(() => { b.textContent = 'Copy'; }, 1500); };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(ok, () => {}); else ok();
  });

  /* ---------- buttons, keys ---------- */
  $('#prev').addEventListener('click', () => go(S.i - 1));
  $('#next').addEventListener('click', () => go(S.i + 1));
  $('#done').addEventListener('click', () => {
    const id = D.STEPS[S.i].id;
    S.done[id] = !S.done[id];
    store.set('done', S.done);
    render();
    if (S.done[id] && S.i < D.STEPS.length - 1) setTimeout(() => go(S.i + 1), 350);
  });
  $('#replay').addEventListener('click', () => playGif($('#gif'), D.gifFor(D.STEPS[S.i], S.os)));
  const big = $('#big');
  function openBig() { big.showModal(); playGif($('#biggif'), D.gifFor(D.STEPS[S.i], S.os)); }
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
    const i = D.STEPS.findIndex(s => '#' + s.id === location.hash);
    if (i >= 0 && i !== S.i) go(i);
  });

  buildNav();
  paintWho();
  render();
})();
