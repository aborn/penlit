import en from './i18n/en.mjs';
import zh from './i18n/zh.mjs';
import ja from './i18n/ja.mjs';

export const SITE_URL = 'https://mypenlit.com';
const REPO_URL = 'https://github.com/aborn/penlit';
const SKILLS_URL = `${REPO_URL}/tree/main/skills`;

export const LOCALES = [
  { code: 'en', html: 'en', path: '/', label: 'EN', name: 'English', copy: en },
  { code: 'zh', html: 'zh-Hans', path: '/zh/', label: '中文', name: '简体中文', copy: zh },
  { code: 'ja', html: 'ja', path: '/ja/', label: '日本語', name: '日本語', copy: ja },
];

const MCP_TOOLS = ['penlit_search', 'penlit_read_file', 'penlit_patch_file', 'penlit_tasks_list', 'penlit_journal_search'];

const escapeHtml = (text) =>
  String(text).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

/** 文案里的 `x` 渲染成行内代码 */
const rich = (text) => escapeHtml(text).replace(/`([^`]+)`/g, '<code>$1</code>');

/** 标题里的 *x* 渲染成斜体 */
const display = (text) => escapeHtml(text).replace(/\*([^*]+)\*/g, '<em>$1</em>');

function head(locale, { title, description, indexable }) {
  const alternates = LOCALES.map(
    (l) => `<link rel="alternate" hreflang="${l.html}" href="${SITE_URL}${l.path}">`,
  ).join('\n  ');
  const seo = indexable
    ? `<link rel="canonical" href="${SITE_URL}${locale.path}">
  ${alternates}
  <link rel="alternate" hreflang="x-default" href="${SITE_URL}/">`
    : '<meta name="robots" content="noindex">';
  return `<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="color-scheme" content="light dark">
  <meta name="theme-color" media="(prefers-color-scheme: light)" content="#F5F0E8">
  <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#12151F">
  ${seo}
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Penlit">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${SITE_URL}${locale.path}">
  <meta property="og:image" content="${SITE_URL}/og.png">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="/mark.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="preload" href="/fonts/newsreader.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/styles.css">
</head>`;
}

function brandLink(locale) {
  return `<a class="brand" href="${locale.path}"><img src="/mark.svg" alt="" width="28" height="28"><span>${escapeHtml(locale.copy.brand)}</span></a>`;
}

function languageSwitch(locale) {
  const links = LOCALES.map((l) => {
    const current = l.code === locale.code ? ' aria-current="true"' : '';
    return `<a href="${l.path}" lang="${l.html}" hreflang="${l.html}" title="${l.name}"${current}>${l.label}</a>`;
  }).join('');
  return `<nav class="langs" aria-label="${escapeHtml(locale.copy.langLabel)}">${links}</nav>`;
}

function header(locale) {
  const { nav, navLabel } = locale.copy;
  return `<header class="site-header">
  <div class="wrap bar">
    ${brandLink(locale)}
    <nav class="nav" aria-label="${escapeHtml(navLabel)}">
      <a href="#why">${escapeHtml(nav.why)}</a>
      <a href="#features">${escapeHtml(nav.features)}</a>
      <a href="#ai">${escapeHtml(nav.ai)}</a>
      <a href="#platforms">${escapeHtml(nav.platforms)}</a>
    </nav>
    ${languageSwitch(locale)}
  </div>
</header>`;
}

function noteSheet(mock) {
  const commits = [
    [mock.c1, mock.t1, 'lit'],
    [mock.c2, mock.t2, ''],
    [mock.c3, mock.t3, ''],
  ];
  return `<figure class="sheet wrap" aria-label="${escapeHtml(mock.label)}">
  <div class="sheet-note" aria-hidden="true">
    <p class="sheet-file">${escapeHtml(mock.file)}</p>
    <p class="sheet-title"><span class="md"># </span>${escapeHtml(mock.heading)}</p>
    <p class="sheet-line">${escapeHtml(mock.linePre)}<del>${escapeHtml(mock.lineDel)}</del> <ins>${escapeHtml(mock.lineIns)}</ins>${escapeHtml(mock.linePost)}</p>
    <p class="sheet-todo"><span class="md">- [x] </span>${escapeHtml(mock.item2)}</p>
    <p class="sheet-todo"><span class="md">- [ ] </span>${escapeHtml(mock.item1)}</p>
  </div>
  <div class="sheet-log" aria-hidden="true">
    <p class="label">${escapeHtml(mock.history)}</p>
    <ol>
      ${commits.map(([text, time, cls]) => `<li class="${cls}"><span>${escapeHtml(text)}</span><time>${escapeHtml(time)}</time></li>`).join('\n      ')}
    </ol>
  </div>
