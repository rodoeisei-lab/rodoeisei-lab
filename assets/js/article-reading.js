(() => {
  'use strict';
  const key = 'rodoeisei:reading:v1';
  const status = document.querySelector('[data-reading-status]');
  const announce = message => { if (status) status.textContent = message; };
  let available = true;
  const read = () => {
    try {
      const value = JSON.parse(localStorage.getItem(key) || '{}');
      const clean = list => Array.isArray(list) ? [...new Set(list.filter(item => typeof item === 'string' && item.length < 250))] : [];
      return { saved: clean(value?.saved).slice(0, 100), history: clean(value?.history).slice(0, 12) };
    } catch (_) { return { saved: [], history: [] }; }
  };
  const write = value => {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch (_) {
      available = false;
      announce('このブラウザでは端末内への保存を利用できません。');
      status?.classList.remove('sr-only');
      return false;
    }
  };

  // Build the TOC only from the article body, not sources/feedback/navigation.
  const toc = document.querySelector('[data-article-toc]');
  const headings = [...document.querySelectorAll('.article-content h2, .article-content h3')];
  if (toc && headings.filter(heading => heading.tagName === 'H2').length >= 2) {
    const list = toc.querySelector('ol');
    let parent;
    headings.forEach((heading, index) => {
      if (!heading.id) {
        let id = `article-heading-${index + 1}`;
        while (document.getElementById(id)) id += '-section';
        heading.id = id;
      }
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = `#${encodeURIComponent(heading.id)}`;
      link.textContent = heading.textContent.trim();
      item.append(link);
      if (heading.tagName === 'H3' && parent) {
        let children = parent.querySelector('ul');
        if (!children) { children = document.createElement('ul'); parent.append(children); }
        children.append(item);
      } else { list.append(item); parent = item; }
    });
    toc.hidden = false;
  }

  document.querySelectorAll('.article-content table').forEach((table, index) => {
    if (table.closest('.comparison-table-wrap, .record-table-wrap, .regulations-table-wrap')) return;
    const wrapper = document.createElement('div'); wrapper.className = 'article-table-scroll'; wrapper.setAttribute('role', 'region'); wrapper.setAttribute('aria-label', table.caption?.textContent || `記事内の表${index + 1}`);
    table.before(wrapper); wrapper.append(table);
    const hint = document.createElement('p'); hint.className = 'table-scroll-hint'; hint.textContent = '表は左右にスクロールして確認できます。'; wrapper.after(hint);
    const sync = () => { const overflow = wrapper.scrollWidth > wrapper.clientWidth + 1; hint.hidden = !overflow; wrapper.tabIndex = overflow ? 0 : -1; };
    sync(); window.addEventListener('resize', sync, { passive: true });
  });

  const currentNode = document.getElementById('reading-current');
  const saveButton = document.querySelector('[data-save-article]');
  if (currentNode && saveButton) {
    let current;
    try { current = JSON.parse(currentNode.textContent); } catch (_) { return; }
    const syncButton = () => {
      const saved = read().saved.includes(current.url);
      saveButton.textContent = saved ? '保存済み（解除する）' : 'この記事を保存';
      saveButton.setAttribute('aria-pressed', String(saved));
      saveButton.disabled = !available;
    };
    const state = read();
    state.history = [current.url, ...state.history.filter(url => url !== current.url)].slice(0, 12);
    write(state);
    saveButton.hidden = false;
    syncButton();
    saveButton.addEventListener('click', () => {
      const value = read();
      const saved = value.saved.includes(current.url);
      if (!saved && value.saved.length >= 100) { announce('保存できるのは100件までです。保存一覧で不要な記事を解除してください。'); return; }
      value.saved = saved ? value.saved.filter(url => url !== current.url) : [current.url, ...value.saved];
      if (write(value)) announce(saved ? '記事の保存を解除しました。' : 'この端末に記事を保存しました。');
      syncButton();
    });
    window.addEventListener('storage', event => { if (event.key === key) syncButton(); });
  }

  const catalogNode = document.getElementById('reading-catalog');
  if (!catalogNode) return;
  let catalog;
  try { catalog = new Map(JSON.parse(catalogNode.textContent).map(item => [item.url, item.title])); } catch (_) { return; }
  const renderList = (selector, urls, saved) => {
    const list = document.querySelector(selector);
    if (!list) return;
    list.replaceChildren();
    const validUrls = urls.filter(url => catalog.has(url));
    if (!validUrls.length) { const item = document.createElement('li'); item.textContent = saved ? '保存した記事はまだありません。記事の「この記事を保存」から追加できます。' : '最近読んだ記事はまだありません。'; list.append(item); }
    validUrls.forEach(url => {
      const item = document.createElement('li');
      const link = document.createElement('a');
      // Only URLs in the build-time catalog are rendered; stored text/HTML is never trusted.
      link.href = url; link.textContent = catalog.get(url); item.append(link);
      if (saved) {
        const button = document.createElement('button'); button.type = 'button'; button.textContent = '保存を解除'; button.className = 'reading-list-remove'; button.setAttribute('aria-label', `${catalog.get(url)}の保存を解除`);
        button.addEventListener('click', () => {
          const value = read(); value.saved = value.saved.filter(item => item !== url);
          if (write(value)) {
            render(); announce('保存を解除しました。');
            const next = list.querySelector('button');
            if (next) next.focus();
            else { list.tabIndex = -1; list.setAttribute('aria-labelledby', 'saved-title'); list.focus(); }
          }
        }); item.append(button);
      }
      list.append(item);
    });
  };
  const render = () => { const value = read(); renderList('[data-saved-list]', value.saved, true); renderList('[data-history-list]', value.history, false); };
  render();
  document.querySelector('[data-clear-history]')?.addEventListener('click', () => {
    const value = read(); value.history = []; if (write(value)) { render(); announce('閲覧履歴を消去しました。保存した記事はそのままです。'); }
  });
  window.addEventListener('storage', event => { if (event.key === key) render(); });
})();
