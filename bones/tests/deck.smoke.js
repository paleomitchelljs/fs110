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
const pos = () => { const p = w.Deck.where(); return '#' + p.s + (p.b ? '.' + p.b : ''); };
const on = () => [...d.querySelectorAll('.seg:not(.off) .item:not(.off)')].map((e) => e.className.replace('item ', '')).join(', ');
const here = (sel) => d.querySelector('.seg:not(.off) .item:not(.off)' + (sel ? ' ' + sel : ''));
const bal = () => d.querySelector('.seg:not(.off) .item-balance:not(.off)');
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
const LEFT = [300, 300], RIGHT = [1220, 300], PIVOT = [760, 150], FLOOR = [760, 540];
const tiltOf = (host) => host.querySelector('.bal-beamg').style.transform;
const shown = (host) => [...host.querySelectorAll('.card')].filter((c) => c.style.opacity === '1').map((c) => c.dataset.id);
async function to(s, b) { key(']'); await wait(2); while (w.Deck.where().s < s) { key(']'); await wait(2); } for (let i = 0; i < b; i++) key('ArrowRight'); await wait(20); }
let checks = 0, fails = 0;
const check = (name, ok, detail) => { checks++; if (!ok) fails++; console.log(`${ok ? 'ok  ' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`); };

w.addEventListener('load', async () => {
  await wait(50);
  check('deck started', !!w.Deck && d.querySelector('.seg') !== null, pos());
  check('title card shows the bone drawing', !!here('img.bone') && here('img.bone').getAttribute('src') === 'img/bone.png');

  /* forward through everything, logging what is on screen */
  const seen = [];
  let last = '';
  for (let i = 0; i < 300; i++) {
    seen.push(pos() + '  ' + on());
    key('ArrowRight');
    await wait(5);
    if (pos() === last) break;
    last = pos();
  }
  if (process.env.VERBOSE) console.log(seen.join('\n'));
  check('the deck ends on Spinosaurus', w.Deck.content.segments[w.Deck.where().s].id === 'spino' && w.Deck.content.segments.at(-1).id === 'spino', pos());
  for (let i = 0; i < 300 && pos() !== '#0'; i++) { key('ArrowLeft'); await wait(2); }
  check('back to the title', pos() === '#0', pos());

  key('p'); key('x');
  check('answers and extras on', d.body.classList.contains('answers') && d.body.classList.contains('extras'));

  /* hook: opens on Cope's headless skeleton; you drag the skull on; then the two reconstructions */
  key(']'); await wait(5);
  const skull = () => here('.el-skull').style.transform;
  check('hook opens headless, skull loose (not an extra build)', pos() === '#1' && !w.Deck.content.segments[1].builds[0].extra && /translate\(752\.5px, 24px\) scaleX\(1\)/.test(skull()), pos() + ' ' + skull());
  key('ArrowRight'); await wait(5);
  check('hook has no prompt lines, only the pictures', d.querySelector('.prompt-text').textContent === '');
  check('skull on the tail end, both figures up', /translate\(1350px, 117px\) scaleX\(1\)/.test(skull()) && d.querySelectorAll('.seg:not(.off) .el-fig').length === 2 && !d.querySelector('.seg:not(.off) .el-fig.off'), skull());

  /* framework */
  key(']'); await wait(5);
  check('framework opens on HOW DO YOU KNOW?', /^item-title( play)?$/.test(on()) && /HOW DO YOU KNOW/.test(here().textContent), on());
  key('ArrowRight'); await wait(5);
  check('first icon on at build 1', d.querySelectorAll('.seg:not(.off) .bi.on').length === 1);
  check('rail not up yet', d.querySelector('.rail').classList.contains('off'));

  /* Elasmosaurus on the balance */
  key(']'); await wait(20);
  let h = bal();
  check('elasmo: rail up, Claim lit', !d.querySelector('.rail').classList.contains('off') && d.querySelector('.ri.lit').dataset.k === 'claim');
  check('elasmo: pans labelled with the two reconstructions', [...h.querySelectorAll('.hyp img')].map((i) => i.getAttribute('src')).join(' ') === 'img/cope-1869.png img/cope-1870.png');
  digit(1); await wait(2);
  check('no voting before the predict build', JSON.stringify(w.Deck.peek('bal-elasmo').votes) === '[0,0]');
  key('ArrowRight'); await wait(5);
  digit(2); digit(2); digit(2); digit(1); digit(2, true);
  h.querySelector('.hyp-1').click();
  check('predict: votes from keys and clicks', JSON.stringify(w.Deck.peek('bal-elasmo').votes) === '[1,3]', JSON.stringify(w.Deck.peek('bal-elasmo').votes));
  check('votes show as dots', h.querySelectorAll('.hyp-1 .hyp-votes i').length === 3);
  key('ArrowRight'); await wait(5);
  check('first card dealt, big, in the tray', shown(h).join() === 'run' && h.querySelector('.card[data-id="run"]').classList.contains('fresh'));
  digit(1); await wait(2);
  check('votes frozen after the predict build', JSON.stringify(w.Deck.peek('bal-elasmo').votes) === '[1,3]');
  place(h, 'run', ...PIVOT); await wait(5);
  check('a card on the pivot tips nothing', /rotate\(0deg\)/.test(tiltOf(h)), tiltOf(h));
  key('ArrowRight'); await wait(5);
  check('next card dealt, the last one no longer big', shown(h).join() === 'run,chevrons' && !h.querySelector('.card[data-id="run"]').classList.contains('fresh'));
  place(h, 'chevrons', ...RIGHT); await wait(5);
  check('one card on the right: 4°', /rotate\(4deg\)/.test(tiltOf(h)), tiltOf(h));
  for (let i = 0; i < 4; i++) key('ArrowRight');
  await wait(5);
  place(h, 'famous', ...FLOOR); await wait(5);
  check('a card on the floor tips nothing', w.Deck.peek('bal-elasmo').zone.famous === 'floor' && /rotate\(4deg\)/.test(tiltOf(h)), tiltOf(h));
  key('ArrowRight'); await wait(5);
  check('extra card dealt with extras on', shown(h).includes('lizards'), pos());
  key('ArrowRight'); await wait(10);
  check('Elasmosaurus ends on the discussion, no famous-name line, no reveal', pos() === '#3.9' && d.querySelector('.prompt-text').textContent === 'Which cards did the tipping?' &&
    !w.Deck.content.segments[3].builds.some((x) => /famous name|Who said it/.test(x.prompt || '')), pos());

  /* feathers comes straight after Elasmosaurus: the photo, then specimens one per build */
  key('ArrowRight'); await wait(10);
  check('next press goes straight to feathers', w.Deck.content.segments[w.Deck.where().s].id === 'feathers', pos());
  check('feathers opens on the Sinosauropteryx photo', !!here('img.photo') && /sinosauropteryx\.jpg$/.test(here('img.photo').getAttribute('src')), on());
  for (let i = 0; i < 5; i++) key('ArrowRight');
  await wait(20);
  h = bal();
  check('feathers: Sinosauropteryx, the lizard card, then Caudipteryx by build 5', shown(h).join() === 'sino,lizards,caud', pos() + ' ' + shown(h).join());

  /* focus and flip */
  h.querySelector('.card[data-id="caud"] .card-flip').click(); await wait(400);
  const big = d.querySelector('.focus .big');
  check('card opens big and turns over', big && big.classList.contains('flipped'));
  key('Escape'); await wait(300);
  check('escape closes it', !d.querySelector('.focus'));

  /* Triceratops: the two skulls, the growth arrow, room list (extra build), then the balance */
  key(']'); await wait(10);
  check('Triceratops follows feathers', w.Deck.content.segments[w.Deck.where().s].id === 'tric', pos());
  check('Triceratops opens on the two skulls, captioned', d.querySelectorAll('.seg:not(.off) .pair-img').length === 2 &&
    [...d.querySelectorAll('.seg:not(.off) .pair-cap')].map((c) => c.textContent).join('|') === 'Triceratops|Torosaurus');
  check('no growth arrow yet', !here('.pair-arrow').classList.contains('on'));
  key('ArrowRight'); await wait(10);
  check('growth arrow on "one animal, growing?"', here('.pair-arrow').classList.contains('on'));
  const toro = [...d.querySelectorAll('.seg:not(.off) .pair-img')].map((i) => parseFloat(i.style.height));
  check('skulls at one scale (Torosaurus 232/210 the height of Triceratops)', Math.abs(toro[1] / toro[0] - 232 / 210) < 0.01, toro.join(' vs '));
  key('ArrowRight'); await wait(10);
  check('at the Triceratops room list', on() === 'item-roomlist', pos() + ' ' + on());
  digit(2); digit(5); await wait(5);
  let chips = [...d.querySelectorAll('.seg:not(.off) .item:not(.off) .rl-chip')].map((e) => e.textContent);
  check('two chips, in the order said', chips.join('|') === 'Sex|Squashed in the rock', chips.join('|'));
  key('n'); await wait(10);
  const inp = d.querySelector('.seg:not(.off) .rl-input');
  inp.value = 'Disease';
  inp.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
  await wait(5);
  digit(2, true); await wait(5);
  chips = [...d.querySelectorAll('.seg:not(.off) .item:not(.off) .rl-chip')].map((e) => e.textContent);
  check('typed item kept, shift-2 took Sex back', chips.join('|') === 'Squashed in the rock|Disease', chips.join('|'));
  key('ArrowRight'); await wait(10);
  check('Triceratops pans labelled with the skull pair: ≠ and →', [...bal().querySelectorAll('.hyp-pair b')].map((b) => b.textContent).join('|') === '≠|→' &&
    bal().querySelectorAll('.hyp-pair img').length === 4);
  check('the subadult card has its new wording', w.Deck.content.segments.find((x) => x.id === 'tric').items.some((it) => it.cards && it.cards.some((c) => c.text === 'Subadult Torosaurus specimens')));

  /* K–Pg: the cap, and extras */
  key(']'); await wait(10);
  check('K–Pg follows Triceratops', w.Deck.content.segments[w.Deck.where().s].id === 'kpg', pos());
  check('K–Pg opens on the boundary photo', !!here('img.photo') && /kpg-boundary\.jpg$/.test(here('img.photo').getAttribute('src')), on());
  for (let i = 0; i < 13; i++) key('ArrowRight');
  await wait(10);
  h = bal();
  check('K–Pg: icons for impact and volcanoes', h.querySelectorAll('.hyp-icon').length === 2);
  check('all eleven cards dealt by build 13 with extras on', shown(h).length === 11, pos() + ' ' + shown(h).length);
  for (const id of ['ir', 'qz', 'sph', 'crater', 'line', 'age']) place(h, id, ...LEFT);
  await wait(5);
  check('six on one pan: tilt stops at 20°', /rotate\(-20deg\)/.test(tiltOf(h)), tiltOf(h));
  key('x'); await wait(5);
  check('extras off: extra cards leave the pan and the extra builds', /rotate\(-16deg\)/.test(tiltOf(h)) && pos() === '#6.8', tiltOf(h) + ' ' + pos());
  key('x');

  /* the decline case: the figure, six cards, the dig, re-weigh, the funnel, the figure again */
  key(']'); await wait(10);
  check('the decline case follows K–Pg and opens on the Condamine figure with its credit', w.Deck.content.segments[w.Deck.where().s].id === 'signor' &&
    /condamine2021-fig\.jpg$/.test(here('img.photo').getAttribute('src')) && /CC BY 4\.0/.test(here('figcaption').textContent) &&
    d.querySelector('.prompt-text').textContent === 'Were dinosaurs in decline before their extinction?', pos());
  key('ArrowRight'); await wait(10);
  h = bal();
  check('the two hypotheses as sorted sketches', h.querySelectorAll('.hyp .sketch').length === 2);
  for (let i = 0; i < 6; i++) key('ArrowRight');
  await wait(10);
  check('six cards dealt', shown(h).length === 6, pos() + ' ' + shown(h).join());
  place(h, 'short', ...RIGHT); place(h, 'rates', ...RIGHT); place(h, 'herbivores', ...RIGHT);
  place(h, 'below', ...LEFT); place(h, 'hellcreek', ...LEFT); place(h, 'rock', ...PIVOT); await wait(5);
  check('as a room might place them first: leaning to decline', /rotate\(4deg\)/.test(tiltOf(h)), tiltOf(h));
  key('ArrowRight'); await wait(4500);
  const sg = here('.sg').parentNode;
  const dotsOn = sg.querySelectorAll('.sg-dot.on').length;
  const wantDots = w.Sim.draws(w.Sim.SEED).reduce((n, row) => n + w.Sim.finds(row, 0.08).length, 0);
  check('dig shows every find at p = 0.08', dotsOn === wantDots, `${dotsOn} of ${wantDots}`);
  key('ArrowRight'); await wait(20);
  check('sorted', sg.classList.contains('sorted'));
  key('ArrowRight'); await wait(20);
  check('true ranges (answers on)', sg.classList.contains('show-truth'));
  key('ArrowRight'); key('ArrowUp'); key('ArrowUp'); await wait(20);
  check('p up to 0.10, more finds', w.Deck.peek('signor').p === 0.1 && sg.querySelectorAll('.sg-dot.on').length > dotsOn);
  key('ArrowRight'); await wait(20);
  h = bal();
  check('back on the balance, the cards where we left them', w.Deck.peek('bal-signor').zone.short === 'right' && /rotate\(4deg\)/.test(tiltOf(h)), tiltOf(h));
  place(h, 'short', ...PIVOT); await wait(5);
  check('"fall short" moved to the pivot: placed by their backs, level', /rotate\(0deg\)/.test(tiltOf(h)), tiltOf(h));
  key('ArrowRight'); await wait(20);
  check('funnel', on().includes('item-funnel'), pos() + ' ' + on());
  digit(3); digit(2); digit(6); digit(1); await wait(1500);
  const counts = [...d.querySelectorAll('.seg:not(.off) .fn-count b')].map((e) => e.textContent);
  const heads = [...d.querySelectorAll('.seg:not(.off) .fn-head')].sort((a, b) => parseFloat(a.style.left) - parseFloat(b.style.left)).map((e) => e.textContent);
  check('gates in funnel order, not the order said', heads.join('|') === 'Not buried|Destroyed since|Not recognized', heads.join('|'));
  check('counts fall through the gates', counts.length === 4 && counts[0] === '1,000' && counts.every((c, i) => i === 0 || +c.replace(',', '') <= +counts[i - 1].replace(',', '')), counts.join(' → '));
  check('never-there lane', !!d.querySelector('.seg:not(.off) .fn-never'));
  key('ArrowRight'); key('ArrowRight'); await wait(20);
  check('closes on the figure again', !!here('img.photo') && /condamine/.test(here('img.photo').getAttribute('src')) && d.querySelector('.prompt-text').textContent === '', pos());

  /* Spinosaurus: the last case, where the cards pull both ways */
  key(']'); await wait(10);
  h = bal();
  check('Spinosaurus comes last, after the decline case; no debrief', w.Deck.content.segments[w.Deck.where().s].id === 'spino' && !w.Deck.content.segments.some((x) => x.id === 'debrief'), pos());
  key('ArrowRight'); digit(1); digit(2); digit(2);
  for (let i = 0; i < 6; i++) key('ArrowRight');
  await wait(10);
  check('six cards dealt', shown(h).length === 6, pos() + ' ' + shown(h).join());
  place(h, 'dense', ...LEFT); place(h, 'tail', ...LEFT); place(h, 'floats', ...RIGHT); place(h, 'sail', ...RIGHT);
  place(h, 'isotopes', ...PIVOT); place(h, 'jaws', ...PIVOT); await wait(5);
  check('placed by their backs, the scale ends level', /rotate\(0deg\)/.test(tiltOf(h)), tiltOf(h));
  key('ArrowRight'); await wait(5);
  check('closing prompt', d.querySelector('.prompt-text').textContent === 'Evidence pulls both ways. What would settle it?');

  /* reset */
  const r = d.querySelector('#reset'); r.click(); r.click(); await wait(20);
  check('reset clears state and goes home', pos() === '#0' && Object.keys((w.Deck.peek('bal-elasmo') || {}).zone || {}).length === 0 && !d.body.classList.contains('answers'), pos());

  console.log(errors.length ? '\nERRORS:\n' + errors.join('\n') : '\nno script errors');
  console.log(`${checks - fails}/${checks} checks passed`);
  w.close();
  process.exit(fails || errors.length ? 1 : 0);
});
