/* Smoke test in jsdom: every build of every segment at every level with no script
 * errors, [ and ] at each end, and every walk slide showing a lens. jsdom does no
 * layout, so overlap and overflow need tools/shoot.sh instead. Needs jsdom:
 *   JSDOM=/path/to/node_modules/jsdom node maniraptora/pennaraptora/tests/deck.smoke.js */
'use strict';
const path = require('path');
const { JSDOM, VirtualConsole } = require(process.env.JSDOM || 'jsdom');
const file = path.join(__dirname, '..', 'index.html');
let checks = 0, fails = 0;
const check = (name, ok, detail) => { checks++; if (!ok) fails++; console.log(`${ok ? 'ok  ' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`); };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function open(level) {
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', (e) => { if (!/fonts.googleapis|Could not load img/.test(e.message)) errors.push('jsdom: ' + (e.stack || e.message)); });
  vc.on('error', (...a) => errors.push('console.error: ' + a.join(' ')));
  vc.on('warn', (...a) => errors.push('console.warn: ' + a.join(' ')));
  const dom = new JSDOM(require('fs').readFileSync(file, 'utf8'), {
    url: 'file://' + file + '#L' + level, runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true, virtualConsole: vc,
    beforeParse(w) {
      w.matchMedia = (q) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} });
      w.Element.prototype.setPointerCapture = () => {};
      w.onerror = (msg, src, line, col, err) => errors.push(`onerror: ${msg} @ ${src}:${line} ${err && err.stack}`);
    }
  });
  return { w: dom.window, d: dom.window.document, errors };
}

(async () => {
  for (const level of [1, 2, 3]) {
    const { w, d, errors } = open(level);
    for (let i = 0; i < 600 && !(w.Deck && w.Deck.content); i++) await wait(100);
    const D = w.Deck, segs = D.content.segments;
    const key = (k) => d.body.dispatchEvent(new w.KeyboardEvent('keydown', { key: k, bubbles: true }));
    const seen = new Set(); let n = 0, noLens = [];
    for (let i = 0; i < 900; i++) {
      const p = D.where(); seen.add(p.s);
      const seg = d.querySelector(`.seg[data-seg="${segs[p.s].id}"]`);
      const pageOn = seg && [...seg.querySelectorAll('.item-page')].some((e) => !e.classList.contains('off'));
      if (pageOn && !seg.querySelector('.item-page:not(.off) .lens .wd')) noLens.push(segs[p.s].id + '.' + p.b);
      const before = p.s + '.' + p.b; key('ArrowRight'); n++;
      const q = D.where(); if (q.s + '.' + q.b === before) break;
    }
    const expect = segs.filter((s) => (s.tier || 1) <= level).length;
    check(`level ${level}: every segment reached`, seen.size === expect, `${seen.size}/${expect} in ${n} presses`);
    check(`level ${level}: every page shows a lens`, noLens.length === 0, noLens.join(' '));
    check(`level ${level}: no script errors`, errors.length === 0, errors[0] || '');
    for (let i = 0; i < 900; i++) key('ArrowLeft');
    check(`level ${level}: back to the start`, D.where().s === 0 && D.where().b === 0);
    for (let i = 0; i < 200; i++) { const a = D.where().s; key(']'); if (D.where().s === a) break; }
    const shown = segs.map((s, i) => ((s.tier || 1) <= level ? i : -1)).filter((i) => i >= 0);
    check(`level ${level}: ] reaches the last segment`, D.where().s === shown[shown.length - 1]);
    w.close();
  }
  console.log(`\n${checks - fails}/${checks} passed`);
  process.exit(fails ? 1 : 0);
})();
