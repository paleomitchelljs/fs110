# Dissecting a paper

A 50-minute lecture deck on one paper: Funston et al. 2026, "Fruit-eating adaptations in a Late Cretaceous oviraptorosaur", *Nature Communications* (in press, doi 10.1038/s41467-026-78343-w). The dinosaur is the example. The skill is pulling testable claims out of a paper and asking, for each one, what the evidence is, what else could produce it, what would tell them apart, and how sure to be.

Static files, no build step, same stage and controls as `bones/`. Open `index.html`.

## The paper

The PDF lives in this folder as `infernogallus.pdf` and is gitignored. The figure panels the deck shows are cut from it (`img/`, fair use for teaching) and are committed. To remake them:

```
python3 infernogallus/tools/crop_figs.py
```

Needs `pdfimages` (poppler) and Pillow.

## Running it

Same keys as `bones/`: → or space for the next build, ← back, `[` `]` between claims, `X` for the extra claims, `T` for chalkboard, `C` for a clock, `B` for a blank screen.

Every claim page runs in one order, so the room learns it once:

1. the claim, with a picture
2. evidence, one row per press
3. alternatives, one row per press
4. the test that would tell them apart
5. **How sure?** Press 1–5 (or tap a bin) once per hand. Shift takes a vote back. The dark marker is the room's call. It sits at the mean of the votes. Drag it to say what the room settled on after arguing, double-click to let it follow the votes again.
6. the authors' own words, hedges highlighted

The top-right strip on each claim is **distance from the bone**: Bone, Measure, Model, Analogy, Beyond. It is my judgment of how many inferential steps sit between the fossil and the claim, and it is open to argument. "Where would you put it?" is a fair question to ask the room.

Rows with a small **+** at the right are mine. The paper doesn't raise them. Everything else on the page is something the authors say, show or do.

## Plan

| min | segment | what happens |
|---|---|---|
| 0–1 | Title | The paper's title is a claim. Ask what it claims. |
| 1–3 | Where claims live | A paper drawn as blocks. Claims, evidence, assumptions, alternatives, fine print, next tests. |
| 3–5.5 | How sure are the authors? | Six verbatim phrases from the abstract, one per press. Students drag each onto a line from unsure to sure. Verbs are marked: *describe, reveals, enabled, attests, likely, remains unclear*. |
| 5.5–7.5 | How do you know? | The five questions, same as `bones/`. |
| 7.5–9 | 1 New species | Short. Falls out of the specimen and the diagnosis. |
| 9–11.5 | 2 Twelve kg | Femur circumference, then the equation, then the 12 kg dot inside its 9–15 band. |
| 11.5–14.5 | 3 Age 6–7 | Histology. The femur and fibula disagree by one mark. |
| 14.5–17.5 | 4 Oviraptor | Which "oviraptor"? Three pills outline three nested groups. |
| 17.5–21 | 5 Jaw muscles | Fig. 2e, f, then the muscle plot. |
| 21–26 | 6 Fore–aft jaw | Drag the jaw. 15 mm is the paper's number. The comparison has none. |
| 26–32 | 7 Fruit specialist | A ladder of four nested claims, a certainty marker on each rung. |
| 32–36.5 | 8 All caenagnathids | Fig. 4. |
| 36.5–40 | 9 Hidden diversity | Two ways a discovery curve could go on. |
| 40–45 | Sort the claims | Every claim a chip on one line, guess to solid. Then the dots, then the authors' words. |

That is 45 minutes, so about five spare for discussion. Extra claims (`X`) add 2–3 minutes each.

## The ladder (claim 7)

"Specialized in fruit eating" is four claims stacked: chewed soft food, soft plants, fruit in the diet, fruit specialist. Each is narrower than the one below, so none can be surer than the one under it. The markers enforce that: set a lower rung low and every rung above comes down with it. Evidence thins as you climb. The top rung has no evidence rows at all, only alternatives. Worth saying out loud: the paper's own sentence is "could have been specialised", and it follows with "other soft plant materials also formed a significant component".

