'use client';

import React, { PropsWithChildren } from 'react';
import './globals.scss';
import { Space_Grotesk } from 'next/font/google';

import Cursor from '../components/@Shared/Cursor/Cursor';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

const RootLayout: React.FC<PropsWithChildren> = ({ children }) => (
  <html lang="en">
    <body className={spaceGrotesk.className}>
      <Cursor />
      <div className="scroll-wrapper">{children}</div>
    </body>
  </html>
);

export default RootLayout;
