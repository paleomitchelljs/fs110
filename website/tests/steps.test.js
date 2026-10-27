/* Run with:  node website/tests/steps.test.js   (no dependencies) */
'use strict';
const fs = require('fs');
const path = require('path');
const D = require('../js/steps.js');

let failed = 0;
function check(name, ok, detail) {
  if (!ok) failed++;
  console.log((ok ? 'ok  ' : 'FAIL') + '  ' + name + (ok ? '' : ': ' + detail));
}
const ROOT = path.join(__dirname, '..');

// usernames as students will type them
const users = [['Ada-Lovelace', 'ada-lovelace'], ['  @ada ', 'ada'], ['https://github.com/ada99', 'ada99'], ['github.com/ada/notes', 'ada'],
  ['ada.github.io', 'ada'], ['ada lovelace', 'ada'], ['-ada', ''], ['ada--l', ''], ['a_b', ''], ['', ''], ['x'.repeat(40), '']];
users.forEach(([raw, want]) => check('cleanUser ' + JSON.stringify(raw), D.cleanUser(raw) === want, D.cleanUser(raw)));
check('site for a user', D.siteFor('ada') === 'ada.github.io', D.siteFor('ada'));
check('site with no user', D.siteFor('') === 'yourname.github.io', D.siteFor(''));

// every step, on both systems: a gif on disk, every line filled in, every {win, mac} has both
['win', 'mac'].forEach(os => D.STEPS.forEach(s => {
  const gif = D.gifFor(s, os);
  check(os + ' ' + s.id + ' gif exists', fs.existsSync(path.join(ROOT, gif)), gif);
  const texts = [s.word, s.after || '', ...(s.pre || []).map(x => D.pick(x, os)), ...D.pick(s.lines, os).map(x => D.pick(x, os))];
  s.stuck.forEach(x => { const [q, a] = D.pick(x, os); texts.push(q, D.pick(a, os)); });
  texts.forEach(t => {
    check(os + ' ' + s.id + ' line is text', typeof t === 'string', JSON.stringify(t));
    const f = D.fill(String(t), 'ada');
    check(os + ' ' + s.id + ' no {…} left', !/\{[A-Z]+\}/.test(f), f);
    check(os + ' ' + s.id + ' bold and code are paired', (f.match(/\*\*/g) || []).length % 2 === 0 && (f.match(/`/g) || []).length % 2 === 0, f);
  });
}));

// the numbered lines match the numbered captions in the gif (scenes.html calls cap(n, …))
const scenes = fs.readFileSync(path.join(ROOT, 'tools', 'scenes.html'), 'utf8');
function captionCount(scene, os) {
  const start = scenes.indexOf('SCENES.' + scene + ' = async');
  const end = scenes.indexOf('\nSCENES.', start + 1);
  let body = scenes.slice(start, end < 0 ? undefined : end);
  if (scene === 'edit') body = scenes.slice(scenes.indexOf('async function openWith'), start) + body;
  // on Windows the edit scene skips its Mac-only block (the TextEdit setting)
  if (os === 'win') body = body.replace(/if \(OS === 'mac'\) \{[\s\S]*?editorWin\('index\.html', false\)/, '');
  let top = 0;
  // cap(3, …) counts as 3; cap(OS === 'mac' ? 8 : 4, …) as 8 on a Mac and 4 on Windows
  for (const m of body.matchAll(/cap\((?:OS === 'mac' \? (\d+) : (\d+)|(\d+)),/g)) top = Math.max(top, +(m[3] || (os === 'mac' ? m[1] : m[2])));
  return top;
}
['win', 'mac'].forEach(os => D.STEPS.forEach(s => {
  const n = D.pick(s.lines, os).length;
  const c = captionCount(s.gif, os);
  check(os + ' ' + s.id + ' ' + n + ' lines, ' + c + ' numbered captions', n === c, n + ' vs ' + c);
}));

console.log(failed ? failed + ' failed' : 'all passed');
process.exit(failed ? 1 : 0);
