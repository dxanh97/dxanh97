export const techCategories = [
  'languages',
  'frontend',
  'backend',
  'cloud',
  'tooling',
] as const;

export type TechCategory = (typeof techCategories)[number];

const techs: Array<{ name: string; icon: string; category: TechCategory }> = [
  {
    name: 'JavaScript',
    icon: 'simple-icons:javascript',
    category: 'languages',
  },
  {
    name: 'TypeScript',
    icon: 'simple-icons:typescript',
    category: 'languages',
  },
  { name: 'React', icon: 'simple-icons:react', category: 'frontend' },
  { name: 'Redux', icon: 'simple-icons:redux', category: 'frontend' },
  { name: 'NextJS', icon: 'simple-icons:nextdotjs', category: 'frontend' },
  { name: 'NodeJS', icon: 'simple-icons:nodedotjs', category: 'backend' },
  { name: 'NestJS', icon: 'simple-icons:nestjs', category: 'backend' },
  { name: 'AWS', icon: 'simple-icons:amazonaws', category: 'cloud' },
  { name: 'Serverless', icon: 'simple-icons:serverless', category: 'cloud' },
  { name: 'Firebase', icon: 'simple-icons:firebase', category: 'cloud' },
  {
    name: 'GitHub Actions',
    icon: 'simple-icons:githubactions',
    category: 'tooling',
  },
  { name: 'Git', icon: 'simple-icons:git', category: 'tooling' },
  { name: 'ESLint', icon: 'simple-icons:eslint', category: 'tooling' },
  { name: 'Prettier', icon: 'simple-icons:prettier', category: 'tooling' },
  { name: 'Vim', icon: 'simple-icons:vim', category: 'tooling' },
];

export default techs;
