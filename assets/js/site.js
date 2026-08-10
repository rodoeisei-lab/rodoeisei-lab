const menuBtn = document.getElementById('menuBtn');
const closeBtn = document.getElementById('closeBtn');
const mobileNav = document.getElementById('mobileNav');
const navOverlay = document.getElementById('navOverlay');

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
  const wasOpen = mobileNav.classList.contains('open');
  mobileNav.classList.remove('open');
  navOverlay.classList.remove('show');
  navOverlay.hidden = true;
  mobileNav.setAttribute('aria-hidden', 'true');
  menuBtn.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('nav-open');
  if (wasOpen) menuBtn.focus();
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
