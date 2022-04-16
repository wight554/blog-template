import { CircularProgress } from '@mui/material';
import { html } from 'htm/preact';
import { StatusCodes } from 'http-status-codes';
import { Route, Routes } from 'react-router-dom';
import { useRecoilCallback, useRecoilValueLoadable } from 'recoil';

import { httpClient } from '@src/api/httpClient';
import { HttpError } from '@src/api/httpError';
import { promiser } from '@src/api/promiser';
import { Header } from '@src/components/Header';
import { Login } from '@src/components/Login';
import { Logo } from '@src/components/Logo';
import { SignUp } from '@src/components/SignUp';
import { userInfoState } from '@src/store/userState';

import { Backdrop } from '../Backdrop';

import * as S from './styles';

export interface LoginPayload {
  username: string;
  password: string;
}

export const App = () => {
  const userLoadable = useRecoilValueLoadable(userInfoState);
  const user = userLoadable.contents;

  const handleLogout = useRecoilCallback(
    ({ set }) =>
      async () => {
        const [data, error] = await promiser(httpClient.post('/api/v1/auth/logout'));

        if (error instanceof HttpError && error.code === StatusCodes.UNAUTHORIZED) {
          console.error(error);
        } else if (error) {
          throw error;
        }
        if (data) set(userInfoState, null);
      },
    [],
  );

  return html`
    <${S.App}>
      <${Header} user=${userLoadable.state === 'hasValue' && user} onLogout=${handleLogout} />
      <${S.MainContent}>
        <${Backdrop} open=${userLoadable.state === 'loading'}>
          <${CircularProgress} color="inherit" />
        <//>
        <${Routes}>
          <${Route}
            path="/"
            element=${html`
              <${S.HelloContainer}>
                <${Logo} />
                <p>Hello ${user?.username || 'User'}!</p>
                <p>
                  <a
                    class="link"
                    href="https://preactjs.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learn Preact!
                  </a>
                </p>
              <//>
            `}
          />
          <${Route} path="/login" element=${html`<${Login} />`} />
          <${Route} path="/sign-up" element=${html`<${SignUp} />`} />
        <//>
      <//>
    <//>
  `;
};
