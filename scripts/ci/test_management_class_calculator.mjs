import assert from "node:assert/strict";

import {
  calculateEvaluationValues,
  calculateManagementClass,
  determineManagementClass,
} from "../../assets/js/management-class-calculator.mjs";

function assertClose(actual, expected, tolerance = 0.001) {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `Expected ${actual} to be within ${tolerance} of ${expected}`,
  );
}

const secondClassExample = calculateManagementClass({
  aMeasurements: [9, 11, 12, 13, 15],
  managementConcentration: 20,
});

assert.equal(secondClassExample.level, 2);
assertClose(secondClassExample.evaluationValues.firstEvaluationValue, 37.053, 0.01);
assertClose(secondClassExample.evaluationValues.secondEvaluationValue, 15.051, 0.01);

const firstClassExample = calculateManagementClass({
  aMeasurements: [1, 1, 1, 1, 1],
  managementConcentration: 10,
});
assert.equal(firstClassExample.level, 1);

const bSecondClassExample = calculateManagementClass({
  aMeasurements: [1, 1, 1, 1, 1],
  bMeasurements: [10, 15],
  managementConcentration: 10,
});
assert.equal(bSecondClassExample.level, 2);
assert.equal(bSecondClassExample.bResult.level, 2);

const bThirdClassExample = calculateManagementClass({
  aMeasurements: [1, 1, 1, 1, 1],
  bMeasurements: [15.000001],
  managementConcentration: 10,
});
assert.equal(bThirdClassExample.level, 3);
assert.equal(bThirdClassExample.bResult.level, 3);

const boundaryExample = determineManagementClass({
  firstEvaluationValue: 20,
  secondEvaluationValue: 20,
  managementConcentration: 20,
});
assert.equal(boundaryExample.level, 2);

const thirdClassAResult = determineManagementClass({
  firstEvaluationValue: 25,
  secondEvaluationValue: 20.000001,
  managementConcentration: 20,
});
assert.equal(thirdClassAResult.level, 3);

assert.throws(
  () => calculateManagementClass({ aMeasurements: [1, 1, 1, 1], managementConcentration: 10 }),
  /5点以上/,
);

const evaluation = calculateEvaluationValues([1, 1, 1, 1, 1]);
assert.ok(evaluation.firstEvaluationValue > evaluation.secondEvaluationValue);

console.log("Management class calculator tests passed.");
