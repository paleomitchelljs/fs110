// node exam/tests/model.test.js
const fs = require('fs'), path = require('path'), assert = require('assert');
const M = require('../js/model.js');
const src = fs.readFileSync(path.join(__dirname, '..', 'js', 'data.js'), 'utf8');
const EXAM = new Function('window', src + '; return window.EXAM;')({});
const { q, students } = EXAM;
let n = 0;
const ok = (c, m) => { assert(c, m); n++; };
const near = (a, b, e, m) => { assert(Math.abs(a - b) <= e, m + ': ' + a + ' vs ' + b); n++; };

// data
ok(q.length === 42 && students.length === 4, '42 questions, 4 students');
ok(students.every((s) => s.v.length === 42), 'every student has every question');
ok(students.map((s) => M.sum(s.v)).join() === '28,29,29,27', 'scores 28, 29, 29, 27');
ok(students.every((s) => /^[A-D]$/.test(s.id)), 'students carry letters, not the file column names');
ok(!/uniform|clustered/.test(src.replace(/^\/\*.*\*\//, '')), 'data.js does not leak the file column names');
ok(q.every((x) => [10, 11, 12].includes(x.ch)), 'chapters 10-12');
// question order is not chapter order: that is part of the lesson
ok(q.some((x, i) => i && x.ch < q[i - 1].ch), 'chapters are interleaved in question order');

// model: baseline, diminishing returns, method dominates
near(M.score(M.T0, M.M0), 28.25, 0.05, 'baseline lands on the mean score');
const base = M.score(M.T0, M.M0);
const moreTime = M.score(1, M.M0) - base;
const lessTime = base - M.score(0.5, M.M0);
const bestMethod = M.score(M.T0, 1) - base;
ok(moreTime > 0 && moreTime < 1.5, 'all the remaining time buys about one question: ' + moreTime.toFixed(2));
ok(lessTime > moreTime, 'a quarter less time costs more than a quarter more gains');
ok(bestMethod > 8 * moreTime, 'the right method is worth far more than the last quarter of time: ' + bestMethod.toFixed(1));
ok(M.M0 > 0 && M.M0 < 0.5, 'they start nearer the weights than the marathon');
let prev = -1;
for (let t = 0; t <= 1.0001; t += 0.05) { const e = M.E(t); ok(e > prev, 'E rises'); prev = e; }
near(M.E(1), 1, 1e-9, 'E(1)');
near(M.E(0), 0, 1e-9, 'E(0)');
near(M.score(0, 1), 42 * M.P, 1e-9, 'no study leaves prior knowledge');
near(M.methodFor(M.U(0.6, 0.3), 0.6), 0.3, 1e-9, 'methodFor inverts U');

// chapters
const ch = students.map((s) => M.chapters(q, s.v));
ok(ch[0].map((c) => c.n).join() === '10,23,9', 'chapter sizes 10, 23, 9');
ok(ch[1][0].k === 1 && ch[1][1].k === 20 && ch[1][2].k === 8, 'B: 1, 20, 8');
ok(ch[2][2].k === 2 && ch[3][1].k === 9, 'C is weakest in 12, D in 11');
const gaps = ch.map(M.gap);
ok(gaps[0] < 0.15, 'A is even across chapters');
ok(gaps[1] > 0.5, 'B is very uneven');

// luck: a deal keeps the score and moves the pattern; B's, C's and D's gaps are rare, A's is not
const rand = M.rng(7);
const d = M.deal(students[1].v, rand);
ok(M.sum(d) === 29 && d.length === 42, 'a deal keeps the score');
const chOrder = q.map((x, i) => i).sort((a, b) => q[a].ch - q[b].ch || a - b);
const slotQ = chOrder.map((i) => q[i]);
function nullGaps(v, reps, seed) {
  const r = M.rng(seed), vv = chOrder.map((i) => v[i]), out = [];
  for (let i = 0; i < reps; i++) out.push(M.gap(M.chapters(slotQ, M.deal(vv, r))));
  return out;
}
const p = students.map((s, i) => M.tail(nullGaps(s.v, 3000, 11 + i), gaps[i]));
ok(p[0] > 0.5, 'A: the gap is ordinary luck, p = ' + p[0].toFixed(3));
ok(p[1] < 0.03, 'B: the gap is rare, p = ' + p[1].toFixed(3));
ok(p[3] < 0.03, 'D: the gap is rare, p = ' + p[3].toFixed(3));
ok(p[2] < 0.03, 'C: the gap is rare, p = ' + p[2].toFixed(3));
ok(M.rng(3)() === M.rng(3)(), 'the generator is seeded');

// thirds of the exam: nobody fades at the end
const th = M.thirds(42);
ok(th.length === 3 && th[2].b === 42 && th[0].b === 14, 'thirds of 42');
students.forEach((s) => {
  const t = th.map((g) => M.sum(s.v.slice(g.a, g.b)) / (g.b - g.a));
  ok(t[2] > t[0] - 0.25, 'no one drops far over the last third');
});

console.log(n + ' checks passed. p =', p.map((x) => x.toFixed(3)).join(', '));
