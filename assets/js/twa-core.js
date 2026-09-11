/* 8-hour normalization is unchanged. Missing time is unknown, never implicit zero. */
(function (root) {
  "use strict";
  function calculate(entries, targetHours = 8, limit = null) {
    if (!Number.isFinite(targetHours) || targetHours < 8 || targetHours > 24) {
      throw new Error("対象時間は8〜24時間で入力してください。8時間より短い勤務も、残りの時間の扱いを確認してください。");
    }
    if (!entries.length || entries.some(({ concentration, hours }) =>
      !Number.isFinite(concentration) || concentration < 0 || !Number.isFinite(hours) || hours <= 0)) {
      throw new Error("濃度は0以上、時間は0より大きい数値で入力してください。");
    }
    if (limit !== null && (!Number.isFinite(limit) || limit <= 0)) {
      throw new Error("ばく露限度は0より大きい数値で入力してください。");
    }
    const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);
    // Tolerance only absorbs floating point addition (e.g. minutes converted to hours).
    if (totalHours - targetHours > 1e-9) throw new Error("入力時間が対象時間を超えています。区間の重複・時間単位・対象時間を確認してください。");
    const dose = entries.reduce((sum, entry) => sum + entry.concentration * entry.hours, 0);
    const observed = dose / totalHours;
    const complete = Math.abs(totalHours - targetHours) <= 1e-9;
    const eightHour = complete ? dose / 8 : null;
    const ratio = complete && limit !== null ? eightHour / limit * 100 : null;
    if (![dose, observed, eightHour, ratio].every(value => value === null || Number.isFinite(value))) {
      throw new Error("計算できる数値の範囲を超えています。入力値を確認してください。");
    }
    return { totalHours, missingHours: complete ? 0 : targetHours - totalHours, dose, observed, complete, eightHour, ratio };
  }
  if (typeof module === "object" && module.exports) module.exports = { calculate };
  else root.TwaCore = { calculate };
})(typeof globalThis !== "undefined" ? globalThis : this);
