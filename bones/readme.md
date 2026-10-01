# Reasoning from Bones

A 75-minute FS110 session as a clickable deck. One question runs the whole class: how do you know? The page carries almost no words, because the talking happens in the room. `SPEC.md` has the full plan; this file covers running it.

Every case runs the same way, on a balance. Two hypotheses sit above two pans. The room predicts (votes). The evidence arrives one card per press, and each card goes where the room argues it belongs: on a pan if only that hypothesis expects it, on the pivot if both do (it tips nothing), on the floor if it says little. Then you talk about where it tipped. The cases run from clear to unclear: Elasmosaurus (head or tail?), feathers, Triceratops or Torosaurus, impact or volcanoes, and the closer, "Were dinosaurs in decline before their extinction?" (Signor–Lipps). Spinosaurus (did it hunt underwater?) runs last if there's time; `]` skips it.

## Running it

Open `index.html` in a browser. No build step, no install, no server, and it works offline (fonts fall back to system ones). On GitHub Pages it's at `https://paleomitchelljs.github.io/fs110/bones/`, one tile on the FS110 landing page; the repo's top-level readme covers publishing.

Everything you do on the page (votes, where each card went, room lists, the dig) survives a reload, but a new tab starts clean, so the next section gets an empty board. To clear it without a new tab: the circular arrow, clicked twice. Only the whiteboard/chalkboard choice is remembered between visits.

## In class

Space, →, or a clicker's page-down moves one build. The control bar sits top right and fades out when the mouse is still. `?` shows every key.

