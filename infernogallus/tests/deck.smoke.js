/* Smoke test in jsdom: every script runs, every build of every segment is
 * visited (with extras on), votes land, the ladder clamps, the rank slide fills.
 * Needs jsdom, which this repo doesn't ship:
 *   JSDOM=/path/to/node_modules/jsdom node infernogallus/tests/deck.smoke.js */
'use strict';
const path = require('path');
const { JSDOM, VirtualConsole } = require(process.env.JSDOM || 'jsdom');
const file = path.join(__dirname, '..', 'index.html');
const errors = [];
const vc = new VirtualConsole();
vc.on('jsdomError', (e) => { if (!/fonts.googleapis/.test(e.message)) errors.push('jsdom: ' + (e.stack || e.message)); });
vc.on('error', (...a) => errors.push('console.error: ' + a.join(' ')));
const dom = new JSDOM(require('fs').readFileSync(file, 'utf8'), {
  url: 'file://' + file + '#all', runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true, virtualConsole: vc,
  beforeParse(w) {
    w.matchMedia = (q) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} });
    w.Element.prototype.setPointerCapture = () => {};
    w.onerror = (msg, src, line, col, err) => errors.push(`onerror: ${msg} @ ${src}:${line} ${err && err.stack}`);
  }
});
const w = dom.window, d = w.document;
const key = (k, extra) => d.body.dispatchEvent(new w.KeyboardEvent('keydown', Object.assign({ key: k, bubbles: true }, extra)));
const digit = (n, shift) => key(shift ? '!' : String(n), { code: 'Digit' + n, shiftKey: !!shift });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let checks = 0, fails = 0;
const check = (name, ok, detail) => { checks++; if (!ok) fails++; console.log(`${ok ? 'ok  ' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`); };

(async () => {
  await wait(400);
  const D = w.Deck, segs = D.content.segments;
  check('deck started', !!d.querySelector('.seg'));
  // walk every build of every segment, forward
  let steps = 0;
  const seen = new Set();
  for (let i = 0; i < 400; i++) {
    const p = D.where(); seen.add(p.s);
    const before = p.s + '.' + p.b;
    key('ArrowRight'); steps++;
    const q = D.where();
    if (q.s + '.' + q.b === before) break;
  }
  check('every segment reached (extras on)', seen.size === segs.length, `${seen.size}/${segs.length} in ${steps} presses`);
  for (let i = 0; i < 400; i++) key('ArrowLeft');
  check('back to the start', D.where().s === 0 && D.where().b === 0);

  // claim 2: all rows appear, vote, marker
  const goTo = (id) => { const t = segs.findIndex((s) => s.id === id); while (D.where().s < t) key(']'); while (D.where().s > t) key('['); return segs[t]; };
  const s2 = goTo('c2');
  for (let b = 0; b < s2.builds.length - 1; b++) key('ArrowRight');
  const host = d.querySelector('.seg:not(.off) .item-claim');
  check('claim 2: all rows on', host.querySelectorAll('.row.on').length === 7, host.querySelectorAll('.row.on').length + ' rows');
  check('claim 2: gauge on', host.querySelector('.gauge').classList.contains('on'));
  digit(3); digit(3); digit(4); digit(4, true);
  const dots = [...host.querySelectorAll('.g-col')].map((c) => c.children.length);
  check('votes counted (shift undoes)', JSON.stringify(dots) === '[0,0,2,0,0]', JSON.stringify(dots));
  check('marker follows votes', host.querySelector('.g-mark').style.left === '50%', host.querySelector('.g-mark').style.left);
  check('call saved for the rank slide', Math.abs(D.callOf('c2') - 0.5) < 1e-9);

  // ladder
  const s7 = goTo('c7');
  for (let b = 0; b < s7.builds.length - 1; b++) key('ArrowRight');
  const lh = d.querySelector('.seg:not(.off) .item-ladder');
  check('ladder: 4 rungs on', lh.querySelectorAll('.rung.on').length === 4);
  check('ladder: 11 rows on', lh.querySelectorAll('.rung .row.on').length === 11);
  const L = () => D.peek('ladder:c7').v;
  digit(5);                       // newest rung (top) to 'Solid' — nothing below, so it is free
  check('ladder: top rung set', L()[3] > 0.89, JSON.stringify(L()));
  // drag the bottom rung low; everything above must come down with it
  const mg = lh.querySelectorAll('.mg')[0];
  mg.getBoundingClientRect = () => ({ left: 0, width: 100, top: 0, height: 10, right: 100, bottom: 10 });
  const ev = new w.MouseEvent('pointerdown', { bubbles: true, clientX: 20, clientY: 5 });
  mg.dispatchEvent(ev);
  check('ladder: lower rung drags upper ones down', L().every((v) => v == null || v <= 0.2 + 1e-9), JSON.stringify(L()));
  check('rank reads the top rung for claim 7', Math.abs(D.callOf('c7') - L()[3]) < 1e-9);

  // rank slide
  const sr = goTo('rank');
  key('ArrowRight'); key('ArrowRight');
  const rh = d.querySelector('.seg:not(.off) .item-rank');
  const chips = [...rh.querySelectorAll('.rk-chip')].filter((c) => c.style.display !== 'none');
  check('rank: 12 chips with extras', chips.length === 12, chips.length);
  const c2 = [...rh.querySelectorAll('.rk-chip')].find((c) => c.textContent.includes('12 kg'));
  check('rank: rated claim sits on the band', parseFloat(c2.style.top) < 400, c2.style.top);
  const c1 = [...rh.querySelectorAll('.rk-chip')].find((c) => c.textContent.includes('New species'));
  check('rank: unrated claim waits in the tray', parseFloat(c1.style.top) > 500, c1.style.top);
  key('x');
  const n = [...rh.querySelectorAll('.rk-chip')].filter((c) => c.style.display !== 'none').length;
  check('rank: extras off hides 3 chips', n === 9, n);

  // reset
  d.querySelector('#reset').click(); d.querySelector('#reset').click();
  check('reset clears votes', D.callOf('c2') === null);

  console.log(errors.length ? '\nERRORS:\n' + errors.join('\n') : '\nno script errors');
  console.log(`${checks - fails}/${checks} checks`);
  process.exit(fails || errors.length ? 1 : 0);
})();
