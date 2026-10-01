// Pure calculation functions shared by the UI and boundary-value checks.
export function numericInput(raw, label, allowZero = false) {
  let text = String(raw ?? '').trim();
  if (text.length > 80) throw new Error(`${label}の桁数が大きすぎます。`);
  if (text.includes(',')) {
    if (!/^[+]?[0-9]{1,3}(?:,[0-9]{3})+(?:\.[0-9]+)?$/.test(text)) throw new Error(`${label}の桁区切りを確認してください。`);
    text = text.replaceAll(',', '');
  }
  if (!/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(text)) throw new Error(`${label}に数値を入力してください。`);
  const value = Number(text);
  if (!Number.isFinite(value) || (allowZero ? value < 0 : value <= 0)) throw new Error(`${label}は${allowZero ? '0以上' : '0より大きい'}の有限な数値で入力してください。`);
  return { value, text };
}

export function calculateTwa(entries, { coverageConfirmed = false, limit = '' } = {}) {
  if (!Array.isArray(entries) || !entries.length) throw new Error('濃度と時間を1区間以上入力してください。');
  let totalHours = 0;
  let dose = 0;
  for (const entry of entries) {
    const concentration = numericInput(entry.concentration, '濃度', true).value;
    const duration = numericInput(entry.duration, 'ばく露時間').value;
    if (!['h', 'min'].includes(entry.durationUnit)) throw new Error('時間単位を確認してください。');
    const hours = entry.durationUnit === 'min' ? duration / 60 : duration;
    totalHours += hours;
    dose += concentration * hours;
  }
  if (!Number.isFinite(totalHours) || totalHours <= 0 || totalHours > 24) throw new Error('入力時間の合計は0より大きく24時間以下にしてください。');
  if (!Number.isFinite(dose)) throw new Error('計算できる範囲を超えています。濃度と時間を確認してください。');
  const exposureLimit = String(limit ?? '').trim() ? numericInput(limit, '比較するばく露限度').value : null;
  const observedTwa = dose / totalHours;
  const eightHourTwa = coverageConfirmed === true ? dose / 8 : null;
  const ratio = eightHourTwa !== null && exposureLimit !== null ? eightHourTwa / exposureLimit : null;
  if (!Number.isFinite(observedTwa) || (ratio !== null && !Number.isFinite(ratio))) throw new Error('計算できる範囲を超えています。入力値を確認してください。');
  return { totalHours, dose, observedTwa, eightHourTwa, ratio };
}

// Decimal inputs are compared as exact fractions. 0.3/0.05 must be exactly 6,
// so a designated factor of 6 cannot pass a strict "greater than" condition.
function fraction(text) {
  const [mantissa, exponentText = '0'] = text.toLowerCase().split('e');
  const exponent = Number(exponentText);
  if (Math.abs(exponent) > 300) throw new Error('数値の指数が大きすぎます。');
  const decimals = (mantissa.split('.')[1] || '').length;
  const numerator = BigInt(mantissa.replace('.', '').replace(/^\+/, ''));
  const shift = exponent - decimals;
  return shift >= 0 ? { n: numerator * 10n ** BigInt(shift), d: 1n } : { n: numerator, d: 10n ** BigInt(-shift) };
}
function gcd(a, b) { while (b !== 0n) { [a, b] = [b, a % b]; } return a; }

export function calculateProtectionFactor({ type, concentration, baseline = '', silica = '', assignedFactor = '' }) {
  if (!['organic', 'specified', 'lead', 'dust', 'mixed-organic', 'welding'].includes(type)) throw new Error('対象を選択してください。');
  const c = numericInput(concentration, '採用する濃度 C', true);
  let c0;
  let c0Fraction;
  if (type === 'lead' || type === 'welding') { c0 = 0.05; c0Fraction = { n: 1n, d: 20n }; }
  else if (type === 'mixed-organic') { c0 = 1; c0Fraction = { n: 1n, d: 1n }; }
  else if (type === 'dust') {
    const q = numericInput(silica, '遊離けい酸含有率 Q', true);
    if (q.value > 100) throw new Error('遊離けい酸含有率 Q は0～100%で入力してください。');
    const qFraction = fraction(q.text);
    c0 = 3 / (1.19 * q.value + 1);
    c0Fraction = { n: 300n * qFraction.d, d: 119n * qFraction.n + 100n * qFraction.d };
  } else {
    const input = numericInput(baseline, '管理濃度 C₀'); c0 = input.value; c0Fraction = fraction(input.text);
  }
  const pf = c.value / c0;
  if (!Number.isFinite(pf)) throw new Error('計算できる範囲を超えています。入力値を確認してください。');
  const cFraction = fraction(c.text);
  let n = cFraction.n * c0Fraction.d;
  let d = cFraction.d * c0Fraction.n;
  const divisor = gcd(n, d); n /= divisor; d /= divisor;
  let comparison = null;
  let assigned = null;
  if (String(assignedFactor ?? '').trim()) {
    const apf = numericInput(assignedFactor, '指定防護係数'); assigned = apf.value;
    const apfFraction = fraction(apf.text);
    const difference = apfFraction.n * d - n * apfFraction.d;
    comparison = difference > 0n ? 'above' : difference === 0n ? 'equal' : 'below';
  }
  return { concentration: c.value, baseline: c0, pf, exactThreshold: d === 1n ? String(n) : `${n} / ${d}`, assignedFactor: assigned, comparison };
}
