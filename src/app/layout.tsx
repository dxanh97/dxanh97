/* eslint-disable @typescript-eslint/naming-convention */
import React, { PropsWithChildren } from 'react';
import './globals.scss';
import { Space_Grotesk } from 'next/font/google';

const space_grotesk = Space_Grotesk({ subsets: ['latin'] });

const RootLayout: React.FC<PropsWithChildren> = ({ children }) => (
  <html lang="en">
    <body className={space_grotesk.className}>{children}</body>
  </html>
);

export default RootLayout;
