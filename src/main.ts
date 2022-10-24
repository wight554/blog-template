import 'preact/debug';

import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { html } from 'htm/preact';
import { render } from 'preact';
import { BrowserRouter } from 'react-router-dom';

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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

render(
  html`
    <${QueryClientProvider} client=${queryClient}>
      <${ReactQueryDevtools} position="bottom-right" />
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
