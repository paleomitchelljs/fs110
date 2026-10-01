# FS110

Class tools for FS110. Each is a static page in its own folder: no build step, no install, and each opens straight from the file.

| Folder | What it is |
|---|---|
| [`bones/`](bones/) | Reasoning from Bones. A 75-minute class on one question, how do you know?, worked through dinosaur cases on a balance: two hypotheses, a prediction, evidence dealt a card at a time. |
| [`sauropod/`](sauropod/) | Sauropod neck posture. Drag a sauropod's head, heart and body and watch blood pressure, heart size and energy cost respond. |

`index.html` at the top is a landing page with a tile for each. Each folder has its own readme.

## Publishing

Push to `main`, then go to **Settings → Pages → Build and deployment**, choose **Deploy from a branch**, and pick `main` and `/ (root)`. A minute or so later the landing page is at `https://paleomitchelljs.github.io/fs110/`, with the tools at `/fs110/bones/` and `/fs110/sauropod/`. `.nojekyll` stays at the top so Pages serves the folders as they are.

The sauropod tool used to sit at the site root. Old links to it now land on the landing page, one click away.

## Tests

```
node sauropod/tests/model.test.js
node bones/tests/sim.test.js
JSDOM=/path/to/node_modules/jsdom node bones/tests/deck.smoke.js
```

The last needs jsdom, which isn't shipped here.
