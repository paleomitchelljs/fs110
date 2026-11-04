/* Every word on screen. Edit wording here; nothing in this file touches layout.
 *
 * Sources are the papers in therizinos/papers/ (see ../readme.md for which
 * paper inspires which part). Numbers and quoted words come from them. Rows
 * marked own:true are alternatives or checks the deck adds; the papers do not
 * raise them (they carry a small + on screen). Quotes are verbatim, hedge
 * words marked ==like this==. An ellipsis … marks cut text.
 *
 * Text style: fragments, no commas where a break will do.
 *   _Name_   italic        *word*   accent colour        ==word==   marked
 *
 * LEVELS. tier: 1 = condensed (about one session), 2 = expanded, 3 = full.
 * min is the minutes the clock counts for a segment.
 *
 * A claim page is one build per row, in this order: the claim, each piece of
 * evidence, each alternative, the test, the vote, the authors' words.
 *
 *   step   distance from the bone: 0 Bone, 1 Measure, 2 Model, 3 Analogy, 4 Beyond
 *   part   which of the four parts (the badge on the page)
 *   viz    pictures on the left; from: build number, or 'ev' 'alt' 'test' 'sure'
 */
(function (root) {
  'use strict';

  const FIG = (name, cap, alt, from) => ({ kind: 'img', src: 'img/' + name + '.jpg', cap, alt, from: from || 0 });
  const C = {};

  /* =============================================================== PART 1 */
  C.theropod = {
    id: 'theropod', n: 1, short: 'Theropod?', step: 2, tier: 1,
    claim: 'Therizinosaurs are theropods (maniraptorans)',
    viz: [FIG('zanno10-fig7', 'Fig. 7 · Zanno 2010', 'Time-calibrated tree of therizinosaurs with silhouettes')],
    evidence: [
      'Half-moon wrist bone; like _Deinonychus_',
      '_Beipiaosaurus_: three toes; coelurosaur hips',
      'Tree puts them inside Maniraptora'
    ],
    alt: [
      'Four toes; leaf teeth: plant-eater look-alikes',
      'Fragmentary fossils; gaps in the skeleton',
      'Trees disagree on the closest cousins',
      { t: 'The author scored the traits', own: true }
    ],
    test: 'An early member that looks like a theropod',
    quotes: ['now ==unequivocally== regarded as a monophyletic subclade of coelurosaurian theropods', 'an ==unexpected degree of convergence== with other herbivorous dinosaur clades']
  };

  C.falcarius = {
    id: 'falcarius', n: 1, short: 'Falcarius', step: 2, tier: 1,
    claim: '_Falcarius_ is a transitional form',
    viz: [
      { kind: 'traits', from: 0,
        cols: ['_Falcarius_', '_Jianchango-_|_saurus_', '_Erliko-_|_saurus_'],
        rows: [
          { t: 'Leaf-shaped teeth', s: ['D', 'D', 'D'] },
          { t: 'Toothless upper jaw tip', s: ['?', 'D', 'D'] },
          { t: 'Toothless lower jaw tip', s: ['P', 'P', 'D'] },
          { t: 'Chin turned down', s: ['P', 'D', 'D'] },
          { t: 'Small cheek window', s: ['P', 'P', 'D'] },
          { t: 'Brow bone meets skull at back', s: ['P', 'D', 'D'] },
          { t: 'No crest on skull roof', s: ['P', 'D', 'D'] },
          { t: 'Short jaw-muscle chamber', s: ['P', 'I', 'D'] },
          { t: 'Cheek region rotated', s: ['P', 'I', 'D'] },
          { t: 'Jaw ledge lost', s: ['P', 'D', 'I'] }
        ] },
      FIG('fre25-fig1a', 'Fig. 1a · Freimuth & Zanno 2025 · each colour is a different specimen', 'Composite skull of Falcarius built from many bones, left side view', 'alt')
    ],
    evidence: [
      'Body plan: generalized theropod',
      'Teeth all along the jaw: 28 below',
      'Skull roof matches early coelurosaurs'
    ],
    alt: [
      'Skull is a composite; bones mirrored; resized',
      'Oldest known ≠ ancestor: _Eshanosaurus_',
      { t: 'Every fossil sits between its neighbours', own: true }
    ],
    test: 'Older therizinosaurs: same order of traits?',
    quotes: ['==primitive morphology== of the jugal and frontoparietal complex shared with other early diverging taxa', '==Early, integrated evolution== of the rostrum and adductor complex characterized early therizinosaurians']
  };

  C.feathers = {
    id: 'feathers', n: 1, short: 'Filaments', step: 3, tier: 1,
    claim: 'Long stiff filaments were for display',
    viz: [
      FIG('xu09-fig1', 'Fig. 1 · Xu et al. 2009', 'Beipiaosaurus slab with long broad filaments marked by arrows'),
      FIG('xu09-fig2', 'Fig. 2 · Xu et al. 2009', 'Line drawings of filaments: Beipiaosaurus thick and long, Sinosauropteryx and Dilong fine and short', 1),
      { kind: 'body', from: 3, at: { short: 3, long: 4 }, lab: { short: 'Short thin filaments', long: 'Long broad filaments' } }
    ],
    evidence: [
      'Long: 100–150 mm; half the neck',
      'Broad: 2–3 mm (others ≤ 0.2 mm)',
      'Stiff; only head, neck, tail'
    ],
    alt: [
      'Warmth: what most filaments do',
      'Defense or other jobs: untested',
      'Two specimens; tail damaged in prep',
      { t: 'Display read from living birds only', own: true }
    ],
    test: 'More specimens: same places on the body?',
    quotes: ['==difficult to infer== the primary function of the EBFFs', 'the EBFFs ==might== have been used in display']
  };

  C.biogeo = {
    id: 'biogeo', n: 1, short: 'Across Beringia', step: 4, tier: 3,
    claim: 'A pre-Turonian crossing, Asia ↔ North America',
    viz: [FIG('zanno10-fig7', 'Fig. 7 · Zanno 2010', 'Time-calibrated tree; a stippled bar marks the hypothesized interchange')],
    evidence: [
      'Tree plus dates: late forms on both continents',
      'Other dinosaurs show an Albian exchange',
      'Alaska track: farthest north'
    ],
    alt: [
      'Ghost lineages: missing fossils',
      'Ages are ranges, not dates',
      '_Eshanosaurus_ could rewrite the timing'
    ],
    test: 'Albian therizinosaurs on either side',
    quotes: ['this conclusion ==supports== previous hypotheses of a Laurasian faunal interchange event during the Albian']
  };

  /* =============================================================== PART 2 */
  C.diet = {
    id: 'diet', n: 2, short: 'Bones → diet', step: 3, tier: 1,
    claim: 'Skull traits tell us what extinct animals ate',
    viz: [{ kind: 'predict', from: 0, total: 27, hit: 21, at: 3 }],
    evidence: [
      '27 traits said to mean plant-eating',
      'Test: do they track gut contents; gizzard stones?',
      'Result: 21 of 27 do'
    ],
    alt: [
      'Direct evidence for only 22% of species',
      'None for therizinosaurs or alvarezsaurs',
      'Stones and gut contents: one meal',
      'Shared by descent; not by diet'
    ],
    test: 'A therizinosaur gut or coprolite',
    quotes: ['21 of 27 PHTs ==purported== as ecomorphological indicators of herbivory', 'hypercarnivory was ==relatively rare== and ==potentially== secondarily derived']
  };

  C.gut = {
    id: 'gut', n: 2, short: 'Big gut', step: 3, tier: 2,
    claim: 'Therizinosaurs carried a huge gut',
    viz: [FIG('zanno09-fig1', 'Fig. 1 · Zanno et al. 2009', 'Nothronychus skeleton with its elements')],
    evidence: [
      'Rib cage: wide and deep',
      'Hip bones flared outward',
      'Living plant-eaters: long guts'
    ],
    alt: [
      'Gut is inferred; never seen',
      { t: 'Deep bodies also hold fat; eggs', own: true },
      { t: 'Omnivores can carry big guts', own: true }
    ],
    test: 'Preserved gut contents or coprolite',
    quotes: ['proportionally ==enormous== gut capacity (==as estimated by== gastralia/trunk rib circumference and lateral flare of preacetabular process of ilium)']
  };

  C.herb = {
    id: 'herb', n: 2, short: 'Plants first', step: 4, tier: 2,
    claim: 'In bird cousins, meat-only came after plants',
    viz: [FIG('zanno09-fig2', 'Fig. 2 · Zanno et al. 2009', 'Coelurosaur tree with diet bars: plant-eating clades near the base')],
    evidence: [
      'Early ornithomimosaurs; therizinosaurs; oviraptorosaurs: 2+ plant traits each',
      'Base of Maniraptora: no serrated front teeth',
      'Early bird cousins: direct plant evidence'
    ],
    alt: [
      'Plant-eating evolved separately, 2–5 times',
      'Alvarezsaurs: too much missing data',
      'Clades could move on the tree',
      { t: 'Traits are not diets', own: true }
    ],
    test: 'Gut contents from early maniraptorans',
    quotes: ['indicative of, ==at minimum==, an omnivorous common ancestor']
  };

  C.beak = {
    id: 'beak', n: 2, short: 'Beaks', step: 2, tier: 2,
    claim: 'A beak helps a toothless snout take a bite',
    viz: [FIG('lau13-fig2', 'Fig. 2 · Lautenschlager et al. 2013', 'Skull stress under four snout designs: bare, small beak, large beak, with teeth')],
    evidence: [
      'CT-based model of an _Erlikosaurus_ skull',
      'Add a keratin beak: less stress at the snout',
      'Add teeth: more stress than toothless'
    ],
    alt: [
      'Beak thickness; stiffness: assumed',
      'One skull; one set of bite forces',
      'Lighter skull may matter too'
    ],
    test: 'Other beaked skulls; measured keratin',
    quotes: ['the presence of a keratinous rhamphotheca ==would have helped== to dissipate stress and strain']
  };

  C.twoways = {
    id: 'twoways', n: 2, short: 'Two designs', step: 2, tier: 1,
    claim: 'Plant-eaters evolved two skull designs',
    viz: [FIG('but20-fig2', 'Fig. 2 · Button & Zanno 2020', 'Plots of skull shape: carnivores, plant-eating theropods, sauropodomorphs, ornithischians')],
    evidence: [
      '34 skull measures per species',
      'Gut-processors: long light skull; weak bite',
      'Mouth-processors: strong bite; packed teeth'
    ],
    alt: [
      'Skull → gut design is inferred',
      'Related species share skulls by descent',
      'Some plant-eaters fit neither (oviraptorids)',
      '24% of the skull data are missing'
    ],
    test: 'Gut contents; tooth wear in more species',
    quotes: ['two fundamentally different modes are ==observed== to evolve independently multiple times']
  };

  /* =============================================================== PART 3 */
  C.fea = {
    id: 'fea', n: 3, short: 'Hook or dig?', step: 2, tier: 1,
    claim: 'Most therizinosaur claws could hook, not dig',
    viz: [FIG('lau14-fig3', 'Fig. 3 · Lautenschlager 2014', 'Stress on five claws under digging, hooking, piercing')],
    evidence: [
      'Five claws; three loadings each',
      'Digging: high stress in four of five',
      'Hooking; piercing: low stress'
    ],
    alt: [
      'Same load on every claw',
      'Sheath modeled as a thin uniform coat',
      'Stress ≠ use: a claw can break and still be used',
      'Therizinosaurus modeled from a cast'
    ],
    test: 'Sheath that extends past the bone; wear marks',
    quotes: ['no clear correlation between ungual morphology and a concrete function is readily apparent', '==likely== for therizinosaurs possessing elongate and curved unguals']
  };

  C.display = {
    id: 'display', n: 3, short: 'Display?', step: 4, tier: 1,
    claim: '_Therizinosaurus_ claws were for display',
    viz: [FIG('qin23-fig2', 'Fig. 2 · Qin et al. 2023', 'Stress on claws of alvarezsaurs and therizinosaurs under three loadings')],
    evidence: [
      'Three stress tests: dig; hook; pierce',
      'Its claw: highest stress of all',
      'Size-scaled model: real stress even higher'
    ],
    alt: [
      { t: 'Failing three tests ≠ evidence for a fourth', own: true },
      { t: 'Other jobs not tried', own: true },
      'Display: ostrich wings; giant antlers; by analogy',
      'Bone only; assumed loads; tissue values'
    ],
    test: 'What would make display *positive*?',
    quotes: ['FSA ==failed to support== any previous functional assumptions requiring considerable stress-bearing', '==might== have been used mostly for threatening enemies or exhibition when mating']
  };

  C.alvarez = {
    id: 'alvarez', n: 3, short: 'A test that says yes', step: 2, tier: 2,
    claim: 'Alvarezsaur claws really could dig',
    viz: [FIG('qin23-fig3', 'Fig. 3 · Qin et al. 2023', 'Functional space of claws: mammals, other theropods, alvarezsaurs, therizinosaurs')],
    evidence: [
      'Short stout claws: low stress in all three',
      'Late alvarezsaurs: best digging scores',
      'Robust arm bones; fused wrist'
    ],
    alt: [
      'Arms shrank faster than bodies: vestigial?',
      'Digging mammals: look-alikes, not proof',
      'Digging also needs piercing and pulling'
    ],
    test: 'Wear marks; burrow traces',
    quotes: ['efficient digging capabilities only emerged in late-branching alvarezsauroid forelimbs, ==rejecting== the hypothesis of functional vestigial structures like _T. rex_']
  };

  C.duonychus = {
    id: 'duonychus', n: 3, short: 'Two fingers', step: 3, tier: 1,
    claim: '_Duonychus_ grabbed branches with two fingers',
    viz: [
      FIG('kob25-life', 'Life restoration · Hattori, in Kobayashi et al. 2025', 'Restoration of Duonychus reaching into foliage'),
      { kind: 'lever', from: 2, lab: { bone: 'bone', sheath: 'sheath', ref: 'bone only', note: 'same tip force; same bone' } }
    ],
    evidence: [
      'Hand: two fingers; third missing',
      'Keratin sheath kept: 40%+ longer than bone',
      'Sheath curved ~120°; joint bends ~90°'
    ],
    alt: [
      'One specimen; one hand',
      'Sheath is a remnant; burial may have shaped it',
      'Function read from living claw classes',
      'Claws serve many jobs: defense; courtship; play'
    ],
    test: 'More sheaths; redo the stress models with one',
    quotes: ['could have grasped branches or swaths of vegetation up to ==approximately== 10 cm in diameter', 'could also have been utilized for other purposes, such as ==territoriality, defense, courtship, play==']
  };

  /* =============================================================== PART 4 */
  C.bonebed = {
    id: 'bonebed', n: 4, short: 'Bonebed', step: 4, tier: 1,
    claim: '_Falcarius_ lived in groups',
    viz: [{ kind: 'bones', from: 0, total: '4,500+', l1: 'bones from one quarry', l2: 'first called _Falcarius_ in the field', at: 1 }],
    evidence: [
      'Largest maniraptoran bonebed known',
      'Hundreds of animals; many ages',
      'Bones laid down at about one time'
    ],
    alt: [
      'How the bones piled up: unknown',
      { t: 'A trap or flood can gather loners', own: true },
      'One mass death; or a few: not "a group for life"'
    ],
    test: 'Other bonebeds; dated layers inside this one',
    quotes: ['taphonomic evidence ==suggests== the near-monospecific assemblage reflects a social aggregation and a population-level mass mortality event (or few events)']
  };

  C.embryos = {
    id: 'embryos', n: 4, short: 'Embryos', step: 4, tier: 2,
    claim: 'Hatchlings left the nest and fed themselves',
    viz: [FIG('kun08-fig7', 'Fig. 7 · Kundrát et al. 2008', 'Four embryo stages beside alligator embryos at 45, 50, 64 days')],
    evidence: [
      'Bones hard before hatching: ribs; vertebrae fused',
      'Latest embryo: more ossified than hatchling alligator',
      'Teeth fit an omnivore'
    ],
    alt: [
      'No hatchling known',
      'Crocodile and bird models differ widely',
      'No parents or young found at nests'
    ],
    test: 'Hatchlings; nests with young; juveniles in bonebeds',
    quotes: ['we ==assume== that the most advanced therizinosauroid embryo … may be used to approximate the phenotypic and behavioural characteristics of therizinosauroid hatchlings', '==This might lead to speculation== that therizinosauroid hatchlings were independent of their parents']
  };

  C.nest = {
    id: 'nest', n: 4, short: 'Colony?', step: 3, tier: 1,
    claim: 'Dinosaurs nested together at Javkhlant',
    viz: [{
      kind: 'density', from: 0, axis: 'clutches per 100 m²',
      rows: [
        { name: 'Javkhlant · Mongolia', v: 15 / 136 * 100, mine: true },
        { name: 'Pavna · India', lo: 10 / 60 * 100, open: '>' },
        { name: 'Auca Mahuevo A · Argentina', v: 74 / 1701 * 100 },
        { name: 'Auca Mahuevo B · Argentina', hi: 31 / 486 * 100, open: '<' },
        { name: 'Rahioli · India', v: 11 / 1200 * 100 },
        { name: 'Aren · Spain', lo: 24 / 8000 * 100, hi: 24 / 6000 * 100 },
        { name: 'Pat Baba Mandir · India', v: 9 / 5000 * 100 },
        { name: 'Los Llanos · Argentina', lo: 70 / 300000 * 100, open: '>' }
      ]
    }],
    evidence: [
      '15 clutches in one layer; 136 m²',
      'One egg type throughout: likely one species',
      'Nests in organic soil: mounds heated by rot'
    ],
    alt: [
      'One layer can span many years',
      'Egg type fits two parents: megalosaurs or therizinosaurs',
      'Counted only clusters of 3+ eggs',
      { t: 'Sites measured their areas differently', own: true }
    ],
    test: 'Dating inside the layer; embryos in these eggs',
    quotes: ['all clutches were ==likely== laid by the same dinosaur species', 'suggesting that the Javkhlant eggs were incubated with heat from microbial decay in organic-rich mound nests']
  };

  C.tracks = {
    id: 'tracks', n: 4, short: 'Tracks', step: 3, tier: 3,
    claim: 'A therizinosaur walked with a hadrosaur herd',
    viz: [FIG('fio18-fig2', 'Fig. 2 · Fiorillo et al. 2018', 'Tracks on one block: hadrosaur tracks blue, therizinosaur tracks yellow')],
    evidence: [
      'Four-toed tracks on the same surface',
      'At least three make one trackway: one animal',
      'Hadrosaur tracks: at least three animals; all ages'
    ],
    alt: [
      'Same surface; different days',
      'Walked the same route; not together',
      'One therizinosaur trackway: no group'
    ],
    test: 'More blocks; layers inside the surface',
    quotes: ['a herd of hadrosaurids and the therizinosaurids walked across this landscape at ==different times==', 'this co-occurrence was ==biologically linked==']
  };

  /* ------------------------------------------------------------- segments */
  const claimBuilds = (c) => {
    const b = [{ rail: 'claim' }];
    c.evidence.forEach(() => b.push({ rail: 'evidence' }));
    c.alt.forEach(() => b.push({ rail: 'else' }));
    b.push({ rail: 'test' });
    b.push({ rail: 'sure', prompt: 'How sure?' });
    if (c.quotes && c.quotes.length) b.push({ rail: 'sure', prompt: 'How sure?' });
    return b;
  };
  const claimSeg = (c, min) => ({
    id: c.id, title: c.short, min, tier: c.tier,
    builds: claimBuilds(c),
    items: [{ kind: 'claim', box: [0, 0, 1600, 900], claim: c }]
  });
  const none = (n, first) => Array.from({ length: n }, (_, i) => (i === 0 && first ? { prompt: first } : {}));
  const partTitle = (id, n, text, tier) => ({ id, title: text, min: 0.4, tier: tier || 1, builds: [{}], items: [{ kind: 'title', box: [100, 200, 1400, 500], n, text }] });
  const figSeg = (id, title, tier, min, fig, prompts) => ({
    id, title, min, tier,
    builds: [{ prompt: prompts[0] }].concat(prompts.slice(1).map((p) => ({ prompt: p }))),
    items: [Object.assign({ kind: 'fig', box: [0, 100, 1600, 690] }, fig)]
  });

  const LABELS = { theropod: 'Theropod', falcarius: 'Transitional', feathers: 'Filaments', biogeo: 'Beringia',
    diet: 'Bones → diet', gut: 'Huge gut', herb: 'Plants first', beak: 'Beak helps', twoways: 'Two designs',
    fea: 'Hook not dig', display: 'Display claws', alvarez: 'Alvarezsaurs dig', duonychus: 'Grasping',
    bonebed: 'Group living', embryos: 'Hatchlings alone', nest: 'Nested together', tracks: 'With a herd' };
  const WORDS = { theropod: 'unequivocally', falcarius: 'primitive morphology', feathers: 'might', biogeo: 'supports', diet: 'purported',
    gut: 'as estimated by', herb: 'at minimum', beak: 'would have helped', twoways: 'observed', fea: 'no clear correlation',
    display: 'might have been used', alvarez: 'rejecting', duonychus: 'could have', bonebed: 'suggests', embryos: 'we assume',
    nest: 'likely', tracks: 'different times', };
  const rankIds = ['theropod', 'falcarius', 'feathers', 'biogeo', 'diet', 'gut', 'herb', 'beak', 'twoways', 'fea', 'display', 'alvarez', 'duonychus', 'bonebed', 'embryos', 'nest', 'tracks'];

  const segments = [
    {
      id: 'title', title: 'Therizinosaurs', min: 1, tier: 1,
      builds: [{}, { prompt: 'Which words need evidence?' }],
      items: [{
        kind: 'cover', box: [0, 0, 1600, 790], pic: 'img/kob25-life.jpg', title: 'Therizinosaurs',
        cite: 'Papers from 1999 to 2025',
        claim: 'A plant-eating theropod with claws over 50 cm', claimAt: 1
      }]
    },
    {
      id: 'framework', title: 'How do you know?', min: 1, tier: 2,
      builds: [{}, { prompt: 'What exactly is the claim?' }, { prompt: 'What do we see?' }, { prompt: 'What else could do that?' }, { prompt: 'What would tell them apart?' }, { prompt: 'How sure should we be?' }],
      items: [
        { kind: 'title', builds: [0], box: [100, 250, 1400, 400], text: 'HOW DO YOU KNOW?' },
        { kind: 'icons', at: 1, from: 1, box: [100, 220, 1400, 380] }
      ]
    },

    /* ---------------- part 1 ---------------- */
    partTitle('p1', 1, 'What kind of dinosaur?'),
    {
      id: 'guess', title: 'Who put it where?', min: 3, tier: 2,
      builds: [{ prompt: 'Who put it where?' }, {}, {}, {}, {}, {}, {}, {}, {}],
      items: [{
        kind: 'guess', box: [0, 100, 1600, 690], y0: 1950, y1: 2012,
        rows: [{ label: 'Turtle' }, { label: 'Ornithischia' }, { label: 'Sauropodomorpha' }, { label: 'Its own order' }, { label: 'Theropoda', hot: true }],
        events: [
          { year: 1954, label: 'Maleev: giant turtle', row: 0 },
          { year: 1976, label: 'Barsbold: theropod (from the claws)', row: 4 },
          { year: 1984, label: 'Paul: cousin of ornithischians', row: 1 },
          { year: 1986, label: 'Gauthier: near sauropodomorphs', row: 2 },
          { year: 1989, label: 'Sereno: sister of prosauropods', row: 2 },
          { year: 1992, label: 'Dong: its own order', row: 3 },
          { year: 1993, label: 'Russell & Dong: theropod again', row: 4 },
          { year: 2010, label: 'Zanno: early maniraptoran', row: 4 }
        ],
        marks: [{ year: 1993, label: 'Alxasaurus' }, { year: 1999, label: 'Beipiaosaurus' }, { year: 2001, label: 'Nothronychus' }, { year: 2005, label: 'Falcarius' }]
      }]
    },
    {
      id: 'sort', title: 'Where would you put it?', min: 3.5, tier: 1,
      builds: [{ prompt: 'Where would you put it?' }].concat(none(10)).concat([{ prompt: 'Solid or dashed?' }]),
      items: [{
        kind: 'sort', id: 'sort1', box: [0, 100, 1600, 690], finalAt: 11,
        bins: [{ id: 'orn', label: 'Ornithischia' }, { id: 'sau', label: 'Sauropodomorpha' }, { id: 'the', label: 'Theropoda' }],
        cards: [
          { id: 'k1', at: 1, look: true, text: 'Four toes on the foot', to: 'sau', basis: 'sauropod-like' },
          { id: 'k2', at: 2, text: 'Half-moon wrist bone', to: 'the', basis: 'raptor trait' },
          { id: 'k3', at: 3, look: true, text: 'Tiny head; leaf teeth', to: 'sau', basis: 'sauropod-like' },
          { id: 'k4', at: 4, text: 'Three clawed fingers', to: 'the', basis: 'theropod trait' },
          { id: 'k5', at: 5, look: true, text: 'Ledge on the lower jaw', to: 'orn', basis: 'ornithischian-like' },
          { id: 'k6', at: 6, text: 'Shin ridge (fibular crest)', to: 'the', basis: 'theropod trait' },
          { id: 'k7', at: 7, look: true, text: 'Toothless beak', to: 'orn', basis: 'ornithischian-like' },
          { id: 'k8', at: 8, text: 'Raptor-like hip bone', to: 'the', basis: 'raptor trait' },
          { id: 'k9', at: 9, look: true, text: 'Broad hips; big belly', to: 'sau', basis: 'sauropod-like' },
          { id: 'k10', at: 10, text: 'Wishbone (furcula)', to: 'the', basis: 'theropod trait' }
        ]
      }]
    },
    claimSeg(C.theropod, 2.5),
    claimSeg(C.falcarius, 3.5),
    {
      id: 'beipiao', title: 'Beipiaosaurus', min: 2.5, tier: 2,
      builds: [{}, {}, {}],
      items: [{
        kind: 'fact', box: [0, 100, 1600, 690], src: 'img/xu99-fig1.jpg', cap: 'Holotype · Fig. 1 · Xu et al. 1999', alt: 'Beipiaosaurus slab and line drawing',
        nums: [{ n: '2.2 m', l: 'estimated length', at: 0 }, { n: '37+', l: 'teeth in the lower jaw', at: 1 }, { n: '1999', l: 'first feathered therizinosaur', at: 2 }]
      }]
    },
    claimSeg(C.feathers, 3.5),
    claimSeg(C.biogeo, 4),

    /* ---------------- part 2 ---------------- */
    partTitle('p2', 2, 'What did it eat?'),
    claimSeg(C.diet, 3.5),
    figSeg('skulls', 'Six skulls', 2, 3, { src: 'img/zm11-fig1.jpg', w: 584, h: 1152, cap: 'Fig. 1 · Zanno & Makovicky 2011',
      pitch: 78, zones: [
        { label: 'Hoatzin: a living leaf-eater', rect: [0, 0, 1, 0.21] },
        { label: '_Ornithomimus_', rect: [0, 0.215, 1, 0.2] },
        { label: '_Shenzhousaurus_', rect: [0, 0.425, 1, 0.21] },
        { label: '_Incisivosaurus_', rect: [0, 0.64, 1, 0.2] },
        { label: '_Caenagnathus_ jaws', rect: [0, 0.845, 1, 0.155] }
      ] }, ['What do these share?', '', '', '', '', '']),
    figSeg('gutfig', 'Where does a gut go?', 1, 3, { src: 'img/zanno09-fig1.jpg', w: 1388, h: 1262, cap: 'Fig. 1 · Zanno et al. 2009',
      pitch: 78, zones: [
        { label: 'Ribs and belly', rect: [0.3, 0.27, 0.4, 0.36] },
        { label: 'Flared hip bones', rect: [0.62, 0, 0.38, 0.47] }
      ] }, ['Where would a gut go?', 'Ribs and belly', 'Flared hip bones']),
    claimSeg(C.gut, 2.5),
    claimSeg(C.herb, 4),
    figSeg('beakfig', 'Teeth, beak, or neither', 2, 2.5, { src: 'img/lau13-fig2.jpg', w: 714, h: 793, cap: 'Fig. 2 · Lautenschlager et al. 2013',
      pitch: 78, zones: [
        { label: 'No teeth; no beak', rect: [0.04, 0, 0.215, 1] },
        { label: 'Small beak', rect: [0.275, 0, 0.215, 1] },
        { label: 'Large beak', rect: [0.51, 0, 0.215, 1] },
        { label: 'Teeth in the snout', rect: [0.745, 0, 0.215, 1] }
      ] }, ['Where is the red?', '', '', '', '']),
    claimSeg(C.beak, 2.5),
    figSeg('twofig', 'Two ways to eat plants', 1, 2.5, { src: 'img/but20-fig2.jpg', w: 971, h: 1196, cap: 'Fig. 2 · Button & Zanno 2020',
      pitch: 70, zones: [
        { label: 'Meat-eaters', rect: [0.09, 0.01, 0.46, 0.28], dot: '#c0392b' },
        { label: 'Plant-eating theropods', rect: [0.56, 0.01, 0.43, 0.28] },
        { label: 'Sauropodomorphs', rect: [0.09, 0.33, 0.46, 0.3] },
        { label: 'Ornithischians', rect: [0.56, 0.33, 0.43, 0.3] },
        { label: 'Gut-processors', rect: [0.09, 0.67, 0.46, 0.3] },
        { label: 'Mouth-processors', rect: [0.56, 0.67, 0.43, 0.3] }
      ] }, ['Where do the plant-eaters land?', '', '', '', '', '', '']),
    claimSeg(C.twoways, 2),

    /* ---------------- part 3 ---------------- */
    partTitle('p3', 3, 'What were the claws for?'),
    {
      id: 'clawsize', title: 'Claws', min: 1, tier: 1,
      builds: [{}, {}],
      items: [{
        kind: 'fact', box: [0, 100, 1600, 690], src: 'img/lau14-fig1.jpg', cap: 'Fig. 1 · Lautenschlager 2014', alt: 'Manual claw outlines above silhouettes of twelve therizinosaurs',
        nums: [{ n: '50 cm+', l: '_Therizinosaurus_ claw', at: 0 }]
      }]
    },
    figSeg('feafig', 'Three loadings', 1, 2.5, { src: 'img/lau14-fig3.jpg', w: 1174, h: 1356, cap: 'Fig. 3 · Lautenschlager 2014',
      pitch: 76, zones: [
        { label: 'Digging', rect: [0.18, 0, 0.27, 1] },
        { label: 'Hooking', rect: [0.44, 0, 0.27, 1] },
        { label: 'Piercing', rect: [0.7, 0, 0.27, 1] },
        { label: '_Alxasaurus_: short claw', rect: [0, 0.465, 1, 0.17] }
      ] }, ['Which job breaks the claw?', '', '', '', '']),
    claimSeg(C.fea, 2.5),
    figSeg('dispfig', 'Stress on the giant claw', 1, 1.5, { src: 'img/qin23-fig2.jpg', w: 1438, h: 1575, cap: 'Fig. 2 · Qin et al. 2023',
      pitch: 76, zones: [
        { label: 'Therizinosaurs', rect: [0, 0.66, 1, 0.34] },
        { label: '_Therizinosaurus_', rect: [0, 0.665, 1, 0.06] },
        { label: 'Alvarezsaurs that dig', rect: [0, 0.5, 1, 0.11] }
      ] }, ['Which one is red?', '', '', '']),
    claimSeg(C.display, 3),
    claimSeg(C.alvarez, 3),
    {
      id: 'fnsort', title: 'What was it for?', min: 4, tier: 2,
      builds: [{ prompt: 'What was it for?' }].concat(none(7)).concat([{ prompt: 'Solid or dashed?' }]),
      items: [{
        kind: 'sort', id: 'sort2', box: [0, 100, 1600, 690], finalAt: 8,
        bins: [{ id: 'feed', label: 'Feeding' }, { id: 'warm', label: 'Warmth' }, { id: 'fight', label: 'Fighting' }, { id: 'show', label: 'Showing off' }],
        cards: [
          { id: 'f1', at: 1, text: 'Short thin filaments, body-wide', to: 'warm', basis: 'analogy' },
          { id: 'f2', at: 2, text: 'Long stiff filaments: head; neck; tail', to: 'show', basis: 'analogy' },
          { id: 'f3', at: 3, text: 'Claw: low stress when hooking', to: 'feed', basis: 'stress test' },
          { id: 'f4', at: 4, text: 'Claw sheath curved ~120°', to: 'feed', basis: 'analogy' },
          { id: 'f5', at: 5, text: 'Giant claw fails all three tests', to: 'show', basis: 'by elimination' },
          { id: 'f6', at: 6, text: 'Claw: low stress when piercing', basis: 'stress test' },
          { id: 'f7', at: 7, text: 'Territory; courtship; play', basis: 'untested' }
        ]
      }]
    },
    figSeg('duofig', 'The claw and its sheath', 1, 1.5, { src: 'img/kob25-fig4.jpg', w: 1365, h: 1239, cap: 'Fig. 4 · Kobayashi et al. 2025',
      pitch: 76, zones: [
        { label: 'Reach and bend', rect: [0, 0, 1, 0.4] },
        { label: 'Claw with its sheath', rect: [0, 0.4, 0.66, 0.6] },
        { label: 'Sheath surface', rect: [0.66, 0.4, 0.34, 0.6] }
      ] }, ['What is that brown shell?', '', '', '']),
    claimSeg(C.duonychus, 4),
    {
      id: 'didactyl', title: 'Fingers lost', min: 3, tier: 3,
      builds: [{}, {}],
      items: [{
        kind: 'fact', box: [0, 100, 1600, 690], src: 'img/kob25-fig7.jpg', cap: 'Fig. 7 · Kobayashi et al. 2025', alt: 'Tree of Avetheropoda with forelimb shortening and digit loss',
        nums: [{ n: '5', l: 'clades lost a working third finger', at: 0 }]
      }]
    },

    /* ---------------- part 4 ---------------- */
    partTitle('p4', 4, 'Did they live in groups?'),
    claimSeg(C.bonebed, 3),
    figSeg('embfig', 'Embryos', 2, 3, { src: 'img/kun08-fig7.jpg', w: 1322, h: 1499, cap: 'Fig. 7 · Kundrát et al. 2008',
      pitch: 78, zones: [
        { label: 'Stage A', rect: [0, 0, 1, 0.245] },
        { label: 'Stage B', rect: [0, 0.255, 1, 0.245] },
        { label: 'Stage C', rect: [0, 0.5, 1, 0.245] },
        { label: 'Stage D', rect: [0, 0.755, 1, 0.245] }
      ] }, ['How far along?', '', '', '', '']),
    claimSeg(C.embryos, 3),
    claimSeg(C.nest, 3.5),
    claimSeg(C.tracks, 4),

    {
      id: 'rank', title: 'Sort the claims', min: 2, tier: 1,
      builds: [{ prompt: 'Sort by how sure', rail: 'sure' }, { prompt: 'How far from the bone?' }, { prompt: 'Authors’ words' }],
      items: [{
        kind: 'rank', box: [0, 100, 1600, 690],
        chips: rankIds.map((id) => ({ id, n: C[id].n, label: LABELS[id], step: C[id].step, tier: C[id].tier, word: WORDS[id] }))
      }]
    }
  ];

  root.THERIZ = {
    rail: [
      { key: 'claim', label: 'Claim' },
      { key: 'evidence', label: 'Evidence' },
      { key: 'else', label: 'Else?' },
      { key: 'test', label: 'Test' },
      { key: 'sure', label: 'Sure?' }
    ],
    railTitle: 'How do you know?',
    segments
  };
})(this);
