# Reasoning from Bones

A 75-minute FS110 session as a clickable deck. One question runs the whole class: how do you know? The page carries almost no words, because the talking happens in the room. `SPEC.md` has the full plan; this file covers running it.

## Running it

Open `index.html` in a browser. No build step, no install, no server, and it works offline (fonts fall back to system ones). If Pages is already serving the sauropod tool from the repo root, this folder shows up at `https://paleomitchelljs.github.io/fs110/bones/` once it's pushed to `main`, with no settings change.

Everything you do on the page (sorts, hand counts, room lists, the dig) is saved in the browser. **Between sections, start over**: the circular arrow, clicked twice. That clears every count and sort and goes back to the title.

## In class

Space, →, or a clicker's page-down moves one build. The control bar sits top right and fades out when the mouse is still. `?` shows every key.

- **P** shows answers: card backs, the true ranges in the dig. A build that needs them shows a pulsing eye on the prompt line; click it or press P.
- **X** turns on extra builds and extra cards (the five extra K–Pg cards, the headless-skeleton opener, the transfer version of the exit ticket).
- Drag a card, or click it and then click where it goes (a clicker can't drag). A card on the pivot tips nothing. A card on the floor tips nothing either; that's where "says little" goes.
- In a room list, tap a numbered slot when a student says the thing (or press the number). N types in something you didn't preload. Shift takes one back.
- In a confidence or vote build, press 1–5 once per hand. Shift takes one back.
- **B** blanks the screen; any key brings it back. **C** shows a clock against the outline's timeline.

`#5` in the address opens segment 5 (count from 0: title, hook, framework, valid/sound, Case 1, Case 2, K–Pg, feathers, debrief, exit). `#5.3` opens its fourth build. `#all` opens with answers and extras on.

## What's built

| Segment | State |
|---|---|
| Title, framework | done |
| Hook | name tags, clue cards, the strike-through and HOW DO YOU KNOW? work; both reconstructions and the skull slide are placeholders |
| Valid vs. sound | prompts only; tiles, lamps and trackway are a placeholder |
| Case 1 | room list, balance and confidence work; the two skulls and the growth morph are placeholders |
| Case 2 | done: prediction vote, dig, sort, true ranges, draggable p, funnel |
| K–Pg | balance (with the pile) and confidence work; boundary photo, timeline and timing chart are placeholders |
| Feathers | confidence, room list, the specimen balance and the before/after confidence work; the photo is a placeholder and the cards have no pictures yet |
| Debrief | prompts only; the concept map is a placeholder |
| Exit ticket | text works; the QR code is a placeholder |

Placeholders are dashed boxes naming what goes there. All the wording, cards and list items live in `js/content.js`. **Every card back is a draft**; check each against the papers before class (SPEC.md lists them). The hook's clue-card backs are just `…` until you write them.

## Case 2, the dig

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

## Case 2, the funnel

A thousand animals lived. Each reason the room gives for not finding one becomes a gate, and the survivors fly on to the next column. The rates are made up, and the screen says so. Defaults: buried 15%, not destroyed since 40%, rock exposed 20%, someone looked 15%, recognized 60%. That leaves 3 of 1000 with these draws (the product says about 1; a handful either way is the point). Order doesn't change the final count, since it's a product, so gates sit in causal order no matter what order the room says them in, and typed-in reasons join the end at 50%.

"Never there" isn't a gate. It gets its own empty lane underneath that ends at 0, so the board shows two different worlds producing almost the same result.

## Tests

`node bones/tests/sim.test.js` checks the sampler against the exact geometric expectations (mean and median gap, share never found) over 10,000 digs, and checks that the default seed is typical.

`bones/tests/deck.smoke.js` runs the whole deck in jsdom: every build forward and back, answers and extras, each part poked, reset. It needs jsdom, which this repo doesn't ship. Install it anywhere and point at it: `JSDOM=/path/to/node_modules/jsdom node bones/tests/deck.smoke.js`. It checks logic, not looks; jsdom does no layout.

## Sources

Signor PW, Lipps JH (1982) Sampling bias, gradual extinction patterns, and catastrophes in the fossil record. In: Silver LT, Schultz PH (eds) *Geological implications of impacts of large asteroids and comets on the Earth*. Geological Society of America Special Paper 190: 291–296.

The rest are listed, unchecked, in SPEC.md under "Check before it goes on screen."
