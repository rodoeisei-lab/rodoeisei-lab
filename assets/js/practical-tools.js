(() => {
  "use strict";

  const numberFormatter = new Intl.NumberFormat("ja-JP", { maximumSignificantDigits: 6 });

  function parsePositive(value) {
    const normalized = String(value ?? "").trim().replace(/,/g, "");
    if (!normalized) return null;
    const parsed = Number(normalized);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }

  function parseNonNegative(value) {
    const normalized = String(value ?? "").trim().replace(/,/g, "");
    if (!normalized) return null;
    const parsed = Number(normalized);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
  }

  function formatNumber(value) {
    if (!Number.isFinite(value)) return "—";
    if (value !== 0 && (Math.abs(value) >= 1e6 || Math.abs(value) < 1e-4)) {
      return value.toExponential(4);
    }
    return numberFormatter.format(value);
  }

  function massToMg(value, unit) {
    return unit === "ug" ? value / 1000 : value;
  }

  function volumeToM3(value, unit) {
    return unit === "L" ? value / 1000 : value;
  }

  function concentrationToMgM3(value, unit) {
    return unit === "ugm3" ? value / 1000 : value;
  }

  function showError(element, message) {
    if (!element) return;
    element.textContent = message;
    element.hidden = false;
  }

  function clearError(element) {
    if (!element) return;
    element.hidden = true;
    element.textContent = "";
  }

  function initAirSamplingCalculator(root) {
    const form = root.querySelector("#airSamplingForm");
    const error = root.querySelector("#airSamplingError");
    const result = root.querySelector("#airSamplingResult");
    const placeholder = root.querySelector("#airSamplingPlaceholder");
    const resultTitle = root.querySelector("#airSamplingResultTitle");
    const resultPrimary = root.querySelector("#airSamplingResultPrimary");
    const resultSummary = root.querySelector("#airSamplingResultSummary");
    const resultDetails = root.querySelector("#airSamplingResultDetails");
    const resultFormula = root.querySelector("#airSamplingResultFormula");
    const example = root.querySelector("#airSamplingExample");
    const reset = root.querySelector("#airSamplingReset");
    const modeInputs = [...root.querySelectorAll('input[name="airSamplingMode"]')];
    const panels = [...root.querySelectorAll("[data-air-panel]")];

    if (!form) return;

    function currentMode() {
      return modeInputs.find((input) => input.checked)?.value || "volume";
    }

    function syncPanels() {
      const mode = currentMode();
      panels.forEach((panel) => {
        panel.hidden = panel.dataset.airPanel !== mode;
      });
      clearError(error);
    }

    function renderResult({ title, primary, summary, details, formula }) {
      resultTitle.textContent = title;
      resultPrimary.textContent = primary;
      resultSummary.textContent = summary;
      resultDetails.innerHTML = details.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join("");
      resultFormula.textContent = formula;
      placeholder.hidden = true;
      result.hidden = false;
      result.focus({ preventScroll: true });
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      clearError(error);
      const mode = currentMode();

      if (mode === "volume") {
        const flow = parsePositive(root.querySelector("#airSamplingFlow")?.value);
        const duration = parsePositive(root.querySelector("#airSamplingDuration")?.value);
        if (!flow || !duration) {
          showError(error, "流量と採取時間に、0より大きい数値を入力してください。");
          return;
        }
        const liters = flow * duration;
        const cubicMeters = liters / 1000;
        renderResult({
          title: "採気量",
          primary: `${formatNumber(liters)} L`,
          summary: `採取空気量は ${formatNumber(cubicMeters)} m³ です。`,
          details: [
            ["流量", `${formatNumber(flow)} L/min`],
            ["採取時間", `${formatNumber(duration)} min`],
            ["m³換算", `${formatNumber(cubicMeters)} m³`],
          ],
          formula: `採気量 = 流量 × 時間 = ${formatNumber(flow)} L/min × ${formatNumber(duration)} min = ${formatNumber(liters)} L`,
        });
        return;
      }

      if (mode === "concentration") {
        const massValue = parsePositive(root.querySelector("#airSamplingMass")?.value);
        const massUnit = root.querySelector("#airSamplingMassUnit")?.value || "mg";
        const volumeValue = parsePositive(root.querySelector("#airSamplingVolume")?.value);
        const volumeUnit = root.querySelector("#airSamplingVolumeUnit")?.value || "L";
        if (!massValue || !volumeValue) {
          showError(error, "捕集量と採気量に、0より大きい数値を入力してください。");
          return;
        }
        const massMg = massToMg(massValue, massUnit);
        const volumeM3 = volumeToM3(volumeValue, volumeUnit);
        const concentration = massMg / volumeM3;
        renderResult({
          title: "気中濃度",
          primary: `${formatNumber(concentration)} mg/m³`,
          summary: `µg/m³では ${formatNumber(concentration * 1000)} µg/m³ です。`,
          details: [
            ["捕集量", `${formatNumber(massValue)} ${massUnit === "ug" ? "µg" : "mg"}`],
            ["採気量", `${formatNumber(volumeValue)} ${volumeUnit === "L" ? "L" : "m³"}`],
            ["換算後の質量", `${formatNumber(massMg)} mg`],
            ["換算後の採気量", `${formatNumber(volumeM3)} m³`],
          ],
          formula: `気中濃度 = 捕集量 ÷ 採気量 = ${formatNumber(massMg)} mg ÷ ${formatNumber(volumeM3)} m³ = ${formatNumber(concentration)} mg/m³`,
        });
        return;
      }

      const loqValue = parsePositive(root.querySelector("#airSamplingLoq")?.value);
      const loqUnit = root.querySelector("#airSamplingLoqUnit")?.value || "ug";
      const targetValue = parsePositive(root.querySelector("#airSamplingTarget")?.value);
      const targetUnit = root.querySelector("#airSamplingTargetUnit")?.value || "mgm3";
      const flow = parsePositive(root.querySelector("#airSamplingRequiredFlow")?.value);
      if (!loqValue || !targetValue || !flow) {
        showError(error, "分析下限、目標気中濃度、採取流量に、0より大きい数値を入力してください。");
        return;
      }
      const loqMg = massToMg(loqValue, loqUnit);
      const targetMgM3 = concentrationToMgM3(targetValue, targetUnit);
      const requiredM3 = loqMg / targetMgM3;
      const requiredLiters = requiredM3 * 1000;
      const minutes = requiredLiters / flow;
      const hours = minutes / 60;
      renderResult({
        title: "必要採取時間",
        primary: `${formatNumber(minutes)} min`,
        summary: `必要採気量は ${formatNumber(requiredLiters)} L（${formatNumber(requiredM3)} m³）、時間換算では ${formatNumber(hours)} h です。`,
        details: [
          ["分析下限（質量）", `${formatNumber(loqValue)} ${loqUnit === "ug" ? "µg" : "mg"}`],
          ["目標気中濃度", `${formatNumber(targetValue)} ${targetUnit === "ugm3" ? "µg/m³" : "mg/m³"}`],
          ["採取流量", `${formatNumber(flow)} L/min`],
          ["必要採気量", `${formatNumber(requiredLiters)} L`],
        ],
        formula: "必要採気量 = 分析下限 ÷ 目標気中濃度、必要時間 = 必要採気量 ÷ 流量。前処理回収率、希釈、ブランク等は別途反映してください。",
      });
    });

    example?.addEventListener("click", () => {
      const mode = currentMode();
      if (mode === "volume") {
        root.querySelector("#airSamplingFlow").value = "10.9";
        root.querySelector("#airSamplingDuration").value = "10";
      } else if (mode === "concentration") {
        root.querySelector("#airSamplingMass").value = "50";
        root.querySelector("#airSamplingMassUnit").value = "ug";
        root.querySelector("#airSamplingVolume").value = "100";
        root.querySelector("#airSamplingVolumeUnit").value = "L";
      } else {
        root.querySelector("#airSamplingLoq").value = "10";
        root.querySelector("#airSamplingLoqUnit").value = "ug";
        root.querySelector("#airSamplingTarget").value = "0.1";
        root.querySelector("#airSamplingTargetUnit").value = "mgm3";
        root.querySelector("#airSamplingRequiredFlow").value = "1";
      }
      form.requestSubmit();
    });

    reset?.addEventListener("click", () => {
      form.reset();
      syncPanels();
      clearError(error);
      result.hidden = true;
      placeholder.hidden = false;
    });

    modeInputs.forEach((input) => input.addEventListener("change", syncPanels));
    syncPanels();
  }

  function initTwaCalculator(root) {
    const form = root.querySelector("#twaForm");
    const rowsContainer = root.querySelector("#twaRows");
    const addButton = root.querySelector("#twaAddRow");
    const exampleButton = root.querySelector("#twaExample");
    const resetButton = root.querySelector("#twaReset");
    const error = root.querySelector("#twaError");
    const result = root.querySelector("#twaResult");
    const placeholder = root.querySelector("#twaPlaceholder");
    const unitInput = root.querySelector("#twaUnit");
    const limitInput = root.querySelector("#twaLimit");
    let rowId = 0;

    if (!form || !rowsContainer) return;

    function addRow(concentration = "", duration = "", durationUnit = "h") {
      if (rowsContainer.children.length >= 12) return;
      rowId += 1;
      const row = document.createElement("div");
      row.className = "twa-row";
      row.dataset.twaRow = "";
      row.innerHTML = `
        <span class="twa-row__number" aria-hidden="true"></span>
        <label class="practical-tool__field">
          <span>濃度</span>
          <input type="text" inputmode="decimal" autocomplete="off" data-twa-concentration aria-label="区間${rowId}の濃度">
        </label>
        <label class="practical-tool__field">
          <span>ばく露時間</span>
          <span class="twa-row__duration">
            <input type="text" inputmode="decimal" autocomplete="off" data-twa-duration aria-label="区間${rowId}のばく露時間">
            <select data-twa-duration-unit aria-label="区間${rowId}の時間単位">
              <option value="h">時間</option>
              <option value="min">分</option>
            </select>
          </span>
        </label>
        <button class="twa-row__remove" type="button" data-twa-remove aria-label="この区間を削除">×</button>`;
      row.querySelector("[data-twa-concentration]").value = concentration;
      row.querySelector("[data-twa-duration]").value = duration;
      row.querySelector("[data-twa-duration-unit]").value = durationUnit;
      rowsContainer.appendChild(row);
      renumberRows();
    }

    function renumberRows() {
      const rows = [...rowsContainer.querySelectorAll("[data-twa-row]")];
      rows.forEach((row, index) => {
        row.querySelector(".twa-row__number").textContent = String(index + 1);
        const remove = row.querySelector("[data-twa-remove]");
        remove.disabled = rows.length <= 1;
      });
    }

    function resetRows() {
      rowsContainer.innerHTML = "";
      rowId = 0;
      addRow();
      addRow();
      addRow();
    }

    addButton?.addEventListener("click", () => addRow());
    rowsContainer.addEventListener("click", (event) => {
      const button = event.target.closest("[data-twa-remove]");
      if (!button) return;
      const row = button.closest("[data-twa-row]");
      if (row && rowsContainer.children.length > 1) {
        row.remove();
        renumberRows();
      }
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      clearError(error);
      const entries = [];
      let invalid = false;

      [...rowsContainer.querySelectorAll("[data-twa-row]")].forEach((row) => {
        const concentrationRaw = row.querySelector("[data-twa-concentration]").value.trim();
        const durationRaw = row.querySelector("[data-twa-duration]").value.trim();
        if (!concentrationRaw && !durationRaw) return;
        const concentration = parseNonNegative(concentrationRaw);
        const durationValue = parsePositive(durationRaw);
        const durationUnit = row.querySelector("[data-twa-duration-unit]").value;
        if (concentration === null || !durationValue) {
          invalid = true;
          return;
        }
        const hours = durationUnit === "min" ? durationValue / 60 : durationValue;
        entries.push({ concentration, hours });
      });

      if (invalid || entries.length === 0) {
        showError(error, "濃度は0以上、ばく露時間は0より大きい数値で、区間ごとに両方入力してください。空欄の区間は無視されます。");
        return;
      }

      const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);
      if (totalHours > 24) {
        showError(error, "入力したばく露時間の合計が24時間を超えています。時間単位を確認してください。");
        return;
      }
      const dose = entries.reduce((sum, entry) => sum + (entry.concentration * entry.hours), 0);
      const observedTwa = dose / totalHours;
      const eightHourTwa = dose / 8;
      const unit = unitInput.value.trim() || "入力単位";
      const limit = parsePositive(limitInput.value);
      const ratio = limit ? eightHourTwa / limit : null;

      root.querySelector("#twaResultPrimary").textContent = `${formatNumber(eightHourTwa)} ${unit}`;
      root.querySelector("#twaObserved").textContent = `${formatNumber(observedTwa)} ${unit}`;
      root.querySelector("#twaTotalHours").textContent = `${formatNumber(totalHours)} h`;
      root.querySelector("#twaDose").textContent = `${formatNumber(dose)} ${unit}・h`;
      root.querySelector("#twaRatio").textContent = ratio ? `${formatNumber(ratio * 100)} %` : "ばく露限度未入力";
      const warning = totalHours > 8
        ? "入力時間が8時間を超えています。ここに表示する8時間TWAは単純な8時間換算参考値です。長時間勤務に対する限度値の補正方法は別途確認してください。"
        : "未入力時間をばく露0として8時間に換算しています。休憩中もばく露がある場合は、その区間も入力してください。";
      root.querySelector("#twaResultSummary").textContent = warning;
      root.querySelector("#twaResultFormula").textContent = `8時間TWA = Σ（濃度 × 時間）÷ 8 = ${formatNumber(dose)} ÷ 8 = ${formatNumber(eightHourTwa)} ${unit}`;
      placeholder.hidden = true;
      result.hidden = false;
      result.focus({ preventScroll: true });
    });

    exampleButton?.addEventListener("click", () => {
      rowsContainer.innerHTML = "";
      rowId = 0;
      addRow("20", "2", "h");
      addRow("5", "3", "h");
      addRow("1", "3", "h");
      unitInput.value = "ppm";
      limitInput.value = "10";
      form.requestSubmit();
    });

    resetButton?.addEventListener("click", () => {
      form.reset();
      resetRows();
      clearError(error);
      result.hidden = true;
      placeholder.hidden = false;
    });

    resetRows();
  }

  function initRecordReference(root) {
    const searchInput = root.querySelector("#recordSearch");
    const categorySelect = root.querySelector("#recordCategory");
    const rows = [...root.querySelectorAll("[data-record-row]")];
    const summary = root.querySelector("#recordSummary");
    const empty = root.querySelector("#recordEmpty");

    if (!searchInput || !categorySelect) return;

    function normalize(value) {
      return String(value || "").toLocaleLowerCase("ja-JP").replace(/\s+/g, "");
    }

    function filterRows() {
      const query = normalize(searchInput.value);
      const category = categorySelect.value;
      let visible = 0;
      rows.forEach((row) => {
        const text = normalize(row.dataset.search);
        const rowCategory = row.dataset.category || "";
        const matchesQuery = !query || text.includes(query);
        const matchesCategory = category === "all" || rowCategory === category;
        row.hidden = !(matchesQuery && matchesCategory);
        if (!row.hidden) visible += 1;
      });
      summary.textContent = `${visible}件を表示しています。`;
      empty.hidden = visible !== 0;
    }

    searchInput.addEventListener("input", filterRows);
    categorySelect.addEventListener("change", filterRows);
    filterRows();
  }

  document.querySelectorAll("[data-air-sampling-calculator]").forEach(initAirSamplingCalculator);
  document.querySelectorAll("[data-twa-calculator]").forEach(initTwaCalculator);
  document.querySelectorAll("[data-record-reference]").forEach(initRecordReference);
})();
