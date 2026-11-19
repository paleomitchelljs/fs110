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
  /* head: the question on the left, the topic card on the right (1-3 words, no question). */
  const head = (crumb, topic) => ({ kind: 'head', box: [0, 46, 1600, 72], crumb, topic });
  const pic = (views, builds) => ({ kind: 'pic', views, builds });
  const ref = (steps, builds) => ({ kind: 'page', lensOnly: true, steps: steps.map(([q, at, label]) => ({ q, at, label })), builds });
  const facts = (chips, builds) => ({ kind: 'facts', chips: chips.map(([n, l, at]) => ({ n, l, at: at || 0 })), builds });
  /* A silhouette beside a fossil: sil file, its credit, fossil file, crop, caption. */
  const pair = (sil, credit, fig, crop, cap, builds, o) => Object.assign({ kind: 'pair', sil: { src: 'img/' + sil, credit }, fig: { src: 'img/' + fig, crop }, cap, builds }, o);
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

    slide('groups', 'Subgroups', 1, 4, 'Pennaraptora', 'Four subgroups', [
      at([24, 124, 764, 322], pair('sil-sinovenator.svg', '_Sinovenator_, a close relative · Tasman Dixon, PhyloPic, CC0',
        'mei-fig1.jpg', [0, 0.655, 0.495, 0.975], '*Troodontid* · _Mei long_ IVPP V12733 · Xu & Norell 2004 Fig 1c', [0, 1, 2, 3])),
      at([812, 124, 764, 322], pair('sil-tianyuraptor.svg', '_Tianyuraptor_, a close relative · Emily Willoughby, PhyloPic, CC BY-SA',
        'zhen-fig1.jpg', null, '*Dromaeosaurid* · _Zhenyuanlong_ JPM-0008 · Lü & Brusatte 2015 Fig 1', [1, 2, 3])),
      at([24, 464, 764, 322], pair('sil-citipati.svg', '_Citipati_, another oviraptorid · Emily Willoughby, PhyloPic, CC BY-SA',
        'bi-fig1.jpg', [0, 0, 0.485, 0.512], '*Oviraptorosaur* · oviraptorid LDNHMF2008 on its eggs · Bi et al. 2021 Fig 1a', [2, 3])),
      at([812, 464, 764, 322], pair('sil-archaeopteryx.svg', '_Archaeopteryx_ · Scott Hartman, PhyloPic, CC0',
        'arch-fig1.jpg', [0, 0.17, 0.8, 0.63], '*Avialan* · _Archaeopteryx_ FMNH PA 830 · O\'Connor et al. 2025 Fig 1a', [3]))
    ]),

    slide('friends', 'And friends', 2, 2, 'Pennaraptora', 'And friends', [
      at(LEFT, pair('sil-yi.svg', '_Yi qi_ · Emily Willoughby, PhyloPic, CC BY-SA',
        'yi-fig1.jpg', [0, 0.513, 1, 0.80], '*Scansoriopterygid* · _Yi qi_ STM 31-2 · Xu et al. 2015 Fig 1b', [0], { stack: true, silW: 0.42 })),
      at(RIGHT, pic([V('vel-fig10.jpg', '*Dromaeosaurid* · _Velociraptor_ cast MUST SN1140/BM and reconstruction · Bindellini et al. 2025 Fig 10', 0)]))
    ]),

    /* ---------------------------------------------------------- 2 phylogeny */
    partTitle('p-phylo', 'Phylogeny'),

    slide('trees', 'Three trees', 1, 5, 'Which group is closest to birds?', 'Three trees', [
      at([24, 124, 1552, 200], { kind: 'quotes', cols: 3, size: 24, cards: [{ q: 'xia-shift', at: 0 }, { q: 'bru-poly', at: 1 }, { q: 'pei-deino', at: 2 }] }),
      at([24, 346, 500, 440], pic([V('xia-fig4.jpg', '_Archaeopteryx_ with deinonychosaurs · Xu et al. 2011 Fig 4', 0)], [0, 1, 2])),
      at([550, 346, 500, 440], pic([V('bru-fig1.jpg', 'Troodontidae, Dromaeosauridae, Avialae unresolved · Brusatte et al. 2014 Fig 1', 1, [0, 0.6, 1, 1])], [1, 2])),
      at([1076, 346, 500, 440], pic([V('pei-fig1.jpg', 'Anchiornithinae at the base of Avialae · Pei et al. 2020 Fig 1', 2, [0, 0.12, 1, 0.66])], [2]))
    ]),

    slide('support', 'Support', 1, 4, 'Which group is closest to birds?', 'Support', [
      at(LEFT, { kind: 'quotes', cols: 1, size: 24, cards: [{ q: 'xia-boot', at: 0 }, { q: 'pei-support', at: 1 }, { q: 'har-step', at: 2 }] }),
      at([812, 200, 764, 500], facts([
        ['< 50%', 'bootstrap for _Archaeopteryx_ in Deinonychosauria', 0],
        ['1–2', 'Bremer support for most paravian nodes', 1],
        ['1 step', 'between several paravian trees', 2]]))
    ]),

    line('recode', 'Recoding', 1, 4, 'Which group is closest to birds?', 'Recoding', {
      claim: [['agn-cons', 0], ['agn-recode', 1], ['agn-optnot', 2]],
      chips: [['1', 'group rescored: unenlagiids', 1], ['6', 'groups left in one polytomy at the base of Pennaraptora', 1]],
      views: [V('agn19-fig2.jpg', 'Five published paravian trees · Agnolín et al. 2019 Fig 2', 0),
        V('agn19-fig8.jpg', 'The TWiG matrix with unenlagiids rescored · Agnolín et al. 2019 Fig 8', 1)]
    }),

    slide('reuse', 'Shared matrices', 2, 3, 'Which group is closest to birds?', 'Shared matrices', [
      at(FULL, { kind: 'quotes', cols: 1, size: 32, cards: [{ q: 'har-reuse', at: 0 }, { q: 'har-notall', at: 1 }] })
    ]),

    line('eggtree', 'Egg characters', 1, 4, 'Which group is closest to birds?', 'Egg characters', {
      claim: [['zel-cong', 0], ['zel-assume', 2]],
      chips: [['7', 'taxa', 1], ['12', 'egg and nest characters', 1], ['0', 'skeletal characters', 1]],
      views: [V('zel-tf2.jpg', 'Egg tree: _Citipati_, _Troodon_, then the guineafowl _Numida_ · Zelenitsky & Therrien 2008 Text-fig 2', 0),
        V('zel-tf1.jpg', 'Clutch layouts coded: massed, single layer, ring · Zelenitsky & Therrien 2008 Text-fig 1', 2)]
    }),

    /* ---------------------------------------------------------- 3 behavior */
    partTitle('p-behave', 'Behavior'),

    versus('sleep', 'Sleep posture', 1, 4, 'How did they rest?', 'Sleep posture', {
      left: [['xn-sleep', 0]], lviews: [V('mei-fig1.jpg', '_Mei long_ IVPP V12733, photo and drawing · Xu & Norell 2004 Fig 1c, d', 0, [0, 0.655, 1, 0.975])],
      right: [['gao-mirror', 1], ['gao-limit', 2]], rviews: [V('mei2-fig1.jpg', '_Mei long_, second specimen · Gao et al. 2012 Fig 1', 1, [0, 0, 1, 0.5])],
      last: 2
    }),

    line('herd', 'Bonebed', 1, 4, 'Did they live in groups?', 'Bonebed', {
      claim: [['fun-greg', 0], ['fun-unclear', 2]],
      chips: [['1', 'species: _Avimimus_', 1], ['17 of 33', 'tibiotarsi fused to the ankle: adults', 1], ['1 of 33', 'tibiae under 80% of the largest', 2]],
      views: [V('fun-fig2.jpg', 'The _Avimimus_ bonebed, Nemegt Formation · Funston et al. 2016 Fig 2', 0),
        V('fun-fig7.jpg', 'Tibiotarsi by length: fused A–L, unfused M–W · Funston et al. 2016 Fig 7', 1)]
    }),

    line('solitary', 'Solitary hunters', 1, 4, 'Did they live in groups?', 'Solitary hunters', {
      claim: [['rb-null', 0], ['rb-none', 1], ['rb-part', 2]],
      chips: [['4', '_Deinonychus_ with one _Tenontosaurus_ at the type quarry, YPM 64-75', 1], ['4 / 17', 'Komodo dragons at one kill: average, most seen', 2]],
      views: [V('rb07-fig5.jpg', 'A _Deinonychus_ feeding mob, drawing signed BTR · Roach & Brinkman 2007 Fig 5', 0),
        V('rb07-fig1.jpg', 'YPM 64-75: _Deinonychus_ and _Tenontosaurus_ bones · Roach & Brinkman 2007 Fig 1', 1)]
    }),

    line('tracks', 'Trackways', 1, 4, 'Did they live in groups?', 'Trackways', {
      claim: [['li-group', 0], ['li-single', 2], ['rb-shore', 3]],
      chips: [['6', 'parallel trackways on one bedding plane, none overlapping', 1], ['< 1 stride', 'between neighboring trackways', 1],
        ['6.1 or 4.6 km/h', 'one trackway\'s speed, if the maker was a dromaeosaurid or a troodontid (Tsukiji et al. 2021)', 2]],
      views: [V('li08-fig3.jpg', 'Six _Dromaeopodus_ trackways, D1–D6, all heading one way · Li et al. 2008 Fig 3', 0),
        V('li08-fig2.jpg', 'Two-toed prints: digit II held off the ground · Li et al. 2008 Fig 2', 1, [0, 0.012, 1, 0.975]),
        V('tsu21-fig5.jpg', '_Velociraptorichnus_ print: photo, height map, outline · Tsukiji et al. 2021 Fig 5', 2),
        V('rb07-fig6.jpg', 'Mount Tom theropod trackways, Massachusetts (Ostrom 1972) · Roach & Brinkman 2007 Fig 6', 3)]
    }),

    line('pack', 'Pack hunting', 1, 5, 'Did they live in groups?', 'Pack hunting', {
      claim: [['fre-diff', 0], ['fre-not', 1], ['fre-utah', 3]],
      chips: [['10 + 10', 'teeth, small and large, from two sites', 2], ['≈ 28%', 'of the identified _Deinonychus_ material at each site, sampled', 2], ['2', '_Tenontosaurus_ individuals', 2], ['3', '_Utahraptor_ at one site: adult, juvenile, baby', 3]],
      views: [V('fre-fig2.jpg', 'Carbon isotopes by tooth size: _Deinonychus_ (left), crocodiles (right) · Frederickson et al. 2020 Fig 2', 0)]
    }),

    slide('display', 'Display', 1, 4, 'What were tails and feathers for?', 'Display', [
      at(LEFT, { kind: 'quotes', cols: 1, size: 24, cards: [{ q: 'per-display', at: 0 }, { q: 'li12-tail', at: 2 }, { q: 'cla-orn', at: 3 }] }),
      at(RIGHT, pic([
        V('per-fig11.jpg', '_Ajancingenia_ displaying, painting by Sydney Mohr · Persons et al. 2014 Fig 11', 0),
        V('li-fig4.jpg', '_Anchiornis_ colors from melanosomes · Li et al. 2010 Fig 4', 1),
        V('li12-fig4.jpg', '_Microraptor_, color from melanosomes of BMNHC PH881 · Li et al. 2012 Fig 4', 2),
        V('cla-fig6.jpg', '_Plumadraco_, restoration by Ville Sinkkonen · Clark et al. 2026 Fig 6E', 3, [0.79, 0, 1, 1])
      ]))
    ]),

    line('diet', 'Troodontid diet', 1, 5, 'What did troodontids eat?', 'Troodontid diet', {
      claim: [['fan-troodon', 0], ['fan-pred', 2]],
      chips: [['1', 'specimen with gut contents, _Jinfengopteryx_', 1], ['5', 'troodontid individuals in the isotope study', 1], ['0', 'suspected pellets found with a skeleton', 1]],
      views: [V('fan-fig7.jpg', 'Every line on troodontid diet: green plants/omnivory, red meat, grey undecided · Fan et al. 2026 Fig 7', 0),
        V('fan-fig7.jpg', 'Teeth, skull and limb lines · Fan et al. 2026 Fig 7', 2, [0, 0.27, 0.9, 0.9])]
    }),

    /* ---------------------------------------------------------- 4 reproduction */
    partTitle('p-repro', 'Reproduction'),

    line('nests', 'Adults on nests', 1, 4, 'Did they brood their eggs?', 'Adults on nests', {
      claim: [['cla-evoke', 0], ['cla-heat', 3]],
      chips: [['4 of 17', 'adult oviraptorids from the Djadokhta sandstones found on nests, before 1996', 1], ['4', 'oviraptorid genera found on nests by 2012', 2], ['0', 'embryos in these nests', 2]],
      views: [V('cla99-fig13.jpg', 'Reconstruction on the nest · Clark et al. 1999 Fig 13', 0),
        V('cla99-fig1.jpg', '_Citipati_ IGM 100/979 on its nest · Clark et al. 1999 Fig 1', 1),
        V('fan12-fig3.jpg', '_Nemegtomaia_ MPC-D 107/15 on its nest, with restoration (E) · Fanti et al. 2012 Fig 3', 2)]
    }),

    line('brood', 'Adult on eggs', 1, 4, 'Did they brood their eggs?', 'Adult on eggs', {
      claim: [['bi-brood', 0]],
      chips: [['1', 'adult, no skull', 1], ['≥ 24', 'eggs in three rings, some with embryos', 1]],
      views: [V('bi-fig1.jpg', 'Skeletal restoration on the clutch · Bi et al. 2021 Fig 1c', 0, [0.045, 0.546, 1, 1]),
        V('bi-fig1.jpg', 'Oviraptorid on its clutch, LDNHMF2008 · Bi et al. 2021 Fig 1a', 1, [0, 0, 0.485, 0.512])]
    }),

    versus('parent', 'Which parent', 1, 5, 'Did they brood their eggs?', 'Which parent', {
      left: [['var08-pat', 0], ['var08-hist', 1]], lviews: [V('var08-fig1.jpg', 'Clutch volume vs body mass by care type; red diamonds: _Troodon_, _Oviraptor_, _Citipati_ · Varricchio et al. 2008 Fig 1B', 0, [0.395, 0, 1, 1])],
      right: [['bir-same', 2], ['bir-not', 3]], rviews: [V('bir13-fig1.jpg', '(a) paternal blue, maternal yellow, biparental squares; (b) altricial blue, precocial yellow; diamonds: dinosaurs · Birchard et al. 2013 Fig 1', 2, [0, 0, 1, 0.955])]
    }),

    line('laying', 'Eggs inside', 2, 3, 'Did they brood their eggs?', 'Eggs inside', {
      claim: [['jin-extrude', 1]],
      chips: [['1', 'adult with eggs inside and beside it, ZMNH M8829', 0]],
      views: [V('jin-fig1.jpg', 'ZMNH M8829 · Jin et al. 2020 Fig 1', 0), V('jin-fig7.jpg', 'Drowned cow, Yellowstone River · Jin et al. 2020 Fig 7', 1)]
    }),

    line('pores', 'Eggshell pores', 1, 4, 'Did they brood their eggs?', 'Eggshell pores', {
      claim: [['tan15-open', 0], ['tan15-buried', 2]],
      chips: [['127', 'living birds and crocodiles', 1], ['29', 'fossil egg types', 1], ['0.513 / 0.487', 'open / covered for oviraptorosaur eggs, phylogenetic method', 1]],
      views: [V('tan15-fig3.jpg', 'Pores vs egg mass: covered nests above, open below · Tanaka et al. 2015 Fig 3', 0),
        V('tan15-fig6.jpg', 'Call for each fossil as a parameter changes · Tanaka et al. 2015 Fig 6', 1)]
    }),

    line('color', 'Egg color', 1, 3, 'Did they brood their eggs?', 'Egg color', {
      claim: [['wie-first', 0], ['wie-olive', 1]],
      chips: [['3', 'eggshells, three basins', 1], ['1', 'sediment control', 1]],
      views: [V('wie-fig1.jpg', 'Clutch and reconstructed open nest · Wiemann et al. 2017 Fig 1C, D', 0, [0, 0.53, 1, 1]),
        V('wie-fig4.jpg', 'Fossil pigment levels among bird eggs · Wiemann et al. 2017 Fig 4', 1)]
    }),

    line('clutch', 'Clutch size', 1, 3, 'Did they brood their eggs?', 'Clutch size', {
      claim: [['tan18-sat', 0]],
      chips: [['40', 'clutches', 1], ['3', 'giant _Macroelongatoolithus_ clutches', 1]],
      views: [V('tan18-fig2.jpg', 'Painting by Masato Hattori · Tanaka et al. 2018 Fig 2', 0),
        V('tan18-fig1.jpg', 'Small, medium and giant clutches · Tanaka et al. 2018 Fig 1a–c', 1, [0, 0, 1, 0.23])]
    }),

    line('incub', 'Incubation time', 1, 4, 'Did they brood their eggs?', 'Incubation time', {
      claim: [['var18-74', 0], ['var18-buried', 2]],
      chips: [['1', 'tooth, embryo MOR 246-11', 1], ['39', 'daily growth lines, 8 of them estimated', 1], ['47%', 'of incubation before teeth form: crocodile timing', 1]],
      views: [V('var18-fig1.jpg', 'Buried to exposed eggs, artwork by Danny Anduza · Varricchio et al. 2018 Fig 1D', 0, [0.355, 0.395, 1, 0.97]),
        V('var18-fig1.jpg', 'Tooth of embryo MOR 246-11, section · Varricchio et al. 2018 Fig 1A', 1, [0, 0, 1, 0.37]),
        V('var18-fig1.jpg', 'Buried to exposed eggs, artwork by Danny Anduza · Varricchio et al. 2018 Fig 1D', 2, [0.355, 0.395, 1, 0.97])]
    }),

    line('embryo', 'Embryos', 1, 3, 'Did they brood their eggs?', 'Embryos', {
      claim: [['var02-stage', 0], ['var02-proof', 1]],
      chips: [['16', 'eggs in clutch MOR 246', 1], ['11', 'with bone', 1]],
      views: [V('var02-fig1.jpg', 'Embryo leg in egg MOR 246-11 · Varricchio et al. 2002 Fig 1', 0)]
    }),

    versus('hatch', 'Hatching order', 1, 5, 'Did they brood their eggs?', 'Hatching order', {
      left: [['bi-async', 0]], lviews: [V('bi-fig4.jpg', 'Embryos at different stages · Bi et al. 2021 Fig 4', 0)],
      right: [['yan-excl', 1], ['yan-unique', 2]], rviews: [V('yan-fig9.jpg', 'Incubation by hatching mode · Yang et al. 2019 Fig 9', 1)]
    }),

    line('burial', 'Partly buried', 1, 3, 'Did they brood their eggs?', 'Partly buried', {
      claim: [['hog-weak', 0]],
      views: [V('hog-fig3.jpg', 'Guarding, warming through sediment, sitting on part-buried eggs, sitting on open eggs · Hogan & Varricchio 2023 Fig 3', 0),
        V('hog-fig1.jpg', 'Partly buried clutches · Hogan & Varricchio 2023 Fig 1', 1)]
    }),

    line('stages', 'Five stages', 2, 3, 'Did they brood their eggs?', 'Five stages', {
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
          { label: 'Tooth · Varricchio 2018', cells: { 'Eggs warmed': '74 days: between reptile and bird' } },
          { label: 'Embryos · Yang 2019', cells: { 'Eggs warmed': '"can probably be excluded"', Hatching: 'asynchronous' } }
        ],
        focus: [{ at: 1, col: 'Eggs warmed', label: 'Same question, three answers' }]
      })
    ], 1),

    /* ---------------------------------------------------------- break */
    { id: 'break', title: 'Break', min: 0, tier: 1, builds: [{}], items: [{ kind: 'title', box: [100, 200, 1400, 500], text: 'Break' }] },

    /* ---------------------------------------------------------- 5 feathers */
    partTitle('p-feathers', 'Feathers'),

    line('fstages', 'Feather stages', 1, 4, 'When did feathers appear?', 'Feather stages', {
      claim: [['xb-stages', 0], ['xb-psitt', 1], ['xb-unknown', 2]],
      chips: [['3', 'ornithischians with filaments: _Tianyulong_, _Kulindadromeus_, _Psittacosaurus_', 1], ['≈ 245 Ma or Early Jurassic', 'the two proposed starts for feathers', 2]],
      views: [V('xb25-fig1.jpg', 'Filaments to vaned feathers, from _Tianyulong_ to _Confuciusornis_ · Xu & Barrett 2025 Fig 1', 0),
        V('xb25-fig2.jpg', 'Feather traits by clade; ? marks uncertain · Xu & Barrett 2025 Fig 2', 1)]
    }),

    line('nofly', 'Feathered arms', 1, 4, 'What were vaned feathers for?', 'Feathered arms', {
      claim: [['tal-lift', 0], ['dec16-invest', 1], ['dec16-display', 2]],
      chips: [['5 kg', 'one model _Caudipteryx_, running at 8 m/s', 0], ['0', 'flapping strokes modelled', 0], ['3', 'non-paravians with vaned arm feathers: _Caudipteryx_, _Similicaudipteryx_, _Yixianosaurus_', 1]],
      views: [V('caud-fig7.jpg', 'Robot with real feathered wings · Talori et al. 2018 Fig 7a', 0, [0, 0, 0.655, 1]),
        V('caud-fig1.jpg', '_Caudipteryx_ IVPP V12430 · Talori et al. 2018 Fig 1', 1)]
    }),

    line('bigwings', 'Large and winged', 1, 3, 'What were vaned feathers for?', 'Large and winged', {
      claim: [['lu15-large', 0]],
      chips: [['≈ 1.65 m', 'body length', 1], ['0.48', 'arm / leg, shortest of any Liaoning dromaeosaurid', 1], ['≈ 10 + 20', 'primaries and secondaries, some asymmetric', 1]],
      views: [V('zhen-fig1.jpg', '_Zhenyuanlong suni_ JPM-0008 · Lü & Brusatte 2015 Fig 1', 0)]
    }),

    line('asym', 'Feather shape', 1, 4, 'What were vaned feathers for?', 'Feather shape', {
      claim: [['xu17-asym', 0], ['kia-asym', 2], ['kia-prim', 3]],
      chips: [['9–11', 'primaries in every living flier', 3], ['346', 'living species, all orders', 3]],
      views: [V('xu17-fig7.jpg', '_Jianianhualong_, life reconstruction by Julius T. Csotonyi · Xu et al. 2017 Fig 7', 0),
        V('xu17-fig5.jpg', 'Asymmetric tail feather, _Jianianhualong_ DLXH 1218 · Xu et al. 2017 Fig 5c, d', 1, [0, 0, 1, 0.42]),
        V('kia-fig2.jpg', 'Flight feathers: flying birds, flightless birds, fossils · Kiat & O\'Connor 2024 Fig 2B', 2, [0, 0.53, 1, 1]),
        V('kia-fig5.jpg', 'Living birds and fossils · Kiat & O\'Connor 2024 Fig 5', 3)]
    }),

    /* ---------------------------------------------------------- 6 flight */
    partTitle('p-flight', 'Flight'),

    line('membrane', 'Membrane wings', 1, 4, 'How many times did flight evolve?', 'Membrane wings', {
      claim: [['dec20-yi', 2]],
      chips: [['2', 'membrane-winged species: _Yi_ and _Ambopteryx_', 1]],
      views: [V('yi-fig3.jpg', 'Skeletal restoration of _Yi qi_ · Xu et al. 2015 Fig 3', 0, [0.47, 0, 1, 0.245]),
        V('yi-fig3.jpg', 'One of two proposed wings for _Yi_, from above · Xu et al. 2015 Fig 3', 1, [0.565, 0.295, 1, 0.572]),
        V('dec20-fig6.jpg', 'Wing loading: gliders and _Yi_ / _Ambopteryx_ models · Dececchi et al. 2020 Fig 6', 2)]
    }),

    line('wair', 'Flapping on the ground', 1, 4, 'How many times did flight evolve?', 'Flapping on the ground', {
      claim: [['dec16-none', 0], ['dec16-wair', 1]],
      chips: [['45', 'specimens, 24 non-avian species', 1], ['10%', 'of body mass as wing muscle, assumed', 1]],
      views: [V('dec16-fig2.jpg', 'Body weight supported by flapping up a slope, along the tree · Dececchi et al. 2016 Fig 2', 0, [0, 0, 1, 0.62])]
    }),

    line('thresh', 'Flight thresholds', 1, 4, 'How many times did flight evolve?', 'Flight thresholds', {
      claim: [['pei-multi', 0], ['pei-near', 1]],
      chips: [['43', 'vane-feathered species', 1], ['1.6', 'maximum lift coefficient, assumed', 1], ['3', 'body mass and wing estimates for _Microraptor_', 1]],
      views: [V('pei-fig2.jpg', 'Green: passes wing loading and lift thresholds · Pei et al. 2020 Fig 2', 0),
        V('pei-fig4.jpg', 'From fail all to pass all · Pei et al. 2020 Fig 4', 1)]
    }),

    line('feathcount', 'Feather counts', 1, 3, 'How many times did flight evolve?', 'Feather counts', {
      claim: [['kia-anch', 0], ['kia-single', 1]],
      chips: [['35', 'Mesozoic species, 66 specimens', 0]],
      views: [V('kia-fig2.jpg', 'Primary vane asymmetry on the tree; flying vs flightless birds · Kiat & O\'Connor 2024 Fig 2A', 0, [0, 0, 1, 0.455])]
    }),

    line('arms', 'Arm length', 1, 4, 'How many times did flight evolve?', 'Arm length', {
      claim: [['har-flightless', 0], ['har-parallel', 2]],
      chips: [['0.56', '_Hesperornithoides_ humerus / femur', 1], ['0.96–1.04', '_Anchiornis_', 1], ['1.12–1.24', '_Archaeopteryx_', 1]],
      views: [V('har-fig18.jpg', 'Red: possibly flying taxa, nested among flightless ones (black) · Hartman et al. 2019 Fig 18', 0)]
    }),

    line('shoulder', 'Shoulder girdle', 2, 3, 'How many times did flight evolve?', 'Shoulder girdle', {
      claim: [['wu-motion', 0]],
      views: [V('wu-fig1.jpg', 'Coracoid green, scapula yellow, furcula red · Wu et al. 2024 Fig 1', 0)]
    }),

    slide('origins', 'How many origins', 1, 5, 'How many times did flight evolve?', 'How many origins', [
      at([24, 124, 1552, 210], { kind: 'quotes', cols: 3, size: 24, cards: [{ q: 'pei-multi', at: 0 }, { q: 'kia-single', at: 1 }, { q: 'har-parallel', at: 2 }] }),
      at([24, 356, 500, 430], pic([V('pei-fig2.jpg', 'Wing loading and lift · Pei et al. 2020 Fig 2', 0)], [0, 1, 2])),
      at([550, 356, 500, 430], pic([V('kia-fig2.jpg', 'Feather shape · Kiat & O\'Connor 2024 Fig 2A', 1, [0, 0, 1, 0.455])], [1, 2])),
      at([1076, 356, 500, 430], pic([V('har-fig18.jpg', 'Arm length on the tree · Hartman et al. 2019 Fig 18', 2)], [2]))
    ]),

    line('tie', 'Equal length', 1, 3, 'How many times did flight evolve?', 'Equal length', {
      claim: [['pei-same', 0]],
      chips: [['1 + 6–11', 'one origin at Paraves, then 6 to 11 losses', 1], ['≥ 3', 'origins: birds and two dromaeosaurid lines', 1], ['same', 'tree length for both', 1]],
      views: [V('pei-fig2.jpg', 'Pei et al. 2020 Fig 2', 0)]
    }),

    line('arch', 'Wing bones', 1, 4, 'How many times did flight evolve?', 'Wing bones', {
      claim: [['voe-flap', 0], ['voe-stroke', 2]],
      chips: [['3', '_Archaeopteryx_ specimens', 1], ['69', 'comparison species', 1]],
      views: [V('voe-fig1.jpg', 'Humerus and ulna cross-sections, three _Archaeopteryx_ · Voeten et al. 2018 Fig 1', 0),
        V('voe-fig2.jpg', 'Stars: _Archaeopteryx_ among flapping birds · Voeten et al. 2018 Fig 2', 1, [0, 0, 1, 0.5])]
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

    line('brainvol', 'Brain volume', 1, 4, 'When did the bird brain evolve?', 'Brain volume', {
      claim: [['bal-gen', 0], ['bal-ready', 1]],
      chips: [['1', 'endocast per species', 1], ['femur', 'length for body mass', 1]],
      views: [V('bal-fig1.jpg', 'Endocasts: _Citipati_, troodontid, _Archaeopteryx_, ostrich, woodpecker · Balanoff et al. 2013 Fig 1', 0),
        V('bal-fig2.jpg', 'Brain volume vs body mass; green: _Archaeopteryx_ · Balanoff et al. 2013 Fig 2', 1)]
    }),

    line('brainshape', 'Brain shape', 1, 3, 'When did the bird brain evolve?', 'Brain shape', {
      claim: [['tor-shape', 0]],
      views: [V('tor-fig3.jpg', 'Four stages of brain shape · Torres et al. 2021 Fig 3', 0)]
    }),

    versus('wulst', 'Wulst', 2, 3, 'When did the bird brain evolve?', 'Wulst', {
      left: [['bal-wulst', 0]], lviews: [V('bal-fig1.jpg', '_Archaeopteryx_ endocast (c) · Balanoff et al. 2013 Fig 1', 0, [0.785, 0.395, 1, 0.585])],
      right: [['tor-artefact', 1]], rviews: [V('tor-fig3.jpg', 'Torres et al. 2021 Fig 3', 1)]
    }),

    line('shrink', 'Shrinking', 1, 4, 'How did the bird body plan arise?', 'Shrinking', {
      claim: [['lee-trend', 0]],
      chips: [['1549', 'characters, 120 species', 1], ['femur', 'length as the size measure', 1], ['≈ 163 → 0.8 kg', 'tetanuran ancestor to bird ancestor', 1]],
      views: [V('lee-fig2.jpg', 'Femur length along the bird stem, with body mass · Lee et al. 2014 Fig 2B', 0, [0.46, 0, 1, 1]),
        V('lee-fig3.jpg', 'Rate of skeletal change; pink: bird stem · Lee et al. 2014 Fig 3', 1)]
    }),

    line('rates', 'Rates', 1, 4, 'How did the bird body plan arise?', 'Rates', {
      claim: [['bru-jump', 0]],
      chips: [['150', 'coelurosaurs, 853 characters', 1], ['99,999', 'equally short trees', 1], ['100', 'dating runs for the rates', 1]],
      views: [V('bru-fig2.jpg', 'Rates on the tree: red high, blue low · Brusatte et al. 2014 Fig 2', 0)]
    }),

    line('limbrates', 'Limb rates', 1, 4, 'How did the bird body plan arise?', 'Limb rates', {
      claim: [['wz-low', 0], ['wz-bias', 2]],
      chips: [['109', 'taxa with all six limb bones complete', 1], ['55 / 17 / 37', 'avialans / other paravians / other theropods', 1], ['4', 'trees tried, moving _Anchiornis_ and scansoriopterygids', 1]],
      views: [V('wz23-fig4.jpg', 'Limb rates on the tree: red fast, blue slow; Avialae at top · Wang & Zhou 2023 Fig 4a', 0, [0, 0, 0.62, 1])]
    }),

    versus('bias', 'Oversampled characters', 1, 4, 'How did the bird body plan arise?', 'Oversampled characters', {
      left: [['lee-bias', 0]], lviews: [V('lee-fig3.jpg', 'Bird stem fast · Lee et al. 2014 Fig 3', 0)],
      right: [['bru-artifact', 1]], rviews: [V('bru-fig2.jpg', 'Red: high rates, tyrannosaurs and birds among them · Brusatte et al. 2014 Fig 2', 1)]
    }),

    line('mass', 'Ancestral size', 2, 3, 'How did the bird body plan arise?', 'Ancestral size', {
      claim: [['tor-mass', 0]],
      chips: [['10.9 kg', 'with only _Archaeopteryx_ as a stem bird', 0], ['7.7 kg', 'with well-placed stem birds', 0], ['2.4 kg', 'with every stem bird', 0]],
      views: [V('tor-fig5.jpg', 'Ancestral body mass under three samples · Torres et al. 2021 Fig 5', 0)]
    }),

    /* ---------------------------------------------------------- end */
    partTitle('p-end', 'Synthesis'),

    {
      id: 'matrix', title: 'Questions and evidence', min: 6, tier: 1, builds: [{}, {}, {}],
      items: [head('Five questions', 'Questions and evidence'), {
        kind: 'matrix', box: [24, 124, 1552, 662], labelW: 230, cellsAt: 0, labelsAt: 0,
        cols: ['Skeletons and trees', 'Eggs and nests', 'Feathers', 'Bone, teeth, brain', 'Tracks', 'Physics models'],
        rows: [
          { label: 'Closest to birds', cells: { 'Skeletons and trees': '3 trees, Bremer 1–2', 'Eggs and nests': 'egg tree: troodontids nearer birds' } },
          { label: 'Brooding', cells: { 'Skeletons and trees': 'adults on clutches', 'Eggs and nests': 'pores, color, clutch shape, embryos', 'Bone, teeth, brain': '74-day tooth, no medullary bone' } },
          { label: 'Flight', cells: { 'Skeletons and trees': 'arm/leg ratios', Feathers: 'number and asymmetry', 'Bone, teeth, brain': 'wing-bone walls', 'Physics models': 'wing loading, WAIR' } },
          { label: 'Bird brain', cells: { 'Bone, teeth, brain': 'endocast volume and shape', 'Skeletons and trees': 'size and rates on the stem' } },
          { label: 'Groups and diet', cells: { 'Skeletons and trees': 'one bonebed, sleeping posture', 'Bone, teeth, brain': 'tooth isotopes, microwear', Tracks: 'six parallel trackways' } }
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
