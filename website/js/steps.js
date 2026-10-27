/* The seven steps: what each gif shows, in words, and what to do when it goes wrong. No DOM, so the tests can load it.
 * Run the checks with:  node website/tests/steps.test.js
 *
 * Text markup: **bold**, `code`, [words](url). {U} is the student's username, {SITE} their web address (username.github.io).
 * A line can be { win: '…', mac: '…' } when Windows and Mac differ. A step's gif is gif/<gif>.gif, or gif/<gif>-win.gif and
 * gif/<gif>-mac.gif when perOS is set. The numbers on the lines match the numbers in the gif's captions. */
(function (root) {
  'use strict';
  const NOTES = 'https://github.com/paleomitchelljs/notes';

  const STEPS = [
    {
      id: 'fork', part: 'On GitHub', title: 'Make your own copy', gif: 'fork',
      word: '**Fork** means: make your own copy of someone else’s project, on GitHub.',
      pre: [`Open [my notes page](${NOTES}). If you see **Sign in** at the top right, sign in first.`],
      lines: [
        'Click **Fork**, near the top right.',
        'Click the **Repository name** box and delete **notes**.',
        'Type **{SITE}** exactly: your username, then **.github.io**, all lowercase.',
        'Scroll down and click the green **Create fork** button.',
      ],
      stuck: [
        ['It says the name is already taken', 'You already have a project with that name. Go to [your projects](https://github.com/{U}?tab=repositories) and open **{SITE}**. If it is your copy of the notes, skip to the next step.'],
        ['There is no Fork button, or it says you already forked it', 'You already made a copy, maybe with the name **notes**. Open it from [your projects](https://github.com/{U}?tab=repositories), click **Settings**, change **Repository name** to **{SITE}**, and click **Rename**.'],
        ['I’m not sure what my username is', 'Click your picture at the top right of GitHub. The name in bold is your username.'],
      ],
    },
    {
      id: 'pages', part: 'On GitHub', title: 'Turn on your web address', gif: 'pages',
      word: '**GitHub Pages** is GitHub’s free website hosting. Every account gets one address: **{SITE}**.',
      lines: [
        'On your copy ([github.com/{U}/{SITE}](https://github.com/{U}/{SITE})), click **Settings**, the last tab, with a gear.',
        'In the list on the left, click **Pages**.',
        'Under **Branch**, click **None**…',
        '…and pick **main**.',
        'Leave **/ (root)** as it is and click **Save**.',
      ],
      stuck: [
        ['There is no Settings tab', 'You are on my page, not your copy. The name at the top left should start with **{U}**. Go to [your copy](https://github.com/{U}/{SITE}).'],
        ['I can’t see the list on the left', 'Make the browser window wider, or scroll down: on a narrow window the list moves to the top.'],
        ['It already says “Your site is live”', 'GitHub turned it on for you. Go on to the next step.'],
      ],
    },
    {
      id: 'live', part: 'On GitHub', title: 'Watch it go live', gif: 'live',
      word: '**Deploy** means: put the files where the world can see them. GitHub does this for you each time your project changes.',
      lines: [
        'Click the **Actions** tab.',
        'A **yellow circle** means it is still building. Wait one or two minutes.',
        'A **green check** means your site is up.',
        'Go back to **Settings → Pages** and click **Visit site**, or just go to [{SITE}](https://{SITE}). Bookmark it.',
      ],
      after: 'Notes you type on your site are kept in **this browser on this computer** only. They are not saved to GitHub, and they won’t be on your phone.',
      stuck: [
        ['The page says 404', 'It isn’t finished yet. Wait two more minutes and reload the page.'],
        ['Actions has a red ✗', 'Click the red line, then **Re-run all jobs** at the top right.'],
        ['Actions says workflows aren’t being run on this fork', 'Click the green **I understand my workflows, go ahead and enable them** button. Then go back to **Settings → Pages** and click **Save** again.'],
        ['The address doesn’t work', 'Check the project’s name. It must be exactly **{SITE}**. If not, rename it in **Settings** (the box at the top), then wait two minutes.'],
      ],
    },
    {
      id: 'setup', part: 'On your computer', title: 'Get GitHub Desktop', gif: 'setup', perOS: true,
      word: '**GitHub Desktop** is a free app that moves your project between your computer and GitHub. No typing commands.',
      pre: [
        'Go to [desktop.github.com](https://desktop.github.com) and click the big **Download** button.',
        {
          win: 'Open your **Downloads** folder and double-click **GitHubDesktopSetup**. It installs itself and opens. There is nothing to choose.',
          mac: 'Open your **Downloads** folder and double-click the **GitHub Desktop** zip. Drag **GitHub Desktop** into **Applications**, then open it from there. If your Mac asks whether you are sure, click **Open**.',
        },
      ],
      lines: [
        'Click **Sign in to GitHub.com**.',
        'Your web browser opens. Sign in if it asks, then click **Authorize desktop**.',
        { win: 'If the browser asks, click **Open GitHub Desktop**.', mac: 'If the browser asks, click **Open GitHub Desktop** (or **Allow**).' },
        'Back in GitHub Desktop you see **Configure Git**. Leave it as it is and click **Finish**.',
      ],
      stuck: [
        ['Nothing happened after I clicked Authorize', { win: 'Click GitHub Desktop at the bottom of the screen to go back to it yourself. It should say you are signed in.', mac: 'Click GitHub Desktop in the Dock to go back to it yourself. It should say you are signed in.' }],
        ['It is asking me to sign in again', 'That is fine. Sign in with the same GitHub account you used for the fork.'],
      ],
    },
    {
      id: 'clone', part: 'On your computer', title: 'Put your site on this computer', gif: 'clone', perOS: true,
      word: '**Clone** means: download a copy of your project that stays linked to GitHub.',
      lines: [
        'Under **Your repositories** on the right, click **{U}/{SITE}**.',
        'Click the blue **Clone** button at the bottom.',
        'Leave the **Local path** as it is and click **Clone**.',
      ],
      stuck: [
        ['My project isn’t in the list', 'Click the ⟳ next to **Filter your repositories**. Still missing? Use **File → Clone repository…** and pick it there.'],
        ['I don’t see “Let’s get started”', 'You already have a project open. Use **File → Clone repository…**, click **{U}/{SITE}**, then **Clone**.'],
      ],
    },
    {
      id: 'edit', part: 'On your computer', title: 'Change one line', gif: 'edit', perOS: true,
      word: 'Your website is just files in a folder. **index.html** is the page people see first.',
      lines: {
        win: [
          'In GitHub Desktop, click **Show in Explorer**.',
          'Right-click **index.html**.',
          'Point at **Open with**, then click **Notepad**.',
          'Find the line `<title>Margins</title>` (line 6). Double-click **Margins** to select it.',
          'Type **Notes by {U}**.',
          'Save: press **Ctrl + S**. Then close Notepad.',
        ],
        mac: [
          'In GitHub Desktop, click **Show in Finder**.',
          'Right-click **index.html** (or hold **Control** and click).',
          'Point at **Open With**, then click **TextEdit**.',
          'First time only: if you see words instead of code, click **TextEdit** at the top of the screen, then **Settings…**',
          'Click **Open and Save**.',
          'Tick **Display HTML files as HTML code instead of formatted text**, and close that box.',
          'Close the TextEdit window and open **index.html** with TextEdit again.',
          'Find the line `<title>Margins</title>` (line 6). Double-click **Margins** to select it.',
          'Type **Notes by {U}**.',
          'Save: press **⌘ Command + S**. Then close TextEdit.',
        ],
      },
      stuck: [
        ['I changed something by accident', 'Close the file without saving. If you already saved, go to GitHub Desktop, right-click **index.html** on the left, choose **Discard changes…**, and start again.'],
        { win: ['Notepad isn’t in the list', 'Click **Choose another app**, then **Notepad**. If you still can’t find it, type **Notepad** into the search box on the taskbar.'],
          mac: ['TextEdit asks about the file type when I save', 'Choose **Use .html**. Never let it add **.txt** or save as rich text.'] },
        ['Which part do I change?', 'Only the word **Margins** between `<title>` and `</title>`. Keep the `<` `>` and `/` exactly as they are.'],
      ],
    },
    {
      id: 'push', part: 'On your computer', title: 'Commit and push', gif: 'push', perOS: true,
      word: '**Commit** saves a snapshot of your change on your computer. **Push** sends your snapshots to GitHub, and GitHub puts them on your website.',
      lines: [
        'Bottom left in GitHub Desktop: click the **Summary** box and say what you changed, like **Put my name on the tab**.',
        'Click **Commit to main**.',
        'Click **Push origin** (top right, or the blue button).',
        'Wait a minute, then go to [{SITE}](https://{SITE}) and reload. The tab at the top of your browser now says **Notes by {U}**.',
      ],
      after: 'That is the whole loop, every time: **change a file → save → Commit → Push → wait a minute → reload.**',
      stuck: [
        ['The Commit button is grey', 'Type something in the **Summary** box first.'],
        ['I don’t see Push origin', 'If it says **Fetch origin**, you have already pushed. If it still lists a changed file on the left, you haven’t committed yet.'],
        ['My site didn’t change', { win: 'Wait one more minute, then hold **Ctrl** and press **F5** to reload without the old copy. You can watch the **Actions** tab on GitHub to see it build.', mac: 'Wait one more minute, then press **⌘ Command + Shift + R** to reload without the old copy. You can watch the **Actions** tab on GitHub to see it build.' }],
        ['It asks me to sign in, or says “authentication failed”', { win: 'In GitHub Desktop open **File → Options → Accounts**, sign out, sign back in, then push again.', mac: 'In GitHub Desktop open **GitHub Desktop → Settings → Accounts** at the top of the screen, sign out, sign back in, then push again.' }],
      ],
    },
  ];

  /* What the student typed into the username box, made into a GitHub username: drops a leading @, a pasted github.com link, a typed .github.io. */
  function cleanUser(raw) {
    let s = String(raw || '').trim().toLowerCase();
    s = s.replace(/^https?:\/\//, '').replace(/^(www\.)?github\.com\//, '').replace(/^@/, '');
    s = s.split(/[/?#\s]/)[0].replace(/\.github\.io$/, '');
    return /^[a-z0-9](?:[a-z0-9]|-(?=[a-z0-9])){0,38}$/.test(s) ? s : '';
  }
  const siteFor = user => (user || 'yourname') + '.github.io';

  /* pick the OS's version of a line (or a whole list, or a stuck pair), then fill in the names */
  const pick = (x, os) => x && typeof x === 'object' && !Array.isArray(x) && 'win' in x ? x[os] : x;
  function fill(text, user) {
    const u = user || 'yourname';
    return text.replace(/\{U\}/g, u).replace(/\{SITE\}/g, siteFor(u));
  }
  const gifFor = (step, os) => 'gif/' + step.gif + (step.perOS ? '-' + os : '') + '.gif';

  const api = { STEPS, NOTES, cleanUser, siteFor, pick, fill, gifFor };
  if (typeof module === 'object' && module.exports) module.exports = api; else root.WebsiteSteps = api;
})(this);
