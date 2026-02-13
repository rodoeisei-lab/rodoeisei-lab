const menuBtn = document.getElementById('menuBtn');
const closeBtn = document.getElementById('closeBtn');
const mobileNav = document.getElementById('mobileNav');
const navOverlay = document.getElementById('navOverlay');
const themeToggle = document.getElementById('themeToggle');
const mobileThemeToggle = document.getElementById('mobileThemeToggle');

let lastFocusedElement = null;

const navFocusableSelector = 'a[href], button:not([disabled])';

const setTheme = (theme) => {
  if (theme !== 'light' && theme !== 'dark') return;
  document.documentElement.setAttribute('data-theme', theme);
  const isDark = theme === 'dark';
  [themeToggle, mobileThemeToggle].forEach((toggle) => {
    if (!toggle) return;
    toggle.textContent = isDark ? '🌙' : '☀️';
    toggle.setAttribute('aria-pressed', String(isDark));
    toggle.setAttribute('aria-label', isDark ? 'ライトモードに切替' : 'ダークモードに切替');
  });
  try {
    localStorage.setItem('theme', theme);
  } catch (error) {
    // no-op
  }
};

const toggleTheme = () => {
  const currentTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  setTheme(currentTheme === 'dark' ? 'light' : 'dark');
};

const getNavFocusableItems = () => {
  if (!mobileNav) return [];
  return Array.from(mobileNav.querySelectorAll(navFocusableSelector));
};

const focusMobileNavFirst = () => {
  const items = getNavFocusableItems();
  if (items.length > 0) {
    items[0].focus();
  }
};

const openNav = () => {
  if (!mobileNav || !navOverlay || !menuBtn) return;
  lastFocusedElement = document.activeElement;
  mobileNav.classList.add('open');
  navOverlay.classList.add('show');
  navOverlay.hidden = false;
  mobileNav.setAttribute('aria-hidden', 'false');
  menuBtn.setAttribute('aria-expanded', 'true');
  document.body.classList.add('nav-open');
  window.setTimeout(focusMobileNavFirst, 0);
};

const closeNav = () => {
  if (!mobileNav || !navOverlay || !menuBtn) return;
  mobileNav.classList.remove('open');
  navOverlay.classList.remove('show');
  navOverlay.hidden = true;
  mobileNav.setAttribute('aria-hidden', 'true');
  menuBtn.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('nav-open');
  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
  } else {
    menuBtn.focus();
  }
};

const moveNavFocus = (items, currentIndex, direction) => {
  if (items.length === 0) return;
  const nextIndex = (currentIndex + direction + items.length) % items.length;
  items[nextIndex].focus();
};

const handleHorizontalNavKeys = (event, navRoot) => {
  if (!navRoot || (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft' && event.key !== 'Home' && event.key !== 'End')) return;
  const links = Array.from(navRoot.querySelectorAll('a'));
  if (!links.length || !links.includes(document.activeElement)) return;

  const currentIndex = links.indexOf(document.activeElement);
  if (event.key === 'Home') {
    event.preventDefault();
    links[0].focus();
    return;
  }
  if (event.key === 'End') {
    event.preventDefault();
    links[links.length - 1].focus();
    return;
  }

  event.preventDefault();
  moveNavFocus(links, currentIndex, event.key === 'ArrowRight' ? 1 : -1);
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

[themeToggle, mobileThemeToggle].forEach((toggle) => {
  if (!toggle) return;
  toggle.addEventListener('click', toggleTheme);
});

const initialTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
setTheme(initialTheme);

const desktopNav = document.querySelector('.desktop-nav');
if (desktopNav) {
  desktopNav.addEventListener('keydown', (event) => handleHorizontalNavKeys(event, desktopNav));
}
if (mobileNav) {
  mobileNav.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeNav();
      return;
    }

    if (mobileNav.getAttribute('aria-hidden') !== 'false') return;

    const items = getNavFocusableItems();
    if (!items.length) return;
    const currentIndex = items.indexOf(document.activeElement);

    if (event.key === 'Tab') {
      if (currentIndex === -1) return;
      if (!event.shiftKey && currentIndex === items.length - 1) {
        event.preventDefault();
        items[0].focus();
      } else if (event.shiftKey && currentIndex === 0) {
        event.preventDefault();
        items[items.length - 1].focus();
      }
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const startIndex = currentIndex === -1 ? 0 : currentIndex;
      moveNavFocus(items, startIndex, event.key === 'ArrowDown' ? 1 : -1);
    }
  });
}

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeNav();
  }
});
