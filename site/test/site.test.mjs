import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { LOCALES } from '../src/template.mjs';

const dist = (path) => new URL(`../dist/${path}`, import.meta.url);
const page = (locale) => readFile(dist(`${locale.path.slice(1)}index.html`), 'utf8');

/** 把文案展开成 路径→值，数组也按下标展开，这样能发现条目数不一致 */
function flatten(value, prefix = '') {
  if (typeof value !== 'object') return { [prefix]: value };
  return Object.entries(value).reduce((all, [key, child]) => ({ ...all, ...flatten(child, `${prefix}.${key}`) }), {});
}

test('every language has the same copy keys', () => {
  const [base, ...rest] = LOCALES.map((l) => Object.keys(flatten(l.copy)).sort());
  for (const keys of rest) assert.deepEqual(keys, base);
});

test('no copy is empty', () => {
  for (const locale of LOCALES) {
    for (const [key, value] of Object.entries(flatten(locale.copy))) assert.ok(String(value).trim(), `${locale.code}${key}`);
  }
});

test('each page declares its language and links all alternates', async () => {
  for (const locale of LOCALES) {
    const html = await page(locale);
    assert.match(html, new RegExp(`<html lang="${locale.html}">`));
    assert.match(html, new RegExp(`rel="canonical" href="https://mypenlit.com${locale.path}"`));
    for (const other of LOCALES) assert.match(html, new RegExp(`hreflang="${other.html}" href="https://mypenlit.com${other.path}"`));
    assert.match(html, /hreflang="x-default"/);
  }
});

test('the home page is English', async () => {
  assert.equal(LOCALES.find((l) => l.path === '/').code, 'en');
  assert.match(await readFile(dist('index.html'), 'utf8'), /Turn words into <em>value<\/em>/);
});

test('pages run no scripts and load nothing from other sites', async () => {
  for (const locale of LOCALES) {
    const html = await page(locale);
    assert.doesNotMatch(html, /<script|style="|<iframe/);
    for (const [, url] of html.matchAll(/(?:src|<link rel="stylesheet" href)="([^"]+)"/g)) assert.match(url, /^\//);
  }
  const css = await readFile(dist('styles.css'), 'utf8');
  assert.doesNotMatch(css, /@import/);
  for (const [, url] of css.matchAll(/url\("?([^")]+)/g)) {
    assert.match(url, /^\/fonts\//);
    await readFile(dist(url.slice(1)));
  }
});

test('in-page links have a target', async () => {
  for (const locale of LOCALES) {
    const html = await page(locale);
    for (const [, id] of html.matchAll(/href="#([^"]+)"/g)) assert.match(html, new RegExp(`id="${id}"`));
  }
});

test('local assets exist', async () => {
  for (const file of ['mark.svg', 'og.png', 'apple-touch-icon.png', 'styles.css', '404.html', 'sitemap.xml', 'robots.txt', '_headers']) {
    await readFile(dist(file));
  }
});

test('the public site does not name internal details', async () => {
  for (const locale of LOCALES) assert.doesNotMatch(await page(locale), /pencursor|pencur|open[- ]source/i);
});
