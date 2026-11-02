/* Dice page: a grid of cells you type rolls into, and two test boxes. */
(function () {
  'use strict';
  const D = window.Dice;
  const grid = document.getElementById('grid');
  const addcol = document.getElementById('addcol');
  const addrows = document.getElementById('addrows');
  const outs = { t: document.getElementById('tout'), c: document.getElementById('cout') };

  let rows = 10, cols = 1;
  const cells = [[]];                // cells[col][row]

  function makeCell(c, r) {
    const el = document.createElement('input');
    el.type = 'text';
    el.inputMode = 'numeric';
    el.autocomplete = 'off';
    el.className = 'c' + c;
    el.setAttribute('aria-label', `Die ${c + 1}, roll ${r + 1}`);
    el.addEventListener('input', () => { mark(el); clearOut(); });
    el.addEventListener('keydown', e => {
      const col = cells[c];
      const i = col.indexOf(el);
      if (e.key === 'Enter' || e.key === 'ArrowDown') { e.preventDefault(); (col[i + 1] || el).focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); (col[i - 1] || el).focus(); }
    });
    return el;
  }
  function mark(el) { el.classList.toggle('bad', el.value.trim() !== '' && D.parseRoll(el.value) === null); }

  // Lay the cells out column by column; --rows sets how tall a column is.
  function render() {
    grid.style.setProperty('--rows', rows);
    grid.replaceChildren(...cells.flat());
    addcol.hidden = cols > 1;
  }
  function grow(c, n) { for (let r = cells[c].length; r < n; r++) cells[c].push(makeCell(c, r)); }

  addrows.addEventListener('click', () => {
    rows += 5;
    for (let c = 0; c < cols; c++) grow(c, rows);
    render();
    cells[0][rows - 5].focus();
  });
  addcol.addEventListener('click', () => {
    cols = 2;
    cells.push([]);
    grow(1, rows);
    render();
    clearOut();
    cells[1][0].focus();
  });

  function rolls(c) { return cells[c].map(el => D.parseRoll(el.value)).filter(v => v !== null); }

  const fmt = (x, d) => Number.isFinite(x) ? x.toFixed(d) : '—';
  const fmtP = p => !Number.isFinite(p) ? '= —' : p < 0.001 ? '< 0.001' : '= ' + p.toFixed(3);
  function line(k, v, cls) {
    const rel = /^[=<]/.test(v) ? v : '= ' + v;
    return `<div${cls ? ` class="${cls}"` : ''}><span class="k">${k}</span> ${rel}</div>`;
  }

  function tLines(x) {
    const r = D.tTest(x);
    if (!r) return line('n', 0);
    return line('n', r.n) + line('mean', fmt(r.mean, 2)) + line('t', fmt(r.t, 2)) + line('p-value', fmtP(r.p), 'p');
  }
  function cLines(x) {
    const r = D.chiSq(x);
    if (!r) return line('n', 0);
    return line('n', r.n) + line('χ²', fmt(r.chi2, 2)) + line('p-value', fmtP(r.p), 'p');
  }

  function run(which) {
    const f = which === 't' ? tLines : cLines;
    const out = outs[which];
    out.classList.toggle('two', cols > 1);
    let html = '';
    for (let c = 0; c < cols; c++) html += `<div class="col c${c}">${f(rolls(c))}</div>`;
    out.innerHTML = html;
  }
  function clearOut() { outs.t.replaceChildren(); outs.c.replaceChildren(); }

  document.querySelectorAll('.run').forEach(b => b.addEventListener('click', () => run(b.dataset.test)));

  grow(0, rows);
  render();
})();
