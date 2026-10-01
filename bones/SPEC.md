# Reasoning from Bones: build spec

A 75-minute FS110 session as a clickable deck, built to run on the projector and still work on a phone afterward. The rules are the sauropod tool's rules: static files, no build step, opens offline, almost no words on screen. The difference is sequence. This one moves through nine segments after the title, so it needs a deck engine, but inside each segment the diagram is still the thing you grab.

The source is the revised instructor outline (October 2026). Times, prompts and cases come from it. Where the deck departs from it, the reason is written next to the change.

## Decisions

1. The instructor drives and the room talks. It's built for the projector first, but every control also works by touch, so the same URL works on a phone after class. It is not built for 30 laptops clicking at once, because there's no backend on GitHub Pages and per-student sorting eats the clock.

2. The word budget is one prompt line per build, 10 words at most, and many builds have none: the picture is enough while the instructor talks. Card fronts get a picture and at most 5 words, card backs get two short prediction lines, and nothing anywhere is a paragraph. Terms (confounding, Signor–Lipps, best explanation) appear as a small tag *after* the case, never before. That's "work the case first, name the concept second" made literal.

3. Cards are evidence, not explanation: each card states one observation, and you put it on the balance. Nothing on a card explains anything, because the instructor does that out loud. Anything that only repeats what the instructor will say (the hook's old row of clue cards, for one) stays off the screen.

4. Answers hide behind the eye (same button and key as the sauropod tool). Card backs and the true ranges in the sim stay hidden until it's pressed. Anything on GitHub Pages is public (the page source, this file, and the repo itself, since free Pages needs a public repo). So "hidden" means hidden from casual clicking, not secret. If the cases get reused for graded work, the card backs move to `answers.local.js`, which is listed in `.gitignore` and loaded by a `<script>` tag (a `fetch` of JSON fails from `file://`). Present from the local copy, and the published site has fronts only.

5. Almost everything is drawn as SVG and animated in JS, not shipped as GIFs. It stays sharp on a projector, follows the whiteboard/chalkboard theme, weighs kilobytes, and you can pause it, step it or drag it. A GIF can do none of that. Photos only where the real fossil is the point.

6. Every case runs the same way, on a balance. Two hypotheses, one per pan, each shown above its pan as a picture where there is one (Cope's 1869 and 1870 reconstructions, two sketched range charts, an asteroid and a volcano). The room predicts by voting, and the votes stay up as dots under each hypothesis. Then the evidence is dealt one card per press, and each card goes where the room argues it belongs: on a pan if one hypothesis expects it and the other doesn't, on the pivot if both expect it (it tips nothing), on the floor if it says little either way. Then you talk about where it tipped and why. That's the outline's A/B/C sort laid out in space, with the tilt as live feedback, and it's the same object six times, so students learn the object once and spend the rest of the class on the evidence.

7. The cases run from clear to unclear. Elasmosaurus settles hard on one side. Feathers starts ambiguous (the 1996 fuzz fits both) and ends on one side as specimens pile up. Triceratops/Torosaurus splits and doesn't settle. Impact vs. volcanoes leans one way, but on a question of how much each mattered rather than which happened. The decline case is the most ambiguous and closes the class: its cards come out level, and the simulation shows that the best-looking evidence for a decline ("Last fossils fall short of the line") is what a sudden extinction produces too. Spinosaurus, where good evidence lands on both pans, runs last if there's time.

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
    js/cases/*.js        elasmo, signor, funnel
    js/sim.js            Signor–Lipps sampler, no DOM
    img/                 photos + credits.json
    tests/sim.test.js    node bones/tests/sim.test.js
```

It publishes at `https://paleomitchelljs.github.io/fs110/bones/`, and the sauropod URL doesn't move.

Same stack as the sauropod tool: plain HTML, CSS and JS, one typeface, Source Sans 3, with system fallbacks (the sauropod tool's handwritten Kalam read as too casual here), and the same whiteboard/chalkboard tokens (copied for now, pulled into a shared `css/tokens.css` if a third tool shows up). All wording lives in `content.js`, so redrafting text never touches layout code.

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

`#4` opens segment 4. `#all` opens with answers shown and extras on (same as the sauropod tool). Votes, card placements, room lists and position are kept in sessionStorage: a reload in the middle of class keeps them, and a new tab (the next section, the next day) starts clean. Only the theme is remembered across visits. Everything sits inside try/catch, and the page behaves the same if storage is blocked. Reset clears it all. `prefers-reduced-motion` skips every animation to its end state.

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
| Hook | 0 | Which end is the head? | Cope's 1869 skeleton with no head, the skull floating above it. You drag the skull on; it snaps to whichever end you drop it near, facing out. |
| | 1 | | Cut to Cope's 1869 reconstruction (head on the short end) above his corrected 1870 one (head on the long end), with Cope's skull back where he put it. Both cut from Cope's plates, public domain. No prompt; the instructor asks. |
| Framework | 0 | | HOW DO YOU KNOW?, full screen. |
| | 1–5 | What exactly is the claim? · What do we see? · What else could do that? · What would tell them apart? · How sure should we be? | One icon per press: Claim, Evidence, Else?, Test, Sure?. They become the rail for every case after. |

### Elasmosaurus on the balance (7–14)

Pans: the 1869 picture (*Head on the short end*) and the 1870 picture (*Head on the long end*).

| # | Prompt | Stage | Rail |
|---|---|---|---|
| 0 | Head on the short end, or the long end? | The balance, empty. | Claim |
| 1 | Predict: which way will it tip? | Votes. | Sure? |
| 2–6 | | One card per press: One very long run of vertebrae · Chevrons under the short end · Joint facets face the long end · Neck-style ribs along the long run · Atlas and axis at the long end. | Evidence |
| 7 | | Card: A famous expert drew it. (Its place is the floor; the room should get there.) | Evidence |
| X | | Card: Lizards have long tails. | Evidence |
| 9 | Which cards did the tipping? | The next press goes straight to feathers. | Test |

| Card | If head on the short end | If head on the long end |
|---|---|---|
| One very long run of vertebrae | expected: a long tail | expected: a long neck (pivot) |
| Chevrons under the short end | not expected: chevrons sit under tails | expected: the short end is the tail |
| Joint facets face the long end | not expected: the front faces the head | expected |
| Neck-style ribs along the long run | not expected | expected |
| Atlas and axis at the long end | not expected | expected: the skull sits on them |
| A famous expert drew it | says nothing about the bones | says nothing about the bones (floor) |
| Lizards have long tails (X) | makes it seem likely | says nothing about this animal |

The anatomy on these cards is a draft for the instructor to fix: which features Elasmosaurus actually preserves.

### Feathered dinosaurs (14–21)

Pans: *Feathers* and *Collagen*.

| # | Prompt | Stage | Rail |
|---|---|---|---|
| 0 | Feathers? Or rotted skin fibers? | Sinosauropteryx photo: head and neck with the dark fringe of filaments. | Claim |
| 1 | Predict: which way will it tip? | The balance; votes. | Sure? |
| 2 | | Card: Sinosauropteryx, 1996 · fuzz. Both hypotheses expect it, which is why it started an argument. | Evidence |
| 3 | Skeptical. What would convince you? | Room list: More specimens · Better preservation · Branching · Many species · Pigment inside · Can't be collagen. | Else? |
| 4 | | Card: Fuzz on dinosaurs, not on lizards. If the halo were rotted collagen, lizards in the same beds should have one too: they have collagen in their skin. | Evidence |
| 5–8 | | One specimen per press: Caudipteryx 1998 (vaned feathers) · Microraptor 2003 (four wings) · Sinosauropteryx 2010 (pigment inside) · Yutyrannus 2012 (big, fuzzy). | Evidence |
| 9 | Confidence should move when evidence moves. | The votes from build 1 against where the scale ended up. | |

The pigment card has its own skeptics (some "melanosomes" elsewhere turned out to be microbes; Moyer et al. 2014). If a student pushes on it, that's the same move one level down. The readme mentions it; the slide doesn't.

### Triceratops or Torosaurus? (21–30)

Pictures: one Triceratops and one Torosaurus skull, cut from a two-panel figure at a single shared scale (`img/make_tritoro.py`). Pans: the same pair, small, with ≠ between them (*Two species*) or → (*One, growing*).

| # | Prompt | Stage | Rail |
|---|---|---|---|
| 0 | Two species? | The two skulls side by side at the same scale, captioned *Triceratops* and *Torosaurus*. | Claim |
| 1 | Or one animal, growing? | A curved arrow draws itself from the Triceratops skull to the Torosaurus skull. | Else? |
| X | Different skulls. Why else? | Room list: Age · Sex · Just variation · Where it lived · Squashed in the rock · Evolution. | Else? |
| 3 | Predict: which way will it tip? | Votes. | Sure? |
| 4–9 | | One card per press (below). | Evidence |
| 10 | Close call. What would settle it? | | Test |
| 11 | Growth can masquerade as species. | Tag: confounding. | |

| Card | If two species | If one, growing |
|---|---|---|
| No baby Torosaurus found | possible: a rare animal, rarer young | expected: Torosaurus is the adult |
| Torosaurus frills look old | possible: adults look adult | expected: the oldest stage |
| Subadult Torosaurus specimens | expected | not expected: it's the oldest stage |
| Torosaurus is much rarer | fine: a rare species | fine: few live that long (pivot) |
| Few in-between skulls | expected | not expected: growth passes through them |
| Torosaurus without Triceratops | possible: different ranges | not expected: same animal, same places |

Drafts: check each against what Scannella & Horner (2010) and Longrich & Field (2012) argued, and whether southern *Torosaurus* material still counts. "No baby Torosaurus found" is an absence card on purpose; Signor–Lipps comes back to it. No build says which story won.

### What ended the dinosaurs? (30–39)

Pans: an asteroid icon (*Impact*) and a volcano icon (*Volcanoes*).

| # | Prompt | Stage | Rail |
|---|---|---|---|
| 0 | Something big happened 66 million years ago. | The instructor's photo of the boundary in outcrop, a finger on the pale layer. | Claim |
| 1 | An impact, or volcanoes? | The balance, empty. | Else? |
| 2 | Predict: which way will it tip? | Votes. | Sure? |
| 3–8 | | One card per press: Iridium spike · Shocked quartz · Glass spherules · A 180 km crater · Huge lava flows, India · Climate changed. | Evidence |
| X | | Five more: Extinction right at the line · Mercury spike · Warming before the line · Tsunami beds, Gulf coast · Crater age = boundary age. | Evidence |
| 14 | Hard to explain without an impact? Without volcanoes? | | Test |
| 15 | The best explanation predicts what the others can't. | Tag: inference to the best explanation. | |

| Card | If impact | If volcanoes |
|---|---|---|
| Iridium spike | expected: asteroids are iridium-rich | a little, maybe |
| Shocked quartz | expected | no: eruptions don't reach the pressure |
| Glass spherules | expected: melted ejecta | volcanic glass exists, wrong chemistry |
| A 180 km crater | expected | no |
| Huge lava flows, India | not predicted | expected |
| Climate changed | expected | expected (pivot) |

#### Not built: a timing chart

Deccan eruption pulses against the impact, roughly 66.4 to 65.6 million years, with a toggle between the Schoene et al. (2019) and Sprain et al. (2019) versions. Timing is the evidence that ought to separate the two causes, and at this resolution it's contested. It needs the pulse dates read off those papers' figures before it can be drawn; until then the case ends on the balance.

### Were dinosaurs in decline before their extinction? Signor–Lipps (39–60)

The closer, and the most ambiguous case. It opens on the claim itself: Condamine et al. (2021, *Nature Communications*, CC BY 4.0), where extinction overtakes speciation in the last ~10 million years of the Cretaceous. The figure fills the stage with its credit underneath, and it comes back as the last build.

Pans: two sketched range charts, drawn the same way (eight bars, sorted, the line at 0). *All at once*: every bar reaches the line. *Already in decline*: a staircase. (The outline's third prediction, "no predictable pattern", is gone: sorted, random last finds make a staircase, which is the point of the case, so it was never a separate answer.)

| # | Prompt | Stage | Rail |
|---|---|---|---|
| 0 | Were dinosaurs in decline before their extinction? | The Condamine et al. figure, credited. | Claim |
| 1 | Predict: which way will it tip? | The balance; votes. | Sure? |
| 2–7 | | One card per press (below). Most rooms put "Last fossils fall short of the line" on *Already in decline*. | Evidence |
| 8 | Suppose all 20 die at the line. | Stratigraphic column: 20 taxa, levels −50 to 0, red dashed line at 0. One press digs upward in about 4 s; finds pop in as dots. Each taxon's last find gets a tick. | Test |
| 9 | Does that look sudden? | Columns re-sort by last find, and the staircase appears. Side panel: number of taxa seen at or above each level. It dwindles toward the line. | Test |
| 10 ◉ | | True ranges draw in, faint, and every one reaches 0. | Test |
| 11 | What if fossils were easier to find? | Drag p (a yellow number, as in the sauropod tool), or ↑ ↓. Presets 0.03 · 0.08 · 0.20 · 0.50. Dice re-digs. | Test |
| 12 | Now where do the cards go? | Back to the balance, cards where the room left them. "Fall short" moves to the pivot; the rate-model card may get argued down too. | Test |
| 13 | We didn't find it. Why not? | The funnel (below). | Else? |
| 14 | Absence is weak evidence when detection is poor. | The balance again. Tag: Signor–Lipps effect. | |
| 15 | | The Condamine et al. figure again. | |

| Card | If all at once | If already in decline |
|---|---|---|
| Last fossils fall short of the line | expected: finds thin out before the end | expected (pivot, once the sim has run) |
| Extinction outpaced speciation | possible: if the record thins out | expected |
| Herbivore variety shrank in North America | not expected | expected |
| Dinosaur bones just below the line | expected | possible: fewer, not none |
| Hell Creek: diverse to the end | expected | not expected |
| Less late Cretaceous rock to search | expected: an apparent decline | fits too (pivot) |

Placed by their backs: two on each pan, two on the pivot, level. The live argument is whether the rate decline survives correcting for how much rock there is to search (Condamine et al. 2021 say it does; Bonsor et al. 2020 and Chiarenza et al. 2019 read the same era differently). The rate card is the one to watch after the simulation.

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

### Did Spinosaurus hunt underwater? (60–68, if there's time)

Last, if there's time; `]` skips straight to the exit ticket. Chosen because the evidence conflicts. Since 2014 two camps have read the same animal in opposite directions, and several of the cards are disputed in their own right. Placed by their backs, the cards leave the scale level: the honest answer is that nobody knows yet, and the useful question is what would settle it.

Pans: *Swam after prey* and *Waded at the edge* (words until there are pictures).

| # | Prompt | Stage | Rail |
|---|---|---|---|
| 0 | Did Spinosaurus hunt underwater? | The balance, empty. | Claim |
| 1 | Predict: which way will it tip? | Votes. | Sure? |
| 2–7 | | One card per press (below). | Evidence |
| 8 | Evidence pulls both ways. What would settle it? | | Test |

| Card | If it swam after prey | If it waded at the edge |
|---|---|---|
| Dense, heavy limb bones | expected: ballast for diving | not expected |
| Tall, paddle-like tail | expected: a tail to swim with | possible: display |
| Floats tipped over in models | not expected: a diver needs to be stable | expected: it stood in the shallows |
| Big sail on its back | a problem: drag and roll in water | fine: display on land |
| Bone chemistry like crocodiles' | expected | expected: it lived by water either way (pivot) |
| Long jaws, cone-shaped teeth | expected: a fish eater | expected: a fish eater (pivot) |

Two cards carry their own fights. The bone-density argument (Fabbri et al. 2022) was challenged on method (Myhrvold et al. 2024), and whether the tail could drive it through water is disputed (Ibrahim et al. 2020; Sereno et al. 2022). If a student wants to move one of those cards on exactly those grounds, the case is working.

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
| Triceratops and Torosaurus skulls | Triceratops case, its pans | two-panel figure supplied by the instructor, cut by `img/make_tritoro.py` | done; source and licence to record |
| Boundary photo | K–Pg | the instructor's own | done |
| Condamine et al. 2021, Fig. | Decline case, first and last build | *Nature Communications*, CC BY 4.0; credited on the slide | done |
| Boundary clay photo | Case 3 | Wikimedia (Trinidad Lake, Colorado) or own | find |
| Sinosauropteryx photo | Feathers, build 0 | supplied by the instructor | done; source and licence to record |
| Caudipteryx, Microraptor, Yutyrannus | Feathers cards, if they get pictures | Wikimedia; check each license | not needed yet |
| Edmontosaurus vertebra with tooth | Extra | DePalma et al. 2013 figure; check license | find |

Credits go in the readme, not on the slides. If an image ever needs attribution on the page (anything CC BY), it gets a credits key (I).

## Check before it goes on screen

These fill the outline's TODOs and the card backs, from memory. None has been checked against the paper yet.

- Davidson JP (2002) Bonehead mistakes: the background in scientific literature and illustrations for Edward Drinker Cope's first presentation of *Elasmosaurus platyurus*. *Proc Acad Nat Sci Philadelphia* 152: 215–240. The Elasmosaurus card backs (chevrons, facets, ribs, atlas–axis) are the least certain item on this list.
- Longrich NR, Field DJ (2012) *Torosaurus* is not *Triceratops*: ontogeny in chasmosaurine ceratopsids as a case study in dinosaur taxonomy. *PLoS ONE* 7: e32623.
- Spinosaurus: Ibrahim et al. 2014 (*Science*, semiaquatic adaptations); Amiot et al. 2010 (*Geology*, oxygen isotopes in spinosaurids); Henderson 2018 (*PeerJ*, buoyancy and stability); Ibrahim et al. 2020 (*Nature*, the tail); Hone & Holtz 2021 (*Palaeontologia Electronica*, shoreline generalist); Fabbri et al. 2022 (*Nature*, bone density); Sereno et al. 2022 (*eLife*, "not an aquatic dinosaur"); Myhrvold et al. 2024 (*PLoS ONE*, caveats on bone compactness).
- The lizard card: which Jehol lizards are preserved with skin, and that none carries a filament halo.
- Decline case: Condamine FL, Guinot G, Benton MJ, Currie PJ (2021) Dinosaur biodiversity declined well before the asteroid impact, influenced by ecological and environmental pressures. *Nature Communications* (doi:10.1038/s41467-021-23754-0); Brusatte et al. 2012 (*Nature Communications*, herbivore disparity); Lyson et al. 2011 (*Biology Letters*, a ceratopsian horn just below the boundary, "closing the 3 m gap"); Hell Creek diversity to the end (Pearson et al. 2002; Fastovsky & Bercovici 2016); the sampling side (Chiarenza et al. 2019, *Nature Communications*; Bonsor et al. 2020, *Royal Society Open Science*).
- Scannella JB, Horner JR (2010) *Torosaurus* Marsh 1891, is *Triceratops* Marsh 1889 (Ceratopsidae: Chasmosaurinae): synonymy through ontogeny. *J Vertebr Paleontol* 30: 1157–1168.
- K–Pg cards, and the timing chart if it gets built: Alvarez et al. 1980; Bohor et al. 1984 (shocked quartz, *Science*); Hildebrand et al. 1991 (Chicxulub, *Geology*); Schulte et al. 2010; Renne et al. 2013 (*Science*, 66.043 Ma); Izett 1990 or Sigurdsson et al. 1991 for the Haiti spherules; Schoene et al. 2019 and Sprain et al. 2019 (same issue of *Science*, disagreeing on when Deccan's big pulses fell); Hull et al. 2020 (*Science*, most Deccan outgassing before the boundary).
- Case 4: Chen, Dong & Zhen 1998 (Sinosauropteryx, *Nature*; announced 1996); Lingham-Soliar et al. 2007 (collagen, *Proc R Soc B*); Ji et al. 1998 (Caudipteryx, *Nature*); Xu et al. 2003 (Microraptor, *Nature*); Zhang et al. 2010 (melanosomes, *Nature*); Xu et al. 2012 (Yutyrannus, *Nature*).
- The mercury-spike card needs its own source before it's used.
- Nanotyrannus and Zanno & Napoli: nothing here depends on them.

## Build order

Built (October 2026): the deck engine and parts, every case's balance with its cards, Cope's two reconstructions with the draggable skull, the Triceratops and Torosaurus skulls, the boundary and Sinosauropteryx photos, and Signor–Lipps (sim and funnel). Everything else on screen is a dashed placeholder box naming the drawing that goes there.

1. Frame and parts: deck engine, rails, eye, keys, saved state; flip card, balance, room list. Done.
2. Signor–Lipps sim and funnel. Done.
3. Every case on the balance, Elasmosaurus pictures and skull, Triceratops skulls, boundary photo. Done.
4. Drawings: the premise tiles and lamps; hypothesis pictures for feathers; photos for K–Pg and feathers.
5. Feathers, Spinosaurus, exit ticket. Done except the exit ticket's QR code.
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
