(() => {
  const root = document.getElementById('site-navigator');
  const form = document.getElementById('navigator-form');
  const input = document.getElementById('navigator-query');
  const log = document.getElementById('navigator-log');
  const clearButton = document.getElementById('navigator-clear');
  const answerData = document.getElementById('navigator-answers');
  const libraryData = document.getElementById('navigator-library');

  if (!root || !form || !input || !log || !answerData) return;

  let answers = [];
  let contentLibrary = [];
  try {
    answers = JSON.parse(answerData.textContent || '[]');
  } catch {
    answers = [];
  }
  try {
    contentLibrary = JSON.parse(libraryData?.textContent || '[]');
  } catch {
    contentLibrary = [];
  }

  const initialMessage = log.firstElementChild
    ? log.firstElementChild.cloneNode(true)
    : null;
  const submitButton = form.querySelector('button[type="submit"]');
  const moduleUrl = root.dataset.pagefindModule || '';
  const pagefindBase = root.dataset.pagefindBase || '';
  const baseUrl = (root.dataset.baseurl || '').replace(/\/$/, '');
  let pagefindPromise;
  let hasConversation = false;

  const normalizeText = (value) => (value || '')
    .toString()
    .normalize('NFKC')
    .toLowerCase()
    .replace(/個人曝露/g, '個人ばく露')
    .replace(/曝露/g, 'ばく露')
    .replace(/局排/g, '局所排気装置')
    .replace(/第三管理区分/g, '第3管理区分')
    .replace(/[?？!！。、・「」『』（）()\s]/g, '');

  const plainText = (value) => {
    const parser = document.createElement('div');
    parser.innerHTML = value || '';
    return (parser.textContent || '').replace(/\s+/g, ' ').trim();
  };

  const shorten = (value, maxLength = 150) => {
    const text = plainText(value);
    return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
  };

  const createElement = (tagName, className, text) => {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (typeof text === 'string') element.textContent = text;
    return element;
  };

  const internalUrl = (path) => {
    if (!path) return '#';
    if (/^(?:https?:|mailto:|tel:)/.test(path)) return path;
    if (baseUrl && (path === baseUrl || path.startsWith(`${baseUrl}/`))) return path;
    if (path.startsWith('/')) return `${baseUrl}${path}` || path;
    return `${baseUrl}/${path}`;
  };

  const comparablePath = (path) => {
    try {
      const parsed = new URL(internalUrl(path), window.location.origin);
      return parsed.pathname.replace(/\/+$/, '/') || '/';
    } catch {
      return path || '';
    }
  };

  const findCuratedAnswer = (query) => {
    const normalizedQuery = normalizeText(query);
    if (!normalizedQuery) return null;

    let bestMatch = null;
    let bestScore = 0;

    answers.forEach((item) => {
      const normalizedQuestion = normalizeText(item.question);
      const aliases = (item.aliases || []).map((alias) => normalizeText(alias));
      if (normalizedQuestion === normalizedQuery || aliases.includes(normalizedQuery)) {
        bestMatch = item;
        bestScore = Number.POSITIVE_INFINITY;
        return;
      }

      let score = 0;
      let matches = 0;
      (item.keywords || []).forEach((keyword) => {
        const normalizedKeyword = normalizeText(keyword);
        if (!normalizedKeyword) return;
        if (normalizedQuery.includes(normalizedKeyword)) {
          matches += 1;
          score += Math.max(2, Math.min(normalizedKeyword.length, 10));
        }
      });

      if (normalizedQuestion.includes(normalizedQuery) && normalizedQuery.length >= 4) {
        score += 4;
      }
      if (normalizedQuery.includes(normalizedQuestion) && normalizedQuestion.length >= 4) {
        score += 12;
      }

      const threshold = normalizedQuery.length <= 3 ? 3 : 4;
      if (matches > 0 && score >= threshold && score > bestScore) {
        bestMatch = item;
        bestScore = score;
      }
    });

    return bestMatch;
  };

  const loadPagefind = () => {
    if (!pagefindPromise) {
      pagefindPromise = import(moduleUrl).then(async (pagefind) => {
        if (typeof pagefind.options === 'function' && pagefindBase) {
          await pagefind.options({
            basePath: new URL(pagefindBase, window.location.origin).href,
          });
        }
        if (typeof pagefind.init === 'function') await pagefind.init();
        return pagefind;
      });
    }
    return pagefindPromise;
  };

  const searchSite = async (query, curatedAnswer) => {
    const pagefind = await loadPagefind();
    const searchQuery = curatedAnswer?.search_query || query;
    const response = await pagefind.search(searchQuery);
    const resultData = await Promise.all(
      response.results.slice(0, 6).map((result) => result.data()),
    );
    const primaryPath = comparablePath(curatedAnswer?.article_url || '');
    const unique = [];
    const seen = new Set();

    resultData.forEach((result) => {
      const resultPath = comparablePath(result.url);
      if (!resultPath || resultPath === primaryPath || seen.has(resultPath)) return;
      seen.add(resultPath);
      unique.push(result);
    });

    return unique.slice(0, 3);
  };

  const appendUserMessage = (query) => {
    const message = createElement('div', 'navigator-message navigator-message--user');
    message.appendChild(createElement('p', '', query));
    log.appendChild(message);
  };

  const buildPrimaryAnswer = (curatedAnswer) => {
    const section = createElement('section', 'navigator-curated-answer');
    section.appendChild(createElement('p', 'navigator-answer-label', '確認済みの案内'));
    section.appendChild(createElement('p', 'navigator-answer-text', curatedAnswer.answer));

    const link = createElement('a', 'navigator-primary-link', `${curatedAnswer.article_title}を読む →`);
    link.href = internalUrl(curatedAnswer.article_url);
    section.appendChild(link);

    if (curatedAnswer.checked_at) {
      section.appendChild(
        createElement('p', 'navigator-checked-date', `内容確認日：${curatedAnswer.checked_at}`),
      );
    }

    const relatedMedia = contentLibrary.find((item) => item.slug === curatedAnswer.content_slug);
    if (relatedMedia?.youtube?.url || relatedMedia?.note?.url) {
      const media = createElement('div', 'navigator-media');
      media.appendChild(createElement('p', 'navigator-media-title', '同じテーマを別の形式で'));
      const links = createElement('div', 'navigator-media-links');

      [
        { data: relatedMedia.youtube, fallback: 'YouTubeで見る' },
        { data: relatedMedia.note, fallback: 'noteで読む' },
      ].forEach(({ data, fallback }) => {
        if (!data?.url) return;
        const link = createElement('a', '', data.label || fallback);
        link.href = data.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.setAttribute('aria-label', `${data.label || fallback}（外部サイト）`);
        links.appendChild(link);
      });

      media.appendChild(links);
      section.appendChild(media);
    }
    return section;
  };

  const buildSearchResults = (results, hasCuratedAnswer) => {
    const section = createElement('section', 'navigator-related-results');
    const title = hasCuratedAnswer
      ? 'あわせて確認できるページ'
      : `近い内容の公開ページ（${results.length}件）`;
    section.appendChild(createElement('p', 'navigator-results-title', title));

    const list = createElement('div', 'navigator-result-list');
    results.forEach((result) => {
      const card = createElement('a', 'navigator-result-card');
      card.href = internalUrl(result.url);

      const titleText = result.meta?.title || '関連ページ';
      card.appendChild(createElement('strong', '', titleText));

      const description = result.meta?.description || result.excerpt || result.content;
      if (description) card.appendChild(createElement('span', '', shorten(description)));
      list.appendChild(card);
    });
    section.appendChild(list);
    return section;
  };

  const appendAssistantMessage = ({ curatedAnswer, results, error }) => {
    const message = createElement('div', 'navigator-message navigator-message--guide navigator-message--response');

    if (error) {
      if (curatedAnswer) message.appendChild(buildPrimaryAnswer(curatedAnswer));
      message.appendChild(createElement('p', 'navigator-error', '関連ページの検索を読み込めませんでした。時間をおいて再度お試しいただくか、通常のサイト内検索をご利用ください。'));
      const fallback = createElement('a', 'navigator-primary-link', 'サイト内検索を開く →');
      fallback.href = internalUrl('/search/');
      message.appendChild(fallback);
    } else {
      if (curatedAnswer) message.appendChild(buildPrimaryAnswer(curatedAnswer));
      if (results.length) message.appendChild(buildSearchResults(results, Boolean(curatedAnswer)));

      if (!curatedAnswer && !results.length) {
        message.appendChild(createElement('p', '', 'この質問に直接対応する公開ページは見つかりませんでした。言葉を短くするか、別の表現でお試しください。'));
        const fallback = createElement('a', 'navigator-primary-link', '主要カテゴリから探す →');
        fallback.href = internalUrl('/learn/');
        message.appendChild(fallback);
      } else if (!curatedAnswer) {
        message.insertBefore(
          createElement('p', 'navigator-search-note', '確認済みの短い案内はまだありませんが、サイト内で近い内容を見つけました。'),
          message.firstChild,
        );
      }
    }

    log.appendChild(message);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    message.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
  };

  const setBusy = (busy) => {
    root.setAttribute('aria-busy', busy ? 'true' : 'false');
    if (submitButton) {
      submitButton.disabled = busy;
      submitButton.textContent = busy ? '検索中…' : '質問する';
    }
    input.disabled = busy;
  };

  const updateQueryParameter = (query) => {
    const currentUrl = new URL(window.location.href);
    if (query) currentUrl.searchParams.set('q', query);
    else currentUrl.searchParams.delete('q');
    window.history.replaceState({}, '', currentUrl);
  };

  const ask = async (rawQuery) => {
    const query = rawQuery.trim();
    if (!query) return;

    if (!hasConversation && initialMessage) log.replaceChildren();
    hasConversation = true;
    if (clearButton) clearButton.hidden = false;
    appendUserMessage(query);
    updateQueryParameter(query);
    setBusy(true);

    const curatedAnswer = findCuratedAnswer(query);
    try {
      const results = await searchSite(query, curatedAnswer);
      appendAssistantMessage({ curatedAnswer, results, error: false });
    } catch {
      appendAssistantMessage({ curatedAnswer, results: [], error: true });
    } finally {
      setBusy(false);
      input.value = '';
      input.focus({ preventScroll: true });
    }
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    ask(input.value);
  });

  document.querySelectorAll('[data-navigator-question]').forEach((button) => {
    button.addEventListener('click', () => {
      const question = button.getAttribute('data-navigator-question') || '';
      input.value = question;
      ask(question);
    });
  });

  if (clearButton) {
    clearButton.addEventListener('click', () => {
      log.replaceChildren();
      if (initialMessage) log.appendChild(initialMessage.cloneNode(true));
      hasConversation = false;
      clearButton.hidden = true;
      updateQueryParameter('');
      input.value = '';
      input.focus();
    });
  }

  const initialQuery = new URLSearchParams(window.location.search).get('q');
  if (initialQuery) {
    input.value = initialQuery;
    ask(initialQuery);
  }
})();
