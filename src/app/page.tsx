import React from 'react';

import { About, Experiences, Interests, Techs } from '../components/Home';
import getData from '../utils/data';

import css from './page.module.scss';

const Home: React.FC = () => {
  const { about, techs, interests, experiences } = getData();
  const { name, role, email, github, linkedin, introduction } = about;

  return (
    <main className={css['wrapper']}>
      <div className={css['information-wrapper']}>
        <div>
          <About
            name={name}
            role={role}
            email={email}
            github={github}
            linkedin={linkedin}
            introduction={introduction}
          />
          <Techs techList={techs} />
          <div className={css['desktop']}>
            <Interests interestList={interests} />
          </div>
        </div>
        <div>
          <Experiences experienceList={experiences} />
          <div className={css['mobile']}>
            <Interests interestList={interests} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
