const menuBtn = document.getElementById('menuBtn');
const closeBtn = document.getElementById('closeBtn');
const mobileNav = document.getElementById('mobileNav');
const navOverlay = document.getElementById('navOverlay');
const themeButtons = document.querySelectorAll('[data-theme-toggle]');
const THEME_KEY = 'theme';
const THEME_ORDER = ['system', 'light', 'dark'];

const setTheme = (preference = 'system') => {
  const normalized = THEME_ORDER.includes(preference) ? preference : 'system';
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const resolved = normalized === 'dark' || (normalized === 'system' && prefersDark) ? 'dark' : 'light';

  document.documentElement.setAttribute('data-theme', resolved);
  document.documentElement.setAttribute('data-theme-preference', normalized);
  localStorage.setItem(THEME_KEY, normalized);

  const buttonText = normalized === 'system' ? '🖥️' : resolved === 'dark' ? '🌙' : '☀️';
  const ariaText = normalized === 'system' ? '表示テーマ: 自動' : `表示テーマ: ${resolved === 'dark' ? 'ダーク' : 'ライト'}`;
  themeButtons.forEach((button) => {
    button.textContent = buttonText;
    button.setAttribute('aria-label', ariaText);
    button.dataset.theme = normalized;
  });
};

const cycleTheme = () => {
  const current = document.documentElement.getAttribute('data-theme-preference') || localStorage.getItem(THEME_KEY) || 'system';
  const currentIndex = THEME_ORDER.indexOf(current);
  const next = THEME_ORDER[(currentIndex + 1) % THEME_ORDER.length];
  setTheme(next);
};

const currentTheme = localStorage.getItem(THEME_KEY) || 'system';
setTheme(currentTheme);

const darkScheme = window.matchMedia('(prefers-color-scheme: dark)');
darkScheme.addEventListener('change', () => {
  const storedTheme = localStorage.getItem(THEME_KEY) || 'system';
  if (storedTheme === 'system') {
    setTheme('system');
  }
});

themeButtons.forEach((button) => {
  button.addEventListener('click', cycleTheme);
});

const openNav = () => {
  if (!mobileNav || !navOverlay || !menuBtn) return;
  mobileNav.classList.add('open');
  navOverlay.classList.add('show');
  navOverlay.hidden = false;
  mobileNav.setAttribute('aria-hidden', 'false');
  menuBtn.setAttribute('aria-expanded', 'true');
  document.body.classList.add('nav-open');
};

const closeNav = () => {
  if (!mobileNav || !navOverlay || !menuBtn) return;
  mobileNav.classList.remove('open');
  navOverlay.classList.remove('show');
  navOverlay.hidden = true;
  mobileNav.setAttribute('aria-hidden', 'true');
  menuBtn.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('nav-open');
};

if (menuBtn) {
  menuBtn.addEventListener('click', openNav);
}
if (closeBtn) {
  closeBtn.addEventListener('click', closeNav);
}
if (navOverlay) {
  navOverlay.addEventListener('click', closeNav);
}

if (mobileNav) {
  mobileNav.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      closeNav();
    }
  });
}

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeNav();
  }
});

const imageNodes = document.querySelectorAll('img');

imageNodes.forEach((image) => {
  const isDecorative = image.dataset.decorative === 'true' || image.classList.contains('is-decorative');
  const hasAlt = image.hasAttribute('alt');

  if (!image.hasAttribute('decoding')) {
    image.setAttribute('decoding', 'async');
  }
  if (!image.hasAttribute('loading') && !image.hasAttribute('fetchpriority')) {
    image.setAttribute('loading', 'lazy');
  }

  if (isDecorative) {
    image.setAttribute('alt', '');
    return;
  }

  if (!hasAlt) {
    const fallbackText = image.getAttribute('title') || image.getAttribute('aria-label') || '';
    image.setAttribute('alt', fallbackText);
  }
});

const sendSearchAnalytics = () => {
  const isSearchPage = window.location.pathname.includes('/search/');
  if (!isSearchPage) return;

  const params = new URLSearchParams(window.location.search);
  const query = (params.get('q') || '').trim();
  if (!query) return;

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'search', {
      search_term: query,
    });
  }

  if (Array.isArray(window._paq)) {
    window._paq.push(['trackSiteSearch', query, false, false]);
  }
};

sendSearchAnalytics();
