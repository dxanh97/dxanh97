/* eslint-disable react/no-danger */
import React from 'react';

import Section from '../Section';
import css from './Experiences.module.scss';

const Experiences: React.FC<{
  experienceList: Array<{
    role: string;
    company: string;
    companyUrl: string;
    period: [string, string?];
    brief: string;
  }>;
}> = ({ experienceList }) => (
  <Section header="Experiences">
    {experienceList.map((experience) => (
      <div key={experience.period[0]} className={css['wrapper']}>
        <p className={css['company-role']}>
          <b>{experience.role}</b>
          &nbsp;at&nbsp;
          <b>
            <a href={experience.companyUrl} target="_blank" rel="noreferrer">
              {experience.company}
            </a>
          </b>
        </p>
        <span className={css['period']}>{`${experience.period[0]} — ${
          experience.period[1] ?? 'Present'
        }`}</span>
        <div className={css['brief']}>
          <div dangerouslySetInnerHTML={{ __html: experience.brief }} />
        </div>
      </div>
    ))}
  </Section>
);

export default Experiences;
