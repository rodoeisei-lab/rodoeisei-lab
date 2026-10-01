import { calculateProtectionFactor } from './exposure-calculations.mjs';
const byId = id => document.getElementById(id);
const form = byId('protectionFactorForm');
if (form) {
  const type = byId('protectionFactorType');
  const c = byId('protectionFactorC');
  const c0 = byId('protectionFactorC0');
  const q = byId('protectionFactorQ');
  const apf = byId('protectionFactorApf');
  const unit = byId('protectionFactorUnit');
  const result = byId('protectionFactorResult');
  const error = byId('protectionFactorError');
  const format = value => new Intl.NumberFormat('ja-JP', { maximumSignificantDigits: 6 }).format(value);
  const resetResult = () => {
    byId('protectionFactorResultTitle').textContent = '数値を入力してください';
    byId('protectionFactorResultPrimary').textContent = 'PFᵣ ＝ C ÷ C₀';
    byId('protectionFactorResultSummary').textContent = '指定防護係数は、丸め前の要求防護係数を上回る必要があります。';
    byId('protectionFactorResultDetails').hidden = true; error.hidden = true;
  };
  const syncType = () => {
    const fixed = ['lead','dust','mixed-organic','welding'].includes(type.value);
    byId('protectionFactorC0Field').hidden = fixed;
    byId('protectionFactorQField').hidden = type.value !== 'dust';
    byId('protectionFactorUnitField').hidden = fixed;
    c0.required = !fixed; q.required = type.value === 'dust';
    const mixed = type.value === 'mixed-organic';
    byId('protectionFactorCLabel').textContent = mixed ? '換算値 C' : type.value === 'welding' ? 'マンガン含有濃度の測定値の最大値 C（mg/m³）' : `採用する濃度 C（${fixed ? 'mg/m³' : unit.value}）`;
    byId('protectionFactorCHelp').textContent = mixed ? '各溶剤の濃度÷管理濃度を合計した換算値を入力します。' : type.value === 'welding' ? '金属アーク溶接等作業の法定測定に使用するマンガン含有濃度です。ヒューム全体の質量や任意のTWAを代入しません。' : '測定方法と規定に応じて、第一評価値・B/D測定値・身体装着型測定値等から採用する値を確認します。';
    byId('protectionFactorFixed').textContent = type.value === 'dust' ? '粉じん：C₀＝3.0/(1.19Q+1) mg/m³' : mixed ? '混合有機溶剤：C₀＝1（換算値）' : type.value === 'welding' ? '溶接ヒューム：C₀＝0.05 mg/m³（マンガンとして）。第3管理区分の計算とは別の適用場面です。' : type.value === 'lead' ? '鉛：C₀＝0.05 mg/m³' : `Cと管理濃度C₀は、どちらも${unit.value}で入力してください。`;
    resetResult();
  };
  form.addEventListener('submit', event => {
    event.preventDefault(); resetResult();
    try {
      const values = calculateProtectionFactor({ type: type.value, concentration: c.value, baseline: c0.value, silica: q.value, assignedFactor: apf.value });
      const label = type.options[type.selectedIndex].textContent.trim();
      const concentrationUnit = type.value === 'mixed-organic' ? '（換算値）' : ['lead','dust','welding'].includes(type.value) ? ' mg/m³' : ` ${unit.value}`;
      byId('protectionFactorResultTitle').textContent = `${label}の要求防護係数`;
      byId('protectionFactorResultPrimary').textContent = `PFᵣ ＝ ${format(values.pf)}`;
      byId('protectionFactorResultSummary').textContent = '表示は6有効桁です。性能比較は丸め前の比で行います。数値条件に加えて対象物質、製品の種類・使用条件、フィットを確認してください。';
      byId('protectionFactorResultC').textContent = `${c.value}${concentrationUnit}`;
      byId('protectionFactorResultC0').textContent = `${format(values.baseline)}${concentrationUnit}`;
      byId('protectionFactorResultPf').textContent = values.exactThreshold;
      byId('protectionFactorResultCondition').textContent = `指定防護係数 ＞ ${values.exactThreshold}`;
      byId('protectionFactorResultApf').textContent = values.comparison === null ? '指定防護係数を入力すると、丸め前の値で比較します。' : values.comparison === 'above' ? `指定防護係数${format(values.assignedFactor)}：数値条件を満たします。製品適合性等の確認が必要です。` : values.comparison === 'equal' ? `指定防護係数${format(values.assignedFactor)}：要求防護係数と同じため「上回る」条件を満たしません。` : `指定防護係数${format(values.assignedFactor)}：要求防護係数を下回り、数値条件を満たしません。`;
      byId('protectionFactorResultDetails').hidden = false;
      result.focus({ preventScroll: true });
    } catch (failure) { error.textContent = failure.message; error.hidden = false; }
  });
  form.addEventListener('input', resetResult);
  unit.addEventListener('change', syncType);
  type.addEventListener('change', () => { c.value = ''; c0.value = ''; q.value = ''; apf.value = ''; syncType(); });
  byId('protectionFactorExample').addEventListener('click', () => {
    if (type.value === 'lead' || type.value === 'welding') { c.value = '0.3'; apf.value = '10'; }
    else if (type.value === 'dust') { c.value = '0.6'; q.value = '10'; apf.value = '10'; }
    else if (type.value === 'mixed-organic') { c.value = '2.4'; apf.value = '10'; }
    else { c.value = '2.5'; c0.value = '0.5'; apf.value = '10'; }
    form.requestSubmit();
  });
  byId('protectionFactorReset').addEventListener('click', () => { form.reset(); syncType(); c.focus(); });
  syncType();
}
