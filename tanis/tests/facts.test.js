/* Checks the fact list and that cards.tex was built from it.
 *   node tanis/tests/facts.test.js */
'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { facts, byN } = require('../js/facts.js');
const { build } = require('../tools/make_cards.js');

const nums = facts.map((f) => f.n).sort((a, b) => a - b);
assert.deepStrictEqual(nums, facts.map((_, i) => i + 1), 'card numbers are 1..N with none missing or doubled');
assert.strictEqual(new Set(facts.map((f) => f.id)).size, facts.length, 'ids are unique');
facts.forEach((f) => {
  assert.ok(!('title' in f), `fact ${f.n}: no title`);
  assert.ok(f.text && f.text.length > 30, `fact ${f.n}: text present`);
  assert.strictEqual(byN[f.n], f);
});
assert.ok(facts.some((f, i) => f.n !== i + 1), 'numbers are not just the file order');

const tex = fs.readFileSync(path.join(__dirname, '..', 'cards.tex'), 'utf8');
assert.strictEqual(tex, build(), 'cards.tex is out of date: run node tanis/tools/make_cards.js');
assert.strictEqual((tex.match(/\\factcard\{\d+\}/g) || []).length, facts.length, 'one card per fact on the sheet');
console.log(`ok: ${facts.length} facts, cards.tex in sync`);
