/* Smoke test in jsdom: every build of every segment at every level, the clock's
 * session packing, the order of the parts and their numbers, the theropod tree, the
 * composite, Stromer's plates, a vote and the wall. jsdom does no layout, so this
 * cannot see overflow or overlap. Needs jsdom, which this repo doesn't ship:
 *   JSDOM=/path/to/node_modules/jsdom node spinos/tests/deck.smoke.js */
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

  // order: theropods, then species up the tree, then Spinosaurus by year
  const at = (id) => segs.findIndex((s) => s.id === id);
  check('theropod tree right after the cover', at('title') === 0 && at('theropods') === 1);
  check('species walk moves up the tree', ['baryonyx', 'suchomimus', 'irritator', 'known'].every((id, i, a) => i === 0 || at(a[i - 1]) < at(id)));
  check('species before Spinosaurus', at('known') < at('p-lost'));
  check('Spinosaurus runs by year', ['stromer', 'spinob', 'munich', 'v4047', 'isotopes', 'site', 'float', 'eyes', 'tail', 'bone', 'sereno', 'cm', 'gordon', 'mirabilis', 'who', 'wall'].every((id, i, a) => i === 0 || at(a[i - 1]) < at(id)));

  // the theropod tree: the published figure whole, then a zoom on each group, ending on spinosaurids
  const th0 = goTo('theropods');
  let host = d.querySelector('.seg:not(.off) .item-fig');
  check('tree: the published figure, with no zoom yet', host.querySelector('.fg-img img').getAttribute('src').indexOf('gat16-fig2') >= 0 && host.querySelectorAll('.fg-aside .pl2-p').length === 0);
  press(th0.builds.length - 1);
  check('tree: last zoom is the spinosaurids', host.querySelector('.fg-aside').textContent.indexOf('Spinosaurids') >= 0);
  const zoneNames = th0.items[0].zones.map((z) => z.label.split(':')[0]).join();
  check('tree: walks up the tree with spinosaurids in order, then ends on them', zoneNames === 'Ceratosaurs,Spinosaurids,Allosauroids,Tyrannosauroids,Maniraptorans,Spinosaurids', zoneNames);

  // the timeline: every pill starts at its year, inside its row
  goTo('who');
  host = d.querySelector('.seg:not(.off) .item-guess');
  const pills = [...host.querySelectorAll('.gs-pill')].map((e) => ({ year: +e.querySelector('.gs-yr').textContent, left: parseFloat(e.style.left), right: parseFloat(e.style.left) + parseFloat(e.style.width) }));
  const dotAt = [...host.querySelectorAll('.gs-dot')].map((e) => parseFloat(e.style.left));
  check('timeline: each pill starts at the dot for its year', pills.every((p, i) => Math.abs(p.left + 18 - dotAt[i]) < 0.01));
  check('timeline: later years start further right', pills.every((p, i) => i === 0 || (p.year === pills[i - 1].year ? p.left === pills[i - 1].left : p.left > pills[i - 1].left)));
  check('timeline: no pill runs past its row', pills.every((p) => p.right <= 1552), Math.max(...pills.map((p) => p.right)).toFixed(0));

  // the composite: one build per source, each lighting a zone
  const comp = goTo('composite');
  host = d.querySelector('.seg:not(.off) .item-fig');
  check('composite: the published Fig. S3', host.querySelector('.fg-img img').getAttribute('src').indexOf('ibrsm-figS3') >= 0);
  check('composite: a pill per source', host.querySelectorAll('.fg-pill').length === comp.builds.length - 1);

  // every skeleton figure names what it shows
  const skeletons = ['sereno', 'suchomimus', 'neotype', 'bone', 'ibero', 'sail'];
  skeletons.forEach((id) => {
    const cap = JSON.stringify(segs[at(id)]);
    check(`${id}: caption says what the colors or specimens are`, /Red:|Orange:|FSAC-KK/.test(cap));
  });

  // Gordon's method: a build-up right before the result, with a step per build, ending on archosaurs
  check('Gordon method comes right before the result', at('gormethod') === at('gordon') - 1);
  const gm = goTo('gormethod');
  host = d.querySelector('.seg:not(.off) .item-fig');
  const gmSrc = () => host.querySelector('.fg-img img').getAttribute('src');
  const gmShown = () => host.querySelectorAll('.fg-pill.shown').length;
  check('Gordon method: opens on Fig. 1 with no steps yet', gmSrc() === 'img/gor25-fig1.jpg' && gmShown() === 0, gmSrc());
  press(gm.builds.length - 1);
  check('Gordon method: every step is on screen at the end', gmShown() === gm.items[0].zones.length, String(gmShown()));
  check('Gordon method: ends on the archosaur curves', gmSrc() === 'img/gor25-fig3a.jpg', gmSrc());

  // Stromer's plates: one, then the other on advance
  const st = goTo('stromer');
  host = d.querySelector('.seg:not(.off) .item-plate');
  const on = () => [...host.querySelectorAll('.pl2-p.shown img')].map((e) => e.getAttribute('src')).join();
  check('Stromer: Tafel I first', on() === 'img/sto15-tafI.jpg', on());
  press(st.builds.length - 1);
  check('Stromer: Tafel II on advance', on().indexOf('sto15-tafII') >= 0, on());

  // no verdicts on ambiguous evidence, whichever paper they came from
  const words = JSON.stringify(segs).match(/unknown|untested|speculation|weakly supported|a hypothesis|: uncertain/gi);
  check('no verdict words on the slides', !words, (words || []).join());

  // from the buoyancy slide on, header cards are a topic or a paper's claim; Brusatte's quote is the exception
  const asked = segs.slice(at('float')).flatMap((s) => s.items.map((i) => i.head && i.head.claim)).filter((c) => c && c.includes('?') && !c.includes('grizzly'));
  check('no question cards from the buoyancy slide on', asked.length === 0, asked.join(' | '));

  // the question rail says the plain words
  const rail = [...d.querySelectorAll('.ri span')].map((e) => e.textContent).join();
  check('rail words', rail === 'Claim,Evidence,Alternatives,Test,Certainty', rail);

  // claim slide: the vote bar arrives last
  const fl = goTo('float');
  press(fl.builds.length - 1);
  host = d.querySelector('.seg:not(.off)');
  const sure = host.querySelector('.item-sure');
  check('float: vote bar present', !!sure && !sure.classList.contains('off'));
  key('3', { code: 'Digit3' }); key('3', { code: 'Digit3' }); key('4', { code: 'Digit4' });
  const dots = [...sure.querySelectorAll('.g-col')].map((x) => x.children.length);
  check('votes counted', JSON.stringify(dots) === '[0,0,2,1,0]', JSON.stringify(dots));
  check('call saved for the wall', D.callOf('float') != null);

  // every wall tile has a slide with a vote bar at that tile's level or lower
  const wallDef = segs[at('wall')].items[0];
  wallDef.tiles.forEach((x) => {
    const s = segs.find((g) => g.items.some((it) => it.kind === 'sure' && it.id === x.id));
    check(`wall tile ${x.id} has a vote`, !!s && (s.tier || 1) <= (x.tier || 1));
  });

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
  check('wall: 13 tiles at level 3', shown() === 13, shown() + ' tiles');
  D.setLevel(1);
  host = d.querySelector('.seg:not(.off) .item-wall');
  check('wall: 12 tiles at level 1', shown() === 12, shown() + ' tiles');
  check('wall: no prompt text on screen', d.querySelector('.prompt-text').textContent === '');
  check('no script errors', errors.length === 0, errors[0] || '');
  console.log(`\n${checks - fails}/${checks} checks passed`);
  process.exit(fails ? 1 : 0);
})();
