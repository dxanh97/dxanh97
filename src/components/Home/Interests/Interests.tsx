import React from 'react';
import * as ReactIcons from 'react-icons/all';

import Section from '../Section';
import css from './Interests.module.scss';

const Interests: React.FC<{
  interestList: Array<{ name: string; icon: string }>;
}> = ({ interestList }) => (
  <Section header="Interests">
    {interestList.map((interest) => {
      const Icon = ReactIcons[interest.icon as keyof typeof ReactIcons];
      return (
        <div key={interest.name} className={css['wrapper']}>
          <Icon />
          <span>{interest.name}</span>
        </div>
      );
    })}
  </Section>
);

export default Interests;