## Claim 4 and the word "oviraptor"

The paper says oviraptorosaur, and a caenagnathid. Not an oviraptorid, and not *Oviraptor*. The nested picture lets the room pick a meaning and see whether Infernogallus falls inside it. The claim as worded in the outline is true at one level and false at two.

## Extra claims (X)

| after | claim | why |
|---|---|---|
| 1 | All five specimens are one species | The muscle attachments are read from the pterygoids of ROM VP 88690 and the jaw of ROM VP 64193, which are not the holotype. The jaws are assigned to the holotype by matching size and preservation ("we interpret"). The holotype was commercially excavated and bought. CT checks it isn't a composite. |
| 4 | The digital skull matches the living animal | The skull is crushed. Temporal arches and jaw were restored in Blender using other caenagnathid and oviraptorosaur skulls as templates. The tiny cheek window is part of claim 5. |
| 9 | A specialized diet helps explain the extinction | The last paragraph of the discussion. It stacks on claims 7 and 8, and it is one extinction. |

The outline says ten claims and lists nine. If a tenth was meant, it may be one of these.

## Things to check before class

I read the text and the figures. I have not read the supplement, so anything the paper puts in Supplementary Notes (Note 8 is flagged by the authors as a caveat on fruit) is not on the slides beyond the pointer.

- "12+ unique traits" counts the autapomorphies in the Diagnosis paragraph. Splitting or merging the pterygoid features changes the count. Check against your own reading.
- "Only 4 other oviraptorosaurs compared" (claim 5) is read off Fig. 3c and the Methods list: *Incisivosaurus*, *Citipati*, *Conchoraptor*, *Khaan*.
- Fig. 3c plots PC1 (95.2%) against PC2 (4.8%). Infernogallus differs from *Citipati* on both. The slides don't say which carries the difference. If you want a read-the-axes moment, it is there.
- "Three tree-building methods" is parsimony, Bayesian, and a tip-dated relaxed clock. The paper trimmed the clock analysis to 29 of the 42 taxa. Whether the methods agree on Infernogallus is in the supplement.
- The authors' hedge words on the last slide (`WORDS` in `content.js`) are each a verbatim phrase, but choosing one phrase per claim is my call. Some claims carry several.
- Quotes keep the paper's British spelling. Everything else is American.
- Dates in the paper: received 12 January 2026, accepted 22 September 2026, "Article in press". It may change before final publication.

## Not yet checked in a browser

The logic is tested (`tests/deck.smoke.js`, 18 checks in jsdom: every build of every segment, votes, ladder clamping, rank layout). Layout is not. I had no browser in the session that could open local files, so row wrapping, figure sizes and the chalkboard theme have not been looked at. Click through once at 1600 × 900 and again on the projector. The likeliest problems are a row that wraps to two lines and pushes the quote strip, and chip overlap on the last slide when many claims get the same call.

```
JSDOM=/path/to/node_modules/jsdom node infernogallus/tests/deck.smoke.js
```

## Files

```
index.html
css/deck.css         tokens and stage from bones/, plus this deck's parts
js/content.js        every word on screen; edit here
js/deck.js           segments, builds, keys (from bones/, minor changes)
js/parts/util.js     text format, drag, certainty state
js/parts/intro.js    cover, map of a paper, sort the authors' words, five questions
js/parts/claim.js    the claim page and its gauge
js/parts/viz.js      femur bars, nested groups, jaw slider, discovery curves
js/parts/ladder.js   claim 7
js/parts/rank.js     the last sort
img/                 figure panels, cropped from the paper
tools/crop_figs.py   remakes img/
tests/deck.smoke.js
```

Text format in `content.js`: `_Name_` italic, `*word*` accent, `==word==` marked as a hedge. An ellipsis in a quote means cut text.

Votes and positions live in sessionStorage. A reload mid-class keeps them, a new tab starts clean, and the circular arrow (click twice) clears everything.
