/* Every word on screen, every card, every list item. Edit wording here;
 * nothing in this file touches layout.
 *
 * Every case runs the same way on the balance: two hypotheses, the room
 * predicts (votes), evidence is dealt one card per build, you place each
 * card, then talk about where it tipped.
 *
 * A segment is a list of builds (one press each) and a list of items.
 * Build fields:
 *   prompt   the one line at the bottom. ~~struck~~ and *stressed* work.
 *   rail     which framework question lights: claim, evidence, else, test, sure
 *   tag      the term, shown small, after the case has done the work
 *   eye      this build's payoff needs the answers shown (P)
 *   extra    skipped unless extras are on (X)
 * Item fields:
 *   kind     which part draws it (see js/parts and js/cases)
 *   box      [x, y, width, height] on the 1600 × 900 stage
 *   at/until first build it shows on / first build it's gone (default: all)
 *   builds   or an explicit list of builds
 *   extra    only with extras on;  ans  only with answers shown
 * Balance fields: pans (two hypotheses: text, plus img/sketch/icon), vote (the
 * predict build), cards (text, back: what each hypothesis expects, at: the
 * build it's dealt on).
 * Card backs are drafts. Check each against the papers (SPEC.md).
 */
(function (root) {
  'use strict';

  const FULL = [40, 100, 1520, 690];
  const STAGE = [0, 100, 1600, 690];
  const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
  const PREDICT = 'Predict: which way will it tip?';
  /* One figure, one scale: these px sizes are the skulls as cut by img/make_tritoro.py. */
  const TRI = { src: 'img/triceratops.png', w: 343, h: 210, caption: 'Triceratops' };
  const TORO = { src: 'img/torosaurus.png', w: 409, h: 232, caption: 'Torosaurus' };

  const segments = [
    {
      id: 'title', title: 'Reasoning from Bones', mins: [0, 0],
      builds: [{}],
      items: [{ kind: 'title', box: [200, 200, 1200, 460], text: 'Reasoning from Bones' }]
    },

    {
      id: 'hook', title: 'Which end is the head?', mins: [0, 3],
      builds: [
        { prompt: 'Which end is the head?' },
        {}
      ],
      items: [{ kind: 'elasmo', box: STAGE, figAt: 1 }]
    },

    {
      id: 'framework', title: 'How do you know?', mins: [3, 7],
      builds: [
        {},
        { prompt: 'What exactly is the claim?' },
        { prompt: 'What do we see?' },
        { prompt: 'What else could do that?' },
        { prompt: 'What would tell them apart?' },
        { prompt: 'How sure should we be?' }
      ],
      items: [
        { kind: 'title', builds: [0], box: [100, 250, 1400, 400], text: 'HOW DO YOU KNOW?', plain: true },
        { kind: 'icons', at: 1, from: 1, box: [100, 220, 1400, 380] }
      ]
    },

    {
      id: 'elasmo', title: 'Head or tail?', mins: [7, 14],
      builds: [
        { prompt: 'Head on the short end, or the long end?', rail: 'claim' },
        { prompt: PREDICT, rail: 'sure' },
        { rail: 'evidence' },
        { rail: 'evidence' },
        { rail: 'evidence' },
        { rail: 'evidence' },
        { rail: 'evidence' },
        { rail: 'evidence' },
        { rail: 'evidence', extra: true },
        { prompt: 'Which cards did the tipping?', rail: 'test' }
      ],
      items: [
        {
          kind: 'balance', id: 'elasmo', box: FULL, vote: 1,
          pans: [
            { text: 'Head on the short end', img: 'img/cope-1869.png', w: 520 },
            { text: 'Head on the long end', img: 'img/cope-1870.png', w: 520 }
          ],
          cards: [
            { id: 'run', at: 2, text: 'One very long run of vertebrae', back: ['expected: a long tail', 'expected: a long neck'] },
            { id: 'chevrons', at: 3, text: 'Chevrons under the short end', back: ['not expected: chevrons sit under tails', 'expected: the short end is the tail'] },
            { id: 'facets', at: 4, text: 'Joint facets face the long end', back: ['not expected: the front faces the head', 'expected'] },
            { id: 'ribs', at: 5, text: 'Neck-style ribs along the long run', back: ['not expected', 'expected'] },
            { id: 'atlas', at: 6, text: 'Atlas and axis at the long end', back: ['not expected', 'expected: the skull sits on them'] },
            { id: 'famous', at: 7, text: 'A famous expert drew it', back: ['says nothing about the bones', 'says nothing about the bones'] },
            { id: 'lizards', at: 8, extra: true, text: 'Lizards have long tails', back: ['makes it seem likely', 'says nothing about this animal'] }
          ]
        }
      ]
    },

    {
      id: 'feathers', title: 'Feathered dinosaurs', mins: [14, 21],
      builds: [
        { prompt: 'Feathers? Or rotted skin fibers?', rail: 'claim' },
        { prompt: PREDICT, rail: 'sure' },
        { rail: 'evidence' },
        { prompt: 'Skeptical. What would convince you?', rail: 'else' },
        ...range(4, 8).map(() => ({ rail: 'evidence' })),
        { prompt: 'Confidence should move when evidence moves.' }
      ],
      items: [
        { kind: 'photo', builds: [0], box: [200, 110, 1200, 670], src: 'img/sinosauropteryx.jpg', alt: 'Sinosauropteryx head and neck, with a fringe of dark filaments along the neck and back' },
        {
          kind: 'balance', id: 'feathers', builds: [1, 2, 4, 5, 6, 7, 8, 9], box: FULL, vote: 1,
          pans: [{ text: 'Feathers' }, { text: 'Collagen' }],
          cards: [
            { id: 'sino', at: 2, text: 'Sinosauropteryx', sub: '1996 · fuzz', back: ['expected', 'expected'] },
            { id: 'lizards', at: 4, text: 'Fuzz on dinosaurs, not on lizards', back: ['expected: only feathered groups have it', 'not expected: lizards have collagen too'] },
            { id: 'caud', at: 5, text: 'Caudipteryx', sub: '1998 · vaned feathers', back: ['expected', "collagen can't make vanes"] },
            { id: 'micro', at: 6, text: 'Microraptor', sub: '2003 · four wings', back: ['expected', 'no'] },
            { id: 'pigment', at: 7, text: 'Sinosauropteryx', sub: '2010 · pigment inside', back: ['expected', 'no pigment bodies in collagen'] },
            { id: 'yut', at: 8, text: 'Yutyrannus', sub: '2012 · big, fuzzy', back: ['expected in more groups', 'also possible'] }
          ]
        },
        {
          kind: 'roomlist', id: 'feathers-convince', builds: [3], box: [200, 130, 1200, 640],
          items: ['More specimens', 'Better preservation', 'Branching', 'Many species', 'Pigment inside', "Can't be collagen"]
        }
      ]
    },

    {
      id: 'tric', title: 'Triceratops or Torosaurus?', mins: [21, 30],
      builds: [
        { prompt: 'Two species?', rail: 'claim' },
        { prompt: 'Or one animal, growing?', rail: 'else' },
        { prompt: 'Different skulls. Why else?', rail: 'else', extra: true },
        { prompt: PREDICT, rail: 'sure' },
        ...range(4, 9).map(() => ({ rail: 'evidence' })),
        { prompt: 'Close call. What would settle it?', rail: 'test' },
        { prompt: 'Growth can masquerade as species.', tag: 'confounding' }
      ],
      items: [
        { kind: 'pair', builds: [0, 1], box: STAGE, imgs: [TRI, TORO], scale: 1.4, base: 510, arrowAt: 1 },
        {
          kind: 'roomlist', id: 'tric-why', builds: [2], box: [200, 130, 1200, 640],
          items: ['Age', 'Sex', 'Just variation', 'Where it lived', 'Squashed in the rock', 'Evolution']
        },
        {
          kind: 'balance', id: 'tric', at: 3, box: FULL, vote: 3,
          pans: [{ text: 'Two species', pair: [TRI, TORO], join: '≠' }, { text: 'One, growing', pair: [TRI, TORO], join: '→' }],
          cards: [
            { id: 'nobaby', at: 4, text: 'No baby Torosaurus found', back: ['possible: a rare animal, rarer young', 'expected: Torosaurus is the adult'] },
            { id: 'oldfrill', at: 5, text: 'Torosaurus frills look old', back: ['possible: adults look adult', 'expected: the oldest stage'] },
            { id: 'young', at: 6, text: 'Subadult Torosaurus specimens', back: ['expected', "not expected: it's the oldest stage"] },
            { id: 'rare', at: 7, text: 'Torosaurus is much rarer', back: ['fine: a rare species', 'fine: few live that long'] },
            { id: 'between', at: 8, text: 'Few in-between skulls', back: ['expected', 'not expected: growth passes through them'] },
            { id: 'south', at: 9, text: 'Torosaurus without Triceratops', back: ['possible: different ranges', 'not expected: same animal, same places'] }
          ]
        }
      ]
    },

    {
      id: 'kpg', title: 'What ended the dinosaurs?', mins: [30, 39],
      builds: [
        { prompt: 'Something big happened 66 million years ago.', rail: 'claim' },
        { prompt: 'An impact, or volcanoes?', rail: 'else' },
        { prompt: PREDICT, rail: 'sure' },
        ...range(3, 8).map(() => ({ rail: 'evidence' })),
        ...range(9, 13).map(() => ({ rail: 'evidence', extra: true })),
        { prompt: 'Hard to explain without an impact? Without volcanoes?', rail: 'test' },
        { prompt: "The best explanation predicts what the others can't.", tag: 'inference to the best explanation' }
      ],
      items: [
        { kind: 'photo', builds: [0], box: [200, 110, 1200, 670], src: 'img/kpg-boundary.jpg', alt: 'A finger pointing at the thin pale K–Pg boundary layer in an outcrop' },
        {
          kind: 'balance', id: 'kpg', at: 1, box: FULL, vote: 2,
          pans: [{ text: 'Impact', icon: 'impact' }, { text: 'Volcanoes', icon: 'volcano' }],
          cards: [
            { id: 'ir', at: 3, text: 'Iridium spike', back: ['expected: asteroids are iridium-rich', 'a little, maybe'] },
            { id: 'qz', at: 4, text: 'Shocked quartz', back: ['expected', "no: eruptions don't reach the pressure"] },
            { id: 'sph', at: 5, text: 'Glass spherules', back: ['expected: melted ejecta', 'volcanic glass exists, wrong chemistry'] },
            { id: 'crater', at: 6, text: 'A 180 km crater', back: ['expected', 'no'] },
            { id: 'lava', at: 7, text: 'Huge lava flows, India', back: ['not predicted', 'expected'] },
            { id: 'climate', at: 8, text: 'Climate changed', back: ['expected', 'expected'] },
            { id: 'line', at: 9, extra: true, text: 'Extinction right at the line', back: ['expected: sudden', 'only if a pulse hit then'] },
            { id: 'hg', at: 10, extra: true, text: 'Mercury spike', back: ['not predicted', 'expected'] },
            { id: 'warm', at: 11, extra: true, text: 'Warming before the line', back: ['not predicted', 'expected'] },
            { id: 'tsunami', at: 12, extra: true, text: 'Tsunami beds, Gulf coast', back: ['expected near the crater', 'no'] },
            { id: 'age', at: 13, extra: true, text: 'Crater age = boundary age', back: ['expected', 'a coincidence'] }
          ]
        },
      ]
    },

    {
      id: 'signor', title: 'Were dinosaurs in decline before their extinction?', mins: [39, 60],
      builds: [
        { prompt: 'Were dinosaurs in decline before their extinction?', rail: 'claim' },
        { prompt: PREDICT, rail: 'sure' },
        ...range(2, 7).map(() => ({ rail: 'evidence' })),
        { prompt: 'Suppose all 20 die at the line.', rail: 'test' },
        { prompt: 'Does that look sudden?', rail: 'test' },
        { eye: true, rail: 'test' },
        { prompt: 'What if fossils were easier to find?', rail: 'test' },
        { prompt: 'Now where do the cards go?', rail: 'test' },
        { prompt: "We didn't find it. Why not?", rail: 'else' },
        { prompt: 'Absence is weak evidence when detection is poor.', tag: 'Signor–Lipps effect' },
        {}
      ],
      items: [
        {
          kind: 'photo', builds: [0, 15], box: [40, 104, 1520, 676], src: 'img/condamine2021-fig.jpg',
          alt: 'Late Cretaceous dinosaur speciation and extinction rates, with extinction overtaking speciation from about 76 million years ago',
          credit: 'Condamine et al. 2021, Nature Communications · doi:10.1038/s41467-021-23754-0 · CC BY 4.0'
        },
        {
          kind: 'balance', id: 'signor', builds: [1, 2, 3, 4, 5, 6, 7, 12, 14], box: FULL, vote: 1,
          pans: [{ text: 'All at once', sketch: 'abrupt' }, { text: 'Already in decline', sketch: 'taper' }],
          cards: [
            { id: 'short', at: 2, text: 'Last fossils fall short of the line', back: ['expected: finds thin out before the end', 'expected'] },
            { id: 'rates', at: 3, text: 'Extinction outpaced speciation', back: ['possible: if the record thins out', 'expected'] },
            { id: 'herbivores', at: 4, text: 'Herbivore variety shrank in North America', back: ['not expected', 'expected'] },
            { id: 'below', at: 5, text: 'Dinosaur bones just below the line', back: ['expected', 'possible: fewer, not none'] },
            { id: 'hellcreek', at: 6, text: 'Hell Creek: diverse to the end', back: ['expected', 'not expected'] },
            { id: 'rock', at: 7, text: 'Less late Cretaceous rock to search', back: ['expected: an apparent decline', 'fits too'] }
          ]
        },
        { kind: 'signor', id: 'signor', builds: [8, 9, 10, 11], box: FULL, sortAt: 9, truthAt: 10, knobAt: 11 },
        {
          kind: 'funnel', id: 'funnel', builds: [13], box: FULL,
          never: 'Never there',
          gates: [
            { text: 'Not buried', rate: 0.15 },
            { text: 'Destroyed since', rate: 0.4 },
            { text: 'Rock not exposed', rate: 0.2 },
            { text: 'Nobody looked', rate: 0.15 },
            { text: 'Not recognized', rate: 0.6 }
          ]
        }
      ]
    },

    {
      id: 'spino', title: 'Did Spinosaurus hunt underwater?', mins: [60, 68],
      builds: [
        { prompt: 'Did Spinosaurus hunt underwater?', rail: 'claim' },
        { prompt: PREDICT, rail: 'sure' },
        ...range(2, 7).map(() => ({ rail: 'evidence' })),
        { prompt: 'Evidence pulls both ways. What would settle it?', rail: 'test' }
      ],
      items: [
        {
          kind: 'balance', id: 'spino', box: FULL, vote: 1,
          pans: [{ text: 'Swam after prey' }, { text: 'Waded at the edge' }],
          cards: [
            { id: 'dense', at: 2, text: 'Dense, heavy limb bones', back: ['expected: ballast for diving', 'not expected'] },
            { id: 'tail', at: 3, text: 'Tall, paddle-like tail', back: ['expected: a tail to swim with', 'possible: display'] },
            { id: 'floats', at: 4, text: 'Floats tipped over in models', back: ['not expected: a diver needs to be stable', 'expected: it stood in the shallows'] },
            { id: 'sail', at: 5, text: 'Big sail on its back', back: ['a problem: drag and roll in water', 'fine: display on land'] },
            { id: 'isotopes', at: 6, text: "Bone chemistry like crocodiles'", back: ['expected', 'expected: it lived by water either way'] },
            { id: 'jaws', at: 7, text: 'Long jaws, cone-shaped teeth', back: ['expected: a fish eater', 'expected: a fish eater'] }
          ]
        }
      ]
    },

    {
      id: 'exit', title: 'Exit ticket', mins: [68, 75],
      builds: [{}, { extra: true }],
      items: [
        {
          kind: 'text', until: 1, box: [140, 170, 1000, 520], numbered: true,
          lines: ['A testable dinosaur claim. What would raise your confidence? Lower it?', 'Another explanation for that evidence.', 'One thing about how scientists decide.']
        },
        { kind: 'text', builds: [1], extra: true, box: [140, 300, 1000, 200], lines: ['A claim from outside science. Same questions.'] },
        { kind: 'placeholder', box: [1180, 250, 300, 300], label: 'QR code: response form' }
      ]
    }
  ];

  root.BONES = {
    rail: [
      { key: 'claim', label: 'Claim' },
      { key: 'evidence', label: 'Evidence' },
      { key: 'else', label: 'Else?' },
      { key: 'test', label: 'Test' },
      { key: 'sure', label: 'Sure?' }
    ],
    railTitle: 'How do you know?',
    railFrom: 'elasmo',
    funnel: { lived: 'Lived', found: 'found', madeUp: 'made-up rates' },
    signor: { boundary: 'K–Pg', taxa: 'taxa', chance: 'chance per level' },
    segments
  };
})(this);
