import React, { PropsWithChildren } from 'react';

import css from './Section.module.scss';

const Section: React.FC<
  PropsWithChildren<{
    header: string;
  }>
> = ({ header, children }) => (
  <>
    <h3 className={css['header']}>{header}</h3>
    {children}
  </>
);

export default Section;
