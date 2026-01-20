const glossarySearchInput = document.getElementById('glossarySearch');

if (glossarySearchInput) {
  const glossaryCards = Array.from(document.querySelectorAll('[data-glossary-card]'));
  const emptyMessage = document.getElementById('glossaryNoResults');

  const normalizeText = (text) => {
    if (!text) return '';
    return text
      .normalize('NFKC')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ');
  };

  const haystacks = glossaryCards.map((card) =>
    normalizeText(card.getAttribute('data-search'))
  );

  const updateResults = () => {
    const query = normalizeText(glossarySearchInput.value);
    let matches = 0;

    glossaryCards.forEach((card, index) => {
      const visible = !query || haystacks[index].includes(query);
      card.hidden = !visible;
      if (visible) {
        matches += 1;
      }
    });

    if (emptyMessage) {
      emptyMessage.hidden = matches !== 0;
    }
  };

  glossarySearchInput.addEventListener('input', updateResults);
  updateResults();
}
