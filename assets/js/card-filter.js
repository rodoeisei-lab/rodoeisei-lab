(() => {
  const normalize = value => String(value || '').normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim();
  const search = document.getElementById('cardSearch');
  const category = document.getElementById('cardCategory');
  const level = document.getElementById('cardLevel');
  const result = document.getElementById('cardResultsStatus');
  const empty = document.getElementById('cardNoResults');
  const cards = [...document.querySelectorAll('[data-filter-card]')];
  if (!search || !cards.length) return;
  const params = new URLSearchParams(location.search);
  let tag = normalize(params.get('tag'));
  search.value = params.get('q') || '';
  [category, level].forEach((select, index) => {
    const value = params.get(index ? 'level' : 'category');
    if (select && [...select.options].some(option => option.value === value)) select.value = value;
  });
  const index = cards.map(card => ({ card, text: normalize(card.dataset.search), tags: (card.dataset.tags || '').split('|').map(normalize) }));
  const filter = () => {
    const words = normalize(search.value).split(' ').filter(Boolean);
    let count = 0;
    index.forEach(({card, text, tags}) => {
      const visible = words.every(word => text.includes(word)) && (!tag || tags.includes(tag)) && (!category?.value || card.dataset.category === category.value) && (!level?.value || card.dataset.level === level.value);
      card.hidden = !visible; if (visible) count++;
    });
    if (empty) empty.hidden = count !== 0;
    if (result) result.textContent = `${count}件の解説を表示しています。`;
    const url = new URL(location.href);
    [['q',search.value.trim()],['category',category?.value],['level',level?.value]].forEach(([key,value]) => value ? url.searchParams.set(key,value) : url.searchParams.delete(key));
    if (!tag) url.searchParams.delete('tag');
    history.replaceState({}, '', url);
  };
  search.addEventListener('input', filter);
  category?.addEventListener('change', filter); level?.addEventListener('change', filter);
  document.getElementById('cardClear')?.addEventListener('click', () => {
    search.value = ''; if (category) category.value = ''; if (level) level.value = '';
    // Tag links are legacy entry points. Clearing all filters also clears their tag.
    tag = ''; filter(); search.focus();
  });
  filter();
})();
