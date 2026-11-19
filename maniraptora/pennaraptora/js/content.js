/* Every word on screen, and the order. Edit wording here; layout lives in the parts.
 *
 * The deck takes one question at a time and lays out the lines of evidence on it:
 * each line is one paper's claim (a lens cut from the printed page), that paper's own
 * figure, and plain facts about how much material and what had to be assumed. Then
 * the lines are set beside each other where they agree or conflict, and the section
 * ends on a matrix. No verdicts on the slides; the readme keeps the points to say aloud.
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
  /* Left column of a line slide: the claim on top, the facts under it. */
  const CLAIM = [24, 124, 760, 300];
  const FACTS = [24, 452, 760, 334];
  /* Two papers side by side: a short lens over each one's figure. */
  const LTOP = [24, 124, 760, 190];
  const LFIG = [24, 326, 760, 460];
  const RTOP = [812, 124, 764, 190];
  const RFIG = [812, 326, 764, 460];
  const at = (box, item) => Object.assign(item, { box });

  /* A picture from img/ with an optional crop [l, t, r, b] and ring, both as fractions of the file. */
  const V = (name, cap, at, crop, ring) => ({ src: 'img/' + name, cap: cap || '', at: at || 0, crop, ring });
  /* head: the topic card on the right, naming the concept (1-3 words, no question). */
  /* The top-left question was dropped (2026-11-19); only the topic card shows. */
  const head = (crumb, topic) => ({ kind: 'head', box: [0, 46, 1600, 72], topic });
  const pic = (views, builds) => ({ kind: 'pic', views, builds });
  const ref = (steps, builds) => ({ kind: 'page', lensOnly: true, steps: steps.map(([q, at, label]) => ({ q, at, label })), builds });
  const facts = (chips, builds) => ({ kind: 'facts', chips: chips.map(([n, l, at]) => ({ n, l, at: at || 0 })), builds });
  /* A silhouette beside a fossil: sil file, its credit, fossil file, crop, caption. */
  const pair = (sil, credit, fig, crop, cap, builds, o) => Object.assign({ kind: 'pair', sil: { src: 'img/' + sil, credit }, fig: { src: 'img/' + fig, crop }, cap, builds }, o);
  const SK = { silW: 0.46 };  /* a skeletal diagram gets more of the row than a silhouette */
  /* Right column split in two: a fossil and its reconstruction, seen together. */
  const RT = [812, 124, 764, 322], RB = [812, 464, 764, 322];
  const span = (a, b) => { const r = []; for (let i = a; i <= b; i++) r.push(i); return r; };

  function slide(id, title, tier, min, crumb, topic, items, last) {
    let n = last;
    if (n == null) {
      n = 0;
      items.forEach((r) => {
        (r.views || r.steps || r.cards || r.chips || []).forEach((v) => { n = Math.max(n, v.at || 0); });
        if (r.builds) n = Math.max(n, ...r.builds);
        (r.focus || []).forEach((f) => { n = Math.max(n, f.at); });
      });
    }
    const builds = []; for (let b = 0; b <= n; b++) builds.push({});
    return { id, title, tier, min, builds, items: [head(crumb, topic)].concat(items) };
  }

  /* One line of evidence: claim lens(es) top left, facts under them, figure on the right. */
  function line(id, title, tier, min, crumb, topic, o) {
    const items = [];
    const from = o.claim ? Math.min(...o.claim.map((c) => c[1])) : 0;
    if (o.claim) items.push(at(o.chips ? CLAIM : LEFT, ref(o.claim)));
    if (o.chips) items.push(at(o.claim ? FACTS : LEFT, facts(o.chips)));
    items.push(at(RIGHT, pic(o.views)));
    const sl = slide(id, title, tier, min, crumb, topic, items, o.last);
    if (from) items[0].builds = span(from, sl.builds.length - 1);
    return sl;
  }

  /* Two papers side by side. */
  function versus(id, title, tier, min, crumb, topic, o) {
    return slide(id, title, tier, min, crumb, topic, [
      at(LTOP, ref(o.left)), at(LFIG, pic(o.lviews)),
      at(RTOP, ref(o.right)), at(RFIG, pic(o.rviews))
    ], o.last);
  }

  const partTitle = (id, text, tier) => ({ id, title: text.replace(/_/g, ''), min: 0.3, tier: tier || 1, builds: [{}], items: [{ kind: 'title', box: [100, 200, 1400, 500], n: true, text }] });

  const papers = {
    xn04: { cite: 'Xu & Norell 2004', journal: '_Nature_' },
    gao12: { cite: 'Gao et al. 2012', journal: '_PLoS ONE_' },
    lu15: { cite: 'Lü & Brusatte 2015', journal: '_Scientific Reports_' },
    xia11: { cite: 'Xu et al. 2011', journal: '_Nature_' },
    bru14: { cite: 'Brusatte et al. 2014', journal: '_Current Biology_' },
    lee14: { cite: 'Lee et al. 2014', journal: '_Science_' },
    har19: { cite: 'Hartman et al. 2019', journal: '_PeerJ_' },
    pei20: { cite: 'Pei et al. 2020', journal: '_Current Biology_' },
    agn19: { cite: 'Agnolín et al. 2019', journal: '_Frontiers in Earth Science_' },
    li08: { cite: 'Li et al. 2008', journal: '_Naturwissenschaften_' },
    li12: { cite: 'Li et al. 2012', journal: '_Science_' },
    cla99: { cite: 'Clark, Norell & Chiappe 1999', journal: '_American Museum Novitates_' },
    var08: { cite: 'Varricchio et al. 2008', journal: '_Science_' },
    bir13: { cite: 'Birchard et al. 2013', journal: '_Biology Letters_' },
    rb07: { cite: 'Roach & Brinkman 2007', journal: '_Bull. Peabody Mus. Nat. Hist._' },
    xb25: { cite: 'Xu & Barrett 2025', journal: '_Biology Letters_' },
    wz23: { cite: 'Wang & Zhou 2023', journal: '_Nature Ecology & Evolution_' },
    ami17: { cite: 'Amiot et al. 2017', journal: '_Palaeontology_' },
    foth14: { cite: 'Foth et al. 2014', journal: '_Nature_' },
    xing18: { cite: 'Xing et al. 2018', journal: '_Cretaceous Research_' },
    xing24: { cite: 'Xing et al. 2024', journal: '_iScience_' },
    zel08: { cite: 'Zelenitsky & Therrien 2008', journal: '_Palaeontology_' },
    vj16: { cite: 'Varricchio & Jackson 2016', journal: '_The Auk_' },
    fun16: { cite: 'Funston et al. 2016', journal: '_Scientific Reports_' },
    fre20: { cite: 'Frederickson et al. 2020', journal: '_Palaeo-3_' },
    per14: { cite: 'Persons et al. 2014', journal: '_Acta Palaeontologica Polonica_' },
    cla26: { cite: 'Clark et al. 2026', journal: '_PLoS ONE_' },
    fan26: { cite: 'Fan et al. 2026', journal: '_Biological Reviews_' },
    bi21: { cite: 'Bi et al. 2021', journal: '_Science Bulletin_ (accepted manuscript)' },
    jin20: { cite: 'Jin et al. 2020', journal: '_J. Vertebrate Paleontology_' },
    yan19: { cite: 'Yang et al. 2019', journal: '_Integrative Organismal Biology_' },
    tan15: { cite: 'Tanaka et al. 2015', journal: '_PLoS ONE_' },
    wie17: { cite: 'Wiemann et al. 2017', journal: '_PeerJ_' },
    tan18: { cite: 'Tanaka et al. 2018', journal: '_Biology Letters_' },
    var18: { cite: 'Varricchio et al. 2018', journal: '_Scientific Reports_' },
    var02: { cite: 'Varricchio et al. 2002', journal: '_J. Vertebrate Paleontology_' },
    hog23: { cite: 'Hogan & Varricchio 2023', journal: '_Phil. Trans. R. Soc. B_' },
    tal18: { cite: 'Talori et al. 2018', journal: '_Scientific Reports_' },
    dec16: { cite: 'Dececchi et al. 2016', journal: '_PeerJ_' },
    dec20: { cite: 'Dececchi et al. 2020', journal: '_iScience_' },
    xu17: { cite: 'Xu et al. 2017', journal: '_Nature Communications_' },
    kia24: { cite: 'Kiat & O\'Connor 2024', journal: '_PNAS_' },
    voe18: { cite: 'Voeten et al. 2018', journal: '_Nature Communications_' },
    wu24: { cite: 'Wu et al. 2024', journal: '_PeerJ_' },
    bal13: { cite: 'Balanoff et al. 2013', journal: '_Nature_' },
    tor21: { cite: 'Torres et al. 2021', journal: '_Science Advances_' }
  };

  const segments = [
    /* ---------------------------------------------------------- cover */
    { id: 'title', title: 'Pennaraptora', min: 1, tier: 1, builds: [{}], items: [{ kind: 'cover', box: [0, 0, 1600, 790], pic: 'img/arch-ed9.jpg', title: 'Pennaraptora' }] },

    /* ---------------------------------------------------------- 1 the groups */
    partTitle('p-groups', 'Subgroups'),

    slide('groups', 'Subgroups', 1, 4, 'Pennaraptora', 'Subgroups', [
      at([24, 124, 764, 322], pair('skel-sinovenator.png', '_Sinovenator_ IVPP V12615, a close relative · Jaime Headden, Wikimedia Commons, CC BY 3.0',
        'mei-fig1.jpg', [0, 0.655, 0.495, 0.975], '*Troodontid* · _Mei long_ IVPP V12733 · Xu & Norell 2004 Fig 1c', [0, 1, 2, 3], SK)),
      at([812, 124, 764, 322], pair('skel-microraptor.png', '_Microraptor gui_ IVPP V13352, another dromaeosaurid · Jaime Headden, Wikimedia Commons, CC BY 3.0',
        'zhen-fig1.jpg', null, '*Dromaeosaurid* · _Zhenyuanlong_ JPM-0008 · Lü & Brusatte 2015 Fig 1', [1, 2, 3], SK)),
      at([24, 464, 764, 322], pair('skel-oviraptor.png', '_Oviraptor_, another oviraptorid, gaps filled from _Citipati_ · Ivan Iofrida, Wikimedia Commons, CC BY-SA 4.0',
        'bi-fig1.jpg', [0, 0, 0.485, 0.512], '*Oviraptorosaur* · oviraptorid LDNHMF2008 on its eggs · Bi et al. 2021 Fig 1a', [2, 3], SK)),
      at([812, 464, 764, 322], pair('skel-archaeopteryx.png', '_Archaeopteryx_, London specimen · Jaime Headden, Wikimedia Commons, CC BY 3.0',
        'arch-fig1.jpg', [0, 0.17, 0.8, 0.63], '*Avialan* · _Archaeopteryx_ FMNH PA 830 · O\'Connor et al. 2025 Fig 1a', [3], SK))
    ]),

    slide('friends', 'And friends', 2, 2, 'Pennaraptora', 'Subgroups', [
      at(LEFT, pair('sil-yi.svg', '_Yi qi_ · Emily Willoughby, PhyloPic, CC BY-SA',
        'yi-fig1.jpg', [0, 0.513, 1, 0.80], '*Scansoriopterygid* · _Yi qi_ STM 31-2 · Xu et al. 2015 Fig 1b', [0], { stack: true, silW: 0.42 })),
      at(RIGHT, pic([V('vel-fig10.jpg', '*Dromaeosaurid* · _Velociraptor_ cast MUST SN1140/BM and reconstruction · Bindellini et al. 2025 Fig 10', 0)]))
    ]),

    /* ---------------------------------------------------------- 2 phylogeny */
    partTitle('p-phylo', 'Phylogeny'),

    /* The contenders, then the second toe they share: why the trees disagree. */
    slide('contenders', 'Contenders', 1, 3, 'Which group is closest to birds?', 'Shared characters', [
      at([24, 124, 370, 470], pic([V('skel-sinovenator.png', '*Troodontid* · _Sinovenator_ · Jaime Headden, CC BY 3.0', 0),
        V('skel-sinovenator.png', '*Troodontid* · toe II raised', 1, null, [0.31, 0.87, 0.45, 1])])),
      at([412, 124, 370, 470], pic([V('skel-microraptor.png', '*Dromaeosaurid* · _Microraptor_ · Jaime Headden, CC BY 3.0', 0),
        V('skel-microraptor.png', '*Dromaeosaurid* · toe II raised', 1, null, [0.43, 0.85, 0.55, 1])])),
      at([800, 124, 370, 470], pic([V('skel-austroraptor.png', '*Unenlagiid* · _Austroraptor_ · Jaime Headden, CC BY 3.0', 0),
        V('skel-austroraptor.png', '*Unenlagiid* · toe II raised', 1, null, [0.41, 0.74, 0.51, 1])])),
      at([1188, 124, 388, 470], pic([V('skel-archaeopteryx.png', '*Avialan* · _Archaeopteryx_ · Jaime Headden, CC BY 3.0', 0),
        V('skel-archaeopteryx.png', '*Avialan* · toe II "highly extensible" (Xu et al. 2011)', 1, null, [0.61, 0.81, 0.77, 1])])),
      at([24, 620, 1552, 166], { kind: 'quotes', cols: 1, size: 24, cards: [{ q: 'xia-toe', at: 2 }], builds: [2] })
    ]),

    slide('trees', 'Four trees', 1, 5, 'Which group is closest to birds?', 'Phylogenetic uncertainty', [
      at(FULL, {
        kind: 'tree', focal: 'birds', tipW: 560,
        tips: [
          { id: 'ovi', label: 'Oviraptorosaurs', img: 'img/skel-oviraptor.png' },
          { id: 'troo', label: 'Troodontids', img: 'img/skel-sinovenator.png' },
          { id: 'drom', label: 'Dromaeosaurids', img: 'img/skel-microraptor.png' },
          { id: 'unen', label: 'Unenlagiids', img: 'img/skel-austroraptor.png' },
          { id: 'birds', label: 'Avialans', img: 'img/skel-archaeopteryx.png' }],
        trees: [
          { at: 0, t: ['ovi', ['birds', ['troo', ['unen', 'drom']]]], cap: '*Troodontids with dromaeosaurids* · Gianechini et al. 2017; Pei et al. 2020' },
          { at: 1, t: ['ovi', [['unen', 'drom'], ['troo', 'birds']]], cap: '*Troodontids closest* · Godefroit et al. 2013; Cau et al. 2017 (as drawn in Agnolín et al. 2019 Fig 2)' },
          { at: 2, t: ['ovi', ['troo', ['drom', ['unen', 'birds']]]], cap: '*Unenlagiids closest* · Agnolín & Novas 2013 (as drawn in Agnolín et al. 2019 Fig 2)' },
          { at: 3, t: ['ovi', ['troo', ['unen', 'drom'], 'birds']], cap: '*Unresolved* · Brusatte et al. 2014' }]
      })
    ], 3),

    slide('recode', 'Rescoring', 1, 4, 'Which group is closest to birds?', 'Character scoring', [
      at([24, 124, 700, 662], { kind: 'quotes', cols: 1, size: 26, cards: [{ q: 'agn-recode', at: 1 }, { q: 'har-step', at: 2 }] }),
      at([760, 124, 816, 662], {
        kind: 'tree', focal: 'birds', tipW: 430,
        tips: [
          { id: 'ovi', label: 'Oviraptorosaurs', img: 'img/skel-oviraptor.png' },
          { id: 'troo', label: 'Troodontids', img: 'img/skel-sinovenator.png' },
          { id: 'drom', label: 'Dromaeosaurids', img: 'img/skel-microraptor.png' },
          { id: 'unen', label: 'Unenlagiids', img: 'img/skel-austroraptor.png' },
          { id: 'birds', label: 'Avialans', img: 'img/skel-archaeopteryx.png' }],
        trees: [
          { at: 0, t: ['ovi', ['birds', ['troo', ['unen', 'drom']]]], cap: 'TWiG matrix · Gianechini et al. 2017' },
          { at: 1, t: ['ovi', 'troo', 'unen', 'drom', 'birds'], cap: 'Same matrix, unenlagiids rescored · Agnolín et al. 2019 Fig 8' }]
      })
    ]),

    /* ---------------------------------------------------------- 3 behavior */
    partTitle('p-behave', 'Behavior'),

    slide('sleep', 'Sleep posture', 1, 4, 'How did they rest?', 'Sleep posture', [
      at(LTOP, ref([['xn-sleep', 0]])),
      at(LFIG, pair('life-meilong.jpg', '_Mei long_ life restoration · Matt Martyniuk, Wikimedia Commons, CC BY-SA 3.0',
        'mei-fig1.jpg', [0, 0.655, 0.495, 0.975], '_Mei long_ IVPP V12733 · Xu & Norell 2004 Fig 1c', [0, 1, 2], { silW: 0.42, life: true })),
      at(RTOP, ref([['gao-mirror', 1], ['gao-limit', 2]], [1, 2])),
      at(RFIG, pic([V('mei2-fig1.jpg', '_Mei long_, second specimen · Gao et al. 2012 Fig 1', 1, [0, 0, 1, 0.5])], [1, 2]))
    ]),

    line('herd', 'Bonebed', 1, 4, 'Did they live in groups?', 'Group living', {
      claim: [['fun-greg', 0], ['fun-unclear', 2]],
      chips: [['17 of 33', 'adult tibiotarsi (fused to the ankle)', 1], ['1', 'small tibia', 2]],
      views: [V('fun-fig2.jpg', 'The _Avimimus_ bonebed, Nemegt Formation · Funston et al. 2016 Fig 2', 0),
        V('fun-fig7.jpg', 'Tibiotarsi by length: fused A–L, unfused M–W · Funston et al. 2016 Fig 7', 1)]
    }),

    line('tracks', 'Trackways', 1, 4, 'Did they live in groups?', 'Group living', {
      claim: [['li-group', 0], ['li-single', 2], ['xing18-social', 3], ['rb-shore', 4]],
      chips: [['6', 'parallel trackways on one bedding plane, none overlapping', 1], ['< 1 stride', 'between neighboring trackways', 1]],
      views: [V('li08-fig3.jpg', 'Six _Dromaeopodus_ trackways, D1–D6, all heading one way · Li et al. 2008 Fig 3', 0),
        V('li08-fig2.jpg', 'Two-toed prints: digit II held off the ground · Li et al. 2008 Fig 2', 1, [0, 0.012, 1, 0.975]),
        V('xing18-fig5.jpg', 'Four small two-toed trackways, Houmotuan · Xing et al. 2018 Fig 5', 3, [0, 0, 0.56, 1]),
        V('rb07-fig6.jpg', 'Mount Tom theropod trackways, Massachusetts (Ostrom 1972) · Roach & Brinkman 2007 Fig 6', 4)]
    }),

    slide('maker', 'Trackmaker', 1, 4, 'Who made the tracks?', 'Trackmaker identity', [
      at([24, 124, 760, 470], pic([V('xing24-ga.jpg', '_Fujianipus_ trackmaker as a giant troodontid, life reconstruction · Xing et al. 2024 graphical abstract', 0, [0.555, 0.005, 0.995, 0.475])])),
      at([812, 124, 764, 470], pic([V('xing24-ga.jpg', '_Fujianipus_ tracks R5 and L5: photos and elevation images · Xing et al. 2024 graphical abstract', 0, [0.02, 0.737, 0.99, 0.995])])),
      at([24, 620, 1552, 166], { kind: 'quotes', cols: 2, size: 24, cards: [{ q: 'xing24-troo', at: 1 }, { q: 'xing24-assume', at: 2 }], builds: [1, 2] })
    ]),

    line('solitary', 'Solitary hunters', 1, 4, 'Did they live in groups?', 'Hunting behavior', {
      claim: [['rb-null', 0], ['rb-none', 1], ['rb-part', 2]],
      chips: [['4', '_Deinonychus_ with one _Tenontosaurus_ at the type quarry, YPM 64-75', 1], ['4 / 17', 'Komodo dragons at one kill: average, most seen', 2]],
      views: [V('rb07-fig1.jpg', 'YPM 64-75: _Deinonychus_ and _Tenontosaurus_ bones · Roach & Brinkman 2007 Fig 1', 0),
        V('rb07-fig5.jpg', 'A _Deinonychus_ feeding mob, drawing signed BTR · Roach & Brinkman 2007 Fig 5', 1)]
    }),

    /* The test's two predictions as living animals, then the teeth. */
    slide('pack', 'Pack hunting', 1, 5, 'Did they live in groups?', 'Hunting behavior', [
      at(LEFT, pic([V('pack-wolves.jpg', '*Pack* · wolves: young eat the adults\' prey · Patrick Bell, Wikimedia Commons, CC BY 2.0', 0)], [0])),
      at(RIGHT, pic([V('pack-komodo.jpg', '*No pack* · Komodo dragons: young eat smaller prey · Mats Stafseng Einarsen, Wikimedia Commons, CC BY 2.5', 0)], [0])),
      at(CLAIM, ref([['fre-diff', 1], ['fre-not', 2], ['fre-utah', 4]], span(1, 4))),
      at(FACTS, facts([['10 + 10', 'teeth, small and large, from two sites', 3], ['2', '_Tenontosaurus_ individuals', 3], ['3', '_Utahraptor_ at one site: adult, juvenile, baby', 4]], span(1, 4))),
      at(RIGHT, pic([V('fre-fig2.jpg', 'Carbon isotopes by tooth size: _Deinonychus_ (left), crocodiles (right) · Frederickson et al. 2020 Fig 2', 1)], span(1, 4)))
    ]),

    line('diet', 'Troodontid diet', 1, 5, 'What did troodontids eat?', 'Diet', {
      claim: [['fan-troodon', 0], ['fan-pred', 2]],
      chips: [['1', 'specimen with gut contents, _Jinfengopteryx_', 1], ['5', 'troodontid individuals in the isotope study', 1], ['0', 'suspected pellets found with a skeleton', 1]],
      views: [V('fan-fig7.jpg', 'Every line on troodontid diet: green plants/omnivory, red meat, grey undecided · Fan et al. 2026 Fig 7', 0),
        V('fan-fig7.jpg', 'Teeth, skull and limb lines · Fan et al. 2026 Fig 7', 2, [0, 0.27, 0.9, 0.9])]
    }),

    /* ---------------------------------------------------------- 4 reproduction */
    partTitle('p-repro', 'Reproduction'),

    slide('nests', 'Adults on nests', 1, 4, 'Did they brood their eggs?', 'Brooding', [
      at(CLAIM, ref([['cla-evoke', 0], ['cla-heat', 2]])),
      at(FACTS, facts([['4 of 17', 'adult oviraptorids from the Djadokhta sandstones found on nests, before 1996', 0], ['4', 'oviraptorid genera found on nests by 2012', 1], ['0', 'embryos in these nests', 1]])),
      at(RT, pic([V('cla99-fig1.jpg', '_Citipati_ IGM 100/979 on its nest · Clark et al. 1999 Fig 1', 0)], [0])),
      at(RB, pic([V('cla99-fig13.jpg', 'Reconstruction of the same posture · Clark et al. 1999 Fig 13', 0)], [0])),
      at(RIGHT, pic([V('fan12-fig3.jpg', '_Nemegtomaia_ MPC-D 107/15 on its nest, with restoration (E) · Fanti et al. 2012 Fig 3', 1)], [1, 2]))
    ]),

    line('brood', 'Adult on eggs', 1, 4, 'Did they brood their eggs?', 'Brooding', {
      claim: [['bi-brood', 0]],
      chips: [['1', 'adult, no skull', 1], ['≥ 24', 'eggs in three rings, some with embryos', 1]],
      views: [V('bi-fig1.jpg', 'LDNHMF2008 on its clutch (a) and its skeletal restoration (c) · Bi et al. 2021 Fig 1', 0)]
    }),

    slide('clutch', 'Clutch size', 1, 3, 'Did they brood their eggs?', 'Brooding', [
      at(CLAIM, ref([['tan18-sat', 0]])),
      at(FACTS, facts([['40', 'clutches', 1], ['3', 'giant _Macroelongatoolithus_ clutches', 1]])),
      at(RT, pic([V('tan18-fig1.jpg', 'Small, medium and giant clutches · Tanaka et al. 2018 Fig 1a–c', 0, [0, 0, 1, 0.23])])),
      at(RB, pic([V('tan18-fig2.jpg', 'Painting by Masato Hattori · Tanaka et al. 2018 Fig 2', 0)]))
    ]),

    /* Who sits on eggs today, before the fossil argument about which parent. */
    slide('care', 'Care today', 1, 3, 'Which parent sat on the eggs?', 'Parental care', [
      at([24, 124, 500, 662], pic([V('care-croc.jpg', '*Mother guards* · saltwater crocodile at her nest · Eliza68, Wikimedia Commons, CC BY-SA 4.0', 0)])),
      at([550, 124, 500, 662], pic([V('care-ostrich.jpg', '*Both parents sit* · ostrich, female on the nest · Joachim Huber, Wikimedia Commons, CC BY-SA 2.0', 1)], [1, 2])),
      at([1076, 124, 500, 662], pic([V('care-rhea.jpg', '*Father sits* · rhea on its nest · Paul F. Kisak, Wikimedia Commons, CC BY-SA 4.0', 2)], [2]))
    ]),

    versus('parent', 'Which parent', 1, 5, 'Which parent sat on the eggs?', 'Parental care', {
      left: [['var08-pat', 0], ['var08-hist', 1]], lviews: [V('var08-fig1.jpg', 'Clutch volume vs body mass by care type; red diamonds: _Troodon_, _Oviraptor_, _Citipati_ · Varricchio et al. 2008 Fig 1B', 0, [0.395, 0, 1, 1])],
      right: [['bir-same', 2], ['bir-not', 3]], rviews: [V('bir13-fig1.jpg', '(a) paternal blue, maternal yellow, biparental squares; (b) altricial blue, precocial yellow; diamonds: dinosaurs · Birchard et al. 2013 Fig 1', 2, [0, 0, 1, 0.955])]
    }),

    /* Three kinds of evidence, one answer: partly buried, partly open. */
    slide('open', 'Open or buried', 1, 5, 'Were the eggs buried?', 'Nest form', [
      at([24, 124, 1552, 200], { kind: 'quotes', cols: 3, size: 24, cards: [{ q: 'tan15-buried', at: 0 }, { q: 'wie-open', at: 1 }, { q: 'hog-weak', at: 2 }] }),
      at([24, 346, 500, 440], pic([V('tan15-fig3.jpg', 'Pores · Tanaka et al. 2015 Fig 3', 0)], [0, 1, 2])),
      at([550, 346, 500, 440], pic([V('wie-fig1.jpg', 'Pigment · Wiemann et al. 2017 Fig 1C, D', 1, [0, 0.53, 1, 1])], [1, 2])),
      at([1076, 346, 500, 440], pic([V('hog-fig1.jpg', 'Partly buried clutches · Hogan & Varricchio 2023 Fig 1', 2)], [2]))
    ]),

    /* Same eggs' warmth from two methods, two answers. */
    versus('warm', 'How warm, how long', 1, 5, 'Were the eggs warmed?', 'Incubation', {
      left: [['ami-range', 0], ['ami-alter', 1]], lviews: [V('ami17-fig5.jpg', 'Eggshell vs embryo bone δ¹⁸O, 7 eggs; circled: possible alteration · Amiot et al. 2017 Fig 5', 0)],
      right: [['var18-74', 2], ['var18-buried', 3]], rviews: [V('var18-fig1.jpg', 'Tooth of embryo MOR 246-11, section · Varricchio et al. 2018 Fig 1A', 2, [0, 0, 1, 0.37]),
        V('var18-fig1.jpg', 'Buried to exposed eggs, artwork by Danny Anduza · Varricchio et al. 2018 Fig 1D', 3, [0.355, 0.395, 1, 0.97])]
    }),

    versus('hatch', 'Hatching order', 1, 5, 'Were the eggs warmed?', 'Hatching', {
      left: [['bi-async', 0]], lviews: [V('bi-fig4.jpg', 'Embryos at different stages · Bi et al. 2021 Fig 4', 0)],
      right: [['yan-excl', 1], ['yan-unique', 2]], rviews: [V('yan-fig9.jpg', 'Incubation by hatching mode · Yang et al. 2019 Fig 9', 1)]
    }),

    line('stages', 'Five stages', 2, 3, 'Did they brood their eggs?', 'Reproductive mode', {
      claim: [['vj-troo', 0]],
      views: [V('vj-fig2.jpg', 'Duck nest; oviraptorid and _Troodon_ clutches · Varricchio & Jackson 2016 Fig 2', 0),
        V('vj-fig7.jpg', 'Five stages to the modern bird mode · Varricchio & Jackson 2016 Fig 7', 1)]
    }),

    slide('repro-matrix', 'Brooding: synthesis', 1, 5, 'Did they brood their eggs?', 'Synthesis', [
      at(FULL, {
        kind: 'matrix', labelW: 260, cellsAt: 0, labelsAt: 0,
        cols: ['Adult on the eggs', 'Eggs open to the air', 'Eggs warmed', 'Hatching'],
        rows: [
          { label: 'Skeletons on nests · Clark 1999, Fanti 2012', cells: { 'Adult on the eggs': '4 of 17 adults; 4 genera', 'Eggs open to the air': '"not completely covered"' } },
          { label: 'Posture · Bi 2021', cells: { 'Adult on the eggs': 'one adult on ≥ 24 eggs', 'Eggs warmed': '"high estimated incubation temperatures"' } },
          { label: 'Pores · Tanaka 2015', cells: { 'Eggs open to the air': '"partially buried"' } },
          { label: 'Color · Wiemann 2017', cells: { 'Eggs open to the air': 'pigment; raw "olive-green"' } },
          { label: 'Clutch · Tanaka 2018', cells: { 'Adult on the eggs': '"sat directly on the eggs" (small species)' } },
          { label: 'Isotopes · Amiot 2017', cells: { 'Eggs warmed': '35–40 °C; 4 of 7 eggs set aside' } },
          { label: 'Tooth · Varricchio 2018', cells: { 'Eggs warmed': '74 days: between reptile and bird' } },
          { label: 'Embryos · Yang 2019', cells: { 'Eggs warmed': '"can probably be excluded"', Hatching: 'asynchronous' } }
        ],
        focus: [{ at: 1, col: 'Eggs warmed', label: 'Same question, three answers' }]
      })
    ], 1),

    /* ---------------------------------------------------------- 5 feathers */
    partTitle('p-feathers', 'Feathers'),

    line('fstages', 'Feather stages', 1, 4, 'When did feathers appear?', 'Feather origins', {
      claim: [['xb-stages', 0], ['xb-unknown', 1]],
      views: [V('xb25-fig1.jpg', 'Filaments to vaned feathers, from _Tianyulong_ to _Confuciusornis_ · Xu & Barrett 2025 Fig 1', 0),
        V('xb25-fig2.jpg', 'Feather traits by clade; ? marks uncertain · Xu & Barrett 2025 Fig 2', 1)]
    }),

    /* Three papers, one answer: display. The fossil and its colors first. */
    slide('display', 'Display', 1, 4, 'What were vaned feathers for?', 'Display', [
      at(LEFT, { kind: 'quotes', cols: 1, size: 24, cards: [{ q: 'li12-tail', at: 0 }, { q: 'per-display', at: 1 }, { q: 'foth-display', at: 2 }] }),
      at(RT, pic([V('li12-fig1.jpg', '_Microraptor_ BMNHC PH881 · Li et al. 2012 Fig 1A', 0, [0, 0, 1, 0.5])], [0])),
      at(RB, pic([V('li12-fig4.jpg', 'Its colors from melanosomes · Li et al. 2012 Fig 4', 0)], [0])),
      at(RIGHT, pic([V('per-fig11.jpg', '_Ajancingenia_ displaying, painting by Sydney Mohr · Persons et al. 2014 Fig 11', 1)], [1])),
      at(RIGHT, pic([V('foth14-fig1.jpg', 'The 11th _Archaeopteryx_; ft: feather "trousers" · Foth et al. 2014 Fig 1', 2)], [2]))
    ]),

    /* Two animals with vaned arm feathers that could not fly. */
    slide('wings', 'Wings without flight', 1, 5, 'What were vaned feathers for?', 'Feather function', [
      at(LTOP, ref([['tal-lift', 1]], [1, 2, 3])),
      at(LFIG, pic([V('caud-fig1.jpg', '_Caudipteryx_ IVPP V12430 · Talori et al. 2018 Fig 1', 0),
        V('caud-fig7.jpg', 'A robot _Caudipteryx_ with real feathered wings · Talori et al. 2018 Fig 7a', 1, [0, 0, 0.655, 1])])),
      at(RTOP, ref([['lu15-large', 2], ['dec16-display', 3]], [2, 3])),
      at(RFIG, pair('life-zhenyuanlong.jpg', '_Zhenyuanlong_ life restoration · Emily Willoughby, Wikimedia Commons, CC BY-SA 4.0',
        'zhen-fig1.jpg', null, '_Zhenyuanlong suni_ JPM-0008 · Lü & Brusatte 2015 Fig 1', [2, 3], { silW: 0.45, life: true }))
    ]),

    /* Asymmetric feathers: found in a non-flier, yet the best predictor of flight. */
    slide('asym', 'Feather shape', 1, 4, 'What were vaned feathers for?', 'Feather asymmetry', [
      at(LTOP, ref([['xu17-asym', 0]])),
      at(LFIG, pair('xu17-fig7.jpg', '_Jianianhualong_ life reconstruction by Julius T. Csotonyi · Xu et al. 2017 Fig 7',
        'xu17-fig5.jpg', [0, 0, 1, 0.42], '_Jianianhualong_ DLXH 1218, asymmetric tail feather · Xu et al. 2017 Fig 5c, d', [0, 1], { silW: 0.5, life: true })),
      at(RTOP, ref([['kia-asym', 1]], [1])),
      at(RFIG, pic([V('kia-fig2.jpg', 'Primaries: flying birds, flightless birds, fossils · Kiat & O\'Connor 2024 Fig 2B', 1, [0, 0.53, 1, 1])], [1]))
    ]),

    /* ---------------------------------------------------------- 6 flight */
    partTitle('p-flight', 'Flight'),

    slide('membrane', 'Membrane wings', 1, 4, 'How many times did flight evolve?', 'Membrane wings', [
      at([24, 124, 760, 322], pic([V('yi-fig1.jpg', '_Yi qi_ STM 31-2 · Xu et al. 2015 Fig 1a', 0, [0, 0, 1, 0.33])], [0, 1])),
      at([24, 464, 760, 322], pic([V('yi-fig3.jpg', 'Its skeletal restoration · Xu et al. 2015 Fig 3', 0, [0.47, 0, 1, 0.245])], [0, 1])),
      at(RIGHT, pic([V('amb-life.jpg', '_Ambopteryx longibrachium_, life restoration · released with Wang et al. 2019, _Nature_', 1)], [1])),
      at(CLAIM, ref([['dec20-yi', 2]], [2])),
      at(FACTS, facts([['2', 'membrane-winged species: _Yi_ and _Ambopteryx_', 2]], [2])),
      at(RIGHT, pic([V('dec20-fig6.jpg', 'Wing loading: gliders and _Yi_ / _Ambopteryx_ models · Dececchi et al. 2020 Fig 6', 2)], [2]))
    ]),

    /* Two physics models agree: nothing before Paraves; some paravians near the line. */
    slide('models', 'Physics models', 1, 5, 'How many times did flight evolve?', 'Biomechanics', [
      at(CLAIM, ref([['dec16-none', 0], ['pei-near', 2]])),
      at(FACTS, facts([['10%', 'of body mass as wing muscle, assumed (Dececchi)', 1], ['1.6', 'maximum lift coefficient, assumed (Pei)', 3]])),
      at(RIGHT, pic([V('dec16-fig2.jpg', 'Body weight supported by flapping up a slope, along the tree · Dececchi et al. 2016 Fig 2', 0, [0, 0, 1, 0.62]),
        V('pei-fig4.jpg', 'From fail all to pass all · Pei et al. 2020 Fig 4', 2)]))
    ]),

    /* Two anatomical lines agree: anchiornithines did not fly. */
    slide('anatomy', 'Feathers and arms', 1, 4, 'How many times did flight evolve?', 'Flight anatomy', [
      at(LTOP, ref([['kia-anch', 0]])),
      at(LFIG, pic([V('kia-fig2.jpg', 'Primary vane asymmetry on the tree; flying vs flightless birds · Kiat & O\'Connor 2024 Fig 2A', 0, [0, 0, 1, 0.455])])),
      at(RTOP, ref([['har-flightless', 1]], [1])),
      at(RFIG, {
        kind: 'dots', builds: [1], min: 0.4, max: 1.6, groupW: 170, labelW: 180,
        axis: 'Humerus length / femur length', line: { at: 0.7, label: '0.70: too short for thrust' },
        cap: 'Redrawn from Hartman et al. 2019 Table 3 (selected taxa)',
        groups: [
          { name: 'Oviraptorosaurs', items: [{ name: 'Caudipteryx', lo: 0.47 }] },
          { name: 'Troodontids', items: [{ name: 'Mei', lo: 0.52, hi: 0.55 }, { name: 'Sinovenator', lo: 0.68 }, { name: 'Hesperornithoides', lo: 0.56 }] },
          { name: 'Dromaeosaurids', items: [{ name: 'Zhenyuanlong', lo: 0.63 }, { name: 'Microraptor', lo: 0.79, hi: 0.92 }, { name: 'Deinonychus', lo: 0.76, hi: 0.80 }] },
          { name: 'Unenlagiids', items: [{ name: 'Austroraptor', lo: 0.47 }, { name: 'Buitreraptor', lo: 0.91 }] },
          { name: 'Anchiornithines', items: [{ name: 'Eosinopteryx', lo: 0.78 }, { name: 'Anchiornis', lo: 0.96, hi: 1.04 }] },
          { name: 'Avialans', items: [{ name: 'Archaeopteryx', lo: 1.12, hi: 1.24 }, { name: 'Confuciusornis', lo: 1.14, hi: 1.27 }, { name: 'Jeholornis', lo: 1.40, hi: 1.47 }] }]
      })
    ]),

    /* One tree (Pei's, simplified), four readings of where flight began. */
    slide('origins', 'How many origins', 1, 5, 'How many times did flight evolve?', 'Origins of flight', [
      at(FULL, {
        kind: 'tree', tipW: 540, legend: '● flight gained · ✕ flight lost',
        tips: [
          { id: 'ovi', label: 'Oviraptorosaurs', img: 'img/skel-oviraptor.png' },
          { id: 'troo', label: 'Troodontids', img: 'img/skel-sinovenator.png' },
          { id: 'unen', label: 'Unenlagiines', img: 'img/skel-austroraptor.png' },
          { id: 'micro', label: 'Microraptorines', img: 'img/skel-microraptor.png' },
          { id: 'eudro', label: 'Eudromaeosaurs', img: 'img/skel-velociraptor.png' },
          { id: 'anch', label: 'Anchiornithines', img: 'img/skel-anchiornis.png' },
          { id: 'avi', label: '_Archaeopteryx_ and later birds', img: 'img/skel-archaeopteryx.png' }],
        trees: [
          { at: 0, t: ['ovi', [['troo', ['unen', ['micro', 'eudro']]], ['anch', 'avi']]],
            marks: [{ tips: ['unen'], kind: 'gain' }, { tips: ['micro'], kind: 'gain' }, { tips: ['anch', 'avi'], kind: 'gain' }],
            cap: '*Three or more origins* · Pei et al. 2020' },
          { at: 1, t: ['ovi', [['troo', ['unen', ['micro', 'eudro']]], ['anch', 'avi']]],
            marks: [{ tips: ['troo', 'unen', 'micro', 'eudro', 'anch', 'avi'], kind: 'gain' }, { tips: ['troo'], kind: 'loss' }, { tips: ['eudro'], kind: 'loss' }],
            cap: '*One origin, then 6–11 losses: the same tree length* · Pei et al. 2020' },
          { at: 2, t: ['ovi', [['troo', ['unen', ['micro', 'eudro']]], ['anch', 'avi']]],
            marks: [{ tips: ['ovi', 'troo', 'unen', 'micro', 'eudro', 'anch', 'avi'], kind: 'gain' }, { tips: ['ovi'], kind: 'loss' }, { tips: ['anch'], kind: 'loss' }],
            cap: '*One origin, below Pennaraptora* · Kiat & O\'Connor 2024, marked on Pei\'s tree' },
          { at: 3, t: ['ovi', [['troo', ['unen', ['micro', 'eudro']]], ['anch', 'avi']]],
            marks: [{ tips: ['unen'], kind: 'gain' }, { tips: ['micro'], kind: 'gain' }, { tips: ['avi'], kind: 'gain' }],
            cap: '*Parallel origins; anchiornithines flightless* · Hartman et al. 2019, marked on Pei\'s tree' }]
      })
    ], 3),

    line('arch', 'Wing bones', 1, 4, 'How many times did flight evolve?', 'Flight anatomy', {
      claim: [['voe-flap', 0], ['voe-stroke', 2]],
      chips: [['3', '_Archaeopteryx_ specimens', 1], ['69', 'comparison species', 1]],
      views: [V('voe-fig1.jpg', 'Humerus and ulna cross-sections, three _Archaeopteryx_ · Voeten et al. 2018 Fig 1', 0),
        V('voe-fig2.jpg', 'Stars: _Archaeopteryx_ among flapping birds · Voeten et al. 2018 Fig 2', 1, [0, 0, 1, 0.5])]
    }),

    line('shoulder', 'Shoulder girdle', 2, 3, 'How many times did flight evolve?', 'Flight anatomy', {
      claim: [['wu-motion', 0]],
      views: [V('wu-fig1.jpg', 'Coracoid green, scapula yellow, furcula red · Wu et al. 2024 Fig 1', 0)]
    }),

    slide('flight-matrix', 'Flight: synthesis', 1, 5, 'Who could fly?', 'Synthesis', [
      at(FULL, {
        kind: 'matrix', labelW: 300, cellsAt: 0, labelsAt: 0,
        cols: ['Anchiornithines', '_Microraptor_', '_Caudipteryx_', '_Archaeopteryx_'],
        rows: [
          { label: 'Wing loading · Pei 2020', cells: { Anchiornithines: 'pass wing loading', _Microraptor_: 'pass', _Caudipteryx_: 'fail all', _Archaeopteryx_: 'pass all' } },
          { label: 'Feathers · Kiat 2024', cells: { Anchiornithines: '"not volant"', _Microraptor_: 'like volant birds', _Caudipteryx_: 'secondarily flightless', _Archaeopteryx_: 'like volant birds' } },
          { label: 'Arm/leg · Hartman 2019', cells: { Anchiornithines: '0.78–1.04', _Microraptor_: '0.79–0.92', _Caudipteryx_: '0.47', _Archaeopteryx_: '1.12–1.24' } },
          { label: 'Ground flapping · Dececchi 2016', cells: { _Microraptor_: 'WAIR not rejected', _Caudipteryx_: '"minimal locomotory benefits"', _Archaeopteryx_: 'WAIR not rejected' } },
          { label: 'Wing bones · Voeten 2018', cells: { _Archaeopteryx_: 'with flapping birds' } }
        ],
        focus: [{ at: 1, col: '_Archaeopteryx_', label: 'Every line has an entry' }, { at: 2, col: 'Anchiornithines', label: 'Two lines, two answers' }]
      })
    ], 2),

    /* ---------------------------------------------------------- 7 brains and the bird line */
    partTitle('p-brains', 'Brains and the origin of birds'),

    /* Volume and shape, and the wulst one paper saw and the other withdrew. */
    versus('brain', 'Brain', 1, 5, 'When did the bird brain evolve?', 'Neuroanatomy', {
      left: [['bal-gen', 0], ['bal-wulst', 2]], lviews: [V('bal-fig1.jpg', 'Endocasts: _Citipati_, troodontid, _Archaeopteryx_, ostrich, woodpecker · Balanoff et al. 2013 Fig 1', 0),
        V('bal-fig1.jpg', '_Archaeopteryx_ endocast (c) · Balanoff et al. 2013 Fig 1', 2, [0.785, 0.395, 1, 0.585])],
      right: [['tor-shape', 1], ['tor-artefact', 3]], rviews: [V('tor-fig3.jpg', 'Four stages of brain shape · Torres et al. 2021 Fig 3', 1)]
    }),

    /* Two papers agree the line shrank; the second shows the endpoint depends on the sample. */
    line('shrink', 'Shrinking', 1, 4, 'How did the bird body plan arise?', 'Body size', {
      claim: [['lee-trend', 0], ['tor-mass', 1]],
      chips: [['≈ 163 → 0.8 kg', 'tetanuran ancestor to bird ancestor (Lee)', 0], ['10.9 or 2.4 kg', 'bird ancestor, depending on which stem birds are sampled (Torres)', 1]],
      views: [V('lee-fig2.jpg', 'Femur length along the bird stem, with body mass · Lee et al. 2014 Fig 2B', 0, [0.46, 0, 1, 1]),
        V('tor-fig5.jpg', 'Ancestral body mass under three samples · Torres et al. 2021 Fig 5', 1)]
    }),

    /* Same transition, opposite rates: all characters vs limb proportions. Redrawn. */
    slide('rates', 'Rates', 1, 5, 'How did the bird body plan arise?', 'Evolutionary rates', [
      at([24, 124, 700, 662], { kind: 'quotes', cols: 1, size: 24, cards: [{ q: 'bru-jump', at: 0 }, { q: 'wz-low', at: 1 }, { q: 'wz-bias', at: 2 }] }),
      at([760, 124, 816, 662], {
        kind: 'tree', tipW: 420,
        tips: [
          { id: 'ovi', label: 'Oviraptorosaurs', img: 'img/skel-oviraptor.png' },
          { id: 'troo', label: 'Troodontids', img: 'img/skel-sinovenator.png' },
          { id: 'drom', label: 'Dromaeosaurids', img: 'img/skel-microraptor.png' },
          { id: 'birds', label: 'Avialans', img: 'img/skel-archaeopteryx.png' }],
        trees: [
          { at: 0, t: ['ovi', ['troo', 'drom', 'birds']], marks: [{ tips: ['birds'], kind: 'fast', text: 'fast' }],
            cap: '*All characters* · Brusatte et al. 2014' },
          { at: 1, t: ['ovi', ['troo', 'drom', 'birds']], marks: [{ tips: ['birds'], kind: 'slow', text: 'slow' }],
            cap: '*Six limb-bone lengths* · Wang & Zhou 2023' }]
      })
    ]),

    versus('bias', 'Oversampled characters', 2, 4, 'How did the bird body plan arise?', 'Sampling bias', {
      left: [['lee-bias', 0]], lviews: [V('lee-fig3.jpg', 'Bird stem fast · Lee et al. 2014 Fig 3', 0)],
      right: [['bru-artifact', 1]], rviews: [V('bru-fig2.jpg', 'Red: high rates, tyrannosaurs and birds among them · Brusatte et al. 2014 Fig 2', 1)]
    }),

    /* ---------------------------------------------------------- end */
    partTitle('p-end', 'Synthesis'),

    {
      id: 'matrix', title: 'Questions and evidence', min: 6, tier: 1, builds: [{}, {}, {}],
      items: [head('Five questions', 'Questions and evidence'), {
        kind: 'matrix', box: [24, 124, 1552, 662], labelW: 230, cellsAt: 0, labelsAt: 0,
        cols: ['Skeletons and trees', 'Eggs and nests', 'Feathers', 'Bone, teeth, brain', 'Tracks', 'Physics models'],
        rows: [
          { label: 'Closest to birds', cells: { 'Skeletons and trees': 'four trees; rescoring one group collapses the base' } },
          { label: 'Brooding', cells: { 'Skeletons and trees': 'adults on clutches', 'Eggs and nests': 'pores, color, clutch shape, embryos', 'Bone, teeth, brain': '74-day tooth, no medullary bone' } },
          { label: 'Flight', cells: { 'Skeletons and trees': 'arm/leg ratios', Feathers: 'number and asymmetry', 'Bone, teeth, brain': 'wing-bone walls', 'Physics models': 'wing loading, WAIR' } },
          { label: 'Bird brain', cells: { 'Bone, teeth, brain': 'endocast volume and shape', 'Skeletons and trees': 'size and rates on the stem' } },
          { label: 'Groups and diet', cells: { 'Skeletons and trees': 'one bonebed, sleeping posture', 'Bone, teeth, brain': 'tooth isotopes, microwear', Tracks: 'parallel trackways, two sites' } }
        ],
        focus: [{ at: 1, row: 2, label: 'One question, four kinds of evidence' }, { at: 2, col: 'Physics models', label: 'One kind of evidence, one question' }]
      }]
    },

    {
      id: 'yours', title: 'Your lines of evidence', min: 3, tier: 1, builds: [{}],
      items: [head('Your report', 'Your lines of evidence'), {
        kind: 'matrix', box: [24, 124, 1552, 662], labelW: 210,
        cols: ['What it shows', 'What it cannot show', 'How much material', 'Agrees with', 'Conflicts with'],
        rows: [{ label: 'Line 1' }, { label: 'Line 2' }, { label: 'Line 3' }]
      }]
    }
  ];

  root.PENN = { papers, railTitle: '', rail: [], segments };
})(this);
