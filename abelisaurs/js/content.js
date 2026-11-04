/* Every word on screen. Edit wording here; nothing in this file touches layout.
 *
 * The deck is for talking over: animals and maps first, a few words at most.
 * The five question icons (claim, evidence, else, test, sure) light at the top
 * left as the talk moves through a scene; they are the only framing on screen.
 *
 * Sources are the papers in abelisaurs/papers/ (see ../paper_summaries.md and
 * ../readme.md). Pills marked "own" in the readme are the deck's, not the paper's.
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

  const partTitle = (id, n, text) => ({ id, title: text, min: 0.3, tier: 1, builds: [{}], items: [{ kind: 'title', box: [100, 200, 1400, 500], n, text }] });

  const sortSeg = (id, title, tier, min, bins, cards) => ({
    id, title, min, tier,
    builds: [{}].concat(cards.map(() => ({}))).concat([{}]),
    items: [{ kind: 'sort', id, box: [0, 100, 1600, 690], finalAt: cards.length + 1, bins, cards: cards.map((c, i) => Object.assign({ at: i + 1 }, c)) }]
  });

  /* F('name.jpg', caption): a picture from img/ with its size from dims.js. */
  const F = (name, cap) => ({ src: 'img/' + name, w: window.DIMS[name][0], h: window.DIMS[name][1], cap: cap || '' });
  /* A pill that swaps the picture: S('name.jpg', caption, extra). */
  const S = (name, cap, extra) => Object.assign({ src: 'img/' + name, w: window.DIMS[name][0], h: window.DIMS[name][1], cap: cap || '' }, extra || {});

  const MAP = 'Scotese et al., PALEOMAP (CC BY 4.0)';

  const segments = [
    /* ---------------------------------------------------------- cover */
    {
      id: 'title', title: 'Abelisaurs', min: 1, tier: 1, builds: [{}],
      items: [{ kind: 'cover', box: [0, 0, 1600, 790], pic: 'img/wiki-majungasaurus-size.jpg', title: 'Abelisaurs' }]
    },

    /* ---------------------------------------------------------- part 1 */
    partTitle('p1', 1, 'Meet them'),

    figSeg('meet', 'Carnotaurus', 1, 2.5, Object.assign(F('hen21-fig2.jpg', 'Carnotaurus, with the six pieces of skin found · Hendrickx & Bell 2021'), {
      zones: [
        { label: 'Short, deep, horned skull', rect: [0.1, 0.24, 0.13, 0.27] },
        { label: 'Long legs', rect: [0.3, 0.5, 0.4, 0.5] },
        { label: 'Thick, stiff tail', rect: [0.6, 0.25, 0.4, 0.25] },
        { label: 'Skin: six pieces found' }
      ]
    })),

    figSeg('family', 'The family', 1, 3, Object.assign(F('gri17-fig3.jpg', 'Six ceratosaurs to one scale (0–8 m) · Grillo & Delcourt 2017'), {
      pitch: 74, zones: [
        { label: 'Carnotaurus', rect: [0, 0, 1, 0.21] },
        { label: 'Skorpiovenator', rect: [0, 0.21, 1, 0.17] },
        { label: 'Aucasaurus', rect: [0, 0.38, 1, 0.17] },
        { label: 'Majungasaurus', rect: [0, 0.55, 1, 0.17] },
        { label: 'Eoabelisaurus', rect: [0, 0.72, 1, 0.17] },
        { label: 'Masiakasaurus', rect: [0, 0.89, 1, 0.11] },
        S('photo-maj-mount.jpg', 'Majungasaurus, mounted · photo: Kumiko, CC BY-SA 2.0', { label: 'Majungasaurus: the mount' }),
        S('photo-eoabel-mount.jpg', 'Eoabelisaurus, mounted · photo: Jl FilpoC, CC BY-SA 4.0', { label: 'Eoabelisaurus: the mount' }),
        S('photo-masia-fossil.jpg', 'Masiakasaurus, partial skeleton · photo: CaptMondo, CC BY-SA 3.0', { label: 'Masiakasaurus: the bones' }),
        S('wiki-abelisauridae-scale.jpg', 'Five abelisaurids and a person · Slate Weasel, public domain', { label: 'Next to a person' })
      ]
    })),

    figSeg('skulls', 'Skulls', 2, 3.5, Object.assign(F('del18-fig2.jpg', 'Ceratosaur skulls · Delcourt 2018'), {
      pitch: 76, zones: [
        { label: 'Ceratosaurus', rect: [0, 0, 0.5, 0.33] },
        { label: 'Skorpiovenator', rect: [0, 0.33, 0.5, 0.33] },
        { label: 'Carnotaurus', rect: [0, 0.66, 0.5, 0.34] },
        { label: 'Noasaurus', rect: [0.5, 0, 0.5, 0.33] },
        { label: 'Masiakasaurus', rect: [0.5, 0.33, 0.5, 0.33] },
        { label: 'Limusaurus', rect: [0.5, 0.66, 0.5, 0.34] },
        S('photo-abel-skull.jpg', 'Abelisaurus · photo: Christophe Hendrickx, CC BY-SA 3.0', { label: 'Abelisaurus' }),
        S('photo-maj-skull.jpg', 'Majungasaurus, cast of FMNH PR 2100 · photo: WehaveaTrex, CC BY-SA 4.0', { label: 'Majungasaurus' }),
        S('photo-raja-exhibit.jpg', 'Rajasaurus skull replica, Bhopal · photo: Swapnil Karambelkar, CC BY-SA 4.0', { label: 'Rajasaurus, India' })
      ]
    })),

    figSeg('biggest', 'Biggest?', 2, 3.5, Object.assign(F('gri17-fig2.jpg', 'Tail bones · Grillo & Delcourt 2017'), {
      zones: [
        { label: 'Biggest?', role: 'claim' },
        { label: 'Pycnonemosaurus: its tail bones', role: 'evidence', rect: [0, 0, 1, 0.5] },
        { label: 'Same bone, other species', role: 'evidence', rect: [0, 0.5, 1, 0.5] },
        S('gri17-fig7.jpg', 'Body length, 37 specimens · Grillo & Delcourt 2017', { label: '8.9 m: Pycnonemosaurus', role: 'evidence', rect: [0, 0, 1, 0.03] }),
        { label: '7.8 m: Carnotaurus', rect: [0, 0.03, 1, 0.03] },
        { label: 'Skull, arm: poor guide', role: 'else' }
      ]
    })),

    figSeg('tree', 'The tree', 3, 2.5, Object.assign(F('del18-fig1.jpg', 'Ceratosaurs · Delcourt 2018'), {
      zones: [
        { label: 'Small noasaurids', role: 'evidence' },
        { label: 'Big abelisaurids', role: 'evidence' }
      ]
    })),

    /* ---------------------------------------------------------- part 2 */
    partTitle('p2', 2, 'Where from?'),

    {
      id: 'found', title: 'Where found?', min: 2.5, tier: 1,
      builds: Array.from({ length: 14 }, () => ({})),
      items: [{
        kind: 'guess', box: [0, 100, 1600, 690], y0: 1930, y1: 2026,
        rows: [{ label: 'South America' }, { label: 'India, Madagascar' }, { label: 'Africa', hot: true }, { label: 'Europe', hot: true }],
        events: [
          { year: 1933, label: 'Indosaurus', row: 1 },
          { year: 1955, label: 'Majungasaurus', row: 1 },
          { year: 1985, label: 'Carnotaurus', row: 0 },
          { year: 2002, label: 'Aucasaurus', row: 0 },
          { year: 2003, label: 'Rajasaurus', row: 1 },
          { year: 2004, label: 'Rugops', row: 2 },
          { year: 2009, label: 'Skorpiovenator', row: 0 },
          { year: 2014, label: 'Arcovenator', row: 3 },
          { year: 2017, label: 'Chenanisaurus', row: 2 },
          { year: 2021, label: 'Llukalkan', row: 0 },
          { year: 2024, label: 'Koleken', row: 0 },
          { year: 2025, label: 'Vitosaura', row: 0 }
        ].sort((a, b) => a.year - b.year)
      }]
    },

    figSeg('world', 'The world then', 1, 3, Object.assign(F('map140.jpg', '140 Ma · ' + MAP), {
      imgBox: [20, 8, 1100, 672], zones: [
        { label: 'One southern land, splitting' },
        S('map100.jpg', '100 Ma · ' + MAP, { label: 'Africa and South America: still close', rect: [0.34, 0.34, 0.3, 0.55] }),
        S('map80.jpg', '80 Ma · ' + MAP, { label: 'South America alone', rect: [0.33, 0.46, 0.14, 0.43] }),
        { label: 'India and Madagascar drifting', rect: [0.59, 0.6, 0.14, 0.22] },
        { label: 'Europe: islands', rect: [0.46, 0.12, 0.2, 0.24] }
      ]
    })),

    figSeg('africa', 'Africa first?', 1, 3, Object.assign(F('ser04-fig1.jpg', 'Early Cenomanian, 97 Ma · Sereno et al. 2004'), {
      imgBox: [40, 8, 520, 672], zones: [
        { label: 'Africa split off first?', role: 'claim' },
        { label: 'Only South America, India, Madagascar', role: 'evidence' },
        S('ser04-fig4.jpg', 'Niger: three levels · Sereno et al. 2004', { label: 'Niger: 130, 110, 95 million years ago', role: 'evidence' }),
        { label: 'Or: still linked until about 100 Ma', role: 'else' },
        { label: 'Later African fossils?', role: 'test' }
      ]
    }), 'africa'),

    figSeg('rugops', 'Rugops', 1, 2.5, Object.assign(F('rugops-art.jpg', 'Rugops, restored · art by king-the-kong'), {
      zones: [
        { label: 'Rugops, Niger, 95 Ma' },
        S('photo-rugops-maxilla.jpg', 'Rugops snout bones · Ibrahim, Sereno et al., CC BY 4.0', { label: 'The fossil: a snout' }),
        S('ser04-fig3.jpg', 'Rugops skull · Sereno et al. 2004', { label: 'Pits on the snout', rect: [0, 0.1, 1, 0.24] }),
        { label: 'No horns', role: 'evidence', rect: [0, 0.38, 1, 0.24] }
      ]
    })),

    figSeg('arco', 'Arcovenator', 1, 3.5, Object.assign(F('arco-art.jpg', 'Arcovenator, restored · Danny Cicchetti, CC BY-SA 3.0'), {
      zones: [
        { label: 'Abelisaurid in Europe?', role: 'claim' },
        S('tor14-fig2.jpg', 'Arcovenator, France · Tortosa et al. 2014', { label: 'A braincase', role: 'evidence', rect: [0, 0, 1, 0.55] }),
        S('photo-arco-cruzy.jpg', 'Arcovenator leg bones, Cruzy · photo: Tylwyth Eldar, CC BY-SA 4.0', { label: 'Its leg bones' }),
        S('tor14-fig7.jpg', 'Tortosa et al. 2014', { label: 'Kin: India and Madagascar', role: 'evidence', rect: [0.5, 0.7, 0.45, 0.22] }),
        S('map80.jpg', '80 Ma · ' + MAP, { label: 'So: across the sea', role: 'else', rect: [0.46, 0.12, 0.2, 0.24] }),
        { label: 'A tree says it; nothing tests it', role: 'test' }
      ]
    })),

    figSeg('chena', 'Chenanisaurus', 1, 3.5, Object.assign(F('chena-art.jpg', 'Chenanisaurus, restored · Nick Longrich, CC BY-SA 4.0'), {
      zones: [
        { label: 'Chenanisaurus, Morocco' },
        S('lon17-fig3.jpg', 'Chenanisaurus jaw · Longrich et al. 2017', { label: 'A partial jaw, a few teeth', role: 'evidence' }),
        S('lon17-fig8.jpg', 'Jaws · Longrich et al. 2017', { label: 'Short, deep, bowed', rect: [0, 0.75, 1, 0.25] }),
        S('lon17-fig9.jpg', 'Longrich et al. 2017', { label: '7–8 m' }),
        S('lon17-fig11.jpg', 'Latest Cretaceous abelisaurids · Longrich et al. 2017', { label: 'Africa: still abelisaurids at the end', role: 'claim', rect: [0.3, 0.28, 0.4, 0.2] }),
        { label: 'Press: "smaller brain", scales', role: 'else' },
        { label: 'Not from a jaw', role: 'test' }
      ]
    }), 'chena'),

    figSeg('endemic', 'Many lineages', 2, 3, Object.assign(F('lon17-fig10.jpg', 'Longrich et al. 2017'), {
      zones: [
        { label: 'Early split, then local lineages', role: 'claim' },
        { label: 'Gondwana breaking up', role: 'evidence' },
        { label: 'Africa, Europe, India, South America', role: 'evidence' },
        { label: 'Weakly supported', role: 'else' }
      ]
    })),

    figSeg('big', 'Big everywhere?', 2, 2.5, Object.assign(F('gri17-fig8.jpg', 'Body length by place and age · Grillo & Delcourt 2017'), {
      zones: [
        { label: 'Bigger through time', rect: [0, 0, 1, 0.37] },
        { label: 'Every region: 4–8 m', rect: [0, 0.4, 1, 0.6] }
      ]
    })),

    figSeg('vesper', 'Vespersaurus', 2, 2.5, Object.assign(F('photo-vesper-art.jpg', 'Vespersaurus, restored · Ildarotyrannus, CC BY-SA 4.0'), {
      zones: [
        { label: 'Vespersaurus: 1 m, desert', role: 'claim' },
        S('lan19-fig10.jpg', 'Vespersaurus, Brazil · Langer et al. 2019', { label: 'Thin outer toes, blade claws', role: 'evidence', rect: [0, 0.5, 1, 0.5] }),
        { label: 'Same rocks: footprints', role: 'test' }
      ]
    })),

    figSeg('koleken', 'Koleken', 2, 2.5, Object.assign(F('photo-koleken-holo.jpg', 'Koleken, the bones laid out · photo: Amalia Villafañe, CC BY 2.5 ar'), {
      zones: [
        { label: 'Koleken, with Carnotaurus', role: 'claim' },
        S('pol24-fig2.jpg', 'Koleken, Patagonia · Pol et al. 2024', { label: 'Own set of skull features', role: 'evidence' }),
        S('pol24-fig17.jpg', 'Tibia bone · Pol et al. 2024', { label: 'Six years old, still growing', role: 'evidence' })
      ]
    })),

    figSeg('vito', 'Vitosaura', 3, 2.5, Object.assign(F('vel25-fig5.jpg', 'Vitosaura, La Rioja · Velandia et al. 2025'), {
      zones: [
        { label: 'Vitosaura: new in 2025', role: 'claim' },
        S('vel25-fig1.jpg', 'Velandia et al. 2025', { label: 'La Rioja' }),
        { label: 'Place in the tree: unsure', role: 'else' }
      ]
    })),

    /* ---------------------------------------------------------- part 3 */
    partTitle('p3', 3, 'The arms'),

    figSeg('arms', 'Arms', 1, 3.5, Object.assign(F('bur12-fig2.jpg', 'Majungasaurus, shoulder and arm · Burch & Carrano 2012'), {
      imgBox: [40, 8, 640, 672], zones: [
        { label: 'Big shoulder girdle', rect: [0, 0, 1, 0.8] },
        { label: 'Forearm: a quarter of the upper arm', role: 'evidence', rect: [0.45, 0.62, 0.55, 0.38] },
        S('bur12-fig8.jpg', 'Majungasaurus, hand · Burch & Carrano 2012', { label: 'Four fingers, no wrist bones', role: 'evidence' }),
        S('del18-fig3.jpg', 'Deltadromeus (A) and Carnotaurus (B) · Delcourt 2018', { label: 'A long arm: Deltadromeus', rect: [0.02, 0.03, 0.5, 0.45] }),
        { label: 'Carnotaurus: tiny', rect: [0.52, 0.03, 0.2, 0.92] },
        { label: 'No grasp. Display?', role: 'claim' },
        { label: 'No evidence of use is not evidence of none', role: 'else' }
      ]
    }), 'arms'),

    /* ---------------------------------------------------------- part 4 */
    partTitle('p4', 4, 'What did they eat?'),

    figSeg('bite', 'The bite', 1, 3.5, Object.assign(F('photo-carno-skull.jpg', 'Carnotaurus skull · photo: AStrangerintheAlps, CC BY-SA 3.0'), {
      zones: [
        { label: 'Short, deep, horned skull' },
        S('maz09-fig4.jpg', 'Stress in a bite (light: low) · Mazzetta et al. 2009', { label: 'Computer model of a bite', role: 'evidence' }),
        { label: 'Peak bite: 3,341 N; Allosaurus 3,573 N', role: 'evidence' },
        { label: 'Weak, but fast jaws', role: 'claim' },
        { label: 'Small prey: speed beats force', role: 'else' },
        { label: 'Or hatchet strikes: skull holds', role: 'else' }
      ]
    }), 'bite'),

    figSeg('marks', 'Bite marks', 1, 4, Object.assign(F('rog03-fig1.jpg', 'Tooth-marked Majungatholus bones · Rogers et al. 2003'), {
      zones: [
        { label: 'Ate its own kind?', role: 'claim' },
        { label: 'Grooves on 21+ bones, two individuals', role: 'evidence' },
        S('photo-maj-skull.jpg', 'Majungatholus jaw, cast of FMNH PR 2100 · photo: WehaveaTrex, CC BY-SA 4.0', { label: 'Its jaw' }),
        S('rog03-fig2.jpg', 'Marks and the teeth that fit · Rogers et al. 2003', { label: 'Spacing matches its jaw', role: 'evidence' }),
        S('rog03-fig4.jpg', 'Other jaws in the same rocks · Rogers et al. 2003', { label: 'Crocodiles: too blunt, uneven', role: 'else' }),
        { label: 'Killed, or scavenged? Unknown', role: 'test' }
      ]
    }), 'marks'),

    sortSeg('who', 'Who bit it?', 2, 3,
      [{ id: 'fits', label: 'Could have' }, { id: 'out', label: 'Ruled out' }],
      [
        { id: 'w1', text: '_Majungatholus_: even spacing, 2 denticles per mm', to: 'fits', basis: 'matches' },
        { id: 'w2', text: '_Trematochampsa_: blunt, uneven teeth', to: 'out', basis: 'wrong shape' },
        { id: 'w3', text: '_Mahajangasuchus_: conical, variable teeth', to: 'out', basis: 'wrong shape' },
        { id: 'w4', text: '_Masiakasaurus_: too small', to: 'out', basis: 'too small' }
      ]),

    figSeg('teeth', 'Fast teeth', 1, 3.5, Object.assign(F('dem19-fig3.jpg', 'Tooth replacement · D\'Emic et al. 2019'), {
      zones: [
        { label: 'Fast tooth replacement', role: 'claim' },
        { label: 'Majungasaurus: 56 days', role: 'evidence', rect: [0.55, 0.34, 0.45, 0.08] },
        { label: 'Allosaurus, Ceratosaurus: about 100', role: 'evidence', rect: [0.2, 0.34, 0.5, 0.12] },
        { label: 'Body size: no link', role: 'evidence', rect: [0, 0.56, 1, 0.44] },
        { label: 'Wear from bone? A guess', role: 'else' }
      ]
    })),

    figSeg('skorp', 'Skorpiovenator', 2, 3, Object.assign(F('photo-skorp-field.jpg', 'Skorpiovenator, as found (museum display)'), {
      zones: [
        { label: 'Skorpiovenator, Patagonia' },
        S('can09-fig1.jpg', 'Skorpiovenator, Patagonia · Canale et al. 2009', { label: 'Found in plaster', rect: [0.5, 0, 0.5, 0.45] }),
        { label: '6 m', rect: [0, 0.5, 1, 0.5] },
        S('can09-fig2.jpg', 'Canale et al. 2009', { label: 'Teeth like a giant meat-eater', role: 'evidence', rect: [0, 0.78, 1, 0.22] }),
        { label: 'So: isolated teeth may be abelisaurs', role: 'claim' },
        { label: 'Or: carcharodontosaurs, as thought', role: 'else' },
        S('skorp-art.jpg', 'Skorpiovenator, restored · Dinosauria-Freak, public domain', { label: 'A pencil restoration' })
      ]
    })),

    figSeg('limus', 'Limusaurus', 2, 3.5, Object.assign(F('photo-limus-holo.jpg', 'Limusaurus, the holotype slab · photo: Kumiko, CC BY-SA 2.0'), {
      zones: [
        { label: 'Limusaurus, China' },
        S('wan17-fig1.jpg', 'Limusaurus, six ages · Wang et al. 2017', { label: 'Toothed young, toothless adult', role: 'claim' }),
        { label: 'Six ages', role: 'evidence', rect: [0, 0, 0.55, 1] },
        S('wan17-fig2.jpg', 'Jaws by age · Wang et al. 2017', { label: 'Teeth lost, beak formed', role: 'evidence' }),
        S('wan17-fig3.jpg', 'Isotopes · Wang et al. 2017', { label: 'Adults: plant-eater chemistry', role: 'evidence' })
      ]
    }), 'limus'),

    /* ---------------------------------------------------------- part 5 */
    partTitle('p5', 5, 'Built to run?'),

    figSeg('tail', 'The tail', 1, 4, Object.assign(F('per11-fig5.jpg', 'Carnotaurus, tail cross-section · Persons & Currie 2011'), {
      zones: [
        { label: 'A sprinter?', role: 'claim' },
        { label: 'Tail-to-thigh muscle: 222 kg', role: 'evidence', rect: [0.1, 0.2, 0.75, 0.8] },
        { label: '15% of body mass; T. rex: 9%', role: 'evidence' },
        S('per11-fig1.jpg', 'Tail bone, three views · Persons & Currie 2011', { label: 'Ribs locked together: stiff', role: 'else' }),
        S('per11-life.jpg', 'Restoration · Xing & Liu, in Persons & Currie 2011', { label: 'A model, not a speed', role: 'test' })
      ]
    }), 'sprint'),

    figSeg('horns', 'Horns', 1, 4, Object.assign(F('maz09-fig6.jpg', 'Blow on the horn, modelled · Mazzetta et al. 2009'), {
      imgBox: [40, 4, 660, 634], zones: [
        { label: 'Horns for ramming?', role: 'claim' },
        { label: 'Hard, fast blows: no', role: 'evidence', rect: [0, 0, 1, 0.3] },
        S('del18-fig4.jpg', 'Soft tissue on the skull · Delcourt 2018', { label: 'Padded, slow pushing?', role: 'else' }),
        S('del18-fig6.jpg', 'Delcourt 2018 (painting)', { label: 'Or just display', role: 'else' }),
        { label: 'Ranked by evidence?', role: 'test' }
      ]
    }), 'horns'),

    figSeg('skin', 'Skin', 1, 3.5, Object.assign(F('hen21-fig5.jpg', 'Carnotaurus, skin from the ribs · Hendrickx & Bell 2021'), {
      imgBox: [40, 4, 700, 634], zones: [
        { label: 'Scales, not feathers', role: 'claim' },
        { label: 'Big cones, 20–65 mm', role: 'evidence', rect: [0.15, 0.05, 0.75, 0.5] },
        { label: 'Scattered, not in rows', role: 'evidence' },
        S('hen21-fig2.jpg', 'Hendrickx & Bell 2021', { label: 'Best skin of any theropod', rect: [0.3, 0.2, 0.6, 0.6] }),
        { label: 'Armor? Little help against bites', role: 'else' },
        { label: 'Display, colour. Or heat: a guess', role: 'else' }
      ]
    }), 'skin'),

    figSeg('skin12', 'Not like the others', 2, 2.5, Object.assign(F('hen21-fig12.jpg', 'Dinosaur skin · Hendrickx & Bell 2021'), {
      zones: [
        { label: 'Carnotaurus', rect: [0, 0, 0.95, 0.25] },
        { label: 'Other meat-eaters', rect: [0, 0.25, 0.95, 0.25] },
        { label: 'Tyrannosaurs', rect: [0, 0.5, 0.95, 0.25] },
        { label: 'Sauropods', rect: [0, 0.75, 0.95, 0.25] }
      ]
    })),

    figSeg('ear', 'Llukalkan', 2, 3.5, Object.assign(F('photo-llukalkan-cast.jpg', 'Llukalkan skull cast, being assembled · photo: Brancasaurio, CC BY 4.0'), {
      zones: [
        S('gia21-fig17.jpg', 'Llukalkan, Patagonia · Gianechini et al. 2021', { label: 'Llukalkan, Santonian, Patagonia' }),
        S('gia21-fig12.jpg', 'Braincase, from CT · Gianechini et al. 2021', { label: 'A pocket behind the ear bone', role: 'evidence' }),
        S('gia21-fig15.jpg', 'Brain and inner ear, rendered · Gianechini et al. 2021', { label: 'Inner ear: hard to see in the scan', role: 'else' }),
        { label: 'So: different hearing?', role: 'claim' },
        { label: 'Or a young Viavenator? No: it lacks the pocket', role: 'else' },
        { label: 'From a bone pocket to hearing: untested', role: 'test' }
      ]
    }), 'ear'),

    figSeg('hurt', 'Hurt', 2, 3, Object.assign(F('bai24-fig1.jpg', 'Aucasaurus, with its damaged bones · Baiano et al. 2024'), {
      zones: [
        { label: 'What injuries say', role: 'claim' },
        { label: 'Born with two tail bones fused', role: 'evidence', rect: [0.5, 0.15, 0.5, 0.85] },
        S('bai24-fig8.jpg', 'Where injuries are found · Baiano et al. 2024', { label: '337+ damaged bones, 39 genera', role: 'evidence' }),
        { label: 'More specimens, more injuries', role: 'else' }
      ]
    })),

    figSeg('orn', 'Show-off size', 3, 3, Object.assign(F('gat16-fig2.jpg', 'Ornaments and body mass · Gates et al. 2016'), {
      zones: [
        { label: 'Ornaments: giants grew faster', role: 'claim' },
        { label: 'Red: crest or horn', role: 'evidence' },
        S('gat16-fig1.jpg', 'Gates et al. 2016', { label: '55 kg: the smallest with ornaments', role: 'evidence' })
      ]
    })),

    figSeg('auca', 'Aucasaurus', 3, 2.5, Object.assign(F('photo-auca-mount.jpg', 'Aucasaurus, restored · Conty, CC BY 3.0'), {
      zones: [
        { label: 'Aucasaurus, Patagonia' },
        S('bai23-fig1.jpg', 'Aucasaurus · Baiano et al. 2023', { label: 'Most complete tail known', rect: [0, 0.1, 0.7, 0.4] }),
        S('bai23-fig33.jpg', 'Bone honeycomb · Baiano et al. 2023', { label: 'Air spaces in the tail', role: 'evidence' })
      ]
    })),

    /* ---------------------------------------------------------- the end */
    {
      id: 'wall', title: 'The evidence', min: 2, tier: 1,
      builds: [{ rail: 'evidence' }, { rail: 'sure' }],
      items: [{
        kind: 'wall', box: [0, 100, 1600, 690], tiles: [
          { id: 'africa', label: 'Africa linked', src: 'img/ser04-fig3.jpg', pos: '50% 30%' },
          { id: 'chena', label: 'Africa to the end', src: 'img/lon17-fig3.jpg', pos: '50% 30%' },
          { id: 'arms', label: 'Display arms', src: 'img/bur12-fig8.jpg' },
          { id: 'bite', label: 'Weak, fast bite', src: 'img/maz09-fig4.jpg', pos: '50% 20%' },
          { id: 'marks', label: 'Cannibals', src: 'img/rog03-fig2.jpg', pos: '50% 20%' },
          { id: 'sprint', label: 'Sprinter', src: 'img/per11-fig5.jpg' },
          { id: 'horns', label: 'Gentle pushing', src: 'img/maz09-fig6.jpg', pos: '50% 20%' },
          { id: 'skin', label: 'Display scales', src: 'img/hen21-fig5.jpg', pos: '30% 30%' },
          { id: 'limus', label: 'Beak with age', src: 'img/wan17-fig2.jpg', pos: '30% 40%', tier: 2 },
          { id: 'ear', label: 'Hearing', src: 'img/gia21-fig15.jpg', tier: 2 }
        ]
      }]
    }
  ];

  root.ABEL = {
    rail: [
      { key: 'claim', label: 'Claim' },
      { key: 'evidence', label: 'Evidence' },
      { key: 'else', label: 'Else?' },
      { key: 'test', label: 'Test' },
      { key: 'sure', label: 'Sure?' }
    ],
    railTitle: '',
    segments
  };
})(this);
