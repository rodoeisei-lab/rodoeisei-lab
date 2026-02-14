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

  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get('q') || '';
  glossarySearchInput.value = initialQuery;

  const haystacks = glossaryCards.map((card) =>
    normalizeText(card.getAttribute('data-search'))
  );

  const resultStatus = document.createElement('p');
  resultStatus.id = 'glossaryResultsStatus';
  resultStatus.className = 'sr-only';
  resultStatus.setAttribute('role', 'status');
  resultStatus.setAttribute('aria-live', 'polite');
  resultStatus.textContent = '';
  glossarySearchInput.insertAdjacentElement('afterend', resultStatus);

  const updateQueryParam = (query) => {
    const currentUrl = new URL(window.location.href);
    if (query) {
      currentUrl.searchParams.set('q', query);
    } else {
      currentUrl.searchParams.delete('q');
    }
    window.history.replaceState({}, '', currentUrl);
  };

  let previousResultText = '';

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

    const nextResultText = query
      ? `${matches}件見つかりました`
      : `全${glossaryCards.length}件を表示しています`;

    if (nextResultText !== previousResultText) {
      resultStatus.textContent = nextResultText;
      previousResultText = nextResultText;
    }

    updateQueryParam(query);
  };

  let timerId = 0;
  glossarySearchInput.addEventListener('input', () => {
    window.clearTimeout(timerId);
    timerId = window.setTimeout(updateResults, 80);
  });

  updateResults();
}
