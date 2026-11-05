/* Smoke test in jsdom: every build of every segment at every level, the clock's
 * session packing, a vote, the sort slide's snap, the timeline cursor, the
 * lever and the density line. Needs jsdom, which this repo doesn't ship:
 *   JSDOM=/path/to/node_modules/jsdom node therizinos/tests/deck.smoke.js */
'use strict';
const path = require('path');
const { JSDOM, VirtualConsole } = require(process.env.JSDOM || 'jsdom');
const file = path.join(__dirname, '..', 'index.html');
let checks = 0, fails = 0;
const check = (name, ok, detail) => { checks++; if (!ok) fails++; console.log(`${ok ? 'ok  ' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`); };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const ready = async (w) => { for (let i = 0; i < 60 && !(w.Deck && w.Deck.content); i++) await wait(100); };

function open(level) {
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', (e) => { if (!/fonts.googleapis/.test(e.message)) errors.push('jsdom: ' + (e.stack || e.message)); });
  vc.on('error', (...a) => errors.push('console.error: ' + a.join(' ')));
  const dom = new JSDOM(require('fs').readFileSync(file, 'utf8'), {
    url: 'file://' + file + '#L' + level, runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true, virtualConsole: vc,
    beforeParse(w) {
      w.matchMedia = (q) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} });
      w.Element.prototype.setPointerCapture = () => {};
      w.HTMLCanvasElement.prototype.getContext = () => ({ setTransform() {}, clearRect() {}, scale() {}, beginPath() {}, arc() {}, fill() {}, stroke() {} });
      w.onerror = (msg, src, line, col, err) => errors.push(`onerror: ${msg} @ ${src}:${line} ${err && err.stack}`);
    }
  });
  return { w: dom.window, d: dom.window.document, errors };
}

