# dxanh97.dev

Personal portfolio, live at [dxanh97.dev](https://dxanh97.dev/). A static [Astro](https://astro.build) site deployed to GitHub Pages.

## Development

Requires Node.js 22.22 or newer (`.nvmrc` pins 22).

```sh
npm install
npm run dev       # dev server
npm run build     # static build into dist/
npm run preview   # serve dist/
npm run check     # astro check (types)
npm run lint      # ESLint
npm run format    # Prettier (use format:check to verify only)
```

## Content

- `src/content/profile.mdx`: name, role, contact links, `careerStart` and the intro. The years of experience are computed at build time and kept current in the browser by a small inline script (`src/components/About.astro`), so no rebuild is needed when the year changes.
- `src/content/experiences/*.md`: one file per job. Front matter: `role`, `company`, `companyUrl`, `start` and optional `end` (`YYYY-MM`). The body is Markdown; bold only clients and products. Entries are sorted by `start`, newest first.
- `src/data/techs.ts`: typed `{ name, icon, category }` array, rendered as a `tree ./stack` grouped by category. The category order is `techCategories` in the same file.
- `src/data/interests.ts`: typed `{ name, icon }` array.

### Adding things

- **Experience:** add a Markdown file to `src/content/experiences/` with the front matter above.
- **Tech or interest:** add an entry to the matching array in `src/data/`.
- **Icons** use [Iconify](https://icon-sets.iconify.design/) names in the form `set:icon-name`. Browse the sets and copy the name. The installed sets are `simple-icons`, `tabler` and `feather`; for another set, install `@iconify-json/<set>`. A misspelled name fails the build.

## Design

A terminal-style theme: monospace type, shell-prompt section headings and a `git log` career timeline. It follows the system light/dark setting until the moon/sun button sets a choice, which is saved in `localStorage`. The background colours are also in `src/data/theme.ts` (for the `theme-color` metas); change both together.

| Token      | Light     | Dark      |
| ---------- | --------- | --------- |
| `--bg`     | `#fafafa` | `#0a0a0a` |
| `--panel`  | `#ffffff` | `#111111` |
| `--ink`    | `#0a0a0a` | `#e8e8e8` |
| `--muted`  | `#5c5c5c` | `#8f8f8f` |
| `--accent` | `#4a7300` | `#c6ff00` |
| `--line`   | `#e3e3e3` | `#262626` |

- **Font:** [Space Mono](https://fonts.google.com/specimen/Space+Mono) via `@fontsource/space-mono`. The regular latin subset is preloaded for body text, and the **bold** latin, latin-ext and Vietnamese subsets for the name, which needs all three. Font sizes are in `rem` (tokens `--text-sm`, `--text-md` and `--text-base` in `global.scss`) so the browser's font-size setting applies.
- **Styles:** tokens, base styles and the shared `.prompt` style in `src/styles/global.scss`; print (A4 CV) rules in `src/styles/print.scss`; everything else is scoped inside each component in `src/components/`.
- **Lowercase is CSS only** (`text-transform`). Content stays properly capitalised for search engines, screen readers and print.
- **Load animation:** the page starts blank with a blinking caret, types a `curl` command (`command` in `src/pages/index.astro`), waits, clears it and the caret, then streams the page in word by word, each word fading in, like an LLM response (`src/components/Stream.astro`). Content keeps its space while hidden, so nothing shifts. Any key, click, scroll or touch skips to the full page. It plays once per tab session (`sessionStorage`), never with reduced motion, without JavaScript or under automation (`navigator.webdriver`), and the page shows anyway if the script has not started within 3s. Add `?stream` to the URL to force it, even under automation. In one column the interests stream last, after the career log, matching their position on screen. The constants at the top of the script set the timing.
- **Cursor:** a custom ring-and-dot cursor on fine pointers (`src/components/Cursor.astro`). The native cursor is hidden only once the script runs, and never in forced-colors (high contrast) mode.
- **Section headings** are `<h2>` prompts whose visible text is decorative (`aria-hidden`); screen readers hear the plain section name.

## Deployment

Pull requests run the build, type check, lint and format check (`.github/workflows/ci.yml`). Pushes to `master` run the same checks first and deploy only if they pass (`.github/workflows/deploy.yml`).

`public/og.png` (1200×630) is the link preview image and `public/apple-touch-icon.png` (180×180) the home-screen icon; regenerate them if the name or colours change.
