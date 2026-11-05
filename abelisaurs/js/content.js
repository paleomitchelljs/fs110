/* Every word on screen. Edit wording here; nothing in this file touches layout.
 *
 * The deck is for talking over: animals and maps first, a few words at most.
 * Order: where abelisaurs sit among theropods, then an overview of example species,
 * then noasaurids, then abelisaurids by place, with Carnotaurus last. Each animal
 * gets a picture slide and, for the best ones, a claim slide: the claim up top, the
 * evidence as pictures, the alternatives as small chips. The five question icons
 * (claim, evidence, else, test, sure) mark the labels; nothing is stepped through
 * except the example species, the zooms on the two trees and the vote bar.
 *
 * Labels say the plain thing. Use the paper's own term where one exists (caudofemoralis,
 * low-motion headbutting), and give the number rather than an adjective.
 * Show the published figure, even a contentious one, rather than redrawing it.
 * A caption is the citation, plus only what the label above it does not already say.
 * Nothing on a slide repeats what sits next to it. Where evidence is ambiguous, ask
 * the question and give no verdict (unknown, speculation, untested); the readme keeps
 * the papers' wording for saying it aloud.
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

  /* A figure scene with pills (used for the example species only). */
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

  /* A part card. Its number is worked out at the current level (see parts/intro.js). */
  const partTitle = (id, text, tier) => ({ id, title: text.replace(/_/g, ''), min: 0.3, tier: tier || 1, builds: [{}], items: [{ kind: 'title', box: [100, 200, 1400, 500], n: true, text }] });

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

    /* ---------------------------------------------------------- among theropods */
    figSeg('theropods', 'Abelisaurs among theropods', 1, 1.5, Object.assign(F('gat16-fig2.jpg', 'Theropods; red = ornamented · Gates et al. 2016'), {
      imgBox: [40, 8, 690, 672], aside: [770, 130, 790, 420], pills: false, zones: [
        { label: 'Abelisaurs and other ceratosaurs', rect: [0.165, 0.8465, 0.32, 0.0855] }
      ]
    })),

    /* ---------------------------------------------------------- part: example abelisaurs */
    partTitle('p-examples', 'Example Abelisaurs'),

    figSeg('family', 'Six species to scale', 1, 3, Object.assign(F('gri17-fig3.jpg', 'Six ceratosaurs to one scale (0–8 m) · Grillo & Delcourt 2017'), {
      imgBox: [40, 8, 480, 672], aside: [560, 10, 1000, 660], pills: false, zones: [
        { label: '_Carnotaurus_', rect: [0, 0, 1, 0.205], aside: S('photo-carno-skull.jpg', 'The skull · photo: AStrangerintheAlps, CC BY-SA 3.0', { crop: [0, 0.1, 1, 0.8] }) },
        { label: '_Skorpiovenator_', rect: [0, 0.215, 1, 0.16], aside: S('photo-skorp-field.jpg', 'As found (museum display)') },
        { label: '_Aucasaurus_', rect: [0, 0.385, 1, 0.16], aside: S('photo-auca-mount.jpg', 'Restored · Conty, CC BY 3.0') },
        { label: '_Majungasaurus_', rect: [0, 0.565, 1, 0.15], aside: S('photo-maj-mount.jpg', 'The mount · photo: Kumiko, CC BY-SA 2.0') },
        { label: '_Eoabelisaurus_', rect: [0, 0.735, 1, 0.15], aside: S('photo-eoabel-mount.jpg', 'The mount · photo: Jl FilpoC, CC BY-SA 4.0') },
        { label: '_Masiakasaurus_', rect: [0, 0.9, 1, 0.1], aside: S('photo-masia-fossil.jpg', 'The bones · photo: CaptMondo, CC BY-SA 3.0') },
        S('wiki-abelisauridae-scale.jpg', 'Five abelisaurids and a person · Slate Weasel, public domain', { label: 'Next to a person', imgBox: [120, 30, 1360, 630] })
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

    plateSeg('biggest', 'Largest abelisaurid', 2, 3.5, {
      head: { claim: 'Largest: _Pycnonemosaurus_, 8.9 m' },
      panels: [
        S('gri17-fig2.jpg', 'Grillo & Delcourt 2017', { label: 'Its tail bones, and the same bone in other species', role: 'evidence' }),
        S('gri17-fig7.jpg', 'Body length, 37 specimens · Grillo & Delcourt 2017', { label: '_Carnotaurus_: 7.8 m', role: 'evidence' })
      ],
      foot: [{ text: 'Most skull and arm measurements predict length poorly', role: 'else' }]
    }),

    figSeg('tree', 'Ceratosaur tree', 1, 1.5, Object.assign(F('del18-fig1.jpg', 'Ceratosaurs; bars colored by continent · Delcourt 2018'), {
      imgBox: [40, 8, 530, 672], aside: [610, 10, 950, 650], pills: false, zones: [
        { label: 'Noasaurids', rect: [0, 0.105, 1, 0.235] },
        { label: 'Abelisaurids', rect: [0, 0.49, 1, 0.404] }
      ]
    })),

    /* ---------------------------------------------------------- part: noasaurids */
    partTitle('p-noasaurids', 'Noasaurids', 2),

    plateSeg('limus', 'Limusaurus', 2, 3.5, {
      head: { name: '_Limusaurus_', facts: 'China · Jurassic', claim: 'Toothed young, toothless adult' },
      panels: [
        S('photo-limus-holo.jpg', 'The holotype slab · photo: Kumiko, CC BY-SA 2.0'),
        S('wan17-fig1.jpg', 'Wang et al. 2017', { label: 'Six growth stages', role: 'evidence' }),
        S('wan17-fig2.jpg', 'Wang et al. 2017', { label: 'Teeth lost, beak formed', role: 'evidence' })
      ],
      foot: [{ text: 'Adult isotopes plot with herbivores', role: 'evidence' }]
    }, 'limus'),

    plateSeg('vesper', 'Vespersaurus', 2, 2.5, {
      head: { name: '_Vespersaurus_', facts: 'Brazil · 1 m · desert', claim: 'One weight-bearing toe?' },
      panels: [
        S('photo-vesper-art.jpg', 'Restored · Ildarotyrannus, CC BY-SA 4.0'),
        S('lan19-fig10.jpg', 'Langer et al. 2019', { label: 'Thin outer toes, blade-like claws', role: 'evidence' })
      ],
      foot: [{ text: 'Footprints from the same rock unit agree', role: 'test' }]
    }),

    /* ---------------------------------------------------------- part: geography */
    partTitle('p-geography', 'Geography'),

    plateSeg('world', 'Continents at 140, 100 and 80 Ma', 1, 2, {
      panels: [
        S('map140.jpg', '140 Ma', { crop: [0.2, 0.1, 0.86, 1] }),
        S('map100.jpg', '100 Ma', { crop: [0.2, 0.1, 0.86, 1] }),
        S('map80.jpg', '80 Ma · ' + MAP, { crop: [0.2, 0.1, 0.86, 1] })
      ]
    }),

    /* The key follows Longrich et al.'s caption to Fig. 11. "Unnamed" is their "Abelisauridae indet." or a site name. */
    plateSeg('found', 'Fossil localities', 1, 2.5, {
      panels: [S('lon17-fig11.jpg', 'Campanian–Maastrichtian abelisaurids · Longrich et al. 2017')],
      key: [
        { n: '1', text: '_Chenanisaurus_, Morocco' },
        { n: '2', text: 'Unnamed, Egypt' },
        { n: '3', text: 'Unnamed, Saudi Arabia' },
        { n: '4', text: '_Arcovenator_ + 3 others, France' },
        { n: '5', text: '_Vitakridrinda_, Pakistan' },
        { n: '6', text: '_Rajasaurus_, _Indosaurus_ + 2 others, India' },
        { n: '7', text: 'Unnamed, India' },
        { n: '8', text: '_Majungasaurus_, Madagascar' },
        { n: '9', text: '_Carnotaurus_, Patagonia' },
        { n: '10', text: '_Aucasaurus_, _Abelisaurus_, _Quilmesaurus_, Patagonia' },
        { n: '11, 12', text: 'Unnamed, Brazil' },
        { n: '13', text: '_Pycnonemosaurus_, Brazil' },
        { n: '14', text: 'Unnamed, Colombia' }
      ]
    }),

    plateSeg('big', 'Body length by region and age', 2, 2.5, {
      panels: [S('gri17-fig8.jpg', 'Body length by place and age · Grillo & Delcourt 2017')],
      foot: [{ text: 'Longer through time', role: 'evidence' }, { text: 'Within a region and epoch: usually 4–8 m', role: 'evidence' }]
    }),

    plateSeg('endemic', 'Regional lineages', 2, 3, {
      head: { claim: 'Continents split, then regional lineages' },
      panels: [S('lon17-fig10.jpg', 'Longrich et al. 2017')]
    }),

    plateSeg('rugops', 'Rugops', 1, 2.5, {
      head: { name: '_Rugops_', facts: 'Niger · 95 Ma', claim: 'Pitted snout, no horns', role: 'claim' },
      panels: [
        S('rugops-art.jpg', 'Restored · art by king-the-kong'),
        S('photo-rugops-maxilla.jpg', 'Ibrahim, Sereno et al., CC BY 4.0', { label: 'Maxilla: gray in the skull drawing', role: 'evidence' }),
        S('ser04-fig3.jpg', 'Sereno et al. 2004', { crop: [0, 0.37, 1, 0.6], label: 'Skull', role: 'evidence' })
      ]
    }),

    plateSeg('mj', 'Majungasaurus', 1, 2, {
      head: { name: '_Majungasaurus_', facts: 'Madagascar · 70 Ma' },
      panels: [S('photo-maj-mount.jpg', 'The mount · photo: Kumiko, CC BY-SA 2.0')]
    }),

    plateSeg('marks', 'Tooth marks', 1, 4, {
      head: { name: '_Majungasaurus_', claim: 'Cannibalism?' },
      panels: [
        S('rog03-fig1.jpg', 'Rogers et al. 2003', { label: 'Tooth marks on 21+ bones, 2 individuals', role: 'evidence' }),
        S('rog03-fig2.jpg', 'Rogers et al. 2003', { label: 'Mark spacing matches its teeth', role: 'evidence' }),
        S('rog03-fig4.jpg', 'Rogers et al. 2003', { label: 'Crocodyliform teeth: too blunt, irregular', role: 'else' })
      ],
      foot: [{ text: 'Killed or scavenged', role: 'test' }]
    }, 'marks'),

    sortSeg('who', 'Which animal made the marks?', 2, 3,
      [{ id: 'fits', label: 'Possible' }, { id: 'out', label: 'Ruled out' }],
      [
        { id: 'w1', text: '_Majungasaurus_: even spacing, 2 denticles per mm', to: 'fits', basis: 'matches' },
        { id: 'w2', text: '_Trematochampsa_: blunt, uneven teeth', to: 'out', basis: 'wrong shape' },
        { id: 'w3', text: '_Mahajangasuchus_: conical, variable teeth', to: 'out', basis: 'wrong shape' },
        { id: 'w4', text: '_Masiakasaurus_: too small', to: 'out', basis: 'too small' }
      ]),

    plateSeg('teeth', 'Tooth replacement', 1, 3.5, {
      head: { name: '_Majungasaurus_' },
      panels: [
        S('dem19-fig3.jpg', 'D\'Emic et al. 2019', { crop: [0, 0, 1, 0.5345] }),
        S('dem19-fig3.jpg', 'D\'Emic et al. 2019', { crop: [0, 0.5585, 1, 1] })
      ],
      between: { text: 'High tooth replacement rate', role: 'evidence' },
      foot: [{ text: 'Why replace teeth quickly?', role: 'else' }]
    }),

    plateSeg('arms', 'Arms', 1, 3.5, {
      head: { name: '_Majungasaurus_', claim: 'Reduced arms, no grasping. Display?' },
      panels: [
        S('bur12-fig2.jpg', 'Burch & Carrano 2012', { label: 'Forearm: a quarter of the upper arm', role: 'evidence' }),
        S('bur12-fig8.jpg', 'Burch & Carrano 2012', { label: 'Four fingers, no ossified wrist bones', role: 'evidence' }),
        S('del18-fig3.jpg', 'Delcourt 2018', { crop: [0.011, 0.011, 0.46, 0.558], label: '_Deltadromeus_: slender humerus' })
      ],
      foot: [{ text: 'How were the arms used?', role: 'else' }]
    }, 'arms'),

    plateSeg('chena', 'Chenanisaurus', 1, 3.5, {
      head: { name: '_Chenanisaurus_', facts: 'Morocco · latest Cretaceous', claim: 'In Africa until just before the extinction' },
      panels: [
        S('chena-art.jpg', 'Restored · Nick Longrich, CC BY-SA 4.0'),
        S('lon17-fig3.jpg', 'Longrich et al. 2017', { crop: [0, 0.06, 1, 0.62], label: 'A partial jaw, a few teeth', role: 'evidence' }),
        S('lon17-fig11.jpg', 'Campanian–Maastrichtian abelisaurids · Longrich et al. 2017', { label: 'No. 1 is _Chenanisaurus_', role: 'claim' })
      ],
      foot: [{ text: 'Jaw-Body size scaling difficult', role: 'test' }]
    }, 'chena'),

    plateSeg('arco', 'Arcovenator', 1, 3.5, {
      head: { name: '_Arcovenator_', facts: 'France · late Campanian', claim: 'An abelisaurid in Europe' },
      panels: [S('arco-art.jpg', 'Restored · Danny Cicchetti, CC BY-SA 3.0')],
      tall: S('tor14-fig7.jpg', 'Tortosa et al. 2014', { label: 'Closest relatives: India and Madagascar', role: 'evidence' }),
      foot: [{ text: 'How did it get to Europe?', role: 'else' }]
    }),

    /* ---------------------------------------------------------- part: South America */
    partTitle('p-samerica', 'South America', 2),

    plateSeg('skorp', 'Skorpiovenator', 2, 3, {
      head: { name: '_Skorpiovenator_', facts: 'Patagonia · 6 m', claim: 'Isolated teeth may be abelisaurid' },
      panels: [
        S('skorp-art.jpg', 'Restored · Dinosauria-Freak, public domain'),
        S('can09-fig1.jpg', 'Skeleton in its plaster jacket · Canale et al. 2009'),
        S('can09-fig2.jpg', 'Canale et al. 2009', { crop: [0, 0.74, 1, 1], label: 'Enamel wrinkles, as in carcharodontosaurs', role: 'evidence' })
      ],
      foot: [{ text: 'Or carcharodontosaur teeth, as first identified', role: 'else' }]
    }),

    plateSeg('hurt', 'Injuries', 2, 3, {
      head: { name: '_Aucasaurus_', facts: 'Patagonia', claim: 'Injuries differ by taxon and body region' },
      panels: [
        S('photo-auca-mount.jpg', 'Restored · Conty, CC BY 3.0'),
        S('bai24-fig1.jpg', 'Baiano et al. 2024', { label: 'Born with two tail bones fused', role: 'evidence' }),
        S('bai24-fig8.jpg', 'Baiano et al. 2024', { label: 'More than 337 damaged bones, 39 genera', role: 'evidence' })
      ],
      foot: [{ text: 'Sample mostly medium to large theropods', role: 'else' }]
    }),

    plateSeg('auca', 'Tail air spaces', 3, 2.5, {
      head: { name: '_Aucasaurus_', claim: 'Air spaces in the tail' },
      panels: [
        S('bai23-fig1.jpg', 'Most complete brachyrostran tail known · Baiano et al. 2023'),
        S('bai23-fig33.jpg', 'Baiano et al. 2023', { label: 'Camellate bone', role: 'evidence' })
      ]
    }),

    plateSeg('ear', 'Llukalkan', 2, 3.5, {
      head: { name: '_Llukalkan_', facts: 'Patagonia · Santonian', claim: 'Different hearing from other abelisaurids?' },
      panels: [
        S('photo-llukalkan-cast.jpg', 'Skull cast, being assembled · photo: Brancasaurio, CC BY 4.0'),
        S('gia21-fig12.jpg', 'Braincase, from CT · Gianechini et al. 2021', { label: 'Possible caudal tympanic recess', role: 'evidence' }),
        S('gia21-fig15.jpg', 'Gianechini et al. 2021', { label: 'Inner ear: hard to discern in CT', role: 'else' })
      ],
      foot: [{ text: 'Juvenile _Viavenator_? It lacks the recess', role: 'else' }]
    }, 'ear'),

    plateSeg('koleken', 'Koleken', 2, 2.5, {
      head: { name: '_Koleken_', facts: 'Patagonia · same formation as _Carnotaurus_', claim: 'Related to _Carnotaurus_' },
      panels: [
        S('photo-koleken-holo.jpg', 'The bones laid out · photo: Amalia Villafañe, CC BY 2.5 ar'),
        S('pol24-fig2.jpg', 'Pol et al. 2024', { label: '8 unique features, 6 in the skull', role: 'evidence' }),
        S('pol24-fig17.jpg', 'Tibia bone · Pol et al. 2024', { label: 'At least 6 years old, not fully grown', role: 'evidence' })
      ]
    }),

    plateSeg('vito', 'Vitosaura', 3, 2.5, {
      head: { name: '_Vitosaura_', facts: 'La Rioja · named 2025', claim: 'Recovered in multiple positions in the tree', role: 'else' },
      panels: [S('vel25-fig5.jpg', 'Velandia et al. 2025'), S('vel25-fig1.jpg', 'Velandia et al. 2025')]
    }),

    /* ---------------------------------------------------------- part: Carnotaurus, last */
    partTitle('p-carnotaurus', '_Carnotaurus_'),

    plateSeg('meet', 'Carnotaurus', 1, 2, {
      head: { name: '_Carnotaurus_', facts: 'Patagonia · 70 Ma · 7.8 m' },
      panels: [S('hen21-fig2.jpg', 'With the six pieces of skin found · Hendrickx & Bell 2021')]
    }),

    plateSeg('bite', 'Bite force', 1, 3.5, {
      head: { name: '_Carnotaurus_', claim: 'Weak but fast bite' }, side: true,
      panels: [
        S('photo-carno-skull.jpg', 'photo: AStrangerintheAlps, CC BY-SA 3.0', { crop: [0, 0.12, 1, 0.78] }),
        S('maz09-fig4.jpg', 'Stress in a bite (light: low) · Mazzetta et al. 2009', { crop: [0, 0, 1, 0.5], label: 'Bite force 3,341–5,274 N (two models)', role: 'evidence' })
      ],
      foot: [{ text: '_Allosaurus_: 3,573 N. _Giganotosaurus_: 13,258 N', role: 'evidence' }, { text: 'Small prey?', role: 'else' }, { text: 'Hatchet-bite?', role: 'else' }]
    }, 'bite'),

    plateSeg('horns', 'Horns', 1, 4, {
      head: { name: '_Carnotaurus_', claim: 'Headbutting?' },
      panels: [
        S('del18-fig4.jpg', 'Delcourt 2018', { label: 'Low-motion headbutting, over soft tissue?', role: 'else' }),
        S('maz09-fig6.jpg', 'Finite element model · Mazzetta et al. 2009', { label: 'Severe, rapid blows: the skull would fail', role: 'evidence', at: 1 })
      ]
    }, 'horns'),

    plateSeg('orn', 'Ornaments and body size', 3, 3, {
      head: { claim: 'Ornamented lineages reached large size 20× faster' },
      panels: [
        S('gat16-fig2.jpg', 'Gates et al. 2016', { label: 'Red: crest or horn', role: 'evidence' }),
        S('gat16-fig1.jpg', 'Gates et al. 2016', { label: 'Ornaments do not originate below about 55 kg', role: 'evidence' })
      ]
    }),

    plateSeg('skin', 'Skin', 1, 3.5, {
      head: { name: '_Carnotaurus_', claim: 'Scales, not feathers' }, side: true,
      panels: [S('hen21-fig5.jpg', 'Skin from the ribs · Hendrickx & Bell 2021', { label: 'Conical scales, 20–65 mm, randomly scattered', role: 'evidence' })],
      foot: [{ text: 'Most completely preserved skin of any theropod', role: 'evidence' }, { text: 'As armor: very little protection from bites', role: 'else' }, { text: 'Display or heat loss?', role: 'else' }]
    }, 'skin'),

    plateSeg('skin12', 'Skin across dinosaurs', 2, 2.5, {
      head: { name: '_Carnotaurus_', claim: 'Scales compared across dinosaurs', role: '' },
      panels: [S('hen21-fig12.jpg', 'Hendrickx & Bell 2021')]
    }),

    plateSeg('tail', 'Tail muscles', 1, 4, {
      head: { name: '_Carnotaurus_', claim: 'Short-burst sprinter?' }, side: true,
      panels: [
        S('per11-fig5.jpg', 'Tail cross-section · Persons & Currie 2011', { label: 'Caudofemoralis (tail-to-thigh muscle): 222 kg', role: 'evidence' }),
        S('per11-fig1.jpg', 'Persons & Currie 2011', { label: 'Interlocking tail ribs: reduced turning', role: 'else' })
      ],
      foot: [{ text: 'Caudofemoralis: 15% of body mass. _T. rex_: 9%', role: 'evidence' }, { text: 'No speed calculated: inferred from muscle mass', role: 'test' }]
    }, 'sprint'),

    /* ---------------------------------------------------------- the end */
    {
      id: 'wall', title: 'The evidence', min: 2, tier: 1,
      builds: [{ rail: 'evidence' }, { rail: 'sure' }],
      items: [{
        kind: 'wall', box: [0, 100, 1600, 690], tiles: [
          { id: 'limus', label: 'Beak with age', src: 'img/wan17-fig2.jpg', pos: '30% 40%', tier: 2 },
          { id: 'marks', label: 'Cannibalism', src: 'img/rog03-fig2.jpg', pos: '50% 20%' },
          { id: 'arms', label: 'Arms for display', src: 'img/bur12-fig8.jpg' },
          { id: 'chena', label: 'Africa until the extinction', src: 'img/lon17-fig3.jpg', pos: '50% 30%' },
          { id: 'ear', label: 'Different hearing', src: 'img/gia21-fig15.jpg', tier: 2 },
          { id: 'bite', label: 'Weak, fast bite', src: 'img/maz09-fig4.jpg', pos: '50% 20%' },
          { id: 'horns', label: 'Low-motion headbutting', src: 'img/maz09-fig6.jpg', pos: '50% 20%' },
          { id: 'skin', label: 'Scales for display', src: 'img/hen21-fig5.jpg', pos: '30% 30%' },
          { id: 'sprint', label: 'Short-burst sprinting', src: 'img/per11-fig5.jpg' }
        ]
      }]
    }
  ];

  root.ABEL = {
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
