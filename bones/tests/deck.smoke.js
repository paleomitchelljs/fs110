/* Smoke test for the deck in jsdom: no layout and no canvas, but every script
 * runs, every build is visited, and each part gets poked.
 * Needs jsdom, which this repo doesn't ship. Install it anywhere, then:
 *   JSDOM=/path/to/node_modules/jsdom node bones/tests/deck.smoke.js */
'use strict';
const path = require('path');
const { JSDOM, VirtualConsole } = require(process.env.JSDOM || 'jsdom');

const file = path.join(__dirname, '..', 'index.html');
const errors = [];
const vc = new VirtualConsole();
vc.on('jsdomError', (e) => { if (!/Could not load link.*fonts.googleapis/.test(e.message)) errors.push('jsdom: ' + (e.stack || e.message)); });
vc.on('error', (...a) => errors.push('console.error: ' + a.join(' ')));

const dom = new JSDOM(require('fs').readFileSync(file, 'utf8'), {
  url: 'file://' + file + '#0', runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true, virtualConsole: vc,
  beforeParse(w) {
    w.matchMedia = (q) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} });
    w.HTMLCanvasElement.prototype.getContext = () => new Proxy({}, { get: () => () => {} });
    w.Element.prototype.setPointerCapture = () => {};
    w.onerror = (msg, src, line, col, err) => errors.push(`onerror: ${msg} @ ${src}:${line}:${col} ${err && err.stack}`);
  }
});
const w = dom.window, d = w.document;
const key = (k, extra) => d.body.dispatchEvent(new w.KeyboardEvent('keydown', Object.assign({ key: k, bubbles: true }, extra)));
const digit = (n, shift) => key(shift ? '!' : String(n), { code: 'Digit' + n, shiftKey: !!shift });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
/* A mouse pointer event (jsdom has no PointerEvent). */
function pe(type, x, y) {
  const e = new w.MouseEvent(type, { bubbles: true, clientX: x, clientY: y, button: 0 });
  Object.defineProperty(e, 'pointerType', { value: 'mouse' });
  return e;
}
/* Click a card, then click a spot (stage pixels inside the balance) to put it there. */
function place(host, id, x, y) {
  const S = w.Deck.scale, c = host.querySelector(`.card[data-id="${id}"]`);
  c.dispatchEvent(pe('pointerdown', 1, 1));
  c.dispatchEvent(pe('pointerup', 1, 1));
  host.dispatchEvent(pe('pointerdown', x * S, y * S));
}
const tiltOf = (host) => host.querySelector('.bal-beamg').style.transform;
const pos = () => { const p = w.Deck.where(); return '#' + p.s + (p.b ? '.' + p.b : ''); };
const on = (sel) => [...d.querySelectorAll('.seg:not(.off) .item:not(.off)')].map((e) => e.className.replace('item ', '')).join(', ');
let checks = 0, fails = 0;
const check = (name, ok, detail) => { checks++; if (!ok) fails++; console.log(`${ok ? 'ok  ' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`); };

