const form = document.getElementById("protectionFactorForm");
const typeSelect = document.getElementById("protectionFactorType");
const cInput = document.getElementById("protectionFactorC");
const c0Field = document.getElementById("protectionFactorC0Field");
const c0Input = document.getElementById("protectionFactorC0");
const qField = document.getElementById("protectionFactorQField");
const qInput = document.getElementById("protectionFactorQ");
const cLabel = document.getElementById("protectionFactorCLabel");
const cHelp = document.getElementById("protectionFactorCHelp");
const fixedText = document.getElementById("protectionFactorFixed");
const errorBox = document.getElementById("protectionFactorError");
const exampleButton = document.getElementById("protectionFactorExample");
const resetButton = document.getElementById("protectionFactorReset");
const result = document.getElementById("protectionFactorResult");
const resultTitle = document.getElementById("protectionFactorResultTitle");
const resultPrimary = document.getElementById("protectionFactorResultPrimary");
const resultSummary = document.getElementById("protectionFactorResultSummary");
const resultDetails = document.getElementById("protectionFactorResultDetails");
const resultC = document.getElementById("protectionFactorResultC");
const resultC0 = document.getElementById("protectionFactorResultC0");
const resultPf = document.getElementById("protectionFactorResultPf");
const resultCondition = document.getElementById("protectionFactorResultCondition");

const elements = [form, typeSelect, cInput, c0Field, c0Input, qField, qInput, cLabel, cHelp, fixedText, errorBox, exampleButton, resetButton, result, resultTitle, resultPrimary, resultSummary, resultDetails, resultC, resultC0, resultPf, resultCondition];

if (elements.every(Boolean)) {
  const formatNumber = (value, digits = 4) => {
    if (!Number.isFinite(value)) return "－";
    return new Intl.NumberFormat("ja-JP", { maximumFractionDigits: digits }).format(value);
  };

  const resetResult = () => {
    resultTitle.textContent = "数値を入力してください";
    resultPrimary.textContent = "PFᵣ ＝ C ÷ C₀";
    resultSummary.textContent = "指定防護係数は、計算した要求防護係数を上回る必要があります。";
    resultDetails.hidden = true;
    errorBox.hidden = true;
  };

  const syncType = () => {
    const type = typeSelect.value;
    c0Field.hidden = type === "lead" || type === "dust" || type === "mixed-organic";
    qField.hidden = type !== "dust";
    c0Input.required = type === "organic" || type === "specified";
    qInput.required = type === "dust";

    cLabel.textContent = type === "mixed-organic" ? "換算値 C" : "採用する濃度 C";
    cHelp.textContent = type === "mixed-organic"
      ? "各溶剤の濃度÷管理濃度を合計した換算値を入力します。"
      : "第一評価値、B/D測定値、身体装着型測定の最大値等から、規定に従い採用する値を入力します。";

    if (type === "lead") fixedText.textContent = "鉛：C₀＝0.05 mg/m³ を使用します。";
    else if (type === "dust") fixedText.textContent = "粉じん：遊離けい酸含有率 Q から C₀＝3.0/(1.19Q+1) mg/m³ を計算します。";
    else if (type === "mixed-organic") fixedText.textContent = "混合有機溶剤：管理濃度に相当する値 C₀＝1 を使用します。";
    else fixedText.textContent = "C と C₀ は同じ濃度単位で入力してください。";

    errorBox.hidden = true;
  };

  const getC0 = () => {
    const type = typeSelect.value;
    if (type === "lead") return { value: 0.05, label: "0.05 mg/m³" };
    if (type === "mixed-organic") return { value: 1, label: "1（換算値）" };
    if (type === "dust") {
      const q = Number(qInput.value);
      if (!Number.isFinite(q) || q < 0 || q > 100) {
        throw new Error("遊離けい酸含有率 Q は0～100%で入力してください。");
      }
      const c0 = 3 / (1.19 * q + 1);
      return { value: c0, label: `${formatNumber(c0, 5)} mg/m³（Q=${formatNumber(q, 3)}%）` };
    }
    const c0 = Number(c0Input.value);
    if (!Number.isFinite(c0) || c0 <= 0) {
      throw new Error("管理濃度 C₀ は0より大きい値を入力してください。");
    }
    return { value: c0, label: formatNumber(c0, 6) };
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    errorBox.hidden = true;

    try {
      const c = Number(cInput.value);
      if (!Number.isFinite(c) || c < 0) throw new Error("採用する濃度 C は0以上の数値で入力してください。");

      const c0 = getC0();
      const pf = c / c0.value;
      if (!Number.isFinite(pf)) throw new Error("入力値を確認してください。");

      const typeLabel = typeSelect.options[typeSelect.selectedIndex].textContent.trim();
      resultTitle.textContent = `${typeLabel}の要求防護係数`;
      resultPrimary.textContent = `PFᵣ ＝ ${formatNumber(pf, 4)}`;
      resultSummary.textContent = `指定防護係数が ${formatNumber(pf, 4)} を上回る呼吸用保護具を確認します。対象物質・マスクの種類・吸収缶やフィルタ・フィット等も別途確認してください。`;
      resultC.textContent = typeSelect.value === "mixed-organic" ? `${formatNumber(c, 6)}（換算値）` : formatNumber(c, 6);
      resultC0.textContent = c0.label;
      resultPf.textContent = formatNumber(pf, 6);
      resultCondition.textContent = `指定防護係数 ＞ ${formatNumber(pf, 4)}`;
      resultDetails.hidden = false;
      result.focus({ preventScroll: true });
      result.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } catch (error) {
      errorBox.textContent = error instanceof Error ? error.message : "入力値を確認してください。";
      errorBox.hidden = false;
    }
  });

  exampleButton.addEventListener("click", () => {
    const type = typeSelect.value;
    if (type === "lead") cInput.value = "0.15";
    else if (type === "dust") {
      cInput.value = "0.6";
      qInput.value = "10";
    } else if (type === "mixed-organic") cInput.value = "2.4";
    else {
      cInput.value = "2.5";
      c0Input.value = "0.5";
    }
    errorBox.hidden = true;
  });

  resetButton.addEventListener("click", () => {
    form.reset();
    syncType();
    resetResult();
    cInput.focus();
  });

  typeSelect.addEventListener("change", () => {
    cInput.value = "";
    c0Input.value = "";
    qInput.value = "";
    syncType();
    resetResult();
  });

  syncType();
  resetResult();
}
