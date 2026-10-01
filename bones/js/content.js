/* Every word on screen, every card, every list item. Edit wording here;
 * nothing in this file touches layout.
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
 * Card backs are drafts. Check each against the papers (SPEC.md).
 */
(function (root) {
  'use strict';

  const FULL = [40, 100, 1520, 690];

  const segments = [
    {
      id: 'title', title: 'Reasoning from Bones', mins: [0, 0],
      builds: [{}],
      items: [{ kind: 'title', box: [200, 200, 1200, 460], text: 'Reasoning from Bones' }]
    },

    {
      id: 'hook', title: 'The head on the wrong end', mins: [0, 7],
      builds: [
        { prompt: 'Which end is the head?', extra: true },
        { prompt: 'One of these is wrong.' },
        { prompt: 'How would you check?' },
        {},
        { prompt: 'Does a famous name change the evidence?' },
        { eye: true },
        { prompt: '~~Who said it?~~ What would let us check it?' },
        {}
      ],
      items: [
        { kind: 'placeholder', at: 0, until: 1, box: [160, 180, 1280, 420], label: 'headless skeleton; drag the skull to either end' },
        { kind: 'placeholder', at: 1, until: 7, box: [160, 110, 1280, 215], label: "Cope's 1869 plate" },
        { kind: 'placeholder', at: 1, until: 7, box: [160, 345, 1280, 215], label: 'modern skeletal' },
        { kind: 'placeholder', at: 5, until: 7, box: [560, 160, 480, 110], label: 'skull slides to the neck end' },
        { kind: 'tag', at: 4, until: 7, box: [1190, 124], text: 'E. D. Cope, 1869' },
        { kind: 'tag', at: 5, until: 7, ans: true, box: [1190, 359], text: 'J. Leidy, 1870' },
        {
          kind: 'cards', at: 3, until: 7, box: [160, 600, 1280, 150], labels: ['Neck', 'Tail'],
          cards: [
            { id: 'joint', text: 'Skull joint', back: ['…', '…'] },
            { id: 'chev', text: 'Chevrons', back: ['…', '…'] },
            { id: 'ribs', text: 'Ribs', back: ['…', '…'] },
            { id: 'facets', text: 'Facet direction', back: ['…', '…'] }
          ]
        },
        { kind: 'title', at: 7, box: [100, 250, 1400, 400], text: 'HOW DO YOU KNOW?', plain: true }
      ]
    },

    {
      id: 'framework', title: 'How do you know?', mins: [7, 12], railFrom: 5,
      builds: [
        { prompt: 'What exactly is the claim?' },
        { prompt: 'What do we see?' },
        { prompt: 'What else could do that?' },
        { prompt: 'What would tell them apart?' },
        { prompt: 'How sure should we be?' },
        { prompt: 'Fits mine?', rail: 'test' },
        { prompt: 'Or fits mine *better*?', rail: 'test' }
      ],
      items: [
        { kind: 'icons', until: 5, box: [100, 220, 1400, 380] },
        {
          kind: 'balance', id: 'fw', at: 5, box: FULL, labels: ['My idea', 'The other idea'], rightAt: 6,
          cards: [{ id: 'ev', text: 'The evidence', back: ['fits', 'fits'], place: { 5: 'left', 6: 'pivot' } }]
        }
      ]
    },

    {
      id: 'argument', title: 'Valid vs. sound', mins: [12, 18],
      builds: [
        { prompt: 'If these were true, would this have to be?', rail: 'claim' },
        { prompt: 'Are they true?', rail: 'evidence' },
        { tag: 'valid · sound' },
        { prompt: 'Same two questions.', rail: 'claim' },
        { prompt: "Where's the tail mark?", rail: 'evidence' },
        { prompt: 'Wrong conclusion? Check the premises.' },
        { extra: true, tag: 'validity is shape, not truth' }
      ],
      items: [
        { kind: 'placeholder', box: [200, 140, 1200, 560], label: 'premise tiles, Follows and True lamps, trackway' }
      ]
    },

    {
      id: 'tric', title: 'Triceratops or Torosaurus?', mins: [18, 30],
      builds: [
        { prompt: 'Two species?', rail: 'claim' },
        { prompt: "What's different?", rail: 'evidence' },
        { prompt: 'Different skulls. Why else?', rail: 'else' },
        { prompt: 'Same bones. Two stories.', rail: 'else' },
        { prompt: 'Expected by one story, not the other?', rail: 'test' },
        { prompt: 'How sure?', rail: 'sure' },
        { prompt: 'Growth can masquerade as species.', tag: 'confounding' }
      ],
      items: [
        { kind: 'placeholder', until: 2, box: [160, 140, 1280, 560], label: 'two skulls; callouts on build 2' },
        {
          kind: 'roomlist', id: 'tric-why', builds: [2], box: [200, 130, 1200, 640],
          items: ['Age', 'Sex', 'Just variation', 'Where it lived', 'Squashed in the rock', 'Evolution']
        },
        { kind: 'placeholder', builds: [3], box: [160, 140, 1280, 560], label: 'growth morph: drag the frill to age the skull; one row or two' },
        {
          kind: 'balance', id: 'tric', builds: [4, 6], box: FULL, labels: ['Two species', 'One, growing'],
          cards: [
            { id: 'baby', text: 'Baby Torosaurus', back: ['should turn up somewhere', "can't exist"] },
            { id: 'texture', text: 'Bone texture', back: ['some Torosaurus could be young', 'every Torosaurus is old'] },
            { id: 'where', text: "Where they're found", back: ['Torosaurus could live alone', 'never without Triceratops'] },
            { id: 'common', text: 'How common', back: ['rare species: fine', 'few reach old age: fine'] },
            { id: 'between', text: 'In-between skulls', back: ['few, as variation', 'many'] }
          ]
        },
        { kind: 'confidence', id: 'tric', round: 1, builds: [5], box: [300, 140, 1000, 600] }
      ]
    },

    {
      id: 'signor', title: 'The dwindling dinosaurs', mins: [30, 42],
      builds: [
        { prompt: 'Everything dies at once. What do the fossils show?', rail: 'claim' },
        { rail: 'evidence' },
        { prompt: 'Gradual decline?', rail: 'claim' },
        { eye: true, rail: 'else' },
        { prompt: 'What if fossils were easier to find?', rail: 'test' },
        { prompt: "We didn't find it. Why not?", rail: 'else' },
        { prompt: 'No keys in the kitchen. What did you learn?' },
        { prompt: 'Absence is weak evidence when detection is poor.', tag: 'Signor–Lipps effect' }
      ],
      items: [
        {
          kind: 'picker', id: 'signor-pick', builds: [0], box: [120, 150, 1360, 580],
          options: [{ key: 'A', sketch: 'abrupt' }, { key: 'B', sketch: 'taper' }, { key: 'C', sketch: 'scatter' }]
        },
        { kind: 'signor', id: 'signor', builds: [1, 2, 3, 4, 7], box: FULL, picker: 'signor-pick', sortAt: 2, truthAt: 3, knobAt: 4 },
        {
          kind: 'funnel', id: 'funnel', builds: [5, 6], box: FULL,
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
      id: 'kpg', title: 'What ended the dinosaurs?', mins: [42, 54],
      builds: [
        { prompt: 'Something big happened 66 million years ago.', rail: 'claim' },
        { prompt: 'Which pan?', rail: 'test' },
        { prompt: 'Hard to explain without an impact?', rail: 'test' },
        { prompt: 'Hard to explain without volcanoes?', rail: 'test' },
        { prompt: 'What changed minds?' },
        { prompt: 'Both happened. How much did each matter?' },
        { prompt: 'How sure?', rail: 'sure' },
        { prompt: "The best explanation predicts what the others can't.", tag: 'inference to the best explanation' }
      ],
      items: [
        { kind: 'placeholder', builds: [0], box: [160, 130, 1280, 520], label: 'boundary clay photo' },
        { kind: 'tag', builds: [0], box: [420, 680], text: 'Impact' },
        { kind: 'tag', builds: [0], box: [960, 680], text: 'Volcanoes' },
        {
          kind: 'balance', id: 'kpg', builds: [1, 2, 3, 7], box: FULL, labels: ['Impact', 'Volcanoes'], pile: true,
          cards: [
            { id: 'ir', text: 'Iridium spike', back: ['expected: asteroids are iridium-rich', 'a little, maybe'] },
            { id: 'qz', text: 'Shocked quartz', back: ['expected', "no: eruptions don't reach the pressure"] },
            { id: 'sph', text: 'Glass spherules', back: ['expected: melted ejecta', 'volcanic glass exists, wrong chemistry'] },
            { id: 'crater', text: 'A 180 km crater', back: ['expected', 'no'] },
            { id: 'lava', text: 'Huge lava flows, India', back: ['not predicted', 'expected'] },
            { id: 'climate', text: 'Climate changed', back: ['expected', 'expected'] },
            { id: 'line', extra: true, text: 'Extinction right at the line', back: ['expected: sudden', 'only if a pulse hit then'] },
            { id: 'hg', extra: true, text: 'Mercury spike', back: ['not predicted', 'expected'] },
            { id: 'warm', extra: true, text: 'Warming before the line', back: ['not predicted', 'expected'] },
            { id: 'tsunami', extra: true, text: 'Tsunami beds, Gulf coast', back: ['expected near the crater', 'no'] },
            { id: 'age', extra: true, text: 'Crater age = boundary age', back: ['expected', 'a coincidence'] }
          ]
        },
        { kind: 'placeholder', builds: [4], box: [160, 140, 1280, 560], label: 'timeline: 1980 iridium → 2019 Deccan timing' },
        { kind: 'placeholder', builds: [5], box: [160, 140, 1280, 560], label: 'timing chart: Deccan pulses (Schoene / Sprain 2019) and the impact' },
        { kind: 'confidence', id: 'kpg', round: 1, builds: [6], box: [300, 140, 1000, 600] }
      ]
    },

    {
      id: 'feathers', title: 'Feathered dinosaurs', mins: [54, 62],
      builds: [
        { prompt: 'Feathers? Or rotted skin fibers?', rail: 'claim' },
        { prompt: 'How sure, from this alone?', rail: 'sure' },
        { prompt: 'Skeptical. What would convince you?', rail: 'else' },
        { rail: 'evidence' },
        { rail: 'evidence' },
        { rail: 'evidence' },
        { rail: 'evidence' },
        { rail: 'evidence' },
        { prompt: 'Now?', rail: 'sure' },
        { prompt: 'Confidence should move when evidence moves.' }
      ],
      items: [
        { kind: 'placeholder', builds: [0], box: [160, 130, 1280, 580], label: 'Sinosauropteryx photo, zooming to the fuzz' },
        { kind: 'confidence', id: 'feathers', round: 1, builds: [1], box: [300, 140, 1000, 600] },
        {
          kind: 'roomlist', id: 'feathers-convince', builds: [2], box: [200, 130, 1200, 640],
          items: ['More specimens', 'Better preservation', 'Branching', 'Many species', 'Pigment inside', "Can't be collagen"]
        },
        {
          kind: 'balance', id: 'feathers', at: 3, until: 8, box: FULL, labels: ['Feathers', 'Collagen'],
          cards: [
            { id: 'sino', at: 3, text: 'Sinosauropteryx', sub: '1996 · fuzz', back: ['expected', 'expected'] },
            { id: 'caud', at: 4, text: 'Caudipteryx', sub: '1998 · vaned feathers', back: ['expected', "collagen can't make vanes"] },
            { id: 'micro', at: 5, text: 'Microraptor', sub: '2003 · four wings', back: ['expected', 'no'] },
            { id: 'pigment', at: 6, text: 'Sinosauropteryx', sub: '2010 · pigment inside', back: ['expected', 'no pigment bodies in collagen'] },
            { id: 'yut', at: 7, text: 'Yutyrannus', sub: '2012 · big, fuzzy', back: ['expected in more groups', 'also possible'] }
          ]
        },
        { kind: 'confidence', id: 'feathers', round: 2, at: 8, box: [300, 140, 1000, 600] }
      ]
    },

    {
      id: 'debrief', title: 'How do you know?', mins: [62, 68],
      builds: [
        {},
        { prompt: 'Which case caught a mistake?' },
        { prompt: 'Which pattern came from how we looked?' },
        { prompt: 'Which needed competing explanations?' },
        { prompt: 'Where could reasonable people disagree?' },
        {},
        { prompt: 'Not "believe scientists." Check, compare, test, update.' }
      ],
      items: [
        { kind: 'placeholder', box: [160, 130, 1280, 600], label: 'concept map: case thumbnails dock at the question they worked; terms around the edges' }
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
    railFrom: 'framework',
    confidence: { low: 'unsure', high: 'sure', mean: 'mean' },
    funnel: { lived: 'Lived', found: 'found', madeUp: 'made-up rates' },
    signor: { boundary: 'K–Pg', taxa: 'taxa', chance: 'chance per level' },
    segments
  };
})(this);
