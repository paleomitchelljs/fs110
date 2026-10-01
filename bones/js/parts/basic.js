/* Small parts: the title, plain text, placeholders for drawings still to
 * come, name tags, and the framework's five icons. */
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

  /* Pictures for hypotheses that have no picture of their own (24 × 24, stroked). */
  D.hypIcons = {
    impact: '<circle cx="16" cy="8" r="4.5"/><path d="M12.6 11.4 3 21M10.5 7.5 5 13M16.5 12.6 11 18"/>',
    volcano: '<path d="M2 21h20l-6.5-11h-7z"/><path d="M10 10l2-2.5 2 2.5M12 5V2.5M8.5 4.5 7 3M15.5 4.5 17 3"/>'
  };

  /* The five framework questions, one more per build from def.from. The newest one is lit. */
  D.parts.icons = function (def, host) {
    const rail = D.content.rail;
    host.innerHTML = '<div class="bigicons">' + rail.map((r) =>
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
})();
