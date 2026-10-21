# Front-end review

Reviewed on 2026-10-22 at commit `5eaa72d`. Line numbers refer to that commit.

The production build was loaded in headless Chrome at 390×844 (phone) and 1440×900 (desktop). Chrome was started with `--disable-blink-features=AutomationControlled`, because the load animation is skipped whenever `navigator.webdriver` is true (see [M2](#m2-the-load-animation-costs-5s-on-every-visit-and-audits-never-see-it)).

## Summary

| ID                                                                           | Priority | Area          | Finding                                               | Effort |
| ---------------------------------------------------------------------------- | -------- | ------------- | ----------------------------------------------------- | ------ |
| [H1](#h1-on-phones-the-first-screen-stays-blank-for-about-5s)                | High     | Bug           | On phones the first screen stays blank for about 5s   | S      |
| [H2](#h2-the-font-preloads-load-the-wrong-weight)                            | High     | Performance   | Font preloads load the wrong weight                   | S      |
| [H3](#h3-ci-never-runs-on-master)                                            | High     | Tooling       | CI never runs on `master`; deploy has no checks       | S      |
| [M1](#m1-the-custom-cursor-hurts-accessibility)                              | Medium   | Accessibility | Custom cursor hides the native one before JS is ready | S      |
| [M2](#m2-the-load-animation-costs-5s-on-every-visit-and-audits-never-see-it) | Medium   | UX            | Load animation replays on every visit; audits skip it | S      |
| [M3](#m3-the-years-of-experience-will-go-stale)                              | Medium   | Content       | The yearly rebuild will likely be disabled by GitHub  | S      |
| [M4](#m4-the-landmarks-are-inverted)                                         | Medium   | Accessibility | Name and intro sit in `<aside>`, not `<main>`         | S      |
| [M5](#m5-seo-and-link-previews-are-thin)                                     | Medium   | SEO           | Name not in `<title>`; no `og:image`, card or JSON-LD | M      |
| [M6](#m6-the-theme-colours-are-hard-coded-in-five-places)                    | Medium   | Maintenance   | Theme colours hard-coded in five places               | S      |
| [M7](#m7-font-sizes-are-in-px)                                               | Medium   | Accessibility | px font sizes ignore the browser's font-size setting  | M      |
| [L1–L9](#low-priority)                                                       | Low      | Various       | Line endings, `lang`, README, nits                    | XS     |

Effort: XS < 15 min, S < 1 h, M < half a day.

---

## High priority

### H1. On phones the first screen stays blank for about 5s

**Where:** [Stream.astro:45](../src/components/Stream.astro#L45), [index.astro:57-60](../src/pages/index.astro#L57-L60)

**Problem:** `walk()` skips any element without layout boxes:

```ts
if (!node.getClientRects().length) continue;
```

Below 900px, `<aside>` gets `display: contents`, and such elements never have boxes. So the whole sidebar (name, role, contact links, about, stack, interests) is never tokenised and never gets `.printed`. It stays at `opacity: 0` until `finish()` removes `data-boot`. Meanwhile the career log streams in below the fold.

**Evidence (390×844):**

| Time  | `data-boot` | `h1.name` opacity | First `.entry h3` opacity |
| ----- | ----------- | ----------------- | ------------------------- |
| 1.5 s | streaming   | 0                 | 0                         |
| 3.5 s | streaming   | **0**             | 1                         |
| 5.0 s | removed     | 1 (all at once)   | 1                         |

At 3.5s the first screen was empty apart from the theme toggle. On desktop the sidebar streams correctly.

**Fix:** walk into `display: contents` elements, because their children do have boxes.

```ts
if (node.classList.contains('sr-only')) continue;
// `display: contents` (the aside in one column) has no box of its own,
// but its children do.
if (
  !node.getClientRects().length &&
  getComputedStyle(node).display !== 'contents'
)
  continue;
```

**Follow-up:** in one column, `.interests` is moved below the career log with `order: 1` ([index.astro:62-66](../src/pages/index.astro#L62-L66)), but tokens follow DOM order. Interests will stream before the log, so the caret jumps down past the log and back up. Either accept that, or stream `.interests` last on narrow screens. For example, in one column, move its tokens to the end of `tokens` before scheduling.

**Done when:** at 390px wide, `h1.name` reaches opacity 1 well before the career log starts.

### H2. The font preloads load the wrong weight

**Where:** [BaseLayout.astro:9-11](../src/layouts/BaseLayout.astro#L9-L11), [BaseLayout.astro:42-44](../src/layouts/BaseLayout.astro#L42-L44), [README.md:45](../README.md#L45)

**Problem:** the page preloads the **400** latin, latin-ext and Vietnamese subsets "because the name needs all three". But the name is the `<h1>`, which renders at **700** (`font-weight: 750`, and only 400 and 700 are bundled).

**Evidence:** every visible character outside Latin-1, with its weight:

| Character  | Element  | Weight  | Subset needed   |
| ---------- | -------- | ------- | --------------- |
| Đ (U+0110) | `<h1>`   | 750→700 | latin-ext       |
| ặ (U+1EB7) | `<h1>`   | 750→700 | vietnamese      |
| ’ (U+2019) | `<span>` | 400     | latin           |
| → (U+2192) | `<span>` | 400     | none (fallback) |

Nothing at 400 needs latin-ext or Vietnamese. Two of the three preloads (about 23 KB of woff2) fetch files nothing renders, and the three 700 files the name needs are found only after styles are computed.

**Fix:**

```astro
import latin400 from
'@fontsource/space-mono/files/space-mono-latin-400-normal.woff2?url'; import
latin700 from
'@fontsource/space-mono/files/space-mono-latin-700-normal.woff2?url'; import
latinExt700 from
'@fontsource/space-mono/files/space-mono-latin-ext-700-normal.woff2?url'; import
vietnamese700 from
'@fontsource/space-mono/files/space-mono-vietnamese-700-normal.woff2?url'; ---
{[latin400, latin700, latinExt700, vietnamese700].map((href) => (
  <link rel="preload" as="font" type="font/woff2" href={href} crossorigin />
))}
```

Update README.md:45 to say the **bold** subsets are preloaded for the name.

**Done when:** the Network panel shows no `*-latin-ext-400-*` or `*-vietnamese-400-*` request on a cold load, and the three 700 files are requested as preloads.

### H3. CI never runs on `master`

**Where:** [ci.yml:3-4](../.github/workflows/ci.yml#L3-L4), [deploy.yml:21-29](../.github/workflows/deploy.yml#L21-L29)

**Problem:** CI only runs on `pull_request`. The history has 47 commits and no merge commits, so if work goes straight to `master`, `astro check`, ESLint and Prettier never run. The deploy job builds and ships without them.

**Fix:** make CI reusable and gate the deploy on it.

```yaml
# ci.yml
on:
  pull_request:
  workflow_call:
```

```yaml
# deploy.yml
jobs:
  ci:
    uses: ./.github/workflows/ci.yml

  build:
    needs: ci
    # …unchanged
```

**Done when:** a push to `master` with a lint error fails and does not deploy.

---

## Medium priority

### M1. The custom cursor hurts accessibility

**Where:** [global.scss:44-50](../src/styles/global.scss#L44-L50), [Cursor.astro:13-18](../src/components/Cursor.astro#L13-L18)

**Problems:**

- `cursor: none` comes from CSS, so it applies before the script runs. If the script fails or is slow, a mouse user has no cursor at all.
- It overrides the OS pointer size and colour settings that low-vision users rely on, and removes the text-selection I-beam.
- In forced-colors mode (Windows High Contrast) colours are replaced with system colours, so the dot's fill no longer shows as intended.

**Fix:** hide the native cursor only once the custom one is running, and never in forced-colors mode.

```ts
// Cursor.astro
if (
  $wrapper &&
  !$wrapper.dataset.ready &&
  matchMedia('(pointer: fine)').matches &&
  !matchMedia('(forced-colors: active)').matches
) {
  $wrapper.dataset.ready = '';
  document.documentElement.dataset.cursor = '';
  // …
```

```scss
// global.scss: replaces the `@media (pointer: fine)` block inside `body`
:root[data-cursor] {
  &,
  a,
  button {
    cursor: none;
  }
}
@media (forced-colors: active) {
  .cursor-wrapper {
    display: none;
  }
}
```

Also worth considering: keep the native cursor and treat the ring as an extra follower. That keeps the effect and drops every problem above.

**Done when:** blocking the script still leaves a native cursor, and forced-colors emulation in DevTools shows the native cursor.

### M2. The load animation costs 5s on every visit, and audits never see it

**Where:** [BaseLayout.astro:61-75](../src/layouts/BaseLayout.astro#L61-L75), [Stream.astro:18-21](../src/components/Stream.astro#L18-L21)

**Problems:**

- The full page is visible only after about 5s (500ms blank + typing + 1s wait + 3s stream + fade). It replays on every reload and every visit, including recruiters returning to the tab.
- The `navigator.webdriver` bypass means Lighthouse and PageSpeed lab runs never measure the animation, so lab scores overstate what visitors get.
- For the same reason, no automated test can exercise the animation, which is how [H1](#h1-on-phones-the-first-screen-stays-blank-for-about-5s) went unnoticed.

**Fix:**

1. Play it once per session. Record it when streaming starts:

   ```js
   // BaseLayout head script
   let seen = false;
   try {
     seen = sessionStorage.streamed === '1';
   } catch {
     // storage unavailable; always stream
   }
   const forced = new URLSearchParams(location.search).has('stream');
   if (
     forced ||
     (!seen &&
       !matchMedia('(prefers-reduced-motion: reduce)').matches &&
       !navigator.webdriver)
   ) {
     // …existing boot code
   }
   ```

   ```ts
   // Stream.astro, right after `root.dataset.boot = 'streaming';`
   try {
     sessionStorage.streamed = '1';
   } catch {
     // storage unavailable
   }
   ```

2. `?stream` forces the animation, even under automation, so a Playwright test can check H1 at phone width.
3. Optionally shorten `DURATION`, or let the sidebar finish first.
4. Update the "Load animation" paragraph in [README.md:48](../README.md#L48).

**Done when:** a reload in the same tab shows the page at once, and `/?stream` always animates.

### M3. The years of experience will go stale

**Where:** [deploy.yml:7-9](../.github/workflows/deploy.yml#L7-L9), [About.astro:59](../src/components/About.astro#L59), [profile.mdx:7](../src/content/profile.mdx#L7)

**Problems:**

- "Over **8** years" is computed at build time and refreshed by a yearly cron. GitHub disables scheduled workflows in public repos after 60 days without repository activity, so the cron will probably never fire on a quiet portfolio repo.
- `careerStart: 2018` does not match the career log, which starts at HiSoft in `2017-03`. If that is intentional (e.g. HiSoft was an internship), leave a comment in `profile.mdx`.

**Fix (pick one):**

- **Simplest:** reword to a fixed fact that never goes stale, e.g. "professional experience since 2018".
- **Keep the number:** render it in a `<span data-since="2018">` and refresh it with a few lines of inline script, keeping the build-time value as the no-JS fallback. Then drop the cron.
- Optionally derive `careerStart` from the earliest experience `start` instead of storing it twice.

**Done when:** the number is correct without a rebuild, or there is no number to go stale.

### M4. The landmarks are inverted

**Where:** [index.astro:14-28](../src/pages/index.astro#L14-L28), [print.scss:67-70](../src/styles/print.scss#L67-L70)

**Problem:** the `<h1>`, intro and contact links sit inside `<aside>`, the "complementary" landmark for secondary content. Screen-reader users who jump to the main landmark land on the career log and skip who you are.

**Fix:** make the whole grid the main landmark and the sidebar a plain container.

```astro
<main class="wrap" data-stream>
  <p class="prompt command" data-clear aria-hidden="true">
    …
  </p>
  <div class="sidebar">
    <About />
    <Techs techList={techs} />
    <div class="interests">…</div>
  </div>
  <div class="career">
    <Experiences />
  </div>
</main>
```

Rename the `aside` and `main` selectors in `index.astro`'s styles and in `print.scss` to `.sidebar` and `.career`.

**Done when:** the accessibility tree shows one `main` landmark containing the `<h1>` and no `complementary` landmark.

### M5. SEO and link previews are thin

**Where:** [BaseLayout.astro:13-31](../src/layouts/BaseLayout.astro#L13-L31)

**Problems:**

- The `<title>` is `<dxanh97 />`, so your name, the main thing people search for, is missing from the strongest on-page signal.
- With no `og:image` or `twitter:card`, links shared on LinkedIn, Slack or X show no image.
- There's no structured data tying the site to your GitHub and LinkedIn profiles.
- There's no `apple-touch-icon`.

**Fix:**

```astro
---
import { getEntry } from 'astro:content';
const profile = await getEntry('profile', 'profile');
const { name, role, github, linkedin } = profile!.data;
const title = `${name} · ${role}`; // or keep the brand: `<dxanh97 /> · ${name}`
const ogImage = new URL('/og.png', Astro.site);
const person = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name,
  jobTitle: role,
  url: Astro.site,
  sameAs: [github, linkedin],
};
---

<meta property="og:image" content={ogImage} />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<script type="application/ld+json" set:html={JSON.stringify(person)} />
```

Add `public/og.png` (1200×630; a screenshot of the hero in the terminal style works well) and `public/apple-touch-icon.png` (180×180).

**Done when:** the LinkedIn Post Inspector and the Rich Results Test show the image and the `Person` data.

### M6. The theme colours are hard-coded in five places

**Where:** [global.scss:3,13](../src/styles/global.scss#L1-L19), [BaseLayout.astro:32-41](../src/layouts/BaseLayout.astro#L32-L41), [BaseLayout.astro:50](../src/layouts/BaseLayout.astro#L50), [ThemeToggle.astro:23](../src/components/ThemeToggle.astro#L23), [print.scss:8-16](../src/styles/print.scss#L8-L16)

**Problem:** `#fafafa` and `#0a0a0a` are repeated, so changing a background colour means remembering five files.

**Fix:**

```ts
// src/data/theme.ts
export const themeColors = { light: '#fafafa', dark: '#0a0a0a' } as const;
```

- **BaseLayout:** use `themeColors.light` and `themeColors.dark` in the two `theme-color` metas. Pass the colours to the head script with `<script is:inline define:vars={{ themeColors }}>`, then `const color = themeColors[theme];`.
- **ThemeToggle:** `import { themeColors } from '@/data/theme';`. Alternatively, after setting `data-theme`, read `getComputedStyle(root).getPropertyValue('--bg')` so the SCSS token is the only source.
- **SCSS:** it can't import TS, so leave a comment next to `--bg` pointing at `theme.ts`.

**Done when:** grepping for `#fafafa` finds only `global.scss`, `theme.ts` and `print.scss`.

### M7. Font sizes are in px

**Where:** [global.scss:39-42](../src/styles/global.scss#L39-L42), [global.scss:84](../src/styles/global.scss#L84), [About.astro:66,72,92](../src/components/About.astro#L64-L93), [Experiences.astro:74,78](../src/components/Experiences.astro#L71-L79), [Techs.astro:56-57,65-66,80,86](../src/components/Techs.astro#L53-L91), [ThemeToggle.astro:106](../src/components/ThemeToggle.astro#L106)

**Problems:**

- All 9 font sizes are px, so the page ignores the browser's default font-size setting (zoom still works).
- `16.25px` is repeated 5 times.
- The tree connectors are tied to px line metrics (`line-height: 30px`, `top: 16px`, `height: 16px`) and would break if the text size changed.

**Fix:**

```scss
// global.scss
:root {
  --text-sm: 1.015625rem; // 16.25px
  --text-md: 1.09375rem; // 17.5px  (.prompt)
  --text-base: 1.171875rem; // 18.75px (body)
}
```

- Use these tokens everywhere. Convert the headings: 40px → 2.5rem, 36px → 2.25rem, 25px → 1.5625rem.
- Make the tree line metrics relative:

```scss
// Techs.astro
.tree {
  line-height: 1.85; // was 30px at 16.25px
  li {
    &:last-child::before {
      height: calc(1px + 0.5lh); // was 16px: padding + half a line
    }
    &::after {
      top: calc(1px + 0.5lh);
    }
  }
}
```

**Done when:** after changing Chrome's font size to "Large", the text scales and the tree branches still meet the rows.

---

## Low priority

| ID  | Where                                                                                                                | Problem                                                                                                                                                    | Suggestion                                                                                                                                                                                          |
| --- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| L1  | repo root                                                                                                            | `npm run format:check` fails on 25 files on Windows. They are only CRLF line endings, from `core.autocrlf=true`. CI passes because it checks out on Linux. | Add `.gitattributes` with `* text=auto eol=lf`. With a clean tree, re-checkout once: `git rm -r --cached . && git reset --hard`. (Quicker but weaker: `"endOfLine": "auto"` in `.prettierrc.json`.) |
| L2  | [About.astro:37](../src/components/About.astro#L37)                                                                  | The page is `lang="en"`, so screen readers mispronounce "Đặng Xuân Anh".                                                                                   | `<h1 class="name" lang="vi">`                                                                                                                                                                       |
| L3  | [README.md:30](../README.md#L30), [README.md:34](../README.md#L34)                                                   | It lists the `ri` icon set (removed in `757895e`) and calls the toggle a `[dark]` / `[light]` button (it is now moon/sun icons).                           | Update both lines. Also cover the H2 and M2 changes once made.                                                                                                                                      |
| L4  | [About.astro:67](../src/components/About.astro#L67), [Experiences.astro:79](../src/components/Experiences.astro#L79) | `font-weight: 750` and `650` both render as 700, the only bold weight bundled.                                                                             | Use `700` so the CSS says what renders.                                                                                                                                                             |
| L5  | [global.scss:62-66](../src/styles/global.scss#L62-L66)                                                               | `:focus-visible { border-radius: 4px }` changes the corners of the 6px-radius contact links and theme toggle while they are focused.                       | Remove `border-radius`; outlines follow the element's own radius.                                                                                                                                   |
| L6  | [global.scss:68-78](../src/styles/global.scss#L68-L78)                                                               | `.sr-only` relies on the deprecated `clip`.                                                                                                                | Add `clip-path: inset(50%);` and keep `clip` as the fallback.                                                                                                                                       |
| L7  | [Experiences.astro:25-26](../src/components/Experiences.astro#L25-L26)                                               | `→` is not in Space Mono's subsets, so it renders in a fallback font, and screen readers announce "right arrow".                                           | `<span aria-hidden="true">→</span><span class="sr-only">to</span>`. Consider an ASCII `->` to stay in the font.                                                                                     |
| L8  | [techs.ts:24-25](../src/data/techs.ts#L24-L25)                                                                       | "NextJS" and "NodeJS" are not the official names, which matters for recruiter and ATS keyword searches.                                                    | `Next.js`, `Node.js`. The tree still lowercases them.                                                                                                                                               |
| L9  | [astro.config.mjs:9](../astro.config.mjs#L9)                                                                         | Every build warns `[astro-icon] Failed to load icons from "src/icons"`.                                                                                    | Add `src/icons/.gitkeep`. Check that astro-icon ignores non-SVG files; if not, add a tiny local SVG instead.                                                                                        |

---

## Checked and fine

These were checked and need no action:

- `npm run build`, `npm run check` (0 errors, warnings or hints) and `npm run lint` pass.
- **Contrast passes WCAG AA for all text:**

  | Pair            | Light  | Dark    |
  | --------------- | ------ | ------- |
  | muted on bg     | 6.41:1 | 6.12:1  |
  | accent on bg    | 5.37:1 | 16.69:1 |
  | muted on `.tag` | 5.66:1 | 5.54:1  |
  | `::selection`   | 5.37:1 | 16.69:1 |

- `@astrojs/markdown-satteri` looks unused, but it is Astro's configured Markdown processor. Keep it.
- Reduced motion, no-JS (the page renders without `data-boot`), the 3s boot fallback and the print stylesheet all behave as described in the README.
- The production page is about 59 KB of HTML (20 KB gzipped) with CSS inlined. Nothing else blocks rendering.