w.addEventListener('load', async () => {
  await wait(50);
  check('deck started', !!w.Deck && d.querySelector('.seg') !== null, pos());

  /* forward through everything, logging what is on screen */
  const seen = [];
  let last = '';
  for (let i = 0; i < 200; i++) {
    seen.push(pos() + '  ' + on());
    key('ArrowRight');
    await wait(5);
    if (pos() === last) break;
    last = pos();
  }
  console.log(seen.join('\n'));
  check('reached the exit ticket', pos().startsWith('#9'), pos());

  /* and back to the start */
  for (let i = 0; i < 200 && pos() !== '#0'; i++) { key('ArrowLeft'); await wait(2); }
  check('back to the title', pos() === '#0', pos());

  /* answers and extras */
  key('p'); key('x');
  check('answers on', d.body.classList.contains('answers'));
  check('extras on', d.body.classList.contains('extras'));
  key(']'); await wait(5);
  check('hook starts on its extra build with extras on', pos() === '#1', pos());

  /* framework: rail appears at build 5, demo card moves to the pivot at 6 */
  key(']'); await wait(5);
  for (let i = 0; i < 5; i++) key('ArrowRight');
  await wait(30);
  check('rail shown at framework build 5', !d.querySelector('.rail').classList.contains('off'), pos());
  check('rail lights Test', d.querySelector('.ri.lit') && d.querySelector('.ri.lit').dataset.k === 'test');
  const st = () => JSON.parse(JSON.stringify(w.Deck.peek('bal-fw') || {}));
  check('demo card on the left pan', st().zone && st().zone.ev === 'left', JSON.stringify(st()));
  key('ArrowRight'); await wait(30);
  check('demo card on the pivot', st().zone.ev === 'pivot', JSON.stringify(st()));

  /* Case 1 room list: reveal 2, 5, type one, take one back */
  key(']'); key(']'); await wait(5);
  key('ArrowRight'); key('ArrowRight'); await wait(5);
  check('at Case 1 room list', pos() === '#4.2', pos());
  digit(2); digit(5); await wait(5);
  let chips = [...d.querySelectorAll('.seg:not(.off) .item:not(.off) .rl-chip')].map((e) => e.textContent);
  check('two chips, in the order said', chips.join('|') === 'Sex|Squashed in the rock', chips.join('|'));
  key('n'); await wait(10);
  const inp = d.querySelector('.seg:not(.off) .rl-input');
  check('typing box opened', !!inp);
  inp.value = 'Disease';
  inp.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
  await wait(5);
  digit(2, true); await wait(5);
  chips = [...d.querySelectorAll('.seg:not(.off) .item:not(.off) .rl-chip')].map((e) => e.textContent);
  check('typed item kept, shift-2 took Sex back', chips.join('|') === 'Squashed in the rock|Disease', chips.join('|'));
  check('reserve has 5 slots + plus', d.querySelectorAll('.seg:not(.off) .item:not(.off) .rl-slot').length === 6);

  /* Case 1 balance: click a card, then click the right pan */
  key('ArrowRight'); key('ArrowRight'); await wait(20);
  check('at Case 1 balance', pos() === '#4.4', pos() + ' ' + on());
  const host = d.querySelector('.seg:not(.off) .item-balance:not(.off)');
  const card = host.querySelector('.card[data-id="baby"]');
  const S = w.Deck.scale;
  card.dispatchEvent(pe('pointerdown', 10, 10));
  card.dispatchEvent(pe('pointerup', 10, 10));
  check('card selected by click', card.classList.contains('sel'));
  host.dispatchEvent(pe('pointerdown', 1300 * S, 300 * S));
  await wait(5);
  const tric = w.Deck.peek('bal-tric');
  check('card placed on the right pan', tric.zone.baby === 'right', JSON.stringify(tric.zone));
  check('beam tilts 4° toward it', /rotate\(4deg\)/.test(tiltOf(host)), tiltOf(host));
  place(host, 'common', 760, 150); await wait(5);
  check('a card on the pivot tips nothing', w.Deck.peek('bal-tric').zone.common === 'pivot' && /rotate\(4deg\)/.test(tiltOf(host)), tiltOf(host));
  place(host, 'texture', 760, 540); await wait(5);
  check('a card on the floor tips nothing', w.Deck.peek('bal-tric').zone.texture === 'floor' && /rotate\(4deg\)/.test(tiltOf(host)), tiltOf(host));

  /* confidence: 1–5 keys */
  key('ArrowRight'); await wait(5);
  digit(3); digit(3); digit(4); digit(4, true); digit(5);
  const conf = w.Deck.peek('conf-tric');
  check('confidence tallies', JSON.stringify(conf.r1) === '[0,0,2,0,1]', JSON.stringify(conf.r1));
  check('mean shown', /mean 3\.7/.test(d.querySelector('.seg:not(.off) .conf-mean').textContent), d.querySelector('.seg:not(.off) .conf-mean').textContent);

  /* Case 2 */
  key(']'); await wait(5);
  digit(2); digit(2); digit(1);
  check('picker votes', JSON.stringify(w.Deck.peek('pick-signor-pick').votes) === '[1,2,0]');
  key('ArrowRight'); await wait(4500);
  const sg = d.querySelector('.seg:not(.off) .item-signor');
  const dotsOn = sg.querySelectorAll('.sg-dot.on').length;
  const wantDots = w.Sim.draws(w.Sim.SEED).reduce((n, row) => n + w.Sim.finds(row, 0.08).length, 0);
  check('dig shows every find at p = 0.08', dotsOn === wantDots, `${dotsOn} of ${wantDots}`);
  check('pinned prediction is B', /B/.test(sg.querySelector('.sg-pin').textContent));
  key('ArrowRight'); await wait(20);
  check('sorted at build 2', sg.classList.contains('sorted'));
  key('ArrowRight'); await wait(20);
  check('truth shown at build 3 (answers on)', sg.classList.contains('show-truth'));
  key('ArrowRight'); await wait(20);
  key('ArrowUp'); key('ArrowUp'); await wait(20);
  check('p up to 0.10', w.Deck.peek('signor').p === 0.1, String(w.Deck.peek('signor').p));
  const dots10 = sg.querySelectorAll('.sg-dot.on').length;
  check('raising p adds finds', dots10 > dotsOn, `${dotsOn} -> ${dots10}`);
  sg.querySelector('.sg-pre[data-p="0.2"]').click(); await wait(10);
  check('preset 0.20', w.Deck.peek('signor').p === 0.2);

  /* funnel */
  key('ArrowRight'); await wait(20);
  check('funnel on screen', on().includes('item-funnel'), on());
  digit(3); digit(2); digit(6); digit(1); await wait(1500);
  const counts = [...d.querySelectorAll('.seg:not(.off) .fn-count b')].map((e) => e.textContent);
  const heads = [...d.querySelectorAll('.seg:not(.off) .fn-head')].sort((a, b) => parseFloat(a.style.left) - parseFloat(b.style.left)).map((e) => e.textContent);
  check('gates in funnel order, not the order said', heads.join('|') === 'Not buried|Destroyed since|Not recognized', heads.join('|'));
  check('counts fall through the gates', counts.length === 4 && +counts[0].replace(',', '') === 1000 && counts.every((c, i) => i === 0 || +c <= +counts[i - 1].replace(',', '')), counts.join(' → '));
  check('never-there lane shown', !!d.querySelector('.seg:not(.off) .fn-never'));
  digit(4); digit(5); await wait(1500);
  const final = [...d.querySelectorAll('.seg:not(.off) .fn-count b')].map((e) => e.textContent);
  console.log('      all five gates: ' + final.join(' → '));

  /* K–Pg pile: deal two, extras add five */
  key(']'); key('ArrowRight'); await wait(20);
  const kh = d.querySelector('.seg:not(.off) .item-balance:not(.off)');
  check('K–Pg pile shows 11 with extras on', kh.querySelector('.pile').textContent === '11', kh.querySelector('.pile').textContent);
  key('d'); key('d'); await wait(5);
  check('dealt two to the tray', Object.values(w.Deck.peek('bal-kpg').zone).filter((z) => z === 'tray').length === 2);
  key('d', { shiftKey: true }); await wait(5);
  for (const id of ['ir', 'qz', 'sph', 'crater', 'line', 'age']) place(kh, id, 300, 300);
  await wait(5);
  check('six on one pan: tilt stops at 20°', /rotate\(-20deg\)/.test(tiltOf(kh)), tiltOf(kh));
  check('extras off: extra cards leave the pan', (key('x'), /rotate\(-16deg\)/.test(tiltOf(kh))), tiltOf(kh));

  /* feathers: specimens arrive one per build */
  key(']'); for (let i = 0; i < 5; i++) key('ArrowRight'); await wait(20);
  const fh = d.querySelector('.seg:not(.off) .item-balance:not(.off)');
  const visible = [...fh.querySelectorAll('.card')].filter((c) => c.style.opacity === '1').map((c) => c.dataset.id);
  check('three specimens by build 5', visible.join(',') === 'sino,caud,micro', pos() + ' ' + visible.join(','));

  /* focus and flip */
  fh.querySelector('.card[data-id="caud"] .card-flip').click(); await wait(400);
  const big = d.querySelector('.focus .big');
  check('card opens big and turns over', big && big.classList.contains('flipped'));
  key('Escape'); await wait(300);
  check('escape closes it', !d.querySelector('.focus'));

  /* reset */
  const r = d.querySelector('#reset'); r.click(); r.click(); await wait(20);
  check('reset clears state and goes home', pos() === '#0' && Object.keys((w.Deck.peek('bal-tric') || {}).zone || {}).length === 0 && !d.body.classList.contains('answers'), pos());

  console.log(errors.length ? '\nERRORS:\n' + errors.join('\n') : '\nno script errors');
  console.log(`${checks - fails}/${checks} checks passed`);
  w.close();
  process.exit(fails || errors.length ? 1 : 0);
});
