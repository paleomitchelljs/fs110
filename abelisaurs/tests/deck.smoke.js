/* Smoke test in jsdom: every build of every segment at every level, the clock's
 * session packing, the order of the parts and their numbers, the theropod tree, the
 * example species, the sort slide's snap, a vote and the wall. jsdom does no layout, so this
 * cannot see overflow or overlap. Needs jsdom, which this repo doesn't ship:
 *   JSDOM=/path/to/node_modules/jsdom node abelisaurs/tests/deck.smoke.js */
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
    check(`level ${level}: sessions stay near 50`, Object.values(mins).every((m) => m <= 56), JSON.stringify(mins));    for (let i = 0; i < 900; i++) key('ArrowLeft');
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
  const goTo = (id) => {
    const t = segs.findIndex((s) => s.id === id);
    for (let i = 0; D.where().s < t && i < 100; i++) key(']');
    for (let i = 0; D.where().s > t && i < 100; i++) key('[');
    if (D.where().s !== t) check(`goTo reached ${id}`, false, `stuck at ${segs[D.where().s].id}`);
    return segs[t];
  };
  const press = (n) => { for (let i = 0; i < n; i++) key('ArrowRight'); };
  const fs = require('fs');

  // every picture a segment names exists on disk
  const srcs = new Set(JSON.stringify(segs).match(/img\/[A-Za-z0-9_.-]+\.(jpg|png)/g));
  const missing = [...srcs].filter((f) => !fs.existsSync(path.join(__dirname, '..', f)));
  check('all ' + srcs.size + ' pictures exist', missing.length === 0, missing.join(' '));

  // order: the tree first, the overview before any one animal, Carnotaurus after the rest
  const at = (id) => segs.findIndex((s) => s.id === id);
  check('tree right after the cover', at('title') === 0 && at('theropods') === 1);
  check('example species before any single animal', at('family') < Math.min(at('limus'), at('rugops'), at('skorp'), at('meet')));
  check('Carnotaurus after every other animal', ['vesper', 'arco', 'chena', 'koleken', 'vito'].every((id) => at(id) < at('p-carnotaurus')));

  // the theropod tree: the published figure whole, then a zoom on the abelisaurs
  goTo('theropods');
  let host = d.querySelector('.seg:not(.off) .item-fig');
  check('tree: the published figure, with no zoom yet', host.querySelector('.fg-img img').getAttribute('src').indexOf('gat16-fig2') >= 0 && host.querySelectorAll('.fg-aside .pl2-p').length === 0);
  press(1);
  check('tree: second build zooms', host.querySelectorAll('.fg-aside .pl2-p').length === 1);

  // example species: each zooms beside the figure; the last picture gets its own wide box
  const fam = goTo('family'); press(1);
  host = d.querySelector('.seg:not(.off) .item-fig');
  check('family: first species zooms, with its picture', host.querySelectorAll('.fg-aside .pl2-p').length === 2);
  press(fam.builds.length - 2);
  check('family: last build shows the scale picture', host.querySelector('.fg-img img').getAttribute('src').indexOf('abelisauridae-scale') >= 0);
  check('family: scale picture is wide', parseInt(host.querySelector('.fg-img').style.width, 10) > 1000, host.querySelector('.fg-img').style.width);

  // the ceratosaur tree: the published figure, then a zoom on each clade
  const del = goTo('tree');
  host = d.querySelector('.seg:not(.off) .item-fig');
  check('Delcourt tree shows at level 1', (del.tier || 1) === 1);
  check('Delcourt tree: the published figure', host.querySelector('.fg-img img').getAttribute('src').indexOf('del18-fig1') >= 0);
  press(2);
  check('Delcourt tree: second zoom is the abelisaurids', host.querySelector('.fg-aside').textContent.indexOf('Abelisaurids') >= 0);

  // the locality map: the published figure, with a key to its numbers
  goTo('found');
  host = d.querySelector('.seg:not(.off) .item-plate');
  check('map: the published figure', host.querySelector('.pl2-img img').getAttribute('src').indexOf('lon17-fig11') >= 0);
  check('map: 13 rows in the key', host.querySelectorAll('.pl2-key span').length === 13);

  // tooth replacement: one card between the figures, only a citation under each
  goTo('teeth');
  host = d.querySelector('.seg:not(.off) .item-plate');
  check('teeth: one card between the figures, none under them', host.querySelectorAll('.pl2-mid').length === 1 && host.querySelectorAll('.pl2-p .pl2-lab').length === 0);
  check('teeth: a citation under each figure', [...host.querySelectorAll('.pl2-cap')].every((e) => e.textContent === "D'Emic et al. 2019"));

  // Arcovenator: the reconstruction, and the tree in its own column
  goTo('arco');
  host = d.querySelector('.seg:not(.off) .item-plate');
  check('arco: reconstruction and tree only', host.querySelectorAll('.pl2-p').length === 2 && JSON.stringify(segs[at('arco')]).indexOf('tor14-fig2') < 0);

  // horns: the horns first, the stress model on the next build
  const horns = goTo('horns');
  host = d.querySelector('.seg:not(.off) .item-plate');
  const hornsOn = () => [...host.querySelectorAll('.pl2-p.shown img')].map((e) => e.getAttribute('src')).join();
  check('horns: horns only at first', hornsOn() === 'img/del18-fig4.jpg', hornsOn());
  press(1);
  check('horns: stress model on advance', hornsOn().indexOf('maz09-fig6') >= 0 && horns.builds.length === 3, hornsOn());

  // no verdicts on ambiguous evidence, whichever paper they came from
  const words = JSON.stringify(segs).match(/unknown|untested|speculation|weakly supported|a hypothesis|: uncertain/gi);
  check('no verdict words on the slides', !words, (words || []).join());

  // the question rail says the plain words
  const rail = [...d.querySelectorAll('.ri span')].map((e) => e.textContent).join();
  check('rail words', rail === 'Claim,Evidence,Alternatives,Test,Certainty', rail);

  // sort slide: four cards dealt, final build snaps every card to its bin
  const sort = goTo('who'); press(sort.builds.length - 1);
  host = d.querySelector('.seg:not(.off) .item-sort');
  check('sort: 4 cards dealt and revealed', host.querySelectorAll('.pl-card:not(.off)').length === 4 && host.querySelectorAll('.pl-card.revealed').length === 4);
  check('sort: no prompt text on screen', d.querySelector('.prompt-text').textContent === '');

  // claim slide: everything on screen at once, the vote bar arrives last
  const th = goTo('chena');
  host = d.querySelector('.seg:not(.off) .item-plate');
  check('chena: three pictures on at the first build', host.querySelectorAll('.pl2-p.shown').length === 3);
  press(th.builds.length - 1);
  host = d.querySelector('.seg:not(.off)');
  const sure = host.querySelector('.item-sure');
  check('chena: vote bar present', !!sure && !sure.classList.contains('off'));
  key('3', { code: 'Digit3' }); key('3', { code: 'Digit3' }); key('4', { code: 'Digit4' });
  const dots = [...sure.querySelectorAll('.g-col')].map((x) => x.children.length);
  check('votes counted', JSON.stringify(dots) === '[0,0,2,1,0]', JSON.stringify(dots));
  check('call saved for the wall', D.callOf('chena') != null);

  // part numbers count only the parts shown at the level, so none is skipped
  for (const lv of [3, 1]) {
    D.setLevel(lv);
    const cards = segs.filter((s) => (s.tier || 1) <= lv && s.items.some((i) => i.kind === 'title'));
    const nums = cards.map((s) => { goTo(s.id); return d.querySelector('.seg:not(.off) .pt-num').textContent; });
    check(`level ${lv}: part numbers run 1 to ${cards.length}`, nums.join() === cards.map((_, i) => i + 1).join(), nums.join());
  }
  D.setLevel(3);

  // the wall of evidence
  const wl = goTo('wall');
  host = d.querySelector('.seg:not(.off) .item-wall');
  const shown = () => [...host.querySelectorAll('.wl-tile')].filter((e) => e.style.display !== 'none').length;
  check('wall: 9 tiles at level 3', shown() === 9, shown() + ' tiles');
  D.setLevel(1);
  host = d.querySelector('.seg:not(.off) .item-wall');
  check('wall: 7 tiles at level 1', shown() === 7, shown() + ' tiles');
  check('wall: no prompt text on screen', d.querySelector('.prompt-text').textContent === '');
  check('no script errors', errors.length === 0, errors[0] || '');
  console.log(`\n${checks - fails}/${checks} checks passed`);
  process.exit(fails ? 1 : 0);
})();
