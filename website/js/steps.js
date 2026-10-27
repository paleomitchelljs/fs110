/* The steps: what each gif shows, in words, and what to do when it goes wrong; and the three paths through them,
 * one for each way a student got the notes (forked, downloaded the ZIP, cloned). No DOM, so the tests can load it.
 * Run the checks with:  node website/tests/steps.test.js
 *
 * Text markup: **bold**, `code`, [words](url), [[text]] for text with a Copy button.
 * {U} is the student's username, {SITE} their web address (username.github.io).
 * A line can be { win: '…', mac: '…' } when Windows and Mac differ. A step's gif is gif/<gif>.gif, or gif/<gif>-win.gif and
 * gif/<gif>-mac.gif when perOS is set. The numbers on the lines match the numbers in the gif's captions. */
(function (root) {
  'use strict';
  const NOTES = 'https://github.com/paleomitchelljs/notes';

  const STEPS = [
    {
      id: 'download', title: 'Download the files', gif: 'download', perOS: true,
      word: 'A **ZIP** is a bundle of files squeezed into one, for downloading. You unzip it to get the files back.',
      pre: [`Open [my notes page](${NOTES}).`],
      lines: {
        win: [
          'Click the green **Code** button.',
          'Click **Download ZIP**.',
          'Open your **Downloads** folder. Right-click **notes-main.zip**, then click **Extract All…**',
          'Click **Extract**.',
          'A **notes-main** folder opens. Double-click the **notes-main** folder inside it, so you see **index.html**.',
        ],
        mac: [
          'Click the green **Code** button.',
          'Click **Download ZIP**.',
          'Open **Downloads** in Finder and double-click **notes-main.zip**.',
          'Double-click the new **notes-main** folder, so you see **index.html**.',
        ],
      },
      after: 'Keep this folder open. You need it two steps from now.',
      stuck: [
        { win: ['I double-clicked the ZIP and I can see the files', 'That is only a peek inside the ZIP. Go back, right-click **notes-main.zip**, and use **Extract All…**. Files dragged out of a ZIP often don’t upload.'],
          mac: ['There is already a notes-main folder', 'Safari often unzips downloads by itself. Skip to double-clicking the **notes-main** folder.'] },
        ['I can’t find Downloads', { win: 'Open **File Explorer** (the folder at the bottom of the screen). **Downloads** is in the list on the left.', mac: 'Click **Finder** (the smiling face in the Dock). **Downloads** is in the list on the left.' }],
      ],
    },
    {
      id: 'newrepo', title: 'Make an empty project', gif: 'newrepo',
      word: 'A **repository** (or **repo**) is a project: a folder of files that GitHub keeps for you. This one starts empty, named with your web address.',
      lines: [
        'At the top right of GitHub, click **+**, then **New repository**.',
        'Click **Repository name** and type [[{SITE}]]: your username, then **.github.io**, all lowercase.',
        'Leave it **Public**. Leave **Add README** off, so the project starts empty.',
        'Click **Create repository**.',
      ],
      stuck: [
        ['It says the name is already taken', 'You already have a project with that name. Open it from [your projects](https://github.com/{U}?tab=repositories). If it shows **Quick setup**, it is empty: use it. If not, open its **Settings**, rename it to anything else, and try again.'],
        ['I turned on Add README by accident', 'If you downloaded the ZIP, it doesn’t matter. If you cloned the notes, delete this project (**Settings**, scroll to the bottom, **Delete this repository**) and make it again with **Add README** off.'],
        ['I made it Private', 'A free account can only put a Public project on the web. Open **Settings**, scroll to the bottom, and use **Change visibility**.'],
      ],
    },
    {
      id: 'upload', title: 'Drag the files in', gif: 'upload', perOS: true,
      word: '**Uploading** copies files from your computer to GitHub, like attaching files to an email.',
      pre: ['Put your browser and the **notes-main** folder (the one with **index.html** in it) side by side.'],
      lines: [
        'On your empty project, click **uploading an existing file**.',
        { win: 'Click inside the **notes-main** folder and press **Ctrl + A** to select everything.', mac: 'Click inside the **notes-main** folder and press **⌘ Command + A** to select everything.' },
        'Drag them onto the box in your browser, and let go.',
        'Check the list has **index.html** and files starting **css/** and **js/**. Then scroll down and click **Commit changes**.',
      ],
      stuck: [
        ['I don’t see “uploading an existing file”', 'Your project isn’t empty (maybe it has a README). Click **Add file → Upload files** near the top instead.'],
        ['Only index.html went up', 'The **css** and **js** folders didn’t come along. Drag those two folders onto the box, then **Commit changes** again.'],
        ['I dragged the notes-main folder itself', 'Then your files are inside a **notes-main** folder on GitHub, where the website won’t look. Upload again, this time what is *inside* **notes-main**. The extra folder does no harm.'],
        ['My browser opened the file instead', 'You let go outside the dashed box. Go back and drop right on the box.'],
      ],
    },
    {
      id: 'relink', title: 'Send your clone to your account', gif: 'relink', perOS: true,
      word: 'Your clone still points at **my** project, which you can’t change. You’ll point it at your new empty project instead, then send it there.',
      pre: [
        'Open **GitHub Desktop** and pick **notes** under **Current repository** at the top left.',
        'Not there, because you cloned it another way? Use **File → Add local repository…**, click **Choose…**, pick your **notes** folder, and click **Add repository**.',
      ],
      lines: [
        { win: 'Click **Repository** in the menu at the top, then **Repository settings…**', mac: 'In the menu bar at the top of the screen, click **Repository**, then **Repository Settings…**' },
        { win: 'Click the box under **Primary remote repository (origin)**, press **Ctrl + A**, and press **Delete**.', mac: 'Click the box under **Primary remote repository (origin)**, press **⌘ Command + A**, and press **Delete**.' },
        'Paste in your project’s address: [[https://github.com/{U}/{SITE}.git]]',
        'Click **Save**.',
        'Click **Fetch origin** at the top. It turns into **Publish branch**.',
        'Click **Publish branch**.',
      ],
      after: 'The folder on your computer is still called **notes**. That’s fine: GitHub Desktop now sends it to **{SITE}**.',
      stuck: [
        ['It says Push origin, not Publish branch', 'Click it. It does the same thing.'],
        ['It says the push was rejected, or to fetch first', 'Your new project isn’t empty (it has a README). On GitHub, open it, click **Settings**, scroll to the bottom, click **Delete this repository**, and make it again with **Add README** off. Then click **Publish branch** again.'],
        ['I typed the address myself and it fails', 'Use the **Copy** button above and paste it, or check it letter by letter: it ends in **.git**.'],
      ],
    },
    {
      id: 'fork', title: 'Make your own copy', gif: 'fork',
      word: '**Fork** means: make your own copy of someone else’s project, on GitHub.',
      pre: [`Open [my notes page](${NOTES}). If you see **Sign in** at the top right, sign in first.`],
      lines: [
        'Click **Fork**, near the top right.',
        'Click the **Repository name** box and delete **notes**.',
        'Type [[{SITE}]] exactly: your username, then **.github.io**, all lowercase.',
        'Scroll down and click the green **Create fork** button.',
      ],
      stuck: [
        ['It says the name is already taken', 'You already have a project with that name. Go to [your projects](https://github.com/{U}?tab=repositories) and open **{SITE}**. If it is your copy of the notes, skip to the next step.'],
        ['There is no Fork button, or it says you already forked it', 'You already made a copy, maybe with the name **notes**. Open it from [your projects](https://github.com/{U}?tab=repositories), click **Settings**, change **Repository name** to **{SITE}**, and click **Rename**.'],
        ['I’m not sure what my username is', 'Click your picture at the top right of GitHub. The name in bold is your username.'],
      ],
    },
    {
      id: 'pages', title: 'Turn on your web address', gif: 'pages',
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
      id: 'live', title: 'Watch it go live', gif: 'live',
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
      id: 'setup', title: 'Get GitHub Desktop', gif: 'setup', perOS: true,
      word: '**GitHub Desktop** is a free app that moves your project between your computer and GitHub. No typing commands.',
      pre: [
        'Already have GitHub Desktop, and signed in? Click **I did this** and go on.',
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
      id: 'clone', title: 'Put your site on this computer', gif: 'clone', perOS: true,
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
      id: 'edit', title: 'Change one line', gif: 'edit', perOS: true,
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
      id: 'push', title: 'Commit and push', gif: 'push', perOS: true,
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

  /* How the student got the notes decides where they start; the last steps are the same for everyone. */
  const PATHS = [
    { id: 'fork', label: 'Not yet', sub: 'Fork it on GitHub (easiest)',
      groups: [['Get your copy', ['fork']], ['Put it online', ['pages', 'live']], ['Change it from your computer', ['setup', 'clone', 'edit', 'push']]] },
    { id: 'zip', label: 'I downloaded the ZIP', sub: 'Upload it to a new project',
      groups: [['Get your copy', ['download', 'newrepo', 'upload']], ['Put it online', ['pages', 'live']], ['Change it from your computer', ['setup', 'clone', 'edit', 'push']]] },
    { id: 'cloned', label: 'I cloned it', sub: 'Send it to a new project',
      groups: [['Get your copy', ['newrepo', 'setup', 'relink']], ['Put it online', ['pages', 'live']], ['Change it from your computer', ['edit', 'push']]] },
  ];
  const stepsOf = path => path.groups.flatMap(([, ids]) => ids.map(id => STEPS.find(s => s.id === id)));

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

  const api = { STEPS, PATHS, NOTES, stepsOf, cleanUser, siteFor, pick, fill, gifFor };
  if (typeof module === 'object' && module.exports) module.exports = api; else root.WebsiteSteps = api;
})(this);
