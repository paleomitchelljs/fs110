/* Every word on screen. Edit wording here; nothing in this file touches layout.
 *
 * Order: where spinosaurids sit among theropods; the species one at a time, moving up the
 * tree toward Spinosaurus; then Spinosaurus in historical order, specimens and studies
 * together, by year. Each kind of evidence gets one slide, so the argument does not repeat:
 * floating and rolling appear once (Henderson), and the composite skeleton is taken apart
 * once (Ibrahim Fig. S3).
 *
 * Labels say the plain thing. Use the paper's own term and a number. Show the published
 * figure rather than redrawing it. A caption is the citation, plus which specimens a
 * skeleton shows. Nothing on a slide repeats what sits next to it. Where evidence is
 * ambiguous, give no verdict; the readme keeps the papers' wording for saying it aloud.
 * From the buoyancy slide on, a header card is a topic (role: null, no icon) or the claim
 * of the paper named beside it, not a question. Brusatte's quoted question is the exception.
 *
 * Sources are the papers in spinos/papers/ (see ../notes/ and ../readme.md).
 *
 * LEVELS. tier: 1 = condensed, 2 = expanded, 3 = full.
 * min is the minutes the clock counts for a segment.
 *
 * Text style:  _Name_ italic   *word* accent
 */
(function (root) {
  'use strict';

  const SURE = { box: [330, 744, 940, 104] };
  const sureItem = (id, at) => Object.assign({ kind: 'sure', id, at }, SURE);

  /* S('name.jpg', caption): a picture from img/ with its size from dims.js.
   * extra adds a label, a role icon, a crop [l, t, r, b], or a build number. */
  const S = (name, cap, extra) => Object.assign({ src: 'img/' + name, w: window.DIMS[name][0], h: window.DIMS[name][1], cap: cap || '' }, extra || {});
  const F = S;

  /* A figure with one build per zone. A vote bar, if any, is one more build. */
  const figSeg = (id, title, tier, min, fig, sure) => {
    const builds = [{}].concat(fig.zones.map(() => ({})));
    const main = Object.assign({ kind: 'fig', box: [0, 100, 1600, 690], imgBox: [40, 8, 1010, sure ? 624 : 672] }, fig);
    const items = [main];
    if (sure) { builds.push({ rail: 'sure' }); items.push(sureItem(sure, builds.length - 1)); }
    return { id, title, min, tier, builds, items };
  };

  /* A plain slide: head, pictures, foot. The vote bar, if any, is one more build. */
  const plateSeg = (id, title, tier, min, def, sure) => {
    const stages = Math.max(0, ...def.panels.map((p) => p.at || 0), ...(def.foot || []).map((c) => c.at || 0));
    const builds = [];
    for (let i = 0; i <= stages; i++) builds.push({});
    const items = [Object.assign({ kind: 'plate', box: [0, 100, 1600, sure ? 636 : 690] }, def)];
    if (sure) { builds.push({ rail: 'sure' }); items.push(sureItem(sure, builds.length - 1)); }
    return { id, title, min, tier, builds, items };
  };

  /* A part card. Its number is worked out at the current level (see parts/intro.js). */
  const partTitle = (id, text, tier) => ({ id, title: text.replace(/_/g, ''), min: 0.3, tier: tier || 1, builds: [{}], items: [{ kind: 'title', box: [100, 200, 1400, 500], n: true, text }] });

  const SERENO1A = 'Red: holotype BSPG 1912 VIII 19. Blue: neotype FSAC-KK 11888. Yellow: referred · Sereno et al. 2022';
  const SPINO_TIPS = [0.165, 0.7845, 0.18, 0.0187]; // Irritator and Baryonyx on the Gates tree

  const segments = [
    /* ---------------------------------------------------------- cover */
    {
      id: 'title', title: 'Spinosaurs', min: 1, tier: 1, builds: [{}],
      items: [{ kind: 'cover', box: [0, 0, 1600, 790], pic: 'img/bru21-fig1.jpg', title: 'Spinosaurs' }]
    },

    /* ---------------------------------------------------------- among theropods */
    figSeg('theropods', 'Spinosaurids among theropods', 1, 3.5, Object.assign(F('gat16-fig2.jpg', 'Theropods; red = ornamented · Gates et al. 2016'), {
      imgBox: [40, 8, 690, 672], aside: [770, 130, 790, 420], pills: false, zones: [
        { label: 'Ceratosaurs', rect: [0.165, 0.8465, 0.32, 0.0855] },
        { label: 'Spinosaurids', rect: SPINO_TIPS },
        { label: 'Allosauroids', rect: [0.16, 0.6656, 0.26, 0.1024] },
        { label: 'Tyrannosauroids', rect: [0.16, 0.507, 0.335, 0.1579] },
        { label: 'Maniraptorans', rect: [0.07, 0.008, 0.425, 0.3792] },
        { label: 'Spinosaurids: two tips on this tree', rect: SPINO_TIPS }
      ]
    })),

    /* ---------------------------------------------------------- part: the species */
    partTitle('p-walk', 'Spinosaurids by branch'),

    figSeg('tree', 'Spinosaurid tree', 1, 2.5, Object.assign(F('ser26-fig5b.jpg', 'Sereno et al. 2026'), {
      zones: [
        { label: 'Jurassic to earliest Cretaceous: isolated teeth', rect: [0.115, 0.475, 0.41, 0.234] },
        { label: 'Baryonychinae', rect: [0.145, 0.154, 0.125, 0.457] },
        { label: 'Spinosaurinae', rect: [0.27, 0.02, 0.25, 0.59] },
        { label: 'Spinosaurini, to about 94.5 Mya', rect: [0.405, 0.02, 0.115, 0.435] }
      ]
    })),

    figSeg('tree2', 'A second spinosaurid tree', 2, 2, Object.assign(F('bar21-fig7.jpg', 'Barker et al. 2021'), {
      zones: [
        { label: 'Origin in Europe?', role: 'claim' },
        { label: '_Spinosaurus_ specimens as separate tips', rect: [0.56, 0.48, 0.44, 0.24], role: 'evidence' }
      ]
    })),

    plateSeg('ibero', '_Iberospinus_', 2, 1.5, {
      head: { name: '_Iberospinus natarioi_', facts: 'Portugal · early Barremian · Mateus & Estraviz-López 2022' },
      panels: [
        S('mat22-fig3.jpg', 'Dentary, ML 1190-1'),
        S('mat22-fig2.jpg', 'Red: ML 1190. Rest: Scott Hartman\'s drawing, no specimen named')
      ],
      foot: [{ text: 'Earlier referred to _Baryonyx_' }, { text: 'Single Meckelian foramen', role: 'evidence' }]
    }),

    plateSeg('baryonyx', '_Baryonyx_', 1, 3, {
      head: { name: '_Baryonyx walkeri_', facts: 'England · claw found by William Walker, 7 Jan 1983 · Charig & Milner 1986' },
      tall: S('cha97-front.jpg', 'John Sibbick · Charig & Milner 1997'),
      panels: [
        S('hh17-fig5d.jpg', 'Thumb claw, BMNH R9951 · Hone & Holtz 2017'),
        S('hh17-fig1.jpg', 'Drawing: Scott Hartman · Hone & Holtz 2017')
      ],
      foot: [{ text: 'One skeleton: the holotype BMNH R9951' }]
    }),

    plateSeg('stomach', 'Stomach contents', 1, 3.5, {
      head: { name: '_Baryonyx_ BMNH R9951', claim: 'How did it get fish?' }, side: true,
      panels: [S('cha97-fig47.jpg', 'A: from the rib cage. B: same horizon, not with the skeleton · Charig & Milner 1997', { label: 'Acid-etched _Lepidotes_ scales', role: 'evidence' })],
      foot: [
        { text: 'Bones of a young _Iguanodon_', role: 'evidence' },
        { text: '"crouched on the banks... or waded in the shallows"', role: 'claim' },
        { text: 'Claws for "gaffing," as grizzly bears do', role: 'else' }
      ]
    }, 'stomach'),

    plateSeg('wessex', '_Ceratosuchops_ and _Riparovenator_', 2, 1.5, {
      head: { name: '_Ceratosuchops_ and _Riparovenator_', facts: 'England · Barker et al. 2021' },
      panels: [S('bar21-fig1.jpg', 'White: recovered bones. Rear: _Ceratosuchops_. Front: _Riparovenator_')],
      foot: [{ text: 'Two baryonychines in one formation', role: 'evidence' }]
    }),

    plateSeg('suchomimus', '_Suchomimus_', 1, 2.5, {
      head: { name: '_Suchomimus tenerensis_', facts: 'Niger · about 110 Ma · Sereno et al. 1998' },
      panels: [S('ser22-fig1f.jpg', 'Red: holotype MNBH GAD500. Blue: MNBH GAD70. Yellow: other referred · Sereno et al. 2022')],
      foot: [{ text: 'Same animal as _Cristatusaurus_?', role: 'else' }]
    }),

    plateSeg('snout', 'Nerves in the snout', 2, 3, {
      head: { name: 'Pittet et al. 2026', claim: 'Sensitive snout: a sign of water?' },
      panels: [
        S('pit26-fig4.jpg', '_Cristatusaurus_ MNHN.F.GDF365', { label: 'Spinosaurid' }),
        S('pit26-fig19.jpg', '_Crocodylus_ TMM M-4980, _Gavialis_ MHNG S14.25', { label: 'Crocodilians', at: 1 }),
        S('pit26-fig18.jpg', '"Sue" FMNH PR2081, "Stan" BHI 3033', { label: '_Tyrannosaurus_', at: 2 })
      ]
    }),

    plateSeg('jaws', 'Teeth and jaws', 2, 2.5, {
      head: { name: 'Baryonychines and spinosaurines', facts: "D'Amore et al. 2024" },
      panels: [
        S('dam24-fig1.jpg', 'Orange: spinosaurines. Green: baryonychines'),
        S('dam24-fig5.jpg', 'Diagrams, no one specimen. Crown size from alveoli')
      ],
      foot: [
        { text: 'Quick strikes, deep punctures', role: 'evidence' },
        { text: '"no indication" of a fish-only diet', role: 'evidence' }
      ]
    }),

    plateSeg('conger', 'Pike conger', 3, 1.5, {
      head: { name: 'Vullo et al. 2016', claim: 'Jaws convergent with pike conger eels?' },
      panels: [S('vul16-fig1.jpg', 'Vullo et al. 2016')],
      foot: [{ text: 'Rosette, then a notch, then small teeth', role: 'evidence' }, { text: 'Sereno 2026: "could not be more different"', role: 'else' }]
    }),

    plateSeg('ichthyovenator', '_Ichthyovenator_', 2, 1.5, {
      head: { name: '_Ichthyovenator laosensis_', facts: 'Laos · Aptian · Allain et al. 2012' }, side: true,
      panels: [S('hh17-fig5b.jpg', 'MDS BK10-01 to 15 · Hone & Holtz 2017')],
      foot: [{ text: 'Spine over 3 × centrum height', role: 'evidence' }, { text: 'Baryonychine or spinosaurine?', role: 'else' }]
    }),

    plateSeg('irritator', '_Irritator_', 1, 3, {
      head: { name: '_Irritator challengeri_', facts: 'Brazil · Martill et al. 1996' },
      panels: [
        S('sal17-fig2.jpg', 'Holotype SMNS 58022 · Sales & Schultz 2017', { label: 'Most complete spinosaurid skull' }),
        S('sch20-fig1.jpg', 'SMNS 58022 · Schade et al. 2020', { crop: [0.18, 0, 0.92, 0.52], label: 'Inner ear: snout down about 45°', role: 'evidence' })
      ],
      foot: [{ text: 'Upper jaw artificially elongated', role: 'evidence' }, { text: 'First described as a maniraptoran' }]
    }),

    plateSeg('pterosaur', 'Tooth in a pterosaur neck', 1, 2, {
      head: { name: 'WDC-SFB-001', facts: 'Brazil · Buffetaut et al. 2004', claim: 'Predation or scavenging?' }, side: true,
      panels: [S('buf04-fig1.jpg', 'Buffetaut et al. 2004')],
      foot: [{ text: 'Tooth crosses the neural canal', role: 'evidence' }, { text: 'Neck still articulated, not digested', role: 'evidence' }]
    }),

    plateSeg('known', 'Bone and silhouette', 1, 2.5, {
      head: { name: '_Irritator_, _Angaturama_, _Oxalaia_', claim: 'How big, from how much?' },
      panels: [
        S('sal17-fig11.jpg', 'SMNS 58022, USP GP/2T-5, MN 6117-V. Black: inferred · Sales & Schultz 2017'),
        S('sal17-fig6.jpg', '_Oxalaia_ holotype MN 6117-V · Sales & Schultz 2017', { label: '12–14 m, 5–7 tons, from this' })
      ],
      foot: [{ text: '_Irritator_, _Angaturama_ holotypes both keep tooth Lm3: two individuals', role: 'evidence' }]
    }),

    /* ---------------------------------------------------------- part: Spinosaurus, by year */
    partTitle('p-lost', '_Spinosaurus_: the lost fossils'),

    plateSeg('stromer', 'Stromer 1915', 1, 4, {
      head: { name: '_Spinosaurus aegyptiacus_', facts: 'Holotype BSPG 1912 VIII 19 · Bahariya, Egypt · Markgraf 1912, Stromer 1915' },
      panels: [
        S('sto15-tafI.jpg', 'Tafel I · Stromer 1915'),
        S('sto15-tafII.jpg', 'Tafel II · Stromer 1915', { at: 1 })
      ],
      foot: [
        { text: 'Dentaries, teeth, 2 neck, 7 trunk, 2½ sacral, 1 tail vertebra' },
        { text: 'No hips, no limbs', at: 1 },
        { text: 'Spines to 165 cm', at: 1 }
      ]
    }),

    plateSeg('spinob', '"Spinosaurus B"', 1, 3, {
      head: { name: '"_Spinosaurus_ B"', facts: 'BSPG 1922 X 45 · Bahariya, Egypt · Stromer 1934', claim: 'Same animal as the holotype?' }, side: true,
      panels: [S('sto34-tafI.jpg', 'Tafel I · Stromer 1934')],
      foot: [
        { text: 'Overlap with holotype: two dorsal centra, teeth', role: 'evidence' },
        { text: 'Small limbs, large vertebrae: Stromer thought two individuals', role: 'else' }
      ]
    }),

    plateSeg('munich', 'Munich, 1944', 1, 2.5, {
      head: { name: 'BSPG 1912 VIII 19', facts: 'On the wall in Munich' }, side: true,
      panels: [S('hh17-fig2.jpg', 'Hone & Holtz 2017')],
      foot: [
        { text: 'British bombing raid, April 1944' },
        { text: 'Holotype and "_Spinosaurus_ B" both destroyed' },
        { text: 'Left: Stromer\'s plates, 2 photographs' }
      ]
    }),

    plateSeg('names', 'CMN 50791', 2, 2.5, {
      head: { name: 'CMN 50791', facts: 'Isolated neck vertebra · Kem Kem, Morocco' },
      panels: [
        S('eve15-fig1.jpg', 'Evers et al. 2015', { label: '2015: _Sigilmassasaurus_' }),
        S('kk-fig126.jpg', 'A–E: NMC 50791 · Ibrahim et al. 2020, ZooKeys', { label: '2020: _Spinosaurus_ cf. _aegyptiacus_', at: 1 })
      ],
      foot: [{ text: 'Russell 1996: holotype of _S. maroccanus_' }]
    }),

    plateSeg('v4047', 'Snout MSNM V4047', 1, 3, {
      head: { name: 'MSNM V4047', facts: 'Kem Kem, Morocco · Dal Sasso et al. 2005' },
      panels: [
        S('kk-fig123.jpg', 'A: MSNM V4047. B: BMNH 16420. C–E: MNHN SAM 124, Algeria · Ibrahim et al. 2020, ZooKeys'),
        S('ibrsm-figS6.jpg', 'CT, MSNM V4047 · Ibrahim et al. 2014')
      ],
      foot: [{ text: 'Isolated snout' }, { text: 'Later skeletons scale up to this', role: 'evidence' }]
    }),

    plateSeg('isotopes', 'Oxygen isotopes', 1, 3.5, {
      head: { name: 'Romain Amiot 2010', facts: 'Tooth enamel, 12 sites', claim: 'Much of the day in water?' },
      panels: [
        S('ami10-fig1.jpg', 'Kenyan mammals · Amiot et al. 2010', { label: 'Hippos sit below land mammals' }),
        S('ami10-fig3.jpg', 'Amiot et al. 2010', { label: 'Spinosaurs 1.3‰ below other theropods', role: 'evidence' })
      ],
      foot: [{ text: 'Morocco, Tunisia: "not clearly observed"', role: 'else' }]
    }, 'isotopes'),

    /* ---------------------------------------------------------- part: 2014 */
    partTitle('p-neotype', '2014: Ibrahim\'s neotype'),

    plateSeg('site', 'Neotype site', 1, 3, {
      head: { name: 'FSAC-KK 11888', facts: 'Near Erfoud, Morocco · dug by a local collector, 2008' }, side: true,
      panels: [
        S('ibrsm-figS7.jpg', 'Blue arrow: site · Ibrahim et al. 2014'),
        S('ibrsm-figS8.jpg', 'Hammer marks the bone layer · Ibrahim et al. 2014')
      ],
      foot: [
        { text: 'Ibrahim, Sereno, Dal Sasso, Maganuco, Fabbri, Martill, Zouhri, Myhrvold, Iurino' },
        { text: 'Bone positions as recalled by the collector', role: 'else' }
      ]
    }),

    plateSeg('neotype', 'The neotype itself', 1, 3, {
      head: { name: 'FSAC-KK 11888', facts: 'Subadult', claim: 'One individual?' },
      panels: [S('fab22-fig1.jpg', 'Orange: preserved in the neotype. Drawing includes the 2018 tail · Fabbri et al. 2022', { crop: [0.17, 0.8, 0.655, 1] })],
      foot: [
        { text: 'Ibrahim: "a site with just one individual"', role: 'claim' },
        { text: 'Evers: collectors "sort remains... according to fitting size"', role: 'else' }
      ]
    }, 'oneanimal'),

    figSeg('composite', 'The 2014 skeleton by source', 1, 4, Object.assign(F('ibrsm-figS3.jpg', 'Fig. S3, digital skeleton by Tyler Keillor · Ibrahim et al. 2014'), {
      zones: [
        { label: 'Red: neotype FSAC-KK 11888', rect: [0.385, 0.40, 0.14, 0.42], role: 'evidence' },
        { label: 'Orange: Stromer\'s bones', rect: [0.24, 0.09, 0.21, 0.42], role: 'evidence' },
        { label: 'Yellow: isolated Kem Kem bones', rect: [0.005, 0.42, 0.065, 0.18], role: 'evidence' },
        { label: 'Green: _Suchomimus_, _Baryonyx_, _Irritator_, _Ichthyovenator_', rect: [0.05, 0.37, 0.055, 0.25], role: 'evidence' },
        { label: 'Arm: isolated bones and other genera', rect: [0.19, 0.50, 0.11, 0.33], role: 'evidence' },
        { label: 'Blue: inferred', rect: [0.39, 0.12, 0.12, 0.31], role: 'evidence' }
      ]
    })),

    figSeg('claims2014', 'Ibrahim et al. 2014', 1, 4.5, Object.assign(F('ibr14-fig2.jpg', 'Red: size-adjusted neotype, referred bones, Stromer\'s drawings · Ibrahim et al. 2014'), {
      pitch: 74, zones: [
        { label: 'Nostril set back', rect: [0, 0.18, 0.18, 0.25], role: 'evidence' },
        { label: 'Foramina like crocodilian pressure receptors', rect: [0, 0.69, 0.22, 0.31], role: 'evidence' },
        { label: 'Ilium about half the area of most theropods', rect: [0.66, 0.02, 0.34, 0.27], role: 'evidence' },
        { label: 'Hindlimb just over 25% of body length', rect: [0.50, 0.68, 0.30, 0.32], role: 'evidence' },
        { label: 'Flattened unguals', rect: [0.79, 0.68, 0.21, 0.32], role: 'evidence' },
        Object.assign({ label: 'Solid femur, unlike _Suchomimus_', role: 'evidence' }, S('ibr14-fig4.jpg', 'A: neotype femur. B: _Suchomimus_ MNN GAD608. C, D: neotype. E: chameleon · Ibrahim et al. 2014')),
        { label: '"an obligate quadruped on land"', role: 'claim' }
      ]
    })),

    plateSeg('hartman', 'Scott Hartman', 2, 3, {
      head: { name: 'Scott Hartman', facts: 'Blog posts', claim: 'Are the legs too short?' }, side: true,
      panels: [S('hartman-2014.jpg', 'Top: Fig. S3. Bottom: legs and hips rescaled · Hartman 2014')],
      foot: [
        { text: 'Sep 2014, Hartman: "increased about 27%"', at: 0 },
        { text: 'Sep 2014, Ibrahim: "from rim to rim"', at: 1 },
        { text: 'Nov 2020, Hartman: "the 2014 model checked out"', at: 2 },
        { text: 'Dorsal to tibia: 23.96% "_Spinosaurus_ B", 32.76% neotype', at: 3, role: 'else' }
      ]
    }),

    plateSeg('overlap', 'Neotype and Spinosaurus B', 1, 3, {
      head: { name: 'FSAC-KK 11888 and "_Spinosaurus_ B"', claim: 'Same species?' },
      panels: [
        S('ibrsm-figS2.jpg', 'Gray: neotype. Tan: Stromer 1934, scaled · Ibrahim et al. 2014', { label: 'Ibrahim: overlap shows one species', role: 'claim' }),
        S('eve15-fig23.jpg', 'A, D: "_Spinosaurus_ B". B, E: _Sigilmassasaurus_. C, F: BSPG 2006 I 54 · Evers et al. 2015', { label: 'Evers: closer to _Sigilmassasaurus_', role: 'else', at: 1 })
      ]
    }),

    plateSeg('morphs', 'Two forms in the Kem Kem', 2, 2.5, {
      head: { name: 'Kem Kem bones', claim: 'One large spinosaurid, or two?' },
      panels: [
        S('hnd16-fig2.jpg', 'Quadrates · Hendrickx et al. 2016', { label: 'Two quadrate morphotypes', role: 'evidence' }),
        S('ard19-fig5.jpg', 'A: _Carcharodontosaurus_. B: Morph B. C: Morph A · Arden et al. 2019', { label: 'Two frontal morphs', role: 'evidence', at: 1 })
      ]
    }),

    plateSeg('sail', 'Sail', 1, 2.5, {
      head: { name: 'Dorsal sail', facts: 'Ibrahim 2014: "the tallest axial structure documented among dinosaurs"', claim: 'What shape?' },
      panels: [
        S('hen18-fig2.jpg', 'After Ibrahim et al. 2014 · Henderson 2018', { label: 'With a notch: 6.60 m²', role: 'evidence' }),
        S('ser22-fig1a.jpg', 'Red: holotype BSPG 1912 VIII 19. Blue: neotype FSAC-KK 11888. Both × 1.32. Gray: not preserved · Sereno et al. 2022', { crop: [0.254, 0.219, 0.52, 0.489], label: 'No notch', role: 'else', at: 1 })
      ],
      foot: [
        { text: 'Sereno: trunk sail 1.93 m tall, 3.53 m long', role: 'evidence', at: 1 },
        { text: 'Arden: holotype spines "much more expanded." Age, sex, species?', role: 'else', at: 1 }
      ]
    }),

    plateSeg('sailwhy', 'What the sail was for', 1, 3, {
      head: { claim: 'What was the sail for?' },
      panels: [
        S('ibr14-fig4.jpg', '_Trioceros cristatus_, cleared and stained · Ibrahim et al. 2014', { crop: [0.5425, 0.563, 1, 0.94], label: 'Crested chameleon: Stromer 1915, Ibrahim 2014', role: 'claim' }),
        S('ser22-fig4b.jpg', '_Basiliscus plumifrons_ FMNH 112993 · Sereno et al. 2022', { label: 'Display: basilisks "do not use their sails while swimming"', role: 'evidence', at: 1 }),
        S('gim16-fig1.jpg', 'Outlines after Ibrahim et al. 2014 · Gimsa et al. 2016', { label: 'Sailfish: a sail for use underwater?', role: 'else', at: 2 })
      ],
      foot: [
        { text: 'Fat hump: "extremely improbable," Stromer 1915', role: 'else' },
        { text: 'Heat exchange?', role: 'else' },
        { text: 'Sereno: sail adds 33.4% drag', role: 'test', at: 2 }
      ]
    }),

    plateSeg('float', 'Floating model', 1, 3.5, {
      head: { name: 'Donald Henderson 2018', claim: 'Modeling buoyancy', role: null },
      panels: [
        S('hen18-fig5.jpg', 'A: from Fig. S3. B: _Suchomimus_ · Henderson 2018', { label: 'Floats with lungs 75% deflated', role: 'evidence' }),
        S('hen18-fig9.jpg', 'Cross-section tipped 20° · Henderson 2018', { label: 'Rolls onto its side', role: 'evidence', at: 1 })
      ],
      foot: [
        { text: '_T. rex_ and _Allosaurus_ float too', role: 'else', at: 1 },
        { text: 'Ibrahim 2020: tall tail might reduce the roll', role: 'else', at: 2 }
      ]
    }, 'float'),

    plateSeg('calcium', 'Calcium isotopes', 2, 2, {
      head: { name: 'Gadoufaoua, Niger', facts: 'Hassler et al. 2018' },
      panels: [S('has18-fig4.jpg', 'a: other theropods. b: _Sarcosuchus_. c: spinosaurids · Hassler et al. 2018', { label: 'Calcium from fish: 0–30%, 0–58%, 0–100%', role: 'evidence' })],
      foot: [{ text: 'Spinosaurids: a mix of fish and dinosaurs?', role: 'else' }]
    }),

    plateSeg('eyes', 'Eyes', 1, 3, {
      head: { name: 'Arden 2019 · Hone & Holtz 2019' },
      panels: [
        S('ard19-fig6.jpg', 'FSAC-KK-3210, MSNM V4047, Stromer\'s dentary, _Irritator_ · Arden et al. 2019', { crop: [0, 0, 1, 0.6], label: '"placed the eyes atop the skull"', role: 'claim' }),
        S('hh21-fig6.jpg', 'Composite skull; angle from _Irritator_ · Hone & Holtz 2021', { label: 'Nares "retracted posteriorly but not dorsally"', role: 'else', at: 1 })
      ],
      foot: [
        { text: 'Raised rims: _Gallimimus_, _Edmontosaurus_, _Skorpiovenator_', role: 'else', at: 1 },
        { text: 'Arden: warthog too', role: 'else', at: 1 }
      ]
    }, 'eyes'),

    /* ---------------------------------------------------------- part: 2020 on */
    partTitle('p-tail', '2020: Ibrahim\'s tail'),

    figSeg('tail', 'Neotype tail', 1, 3.5, Object.assign(F('ibr20-fig1.jpg', 'FSAC-KK 11888 tail; g: whole skeleton · Ibrahim et al. 2020'), {
      zones: [
        { label: 'Orange: found, mostly in 2018. White: restored', rect: [0, 0, 1, 0.40], role: 'evidence' },
        { label: 'More than 30 caudals, about 80% of the tail', rect: [0, 0.17, 1, 0.23], role: 'evidence' },
        { label: 'Distal spines over 7 × centrum height', rect: [0.76, 0.40, 0.24, 0.60], role: 'evidence' },
        { label: 'Muscles: reconstructed', rect: [0, 0.40, 0.76, 0.26], role: 'else' }
      ]
    })),

    figSeg('flume', 'Flume test', 1, 3.5, Object.assign(F('ibr20-fig3.jpg', 'Ibrahim et al. 2020'), {
      imgBox: [120, 8, 840, 624], zones: [
        { label: 'Plastic tail shape, 20 cm, on a robotic flapper', rect: [0, 0, 1, 0.34], role: 'evidence' },
        { label: 'Thrust: 8.1 × _Coelophysis_', rect: [0, 0.34, 1, 0.33], role: 'evidence' },
        { label: 'Efficiency: 2.6 ×', rect: [0, 0.67, 1, 0.33], role: 'evidence' },
        { label: 'Control, a plain rectangle, beats it on both', rect: [0, 0.34, 0.2, 0.66], role: 'else' },
        { label: 'Tail only: no body, no sail', role: 'else' }
      ]
    }), 'flume'),

    plateSeg('teeth', 'Tooth counts', 2, 2.5, {
      head: { name: 'Tarda, Morocco', facts: 'Beevor et al. 2021', claim: '"living mostly within the river"' }, side: true,
      panels: [S('bee21-fig6.jpg', 'A, B: Site 1. C, D: Site 2. Blue: _Spinosaurus_ · Beevor et al. 2021')],
      foot: [
        { text: 'Teeth: 47.9% and 43.9% _Spinosaurus_', role: 'evidence' },
        { text: 'Teeth dropped while feeding from a bank?', role: 'else' },
        { text: 'Site 2: bought from a digger\'s sack', role: 'else' }
      ]
    }, 'teeth'),

    plateSeg('grizzly', 'Grizzly or crocodile', 1, 3, {
      head: { name: 'Brusatte 2021', claim: '"more like a grizzly bear or more like a crocodile?"' }, side: true,
      panels: [S('hh21-fig1.jpg', 'Scaled to the neotype, drawn by Genya Masukawa · Hone & Holtz 2021')],
      foot: [
        { text: 'Crocodile: Ibrahim', role: 'claim' },
        { text: 'Grizzly: Hone, Holtz, Henderson', role: 'else' },
        { text: 'Dispute: "pursuit predator," not eating fish', role: 'test' }
      ]
    }),

    figSeg('tailspines', 'Tail spines compared', 2, 2, Object.assign(F('hh21-fig9.jpg', 'Mid-caudals · Hone & Holtz 2021'), {
      zones: [
        { label: 'A: _Spinosaurus_', rect: [0, 0, 0.17, 0.60] },
        { label: 'B–F: signaling', rect: [0.17, 0, 0.83, 0.57], role: 'else' },
        { label: 'G–K: aquatic', rect: [0.22, 0.57, 0.68, 0.43], role: 'claim' }
      ]
    })),

    plateSeg('depth', 'Depth', 3, 1, {
      head: { name: 'Hone & Holtz 2021', claim: 'Depth to avoid wave drag', role: null }, side: true,
      panels: [S('hh21-fig8.jpg', 'Outline from Ibrahim et al. 2020 · Hone & Holtz 2021')],
      foot: [{ text: 'At least 6.1 m', role: 'evidence' }]
    }),

    plateSeg('bone', 'Bone density', 1, 3.5, {
      head: { name: 'Matteo Fabbri 2022', claim: 'Underwater forager' }, side: true,
      panels: [S('fab22-fig1.jpg', '_Baryonyx_ NHM R 9951. _Suchomimus_ G51, G70, G94. FSAC-KK 11888. Orange: preserved · Fabbri et al. 2022', { crop: [0, 0.305, 1, 1] })],
      foot: [
        { text: 'Femur compactness: _Baryonyx_ 0.876, _Suchomimus_ 0.682, _Spinosaurus_ 0.968', role: 'evidence' },
        { text: 'Foraging class explains 17.2% of femur variation', role: 'evidence' },
        { text: '"poorly distinguishes between wading, deep diving, and terrestrial habits"', role: 'else' }
      ]
    }, 'bone'),

    plateSeg('sereno', 'Skeleton, 2022', 1, 3.5, {
      head: { name: 'Paul Sereno 2022', facts: '"Spinosaurus is not an aquatic dinosaur" · just under 14 m' }, side: true,
      panels: [S('ser22-fig1a.jpg', SERENO1A)],
      foot: [
        { text: 'All scaled to the adult snout', role: 'evidence' },
        { text: 'Holotype, neotype × 1.32' },
        { text: '"_Spinosaurus_ B" × 1.51' },
        { text: 'Snout MSNM V4047 × 1' },
        { text: 'Hand from _Irritator_', role: 'else' }
      ]
    }),

    plateSeg('twoskel', 'Two skeletons', 2, 2, {
      head: { name: 'Sereno against Ibrahim' }, side: true,
      panels: [S('ser22-fig9.jpg', 'Top: Sereno et al. 2022. Bottom: Ibrahim et al. 2020. Aligned at the ilium')],
      foot: [{ text: 'Sereno: presacrals, ribcage, forelimb over by about 10, 25, 30%', role: 'claim' }]
    }),

    plateSeg('physics', 'Flesh model', 1, 4, {
      head: { name: 'Sereno et al. 2022', claim: 'A wader that could not dive' }, side: true,
      panels: [S('ser22-fig2.jpg', 'Flesh on the Fig. 1A composite · Sereno et al. 2022')],
      foot: [
        { text: 'Floats at about 2.6 m of water', role: 'evidence' },
        { text: 'Under 1 m/s', role: 'evidence' },
        { text: 'Dive: about 25 × tail force', role: 'evidence' },
        { text: 'Assumes an alligator-like tail', role: 'else' }
      ]
    }, 'physics'),

    plateSeg('cm', 'Center of mass', 1, 4, {
      head: { name: 'Sereno, 2014 to 2024', claim: 'Center of mass', role: null }, side: true,
      panels: [
        S('ibrsm-figS3.jpg', 'Red dot · Ibrahim et al. 2014', { crop: [0, 0.05, 0.62, 0.88], label: '2014: mid trunk' }),
        S('ser22-fig2.jpg', 'Red cross · Sereno et al. 2022', { crop: [0, 0, 1, 0.35], label: '2022: over the feet', at: 1 })
      ],
      foot: [
        { text: 'Henderson 2018: "None... can match"', role: 'test', at: 1 },
        { text: '2022: "front-loading"', role: 'else', at: 2 },
        { text: '2024: "by the addition, rather than the subtraction" of air volume, "made by PCS"', role: 'evidence', at: 3 }
      ]
    }, 'cm'),

    plateSeg('femur', 'A second femur', 1, 2.5, {
      head: { name: 'CMN 41869', facts: 'Isolated femur · Myhrvold et al. 2024' }, side: true,
      panels: [S('myh24-fig4.jpg', 'A, B: CMN 41869. C: neotype femur. D: UCRC PV8 · Myhrvold et al. 2024')],
      foot: [
        { text: 'Compactness 0.804–0.888, with a cavity', role: 'evidence' },
        { text: '"Only two subadult femora"', role: 'evidence' }
      ]
    }),

    plateSeg('myhrvold', 'Bone density exchange', 2, 3, {
      head: { name: 'Nathan Myhrvold and Sereno', claim: 'Bone density', role: null }, side: true,
      panels: [S('myh24-fig8.jpg', 'A, B: _Suchomimus_. C: neotype. D: CMN 41869. E: CMN 50382. Same length · Myhrvold et al. 2024')],
      foot: [
        { text: 'Apr 2022: "undermined by selective sampling"', at: 0 },
        { text: 'May 2022, Fabbri: "debunk qualitative assumptions"', at: 1 },
        { text: '2024: "confidently dismiss"', at: 2 },
        { text: 'Same ranking on their own numbers?', role: 'test', at: 3 }
      ]
    }),

    plateSeg('smart', 'Skull shape', 3, 1.5, {
      head: { name: 'Smart & Sakamoto 2024', claim: 'Skull shape', role: null }, side: true,
      panels: [S('sma24-fig1.jpg', 'Smart & Sakamoto 2024')],
      foot: [
        { text: 'Land apart from semi- and fully aquatic', role: 'evidence' },
        { text: 'Hone & Holtz 2021: no separation', role: 'else' }
      ]
    }),

    plateSeg('word', 'What counts as aquatic', 1, 2.5, {
      head: { claim: 'Defining "aquatic"', role: null }, side: true,
      panels: [S('gor25-fig1a.jpg', 'Five bins · Gordon et al. 2025')],
      foot: [
        { text: 'Sereno: "severely reduced functional capacity on land"', role: 'claim' },
        { text: 'Fabbri: wading is an aquatic lifestyle', role: 'else' },
        { text: 'Hone & Holtz: "very term \'semi-aquatic\' is poorly defined"', role: 'test' }
      ]
    }),

    figSeg('gormethod', 'Hand length: method', 1, 3.5, Object.assign(F('gor25-fig1.jpg', 'Fig. 1 · Gordon et al. 2025'), {
      zones: [
        { label: 'Animals of known habit: highly or fully aquatic, or not', rect: [0.083, 0.392, 0.153, 0.219] },
        { label: 'Four bone traits from earlier papers', rect: [0.484, 0, 0.516, 0.712] },
        Object.assign({ label: 'Measure hand ÷ forearm, no claw: 759 specimens', imgBox: [40, 130, 1010, 420] }, S('gor25-fig1d.jpg', 'Zeugopod = forearm. Acropod = hand: digit III in reptiles. No specimen named · Gordon et al. 2025')),
        Object.assign({ label: 'Highly or fully aquatic: longer hands' }, S('gor25-fig2f.jpg', 'Fig. 2F · Gordon et al. 2025')),
        Object.assign({ label: 'Train on ⅔, test on ⅓, 100 runs: hand ÷ forearm predicts best', role: 'test' }, S('gor25-fig2g.jpg', 'Fig. 2G. Green: hand ÷ forearm · Gordon et al. 2025')),
        Object.assign({ label: 'Probability cutoff 0.66: finds 76%, flags 2% of others', role: 'test', rect: [0, 0.02, 0.32, 0.235] }, S('gor25-fig2g.jpg', 'Fig. 2G. White circle: best cutoff · Gordon et al. 2025')),
        Object.assign({ label: 'Archosaurs only: finds 32%, flags 1%', role: 'else' }, S('gor25-fig3a.jpg', 'Fig. 3A, n = 46. Green: hand ÷ forearm. Pink: foot ÷ shin · Gordon et al. 2025'))
      ]
    })),

    plateSeg('gordon', 'Hand length', 1, 3.5, {
      head: { name: 'Gordon et al. 2025', claim: 'Highly aquatic: "only occasionally leaves water"' },
      panels: [
        S('gor25-fig5a.jpg', 'Gordon et al. 2025', { label: 'Positive: one of two _Spinosaurus_ forelimbs', role: 'evidence' }),
        S('ser22-fig1a.jpg', 'Yellow: referred. Blue: neotype · Sereno et al. 2022', { crop: [0.225, 0.425, 0.345, 0.645], label: 'That forelimb: Sereno 2022', role: 'else', at: 1 })
      ],
      foot: [
        { text: 'Hindlimb model: no theropod', role: 'else' },
        { text: 'Paper: "tentative." Press: "confidently"', role: 'else', at: 1 }
      ]
    }, 'gordon'),

    plateSeg('salt', 'Salt glands', 2, 2, {
      head: { name: 'Cau et al. 2026', facts: 'NHMUK PV R 16423, OPH 2103', claim: 'Salt glands above the eyes' }, side: true,
      panels: [S('ard19-fig2.jpg', 'Other Kem Kem frontals: FSAC-KK-3209, FSAC-KK-3210 · Arden et al. 2019')],
      foot: [
        { text: 'Fossae, orbital notch, ventral sulcus', role: 'evidence' },
        { text: '"compatible with either ecological model"', role: 'else' }
      ]
    }),

    plateSeg('mirabilis', '_Spinosaurus mirabilis_', 1, 3, {
      head: { name: '_Spinosaurus mirabilis_', facts: 'Jenguebi, Niger · about 95 Ma · Sereno et al. 2026' },
      panels: [
        S('ser26-summary.jpg', 'Dani Navarro; skull cast; guineafowl · Sereno et al. 2026'),
        S('ser26-fig2.jpg', 'Blue: preserved. Gray: from _Irritator_. A, B: _S. mirabilis_. C, D: _S. aegyptiacus_ · Sereno et al. 2026')
      ],
      foot: [
        { text: 'Crest above the cranium at the orbits', role: 'evidence' },
        { text: 'All known individuals immature', role: 'evidence' }
      ]
    }),

    plateSeg('inland', 'Inland river', 1, 3, {
      head: { name: 'Sirig Taghat, Niger', claim: 'Inland river, so a wader' }, side: true,
      panels: [
        S('ser26-fig1.jpg', 'Sereno et al. 2026'),
        S('ser26-fig3.jpg', 'Blue: _S. mirabilis_, scaled to subadult JEN1. Rest from _S. aegyptiacus_ · Sereno et al. 2026', { at: 1 })
      ],
      foot: [
        { text: '500–1000 km from the sea', role: 'evidence' },
        { text: 'A different species from the neotype', role: 'else', at: 1 },
        { text: '2022: "ranged far inland." 2026: "only in coastal deposits"', role: 'else', at: 1 }
      ]
    }, 'inland'),

    plateSeg('pca', 'Predatory modes', 1, 2.5, {
      head: { name: 'Sereno et al. 2026', claim: 'Wader by shape' }, side: true,
      panels: [S('ser26-fig4.jpg', 'Red: _Spinosaurus_ (1), _Suchomimus_ (2) · Sereno et al. 2026')],
      foot: [
        { text: 'Between herons and darters', role: 'evidence' },
        { text: 'PC2 4.32%, PC3 2.51%. PC1, size, is 91%', role: 'evidence' },
        { text: 'Neck and leg lengths come from composites', role: 'else' }
      ]
    }, 'pca'),

    /* ---------------------------------------------------------- who said what */
    {
      id: 'who', title: 'Who said what', min: 3, tier: 1, builds: Array.from({ length: 18 }, () => ({})),
      items: [{
        kind: 'guess', box: [0, 100, 1600, 690], y0: 1995, y1: 2027,
        rows: [{ label: 'Specimens' }, { label: 'Shore and shallows' }, { label: 'In the water', hot: true }],
        events: [
          { year: 1997, label: 'Charig & Milner: bank', row: 1 },
          { year: 2005, label: 'Dal Sasso: snout', row: 0 },
          { year: 2010, label: 'Amiot: isotopes', row: 2 },
          { year: 2014, label: 'Ibrahim: neotype', row: 0 },
          { year: 2014, label: 'Ibrahim: paddler', row: 2 },
          { year: 2018, label: 'Henderson: floats', row: 1 },
          { year: 2019, label: 'Arden: eyes', row: 2 },
          { year: 2020, label: 'Ibrahim: tail', row: 0 },
          { year: 2020, label: 'Ibrahim: swimmer', row: 2 },
          { year: 2021, label: 'Hone & Holtz: wading', row: 1 },
          { year: 2021, label: 'Beevor: teeth', row: 2 },
          { year: 2022, label: 'Fabbri: bone', row: 2 },
          { year: 2022, label: 'Sereno: no diving', row: 1 },
          { year: 2024, label: 'Myhrvold: bone', row: 1 },
          { year: 2025, label: 'Gordon: hands', row: 2 },
          { year: 2026, label: 'Sereno: S. mirabilis', row: 0 },
          { year: 2026, label: 'Sereno: inland', row: 1 }
        ].sort((a, b) => a.year - b.year)
      }]
    },

    /* ---------------------------------------------------------- the wall */
    {
      id: 'wall', title: 'The evidence', min: 2, tier: 1,
      builds: [{ rail: 'evidence' }, { rail: 'sure' }],
      items: [{
        kind: 'wall', box: [0, 100, 1600, 690], tiles: [
          { id: 'stomach', label: 'Fish in the stomach', src: 'img/cha97-fig47.jpg' },
          { id: 'isotopes', label: 'Oxygen isotopes', src: 'img/ami10-fig3.jpg' },
          { id: 'oneanimal', label: 'Neotype is one individual', src: 'img/fab22-fig1.jpg', pos: '30% 100%' },
          { id: 'float', label: 'Floats and rolls', src: 'img/hen18-fig5.jpg', pos: '50% 15%' },
          { id: 'eyes', label: 'Eyes atop the skull', src: 'img/ard19-fig6.jpg', pos: '50% 10%' },
          { id: 'flume', label: 'Tail for swimming', src: 'img/ibr20-fig3.jpg', pos: '50% 0%' },
          { id: 'teeth', label: 'Lived in the river', src: 'img/bee21-fig6.jpg', pos: '50% 20%', tier: 2 },
          { id: 'bone', label: 'Dense bone, underwater forager', src: 'img/fab22-fig1.jpg', pos: '50% 0%' },
          { id: 'physics', label: 'Could not dive', src: 'img/ser22-fig2.jpg', pos: '50% 20%' },
          { id: 'cm', label: 'Biped on land', src: 'img/ser22-fig1a.jpg', pos: '50% 35%' },
          { id: 'gordon', label: 'Highly aquatic from the hand', src: 'img/gor25-fig5a.jpg', pos: '50% 20%' },
          { id: 'inland', label: 'Inland river, so a wader', src: 'img/ser26-fig1.jpg', pos: '50% 20%' },
          { id: 'pca', label: 'Wader by shape', src: 'img/ser26-fig4.jpg', pos: '50% 50%' }
        ]
      }]
    }
  ];

  root.SPINO = {
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
