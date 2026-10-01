/* The hook. Cope's 1869 Elasmosaurus (head on the tail) above his corrected
 * 1870 one, both cut from his plates (public domain; img/make_elasmo.py).
 * The 1869 skull is its own piece: drag it to either end and it snaps there,
 * facing out. On the reveal build it slides from the tail to the neck.
 *
 * Builds (from the item def): before figAt, the 1869 skeleton alone with the
 * skull loose above it; from figAt, both figures; from slideAt (answers on),
 * the skull at the neck. */
(function () {
  'use strict';
  const D = window.Deck;

  const K = 0.625;                       // image px -> stage px, the same for both figures
  /* Measured by img/make_elasmo.py, in image px. */
  const IMG = { w69: 2080, h69: 234, w70: 2144, h70: 346, skW: 152, skH: 61,
    tail: [1920, 4.8], attach: [33.6, 19.2], neckTip: [27, 44.1] };
  const TOP = [150, 114], BOT = [130, 370];   // top-left of each figure, item px

  D.parts.elasmo = function (def, host) {
    const fig = (src, alt, at, w, h) => {
      const e = D.el('img', 'el-fig ink-img', host);
      e.src = src; e.alt = alt; e.draggable = false;
      e.style.left = at[0] + 'px'; e.style.top = at[1] + 'px';
      e.style.width = w * K + 'px'; e.style.height = h * K + 'px';
      return e;
    };
    fig('img/cope-1869-headless.png', "Cope's 1869 Elasmosaurus", TOP, IMG.w69, IMG.h69);
    const later = fig('img/cope-1870.png', "Cope's corrected 1870 Elasmosaurus", BOT, IMG.w70, IMG.h70);
    const skull = D.el('img', 'el-skull ink-img grab', host);
    skull.src = 'img/cope-1869-skull.png'; skull.alt = 'skull'; skull.draggable = false;
    skull.style.width = IMG.skW * K + 'px'; skull.style.height = IMG.skH * K + 'px';

    /* Where the skull can sit: the top-left of its box, and whether it faces left. */
    const slots = {
      tail: { x: TOP[0] + IMG.tail[0] * K, y: TOP[1] + IMG.tail[1] * K, flip: false },
      neck: { x: TOP[0] + (IMG.neckTip[0] - (IMG.skW - IMG.attach[0])) * K, y: TOP[1] + (IMG.neckTip[1] - IMG.attach[1]) * K, flip: true },
      loose: { x: 800 - IMG.skW * K / 2, y: TOP[1] - 90, flip: false }
    };
    let at = null;
    const move = (x, y, flip) => { skull.style.transform = `translate(${x}px, ${y}px) scaleX(${flip ? -1 : 1})`; };
    function put(name, slow) {
      at = name;
      skull.classList.toggle('slide', !!slow);
      const s = slots[name];
      move(s.x, s.y, s.flip);
    }

    skull.addEventListener('pointerdown', (ev) => {
      ev.preventDefault();
      skull.setPointerCapture(ev.pointerId);
      const s = slots[at], p0 = D.local(host, ev);
      skull.classList.remove('slide'); skull.classList.add('dragging');
      const drag = (m) => { const p = D.local(host, m); move(s.x + p.x - p0.x, s.y + p.y - p0.y, s.flip); };
      const drop = (u) => {
        skull.removeEventListener('pointermove', drag); skull.removeEventListener('pointerup', drop); skull.removeEventListener('pointercancel', drop);
        skull.classList.remove('dragging');
        const p = D.local(host, u), cx = s.x + p.x - p0.x + IMG.skW * K / 2;
        put(Math.abs(cx - slots.neck.x) < Math.abs(cx - slots.tail.x) ? 'neck' : 'tail');
      };
      skull.addEventListener('pointermove', drag); skull.addEventListener('pointerup', drop); skull.addEventListener('pointercancel', drop);
    });

    return {
      show(b, how) {
        later.classList.toggle('off', b < def.figAt);
        const want = b < def.figAt ? 'loose' : b >= def.slideAt && D.flags.answers ? 'neck' : 'tail';
        if (want === 'neck' && at !== 'neck' && (how === 'step' || how === 'reveal')) {
          put('tail'); void skull.offsetWidth;           // start from Cope's spot, then slide
          put('neck', true);
        } else put(want);
      },
      reset() { put('tail'); }
    };
  };
})();
