/* Checks the fact list and that cards.tex was built from it.
 *   node nanotyrannus/tests/facts.test.js */
'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { facts, byN, waves } = require('../js/facts.js');
const { build } = require('../tools/make_cards.js');

const nums = facts.map((f) => f.n).sort((a, b) => a - b);
assert.deepStrictEqual(nums, facts.map((_, i) => i + 1), 'card numbers are 1..N with none missing or doubled');
assert.strictEqual(new Set(facts.map((f) => f.id)).size, facts.length, 'ids are unique');
facts.forEach((f) => {
  assert.ok(!('title' in f), `fact ${f.n}: no title`);
  assert.ok(f.text && f.text.length > 30, `fact ${f.n}: text present`);
  assert.strictEqual(byN[f.n], f);
});
assert.ok(facts.every((f, i) => f.n === i + 1), 'numbers follow the file (date) order');
waves.forEach((w, i) => assert.strictEqual(w.w, i + 1, 'waves are numbered 1..N'));
facts.forEach((f) => {
  assert.ok(f.date && /\d{4}$/.test(f.date), `fact ${f.n}: date ends in a year`);
  assert.ok(f.wave >= 1 && f.wave <= waves.length, `fact ${f.n}: wave exists`);
  assert.ok(['specimen', 'species'].includes(f.kind), `fact ${f.n}: kind is specimen or species`);
  assert.ok(f.text.split(/\s+/).length <= 40, `fact ${f.n}: keep it short`);
  assert.ok(!/\b(argue|argues|propose|proposes|conclude|concludes|name[sd]?)\b/i.test(f.text), `fact ${f.n}: observation, not argument`);
});
// the file runs in date order, and waves never go backwards
const yr = (f) => +f.date.slice(-4);
facts.forEach((f, i) => { if (i) { assert.ok(yr(f) >= yr(facts[i - 1]), `fact ${f.n}: out of date order`); assert.ok(f.wave >= facts[i - 1].wave, `fact ${f.n}: wave goes backwards`); } });
waves.forEach((w) => assert.ok(facts.some((f) => f.wave === w.w), `wave ${w.w} has cards`));

const tex = fs.readFileSync(path.join(__dirname, '..', 'cards.tex'), 'utf8');
assert.strictEqual(tex, build(), 'cards.tex is out of date: run node nanotyrannus/tools/make_cards.js');
assert.strictEqual((tex.match(/\\factcard\{\d+\}/g) || []).length, facts.length, 'one card per fact on the sheet');
console.log(`ok: ${facts.length} facts, cards.tex in sync`);
