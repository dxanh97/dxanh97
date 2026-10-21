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
- `src/data/techs.ts` and `src/data/interests.ts`: typed `{ name, icon }` arrays.

### Adding things

- **Experience:** add a Markdown file to `src/content/experiences/` with the front matter above.
- **Tech or interest:** add an entry to the matching array in `src/data/`.
- **Icons** use [Iconify](https://icon-sets.iconify.design/) names in the form `set:icon-name`. Browse the sets and copy the name. The installed sets are `simple-icons`, `tabler`, `ri` and `feather`; for another set, install `@iconify-json/<set>`. A misspelled name fails the build.

## Deployment

Pushes to `master` build and deploy via GitHub Actions (`.github/workflows/deploy.yml`). Pull requests run the build, type check, lint and format check.
