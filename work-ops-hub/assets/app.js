const SCORE_WEIGHT = {
  coverage: 100,
  rtGapPenalty: 20,
  lowPenalty: 12,
  mediumPenalty: 4,
  uncertainPenalty: 8
};

function certaintyBadge(certainty) {
  return `<span class="badge badge-${certainty}">${certainty}</span>`;
}

function certaintyHint(records) {
  const hasLow = records.some((r) => r.certainty === 'low');
  const hasMedium = records.some((r) => r.certainty === 'medium');
  if (hasLow) return 'low含む（要注意）';
  if (hasMedium) return 'medium中心';
  return 'high中心';
}

function minRtGap(records) {
  const sorted = [...records].sort((a, b) => a.rt_min - b.rt_min);
  if (sorted.length < 2) return null;
  let minGap = Infinity;
  for (let i = 1; i < sorted.length; i += 1) {
    minGap = Math.min(minGap, sorted[i].rt_min - sorted[i - 1].rt_min);
  }
  return Number(minGap.toFixed(2));
}

function scoreCondition(records, selectedAnalytes) {
  const usable = records.filter((r) => r.analyte_normalized !== '名称未確定');
  const covered = selectedAnalytes.filter((a) => usable.some((r) => r.analyte_normalized === a));
  const coverage = covered.length;
  const gaps = minRtGap(usable);
  const lowCount = records.filter((r) => r.certainty === 'low').length;
  const mediumCount = records.filter((r) => r.certainty === 'medium').length;
  const uncertainCount = records.filter((r) => r.analyte_normalized === '名称未確定').length;

  const rtGapPenalty = gaps !== null && gaps < 0.35 ? (0.35 - gaps) * SCORE_WEIGHT.rtGapPenalty : 0;
  const certaintyPenalty = (lowCount * SCORE_WEIGHT.lowPenalty) + (mediumCount * SCORE_WEIGHT.mediumPenalty);
  const uncertainPenalty = uncertainCount * SCORE_WEIGHT.uncertainPenalty;

  const score =
    (coverage * SCORE_WEIGHT.coverage) -
    rtGapPenalty -
    certaintyPenalty -
    uncertainPenalty;

  return {
    score,
    coverage,
    minGap: gaps,
    certainty: certaintyHint(records),
    includesUncertain: uncertainCount > 0
  };
}

function renderTable(records) {
  const tbody = document.getElementById('rt-table-body');
  tbody.innerHTML = records
    .map((r) => {
      const lowWarn = r.certainty === 'low' ? '<span class="warn">⚠ 低確度</span>' : '';
      return `
      <tr class="${r.certainty === 'low' ? 'row-low' : ''}">
        <td>${r.temp_program_id}</td>
        <td>${r.rt_min}</td>
        <td>${r.analyte_normalized}</td>
        <td>${r.analyte_original}</td>
        <td>${certaintyBadge(r.certainty)}${lowWarn}</td>
        <td>${r.source}</td>
        <td>${r.note || ''}</td>
      </tr>`;
    })
    .join('');
}

function renderAnalyteFilters(records) {
  const host = document.getElementById('analyte-checkboxes');
  const analytes = [...new Set(records
    .map((r) => r.analyte_normalized)
    .filter((name) => name !== '名称未確定'))].sort();

  host.innerHTML = analytes.map((a, idx) => `
    <label class="chip">
      <input type="checkbox" value="${a}" ${idx < 4 ? 'checked' : ''} /> ${a}
    </label>
  `).join('');
}

function selectedAnalytes() {
  return [...document.querySelectorAll('#analyte-checkboxes input:checked')].map((n) => n.value);
}

function renderSuggestions(records) {
  const selected = selectedAnalytes();
  const byProgram = records.reduce((acc, r) => {
    acc[r.temp_program_id] ??= [];
    acc[r.temp_program_id].push(r);
    return acc;
  }, {});

  const ranked = Object.entries(byProgram)
    .map(([program, rows]) => ({ program, ...scoreCondition(rows, selected) }))
    .sort((a, b) => b.score - a.score);

  const host = document.getElementById('suggestions');
  host.innerHTML = ranked.map((item, idx) => {
    const uncertainText = item.includesUncertain ? '未確定データを含む' : '未確定データなし';
    return `
      <article class="suggestion">
        <strong>${idx + 1}. ${item.program}</strong>
        <div class="reason">カバー件数: ${item.coverage}件 / 最小RT差: ${item.minGap ?? '-'}分 / certainty目安: ${item.certainty}</div>
        <div class="reason">${uncertainText}</div>
      </article>
    `;
  }).join('');
}

async function init() {
  const rt = await fetch('./data/gc-rt-library.json').then((r) => r.json());
  const records = rt.records.filter((r) => r.machine_id === 'gc2014' && r.column_id === 'cbp');

  renderAnalyteFilters(records);
  renderTable(records);
  renderSuggestions(records);

  document.getElementById('run-suggest').addEventListener('click', () => {
    renderSuggestions(records);
  });
}

init();
