import {
  calculateManagementClass,
  parseMeasurementValues,
} from "./management-class-calculator.mjs";
import {
  MANAGEMENT_CONCENTRATION_SOURCE,
  getManagementConcentrationSubstance,
  getManagementConcentrationSubstances,
} from "./management-class-substances.mjs";

export const SPECIAL_ORGANIC_SOLVENT_IDS = Object.freeze([
  "ethylbenzene",
  "chloroform",
  "carbon-tetrachloride",
  "dioxane",
  "dichloroethane",
  "dichloropropane",
  "dichloromethane",
  "styrene",
  "tetrachloroethane",
  "tetrachloroethylene",
  "trichloroethylene",
  "mibk",
]);

const SPECIAL_ORGANIC_SOLVENT_SET = new Set(SPECIAL_ORGANIC_SOLVENT_IDS);
const MAX_COMPONENTS = 8;

function normalizePositiveNumber(value, label) {
  const number = typeof value === "number" ? value : Number(String(value).normalize("NFKC"));
  if (!Number.isFinite(number) || number <= 0) {
    throw new RangeError(`${label}には、0より大きい数値を入力してください。`);
  }
  return number;
}

function normalizeMeasurements(values, label) {
  if (!Array.isArray(values) || values.length === 0) {
    throw new RangeError(`${label}を入力してください。`);
  }

  return values.map((value, index) => normalizePositiveNumber(value, `${label}${index + 1}`));
}

function assertSamePointCount(components, key, label) {
  const expected = components[0][key].length;
  for (let index = 1; index < components.length; index += 1) {
    if (components[index][key].length !== expected) {
      throw new RangeError(`${label}は、すべての溶剤で同じ測定点数にしてください。`);
    }
  }
  return expected;
}

export function getMixedOrganicSolventSubstances() {
  const organic = getManagementConcentrationSubstances("organic");
  const special = getManagementConcentrationSubstances("all")
    .filter((substance) => SPECIAL_ORGANIC_SOLVENT_SET.has(substance.id));
  const byId = new Map([...organic, ...special].map((substance) => [substance.id, substance]));

  return [...byId.values()].sort((a, b) => a.name.localeCompare(b.name, "ja"));
}

export function calculateConvertedMeasurements(components, measurementKey) {
  if (!Array.isArray(components) || components.length < 2) {
    throw new RangeError("混合有機溶剤は2種類以上入力してください。");
  }

  const pointCount = assertSamePointCount(
    components,
    measurementKey,
    measurementKey === "bMeasurements" ? "B測定値" : "A測定値",
  );

  return Array.from({ length: pointCount }, (_, pointIndex) => components.reduce(
    (sum, component) => sum + component[measurementKey][pointIndex] / component.managementConcentration,
    0,
  ));
}

export function calculateMixedOrganicManagementClass({ components, includeB = false }) {
  if (!Array.isArray(components) || components.length < 2) {
    throw new RangeError("混合有機溶剤は2種類以上入力してください。");
  }
  if (components.length > MAX_COMPONENTS) {
    throw new RangeError(`このツールでは、混合する溶剤は${MAX_COMPONENTS}種類までです。`);
  }

  const normalizedComponents = components.map((component, index) => {
    const number = index + 1;
    const managementConcentration = normalizePositiveNumber(
      component.managementConcentration,
      `溶剤${number}の管理濃度`,
    );
    const aMeasurements = normalizeMeasurements(component.aMeasurements, `溶剤${number}のA測定値`);
    const bMeasurements = includeB
      ? normalizeMeasurements(component.bMeasurements, `溶剤${number}のB測定値`)
      : [];

    return {
      id: component.id || "",
      name: component.name || `溶剤${number}`,
      managementConcentration,
      unit: component.unit || "ppm",
      aMeasurements,
      bMeasurements,
    };
  });

  const aPointCount = assertSamePointCount(normalizedComponents, "aMeasurements", "A測定値");
  if (aPointCount < 5) {
    throw new RangeError("A測定値は、各溶剤について同じ5点以上を入力してください。");
  }

  if (includeB) {
    assertSamePointCount(normalizedComponents, "bMeasurements", "B測定値");
  }

  const convertedAMeasurements = calculateConvertedMeasurements(normalizedComponents, "aMeasurements");
  const convertedBMeasurements = includeB
    ? calculateConvertedMeasurements(normalizedComponents, "bMeasurements")
    : [];
  const calculation = calculateManagementClass({
    aMeasurements: convertedAMeasurements,
    bMeasurements: convertedBMeasurements,
    managementConcentration: 1,
  });

  return {
    ...calculation,
    components: normalizedComponents,
    convertedAMeasurements,
    convertedBMeasurements,
  };
}

