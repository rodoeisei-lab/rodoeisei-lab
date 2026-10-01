// Serve and check the real build in one process; works without a separately exposed port.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve('_site');
const basePath = '/rodoeisei-lab';
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css', '.js':'text/javascript', '.mjs':'text/javascript', '.json':'application/json', '.wasm':'application/wasm', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.webp':'image/webp' };
const server = http.createServer((req, res) => {
  let file;
  try {
    let pathname = decodeURIComponent(new URL(req.url, 'http://local.test').pathname);
    if (pathname === basePath + '/__qa-font.ttf' && process.env.PLAYWRIGHT_JAPANESE_FONT) {
      res.writeHead(200, {'Content-Type':'font/ttf','Cache-Control':'public, max-age=3600'});
      return res.end(fs.readFileSync(process.env.PLAYWRIGHT_JAPANESE_FONT));
    }
    if (!pathname.startsWith(basePath + '/')) { res.writeHead(404); return res.end(); }
    pathname = pathname.slice(basePath.length);
    file = path.join(root, pathname);
    if (!file.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
    if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    const content = fs.readFileSync(file);
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    res.end(content);
  } catch (_) { res.writeHead(404); res.end('Not found'); }
});
const files = [];
function walk(dir) { for (const entry of fs.readdirSync(dir, { withFileTypes:true })) { const file = path.join(dir,entry.name); if (entry.isDirectory()) walk(file); else if (entry.name.endsWith('.html')) files.push(file); } }
walk(root);
const routes = files.map(file => '/' + path.relative(root,file).replace(/\\/g,'/').replace(/index\.html$/, ''));
const captures = new Set(['/', '/learn/', '/guides/', '/dust/', '/respiratory-protection/', '/guides/welding-fume-manganese/', '/tools/twa-calculator/', '/tools/respirator-protection-factor/']);
const failures = [];
const stats = { routes:routes.length, viewports:[360,390,768,1280], pageChecks:0, functions:[] };
const out = path.resolve('mobile-review');
fs.mkdirSync(out, { recursive:true });
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ headless:true, ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ? {executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE} : {}) });
  try {
    const context = await browser.newContext();
    await context.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
    const page = await context.newPage();
    page.setDefaultTimeout(10000);
    page.on('pageerror', error => failures.push({type:'javascript',message:error.message,url:page.url()}));
    page.on('response', response => { if (response.url().startsWith(origin) && response.status() >= 400) failures.push({type:'http',status:response.status(),url:response.url()}); });
    const go = async route => {
      await page.goto(origin + basePath + route, { waitUntil:'load' });
      if (process.env.PLAYWRIGHT_JAPANESE_FONT) {
        await page.addStyleTag({ content:`@font-face{font-family:"Hiragino Sans";src:url("${basePath}/__qa-font.ttf");font-weight:100 900;font-display:swap}` });
        await page.evaluate(() => document.fonts.ready);
      }
    };
    for (const width of stats.viewports) {
      await page.setViewportSize({width,height:900});
      for (const route of routes) {
        await go(route);
        const state = await page.evaluate(() => {
          const content = document.querySelector('main');
          const ids = [...document.querySelectorAll('[id]')].map(x => x.id);
          const duplicateIds = ids.filter((id,i) => ids.indexOf(id) !== i);
          const badLabels = [...document.querySelectorAll('input:not([type=hidden]),select,textarea,button')].filter(el => {
            if (!el.getClientRects().length) return false;
            return !el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby') && !(el.labels?.length) && !el.textContent.trim() && !['submit','reset'].includes(el.type);
          }).map(el => el.id || el.outerHTML.slice(0,100));
          return {width:document.documentElement.scrollWidth,viewport:innerWidth,h1:document.querySelectorAll('h1').length,title:document.title,duplicateIds,badLabels, content:!!content};
        });
        stats.pageChecks++;
        if (state.width > width+1 || (state.content && state.h1 !== 1) || state.duplicateIds.length || state.badLabels.length) failures.push({type:'page',route,viewport:width,...state});
        if ((width === 390 || width === 1280) && captures.has(route)) {
          const name = `${width}-${route === '/' ? 'home' : route.replaceAll('/','_')}`;
          await page.screenshot({path:path.join(out,name+'.png'),fullPage:true});
          await page.screenshot({path:path.join(out,name+'-top.png')});
        }
      }
      console.log(`Layout ${width}px: ${routes.length} pages checked`);
    }
    await page.setViewportSize({width:390,height:844});
    await go('/');
    assert.equal(await page.locator('#mobileNav').evaluate(el => el.inert),true);
    await page.locator('#menuBtn').click();
    assert.equal(await page.locator('#closeBtn').evaluate(el => el === document.activeElement),true);
    await page.keyboard.press('Shift+Tab');
    assert.equal(await page.locator('#mobileNav a').last().evaluate(el => el === document.activeElement),true);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#menuBtn').evaluate(el => el === document.activeElement),true);
    await page.locator('#menuBtn').click();
    await page.setViewportSize({width:1280,height:900});
    assert.equal(await page.locator('body').evaluate(el => el.classList.contains('nav-open')),false);
    stats.functions.push('Menu focus, trap, Escape, resize');

    await go('/guides/');
    const total = await page.locator('[data-filter-card]').count();
    await page.locator('#cardCategory').selectOption('粉じん・溶接ヒューム');
    assert.equal(await page.locator('[data-filter-card]:visible').count(),3);
    await page.locator('#cardSearch').fill('存在しない検索語XYZ');
    assert.equal(await page.locator('[data-filter-card]:visible').count(),0);
    assert.equal(await page.locator('#cardNoResults').isVisible(),true);
    await page.locator('#cardClear').click();
    assert.equal(await page.locator('[data-filter-card]:visible').count(),total);
    await page.locator('#cardSearch').fill('ＳＤＳ');
    assert.ok(await page.locator('[data-filter-card]:visible').count() > 0);
    await go('/guides/?tag=粉じん');
    await page.locator('#cardClear').click();
    assert.equal(new URL(page.url()).searchParams.has('tag'),false);
    stats.functions.push('Article keywords, category, empty state, clear, NFKC, legacy tag');

    await go('/substances/?filter=upcoming-2026');
    assert.equal(await page.locator('[data-substance-card]:visible').count(),79);
    assert.equal(new URL(page.url()).searchParams.get('filter'),'applied-2026');
    assert.equal(await page.locator('#substanceStatus option[value=upcoming]').count(),0);
    await go('/substances/?status=upcoming');
    assert.equal(await page.locator('[data-substance-card]:visible').count(),390);
    assert.equal(new URL(page.url()).searchParams.has('status'),false);
    stats.functions.push('79 applied records, 390 total, old query compatibility');

    await go('/tools/twa-calculator/');
    await page.locator('#twaForm button[type=submit]').click();
    assert.equal(await page.locator('#twaError').isVisible(),true);
    assert.equal(await page.locator('#twaResult').isVisible(),false);
    await page.locator('#twaExample').click();
    assert.match(await page.locator('#twaResultPrimary').textContent(),/7\.25 ppm/);
    await page.locator('#twaCoverageConfirmed').uncheck();
    assert.equal(await page.locator('#twaResult').isVisible(),false);
    await page.locator('#twaForm button[type=submit]').click();
    assert.match(await page.locator('#twaResultPrimary').textContent(),/未確定/);
    await page.locator('#twaReset').click();
    await page.locator('[data-twa-concentration]').first().fill('0');
    await page.locator('[data-twa-duration]').first().fill('8');
    await page.locator('#twaLimit').fill('10');
    await page.locator('#twaCoverageConfirmed').check();
    await page.locator('#twaForm button[type=submit]').click();
    assert.match(await page.locator('#twaResultPrimary').textContent(),/^0 ppm/);
    assert.match(await page.locator('#twaRatio').textContent(),/^0 %/);
    await page.locator('#twaUnit').selectOption('mg/m³');
    assert.equal(await page.locator('#twaResult').isVisible(),false);
    stats.functions.push('TWA blank, full example, unknown coverage, zero ratio, stale result reset');

    await go('/tools/respirator-protection-factor/');
    await page.locator('#protectionFactorType').selectOption('welding');
    await page.locator('#protectionFactorForm button[type=submit]').click();
    assert.equal(await page.locator('#protectionFactorError').isVisible(),true);
    assert.equal(await page.locator('#protectionFactorResultDetails').isVisible(),false);
    await page.locator('#protectionFactorExample').click();
    assert.equal(await page.locator('#protectionFactorResultPf').textContent(),'6');
    await page.locator('#protectionFactorApf').fill('6');
    assert.equal(await page.locator('#protectionFactorResultDetails').isVisible(),false);
    await page.locator('#protectionFactorForm button[type=submit]').click();
    assert.match(await page.locator('#protectionFactorResultApf').textContent(),/同じ.*満たしません/);
    await page.locator('#protectionFactorType').selectOption('dust');
    await page.locator('#protectionFactorC').fill('0.6');
    await page.locator('#protectionFactorForm button[type=submit]').click();
    assert.match(await page.locator('#protectionFactorError').textContent(),/遊離けい酸/);
    await page.locator('#protectionFactorQ').fill('10');
    await page.locator('#protectionFactorApf').fill('2.58');
    await page.locator('#protectionFactorForm button[type=submit]').click();
    assert.equal(await page.locator('#protectionFactorResultPf').textContent(),'129 / 50');
    assert.match(await page.locator('#protectionFactorResultApf').textContent(),/同じ.*満たしません/);
    stats.functions.push('PF blank C/Q, welding maximum, exact equality and dust fraction');

    await go('/guides/welding-fume-manganese/');
    const articleUrl = basePath+'/guides/welding-fume-manganese/';
    await page.locator('[data-save-article]').click();
    assert.equal(await page.locator('[data-save-article]').getAttribute('aria-pressed'),'true');
    await page.locator('[data-article-toc] summary').click();
    assert.ok(await page.locator('[data-article-toc] a:visible').count() >= 5);
    assert.equal(await page.locator('[data-article-toc] a').first().evaluate(link => !!document.getElementById(decodeURIComponent(link.hash.slice(1)))),true);
    await go('/reading-list/');
    assert.equal(await page.locator(`[data-saved-list] a[href="${articleUrl}"]`).count(),1);
    assert.equal(await page.locator(`[data-history-list] a[href="${articleUrl}"]`).count(),1);
    await page.locator('[data-clear-history]').click();
    assert.equal(await page.locator('[data-history-list] a').count(),0);
    assert.equal(await page.locator('[data-saved-list] a').count(),1);
    await page.locator('[data-saved-list] button').click();
    assert.equal(await page.locator('[data-saved-list] a').count(),0);
    assert.equal(await page.locator('[data-saved-list]').evaluate(el => document.activeElement === el),true);
    await page.evaluate(() => localStorage.setItem('rodoeisei:reading:v1',JSON.stringify({saved:['javascript:alert(1)','https://evil.example/'],history:[]})));
    await page.reload({waitUntil:'load'});
    assert.equal(await page.locator('[data-saved-list] a').count(),0);
    stats.functions.push('TOC anchors, save, history, removal focus and stored URL allowlist');

    // Exercise Pagefind in-browser, including local WASM and the search input handoff.
    await go('/search/?q=溶接ヒューム');
    await page.waitForFunction(() => document.querySelectorAll('.pagefind-ui__result').length > 0);
    assert.ok(await page.locator('.pagefind-ui__result a[href*="welding-fume-manganese"]').count() > 0);
    stats.functions.push('Pagefind query handoff, WASM search, new article result');

    // All content remains readable without JavaScript; calculations have a plain-text notice.
    const nojs = await browser.newContext({javaScriptEnabled:false,viewport:{width:360,height:800}});
    const plain = await nojs.newPage();
    await plain.goto(origin+basePath+'/guides/welding-fume-manganese/');
    assert.ok(await plain.locator('.article-content').innerText());
    assert.equal(await plain.locator('[data-save-article]').isVisible(),false);
    assert.ok(await plain.evaluate(() => document.documentElement.scrollWidth <= innerWidth+1));
    await nojs.close();
    stats.functions.push('No-JS article access');
    console.log('Functional checks passed:',stats.functions.length);
  } finally {
    await browser.close();
    server.close();
    fs.writeFileSync(path.join(out,'learning-hub-results.json'),JSON.stringify({checkedAt:new Date().toISOString(),...stats,failures},null,2)+'\n');
  }
  if (failures.length) { console.error(JSON.stringify(failures,null,2)); process.exitCode=1; }
  else console.log(`PASS: ${stats.pageChecks} layout checks; no page JavaScript errors or missing local requests.`);
})().catch(error => { console.error(error.stack); server.close(); process.exitCode=1; });
