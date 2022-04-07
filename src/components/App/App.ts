import { CircularProgress } from '@mui/material';
import { html } from 'htm/preact';
import { StatusCodes } from 'http-status-codes';
import { useEffect } from 'preact/hooks';
import { Route, Routes } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import { httpClient } from '@src/api/httpClient';
import { Header } from '@src/components/Header';
import { Login } from '@src/components/Login';
import { Logo } from '@src/components/Logo';
import { SignUp } from '@src/components/SignUp';
import { User } from '@src/interfaces/model/User';
import { loadingState } from '@src/store/loadingState';
import { userState } from '@src/store/userState';
import { HttpError } from '@src/utils/httpError';
import { promiser } from '@src/utils/promiser';

import * as S from './styles';

export const App = () => {
  const [user, setUser] = useRecoilState(userState);
  const [isLoading, setIsLoading] = useRecoilState(loadingState);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);

      const [data, error] = await promiser(httpClient.get<User>('/api/v1/users'));

      if (data) setUser(data?.data);

      setIsLoading(false);

      if (error instanceof HttpError && error.code === StatusCodes.UNAUTHORIZED) {
        console.error(error);
      } else if (error) {
        throw error;
      }
    };

    if (!user) {
      fetchUser();
    }
  }, [user, setUser, setIsLoading]);

  const handleLogout = async () => {
    setIsLoading(true);

    const [data, error] = await promiser(httpClient.post('/api/v1/auth/logout'));

    setIsLoading(false);

    if (data) setUser(null);

    if (error instanceof HttpError && error.code === StatusCodes.UNAUTHORIZED) {
      console.error(error);
    } else if (error) {
      throw error;
    }
  };

  return html`
    <${S.App}>
      <${Header} user=${user} onLogout=${handleLogout} />
      <${S.MainContent}>
        <${S.Backdrop} open=${isLoading}>
          <${CircularProgress} color="inherit" />
        <//>
        <${Routes}>
          <${Route}
            path="/"
            element=${html`
              <${S.HelloContainer}>
                <${Logo} />
                <p>Hello Vite + Preact!</p>
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
