import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const profile = defineCollection({
  loader: glob({ pattern: 'profile.mdx', base: './src/content' }),
  schema: z.object({
    name: z.string().min(1),
    role: z.string().min(1),
    email: z.string().min(1),
    github: z.url(),
    linkedin: z.url(),
    careerStart: z.number().int(),
  }),
});

const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Expected YYYY-MM');

const experiences = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/experiences' }),
  schema: z
    .object({
      role: z.string().min(1),
      company: z.string().min(1),
      companyUrl: z.url(),
      start: month,
      end: month.optional(),
    })
    .refine((x) => !x.end || x.end > x.start, {
      message: 'end must be after start',
      path: ['end'],
    }),
});

export const collections = { profile, experiences };
