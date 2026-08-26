const DAY_VARIANCE = 0.084;
const FIRST_EVALUATION_COEFFICIENT = 1.645;
const SECOND_EVALUATION_COEFFICIENT = 1.151;

const MANAGEMENT_CLASS_DETAILS = {
  1: {
    label: "第1管理区分",
    summary: "作業環境管理が適切と判断される状態です。",
    action: "現在の管理を継続し、測定条件や作業内容が変わった場合は改めて確認します。",
  },
  2: {
    label: "第2管理区分",
    summary: "作業環境管理になお改善の余地がある状態です。",
    action: "発散源、設備、作業方法、換気条件を点検し、必要な改善を検討します。",
  },
  3: {
    label: "第3管理区分",
    summary: "作業環境管理が適切でないと判断される状態です。",
    action: "対象となる規則と測定結果を確認し、必要な措置、改善、効果確認へつなげます。",
  },
};

function normalizeNumber(value, label) {
  const number = typeof value === "number" ? value : Number(String(value).normalize("NFKC"));

  if (!Number.isFinite(number) || number <= 0) {
    throw new RangeError(`${label}には、0より大きい数値を入力してください。`);
  }

  return number;
}

function assertMeasurementArray(values, label) {
  if (!Array.isArray(values) || values.length === 0) {
    throw new RangeError(`${label}を入力してください。`);
  }

  return values.map((value, index) => normalizeNumber(value, `${label}${index + 1}`));
}

export function parseMeasurementValues(value, label = "測定値") {
  const normalized = String(value || "")
    .normalize("NFKC")
    .replace(/[、，,;；]/g, " ")
    .trim();

  if (!normalized) {
    return [];
  }

  return assertMeasurementArray(normalized.split(/\s+/), label);
}

export function calculateGeometricStatistics(values) {
  const measurements = assertMeasurementArray(values, "A測定値");

  if (measurements.length < 2) {
    throw new RangeError("評価値の計算には、2点以上のA測定値が必要です。");
  }

  const logarithms = measurements.map((value) => Math.log10(value));
  const logMean = logarithms.reduce((sum, value) => sum + value, 0) / logarithms.length;
  const squaredDeviationSum = logarithms.reduce(
    (sum, value) => sum + (value - logMean) ** 2,
    0,
  );
  const logStandardDeviation = Math.sqrt(squaredDeviationSum / (logarithms.length - 1));

  return {
    count: measurements.length,
    logMean,
    logStandardDeviation,
    geometricMean: 10 ** logMean,
    geometricStandardDeviation: 10 ** logStandardDeviation,
  };
}

export function calculateEvaluationValues(values) {
  const statistics = calculateGeometricStatistics(values);
  const adjustedVariance = statistics.logStandardDeviation ** 2 + DAY_VARIANCE;
  const firstEvaluationValue = 10 ** (
    statistics.logMean + FIRST_EVALUATION_COEFFICIENT * Math.sqrt(adjustedVariance)
  );
  const secondEvaluationValue = 10 ** (
    statistics.logMean + SECOND_EVALUATION_COEFFICIENT * adjustedVariance
  );

  return {
    ...statistics,
    adjustedVariance,
    firstEvaluationValue,
    secondEvaluationValue,
  };
}

export function classifyAResult({ firstEvaluationValue, secondEvaluationValue, managementConcentration }) {
  const first = normalizeNumber(firstEvaluationValue, "第1評価値");
  const second = normalizeNumber(secondEvaluationValue, "第2評価値");
  const concentration = normalizeNumber(managementConcentration, "管理濃度");

  if (first < concentration) {
    return {
      level: 1,
      reason: "第1評価値が管理濃度を下回っています。",
    };
  }

  if (second <= concentration) {
    return {
      level: 2,
      reason: "第1評価値は管理濃度以上ですが、第2評価値は管理濃度以下です。",
    };
  }

  return {
    level: 3,
    reason: "第2評価値が管理濃度を上回っています。",
  };
}

