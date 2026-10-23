# Why 28 of 42?

Four students took the same exam and got 28, 29, 29 and 27 of 42. The deck asks the class why, lets them propose and test claims, and ends on the pattern in the columns. Static files, no build step. Open `index.html`. Same stage and keys as `infernogallus/`.

Students show as **A–D**. The data file's own column names (`uniform01`, `clustered01`…) say which is which, so `tools/make_data.js` swaps them for letters and they never reach the page.

## Pages

| | page | builds |
|---|---|---|
| 1 | **Four students** | one column per question in exam order, green right, red wrong (red is also hatched). Then the scores. |
| 2 | **The model** | learning-dag.png. Drag across **Time**, then also **Study Methods**. |
| 3 | **Claims** | Four blank cards. Then four explanations to pick, nesting the questions into groups, with luck beside them. |
| 4 | **Chapters** | The reveal: chapter colors on the columns, regroup by chapter, percent right, deal at random (D), circle the weak chapter. |

## The model

learning-dag.png as arithmetic (`js/model.js`):

- effort `E(t) = (1 − e^−4t) / (1 − e^−4)`. At 75% it is already 97%.
- class and method are two gates into understanding; either carries effort: `g(m) = 1 − (1 − C)(1 − m)`, `C = 0.4`
- understanding `U = P + (1 − P) · E · g`, prior knowledge `P = 0.35`
- grade = `U`, as questions out of 42.

Interest, class and assessment are held fixed. The starting method value (`M0`, about 0.19) is whatever puts the model at the four students' mean, 28.25, with time at 75%. **These are my assumptions, not fits.** `K`, `P` and `C` are at the top of `model.js`; change them and the numbers on the page follow. As built: all the remaining time (75 → 100%) buys about one question; cutting a quarter loses about 1.3; the best method at 75% time is worth about 12. The knob at the right of the curve is method. It starts near the dumbbell.

## Claims

Build 0: four blank cards you can type into. Build 1: they become the explanations, and the 42 questions appear in exam order with luck at the right. Click cards (or keys 1–5) to pick any number. The questions regroup, in the order picked (the number on the card):

| explanation | property (`exam_question_traits.csv`) | effect |
|---|---|---|
| Ran out of time | position in the exam | splits into early / middle / late |
| Not smart | Bloom level | splits into remember / understand / apply / analyze |
| Didn't read carefully | critical words (not, always) | splits into plain / has one |
| Test too hard | reading level | splits into 7–8th / 9–10th / 11–12th grade |
| Skimmed | word count | sorts within each group, shortest first, with a length bar over each column; also halves each group short / long so there is a gap to measure |

Each group gets a percent-right bar per student (tick = the class). Luck: each student's results are shuffled 400 times into the same groups; the dots are the best-minus-worst-group gap of each shuffle, the gold bar is the real one. It rebuilds whenever the groups change. Dice buttons / D show one shuffle in the columns. More groups means chance alone produces bigger gaps, so the real bar sinks into the pile as you stack explanations; with tiny groups both saturate at 100.

`js/data.js` is built from both csv files by `tools/make_data.js`. Chapters are not shown on this page; page 4 reveals them.

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

On page 2 the small chapter icon above the Time box splits it into three bars, one per chapter. Drag across each. Overall time is their mean, and the grade is the model run chapter by chapter, so putting the same total time unevenly scores lower (ch 10 at 20% and the rest at 100% gives 27, not 29). The curve's dot then sits below the curve.

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
js/claims.js     the explanations and how they nest
js/app.js        the four pages
tests/model.test.js
```

```
node exam/tests/model.test.js
node exam/tools/make_data.js     # after changing the csv
```

`example_students.csv` stays in this folder. It is anonymous, but delete it before publishing if you would rather not ship it; the page only needs `js/data.js`.

## Not checked

Looked at in Chrome at one window size, pages 1–5, light theme only. Not looked at: chalkboard theme, a projector, touch. Dragging and typing were exercised through scripted clicks, not by hand.
