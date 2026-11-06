import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { renderHome, renderNotFound, LOCALES, SITE_URL } from './src/template.mjs';

const dist = new URL('./dist/', import.meta.url).pathname;

async function write(path, content) {
  const file = join(dist, path);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, content);
}

await rm(dist, { recursive: true, force: true });
await cp(new URL('./public/', import.meta.url).pathname, dist, { recursive: true });
await cp(new URL('./src/styles.css', import.meta.url).pathname, join(dist, 'styles.css'));

for (const locale of LOCALES) {
  await write(`${locale.path.slice(1)}index.html`, renderHome(locale));
}
await write('404.html', renderNotFound());

const urls = LOCALES.map(({ path }) => `  <url><loc>${SITE_URL}${path}</loc></url>`).join('\n');
await write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
await write('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`);
