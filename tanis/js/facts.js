/* The Tanis fact cards. One list feeds the page and the printed sheet
 * (tools/make_cards.js writes cards.tex from it), so they can't drift apart.
 *
 * n      the number printed on the card and listed in the dropdown. It was
 *        drawn at random (seed 20261007) so the number says nothing about
 *        where a fact belongs in the argument. Don't renumber after printing.
 * text   the fact, as the student reads it. Cards carry no title, so nothing
 *        on a card hints at which hypothesis the fact favours.
 *
 * The array is kept in the order the argument builds, which is not the order
 * the cards come out. */
(function () {
  'use strict';
  const FACTS = [
    { n: 15, id: 'location',
      text: 'The Tanis fossil site is in what is now North Dakota, in rocks from the end of the Cretaceous. At the time it was deposited, this area was near the Western Interior Seaway, a vast inland sea that covered much of the middle of North America. It was and is located about 3,000 kilometers from Chicxulub (where the asteroid hit).' },
    { n: 11, id: 'tsunami',
      text: 'A tsunami would take 18 to 24 hours to travel 3,000 kilometers.' },
    { n: 14, id: 'ejecta',
      text: 'When an asteroid hits Earth, molten rock gets blasted into the atmosphere and rains down as glass beads called “tektites” or “spherules.” These beads would begin raining down on what is now northern North America within an hour (15–45 minutes) of the asteroid impact at Chicxulub.' },
    { n: 8, id: 'seismic',
      text: 'When the asteroid that killed the non-avian dinosaurs struck Chicxulub, Mexico, it triggered a massive earthquake. Seismic waves from such an impact travel through the Earth’s crust at a very high speed, on the order of 300 kilometers per minute.' },
    { n: 7, id: 'gills',
      text: 'Dozens of fossilized freshwater sturgeon and paddlefish at the Tanis site were found with glass tektites lodged in their gills. These tektites were localized to the gills—they have not been found in the digestive tracts (stomachs or intestines) of the fish. Chemical analysis showed these glass tektites had a specific chemical composition of ~60% silica, ~15% aluminum oxide, and ~5% calcium oxide, which is a rare combination.' },
    { n: 18, id: 'seiche',
      text: 'A seiche (pronounced “saysh”) is a standing wave that oscillates in an enclosed body of water (like a lake or bay or river). Seiche waves cause water to slosh rapidly back and forth, and can quickly bury any wildlife in the body of water in mud. They’re known to be caused by severe earthquake tremors.' },
    { n: 16, id: 'chemistry',
      text: 'Chemical analysis of the glass tektites produced by the Chicxulub impact crater in Mexico, found around the world, shows that they have a rare combination of oxides (~60% silica, ~15% aluminum oxide, and ~5% calcium oxide) resulting from the specific rock the asteroid hit, melted, and ejected into the atmosphere.' },
    { n: 4, id: 'decay',
      text: 'Glass tektites are highly unstable on a geologic time scale, and quickly turn into a clay (smectite) if exposed. The only way to preserve them is to bury them rapidly.' },
    { n: 19, id: 'amber',
      text: 'At the Tanis site, paleontologists found several pristine, unaltered glass tektites. They were found perfectly encased inside fossilized tree resin (amber) attached to preserved tree branches in the same sediment layer as the dead fish.' },
    { n: 22, id: 'iridium',
      text: 'Iridium is an element that is very rare on Earth, but is extremely common in asteroids. There is a clay layer directly on top of the chaotic jumble of buried fish that is rich in iridium at the Tanis locality.' },
    { n: 20, id: 'bone-rings',
      text: 'Cross-sections of paddlefish bones from the Tanis site show that the outermost layer on all of the fish from the Tanis site is the beginning of a light-colored thick layer.' },
    { n: 17, id: 'bone-growth',
      text: 'Fish grow their bones in proportion to the amount of food they get. When food is abundant (spring/summer) they grow a lot, while during the harder months (fall/winter) they grow less. You can see this in their bones: during warm months fish bones grow thick pale layers, while during cold months fish bones grow little, producing thin, dark layers. The carbon used to build these bones comes from what food is available to the fish when the bone is being grown.' },
    { n: 21, id: 'c13-fish',
      text: 'The outermost edges of the Tanis fish bones show an increasing (but not yet peaked) ratio of Carbon-13 to other carbon isotopes.' },
    { n: 9, id: 'c13-year',
      text: 'Carbon-13 isotope levels in the water fluctuate throughout the year based on the lifecycle of microscopic phytoplankton. The ratio of Carbon-13 relative to Carbon-12 is at its lowest in the dead of winter, and peaks in the height of summer.' },
    { n: 1, id: 'mayfly-cycle',
      text: 'Mayflies have a very consistent life cycle. They lay eggs in the water, and those eggs hatch into nymphs. The nymphs grow over the winter, and in late spring (around May) they emerge from the water to metamorphose into flying adults.' },
    { n: 13, id: 'mayfly-fossils',
      text: 'At the Tanis site, fossils of mayfly nymphs have been found. All of them, based on their size and degree of development, were in the late stages of their larval period and nearly ready to metamorphose.' },
    { n: 3, id: 'layers',
      text: 'The fossils at the Tanis site are stacked in multiple, distinct, and separated layers of sediment. In typical geological settings, stacked layers of sand and mud represent multiple flood events occurring over months or years. Catastrophic events do not typically produce clean layered sediments.' },
    { n: 6, id: 'time-averaging',
      text: 'Organisms are always being buried, and when rivers cut into rocks they can pick up ancient fossils. When rivers pick up fossils and then flood, the moved fossils can be mixed with the recently dead, resulting in jumbled associations of animals with fossils directly next to one another that died millions of years apart.' },
    { n: 5, id: 'wash-in',
      text: 'When an asteroid the size of the Chicxulub impact hits, glass tektites raining down from space would blanket the continent. These tektites would sit on the surface of the soil, and after a torrential rain could be washed downstream to be dumped into rivers and lakes nearby during flood events.' },
    { n: 12, id: 'dino-bones',
      text: 'Fossil dinosaurs found at the Tanis site are not as complete as the fish. The pieces found so far are fragmented and show signs of severe water-wear, similar to rocks that have been rolling along the bottom of a river bed for a long time.' },
    { n: 2, id: 'burrows',
      text: 'The layers that contain the fossilized fish skeletons also contain “trace fossils.” These trace fossils show the kinds of burrows that worms and insects make in mud that has settled—and mud settling can take a very long time.' },
    { n: 10, id: 'ripples',
      text: 'When water flows, it leaves ripple marks in the sand and mud that become fossilized. Some of the sediment ripples at the Tanis site indicate that the water was flowing downstream (toward the ocean). A violently sloshing seiche wave or a tsunami would likely leave ripples showing water surging violently upstream (inland).' },
    { n: 23, id: 'iridium-moves',
      text: 'Iridium is a water-soluble metal. When deposited in rock, buried iridium can be moved when it is dissolved and redeposited by groundwater. Groundwater cannot move through mudstone layers, and so iridium layers may shift up or down to hit mudstone layers.' }
  ];

  const api = { facts: FACTS, byN: Object.fromEntries(FACTS.map((f) => [f.n, f])) };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else window.TANIS = api;
})();
