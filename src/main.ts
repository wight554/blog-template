import 'preact/debug';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { html } from 'htm/preact';
import { render } from 'preact';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { App } from '#src/components/App/index.js';
import './index.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3A61B6',
    },
    secondary: {
      main: '#B63AB4',
    },
    background: {
      default: '#673ab8',
    },
  },
});

render(
  html`
    <${RecoilRoot}>
      <${BrowserRouter}>
        <${ThemeProvider} theme=${theme}>
          <${CssBaseline} />
          <${App} />
        <//>
      <//>
    <//>
  `,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  document.getElementById('app')!,
);
