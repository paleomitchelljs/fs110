# Abelisaurs (draft for review)

A lecture deck to talk over, built on the same engine as `therizinos/`. Animals and maps on screen; a few words at most. The claim, evidence, alternatives, test and certainty icons light at the top left as you move through a figure. Open `index.html`. Static files, no build step.

This is a first draft. Read `Questions for you` below before class.

## Levels

Press **L** (or `#L1` `#L2` `#L3` on the address). Roughly 55 / 90 / 100 minutes of slides, before any questions; the clock splits them into sessions.

## How it is built

General to specific: where abelisaurs sit among theropods, then example species, then noasaurids, then abelisaurids by place, with *Carnotaurus* last and in the most detail. An animal gets a picture slide, and the best ones a claim slide: the claim at the top, the evidence as pictures, the alternatives as small chips. The question icons mark the labels and are not stepped through. Everything on a claim slide is on screen at once. Only three things take a press: the two trees (each shows the published figure whole, then zooms), the example species (click or step through the six silhouettes; each zooms with its skeleton or mount beside it) and the vote bar.

| Part | Animals |
|---|---|
| No card, right after the cover | Gates et al. 2016 Fig. 2, whole, then zoomed to the abelisaurs |
| 1 Example Abelisaurs | six to one scale; skulls and the biggest (L2); Delcourt 2018 Fig. 1, whole, then zoomed to noasaurids and abelisaurids |
| 2 Noasaurids (L2) | *Limusaurus*; *Vespersaurus* |
| 3 Geography | maps at 140, 100, 80 Ma side by side; Longrich 2017 Fig. 11 with a key to its numbers; body length by region, regional lineages (L2); *Rugops*; *Majungasaurus* (tooth marks, which animal made them L2, tooth replacement, arms); *Chenanisaurus*; *Arcovenator* |
| 4 South America (L2) | *Skorpiovenator*; *Aucasaurus* (injuries; tail air, L3); *Llukalkan*; *Koleken*; *Vitosaura* (L3) |
| 5 *Carnotaurus* | whole animal; bite; horns; ornaments across theropods (L3); skin; skin across dinosaurs (L2); tail |

Part numbers count the parts shown, so at level 1 they run 1 to 3. Ends with the wall of evidence.

## Changes from the second draft

- *Carnotaurus* moved from first to last. Noasaurids moved ahead of the abelisaurids, so *Carnotaurus* follows its South American relatives. Ornaments now follow the horns, and skin across dinosaurs follows skin.
- "Where in the world" and "Africa, Madagascar, Europe" are one card, "Geography". "The family" is "Example Abelisaurs". "Small cousins" is "Noasaurids".
- Labels now say the plain thing, use the paper's own term where there is one, and give a number where there is one. *Majungatholus* on the sort slide is now *Majungasaurus*, the name used everywhere else.
- Trees and the locality map are the published figures, not redraws, including ones that disagree (see below). The map with pins placed by eye is gone. Delcourt's tree moved from level 3 to level 1.
- The rail now reads Claim, Evidence, Alternatives, Test, Certainty, here and in `therizinos/` and `infernogallus/`. `bones/` still says "Else?" and "Sure?".
- Fixed: `]` and `[` stopped dead at a slide hidden at the current level, and now skip it. The scale picture on the example-species slide was squeezed into the skeleton column. The sort cards were too narrow for their text.

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

## Where the slides and papers need care

- **Bite force.** An earlier label read "Peak bite 3,341 N. *Allosaurus*: 3,573 N". That is model 1 only. Model 2 gives 5,274 N, which is above *Allosaurus*. Mazzetta says model 2 "does not alter radically the conclusion", and that it "would make *Carnotaurus* a stronger biter than living lions and hyenas." The slide gives both models. It compares *Allosaurus* (3,573 N) and *Giganotosaurus* (13,258 N) because Table 3 lists those as the same bite type, "bilateral static bite at the posteriormost teeth". *T. rex* (13,400 N) is a different type, so it is left out.
- **Speed.** Persons & Currie never calculate a speed. They reconstruct muscle mass (222 kg) and infer "short-burst sprinting" from it, citing Bates et al. for muscle mass being among "the most important factors in estimations of top running speeds." The tail slide says so.
- **The trees disagree.** Gates et al. 2016 Fig. 2 (opening slide) puts *Limusaurus* with *Ceratosaurus*, and *Masiakasaurus* with the abelisaurids. Delcourt 2018 Fig. 1 (end of part 1) puts *Ceratosaurus* with the abelisaurids (Etrigansauria), and *Limusaurus* in Noasauridae. Wang et al. 2017 also has *Limusaurus* in Noasauridae, which is why part 2 files it there, against the opening slide. Tortosa et al. 2014 puts noasaurids with abelisaurids. The deck shows the figures as published.
- **The Gates colours.** Red and blue on the opening tree mean ornamented or not, which is that paper's question and not this slide's. The caption says so.
- **The locality map.** Longrich et al. 2017 Fig. 11 covers only the Campanian and Maastrichtian, and predates several papers here. So *Rugops*, *Skorpiovenator*, *Llukalkan*, *Koleken*, *Vitosaura* and *Vespersaurus* are not on it. The key follows the paper's caption; "Unnamed" stands for its "Abelisauridae indet." and site names like "Idfu abelisaurid". The caption spells it "Columbia"; the key says Colombia.
- **"Example Abelisaurs".** *Masiakasaurus* on that slide is a noasaurid and *Eoabelisaurus* has moved around between trees, so "abelisaurs" is loose there. The caption, from Grillo & Delcourt, says "six ceratosaurs".

## Labels that are the deck's, not a paper's

- *Chenanisaurus*: "Body size from a jaw alone: uncertain" (test), "Press claims, not in the paper: smaller brain, scales" (else).
- Arms: "Arm use: unknown".
- Tail: "No speed calculated: inferred from muscle mass".
- Horns: "Or display".
- Header facts from memory, not the papers: *Carnotaurus* "70 Ma", *Majungasaurus* "70 Ma", *Rugops* "95 Ma" (from the old deck), *Vespersaurus* "1 m", *Limusaurus* "Jurassic". Check before class.

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
