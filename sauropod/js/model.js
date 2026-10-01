/* Sauropod neck posture: the physics.
 *
 * Pure functions only. No DOM. Loaded by the page as a plain script (so the
 * site also runs from a double-clicked file) and by tests/model.test.js in node.
 *
 * Units: metres, kilograms, seconds, watts, mmHg (pressures are gauge, i.e.
 * relative to the atmosphere, unless a name says "absolute").
 */
(function (root) {
  'use strict';

  const RHO_HG = 13.534;          // g/cm3, mercury at body temperature
  const ATM = 760;                // mmHg
  const KPA_PER_MMHG = 0.133322;
  const J_PER_ML_O2 = 20.1;       // energy released per mL O2 consumed
  const RHO_MUSCLE = 1.06;        // g/cm3, heart muscle
  const G = 9.81;

  /* Approximate body dimensions. Mounts and published estimates disagree,
   * sometimes by a lot (sauropod masses especially), so treat these as
   * starting points and adjust with the sliders.
   *   neckBaseH  height of the cervicodorsal joint (where the neck leaves the body)
   *   heartH     height of the heart above the ground
   *   neckW0/1   depth of the neck at base / at the skull
   *   cartDeg    extra extension per joint for each 1% of cartilage (Taylor 2014);
   *              null where no published value exists
   */
  const PRESETS = {
    giraffatitan: {
      name: 'Giraffatitan', full: 'Giraffatitan brancai ("Brachiosaurus", Berlin mount)',
      mass: 23000, neckLen: 8.5, cervicals: 13,
      hipH: 4.2, shoulderH: 5.7, bellyH: 3.0, neckBaseH: 5.5, heartH: 4.0,
      torsoLen: 6.0, tailLen: 8.5, headLen: 1.0, headMass: 350,
      legW: 0.6, neckW0: 1.05, neckW1: 0.35, tailW0: 1.1,
      angle: 60, cartDeg: null,
      note: 'Berlin mount holds the head about 13 m up, roughly 9 m above the heart (Seymour 2009). Mass after Taylor (2009); other estimates run higher.'
    },
    barosaurus: {
      name: 'Barosaurus', full: 'Barosaurus lentus',
      mass: 15000, neckLen: 8.5, cervicals: 16,
      hipH: 3.9, shoulderH: 3.5, bellyH: 1.8, neckBaseH: 3.4, heartH: 2.5,
      torsoLen: 4.6, tailLen: 12.5, headLen: 0.65, headMass: 150,
      legW: 0.45, neckW0: 0.85, neckW1: 0.24, tailW0: 0.95,
      angle: 20, cartDeg: null,
      note: 'The AMNH mount rears on its hind legs. Try the rearing slider in topic 1. Seymour & Lillywhite (2000) used this animal.'
    },
    diplodocus: {
      name: 'Diplodocus', full: 'Diplodocus carnegii (CM 84)',
      mass: 13000, neckLen: 6.5, cervicals: 15,
      hipH: 3.7, shoulderH: 3.3, bellyH: 1.7, neckBaseH: 3.2, heartH: 2.4,
      torsoLen: 4.5, tailLen: 13.5, headLen: 0.6, headMass: 120,
      legW: 0.42, neckW0: 0.8, neckW1: 0.22, tailW0: 0.95,
      angle: 5, cartDeg: 1.86,
      note: 'Stevens & Parrish (1999) reconstructed this neck near horizontal. Taylor (2014) measured its joints.'
    },
    apatosaurus: {
      name: 'Apatosaurus', full: 'Apatosaurus louisae (CM 3018)',
      mass: 20000, neckLen: 6.5, cervicals: 15,
      hipH: 4.0, shoulderH: 3.8, bellyH: 1.8, neckBaseH: 3.7, heartH: 2.7,
      torsoLen: 5.0, tailLen: 11.5, headLen: 0.65, headMass: 150,
      legW: 0.6, neckW0: 1.15, neckW1: 0.35, tailW0: 1.15,
      angle: 10, cartDeg: 1.18,
      note: 'Short, deep, heavy neck. Taylor (2014) measured its joints too.'
    },
    mamenchisaurus: {
      name: 'Mamenchisaurus', full: 'Mamenchisaurus hochuanensis',
      mass: 14000, neckLen: 9.5, cervicals: 19,
      hipH: 3.8, shoulderH: 3.6, bellyH: 1.9, neckBaseH: 3.5, heartH: 2.6,
      torsoLen: 4.8, tailLen: 9.0, headLen: 0.6, headMass: 130,
      legW: 0.45, neckW0: 0.85, neckW1: 0.22, tailW0: 0.95,
      angle: 25, cartDeg: null,
      note: 'Neck over 9 m. Rearing would put the head more than 11 m above the heart (Seymour 2009).'
    },
    giraffe: {
      name: 'Giraffe', full: 'Giraffa camelopardalis (check the model here first)',
      mass: 1000, neckLen: 1.9, cervicals: 7,
      hipH: 2.3, shoulderH: 3.1, bellyH: 1.7, neckBaseH: 3.0, heartH: 2.3,
      torsoLen: 1.6, tailLen: 1.0, headLen: 0.6, headMass: 25,
      legW: 0.13, neckW0: 0.45, neckW1: 0.2, tailW0: 0.18,
      angle: 50, cartDeg: null, isGiraffe: true,
      note: 'Measured mean arterial pressure at heart level: 193 mmHg (anaesthetised, Brøndum et al. 2009) to 214 mmHg (Goetz et al. 1960).'
    }
  };

  const REFERENCE = {
    humanMAP: 95,             // mmHg, typical resting mean arterial pressure
    giraffeMAP: [193, 214],   // mmHg, Brøndum et al. 2009; Goetz et al. 1960
    humanHead: 1.7, giraffeHead: 4.5
  };

  /* The same animal at a different size: lengths x s, masses x s^3. */
  const LENGTHS = ['hipH', 'shoulderH', 'bellyH', 'neckBaseH', 'heartH', 'torsoLen', 'tailLen',
    'headLen', 'legW', 'neckW0', 'neckW1', 'tailW0', 'neckLen'];
  function scaled(a, s) {
    const b = Object.assign({}, a);
    LENGTHS.forEach((k) => { b[k] = a[k] * s; });
    b.mass = a.mass * s * s * s; b.headMass = a.headMass * s * s * s;
    return b;
  }

  /* A point a fraction u (0 = base, 1 = skull) of the way along the neck. */
  function pointAt(geo, u) {
    const n = geo.pts.length - 1, x = Math.max(0, Math.min(1, u)) * n;
    const i = Math.min(n - 1, Math.floor(x)), t = x - i, p = geo.pts[i], q = geo.pts[i + 1];
    return { x: p.x + (q.x - p.x) * t, y: p.y + (q.y - p.y) * t };
  }

  /* Each metre of blood is this many mmHg. Seymour (2009): 1.055 / 13.534 -> 78. */
  function mmHgPerMetre(rhoBlood) { return 1000 * rhoBlood / RHO_HG; }

  function rotate(p, pivot, deg) {
    const a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
    const x = p.x - pivot.x, y = p.y - pivot.y;
    return { x: pivot.x + x * c - y * s, y: pivot.y + x * s + y * c };
  }

  /* Body landmarks and the neck as a chain of vertebrae.
   * v: { neckAngle (deg above horizontal, at the base), neckLen, curv (deg per joint),
   *      pitch (deg the body rears up about the hip), heartH } */
  function geometry(a, v) {
    const hip = { x: 0, y: a.hipH };
    const pitch = v.pitch || 0;
    const body = (p) => rotate(p, hip, pitch);
    const shoulder = body({ x: a.torsoLen, y: a.shoulderH });
    const neckBase = body({ x: a.torsoLen + 0.05 * a.torsoLen, y: a.neckBaseH });
    const heart = body({ x: a.torsoLen * 0.84, y: v.heartH });
    const n = a.cervicals;
    const seg = v.neckLen / n;
    const pts = [neckBase];
    const angles = [];
    let p = neckBase;
    for (let i = 0; i < n; i++) {
      const th = (v.neckAngle + i * (v.curv || 0)) * Math.PI / 180;
      angles.push(th);
      p = { x: p.x + seg * Math.cos(th), y: p.y + seg * Math.sin(th) };
      pts.push(p);
    }
    const brain = pts[n];
    const last = angles[n - 1] * 180 / Math.PI;
    const headAngle = 0.3 * wrap180(last) - 25;
    return { hip, shoulder, neckBase, heart, pts, angles, brain, headAngle, pitch,
             dh: brain.y - heart.y, headHeight: brain.y };
  }

  function wrap180(d) { d = ((d + 180) % 360 + 360) % 360 - 180; return d; }

  /* Pressure bookkeeping.
   * mode: 'heart'  the heart lifts everything (Seymour)
   *       'siphon' veins pull back as much suction as they can hold (Hicks & Badeer)
   *       'pumps'  pumps in the neck lift the head's blood (Bakker; Choy & Altman) */
  function circulation(a, v, geo, mode) {
    const k = mmHgPerMetre(v.rho);
    const lift = k * geo.dh;                        // mmHg to hold up the column
    const assist = v.airAssist || 0;                // air-sac squeeze, if any
    const open = Math.max(v.pFloor, v.pHead + lift - assist);
    const out = { k, lift, assist, open, mode, pHeart: open, pumps: null, siphon: null };

    if (mode === 'siphon') {
      const sMax = Math.min(v.veinTol, ATM - v.vapor);
      out.pHeart = Math.max(v.pFloor, v.pHead + lift - assist - sMax);
      out.siphon = { sMax, boiling: v.veinTol >= ATM - v.vapor && v.pHead + lift - assist - sMax > v.pFloor };
    }
    if (mode === 'pumps' && v.pumps && v.pumps.length) {
      // pumps sit at fractions u along the neck; each lifts the head's blood to the next one
      const list = v.pumps.slice().sort((p, q) => p - q).map((u) => ({ u, y: pointAt(geo, u).y }));
      out.pHeart = Math.max(v.pFloor, v.pHead + k * (list[0].y - geo.heart.y) - assist);
      let neckLift = 0, peak = v.pHead;
      list.forEach((p, j) => {
        const nextY = j < list.length - 1 ? list[j + 1].y : geo.brain.y;
        p.boost = Math.max(0, k * (nextY - p.y));
        neckLift += p.boost; peak = Math.max(peak, v.pHead + p.boost);
      });
      out.pumps = { list, n: list.length, neckLift, peak };
    }
    out.pAtHead = out.pumps ? v.pHead : out.pHeart - lift + assist;
    out.pAtFeet = out.pHeart + k * geo.heart.y;
    return out;
  }

  /* Laplace, cylinder, force balance across a diameter: wall/radius = P / stress. */
  function wallRatio(pMmHg, stressKPa) { return Math.max(0, pMmHg) * KPA_PER_MMHG / stressKPa; }

  /* Mammal basal metabolic rate as used by Seymour (2009): W = 3.6 M^0.71. */
  function metabolicRate(mass, intensity) { return intensity * 3.6 * Math.pow(mass, 0.71); }

  /* Fick: flow = O2 use / O2 extracted per mL. avO2 in mL O2 per L blood. Returns mL/s. */
  function cardiacOutput(watts, avO2) { return watts / J_PER_ML_O2 / (avO2 / 1000); }

  /* Mammal resting heart rate, 241 M^-0.25 beats/min. */
  function defaultHeartRate(mass) { return 241 * Math.pow(mass, -0.25); }

  /* Left ventricle as a thick-walled sphere. Force balance on a hemisphere:
   * P * pi * ri^2 = stress * pi * (ro^2 - ri^2)  ->  (ro/ri)^2 = 1 + P/stress.
   * Default stress (19.3 kPa) makes a normal 100 mmHg ventricle have a wall
   * 0.30 x its internal radius, close to a human's. */
  function ventricle(pMmHg, edvMl, stressKPa) {
    const ratio = Math.sqrt(1 + Math.max(pMmHg, 1) * KPA_PER_MMHG / stressKPa);
    const ri = Math.cbrt(3 * edvMl / (4 * Math.PI));          // cm
    const massG = RHO_MUSCLE * edvMl * (ratio * ratio * ratio - 1);
    return { ri, ro: ri * ratio, wall: ri * (ratio - 1), massKg: massG / 1000, ratio };
  }

  function heart(a, v, pHeart) {
    const watts = metabolicRate(a.mass, v.intensity);
    const q = cardiacOutput(watts, v.avO2);                  // mL/s
    const sv = q * 60 / v.hr;                                // mL per beat
    const edv = sv / (v.ef / 100);
    const lv = ventricle(pHeart, edv, v.lvStress);
    const normal = ventricle(100, edv, v.lvStress);
    return { watts, q, sv, edv, lv, normal,
             pct: 100 * lv.massKg / a.mass, times: lv.massKg / normal.massKg };
  }

  /* Seymour (2009): flow proportional to metabolic rate, heart work = flow x pressure,
   * heart = `share` of the budget at 100 mmHg. Body cost stays fixed.
   * pumpLift, headFrac: extra work by neck pumps on the head's share of the flow. */
  function energy(pHeart, shareFrac, pumpLift, headFrac) {
    const body = 1 - shareFrac;
    const heartCost = shareFrac * pHeart / 100;
    const pumpCost = pumpLift ? shareFrac * (pumpLift / 100) * headFrac : 0;
    const total = body + heartCost + pumpCost;
    return { body, heart: heartCost, pumps: pumpCost, total,
             circFrac: (heartCost + pumpCost) / total };
  }

  /* Spherical-segment volumes in 1 m slices of height, sphere centred on the
   * neck base with radius = reach, clipped at the ground (Seymour 2009, fig. 2). */
  function feedingSlices(centerY, reach, slice) {
    slice = slice || 1;
    const top = centerY + reach;
    const out = [];
    const F = (z) => Math.PI * (reach * reach * z - z * z * z / 3);
    for (let lo = 0; lo < top; lo += slice) {
      const hi = Math.min(lo + slice, top);
      const zlo = Math.max(lo - centerY, -reach), zhi = Math.min(hi - centerY, reach);
      out.push({ lo, hi, vol: zhi > zlo ? F(zhi) - F(zlo) : 0 });
    }
    return out;
  }

  /* Mass of the neck and the torque needed at its base to hold it still. */
  function neckMechanics(a, v, geo) {
    const n = geo.pts.length - 1, seg = v.neckLen / n;
    const r0 = a.neckW0 / 2, r1 = a.neckW1 / 2;
    const shape = 0.8;               // necks were deeper than wide
    let mass = 0, torque = 0;
    for (let i = 0; i < n; i++) {
      const ra = r0 + (r1 - r0) * i / n, rb = r0 + (r1 - r0) * (i + 1) / n;
      const vol = shape * Math.PI * seg / 3 * (ra * ra + ra * rb + rb * rb);
      const m = vol * 1000 * (1 - v.air / 100);
      const mx = (geo.pts[i].x + geo.pts[i + 1].x) / 2 - geo.neckBase.x;
      mass += m; torque += m * G * mx;
    }
    torque += a.headMass * G * (geo.brain.x - geo.neckBase.x);
    return { mass, torque: Math.abs(torque) };
  }

  /* Taylor (2014): extension per joint ~ cartilage thickness / zygapophyseal height (radians).
   * cartDeg bakes in the measured geometry: degrees per joint per 1% cartilage. */
  function cartilage(a, pct) {
    const perDegPct = a.cartDeg || 1.5;
    const perJoint = perDegPct * pct;
    return { perJoint, total: perJoint * (a.cervicals - 1), assumed: !a.cartDeg };
  }

  /* Find the neck angle that puts the head at a target height (for drinking). */
  function angleForHeadHeight(a, v, targetY) {
    let lo = -89, hi = 90;
    for (let i = 0; i < 40; i++) {
      const mid = (lo + hi) / 2;
      const y = geometry(a, Object.assign({}, v, { neckAngle: mid })).brain.y;
      if (y > targetY) hi = mid; else lo = mid;
    }
    return (lo + hi) / 2;
  }

  /* Lower the head to drink, hold, raise it again. The heart's pressure chases
   * the pressure the new posture calls for with a first-order lag (the
   * baroreflex); an optional rete smooths the pressure reaching the brain. */
  function simulateDrink(a, v, opts) {
    const k = mmHgPerMetre(v.rho);
    const up = opts.upAngle;
    const down = angleForHeadHeight(a, v, opts.drinkHeight || 0.6);
    const hold = 6, lead = 1, T = v.moveT;
    const total = lead + T + hold + T + hold;
    const dt = 0.02;
    const ease = (u) => u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u);
    const angleAt = (t) => {
      if (t < lead) return up;
      if (t < lead + T) return up + (down - up) * ease((t - lead) / T);
      if (t < lead + T + hold) return down;
      if (t < lead + 2 * T + hold) return down + (up - down) * ease((t - lead - T - hold) / T);
      return up;
    };
    const dhAt = (ang) => geometry(a, Object.assign({}, v, { neckAngle: ang })).dh;
    const setpoint = (dh) => Math.max(v.pFloor, v.pHead + k * dh);
    const tau = v.reflexT >= 60 ? Infinity : v.reflexT;
    let P = setpoint(dhAt(up));
    let brain = P - k * dhAt(up);
    const rows = [];
    for (let t = 0; t <= total + 1e-9; t += dt) {
      const ang = angleAt(t), dh = dhAt(ang);
      if (isFinite(tau)) P += (setpoint(dh) - P) * (1 - Math.exp(-dt / tau));
      const raw = P - k * dh;
      brain = v.reteT > 0 ? brain + (raw - brain) * (1 - Math.exp(-dt / v.reteT)) : raw;
      rows.push({ t, ang, dh, heart: P, brain });
    }
    let peak = -Infinity, low = Infinity, burst = 0, faint = 0;
    for (const r of rows) {
      peak = Math.max(peak, r.brain); low = Math.min(low, r.brain);
      if (r.brain > v.burstP) burst += dt;
      if (r.brain < v.faintP) faint += dt;
    }
    return { rows, total, down, up, peak, low, burst, faint, phases: { lead, T, hold } };
  }

  const Model = { RHO_HG, ATM, KPA_PER_MMHG, G, PRESETS, REFERENCE, scaled, pointAt,
    mmHgPerMetre, geometry, circulation, wallRatio, metabolicRate, cardiacOutput,
    defaultHeartRate, ventricle, heart, energy, feedingSlices, neckMechanics,
    cartilage, angleForHeadHeight, simulateDrink, wrap180 };

  if (typeof module !== 'undefined' && module.exports) module.exports = Model;
  else root.Model = Model;
})(this);
