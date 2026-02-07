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
  const tagParam = params.get("tag") || "";
  const normalizedTag = normalizeText(tagParam);

  searchInput.value = initialQuery;

  const getCardTags = (card) => {
    const tags = card.getAttribute("data-tags") || "";
    if (!tags.trim()) return [];
    return tags.split("|").map((tag) => normalizeText(tag));
  };

  const filterCards = () => {
    const query = normalizeText(searchInput.value);
    let visibleCount = 0;

    cards.forEach((card) => {
      const searchText = normalizeText(card.getAttribute("data-search"));
      const matchesQuery = !query || searchText.includes(query);
      const matchesTag =
        !normalizedTag || getCardTags(card).includes(normalizedTag);
      const isVisible = matchesQuery && matchesTag;

      card.hidden = !isVisible;
      if (isVisible) {
        visibleCount += 1;
      }
    });

    if (noResults) {
      noResults.hidden = visibleCount !== 0;
    }
  };

  searchInput.addEventListener("input", filterCards);
  filterCards();
}
