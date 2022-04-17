import { Alert, CircularProgress, Snackbar } from '@mui/material';
import { html } from 'htm/preact';
import { useEffect } from 'preact/hooks';
import { Route, Routes } from 'react-router-dom';
import { useRecoilState, useRecoilValueLoadable } from 'recoil';

import { Header } from '@src/components/Header';
import { Login } from '@src/components/Login';
import { Logo } from '@src/components/Logo';
import { SignUp } from '@src/components/SignUp';
import { snackbarState } from '@src/store/snackbarState';
import { userInfoState } from '@src/store/userState';

import { Backdrop } from '../Backdrop';

import * as S from './styles';

export const App = () => {
  const userLoadable = useRecoilValueLoadable(userInfoState);
  const [snackbar, setSnackbar] = useRecoilState(snackbarState);

  const user = userLoadable.state === 'hasValue' ? userLoadable.contents : null;
  const error = userLoadable.state === 'hasError' ? userLoadable.contents : null;

  console.log(userLoadable.state);

  useEffect(() => {
    if (error) setSnackbar({ open: true, message: error.message, severity: 'error' });
  }, [setSnackbar, error]);

  const handleSnackbarClose = () => {
    setSnackbar({ open: false });
  };

  return html`
    <${S.App}>
      <${Snackbar} open=${snackbar.open} autoHideDuration=${3000} onClose=${handleSnackbarClose}>
        <${Alert}
          onClose=${handleSnackbarClose}
          severity=${snackbar.severity || 'info'}
          sx=${{ width: '100%', display: !snackbar.open && 'none' }}
        >
          ${snackbar.message}
        <//>
      <//>
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
