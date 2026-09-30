/* Checks the model against numbers in the papers it is built from.
 * Run with:  node tests/model.test.js   (no dependencies) */
'use strict';
const M = require('../js/model.js');

let failed = 0;
function near(name, got, want, tol) {
  const ok = Math.abs(got - want) <= tol;
  if (!ok) failed++;
  console.log(`${ok ? 'ok  ' : 'FAIL'}  ${name}: got ${got.toFixed(2)}, expected ${want} ± ${tol}`);
}

const base = { rho: 1.055, pHead: 50, pFloor: 100, veinTol: 0, vapor: 47, nPumps: 3,
  intensity: 1, avO2: 50, ef: 60, lvStress: 19.3, air: 0, curv: 0, pitch: 0 };

// Seymour 2009: 78 mmHg per metre of blood; 9 m -> ~700 mmHg static, 750 with the flow allowance.
near('mmHg per metre of blood', M.mmHgPerMetre(1.055), 78, 0.1);
const k = M.mmHgPerMetre(1.055);
near('9 m column + 50 mmHg', 50 + 9 * k, 750, 5);

// Seymour 2009: heart = 10% of budget at 100 mmHg; giraffe (~200 mmHg) ~18%.
near('giraffe heart share at 200 mmHg (%)', 100 * M.energy(200, 0.10).circFrac, 18, 0.5);
// At 750 mmHg this bookkeeping gives 165% / 45%. Seymour reports 175% / 49%.
const e750 = M.energy(750, 0.10);
near('total energy at 750 mmHg (x baseline)', e750.total, 1.65, 0.01);
near('heart share at 750 mmHg (%)', 100 * e750.circFrac, 45.5, 0.5);

// Giraffe preset, default posture: model should land near measured 193-214 mmHg.
const g = M.PRESETS.giraffe;
const gv = Object.assign({}, base, { neckAngle: g.angle, neckLen: g.neckLen, heartH: g.heartH, hr: M.defaultHeartRate(g.mass) });
const ggeo = M.geometry(g, gv);
const gc = M.circulation(g, gv, ggeo, 'heart');
near('giraffe head above heart (m)', ggeo.dh, 2.1, 0.3);
near('giraffe pressure at heart (mmHg)', gc.pHeart, 210, 20);

// Giraffatitan at the mount pose: head ~9 m above heart (Seymour 2009).
const b = M.PRESETS.giraffatitan;
const bv = Object.assign({}, base, { neckAngle: b.angle, neckLen: b.neckLen, heartH: b.heartH, hr: M.defaultHeartRate(b.mass) });
const bgeo = M.geometry(b, bv);
near('Giraffatitan head height (m)', bgeo.headHeight, 13, 0.6);
near('Giraffatitan head above heart (m)', bgeo.dh, 9, 0.5);

// Seymour & Lillywhite 2000 / Seymour 2009: at ~7.5x pressure the ventricle wall is ~5x thicker, ~15x heavier.
const lvN = M.ventricle(100, 1000, 19.3), lvH = M.ventricle(750, 1000, 19.3);
near('normal wall / radius', lvN.wall / lvN.ri, 0.30, 0.02);
near('wall thickness ratio at 750 vs 100', lvH.wall / lvN.wall, 5, 0.3);
near('ventricle mass ratio at 750 vs 100 (paper: 15)', lvH.massKg / lvN.massKg, 12, 1.5);

// Hughes et al. 2016: a perfect siphon with giraffe-like 214 mmHg reaches about 12 m.
near('max siphon height at 214 mmHg (m)', (214 + 760 - 47) / k, 12, 0.5);

// Taylor 2014: Diplodocus CM 84, 10% cartilage -> 18.6 deg per joint.
near('Diplodocus extension per joint at 10% (deg)', M.cartilage(M.PRESETS.diplodocus, 10).perJoint, 18.6, 0.1);
near('Apatosaurus extension per joint at 4.5% (deg)', M.cartilage(M.PRESETS.apatosaurus, 4.5).perJoint, 5.5, 0.2);

// Neck pumps: the main heart only reaches the first pump; the head gets what it needs.
const pv = Object.assign({}, bv, { pumps: [0, 0.5] });
const pc = M.circulation(b, pv, bgeo, 'pumps');
near('Giraffatitan main heart with pumps at 0 and 0.5 (mmHg)', pc.pHeart, 50 + k * (bgeo.neckBase.y - bgeo.heart.y), 0.5);
near('pressure delivered to the head with pumps (mmHg)', pc.pAtHead, 50, 0.01);

// Aalkjaer et al. 2025: drinking giraffe, >300 mmHg in the distal carotid.
// (The model can't splay the front legs, so the head bottoms out ~1.1 m up.)
const sim = M.simulateDrink(g, Object.assign({}, gv, { moveT: 2, reflexT: 60, reteT: 0, faintP: 40, burstP: 300 }), { upAngle: g.angle });
near('giraffe brain-level peak with no reflex (mmHg, measured >300)', sim.peak, 320, 25);

// Human reference (Fick): ~70 kg, resting cardiac output ~4-6 L/min.
near('human cardiac output (L/min)', M.cardiacOutput(M.metabolicRate(70, 1), 50) * 60 / 1000, 4.5, 1);

console.log(failed ? `\n${failed} check(s) failed` : '\nall checks passed');
process.exit(failed ? 1 : 0);
