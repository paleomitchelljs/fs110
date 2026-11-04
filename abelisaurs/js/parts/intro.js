/* Cover, part titles, the five questions, and fact slides (a picture and a few numbers). */
(function () {
  'use strict';
  const D = window.Deck;

  /* Cover: the animal, whole, and the title. Nothing else. */
  D.parts.cover = function (def, host) {
    host.innerHTML = `<div class="cover"><img class="cv-pic cv-photo" src="${D.esc(def.pic)}" alt="" draggable="false"><div class="cv-title">${D.fmt(def.title)}</div></div>`;
    return {};
  };

  /* Big plain text, optionally with a part number. */
  D.parts.title = function (def, host) {
    host.innerHTML = (def.n ? `<div class="pt-num">${def.n}</div>` : '') + `<div class="title-text">${D.fmt(def.text)}</div>`;
    return { show(b, how) { if (how === 'step') D.replay(host, 'play'); } };
  };

  /* The five questions, one more per build from def.from. The newest is lit. */
  D.parts.icons = function (def, host) {
    host.innerHTML = '<div class="bigicons">' + D.content.rail.map((r) =>
      `<div class="bi" data-k="${r.key}">${D.icons[r.key]}<span>${D.esc(r.label)}</span></div>`).join('') + '</div>';
    const icons = host.querySelectorAll('.bi');
    return {
      show(b, how) {
        const n = b - (def.from || 0);
        icons.forEach((e, k) => {
          const was = e.classList.contains('on');
          e.classList.toggle('on', k <= n);
          e.classList.toggle('lit', k === n);
          if (!was && k <= n && how === 'step') D.replay(e, 'play');
        });
      }
    };
  };

  /* A picture and a few numbers, one number per build. def: src, cap, w, h, nums [{n, l, at}]. */
  D.parts.fact = function (def, host) {
    host.innerHTML = `<div class="ft"><div class="ft-pic"><img src="${D.esc(def.src)}" alt="${D.esc(def.alt || '')}" draggable="false"><div class="ft-cap">${D.fmt(def.cap || '')}</div></div><div class="ft-nums"></div></div>`;
    const nums = host.querySelector('.ft-nums');
    const rows = def.nums.map((x) => {
      const e = D.el('div', 'ft-num', nums, `<b>${D.fmt(x.n)}</b><span>${D.fmt(x.l)}</span>`);
      return { e, at: x.at };
    });
    if (def.imgBox) { const p = host.querySelector('.ft-pic'); p.style.width = def.imgBox[0] + 'px'; p.style.height = def.imgBox[1] + 'px'; }
    return {
      show(b, how) {
        rows.forEach((r) => {
          const on = b >= r.at, was = r.e.classList.contains('on');
          r.e.classList.toggle('on', on);
          if (on && !was && how === 'step') D.replay(r.e, 'play');
        });
      }
    };
  };
})();
