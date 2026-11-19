/* Facts about one line of evidence: how much material, and what had to be assumed.
 * Plain numbers and nouns, no verdicts; the class weighs them.
 *
 *   facts   chips: [{ n, l, at }]. n is the number or short value, l what it counts.
 *           Each chip appears from build at on; the newest is lit.
 */
(function () {
  'use strict';
  const D = window.Deck;
  D.parts.facts = function (def, host) {
    const BW = def.box[2], BH = def.box[3], n = def.chips.length, G = 14;
    const ch = Math.min(def.rowH || 86, (BH - G * (n - 1)) / n);
    host.innerHTML = '';
    const chips = def.chips.map((c, i) => {
      const e = D.el('div', 'fx', host, `<b>${D.fmt(c.n)}</b><span>${D.fmt(c.l)}</span>`);
      e.style.cssText = `top:${(i * (ch + G)).toFixed(1)}px;height:${ch.toFixed(1)}px;width:${BW}px;`;
      return { e, at: c.at || 0 };
    });
    return {
      show(b, how) {
        const on = chips.filter((k) => k.at <= b);
        const lit = on.length ? Math.max(...on.map((k) => k.at)) : -1;
        chips.forEach((k) => {
          const s = k.at <= b, was = k.e.classList.contains('shown');
          k.e.classList.toggle('shown', s);
          k.e.classList.toggle('lit', s && k.at === lit);
          if (s && !was && how === 'step') D.replay(k.e, 'play');
        });
      }
    };
  };
})();
