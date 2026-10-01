/* Prediction before the reveal: two to four sketches, tally hands under
 * each (click, or press 1–4; shift takes one back). Other parts can ask
 * which one the room picked with Deck.picked(id). */
(function () {
  'use strict';
  const D = window.Deck;

  D.picked = function (id) {
    const s = D.peek('pick-' + id);
    if (!s) return null;
    const top = Math.max(...s.votes);
    return top > 0 ? s.votes.indexOf(top) : null;
  };

  D.parts.picker = function (def, host) {
    const n = def.options.length;
    const st = () => D.get('pick-' + def.id, () => ({ votes: def.options.map(() => 0) }));
    const row = D.el('div', 'pick', host);
    const cols = def.options.map((o, i) => {
      const c = D.el('button', 'pick-opt', row);
      c.type = 'button';
      c.innerHTML = `<svg viewBox="0 0 300 200" class="sketch">${D.sketches[o.sketch] ? D.sketches[o.sketch]() : ''}</svg>` +
        `<b>${D.esc(o.key)}</b><div class="pick-dots"></div><span class="pick-n"></span>`;
      c.addEventListener('click', (e) => { c.blur(); bump(i, e.shiftKey ? -1 : 1); });
      c.addEventListener('contextmenu', (e) => { e.preventDefault(); bump(i, -1); });
      return c;
    });
    function bump(i, d) {
      const v = st().votes;
      v[i] = Math.max(0, v[i] + d);
      D.save(); draw();
    }
    function draw() {
      const v = st().votes, top = Math.max(...v);
      cols.forEach((c, i) => {
        c.querySelector('.pick-dots').innerHTML = '<i></i>'.repeat(Math.min(v[i], 40));
        c.querySelector('.pick-n').textContent = v[i] ? String(v[i]) : '';
        c.classList.toggle('lead', top > 0 && v[i] === top);
      });
    }
    draw();
    return {
      show() { draw(); },
      digit(k, shift) { if (k >= 1 && k <= n) bump(k - 1, shift ? -1 : 1); },
      reset() { draw(); }
    };
  };
})();