- **P** shows answers: card backs and the true ranges in the dig. A build that needs them shows a pulsing eye on the prompt line; click it or press P.
- **X** turns on extra builds and extra cards ("Lizards have long tails" for Elasmosaurus, the "why else?" list for Triceratops, the five extra K–Pg cards, the transfer version of the exit ticket).
- On a predict build, press 1 or 2 once per hand (or click a hypothesis). Shift takes one back. Votes freeze once you move on and stay up as dots.
- Drag a card, or click it and then click where it goes (a clicker can't drag). The card just dealt sits bigger in the tray until it's placed.
- With P on, the round button on a card's corner opens it big and turns it over: what each hypothesis expects.
- In a room list, tap a numbered slot when a student says the thing (or press the number). N types in something you didn't preload. Shift takes one back.
- The hook opens on Cope's 1869 skeleton with no head. Drag the skull on: it snaps to whichever end you drop it near and faces out. The next press cuts to his two reconstructions.
- **B** blanks the screen; any key brings it back. **C** shows a clock against the outline's timeline.

`#5` in the address opens segment 5 (count from 0: title, hook, framework, Elasmosaurus, feathers, Triceratops, K–Pg, decline, Spinosaurus, exit). `#5.3` opens its fourth build. `#all` opens with answers and extras on.

## What's built

| Segment | State |
|---|---|
| Title, hook, framework | done: Cope's 1869 and 1870 reconstructions, the draggable skull, HOW DO YOU KNOW?, the five questions |
| Elasmosaurus | done: the balance with the two reconstructions over the pans, seven cards, then straight on to Triceratops |
| Triceratops | done: the two skulls at one scale, the growth arrow, the skull pair over each pan (≠ and →), room list, balance |
| K–Pg | done: your boundary photo, then the balance with asteroid and volcano. The timing chart isn't built (it needs the pulse dates from Schoene et al. and Sprain et al. 2019) |
| Decline (Signor–Lipps) | done: the Condamine et al. figure, balance with six cards that come out level, dig, sort, true ranges, draggable p, back to the balance, funnel, the figure again |
| Feathers | done: the Sinosauropteryx photo, room list, balance with the lizard card and four specimens; the cards have no pictures |
| Spinosaurus | done: balance with six cards that leave it near level; the pans are words until there are pictures |
| Exit ticket | text works; the QR code is a placeholder |

Placeholders are dashed boxes naming what goes there. All the wording, cards and list items live in `js/content.js`. **Every card back is a draft**; check each against the papers before class (SPEC.md lists them). The Elasmosaurus anatomy cards especially: they're drafted from general plesiosaur anatomy, not from the type specimen.

## Signor–Lipps, the dig

Twenty taxa, levels −50 to 0, and every taxon lives the whole interval and dies at 0. At each level a fossil turns up with chance p (0.08 to start). Each taxon/level pair gets one fixed random draw, so dragging p only adds or removes finds; nothing reshuffles. The dice gives a new set of draws.

The default dig (seed 300) is a typical one, picked so the first thing the class sees isn't a fluke: at p = 0.08 the median taxon's last find sits 8 levels below the boundary, the mean is 11.3 (the long-run mean is 10.8), two taxa reach level 0, and every taxon turns up at least once. What to expect over many digs:

| p | median gap below 0 | mean gap | taxa 10+ levels short | of 20, never found |
|---|---|---|---|---|
| 0.03 | 22 | 18.7 | 74% | 4.2 |
| 0.08 | 8 | 10.8 | 43% | 0.3 |
| 0.20 | 3 | 4.0 | 11% | 0 |
| 0.50 | 0 | 1.0 | 0% | 0 |

The side panel counts taxa whose last find is at or above each level, which is the apparent diversity. It dwindles toward the boundary even though all 20 are alive right up to it. With P on, a dashed line at 20 shows the truth.

The deck's random numbers come from its own generator, so it can't reproduce R's `set.seed(202)`. The outline's R version, for anyone who wants it:

```r
set.seed(202)
n_taxa   <- 20
levels   <- -50:0      # stratigraphic levels; 0 = K-Pg boundary
p_fossil <- 0.08       # per-level preservation/detection probability
last_seen <- sapply(seq_len(n_taxa), function(i) {
  found <- levels[runif(length(levels)) < p_fossil]
  if (length(found) == 0) NA else max(found)
})
ord <- order(last_seen, na.last = NA)
plot(last_seen[ord],
     seq_along(ord),
     pch = 19,
     xlim = range(levels),
     xlab = "Level (0 = boundary)",
     ylab = "Taxon (sorted)",
     main = "Last observed occurrence")
abline(v = 0, lty = 2, col = "red")
```

## Signor–Lipps, the funnel

A thousand animals lived. Each reason the room gives for not finding one becomes a gate, and the survivors fly on to the next column. The rates are made up, and the screen says so. Defaults: buried 15%, not destroyed since 40%, rock exposed 20%, someone looked 15%, recognized 60%. That leaves 3 of 1000 with these draws (the product says about 1; a handful either way is the point). Order doesn't change the final count, since it's a product, so gates sit in causal order no matter what order the room says them in, and typed-in reasons join the end at 50%.

"Never there" isn't a gate. It gets its own empty lane underneath that ends at 0, so the board shows two different worlds producing almost the same result.

## Tests

`node bones/tests/sim.test.js` checks the sampler against the exact geometric expectations (mean and median gap, share never found) over 10,000 digs, and checks that the default seed is typical.

`bones/tests/deck.smoke.js` runs the whole deck in jsdom: every build forward and back, answers and extras, each part poked, reset. It needs jsdom, which this repo doesn't ship. Install it anywhere and point at it: `JSDOM=/path/to/node_modules/jsdom node bones/tests/deck.smoke.js`. It checks logic, not looks; jsdom does no layout.

## Images

Both Elasmosaurus figures are Cope's own, public domain, from Wikimedia Commons: the 1869 reconstruction with the head on the tail ([File:Elasmosaurus_Cope.jpg](https://commons.wikimedia.org/wiki/File:Elasmosaurus_Cope.jpg), from Cope 1869, *Trans Am Philos Soc*, via the Biodiversity Heritage Library) and his corrected 1870 version ([File:Elasmosaurus_corrected.jpg](https://commons.wikimedia.org/wiki/File:Elasmosaurus_corrected.jpg)). `img/make_elasmo.py` cuts each figure out of its plate, masks the neighbouring figures, drops the paper so the lines sit on either theme, thickens the lines a little for projection, and cuts the 1869 skull out as its own piece.

The Triceratops and Torosaurus skulls come from a two-panel figure (A and B, one scale bar each, the same length). `img/make_tritoro.py` cuts them apart, removes the panel letters and scale bars, and makes the white background transparent, including the white showing through the frill openings and orbits. They keep the figure's shared scale everywhere they appear. Source and licence: to record here before the site goes public.

The bone on the title card and the K–Pg boundary photo are the instructor's own. The decline figure is Condamine et al. 2021, *Nature Communications* ([doi:10.1038/s41467-021-23754-0](https://doi.org/10.1038/s41467-021-23754-0)), open access under CC BY 4.0, credited on the slide. The Sinosauropteryx photo: source and licence to record here before the site goes public.

## Sources

Signor PW, Lipps JH (1982) Sampling bias, gradual extinction patterns, and catastrophes in the fossil record. In: Silver LT, Schultz PH (eds) *Geological implications of impacts of large asteroids and comets on the Earth*. Geological Society of America Special Paper 190: 291–296.

The rest are listed, unchecked, in SPEC.md under "Check before it goes on screen."
