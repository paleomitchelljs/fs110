/* Dice: one-sample t-test and chi-squared goodness of fit against a fair die.
   Plain functions, no DOM, so node can test them. */
(function (root) {
  'use strict';

  const SIDES = 6;                    // faces on the die
  const MU = (SIDES + 1) / 2;         // fair mean: 3.5 for a d6

  // A cell's text as a roll, or null if it isn't a whole number from 1 to SIDES.
  function parseRoll(s) {
    const t = String(s).trim();
    if (!/^\d+$/.test(t)) return null;
    const v = Number(t);
    return v >= 1 && v <= SIDES ? v : null;
  }

  // log Gamma (Lanczos, g = 7)
  const LG = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
    -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  function lgamma(x) {
    if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - lgamma(1 - x);
    x -= 1;
    let a = LG[0];
    const t = x + 7.5;
    for (let i = 1; i < 9; i++) a += LG[i] / (x + i);
    return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
  }

  // Regularized incomplete beta I_x(a, b), continued fraction (Numerical Recipes).
  function betacf(a, b, x) {
    const TINY = 1e-300;
    let c = 1, d = 1 - (a + b) * x / (a + 1);
    if (Math.abs(d) < TINY) d = TINY;
    d = 1 / d;
    let h = d;
    for (let m = 1; m <= 300; m++) {
      const m2 = 2 * m;
      let aa = m * (b - m) * x / ((a + m2 - 1) * (a + m2));
      d = 1 + aa * d; if (Math.abs(d) < TINY) d = TINY;
      c = 1 + aa / c; if (Math.abs(c) < TINY) c = TINY;
      d = 1 / d; h *= d * c;
      aa = -(a + m) * (a + b + m) * x / ((a + m2) * (a + m2 + 1));
      d = 1 + aa * d; if (Math.abs(d) < TINY) d = TINY;
      c = 1 + aa / c; if (Math.abs(c) < TINY) c = TINY;
      d = 1 / d;
      const del = d * c;
      h *= del;
      if (Math.abs(del - 1) < 1e-15) break;
    }
    return h;
  }
  function ibeta(x, a, b) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    const bt = Math.exp(lgamma(a + b) - lgamma(a) - lgamma(b) + a * Math.log(x) + b * Math.log(1 - x));
    return x < (a + 1) / (a + b + 2) ? bt * betacf(a, b, x) / a : 1 - bt * betacf(b, a, 1 - x) / b;
  }

  // Upper regularized incomplete gamma Q(a, x).
  function gammq(a, x) {
    if (x <= 0) return 1;
    const gln = lgamma(a);
    if (x < a + 1) {                  // series for P, then 1 - P
      let ap = a, sum = 1 / a, del = sum;
      for (let n = 0; n < 500; n++) { ap += 1; del *= x / ap; sum += del; if (Math.abs(del) < Math.abs(sum) * 1e-15) break; }
      return 1 - sum * Math.exp(-x + a * Math.log(x) - gln);
    }
    const TINY = 1e-300;              // continued fraction for Q
    let b = x + 1 - a, c = 1 / TINY, d = 1 / b, h = d;
    for (let i = 1; i <= 500; i++) {
      const an = -i * (i - a);
      b += 2;
      d = an * d + b; if (Math.abs(d) < TINY) d = TINY;
      c = b + an / c; if (Math.abs(c) < TINY) c = TINY;
      d = 1 / d;
      const del = d * c;
      h *= del;
      if (Math.abs(del - 1) < 1e-15) break;
    }
    return Math.exp(-x + a * Math.log(x) - gln) * h;
  }

  // Two-sided p for Student's t with df degrees of freedom.
  function pT(t, df) { return ibeta(df / (df + t * t), df / 2, 0.5); }
  // Upper-tail p for chi-squared with df degrees of freedom.
  function pChi(x, df) { return gammq(df / 2, x / 2); }

  // Is the mean roll different from a fair die's? Needs 2+ rolls that aren't all the same.
  function tTest(rolls, mu) {
    if (mu == null) mu = MU;
    const n = rolls.length;
    if (n === 0) return null;
    const mean = rolls.reduce((s, v) => s + v, 0) / n;
    if (n < 2) return { n, mean, sd: NaN, t: NaN, df: 0, p: NaN };
    const sd = Math.sqrt(rolls.reduce((s, v) => s + (v - mean) * (v - mean), 0) / (n - 1));
    const df = n - 1;
    if (sd === 0) return { n, mean, sd, t: NaN, df, p: NaN };
    const t = (mean - mu) / (sd / Math.sqrt(n));
    return { n, mean, sd, t, df, p: pT(t, df) };
  }

  // Do the faces come up in equal shares? Goodness of fit to 1/SIDES each.
  function chiSq(rolls, sides) {
    if (sides == null) sides = SIDES;
    const n = rolls.length;
    if (n === 0) return null;
    const counts = new Array(sides).fill(0);
    rolls.forEach(v => { counts[v - 1]++; });
    const e = n / sides;
    const chi2 = counts.reduce((s, o) => s + (o - e) * (o - e) / e, 0);
    const df = sides - 1;
    return { n, counts, expected: e, chi2, df, p: pChi(chi2, df) };
  }

  // Two dice: do their mean rolls differ? Welch's t-test (R's t.test default), two-sided.
  function tTest2(x, y) {
    const nx = x.length, ny = y.length;
    if (nx === 0 || ny === 0) return null;
    const mx = x.reduce((s, v) => s + v, 0) / nx;
    const my = y.reduce((s, v) => s + v, 0) / ny;
    const diff = mx - my;
    if (nx < 2 || ny < 2) return { nx, ny, mx, my, diff, t: NaN, df: NaN, p: NaN };
    const vx = x.reduce((s, v) => s + (v - mx) * (v - mx), 0) / (nx - 1);
    const vy = y.reduce((s, v) => s + (v - my) * (v - my), 0) / (ny - 1);
    const se2 = vx / nx + vy / ny;
    if (se2 === 0) return { nx, ny, mx, my, diff, t: NaN, df: NaN, p: NaN };
    const t = diff / Math.sqrt(se2);
    const df = se2 * se2 / ((vx / nx) * (vx / nx) / (nx - 1) + (vy / ny) * (vy / ny) / (ny - 1));
    return { nx, ny, mx, my, diff, t, df, p: pT(t, df) };
  }

  // Two dice: do the faces come up in the same shares on both? Chi-squared test of
  // homogeneity on the 2 x SIDES table. Faces neither die rolled are dropped (they have
  // no expected count), so df = (faces seen - 1).
  function chiSq2(x, y, sides) {
    if (sides == null) sides = SIDES;
    const nx = x.length, ny = y.length, n = nx + ny;
    if (nx === 0 || ny === 0) return null;
    const cx = new Array(sides).fill(0), cy = new Array(sides).fill(0);
    x.forEach(v => { cx[v - 1]++; });
    y.forEach(v => { cy[v - 1]++; });
    let chi2 = 0, seen = 0;
    for (let k = 0; k < sides; k++) {
      const col = cx[k] + cy[k];
      if (col === 0) continue;
      seen++;
      const ex = nx * col / n, ey = ny * col / n;
      chi2 += (cx[k] - ex) * (cx[k] - ex) / ex + (cy[k] - ey) * (cy[k] - ey) / ey;
    }
    const df = seen - 1;
    return { nx, ny, cx, cy, chi2, df, p: df > 0 ? pChi(chi2, df) : NaN };
  }

  const Model = { SIDES, MU, parseRoll, lgamma, ibeta, gammq, pT, pChi, tTest, chiSq, tTest2, chiSq2 };
  if (typeof module !== 'undefined' && module.exports) module.exports = Model;
  else root.Dice = Model;
})(this);
