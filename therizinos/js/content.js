/* Every word on screen. Edit wording here; nothing in this file touches layout.
 *
 * The deck is for talking over: pictures first, a few words at most. The five
 * question icons (claim, evidence, else, test, sure) light at the top left as
 * the talk moves through a scene; they are the only framing on screen.
 *
 * Sources are the papers in therizinos/papers/ (see ../readme.md). Numbers come
 * from them. Pills marked own are the deck's, not the paper's.
 *
 * LEVELS. tier: 1 = condensed (about one session), 2 = expanded, 3 = full.
 * min is the minutes the clock counts for a segment.
 *
 * Text style:  _Name_ italic   *word* accent
 */
(function (root) {
  'use strict';

  const SURE = { box: [330, 744, 940, 104] };
  const SURE_LOW = { box: [330, 792, 940, 100] };
  const sureItem = (id, at) => Object.assign({ kind: 'sure', id, at }, SURE);

  /* A figure scene: one build per pill; a last build for the room's call if sure is set. */
  const figSeg = (id, title, tier, min, fig, sure) => {
    const zones = fig.zones;
    const builds = [{}].concat(zones.map((z) => (z.role ? { rail: z.role } : {})));
    const main = Object.assign({ kind: 'fig', box: [0, 100, 1600, 690], imgBox: sure ? [40, 4, 1010, 634] : [40, 8, 1010, 672] }, fig);
    const items = [main];
    if (sure) { builds.push({ rail: 'sure' }); items.push(sureItem(sure, zones.length + 1)); }
    return { id, title, min, tier, builds, items };
  };

  /* A drawn picture at full size, optionally with the room's call. */
  const soloSeg = (id, title, tier, min, viz, nBuilds, sure, k) => {
    const builds = Array.from({ length: nBuilds }, () => ({}));
    const items = [{ kind: 'solo', id, box: [0, 100, 1600, 690], viz, k: k || 1.4 }];
    if (sure) { builds.push({ rail: 'sure' }); items.push(sureItem(sure, nBuilds)); }
    return { id, title, min, tier, builds, items };
  };

  const partTitle = (id, n, text) => ({ id, title: text, min: 0.3, tier: 1, builds: [{}], items: [{ kind: 'title', box: [100, 200, 1400, 500], n, text }] });

  /* ------------------------------------------------------------ the sorts */
  const sortSeg = (id, title, tier, min, bins, cards) => ({
    id, title, min, tier,
    builds: [{}].concat(cards.map(() => ({}))).concat([{}]),
    items: [{ kind: 'sort', id, box: [0, 100, 1600, 690], finalAt: cards.length + 1, bins, cards: cards.map((c, i) => Object.assign({ at: i + 1 }, c)) }]
  });

  const FIG = (src, w, h, cap, alt) => ({ src: 'img/' + src, w, h, cap, alt: alt || '' });
  const I = (src, cap) => ({ src: 'img/' + src, cap });

  const segments = [
    /* ---------------------------------------------------------- cover */
    {
      id: 'title', title: 'Therizinosaurs', min: 1, tier: 1, builds: [{}],
      items: [{ kind: 'cover', box: [0, 0, 1600, 790], pic: 'img/lau14-sil.jpg', title: 'Therizinosaurs' }]
    },

    /* ---------------------------------------------------------- part 1 */
    partTitle('p1', 1, 'What is it?'),

    figSeg('meet', 'Nothronychus', 1, 2.5, Object.assign(FIG('zanno09-fig1.jpg', 1388, 1262, 'Nothronychus · Zanno et al. 2009'), {
      zones: [
        { label: 'Tiny head', rect: [0.07, 0.19, 0.1, 0.1] },
        { label: 'Long neck', rect: [0.08, 0.22, 0.2, 0.25] },
        { label: 'Big belly', rect: [0.19, 0.33, 0.3, 0.28] },
        { label: 'Huge claws', rect: [0.2, 0.55, 0.15, 0.14] },
        { label: 'Four toes', rect: [0.38, 0.78, 0.18, 0.12] }
      ]
    })),

    {
      id: 'guess', title: 'Who put it where?', min: 3, tier: 1,
      builds: Array.from({ length: 15 }, () => ({})),
      items: [{
        kind: 'guess', box: [0, 100, 1600, 690], y0: 1950, y1: 2012,
        rows: [{ label: 'Found', chrono: true }, { label: 'Turtle' }, { label: 'Ornithischia' }, { label: 'Sauropodomorpha' }, { label: 'Own order' }, { label: 'Theropoda', hot: true }],
        events: [
          { year: 1954, label: 'Therizinosaurus', row: 0 },
          { year: 1954, label: 'Maleev: turtle', row: 1 },
          { year: 1976, label: 'Barsbold: theropod', row: 5 },
          { year: 1979, label: 'Segnosaurus', row: 0 },
          { year: 1984, label: 'Paul: ornithischian', row: 2 },
          { year: 1986, label: 'Gauthier: sauropodomorph', row: 3 },
          { year: 1989, label: 'Sereno: prosauropod', row: 3 },
          { year: 1992, label: 'Dong: own order', row: 4 },
          { year: 1993, label: 'Alxasaurus', row: 0 },
          { year: 1993, label: 'Russell & Dong: theropod', row: 5 },
          { year: 1999, label: 'Beipiaosaurus', row: 0 },
          { year: 2001, label: 'Nothronychus', row: 0 },
          { year: 2005, label: 'Falcarius', row: 0 },
          { year: 2010, label: 'Zanno: maniraptoran', row: 5 }
        ].sort((a, b) => a.year - b.year)
      }]
    },

    sortSeg('sort1', 'Sort the clues', 1, 3,
      [{ id: 'orn', label: 'Ornithischia' }, { id: 'sau', label: 'Sauropodomorpha' }, { id: 'the', label: 'Theropoda' }],
      [
        { id: 'k1', look: true, text: 'Four toes', to: 'sau', basis: 'sauropod-like' },
        { id: 'k2', text: 'Half-moon wrist bone', to: 'the', basis: 'raptor' },
        { id: 'k3', look: true, text: 'Tiny head; leaf teeth', to: 'sau', basis: 'sauropod-like' },
        { id: 'k4', text: 'Three clawed fingers', to: 'the', basis: 'theropod' },
        { id: 'k5', look: true, text: 'Ledge on the lower jaw', to: 'orn', basis: 'ornithischian-like' },
        { id: 'k6', text: 'Shin ridge', to: 'the', basis: 'theropod' },
        { id: 'k7', look: true, text: 'Toothless beak', to: 'orn', basis: 'ornithischian-like' },
        { id: 'k8', text: 'Raptor-like hip', to: 'the', basis: 'raptor' },
        { id: 'k9', look: true, text: 'Broad hips; big belly', to: 'sau', basis: 'sauropod-like' },
        { id: 'k10', text: 'Wishbone', to: 'the', basis: 'theropod' }
      ]),

    figSeg('tree', 'The tree', 2, 3, Object.assign(FIG('zanno10-fig6.jpg', 1500, 1300, 'Zanno 2010'), {
      zones: [
        { label: 'Where on the tree?', role: 'claim' },
        { label: 'Inside Maniraptora', role: 'evidence', rect: [0.6, 0.255, 0.4, 0.225] },
        { label: 'Oviraptor cousins?', role: 'else', rect: [0.4, 0.37, 0.3, 0.2] },
        { label: 'Remove Falcarius: it moves', role: 'test' }
      ]
    })),

    {
      id: 'falcarius', title: 'Falcarius', min: 4, tier: 1,
      builds: [{}, {}, {}, {}, {}, { rail: 'sure' }],
      items: [
        {
          kind: 'traitgrid', box: [0, 100, 1600, 690],
          cols: [{ name: 'Early|theropod', at: 0 }, { name: 'Falcarius', at: 0 }, { name: 'Jianchango-|saurus', at: 1 }, { name: 'Erliko-|saurus', at: 2 }],
          rows: [
            { t: 'Leaf-shaped teeth', s: ['P', 'D', 'D', 'D'], img: I('feat-teeth.png', 'Falcarius, lower jaw teeth · Freimuth & Zanno 2025') },
            { t: 'Toothless upper tip', s: ['P', '?', 'D', 'D'] },
            { t: 'Toothless lower tip', s: ['P', 'P', 'P', 'D'], img: I('feat-jaw.png', 'Falcarius, jaw with teeth to the tip · Freimuth & Zanno 2025') },
            { t: 'Chin turned down', s: ['P', 'P', 'D', 'D'], img: I('feat-jaw.png', 'Falcarius, jaw · Freimuth & Zanno 2025') },
            { t: 'Small cheek window', s: ['P', 'P', 'P', 'D'] },
            { t: 'Brow joins skull rear', s: ['P', 'P', 'D', 'D'] },
            { t: 'No skull-roof crest', s: ['P', 'P', 'D', 'D'] },
            { t: 'Short jaw-muscle space', s: ['P', 'P', 'I', 'D'] },
            { t: 'Cheek region rotated', s: ['P', 'P', 'I', 'D'] },
            { t: 'Jaw ledge lost', s: ['P', 'P', 'D', 'I'] }
          ],
          introImg: I('xu99-fig2.jpg', 'Beipiaosaurus · Xu et al. 1999'),
          imgAt: { 3: 0, 4: 2 }
        },
        sureItem('falcarius', 5)
      ]
    },

    figSeg('fskull', 'Falcarius skull', 2, 2.5, Object.assign(FIG('fre25-fig1a.jpg', 1083, 423, 'Falcarius · Freimuth & Zanno 2025'), {
      zones: [{ label: 'Many specimens', role: 'evidence' }, { label: 'Mirrored; resized', role: 'else' }]
    })),

    figSeg('fsteps', 'Three skulls', 2, 3, Object.assign(FIG('fre25-fig25.jpg', 1455, 662, 'Freimuth & Zanno 2025'), {
      zones: [
        { label: 'Falcarius', rect: [0, 0, 0.36, 1] },
        { label: 'Jianchangosaurus', rect: [0.34, 0, 0.32, 1] },
        { label: 'Erlikosaurus', rect: [0.64, 0, 0.36, 1] }
      ]
    })),

    figSeg('beipiao', 'Beipiaosaurus', 2, 2.5, Object.assign(FIG('xu99-fig1.jpg', 1107, 1424, 'Beipiaosaurus · Xu et al. 1999'), {
      zones: [{ label: '2.2 m' }, { label: '37+ teeth' }, { label: 'Filaments', role: 'evidence' }]
    })),

    figSeg('fil1', 'Filaments', 1, 2.5, Object.assign(FIG('xu09-fig1.jpg', 816, 717, 'Beipiaosaurus · Xu et al. 2009'), {
      zones: [
        { label: 'Skull and neck', role: 'evidence', rect: [0, 0, 1, 0.41] },
        { label: 'Close-up', role: 'evidence', rect: [0, 0.42, 0.5, 0.58] },
        { label: 'Tail', role: 'evidence', rect: [0.5, 0.42, 0.5, 0.58] }
      ]
    })),

    soloSeg('body', 'Where?', 1, 2.5, { kind: 'body', at: { short: 1, long: 2 }, lab: { short: 'Short, thin', long: 'Long, broad' } }, 3, 'filaments', 1.4),

    figSeg('fil2', 'Filaments, compared', 2, 2.5, Object.assign(FIG('xu09-fig2.jpg', 1122, 402, 'Xu et al. 2009'), {
      zones: [
        { label: 'Neck: long, broad', role: 'evidence', rect: [0.2, 0.25, 0.36, 0.75] },
        { label: 'Tail: long, broad', role: 'evidence', rect: [0.55, 0, 0.36, 0.78] },
        { label: 'Others: short, thin', role: 'else', rect: [0.2, 0, 0.26, 0.28] }
      ]
    })),

    figSeg('biogeo', 'Across Beringia', 3, 3, Object.assign(FIG('zanno10-fig7.jpg', 1354, 1003, 'Zanno 2010'), {
      zones: [
        { label: 'Asia and North America', role: 'claim', rect: [0.4, 0.28, 0.2, 0.72] },
        { label: 'Tree and dates', role: 'evidence' },
        { label: 'Ghost lineages', role: 'else' },
        { label: 'Albian fossils', role: 'test' }
      ]
    })),

    /* ---------------------------------------------------------- part 2 */
    partTitle('p2', 2, 'What did it eat?'),

    figSeg('traits', 'Skull traits', 1, 3.5, Object.assign(FIG('zm11-fig1.jpg', 584, 1152, 'Zanno & Makovicky 2011'), {
      zones: [
        { label: 'Skull traits tell the diet?', role: 'claim' },
        { label: 'Toothless beak', role: 'evidence', rect: [0.07, 0.215, 0.93, 0.19] },
        { label: 'Small conical teeth', role: 'evidence', rect: [0.07, 0.63, 0.93, 0.2] },
        { label: 'Chin hooks down', role: 'evidence', rect: [0, 0.85, 1, 0.15] },
        { label: 'Meat-eaters: serrated blades', role: 'else' },
        { label: '27 tested: 21 hold up', role: 'test' },
        { label: 'Held up: gut contents, gizzard stones', src: 'img/zm11-fig2.jpg', w: 950, h: 1261, cap: 'Green: plant-eating evidence · red: meat-eating · Zanno & Makovicky 2011' }
      ]
    }), 'diet'),

    figSeg('skulls', 'Six skulls', 2, 3, Object.assign(FIG('zm11-fig1.jpg', 584, 1152, 'Zanno & Makovicky 2011'), {
      pitch: 78, zones: [
        { label: 'Hoatzin: leaf-eater', rect: [0, 0, 1, 0.2] },
        { label: 'Ornithomimus', rect: [0, 0.21, 1, 0.2] },
        { label: 'Shenzhousaurus', rect: [0, 0.42, 1, 0.21] },
        { label: 'Incisivosaurus', rect: [0, 0.64, 1, 0.2] },
        { label: 'Caenagnathus', rect: [0, 0.85, 1, 0.15] }
      ]
    })),

    figSeg('herb', 'Plants first', 2, 3, Object.assign(FIG('zanno09-fig2.jpg', 1306, 876, 'Zanno et al. 2009'), {
      zones: [{ label: 'Plants first?', role: 'claim' }, { label: 'Early members: plant traits', role: 'evidence' }, { label: 'Or separate origins', role: 'else' }]
    })),

    figSeg('beak', 'Beaks', 2, 3, Object.assign(FIG('lau13-fig2.jpg', 714, 793, 'Erlikosaurus · Lautenschlager et al. 2013'), {
      zones: [
        { label: 'Why a beak?', role: 'claim' },
        { label: 'Bare snout', role: 'evidence', rect: [0.04, 0, 0.215, 1] },
        { label: 'Beak: less red', role: 'evidence', rect: [0.275, 0, 0.45, 1] },
        { label: 'Teeth: more red', role: 'evidence', rect: [0.745, 0, 0.215, 1] },
        { label: 'One skull', role: 'else' }
      ]
    }), 'beak'),

    figSeg('twofig', 'Two designs', 1, 3, Object.assign(FIG('but20-fig2.jpg', 971, 1196, 'Button & Zanno 2020'), {
      pitch: 70, zones: [
        { label: 'Meat-eaters', dot: '#c0392b', rect: [0.09, 0.01, 0.46, 0.28] },
        { label: 'Plant-eating theropods', rect: [0.56, 0.01, 0.43, 0.28] },
        { label: 'Sauropodomorphs', rect: [0.09, 0.33, 0.46, 0.3] },
        { label: 'Ornithischians', rect: [0.56, 0.33, 0.43, 0.3] },
        { label: 'Gut-processors', role: 'evidence', rect: [0.09, 0.67, 0.46, 0.3] },
        { label: 'Mouth-processors', role: 'evidence', rect: [0.56, 0.67, 0.43, 0.3] }
      ]
    }), 'twofig'),

    /* ---------------------------------------------------------- part 3 */
    partTitle('p3', 3, 'The claws'),

    figSeg('clawsize', 'Claws', 1, 1.5, Object.assign(FIG('lau14-sil.jpg', 1380, 395, 'Lautenschlager 2014'), {
      zones: [{ label: '50 cm+' }]
    })),

    figSeg('fea', 'Hook or dig?', 1, 3, Object.assign(FIG('lau14-fig3.jpg', 1174, 1419, 'Lautenschlager 2014'), {
      zones: [
        { label: 'Red: high stress, likely to break', dot: '#d03b3b' },
        { label: 'Blue: low stress, unlikely to break', dot: '#2d5fd0' },
        { label: 'Digging', role: 'evidence', rect: [0.18, 0.04, 0.26, 0.94] },
        { label: 'Hooking', role: 'evidence', rect: [0.45, 0.04, 0.24, 0.94] },
        { label: 'Short claw: blue every time', role: 'evidence', rect: [0, 0.465, 1, 0.17] },
        { label: 'Thickness of keratin sheath important', role: 'else' }
      ]
    }), 'fea'),

    figSeg('display', 'Display?', 1, 3.5, Object.assign(FIG('qin23-fig2.jpg', 1438, 1619, 'Qin et al. 2023'), {
      zones: [
        { label: 'Giant claw: for display?', role: 'claim' },
        { label: 'Alvarezsaurs: blue, can dig', role: 'evidence', rect: [0.26, 0.2, 0.66, 0.45] },
        { label: 'Other therizinosaurs: blue', role: 'evidence', rect: [0.26, 0.715, 0.66, 0.285] },
        { label: 'Therizinosaurus: red', role: 'evidence', rect: [0.26, 0.665, 0.66, 0.05] },
        { label: 'Unfit for feeding is not evidence for display', role: 'else' },
        { label: 'What would show display?', role: 'test' }
      ]
    }), 'display'),

    figSeg('alvarez', 'A test that says yes', 2, 3, Object.assign(FIG('qin23-fig3.jpg', 1521, 1336, 'Qin et al. 2023'), {
      zones: [
        { label: 'Alvarezsaurs dig?', role: 'claim' },
        { label: 'Digging mammals', role: 'evidence', rect: [0, 0, 1, 0.26] },
        { label: 'Alvarezsaurs: low stress', role: 'evidence', rect: [0, 0.5, 1, 0.25] },
        { label: 'Therizinosaurs: not', role: 'evidence', rect: [0, 0.75, 1, 0.25] }
      ]
    })),

    sortSeg('sort2', 'What was it for?', 2, 3.5,
      [{ id: 'feed', label: 'Feeding' }, { id: 'warm', label: 'Warmth' }, { id: 'fight', label: 'Fighting' }, { id: 'show', label: 'Showing off' }],
      [
        { id: 'f1', text: 'Short thin filaments, whole body', to: 'warm', basis: 'analogy' },
        { id: 'f2', text: 'Long stiff filaments: head, neck, tail', to: 'show', basis: 'analogy' },
        { id: 'f3', text: 'Claw: low stress hooking', to: 'feed', basis: 'stress test' },
        { id: 'f4', text: 'Claw sheath curved ~120°', to: 'feed', basis: 'analogy' },
        { id: 'f5', text: 'Giant claw fails all three', to: 'show', basis: 'elimination' },
        { id: 'f6', text: 'Claw: low stress piercing', basis: 'stress test' },
        { id: 'f7', text: 'Territory; courtship; play', basis: 'untested' }
      ]),

    figSeg('kobfig', 'Duonychus', 3, 2.5, Object.assign(FIG('kob25-fig1.jpg', 1373, 1250, 'Kobayashi et al. 2025'), {
      zones: [
        { label: 'Gobi', rect: [0, 0, 1, 0.42] },
        { label: 'In the ground', rect: [0, 0.46, 0.52, 0.54] },
        { label: 'Restored', rect: [0.52, 0.4, 0.48, 0.6] }
      ]
    })),

    figSeg('duofig', 'New evidence: the sheath', 1, 3.5, Object.assign(FIG('kob25-fig4.jpg', 1365, 1239, 'Duonychus · Kobayashi et al. 2025'), {
      zones: [
        { label: 'Test: a claw that kept its sheath', role: 'test' },
        { label: 'Sheath 40%+ longer than the bone', role: 'evidence', rect: [0, 0.4, 0.66, 0.6] },
        { label: 'Strong curve; elbow and wrist bend', role: 'evidence', rect: [0, 0, 1, 0.4] },
        { label: 'Models used bone only', role: 'else' },
        { label: 'Tips toward grasping, not display', role: 'claim' },
        { label: 'Still: defense, courtship, play', role: 'else' }
      ]
    }), 'duonychus'),

    soloSeg('lever', 'A longer lever', 1, 3, { kind: 'lever', lab: { bone: 'bone', sheath: 'sheath', ref: 'stress on the bone', hi: 'High stress: likely to break', lo: 'Low stress: unlikely to break', note: 'diagram: sheath shares the load', slide: 'extra sheath', mark: 'Duonychus' } }, 1, null, 1.4),

    figSeg('didactyl', 'Fingers lost', 3, 2, Object.assign(FIG('kob25-fig7.jpg', 1507, 1544, 'Kobayashi et al. 2025'), {
      zones: [{ label: '5 clades lost a finger' }]
    })),

    /* ---------------------------------------------------------- part 4 */
    partTitle('p4', 4, 'Alone or together?'),

{
      id: 'bonebed', title: 'Crystal Geyser', min: 4, tier: 1,
      builds: [{}, {}, {}, {}, {}, {}, { rail: 'evidence' }, { rail: 'sure' }],
      items: [{
        kind: 'quarry', box: [0, 100, 1600, 690], w: 560,
        steps: [
          { src: 'img/cgq-t1.jpg', h: 279 }, { src: 'img/cgq-t2.jpg', h: 330 }, { src: 'img/cgq-t3.jpg', h: 343 },
          { src: 'img/cgq-t4.jpg', h: 369 }, { src: 'img/cgq-t5.jpg', h: 393 }
        ],
        sed: 'img/cgq-sed.jpg', sedCap: 'Quarry wall · Suarez et al. 2007',
        total: '4,500+', l1: 'bones, one quarry', dots: 'img/bonebed-dots.png', l2: 'Falcarius', l3: 'other'
      }, Object.assign(sureItem('bonebed', 7), SURE_LOW)]
    },

    figSeg('eggs', 'In the egg', 1, 3, Object.assign(FIG('emb-egg.png', 638, 586, 'Nanchao embryo, still in its egg · Kundrát et al. 2008'), {
      zones: [
        { label: 'Still in its egg' },
        { label: 'Its skull', src: 'img/emb-skull.png', w: 706, h: 500, cap: 'Embryo skull, etched from the egg · Kundrát et al. 2008' },
        { label: 'Restored: curled to hatch', src: 'img/emb-restore.png', w: 586, h: 490, cap: 'Restoration · P. Riha, in Kundrát et al. 2008' }
      ]
    })),

    figSeg('embfig', 'Embryos', 2, 3, Object.assign(FIG('kun08-fig7.jpg', 1322, 1499, 'Kundrát et al. 2008'), {
      zones: [
        { label: 'Hatch and run?', role: 'claim' },
        { label: 'Stage D: bones hard', role: 'evidence', rect: [0, 0.755, 1, 0.245] },
        { label: 'Alligators, for scale', role: 'evidence', rect: [0.62, 0.05, 0.38, 0.9] },
        { label: 'No hatchling known', role: 'else' },
        { label: 'Nests with young', role: 'test' }
      ]
    }), 'embryos'),

    figSeg('nestsite', 'A nesting ground', 1, 3, Object.assign(FIG('tan19-dr1.jpg', 1309, 770, 'Javkhlant · Tanaka et al. 2019'), {
      zones: [
        { label: 'Javkhlant, Mongolia' },
        { label: 'An egg, where it was laid', src: 'img/tan19-dr2.jpg', w: 1309, h: 1694, cap: 'Javkhlant · Tanaka et al. 2019' },
        { label: 'Its shell up close', src: 'img/tan19-dr2.jpg', w: 1309, h: 1694, cap: 'Javkhlant · Tanaka et al. 2019', rect: [0, 0.65, 1, 0.22] }
      ]
    })),

    soloSeg('nest', 'Javkhlant', 1, 3, {
      kind: 'density', axis: 'clutches per 100 m²',
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
    }, 1, 'nest', 1.4),

    figSeg('sedim', 'The nest layer', 2, 2, Object.assign(FIG('tan19-dr3.jpg', 1343, 1100, 'Javkhlant · Tanaka et al. 2019'), {
      zones: [
        { label: 'Mound nests?', role: 'claim' },
        { label: 'Eggs in organic soil', role: 'evidence', rect: [0, 0.5, 0.55, 0.5] },
        { label: 'Heat from rot: inferred', role: 'else' }
      ]
    })),

    figSeg('tracks', 'Tracks', 3, 3, Object.assign(FIG('fio18-fig2.jpg', 1041, 315, 'Denali · Fiorillo et al. 2018'), {
      zones: [
        { label: 'Denali, Alaska', src: 'img/fio18-fig1.jpg', w: 1041, h: 412, cap: 'Fiorillo et al. 2018' },
        { label: 'Same herd?', role: 'claim' },
        { label: 'Same surface', role: 'evidence', rect: [0, 0, 1, 1] },
        { label: 'Different days?', role: 'else' }
      ]
    }), 'tracks'),

    /* ---------------------------------------------------------- the end */
    {
      id: 'wall', title: 'The evidence', min: 2, tier: 1,
      builds: [{ rail: 'evidence' }, { rail: 'sure' }],
      items: [{
        kind: 'wall', box: [0, 100, 1600, 690], tiles: [
          { id: 'falcarius', label: 'Transitional', src: 'img/feat-jaw.png' },
          { id: 'filaments', label: 'Display filaments', src: 'img/xu09-fig1.jpg', pos: '50% 20%' },
          { id: 'diet', label: 'Diet from skulls', src: 'img/zm11-fig1.jpg', pos: '50% 35%' },
          { id: 'twofig', label: 'Two skull designs', src: 'img/but20-fig2.jpg', pos: '50% 80%' },
          { id: 'beak', label: 'A beak helps', src: 'img/lau13-fig2.jpg', pos: '50% 30%', tier: 2 },
          { id: 'fea', label: 'Hook, not dig', src: 'img/lau14-fig3.jpg', pos: '50% 35%' },
          { id: 'display', label: 'Claws for display', src: 'img/qin23-fig2.jpg', pos: '70% 85%' },
          { id: 'duonychus', label: 'Grasping', src: 'img/kob25-fig4.jpg', pos: '30% 70%' },
          { id: 'bonebed', label: 'Group living', src: 'img/bonebed-dots.png' },
          { id: 'embryos', label: 'Hatchlings alone', src: 'img/kun08-fig1.jpg', pos: '50% 70%', tier: 2 },
          { id: 'nest', label: 'A colony', src: 'img/tan19-dr2.jpg', pos: '50% 20%' },
          { id: 'tracks', label: 'With a herd', src: 'img/fio18-fig2.jpg', tier: 3 }
        ]
      }]
    }
  ];

  root.THERIZ = {
    rail: [
      { key: 'claim', label: 'Claim' },
      { key: 'evidence', label: 'Evidence' },
      { key: 'else', label: 'Alternatives' },
      { key: 'test', label: 'Test' },
      { key: 'sure', label: 'Certainty' }
    ],
    railTitle: '',
    segments
  };
})(this);
