/* Evidence cards. The small card is what you drag and sort. Turning one over
 * opens it big in the middle of the stage, so the back reads from the back row.
 * Backs only turn over with the answers shown (P). */
(function () {
  'use strict';
  const D = window.Deck;
  const FLIP = '<svg viewBox="0 0 24 24"><path d="M4.5 10a8 8 0 0 1 14.2-3.6M19.5 14a8 8 0 0 1-14.2 3.6"/><path d="M19 3v4h-4M5 21v-4h4"/></svg>';

  const front = (c) => (c.img ? `<img src="${D.esc(c.img)}" alt="">` : '') +
    `<b>${D.md(c.text)}</b>` + (c.sub ? `<small>${D.md(c.sub)}</small>` : '');

  /* labels: the two hypotheses, in the order of c.back. */
  D.card = function (c, labels, parent) {
    const e = D.el('div', 'card', parent);
    e.dataset.id = c.id;
    e.innerHTML = `<div class="card-face">${front(c)}</div>` +
      `<button type="button" class="card-flip ans-only" title="Turn over (F)" aria-label="Turn over">${FLIP}</button>`;
    e.querySelector('.card-flip').addEventListener('click', (ev) => { ev.stopPropagation(); D.focus(c, labels, true); });
    e.addEventListener('dblclick', () => D.focus(c, labels, false));
    return e;
  };

  let open = null;
  function close() {
    if (!open) return;
    const layer = open.layer;
    open = null;
    layer.classList.remove('in');
    setTimeout(() => layer.remove(), 250);
  }
  D.focus = function (c, labels, flipped) {
    close();
    const layer = D.el('div', 'focus', D.stage);
    const big = D.el('div', 'big', layer);
    big.innerHTML = `<div class="big-in"><div class="big-face">${front(c)}</div><div class="big-back">` +
      (c.back || []).map((t, i) => `<p class="side-${i}"><span>${D.md(labels[i])}</span>${D.md(t)}</p>`).join('') + '</div></div>';
    const flip = () => { if (D.flags.answers && c.back) big.classList.toggle('flipped'); };
    layer.addEventListener('click', (e) => { if (e.target.closest('.big')) flip(); else close(); });
    open = { layer, big, flip };
    requestAnimationFrame(() => {
      layer.classList.add('in');
      if (flipped) setTimeout(flip, D.reduced ? 0 : 200);
    });
  };
  /* While a card is open: F turns it, Escape closes it, anything else closes it and carries on. */
  D.focusKey = function (e) {
    if (!open) return false;
    if (e.key === 'Escape') { close(); return true; }
    if (e.key.toLowerCase() === 'f') { open.flip(); return true; }
    close();
    return false;
  };
  D.on('go', close);
  D.on('reset', close);
})();
