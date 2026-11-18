/* Small models for the numbers in the methods. Each draws in its own box and is
 * driven by the mouse; none of them is the paper's analysis.
 *
 *   models    One tree with fixed tip values; the routes four models take to reach them.
 *   aic       AICc scores to Akaike weights: drag a score, watch the weights move.
 *   root      Ancestral body mass on a toy tree; switch taxa in and out.
 *   ghost     Ghost lineages, MIG and GER on a ladder of real first appearances.
 *   disperse  One branch of a tree that must disperse: its length, and land or sea.
 *   resample  Characters for and against a group, resampled; Bremer support.
 *   lever     The ulna as a lever: olecranon over shaft.
 *   growth    Lines of arrested growth and a growth curve.
 */
(function () {
  'use strict';
  const D = window.Deck;
  const S = (tag, a, p) => D.svg(tag, a, p);
  const txt = (p, x, y, s, cls, anchor) => { const t = S('text', { x, y, class: cls || '', 'text-anchor': anchor || 'start' }, p); t.textContent = s; return t; };
  /* Seeded random numbers, so "again" gives a new draw and a reload gives the same one. */
  function rng(seed) {
    let a = seed >>> 0;
    const u = () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const n = () => { let x = 0, y = 0; while (!x) x = u(); while (!y) y = u(); return Math.sqrt(-2 * Math.log(x)) * Math.cos(2 * Math.PI * y); };
    return { u, n };
  }
  function buttons(parent, list, onPick) {
    const row = D.el('div', 'sim-btns', parent);
    const bs = list.map((l) => { const b = D.el('button', 'sb', row, D.fmt(l.label)); b.type = 'button'; b.addEventListener('click', (e) => { e.stopPropagation(); b.blur(); onPick(l.key); }); return { b, key: l.key }; });
    return { row, set(k) { bs.forEach((x) => x.b.classList.toggle('on', x.key === k)); } };
  }
  function toggles(parent, list, state, onChange) {
    const row = D.el('div', 'sim-btns', parent);
    const bs = list.map((l) => { const b = D.el('button', 'sb sb-t', row, D.fmt(l.label)); b.type = 'button'; b.addEventListener('click', (e) => { e.stopPropagation(); b.blur(); state[l.key] = !state[l.key]; sync(); onChange(); }); return { b, key: l.key }; });
    const sync = () => bs.forEach((x) => x.b.classList.toggle('on', !!state[x.key]));
    sync();
    return { row, sync };
  }
  function slider(parent, label, min, max, step, val, onInput, fmt) {
    const w = D.el('label', 'sim-sl', parent);
    D.el('span', 'sl-l', w, D.fmt(label));
    const r = D.el('input', '', w); r.type = 'range'; r.min = min; r.max = max; r.step = step; r.value = val;
    const out = D.el('b', 'sl-v', w);
    const show = () => { out.textContent = fmt ? fmt(+r.value) : r.value; };
    const upd = () => { show(); onInput(+r.value); };
    r.addEventListener('input', upd);
    r.addEventListener('pointerdown', (e) => e.stopPropagation());
    show();
    return { r, set(v) { r.value = v; upd(); } };
  }
  const LOGY = (lo, hi, top, bot) => (v) => bot - (v - lo) / (hi - lo) * (bot - top);
  function massAxis(g, x0, x1, Y, lo, hi) {
    for (let v = Math.ceil(lo); v <= hi; v++) {
      S('line', { x1: x0, x2: x1, y1: Y(v), y2: Y(v), class: 'grid' }, g);
      txt(g, x0 - 8, Y(v) + 7, ['0.1', '1', '10', '100'][v + 1] + ' kg', 'ax', 'end');
    }
  }
  function timeAxis(g, X, y, from, to, step) {
    for (let t = from; t >= to; t -= step) { S('line', { x1: X(t), x2: X(t), y1: y, y2: y + 8, class: 'tick' }, g); txt(g, X(t), y + 30, t, 'ax', 'middle'); }
    txt(g, X((from + to) / 2), y + 58, 'Ma', 'ax', 'middle');
  }

  /* ---------- models ---------- */
  /* A fixed tree: [start Ma, end Ma, children]. A tip's end is its fossil's age.
   * The tip values are fixed, as data are: switching model changes only the routes taken
   * to reach them. Nodes are each model's estimate (pruning on the model's branch lengths);
   * branches are bridges from node to node, wiggled by "Again". */
  const TREE = [170, 165, [[165, 155], [165, 140, [[140, 120], [140, 115]]], [165, 150, [[150, 125, [[125, 97], [125, 90]]], [150, 110, [[110, 95, [[95, 70], [95, 72]]], [110, 100, [[100, 85], [100, 88, [[88, 75], [88, 82, [[82, 70], [82, 68]]]]]]]]]]]]];
  const TIPS = [1.5, 1.2, 1.3, -0.15, 1.45, 1.6, 1.85, 0.0, 0.5, -0.8, 0.6]; /* log10 kg, in tree order */
  D.parts.models = function (def, host) {
    const W = def.box[2], H = def.box[3];
    host.innerHTML = '<div class="sim"></div>';
    const root = host.firstChild;
    const svg = S('svg', { width: W, height: H - 130, class: 'sim-svg' }, root);
    const ctl = D.el('div', 'sim-ctl', root);
    const tabs = buttons(ctl, [{ key: 'BM', label: 'BM' }, { key: 'Lambda', label: 'Lambda' }, { key: 'OU', label: 'OU' }, { key: 'WN', label: 'White noise' }], (k) => { model = k; draw(); });
    const again = D.el('button', 'sb again', tabs.row, 'Again'); again.type = 'button';
    again.addEventListener('click', (e) => { e.stopPropagation(); again.blur(); seed++; draw(); });
    const knobs = D.el('div', 'sim-knobs', ctl);
    let model = def.model || 'BM', seed = 7, lambda = 0.3, alpha = 0.04;
    const lamS = slider(knobs, 'λ', 0, 1, 0.05, lambda, (v) => { lambda = v; if (model === 'Lambda') draw(); }, (v) => v.toFixed(2));
    const alS = slider(knobs, 'α', 0, 0.12, 0.005, alpha, (v) => { alpha = v; if (model === 'OU') draw(); }, (v) => 'half-life ' + (v ? Math.round(Math.LN2 / v) + ' My' : '∞'));
    const PADL = 96, PADR = 24, top = 20, bot = H - 130 - 70;
    const X = (t) => PADL + (170 - t) / (170 - 66) * (W - PADL - PADR);
    const Y = LOGY(-1, 2, top, bot);
    const SIG = 0.06, THETA = 0.2;
    const MEAN = TIPS.reduce((a, v) => a + v, 0) / TIPS.length;
    /* Copy the tree into nodes: { t0, t1, kids, tip value, depth from root }. */
    function build() {
      let k = 0;
      const mk = (br, depth) => { const [t0, t1, kids] = br; const n = { t0, t1, depth, len: t0 - t1 }; if (kids) n.kids = kids.map((c) => mk(c, depth + t0 - t1)); else n.v = TIPS[k++]; return n; };
      return mk(TREE, 0);
    }
    /* Branch length the model sees: lambda shrinks internal branches and lengthens tips. */
    const effLen = (n) => model === 'Lambda' ? (n.kids ? lambda * n.len : n.len + (1 - lambda) * n.depth) : n.len;
    function estimate(n) {
      if (!n.kids) return { x: n.v, v: effLen(n) };
      const rs = n.kids.map(estimate);
      const w = rs.map((r) => 1 / Math.max(r.v, 1e-3)), ws = w.reduce((a, b) => a + b, 0);
      let x = rs.reduce((a, r, i) => a + r.x * w[i], 0) / ws;
      if (model === 'OU') { const h = n.kids.reduce((a, c) => a + c.len, 0) / n.kids.length; x = THETA + (x - THETA) * Math.exp(-alpha * h); }
      if (model === 'WN') x = MEAN;
      n.v = x;
      return { x, v: effLen(n) + 1 / ws };
    }
    function draw() {
      tabs.set(model);
      lamS.r.parentNode.style.display = model === 'Lambda' ? '' : 'none';
      alS.r.parentNode.style.display = model === 'OU' ? '' : 'none';
      svg.innerHTML = '';
      const g = S('g', {}, svg);
      massAxis(g, PADL, W - PADR, Y, -1, 2);
      timeAxis(g, X, bot + 6, 170, 70, 20);
      if (model === 'OU') { S('line', { x1: PADL, x2: W - PADR, y1: Y(THETA), y2: Y(THETA), class: 'theta' }, g); txt(g, W - PADR - 4, Y(THETA) - 8, 'θ', 'ax th', 'end'); }
      const R = rng(seed * 7919 + model.length);
      const clip = (v) => D.clamp(v, -1.15, 2.15);
      const tree = build();
      estimate(tree);
      /* Mean path from a to b over a branch, then a bridge of noise pinned at both ends. */
      function path(n, a) {
        const b = n.v, L = n.len, steps = Math.max(2, Math.round(L));
        const mean = (s) => {
          if (model === 'WN') return n.kids ? MEAN : (s < L ? MEAN : b);
          if (model === 'OU' && alpha > 0) { const sh = Math.sinh(alpha * L); return THETA + ((a - THETA) * Math.sinh(alpha * (L - s)) + (b - THETA) * Math.sinh(alpha * s)) / sh; }
          return a + (b - a) * s / L;
        };
        const amp = model === 'WN' ? 0 : SIG * Math.sqrt(Math.max(effLen(n), 0) / steps);
        let w = 0; const ws = [0];
        for (let k = 1; k <= steps; k++) { w += R.n(); ws.push(w); }
        const pts = [];
        for (let k = 0; k <= steps; k++) { const s = L * k / steps; pts.push([n.t0 - s, mean(s) + amp * (ws[k] - (k / steps) * ws[steps])]); }
        if (model === 'WN' && !n.kids) pts.push([n.t1, b]);
        return pts;
      }
      function walk(n, a, isRoot) {
        const pts = isRoot ? [[n.t0, n.v], [n.t1, n.v]] : path(n, a);
        const d = pts.map((p, i) => (i ? 'L' : 'M') + X(p[0]).toFixed(1) + ',' + Y(clip(p[1])).toFixed(1)).join('');
        S('path', { d, class: 'br' + (isRoot ? ' rootbr' : '') }, g);
        if (n.kids) n.kids.forEach((k) => walk(k, n.v, false));
      }
      walk(tree, tree.v, true);
      /* Tips last, so they sit on top. They are the same in every model. */
      (function dots(n) { if (n.kids) n.kids.forEach(dots); else S('circle', { cx: X(n.t1), cy: Y(clip(n.v)), r: 7, class: 'tipdot' }, g); })(tree);
    }
    draw();
    return {
      show(b) { const st = (def.steps || []).filter((s) => (s.at || 0) <= b).pop(); if (st && st.model !== model) { model = st.model; draw(); } },
      reset() { model = def.model || 'BM'; seed = 7; draw(); }
    };
  };

  /* ---------- aic ---------- */
  D.parts.aic = function (def, host) {
    const W = def.box[2];
    host.innerHTML = '<div class="sim aic"></div>';
    const root = host.firstChild;
    const ms = (def.models || [['WN', 'White noise', 100], ['Lambda', 'Lambda', 102], ['BM', 'BM', 104], ['OU', 'OU', 110]]).map(([k, label, v]) => ({ k, label, v }));
    D.el('div', 'aic-head', root, '<span>Model</span><span>AICc</span><span>Δ</span><span>Akaike weight</span>');
    const rows = ms.map((m) => {
      const r = D.el('div', 'aic-row', root);
      D.el('span', 'aic-name', r, D.fmt(m.label));
      const num = D.el('span', 'aic-num scrub', r);
      const dl = D.el('span', 'aic-d', r);
      const barw = D.el('span', 'aic-barw', r);
      const bar = D.el('i', 'aic-bar', barw);
      const wv = D.el('b', 'aic-w', barw);
      D.scrub(num, () => m.v, (v) => { m.v = Math.round(v * 10) / 10; upd(); }, 0.05);
      return { m, num, dl, bar, wv };
    });
    D.el('div', 'aic-rule', root, 'weight ∝ e<sup>−Δ/2</sup>');
    function upd() {
      const best = Math.min(...ms.map((m) => m.v));
      const ex = ms.map((m) => Math.exp(-(m.v - best) / 2)), sum = ex.reduce((a, b) => a + b, 0);
      rows.forEach((r, i) => {
        const w = ex[i] / sum;
        r.num.textContent = r.m.v.toFixed(1);
        r.dl.textContent = (r.m.v - best).toFixed(1);
        r.bar.style.width = (w * 100).toFixed(1) + '%';
        r.wv.textContent = w.toFixed(3);
      });
    }
    upd();
    void W;
    return {};
  };

  /* ---------- root ---------- */
  /* Toy tree. Polytomies where the papers disagree. Ages in Ma, mass in kg.
   * Masses: Qin et al. 2021 Table 1 unless marked. Ages: read from Makovicky Fig 2b,
   * Haplocheirus from Choiniere 2010. */
  const ROOT_TAXA = {
    Aorun: { t: 162, kg: 1.3, src: 'mak', note: 'by eye, Makovicky ED Fig 9b' },
    Haplocheirus: { t: 160, kg: 41.0, src: 'qin' },
    Shishugounykus: { t: 160, kg: 6.01, src: 'qin' },
    Morrison: { t: 152, kg: 30, src: 'mak', note: 'by eye, Makovicky ED Fig 9b', name: 'Morrison taxon' },
    Alnashetri: { t: 97, kg: 0.7, src: 'mak', note: 'Makovicky Fig 2' },
    Xiyunykus: { t: 130, kg: 17.26 }, Bannykus: { t: 120, kg: 29.13 },
    Tugulusaurus: { t: 128, kg: 11.51, src: 'qin' },
    Calamosaurus: { t: 127, kg: 30, src: 'mak', note: 'by eye, Makovicky ED Fig 9b' },
    Patagonykus: { t: 90, kg: 33.6 }, Alvarezsaurus: { t: 86, kg: 28.0 }, Achillesaurus: { t: 86, kg: 30.0 }, Bonapartenykus: { t: 70, kg: 71.55 },
    Xixianykus: { t: 85, kg: 0.74 }, Albinykus: { t: 85, kg: 1.07 }, Linhenykus: { t: 77, kg: 2.0 }, Parvicursor: { t: 75, kg: 0.15 },
    Ceratonykus: { t: 72, kg: 0.26 }, Shuvuuia: { t: 75, kg: 3.05 }, Mononykus: { t: 70, kg: 4.66 }, Nemegtonykus: { t: 70, kg: 3.31 }
  };
  /* [node age, children]; a string is a tip. */
  const ROOT_TREE = [168, ['Aorun', 'Haplocheirus', 'Shishugounykus', [158, ['Morrison', [150, ['Alnashetri', [135, [[131, ['Xiyunykus', 'Bannykus']], 'Tugulusaurus', 'Calamosaurus', [110, [[95, ['Patagonykus', 'Alvarezsaurus', 'Achillesaurus', 'Bonapartenykus']], [92, ['Xixianykus', 'Albinykus', 'Linhenykus', 'Parvicursor', 'Ceratonykus', 'Shuvuuia', 'Mononykus', 'Nemegtonykus']]]]]]]]]]]];
  D.rootEstimate = function (on) {
    /* Brownian ML root on log10 mass, by pruning (contrasts). Returns log10 kg. */
    function prune(node, parentAge) {
      if (typeof node === 'string') {
        if (!on[node] && on[node] !== undefined) return null;
        const t = ROOT_TAXA[node];
        return { x: Math.log10(t.kg), v: parentAge - t.t };
      }
      const [age, kids] = node;
      const rs = kids.map((k) => prune(k, age)).filter(Boolean);
      if (!rs.length) return null;
      const wsum = rs.reduce((a, r) => a + 1 / Math.max(r.v, 0.5), 0);
      const x = rs.reduce((a, r) => a + r.x / Math.max(r.v, 0.5), 0) / wsum;
      return { x, v: (parentAge - age) + 1 / wsum };
    }
    const r = prune(ROOT_TREE, ROOT_TREE[0]);
    return r ? r.x : null;
  };
  D.parts.root = function (def, host) {
    const W = def.box[2], H = def.box[3];
    host.innerHTML = '<div class="sim"></div>';
    const root = host.firstChild;
    const OPT = ['Aorun', 'Haplocheirus', 'Shishugounykus', 'Morrison', 'Tugulusaurus', 'Calamosaurus', 'Alnashetri'];
    const on = {};
    const PRESET = {
      qin: { Aorun: false, Haplocheirus: true, Shishugounykus: true, Morrison: false, Tugulusaurus: true, Calamosaurus: false, Alnashetri: false },
      mak: { Aorun: true, Haplocheirus: false, Shishugounykus: false, Morrison: true, Tugulusaurus: false, Calamosaurus: true, Alnashetri: true }
    };
    const svg = S('svg', { width: W, height: H - 150, class: 'sim-svg' }, root);
    const ctl = D.el('div', 'sim-ctl', root);
    const pre = buttons(ctl, [{ key: 'qin', label: 'Taxa in Qin 2021' }, { key: 'mak', label: 'Taxa in Makovicky 2026' }], (k) => { Object.assign(on, PRESET[k]); tg.sync(); pre.set(k); draw(); });
    Object.assign(on, PRESET.qin);
    const tg = toggles(ctl, OPT.map((k) => ({ key: k, label: ROOT_TAXA[k].name || '_' + k + '_' })), on, () => { pre.set(null); draw(); });
    pre.set('qin');
    const PADL = 30, PADR = 250, top = 20, bot = H - 150 - 60;
    const X = (t) => PADL + (170 - t) / (170 - 66) * (W - PADL - PADR);
    function draw() {
      svg.innerHTML = '';
      const g = S('g', {}, svg);
      timeAxis(g, X, bot + 4, 170, 70, 20);
      let row = 0; const tips = [];
      const nTips = Object.keys(ROOT_TAXA).filter((k) => on[k] !== false).length;
      const dy = (bot - top - 10) / Math.max(nTips, 1);
      function lay(node, pAge) {
        if (typeof node === 'string') {
          if (on[node] === false) return null;
          const y = top + 6 + dy * (row++ + 0.5); tips.push(node);
          const t = ROOT_TAXA[node];
          S('line', { x1: X(pAge), x2: X(t.t), y1: y, y2: y, class: 'br' }, g);
          const lg = Math.log10(t.kg);
          S('circle', { cx: X(t.t), cy: y, r: 4 + 2.2 * (lg + 1), class: 'tipdot' + (t.src === 'mak' ? ' mk' : '') }, g);
          txt(g, X(t.t) + 14, y + 6, (t.name || node) + '  ' + (t.kg < 1 ? t.kg.toFixed(2) : t.kg < 10 ? t.kg.toFixed(1) : Math.round(t.kg)) + ' kg', 'tl' + (t.src === 'mak' ? ' mk' : ''));
          return y;
        }
        const [age, kids] = node;
        const ys = kids.map((k) => lay(k, age)).filter((y) => y != null);
        if (!ys.length) return null;
        const y = (Math.min(...ys) + Math.max(...ys)) / 2;
        S('line', { x1: X(age), x2: X(age), y1: Math.min(...ys), y2: Math.max(...ys), class: 'br' }, g);
        if (pAge != null) S('line', { x1: X(pAge), x2: X(age), y1: y, y2: y, class: 'br' }, g);
        return y;
      }
      const ry = lay(ROOT_TREE, null);
      const est = D.rootEstimate(on), kg = Math.pow(10, est);
      S('circle', { cx: X(ROOT_TREE[0]), cy: ry, r: 4 + 2.2 * (est + 1), class: 'rootdot' }, g);
      const box = D.el('div', 'root-read', root);
      root.querySelectorAll('.root-read').forEach((e) => { if (e !== box) e.remove(); });
      box.innerHTML = `<span>Ancestor</span><b>${kg < 10 ? kg.toFixed(1) : Math.round(kg)} kg</b>`;
      box.style.cssText = `left:${W - PADR + 30}px;top:${top}px;`;
    }
    draw();
    return { reset() { Object.assign(on, PRESET.qin); tg.sync(); draw(); } };
  };

  /* ---------- ghost ---------- */
  /* First appearances (Ma) read from Makovicky Fig 2b. */
  const FAD = { Aorun: 162, Morrison: 152, Alnashetri: 97, Xiyunykus: 130, Bannykus: 120, Calamosaurus: 127, Alvarezsauridae: 90 };
  D.ghostTree = function (o) {
    const alv = o.alnInside ? [null, ['Alnashetri', 'Alvarezsauridae']] : 'Alvarezsauridae';
    let n4 = o.cal ? [null, ['Calamosaurus', alv]] : alv;
    let n3 = [null, [[null, ['Xiyunykus', 'Bannykus']], n4]];
    let n2 = o.alnInside ? n3 : [null, ['Alnashetri', n3]];
    let n1 = o.mor ? [null, ['Morrison', n2]] : n2;
    return [null, ['Aorun', n1]];
  };
  D.ghostStats = function (tree) {
    /* Minimum node ages: each node is as old as its oldest descendant. MIG sums every branch. */
    const fads = [];
    let mig = 0;
    function age(n) {
      if (typeof n === 'string') { fads.push(FAD[n]); return FAD[n]; }
      const as = n[1].map(age); n[0] = Math.max(...as);
      n[1].forEach((k, i) => { mig += n[0] - as[i]; });
      return n[0];
    }
    age(tree);
    const old = Math.max(...fads), young = Math.min(...fads);
    const gmin = old - young, gmax = fads.reduce((a, f) => a + old - f, 0);
    return { mig, gmin, gmax, ger: 1 - (mig - gmin) / (gmax - gmin) };
  };
  D.parts.ghost = function (def, host) {
    const W = def.box[2], H = def.box[3];
    host.innerHTML = '<div class="sim"></div>';
    const root = host.firstChild;
    const o = { mor: true, cal: true, alnInside: false };
    const svg = S('svg', { width: W, height: H - 140, class: 'sim-svg' }, root);
    const ctl = D.el('div', 'sim-ctl', root);
    const pos = buttons(ctl, [{ key: 'out', label: '_Alnashetri_ as in Makovicky 2026' }, { key: 'in', label: '_Alnashetri_ beside other South American taxa' }], (k) => { o.alnInside = k === 'in'; draw(); });
    const tg = toggles(ctl, [{ key: 'mor', label: 'Morrison taxon' }, { key: 'cal', label: '_Calamosaurus_' }], o, () => draw());
    const PADL = 30, PADR = 260, top = 24, bot = H - 140 - 60;
    const X = (t) => PADL + (170 - t) / (170 - 80) * (W - PADL - PADR);
    function draw() {
      pos.set(o.alnInside ? 'in' : 'out');
      svg.innerHTML = '';
      const g = S('g', {}, svg);
      timeAxis(g, X, bot + 4, 170, 90, 20);
      const tree = D.ghostTree(o), st = D.ghostStats(tree);
      let row = 0; const n = 4 + (o.mor ? 1 : 0) + (o.cal ? 1 : 0) + 1;
      const dy = (bot - top - 10) / n;
      function lay(node, pAge) {
        if (typeof node === 'string') {
          const y = top + dy * (row++ + 0.5), f = FAD[node];
          if (pAge != null && pAge > f) S('line', { x1: X(pAge), x2: X(f), y1: y, y2: y, class: 'ghostbr' }, g);
          S('rect', { x: X(f) - 3, y: y - 9, width: 34, height: 18, rx: 4, class: 'range' }, g);
          txt(g, X(f) + 42, y + 7, node === 'Morrison' ? 'Morrison taxon' : node, 'tl');
          return y;
        }
        const ys = n0(node).map((k) => lay(k, node[0]));
        const y = (Math.min(...ys) + Math.max(...ys)) / 2;
        S('line', { x1: X(node[0]), x2: X(node[0]), y1: Math.min(...ys), y2: Math.max(...ys), class: 'br' }, g);
        if (pAge != null && pAge > node[0]) S('line', { x1: X(pAge), x2: X(node[0]), y1: y, y2: y, class: 'ghostbr' }, g);
        else if (pAge != null) S('line', { x1: X(pAge), x2: X(node[0]), y1: y, y2: y, class: 'br' }, g);
        return y;
      }
      const n0 = (node) => node[1];
      lay(tree, null);
      root.querySelectorAll('.root-read').forEach((e) => e.remove());
      const box = D.el('div', 'root-read', root);
      box.innerHTML = `<span>MIG</span><b>${st.mig} My</b><span>GER</span><b>${st.ger.toFixed(2)}</b>`;
      box.style.cssText = `left:${W - PADR + 40}px;top:${top}px;`;
    }
    draw();
    void tg;
    return { reset() { o.mor = true; o.cal = true; o.alnInside = false; tg.sync(); draw(); } };
  };

  /* ---------- disperse ---------- */
  /* A small tree: an Asian ancestor, two Asian tips and one South American tip. The
   * lineage to the South American tip has to disperse somewhere along its branch.
   * Drag the node to change that branch's length T. P(at least one dispersal on the
   * branch) = 1 − e^(−d·m·T), m = 1 over land and 0.0001 across sea (Makovicky Methods). */
  D.parts.disperse = function (def, host) {
    const W = def.box[2], H = def.box[3];
    host.innerHTML = '<div class="sim"></div>';
    const root = host.firstChild;
    const SH = H - 110;
    const svg = S('svg', { width: W, height: SH, class: 'sim-svg' }, root);
    const ctl = D.el('div', 'sim-ctl', root);
    let d = def.d || 0.0098;
    const TIP_SA = 97, ROOT = 168, LO = TIP_SA + 2, HI = ROOT - 2;
    let node = TIP_SA + (def.T || 64);
    const knobs = D.el('div', 'sim-knobs', ctl);
    const dN = D.el('div', 'sim-sl', knobs, '<span class="sl-l">d</span>');
    const dv = D.el('b', 'sl-v scrub', dN);
    D.scrub(dv, () => d * 1e4, (v) => { d = D.clamp(Math.round(v) / 1e4, 0.0001, 0.1); draw(); }, 1);
    const PADL = 30, PADR = 30, top = 40, bot = top + 196;
    const X = (t) => PADL + (172 - t) / (172 - 66) * (W - PADL - PADR);
    const yA1 = top + 20, yA2 = top + 92, ySA = top + 164;
    const P = (m, T) => 1 - Math.exp(-d * m * T);
    const fmtP = (p) => { if (p >= 0.001) return p.toFixed(2); const [m, e] = p.toExponential(1).split('e'); return m + ' × 10<tspan dy="-14" font-size="22">' + e.replace('-', '−') + '</tspan>'; };
    function draw() {
      dv.textContent = d.toFixed(4) + ' per My';
      svg.innerHTML = '';
      const g = S('g', {}, svg);
      timeAxis(g, X, bot + 4, 170, 70, 20);
      const T = node - TIP_SA, yN = (yA2 + ySA) / 2, yR = (yA1 + yN) / 2;
      /* root and the Asian branches */
      S('line', { x1: X(ROOT), x2: X(ROOT), y1: yA1, y2: yN, class: 'br' }, g);
      S('line', { x1: X(ROOT) - 24, x2: X(ROOT), y1: yR, y2: yR, class: 'br' }, g);
      S('line', { x1: X(ROOT), x2: X(80), y1: yA1, y2: yA1, class: 'br' }, g);
      S('line', { x1: X(ROOT), x2: X(node), y1: yN, y2: yN, class: 'br' }, g);
      S('line', { x1: X(node), x2: X(node), y1: yA2, y2: ySA, class: 'br' }, g);
      S('line', { x1: X(node), x2: X(72), y1: yA2, y2: yA2, class: 'br' }, g);
      /* the branch that has to disperse */
      S('line', { x1: X(node), x2: X(TIP_SA), y1: ySA, y2: ySA, class: 'brhot' }, g);
      txt(g, (X(node) + X(TIP_SA)) / 2, ySA - 16, 'T = ' + T + ' My', 'ln', 'middle');
      [[80, yA1, 'Asia', 'a'], [72, yA2, 'Asia', 'a'], [TIP_SA, ySA, 'South America', 'c']].forEach(([t, y, lab, c]) => {
        S('circle', { cx: X(t), cy: y, r: 11, class: 'area ' + c }, g);
        txt(g, X(t) + 20, y + 7, lab, 'tl');
      });
      S('circle', { cx: X(ROOT), cy: yR, r: 11, class: 'area a' }, g);
      const knob = S('circle', { cx: X(node), cy: yN, r: 17, class: 'knob grab' }, g);
      knob.addEventListener('pointerdown', (ev) => {
        ev.preventDefault(); ev.stopPropagation(); knob.setPointerCapture(ev.pointerId);
        const mv = (m) => { const q = D.local(svg, m); const t = 172 - (q.x - PADL) / (W - PADL - PADR) * (172 - 66); node = Math.round(D.clamp(t, LO, HI)); draw(); };
        const up = () => { knob.removeEventListener('pointermove', mv); knob.removeEventListener('pointerup', up); };
        knob.addEventListener('pointermove', mv); knob.addEventListener('pointerup', up);
      });
      /* the two routes for that branch */
      const ry = bot + 90, half = (W - PADL - PADR) / 2;
      [[1, 'Over land', 'd × 1'], [0.0001, 'Across sea', 'd × 0.0001']].forEach(([m, lab, mult], i) => {
        const x0 = PADL + i * half, cx = x0 + half / 2;
        S('rect', { x: x0 + 10, y: ry, width: 70, height: 46, rx: 10, class: 'cont' }, g);
        S('rect', { x: x0 + half - 80, y: ry, width: 70, height: 46, rx: 10, class: 'cont' }, g);
        if (m === 1) S('rect', { x: x0 + 80, y: ry + 15, width: half - 160, height: 16, class: 'cont bridge' }, g);
        else { let w = `M${x0 + 92},${ry + 23}`; for (let x = x0 + 92; x < x0 + half - 112; x += 40) w += ' q 10,-10 20,0 t 20,0'; S('path', { d: w, class: 'sea' }, g); }
        txt(g, cx, ry + 100, lab + '  (' + mult + ')', 'ln', 'middle');
        txt(g, cx, ry + 160, '', 'big', 'middle').innerHTML = 'P = ' + fmtP(P(m, T));
      });
    }
    draw();
    return { reset() { node = TIP_SA + (def.T || 64); d = def.d || 0.0098; draw(); } };
  };

  /* ---------- resample ---------- */
  D.parts.resample = function (def, host) {
    const W = def.box[2], H = def.box[3];
    host.innerHTML = '<div class="sim"></div>';
    const root = host.firstChild;
    let k = def.k || 5, c = def.c || 2, p = def.p || 0.25, seed = 3;
    const svg = S('svg', { width: W, height: H - 200, class: 'sim-svg' }, root);
    const ctl = D.el('div', 'sim-ctl', root);
    const knobs = D.el('div', 'sim-knobs', ctl);
    slider(knobs, 'For the group', 1, 12, 1, k, (v) => { k = v; draw(false); });
    slider(knobs, 'Against', 0, 12, 1, c, (v) => { c = v; draw(false); });
    slider(knobs, 'Dropped = doubled', 0.05, 0.5, 0.05, p, (v) => { p = v; draw(false); }, (v) => Math.round(v * 100) + '% each');
    const bt = D.el('div', 'sim-btns', ctl);
    const one = D.el('button', 'sb', bt, 'One resample'); one.type = 'button';
    one.addEventListener('click', (e) => { e.stopPropagation(); one.blur(); seed++; draw(true); });
    let last = null;
    function rep(R) {
      let a = 0, b = 0; const w = [];
      for (let i = 0; i < k + c; i++) { const u = R.u(); const m = u < p ? 0 : u < 2 * p ? 2 : 1; w.push(m); if (i < k) a += m; else b += m; }
      return { w, win: a > b };
    }
    function draw(animate) {
      const R = rng(seed);
      last = rep(R);
      const R2 = rng(999); let wins = 0; for (let i = 0; i < 10000; i++) if (rep(R2).win) wins++;
      svg.innerHTML = '';
      const g = S('g', {}, svg), n = k + c, tw = Math.min(52, (W - 40) / n - 6);
      for (let i = 0; i < n; i++) {
        const x = 20 + i * (tw + 6), m = last.w[i];
        const r = S('rect', { x, y: 30, width: tw, height: 110, rx: 6, class: 'chr ' + (i < k ? 'for' : 'against') + (m === 0 ? ' drop' : m === 2 ? ' dbl' : '') }, g);
        if (m === 2) txt(g, x + tw / 2, 170, '×2', 'ax', 'middle');
        if (animate && !D.reduced) r.style.animation = `pop .3s ${i * 0.03}s both`;
      }
      txt(g, 20, 220, 'This resample: ' + (last.win ? 'group found' : 'group lost'), 'ln');
      txt(g, 20, 290, 'Out of 10,000: ' + Math.round(wins / 100) + '%', 'big');
      txt(g, 20, 350, 'Bremer: ' + (k - c > 0 ? k - c : 0), 'big');
    }
    draw(false);
    return {};
  };

  /* ---------- lever ---------- */
  /* Mechanical advantage values printed in Longrich & Currie 2009 Fig 13. */
  const MA = [['_Deinonychus_', 0.09], ['_Allosaurus_', 0.24], ['_Orycteropus_', 0.43], ['_Manis_', 0.52], ['_Scalopus_', 0.59], ['_Mononykus_', 0.60], ['_Patagonykus_', 0.61], ['_Albertonykus_', 0.62], ['_Priodontes_', 0.90]];
  D.parts.lever = function (def, host) {
    const W = def.box[2], H = def.box[3];
    host.innerHTML = '<div class="sim"></div>';
    const root = host.firstChild;
    const svg = S('svg', { width: W, height: H, class: 'sim-svg' }, root);
    const Lout = 380, px = 280, py = 200;
    let Lin = 90;
    const g = S('g', {}, svg);
    const scale = S('g', {}, svg);
    function draw() {
      g.innerHTML = '';
      S('path', { d: `M${px - Lin},${py - 18} Q${px - Lin - 14},${py} ${px - Lin},${py + 18} L${px},${py + 22} L${px + Lout},${py + 12} L${px + Lout},${py - 8} L${px},${py - 22} Z`, class: 'bone' }, g);
      S('circle', { cx: px, cy: py, r: 10, class: 'pivot' }, g);
      S('line', { x1: px - Lin, x2: px, y1: py + 52, y2: py + 52, class: 'dim' }, g);
      txt(g, px - Lin / 2, py + 84, 'in-lever', 'ax', 'middle');
      S('line', { x1: px, x2: px + Lout, y1: py + 52, y2: py + 52, class: 'dim' }, g);
      txt(g, px + Lout / 2, py + 84, 'out-lever', 'ax', 'middle');
      const knob = S('circle', { cx: px - Lin, cy: py - 40, r: 16, class: 'knob grab' }, g);
      S('line', { x1: px - Lin, x2: px - Lin, y1: py - 24, y2: py - 18, class: 'dim' }, g);
      knob.addEventListener('pointerdown', (ev) => {
        ev.preventDefault(); ev.stopPropagation(); knob.setPointerCapture(ev.pointerId);
        const mv = (m) => { const q = D.local(svg, m); Lin = D.clamp(px - q.x, 20, 360); draw(); };
        const up = () => { knob.removeEventListener('pointermove', mv); knob.removeEventListener('pointerup', up); };
        knob.addEventListener('pointermove', mv); knob.addEventListener('pointerup', up);
      });
      txt(g, W - 30, 70, (Lin / Lout).toFixed(2), 'huge', 'end');
      txt(g, W - 30, 108, 'in-lever / out-lever', 'ax', 'end');
      drawScale(Lin / Lout);
    }
    function drawScale(v) {
      scale.innerHTML = '';
      const x0 = 50, x1 = W - 50, y = H - 150, X = (m) => x0 + m / 1.0 * (x1 - x0);
      S('line', { x1: x0, x2: x1, y1: y, y2: y, class: 'tick' }, scale);
      let up = 0, down = 0;
      MA.forEach(([n, m]) => {
        const alv = /nykus|Patagon/.test(n);
        S('circle', { cx: X(m), cy: y, r: 6, class: alv ? 'tipdot mk' : 'tipdot' }, scale);
        const ty = alv ? y - 30 - 28 * up++ : y + 34 + 28 * (down++ % 3);
        if (alv) S('line', { x1: X(m), x2: X(m) + 40, y1: y - 6, y2: ty + 4, class: 'dim' }, scale);
        const t = S('text', { x: alv ? X(m) + 44 : X(m), y: ty + (alv ? 8 : 0), class: 'tl sm' + (alv ? ' mk' : ''), 'text-anchor': alv ? 'start' : 'middle' }, scale);
        t.innerHTML = D.fmt(n).replace(/<i>/g, '<tspan font-style="italic">').replace(/<\/i>/g, '</tspan>') + ' ' + m.toFixed(2).replace(/^0/, '');
      });
      S('path', { d: `M${X(Math.min(v, 1))},${y - 12} l-10,-18 h20 z`, class: 'you' }, scale);
    }
    draw();
    return {};
  };

  /* ---------- growth ---------- */
  D.parts.growth = function (def, host) {
    const W = def.box[2], H = def.box[3];
    host.innerHTML = '<div class="sim"></div>';
    const root = host.firstChild;
    const svg = S('svg', { width: W, height: H - 110, class: 'sim-svg' }, root);
    const ctl = D.el('div', 'sim-ctl', root);
    const K = 0.45, AMAX = 12;
    let age = def.age || 4;
    const size = (t) => 1 - Math.exp(-K * t), mass = (t) => Math.pow(size(t), 3);
    slider(ctl, 'Age at death', 1, AMAX, 1, age, (v) => { age = v; draw(); }, (v) => v + (v === 1 ? ' year' : ' years'));
    function draw() {
      svg.innerHTML = '';
      const g = S('g', {}, svg);
      const cx = 200, cy = (H - 110) / 2, R = 180;
      S('circle', { cx, cy, r: R * size(age), class: 'cortex' }, g);
      S('circle', { cx, cy, r: R * size(age) * 0.36, class: 'marrow' }, g);
      for (let y = 1; y < age; y++) {
        const r = R * size(y);
        if (r > R * size(age) * 0.36 + 2) S('circle', { cx, cy, r, class: 'lag' }, g);
      }
      txt(g, cx, cy + R + 52, (age - 1) + ' LAGs', 'big', 'middle');
      const x0 = 450, x1 = W - 40, y0 = 40, y1 = H - 110 - 70;
      const X = (t) => x0 + t / AMAX * (x1 - x0), Y = (m) => y1 - m * (y1 - y0);
      S('line', { x1: x0, x2: x1, y1, y2: y1, class: 'tick' }, g); S('line', { x1: x0, x2: x0, y1: y0, y2: y1, class: 'tick' }, g);
      let d = ''; for (let t = 0; t <= AMAX; t += 0.1) d += (t ? 'L' : 'M') + X(t).toFixed(1) + ',' + Y(mass(t)).toFixed(1);
      S('path', { d, class: 'curve' }, g);
      for (let t = 0; t <= AMAX; t += 2) txt(g, X(t), y1 + 32, t, 'ax', 'middle');
      txt(g, (x0 + x1) / 2, y1 + 62, 'years', 'ax', 'middle');
      txt(g, x0 - 10, Y(1) + 7, 'adult', 'ax', 'end');
      S('circle', { cx: X(age), cy: Y(mass(age)), r: 10, class: 'rootdot' }, g);
      txt(g, X(age) + 16, Y(mass(age)) + 34, Math.round(mass(age) * 100) + '% of adult mass', 'ln');
    }
    draw();
    return {};
  };
})();
