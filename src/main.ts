import 'preact/debug';

import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { html } from 'htm/preact';
import { render } from 'preact';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { App } from '#src/components/App/index.js';

import './index.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#673ab8',
    },
    secondary: {
      main: '#8BB83A',
    },
    background: {
      default: '#242424',
    },
  },
});

const queryClient = new QueryClient();

render(
  html`
    <${RecoilRoot}>
      <${BrowserRouter}>
        <${ThemeProvider} theme=${theme}>
          <${QueryClientProvider} client=${queryClient}>
            <${CssBaseline} />
            <${App} />
          <//>
        <//>
      <//>
    <//>
  `,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  document.getElementById('app')!,
);
