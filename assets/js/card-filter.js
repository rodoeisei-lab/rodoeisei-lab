const normalizeText = (text) => {
  if (!text) return "";
  return text
    .toString()
    .normalize("NFKC")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
};

const searchInput = document.getElementById("cardSearch");
const cards = Array.from(document.querySelectorAll("[data-filter-card]"));
const noResults = document.getElementById("cardNoResults");

if (searchInput && cards.length) {
  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get("q") || "";
  const normalizedTag = normalizeText(params.get("tag") || "");

  searchInput.value = initialQuery;

  const indexedCards = cards.map((card) => {
    const normalizedSearch = normalizeText(card.getAttribute("data-search"));
    const normalizedTags = (card.getAttribute("data-tags") || "")
      .split("|")
      .map((tag) => normalizeText(tag))
      .filter(Boolean);

    return {
      card,
      normalizedSearch,
      normalizedTags,
    };
  });

  const resultStatus = document.createElement("p");
  resultStatus.id = "cardResultsStatus";
  resultStatus.className = "sr-only";
  resultStatus.setAttribute("role", "status");
  resultStatus.setAttribute("aria-live", "polite");
  resultStatus.textContent = "";
  searchInput.insertAdjacentElement("afterend", resultStatus);

  const updateQueryParam = (query) => {
    const currentUrl = new URL(window.location.href);
    if (query) {
      currentUrl.searchParams.set("q", query);
    } else {
      currentUrl.searchParams.delete("q");
    }

    if (normalizedTag) {
      currentUrl.searchParams.set("tag", normalizedTag);
    }

    window.history.replaceState({}, "", currentUrl);
  };

  let previousResultText = "";

  const filterCards = () => {
    const query = normalizeText(searchInput.value);
    let visibleCount = 0;

    indexedCards.forEach(({ card, normalizedSearch, normalizedTags }) => {
      const matchesQuery = !query || normalizedSearch.includes(query);
      const matchesTag = !normalizedTag || normalizedTags.includes(normalizedTag);
      const isVisible = matchesQuery && matchesTag;

      card.hidden = !isVisible;
      if (isVisible) {
        visibleCount += 1;
      }
    });

    if (noResults) {
      noResults.hidden = visibleCount !== 0;
    }

    const hasFilters = Boolean(query || normalizedTag);
    const nextResultText = hasFilters
      ? `${visibleCount}件見つかりました`
      : `全${cards.length}件を表示しています`;

    if (nextResultText !== previousResultText) {
      resultStatus.textContent = nextResultText;
      previousResultText = nextResultText;
    }

    updateQueryParam(query);
  };

  let timerId = 0;
  searchInput.addEventListener("input", () => {
    window.clearTimeout(timerId);
    timerId = window.setTimeout(filterCards, 80);
  });

  filterCards();
}
