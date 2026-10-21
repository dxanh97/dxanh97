import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const about = defineCollection({
  loader: glob({ pattern: 'about.md', base: './src/content' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    email: z.string(),
    github: z.string(),
    linkedin: z.string(),
  }),
});

const experiences = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/experiences' }),
  schema: z.object({
    order: z.number(),
    role: z.string(),
    company: z.string(),
    companyUrl: z.string(),
    period: z.array(z.string()).min(1).max(2),
  }),
});

export const collections = { about, experiences };