function formatNumber(value) {
  return new Intl.NumberFormat("ja-JP", { maximumSignificantDigits: 4 }).format(value);
}

function initializeMixedOrganicTool() {
  const root = document.querySelector("[data-mixed-organic-tool]");
  if (!root) return;

  const form = root.querySelector("#mixedOrganicForm");
  const componentsRoot = root.querySelector("#mixedOrganicComponents");
  const addButton = root.querySelector("#mixedOrganicAdd");
  const exampleButton = root.querySelector("#mixedOrganicExample");
  const resetButton = root.querySelector("#mixedOrganicReset");
  const measurementModeInputs = root.querySelectorAll("[name='mixedOrganicMeasurementMode']");
  const error = root.querySelector("#mixedOrganicError");
  const result = root.querySelector("#mixedOrganicResult");
  const placeholder = root.querySelector("#mixedOrganicPlaceholder");
  const breakdown = root.querySelector("#mixedOrganicBreakdown");

  if (!form || !componentsRoot || !addButton || !error || !result || !placeholder || !breakdown) return;

  const substances = getMixedOrganicSolventSubstances();
  let nextRowId = 1;

  const getMeasurementMode = () => root.querySelector("[name='mixedOrganicMeasurementMode']:checked")?.value || "a";
  const includeB = () => getMeasurementMode() === "ab";

  const resetResult = () => {
    result.hidden = true;
    placeholder.hidden = false;
  };

  const clearError = () => {
    error.hidden = true;
    error.textContent = "";
  };

  const showError = (message) => {
    error.hidden = false;
    error.textContent = message;
  };

  const makeOption = (substance) => {
    const option = document.createElement("option");
    option.value = substance.id;
    const special = SPECIAL_ORGANIC_SOLVENT_SET.has(substance.id) ? "・特別有機溶剤" : "";
    option.textContent = `${substance.name}（${substance.value} ${substance.unit}${special}）`;
    return option;
  };

  const updateRemoveButtons = () => {
    const rows = componentsRoot.querySelectorAll("[data-mixed-organic-component]");
    rows.forEach((row) => {
      const remove = row.querySelector("[data-mixed-remove]");
      if (remove) remove.disabled = rows.length <= 2;
    });
    addButton.disabled = rows.length >= MAX_COMPONENTS;
  };

  const updateBVisibility = () => {
    componentsRoot.querySelectorAll("[data-mixed-b-field]").forEach((field) => {
      field.hidden = !includeB();
    });
    resetResult();
  };

  const renumberRows = () => {
    componentsRoot.querySelectorAll("[data-mixed-organic-component]").forEach((row, index) => {
      const heading = row.querySelector("[data-mixed-heading]");
      if (heading) heading.textContent = `溶剤 ${index + 1}`;
    });
    updateRemoveButtons();
  };

  const applySubstance = (row, id) => {
    const substance = getManagementConcentrationSubstance(id);
    const concentration = row.querySelector("[data-mixed-concentration]");
    const unit = row.querySelector("[data-mixed-unit]");
    const note = row.querySelector("[data-mixed-substance-note]");

    if (!substance) {
      if (concentration) concentration.value = "";
      if (unit) unit.textContent = "";
      if (note) note.textContent = "物質を選ぶと、管理濃度を自動表示します。";
      return;
    }

    if (concentration) concentration.value = String(substance.value);
    if (unit) unit.textContent = substance.unit;
    if (note) {
      const type = SPECIAL_ORGANIC_SOLVENT_SET.has(substance.id) ? "特別有機溶剤。" : "有機溶剤。";
      note.textContent = `${type}${MANAGEMENT_CONCENTRATION_SOURCE.title}の登録値を使用します。`;
    }
  };

  const createComponentRow = (selectedId = "") => {
    const rowId = nextRowId;
    nextRowId += 1;

    const section = document.createElement("section");
    section.className = "practical-tool__reference";
    section.dataset.mixedOrganicComponent = String(rowId);

    const heading = document.createElement("h3");
    heading.dataset.mixedHeading = "";
    section.append(heading);

    const grid = document.createElement("div");
    grid.className = "practical-tool__field-grid";

    const substanceLabel = document.createElement("label");
    substanceLabel.className = "practical-tool__field";
    substanceLabel.innerHTML = `<span>物質名 <em>必須</em></span>`;
    const select = document.createElement("select");
    select.dataset.mixedSubstance = "";
    select.append(new Option("物質を選ぶ", ""));
    substances.forEach((substance) => select.append(makeOption(substance)));
    substanceLabel.append(select);
    const note = document.createElement("small");
    note.dataset.mixedSubstanceNote = "";
    substanceLabel.append(note);

    const concentrationLabel = document.createElement("label");
    concentrationLabel.className = "practical-tool__field";
    concentrationLabel.innerHTML = `<span>管理濃度</span>`;
    const compound = document.createElement("span");
    compound.className = "practical-tool__compound";
    const concentration = document.createElement("input");
    concentration.type = "text";
    concentration.readOnly = true;
    concentration.dataset.mixedConcentration = "";
    concentration.setAttribute("aria-label", "管理濃度");
    const unit = document.createElement("select");
    unit.disabled = true;
    unit.setAttribute("aria-label", "管理濃度の単位");
    unit.append(new Option("ppm", "ppm"));
    unit.dataset.mixedUnitSelect = "";
    compound.append(concentration, unit);
    concentrationLabel.append(compound);
    const concentrationHelp = document.createElement("small");
    concentrationHelp.innerHTML = `単位：<span data-mixed-unit></span>。登録値を自動使用します。`;
    concentrationLabel.append(concentrationHelp);

    grid.append(substanceLabel, concentrationLabel);
    section.append(grid);

    const aField = document.createElement("label");
    aField.className = "practical-tool__field";
    aField.innerHTML = `<span>A測定値 <em>5点以上</em></span>`;
    const aInput = document.createElement("input");
    aInput.type = "text";
    aInput.inputMode = "decimal";
    aInput.autocomplete = "off";
    aInput.placeholder = "例：4, 5, 6, 5, 4";
    aInput.dataset.mixedA = "";
    aField.append(aInput);
    const aHelp = document.createElement("small");
    aHelp.textContent = "他の溶剤と同じ測定点の順番で、カンマ・空白区切りで入力します。";
    aField.append(aHelp);
    section.append(aField);

    const bField = document.createElement("label");
    bField.className = "practical-tool__field";
    bField.dataset.mixedBField = "";
    bField.hidden = !includeB();
    bField.innerHTML = `<span>B測定値 <em>1点以上</em></span>`;
    const bInput = document.createElement("input");
    bInput.type = "text";
    bInput.inputMode = "decimal";
    bInput.autocomplete = "off";
    bInput.placeholder = "例：8, 10";
    bInput.dataset.mixedB = "";
    bField.append(bInput);
    const bHelp = document.createElement("small");
    bHelp.textContent = "他の溶剤と同じB測定点の順番で入力します。";
    bField.append(bHelp);
    section.append(bField);

    const actions = document.createElement("div");
    actions.className = "practical-tool__actions";
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "practical-tool__text-button";
    remove.dataset.mixedRemove = "";
    remove.textContent = "この溶剤を削除";
    actions.append(remove);
    section.append(actions);

    select.addEventListener("change", () => {
      applySubstance(section, select.value);
      clearError();
      resetResult();
    });
    [aInput, bInput].forEach((input) => input.addEventListener("input", resetResult));
    remove.addEventListener("click", () => {
      if (componentsRoot.querySelectorAll("[data-mixed-organic-component]").length <= 2) return;
      section.remove();
      renumberRows();
      resetResult();
    });

    if (selectedId) select.value = selectedId;
    applySubstance(section, select.value);
    componentsRoot.append(section);
    renumberRows();
    return section;
  };

  const readComponents = () => [...componentsRoot.querySelectorAll("[data-mixed-organic-component]")]
    .map((row, index) => {
      const select = row.querySelector("[data-mixed-substance]");
      const substance = getManagementConcentrationSubstance(select?.value || "");
      if (!substance) {
        throw new RangeError(`溶剤${index + 1}の物質名を選んでください。`);
      }

      return {
        id: substance.id,
        name: substance.name,
        managementConcentration: substance.value,
        unit: substance.unit,
        aMeasurements: parseMeasurementValues(row.querySelector("[data-mixed-a]")?.value || "", `溶剤${index + 1}のA測定値`),
        bMeasurements: includeB()
          ? parseMeasurementValues(row.querySelector("[data-mixed-b]")?.value || "", `溶剤${index + 1}のB測定値`)
          : [],
      };
    });

  const renderBreakdown = (calculation) => {
    breakdown.replaceChildren();
    const tableWrap = document.createElement("div");
    tableWrap.className = "record-table-wrap";
    const table = document.createElement("table");
    table.className = "record-table";
    table.innerHTML = "<thead><tr><th>測定点</th><th>換算値</th><th>内訳</th></tr></thead>";
    const body = document.createElement("tbody");

    calculation.convertedAMeasurements.forEach((converted, pointIndex) => {
      const row = document.createElement("tr");
      const details = calculation.components.map((component) => {
        const measured = component.aMeasurements[pointIndex];
        return `${component.name} ${formatNumber(measured)}÷${formatNumber(component.managementConcentration)}=${formatNumber(measured / component.managementConcentration)}`;
      });
      row.innerHTML = `<td>A${pointIndex + 1}</td><td>${formatNumber(converted)}</td><td>${details.join(" ＋ ")}</td>`;
      body.append(row);
    });

    if (calculation.convertedBMeasurements.length) {
      calculation.convertedBMeasurements.forEach((converted, pointIndex) => {
        const row = document.createElement("tr");
        const details = calculation.components.map((component) => {
          const measured = component.bMeasurements[pointIndex];
          return `${component.name} ${formatNumber(measured)}÷${formatNumber(component.managementConcentration)}=${formatNumber(measured / component.managementConcentration)}`;
        });
        row.innerHTML = `<td>B${pointIndex + 1}</td><td>${formatNumber(converted)}</td><td>${details.join(" ＋ ")}</td>`;
        body.append(row);
      });
    }

    table.append(body);
    tableWrap.append(table);
    breakdown.append(tableWrap);
  };

  const setText = (selector, value) => {
    const element = root.querySelector(selector);
    if (element) element.textContent = value;
  };

  const showResult = (calculation) => {
    const bMaximum = calculation.bResult ? formatNumber(calculation.bResult.maximum) : "未実施";
    setText("#mixedOrganicResultTitle", calculation.detail.label);
    setText("#mixedOrganicResultPrimary", `管理区分：${calculation.detail.label}`);
    setText("#mixedOrganicResultSummary", calculation.detail.summary);
    setText("#mixedOrganicResultEa1", formatNumber(calculation.evaluationValues.firstEvaluationValue));
    setText("#mixedOrganicResultEa2", formatNumber(calculation.evaluationValues.secondEvaluationValue));
    setText("#mixedOrganicResultB", bMaximum);
    setText("#mixedOrganicResultGm", formatNumber(calculation.evaluationValues.geometricMean));
    setText("#mixedOrganicResultGsd", formatNumber(calculation.evaluationValues.geometricStandardDeviation));
    setText("#mixedOrganicResultPoints", `${calculation.convertedAMeasurements.length}点`);
    renderBreakdown(calculation);
    placeholder.hidden = true;
    result.hidden = false;
  };

  addButton.addEventListener("click", () => {
    if (componentsRoot.querySelectorAll("[data-mixed-organic-component]").length >= MAX_COMPONENTS) return;
    createComponentRow();
    resetResult();
  });

  measurementModeInputs.forEach((input) => input.addEventListener("change", updateBVisibility));

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearError();
    try {
      const components = readComponents();
      const ids = components.map((component) => component.id);
      if (new Set(ids).size !== ids.length) {
        throw new RangeError("同じ物質が重複しています。異なる2種類以上の溶剤を選んでください。");
      }
      const calculation = calculateMixedOrganicManagementClass({ components, includeB: includeB() });
      showResult(calculation);
      result.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } catch (caughtError) {
      resetResult();
      showError(caughtError instanceof Error ? caughtError.message : "入力内容を確認してください。");
    }
  });

  exampleButton?.addEventListener("click", () => {
    componentsRoot.replaceChildren();
    const toluene = createComponentRow("toluene");
    const xylene = createComponentRow("xylene");
    toluene.querySelector("[data-mixed-a]").value = "4, 5, 6, 5, 4";
    xylene.querySelector("[data-mixed-a]").value = "5, 7, 9, 8, 6";
    const aMode = root.querySelector("[name='mixedOrganicMeasurementMode'][value='a']");
    if (aMode) aMode.checked = true;
    updateBVisibility();
    clearError();
    resetResult();
  });

  resetButton?.addEventListener("click", () => {
    form.reset();
    componentsRoot.replaceChildren();
    createComponentRow("toluene");
    createComponentRow("xylene");
    updateBVisibility();
    clearError();
    resetResult();
  });

  createComponentRow("toluene");
  createComponentRow("xylene");
  updateBVisibility();
}

if (typeof document !== "undefined") {
  initializeMixedOrganicTool();
}
