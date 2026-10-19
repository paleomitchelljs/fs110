/* Every word on screen. Edit wording here; nothing in this file touches layout.
 *
 * Source: Funston et al. 2026, "Fruit-eating adaptations in a Late Cretaceous
 * oviraptorosaur (Theropoda)", Nature Communications (in press),
 * doi 10.1038/s41467-026-78343-w. Numbers and quoted words come from that paper.
 * Rows marked own:true are alternatives or checks the deck adds; the paper does
 * not raise them (they carry a small + on screen). Quotes are verbatim, with the
 * hedge words marked ==like this==. An ellipsis … marks cut text.
 *
 * Text style: fragments, no commas where a break will do.
 *   _Name_   italic        *word*   accent colour        ==word==   marked
 *
 * A claim page is one build per row, in this order: the claim, each piece of
 * evidence, each alternative, the test, the vote, the authors' words. The same
 * order every time, so the room learns the page once.
 *
 *   step   distance from the bone: 0 Bone, 1 Measure, 2 Model, 3 Analogy, 4 Beyond
 *   viz    pictures on the left; from: build number, or 'ev' 'alt' 'test' 'sure'
 *   extra  skipped unless extras are on (X)
 */
(function (root) {
  'use strict';

  const FIG = (name, cap, alt, from) => ({ kind: 'img', src: 'img/' + name + '.jpg', cap, alt, from: from || 0 });
  const CR = 'Funston et al. 2026';

  /* ---------------------------------------------------------------- claims */
  const C = {};

  C.c1 = {
    id: 'c1', n: 1, short: 'New species', step: 1,
    claim: 'Infernogallus is a new species of dinosaur',
    viz: [FIG('fig1-block', `Fig. 1a, b · ${CR}`, 'The fossil block and its line drawing')],
    evidence: [
      '12+ unique traits listed',
      'Broad cheek bone; tiny skull window',
      'Differs from _Eoneophron_ (same rocks)'
    ],
    alt: [
      'Juvenile of a known species',
      'Normal variation within one species',
      'Few skulls to compare'
    ],
    test: 'More specimens: same traits?',
    quotes: ['…much smaller body size (~21% [range 9.4–26%] of estimated mass) ==at maturity==']
  };

  C.e1 = {
    id: 'e1', n: 0, short: 'One species?', step: 1, extra: true,
    claim: 'All five specimens are one species',
    viz: [FIG('fig1-block', `Fig. 1a, b · ${CR}`, 'The fossil block and its line drawing')],
    evidence: [
      'Holotype: skull and skeleton in one block',
      'CT scans: skull is authentic',
      'Jaw pieces: same channel; same size'
    ],
    alt: [
      'Commercial dig; museum bought it',
      'Muscle sites read from loose bones',
      { t: 'Another small caenagnathid in the beds', own: true }
    ],
    test: 'A second articulated skeleton',
    quotes: ['==we interpret== the specimens to belong to the same individual']
  };

  C.c2 = {
    id: 'c2', n: 2, short: '12 kg', step: 2,
    claim: 'Infernogallus weighed about 12 kg',
    viz: [
      FIG('fig1-recon-only', `Fig. 1c · ${CR}`, 'Skeletal reconstruction with scale bar'),
      { kind: 'mass', from: 1, at: { femur: 1, eq: 2, mass: 3 } }
    ],
    evidence: [
      'Femur circumference measured',
      'Equation: circumference → body mass',
      'Result: 12 kg (range 9–15)'
    ],
    alt: [
      { t: 'Equation fitted on other body plans', own: true },
      { t: 'Volume models give other numbers', own: true },
      'Range is ±25%: 9 to 15 kg'
    ],
    test: 'Two methods: do they agree?',
    quotes: ['would have weighed ==approximately== 12 kg (9–15 kg) in life']
  };

  C.c3 = {
    id: 'c3', n: 3, short: 'Age', step: 2,
    claim: 'This specimen: 6–7 years old and basically full grown',
    viz: [FIG('fig1-hist', `Fig. 1d · ${CR}`, 'Thin section of the femur: growth marks and the outer crowded zone')],
    evidence: [
      '3 bones sliced: femur; fibula; foot',
      'Growth marks: 6+ (femur) · 7 (fibula)',
      'Outer marks crowded: growth slowing'
    ],
    alt: [
      'Inner marks erased: older than counted',
      { t: 'Marks ≠ years (assumed yearly)', own: true },
      { t: 'Slow spell ≠ finished growing', own: true }
    ],
    test: 'More animals: ring counts by size',
    quotes: ['==at least== 6 years; ==likely== 7', 'osteohistological signals ==confirm== skeletal maturity']
  };

  C.c4 = {
    id: 'c4', n: 4, short: 'Oviraptor?', step: 2,
    claim: 'Infernogallus is a new species of oviraptor',
    viz: [{ kind: 'nest' }],
    evidence: [
      'Toothless beak; ridged jaws',
      'Tree: 42 species × 271 traits',
      'Three tree-building methods',
      'Lands inside _Eucaenagnathinae_'
    ],
    alt: [
      'Beak look-alikes evolved separately',
      { t: 'Authors scored the traits', own: true },
      'Groups preset in the Bayesian run'
    ],
    test: 'New skeletons: does the tree hold?',
    quotes: ['==constrained== the tree topology to include a monophyletic … Caenagnathidae']
  };

  C.e2 = {
    id: 'e2', n: 0, short: 'Skull restored', step: 2, extra: true,
    claim: 'The digital skull matches the living animal',
    viz: [FIG('fig2-restore', `Fig. 2a, e · ${CR}`, 'The crushed skull, and the restored skull')],
    evidence: [
      'µCT: each bone separated',
      'Left side nearly intact',
      'Joints realigned bone to bone'
    ],
    alt: [
      'Relatives’ skulls used as guides',
      { t: 'Stretching is a judgment call', own: true },
      { t: 'Cheek window rests on the restoration', own: true }
    ],
    test: 'Redo with other templates',
    quotes: ['to follow the shape of an undistorted jaw of the eucaenagnathine ==Chirostenotes pergracilis==']
  };

  C.c5 = {
    id: 'c5', n: 5, short: 'Jaw muscles', step: 2,
    claim: 'Jaw muscles arranged differently from other oviraptors',
    viz: [
      FIG('fig2-vs', `Fig. 2e, f · ${CR}`, 'Skull of Infernogallus beside Citipati; the pterygoid muscle is the orange line'),
      FIG('fig3-pca', `Fig. 3c · ${CR}`, 'Principal components plot of jaw muscle direction', 3)
    ],
    evidence: [
      'Pterygoid muscle: fore–aft; not up–down',
      'Cheek window shrunk: 12.5% vs 48%',
      'Muscle plot: far from other theropods'
    ],
    alt: [
      'Muscle start points borrowed from relatives',
      'Crushed skull restored on a computer',
      'Only 4 other oviraptorosaurs compared'
    ],
    test: 'More skulls; vary the start points',
    quotes: ['==found no incompatibilities== between the anatomy of _Infernogallus jamesi_ and these inferred origins']
  };

  C.c6 = {
    id: 'c6', n: 6, short: 'Fore–aft jaw', step: 2,
    claim: 'Jaws allowed more fore–aft motion than a typical oviraptor',
    viz: [
      FIG('fig3-joint', `Fig. 3d–f · ${CR}`, 'Ridge and saddle of the jaw joint in Infernogallus, other caenagnathids and a parrot'),
      { kind: 'jaw', from: 2 }
    ],
    evidence: [
      'Ridge-and-saddle jaw joint',
      'Virtual jaw: up to 15 mm (14% of skull)',
      'Pterygoid buttress braces the slide'
    ],
    alt: [
      { t: 'Could ≠ did: bones only', own: true },
      'Cartilage and ligaments unknown',
      'Oviraptorid jaws: “more limited”; no mm given'
    ],
    test: 'Look for fore–aft wear scratches',
    quotes: ['up to 15 mm of anteroposterior jaw motion was ==possible==', 'soft tissues ==likely== affected true joint mobility']
  };

  /* claim 7 is a ladder, not a page of rows: see js/parts/ladder.js */
  C.c7 = {
    id: 'c7', n: 7, short: 'Fruit specialist', step: 3,
    claim: 'Infernogallus was specialized in fruit eating',
    test: 'Gut contents · wear marks · more skulls',
    quotes: ['==could have been== specialised for processing soft fleshy fruit', '==other soft plant materials== also formed a significant component']
  };
  const RUNGS = [
    { name: 'Chewed soft food', rows: [
      { k: 'ev', t: 'Weak bite: muscles reorganized' },
      { k: 'ev', t: 'No teeth; no stomach stones' },
      { k: 'alt', t: 'Muscle strength reconstructed only' }
    ] },
    { name: 'Soft plants', rows: [
      { k: 'ev', t: 'Closest living look-alikes eat plants' },
      { k: 'alt', t: 'Look-alikes drawn from beaked groups only' },
      { k: 'alt', t: 'Soft animal food: eggs; snails; grubs', own: true }
    ] },
    { name: 'Fruit in the diet', rows: [
      { k: 'ev', t: '_Psittrichas_: pulp-eating parrot; same muscles' },
      { k: 'ev', t: 'Fleshy fruit getting bigger' },
      { k: 'alt', t: 'Leaves and shoots fit as well' }
    ] },
    { name: 'Fruit specialist', rows: [
      { k: 'alt', t: 'No fruit found in any gut' },
      { k: 'alt', t: 'Living “fruit eaters”: very different habits' }
    ] }
  ];

  C.c8 = {
    id: 'c8', n: 8, short: 'All caenagnathids', step: 4,
    claim: 'Caenagnathid oviraptors in general ate fruit',
    viz: [FIG('fig4', `Fig. 4 · ${CR}`, 'Family tree of oviraptorosaurs against the rise of fleshy fruit')],
    evidence: [
      'Shared jaw bones match relatives',
      'Oldest relative: early versions of traits',
      'Fruit size rose as the group spread'
    ],
    alt: [
      'Only one skull; the rest are scraps',
      { t: 'One group; many species; many diets', own: true },
      'Origin dates are model estimates',
      { t: 'Rising together ≠ cause', own: true }
    ],
    test: 'Gut contents; skulls from other species',
    quotes: ['==at least partially== frugivorous diets (==but see== Supplementary Note 8)']
  };

  C.c9 = {
    id: 'c9', n: 9, short: 'Hidden diversity', step: 4,
    claim: 'We know less about pre-extinction diversity than we thought',
    viz: [
      FIG('fig1-recon-only', `Fig. 1c · ${CR}`, 'Skeletal reconstruction with scale bar'),
      { kind: 'accum', from: 'alt' }
    ],
    evidence: [
      'Hell Creek: a well-studied formation',
      'Small slim animals rarely preserve',
      'A new *kind* of animal; not just a name'
    ],
    alt: [
      'One species: one data point',
      'Small-animal gap was already known',
      'One find shows no trend',
      { t: 'Who claimed we had a handle?', own: true }
    ],
    test: 'Discovery curve: still climbing?',
    quotes: ['functional disparity ==may be== undersampled as well']
  };

  C.e3 = {
    id: 'e3', n: 0, short: 'Diet doomed it', step: 4, extra: true,
    claim: 'A specialized diet helps explain the extinction',
    viz: [FIG('fig1-recon-only', `Fig. 1c · ${CR}`, 'Skeletal reconstruction with scale bar')],
    evidence: [
      'Small: under the hypothesized size cutoff',
      'Herbivore with bird-like traits',
      'Fruit flesh seasonal; seeds persist'
    ],
    alt: [
      'Every non-avian dinosaur died out',
      { t: 'Stacks on claims 7 and 8', own: true },
      'One extinction; one case'
    ],
    test: 'Compare victims and survivors',
    quotes: ['==may have== consisted in large part of sporadic or seasonal foods']
  };

  /* ------------------------------------------------------------- segments */
  const claimBuilds = (c) => {
    const x = c.extra ? { extra: true } : {};
    const b = [{ rail: 'claim', ...x }];
    c.evidence.forEach(() => b.push({ rail: 'evidence', ...x }));
    c.alt.forEach(() => b.push({ rail: 'else', ...x }));
    b.push({ rail: 'test', ...x });
    b.push({ rail: 'sure', prompt: 'How sure?', ...x });
    if (c.quotes && c.quotes.length) b.push({ rail: 'sure', prompt: 'How sure?', ...x });
    return b;
  };
  const claimSeg = (c, mins) => ({
    id: c.id, title: c.short, mins, extra: !!c.extra,
    builds: claimBuilds(c),
    items: [{ kind: 'claim', box: [0, 0, 1600, 900], claim: c }]
  });

  const ladderSeg = (c, mins) => {
    const builds = [{ rail: 'claim' }];
    RUNGS.forEach((r) => r.rows.forEach((x, i) => builds.push({
      rail: x.k === 'ev' ? 'evidence' : 'else',
      ...(i === r.rows.length - 1 ? { prompt: 'How sure of this rung?' } : {})
    })));
    builds.push({ rail: 'test' });
    builds.push({ rail: 'sure', prompt: 'How sure of each rung?' });
    return {
      id: c.id, title: c.short, mins, builds,
      items: [{ kind: 'ladder', box: [0, 0, 1600, 900], claim: c, rungs: RUNGS }]
    };
  };

  const rankChips = [C.c1, C.c2, C.c3, C.c4, C.c5, C.c6, C.c7, C.c8, C.c9, C.e1, C.e2, C.e3];
  const WORDS = {
    c1: '(no hedge)', c2: 'approximately', c3: 'confirm', c4: '(no hedge)', c5: 'demonstrating',
    c6: 'we hypothesise', c7: 'could have been', c8: 'supports the idea', c9: 'may be',
    e1: 'we interpret', e2: 'approximate', e3: 'may have'
  };
  const LABELS = {
    c1: 'New species', c2: '12 kg', c3: 'Age 6–7', c4: 'Oviraptorosaur', c5: 'Muscles differ', c6: 'Fore–aft jaw',
    c7: 'Fruit specialist', c8: 'All caenagnathids', c9: 'Hidden diversity',
    e1: 'One species', e2: 'Skull restored', e3: 'Diet doomed it'
  };

  const segments = [
    {
      id: 'title', title: 'Dissecting a paper', mins: [0, 1],
      builds: [{}, { prompt: 'What is the title claiming?' }],
      items: [{
        kind: 'cover', box: [0, 0, 1600, 790], pic: 'img/fig1-recon-only.jpg', title: 'Dissecting a Paper',
        cite: 'Funston et al. 2026 · _Nature Communications_',
        claim: 'Fruit-eating adaptations in a Late Cretaceous oviraptorosaur', claimAt: 1
      }]
    },

    {
      id: 'map', title: 'Where claims live', mins: [1, 3],
      builds: [{}, { rail: 'claim' }, { rail: 'evidence' }, {}, { rail: 'else' }, {}, { rail: 'test' }],
      items: [{
        kind: 'map', box: [0, 100, 1600, 690],
        steps: [
          { lit: ['title', 'abstract'], icon: 'claim', word: 'Claims', sub: 'title · abstract' },
          { lit: ['figs', 'results'], icon: 'evidence', word: 'Evidence', sub: 'figures · results' },
          { lit: ['methods'], icon: 'method', word: 'Assumptions', sub: 'methods' },
          { lit: ['disc'], icon: 'else', word: 'Alternatives', sub: 'discussion' },
          { lit: ['supp'], icon: 'fine', word: 'Fine print', sub: 'supplement' },
          { lit: ['disc'], icon: 'test', word: 'Next tests', sub: 'end of discussion' }
        ]
      }]
    },

    {
      id: 'hedge', title: 'How sure are the authors?', mins: [3, 5.5],
      builds: [{ prompt: 'How sure are the authors?' }, {}, {}, {}, {}, {}, {}],
      items: [{
        kind: 'hedge', box: [40, 100, 1520, 690], lo: 'Unsure', hi: 'Sure',
        chips: [
          { id: 'h1', at: 1, text: 'Here we ==describe== _Infernogallus jamesi_ gen. et. sp. nov.' },
          { id: 'h2', at: 2, text: '==reveals== drastic changes to the adductor musculature' },
          { id: 'h3', at: 3, text: '==enabled== extensive oral processing of soft food' },
          { id: 'h4', at: 4, text: '==attests== to a highly specialised herbivorous diet' },
          { id: 'h5', at: 5, text: '==likely== consisted in large part of fleshy angiosperm fruits' },
          { id: 'h6', at: 6, text: 'their role in the Late Cretaceous proliferation of fruit … ==remains unclear==' }
        ]
      }]
    },

    {
      id: 'framework', title: 'How do you know?', mins: [5.5, 7.5],
      builds: [
        {},
        { prompt: 'What exactly is the claim?' },
        { prompt: 'What do we see?' },
        { prompt: 'What else could do that?' },
        { prompt: 'What would tell them apart?' },
        { prompt: 'How sure should we be?' }
      ],
      items: [
        { kind: 'title', builds: [0], box: [100, 250, 1400, 400], text: 'HOW DO YOU KNOW?' },
        { kind: 'icons', at: 1, from: 1, box: [100, 220, 1400, 380] }
      ]
    },

    claimSeg(C.c1, [7.5, 9]),
    claimSeg(C.e1, [9, 12]),
    claimSeg(C.c2, [9, 11.5]),
    claimSeg(C.c3, [11.5, 14.5]),
    claimSeg(C.c4, [14.5, 17.5]),
    claimSeg(C.e2, [17.5, 20]),
    claimSeg(C.c5, [17.5, 21]),
    claimSeg(C.c6, [21, 26]),
    ladderSeg(C.c7, [26, 32]),
    claimSeg(C.c8, [32, 36.5]),
    claimSeg(C.c9, [36.5, 40]),
    claimSeg(C.e3, [40, 42]),

    {
      id: 'rank', title: 'Sort the claims', mins: [40, 45],
      builds: [{ prompt: 'Sort by how sure', rail: 'sure' }, { prompt: 'How far from the bone?' }, { prompt: 'Authors’ words' }],
      items: [{
        kind: 'rank', box: [0, 100, 1600, 690],
        chips: rankChips.map((c) => ({ id: c.id, n: c.n, label: LABELS[c.id], step: c.step, extra: !!c.extra, word: WORDS[c.id] }))
      }]
    }
  ];

  root.INFERNO = {
    rail: [
      { key: 'claim', label: 'Claim' },
      { key: 'evidence', label: 'Evidence' },
      { key: 'else', label: 'Else?' },
      { key: 'test', label: 'Test' },
      { key: 'sure', label: 'Sure?' }
    ],
    railTitle: 'How do you know?',
    railFrom: 'c1',
    segments
  };
})(this);
