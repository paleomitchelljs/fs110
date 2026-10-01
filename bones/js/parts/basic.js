/* Small parts: the title, plain text, a photo, placeholders for drawings
 * still to come, two pictures side by side, and the framework's five icons. */
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

  /* A photo or figure, as large as fits the box, not cropped. A published
   * figure carries its credit underneath, small. */
  D.parts.photo = function (def, host) {
    host.innerHTML = `<figure class="photo-fig"><img class="photo" src="${D.esc(def.src)}" alt="${D.esc(def.alt || '')}" draggable="false">` +
      (def.credit ? `<figcaption>${D.esc(def.credit)}</figcaption>` : '') + '</figure>';
  };

  /* A dashed box saying what drawing goes here. Only in drafts. */
  D.parts.placeholder = function (def, host) {
    host.innerHTML = `<div class="ph">${PENCIL}<span>${D.esc(def.label)}</span></div>`;
  };

  /* Two pictures side by side at one shared scale (their px sizes come from the
   * same figure), bottoms level, a caption under each. From arrowAt on, a curved
   * arrow runs from the first to the second. */
  D.parts.pair = function (def, host) {
    const k = def.scale || 1, gap = def.gap || 120, base = def.base || 470;
    const total = def.imgs.reduce((s, m) => s + m.w * k, 0) + gap;
    let x = (def.box[2] - total) / 2;
    const spots = def.imgs.map((m) => {
      const e = D.el('img', 'pair-img', host);
      e.src = m.src; e.alt = m.caption || ''; e.draggable = false;
      const w = m.w * k, h = m.h * k, s = { x, y: base - h, w, h };
      Object.assign(e.style, { left: x + 'px', top: s.y + 'px', width: w + 'px', height: h + 'px' });
      if (m.caption) {
        const c = D.el('div', 'pair-cap', host, D.md(m.caption));
        c.style.left = x + w / 2 + 'px'; c.style.top = base + 14 + 'px';
      }
      x += w + gap;
      return s;
    });
    let arrow = null;
    if (def.arrowAt != null) {
      const [a, b] = spots, p0 = [a.x + a.w * 0.6, a.y - 18], p2 = [b.x + b.w * 0.25, b.y - 18];
      const p1 = [(p0[0] + p2[0]) / 2, Math.min(a.y, b.y) - 120];
      const ang = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]), hd = (t) => [p2[0] - 28 * Math.cos(ang + t), p2[1] - 28 * Math.sin(ang + t)];
      const svg = D.svg('svg', { class: 'pair-svg', viewBox: `0 0 ${def.box[2]} ${def.box[3]}`, width: def.box[2], height: def.box[3] }, host);
      arrow = D.svg('g', { class: 'pair-arrow' }, svg);
      D.svg('path', { class: 'pair-line', d: `M${p0}Q${p1} ${p2}` }, arrow);
      D.svg('path', { class: 'pair-head', d: `M${hd(0.45)}L${p2}L${hd(-0.45)}` }, arrow);
    }
    return {
      show(b, how) {
        if (!arrow) return;
        arrow.classList.toggle('on', b >= def.arrowAt);
        if (b === def.arrowAt && how === 'step') D.replay(arrow, 'play');
      }
    };
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
