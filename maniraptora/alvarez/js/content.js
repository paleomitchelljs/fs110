/* Every word on screen, and the order. Edit wording here; layout lives in the parts.
 *
 * The deck walks through one paper, Makovicky et al. 2026, in the order it is written:
 * abstract, the skeleton, the tree, where they lived, body size. Each slide puts the
 * paper's own page on the left with the lines highlighted and blown up, and on the right
 * the figure those lines point at, a reference's own words, or a small model of the method.
 * The words in a lens come from the PDF (tools/quotes.py), so they can only be the
 * paper's. Labels are the paper's terms. No verdicts on the slides; the readme keeps the
 * points for saying aloud.
 *
 * LEVELS. tier: 1 = condensed, 2 = expanded, 3 = full. min: minutes for the clock.
 *
 * Text style:  _Name_ italic   *word* accent
 */
(function (root) {
  'use strict';

  const LEFT = [24, 124, 760, 662];
  const RIGHT = [812, 124, 764, 662];
  const FULL = [24, 124, 1552, 662];

  /* A picture from img/ with an optional crop [l, t, r, b] and ring, both as fractions of the file. */
  const V = (name, cap, at, crop, ring) => ({ src: 'img/' + name, cap: cap || '', at: at || 0, crop, ring });

  /* head: the section of the paper on the left, the topic card on the right (1-3 words, no question). */
  const head = (crumb, topic) => ({ kind: 'head', box: [0, 46, 1600, 72], crumb, topic });

  /* A walk slide. left: [quote id, build] pairs on the page. right: items for the right half,
   * each with its own builds. prompts: { build: text } for the line at the bottom. */
  function walk(id, title, tier, min, o) {
    const items = [head(o.crumb, o.topic)];
    let last = 0;
    if (o.left) {
      items.push({ kind: 'page', box: LEFT, steps: o.left.map(([q, at]) => ({ q, at })) });
      o.left.forEach(([, at]) => { last = Math.max(last, at); });
    }
    (o.right || []).forEach((r) => {
      items.push(Object.assign({ box: o.left ? RIGHT : FULL }, r));
      (r.views || r.steps || r.cards || []).forEach((v) => { last = Math.max(last, v.at || 0); });
      if (r.builds) last = Math.max(last, ...r.builds);
    });
    if (o.last != null) last = o.last;
    const builds = [];
    for (let b = 0; b <= last; b++) builds.push({ prompt: (o.prompts || {})[b] || '' });
    return { id, title, tier, min, builds, items };
  }
  const pic = (views, builds) => ({ kind: 'pic', views, builds });
  const ref = (steps, builds, refq) => ({ kind: 'page', lensOnly: true, steps: steps.map(([q, at, label]) => ({ q, at, label })), builds, ref: refq });
  const sim = (kind, builds, extra) => Object.assign({ kind, builds }, extra || {});
  const span = (a, b) => { const r = []; for (let i = a; i <= b; i++) r.push(i); return r; };

  const partTitle = (id, text, tier) => ({ id, title: text.replace(/_/g, ''), min: 0.3, tier: tier || 1, builds: [{}], items: [{ kind: 'title', box: [100, 200, 1400, 500], n: true, text }] });

  const papers = {
    mak26: { cite: 'Makovicky et al. 2026', short: 'Makovicky 2026', journal: '_Nature_' },
    qin21: { cite: 'Qin et al. 2021', short: 'Qin 2021', journal: '_Current Biology_' },
    xu18: { cite: 'Xu et al. 2018', short: 'Xu 2018', journal: '_Current Biology_' },
    xu11: { cite: 'Xu et al. 2011', short: 'Xu 2011', journal: '_PNAS_' },
    cho10: { cite: 'Choiniere et al. 2010', short: 'Choiniere 2010', journal: '_Science_' },
    lon09: { cite: 'Longrich & Currie 2009', short: 'Longrich 2009', journal: '_Cretaceous Research_' },
    lu18: { cite: 'Lü et al. 2018', short: 'Lü 2018', journal: '_China Geology_' },
    lee19: { cite: 'Lee et al. 2019', short: 'Lee 2019', journal: '_Scientific Reports_' }
  };

  const MAK1 = 'Makovicky et al. 2026 Fig 1';
  const MAK2A = 'Reduced consensus, implied weights · Makovicky et al. 2026 Fig 2a';
  const MAK2B = 'Mass on the best-fit tree · Makovicky et al. 2026 Fig 2b';

  const segments = [
    /* ---------------------------------------------------------- cover */
    { id: 'title', title: 'Alvarezsaurs', min: 1, tier: 1, builds: [{}], items: [{ kind: 'cover', box: [0, 0, 1600, 790], pic: 'img/mak-fig1.jpg', title: 'Alvarezsaurs' }] },

    /* ---------------------------------------------------------- 1 reading the paper */
    partTitle('p-read', 'Reading a paper'),

    walk('abstract', 'The abstract', 1, 5, {
      crumb: 'Abstract', topic: 'The abstract',
      left: [['m-abs-clade', 0], ['m-abs-grade', 1], ['m-abs-alna', 2], ['m-abs-poly', 3], ['m-abs-size', 4]],
      right: [{ kind: 'moves', cards: [
        { label: 'Background', at: 0 }, { label: 'Prior Claims', at: 1 }, { label: 'New evidence', at: 2 },
        { label: 'Result', at: 3 }, { label: 'New Claims', at: 4 }] }]
    }),

    walk('figure', 'One figure', 1, 4, {
      crumb: 'Figure 2', topic: 'One figure',
      left: [['m-fig2-title', 0]],
      right: [pic([
        V('mak-fig2a.jpg', 'Relationships · Makovicky et al. 2026 Fig 2a', 0),
        V('mak-fig2b.jpg', 'Time and body mass, on the same tree · Makovicky et al. 2026 Fig 2b', 1, [0.08, 0, 1, 0.74]),
        V('mak-fig2b.jpg', 'Letters: where each ancestor lived · Makovicky et al. 2026 Fig 2b', 2, [0.08, 0.05, 0.62, 0.45])
      ])]
    }),

    /* ---------------------------------------------------------- 2 building on sources */
    partTitle('p-build', 'Building on sources'),

    walk('together', 'Multiple sources', 1, 4, {
      crumb: 'Abstract', topic: 'Multiple sources = Multiple lines of evidence',
      left: [['m-abs-clade', 0]],
      right: [{ kind: 'quotes', cols: 1, size: 26, cards: [{ q: 'm-ref1', at: 1, label: 'ref 1' }, { q: 'm-ref2', at: 1, label: 'ref 2' }, { q: 'm-ref3', at: 1, label: 'ref 3' }] }],
      last: 1
    }),

    walk('compress', 'Each Claim', 1, 4, {
      crumb: 'Abstract', topic: 'Each Claim',
      left: [['m-abs-mini', 0], ['m-abs-grade', 1]],
      right: [
        ref([['q-rapid-s', 0]], [0]),
        ref([['x18-asia-short', 1]], [1])
      ]
    }),

    walk('newdata', 'The new evidence', 1, 3, {
      crumb: 'Introduction', topic: 'New evidence',
      left: [['m-int-here', 0], ['m-int-spur', 1]],
      right: [pic([
        V('mak-fig1.jpg', MAK1, 0),
        V('mak-ed5.jpg', 'Morrison Formation cervicals, first described in 1997 · Makovicky et al. 2026 ED Fig 5', 1)
      ])]
    }),

    walk('shared', 'Shared data', 2, 3, {
      crumb: 'Methods', topic: 'Shared data',
      left: [['m-meth-matrix', 0]],
      right: [pic([V('mak-ed7.jpg', 'The tree from that shared matrix · Makovicky et al. 2026 ED Fig 7a', 0, [0, 0, 1, 0.62])])]
    }),

    /* ---------------------------------------------------------- 3 comparing */
    partTitle('p-compare', 'Comparing'),

    walk('contrast', 'Compare everything', 1, 4, {
      crumb: 'Anatomy', topic: 'Compare',
      left: [['m-teeth', 0], ['m-forelimb', 1]],
      right: [pic([
        V('mak-ed3.jpg', 'Rostrum, MPCA Pv 377 · Makovicky et al. 2026 ED Fig 3a,b', 0, [0, 0, 1, 0.42]),
        V('mak-fig2b.jpg', 'Top: _Alnashetri_. Bottom: _Shuvuuia_ · Makovicky et al. 2026 Fig 2b', 1, [0.62, 0, 1, 0.75])
      ])]
    }),

    walk('mosaic', 'One idea, three papers', 2, 3, {
      crumb: 'Three papers', topic: 'Mosaic',
      right: [{ kind: 'quotes', cols: 1, size: 40, cards: [{ q: 'x11-mosaic-s', at: 0 }, { q: 'x18-mosaic-s', at: 1 }, { q: 'm-mosaic-s', at: 2 }] }]
    }),

    /* ---------------------------------------------------------- 4 disagreeing */
    partTitle('p-disagree', 'Disagreeing'),

    walk('origin', 'Origin', 1, 4, {
      crumb: 'Four papers', topic: 'Origin',
      right: [{ kind: 'quotes', cols: 2, size: 40, cards: [{ q: 'l-sa-short', at: 0 }, { q: 'c-asia', at: 1 }, { q: 'x18-asia-short', at: 2 }, { q: 'm-abs-pan', at: 3 }] }]
    }),

    walk('why', 'Why it changed', 1, 4, {
      crumb: 'Macroevolution', topic: 'Why it changed',
      left: [['m-dispersal', 0], ['m-widespread', 1]],
      right: [pic([
        V('xu11-fig3.jpg', 'Arrows: dispersals · Xu et al. 2011 Fig 3', 0),
        V('mak-fig2b.jpg', 'Pan: Pangaea · Makovicky et al. 2026 Fig 2b', 1, [0.08, 0.05, 0.62, 0.45])
      ])]
    }),

    walk('size', 'Body size', 1, 4, {
      crumb: 'Two papers', topic: 'Body size',
      left: [['m-contrast', 0]],
      right: [
        ref([['q-rapid-s', 0]], [0]),
        ref([['q-corr-short', 1]], [1])
      ],
      last: 1
    }),

    walk('ancestor', 'Which data', 2, 4, {
      crumb: 'Qin et al. 2021', topic: 'Which data',
      left: [['q-remove', 0]],
      right: [sim('root', [0])]
    }),

    walk('outside', 'Other fields', 1, 3, {
      crumb: 'Macroevolution', topic: 'Other fields',
      left: [['m-dryo', 0], ['m-myrm-range', 1]],
      right: [
        ref([['m-ref35', 0, 'ref 35']], [0]),
        ref([['m-ref37', 1, 'ref 37']], [1])
      ]
    }),

    /* ---------------------------------------------------------- 5 claims and limits */
    partTitle('p-limits', 'Claims and limits'),

    walk('hedges', 'Sized claims', 1, 3, {
      crumb: 'Macroevolution', topic: 'Sized claims',
      left: [['m-vicar', 0], ['m-medul', 1], ['m-limb2', 2]],
      right: [{ kind: 'moves', cards: [{ label: 'likely', at: 0 }, { label: 'presumably', at: 0 }, { label: 'possible', at: 1 }, { label: 'not necessarily', at: 2 }] }]
    }),

    walk('next', 'What next', 2, 2, {
      crumb: 'Last paragraph', topic: 'What next',
      left: [['m-anticipate', 0]],
      right: [pic([V('mak-ed6.jpg', '_Calamosaurus foxi_ NHM UK R901 · Makovicky et al. 2026 ED Fig 6', 0)])]
    }),

    /* ---------------------------------------------------------- end: the matrix */
    {
      id: 'matrix', title: 'Where claims came from', min: 6, tier: 1, builds: [{}, {}, {}, {}],
      items: [head('Five papers', 'Where claims came from'), {
        kind: 'matrix', box: [24, 124, 1552, 662], labelW: 210, cellsAt: 1, labelsAt: 2,
        cols: ['lon09', 'cho10', 'xu18', 'qin21', 'mak26'],
        rows: [
          { label: 'Origin', cells: { lon09: '"originated in South America"', cho10: '"originated in Asia rather than South America"', xu18: '"originated in Asia and remained there"', mak26: '"a Pangaean ancestral distribution"' } },
          { label: 'Body size', cells: { cho10: '"a pattern of miniaturization"', xu18: '"extreme arm reduction occurred late"', qin21: '"rapid miniaturization"', mak26: '"no support for evolutionary miniaturization"' } },
          { label: 'Diet', cells: { lon09: '"to dig into insect nests"', cho10: '"carnivory was the primitive condition"', qin21: '"myrmecophagous ecological niche"', mak26: '"under different ecologies"' } }
        ],
        focus: [
          { at: 0, label: "Organize your reading by others' papers" },
          { at: 1, label: 'Find claims from your readings' },
          { at: 2, label: 'Structure your paper by claims' },
          { at: 3, row: 0, label: 'Synthesize & evaluate by comparing a claim across papers' }]
      }]
    },

    {
      id: 'yours', title: 'Your five papers', min: 3, tier: 1, builds: [{}],
      items: [head('Your report', 'Your five papers'), {
        kind: 'matrix', box: [24, 124, 1552, 662], labelW: 210,
        cols: ['Paper 1', 'Paper 2', 'Paper 3', 'Paper 4', 'Paper 5'],
        rows: [{ label: 'Question 1' }, { label: 'Question 2' }, { label: 'Question 3' }]
      }]
    },

    /* ---------------------------------------------------------- appendix: the numbers (full level) */
    partTitle('p-numbers', 'The numbers behind the claims', 3),

    walk('models', 'Evolutionary patterns', 3, 5, {
      crumb: 'Methods', topic: 'Evolutionary patterns',
      left: [['m-meth-models', 0]],
      right: [sim('models', span(0, 3), { model: 'BM', steps: [{ model: 'BM', at: 0 }, { model: 'Lambda', at: 1 }, { model: 'OU', at: 2 }, { model: 'WN', at: 3 }] })],
      last: 3
    }),

    walk('weights', 'Model weights', 3, 4, {
      crumb: 'Two papers', topic: 'Akaike weights',
      left: [['q-ou', 0], ['m-models', 1]],
      right: [
        sim('aic', [0]),
        pic([V('mak-ed9.jpg', 'Each column one of 41,200 trees · Makovicky et al. 2026 ED Fig 9a', 1, [0, 0, 0.47, 1])], [1])
      ]
    }),

    walk('ghost', 'Ghost lineages', 3, 4, {
      crumb: 'Three papers', topic: 'Ghost lineages',
      left: [['c-ghost', 0], ['m-dyad', 1], ['m-meth-ger', 2]],
      right: [sim('ghost', span(0, 2))]
    }),

    walk('strat', 'Land and sea', 3, 4, {
      crumb: 'Methods', topic: 'Dispersal rate',
      left: [['m-meth-d', 0], ['m-meth-sa', 1]],
      right: [
        sim('disperse', [0], { T: 64, d: 0.0098 }),
        pic([V('mak-ed8.jpg', 'South America cut off from Laurasia after the Aptian · Makovicky et al. 2026 ED Fig 8b', 1, [0.52, 0, 0.86, 0.43])], [1])
      ]
    })
  ];

  root.ALVZ = { papers, railTitle: '', rail: [], segments };
})(this);
