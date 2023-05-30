import React, { PropsWithChildren } from 'react';

import css from './Section.module.scss';

const Section: React.FC<
  PropsWithChildren<{
    header: string;
  }>
> = ({ header, children }) => (
  <div className={css['wrapper']}>
    <h3>{header}</h3>
    {children}
  </div>
);

export default Section;
