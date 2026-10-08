# Tanis fact cards

A drip-feed evidence activity. Each student holds a printed fact card about the Tanis site (or about biology, geology, physics in general). The class builds hypotheses, then facts are added one at a time and the room decides whether each one supports, weakens, or rules out a hypothesis.

The question has three parts, so the page holds up to three balances side by side, each with its own pair of labels. The labels start blank so the page doesn't give the parts away.

## Running it

Open `index.html`. No build step, no server.

1. Type a hypothesis over each pan (the two boxes at top). The **balance-with-plus** button (bottom right) adds another balance, up to three; the **balance-with-minus** button removes the last one (click twice if it is in use, its cards go back to the tray).
2. A student reads out the number on their card. Pick that number from the **＋** dropdown (bottom right). The card is dealt and opens big so the room can read it; click to close.
3. The room says where it goes. Drag the card, or click it and then click the spot:
   - **a pan**: it favours that hypothesis (or counts against the other). Each card is 4° of tilt, capped at 20°.
   - **the hypothesis label**: it rules that hypothesis out. The label is struck through, the pan lifts, the beam goes fully to the other side. Drag the card out to bring the hypothesis back.
   - **the pivot**: both hypotheses expect it, so it tips nothing.
   - **the floor**: it says little either way.
4. The overlapping-squares button on a card (or **D** with the card selected) makes a copy in the tray, so one fact can be weighed on more than one balance. A balance holds one copy of a card; dropping a second copy there replaces the first. The round arrows on a card (or double-click) re-open its full text.
5. The three thumbnails at the top (fish, paleomap, site) open the picture full screen. Click it, or press a key, to close; **←/→** or **1/2/3** switch pictures.
6. **Delete** with a card selected removes that card (it returns to the dropdown once no copies are left). **T** switches whiteboard/chalkboard. The circular arrow clears the board, labels and extra balances (click twice).

Images live in `img/` (`fish.jpg`, `map.jpg`, `site.jpg`); the thumbnails are listed in `index.html`. The map carries its own credit (Ron Blakely, Colorado Plateau Geosystems / TA Gates et al, via BBC). The fish photo and the site figure (A–C) carry no credit line, so add their sources here before sharing the page.

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
