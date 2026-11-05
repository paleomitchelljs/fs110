# Abelisaurs (draft for review)

A lecture deck to talk over, built on the same engine as `therizinos/`. Animals and maps on screen; a few words at most. The claim, evidence, alternatives, test and "how sure" icons light at the top left as you move through a figure. Open `index.html`. Static files, no build step.

This is a first draft. Read `Questions for you` below before class.

## Levels

Press **L** (or `#L1` `#L2` `#L3` on the address). About 51 / 88 / 98 minutes of slides; the clock splits them into sessions.

## How it is built

Animal by animal, in the order of the family tree, not as a walk through the claim, evidence, alternatives, test sequence. An animal gets a picture slide, and the best ones a claim slide: the claim at the top, the evidence as pictures, the alternatives as small chips. The question icons mark the labels and are not stepped through. Everything on a claim slide is on screen at once. Only the family slide (click or step through the six silhouettes; each zooms with its skeleton or mount beside it) and the vote bar take a press.

| Part | Animals |
|---|---|
| 1 Carnotaurus | whole animal; bite, horns, skin, tail; skin across dinosaurs (L2) |
| 2 The family | six to one scale; skulls and the biggest (L2); the tree (L3) |
| 3 Where in the world | maps at 140, 100, 80 Ma side by side; every locality on one map; big everywhere, many lineages (L2) |
| 4 Africa, Madagascar, Europe | *Rugops*; *Majungasaurus* (bite marks, who bit it L2, tooth replacement, arms); *Chenanisaurus*; *Arcovenator* |
| 5 South America (L2) | *Skorpiovenator*; *Aucasaurus* (injuries; tail air, L3); *Llukalkan*; *Koleken*; *Vitosaura* (L3); ornaments (L3) |
| 6 Small cousins (L2) | *Limusaurus*; *Vespersaurus* |

Ends with the wall of evidence.

## Changes from the first draft

- The timeline of discovery is gone; one map shows every locality at once (positions are approximate, drawn on the 80 Ma map).
- Removed: the "Africa first?" sequence (its fig. 4 crop showed nothing), the *Arcovenator* test pill, the "tiny" arm label, and the pill-by-pill zooms. Crops are now cut from the figure itself (`crop` in `content.js`), so a zoom cannot miss its target. The "Africa linked" tile is off the wall.
- Skeletons and mounts now sit beside the silhouette on the family slide instead of being separate cards.
- New engine part: `js/parts/plate.js` (plain slides and the locality map).

## Things the outline said that the papers in the folder do not

- **Burch & Carrano on grasping.** The paper does not say grasping is ruled out or that there is no modern analog. It says the stoutness of the hand bones "makes it unlikely that the individual digits retained much autonomy, and it is possible that the manus was employed as a functional unit." It says it is unclear whether claws were present. The "lost the ability to grasp" line is Delcourt's, not theirs. The slide follows the papers.
- **Mazzetta and *Allosaurus* slashing.** In the paper, the comparison is Rayfield et al. 2001's *Allosaurus* "hatchet-like" model, which Mazzetta applies to *Carnotaurus* and finds the skull can survive. The "small prey" reading is Mazzetta's own, via crocodilians ("jaw speed is much more important than bite force in capturing small prey"). The slide gives those two. The claim that other researchers see *Carnotaurus* as a slasher against large prey is not in these papers; I did not include it.
- **Chenanisaurus press coverage.** Not in the paper. It comes from the University of Bath release (May 2017): a smaller brain than *T. rex*, scales, short arms. I paraphrased it from a search summary of that release, not from the release itself. Read the original before using the pill.
- **Llukalkan hearing.** The paper is in the folder now. Its hedge is "the presence of the caudal tympanic recess in the new species suggests a different hearing adaptation from other coetaneous abelisaurids." The recess is listed as "possible" in the abstract, and the fenestra ovalis and lagena are "difficult to discern in the CT scans." So the step from a bone pocket to hearing is the authors' suggestion, and the ear slide marks it as untested.
- **Mazzetta's DOI.** Not checked. Check before citing.

## Labels that are the deck's, not a paper's

