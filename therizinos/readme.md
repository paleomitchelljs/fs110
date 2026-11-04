# Therizinosaurs

A lecture deck on therizinosaurs, the plant-eating theropods, run as claims, evidence, alternatives, a test, and a room vote on how sure. The dinosaurs are the example. The skill is the one the class has been practicing: isolate the claim, state the evidence, look for what else would produce it, then size the claim to the evidence.

Static files, no build step, same stage and controls as `infernogallus/`. Open `index.html`.

## Three levels

Press **L** (or the bars in the top right, or `#L1` `#L2` `#L3` on the address) to change level. The dots and the clock follow.

| Level | For | Content | Clock |
|---|---|---|---|
| 1 | one session | 23 segments | about 51 min |
| 2 | two sessions | 35 segments | about 85 min in two sessions (53 + 32) |
| 3 | three sessions | 38 segments | about 96 min in two sessions (52 + 44) |

The clock packs segments into sessions of about 50 minutes and starts a new session (a small gap in the dots, "day 2" on the clock) whenever the next segment would overflow. The minutes are slide time, not talking time. Level 1 will run over 50 if you talk through every build; skip with the dots. Level 3 is not yet three full sessions; the gap is the sensible place to add a discussion or more papers (see the end of this file for what I left out).

## The four parts and what inspired each

Figures and numbers come from wherever they fit best; the paper in the second column is the starting point.

| Part | Inspired by | Level 1 | Added at 2 | Added at 3 |
|---|---|---|---|---|
| 1 What kind of dinosaur? | Zanno 2010 | Sort ten clues into three groups; theropod claim; *Falcarius* as a transitional form (trait grid you drag across three taxa); *Beipiaosaurus* filaments (display or warmth) | Timeline of guesses 1954–2010; *Beipiaosaurus* facts | Crossing between Asia and North America |
| 2 What did it eat? | Zanno & Makovicky 2011 | Guess how many of 27 skull traits hold up against gut evidence; where a gut goes (Zanno et al. 2009); two skull designs (Button & Zanno 2020) | Six skulls; big-gut claim; plants-first claim (Zanno et al. 2009); beaks (Lautenschlager et al. 2013) | |
| 3 What were the claws for? | Lautenschlager 2014; Qin et al. 2023; Kobayashi et al. 2025 | Claw size; three loadings and a hook-not-dig claim; the giant claw and display by elimination; the claw with its sheath, with a lever you can drag | Alvarezsaurs, where the test says yes; sort the evidence into feeding, warmth, fighting, showing off | Fingers lost five times |
| 4 Did they live in groups? | Freimuth & Zanno 2025; Kundrát et al. 2008; Tanaka et al. 2019 | *Falcarius* bonebed (4,500 dots); Javkhlant colony with a density line you drag | Embryos | Tracks with a hadrosaur herd |

Both levels end the same way as `infernogallus/`: every claim a chip on one line from guess to solid, then the distance-from-the-bone dots, then the authors' own hedge words. At level 1 it shows the level 1 claims; at level 3, all 17.

## Every claim page runs in one order

1. the claim, with a picture
2. evidence, one row per press
3. alternatives, one row per press
4. the test that would tell them apart
5. **How sure?** Press 1–5 (or tap a bin) once per hand. Shift takes one back. The dark marker is the room's call; drag it after an argument, double-click to follow the votes again.
6. the authors' own words, hedges highlighted

The strip at the top right is **distance from the bone**: Bone, Measure, Model, Analogy, Beyond. It is my judgment of how many inferential steps sit between the fossil and the claim, and it is open to argument. Rows with a small **+** are the deck's, not the paper's.

## Things you drag

| Where | What |
|---|---|
| Timeline of guesses | The year cursor. Each press moves it to the next guess; drag it to scrub. |
| Sort the clues | Cards into bins. The last press slides each card to where the sources put it: dashed cards are *looks like* (plant-eater convergence), solid are bone detail shared with theropods. |
| *Falcarius* | Tap or drag across the three columns. Counts at the bottom: primitive (square), in between (triangle), derived (circle). |
| Filaments | Two layer buttons, also switched on by the builds. |
| Skull traits | The guess marker on 0–27, before the count comes up. |
| Claw and sheath | Drag the claw tip or the slider: sheath length 0 to +60%. |
| Javkhlant | The dashed line: where would you draw "colony?" |
| Figure pages | Tap a pill to dim everything but that part of the figure. Builds step through the pills in order. |

## Things to check before class

I read the text and looked at the figures. Headless Chrome at 1600 × 900 was used for layout checks, and 23 checks run in jsdom (every build at every level, the sort, the timeline, votes, the trait counts, the lever and the density line). I have not run it on a projector or touch screen.