</figure>`;
}

function hero({ hero: h, mock }) {
  return `<section class="hero wrap">
  <p class="label">${escapeHtml(h.eyebrow)}</p>
  <h1>${display(h.title)}<span class="lit-dot" aria-hidden="true"></span></h1>
  <div class="hero-foot">
    <p class="trust">${escapeHtml(h.trust)}</p>
    <div>
      <p class="lead">${escapeHtml(h.lead)}</p>
      <p class="actions">
        <a class="more" href="#platforms">${escapeHtml(h.primary)}</a>
        <a class="more" href="${SKILLS_URL}">${escapeHtml(h.secondary)}</a>
      </p>
    </div>
  </div>
</section>
${noteSheet(mock)}`;
}

function chapter(id, label, title, body, extraClass = '') {
  return `<section id="${id}" class="chapter ${extraClass}">
  <div class="wrap thread">
    <p class="label marker">${escapeHtml(label)}</p>
    <div class="chapter-body">
      <h2>${escapeHtml(title)}</h2>
      ${body}
    </div>
  </div>
</section>`;
}

function why({ nav, why: w }) {
  const rows = w.items
    .map((item) => `<li><h3>${escapeHtml(item.title)}</h3><p>${rich(item.text)}</p></li>`)
    .join('\n        ');
  return chapter('why', nav.why, w.title, `<ol class="pillars">
        ${rows}
      </ol>`);
}

function features({ nav, features: f }) {
  const rows = f.items
    .map((item) => `<li><h3>${escapeHtml(item.title)}</h3><p>${rich(item.text)}</p></li>`)
    .join('\n        ');
  return chapter('features', nav.features, f.title, `<ul class="entries">
        ${rows}
      </ul>`);
}

function ai({ nav, ai: a }) {
  const rows = a.items
    .map((item) => `<li><h3>${escapeHtml(item.title)}</h3><p>${rich(item.text)}</p></li>`)
    .join('\n        ');
  return chapter('ai', nav.ai, a.title, `<p class="lead">${escapeHtml(a.lead)}</p>
      <ul class="entries">
        ${rows}
        <li class="tools" aria-label="${escapeHtml(a.terminalLabel)}">${MCP_TOOLS.map((tool) => `<span>${tool}</span>`).join('')}</li>
      </ul>
      <div class="skills">
        <h3>${escapeHtml(a.skillsTitle)}</h3>
        <p>${escapeHtml(a.skillsText)}</p>
        <a class="more" href="${SKILLS_URL}">${escapeHtml(a.skillsCta)}</a>
      </div>`, 'night');
}

function platforms({ nav, platforms: p }) {
  const names = (status) => p.items.filter((item) => item.status === status).map((item) => `<li>${escapeHtml(item.name)}</li>`).join('');
  return chapter('platforms', nav.platforms, p.title, `<ul class="os-list">${names('available')}</ul>
      <p class="os-next"><span>${escapeHtml(p.developing)}</span></p>
      <ul class="os-list small">${names('developing')}</ul>
      <p class="aside">${escapeHtml(p.download)}</p>`);
}

function faq({ faq: f }) {
  const items = f.items
    .map((item) => `<details><summary>${escapeHtml(item.q)}</summary><p>${rich(item.a)}</p></details>`)
    .join('\n        ');
  return chapter('faq', f.title, f.title, `<div class="faq">
        ${items}
      </div>`, 'no-title');
}

function closing({ hero: h }) {
  return `<section class="closing">
  <div class="wrap thread">
    <p class="closing-line"><span class="thread-end" aria-hidden="true"></span>${escapeHtml(h.trust)}</p>
  </div>
</section>`;
}

function footer(locale) {
  const { footer: f } = locale.copy;
  return `<footer class="site-footer">
  <div class="wrap bar">
    ${brandLink(locale)}
    <a href="${REPO_URL}">${escapeHtml(f.github)}</a>
  </div>
</footer>`;
}

export function renderHome(locale) {
  const c = locale.copy;
  return `<!doctype html>
<html lang="${locale.html}">
${head(locale, { title: c.title, description: c.description, indexable: true })}
<body>
<a class="skip" href="#main">${escapeHtml(c.skip)}</a>
${header(locale)}
<main id="main">
${hero(c)}
${why(c)}
${features(c)}
${ai(c)}
${platforms(c)}
${faq(c)}
${closing(c)}
</main>
${footer(locale)}
</body>
</html>
`;
}

export function renderNotFound() {
  const locale = LOCALES[0];
  const links = LOCALES.map(
    (l) => `<section lang="${l.html}"><h1>${escapeHtml(l.copy.notFound.title)}</h1><p>${escapeHtml(l.copy.notFound.text)} <a href="${l.path}">${escapeHtml(l.copy.notFound.home)}</a></p></section>`,
  ).join('\n');
  return `<!doctype html>
<html lang="${locale.html}">
${head(locale, { title: `${locale.copy.notFound.title} | Penlit`, description: locale.copy.description, indexable: false })}
<body>
<main class="not-found wrap">
${brandLink(locale)}
${links}
</main>
</body>
</html>
`;
}
