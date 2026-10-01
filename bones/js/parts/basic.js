/* Small parts: the title, plain text, placeholders for drawings still to
 * come, name tags, the framework's five icons, and a row of flip cards. */
(function () {
  'use strict';
  const D = window.Deck;

  const BONE = '<svg class="bone" viewBox="0 0 200 60" aria-hidden="true"><circle cx="20" cy="17" r="14"/><circle cx="20" cy="43" r="14"/>' +
    '<circle cx="180" cy="17" r="14"/><circle cx="180" cy="43" r="14"/><rect x="20" y="20" width="160" height="20" rx="3"/></svg>';
  const PENCIL = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1-5L16 4l4 4L9 19z"/><path d="M14 6l4 4"/></svg>';

  D.parts.title = function (def, host) {
    host.innerHTML = (def.plain ? '' : BONE) + `<div class="title-text">${D.md(def.text)}</div>`;
    return { show(b, how) { if (how === 'step') D.replay(host, 'play'); } };
  };

  D.parts.text = function (def, host) {
    const tag = def.numbered ? 'ol' : 'div';
    host.innerHTML = `<${tag} class="lines">` + def.lines.map((l) => `<${def.numbered ? 'li' : 'p'}>${D.md(l)}</${def.numbered ? 'li' : 'p'}>`).join('') + `</${tag}>`;
    return { show(b, how) { if (how === 'step') D.replay(host, 'play'); } };
  };

  /* A dashed box saying what drawing goes here. Only in drafts. */
  D.parts.placeholder = function (def, host) {
    host.innerHTML = `<div class="ph">${PENCIL}<span>${D.esc(def.label)}</span></div>`;
  };

  /* A name tag that drops onto a picture. box is [x, y]. */
  D.parts.tag = function (def, host) {
    host.innerHTML = `<span class="nametag">${D.md(def.text)}</span>`;
    return { show(b, how) { if (how === 'step' || how === 'reveal') D.replay(host, 'play'); } };
  };

  /* The five framework questions, one more per build. The newest one is lit. */
  D.parts.icons = function (def, host) {
    const rail = D.content.rail;
    host.innerHTML = '<div class="bigicons">' + rail.map((r) =>
      `<div class="bi" data-k="${r.key}">${D.icons[r.key]}<span>${D.esc(r.label)}</span></div>`).join('') + '</div>';
    const icons = host.querySelectorAll('.bi');
    return {
      show(b, how) {
        icons.forEach((e, k) => {
          const was = e.classList.contains('on');
          e.classList.toggle('on', k <= b);
          e.classList.toggle('lit', k === b);
          if (!was && k <= b && how === 'step') D.replay(e, 'play');
        });
      }
    };
  };

  /* A row of cards to turn over; no sorting. Click one to see it big. */
  D.parts.cards = function (def, host) {
    const row = D.el('div', 'cardrow', host);
    def.cards.forEach((c) => {
      const e = D.card(c, def.labels, row);
      e.classList.add('static');
      e.addEventListener('click', () => D.focus(c, def.labels, false));
    });
    return { show(b, how) { if (how === 'step') D.replay(row, 'play'); } };
  };
})();
