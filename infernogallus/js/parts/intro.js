/* The preamble: cover, map of a paper, sorting the authors' own words, and the
 * five questions. */
(function () {
  'use strict';
  const D = window.Deck;

  /* Cover: the animal, the title of the session, and (next build) the paper's own title as a claim. */
  D.parts.cover = function (def, host) {
    host.innerHTML =
      `<div class="cover"><img class="cv-pic" src="${D.esc(def.pic)}" alt="" draggable="false">` +
      `<div class="cv-title">${D.fmt(def.title)}</div><div class="cv-cite">${D.fmt(def.cite)}</div>` +
      `<div class="cv-claim">${D.fmt(def.claim)}</div></div>`;
    const claim = host.querySelector('.cv-claim');
    return { show(b) { claim.classList.toggle('on', b >= def.claimAt); } };
  };

  /* Big plain text. */
  D.parts.title = function (def, host) {
    host.innerHTML = `<div class="title-text">${D.fmt(def.text)}</div>`;
    return { show(b, how) { if (how === 'step') D.replay(host, 'play'); } };
  };

  /* A paper drawn as blocks. Each build lights some blocks and names what to look for there. */
  D.parts.map = function (def, host) {
    host.innerHTML = '<div class="pm"></div>';
    const pm = host.firstChild;
    // the supplement: a stack of sheets behind and to the right
    [[760, 40], [740, 24], [720, 8]].forEach(([x, y], i) => {
      const s = D.el('div', 'pm-sheet', pm); s.style.cssText = `left:${x}px;top:${y + 60}px;width:250px;height:340px;`;
      if (i === 2) {
        s.innerHTML = '<div class="pm-line" style="top:30px"></div><div class="pm-line" style="top:56px"></div><div class="pm-line" style="top:82px;right:90px"></div>';
        const b = D.el('div', 'pm-block', s, 'Supplement'); b.dataset.k = 'supp'; b.style.cssText = 'left:14px;top:130px;width:220px;height:90px;';
      }
    });
    const sheet = D.el('div', 'pm-sheet', pm);
    sheet.style.cssText = 'left:70px;top:10px;width:580px;height:670px;';
    const blk = (k, label, x, y, w, h, cls) => {
      const e = D.el('div', 'pm-block' + (cls ? ' ' + cls : ''), sheet, label);
      e.dataset.k = k; e.style.cssText = `left:${x}px;top:${y}px;width:${w}px;height:${h}px;`;
    };
    blk('title', 'Title', 28, 24, 524, 56);
    blk('abstract', 'Abstract', 28, 94, 524, 84);
    blk('intro', 'Intro', 28, 192, 524, 46);
    blk('fig1', '', 28, 252, 252, 150, 'pm-fig');
    blk('fig2', '', 300, 252, 252, 150, 'pm-fig');
    blk('results', 'Results', 28, 416, 524, 56);
    blk('disc', 'Discussion', 28, 486, 524, 72);
    blk('methods', 'Methods', 28, 572, 524, 62);
    // figure placeholders: a little mountain and sun
    sheet.querySelectorAll('.pm-fig').forEach((f) => {
      f.innerHTML = '<svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18l6-7 4 4 3-3 5 6zM8 7h.01"/></svg>';
    });
    const note = D.el('div', 'pm-note', pm);
    note.style.cssText = 'left:1040px;top:230px;width:520px;';
    const blocks = [...pm.querySelectorAll('.pm-block')];
    return {
      show(b, how) {
        const step = def.steps[b - 1];
        const lit = new Set(step ? step.lit : []);
        const seen = new Set();
        for (let i = 0; i < b - 1; i++) def.steps[i].lit.forEach((k) => seen.add(k));
        blocks.forEach((e) => {
          const k = e.dataset.k;
          const on = lit.has(k) || (k.startsWith('fig') && lit.has('figs'));
          e.classList.toggle('lit', on);
          e.classList.toggle('seen', !on && (seen.has(k) || (k.startsWith('fig') && seen.has('figs'))));
        });
        note.classList.toggle('on', !!step);
        if (step) {
          note.innerHTML = `${D.icons[step.icon]}<div><b>${D.fmt(step.word)}</b><small>${D.fmt(step.sub)}</small></div>`;
          if (how === 'step') D.replay(note, 'play');
        }
      }
    };
  };

  /* Sort the authors' own words along a line from unsure to sure. Chips arrive one per build. */
  D.parts.hedge = function (def, host) {
    host.innerHTML = '<div class="hg"><div class="hg-band"></div></div>';
    const root = host.firstChild;
    const l = D.el('div', 'hg-end', root, def.lo); l.style.left = '60px';
    const r = D.el('div', 'hg-end', root, def.hi); r.style.right = '60px';
    const tray = (i) => ({ x: 40 + (i % 3) * 500, y: 436 + Math.floor(i / 3) * 128 });
    const st = () => D.get('hedge', () => ({ pos: {} }));
    const chips = def.chips.map((c, i) => {
      const e = D.el('div', 'hg-chip off', root, D.fmt(c.text));
      const place = () => { const p = st().pos[c.id] || tray(i); e.style.left = p.x + 'px'; e.style.top = p.y + 'px'; };
      place();
      D.drag(e, root, {
        minX: 0, maxX: 1520 - 480, minY: 0, maxY: 690 - 125,
        end(x, y) { st().pos[c.id] = { x, y }; D.save(); }
      });
      return { e, place, at: c.at };
    });
    return {
      show(b, how) {
        chips.forEach((c) => {
          const on = b >= c.at, was = !c.e.classList.contains('off');
          c.e.classList.toggle('off', !on);
          if (on && !was && how === 'step') D.replay(c.e, 'pop');
        });
      },
      reset() { chips.forEach((c) => c.place()); }
    };
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
})();
