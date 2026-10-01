/* Lists that fill from the room. Items are preloaded and hidden; when a
 * student says one, tap its numbered slot (or press its number) and it drops
 * in, in whatever order the room produces them. N types in one that isn't
 * preloaded. Shift-click an item (or shift + its number) to take it back. */
(function () {
  'use strict';
  const D = window.Deck;

  /* The list itself, shared with the funnel. Entries are preloaded indices
   * (numbers) or typed text (strings), in the order they were added. */
  D.listModel = function (id, items) {
    const st = () => D.get('list-' + id, () => ({ shown: [] }));
    return {
      items,
      shown: () => st().shown,
      has: (i) => st().shown.includes(i),
      text: (en) => typeof en === 'number' ? items[en] : en,
      reveal(i) {
        if (i < 0 || i >= items.length || this.has(i)) return false;
        st().shown.push(i); D.save(); return true;
      },
      remove(en) {
        const a = st().shown, k = a.indexOf(en);
        if (k < 0) return false;
        a.splice(k, 1); D.save(); return true;
      },
      add(text) { st().shown.push(String(text)); D.save(); }
    };
  };

  /* The numbered slots and the + button, plus the typing box. */
  D.listReserve = function (m, parent, onChange) {
    const strip = D.el('div', 'rl-reserve', parent);
    let input = null;
    function draw() {
      strip.innerHTML = '';
      m.items.forEach((t, i) => {
        if (m.has(i)) return;
        const s = D.el('button', 'rl-slot', strip, String(i + 1));
        s.type = 'button'; s.title = 'Reveal (' + (i + 1) + ')';
        s.addEventListener('click', () => { s.blur(); if (m.reveal(i)) onChange(i); });
      });
      const plus = D.el('button', 'rl-slot rl-plus', strip, '+');
      plus.type = 'button'; plus.title = 'Type one in (N)';
      plus.addEventListener('click', () => { plus.blur(); type(); });
    }
    function type() {
      if (input) { input.focus(); return; }
      input = D.el('input', 'rl-input', parent);
      input.type = 'text'; input.maxLength = 40; input.setAttribute('aria-label', 'New item');
      const done = (keep) => {
        if (!input) return;
        const v = input.value.trim(), e = input;
        input = null; e.remove();
        if (keep && v) { m.add(v); onChange(v); }
      };
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); done(true); }
        else if (e.key === 'Escape') { e.preventDefault(); done(false); }
        e.stopPropagation();
      });
      input.addEventListener('blur', () => done(true));
      setTimeout(() => input && input.focus(), 0);
    }
    draw();
    return { draw, type, close() { if (input) input.blur(); } };
  };

  D.parts.roomlist = function (def, host) {
    const m = D.listModel(def.id, def.items);
    const list = D.el('div', 'rl-list', host);
    const reserve = D.listReserve(m, host, (en) => draw(en));
    function draw(fresh) {
      list.innerHTML = '';
      m.shown().forEach((en) => {
        const chip = D.el('button', 'rl-chip' + (en === fresh ? ' play' : ''), list, D.md(m.text(en)));
        chip.type = 'button'; chip.title = 'Shift-click to take back';
        const back = (e) => { e.preventDefault(); if (m.remove(en)) draw(); };
        chip.addEventListener('click', (e) => { chip.blur(); if (e.shiftKey) back(e); });
        chip.addEventListener('contextmenu', back);
      });
      reserve.draw();
    }
    draw();
    return {
      show() { draw(); },
      hide() { reserve.close(); },
      digit(n, shift) {
        if (n < 1) return;
        if (shift) { if (m.remove(n - 1)) draw(); }
        else if (m.reveal(n - 1)) draw(n - 1);
      },
      add() { reserve.type(); },
      reset() { draw(); }
    };
  };
})();
