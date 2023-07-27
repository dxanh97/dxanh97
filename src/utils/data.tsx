/* eslint-disable import/prefer-default-export */
import fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

const directory = join(process.cwd(), 'public/data');

const getAbout = (): {
  name: string;
  role: string;
  email: string;
  github: string;
  linkedin: string;
  introduction: string;
} => {
  const path = join(directory, 'about.md');
  const fileContents = fs.readFileSync(path, 'utf-8');
  const { data, content } = matter(fileContents);
  const { name, role, email, github, linkedin } = data;
  return { name, role, email, github, linkedin, introduction: content };
};

const getNamesAndIcons = (
  category: string,
): Array<{ name: string; icon: string }> => {
  const path = join(directory, `${category}.md`);
  const fileContents = fs.readFileSync(path, 'utf-8');
  const { data } = matter(fileContents);
  return data[category].map((x: string) => {
    const [name, icon] = x.split('|');
    return { name, icon };
  });
};

const getExperiences = (): Array<{
  role: string;
  company: string;
  companyUrl: string;
  period: [string, string?];
  brief: string;
}> => {
  const files = fs.readdirSync(join(directory, 'experiences'));
  return files
    .map((file) => {
      const path = join(directory, `experiences/${file}`);
      const fileContents = fs.readFileSync(path, 'utf-8');
      const { data, content } = matter(fileContents);
      const { role, company, companyUrl, period, order } = data;
      return { role, company, companyUrl, period, brief: content, order };
    })
    .sort((a, b) => b.order - a.order);
};

const getData = () => {
  const about = getAbout();
  const techs = getNamesAndIcons('techs');
  const interests = getNamesAndIcons('interests');
  const experiences = getExperiences();

  return {
    about,
    techs,
    interests,
    experiences,
  };
};

export default getData;
