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

- `src/content/profile.mdx`: name, role, contact links, `careerStart` and the intro. The years of experience are computed at build time.
- `src/content/experiences/*.md`: one file per job. Front matter: `role`, `company`, `companyUrl`, `start` and optional `end` (`YYYY-MM`). The body is Markdown; bold only clients and products. Entries are sorted by `start`, newest first.
- `src/data/techs.ts` and `src/data/interests.ts`: typed `{ name, icon }` arrays. Techs render as `--name` tags.

### Adding things

- **Experience:** add a Markdown file to `src/content/experiences/` with the front matter above.
- **Tech or interest:** add an entry to the matching array in `src/data/`.
- **Icons** use [Iconify](https://icon-sets.iconify.design/) names in the form `set:icon-name`. Browse the sets and copy the name. The installed sets are `simple-icons`, `tabler`, `ri` and `feather`; for another set, install `@iconify-json/<set>`. A misspelled name fails the build.

## Design

A terminal-style theme: monospace type, shell-prompt section headings and a `git log` career timeline. It follows the system light/dark setting until the `[ dark ]` / `[ light ]` button sets a choice, which is saved in `localStorage`.

| Token      | Light     | Dark      |
| ---------- | --------- | --------- |
| `--bg`     | `#fafafa` | `#0a0a0a` |
| `--panel`  | `#ffffff` | `#111111` |
| `--ink`    | `#0a0a0a` | `#e8e8e8` |
| `--muted`  | `#5c5c5c` | `#8f8f8f` |
| `--accent` | `#4a7300` | `#c6ff00` |
| `--line`   | `#e3e3e3` | `#262626` |

- **Font:** [JetBrains Mono](https://www.jetbrains.com/lp/mono/) via `@fontsource-variable/jetbrains-mono`. The latin, latin-ext and Vietnamese subsets are preloaded because the name needs all three.
- **Styles:** tokens, base styles and the shared `.prompt` style in `src/styles/global.scss`; print (A4 CV) rules in `src/styles/print.scss`; everything else is scoped inside each component in `src/components/`.
- **Lowercase is CSS only** (`text-transform`). Content stays properly capitalised for search engines, screen readers and print.
- **Section headings** are `<h2>` prompts whose visible text is decorative (`aria-hidden`); screen readers hear the plain section name.

## Deployment

Pushes to `master` build and deploy via GitHub Actions (`.github/workflows/deploy.yml`). Pull requests run the build, type check, lint and format check.
