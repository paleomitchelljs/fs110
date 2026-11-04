# Therizinosaurs

A lecture deck to talk over. The animals are on screen; the words are few. The claim, evidence, alternatives, test and "how sure" moves from the class show up as five small icons at the top left that light as you move through a figure. They are the only framing.

Static files, no build step, same stage and controls as `infernogallus/`. Open `index.html`.

## Levels

Press **L** (or the bars in the top right, or `#L1` `#L2` `#L3` on the address).

| Level | For | Segments | Slide time |
|---|---|---|---|
| 1 | one session | 23 | about 54 min |
| 2 | two sessions | 35 | 54 + 34 min |
| 3 | three sessions | 39 | 54 + 45 min |

The clock packs segments into sessions of about 50 minutes (a gap in the dots, "day 2" on the clock). These are slide minutes, not talking minutes: with a speaker over every figure, each scene runs longer than its estimate, so level 3 is the one to expect to fill three sessions. If it falls short, `paper_summaries.md` has figures I did not use (Lautenschlager 2017 mandible stress, Smith 2025 forelimb muscles, the Qin regressions).

## How a scene runs

- **Figure scenes.** A large figure and a column of pills. One pill arrives per press. A pill with a region lights that part of the figure and dims the rest; a pill with an icon says which move you are making (claim, evidence, else, test). Tap an earlier pill to go back to it. A few scenes swap the figure (Denali map to the tracks block).
- **Pictures you drag.** Full-size drawn pictures: the timeline of guesses, the 27 skull traits, the filaments on the body, the claw and its sheath, 4,500 bones, nesting density.
- **The room's call.** Where a scene ends in a claim, a thin bar under it takes 1–5 (or taps). Shift takes one back; drag the dark marker for what the room settled on. The last slide puts every claim that took a vote on one line from guess to solid, then adds distance-from-the-bone dots, then the authors' own hedge words.
- **No prompts.** There is no prompt line anywhere. Part titles are two or three words.

## The four parts

Figures and numbers come from wherever they fit best; the starting paper is in the second column.

| Part | Inspired by | Level 1 | Added at 2 | Added at 3 |
|---|---|---|---|---|
| 1 What is it? | Zanno 2010 | *Nothronychus* zoomed (head, neck, belly, claws, toes); timeline of who put it where, with the fossils found in order; sort ten clues; theropod evidence (Xu 1999); *Falcarius* trait grid against an early theropod, with photos; filaments, then where on the body | The tree (Zanno 2010); *Falcarius* skull from many bones; three skulls in a tree (Freimuth & Zanno 2025); *Beipiaosaurus*; filaments compared | Crossing between Asia and North America |
| 2 What did it eat? | Zanno & Makovicky 2011 | Guess how many of 27 traits hold up; the gut on *Nothronychus* (Zanno et al. 2009); two skull designs (Button & Zanno 2020) | Six skulls; plants first; beaks (Lautenschlager et al. 2013) | |
| 3 The claws | Lautenschlager 2014; Qin et al. 2023; Kobayashi et al. 2025 | Claw sizes; hook or dig; display by elimination; *Duonychus* two fingers; the sheath lever | An alvarezsaur test that says yes; sort what each thing was for | *Duonychus* locality and restoration; five clades lost a finger |
| 4 Alone or together? | Freimuth & Zanno 2025; Kundrát et al. 2008; Tanaka et al. 2019 | *Falcarius* bonebed (4,500 dots); Javkhlant colony and a density line | Embryos; the nest layer | Tracks with a hadrosaur herd |

## Things to check before class

I read the text and looked at the figures; layout was checked in headless Chrome at 1600 × 900, and 29 checks run in jsdom (every build at each level, the sorts, the timeline, figure pills, the vote bar, the trait grid and its photos, the lever, the density line). I have not run it on a projector or touch screen.

