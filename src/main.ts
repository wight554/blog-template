import 'preact/debug';

import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { html } from 'htm/react';
import { render } from 'preact';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { queryClient } from '#src/api/queryClient.js';
import { Index, loader as indexLoader } from '#src/routes/index.js';
import { loader as loginLoader, Login } from '#src/routes/login.js';
import { loader as rootLoader, Root } from '#src/routes/root.js';
import { loader as signUpLoader, SignUp } from '#src/routes/sign-up.js';

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
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        #app,
        body,
        html {
          height: 100%;
          width: 100%;
          padding: 0;
          margin: 0;
        }
        
        #app {
          display: flex;
          flex-direction: column;
        }
    `,
    },
  },
});

const router = createBrowserRouter([
  {
    path: '/',
    element: html`<${Root} />`,
    loader: rootLoader(queryClient),
    children: [
      {
        index: true,
        element: html`<${Index} />`,
        loader: indexLoader(queryClient),
      },
      {
        path: 'login',
        element: html`<${Login} />`,
        loader: loginLoader(queryClient),
      },
      {
        path: 'sign-up',
        element: html`<${SignUp} />`,
        loader: signUpLoader(queryClient),
      },
    ],
  },
]);

render(
  html`
    <${QueryClientProvider} client=${queryClient}>
      <${ThemeProvider} theme=${theme}>
        <${CssBaseline} />
        <${ReactQueryDevtools} position="bottom-right" />
        <${RouterProvider} router=${router} />
      <//>
    <//>
  `,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  document.getElementById('app')!,
);
