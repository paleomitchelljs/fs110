# Stats

A short quiz, then one picture for each of three classic stumpers. Open `index.html`; no build step, no server. Keys **1–4** switch pages (quiz, a, b, c).

## Quiz

The three questions, verbatim from the lesson, with no feedback. Choices: a) 25 / 33 / 50 / 67%, b) 99 / 50 / 1 / 0.01%, c) keep / switch / doesn't matter. The arrow moves on to the pictures. Answers aren't stored.

## a. Two kids

Four equally likely families, written oldest first: BB, BG, GB, GG. The play button (Space) samples families and the bars grow. The two buttons at top are the clue you were told:

- **bracket over both children**: "at least one is a boy". GG is out; BB is 1 of the 3 left, so **1/3**.
- **boy over the left child**: "the older one is a boy". GG and GB are out; BB is 1 of the 2 left, so **1/2**.

The wording "One is a boy" is ambiguous, and the intended reading is the first. The second is what you get if you learned about a particular child (the one who opened the door, the older one). R clears.

## b. The test

Drag the two numbers: how rare the disease is (1 in 2 down to 1 in 1,000,000) and the test's accuracy (50% to 99.99%). The square is everyone who tests positive, 10,000 cells standing for all of them; red cells are the sick ones. The row under it is the crowd of 1,000,000 → the positives → the sick among them. Big number: the chance a positive result means you are sick.

At 1 in 1,000,000 and 99%: 10,001 positives, of whom 1 is sick, so about **0.0099%**. "99% accurate" is read as 99% of sick people test positive *and* 99% of healthy people test negative. A red cell is never drawn smaller than 1 in 10,000, so the square slightly overstates risks below 0.01%.

## c. Three doors

Click a door to pick it. The host opens one of the others; the unpicked closed door pulses. Click your door to stay or the pulsing one to switch; everything opens. Both strategies are tallied every round, whichever you chose: "stay" is the ringed dot, "switch" the two arrows. The two play buttons run 100 or 5,000 rounds. The trash can clears the tallies.

- **Eye**: the host knows where the check is and always shows a goat. Stay wins 1/3, switch wins 2/3.
- **Crossed-out eye**: the host opens one of the other two doors blindly. When he happens to show the check, the round is void (the red ✕ count) and not tallied. In the rounds that survive, stay and switch each win **1/2**.

The quiz wording ("The left door opens, revealing a goat") doesn't say whether the host knew. The switch answer assumes he did.

## Tests

```
node stats/tests/model.test.js
```
