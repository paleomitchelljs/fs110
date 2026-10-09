/* The arithmetic behind the three stumpers. No DOM, so the tests can load it.
 * Run the checks with:  node stats/tests/model.test.js */
(function (root) {
  'use strict';

  // (a) Two kids. Each family is [older, younger]; all four are equally likely.
  const FAMILIES = ['BB', 'BG', 'GB', 'GG'];
  // clue 'either': "at least one is a boy".  clue 'older': "the older one is a boy".
  function keeps(family, clue) {
    return clue === 'older' ? family[0] === 'B' : family.indexOf('B') >= 0;
  }
  function kids(clue) {
    const kept = FAMILIES.filter(f => keeps(f, clue));
    return { kept, pBoth: 1 / kept.length };
  }
  function randomFamily(rng) {
    return (rng() < 0.5 ? 'B' : 'G') + (rng() < 0.5 ? 'B' : 'G');
  }

  // (b) A test with one accuracy for both the sick and the healthy.
  // prevalence and accuracy are fractions; n is the size of the crowd.
  function test(prevalence, accuracy, n) {
    n = n == null ? 1e6 : n;
    const sickPos = n * prevalence * accuracy;
    const healthyPos = n * (1 - prevalence) * (1 - accuracy);
    return { n, sickPos, healthyPos, positives: sickPos + healthyPos, ppv: sickPos / (sickPos + healthyPos) };
  }

  // (c) One round of three doors. host 'knows': opens a goat door you did not pick.
  // host 'random': opens either other door; if that shows the car, the round is void.
  function pickOne(list, rng) { return list[Math.floor(rng() * list.length)]; }
  function round(host, rng, pick) {
    const car = Math.floor(rng() * 3);
    if (pick == null) pick = Math.floor(rng() * 3);
    const others = [0, 1, 2].filter(d => d !== pick);
    const opened = host === 'random' ? pickOne(others, rng) : pickOne(others.filter(d => d !== car), rng);
    const voided = opened === car;
    return { car, pick, opened, voided, stay: !voided && pick === car, swap: !voided && pick !== car };
  }

  const Model = { FAMILIES, keeps, kids, randomFamily, test, round };
  if (typeof module !== 'undefined' && module.exports) module.exports = Model;
  else root.Stats = Model;
})(this);
