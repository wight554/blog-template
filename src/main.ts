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
      main: '#38235c',
    },
    secondary: {
      main: '#B83A4C',
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
