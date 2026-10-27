/* Re-make the lesson's gifs from scenes.html.
 *
 *   node website/tools/record.js /path/to/notes            all scenes
 *   node website/tools/record.js /path/to/notes push edit  just these
 *
 * Needs Playwright (require('playwright')) and ffmpeg. The notes path is a clone of github.com/paleomitchelljs/notes:
 * the notes app is photographed once into tools/notes.png, which the "your site" frames show.
 * Each scene runs on a fake clock and is shot every FRAME ms, so the gifs come out the same every time.
 * gif/steps.json gets each gif's number of numbered captions, which the tests hold the written steps to.
 */
'use strict';
const path = require('path');
const fs = require('fs');
const os = require('os');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');

const FRAME = 80; // ms of scene time per gif frame (12.5 fps)
const TOOLS = __dirname;
const OUT = path.join(TOOLS, '..', 'gif');
// [scene, os]; os-specific scenes are recorded once per system
const ALL = [['fork'], ['pages'], ['live'], ['setup', 'win'], ['setup', 'mac'], ['clone', 'win'], ['clone', 'mac'],
  ['edit', 'win'], ['edit', 'mac'], ['push', 'win'], ['push', 'mac'],
  ['download', 'win'], ['download', 'mac'], ['newrepo'], ['upload', 'win'], ['upload', 'mac'], ['relink', 'win'], ['relink', 'mac']];

(async () => {
  const [notesDir, ...only] = process.argv.slice(2);
  const browser = await chromium.launch();
  if (notesDir) {
    const p = await browser.newPage({ viewport: { width: 1000, height: 547 } });
    await p.goto('file://' + path.resolve(notesDir, 'index.html'));
    await p.waitForTimeout(800);
    await p.screenshot({ path: path.join(TOOLS, 'notes.png') });
    await p.close();
  }
  fs.mkdirSync(OUT, { recursive: true });
  const manifest = path.join(OUT, 'steps.json');
  const steps = fs.existsSync(manifest) ? JSON.parse(fs.readFileSync(manifest, 'utf8')) : {};
  for (const [scene, sys] of ALL.filter(([s]) => !only.length || only.includes(s))) {
    const name = scene + (sys ? '-' + sys : '');
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'scene-'));
    const page = await browser.newPage({ viewport: { width: 1000, height: 625 } });
    await page.clock.install();
    await page.goto('file://' + path.join(TOOLS, 'scenes.html') + '?scene=' + scene + (sys ? '&os=' + sys : ''));
    let n = 0;
    for (;;) {
      await page.clock.runFor(FRAME);
      await page.screenshot({ path: path.join(dir, String(n++).padStart(5, '0') + '.png'), clip: { x: 0, y: 0, width: 1000, height: 625 } });
      const [done, err] = await page.evaluate(() => [window.__done, window.__error]);
      if (err) throw new Error(name + ': ' + err);
      if (done || n > 2000) break;
    }
    steps[name] = await page.evaluate(() => window.__steps || 0);
    await page.close();
    const gif = path.join(OUT, name + '.gif');
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(1000 / FRAME), '-i', path.join(dir, '%05d.png'),
      '-vf', 'split[a][b];[a]palettegen=max_colors=128:stats_mode=diff[p];[b][p]paletteuse=dither=none:diff_mode=rectangle', gif]);
    fs.rmSync(dir, { recursive: true });
    console.log(name, n, 'frames', Math.round(fs.statSync(gif).size / 1024) + ' KB');
  }
  fs.writeFileSync(manifest, JSON.stringify(Object.fromEntries(Object.entries(steps).sort()), null, 1) + '\n');
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