export function classifyBResult({ bMeasurements = [], managementConcentration }) {
  if (!bMeasurements.length) {
    return null;
  }

  const measurements = assertMeasurementArray(bMeasurements, "B測定値");
  const concentration = normalizeNumber(managementConcentration, "管理濃度");
  const maximum = Math.max(...measurements);
  const upperLimit = concentration * 1.5;

  if (maximum < concentration) {
    return {
      level: 1,
      count: measurements.length,
      maximum,
      upperLimit,
      reason: "B測定の最大値が管理濃度を下回っています。",
    };
  }

  if (maximum <= upperLimit) {
    return {
      level: 2,
      count: measurements.length,
      maximum,
      upperLimit,
      reason: "B測定の最大値が管理濃度以上、管理濃度の1.5倍以下です。",
    };
  }

  return {
    level: 3,
    count: measurements.length,
    maximum,
    upperLimit,
    reason: "B測定の最大値が管理濃度の1.5倍を上回っています。",
  };
}

export function determineManagementClass({
  firstEvaluationValue,
  secondEvaluationValue,
  bMeasurements = [],
  managementConcentration,
}) {
  const aResult = classifyAResult({
    firstEvaluationValue,
    secondEvaluationValue,
    managementConcentration,
  });
  const bResult = classifyBResult({ bMeasurements, managementConcentration });
  const level = Math.max(aResult.level, bResult?.level || 1);

  return {
    level,
    detail: MANAGEMENT_CLASS_DETAILS[level],
    aResult,
    bResult,
  };
}

export function calculateManagementClass({ aMeasurements, bMeasurements = [], managementConcentration }) {
  const measurements = assertMeasurementArray(aMeasurements, "A測定値");

  if (measurements.length < 5) {
    throw new RangeError("A測定値は5点以上入力してください。著しく狭い単位作業場所などの例外は、このツールでは扱いません。");
  }

  const evaluationValues = calculateEvaluationValues(measurements);
  const classification = determineManagementClass({
    firstEvaluationValue: evaluationValues.firstEvaluationValue,
    secondEvaluationValue: evaluationValues.secondEvaluationValue,
    bMeasurements,
    managementConcentration,
  });

  return {
    ...classification,
    evaluationValues,
    managementConcentration: normalizeNumber(managementConcentration, "管理濃度"),
  };
}

function formatNumber(value) {
  return new Intl.NumberFormat("ja-JP", {
    maximumSignificantDigits: 4,
  }).format(value);
}

function getInputValue(root, selector) {
  return root.querySelector(selector)?.value || "";
}

