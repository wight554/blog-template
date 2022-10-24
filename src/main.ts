import 'preact/debug';

import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { html } from 'htm/react';
import { render } from 'preact';
import { createBrowserRouter, LoaderFunction, redirect, RouterProvider } from 'react-router-dom';

import { App } from '#src/components/App/index.js';

import { Login } from './components/Login/Login.js';
import { PostsList } from './components/PostsList/PostsList.js';
import { SignUp } from './components/SignUp/SignUp.js';
import { postsQuery } from './services/post.js';
import { userQuery } from './services/user.js';

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

export const userLoader =
  (queryClient: QueryClient): LoaderFunction =>
  async () => {
    if (!queryClient.getQueryData(userQuery.queryKey)) {
      await queryClient.fetchQuery(userQuery);
    }
  };

export const postsLoader =
  (queryClient: QueryClient): LoaderFunction =>
  async () => {
    if (!queryClient.getQueryData(postsQuery.queryKey)) {
      await queryClient.fetchQuery(postsQuery);
    }
  };

const waitUntilUserLoaded = (queryClient: QueryClient) =>
  new Promise((resolve) => {
    const interval = setInterval(() => {
      console.log(queryClient.isFetching(userQuery.queryKey));
      if (!queryClient.isFetching(userQuery.queryKey)) {
        clearInterval(interval);

        resolve(queryClient.getQueryData(userQuery.queryKey));
      }
    }, 50);
  });

export const redirectLoader =
  (queryClient: QueryClient): LoaderFunction =>
  async () => {
    const user = await waitUntilUserLoaded(queryClient);

    if (user) {
      return redirect('/');
    }
  };

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 3600, // 1h
    },
  },
});

const router = createBrowserRouter([
  {
    path: '/',
    element: html`<${App} />`,
    loader: userLoader(queryClient),
    children: [
      {
        index: true,
        element: html`<${PostsList} />`,
        loader: postsLoader(queryClient),
      },
      {
        path: 'login',
        element: html`<${Login} />`,
        loader: redirectLoader(queryClient),
      },
      {
        path: 'sign-up',
        element: html`<${SignUp} />`,
        loader: redirectLoader(queryClient),
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
