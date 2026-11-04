/* The steps and the three paths through them, one for each way a student got the notes (forked, downloaded the ZIP, cloned).
 * Kept short on purpose: the gifs carry the explaining; the page carries a one-word title, an Open link, and one bullet per
 * numbered caption in the gif. No DOM, so the tests can load it.  Run the checks with:  node website/tests/steps.test.js
 *
 * Text markup: **bold**, *italic*, [words](url), [[text]] for text with a Copy button. {U} is the student's username, {SITE}
 * their web address. A line can be { win: '…', mac: '…' }. A step's gif is gif/<gif>.gif, or gif/<gif>-win.gif and
 * gif/<gif>-mac.gif when perOS is set. pre: unnumbered bullets before the numbered ones. link: [button word, url].
 * help: [problem, fix] pairs. */
(function (root) {
  'use strict';
  const NOTES = 'https://github.com/paleomitchelljs/notes';
  const REPO = 'https://github.com/{U}/{SITE}';
  const MINE = 'https://github.com/{U}?tab=repositories';

  const STEPS = [
    {
      id: 'download', title: 'Download', gif: 'download', perOS: true, link: ['Notes', NOTES],
      lines: {
        win: ['Click **Code**', 'Click **Download ZIP**', 'Right-click the ZIP → **Extract All…**', 'Click **Extract**', 'Open the inner **notes-main**'],
        mac: ['Click **Code**', 'Click **Download ZIP**', 'Double-click the ZIP', 'Open **notes-main**'],
      },
      help: [
        { win: ['Files still zipped', 'Use **Extract All…** first'], mac: ['Already unzipped', 'Safari does that. Open **notes-main**'] },
      ],
    },
    {
      id: 'newrepo', title: 'New', gif: 'newrepo', link: ['GitHub', 'https://github.com/new'],
      lines: ['**+** → **New repository**', 'Name it [[{SITE}]]', '**Public**, README **off**', 'Click **Create repository**'],
      help: [
        ['Name taken', `Use the empty one in [your projects](${MINE})`],
        ['README is on', 'ZIP: fine. Clone: delete it, make it again'],
      ],
    },
    {
      id: 'upload', title: 'Upload', gif: 'upload', perOS: true, link: ['Project', REPO],
      lines: ['Click **uploading an existing file**', { win: 'In notes-main: **Ctrl + A**', mac: 'In notes-main: **⌘ + A**' }, 'Drag onto the box', 'Click **Commit changes**'],
      help: [
        ['No upload link', '**Add file → Upload files**'],
        ['Site is blank', 'Upload what is *inside* notes-main'],
      ],
    },
    {
      id: 'fork', title: 'Fork', gif: 'fork', link: ['Notes', NOTES],
      lines: ['Click **Fork**', 'Delete **notes**', 'Type [[{SITE}]]', 'Click **Create fork**'],
      help: [
        ['Already forked', 'Your copy: **Settings** → rename to **{SITE}**'],
        ['Name taken', `Open it in [your projects](${MINE})`],
      ],
    },
    {
      id: 'setup', title: 'Desktop', gif: 'setup', perOS: true, link: ['Download', 'https://desktop.github.com'],
      pre: [{ win: 'Install: run **GitHubDesktopSetup**', mac: 'Install: unzip, drag to **Applications**' }, 'Have it already? **Next**'],
      lines: ['Click **Sign in to GitHub.com**', 'Click **Authorize desktop**', 'Click **Open GitHub Desktop**', 'Click **Finish**'],
      help: [['Nothing happened', 'Switch back to GitHub Desktop']],
    },
    {
      id: 'relink', title: 'Connect', gif: 'relink', perOS: true,
      pre: ['Open **notes** in GitHub Desktop'],
      lines: [
        { win: '**Repository → Repository settings…**', mac: '**Repository → Repository Settings…**' },
        'Clear the box',
        'Paste [[' + REPO + '.git]]',
        'Click **Save**',
        'Click **Fetch origin**',
        'Click **Publish branch**',
      ],
      help: [
        ['Not in GitHub Desktop', '**File → Add local repository…**'],
        ['Says Push origin', 'Click it. Same thing'],
        ['Rejected', 'Has a README: delete it, make it again'],
      ],
    },
    {
      id: 'pages', title: 'Pages', gif: 'pages', link: ['Settings', REPO + '/settings/pages'],
      lines: ['Click **Settings**', 'Click **Pages**', 'Click **None**', 'Pick **main**', 'Click **Save**'],
      help: [
        ['No Settings tab', `Wrong project: open [yours](${REPO})`],
        ['Already live', '**Next**'],
      ],
    },
    {
      id: 'live', title: 'Live', gif: 'live', link: ['Site', 'https://{SITE}'],
      lines: ['Click **Actions**', 'Yellow: wait', 'Green: done', 'Click **Visit site**'],
      help: [
        ['404', 'Wait 2 minutes, reload'],
        ['Red ✗', 'Click it → **Re-run all jobs**'],
        ['Notes vanished', 'Notes stay in one browser'],
      ],
    },
    {
      id: 'clone', title: 'Clone', gif: 'clone', perOS: true,
      lines: ['Click **{SITE}**', 'Click **Clone**', 'Click **Clone**'],
      help: [['Not listed', '**File → Clone repository…**']],
    },
    {
      id: 'edit', title: 'Edit', gif: 'edit', perOS: true,
      lines: {
        win: ['Click **Show in Explorer**', 'Right-click **index.html**', '**Open with → Notepad**', 'Double-click **Margins**', 'Type **Notes by {U}**', 'Press **Ctrl + S**'],
        mac: ['Click **Show in Finder**', 'Right-click **index.html**', '**Open With → TextEdit**', '**TextEdit → Settings…**', 'Click **Open and Save**',
          'Tick **Display HTML…as HTML code**', 'Close, reopen **index.html**', 'Double-click **Margins**', 'Type **Notes by {U}**', 'Press **⌘ + S**'],
      },
      help: [
        ['Changed too much', 'Right-click the file → **Discard changes…**'],
        { win: ['No Notepad', '**Choose another app** → Notepad'], mac: ['Save asks about type', '**Use .html**'] },
      ],
    },
    {
      id: 'push', title: 'Push', gif: 'push', perOS: true, link: ['Site', 'https://{SITE}'],
      lines: ['Type a **Summary**', 'Click **Commit to main**', 'Click **Push origin**', 'Reload your site'],
      help: [
        ['Commit is grey', 'Type a Summary first'],
        ['No change', { win: 'Wait a minute, **Ctrl + F5**', mac: 'Wait a minute, **⌘ + Shift + R**' }],
      ],
    },
  ];

  /* How the student got the notes decides where they start; the last steps are the same for everyone.
   * groups only decide where the step buttons break. */
  const PATHS = [
    { id: 'fork', label: 'Fork', groups: [['fork'], ['pages', 'live'], ['setup', 'clone', 'edit', 'push']] },
    { id: 'zip', label: 'ZIP', groups: [['download', 'newrepo', 'upload'], ['pages', 'live'], ['setup', 'clone', 'edit', 'push']] },
    { id: 'cloned', label: 'Clone', groups: [['newrepo', 'setup', 'relink'], ['pages', 'live'], ['edit', 'push']] },
  ];
  const stepsOf = path => path.groups.flat().map(id => STEPS.find(s => s.id === id));

  /* What the student typed into the username box, made into a GitHub username: drops a leading @, a pasted github.com link, a typed .github.io. */
  function cleanUser(raw) {
    let s = String(raw || '').trim().toLowerCase();
    s = s.replace(/^https?:\/\//, '').replace(/^(www\.)?github\.com\//, '').replace(/^@/, '');
    s = s.split(/[/?#\s]/)[0].replace(/\.github\.io$/, '');
    return /^[a-z0-9](?:[a-z0-9]|-(?=[a-z0-9])){0,38}$/.test(s) ? s : '';
  }
  const siteFor = user => (user || 'yourname') + '.github.io';

  /* pick the OS's version of a line (or a whole list, or a help pair), then fill in the names */
  const pick = (x, os) => x && typeof x === 'object' && !Array.isArray(x) && 'win' in x ? x[os] : x;
  function fill(text, user) {
    const u = user || 'yourname';
    return text.replace(/\{U\}/g, u).replace(/\{SITE\}/g, siteFor(u));
  }
  const gifFor = (step, os) => 'gif/' + step.gif + (step.perOS ? '-' + os : '') + '.gif';

  const api = { STEPS, PATHS, NOTES, stepsOf, cleanUser, siteFor, pick, fill, gifFor };
  if (typeof module === 'object' && module.exports) module.exports = api; else root.WebsiteSteps = api;
})(this);
