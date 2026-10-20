/* Run with:  node cv/tests/data.test.js   (no dependencies) */
'use strict';
const D = require('../js/data.js');

let failed = 0;
function check(name, ok, detail) {
  if (!ok) failed++;
  console.log((ok ? 'ok  ' : 'FAIL') + '  ' + name + (ok ? '' : ': ' + detail));
}
const sec = id => D.SECTIONS.find(s => s.id === id);

// counts the resume lines quote
check('19 journal articles', sec('pubs').rows.filter(r => r[0].role === 'when' && /^\d{4}$/.test(r[0].text) && r.some(c => c.role === 'where' && !/review/.test(r.find(x => x.role === 'what').text))).length === 19, 'count');
check('13 courses', sec('teach').rows.length === 13, sec('teach').rows.length);
const reviewers = sec('service').rows.find(r => r[0].text === 'Peer Review')[1].text;
check('13 journals reviewed for', reviewers.replace(' and ', ', ').split(/,\s*/).filter(Boolean).length === 13, reviewers.split(/,\s*/).length);
const utah = sec('field').rows.find(r => r[1].text === 'Utah')[0].text;
check('five Utah seasons', utah.split(',').length === 5, utah);
const chinle = sec('field').rows.find(r => /Chinle/.test(r[2].text))[0].text;
check('three Chinle seasons', chinle.split(',').length === 3, chinle);

// every cell has a role the section can name; rows have the same roles in the same place only when they should
D.SECTIONS.forEach(s => s.rows.forEach((r, i) => r.forEach(c => {
  if (c.text !== '') check(s.id + ' row ' + i + ' ' + c.role + ' is named', !!s.legend[c.role], 'no legend for ' + c.role);
})));

// the resume
const ids = Object.keys(D.ENTRIES);
const rsecs = D.RSECS.map(s => s.id);
ids.forEach(id => check('entry ' + id + ' has a section', rsecs.indexOf(D.ENTRIES[id].sec) >= 0, D.ENTRIES[id].sec));
Object.keys(D.PRESETS).forEach(k => {
  const p = D.PRESETS[k];
  check(k + ': order lists every section once', p.order.slice().sort().join() === rsecs.slice().sort().join(), p.order.join());
  Object.keys(p.on).forEach(sid => p.on[sid].forEach(id => {
    check(k + ': ' + id + ' exists and sits in ' + sid, !!D.ENTRIES[id] && D.ENTRIES[id].sec === sid, id);
  }));
  const all = [].concat(...Object.values(p.on));
  check(k + ': no line twice', new Set(all).size === all.length, 'duplicate');
  check(k + ': exactly one profile', (p.on.profile || []).length === 1, (p.on.profile || []).length);
});
ids.forEach(id => {
  const t = D.ENTRIES[id].t; let m; D.SWAP.lastIndex = 0;
  while ((m = D.SWAP.exec(t))) check(id + ': swap has 2+ words', m[1].split('|').length >= 2, m[1]);
  check(id + ': braces balance', (t.match(/\{/g) || []).length === (t.match(/\}/g) || []).length, t);
});

console.log(failed ? failed + ' failed' : 'all passed');
process.exit(failed ? 1 : 0);
