import { CircularProgress } from '@mui/material';
import { html } from 'htm/preact';
import { Route, Routes } from 'react-router-dom';
import { useRecoilValueLoadable } from 'recoil';

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

  return html`
    <${S.App}>
      <${Header} />
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