function initializeManagementClassTool() {
  const root = document.querySelector("[data-management-class-tool]");
  if (!root) return;

  const form = root.querySelector("#managementClassForm");
  const bToggle = root.querySelector("#managementClassBEnabled");
  const bPanel = root.querySelector("#managementClassBPanel");
  const bInput = root.querySelector("#managementClassBMeasurements");
  const error = root.querySelector("#managementClassError");
  const result = root.querySelector("#managementClassResult");
  const resultGuide = root.querySelector("#managementClassResultGuide");
  const exampleButton = root.querySelector("#managementClassExample");
  const resetButton = root.querySelector("#managementClassReset");
  const copyButton = root.querySelector("#managementClassCopy");

  if (!form || !bToggle || !bPanel || !bInput || !error || !result || !resultGuide) return;

  let latestCopyText = "";

  const updateBPanel = () => {
    bPanel.hidden = !bToggle.checked;
    bInput.required = bToggle.checked;
  };

  const resetResult = () => {
    result.hidden = true;
    resultGuide.hidden = false;
    result.classList.remove("is-class-1", "is-class-2", "is-class-3");
    latestCopyText = "";
    if (copyButton) copyButton.textContent = "結果をコピー";
  };

  const showError = (message) => {
    error.hidden = false;
    error.textContent = message;
  };

  const clearError = () => {
    error.hidden = true;
    error.textContent = "";
  };

  const setResultText = (selector, value) => {
    const element = root.querySelector(selector);
    if (element) element.textContent = value;
  };

  const showResult = (calculation, unit) => {
    const { detail, level, aResult, bResult, evaluationValues, managementConcentration } = calculation;
    const unitSuffix = unit ? ` ${unit}` : "";
    const firstEvaluation = `${formatNumber(evaluationValues.firstEvaluationValue)}${unitSuffix}`;
    const secondEvaluation = `${formatNumber(evaluationValues.secondEvaluationValue)}${unitSuffix}`;
    const bMaximum = bResult ? `${formatNumber(bResult.maximum)}${unitSuffix}` : "未実施";

    result.classList.remove("is-class-1", "is-class-2", "is-class-3");
    result.classList.add(`is-class-${level}`);
    result.hidden = false;
    resultGuide.hidden = true;

    setResultText("#managementClassResultLabel", detail.label);
    setResultText("#managementClassResultSummary", detail.summary);
    setResultText("#managementClassResultAction", detail.action);
    setResultText("#managementClassResultEa1", firstEvaluation);
    setResultText("#managementClassResultEa2", secondEvaluation);
    setResultText("#managementClassResultB", bMaximum);
    setResultText("#managementClassResultGm", `${formatNumber(evaluationValues.geometricMean)}${unitSuffix}`);
    setResultText("#managementClassResultGsd", formatNumber(evaluationValues.geometricStandardDeviation));
    setResultText("#managementClassResultAReason", `A測定：${aResult.reason}`);
    setResultText(
      "#managementClassResultBReason",
      bResult ? `B測定：${bResult.reason}` : "B測定：未実施として判定しました。",
    );
    setResultText(
      "#managementClassResultInput",
      `管理濃度 ${formatNumber(managementConcentration)}${unitSuffix}、A測定 ${evaluationValues.count}点${bResult ? `、B測定 ${bResult.count}点` : ""}`,
    );

    latestCopyText = [
      "管理区分判定ツール（参考計算）",
      `管理濃度: ${formatNumber(managementConcentration)}${unitSuffix}`,
      `A測定: ${evaluationValues.count}点`,
      `幾何平均: ${formatNumber(evaluationValues.geometricMean)}${unitSuffix}`,
      `幾何標準偏差: ${formatNumber(evaluationValues.geometricStandardDeviation)}`,
      `第1評価値: ${firstEvaluation}`,
      `第2評価値: ${secondEvaluation}`,
      `B測定最大値: ${bMaximum}`,
      `判定: ${detail.label}`,
      `根拠: ${aResult.reason}${bResult ? ` ${bResult.reason}` : " B測定は未実施。"}`,
      "※1日測定のA/B測定を対象とした参考計算です。報告書の最終判定には使用前提・法令・測定条件を確認してください。",
    ].join("\n");
  };

  bToggle.addEventListener("change", () => {
    updateBPanel();
    resetResult();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearError();

    try {
      const managementConcentration = normalizeNumber(
        getInputValue(root, "#managementClassConcentration"),
        "管理濃度",
      );
      const unit = getInputValue(root, "#managementClassUnit").trim();
      if (!unit) {
        throw new RangeError("測定値と管理濃度に共通する単位を入力してください。");
      }

      const aMeasurements = parseMeasurementValues(
        getInputValue(root, "#managementClassAMeasurements"),
        "A測定値",
      );
      const bMeasurements = bToggle.checked
        ? parseMeasurementValues(bInput.value, "B測定値")
        : [];

      if (bToggle.checked && bMeasurements.length === 0) {
        throw new RangeError("B測定を実施した場合は、B測定値を1点以上入力してください。");
      }

      const calculation = calculateManagementClass({
        aMeasurements,
        bMeasurements,
        managementConcentration,
      });
      showResult(calculation, unit);
      result.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } catch (caughtError) {
      resetResult();
      showError(caughtError instanceof Error ? caughtError.message : "入力内容を確認してください。");
    }
  });

  exampleButton?.addEventListener("click", () => {
    root.querySelector("#managementClassConcentration").value = "20";
    root.querySelector("#managementClassUnit").value = "ppm";
    root.querySelector("#managementClassAMeasurements").value = "9\n11\n12\n13\n15";
    bToggle.checked = false;
    bInput.value = "";
    updateBPanel();
    clearError();
    resetResult();
  });

  resetButton?.addEventListener("click", () => {
    form.reset();
    updateBPanel();
    clearError();
    resetResult();
  });

  copyButton?.addEventListener("click", async () => {
    if (!latestCopyText || !navigator.clipboard?.writeText) return;

    try {
      await navigator.clipboard.writeText(latestCopyText);
      copyButton.textContent = "コピーしました";
      window.setTimeout(() => {
        copyButton.textContent = "結果をコピー";
      }, 1800);
    } catch {
      copyButton.textContent = "コピーできませんでした";
    }
  });

  updateBPanel();
  resetResult();
}

if (typeof document !== "undefined") {
  initializeManagementClassTool();
}