(async () => {
  for (const level of [1, 2, 3]) {
    const { w, d, errors } = open(level);
    await ready(w);
    const D = w.Deck, segs = D.content.segments;
    const key = (k, x) => d.body.dispatchEvent(new w.KeyboardEvent('keydown', Object.assign({ key: k, bubbles: true }, x)));
    const seen = new Set(); let n = 0;
    for (let i = 0; i < 900; i++) {
      const p = D.where(); seen.add(p.s);
      const before = p.s + '.' + p.b; key('ArrowRight'); n++;
      const q = D.where(); if (q.s + '.' + q.b === before) break;
    }
    const expect = segs.filter((s) => (s.tier || 1) <= level).length;
    check(`level ${level}: every segment reached`, seen.size === expect, `${seen.size}/${expect} in ${n} presses`);
    check(`level ${level}: no script errors`, errors.length === 0, errors[0] || '');
    const sched = D.sched(), mins = {};
    segs.forEach((s, i) => { if (sched[i]) mins[sched[i].sess] = (mins[sched[i].sess] || 0) + (s.min || 1); });
    console.log(`      level ${level} minutes per session: ${JSON.stringify(mins)}`);
    check(`level ${level}: sessions stay near 50`, Object.values(mins).every((m) => m <= 56), JSON.stringify(mins));
    for (let i = 0; i < 900; i++) key('ArrowLeft');
    check(`level ${level}: back to the start`, D.where().s === 0 && D.where().b === 0);
    // ] and [ skip segments hidden at this level
    for (let i = 0; i < 200; i++) { const a = D.where().s; key(']'); if (D.where().s === a) break; }
    const shownAt = segs.map((s, i) => ((s.tier || 1) <= level ? i : -1)).filter((i) => i >= 0);
    check(`level ${level}: ] reaches the last segment`, D.where().s === shownAt[shownAt.length - 1], 'stopped at ' + segs[D.where().s].id);
    for (let i = 0; i < 200; i++) { const a = D.where().s; key('['); if (D.where().s === a) break; }
    check(`level ${level}: [ reaches the first segment`, D.where().s === 0, 'stopped at ' + segs[D.where().s].id);
  }

  // level 3 detail checks
  const { w, d, errors } = open(3);
  await ready(w);
  const D = w.Deck, segs = D.content.segments;
  const key = (k, x) => d.body.dispatchEvent(new w.KeyboardEvent('keydown', Object.assign({ key: k, bubbles: true }, x)));
  const goTo = (id) => { const t = segs.findIndex((s) => s.id === id); while (D.where().s < t) key(']'); while (D.where().s > t) key('['); return segs[t]; };
  const press = (n) => { for (let i = 0; i < n; i++) key('ArrowRight'); };

  key('l'); key('l');
  check('L key cycles levels', D.flags.level === 2 || D.flags.level === 1, 'level ' + D.flags.level);
  D.setLevel(3);

  // sort slide: ten cards dealt, final build snaps every card to its bin
  const sort = goTo('sort1'); press(sort.builds.length - 1);
  let host = d.querySelector('.seg:not(.off) .item-sort');
  check('sort: 10 cards dealt and revealed', host.querySelectorAll('.pl-card:not(.off)').length === 10 && host.querySelectorAll('.pl-card.revealed').length === 10);
  check('sort: no prompt text on screen', d.querySelector('.prompt-text').textContent === '');

  // timeline: 14 events, found-row first
  const g = goTo('guess'); press(g.builds.length - 1);
  await wait(1200);
  host = d.querySelector('.seg:not(.off) .item-guess');
  check('guess: all 14 pills on at the end', host.querySelectorAll('.gs-pill.on').length === 14, host.querySelectorAll('.gs-pill.on').length + ' pills');

  // figure scene: pills come one per build, a zone lights, the vote bar arrives last
  const th = goTo('display'); press(2);
  host = d.querySelector('.seg:not(.off) .item-fig');
  check('display: two pills shown at build 2', host.querySelectorAll('.fg-pill.shown').length === 2);
  check('display: the second pill is lit', host.querySelectorAll('.fg-pill.on').length === 1);
  press(th.builds.length - 3);
  host = d.querySelector('.seg:not(.off)');
  const sure = host.querySelector('.item-sure');
  check('display: vote bar present', !!sure && !sure.classList.contains('off'));
  key('3', { code: 'Digit3' }); key('3', { code: 'Digit3' }); key('4', { code: 'Digit4' });
  const dots = [...sure.querySelectorAll('.g-col')].map((x) => x.children.length);
  check('votes counted', JSON.stringify(dots) === '[0,0,2,1,0]', JSON.stringify(dots));
  check('call saved for the wall', D.callOf('display') != null);

  // trait grid: columns arrive, counts are right, photos at the end
  const f = goTo('falcarius');
  host = d.querySelector('.seg:not(.off) .item-traitgrid');
  const cnt = () => [...host.querySelectorAll('.tr-n')].map((e) => e.textContent).join(',');
  check('traits: Falcarius column 8 primitive, 0 in between, 1 derived', cnt() === '8,0,1', cnt());
  press(3);
  check('traits: photo of the teeth shown', host.querySelector('.tg-r').classList.contains('on'));
  press(1);
  check('traits: second photo shown', host.querySelector('.tg-r img').getAttribute('src').indexOf('feat-jaw') >= 0);

  // solo: lever, density, dots
  goTo('lever');
  host = d.querySelector('.seg:not(.off) .item-solo');
  check('lever: opens at the Duonychus sheath, × 0.71', host.querySelector('.lv-ratio').textContent === '× 0.71', host.querySelector('.lv-ratio').textContent);
  check('lever: bone drawn in 30 coloured pieces', host.querySelectorAll('.lv-seg').length === 30);
  goTo('nest');
  host = d.querySelector('.seg:not(.off) .item-solo');
  check('density: line at 1 per 100 m² keeps 4 of 8', host.querySelector('.dn-cnt').textContent === '4 of 8', host.querySelector('.dn-cnt').textContent);

  // the wall of evidence
  goTo('wall');
  host = d.querySelector('.seg:not(.off) .item-wall');
  const shown = () => [...host.querySelectorAll('.wl-tile')].filter((e) => e.style.display !== 'none').length;
  check('wall: 12 tiles at level 3', shown() === 12, shown() + ' tiles');
  D.setLevel(1);
  host = d.querySelector('.seg:not(.off) .item-wall');
  check('wall: 9 tiles at level 1', shown() === 9, shown() + ' tiles');
  check('wall: no prompt text on screen', d.querySelector('.prompt-text').textContent === '');
  check('no script errors', errors.length === 0, errors[0] || '');
  console.log(`\n${checks - fails}/${checks} checks passed`);
  process.exit(fails ? 1 : 0);
})();
