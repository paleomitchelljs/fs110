# Abelisaurs (draft for review)

A lecture deck to talk over, built on the same engine as `therizinos/`. Animals and maps on screen; a few words at most. The claim, evidence, alternatives, test and "how sure" icons light at the top left as you move through a figure. Open `index.html`. Static files, no build step.

This is a first draft. Read `Questions for you` below before class.

## Levels

Press **L** (or `#L1` `#L2` `#L3` on the address).

| Level | For | Slide time |
|---|---|---|
| 1 | one session | about 54 min |
| 2 | two sessions | 54 + 36 min |
| 3 | three sessions | 51 + 49 min |

## The five parts

| Part | Level 1 | Added at 2 | Added at 3 |
|---|---|---|---|
| 1 Meet them | *Carnotaurus* zoomed (skull, arms, tail, skin); six ceratosaurs to one scale | six skulls; the biggest (*Pycnonemosaurus*) | the family tree with silhouettes |
| 2 Where from? | when each was found, by continent; the world at 140, 100, 80 Ma; Africa first (*Rugops*, *Spinostropheus*); *Arcovenator*; *Chenanisaurus* and a jaw's limits | many lineages; big everywhere; *Vespersaurus*; *Koleken* | *Vitosaura* |
| 3 The arms | shoulder and arm (*Majungasaurus*), hand, and the long-armed *Deltadromeus* | | |
| 4 What did they eat? | the bite (*Carnotaurus*); bite marks (*Majungatholus*); fast tooth replacement | who bit it (a sort); *Skorpiovenator*; *Limusaurus* | |
| 5 Built to run? | the tail muscle; horns; skin | skin across dinosaurs; hearing (*Llukalkan*); injuries | ornaments and size; *Aucasaurus* air spaces |

Ends with the wall of evidence: one picture per claim that took a vote.

## What I changed from the outline, and why

- **Opened with the animal.** The therizinosaur lecture started with the skeleton and the family. A new part 1 does that here: a whole *Carnotaurus*, then six species to one scale.
- **Maps wherever the argument is about place.** Part 2 uses three Scotese paleomaps (140, 100 and 80 Ma), Sereno's globe, Longrich's late-Cretaceous map and Tortosa's map.
- **Folded the outline's #1 to #3 into one story.** The question is "when did Africa leave?", answered three ways: Niger (*Rugops*), Provence (*Arcovenator*), Morocco (*Chenanisaurus*). The jaw slide carries the "how far can a jaw take you?" point.
- **Arms: one slide, not two.** Burch & Carrano's shoulder and hand, plus a pill for Delcourt's display idea, with *Deltadromeus* for contrast.
- **Added more species than the outline had:** *Skorpiovenator*, *Limusaurus*, *Vespersaurus*, *Koleken*, *Vitosaura*, *Aucasaurus*, *Masiakasaurus*, *Eoabelisaurus*, *Noasaurus*.

## Things the outline said that the papers in the folder do not

- **Burch & Carrano on grasping.** The paper does not say grasping is ruled out or that there is no modern analog. It says the stoutness of the hand bones "makes it unlikely that the individual digits retained much autonomy, and it is possible that the manus was employed as a functional unit." It says it is unclear whether claws were present. The "lost the ability to grasp" line is Delcourt's, not theirs. The slide follows the papers.
- **Mazzetta and *Allosaurus* slashing.** In the paper, the comparison is Rayfield et al. 2001's *Allosaurus* "hatchet-like" model, which Mazzetta applies to *Carnotaurus* and finds the skull can survive. The "small prey" reading is Mazzetta's own, via crocodilians ("jaw speed is much more important than bite force in capturing small prey"). The slide gives those two. The claim that other researchers see *Carnotaurus* as a slasher against large prey is not in these papers; I did not include it.
- **Chenanisaurus press coverage.** Not in the paper. It comes from the University of Bath release (May 2017): a smaller brain than *T. rex*, scales, short arms. I paraphrased it from a search summary of that release, not from the release itself. Read the original before using the pill.
- **Llukalkan hearing.** The paper is in the folder now. Its hedge is "the presence of the caudal tympanic recess in the new species suggests a different hearing adaptation from other coetaneous abelisaurids." The recess is listed as "possible" in the abstract, and the fenestra ovalis and lagena are "difficult to discern in the CT scans." So the step from a bone pocket to hearing is the authors' suggestion, and the ear slide marks it as untested.
- **Mazzetta's DOI.** Not checked. Check before citing.

## Pills that are the deck's, not a paper's

- *Chenanisaurus*: "Not from a jaw" (test), "Press: smaller brain, scales" (else).
- *Arcovenator*: "A tree says it; nothing tests it".
- Arms: "No evidence of use is not evidence of none".
- Tail: "A model, not a speed".
- Horns: "Ranked by evidence?".
- *Majungasaurus* naming year (1955) and the other timeline years: Carnotaurus 1985, Aucasaurus 2002, Rajasaurus 2003, Indosaurus 1933 are from reference lists in the papers; 1955 for *Majungasaurus* is from memory. Check.

## Figures

All crops come from `papers/` (gitignored); the cropped images in `img/` are committed (fair use for teaching). The three maps are Scotese et al., PALEOMAP, CC BY 4.0, from Wikimedia Commons (the 70 Ma file does not exist there, so the Maastrichtian is shown by the 80 Ma map and Longrich's map).

```
python3 tools/figbox.py <paper key> <page> ...   # where the pictures are on a page
python3 tools/grid.py out.jpg <key> <page> ...    # page with a 10% grid, for vector figures
python3 tools/crop_figs.py [name]                 # cut everything in tools/figs_table.py
python3 tools/montage.py out.jpg name ...         # contact sheet, to check edges
python3 tools/dims.py                             # regenerate js/dims.js after adding pictures
```

Test: `JSDOM=/path/to/node_modules/jsdom node tests/deck.smoke.js`.

## Questions for you

- **The Chenanisaurus press claims.** Are those the claims you meant? Which source did you have in mind?
- **The Allosaurus-slashing claim.** What was the source? If you have it, I will add it as the "else" on the bite slide.
- **More life restorations.** *Rugops* now has art (king-the-kong). *Majungasaurus*, *Chenanisaurus*, *Skorpiovenator* and *Aucasaurus* only have skeletons or silhouettes in the papers.

## Credits

- *Rugops* restoration: king-the-kong (shared by the course instructor; used with credit on screen).
- Paleomaps: Scotese, Vérard, Burgener, Elling and Kocsis, PALEOMAP, CC BY 4.0, via Wikimedia Commons.
- Figure crops are from the papers named in each caption.
