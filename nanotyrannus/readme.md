# Nanotyrannus evidence waves

A clone of the Tanis fact-card balance (`../tanis`) with one change: the evidence is released in **waves, in the order it was discovered**. Every card carries its date. The class holds a hypothesis about a small Hell Creek tyrannosaur, and each wave of new evidence has to be placed on the balance.

The two hypotheses are not printed anywhere. A natural pair: **Nanotyrannus is its own genus** vs **it is a juvenile *T. rex***. A second balance can ask a narrower question (was the animal still growing when it died?), a third can take Paul's multiple-small-species idea.

## Running it

Open `index.html`. No build step, no server. Everything works as in Tanis (see `../tanis/readme.md`: pans, labels strike out, pivot, floor, copy, reader, balances, theme, reset), plus:

- The strip along the top has one pip per wave, labelled by years. Click the dashed pip to the right of the open ones to **release the next wave**. Click the last open pip to take it back (only while none of its cards are on the board).
- The **＋** dropdown lists only released cards, grouped by wave. Students read the number off their card; pick it.
- A pip greys when every card in its wave has been dealt, so you can see when to move on.
- Cards show number and year. The reader shows the year large.
- Start over resets the waves to the first.

No images yet: add skull figures (the 1942 holotype, Jane, the Dueling Dinosaurs skeleton) as a thumbnail strip as in Tanis if you want them.

## Cards

Every card is a direct observation, in one of two kinds (kept as `kind` in `js/facts.js`, never shown on a card):

- **specimen**: something observed on the 1942 skull, Jane (Burpee skeleton) or the Dueling skeleton ("The 1942 skull has 15 teeth in one side of its upper jaw").
- **species**: something observed in another animal ("In Gorgosaurus, young animals have more teeth than adults").

No researcher names, no history, no conclusions. The date is when the observation became available.

## Waves

| wave | dates | cards |
|---|---|---|
| 1 | 1942–65 | skull size; resemblance to Gorgosaurus; small Mongolian tyrannosaurs that are young Tarbosaurus |
| 2 | 1988 | skull bones look fused; 15 upper teeth |
| 3 | 1999–2003 | open joints; tooth loss with growth in Gorgosaurus; Jane; skull shape across growth |
| 4 | 2011–20 | Tarbosaurus teeth; hand and wishbone of the Dueling skeleton; Jane's bone histology |
| 5 | 2024–25 | family-tree placement; immature characters in family-tree analyses |
| 6 | Oct 2025 | Dueling skeleton: skull length, growth rings, age, teeth, arms, limb shrinkage, tail, air sacs |
| 7 | Dec 2025–26 | hyoid histology of the 1942 skull; Jane against the T. rex growth curve |

Some cards cut across each other on purpose: wave 2 says fused, wave 3 says open; wave 4's Jane histology (still growing) and wave 7's growth-curve card point different ways.

## Check before printing

This is a **draft**. The facts were assembled from Wikipedia's *Nanotyrannus* article, a press release (EurekAlert, Oct 2025), and search summaries, not from the papers. Verify against primary sources, especially:

- 1942: skull length 57 cm; that only a skull was recovered; adult *T. rex* skulls "more than a meter."
- 1946: the Gorgosaurus resemblance and the "about 9 million years" gap.
- 1965: that small Mongolian tyrannosaurs once named separately are young *Tarbosaurus* (the date is when the idea was first proposed).
- 1988 and 1999: "appear fused" vs "open joints"; 15 upper teeth; Gorgosaurus tooth loss with growth; the Currie 2003 skull-shape wording.
- 2011: juvenile *Tarbosaurus* tooth count "about the same" as adults.
- 2013: which specimen the hand and wishbone claims rest on, and in which direction they differ.
- 2020: Jane's bone histology (growth rings, still-growing tissue).
- 2024 and Jun 2025: family-tree placement ("may fall outside Tyrannosauridae"); the immaturity-scoring point.
- Oct 2025 (*Nature* 648: 357–367): skull length 71 cm; tightly packed outer rings; ages 17–22 vs 8–14; 16 and 17 upper teeth; larger arm and hand; fewer tail vertebrae; pleurocoel detail; and that "limb bones do not shrink" holds as stated.
- Dec 2025 hyoid study and Jan 2026 histology: both recent, from a single secondary source.

Dates are the year the work appeared, not the year of the specimen; month is given only for 2025–26.

## Printing the cards

`cards.tex` is generated; don't edit it by hand.

```
node nanotyrannus/tools/make_cards.js
pdflatex nanotyrannus/cards.tex
```

Eight cards per US-letter page, in date order (cards are numbered 1–24 in that order, so number order and date order are the same). Each card shows its number and, on the right, its date. Needs `sourcesanspro`.

## Editing the facts

Everything is in `js/facts.js`: number, date, wave, text. Edit there, rerun `make_cards.js`, and `node nanotyrannus/tests/facts.test.js` confirms numbers, date order, waves and the sheet. Cards are numbered in date order, so inserting a card means renumbering; do that before printing. The test checks that numbers follow the file order.
