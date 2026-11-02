# Dice

Each student rolls a die, types the rolls in, and tests whether it is clearly different from a fair die. Static files, no build step. Open `index.html`.

## The page

- **Left:** one column of ten cells. Type a roll (1–6) in each. Enter or ↓ moves down a cell, ↑ moves up. Anything that isn't a whole number from 1 to 6 turns red and is left out of the tests; blank cells are ignored.
- **+ below** adds five rows. **+ to the right** adds a second column (a second die). It goes away once there are two.
- **Right:** two boxes. ▶ runs the test. Editing any cell clears the results, so they always match what's on the left.
  - **t-test.** One-sample, two-sided, against the fair mean 3.5. Shows n, mean, t, p-value.
  - **χ².** Goodness of fit to 1/6 per face, df = 5. Shows n, χ², p-value.
- With two columns, each box shows each die tested on its own against a fair die, side by side in the column's color. The two dice are not compared with each other.

Nothing is saved. Reloading starts over.

## Things worth raising

- With ten rolls, the χ² expected count is 10/6 per face, well under the usual rule of thumb of 5. Add rows (30+) and watch the p-value settle. The page doesn't warn about it.
- A die can pass the t-test and fail the χ² (lots of 1s and 6s, few 3s and 4s: mean near 3.5, faces uneven). Worth having someone try it on purpose.
- If a student's rolls are all the same number, the t-test shows `—`: the standard deviation is zero, so t is undefined.

## Changing the die

`SIDES` at the top of `js/model.js` (6). The fair mean and the χ² df follow from it.

## Tests

```
node dice/tests/model.test.js
```

The p-value functions are checked against numerical integration of the t and χ² densities, and two example sets of rolls against hand-computed statistics. In R the same numbers come from `t.test(x, mu = 3.5)` and `chisq.test(table(factor(x, levels = 1:6)))`.
