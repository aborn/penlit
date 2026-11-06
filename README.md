# Penlit

Turn words into value.

Penlit is a writing app built on Git and Markdown. Your notes stay plain files in your own repositories. Learn more at [mypenlit.com](https://mypenlit.com).

This repository holds the public side of the project:

| Folder | Contents |
|---|---|
| [`site/`](site/) | Source of mypenlit.com, in English, Chinese, and Japanese |
| [`skills/`](skills/) | Skills that teach AI agents how to work with Penlit |

## Website

The site has no dependencies and needs Node.js 20 or later. The only script is `public/theme.js`, which remembers the light or dark choice. Everything else, including the animations, is CSS.

```bash
cd site
npm test            # build the pages and check them
npm run preview     # serve dist/ at http://localhost:4321
```

Copy lives in `site/src/i18n/`, one file per language. All three files must have the same keys, and `npm test` fails if they do not.

### Deploy

Cloudflare Pages, connected to this repository:

| Setting | Value |
|---|---|
| Root directory | `site` |
| Build command | `npm run build` |
| Output directory | `dist` |

## License

[`skills/`](skills/) is under the MIT License. The fonts in `site/public/fonts/` are under the SIL Open Font License. The Penlit name and logo are not licensed for reuse.
