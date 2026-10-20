# CV and resume

Three pages, no build step. Open `index.html`. Keys **1–3** switch pages.

## 1. The CV

Your CV (`cv_6.tex`) as a stack of ten bands, in the CV's own order. A closed band shows one grey bar per line, so the height of a band is how much of the CV it is. Publications is most of the page. That is the first thing to say out loud: what does this person spend their time on, and who is it written for?

Click a band, or use ← →, to open it. One band is open at a time. The blocks button (P) colors the pieces of every line. Click any line to take it apart on page 2.

## 2. Parts of a line

One line, then its pieces as cards, colored by role: year (purple), authors (teal), title (gold), journal or institution (orange), numbers and DOI (green). Click a card or a piece to light that role and dim the rest. The icons pick a section; ← → step through its lines. Each section names the roles its own way (a grant has an amount, a field season has a rock unit).

In publications the author's own name is bold. Ask why.

## 3. The resume

A letter-size page, the same lines as the CV, cut and reworded. The grey bar on top is how full the page is. Past one page the bar goes red, the page turns red below the dashed line, and the text spills off it.

- **Move.** Drag a section by the dots in the far margin, or a line by the dots beside it (↑ ↓ when a handle has focus). The order is the emphasis.
- **Cut.** Drag a line off the page (or click ×, or Delete). It goes back to the CV column on the left.
- **Add.** Click a line in the CV column, or drag it onto the page.
- **Aim.** The three icons (teaching, research, outreach) lay out the same lines three ways, each with its own profile line. Each fits on one page.
- **Reword.** Dotted words cycle when you click them. The pencil (E) makes every line editable; ⌘B and ⌘I bold and italicize. Reset (R) puts the aim back.
- **Eye (H).** Tints the page from the top down. It is a rule of thumb, not data: the top third gets read first, so that is where the aim goes.

Nothing is saved. Reloading starts over.

## What changed between the CV and the resume

- The CV's Education band holds jobs and degrees. The resume splits it into Experience and Education.
- Teaching is 13 rows on the CV and 4 lines on the resume. Grouping is a choice.
- A citation loses its author list and volume. What is left is the title and the journal.
- Numbers are counted from the CV, not rounded up: 13 courses, 19 journal articles, 13 journals reviewed for, five Utah field seasons, three Chinle seasons. `tests/data.test.js` checks each against the CV rows.
- Nothing on the resume is absent from the CV. The profile lines are the only new sentences.

## `resume.tex`

A one-page resume in the CV's style, aimed at a teaching job (the same lines as the first icon). Compile with XeLaTeX: `xelatex resume.tex`. The phone number from the CV footer is left off; add it to the header if you want it.

## Data

`js/data.js` holds the CV rows and the resume lines. It is copied from `cv_6.tex` by hand, so a new CV means editing that file. Three spellings are fixed in the copy (Naturwissenschaften, Pochobradsky, Pritzker); `cv_6.tex` is untouched.

## Tests

```
node cv/tests/data.test.js
```
