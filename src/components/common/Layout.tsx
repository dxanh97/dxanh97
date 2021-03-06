import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import styled, { ThemeProvider } from 'styled-components';

import { themes } from '../../constants/index';
import { Theme } from '../../models/index';
import Container from './Container';
import ThemePicker from './ThemePicker';

import '../../styles.css';

const Wrapper = styled.div`
  display: flex;
  min-height: calc(100vh - 32px);
  background: ${(props) => props.theme.backdrop};
  color: ${(props) => props.theme.text};
`;
const TopBar = styled.div`
  position: relative;
  background: ${(props) => props.theme.topBar};
  height: 32px;
`;

const Layout: React.FC = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(Object.values(themes)[0]);

  return (
    <ThemeProvider theme={theme}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{'<dxanh97 />'}</title>
        <link
          rel="icon"
          type="image/png"
          href="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/apple/279/rose_1f339.png"
        />
      </Helmet>
      <TopBar>
        <ThemePicker onSelect={setTheme} />
      </TopBar>
      <Wrapper>
        <Container>{children}</Container>
      </Wrapper>
    </ThemeProvider>
  );
};

export default Layout;
