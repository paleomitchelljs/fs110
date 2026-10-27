# Your own website

Short videos, step by step, no build step. Open `index.html`. Each step is a short looping video (a gif) next to the same clicks in words, numbered to match the numbers in the video.

Students first say whether they have the notes yet: **Not yet** (fork it), **I downloaded the ZIP**, or **I cloned it**. That picks their path. Then they type their GitHub username, and from then on every line says their own address (`ada.github.io`), and the links go to their own copy. They pick Windows or Mac (the page guesses), and the steps on their own computer change to match. A **Stuck?** box under each step holds what goes wrong most often. **I did this** ticks the step off and moves on. The page remembers all of this in that browser only. ← → step through. A link like `index.html#zip/upload` opens one step of one path, so you can send each group its own link.

## The three paths

All three end the same way: the site is live at `username.github.io`, and the student has changed a file on their own computer and pushed it.

| | Not yet: fork it | I downloaded the ZIP | I cloned it |
|---|---|---|---|
| Get your copy | **Make your own copy**: fork, naming the fork `username.github.io` | **Download the files**: Code → Download ZIP, unzip<br>**Make an empty project**: + → New repository, `username.github.io`, Public, no README<br>**Drag the files in**: *uploading an existing file*, drag in what's inside `notes-main`, Commit changes | **Make an empty project** (as on the left)<br>**Get GitHub Desktop** (most already have it: tick and go on)<br>**Send your clone to your account**: Repository settings → Remote → paste `https://github.com/username/username.github.io.git` → Save → Fetch origin → Publish branch |
| Put it online | **Turn on your web address**: Settings → Pages → Branch `main`, `/ (root)` → Save<br>**Watch it go live**: Actions tab, yellow circle then green check, then Visit site | same | same |
| Change it from your computer | **Get GitHub Desktop**<br>**Put your site on this computer**: clone it from *Your repositories*<br>**Change one line**<br>**Commit and push** | same | **Change one line**<br>**Commit and push**<br>(their clone is already on the computer) |

**Change one line**: Show in Explorer/Finder → open `index.html` in Notepad/TextEdit → change `<title>Margins</title>` to `<title>Notes by username</title>` → save. On a Mac this includes TextEdit's one-time "display HTML files as HTML code" setting, without which TextEdit shows the page and not the code. **Commit and push**: Summary → Commit to main → Push origin → reload the site. The browser tab now has their name.

The change is the page title because it is one word on line 6, it can't break the app, and it shows up in the browser tab.

[GitHub Desktop](https://desktop.github.com) is free, the same on Windows and Mac, and needs no command line.

## Things to say in class

- The site name must be exactly `username.github.io`, all lowercase. Anything else gives `username.github.io/whatever-they-typed` or nothing.
- One account gets one `username.github.io`. If a student already used it for something else, they can fork under another name (say `notes`) and the site is at `username.github.io/notes/`. Steps 2–7 are the same.
- Notes typed into the app are kept in that browser's storage. They are not in the repository and don't follow the student to another computer.
- If the fork is renamed after Pages is on, give it two minutes.
- ZIP path: the usual mistake is dragging the `notes-main` folder itself instead of what's inside it. Then the files sit in `notes-main/` on GitHub and the site is blank. On Windows, Extract All makes `notes-main` inside `notes-main`, so students have to open two folders deep, to the one with `index.html`.
- Clone path: the new project has to be empty (no README), or Publish branch is rejected. The step after changing the remote should show **Publish branch**. If a student's GitHub Desktop shows **Push origin** instead, that works the same.

## The videos

`gif/` holds 18 gifs: `fork`, `newrepo`, `pages`, `live`, plus a `-win` and a `-mac` of `download`, `upload`, `relink`, `setup`, `clone`, `edit` and `push`. They are **re-enactments**, not screen recordings. `tools/scenes.html` redraws each screen (GitHub, GitHub Desktop, Explorer/Finder, Notepad/TextEdit) in plain HTML, and a fake cursor plays through it with captions and zooms. The username in them is `yourname`. The GitHub screens follow GitHub's current layout and wording, but they are drawings: fonts and icons differ a little, and GitHub moves things now and then.

To re-make them (Playwright and ffmpeg):

```
git clone https://github.com/paleomitchelljs/notes /tmp/notes
node website/tools/record.js /tmp/notes            # all
node website/tools/record.js /tmp/notes push edit  # some
```

Recording also writes `gif/steps.json`, the number of numbered captions in each gif, which the test holds the written steps to.

The notes path is only used to photograph the app once into `tools/notes.png`. Pass `""` to reuse that photo. Open `tools/scenes.html?scene=edit&os=mac` in a browser to watch one scene play.

### Swapping in real recordings

Any gif can be replaced by a real screen recording with the same file name. The page doesn't care where a gif came from. ScreenToGif (Windows) and Kap (Mac) are free and both export gif. Keep each one under about 30 seconds, crop to the browser or app window, and use a throwaway account or blur the username. A recording should still follow the numbered lines for its step in `js/steps.js`. If it doesn't, edit those lines too, and set that gif's count in `gif/steps.json` to the number of lines.

| gif | Record this |
|---|---|
| `fork` | The notes repo while signed in → Fork → clear the name → type `username.github.io` → Create fork → land on the new repo. |
| `download-win`, `download-mac` | The notes repo → Code → Download ZIP → Downloads → unzip (Windows: Extract All, then into the inner `notes-main`) → the folder with `index.html`. |
| `newrepo` | + → New repository → name `username.github.io`, Public, README off → Create repository → the empty repo's Quick setup. |
| `upload-win`, `upload-mac` | Browser and `notes-main` side by side → *uploading an existing file* → select all in the folder → drag onto the box → Commit changes. |
| `relink-win`, `relink-mac` | GitHub Desktop on the cloned `notes` → Repository → Repository settings → Remote → paste the new address → Save → Fetch origin → Publish branch. |
| `pages` | Your fork → Settings → Pages → Branch None → main → Save. |
| `live` | Actions tab while *pages build and deployment* runs, until the green check → Settings → Pages → Visit site. |
| `setup-win`, `setup-mac` | Fresh GitHub Desktop → Sign in to GitHub.com → Authorize desktop in the browser → back to Desktop → Configure Git → Finish. |
| `clone-win`, `clone-mac` | *Let's get started* → pick the repo under *Your repositories* → Clone → Clone. |
| `edit-win`, `edit-mac` | Show in Explorer/Finder → right-click index.html → Open with Notepad/TextEdit (Mac: the Settings → Open and Save checkbox first) → change the title word → save. |
| `push-win`, `push-mac` | The diff → type a Summary → Commit to main → Push origin → reload the site and show the tab title. |

## Files

- `js/steps.js`: every word on the page (steps, Windows/Mac variants, Stuck? answers), the three paths through the steps, and the username cleanup.
- `js/app.js`: the page.
- `tools/scenes.html`, `tools/record.js`, `tools/notes.png`: the videos' source.

## Tests

```
node website/tests/steps.test.js
```

Checks the username cleanup (pasted links, `@name`, a typed `.github.io`, capitals), that every step has its gif on disk for both systems, that no `{U}` is left unfilled, that each step's numbered lines match the numbered captions in its video, and that every path uses real steps and ends with a push.
