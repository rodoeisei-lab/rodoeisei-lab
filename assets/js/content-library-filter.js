(() => {
  const root = document.querySelector('[data-library-filter]');
  const cards = [...document.querySelectorAll('[data-library-results] [data-library-card]')];
  const countNode = document.querySelector('[data-library-count]');
  const emptyNode = document.querySelector('[data-library-empty]');
  if (!root || !cards.length || !countNode) return;

  const query = root.querySelector('[data-library-query]');
  const category = root.querySelector('[data-library-category]');
  const medium = root.querySelector('[data-library-medium]');
  const level = root.querySelector('[data-library-level]');
  const time = root.querySelector('[data-library-time]');
  const reset = root.querySelector('[data-library-reset]');

  const normalize = (value) => String(value || '').toLowerCase().normalize('NFKC');
  const minutesFor = (card, selectedMedium) => {
    const media = selectedMedium ? [selectedMedium] : ['site', 'youtube', 'note'];
    return media
      .map((name) => Number(card.dataset[`${name}Minutes`] || NaN))
      .filter((value) => Number.isFinite(value));
  };
  const matchesTime = (card, selectedTime, selectedMedium) => {
    if (!selectedTime) return true;
    const values = minutesFor(card, selectedMedium);
    if (!values.length) return false;
    if (selectedTime === '3') return values.some((value) => value <= 5);
    if (selectedTime === '10') return values.some((value) => value <= 10);
    if (selectedTime === 'deep') return values.some((value) => value > 10);
    return true;
  };

  const apply = () => {
    const queryValue = normalize(query?.value);
    const categoryValue = category?.value || '';
    const mediumValue = medium?.value || '';
    const levelValue = level?.value || '';
    const timeValue = time?.value || '';
    let visible = 0;

    cards.forEach((card) => {
      const searchable = normalize(
        `${card.dataset.title || ''} ${card.dataset.category || ''} ${card.dataset.keywords || ''}`
      );
      const media = (card.dataset.media || '').split(/\s+/).filter(Boolean);
      const matched =
        (!queryValue || searchable.includes(queryValue)) &&
        (!categoryValue || card.dataset.category === categoryValue) &&
        (!mediumValue || media.includes(mediumValue)) &&
        (!levelValue || card.dataset.level === levelValue) &&
        matchesTime(card, timeValue, mediumValue);

      card.hidden = !matched;
      if (matched) visible += 1;
    });

    countNode.textContent = `${visible}件のテーマを表示しています`;
    if (emptyNode) emptyNode.hidden = visible !== 0;
  };

  [query, category, medium, level, time].forEach((control) => {
    control?.addEventListener(control?.tagName === 'INPUT' ? 'input' : 'change', apply);
  });
  reset?.addEventListener('click', () => {
    if (query) query.value = '';
    if (category) category.value = '';
    if (medium) medium.value = '';
    if (level) level.value = '';
    if (time) time.value = '';
    apply();
    query?.focus();
  });

  apply();
})();