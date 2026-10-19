import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, extname, sep } from 'node:path';
import puppeteer from 'puppeteer';

// Test the real compiled components, including events across Shadow DOM boundaries.
test('film discovery, watchlist persistence, dialogs, keyboard and responsive layouts', async () => {
  const root = resolve('www');
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' };
  const server = createServer(async (request, response) => {
    const path = resolve(root, '.' + (request.url === '/' ? '/index.html' : request.url.split('?')[0]));
    if (!path.startsWith(root + sep)) {
      response.writeHead(403).end();
      return;
    }
    try {
      response.setHeader('Content-Type', types[extname(path)] || 'application/octet-stream');
      response.end(await readFile(path));
    } catch {
      response.writeHead(404).end();
    }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const executablePath =
    process.env.CHROME_PATH || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(existsSync);
  let browser;
  try {
    browser = await puppeteer.launch({ executablePath, headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    const arrival = {
      id: -329865,
      tmdbId: 329865,
      title: 'Arrival',
      year: 2016,
      genre: 'Drama',
      genres: ['Drama', 'Sci-fi'],
      rating: 7.6,
      duration: '',
      director: '',
      poster: '',
      overview: 'A linguist makes first contact.',
    };
    await page.setRequestInterception(true);
    page.on('request', request => {
      const url = new URL(request.url());
      if (url.pathname !== '/api/movies') return request.continue();
      const query = url.searchParams.get('q');
      const body = url.searchParams.has('id')
        ? { movie: { ...arrival, director: 'Denis Villeneuve', duration: '1h 56m' } }
        : query === 'Arrival'
          ? { movies: url.searchParams.get('page') === '2' ? [{ ...arrival, id: -686, tmdbId: 686, title: 'Contact' }] : [arrival], totalPages: 2 }
          : query === 'offline'
            ? { error: 'Movie search could not be reached. Please try again.' }
            : { movies: [], totalPages: 0 };
      request.respond({ status: query === 'offline' ? 502 : 200, contentType: 'application/json', body: JSON.stringify(body) });
    });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.setViewport({ width: 1440, height: 1100 });
    await page.goto(`http://127.0.0.1:${server.address().port}`, { waitUntil: 'networkidle2' });
    await page.waitForSelector('cineflix-app >>> wc-movie-card');
    const app = () => page.evaluate(() => document.querySelector('cineflix-app').shadowRoot.querySelectorAll('wc-movie-card').length);
    assert.equal(await app(), 12);
    const setQuery = async value => {
      await page.evaluate(value => {
        const input = document.querySelector('cineflix-app').shadowRoot.querySelector('input');
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }, value);
    };
    await setQuery('Arrival');
    await page.waitForFunction(() => document.querySelector('cineflix-app').shadowRoot.querySelector('wc-movie-card')?.movie.title === 'Arrival');
    await page.click('cineflix-app >>> .load-more button');
    await page.waitForFunction(() => document.querySelector('cineflix-app').shadowRoot.querySelectorAll('wc-movie-card').length === 2);
    await page.click('cineflix-app >>> wc-movie-card >>> .title');
    await page.waitForFunction(() => document.querySelector('cineflix-app').shadowRoot.querySelector('.director')?.textContent.includes('Denis Villeneuve'));
    await page.keyboard.press('Escape');
    await page.click('cineflix-app >>> wc-movie-card >>> .save');
    await page.waitForFunction(() => JSON.parse(localStorage.getItem('cineflix-watchlist')).includes(-329865));
    await page.reload({ waitUntil: 'networkidle2' });
    await page.click('cineflix-app >>> nav button:nth-child(2)');
    await page.waitForFunction(() => document.querySelector('cineflix-app').shadowRoot.querySelector('wc-movie-card')?.movie.title === 'Arrival');
    await page.click('cineflix-app >>> wc-movie-card >>> .save');
    await page.click('cineflix-app >>> nav button:first-child');
    await setQuery('offline');
    await page.waitForFunction(() => document.querySelector('cineflix-app').shadowRoot.querySelector('.search-status').textContent.includes('could not be reached'));
    await setQuery('no-such-title');
    await page.waitForFunction(() => document.querySelector('cineflix-app').shadowRoot.querySelector('.empty')?.textContent.includes('No films'));
    await setQuery('Arrival');
    await setQuery('');
    await page.waitForFunction(() => document.querySelector('cineflix-app').shadowRoot.querySelectorAll('wc-movie-card').length === 12);
    assert.equal(await app(), 12);
    await page.click('cineflix-app >>> input');
    await page.type('cineflix-app >>> input', 'Nolan');
    await page.waitForFunction(() => document.querySelector('cineflix-app').shadowRoot.querySelectorAll('wc-movie-card').length === 2);
    assert.equal(await app(), 2);
    await page.evaluate(() => {
      const input = document.querySelector('cineflix-app').shadowRoot.querySelector('input');
      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await page.waitForFunction(() => document.querySelector('cineflix-app').shadowRoot.querySelectorAll('wc-movie-card').length === 12);
    await page.click('cineflix-app >>> wc-movie-card >>> .save');
    await page.waitForFunction(() => JSON.parse(localStorage.getItem('cineflix-watchlist')).length === 1);
    await page.reload({ waitUntil: 'networkidle2' });
    await page.click('cineflix-app >>> nav button:nth-child(2)');
    await page.waitForFunction(() => document.querySelector('cineflix-app').shadowRoot.querySelectorAll('wc-movie-card').length === 1);
    assert.equal(await app(), 1);
    await page.click('cineflix-app >>> wc-movie-card >>> .title');
    assert.equal(await page.evaluate(() => document.querySelector('cineflix-app').shadowRoot.querySelector('dialog').open), true);
    await page.keyboard.press('Escape');
    assert.equal(await page.evaluate(() => document.querySelector('cineflix-app').shadowRoot.querySelector('dialog').open), false);
    await page.click('cineflix-app >>> nav button:first-child');
    await page.keyboard.press('/');
    assert.equal(await page.evaluate(() => document.querySelector('cineflix-app').shadowRoot.activeElement.tagName), 'INPUT');
    await page.click('cineflix-app >>> .filters button:nth-child(2)');
    await page.waitForFunction(() => document.querySelector('cineflix-app').shadowRoot.querySelectorAll('wc-movie-card').length === 3);
    assert.equal(await app(), 3);
    await page.select('cineflix-app >>> select', 'rating');
    await page.waitForFunction(() => document.querySelector('cineflix-app').shadowRoot.querySelector('wc-movie-card').movie.title === 'Interstellar');
    await page.click('cineflix-app >>> .filters button:first-child');
    for (const width of [1440, 768, 390, 320]) {
      await page.setViewport({ width, height: 1000 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `No overflow at ${width}px`);
    }
    await page.setViewport({ width: 1440, height: 1100 });
    await page.screenshot({ path: '/tmp/cineflix-desktop.png', fullPage: true });
    await page.setViewport({ width: 390, height: 844 });
    await page.screenshot({ path: '/tmp/cineflix-mobile.png', fullPage: true });
    assert.deepEqual(errors, []);
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
});
