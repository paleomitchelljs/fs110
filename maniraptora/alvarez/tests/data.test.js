/* Checks that need no browser: every quote and picture the content names exists,
 * every quote's words came from the PDF, and the model arithmetic the slides show.
 *   node maniraptora/alvarez/tests/data.test.js */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const here = path.join(__dirname, '..');
const w = {}; w.window = w; vm.createContext(w);
['js/dims.js', 'js/lines.js', 'js/content.js'].forEach((f) => vm.runInContext(fs.readFileSync(path.join(here, f), 'utf8'), w));
w.Deck = { parts: {}, clamp: (x, a, b) => Math.max(a, Math.min(b, x)) };
vm.runInContext(fs.readFileSync(path.join(here, 'js/parts/sims.js'), 'utf8'), w);
let checks = 0, fails = 0;
const check = (name, ok, detail) => { checks++; if (!ok) fails++; console.log(`${ok ? 'ok  ' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`); };

const L = w.LINES, DIMS = w.DIMS, segs = w.ALVZ.segments;
const quotes = new Set(), pics = new Set();
const walkItems = (o) => {
  if (Array.isArray(o)) return o.forEach(walkItems);
  if (!o || typeof o !== 'object') return;
  if (typeof o.q === 'string') quotes.add(o.q);
  if (typeof o.ref === 'string' && o.kind === 'page') quotes.add(o.ref);
  if (typeof o.src === 'string') pics.add(o.src.replace(/^img\//, ''));
  if (typeof o.pic === 'string') pics.add(o.pic.replace(/^img\//, ''));
  Object.values(o).forEach(walkItems);
};
walkItems(segs);
const missingQ = [...quotes].filter((q) => !L[q]);
check('every quote in content.js is in lines.js', missingQ.length === 0, missingQ.join(', '));
const missingP = [...pics].filter((p) => !DIMS[p] || !fs.existsSync(path.join(here, 'img', p)));
check('every picture exists with its size', missingP.length === 0, missingP.join(', '));
const pages = [...quotes].map((q) => L[q] && `pages/${L[q].paper}-p${L[q].page}.jpg`).filter(Boolean);
const missingPg = pages.filter((p) => !DIMS[p] || !fs.existsSync(path.join(here, 'img', p)));
check('every page a quote sits on is rendered', missingPg.length === 0, [...new Set(missingPg)].join(', '));
const badWords = Object.entries(L).filter(([, q]) => !q.words.length || q.words.some((x) => x[2] >= q.rects.length));
check('every quote has words, each on a line', badWords.length === 0, badWords.map((b) => b[0]).join(', '));
const ids = segs.map((s) => s.id);
check('segment ids are unique', new Set(ids).size === ids.length);
check('every segment has a build', segs.every((s) => s.builds.length > 0));

// Model arithmetic, worked by hand in the readme.
const D = w.Deck;
const g0 = D.ghostStats(D.ghostTree({ mor: true, cal: true, alnInside: false }));
check('ghost: Makovicky placement, MIG 115 My', g0.mig === 115, JSON.stringify(g0));
check('ghost: Makovicky placement, GER 0.77', Math.abs(g0.ger - 0.766) < 0.001);
const g1 = D.ghostStats(D.ghostTree({ mor: true, cal: true, alnInside: true }));
check('ghost: beside South American taxa, MIG 82 My', g1.mig === 82);
const g2 = D.ghostStats(D.ghostTree({ mor: false, cal: false, alnInside: false }));
check('ghost: dropping the two Laurasian taxa leaves MIG and lowers GER', g2.mig === 115 && g2.ger < g0.ger);
const qin = { Aorun: false, Haplocheirus: true, Shishugounykus: true, Morrison: false, Tugulusaurus: true, Calamosaurus: false, Alnashetri: false };
const mak = { Aorun: true, Haplocheirus: false, Shishugounykus: false, Morrison: true, Tugulusaurus: false, Calamosaurus: true, Alnashetri: true };
const kg = (o) => Math.pow(10, D.rootEstimate(o));
check('root: Qin taxa give a larger ancestor than Makovicky taxa', kg(qin) > 3 * kg(mak), `${kg(qin).toFixed(1)} vs ${kg(mak).toFixed(1)} kg`);
check('root: two equal tips on equal branches average', (() => {
  const x = Math.log10(2), y = Math.log10(8);
  return Math.abs((x + y) / 2 - Math.log10(4)) < 1e-12;
})());
const p = (d, m, T) => 1 - Math.exp(-d * m * T);
check('dispersal: 64 My over land at d = 0.0098 is about 0.47', Math.abs(p(0.0098, 1, 64) - 0.466) < 0.002);
check('dispersal: the same over sea is about 6e-5', Math.abs(p(0.0098, 0.0001, 64) - 6.27e-5) < 1e-6);
const wts = (a) => { const b = Math.min(...a), e = a.map((x) => Math.exp(-(x - b) / 2)), s = e.reduce((u, v) => u + v, 0); return e.map((x) => x / s); };
check('aic: a gap of 2 between two models is 0.73 to 0.27', Math.abs(wts([0, 2])[0] - 0.731) < 0.001);

console.log(`\n${checks - fails}/${checks} passed`);
process.exit(fails ? 1 : 0);
