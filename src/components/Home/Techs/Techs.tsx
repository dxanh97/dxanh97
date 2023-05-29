import React from 'react';
import * as ReactIcons from 'react-icons/all';

import Section from '../Section';
import css from './Techs.module.scss';

const Techs: React.FC<{
  techList: Array<{ name: string; icon: string }>;
}> = ({ techList }) => (
  <Section header="Tech">
    {techList.map((tech) => {
      const Icon = ReactIcons[tech.icon as keyof typeof ReactIcons];
      return (
        <div key={tech.name} className={css['tag']}>
          <div>
            <Icon />
            <span>{tech.name}</span>
          </div>
        </div>
      );
    })}
  </Section>
);

export default Techs;
