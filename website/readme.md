# Your own website

Seven steps, no build step. Open `index.html`. Each step is a short looping video (a gif) next to the same clicks in words, numbered to match the numbers in the video.

Students type their GitHub username at the top. From then on every line says their own address (`ada.github.io`), and the links go to their own copy. They pick Windows or Mac (the page guesses), and the last four steps change to match. A **Stuck?** box under each step holds what goes wrong most often. **I did this** ticks the step off and moves on. The page remembers all of this in that browser only. ← → step through, and a link like `index.html#push` opens straight to one step.

## The steps

On GitHub:

1. **Make your own copy.** Fork [paleomitchelljs/notes](https://github.com/paleomitchelljs/notes) and name the fork `username.github.io` while forking.
2. **Turn on your web address.** Settings → Pages → Branch: `main`, `/ (root)` → Save.
3. **Watch it go live.** Actions tab: yellow circle, then green check. Then Visit site.

On your computer, with [GitHub Desktop](https://desktop.github.com) (free, same on Windows and Mac, no command line):

4. **Get GitHub Desktop.** Install, sign in, Finish.
5. **Put your site on this computer.** Clone it from *Your repositories*.
6. **Change one line.** Show in Explorer/Finder → open `index.html` in Notepad/TextEdit → change `<title>Margins</title>` to `<title>Notes by username</title>` → save. On a Mac this includes TextEdit's one-time "display HTML files as HTML code" setting, without which TextEdit shows the page and not the code.
7. **Commit and push.** Summary → Commit to main → Push origin → reload the site. The browser tab now has their name.

The change is the page title because it is one word on line 6, it can't break the app, and it shows up in the browser tab.

## Things to say in class

- The site name must be exactly `username.github.io`, all lowercase. Anything else gives `username.github.io/whatever-they-typed` or nothing.
- One account gets one `username.github.io`. If a student already used it for something else, they can fork under another name (say `notes`) and the site is at `username.github.io/notes/`. Steps 2–7 are the same.
- Notes typed into the app are kept in that browser's storage. They are not in the repository and don't follow the student to another computer.
- If the fork is renamed after Pages is on, give it two minutes.

## The videos

`gif/` holds 11 gifs: `fork`, `pages`, `live`, plus a `-win` and a `-mac` of `setup`, `clone`, `edit` and `push`. They are **re-enactments**, not screen recordings. `tools/scenes.html` redraws each screen (GitHub, GitHub Desktop, Explorer/Finder, Notepad/TextEdit) in plain HTML, and a fake cursor plays through it with captions and zooms. The username in them is `yourname`. The GitHub screens follow GitHub's current layout and wording, but they are drawings: fonts and icons differ a little, and GitHub moves things now and then.

To re-make them (Playwright and ffmpeg):

```
git clone https://github.com/paleomitchelljs/notes /tmp/notes
node website/tools/record.js /tmp/notes            # all
node website/tools/record.js /tmp/notes push edit  # some
```

The notes path is only used to photograph the app once into `tools/notes.png`. Pass `""` to reuse that photo. Open `tools/scenes.html?scene=edit&os=mac` in a browser to watch one scene play.

### Swapping in real recordings

Any gif can be replaced by a real screen recording with the same file name. The page doesn't care where a gif came from. ScreenToGif (Windows) and Kap (Mac) are free and both export gif. Keep each one under about 30 seconds, crop to the browser or app window, and use a throwaway account or blur the username. A recording should still follow the numbered lines for its step in `js/steps.js`. If it doesn't, edit those lines too; the test checks the line count against the captions in `scenes.html`, so update or drop that check if you stop using the scenes.

| gif | Record this |
|---|---|
| `fork` | The notes repo while signed in → Fork → clear the name → type `username.github.io` → Create fork → land on the new repo. |
| `pages` | Your fork → Settings → Pages → Branch None → main → Save. |
| `live` | Actions tab while *pages build and deployment* runs, until the green check → Settings → Pages → Visit site. |
| `setup-win`, `setup-mac` | Fresh GitHub Desktop → Sign in to GitHub.com → Authorize desktop in the browser → back to Desktop → Configure Git → Finish. |
| `clone-win`, `clone-mac` | *Let's get started* → pick the repo under *Your repositories* → Clone → Clone. |
| `edit-win`, `edit-mac` | Show in Explorer/Finder → right-click index.html → Open with Notepad/TextEdit (Mac: the Settings → Open and Save checkbox first) → change the title word → save. |
| `push-win`, `push-mac` | The diff → type a Summary → Commit to main → Push origin → reload the site and show the tab title. |

## Files

- `js/steps.js`: every word on the page (steps, Windows/Mac variants, Stuck? answers), and the username cleanup.
- `js/app.js`: the page.
- `tools/scenes.html`, `tools/record.js`, `tools/notes.png`: the videos' source.

## Tests

```
node website/tests/steps.test.js
```

Checks the username cleanup (pasted links, `@name`, a typed `.github.io`, capitals), that every step has its gif on disk for both systems, that no `{U}` is left unfilled, and that each step's numbered lines match the numbered captions in its video.
