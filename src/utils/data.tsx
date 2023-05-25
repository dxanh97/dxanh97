/* eslint-disable import/prefer-default-export */
import fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

const directory = join(process.cwd(), 'public/data');

const getAbout = () => {
  const path = join(directory, 'about.md');
  const fileContents = fs.readFileSync(path, 'utf-8');
  const { data, content } = matter(fileContents);
  return { data, content };
};

const getNamesAndIcons = (category: string) => {
  const path = join(directory, `${category}.md`);
  const fileContents = fs.readFileSync(path, 'utf-8');
  const { data } = matter(fileContents);
  return data[category].map((x: string) => {
    const [name, icon] = x.split('|');
    return { name, icon };
  });
};

const getExperiences = () => {
  const files = fs.readdirSync(join(directory, 'experiences'));
  return files.map((file) => {
    const path = join(directory, `experiences/${file}`);
    const fileContents = fs.readFileSync(path, 'utf-8');
    const { data, content } = matter(fileContents);
    return { data, content };
  });
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