- **Freimuth & Zanno 2025, Fig. 25: caption and legend disagree.** The caption text says "Red circles represent primitive traits … blue squares derived traits." The legend printed inside the figure says blue square = primitive, triangle = intermediate, pink circle = derived, and that is the only reading that fits the anatomy (teeth in the front of the lower jaw are primitive; toothless is derived). The trait grid uses the legend. The grid is my reading of the symbols on the three skulls, merged into ten rows; check it against the figure.
- **Claw length.** Lautenschlager 2014: *Therizinosaurus* manual unguals "over 50 cm in length". Qin et al. 2023's abstract: "sometimes over one metre long". The deck says 50 cm+. The Hu preprint says 1 m and is not peer-reviewed.
- **Keratin and the stress models.** Lautenschlager 2014 *did* test a keratin sheath, but as a simplified uniform-thickness coat (E = 1.04 GPa): "largely no effect" for a hollow claw, slightly lower stress for a solid one, with a note that thickness and attachment could vary. Kobayashi et al. 2025 find a sheath more than 40% longer than the bone, so it extends past the tip. No paper models that. The lever is my statics: same tip force, same bone, the bending arm at the joint is the straight line from joint to tip, so for a curved claw +40% arc length gives about ×1.26, not ×1.4. It is a toy, labelled "own" in the claim page.
- **Tracks (Fiorillo et al. 2018).** At least three of the four-toed tracks form one trackway, made by a single individual. The "at least three individuals" is the hadrosaurs. So the track evidence for a therizinosaur *group* is none; the open question is whether one therizinosaur and a hadrosaur herd were there together or on different days. The authors lay out both. (My first summary file had this wrong; fixed in `paper_summaries.md`.)
- **Javkhlant (Tanaka et al. 2019).** The main *Geology* paper is not in the folder, only its data repository file. The density plot is computed from Table DR1 as clutches per 100 m²; where the table gives "<60 m²", ">486 m²", ">70 clutches" or a range of areas, the dot is drawn as an arrow or bar. The eggs are Dendroolithidae; the supplement says that type has been tied to embryos of megalosauroids *or* therizinosaurians. The deck does not say these are therizinosaur eggs.
- **Kundrát et al. 2008** call their embryos therizinosauroid, closest to *Neimongosaurus* and *Erliansaurus*, and not found with parents. The independence of hatchlings is their inference, which they flag ("we assume", "might lead to speculation").
- **Timeline of guesses.** Every entry is from the Kundrát et al. discussion (Maleev 1954 turtle, Barsbold 1976 theropod, Paul 1984, Gauthier 1986, Sereno 1989, Dong 1992, Russell & Dong 1993) plus Zanno 2010. The little triangles are first-described taxa as listed in Zanno 2010 and Zanno et al. 2009 (Alxasaurus 1993, Beipiaosaurus 1999, Nothronychus 2001, Falcarius 2005).
- **The sort of ten clues.** Which clue points where comes from Xu et al. 1999 ("Sauropodomorpha-like tetradactyl pes", "ornithischians" for the dentary shelf, "sauropod-like ilia", wrist "identical to that of *Deinonychus*"). The toothless beak is filed with ornithischians because that is where students will put it; Zanno 2010 says only that therizinosaurs show "an unexpected degree of convergence with other herbivorous dinosaur clades."
- **Rows marked "+"** and the **test** row on each page are mine.
- Quotes keep the papers' spelling. An ellipsis marks cut text.

## What I left out

Lautenschlager 2017 (mandible stress by taxon; "niche partitioning"), Smith 2025 (35 forelimb muscles in *Falcarius*), the Qin et al. regressions of function against size, and the Hu 2025 preprint. They are in `paper_summaries.md`. Any would slot in at level 3.

## Files

```
index.html
css/deck.css          tokens and stage from infernogallus/, plus levels, sorts, pictures
js/content.js         every word on screen; edit here (tier = level, min = minutes)
js/deck.js            segments, builds, keys, levels and sessions
js/parts/util.js      text format, drag, certainty state
js/parts/intro.js     cover, part titles, five questions, fact slides
js/parts/claim.js     the claim page and its gauge
js/parts/place.js     sort into bins; timeline of guesses
js/parts/viz.js       figure pages with zones; trait grid; guess-27; 4,500 dots; filament outline
js/parts/viz2.js      claw and sheath lever; clutch density
js/parts/rank.js      the last sort
img/                  figure panels, cropped from the papers
tools/crop_figs.py    remakes img/ (needs pdftoppm; boxes in tools/figs_table.py)
tests/deck.smoke.js
paper_summaries.md    the figure-by-figure notes and key facts for every paper
papers/               the PDFs (gitignored)
```

Text format in `content.js`: `_Name_` italic, `*word*` accent, `==word==` marked as a hedge.

```
python3 therizinos/tools/crop_figs.py
JSDOM=/path/to/node_modules/jsdom node therizinos/tests/deck.smoke.js
```

Votes and positions live in sessionStorage. A reload mid-class keeps them, a new tab starts clean, and the circular arrow (click twice) clears everything.
