/* Trails of three-toed prints that step in when the build arrives. With
 * tail: true, a dashed line shows where a dragging tail would have scraped,
 * then fades: trackways almost never have one. */
(function () {
  'use strict';
  const D = window.Deck;

  /* One print, toes pointing +x: three toes and a heel pad. */
  const PRINT = '<path d="M-4 0H30M-3 1L19 -17M-3 -1L19 17"/><ellipse cx="-7" cy="0" rx="10" ry="9"/>';

  D.parts.trackway = function (def, host) {
    const w = def.box[2], h = def.box[3];
    const svg = D.svg('svg', { class: 'tw', viewBox: `0 0 ${w} ${h}`, width: w, height: h }, host);
    const trails = def.trails.map((t) => {
      const g = D.svg('g', {}, svg), prints = [];
      for (let x = 80, i = 0; x < w - 60; x += t.step / 2, i++) {
        const side = i % 2 ? 1 : -1;
        prints.push(D.svg('g', { class: 'tw-print', transform: `translate(${x} ${t.y + side * 16}) rotate(${side * -6})` }, g));
        prints[prints.length - 1].innerHTML = PRINT;
      }
      return prints;
    });
    const ghost = def.tail ? D.svg('path', { class: 'tw-ghost', d: def.trails.map((t) => `M60 ${t.y}H${w - 40}`).join('') }, svg) : null;
    return {
      show(b, how) {
        trails.forEach((prints) => prints.forEach((p, i) => {
          p.style.animationDelay = how === 'step' ? (i / prints.length) * 2 + 's' : '0s';
          if (how === 'step') D.replay(p, 'play'); else p.classList.remove('play');
        }));
        if (ghost) { if (how === 'step') D.replay(ghost, 'play'); else ghost.classList.remove('play'); }
      }
    };
  };
})();
