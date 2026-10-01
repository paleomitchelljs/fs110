/* Checks the Signor–Lipps sampler against what the maths says it should do.
 * Run with:  node bones/tests/sim.test.js   (no dependencies) */
'use strict';
const S = require('../js/sim.js');

let failed = 0;
function near(name, got, want, tol) {
  const ok = Math.abs(got - want) <= tol;
  if (!ok) failed++;
  console.log(`${ok ? 'ok  ' : 'FAIL'}  ${name}: got ${got.toFixed(3)}, expected ${want} ± ${tol}`);
}
function same(name, ok) {
  if (!ok) failed++;
  console.log(`${ok ? 'ok  ' : 'FAIL'}  ${name}`);
}

/* Gap below the boundary is geometric, truncated at 50 levels:
 * P(gap = k) = (1 - p)^k p, for k = 0..50. */
function exact(p) {
  let mass = 0, mean = 0, cdf = 0, median = null;
  for (let k = 0; k <= 50; k++) { const pr = Math.pow(1 - p, k) * p; mass += pr; mean += k * pr; }
  for (let k = 0; k <= 50; k++) { cdf += Math.pow(1 - p, k) * p / mass; if (median === null && cdf >= 0.5) median = k; }
  return { mean: mean / mass, median, never: Math.pow(1 - p, S.N_LEVELS) };
}

function pooled(p, digs) {
  const lasts = [];
  for (let s = 1; s <= digs; s++) for (const row of S.draws(s)) lasts.push(S.lastSeen(row, p));
  return S.gaps(lasts);
}

for (const p of [0.08, 0.2]) {
  const want = exact(p), got = pooled(p, 10000);
  near(`p = ${p}: mean gap (levels)`, got.mean, +want.mean.toFixed(2), p < 0.1 ? 0.3 : 0.2);
  near(`p = ${p}: median gap (levels)`, got.median, want.median, 0);
  near(`p = ${p}: share never found`, got.never / (got.n + got.never), +want.never.toFixed(4), 0.002);
}
near('0.92^51, the share never found at p = 0.08', exact(0.08).never, 0.014, 0.0005);

const a = S.draws(300), b = S.draws(300);
same('same seed, same dig', a.every((row, i) => row.every((u, j) => u === b[i][j])));

/* Raising p can only add finds, so a last find can only move up. */
const d = S.draws(7);
same('raising p never lowers a last find', d.every((row) => {
  const lo = S.lastSeen(row, 0.08), hi = S.lastSeen(row, 0.2);
  return lo === null || (hi !== null && hi >= lo);
}));

const g = S.gaps(S.draws(S.SEED).map((row) => S.lastSeen(row, 0.08)));
near('default seed: median gap at p = 0.08', g.median, 8, 0);
same('default seed: every taxon turns up at p = 0.08', g.never === 0);

console.log(failed ? `\n${failed} failed` : '\nall passed');
process.exit(failed ? 1 : 0);
