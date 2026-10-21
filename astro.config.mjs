// @ts-check
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';

import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://dxanh97.dev',
  integrations: [icon(), mdx()],
  build: { inlineStylesheets: 'always' },
});
