/* Every word on screen. Edit wording here; nothing in this file touches layout.
 *
 * The deck is for talking over: animals and maps first, a few words at most.
 * It goes animal by animal, in the order of the family tree. Each animal gets a
 * picture slide and, for the best ones, a claim slide: the claim up top, the
 * evidence as pictures, the alternatives as small chips. The five question icons
 * (claim, evidence, else, test, sure) mark the labels; nothing is stepped through
 * except the family slide and the vote bar.
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
  const sureItem = (id, at) => Object.assign({ kind: 'sure', id, at }, SURE);

  /* F('name.jpg', caption): a picture from img/ with its size from dims.js.
   * S adds a label, a role icon, a crop [l, t, r, b] or any other field. */
  const S = (name, cap, extra) => Object.assign({ src: 'img/' + name, w: window.DIMS[name][0], h: window.DIMS[name][1], cap: cap || '' }, extra || {});
  const F = S;

  /* A figure scene with pills (used for the family only). */
  const figSeg = (id, title, tier, min, fig) => {
    const zones = fig.zones;
    const builds = [{}].concat(zones.map(() => ({})));
    const main = Object.assign({ kind: 'fig', box: [0, 100, 1600, 690], imgBox: [40, 8, 1010, 672] }, fig);
    return { id, title, min, tier, builds, items: [main] };
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

  const partTitle = (id, n, text, tier) => ({ id, title: text, min: 0.3, tier: tier || 1, builds: [{}], items: [{ kind: 'title', box: [100, 200, 1400, 500], n, text }] });

  const sortSeg = (id, title, tier, min, bins, cards) => ({
    id, title, min, tier,
    builds: [{}].concat(cards.map(() => ({}))).concat([{}]),
    items: [{ kind: 'sort', id, box: [0, 100, 1600, 690], finalAt: cards.length + 1, bins, cards: cards.map((c, i) => Object.assign({ at: i + 1 }, c)) }]
  });

  const MAP = 'Scotese et al., PALEOMAP (CC BY 4.0)';
  const CC = (n) => ({ name: n });
  void CC;

  const segments = [
    /* ---------------------------------------------------------- cover */
    {
      id: 'title', title: 'Abelisaurs', min: 1, tier: 1, builds: [{}],
      items: [{ kind: 'cover', box: [0, 0, 1600, 790], pic: 'img/wiki-majungasaurus-size.jpg', title: 'Abelisaurs' }]
    },

    /* ---------------------------------------------------------- part 1: the poster animal */
    partTitle('p1', 1, 'Carnotaurus'),

    plateSeg('meet', 'Carnotaurus', 1, 2, {
      head: { name: '_Carnotaurus_', facts: 'Patagonia · 70 Ma · 7.8 m' },
      panels: [S('hen21-fig2.jpg', 'Carnotaurus, with the six pieces of skin found · Hendrickx & Bell 2021')]
    }),

    plateSeg('bite', 'The bite', 1, 3.5, {
      head: { name: '_Carnotaurus_', claim: 'Weak, but fast jaws' }, side: true,
      panels: [
        S('photo-carno-skull.jpg', 'photo: AStrangerintheAlps, CC BY-SA 3.0', { crop: [0, 0.12, 1, 0.78] }),
        S('maz09-fig4.jpg', 'Stress in a bite (light: low) · Mazzetta et al. 2009', { crop: [0, 0, 1, 0.5], label: 'Peak bite 3,341 N. _Allosaurus_: 3,573 N', role: 'evidence' })
      ],
      foot: [{ text: 'Small prey: speed beats force', role: 'else' }, { text: 'Or hatchet strikes: the skull holds', role: 'else' }]
    }, 'bite'),

    plateSeg('horns', 'Horns', 1, 4, {
      head: { name: '_Carnotaurus_', claim: 'Horns for ramming?' }, side: true,
      panels: [
        S('maz09-fig6.jpg', 'Blow on the horn, modelled · Mazzetta et al. 2009', { label: 'Hard, fast blows: no', role: 'evidence' }),
        S('del18-fig4.jpg', 'Soft tissue on the skull · Delcourt 2018', { label: 'Padded, slow pushing?', role: 'else' })
      ],
      foot: [{ text: 'Or just display', role: 'else' }]
    }, 'horns'),

    plateSeg('skin', 'Skin', 1, 3.5, {
      head: { name: '_Carnotaurus_', claim: 'Scales, not feathers' }, side: true,
      panels: [S('hen21-fig5.jpg', 'Skin from the ribs · Hendrickx & Bell 2021', { label: 'Big cones, 20–65 mm, scattered', role: 'evidence' })],
      foot: [{ text: 'Best skin of any theropod', role: 'evidence' }, { text: 'Armor? Little help against bites', role: 'else' }, { text: 'Display, colour. Or heat: a guess', role: 'else' }]
    }, 'skin'),

    plateSeg('tail', 'The tail', 1, 4, {
      head: { name: '_Carnotaurus_', claim: 'A sprinter?' }, side: true,
      panels: [
        S('per11-fig5.jpg', 'Tail cross-section · Persons & Currie 2011', { label: 'Tail-to-thigh muscle: 222 kg', role: 'evidence' }),
        S('per11-fig1.jpg', 'Tail bone · Persons & Currie 2011', { label: 'Ribs locked together: stiff', role: 'else' })
      ],
      foot: [{ text: '15% of body mass. _T. rex_: 9%', role: 'evidence' }, { text: 'A model, not a speed', role: 'test' }]
    }, 'sprint'),

    plateSeg('skin12', 'Not like the others', 2, 2.5, {
      head: { name: '_Carnotaurus_', claim: 'Skin unlike other meat-eaters' },
      panels: [S('hen21-fig12.jpg', 'Dinosaur skin · Hendrickx & Bell 2021')]
    }),

    /* ---------------------------------------------------------- part 2: the family */
    partTitle('p2', 2, 'The family'),

    figSeg('family', 'The family', 1, 3, Object.assign(F('gri17-fig3.jpg', 'Six ceratosaurs to one scale (0–8 m) · Grillo & Delcourt 2017'), {
      imgBox: [40, 8, 480, 672], aside: [560, 10, 1000, 660], pills: false, zones: [
        { label: '_Carnotaurus_', rect: [0, 0, 1, 0.205], aside: S('photo-carno-skull.jpg', 'The skull · photo: AStrangerintheAlps, CC BY-SA 3.0', { crop: [0, 0.1, 1, 0.8] }) },
        { label: '_Skorpiovenator_', rect: [0, 0.215, 1, 0.16], aside: S('photo-skorp-field.jpg', 'As found (museum display)') },
        { label: '_Aucasaurus_', rect: [0, 0.385, 1, 0.16], aside: S('photo-auca-mount.jpg', 'Restored · Conty, CC BY 3.0') },
        { label: '_Majungasaurus_', rect: [0, 0.565, 1, 0.15], aside: S('photo-maj-mount.jpg', 'The mount · photo: Kumiko, CC BY-SA 2.0') },
        { label: '_Eoabelisaurus_', rect: [0, 0.735, 1, 0.15], aside: S('photo-eoabel-mount.jpg', 'The mount · photo: Jl FilpoC, CC BY-SA 4.0') },
        { label: '_Masiakasaurus_', rect: [0, 0.9, 1, 0.1], aside: S('photo-masia-fossil.jpg', 'The bones · photo: CaptMondo, CC BY-SA 3.0') },
        S('wiki-abelisauridae-scale.jpg', 'Five abelisaurids and a person · Slate Weasel, public domain', { label: 'Next to a person' })
      ]
    })),

    plateSeg('skulls', 'Skulls', 2, 3.5, {
      panels: [
        S('del18-fig2.jpg', 'Ceratosaur skulls · Delcourt 2018'),
        S('photo-abel-skull.jpg', '_Abelisaurus_ · photo: Christophe Hendrickx, CC BY-SA 3.0'),
        S('photo-maj-skull.jpg', '_Majungasaurus_, cast · photo: WehaveaTrex, CC BY-SA 4.0'),
        S('photo-raja-exhibit.jpg', '_Rajasaurus_, India · photo: Swapnil Karambelkar, CC BY-SA 4.0')
      ]
    }),

    plateSeg('biggest', 'Biggest?', 2, 3.5, {
      head: { claim: 'Biggest: _Pycnonemosaurus_, 8.9 m' },
      panels: [
        S('gri17-fig2.jpg', 'Tail bones · Grillo & Delcourt 2017', { label: 'Its tail bones, and the same bone in other species', role: 'evidence' }),
        S('gri17-fig7.jpg', 'Body length, 37 specimens · Grillo & Delcourt 2017', { label: '_Carnotaurus_: 7.8 m', role: 'evidence' })
      ],
      foot: [{ text: 'Skull and arm: a poor guide to size', role: 'else' }]
    }),

    plateSeg('tree', 'The tree', 3, 2.5, {
      head: { claim: 'Small noasaurids, big abelisaurids' },
      panels: [S('del18-fig1.jpg', 'Ceratosaurs · Delcourt 2018')]
    }),

    /* ---------------------------------------------------------- part 3: where */
    partTitle('p3', 3, 'Where in the world'),

    plateSeg('world', 'The world then', 1, 2, {
      panels: [
        S('map140.jpg', '140 Ma', { crop: [0.2, 0.1, 0.86, 1] }),
        S('map100.jpg', '100 Ma', { crop: [0.2, 0.1, 0.86, 1] }),
        S('map80.jpg', '80 Ma · ' + MAP, { crop: [0.2, 0.1, 0.86, 1] })
      ]
    }),

    {
      id: 'found', title: 'Where found', min: 2.5, tier: 1, builds: [{}],
      items: [Object.assign({ kind: 'pins', box: [0, 100, 1600, 690] }, S('map80.jpg', 'Where abelisaurs were found, on the 80 Ma map (ages differ) · ' + MAP, {
        crop: [0.2, 0.1, 0.9, 0.98], imgBox: [260, 0, 1080, 650],
        pins: [
          { x: 0.385, y: 0.745, place: 'Patagonia', names: ['Carnotaurus', 'Aucasaurus', 'Skorpiovenator', 'Llukalkan', 'Koleken'], dx: -34, dy: 16, side: 'l' },
          { x: 0.378, y: 0.688, place: 'La Rioja', names: ['Vitosaura'], dx: 50, dy: -24, side: 'r' },
          { x: 0.403, y: 0.625, place: 'Brazil', names: ['Pycnonemosaurus', 'Vespersaurus'], dx: -34, dy: -48, side: 'l' },
          { x: 0.5, y: 0.52, place: 'Niger', names: ['Rugops'], dx: 40, dy: 64, side: 'r' },
          { x: 0.462, y: 0.45, place: 'Morocco', names: ['Chenanisaurus'], dx: -48, dy: -10, side: 'l' },
          { x: 0.502, y: 0.31, place: 'France', names: ['Arcovenator'], dx: 44, dy: -34, side: 'r' },
          { x: 0.594, y: 0.718, place: 'Madagascar', names: ['Majungasaurus'], dx: -30, dy: 56, side: 'l' },
          { x: 0.632, y: 0.7, place: 'India', names: ['Rajasaurus', 'Indosaurus'], dx: 46, dy: 12, side: 'r' }
        ]
      }))]
    },

    plateSeg('big', 'Big everywhere?', 2, 2.5, {
      panels: [S('gri17-fig8.jpg', 'Body length by place and age · Grillo & Delcourt 2017')],
      foot: [{ text: 'Bigger through time', role: 'evidence' }, { text: 'Every region: 4–8 m', role: 'evidence' }]
    }),

    plateSeg('endemic', 'Many lineages', 2, 3, {
      head: { claim: 'An early split, then local lineages' },
      panels: [S('lon17-fig10.jpg', 'Longrich et al. 2017')],
      foot: [{ text: 'Weakly supported', role: 'else' }]
    }),

    /* ---------------------------------------------------------- part 4: the Old World */
    partTitle('p4', 4, 'Africa, Madagascar, Europe'),

    plateSeg('rugops', 'Rugops', 1, 2.5, {
      head: { name: '_Rugops_', facts: 'Niger · 95 Ma', claim: 'Pitted snout, no horns', role: 'claim' },
      panels: [
        S('rugops-art.jpg', 'Restored · art by king-the-kong'),
        S('photo-rugops-maxilla.jpg', 'Snout bones · Ibrahim, Sereno et al., CC BY 4.0', { label: 'The fossil: a snout', role: 'evidence' }),
        S('ser04-fig3.jpg', 'Skull · Sereno et al. 2004', { crop: [0, 0.37, 1, 0.6], label: 'Pits, no horns', role: 'evidence' })
      ]
    }),

    plateSeg('mj', 'Majungasaurus', 1, 2, {
      head: { name: '_Majungasaurus_', facts: 'Madagascar · 70 Ma' },
      panels: [S('photo-maj-mount.jpg', 'The mount · photo: Kumiko, CC BY-SA 2.0')]
    }),

    plateSeg('marks', 'Bite marks', 1, 4, {
      head: { name: '_Majungasaurus_', claim: 'Ate its own kind?' },
      panels: [
        S('rog03-fig1.jpg', 'Tooth-marked bones · Rogers et al. 2003', { label: 'Grooves on 21+ bones, two animals', role: 'evidence' }),
        S('rog03-fig2.jpg', 'Marks, and the teeth that fit · Rogers et al. 2003', { label: 'Spacing matches its jaw', role: 'evidence' }),
        S('rog03-fig4.jpg', 'Other jaws in the same rocks · Rogers et al. 2003', { label: 'Crocodiles: too blunt, uneven', role: 'else' })
      ],
      foot: [{ text: 'Killed, or scavenged? Unknown', role: 'test' }]
    }, 'marks'),

    sortSeg('who', 'Who bit it?', 2, 3,
      [{ id: 'fits', label: 'Could have' }, { id: 'out', label: 'Ruled out' }],
      [
        { id: 'w1', text: '_Majungatholus_: even spacing, 2 denticles per mm', to: 'fits', basis: 'matches' },
        { id: 'w2', text: '_Trematochampsa_: blunt, uneven teeth', to: 'out', basis: 'wrong shape' },
        { id: 'w3', text: '_Mahajangasuchus_: conical, variable teeth', to: 'out', basis: 'wrong shape' },
        { id: 'w4', text: '_Masiakasaurus_: too small', to: 'out', basis: 'too small' }
      ]),

    plateSeg('teeth', 'Fast teeth', 1, 3.5, {
      head: { name: '_Majungasaurus_', claim: 'Teeth replaced fast' },
      panels: [
        S('dem19-fig3.jpg', 'Tooth replacement · D\'Emic et al. 2019', { crop: [0, 0.02, 1, 0.5], label: '56 days. _Allosaurus_: about 100', role: 'evidence' }),
        S('dem19-fig3.jpg', 'Tooth replacement · D\'Emic et al. 2019', { crop: [0, 0.53, 1, 1], label: 'Body size: no link', role: 'evidence' })
      ],
      foot: [{ text: 'Wear from bone? A guess', role: 'else' }]
    }),

    plateSeg('arms', 'Arms', 1, 3.5, {
      head: { name: '_Majungasaurus_', claim: 'Short arms, no grasp. Display?' },
      panels: [
        S('bur12-fig2.jpg', 'Shoulder and arm · Burch & Carrano 2012', { label: 'Forearm: a quarter of the upper arm', role: 'evidence' }),
        S('bur12-fig8.jpg', 'Hand · Burch & Carrano 2012', { label: 'Four fingers, no wrist bones', role: 'evidence' }),
        S('del18-fig3.jpg', '_Deltadromeus_ · Delcourt 2018', { crop: [0.02, 0.03, 0.54, 0.48], label: 'Not all: _Deltadromeus_, long arms' })
      ],
      foot: [{ text: 'No evidence of use is not evidence of none', role: 'else' }]
    }, 'arms'),

    plateSeg('chena', 'Chenanisaurus', 1, 3.5, {
      head: { name: '_Chenanisaurus_', facts: 'Morocco · latest Cretaceous', claim: 'Africa had abelisaurids to the end' },
      panels: [
        S('chena-art.jpg', 'Restored · Nick Longrich, CC BY-SA 4.0'),
        S('lon17-fig3.jpg', 'The jaw · Longrich et al. 2017', { crop: [0, 0.06, 1, 0.62], label: 'A partial jaw, a few teeth', role: 'evidence' }),
        S('lon17-fig11.jpg', 'Latest Cretaceous abelisaurids · Longrich et al. 2017', { label: 'Africa: still there', role: 'claim' })
      ],
      foot: [{ text: 'Size and looks from a jaw? Not really', role: 'test' }, { text: 'Press: "smaller brain", scales', role: 'else' }]
    }, 'chena'),

    plateSeg('arco', 'Arcovenator', 1, 3.5, {
      head: { name: '_Arcovenator_', facts: 'France · late Campanian', claim: 'An abelisaurid in Europe' },
      panels: [
        S('arco-art.jpg', 'Restored · Danny Cicchetti, CC BY-SA 3.0'),
        S('tor14-fig2.jpg', 'Braincase · Tortosa et al. 2014', { label: 'A braincase', role: 'evidence' }),
        S('tor14-fig7.jpg', 'Tortosa et al. 2014', { label: 'Kin: India and Madagascar', role: 'evidence' })
      ],
      foot: [{ text: 'So: across a sea, from Africa?', role: 'else' }]
    }),

    /* ---------------------------------------------------------- part 5: South America */
    partTitle('p5', 5, 'South America', 2),

    plateSeg('skorp', 'Skorpiovenator', 2, 3, {
      head: { name: '_Skorpiovenator_', facts: 'Patagonia · 6 m', claim: 'Isolated teeth may be abelisaurs' },
      panels: [
        S('skorp-art.jpg', 'Restored · Dinosauria-Freak, public domain'),
        S('can09-fig1.jpg', 'Found in plaster · Canale et al. 2009'),
        S('can09-fig2.jpg', 'Canale et al. 2009', { crop: [0, 0.74, 1, 1], label: 'Teeth like a giant meat-eater', role: 'evidence' })
      ],
      foot: [{ text: 'Or: carcharodontosaurs, as thought', role: 'else' }]
    }),

    plateSeg('hurt', 'Hurt', 2, 3, {
      head: { name: '_Aucasaurus_', facts: 'Patagonia', claim: 'What injuries say' },
      panels: [
        S('photo-auca-mount.jpg', 'Restored · Conty, CC BY 3.0'),
        S('bai24-fig1.jpg', 'Damaged bones · Baiano et al. 2024', { label: 'Born with two tail bones fused', role: 'evidence' }),
        S('bai24-fig8.jpg', 'Where injuries are found · Baiano et al. 2024', { label: '337+ damaged bones, 39 genera', role: 'evidence' })
      ],
      foot: [{ text: 'More specimens, more injuries', role: 'else' }]
    }),

    plateSeg('auca', 'Air in the tail', 3, 2.5, {
      head: { name: '_Aucasaurus_', claim: 'Air spaces in the tail' },
      panels: [
        S('bai23-fig1.jpg', 'Most complete tail known · Baiano et al. 2023'),
        S('bai23-fig33.jpg', 'Bone honeycomb · Baiano et al. 2023', { label: 'Air spaces in the bone', role: 'evidence' })
      ]
    }),

    plateSeg('ear', 'Llukalkan', 2, 3.5, {
      head: { name: '_Llukalkan_', facts: 'Patagonia · Santonian', claim: 'A different way of hearing?' },
      panels: [
        S('photo-llukalkan-cast.jpg', 'Skull cast, being assembled · photo: Brancasaurio, CC BY 4.0'),
        S('gia21-fig12.jpg', 'Braincase, from CT · Gianechini et al. 2021', { label: 'A pocket behind the ear bone', role: 'evidence' }),
        S('gia21-fig15.jpg', 'Brain and inner ear · Gianechini et al. 2021', { label: 'Inner ear: hard to see', role: 'else' })
      ],
      foot: [{ text: 'From a bone pocket to hearing: untested', role: 'test' }, { text: 'Or a young _Viavenator_? It lacks the pocket', role: 'else' }]
    }, 'ear'),

    plateSeg('koleken', 'Koleken', 2, 2.5, {
      head: { name: '_Koleken_', facts: 'Patagonia, with _Carnotaurus_', claim: 'A new kin of _Carnotaurus_' },
      panels: [
        S('photo-koleken-holo.jpg', 'The bones laid out · photo: Amalia Villafañe, CC BY 2.5 ar'),
        S('pol24-fig2.jpg', 'Pol et al. 2024', { label: 'Its own set of skull features', role: 'evidence' }),
        S('pol24-fig17.jpg', 'Tibia bone · Pol et al. 2024', { label: 'Six years old, still growing', role: 'evidence' })
      ]
    }),

    plateSeg('vito', 'Vitosaura', 3, 2.5, {
      head: { name: '_Vitosaura_', facts: 'La Rioja · new in 2025', claim: 'Place in the tree: unsure', role: 'else' },
      panels: [S('vel25-fig5.jpg', 'Velandia et al. 2025'), S('vel25-fig1.jpg', 'La Rioja · Velandia et al. 2025')]
    }),

    plateSeg('orn', 'Show-off size', 3, 3, {
      head: { claim: 'Ornaments: giants grew faster' },
      panels: [
        S('gat16-fig2.jpg', 'Ornaments and body mass · Gates et al. 2016', { label: 'Red: crest or horn', role: 'evidence' }),
        S('gat16-fig1.jpg', 'Gates et al. 2016', { label: '55 kg: the smallest with ornaments', role: 'evidence' })
      ]
    }),

    /* ---------------------------------------------------------- part 6: small cousins */
    partTitle('p6', 6, 'Small cousins', 2),

    plateSeg('limus', 'Limusaurus', 2, 3.5, {
      head: { name: '_Limusaurus_', facts: 'China · Jurassic', claim: 'Toothed young, toothless adult' },
      panels: [
        S('photo-limus-holo.jpg', 'The holotype slab · photo: Kumiko, CC BY-SA 2.0'),
        S('wan17-fig1.jpg', 'Six ages · Wang et al. 2017', { label: 'Six ages', role: 'evidence' }),
        S('wan17-fig2.jpg', 'Jaws by age · Wang et al. 2017', { label: 'Teeth lost, beak formed', role: 'evidence' })
      ],
      foot: [{ text: 'Adults: plant-eater chemistry (isotopes)', role: 'evidence' }]
    }, 'limus'),

    plateSeg('vesper', 'Vespersaurus', 2, 2.5, {
      head: { name: '_Vespersaurus_', facts: 'Brazil · 1 m · desert', claim: 'Thin outer toes, blade claws' },
      panels: [
        S('photo-vesper-art.jpg', 'Restored · Ildarotyrannus, CC BY-SA 4.0'),
        S('lan19-fig10.jpg', 'Langer et al. 2019', { label: 'The foot', role: 'evidence' })
      ],
      foot: [{ text: 'Same rocks: footprints', role: 'test' }]
    }),

    /* ---------------------------------------------------------- the end */
    {
      id: 'wall', title: 'The evidence', min: 2, tier: 1,
      builds: [{ rail: 'evidence' }, { rail: 'sure' }],
      items: [{
        kind: 'wall', box: [0, 100, 1600, 690], tiles: [
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