- *Chenanisaurus*: "Not from a jaw" (test), "Press: smaller brain, scales" (else).
- Arms: "No evidence of use is not evidence of none".
- Tail: "A model, not a speed".
- Horns: "Ranked by evidence?".
- Header facts from memory, not the papers: *Carnotaurus* "70 Ma", *Majungasaurus* "70 Ma", *Rugops* "95 Ma" (from the old deck), *Vespersaurus* "1 m", *Limusaurus* "Jurassic". Check before class.
- Locality pins on the map are placed by eye on the 80 Ma map.
- *Majungasaurus* naming year (1955) and the other timeline years: Carnotaurus 1985, Aucasaurus 2002, Rajasaurus 2003, Indosaurus 1933 are from reference lists in the papers; 1955 for *Majungasaurus* is from memory. Check.

## Figures

All crops come from `papers/` (gitignored); the cropped images in `img/` are committed (fair use for teaching). The three maps are Scotese et al., PALEOMAP, CC BY 4.0, from Wikimedia Commons (the 70 Ma file does not exist there, so the Maastrichtian is shown by the 80 Ma map and Longrich's map).

```
python3 tools/figbox.py <paper key> <page> ...   # where the pictures are on a page
python3 tools/grid.py out.jpg <key> <page> ...    # page with a 10% grid, for vector figures
python3 tools/crop_figs.py [name]                 # cut everything in tools/figs_table.py
python3 tools/montage.py out.jpg name ...         # contact sheet, to check edges
python3 tools/dims.py                             # regenerate js/dims.js after adding pictures
python3 tools/wiki.py search "Rugops"             # find Commons pictures with licence and author
python3 tools/wiki.py get "File:X.jpg" img/x.jpg   # fetch one (standard widths only)
```

Test: `JSDOM=/path/to/node_modules/jsdom node tests/deck.smoke.js`.

## Questions for you

- **The Chenanisaurus press claims.** Are those the claims you meant? Which source did you have in mind?
- **The Allosaurus-slashing claim.** What was the source? If you have it, I will add it as the "else" on the bite slide.
- **More life restorations.** *Rugops* now has art (king-the-kong). *Majungasaurus*, *Chenanisaurus*, *Skorpiovenator* and *Aucasaurus* only have skeletons or silhouettes in the papers.

## Credits

Photos and restorations from Wikimedia Commons, each credited in its on-screen caption: *Carnotaurus* skull (AStrangerintheAlps, CC BY-SA 3.0); *Majungasaurus* mount (Kumiko, CC BY-SA 2.0) and skull cast (WehaveaTrex, CC BY-SA 4.0); *Eoabelisaurus* mount (Jl FilpoC, CC BY-SA 4.0); *Masiakasaurus* bones (CaptMondo, CC BY-SA 3.0); *Abelisaurus* skull (Christophe Hendrickx, CC BY-SA 3.0); *Rajasaurus* replica (Swapnil Karambelkar, CC BY-SA 4.0); *Rugops* snout bones (Ibrahim, Sereno et al., CC BY 4.0); *Arcovenator* leg bones (Tylwyth Eldar, CC BY-SA 4.0); *Koleken* bones (Amalia Villafañe, CC BY 2.5 ar); *Llukalkan* cast (Brancasaurio, CC BY 4.0); *Limusaurus* holotype (Kumiko, CC BY-SA 2.0); *Vespersaurus* (Ildarotyrannus, CC BY-SA 4.0); *Aucasaurus* (Conty, CC BY 3.0). The *Skorpiovenator* in-ground photo came from you; I do not have its credit.

- *Rugops* restoration: king-the-kong (shared by the course instructor; used with credit on screen).
- Cover: *Majungasaurus* size chart, Eotyrannu5-Returns, CC BY-SA 4.0 (Wikimedia Commons, "Majungasaurus size chart.png").
- *Chenanisaurus* restoration: Nick Longrich, CC BY-SA 4.0. *Arcovenator*: Danny Cicchetti, CC BY-SA 3.0. *Skorpiovenator*: Dinosauria-Freak, public domain. All from Wikimedia Commons; the credit is in each caption on screen.
- Five abelisaurids and a person: Slate Weasel, public domain ("Abelisauridae Scale.svg").
- Paleomaps: Scotese, Vérard, Burgener, Elling and Kocsis, PALEOMAP, CC BY 4.0, via Wikimedia Commons.
- Figure crops are from the papers named in each caption.
