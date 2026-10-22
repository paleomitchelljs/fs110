/* The study model and the little bit of statistics the deck needs. No DOM: node can load this (tests/model.test.js).
 *
 * The model is learning-dag.png read as arithmetic. Time (and interest) become effort. Effort reaches understanding
 * through two gates, class and study method. Prior knowledge adds to understanding directly. Understanding becomes the grade.
 *   effort        E(t) = (1 - e^-Kt) / (1 - e^-K)        strongly diminishing: most of it is in the first half
 *   gate          g(m) = 1 - (1 - C)(1 - m)              class and method each carry effort; either one can
 *   understanding U(t, m) = P + (1 - P) E(t) g(m)
 * Interest, class and assessment are held fixed (P, C, and the grade being U itself).
 * M0 is whatever method value makes the model land on the four students' mean score when t = 75%.
 */
(function (root) {
  'use strict';
  const K = 4, P = 0.35, C = 0.4, T0 = 0.75, N = 42;

  const E = (t) => (1 - Math.exp(-K * t)) / (1 - Math.exp(-K));
  const gate = (m) => 1 - (1 - C) * (1 - m);
  const U = (t, m) => P + (1 - P) * E(t) * gate(m);
  /* Expected number right out of N. */
  const score = (t, m) => N * U(t, m);
  /* Per-chapter study time tc, questions per chapter nq: the same model chapter by chapter. */
  const scoreSplit = (tc, m, nq) => tc.reduce((a, t, i) => a + nq[i] * U(t, m), 0);
  /* The method value that gives understanding u at time t. Not clamped. */
  const methodFor = (u, t) => 1 - (1 - (u - P) / ((1 - P) * E(t))) / (1 - C);
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

  /* ---------- results ---------- */
  const sum = (a) => a.reduce((x, y) => x + y, 0);
  const mean = (a) => sum(a) / a.length;

  /* Per-chapter results for one student. q: [{ch}], v: 0/1 per question. */
  function chapters(q, v) {
    const out = [];
    q.forEach((x, i) => {
      let c = out.find((o) => o.ch === x.ch);
      if (!c) out.push(c = { ch: x.ch, n: 0, k: 0 });
      c.n++; c.k += v[i];
    });
    out.sort((a, b) => a.ch - b.ch);
    out.forEach((c) => { c.pct = c.k / c.n; });
    return out;
  }
  /* Best group minus worst group, as a share of questions. The number that says "uneven". */
  const gap = (groups) => Math.max(...groups.map((g) => g.pct)) - Math.min(...groups.map((g) => g.pct));

  /* Question positions, grouped. Each group is { a, b } over the given order (b exclusive). */
  const thirds = (n) => { const t = Math.ceil(n / 3); return [0, 1, 2].map((i) => ({ a: i * t, b: Math.min(n, (i + 1) * t) })); };

  /* ---------- luck ---------- */
  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  /* The same results dealt to the same slots in a random order. Same score, no pattern but chance. */
  function deal(v, rand) {
    const w = v.slice();
    for (let i = w.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      const t = w[i]; w[i] = w[j]; w[j] = t;
    }
    return w;
  }
  /* Share of deals with a gap at least as big as the real one. */
  const tail = (gaps, real) => gaps.filter((g) => g >= real - 1e-9).length / gaps.length;

  const api = { K, P, C, T0, N, E, gate, U, score, scoreSplit, methodFor, clamp, sum, mean, chapters, gap, thirds, rng, deal, tail };
  api.M0 = clamp(methodFor(0.6726, T0), 0, 1);   // 0.6726 = the four students' mean, 28.25 / 42
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.Model = api;
})(this);
