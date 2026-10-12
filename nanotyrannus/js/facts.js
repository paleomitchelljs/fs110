/* The Nanotyrannus fact cards. One list feeds the page and the printed sheet
 * (tools/make_cards.js writes cards.tex from it), so they can't drift apart.
 *
 * n      the number printed on the card and listed in the dropdown. Numbers
 *        run 1..N in date order, so the printed sheet reads as a timeline.
 *        The date is on the card anyway; the number hides nothing. Don't
 *        renumber after printing.
 * date   when the evidence appeared, as printed on the card and shown on the
 *        board. This is the one thing a card does carry, because the class
 *        gets the evidence in the order it arrived.
 * wave   which tranche the card belongs to (see WAVES). The instructor
 *        releases the waves in order; the dropdown offers only released cards.
 * kind   'specimen' (a direct observation of the 1942 skull, Jane or the
 *        Bloody Mary) or 'species' (a direct observation of another
 *        animal). Never shown on a card, so it hints at nothing.
 * text   the fact, as the student reads it. Cards carry no title, so nothing
 *        on a card hints at which hypothesis the fact favours.
 *
 * The array is in date order, and so is the numbering.
 *
 * Cards hold observations only: no names of researchers, no history, no
 * conclusions. The date is when the observation became available.
 *
 * DRAFT: every claim below was assembled from secondary sources (see readme.md)
 * and should be checked against the papers before the cards are printed. */
(function () {
  'use strict';
  const WAVES = [
    { w: 1, label: '1942–65' },
    { w: 2, label: '1988' },
    { w: 3, label: '1999–2003' },
    { w: 4, label: '2011–20' },
    { w: 5, label: 'Oct 2025' },
    { w: 6, label: 'Dec 2025–26' }
  ];

  const FACTS = [
    { n: 1, id: 'collected', date: '1942', wave: 1, kind: 'specimen',
      text: 'A theropod skull was found in Hell Creek Formation rocks from Montana. This formation is known for producing Tyrannosaurus rex specimens, and while the skull closely resembles a T. rex, it is only about half the length.' },
    { n: 2, id: 'mongolia', date: '1965', wave: 1, kind: 'species',
      text: 'Some small tyrannosaur skeletons from Mongolia, once thought to be separate species, are young Tarbosaurus.' },
    { n: 3, id: 'teeth-1942', date: '1988', wave: 2, kind: 'specimen',
      text: 'The 1942 skull has 15 teeth in one side of its upper jaw. Adult T. rex have 11 or 12.' },
    { n: 4, id: 'sutures', date: '1999', wave: 3, kind: 'specimen',
      text: 'The joints between the bones of the 1942 skull are open, not fused.' },
    { n: 5, id: 'teeth-gorgosaurus', date: '1999', wave: 3, kind: 'species',
      text: 'In Gorgosaurus, young animals have more teeth than adults: tooth number falls as the animal grows.' },
    { n: 6, id: 'jane', date: '2001', wave: 3, kind: 'specimen',
      text: 'A second small tyrannosaur from Hell Creek (Jane), is found with a more complete skeleton. Jane’s skull is lower and narrower than an adult T. rex’s.' },
    { n: 7, id: 'skull-shape', date: '2003', wave: 3, kind: 'species',
      text: 'In Albertosaurus, Gorgosaurus and Daspletosaurus, young animals have low, narrow skulls and adults have deep, heavy skulls.' },
    { n: 8, id: 'teeth-tarbosaurus', date: '2011', wave: 4, kind: 'species',
      text: 'A juvenile Tarbosaurus has about the same number of teeth as adult Tarbosaurus.' },
    { n: 9, id: 'hand', date: '2013', wave: 4, kind: 'specimen',
      text: 'Bloody Mary, a third small tyrannosaur from Hell Creek, has hand proportions and a wishbone (furcula) shape that differ from T. rex.' },
    { n: 10, id: 'jane-bone', date: '2020', wave: 4, kind: 'specimen',
      text: 'Bone sections from Jane show growth rings and bone tissue typical of an animal that was still growing.' },
    { n: 11, id: 'rings', date: 'Oct 2025', wave: 5, kind: 'specimen',
      text: 'The outermost growth rings in Bloody Mary’s bone are tightly packed, a pattern seen when growth has nearly stopped.' },
    { n: 12, id: 'age', date: 'Oct 2025', wave: 5, kind: 'specimen',
      text: 'Growth rings put Bloody Mary at 17 to 22 years old at death, and Jane at 8 to 14.' },
    { n: 13, id: 'teeth-bloody-mary', date: 'Oct 2025', wave: 5, kind: 'specimen',
      text: 'Bloody Mary has 16 teeth in the left side of its upper jaw and 17 in the right. Adult T. rex have 11 or 12.' },
    { n: 14, id: 'arm', date: 'Oct 2025', wave: 5, kind: 'specimen',
      text: 'Bloody Mary’s hand bones are larger than an adult T. rex. The 20\' long Bloody Mary has a first finger almost twice the length of a 42\' long T. rex.' },
    { n: 15, id: 'tail', date: 'Oct 2025', wave: 5, kind: 'specimen',
      text: 'Bloody Mary has fewer tail vertebrae than T. rex.' },
    { n: 16, id: 'air-sacs', date: 'Oct 2025', wave: 5, kind: 'specimen',
      text: 'Bloody Mary has several air-sac openings (pleurocoels) in its second neck vertebra and in its tail vertebrae. Jane has one in the second neck vertebra and none in the tail.' },
    { n: 17, id: 'hyoid', date: 'Dec 2025', wave: 6, kind: 'specimen',
      text: 'Bone sections from the throat bones (hyoids) of the 1942 skull show it was a mature animal.' },
    { n: 18, id: 'jane-curve', date: 'Jan 2026', wave: 6, kind: 'specimen',
      text: 'Growth patterns in Jane’s bone do not match the growth curve built from T. rex hindlimbs of many sizes.' }
  ];

  const api = { facts: FACTS, waves: WAVES, byN: Object.fromEntries(FACTS.map((f) => [f.n, f])) };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else window.NANO = api;
})();
