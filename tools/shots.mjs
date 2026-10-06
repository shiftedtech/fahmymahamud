// Screenshot loop helper: viewport + full-page shots at 1440 and 390, plus
// checks for horizontal overflow, console errors, failed requests and broken links.
// Usage: node tools/shots.mjs [url] [outDir] [label]
import { chromium } from 'playwright-core';
import fs from 'node:fs';

const url = process.argv[2] || 'http://localhost:4500/';
const out = process.argv[3] || 'screenshots';
const label = process.argv[4] || 'r1';
const chrome = process.env.SCROLLCRAFT_CHROME || 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe';
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ executablePath: chrome, headless: true });
const report = [];
for (const [w, h, reduced] of [[1440, 900, false], [390, 844, false], [390, 844, true]]) {
  const tag = `${label}-${w}${reduced ? '-reduced' : ''}`;
  const ctx = await browser.newContext({
    viewport: { width: w, height: h }, deviceScaleFactor: 1,
    reducedMotion: reduced ? 'reduce' : 'no-preference',
    hasTouch: w < 800, isMobile: w < 800,
  });
  const page = await ctx.newPage();
  const errors = [], failed = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(String(e)));
  page.on('requestfailed', r => failed.push(r.url()));
  page.on('response', r => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`); });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${out}/${tag}-hero.png` });

  // Walk the page so every fire-once reveal triggers, sampling the lift act.
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  const liftTop = await page.evaluate(() => { const l = document.querySelector('.lift'); return l ? l.getBoundingClientRect().top + scrollY : 0; });
  const liftH = await page.evaluate(() => { const l = document.querySelector('.lift'); return l ? l.offsetHeight : 0; });
  for (let y = 0; y < total; y += Math.round(h * 0.5)) {
    await page.evaluate(yy => scrollTo(0, yy), y); await page.waitForTimeout(90);
  }
  const travel = Math.max(liftH - h, 1);
  for (const p of [0, 0.25, 0.4, 0.7]) {
    await page.evaluate(yy => scrollTo(0, yy), Math.round(liftTop + travel * p));
    await page.waitForTimeout(350);
    await page.screenshot({ path: `${out}/${tag}-lift-${String(p).replace('.', '')}.png` });
  }
  for (const id of ['story', 'skills', 'task', 'enjoy', 'demo', 'certified', 'badges', 'contact']) {
    await page.evaluate(i => { const e = document.getElementById(i); scrollTo(0, e.getBoundingClientRect().top + scrollY - innerHeight * 0.15); }, id);
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${out}/${tag}-sec-${id}.png` });
  }
  const overflow = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const bad = [];
    document.querySelectorAll('body *').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.width && (r.right > vw + 1 || r.left < -1) && !el.closest('.skyline,.landing,.sk-layer')) bad.push(`${el.tagName}.${el.className} ${Math.round(r.left)}..${Math.round(r.right)}`);
    });
    return { scrollW: document.documentElement.scrollWidth, vw, bad: bad.slice(0, 10) };
  });
  const smallTargets = await page.evaluate(() => [...document.querySelectorAll('a, button')].filter(el => {
    const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
    return r.width && cs.visibility !== 'hidden' && !el.closest('.prose, .contact__line, .lift-nav__panel[hidden]') && (r.height < 44 || r.width < 44);
  }).map(el => `${el.textContent.trim().slice(0, 30)} ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`));
  const hidden = await page.evaluate(() => [...document.querySelectorAll('[data-sc-in], [data-sc-stagger] > *')].filter(el => getComputedStyle(el).opacity < 0.99).length);
  await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(400);
  await page.screenshot({ path: `${out}/${tag}-full.png`, fullPage: true });
  report.push({ tag, errors, failed, overflow, smallTargets, stillHidden: hidden });
  await ctx.close();
}
// Link check (external links: status only)
const ctx = await browser.newContext();
const page = await ctx.newPage();
await page.goto(url);
const hrefs = await page.evaluate(() => [...new Set([...document.querySelectorAll('a[href]')].map(a => a.href))]);
const links = [];
for (const href of hrefs) {
  if (href.startsWith('mailto:')) { links.push(`mailto ok ${href}`); continue; }
  if (href.includes('#')) {
    const id = href.split('#')[1];
    const ok = !id || await page.evaluate(i => !!document.getElementById(i), id);
    links.push(`${ok ? 'ok ' : 'MISSING'} #${id}`); continue;
  }
  try { const r = await ctx.request.get(href, { maxRedirects: 5 }); links.push(`${r.status()} ${href}`); }
  catch (e) { links.push(`ERR ${href}`); }
}
report.push({ links });
await browser.close();
console.log(JSON.stringify(report, null, 1));
