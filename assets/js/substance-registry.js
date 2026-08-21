(() => {
  const searchInput = document.getElementById("substanceSearch");
  const systemSelect = document.getElementById("substanceSystem");
  const statusSelect = document.getElementById("substanceStatus");
  const resultStatus = document.getElementById("substanceResultStatus");
  const noResults = document.getElementById("substanceNoResults");

  if (!searchInput || !systemSelect || !statusSelect || !resultStatus || !noResults) {
    return;
  }

  const cards = Array.from(document.querySelectorAll("[data-substance-card]"));
  const filterButtons = Array.from(document.querySelectorAll("[data-substance-filter]"));
  const filterValues = new Set(["all", "organic-second", "specified", "concentration"]);
  const params = new URLSearchParams(window.location.search);

  const normalizeText = (value) => {
    if (!value) return "";
    return value
      .normalize("NFKC")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");
  };

  const cardSearchTexts = cards.map((card) => normalizeText(card.dataset.search));
  let quickFilter = filterValues.has(params.get("filter")) ? params.get("filter") : "all";

  searchInput.value = params.get("q") || "";
  if ([...systemSelect.options].some((option) => option.value === params.get("system"))) {
    systemSelect.value = params.get("system");
  }
  if ([...statusSelect.options].some((option) => option.value === params.get("status"))) {
    statusSelect.value = params.get("status");
  }

  const matchesQuickFilter = (card) => {
    if (quickFilter === "all") return true;
    if (quickFilter === "organic-second") {
      return card.dataset.system === "organic-solvent" && card.dataset.category === "第2種有機溶剤";
    }
    if (quickFilter === "specified") return card.dataset.system === "specified-chemical";
    return card.dataset.system === "concentration-standard";
  };

  const updateUrl = () => {
    const currentUrl = new URL(window.location.href);
    const setOrDelete = (key, value, defaultValue = "") => {
      if (value && value !== defaultValue) {
        currentUrl.searchParams.set(key, value);
      } else {
        currentUrl.searchParams.delete(key);
      }
    };

    setOrDelete("q", searchInput.value.trim());
    setOrDelete("filter", quickFilter, "all");
    setOrDelete("system", systemSelect.value, "all");
    setOrDelete("status", statusSelect.value, "all");
    window.history.replaceState({}, "", currentUrl);
  };

  const updateButtons = () => {
    filterButtons.forEach((button) => {
      const selected = button.dataset.substanceFilter === quickFilter;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  };

  const updateResults = () => {
    const query = normalizeText(searchInput.value);
    const system = systemSelect.value;
    const status = statusSelect.value;
    let matches = 0;

    cards.forEach((card, index) => {
      const matchesQuery = !query || cardSearchTexts[index].includes(query);
      const matchesSystem = system === "all" || card.dataset.system === system;
      const matchesStatus = status === "all" || card.dataset.status === status;
      const visible = matchesQuery && matchesQuickFilter(card) && matchesSystem && matchesStatus;
      card.hidden = !visible;
      if (visible) matches += 1;
    });

    resultStatus.textContent = query || quickFilter !== "all" || system !== "all" || status !== "all"
      ? `${matches}件を表示しています。`
      : `全${cards.length}件を表示しています。`;
    noResults.hidden = matches !== 0;
    updateButtons();
    updateUrl();
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      quickFilter = button.dataset.substanceFilter || "all";
      systemSelect.value = "all";
      updateResults();
    });
  });

  let inputTimer = 0;
  searchInput.addEventListener("input", () => {
    window.clearTimeout(inputTimer);
    inputTimer = window.setTimeout(updateResults, 80);
  });
  systemSelect.addEventListener("change", () => {
    quickFilter = "all";
    updateResults();
  });
  statusSelect.addEventListener("change", updateResults);

  updateResults();
})();
