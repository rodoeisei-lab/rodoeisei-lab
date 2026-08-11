(() => {
  const storageKey = 'rodoeisei:last-opened-theme';
  const mediumLabels = { site: 'サイト記事', youtube: 'YouTube', note: 'note' };

  const storageAvailable = () => {
    try {
      const key = `${storageKey}:test`;
      localStorage.setItem(key, '1');
      localStorage.removeItem(key);
      return true;
    } catch (_) {
      return false;
    }
  };
  const canStore = storageAvailable();

  document.addEventListener('click', (event) => {
    const link = event.target.closest('[data-learning-link]');
    if (!link || !canStore) return;
    localStorage.setItem(storageKey, JSON.stringify({
      slug: link.dataset.slug,
      title: link.dataset.title,
      medium: link.dataset.medium,
      openedAt: new Date().toISOString(),
    }));
  });

  const root = document.querySelector('[data-learning-compass]');
  const dataNode = document.querySelector('#learning-library-data');
  if (!root || !dataNode) return;

  let library;
  try { library = JSON.parse(dataNode.textContent); } catch (_) { return; }
  const form = root.querySelector('form');
  const result = root.querySelector('.learning-compass__result');
  const history = root.querySelector('[data-learning-history]');
  const escapeHtml = (value) => String(value || '').replace(/[&<>"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[character]));

  const getFormat = (purpose, time, choice, item) => {
    if (choice !== 'auto') return choice;
    if (purpose === 'practice' || purpose === 'qualification') return 'site';
    if (time === '3') return 'youtube';
    return item.recommended_format || 'youtube';
  };
  const reasonFor = (purpose, format) => {
    if (purpose === 'qualification') return '資格学習の要点をサイト記事で確認し、YouTubeを復習にも使えるテーマです。';
    if (purpose === 'practice') return '実務で判断するときに、要点と一次情報への手がかりを確認しやすいテーマです。';
    if (format === 'note') return '文章を追いながら、順番に全体像を理解しやすいテーマです。';
    return '短い時間で、まずテーマの全体像をつかみやすい内容です。';
  };
  const linkHtml = (item, medium, className = '') => {
    const media = item[medium];
    if (!media || !media.url) return '';
    const external = medium === 'site' ? '' : ' target="_blank" rel="noopener noreferrer"';
    return `<a class="${className}" data-learning-link data-slug="${escapeHtml(item.slug)}" data-title="${escapeHtml(item.title)}" data-medium="${medium}" href="${escapeHtml(media.url)}"${external}>${medium === 'site' ? 'サイトで読む' : medium === 'youtube' ? 'YouTubeで見る' : 'noteで読む'}</a>`;
  };

  const render = () => {
    const values = new FormData(form);
    const purpose = values.get('purpose');
    const time = values.get('time');
    const choice = values.get('format');
    const candidates = library.filter((item) => Array.isArray(item.purposes) && item.purposes.includes(purpose));
    if (!candidates.length) {
      result.innerHTML = '<div class="compass-empty"><h3>条件に一致するテーマはまだありません</h3><p>内容を確認できたテーマから順次追加しています。</p><a href="/videos/">動画・記事ライブラリを見る</a></div>';
      return;
    }
    candidates.sort((a, b) => {
      const aFormat = getFormat(purpose, time, choice, a);
      const bFormat = getFormat(purpose, time, choice, b);
      const target = time === 'deep' ? 30 : Number(time);
      const aMinutes = Number(a.estimated_minutes?.[aFormat] || 999);
      const bMinutes = Number(b.estimated_minutes?.[bFormat] || 999);
      return Math.abs(aMinutes - target) - Math.abs(bMinutes - target);
    });
    const item = candidates[0];
    const format = getFormat(purpose, time, choice, item);
    const minutes = item.estimated_minutes?.[format];
    const related = candidates.slice(1, 3).map((other) => `<li><a data-learning-link data-slug="${escapeHtml(other.slug)}" data-title="${escapeHtml(other.title)}" data-medium="${format}" href="${escapeHtml(other[format]?.url || other.site?.url)}">${escapeHtml(other.title)}</a></li>`).join('');
    result.innerHTML = `<article class="compass-result-card"><p class="compass-result-card__eyebrow">おすすめ結果</p><p class="compass-result-card__reason"><strong>おすすめ理由</strong>${escapeHtml(reasonFor(purpose, format))}</p><p class="compass-result-card__category">${escapeHtml(item.category)} · ${escapeHtml(item.level === 'beginner' ? '入門' : '中級')}</p><h3>${escapeHtml(item.title)}</h3><p class="compass-result-card__time">所要時間の目安：<strong>${escapeHtml(minutes)}分</strong>（${mediumLabels[format]}）</p><p>${escapeHtml(item.summary)}</p><div class="library-card__actions">${linkHtml(item, 'site', format === 'site' ? 'library-card__primary' : '')}${linkHtml(item, 'youtube', format === 'youtube' ? 'library-card__primary' : '')}${linkHtml(item, 'note', format === 'note' ? 'library-card__primary' : '')}</div>${related ? `<div class="compass-related"><strong>関連候補</strong><ul>${related}</ul></div>` : ''}<button class="compass-reset" type="button">条件を選び直す</button></article>`;
    result.querySelector('.compass-reset').addEventListener('click', () => { form.reset(); render(); form.querySelector('input').focus(); });
  };

  const renderHistory = () => {
    if (!canStore) return;
    let saved;
    try { saved = JSON.parse(localStorage.getItem(storageKey)); } catch (_) { return; }
    const item = saved && library.find((entry) => entry.slug === saved.slug);
    const media = item && item[saved.medium];
    if (!item || !media?.url) return;
    history.hidden = false;
    history.innerHTML = `<p class="section-kicker">前回開いたテーマ</p><h3>${escapeHtml(saved.title)}</h3><p>最後に開いたページ：${escapeHtml(mediumLabels[saved.medium])}</p><div><a data-learning-link data-slug="${escapeHtml(saved.slug)}" data-title="${escapeHtml(saved.title)}" data-medium="${escapeHtml(saved.medium)}" href="${escapeHtml(media.url)}">もう一度確認する</a><button type="button">履歴を消す</button></div>`;
    history.querySelector('button').addEventListener('click', () => { localStorage.removeItem(storageKey); history.hidden = true; history.replaceChildren(); });
  };

  form.addEventListener('change', render);
  render();
  renderHistory();
})();
