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

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeNav();
  }
});