- **Where the zones sit.** Each lit region on a figure is a rectangle I read off the figure by eye. Page through every figure scene once and move any that are off (`zones` in `js/content.js`, fractions of the figure).
- **Falcarius photos.** The two photos are the crops you sent (teeth `d1 d2`; jaw with boxes E, B, F). I captioned them "Freimuth & Zanno 2025" without a figure number because I could not tell from the crops which figure panel they come from (Figs 22–23 are the dentary teeth). Add the number.
- **The early-theropod column.** It is all "primitive" by definition: in Freimuth & Zanno Fig. 25 a trait is primitive if it is the state in earlier theropods. It is not a measured column for a particular species. Say so when you show it, or name a species and score it.
- **Falcarius grid values.** Read from the symbols on the three skulls in Fig. 25 and merged into ten rows. The caption text of that figure says red circles are primitive and blue squares derived; the legend printed inside the figure says the opposite. The legend is the one that fits the anatomy, and the grid follows it.
- **Cover.** The Duonychus restoration in Kobayashi et al. 2025 is cropped by the authors themselves (the head is out of frame), so it is used only on a level 3 scene. The cover is the claw-and-silhouette row from Lautenschlager 2014, whole animals.
- **Keratin and the stress models.** Lautenschlager 2014 did model a sheath, but as a thin uniform coat ("largely no effect"). Kobayashi et al. 2025 found a sheath more than 40% longer than the bone. No paper models that, so the lever is my statics (same tip force, same bone, only the sheath length changes), not a result.
- **Crystal Geyser (Suarez et al. 2007).** The time series and quarry-wall photo are from this paper. The authors say "either one episode of bone accumulation that has been reworked or two or more" (the stratigraphy supports at least two; a companion geochemistry study suggests three), with some bones moved short distances by water and trampled limbs near the top. They still infer a gregarious animal drawn to springs. That is the quarry slide's alternative: a few gatherings at a spring, not one herd dying at once, and the data cannot yet tell them apart. Suarez et al. give the count of animals as "probably >100 individuals"; the "4,500 specimens, 99% first identified as *Falcarius* in the field" is Freimuth & Zanno's, citing Suarez, Suarez, Kirkland et al. 2007 (the field count, not a verified one). Note the two figures are different things (bones versus animals).
- **Tracks.** At least three of the four-toed tracks form one trackway, made by one individual. The "at least three individuals" is the hadrosaurs. The question is whether one therizinosaur and a herd were there together or on different days.
- **Javkhlant.** Only the data repository file is in the folder, not the main paper. The density plot is computed from Table DR1 as clutches per 100 m²; open-ended entries ("<60 m²", ">486 m²", ">70 clutches") are drawn as arrows. The eggs are Dendroolithidae, which the supplement ties to embryos of megalosauroids or therizinosaurians. The deck does not call them therizinosaur eggs.
- **Timeline.** The guesses are from the Kundrát et al. discussion (Maleev 1954, Barsbold 1976, Paul 1984, Gauthier 1986, Sereno 1989, Dong 1992, Russell & Dong 1993) plus Zanno 2010. Discovery years: Segnosaurus 1979 (Perle, as cited in Zanno 2010), *Alxasaurus* 1993, *Beipiaosaurus* 1999, *Nothronychus* 2001, *Falcarius* 2005.
- **The sort of ten clues.** Which clue points where is from Xu et al. 1999 and Zanno 2010. The toothless beak is filed with ornithischians because that is where students will put it; Zanno 2010 says only that therizinosaurs show "an unexpected degree of convergence" with other herbivorous clades.
- **Claw length.** Lautenschlager 2014: "over 50 cm". Qin et al. 2023's abstract: "over one metre". The deck says 50 cm+ on one fact slide.
- Pills marked with the else or test icon are often the deck's, not the paper's.

## Files

```
index.html
css/deck.css          tokens and stage from infernogallus/, plus levels, scenes, pictures
js/content.js         every word on screen; edit here (tier = level, min = minutes)
js/deck.js            segments, builds, keys, levels and sessions
js/parts/util.js      text format, drag, certainty state, shared names
js/parts/intro.js     cover, part titles, fact slides
js/parts/scene.js     figure with pills, full-size pictures, vote bar, trait grid
js/parts/place.js     sort into bins; timeline of guesses
js/parts/viz.js       27 traits; 4,500 dots; filaments on the body
js/parts/viz2.js      claw and sheath lever; clutch density
js/parts/rank.js      the last sort
img/                  figure panels, cropped from the papers (and two photos you sent)
tools/crop_figs.py    remakes img/ from the PDFs (boxes in tools/figs_table.py)
tests/deck.smoke.js
paper_summaries.md    figure-by-figure notes and key facts for every paper
papers/               the PDFs (gitignored)
```

Text format in `content.js`: `_Name_` italic, `*word*` accent.

```
python3 therizinos/tools/crop_figs.py
JSDOM=/path/to/node_modules/jsdom node therizinos/tests/deck.smoke.js
```

Votes and positions live in sessionStorage. A reload mid-class keeps them, a new tab starts clean, and the circular arrow (click twice) clears everything.
