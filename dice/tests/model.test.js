/* Run with:  node dice/tests/model.test.js   (no dependencies)
   Reference p-values come from integrating the t and chi-squared densities numerically
   (Simpson's rule in Python), independent of the code under test. In R they are
   2*pt(-|t|, df) and pchisq(x, df, lower.tail = FALSE). */
'use strict';
const M = require('../js/model.js');

let failed = 0;
function near(name, got, want, tol) {
  const ok = Math.abs(got - want) <= tol;
  if (!ok) failed++;
  console.log(`${ok ? 'ok  ' : 'FAIL'}  ${name}: got ${got}, expected ${want} ± ${tol}`);
}
function same(name, got, want) {
  const ok = Object.is(got, want);
  if (!ok) failed++;
  console.log(`${ok ? 'ok  ' : 'FAIL'}  ${name}: got ${got}, expected ${want}`);
}

// Distribution tails
near('2*pt(-2, 9)', M.pT(2, 9), 0.0765528238, 1e-8);
near('2*pt(-2.262157, 9)', M.pT(2.262157, 9), 0.05, 1e-6);
near('2*pt(-1, 1)', M.pT(1, 1), 0.5, 1e-9);
near('2*pt(-0.5, 30)', M.pT(0.5, 30), 0.6207230049, 1e-8);
near('pchisq(11.0705, 5, lower=F)', M.pChi(11.0705, 5), 0.05, 1e-5);
near('pchisq(4.4, 5, lower=F)', M.pChi(4.4, 5), 0.4933735236, 1e-8);
near('pchisq(1, 5, lower=F)', M.pChi(1, 5), 0.9625657732, 1e-8);
near('pchisq(30, 5, lower=F)', M.pChi(30, 5), 1.47485805e-5, 1e-11);

// Parsing
same('"4"', M.parseRoll('4'), 4);
same('" 6 "', M.parseRoll(' 6 '), 6);
same('"0"', M.parseRoll('0'), null);
same('"7"', M.parseRoll('7'), null);
same('"2.5"', M.parseRoll('2.5'), null);
same('"-1"', M.parseRoll('-1'), null);
same('""', M.parseRoll(''), null);

// Ten rolls
const x = [1, 2, 3, 4, 5, 6, 6, 6, 2, 4];
const t = M.tTest(x);
near('mean', t.mean, 3.9, 1e-12);
near('t', t.t, 0.6826561488, 1e-8);
near('t p', t.p, 0.5120107750, 1e-8);
const c = M.chiSq(x);
near('chi2', c.chi2, 2, 1e-12);          // counts 1,2,1,2,1,3; expected 10/6 each
near('chi2 p', c.p, 0.8491450361, 1e-8);
same('df', c.df, 5);

// A loaded die
const y = [6, 6, 6, 5, 6, 6, 4, 6, 6, 6, 6, 3, 6, 6, 5];
near('loaded t', M.tTest(y).t, 8.602160141, 1e-8);
near('loaded t p', M.tTest(y).p, 5.8258637e-7, 1e-12);
near('loaded chi2', M.chiSq(y).chi2, 35.8, 1e-9);
near('loaded chi2 p', M.chiSq(y).p, 1.0414376e-6, 1e-12);

// Edge cases
same('no rolls', M.tTest([]), null);
same('one roll: p', Number.isNaN(M.tTest([3]).p), true);
same('all same: p', Number.isNaN(M.tTest([2, 2, 2]).p), true);

process.exit(failed ? 1 : 0);
