# Why 28 of 42?

Four students took the same exam and got 28, 29, 29 and 27 of 42. The deck asks the class why, lets them propose and test claims, and ends on the pattern in the columns. Static files, no build step. Open `index.html`. Same stage and keys as `infernogallus/`.

Students show as **A–D**. The data file's own column names (`uniform01`, `clustered01`…) say which is which, so `tools/make_data.js` swaps them for letters and they never reach the page.

## Pages

| | page | builds |
|---|---|---|
| 1 | **Four students** | one column per question in exam order, green right, red wrong (red is also hatched). Then the scores. |
| 2 | **The model** | learning-dag.png. Drag across **Time**, then also **Study Methods**. Last build: the same model as a curve. |
| 3 | **Claims** | Cards you type into. Then what each claim predicts. Then the bench of tests. |
| 4 | **Chapters** | The reveal: chapter colors on the columns, regroup by chapter, percent right, deal at random (D), circle the weak chapter. |
| 5 | **Where the time went** | One study-time tank per chapter. Drag one down. |

## The model

learning-dag.png as arithmetic (`js/model.js`):

- effort `E(t) = (1 − e^−4t) / (1 − e^−4)`. At 75% it is already 97%.
- class and method are two gates into understanding; either carries effort: `g(m) = 1 − (1 − C)(1 − m)`, `C = 0.4`
- understanding `U = P + (1 − P) · E · g`, prior knowledge `P = 0.35`
- grade = `U`, as questions out of 42.

Interest, class and assessment are held fixed. The starting method value (`M0`, about 0.19) is whatever puts the model at the four students' mean, 28.25, with time at 75%. **These are my assumptions, not fits.** `K`, `P` and `C` are at the top of `model.js`; change them and the numbers on the page follow. As built: all the remaining time (75 → 100%) buys about one question; cutting a quarter loses about 1.3; the best method at 75% time is worth about 12. The knob at the right of the curve is method. It starts near the dumbbell.

## Claims

Click a card, type. Enter finishes. The first four are mine and editable. Words in a card attach a test (`TESTS` in `js/claims.js`); the most hits wins and a tie goes to the one listed first. The test's icon lights in the toolbar. Click another icon to attach a different one by hand, click it again to clear. The marks at the card's foot: holds up, unclear, out (struck through).

| trigger words (examples) | test | what the bench shows |
|---|---|---|
| late, end, tired, ran out, anxiety, rush | late in the exam | exam order in thirds, percent right per third |
| chapter, early, first, middle, last, review, notes, forgot, skipped, recent | a chapter | grouped by chapter, percent right, chapter colors |
| hard, difficult, tough, trick, unfair, confusing | hard questions | hardest first, the class row, percent right in each half |
| luck, random, guess, chance, careless, misread | luck | results dealt at random into the chapter slots, with dot plots |
| method, technique, re-read, flashcards, cram, wrong way, marathon | wrong method | the curve |
| time, enough, effort, lazy, didn't study | not enough time | the curve |
| interest, bored, motivation, attend, sleep, job, family, health, phone | not in these columns | a dashed "?" . Nothing here can test it. |

The strip on each card is what the claim says the columns should look like (7 wrong of 21, the students' own share). Time, method and luck all predict the same scatter, so these columns cannot tell them apart. That is the point to make before the bench opens. Only the dice separate "scatter" from "pattern".

**Dice** (D, shift D for 100): each student's right and wrong answers are dealt into the same slots at random. Same score, only chance left. Each deal adds one dot to that student's plot, measuring the gap between their best and worst chapter. The gold bar is the real gap. The page shows no p-value; the picture is illustrative, not a significance test.

## What the data shows

42 questions, chapters 10, 11 and 12 with 10, 23 and 9 questions.

| | ch 10 | ch 11 | ch 12 |
|---|---|---|---|
| A | 6/10 | 16/23 | 6/9 |
| B | 3/10 | 19/23 | 7/9 |
| C | 7/10 | 18/23 | 4/9 |
| D | 8/10 | 11/23 | 8/9 |

A is even across chapters. B, C and D each dip in a different one. (Shuffling their results gives a gap this large rarely for B, sometimes for C and D; the deck treats this as illustration, not proof.)

- **A's misses lean toward the hard questions.** So do most students', since hard questions are hard for everyone. The class tick on each bar is there for this.
- **Question order is not chapter order.** Q36–42 are chapter 11 and Q47–50 are chapter 10, so B's chapter-10 misses fall at both ends of the exam, which rules out "ran out of time". Page 4 opens with chapter colors on the exam-order columns.
- The circles on the last build mark a best–worst chapter gap of 30 points or more (`RING_GAP` in `rows.js`): B, C and D.
- Questions 5, 8–10, 28, 29, 34 and 45 are missing from the file (42 of 50).

## Time per chapter

On page 2 the small chapter icon above the Time box splits it into three bars, one per chapter. Drag across each. Overall time is their mean, and the grade is the model run chapter by chapter, so putting the same total time unevenly scores lower (ch 10 at 20% and the rest at 100% gives 27, not 29). The curve's dot then sits below the curve. Page 5 is the same three numbers as tanks.

## Where the time went

Three tanks at 75%, each with the model's score for its chapter beside it, and the questions-weighted total. The curve is flat past about 60%, so pushing a tank to 100% gains nothing, and emptying one costs its whole chapter. That is the quantitative form of "the three weeks were not studied evenly". It does not fit any student; the model has no way to say which chapter they skipped.

## Keys

→ space next · ← back · `[` `]` page · D deal · T theme · B blank · C clock · ? keys. Cards and the model persist in sessionStorage through a reload. The circular arrow (click twice) clears them.

## Files

```
index.html
css/exam.css
js/data.js       generated by tools/make_data.js from example_students.csv
js/model.js      the model and the shuffle statistics (node-testable)
js/deck.js       stage, builds, keys
js/icons.js      js/rows.js (columns, groups, dice)  js/dag.js (diagram, curve)
js/claims.js     cards, trigger words, toolbar     js/alloc.js    chapter tanks
js/app.js        the five pages
tests/model.test.js
```

```
node exam/tests/model.test.js
node exam/tools/make_data.js     # after changing the csv
```

`example_students.csv` stays in this folder. It is anonymous, but delete it before publishing if you would rather not ship it; the page only needs `js/data.js`.

## Not checked

Looked at in Chrome at one window size, pages 1–5, light theme only. Not looked at: chalkboard theme, a projector, touch. Dragging and typing were exercised through scripted clicks, not by hand.
