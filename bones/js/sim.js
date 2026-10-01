/* Signor–Lipps sampler and the taphonomic funnel's draws.
 *
 * Pure functions only. No DOM. Loaded by the page as a plain script and by
 * tests/sim.test.js in node.
 *
 * Every taxon lives from the bottom level up to 0 and dies at 0. At each level
 * a fossil is preserved and found with chance p. The uniform draws are fixed
 * per seed, so moving p only adds or removes finds; it never reshuffles them.
 */
(function (root) {
  'use strict';

  const BOTTOM = -50;                 // lowest level; 0 is the boundary
  const N_LEVELS = 1 - BOTTOM;        // -50..0 inclusive = 51 levels
  const N_TAXA = 20;
  const SEED = 300;                   // a typical first dig: at p = 0.08, median gap 8, mean 11.3

  /* mulberry32: small, fast, good enough for teaching draws. */
  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* One draw per taxon per level. draws[i][j] belongs to taxon i at level BOTTOM + j. */
  function draws(seed, nTaxa) {
    const r = rng(seed), out = [];
    for (let i = 0; i < (nTaxa || N_TAXA); i++) {
      const row = new Float64Array(N_LEVELS);
      for (let j = 0; j < N_LEVELS; j++) row[j] = r();
      out.push(row);
    }
    return out;
  }

  /* Levels where taxon `row` turns up, lowest first. */
  function finds(row, p) {
    const out = [];
    for (let j = 0; j < row.length; j++) if (row[j] < p) out.push(BOTTOM + j);
    return out;
  }

  /* Highest level found, or null if the taxon never turns up. */
  function lastSeen(row, p) {
    for (let j = row.length - 1; j >= 0; j--) if (row[j] < p) return BOTTOM + j;
    return null;
  }

  function dig(d, p) {
    return d.map((row) => {
      const f = finds(row, p);
      return { finds: f, first: f.length ? f[0] : null, last: f.length ? f[f.length - 1] : null };
    });
  }

  /* Taxa whose last find is at or above `level`: the apparent standing diversity. */
  function seenAtOrAbove(lasts, level) {
    let n = 0;
    for (const l of lasts) if (l !== null && l >= level) n++;
    return n;
  }

  /* Gaps between each taxon's last find and the boundary. */
  function gaps(lasts) {
    const g = lasts.filter((l) => l !== null).map((l) => -l).sort((a, b) => a - b);
    const n = g.length;
    return {
      n, never: lasts.length - n,
      mean: n ? g.reduce((s, x) => s + x, 0) / n : NaN,
      median: n ? (n % 2 ? g[(n - 1) / 2] : (g[n / 2 - 1] + g[n / 2]) / 2) : NaN
    };
  }

  /* Taphonomic funnel: n individuals, one draw per individual per gate. */
  function funnelDraws(seed, n, gates) {
    const r = rng(seed), out = [];
    for (let i = 0; i < n; i++) {
      const row = new Float64Array(gates);
      for (let g = 0; g < gates; g++) row[g] = r();
      out.push(row);
    }
    return out;
  }

  const Sim = { BOTTOM, N_LEVELS, N_TAXA, SEED, rng, draws, finds, lastSeen, dig, seenAtOrAbove, gaps, funnelDraws };

  if (typeof module !== 'undefined' && module.exports) module.exports = Sim;
  else root.Sim = Sim;
})(this);
