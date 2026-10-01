import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { numericInput, calculateTwa, calculateProtectionFactor } from '../../assets/js/exposure-calculations.mjs';

for (const invalid of ['', ' ', null, '1,2', '1e999', 'Infinity', 'NaN', '-1']) {
  assert.throws(() => numericInput(invalid, '値', true), undefined, `Must reject ${invalid}`);
}
assert.equal(numericInput('1,000.5', '値').value, 1000.5);
assert.equal(numericInput('0', '濃度', true).value, 0);
assert.throws(() => numericInput('0', '時間'));

const entries = [
  { concentration: '20', duration: '2', durationUnit: 'h' },
  { concentration: '5', duration: '180', durationUnit: 'min' },
  { concentration: '1', duration: '3', durationUnit: 'h' },
];
const completed = calculateTwa(entries, { coverageConfirmed: true, limit: '10' });
assert.equal(completed.totalHours, 8);
assert.equal(completed.dose, 58);
assert.equal(completed.eightHourTwa, 7.25);
assert.equal(completed.ratio, 0.725);
// Even a measured eight-hour total does not silently certify representativeness.
assert.equal(calculateTwa(entries).eightHourTwa, null);
assert.equal(calculateTwa(entries, { limit: '10' }).ratio, null);
const partial = calculateTwa([{ concentration: '10', duration: '4', durationUnit: 'h' }]);
assert.equal(partial.observedTwa, 10);
assert.equal(partial.eightHourTwa, null);
const zero = calculateTwa([{ concentration: '0', duration: '8', durationUnit: 'h' }], { coverageConfirmed: true, limit: '10' });
assert.equal(zero.eightHourTwa, 0);
assert.equal(zero.ratio, 0);
for (const entry of [
  { concentration: '', duration: '1', durationUnit: 'h' },
  { concentration: '1', duration: '', durationUnit: 'h' },
  { concentration: '1', duration: '0', durationUnit: 'h' },
  { concentration: '1', duration: '25', durationUnit: 'h' },
  { concentration: '1', duration: '1', durationUnit: 'day' },
]) assert.throws(() => calculateTwa([entry]));
assert.throws(() => calculateTwa([]));
assert.throws(() => calculateTwa(entries, { limit: '0' }));
assert.throws(() => calculateTwa(entries, { limit: 'invalid' }));

for (const type of ['lead', 'welding']) {
  const equal = calculateProtectionFactor({ type, concentration: '0.30', assignedFactor: '6' });
  assert.equal(equal.exactThreshold, '6');
  assert.equal(equal.comparison, 'equal');
  assert.equal(calculateProtectionFactor({ type, concentration: '0.30', assignedFactor: '5.999999999999999999' }).comparison, 'below');
  assert.equal(calculateProtectionFactor({ type, concentration: '0.30', assignedFactor: '6.000000000000000001' }).comparison, 'above');
  assert.equal(calculateProtectionFactor({ type, concentration: '3e-1', assignedFactor: '10' }).comparison, 'above');
  assert.throws(() => calculateProtectionFactor({ type, concentration: '' }));
}
const dust = calculateProtectionFactor({ type: 'dust', concentration: '0.6', silica: '10', assignedFactor: '2.58' });
assert.equal(dust.exactThreshold, '129 / 50');
assert.equal(dust.comparison, 'equal');
assert.equal(calculateProtectionFactor({ type: 'dust', concentration: '3', silica: '0' }).exactThreshold, '1');
for (const silica of ['', '-1', '100.01', 'invalid']) assert.throws(() => calculateProtectionFactor({ type: 'dust', concentration: '1', silica }));
for (const type of ['organic', 'specified']) {
  assert.equal(calculateProtectionFactor({ type, concentration: '2.5', baseline: '0.5', assignedFactor: '5' }).comparison, 'equal');
  assert.throws(() => calculateProtectionFactor({ type, concentration: '1', baseline: '' }));
  assert.throws(() => calculateProtectionFactor({ type, concentration: '1', baseline: '0' }));
}
assert.equal(calculateProtectionFactor({ type: 'mixed-organic', concentration: '2.4', assignedFactor: '2.4' }).comparison, 'equal');
assert.equal(calculateProtectionFactor({ type: 'welding', concentration: '0', assignedFactor: '1' }).comparison, 'above');
assert.throws(() => calculateProtectionFactor({ type: 'unknown', concentration: '1' }));
assert.throws(() => calculateProtectionFactor({ type: 'welding', concentration: '1', assignedFactor: '0' }));

const registry = JSON.parse(readFileSync(new URL('../../_data/substance_registry.json', import.meta.url), 'utf8'));
const cohort = registry.records.filter(record => record.effective_date === '2026-10-01');
assert.equal(cohort.length, 79);
assert.ok(cohort.every(record => record.status === 'current' && !record.application_date.includes('予定')));
assert.equal(registry.generated_at, '2026-08-21');
assert.equal(registry.status_checked_at, '2026-10-01');
console.log('Exposure calculations: missing data, units, TWA coverage, zero results, exact APF boundaries and 79 effective records passed.');
