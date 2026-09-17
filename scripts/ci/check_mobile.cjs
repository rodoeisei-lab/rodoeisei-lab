// Run against the production Jekyll build; retain screenshots for PR review.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE);
const fs = require('node:fs');
const path = require('node:path');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 360, height: 800 } });
  const failures = [];
  fs.mkdirSync('mobile-review', { recursive: true });
  const routes = ['/', '/guides/', '/chemical-management/', '/local-exhaust-ventilation/',
    '/guides/respirator-selection/', '/guides/gas-cartridge-replacement/',
    '/guides/local-exhaust-airflow-calculation/', '/guides/fit-test/'];
  for (const route of routes) {
    await page.goto(`http://127.0.0.1:4000/rodoeisei-lab${route}`, { waitUntil: 'networkidle' });
    const state = await page.evaluate(() => ({
      width: document.documentElement.scrollWidth,
      viewport: innerWidth,
      h1: document.querySelectorAll('h1').length,
      title: document.title,
    }));
    console.log(route, state);
    if (state.width > state.viewport + 1 || state.h1 !== 1) failures.push({ route, ...state });
    await page.screenshot({ path: path.join('mobile-review', route.replaceAll('/', '_') + '.png'), fullPage: true });
  }
  await page.goto('http://127.0.0.1:4000/rodoeisei-lab/');
  if (!(await page.locator('#mobileNav').evaluate(el => el.inert))) failures.push('Closed menu is not inert');
  await page.locator('#menuBtn').click();
  if (!(await page.locator('#closeBtn').evaluate(el => el === document.activeElement))) failures.push('Opening focus');
  await page.keyboard.press('Shift+Tab');
  if (!(await page.locator('#mobileNav a').last().evaluate(el => el === document.activeElement))) failures.push('Focus trap');
  await page.keyboard.press('Escape');
  if (!(await page.locator('#menuBtn').evaluate(el => el === document.activeElement))) failures.push('Closing focus');
  await page.locator('#menuBtn').click();
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.waitForTimeout(250);
  if (await page.locator('body').evaluate(el => el.classList.contains('nav-open'))) failures.push('Resize leaves scroll locked');
  await browser.close();
  if (failures.length) { console.error(JSON.stringify(failures, null, 2)); process.exitCode = 1; }
})().catch(error => { console.error(error); process.exitCode = 1; });
