/* Claim cards you type into, and a bench of tests to hold them up against.
 * Type a claim. Words in it attach a test (TESTS below); the test's icon lights in the toolbar and the bench changes to match.
 * Click another icon to attach a different test by hand. A card is kept, left unsure, or struck out with the three marks.
 * Each test is one view of the same four rows of columns, or the model curve:
 *   time, method   the curve                              late     exam order in thirds, percent right per third
 *   hard           hardest first, with the class row      luck     dealt at random into chapter slots, with the dot plots
 *   chapter        grouped by chapter, percent right      other    nothing in these columns can test it
 */
(function () {
  'use strict';
  const D = Deck;

  /* The words that trigger each test. The test with the most hits wins; a tie goes to the one listed first. */
  const TESTS = [
    { k: 'late', re: /\b(late|end|tired|fatigue|exhaust|rush|run(?:ning)? out|ran out|anxi|nervous|panic|stress|clock|pressure|time limit|slow)/gi },
    { k: 'chapter', re: /\b(chapter|unit|topic|section|early|first|beginning|forgot|forget|review|notes?|middle|skipp?|miss(?:ed)?|recent|last|week|lecture|material|content|cover|ignored|old)/gi },
    { k: 'hard', re: /\b(hard|difficult|tough|trick|unfair|confus|ambigu|bad question|wording|impossible)/gi },
    { k: 'luck', re: /\b(luck|random|guess|chance|fluke|coin|slip|careless|silly|mistake|misread|noise|accident)/gi },
    { k: 'method', re: /\b(method|technique|strateg|wrong way|how (?:they|you|we) stud|re-?read|highlight|flash ?card|passive|practice|marathon|weights?|cram|memoriz)/gi },
    { k: 'time', re: /\b(time|hours|enough|lazy|procrastinat|effort|work(?:ed)? hard|study(?:ing)? more|didn.?t study|under-?prepared)/gi },
    { k: 'other', re: /\b(interest|bor(?:ed|ing)|care|motivat|attend|absent|sleep|job|family|health|sick|ill|personal|phone|distract|cheat|prior|background|anxiety)/gi }
  ];
  const pick = (text) => {
    let best = null, n = 0;
    TESTS.forEach((t) => { const c = (text.match(t.re) || []).length; if (c > n) { n = c; best = t.k; } });
    return best;
  };
  D.pickTest = pick;
  D.TESTS = TESTS;

  /* What each claim says the columns should look like: 21 columns, 7 of them wrong, the same share as the students. */
  const SCATTER = [1, 4, 8, 11, 14, 17, 19];
  const PREDICT = {
    time: { red: SCATTER }, method: { red: SCATTER }, luck: { red: SCATTER },
    hard: { red: [0, 1, 2, 3, 4, 5, 6] },
    late: { red: [14, 15, 16, 17, 18, 19, 20] },
    chapter: { red: [7, 8, 9, 10, 11, 12, 13], gaps: [7, 14] }
  };
  const strip = (k) => {
    const p = PREDICT[k];
    if (!p) return '<span class="none"></span>';
    let h = '';
    for (let i = 0; i < 21; i++) h += '<i class="' + (p.red.includes(i) ? 'no' : 'ok') + (p.gaps && p.gaps.includes(i) ? ' g' : '') + '"></i>';
    return h;
  };

  const VIEW = {
    time: 'model', method: 'model',
    late: { layout: 'exam', thirds: true, pct: true },
    hard: { layout: 'hard', cls: true, pct: true },
    luck: { layout: 'chapter', head: true, pct: true, luck: true },
    chapter: { layout: 'chapter', head: true, caps: true, pct: true },
    other: { layout: 'exam', other: true }
  };
  const PLAIN = { layout: 'exam', thirds: false, caps: false, pct: false, cls: false, luck: false, head: false };

  const DEFAULT = () => ({
    cards: [{ t: 'Didn’t study enough' }, { t: 'The exam was hard' }, { t: 'Bad luck' }, { t: 'Ran out of time' }].map((c) => ({ t: c.t, test: pick(c.t), by: 'auto', v: null })),
    active: 0
  });
  const MAX = 5;

  /* The three dice buttons. css places the strip. */
  D.dealTools = function (host, rows, css) {
    const el = D.el('div', 'tools deal', host);
    el.style.cssText = css;
    [['deal1', 'Deal once (D)', () => rows.deal(1)], ['deal100', 'Deal 100 times (shift D)', () => rows.deal(100)], ['real', 'Back to the real results', () => { rows.real(); rows.clearDraws(); }]].forEach(([n, title, f]) => {
      const b = D.el('button', 'tool', el, D.icons[n]); b.type = 'button'; b.title = title; b.setAttribute('aria-label', title);
      b.addEventListener('click', f);
    });
    return el;
  };

  /* host: the page. rows: a Rows. chart: a Chart (its element is shown for time and method). */
  D.Claims = function (host, rows, chart, bench) {
    const S = () => D.get('claims', DEFAULT);
    const board = D.el('div', 'board', host);
    const tools = D.el('div', 'tools', host);
    const nodata = D.el('div', 'nodata', host, D.icons.other);
    tools.style.cssText = 'left:' + bench.x + 'px;top:' + bench.ty + 'px';
    const dealc = D.dealTools(host, rows, 'right:' + bench.rx + 'px;top:' + bench.ty + 'px');
    nodata.style.cssText = 'left:' + (bench.x + 380) + 'px;top:' + (bench.y + 20) + 'px';
    let showBench = false, showStrips = false;

    const tbtn = {};
    TESTS.forEach((t) => {
      const b = D.el('button', 'tool', tools, D.icons[t.k]);
      b.type = 'button'; b.dataset.k = t.k; b.title = ({ time: 'Not enough time', method: 'Wrong method', late: 'Late in the exam', hard: 'Hard questions', luck: 'Luck', chapter: 'A chapter', other: 'Not in these columns' })[t.k];
      b.setAttribute('aria-label', b.title);
      tools.appendChild(b); tbtn[t.k] = b;
      b.addEventListener('click', () => {
        const s = S(), c = s.cards[s.active];
        if (c) { c.test = c.test === t.k ? null : t.k; c.by = 'manual'; renderBoard(); D.save(); }
        else view(t.k);
        if (c) view(c.test);
      });
    });
    let cur = null;      // the test now on the bench
    function view(k) {
      cur = k;
      Object.keys(tbtn).forEach((x) => tbtn[x].classList.toggle('on', x === k));
      const v = k ? VIEW[k] : null;
      const model = v === 'model';
      chart.el.classList.toggle('on', showBench && model);
      rowsOn(showBench && !model);
      const rv = (v && !model) ? v : {};
      rows.set(Object.assign({}, PLAIN, { scores: false }, rv));
      host.classList.toggle('luck', !!(v && v.luck));
      dealc.classList.toggle('on', showBench && !!(v && !model && (v.luck || v.layout === 'chapter')));
      nodata.classList.toggle('on', showBench && k === 'other');
      if (k !== 'luck' && k !== 'chapter') { if (rows.dealt) rows.real(); }
    }
    const rowsOn = (on) => host.classList.toggle('rowsoff', !on);

    function renderBoard() {
      const s = S();
      board.innerHTML = '';
      s.cards.forEach((c, i) => {
        const e = D.el('div', 'card' + (i === s.active ? ' on' : '') + (c.v ? ' ' + c.v : ''), board);
        e.innerHTML = '<div class="tx" contenteditable="true" spellcheck="false" role="textbox" aria-label="Claim"></div>' +
          '<div class="cf"><span class="tic">' + (c.test ? D.icons[c.test] : '') + '</span><span class="strip">' + (showStrips ? strip(c.test) : '') + '</span>' +
          '<span class="vs"><button type="button" data-v="keep" title="Holds up">' + D.icons.keep + '</button><button type="button" data-v="maybe" title="Unclear">' + D.icons.maybe + '</button><button type="button" data-v="out" title="Doesn’t hold up">' + D.icons.x + '</button></span></div>' +
          '<button type="button" class="del" title="Remove" aria-label="Remove">' + D.icons.x + '</button>';
        const tx = e.querySelector('.tx');
        tx.textContent = c.t;
        tx.addEventListener('focus', () => select(i));
        tx.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') { ev.preventDefault(); tx.blur(); } else if (ev.key === 'Escape') tx.blur(); ev.stopPropagation(); });
        tx.addEventListener('paste', (ev) => { ev.preventDefault(); document.execCommand('insertText', false, (ev.clipboardData.getData('text') || '').replace(/\s+/g, ' ')); });
        tx.addEventListener('input', () => {
          c.t = tx.textContent.slice(0, 70);
          if (c.by === 'auto') { c.test = pick(c.t); e.querySelector('.tic').innerHTML = c.test ? D.icons[c.test] : ''; e.querySelector('.strip').innerHTML = showStrips ? strip(c.test) : ''; }
          if (i === S().active) view(c.test);
          D.save();
        });
        e.addEventListener('pointerdown', (ev) => { if (!ev.target.closest('button') && ev.target !== tx) { select(i); } });
        e.querySelectorAll('.vs button').forEach((b) => b.addEventListener('click', () => { c.v = c.v === b.dataset.v ? null : b.dataset.v; renderBoard(); D.save(); }));
        e.querySelector('.del').addEventListener('click', () => { s.cards.splice(i, 1); s.active = Math.min(s.active, s.cards.length - 1); renderBoard(); view(s.cards[s.active] ? s.cards[s.active].test : null); D.save(); });
      });
      if (s.cards.length < MAX) {
        const a = D.el('button', 'card add', board, D.icons.plus); a.type = 'button'; a.title = 'New claim'; a.setAttribute('aria-label', 'New claim');
        a.addEventListener('click', () => {
          s.cards.push({ t: '', test: null, by: 'auto', v: null }); s.active = s.cards.length - 1; renderBoard(); view(null);
          board.querySelectorAll('.tx')[s.active].focus(); D.save();
        });
      }
    }
    function select(i) {
      const s = S();
      if (s.active === i && cur === (s.cards[i] && s.cards[i].test)) return;
      s.active = i;
      board.querySelectorAll('.card').forEach((e, j) => e.classList.toggle('on', j === i));
      view(s.cards[i] ? s.cards[i].test : null);
      D.save();
    }

    renderBoard();
    return {
      /* b: 0 cards only, 1 + what each would look like, 2 + the bench */
      show(b) {
        showStrips = b >= 1; showBench = b >= 2;
        host.classList.toggle('bench-on', showBench);
        renderBoard();
        const c = S().cards[S().active];
        view(c ? c.test : null);
      },
      key(e) {
        if (!showBench) return false;
        if (e.key.toLowerCase() === 'd') { rows.deal(e.shiftKey ? 100 : 1); return true; }
        return false;
      },
      reset() { renderBoard(); rows.clearDraws(); view(null); }
    };
  };
})();
