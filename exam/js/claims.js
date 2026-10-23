/* Four explanations to pick from, and the exam questions regrouped by whichever are picked.
 * The page opens on four blank cards. Next build the cards turn into the explanations; click any number of them. Each one
 * is a property of the questions in exam_question_traits.csv:
 *   Ran out of time        position in the exam (early, middle, late)       splits the questions
 *   Not smart              Bloom level (remember, understand, apply, analyze)  splits the questions
 *   Didn't read carefully  a critical word in the question (not, always)     splits the questions
 *   Test too hard         reading level of the question                      splits the questions (7–8th, 9–10th, 11–12th grade)
 *   Skimmed                question length                                   sorts within each group, and halves it short / long
 * Picked ones nest in the order they were picked; a number on the card says where. Luck sits at the right the whole time:
 * the same results dealt at random into the same groups (see rows.js), the gold bar being the real gap.
 */
(function () {
  'use strict';
  const D = Deck, M = Model, Q = EXAM.q, NQ = Q.length;

  const THIRDS = M.thirds(NQ);
  const BLOOM = ['Remember', 'Understand', 'Apply', 'Analyze'];
  /* of(j): which group question j falls in, as a number. label(g): its name. */
  const SPLIT = {
    time: { of: (j) => THIRDS.findIndex((t) => j >= t.a && j < t.b), label: (g) => ['Early', 'Middle', 'Late'][g] },
    smart: { of: (j) => BLOOM.indexOf(Q[j].bloom), label: (g) => BLOOM[g] },
    hard: { of: (j) => Q[j].rl <= 8 ? 0 : Q[j].rl <= 10 ? 1 : 2, label: (g) => ['7–8th grade', '9–10th', '11–12th'][g] },
    care: { of: (j) => Q[j].crit ? 1 : 0, label: (g) => g ? 'not · always' : 'Plain' }
  };
  const EXPL = [
    { k: 'time', t: 'Ran out of time' },
    { k: 'smart', t: 'Not smart' },
    { k: 'care', t: 'Didn’t read carefully' },
    { k: 'hard', t: 'Test too hard' },
    { k: 'skim', t: 'Skimmed' }
  ];
  const GAPS = [30, 16, 10], GAP_HALF = 5;      // space before a new group, by the level where it begins

  /* The order, groups and labels the columns take for a list of picked explanations. */
  function nestFor(sel) {
    const cats = sel.filter((k) => SPLIT[k]), skim = sel.includes('skim');
    const idx = Q.map((x, i) => i);
    const key = idx.map((j) => cats.map((k) => SPLIT[k].of(j)));
    idx.sort((a, b) => {
      for (let i = 0; i < cats.length; i++) if (key[a][i] !== key[b][i]) return key[a][i] - key[b][i];
      return (skim ? Q[a].words - Q[b].words : 0) || a - b;
    });
    const path = idx.map((j) => key[j].slice());
    if (skim) {                       // the shorter half of each group, then the longer half
      for (let a = 0, s = 1; s <= NQ; s++) {
        if (s < NQ && path[s].join() === path[a].join()) continue;
        const half = Math.ceil((s - a) / 2);
        for (let i = a; i < s; i++) path[i].push(i - a < half ? 0 : 1);
        a = s;
      }
    }
    const depth = cats.length + (skim ? 1 : 0);
    const differs = (s) => { let l = 0; while (l < depth && path[s][l] === path[s - 1][l]) l++; return l; };
    const gaps = idx.map((j, s) => {
      if (!s) return 0;
      const l = differs(s);
      return l >= depth ? 0 : (skim && l === cats.length ? GAP_HALF : GAPS[l]);
    });
    const runs = (levels) => {        // consecutive slots that share the first `levels` entries of their path
      const out = [];
      for (let a = 0, s = 1; s <= NQ; s++) {
        if (s < NQ && path[s].slice(0, levels).join() === path[a].slice(0, levels).join()) continue;
        out.push({ a, b: s, path: path[a] }); a = s;
      }
      return out;
    };
    const levels = cats.map((k, l) => runs(l + 1).map((r) => ({ a: r.a, b: r.b, label: SPLIT[k].label(r.path[l]) })));
    return { order: idx, leaves: runs(depth).map((r) => ({ a: r.a, b: r.b })), gaps, levels };
  }
  D.nestFor = nestFor;

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

  /* host: the page. rows: a Rows. bench: { x, ty, rx } placement of the cards and the dice. */
  D.Claims = function (host, rows, bench) {
    const S = () => D.get('claims', () => ({ typed: ['', '', '', '', ''], sel: [] }));
    const board = D.el('div', 'board', host);
    board.style.cssText = 'left:' + bench.x + 'px;top:' + bench.ty + 'px';
    const dealc = D.dealTools(host, rows, 'right:' + bench.rx + 'px;top:' + bench.dy + 'px');
    let revealed = false;

    function view() {
      const sel = S().sel, nest = nestFor(sel);
      rows.set({
        layout: 'nest', nest, lens: sel.includes('skim'), pct: nest.leaves.length > 1, luck: true, head: false, caps: false,
        thirds: false, cls: false, ring: false, scores: false
      });
    }
    function toggle(k) {
      const s = S(), i = s.sel.indexOf(k);
      if (i < 0) s.sel.push(k); else s.sel.splice(i, 1);
      renderBoard(); view(); D.save();
    }
    function renderBoard(flip) {
      const s = S();
      board.innerHTML = '';
      EXPL.forEach((x, i) => {
        const on = revealed && s.sel.includes(x.k);
        const e = D.el('div', 'card' + (revealed ? ' ex' : '') + (on ? ' on' : '') + (flip ? ' flip' : ''), board);
        const tx = D.el('div', 'tx', e);
        if (revealed) {
          tx.textContent = x.t;
          if (on) D.el('b', 'ord', e, String(s.sel.indexOf(x.k) + 1));
          e.tabIndex = 0; e.setAttribute('role', 'button'); e.setAttribute('aria-pressed', String(on));
          e.addEventListener('click', () => toggle(x.k));
          e.addEventListener('keydown', (ev) => { if (ev.key === ' ' || ev.key === 'Enter') { ev.preventDefault(); ev.stopPropagation(); toggle(x.k); } });
          return;
        }
        tx.contentEditable = 'true'; tx.spellcheck = false; tx.setAttribute('role', 'textbox'); tx.setAttribute('aria-label', 'Explanation');
        tx.textContent = s.typed[i];
        tx.addEventListener('input', () => { s.typed[i] = tx.textContent.slice(0, 70); D.save(); });
        tx.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === 'Escape') { ev.preventDefault(); tx.blur(); } ev.stopPropagation(); });
        tx.addEventListener('paste', (ev) => { ev.preventDefault(); document.execCommand('insertText', false, (ev.clipboardData.getData('text') || '').replace(/\s+/g, ' ')); });
      });
    }

    renderBoard();
    return {
      /* b: 0 four blank cards, 1 the explanations, the columns and luck */
      show(b, how) {
        const was = revealed;
        revealed = b >= 1;
        host.classList.toggle('bench-on', revealed);
        dealc.classList.toggle('on', revealed);
        renderBoard(revealed && !was && how === 'step');
        if (revealed) view(); else if (rows.dealt) rows.real();
      },
      key(e) {
        if (!revealed) return false;
        if (e.key.toLowerCase() === 'd') { rows.deal(e.shiftKey ? 100 : 1); return true; }
        const i = '12345'.indexOf(e.key);
        if (i >= 0 && e.key.length === 1) { toggle(EXPL[i].k); return true; }
        return false;
      },
      reset() { revealed = false; host.classList.remove('bench-on'); dealc.classList.remove('on'); renderBoard(); rows.clearDraws(); }
    };
  };
})();
