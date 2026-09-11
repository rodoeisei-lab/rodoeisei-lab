const assert = require('node:assert/strict');
const { calculate } = require('../../assets/js/twa-core.js');
const entry = (concentration, hours) => ({ concentration, hours });
const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-10, `${actual} != ${expected}`);
const example = calculate([entry(20, 2), entry(5, 3), entry(1, 3)], 8, 10);
near(example.eightHour, 7.25);
near(example.ratio, 72.5);
const unknown = calculate([entry(10, 4)], 8, 10);
assert.equal(unknown.eightHour, null);
assert.equal(unknown.ratio, null);
assert.equal(unknown.missingHours, 4);
assert.equal(unknown.observed, 10);
const explicitZero = calculate([entry(10, 4), entry(0, 4)], 8, 10);
assert.equal(explicitZero.eightHour, 5);
assert.equal(explicitZero.ratio, 50);
assert.equal(calculate([entry(0, 8)], 8, 10).ratio, 0);
assert.equal(calculate([entry(10, 8)]).ratio, null);
assert.equal(calculate([entry(10, 10)], 10, 10).eightHour, 12.5);
assert.equal(calculate([entry(10, 8)], 10, 10).eightHour, null);
near(calculate([entry(10, 1 / 60), entry(5, 479 / 60)]).eightHour, (10 / 60 + 5 * 479 / 60) / 8);
for (const args of [
  [[], 8], [[entry(-1, 8)], 8], [[entry(1, 0)], 8],
  [[entry(1, 9)], 8], [[entry(1, 8)], 7], [[entry(1, 25)], 25],
  [[entry(Infinity, 8)], 8], [[entry(Number.MAX_VALUE, 8)], 8],
  [[entry(1, 8)], 8, 0], [[entry(1, 8)], 8, -1],
  [[entry(1, 8)], 8, Number.MIN_VALUE],
]) assert.throws(() => calculate(...args));
console.log('TWA: complete / unknown / explicit zero / minutes / long shift / invalid values passed');
