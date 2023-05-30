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
    {experienceList.map((experience) => {
      const { role, period, company, companyUrl, brief } = experience;
      const [from, to = 'Present'] = period;
      return (
        <div key={company} className={css['wrapper']}>
          <p className={css['company-role']}>
            <b>{role}</b>
            &nbsp;at&nbsp;
            <b>
              <a href={companyUrl} target="_blank" rel="noreferrer">
                {company}
              </a>
            </b>
          </p>
          <span className={css['period']}>{`${from} — ${to}`}</span>
          <div className={css['brief']}>
            <div dangerouslySetInnerHTML={{ __html: brief }} />
          </div>
        </div>
      );
    })}
  </Section>
);

export default Experiences;
