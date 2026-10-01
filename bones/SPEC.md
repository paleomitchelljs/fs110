# Reasoning from Bones: build spec

A 75-minute FS110 session as a clickable deck, built to run on the projector and still work on a phone afterward. The rules are the sauropod tool's rules: static files, no build step, opens offline, almost no words on screen. The difference is sequence. This one moves through ten segments after the title, so it needs a deck engine, but inside each segment the diagram is still the thing you grab.

The source is the revised instructor outline (October 2026). Times, prompts and cases come from it. Where the deck departs from it, the reason is written next to the change.

## Decisions

1. The instructor drives and the room talks. It's built for the projector first, but every control also works by touch, so the same URL works on a phone after class. It is not built for 30 laptops clicking at once, because there's no backend on GitHub Pages and per-student sorting eats the clock.

2. The word budget is one prompt line per build, 10 words at most, in the hand font. Card fronts get a picture and at most 5 words, card backs get two short prediction lines, and nothing anywhere is a paragraph. Terms (valid, confounding, Signor–Lipps) appear as a small tag *after* the case, never before. That's "work the case first, name the concept second" made literal.

3. Cards are evidence, not explanation: each card states one observation, and you put it on the balance. Nothing on a card explains anything, because the instructor does that out loud. Anything that only repeats what the instructor will say (the hook's old row of clue cards, for one) stays off the screen.

4. Answers hide behind the eye (same button and key as the sauropod tool). Card backs, the Elasmosaurus reveal and the true ranges in the sim all stay hidden until it's pressed. Anything on GitHub Pages is public (the page source, this file, and the repo itself, since free Pages needs a public repo). So "hidden" means hidden from casual clicking, not secret. If the cases get reused for graded work, the card backs move to `answers.local.js`, which is listed in `.gitignore` and loaded by a `<script>` tag (a `fetch` of JSON fails from `file://`). Present from the local copy, and the published site has fronts only.

5. Almost everything is drawn as SVG and animated in JS, not shipped as GIFs. It stays sharp on a projector, follows the whiteboard/chalkboard theme, weighs kilobytes, and you can pause it, step it or drag it. A GIF can do none of that. Photos only where the real fossil is the point.

6. Every case runs the same way, on a balance. Two hypotheses, one per pan, each shown above its pan as a picture where there is one (Cope's 1869 and 1870 reconstructions, two sketched range charts, an asteroid and a volcano). The room predicts by voting, and the votes stay up as dots under each hypothesis. Then the evidence is dealt one card per press, and each card goes where the room argues it belongs: on a pan if one hypothesis expects it and the other doesn't, on the pivot if both expect it (it tips nothing), on the floor if it says little either way. Then you talk about where it tipped and why. That's the outline's A/B/C sort laid out in space, with the tilt as live feedback, and it's the same object five times, so students learn the object once and spend the rest of the class on the evidence.

7. At least one card per case is ambiguous on purpose. The clearest is Signor–Lipps: "Last fossils fall short of the line" looks like evidence for a slow fade until the simulation shows a sudden extinction produces it too, and the card moves to the pivot. Triceratops/Torosaurus is ambiguous as a whole: the cards split and the scale doesn't settle it, which is the honest state of the question.

8. Lists fill from the room. Each list has its items preloaded and hidden, and when a student says one, you tap it (or press its number) and it drops in. Things the room says that aren't preloaded go in with N, type, Enter. The list ends up in the order *this* class produced it.

9. Every segment has core builds and extra builds, because 75 minutes holds this many builds only if the interactives move fast. The K–Pg deal is the risk: a minute per card and 11 cards is the whole case. Its core path is 6 cards; X adds the rest.

## Where it lives

```
fs110/
  index.html …           sauropod tool, unchanged
  bones/
    index.html
    SPEC.md              this file
    readme.md            instructor notes, sources, R appendix
    css/deck.css
    js/content.js        every word on screen, every card, every list item
    js/deck.js           segments, builds, keys, rails, eye, clock, saved state
    js/parts/*.js        card, basic, balance, roomlist
    js/cases/*.js        elasmo, trackway, signor, funnel (to come: growth morph, premise tiles, concept map)
    js/sim.js            Signor–Lipps sampler, no DOM
    img/                 photos + credits.json
    tests/sim.test.js    node bones/tests/sim.test.js
```

It publishes at `https://paleomitchelljs.github.io/fs110/bones/`, and the sauropod URL doesn't move.

Same stack as the sauropod tool: plain HTML, CSS and JS, Source Sans 3 and Kalam with system fallbacks, and the same whiteboard/chalkboard tokens (copied for now, pulled into a shared `css/tokens.css` if a third tool shows up). All wording lives in `content.js`, so redrafting text never touches layout code.

## The frame

```
+----------------------------------------------------------------------+
| [C][E][?][T][S]                  < o-o-o-o-*-o-o-o-o-o >  + eye T ↺ |
|                                                                      |
|                                                                      |
|                            the diagram                               |
|                (drag, flip, sort, scrub, all in here)                |
|                                                                      |
|                                                                      |
|            Which would one story expect, and the other not?          |
+----------------------------------------------------------------------+
```

- The stage is a 1600 × 900 box (HTML and SVG inside it), scaled to fit and letterboxed on 4:3 projectors. The prompt line is about 5% of screen height, and nothing on screen is smaller than about 2.2% (a card label read from the back row). The term tag sits on the prompt line, after the prompt.
- The question rail (top left) holds the five framework questions as icons: Claim, Evidence, Else?, Test, Sure? It gets built in segment 2 and stays pinned for the rest of the session. The step a build is working on lights up.
- The control bar (top right, not scaled) has back and next, one dot per segment (filled when done; click to jump, hover for its name), extras, the eye (answers), the clock, theme, reset (click twice) and the key list. It fades to almost nothing when the mouse is still, so it doesn't sit on the projection.
- The clock is off by default (C). It shows time since you left the title and the current segment's planned window, red once you're past it.

| Key | Does |
|---|---|
| → Space PageDown | next build |
| ← PageUp | previous build |
| [ ] | previous / next segment |
| P | answers shown / hidden |
| X | extra builds on / off |
| N | add a room item (type, Enter) |
| 1–9 | in a list build: drop in that item (Shift: take it back) |
| 1 2 | on a predict build: one more vote for that hypothesis (Shift: one fewer) |
| F | turn the chosen card over (answers on) |
| ↑ ↓ | nudge the number you can drag |
| T | theme |
| B or . | blank the screen (any key brings it back) |
| C | clock |
| ? | the key list |

Presentation clickers send PageDown and PageUp, and they can't drag, so every drag has a click path too: click the card, then click where it goes. On a phone, swipe for builds, tap-tap for drags.

`#4` opens segment 4. `#all` opens with answers shown and extras on (same as the sauropod tool). Sorts, tallies and room items are saved per segment in localStorage, inside try/catch, and the page behaves the same if storage is blocked. Reset clears them. `prefers-reduced-motion` skips every animation to its end state.

## Parts used more than once

| Part | What you do with it | Where |
|---|---|---|
| Balance | Two hypotheses above two pans. Vote on the predict build (click a hypothesis or press 1 or 2; shift takes one back). Cards arrive one per build and sit bigger in the tray until placed. Drag a card, or click it and then click where it goes. Tilt = 4° per card of difference, capped at 20°. | Every case |
| Flip card | The cards on the balance. With answers on, the corner button opens one big in the middle and turns it over: what each hypothesis expects. | Every case |
| Room list | Preloaded items, hidden. Tap or number reveals one. N adds a new one. | Triceratops (extra), Signor–Lipps funnel, feathers |

```
   [picture of hypothesis 1]                   [picture of hypothesis 2]
        ● ● 2                                         ● ● ● ● 4         <- the room's votes
        [card]
     \___________/                              [card] [card]
           \______________________  ^  ______  \___________/
                                    |                                   tilt: 4° per card of difference
                                 [card]    both expect it: on the pivot, tips nothing
  ..........................................................................
  [card]   says little either way: on the floor
                         [ the card just dealt, bigger ]
```

Every card counts 1. If someone asks "but isn't the crater worth more than the climate?" (somebody will), that's the discussion, not a setting.

## Segments

Times are a first guess; the clock (C) shows them against the time since you left the title. Rail column: which framework question lights. ◉ = needs the eye open. Builds count from 0 here, as in `content.js`.

### Title, hook and framework (0–7)

| Seg | # | Prompt | Stage |
|---|---|---|---|
| Title | 0 | | "Reasoning from Bones" and a bone. |
| Hook | X | Which end is the head? | Cope's 1869 skeleton with no head; the skull floats above it. Drag it to either end; it snaps there, facing out. |
| | 1 | One of these is wrong. | Cope's 1869 reconstruction (head on the short end) above his corrected 1870 one (head on the long end). Both cut from Cope's plates, public domain. The 1869 skull can still be dragged. |
| | 2 | How would you check? | |
| Framework | 0 | | HOW DO YOU KNOW?, full screen. |
| | 1–5 | What exactly is the claim? · What do we see? · What else could do that? · What would tell them apart? · How sure should we be? | One icon per press: Claim, Evidence, Else?, Test, Sure?. They become the rail for every case after. |

### Elasmosaurus on the balance (7–16)

Pans: the 1869 picture (*Head on the short end*) and the 1870 picture (*Head on the long end*).

| # | Prompt | Stage | Rail |
|---|---|---|---|
| 0 | Head on the short end, or the long end? | The balance, empty. | Claim |
| 1 | Predict: which way will it tip? | Votes. | Sure? |
| 2–6 | | One card per press: One very long run of vertebrae · Chevrons under the short end · Joint facets face the long end · Neck-style ribs along the long run · Atlas and axis at the long end. | Evidence |
| 7 | Does a famous name change the evidence? | Card: A famous expert drew it. (Its place is the floor; the room should get there.) | Evidence |
| X | | Card: Lizards have long tails. | Evidence |
| 9 | Which cards did the tipping? | | Test |
| 10 ◉ | | Both reconstructions again. Cope's skull slides from the short end to the long end and turns to face out. Tag: J. Leidy, 1870. | |
| 11 | ~~Who said it?~~ What would let us check it? | The strike-through animates. | |

| Card | If head on the short end | If head on the long end |
|---|---|---|
| One very long run of vertebrae | expected: a long tail | expected: a long neck (pivot) |
| Chevrons under the short end | not expected: chevrons sit under tails | expected: the short end is the tail |
| Joint facets face the long end | not expected: the front faces the head | expected |
| Neck-style ribs along the long run | not expected | expected |
| Atlas and axis at the long end | not expected | expected: the skull sits on them |
| A famous expert drew it | says nothing about the bones | says nothing about the bones (floor) |
| Lizards have long tails (X) | makes it seem likely | says nothing about this animal |

The anatomy on these cards is a draft for the instructor to fix: which features Elasmosaurus actually preserves, and which one Leidy used.

### Valid vs. sound (16–20)

Stage: three tiles (P1, P2, C) and two lamps, *Follows* and *True*. Click a premise to mark it true or false. *True* lights only when both premises are true. *Follows* never changes, whatever you click.

| # | Prompt | Stage |
|---|---|---|
| 0 | If these were true, would this have to be? | All dinosaurs are green. / T. rex is a dinosaur. / So T. rex is green. *Follows* lit. |
| 1 | Are they true? | Room votes; instructor clicks the premises. |
| 2 | | The lamps get their names: *valid*, and a bracket around both: *sound*. |
| 3 | Same two questions. | Tiles swap: All reptiles sprawl, move slowly and drag their tails. / Dinosaurs are reptiles. / So dinosaurs sprawl, move slowly and drag their tails. |
| 4 | Where's the tail mark? | A trackway: prints step in one at a time, then a dashed line shows where a dragging tail would have scraped, and fades. (Built.) |
| 5 | Wrong conclusion? Check the premises. | |
| X | | P1's "All" becomes "Some". *Follows* goes dark. Validity is about shape, not truth. |

P2 is true however first-years define reptile (birds included or not), so the whole failure sits in P1. Students have to find *which* premise broke, which is the better exercise. This segment isn't in the standard format; it's the one place the deck checks reasoning rather than weighing evidence.

### Triceratops or Torosaurus? (20–30)

Pans: *Two species* and *One, growing* (words until the skull drawings exist).

| # | Prompt | Stage | Rail |
|---|---|---|---|
| 0 | Two species? | Two skulls side by side. | Claim |
| 1 | Or one animal, growing? | Growth morph (below). | Else? |
| X | Different skulls. Why else? | Room list: Age · Sex · Just variation · Where it lived · Squashed in the rock · Evolution. | Else? |
| 3 | Predict: which way will it tip? | Votes. | Sure? |
| 4–9 | | One card per press (below). | Evidence |
| 10 | Close call. What would settle it? | | Test |
| 11 | Growth can masquerade as species. | Tag: confounding. | |

| Card | If two species | If one, growing |
|---|---|---|
| No baby Torosaurus found | possible: a rare animal, rarer young | expected: Torosaurus is the adult |
| Torosaurus frills look old | possible: adults look adult | expected: the oldest stage |
| Some Torosaurus not fully grown | expected | not expected: it's the oldest stage |
| Torosaurus is much rarer | fine: a rare species | fine: few live that long (pivot) |
| Few in-between skulls | expected | not expected: growth passes through them |
| Torosaurus where Triceratops isn't | possible: different ranges | not expected: same animal, same places |

Drafts: check each against what Scannella & Horner (2010) and Longrich & Field (2012) argued, and whether southern *Torosaurus* material still counts. "No baby Torosaurus found" is an absence card on purpose; Signor–Lipps comes back to it. No build says which story won.

#### Growth morph

One schematic skull, side view. Drag the frill edge outward to age it: juvenile Triceratops → adult Triceratops → Torosaurus. Six shape parameters ride on that one age value: frill length, frill thickness, frill holes, horn angle (back-curved to forward), frill-edge spikes (pointed to flat), overall size. A toggle rearranges the same five skulls into one row or two. Nothing else changes. It's a cartoon of growth, not a reconstruction of any specimen; the readme says so.

### What ended the dinosaurs? (30–40)

Pans: an asteroid icon (*Impact*) and a volcano icon (*Volcanoes*).

| # | Prompt | Stage | Rail |
|---|---|---|---|
| 0 | Something big happened 66 million years ago. | Photo of the boundary clay. | Claim |
| 1 | An impact, or volcanoes? | The balance, empty. | Else? |
| 2 | Predict: which way will it tip? | Votes. | Sure? |
| 3–8 | | One card per press: Iridium spike · Shocked quartz · Glass spherules · A 180 km crater · Huge lava flows, India · Climate changed. | Evidence |
| X | | Five more: Extinction right at the line · Mercury spike · Warming before the line · Tsunami beds, Gulf coast · Crater age = boundary age. | Evidence |
| 14 | Hard to explain without an impact? Without volcanoes? | | Test |
| 15 | What changed minds? | Timeline fills one press at a time: 1980 iridium · 1984 shocked quartz · 1990 glass spherules, Haiti · 1991 the crater · 2010 big review · 2013 crater and boundary dated · 2019 Deccan timing, two answers. | |
| 16 | Both happened. How much did each matter? | Timing chart (below). | |
| 17 | The best explanation predicts what the others can't. | The balance again. Tag: inference to the best explanation. | |

| Card | If impact | If volcanoes |
|---|---|---|
| Iridium spike | expected: asteroids are iridium-rich | a little, maybe |
| Shocked quartz | expected | no: eruptions don't reach the pressure |
| Glass spherules | expected: melted ejecta | volcanic glass exists, wrong chemistry |
| A 180 km crater | expected | no |
| Huge lava flows, India | not predicted | expected |
| Climate changed | expected | expected (pivot) |

#### Timing chart

The x-axis runs roughly 66.4 to 65.6 million years. A vertical line for the impact and boundary. Deccan eruption pulses as bars, with a toggle between the Schoene et al. (2019) and Sprain et al. (2019) versions. Draw the bars from those papers' figures. Timing is the evidence that ought to separate the two causes, and at this resolution it's contested, which is a better ending than "impact won."

### The dwindling dinosaurs: Signor–Lipps (40–52)

Pans: two sketched range charts, drawn the same way (eight bars, sorted, the line at 0). *All at once*: every bar reaches the line. *A slow fade*: a staircase. (The outline's third prediction, "no predictable pattern", is gone: sorted, random last finds make a staircase, which is the point of the case, so it was never a separate answer.)

| # | Prompt | Stage | Rail |
|---|---|---|---|
| 0 | All at once, or a slow fade? | The balance, empty. | Claim |
| 1 | Predict: which way will it tip? | Votes. | Sure? |
| 2 | | Card: Last fossils fall short of the line. Most rooms put it on *A slow fade*. | Evidence |
| 3 | Suppose all 20 die at the line. | Stratigraphic column: 20 taxa, levels −50 to 0, red dashed line at 0. One press digs upward in about 4 s; finds pop in as dots. Each taxon's last find gets a tick. | Test |
| 4 | Does that look sudden? | Columns re-sort by last find, and the staircase appears. Side panel: number of taxa seen at or above each level. It dwindles toward the line. | Test |
| 5 ◉ | | True ranges draw in, faint, and every one reaches 0. | Test |
| 6 | What if fossils were easier to find? | Drag p (a yellow number, as in the sauropod tool), or ↑ ↓. Presets 0.03 · 0.08 · 0.20 · 0.50. Dice re-digs. | Test |
| 7 | Now where does that card go? | Back to the balance, the card where the room left it. It moves to the pivot. | Test |
| 8–9 | | Cards: Dig harder: ranges reach the line · Common plankton end right at the line. | Evidence |
| 10 | We didn't find it. Why not? | The funnel (below). | Else? |
| 11 | No keys in the kitchen. What did you learn? | | |
| 12 | Absence is weak evidence when detection is poor. | The balance again. Tag: Signor–Lipps effect. | |

| Card | If all at once | If a slow fade |
|---|---|---|
| Last fossils fall short of the line | expected: finds thin out before the end | expected (pivot, once the sim has run) |
| Dig harder: ranges reach the line | expected | not expected: they were already gone |
| Common plankton end right at the line | expected: common fossils turn up to the end | not expected |

The "dig harder" card is Marshall & Ward (1996): more intensive collecting of ammonites in the Basque sections pushed several ranges up to the boundary. The plankton card leans on the planktonic foraminifera record; Keller's gradualist reading of it is the counterargument, and worth having ready.

#### The funnel

Room list as a funnel, left to right. A column of 1000 dots (Lived); each reason the room gives becomes a gate, and the dots that pass fly on to the next column. Not buried · Destroyed since · Rock not exposed · Nobody looked · Not recognized take their places in that order whatever order they're said in; typed reasons join the end at 50%. Rates are draggable and marked *made-up rates*. "Never there" isn't a gate: it gets its own empty lane underneath that ends at 0, next to the main lane's handful (3 with the default rates).

What the sim should show (computed, 51 levels):

| p | median gap below 0 | mean gap | taxa 10+ levels short | of 20, never found |
|---|---|---|---|---|
| 0.03 | 22 | 18.7 | 74% | 4.2 |
| 0.08 | 8 | 10.8 | 43% | 0.3 |
| 0.20 | 3 | 4.0 | 11% | 0 |
| 0.50 | 0 | 1.0 | 0% | 0 |

Any one dig will wander around these. The default seed is picked so the first dig in class looks typical (median gap 8), not like a fluke. JS can't reproduce R's `set.seed(202)` draws, so the R code stays in the readme as the appendix and the deck uses its own seeded generator (mulberry32).

### Feathered dinosaurs (52–60)

Pans: *Feathers* and *Collagen*.

| # | Prompt | Stage | Rail |
|---|---|---|---|
| 0 | Feathers? Or rotted skin fibers? | Sinosauropteryx photo, zooming to the fuzz along the back. | Claim |
| 1 | Predict: which way will it tip? | The balance; votes. | Sure? |
| 2 | | Card: Sinosauropteryx, 1996 · fuzz. Both hypotheses expect it, which is why it started an argument. | Evidence |
| 3 | Skeptical. What would convince you? | Room list: More specimens · Better preservation · Branching · Many species · Pigment inside · Can't be collagen. | Else? |
| 4–7 | | One specimen per press: Caudipteryx 1998 (vaned feathers) · Microraptor 2003 (four wings) · Sinosauropteryx 2010 (pigment inside) · Yutyrannus 2012 (big, fuzzy). | Evidence |
| 8 | Confidence should move when evidence moves. | The votes from build 1 against where the scale ended up. | |

The pigment card has its own skeptics (some "melanosomes" elsewhere turned out to be microbes; Moyer et al. 2014). If a student pushes on it, that's the same move one level down. The readme mentions it; the slide doesn't.

### Debrief: how do you know? (60–68)

| # | Prompt | Stage |
|---|---|---|
| 0 | | The concept map frame: HOW DO YOU KNOW? → claim · evidence · alternatives → discriminating test → update confidence. |
| 1–4 | Which case caught a mistake? · Which pattern came from how we looked? · Which needed competing explanations? · Where could reasonable people disagree? | Each case's thumbnail docks at the node it worked; click thumbnails to light them, more than one can light. |
| 5 | | Terms appear around the edges: valid · sound · sampling bias · confounding · best explanation. |
| 6 | Not "believe scientists." Check, compare, test, update. | The board students photograph. |

Falsifiable is on the outline's vocabulary list, but no core case teaches it (it lives in the healed-bite extra). It only goes on the map if that extra ran.

### Exit ticket (68–75)

Three lines and a QR code to wherever responses get collected. The deck collects nothing.

1. A testable dinosaur claim. What would raise your confidence? Lower it?
2. Another explanation for that evidence.
3. One thing about how scientists decide.

X swaps in the transfer version: *A claim from outside science. Same questions.*

### Extras (X, or `#extras`)

| Extra | What happens |
|---|---|
| Healed bite | Edmontosaurus tail vertebra with a T. rex crown in healed bone (DePalma et al. 2013). Balance: Only scavenged / Sometimes hunted. Room list, *What has to be true for this to count?* Tooth ID right · Tooth made the wound · Bitten alive · Healing took time · Nothing else did it. |
| Bracket | Three tiles: bird, crocodile, and a dinosaur between them. Click bird or croc to toggle *has it*. The dinosaur's line goes solid (both have it), dashed (one), dotted (neither). Tag after: extant phylogenetic bracket. |
| Color | Melanosome shapes (sausage, sphere) mapped to colors. *Untestable → testable.* |

## Assets

| Asset | Where it's used | Source | Status |
|---|---|---|---|
| Cope's 1869 and corrected 1870 Elasmosaurus | Hook, Elasmosaurus pans | Cope's plates, public domain, via Wikimedia Commons; cut by `img/make_elasmo.py` | done |
| Triceratops / Torosaurus skulls | Case 1 | draw (morphable) | draw |
| Trackway | Valid/sound | drawn in SVG | done |
| Boundary clay photo | Case 3 | Wikimedia (Trinidad Lake, Colorado) or own | find |
| Sinosauropteryx, Caudipteryx, Microraptor, Yutyrannus | Case 4 | Wikimedia; check each license | find |
| Edmontosaurus vertebra with tooth | Extra | DePalma et al. 2013 figure; check license | find |

Credits go in the readme, not on the slides. If an image ever needs attribution on the page (anything CC BY), it gets a credits key (I).

## Check before it goes on screen

These fill the outline's TODOs and the card backs, from memory. None has been checked against the paper yet.

- Davidson JP (2002) Bonehead mistakes: the background in scientific literature and illustrations for Edward Drinker Cope's first presentation of *Elasmosaurus platyurus*. *Proc Acad Nat Sci Philadelphia* 152: 215–240. The Leidy 1870 tag comes from the same story. The Elasmosaurus card backs (chevrons, facets, ribs, atlas–axis) are the least certain item on this list.
- Longrich NR, Field DJ (2012) *Torosaurus* is not *Triceratops*: ontogeny in chasmosaurine ceratopsids as a case study in dinosaur taxonomy. *PLoS ONE* 7: e32623.
- Marshall CR, Ward PD (1996) Sudden and gradual molluscan extinctions in the latest Cretaceous of western European Tethys. *Science* 274: 1360–1363.
- Scannella JB, Horner JR (2010) *Torosaurus* Marsh 1891, is *Triceratops* Marsh 1889 (Ceratopsidae: Chasmosaurinae): synonymy through ontogeny. *J Vertebr Paleontol* 30: 1157–1168.
- Case 3 timeline: Alvarez et al. 1980; Bohor et al. 1984 (shocked quartz, *Science*); Hildebrand et al. 1991 (Chicxulub, *Geology*); Schulte et al. 2010; Renne et al. 2013 (*Science*, 66.043 Ma); Izett 1990 or Sigurdsson et al. 1991 for the Haiti spherules; Schoene et al. 2019 and Sprain et al. 2019 (same issue of *Science*, disagreeing on when Deccan's big pulses fell); Hull et al. 2020 (*Science*, most Deccan outgassing before the boundary).
- Case 4: Chen, Dong & Zhen 1998 (Sinosauropteryx, *Nature*; announced 1996); Lingham-Soliar et al. 2007 (collagen, *Proc R Soc B*); Ji et al. 1998 (Caudipteryx, *Nature*); Xu et al. 2003 (Microraptor, *Nature*); Zhang et al. 2010 (melanosomes, *Nature*); Xu et al. 2012 (Yutyrannus, *Nature*).
- The mercury-spike card needs its own source before it's used.
- Trackways: tail-drag traces are rare. If one ends up on a card, cite it.
- Nanotyrannus and Zanno & Napoli: nothing here depends on them.

## Build order

Built (October 2026): the deck engine and parts, every case's balance with its cards, Cope's two reconstructions with the moving skull, the trackway, and Signor–Lipps (sim and funnel). Everything else on screen is a dashed placeholder box naming the drawing that goes there.

1. Frame and parts: deck engine, rails, eye, keys, saved state; flip card, balance, room list. Done.
2. Signor–Lipps sim and funnel. Done.
3. Every case on the balance, Elasmosaurus pictures and skull, trackway. Done.
4. Drawings: Triceratops/Torosaurus skulls and the growth morph; the premise tiles and lamps; hypothesis pictures for Triceratops and feathers.
5. Feathers, concept map, exit ticket.
6. Extras. Printable case cards (a print stylesheet built from `content.js`: one page per case, the five prompts with blanks, no answers). A presenter window (second window kept in sync over BroadcastChannel, with the outline's notes and the clock).

## Tests

`node bones/tests/sim.test.js`, no dependencies, same style as `tests/model.test.js`.

- 10,000 digs at p = 0.08: mean gap 10.8 ± 0.3 levels, median 8.
- 10,000 digs at p = 0.20: mean gap 4.0 ± 0.2, median 3.
- Share never found at p = 0.08: 0.92^51 = 1.4%.
- Same seed, same dig.
- Balance (in the smoke test below): votes only on the predict build; a card on the pivot or the floor changes nothing; tilt stops at 20°.

`bones/tests/deck.smoke.js` runs the whole deck in jsdom (no layout, no canvas): every build forward and back, answers and extras, each part poked, reset. It needs jsdom, which the repo doesn't ship: `JSDOM=/path/to/node_modules/jsdom node bones/tests/deck.smoke.js`.

## Not in scope

- Collecting anything from students.
- Settling Triceratops vs. Torosaurus, or impact vs. volcanoes, on screen.
- The outline's instructor notes on the slides. They go in `readme.md`.
