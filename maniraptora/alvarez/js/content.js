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
  const ref = (steps, builds, refq) => ({ kind: 'page', lensOnly: true, steps: steps.map(([q, at]) => ({ q, at })), builds, ref: refq });
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

    /* ---------------------------------------------------------- the folder */
    {
      id: 'shelf', title: 'The papers', min: 3, tier: 1, builds: [{}, {}, {}],
      items: [head('', 'Eight papers'), {
        kind: 'shelf', box: [24, 124, 1552, 662], badgesAt: 1, focusAt: 2, thumbH: 300,
        papers: [
          { key: 'lon09', year: 2009 }, { key: 'cho10', year: 2010 }, { key: 'xu11', year: 2011, ref: 20 },
          { key: 'xu18', year: 2018, ref: 11 }, { key: 'lu18', year: 2018 }, { key: 'lee19', year: 2019 },
          { key: 'qin21', year: 2021, ref: 2 }, { key: 'mak26', year: 2026, ref: '' }
        ]
      }]
    },

    /* ---------------------------------------------------------- abstract */
    partTitle('p-abs', 'Abstract and introduction'),

    walk('abs', 'What they are', 1, 4, {
      crumb: 'Abstract', topic: 'Alvarezsauroids',
      left: [['m-title', 0], ['m-abs-clade', 1], ['m-abs-dig', 2]],
      right: [pic([
        V('mak-fig1.jpg', MAK1, 0),
        V('xu11-fig3.jpg', 'Taxa and continents · Xu et al. 2011 Fig 3', 1),
        V('lon09-fig13.jpg', 'Ulna as a lever; numbers are mechanical advantage · Longrich & Currie 2009 Fig 13', 2)
      ])]
    }),

    walk('ants', 'Myrmecophagy', 1, 3, {
      crumb: 'Introduction', topic: 'Social insects',
      left: [['m-int-insects', 0]],
      right: [ref([['l-conform', 0], ['l-ants', 1], ['lu-eggs', 2]], [0, 1, 2])]
    }),

    walk('mini', 'Miniaturization', 1, 3, {
      crumb: 'Abstract', topic: 'Miniaturization',
      left: [['m-abs-mini', 0]],
      right: [ref([['q-def', 0], ['q-rapid', 1]], [0, 1], 'm-ref2')]
    }),

    walk('qin3', 'Qin Fig 3', 1, 3, {
      crumb: 'Reference 2', topic: 'Body mass',
      left: [['q-anc', 0], ['q-plunge', 1]],
      right: [pic([
        V('qin-fig3.jpg', 'Body mass on the tree · Qin et al. 2021 Fig 3A', 0, [0, 0, 1, 0.66]),
        V('qin-fig3.jpg', 'Red: to mid-Cretaceous. Blue: the drop · Qin et al. 2021 Fig 3A', 1, [0, 0.12, 1, 0.66])
      ])]
    }),

    walk('grade', 'South American taxa', 1, 3, {
      crumb: 'Abstract', topic: 'Dispersal',
      left: [['m-abs-grade', 0]],
      right: [
        pic([V('xu11-fig3.jpg', 'Arrows: dispersals · Xu et al. 2011 Fig 3', 0)], [0]),
        ref([['x11-asia', 1]], [1], 'm-ref20')
      ]
    }),

    walk('claims', 'Three claims', 1, 3, {
      crumb: 'Abstract', topic: 'The claims',
      left: [['m-abs-alna', 0], ['m-abs-poly', 1], ['m-abs-pan', 2], ['m-abs-size', 3]],
      right: [pic([
        V('mak-fig1.jpg', MAK1, 0),
        V('mak-fig2a.jpg', MAK2A, 1, [0.1, 0.05, 0.62, 0.62], [0.24, 0.2, 0.43, 0.33]),
        V('mak-fig2b.jpg', MAK2B + '; letters are ancestral areas', 2, [0.08, 0.05, 0.62, 0.45]),
        V('mak-fig2b.jpg', MAK2B, 3, [0.08, 0, 1, 0.74])
      ])]
    }),

    /* ---------------------------------------------------------- the skeleton */
    partTitle('p-bones', 'The new skeleton'),

    walk('specimen', 'MPCA Pv 377', 1, 3, {
      crumb: 'Anatomy', topic: 'The specimen',
      left: [['m-specimen', 0], ['m-missing', 1], ['m-assign', 2]],
      right: [pic([
        V('mak-ed1.jpg', 'Cerro Policía; Neuquén Group · Makovicky et al. 2026 ED Fig 1', 0, [0, 0, 1, 0.52]),
        V('mak-ed1.jpg', 'Before preparation · Makovicky et al. 2026 ED Fig 1e', 1, [0, 0.52, 1, 1]),
        V('mak-ed2.jpg', 'MPCA Pv 377 and Pv 477 against _Patagonykus_, _Alvarezsaurus_ · Makovicky et al. 2026 ED Fig 2', 2)
      ])]
    }),

    walk('teeth', 'Teeth', 1, 3, {
      crumb: 'Anatomy', topic: 'Teeth',
      left: [['m-pmx', 0], ['m-teeth', 1]],
      right: [
        pic([V('mak-ed3.jpg', 'Rostrum, MPCA Pv 377 · Makovicky et al. 2026 ED Fig 3a,b', 0, [0, 0, 1, 0.42])], [0, 1]),
        ref([['l-teeth', 2]], [2])
      ],
      last: 2
    }),

    walk('forelimb', 'Forelimb', 1, 3, {
      crumb: 'Anatomy', topic: 'Forelimb',
      left: [['m-forelimb', 0], ['m-fig2-sil', 1]],
      right: [pic([
        V('xu18-fig3.jpg', 'Forelimbs scaled to femur length · Xu et al. 2018 Fig 3', 0),
        V('mak-fig2b.jpg', 'Top: _Alnashetri_. Bottom: _Shuvuuia_ · Makovicky et al. 2026 Fig 2b', 1, [0.62, 0, 1, 0.75])
      ])]
    }),

    walk('olecranon', 'Olecranon', 2, 3, {
      crumb: 'Anatomy', topic: 'Olecranon',
      left: [['m-olec', 0]],
      right: [
        pic([V('lon09-fig13.jpg', 'Longrich & Currie 2009 Fig 13', 0)], [0]),
        sim('lever', [1])
      ],
      last: 1
    }),

    walk('manus', 'Hand', 1, 3, {
      crumb: 'Anatomy', topic: 'Hand',
      left: [['m-manus', 0], ['m-claw', 1]],
      right: [pic([
        V('mak-ed4.jpg', 'Manus, MPCA Pv 377 · Makovicky et al. 2026 ED Fig 4l', 0, [0.27, 0.78, 0.66, 1]),
        V('xu11-fig4.jpg', 'Digit II gray · Xu et al. 2011 Fig 4', 1),
        V('cho10-fig3.jpg', 'B _Allosaurus_ · C _Haplocheirus_ · D _Shuvuuia_ · E _Deinonychus_ · Choiniere et al. 2010 Fig 3', 2, [0.62, 0, 1, 1])
      ])]
    }),

    walk('mosaic', 'Mosaic', 1, 3, {
      crumb: 'Three papers', topic: 'Mosaic',
      right: [{ kind: 'quotes', cols: 3, cards: [{ q: 'x11-mosaic', at: 0 }, { q: 'x18-mosaic', at: 1 }, { q: 'm-mosaic', at: 2 }] }]
    }),

    walk('histo', 'Growth lines', 1, 4, {
      crumb: 'Histology', topic: 'Growth lines',
      left: [['m-histo', 0], ['m-medul', 1], ['q-check', 2]],
      right: [
        pic([
          V('mak-fig3.jpg', 'Humerus MPCA Pv 377 (a–c); femur, tibia MPCA Pv 477 (d–f) · Makovicky et al. 2026 Fig 3', 0),
          V('mak-fig3.jpg', 'icl, inner circumferential layer; ewb, endosteal woven-fibred bone · Makovicky et al. 2026 Fig 3c', 1, [0, 0.34, 0.5, 0.68])
        ], [0, 1]),
        sim('growth', [2])
      ]
    }),

    /* ---------------------------------------------------------- the tree */
    partTitle('p-tree', 'The tree'),

    walk('tree', 'Tree', 1, 4, {
      crumb: 'Macroevolution', topic: 'The tree',
      left: [['m-poly', 0], ['m-lacks', 1]],
      right: [pic([
        V('mak-fig2a.jpg', MAK2A, 0),
        V('mak-fig2a.jpg', MAK2A, 1, [0.1, 0.05, 0.62, 0.62], [0.24, 0.2, 0.43, 0.33])
      ])]
    }),

    walk('support', 'Support', 2, 4, {
      crumb: 'Methods', topic: 'Support',
      left: [['m-meth-supp', 0]],
      right: [
        pic([V('mak-fig2a.jpg', 'Above: symmetric resampling. Below: Bremer · Makovicky et al. 2026 Fig 2a', 0, [0.1, 0.05, 0.75, 1])], [0]),
        sim('resample', [1], { k: 5, c: 2, p: 0.25 })
      ],
      last: 1
    }),

    walk('wild', 'Wildcards', 3, 3, {
      crumb: 'Methods', topic: 'Wildcards',
      left: [['m-meth-tnt', 0], ['m-meth-wild', 1]],
      right: [pic([
        V('mak-ed7.jpg', 'Equal weights; stippled lines are wildcards · Makovicky et al. 2026 ED Fig 7a', 0, [0, 0, 1, 0.62]),
        V('mak-fig2a.jpg', 'Colored areas: where each wildcard can go · Makovicky et al. 2026 Fig 2a', 1)
      ])]
    }),

    walk('haplo', 'Haplocheirus', 1, 4, {
      crumb: 'Reference not cited', topic: '_Haplocheirus_',
      left: [['c-abs', 0], ['x18-firm', 1]],
      right: [pic([
        V('cho10-fig3.jpg', 'Choiniere et al. 2010 Fig 3', 0, [0, 0, 0.62, 1], [0.1, 0.485, 0.4, 0.54]),
        V('mak-ed7.jpg', 'Equal weights · Makovicky et al. 2026 ED Fig 7a', 2, [0.1, 0, 0.85, 0.45], [0.4, 0.205, 0.58, 0.25])
      ])],
      last: 2
    }),

    walk('laurasia', 'Morrison and Isle of Wight', 1, 3, {
      crumb: 'Macroevolution', topic: 'Two old taxa',
      left: [['m-twotaxa', 0], ['m-synap', 1]],
      right: [pic([
        V('mak-ed5.jpg', 'Morrison Formation cervicals YPM 1996, 1997 · Makovicky et al. 2026 ED Fig 5', 0),
        V('mak-ed6.jpg', '_Calamosaurus foxi_ NHM UK R901 · Makovicky et al. 2026 ED Fig 6', 1),
        V('mak-ed4.jpg', '_Xiyunykus_ cervical IVPP 22783 · Makovicky et al. 2026 ED Fig 4d', 2, [0.05, 0.24, 0.34, 0.52])
      ])]
    }),

    walk('ghost', 'Ghost lineages', 1, 5, {
      crumb: 'Three papers', topic: 'Ghost lineages',
      left: [['c-ghost', 0], ['x18-gap', 1], ['m-dyad', 2], ['m-meth-ger', 3], ['c-fit', 4]],
      right: [sim('ghost', span(0, 4))]
    }),

    walk('calib', 'Time-scaling', 3, 3, {
      crumb: 'Methods', topic: 'Time-scaling',
      left: [['m-meth-cal', 0]],
      right: [pic([V('mak-fig2b.jpg', MAK2B, 0, [0.08, 0, 1, 1])])]
    }),

    /* ---------------------------------------------------------- biogeography */
    partTitle('p-geo', 'Where they lived'),

    walk('origin', 'Origin', 1, 4, {
      crumb: 'Four papers', topic: 'Origin',
      right: [{ kind: 'quotes', cols: 2, cards: [{ q: 'l-sa', at: 0 }, { q: 'c-asia', at: 1 }, { q: 'x18-dispersal', at: 2 }, { q: 'm-abs-pan', at: 3 }] }]
    }),

    walk('backforth', 'Back and forth', 1, 3, {
      crumb: 'Macroevolution', topic: 'Dispersal',
      left: [['m-dispersal', 0]],
      right: [
        pic([V('xu11-fig3.jpg', 'Xu et al. 2011 Fig 3', 0)], [0]),
        ref([['x18-vicar', 1]], [1], 'm-ref11')
      ]
    }),

    walk('strat', 'Land and sea', 1, 4, {
      crumb: 'Methods', topic: 'Dispersal rate',
      left: [['m-meth-d', 0], ['m-meth-sa', 1]],
      right: [
        sim('disperse', [0], { T: 64, d: 0.0098 }),
        pic([V('mak-ed8.jpg', 'S-DEC: a, open; b, South America cut off after the Aptian · Makovicky et al. 2026 ED Fig 8a,b', 1, [0, 0, 1, 0.5])], [1])
      ]
    }),

    walk('pangaea', 'Pangaea', 1, 3, {
      crumb: 'Macroevolution', topic: 'Vicariance',
      left: [['m-widespread', 0], ['m-vicar', 1]],
      right: [pic([
        V('mak-fig2b.jpg', 'Pan, Pangaea · A, Asia · E, Europe · S, South America · Makovicky et al. 2026 Fig 2b', 0, [0.08, 0.05, 0.62, 0.45]),
        V('mak-ed8.jpg', 'Stratified BioGeoBEARS, best-fit tree · Makovicky et al. 2026 ED Fig 8d', 1, [0.42, 0.48, 1, 1])
      ])]
    }),

    /* ---------------------------------------------------------- body size */
    partTitle('p-size', 'Body size'),

    walk('tiny', 'Under 1 kg', 1, 3, {
      crumb: 'Macroevolution', topic: 'Body mass',
      left: [['m-mass', 0], ['m-indep', 1]],
      right: [pic([
        V('qin-tab1.jpg', 'Qin et al. 2021 Table 1', 0),
        V('mak-fig2b.jpg', MAK2B, 1, [0.08, 0, 1, 0.74], [0.45, 0.13, 0.7, 0.2])
      ])]
    }),

    walk('ecology', 'Digging and size', 1, 4, {
      crumb: 'Macroevolution', topic: 'Size and diet',
      left: [['m-myrm', 0], ['m-limb2', 1], ['m-teeth2', 2], ['m-ecol', 3]],
      right: [
        ref([['q-driven', 0]], [0], 'm-ref2'),
        pic([V('xu18-fig4.jpg', 'Forelimb length against body mass · Xu et al. 2018 Fig 4', 1)], [1, 2, 3])
      ]
    }),

    walk('models', 'Four models', 1, 5, {
      crumb: 'Methods', topic: 'Four models',
      left: [['m-meth-models', 0]],
      right: [sim('models', span(0, 3), { model: 'BM', steps: [{ model: 'BM', at: 0 }, { model: 'Lambda', at: 1 }, { model: 'OU', at: 2 }, { model: 'WN', at: 3 }] })],
      last: 3
    }),

    walk('weights', 'Model weights', 1, 4, {
      crumb: 'Two papers', topic: 'Akaike weights',
      left: [['q-ou', 0], ['m-models', 1]],
      right: [
        sim('aic', [0]),
        pic([V('mak-ed9.jpg', 'Each column one of 41,200 trees · Makovicky et al. 2026 ED Fig 9a', 1, [0, 0, 0.47, 1])], [1])
      ]
    }),

    walk('correction', 'Correction', 1, 3, {
      crumb: 'Qin et al. 2021, correction', topic: 'Branch lengths',
      left: [['q-corr-ou', 0], ['q-corr-no', 1]],
      right: [ref([['m-meth-cal', 0]], [0, 1])],
      last: 1
    }),

    walk('ancestor', 'The ancestor', 1, 5, {
      crumb: 'Reference 2', topic: 'Ancestor size',
      left: [['q-anc', 0], ['q-hatch', 1], ['q-remove', 2]],
      right: [sim('root', span(0, 2))]
    }),

    walk('updown', 'Up and down', 2, 3, {
      crumb: 'Macroevolution', topic: 'Up and down',
      left: [['m-updown', 0], ['m-ed9-cap', 1]],
      right: [pic([V('mak-ed9.jpg', 'Body mass on all 41,200 trees · Makovicky et al. 2026 ED Fig 9b', 0, [0.47, 0, 1, 1])])],
      last: 1
    }),

    /* ---------------------------------------------------------- end */
    {
      id: 'matrix', title: 'Who said what', min: 5, tier: 1, builds: [{}, {}, {}, {}],
      items: [head('Seven papers', 'Who said what'), {
        kind: 'matrix', box: [24, 124, 1552, 662], labelW: 200,
        cols: ['lon09', 'cho10', 'xu11', 'xu18', 'lu18', 'qin21', 'mak26'],
        rows: [
          { label: 'Where they began', at: 0, cells: { lon09: '"originated in South America"', cho10: '"originated in Asia rather than South America"', xu11: '"originated in Asia"', xu18: '"originated in Asia and remained there"', mak26: '"a Pangaean ancestral distribution"' } },
          { label: '_Haplocheirus_', at: 1, cells: { cho10: '"the earliest diverging member"', xu18: '"firmly within Alvarezsauria"', qin21: '41 kg, juvenile (Table 1)', mak26: 'outside Alvarezsauroidea (ED Fig 7a)' } },
          { label: 'Body size', at: 2, cells: { cho10: '"a pattern of miniaturization"', xu18: '"extreme arm reduction occurred late"', qin21: '"rapid miniaturization"; correction: "can no longer robustly support selective pressure"', mak26: '"no support for evolutionary miniaturization"' } },
          { label: 'Diet', at: 3, cells: { lon09: '"the only plausible explanation"', cho10: '"carnivory was the primitive condition"', lu18: '"may be egg-eaters"', qin21: '"myrmecophagous ecological niche"', mak26: '"under different ecologies"' } }
        ]
      }]
    }
  ];

  root.ALVZ = { papers, railTitle: '', rail: [], segments };
})(this);
