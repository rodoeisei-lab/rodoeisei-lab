import {
  MANAGEMENT_CONCENTRATION_SOURCE,
  SUBSTANCE_CATEGORY_LABELS,
  formatManagementConcentration,
  getManagementConcentrationSubstance,
  getManagementConcentrationSubstances,
} from "./management-class-substances.mjs";

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

function normalizePercentage(value, label) {
  const number = typeof value === "number" ? value : Number(String(value).normalize("NFKC"));

  if (!Number.isFinite(number) || number < 0 || number > 100) {
    throw new RangeError(`${label}には、0〜100の数値を入力してください。`);
  }

  return number;
}

export function calculateDustManagementConcentration(freeSilicaContent) {
  const q = normalizePercentage(freeSilicaContent, "遊離けい酸含有率 Q");
  return 3 / (1.19 * q + 1);
}

export function convertRelativeConcentrationToMass(
  relativeMeasurements,
  massConcentrationConversionFactor,
  label = "相対濃度",
) {
  const measurements = assertMeasurementArray(relativeMeasurements, label);
  const kValue = normalizeNumber(massConcentrationConversionFactor, "K値");

  return measurements.map((measurement) => measurement * kValue);
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

export function calculateDustManagementClass({
  relativeAMeasurements,
  relativeBMeasurements = [],
  freeSilicaContent,
  massConcentrationConversionFactor,
}) {
  const q = normalizePercentage(freeSilicaContent, "遊離けい酸含有率 Q");
  const kValue = normalizeNumber(massConcentrationConversionFactor, "K値");
  const aMeasurements = convertRelativeConcentrationToMass(
    relativeAMeasurements,
    kValue,
    "A測定の相対濃度",
  );
  const bMeasurements = relativeBMeasurements.length
    ? convertRelativeConcentrationToMass(relativeBMeasurements, kValue, "B測定の相対濃度")
    : [];
  const managementConcentration = calculateDustManagementConcentration(q);

  return {
    ...calculateManagementClass({ aMeasurements, bMeasurements, managementConcentration }),
    dust: {
      freeSilicaContent: q,
      massConcentrationConversionFactor: kValue,
    },
  };
}

function formatNumber(value) {
  return new Intl.NumberFormat("ja-JP", {
    maximumSignificantDigits: 4,
  }).format(value);
}

function initializeManagementClassTool() {
  const root = document.querySelector("[data-management-class-tool]");
  if (!root) return;

  const form = root.querySelector("#managementClassForm");
  const modeInputs = root.querySelectorAll("[name='managementClassMode']");
  const chemicalPanel = root.querySelector("#managementClassChemicalPanel");
  const dustPanel = root.querySelector("#managementClassDustPanel");
  const modeHelp = root.querySelector("#managementClassModeHelp");
  const inputNotice = root.querySelector("#managementClassInputNotice");
  const substanceCategory = root.querySelector("#managementClassSubstanceCategory");
  const substanceSelect = root.querySelector("#managementClassSubstance");
  const substanceNote = root.querySelector("#managementClassSubstanceNote");
  const concentrationInput = root.querySelector("#managementClassConcentration");
  const unitInput = root.querySelector("#managementClassUnit");
  const dustQInput = root.querySelector("#managementClassDustQ");
  const dustInputModeInputs = root.querySelectorAll("[name='managementClassDustInputMode']");
  const dustKField = root.querySelector("#managementClassDustKField");
  const dustKInput = root.querySelector("#managementClassDustK");
  const dustPreview = root.querySelector("#managementClassDustPreview");
  const aInput = root.querySelector("#managementClassAMeasurements");
  const aLabel = root.querySelector("#managementClassAMeasurementsLabel");
  const aHelp = root.querySelector("#managementClassAHelp");
  const aStatus = root.querySelector("#managementClassAStatus");
  const bToggle = root.querySelector("#managementClassBEnabled");
  const bPanel = root.querySelector("#managementClassBPanel");
  const bInput = root.querySelector("#managementClassBMeasurements");
  const bLabel = root.querySelector("#managementClassBMeasurementsLabel");
  const bHelp = root.querySelector("#managementClassBHelp");
  const bStatus = root.querySelector("#managementClassBStatus");
  const error = root.querySelector("#managementClassError");
  const result = root.querySelector("#managementClassResult");
  const resultGuide = root.querySelector("#managementClassResultGuide");
  const exampleButton = root.querySelector("#managementClassExample");
  const resetButton = root.querySelector("#managementClassReset");
  const copyButton = root.querySelector("#managementClassCopy");

  if (
    !form
    || !modeInputs.length
    || !chemicalPanel
    || !dustPanel
    || !substanceCategory
    || !substanceSelect
    || !concentrationInput
    || !unitInput
    || !dustQInput
    || !dustKInput
    || !aInput
    || !bToggle
    || !bPanel
    || !bInput
    || !error
    || !result
    || !resultGuide
  ) return;

  let latestCopyText = "";

  const getMode = () => root.querySelector("[name='managementClassMode']:checked")?.value || "chemical";
  const getDustInputMode = () => root.querySelector("[name='managementClassDustInputMode']:checked")?.value || "relative";
  const isDustMode = () => getMode() === "dust";
  const getSelectedSubstance = () => getManagementConcentrationSubstance(substanceSelect.value);

  const setInputNotice = (message = "") => {
    if (!inputNotice) return;
    inputNotice.hidden = !message;
    inputNotice.textContent = message;
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

  const getMeasurementUnit = () => {
    if (!isDustMode()) return unitInput.value.trim();
    return getDustInputMode() === "relative" ? "cpm" : "mg/m³";
  };

  const updateMeasurementStatus = (input, status, label) => {
    if (!status) return;
    const value = input.value.trim();

    if (!value) {
      status.hidden = true;
      status.textContent = "";
      status.classList.remove("is-invalid");
      return;
    }

    try {
      const measurements = parseMeasurementValues(value, label);
      const unit = getMeasurementUnit();
      const unitSuffix = unit ? ` ${unit}` : "";
      status.hidden = false;
      status.classList.remove("is-invalid");
      status.textContent = `${measurements.length}点を認識しました（${formatNumber(Math.min(...measurements))}〜${formatNumber(Math.max(...measurements))}${unitSuffix}）。`;
    } catch (caughtError) {
      status.hidden = false;
      status.classList.add("is-invalid");
      status.textContent = caughtError instanceof Error ? caughtError.message : "数値を確認してください。";
    }
  };

  const updateMeasurementStatuses = () => {
    updateMeasurementStatus(aInput, aStatus, aLabel?.textContent || "A測定値");
    if (!bToggle.checked && bStatus) {
      bStatus.hidden = true;
      bStatus.textContent = "";
      bStatus.classList.remove("is-invalid");
      return;
    }
    updateMeasurementStatus(bInput, bStatus, bLabel?.textContent || "B測定値");
  };

  const updateBPanel = () => {
    bPanel.hidden = !bToggle.checked;
    bInput.required = bToggle.checked;
  };

  const usesSelectedPreset = (substance) => {
    if (!substance) return false;
    const enteredConcentration = Number(String(concentrationInput.value).normalize("NFKC"));
    return enteredConcentration === substance.value && unitInput.value.trim() === substance.unit;
  };

  const updateSubstanceNote = () => {
    if (!substanceNote) return;
    const substance = getSelectedSubstance();

    if (!substance) {
      substanceNote.textContent = "物質名を選ぶと、登録した管理濃度と単位を入力します。登録外の物質は、確認済みの管理濃度を手入力してください。";
      return;
    }

    const concentration = formatManagementConcentration(substance);
    const suffix = usesSelectedPreset(substance)
      ? "管理濃度と単位を自動入力しました。"
      : "選択値から管理濃度または単位を変更しています。最終確認は別表で行ってください。";
    substanceNote.textContent = `${substance.name}：${concentration}（${MANAGEMENT_CONCENTRATION_SOURCE.conditions}）。${suffix}`;
  };

  const createSubstanceOption = (substance) => {
    const option = document.createElement("option");
    option.value = substance.id;
    option.textContent = `${substance.name}（${formatManagementConcentration(substance)}）`;
    return option;
  };

  const populateSubstanceOptions = ({ selectedId = substanceSelect.value } = {}) => {
    const category = substanceCategory.value || "popular";
    substanceSelect.replaceChildren(new Option("物質名を選ぶ（または管理濃度を手入力）", ""));

    if (category === "all") {
      for (const groupCategory of ["organic", "specified", "lead"]) {
        const substances = getManagementConcentrationSubstances(groupCategory);
        if (!substances.length) continue;
        const group = document.createElement("optgroup");
        group.label = SUBSTANCE_CATEGORY_LABELS[groupCategory];
        substances.forEach((substance) => group.append(createSubstanceOption(substance)));
        substanceSelect.append(group);
      }
    } else {
      getManagementConcentrationSubstances(category)
        .forEach((substance) => substanceSelect.append(createSubstanceOption(substance)));
    }

    if (selectedId && getManagementConcentrationSubstance(selectedId)) {
      substanceSelect.value = selectedId;
    }

    if (substanceSelect.value !== selectedId) {
      substanceSelect.value = "";
    }
  };

  const applySelectedSubstance = () => {
    const substance = getSelectedSubstance();
    if (!substance) {
      updateSubstanceNote();
      return;
    }

    concentrationInput.value = String(substance.value);
    unitInput.value = substance.unit;
    updateSubstanceNote();
  };

  const updateDustPreview = () => {
    if (!dustPreview) return;
    const rawQ = dustQInput.value.trim();

    if (!rawQ) {
      dustPreview.textContent = "遊離けい酸含有率 Q を入力すると、粉じんの管理濃度を自動計算します。";
      return;
    }

    try {
      const managementConcentration = calculateDustManagementConcentration(rawQ);
      const q = normalizePercentage(rawQ, "遊離けい酸含有率 Q");
      const conversionNote = getDustInputMode() === "relative"
        ? "相対濃度は、入力したK値を掛けて質量濃度へ換算します。"
        : "測定値は質量濃度（mg/m³）として入力します。";
      dustPreview.textContent = `Q ${formatNumber(q)}% → 管理濃度 E ${formatNumber(managementConcentration)} mg/m³。${conversionNote}`;
    } catch (caughtError) {
      dustPreview.textContent = caughtError instanceof Error ? caughtError.message : "遊離けい酸含有率を確認してください。";
    }
  };

  const updateMeasurementLabels = () => {
    const dust = isDustMode();
    const relative = dust && getDustInputMode() === "relative";
    const aText = dust ? (relative ? "A測定の相対濃度" : "A測定の質量濃度") : "A測定値";
    const bText = dust ? (relative ? "B測定の相対濃度" : "B測定の質量濃度") : "B測定値";

    if (aLabel) aLabel.textContent = aText;
    if (bLabel) bLabel.textContent = bText;
    aInput.setAttribute("aria-label", aText);
    bInput.setAttribute("aria-label", bText);

    if (!dust) {
      aInput.placeholder = "例：\n9\n11\n12\n13\n15";
      bInput.placeholder = "例：18\n22";
      if (aHelp) aHelp.textContent = "1日測定のA測定値を入力します。著しく狭い単位作業場所など、5点未満が認められる例外はこのツールの対象外です。";
      if (bHelp) bHelp.textContent = "複数ある場合はすべて入力します。判定には最大値を使用します。";
      return;
    }

    if (relative) {
      aInput.placeholder = "例：\n420\n510\n480\n560\n490";
      bInput.placeholder = "例：760\n820";
      if (aHelp) aHelp.textContent = "粉じん計の相対濃度（cpm）を入力します。判定前にK値を掛けて質量濃度（mg/m³）へ換算します。";
      if (bHelp) bHelp.textContent = "B測定の相対濃度（cpm）を入力します。K値で換算した後の最大値を判定に使用します。";
    } else {
      aInput.placeholder = "例：\n0.42\n0.51\n0.48\n0.56\n0.49";
      bInput.placeholder = "例：0.76\n0.82";
      if (aHelp) aHelp.textContent = "分析・併行測定などで確定した質量濃度（mg/m³）を入力します。K値による換算は行いません。";
      if (bHelp) bHelp.textContent = "B測定の質量濃度（mg/m³）を入力します。複数ある場合は最大値を判定に使用します。";
    }
  };

  const updateMode = () => {
    const dust = isDustMode();
    chemicalPanel.hidden = dust;
    dustPanel.hidden = !dust;
    if (dustKField) dustKField.hidden = !dust || getDustInputMode() !== "relative";

    if (modeHelp) {
      modeHelp.textContent = dust
        ? "粉じんでは、遊離けい酸含有率 Q から管理濃度を計算します。相対濃度で測定した場合はK値で質量濃度へ換算します。"
        : "物質名を選ぶと管理濃度と単位を自動入力します。混合有機溶剤や登録外の物質は、確認した値を手入力してください。";
    }

    updateMeasurementLabels();
    updateDustPreview();
    updateMeasurementStatuses();
  };

  const clearMeasurementInputs = () => {
    aInput.value = "";
    bInput.value = "";
    updateMeasurementStatuses();
  };

  const showResult = (calculation, unit, context = {}) => {
    const { detail, level, aResult, bResult, evaluationValues, managementConcentration } = calculation;
    const unitSuffix = unit ? ` ${unit}` : "";
    const firstEvaluation = `${formatNumber(evaluationValues.firstEvaluationValue)}${unitSuffix}`;
    const secondEvaluation = `${formatNumber(evaluationValues.secondEvaluationValue)}${unitSuffix}`;
    const bMaximum = bResult ? `${formatNumber(bResult.maximum)}${unitSuffix}` : "未実施";
    const inputSummary = `${context.summary ? `${context.summary}、` : ""}管理濃度 ${formatNumber(managementConcentration)}${unitSuffix}、A測定 ${evaluationValues.count}点${bResult ? `、B測定 ${bResult.count}点` : ""}`;

    result.classList.remove("is-class-1", "is-class-2", "is-class-3");
    result.classList.add(`is-class-${level}`);
    result.hidden = false;
    resultGuide.hidden = true;

    setResultText("#managementClassResultSubject", context.label || "対象：手入力の管理濃度");
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
    setResultText("#managementClassResultInput", inputSummary);

    latestCopyText = [
      "管理区分判定ツール（参考計算）",
      ...(context.copyLines || []),
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

  modeInputs.forEach((input) => {
    input.addEventListener("change", () => {
      clearMeasurementInputs();
      clearError();
      resetResult();
      setInputNotice("対象を切り替えたため、測定値を空にしました。入力形式を確認して入れ直してください。");
      updateMode();
    });
  });

  dustInputModeInputs.forEach((input) => {
    input.addEventListener("change", () => {
      clearMeasurementInputs();
      clearError();
      resetResult();
      setInputNotice("粉じんの入力方法を切り替えたため、測定値を空にしました。単位を確認して入れ直してください。");
      updateMode();
    });
  });

  substanceCategory.addEventListener("change", () => {
    populateSubstanceOptions({ selectedId: "" });
    updateSubstanceNote();
    resetResult();
  });

  substanceSelect.addEventListener("change", () => {
    applySelectedSubstance();
    updateMeasurementStatuses();
    clearError();
    resetResult();
  });

  [concentrationInput, unitInput].forEach((input) => {
    input.addEventListener("input", () => {
      updateSubstanceNote();
      updateMeasurementStatuses();
      resetResult();
    });
  });

  [dustQInput, dustKInput].forEach((input) => {
    input.addEventListener("input", () => {
      updateDustPreview();
      resetResult();
    });
  });

  [aInput, bInput].forEach((input) => {
    input.addEventListener("input", () => {
      updateMeasurementStatuses();
      resetResult();
    });
  });

  bToggle.addEventListener("change", () => {
    updateBPanel();
    updateMeasurementStatuses();
    resetResult();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearError();
    setInputNotice();

    try {
      const bMeasurements = bToggle.checked
        ? parseMeasurementValues(bInput.value, bLabel?.textContent || "B測定値")
        : [];

      if (bToggle.checked && bMeasurements.length === 0) {
        throw new RangeError("B測定を実施した場合は、B測定値を1点以上入力してください。");
      }

      let calculation;
      let unit;
      let context;

      if (isDustMode()) {
        const freeSilicaContent = dustQInput.value;
        const relative = getDustInputMode() === "relative";
        const aMeasurements = parseMeasurementValues(aInput.value, aLabel?.textContent || "A測定値");
        unit = "mg/m³";

        if (relative) {
          const kValue = normalizeNumber(dustKInput.value, "K値");
          calculation = calculateDustManagementClass({
            relativeAMeasurements: aMeasurements,
            relativeBMeasurements: bMeasurements,
            freeSilicaContent,
            massConcentrationConversionFactor: kValue,
          });
          context = {
            label: "対象：粉じん（相対濃度 × K値）",
            summary: `Q ${formatNumber(calculation.dust.freeSilicaContent)}%、K値 ${formatNumber(kValue)} mg/m³/cpm`,
            copyLines: [
              "対象: 粉じん",
              "測定値: 相対濃度（cpm）× K値で質量濃度へ換算",
              `遊離けい酸含有率 Q: ${formatNumber(calculation.dust.freeSilicaContent)}%`,
              `K値: ${formatNumber(kValue)} mg/m³/cpm`,
            ],
          };
        } else {
          const managementConcentration = calculateDustManagementConcentration(freeSilicaContent);
          const q = normalizePercentage(freeSilicaContent, "遊離けい酸含有率 Q");
          calculation = calculateManagementClass({
            aMeasurements,
            bMeasurements,
            managementConcentration,
          });
          context = {
            label: "対象：粉じん（質量濃度を直接入力）",
            summary: `Q ${formatNumber(q)}%から算出`,
            copyLines: [
              "対象: 粉じん",
              "測定値: 質量濃度（mg/m³）を直接入力",
              `遊離けい酸含有率 Q: ${formatNumber(q)}%`,
            ],
          };
        }
      } else {
        const managementConcentration = normalizeNumber(concentrationInput.value, "管理濃度");
        unit = unitInput.value.trim();
        if (!unit) {
          throw new RangeError("測定値と管理濃度に共通する単位を入力してください。");
        }

        const aMeasurements = parseMeasurementValues(aInput.value, aLabel?.textContent || "A測定値");
        calculation = calculateManagementClass({ aMeasurements, bMeasurements, managementConcentration });
        const substance = getSelectedSubstance();
        const presetApplied = usesSelectedPreset(substance);
        context = {
          label: substance
            ? `対象：${substance.name}${presetApplied ? "（登録値）" : "（管理濃度・単位は手入力）"}`
            : "対象：物質名未選択（手入力）",
          summary: substance && presetApplied ? MANAGEMENT_CONCENTRATION_SOURCE.title : "手入力",
          copyLines: [
            substance ? `対象: ${substance.name}` : "対象: 物質名未選択（手入力）",
            substance && presetApplied
              ? `管理濃度の設定: ${MANAGEMENT_CONCENTRATION_SOURCE.title}の登録値`
              : "管理濃度の設定: 手入力",
          ],
        };
      }

      showResult(calculation, unit, context);
      result.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } catch (caughtError) {
      resetResult();
      showError(caughtError instanceof Error ? caughtError.message : "入力内容を確認してください。");
    }
  });

  exampleButton?.addEventListener("click", () => {
    bToggle.checked = false;
    bInput.value = "";

    if (isDustMode()) {
      const relativeInput = root.querySelector("[name='managementClassDustInputMode'][value='relative']");
      if (relativeInput) relativeInput.checked = true;
      dustQInput.value = "5";
      dustKInput.value = "0.001";
      aInput.value = "420\n510\n480\n560\n490";
      setInputNotice("粉じん（相対濃度 × K値）の例を入力しました。");
    } else {
      substanceCategory.value = "popular";
      populateSubstanceOptions({ selectedId: "toluene" });
      applySelectedSubstance();
      aInput.value = "9\n11\n12\n13\n15";
      setInputNotice("トルエンの例を入力しました。");
    }

    updateBPanel();
    updateMode();
    updateMeasurementStatuses();
    clearError();
    resetResult();
  });

  resetButton?.addEventListener("click", () => {
    form.reset();
    populateSubstanceOptions({ selectedId: "" });
    updateBPanel();
    updateMode();
    updateSubstanceNote();
    updateMeasurementStatuses();
    clearError();
    setInputNotice();
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

  populateSubstanceOptions({ selectedId: "" });
  updateBPanel();
  updateMode();
  updateSubstanceNote();
  resetResult();
}

if (typeof document !== "undefined") {
  initializeManagementClassTool();
}
