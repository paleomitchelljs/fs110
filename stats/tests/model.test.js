/* Run with:  node stats/tests/model.test.js   (no dependencies) */
'use strict';
const M = require('../js/model.js');

let failed = 0;
function near(name, got, want, tol) {
  const ok = Math.abs(got - want) <= tol;
  if (!ok) failed++;
  console.log(`${ok ? 'ok  ' : 'FAIL'}  ${name}: got ${got}, expected ${want} ± ${tol}`);
}
function lcg(seed) { let s = seed; return () => (s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296; }

near('at least one boy', M.kids('either').pBoth, 1 / 3, 1e-9);
near('older is a boy', M.kids('older').pBoth, 1 / 2, 1e-9);

const t = M.test(1e-6, 0.99);
near('1 in a million, 99%: positives', t.positives, 10000.98, 0.01);
near('1 in a million, 99%: chance sick', t.ppv, 9.899e-5, 1e-7);
near('1 in 2, 99%', M.test(0.5, 0.99).ppv, 0.99, 1e-9);
near('1 in 100, 99%', M.test(0.01, 0.99).ppv, 0.5, 1e-9);

function tally(host, N) {
  const rng = lcg(7); let stay = 0, swap = 0, voided = 0;
  for (let i = 0; i < N; i++) {
    const r = M.round(host, rng);
    if (r.voided) voided++; else { stay += r.stay; swap += r.swap; }
  }
  return { stay: stay / (stay + swap), swap: swap / (stay + swap), voided: voided / N };
}
const k = tally('knows', 200000), r = tally('random', 200000);
near('host knows: stay wins', k.stay, 1 / 3, 0.005);
near('host knows: swap wins', k.swap, 2 / 3, 0.005);
near('host knows: never void', k.voided, 0, 0);
near('host random: stay wins', r.stay, 1 / 2, 0.005);
near('host random: swap wins', r.swap, 1 / 2, 0.005);
near('host random: void share', r.voided, 1 / 3, 0.005);

process.exit(failed ? 1 : 0);
