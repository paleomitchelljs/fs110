# Tanis fact cards

A drip-feed evidence activity. Each student holds a printed fact card about the Tanis site (or about biology, geology, physics in general). The class builds hypotheses, then facts are added one at a time and the room decides whether each one supports, weakens, or rules out a hypothesis.

## Running it

Open `index.html`. No build step, no server.

1. Type a hypothesis over each pan (the two boxes at top). They start blank so the class can supply them.
2. A student reads out the number on their card. Pick that number from the **＋** dropdown (bottom right). The card is dealt and opens big so the room can read it; click to close.
3. The room says where it goes. Drag the card, or click it and then click the spot:
   - **a pan**: it favours that hypothesis (or counts against the other). Each card is 4° of tilt, capped at 20°.
   - **the hypothesis label**: it rules that hypothesis out. The label is struck through, the pan lifts, the beam goes fully to the other side. Drag the card out to bring the hypothesis back.
   - **the pivot**: both hypotheses expect it, so it tips nothing.
   - **the floor**: it says little either way.
4. The round arrows on a card (or double-click) re-open its full text. **Delete** with a card selected returns it to the dropdown. **T** switches whiteboard/chalkboard. The circular arrow clears the board and labels (click twice).

The board survives a reload but not a new tab. Only the theme is remembered.

## Printing the cards

`cards.tex` is generated; don't edit it by hand.

```
node tanis/tools/make_cards.js
pdflatex tanis/cards.tex
```

Eight cards per US-letter page (two across, four down), in number order so a card is easy to find. Cards butt together: cut along the grey lines. Needs the `sourcesanspro` package (in standard TeX Live).

## Editing the facts

Everything is in `js/facts.js`: number and text. Edit there, rerun `make_cards.js`, and `node tanis/tests/facts.test.js` confirms the sheet matches. The numbers were drawn at random so they don't reveal the argument's order; **don't renumber after you've printed**.  Cards have no titles, so nothing hints at where a fact belongs.
